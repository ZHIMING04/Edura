<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Certificate extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'certificate_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'certificate_id',
        'event_id',
        'student_id',
        'template_id',
        'certificate_number',
        'status',
        'issue_date',
        'expiry_date',
        'certificate_data',
        'award_level'
    ];

    protected $casts = [
        'certificate_data' => 'array',
        'issue_date' => 'datetime',
        'expiry_date' => 'datetime',
        'award_level' => 'string'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->certificate_id = Str::uuid();
            $model->certificate_number = 'CERT-' . strtoupper(Str::random(8));
        });
    }

    // Relationship with Event
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    // Relationship with Student
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    public function template()
    {
        return $this->belongsTo(CertificateTemplate::class, 'template_id', 'id');
    }

    public function isValid()
    {
        return $this->status === 'issued' && 
               ($this->expiry_date === null || $this->expiry_date->isFuture());
    }
}
