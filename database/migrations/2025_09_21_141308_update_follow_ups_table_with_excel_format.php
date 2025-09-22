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
        Schema::table('follow_ups', function (Blueprint $table) {
            // Add checkbox tracking fields for Excel-like format
            $table->boolean('attempt_1_completed')->default(false)->after('attempt_count');
            $table->boolean('attempt_2_completed')->default(false)->after('attempt_1_completed');
            $table->boolean('attempt_3_completed')->default(false)->after('attempt_2_completed');
            
            // Add fields for attempt completion dates
            $table->datetime('attempt_1_completed_at')->nullable()->after('attempt_3_completed');
            $table->datetime('attempt_2_completed_at')->nullable()->after('attempt_1_completed_at');
            $table->datetime('attempt_3_completed_at')->nullable()->after('attempt_2_completed_at');
        });

        // Update enum values for stage field - need to drop and recreate the enum
        Schema::table('follow_ups', function (Blueprint $table) {
            $table->dropColumn('stage');
        });

        Schema::table('follow_ups', function (Blueprint $table) {
            $table->enum('stage', [
                'greeting',
                'impresi', 
                'small_talk',
                'rekomendasi',
                'pengajuan_survei',
                'presentasi',
                'form_pemesanan',
                'up_cross_selling',
                'invoice',
                'konfirmasi_pemasangan'
            ])->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('follow_ups', function (Blueprint $table) {
            // Remove checkbox tracking fields
            $table->dropColumn([
                'attempt_1_completed',
                'attempt_2_completed', 
                'attempt_3_completed',
                'attempt_1_completed_at',
                'attempt_2_completed_at',
                'attempt_3_completed_at'
            ]);
            
            // Restore original enum values
            $table->dropColumn('stage');
        });

        Schema::table('follow_ups', function (Blueprint $table) {
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
            ])->after('user_id');
        });
    }
};