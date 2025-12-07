import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Calendar, Clock, FileText, Loader2, FileCheck, X, AlertCircle } from 'lucide-react';
import api from '../api';

const FormPeminjaman = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);
    
    // --- 1. AMBIL DATA DARI NAVIGASI ---
    // Menggunakan optional chaining (?.)
    const ruanganData = location.state?.ruangan; 
    const tanggalDefault = location.state?.tanggal || new Date().toISOString().split('T')[0];

    // --- 2. CEK APAKAH DATA RUANGAN ADA ---
    // Jika user masuk lewat Sidebar, ruanganData akan undefined
    const isInvalidAccess = !ruanganData || !ruanganData.ruangan_id;

    // Redirect otomatis jika data tidak valid (Opsional, tapi disarankan)
    useEffect(() => {
        if (isInvalidAccess) {
            // Kita beri delay sedikit agar user sadar ada yang salah, atau biarkan tampil pesan error di UI
            // navigate('/dashboard'); 
        }
    }, [isInvalidAccess, navigate]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [formState, setFormState] = useState({
        ruangan_id: ruanganData ? ruanganData.ruangan_id : '', 
        tanggal_pinjam: tanggalDefault,
        jam_mulai: '',
        jam_selesai: '',
        keperluan: '',
    });

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    // --- LOGIKA FILE ---
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]);
    };

    const validateAndSetFile = (file) => {
        if (file.type !== "application/pdf") {
            setError("Hanya file PDF yang diperbolehkan.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError("Ukuran file maksimal 2MB.");
            return;
        }
        setError('');
        setSelectedFile(file);
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // --- LOGIKA SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (isInvalidAccess) {
            setError("Data ruangan hilang. Silakan kembali ke dashboard dan pilih ruangan lagi.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('ruangan_id', formState.ruangan_id);
            formData.append('tanggal_pinjam', formState.tanggal_pinjam);
            formData.append('jam_mulai', formState.jam_mulai);
            formData.append('jam_selesai', formState.jam_selesai);
            formData.append('keperluan', formState.keperluan);
            
            if (selectedFile) {
                formData.append('file_surat', selectedFile); 
            }

            const response = await api.post('/peminjaman', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert("Berhasil! " + response.data.message);
            navigate('/riwayat'); 
            
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Terjadi kesalahan saat menghubungi server.');
            }
        }
    };

    // --- STYLES ---
    const styles = {
        label: { display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#334155' },
        inputWrapper: { position: 'relative' },
        icon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
        input: {
            width: '100%', padding: '12px 12px 12px 45px', borderRadius: '10px',
            border: '1px solid #cbd5e1', fontSize: '0.95rem', color: '#1e293b', outline: 'none',
            transition: 'border-color 0.2s', backgroundColor: '#fff'
        },
        sectionHeader: { 
            fontSize: '1rem', fontWeight: '700', color: '#475569', 
            marginTop: '20px', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #f1f5f9' 
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container" style={{background: '#f8fafc', minHeight: '100vh', padding: '30px'}}>
                
                {/* Tombol Kembali */}
                <button onClick={() => navigate(-1)} style={{
                    background:'none', border:'none', color:'#64748b', 
                    cursor:'pointer', display:'flex', alignItems:'center', gap:8, 
                    marginBottom:20, fontWeight:600
                }}>
                    <ArrowLeft size={20}/> Kembali
                </button>

                <form onSubmit={handleSubmit} style={{maxWidth: 700, margin: '0 auto'}}>
                    
                    {/* CARD UTAMA */}
                    <div style={{
                        background: 'white', 
                        borderRadius: '20px', 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0'
                    }}>
                        
                        {/* HEADER GRADASI */}
                        <div style={{
                            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                            padding: '30px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <h2 style={{margin: 0, fontSize: '1.8rem', fontWeight: '800'}}>Formulir Peminjaman</h2>
                            <p style={{margin: '8px 0 0 0', opacity: 0.9, fontSize: '0.95rem'}}>Lengkapi detail di bawah untuk mengajukan ruangan</p>
                            
                            {/* Chip Nama Ruangan */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)',
                                padding: '8px 16px', borderRadius: '50px', 
                                marginTop: '20px', fontSize: '0.95rem', fontWeight: '600'
                            }}>
                                {isInvalidAccess ? (
                                    <> <AlertCircle size={18}/> Error: Ruangan tidak dipilih </>
                                ) : (
                                    <> 🏢 {ruanganData.nama || ruanganData.nama_ruangan} </>
                                )}
                            </div>
                        </div>

                        {/* FORM BODY */}
                        <div style={{padding: '40px'}}>
                            
                            {/* Alert Error */}
                            {error && (
                                <div style={{
                                    background:'#fef2f2', border:'1px solid #fecaca', color:'#991b1b', 
                                    padding:'14px', borderRadius:'12px', marginBottom:'24px', 
                                    fontSize: '0.9rem', display:'flex', alignItems:'center', gap: 10
                                }}>
                                    <AlertCircle size={20}/> {error}
                                </div>
                            )}

                            {/* Alert Invalid Access */}
                            {isInvalidAccess && !error && (
                                <div style={{
                                    background:'#fff7ed', border:'1px solid #fed7aa', color:'#c2410c', 
                                    padding:'16px', borderRadius:'12px', marginBottom:'24px', textAlign:'center'
                                }}>
                                    <strong>Perhatian:</strong> Anda mengakses halaman ini secara langsung. 
                                    Silakan kembali ke Dashboard dan pilih ruangan terlebih dahulu.
                                    <br/>
                                    <button type="button" onClick={() => navigate('/dashboard')} 
                                        style={{marginTop:10, padding:'8px 16px', background:'#c2410c', color:'white', border:'none', borderRadius:6, cursor:'pointer'}}>
                                        Ke Dashboard
                                    </button>
                                </div>
                            )}

                            {/* --- INPUT FIELDS --- */}
                            <div style={styles.sectionHeader}>📅 Waktu Peminjaman</div>

                            <div style={{marginBottom:'20px'}}>
                                <label style={styles.label}>Tanggal Kegiatan</label>
                                <div style={styles.inputWrapper}>
                                    <Calendar size={20} style={styles.icon} />
                                    <input 
                                        type="date" name="tanggal_pinjam" 
                                        defaultValue={tanggalDefault} onChange={handleChange} 
                                        style={styles.input} disabled={isInvalidAccess} required 
                                    />
                                </div>
                            </div>

                            <div style={{display:'flex', gap:'20px', marginBottom:'10px'}}>
                                <div style={{flex:1}}>
                                    <label style={styles.label}>Jam Mulai</label>
                                    <div style={styles.inputWrapper}>
                                        <Clock size={20} style={styles.icon} />
                                        <input type="time" name="jam_mulai" onChange={handleChange} style={styles.input} disabled={isInvalidAccess} required />
                                    </div>
                                </div>
                                <div style={{flex:1}}>
                                    <label style={styles.label}>Jam Selesai</label>
                                    <div style={styles.inputWrapper}>
                                        <Clock size={20} style={styles.icon} />
                                        <input type="time" name="jam_selesai" onChange={handleChange} style={styles.input} disabled={isInvalidAccess} required />
                                    </div>
                                </div>
                            </div>

                            <div style={styles.sectionHeader}>📝 Detail Keperluan</div>

                            <div style={{marginBottom:'20px'}}>
                                <label style={styles.label}>Tujuan Peminjaman</label>
                                <div style={{position: 'relative'}}>
                                    <FileText size={20} style={{...styles.icon, top: '20px', transform:'none'}} />
                                    <textarea 
                                        name="keperluan" rows="3" 
                                        placeholder="Jelaskan kegiatan yang akan dilakukan..." 
                                        onChange={handleChange} disabled={isInvalidAccess} required 
                                        style={{...styles.input, paddingLeft:'45px', resize:'vertical', fontFamily: 'inherit'}}
                                    ></textarea>
                                </div>
                            </div>

                            <div style={styles.sectionHeader}>📂 Dokumen (Opsional)</div>

                            <div style={{marginBottom:'30px'}}>
                                <label style={styles.label}>Upload Surat Permohonan</label>
                                
                                {!selectedFile ? (
                                    <div 
                                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                        onClick={() => !isInvalidAccess && fileInputRef.current.click()}
                                        style={{
                                            border: dragActive ? '2px dashed #2563eb' : '2px dashed #cbd5e1',
                                            background: dragActive ? '#eff6ff' : '#f8fafc',
                                            borderRadius:'16px', padding:'30px', textAlign:'center', 
                                            cursor: isInvalidAccess ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            opacity: isInvalidAccess ? 0.6 : 1
                                        }}
                                    >
                                        <UploadCloud size={48} color={dragActive ? "#2563eb" : "#94a3b8"} style={{marginBottom:'15px'}}/>
                                        <p style={{margin:0, fontSize:'1rem', color:'#1e293b', fontWeight:'600'}}>
                                            {dragActive ? "Lepaskan file sekarang" : "Klik atau drag file PDF ke sini"}
                                        </p>
                                        <p style={{marginTop:'5px', fontSize:'0.85rem', color:'#64748b'}}>Maksimal ukuran 2MB</p>
                                        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} style={{display:'none'}} disabled={isInvalidAccess}/>
                                    </div>
                                ) : (
                                    <div style={{
                                        border: '1px solid #e2e8f0', borderRadius:'16px', padding:'20px', 
                                        display:'flex', alignItems:'center', justifyContent:'space-between',
                                        background:'#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                                            <div style={{background:'#eff6ff', padding:'12px', borderRadius:'12px'}}>
                                                <FileCheck size={28} color="#2563eb" />
                                            </div>
                                            <div>
                                                <p style={{margin:0, fontSize:'0.95rem', fontWeight:'600', color:'#1e293b'}}>{selectedFile.name}</p>
                                                <p style={{margin:0, fontSize:'0.8rem', color:'#64748b'}}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={removeFile} style={{
                                            background:'#fef2f2', border:'none', borderRadius:'10px', 
                                            width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', 
                                            color:'#ef4444', transition:'background 0.2s'
                                        }}>
                                            <X size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* BUTTON ACTION */}
                            <button 
                                type="submit" 
                                disabled={loading || isInvalidAccess} 
                                style={{
                                    width:'100%', padding:'16px', fontSize:'1rem', fontWeight: '700', borderRadius: '12px', border: 'none',
                                    background: (loading || isInvalidAccess) ? '#cbd5e1' : 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                                    color: 'white', cursor: (loading || isInvalidAccess) ? 'not-allowed' : 'pointer',
                                    display:'flex', justifyContent:'center', alignItems:'center', gap:'10px',
                                    boxShadow: (loading || isInvalidAccess) ? 'none' : '0 10px 20px -10px rgba(37, 99, 235, 0.5)',
                                    transition: 'transform 0.1s'
                                }}
                            >
                                {loading && <Loader2 className="animate-spin" size={20} />}
                                {loading ? 'Sedang Mengirim...' : 'Kirim Pengajuan'}
                            </button>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormPeminjaman;