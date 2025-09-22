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
        Schema::create('follow_ups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('leads_id')->constrained('leads')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users');
            $table->enum('stage', [
                '1_kontak_awal',
                '2_presentasi', 
                '3_survey',
                '4_penawaran',
                '5_negosiasi',
                '6_demo',
                '7_proposal',
                '8_kontrak',
                '9_pembayaran',
                '10_closing'
            ]);
            $table->integer('attempt_count')->default(1);
            $table->datetime('scheduled_at');
            $table->datetime('completed_at')->nullable();
            $table->text('catatan')->nullable();
            $table->text('hasil_followup')->nullable();
            $table->boolean('ada_respon')->default(false);
            $table->enum('status', ['scheduled', 'completed', 'no_response'])->default('scheduled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follow_ups');
    }
};
