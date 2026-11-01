/* =====================================================================
 * siswa.js — Logika dashboard siswa:
 *  • Menampilkan 5 modul + progress pribadi
 *  • Menjalankan kode Python lewat Pyodide (di browser)
 *  • Auto-check praktik → nilai otomatis (0–100) → simpan ke Supabase
 *  • Kuis pilihan ganda → auto-grading → simpan ke Supabase
 * ===================================================================== */
const $ = (id) => document.getElementById(id);
const sb = initSupabase();
let user = null, profil = null, pyodide = null, chartM4 = null;

/* ---------- STARTUP ---------- */
(async () => {
  user = await requireLogin();
  if (!user) return;
  profil = await getProfile(user.id);
  $("profil-nama").textContent = "👤 " + (profil?.nama || "Siswa");
  $("profil-kelas").textContent = "🏫 Kelas " + (profil?.kelas?.nama || "X-A");
  $("salam").innerHTML = `<div class="lec-panel" style="border-left:4px solid var(--aqua)">
    <h4>Selamat datang, ${profil?.nama || "Siswa"}! 👋</h4>
    <p class="muted">Selesaikan 5 modul di bawah. Setiap modul berisi: <b>materi → langkah berkode → praktik (dinilai otomatis) → kuis</b>.
    Nilainya langsung masuk ke dashboard guru.</p></div>`;
  await muatProgres();
  renderModul();
  latarKonfigurasi();
})();

$("btn-logout").onclick = doLogout;
$("btn-tutup").onclick = tutupModal;

/* ---------- PYODIDE ---------- */
async function muatPyodide() {
  if (pyodide) return pyodide;
  pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });
  $("pyodide-status").innerHTML = "✅ <b>Lingkungan Python siap!</b> Kode Python dijalankan langsung di browser Anda.";
  $("pyodide-status").className = "info-box hijau";
  return pyodide;
}

/* ---------- PROGRES NILAI ---------- */
let nilaiSaya = {};          // { m1: { praktik, kuis }, ... }
let langkahSaya = {};        // { m1: [l0,l1,..], ... }

async function muatProgres() {
  nilaiSaya = {}; langkahSaya = {};
  const [subs, quis, prog] = await Promise.all([
    sb.from("submissions").select("module_id, nilai, created_at").eq("student_id", user.id),
    sb.from("quiz_results").select("module_id, nilai, benar, total, created_at").eq("student_id", user.id),
    sb.from("progress").select("module_id, step_id").eq("student_id", user.id),
  ]);
  (subs.data || []).forEach(s => {
    if (!nilaiSaya[s.module_id]) nilaiSaya[s.module_id] = {};
    // simpan nilai praktik terbaik
    const sekarang = nilaiSaya[s.module_id].praktik ?? -1;
    nilaiSaya[s.module_id].praktik = Math.max(sekarang, s.nilai);
  });
  (quis.data || []).forEach(q => {
    if (!nilaiSaya[q.module_id]) nilaiSaya[q.module_id] = {};
    nilaiSaya[q.module_id].kuis = Math.max(nilaiSaya[q.module_id].kuis ?? -1, q.nilai);
  });
  (prog.data || []).forEach(p => {
    (langkahSaya[p.module_id] = langkahSaya[p.module_id] || []).push(p.step_id);
  });
}

async function simpanLangkah(moduleId, stepId) {
  const sudah = (langkahSaya[moduleId] || []).includes(stepId);
  if (sudah) return;
  await sb.from("progress").upsert({
    student_id: user.id, module_id: moduleId, step_id: stepId, status: "selesai"
  }, { onConflict: "student_id,module_id,step_id" });
  (langkahSaya[moduleId] = langkahSaya[moduleId] || []).push(stepId);
  renderModul();
}

/* ---------- LIST MODUL ---------- */
function nilaiModul(m) {
  const n = nilaiSaya[m.id] || {};
  const praktik = n.praktik, kuis = n.kuis;
  const p = (praktik ?? 0) * 0.5 + (kuis ?? 0) * 0.5; // bobot 50:50
  return { praktik, kuis, akhir: Math.round(p) };
}

