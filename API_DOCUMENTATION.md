# API Documentation - Mahasiswa Endpoints

## Base URL
```
http://127.0.0.1:8000/api
```

## Authentication
Semua endpoint memerlukan header:
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

Token didapatkan dari endpoint login:
```
POST /api/login
{
  "email": "user@example.com",
  "password": "password"
}
```

---

## Endpoints

### 1. Get My Peminjaman
Mengambil daftar peminjaman mahasiswa yang sedang login

**Endpoint:**
```
GET /api/peminjaman/my-peminjaman
```

**Query Parameters (Optional):**
```
?status=diajukan        // Filter by status
?status=disetujui_admin
?status=disetujui_kajur
?status=ditolak_admin
?status=ditolak_kajur
```

**Response Success (200):**
```json
{
  "message": "Daftar peminjaman Anda",
  "data": [
    {
      "id": 1,
      "mahasiswa_id": 1,
      "nama_mahasiswa": "John Doe",
      "mahasiswa_email": "john@example.com",
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
    {
      "id": 2,
      "mahasiswa_id": 1,
      "nama_mahasiswa": "John Doe",
      "mahasiswa_email": "john@example.com",
      "ruangan_id": 2,
      "nama_ruangan": "Ruang Kuliah Teori",
      "tanggal_pinjam": "2025-12-08",
      "jam_mulai": "13:00",
      "jam_selesai": "15:00",
      "keperluan": "Seminar Teknik Industri",
      "status": "disetujui_admin",
      "catatan_admin": "Disetujui, ruang tersedia",
      "catatan_kajur": null,
      "created_at": "2025-12-05T15:20:00.000000Z"
    }
  ]
}
```

**Response Error:**
```json
// 401 Unauthorized
{
  "message": "Unauthorized"
}

// 404 Not Found
{
  "message": "Data tidak ditemukan"
}
```

---

### 2. Get Statistics
Mengambil statistik peminjaman mahasiswa

**Endpoint:**
```
GET /api/peminjaman/statistics
```

**Response Success (200):**
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

**Penjelasan Fields:**
- `total` - Jumlah total pengajuan
- `diajukan` - Menunggu verifikasi admin
- `disetujui_admin` - Sudah disetujui admin, menunggu kajur
- `disetujui_kajur` - Sudah disetujui kajur (FINAL)
- `ditolak_admin` - Ditolak oleh admin
- `ditolak_kajur` - Ditolak oleh kajur
- `menunggu` - Agregasi: diajukan + disetujui_admin
- `disetujui` - Agregasi: disetujui_kajur
- `ditolak` - Agregasi: ditolak_admin + ditolak_kajur

---

### 3. Get Notifications
Mengambil notifikasi terbaru (max 5)

**Endpoint:**
```
GET /api/peminjaman/notifications
```

**Response Success (200):**
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
    {
      "id": 2,
      "title": "Diverifikasi Admin",
      "message": "Pengajuan peminjaman Ruang Kuliah Teori telah diverifikasi admin, menunggu persetujuan Kajur.",
      "type": "info",
      "ruangan": "Ruang Kuliah Teori",
      "tanggal_pinjam": "2025-12-08",
      "created_at": "2025-12-05T15:20:00.000000Z",
      "updated_at": "2025-12-06T09:45:00.000000Z",
      "status": "disetujui_admin"
    },
    {
      "id": 3,
      "title": "Verifikasi Admin",
      "message": "Pengajuan peminjaman Lab Jaringan sedang diperiksa.",
      "type": "info",
      "ruangan": "Lab Jaringan",
      "tanggal_pinjam": "2025-12-09",
      "created_at": "2025-12-06T08:00:00.000000Z",
      "updated_at": "2025-12-06T08:00:00.000000Z",
      "status": "diajukan"
    },
    {
      "id": 4,
      "title": "Ditolak",
      "message": "Pengajuan peminjaman Lab Komputer telah ditolak.",
      "type": "error",
      "ruangan": "Lab Komputer",
      "tanggal_pinjam": "2025-12-04",
      "created_at": "2025-12-03T14:00:00.000000Z",
      "updated_at": "2025-12-04T10:00:00.000000Z",
      "status": "ditolak_admin"
    }
  ]
}
```

**Notification Types:**
- `success` - Pengajuan disetujui
- `info` - Sedang dalam proses (verifikasi/diverifikasi)
- `error` - Pengajuan ditolak

---

## Usage Examples

### Example 1: Get Dashboard Data (Frontend)
```javascript
import api from '../api.js';

useEffect(() => {
  const fetchData = async () => {
    try {
      const [peminjamanRes, notificationsRes] = await Promise.all([
        api.get('/peminjaman/my-peminjaman'),
        api.get('/peminjaman/notifications')
      ]);

      const peminjaman = peminjamanRes.data.data;
      const notifications = notificationsRes.data.data;
      
      // Use data...
    } catch (error) {
      console.error('Error:', error);
    }
  };

  fetchData();
}, []);
```

### Example 2: Get with Status Filter
```javascript
// Get only pending applications
const response = await api.get('/peminjaman/my-peminjaman?status=diajukan');
const pendingApplications = response.data.data;
```

### Example 3: Display Statistics
```javascript
const statsRes = await api.get('/peminjaman/statistics');
const stats = statsRes.data.data;

console.log(`Total: ${stats.total}`);
console.log(`Menunggu: ${stats.menunggu}`);
console.log(`Disetujui: ${stats.disetujui}`);
console.log(`Ditolak: ${stats.ditolak}`);
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success - Request berhasil |
| 401 | Unauthorized - Token invalid atau expired |
| 403 | Forbidden - User tidak memiliki akses |
| 404 | Not Found - Resource tidak ditemukan |
| 422 | Validation Error - Input tidak valid |
| 500 | Server Error - Terjadi kesalahan di server |

---

## Error Handling

```javascript
api.get('/peminjaman/my-peminjaman')
  .then(response => {
    // Success
    console.log(response.data.data);
  })
  .catch(error => {
    if (error.response) {
      // Server respond with error
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
    } else {
      // Error di client
      console.error('Error:', error.message);
    }
  });
```

---

## Rate Limiting
Saat ini tidak ada rate limiting. Jika diperlukan, bisa ditambahkan di middleware.

---

## CORS
CORS header sudah dikonfigurasi di backend untuk allow requests dari frontend.

---

## Future Enhancements
- [ ] Pagination untuk endpoint peminjaman
- [ ] Search functionality
- [ ] Advanced filtering
- [ ] Sorting options
- [ ] Real-time WebSocket updates
