<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasUuids, HasFactory;

    protected $primaryKey = 'student_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'student_id',
        'user_id',
        'matric_no',
        'year',
        'level',
        'gpa',
        'contact_number',
        'bio',
        'faculty',
        'university',
        'major',
        'expected_graduate',
    ];

    protected $casts = [
        'year' => 'integer',
        'gpa' => 'float',
        'expected_graduate' => 'integer',
        'level' => 'string',
        'faculty' => 'string',
        'university' => 'string',
        'major' => 'string',
    ];

    // Ensure timestamps are enabled
    public $timestamps = true;

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            Log::info('Creating new student record:', [
                'attributes' => $model->getAttributes(),
                'fillable' => $model->getFillable(),
                'dirty' => $model->getDirty()
            ]);

            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });

        static::created(function ($model) {
            Log::info('Student record created:', [
                'student_id' => $model->student_id,
                'attributes' => $model->getAttributes()
            ]);
        });

        static::updating(function ($model) {
            Log::info('Updating student record:', [
                'student_id' => $model->student_id,
                'changes' => $model->getDirty(),
                'original' => $model->getOriginal()
            ]);
        });

        static::updated(function ($model) {
            Log::info('Student record updated:', [
                'student_id' => $model->student_id,
                'attributes' => $model->getAttributes()
            ]);
        });

        static::saving(function ($model) {
            Log::info('Before saving student record:', [
                'attributes' => $model->getAttributes(),
                'dirty' => $model->getDirty()
            ]);
        });

        static::saved(function ($model) {
            Log::info('After saving student record:', [
                'attributes' => $model->getAttributes()
            ]);
        });
    }

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship with Enrollments
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id', 'student_id');
    }

    // Relationship with Events through Enrollments
    public function events()
    {
        return $this->belongsToMany(Event::class, 'enrollments', 'student_id', 'event_id')
                    ->using(Enrollment::class)
                    ->withPivot('status', 'enrollment_id')
                    ->withTimestamps();
    }

    // Relationship with Events (as creator)
    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'creator_id', 'student_id');
    }

    // Relationship with Certificates
    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'student_id', 'student_id');
    }

    // Get full university name
    public function getUniversityNameAttribute()
    {
        $universities = [
            'UMP' => 'Universiti Malaysia Pahang',
            'UMS' => 'Universiti Malaysia Sabah',
            'UMT' => 'Universiti Malaysia Terengganu',
            'UKM' => 'Universiti Kebangsaan Malaysia',
            'UM' => 'Universiti Malaya',
            'USM' => 'Universiti Sains Malaysia',
            'UPM' => 'Universiti Putra Malaysia',
            'UTM' => 'Universiti Teknologi Malaysia',
            'UUM' => 'Universiti Utara Malaysia',
            'UIAM' => 'Universiti Islam Antarabangsa Malaysia',
            'UPSI' => 'Universiti Pendidikan Sultan Idris',
            'USIM' => 'Universiti Sains Islam Malaysia',
            'UiTM' => 'Universiti Teknologi MARA',
            'UNIMAS' => 'Universiti Malaysia Sarawak',
            'UTeM' => 'Universiti Teknikal Malaysia Melaka',
            'UniMAP' => 'Universiti Malaysia Perlis',
            'UTHM' => 'Universiti Tun Hussein Onn Malaysia',
            'UniSZA' => 'Universiti Sultan Zainal Abidin',
            'UPNM' => 'Universiti Pertahanan Nasional Malaysia',
            'UMK' => 'Universiti Malaysia Kelantan'
        ];

        return $universities[$this->university] ?? $this->university;
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'student_id', 'student_id');
    }
}
