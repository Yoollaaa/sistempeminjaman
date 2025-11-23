import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, User, Lock } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const user = { nama: 'Febby Yolanda', role: 'Mahasiswa', email: email };
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
    };

    return (
        // 1. BACKGROUND NETRAL (ABU MUDA + POLA TITIK HALUS)
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8fafc', // Abu sangat muda
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', // Pola titik halus
            backgroundSize: '30px 30px',
            fontFamily: 'Inter, sans-serif'
        }}>
            
            {/* 2. KARTU LOGIN PUTIH BERSIH */}
            <div style={{
                background: 'white',
                padding: '40px 50px',
                borderRadius: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)', // Shadow super lembut
                border: '1px solid #e2e8f0',
                width: '100%',
                maxWidth: '420px',
                textAlign: 'center'
            }}>
                
                {/* Logo Sederhana */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: '#0f172a', // Hitam (Elegan)
                    color: 'white', 
                    width: 50, height: 50, 
                    borderRadius: '12px', 
                    marginBottom: '20px'
                }}>
                    <BookOpen size={24} />
                </div>

                <h2 style={{margin: '0 0 8px 0', fontSize: '1.6rem', color: '#0f172a', fontWeight: 800}}>
                    Selamat Datang
                </h2>
                <p style={{margin: '0 0 30px 0', color: '#64748b', fontSize: '0.95rem'}}>
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
                                style={{
                                    width: '100%', padding: '12px 12px 12px 42px', 
                                    borderRadius: '10px', border: '1px solid #e2e8f0', 
                                    outline: 'none', fontSize: '0.95rem', color: '#0f172a',
                                    background: '#ffffff', transition: '0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0f172a'} // Fokus jadi hitam
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <div style={{marginBottom: 30}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 8}}>
                            <label style={{fontSize: '0.85rem', fontWeight: 600, color: '#334155'}}>Password</label>
                            <span style={{fontSize: '0.8rem', color: '#6366f1', cursor: 'pointer', fontWeight: 600}}>Lupa Password?</span>
                        </div>
                        <div style={{position: 'relative'}}>
                            <Lock size={18} style={{position: 'absolute', left: 14, top: 13, color: '#94a3b8'}} />
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '12px 12px 12px 42px', 
                                    borderRadius: '10px', border: '1px solid #e2e8f0', 
                                    outline: 'none', fontSize: '0.95rem', color: '#0f172a',
                                    background: '#ffffff', transition: '0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#0f172a'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>
                    </div>

                    <button type="submit" style={{
                        width: '100%', padding: '14px', 
                        background: '#0f172a', // Tombol Hitam (Professional)
                        color: 'white', border: 'none', borderRadius: '10px', 
                        fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10,
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                        transition: '0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Masuk <ArrowRight size={18} />
                    </button>

                </form>

                <p style={{marginTop: 25, fontSize: '0.85rem', color: '#64748b'}}>
                    Belum punya akun? <span style={{color: '#0f172a', fontWeight: 700, cursor: 'pointer'}}>Hubungi Admin</span>
                </p>
            </div>
        </div>
    );
};

export default Login;