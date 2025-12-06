import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarKajur from '../components/SidebarKajur';
import DashboardLayout from '../components/DashboardLayout';
import { 
    Clock, CheckCircle, Filter, User, Calendar, ArrowRight 
} from 'lucide-react';
import { THEME } from '../constants/theme';
import api from '../api';
import Toast from '../components/Toast';

const DashboardKajur = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, approved: 0 });
    const [toast, setToast] = useState({message:'', type:''});
    
    const user = JSON.parse(localStorage.getItem('user')) || { nama: 'Ketua Jurusan' };

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/peminjaman');
            const data = resp.data.data || [];
            setRequests(data);

            const pendingCount = data.filter(r => r.status === 'disetujui_admin').length;
            const approvedCount = data.filter(r => r.status === 'disetujui_kajur').length;

            setStats({ pending: pendingCount, approved: approvedCount });
        } catch (e) {
            console.error('Failed to load peminjaman', e);
            setToast({ message: e.response?.data?.message || 'Gagal memuat pengajuan. Periksa koneksi.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const incomingData = requests.filter(r => r.status === 'disetujui_admin');

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <DashboardLayout
            sidebar={<SidebarKajur />}
            title="Verifikasi Pengajuan"
            subtitle="Daftar permohonan yang telah divalidasi oleh Admin Lab"
            userInfo={user}
            showHeader={true}
            headerActions={
                <button
                    onClick={loadRequests}
                    style={{
                        padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
                        backgroundColor: THEME.colors.primary,
                        color: THEME.colors.white,
                        border: 'none',
                        borderRadius: THEME.radius.md,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: THEME.typography.fontFamily,
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = THEME.colors.primaryHover;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = THEME.colors.primary;
                    }}
                >
                    Perbarui
                </button>
            }
        >
            {/* Statistik Cepat */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: THEME.spacing.xl,
                marginBottom: THEME.spacing.xxl,
            }}>
                <div style={{
                    backgroundColor: THEME.colors.white,
                    border: `1px solid ${THEME.colors.border}`,
                    borderRadius: THEME.radius.lg,
                    padding: THEME.spacing.xl,
                    boxShadow: THEME.shadows.md,
                    display: 'flex',
                    alignItems: 'center',
                    gap: THEME.spacing.lg,
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60px',
                        height: '60px',
                        backgroundColor: THEME.colors.warningLight,
                        borderRadius: THEME.radius.md,
                        color: THEME.colors.warning,
                    }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: THEME.typography.h3.fontSize,
                            fontWeight: THEME.typography.h3.fontWeight,
                            margin: 0,
                            color: THEME.colors.darkText,
                        }}>
                            {stats.pending}
                        </h3>
                        <p style={{
                            fontSize: THEME.typography.bodySmall.fontSize,
                            color: THEME.colors.secondary,
                            margin: `${THEME.spacing.sm} 0 0 0`,
                        }}>
                            Perlu Persetujuan
                        </p>
                    </div>
                </div>
                
                <div style={{
                    backgroundColor: THEME.colors.white,
                    border: `1px solid ${THEME.colors.border}`,
                    borderRadius: THEME.radius.lg,
                    padding: THEME.spacing.xl,
                    boxShadow: THEME.shadows.md,
                    display: 'flex',
                    alignItems: 'center',
                    gap: THEME.spacing.lg,
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60px',
                        height: '60px',
                        backgroundColor: THEME.colors.successLight,
                        borderRadius: THEME.radius.md,
                        color: THEME.colors.success,
                    }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h3 style={{
                            fontSize: THEME.typography.h3.fontSize,
                            fontWeight: THEME.typography.h3.fontWeight,
                            margin: 0,
                            color: THEME.colors.darkText,
                        }}>
                            {stats.approved}
                        </h3>
                        <p style={{
                            fontSize: THEME.typography.bodySmall.fontSize,
                            color: THEME.colors.secondary,
                            margin: `${THEME.spacing.sm} 0 0 0`,
                        }}>
                            Disetujui Total
                        </p>
                    </div>
                </div>
            </div>

            {/* List Pengajuan */}
            <h3 style={{
                marginBottom: THEME.spacing.lg,
                color: THEME.colors.darkText,
                display: 'flex',
                alignItems: 'center',
                gap: THEME.spacing.md,
                fontSize: THEME.typography.h4.fontSize,
            }}>
                <Filter size={20} /> Menunggu Tindakan Anda
            </h3>
            
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: THEME.spacing.lg,
            }}>
                {loading ? (
                    <div style={{
                        textAlign: 'center',
                        padding: THEME.spacing.xxl,
                        color: THEME.colors.secondary,
                        backgroundColor: THEME.colors.white,
                        borderRadius: THEME.radius.lg,
                    }}>
                        Memuat data...
                    </div>
                ) : incomingData.length > 0 ? (
                    incomingData.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                backgroundColor: THEME.colors.white,
                                border: `1px solid ${THEME.colors.border}`,
                                borderRadius: THEME.radius.lg,
                                padding: THEME.spacing.xl,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: THEME.shadows.md,
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = THEME.shadows.lg;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = THEME.shadows.md;
                            }}
                        >
                            {/* Kiri: Info Utama */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: THEME.spacing.lg,
                                flex: 1,
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: THEME.colors.primaryLight,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    color: THEME.colors.primary,
                                    fontSize: THEME.typography.button.fontSize,
                                }}>
                                    {item.nama_mahasiswa ? item.nama_mahasiswa.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div style={{flex: 1}}>
                                    <h4 style={{
                                        margin: '0 0 4px 0',
                                        fontSize: THEME.typography.h5.fontSize,
                                        fontWeight: THEME.typography.h5.fontWeight,
                                        color: THEME.colors.darkText,
                                    }}>
                                        {item.keperluan}
                                    </h4>
                                    <div style={{
                                        display: 'flex',
                                        gap: THEME.spacing.lg,
                                        fontSize: THEME.typography.bodySmall.fontSize,
                                        color: THEME.colors.secondary,
                                    }}>
                                        <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                            <User size={14} /> {item.nama_mahasiswa}
                                        </span>
                                        <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                            <Calendar size={14} /> {formatDate(item.tanggal_pinjam)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Kanan: Ruangan & Tombol */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: THEME.spacing.xl,
                                textAlign: 'right',
                            }}>
                                <div>
                                    <div style={{
                                        fontWeight: 600,
                                        color: THEME.colors.darkText,
                                    }}>
                                        {item.nama_ruangan}
                                    </div>
                                    <div style={{
                                        fontSize: THEME.typography.bodySmall.fontSize,
                                        color: THEME.colors.secondary,
                                    }}>
                                        {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/kajur/detail/${item.id}`, { state: { data: item } })}
                                    style={{
                                        padding: `${THEME.spacing.md} ${THEME.spacing.lg}`,
                                        backgroundColor: THEME.colors.primary,
                                        color: THEME.colors.white,
                                        border: 'none',
                                        borderRadius: THEME.radius.md,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontFamily: THEME.typography.fontFamily,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: THEME.spacing.sm,
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = THEME.colors.primaryHover;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = THEME.colors.primary;
                                    }}
                                >
                                    Periksa <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: THEME.spacing.xxl,
                        color: THEME.colors.secondary,
                        backgroundColor: THEME.colors.white,
                        borderRadius: THEME.radius.lg,
                    }}>
                        <CheckCircle size={40} style={{marginBottom: THEME.spacing.lg, opacity: 0.5}} />
                        <p>Tidak ada pengajuan yang perlu diverifikasi saat ini.</p>
                    </div>
                )}
            </div>

            {toast.message && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast({message:'', type:''})} />
            )}
        </DashboardLayout>
    );
};

export default DashboardKajur;