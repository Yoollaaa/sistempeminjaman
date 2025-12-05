import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import { CheckCircle, XCircle, BookOpen } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';

const VerifikasiPeminjaman = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('diajukan'); // Default: yang perlu tindakan
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });

    useEffect(() => { loadRequests(); }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/peminjaman');
            setRequests(resp.data.data || []);
        } catch (e) {
            setToast({ message: 'Gagal memuat data peminjaman.', type: 'error' });
        } finally { setLoading(false); }
    };

    const handleAction = async (id, action) => {
        let note = null;
        if (action === 'approve' && !window.confirm("Setujui dan teruskan ke Kajur?")) return;
        if (action === 'reject') {
            note = prompt("Masukkan alasan penolakan:");
            if (!note) return; // Batal jika tidak ada alasan
        }

        try {
            const url = action === 'approve' ? `/peminjaman/${id}/approve` : `/peminjaman/${id}/reject`;
            const payload = action === 'reject' ? { catatan_admin: note } : {};
            
            await api.post(url, payload);
            setToast({ message: `Pengajuan berhasil ${action === 'approve' ? 'diverifikasi' : 'ditolak'}.`, type: 'success' });
            loadRequests();
        } catch (e) {
            setToast({ message: 'Gagal memproses request.', type: 'error' });
        }
    };

    // Filter data sesuai pilihan dropdown
    const filteredData = requests.filter(r => filter === 'semua' ? true : r.status === filter);

    return (
        <div className="app-layout">
            <SidebarAdmin />
            <div className="content-container">
                <div className="page-header">
                    <h1 className="page-title">Verifikasi Peminjaman</h1>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{padding:8, borderRadius:8, border:'1px solid #ddd'}}>
                        <option value="diajukan">Perlu Verifikasi (Diajukan)</option>
                        <option value="disetujui_admin">Menunggu Kajur</option>
                        <option value="ditolak_admin">Ditolak Admin</option>
                        <option value="semua">Semua Riwayat</option>
                    </select>
                </div>

                <div className="list-container">
                    {loading ? <p>Memuat...</p> : filteredData.length === 0 ? <p className="text-center" style={{padding:20}}>Tidak ada data untuk filter ini.</p> : 
                    filteredData.map(item => (
                        <div key={item.id} className="card list-item" style={{marginBottom:10, borderLeft: item.status === 'diajukan' ? '4px solid #f59e0b' : '4px solid #cbd5e1'}}>
                            <div style={{flex:1}}>
                                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:5}}>
                                    <h4 style={{margin:0}}>{item.keperluan}</h4>
                                    <span className="badge" style={{
                                        background: item.status === 'diajukan' ? '#fef3c7' : 
                                                    item.status.includes('tolak') ? '#fee2e2' : '#dcfce7',
                                        color: item.status === 'diajukan' ? '#d97706' : 
                                               item.status.includes('tolak') ? '#b91c1c' : '#15803d',
                                        fontSize:'0.75rem'
                                    }}>
                                        {item.status.toUpperCase().replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="meta-info" style={{fontSize:'0.9rem', color:'var(--secondary)'}}>
                                    <div style={{display:'flex', gap:15, alignItems:'center'}}>
                                        <span><BookOpen size={14} style={{marginBottom:-2}}/> {item.nama_ruangan}</span>
                                        <span>📅 {item.tanggal_pinjam} ({item.jam_mulai} - {item.jam_selesai})</span>
                                        <span>👤 {item.nama_mahasiswa}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {item.status === 'diajukan' && (
                                <div style={{display:'flex', gap:10}}>
                                    <button onClick={() => handleAction(item.id, 'approve')} className="btn btn-success" style={{padding:'8px 12px'}}>
                                        <CheckCircle size={16}/> Verifikasi
                                    </button>
                                    <button onClick={() => handleAction(item.id, 'reject')} className="btn btn-outline-danger" style={{padding:'8px 12px'}}>
                                        <XCircle size={16}/> Tolak
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {toast.message && <Toast message={toast.message} type={toast.type} onClose={()=>setToast({message:''})}/>}
            </div>
        </div>
    );
};

export default VerifikasiPeminjaman;