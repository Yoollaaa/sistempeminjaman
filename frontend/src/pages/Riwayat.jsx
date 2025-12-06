import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api.js';
import { 
    Calendar, Clock, FileText, CheckCircle, XCircle, 
    Loader2, Download, Filter, ChevronRight, AlertCircle 
} from 'lucide-react';

const Riwayat = () => {
    const [activeTab, setActiveTab] = useState('Semua');
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data dari backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/peminjaman/my-peminjaman');
                
                if (response.data && response.data.data) {
                    // Transform data dari backend ke format yang sesuai dengan UI
                    const transformedData = response.data.data.map((p) => {
                        // Mapping status ke type (untuk styling)
                        let type, step, statusDisplay;
                        
                        if (p.status === 'diajukan') {
                            type = 'pending';
                            step = 1;
                            statusDisplay = 'Menunggu Verifikasi';
                        } else if (p.status === 'disetujui_admin') {
                            type = 'process';
                            step = 2;
                            statusDisplay = 'Diverifikasi Admin';
                        } else if (p.status === 'disetujui_kajur') {
                            type = 'success';
                            step = 3;
                            statusDisplay = 'Disetujui';
                        } else if (p.status === 'ditolak_admin' || p.status === 'ditolak_kajur') {
                            type = 'error';
                            step = 3;
                            statusDisplay = 'Ditolak';
                        } else {
                            type = 'pending';
                            step = 1;
                            statusDisplay = p.status;
                        }

                        return {
                            id: p.id,
                            ruangan: p.nama_ruangan,
                            tgl: new Date(p.tanggal_pinjam).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
                            jam: `${p.jam_mulai} - ${p.jam_selesai}`,
                            keperluan: p.keperluan,
                            status: statusDisplay,
                            step: step,
                            type: type,
                            note: p.status === 'ditolak_admin' ? p.catatan_admin : p.catatan_kajur,
                            originalStatus: p.status,
                            created_at: p.created_at
                        };
                    });
                    
                    setHistoryData(transformedData);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching peminjaman:', err);
                setError('Gagal mengambil data peminjaman');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // FILTER DATA
    const filteredData = activeTab === 'Semua' 
        ? historyData 
        : historyData.filter(item => {
            if(activeTab === 'Diproses') return item.type === 'pending' || item.type === 'process';
            if(activeTab === 'Selesai') return item.type === 'success' || item.type === 'error';
            return true;
        });

    // CONFIG DESIGN (Warna & Icon berdasarkan status)
    const getStatusStyle = (type) => {
        switch(type) {
            case 'success': return { border: '#16a34a', bgBadge: '#dcfce7', textBadge: '#166534', icon: <CheckCircle size={16}/> };
            case 'error': return { border: '#dc2626', bgBadge: '#fee2e2', textBadge: '#991b1b', icon: <XCircle size={16}/> };
            case 'process': return { border: '#0284c7', bgBadge: '#e0f2fe', textBadge: '#0369a1', icon: <Loader2 size={16} style={{animation: 'spin 1s linear infinite'}}/> }; 
            default: return { border: '#f59e0b', bgBadge: '#fef3c7', textBadge: '#b45309', icon: <Clock size={16}/> };
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container">
                
                {/* HEADER */}
                <div style={{marginBottom: 30}}>
                    <h1 style={{fontSize:'2rem', fontWeight:800, color:'#0f172a', margin:'0 0 8px 0', letterSpacing: '-0.5px'}}>Status Pengajuan</h1>
                    <p style={{color:'#64748b', margin:0, fontSize: '0.95rem', fontWeight: 500}}>Pantau progres persetujuan peminjaman ruangan Anda secara real-time.</p>
                </div>

                {/* TAB FILTER MODERN */}
                <div style={{
                    display:'inline-flex', background:'white', padding: 5, borderRadius: 12, 
                    border:'1px solid #e2e8f0', marginBottom: 30, boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
                }}>
                    {['Semua', 'Diproses', 'Selesai'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: activeTab === tab ? '#0284c7' : 'transparent',
                                color: activeTab === tab ? 'white' : '#64748b',
                                border: 'none', padding: '8px 20px', borderRadius: 8,
                                fontWeight: 600, cursor: 'pointer', transition: '0.3s', fontSize: '0.9rem'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* GRID KARTU STATUS */}
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(380px, 1fr))', gap: 24}}>
                    {loading ? (
                        <div style={{gridColumn: '1 / -1', textAlign:'center', padding: 60, color:'#64748b'}}>
                            <Loader2 size={48} style={{margin: '0 auto 10px', animation: 'spin 1s linear infinite'}} />
                            <p>Memuat data pengajuan...</p>
                        </div>
                    ) : error ? (
                        <div style={{gridColumn: '1 / -1', textAlign:'center', padding: 60, color:'#dc2626'}}>
                            <AlertCircle size={48} style={{marginBottom:10}} />
                            <p>{error}</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div style={{gridColumn: '1 / -1', textAlign:'center', padding:60, color:'#94a3b8'}}>
                            <Filter size={48} style={{marginBottom:10, opacity:0.3}}/>
                            <p>Tidak ada data pengajuan pada tab ini.</p>
                        </div>
                    ) : (
                        filteredData.map((item) => {
                            const style = getStatusStyle(item.type);
                            
                            return (
                                <div key={item.id} className="card" style={{
                                    position:'relative', overflow:'hidden', 
                                    transition: 'transform 0.3s, box-shadow 0.3s', cursor:'default'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                                }}
                                >
                                    {/* Indikator Warna Samping */}
                                    <div style={{position:'absolute', left:0, top:0, bottom:0, width: 6, background: style.border}}></div>

                                    {/* Header Kartu */}
                                    <div style={{padding: '20px 20px 15px 26px', borderBottom:'1px dashed #e2e8f0', display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <div>
                                            <h3 style={{margin:0, fontSize:'1.1rem', color:'#0f172a', fontWeight:700}}>{item.ruangan}</h3>
                                            <div style={{display:'flex', gap:8, fontSize:'0.85rem', color:'#64748b', marginTop:5}}>
                                                <span style={{display:'flex', alignItems:'center', gap:4}}><Calendar size={14}/> {item.tgl}</span>
                                                <span style={{display:'flex', alignItems:'center', gap:4}}><Clock size={14}/> {item.jam}</span>
                                            </div>
                                        </div>
                                        <span style={{
                                            background: style.bgBadge, color: style.textBadge, 
                                            padding:'4px 10px', borderRadius:20, fontSize:'0.7rem', fontWeight:700,
                                            display:'flex', alignItems:'center', gap:5, textTransform:'uppercase'
                                        }}>
                                            {style.icon} {item.status}
                                        </span>
                                    </div>

                                    {/* Body Kartu */}
                                    <div style={{padding: '15px 20px 20px 26px'}}>
                                        <p style={{margin:'0 0 15px 0', fontSize:'0.9rem', color:'#334155', lineHeight:1.5}}>
                                            <span style={{color:'#94a3b8', fontSize:'0.8rem', display:'block', marginBottom:2, fontWeight:600}}>KEPERLUAN:</span>
                                            {item.keperluan}
                                        </p>

                                        {/* TRACKING STEPPER (Visualisasi Proses) */}
                                        {item.type !== 'error' && (
                                            <div style={{marginTop: 10}}>
                                                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#94a3b8', marginBottom:8, fontWeight:600}}>
                                                    <span style={{color: item.step >= 1 ? style.border : '#cbd5e1'}}>Diajukan</span>
                                                    <span style={{color: item.step >= 2 ? style.border : '#cbd5e1'}}>Verifikasi Admin</span>
                                                    <span style={{color: item.step >= 3 ? style.border : '#cbd5e1'}}>Persetujuan Kajur</span>
                                                </div>
                                                <div style={{height:6, background:'#f1f5f9', borderRadius:10, overflow:'hidden', position:'relative'}}>
                                                    <div style={{
                                                        width: item.step === 1 ? '33%' : item.step === 2 ? '66%' : '100%', 
                                                        height:'100%', background: style.border, borderRadius:10, 
                                                        transition: 'width 1s ease'
                                                    }}></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Alert Jika Ditolak */}
                                        {item.type === 'error' && (
                                            <div style={{background:'#fef2f2', padding:12, borderRadius:8, border:'1px solid #fecaca', display:'flex', gap:10}}>
                                                <AlertCircle size={20} color="#dc2626" style={{minWidth:20}}/>
                                                <div>
                                                    <span style={{fontSize:'0.8rem', fontWeight:700, color:'#991b1b'}}>Alasan Penolakan:</span>
                                                    <p style={{margin:0, fontSize:'0.85rem', color:'#b91c1c'}}>{item.note || 'Tidak ada catatan'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Actions (Hanya jika Sukses) */}
                                    {item.type === 'success' && (
                                        <div style={{background:'#f8fafc', padding:'12px 20px', borderTop:'1px solid #e2e8f0', display:'flex', justifyContent:'flex-end'}}>
                                            <button style={{
                                                background:'white', border:'1px solid #e2e8f0', color:'#0f172a',
                                                padding:'8px 16px', borderRadius:8, fontSize:'0.85rem', fontWeight:600,
                                                display:'flex', alignItems:'center', gap:6, cursor:'pointer', transition:'0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.borderColor = '#0284c7'}
                                            onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
                                            >
                                                <Download size={16}/> Unduh Surat Izin
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
};

export default Riwayat;