function renderModul() {
  $("daftar-modul").innerHTML = MODUL.map(m => {
    const steps = m.langkah.length;
    const dilakukan = (langkahSaya[m.id] || []).filter(s => s.startsWith("l")).length;
    const n = nilaiModul(m);
    const banyak = steps + 2; // semua langkah + praktik + kuis
    const kerjakan = dilakukan + ((langkahSaya[m.id] || []).includes("p") ? 1 : 0)
                   + ((langkahSaya[m.id] || []).includes("k") ? 1 : 0);
    const pct = Math.round(kerjakan / banyak * 100);
    return `<div class="modul-card" onclick="bukaModul('${m.id}')">
      <span class="modul-num">MODUL ${m.nomor}</span>
      <h3>${m.ikon} ${m.judul}</h3>
      <p class="muted" style="font-size:.85rem">${m.ringkas}</p>
      <div class="progress-bar"><div style="width:${pct}%"></div></div>
      <span class="nilai-badge">
        📚 ${kerjakan}/${banyak} selesai &nbsp;|&nbsp;
        🧪 praktik ${n.praktik === undefined ? "–" : n.praktik} &nbsp;|&nbsp;
        📝 kuis ${n.kuis === undefined ? "–" : n.kuis} &nbsp;|&nbsp; ⭐ ${n.akhir}
      </span></div>`;
  }).join("") + renderKartuFinal();
}

/* ---------- KUIS AKHIR (20 soal, berwaktu) ---------- */
let soalAkhir = [], finalTimer = null, deadline = null, kuisAkhirAktif = false;

function semuaModulSelesai() {
  return MODUL.every(m => {
    const n = nilaiSaya[m.id] || {};
    return n.praktik !== undefined && n.kuis !== undefined;
  });
}

function renderKartuFinal() {
  const siap = semuaModulSelesai();
  const nf = nilaiSaya["final"];
  const checklist = MODUL.map(m => {
    const v = nilaiSaya[m.id] || {};
    const ok = v.praktik !== undefined && v.kuis !== undefined;
    return ok ? `<span title="Modul ${m.nomor} selesai">✅ M${m.nomor}</span>` : `<span title="Modul ${m.nomor} belum selesai">⬜ M${m.nomor}</span>`;
  }).join(" ");
  return `<div class="modul-card" ${siap ? 'onclick="bukaFinal()"' : ''} style="${siap ? "border-color:var(--kuning);" : "opacity:.55;cursor:not-allowed"}">
    <span class="modul-num" style="color:var(--kuning)">🏁 KUIS AKHIR (TERBUKA JIKA SEMUA MODUL SELESAI)</span>
    <h3>🧩 Ujian Terpadu — 20 Soal</h3>
    <p class="muted" style="font-size:.85rem">${siap
      ? `Terbuka! ${KUIS_AKHIR.durasiMenit} menit · urutan soal diacak · auto-kirim saat waktu habis · nilai terbaik: ${nf ? nf.kuis ?? "-" : "-"}`
      : "Selesaikan praktik + kuis di kelima modul untuk membukanya. Ceklis:"}</p>
    <span class="nilai-badge" ${siap ? 'style="display:none"' : ""}>${checklist}</span>
  </div>`;
}

