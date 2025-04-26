<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('event_id')->primary();
            $table->string('title');
            $table->date('date');
            $table->time('time');
            $table->string('location');
            $table->text('description');
            $table->integer('max_participants')->nullable();
            $table->integer('enrolled_count')->default(0)->nullable();
            $table->enum('status', ['Upcoming', 'Ongoing', 'Completed']);
            $table->enum('event_type', ['Workshop', 'Competition', 'Seminar']);
            $table->enum('category',['Pitching','Finance','Marketing','Leadership','Networking']);
            $table->uuid('creator_id');
            $table->string('cover_image')->nullable();
            $table->boolean('is_external')->default(false);
            $table->string('registration_url')->nullable();
            $table->string('organizer_name')->nullable();
            $table->string('organizer_website')->nullable();
            $table->timestamps();

            $table->foreign('creator_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
};