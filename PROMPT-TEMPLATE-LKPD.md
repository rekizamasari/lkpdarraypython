# 📄 PROMPT INDUK — Template Pembuatan LKPD Interaktif (siap pakai untuk LKPD apa pun)

> **Cara pakai:** salin seluruh isi kotak di bawah ke AI agent (mis. OpenCode/Claude/Copilot Workspace), lalu ganti semua placeholder `{{...}}` (daftar lengkap ada di bagian akhir). Prompt ini sudah mencakup seluruh siklus pembuatan — dari direktori kosong sampai proyek live di GitHub Pages dengan database Supabase aktif — sehingga cukup SATU prompt untuk menyelesaikan proyek secara utuh.

---

## ═══════════════ MULAI PROMPT ═══════════════

Anda adalah senior full-stack developer ANDA juga seorang perancang pembelajaran (instructional designer) digital. Tugas Anda: **membangun dari nol ( direktori kosong ) sebuah aplikasi web "LKPD Interaktif" yang lengkap, live, dan siap dipakai kelas**, mengikuti spesifikasi di bawah TANPA bertanya balik kecuali benar-benar harus — buat keputusan terbaik sendiri dan dokumentasikan di README.

## 1. IDENTITAS PROYEK
- **Mata pelajaran**: {{MATA_PELAJARAN}} (contoh: Koding dan Kecerdasan Artifisial)
- **Jenjang/kelas**: {{KELAS}} (contoh: Kelas X)
- **Judul LKPD**: {{JUDUL_LKPD}}
- **Materi ({{JUMLAH_MODUL}} modul)**: {{DAFTAR_MATERI}} — contoh: array 1 dimensi, array 2 dimensi, rekursif, studi kasus visualisasi data, studi kasus algoritma pencarian jalur
- **Bahasa antarmuka & materi**: Indonesia
- **Bahasa pemrograman praktik siswa**: {{BAHASA_PRAKTIK}} (contoh: Python)
- **Estimasi akhir**: aplikasi live di URL GitHub Pages, guru & siswa bisa login, nilai tersimpan server.

## 2. ARSITEKTUR & TEKNOLOGI (WAJIB, jangan diubah)
- **Frontend murni statis**: HTML + CSS + vanilla JS. TANPA framework build (React/Vue dilarang). Tanpa server Node.
- **Struktur file**:
  ```
  index.html        → halaman login + daftar akun siswa
  siswa.html        → dashboard siswa
  guru.html         → dashboard guru
  css/style.css     → satu stylesheet tema gelap seluruh aplikasi
  js/supabase-config.js  → URL & anon key (placeholder terlihat jelas utk diganti)
  js/auth.js        → helper login/session + mapper NISN→email
  js/data.js        → SELURUH materi (modul, langkah, praktik, kuis, kuis akhir)
  js/siswa.js       → logika siswa (Pyodide, praktik, kuis, gerbang)
  js/guru.js        → logika guru (analitik, rekap, materi&kunci, realtime)
  sql/schema.sql    → skema database lengkap + RLS + trigger + seed, idempotent
  README.md         → panduan setup utk guru non-programmer
  .gitignore
  ```
- **Python di browser**: Pyodide (CDN `https://cdn.jsdelivr.net/pyodide/v0.25.1/full/`) — kode siswa dijalankan DI BROWSER masing-masing, ditangkap stdout via `pyodide.setStdout({batched})`.
- **Grafik**: Chart.js via CDN (untuk modul visualisasi bila ada).
- **Database & Auth**: Supabase (/auth/v1 signup+signin, REST untuk tabel, Realtime untuk dashboard guru).
- **Semua CORS-CDN**: Supabase JS `@supabase/supabase-js@2`, Chart.js `@4`.

## 3. DATABASE SUPABASE (sql/schema.sql — seluruh script idempotent, aman dijalankan ulang)
Tabel:
1. `kelas (id uuid pk default gen_random_uuid(), nama text unique not null, walikelas text, created_at)`
2. `profiles (id uuid pk → auth.users on delete cascade, nama text not null, nis text, role text check in ('guru','siswa'), kelas_id uuid → kelas, created_at)` + constraint unik `profiles_nis_unique unique (nis)` (NULL boleh berulang, dibuat via DO block exception `duplicate_object`)
3. `progress (id uuid pk, student_id → profiles cascade, module_id text, step_id text, status text default 'selesai', updated_at default now(), unique(student_id,module_id,step_id)) + index student_id`
4. `submissions (id uuid pk, student_id → profiles cascade, module_id text, kode text, output text, checks jsonb, nilai numeric default 0, created_at)` + index (student_id, module_id)
5. `quiz_results (id uuid pk, student_id → profiles cascade, module_id text, answers jsonb, benar int, total int, nilai numeric, created_at)` + index (student_id, module_id)

