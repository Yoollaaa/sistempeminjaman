import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, PieChart, Activity } from 'lucide-react'; 

const SidebarKajur = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const navItems = [
        { 
            path: '/dashboard/kajur', 
            name: 'Verifikasi Pengajuan', 
            icon: <Home size={20} /> 
        },
        // 👇 Menu ini sekarang akan muncul dengan benar
        { 
            path: '/kajur/monitoring',   
            name: 'Monitoring Ruangan', 
            icon: <Activity size={20} /> 
        },
        { 
            path: '/kajur/laporan',   
            name: 'Laporan Rekapitulasi', 
            icon: <PieChart size={20} /> 
        },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-box">
                    <BookOpen size={24} color="white"/> {/* Tambahkan color="white" biar ikon terlihat jika background biru */}
                </div>
                <div className="logo-text">
                    <h2>E-Class</h2>
                    <p>Teknik Elektro</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard/kajur'} 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    >
                        {item.icon} <span>{item.name}</span> {/* Bungkus nama dengan span agar rapi */}
                    </NavLink>
                ))}
            </nav>

            <button onClick={handleLogout} className="btn-logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Keluar</span>
            </button>
        </div>
    );
};

export default SidebarKajur;