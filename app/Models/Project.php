<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Project extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'type',
        'status',
        'priority',
        'start_date',
        'expected_end_date',
        'actual_end_date',
        'student_id',
        'supervisor_id',
        'progress_percentage',
        'score',
        'rating'
    ];

    protected $casts = [
        'start_date' => 'date',
        'expected_end_date' => 'date',
        'actual_end_date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function updates()
    {
        return $this->hasMany(ProjectUpdate::class);
    }

    public function getLatestUpdate()
    {
        return $this->updates()->latest()->first();
    }
} 