RLS + policy (semua `drop policy if exists` dulu, lalu `create policy`):
- `profiles`: select semua `authenticated`; insert/update sendiri `auth.uid() = id`.
- `kelas`: select **`using (true)`** (dibutuhkan dropdown pendaftaran SEBELUM login); tulis hanya guru (exists profiles.role='guru').
- `progress`, `submissions`, `quiz_results`: select `authenticated`; insert/update siswa hanya baris miliknya (`auth.uid() = student_id`).

Trigger:
```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nama, nis, role, kelas_id)
  select new.id,
    coalesce(new.raw_user_meta_data->>'nama', 'Tanpa Nama'),
    new.raw_user_meta_data->>'nis',
    coalesce(new.raw_user_meta_data->>'role', 'siswa'),
    (select k.id from public.kelas k
      where k.nama = coalesce(new.raw_user_meta_data->>'kelas', '{{KELAS_DEFAULT}}') limit 1)
  on conflict (id) do nothing;
  return new;
end; $$;
```
+ trigger `after insert on auth.users`. (`on conflict` TIDAK BOLEH di dalam sub-SELECT — kesalahan umum yang harus dihindari.)

Seed kelas: `{{DAFTAR_KELAS_AWAL}}` (contoh: X-A, X-B). Bagian komentar di akhir file menginstruksikan menjalankan:
`alter publication supabase_realtime add table public.progress;` (+ submissions, quiz_results).

## 4. AUTHENTIKASI — SISWA TANPA EMAIL
- Pendaftaran siswa = **NIS + Nama + Kelas + Sandi** SAJA (TANPA input email).
- Mapper: `nisnKeEmail(nis) => "nisn." + nis.trim() + "@siswa.lkpd.local"` → dipakai sebagai email untuk Supabase Auth. Siswa tidak pernah melihat email ini.
- Validasi NIS: regex `^\d{4,12}$`. Error "already registered" → pesan ramah: "NISN ini sudah terdaftar — langsung login".
- Login siswa: **NIS + sandi** → signInWithPassword dengan email hasil mapper.
- Login guru: **email + sandi** (tab terpisah di halaman login; toggle tab 🎓 Siswa / 👨‍🏫 Guru). Setelah login, cek `profiles.role` untuk redirect: guru→`guru.html`, siswa→`siswa.html`.
- README WAJIB menginstruksikan guru/admin menonaktifkan **Confirm email** di Supabase (Authentication → Sign In / Providers → Email → Confirm email OFF) dan membuat akun guru via dashboard (Auto Confirm User) lalu `update public.profiles set role='guru' where id='...'` (dengan fallback insert bila 0 rows).
- Halaman pendaftaran: dropdown kelas diambil dari tabel `kelas` (bisa dibaca anon karena policy `using (true)`).

## 5. STRUKTUR MATERI (js/data.js) — bagian yang harus DISI dengan konten {{MATA_PELAJARAN}}
```js
const MODUL = [ { id:"m1".."m{{JUMLAH_MODUL}}", nomor, judul, ikon, ringkas,
  tujuan:[...],              // 3-4 butir, ISO (kompetensi)
  teori:"html-string",       // paragraf + <pre> ilustrasi ASCII + .info-box (kuning=hati-hati, hijau=tips, merah=jebakan)
  langkah:[ {judul, penjelasan(html dgn <code>), kode:"string python utuh"} ] × 4-5,
  praktik:{ deskripsi, starter, checks:[], visual? },
  kuis:[ {q, opsi[4], kunci} ] × 6     // q boleh mengandung <code>
}, ... ];

const KUIS_AKHIR = { id:"final", judul, ikon:"🏁", durasiMenit:{{DURASI_KUIS_AKHIR}}, soal:[ ×20 {q, opsi[4], kunci} ] };
```
Aturan materi:
- Semua kode contoh **harus diuji benar secara sintaks {BAHASA_PRAKTIK}** sebelum commit (penulis prompt WAJIB menjalankan verifikasi otomatis).
- Kuis modul & kuis akhir: **4 opsi**, tepat 1 kunci, pengecoh masuk akal (miskonsepsi umum).
- Kuis akhir: 20 soal **terdistribusi proporsional** ke semua modul, soal berlabel "Modul N — …" pada teksnya.

