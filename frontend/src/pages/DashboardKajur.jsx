import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../api';
import Toast from '../components/Toast';

const DashboardKajur = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  
  // Filter & pagination state
  const [statusFilter, setStatusFilter] = useState('disetujui_admin'); // Default: show approved by admin
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    // Apply filter
    let filtered = requests;
    if (statusFilter) {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [requests, statusFilter]);

  const loadRequests = async () => {
    setLoadingRequests(true);
    try {
      const resp = await api.get('/peminjaman');
      setRequests(resp.data.data || []);
    } catch (e) {
      console.error('Failed to load peminjaman', e?.response || e.message || e);
      setRequests([]);
      setToast({ message: 'Gagal memuat daftar pengajuan.', type: 'error' });
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/peminjaman/${id}/approve-kajur`);
      setToast({ message: 'Pengajuan disetujui oleh ketua jurusan.', type: 'success' });
      setDetailId(null);
      await loadRequests();
    } catch (e) {
      console.error('Approve failed', e?.response || e.message || e);
      setToast({ message: e?.response?.data?.message || 'Gagal menyetujui pengajuan.', type: 'error' });
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/peminjaman/${id}/reject-kajur`);
      setToast({ message: 'Pengajuan ditolak oleh ketua jurusan.', type: 'success' });
      setDetailId(null);
      await loadRequests();
    } catch (e) {
      console.error('Reject failed', e?.response || e.message || e);
      setToast({ message: e?.response?.data?.message || 'Gagal menolak pengajuan.', type: 'error' });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIdx, startIdx + itemsPerPage);
  
  // Status badge colors
  const statusColors = {
    diajukan: '#fbbf24',
    disetujui_admin: '#10b981',
    ditolak_admin: '#ef4444',
    disetujui_kajur: '#06b6d4',
    ditolak_kajur: '#f97316',
  };

  const statusLabels = {
    diajukan: 'Diajukan',
    disetujui_admin: 'Disetujui Admin',
    ditolak_admin: 'Ditolak Admin',
    disetujui_kajur: 'Disetujui Kajur',
    ditolak_kajur: 'Ditolak Kajur',
  };

  const detailItem = requests.find(r => r.id === detailId);

  return (
    <div style={{padding: 24, fontFamily: 'Inter, sans-serif', maxWidth: 1200, margin: '0 auto'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{background: '#10b981', color: 'white', width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <BookOpen size={22} />
        </div>
        <div>
          <h1 style={{margin: 0}}>Dashboard Ketua Jurusan</h1>
          <div style={{color: '#64748b', marginTop: 6}}>Tinjau dan verifikasi pengajuan peminjaman ruangan</div>
        </div>
      </div>

      <div style={{background: 'white', borderRadius: 10, padding: 16, border: '1px solid #e6eef6', marginTop: 22}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
          <h3 style={{margin: 0}}>Pengajuan Peminjaman ({filteredRequests.length})</h3>
          <button onClick={loadRequests} disabled={loadingRequests} style={{padding: '6px 12px', borderRadius: 8, background: '#0284c7', color: 'white', border:'none', cursor: loadingRequests ? 'not-allowed' : 'pointer'}}>
            {loadingRequests ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Status Filter */}
        <div style={{marginBottom: 14}}>
          <label style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 6}}>Filter Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', width: '100%'}}>
            <option value="">Semua Status</option>
            <option value="diajukan">Diajukan</option>
            <option value="disetujui_admin">Disetujui Admin (Menunggu Verifikasi Kajur)</option>
            <option value="ditolak_admin">Ditolak Admin</option>
            <option value="disetujui_kajur">Disetujui Kajur (Final Approved)</option>
            <option value="ditolak_kajur">Ditolak Kajur</option>
          </select>
        </div>

        {/* List Items */}
        {loadingRequests ? (
          <div>Memuat pengajuan...</div>
        ) : paginatedRequests.length === 0 ? (
          <div style={{color: '#64748b', padding: '20px', textAlign: 'center'}}>Tidak ada pengajuan dengan filter yang dipilih.</div>
        ) : (
          <div style={{display: 'grid', gap: 10}}>
            {paginatedRequests.map(r => (
              <div key={r.id} onClick={() => setDetailId(r.id)} style={{padding: 12, borderRadius: 8, border: '1px solid #f1f5f9', cursor: 'pointer', background: detailId === r.id ? '#f0f9ff' : 'white', transition: 'all 0.2s'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div style={{flex: 1}}>
                    <div style={{fontWeight:700}}>{r.keperluan}</div>
                    <div style={{fontSize: '0.85rem', color: '#64748b', marginTop: 4}}>
                      <strong>{r.nama_ruangan}</strong> • {r.tanggal_pinjam} {r.jam_mulai}–{r.jam_selesai}
                    </div>
                    <div style={{fontSize: '0.8rem', color: '#94a3b8', marginTop: 2}}>{r.nama_mahasiswa} • {r.mahasiswa_email}</div>
                  </div>
                  <div style={{background: statusColors[r.status], color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700}}>
                    {statusLabels[r.status]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 14}}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{padding: '6px 8px', background: '#e5e7eb', border: 'none', borderRadius: 6, cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}}>
              <ChevronUp size={16} style={{transform: 'rotate(90deg)'}} />
            </button>
            <span style={{fontSize: '0.9rem'}}>Halaman {currentPage} dari {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{padding: '6px 8px', background: '#e5e7eb', border: 'none', borderRadius: 6, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'}}>
              <ChevronDown size={16} style={{transform: 'rotate(90deg)'}} />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000}}>
          <div style={{background: 'white', borderRadius: 12, padding: 24, maxWidth: 500, width: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(2,6,23,0.2)'}}>
            <h2 style={{margin: '0 0 16px 0'}}>Detail Pengajuan</h2>
            <div style={{display: 'grid', gap: 12, marginBottom: 16}}>
              <div>
                <label style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Keperluan</label>
                <div style={{marginTop: 4}}>{detailItem.keperluan}</div>
              </div>
              <div>
                <label style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Peminjam</label>
                <div style={{marginTop: 4}}>{detailItem.nama_mahasiswa} ({detailItem.mahasiswa_email})</div>
              </div>
              <div>
                <label style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Ruangan</label>
                <div style={{marginTop: 4}}>{detailItem.nama_ruangan}</div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
                <div>
                  <label style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Tanggal</label>
                  <div style={{marginTop: 4}}>{detailItem.tanggal_pinjam}</div>
                </div>
                <div>
                  <label style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Jam</label>
                  <div style={{marginTop: 4}}>{detailItem.jam_mulai}–{detailItem.jam_selesai}</div>
                </div>
              </div>
              <div>
                <label style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Status</label>
                <div style={{marginTop: 4, display: 'inline-block', background: statusColors[detailItem.status], color: 'white', padding: '6px 12px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 700}}>
                  {statusLabels[detailItem.status]}
                </div>
              </div>
              {detailItem.catatan_admin && (
                <div>
                  <label style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Catatan Admin</label>
                  <div style={{marginTop: 4, fontSize: '0.9rem', color: '#333'}}>{detailItem.catatan_admin}</div>
                </div>
              )}
              {detailItem.catatan_kajur && (
                <div>
                  <label style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600}}>Catatan Kajur</label>
                  <div style={{marginTop: 4, fontSize: '0.9rem', color: '#333'}}>{detailItem.catatan_kajur}</div>
                </div>
              )}
            </div>
            <div style={{display: 'flex', gap: 8, justifyContent: 'flex-end'}}>
              <button onClick={() => setDetailId(null)} style={{padding: '8px 14px', borderRadius: 8, background: '#e5e7eb', border: 'none', cursor: 'pointer'}}>Tutup</button>
              {detailItem.status === 'disetujui_admin' && (
                <>
                  <button onClick={() => handleApprove(detailItem.id)} style={{padding: '8px 14px', borderRadius: 8, background: '#10b981', color: 'white', border: 'none', cursor: 'pointer'}}>Setujui</button>
                  <button onClick={() => handleReject(detailItem.id)} style={{padding: '8px 14px', borderRadius: 8, background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer'}}>Tolak</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />}
    </div>
  );
};

export default DashboardKajur;
