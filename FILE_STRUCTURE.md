# 📁 FILE STRUCTURE - Endpoint, Routing & Database

Dokumentasi lengkap untuk semua file yang berisi Endpoint, Routing, dan Database Schema.

---

## 🛣️ ROUTING & ENDPOINTS

### 1. **[routes/api.php](backend/routes/api.php)**
File utama yang mendefinisikan semua REST API endpoints.

#### Public Routes (Tanpa Auth)
```php
POST /api/register        → AuthController@register
POST /api/login           → AuthController@login
```

#### Protected Routes (Dengan Auth: Sanctum)
```
❌ Auth required: middleware('auth:sanctum')

// User Info
GET  /api/user                           → Return current user data
POST /api/logout                         → AuthController@logout

// Ruangan (Room Management)
GET    /api/ruangan                      → RuanganController@index (list all)
POST   /api/ruangan                      → RuanganController@store (create new) [Admin only]
PUT    /api/ruangan/{id}                 → RuanganController@update [Admin only]
DELETE /api/ruangan/{id}                 → RuanganController@destroy [Admin only]

// Jadwal Kuliah (Class Schedule)
GET    /api/jadwal                       → JadwalController@index (list all)
POST   /api/jadwal                       → JadwalController@store (create new) [Admin only]
DELETE /api/jadwal/{id}                  → JadwalController@destroy [Admin only]

// Peminjaman (Room Booking)
GET    /api/peminjaman                   → PeminjamanController@index
       Query: ?status=diajukan|disetujui_admin|ditolak_admin|disetujui_kajur|ditolak_kajur
       
POST   /api/peminjaman                   → PeminjamanController@store (create new)

GET    /api/peminjaman/my-peminjaman     → PeminjamanController@myPeminjaman (mahasiswa only)
GET    /api/peminjaman/statistics        → PeminjamanController@statistics (dashboard stats)

GET    /api/peminjaman/{id}              → PeminjamanController@show (detail)

POST   /api/peminjaman/{id}/approve      → PeminjamanController@approve [Admin only]
POST   /api/peminjaman/{id}/reject       → PeminjamanController@reject [Admin only]
POST   /api/peminjaman/{id}/approve-kajur    → PeminjamanController@approveKajur [Kajur only]
POST   /api/peminjaman/{id}/reject-kajur     → PeminjamanController@rejectKajur [Kajur only]

// Notifikasi
GET    /api/notifikasi                   → PeminjamanController@notifications
```

**File Location:** [backend/routes/api.php](backend/routes/api.php)

---

### 2. **[routes/web.php](backend/routes/web.php)**
Web routes untuk SPA (React). Biasanya hanya return view welcome.

```php
GET / → Return welcome view
```

**File Location:** [backend/routes/web.php](backend/routes/web.php)

---

## 🎛️ CONTROLLERS (Business Logic)

### 1. **[app/Http/Controllers/AuthController.php](backend/app/Http/Controllers/AuthController.php)**
Menangani authentication (register & login).

**Methods:**
- `register()` - Registrasi user baru (mahasiswa default)
- `login()` - Login & return Sanctum token

---

### 2. **[app/Http/Controllers/RuanganController.php](backend/app/Http/Controllers/RuanganController.php)**
Menangani operasi ruangan (room management).

**Methods:**
- `index()` - List semua ruangan
- `store()` - Tambah ruangan baru [Admin only]
- `update()` - Edit ruangan [Admin only]
- `destroy()` - Hapus ruangan [Admin only]

---

### 3. **[app/Http/Controllers/PeminjamanController.php](backend/app/Http/Controllers/PeminjamanController.php)** ⭐ (MAIN)
Menangani semua operasi peminjaman ruangan.

**Key Methods:**

| Method | Endpoint | Function |
|--------|----------|----------|
| `index()` | GET /api/peminjaman | List peminjaman (filter by role) |
| `myPeminjaman()` | GET /api/peminjaman/my-peminjaman | Mahasiswa lihat milik sendiri |
| `store()` | POST /api/peminjaman | Buat peminjaman baru |
| `show()` | GET /api/peminjaman/{id} | Detail peminjaman |
| `statistics()` | GET /api/peminjaman/statistics | Dashboard stats |
| `approve()` | POST /api/peminjaman/{id}/approve | Admin approve |
| `reject()` | POST /api/peminjaman/{id}/reject | Admin reject |
| `approveKajur()` | POST /api/peminjaman/{id}/approve-kajur | Kajur approve |
| `rejectKajur()` | POST /api/peminjaman/{id}/reject-kajur | Kajur reject |
| `notifications()` | GET /api/notifikasi | Get notifications |

**Key Features:**
- ✅ Role-based filtering (Mahasiswa see own, Admin/Kajur see all)
- ✅ File URL generation (Storage::url())
- ✅ Status workflow: diajukan → disetujui_admin → disetujui_kajur
- ✅ Fallback for deleted users/rooms

