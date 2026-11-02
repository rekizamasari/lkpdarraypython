/* =====================================================================
 * data.js — LKPD Transformasi Geometri (Matematika Kelas XI)
 * 5 modul: Translasi, Refleksi, Rotasi, Dilatasi, Komposisi.
 * Praktik = aktivitas interaktif (input koordinat + kanvas) — auto-check
 * numerik, TANPA editor kode program.
 * =====================================================================
 * Format praktik.checks (tipe baru untuk LKPD non-koding):
 *   { poin, desc, type:"angka", sel:"#id-input", val: 5 }        → |isi − val| ≤ 0.01
 *   { poin, desc, type:"teks",  sel:"#id-input", val:"teks"... } → pencocokan regex (i)
 * ===================================================================== */
const MODUL = [

/* ================= G1: TRANSLASI ================= */
{
  id: "g1",
  nomor: 1,
  judul: "Translasi (Pergeseran)",
  ikon: "➡️",
  ringkas: "Menggeser titik/bangun tanpa mengubah bentuk & ukuran.",
  tujuan: [
    "Menjelaskan definisi translasi sebagai pergeseran sejauh vektor T = (a, b).",
    "Menentukan bayangan titik hasil translasi pada bidang koordinat.",
    "Menentukan vektor translasi jika diketahui titik asal dan bayangannya.",
    "Menggunakan aturan pemetaan T: (x, y) → (x + a, y + b).",
  ],
  teori: `
<p><b>Translasi (pergeseran)</b> memindahkan setiap titik bangun sejauh sama dan searah mengikuti vektor translasi <code>T = (a, b)</code>.</p>
<h4>Aturan pemetaan</h4>
<pre>T = (a, b)      →     P(x, y) → P'(x + a, y + b)</pre>
<h4>Ilustrasi: geser A(1, 2) dengan T = (3, −1)</h4>
<pre> y
 3 │      •(3,2)?  tidak — hitung: x+3=4, y−1=1
 2 │ •A(1,2)
 1 │              • A'(4,1)
 0 └──┬──┬──┬──┬──┬──► x
      0  1  2  3  4</pre>
<div class="info-box hijau">💡 <b>Sifat penting:</b> translasi TIDAK mengubah ukuran, bentuk, maupun orientasi — hanya posisi. Jarak antar titik bangun tetap.</div>
<div class="info-box kuning">⚠️ <b>Hati-hati:</b> vektor <code>(a, b)</code> — nilai <b>ke kanan = a positif</b>, <b>ke kiri = a negatif</b>, ke atas = b positif, ke bawah = b negatif.</div>`,
  langkah: [
    { judul: "Menggeser satu titik", penjelasan: "Tambahkan a ke koordinat-x dan b ke koordinat-y.", kode:
"P = (2, 3)\nT = (3, -1)\nP' = (2+3, 3-1) = (5, 2)" },
    { judul: "Menentukan vektor dari asal & bayangan", penjelasan: "Jika P(1,2) dipetakan ke P'(4,6), vektor T = P' - P.", kode:
"P  = (1, 2)\nP' = (4, 6)\nT  = (4-1, 6-2) = (3, 5)" },
    { judul: "Menggeser segitiga (3 titik sekaligus)", penjelasan: "Geser setiap titik satu per satu dengan vektor yang sama.", kode:
"△ABC:  A(1,1)  B(4,1)  C(2,3)\nT   =  (2, 2)\nA' = (3, 3)\nB' = (6, 3)\nC' = (4, 5)" },
    { judul: "Berulang kali: translasi rangkap (kali)", penjelasan: "Translasi 2× dengan vektor sama = sekali dengan vektor dobel (2a, 2b).", kode:
"T(1,-1) 2 kali ≡ T(2,-2)\nA(0, 3) → A'(2, 1)" },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> hitung bayangan tiap titik dengan translasi <code>T = (4, −3)</code>, tulis di kolom input, dan tekan 👁️ <b>Lihat Visual</b> untuk melihat pergeseran pada kanvas; lalu 📤 <b>Kirim</b>.
<div class="info-box hijau">💡 Titik-titik: <code>A(1, 2)</code>, <code>B(−2, 0)</code>, <code>C(3, −3)</code>.</div>`,
    inputs: `
  <div class="input-row">
    <label>Bayangan A' = ( <input id="g1-a-x" type="number" step="any" style="width:80px" /> , <input id="g1-a-y" type="number" step="any" style="width:80px" /> )</label>
    <label>Bayangan B' = ( <input id="g1-b-x" type="number" step="any" style="width:80px" /> , <input id="g1-b-y" type="number" step="any" style="width:80px" /> )</label>
  </div>
  <div class="input-row">
    <label>Bayangan C' = ( <input id="g1-c-x" type="number" step="any" style="width:80px" /> , <input id="g1-c-y" type="number" step="any" style="width:80px" /> )</label>
    <label>Aturan umum: (x, y) →
      <input id="g1-aturan" type="text" placeholder="(x+4, y-3)" /></label>
  </div>`,
    visual: { jenis: "vektor", asal: [[1, 2], [-2, 0], [3, -3]], tf: [4, -3], labelAsal: ["A", "B", "C"], labelBay: ["A'", "B'", "C'"] },
    checks: [
      { poin: 25, desc: "Bayangan A' benar (5, −1)",             type: "angka", sel: "#g1-a-x", val: 5 },
      { poin: 25, desc: "Bayangan B' benar (2, −3)",             type: "angka", sel: "#g1-b-y", val: -3 },
      { poin: 25, desc: "Bayangan C' benar (7, −6)",             type: "angka", sel: "#g1-c-x", val: 7 },
      { poin: 25, desc: "Aturan umum benar: (x+4, y−3)",         type: "teks",  sel: "#g1-aturan", val: "\\(\\s*x\\s*\\+\\s*4\\s*,.*y\\s*-\\s*3\\s*\\)" },
    ],
  },
  kuis: [
    { q: "Bayangan <code>(2, 1)</code> oleh translasi <code>T = (3, 4)</code> adalah…", opsi: ["(5, 5)", "(1, 3)", "(6, −3)", "(−5, −5)"], kunci: 0 },
    { q: "Aturan translasi <code>T = (−2, 5)</code> adalah…", opsi: ["(x, y) → (x − 2, y + 5)", "(x, y) → (x + 2, y − 5)", "(x, y) → (2x, 5y)", "(x, y) → (5x, −2y)"], kunci: 0 },
    { q: "Jika <code>P(1, −2)</code> dipetakan ke <code>P'(−3, 1)</code>, vektor translasinya adalah…", opsi: ["T = (−4, 3)", "T = (4, −3)", "T = (−4, −3)", "T = (3, 3)"], kunci: 0 },
    { q: "Translasi mengubah <b>UKURAN</b> bangun (besar/kecilnya)?", opsi: ["Ya, berubah", "Tidak, UKURAN tetap", "Ya, jika vektor negatif", "Tergantung posisi"], kunci: 1 },
    { q: "Sebuah titik digeser <b>5 unit ke kiri</b> lalu <b>2 unit ke bawah</b>; vektor translasinya sama dengan…", opsi: ["T = (5, −2)", "T = (−5, −2)", "T = (−5, 2)", "T = (5, 2)"], kunci: 1 },
    { q: "Segitiga <code>A(0,0), B(3,0), C(0,4)</code> digeser dengan <code>T = (1, 1)</code>. Panjang rusuk AB' (garis AB setelah translasi) adalah…", opsi: ["3", "4", "5", "6"], kunci: 0 },
  ],
},

/* ================= G2: REFLEKSI ================= */
{
  id: "g2",
  nomor: 2,
  judul: "Refleksi (Pencerminan)",
  ikon: "🪞",
  ringkas: "Mencerminkan titik/bangun terhadap garis tertentu.",
  tujuan: [
    "Mengidentifikasi bayangan titik terhadap sumbu X, sumbu Y, garis y = x, dan y = −x.",
    "Menggunakan aturan pemetaan refleksi untuk menghitung bayangan.",
    "Menentukan garis refleksi dari pasangan titik asal dan bayangan.",
  ],
  teori: `
<p><b>Refleksi (pencerminan)</b> memindahkan titik ke posisi cermin di seberang garis (cermin). Jarak titik ke cermin = jarak bayangan ke cermin.</p>
<h4>Empat aturan dasar (cermin) yang WAJIB hafal</h4>
<pre>Refleksi [sumbu X] : (x, y) → ( x, −y)‏
Refleksi [sumbu Y] : (x, y) → (−x,  y)‏
Refleksi [y =  x]  : (x, y) → ( y,  x)‏
Refleksi [y = −x]  : (x, y) → (−y, −x)‏</pre>
<div class="info-box kuning">⚠️ <b>Jangan tertukar:</b> refleksi <b>sumbu X</b> membalik <b>y</b> (x tetap); refleksi <b>sumbu Y</b> membalik <b>x</b> (y tetap).</div>
<div class="info-box hijau">💡 <b>Tips y = x:</b> tinggal <i>tukar tempat</i> koordinat. Titik di garis cermin (mis. (2,2) pada y=x) TIDAK berpindah!</div>`,
  langkah: [
    { judul: "Refleksi terhadap sumbu X", penjelasan: "y dibalik tandanya; x tetap.", kode:
"P = (3, 4)\nP' = (3, -4)   ← refleksi sumbu X" },
    { judul: "Refleksi terhadap sumbu Y", penjelasan: "x dibalik tandanya; y tetap.", kode:
"Q = (-2, 5)\nQ' = (2, 5)    ← refleksi sumbu Y" },
    { judul: "Refleksi terhadap garis y = x", penjelasan: "Tukar posisi x dan y.", kode:
"R = (1, 7)\nR' = (7, 1)    ← refleksi y = x" },
    { judul: "Refleksi terhadap garis y = -x", penjelasan: "Tukar posisi lalu balik keduanya.", kode:
"S = (2, 5)\nS' = (-5, -2)  ← refleksi y = -x" },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> kerjakan 4 pencerminan berikut (garis cermin tercatat di samping tiap input). Lihat hasilnya di kanvas 👁️.
<div class="info-box hijau">💡 Titik: <code>P(3, 4)</code> ke sumbu X · <code>Q(−2, 5)</code> ke sumbu Y · <code>R(1, 7)</code> ke y = x · <code>S(2, 5)</code> ke y = −x.</div>`,
    inputs: `
  <div class="input-row">
    <label>P' terhadap sumbu X = ( <input id="g2-p-x" type="number" step="any" style="width:80px" /> , <input id="g2-p-y" type="number" step="any" style="width:80px" /> )</label>
    <label>Q' terhadap sumbu Y = ( <input id="g2-q-x" type="number" step="any" style="width:80px" /> , <input id="g2-q-y" type="number" step="any" style="width:80px" /> )</label>
  </div>
  <div class="input-row">
    <label>R' terhadap y = x = ( <input id="g2-r-x" type="number" step="any" style="width:80px" /> , <input id="g2-r-y" type="number" step="any" style="width:80px" /> )</label>
    <label>S' terhadap y = −x = ( <input id="g2-s-x" type="number" step="any" style="width:80px" /> , <input id="g2-s-y" type="number" step="any" style="width:80px" /> )</label>
  </div>`,
    visual: {
      jenis: "refleksi",
      asal: [[3, 4], [-2, 5], [1, 7], [2, 5]],
      baySel: [["#g2-p-x", "#g2-p-y"], ["#g2-q-x", "#g2-q-y"], ["#g2-r-x", "#g2-r-y"], ["#g2-s-x", "#g2-s-y"]],
      garis: ["sumbuX", "sumbuY", "yx", "ynegx"],
      labelAsal: ["P", "Q", "R", "S"], labelBay: ["P'", "Q'", "R'", "S'"],
    },
    checks: [
      { poin: 25, desc: "P' = (3, −4)",        type: "angka", sel: "#g2-p-y", val: -4 },
      { poin: 25, desc: "Q' = (2, 5)",         type: "angka", sel: "#g2-q-x", val: 2 },
      { poin: 25, desc: "R' = (7, 1)",         type: "angka", sel: "#g2-r-x", val: 7 },
      { poin: 25, desc: "S' = (−5, −2)",       type: "angka", sel: "#g2-s-x", val: -5 },
    ],
  },
  kuis: [
    { q: "Bayangan <code>(5, −2)</code> setelah refleksi terhadap <b>sumbu X</b> adalah…", opsi: ["(5, 2)", "(−5, −2)", "(−5, 2)", "(−2, 5)"], kunci: 0 },
    { q: "Bayangan <code>(5, −2)</code> setelah refleksi terhadap <b>sumbu Y</b> adalah…", opsi: ["(5, 2)", "(−5, −2)", "(−2, 5)", "(2, −5)"], kunci: 1 },
    { q: "Bayangan <code>(2, 7)</code> setelah refleksi terhadap garis <code>y = x</code> adalah…", opsi: ["(−7, −2)", "(2, 7)", "(7, 2)", "(−2, −7)"], kunci: 2 },
    { q: "Refleksi <code>(x, y) → (−y, −x)</code> dilakukan terhadap cermin garis…", opsi: ["y = x", "y = −x", "sumbu X", "sumbu Y"], kunci: 1 },
    { q: "Titik <code>(4, 4)</code> direfleksikan terhadap garis <code>y = x</code>; bayangannya adalah…", opsi: ["(−4, 4)", "(4, −4)", "(4, 4)", "(−4, −4)"], kunci: 2 },
    { q: "Jika bayangan sebuah titik <code>(−3, 6)</code> adalah <code>(3, 6)</code>, cermin yang dipakai adalah…", opsi: ["sumbu X", "sumbu Y", "y = x", "y = −x"], kunci: 1 },
  ],
},

/* ================= G3: ROTASI ================= */
{
  id: "g3",
  nomor: 3,
  judul: "Rotasi (Perputaran)",
  ikon: "🔄",
  ringkas: "Memutar titik/bangun terhadap pusat & sudut tertentu.",
  tujuan: [
    "Menyebutkan aturan rotasi berlawanan arah jarum jam: 90°, 180°, 270° terhadap pusat O(0,0).",
    "Memakai aturan rotasi searah jarum jam (sudut negatif).",
    "Memutar sederhana untuk pusat bukan origin.",
  ],
  teori: `
<p><b>Rotasi (perputaran)</b> memutar titik sejauh sudut tertentu <b>terhadap satu titik pusat</b>. Pusat rotasi <i>tidak berpindah</i>. Sudut <b>positif = berlawanan arah jarum jam</b>, <b>negatif = searah jarum jam</b>.</p>
<h4>Rotasi pusat O(0, 0) — hafalkan tabel berikut!</h4>
<pre>R90°  : (x, y) → (−y,  x)        R−90° : (x, y) → ( y, −x)
R180° : (x, y) → (−x, −y)        R270° : (x, y) → ( y, −x)</pre>
<h4>Ilustrasi: B(4, 3) diputar 90° pusat O</h4>
<pre>  y
 4 │        •B'(−3, 4)
 3 │              • B(4,3)
 2 │
 1 │
 0 └──┬────┬────► x
      0    4,
B' membentuk 90° berlawanan jarum jam dari B</pre>
<div class="info-box kuning">⚠️ R−90° = R270° (hasil pemetaan sama) — karena memutar 90° searah jarum jam sama dengan 270° berlawanan jarum jam.</div><div class="info-box hijau">💡 <b>Pusat bukan origin P(a, b):</b> geser pusat ke origin dulu, putar, lalu kembalikan — mis. R90° pusat P(a, b): (x, y) → (a − (y − b), b + (x − a))</div>`,
  langkah: [
    { judul: "Rotasi 90° pusat O", penjelasan: "(x, y) → (−y, x): koordinat bertukar tempat, dan koordinat-x baru diberi tanda negatif.", kode:
"B = (4, 3)\nB' = (-3, 4)    ← R90° pusat O" },
    { judul: "Rotasi 180° pusat O", penjelasan: "Kedua koordinat dilawankan tandanya (titik antipoda).", kode:
"C = (2, 5)\nC' = (-2, -5)   ← R180° pusat O" },
    { judul: "Rotasi −90° (searah jarum jam)", penjelasan: "(x, y) → (y, −x): koordinat bertukar tempat, dan koordinat-y baru diberi tanda negatif.", kode:
"D = (0, -2)\nD' = (-2, 0)    ← R−90° pusat O" },
    { judul: "Rotasi pusat P(1, 1) sejauh 180°", penjelasan: "Titik dibalik terhadap pusat: E' = P − (E − P); jarak ke pusat tetap.", kode:
"E = (3, 4), pusat P(1,1), 180°\nE − P = (3-1, 4-1) = (2, 3)\nE'    = P − (2, 3) = (1-2, 1-3) = (-1, -2)" },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> hitung bayangan tiap titik dan tuliskan; gunakan 👁️ untuk melihat posisi bayangan di kanvas.
<div class="info-box hijau">💡 Soal: <code>A(2, 1)</code> R90° pusat O · <code>B(4, 3)</code> R90° pusat O · <code>C(2, 5)</code> R180° pusat O · <code>D(0, −2)</code> R−90° pusat O.</div>`,
    inputs: `
  <div class="input-row">
    <label>A' (R90°) = ( <input id="g3-a-x" type="number" step="any" style="width:80px" /> , <input id="g3-a-y" type="number" step="any" style="width:80px" /> )</label>
    <label>B' (R90°) = ( <input id="g3-b-x" type="number" step="any" style="width:80px" /> , <input id="g3-b-y" type="number" step="any" style="width:80px" /> )</label>
  </div>
  <div class="input-row">
    <label>C' (R180°) = ( <input id="g3-c-x" type="number" step="any" style="width:80px" /> , <input id="g3-c-y" type="number" step="any" style="width:80px" /> )</label>
    <label>D' (R−90°) = ( <input id="g3-d-x" type="number" step="any" style="width:80px" /> , <input id="g3-d-y" type="number" step="any" style="width:80px" /> )</label>
  </div>`,
    visual: {
      jenis: "rotasi",
      asal: [[2, 1], [4, 3], [2, 5], [0, -2]],
      baySel: [["#g3-a-x", "#g3-a-y"], ["#g3-b-x", "#g3-b-y"], ["#g3-c-x", "#g3-c-y"], ["#g3-d-x", "#g3-d-y"]],
      pusat: [0, 0],
      labelAsal: ["A", "B", "C", "D"], labelBay: ["A'", "B'", "C'", "D'"],
    },
    checks: [
      { poin: 25, desc: "A' = (−1, 2)",        type: "angka", sel: "#g3-a-x", val: -1 },
      { poin: 25, desc: "B' = (−3, 4)",        type: "angka", sel: "#g3-b-x", val: -3 },
      { poin: 25, desc: "C' = (−2, −5)",       type: "angka", sel: "#g3-c-x", val: -2 },
      { poin: 25, desc: "D' = (−2, 0)",        type: "angka", sel: "#g3-d-x", val: -2 },
    ],
  },
  kuis: [
    { q: "Aturan rotasi 90° berlawanan arah jarum jam pusat O(0,0) adalah…", opsi: ["(x, y) → (y, x)", "(x, y) → (−y, x)", "(x, y) → (y, −x)", "(x, y) → (−x, −y)"], kunci: 1 },
    { q: "Bayangan <code>(3, 1)</code> diputar 90° pusat O menghasilkan…", opsi: ["(1, −3)", "(−1, 3)", "(−3, −1)", "(3, −1)"], kunci: 1 },
    { q: "Bayangan <code>(−2, 4)</code> diputar <b>180°</b> pusat O menghasilkan…", opsi: ["(2, −4)", "(4, 2)", "(−4, −2)", "(2, 4)"], kunci: 0 },
    { q: "Rotasi 90° <b>searah jarum jam</b> (R−90°) setara atas rotasi sebesar…", opsi: ["R90°", "R180°", "R270°", "R360°"], kunci: 2 },
    { q: "Rotasi pusat O 360° menghasilkan…", opsi: ["titik kembali ke posisi semula", "titik berpindah 1 kuadran", "titik jadi refleksi", "titik berpindah ke pusat"], kunci: 0 },
    { q: "Bayangan <code>(0, 5)</code> diputar R90° pusat O adalah…", opsi: ["(5, 0)", "(−5, 0)", "(0, −5)", "(−0, 5)"], kunci: 1 },
  ],
},

/* ================= G4: DILATASI ================= */
{
  id: "g4",
  nomor: 4,
  judul: "Dilatasi (Perkalian Skala)",
  ikon: "🔍",
  ringkas: "Membesarkan/mengecilkan bangun terhadap pusat dengan faktor k.",
  tujuan: [
    "Memakai aturan dilatasi pusat O dengan faktor k: (x, y) → (k·x, k·y).",
    "Membedakan dilatasi k > 1 (besar), 0 < k < 1 (kecil), dan k negatif (balik arah).",
    "Menghitung bayangan titik dan memahami sifat jarak & luas (×k dan ×k²).",
  ],
  teori: `
<p><b>Dilatasi (perkalian skala)</b> mengalikan jarak setiap titik terhadap <b>pusat</b> dengan faktor skala <code>k</code>.</p>
<h4>Dilatasi pusat O(0, 0)</h4>
<pre>D[O, k] : (x, y) → (k·x, k·y)</pre>
<h4>Makna faktor k</h4>
<pre>k  = 2     → bangun membesar 2×
k  = ½     → bangun mengecil separuh
k  = −2    → membesar 2× DAN terbalik arah (plus rotasi 180°)
k  = 1     → tidak berubah (identitas)
k  = 0     → seluruh titik jatuh ke pusat (bangun menyusut jadi satu titik)</pre>
<div class="info-box hijau">💡 <b>Sifat-sifat:</b> jarak titik ke pusat jadi <b>k× jarak</b>; panjang rusuk jadi <b>k× panjang</b>; LUAS bangun jadi <b>k² × luas</b>.</div>
<div class="info-box merah">🔴 <b>Jebakan:</b> dilatasi pusat <b>tidak di origin</b> — <b>titik pusat sendiri TIDAK bergerak</b> (invarian). Mis. pusat P(2,1), titik P itu sendiri tetap (2,1) apapun nilai k.</div>`,
  langkah: [
    { judul: "Dilatasi pusat O, k = 2", penjelasan: "Setiap koordinat dikali 2.", kode:
"A = (1, 1)\nA' = (2, 2)      ← D[O, 2]" },
    { judul: "Dilatasi pusat O, k = ½", penjelasan: "Tiap koordinat dikali ½ (bangun mengecil).", kode:
"B = (-3, 2)\nB' = (-1.5, 1)  ← D[O, ½]" },
    { judul: "Dilatasi pusat O, k = −2", penjelasan: "Kali −2: membesar & terbalik arah terhadap pusat.", kode:
"C = (1, 2)\nC' = (-2, -4)   ← D[O, −2]" },
    { judul: "Dilatasi pusat P(1, 1), k = 2", penjelasan: "Tiga tahap: geser → skalakan → kembalikan. Trik: (x−1, y−1) × 2 + (1, 1).", kode:
"D = (3, 4), pusat P(1,1), k=2\n(geser)     D−P : (2, 3)\n(skalakan)  ×2  : (4, 6)\n(kembalikan) +P  : (5, 7)\nD' = (5, 7)" },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> hitung bayangan berikut dan masukkan. Semua dilatasi <b>pusat O(0,0)</b>.
<div class="info-box hijau">💡 Soal: <code>A(1,1)</code> k=2 · <code>B(−3,2)</code> k=2 · <code>C(4,−6)</code> k=½ · <code>D(1,2)</code> k=−2.</div>`,
    inputs: `
  <div class="input-row">
    <label>A' (k=2) = ( <input id="g4-a-x" type="number" step="any" style="width:80px" /> , <input id="g4-a-y" type="number" step="any" style="width:80px" /> )</label>
    <label>B' (k=2) = ( <input id="g4-b-x" type="number" step="any" style="width:80px" /> , <input id="g4-b-y" type="number" step="any" style="width:80px" /> )</label>
  </div>
  <div class="input-row">
    <label>C' (k=½) = ( <input id="g4-c-x" type="number" step="any" style="width:80px" /> , <input id="g4-c-y" type="number" step="any" style="width:80px" /> )</label>
    <label>D' (k=−2) = ( <input id="g4-d-x" type="number" step="any" style="width:80px" /> , <input id="g4-d-y" type="number" step="any" style="width:80px" /> )</label>
  </div>`,
    visual: {
      jenis: "dilatasi",
      asal: [[1, 1], [-3, 2], [4, -6], [1, 2]],
      faktor: [2, 2, 0.5, -2],
      pusat: [0, 0],
      labelAsal: ["A", "B", "C", "D"], labelBay: ["A'", "B'", "C'", "D'"],
    },
    checks: [
      { poin: 25, desc: "A' = (2, 2)",        type: "angka", sel: "#g4-a-x", val: 2 },
      { poin: 25, desc: "B' = (−6, 4)",       type: "angka", sel: "#g4-b-x", val: -6 },
      { poin: 25, desc: "C' = (2, −3)",       type: "angka", sel: "#g4-c-x", val: 2 },
      { poin: 25, desc: "D' = (−2, −4)",      type: "angka", sel: "#g4-d-x", val: -2 },
    ],
  },
  kuis: [
    { q: "Aturan dilatasi pusat <code>O(0,0)</code> dengan faktor <code>k</code> adalah…", opsi: ["(x, y) → (k+x, k+y)", "(x, y) → (k·x, k·y)", "(x, y) → (x/k, y/k)", "(x, y) → (x, y)"], kunci: 1 },
    { q: "Bayangan <code>(6, 4)</code> oleh <code>D[O, ½]</code> adalah…", opsi: ["(12, 8)", "(3, 2)", "(6, 4)", "(−3, −2)"], kunci: 1 },
    { q: "Dilatasi dengan <code>k = −2</code> berakibat…", opsi: ["hanya memperbesar", "hanya membalik", "membesar 2× dan terbalik (rotasi 180°)", "menghilangkan bangun"], kunci: 2 },
    { q: "Luas bangun setelah dilatasi faktor <code>k = 3</code> membesar menjadi…", opsi: ["3× luas semula", "6× luas semula", "9× luas semula", "tetap"], kunci: 2 },
    { q: "Bagaimana dengan <b>titik pusat</b> dilatasi?", opsi: ["ikut berpindah", "tetap di tempat (invarian)", "berpindah k×", "berpindah ke origin"], kunci: 1 },
    { q: "Bayangan <code>(−1, 5)</code> dengan <code>D[O, −1]</code> adalah…", opsi: ["(−1, 5)", "(1, −5)", "(−1, −5)", "(5, −1)"], kunci: 1 },
  ],
},

/* ================= G5: KOMPOSISI ================= */
{
  id: "g5",
  nomor: 5,
  judul: "Studi Kasus: Komposisi Transformasi",
  ikon: "🧩",
  ringkas: "Kombinasi dua transformasi → urutan pengerjaan penting!",
  tujuan: [
    "Menentukan bayangan akhir dari komposisi dua transformasi.",
    "Memahami bahwa urutan pengerjaan komposisi mempengaruhi hasil (T∘R ≠ R∘T secara umum).",
    "Menerapkan komposisi pada studi kasus otentik: animasi &amp; pola batik.",
  ],
  teori: `
<p><b>Komposisi transformasi</b> = dua transformasi dikerjakan berurutan. Penulisan <code>(T ∘ R)(P)</code> berarti <b>R dikerjakan dulu</b>, lalu hasilnya ditranslasi oleh <code>T</code>.</p>
<pre>P ──R──► P₁ ──T──► P'     berarti: (T ∘ R)(P)</pre>
<div class="info-box kuning">⚠️ <b>Urutan penting!</b> Umumnya <code>T ∘ R ≠ R ∘ T</code>. Cobakan sendiri dengan A(1,3) di langkah 1!</div>
<h4>Ilustrasi: R90° lalu T(2, −1) terhadap A(1, 3)</h4>
<pre>A(1,3) ──R90°──► (−3, 1) ──T(2,−1)──► (−1, 0)</pre>
<div class="info-box hijau">💡 Bila kedua transformasi dilatasi pusat sama, komposisinya adalah satu dilatasi baru: <code>D[O,k₂] ∘ D[O,k₁] = D[O, k₁·k₂]</code>.</div>
<div class="info-box kuning">🌍 <b>Studi kasus nyata:</b> pola batik khas (dibangun dari refleksi/komposisi), animasi karakter dalam game — semua memakai komposisi transformasi!</div>`,
  langkah: [
    { judul: "R90° lalu T(2, −1) terhadap A(1, 3)", penjelasan: "R dulu, T kemudian. Jawaban akhir akan jadi salah satu soal praktik.", kode:
"A = (1, 3)\nTahap 1  R90° : (1,3) → (-3, 1)\nTahap 2  T(2,-1): (-3,1) → (-1, 0)\nHasil: A' = (-1, 0)" },
    { judul: "Sekarang balik: T(2,−1) DULU, baru R90°", penjelasan: "Hasil berbeda dengan Langkah 1 — bukti urutan penting!", kode:
"A = (1, 3)\nTahap 1  T(2,-1): (1,3) → (3, 2)\nTahap 2  R90° : (3,2) → (-2, 3)\nHasil: A' = (-2, 3)   ≠ (-1, 0)  🚦" },
    { judul: "Refleksi sumbu X lalu refleksi y = x", penjelasan: "Dua refleksi berurutan = satu rotasi. Berguna: banyak pola rumit = komposisi sederhana.", kode:
"B = (2, 2)\nTahap 1 refleksi sumbuX: (2,2) → (2,-2)\nTahap 2 refleksi y=x   : (2,-2) → (-2, 2)\nHasil B' = (-2, 2)\nCek: R90° terhadap (2,2) = (-2, 2) ✓ — dua refleksi ini sama dengan rotasi 90° pusat O" },
    { judul: "Komposisi dilatasi", penjelasan: "Dua dilatasi pusat sama = satu dilatasi dengan faktor hasil kali.", kode:
"C = (1, 2)\nD[O,3] ∘ D[O,2] :  C → (2,4) → (6, 12)\n≡ D[O, 6]: C → (6, 12)  ✓" },
  ],
  praktik: {
    deskripsi: `<b>Misi praktik:</b> lakukan komposisi <code>R90°</code> (pusat O) <b>lalu</b> <code>T(2, −1)</code> terhadap <code>A(1, 3)</code>; tulis hasil <b>tahap 1 (setelah R90°)</b> dan <b>hasil akhir</b>. Lalu satu lagi: <code>B(2, 2)</code> dengan <code>refleksi sumbu X</code> dulu, dilanjutkan <code>refleksi y = x</code>; tulis <b>kembali hasil akhir B'</b>. Pertanyaan terakhir soal pentingnya urutan — pilih jawaban pada dropdown.
<div class="info-box hijau">💡 Kerjakan dengan penulisan matematika di kertas (tulis tahap demi tahap, seperti contoh di materi)!</div>`,
    inputs: `
  <div class="input-row">
    <label>A tahap 1 (setelah R90°) = ( <input id="g5-a1-x" type="number" step="any" style="width:80px" /> , <input id="g5-a1-y" type="number" step="any" style="width:80px" /> )</label>
    <label>A hasil akhir (setelah T) = ( <input id="g5-a2-x" type="number" step="any" style="width:80px" /> , <input id="g5-a2-y" type="number" step="any" style="width:80px" /> )</label>
  </div>
  <div class="input-row">
    <label>B hasil akhir (R-refl-X lalu R-refleksi y=x) = ( <input id="g5-b-x" type="number" step="any" style="width:80px" /> , <input id="g5-b-y" type="number" step="any" style="width:80px" /> )</label>
    <label>Apakah urutan komposisi mempengaruhi hasil?
      <select id="g5-konsep"><option value="">— pilih —</option><option>Ya, umumnya mempengaruhi</option><option>Tidak, selalu sama</option><option>Tergantung warna bangun</option></select></label>
  </div>`,
    visual: {
      jenis: "komposisi",
      asal: [[1, 3], [2, 2]],
      tahap1: [[-3, 1], [2, -2]],
      baySel: [["#g5-a2-x", "#g5-a2-y"], ["#g5-b-x", "#g5-b-y"]],
      labelAsal: ["A", "B"], labelTahap: ["A₁", "B₁"], labelBay: ["A'", "B'"],
    },
    checks: [
      { poin: 20, desc: "A tahap 1 (setelah R90°) = (−3, 1)",     type: "angka", sel: "#g5-a1-x", val: -3 },
      { poin: 25, desc: "A hasil akhir = (−1, 0)",                type: "angka", sel: "#g5-a2-x", val: -1 },
      { poin: 30, desc: "B hasil akhir = (−2, 2)",                type: "angka", sel: "#g5-b-x", val: -2 },
      { poin: 25, desc: "Konsep: urutan komposisi berpengaruh",   type: "teks",  sel: "#g5-konsep", val: "Ya, umumnya mempengaruhi" },
    ],
  },
  kuis: [
    { q: "Notasi <code>(T ∘ R)(P)</code> berarti…", opsi: ["T dikerjakan dulu lalu R", "R dikerjakan dulu, lalu hasilnya di-T", "T dan R bersamaan", "hanya T yang bekerja"], kunci: 1 },
    { q: "<code>A(1, 3)</code> → R90° → T(2, −1). Hasil akhirnya adalah…", opsi: ["(−1, 0)", "(−2, 3)", "(3, 2)", "(0, −1)"], kunci: 0 },
    { q: "<code>A(1, 3)</code> → T(2, −1) dulu → R90°. Hasil akhirnya adalah…", opsi: ["(−1, 0)", "(−2, 3)", "(3, 2)", "(−3, 1)"], kunci: 1 },
    { q: "Dua refleksi berurutan terhadap dua garis yang <b>bersilangan</b> (memotong) menghasilkan…", opsi: ["refleksi lagi", "translasi", "rotasi", "dilatasi"], kunci: 2 },
    { q: "<code>D[O,3] ∘ D[O,2]</code> = …", opsi: ["D[O,5]", "D[O,6]", "D[O,9]", "D[O,½]"], kunci: 1 },
    { q: "Dalam animasi grafis, manfaat komposisi transformasi adalah…", opsi: ["membuat animasi lebih lambat", "menggambar bentuk rumit dari kombinasi gerakan sederhana (geser, putar, besarkan)", "menghilangkan data", "mengganti warna otomatis"], kunci: 1 },
  ],
},
];

