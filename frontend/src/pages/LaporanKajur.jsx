import React, { useState, useEffect } from 'react';
import SidebarKajur from '../components/SidebarKajur';
import { Download, Filter, Printer, Calendar } from 'lucide-react';
import api from '../api';
import * as XLSX from 'xlsx'; // Pastikan library ini sudah diinstall

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

    // Opsi Tahun
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

            return itemMonth === parseInt(selectedMonth) && 
                   itemYear === parseInt(selectedYear);
        });

        setFilteredData(result);
    };

    // --- FUNGSI EXPORT EXCEL (SUDAH DIAKTIFKAN) ---
    const handleExportExcel = () => {
        if (filteredData.length === 0) {
            alert("Tidak ada data untuk diexport pada periode ini.");
            return;
        }

        // 1. Format data agar rapi di Excel
        const dataToExport = filteredData.map((item, index) => ({
            'No': index + 1,
            'Nama Mahasiswa': item.nama_mahasiswa,
            'NIM': item.mahasiswa_nim || '-',
            'Ruangan': item.nama_ruangan,
            'Tanggal': new Date(item.tanggal_pinjam).toLocaleDateString('id-ID'),
            'Jam Mulai': item.jam_mulai ? item.jam_mulai.slice(0,5) : '-',
            'Jam Selesai': item.jam_selesai ? item.jam_selesai.slice(0,5) : '-',
            'Keperluan': item.keperluan,
            'Status': item.status
        }));

        // 2. Buat Worksheet & Workbook
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Peminjaman");

        // 3. Download File
        const fileName = `Laporan_Peminjaman_${months[selectedMonth]}_${selectedYear}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    // Helper untuk warna status
    const getStatusBadge = (status) => {
        switch(status) {
            case 'disetujui_kajur': return <span className="badge badge-success" style={{background:'#dcfce7', color:'#166534', padding:'4px 8px', borderRadius:4, fontWeight:600}}>Disetujui</span>;
            case 'ditolak_admin': 
            case 'ditolak_kajur': return <span className="badge badge-danger" style={{background:'#fee2e2', color:'#991b1b', padding:'4px 8px', borderRadius:4, fontWeight:600}}>Ditolak</span>;
            case 'disetujui_admin': return <span className="badge badge-warning" style={{background:'#fef9c3', color:'#854d0e', padding:'4px 8px', borderRadius:4, fontWeight:600}}>Verif. Admin</span>;
            case 'diajukan': return <span className="badge badge-warning" style={{background:'#fff7ed', color:'#9a3412', padding:'4px 8px', borderRadius:4, fontWeight:600}}>Menunggu</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    // Ringkasan Statistik
    const summary = {
        total: filteredData.length,
        approved: filteredData.filter(i => i.status === 'disetujui_kajur').length,
        rejected: filteredData.filter(i => i.status === 'ditolak_admin' || i.status === 'ditolak_kajur').length
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
                        <button className="btn btn-outline" onClick={() => window.print()} style={{background:'white', border:'1px solid #ddd', padding:'8px 16px', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
                            <Printer size={18}/> Cetak
                        </button>
                        
                        {/* TOMBOL EXPORT EXCEL AKTIF */}
                        <button 
                            className="btn btn-primary" 
                            onClick={handleExportExcel}
                            style={{background:'#0ea5e9', color:'white', border:'none', padding:'8px 16px', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', gap:8}}
                        >
                            <Download size={18}/> Export Excel
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="card" style={{padding: '20px', marginBottom: '20px', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap', background:'white', borderRadius:12, border:'1px solid #e2e8f0'}}>
                    <div style={{display:'flex', alignItems:'center', gap:10, fontWeight:'bold', color:'#334155'}}>
                        <Filter size={20}/> FILTER DATA:
                    </div>
                    
                    <div className="form-group" style={{marginBottom:0, width:'auto'}}>
                        <select 
                            className="form-input" 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            style={{minWidth: 150, padding:8, borderRadius:6, border:'1px solid #cbd5e1'}}
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
                            style={{minWidth: 100, padding:8, borderRadius:6, border:'1px solid #cbd5e1'}}
                        >
                            {years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ringkasan Cards */}
                <div className="stat-grid" style={{display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap:20, marginBottom: 20}}>
                    <div className="card stat-card-content" style={{background:'white', padding:20, borderRadius:12, border:'1px solid #e2e8f0'}}>
                        <div>
                            <p className="stat-label" style={{margin:0, color:'#64748b'}}>Total Pengajuan</p>
                            <h3 className="stat-value" style={{fontSize:'2rem', margin:'5px 0', color:'#0f172a'}}>{summary.total}</h3>
                            <p style={{fontSize:'0.8rem', color:'#64748b', margin:0}}>Bulan {months[selectedMonth]}</p>
                        </div>
                    </div>
                    <div className="card stat-card-content" style={{background:'white', padding:20, borderRadius:12, borderLeft:'5px solid #22c55e', border:'1px solid #e2e8f0', borderLeftWidth:5}}>
                        <div>
                            <p className="stat-label" style={{margin:0, color:'#64748b'}}>Disetujui</p>
                            <h3 className="stat-value text-success" style={{fontSize:'2rem', margin:'5px 0', color:'#22c55e'}}>{summary.approved}</h3>
                        </div>
                    </div>
                    <div className="card stat-card-content" style={{background:'white', padding:20, borderRadius:12, borderLeft:'5px solid #ef4444', border:'1px solid #e2e8f0', borderLeftWidth:5}}>
                        <div>
                            <p className="stat-label" style={{margin:0, color:'#64748b'}}>Ditolak</p>
                            <h3 className="stat-value text-danger" style={{fontSize:'2rem', margin:'5px 0', color:'#ef4444'}}>{summary.rejected}</h3>
                        </div>
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="card" style={{padding:0, overflow:'hidden', background:'white', borderRadius:12, border:'1px solid #e2e8f0'}}>
                    <div style={{padding:'15px 20px', borderBottom:'1px solid #e2e8f0', background:'#f8fafc'}}>
                        <h3 style={{fontSize:'1rem', margin:0, color:'#334155'}}>Detail Transaksi - {months[selectedMonth]} {selectedYear}</h3>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table-custom" style={{width:'100%', borderCollapse:'collapse'}}>
                            <thead style={{background:'#f8fafc'}}>
                                <tr>
                                    <th style={{padding:15, textAlign:'left', color:'#64748b'}}>No</th>
                                    <th style={{padding:15, textAlign:'left', color:'#64748b'}}>Mahasiswa</th>
                                    <th style={{padding:15, textAlign:'left', color:'#64748b'}}>Ruangan</th>
                                    <th style={{padding:15, textAlign:'left', color:'#64748b'}}>Tanggal & Jam</th>
                                    <th style={{padding:15, textAlign:'left', color:'#64748b'}}>Keperluan</th>
                                    <th style={{padding:15, textAlign:'center', color:'#64748b'}}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center" style={{padding:30}}>Sedang memuat data...</td></tr>
                                ) : filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={item.id} style={{borderBottom:'1px solid #f1f5f9'}}>
                                            <td style={{padding:15}}>{index + 1}</td>
                                            <td style={{padding:15}}>
                                                <div style={{fontWeight:600}}>{item.nama_mahasiswa}</div>
                                                <div style={{fontSize:'0.85rem', color:'#64748b'}}>{item.mahasiswa_nim || '-'}</div>
                                            </td>
                                            <td style={{padding:15}}>{item.nama_ruangan}</td>
                                            <td style={{padding:15}}>
                                                <div>{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</div>
                                                <div style={{fontSize:'0.85rem', color:'#64748b'}}>
                                                    {item.jam_mulai ? item.jam_mulai.slice(0,5) : ''} - {item.jam_selesai ? item.jam_selesai.slice(0,5) : ''}
                                                </div>
                                            </td>
                                            <td style={{padding:15}}>{item.keperluan}</td>
                                            <td style={{padding:15, textAlign:'center'}}>
                                                {getStatusBadge(item.status)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center" style={{padding:40, color:'#94a3b8', textAlign:'center'}}>
                                            <Calendar size={40} style={{marginBottom:10, opacity:0.5, margin:'0 auto', display:'block'}}/>
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