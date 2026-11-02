/* =====================================================================
 * guru.js — Logika dashboard guru (LKPD Transformasi Geometri):
 *  • Ringkasan statistik kelas (jumlah siswa, rata-rata, kelulusan)
 *  • Grafik Chart.js: rata-rata nilai per modul + bar praktik selesai
 *  • Tabel rekap nilai per siswa × modul + unduh CSV
 *  • Riwayat praktik & kuis
 *  • Realtime: tabel Supabase di-subscribe → data otomatis di-refresh
 * ===================================================================== */
const $g = (id) => document.getElementById(id);
const sb = initSupabase();
let profilSaya = null;
let kelasIdCache = {};       // nama → id utk filter
let semuaData = null;        // hasil terakhir analitik (utk CSV)
let chart1 = null, chart2 = null;
const FINAL_ID = KUIS_AKHIR.id;   // "geo-final"

/* ---------- TAB ---------- */
document.querySelectorAll(".tab-btn").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(x => x.classList.remove("aktif"));
    document.querySelectorAll(".tab-page").forEach(x => x.classList.remove("aktif"));
    b.classList.add("aktif");
    $g("tab-" + b.dataset.tab).classList.add("aktif");
  };
});

/* ---------- STARTUP ---------- */
(async () => {
  const user = await requireLogin();
  if (!user) return;
  profilSaya = await getProfile(user.id);
  if (profilSaya?.role !== "guru") {
    // siswa tidak boleh masuk dashboard guru
    window.location.replace("siswa.html");
    return;
  }
  $g("profil-nama").textContent = "👨‍🏫 " + (profilSaya?.nama || "Guru");
  await muatKelas();
  await refreshSemua();
  pasangRealtime();
})();

$g("btn-logout").onclick = doLogout;
$g("btn-refresh").onclick = async () => {
  const b = $g("btn-refresh");
  b.disabled = true; b.textContent = "⏳ Memuat…";
  await refreshSemua();
  b.disabled = false; b.textContent = "🔄 Refresh";
};
$g("filter-kelas").onchange = () => tampilkan(semuaData);
$g("btn-csv").onclick = unduhCSV;

/* ---------- TAB MATERI & KUNCI ---------- */
$g("materi-pilih").innerHTML =
  MODUL.map(m => `<option value="${m.id}">Modul ${m.nomor} — ${m.judul}</option>`).join("") +
  `<option value="${FINAL_ID}">🏁 Kuis Akhir (20 soal) + kunci</option>`;
$g("materi-pilih").onchange = () => renderMateri($g("materi-pilih").value);
renderMateri(MODUL[0].id);

function sumberKriteria(c) {
  if (c.type === "kode") return "kode";
  if (c.type === "output") return "output";
  if (c.type === "angka") return `isian angka ${c.sel} (target ${c.val})`;
  return `isian teks ${c.sel}`;
}

