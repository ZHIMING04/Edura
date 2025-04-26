<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CertificateTemplate extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'event_id',
        'title',
        'subtitle',
        'body_text',
        'background_image',
        'signature_image',
        'layout_settings',
        'is_participant_template'
    ];

    protected $casts = [
        'layout_settings' => 'array',
        'is_participant_template' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->id = $model->id ?? (string) Str::uuid();
        });
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'template_id', 'id');
    }
} 