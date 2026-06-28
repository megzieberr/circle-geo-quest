-- ============================================================
--  CIRCLE QUEST — PHASE 6 MIGRATION
--  Adds: an ANONYMOUS end-of-game feedback survey.
--
--  Each learner picks one of five faces (1 = crying … 5 = heart-eyes)
--  and may add an optional written note. The teacher sees the spread
--  of faces and every comment — but NEVER who said what.
--
--  HOW IT STAYS ANONYMOUS:
--    • The feedback row itself stores NO learner id — only the rating,
--      the comment, and timestamps.
--    • A learner still logs in to submit (so randoms can't spam it, and
--      so they can EDIT their own answer). The only link from a learner
--      to their row is students.last_feedback_id, which is used purely
--      server-side for that edit/dedupe and is never returned by any
--      admin function. The dashboard cannot join it back to a name.
--
--  HOW TO RUN:
--    Supabase dashboard -> SQL Editor -> New query -> paste this WHOLE
--    file -> Run.
--
--  SAFE on the live database:
--    • ADDITIVE only — creates one table, one column, three functions.
--      Nothing existing is dropped or rewritten.
--    • Every statement is idempotent ("if not exists" / "or replace").
--    • Same security model as the rest: the table is RLS-locked with no
--      policies; the only way in is the password-checked functions below.
--
--  A rollback block is at the very bottom (commented out).
-- ============================================================


-- ============================================================
--  PART A — STORAGE
-- ============================================================

-- A1. The anonymous responses. No student_id here, on purpose.
create table if not exists public.feedback (
  id         bigserial primary key,
  rating     smallint not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A2. The ONLY link from a learner to a row — used server-side so a learner
--     can edit their own answer (and so we never create duplicates). Never
--     exposed to the dashboard.
alter table public.students
  add column if not exists last_feedback_id bigint;

-- A3. Lock the table down like every other table: RLS on, no policies,
--     public keys revoked. Reachable only via the functions below.
alter table public.feedback enable row level security;
revoke all on public.feedback from anon, authenticated;


-- ============================================================
--  PART B — FUNCTIONS (the app calls these; you don't)
-- ============================================================

-- B1. Submit (or update) the caller's anonymous feedback. Clamps the rating
--     to 1..5 and trims the comment. If the learner already has a row, it is
--     overwritten in place — no double-counting, and "change my answer" works.
create or replace function public.cgg_submit_feedback(
  p_name text, p_password text, p_rating int, p_comment text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  sid uuid;
  fid bigint;
  r   int;
  c   text;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  r := greatest(1, least(5, coalesce(p_rating, 0)));
  if r < 1 then
    return jsonb_build_object('ok', false, 'error', 'bad_rating');
  end if;
  c := nullif(left(btrim(coalesce(p_comment, '')), 1000), '');

  select last_feedback_id into fid from public.students where id = sid;

  if fid is not null then
    update public.feedback set rating = r, comment = c, updated_at = now() where id = fid;
  end if;

  if fid is null or not found then            -- no row yet (or it was deleted): make one
    insert into public.feedback (rating, comment) values (r, c) returning id into fid;
    update public.students set last_feedback_id = fid, last_active_at = now() where id = sid;
  else
    update public.students set last_active_at = now() where id = sid;
  end if;

  return jsonb_build_object('ok', true);
end; $$;

-- B2. Let a learner read back their OWN answer (to pre-fill the edit form).
--     Returns only their own row, found via the server-side link.
create or replace function public.cgg_get_feedback(p_name text, p_password text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare sid uuid; rec record;
begin
  sid := public._cgg_auth(p_name, p_password);
  if sid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;
  select f.rating, f.comment into rec
    from public.feedback f
    join public.students s on s.last_feedback_id = f.id
   where s.id = sid;
  if not found then
    return jsonb_build_object('ok', true, 'rating', null, 'comment', '');
  end if;
  return jsonb_build_object('ok', true, 'rating', rec.rating, 'comment', coalesce(rec.comment, ''));
end; $$;

-- B3. The teacher's ANONYMOUS report: the count of each face, the average,
--     the total responses, and every written comment (rating + text + time)
--     newest first. No names, no ids — there is no learner link to return.
create or replace function public.cgg_admin_feedback(p_admin_password text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare counts jsonb; comments jsonb; tot int; avg_rating numeric; learners int;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  select coalesce(jsonb_object_agg(g.r::text, g.c), '{}'::jsonb)
    into counts
  from (
    select s.r, coalesce(count(f.id), 0) as c
    from (select generate_series(1, 5) as r) s
    left join public.feedback f on f.rating = s.r
    group by s.r
  ) g;

  select count(*), round(avg(rating)::numeric, 2) into tot, avg_rating from public.feedback;

  select coalesce(jsonb_agg(jsonb_build_object(
            'rating', rating, 'comment', comment, 'at', updated_at
          ) order by updated_at desc), '[]'::jsonb)
    into comments
  from public.feedback
  where comment is not null and btrim(comment) <> '';

  select count(*) into learners from public.students;

  return jsonb_build_object('ok', true, 'counts', counts, 'total', tot,
                            'average', avg_rating, 'comments', comments,
                            'totalLearners', learners);
end; $$;


-- ============================================================
--  PART C — GRANTS (let the public key EXECUTE the new functions;
--  it still cannot touch any table directly)
-- ============================================================
grant execute on function
  public.cgg_submit_feedback(text, text, int, text),
  public.cgg_get_feedback(text, text),
  public.cgg_admin_feedback(text)
to anon, authenticated;


-- ============================================================
--  ROLLBACK — uncomment and run ONLY if you want to undo this.
--  (Dropping the table also deletes all collected feedback.)
-- ============================================================
-- drop function if exists public.cgg_admin_feedback(text);
-- drop function if exists public.cgg_get_feedback(text, text);
-- drop function if exists public.cgg_submit_feedback(text, text, int, text);
-- alter table public.students drop column if exists last_feedback_id;
-- drop table if exists public.feedback;
