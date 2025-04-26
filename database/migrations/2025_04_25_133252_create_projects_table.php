<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->enum('type', ['individual', 'team']);
            $table->enum('status', ['planning', 'in_progress', 'completed', 'on_hold']);
            $table->enum('priority', ['low', 'medium', 'high', 'critical']);
            $table->date('start_date');
            $table->date('expected_end_date');
            $table->date('actual_end_date')->nullable();
            $table->integer('progress_percentage')->default(0);
            $table->integer('score')->default(0);
            $table->integer('rating')->default(0);
            $table->foreignUuid('student_id')->nullable()->references('student_id')->on('students')->onDelete('set null');
            $table->foreignUuid('supervisor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }
}; 