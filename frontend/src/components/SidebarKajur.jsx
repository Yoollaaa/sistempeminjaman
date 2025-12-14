import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BookOpen, PieChart, Monitor, LogOut, ClipboardCheck } from 'lucide-react';
import { THEME } from '../constants/theme';

const SidebarKajur = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'Kajur', role: 'Ketua Jurusan' };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const navItems = [
        { 
            path: '/dashboard/kajur', 
            name: 'Dashboard', 
            icon: <Home size={20} /> 
        },
        { 
            path: '/kajur/verifikasi', 
            name: 'Verifikasi Pengajuan', 
            icon: <ClipboardCheck size={20} /> 
        },
        { 
            path: '/kajur/monitoring',   
            name: 'Monitoring Ruangan', 
            icon: <Monitor size={20} /> 
        },
        { 
            path: '/kajur/laporan',   
            name: 'Laporan Rekapitulasi', 
            icon: <PieChart size={20} /> 
        },
    ];

    return (
        <div style={{
            width: THEME.layout.sidebarWidth,
            height: '100vh',
            background: THEME.colors.white,
            borderRight: `1px solid ${THEME.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            padding: THEME.spacing.xl,
            boxSizing: 'border-box',
            fontFamily: THEME.typography.fontFamily,
            position: 'sticky',
            top: 0
        }}>
            {/* HEADER */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: THEME.spacing.md,
                marginBottom: THEME.spacing.xl,
                paddingBottom: THEME.spacing.xl,
                borderBottom: `1px solid ${THEME.colors.border}`,
            }}>
                <div style={{
                    background: THEME.colors.primary,
                    padding: THEME.spacing.md,
                    borderRadius: THEME.radius.md,
                    color: THEME.colors.white,
                }}>
                    <BookOpen size={24} />
                </div>
                <div>
                    <h2 style={{
                        margin: 0,
                        fontSize: THEME.typography.h4.fontSize,
                        fontWeight: 800,
                        color: THEME.colors.darkText,
                    }}>
                        E-Class
                    </h2>
                    <p style={{
                        margin: 0,
                        fontSize: THEME.typography.bodyXSmall.fontSize,
                        color: THEME.colors.secondary,
                    }}>
                        Ketua Jurusan
                    </p>
                </div>
            </div>

            {/* NAVIGATION */}
            <nav style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: THEME.spacing.sm,
            }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard/kajur'} // Pastikan Dashboard hanya aktif jika url pas
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: THEME.spacing.md,
                            padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
                            borderRadius: THEME.radius.lg,
                            textDecoration: 'none',
                            fontWeight: 600,
                            color: isActive ? THEME.colors.primary : THEME.colors.secondary,
                            backgroundColor: isActive ? THEME.colors.primaryLight : 'transparent',
                            transition: 'all 0.2s ease',
                            fontFamily: THEME.typography.fontFamily,
                        })}
                        onMouseEnter={(e) => {
                            const style = window.getComputedStyle(e.currentTarget);
                            if (style.backgroundColor === 'transparent' || style.backgroundColor === 'rgba(0, 0, 0, 0)') {
                                e.currentTarget.style.backgroundColor = THEME.colors.bgLight;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!e.currentTarget.getAttribute('data-active')) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* PROFILE FOOTER */}
            <div style={{
                padding: THEME.spacing.lg,
                borderTop: `1px solid ${THEME.colors.border}`,
                backgroundColor: THEME.colors.bgLight,
                borderRadius: THEME.radius.lg,
                marginBottom: THEME.spacing.lg,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: THEME.spacing.md,
                    marginBottom: THEME.spacing.lg,
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: THEME.colors.primary,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: THEME.colors.white,
                        fontSize: THEME.typography.button.fontSize,
                    }}>
                        {user.nama ? user.nama.charAt(0).toUpperCase() : 'K'}
                    </div>
                    <div style={{overflow: 'hidden'}}>
                        <p style={{
                            margin: 0,
                            fontSize: THEME.typography.bodySmall.fontSize,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            color: THEME.colors.darkText,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {user.nama}
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: THEME.typography.bodyXSmall.fontSize,
                            color: THEME.colors.secondary,
                        }}>
                            {user.role}
                        </p>
                    </div>
                </div>
            </div>

            {/* LOGOUT BUTTON */}
            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: THEME.spacing.md,
                    width: '100%',
                    padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
                    backgroundColor: THEME.colors.danger,
                    color: THEME.colors.white,
                    border: 'none',
                    borderRadius: THEME.radius.md,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: THEME.typography.bodySmall.fontSize,
                    fontFamily: THEME.typography.fontFamily,
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = THEME.colors.danger;
                }}
            >
                <LogOut size={18} />
                Keluar
            </button>
        </div>
    );
};

export default SidebarKajur;