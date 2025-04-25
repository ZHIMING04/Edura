<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('certificate_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('event_id');
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('body_text')->nullable();
            $table->string('background_image')->nullable();
            $table->string('signature_image')->nullable();
            $table->json('layout_settings')->nullable();
            $table->boolean('is_participant_template')->default(true);
            $table->timestamps();

            $table->foreign('event_id')
                  ->references('event_id')
                  ->on('events')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('certificate_templates');
    }
}; 