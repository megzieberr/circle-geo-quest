-- ============================================================
--  CIRCLE QUEST — Supabase schema, security & RPC API
--  Run this whole file once in the Supabase SQL editor.
--
--  SECURITY MODEL (as specified in the brief):
--   • Every table has Row-Level Security ON with NO policies, so the
--     public "anon" key can never read or write a table directly.
--   • All reads/writes go through SECURITY DEFINER functions that
--     verify the supplied password SERVER-SIDE before doing anything.
--   • Learner passwords are stored readable (plaintext) on purpose, so
--     the teacher can recover a forgotten one. They are NEVER returned
--     by any learner-facing function — only the admin function returns
--     them, and only after checking the admin password.
--   • The admin password is stored HASHED (bcrypt via pgcrypto).
--   • The service-role key is never needed by the app.
-- ============================================================

-- Supabase keeps extensions in the dedicated "extensions" schema; the
-- SECURITY DEFINER functions below include it in their search_path so
-- crypt()/gen_salt() resolve.
create extension if not exists pgcrypto with schema extensions;

-- ---------- tables ----------
create table if not exists public.students (
  id             uuid primary key default gen_random_uuid(),
  display_name   text unique not null,
  password       text,                       -- null until first login; readable by design
  created_at     timestamptz not null default now(),
  last_active_at timestamptz
);

create table if not exists public.progress (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students(id) on delete cascade,
  round_id      text not null,
  best_score    numeric not null default 0,  -- 0..1 (first-try fraction)
  attempts      int not null default 0,
  total_xp      int not null default 0,
  passed        boolean not null default false,
  last_played_at timestamptz,
  unique (student_id, round_id)
);

-- one row per round attempt; weekly board is just a time filter over this
create table if not exists public.xp_events (
  id          bigserial primary key,
  student_id  uuid not null references public.students(id) on delete cascade,
  round_id    text,
  xp          int not null,
  score       numeric,
  created_at  timestamptz not null default now()
);

-- optional debugging log
create table if not exists public.events (
  id          bigserial primary key,
  student_id  uuid references public.students(id) on delete cascade,
  round_id    text,
  action      text,
  created_at  timestamptz not null default now()
);

-- key/value config: admin_password (hashed) and weekly_anchor
create table if not exists public.app_config (
  key   text primary key,
  value text
);

-- ---------- lock everything down ----------
alter table public.students   enable row level security;
alter table public.progress   enable row level security;
alter table public.xp_events  enable row level security;
alter table public.events     enable row level security;
alter table public.app_config enable row level security;
-- (no policies created => anon/authenticated get nothing directly)

revoke all on public.students, public.progress, public.xp_events, public.events, public.app_config from anon, authenticated;

-- ============================================================
--  HELPERS
-- ============================================================
create or replace function public._cgg_week_start()
returns timestamptz language sql stable as $$
  select greatest(
    date_trunc('week', now()),                                  -- Monday 00:00
    coalesce((select value::timestamptz from public.app_config where key = 'weekly_anchor'), 'epoch')
  );
$$;

-- verify a learner; returns the student id or null
create or replace function public._cgg_auth(p_name text, p_password text)
returns uuid language sql stable security definer set search_path = public, extensions as $$
  select id from public.students
  where display_name = p_name and password is not null and password = p_password;
$$;

-- verify the admin password against the bcrypt hash in app_config
create or replace function public._cgg_admin_ok(p_admin_password text)
returns boolean language sql stable security definer set search_path = public, extensions as $$
  select coalesce(
    (select value = crypt(p_admin_password, value) from public.app_config where key = 'admin_password'),
    false);
$$;

-- ============================================================
--  LEARNER RPC
-- ============================================================

-- names + whether a password is set (NO passwords). Safe for the picker.
create or replace function public.cgg_list_students()
returns table (id uuid, display_name text, has_password boolean)
language sql stable security definer set search_path = public, extensions as $$
  select id, display_name, (password is not null) from public.students order by display_name;