## 6. STRUKTUR PRAKTIK + PENILAIAN OTOMATIS
- `starter` = kerangka kode dikali bagian yang sengaja dikosongkan (syntax error sengaja/`...`/placeholder `GANTI_INI`) supaya siswa mengisi.
- `checks` = 4 kriteria, **total tepat 100 poin**, tiap item `{poin, desc, type:"kode"|"output", regex}`:
  - type "output" → regex diuji ke stdout hasil eksekusi (pakai `new RegExp(regex, "s")`).
  - type "kode" → regex diuji ke source kode siswa.
- Nilai praktik = jumlah poin kriteria lulus (0–100). Lulus = ≥70.
- Simpan setiap pengiriman ke `submissions` (student_id, module_id, kode, output, checks[], nilai).
- Modul khusus visualisasi: Python mencetak format terstruktur `LABELS:a,b,c` & `DATA:1,2,3` → halaman mem-parse dan menggambar **Chart.js**. Modul pencarian jalur: Python mencetak `ROW:SF..*` per baris → halaman menggambar **tabel grid berwarna** (`*`=jalan aqua, `#`=dinding gelap, `S` hijau, `F` kuning).
- Output editor ditampilkan dalam `<pre class="output-box">`; error {BAHASA_PRAKTIK} ditampilkan merah, hanya beberapa baris terakhir.

## 7. MODEL PEMBELAJARAN SISWA (siswa.html + siswa.js)
- Dashboard: kartu per modul (nomor, ikon, judul, ringkas, progress bar, badge praktik/kuis/⭐ nilai akhir 50:50) + kartu 🏁 Kuis Akhir.
- Modal modul berisi: Tujuan → Materi → Langkah berkode (tiap langkah: editor + ▶️ Jalankan + ↺ Reset + tombol "✔️ Langkah ini saya pahami" → upsert progress step `l{i}`) → Praktik (editor + 📤 Kirim Praktik auto-nilai + panel hasil cek per kriteria ✔️/❌ + visual jika ada) → Kuis modul (6 soal radio, ✅ Kirim → auto-grading, opsi benar=salur hijau & salah merah, nilai=benar/total×100 → insert quiz_results).
- **Gerbang berantai**: Modul N hanya terbuka setelah praktik & kuis Modul N-1 terkirim (dicek dari data server, bukan localStorage). Kartu terkunci = opacity + pesan "🔒 MODUL N — terbuka setelah Modul N-1 selesai"; pembukaan paksa ditolak dengan alert.
- **🏁 KUIS AKHIR**: kartu terkunci sampai KELIMA modul tuntas (checklist ⬜/✅ per modul di kartu). Saat terbuka: aturan → 🚀 Mulai → **20 soal acak (`acakArray`)**, **timer hitung mundur melayang (sticky)**{{DURASI_KUIS_AKHIR}} menit (kuning <5 mnt, merah berdenyut <2 mnt), **auto-submit saat habis**, konfirmasi bila masih ada soal kosong saat kirim manual, review kunci ✔️/❌ pasca kirim, nilai terbaik yang dipertahankan (ambil max), simpan `module_id='final'` + progress step `k`.
- Menutup modal saat kuis akhir berjalan → dialog konfirmasi + clear interval.
- **Pyodide lazy-load**: TIDAK dimuat saat halaman dibuka (penting untuk 40+ siswa login serentak); dimuat saat pertama "Jalankan/Kirim" dengan pesan "menyiapkan Python… ±10–20 detik, sekali saja (cache browser)".

