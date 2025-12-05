import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // FIX: Menambahkan useNavigate
import SidebarKajur from '../components/SidebarKajur';
// FIX: Menambahkan semua ikon yang digunakan dalam komponen
import { 
    BookOpen, ChevronUp, ChevronDown, 
    Clock, CheckCircle, Filter, User, Calendar, ArrowRight 
} from 'lucide-react'; 
import api from '../api';
import Toast from '../components/Toast'; // FIX: Menghilangkan sintaks ekstra ('' )

const DashboardKajur = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, approved: 0 });
    
    // Ambil data user dari localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'Bapak Kajur' };

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/peminjaman');
            const data = resp.data.data || [];
            setRequests(data);

            // Hitung Statistik
            const pendingCount = data.filter(r => r.status === 'disetujui_admin').length;
            const approvedCount = data.filter(r => r.status === 'disetujui_kajur').length;

            setStats({ pending: pendingCount, approved: approvedCount });
        } catch (e) {
            console.error('Failed to load peminjaman', e);
        } finally {
            setLoading(false);
        }
    };

    const incomingData = requests.filter(r => r.status === 'disetujui_admin');

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="app-layout">
            <SidebarKajur />
            <div className="content-container">
                
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Verifikasi Pengajuan</h1>
                        <p className="page-subtitle">Daftar permohonan yang telah divalidasi oleh Admin Lab.</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'0.9rem', color:'var(--secondary)'}}>Selamat Datang,</div>
                        <div style={{fontWeight:700, fontSize:'1.1rem'}}>{user.nama}</div>
                    </div>
                </div>

                {/* Statistik Cepat */}
                <div className="stat-grid">
                    <div className="card stat-card-content" style={{borderLeft:'4px solid var(--warning-text)'}}>
                        <div className="stat-icon" style={{background:'var(--warning-bg)', color:'var(--warning-text)'}}>
                            <Clock size={24}/>
                        </div>
                        <div>
                            <h3 className="stat-value">{stats.pending}</h3>
                            <p className="stat-label">Perlu Persetujuan</p>
                        </div>
                    </div>
                    
                    <div className="card stat-card-content" style={{borderLeft:'4px solid var(--success-text)'}}>
                        <div className="stat-icon" style={{background:'var(--success-bg)', color:'var(--success-text)'}}>
                            <CheckCircle size={24}/>
                        </div>
                        <div>
                            <h3 className="stat-value">{stats.approved}</h3>
                            <p className="stat-label">Disetujui Total</p>
                        </div>
                    </div>
                </div>

                {/* List Pengajuan */}
                <h3 style={{marginBottom:15, color:'#334155', display:'flex', alignItems:'center', gap:8}}>
                    <Filter size={18}/> Menunggu Tindakan Anda
                </h3>
                
                <div className="list-container">
                    {loading ? (
                        <div style={{textAlign:'center', padding:40, color:'#94a3b8'}}>Memuat data...</div>
                    ) : incomingData.length > 0 ? (
                        incomingData.map((item) => (
                            <div key={item.id} className="card list-item">
                                
                                {/* Kiri: Info Utama */}
                                <div className="user-info">
                                    <div className="avatar-circle">
                                        {item.nama_mahasiswa ? item.nama_mahasiswa.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <h4 style={{margin:'0 0 4px 0', fontSize:'1.05rem'}}>{item.keperluan}</h4>
                                        <div className="meta-info">
                                            <span className="meta-item">
                                                <User size={14}/> {item.nama_mahasiswa} ({item.mahasiswa_nim || 'NIM'})
                                            </span>
                                            <span className="meta-item">
                                                <Calendar size={14}/> {formatDate(item.tanggal_pinjam)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Kanan: Ruangan & Tombol */}
                                <div style={{display:'flex', alignItems:'center', gap:20}}>
                                    <div className="room-info">
                                        <span className="room-name">{item.nama_ruangan}</span>
                                        <span className="room-time">{item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}</span>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/kajur/detail/${item.id}`, { state: { data: item } })}
                                        className="btn btn-primary"
                                    >
                                        Periksa <ArrowRight size={16}/>
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div style={{textAlign:'center', padding:40, color:'#94a3b8', background:'white', borderRadius:10}}>
                            <CheckCircle size={40} style={{marginBottom:10, opacity:0.5}}/>
                            <p>Tidak ada pengajuan yang perlu diverifikasi saat ini.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DashboardKajur;