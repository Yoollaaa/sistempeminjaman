import React from 'react';
import Sidebar from '../components/Sidebar';
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';

const Notifikasi = () => {
    // DATA DUMMY NOTIFIKASI
    const notifications = [
        { 
            id: 1, 
            type: 'success', 
            title: 'Peminjaman Disetujui', 
            pesan: 'Pengajuan ruangan H5 untuk tanggal 25 Nov telah disetujui oleh Ketua Jurusan.', 
            waktu: 'Baru saja',
            isRead: false 
        },
        { 
            id: 2, 
            type: 'info', 
            title: 'Verifikasi Admin Berhasil', 
            pesan: 'Pengajuan H20 telah diverifikasi Admin. Menunggu persetujuan Kajur.', 
            waktu: '2 jam yang lalu',
            isRead: true 
        },
        { 
            id: 3, 
            type: 'error', 
            title: 'Peminjaman Ditolak', 
            pesan: 'Pengajuan H19 ditolak karena bentrok dengan jadwal Sidang Skripsi.', 
            waktu: '1 hari yang lalu',
            isRead: true 
        }
    ];

    const getIcon = (type) => {
        switch(type) {
            case 'success': return <CheckCircle size={24} color="#16a34a" />;
            case 'error': return <XCircle size={24} color="#dc2626" />;
            default: return <Info size={24} color="#2563eb" />;
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container">
                <div style={{maxWidth: 800, margin: '0 auto'}}>
                    {/* Header */}
                    <div style={{marginBottom: 30, display:'flex', alignItems:'center', gap:15}}>
                        <div style={{background:'white', padding:12, borderRadius:'50%', border:'1px solid #e2e8f0'}}>
                            <Bell size={24} color="#0f172a"/>
                        </div>
                        <div>
                            <h1 style={{fontSize: '1.8rem', margin: '0', color: '#0f172a'}}>Notifikasi</h1>
                            <p style={{color: '#64748b', margin: 0}}>Update terbaru status peminjaman Anda.</p>
                        </div>
                    </div>

                    {/* List Notifikasi */}
                    <div style={{display:'flex', flexDirection:'column', gap: 15}}>
                        {notifications.map((notif) => (
                            <div key={notif.id} className="card" 
                                style={{
                                    padding: 20, display: 'flex', gap: 20, alignItems: 'flex-start',
                                    borderLeft: notif.isRead ? '1px solid #e2e8f0' : '4px solid #0284c7', // Penanda Belum Baca
                                    backgroundColor: notif.isRead ? 'white' : '#f0f9ff' // Highlight Belum Baca
                                }}
                            >
                                <div style={{marginTop: 2}}>{getIcon(notif.type)}</div>
                                <div style={{flex: 1}}>
                                    <div style={{display:'flex', justifyContent:'space-between', marginBottom: 5}}>
                                        <h3 style={{margin:0, fontSize:'1rem', color:'#0f172a'}}>{notif.title}</h3>
                                        <span style={{fontSize:'0.75rem', color:'#64748b'}}>{notif.waktu}</span>
                                    </div>
                                    <p style={{margin:0, color:'#475569', fontSize:'0.9rem', lineHeight: 1.5}}>
                                        {notif.pesan}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifikasi;