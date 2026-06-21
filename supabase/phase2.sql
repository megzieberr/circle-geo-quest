-- ============================================================
--  CIRCLE QUEST — PHASE 2 MIGRATION
--  Adds: (1) Daily-Challenge XP on the leaderboard, and
--        (2) the teacher "hardest questions" item report.
--
--  HOW TO RUN:
--    Supabase dashboard  ->  SQL Editor  ->  New query  ->
--    paste this WHOLE file  ->  Run.
--
--  This is SAFE to run on the live database, even while learners are
--  playing:
--    • It is ADDITIVE — it only CREATES new things. It never drops or
--      rewrites any existing table or function, so nothing that works
--      today can break.
--    • Every statement is idempotent ("if not exists" / "or replace"),
--      so running it twice does no harm.
--    • It follows the exact same security model as your schema.sql:
--      the new table is locked with row-level security, and the app can
--      only reach it through password-checked SECURITY DEFINER functions.
--
--  A rollback block is at the very bottom (commented out) in case you
--  ever want to undo this.
-- ============================================================


-- ============================================================
--  PART A — STORAGE (the "new fields" we discussed)
-- ============================================================

-- A1. One new column on the existing students table. It remembers the
--     last calendar day a learner claimed their Daily reward, so the XP
--     can be granted at most once per day (the anti-farm guard).
alter table public.students
  add column if not exists last_daily_day date;

-- A2. One new table: one row per question a learner answers in a graded
--     round. This is what powers the teacher report — your other tables
--     only store round-level totals, so there was nowhere to see which
--     individual question tripped the class.
create table if not exists public.question_events (
  id          bigserial primary key,
  student_id  uuid    not null references public.students(id) on delete cascade,
  round_id    text    not null,                 -- e.g. "r18"
  question_id text    not null,                 -- e.g. "r18-3"
  correct     boolean not null,                 -- did they get it right?
  first_try   boolean not null,                 -- a genuine first pass (true) vs a replay of a passed round (false)
  chosen      text,                             -- which WRONG answer they picked (null when correct) = misconception data
  created_at  timestamptz not null default now()
);

-- helpful index for the per-question grouping in the report
create index if not exists question_events_qid_idx
  on public.question_events (question_id);

-- A3. Lock the new table down exactly like every other table: RLS on,
--     no policies, and the public keys revoked. The only way in is the
--     SECURITY DEFINER functions below.
alter table public.question_events enable row level security;
revoke all on public.question_events from anon, authenticated;


-- ============================================================
--  PART B — FUNCTIONS (the app calls these; you don't)
-- ============================================================

-- B1. Claim the Daily-Challenge XP. Grants a flat 25 XP, but only the
--     first time a learner finishes the Daily on a given local day. The
--     client passes its own date (p_day) because "today" depends on the
--     learner's timezone, not the server's. The XP is written into your
--     existing xp_events table, so it flows into both the weekly and the
--     all-time leaderboards automatically.
create or replace function public.cgg_submit_daily(
  p_name text, p_password text, p_day date, p_correct int, p_total int)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  sid   uuid;
  last  date;
  award int := 25;          -- fixed server-side so a tampered client can't inflate it
  sc    numeric;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  select last_daily_day into last from public.students where id = sid;

  -- already claimed today (or for a day at/after the request) -> grant nothing
  if last is not null and p_day <= last then
    update public.students set last_active_at = now() where id = sid;
    return jsonb_build_object('ok', true, 'xpAwarded', 0, 'alreadyClaimed', true);
  end if;

  update public.students
     set last_daily_day = p_day, last_active_at = now()
   where id = sid;

  sc := case when coalesce(p_total, 0) > 0 then p_correct::numeric / p_total else null end;
  insert into public.xp_events (student_id, round_id, xp, score)
  values (sid, 'daily', award, sc);

  return jsonb_build_object('ok', true, 'xpAwarded', award, 'alreadyClaimed', false);
end; $$;

-- B2. Log a batch of per-question results at the end of a round. p_items
--     is a JSON array like:
--       [{"qid":"r18-3","correct":false,"firstTry":true,"chosen":"x = 50°"}, ...]
--     Best-effort: it never blocks play, it just records what happened.
create or replace function public.cgg_log_items(
  p_name text, p_password text, p_round text, p_items jsonb)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  sid uuid;
  n   int := 0;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    return jsonb_build_object('ok', true, 'logged', 0);
  end if;

  insert into public.question_events (student_id, round_id, question_id, correct, first_try, chosen)
  select sid,
         p_round,
         it->>'qid',
         coalesce((it->>'correct')::boolean, false),
         coalesce((it->>'firstTry')::boolean, false),
         nullif(it->>'chosen', '')
  from jsonb_array_elements(p_items) as it
  where it->>'qid' is not null;

  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'logged', n);
end; $$;

-- B3. The teacher report. For each question, looks at genuine first-pass
--     attempts only (replays excluded), and returns how hard it was plus
--     the single most-commonly-picked wrong answer. Sorted hardest first.
create or replace function public.cgg_admin_item_stats(p_admin_password text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare result jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  with first_only as (
    select * from public.question_events where first_try
  ),
  agg as (
    select question_id as qid,
           max(round_id) as round_id,
           count(*)                          as attempts,
           count(*) filter (where correct)   as correct,
           round(100.0 * count(*) filter (where correct) / nullif(count(*), 0)) as correct_pct
    from first_only
    group by question_id
  ),
  wrongs as (
    select question_id as qid, chosen, count(*) as c,
           row_number() over (partition by question_id order by count(*) desc) as rn
    from first_only
    where not correct and chosen is not null
    group by question_id, chosen
  )
  select coalesce(jsonb_agg(jsonb_build_object(
            'qid',           a.qid,
            'roundId',       a.round_id,
            'attempts',      a.attempts,
            'correct',       a.correct,
            'correctPct',    a.correct_pct,
            'topWrong',      w.chosen,
            'topWrongCount', coalesce(w.c, 0)
          ) order by a.correct_pct asc nulls last, a.attempts desc), '[]'::jsonb)
    into result
  from agg a
  left join wrongs w on w.qid = a.qid and w.rn = 1;

  return jsonb_build_object('ok', true, 'rows', result);
end; $$;


-- ============================================================
--  PART C — GRANTS (let the public key EXECUTE the new functions,
--  exactly like the existing API; it still cannot touch any table)
-- ============================================================
grant execute on function
  public.cgg_submit_daily(text, text, date, int, int),
  public.cgg_log_items(text, text, text, jsonb),
  public.cgg_admin_item_stats(text)
to anon, authenticated;


-- ============================================================
--  ROLLBACK — uncomment and run ONLY if you want to undo this.
--  (Dropping question_events also deletes the logged report data.)
-- ============================================================
-- drop function if exists public.cgg_admin_item_stats(text);
-- drop function if exists public.cgg_log_items(text, text, text, jsonb);
-- drop function if exists public.cgg_submit_daily(text, text, date, int, int);
-- drop table if exists public.question_events;
-- alter table public.students drop column if exists last_daily_day;
