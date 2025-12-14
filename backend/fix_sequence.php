<?php

/**
 * Fix PostgreSQL Auto-Increment Sequence
 * Jalankan: php fix_sequence.php
 */

require 'vendor/autoload.php';

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
    $host = env('DB_HOST');
    $database = env('DB_DATABASE');
    $username = env('DB_USERNAME');
    $password = env('DB_PASSWORD');
    $port = env('DB_PORT', 5432);

    // Connect ke PostgreSQL
    $pdo = new PDO(
        "pgsql:host=$host;port=$port;dbname=$database",
        $username,
        $password
    );

    echo "🔧 Fixing PostgreSQL Sequences...\n\n";

    // Definisikan table dengan primary key mereka
    $tables = [
        'users' => 'user_id',
        'ruangan' => 'ruangan_id',
        'peminjaman' => 'id',
        'jadwal_kuliah' => 'id',
    ];

    foreach ($tables as $table => $pk_column) {
        try {
            // Cek apakah table ada
            $result = $pdo->query("SELECT EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = '$table'
            )");
            $exists = $result->fetchColumn();
            
            if (!$exists) {
                echo "⏭️  Table '$table' tidak ada, skip\n";
                continue;
            }

            // Cari highest value
            $result = $pdo->query("SELECT MAX($pk_column) as max_id FROM $table");
            $row = $result->fetch(PDO::FETCH_ASSOC);
            $max_id = $row['max_id'] ?? 0;

            // Reset sequence
            $sequence_name = "{$table}_{$pk_column}_seq";
            
            // Cek apakah sequence ada
            $seq_exists = $pdo->query("SELECT EXISTS (
                SELECT 1 FROM information_schema.sequences 
                WHERE sequence_name = '$sequence_name'
            )")->fetchColumn();

            if ($seq_exists) {
                $pdo->exec("ALTER SEQUENCE $sequence_name RESTART WITH " . ($max_id + 1));
                echo "✅ Table '$table' ($pk_column): MAX ID = $max_id → Sequence reset to " . ($max_id + 1) . "\n";
            } else {
                echo "⚠️  Sequence '$sequence_name' tidak ditemukan\n";
            }
        } catch (Exception $e) {
            echo "⚠️  Error pada '$table': " . $e->getMessage() . "\n";
        }
    }

    echo "\n✨ All sequences fixed! You can now add new records.\n";

} catch (Exception $e) {
    echo "❌ Connection Error: " . $e->getMessage() . "\n";
    exit(1);
}
