<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
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
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_type' => 'admin',
        ]);

        // Assign admin role
        Bouncer::assign('admin')->to($admin);

        // Give admin all abilities
        Bouncer::allow('admin')->everything();
    }
} 