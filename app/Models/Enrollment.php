<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Str;

class Enrollment extends Pivot
{
    protected $primaryKey = 'enrollment_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'enrollments';

    protected $fillable = [
        'enrollment_id',
        'user_id',
        'event_id',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    // Relationship with User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Relationship with Event
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }
}
