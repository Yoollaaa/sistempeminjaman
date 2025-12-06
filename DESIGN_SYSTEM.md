# Design System Konsisten - E-Class

## 📋 Ikhtisar

Semua dashboard (Admin, Kajur, Mahasiswa) sekarang menggunakan **design system unified** dengan:
- ✅ Warna konsisten
- ✅ Font dan ukuran seragam (Inter)
- ✅ Spacing dan radius uniformitas
- ✅ Ikon yang konsisten (Lucide React)
- ✅ Logout button di setiap sidebar
- ✅ Header dengan user info dan logout button

---

## 🎨 Tema Warna (THEME.colors)

| Elemen | Kode | Penggunaan |
|--------|------|-----------|
| **Primary** | `#0ea5e9` (Sky Blue) | Tombol, aksi utama, highlight |
| **Primary Hover** | `#0284c7` | Hover state tombol primary |
| **Primary Light** | `#e0f2fe` | Background, card active |
| **Secondary** | `#64748b` | Teks sekunder, label |
| **Dark Text** | `#0f172a` | Teks utama, heading |
| **Light Text** | `#475569` | Teks lebih terang |
| **Success** | `#10b981` (Green) | Status berhasil |
| **Warning** | `#f59e0b` (Amber) | Status menunggu |
| **Danger** | `#ef4444` (Red) | Status ditolak, logout |
| **White** | `#ffffff` | Background card, modal |
| **Light BG** | `#f8fafc` | Background halaman |
| **Border** | `#e2e8f0` | Garis border |

---

## 🔤 Tipografi (THEME.typography)

Font: **Inter** (600 font weights: 400, 500, 600, 700)

| Tipe | Font Size | Font Weight | Penggunaan |
|------|-----------|------------|-----------|
| **h1** | 2rem | 700 | Judul halaman besar |
| **h2** | 1.5rem | 700 | Judul sub besar |
| **h3** | 1.25rem | 600 | Heading section |
| **h4** | 1.1rem | 600 | Subheading |
| **h5** | 1rem | 600 | Label besar |
| **body** | 0.95rem | 400 | Teks normal |
| **bodySmall** | 0.85rem | 400 | Teks kecil |
| **bodyXSmall** | 0.75rem | 400 | Badge, hint text |
| **button** | 0.95rem | 600 | Tombol |
| **buttonSmall** | 0.85rem | 600 | Tombol kecil |

---

## 📏 Spacing (THEME.spacing)

| Alias | Nilai | Penggunaan |
|-------|-------|-----------|
| **xs** | 4px | Minimal gap |
| **sm** | 8px | Small gap |
| **md** | 12px | Default gap |
| **lg** | 16px | Medium gap |
| **xl** | 24px | Large gap |
| **xxl** | 32px | Extra large gap |

---

## 🎯 Border Radius (THEME.radius)

| Alias | Nilai | Penggunaan |
|-------|-------|-----------|
| **sm** | 4px | Input field |
| **md** | 8px | Button, small card |
| **lg** | 10px | Card, modal |
| **xl** | 12px | Large card |

---

## 🌑 Shadows (THEME.shadows)

| Alias | CSS Value | Penggunaan |
|-------|-----------|-----------|
| **sm** | `0 1px 2px 0 rgba(0,0,0,0.05)` | Subtle shadow |
| **md** | `0 1px 3px 0 rgba(0,0,0,0.1), ...` | Default shadow |
| **lg** | `0 10px 15px -3px rgba(0,0,0,0.1), ...` | Elevated shadow |

---

## 🏗️ Komponen Utama

### 1. **Header.jsx**
Header konsisten untuk semua role dengan:
- Logo/Brand name "E-Class"
- User info (nama, role)
- **Logout button dengan ikon LogOut** (warna danger, border style)
- Toast notification support

**Props:**
```jsx
<Header
  showHeader={true}      // Tampilkan header
  showBrand={true}       // Tampilkan logo
  showUser={true}        // Tampilkan user info
  hideLogout={false}     // Sembunyikan logout button jika true
/>
```

### 2. **Sidebar.jsx** (Mahasiswa)
- Logo dengan icon primary color
- Menu items: Dashboard, Peminjaman Baru, Status Peminjaman, Notifikasi
- **Logout button di footer** (dengan ikon LogOut)
- User profile section dengan avatar

### 3. **SidebarAdmin.jsx**
- Logo dan title "E-Class" + "Panel Administrator"
- Menu items: Dashboard, Kelola Ruangan, Jadwal Kuliah, Verifikasi, Live Monitoring
- **Logout button di footer** (dengan ikon LogOut, warna danger)
- User profile section

