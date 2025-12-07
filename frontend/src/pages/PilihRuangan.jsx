import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Users, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api'; // Import API untuk koneksi ke backend

const PilihRuangan = () => {
    const navigate = useNavigate();
    
    // State Data Real dari Database
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State Filter UI
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    // Gambar Placeholder (Karena DB belum ada kolom foto)
    const roomImages = [
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80'
    ];

    // FETCH DATA DARI DATABASE (Agar nyambung dengan Admin)
    useEffect(() => {
        const fetchRuangan = async () => {
            try {
                setLoading(true);
                const response = await api.get('/ruangan');
                // Ambil data array yang benar dari response
                const data = Array.isArray(response.data) ? response.data : response.data.data || [];
                setRooms(data);
            } catch (error) {
                console.error("Gagal mengambil data ruangan:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRuangan();
    }, []);

    // Filter Pencarian
    const filteredRooms = rooms.filter(room => 
        room.nama_ruangan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAjukan = (room) => {
        navigate('/ajukan', {
            state: {
                ruangan: room, // Mengirim object ruangan asli dari DB
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
                            <input 
                                type="text" 
                                placeholder="Cari nama ruangan..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{border:'none', background:'transparent', width:'100%', outline:'none', fontWeight:600, color:'#0f172a'}} 
                            />
                        </div>
                    </div>
                </div>

                {/* Grid Ruangan */}
                {loading ? (
                    <div style={{textAlign:'center', padding:40, color:'#64748b'}}>
                        <Loader2 className="animate-spin" style={{margin:'0 auto', marginBottom:10}} />
                        <p>Memuat daftar ruangan...</p>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div style={{textAlign:'center', padding:40, color:'#64748b'}}>
                        <p>Tidak ada ruangan yang ditemukan.</p>
                    </div>
                ) : (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24}}>
                        {filteredRooms.map((room, index) => {
                            // Logic Gambar Random agar variatif
                            const randomImage = roomImages[index % roomImages.length];
                            // Status default 'Tersedia' jika di DB null
                            const status = room.status || 'Tersedia'; 
                            const isAvailable = status === 'Tersedia';

                            return (
                                <div key={room.ruangan_id} className="card" style={{background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)', border:'1px solid #e2e8f0', transition:'transform 0.2s'}}>
                                    
                                    {/* Gambar Header */}
                                    <div style={{height: 160, width: '100%', position: 'relative'}}>
                                        <img src={randomImage} alt={room.nama_ruangan} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                        <div style={{position: 'absolute', top: 10, right: 10}}>
                                            <span style={{
                                                background: isAvailable ? '#dcfce7' : '#fee2e2',
                                                color: isAvailable ? '#166534' : '#991b1b',
                                                padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                                                textTransform: 'uppercase'
                                            }}>
                                                {status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Body Card */}
                                    <div style={{padding: 20}}>
                                        <h3 style={{margin: '0 0 5px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight:700}}>{room.nama_ruangan}</h3>
                                        
                                        {/* UPDATE: MENAMPILKAN KETERANGAN/FUNGSI RUANGAN */}
                                        <p style={{margin: '0 0 15px 0', color: '#64748b', fontSize: '0.9rem', minHeight: '20px'}}>
                                            {room.keterangan || 'Ruangan Laboratorium'}
                                        </p>
                                        
                                        <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom: 20, color:'#64748b', fontSize:'0.85rem'}}>
                                            <div style={{display:'flex', alignItems:'center', gap:8}}>
                                                <Users size={16} color="#0ea5e9"/> {room.kapasitas} Orang
                                            </div>
                                            <div style={{display:'flex', alignItems:'center', gap:8}}>
                                                <MapPin size={16} color="#0ea5e9"/> {room.lokasi || 'Gedung H'}
                                            </div>
                                        </div>

                                        <button 
                                            disabled={!isAvailable}
                                            onClick={() => handleAjukan(room)}
                                            style={{
                                                width:'100%', padding:'12px', borderRadius:8, border:'none',
                                                background: isAvailable ? '#0ea5e9' : '#e2e8f0',
                                                color: isAvailable ? 'white' : '#94a3b8',
                                                fontWeight:600, cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            {isAvailable ? 'Ajukan Peminjaman' : 'Tidak Tersedia'} <ArrowRight size={16}/>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PilihRuangan;