## 8. DASHBOARD GURU (guru.html + guru.js) — 4 tab
1. **📈 Analitik Kelas**: filter kelas (dropdown dari tabel kelas) + tombol ➕ Tambah Kelas (prompt, validasi regex, upsert, refresh dropdown). Stat kartu: jumlah siswa terfilter, sudah mulai mengerjakan, rata-rata nilai akhir kelas, modul paling sulit (praktik lulus tersedikit), **rata-rata kuis akhir + partisipasi**. Grafik Chart.js: (a) rata-rata praktik vs kuis per modul, (b) jumlah praktik lulus (≥70) per modul.
2. **🗂️ Nilai Siswa**: matriks siswa × modul (nilai akhir 50:50, warna hijau ≥70 / merah <70, tooltip detail praktik|kuis) + kolom 🏁 Kuis Akhir + kolom Rata Modul + **⬇️ Unduh CSV** (delimiter `;` agar Excel ID langsung rapi).
3. **💬 Rincian Jawaban**: 50 riwayat submissions & quiz_results terbaru (waktu id-ID, nama, modul — module_id 'final' dilabel "🏁 Akhir").
4. **📖 Materi & Kunci**: select modul/kuis-akhir → menampilkan tujuan, teori, langkah+kode (read-only), deskripsi praktik + kerangka kode + kriteria auto-check, dan SEMUA kuis dengan kunci ditandai ✅ hijau.
- Kerjakan 3 query utama paralel (`Promise.all`), nilai per siswa-modul diagregasi ambil MAKSIMUM.
- **Realtime**: satu channel subscribe INSERT/UPDATE ke 3 tabel (debounce 800 ms). Fallback: tombol 🔄 Refresh manual + auto-refresh tiap 90 detik.
- Guard: role ≠ guru → redirect `siswa.html`.

## 9. UI/DESAIN (css/style.css — tema gelap)
- Palet: bg `#0f172a`, panel `#1a2338`, border `#334155`, teks `#e2e8f0`, aksen aqua `#22d3ee`, hijau `#34d399`, kuning `#fbbf24`, merah `#f87171`, ungu `#a78bfa`. Font: Segoe UI/system-ui; kode: Consolas.
- Komponen: topbar sticky, chip, kartu modul dengan hover lift, progress-bar, modal, editor `<textarea class="code-editor">` monospace, output-box, check-line hasil cek, statistik grid, tabel data (uppercase header kecil), tab-bar, timer-bar sticky, info-box berwarna.
- **PENTING**: input radio opsi kuis WAJIB di-override `width:auto` — karena aturan global `input{width:100%}` membuat radio melar & teks opsi patah (bug yang sudah pernah terjadi).
- Responsif (input-row turun 1 kolom <640px), seluruh teks bahasa Indonesia.

## 10. DEPLOY & KAPASITAS
- Repo diinisialisasi git + commit pertama; push ke GitHub (bisa via `gh` CLI).
- GitHub Pages dari branch master root (PUBLIC repo — Pages gratis hanya untuk repo public). URL: `https://<user>.github.io/<repo>/`.
- Target kapasitas: **40+ siswa serentak** (Pyodide per-browser + CDN Pages + Supabase free — tuliskan penjelasannya di README).
- Sesi/akhir: seluruh perubahan di-commit dengan pesan deskriptif bahasa Indonesia + push setiap tahap.

## 11. TAHAPAN PENGERJAAN (kerjakan berurutan; commit+push tiap tahap; JANGAN tunda verifikasi ke akhir)
1. **T0 Kerangka**: seluruh file + css + konfigurasi placeholder → node --check semua JS.
2. **T1 Database**: sql/schema.sql lengkap & idempotent → validasi manual kalusa SQL (tanpa `on conflict` di sub-SELECT).
3. **T2 Auth & login**: mapper NISN, dua tab login, signup, redirect per role.
4. **T3 Materi**: tulis {{JUMLAH_MODUL}} modul lengkap di js/data.js + 20 soal kuis akhir → **uji otomatis**: jumlah soal, 4 opsi, indeks kunci valid, semua kode contoh dieksekusi tanpa syntax error (node vm / interpreter {BAHASA_PRAKTIK} asli untuk solusi referensi).
5. **T4 Siswa**: modal modul, editor Pyodide, jalankan/reset, tandai langkah, kirim praktik + auto-check + visual, kuis modul + grading + simpan.
6. **T5 Guru**: 4 tab + CSV + realtime + refresh + tambah kelas + materi&kunci.
7. **T6 Gerbang & Kuis Akhir**: gerbang berantai + kartu final + timer + autosubmit + review.
8. **T7 Polish & deploy**: perbaiki CSS bug layout (radio dsb.), README setup lengkap, aktifkan Pages, verifikasi URL HTTP 200.

