import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, CalendarClock, Activity, LogOut } from 'lucide-react';
import { THEME } from '../constants/theme';

const SidebarAdmin = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'Admin', role: 'Administrator' };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

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
                        Panel Administrator
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
                <NavLink
                    to="/admin"
                    end
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
                        if (!e.target.style.backgroundColor) {
                            e.target.style.backgroundColor = THEME.colors.bgLight;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = e.target.getAttribute('data-active') ? THEME.colors.primaryLight : 'transparent';
                    }}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/admin/ruangan"
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
                        if (!e.currentTarget.style.backgroundColor) {
                            e.currentTarget.style.backgroundColor = THEME.colors.bgLight;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = e.currentTarget.getAttribute('data-active') ? THEME.colors.primaryLight : 'transparent';
                    }}
                >
                    <BookOpen size={20} />
                    <span>Kelola Ruangan</span>
                </NavLink>

                <NavLink
                    to="/admin/jadwal"
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
                        if (!e.currentTarget.style.backgroundColor) {
                            e.currentTarget.style.backgroundColor = THEME.colors.bgLight;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = e.currentTarget.getAttribute('data-active') ? THEME.colors.primaryLight : 'transparent';
                    }}
                >
                    <CalendarClock size={20} />
                    <span>Jadwal Kuliah</span>
                </NavLink>

                <NavLink
                    to="/admin/verifikasi"
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
                        if (!e.currentTarget.style.backgroundColor) {
                            e.currentTarget.style.backgroundColor = THEME.colors.bgLight;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = e.currentTarget.getAttribute('data-active') ? THEME.colors.primaryLight : 'transparent';
                    }}
                >
                    <CheckSquare size={20} />
                    <span>Verifikasi</span>
                </NavLink>

                <NavLink
                    to="/admin/monitoring"
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
                        if (!e.currentTarget.style.backgroundColor) {
                            e.currentTarget.style.backgroundColor = THEME.colors.bgLight;
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = e.currentTarget.getAttribute('data-active') ? THEME.colors.primaryLight : 'transparent';
                    }}
                >
                    <Activity size={20} />
                    <span>Monitoring Kelas</span>
                </NavLink>
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

export default SidebarAdmin;