import React, { useState, useEffect } from 'react';
import { Monitor, Clock, CheckCircle, User } from 'lucide-react';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKajur from '../components/SidebarKajur';

const LiveMonitoring = ({ role }) => {
    // 1. DATA DUMMY
    const dummyData = [
        {
            id: 1,
            nama_ruangan: "Gedung D.2.1",
            gambar: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
            kapasitas: 40,
            status: "terpakai",
            detail: {
                tipe: "KULIAH",
                judul: "Pemrograman Web Lanjut",
                pengguna: "Bpk. Dosen Pengampu",
                selesai: "15:30"
            }
        },
        {
            id: 2,
            nama_ruangan: "Gedung D.2.2",
            gambar: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
            kapasitas: 40,
            status: "tersedia",
            detail: null
        },
        {
            id: 3,
            nama_ruangan: "Lab RPL",
            gambar: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
            kapasitas: 30,
            status: "terpakai",
            detail: {
                tipe: "BOOKING",
                judul: "Rapat Persiapan Tech Day",
                pengguna: "Alya Nayra (HIMAKOM)",
                selesai: "16:00"
            }
        },
        {
            id: 4,
            nama_ruangan: "Lab Jaringan",
            gambar: "https://images.unsplash.com/photo-1558494949-ef526b004297?auto=format&fit=crop&w=600&q=80",
            kapasitas: 30,
            status: "tersedia",
            detail: null
        },
        {
            id: 5,
            nama_ruangan: "Aula Gedung H",
            gambar: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
            kapasitas: 100,
            status: "terpakai",
            detail: {
                tipe: "SEMINAR",
                judul: "Seminar Proposal Skripsi",
                pengguna: "Panitia Sempro",
                selesai: "14:45"
            }
        },
        {
            id: 6,
            nama_ruangan: "Gedung D.3.1",
            gambar: "https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&w=600&q=80",
            kapasitas: 40,
            status: "tersedia",
            detail: null
        }
    ];

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const renderSidebar = () => {
        if (role === 'admin') return <SidebarAdmin />;
        if (role === 'kajur') return <SidebarKajur />;
        return null; 
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRooms(dummyData);
            setLoading(false);
        }, 800);
    }, []);

    return (
        // WRAPPER UTAMA: height 100vh & overflow hidden agar body tidak scroll
        <div style={{ 
            display: 'flex', 
            height: '100vh', 
            overflow: 'hidden', 
            background: '#f8fafc' 
        }}>
            
            {/* Sidebar akan diam karena dia berada di luar container scroll (main) */}
            {renderSidebar()}

            {/* MAIN CONTENT: overflow-y: auto agar hanya bagian ini yang scroll */}
            <main style={{ 
                flex: 1, 
                padding: '30px', 
                overflowY: 'auto', // Ini kuncinya agar scroll
                height: '100vh'    // Pastikan tingginya full
            }}>
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
                    
                    {/* Legend Status */}
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

                {/* --- GRID RUANGAN --- */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                        <p>Memuat data ruangan...</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '24px',
                        paddingBottom: '40px' // Tambahan padding bawah agar scroll tidak mentok pas di kartu terakhir
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
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover',
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