/* =====================================================================
 * KUIS AKHIR — 20 soal (4 dari tiap modul), durasi 20 menit.
 * ===================================================================== */
const KUIS_AKHIR = {
  id: "geo-final",
  judul: "Kuis Akhir — Ujian Terpadu Transformasi Geometri",
  ikon: "🏁",
  durasiMenit: 20,
  soal: [
    { q: "Translasi — Bayangan <code>(−1, 4)</code> oleh <code>T = (5, −2)</code> adalah…", opsi: ["(4, 2)", "(−6, 6)", "(5, −2)", "(4, −2)"], kunci: 0 },
    { q: "Translasi — Jika <code>P(2, 3)</code> dipetakan ke <code>P'(8, 1)</code>, vektor T adalah…", opsi: ["(10, 4)", "(6, −2)", "(−6, 2)", "(−6, −2)"], kunci: 1 },
    { q: "Translasi — Bangun hasil translasi <b>tidak</b> mengalami perubahan dalam…", opsi: ["posisi", "ukuran & bentuk", "nama titik", "warna koordinat"], kunci: 1 },
    { q: "Translasi — Titik <code>(0, 0)</code> digeser 3× dengan vektor <code>(1, −1)</code> berakhir di…", opsi: ["(3, −3)", "(1, −1)", "(−3, 3)", "(3, 1)"], kunci: 0 },
    { q: "Refleksi — Bayangan <code>(−4, 7)</code> terhadap <b>sumbu X</b> adalah…", opsi: ["(7, −4)", "(4, 7)", "(−4, −7)", "(4, −7)"], kunci: 2 },
    { q: "Refleksi — Bayangan <code>(−4, 7)</code> terhadap <b>sumbu Y</b> adalah…", opsi: ["(−4, −7)", "(4, 7)", "(7, −4)", "(4, −7)"], kunci: 1 },
    { q: "Refleksi — Bayangan <code>(−4, 7)</code> terhadap garis <code>y = x</code> adalah…", opsi: ["(7, −4)", "(−7, 4)", "(−4, 7)", "(4, −7)"], kunci: 0 },
    { q: "Refleksi — <code>(x, y) → (y, x)</code> adalah refleksi terhadap garis…", opsi: ["y = −x", "sumbu X", "sumbu Y", "y = x"], kunci: 3 },
    { q: "Rotasi — <code>(2, −5)</code> diputar 90° pusat O menjadi…", opsi: ["(5, 2)", "(−5, −2)", "(−2, −5)", "(5, −2)"], kunci: 0 },
    { q: "Rotasi — <code>(2, −5)</code> diputar 180° pusat O menjadi…", opsi: ["(−2, 5)", "(5, 2)", "(−5, −2)", "(2, 5)"], kunci: 0 },
    { q: "Rotasi — <code>R−90°</code> setara dengan…", opsi: ["R270°", "R180°", "R90°", "R45°"], kunci: 0 },
    { q: "Rotasi — Titik yang diputar 360° terhadap pusat mana pun akan…", opsi: ["berpindah 1 lingkaran", "kembali ke posisi semula", "jadi pantulan", "pindah ke pusat"], kunci: 1 },
    { q: "Dilatasi — Bayangan <code>(2, 3)</code> oleh <code>D[O, 4]</code> adalah…", opsi: ["(8, 12)", "(6, 7)", "(8, 3)", "(2, 12)"], kunci: 0 },
    { q: "Dilatasi — Bayangan <code>(2, 3)</code> oleh <code>D[O, ½]</code> adalah…", opsi: ["(4, 6)", "(1, 1.5)", "(1, 3)", "(0.5, 0.75)"], kunci: 1 },
    { q: "Dilatasi — Jika panjang rusuk segitiga jadi <b>3×</b> semula, luasnya menjadi…", opsi: ["3×", "6×", "9×", "27×"], kunci: 2 },
    { q: "Dilatasi — <code>D[P, k]</code> dengan segala k, titik-titik yang TIDAK berpindah adalah…", opsi: ["semua titik di sumbu X", "titik pusat P", "titik di garis y=x", "titik asal O selalu"], kunci: 1 },
    { q: "Komposisi — <code>(T ∘ R)(P)</code> berarti transformasi yang dikerjakan DULU adalah…", opsi: ["T", "R", "keduanya sekaligus", "tergantung titik P"], kunci: 1 },
    { q: "Komposisi — <code>A(1, 3)</code>: R90° lalu T(2, −1) menghasilkan…", opsi: ["(−2, 3)", "(−1, 0)", "(3, 2)", "(0, −1)"], kunci: 1 },
    { q: "Komposisi — <code>D[O,3] ∘ D[O,2]</code> ekuivalen dengan…", opsi: ["D[O,5]", "D[O,6]", "D[O,1]", "D[O,9]"], kunci: 1 },
    { q: "Komposisi — Manfaat komposisi transformasi dalam kehidupan (contoh nyata) adalah…", opsi: ["menambah berat file", "pola batik 2D & animasi film", "menghitung gaji", "mempercepat internet"], kunci: 1 },
  ],
};
