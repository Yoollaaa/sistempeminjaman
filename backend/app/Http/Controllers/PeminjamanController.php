<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; 
use App\Models\Peminjaman;
use App\Models\Ruangan;
use Carbon\Carbon;

class PeminjamanController extends Controller
{
    // --- 1. DIGUNAKAN OLEH: Dashboard Admin, Verifikasi Admin, Live Monitoring ---
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Peminjaman::with(['mahasiswa', 'ruangan'])
            ->orderBy('tanggal_pinjam', 'desc')
            ->orderBy('jam_mulai', 'asc');

        // Filter berdasarkan role
        // Mahasiswa hanya melihat miliknya sendiri
        if ($user->role === 'mahasiswa') {
            $query->where('mahasiswa_id', $user->user_id);
        }
        // Admin dan Kajur bisa lihat semuanya

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $list = $query->get()->map(function ($p) {
            // Generate file URL if file exists
            $fileUrl = null;
            if ($p->file_surat) {
                $fileUrl = Storage::url($p->file_surat);
            }

            return [
                'id' => $p->id,
                'mahasiswa_id' => $p->mahasiswa_id,
                // PENGAMAN: Mencegah error jika mahasiswa dihapus
                'nama_mahasiswa' => $p->mahasiswa?->nama ?? 'Mahasiswa Terhapus', 
                'mahasiswa_email' => $p->mahasiswa?->email ?? '—',
                
                'ruangan_id' => $p->ruangan_id,
                // PENGAMAN: Mencegah error 500 jika ruangan dihapus
                'nama_ruangan' => $p->ruangan?->nama_ruangan ?? 'Ruangan Dihapus', 
                
                'tanggal_pinjam' => $p->tanggal_pinjam,
                'jam_mulai' => $p->jam_mulai,
                'jam_selesai' => $p->jam_selesai,
                'keperluan' => $p->keperluan,
                'status' => $p->status,
                'catatan_admin' => $p->catatan_admin,
                'catatan_kajur' => $p->catatan_kajur,
                'created_at' => $p->created_at,
                'file_surat' => $p->file_surat,
                'file_surat_url' => $fileUrl,
            ];
        });

