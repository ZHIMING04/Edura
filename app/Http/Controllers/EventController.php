<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    public function create()
    {    
        return Inertia::render('Events/Create');
    }

    public function store(Request $request)
    {
        $validationRules = [
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'event_type' => 'required|in:Workshop,Competition,Seminar',
            'category' => 'required|in:Ptching, Marketing, Finance, Leadership, Networking',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_external' => 'required|boolean',
        ];

        // Add validation rules based on event type (external or internal)
        if ($request->boolean('is_external')) {
            $validationRules = array_merge($validationRules, [
                'registration_url' => 'required|url',
                'organizer_name' => 'required|string|max:255',
                'organizer_website' => 'nullable|url',
            ]);
        } else {
            $validationRules = array_merge($validationRules, [
                'max_participants' => 'required|integer|min:1',
                'registration_url' => 'nullable',
                'organizer_name' => 'nullable',
                'organizer_website' => 'nullable',
            ]);
            
            // Add team event specific validation if it's a team event
            if ($request->boolean('is_team_event')) {
                $validationRules = array_merge($validationRules, [
                    'min_team_members' => 'required|integer|min:2',
                    'max_team_members' => 'required|integer|min:2|gte:min_team_members',
                ]);
            }
        }

        $validated = $request->validate($validationRules);

        // Handle image upload
        $coverImagePath = null;
        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/EventCover'), $filename);
            $coverImagePath = 'images/EventCover/' . $filename;
        }

        // Calculate initial status based on event date
        $eventDate = Carbon::parse($validated['date'])->startOfDay();
        $today = Carbon::now()->startOfDay();

        if ($eventDate->equalTo($today)) {
            $status = 'Ongoing';
        } else if ($eventDate->greaterThan($today)) {
            $status = 'Upcoming';
        } else {
            $status = 'Completed';
        }

        // Prepare event data
        $eventData = [
            'event_id' => Str::uuid()->toString(),
            'title' => $validated['title'],
            'date' => $validated['date'],
            'time' => Carbon::parse($validated['time'])->format('H:i:s'),
            'location' => $validated['location'],
            'description' => $validated['description'],
            'status' => $status,
            'event_type' => $validated['event_type'],
            'category' => $validated['category'],
            'creator_id' => auth()->id(),
            'cover_image' => $coverImagePath,
            'is_external' => $validated['is_external'],
            'registration_url' => $validated['registration_url'] ?? null,
            'organizer_name' => $validated['organizer_name'] ?? null,
            'organizer_website' => $validated['organizer_website'] ?? null,
        ];

        // Add non-external event specific fields
        if (!$validated['is_external']) {
            $eventData['max_participants'] = $validated['max_participants'];
            $eventData['enrolled_count'] = 0;
        }

        $event = Event::create($eventData);

        return redirect()->route('events.index')
            ->with('message', 'Event created successfully');
    }

    public function index()
    {
        $user = auth()->user();
        
        $events = Event::with(['creator'])
            ->latest()
            ->paginate(12)
            ->through(function ($event) use ($user) {
                $event->is_enrolled = Enrollment::where('user_id', $user->id)
                    ->where('event_id', $event->event_id)
                    ->exists();
                // Format the time
                $event->formatted_time = Carbon::parse($event->time)->format('g:i A');
                return $event;
            });

        return Inertia::render('Events/Index', [
            'events' => $events,
        ]);
    }

    public function myEvents()
    {
        $user = auth()->user();
        
        // Get events organized by the user
        $organizedEvents = Event::where('creator_id', $user->id)
            ->with('creator')
            ->get()
            ->map(function ($event) {
                // Calculate and add status to each event
                $event->status = $this->calculateEventStatus($event);
                $event->enrolled_count = $event->enrolledUsers()->count();
                return $event;
            });
        
        // Get events the user is enrolled in
        $enrolledEvents = $user->enrolledEvents()
            ->with('creator')
            ->get()
            ->map(function ($event) use ($user) {
                // Calculate and add status to each event
                $event->status = $this->calculateEventStatus($event);
                return $event;
            });
        
        return Inertia::render('Events/MyEvents', [
            'organizedEvents' => $organizedEvents,
            'enrolledEvents' => $enrolledEvents,
        ]);
    }

    public function edit(Event $event)
    {
        // Check if user is the creator
        if ($event->creator_id !== auth()->id()) {
            abort(403);
        }

        // Ensure the cover_image path is correct
        if ($event->cover_image) {
            // Make sure the path is relative to public directory
            $event->cover_image = str_replace('public/', '', $event->cover_image);
        }

        return Inertia::render('Events/Edit', [
            'event' => $event
        ]);
    }

    public function update(Request $request, Event $event)
    {

        // Basic validation rules
        $commonRules = [
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'event_type' => 'required|in:Workshop,Competition,Seminar',
            'category' => 'required|in:Ptching, Marketing, Finance, Leadership, Networking',
            'status' => 'required|in:Upcoming,Ongoing,Completed',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_external' => 'required|boolean',
            'is_team_event' => 'required|boolean',
        ];

        // Add specific rules based on event type
        if ($request->boolean('is_external')) {
            $specificRules = [
                'registration_url' => 'required|url',
                'organizer_name' => 'required|string|max:255',
                'organizer_website' => 'nullable|url',
            ];
        } else {
            $specificRules = [
                'max_participants' => 'required|integer|min:1',
                'registration_url' => 'nullable',
                'organizer_name' => 'nullable',
                'organizer_website' => 'nullable',
            ];
        }

        $validated = $request->validate(array_merge($commonRules, $specificRules));

        // Start with validated data
        $dataToUpdate = $validated;

        // Handle image upload if provided
        if ($request->hasFile('cover_image')) {
            // Delete old image if exists
            if ($event->cover_image) {
                Storage::delete($event->cover_image);
            }
            
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/EventCover'), $filename);
            $dataToUpdate['cover_image'] = 'images/EventCover/' . $filename;
        } else {
            // Remove cover_image from update data if no new image is uploaded
            unset($dataToUpdate['cover_image']);
        }

        // Format time
        $dataToUpdate['time'] = Carbon::parse($validated['time'])->format('H:i:s');

        // Update the event
        $event->update($dataToUpdate);

        return redirect()->route('events.my-events')
            ->with('message', 'Event updated successfully');
    }

    public function dashboard()
    {
        $user = auth()->user();
        
        $stats = [
            'totalEvents' => Event::count(),
            'upcomingEvents' => Event::where('date', '>', now())->count(),
            'myEvents' => Event::where('creator_id', $user->id)->count(),
            'enrolledEvents' => $user->enrollments()->count(),
        ];

        $recentEvents = Event::with(['creator', 'enrollments'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($event) use ($user) {
                $event->formatted_time = Carbon::parse($event->time)->format('g:i A');
                $event->is_enrolled = $event->enrollments->contains('user_id', $user->id);
                return $event;
            });

        return Inertia::render('Dashboard', [
            'abilities' => [
                'isStudent' => $user->can('view-studentdashboard'),
                'isLecturer' => $user->can('view-lecturerdashboard'),
                'isUniversity' => $user->can('view-universitydashboard'),
            ],
            'currentRole' => $user->role,
            'stats' => $stats,
            'recentEvents' => $recentEvents
        ]);
    }

    private function calculateEventStatus($event)
    {
        $eventDate = Carbon::parse($event->date)->startOfDay();
        $today = Carbon::now()->startOfDay();

        if ($event->status === 'Completed') {
            return 'Completed';
        } else if ($eventDate->equalTo($today)) {
            return 'Ongoing';
        } else if ($eventDate->greaterThan($today)) {
            return 'Upcoming';
        } else {
            return 'Completed';
        }
    }

    public function getEnrolledUsers(Event $event)
    {   
        // Regular individual enrollments
        $enrolledUsers = $event->enrolledUsers()
            ->select('users.id', 'users.name', 'users.email')
            ->get();

        return response()->json([
            'users' => $enrolledUsers
        ]);
    }
} 