import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, User, Lock, Loader2 } from 'lucide-react'; // Tambahkan Loader2
import api from '../api'; // PENTING: Import Axios Connector

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State untuk menampilkan pesan error
    const [loading, setLoading] = useState(false); // State untuk loading spinner

    // Style yang Konsisten dengan CSS Global
    const inputStyle = { width: '100%', padding: '12px 12px 12px 42px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', color: '#0f172a', background: '#ffffff', transition: '0.2s' };
    const iconStyle = { position: 'absolute', left: 14, top: 13, color: '#94a3b8' };


    const handleLogin = async (e) => { // Fungsi diubah menjadi ASYNCHRONOUS
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Panggil API Login Laravel
            const response = await api.post('/login', {
                email: email,
                password: password
            });

            // 2. Simpan Data Asli (dari Database) ke LocalStorage
            const token = response.data.access_token; 
            const userData = response.data.user; 

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData)); // Data real user

            // 3. Redirect ke Dashboard
            navigate('/dashboard');

        } catch (err) {
            setLoading(false);
            if (err.response) {
                // Tampilkan pesan error dari Laravel (Password/Email Salah)
                setError(err.response.data.message || 'Login gagal. Cek kredensial Anda.');
            } else {
                 setError('Gagal terhubung ke Server. Pastikan Laravel running.');
            }
        }
    };

    return (
        // WRAPPER UTAMA (BACKGROUND NETRAL)
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            fontFamily: 'Inter, sans-serif'
        }}>
            
            {/* KARTU LOGIN */}
            <div className="card" style={{
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                border: '1px solid #e2e8f0',
            }}>
                
                {/* LOGO */}
                <div style={{
                    background: '#0284c7', 
                    color: 'white', 
                    width: 56, height: 56, 
                    borderRadius: '12px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 15px auto',
                    boxShadow: '0 4px 10px rgba(2, 132, 199, 0.2)'
                }}>
                    <BookOpen size={28} />
                </div>
                <h2 style={{margin: '0 0 5px 0', fontSize: '1.6rem', color: '#0f172a', fontWeight: 800}}>Selamat Datang</h2>
                <p style={{margin: '0 0 20px 0', color: '#64748b', fontSize: '0.9rem'}}>
                    Masuk ke Sistem Peminjaman Ruangan
                </p>

                {/* ERROR MESSAGE BAR */}
                {error && (
                    <div style={{backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize:'0.85rem', border:'1px solid #fecaca'}}>
                        {error}
                    </div>
                )}


                {/* FORM */}
                <form onSubmit={handleLogin} style={{textAlign: 'left'}}>
                    
                    <div style={{marginBottom: 20}}>
                        <label style={{display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155'}}>Email Kampus</label>
                        <div style={{position: 'relative'}}>
                            <User size={18} style={{...iconStyle}} />
                            <input 
                                type="email" 
                                placeholder="nim@student.iter.ac.id"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{...inputStyle}}
                                onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <div style={{marginBottom: 30}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 8}}>
                            <label style={{fontSize: '0.85rem', fontWeight: 600, color: '#334155'}}>Password</label>
                            <span style={{fontSize: '0.8rem', color: '#0284c7', cursor: 'pointer', fontWeight: 600}}>Lupa Password?</span>
                        </div>
                        <div style={{position: 'relative'}}>
                            <Lock size={18} style={{...iconStyle}} />
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{...inputStyle}}
                                onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* TOMBOL LOGIN */}
                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '14px', 
                        background: loading ? '#94a3b8' : '#0284c7', // Warna berubah saat loading
                        color: 'white', border: 'none', borderRadius: '10px', 
                        fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
                        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
                        transition: '0.2s'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.background = '#0369a1')}
                    onMouseLeave={(e) => !loading && (e.target.style.background = '#0284c7')}
                    >
                        {loading ? 'Memproses...' : 'Masuk'} 
                        {loading ? <Loader2 size={18} className="animate-spin"/> : <ArrowRight size={18} />}
                    </button>

                </form>

                <p style={{marginTop: 25, fontSize: '0.85rem', color: '#64748b'}}>
                    Belum punya akun? <span onClick={() => navigate('/register')} style={{color: '#0284c7', fontWeight: 700, cursor: 'pointer'}}>Daftar di sini</span>
                </p>
            </div>
        </div>
    );
};

export default Login;