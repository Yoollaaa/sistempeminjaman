import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import api from '../api';

const DashboardAdmin = () => {
    const [stats, setStats] = useState({ totalRuangan: 0, pending: 0, active: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mengambil data ruangan dan peminjaman untuk dihitung statistiknya
                const reqRuangan = await api.get('/ruangan');
                const reqPeminjaman = await api.get('/peminjaman');
                
                const allPeminjaman = reqPeminjaman.data.data || [];
                const pending = allPeminjaman.filter(p => p.status === 'diajukan').length;
                
                // Menghitung peminjaman yang aktif/disetujui hari ini
                const today = new Date().toISOString().split('T')[0];
                const activeToday = allPeminjaman.filter(p => 
                    (p.status === 'disetujui_kajur' || p.status === 'disetujui_admin') && 
                    p.tanggal_pinjam === today
                ).length;

                setStats({
                    totalRuangan: reqRuangan.data.data.length,
                    pending: pending,
                    active: activeToday
                });
            } catch (e) {
                console.error("Gagal memuat statistik", e);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="app-layout">
            <SidebarAdmin />
            <div className="content-container">
                <h1 className="page-title">Dashboard Admin</h1>
                <p className="page-subtitle">Selamat datang di panel kontrol E-Class.</p>

                <div className="stat-grid" style={{marginTop: 30}}>
                    {/* Kartu 1: Total Ruangan */}
                    <div className="card stat-card-content">
                        <div className="stat-icon" style={{background:'#e0f2fe', color:'#0ea5e9'}}>
                            <BookOpen size={24}/>
                        </div>
                        <div>
                            <h3 className="stat-value">{stats.totalRuangan}</h3>
                            <p className="stat-label">Total Ruangan</p>
                        </div>
                    </div>

                    {/* Kartu 2: Menunggu Verifikasi */}
                    <div className="card stat-card-content">
                        <div className="stat-icon" style={{background:'#fef3c7', color:'#d97706'}}>
                            <Clock size={24}/>
                        </div>
                        <div>
                            <h3 className="stat-value">{stats.pending}</h3>
                            <p className="stat-label">Menunggu Verifikasi</p>
                        </div>
                    </div>

                    {/* Kartu 3: Aktif Hari Ini */}
                    <div className="card stat-card-content">
                        <div className="stat-icon" style={{background:'#dcfce7', color:'#166534'}}>
                            <CheckCircle size={24}/>
                        </div>
                        <div>
                            <h3 className="stat-value">{stats.active}</h3>
                            <p className="stat-label">Terpakai Hari Ini</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;