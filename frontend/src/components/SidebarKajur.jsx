import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// 👇 Tambahkan 'Activity' di sini
import { Home, LogOut, BookOpen, PieChart, Activity } from 'lucide-react'; 

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
                <LogOut size={20} /> <span>Keluar</span>
            </button>
        </div>
    );
};

export default SidebarKajur;