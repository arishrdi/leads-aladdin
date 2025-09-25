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
        Schema::create('kunjungan_item_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kunjungan_id')->constrained()->onDelete('cascade');
            $table->foreignId('kunjungan_item_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['ada', 'belum_ada']);
            $table->timestamps();
            
            $table->unique(['kunjungan_id', 'kunjungan_item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kunjungan_item_responses');
    }
};
