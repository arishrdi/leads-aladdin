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
        // Remove enum constraint and convert stage column to string with foreign key reference
        $connection = Schema::getConnection();
        $driver = $connection->getDriverName();

        if ($driver === 'sqlite') {
            // For SQLite: recreate table without enum
            Schema::table('follow_ups', function (Blueprint $table) {
                $table->dropColumn('stage');
            });
            
            Schema::table('follow_ups', function (Blueprint $table) {
                $table->string('stage')->after('user_id');
                $table->foreign('stage')->references('key')->on('follow_up_stages')->onDelete('restrict');
                $table->index('stage');
            });
        } else {
            // For MySQL/PostgreSQL: modify column and add foreign key
            Schema::table('follow_ups', function (Blueprint $table) {
                $table->string('stage', 50)->change();
                $table->foreign('stage')->references('key')->on('follow_up_stages')->onDelete('restrict');
                $table->index('stage');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('follow_ups', function (Blueprint $table) {
            $table->dropForeign(['stage']);
            $table->dropIndex(['stage']);
        });

        // Restore enum constraint
        $connection = Schema::getConnection();
        $driver = $connection->getDriverName();

        if ($driver === 'sqlite') {
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
    }
};
