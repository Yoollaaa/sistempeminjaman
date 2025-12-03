import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3200 }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bg = type === 'error' ? '#fee2e2' : type === 'success' ? '#ecfdf5' : '#eef2ff';
  const color = type === 'error' ? '#b91c1c' : type === 'success' ? '#065f46' : '#374151';

  return (
    <div style={{
      position: 'fixed',
      right: 20,
      top: 20,
      zIndex: 9999,
      minWidth: 240,
      maxWidth: 360,
      background: bg,
      color: color,
      padding: '12px 14px',
      borderRadius: 10,
      boxShadow: '0 8px 24px rgba(2,6,23,0.08)',
      border: '1px solid rgba(0,0,0,0.03)'
    }}>
      <div style={{fontWeight: 700, marginBottom: 6, fontSize: '0.95rem'}}>{type === 'error' ? 'Kesalahan' : type === 'success' ? 'Berhasil' : 'Info'}</div>
      <div style={{fontSize: '0.9rem', color}}>{message}</div>
    </div>
  );
};

export default Toast;