function renderMateri(mid) {
  const box = $g("materi-content");
  if (mid === FINAL_ID) {
    box.innerHTML = `
      <div class="lec-panel">
        <h4>🏁 Kuis Akhir — Ujian Terpadu</h4>
        <ul>
          <li><b>${KUIS_AKHIR.soal.length} soal</b> mencampur Modul 1–5.</li>
          <li>Durasi <b>${KUIS_AKHIR.durasiMenit} menit</b>, hitung mundur; auto-kirim saat habis.</li>
          <li>Urutan soal <b>diacak</b> setiap siswa memulai.</li>
          <li>Terbuka hanya jika <b>kelima modul</b> terkirim praktik + kuisnya.</li>
          <li>Jawaban kunci ditandai ✅ hijau di daftar soal di bawah.</li>
        </ul>
      </div>
      ${KUIS_AKHIR.soal.map((s, i) => soalDenganKunci(s, i + 1)).join("")}`;
    return;
  }
  const m = MODUL.find(x => x.id === mid);
  const langkah = m.langkah.map((l, i) => `
    <div class="langkah-item">
      <span class="lebel-langkah">LANGKAH ${i + 1}</span>
      <h4>${l.judul}</h4>
      <p class="muted">${l.penjelasan}</p>
      <pre class="code-editor" style="min-height:0">${escapeHTML(l.kode)}</pre>
    </div>`).join("");
  const kriteria = m.praktik.checks.map(c =>
    `<div class="check-line">🎯 <b>${c.poin} poin</b> (dicek dari ${escapeHTML(sumberKriteria(c))}) — ${c.desc}</div>`).join("");
  const kuisModul = m.kuis.map((s, i) => soalDenganKunci(s, i + 1)).join("");
  box.innerHTML = `
    <div class="lec-panel"><h4>🎯 Tujuan Pembelajaran</h4><ul>${m.tujuan.map(t => `<li>${t}</li>`).join("")}</ul>
      <h4>📖 Materi</h4>${m.teori}</div>
    <div class="lec-panel"><h4>🧭 Langkah demi Langkah</h4>${langkah}</div>
    <div class="lec-panel"><h4>🧪 Praktik yang Dinilai Otomatis</h4>
      <p style="line-height:1.7;margin-bottom:8px">${m.praktik.deskripsi}</p>
      ${m.praktik.starter ? `<div class="code-label">Kerangka awal yang diberikan ke siswa</div>
      <pre class="code-editor" style="min-height:0">${escapeHTML(m.praktik.starter)}</pre>` : ""}
      ${m.praktik.inputs ? `<div class="code-label">Form isian yang diberikan ke siswa</div>
      <div class="info-box" style="margin:6px 0">${m.praktik.inputs}</div>` : ""}
      <h4 style="margin-top:14px">📐 Kriteria auto-check (total 100 poin)</h4>${kriteria}</div>
    <div class="lec-panel"><h4>📝 Kuis Modul — dengan kunci</h4>${kuisModul}</div>`;
}

function soalDenganKunci(s, nomor) {
  return `<div class="soal">
    <p><b>${nomor}.</b> ${s.q}</p>
    ${s.opsi.map((o, j) => `
      <div class="opsi ${j === s.kunci ? "benar" : ""}">
        <span>${String.fromCharCode(65 + j)}. ${o} ${j === s.kunci ? "✅ <b>kunci</b>" : ""}</span>
      </div>`).join("")}
  </div>`;
}

/* ---------- TAMBAH KELAS ---------- */
$g("btn-kelas-baru").onclick = async () => {
  const nama = prompt("Nama kelas baru (contoh: XI-B):");
  if (!nama) return;
  const bersih = nama.trim().toUpperCase();
  if (!/^[A-Z0-9\- ]+$/.test(bersih)) return alert("Nama kelas hanya boleh huruf, angka, dan hubung.");
  const { error } = await sb.from("kelas").insert({ nama: bersih });
  if (error) {
    console.error(error);
    return alert("Gagal menambah kelas: " + (error.message.includes("duplicate") ? "kelas sudah ada" : error.message));
  }
  alert("✅ Kelas " + bersih + " berhasil ditambahkan!");
  await muatKelas();
  await refreshSemua();
};

/* Cadangan: refresh ringan tiap 90 detik sesaat realtime bermasalah */
setInterval(() => { refreshSemua(); }, 90000);

/* ---------- DATA ---------- */
async function muatKelas() {
  const { data } = await sb.from("kelas").select("*").order("nama");
  kelasIdCache = {};
  $g("filter-kelas").innerHTML = `<option value="">Semua Kelas</option>` +
    (data || []).map(k => { kelasIdCache[k.nama] = k.id; return `<option value="${k.nama}">${k.nama}</option>`; }).join("");
  return data || [];
}

