import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// Tambahkan import 'Activity' atau 'Monitor'
import { LayoutDashboard, BookOpen, CheckSquare, LogOut, CalendarClock, Activity } from 'lucide-react';

const SidebarAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-box"><BookOpen size={24} color="white"/></div>
                <div className="logo-text">
                    <h2>E-Class Admin</h2>
                    <p>Panel Administrator</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/admin" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <LayoutDashboard size={18}/> <span>Dashboard</span>
                </NavLink>
                
                <NavLink to="/admin/ruangan" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <BookOpen size={18}/> <span>Kelola Ruangan</span>
                </NavLink>

                <NavLink to="/admin/jadwal" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <CalendarClock size={18}/> <span>Jadwal Kuliah</span>
                </NavLink>

                <NavLink to="/admin/verifikasi" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <CheckSquare size={18}/> <span>Verifikasi</span>
                </NavLink>

                {/* --- MENU BARU: LIVE MONITORING --- */}
                <NavLink to="/admin/monitoring" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Activity size={18}/> <span>Live Monitoring</span>
                </NavLink>
            </nav>

            <button onClick={handleLogout} className="btn-logout">
                <LogOut size={18}/> Keluar
            </button>
        </div>
    );
};

export default SidebarAdmin;