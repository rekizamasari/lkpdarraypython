/* =====================================================================
 * KONFIGURASI SUPABASE
 * Ganti dua nilai di bawah dengan milik proyek Anda:
 *   1. Buka https://supabase.com → dashboard → pilih proyek
 *   2. Menu "Settings" → "API"
 *   3. Salin "Project URL" dan "anon public key" ke sini
 * ===================================================================== */
const SUPABASE_URL = "https://bgxzarmkpwhiweovbsyh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_k2xNl0Mh716dVPDOv7cw8A_U6CYJJZc";

// ---------------------------------------------------------------------------
// Profil guru default yang dibuat via SQL (lihat README bagian 6).
// ---------------------------------------------------------------------------
const CONFIG = {
  app: {
    namaApp: "LKPD Interaktif — Array & Rekursif",
    mapel: "Koding dan Kecerdasan Artifisial",
    kelas: "X",
    satuanPenilaian: "SPSS", // skor sementara (0-100), dipakai guru saat input rapor
  },
};

// ------------------------------------------------------------------
// Inisialisasi client (script supabasejs dimuat lewat CDN di HTML)
// ------------------------------------------------------------------
let db = null;
function initSupabase() {
  if (db) return db;
  db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    { realtime: { params: { eventsPerSecond: 5 } } }
  );
  return db;
}
