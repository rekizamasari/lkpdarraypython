-- =====================================================================
-- SKEMA DATABASE SUPABASE — LKPD Array & Rekursif (KKA Kelas X)
-- Jalankan seluruh script ini di Supabase → SQL Editor → Run
-- =====================================================================

-- 1. KELAS ------------------------------------------------------------
create table if not exists public.kelas (
  id         uuid primary key default gen_random_uuid(),
  nama       text not null unique,          -- contoh: "X-A"
  walikelas  text,
  created_at timestamptz default now()
);

-- 2. PROFIL (guru & siswa) — 1 baris per user auth ---------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nama        text not null,
  nis         text,                          -- NIS siswa (boleh kosong utk guru)
  role        text not null check (role in ('guru','siswa')),
  kelas_id    uuid references public.kelas(id),
  created_at  timestamptz default now()
);

-- 3. PROGRES LANGKAH LKPD ---------------------------------------------
create table if not exists public.progress (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  module_id   text not null,                 -- 'm1' .. 'm5'
  step_id     text not null,                 -- 'l1', 'l2', 'p' (praktik)
  status      text not null default 'selesai',
  updated_at  timestamptz default now(),
  unique (student_id, module_id, step_id)
);

-- 4. HASIL PRAKTIK (auto-check output Python) --------------------------
create table if not exists public.submissions (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  module_id   text not null,
  kode        text,                          -- kode Python yang dikirim
  output      text,                          -- output program
  checks      jsonb,                         -- hasil tiap kriteria penilaian
  nilai       numeric not null default 0,    -- 0..100
  created_at  timestamptz default now()
);

-- 5. HASIL KUIS (auto-grading pilihan ganda) ---------------------------
create table if not exists public.quiz_results (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.profiles(id) on delete cascade,
  module_id   text not null,
  answers     jsonb,                          -- [indeks jawaban siswa]
  benar       int not null default 0,
  total       int not null default 0,
  nilai       numeric not null default 0,     -- 0..100
  created_at  timestamptz default now()
);

-- 6. INDEX -------------------------------------------------------------
create index if not exists idx_progress_student on public.progress(student_id);
create index if not exists idx_sub_student     on public.submissions(student_id, module_id);
create index if not exists idx_quiz_student    on public.quiz_results(student_id, module_id);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.kelas         enable row level security;
alter table public.profiles      enable row level security;
alter table public.progress      enable row level security;
alter table public.submissions   enable row level security;
alter table public.quiz_results  enable row level security;

-- PROFILES: semua login boleh baca; siswa hanya edit profil sendiri;
-- guru boleh baca semua profil
drop policy if exists "profiles_read_all"     on public.profiles;
drop policy if exists "profiles_self_upsert"  on public.profiles;
drop policy if exists "profiles_self_update"  on public.profiles;
create policy "profiles_read_all"    on public.profiles for select using (auth.role() = 'authenticated');
create policy "profiles_self_upsert" on public.profiles for insert  with check (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id);

-- KELAS: semua login boleh baca, guru boleh tulis
drop policy if exists "kelas_read"  on public.kelas;
drop policy if exists "kelas_write" on public.kelas;
create policy "kelas_read"  on public.kelas for select using (auth.role() = 'authenticated');
create policy "kelas_write" on public.kelas for all    using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'guru')
);

-- PROGRESS / SUBMISSIONS / QUIZ: siswa tulis miliknya, semua baca
-- (guru butuh baca untuk dashboard analitik)
drop policy if exists "progress_read"  on public.progress;
drop policy if exists "progress_write" on public.progress;
drop policy if exists "progress_upd"   on public.progress;
create policy "progress_read" on public.progress for select using (auth.role() = 'authenticated');
create policy "progress_write" on public.progress for insert with check (auth.uid() = student_id);
create policy "progress_upd"   on public.progress for update using (auth.uid() = student_id);

drop policy if exists "sub_read"  on public.submissions;
drop policy if exists "sub_write" on public.submissions;
create policy "sub_read"  on public.submissions for select using (auth.role() = 'authenticated');
create policy "sub_write" on public.submissions for insert with check (auth.uid() = student_id);

drop policy if exists "quiz_read"  on public.quiz_results;
drop policy if exists "quiz_write" on public.quiz_results;
create policy "quiz_read"  on public.quiz_results for select using (auth.role() = 'authenticated');
create policy "quiz_write" on public.quiz_results for insert with check (auth.uid() = student_id);

-- =====================================================================
-- TRIGGER: buat profil otomatis setelah user daftar
-- (role/nama diisi lewat form pendaftaran → simpan di user_metadata)
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nama, nis, role, kelas_id)
  select
    new.id,
    coalesce(new.raw_user_meta_data->>'nama', 'Tanpa Nama'),
    new.raw_user_meta_data->>'nis',
    coalesce(new.raw_user_meta_data->>'role', 'siswa'),
    (select k.id from public.kelas k
      where k.nama = coalesce(new.raw_user_meta_data->>'kelas', 'X-A')
      limit 1)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- SEED: kelas awal (silakan edit sesuai sekolah Anda)
-- =====================================================================
insert into public.kelas (nama, walikelas) values
  ('X-A', 'Ibu Sari'),
  ('X-B', 'Pak Budi')
on conflict (nama) do nothing;

-- =====================================================================
-- REALTIME (agar dashboard guru update otomatis)
-- Jalankan juga di SQL Editor:
--   alter publication supabase_realtime add table public.progress;
--   alter publication supabase_realtime add table public.submissions;
--   alter publication supabase_realtime add table public.quiz_results;
-- =====================================================================