$$;

create or replace function public.cgg_login(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare s public.students;
begin
  select * into s from public.students where display_name = p_name;
  if not found then return jsonb_build_object('ok', false, 'error', 'no_such_user'); end if;
  if s.password is null then return jsonb_build_object('ok', false, 'firstLogin', true); end if;
  if s.password <> p_password then return jsonb_build_object('ok', false, 'error', 'wrong_password'); end if;
  update public.students set last_active_at = now() where id = s.id;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.cgg_first_login(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare s public.students;
begin
  if length(coalesce(p_password,'')) < 4 then return jsonb_build_object('ok', false, 'error', 'too_short'); end if;
  select * into s from public.students where display_name = p_name;
  if not found then return jsonb_build_object('ok', false, 'error', 'no_such_user'); end if;
  if s.password is not null then return jsonb_build_object('ok', false, 'error', 'already_set'); end if;
  update public.students set password = p_password, last_active_at = now() where id = s.id;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.cgg_get_state(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; prog jsonb; total int; badges jsonb;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.students set last_active_at = now() where id = sid;

  select coalesce(jsonb_object_agg(round_id, jsonb_build_object(
            'best_score', best_score, 'attempts', attempts, 'total_xp', total_xp,
            'passed', passed, 'last_played_at', last_played_at)), '{}'::jsonb)
    into prog from public.progress where student_id = sid;

  select coalesce(sum(xp), 0) into total from public.xp_events where student_id = sid;

  select coalesce(jsonb_agg(round_id), '[]'::jsonb) into badges
    from public.progress where student_id = sid and passed;

  return jsonb_build_object('ok', true,
    'student', jsonb_build_object('id', sid, 'name', p_name),
    'progress', prog, 'totalXp', total, 'badges', badges);
end; $$;

create or replace function public.cgg_submit_round(
  p_name text, p_password text, p_round text,
  p_score numeric, p_xp int, p_total int, p_correct int)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; was_passed boolean := false; now_passed boolean; xp_award int;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  now_passed := (p_score >= 0.8);

  select passed into was_passed from public.progress where student_id = sid and round_id = p_round;
  was_passed := coalesce(was_passed, false);

  -- Anti-farming: once a round has been passed, replays earn 0 XP (the badge is
  -- already won). A round NOT yet passed still earns XP on every attempt. The
  -- amount is clamped here too, so a tampered client cannot inject huge XP.
  if was_passed then
    xp_award := 0;
  else
    xp_award := greatest(0, least(coalesce(p_xp, 0), 500));
  end if;

  insert into public.progress (student_id, round_id, best_score, attempts, total_xp, passed, last_played_at)
  values (sid, p_round, p_score, 1, xp_award, now_passed, now())
  on conflict (student_id, round_id) do update set
    best_score = greatest(public.progress.best_score, excluded.best_score),
    attempts   = public.progress.attempts + 1,
    total_xp   = public.progress.total_xp + excluded.total_xp,
    passed     = public.progress.passed or excluded.passed,
    last_played_at = now();

  if xp_award > 0 then
    insert into public.xp_events (student_id, round_id, xp, score) values (sid, p_round, xp_award, p_score);
  end if;
  update public.students set last_active_at = now() where id = sid;

  return jsonb_build_object('ok', true, 'passed', now_passed,
    'badgeEarned', (now_passed and not was_passed),
    'xpAwarded', xp_award, 'alreadyPassed', was_passed);
end; $$;

-- leaderboard: names + XP only, weekly and all-time, with the caller's own rank.
create or replace function public.cgg_leaderboard(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; ws timestamptz; weekly jsonb; alltime jsonb; my_w jsonb; my_a jsonb;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  ws := public._cgg_week_start();

  with totals as (
    select s.id, s.display_name as name,
           coalesce(sum(e.xp) filter (where e.created_at >= ws), 0) as wk,
           coalesce(sum(e.xp), 0) as al
    from public.students s left join public.xp_events e on e.student_id = s.id
    group by s.id, s.display_name
  ),
  wrank as (select *, rank() over (order by wk desc) r from totals),
  arank as (select *, rank() over (order by al desc) r from totals)
  select
    (select jsonb_agg(jsonb_build_object('name', name, 'xp', wk, 'rank', r, 'me', id = sid) order by r) from wrank),
    (select jsonb_agg(jsonb_build_object('name', name, 'xp', al, 'rank', r, 'me', id = sid) order by r) from arank),
    (select jsonb_build_object('name', name, 'xp', wk, 'rank', r, 'me', true) from wrank where id = sid),
    (select jsonb_build_object('name', name, 'xp', al, 'rank', r, 'me', true) from arank where id = sid)
  into weekly, alltime, my_w, my_a;

  return jsonb_build_object('ok', true,
    'weekly', coalesce(weekly,'[]'::jsonb), 'allTime', coalesce(alltime,'[]'::jsonb),
    'myWeekly', my_w, 'myAllTime', my_a);
end; $$;

-- ============================================================
--  ADMIN RPC  (every function checks the admin password)
-- ============================================================
create or replace function public.cgg_admin_login(p_admin_password text)
returns jsonb language sql security definer set search_path = public, extensions as $$
  select jsonb_build_object('ok', public._cgg_admin_ok(p_admin_password));
$$;

create or replace function public.cgg_admin_data(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare ws timestamptz; rows jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  ws := public._cgg_week_start();

  with totals as (
    select s.id, s.display_name as name, s.password, s.last_active_at,
           coalesce(sum(e.xp) filter (where e.created_at >= ws), 0) as wk,
           coalesce(sum(e.xp), 0) as al
    from public.students s left join public.xp_events e on e.student_id = s.id
    group by s.id, s.display_name, s.password, s.last_active_at
  ),
  ranked as (select *, rank() over (order by al desc) r from totals)
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'name', name, 'password', password,
      'weeklyXp', wk, 'allTimeXp', al, 'rank', r, 'lastActive', last_active_at,
      'rounds', coalesce((select jsonb_object_agg(round_id, jsonb_build_object(
                    'best_score', best_score, 'attempts', attempts, 'passed', passed,
                    'last_played_at', last_played_at)) from public.progress p where p.student_id = ranked.id), '{}'::jsonb)
    ) order by al desc), '[]'::jsonb)
  into rows from ranked;

  return jsonb_build_object('ok', true, 'rows', rows, 'inactiveDays', 7);
end; $$;

create or replace function public.cgg_admin_reset_weekly(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  insert into public.app_config(key, value) values ('weekly_anchor', now()::text)
    on conflict (key) do update set value = excluded.value;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.cgg_admin_add_student(p_admin_password text, p_name text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  insert into public.students (display_name) values (p_name)
    on conflict (display_name) do nothing;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.cgg_admin_remove_student(p_admin_password text, p_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  delete from public.students where id = p_id;
  return jsonb_build_object('ok', true);
end; $$;

-- reset a learner's password back to "not set" so they can re-pick it
create or replace function public.cgg_admin_reset_password(p_admin_password text, p_id uuid)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  update public.students set password = null where id = p_id;
  return jsonb_build_object('ok', true);
end; $$;

-- ============================================================
--  GRANTS — anon may only EXECUTE the API (never touch tables)
-- ============================================================
grant execute on function
  public.cgg_list_students(),
  public.cgg_login(text, text),
  public.cgg_first_login(text, text),
  public.cgg_get_state(text, text),
  public.cgg_submit_round(text, text, text, numeric, int, int, int),
  public.cgg_leaderboard(text, text),
  public.cgg_admin_login(text),
  public.cgg_admin_data(text),
  public.cgg_admin_reset_weekly(text),
  public.cgg_admin_add_student(text, text),
  public.cgg_admin_remove_student(text, uuid),
  public.cgg_admin_reset_password(text, uuid)
to anon, authenticated;