## 12. KRITERIA SELESAI (acceptance criteria — semua harus ✅)
- [ ] `node --check` lolos utk semua file js.
- [ ] Solusi referensi praktik tiap modul menghasilkan output yang MENEMBUS 100% kriteria auto-check (dibuktikan lewat uji tampil).
- [ ] Skema SQL idempotent (aman dijalankan ulang), RLS aktif semua tabel, trigger profil bekerja.
- [ ] Siswa bisa daftar TANPA email (NIS+Nama+Kelas+Sandi) dan langsung login; NIS duplikat ditolak.
- [ ] Guru melihat realtime nilai; CSV berisi semua kolom termasuk Kuis Akhir.
- [ ] Kuis Akhir terkunci sampai 5 modul tuntas; timer jalan; auto-kirim saat habis; nilai tersimpan.
- [ ] Guru membaca semua materi + kunci di tab khusus.
- [ ] Halaman live GitHub Pages HTTP 200 dengan ikon & judul benar.

## 13. DAFTAR PLACEHOLDER (ganti semua sebelum menjalankan prompt)
| Placeholder | Isi |
|---|---|
| {{MATA_PELAJARAN}} | nama mata pelajaran |
| {{KELAS}} | jenjang, cth "Kelas X" |
| {{JUDUL_LKPD}} | judul LKPD |
| {{JUMLAH_MODUL}} | jumlah modul (mis. 5) |
| {{DAFTAR_MATERI}} | daftar topik tiap modul |
| {{BAHASA_PRAKTIK}} | Python (default) atau lainnya |
| {{KELAS_DEFAULT}} | kelas bawaan trigger |
| {{DAFTAR_KELAS_AWAL}} | contoh X-A, X-B |
| {{DURASI_KUIS_AKHIR}} | menit, mis. 20 |

## 14. JANGAN LUPA (pitfal yang sudah pernah terjadi — cegah sejak awal)
1. `on conflict` di dalam sub-SELECT → syntax error Postgres.
2. Policy `kelas` pakai `authenticated` → dropdown pendaftaran kosong (harus `using (true)`).
3. Radio input kena `width:100%` global → tampilan kuis hancur.
4. Konfirmasi email Supabase aktif → siswa tanpa email tak bisa login + limit 429.
5. `create policy` tanpa `drop if exists` → gagal saat skrip dijalankan ulang.
6. Memuat Pyodide saat buka halaman → 40 unduhan serentak saat jam pertama.
7. Kunci regex auto-check tidak diuji terhadap output solusi referensi → nilai siswa selalu salah.
8. Repo private → GitHub Pages 422 "plan does not support".
9. Lupa label `🏁 Akhir` untuk module_id 'final' di tabel guru.
10. Nilai yang disimpan bukan maksimum → nilai siswa turun setelah mengulang.

## ═══════════════ AKHIR PROMPT ═══════════════

---

### 📌 Catatan pemakaian (bukan bagian prompt)
- ✅ **Contoh penerapan sudah jadi & live**: folder `lkpd-transformasi-geometri/` — LKPD Transformasi Geometri (Matematika Kelas XI), non-koding (kanvas koordinat + isian angka, tanpa Pyodide). URL: `https://rekizamasari.github.io/lkpdarraypython/lkpd-transformasi-geometri/`. Jadikan ini referensi bentuk nyata hasil template.
- Untuk LKPD baru, cukup ubah bagian **1 (IDENTITAS)**, **5 (isi materi di data.js)**, **6 (starter & kriteria praktik)**, dan placeholder di **13** — arsitektur, database, auth, gerbang, kuis akhir, dashboard guru, deploy: semua menyesuaikan otomatis karena tidak mengandung topik spesifik.
- Jika LKPD baru tidak memakai kode program (mata pelajaran non-koding), ganti spesifikasi editor Pyodide dengan "menjalankan aktivitas interaktif HTML/Canvas" dan ganti auto-check regex output dengan kriteria jawaban sederhana — biarkan bagian lain tetap.