async function refreshSemua() {
  // Semua profil siswa + kelas
  const [siswa, subs, quis] = await Promise.all([
    sb.from("profiles").select("id, nama, nis, kelas_id, kelas:kelas_id(nama)").eq("role", "siswa").order("nama"),
    sb.from("submissions").select("student_id, module_id, nilai, output, created_at").order("created_at", { ascending: false }),
    sb.from("quiz_results").select("student_id, module_id, benar, total, nilai, answers, created_at").order("created_at", { ascending: false }),
  ]);
  const listSiswa = siswa.data || [];
  const listSubs  = subs.data || [];
  const listKuis  = quis.data || [];

  // Bungkus: nilai praktik & kuis terBAIK per siswa per modul
  const best = {};
  listSubs.forEach(s => {
    const k = s.student_id; best[k] = best[k] || {};
    best[k][s.module_id] = best[k][s.module_id] || {};
    best[k][s.module_id].praktik = Math.max(best[k][s.module_id].praktik ?? -1, s.nilai);
  });
  listKuis.forEach(q => {
    const k = q.student_id; best[k] = best[k] || {};
    best[k][q.module_id] = best[k][q.module_id] || {};
    best[k][q.module_id].kuis = Math.max(best[k][q.module_id].kuis ?? -1, q.nilai);
  });

  semuaData = { listSiswa, listSubs, listKuis, best };
  tampilkan(semuaData);
}

/* ---------- TAMPILKAN ---------- */
function filterAktif(siswa) {
  const f = $g("filter-kelas").value;
  if (!f) return siswa;
  const kelasId = kelasIdCache[f];
  return siswa.filter(s => s.kelas_id === kelasId);
}

