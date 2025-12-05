import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import { Plus, Trash2, Calendar, Save } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';

const KelolaJadwal = () => {
    const [jadwal, setJadwal] = useState([]);
    const [ruangan, setRuangan] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        ruangan_id: '', hari: 'Senin', jam_mulai: '', jam_selesai: '', mata_kuliah: '', nama_dosen: ''
    });
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
            setToast({ message: 'Gagal memuat data jadwal.', type: 'error' });
        } finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jadwal', formData);
            setToast({ message: 'Jadwal kuliah ditambahkan. Ruangan akan otomatis terblokir di jam ini.', type: 'success' });
            setIsModalOpen(false);
            setFormData({ ruangan_id: '', hari: 'Senin', jam_mulai: '', jam_selesai: '', mata_kuliah: '', nama_dosen: '' });
            loadInitialData();
        } catch (e) {
            setToast({ message: 'Gagal menyimpan (Mungkin bentrok).', type: 'error' });
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
        const room = ruangan.find(r => r.id == id);
        return room ? room.nama_ruangan : '-';
    };

    return (
        <div className="app-layout">
            <SidebarAdmin />
            <div className="content-container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Master Jadwal Kuliah</h1>
                        <p className="page-subtitle">Ruangan akan otomatis berstatus "Terpakai" pada jam yang diinput disini.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary"><Plus size={18}/> Tambah Jadwal</button>
                </div>

                <div className="card">
                    {loading ? <p>Memuat...</p> : jadwal.length === 0 ? <p className="text-center">Belum ada jadwal rutin.</p> : (
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Hari & Ruangan</th>
                                    <th>Waktu</th>
                                    <th>Mata Kuliah</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jadwal.sort((a,b) => hariOptions.indexOf(a.hari) - hariOptions.indexOf(b.hari)).map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <span className="badge" style={{background:'#e0f2fe', color:'#0284c7', marginRight:8}}>{item.hari}</span>
                                            <b>{getRoomName(item.ruangan_id)}</b>
                                        </td>
                                        <td>{item.jam_mulai.slice(0,5)} - {item.jam_selesai.slice(0,5)}</td>
                                        <td>
                                            <div>{item.mata_kuliah}</div>
                                            <small style={{color:'var(--secondary)'}}>{item.nama_dosen}</small>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(item.id)} className="btn" style={{color:'#ef4444'}}><Trash2 size={16}/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-box" style={{width: 500}}>
                            <h2 style={{marginTop:0}}>Input Jadwal Rutin</h2>
                            <form onSubmit={handleSave}>
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15}}>
                                    <div>
                                        <label className="label-text">Hari</label>
                                        <select className="form-input" style={{width:'100%'}} value={formData.hari} onChange={e => setFormData({...formData, hari: e.target.value})}>
                                            {hariOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label-text">Ruangan</label>
                                        <select className="form-input" style={{width:'100%'}} required value={formData.ruangan_id} onChange={e => setFormData({...formData, ruangan_id: e.target.value})}>
                                            <option value="">-- Pilih --</option>
                                            {ruangan.map(r => <option key={r.id} value={r.id}>{r.nama_ruangan}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:15, marginTop:10}}>
                                    <div><label className="label-text">Jam Mulai</label><input type="time" className="form-input" style={{width:'100%'}} required value={formData.jam_mulai} onChange={e => setFormData({...formData, jam_mulai: e.target.value})}/></div>
                                    <div><label className="label-text">Jam Selesai</label><input type="time" className="form-input" style={{width:'100%'}} required value={formData.jam_selesai} onChange={e => setFormData({...formData, jam_selesai: e.target.value})}/></div>
                                </div>
                                <div style={{marginTop:10}}><label className="label-text">Mata Kuliah</label><input type="text" className="form-input" style={{width:'100%'}} required value={formData.mata_kuliah} onChange={e => setFormData({...formData, mata_kuliah: e.target.value})}/></div>
                                <div style={{marginTop:10, marginBottom:20}}><label className="label-text">Dosen</label><input type="text" className="form-input" style={{width:'100%'}} required value={formData.nama_dosen} onChange={e => setFormData({...formData, nama_dosen: e.target.value})}/></div>
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

export default KelolaJadwal;