        return response()->json(['message' => 'Daftar peminjaman', 'data' => $list], 200);
    }

    public function myPeminjaman(Request $request)
    {
        $mahasiswaId = Auth::user()->user_id; 

        $query = Peminjaman::with(['mahasiswa', 'ruangan'])
            ->where('mahasiswa_id', $mahasiswaId) 
            ->orderBy('created_at', 'desc');

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $list = $query->get()->map(function ($p) {
            // Generate file URL if file exists
            $fileUrl = null;
            if ($p->file_surat) {
                $fileUrl = Storage::url($p->file_surat);
            }

            return [
                'id' => $p->id,
                'mahasiswa_id' => $p->mahasiswa_id,
                'nama_mahasiswa' => $p->mahasiswa?->nama ?? '—', 
                'mahasiswa_email' => $p->mahasiswa?->email ?? '—',
                'ruangan_id' => $p->ruangan_id,
                'nama_ruangan' => $p->ruangan?->nama_ruangan ?? 'Ruangan Dihapus',
                'tanggal_pinjam' => $p->tanggal_pinjam,
                'jam_mulai' => $p->jam_mulai,
                'jam_selesai' => $p->jam_selesai,
                'keperluan' => $p->keperluan,
                'status' => $p->status,
                'catatan_admin' => $p->catatan_admin,
                'catatan_kajur' => $p->catatan_kajur,
                'created_at' => $p->created_at,
                'file_surat' => $p->file_surat,
                'file_surat_url' => $fileUrl,
            ];
        });

        return response()->json(['message' => 'Daftar peminjaman Anda', 'data' => $list], 200);
    }

    public function show($id)
    {
        $p = Peminjaman::with(['mahasiswa', 'ruangan'])->find($id);
        if (!$p) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan.'], 404);
        }
        
        $fileUrl = null;
        if ($p->file_surat) {
            $fileUrl = Storage::url($p->file_surat);
        }

        $data = [
            'id' => $p->id,
            'mahasiswa_id' => $p->mahasiswa_id,
            'nama_mahasiswa' => $p->mahasiswa?->nama ?? 'Mahasiswa Terhapus',
            'mahasiswa_email' => $p->mahasiswa?->email ?? '—',
            'mahasiswa_nim' => $p->mahasiswa?->nim ?? null,
            'ruangan_id' => $p->ruangan_id,
            'nama_ruangan' => $p->ruangan?->nama_ruangan ?? 'Ruangan Dihapus',
            'tanggal_pinjam' => $p->tanggal_pinjam,
            'jam_mulai' => $p->jam_mulai,
            'jam_selesai' => $p->jam_selesai,
            'keperluan' => $p->keperluan,
            'status' => $p->status,
            'catatan_admin' => $p->catatan_admin,
            'catatan_kajur' => $p->catatan_kajur,
            'created_at' => $p->created_at,
            'file_surat_url' => $fileUrl,
            'file_surat_path' => $p->file_surat, 
        ];

        return response()->json(['message' => 'Detail peminjaman', 'data' => $data], 200);
    }

    public function notifications()
    {
        $mahasiswaId = Auth::user()->user_id;
        
        $peminjamanList = Peminjaman::with(['ruangan']) 
            ->where('mahasiswa_id', $mahasiswaId)
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();
        
        $notifications = $peminjamanList->map(function ($p) {
            $type = 'info';
            $title = 'Update Status';
            $message = 'Status pengajuan Anda telah diperbarui.';
            
            $namaRuangan = $p->ruangan?->nama_ruangan ?? 'Ruangan Dihapus';

            if ($p->status === 'disetujui_kajur') {
                $type = 'success';
                $title = 'Disetujui';
                $message = 'Pengajuan peminjaman ' . $namaRuangan . ' telah disetujui.';
            } elseif ($p->status === 'diajukan') {
                $type = 'info';
                $title = 'Verifikasi Admin';
                $message = 'Pengajuan peminjaman ' . $namaRuangan . ' sedang diperiksa.';
            } elseif ($p->status === 'disetujui_admin') {
                $type = 'info';
                $title = 'Diverifikasi Admin';
                $message = 'Pengajuan ' . $namaRuangan . ' menunggu persetujuan Kajur.';
            } elseif ($p->status === 'ditolak_admin' || $p->status === 'ditolak_kajur') {
                $type = 'error';
                $title = 'Ditolak';
                $message = 'Pengajuan peminjaman ' . $namaRuangan . ' ditolak.';
            }
            
            return [
                'id' => $p->id,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'ruangan' => $namaRuangan,
                'tanggal_pinjam' => $p->tanggal_pinjam,
                'created_at' => $p->created_at,
                'updated_at' => $p->updated_at,
                'status' => $p->status,
            ];
        });

        return response()->json(['message' => 'Notifikasi peminjaman', 'data' => $notifications], 200);
    }
    
    public function statistics()
    {
        $mahasiswaId = Auth::user()->user_id;
        $peminjamanQuery = Peminjaman::where('mahasiswa_id', $mahasiswaId);
        
        $stats = [
            'total' => (clone $peminjamanQuery)->count(),
            'diajukan' => (clone $peminjamanQuery)->where('status', 'diajukan')->count(),
            'disetujui_admin' => (clone $peminjamanQuery)->where('status', 'disetujui_admin')->count(),
            'disetujui_kajur' => (clone $peminjamanQuery)->where('status', 'disetujui_kajur')->count(),
            'ditolak_admin' => (clone $peminjamanQuery)->where('status', 'ditolak_admin')->count(),
            'ditolak_kajur' => (clone $peminjamanQuery)->where('status', 'ditolak_kajur')->count(),
        ];
        
        $stats['menunggu'] = $stats['diajukan'] + $stats['disetujui_admin'];
        $stats['disetujui'] = $stats['disetujui_kajur'];
        $stats['ditolak'] = $stats['ditolak_admin'] + $stats['ditolak_kajur'];

        return response()->json(['message' => 'Statistik peminjaman', 'data' => $stats], 200);
    }

    public function approve(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $peminjaman = Peminjaman::find($id);
        if (!$peminjaman) return response()->json(['message' => 'Not found'], 404);

        $peminjaman->update([
            'status' => 'disetujui_admin',
            'catatan_admin' => $request->input('catatan', null),
        ]);
        return response()->json(['message' => 'Approved by admin', 'data' => $peminjaman], 200);
    }

    public function reject(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $peminjaman = Peminjaman::find($id);
        if (!$peminjaman) return response()->json(['message' => 'Not found'], 404);

        $peminjaman->update([
            'status' => 'ditolak_admin',
            'catatan_admin' => $request->input('catatan', ''),
        ]);
        return response()->json(['message' => 'Rejected by admin', 'data' => $peminjaman], 200);
    }

    public function approveKajur(Request $request, $id)
    {
        if (Auth::user()->role !== 'ketua_jurusan') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $peminjaman = Peminjaman::find($id);
        if (!$peminjaman) return response()->json(['message' => 'Not found'], 404);
        if ($peminjaman->status !== 'disetujui_admin') {
            return response()->json(['message' => 'Must be approved by admin first'], 409);
        }

        $peminjaman->update([
            'status' => 'disetujui_kajur',
            'catatan_kajur' => $request->input('catatan', null),
        ]);
        return response()->json(['message' => 'Approved by Kajur', 'data' => $peminjaman], 200);
    }

    public function rejectKajur(Request $request, $id)
    {
        if (Auth::user()->role !== 'ketua_jurusan') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $peminjaman = Peminjaman::find($id);
        if (!$peminjaman) return response()->json(['message' => 'Not found'], 404);
        if (!in_array($peminjaman->status, ['disetujui_admin', 'disetujui_kajur'])) {
            return response()->json(['message' => 'Must be approved by admin first'], 409);
        }

        $peminjaman->update([
            'status' => 'ditolak_kajur',
            'catatan_kajur' => $request->input('catatan', ''),
        ]);
        return response()->json(['message' => 'Rejected by Kajur', 'data' => $peminjaman], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ruangan_id' => 'required|exists:ruangan,ruangan_id',
            'tanggal_pinjam' => 'required|date|after_or_equal:today',
            'jam_mulai' => 'required|date_format:H:i', 
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'keperluan' => 'required|string|max:255',
            'file_surat' => 'nullable|mimes:pdf|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $isConflict = Peminjaman::where('ruangan_id', $request->ruangan_id)
            ->where('tanggal_pinjam', $request->tanggal_pinjam)
            ->whereNotIn('status', ['ditolak_admin', 'ditolak_kajur'])
            ->where(function ($query) use ($request) {
                $query->where('jam_mulai', '<', $request->jam_selesai)
                    ->where('jam_selesai', '>', $request->jam_mulai);
            })
            ->exists();

        if ($isConflict) {
            return response()->json(['message' => 'Ruangan bentrok.'], 409);
        }
        
        $filePath = null;
        if ($request->hasFile('file_surat')) {
            $filePath = $request->file('file_surat')->store('surat_peminjaman', 'public');
        }

        $peminjaman = Peminjaman::create([
            'mahasiswa_id' => Auth::user()->user_id,
            'ruangan_id' => $request->ruangan_id,
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'keperluan' => $request->keperluan,
            'status' => 'diajukan',
            'file_surat' => $filePath, 
        ]);

        return response()->json(['message' => 'Berhasil diajukan!', 'data' => $peminjaman], 201);
    }
}