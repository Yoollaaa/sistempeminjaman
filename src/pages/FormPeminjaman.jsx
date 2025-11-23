import React from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

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

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    style={{maxWidth: 600, margin: '0 auto'}}
                >
                    <button onClick={() => navigate(-1)} style={{background:'none', border:'none', color:'#64748b', cursor:'pointer', display:'flex', gap:6, marginBottom:20, fontWeight:600, fontSize:'0.9rem', transition:'0.2s'}}>
                        <ArrowLeft size={18}/> Kembali ke Dashboard
                    </button>

                    <div style={{background:'white', padding: 40, borderRadius: 24, border:'1px solid #e2e8f0', boxShadow:'0 20px 40px -10px rgba(0,0,0,0.08)'}}>
                        <div style={{marginBottom: 30, textAlign:'center'}}>
                            <h2 style={{marginTop:0, marginBottom:8, fontSize:'1.5rem', color:'#0f172a'}}>Formulir Peminjaman</h2>
                            <div style={{display:'inline-block', background:'#f0f9ff', color:'#0284c7', padding:'6px 16px', borderRadius:20, fontSize:'0.9rem', fontWeight:600}}>
                                {namaRuangan}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Tanggal Kegiatan</label>
                                <div style={{position:'relative'}}>
                                    <Calendar size={18} style={{position:'absolute', left:12, top:12, color:'#94a3b8'}} />
                                    <input type="date" className="form-input" defaultValue={tanggal} style={{paddingLeft: 40}} required />
                                </div>
                            </div>
                            
                            <div style={{display:'flex', gap:20}}>
                                <div className="form-group" style={{flex:1}}>
                                    <label className="form-label">Jam Mulai</label>
                                    <div style={{position:'relative'}}>
                                        <Clock size={18} style={{position:'absolute', left:12, top:12, color:'#94a3b8'}} />
                                        <input type="time" className="form-input" style={{paddingLeft: 40}} required />
                                    </div>
                                </div>
                                <div className="form-group" style={{flex:1}}>
                                    <label className="form-label">Jam Selesai</label>
                                    <div style={{position:'relative'}}>
                                        <Clock size={18} style={{position:'absolute', left:12, top:12, color:'#94a3b8'}} />
                                        <input type="time" className="form-input" style={{paddingLeft: 40}} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Keperluan Kegiatan</label>
                                <textarea className="form-input" rows="4" placeholder="Jelaskan detail kegiatan, misal: Kuliah Pengganti..." required style={{resize:'vertical'}}></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Upload Surat (PDF)</label>
                                <div style={{border:'2px dashed #cbd5e1', borderRadius:12, padding:30, textAlign:'center', cursor:'pointer', background:'#f8fafc', transition:'0.2s'}}
                                     onMouseOver={(e) => e.currentTarget.style.background='#f1f5f9'}
                                     onMouseOut={(e) => e.currentTarget.style.background='#f8fafc'}>
                                    <UploadCloud size={32} color="#64748b" style={{marginBottom:10}}/>
                                    <p style={{margin:0, fontSize:'0.9rem', color:'#0f172a', fontWeight:600}}>Klik untuk pilih file</p>
                                    <p style={{margin:0, fontSize:'0.8rem', color:'#64748b'}}>Maksimal ukuran 2MB</p>
                                    <input type="file" accept=".pdf" style={{display:'none'}} />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{width:'100%', marginTop:10, padding:14, fontSize:'1rem'}}>
                                Kirim Pengajuan
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FormPeminjaman;