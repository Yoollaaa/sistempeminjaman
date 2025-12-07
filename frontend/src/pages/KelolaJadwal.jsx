import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import { Plus, Trash2, Edit, Save, Clock, BookOpen, User } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';

const KelolaJadwal = () => {
    const [jadwal, setJadwal] = useState([]);
    const [ruangan, setRuangan] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State Form (Tambahkan id: null untuk mode Edit)
    const initialForm = { 
        id: null, 
        ruangan_id: '', 
        hari: 'Senin', 
        jam_mulai: '', 
        jam_selesai: '', 
        mata_kuliah: '', 
        nama_dosen: '' 
    };
    const [formData, setFormData] = useState(initialForm);
    
    const [toast, setToast] = useState({ message: '', type: '' });
    const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    useEffect(() => { loadInitialData(); }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [resRuangan, resJadwal] = await Promise.all([
                api.get('/ruangan'),
                api.get('/jadwal') 
            ]);
            setRuangan(resRuangan.data.data || []);
            setJadwal(resJadwal.data.data || []);
        } catch (e) {
            setToast({ message: 'Gagal memuat data.', type: 'error' });
        } finally { setLoading(false); }
    };

    // Fungsi Baru: Membuka Modal (Bisa untuk Tambah atau Edit)
    const openModal = (data = null) => {
        if (data) {
            // Mode Edit: Isi form dengan data yang dipilih
            setFormData({
                id: data.id, // Pastikan backend mengirimkan 'id' atau 'jadwal_id'
                ruangan_id: data.ruangan_id,
                hari: data.hari,
                // Potong string waktu agar sesuai format input type="time" (HH:mm)
                jam_mulai: data.jam_mulai ? data.jam_mulai.substring(0, 5) : '',
                jam_selesai: data.jam_selesai ? data.jam_selesai.substring(0, 5) : '',
                mata_kuliah: data.mata_kuliah,
                nama_dosen: data.nama_dosen
            });
        } else {
            // Mode Tambah: Reset form
            setFormData(initialForm);
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                // Logic Edit (PUT)
                await api.put(`/jadwal/${formData.id}`, formData);
                setToast({ message: 'Jadwal berhasil diperbarui.', type: 'success' });
            } else {
                // Logic Tambah (POST)
                await api.post('/jadwal', formData);
                setToast({ message: 'Jadwal kuliah ditambahkan.', type: 'success' });
            }
            
            setIsModalOpen(false);
            setFormData(initialForm);
            loadInitialData();
        } catch (e) {
            console.error(e);
            const msg = e.response?.data?.message || 'Gagal menyimpan (Mungkin bentrok waktu).';
            setToast({ message: msg, type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus jadwal kuliah ini?")) return;
        try {
            await api.delete(`/jadwal/${id}`);
            setToast({ message: 'Jadwal dihapus.', type: 'success' });
            loadInitialData();
        } catch (e) { setToast({ message: 'Gagal menghapus.', type: 'error' }); }
    };

    const getRoomName = (id) => {
        const room = ruangan.find(r => r.ruangan_id == id);
        return room ? room.nama_ruangan : '-';
    };

    return (
        <div className="app-layout">
            <SidebarAdmin />
            <div className="content-container">
                <div className="page-header" style={{marginBottom:30, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                        <h1 className="page-title" style={{margin:0, fontSize:'1.8rem', color:'#0f172a'}}>Master Jadwal Kuliah</h1>
                        <p className="page-subtitle" style={{margin:0, color:'#64748b'}}>Ruangan akan otomatis berstatus "Terpakai" pada jam ini.</p>
                    </div>
                    {/* Tombol Tambah memanggil openModal() tanpa parameter */}
                    <button onClick={() => openModal()} className="btn btn-primary" style={{background:'#0ea5e9', color:'white', border:'none', padding:'12px 20px', borderRadius:8, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
                        <Plus size={18}/> Tambah Jadwal
                    </button>
                </div>

                <div className="card" style={{background:'white', borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden'}}>
                    {loading ? <div style={{padding:30, textAlign:'center'}}>Memuat...</div> : jadwal.length === 0 ? <div style={{padding:30, textAlign:'center', color:'#94a3b8'}}>Belum ada jadwal rutin.</div> : (
                        <table className="table-custom" style={{width:'100%', borderCollapse:'collapse'}}>
                            <thead style={{background:'#f8fafc', borderBottom:'1px solid #e2e8f0'}}>
                                <tr>
                                    <th style={{padding:16, textAlign:'left', color:'#64748b'}}>Hari & Ruangan</th>
                                    <th style={{padding:16, textAlign:'left', color:'#64748b'}}>Waktu</th>
                                    <th style={{padding:16, textAlign:'left', color:'#64748b'}}>Mata Kuliah & Dosen</th>
                                    <th style={{padding:16, textAlign:'center', color:'#64748b'}}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jadwal.sort((a,b) => hariOptions.indexOf(a.hari) - hariOptions.indexOf(b.hari)).map((item, idx) => (
                                    <tr key={idx} style={{borderBottom:'1px solid #f1f5f9'}}>
                                        <td style={{padding:16}}>
                                            <div style={{display:'flex', alignItems:'center', gap:10}}>
                                                <span className="badge" style={{background:'#e0f2fe', color:'#0284c7', padding:'4px 10px', borderRadius:20, fontSize:'0.8rem', fontWeight:600}}>{item.hari}</span>
                                                <b style={{color:'#0f172a'}}>{getRoomName(item.ruangan_id)}</b>
                                            </div>
                                        </td>
                                        <td style={{padding:16, color:'#475569'}}>
                                            <div style={{display:'flex', alignItems:'center', gap:6}}>
                                                <Clock size={14}/> {item.jam_mulai.substring(0,5)} - {item.jam_selesai.substring(0,5)}
                                            </div>
                                        </td>
                                        <td style={{padding:16}}>
                                            <div style={{fontWeight:600, color:'#0f172a', display:'flex', alignItems:'center', gap:6}}><BookOpen size={14}/> {item.mata_kuliah}</div>
                                            <small style={{color:'#64748b', display:'flex', alignItems:'center', gap:6, marginTop:4}}><User size={14}/> {item.nama_dosen}</small>
                                        </td>
                                        <td style={{padding:16}}>
                                            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap: 8}}>
                                                {/* Tombol Edit */}
                                                <button 
                                                    onClick={() => openModal(item)} 
                                                    style={{
                                                        background: '#f0f9ff', border: '1px solid #bae6fd', 
                                                        borderRadius: 6, padding: 6, cursor: 'pointer', color: '#0284c7'
                                                    }}>
                                                    <Edit size={16}/>
                                                </button>
                                                
                                                {/* Tombol Hapus */}
                                                <button 
                                                    onClick={() => handleDelete(item.id)} 
                                                    style={{
                                                        background: '#fef2f2', border: '1px solid #fecaca', 
                                                        borderRadius: 6, padding: 6, cursor: 'pointer', color: '#ef4444'
                                                    }}>
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* MODAL FORM */}
                {isModalOpen && (
                    <div className="modal-overlay" style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50}}>
                        <div className="modal-box" style={{width: 500, background:'white', padding:30, borderRadius:12}}>
                            {/* Judul Modal Dinamis */}
                            <h2 style={{marginTop:0, marginBottom:20, color:'#0f172a'}}>
                                {formData.id ? 'Edit Jadwal Rutin' : 'Input Jadwal Rutin'}
                            </h2>
                            <form onSubmit={handleSave}>
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15}}>
                                    <div>
                                        <label className="label-text" style={{display:'block', marginBottom:5, fontWeight:600}}>Hari</label>
                                        <select className="form-input" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1'}} value={formData.hari} onChange={e => setFormData({...formData, hari: e.target.value})}>
                                            {hariOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-text" style={{display:'block', marginBottom:5, fontWeight:600}}>Ruangan</label>
                                        <select className="form-input" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1'}} required value={formData.ruangan_id} onChange={e => setFormData({...formData, ruangan_id: e.target.value})}>
                                            <option value="">-- Pilih --</option>
                                            {ruangan.map(r => <option key={r.ruangan_id} value={r.ruangan_id}>{r.nama_ruangan}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginTop:15}}>
                                    <div><label className="label-text" style={{display:'block', marginBottom:5, fontWeight:600}}>Jam Mulai</label><input type="time" className="form-input" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1'}} required value={formData.jam_mulai} onChange={e => setFormData({...formData, jam_mulai: e.target.value})}/></div>
                                    <div><label className="label-text" style={{display:'block', marginBottom:5, fontWeight:600}}>Jam Selesai</label><input type="time" className="form-input" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1'}} required value={formData.jam_selesai} onChange={e => setFormData({...formData, jam_selesai: e.target.value})}/></div>
                                </div>
                                <div style={{marginTop:15}}><label className="label-text" style={{display:'block', marginBottom:5, fontWeight:600}}>Mata Kuliah</label><input type="text" className="form-input" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1'}} required value={formData.mata_kuliah} onChange={e => setFormData({...formData, mata_kuliah: e.target.value})}/></div>
                                <div style={{marginTop:15, marginBottom:25}}><label className="label-text" style={{display:'block', marginBottom:5, fontWeight:600}}>Nama Dosen</label><input type="text" className="form-input" style={{width:'100%', padding:10, borderRadius:6, border:'1px solid #cbd5e1'}} required value={formData.nama_dosen} onChange={e => setFormData({...formData, nama_dosen: e.target.value})}/></div>
                                <div className="modal-actions" style={{display:'flex', justifyContent:'flex-end', gap:10}}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{padding:'10px 20px', borderRadius:8, background:'white', border:'1px solid #cbd5e1', cursor:'pointer'}}>Batal</button>
                                    <button type="submit" className="btn btn-primary" style={{padding:'10px 20px', borderRadius:8, background:'#0ea5e9', color:'white', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8}}><Save size={18}/> Simpan</button>
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

export default KelolaJadwal;