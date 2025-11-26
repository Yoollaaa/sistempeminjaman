<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. TABEL USERS
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('user_id'); // Primary Key Custom
            $table->string('nama');           // Pakai 'nama' bukan 'name'
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role')->default('mahasiswa');
            $table->string('nim')->nullable();
            $table->timestamps(); // Created_at & Updated_at
        });

        // 2. TABEL RUANGAN (Nama tabel 'ruangan' tanpa 's')
        Schema::create('ruangan', function (Blueprint $table) {
            $table->bigIncrements('ruangan_id'); // Primary Key Custom
            $table->string('nama_ruangan');
            $table->integer('kapasitas');
            $table->string('lokasi');
            $table->text('keterangan')->nullable();
            // Tidak pakai timestamps ($table->timestamps()) sesuai request
        });

        // 3. TABEL PERSONAL ACCESS TOKENS (Wajib untuk Login API)
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
        
        // 4. TABEL SESSIONS (Pendukung)
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('ruangan');
        Schema::dropIfExists('users');
    }
};