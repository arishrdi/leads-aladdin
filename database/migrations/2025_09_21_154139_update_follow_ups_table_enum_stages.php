<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we need to recreate the table with new enum values
        // First, check if we're using SQLite
        $connection = Schema::getConnection();
        $driver = $connection->getDriverName();

        if ($driver === 'sqlite') {
            // For SQLite: recreate table with new enum constraint
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
        } else {
            // For MySQL/PostgreSQL: use ALTER TABLE to modify enum
            DB::statement("ALTER TABLE follow_ups MODIFY COLUMN stage ENUM(
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
            )");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        $connection = Schema::getConnection();
        $driver = $connection->getDriverName();

        if ($driver === 'sqlite') {
            Schema::table('follow_ups', function (Blueprint $table) {
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
        } else {
            DB::statement("ALTER TABLE follow_ups MODIFY COLUMN stage ENUM(
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
            )");
        }
    }
};
