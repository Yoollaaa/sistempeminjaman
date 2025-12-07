import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import { Plus, Edit, Trash2, Save, X, Building } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';

const KelolaRuangan = () => {
    // State Data
    const [ruangan, setRuangan] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State Form (Default Value)
    const initialFormState = { ruangan_id: null, nama_ruangan: '', kapasitas: '', lokasi: '', status: 'Tersedia' };
    const [formData, setFormData] = useState(initialFormState);
    
    // State Feedback (Toast/Error)
    const [toast, setToast] = useState({ message: '', type: '' });

    // 1. Fetch Data saat halaman dimuat
    useEffect(() => { loadRooms(); }, []);

    const loadRooms = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/ruangan');
            // Pastikan mengambil array data yang benar
            setRuangan(Array.isArray(resp.data) ? resp.data : resp.data.data || []);
        } catch (e) {
            console.error("Gagal load ruangan:", e);
            setToast({ message: 'Gagal memuat data ruangan.', type: 'error' });
        } finally { setLoading(false); }
    };

    // 2. Fungsi Simpan (Create / Update)
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Validasi sederhana
            if(!formData.nama_ruangan || !formData.kapasitas) {
                alert("Nama dan Kapasitas wajib diisi!");
                return;
            }

            // Cek apakah mode EDIT atau TAMBAH
            if (formData.ruangan_id) {
                // Mode Edit: PUT /ruangan/{id}
                await api.put(`/ruangan/${formData.ruangan_id}`, formData);
                setToast({ message: 'Ruangan berhasil diperbarui!', type: 'success' });
            } else {
                // Mode Tambah: POST /ruangan
                await api.post('/ruangan', formData);
                setToast({ message: 'Ruangan baru berhasil ditambahkan!', type: 'success' });
            }
            
            setIsModalOpen(false); // Tutup modal
            loadRooms();           // Refresh data
        } catch (e) {
            console.error("Gagal simpan:", e);
            const msg = e.response?.data?.message || 'Gagal menyimpan data.';
            setToast({ message: msg, type: 'error' });
        }
    };

    // 3. Fungsi Hapus
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus ruangan ini secara permanen?")) return;
        try {
            await api.delete(`/ruangan/${id}`);
            setToast({ message: 'Ruangan berhasil dihapus.', type: 'success' });
            loadRooms();
        } catch (e) {
            console.error("Gagal hapus:", e);
            setToast({ message: 'Gagal menghapus ruangan.', type: 'error' });
        }
    };

    // 4. Helper Buka Modal
    const openModal = (data = null) => {
        if (data) {
            // Isi form dengan data yang mau diedit
            setFormData({ 
                ruangan_id: data.ruangan_id, // Pastikan pakai key yang benar dari DB
                nama_ruangan: data.nama_ruangan, 
                kapasitas: data.kapasitas, 
                lokasi: data.lokasi || '', // Tambahkan lokasi jika ada
                status: data.status || 'Tersedia' 
            });
        } else {
            // Kosongkan form untuk tambah baru
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    return (
        <div className="app-layout">
            <SidebarAdmin />
            <div className="content-container">
                
                {/* Header Halaman */}
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:30}}>
                    <div>
                        <h1 style={{fontSize:'1.8rem', fontWeight:700, margin:0, color:'#0f172a'}}>Kelola Ruangan</h1>
                        <p style={{margin:0, color:'#64748b'}}>Tambah, edit, atau hapus data ruangan laboratorium.</p>
                    </div>
                    <button 
                        onClick={() => openModal()} 
                        style={{
                            background:'#0ea5e9', color:'white', border:'none', padding:'12px 20px', 
                            borderRadius:8, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8
                        }}
                    >
                        <Plus size={20}/> Tambah Ruangan
                    </button>
                </div>

                {/* Tabel Data */}
                <div style={{background:'white', borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden'}}>
                    {loading ? <div style={{padding:30, textAlign:'center', color:'#64748b'}}>Memuat data...</div> : (
                        <table style={{width:'100%', borderCollapse:'collapse'}}>
                            <thead style={{background:'#f8fafc', borderBottom:'1px solid #e2e8f0'}}>
                                <tr>
                                    <th style={{padding:16, textAlign:'left', fontSize:'0.85rem', color:'#64748b', textTransform:'uppercase'}}>Nama Ruangan</th>
                                    <th style={{padding:16, textAlign:'left', fontSize:'0.85rem', color:'#64748b', textTransform:'uppercase'}}>Kapasitas</th>
                                    <th style={{padding:16, textAlign:'left', fontSize:'0.85rem', color:'#64748b', textTransform:'uppercase'}}>Lokasi / Ket</th>
                                    <th style={{padding:16, textAlign:'center', fontSize:'0.85rem', color:'#64748b', textTransform:'uppercase'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ruangan.length === 0 ? (
                                    <tr><td colSpan="4" style={{padding:30, textAlign:'center', color:'#94a3b8'}}>Belum ada data ruangan.</td></tr>
                                ) : (
                                    ruangan.map((r, idx) => (
                                        <tr key={idx} style={{borderBottom:'1px solid #f1f5f9'}}>
                                            <td style={{padding:16, fontWeight:600, color:'#0f172a'}}>
                                                <div style={{display:'flex', alignItems:'center', gap:10}}>
                                                    <div style={{width:32, height:32, background:'#e0f2fe', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'#0284c7'}}>
                                                        <Building size={16}/>
                                                    </div>
                                                    {r.nama_ruangan}
                                                </div>
                                            </td>
                                            <td style={{padding:16, color:'#475569'}}>{r.kapasitas} Orang</td>
                                            <td style={{padding:16, color:'#64748b'}}>{r.lokasi || r.keterangan || '-'}</td>
                                            <td style={{padding:16, textAlign:'center'}}>
                                                <button onClick={() => openModal(r)} style={{background:'none', border:'none', cursor:'pointer', color:'#0ea5e9', marginRight:10}} title="Edit">
                                                    <Edit size={18}/>
                                                </button>
                                                <button onClick={() => handleDelete(r.ruangan_id)} style={{background:'none', border:'none', cursor:'pointer', color:'#ef4444'}} title="Hapus">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* MODAL FORM */}
                {isModalOpen && (
                    <div style={{
                        position:'fixed', top:0, left:0, right:0, bottom:0, 
                        background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50
                    }}>
                        <div style={{background:'white', width:400, borderRadius:12, padding:24, boxShadow:'0 20px 25px -5px rgba(0,0,0,0.1)'}}>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                                <h2 style={{margin:0, fontSize:'1.25rem'}}>{formData.ruangan_id ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}</h2>
                                <button onClick={() => setIsModalOpen(false)} style={{background:'none', border:'none', cursor:'pointer', color:'#94a3b8'}}><X size={20}/></button>
                            </div>
                            
                            <form onSubmit={handleSave}>
                                <div style={{marginBottom:15}}>
                                    <label style={{display:'block', marginBottom:6, fontSize:'0.9rem', fontWeight:600}}>Nama Ruangan</label>
                                    <input 
                                        type="text" 
                                        value={formData.nama_ruangan} 
                                        onChange={e => setFormData({...formData, nama_ruangan: e.target.value})} 
                                        placeholder="Contoh: Lab Komputer A"
                                        style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1', outline:'none'}}
                                        required 
                                    />
                                </div>
                                
                                <div style={{marginBottom:15}}>
                                    <label style={{display:'block', marginBottom:6, fontSize:'0.9rem', fontWeight:600}}>Kapasitas (Orang)</label>
                                    <input 
                                        type="number" 
                                        value={formData.kapasitas} 
                                        onChange={e => setFormData({...formData, kapasitas: e.target.value})} 
                                        placeholder="Contoh: 40"
                                        style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1', outline:'none'}}
                                        required 
                                    />
                                </div>

                                <div style={{marginBottom:20}}>
                                    <label style={{display:'block', marginBottom:6, fontSize:'0.9rem', fontWeight:600}}>Lokasi / Keterangan</label>
                                    <textarea 
                                        value={formData.lokasi} 
                                        onChange={e => setFormData({...formData, lokasi: e.target.value})} 
                                        placeholder="Contoh: Gedung H Lt. 1"
                                        rows="3"
                                        style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1', outline:'none', fontFamily:'inherit'}} 
                                    />
                                </div>

                                <div style={{display:'flex', justifyContent:'flex-end', gap:10}}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{background:'white', border:'1px solid #cbd5e1', padding:'10px 16px', borderRadius:6, cursor:'pointer'}}>Batal</button>
                                    <button type="submit" style={{background:'#0ea5e9', color:'white', border:'none', padding:'10px 16px', borderRadius:6, cursor:'pointer', fontWeight:600}}>
                                        {formData.ruangan_id ? 'Simpan Perubahan' : 'Simpan Data'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Komponen Toast untuk Notifikasi */}
                {toast.message && (
                    <div style={{
                        position:'fixed', bottom:30, right:30, 
                        background: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: toast.type === 'success' ? '#166534' : '#991b1b',
                        padding:'12px 24px', borderRadius:8, boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)',
                        fontWeight:600, zIndex:100, border: `1px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`
                    }}>
                        {toast.message}
                    </div>
                )}

            </div>
        </div>
    );
};

export default KelolaRuangan;