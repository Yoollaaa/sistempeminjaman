import React from 'react';
import Sidebar from '../components/Sidebar';

const Riwayat = () => {
    const data = [
        { id: 1, ruangan: 'Gedung H5 - Lab Kendali', tgl: '2025-11-25', jam: '08:00 - 10:00', status: 'Menunggu', color: 'wait' },
        { id: 2, ruangan: 'Gedung H20 - R. Teori', tgl: '2025-12-01', jam: '13:00 - 15:00', status: 'Disetujui', color: 'ok' },
        { id: 3, ruangan: 'Gedung H19 - Lab Jarkom', tgl: '2025-10-15', jam: '09:00 - 11:00', status: 'Ditolak', color: 'no' },
    ];

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-container">
                <h1 style={{fontSize:'1.8rem', margin:'0 0 30px 0', color:'#0f172a'}}>Status Pengajuan</h1>

                <div className="card" style={{overflow:'hidden'}}>
                    <table style={{width:'100%', borderCollapse:'collapse', textAlign:'left'}}>
                        <thead style={{background:'#f8fafc', borderBottom:'1px solid #e2e8f0'}}>
                            <tr>
                                <th style={{padding:16, fontSize:'0.8rem', color:'#64748b', textTransform:'uppercase'}}>Ruangan</th>
                                <th style={{padding:16, fontSize:'0.8rem', color:'#64748b', textTransform:'uppercase'}}>Waktu</th>
                                <th style={{padding:16, fontSize:'0.8rem', color:'#64748b', textTransform:'uppercase'}}>Status</th>
                                <th style={{padding:16, fontSize:'0.8rem', color:'#64748b', textTransform:'uppercase'}}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id} style={{borderBottom:'1px solid #e2e8f0'}}>
                                    <td style={{padding:16, fontWeight:600, color:'#0f172a'}}>{item.ruangan}</td>
                                    <td style={{padding:16, fontSize:'0.9rem', color:'#64748b'}}>{item.tgl} <br/> {item.jam}</td>
                                    <td style={{padding:16}}>
                                        <span className={`badge ${item.color}`}>{item.status}</span>
                                    </td>
                                    <td style={{padding:16}}>
                                        <button style={{border:'1px solid #e2e8f0', background:'white', padding:'6px 12px', borderRadius:6, cursor:'pointer', fontSize:'0.8rem', fontWeight:600, color:'#0f172a'}}>Detail</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Riwayat;