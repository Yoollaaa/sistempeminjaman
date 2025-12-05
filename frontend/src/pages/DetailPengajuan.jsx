import React, { useState } from 'react';
import SidebarKajur from '../components/SidebarKajur';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Printer, Loader2 } from 'lucide-react';

const DetailPengajuan = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.data; 

    const [status, setStatus] = useState('pending'); 
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    if (!data) return <div>Data tidak ditemukan</div>;

    const handleApprove = async () => {
        if(!window.confirm('Apakah Anda yakin menyetujui peminjaman ini?')) return;
        setLoading(true);
        setTimeout(() => { 
            setStatus('approved');
            setLoading(false);
        }, 1000);
    };

    const handleReject = async () => {
        if(!note) return alert('Harap isi alasan penolakan!');
        setLoading(true);
        setTimeout(() => { 
            setStatus('rejected');
            setShowRejectModal(false);
            setLoading(false);
        }, 1000);
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
                                <span style={{fontSize:'1.1rem', fontWeight:700}}>{data.tgl}</span>
                            </div>
                        </div>

                        <div className="detail-grid">
                            <div>
                                <label className="label-text">Mahasiswa</label>
                                <p className="value-text">{data.mahasiswa}</p>
                                <p className="sub-value">{data.nim}</p>
                            </div>
                            <div>
                                <label className="label-text">Ruangan</label>
                                <p className="value-text">{data.ruangan}</p>
                                <p className="sub-value">{data.jam}</p>
                            </div>
                        </div>

                        <div style={{marginBottom:30}}>
                            <label className="label-text">Keperluan</label>
                            <p style={{marginTop:5, lineHeight:1.6, color:'#334155'}}>{data.keperluan}</p>
                        </div>

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
                                
                                <button onClick={handleApprove} disabled={loading} className="btn btn-success" style={{width:'100%'}}>
                                    {loading ? <Loader2 className="animate-spin"/> : <CheckCircle size={18}/>} Setujui Pengajuan
                                </button>
                                
                                <button onClick={() => setShowRejectModal(true)} disabled={loading} className="btn btn-outline-danger" style={{width:'100%'}}>
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

            </div>
        </div>
    );
};

export default DetailPengajuan;