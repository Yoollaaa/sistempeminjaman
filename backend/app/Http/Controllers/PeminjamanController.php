<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Peminjaman;
use App\Models\Ruangan;
use Carbon\Carbon;

class PeminjamanController extends Controller
{
    /**
     * List semua pengajuan peminjaman (untuk admin)
     */
    public function index(Request $request)
    {
        $query = Peminjaman::with(['mahasiswa', 'ruangan'])->orderBy('tanggal_pinjam', 'desc')->orderBy('jam_mulai', 'asc');

        // Filter by status if provided
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $list = $query->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'mahasiswa_id' => $p->mahasiswa_id,
                'nama_mahasiswa' => $p->mahasiswa->nama ?? '—',
                'mahasiswa_email' => $p->mahasiswa->email ?? '—',
                'ruangan_id' => $p->ruangan_id,
                'nama_ruangan' => $p->ruangan->nama_ruangan ?? '—',
                'tanggal_pinjam' => $p->tanggal_pinjam,
                'jam_mulai' => $p->jam_mulai,
                'jam_selesai' => $p->jam_selesai,
                'keperluan' => $p->keperluan,
                'status' => $p->status,
                'catatan_admin' => $p->catatan_admin,
                'catatan_kajur' => $p->catatan_kajur,
                'created_at' => $p->created_at,
            ];
        });

        return response()->json(['message' => 'Daftar peminjaman', 'data' => $list], 200);
    }

    /**
     * Approve pengajuan (admin only)
     */
    public function approve(Request $request, $id)
    {
        // Check role: only admin can approve
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Hanya admin yang dapat menyetujui pengajuan.'], 403);
        }

        $peminjaman = Peminjaman::find($id);
        if (!$peminjaman) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan.'], 404);
        }

        $peminjaman->update([
            'status' => 'disetujui_admin',
            'catatan_admin' => $request->input('catatan', null),
        ]);

        return response()->json(['message' => 'Pengajuan berhasil disetujui oleh admin.', 'data' => $peminjaman], 200);
    }

    /**
     * Reject pengajuan (admin only)
     */
    public function reject(Request $request, $id)
    {
        // Check role: only admin can reject
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Hanya admin yang dapat menolak pengajuan.'], 403);
        }

        $peminjaman = Peminjaman::find($id);
        if (!$peminjaman) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan.'], 404);
        }

        $peminjaman->update([
            'status' => 'ditolak_admin',
            'catatan_admin' => $request->input('catatan', ''),
        ]);

        return response()->json(['message' => 'Pengajuan berhasil ditolak oleh admin.', 'data' => $peminjaman], 200);
    }

    /**
     * Approve pengajuan (kajur only) - hanya bisa approve yang sudah disetujui_admin
     */
    public function approveKajur(Request $request, $id)
    {
        // Check role: only kajur can approve
        if (Auth::user()->role !== 'ketua_jurusan') {
            return response()->json(['message' => 'Hanya ketua jurusan yang dapat menyetujui pengajuan.'], 403);
        }

        $peminjaman = Peminjaman::find($id);
        if (!$peminjaman) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan.'], 404);
        }

        // Kajur hanya bisa approve yang sudah disetujui admin
        if ($peminjaman->status !== 'disetujui_admin') {
            return response()->json(['message' => 'Pengajuan harus disetujui admin terlebih dahulu.'], 409);
        }

        $peminjaman->update([
            'status' => 'disetujui_kajur',
            'catatan_kajur' => $request->input('catatan', null),
        ]);

        return response()->json(['message' => 'Pengajuan berhasil disetujui oleh ketua jurusan.', 'data' => $peminjaman], 200);
    }

    /**
     * Reject pengajuan (kajur only)
     */
    public function rejectKajur(Request $request, $id)
    {
        // Check role: only kajur can reject
        if (Auth::user()->role !== 'ketua_jurusan') {
            return response()->json(['message' => 'Hanya ketua jurusan yang dapat menolak pengajuan.'], 403);
        }

        $peminjaman = Peminjaman::find($id);
        if (!$peminjaman) {
            return response()->json(['message' => 'Pengajuan tidak ditemukan.'], 404);
        }

        // Kajur dapat reject yang sudah disetujui admin
        if (!in_array($peminjaman->status, ['disetujui_admin', 'disetujui_kajur'])) {
            return response()->json(['message' => 'Hanya bisa menolak pengajuan yang sudah disetujui admin.'], 409);
        }

        $peminjaman->update([
            'status' => 'ditolak_kajur',
            'catatan_kajur' => $request->input('catatan', ''),
        ]);

        return response()->json(['message' => 'Pengajuan berhasil ditolak oleh ketua jurusan.', 'data' => $peminjaman], 200);
    }

    /**
     * Menyimpan pengajuan peminjaman baru dari Frontend.
     */
    public function store(Request $request)
    {
        // 1. Validasi Input (KF 4: Keperluan, Waktu)
        $validator = Validator::make($request->all(), [
            'ruangan_id' => 'required|exists:ruangan,ruangan_id',
            'tanggal_pinjam' => 'required|date|after_or_equal:today',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'keperluan' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        // 2. LOGIKA CEK BENTROK (CRUCIAL!)
        $isConflict = Peminjaman::where('ruangan_id', $request->ruangan_id)
            ->where('tanggal_pinjam', $request->tanggal_pinjam)
            ->whereNotIn('status', ['ditolak_admin', 'ditolak_kajur'])
            ->where(function ($query) use ($request) {
                $query->where('jam_mulai', '<', $request->jam_selesai)
                      ->where('jam_selesai', '>', $request->jam_mulai);
            })
            ->exists();

        if ($isConflict) {
            return response()->json([
                'message' => 'Gagal mengajukan. Ruangan sudah terisi atau bentrok pada jam tersebut.'
            ], 409);
        }
        
        // 3. Simpan Data Peminjaman
        $mahasiswaId = Auth::user()->user_id;

        $peminjaman = Peminjaman::create([
            'mahasiswa_id' => $mahasiswaId,
            'ruangan_id' => $request->ruangan_id,
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'keperluan' => $request->keperluan,
            'status' => 'diajukan',
        ]);

        // 4. Respon Sukses
        return response()->json([
            'message' => 'Pengajuan peminjaman berhasil dikirim! Menunggu verifikasi Admin.',
            'data' => $peminjaman
        ], 201);
    }

    /**
     * List pengajuan peminjaman mahasiswa yang sedang login
     */
    public function myPeminjaman(Request $request)
    {
        $mahasiswaId = Auth::user()->user_id;
        
        $query = Peminjaman::with(['mahasiswa', 'ruangan'])
            ->where('mahasiswa_id', $mahasiswaId)
            ->orderBy('tanggal_pinjam', 'desc')
            ->orderBy('jam_mulai', 'asc');

        // Filter by status if provided
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $list = $query->get()->map(function ($p) {
            return [
                'id' => $p->id,
                'mahasiswa_id' => $p->mahasiswa_id,
                'nama_mahasiswa' => $p->mahasiswa->nama ?? '—',
                'mahasiswa_email' => $p->mahasiswa->email ?? '—',
                'ruangan_id' => $p->ruangan_id,
                'nama_ruangan' => $p->ruangan->nama_ruangan ?? '—',
                'tanggal_pinjam' => $p->tanggal_pinjam,
                'jam_mulai' => $p->jam_mulai,
                'jam_selesai' => $p->jam_selesai,
                'keperluan' => $p->keperluan,
                'status' => $p->status,
                'catatan_admin' => $p->catatan_admin,
                'catatan_kajur' => $p->catatan_kajur,
                'created_at' => $p->created_at,
            ];
        });

        return response()->json(['message' => 'Daftar peminjaman Anda', 'data' => $list], 200);
    }

    /**
     * Statistik peminjaman untuk mahasiswa yang sedang login
     */
    public function statistics()
    {
        $mahasiswaId = Auth::user()->user_id;
        
        $peminjamanQuery = Peminjaman::where('mahasiswa_id', $mahasiswaId);
        
        $stats = [
            'total' => $peminjamanQuery->count(),
            'diajukan' => $peminjamanQuery->where('status', 'diajukan')->count(),
            'disetujui_admin' => $peminjamanQuery->where('status', 'disetujui_admin')->count(),
            'disetujui_kajur' => $peminjamanQuery->where('status', 'disetujui_kajur')->count(),
            'ditolak_admin' => $peminjamanQuery->where('status', 'ditolak_admin')->count(),
            'ditolak_kajur' => $peminjamanQuery->where('status', 'ditolak_kajur')->count(),
        ];
        
        // Agregasi status
        $stats['menunggu'] = $stats['diajukan'] + $stats['disetujui_admin'];
        $stats['disetujui'] = $stats['disetujui_kajur'];
        $stats['ditolak'] = $stats['ditolak_admin'] + $stats['ditolak_kajur'];

        return response()->json(['message' => 'Statistik peminjaman', 'data' => $stats], 200);
    }

    /**
     * Notifikasi untuk mahasiswa yang sedang login
     * Menampilkan perubahan status terbaru
     */
    public function notifications()
    {
        $mahasiswaId = Auth::user()->user_id;
        
        // Ambil 5 pengajuan terbaru dengan status berubah
        $peminjamanList = Peminjaman::with(['mahasiswa', 'ruangan'])
            ->where('mahasiswa_id', $mahasiswaId)
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get();
        
        $notifications = $peminjamanList->map(function ($p) {
            // Mapping status ke notification type
            $type = 'info';
            $title = 'Update Status';
            $message = 'Status pengajuan Anda telah diperbarui.';
            
            if ($p->status === 'disetujui_kajur') {
                $type = 'success';
                $title = 'Disetujui';
                $message = 'Pengajuan peminjaman ' . $p->ruangan->nama_ruangan . ' telah disetujui oleh Ketua Jurusan.';
            } elseif ($p->status === 'diajukan') {
                $type = 'info';
                $title = 'Verifikasi Admin';
                $message = 'Pengajuan peminjaman ' . $p->ruangan->nama_ruangan . ' sedang diperiksa.';
            } elseif ($p->status === 'disetujui_admin') {
                $type = 'info';
                $title = 'Diverifikasi Admin';
                $message = 'Pengajuan peminjaman ' . $p->ruangan->nama_ruangan . ' telah diverifikasi admin, menunggu persetujuan Kajur.';
            } elseif ($p->status === 'ditolak_admin' || $p->status === 'ditolak_kajur') {
                $type = 'error';
                $title = 'Ditolak';
                $message = 'Pengajuan peminjaman ' . $p->ruangan->nama_ruangan . ' telah ditolak.';
            }
            
            return [
                'id' => $p->id,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'ruangan' => $p->ruangan->nama_ruangan ?? '—',
                'tanggal_pinjam' => $p->tanggal_pinjam,
                'created_at' => $p->created_at,
                'updated_at' => $p->updated_at,
                'status' => $p->status,
            ];
        });

        return response()->json(['message' => 'Notifikasi peminjaman', 'data' => $notifications], 200);
    }
}
