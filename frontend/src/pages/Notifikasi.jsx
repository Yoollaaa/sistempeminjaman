import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // 1. Import API Helper kamu
import { 
    Bell, CheckCircle, XCircle, Info, Clock, 
    X, Loader2, AlertCircle, Trash2 
} from 'lucide-react';

const Notifikasi = () => {
    const navigate = useNavigate();

    // STATE DATA
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. FETCH DATA DARI SERVER ---
    // --- GANTI BAGIAN useEffect DENGAN INI ---
    useEffect(() => {
        const fetchNotifikasi = async () => {
            try {
                setLoading(true);
                console.log("Mencoba mengambil data ke API..."); // Cek Console
                
                const response = await api.get('/notifikasi'); 
                
                console.log("Berhasil dapat data:", response.data); // Cek Console
                
                // Logika pembacaan data yang lebih aman
                const data = Array.isArray(response.data) ? response.data : response.data.data || [];
                setNotifications(data);
                
            } catch (err) {
                console.error("ERROR LENGKAP:", err);
                
                let pesanError = "";
                
                if (err.response) {
                    // Server merespon tapi error (404 = Route gak ada, 500 = Kodingan error)
                    pesanError = `Server Error: ${err.response.status} (${err.response.statusText})`;
                } else if (err.request) {
                    // Server tidak merespon sama sekali (Mati)
                    pesanError = "Tidak ada koneksi ke Server. Pastikan backend jalan.";
                } else {
                    pesanError = `Error Aplikasi: ${err.message}`;
                }
                
                setError(pesanError);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifikasi();
    }, []);

    // --- 2. FORMAT TANGGAL ---
    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    // --- 3. LOGIKA TANDAI DIBACA ---
    const markAllRead = async () => {
        try {
            // Panggil API Backend (Jika ada endpointnya)
            // await api.post('/notifikasi/mark-all-read');

            // Update Tampilan Frontend (Optimistic UI)
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error("Gagal update status:", err);
        }
    };

    // --- 4. LOGIKA IKON (Mapping tipe dari DB) ---
    const getIcon = (type) => {
        const lowerType = type ? type.toLowerCase() : 'info';
        
        if (lowerType.includes('success') || lowerType.includes('setuju') || lowerType.includes('berhasil')) {
            return <CheckCircle size={24} color="#16a34a" fill="#dcfce7" />;
        } else if (lowerType.includes('error') || lowerType.includes('tolak') || lowerType.includes('gagal')) {
            return <XCircle size={24} color="#dc2626" fill="#fee2e2" />;
        } else {
            return <Info size={24} color="#0284c7" fill="#e0f2fe" />;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container" style={{background: '#f8fafc', minHeight: '100vh', padding: '30px'}}>
                
                {/* HEADER */}
                <div style={{marginBottom: 30, display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                    <div>
                        <h1 style={{fontSize: '1.8rem', fontWeight: 700, margin: '0 0 5px 0', color: '#0f172a'}}>Notifikasi</h1>
                        <p style={{color: '#64748b', margin: 0}}>Pemberitahuan terbaru aktivitas Anda.</p>
                    </div>

                    <div style={{display:'flex', gap: 12}}>
                        {/* Tombol Tandai Dibaca */}
                        <button 
                            onClick={markAllRead}
                            style={{
                                background:'white', border:'1px solid #e2e8f0', padding:'8px 16px', borderRadius:8,
                                color:'#64748b', fontSize:'0.85rem', fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6,
                                height: 40
                            }}
                        >
                            <CheckCircle size={16}/> <span style={{display: 'none', md: 'inline'}}>Tandai dibaca</span>
                        </button>

                        {/* Tombol Close Menu (Kembali ke Dashboard) */}
                        <button 
                            onClick={() => navigate('/dashboard')}
                            title="Tutup Menu"
                            style={{
                                background:'#ef4444', border:'none', padding:'0 12px', borderRadius:8,
                                color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                                height: 40, boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                            }}
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* KONTEN UTAMA */}
                {loading ? (
                    <div style={{textAlign:'center', padding:60, color:'#64748b'}}>
                        <Loader2 size={40} className="animate-spin" style={{margin:'0 auto 10px'}}/>
                        <p>Memuat notifikasi...</p>
                    </div>
                ) : error ? (
                    <div style={{textAlign:'center', padding:40, color:'#dc2626', background:'#fee2e2', borderRadius:12, border:'1px solid #fecaca'}}>
                        <AlertCircle size={30} style={{margin:'0 auto 10px'}}/>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div style={{display:'flex', flexDirection:'column', gap: 16, maxWidth: 800}}>
                        {notifications.length === 0 ? (
                            <div style={{textAlign:'center', padding:50, color:'#94a3b8', background:'white', borderRadius:16, border:'1px solid #e2e8f0'}}>
                                <Bell size={48} style={{margin:'0 auto 10px', opacity:0.2}} />
                                <p>Tidak ada notifikasi saat ini.</p>
                            </div>
                        ) : (
                            notifications.map((item) => (
                                <div key={item.id} style={{
                                    // Logic Warna: Putih jika sudah dibaca, Biru muda jika belum
                                    background: item.is_read ? 'white' : '#f0f9ff',
                                    padding: 20, borderRadius: 12,
                                    border: '1px solid', borderColor: item.is_read ? '#e2e8f0' : '#bae6fd',
                                    display: 'flex', gap: 16, alignItems: 'flex-start',
                                    position: 'relative', transition: '0.2s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}>
                                    <div style={{marginTop: 2}}>
                                        {/* Icon Otomatis berdasarkan Tipe */}
                                        {getIcon(item.type || item.kategori)}
                                    </div>

                                    <div style={{flex: 1}}>
                                        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 4}}>
                                            <h3 style={{margin:0, fontSize:'1rem', color:'#0f172a', fontWeight: item.is_read ? 600 : 700}}>
                                                {/* Deteksi Nama Kolom Judul (Flexible) */}
                                                {item.title || item.judul || 'Pemberitahuan'}
                                                
                                                {!item.is_read && <span style={{marginLeft:8, fontSize:'0.65rem', background:'#0ea5e9', color:'white', padding:'2px 6px', borderRadius:4, verticalAlign:'middle'}}>BARU</span>}
                                            </h3>
                                            <span style={{fontSize:'0.75rem', color:'#94a3b8', display:'flex', alignItems:'center', gap:4}}>
                                                <Clock size={12}/> {formatTime(item.created_at || item.date)}
                                            </span>
                                        </div>
                                        <p style={{margin:0, fontSize:'0.9rem', color:'#475569', lineHeight: 1.5}}>
                                            {/* Deteksi Nama Kolom Pesan (Flexible) */}
                                            {item.message || item.pesan || item.konten}
                                        </p>
                                    </div>
                                    
                                    {/* (Tombol Delete per item sudah saya hilangkan sesuai request) */}
                                </div>
                            ))
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Notifikasi;