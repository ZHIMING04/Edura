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
use Illuminate\Contracts\Auth\MustVerifyEmail;

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
        $user = $request->user();
        
        // Get role from Bouncer roles
        $role = $user->roles()->first()?->name;
        $role = strtolower($role ?? $user->role_type);
        
        // Ensure role model exists
        $this->ensureRoleModelExists($user, $role);
        
        // Refresh user to get the latest data with the role loaded
        $user->refresh();
        $user->load($role, 'roles');
        
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Helper method to ensure that the appropriate role model exists
     */
    private function ensureRoleModelExists($user, $role): void
    {
        try {
            // Log the current state at the beginning
            Log::info('Checking if role model exists:', [
                'user_id' => $user->id,
                'role' => $role,
                'has_student' => $user->student ? true : false, 
                'has_lecturer' => $user->lecturer ? true : false,
                'has_university' => $user->university ? true : false
            ]);
            
            // Check if role model exists and create if missing
            switch ($role) {
                case 'student':
                    if (!$user->student) {
                        Log::info('Creating missing student profile for user:', ['user_id' => $user->id]);
                        $student = Student::create([
                            'student_id' => Str::uuid()->toString(),
                            'user_id' => $user->id,
                        ]);
                        Log::info('Student profile created:', ['student_id' => $student->student_id]);
                    }
                    break;
                
                case 'lecturer':
                    if (!$user->lecturer) {
                        Log::info('Creating missing lecturer profile for user:', ['user_id' => $user->id]);
                        try {
                            $lecturer = Lecturer::create([
                                'lecturer_id' => Str::uuid()->toString(),
                                'user_id' => $user->id,
                            ]);
                            Log::info('Lecturer profile created:', ['lecturer_id' => $lecturer->lecturer_id]);
                        } catch (\Exception $e) {
                            Log::error('Lecturer creation failed:', [
                                'error' => $e->getMessage(),
                                'trace' => $e->getTraceAsString()
                            ]);
                            throw $e;
                        }
                    }
                    break;
                
                case 'university':
                    if (!$user->university) {
                        Log::info('Creating missing university profile for user:', ['user_id' => $user->id]);
                        try {
                            $university = University::create([
                                'university_id' => Str::uuid()->toString(),
                                'user_id' => $user->id,
                                'name' => 'Universiti Malaysia Pahang',
                            ]);
                            Log::info('University profile created:', ['university_id' => $university->university_id]);
                        } catch (\Exception $e) {
                            Log::error('University creation failed:', [
                                'error' => $e->getMessage(),
                                'trace' => $e->getTraceAsString()
                            ]);
                            throw $e;
                        }
                    }
                    break;
            }
            
            // Log the final state
            $user->refresh();
            Log::info('Role model check complete:', [
                'user_id' => $user->id,
                'role' => $role,
                'has_student' => $user->student ? true : false, 
                'has_lecturer' => $user->lecturer ? true : false,
                'has_university' => $user->university ? true : false
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create role profile: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'role' => $role,
                'exception' => $e,
            ]);
        }
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            // Get role from Bouncer roles
            $role = $user->roles()->first()?->name;
            // Make sure we have a role value, fallback to role_type if needed
            $role = strtolower($role ?? $user->role_type ?? '');
            
            if (empty($role)) {
                return back()->with('error', 'No role assigned to user');
            }

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

            // Ensure role model exists before updating
            $this->ensureRoleModelExists($user, $role);

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
                default:
                    Log::warning('Unhandled role type for profile update', [
                        'user_id' => $user->id,
                        'role' => $role
                    ]);
                    return back()->with('error', 'Unsupported role type');
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
        try {
            Log::info('Updating lecturer profile:', [
                'user_id' => $request->user()->id,
                'request_data' => $request->all()
            ]);
            
            $validated = $request->validate([
                'department' => 'required|string|max:255',
                'specialization' => 'required|string|max:255',
                'faculty' => 'required|string|max:255',
                'university' => 'required|string|max:255',
                'contact_number' => 'nullable|string|max:255',
                'linkedin' => 'nullable|string|max:255',
                'bio' => 'nullable|string'
            ]);

            $lecturer = $request->user()->lecturer;
            if (!$lecturer) {
                Log::error('Lecturer record not found for user:', ['user_id' => $request->user()->id]);
                return back()->with('error', 'Lecturer profile not found.');
            }

            $lecturer->update($validated);
            
            Log::info('Lecturer profile updated:', [
                'lecturer_id' => $lecturer->lecturer_id,
                'updated_data' => $lecturer->fresh()->toArray()
            ]);

            return back()->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update lecturer profile:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Failed to update profile: ' . $e->getMessage());
        }
    }

    public function updateUniversity(Request $request): RedirectResponse
    {
        try {
            Log::info('Updating university profile:', [
                'user_id' => $request->user()->id,
                'request_data' => $request->all()
            ]);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'location' => 'nullable|string|max:255',
                'contact_email' => 'nullable|email|max:255',
                'website' => 'nullable|url|max:255',
                'contact_number' => 'nullable|string|max:20',
                'bio' => 'nullable|string'
            ]);
            
            $university = $request->user()->university;
            if (!$university) {
                Log::error('University record not found for user:', ['user_id' => $request->user()->id]);
                return back()->with('error', 'University profile not found.');
            }
            
            // Check if name is in the allowed list of values
            $allowedUniversityNames = [
                'Universiti Malaysia Pahang',
                'Universiti Malaysia Sabah',
                'Universiti Malaysia Terengganu',
                'Universiti Kebangsaan Malaysia',
                'Universiti Malaya',
                'Universiti Sains Malaysia',
                'Universiti Putra Malaysia',
                'Universiti Teknologi Malaysia',
                'Universiti Utara Malaysia',
                'Universiti Islam Antarabangsa Malaysia',
                'Universiti Pendidikan Sultan Idris',
                'Universiti Sains Islam Malaysia',
                'Universiti Teknologi MARA',
                'Universiti Malaysia Sarawak',
                'Universiti Teknikal Malaysia Melaka',
                'Universiti Malaysia Perlis',
                'Universiti Tun Hussein Onn Malaysia',
                'Universiti Sultan Zainal Abidin',
                'Universiti Pertahanan Nasional Malaysia',
                'Universiti Malaysia Kelantan'
            ];
            
            if (!in_array($validated['name'], $allowedUniversityNames)) {
                Log::warning('Invalid university name provided:', [
                    'user_id' => $request->user()->id,
                    'provided_name' => $validated['name']
                ]);
                return back()->with('error', 'Please select a valid university name from the list.');
            }
            
            $university->update($validated);
            
            Log::info('University profile updated:', [
                'university_id' => $university->university_id,
                'updated_data' => $university->fresh()->toArray()
            ]);
            
            return back()->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update university profile:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Failed to update profile: ' . $e->getMessage());
        }
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
