import React, { useState, useEffect } from 'react';
import SidebarKajur from '../components/SidebarKajur';
import { Download, Filter, Printer, Calendar, Search } from 'lucide-react';
import api from '../api';

const LaporanKajur = () => {
    // State untuk filter
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default bulan ini (0-11)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default tahun ini
    
    // State data
    const [allData, setAllData] = useState([]); // Data mentah dari API
    const [filteredData, setFilteredData] = useState([]); // Data setelah difilter
    const [loading, setLoading] = useState(true);

    // Opsi Bulan
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Opsi Tahun (3 tahun ke belakang + 1 tahun ke depan)
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    useEffect(() => {
        fetchData();
    }, []);

    // Efek untuk memfilter data setiap kali bulan/tahun/data berubah
    useEffect(() => {
        filterDataByDate();
    }, [selectedMonth, selectedYear, allData]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Kita ambil semua data peminjaman
            const response = await api.get('/peminjaman'); 
            const data = response.data.data || [];
            
            // Urutkan dari yang terbaru
            const sorted = data.sort((a, b) => new Date(b.tanggal_pinjam) - new Date(a.tanggal_pinjam));
            setAllData(sorted);
        } catch (error) {
            console.error("Gagal mengambil data laporan:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterDataByDate = () => {
        if (!allData.length) return;

        const result = allData.filter(item => {
            if (!item.tanggal_pinjam) return false;
            
            const itemDate = new Date(item.tanggal_pinjam);
            const itemMonth = itemDate.getMonth(); // 0-11
            const itemYear = itemDate.getFullYear();

            // Filter status (opsional: jika ingin menampilkan semua status, hapus baris ini)
            // Biasanya laporan hanya menampilkan yang sudah selesai/diproses
            const isFinishedStatus = ['disetujui_kajur', 'ditolak', 'selesai'].includes(item.status);

            return itemMonth === parseInt(selectedMonth) && 
                   itemYear === parseInt(selectedYear);
        });

        setFilteredData(result);
    };

    // Helper untuk warna status
    const getStatusBadge = (status) => {
        switch(status) {
            case 'disetujui_kajur': return <span className="badge badge-success">Disetujui</span>;
            case 'ditolak': return <span className="badge badge-danger">Ditolak</span>;
            case 'pending': 
            case 'disetujui_admin': return <span className="badge badge-warning">Proses</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    // Hitung Ringkasan
    const summary = {
        total: filteredData.length,
        approved: filteredData.filter(i => i.status === 'disetujui_kajur').length,
        rejected: filteredData.filter(i => i.status === 'ditolak').length
    };

    return (
        <div className="app-layout">
            <SidebarKajur />
            <div className="content-container">
                
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Laporan Bulanan</h1>
                        <p className="page-subtitle">Rekapitulasi peminjaman ruangan Program Studi.</p>
                    </div>
                    <div style={{display:'flex', gap:10}}>
                        <button className="btn btn-outline" onClick={() => window.print()}>
                            <Printer size={18}/> Cetak
                        </button>
                        <button className="btn btn-primary">
                            <Download size={18}/> Export Excel
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="card" style={{padding: '20px', marginBottom: '20px', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap'}}>
                    <div style={{display:'flex', alignItems:'center', gap:10, fontWeight:'bold', color:'var(--primary)'}}>
                        <Filter size={20}/> FILTER DATA:
                    </div>
                    
                    <div className="form-group" style={{marginBottom:0, width:'auto'}}>
                        <select 
                            className="form-input" 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{minWidth: 150}}
                        >
                            {months.map((m, index) => (
                                <option key={index} value={index}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{marginBottom:0, width:'auto'}}>
                        <select 
                            className="form-input" 
                            value={selectedYear} 
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={{minWidth: 100}}
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ringkasan Cards */}
                <div className="stat-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20}}>
                    <div className="card stat-card-content">
                        <div>
                            <p className="stat-label">Total Pengajuan</p>
                            <h3 className="stat-value">{summary.total}</h3>
                            <p style={{fontSize:'0.8rem', color:'#64748b'}}>Bulan {months[selectedMonth]}</p>
                        </div>
                    </div>
                    <div className="card stat-card-content" style={{borderLeft:'4px solid var(--success-text)'}}>
                        <div>
                            <p className="stat-label">Disetujui</p>
                            <h3 className="stat-value text-success">{summary.approved}</h3>
                        </div>
                    </div>
                    <div className="card stat-card-content" style={{borderLeft:'4px solid var(--danger-text)'}}>
                        <div>
                            <p className="stat-label">Ditolak</p>
                            <h3 className="stat-value text-danger">{summary.rejected}</h3>
                        </div>
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="card" style={{padding:0, overflow:'hidden'}}>
                    <div style={{padding:'15px 20px', borderBottom:'1px solid #e2e8f0', background:'#f8fafc'}}>
                        <h3 style={{fontSize:'1rem', margin:0}}>Detail Transaksi - {months[selectedMonth]} {selectedYear}</h3>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Mahasiswa</th>
                                    <th>Ruangan</th>
                                    <th>Tanggal & Jam</th>
                                    <th>Keperluan</th>
                                    <th className="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center" style={{padding:30}}>Sedang memuat data...</td></tr>
                                ) : filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div style={{fontWeight:600}}>{item.nama_mahasiswa}</div>
                                                <div style={{fontSize:'0.85rem', color:'#64748b'}}>{item.mahasiswa_nim}</div>
                                            </td>
                                            <td>{item.nama_ruangan}</td>
                                            <td>
                                                <div>{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</div>
                                                <div style={{fontSize:'0.85rem', color:'#64748b'}}>
                                                    {item.jam_mulai.slice(0,5)} - {item.jam_selesai.slice(0,5)}
                                                </div>
                                            </td>
                                            <td>{item.keperluan}</td>
                                            <td className="text-center">
                                                {getStatusBadge(item.status)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center" style={{padding:40, color:'#94a3b8'}}>
                                            <Calendar size={40} style={{marginBottom:10, opacity:0.5}}/>
                                            <p>Tidak ada data peminjaman pada bulan {months[selectedMonth]} {selectedYear}.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LaporanKajur;