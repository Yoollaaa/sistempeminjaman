import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Calendar, Zap } from 'lucide-react';

// IMPORT KEDUA SIDEBAR
import SidebarAdmin from '../components/SidebarAdmin'; // Sesuaikan path folder components
import SidebarKajur from '../components/SidebarKajur'; // Sesuaikan path folder components

const LiveMonitoring = ({ role }) => { 
    // ^^^ TERIMA PROPS 'role' DARI APP.JSX

    // State
    const [scheduleToday, setScheduleToday] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // --- LOGIKA PEMILIHAN SIDEBAR ---
    const renderSidebar = () => {
        if (role === 'admin') return <SidebarAdmin />;
        if (role === 'kajur') return <SidebarKajur />;
        return null; // Atau return SidebarDefault jika ada
    };

    // 1. Efek: Jam Digital
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Fungsi: Ambil Data API
    const fetchData = async () => {
        try {
            // Pastikan URL API sesuai dengan backend Laravel Anda
            // Gunakan api.get jika sudah setup axios instance, atau axios.get biasa
            const response = await axios.get('http://localhost:8000/api/monitor/today'); 
            setScheduleToday(response.data);
            setLastUpdate(new Date());
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data jadwal:", error);
            setLoading(false);
        }
    };

    // 3. Polling Data
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    // Helper Functions
    const isLiveNow = (startStr, endStr) => {
        const now = new Date();
        const currentMinutes = (now.getHours() * 60) + now.getMinutes();
        
        const [sH, sM] = startStr.split(':').map(Number);
        const [eH, eM] = endStr.split(':').map(Number);
        
        return currentMinutes >= (sH * 60 + sM) && currentMinutes < (eH * 60 + eM);
    };

    const formatTime = (timeStr) => timeStr?.substring(0, 5);

    return (
        <div className="page-container">
            {/* Render Sidebar Sesuai Role */}
            {renderSidebar()}

            <main className="content-area">
                <div className="header-monitor">
                    <div className="header-title">
                        <h1>
                            <span className="live-indicator"></span>
                            Live Monitoring Ruangan
                        </h1>
                        <p style={{color: '#64748b', margin: '4px 0 0 24px'}}>
                            Pantauan penggunaan ruangan jurusan secara realtime
                        </p>
                    </div>
                    <div className="clock-display">
                        <div className="clock-time">
                            {currentTime.toLocaleTimeString('id-ID', { hour12: false })} WIB
                        </div>
                        <div className="last-update">
                            Data update: {lastUpdate.toLocaleTimeString('id-ID')}
                        </div>
                    </div>
                </div>

                <div className="schedule-grid">
                    {loading ? (
                        <p>Sedang memuat data...</p>
                    ) : scheduleToday.length === 0 ? (
                        <div className="room-card" style={{gridColumn: '1 / -1', textAlign:'center', padding: '60px'}}>
                            <Calendar size={64} color="#cbd5e1" />
                            <h3 style={{color: '#94a3b8', marginTop: 20}}>Tidak ada jadwal ruangan hari ini</h3>
                        </div>
                    ) : (
                        scheduleToday.map((item, index) => {
                            const ongoing = isLiveNow(item.jam_mulai, item.jam_selesai);
                            const themeColor = ongoing ? '#ef4444' : '#3b82f6';
                            const iconBoxColor = ongoing ? '#fee2e2' : '#dbeafe';

                            return (
                                <div key={index} className="room-card">
                                    <div className="card-border-top" style={{background: themeColor}}></div>
                                    <div className="card-header">
                                        <div className="icon-box" style={{background: iconBoxColor, color: themeColor}}>
                                            {ongoing ? <Zap size={24} /> : <MapPin size={24} />}
                                        </div>
                                        {ongoing && (
                                            <div className="status-badge" style={{background: '#fee2e2', color: '#b91c1c'}}>
                                                <span className="blink-text">●</span> LIVE
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="room-name">{item.nama_ruangan}</h3>
                                        <div className="time-range">
                                            <Clock size={16} />
                                            {formatTime(item.jam_mulai)} - {formatTime(item.jam_selesai)} WIB
                                        </div>
                                    </div>
                                    <div className="divider"></div>
                                    <div>
                                        <div className="activity-title" title={item.keperluan}>{item.keperluan}</div>
                                        <div className="user-info">
                                            <div className="avatar-circle">
                                                {item.nama_mahasiswa?.charAt(0).toUpperCase() || 'M'}
                                            </div>
                                            <div style={{fontSize: '0.85rem'}}>
                                                <div style={{fontWeight: 600, color: '#475569'}}>{item.nama_mahasiswa}</div>
                                                <div style={{color: '#94a3b8', fontSize: '0.75rem'}}>NIM: {item.mahasiswa_nim}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};

export default LiveMonitoring;