function tampilkan({ listSiswa, best, listSubs, listKuis }) {
  const aktif = filterAktif(listSiswa);
  const ids = new Set(aktif.map(s => s.id));

  // ---- statistik ----
  const perModul = {};       // { g1: { praktik:[], kuis:[], selesai:0 } }
  MODUL.forEach(m => perModul[m.id] = { praktik: [], kuis: [], selesai: 0 });
  aktif.forEach(s => {
    MODUL.forEach(m => {
      const b = (best[s.id] || {})[m.id] || {};
      if (b.praktik !== undefined) { perModul[m.id].praktik.push(b.praktik); if (b.praktik >= 70) perModul[m.id].selesai++; }
      if (b.kuis    !== undefined) perModul[m.id].kuis.push(b.kuis);
    });
  });
  const rata = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "–";
  const semuaNilaiAkhir = [];
  aktif.forEach(s => {
    MODUL.forEach(m => {
      const b = (best[s.id] || {})[m.id] || {};
      if (b.praktik !== undefined || b.kuis !== undefined)
        semuaNilaiAkhir.push((b.praktik ?? 0) * 0.5 + (b.kuis ?? 0) * 0.5);
    });
  });
  const kelPraktik = MODUL.map(m => perModul[m.id].selesai);
  const palingSulit = MODUL.map(m => ({ m, selesai: perModul[m.id].selesai }))
    .sort((a, b) => a.selesai - b.selesai)[0];
  const belumMulai = aktif.filter(s => !(best[s.id] && Object.keys(best[s.id]).length)).length;

  // ---- statistik kuis akhir ----
  const nilaiFinal = [];
  aktif.forEach(s => {
    const f = (best[s.id] || {})[FINAL_ID];
    if (f?.kuis !== undefined) nilaiFinal.push(f.kuis);
  });

  $g("stat-grid").innerHTML = `
    <div class="stat-card"><div class="val">${aktif.length}</div><div class="lbl">👨‍🎓 siswa terdaftar (kelas terfilter)</div></div>
    <div class="stat-card"><div class="val">${aktif.length - belumMulai}</div><div class="lbl">✅ sudah mulai mengerjakan</div></div>
    <div class="stat-card"><div class="val">${semuaNilaiAkhir.length ? rata(semuaNilaiAkhir) : "–"}</div><div class="lbl">⭐ rata-rata nilai akhir kelas</div></div>
    <div class="stat-card"><div class="val" style="color:var(--kuning)">${palingSulit ? palingSulit.m.ikon + " M" + palingSulit.m.nomor : "–"}</div><div class="lbl">🔍 modul paling sulit (praktik lulus paling sedikit: ${palingSulit ? palingSulit.selesai : "-"}/${aktif.length})</div></div>
    <div class="stat-card"><div class="val" style="color:var(--kuning)">${nilaiFinal.length ? rata(nilaiFinal) : "–"}</div><div class="lbl">🏁 rata-rata kuis akhir — ${nilaiFinal.length} dari ${aktif.length} siswa sudah ikut ujian terpadu</div></div>`;

  // ---- grafik per modul ----
  const ctx1 = $g("chart-1").getContext("2d");
  if (chart1) chart1.destroy();
  chart1 = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: MODUL.map(m => "M" + m.nomor + " " + m.judul.slice(0, 18)),
      datasets: [
        { label: "Rata-rata Praktik", data: MODUL.map(m => +rata(perModul[m.id].praktik)), backgroundColor: "#22d3ee" },
        { label: "Rata-rata Kuis",    data: MODUL.map(m => +rata(perModul[m.id].kuis)),    backgroundColor: "#a78bfa" },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { ticks: { color: "#94a3b8", font: { size: 10 } } }, y: { ticks: { color: "#94a3b8" }, beginAtZero: true, max: 100 } },
      plugins: { legend: { labels: { color: "#e2e8f0" } } }
    }
  });

  const ctx2 = $g("chart-2").getContext("2d");
  if (chart2) chart2.destroy();
  chart2 = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: MODUL.map(m => "M" + m.nomor),
      datasets: [
        { label: "Praktik lulus (≥70)", data: kelPraktik, backgroundColor: "#34d399" },
        { label: "Kerja praktik",       data: MODUL.map(m => perModul[m.id].praktik.length), backgroundColor: "#fbbf24" },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { x: { ticks: { color: "#94a3b8" } }, y: { ticks: { color: "#94a3b8" }, beginAtZero: true } },
      plugins: { legend: { labels: { color: "#e2e8f0" } } }
    }
  });

  // ---- tabel rekap nilai ----
  const labelModul = (mid) => mid === FINAL_ID ? "🏁 Akhir" : ("M" + (MODUL.find(m => m.id === mid)?.nomor ?? "?"));
  let head = `<thead><tr><th>Nama Siswa</th><th>NIS</th><th>Kelas</th>`;
  MODUL.forEach(m => head += `<th>⭐ Modul ${m.nomor}</th>`);
  head += `<th>🏁 Kuis Akhir</th><th>🔥 Rata Modul</th></tr></thead><tbody>`;
  const rows = aktif.map(s => {
    let baris = `<tr><td>${escape(s.nama)}</td><td>${escape(s.nis || "-")}</td><td>${escape(s.kelas?.nama || "-")}</td>`;
    let angkanya = [];
    MODUL.forEach(m => {
      const b = (best[s.id] || {})[m.id] || {};
      const pk = b.praktik, qu = b.kuis;
      const ada = pk !== undefined || qu !== undefined;
      const akhir = ada ? Math.round(((pk ?? 0) * 0.5 + (qu ?? 0) * 0.5)) : null;
      baris += `<td class="angka ${ada ? (akhir >= 70 ? "v-hijau" : "v-merah") : ""}" title="praktik ${pk ?? "-"} | kuis ${qu ?? "-"}">${ada ? akhir : "–"}</td>`;
      if (ada) angkanya.push(akhir);
    });
    const vf = (best[s.id] || {})[FINAL_ID];
    const adaF = vf?.kuis !== undefined;
    baris += `<td class="angka ${adaF ? (vf.kuis >= 70 ? "v-hijau" : "v-merah") : ""}">${adaF ? vf.kuis : "–"}</td>`;
    const rerModul = angkanya.length ? (angkanya.reduce((a, b) => a + b, 0) / angkanya.length).toFixed(1) : "–";
    baris += `<td class="angka"><b>${rerModul}</b></td></tr>`;
    return baris;
  }).join("");
  $g("tabel-nilai").innerHTML = head + rows + "</tbody>";

  // ---- rincian praktik & kuis ----
  const subData = listSubs.filter(x => ids.has(x.student_id)).slice(0, 50);
  const kuiData = listKuis.filter(x => ids.has(x.student_id)).slice(0, 50);
  const sNama = (id) => listSiswa.find(s => s.id === id)?.nama || "?";

  $g("tabel-subs").innerHTML = `<thead><tr><th>Waktu</th><th>Nama Siswa</th><th>Modul</th><th>Nilai (0-100)</th><th>Jawaban (potongan)</th></tr></thead><tbody>` +
    subData.map(x => `<tr><td>${fmtWaktu(x.created_at)}</td><td>${escape(sNama(x.student_id))}</td><td>${labelModul(x.module_id)}</td>
      <td class="angka ${x.nilai >= 70 ? "v-hijau" : "v-merah"}">${x.nilai}</td>
      <td><code class="kecil-code">${escape((x.output || "").slice(0, 60))}</code></td></tr>`).join("") +
    (subData.length ? "" : `<tr><td colspan="5" class="muted">Belum ada praktik dikirim</td></tr>`) + `</tbody>`;

  $g("tabel-kuis").innerHTML = `<thead><tr><th>Waktu</th><th>Nama Siswa</th><th>Modul</th><th>Jawaban benar</th><th>Nilai</th></tr></thead><tbody>` +
    kuiData.map(x => `<tr><td>${fmtWaktu(x.created_at)}</td><td>${escape(sNama(x.student_id))}</td><td>${labelModul(x.module_id)}</td>
      <td class="angka">${x.benar} / ${x.total}</td>
      <td class="angka ${x.nilai >= 70 ? "v-hijau" : "v-merah"}">${x.nilai}</td></tr>`).join("") +
    (kuiData.length ? "" : `<tr><td colspan="5" class="muted">Belum ada kuis dikerjakan</td></tr>`) + `</tbody>`;
}

