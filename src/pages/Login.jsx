import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const user = { nama: 'Febby Yolanda', role: 'Mahasiswa', email: email };
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
    };

    return (
        <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9'}}>
            <div className="card" style={{padding: 40, width: '100%', maxWidth: 400, textAlign:'center'}}>
                <div style={{background: '#0284c7', padding: 12, borderRadius: 12, color: 'white', display:'inline-block', marginBottom:20}}>
                    <BookOpen size={32} />
                </div>
                <h2 style={{margin:0, fontSize:'1.5rem', color:'#0f172a'}}>Login Sistem</h2>
                <p style={{color:'#64748b', marginBottom: 30}}>Peminjaman Ruangan Teknik Elektro</p>
                
                <form onSubmit={handleLogin} style={{textAlign:'left'}}>
                    <div className="form-group">
                        <label className="form-label">Email Kampus</label>
                        <input type="email" className="form-input" placeholder="nama@mahasiswa.ac.id" required 
                            value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-input" placeholder="••••••" required />
                    </div>
                    <button type="submit" className="btn-primary" style={{width:'100%'}}>Masuk</button>
                </form>
            </div>
        </div>
    );
};

export default Login;