window.bukaFinal = () => {
  const nf = nilaiSaya["final"];
  $("mod-judul").textContent = `🏁 ${KUIS_AKHIR.judul}`;
  $("mod-isi").innerHTML = `
  <div class="lec-panel">
    <h4>📖 Aturan Kuis Akhir</h4>
    <ul>
      <li><b>${KUIS_AKHIR.soal.length} soal</b> mencampur semua materi (array 1D, 2D, rekursif, visualisasi, pencarian jalur).</li>
      <li>Dibatasi waktu <b>${KUIS_AKHIR.durasiMenit} menit</b>; hitung mundur tampil di bagian atas.</li>
      <li><b>Urutan soal diacak</b> setiap kali memulai.</li>
      <li>Saat waktu habis, jawaban <b>otomatis dikirim</b>.</li>
      <li>Seluruh soal wajib dijawab sebelum menekan Kirim (soal kosong dianggap salah).</li>
    </ul>
    ${nf ? `<div class="info-box hijau">Nilai terbaik kamu saat ini: <span class="nilai-besar">${nf.kuis ?? "-"}</span>/100 — mengerjakan ulang boleh untuk memperbaiki (yang disimpan tetap nilai terbaik).</div>`
         : `<div class="info-box kuning">⚠️ Menutup halaman akan menghentikan timer; jawaban yang belum dikirim tidak tersimpan. Pastikan waktu &amp; jaringan cukup sebelum memulai.</div>`}
    <button class="btn btn-kuning" onclick="mulaiFinal()">🚀 Mulai Kuis Sekarang</button>
  </div>`;
  $("modal-back").classList.add("tampil");
};

function acakArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

window.mulaiFinal = () => {
  soalAkhir = acakArray(KUIS_AKHIR.soal);
  kuisAkhirAktif = true;
  deadline = Date.now() + KUIS_AKHIR.durasiMenit * 60 * 1000;

  $("mod-judul").textContent = `🏁 ${KUIS_AKHIR.judul}`;
  $("mod-isi").innerHTML = `
    <div class="timer-bar" id="timer-bar">⏱️ ${KUIS_AKHIR.durasiMenit}:00</div>
    <div id="daftar-soal-akhir">
      ${soalAkhir.map((s, i) => `
        <div class="soal">
          <p><b>${i + 1}.</b> ${s.q}</p>
          ${s.opsi.map((o, j) => `
            <label class="opsi">
              <input type="radio" name="final-${i}" value="${j}" />
              <span>${String.fromCharCode(65 + j)}. ${o}</span>
            </label>`).join("")}
        </div>`).join("")}
    </div>
    <div class="aksi-bar" style="position:sticky;bottom:10px;background:var(--bg2);padding:12px;border-radius:10px;border:1px solid var(--line)">
      <span class="muted">Jawab semua soal sebelum kirim (sisa waktu: <b id="sisa-timer">${KUIS_AKHIR.durasiMenit}:00</b>)</span>
      <button class="btn btn-kuning" onclick="kirimFinal(false)">📤 Kirim Jawaban</button>
    </div>`;

  clearInterval(finalTimer);
  finalTimer = setInterval(berjalanTimer, 1000);
  berjalanTimer();
};

/* hitung mundur kuis akhir */
function berjalanTimer() {
  const sisaMs = deadline - Date.now();
  const bar = $("timer-bar");
  if (!bar) { clearInterval(finalTimer); return; }
  if (sisaMs <= 0) { kirimFinal(true); return; }
  const m = Math.floor(sisaMs / 60000), s = Math.floor(sisaMs % 60000 / 1000);
  bar.textContent = `⏱️ ${m}:${String(s).padStart(2, "0")}`;
  bar.className = "timer-bar" + (m < 2 ? " kritikal" : m < 5 ? " peringatan" : "");
  const labelSisa = document.getElementById("sisa-timer");
  if (labelSisa) labelSisa.textContent = `${m}:${String(s).padStart(2, "0")}`;
}

