<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->uuid('report_id')->primary();
            $table->uuid('generated_by')->nullable();
            $table->uuid('university_id')->nullable();
            $table->json('data');
            $table->timestamps();

            $table->foreign('generated_by')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');

            $table->foreign('university_id')
                  ->references('university_id')
                  ->on('universities')
                  ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reports');
    }
};