# Project status — updated 2026-07-06

## Where we are
Live on GitHub Pages (megzieberr.github.io/circle-geo-quest) with Supabase backend.
All 43 rounds shipped; holiday features (hints, Fix-Mistakes, daily streak,
Star-of-the-Week, Boost mode, PWA + push) are live. First rally fired Fri 3 Jul
(all-time standings); first crown lands Mon 6 Jul. Latest: teacher dashboard can
now show the REAL weekly announcements (crown + rally) for WhatsApp screenshots.

## Decisions
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
- Run `supabase/phase8.sql` in the Supabase SQL editor (additive, safe while
  learners play) — until then the "🌟 Weekly winners" button shows a reminder
  instead of the crown. The rally button works regardless.
- Hard-refresh the admin page (Ctrl+F5) to pick up the new buttons.

## Next up
- Screenshot the crown/rally from the admin dashboard for the class WhatsApp
  group (switch the game's language toggle first if the Afrikaans version is
  wanted).
- Nothing else agreed; chapter/round content is complete.
