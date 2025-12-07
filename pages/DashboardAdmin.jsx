import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';
import DashboardLayout from '../components/DashboardLayout';
import { BookOpen, Clock, CheckCircle, User, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { THEME } from '../constants/theme';
import api from '../api';

const DashboardAdmin = () => {
    const navigate = useNavigate();
    
    // State Statistik & Data List
    const [stats, setStats] = useState({ totalRuangan: 0, pending: 0, active: 0 });
    const [pendingList, setPendingList] = useState([]); // State untuk list verifikasi
    const [loading, setLoading] = useState(true);
    
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'Admin' };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reqRuangan = await api.get('/ruangan');
                const reqPeminjaman = await api.get('/peminjaman');
                
                const allPeminjaman = reqPeminjaman.data.data || [];
                
                // Filter Pending (Diajukan)
                const pendingItems = allPeminjaman.filter(p => p.status === 'diajukan');
                
                // Filter Active Today
                const today = new Date().toISOString().split('T')[0];
                const activeToday = allPeminjaman.filter(p => 
                    (p.status === 'disetujui_kajur' || p.status === 'disetujui_admin') && 
                    p.tanggal_pinjam === today
                ).length;

                // Update State Statistik
                setStats({
                    totalRuangan: reqRuangan.data.data.length,
                    pending: pendingItems.length,
                    active: activeToday
                });

                // Update State List (Ambil 4 terbaru)
                setPendingList(pendingItems.slice(0, 4));

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

    // Helper format tanggal
    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <DashboardLayout
            sidebar={<SidebarAdmin />}
            title="Dashboard Admin"
            subtitle="Selamat datang di panel kontrol E-Class"
            userInfo={user}
            showHeader={true}
        >
            {/* GRID STATISTIK (Tetap Sama) */}
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

            {/* --- SECTION BARU: DAFTAR YANG PERLU VERIFIKASI --- */}
            <div style={{
                backgroundColor: THEME.colors.white,
                border: `1px solid ${THEME.colors.border}`,
                borderRadius: THEME.radius.lg,
                padding: THEME.spacing.xl,
                boxShadow: THEME.shadows.md,
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: THEME.spacing.lg}}>
                    <h2 style={{
                        fontSize: THEME.typography.h3.fontSize,
                        fontWeight: THEME.typography.h3.fontWeight,
                        margin: 0,
                        color: THEME.colors.darkText,
                        display: 'flex', alignItems: 'center', gap: 10
                    }}>
                        <AlertCircle size={20} color={THEME.colors.warning} />
                        Perlu Verifikasi
                    </h2>
                    
                    {/* Link ke halaman Verifikasi Penuh */}
                    <button 
                        onClick={() => navigate('/admin/verifikasi')}
                        style={{
                            background: 'none', border: 'none', 
                            color: THEME.colors.primary, 
                            fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 5,
                            fontSize: '0.9rem'
                        }}
                    >
                        Lihat Semua <ArrowRight size={16} />
                    </button>
                </div>

                {/* LOGIC TAMPILAN LIST */}
                {loading ? (
                    <p style={{color: '#94a3b8', textAlign: 'center', padding: 20}}>Memuat data...</p>
                ) : pendingList.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '30px', 
                        background: '#f8fafc', borderRadius: 8, 
                        border: '1px dashed #cbd5e1'
                    }}>
                        <CheckCircle size={32} color="#94a3b8" style={{marginBottom: 10, display: 'block', margin: '0 auto 10px'}} />
                        <p style={{color: '#64748b', margin: 0}}>Tidak ada pengajuan baru yang perlu diverifikasi.</p>
                    </div>
                ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
                        {pendingList.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '15px',
                                border: '1px solid #e2e8f0',
                                borderRadius: 8,
                                background: '#fff',
                                transition: 'all 0.2s',
                            }}>
                                {/* Bagian Kiri: Info Peminjam & Ruangan */}
                                <div style={{display: 'flex', gap: 15, alignItems: 'center'}}>
                                    {/* Icon Avatar Sederhana */}
                                    <div style={{
                                        width: 45, height: 45, borderRadius: '50%', 
                                        background: '#f1f5f9', display: 'flex', 
                                        alignItems: 'center', justifyContent: 'center',
                                        color: '#64748b'
                                    }}>
                                        <User size={20} />
                                    </div>

                                    <div>
                                        <h4 style={{margin: '0 0 4px 0', fontSize: '1rem', color: '#1e293b'}}>
                                            {item.nama_mahasiswa || 'Mahasiswa'} 
                                            <span style={{fontWeight: 400, color: '#64748b', fontSize: '0.9rem'}}> • {item.keperluan}</span>
                                        </h4>
                                        <div style={{display: 'flex', gap: 15, fontSize: '0.85rem', color: '#64748b'}}>
                                            <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
                                                <BookOpen size={14}/> {item.nama_ruangan || 'Ruangan'}
                                            </span>
                                            <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
                                                <Calendar size={14}/> {formatDate(item.tanggal_pinjam)}
                                            </span>
                                            <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
                                                <Clock size={14}/> {item.jam_mulai?.substring(0,5)} - {item.jam_selesai?.substring(0,5)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bagian Kanan: Tombol Aksi Cepat */}
                                <button 
                                    onClick={() => navigate('/admin/verifikasi')}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: 6,
                                        border: '1px solid #e2e8f0',
                                        background: 'white',
                                        color: '#0f172a',
                                        fontWeight: 600,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                    onMouseLeave={(e) => e.target.style.background = 'white'}
                                >
                                    Tinjau
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DashboardAdmin;