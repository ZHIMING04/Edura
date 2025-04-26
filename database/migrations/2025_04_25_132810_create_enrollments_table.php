<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->uuid('enrollment_id')->primary();
            $table->foreignUuid('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
            $table->foreignUuid('event_id')
                  ->references('event_id')
                  ->on('events')
                  ->onDelete('cascade');
            $table->timestamps();

            // Prevent duplicate enrollments, but allow team enrollment
            $table->unique(['user_id', 'event_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('enrollments');
    }
};