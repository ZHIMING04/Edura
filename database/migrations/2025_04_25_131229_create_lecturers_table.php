<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lecturers', function (Blueprint $table) {
            $table->uuid('lecturer_id')->primary();
            $table->foreignUuid('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->string('specialization')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('bio')->nullable();
            $table->string('linkedin')->nullable();
            $table->enum('university', [
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
            ])->nullable();
            $table->enum('faculty', [
                'Faculty of Computing',
                'Faculty of Civil Engineering',
                'Faculty of Electrical Engineering',
                'Faculty of Chemical Engineering',
                'Faculty of Mechanical Engineering',
                'Faculty of Industrial Sciences & Technology',
                'Faculty of Manufacturing Engineering',
                'Faculty of Technology Engineering',
                'Faculty of Business & Communication',
                'Faculty of Industrial Management',
                'Faculty of Applied Sciences',
                'Faculty of Science & Technology',
                'Faculty of Medicine',
                'Faculty of Pharmacy',
                'Faculty of Dentistry',
                'Faculty of Arts & Social Sciences',
                'Faculty of Education',
                'Faculty of Economics & Administration',
                'Faculty of Law',
                'Faculty of Built Environment',
                'Faculty of Agriculture',
                'Faculty of Forestry',
                'Faculty of Veterinary Medicine',
                'Faculty of Islamic Studies',
                'Faculty of Sports Science',
                'Faculty of Creative Technology',
                'Faculty of Music',
                'Faculty of Architecture & Design',
                'Faculty of Hotel & Tourism Management',
                'Faculty of Health Sciences',
                'Faculty of Defence Studies & Management'
            ])->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('lecturers');
    }
};