window.kirimFinal = async (otomatis) => {
  const jawaban = [], kosong = [];
  soalAkhir.forEach((s, i) => {
    const dipilih = document.querySelector(`input[name="final-${i}"]:checked`);
    jawaban.push(dipilih ? +dipilih.value : null);
    if (!dipilih) kosong.push(i + 1);
  });

  // waktu belum habis tetapi ada soal kosong → konfirmasi kirim
  if (!otomatis && kosong.length && deadline > Date.now()) {
    if (!confirm(`Masih ada ${kosong.length} soal kosong (no. ${kosong.join(", ")}). Kirim sekarang? Soal kosong dianggap salah.`)) {
      clearInterval(finalTimer);
      finalTimer = setInterval(berjalanTimer, 1000);   // lanjutkan waktu
      return;
    }
  }
  clearInterval(finalTimer);
  kuisAkhirAktif = false;
  let benar = 0;
  soalAkhir.forEach((s, i) => { if (jawaban[i] === s.kunci) benar++; });
  const nilai = Math.round(benar / soalAkhir.length * 100);

  // tandai benar/salah untuk review
  soalAkhir.forEach((s, i) => {
    const wrap = document.querySelectorAll("#daftar-soal-akhir .soal")[i];
    if (!wrap) return;
    wrap.querySelectorAll(".opsi").forEach((o) => {
      const j = +o.querySelector("input").value;
      if (j === s.kunci) o.classList.add("benar");
      else if (o.querySelector("input").checked) o.classList.add("salah");
      o.style.pointerEvents = "none";
    });
  });

  $("mod-isi").innerHTML = `
    <div class="lec-panel">
      <h4>${otomatis ? "⏰ Waktu habis — jawaban dikirim otomatis" : "✅ Jawaban terkirim"}</h4>
      <div class="info-box ${nilai >= 70 ? "hijau" : "merah"}">
        🏁 Nilai kuis akhir: <span class="nilai-besar">${nilai}</span>/100 — <b>${benar} dari ${soalAkhir.length}</b> benar.
        ${nilai >= 70 ? "Luar biasa! 🎉" : "Ayo belajar ulang modul yang masih lemah 💪"}
      </div>
      <p class="muted">Scroll di bawah melihat kunci betulado per soal (hijau = kunci, merah = pilihanmu salah).</p>
      <div id="daftar-soal-akhir">${$("daftar-soal-akhir")?.innerHTML || ""}</div>
      <div class="aksi-bar" style="margin-top:12px">
        <button class="btn btn-primary" onclick="bukaFinal()">↺ Kembali ke Halaman Kuis Akhir</button>
      </div>
    </div>`;

  // simpan ke Supabase: nilai terBAIK yang dipakai di dashboard
  const { error } = await sb.from("quiz_results").insert([
    { student_id: user.id, module_id: "final", answers: jawaban, benar, total: soalAkhir.length, nilai }
  ]);
  if (error) console.error("Simpan kuis akhir gagal:", error.message);
  await simpanLangkah("final", "k");
  await muatProgres(); renderModul();
};

/* ---------- MODAL MODUL ---------- */
window.bukaModul = (id) => {
  const m = MODUL.find(x => x.id === id);
  $("mod-judul").textContent = `Modul ${m.nomor}: ${m.judul}`;
  $("mod-isi").innerHTML = isiModul(m);
  $("modal-back").classList.add("tampil");
};
function tutupModal() {
  // sedang mengerjakan kuis akhir? tawarkan peringatan sebelum keluar
  if (kuisAkhirAktif) {
    if (!confirm("⚠️ Kuis akhir masih BERJALAN. Menutup sekarang akan MENGHILANGKAN jawaban dan waktu tetap berjalan berakhir. Tutup?\n(OK = ya, tanggung sendiri)")) return;
    kuisAkhirAktif = false;
  }
  clearInterval(finalTimer);
  $("modal-back").classList.remove("tampil");
  if (chartM4) { chartM4.destroy(); chartM4 = null; }
}

