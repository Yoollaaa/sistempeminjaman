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

    Route::post('/peminjaman', [PeminjamanController::class, 'store']); // <--- BARU
    
    // Nanti ditambahkan: POST /peminjaman, GET /peminjaman/riwayat
});