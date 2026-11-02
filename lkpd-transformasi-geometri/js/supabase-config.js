/* =====================================================================
 * KONFIGURASI SUPABASE
 * Ganti dua nilai di bawah dengan milik proyek Anda:
 *   1. Buka https://supabase.com → dashboard → pilih proyek
 *   2. Menu "Settings" → "API"
 *   3. Salin "Project URL" dan "anon public key" ke sini
 * ===================================================================== */
const SUPABASE_URL = "https://bgxzarmkpwhiweovbsyh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneHphcm1rcHdoaXdlb3Zic3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1NDI1MjMsImV4cCI6MjEwOTExODUyM30.bRseqAFNO-cXE7MsJ1Lb8DGRnL7Zw9fV3nYHIFVqA08";

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
