<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Lecturer;
use App\Models\University;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Silber\Bouncer\BouncerFacade as Bouncer;
use Illuminate\Support\Str;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_type' => ['required', 'string', 'in:student,lecturer,university'],
        ]);

        // Create user account
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_type' => $request->role_type,
        ]);

        Log::info('User created during registration:', [
            'user_id' => $user->id,
            'email' => $user->email,
            'role_type' => $user->role_type
        ]);

        // Assign role based on role_type
        Bouncer::assign($request->role_type)->to($user);
        
        Log::info('Bouncer role assigned:', [
            'user_id' => $user->id, 
            'role' => $request->role_type
        ]);

        // Create the specific role model based on role_type
        try {
            switch ($request->role_type) {
                case 'student':
                    $student = Student::create([
                        'student_id' => Str::uuid()->toString(),
                        'user_id' => $user->id,
                    ]);
                    Log::info('Student profile created during registration:', [
                        'user_id' => $user->id,
                        'student_id' => $student->student_id
                    ]);
                    break;
                
                case 'lecturer':
                    try {
                        $lecturer = Lecturer::create([
                            'lecturer_id' => Str::uuid()->toString(),
                            'user_id' => $user->id,
                        ]);
                        Log::info('Lecturer profile created during registration:', [
                            'user_id' => $user->id,
                            'lecturer_id' => $lecturer->lecturer_id
                        ]);
                    } catch (\Exception $inner) {
                        Log::error('Lecturer creation failed during registration:', [
                            'user_id' => $user->id,
                            'error' => $inner->getMessage(),
                            'trace' => $inner->getTraceAsString()
                        ]);
                        throw $inner;
                    }
                    break;
                
                case 'university':
                    try {
                        $university = University::create([
                            'university_id' => Str::uuid()->toString(),
                            'user_id' => $user->id,
                            'name' => 'Universiti Malaysia Pahang', // Use a valid enum value from the allowed list
                        ]);
                        Log::info('University profile created during registration:', [
                            'user_id' => $user->id,
                            'university_id' => $university->university_id
                        ]);
                    } catch (\Exception $inner) {
                        Log::error('University creation failed during registration:', [
                            'user_id' => $user->id,
                            'error' => $inner->getMessage(),
                            'trace' => $inner->getTraceAsString()
                        ]);
                        throw $inner;
                    }
                    break;
            }
            
            // Verify the role model was created
            $user->refresh();
            $hasRoleModel = match($request->role_type) {
                'student' => $user->student !== null,
                'lecturer' => $user->lecturer !== null,
                'university' => $user->university !== null,
                default => false
            };
            
            Log::info('Role model creation verification:', [
                'user_id' => $user->id,
                'role_type' => $request->role_type,
                'has_role_model' => $hasRoleModel
            ]);
            
            if (!$hasRoleModel) {
                Log::warning('Role model was not created during registration', [
                    'user_id' => $user->id,
                    'role_type' => $request->role_type
                ]);
            }
            
        } catch (\Exception $e) {
            Log::error('Failed to create role profile during registration: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'role_type' => $request->role_type,
                'exception' => $e,
            ]);
            // Continue with registration even if role model creation fails
            // The ProfileController::ensureRoleModelExists method will try to fix it later
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
