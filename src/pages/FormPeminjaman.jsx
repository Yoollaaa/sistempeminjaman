import React from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Calendar, Clock, FileText } from 'lucide-react';

const FormPeminjaman = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const namaRuangan = location.state?.namaRuangan || "Ruangan";
    const tanggal = location.state?.tanggal || "";

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Permohonan Anda berhasil dikirim! Menunggu persetujuan.");
        navigate('/riwayat');
    };

    // Style yang Konsisten
    const inputStyle = { paddingLeft: 40, width: '100%' };
    const iconStyle = { position:'absolute', left:12, top:12, color:'#94a3b8' };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container">
                <div style={{maxWidth: 650, margin: '0 auto'}}>
                    <button onClick={() => navigate(-1)} style={{background:'none', border:'none', color:'#64748b', cursor:'pointer', display:'flex', gap:6, marginBottom:20, fontWeight:600, fontSize:'0.9rem'}}>
                        <ArrowLeft size={18}/> Kembali ke Daftar Ruangan
                    </button>

                    <div className="card" style={{padding: 40}}>
                        <div style={{marginBottom: 30, textAlign:'center'}}>
                            <h2 style={{marginTop:0, marginBottom:8, fontSize:'1.8rem', color:'#0f172a'}}>Formulir Pengajuan</h2>
                            <div style={{display:'inline-block', background:'#f0f9ff', color:'#0284c7', padding:'6px 16px', borderRadius:20, fontSize:'1rem', fontWeight:600}}>
                                {namaRuangan}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* TANGGAL */}
                            <div className="form-group">
                                <label className="form-label">Tanggal Kegiatan</label>
                                <div style={{position:'relative'}}>
                                    <Calendar size={18} style={{...iconStyle}} />
                                    <input type="date" className="form-input" defaultValue={tanggal} style={{...inputStyle}} required />
                                </div>
                            </div>
                            
                            {/* JAM MULAI & SELESAI (Side-by-Side) */}
                            <div style={{display:'flex', gap:20}}>
                                <div className="form-group" style={{flex:1}}>
                                    <label className="form-label">Jam Mulai</label>
                                    <div style={{position:'relative'}}>
                                        <Clock size={18} style={{...iconStyle}} />
                                        <input type="time" className="form-input" style={{...inputStyle}} required />
                                    </div>
                                </div>
                                <div className="form-group" style={{flex:1}}>
                                    <label className="form-label">Jam Selesai</label>
                                    <div style={{position:'relative'}}>
                                        <Clock size={18} style={{...iconStyle}} />
                                        <input type="time" className="form-input" style={{...inputStyle}} required />
                                    </div>
                                </div>
                            </div>

                            {/* KEPERLUAN KEGIATAN */}
                            <div className="form-group">
                                <label className="form-label">Keperluan Kegiatan</label>
                                <div style={{position:'relative'}}>
                                    <FileText size={18} style={{position:'absolute', left:12, top:12, color:'#94a3b8'}} />
                                    <textarea className="form-input" rows="4" placeholder="Jelaskan detail kegiatan, misal: Kuliah Pengganti..." required style={{resize:'vertical', paddingLeft:40}}></textarea>
                                </div>
                            </div>

                            {/* UPLOAD SURAT */}
                            <div className="form-group">
                                <label className="form-label">Upload Surat Permohonan (PDF)</label>
                                <div style={{border:'2px dashed #cbd5e1', borderRadius:12, padding:30, textAlign:'center', cursor:'pointer', background:'#f8fafc', transition:'0.2s'}}>
                                    <UploadCloud size={32} color="#64748b" style={{marginBottom:10}}/>
                                    <p style={{margin:0, fontSize:'0.9rem', color:'#0f172a', fontWeight:600}}>Klik untuk pilih file</p>
                                    <input type="file" accept=".pdf" style={{display:'none'}} />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{width:'100%', marginTop:10, padding:14, fontSize:'1rem'}}>
                                Kirim Pengajuan
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormPeminjaman;