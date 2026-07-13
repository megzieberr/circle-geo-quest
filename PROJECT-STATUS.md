# Project status — updated 2026-07-13

## Where we are
Live on GitHub Pages (megzieberr.github.io/circle-geo-quest) with Supabase backend.
All 43 rounds shipped; holiday features (hints, Fix-Mistakes, daily streak,
Star-of-the-Week, Boost mode, PWA + push) are live. First rally fired Fri 3 Jul
(all-time standings); first crown lands Mon 6 Jul. Latest: a new CIRCLE CHAMPION
award — a hand-picked teacher's-choice honour that leads the Monday crown popup,
for the learner who plays the game the way it's meant to be played (every day,
steady, all the way through), independent of weekly XP so cramming can't take it.

## Decisions
- 2026-07-13: Added Circle Champion — deliberately NOT computed. The four weekly
  awards (Star/Improved/On Fire/Perfect Week) all reward bursts, so a slow-and-
  steady learner keeps getting bumped by someone cramming rounds. The champion is
  the teacher's call, set from the admin dashboard (🏆 card → pick a learner), and
  stays until changed. First pick: a learner (seeded in phase10.sql). Stored as
  app_config key `champion_name`; returned by cgg_weekly_results /
  cgg_admin_weekly_results; set via cgg_admin_set_champion. It leads the popup as
  the hero (gold) chip above Star of the Week, which keeps its own gold.
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
- Run `supabase/phase10.sql` in the Supabase SQL editor (additive, safe while
  learners play). It seeds a learner as the first Circle Champion and adds the
  admin 🏆 picker. Until it's run, the dashboard's champion card shows a reminder.
  → Do this before Mon 20 Jul so the champion shows in that day's crown popup.
- After running it, open the admin dashboard, confirm the 🏆 card shows
  "Current champion: a learner" (the seed name must exactly match her
  display_name — if not, just pick her from the dropdown and Award).
- Run `supabase/phase8.sql` too if not already done (needed for "🌟 Weekly
  winners"). Hard-refresh the admin page (Ctrl+F5) to pick up the new card.

## Next up
- Screenshot the crown/rally from the admin dashboard for the class WhatsApp
  group (switch the game's language toggle first if the Afrikaans version is
  wanted).
- Nothing else agreed; chapter/round content is complete.
