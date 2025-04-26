<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $primaryKey = 'event_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'event_id',
        'title',
        'date',
        'time',
        'location',
        'description',
        'max_participants',
        'enrolled_count',
        'status',
        'event_type',
        'creator_id',
        'cover_image',
        'category',
        'is_external',
        'registration_url',
        'organizer_name',
        'organizer_website',
    ];

    protected $appends = ['enrolled_count', 'is_enrolled'];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime',
        'max_participants' => 'integer',
        'status' => 'string',
        'event_type' => 'string',
        'is_external' => 'boolean',
        'category' => 'string',
    ];

    protected static function booted()
    {
        static::retrieved(function ($event) {
            $event->updateStatus();
        });
    }

    public function updateStatus()
    {
        $eventDate = Carbon::parse($this->date)->startOfDay();
        $today = Carbon::now()->startOfDay();
        $newStatus = null;

        if ($eventDate->equalTo($today)) {
            $newStatus = 'Ongoing';
        } else if ($eventDate->greaterThan($today)) {
            $newStatus = 'Upcoming';
        } else {
            $newStatus = 'Completed';
        }

        // Only update if status has changed
        if ($newStatus !== $this->status) {
            $this->status = $newStatus;
            $this->saveQuietly();
        }
    }

    public function saveQuietly(array $options = [])
    {
        return static::withoutEvents(function () use ($options) {
            return $this->save($options);
        });
    }

    // Add this method to get the enrollment count
    public function getEnrolledCountAttribute()
    {
        if ($this->is_external) {
            return null;
        } else {
            return $this->enrollments()->count();
        }
    }

    // Check if current user is enrolled
    public function getIsEnrolledAttribute()
    {
        if (!auth()->check()) return false;
        
        $userId = auth()->id();
        
        // Check for direct enrollment
        $directEnrollment = $this->enrollments()
            ->where('user_id', $userId)
            ->exists();
            
        if ($directEnrollment) return true;
        
        return false;
    }

    // Relationship with User (creator)
    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    // Relationship with Enrollments
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'event_id', 'event_id');
    }

    // Relationship with Students through Enrollments
    public function students()
    {
        return $this->belongsToMany(Student::class, 'enrollments', 'event_id', 'student_id')
                    ->using(Enrollment::class)
                    ->withPivot('status', 'enrollment_id')
                    ->withTimestamps();
    }

    // Relationship with Certificates
    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'event_id', 'event_id');
    }

    public function enrolledUsers()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'event_id', 'user_id')
                    ->using(Enrollment::class)
                    ->withPivot('enrollment_id')
                    ->withTimestamps();
    }

    // Add new method to check if event is external
    public function isExternal()
    {
        return $this->is_external;
    }

    public function certificateTemplates()
    {
        return $this->hasMany(CertificateTemplate::class, 'event_id', 'event_id');
    }
}