**File Location:** [backend/app/Http/Controllers/PeminjamanController.php](backend/app/Http/Controllers/PeminjamanController.php)

---

### 4. **[app/Http/Controllers/JadwalController.php](backend/app/Http/Controllers/JadwalController.php)**
Menangani jadwal kuliah.

**Methods:**
- `index()` - List jadwal
- `store()` - Tambah jadwal [Admin only]
- `destroy()` - Hapus jadwal [Admin only]

---

## 🗄️ DATABASE

### Migrations (Schema Definition)

#### 1. **[0001_01_01_000000_create_users_table.php](backend/database/migrations/0001_01_01_000000_create_users_table.php)**
Users/Mahasiswa/Admin/Kajur table.

```
Table: users
Columns:
  - user_id (PK, bigint, auto-increment)
  - nama (string)
  - email (string, unique)
  - password (string, bcrypt)
  - role (enum: mahasiswa|admin|ketua_jurusan) default=mahasiswa
  - nim (string) - Student ID
  - created_at, updated_at (timestamp)

Indexes:
  - PRIMARY KEY: user_id
  - UNIQUE: email
```

---

#### 2. **[0001_01_01_000002_create_ruangan_table.php](backend/database/migrations/0001_01_01_000002_create_ruangan_table.php)**
Ruangan (rooms) table.

```
Table: ruangan
Columns:
  - ruangan_id (PK, bigint, auto-increment)
  - nama_ruangan (string) - e.g., "H5", "Lab Teknik Komputer"
  - kapasitas (int) - e.g., 40, 150
  - lokasi (string) - e.g., "Gedung H Lantai 1"
  - keterangan (text, nullable) - Description
  - created_at, updated_at (timestamp)

Indexes:
  - PRIMARY KEY: ruangan_id
  - UNIQUE: nama_ruangan
```

---

#### 3. **[0001_01_01_000004_create_peminjaman_table.php](backend/database/migrations/0001_01_01_000004_create_peminjaman_table.php)**
Peminjaman (room booking) table - MAIN TABLE.

```
Table: peminjaman
Columns:
  - id (PK, bigint, auto-increment)
  - mahasiswa_id (FK to users.user_id) - Who borrows
  - ruangan_id (FK to ruangan.ruangan_id) - Which room
  - tanggal_pinjam (date) - Borrow date
  - jam_mulai (time) - Start time
  - jam_selesai (time) - End time
  - keperluan (string) - Purpose/Reason
  - status (enum: diajukan|disetujui_admin|ditolak_admin|disetujui_kajur|ditolak_kajur)
  - catatan_admin (text, nullable) - Admin notes
  - catatan_kajur (text, nullable) - Kajur notes
  - file_surat (string, nullable) - Attached file path (for approval letter)
  - created_at, updated_at (timestamp)

Relationships:
  - FK: mahasiswa_id → users(user_id) [CASCADE DELETE]
  - FK: ruangan_id → ruangan(ruangan_id) [CASCADE DELETE]

Indexes:
  - PRIMARY KEY: id
  - INDEX: mahasiswa_id (for filtering by user)
  - INDEX: status (for filtering by status)
```

---

#### 4. **[2025_12_07_012254_add_file_surat_to_peminjaman_table.php](backend/database/migrations/2025_12_07_012254_add_file_surat_to_peminjaman_table.php)**
Added file upload support to peminjaman.

```
Modifications to peminjaman table:
  + file_surat (string, nullable) - File path for approval letter
```

---

#### 5. **[0001_01_01_000003_create_jobs_table.php](backend/database/migrations/0001_01_01_000003_create_jobs_table.php)**
Laravel queue jobs table (background processing).

---

#### 6. **[0001_01_01_000001_create_cache_table.php](backend/database/migrations/0001_01_01_000001_create_cache_table.php)**
Cache storage table.

---

#### 7. **[2025_12_07_031007_create_jadwal_kuliah_table.php](backend/database/migrations/2025_12_07_031007_create_jadwal_kuliah_table.php)**
Jadwal Kuliah (class schedule) table.

```
Table: jadwal_kuliah
Columns:
  - id (PK, bigint, auto-increment)
  - ruangan_id (FK to ruangan.ruangan_id)
  - hari (string) - Day of week (Senin, Selasa, etc)
  - jam_mulai (time)
  - jam_selesai (time)
  - kelas (string) - Class name
  - dosen (string) - Lecturer name
  - created_at, updated_at (timestamp)

Relationships:
  - FK: ruangan_id → ruangan(ruangan_id) [CASCADE DELETE]
```

---

### Seeders (Demo Data)

#### 1. **[database/seeders/DatabaseSeeder.php](backend/database/seeders/DatabaseSeeder.php)**
Main seeder - Populate demo data untuk development.

**Data yang di-seed:**
- 3 Users: Mahasiswa, Admin, Kajur
- 11 Ruangan: H5, H20, H19, H18, Lab Teknik Komputasi, dll
- 18 Jadwal Kuliah

