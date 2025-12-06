<?php
// Load Laravel
$app = require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Get data
$peminjamanCount = \App\Models\Peminjaman::count();
$ruanganCount = \App\Models\Ruangan::count();

echo "Peminjaman records: " . $peminjamanCount . "\n";
echo "Ruangan records: " . $ruanganCount . "\n";

if ($peminjamanCount > 0) {
    echo "\nFirst 5 peminjaman records:\n";
    \App\Models\Peminjaman::take(5)->get()->each(function($p) {
        echo "ID: {$p->id}, Status: {$p->status}, Tanggal: {$p->tanggal_pinjam}, Keperluan: {$p->keperluan}\n";
    });
}

if ($ruanganCount > 0) {
    echo "\nRuangan records:\n";
    \App\Models\Ruangan::all()->each(function($r) {
        echo "ID: {$r->ruangan_id}, Nama: {$r->nama_ruangan}, Kapasitas: {$r->kapasitas}\n";
    });
}
