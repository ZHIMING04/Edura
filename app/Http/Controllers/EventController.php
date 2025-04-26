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
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
            'is_external' => 'required|boolean',
        ];

        // Add registration_url validation if event is external
        if ($request->boolean('is_external')) {
            $validationRules['registration_url'] = 'required|url';
        }

        $validated = $request->validate($validationRules);

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
            'location' => $validated['location'],
            'description' => $validated['description'],
            'status' => $status,
            'creator_id' => auth()->id(),
            'is_external' => $validated['is_external'],
            'registration_url' => $validated['registration_url'] ?? null,
            'event_type' => 'Workshop', // Default value
            'category' => 'Networking', // Default value
            'time' => Carbon::now()->format('H:i:s'), // Default value
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
        // Check if user is the creator
        if ($event->creator_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Validation rules
        $validationRules = [
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'status' => 'required|in:Upcoming,Ongoing,Completed',
            'is_external' => 'required|boolean',
        ];

        // Add conditional validation rules
        if ($request->boolean('is_external')) {
            $validationRules['registration_url'] = 'required|url';
        } else {
            $validationRules['max_participants'] = 'required|integer|min:1';
        }

        $validated = $request->validate($validationRules);

        // Handle data updates
        $eventData = [
            'title' => $validated['title'],
            'date' => $validated['date'],
            'description' => $validated['description'],
            'location' => $validated['location'],
            'status' => $validated['status'],
            'is_external' => $validated['is_external'],
        ];

        // Add conditional fields
        if ($validated['is_external']) {
            $eventData['registration_url'] = $validated['registration_url'];
        } else {
            $eventData['max_participants'] = $validated['max_participants'];
        }

        // Update the event
        $event->update($eventData);

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