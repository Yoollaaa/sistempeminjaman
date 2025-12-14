<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Peminjaman;
use App\Models\Ruangan;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PeminjamanApiTest extends TestCase
{
    use RefreshDatabase;

    private $mahasiswa;
    private $admin;
    private $kajur;
    private $ruangan;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test users
        $this->mahasiswa = User::factory()->create(['role' => 'mahasiswa']);
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->kajur = User::factory()->create(['role' => 'ketua_jurusan']);
        
        // Create test room
        $this->ruangan = Ruangan::factory()->create();
    }

    /**
     * Test mahasiswa dapat membuat peminjaman baru
     */
    public function test_mahasiswa_dapat_buat_peminjaman()
    {
        $response = $this->actingAs($this->mahasiswa)->postJson('/api/peminjaman', [
            'ruangan_id' => $this->ruangan->ruangan_id,
            'tanggal_pinjam' => '2025-12-20',
            'jam_mulai' => '10:00',
            'jam_selesai' => '12:00',
            'keperluan' => 'Seminar Teknologi',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('peminjaman', [
            'mahasiswa_id' => $this->mahasiswa->user_id,
            'ruangan_id' => $this->ruangan->ruangan_id,
            'keperluan' => 'Seminar Teknologi',
        ]);
    }

    /**
     * Test mahasiswa hanya bisa lihat peminjaman mereka sendiri
     */
    public function test_mahasiswa_hanya_lihat_peminjamannya_sendiri()
    {
        // Create peminjaman for this mahasiswa
        Peminjaman::factory(3)->create(['mahasiswa_id' => $this->mahasiswa->user_id]);
        
        // Create peminjaman for other mahasiswa
        $otherMahasiswa = User::factory()->create(['role' => 'mahasiswa']);
        Peminjaman::factory(5)->create(['mahasiswa_id' => $otherMahasiswa->user_id]);

        $response = $this->actingAs($this->mahasiswa)->getJson('/api/peminjaman');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    /**
     * Test admin dapat lihat semua peminjaman
     */
    public function test_admin_dapat_lihat_semua_peminjaman()
    {
        Peminjaman::factory(10)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/peminjaman');

        $response->assertStatus(200);
        $this->assertCount(10, $response->json('data'));
    }

    /**
     * Test admin dapat approve peminjaman
     */
    public function test_admin_dapat_approve_peminjaman()
    {
        $peminjaman = Peminjaman::factory()->create([
            'mahasiswa_id' => $this->mahasiswa->user_id,
            'status' => 'diajukan',
        ]);

        $response = $this->actingAs($this->admin)->postJson(
            "/api/peminjaman/{$peminjaman->id}/approve",
            ['catatan' => 'Disetujui oleh admin']
        );

        $response->assertStatus(200);
        $this->assertDatabaseHas('peminjaman', [
            'id' => $peminjaman->id,
            'status' => 'disetujui_admin',
            'catatan_admin' => 'Disetujui oleh admin',
        ]);
    }

    /**
     * Test admin dapat reject peminjaman
     */
    public function test_admin_dapat_reject_peminjaman()
    {
        $peminjaman = Peminjaman::factory()->create([
            'mahasiswa_id' => $this->mahasiswa->user_id,
            'status' => 'diajukan',
        ]);

        $response = $this->actingAs($this->admin)->postJson(
            "/api/peminjaman/{$peminjaman->id}/reject",
            ['catatan' => 'Ruangan tidak tersedia']
        );

        $response->assertStatus(200);
        $this->assertDatabaseHas('peminjaman', [
            'id' => $peminjaman->id,
            'status' => 'ditolak_admin',
        ]);
    }

    /**
     * Test kajur dapat approve peminjaman yang sudah disetujui admin
     */
    public function test_kajur_dapat_approve_peminjaman()
    {
        $peminjaman = Peminjaman::factory()->create([
            'mahasiswa_id' => $this->mahasiswa->user_id,
            'status' => 'disetujui_admin',
        ]);

        $response = $this->actingAs($this->kajur)->postJson(
            "/api/peminjaman/{$peminjaman->id}/approve-kajur",
            ['catatan' => 'Disetujui oleh Kajur']
        );

        $response->assertStatus(200);
        $this->assertDatabaseHas('peminjaman', [
            'id' => $peminjaman->id,
            'status' => 'disetujui_kajur',
        ]);
    }

    /**
     * Test peminjaman muncul dengan file URL jika ada file
     */
    public function test_peminjaman_include_file_url()
    {
        $peminjaman = Peminjaman::factory()->create([
            'mahasiswa_id' => $this->mahasiswa->user_id,
            'file_surat' => 'surat_peminjaman/test.pdf',
        ]);

        $response = $this->actingAs($this->mahasiswa)->getJson('/api/peminjaman');

        $response->assertStatus(200);
        $data = $response->json('data.0');
        
        $this->assertNotNull($data['file_surat']);
        $this->assertNotNull($data['file_surat_url']);
        $this->assertStringContainsString('storage', $data['file_surat_url']);
    }

    /**
     * Test filter peminjaman berdasarkan status
     */
    public function test_filter_peminjaman_by_status()
    {
        Peminjaman::factory(3)->create(['status' => 'diajukan']);
        Peminjaman::factory(2)->create(['status' => 'disetujui_admin']);
        Peminjaman::factory(1)->create(['status' => 'disetujui_kajur']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/peminjaman?status=diajukan');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    /**
     * Test validation - tanggal pinjam harus di masa depan
     */
    public function test_validation_tanggal_pinjam_harus_masa_depan()
    {
        $response = $this->actingAs($this->mahasiswa)->postJson('/api/peminjaman', [
            'ruangan_id' => $this->ruangan->ruangan_id,
            'tanggal_pinjam' => '2025-01-01', // Tanggal yang sudah lewat
            'jam_mulai' => '10:00',
            'jam_selesai' => '12:00',
            'keperluan' => 'Seminar',
        ]);

        $response->assertStatus(422); // Validation error
    }

    /**
     * Test validation - jam selesai harus lebih besar dari jam mulai
     */
    public function test_validation_jam_selesai_lebih_besar()
    {
        $response = $this->actingAs($this->mahasiswa)->postJson('/api/peminjaman', [
            'ruangan_id' => $this->ruangan->ruangan_id,
            'tanggal_pinjam' => '2025-12-20',
            'jam_mulai' => '14:00',
            'jam_selesai' => '10:00', // Lebih kecil dari jam mulai
            'keperluan' => 'Seminar',
        ]);

        $response->assertStatus(422); // Validation error
    }
}
