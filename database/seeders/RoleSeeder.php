<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Silber\Bouncer\BouncerFacade as Bouncer;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        Bouncer::role()->create([
            'name' => 'admin',
            'title' => 'Administrator',
        ]);

        Bouncer::role()->create([
            'name' => 'lecturer',
            'title' => 'Lecturer',
        ]);

        Bouncer::role()->create([
            'name' => 'student',
            'title' => 'Student',
        ]);

        Bouncer::role()->create([
            'name' => 'university',
            'title' => 'University',
        ]);

        // Create an admin user
        $admin = User::create([
            'id' => Str::uuid()->toString(),
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_type' => 'admin',
        ]);

        // Assign admin role
        Bouncer::assign('admin')->to($admin);

        // Give admin all abilities
        Bouncer::allow('admin')->everything();
        
        // Create student users with different universities and faculties
        $universities = [
            'Universiti Malaysia Pahang',
            'Universiti Malaya',
            'Universiti Sains Malaysia',
            'Universiti Putra Malaysia',
            'Universiti Teknologi Malaysia'
        ];
        
        $faculties = [
            'Faculty of Computing',
            'Faculty of Civil Engineering',
            'Faculty of Electrical Engineering',
            'Faculty of Business & Communication',
            'Faculty of Arts & Social Sciences'
        ];
        
        $majors = [
            'Computer Science',
            'Engineering',
            'Business',
            'Arts',
            'Biology'
        ];
        
        $levels = ['Undergraduate', 'Postgraduate'];
        
        // Create 30 student users
        for ($i = 1; $i <= 30; $i++) {
            $userId = Str::uuid()->toString();
            
            // Create user
            $user = User::create([
                'id' => $userId,
                'name' => 'Student ' . $i,
                'email' => 'student' . $i . '@example.com',
                'password' => Hash::make('password'),
                'role_type' => 'student',
            ]);
            
            // Assign student role
            Bouncer::assign('student')->to($user);
            
            // Create student profile with proper fields from the migration
            Student::create([
                'student_id' => Str::uuid()->toString(),
                'user_id' => $userId,
                'matric_no' => 'S' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'year' => rand(1, 4),
                'level' => $levels[array_rand($levels)],
                'gpa' => rand(20, 40) / 10, // Random GPA between 2.0 and 4.0
                'contact_number' => '01' . rand(1, 9) . rand(10000000, 99999999),
                'bio' => 'Student biography for student ' . $i,
                'faculty' => $faculties[array_rand($faculties)],
                'university' => $universities[array_rand($universities)],
                'major' => $majors[array_rand($majors)],
                'expected_graduate' => rand(2024, 2027),
            ]);
        }
    }
} 