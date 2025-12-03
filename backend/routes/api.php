<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\PeminjamanController; // Tambahkan import di atas

// ------------------------------------------------------------------
// 1. ROUTE PUBLIK (TIDAK PERLU TOKEN)
// ------------------------------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); // <--- INI PINTU MASUK LOGIN YANG DICARI REACT

// ------------------------------------------------------------------
// 2. ROUTE TERPROTEKSI (WAJIB TOKEN AKSES)
// ------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Ruangan
    Route::get('/ruangan', [RuanganController::class, 'index']); 

    // Peminjaman
    Route::get('/peminjaman', [PeminjamanController::class, 'index']); // list pengajuan (admin/kajur)
    Route::post('/peminjaman', [PeminjamanController::class, 'store']); // buat pengajuan (mahasiswa)
    Route::post('/peminjaman/{id}/approve', [PeminjamanController::class, 'approve']); // approve by admin
    Route::post('/peminjaman/{id}/reject', [PeminjamanController::class, 'reject']); // reject by admin
    Route::post('/peminjaman/{id}/approve-kajur', [PeminjamanController::class, 'approveKajur']); // approve by kajur
    Route::post('/peminjaman/{id}/reject-kajur', [PeminjamanController::class, 'rejectKajur']); // reject by kajur

    // Nanti ditambahkan: GET /peminjaman/riwayat
});