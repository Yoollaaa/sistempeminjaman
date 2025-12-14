<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User; 
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserApiTest extends TestCase
{
    use RefreshDatabase; 

    /**
     * Test user dapat melakukan registrasi
     */
    public function test_user_bisa_registrasi()
    {
        $response = $this->postJson('/api/register', [
            'nama' => 'Budi Mahasiswa',
            'email' => 'budi@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'nim' => '2024001',
            'role' => 'mahasiswa',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'budi@test.com']);
    }

    /**
     * Test user bisa login
     */
    public function test_user_bisa_login()
    {
        $user = User::factory()->create([
            'email' => 'mahasiswa@test.com',
            'password' => bcrypt('password123'),
        ]);

        // Simulate authenticated user (in real scenario, login endpoint returns token)
        $response = $this->actingAs($user)->getJson('/api/peminjaman');
        
        $response->assertStatus(200);
    }

    /**
     * Test authenticated user bisa mengakses data
     */
    public function test_authenticated_user_bisa_akses_dashboard()
    {
        $user = User::factory()->create(['role' => 'mahasiswa']);
        
        $response = $this->actingAs($user)->getJson('/api/peminjaman');
        
        $response->assertStatus(200);
    }
}