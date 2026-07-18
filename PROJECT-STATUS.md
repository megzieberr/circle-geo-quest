# Project status — updated 2026-07-18

## Where we are
Live on GitHub Pages (megzieberr.github.io/circle-geo-quest) with Supabase backend.
All 43 rounds shipped; holiday features (hints, Fix-Mistakes, daily streak,
Star-of-the-Week, Boost mode, PWA + push) are live, plus the CIRCLE CHAMPION
award (teacher's-choice, reveal Mon 20 Jul — champion picked, phase8+10 applied).
NEW 2026-07-18: the engagement plan (docs/engagement-plan.md) is BUILT and live —
shared celebration modal (js/celebrate.js), full-screen badge unlock ceremony,
streak milestones (day 3/7/14/30, server-side anti-farming via phase11.sql), and
nicknames & avatars (freeform nickname + emoji avatar shown on leaderboards and
weekly reveals; real names stay authoritative on the admin dashboard, which also
gained a reset-nickname moderation action; phase12.sql). Both migrations are
APPLIED to live Supabase; advisors clean (0 errors).

## Decisions
- 2026-07-18: Nickname moderation = TEACHER AUTHORITY, no profanity filter.
  Blocklists were rejected because the class is bilingual and innocent Afrikaans
  words false-positive against English lists (e.g. "vak" = subject — the
  Scunthorpe problem). Freeform input (24-char cap) + admin reset action that
  NULLS the nickname (never edits it) back to the real name until the learner
  picks again; the old nickname is logged to `events` (`nickname_reset:<old>`)
  so a record survives. Avatars are a fixed list of ~20 emoji slugs in CONFIG
  (validated server-side; unknown ids stored as null) — native emoji, no image
  assets, nothing hand-drawn.
- 2026-07-18: The public-repo rule is EXTENDED beyond names: no learner-
  identifiable data of any kind (real marks, scores, anecdotes about specific
  kids). A spec doc briefly quoted a real June exam mark; reworded before merge.
- 2026-07-18 (lesson): when a migration replaces an existing RPC, base it on the
  LIVE definition (pg_get_functiondef), not on schema.sql — phase12's first
  draft of cgg_admin_data was based on schema.sql and would have re-exposed
  learner passwords that phase5 had deliberately removed (caught in review,
  fixed before applying: hasPassword boolean preserved).
- 2026-07-13 (later): Repo deleted + recreated to purge a learner name that a
  cloud-dispatch PR had committed into history (phase10 seed + this file). History
  was rewritten first (git-filter-repo), but GitHub keeps merged-PR refs alive, so
  only deletion kills the cached commits. ALL pre-scrub commit SHAs are stale; PR
  history restarted; clean-history bundle at Desktop\circle-geo-quest-CLEAN-2026-07-13.bundle.
  Rule reaffirmed: no learner names in this repo, ever — the champion pick lives in
  Supabase app_config only, set from the admin dashboard. Check dispatch PRs for
  names before merging.
- 2026-07-13: Added Circle Champion — deliberately NOT computed. The four weekly
  awards (Star/Improved/On Fire/Perfect Week) all reward bursts, so a slow-and-
  steady learner keeps getting bumped by someone cramming rounds. The champion is
  the teacher's call, set from the admin dashboard (🏆 card → pick a learner).
  The first pick is chosen by the teacher from the admin dashboard (no name is
  seeded in the repo — it's public). Stored as app_config key
  `champion_name`; returned by cgg_weekly_results / cgg_admin_weekly_results; set
  via cgg_admin_set_champion. It leads the popup as the hero (gold) chip above Star
  of the Week, which keeps its own gold.
- 2026-07-13: ONE-TIME reveal. Even though the champion is set on the server, the
  learner crown only shows it on the FINAL week's results day — gated in weekly.js
  to `CHAMPION_REVEAL = Mon 20 Jul 2026` (the last crown before school restarts Tue
  21 Jul). It is hidden this week and every week after, so it never shows early or
  lingers. Teacher previews (?wk=crown + admin 🏆 button) ignore the gate for
  ahead-of-time screenshots. To reuse next term, bump CHAMPION_REVEAL.
- 2026-07-06: Admin "🌟 Weekly winners" / "🔥 Rally board" buttons reuse the exact
  learner modal (same markup/CSS) so screenshots match what kids see; the
  learner-personal line is swapped for nothing (crown) or a top-3 podium (rally).
- 2026-07-06: Winners come from a new admin RPC `cgg_admin_weekly_results`
  (phase8.sql) — admin-password twin of the learner RPC, no personal fields.
  Rally needs no SQL (built from adminData the dashboard already loads).
- 2026-07-06: Popup language follows the game's EN/AF toggle saved on the device.
- 2026-07-05: First rally shows all-time XP standings (board was empty week 1);
  later rallies weekly as normal.
- (Earlier decisions predate this file — see git log and auto-memory.)

## Pending on Megan
- Eyeball the new features on live (hard-refresh; admin page Ctrl+F5): the
  Customize link on the home screen, the nickname column + "reset nickname"
  button on the dashboard, and set your teacher-preview nickname if you fancy.
  Everything is deployed and smoke-tested in local mode; nothing blocks play.

## Next up
- Screenshot the crown/rally from the admin dashboard for the class WhatsApp
  group (switch the game's language toggle first if the Afrikaans version is
  wanted). Champion reveal fires Mon 20 Jul.
- Watch how the class takes to nicknames in week 1 of term; the remaining
  big-corp tricks from the brainstorm (variable "double XP" rewards, endowed
  progress on badge sets, limited-time events) are noted in chat but NOT
  specced — decide after seeing how these four land.
