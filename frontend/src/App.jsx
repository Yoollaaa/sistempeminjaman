import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// --- IMPORT COMPONENT UMUM ---
import Login from './pages/Login';
import Register from './pages/Register'; 
import RequireRole from './components/RequireRole';
import Header from './components/Header'; // Header khusus Mahasiswa/Umum

// --- IMPORT HALAMAN MAHASISWA ---
import Dashboard from './pages/Dashboard';
import PilihRuangan from './pages/PilihRuangan';
import FormPeminjaman from './pages/FormPeminjaman';
import Riwayat from './pages/Riwayat';

// --- IMPORT HALAMAN ADMIN (BARU) ---
// Pastikan folder penyimpanannya sesuai, misal di folder src/pages/admin/
import DashboardAdmin from './pages/DashboardAdmin';
import KelolaRuangan from './pages/KelolaRuangan';
import KelolaJadwal from './pages/KelolaJadwal';
import VerifikasiPeminjaman from './pages/VerifikasiPeminjaman';

// --- IMPORT HALAMAN KAJUR ---
import DashboardKajur from './pages/DashboardKajur';
import DetailPengajuan from './pages/DetailPengajuan';
import LaporanKajur from './pages/LaporanKajur';
import LiveMonitoring from './pages/LiveMonitoring';

// Layout Khusus Mahasiswa (Agar Header hanya muncul di halaman mahasiswa)
const LayoutMahasiswa = () => {
  useEffect(() => {
    document.body.classList.add('hide-header');
    return () => {
      document.body.classList.remove('hide-header');
    };
  }, []);

  return (
    <>
      <Header showHeader={false} showBrand={false} showUser={false} showBackground={false} />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login & Register (Tanpa Header & Sidebar) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- GROUP RUTE MAHASISWA (Pakai Header) --- */}
        <Route element={<LayoutMahasiswa />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pilih-ruangan" element={<PilihRuangan />} />
            <Route path="/ajukan" element={<FormPeminjaman />} />
            <Route path="/riwayat" element={<Riwayat />} />
        </Route>

        {/* --- GROUP RUTE ADMIN (Pakai SidebarAdmin di dalam halamannya) --- */}
        <Route path="/admin" element={
          <RequireRole allowed={["admin"]}>
            <DashboardAdmin />
          </RequireRole>
        } />
        
        <Route path="/admin/ruangan" element={
          <RequireRole allowed={["admin"]}>
            <KelolaRuangan />
          </RequireRole>
        } />

        <Route path="/admin/jadwal" element={
          <RequireRole allowed={["admin"]}>
            <KelolaJadwal />
          </RequireRole>
        } />

        <Route path="/admin/verifikasi" element={
          <RequireRole allowed={["admin"]}>
            <VerifikasiPeminjaman />
          </RequireRole>
        } />
        {/* Route untuk Admin */}
<Route path="/admin/monitoring" element={<LiveMonitoring role="admin" />} />

        {/* --- GROUP RUTE KAJUR --- */}
        {/* 1. Dashboard Kajur */}
        <Route path="/dashboard/kajur" element={
          <RequireRole allowed={["ketua_jurusan"]}>
            <DashboardKajur />
          </RequireRole>
        } />
        
        {/* 2. Detail Pengajuan */}
        <Route path="/kajur/detail/:id" element={
          <RequireRole allowed={["ketua_jurusan"]}>
            <DetailPengajuan />
          </RequireRole>
        } />

        {/* 3. Laporan Rekapitulasi */}
        <Route path="/kajur/laporan" element={
          <RequireRole allowed={["ketua_jurusan"]}>
            <LaporanKajur />
          </RequireRole>
        } />
        {/* Route untuk Kajur */}
<Route path="/kajur/monitoring" element={<LiveMonitoring role="kajur" />} />

      </Routes>
    </Router>
  );
}

export default App;