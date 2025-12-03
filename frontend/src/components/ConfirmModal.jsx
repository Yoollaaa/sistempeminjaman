import React from 'react';

const ConfirmModal = ({ open, title = 'Konfirmasi', message = 'Yakin?', onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div style={{position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.45)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 'min(560px, 92%)', background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 10px 40px rgba(2,6,23,0.2)'}}>
        <h3 style={{margin: 0, marginBottom: 8}}>{title}</h3>
        <p style={{margin: 0, color: '#475569', marginBottom: 18}}>{message}</p>
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: 10}}>
          <button onClick={onCancel} style={{padding: '8px 12px', borderRadius: 8, background: '#e2e8f0', border: 'none', cursor: 'pointer'}}>Batal</button>
          <button onClick={onConfirm} style={{padding: '8px 12px', borderRadius: 8, background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer'}}>Keluar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
