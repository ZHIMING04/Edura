<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('abilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title')->nullable();
            $table->foreignId('entity_id')->nullable();
            $table->string('entity_type')->nullable();
            $table->boolean('only_owned')->default(false);
            $table->json('options')->nullable();
            $table->integer('scope')->nullable()->index();
            $table->timestamps();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title')->nullable();
            $table->integer('scope')->nullable()->index();
            $table->timestamps();

            $table->unique(['name', 'scope']);
        });

        Schema::create('assigned_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('entity_id');
            $table->string('entity_type');
            $table->foreignId('restricted_to_id')->nullable();
            $table->string('restricted_to_type')->nullable();
            $table->integer('scope')->nullable()->index();

            $table->index(['entity_id', 'entity_type', 'scope']);
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ability_id')->constrained()->cascadeOnDelete();
            $table->foreignId('entity_id')->nullable();
            $table->string('entity_type')->nullable();
            $table->boolean('forbidden')->default(false);
            $table->integer('scope')->nullable()->index();

            $table->index(['entity_id', 'entity_type', 'scope']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('permissions');
        Schema::drop('assigned_roles');
        Schema::drop('roles');
        Schema::drop('abilities');
    }
}; 