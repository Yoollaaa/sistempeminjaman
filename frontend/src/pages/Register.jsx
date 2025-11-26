import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, User, Lock, Mail, Clipboard, Loader2 } from 'lucide-react';
import api from '../api'; // PENTING: Import API client

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nama: '',
        nim: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'mahasiswa', // Default role untuk self-registrasi
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Style yang Konsisten
    const labelStyle = { display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#334155' };
    const inputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', color: '#0f172a', background: 'white', transition: '0.2s' };
    const iconStyle = { position: 'absolute', left: 14, top: 13, color: '#94a3b8' };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => { // DIUBAH MENJADI ASYNC
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // PANGGIL API REGISTER ASLI
            const response = await api.post('/register', formData);
            
            // Registrasi berhasil
            alert(`Pendaftaran berhasil! Akun Anda: ${response.data.user.email}. Silakan Login.`);
            setLoading(false);
            
            // Redirect ke halaman Login
            navigate('/');

        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data.errors) {
                // Tangani error validasi 422 dari Laravel
                const messages = Object.values(err.response.data.errors).flat();
                setError('Validasi Gagal: ' + messages.join(' | '));
            } else if (err.response) {
                setError(err.response.data.message || 'Pendaftaran gagal.');
            } else {
                 setError('Gagal terhubung ke server.');
            }
        }
    };

    return (
        <div style={{minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px'}}>
            
            <div className="card" style={{padding: '30px 40px', width: '100%', maxWidth: '450px', textAlign: 'center'}}>
                
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom: 25}}>
                    <div style={{background: '#0284c7', color: 'white', width: 50, height: 50, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'}}>
                        <BookOpen size={24} />
                    </div>
                    <h2 style={{margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a', fontWeight: 800}}>Daftar Akun Baru</h2>
                    <p style={{margin: 0, color: '#64748b', fontSize: '0.85rem'}}>Mahasiswa Teknik Elektro</p>
                </div>

                {error && (
                    <div style={{backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize:'0.8rem', textAlign:'left'}}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{textAlign: 'left'}}>
                    
                    {/* NAMA */}
                    <div style={{marginBottom: 15}}>
                        <label style={{...labelStyle}}>Nama Lengkap</label>
                        <div style={{position: 'relative'}}><User size={18} style={{...iconStyle}} />
                            <input type="text" name="nama" value={formData.nama} onChange={handleChange} required style={{...inputStyle, paddingLeft: 42}} />
                        </div>
                    </div>

                    {/* NIM */}
                    <div style={{marginBottom: 15}}>
                        <label style={{...labelStyle}}>NIM</label>
                        <div style={{position: 'relative'}}><Clipboard size={18} style={{...iconStyle}} />
                            <input type="text" name="nim" value={formData.nim} onChange={handleChange} required style={{...inputStyle, paddingLeft: 42}} />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div style={{marginBottom: 15}}>
                        <label style={{...labelStyle}}>Email Kampus</label>
                        <div style={{position: 'relative'}}><Mail size={18} style={{...iconStyle}} />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{...inputStyle, paddingLeft: 42}} />
                        </div>
                    </div>
                    
                    {/* ROLE (Pilihan) */}
                    <div style={{marginBottom: 15}}>
                        <label style={{...labelStyle}}>Daftar Sebagai</label>
                        <div style={{position: 'relative'}}>
                            <select name="role" value={formData.role} onChange={handleChange} required style={{...inputStyle}}>
                                <option value="mahasiswa">Mahasiswa</option>
                                <option value="dosen">Dosen</option>
                                {/* Admin dan Kajur didaftarkan oleh admin, tidak self-register */}
                            </select>
                        </div>
                    </div>
                    
                    {/* PASSWORD */}
                    <div style={{marginBottom: 15}}>
                        <label style={{...labelStyle}}>Password</label>
                        <div style={{position: 'relative'}}><Lock size={18} style={{...iconStyle}} />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{...inputStyle, paddingLeft: 42}} />
                        </div>
                    </div>

                    {/* PASSWORD CONFIRMATION */}
                    <div style={{marginBottom: 30}}>
                        <label style={{...labelStyle}}>Ulangi Password</label>
                        <div style={{position: 'relative'}}><Lock size={18} style={{...iconStyle}} />
                            <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required style={{...inputStyle, paddingLeft: 42}} />
                        </div>
                    </div>

                    {/* TOMBOL DAFTAR */}
                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '14px', background: loading ? '#94a3b8' : '#0284c7', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: '0.2s',
                        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.background = '#0369a1')}
                    onMouseLeave={(e) => !loading && (e.target.style.background = '#0284c7')}
                    >
                        {loading ? 'Mendaftarkan...' : 'Daftar Akun'} 
                        {loading ? <Loader2 size={18} className="animate-spin"/> : <ArrowRight size={18}/>}
                    </button>

                </form>

                <p style={{marginTop: 25, fontSize: '0.85rem', color: '#64748b', textAlign:'center'}}>
                    Sudah punya akun? <span onClick={() => navigate('/')} style={{color: '#0284c7', fontWeight: 700, cursor: 'pointer'}}>Login di sini</span>
                </p>
            </div>
        </div>
    );
};

export default Register;