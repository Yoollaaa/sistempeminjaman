import React, { useState, useEffect } from 'react';
import { Monitor, Clock, CheckCircle, User } from 'lucide-react';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKajur from '../components/SidebarKajur';
import api from '../api'; // Import your API instance

const LiveMonitoring = ({ role }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // 1. Array Placeholder Images (DIPERBARUI: 10 Gambar berbeda)
    const roomImages = [
        // Gambar 1: Kelas Standar
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
        // Gambar 2: Ruang Seminar Gelap
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
        // Gambar 3: Lab Komputer Modern
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
        // Gambar 4: Lab Komputer dengan Server
        // Gambar 5: Ruang Meeting/Sidang Cerah
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
        // Gambar 6: Ruang Diskusi/Co-working
        "https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&w=600&q=80",
        // Gambar 7: Ruang Konferensi Besar
        "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=600&q=80",
        // Gambar 8: Area Belajar Kelompok
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
        // Gambar 9: Ruang Kuliah Besar (Lecture Hall)
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
        // Gambar 10: Ruang Kelas Minimalis
        "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=600&q=80"
    ];

    // 2. Real-time Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 3. Fetch Data & Logic Real-time
    useEffect(() => {
        fetchLiveStatus();
        const intervalId = setInterval(fetchLiveStatus, 60000); // Auto-refresh every 1 minute
        return () => clearInterval(intervalId);
    }, []);

    const fetchLiveStatus = async () => {
        try {
            // Fetch all necessary data in parallel
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
        
        // Date format: YYYY-MM-DD
        const todayStr = now.toISOString().split('T')[0];
        
        // Time format: HH:mm:ss for comparison
        const timeStr = now.toTimeString().split(' ')[0];

        const processed = rawRooms.map((room, index) => {
            let status = 'tersedia';
            let detail = null;

            // A. Check Routine Schedule (Jadwal Kuliah)
            const activeSchedule = schedules.find(s => 
                s.ruangan_id === room.ruangan_id && 
                s.hari === currentDayName &&
                timeStr >= s.jam_mulai && 
                timeStr <= s.jam_selesai
            );

            if (activeSchedule) {
                status = 'terpakai';
                detail = {
                    tipe: "KULIAH",
                    judul: activeSchedule.mata_kuliah,
                    pengguna: activeSchedule.nama_dosen || activeSchedule.dosen, // Adjust based on DB column
                    selesai: activeSchedule.jam_selesai.substring(0, 5)
                };
            }

            // B. Check Ad-hoc Booking (Peminjaman) - Only if not occupied by schedule
            if (!activeSchedule) {
                const activeBooking = bookings.find(b => 
                    b.ruangan_id === room.ruangan_id &&
                    b.tanggal_pinjam === todayStr &&
                    (b.status === 'disetujui_kajur' || b.status === 'disetujui_admin') && // Only approved bookings
                    timeStr >= b.jam_mulai && 
                    timeStr <= b.jam_selesai
                );

                if (activeBooking) {
                    status = 'terpakai';
                    detail = {
                        tipe: "BOOKING",
                        judul: activeBooking.keperluan,
                        pengguna: activeBooking.nama_mahasiswa, 
                        selesai: activeBooking.jam_selesai.substring(0, 5)
                    };
                }
            }

            return {
                id: room.ruangan_id,
                nama_ruangan: room.nama_ruangan,
                kapasitas: room.kapasitas,
                // Menggunakan modulo agar gambar berulang jika ruangan lebih dari 10
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
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f8fafc' }}>
            
            {renderSidebar()}

            <main style={{ flex: 1, padding: '30px', overflowY: 'auto', height: '100vh' }}>
                
                {/* --- HEADER --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.8rem', margin: '0 0 5px 0', color: '#1e293b' }}>
                            <Monitor color="#3b82f6" size={32} />
                            Monitoring Ruangan
                        </h1>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                            Pantauan penggunaan ruangan jurusan secara realtime
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={styles.legendBadge}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></div>
                                <span style={{ fontWeight: 600, color: '#334155' }}>Tersedia</span>
                            </div>
                            <div style={styles.legendBadge}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></div>
                                <span style={{ fontWeight: 600, color: '#334155' }}>Sedang Dipakai</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- GRID RUANGAN --- */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                        <p>Memuat data monitoring...</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px',
                        paddingBottom: '40px'
                    }}>
                        {rooms.map((room) => {
                            const isBusy = room.status === 'terpakai';
                            
                            const borderColor = isBusy ? '#fecaca' : '#a7f3d0';
                            const headerColor = isBusy ? '#fee2e2' : '#d1fae5';
                            const titleColor = isBusy ? '#991b1b' : '#065f46';
                            const statusBorder = isBusy ? '#ef4444' : '#10b981';

                            return (
                                <div key={room.id} style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    border: `1px solid ${borderColor}`,
                                    borderBottom: `5px solid ${statusBorder}`,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{ padding: '12px 20px', background: headerColor, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: titleColor }}>
                                            {room.nama_ruangan}
                                        </h3>
                                        {isBusy ? (
                                            <span style={styles.statusBusy}>SIBUK</span>
                                        ) : (
                                            <span style={styles.statusFree}>AMAN</span>
                                        )}
                                    </div>

                                    <div style={{ width: '100%', height: '160px', overflow: 'hidden', position: 'relative' }}>
                                        <img 
                                            src={room.gambar} 
                                            alt={room.nama_ruangan} 
                                            style={{ 
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                filter: isBusy ? 'grayscale(20%)' : 'none'
                                            }} 
                                        />
                                        {isBusy && <div style={{ position: 'absolute', top:0, left:0, width:'100%', height:'100%', background: 'rgba(239, 68, 68, 0.1)' }}></div>}
                                    </div>

                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        {isBusy ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                                                <div>
                                                    <span style={styles.activityLabel}>{room.detail.tipe}</span>
                                                    <h4 style={{ margin: '6px 0 0 0', fontSize: '1rem', color: '#1e293b', lineHeight: '1.4' }}>
                                                        {room.detail.judul}
                                                    </h4>
                                                </div>
                                                
                                                <div style={{ marginTop: 'auto', background: '#fff1f2', padding: '10px', borderRadius: '8px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                        <User size={14} color="#ef4444" />
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                                                            {room.detail.pengguna}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Clock size={14} color="#ef4444" />
                                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                            Selesai: <b>{room.detail.selesai}</b> WIB
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ 
                                                height: '100%', display: 'flex', flexDirection: 'column', 
                                                justifyContent: 'center', alignItems: 'center', textAlign: 'center' 
                                            }}>
                                                <CheckCircle size={40} color="#10b981" style={{ marginBottom: '10px', opacity: 0.8 }} />
                                                <h4 style={{ margin: 0, color: '#059669', fontSize: '1rem' }}>Siap Digunakan</h4>
                                                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                                                    Kapasitas: {room.kapasitas} Orang
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    legendBadge: {
        display: 'flex', alignItems: 'center', gap: '8px', 
        background: 'white', padding: '6px 12px', 
        borderRadius: '50px', border: '1px solid #e2e8f0',
        fontSize: '0.8rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    statusBusy: {
        background: '#ef4444', color: 'white', 
        fontSize: '0.65rem', padding: '3px 8px', 
        borderRadius: '20px', fontWeight: 'bold', letterSpacing: '0.5px'
    },
    statusFree: {
        background: '#10b981', color: 'white', 
        fontSize: '0.65rem', padding: '3px 8px', 
        borderRadius: '20px', fontWeight: 'bold', letterSpacing: '0.5px'
    },
    activityLabel: {
        fontSize: '0.65rem', color: '#64748b', 
        fontWeight: '700', letterSpacing: '0.5px',
        background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px'
    }
};

export default LiveMonitoring;