function escapeHTML(s) { return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

/* ---------- UNDUH CSV ---------- */
function unduhCSV() {
  if (!semuaData) return;
  const { listSiswa, best } = semuaData;
  const aktif = filterAktif(listSiswa);
  let csv = "Nama;NIS;Kelas";
  MODUL.forEach(m => csv += `;M${m.nomor} Praktik;M${m.nomor} Kuis;M${m.nomor} Akhir`);
  csv += ";Kuis Akhir\n";
  aktif.forEach(s => {
    csv += `${s.nama};${s.nis || "-"};${s.kelas?.nama || "-"}`;
    MODUL.forEach(m => {
      const b = (best[s.id] || {})[m.id] || {};
      const ada = (b.praktik !== undefined || b.kuis !== undefined);
      const akhir = ada ? Math.round(((b.praktik ?? 0) * 0.5 + (b.kuis ?? 0) * 0.5)) : "-";
      csv += `;${b.praktik ?? "-"};${b.kuis ?? "-"};${akhir}`;
    });
    csv += `;${best[s.id]?.[FINAL_ID]?.kuis ?? "-"}`;
    csv += "\n";
  });
  const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "rekap-nilai-lkpd-transformasi.csv"; a.click();
  URL.revokeObjectURL(url);
}

/* ---------- REALTIME ---------- */
function pasangRealtime() {
  try {
    const chan = sb
      .channel("dashboard-guru-transformasi")
      .on("postgres_changes", { event: "*", schema: "public", table: "submissions" }, onUbah)
      .on("postgres_changes", { event: "*", schema: "public", table: "quiz_results" }, onUbah)
      .on("postgres_changes", { event: "*", schema: "public", table: "progress" }, onUbah)
      .subscribe();
    console.info("Realtime subscribe:", chan.state);
  } catch (e) {
    console.warn("Realtime gagal:", e.message, "— dashboard tetap bisa dipakai, cukup refresh manual.");
  }
}

/* ⏱ debounce supaya tidak spam refresh */
let debounceTimer = null;
function onUbah() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => refreshSemua(), 800);
}