/* Kode Python tiap langkah & kotak praktik */
function editorKode(id, kode, tombolTeks = "▶️ Jalankan") {
  return `<div class="code-wrap">
    <div class="code-label"><span id="lbl-${id}">${tombolTeks}</span></div>
    <textarea class="code-editor" id="ed-${id}" spellcheck="false">${escapeHTML(kode)}</textarea>
    <div class="aksi-bar">
      <button class="btn btn-hijau btn-sm" onclick="jalankan('${id}')">▶️ Jalankan Kode</button>
      <button class="btn btn-ghost btn-sm" id="rst-${id}" onclick="resetKode('${id}')">↺ Reset</button>
    </div>
    <pre class="output-box" id="out-${id}">Belum dijalankan…</pre>
    <div id="cek-${id}"></div>
    <div id="vis-${id}"></div>
  </div>`;
}
function escapeHTML(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

window.resetKode = (id) => {
  const [mid, jenis, idx] = id.split("-");
  const m = MODUL.find(x => x.id === mid);
  if (jenis === "l") $("ed-" + id).value = m.langkah[+idx].kode;
  if (jenis === "p") $("ed-" + id).value = m.praktik.starter;
};

function isiModul(m) {
  const tujuanHTML = m.tujuan.map(t => `<li>${t}</li>`).join("");
  const langkahHTML = m.langkah.map((l, i) => `
    <div class="langkah-item">
      <span class="lebel-langkah">LANGKAH ${i + 1}</span>
      <h4>${l.judul}</h4>
      <p class="muted" style="margin-bottom:8px">${l.penjelasan}</p>
      ${editorKode(`${m.id}-l${i}`, l.kode)}
      <button class="btn btn-primary btn-sm" onclick="simpanLangkah('${m.id}','l${i}')">✔️ Langkah ini saya pahami</button>
      <span id="ok-${m.id}-l${i}" class="muted" style="font-size:.8rem">${(langkahSaya[m.id]||[]).includes("l"+i) ? "✔ sudah ditandai" : ""}</span>
    </div>`).join('<hr style="border-color:var(--line);opacity:.3" />');

  const n = nilaiSaya[m.id] || {};

  return `
  <div class="lec-panel">
    <h4>🎯 Tujuan Pembelajaran</h4><ul>${tujuanHTML}</ul>
    <h4>📖 Materi</h4>${m.teori}
  </div>
  <div class="lec-panel langkah">
    <h4>🧭 Panduan Langkah demi Langkah</h4>
    ${langkahHTML}
  </div>
  <div class="lec-panel">
    <h4>🧪 Praktik — Dinilai Otomatis</h4>
    <p style="line-height:1.7;margin-bottom:10px">${m.praktik.deskripsi}</p>
    ${editorKode(`${m.id}-p`, m.praktik.starter, "Praktik")}
    <div class="aksi-bar" style="margin-top:8px">
      <button class="btn btn-kuning" onclick="kirimPraktik('${m.id}')">📤 Kirim Praktik (auto-nilai)</button>
      ${n.praktik !== undefined ? `<span class="chip">Nilai praktik terbaik: <b>${n.praktik}</b></span>` : ""}
    </div>
  </div>
  <div class="lec-panel" id="kuis-${m.id}">
    <h4>📝 Kuis</h4>
    ${renderKuis(m)}
  </div>`;
}

/* ---------- HASIL KUIS ---------- */
function renderKuis(m) {
  const n = nilaiSaya[m.id] || {};
  return `
    <div id="kuis-form-${m.id}">
      ${m.kuis.map((s, i) => `
        <div class="soal">
          <p><b>${i + 1}.</b> <span id="q-${m.id}-${i}">${s.q}</span></p>
          ${s.opsi.map((o, j) => `
            <label class="opsi" data-m="${m.id}" data-i="${i}" data-j="${j}">
              <input type="radio" name="soal-${m.id}-${i}" value="${j}" />
              <span>${String.fromCharCode(65 + j)}. ${o}</span>
            </label>`).join("")}
        </div>`).join("")}
      <div class="aksi-bar">
        <button class="btn btn-kuning" onclick="kirimKuis('${m.id}')">✅ Kirim Jawaban (auto-nilai)</button>
        ${n.kuis !== undefined ? `<span class="chip">Nilai kuis terbaik: <b>${n.kuis}</b></span>` : ""}
      </div>
    </div>
    <div id="kuis-hasil-${m.id}"></div>`;
}

/* radio styling */
document.addEventListener("click", (ev) => {
  const o = ev.target.closest(".opsi");
  if (!o) return;
  const wrap = o.closest(".soal");
  wrap.querySelectorAll(".opsi").forEach(e => e.classList.remove("dipilih"));
  o.classList.add("dipilih");
  o.querySelector("input").checked = true;
});

/* ---------- JALANKAN KODE PYTHON ---------- */
let kodeAwal = {}; // simpan kode awal utk reset

window.jalankan = async (id) => {
  const kode = $("ed-" + id).value;
  const out = $("out-" + id);
  if (id.endsWith("-p")) kodeAwal[id] = kodeAwal[id] || kode;
  out.className = "output-box";
  out.textContent = pyodide ? "⏳ Menjalankan…" : "⏳ Menyiapkan Python di browser (hanya sekali, ±10–20 detik)…";
  try {
    const py = await muatPyodide();
    let hasil = "";
    py.setStdout({ batched: (s) => hasil += s + "\n" });
    py.setStderr({ batched: (s) => hasil += s + "\n" });
    await py.runPythonAsync(kode);
    out.textContent = hasil || "(program tidak mencetak apa pun)";
  } catch (err) {
    out.className = "output-box err";
    out.textContent = err.message.split("\n").filter(l => l.trim()).slice(-6).join("\n");
  }
};

/* ---------- KIRIM PRAKTIK ---------- */
window.kirimPraktik = async (id) => {
  const mid = id;
  const m = MODUL.find(x => x.id === mid);
  const kode = $("ed-" + mid + "-p").value;
  const out = $("out-" + mid + "-p");
  const cekBox = $("cek-" + mid + "-p");
  const tombol = document.querySelector(`button[onclick="kirimPraktik('${mid}')"]`);
  tombol.disabled = true; tombol.textContent = "⏳ Memeriksa…";
  out.className = "output-box";
  let hasil = "";
  try {
    const py = await muatPyodide();
    py.setStdout({ batched: (s) => hasil += s + "\n" });
    py.setStderr({ batched: (s) => hasil += s + "\n" });
    await py.runPythonAsync(kode);
  } catch (err) {
    out.className = "output-box err";
    out.textContent = err.message.split("\n").filter(l => l.trim()).slice(-6).join("\n");
  }
  out.textContent = hasil || "(program tidak mencetak apa pun)";

  // ---- AUTO-CHECK kriteria ----
  const cek = m.praktik.checks.map(c => {
    const sumber = c.type === "kode" ? kode : hasil;
    const pass = new RegExp(c.regex, "s").test(sumber);
    return { desc: c.desc, poin: c.poin, pass };
  });
  const nilai = cek.reduce((a, c) => a + (c.pass ? c.poin : 0), 0);

  cekBox.innerHTML = `
    <div class="info-box hijau" style="border-left-color:${nilai >= 70 ? "var(--hijau)" : "var(--merah)"}">
      <span class="nilai-besar">${nilai}</span> / 100 ${nilai >= 70 ? "✅ Lulus" : "🔴 Perlu perbaikan"}<br/>
      ${cek.map(c => `<div class="check-line ${c.pass ? "check-ok" : "check-gagal"}">
        ${c.pass ? "✔️" : "❌"} ${c.desc} (${c.poin} poin)</div>`).join("")}
    </div>`;

  // visual khusus (chart / grid)
  renderVisual(m, hasil);

  // simpan ke Supabase
  const { error } = await sb.from("submissions").insert([
    { student_id: user.id, module_id: mid, kode, output: hasil, checks: cek, nilai }
  ]);
  if (error) console.error("Simpan praktik gagal:", error.message);
  await simpanLangkah(mid, "p");
  await muatProgres(); renderModul();
  tombol.disabled = false; tombol.textContent = "📤 Kirim Praktik (auto-nilai)";
};

/* ---------- VISUAL (chart dan grid) ---------- */
function renderVisual(m, hasil) {
  const visBox = $("vis-" + m.id + "-p");
  if (!visBox) return;
  if (m.praktik?.visual === "chart") {
    const labelsLine = (hasil.match(/LABELS:(.+)/) || [])[1];
    const dataLine   = (hasil.match(/DATA:(.+)/) || [])[1];
    if (!labelsLine || !dataLine) { visBox.innerHTML = ""; return; }
    const labels = labelsLine.trim().split(",").map(s => s.trim());
    const data   = dataLine.trim().split(",").map(s => Number(s.trim()));
    visBox.innerHTML = `<div class="chart-box"><h4>📊 Grafik Hasil Pengolahan Python</h4>
      <div class="chart-canvas"><canvas id="cv-${m.id}"></canvas></div></div>`;
    const ctx = $("cv-" + m.id).getContext("2d");
    if (chartM4) chartM4.destroy();
    chartM4 = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{ label: "Nilai", data, backgroundColor: "#22d3ee" }] },
      options: { responsive: true, maintainAspectRatio: false, scales: { x: { ticks: { color: "#94a3b8" } }, y: { ticks: { color: "#94a3b8" }, beginAtZero: true } }, plugins: { legend: { labels: { color: "#e2e8f0" } } } }
    });
  }
  if (m.praktik?.visual === "grid") {
    const rows = (hasil.match(/ROW:([SF.#*]+)/g) || []).map(r => r.replace("ROW:", ""));
    if (!rows.length) { visBox.innerHTML = ""; return; }
    visBox.innerHTML = `<div class="chart-box"><h4>🧭 Visualisasi Labirin Hasil Rekursif</h4>
      <table class="grid-tabel">${rows.map(r => `<tr>${r.split("").map(cellChar).join("")}</tr>`).join("")}</table></div>`;
  }
}
function cellChar(c) { return `<td class="${c === "#" ? "dinding" : c === "*" ? "jalan" : c === "S" ? "start" : c === "F" ? "finish" : ""}">${c === "." ? "·" : c}</td>`; }

/* ---------- KIRIM KUIS ---------- */
window.kirimKuis = async (mid) => {
  const m = MODUL.find(x => x.id === mid);
  const jawaban = [];
  let terisi = true;
  m.kuis.forEach((s, i) => {
    const dipilih = document.querySelector(`input[name="soal-${mid}-${i}"]:checked`);
    if (dipilih) jawaban[i] = +dipilih.value; else { jawaban[i] = null; terisi = false; }
  });
  if (!terisi) {
    $("kuis-hasil-" + mid).innerHTML = `<div class="info-box merah">⚠️ Semua soal harus dijawab dulu!</div>`;
    return;
  }
  // auto-grading
  let benar = 0;
  m.kuis.forEach((s, i) => { if (jawaban[i] === s.kunci) benar++; });
  const nilai = Math.round(benar / m.kuis.length * 100);
  // warna opsi: benar hijau, pilihan salah merah
  m.kuis.forEach((s, i) => {
    const wrap = document.querySelectorAll(`#kuis-form-${mid} .soal`)[i];
    if (!wrap) return;
    wrap.querySelectorAll(".opsi").forEach((o) => {
      const j = +o.dataset.j;
      if (j === s.kunci) o.classList.add("benar");
      else if (j === jawaban[i]) o.classList.add("salah");
      o.style.pointerEvents = "none";
    });
  });
  $("kuis-hasil-" + mid).innerHTML = `
    <div class="info-box ${nilai >= 70 ? "hijau" : "merah"}">
      🎯 Nilai kuis: <span class="nilai-besar">${nilai}</span>/100 — <b>${benar} dari ${m.kuis.length}</b> benar.
      ${nilai >= 70 ? "Mantap! 🎉" : "Baca ulang materi, lalu coba lagi ya 💪"}
    </div>`;

  const { error } = await sb.from("quiz_results").insert([
    { student_id: user.id, module_id: mid, answers: jawaban, benar, total: m.kuis.length, nilai }
  ]);
  if (error) console.error("Simpan kuis gagal:", error.message);
  await simpanLangkah(mid, "k");
  await muatProgres(); renderModul();
};
