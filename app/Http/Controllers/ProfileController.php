<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Student;
use App\Models\Lecturer;
use App\Models\University;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Display the user's profile page based on their role.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $role = $user->roles()->first()?->name;
        
        if (!$role) {
            return redirect()->route('role.selection');
        }

        // Map roles to their respective profile components
        $roleComponents = [
            'student' => 'Profile/Student/Profile',
            'lecturer' => 'Profile/Lecturer/Profile',
            'university' => 'Profile/University/Profile',
        ];

        if (!isset($roleComponents[$role])) {
            abort(403, 'Unauthorized role');
        }

        return Inertia::render($roleComponents[$role], [
            'auth' => [
                'user' => array_merge($user->toArray(), [
                    'notifications' => $user->notifications,
                    $role => $user->load($role)[$role]
                ])
            ]
        ]);
    }

    /**
     * Show the profile editing form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'user' => $request->user()->load(['department_staff' => function($query) {
                $query->select('staff_id', 'user_id', /* other fields */);
            }])
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {

        try {
            $user = $request->user();
            $role = strtolower($user->role);

            // Remove common validation since these fields might not always be updated
            // Only validate what's being updated
            $validationRules = [];
            if ($request->has('name')) {
                $validationRules['name'] = 'required|string|max:255';
            }
            if ($request->has('email')) {
                $validationRules['email'] = 'required|email|max:255|unique:users,email,' . $user->id;
            }

            if (!empty($validationRules)) {
                $request->validate($validationRules);

                // Only update user model if name or email is provided
                $userUpdates = array_intersect_key($request->all(), array_flip(['name', 'email']));
                if (!empty($userUpdates)) {
                    $user->update($userUpdates);
                }
            }

            // Update role-specific profile
            switch ($role) {
                case 'student':
                    $this->updateStudentProfile($user, $request);
                    break;
                case 'lecturer':
                    $this->updateLecturerProfile($user, $request);
                    break;
                case 'university':
                    $this->updateUniversityProfile($user, $request);
                    break;
            }


            return back()->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            Log::error('Profile update failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Failed to update profile: ' . $e->getMessage());
        }
    }

    // Private methods for updating role-specific profiles
    private function updateStudentProfile($user, $request): void
    {
        Log::info('Updating student profile:', [
            'user_id' => $user->id,
            'request_data' => $request->all()
        ]);

        $request->validate([
            'matric_no' => 'nullable|string',
            'year' => 'nullable|integer',
            'level' => 'nullable|string',
            'gpa' => 'nullable|numeric',
            'contact_number' => 'nullable|string',
            'bio' => 'nullable|string',
            'faculty' => 'nullable|string',
            'university' => 'nullable|string',
            'major' => 'nullable|string',
            'expected_graduate' => 'nullable|integer'
        ]);

        try {
            $student = $user->student;
            if (!$student) {
                Log::error('Student record not found for user:', ['user_id' => $user->id]);
                throw new \Exception('Student record not found.');
            }

            $student->update($request->only([
                'matric_no', 'year', 'level','gpa', 'contact_number', 
                'bio', 'faculty', 'university','major', 'expected_graduate'
            ]));

            Log::info('Student profile updated successfully:', [
                'student_id' => $student->student_id,
                'updated_data' => $student->fresh()->toArray()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update student profile:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function updateLecturerProfile($user, $request): void
    {
        $request->validate([
            'specialization' => 'required|string',
            'faculty' => 'required|string',
        ]);

        $user->lecturer()->update($request->only([
            'department', 'specialization', 'contact_number', 'bio', 'linkedin', 'faculty','university'
        ]));
    }

    private function updateUniversityProfile($user, $request): void
    {
        try {
            $university = $user->university;
            
            if (!$university) {
                throw new \Exception('University profile not found.');
            }

            // Validate the incoming data
            $validated = $request->validate([
                'name' => 'nullable|string|max:255',
                'location' => 'nullable|string|max:255',
                'contact_email' => 'nullable|email|max:255',
                'website' => 'nullable|url|max:255',
                'contact_number' => 'nullable|string|max:20',
                'bio' => 'nullable|string'
            ]);

            // Update using query builder to ensure it saves
            DB::table('universities')
                ->where('university_id', $university->university_id)
                ->update([
                    'name' => $validated['name'],
                    'location' => $validated['location'],
                    'contact_email' => $validated['contact_email'],
                    'website' => $validated['website'],
                    'contact_number' => $validated['contact_number'],
                    'bio' => $validated['bio'],
                    'updated_at' => now()
                ]);

            Log::info('University profile updated:', [
                'university_id' => $university->university_id,
                'updated_data' => $validated
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update university profile:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function updateStudent(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_number' => 'nullable|string|max:255',
            'year' => 'nullable|integer',
            'level' => 'nullable|string|max:255',
            'gpa' => 'nullable|numeric',
            'contact_number' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:255',
            'faculty' => 'nullable|string|max:255',
            'university' => 'nullable|string|max:255',
            'major' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'bio' => 'nullable|string'
        ]);

        return $this->updateRoleProfile($request->user()->student, $validated);
    }

    public function updateLecturer(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'department' => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'linkedin' => 'nullable|string|max:255',
            'bio' => 'nullable|string'
        ]);

        return $this->updateRoleProfile($request->user()->lecturer, $validated);
    }

    public function updateUniversity(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'university_name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'description' => 'nullable|string'
        ]);

        return $this->updateRoleProfile($request->user()->university, $validated);
    }

    /**
     * Helper method to handle profile updates
     */
    private function updateRoleProfile($profile, array $validated): RedirectResponse
    {
        try {
            if (!$profile) {
                return back()->with('error', 'Profile not found.');
            }

            $profile->update($validated);
            return back()->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update profile: ' . $e->getMessage());
        }
    }
}
