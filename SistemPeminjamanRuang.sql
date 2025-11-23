CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('mahasiswa','admin','ketua_jurusan')) NOT NULL,
    nim VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ruangan (
    ruangan_id SERIAL PRIMARY KEY,
    nama_ruangan VARCHAR(100) NOT NULL,
    kapasitas INT,
    lokasi VARCHAR(100),
    keterangan TEXT
);

CREATE TABLE jadwal_kuliah (
    jadwal_id SERIAL PRIMARY KEY,
    ruangan_id INT REFERENCES ruangan(ruangan_id) ON DELETE CASCADE,
    hari VARCHAR(10),
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    matakuliah VARCHAR(100),
    keterangan TEXT
);

CREATE TABLE peminjaman (
    peminjaman_id SERIAL PRIMARY KEY,
    mahasiswa_id INT REFERENCES users(user_id),
    ruangan_id INT REFERENCES ruangan(ruangan_id),
    tanggal_pinjam DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    keperluan TEXT,
    status VARCHAR(30) CHECK (
        status IN ('diajukan','diterima_admin','ditolak_admin','disetujui_kajur','ditolak_kajur')
    ) DEFAULT 'diajukan',
    catatan_penolakan TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verifikasi_admin (
    verifikasi_id SERIAL PRIMARY KEY,
    peminjaman_id INT REFERENCES peminjaman(peminjaman_id) ON DELETE CASCADE,
    admin_id INT REFERENCES users(user_id),
    status_admin VARCHAR(10) CHECK (status_admin IN ('diterima','ditolak')),
    catatan TEXT,
    waktu_verifikasi TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verifikasi_kajur (
    verifikasi_kajur_id SERIAL PRIMARY KEY,
    peminjaman_id INT REFERENCES peminjaman(peminjaman_id) ON DELETE CASCADE,
    kajur_id INT REFERENCES users(user_id),
    status_kajur VARCHAR(10) CHECK (status_kajur IN ('disetujui','ditolak')),
    catatan TEXT,
    waktu_verifikasi TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifikasi (
    notifikasi_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    pesan TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE surat_persetujuan (
    surat_id SERIAL PRIMARY KEY,
    peminjaman_id INT REFERENCES peminjaman(peminjaman_id) ON DELETE CASCADE,
    nomor_surat VARCHAR(50),
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION cek_bentrok_peminjaman()
RETURNS TRIGGER AS $$
DECLARE
    ada_bentrok INTEGER;
    ada_bentrok_kuliah INTEGER;
BEGIN
    SELECT COUNT(*) INTO ada_bentrok_kuliah
    FROM jadwal_kuliah
    WHERE ruangan_id = NEW.ruangan_id
      AND (NEW.jam_mulai < jam_selesai AND NEW.jam_selesai > jam_mulai)
      AND (to_char(NEW.tanggal_pinjam, 'Day') ILIKE hari || '%');

    IF ada_bentrok_kuliah > 0 THEN
        RAISE EXCEPTION 'Peminjaman bentrok dengan jadwal kuliah.';
    END IF;

    SELECT COUNT(*) INTO ada_bentrok
    FROM peminjaman
    WHERE ruangan_id = NEW.ruangan_id
      AND tanggal_pinjam = NEW.tanggal_pinjam
      AND peminjaman_id <> NEW.peminjaman_id
      AND status NOT IN ('ditolak_admin','ditolak_kajur')
      AND (NEW.jam_mulai < jam_selesai AND NEW.jam_selesai > jam_mulai);

    IF ada_bentrok > 0 THEN
        RAISE EXCEPTION 'Peminjaman bentrok dengan peminjaman lain.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cek_bentrok
BEFORE INSERT OR UPDATE ON peminjaman
FOR EACH ROW
EXECUTE FUNCTION cek_bentrok_peminjaman();
