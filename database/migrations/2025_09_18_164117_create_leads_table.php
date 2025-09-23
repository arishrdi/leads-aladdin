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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_leads')->nullable();
            $table->enum('sapaan', ['Bapak', 'Ibu', 'Ustadz', 'Ustadzah'])->default('Bapak');
            $table->string('nama_pelanggan');
            $table->string('no_whatsapp');
            $table->string('nama_masjid_instansi')->nullable();
            $table->text('alamat')->nullable();
            $table->foreignId('sumber_leads_id')->constrained('sumber_leads');
            $table->text('catatan')->nullable();
            $table->text('alasan_closing')->nullable();
            $table->text('alasan_tidak_closing')->nullable();
            $table->enum('prioritas', ['fasttrack', 'normal', 'rendah'])->default('normal');
            $table->string('kebutuhan_karpet')->nullable();
            $table->decimal('potensi_nilai', 15, 2)->nullable();
            $table->decimal('budget_min', 15, 2)->nullable();
            $table->decimal('budget_max', 15, 2)->nullable();
            $table->date('tanggal_closing')->nullable();
            $table->decimal('nominal_deal', 15, 2)->nullable();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('tipe_karpet_id')->nullable()->constrained('tipe_karpets');
            $table->foreignId('cabang_id')->constrained('cabangs');
            $table->enum('status', ['WARM', 'HOT', 'CUSTOMER', 'EXIT', 'COLD', 'CROSS_SELLING'])->default('WARM');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
