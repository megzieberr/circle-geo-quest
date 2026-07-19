# Project status — updated 2026-07-19

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
ALSO NEW 2026-07-18: SOUNDS (js/sound.js — Web Audio pings, no files, mute
toggle in header, quiet under prefers-reduced-motion) and a SECURITY pass
(phase13.sql, APPLIED to live): brute-force throttle baked into the auth
helpers so every RPC path is covered (learner 6 fails/15 min, admin 20/5 min
on top of bcrypt), friendly lockout message, and a "Worth a look" dashboard
panel (cgg_admin_integrity) that flags fake-progress signatures (graded round
passed with 0 questions logged; burst of rounds cleared seconds apart).
Throttle + detection both verified working (live lockout probe; synthetic
cheater caught, honest play ignored).
NEW 2026-07-19: (1) AVATARS expanded 20 → 54 in 6 category groups
(phase12's list was "a basketball and a fox"-sparse; Kahoot-style variety
now) — phase14.sql APPLIED to live via MCP + verified. (2) PI THE MASCOT:
Megan's own sprite sheets (pi-mascot/, sliced by slice_pi.py into
assets/pi/) — idles on the home screen, random/tappable tricks (wave,
bounce, thumbs, hang — the hanging sprite brings its own pull-up bar),
thumbs-up cameo on passed rounds; pure amusement by design, hidden under
prefers-reduced-motion. Timing preview page: pi-preview.html.
(3) SOUNDS: correct = coin sparkle, wrong = two soft steps down (her
picks from sound-lab.html, kept in-repo for future re-tuning).

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
- 2026-07-18 (security): brute-force throttle lives in the auth HELPERS
  (_cgg_auth / _cgg_admin_ok), NOT only in cgg_login — because every RPC that
  takes name+password is a password oracle, so rate-limiting just the login
  endpoint would be theatre. Learner lockout keyed by lowercased name (6
  fails/15 min); accepted trade-off = a nuisance can lock a specific classmate
  out for the cooldown (self-heals, visible). Admin throttle deliberately
  lenient (20 fails/5 min) so a griefer can't lock the teacher out of her own
  dashboard, and it's only defence-in-depth over the strong bcrypt passphrase.
- 2026-07-18 (anti-cheat is DETECTION, not prevention): because every question
  + answer must live client-side for offline play, a valid login can POST a fake
  score to cgg_submit_round and nothing server-side can truly stop it. So the
  play is detection: cgg_admin_integrity + the dashboard panel flag the traces
  (graded round passed with 0 logged questions; a burst of rounds seconds apart)
  — the same trail that cleared Brooklyn. "Graded round" = a round with a
  non-empty `questions` array (only those call logItems); intro/watch/discover
  rounds legitimately log nothing and are excluded.
- 2026-07-18 (RESOLVED — Megan declined the class-code gate): the first-login
  account-claim hole is moot for this class — every learner has already claimed
  their account and set a password, so there are no password-less names left to
  claim. (If a new learner is ever added mid-term via the admin "add student"
  button, their name IS claimable until they first log in — tell them to log in
  the same day.) Future apps don't inherit the issue: the homework hub creates
  accounts with username+password up front, no pick-your-name list. She also
  ruled the cheat-detection panel (round completion times) is sufficient — no
  further anti-cheat wanted.
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

- 2026-07-19: Avatar categories are DISPLAY-ONLY (grouped headings in the
  picker) — the server still validates bare ids; the two lists that must
  stay in sync are CONFIG.AVATARS (js/config.js) and `allowed` in
  cgg_set_profile (supabase/phase14.sql now, not phase12). NOTE: the
  circle-geometry-game Supabase project IS on the MCP account — phase14
  was fetched-from-live (pg_get_functiondef), applied and verified via
  MCP, no manual SQL-editor step needed.
- 2026-07-19: Pi the mascot is PURE AMUSEMENT — no gameplay, no XP, no
  sounds of his own, one purposeful cameo (thumbs-up on a passed graded
  round). Built from Megan's supplied sheets (never redraw him). Animated
  with setInterval, NOT rAF — the preview pane never fires rAF and its
  page is visibility:hidden so intervals throttle there too; he looks
  frozen in the pane and that is NOT a bug. 6-7 fps per her review
  ("over before I can see it" at 8-12).
- 2026-07-19: Sound replacement went through a pick-from-lab flow
  (sound-lab.html, kept in repo): correct = "coin sparkle" (B5→E6 quiet
  squares), wrong = "two soft steps down" (E4→C4 sines); celebrate and
  tick kept. Everything stays synthesized — no audio files in this PWA.
- 2026-07-19: sw.js deliberately caches NOTHING in this app (network-
  always so pushes deploy instantly) — there is no cache version to bump
  here, unlike her other quest apps.
- 2026-07-19 (later): Pi recoloured purple → the app's PINK (--s1
  #e64980) after seeing him live — baked into the slicer (TINT in
  slice_pi.py; hue-window so the red mouths don't ride along and go
  yellow), source sheets stay purple. Also shrunk 96→72px home / 72→56px
  cameo ("Clawd works because he's so smol"). Recolour = rerun the
  slicer, never Canva.

## Pending on Megan
- Eyeball the new features on live (hard-refresh; admin page Ctrl+F5): the
  Customize link on the home screen, the nickname column + "reset nickname"
  button on the dashboard, the 🔊/🔇 mute toggle in the header, and the
  "⚠️ Worth a look" cheat-detection panel on the dashboard. Everything is
  deployed and verified; nothing blocks play.
- 2026-07-19 batch: on your phone, hard-refresh the live app and eyeball
  Pi on the home screen (tap him for a trick), open Customize to see the
  54-avatar grouped picker, and play any round to hear the new
  correct/wrong sounds + Pi's thumbs-up on the results screen. All
  deployed + verified live (HTTP 200 on the new assets); nothing blocks.

## Next up
- Screenshot the crown/rally from the admin dashboard for the class WhatsApp
  group (switch the game's language toggle first if the Afrikaans version is
  wanted). Champion reveal fires Mon 20 Jul.
- Watch how the class takes to nicknames in week 1 of term; the remaining
  big-corp tricks from the brainstorm (variable "double XP" rewards, endowed
  progress on badge sets, limited-time events) are noted in chat but NOT
  specced — decide after seeing how these four land.
