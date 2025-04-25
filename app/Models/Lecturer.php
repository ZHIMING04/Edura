<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Lecturer extends Model
{
    use HasUuids;

    protected $primaryKey = 'lecturer_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'lecturer_id',
        'user_id',
        'specialization',
        'contact_number',
        'linkedin',
        'bio',
        'faculty',
        'university'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Lecturer can view/manage reports
    public function reports()
    {
        return $this->hasMany(Report::class, 'viewed_by', 'lecturer_id');
    }
}