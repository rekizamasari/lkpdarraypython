# 🐍 LKPD Interaktif — Koding & Kecerdasan Artifisial Kelas X

LKPD (Lembar Kerja Peserta Didik) interaktif berbasis web untuk materi **Array 1 Dimensi, Array 2 Dimensi, dan Rekursif**, mencakup:

| Modul | Topik | Studi kasus |
|---|---|---|
| M1 | Array 1 Dimensi (List) | Mengolah nilai siswa |
| M2 | Array 2 Dimensi (Matriks) | Tabel nilai siswa × tugas |
| M3 | Rekursif | Faktorial, Fibonacci, ReursionError |
| M4 | **Visualisasi Data** | Grafik interaktif dari hasil pengolahan Python |
| M5 | **Algoritma Pencarian Jalur** | Labirin 2D + rekursi (backtracking) |

Setiap modul: 🎯 Tujuan → 📖 Materi → 🧭 Langkah berkode (dijalankan di browser) → 🧪 Praktik (dinilai otomatis 0–100) → 📝 Kuis (auto-grading).

---

## 🏗️ Arsitektur

- **Frontend**: HTML + CSS + vanilla JS (tanpa build step/server)
- **Python di browser**: [Pyodide](https://pyodide.org) — kode Python siswa dijalankan langsung di browser, tanpa server Python
- **Grafik**: Chart.js
- **Database + Auth**: [Supabase](https://supabase.com) — tabel `profiles`, `kelas`, `progress`, `submissions`, `quiz_results` + Realtime untuk dashboard guru

```
index.html     → login + daftar akun siswa
siswa.html     → dashboard siswa (5 modul LKPD)
guru.html      → dashboard guru (analitik + rekap nilai)
sql/schema.sql → struktur database + trigger + RLS
js/data.js     → seluruh materi, kode praktik, dan kunci kuis
```

---

## ⚙️ Setup (± 15 menit)

### 1. Buat proyek Supabase
1. Buka [supabase.com](https://supabase.com), daftar/buat proyek baru.
2. Menu **SQL Editor** → tempel seluruh isi `sql/schema.sql` → **Run**.
3. Aktifkan Realtime (masih di SQL Editor):
   ```sql
   alter publication supabase_realtime add table public.progress;
   alter publication supabase_realtime add table public.submissions;
   alter publication supabase_realtime add table public.quiz_results;
   ```

### 2. Isi kredensial
Buka `js/supabase-config.js`, ganti dengan milik proyek Anda:
```js
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi..."; // anon public key (Settings → API)
```

### 3. Jalankan aplikasi
Cukup lucu: file web statis — bukan perlu "build". Jalankan dengan HTTP lokal agar browser tidak membatasi CDN:

```bash
# cara termudah
python -m http.server 8000
# lalu buka http://localhost:8000/index.html
```
(atau gunakan ekstensi *Live Server* VS Code)

### 4. Buat akun
- **Siswa**: klik *Daftar sebagai siswa* di halaman login (pilih kelas X-A/X-B).
- **Guru**: daftarkan via **Authentication → Users → Add user** di dashboard Supabase (email + password, konfirmasi langsung), lalu set rolenya via SQL Editor:
  ```sql
  update public.profiles
  set role = 'guru', nama = 'Nama Guru Anda'
  where id = '<UUID user yang baru dibuat>';
  ```
  Setelah itu login dengan email tersebut → otomatis masuk ke dashboard guru.

---

## 📊 Penilaian otomatis

- **Praktik**: kode Python siswa dijalankan di Pyodide; setiap *kriteria* (regex output/kode) memberi poin; total 0–100 → disimpan ke tabel `submissions`.
- **Kuis**: pilihan ganda, langsung dihitung → tabel `quiz_results`.
- **Progres langkah**: tabel `progress` (siswa menandai "saya pahami" di tiap langkah).
- **Rata-rata**: nilai akhir per modul = 50% praktik + 50% kuis.

## 📈 Dashboard Guru
- **Analitik**: jumlah siswa terfilter, yang sudah mulai, rata-rata kelas, modul paling sulit, grafik rata-rata per modul, dan berapa siswa sudah lulus praktik (≥70).
- **Nilai siswa**: matriks siswa × modul + unduh CSV (Excel).
- **Rincian**: 50 riwayat praktik/kuis terakhir.
- **Realtime**: saat siswa mengirim praktik/kuis, dashboard pil cukup otomatis (tanpa refresh).

## 💡 Catatan
- Kode siswa dijalankan **di browser masing-masing** (Pyodide), jadi tidak membebani server.
- CDN internet diperlukan (Supabase JS, Pyodide, Chart.js).
- Supabase *free tier* membatasi ukuran penagih — cukup untuk 1–3 kelas.
- Kunci anon (public) aman dipakai di frontend karena **Row Level Security** sudah aktif (`sql/schema.sql`).
