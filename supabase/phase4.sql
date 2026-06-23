-- ============================================================
--  CIRCLE QUEST — PHASE 4 MIGRATION
--  Adds: daily-reminder PUSH NOTIFICATIONS.
--        • one new table  : push_subscriptions (one row per device)
--        • two new RPCs   : cgg_save_push / cgg_remove_push
--
--  HOW TO RUN:
--    Supabase dashboard  ->  SQL Editor  ->  New query  ->
--    paste this WHOLE file  ->  Run.
--
--  SAFE to run on the live database, even while learners play:
--    • ADDITIVE — it only CREATES new things. It never drops or
--      rewrites any existing table or function.
--    • Idempotent ("if not exists" / "or replace") — safe to re-run.
--    • Same security model as schema.sql: the new table has row-level
--      security ON with NO policies, so the public anon key can never
--      touch it. The only way in is the password-checked SECURITY
--      DEFINER functions below. The notification SENDER (the Edge
--      Function) uses the service-role key, which bypasses RLS server-side.
--
--  A rollback block is at the very bottom (commented out).
-- ============================================================


-- ============================================================
--  PART A — STORAGE
-- ============================================================

-- One row per device a learner has turned reminders on for. Re-allowing on
-- the same device updates the same row (endpoint is unique), so there are
-- never duplicates. Deleting a learner removes their devices automatically.
create table if not exists public.push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.students(id) on delete cascade,
  endpoint     text not null unique,          -- identifies one device's push channel
  subscription jsonb not null,                -- the full web-push subscription (keys + endpoint)
  created_at   timestamptz not null default now()
);

create index if not exists push_subscriptions_student_idx
  on public.push_subscriptions (student_id);

-- Lock it down exactly like every other table: RLS on, no policies, revoke.
alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon, authenticated;


-- ============================================================
--  PART B — FUNCTIONS (the app calls these; you don't)
-- ============================================================

-- B1. Save (or refresh) this device's subscription against the learner.
--     Verifies the learner's password server-side first, just like every
--     other learner function.
create or replace function public.cgg_save_push(
  p_name text, p_password text, p_endpoint text, p_subscription jsonb)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;

  insert into public.push_subscriptions (student_id, endpoint, subscription)
  values (sid, p_endpoint, p_subscription)
  on conflict (endpoint) do update
    set student_id   = excluded.student_id,
        subscription = excluded.subscription;

  update public.students set last_active_at = now() where id = sid;
  return jsonb_build_object('ok', true);
end; $$;

-- B2. Forget this device (learner turned reminders off).
create or replace function public.cgg_remove_push(
  p_name text, p_password text, p_endpoint text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  delete from public.push_subscriptions where endpoint = p_endpoint and student_id = sid;
  return jsonb_build_object('ok', true);
end; $$;


-- ============================================================
--  PART C — GRANTS (let the public key EXECUTE the new functions;
--  it still cannot touch any table directly)
-- ============================================================
grant execute on function
  public.cgg_save_push(text, text, text, jsonb),
  public.cgg_remove_push(text, text, text)
to anon, authenticated;


-- ============================================================
--  ROLLBACK — uncomment and run ONLY if you want to undo this.
-- ============================================================
-- drop function if exists public.cgg_save_push(text, text, text, jsonb);
-- drop function if exists public.cgg_remove_push(text, text, text);
-- drop table if exists public.push_subscriptions;
