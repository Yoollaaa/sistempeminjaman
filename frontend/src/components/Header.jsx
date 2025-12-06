import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import api from '../api';
import Toast from './Toast';
import ConfirmModal from './ConfirmModal';
import { THEME } from '../constants/theme';

const Header = ({ showHeader = true, showBrand = true, showUser = true, showBackground = true, hideLogout = false }) => {
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
    padding: `${THEME.spacing.md} ${THEME.spacing.xl}`,
    borderBottom: showBackground ? `1px solid ${THEME.colors.border}` : 'none',
    background: showBackground ? THEME.colors.white : 'transparent',
    height: THEME.layout.headerHeight,
    boxShadow: showBackground ? THEME.shadows.sm : 'none',
    fontFamily: THEME.typography.fontFamily,
  };

  return (
    <header style={headerStyle}>
      <div style={{display: 'flex', alignItems: 'center', gap: THEME.spacing.md}}>
        {showBrand && (
          <Link to="/dashboard" style={{
            textDecoration: 'none',
            color: THEME.colors.darkText,
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '-0.5px',
            fontFamily: THEME.typography.fontFamily,
          }}>
            E-Class
          </Link>
        )}
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: THEME.spacing.lg}}>
        {user && showUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: THEME.spacing.md,
            paddingRight: THEME.spacing.lg,
            borderRight: `1px solid ${THEME.colors.border}`,
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '2px',
            }}>
              <div style={{
                color: THEME.colors.darkText,
                fontSize: THEME.typography.bodySmall.fontSize,
                fontWeight: 600,
                fontFamily: THEME.typography.fontFamily,
              }}>
                {user.nama}
              </div>
              <div style={{
                color: THEME.colors.secondary,
                fontSize: THEME.typography.bodyXSmall.fontSize,
                fontFamily: THEME.typography.fontFamily,
              }}>
                {user.role}
              </div>
            </div>
          </div>
        ) : (
          !user ? (
            <Link to="/" style={{
              color: THEME.colors.primary,
              fontWeight: 600,
              fontSize: THEME.typography.bodySmall.fontSize,
              fontFamily: THEME.typography.fontFamily,
            }}>
              Login
            </Link>
          ) : null
        )}
        
        {!hideLogout && user && (
          <button
            onClick={handleLogout}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: THEME.spacing.sm,
              padding: `${THEME.spacing.sm} ${THEME.spacing.md}`,
              backgroundColor: 'transparent',
              color: THEME.colors.danger,
              border: `1px solid ${THEME.colors.border}`,
              borderRadius: THEME.radius.md,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: THEME.typography.bodySmall.fontSize,
              fontFamily: THEME.typography.fontFamily,
              transition: 'all 0.2s ease',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = THEME.colors.dangerLight;
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={16} />
            Keluar
          </button>
        )}
        
        {message && (
          <Toast message={message} type={messageType} onClose={() => setMessage('')} />
        )}
        <ConfirmModal
          open={confirmOpen}
          title="Konfirmasi Logout"
          message="Apakah Anda yakin ingin keluar dari sistem?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={doLogout}
        />
      </div>
    </header>
  );
};

export default Header;
