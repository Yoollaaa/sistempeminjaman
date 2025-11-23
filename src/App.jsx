import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FormPeminjaman from './pages/FormPeminjaman';
import Riwayat from './pages/Riwayat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ajukan" element={<FormPeminjaman />} />
        <Route path="/riwayat" element={<Riwayat />} />
      </Routes>
    </Router>
  );
}

export default App;