/* =====================================================================
 * auth.js — Helper login/logout/session yang dipakai index, siswa, guru
 * ===================================================================== */

/** Pastikan user sudah login; jika tidak, arahkan ke halaman login. */
async function requireLogin() {
  const sb = initSupabase();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    window.location.replace("index.html");
    return null;
  }
  return session.user;
}

/** Ambil profil (nama, role, kelas) milik user yang sedang login. */
async function getProfile(userId) {
  const sb = initSupabase();
  const { data, error } = await sb
    .from("profiles")
    .select("*, kelas:kelas_id (id, nama, walikelas)")
    .eq("id", userId)
    .single();
  if (error) { console.error("Gagal ambil profil:", error.message); return null; }
  return data;
}

/** Logout lalu pulang ke halaman login. */
async function doLogout() {
  const sb = initSupabase();
  await sb.auth.signOut();
  window.location.replace("index.html");
}

/**
 * Map NISN siswa → "email internal" untuk Supabase Auth.
 * Siswa tidak pernah ketahuan email ini; form pendaftaran/login
 * cukup pakai NISN. Guru tetap pakai email asli.
 */
function nisnKeEmail(nisn) {
  return `nisn.${String(nisn).trim()}@siswa.lkpd.local`;
}
/** Apakah nilai itu berasal dari NISN siswa (bukan email guru asli)? */
function apakahEmailGuru(x) { return !String(x || "").toLowerCase().endsWith("@siswa.lkpd.local"); }

/** Format tanggal-jam Indonesia singkat untuk tabel. */
function fmtWaktu(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
