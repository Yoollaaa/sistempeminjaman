import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PilihRuangan from './pages/PilihRuangan';
import FormPeminjaman from './pages/FormPeminjaman';
import Riwayat from './pages/Riwayat';
import Register from './pages/Register'; // Import Baru
import Admin from './pages/Admin';
import DashboardKajur from './pages/DashboardKajur';
import RequireRole from './components/RequireRole';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* <--- RUTE BARU */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={
          <RequireRole allowed={["admin"]}>
            <Admin />
          </RequireRole>
        } />
        <Route path="/dashboard/kajur" element={
          <RequireRole allowed={["ketua_jurusan"]}>
            <DashboardKajur />
          </RequireRole>
        } />
        <Route path="/pilih-ruangan" element={<PilihRuangan />} />
        <Route path="/ajukan" element={<FormPeminjaman />} />
        <Route path="/riwayat" element={<Riwayat />} />
      </Routes>
    </Router>
  );
}

export default App;