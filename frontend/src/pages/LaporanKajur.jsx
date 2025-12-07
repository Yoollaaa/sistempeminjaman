import React, { useState, useEffect } from 'react';
import SidebarKajur from '../components/SidebarKajur';
import { Download, Filter, Printer, Calendar } from 'lucide-react';
import api from '../api';
import * as XLSX from 'xlsx';

const LaporanKajur = () => {
    // --- STATE ---
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterDataByDate();
    }, [selectedMonth, selectedYear, allData]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/peminjaman'); 
            const data = response.data.data || [];
            const sorted = data.sort((a, b) => new Date(b.tanggal_pinjam) - new Date(a.tanggal_pinjam));
            setAllData(sorted);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterDataByDate = () => {
        if (!allData.length) return;
        const result = allData.filter(item => {
            if (!item.tanggal_pinjam) return false;
            const d = new Date(item.tanggal_pinjam);
            return d.getMonth() === parseInt(selectedMonth) && d.getFullYear() === parseInt(selectedYear);
        });
        setFilteredData(result);
    };

    // --- ACTIONS ---
    const handlePrint = () => {
        window.print(); // Browser akan otomatis membaca @media print di bawah
    };

    const handleExportExcel = () => {
        if (filteredData.length === 0) {
            alert("Tidak ada data"); return;
        }
        const dataToExport = filteredData.map((item, index) => ({
            'No': index + 1,
            'Nama Mahasiswa': item.nama_mahasiswa,
            'NIM': item.mahasiswa_nim || '-',
            'Ruangan': item.nama_ruangan,
            'Tanggal': new Date(item.tanggal_pinjam).toLocaleDateString('id-ID'),
            'Jam': `${item.jam_mulai?.slice(0,5)} - ${item.jam_selesai?.slice(0,5)}`,
            'Keperluan': item.keperluan,
            'Status': item.status
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
        XLSX.writeFile(workbook, `Laporan_${months[selectedMonth]}_${selectedYear}.xlsx`);
    };

    // Helper Badge (Untuk Tampilan Web)
    const getStatusBadge = (status) => {
        switch(status) {
            case 'disetujui_kajur': return <span className="badge" style={{background:'#dcfce7', color:'#166534', padding:'4px 8px', borderRadius:4, fontWeight:600}}>Disetujui</span>;
            case 'ditolak_admin': 
            case 'ditolak_kajur': return <span className="badge" style={{background:'#fee2e2', color:'#991b1b', padding:'4px 8px', borderRadius:4, fontWeight:600}}>Ditolak</span>;
            case 'disetujui_admin': return <span className="badge" style={{background:'#fef9c3', color:'#854d0e', padding:'4px 8px', borderRadius:4, fontWeight:600}}>Verif. Admin</span>;
            default: return <span className="badge" style={{background:'#f1f5f9', color:'#475569', padding:'4px 8px', borderRadius:4}}>{status}</span>;
        }
    };

    // Helper Statistik
    const summary = {
        total: filteredData.length,
        approved: filteredData.filter(i => i.status === 'disetujui_kajur').length,
        rejected: filteredData.filter(i => i.status === 'ditolak_admin' || i.status === 'ditolak_kajur').length
    };

    return (
        <div>
            {/* ==================================================================================
                STYLE CSS KHUSUS (MENGATUR TAMPILAN WEB vs TAMPILAN CETAK)
            ================================================================================== */}
            <style>{`
                /* Default: Sembunyikan Area Cetak di Layar Komputer */
                #printable-document {
                    display: none;
                }

                /* LOGIKA SAAT DICETAK (CTRL+P / Klik Tombol Cetak) */
                @media print {
                    /* 1. Sembunyikan Tampilan Web (Sidebar, Filter, Table Cantik) */
                    .web-ui-only {
                        display: none !important;
                    }
                    
                    /* 2. Sembunyikan elemen bawaan layout jika ada class global */
                    .app-layout, .sidebar, nav, header, button {
                        display: none !important;
                    }

                    /* 3. Munculkan Dokumen Surat */
                    #printable-document {
                        display: block !important;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        background: white;
                        color: black;
                        font-family: 'Times New Roman', Times, serif;
                        padding: 20px;
                        z-index: 9999;
                    }

                    /* 4. Reset Margin Halaman */
                    @page {
                        margin: 2cm;
                        size: A4;
                    }
                    
                    body {
                        background: white !important;
                        visibility: visible !important;
                    }
                }
            `}</style>


            {/* ==================================================================================
                BAGIAN 1: TAMPILAN WEB (UI DASHBOARD) - DIBUNGKUS CLASS 'web-ui-only'
            ================================================================================== */}
            <div className="app-layout web-ui-only">
                <SidebarKajur />
                <div className="content-container">
                    
                    {/* Header Web */}
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">Laporan Bulanan</h1>
                            <p className="page-subtitle">Rekapitulasi peminjaman ruangan Program Studi.</p>
                        </div>
                        <div style={{display:'flex', gap:10}}>
                            <button className="btn btn-outline" onClick={handlePrint} style={{background:'white', border:'1px solid #ddd', padding:'8px 16px', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
                                <Printer size={18}/> Cetak
                            </button>
                            <button className="btn btn-primary" onClick={handleExportExcel} style={{background:'#0ea5e9', color:'white', border:'none', padding:'8px 16px', borderRadius:8, cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
                                <Download size={18}/> Export Excel
                            </button>
                        </div>
                    </div>

                    {/* Filter Bar Web */}
                    <div className="card" style={{padding: '20px', marginBottom: '20px', display:'flex', alignItems:'center', gap:'20px', background:'white', borderRadius:12, border:'1px solid #e2e8f0'}}>
                        <div style={{display:'flex', alignItems:'center', gap:10, fontWeight:'bold', color:'#334155'}}>
                            <Filter size={20}/> FILTER DATA:
                        </div>
                        <select className="form-input" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={{padding:8, borderRadius:6, border:'1px solid #cbd5e1'}}>{months.map((m,i)=><option key={i} value={i}>{m}</option>)}</select>
                        <select className="form-input" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{padding:8, borderRadius:6, border:'1px solid #cbd5e1'}}>{years.map(y=><option key={y} value={y}>{y}</option>)}</select>
                    </div>

                    {/* Statistik Web */}
                    <div className="stat-grid" style={{display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap:20, marginBottom: 20}}>
                        <div className="card" style={{background:'white', padding:20, borderRadius:12, border:'1px solid #e2e8f0'}}>
                            <p style={{color:'#64748b', margin:0}}>Total Pengajuan</p>
                            <h3 style={{fontSize:'2rem', margin:'5px 0'}}>{summary.total}</h3>
                        </div>
                        <div className="card" style={{background:'white', padding:20, borderRadius:12, borderLeft:'5px solid #22c55e'}}>
                            <p style={{color:'#64748b', margin:0}}>Disetujui</p>
                            <h3 style={{fontSize:'2rem', margin:'5px 0', color:'#22c55e'}}>{summary.approved}</h3>
                        </div>
                        <div className="card" style={{background:'white', padding:20, borderRadius:12, borderLeft:'5px solid #ef4444'}}>
                            <p style={{color:'#64748b', margin:0}}>Ditolak</p>
                            <h3 style={{fontSize:'2rem', margin:'5px 0', color:'#ef4444'}}>{summary.rejected}</h3>
                        </div>
                    </div>

                    {/* Tabel Web */}
                    <div className="card" style={{background:'white', borderRadius:12, overflow:'hidden', border:'1px solid #e2e8f0'}}>
                        <table style={{width:'100%', borderCollapse:'collapse'}}>
                            <thead style={{background:'#f8fafc'}}>
                                <tr>
                                    <th style={{padding:15, textAlign:'left'}}>Mahasiswa</th>
                                    <th style={{padding:15, textAlign:'left'}}>Ruangan</th>
                                    <th style={{padding:15, textAlign:'left'}}>Waktu</th>
                                    <th style={{padding:15, textAlign:'center'}}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <tr><td colSpan="4" style={{padding:20, textAlign:'center'}}>Loading...</td></tr> : 
                                 filteredData.length > 0 ? filteredData.map((item, i) => (
                                    <tr key={i} style={{borderBottom:'1px solid #f1f5f9'}}>
                                        <td style={{padding:15}}><b>{item.nama_mahasiswa}</b><br/><small>{item.mahasiswa_nim}</small></td>
                                        <td style={{padding:15}}>{item.nama_ruangan}</td>
                                        <td style={{padding:15}}>{new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}</td>
                                        <td style={{padding:15, textAlign:'center'}}>{getStatusBadge(item.status)}</td>
                                    </tr>
                                )) : <tr><td colSpan="4" style={{padding:40, textAlign:'center', color:'#94a3b8'}}>Tidak ada data.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            {/* ==================================================================================
                BAGIAN 2: SURAT REKAPAN (DOKUMEN CETAK) - HANYA MUNCUL SAAT DIPRINT
            ================================================================================== */}
            <div id="printable-document">
                
                {/* KOP SURAT */}
                <div style={{borderBottom:'3px double black', paddingBottom:10, marginBottom:20, textAlign:'center', lineHeight: '1.2'}}>
                    <div style={{fontSize:'12pt', textTransform:'uppercase'}}>Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi</div>
                    <div style={{fontSize:'14pt', fontWeight:'bold', textTransform:'uppercase'}}>Universitas Lampung</div>
                    <div style={{fontSize:'13pt', fontWeight:'bold', textTransform:'uppercase'}}>Fakultas Teknik</div>
                    <div style={{fontSize:'12pt', fontStyle:'italic'}}>Jl. Prof. Dr. Sumantri Brojonegoro No. 1, Bandar Lampung 35145</div>
                </div>

                {/* JUDUL SURAT */}
                <div style={{textAlign:'center', marginBottom:30}}>
                    <h3 style={{textDecoration:'underline', margin:'0 0 5px 0'}}>LAPORAN REKAPITULASI PEMINJAMAN RUANGAN</h3>
                    <p style={{margin:0}}>Periode: {months[selectedMonth]} {selectedYear}</p>
                </div>

                {/* TABEL HITAM PUTIH UNTUK CETAK */}
                <table style={{width:'100%', borderCollapse:'collapse', border:'1px solid black', fontSize:'11pt'}}>
                    <thead>
                        <tr style={{background:'#e5e7eb'}}>
                            <th style={{border:'1px solid black', padding:'8px', width:'5%'}}>No</th>
                            <th style={{border:'1px solid black', padding:'8px', width:'25%'}}>Nama Mahasiswa / NIM</th>
                            <th style={{border:'1px solid black', padding:'8px', width:'15%'}}>Ruangan</th>
                            <th style={{border:'1px solid black', padding:'8px', width:'15%'}}>Tanggal</th>
                            <th style={{border:'1px solid black', padding:'8px'}}>Keperluan</th>
                            <th style={{border:'1px solid black', padding:'8px', width:'10%'}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? filteredData.map((item, index) => (
                            <tr key={index}>
                                <td style={{border:'1px solid black', padding:'6px', textAlign:'center'}}>{index + 1}</td>
                                <td style={{border:'1px solid black', padding:'6px'}}>
                                    {item.nama_mahasiswa}<br/>
                                    <small>({item.mahasiswa_nim})</small>
                                </td>
                                <td style={{border:'1px solid black', padding:'6px'}}>{item.nama_ruangan}</td>
                                <td style={{border:'1px solid black', padding:'6px'}}>
                                    {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}
                                </td>
                                <td style={{border:'1px solid black', padding:'6px'}}>{item.keperluan}</td>
                                <td style={{border:'1px solid black', padding:'6px', textAlign:'center'}}>
                                    {item.status === 'disetujui_kajur' ? 'Disetujui' : 
                                     item.status.includes('ditolak') ? 'Ditolak' : item.status}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{border:'1px solid black', padding:20, textAlign:'center'}}>
                                    Tidak ada data peminjaman pada periode ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* AREA TANDA TANGAN */}
                <div style={{marginTop:50, display:'flex', justifyContent:'flex-end'}}>
                    <div style={{width:'300px', textAlign:'left'}}>
                        <p style={{marginBottom:80}}>
                            Bandar Lampung, {new Date().toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}
                            <br/>Herlinawati, S.T., M.T,
                        </p>
                        <p style={{fontWeight:'bold', textDecoration:'underline', margin:0}}>Dr. Eng. Nama Kajur, S.T., M.T.</p>
                        <p style={{margin:0}}>NIP. 197103141999032001</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LaporanKajur;