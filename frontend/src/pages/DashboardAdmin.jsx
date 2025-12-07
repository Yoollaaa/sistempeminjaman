import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORT NAVIGATE
import SidebarAdmin from '../components/SidebarAdmin';
import DashboardLayout from '../components/DashboardLayout';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import { THEME } from '../constants/theme';
import api from '../api';

const DashboardAdmin = () => {
    const navigate = useNavigate(); // 2. INISIALISASI HOOK
    const [stats, setStats] = useState({ totalRuangan: 0, pending: 0, active: 0 });
    const [loading, setLoading] = useState(true);
    
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'Admin' };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reqRuangan = await api.get('/ruangan');
                const reqPeminjaman = await api.get('/peminjaman');
                
                const allPeminjaman = reqPeminjaman.data.data || [];
                const pending = allPeminjaman.filter(p => p.status === 'diajukan').length;
                
                const today = new Date().toISOString().split('T')[0];
                const activeToday = allPeminjaman.filter(p => 
                    (p.status === 'disetujui_kajur' || p.status === 'disetujui_admin') && 
                    p.tanggal_pinjam === today
                ).length;

                setStats({
                    totalRuangan: reqRuangan.data.data.length,
                    pending: pending,
                    active: activeToday
                });
            } catch (e) {
                console.error("Gagal memuat statistik", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Ruangan',
            value: stats.totalRuangan,
            icon: <BookOpen size={24} />,
            color: THEME.colors.primary,
            bgColor: THEME.colors.primaryLight,
        },
        {
            title: 'Menunggu Verifikasi',
            value: stats.pending,
            icon: <Clock size={24} />,
            color: THEME.colors.warning,
            bgColor: THEME.colors.warningLight,
        },
        {
            title: 'Terpakai Hari Ini',
            value: stats.active,
            icon: <CheckCircle size={24} />,
            color: THEME.colors.success,
            bgColor: THEME.colors.successLight,
        },
    ];

    return (
        <DashboardLayout
            sidebar={<SidebarAdmin />}
            title="Dashboard Admin"
            subtitle="Selamat datang di panel kontrol E-Class"
            userInfo={user}
            showHeader={true}
        >
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: THEME.spacing.xl,
                marginBottom: THEME.spacing.xxl,
            }}>
                {statCards.map((card, idx) => (
                    <div
                        key={idx}
                        style={{
                            backgroundColor: THEME.colors.white,
                            border: `1px solid ${THEME.colors.border}`,
                            borderRadius: THEME.radius.lg,
                            padding: THEME.spacing.xl,
                            boxShadow: THEME.shadows.md,
                            display: 'flex',
                            alignItems: 'center',
                            gap: THEME.spacing.lg,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = THEME.shadows.lg;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = THEME.shadows.md;
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60px',
                            height: '60px',
                            backgroundColor: card.bgColor,
                            borderRadius: THEME.radius.md,
                            color: card.color,
                        }}>
                            {card.icon}
                        </div>
                        <div>
                            <h3 style={{
                                fontSize: THEME.typography.h3.fontSize,
                                fontWeight: THEME.typography.h3.fontWeight,
                                margin: 0,
                                color: THEME.colors.darkText,
                            }}>
                                {card.value}
                            </h3>
                            <p style={{
                                fontSize: THEME.typography.bodySmall.fontSize,
                                color: THEME.colors.secondary,
                                margin: `${THEME.spacing.sm} 0 0 0`,
                            }}>
                                {card.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Section Tambahan (Akses Cepat) */}
            <div style={{
                backgroundColor: THEME.colors.white,
                border: `1px solid ${THEME.colors.border}`,
                borderRadius: THEME.radius.lg,
                padding: THEME.spacing.xl,
                boxShadow: THEME.shadows.md,
            }}>
                <h2 style={{
                    fontSize: THEME.typography.h3.fontSize,
                    fontWeight: THEME.typography.h3.fontWeight,
                    margin: `0 0 ${THEME.spacing.lg} 0`,
                    color: THEME.colors.darkText,
                }}>
                    Akses Cepat
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: THEME.spacing.lg,
                }}>
                    {/* TOMBOL 1: KELOLA RUANGAN */}
                    <button 
                        onClick={() => navigate('/admin/ruangan')} // 3. TAMBAHKAN NAVIGASI KE RUANGAN
                        style={{
                            padding: THEME.spacing.lg,
                            backgroundColor: THEME.colors.primaryLight,
                            color: THEME.colors.primary,
                            border: `1px solid ${THEME.colors.primary}`,
                            borderRadius: THEME.radius.md,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: THEME.typography.fontFamily,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = THEME.colors.primary;
                            e.target.style.color = THEME.colors.white;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = THEME.colors.primaryLight;
                            e.target.style.color = THEME.colors.primary;
                        }}
                    >
                        Kelola Ruangan
                    </button>
                    
                    {/* TOMBOL 2: VERIFIKASI PENGAJUAN */}
                    <button 
                        onClick={() => navigate('/admin/verifikasi')} // 4. TAMBAHKAN NAVIGASI KE VERIFIKASI
                        style={{
                            padding: THEME.spacing.lg,
                            backgroundColor: THEME.colors.primaryLight,
                            color: THEME.colors.primary,
                            border: `1px solid ${THEME.colors.primary}`,
                            borderRadius: THEME.radius.md,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: THEME.typography.fontFamily,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = THEME.colors.primary;
                            e.target.style.color = THEME.colors.white;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = THEME.colors.primaryLight;
                            e.target.style.color = THEME.colors.primary;
                        }}
                    >
                        Verifikasi Pengajuan
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DashboardAdmin;