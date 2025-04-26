<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->uuid('certificate_id')->primary();
            $table->uuid('event_id');
            $table->uuid('student_id');
            $table->uuid('template_id');
            $table->string('status')->default('issued');
            $table->timestamp('issue_date');
            $table->timestamp('expiry_date')->nullable();
            $table->enum('award_level', ['gold', 'silver', 'bronze'])->nullable();
            $table->json('certificate_data')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('event_id')
                  ->references('event_id')
                  ->on('events')
                  ->onDelete('cascade');

            $table->foreign('student_id')
                  ->references('student_id')
                  ->on('students')
                  ->onDelete('cascade');

            $table->foreign('template_id')
                  ->references('id')
                  ->on('certificate_templates')
                  ->onDelete('restrict');
        });
    }

    public function down()
    {
        Schema::dropIfExists('certificates');
    }
};