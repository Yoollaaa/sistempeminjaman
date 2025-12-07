<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\PeminjamanController; // Tambahkan import di atas
use App\Http\Controllers\JadwalController; // Import di atas

// ------------------------------------------------------------------
// 1. ROUTE PUBLIK (TIDAK PERLU TOKEN)
// ------------------------------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); // <--- INI PINTU MASUK LOGIN YANG DICARI REACT

// ------------------------------------------------------------------
// 2. ROUTE TERPROTEKSI (WAJIB TOKEN AKSES)
// ------------------------------------------------------------------
// ...
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- GROUP ROUTE RUANGAN (Lengkap CRUD) ---
    Route::get('/ruangan', [RuanganController::class, 'index']);           // Baca
    Route::post('/ruangan', [RuanganController::class, 'store']);          // Tambah
    Route::put('/ruangan/{id}', [RuanganController::class, 'update']);     // Edit
    Route::delete('/ruangan/{id}', [RuanganController::class, 'destroy']); // Hapus

    // --- GROUP ROUTE PEMINJAMAN ---
    Route::get('/peminjaman/my-peminjaman', [PeminjamanController::class, 'myPeminjaman']);
    Route::get('/peminjaman/statistics', [PeminjamanController::class, 'statistics']);
    Route::get('/peminjaman/notifications', [PeminjamanController::class, 'notifications']);

    // --- GROUP ROUTE JADWAL KULIAH ---
    Route::get('/jadwal', [JadwalController::class, 'index']);
    Route::post('/jadwal', [JadwalController::class, 'store']);
    Route::delete('/jadwal/{id}', [JadwalController::class, 'destroy']);
    
    Route::get('/peminjaman', [PeminjamanController::class, 'index']);
    Route::post('/peminjaman', [PeminjamanController::class, 'store']);
    Route::get('/peminjaman/{id}', [PeminjamanController::class, 'show']);
    Route::post('/peminjaman/{id}/approve', [PeminjamanController::class, 'approve']);
    Route::post('/peminjaman/{id}/reject', [PeminjamanController::class, 'reject']);
    Route::post('/peminjaman/{id}/approve-kajur', [PeminjamanController::class, 'approveKajur']);
    Route::post('/peminjaman/{id}/reject-kajur', [PeminjamanController::class, 'rejectKajur']);
});