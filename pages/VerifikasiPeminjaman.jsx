import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import { 
    CheckCircle, XCircle, BookOpen, Clock, User, Calendar, 
    FileText, Download, ChevronDown, ChevronUp, AlertCircle 
} from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';

const VerifikasiPeminjaman = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('diajukan'); 
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '' });
    
    // State UI
    const [expandedId, setExpandedId] = useState(null); 
    const [note, setNote] = useState(''); 

    useEffect(() => { loadRequests(); }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/peminjaman');
            setRequests(resp.data.data || []);
        } catch (e) {
            setToast({ message: 'Gagal memuat data.', type: 'error' });
        } finally { setLoading(false); }
    };

    const handleAction = async (id, action) => {
        if (action === 'reject' && !note) {
            alert("Harap isi alasan penolakan.");
            return;
        }
        if (!window.confirm(`Yakin ingin memproses pengajuan ini?`)) return;

        try {
            const url = action === 'approve' ? `/peminjaman/${id}/approve` : `/peminjaman/${id}/reject`;
            await api.post(url, { catatan: note });
            setToast({ message: 'Status berhasil diperbarui.', type: 'success' });
            setNote('');
            setExpandedId(null);
            loadRequests();
        } catch (e) {
            setToast({ message: 'Gagal memproses.', type: 'error' });
        }
    };

    const toggleExpand = (id) => {
        if (expandedId === id) setExpandedId(null);
        else {
            setExpandedId(id);
            setNote('');
        }
    };

    // --- FUNGSI PENTING: GENERATE URL FILE ---
    const getFileUrl = (path) => {
        if (!path) return null;
        // Hapus 'public/' jika ada di string path database
        const cleanPath = path.replace('public/', '');
        // Pastikan port sesuai dengan backend Laravel kamu (biasanya 8000)
        return `http://localhost:8000/storage/${cleanPath}`; 
    };

    // --- FUNGSI FORMAT TANGGAL & JAM ---
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        // Ambil 5 karakter pertama (HH:mm)
        return timeString.slice(0, 5); 
    };

    const filteredData = requests.filter(r => filter === 'semua' ? true : r.status === filter);

    return (
        <div className="app-layout">
            <SidebarAdmin />
            <div className="content-container">
                <div className="page-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                    <h1 className="page-title">Verifikasi Peminjaman</h1>
                    <select className="form-input" value={filter} onChange={(e) => setFilter(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #cbd5e1', minWidth:200}}>
                        <option value="diajukan">Perlu Verifikasi</option>
                        <option value="disetujui_admin">Menunggu Kajur</option>
                        <option value="ditolak_admin">Ditolak Admin</option>
                        <option value="semua">Semua Riwayat</option>
                    </select>
                </div>

                <div className="list-container" style={{display:'flex', flexDirection:'column', gap:15}}>
                    {loading ? <p className="text-center">Memuat data...</p> : 
                     filteredData.length === 0 ? <p className="text-center text-muted">Tidak ada data.</p> : 
                    filteredData.map(item => (
                        <div key={item.id} className="card" style={{padding:0, overflow:'hidden', borderLeft: item.status === 'diajukan' ? '4px solid #f59e0b' : '4px solid #cbd5e1'}}>
                            
                            {/* HEADER (Ringkasan) */}
                            <div 
                                onClick={() => toggleExpand(item.id)}
                                style={{
                                    padding: '15px 20px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center',
                                    background: expandedId === item.id ? '#f8fafc' : 'white', transition:'background 0.2s'
                                }}
                            >
                                <div style={{flex:1}}>
                                    <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:5}}>
                                        <h4 style={{margin:0, fontSize:'1.1rem', color:'#0f172a'}}>{item.nama_mahasiswa}</h4>
                                        <span className="badge" style={{
                                            background: item.status === 'diajukan' ? '#fef3c7' : '#e2e8f0',
                                            color: item.status === 'diajukan' ? '#d97706' : '#64748b',
                                            fontSize:'0.75rem', padding:'2px 8px', borderRadius:4, textTransform:'uppercase'
                                        }}>
                                            {item.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div style={{display:'flex', gap:20, fontSize:'0.9rem', color:'#64748b'}}>
                                        <span style={{display:'flex', alignItems:'center', gap:5}}><BookOpen size={14}/> {item.nama_ruangan}</span>
                                        <span style={{display:'flex', alignItems:'center', gap:5}}><Calendar size={14}/> {formatDate(item.tanggal_pinjam)}</span>
                                    </div>
                                </div>
                                {expandedId === item.id ? <ChevronUp size={20} color="#64748b"/> : <ChevronDown size={20} color="#64748b"/>}
                            </div>

                            {/* BODY (Detail Lengkap) */}
                            {expandedId === item.id && (
                                <div style={{padding: '20px', borderTop:'1px solid #f1f5f9'}}>
                                    
                                    {/* INFO UTAMA */}
                                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20}}>
                                        <div>
                                            <label style={{fontSize:'0.8rem', color:'#94a3b8', fontWeight:700, display:'block', marginBottom:4}}>KEPERLUAN</label>
                                            <p style={{margin:0, color:'#334155'}}>{item.keperluan}</p>
                                        </div>
                                        <div>
                                            <label style={{fontSize:'0.8rem', color:'#94a3b8', fontWeight:700, display:'block', marginBottom:4}}>WAKTU PEMINJAMAN</label>
                                            <div style={{display:'flex', alignItems:'center', gap:8, color:'#334155', fontWeight:600}}>
                                                <Clock size={16} color="#0ea5e9"/>
                                                {formatTime(item.jam_mulai)} WIB  s/d  {formatTime(item.jam_selesai)} WIB
                                            </div>
                                        </div>
                                    </div>

                                    {/* DOKUMEN FILE */}
                                    <div style={{marginBottom:25, padding:'15px', background:'#f8fafc', borderRadius:8, border:'1px dashed #cbd5e1'}}>
                                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                            <div style={{display:'flex', alignItems:'center', gap:10}}>
                                                <div style={{background:'#fee2e2', padding:8, borderRadius:6}}>
                                                    <FileText size={20} color="#ef4444"/>
                                                </div>
                                                <div>
                                                    <div style={{fontWeight:600, color:'#334155', fontSize:'0.9rem'}}>Surat Permohonan</div>
                                                    <div style={{fontSize:'0.8rem', color:'#64748b'}}>
                                                        {item.file_surat ? 'File tersedia untuk diunduh' : 'Tidak ada file dilampirkan'}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {item.file_surat ? (
                                                <a 
                                                    href={getFileUrl(item.file_surat)} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" // Keamanan: Buka di tab baru
                                                    className="btn"
                                                    style={{
                                                        background:'#0ea5e9', color:'white', textDecoration:'none',
                                                        padding:'8px 16px', borderRadius:6, fontSize:'0.85rem', fontWeight:600,
                                                        display:'flex', alignItems:'center', gap:6
                                                    }}
                                                >
                                                    <Download size={16}/> Unduh / Lihat
                                                </a>
                                            ) : (
                                                <span style={{fontSize:'0.8rem', color:'#ef4444', fontStyle:'italic'}}>File Kosong</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* FORM VERIFIKASI (Hanya jika status 'diajukan') */}
                                    {item.status === 'diajukan' && (
                                        <div style={{background:'#fefce8', padding:15, borderRadius:8, border:'1px solid #fef08a'}}>
                                            <label style={{fontSize:'0.8rem', color:'#854d0e', fontWeight:700, display:'block', marginBottom:6}}>CATATAN VERIFIKASI</label>
                                            <textarea 
                                                rows="2" 
                                                placeholder="Berikan alasan jika menolak..." 
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                className="form-input"
                                                style={{width:'100%', marginBottom:15, borderColor:'#fde047'}}
                                            ></textarea>

                                            <div style={{display:'flex', gap:10, justifyContent:'flex-end'}}>
                                                <button onClick={() => handleAction(item.id, 'reject')} className="btn" style={{background:'white', color:'#ef4444', border:'1px solid #ef4444', display:'flex', gap:6, alignItems:'center'}}>
                                                    <XCircle size={16}/> Tolak
                                                </button>
                                                <button onClick={() => handleAction(item.id, 'approve')} className="btn" style={{background:'#22c55e', color:'white', border:'none', display:'flex', gap:6, alignItems:'center'}}>
                                                    <CheckCircle size={16}/> Verifikasi & Teruskan
                                                </button>
                                            </div>
                                        </div>
                                    )}
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