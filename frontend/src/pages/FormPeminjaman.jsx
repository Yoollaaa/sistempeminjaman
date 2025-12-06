import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Calendar, Clock, FileText, Loader2 } from 'lucide-react';
import api from '../api'; // Import koneksi API

const FormPeminjaman = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Ambil data ruangan dari state navigasi
    const ruanganData = location.state?.ruangan || { nama: 'Ruangan', ruangan_id: null, kode: '?' }; 
    const tanggalDefault = location.state?.tanggal || new Date().toISOString().split('T')[0];

    const [formState, setFormState] = useState({
        ruangan_id: ruanganData.ruangan_id, // Kirim ID ruangan
        tanggal_pinjam: tanggalDefault,
        jam_mulai: '',
        jam_selesai: '',
        keperluan: '',
        // file_surat: null, // Untuk upload file
    });

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // KIRIM DATA KE LARAVEL
            const response = await api.post('/peminjaman', formState);

            alert(response.data.message);
            navigate('/riwayat'); // Arahkan ke halaman status
            
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data.message) {
                // Tangani error bentrok (409 Conflict) atau validasi (422)
                setError(err.response.data.message);
            } else {
                setError('Gagal menghubungi server. Silakan coba lagi.');
            }
        }
    };

    // Styling Disesuaikan
    const inputStyle = { paddingLeft: 40 };
    const iconStyle = { position:'absolute', left:12, top:12, color:'#94a3b8' };
    const labelStyle = {fontSize:'0.9rem', fontWeight:600, display:'block', marginBottom:6};

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container">
                <form onSubmit={handleSubmit} style={{maxWidth: 650, margin: '0 auto'}}>
                    <button onClick={() => navigate(-1)} style={{background:'none', border:'none', color:'#64748b', cursor:'pointer', display:'flex', gap:6, marginBottom:20, fontWeight:600, fontSize:'0.9rem'}}>
                        <ArrowLeft size={18}/> Kembali ke Daftar Ruangan
                    </button>

                    <div className="card" style={{padding: 40}}>
                        <div style={{marginBottom: 30, textAlign:'center'}}>
                            <h2 style={{marginTop:0, marginBottom:8, fontSize:'1.8rem', color:'#0f172a'}}>Formulir Pengajuan</h2>
                            <div style={{display:'inline-block', background:'#f0f9ff', color:'#0284c7', padding:'6px 16px', borderRadius:20, fontSize:'1rem', fontWeight:600}}>
                                Mengajukan: {ruanganData.nama}
                            </div>
                        </div>

                        {error && <div style={{background:'#fee2e2', color:'#991b1b', padding:10, borderRadius:8, marginBottom:20, textAlign:'center'}}>{error}</div>}


                        {/* INPUTS */}
                        <div style={{marginBottom:15}}>
                            <label style={labelStyle}>Tanggal Kegiatan</label>
                            <div style={{position:'relative'}}>
                                <Calendar size={18} style={iconStyle} />
                                <input type="date" name="tanggal_pinjam" className="form-input" defaultValue={tanggalDefault} onChange={handleChange} style={inputStyle} required />
                            </div>
                        </div>
                        
                        <div style={{display:'flex', gap:20}}>
                            <div className="form-group" style={{flex:1, marginBottom:15}}>
                                <label style={labelStyle}>Jam Mulai</label>
                                <div style={{position:'relative'}}>
                                    <Clock size={18} style={iconStyle} />
                                    <input type="time" name="jam_mulai" className="form-input" onChange={handleChange} style={inputStyle} required />
                                </div>
                            </div>
                            <div className="form-group" style={{flex:1, marginBottom:15}}>
                                <label style={labelStyle}>Jam Selesai</label>
                                <div style={{position:'relative'}}>
                                    <Clock size={18} style={iconStyle} />
                                    <input type="time" name="jam_selesai" className="form-input" onChange={handleChange} style={inputStyle} required />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={labelStyle}>Keperluan Kegiatan</label>
                            <div style={{position:'relative'}}>
                                <FileText size={18} style={iconStyle} />
                                <textarea name="keperluan" className="form-input" rows="4" placeholder="Contoh: Kuliah Pengganti Matkul..." onChange={handleChange} required style={{resize:'vertical', paddingLeft:40}}></textarea>
                            </div>
                        </div>

                        {/* UPLOAD (Belum fungsional, hanya UI) */}
                        <div className="form-group">
                            <label style={labelStyle}>Surat Permohonan (PDF)</label>
                            <div style={{border:'2px dashed #cbd5e1', borderRadius:12, padding:30, textAlign:'center', cursor:'pointer', background:'#f8fafc'}}>
                                <UploadCloud size={32} color="#64748b" style={{marginBottom:10}}/>
                                <p style={{margin:0, fontSize:'0.9rem', color:'#0f172a', fontWeight:600}}>Opsional: Klik untuk upload surat</p>
                                <p style={{margin:0, fontSize:'0.8rem', color:'#64748b'}}>Maksimal ukuran 2MB</p>
                                <input type="file" accept=".pdf" style={{display:'none'}} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary" style={{width:'100%', marginTop:20, padding:14, fontSize:'1rem'}}>
                            {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormPeminjaman;
