import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarKajur from '../components/SidebarKajur';
import { 
    Clock, CheckCircle, Filter, User, Calendar, ArrowRight, Loader2, RefreshCw
} from 'lucide-react';
import { THEME } from '../constants/theme';
import api from '../api';
import Toast from '../components/Toast';

const VerifikasiPengajuanKajur = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, approved: 0 });
    const [toast, setToast] = useState({message:'', type:''});
    
    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/peminjaman');
            const data = resp.data.data || [];
            setRequests(data);

            const pendingCount = data.filter(r => r.status === 'disetujui_admin').length;
            const approvedCount = data.filter(r => r.status === 'disetujui_kajur').length;

            setStats({ pending: pendingCount, approved: approvedCount });
        } catch (e) {
            console.error('Failed to load peminjaman', e);
            setToast({ message: e.response?.data?.message || 'Gagal memuat pengajuan.', type: 'error' });
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
                
                {/* Header Halaman dengan Tombol Aksi */}
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 30}}>
                    <div>
                        <h1 style={{fontSize: '1.8rem', fontWeight: 700, margin: '0 0 5px 0', color: '#0f172a'}}>Verifikasi Pengajuan</h1>
                        <p style={{color: '#64748b', margin: 0}}>Daftar permohonan yang telah divalidasi oleh Admin Lab.</p>
                    </div>
                    <button 
                        onClick={loadRequests} 
                        className="btn"
                        style={{
                            background: THEME.colors.primary, 
                            color: 'white', 
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer'
                        }}
                    >
                        <RefreshCw size={18}/> Perbarui
                    </button>
                </div>

                {/* Statistik Cepat */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 20,
                    marginBottom: 30,
                }}>
                    <div className="card" style={{padding: 20, display:'flex', alignItems:'center', gap: 20}}>
                        <div style={{
                            width: 60, height: 60, borderRadius: 12,
                            background: THEME.colors.warningLight, color: THEME.colors.warning,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 style={{margin: 0, fontSize: '1.5rem', color: '#0f172a'}}>{stats.pending}</h3>
                            <p style={{margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem'}}>Perlu Persetujuan</p>
                        </div>
                    </div>
                    
                    <div className="card" style={{padding: 20, display:'flex', alignItems:'center', gap: 20}}>
                        <div style={{
                            width: 60, height: 60, borderRadius: 12,
                            background: THEME.colors.successLight, color: THEME.colors.success,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <h3 style={{margin: 0, fontSize: '1.5rem', color: '#0f172a'}}>{stats.approved}</h3>
                            <p style={{margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem'}}>Disetujui Total</p>
                        </div>
                    </div>
                </div>

                {/* List Pengajuan */}
                <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 20, color: '#334155'}}>
                    <Filter size={20} /> 
                    <h3 style={{margin:0, fontSize: '1.1rem'}}>Menunggu Tindakan Anda</h3>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
                    {loading ? (
                        <div style={{textAlign:'center', padding: 40, color: '#94a3b8'}}>
                            <Loader2 className="animate-spin" style={{margin:'0 auto 10px'}}/>
                            Memuat data...
                        </div>
                    ) : incomingData.length > 0 ? (
                        incomingData.map((item) => (
                            <div key={item.id} className="card" style={{
                                padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                transition: 'transform 0.2s', border: '1px solid #e2e8f0'
                            }}>
                                {/* Kiri: Info Utama */}
                                <div style={{display: 'flex', alignItems: 'center', gap: 20, flex: 1}}>
                                    <div style={{
                                        width: 48, height: 48, background: '#e0f2fe', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', color: '#0284c7', fontSize: '1.2rem'
                                    }}>
                                        {item.nama_mahasiswa ? item.nama_mahasiswa.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div style={{flex: 1}}>
                                        <h4 style={{margin: '0 0 4px 0', fontSize: '1rem', color: '#0f172a'}}>
                                            {item.keperluan}
                                        </h4>
                                        <div style={{display: 'flex', gap: 20, fontSize: '0.85rem', color: '#64748b'}}>
                                            <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
                                                <User size={14} /> {item.nama_mahasiswa}
                                            </span>
                                            <span style={{display: 'flex', alignItems: 'center', gap: 5}}>
                                                <Calendar size={14} /> {formatDate(item.tanggal_pinjam)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Kanan: Ruangan & Tombol */}
                                <div style={{display: 'flex', alignItems: 'center', gap: 30, textAlign: 'right'}}>
                                    <div>
                                        <div style={{fontWeight: 600, color: '#0f172a', marginBottom: 2}}>{item.nama_ruangan}</div>
                                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>
                                            {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/kajur/detail/${item.id}`, { state: { data: item } })}
                                        className="btn"
                                        style={{
                                            background: THEME.colors.primary, color: 'white',
                                            padding: '8px 16px', borderRadius: 8, fontSize: '0.9rem',
                                            display: 'flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer'
                                        }}
                                    >
                                        Periksa <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{textAlign: 'center', padding: 50, background: 'white', borderRadius: 12, border: '1px solid #e2e8f0', color: '#64748b'}}>
                            <CheckCircle size={40} style={{marginBottom: 10, opacity: 0.5, display:'block', margin:'0 auto 10px'}} />
                            <p>Tidak ada pengajuan yang perlu diverifikasi saat ini.</p>
                        </div>
                    )}
                </div>

                {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({message:'', type:''})} />}
            </div>
        </div>
    );
};

export default VerifikasiPengajuanKajur;