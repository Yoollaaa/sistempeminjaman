import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';

const KelolaRuangan = () => {
    const [ruangan, setRuangan] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, nama_ruangan: '', kapasitas: '', keterangan: '' });
    const [toast, setToast] = useState({ message: '', type: '' });

    useEffect(() => { loadRooms(); }, []);

    const loadRooms = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/ruangan');
            setRuangan(resp.data.data || []);
        } catch (e) {
            setToast({ message: 'Gagal memuat data ruangan.', type: 'error' });
        } finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) await api.put(`/ruangan/${formData.id}`, formData);
            else await api.post('/ruangan', formData);
            
            setToast({ message: 'Data ruangan berhasil disimpan!', type: 'success' });
            setIsModalOpen(false);
            loadRooms();
        } catch (e) {
            setToast({ message: 'Gagal menyimpan data.', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin hapus ruangan ini?")) return;
        try {
            await api.delete(`/ruangan/${id}`);
            setToast({ message: 'Ruangan dihapus.', type: 'success' });
            loadRooms();
        } catch (e) {
            setToast({ message: 'Gagal menghapus.', type: 'error' });
        }
    };

    const openModal = (data = null) => {
        setFormData(data ? { id: data.id, nama_ruangan: data.nama_ruangan, kapasitas: data.kapasitas, keterangan: data.keterangan } 
                         : { id: null, nama_ruangan: '', kapasitas: '', keterangan: '' });
        setIsModalOpen(true);
    };

    return (
        <div className="app-layout">
            <SidebarAdmin />
            <div className="content-container">
                <div className="page-header">
                    <h1 className="page-title">Kelola Ruangan</h1>
                    <button onClick={() => openModal()} className="btn btn-primary"><Plus size={18}/> Tambah Ruangan</button>
                </div>

                <div className="card">
                    {loading ? <p>Memuat...</p> : (
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Nama Ruangan</th>
                                    <th>Kapasitas</th>
                                    <th>Fasilitas / Ket</th>
                                    <th className="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ruangan.map((r, idx) => (
                                    <tr key={idx}>
                                        <td style={{fontWeight:600}}>{r.nama_ruangan}</td>
                                        <td>{r.kapasitas} Orang</td>
                                        <td style={{color:'var(--secondary)'}}>{r.keterangan || '-'}</td>
                                        <td className="text-center">
                                            <button onClick={() => openModal(r)} className="btn" style={{color:'#0ea5e9', padding:5}}><Edit size={16}/></button>
                                            <button onClick={() => handleDelete(r.id)} className="btn" style={{color:'#ef4444', padding:5}}><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-box">
                            <h2>{formData.id ? 'Edit Ruangan' : 'Tambah Ruangan'}</h2>
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label className="label-text">Nama Ruangan</label>
                                    <input className="form-input" style={{width:'100%'}} value={formData.nama_ruangan} onChange={e=>setFormData({...formData, nama_ruangan:e.target.value})} required />
                                </div>
                                <div className="form-group" style={{marginTop:10}}>
                                    <label className="label-text">Kapasitas</label>
                                    <input type="number" className="form-input" style={{width:'100%'}} value={formData.kapasitas} onChange={e=>setFormData({...formData, kapasitas:e.target.value})} required />
                                </div>
                                <div className="form-group" style={{marginTop:10, marginBottom:20}}>
                                    <label className="label-text">Keterangan</label>
                                    <textarea className="form-input" style={{width:'100%'}} rows="3" value={formData.keterangan} onChange={e=>setFormData({...formData, keterangan:e.target.value})} />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn">Batal</button>
                                    <button type="submit" className="btn btn-primary"><Save size={18}/> Simpan</button>
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