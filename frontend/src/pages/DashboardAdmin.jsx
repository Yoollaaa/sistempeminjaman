import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import { BookOpen, Clock, CheckCircle, Calendar, MapPin, User, Loader2, AlertCircle, RefreshCcw } from 'lucide-react'; // Tambah icon Refresh
import { THEME } from '../constants/theme';
import api from '../api';

const DashboardAdmin = () => {
    // State Statistik & List Peminjam
    const [stats, setStats] = useState({ totalRuangan: 0, pending: 0, active: 0 });
    const [activeList, setActiveList] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Tambah State Error

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Ambil data dari API
            const [reqRuangan, reqPeminjaman] = await Promise.all([
                api.get('/ruangan'),
                api.get('/peminjaman')
            ]);
            
            const allPeminjaman = reqPeminjaman.data.data || [];
            
            // --- LOGIC TANGGAL HARI INI ---
            // Menggunakan method yang lebih aman untuk local time Indonesia
            const now = new Date();
            const today = now.toLocaleDateString('en-CA'); // Format YYYY-MM-DD sesuai zona waktu lokal browser
            // ------------------------------
            
            // 2. Hitung Statistik KHUSUS ADMIN
            
            // a. Pending: Yang statusnya 'diajukan'
            const pendingCount = allPeminjaman.filter(p => p.status === 'diajukan').length;
            
            // b. Filter Peminjaman HARI INI (Aktif)
            const todaysBookings = allPeminjaman.filter(p => 
                (p.status === 'disetujui_kajur' || p.status === 'disetujui_admin') && 
                (p.tanggal_pinjam === today)
            );

            // c. Urutkan berdasarkan jam mulai
            todaysBookings.sort((a, b) => {
                const timeA = formatTime(a.jam_mulai);
                const timeB = formatTime(b.jam_mulai);
                return timeA.localeCompare(timeB);
            });

            setStats({
                totalRuangan: reqRuangan.data.data.length,
                pending: pendingCount,
                active: todaysBookings.length
            });

            setActiveList(todaysBookings);

        } catch (e) {
            console.error("Gagal memuat dashboard admin", e);
            setError("Gagal memuat data dashboard. Pastikan server backend berjalan.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    // --- HELPER: FORMAT JAM PINTAR ---
    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        if (timeString.includes(' ')) return timeString.split(' ')[1].substring(0, 5);
        if (timeString.includes('T')) return timeString.split('T')[1].substring(0, 5);
        return timeString.substring(0, 5);
    };

    // Helper: Cek apakah jam sekarang masuk dalam range peminjaman
    const isNow = (startRaw, endRaw) => {
        if(!startRaw || !endRaw) return false;
        
        const now = new Date();
        // Dapatkan HH:MM format 24 jam lokal
        const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        
        const start = formatTime(startRaw); 
        const end = formatTime(endRaw);
        
        return currentTime >= start && currentTime <= end;
    };

    // Kartu Statistik Admin
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
            icon: <AlertCircle size={24} />, 
            color: '#f59e0b', // Orange
            bgColor: '#fef3c7',
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
        <div className="app-layout">
            <SidebarAdmin />
            <div className="content-container">
                
                {/* HEADER HALAMAN */}
                <div style={{marginBottom: 30}}>
                    <h1 style={{fontSize: '1.8rem', fontWeight: 700, margin: '0 0 5px 0', color: '#0f172a'}}>Dashboard Admin</h1>
                    <p style={{color: '#64748b', margin: 0}}>Ringkasan aktivitas dan penggunaan ruangan hari ini.</p>
                </div>

                {/* ERROR STATE */}
                {error && (
                    <div style={{
                        marginBottom: 30, padding: 20, background: '#fee2e2', 
                        border: '1px solid #ef4444', borderRadius: 12, color: '#b91c1c',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                            <AlertCircle size={24}/>
                            <span>{error}</span>
                        </div>
                        <button onClick={fetchData} style={{
                            padding: '8px 16px', background: '#fff', border: '1px solid #b91c1c',
                            borderRadius: 6, color: '#b91c1c', cursor: 'pointer', fontWeight: 600
                        }}>
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* 1. GRID STATISTIK */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 20,
                    marginBottom: 30,
                }}>
                    {statCards.map((card, idx) => (
                        <div key={idx} className="card" style={{
                            padding: 24,
                            display: 'flex', alignItems: 'center', gap: 20,
                            background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '60px', height: '60px',
                                backgroundColor: card.bgColor, borderRadius: 12,
                                color: card.color,
                            }}>
                                {card.icon}
                            </div>
                            <div>
                                <h3 style={{fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#1e293b'}}>
                                    {loading ? '...' : card.value}
                                </h3>
                                <p style={{fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0 0'}}>
                                    {card.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. JADWAL PEMINJAMAN HARI INI */}
                <div className="card" style={{padding: 24, background: 'white', borderRadius: 12, border: '1px solid #e2e8f0'}}>
                    
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20}}>
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                            <div style={{background: '#dbeafe', padding:8, borderRadius:6}}>
                                <Calendar size={20} color="#2563eb" />
                            </div>
                            <div>
                                <h2 style={{fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#0f172a'}}>
                                    Jadwal Peminjaman Hari Ini
                                </h2>
                                <p style={{margin:0, fontSize:'0.85rem', color:'#64748b'}}>Daftar penggunaan ruangan yang aktif hari ini.</p>
                            </div>
                        </div>
                        <button onClick={fetchData} title="Refresh Data" style={{background:'none', border:'none', cursor:'pointer', color:'#64748b'}}>
                            <RefreshCcw size={20}/>
                        </button>
                    </div>

                    {loading ? (
                        <div style={{textAlign:'center', padding:40, color:'#94a3b8'}}>
                            <Loader2 className="animate-spin" style={{margin:'0 auto 10px'}} />
                            Memuat data...
                        </div>
                    ) : activeList.length === 0 ? (
                        <div style={{textAlign:'center', padding: '40px 20px', background:'#f8fafc', borderRadius:8, border:'1px dashed #cbd5e1'}}>
                            <CheckCircle size={32} color="#94a3b8" style={{margin:'0 auto 10px'}} />
                            <p style={{color:'#64748b', margin:0}}>Tidak ada ruangan yang digunakan hari ini.</p>
                        </div>
                    ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
                            {activeList.map((item, index) => {
                                const isActiveNow = isNow(item.jam_mulai, item.jam_selesai);
                                const startTime = formatTime(item.jam_mulai);
                                const endTime = formatTime(item.jam_selesai);

                                return (
                                    <div key={index} style={{
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '16px',
                                        borderRadius: 12,
                                        border: isActiveNow ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                                        background: isActiveNow ? '#eff6ff' : 'white',
                                        transition: 'transform 0.2s',
                                    }}>
                                        {/* KIRI: Info Peminjam */}
                                        <div style={{display: 'flex', gap: 15, alignItems: 'center'}}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: '50%', 
                                                background: isActiveNow ? '#2563eb' : '#f1f5f9',
                                                color: isActiveNow ? 'white' : '#64748b',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.2rem', fontWeight: 700
                                            }}>
                                                {item.nama_mahasiswa ? item.nama_mahasiswa.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            
                                            <div>
                                                <h4 style={{margin: '0 0 4px 0', fontSize: '1rem', color: '#1e293b'}}>
                                                    {item.nama_mahasiswa || 'Mahasiswa (Terhapus)'}
                                                    {isActiveNow && (
                                                        <span style={{
                                                            marginLeft:8, fontSize:'0.7rem', background:'#2563eb', 
                                                            color:'white', padding:'2px 8px', borderRadius:20, verticalAlign: 'middle'
                                                        }}>
                                                            SEDANG BERLANGSUNG
                                                        </span>
                                                    )}
                                                </h4>
                                                <div style={{display:'flex', alignItems:'center', gap:5, fontSize: '0.85rem', color: '#64748b'}}>
                                                    <User size={14}/> {item.keperluan}
                                                </div>
                                            </div>
                                        </div>

                                        {/* KANAN: Info Ruangan & Waktu */}
                                        <div style={{textAlign: 'right'}}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', 
                                                gap: 6, marginBottom: 4, fontWeight: 600, color: '#0f172a'
                                            }}>
                                                <MapPin size={16} color="#0ea5e9"/> {item.nama_ruangan || 'Ruangan ?'}
                                            </div>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', 
                                                gap: 6, fontSize: '0.95rem', 
                                                color: isActiveNow ? '#1d4ed8' : '#475569', 
                                                fontWeight: isActiveNow ? 700 : 500
                                            }}>
                                                <Clock size={16} color={isActiveNow ? '#1d4ed8' : '#64748b'} /> 
                                                {startTime} - {endTime} WIB
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DashboardAdmin;