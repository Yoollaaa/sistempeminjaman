<?php
// cleanup.php - for artisan command
namespace App\Commands;

use Illuminate\Console\Command;
use App\Models\Peminjaman;
use App\Models\Ruangan;

class CleanupDummyData extends Command
{
    protected $signature = 'cleanup:dummy-data';
    protected $description = 'Delete all dummy peminjaman data while preserving ruangan data';

    public function handle()
    {
        $this->info('=== Database Cleanup Report ===');
        $this->info('');

        // Count before
        $peminjaman_before = Peminjaman::count();
        $ruangan_before = Ruangan::count();
        
        $this->info('BEFORE CLEANUP:');
        $this->line("- Peminjaman records: $peminjaman_before");
        $this->line("- Ruangan records: $ruangan_before");
        
        // Delete peminjaman
        $deleted = Peminjaman::truncate();
        
        // Count after
        $peminjaman_after = Peminjaman::count();
        $ruangan_after = Ruangan::count();
        
        $this->info('');
        $this->info('✓ All peminjaman records deleted');
        $this->info('');
        $this->info('AFTER CLEANUP:');
        $this->line("- Peminjaman records: $peminjaman_after");
        $this->line("- Ruangan records: $ruangan_after");
        
        $this->info('');
        $this->info('SUMMARY:');
        $this->line("- Peminjaman: $peminjaman_before → $peminjaman_after (deleted " . ($peminjaman_before - $peminjaman_after) . ")");
        $this->line("- Ruangan: $ruangan_before → $ruangan_after (preserved)");
        
        if ($ruangan_after === $ruangan_before) {
            $this->info('');
            $this->info('✓ SUCCESS: All dummy peminjaman data deleted. Ruangan data preserved.');
        } else {
            $this->warn('');
            $this->warn('⚠ WARNING: Ruangan count changed. Check database integrity.');
        }
    }
}
