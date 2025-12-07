import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Users, MapPin, ArrowRight } from 'lucide-react';

const PilihRuangan = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // DATA DUMMY (Disesuaikan agar kompatibel dengan Backend)
    // PENTING: Saya ubah 'id' menjadi 'ruangan_id' agar FormPeminjaman bisa membacanya.
    const rooms = [
        { ruangan_id: 1, nama: 'H5', desc: 'Lab Sistem Kendali', cap: '40 Org', loc: 'Gedung H Lantai 1', status: 'Tersedia', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80' },
        { ruangan_id: 2, nama: 'H19', desc: 'Lab Jaringan Komputer', cap: '30 Org', loc: 'Gedung H Lantai 2', status: 'Tersedia', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80' },
        { ruangan_id: 3, nama: 'H20', desc: 'Ruang Kuliah Teori', cap: '60 Org', loc: 'Gedung H Lantai 2', status: 'Digunakan', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80' },
        { ruangan_id: 4, nama: 'H17', desc: 'Ruang Sidang', cap: '15 Org', loc: 'Gedung H Lantai 3', status: 'Tersedia', img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80' }
    ];

    const handleAjukan = (room) => {
        navigate('/ajukan', {
            state: {
                ruangan: room, // <--- INI KUNCINYA (Kirim object utuh)
                tanggal: selectedDate
            }
        });
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container" style={{background: '#f8fafc', minHeight: '100vh', padding: '30px'}}>
                <div style={{marginBottom: 30}}>
                    <h1 style={{fontSize: '1.8rem', fontWeight: 700, margin: '0 0 5px 0', color: '#0f172a'}}>Daftar Ruangan</h1>
                    <p style={{color: '#64748b', margin: 0}}>Silakan pilih ruangan untuk melihat detail dan mengajukan peminjaman.</p>
                </div>

                {/* Filter Bar */}
                <div className="filter-box" style={{display:'flex', gap:20, background:'white', padding:20, borderRadius:12, boxShadow:'0 2px 4px rgba(0,0,0,0.05)', marginBottom:30}}>
                    <div style={{flex: 1}}>
                        <label style={{fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', display:'block', marginBottom:5}}>TANGGAL KEGIATAN</label>
                        <div style={{display:'flex', alignItems:'center', gap:10, background:'#f1f5f9', padding:'10px', borderRadius:8}}>
                            <Calendar size={20} color="#64748b" />
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} 
                                style={{border:'none', background:'transparent', width:'100%', outline:'none', fontWeight:600, color:'#0f172a', fontFamily:'inherit'}} />
                        </div>
                    </div>
                    <div style={{width: 1, background: '#e2e8f0'}}></div>
                    <div style={{flex: 1}}>
                        <label style={{fontSize:'0.75rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', display:'block', marginBottom:5}}>PENCARIAN</label>
                        <div style={{display:'flex', alignItems:'center', gap:10, background:'#f1f5f9', padding:'10px', borderRadius:8}}>
                            <Search size={20} color="#94a3b8" />
                            <input type="text" placeholder="Cari nama ruangan..." style={{border:'none', background:'transparent', width:'100%', outline:'none', fontWeight:600, color:'#0f172a'}} />
                        </div>
                    </div>
                </div>

                {/* Grid Ruangan */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24}}>
                    {rooms.map((room) => (
                        <div key={room.ruangan_id} className="card" style={{background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)', border:'1px solid #e2e8f0'}}>
                            <div style={{height: 160, width: '100%', position: 'relative'}}>
                                <img src={room.img} alt={room.nama} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                <div style={{position: 'absolute', top: 10, right: 10}}>
                                    <span style={{
                                        background: room.status === 'Tersedia' ? '#dcfce7' : '#fee2e2',
                                        color: room.status === 'Tersedia' ? '#166534' : '#991b1b',
                                        padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700
                                    }}>
                                        {room.status}
                                    </span>
                                </div>
                            </div>
                            <div style={{padding: 20}}>
                                <h3 style={{margin: '0 0 5px 0', fontSize: '1.4rem', color: '#0f172a'}}>{room.nama}</h3>
                                <p style={{margin: '0 0 15px 0', color: '#64748b', fontSize: '0.9rem'}}>{room.desc}</p>
                                <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom: 20, color:'#64748b', fontSize:'0.85rem'}}>
                                    <div style={{display:'flex', alignItems:'center', gap:8}}><Users size={16}/> {room.cap}</div>
                                    <div style={{display:'flex', alignItems:'center', gap:8}}><MapPin size={16}/> {room.loc}</div>
                                </div>
                                <button 
                                    disabled={room.status !== 'Tersedia'}
                                    onClick={() => handleAjukan(room)}
                                    style={{
                                        width:'100%', padding:'12px', borderRadius:8, border:'none',
                                        background: room.status === 'Tersedia' ? '#0ea5e9' : '#e2e8f0',
                                        color: room.status === 'Tersedia' ? 'white' : '#94a3b8',
                                        fontWeight:600, cursor: room.status === 'Tersedia' ? 'pointer' : 'not-allowed',
                                        display:'flex', alignItems:'center', justifyContent:'center', gap:8
                                    }}
                                >
                                    {room.status === 'Tersedia' ? 'Ajukan Peminjaman' : 'Tidak Tersedia'} <ArrowRight size={16}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PilihRuangan;