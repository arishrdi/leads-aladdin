<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('follow_up_stages', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // e.g., 'greeting', 'impresi'
            $table->string('name'); // e.g., 'Greeting', 'Impresi'
            $table->integer('display_order')->default(0);
            $table->string('next_stage_key')->nullable(); // for stage progression
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follow_up_stages');
    }
};
