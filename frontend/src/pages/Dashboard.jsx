import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
// Imports yang dibutuhkan
import { Calendar, Clock, MapPin, Bell, ChevronRight, AlertCircle, BookOpen, CheckCircle, X, Info, TrendingUp, PlusCircle, ArrowRight, Loader2, Check } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
    const navigate = useNavigate();
    // AMBIL DATA USER DARI LOCALSTORAGE
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'Mahasiswa', role: 'User' };
    
    // STATE untuk Pop-up Notifikasi
    const [showNotif, setShowNotif] = useState(false);
    
    // STATE untuk data dari API
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // FETCH DATA DARI API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch semua data secara parallel
                const [notifRes, statsRes, peminjamanRes] = await Promise.all([
                    api.get('/peminjaman/notifications'),
                    api.get('/peminjaman/statistics'),
                    api.get('/peminjaman/my-peminjaman')
                ]);
                
                // Transform notifications dari API format
                const transformedNotifications = notifRes.data.data.map(notif => ({
                    id: notif.id,
                    title: notif.title,
                    msg: notif.message,
                    time: formatTime(notif.updated_at),
                    type: notif.type
                }));
                
                // Transform stats dari API format
                const statsData = statsRes.data.data;
                const transformedStats = [
                    { 
                        title: 'Total Pengajuan', 
                        value: statsData.total.toString(), 
                        icon: <TrendingUp size={22}/>, 
                        color: '#0ea5e9', 
                        bg: '#e0f2fe' 
                    },
                    { 
                        title: 'Menunggu', 
                        value: statsData.menunggu.toString(), 
                        icon: <Clock size={22}/>, 
                        color: '#f59e0b', 
                        bg: '#fef3c7' 
                    },
                    { 
                        title: 'Disetujui', 
                        value: statsData.disetujui.toString(), 
                        icon: <CheckCircle size={22}/>, 
                        color: '#10b981', 
                        bg: '#dcfce7' 
                    },
                ];
                
                // Transform peminjaman ke format jadwal
                const transformedUpcoming = peminjamanRes.data.data
                    .filter(p => p.status === 'disetujui_kajur') // Hanya yang sudah disetujui
                    .slice(0, 5) // Ambil 5 terbaru
                    .map(p => ({
                        id: p.id,
                        room: p.nama_ruangan,
                        date: formatDate(p.tanggal_pinjam),
                        time: `${p.jam_mulai} - ${p.jam_selesai}`,
                        title: p.keperluan,
                        status: p.status
                    }));
                
                setNotifications(transformedNotifications);
                setStats(transformedStats);
                setUpcoming(transformedUpcoming);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Gagal memuat data. Silakan refresh halaman.');
                // Fallback ke dummy data jika ada error
                setNotifications([
                    { id: 1, title: 'Gagal memuat', msg: 'Periksa koneksi internet Anda.', time: 'Sekarang', type: 'error' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Helper function format tanggal
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }).toUpperCase();
    };

    // Helper function format waktu relatif
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return `${diffDays} hari lalu`;
        return date.toLocaleDateString('id-ID');
    };

    // Helper Icon Notifikasi
    const getNotifIcon = (type) => {
        if(type === 'success') return <div style={{background:'#dcfce7', padding:8, borderRadius:'50%', color:'#166534'}}><Check size={16}/></div>;
        if(type === 'error') return <div style={{background:'#fee2e2', padding:8, borderRadius:'50%', color:'#991b1b'}}><X size={16}/></div>;
        if(type === 'warning') return <div style={{background:'#fef9c3', padding:8, borderRadius:'50%', color:'#854d0e'}}><AlertCircle size={16}/></div>;
        return <div style={{background:'#dbeafe', padding:8, borderRadius:'50%', color:'#1e40af'}}><Info size={16}/></div>;
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

                    {/* Area Kanan: Tanggal & Lonceng Interaktif */}
                    <div style={{display:'flex', alignItems:'center', gap: 15}}>
                        
                        {/* 1. Tanggal */}
                        <div style={{display:'flex', alignItems:'center', gap:8, color:'#64748b', fontSize:'0.9rem', background:'white', padding:'10px 16px', borderRadius:50, border:'1px solid #e2e8f0'}}>
                            <Calendar size={18} color="#0284c7"/>
                            <span style={{fontWeight:600, color:'#0f172a'}}>{today}</span>
                        </div>

                        {/* 2. Lonceng Notifikasi (Interaktif) */}
                        <div style={{position: 'relative'}}>
                            <button 
                                onClick={() => setShowNotif(!showNotif)} // <--- TOGGLE DROPDOWN
                                style={{
                                    background: showNotif ? '#e0f2fe' : 'white', 
                                    border: '1px solid #e2e8f0', borderRadius: '50%', width: 45, height: 45, 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                    transition: '0.2s', position: 'relative'
                                }}
                            >
                                <Bell size={20} color={showNotif ? '#0284c7' : '#64748b'} />
                                {/* Badge Merah (Jumlah) */}
                                <span style={{
                                    position:'absolute', top:-2, right:-2, background:'#ef4444', color:'white', 
                                    fontSize:'0.7rem', fontWeight:700, width:18, height:18, borderRadius:'50%', 
                                    display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #f8fafc'
                                }}>
                                    {notifications.length}
                                </span>
                            </button>

                            {/* DROPDOWN MENU NOTIFIKASI */}
                            {showNotif && (
                                <div style={{
                                    position: 'absolute', top: '120%', right: 0, width: 320,
                                    background: 'white', borderRadius: 12, border: '1px solid #e2e8f0',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                    zIndex: 100, overflow: 'hidden'
                                }}>
                                    <div style={{padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <h3 style={{margin: 0, fontSize: '0.9rem', color: '#0f172a'}}>Notifikasi</h3>
                                        <button onClick={() => setShowNotif(false)} style={{background:'none', border:'none', cursor:'pointer', color:'#94a3b8'}}><X size={16}/></button>
                                    </div>
                                    
                                    <div style={{maxHeight: 300, overflowY: 'auto'}}>
                                        {notifications.map((item) => (
                                            <div key={item.id} style={{padding: '12px 16px', borderBottom: '1px solid #f8fafc', display: 'flex', gap: 12, cursor: 'pointer', transition: '0.2s'}} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                                                <div style={{marginTop: 2}}>{getNotifIcon(item.type)}</div>
                                                <div>
                                                    <h4 style={{margin: 0, fontSize: '0.85rem', color: '#334155'}}>{item.title}</h4>
                                                    <p style={{margin: '2px 0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.4}}>{item.msg}</p>
                                                    <span style={{fontSize: '0.7rem', color: '#94a3b8'}}>{item.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{padding: '10px', textAlign: 'center', background:'#f8fafc', borderTop:'1px solid #f1f5f9'}}>
                                        <span style={{fontSize:'0.8rem', color:'#0284c7', fontWeight:600, cursor:'pointer'}}>Tandai Semua Dibaca</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MAIN DASHBOARD CONTENT */}
                <div style={{display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: 30}}>
                    
                    {/* KOLOM KIRI (Jadwal & Status) */}
                    <div style={{display:'flex', flexDirection:'column', gap: 24}}>
                        
                        {/* 1. STATUS CARD (HERO) */}
                        <div className="card" style={{padding: 24, background: 'linear-gradient(to right, #0284c7, #0ea5e9)', color:'white', border:'none', position:'relative', overflow:'hidden'}}>
                            <div style={{position:'relative', zIndex:2}}>
                                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:15}}>
                                    <div style={{background:'rgba(255,255,255,0.2)', padding:6, borderRadius:'50%'}}><Bell size={20} color="white"/></div>
                                    <span style={{fontSize:'0.85rem', fontWeight:600, letterSpacing:0.5, opacity:0.9}}>UPDATE TERAKHIR</span>
                                </div>
                                {notifications.length > 0 ? (
                                    <>
                                        <h2 style={{margin:'0 0 10px 0', fontSize:'1.6rem'}}>{notifications[0].title}</h2>
                                        <p style={{opacity:0.9, marginBottom:20, maxWidth:'80%', lineHeight:1.5}}>
                                            {notifications[0].msg}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h2 style={{margin:'0 0 10px 0', fontSize:'1.6rem'}}>Tidak Ada Notifikasi Baru</h2>
                                        <p style={{opacity:0.9, marginBottom:20, maxWidth:'80%', lineHeight:1.5}}>
                                            Anda sudah up to date dengan semua pengajuan.
                                        </p>
                                    </>
                                )}
                                <button onClick={() => navigate('/riwayat')} style={{background:'white', color:'#0284c7', border:'none', padding:'10px 20px', borderRadius:8, fontWeight:700, cursor:'pointer'}}>
                                    Cek Status Pengajuan
                                </button>
                            </div>
                            <div style={{position:'absolute', right:-20, bottom:-20, opacity:0.1}}>
                                <BookOpen size={200} color="white"/>
                            </div>
                        </div>

                        {/* 2. JADWAL PEMINJAMAN (Timeline) */}
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
                        
                        {/* WIDGET 1: NOTIFIKASI (BARU) */}
                        <div className="card" style={{padding: '24px'}}>
                            <h3 style={{margin: '0 0 20px 0', color: '#0f172a', fontSize:'1.1rem'}}>Pemberitahuan</h3>
                            
                            <div style={{display:'flex', flexDirection:'column', gap:15}}>
                                {notifications.map((notif) => (
                                    <div key={notif.id} style={{display:'flex', gap:12, paddingBottom: 12, borderBottom: '1px dashed #e2e8f0'}}>
                                        <div style={{marginTop: 2}}>{getNotifIcon(notif.type)}</div>
                                        <div>
                                            <h4 style={{margin:0, fontSize:'0.95rem', color:'#334155'}}>{notif.title}</h4>
                                            <p style={{margin:'2px 0', fontSize:'0.85rem', color:'#64748b', lineHeight:1.4}}>{notif.msg}</p>
                                            <span style={{fontSize:'0.75rem', color:'#94a3b8'}}>{notif.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button style={{width:'100%', marginTop:20, padding:10, background:'none', border:'none', color:'#0284c7', fontSize:'0.85rem', fontWeight:600, cursor:'pointer'}}>
                                Tandai Semua Dibaca
                            </button>
                        </div>

                        {/* WIDGET 2: STATISTIK */}
                        <div className="card" style={{padding: 20}}>
                            <h3 style={{margin:'0 0 15px 0', fontSize:'1rem', color:'#64748b', textTransform:'uppercase', letterSpacing:0.5}}>Statistik Semester Ini</h3>
                            <div style={{display:'flex', flexDirection:'column', gap:12}}>
                                {stats.map((stat, idx) => (
                                    <div key={idx} style={{display:'flex', alignItems:'center', gap:12, padding:12, background:stat.bg, borderRadius:8}}>
                                        <div style={{display:'flex', alignItems:'center', justifyContent:'center', width:45, height:45, background:'white', borderRadius:'50%', color:stat.color}}>
                                            {stat.icon}
                                        </div>
                                        <div style={{flex:1}}>
                                            <p style={{margin:0, fontSize:'0.85rem', color:'#64748b'}}>{stat.title}</p>
                                            <p style={{margin:0, fontSize:'1.5rem', fontWeight:700, color:stat.color}}>{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WIDGET 3: TOMBOL CEPAT */}
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
                        
                        {/* WIDGET 4: INFO AKADEMIK */}
                        <div className="card" style={{padding: 20, background:'#fffbeb', border:'1px solid #fde68a'}}>
                            <div style={{display:'flex', gap:10}}>
                                <AlertCircle size={20} color="#d97706" style={{minWidth:20}}/>
                                <div>
                                    <h4 style={{margin:'0 0 5px 0', color:'#92400e', fontSize:'0.95rem'}}>Info Pemeliharaan</h4>
                                    <p style={{margin:0, fontSize:'0.85rem', color:'#b45309', lineHeight:1.4}}>
                                        Gedung H19 akan mengalami pemadaman listrik pada Sabtu, 30 Nov.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;