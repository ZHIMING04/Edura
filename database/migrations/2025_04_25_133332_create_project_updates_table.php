<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('project_updates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->onDelete('cascade');
            $table->text('progress_description');
            $table->integer('progress_percentage');
            $table->text('milestones_completed')->nullable();
            $table->text('challenges_faced')->nullable();
            $table->text('resources_needed')->nullable();
            $table->text('accepted_resources')->nullable();
            $table->foreignUuid('updated_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('project_updates');
    }
}; 