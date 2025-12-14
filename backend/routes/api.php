<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\Peminjaman; 
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RuanganController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\JadwalController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/ruangan', [RuanganController::class, 'index']);
    Route::post('/ruangan', [RuanganController::class, 'store']);
    Route::put('/ruangan/{id}', [RuanganController::class, 'update']);
    Route::delete('/ruangan/{id}', [RuanganController::class, 'destroy']);

    Route::get('/jadwal', [JadwalController::class, 'index']);
    Route::post('/jadwal', [JadwalController::class, 'store']);
    Route::delete('/jadwal/{id}', [JadwalController::class, 'destroy']);
    
    Route::get('/peminjaman', [PeminjamanController::class, 'index']);
    Route::post('/peminjaman', [PeminjamanController::class, 'store']);
    
    Route::get('/peminjaman/my-peminjaman', [PeminjamanController::class, 'myPeminjaman']);
    Route::get('/peminjaman/statistics', [PeminjamanController::class, 'statistics']);
    
    Route::get('/peminjaman/{id}', [PeminjamanController::class, 'show']);
    
    Route::post('/peminjaman/{id}/approve', [PeminjamanController::class, 'approve']);
    Route::post('/peminjaman/{id}/reject', [PeminjamanController::class, 'reject']);
    Route::post('/peminjaman/{id}/approve-kajur', [PeminjamanController::class, 'approveKajur']);
    Route::post('/peminjaman/{id}/reject-kajur', [PeminjamanController::class, 'rejectKajur']);

    Route::get('/notifikasi', [PeminjamanController::class, 'notifications']);
});