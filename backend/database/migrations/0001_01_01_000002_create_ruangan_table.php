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
        if (!Schema::hasTable('ruangan')) {
            Schema::create('ruangan', function (Blueprint $table) {
                $table->id('ruangan_id');
                $table->string('nama_ruangan', 100);
                $table->integer('kapasitas')->nullable();
                $table->string('lokasi', 100)->nullable();
                $table->text('keterangan')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ruangan');
    }
};
