-- ============================================================
--  CIRCLE QUEST — PHASE 13 MIGRATION
--  Adds: BRUTE-FORCE THROTTLE + CHEAT-DETECTION READOUT.
--
--  WHY: the public anon key is in the (public) repo by necessity, and
--  cgg_list_students hands out every learner's name. Until now there was
--  NO rate limiting anywhere, so anyone with the key + a name could hammer
--  passwords forever. Kid-chosen 4-char passwords fall in minutes to an
--  automated guesser. This closes that.
--
--  THE KEY DESIGN POINT (why the throttle lives in the auth HELPERS, not
--  in cgg_login): every learner RPC authenticates by calling _cgg_auth,
--  and every admin RPC calls _cgg_admin_ok. A brute-forcer doesn't have
--  to use the login endpoint — cgg_get_state / cgg_leaderboard / etc. are
--  all equally good password oracles (they return ok:true vs error:auth).
--  So rate-limiting only cgg_login would be theatre. Instead the throttle
--  is baked into _cgg_auth and _cgg_admin_ok themselves, so EVERY path is
--  covered at once. Those two helpers change from STABLE sql to VOLATILE
--  plpgsql (they now record attempts); their happy-path result is
--  otherwise identical. Verified: both are only ever called as `x := f()`
--  inside plpgsql bodies, never inline in a SQL query that needs STABLE.
--
--  HOW TO RUN:
--    Supabase dashboard -> SQL Editor -> paste this whole file -> Run.
--    (The orchestrator applies migrations; this header is for the record.)
--
--  SAFE on the live database while learners play:
--    • Additive: one new table + four new helper functions + one new admin
--      RPC. The two existing helpers are REPLACED with same-signature,
--      same-return-type versions — no caller changes.
--    • Idempotent (if not exists / or replace).
--    • Same security model: SECURITY DEFINER, search_path pinned, tables
--      RLS-locked with no policies (only the definer helpers touch them).
--
--  KNOWN TRADE-OFF (documented so it's a choice, not a surprise): a
--  per-name lockout means a nuisance could deliberately fail a specific
--  classmate's login enough times to lock THEM out for the cooldown. This
--  is accepted: the cooldown is short (15 min), it self-heals, the real
--  kid just tells the teacher, and it's strictly better than leaving every
--  weak password guessable. The admin lockout is deliberately lenient
--  (20 fails / 5 min) so a griefer can't easily lock the teacher out of
--  her own dashboard, while still stopping an automated guesser cold —
--  and the admin password is a strong bcrypt-hashed passphrase anyway, so
--  this throttle is defence-in-depth, not the primary wall.
--
--  Rollback block at the very bottom (commented out).
-- ============================================================


-- ============================================================
--  PART A — THROTTLE STORAGE
-- ============================================================

-- One row per throttle key. Keys: 'learner:<lower(name)>' for each learner
-- login, and the single literal 'admin' for the teacher dashboard.
create table if not exists public.auth_throttle (
  key          text primary key,
  fails        int  not null default 0,     -- consecutive failures since last success/lock
  locked_until timestamptz,                 -- non-null + in the future => currently locked
  updated_at   timestamptz not null default now()
);

alter table public.auth_throttle enable row level security;
-- no policies => anon/authenticated can't touch it directly; only the
-- SECURITY DEFINER helpers below (which run as the table owner) can.
revoke all on public.auth_throttle from anon, authenticated;


-- ============================================================
--  PART B — THROTTLE HELPERS
-- ============================================================

-- Is this key currently locked? Returns the lock expiry if so, else null.
create or replace function public._cgg_locked(p_key text)
returns timestamptz
language sql stable security definer set search_path = public, extensions as $$
  select locked_until
  from public.auth_throttle
  where key = p_key and locked_until is not null and locked_until > now();
$$;

-- Record a failed attempt. Bumps the counter; once it reaches p_max, sets a
-- cooldown lock and resets the counter (so the next window starts clean).
create or replace function public._cgg_note_fail(p_key text, p_max int, p_cooldown interval)
returns void
language plpgsql security definer set search_path = public, extensions as $$
declare new_fails int;
begin
  insert into public.auth_throttle (key, fails, updated_at)
  values (p_key, 1, now())
  on conflict (key) do update
    set fails = public.auth_throttle.fails + 1,
        updated_at = now()
  returning fails into new_fails;

  if new_fails >= p_max then
    update public.auth_throttle
       set locked_until = now() + p_cooldown,
           fails = 0,
           updated_at = now()
     where key = p_key;
  end if;
end; $$;

-- Record a success: clear any accumulated failures / lock for this key.
-- Guarded so a normal (already-clean) login does no write at all.
create or replace function public._cgg_note_ok(p_key text)
returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  update public.auth_throttle
     set fails = 0, locked_until = null, updated_at = now()
   where key = p_key and (fails <> 0 or locked_until is not null);
end; $$;


-- ============================================================
--  PART C — AUTH HELPERS, REPLACED (throttle baked in; happy path
--  otherwise identical to the pre-phase13 versions)
-- ============================================================

-- Learner auth. Locked -> returns null (indistinguishable from a wrong
-- password to the caller, which is fine). Wrong password -> counts toward
-- the lockout. Correct password -> clears the counter. Threshold: 6 fails
-- -> 15 min. Keyed on the lowercased name so case can't dodge the lock.
create or replace function public._cgg_auth(p_name text, p_password text)
returns uuid
language plpgsql volatile security definer set search_path = public, extensions as $$
declare
  sid uuid;
  k   text := 'learner:' || lower(coalesce(p_name, ''));
begin
  if public._cgg_locked(k) is not null then
    return null;                       -- locked: reject without bumping further
  end if;

  select id into sid from public.students
   where display_name = p_name and password is not null and password = p_password;

  if sid is null then
    perform public._cgg_note_fail(k, 6, interval '15 minutes');
  else
    perform public._cgg_note_ok(k);
  end if;

  return sid;
end; $$;

-- Admin auth. Same shape, lenient threshold (20 fails -> 5 min) so a
-- griefer can't cheaply lock the teacher out, while an automated guesser
-- (which would fire thousands) is still stopped. bcrypt compare unchanged.
create or replace function public._cgg_admin_ok(p_admin_password text)
returns boolean
language plpgsql volatile security definer set search_path = public, extensions as $$
declare
  ok boolean;
  k  text := 'admin';
begin
  if public._cgg_locked(k) is not null then
    return false;                      -- locked: deny without checking
  end if;

  select (value = crypt(p_admin_password, value)) into ok
    from public.app_config where key = 'admin_password';
  ok := coalesce(ok, false);

  if ok then
    perform public._cgg_note_ok(k);
  else
    perform public._cgg_note_fail(k, 20, interval '5 minutes');
  end if;

  return ok;
end; $$;


-- cgg_login / cgg_first_login do their OWN password check and do NOT go
-- through _cgg_auth, so the helper-level throttle above does not cover the
-- login endpoint itself — a guesser using cgg_login directly would be
-- unthrottled. Replace cgg_login to share the SAME throttle key, so wrong
-- guesses via login AND via any other RPC accumulate together, and give the
-- UI a real "locked, try again later" signal. (cgg_first_login is left as
-- is: it only succeeds on a password-LESS account, so there is no password
-- to guess there — the account-claim risk it carries is a separate item,
-- addressed by a future class-code gate, not by rate limiting.)
create or replace function public.cgg_login(p_name text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  s  public.students;
  k  text := 'learner:' || lower(coalesce(p_name, ''));
  lu timestamptz;
begin
  lu := public._cgg_locked(k);
  if lu is not null then
    return jsonb_build_object('ok', false, 'error', 'locked', 'lockedUntil', lu);
  end if;

  select * into s from public.students where display_name = p_name;
  if not found then
    perform public._cgg_note_fail(k, 6, interval '15 minutes');   -- bound name-spray too
    return jsonb_build_object('ok', false, 'error', 'no_such_user');
  end if;
  if s.password is null then
    return jsonb_build_object('ok', false, 'firstLogin', true);   -- neutral: not a guess
  end if;
  if s.password <> p_password then
    perform public._cgg_note_fail(k, 6, interval '15 minutes');
    return jsonb_build_object('ok', false, 'error', 'wrong_password');
  end if;

  perform public._cgg_note_ok(k);
  update public.students set last_active_at = now() where id = s.id;
  return jsonb_build_object('ok', true);
end; $$;


-- ============================================================
--  PART D — CHEAT-DETECTION READOUT (read-only, admin-gated)
-- ============================================================

-- Because every question + answer lives in the client (needed for offline
-- play), the server cannot PREVENT a fake "pass" submitted straight to
-- cgg_submit_round. The defence is DETECTION, not prevention — this RPC
-- gives the dashboard the raw material to spot it, the same trail that
-- cleared the real-world "did a kid bypass the game?" question:
--   • per passed round: how many per-question events were logged (a genuine
--     graded round leaves ~5-30; a fake submit leaves 0), and when it was
--     last played. The CLIENT knows which round_ids are graded MC rounds
--     (that knowledge lives in the round config, not the DB), so admin.js
--     flags "passed a graded round with zero logged questions" and
--     "many rounds cleared within seconds of each other". Non-graded
--     intro/watch/discover rounds legitimately have zero — that's why the
--     server returns raw counts and lets the client, which has the
--     taxonomy, decide what's suspicious.
--   • whether the learner is currently locked out (throttle visibility).
create or replace function public.cgg_admin_integrity(p_admin_password text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare res jsonb;
begin
  if not public._cgg_admin_ok(p_admin_password) then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  with passed as (
    select p.student_id, p.round_id, p.last_played_at,
           (select count(*) from public.question_events q
             where q.student_id = p.student_id and q.round_id = p.round_id) as qcount
    from public.progress p
    where p.passed
  ),
  agg as (
    select s.id, s.display_name as name,
           public._cgg_locked('learner:' || lower(s.display_name)) as locked_until,
           coalesce(jsonb_agg(jsonb_build_object(
             'round', pa.round_id, 'qcount', pa.qcount, 'at', pa.last_played_at
           ) order by pa.last_played_at) filter (where pa.round_id is not null), '[]'::jsonb) as rounds
    from public.students s
    left join passed pa on pa.student_id = s.id
    group by s.id, s.display_name
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'name', name, 'lockedUntil', locked_until, 'rounds', rounds
         ) order by name), '[]'::jsonb)
    into res
  from agg;

  return jsonb_build_object('ok', true, 'students', res);
end; $$;


-- ============================================================
--  PART E — GRANTS (the replaced helpers keep their grants; only the
--  new admin RPC needs one. anon still can't touch any table.)
-- ============================================================
grant execute on function public.cgg_admin_integrity(text) to anon, authenticated;


-- ============================================================
--  ROLLBACK — uncomment and run ONLY to undo phase13. Re-running
--  schema.sql restores _cgg_auth / _cgg_admin_ok to their throttle-free
--  STABLE sql versions; then:
-- ============================================================
-- drop function if exists public.cgg_admin_integrity(text);
-- drop function if exists public._cgg_note_ok(text);
-- drop function if exists public._cgg_note_fail(text, int, interval);
-- drop function if exists public._cgg_locked(text);
-- drop table if exists public.auth_throttle;
