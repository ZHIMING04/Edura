<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'admins';
    protected $primaryKey = 'admin_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'admin_id', 'id');
    }

    // Admin can review/manage reports
    public function reports()
    {
        return $this->hasMany(Report::class, 'reviewed_by', 'admin_id');
    }
}