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
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mahasiswa_id'); // FK to users
            $table->unsignedBigInteger('ruangan_id'); // FK to ruangan
            $table->date('tanggal_pinjam');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->string('keperluan', 255);
            $table->enum('status', ['diajukan', 'disetujui_admin', 'ditolak_admin', 'disetujui_kajur', 'ditolak_kajur'])->default('diajukan');
            $table->text('catatan_admin')->nullable();
            $table->text('catatan_kajur')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('mahasiswa_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('ruangan_id')->references('ruangan_id')->on('ruangan')->onDelete('cascade');

            // Indexes
            $table->index('mahasiswa_id');
            $table->index('ruangan_id');
            $table->index('status');
            $table->index('tanggal_pinjam');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peminjaman');
    }
};
