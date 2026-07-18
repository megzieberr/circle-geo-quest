# Project status — updated 2026-07-18

## Where we are
Live on GitHub Pages (megzieberr.github.io/circle-geo-quest) with Supabase backend.
All 43 rounds shipped; holiday features (hints, Fix-Mistakes, daily streak,
Star-of-the-Week, Boost mode, PWA + push) are live. First rally fired Fri 3 Jul
(all-time standings); first crown lands Mon 6 Jul. Latest: a new CIRCLE CHAMPION
award — a hand-picked teacher's-choice honour that leads the Monday crown popup,
for the learner who plays the game the way it's meant to be played (every day,
steady, all the way through), independent of weekly XP so cramming can't take it.

## Decisions
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
- Nothing. Verified live 2026-07-18: phase8 AND phase10 are both applied
  (RPCs present in the database) and a Circle Champion has been picked via
  the admin 🏆 card (name lives in app_config on the server only, as designed).
  All set for the Mon 20 Jul reveal.

## Next up
- Screenshot the crown/rally from the admin dashboard for the class WhatsApp
  group (switch the game's language toggle first if the Afrikaans version is
  wanted).
- Nothing else agreed; chapter/round content is complete.
