<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Silber\Bouncer\Database\HasRolesAndAbilities;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
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
