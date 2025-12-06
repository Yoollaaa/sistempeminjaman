import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, PlusSquare, ClipboardList, LogOut, BookOpen } from 'lucide-react';
import { THEME } from '../constants/theme';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'User', role: 'Tamu' };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Komponen Link Menu
    const MenuItem = ({ icon: Icon, label, path }) => {
        const active = location.pathname === path;
        return (
            <div 
                onClick={() => navigate(path)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: THEME.spacing.md,
                    padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
                    margin: `${THEME.spacing.sm} ${THEME.spacing.lg}`,
                    borderRadius: THEME.radius.lg,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: active ? THEME.colors.primaryLight : 'transparent',
                    color: active ? THEME.colors.primary : THEME.colors.secondary,
                    fontWeight: active ? 600 : 500,
                    position: 'relative',
                    fontFamily: THEME.typography.fontFamily,
                }}
                onMouseEnter={(e) => {
                    if (!active) {
                        e.currentTarget.style.backgroundColor = THEME.colors.bgLight;
                    }
                }}
                onMouseLeave={(e) => {
                    if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }
                }}
            >
                <Icon size={20} />
                <span style={{flex: 1}}>{label}</span>
            </div>
        );
    };

    return (
        <div className="sidebar-container" style={{
            width: THEME.layout.sidebarWidth,
            height: '100vh',
            background: THEME.colors.white,
            borderRight: `1px solid ${THEME.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            padding: THEME.spacing.xl,
            boxSizing: 'border-box',
            fontFamily: THEME.typography.fontFamily,
        }}>
            {/* HEADER (BRAND & LOGO) */}
            <div style={{
                padding: THEME.spacing.xl,
                display: 'flex',
                alignItems: 'center',
                gap: THEME.spacing.md,
                borderBottom: `1px solid ${THEME.colors.border}`,
                marginBottom: THEME.spacing.xl,
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
                    <span style={{
                        fontSize: THEME.typography.bodyXSmall.fontSize,
                        color: THEME.colors.secondary,
                    }}>
                        Teknik Elektro
                    </span>
                </div>
            </div>

            {/* MENU ITEMS */}
            <div style={{flex: 1, padding: `0`}}>
                <div style={{
                    padding: `0 ${THEME.spacing.lg} ${THEME.spacing.md}`,
                    fontSize: THEME.typography.bodyXSmall.fontSize,
                    fontWeight: 700,
                    color: THEME.colors.secondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                }}>
                    MENU UTAMA
                </div>
                
                <MenuItem icon={LayoutGrid} label="Dashboard" path="/dashboard" />
                <MenuItem icon={PlusSquare} label="Peminjaman Baru" path="/pilih-ruangan" />
                <MenuItem icon={ClipboardList} label="Status Peminjaman" path="/riwayat" />
            </div>

            {/* PROFILE FOOTER */}
            <div style={{
                padding: THEME.spacing.lg,
                borderTop: `1px solid ${THEME.colors.border}`,
                backgroundColor: THEME.colors.bgLight,
                borderRadius: THEME.radius.lg,
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
                        {user.nama.charAt(0)}
                    </div>
                    <div style={{overflow: 'hidden'}}>
                        <p style={{
                            margin: 0,
                            fontSize: THEME.typography.bodySmall.fontSize,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            color: THEME.colors.darkText,
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
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
                        background: THEME.colors.white,
                        border: `1px solid ${THEME.colors.border}`,
                        borderRadius: THEME.radius.md,
                        color: THEME.colors.danger,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: THEME.typography.bodySmall.fontSize,
                        fontFamily: THEME.typography.fontFamily,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: THEME.spacing.sm,
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = THEME.colors.dangerLight;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = THEME.colors.white;
                    }}
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;