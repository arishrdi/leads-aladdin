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
        Schema::create('kunjungans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cabang_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('waktu_canvasing');
            $table->string('bertemu_dengan');
            $table->string('nomor_aktif_takmir');
            $table->string('nama_masjid');
            $table->text('alamat_masjid');
            $table->string('foto_masjid')->nullable();
            $table->string('nama_pengurus');
            $table->string('jumlah_shof');
            $table->text('kondisi_karpet');
            $table->enum('status', ['COLD', 'WARM', 'HOT']);
            $table->text('kebutuhan');
            $table->text('catatan')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kunjungans');
    }
};
