import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import { Plus, Edit, Trash2, Save, X, Building, MapPin, Info } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';

const KelolaRuangan = () => {
    // State Data
    const [ruangan, setRuangan] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State Form (Default Value)
    // UPDATE 1: Tambahkan 'keterangan' di sini
    const initialFormState = { 
        ruangan_id: null, 
        nama_ruangan: '', 
        kapasitas: '', 
        lokasi: '', 
        keterangan: '', // <--- Field baru untuk fungsi ruangan
        status: 'Tersedia' 
    };
    const [formData, setFormData] = useState(initialFormState);
    
    // State Feedback
    const [toast, setToast] = useState({ message: '', type: '' });

    useEffect(() => { loadRooms(); }, []);

    const loadRooms = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/ruangan');
            setRuangan(Array.isArray(resp.data) ? resp.data : resp.data.data || []);
        } catch (e) {
            console.error("Gagal load ruangan:", e);
            setToast({ message: 'Gagal memuat data ruangan.', type: 'error' });
        } finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData.ruangan_id) {
                await api.put(`/ruangan/${formData.ruangan_id}`, formData);
                setToast({ message: 'Ruangan berhasil diperbarui!', type: 'success' });
            } else {
                await api.post('/ruangan', formData);
                setToast({ message: 'Ruangan baru berhasil ditambahkan!', type: 'success' });
            }
            setIsModalOpen(false);
            loadRooms();
        } catch (e) {
            console.error("Gagal simpan:", e);
            const msg = e.response?.data?.message || 'Gagal menyimpan data.';
            setToast({ message: msg, type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus ruangan ini secara permanen?")) return;
        try {
            await api.delete(`/ruangan/${id}`);
            setToast({ message: 'Ruangan berhasil dihapus.', type: 'success' });
            loadRooms();
        } catch (e) {
            setToast({ message: 'Gagal menghapus ruangan.', type: 'error' });
        }
    };

    const openModal = (data = null) => {
        if (data) {
            setFormData({ 
                ruangan_id: data.ruangan_id,
                nama_ruangan: data.nama_ruangan, 
                kapasitas: data.kapasitas, 
                lokasi: data.lokasi || '',
                keterangan: data.keterangan || '', // UPDATE 2: Load keterangan saat edit
                status: data.status || 'Tersedia' 
            });
        } else {
            setFormData(initialFormState);
        }
        setIsModalOpen(true);
    };

    return (
        <div className="app-layout">
            <SidebarAdmin />
            <div className="content-container">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:30}}>
                    <div>
                        <h1 style={{fontSize:'1.8rem', fontWeight:700, margin:0, color:'#0f172a'}}>Kelola Ruangan</h1>
                        <p style={{margin:0, color:'#64748b'}}>Tambah, edit, atau hapus data ruangan laboratorium.</p>
                    </div>
                    <button onClick={() => openModal()} style={{background:'#0ea5e9', color:'white', border:'none', padding:'12px 20px', borderRadius:8, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
                        <Plus size={20}/> Tambah Ruangan
                    </button>
                </div>

                <div style={{background:'white', borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden'}}>
                    {loading ? <div style={{padding:30, textAlign:'center'}}>Memuat data...</div> : (
                        <table style={{width:'100%', borderCollapse:'collapse'}}>
                            <thead style={{background:'#f8fafc', borderBottom:'1px solid #e2e8f0'}}>
                                <tr>
                                    <th style={{padding:16, textAlign:'left', fontSize:'0.85rem', color:'#64748b', textTransform:'uppercase'}}>Nama Ruangan</th>
                                    {/* UPDATE 3: Tambah Header Tabel */}
                                    <th style={{padding:16, textAlign:'left', fontSize:'0.85rem', color:'#64748b', textTransform:'uppercase'}}>Fungsi / Deskripsi</th>
                                    <th style={{padding:16, textAlign:'left', fontSize:'0.85rem', color:'#64748b', textTransform:'uppercase'}}>Lokasi</th>
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
                                                    <div style={{width:32, height:32, background:'#e0f2fe', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'#0284c7'}}><Building size={16}/></div>
                                                    <div>
                                                        <div>{r.nama_ruangan}</div>
                                                        <div style={{fontSize:'0.75rem', color:'#64748b'}}>{r.kapasitas} Orang</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* UPDATE 4: Tampilkan Keterangan */}
                                            <td style={{padding:16, color:'#334155'}}>{r.keterangan || '-'}</td>
                                            <td style={{padding:16, color:'#64748b'}}>{r.lokasi || '-'}</td>
                                            <td style={{padding:16, textAlign:'center'}}>
                                                <button onClick={() => openModal(r)} style={{background:'none', border:'none', cursor:'pointer', color:'#0ea5e9', marginRight:10}}><Edit size={18}/></button>
                                                <button onClick={() => handleDelete(r.ruangan_id)} style={{background:'none', border:'none', cursor:'pointer', color:'#ef4444'}}><Trash2 size={18}/></button>
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
                    <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50}}>
                        <div style={{background:'white', width:450, borderRadius:12, padding:24, boxShadow:'0 20px 25px -5px rgba(0,0,0,0.1)'}}>
                            <h2 style={{margin:0, marginBottom:20, fontSize:'1.25rem'}}>{formData.ruangan_id ? 'Edit Ruangan' : 'Tambah Ruangan'}</h2>
                            <form onSubmit={handleSave}>
                                <div style={{marginBottom:15}}>
                                    <label style={{display:'block', marginBottom:6, fontSize:'0.9rem', fontWeight:600}}>Nama Ruangan</label>
                                    <input type="text" className="form-input" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1'}} value={formData.nama_ruangan} onChange={e => setFormData({...formData, nama_ruangan: e.target.value})} placeholder="Contoh: H5" required />
                                </div>
                                
                                {/* UPDATE 5: Input Keterangan Baru */}
                                <div style={{marginBottom:15}}>
                                    <label style={{display:'block', marginBottom:6, fontSize:'0.9rem', fontWeight:600}}>Fungsi / Deskripsi</label>
                                    <div style={{position:'relative'}}>
                                        <Info size={18} style={{position:'absolute', top:10, left:10, color:'#94a3b8'}}/>
                                        <input type="text" className="form-input" style={{width:'100%', padding:'10px 10px 10px 36px', borderRadius:6, border:'1px solid #cbd5e1'}} value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} placeholder="Contoh: Ruang Kuliah Teori" />
                                    </div>
                                </div>

                                <div style={{display:'flex', gap:15, marginBottom:20}}>
                                    <div style={{flex:1}}>
                                        <label style={{display:'block', marginBottom:6, fontSize:'0.9rem', fontWeight:600}}>Kapasitas</label>
                                        <input type="number" className="form-input" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1'}} value={formData.kapasitas} onChange={e => setFormData({...formData, kapasitas: e.target.value})} placeholder="40" required />
                                    </div>
                                    <div style={{flex:1.5}}>
                                        <label style={{display:'block', marginBottom:6, fontSize:'0.9rem', fontWeight:600}}>Lokasi</label>
                                        <div style={{position:'relative'}}>
                                            <MapPin size={18} style={{position:'absolute', top:10, left:10, color:'#94a3b8'}}/>
                                            <input type="text" className="form-input" style={{width:'100%', padding:'10px 10px 10px 36px', borderRadius:6, border:'1px solid #cbd5e1'}} value={formData.lokasi} onChange={e => setFormData({...formData, lokasi: e.target.value})} placeholder="Gedung H Lt 1" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{display:'flex', justifyContent:'flex-end', gap:10}}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{background:'white', border:'1px solid #ddd', padding:'10px 16px', borderRadius:6, cursor:'pointer'}}>Batal</button>
                                    <button type="submit" className="btn btn-primary" style={{background:'#0ea5e9', color:'white', border:'none', padding:'10px 16px', borderRadius:6, cursor:'pointer'}}>Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {toast.message && <Toast message={toast.message} type={toast.type} onClose={()=>setToast({message:''})}/>}
            </div>
        </div>
    );
};

export default KelolaRuangan;