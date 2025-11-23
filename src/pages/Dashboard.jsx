import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'User' };
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // DATA RUANGAN SESUAI REQUEST
    const rooms = [
        { 
            id: 1, kode: 'H5', nama: 'Lab Sistem Kendali', kapasitas: 40, 
            lokasi: 'Gedung H Lantai 1', status: 'Tersedia',
            img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80' 
        },
        { 
            id: 2, kode: 'H20', nama: 'Ruang Kuliah Teori', kapasitas: 60, 
            lokasi: 'Gedung H Lantai 2', status: 'Digunakan',
            img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' 
        },
        { 
            id: 3, kode: 'H19', nama: 'Lab Jaringan Komputer', kapasitas: 30, 
            lokasi: 'Gedung H Lantai 2', status: 'Tersedia',
            img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80'
        },
        { 
            id: 4, kode: 'H3', nama: 'Ruang Sidang', kapasitas: 15, 
            lokasi: 'Gedung H Lantai 1', status: 'Tersedia',
            img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80'
        }
    ];

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container">
                
                {/* HEADER */}
                <div style={{marginBottom: 30}}>
                    <h1 style={{fontSize: '1.8rem', margin: '0 0 5px 0', color: '#0f172a'}}>Pilih Ruangan</h1>
                    <p style={{color: '#64748b', margin: 0}}>Halo <b>{user.nama}</b>, silakan pilih ruangan untuk kegiatan akademik.</p>
                </div>

                {/* FILTER BAR */}
                <div className="card" style={{padding: 20, marginBottom: 30, display:'flex', alignItems:'center', gap: 20, borderRadius:12}}>
                    <div style={{flex:1}}>
                        <label style={{fontSize:'0.75rem', fontWeight:700, color:'#64748b', display:'block', marginBottom:5}}>TANGGAL KEGIATAN</label>
                        <div style={{display:'flex', alignItems:'center', gap:10, background:'#f8fafc', padding:'8px 12px', borderRadius:8, border:'1px solid #e2e8f0'}}>
                            <Calendar color="#0284c7" size={20} />
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} 
                                style={{border:'none', background:'transparent', fontSize:'0.95rem', fontWeight:600, color:'#0f172a', outline:'none', width:'100%'}} />
                        </div>
                    </div>
                    <div style={{width:1, height:40, background:'#e2e8f0'}}></div>
                    <div style={{flex:1}}>
                        <label style={{fontSize:'0.75rem', fontWeight:700, color:'#64748b', display:'block', marginBottom:5}}>CARI RUANGAN</label>
                        <div style={{display:'flex', alignItems:'center', gap:10, background:'#f8fafc', padding:'8px 12px', borderRadius:8, border:'1px solid #e2e8f0'}}>
                            <Search color="#94a3b8" size={20} />
                            <input type="text" placeholder="Contoh: H5..." style={{border:'none', background:'transparent', fontSize:'0.95rem', outline:'none', width:'100%'}} />
                        </div>
                    </div>
                </div>

                {/* GRID RUANGAN */}
                <h3 style={{marginBottom: 20, color: '#334155'}}>Daftar Ruangan Gedung H</h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24}}>
                    {rooms.map((room) => (
                        <div key={room.id} className="card" style={{overflow:'hidden', display:'flex', flexDirection:'column', transition:'0.2s'}}>
                            <div style={{height: 150, position:'relative'}}>
                                <img src={room.img} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                <div style={{position:'absolute', top:10, right:10}}>
                                    <span className={`badge ${room.status === 'Tersedia' ? 'ok' : 'no'}`}>{room.status}</span>
                                </div>
                                <div style={{position:'absolute', bottom:10, left:10, background:'rgba(255,255,255,0.9)', padding:'4px 10px', borderRadius:6, fontWeight:700, fontSize:'0.8rem', color:'#0284c7'}}>
                                    Gedung {room.kode}
                                </div>
                            </div>
                            
                            <div style={{padding: 20, flex:1, display:'flex', flexDirection:'column'}}>
                                <h3 style={{margin:'0 0 5px 0', fontSize:'1.2rem', color:'#0f172a'}}>{room.nama}</h3>
                                <div style={{display:'flex', gap:15, fontSize:'0.85rem', color:'#64748b', marginBottom: 20}}>
                                    <span style={{display:'flex', alignItems:'center', gap:4}}><Users size={14}/> {room.kapasitas}</span>
                                    <span style={{display:'flex', alignItems:'center', gap:4}}><MapPin size={14}/> {room.lokasi}</span>
                                </div>
                                
                                <button 
                                    className="btn-primary" style={{marginTop:'auto', width:'100%'}}
                                    disabled={room.status !== 'Tersedia'}
                                    onClick={() => navigate('/ajukan', {state: {namaRuangan: `Gedung ${room.kode} - ${room.nama}`, tanggal: selectedDate}})}
                                >
                                    {room.status === 'Tersedia' ? 'Ajukan Pinjam' : 'Tidak Tersedia'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;