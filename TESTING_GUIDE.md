# Testing Guide - Dashboard Integration

## Quick Start Testing

### Langkah 1: Pastikan Database Setup Sudah Benar

```bash
cd backend

# Run migrations
php artisan migrate

# Run seeders untuk populate test data
php artisan db:seed
```

**Hasil yang diharapkan:**
- Database sudah memiliki test data peminjaman dari user dengan ID 1
- Tabel `peminjaman` terisi dengan sample data

### Langkah 2: Pastikan Laravel Running

```bash
# Terminal 1: Jalankan Laravel server
cd backend
php artisan serve
```

Server akan berjalan di `http://127.0.0.1:8000`

### Langkah 3: Pastikan React Running

```bash
# Terminal 2: Jalankan React frontend
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (atau port lainnya yang ditampilkan)

### Langkah 4: Test Login

1. Buka browser ke `http://localhost:5173`
2. Login dengan akun:
   - **Username/Email:** User yang ada di database (default: user dengan user_id=1)
   - **Password:** Sesuai dengan password di database

3. Perhatikan token yang disimpan di localStorage:
   - Buka Developer Tools (F12)
   - Buka Application > Local Storage
   - Cari key `token` dan `user`

### Langkah 5: Test Dashboard

1. Setelah login, Anda akan diarahkan ke Dashboard
2. **Cek yang muncul:**
   - ✅ Nama user di header sapaan
   - ✅ Tanggal hari ini di area tanggal
   - ✅ Badge notifikasi dengan angka
   - ✅ Hero card dengan info pengajuan terbaru
   - ✅ Widget statistik menampilkan:
     - Total Pengajuan
     - Menunggu
     - Disetujui
   - ✅ Jadwal peminjaman Anda (dengan status dan jam)
   - ✅ Notifikasi dropdown

3. **Troubleshoot jika loading forever:**
   - Buka DevTools > Network tab
   - Lihat apakah request ke `/api/peminjaman/my-peminjaman` berhasil (status 200)
   - Lihat apakah request ke `/api/peminjaman/notifications` berhasil (status 200)
   - Cek Console tab untuk error messages

### Langkah 6: Test Riwayat Page

1. Klik menu "Riwayat" di sidebar
2. **Cek yang muncul:**
   - ✅ Daftar pengajuan dengan kartu status
   - ✅ Setiap kartu menampilkan:
     - Nama ruangan
     - Tanggal peminjaman
     - Jam peminjaman
     - Status badge (Menunggu/Diverifikasi/Disetujui/Ditolak)
     - Keperluan
     - Progress bar (tahap approval)
   - ✅ Tab filter bekerja (Semua, Diproses, Selesai)
   - ✅ Kartu yang ditolak menampilkan alasan penolakan

3. **Troubleshoot jika data tidak muncul:**
   - Check Network tab untuk response dari `/api/peminjaman/my-peminjaman`
   - Verify data format sesuai expectation
   - Cek Console untuk error messages

### Langkah 7: Test Notifikasi Dropdown

1. Klik icon lonceng di header Dashboard
2. **Cek yang muncul:**
   - ✅ Dropdown menampilkan notifikasi terbaru
   - ✅ Setiap notifikasi memiliki:
     - Icon sesuai type (success/info/error)
     - Title dan message
     - Waktu update
   - ✅ Badge merah menampilkan jumlah notifikasi

## API Testing Manual (dengan Postman/Insomnia)

Jika ingin test API langsung tanpa frontend:

### 1. Get Auth Token

```
POST http://127.0.0.1:8000/api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "user_id": 1,
    "nama": "John Doe",
    "email": "user@example.com",
    "role": "mahasiswa"
  }
}
```

Simpan value `token` untuk digunakan di request berikutnya.

### 2. Test Get My Peminjaman

