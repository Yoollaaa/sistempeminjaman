import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';

const Header = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    // Open custom confirm modal
    setConfirmOpen(true);
  };

  const doLogout = async () => {
    setConfirmOpen(false);
    setMessage('');
    setMessageType('info');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/logout');
        setMessageType('success');
        setMessage('Anda berhasil logout.');
      } catch (e) {
        if (e?.response?.status === 401) {
          setMessageType('error');
          setMessage('Token tidak valid atau sudah kadaluarsa. Anda akan dikeluarkan.');
        } else if (e?.response?.data?.message) {
          setMessageType('error');
          setMessage(String(e.response.data.message));
        } else {
          setMessageType('error');
          setMessage('Gagal menghubungi server saat logout. Anda tetap keluar di sisi klien.');
        }
        console.warn('Logout request failed:', e?.response || e.message || e);
      }
    } else {
      setMessageType('info');
      setMessage('Anda keluar dari sesi.');
    }

    // Always clear client state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLoading(false);
    // navigate after short delay so user sees toast
    setTimeout(() => navigate('/'), 800);
  };

  // Read user for display (if present)
  let user = null;
  try {
    const raw = localStorage.getItem('user');
    if (raw) user = JSON.parse(raw);
  } catch (e) {
    user = null;
  }

  return (
    <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #e6eef6', background: '#ffffff'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <Link to="/dashboard" style={{textDecoration: 'none', color: '#0f172a', fontWeight: 700, fontSize: '1rem'}}>Sistem Peminjaman</Link>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        {user ? (
          <>
            <div style={{color: '#0f172a', fontSize: '0.95rem'}}>{user.nama} <span style={{color: '#64748b', fontWeight: 600}}>({user.role})</span></div>
            <button onClick={handleLogout} disabled={loading} style={{padding: '8px 12px', background: loading ? '#fca5a5' : '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer'}}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <Link to="/" style={{color: '#0284c7', fontWeight: 700}}>Login</Link>
        )}
        {message && (
          <Toast message={message} type={messageType} onClose={() => setMessage('')} />
        )}
        <ConfirmModal open={confirmOpen} title="Konfirmasi Logout" message="Apakah Anda yakin ingin keluar?" onCancel={() => setConfirmOpen(false)} onConfirm={doLogout} />
      </div>
    </header>
  );
};

export default Header;
