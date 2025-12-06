import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';

const Header = ({ showHeader = true, showBrand = true, showUser = true, showBackground = true }) => {
  if (!showHeader) return null;
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

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: showBackground ? '1px solid #e2e8f0' : 'none',
    background: showBackground ? '#ffffff' : 'transparent'
  };

  return (
    <header style={headerStyle}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        {showBrand && (
          <Link to="/dashboard" style={{textDecoration: 'none', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.5px'}}>Sistem Peminjaman</Link>
        )}
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        {user && showUser ? (
          <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#f8fafc', borderRadius: 8}}>
            <div>
              <div style={{color: '#0f172a', fontSize: '0.85rem', fontWeight: 600}}>{user.nama}</div>
              <div style={{color: '#64748b', fontSize: '0.75rem'}}>{user.role}</div>
            </div>
          </div>
        ) : (
          !user ? (
            <Link to="/" style={{color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem'}}>Login</Link>
          ) : null
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
