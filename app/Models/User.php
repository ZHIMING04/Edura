<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Silber\Bouncer\Database\HasRolesAndAbilities;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRolesAndAbilities,HasUuids;

    /**
     * The primary key type.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();
        
        // After a user is created, ensure their role model exists
        static::created(function ($user) {
            if (!empty($user->role_type)) {
                try {
                    switch ($user->role_type) {
                        case 'student':
                            if (!$user->student()->exists()) {
                                Student::create([
                                    'student_id' => Str::uuid()->toString(),
                                    'user_id' => $user->id,
                                ]);
                            }
                            break;
                        
                        case 'lecturer':
                            if (!$user->lecturer()->exists()) {
                                Lecturer::create([
                                    'lecturer_id' => Str::uuid()->toString(),
                                    'user_id' => $user->id,
                                ]);
                            }
                            break;
                        
                        case 'university':
                            if (!$user->university()->exists()) {
                                University::create([
                                    'university_id' => Str::uuid()->toString(),
                                    'user_id' => $user->id,
                                    'name' => 'Universiti Teknologi Malaysia',
                                ]);
                            }
                            break;
                    }
                } catch (\Exception $e) {
                    // Log the error but don't throw it 
                    Log::error('Failed to create role model in User boot method:', [
                        'user_id' => $user->id,
                        'role_type' => $user->role_type,
                        'error' => $e->getMessage()
                    ]);
                }
            }
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'role_type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function lecturer()
    {
        return $this->hasOne(Lecturer::class, 'user_id', 'id');
    }

    public function university()
    {
        return $this->hasOne(University::class, 'user_id', 'id');
    }

    public function admin()
    {
        return $this->hasOne(Admin::class, 'admin_id', 'id');
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id', 'id');
    }

    // Relationship with Created Events
    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'creator_id', 'id');
    }

    public function enrolledEvents()
    {
        return $this->belongsToMany(Event::class, 'enrollments', 'user_id', 'event_id')
                    ->using(Enrollment::class)
                    ->withPivot(['enrollment_id'])
                    ->withTimestamps();
    }

    // Add this method to get role name
    public function getRoleAttribute()
    {
        return $this->roles()->first()?->name ?? null;
    }
}