### 4. **SidebarKajur.jsx**
- Logo dan title "E-Class" + "Ketua Jurusan"
- Menu items: Verifikasi Pengajuan, Monitoring Ruangan, Laporan Rekapitulasi
- **Logout button di footer** (dengan ikon LogOut, warna danger)
- User profile section

### 5. **DashboardLayout.jsx** (Reusable)
Layout wrapper yang menyatukan:
- Sidebar
- Header (opsional)
- Content area
- User greeting (opsional)

**Props:**
```jsx
<DashboardLayout
  sidebar={<SidebarAdmin />}
  title="Dashboard Admin"
  subtitle="Selamat datang"
  userInfo={user}
  showHeader={true}
  headerActions={<button>...</button>}
>
  {/* Content */}
</DashboardLayout>
```

---

## 📱 Dashboard Pages

### **DashboardAdmin.jsx**
- Grid 3 stat cards: Total Ruangan, Menunggu Verifikasi, Terpakai Hari Ini
- Akses Cepat buttons
- Responsive grid layout

### **DashboardKajur.jsx**
- Stat cards: Perlu Persetujuan, Disetujui Total
- List pengajuan dengan card hover effects
- Perbarui button di header

### **Dashboard.jsx** (Mahasiswa)
- Header greeting + tanggal
- Notification bell dengan dropdown
- Status card (hero gradient)
- Jadwal Peminjaman timeline
- Widgets: Notifikasi, Statistik, Tombol Cepat, Info Akademik

---

## 🎨 Styling Konsistensi

### **Buttons**
```jsx
// Primary Button
style={{
  padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
  backgroundColor: THEME.colors.primary,
  color: THEME.colors.white,
  border: 'none',
  borderRadius: THEME.radius.md,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: THEME.typography.fontFamily,
  transition: 'all 0.2s ease',
}}
onMouseEnter={(e) => e.target.style.backgroundColor = THEME.colors.primaryHover}
onMouseLeave={(e) => e.target.style.backgroundColor = THEME.colors.primary}

// Danger/Logout Button
style={{
  backgroundColor: THEME.colors.danger,
  color: THEME.colors.white,
  // ... same as above
}}
```

### **Cards**
```jsx
style={{
  backgroundColor: THEME.colors.white,
  border: `1px solid ${THEME.colors.border}`,
  borderRadius: THEME.radius.lg,
  padding: THEME.spacing.xl,
  boxShadow: THEME.shadows.md,
  transition: 'all 0.3s ease',
}}
```

### **Text Styles**
```jsx
// Heading
fontSize: THEME.typography.h3.fontSize,
fontWeight: THEME.typography.h3.fontWeight,
color: THEME.colors.darkText,

// Secondary text
color: THEME.colors.secondary,
fontSize: THEME.typography.bodySmall.fontSize,
```

---

## 🔧 Cara Menggunakan

1. **Import THEME:**
```jsx
import { THEME } from '../constants/theme';
```

2. **Gunakan untuk styling:**
```jsx
<div style={{
  padding: THEME.spacing.xl,
  backgroundColor: THEME.colors.white,
  borderRadius: THEME.radius.lg,
  fontFamily: THEME.typography.fontFamily,
}}>
  {/* Content */}
</div>
```

3. **Untuk komponen baru, ikuti pola yang sama:**
- Warna: gunakan `THEME.colors.*`
- Ukuran font: gunakan `THEME.typography.*`
- Spacing: gunakan `THEME.spacing.*`
- Radius: gunakan `THEME.radius.*`
- Shadow: gunakan `THEME.shadows.*`

---

## ✅ Checklist Konsistensi

- [x] Font: Inter di semua komponen
- [x] Warna: Unified palette untuk primary, secondary, status
- [x] Spacing: Konsisten menggunakan THEME.spacing
- [x] Radius: Border radius yang sama di semua card/button
- [x] Shadow: Box shadow yang consistent
- [x] Ikon: Lucide React untuk semua ikon
- [x] Logout button: Ada di setiap sidebar dengan styling danger
- [x] Header: Konsisten dengan user info dan logout button
- [x] Responsive: Grid layout auto-fit di dashboard

---

## 🚀 Deploy & Testing

Pastikan:
1. Cek `frontend/package.json` sudah include `lucide-react`
2. Compile/build tidak ada error
3. Test di ketiga role (Admin, Kajur, Mahasiswa)
4. Cek font loading di network tab browser

---

**Last Updated:** 6 Desember 2025
