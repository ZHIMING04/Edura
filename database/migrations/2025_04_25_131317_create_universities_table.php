<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('universities', function (Blueprint $table) {
            $table->uuid('university_id')->primary();
            $table->foreignUuid('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->enum('name', [
                'Universiti Malaysia Pahang',
                'Universiti Malaysia Sabah',
                'Universiti Malaysia Terengganu',
                'Universiti Kebangsaan Malaysia',
                'Universiti Malaya',
                'Universiti Sains Malaysia',
                'Universiti Putra Malaysia',
                'Universiti Teknologi Malaysia',
                'Universiti Utara Malaysia',
                'Universiti Islam Antarabangsa Malaysia',
                'Universiti Pendidikan Sultan Idris',
                'Universiti Sains Islam Malaysia',
                'Universiti Teknologi MARA',
                'Universiti Malaysia Sarawak',
                'Universiti Teknikal Malaysia Melaka',
                'Universiti Malaysia Perlis',
                'Universiti Tun Hussein Onn Malaysia',
                'Universiti Sultan Zainal Abidin',
                'Universiti Pertahanan Nasional Malaysia',
                'Universiti Malaysia Kelantan'
            ]);
            $table->string('location')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('website')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('bio')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('universities');
    }
};