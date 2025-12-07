import React, { useEffect, useState } from 'react';
import SidebarKajur from '../components/SidebarKajur';
import { BookOpen, Clock, CheckCircle, Calendar, MapPin, User, Loader2 } from 'lucide-react';
import { THEME } from '../constants/theme';
import api from '../api';

const DashboardKajur = () => {
    // State Statistik & List Peminjam
    const [stats, setStats] = useState({ totalRuangan: 0, pending: 0, active: 0 });
    const [activeList, setActiveList] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Ambil data dari API
                const [reqRuangan, reqPeminjaman] = await Promise.all([
                    api.get('/ruangan'),
                    api.get('/peminjaman')
                ]);
                
                const allPeminjaman = reqPeminjaman.data.data || [];
                
                // --- LOGIC TANGGAL HARI INI (WIB/Lokal) ---
                const now = new Date();
                const offset = now.getTimezoneOffset(); 
                const today = new Date(now.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
                // ------------------------------------------
                
                // 2. Hitung Statistik
                const pendingCount = allPeminjaman.filter(p => p.status === 'disetujui_admin').length;
                
                const todaysBookings = allPeminjaman.filter(p => 
                    p.status === 'disetujui_kajur' && 
                    (p.tanggal_pinjam === today || (p.tanggal_pinjam && p.tanggal_pinjam.startsWith(today)))
                );

                // Urutkan berdasarkan jam mulai
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
                console.error("Gagal memuat dashboard kajur", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- HELPER: FORMAT JAM YANG LEBIH PINTAR ---
    // Mengatasi masalah "2025-" yang muncul
    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        
        // 1. Jika formatnya "YYYY-MM-DD HH:MM:SS" (ada spasi)
        if (timeString.includes(' ')) {
            return timeString.split(' ')[1].substring(0, 5);
        }
        
        // 2. Jika formatnya "YYYY-MM-DDTHH:MM:SS" (ISO format)
        if (timeString.includes('T')) {
            return timeString.split('T')[1].substring(0, 5);
        }

        // 3. Jika formatnya sudah "HH:MM:SS"
        return timeString.substring(0, 5);
    };

    // Helper: Cek apakah jam sekarang masuk dalam range peminjaman
    const isNow = (startRaw, endRaw) => {
        if(!startRaw || !endRaw) return false;
        
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
        
        // Pastikan kita membandingkan format jam saja (HH:MM)
        const start = formatTime(startRaw); 
        const end = formatTime(endRaw);
        
        // Perbandingan string sederhana "08:00" <= "09:00"
        return currentTime.substring(0,5) >= start && currentTime.substring(0,5) <= end;
    };

    const statCards = [
        {
            title: 'Total Ruangan',
            value: stats.totalRuangan,
            icon: <BookOpen size={24} />,
            color: THEME.colors.primary,
            bgColor: THEME.colors.primaryLight,
        },
        {
            title: 'Perlu Persetujuan', 
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
        <div className="app-layout">
            <SidebarKajur />
            <div className="content-container">
                
                {/* HEADER HALAMAN */}
                <div style={{marginBottom: 30}}>
                    <h1 style={{fontSize: '1.8rem', fontWeight: 700, margin: '0 0 5px 0', color: '#0f172a'}}>Dashboard Kajur</h1>
                    <p style={{color: '#64748b', margin: 0}}>Ringkasan aktivitas dan penggunaan ruangan hari ini.</p>
                </div>

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
                    
                    <div style={{display:'flex', alignItems:'center', gap:10, marginBottom: 20}}>
                        <div style={{background: '#dbeafe', padding:8, borderRadius:6}}>
                            <Calendar size={20} color="#2563eb" />
                        </div>
                        <div>
                            <h2 style={{fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#0f172a'}}>
                                Jadwal Peminjaman Hari Ini
                            </h2>
                            <p style={{margin:0, fontSize:'0.85rem', color:'#64748b'}}>Daftar mahasiswa yang menggunakan ruangan hari ini.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{textAlign:'center', padding:40, color:'#94a3b8'}}>
                            <Loader2 className="animate-spin" style={{margin:'0 auto 10px'}} />
                            Memuat data...
                        </div>
                    ) : activeList.length === 0 ? (
                        <div style={{textAlign:'center', padding: '40px 20px', background:'#f8fafc', borderRadius:8, border:'1px dashed #cbd5e1'}}>
                            <CheckCircle size={32} color="#94a3b8" style={{margin:'0 auto 10px'}} />
                            <p style={{color:'#64748b', margin:0}}>Tidak ada ruangan yang dipinjam hari ini.</p>
                        </div>
                    ) : (
                        <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
                            {activeList.map((item, index) => {
                                // Logic Cek Waktu
                                const isActiveNow = isNow(item.jam_mulai, item.jam_selesai);
                                // Format Waktu Tampil
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
                                                    {item.nama_mahasiswa}
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

                                        {/* KANAN: Info Ruangan & Waktu (TAMPILAN JAM DIPERBAIKI) */}
                                        <div style={{textAlign: 'right'}}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', 
                                                gap: 6, marginBottom: 4, fontWeight: 600, color: '#0f172a'
                                            }}>
                                                <MapPin size={16} color="#0ea5e9"/> {item.nama_ruangan}
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

export default DashboardKajur;