<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProjectUpdate extends Model
{
    use HasFactory, HasUuids;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'project_id',
        'progress_description',
        'progress_percentage',
        'milestones_completed',
        'challenges_faced',
        'resources_needed',
        'accepted_resources',
        'updated_by',
    ];

    public function getMilestonesCompletedArrayAttribute()
    {
        return $this->milestones_completed ? explode(',', $this->milestones_completed) : [];
    }

    public function getChallengesFacedArrayAttribute()
    {
        return $this->challenges_faced ? explode(',', $this->challenges_faced) : [];
    }

    public function getResourcesNeededArrayAttribute()
    {
        return $this->resources_needed ? explode(',', $this->resources_needed) : [];
    }

    public function getAcceptedResourcesArrayAttribute()
    {
        return $this->accepted_resources ? explode(',', $this->accepted_resources) : [];
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
} 