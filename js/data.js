/* =====================================================================
 * data.js — Materi lengkap 5 modul LKPD
 * Struktur tiap modul: tujuan, teori, langkah[] (kode contoh), praktik
 * (starter + kriteria auto-check), kuis[] (pilihan ganda + kunci).
 * ===================================================================== */
const MODUL = [

/* ================= MODUL 1: ARRAY 1D ================= */
{
  id: "m1",
  nomor: 1,
  judul: "Array 1 Dimensi (List Python)",
  ikon: "📏",
  ringkas: "Konsep list 1D, indeks, slicing, operasi dasar & perulangan.",
  tujuan: [
    "Menjelaskan konsep array/list 1 dimensi sebagai kumpulan data berurutan.",
    "Mengakses elemen list menggunakan indeks dan fungsi len().",
    "Melakukan operasi dasar: mengganti, menambah, dan mengiris (slicing) elemen.",
    "Menerapkan list 1D untuk menghitung total, nilai maksimal/minimal, dan rata-rata.",
  ],
  teori: `
<p><b>Array 1 dimensi</b> adalah kumpulan data berurutan dalam satu baris. Dalam Python kita menggunakan <b>list</b>:</p>
<code>nilai = [80, 85, 72]</code>. Indeks dimulai dari <b>0</b>, sehingga <code>nilai[0]</code> adalah 80 dan <code>nilai[2]</code> adalah 72.
<div class="info-box kuning">⚠️ <b>Kesalahan umum:</b> mengakses <code>nilai[3]</code> pada list berukuran 3 menyebabkan <code>IndexError</code> karena indeks tersedia hanya 0, 1, dan 2.</div>
<h4>Ilustrasi penyimpanan memori</h4>
<pre>indeks :    0    1    2
       ┌────┬────┬────┐
nilai =│ 80 │ 85 │ 72 │   ← setiap elemen punya satu "kotak"
       └────┴────┴────┘</pre>
<div class="info-box hijau">💡 <b>Ingat:</b> jumlah elemen = <code>3</code>, tetapi indeks terbesar = <code>3 - 1 = 2</code>. Formula <code>len(nama_list) - 1</code> sering dipakai untuk mengakses elemen terakhir.</div>`,
  langkah: [
    { judul: "Membuat & mengakses array 1D", penjelasan: "List Python adalah rangkaian nilai dalam satu tanda kurung siku. Akses elemen dengan <code>[indeks]</code>.", 
      kode: 'nilai = [80, 85, 72]\nprint("Elemen pertama :", nilai[0])\nprint("Elemen kedua   :", nilai[1])\nprint("Banyak elemen  :", len(nilai))' },
    { judul: "Mengganti & menambah elemen", penjelasan: "Isi list bisa diubah: nilainya ditimpa lewat <code>[indeks]</code>, ditambah dengan <code>.append()</code>.", 
      kode: 'nilai = [80, 85, 72]\nnilai[1] = 90        # ganti elemen indeks 1\nprint("Setelah diganti:", nilai)\n\nnilai.append(78)     # menambah di akhir list\nprint("Setelah ditambah:", nilai)' },
    { judul: "Slicing (mengiris) array 1D", penjelasan: "Ikuti pola <b>[awal : akhir : langkah]</b>. Sisi akhir tidak ikut dimasukkan ke hasil.", 
      kode: 'huruf = ["a", "b", "c", "d", "e"]\nprint(huruf[1:4])    # indeks 1 sampai 3 → [\'b\', \'c\', \'d\']\nprint(huruf[:3])     # 3 elemen pertama\nprint(huruf[-2:])    # 2 elemen terakhir\nprint(huruf[::2])    # lompat setiap 2 indeks' },
    { judul: "Perulangan pada array 1D", penjelasan: "Hampir semua pekerjaan array memakai perulangan. <code>enumerate()</code> memberikan indeks dan nilai bersamaan.", 
      kode: 'nilai = [80, 85, 72]\nfor i, n in enumerate(nilai):\n    print("Murid ke-", i, "dapat nilai", n)' },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> buat program yang menyimpan <b>6 nilai</b> ujian siswa ke dalam satu <code>list</code>, lalu:
<br>&nbsp;&nbsp;1️⃣ Menjumlahkan seluruh nilainya dengan <code>for</code> &amp; <code>len()</code>;
<br>&nbsp;&nbsp;2️⃣ Menampilkan nilai <b>terbesar</b> &amp; <b>terkecil</b>;
<br>&nbsp;&nbsp;3️⃣ Menghitung <b>rata-rata</b>.
<div class="info-box hijau">💡 <em>petunjuk:</em> pakai <code>total += n</code> untuk menjumlah; jadikan <code>nilai[0]</code> sebagai awal <code>terbesar</code>/<code>terkecil</code>, lalu bandingkan dengan elemen lain di dalam <code>for</code>.</div>`,
    starter: '# === MISI: Data Nilai 6 Siswa ===\nnilai = [80, 75, 90, 85, 60, 70]\n\n# 1) Jumlahkan seluruh nilai dengan for\ntotal =  \n\n# 2) Cari nilai terbesar & terkecil\nterbesar = nilai[0]\nterkecil = nilai[0]\n# LENGKAPI: bandingkan di dalam for\n\n# 3) Hitung rata-rata dengan len()\nrerata =  \n\nprint("Total  :", total)\nprint("Max    :", terbesar)\nprint("Min    :", terkecil)\nprint("Rerata :", rerata)',
    checks: [
      { poin: 25, desc: "Total nilai dihitung dengan benar (hasilnya 460)", type: "output", regex: "Total\\s*:\\s*460\\b" },
      { poin: 25, desc: "Nilai terbesar = 90 & terkecil = 60", type: "output", regex: "Max\\s*:\\s*90[\\s\\S]*Min\\s*:\\s*60" },
      { poin: 25, desc: "Rata-rata dihitung (≈ 76.67)", type: "output", regex: "Rerata\\s*:\\s*76\\.6" },
      { poin: 25, desc: "Kode menggunakan 'for' dan 'len()'", type: "kode", regex: "for[\\s\\S]*len\\s*\\(" },
    ],
  },
  kuis: [
    { q: "Pada <code>list</code> Python, indeks elemen pertama adalah…", opsi: ["1", "0", "-1", "Tergantung ukuran list"], kunci: 1 },
    { q: "Jika <code>a = [10, 20, 30, 40]</code>, perintah <code>a[1:3]</code> menghasilkan…", opsi: ["[10, 20]", "[20, 30, 40]", "[20, 30]", "[30, 40]"], kunci: 2 },
    { q: "<code>len([5, 6, 7])</code> menghasilkan…", opsi: ["2", "3", "4", "6"], kunci: 1 },
    { q: "Cara paling pas menambah elemen 9 ke list <code>x</code> adalah…", opsi: ["x.add(9)", "x.append(9)", "x.push(9)", "x.insert_end(9)"], kunci: 1 },
    { q: "Dengan <code>a = [8, 5, 2]</code>, perintah <code>a[-1]</code> menghasilkan…", opsi: ["8", "5", "2", "Error"], kunci: 2 },
    { q: "Menghitung total seluruh elemen list 1D paling tepat dilakukan dengan…", opsi: ["satu <code>if</code> saja", "<code>for</code> + <code>total += elemen</code>", "menulis manual satu per satu", "tidak bisa dihitung"], kunci: 1 },
  ],
},

/* ================= MODUL 2: ARRAY 2D ================= */
{
  id: "m2",
  nomor: 2,
  judul: "Array 2 Dimensi (Matriks)",
  ikon: "🧮",
  ringkas: "Tabel baris × kolom, akses [baris][kolom], nested loop, nilai sekelas.",
  tujuan: [
    "Menjelaskan apa itu array 2D (matriks/tabel) dan struktur baris–kolomnya.",
    "Mengakses elemen matriks dengan format [baris][kolom].",
    "Menghitung total & rata-rata per baris dan per kolom dengan nested loop.",
    "Menerapkan array 2D untuk menyimpan nilai beberapa kelas.",
  ],
  teori: `
<p><b>Array 2 dimensi</b> (matriks) adalah list yang berisi list. Seperti tabel Excel: ada <b>baris</b> dan <b>kolom</b>.</p>
<code>kelas = [[80, 85], [90, 70]]</code> → 2 baris × 2 kolom.
<h4>Ilustrasi: nilai MTK & IPA dari 2 kelas</h4>
<pre>              kolom 0      kolom 1
baris 0  →  [  80    ,    85  ]   ← kelas X-A (MTK, IPA)
baris 1  →  [  90    ,    70  ]   ← kelas X-B (MTK, IPA)

akses  :  kelas[1][0]  ➜ baris 1, kolom 0 = 90
urutan :  baris dulu, lalu kolom!</pre>
<div class="info-box kuning">⚠️ <b>Urutan diperhatikan:</b> <code>kelas[1][0]</code> ≠ <code>kelas[0][1]</code>. Selalu pola <code>[baris][kolom]</code>!</div>`,
  langkah: [
    { judul: "Membuat & mengakses matriks", penjelasan: "Akses dievaluasi berurutan: <code>nilai[1]</code> menghasilkan list baris ke-1, lalu <code>[0]</code> memilih kolomnya.",
      kode: 'nilai = [\n    [80, 85, 70],   # baris 0: kelas X-A\n    [90, 70, 75],   # baris 1: kelas X-B\n    [65, 80, 95],   # baris 2: kelas X-C\n]\nprint("Nilai X-B kolom 0 :", nilai[1][0])\nprint("Nilai X-C kolom 2 :", nilai[2][2])\nprint("Banyak baris  :", len(nilai))\nprint("Banyak kolom  :", len(nilai[0]))' },
    { judul: "Menampilkan matriks dengan nested loop", penjelasan: "Loop luar menelusuri baris; loop dalam menelusuri kolom di setiap baris.", 
      kode: 'nilai = [[80, 85, 70], [90, 70, 75], [65, 80, 95]]\nfor baris in nilai:\n    for kolom in baris:\n        print(kolom, end=" ")\n    print()' },
    { judul: "Total & rata-rata per baris", penjelasan: "Setiap baris adalah list 1D, sehingga bisa dihitung terpisah.",
      kode: 'nilai = [[80, 85, 70], [90, 70, 75], [65, 80, 95]]\nfor i, baris in enumerate(nilai):\n    total = sum(baris)\n    print("Kelas", i, "total:", total, "rerata:", total / len(baris))' },
    { judul: "Menghitung rata-rata per kolom", penjelasan: "Akses kolom yang sama di tiap baris menggunakan <code>range()</code> — berguna untuk rata-rata per mata pelajaran.",
      kode: 'nilai = [[80, 85, 70], [90, 70, 75], [65, 80, 95]]\nn_baris = len(nilai)\nn_kolom = len(nilai[0])\nfor k in range(n_kolom):\n    total_kolom = 0\n    for b in range(n_baris):\n        total_kolom += nilai[b][k]\n    print("Kolom", k, "rerata:", total_kolom / n_baris)' },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> lengkapi program untuk menampilkan rincian nilai <b>3 siswa × 3 tugas</b>:
<br>&nbsp;&nbsp;1️⃣ <b>Total &amp; rata-rata tiap siswa</b> (per baris);
<br>&nbsp;&nbsp;2️⃣ <b>Rata-rata tiap tugas</b> (per kolom) — pakai <code>range()</code> &amp; nested loop;
<br>&nbsp;&nbsp;3️⃣ Cari <b>nilai terkecil</b> di seluruh tabel.
<div class="info-box hijau">💡 <em>petunjuk:</em> total tiap baris bisa <code>sum(baris)</code>.<br>Untuk kolom: <code>for b in range(n_siswa): total_kolom += nilai[b][k]</code>.</div>`,
    starter: '# === MISI: Tabel Nilai 3 Siswa × 3 Tugas ===\nnilai = [\n    [80, 75, 90],   # siswa 0\n    [85, 76, 70],   # siswa 1\n    [90, 88, 78],   # siswa 2\n]\n\n# 1) Total & rerata tiap siswa\nprint("== Total & Rerata Tiap Siswa ==")\nfor i, baris in enumerate(nilai):\n    total =  \n    print("Siswa", i, ": total =", total, "| rerata =", ...)\n\n# 2) Rata-rata tiap tugas (kolom)\nprint("== Rerata Tiap Tugas ==")\nn_siswa = len(nilai)\nn_tugas =  \nfor k in range(n_tugas):\n    total_kolom = 0\n    for b in range(n_siswa):\n        total_kolom +=  \n    print("Tugas", k, ": rerata =", ...)\n\n# 3) Nilai terkecil di seluruh tabel\nterkecil = nilai[0][0]\nfor baris in nilai:\n    for n in baris:\n        if ...:\n            terkecil = n\nprint("Nilai terkecil:", terkecil)',
    checks: [
      { poin: 25, desc: "Total siswa dihitung (80+75+90 = 245 tampil di output)", type: "output", regex: "245" },
      { poin: 25, desc: "Rata-rata tugas tercetak (78.2, 79.6, atau 79.3)", type: "output", regex: "79\\.6|79\\.3|78\\.2" },
      { poin: 25, desc: "Nilai terkecil tabel ditemukan (= 70)", type: "output", regex: "terkecil\\s*:\\s*70|Nilai terkecil\\s*:\\s*70" },
      { poin: 25, desc: "Kode menggunakan nested loop (for dalam for)", type: "kode", regex: "for[\\s\\S]*for" },
    ],
  },
  kuis: [
    { q: "Pada matriks 2D Python, elemen baris 2 kolom 3 diakses dengan…", opsi: ["m[2][3]", "m[3][2]", "m[2, 3]", "m(2)(3)"], kunci: 0 },
    { q: "Dengan <code>m=[[1,2],[3,4]]</code>, <code>len(m)</code> = …", opsi: ["1", "2", "3", "4"], kunci: 1 },
    { q: "Banyaknya kolom matriks <code>m</code> adalah…", opsi: ["len(m)", "len(m[0])", "m.cols", "size(m)"], kunci: 1 },
    { q: "Untuk menampilkan seluruh elemen matriks 2D, struktur loop yang tepat adalah…", opsi: ["1 loop", "2 loop bersarang (nested)", "3 loop bersarang", "Tidak perlu loop"], kunci: 1 },
    { q: "Dengan <code>m=[[1,2],[3,4]]</code>, <code>m[1][0]</code> menghasilkan…", opsi: ["1", "2", "3", "4"], kunci: 2 },
    { q: "Menghitung total nilai <b>per kolom</b> ditambahkan ke variabel total_kolom lewat…", opsi: ["total_kolom += m[i][j] (acak)", "total_kolom += m[b][k] untuk kolom k sama di tiap baris", "total += i * j", "tidak bisa dihitung"], kunci: 1 },
  ],
},

/* ================= MODUL 3: REKURSIF ================= */
{
  id: "m3",
  nomor: 3,
  judul: "Rekursif (Fungsi Memanggil Diri Sendiri)",
  ikon: "🔁",
  ringkas: "Base case, recursive case, faktorial, Fibonacci, angka mundur.",
  tujuan: [
    "Menjelaskan bahwa fungsi rekursif adalah fungsi yang memanggil dirinya sendiri.",
    "Membedakan base case (kondisi berhenti) dan recursive case.",
    "Menulis fungsi rekursif sederhana: faktorial, Fibonacci, hitung mundur.",
    "Menyebutkan error yang muncul jika base case terlupakan.",
  ],
  teori: `
<p><b>Rekursif</b> adalah teknik ketika fungsi memanggil dirinya sendiri, memecahkan masalah besar menjadi masalah kecil dengan pola sama.</p>
<pre>faktorial(3)
  └─ 3 × faktorial(2)
      └─ 2 × faktorial(1)
          └─ 1 × faktorial(0)   ← BASE CASE (berhenti!)
          └─ kembali = 1
      └─ kembali = 2
  └─ kembali = 6</pre>
<h4>Anatomi fungsi rekursif</h4>
<pre>def faktorial(n):
    if n == 0:                 # 1️⃣ BASE CASE: berhenti
        return 1               #    jika kondisi tercapai
    return n * faktorial(n-1)  # 2️⃣ RECURSIVE CASE: panggil diri sendiri</pre>
<div class="info-box merah">🔴 <b>Lupa base case</b> → <code>RecursionError: maximum recursion depth exceeded</code> (rekursi tak hingga sampai tumpukan memori penuh).<br>
💡 <b>Ingat:</b> <i>base case</i> adalah pondasi; <i>recursive case</i> melangkah ke arah pondasi.</div>`,
  langkah: [
    { judul: "Faktorial — rekursif pertama", penjelasan: "Padankan dengan rumus matematika: <code>n! = n × (n-1)!</code> sampai <code>0! = 1</code>.",
      kode: 'def faktorial(n):\n    if n == 0:                    # base case\n        return 1\n    return n * faktorial(n - 1)   # recursive case\n\nfor i in [0, 1, 3, 5]:\n    print(i, "! =", faktorial(i))' },
    { judul: "Rekursif menjumlah array 1D", penjelasan: "Rekursif tidak hanya angka besar. <code>jumlah_ke(n)</code> menjumlahkan n elemen pertama list <code>data</code>.",
      kode: 'data = [80, 75, 90, 85, 60]\n\ndef jumlah_ke(n):\n    if n == 0:                    # base case: tidak ada apa-apa\n        return 0\n    return data[n - 1] + jumlah_ke(n - 1)\n\nprint("Total semua :", jumlah_ke(len(data)))\nprint("3 pertama   :", jumlah_ke(3))' },
    { judul: "Menghitung mundur dengan rekursif", penjelasan: "Contoh paling sederhana: mencetak hitungan mundur tanpa <code>for</code>.",
      kode: 'def hitung_mundur(n):\n    if n == 0:\n        print("Mulai! 🚀")\n        return\n    print(n)\n    hitung_mundur(n - 1)   # panggil diri sendiri\n\nhitung_mundur(5)' },
    { judul: "RecursionError ketika base case dilupakan", penjelasan: "Cobalah fungsi tanpa base case. Python akan error <code>RecursionError</code>. Bandingkan dengan faktorial di Langkah 1.",
      kode: 'def fak_tanpa_stops(n):\n    # MASALAH: tidak ada return untuk n == 0\n    return fak_tanpa_stops(n - 1)\n\ntry:\n    print(fak_tanpa_stops(5))\nexcept RecursionError:\n    print("ERROR! Maximum recursion depth exceeded")\n    print("Lupakan base case = rekursi tak terbatas.")' },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> lengkapi dua fungsi rekursif:
<br>&nbsp;&nbsp;1️⃣ <code>fib(n)</code> — deret Fibonacci; <code>fib(0)=0</code>, <code>fib(1)=1</code>, <code>fib(n)=fib(n-1)+fib(n-2)</code>.
<br>&nbsp;&nbsp;2️⃣ Tampilkan deret <code>fib(0..8)</code> satu baris: <code>0 1 1 2 3 5 8 13 21</code>
<br>&nbsp;&nbsp;3️⃣ <code>pangkat(x, n)</code> = x dikali x sebanyak n kali secara rekursif; <code>pangkat(2,10)</code> = 1024.
<div class="info-box kuning">💡 <em>petunjuk:</em> base Fibonacci: <code>if n == 0: return 0</code> lalu <code>if n == 1: return 1</code>; recursive: <code>return fib(n-1) + fib(n-2)</code>.<br>Untuk <code>pangkat</code>: <code>if n == 1: return x</code> lalu <code>return x * pangkat(x, n - 1)</code>.</div>`,
    starter: '# === MISI: Fungsi Rekursif ===\n\n# 1) & 2) Deret Fibonacci rekursif\ndef fib(n):\n    # base case: n == 0 dan n == 1\n    # recursive case: fib(n-1) + fib(n-2)\n    ...\n\nprint("== Deret fib(0..8) ==")\nfor i in range(9):\n    print(fib(i), end=" ")   # hasil harus: 0 1 1 2 3 5 8 13 21\nprint()\n\n# 3) Pangkat rekursif\ndef pangkat(x, n):\n    if ...:\n        return  \n    return  \n\nprint("Pangkat 2^10 =", pangkat(2, 10))',
    checks: [
      { poin: 35, desc: "Deret Fibonacci 0 1 1 2 3 5 8 13 21 tampil", type: "output", regex: "0\\s+1\\s+1\\s+2\\s+3\\s+5\\s+8\\s+13\\s+21" },
      { poin: 30, desc: "pangkat(2, 10) = 1024", type: "output", regex: "1024" },
      { poin: 25, desc: "Kode memakai fungsi rekursif (memanggil diri sendiri)", type: "kode", regex: "def\\s+(fib|fibonacci|pangkat)[\\s\\S]*(n\\s*-\\s*1|n\\s*-\\s*2)" },
      { poin: 10, desc: "Terdapat base case (if n == 0 atau if n == 1)", type: "kode", regex: "if\\s+n\\s*==\\s*[01]" },
    ],
  },
  kuis: [
    { q: "Fungsi rekursif adalah fungsi yang…", opsi: ["ditulis satu baris", "memanggil dirinya sendiri", "mengembalikan angka", "hanya boleh dipanggil sekali"], kunci: 1 },
    { q: "Kondisi yang menghentikan rekursi disebut…", opsi: ["recursive case", "base case", "infinite loop", "bug"], kunci: 1 },
    { q: "Jika base case terlupakan, Python akan melempar…", opsi: ["IndexError", "ValueError", "RecursionError", "ZeroDivisionError"], kunci: 2 },
    { q: "Nilai dari <code>faktorial(4)</code> adalah…", opsi: ["8", "12", "24", "16"], kunci: 2 },
    { q: "Dengan <code>fib(0)=0</code> dan <code>fib(1)=1</code>, nilai <code>fib(5)</code> adalah…", opsi: ["5", "8", "13", "21"], kunci: 0 },
    { q: "Untuk menghitung <code>fib(n)</code> secara rekursif, dipanggil…", opsi: ["1 pemanggilan", "2 pemanggilan: fib(n-1) & fib(n-2)", "3 pemanggilan", "tidak ada pemanggilan"], kunci: 1 },
  ],
},

/* ================= MODUL 4: VISUALISASI DATA ================= */
{
  id: "m4",
  nomor: 4,
  judul: "Studi Kasus: Visualisasi Data",
  ikon: "📊",
  ringkas: "Mengolah data penjualan & nilai dengan Python, hasilnya digambar sebagai grafik interaktif.",
  tujuan: [
    "Menyimpan data mentah (label & angka) dalam array 1D.",
    "Menghitung statistik dasar dengan max(), min(), sum(), len().",
    "Membentuk output terstruktur agar bisa dibaca program lain.",
    "Menampilkan grafik interaktif dari hasil pengolahan Python.",
  ],
  teori: `
<p>Semua data yang terlihat di grafik sebenarnya <b>array</b> yang sudah diolah:</p>
<pre>label_hari  = ["Sen", "Sel", "Rab", "Kam", "Jum"]
penjualan   = [20, 35, 38, 44, 45]</pre>
<h4>3 langkah mengubah array menjadi grafik</h4>
<p>1️⃣ <b>Olah</b> di Python — hitung statistik &amp; susun label;<br>
2️⃣ <b>Print</b> hasil dalam format terstruktur supaya bisa dibaca program;<br>
3️⃣ <b>Gambar</b> di halaman web menggunakan grafik interaktif.</p>
<div class="info-box kuning">💡 <b>Penting:</b> grafik tidak membantu jika data awal/olah-nya salah. Selalu periksa data mentah terlebih dahulu dengan <code>print()</code>.</div>`,
  langkah: [
    { judul: "Menyimpan data penjualan dalam array", penjelasan: "Uji pemetaan: label (nama hari) diposisikan bersama nilai (angka) di indeks yang sama.",
      kode: 'label_hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]\npenjualan  = [20, 35, 38, 44, 45]\n\nfor i in range(len(label_hari)):\n    print(label_hari[i], ":", penjualan[i], "cup")' },
    { judul: "Menghitung statistik dasar dari array", penjelasan: "Python punya fungsi bawaan yang bekerja di atas array: <code>max(), min(), sum()</code>. Rata-rata = <code>sum / len</code>.",
      kode: 'penjualan = [20, 35, 38, 44, 45]\n\nprint("Total    :", sum(penjualan))    # 182\nprint("Minimal  :", min(penjualan))    # 20\nprint("Maksimal :", max(penjualan))    # 45\nprint("Rerata   :", sum(penjualan) / len(penjualan))   # 36.4' },
    { judul: "Mencari hari terbaik & terparah", penjelasan: "Kombinasikan indeks, nilai, dan label: simpan indeks saat nilai terbesar/terkecil ditemukan.",
      kode: 'label_hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]\npenjualan  = [20, 35, 38, 44, 45]\n\nidx_best  = 0\nidx_worst = 0\nfor i in range(len(penjualan)):\n    if penjualan[i] > penjualan[idx_best]:\n        idx_best = i\n    if penjualan[i] < penjualan[idx_worst]:\n        idx_worst = i\n\nprint("Hari terbaik  :", label_hari[idx_best], "=", penjualan[idx_best])\nprint("Hari terburuk :", label_hari[idx_worst], "=", penjualan[idx_worst])' },
    { judul: "Format output khusus grafik", penjelasan: "Untuk dibaca program lain (mis. halaman web), hasil Python dicetak dalam <b>format terstruktur</b>: baris dimulai <code>LABELS:</code> atau <code>DATA:</code>, elemen dipisah koma.",
      kode: 'label_hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]\npenjualan  = [20, 35, 38, 44, 45]\n\n# print dengan format khusus, akan dibaca oleh halaman web\nprint("LABELS:" + ",".join(label_hari))\nprint("DATA:" + ",".join(str(n) for n in penjualan))' },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> lengkapi pengolahan data penjualan mingguan (7 hari) dan cetak output dengan format khusus untuk grafik di bawah. Panel grafik akan muncul ketika kode berhasil dijalankan.
<div class="info-box hijau"><b>Catatan:</b> format harus persis: baris <code>LABELS: label1,label2,…</code> (7 hari) diikuti baris <code>DATA: angka1,angka2,…</code> (7 angka dipisah koma).</div>`,
    starter: '# === MISI: Pengolahan Data Penjualan Mingguan ===\nlabel_hari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]\npenjualan  = [21, 27, 33, 40, 47, 42, 25]\n\n# 1) Hitung total, min, max & rata-rata\ntotal    =  \nminimal  =  \nmaksimal =  \nrerata   =  \n\nprint("Total :", total)\nprint("Min   :", minimal)\nprint("Max   :", maksimal)\nprint("Rerata:", rerata)\n\n# 2) Temukan hari terbaik & terparah (pakai for & idx)\nidx_best  = 0\nidx_worst = 0\n# ... lengkapi perbandingan di dalam for ...\n\n# 3) Output format grafik:\n#    LABELS: label1,label2,...  &  DATA: angka1,angka2,...\nprint(...)\nprint(...)',
    checks: [
      { poin: 25, desc: "Total & Rerata penjualan tercetak (total = 235, rerata ≈ 33.57)", type: "output", regex: "Total\\s*:\\s*235[\\s\\S]*Rerata\\s*:\\s*33\\.5" },
      { poin: 15, desc: "Min = 21 dan Max = 47", type: "output", regex: "Min\\s*:\\s*21[\\s\\S]*Max\\s*:\\s*47" },
      { poin: 30, desc: "Output 'LABELS:' 7 hari dipisah koma", type: "output", regex: "LABELS:\\s*[A-Za-z]+(\\s*,\\s*[A-Za-z]+){6}" },
      { poin: 30, desc: "Output 'DATA:' 7 angka dipisah koma", type: "output", regex: "DATA:\\s*\\d+(\\s*,\\s*\\d+){6}" },
    ],
    visual: "chart",
  },
  kuis: [
    { q: "Sebelum data divisualisasikan, langkah yang harus dilakukan adalah…", opsi: ["print langsung", "olah data dulu dengan Python (statistik, format output)", "ganti data", "nulis manual gambar"], kunci: 1 },
    { q: "Fungsi Python untuk mencari nilai tertinggi pada array adalah…", opsi: ["range()", "max()", "up()", "top()"], kunci: 1 },
    { q: "Format output yang dipahami panel grafik pada LKPD ini adalah…", opsi: ["LABELS: / DATA:", "GARIS: / TITIK:", "PRINT: / OUTPUT:", "bebas saja"], kunci: 0 },
    { q: "Untuk menghitung rata-rata data array, cara yang tepat adalah…", opsi: ["sum(data) - len(data)", "sum(data) / len(data)", "max(data) - min(data)", "len(data) * 2"], kunci: 1 },
    { q: "Mengapa array label perlu sejajar (indeks sama) dengan array nilainya saat visualisasi? <i>(pilihan terbaik)</i>", opsi: ["agar tiap nilai berlabel dengan benar di grafik", "untuk memperbesar file", "karena Python mengharuskan", "tidak perlu"], kunci: 0 },
    { q: "Cara Python yang benar untuk menggabungkan list string <code>label</code> dengan pemisah koma adalah…", opsi: ["label.append(',')", "', '.join(label)", "str(label)", "'\\n'.join(label)"], kunci: 1 },
  ],
},

/* ================= MODUL 5: PENCARIAN JALUR ================= */
{
  id: "m5",
  nomor: 5,
  judul: "Studi Kasus: Algoritma Pencarian Jalur",
  ikon: "🧭",
  ringkas: "Labirin = array 2D; mencari jalan S→F berbasis rekursi + backtracking.",
  tujuan: [
    "Memahami denah/labirin bisa diwakili array 2 dimensi.",
    "Menggabungkan array 2D + rekursif untuk pencarian jalan.",
    "Memahami backtracking saat jalur buntu.",
    "Membaca hasil jalur yang ditemukan pada tampilan labirin.",
  ],
  teori: `
<p><b>Labirin</b> pada dasarnya <b>matriks</b> 2D: <code>S</code> = mulai, <code>F</code> = tujuan, <code>#</code> = dinding, <code>.</code> = jalan.</p>
<pre>row 0:  S . . . # .
row 1:  # # . # . .
row 2:  . . . # . F</pre>
<p>Dengan <b>rekursif</b>, kita mencoba melangkah ke 4 arah (kanan, bawah, kiri, atas). Ketika jalur buntu, kita mundur dan mencoba arah lain — disebut <b>backtracking</b>.</p>
<div class="info-box kuning">💡 <b>Aturan utama:</b> hanya bergerak ke sel yang bukan dinding dan belum dikunjungi. Ketika sudah sampai <code>F</code>, langsung berhenti (<i>base case</i>).</div>`,
  langkah: [
    { judul: "Labirin sebagai array 2D", penjelasan: "Setiap baris labirin disimpan sebagai list. Tampilkan dengan loop luar & loop dalam.",
      kode: 'labirin = [\n  ["S", ".", ".", ".", "#", "."],\n  ["#", "#", ".", "#", ".", "."],\n  [".", ".", ".", "#", ".", "F"],\n]\nfor baris in labirin:\n    for sel in baris:\n        print("█" if sel == "#" else sel, end=" ")\n    print()' },
    { judul: "Rangka fungsi rekursif cari()", penjelasan: "Fungsi menerima <b>baris</b> &amp; <b>kolom</b> posisi. Base: keluar batas/dinding → <code>False</code>; menemukan <code>F</code> → <code>True</code>.",
      kode: 'def cari(r, c):\n    rows = len(labirin); cols = len(labirin[0])\n\n    # BASE CASE 1: keluar batas\n    if r < 0 or r >= rows or c < 0 or c >= cols:\n        return False\n\n    # BASE CASE 2: temukan tujuan\n    if labirin[r][c] == "F":\n        return True\n\n    # dinding atau sudah dilalui, tidak boleh lewat\n    if labirin[r][c] == "#" or labirin[r][c] == "*":\n        return False' },
    { judul: "4 arah & backtracking", penjelasan: "Coba kanan, bawah, kiri, atas. Jika semua gagal = buntu, batalkan tanda jalur (<code>*</code> kembali <code>.</code>) dan <code>return False</code>.",
      kode: 'labirin = [\n  ["S", ".", ".", ".", "#", "."],\n  ["#", "#", ".", "#", ".", "."],\n  [".", ".", ".", "#", ".", "F"],\n]\n\n# tempelkan fungsi cari() dari Langkah 2, lalu lengkapi seperti ini:\ndef cari(r, c):\n    rows = len(labirin); cols = len(labirin[0])\n    if r < 0 or r >= rows or c < 0 or c >= cols:\n        return False\n    if labirin[r][c] == "#" or labirin[r][c] == "*":\n        return False\n    if labirin[r][c] == "F":\n        return True\n\n    if labirin[r][c] != "S":\n        labirin[r][c] = "*"      # tandai sedang dilalui\n\n    # 4 arah\n    if cari(r, c+1): return True    # kanan\n    if cari(r+1, c): return True    # bawah\n    if cari(r, c-1): return True    # kiri\n    if cari(r-1, c): return True    # atas\n\n    # backtracking: buntu → pecah tanda kembali\n    if labirin[r][c] != "S":\n        labirin[r][c] = "."\n    return False\n\ncari(0, 0)      # mulai dari S baris 0 kolom 0\nfor baris in labirin:\n    for sel in baris:\n        print("█" if sel == "#" else sel, end=" ")\n    print()' },
    { judul: "Tampilan labirin hasil pencarian", penjelasan: "Jalur dilalui ditandai <code>*</code>, dinding <code>█</code>. Hasilnya lebih mudah dibaca jika dicetak per baris.",
      kode: 'for baris in labirin:\n    print("".join("█" if sel == "#" else sel for sel in baris))' },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> lengkapi fungsi rekursif <code>cari()</code> agar labirin menemukan jalur dari <code>S</code> ke <code>F</code>; output yang <b>memiliki jalur</b> berupa <code>*</code> akan digambar sebagai tabel warna.
<div class="info-box hijau">💡 <em>petunjuk:</em> 4 arah berupa rekursif: <code>cari(r-1, c)</code>, <code>cari(r+1, c)</code>, <code>cari(r, c-1)</code>, <code>cari(r, c+1)</code>.<br><b>Base:</b> keluar batas → <code>return False</code>; menemukan <code>F</code> → <code>return True</code>; dinding/jalur lama → <code>return False</code>.</div>`,
    starter: '# === MISI: Cari jalan! ===\nlabirin = [\n  ["S", ".", ".", "#", ".", "."],\n  ["#", "#", ".", ".", ".", "#"],\n  [".", ".", "#", "#", ".", "."],\n  [".", "#", ".", ".", "#", "F"],\n]\n\ndef cari(r, c):\n    rows = len(labirin); cols = len(labirin[0])\n\n    # BASE CASE 1: keluar batas\n    if r < 0 or r >= rows or c < 0 or c >= cols:\n        return GANTI_INI     # ganti: jawaban ketika keluar batas\n\n    # BASE CASE 2: temukan F\n    if labirin[r][c] == "F":\n        return GANTI_INI     # ganti: jawaban ketika menemukan tujuan\n\n    # dinding atau sudah dilalui, tidak boleh\n    if labirin[r][c] == "#" or labirin[r][c] == "*":\n        return GANTI_INI     # ganti: jawaban ketika berhadapan dinding\n\n    if labirin[r][c] != "S":\n        labirin[r][c] = "*"      # tandai sel sebagai sedang dilalui\n\n    # RECURSIVE CASE: coba 4 arah (ganti ... dengan pemanggilan cari)\n    if ...: return True          # kanan\n    if ...: return True          # bawah\n    if ...: return True          # kiri\n    if ...: return True          # atas\n\n    # buntu → hapus tanda, kembali (backtracking)\n    if labirin[r][c] != "S":\n        labirin[r][c] = "."\n    return False\n\ncari(0, 0)\nprint("HASIL:")\nfor baris in labirin:\n    print("ROW:" + "".join(baris))',
    checks: [
      { poin: 40, desc: "Jalur ditemukan (karakter '*' tampil di output)", type: "output", regex: "\\*" },
      { poin: 30, desc: "Semua 4 baris labirin dicetak (ROW: × 4)", type: "output", regex: "ROW:[\\s\\S]*ROW:[\\s\\S]*ROW:[\\s\\S]*ROW:" },
      { poin: 15, desc: "Start 'S' masih tampil di output", type: "output", regex: "S" },
      { poin: 15, desc: "Kode memakai 4 pemanggilan rekursif cari()", type: "kode", regex: "(cari\\s*\\([\\s\\S]*){6}" },
    ],
    visual: "grid",
  },
  kuis: [
    { q: "Labirin (peta) lebih tepat disimpan sebagai…", opsi: ["array 1D", "array 2D (matriks)", "string tunggal", "tidak perlu data"], kunci: 1 },
    { q: "Pada fungsi <code>cari()</code>, kondisi yang berhenti adalah menemukan…", opsi: ["kode S", "kode F", "kode *", "array kosong"], kunci: 1 },
    { q: "Jika rekursi sampai di jalur buntu, yang perlu dilakukan adalah…", opsi: ["masuk ke loop", "berhenti semata", "mundur (backtrack) & coba arah lain", "tutup program"], kunci: 2 },
    { q: "Perintah <code>cari(r, c+1)</code> berarti bergerak ke…" , opsi: ["kanan", "kiri", "atas", "bawah"], kunci: 0 },
    { q: "Ketika posisi berisik keluar batas labirin (mis. r < 0), yang harus dilakukan adalah…", opsi: ["return True", "return False", "return tanpa nilai", "walau harus lanjut"], kunci: 1 },
    { q: "Tanda <code>*</code> pada labirin menukalkan jalur yang…", opsi: ["dinding", "sudah dilalui", "tujuan", "titik mulai"], kunci: 1 },
  ],
},
];
