import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { 
    Calendar, Clock, MapPin, ChevronRight, AlertCircle, 
    Loader2, Bell, TrendingUp // Add TrendingUp
} from 'lucide-react';
import api from '../api';

const Dashboard = () => {
    const navigate = useNavigate();
    // AMBIL DATA USER DARI LOCALSTORAGE
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'Mahasiswa', role: 'User' };
    
    // STATE untuk data dari API
    const [upcoming, setUpcoming] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // FETCH DATA DARI API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch peminjaman sebagai data utama
                const peminjamanRes = await api.get('/peminjaman');
                const peminjamanData = peminjamanRes.data?.data || [];
                
                // Hitung statistik dari data
                const total = peminjamanData.length;
                const menunggu = peminjamanData.filter(p => p.status === 'diajukan' || p.status === 'disetujui_admin').length;
                const disetujui = peminjamanData.filter(p => p.status === 'disetujui_kajur').length;
                
                // Set stats untuk widget statistik
                setStats([
                    { 
                        title: 'Total Pengajuan', 
                        value: total.toString(), 
                        color: '#0ea5e9', 
                        bg: '#e0f2fe' 
                    },
                    { 
                        title: 'Menunggu', 
                        value: menunggu.toString(), 
                        color: '#f59e0b', 
                        bg: '#fef3c7' 
                    },
                    { 
                        title: 'Disetujui', 
                        value: disetujui.toString(), 
                        color: '#10b981', 
                        bg: '#dcfce7' 
                    },
                ]);
                
                // Transform peminjaman ke format jadwal (hanya yang sudah disetujui)
                const transformedUpcoming = peminjamanData
                    .filter(p => p.status === 'disetujui_kajur')
                    .slice(0, 5)
                    .map(p => ({
                        id: p.id,
                        room: p.nama_ruangan,
                        date: formatDate(p.tanggal_pinjam),
                        time: `${p.jam_mulai} - ${p.jam_selesai}`,
                        title: p.keperluan,
                        status: p.status
                    }));
                
                setUpcoming(transformedUpcoming);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Gagal memuat data. Silakan refresh halaman.');
                setUpcoming([]);
                setStats([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Helper function format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }).toUpperCase();
    };

    // Get latest notification / update
    const getLatestUpdate = () => {
        if (upcoming.length === 0) return null;
        return upcoming[0];
    };

    // Show loading state
    if (loading) {
        return (
            <div className="app-layout">
                <Sidebar />
                <div className="content-container">
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', flexDirection:'column', gap:20}}>
                        <Loader2 size={48} color="#0284c7" style={{animation: 'spin 1s linear infinite'}} />
                        <p style={{color:'#64748b', fontSize:'1.1rem'}}>Memuat data dashboard...</p>
                    </div>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container">
                {/* Show error message if any */}
                {error && (
                    <div style={{
                        padding:'15px', 
                        background:'#fee2e2', 
                        color:'#991b1b', 
                        borderRadius:8, 
                        marginBottom:20, 
                        display:'flex', 
                        alignItems:'center', 
                        gap:10
                    }}>
                        <AlertCircle size={20}/>
                        <span>{error}</span>
                    </div>
                )}
                
                {/* HEADER SECTION */}
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 30, position: 'relative'}}>
                    
                    {/* Sapaan Kiri */}
                    <div>
                        <h1 style={{fontSize:'1.8rem', fontWeight:800, color:'#0f172a', margin:'0 0 5px 0'}}>
                            Selamat Pagi, {user.nama.split(' ')[0]}!
                        </h1>
                        <p style={{color:'#64748b', margin:0, fontSize:'1rem'}}>
                            Berikut ringkasan aktivitas peminjaman ruangan Anda.
                        </p>
                    </div>

                    {/* Area Kanan: Lonceng & Tanggal */}
                    <div style={{display:'flex', alignItems:'center', gap: 12}}>
                        
                        {/* 1. TOMBOL LONCENG NOTIFIKASI (BARU) */}
                        <Link to="/notifikasi" style={{
                            background: 'white',
                            padding: '10px',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748b',
                            textDecoration: 'none',
                            transition: '0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#0284c7';
                            e.currentTarget.style.borderColor = '#0284c7';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                        title="Lihat Notifikasi"
                        >
                            <Bell size={20} />
                        </Link>

                        {/* 2. Tanggal */}
                        <div style={{
                            display:'flex', alignItems:'center', gap:8, 
                            color:'#64748b', fontSize:'0.9rem', 
                            background:'white', padding:'10px 16px', 
                            borderRadius:'12px', // Samakan radius dengan tombol lonceng
                            border:'1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                            <Calendar size={18} color="#0284c7"/>
                            <span style={{fontWeight:600, color:'#0f172a'}}>{today}</span>
                        </div>
                    </div>
                </div>

                {/* HERO CARD: UPDATE TERAKHIR */}
                {upcoming.length > 0 && (
                    <div style={{padding: 24, background: 'linear-gradient(to right, #0284c7, #0ea5e9)', color:'white', border:'none', position:'relative', overflow:'hidden', borderRadius: 12, marginBottom: 20, marginTop: 20}}>                        <div style={{position:'relative', zIndex:2}}>
                            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:15}}>
                                <div style={{background:'rgba(255,255,255,0.2)', padding:6, borderRadius:'50%'}}><Bell size={20} color="white"/></div>
                                <span style={{fontSize:'0.85rem', fontWeight:600, letterSpacing:0.5, opacity:0.9}}>UPDATE TERAKHIR</span>
                            </div>
                            <h2 style={{margin:'0 0 10px 0', fontSize:'1.6rem'}}>Pengajuan {getLatestUpdate()?.room}</h2>
                            <p style={{opacity:0.9, marginBottom:20, maxWidth:'80%', lineHeight:1.5}}>
                                {getLatestUpdate()?.title}
                            </p>
                            <button onClick={() => navigate('/riwayat')} style={{background:'white', color:'#0284c7', border:'none', padding:'10px 20px', borderRadius:8, fontWeight:700, cursor:'pointer'}}>
                                Cek Status Pengajuan
                            </button>
                        </div>
                    </div>
                )}

                {/* MAIN DASHBOARD CONTENT */}
                <div style={{display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: 30}}>
                    
                    {/* KOLOM KIRI (Jadwal & Status) */}
                    <div style={{display:'flex', flexDirection:'column', gap: 24}}>
                        
                        {/* JADWAL PEMINJAMAN (Timeline) */}
                        <div>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:15}}>
                                <h3 style={{margin:0, color:'#334155'}}>Jadwal Peminjaman Anda</h3>
                                <button onClick={() => navigate('/riwayat')} style={{background:'none', border:'none', color:'#0284c7', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontSize:'0.9rem'}}>
                                    Lihat Semua <ChevronRight size={16}/>
                                </button>
                            </div>

                            <div className="card" style={{padding:0}}>
                                {upcoming.length > 0 ? (
                                    upcoming.map((item, idx) => (
                                        <div key={item.id} style={{display:'flex', padding: 20, borderBottom: idx !== upcoming.length - 1 ? '1px solid #f1f5f9' : 'none', gap: 20, alignItems:'center'}}>
                                            <div style={{textAlign:'center', minWidth: 60}}>
                                                <span style={{display:'block', fontSize:'0.8rem', fontWeight:700, color:'#94a3b8'}}>{item.date.split(' ')[0]}</span>
                                                <span style={{display:'block', fontSize:'1.5rem', fontWeight:700, color:'#0284c7'}}>{item.date.split(' ')[1]}</span>
                                            </div>
                                            <div style={{flex:1}}>
                                                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:5}}>
                                                    <span style={{background:'#dcfce7', color:'#166534', fontSize:'0.7rem', fontWeight:700, padding:'2px 8px', borderRadius:4}}>DISETUJUI</span>
                                                    <span style={{fontSize:'0.85rem', color:'#64748b', display:'flex', alignItems:'center', gap:4}}><Clock size={14}/> {item.time}</span>
                                                </div>
                                                <h4 style={{margin:0, fontSize:'1.1rem', color:'#0f172a'}}>{item.title}</h4>
                                                <p style={{margin:'4px 0 0 0', color:'#64748b', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:5}}>
                                                    <MapPin size={14}/> {item.room}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{padding:20, textAlign:'center', color:'#94a3b8'}}>
                                        <p>Belum ada jadwal peminjaman yang disetujui.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN (WIDGETS) */}
                    <div style={{display:'flex', flexDirection:'column', gap: 24}}>
                        
                        {/* WIDGET 1: STATISTIK */}
                        {stats.length > 0 && (
                            <div className="card" style={{padding: 20}}>
                                <h3 style={{margin:'0 0 15px 0', fontSize:'1rem', color:'#64748b', textTransform:'uppercase', letterSpacing:0.5}}>Statistik Semester Ini</h3>
                                <div style={{display:'flex', flexDirection:'column', gap:12}}>
                                    {stats.map((stat, idx) => (
                                        <div key={idx} style={{display:'flex', alignItems:'center', gap:12, padding:12, background:stat.bg, borderRadius:8}}>
                                            <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:45, height:45, background:'white', borderRadius:'50%', color:stat.color}}>
                                                <TrendingUp size={20}/>
                                            </div>
                                            <div style={{flex:1}}>
                                                <p style={{margin:0, fontSize:'0.85rem', color:'#64748b'}}>{stat.title}</p>
                                                <p style={{margin:0, fontSize:'1.5rem', fontWeight:700, color:stat.color}}>{stat.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* WIDGET 2: TOMBOL CEPAT */}
                        <div className="card" style={{padding: 24, textAlign:'center', border:'1px dashed #cbd5e1', background:'transparent'}}>
                            <h4 style={{margin:'0 0 10px 0', color:'#0f172a'}}>Ingin Pinjam Ruangan?</h4>
                            <p style={{fontSize:'0.9rem', color:'#64748b', marginBottom:20}}>Cek ketersediaan ruangan di Gedung H secara real-time.</p>
                            <button 
                                onClick={() => navigate('/pilih-ruangan')}
                                className="btn-primary"
                            >
                                + Buat Pengajuan Baru
                            </button>
                        </div>
                    
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;