import React, { useState } from 'react';
import SidebarKajur from '../components/SidebarKajur';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Printer, Loader2 } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';

const DetailPengajuan = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dataFromState = location.state?.data; 
    const { id } = useParams();

    const [status, setStatus] = useState(dataFromState?.status === 'disetujui_kajur' ? 'approved' : dataFromState?.status === 'ditolak_kajur' ? 'rejected' : 'pending'); 
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [toast, setToast] = useState({message: '', type: ''});

    const [data, setData] = useState(dataFromState || null);

    // Fetch detail if navigated directly (no state)
    React.useEffect(() => {
        const fetchDetail = async () => {
            if (data) return;
            try {
                const resp = await api.get(`/peminjaman/${id}`);
                setData(resp.data.data);
                setStatus(resp.data.data?.status === 'disetujui_kajur' ? 'approved' : resp.data.data?.status === 'ditolak_kajur' ? 'rejected' : 'pending');
            } catch (err) {
                console.error('Failed to fetch detail', err);
                setToast({ message: err.response?.data?.message || 'Gagal memuat detail pengajuan', type: 'error' });
            }
        };
        fetchDetail();
    }, [id]);

    if (!data) return <div>Memuat data detail...</div>;

    const canApprove = data.status === 'disetujui_admin';
    const canReject = ['disetujui_admin','disetujui_kajur'].includes(data.status);

    const handleApprove = async () => {
        if(!window.confirm('Apakah Anda yakin menyetujui peminjaman ini?')) return;
        setLoading(true);
        try {
            const resp = await api.post(`/peminjaman/${data.id}/approve-kajur`, { catatan: note || null });
            setStatus('approved');
            setToast({ message: resp.data.message || 'Pengajuan disetujui.', type: 'success' });
            // Navigate back after a short delay so the toast can be seen
            setTimeout(() => navigate('/dashboard/kajur'), 1200);
        } catch (err) {
            console.error('Approve failed', err);
            setToast({ message: err.response?.data?.message || 'Gagal menyetujui pengajuan', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if(!note) return alert('Harap isi alasan penolakan!');
        setLoading(true);
        try {
            const resp = await api.post(`/peminjaman/${data.id}/reject-kajur`, { catatan: note });
            setStatus('rejected');
            setShowRejectModal(false);
            setToast({ message: resp.data.message || 'Pengajuan ditolak.', type: 'success' });
            setTimeout(() => navigate('/dashboard/kajur'), 1200);
        } catch (err) {
            console.error('Reject failed', err);
            setToast({ message: err.response?.data?.message || 'Gagal menolak pengajuan', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print(); 
    };

    return (
        <div className="app-layout">
            <SidebarKajur />
            <div className="content-container">
                <button onClick={() => navigate(-1)} className="btn btn-back">
                    <ArrowLeft size={18}/> Kembali
                </button>

                <div className="detail-layout">
                    
                    {/* KOLOM KIRI: Detail Surat */}
                    <div className="card" style={{minHeight: 500}}>
                        <div className="detail-header-row">
                            <div>
                                <h2 style={{margin:0, fontSize:'1.5rem'}}>Detail Permohonan</h2>
                                <p className="page-subtitle">ID Pengajuan: #{data.id}</p>
                            </div>
                            <div style={{textAlign:'right'}}>
                                <span className="label-text">TANGGAL KEGIATAN</span>
                                <span style={{fontSize:'1.1rem', fontWeight:700}}>{data.tanggal_pinjam || data.tgl}</span>
                            </div>
                        </div>

                        <div className="detail-grid">
                            <div>
                                <label className="label-text">Mahasiswa</label>
                                <p className="value-text">{data.nama_mahasiswa || data.mahasiswa}</p>
                                <p className="sub-value">{data.mahasiswa_nim || data.nim}</p>
                            </div>
                            <div>
                                <label className="label-text">Ruangan</label>
                                <p className="value-text">{data.nama_ruangan || data.ruangan}</p>
                                <p className="sub-value">{(data.jam_mulai ? data.jam_mulai.substring(0,5) : data.jam?.substring(0,5))} - {(data.jam_selesai ? data.jam_selesai.substring(0,5) : '')}</p>
                            </div>
                        </div>

                        <div style={{marginBottom:30}}>
                            <label className="label-text">Keperluan</label>
                                <p style={{marginTop:5, lineHeight:1.6, color:'#334155'}}>{data.keperluan}</p>
                        </div>

                        {data.catatan_admin && (
                            <div style={{marginBottom:12}}>
                                <label className="label-text">Catatan Admin</label>
                                <p className="sub-value" style={{marginTop:5}}>{data.catatan_admin}</p>
                            </div>
                        )}
                        {data.catatan_kajur && (
                            <div style={{marginBottom:12}}>
                                <label className="label-text">Catatan Kajur</label>
                                <p className="sub-value" style={{marginTop:5}}>{data.catatan_kajur}</p>
                            </div>
                        )}

                        {/* Status Akhir */}
                                {status === 'approved' && (
                            <div className="status-box status-approved">
                                <CheckCircle size={40} style={{margin:'0 auto 10px'}}/>
                                <h3 style={{margin:0}}>Disetujui</h3>
                                <p style={{margin:'5px 0', fontSize:'0.9rem'}}>Surat izin telah diterbitkan secara otomatis.</p>
                            </div>
                        )}

                                {status === 'rejected' && (
                            <div className="status-box status-rejected">
                                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:5}}>
                                    <XCircle size={24}/>
                                    <h3 style={{margin:0}}>Ditolak</h3>
                                </div>
                                <p style={{margin:'5px 0 0 0', fontSize:'0.9rem'}}><strong>Catatan:</strong> "{note}"</p>
                            </div>
                        )}
                    </div>

                    {/* KOLOM KANAN: Panel Aksi */}
                    <div className="action-buttons">
                        
                                {status === 'pending' && (
                            <div className="card action-card">
                                <h3 style={{margin:'0 0 15px 0', fontSize:'1rem'}}>Keputusan Kajur</h3>
                                <p className="page-subtitle" style={{marginBottom:20, fontSize:'0.85rem'}}>Pastikan data sudah benar.</p>
                                
                                <button onClick={handleApprove} disabled={loading || !canApprove} className="btn btn-success" style={{width:'100%'}}>
                                    {loading ? <Loader2 className="animate-spin"/> : <CheckCircle size={18}/>} Setujui Pengajuan
                                </button>
                                
                                <button onClick={() => setShowRejectModal(true)} disabled={loading || !canReject} className="btn btn-outline-danger" style={{width:'100%'}}>
                                    <XCircle size={18}/> Tolak
                                </button>
                            </div>
                        )}

                        {status === 'approved' && (
                            <div className="card" style={{padding:20, background:'var(--primary)', color:'white'}}>
                                <h3 style={{margin:'0 0 10px 0', fontSize:'1rem'}}>Cetak Dokumen</h3>
                                <p style={{fontSize:'0.85rem', opacity:0.8, marginBottom:20}}>Unduh surat persetujuan.</p>
                                <button onClick={handlePrint} className="btn" style={{width:'100%', background:'white', color:'var(--primary)'}}>
                                    <Printer size={18}/> Cetak Surat
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL PENOLAKAN */}
                {showRejectModal && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h3 style={{marginTop:0, color:'var(--danger-text)'}}>Alasan Penolakan</h3>
                            <p className="page-subtitle" style={{marginBottom:15}}>Berikan catatan untuk mahasiswa.</p>
                            <textarea 
                                rows="4" 
                                className="modal-textarea"
                                placeholder="Contoh: Bentrok dengan jadwal praktikum..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            ></textarea>
                            <div className="modal-actions">
                                <button onClick={() => setShowRejectModal(false)} className="btn" style={{background:'#f1f5f9'}}>Batal</button>
                                <button onClick={handleReject} className="btn" style={{background:'var(--danger-text)', color:'white'}}>Kirim</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast */}
                <Toast message={toast.message} type={toast.type} onClose={() => setToast({message:'', type:''})} />

            </div>
        </div>
    );
};

export default DetailPengajuan;