**Cara jalankan:**
```powershell
php artisan db:seed
# atau dengan fresh
php artisan migrate:fresh --seed
```

---

#### 2. **[database/seeders/PeminjamanSeeder.php](backend/database/seeders/PeminjamanSeeder.php)**
Seeder untuk test data peminjaman.

```powershell
php artisan db:seed --class=PeminjamanSeeder
```

---

### Factories (Test Data Generators)

#### 1. **[database/factories/UserFactory.php](backend/database/factories/UserFactory.php)**
Generate random user data untuk testing.

```php
User::factory()->create(['role' => 'mahasiswa'])
User::factory()->count(5)->create(['role' => 'admin'])
```

---

#### 2. **[database/factories/RuanganFactory.php](backend/database/factories/RuanganFactory.php)**
Generate random room data.

```php
Ruangan::factory()->create()
```

---

#### 3. **[database/factories/PeminjamanFactory.php](backend/database/factories/PeminjamanFactory.php)**
Generate random booking data.

```php
Peminjaman::factory()->create(['mahasiswa_id' => $user->user_id])
```

---

## 📊 Database Relationship Diagram

```
┌─────────────────────┐
│      users          │
├─────────────────────┤
│ user_id (PK)        │◄─────┐
│ nama                │      │
│ email (UNIQUE)      │      │
│ password            │      │
│ role                │      │
│ nim                 │      │
│ created_at          │      │
└─────────────────────┘      │
                              │
                       FK: mahasiswa_id
                              │
┌─────────────────────┐       │
│     peminjaman      │       │
├─────────────────────┤       │
│ id (PK)             │       │
│ mahasiswa_id ───────┘
│ ruangan_id ──┐
│ tanggal_pinjam
│ jam_mulai
│ jam_selesai
│ keperluan
│ status
│ catatan_admin
│ catatan_kajur
│ file_surat
│ created_at
└─────────────────────┘
                        │
                   FK: ruangan_id
                        │
        ┌───────────────┘
        │
┌───────▼──────────────┐
│       ruangan        │
├──────────────────────┤
│ ruangan_id (PK)      │◄─────┐
│ nama_ruangan         │      │
│ kapasitas            │      │
│ lokasi               │      │
│ keterangan           │      │
│ created_at           │      │
└──────────────────────┘      │
                              │
                       FK: ruangan_id
                              │
        ┌────────────────────┘
        │
┌───────▼──────────────┐
│   jadwal_kuliah      │
├──────────────────────┤
│ id (PK)              │
│ ruangan_id ──────────┘
│ hari
│ jam_mulai
│ jam_selesai
│ kelas
│ dosen
│ created_at
└──────────────────────┘
```

---

## 🔄 Workflow Status Peminjaman

```
Mahasiswa membuat request:
        ↓
    diajukan
        ↓
  Admin review
  ├─→ Approve  → disetujui_admin
  │              ↓
  │           Kajur review
  │           ├─→ Approve → disetujui_kajur ✅ APPROVED
  │           └─→ Reject  → ditolak_kajur ❌ REJECTED
  │
  └─→ Reject   → ditolak_admin ❌ REJECTED
```

---

## 📝 Common Tasks

### Add New API Endpoint

1. **Create method in Controller**
   ```php
   // app/Http/Controllers/PeminjamanController.php
   public function myNewMethod(Request $request)
   {
       // logic here
   }
   ```

2. **Add route in api.php**
   ```php
   // routes/api.php
   Route::post('/peminjaman/my-action', [PeminjamanController::class, 'myNewMethod']);
   ```

3. **Test with Postman or tinker**
   ```powershell
   php artisan tinker
   > $response = Http::post('http://localhost/api/peminjaman/my-action')
   ```

---

### Add New Database Column

1. **Create migration**
   ```powershell
   php artisan make:migration add_new_column_to_peminjaman_table
   ```

2. **Edit migration file**
   ```php
   public function up(): void {
       Schema::table('peminjaman', function (Blueprint $table) {
           $table->string('new_column')->nullable();
       });
   }
   ```

3. **Run migration**
   ```powershell
   php artisan migrate
   ```

---

### Reset Database & Seed

```powershell
# Fresh migrate with seed
php artisan migrate:fresh --seed

# Fresh migrate + testing environment
php artisan migrate:fresh --env=testing --force

# Specific seeder
php artisan db:seed --class=PeminjamanSeeder
```

---

## 🧪 Testing Related Files

- [tests/Feature/UserApiTest.php](backend/tests/Feature/UserApiTest.php) - Auth tests
- [tests/Feature/PeminjamanApiTest.php](backend/tests/Feature/PeminjamanApiTest.php) - Booking tests
- [.env.testing](backend/.env.testing) - Test database config
- [phpunit.xml](backend/phpunit.xml) - PHPUnit configuration

---

**Last Updated:** December 14, 2025
