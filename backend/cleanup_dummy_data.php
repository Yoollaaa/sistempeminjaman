#!/usr/bin/env php
<?php
// Database cleanup script - removes dummy peminjaman data

// Load environment variables
$env_file = __DIR__ . '/.env';
if (file_exists($env_file)) {
    $lines = file($env_file);
    foreach ($lines as $line) {
        if (preg_match('/^DB_HOST=(.+)$/', trim($line), $m)) putenv('DB_HOST=' . trim($m[1]));
        if (preg_match('/^DB_PORT=(.+)$/', trim($line), $m)) putenv('DB_PORT=' . trim($m[1]));
        if (preg_match('/^DB_DATABASE=(.+)$/', trim($line), $m)) putenv('DB_DATABASE=' . trim($m[1]));
        if (preg_match('/^DB_USERNAME=(.+)$/', trim($line), $m)) putenv('DB_USERNAME=' . trim($m[1]));
        if (preg_match('/^DB_PASSWORD=(.+)$/', trim($line), $m)) putenv('DB_PASSWORD=' . trim($m[1]));
    }
}

try {
    // Connect to PostgreSQL
    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '5432';
    $database = getenv('DB_DATABASE') ?: 'db_peminjaman';
    $username = getenv('DB_USERNAME') ?: 'postgres';
    $password = getenv('DB_PASSWORD') ?: '';
    
    $conn_string = "host=$host port=$port dbname=$database user=$username password=$password";
    $conn = pg_connect($conn_string);
    
    if (!$conn) {
        echo "ERROR: Could not connect to database\n";
        exit(1);
    }
    
    echo "=== Database Cleanup Report ===\n\n";
    
    // Count existing data before cleanup
    echo "BEFORE CLEANUP:\n";
    $result = pg_query($conn, "SELECT COUNT(*) as count FROM peminjaman");
    $row = pg_fetch_assoc($result);
    $peminjaman_before = $row['count'];
    echo "- Peminjaman records: " . $peminjaman_before . "\n";
    
    $result = pg_query($conn, "SELECT COUNT(*) as count FROM ruangan");
    $row = pg_fetch_assoc($result);
    $ruangan_before = $row['count'];
    echo "- Ruangan records: " . $ruangan_before . "\n";
    
    // Delete all peminjaman records (dummy data)
    $delete_result = pg_query($conn, "DELETE FROM peminjaman");
    if ($delete_result) {
        $rows_deleted = pg_affected_rows($delete_result);
        echo "\n✓ Deleted $rows_deleted peminjaman records\n";
    } else {
        echo "ERROR deleting peminjaman: " . pg_last_error($conn) . "\n";
    }
    
    // Verify cleanup
    echo "\nAFTER CLEANUP:\n";
    $result = pg_query($conn, "SELECT COUNT(*) as count FROM peminjaman");
    $row = pg_fetch_assoc($result);
    $peminjaman_after = $row['count'];
    echo "- Peminjaman records: " . $peminjaman_after . "\n";
    
    $result = pg_query($conn, "SELECT COUNT(*) as count FROM ruangan");
    $row = pg_fetch_assoc($result);
    $ruangan_after = $row['count'];
    echo "- Ruangan records: " . $ruangan_after . "\n";
    
    echo "\nSUMMARY:\n";
    echo "- Peminjaman: $peminjaman_before → $peminjaman_after (deleted " . ($peminjaman_before - $peminjaman_after) . ")\n";
    echo "- Ruangan: $ruangan_before → $ruangan_after (preserved)\n";
    
    if ($ruangan_after === $ruangan_before) {
        echo "\n✓ SUCCESS: All dummy peminjaman data deleted. Ruangan data preserved.\n";
    } else {
        echo "\n⚠ WARNING: Ruangan count changed. Check database integrity.\n";
    }
    
    pg_close($conn);
    exit(0);
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
