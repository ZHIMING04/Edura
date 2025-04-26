<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;
use App\Notifications\EventReminderNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class EnrollmentController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $user = auth()->user();
            return $this->handleIndividualEnrollment($event, $user);
        }
    

    private function handleIndividualEnrollment(Event $event, $user)
    {
        // Check if user is already enrolled
        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('event_id', $event->event_id)
            ->first();

        if ($existingEnrollment) {
            return back()->with('error', 'You are already enrolled in this event.');
        }

        // Check if event is full
        if ($event->enrolled_count >= $event->max_participants) {
            return back()->with('error', 'This event is already full.');
        }

        // Create enrollment
        $enrollment = new Enrollment();
        $enrollment->enrollment_id = Str::uuid();
        $enrollment->user_id = $user->id;
        $enrollment->event_id = $event->event_id;
        $enrollment->save();

        return back()->with('success', 'Successfully enrolled in the event.');
    }

    public function destroy(Event $event)
    {
        $user = auth()->user();

        return $this->handleIndividualUnenrollment($event, $user);
    }

    private function handleIndividualUnenrollment(Event $event, $user)
    {
        // Find the enrollment
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('event_id', $event->event_id)
            ->first();

        if (!$enrollment) {
            return back()->with('error', 'You are not enrolled in this event.');
        }

        // Check if the event is already ongoing or completed
        if ($event->status !== 'Upcoming') {
            return back()->with('error', 'Cannot unenroll from an ongoing or completed event.');
        }

        $enrollment->delete();

        return back()->with('success', 'Successfully unenrolled from the event.');
    }
} 