```
GET http://127.0.0.1:8000/api/peminjaman/my-peminjaman
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Expected Response (200):**
```json
{
  "message": "Daftar peminjaman Anda",
  "data": [
    {
      "id": 1,
      "mahasiswa_id": 1,
      "nama_mahasiswa": "John Doe",
      "mahasiswa_email": "user@example.com",
      "ruangan_id": 1,
      "nama_ruangan": "Lab Sistem Kendali",
      "tanggal_pinjam": "2025-12-07",
      "jam_mulai": "08:00",
      "jam_selesai": "10:00",
      "keperluan": "Praktik Sistem Kendali",
      "status": "diajukan",
      "catatan_admin": null,
      "catatan_kajur": null,
      "created_at": "2025-12-06T10:30:00.000000Z"
    },
    ...
  ]
}
```

### 3. Test Get Statistics

```
GET http://127.0.0.1:8000/api/peminjaman/statistics
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Expected Response (200):**
```json
{
  "message": "Statistik peminjaman",
  "data": {
    "total": 5,
    "diajukan": 1,
    "disetujui_admin": 1,
    "disetujui_kajur": 1,
    "ditolak_admin": 1,
    "ditolak_kajur": 1,
    "menunggu": 2,
    "disetujui": 1,
    "ditolak": 2
  }
}
```

### 4. Test Get Notifications

```
GET http://127.0.0.1:8000/api/peminjaman/notifications
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Expected Response (200):**
```json
{
  "message": "Notifikasi peminjaman",
  "data": [
    {
      "id": 1,
      "title": "Disetujui",
      "message": "Pengajuan peminjaman Lab Sistem Kendali telah disetujui oleh Ketua Jurusan.",
      "type": "success",
      "ruangan": "Lab Sistem Kendali",
      "tanggal_pinjam": "2025-12-07",
      "created_at": "2025-12-06T10:30:00.000000Z",
      "updated_at": "2025-12-06T10:35:00.000000Z",
      "status": "disetujui_kajur"
    },
    ...
  ]
}
```

## Common Issues & Solutions

### Issue 1: "Gagal mengambil data peminjaman"

**Penyebab:**
- Laravel server tidak running
- Token expired atau invalid
- Database tidak terupdate

**Solusi:**
```bash
# 1. Pastikan Laravel running
cd backend
php artisan serve

# 2. Clear cache
php artisan cache:clear

# 3. Re-run migrations and seeds
php artisan migrate:fresh
php artisan db:seed

# 4. Login ulang di frontend (untuk mendapat token baru)
```

### Issue 2: Status loading forever

**Penyebab:**
- Network request tergantung
- CORS error
- Server respond lambat

**Solusi:**
1. Buka DevTools > Network tab
2. Refresh halaman
3. Lihat response dari API endpoints
4. Jika ada CORS error, verify backend CORS configuration

### Issue 3: Data tidak sesuai

**Penyebab:**
- Data di database belum diupdate
- Seeder belum dijalankan
- User ID tidak sesuai

**Solusi:**
```bash
# Re-seed database
php artisan migrate:fresh
php artisan db:seed

# Atau seed hanya peminjaman
php artisan db:seed --class=PeminjamanSeeder
```

## Checklist Sukses

- [ ] Laravel server running di port 8000
- [ ] React frontend running
- [ ] Login berhasil, token tersimpan
- [ ] Dashboard menampilkan data real (bukan dummy)
- [ ] Notifikasi dropdown menampilkan data
- [ ] Riwayat page menampilkan semua pengajuan
- [ ] Tab filter di Riwayat bekerja dengan baik
- [ ] Network requests semua return 200 OK
- [ ] Tidak ada error di Console
- [ ] Data dalam bentuk Bahasa Indonesia (tanggal, waktu)

## Next Steps

Setelah testing berhasil:
1. Buat beberapa pengajuan baru via FormPeminjaman page
2. Test dengan berbagai status (diajukan, disetujui, ditolak)
3. Verify setiap status terpantau dengan baik di Dashboard dan Riwayat
4. Performance test dengan banyak data
