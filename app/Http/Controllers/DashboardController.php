<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Redirect;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $role = $user->roles()->first()?->name;
        
        // If user has no role, redirect to role selection
        if (!$role) {
            return Redirect::route('role.selection');
        }
        
        // Check if profile is incomplete
        if ($this->isProfileIncomplete($user, $role)) {
            return Redirect::route('profile.completion')->with('warning', 'Please complete your profile information.');
        }

        $stats = [
            'totalEvents' => Event::count(),
            'upcomingEvents' => Event::where('date', '>', now())->count(),
            'myEvents' => Event::where('creator_id', $user->id)->count(),
            'enrolledEvents' => $user->enrolledEvents()->count(),
        ];

        $recentEvents = Event::with(['creator', 'enrollments'])
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($event) use ($user) {
                $data = [
                    ...$event->toArray(),
                    'formatted_time' => Carbon::parse($event->time)->format('g:i A'),
                    'is_enrolled' => $event->enrollments->contains('user_id', $user->id),
                    'creator' => $event->creator,
                    'enrollments' => $event->enrollments
                ];
                return $data;
            });


        return Inertia::render('Dashboard', [
            'abilities' => [
                'isStudent' => $user->isA('student'),
                'isLecturer' => $user->isA('lecturer'),
                'isUniversity' => $user->isA('university')
            ],
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles()->get()->map(function($role) {
                        return [
                            'name' => $role->name,
                            'title' => $role->title
                        ];
                    }),
                    'notifications' => $user->notifications
                ]
            ],
            'currentRole' => $role,
            'stats' => $stats,
            'recentEvents' => $recentEvents,
        ]);
    }
    
    /**
     * Check if user's profile is incomplete based on role
     */
    private function isProfileIncomplete($user, $role)
    {
        // If this is a first-time visit after role selection
        if (session()->has('role_selected') && session()->get('role_selected') === true) {
            session()->forget('role_selected');
            return true;
        }
        
        // Check if profile model exists
        if (!$user->{$role}) {
            return true;
        }
        
        // Define required fields per role
        $requiredFields = [
            'student' => ['matric_no', 'faculty', 'university'],
            'lecturer' => ['specialization', 'faculty', 'university'],
            'university' => ['name', 'location', 'contact_email'],
        ];
        
        // Check if required fields are filled
        if (isset($requiredFields[$role])) {
            $profile = $user->{$role};
            foreach ($requiredFields[$role] as $field) {
                if (empty($profile->{$field}) || $profile->{$field} === 'Not Set') {
                    return true;
                }
            }
        }
        
        return false;
    }
}