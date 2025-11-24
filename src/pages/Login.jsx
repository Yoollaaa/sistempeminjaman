import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, User, Lock } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulasi Login
        const user = { nama: 'Febby Yolanda Putri', role: 'Mahasiswa', email: email };
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
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
                
                {/* LOGO (PERBAIKAN WARNA) */}
                <div style={{
                    background: '#0284c7', // Warna Primer
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
                <p style={{margin: '0 0 30px 0', color: '#64748b', fontSize: '0.9rem'}}>
                    Masuk ke Sistem Peminjaman Ruangan
                </p>

                {/* FORM */}
                <form onSubmit={handleLogin} style={{textAlign: 'left'}}>
                    
                    <div style={{marginBottom: 20}}>
                        <label style={{display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: '#334155'}}>Email Mahasiswa</label>
                        <div style={{position: 'relative'}}>
                            <User size={18} style={{position: 'absolute', left: 14, top: 13, color: '#94a3b8'}} />
                            <input 
                                type="email" 
                                placeholder="nim@student.iter.ac.id"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{width: '100%', padding: '12px 12px 12px 42px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', color: '#0f172a', background: '#ffffff', transition: '0.2s'}}
                                onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <div style={{marginBottom: 30}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 8}}>
                            <label style={{fontSize: '0.85rem', fontWeight: 600, color: '#334155'}}>Password</label>
                            {/* PERBAIKAN WARNA LINK */}
                            <span style={{fontSize: '0.8rem', color: '#0284c7', cursor: 'pointer', fontWeight: 600}}>Lupa Password?</span>
                        </div>
                        <div style={{position: 'relative'}}>
                            <Lock size={18} style={{position: 'absolute', left: 14, top: 13, color: '#94a3b8'}} />
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{width: '100%', padding: '12px 12px 12px 42px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#0f172a', background: '#ffffff', transition: '0.2s'}}
                                onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    {/* PERBAIKAN WARNA TOMBOL */}
                    <button type="submit" style={{
                        width: '100%', padding: '14px', 
                        background: '#0284c7', // WARNA PRIMER SKY BLUE
                        color: 'white', border: 'none', borderRadius: '10px', 
                        fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
                        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)',
                        transition: '0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#0369a1'}
                    onMouseLeave={(e) => e.target.style.background = '#0284c7'}
                    >
                        Masuk <ArrowRight size={18} />
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