-- ============================================================
--  CIRCLE QUEST — PHASE 5 MIGRATION
--  Privacy: the admin dashboard no longer receives learner passwords.
--
--  WHAT THIS DOES:
--    Redefines cgg_admin_data so it returns 'hasPassword' (a yes/no)
--    instead of the actual 'password'. The dashboard can still show who
--    has set a password and offer the "reset pw" button — but the real
--    passwords are never sent to the browser at all.
--
--  HOW TO RUN:
--    Supabase dashboard -> SQL Editor -> New query -> paste this WHOLE
--    file -> Run.
--
--  SAFE on the live database:
--    • Only CREATE OR REPLACE on one function — no tables touched, no data
--      changed. Learner passwords still exist in the table (so "reset pw"
--      and login keep working); they're just no longer returned to admin.
--    • Idempotent — safe to run more than once.
--    • The dashboard already works before you run this (it falls back
--      gracefully); running this just closes the door fully.
--
--  Rollback (restore password visibility) is in schema.sql's original
--  cgg_admin_data definition.
-- ============================================================

create or replace function public.cgg_admin_data(p_admin_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare ws timestamptz; rows jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then return jsonb_build_object('ok', false, 'error', 'auth'); end if;
  ws := public._cgg_week_start();

  with totals as (
    select s.id, s.display_name as name, (s.password is not null) as has_password, s.last_active_at,
           coalesce(sum(e.xp) filter (where e.created_at >= ws), 0) as wk,
           coalesce(sum(e.xp), 0) as al
    from public.students s left join public.xp_events e on e.student_id = s.id
    group by s.id, s.display_name, (s.password is not null), s.last_active_at
  ),
  ranked as (select *, rank() over (order by al desc) r from totals)
  select coalesce(jsonb_agg(jsonb_build_object(
      'id', id, 'name', name, 'hasPassword', has_password,
      'weeklyXp', wk, 'allTimeXp', al, 'rank', r, 'lastActive', last_active_at,
      'rounds', coalesce((select jsonb_object_agg(round_id, jsonb_build_object(
                    'best_score', best_score, 'attempts', attempts, 'passed', passed,
                    'last_played_at', last_played_at)) from public.progress p where p.student_id = ranked.id), '{}'::jsonb)
    ) order by al desc), '[]'::jsonb)
  into rows from ranked;

  return jsonb_build_object('ok', true, 'rows', rows, 'inactiveDays', 7);
end; $$;

grant execute on function public.cgg_admin_data(text) to anon, authenticated;
