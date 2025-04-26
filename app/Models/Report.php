<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Report extends Model
{
    use HasUuids;

    protected $primaryKey = 'report_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'generated_by',
        'staff_id',
        'university_id',
        'data'
    ];

    protected $casts = [
        'data' => 'array'
    ];

    // Relationships
    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function university()
    {
        return $this->belongsTo(University::class, 'university_id');
    }
}
