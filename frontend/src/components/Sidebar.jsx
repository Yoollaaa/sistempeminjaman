import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, LayoutDashboard, PlusSquare, ClipboardList, LogOut, BookOpen, Bell } from 'lucide-react'; // Import Bell

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'User', role: 'Tamu' };
    
    // DATA DUMMY: Simulasikan ada 1 notifikasi yang belum dibaca
    const unreadNotifCount = 1; 

    // Komponen Link Menu
    const MenuItem = ({ icon: Icon, label, path, count }) => {
        const active = location.pathname === path;
        return (
            <div 
                onClick={() => navigate(path)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', margin: '4px 16px', borderRadius: '8px',
                    cursor: 'pointer', transition: '0.2s',
                    backgroundColor: active ? '#f0f9ff' : 'transparent',
                    color: active ? '#0284c7' : '#64748b',
                    fontWeight: active ? 600 : 500,
                    position: 'relative'
                }}
            >
                <Icon size={20} />
                <span style={{flex: 1}}>{label}</span>
                
                {/* NOTIFIKASI BADGE (KF 6) */}
                {count > 0 && (
                    <span style={{
                        background: '#ef4444', color: 'white', 
                        fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', 
                        fontWeight: 700, 
                    }}>
                        {count}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="sidebar-container">
            {/* HEADER (BRAND & LOGO) */}
            <div style={{padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #e2e8f0'}}>
                {/* Logo Warna Primer */}
                <div style={{background: '#0284c7', padding: 8, borderRadius: 8, color: 'white'}}>
                    <BookOpen size={24} />
                </div>
                <div>
                    <h2 style={{margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a'}}>E-Class</h2>
                    <span style={{fontSize: '0.75rem', color: '#64748b'}}>Teknik Elektro</span>
                </div>
            </div>

            {/* MENU ITEMS */}
            <div style={{flex: 1, padding: '16px 0'}}>
                <div style={{padding: '0 20px 10px', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8'}}>MENU UTAMA</div>
                
                <MenuItem icon={LayoutGrid} label="Dashboard" path="/dashboard" />
                <MenuItem icon={PlusSquare} label="Peminjaman Baru" path="/pilih-ruangan" />
                
                {/* Status Peminjaman (Riwayat) */}
                <MenuItem icon={ClipboardList} label="Status Peminjaman" path="/riwayat" />

                {/* Notifikasi (Menggantikan Lonceng) */}
                <MenuItem icon={Bell} label="Notifikasi" path="/notifikasi" count={unreadNotifCount} />
            </div>

            {/* PROFILE FOOTER */}
            <div style={{padding: '20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
                    <div style={{width: 40, height: 40, background: '#cbd5e1', borderRadius: '50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', color:'#475569'}}>
                        {user.nama.charAt(0)}
                    </div>
                    <div style={{overflow: 'hidden'}}>
                        <p style={{margin: 0, fontSize: '0.9rem', fontWeight: 600, whiteSpace:'nowrap'}}>{user.nama}</p>
                        <p style={{margin: 0, fontSize: '0.75rem', color: '#64748b'}}>{user.role}</p>
                    </div>
                </div>
                <button onClick={() => {localStorage.clear(); navigate('/')}} style={{width: '100%', padding: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem'}}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;