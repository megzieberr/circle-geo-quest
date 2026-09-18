# Roster split plan: Gr11 and Gr12 on separate boards (2026-09-10)

Status: PLAN ONLY. Not built. Megan reads it back first; build starts on her yes.

⚠ Public repo: no learner names in this file. The one existing learner who moves
to Gr12 is named in the private PROJECT-HISTORY.md only.

## Goal

Her matrics play through the rounds this holiday. Gr12 and Gr11 must never share
a weekly leaderboard, a Monday results popup, a champion, or see each other's
names. The name picker stays (she types the names, so she always knows who is
who). Gr12 gets its own link; nothing changes for the Gr11s.

Rejected 2026-09-10: self-made profiles (Times Up style). Her call: random
usernames would make the admin table unreadable. Do not re-propose.

## What a learner sees

- Gr11: same link, same picker, same names, same boards. No visible change.
- Gr12: link `https://megzieberr.github.io/circle-geo-quest/?class=gr12`.
  Picker shows Gr12 names only; the login card eyebrow says
  "Graad 12 · Sirkelmeetkunde" / "Grade 12 · Circle Geometry". After login the
  leaderboard (weekly + all-time), the Monday popup (star, most improved, on
  fire, perfect week, podium) and the champion are Gr12-only.
- The `?class=` choice is remembered in localStorage (same trick as
  `cgg.forceLocal`). Why: the installed PWA opens the plain start URL, so
  without this a matric who installs the app lands on the Gr11 picker. After
  login the session's own cohort does the filtering server-side regardless of
  which link was used.
- Known soft spot, accepted: the picker is filtered by the link, not by who is
  logged in (nobody is yet). A matric on the plain link sees Gr11 names on the
  picker, never on a board. Two links handles it in practice.

## Database: one migration, `supabase/phase21.sql`

1. `alter table students add column cohort text not null default 'gr11'`
   with `check (cohort in ('gr11','gr12'))`. All 21 existing learners = gr11.
2. Move the one learner to gr12 (`update students set cohort='gr12' where
   display_name = '<name in PROJECT-HISTORY>'`). Progress and XP travel with her.
3. Learner-facing RPCs filter by cohort (SERVER-side, this is the isolation):
   - `cgg_list_students(p_cohort text default 'gr11')`: only that cohort.
   - `cgg_leaderboard`: `where s.cohort = (caller's cohort)`.
   - `cgg_weekly_results`: same filter on the `weekly` CTE; champion read from
     the caller's cohort key.
4. Champion and weekly reset become per cohort:
   - app_config keys: `champion_name` stays for gr11; `champion_name:gr12` new.
     Same for `weekly_anchor` / `weekly_anchor:gr12`.
   - `_cgg_week_start(p_cohort)`; `cgg_admin_set_champion(pw, name, cohort)`;
     `cgg_admin_reset_weekly(pw, cohort)`.
5. Admin RPCs return `cohort` per row; admin.js filters in the browser
   (keeps the SQL change small): `cgg_admin_data`, `cgg_admin_weekly_results`
   (takes `p_cohort`, its board must be per class), `cgg_admin_timeline`,
   `cgg_admin_stuck`, `cgg_admin_integrity`, `cgg_admin_feedback`.
6. New: `cgg_admin_set_cohort(pw, student_id, cohort)` (the "move" button);
   `cgg_admin_add_student(pw, name, cohort)`.
7. Grants re-declared for every create-or-replace (house style). Push cron and
   the daily challenge are per learner: untouched.

## Client

- `js/auth.js`: read `?class=gr12`, remember it, pass to `listStudents`, swap
  the eyebrow text.
- `js/supabase.js` + BOTH stubs in `js/api.js` (LocalBackend AND the easily
  missed PreviewBackend): new params on listStudents / addStudent /
  setChampion / resetWeekly, new setCohort. LocalBackend demo roster gets a
  Gr12 demo learner so `?local=1` can prove the split offline.
- `js/admin.js`: a Gr11 / Gr12 toggle at the top of the dashboard that filters
  the main table, weekly winners (the class-group screenshot), needs-a-hand,
  stuck, timeline, integrity, feedback. Add-learner gets a class choice.
  Each learner row gets "→ Gr12" / "→ Gr11". Champion pick + reset act on the
  toggled class, with the class named in the confirm text.
- `index.html` title/meta: drop "Grade 11" (cosmetic; optional).
- No service-worker bump: this app caches nothing.

## Proof before any matric gets the link (verify-done gate)

1. `?local=1`: Gr11 and Gr12 demo learners; picker, leaderboard and Monday
   popup (force with the weekly.js `force` path) show only their own class.
2. Live, after the migration: run `/migration-check` (column, grants, search_path,
   the moved learner, all others still gr11).
3. Live, two accounts: her own (gr11) unchanged; one test learner added under
   gr12 via admin on the `?class=gr12` link. Read the whole screen at phone
   width for both: picker, both leaderboard tabs, Monday popup, home chip rank.
4. Admin toggle: each class alone in the table and the winners screenshot.
5. Remove the test learner.

## Effort and who builds

Opus worker (live learner data + migration): about half a day. One migration,
run together with her. Then her steps: add matric names under Gr12 in admin,
send the matric link.
