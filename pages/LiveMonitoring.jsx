import React, { useState, useEffect } from 'react';
import { Monitor, Clock, Users, MapPin, User, Loader2 } from 'lucide-react';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKajur from '../components/SidebarKajur';
import api from '../api';

const LiveMonitoring = ({ role }) => {
    // --- STATE & LOGIC ---
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [currentTime, setCurrentTime] = useState(new Date());

    // Placeholder Images
    const roomImages = [
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80',
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80',
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
    ];

    // Real-time Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Data (Auto Refresh 1 Menit)
    useEffect(() => {
        fetchLiveStatus();
        const intervalId = setInterval(fetchLiveStatus, 60000); 
        return () => clearInterval(intervalId);
    }, []);

    const fetchLiveStatus = async () => {
        try {
            const [resRuangan, resJadwal, resPeminjaman] = await Promise.all([
                api.get('/ruangan'),
                api.get('/jadwal'),
                api.get('/peminjaman')
            ]);

            const rawRooms = resRuangan.data.data || [];
            const schedules = resJadwal.data.data || [];
            const bookings = resPeminjaman.data.data || [];

            processRoomStatus(rawRooms, schedules, bookings);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching live data:", error);
            setLoading(false);
        }
    };

    const processRoomStatus = (rawRooms, schedules, bookings) => {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const currentDayName = days[now.getDay()]; 
        const todayStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0];

        const processed = rawRooms.map((room, index) => {
            let status = 'Tersedia';
            let detail = null;

            // Cek Jadwal Kuliah
            const activeSchedule = schedules.find(s => 
                s.ruangan_id === room.ruangan_id && 
                s.hari === currentDayName &&
                timeStr >= s.jam_mulai && 
                timeStr <= s.jam_selesai
            );

            if (activeSchedule) {
                status = 'Terpakai';
                detail = {
                    tipe: "KULIAH",
                    judul: activeSchedule.mata_kuliah,
                    pengguna: activeSchedule.nama_dosen,
                    selesai: activeSchedule.jam_selesai.substring(0, 5)
                };
            }

            // Cek Booking
            if (!activeSchedule) {
                const activeBooking = bookings.find(b => 
                    b.ruangan_id === room.ruangan_id &&
                    b.tanggal_pinjam === todayStr &&
                    (b.status === 'disetujui_kajur' || b.status === 'disetujui_admin') && 
                    timeStr >= b.jam_mulai && 
                    timeStr <= b.jam_selesai
                );

                if (activeBooking) {
                    status = 'Terpakai';
                    detail = {
                        tipe: "BOOKING",
                        judul: activeBooking.keperluan,
                        pengguna: activeBooking.nama_mahasiswa, 
                        selesai: activeBooking.jam_selesai.substring(0, 5)
                    };
                }
            }

            return {
                ...room,
                gambar: roomImages[index % roomImages.length], 
                status: status,
                detail: detail
            };
        });

        setRooms(processed);
    };

    const renderSidebar = () => {
        if (role === 'admin') return <SidebarAdmin />;
        if (role === 'kajur') return <SidebarKajur />;
        return null; 
    };

    return (
        <div className="app-layout" style={{display: 'flex', minHeight: '100vh', background: '#f8fafc'}}>
            {renderSidebar()}
            
            <div className="content-container" style={{flex: 1, padding: '30px', overflowY: 'auto', height: '100vh'}}>
                
                {/* Header */}
                <div style={{marginBottom: 30}}>
                    <h1 style={{fontSize: '1.8rem', fontWeight: 700, margin: '0 0 5px 0', color: '#0f172a', display:'flex', alignItems:'center', gap:10}}>
                        <Monitor color="#0f172a" size={28}/> Live Monitoring
                    </h1>
                    <p style={{color: '#64748b', margin: 0}}>Pantauan penggunaan ruangan secara real-time.</p>
                </div>

                {/* Grid Ruangan */}
                {loading ? (
                    <div style={{textAlign:'center', padding:40, color:'#64748b'}}>
                        <Loader2 className="animate-spin" style={{margin:'0 auto', marginBottom:10}} />
                        <p>Memuat data monitoring...</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                        gap: 24,
                        alignItems: 'stretch' // KUNCI 1: Pastikan semua kolom di baris yang sama punya tinggi sama
                    }}>
                        {rooms.map((room) => {
                            const isAvailable = room.status === 'Tersedia';
                            const statusLabel = isAvailable ? 'Tersedia' : 'Terpakai';
                            
                            const descriptionText = !isAvailable 
                                ? `${room.detail.tipe}: ${room.detail.judul}` 
                                : (room.keterangan || 'Ruangan Laboratorium');

                            const secondRowIcon = !isAvailable ? <User size={16} color="#ef4444"/> : <MapPin size={16} color="#0ea5e9"/>;
                            const secondRowText = !isAvailable ? room.detail.pengguna : (room.lokasi || 'Gedung H');
                            const secondRowColor = !isAvailable ? '#ef4444' : '#64748b';

                            return (
                                <div key={room.ruangan_id} className="card" style={{
                                    background:'white', 
                                    borderRadius: 16, 
                                    overflow:'hidden', 
                                    boxShadow:'0 4px 6px -1px rgba(0,0,0,0.05)', 
                                    border:'1px solid #e2e8f0', 
                                    display: 'flex', 
                                    flexDirection: 'column', // KUNCI 2: Layout vertikal
                                    height: '100%' // KUNCI 3: Tinggi penuh mengikuti grid
                                }}>
                                    
                                    {/* Gambar Header */}
                                    <div style={{height: 160, width: '100%', position: 'relative', flexShrink: 0}}>
                                        <img 
                                            src={room.gambar} 
                                            alt={room.nama_ruangan} 
                                            style={{
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                filter: isAvailable ? 'none' : 'grayscale(100%) opacity(0.8)'
                                            }} 
                                        />
                                        <div style={{position: 'absolute', top: 10, right: 10}}>
                                            <span style={{
                                                background: isAvailable ? '#dcfce7' : '#fee2e2',
                                                color: isAvailable ? '#166534' : '#991b1b',
                                                padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                                                textTransform: 'uppercase', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}>
                                                {statusLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Body Card */}
                                    <div style={{
                                        padding: 20, 
                                        flex: 1, // KUNCI 4: Bagian ini akan mengisi sisa ruang agar footer terdorong
                                        display: 'flex', 
                                        flexDirection: 'column' 
                                    }}>
                                        
                                        {/* Judul Ruangan */}
                                        <h3 style={{
                                            margin: '0 0 5px 0', 
                                            fontSize: '1.25rem', 
                                            color: '#0f172a', 
                                            fontWeight: 700,
                                            lineHeight: 1.2,
                                            // KUNCI 5: Min-height agar judul pendek dan panjang punya ruang sama
                                            minHeight: '3rem', 
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {room.nama_ruangan}
                                        </h3>
                                        
                                        {/* Deskripsi */}
                                        <p style={{
                                            margin: '0 0 16px 0', 
                                            color: '#64748b', 
                                            fontSize: '0.9rem', 
                                            lineHeight: '1.4',
                                            // KUNCI 6: Min-height untuk deskripsi juga
                                            minHeight: '2.8rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {descriptionText}
                                        </p>
                                        
                                        {/* Info Icons */}
                                        <div style={{display:'flex', flexDirection:'column', gap:10, marginBottom: 16, color:'#64748b', fontSize:'0.85rem'}}>
                                            <div style={{display:'flex', alignItems:'center', gap:10}}>
                                                <Users size={18} color="#0ea5e9" style={{minWidth: 18}}/> 
                                                <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{room.kapasitas} Orang</span>
                                            </div>
                                            <div style={{display:'flex', alignItems:'center', gap:10, color: secondRowColor}}>
                                                <span style={{minWidth: 18, display:'flex'}}>{secondRowIcon}</span>
                                                <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{secondRowText}</span>
                                            </div>
                                        </div>

                                        {/* FOOTER: HANYA MUNCUL JIKA TERPAKAI 
                                           KUNCI 7: marginTop: 'auto' memaksa elemen ini selalu di dasar card
                                        */}
                                        {!isAvailable && (
                                            <div style={{
                                                marginTop: 'auto', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 8, 
                                                color: '#ef4444', 
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                paddingTop: 8
                                            }}>
                                                <Clock size={16} color="#ef4444"/>
                                                <span>
                                                    Dipakai sampai: {room.detail.selesai} WIB
                                                </span>
                                            </div>
                                        )}

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

export default LiveMonitoring;