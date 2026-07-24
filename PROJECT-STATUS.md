# Project status — updated 2026-07-24

## Where we are
SHIPPED 2026-07-24: the Daily Challenge overhaul + the diagram-label fix are
COMMITTED AND PUSHED (GitHub Pages, no cache bump — sw.js caches nothing). Megan
reviewed the diagrams; the angle-label distance is fixed and five label
collisions in the apex-at-O riders were cleared (see 2026-07-24 decision).

NEW 2026-07-23: THE DAILY CHALLENGE IS NOW A HARD, EXAM-STYLE 10-QUESTION SET.
It was 5 tap-the-option questions drawn from rounds the learner had already
passed (pure recall). It is now 10 typed-answer riders per day — 5 multi-step
+ 5 single-step — served to everyone (the whole class has finished all 43
rounds). Two NEW question types in js/questions.js:
  • "num"         — type the angle only (multi-step). After answering, the FULL
                    worked chain renders (every statement + its reason), and the
                    hint ladder walks it one rung at a time, never revealing the
                    final answer line.
  • "num-reason"  — type the angle AND pick the reason, marked SPLIT (½ + ½).
Bank: js/rounds/daily-riders.js — 31 questions (13 multi, 18 single) built from
Megan's Gr11 Core Mathematics: Geometry worksheet plus worksheet-style items to
cover every reason. ALL 31 diagrams verified to scale (66 angles, 0 mismatches)
via the new verify-daily.html, which doubles as a click-through preview: it
renders each question with its diagram, answer and reason chain, and lets you
ANSWER one live. Engine gained optional equal-tick / parallel-arrow chord marks
({a,b,mk:"t1"|"p1"}) — purely decorative, no angle is affected.
NOT YET COMMITTED — awaiting Megan's review of verify-daily.html.


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
NEW 2026-07-20: ATTEMPT TRAJECTORY + LIVE LEARNER TIMELINE (phase15.sql,
APPLIED to live via MCP + verified). The dashboard kept only a per-round
SUMMARY (best score / attempts / passed), which made a learner climbing
(40→60→65→100) and a learner stuck on one wrong idea (65→65→65) render
identically. Now: click any learner's name → a panel with EVERY attempt,
self-refreshing every 15s; and "Needs a hand" gained an "Every try"
column with a trend arrow. Verified live end-to-end (panel updated itself
in 13s with no reload; deploy confirmed serving the new code).

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

- 2026-07-20 (THE RULE THIS DAY BOUGHT — worth keeping for next term):
  a stuck learner's ATTEMPT TRAJECTORY, not their best score, says what the
  teacher should do. Rising (40→60→65) = productive struggle; leave them
  alone, because interrupting takes the win off them. Flat or falling
  (65→65→65) = the attempts have stopped teaching and they're rehearsing
  the error; that's when to step in. This came out of a real case: a
  learner sat on 65% for four tries at rline, was told only to slow down
  and read, and cleared it at 100% ~18 minutes later unaided — then went
  from round 5 to round 13 in half an hour. Every scaffold that had been
  proposed (worked examples, a booked call, dropping the pass mark) would
  have landed inside those 18 minutes and stolen it. The dashboard now
  shows the arrows so the call can be made from data, not vibes.
- 2026-07-20 (analytics lesson): do NOT read the Daily Challenge as
  evidence of a learner's reasoning ability. daily.js draws from
  `passedQuestionPool` — questions from rounds they have ALREADY PASSED —
  so an early learner's dailies are pure recall from r1 (parts of a
  circle). A strong daily average next to a failing round is not a
  contradiction and is not proof of anxiety-over-ability. Only the
  bonus bank (daily-extra.js) carries real theorem riders, and it
  unlocks only after every round is passed.
- 2026-07-20: the timeline panel is DELIBERATELY generic (click any
  learner) rather than pinned to the one learner it was built for —
  this repo is public, so no learner name goes in the source, ever
  (the 2026-07-13 rule). phase15's RPC takes a student id or null for
  the whole class; the class-wide call is what feeds the arrows.
- 2026-07-20 (bug worth remembering): graded rounds in the timeline must
  merge across the WHOLE history, not just consecutive events. Grouping
  only consecutive runs split a learner's chain whenever they played the
  Daily Challenge between two attempts — which is exactly what the real
  case did — fragmenting the climb the panel exists to show. Also: don't
  use "→" as both the chain separator and the plateau arrow (a flat
  learner read as "65% → 65% →", like a missing value).

- 2026-07-23: the Daily is now HARD FOR EVERYONE and typed, not tapped. Two
  rulings behind that: (a) the engine's old "no free-text anywhere, every answer
  is a tap" rule is deliberately reversed for the Daily — typing the number is
  the whole point of exam realism (you can't reverse-engineer from four options);
  (b) multi-step riders ask ONLY for the final angle, no reason picking, because
  a 3-reason chain would be punishing to grade — but the full chain is still
  SHOWN afterwards, as teaching rather than as marks. Megan's call, 2026-07-23.
- 2026-07-23: split marking on single-step questions = 1 mark angle + 1 mark
  reason (both → full, one → ½). The learner sees "Angle ✓ / Reason ✗" and a
  fractional daily score (8.5/10). The SERVER still receives the count of
  fully-correct questions, so XP / perfect-week economics are untouched.
- 2026-07-23 (analytics shift — NB when reading the dashboard): the Daily is no
  longer pure recall of passed rounds, so a low daily score is now real signal
  about reasoning, not just retrieval. This retires the 2026-07-20 note that said
  daily averages could not be read as evidence of ability.
- 2026-07-23 (bug found, pre-existing): verify.html had been SILENTLY DEAD. It
  did `ROUNDS.forEach(r => r.questions.forEach(...))`, but 19 of the 43 rounds are
  cutscene/discovery rounds carrying `panels` and no `questions` array, so it threw
  on the very first one and the summary sat on "Running…" forever. Guarded; the
  full-app check now runs and passes (361 diagrams, 698 angles, 0 mismatches).
  Worth remembering: a verify page that never prints a FAIL is not the same as a
  verify page that passes — check it actually reports a count.
- 2026-07-23 (deferred, NOT built): co-interior-angles and four of the figures
  Megan picked (1B #17, #18, #20 and 1C #9). Co-int needs two parallel lines with
  an obtuse angle between two rays — but every point in this engine lives on the
  circle and the renderer only ever draws the ≤180° angle between two legs, so a
  150°/30° co-interior pair can't be drawn honestly here. 1B #20 and 1C #9 need a
  secant from an external point, which the engine has no primitive for (`ext` is
  tangent–tangent only). These need a small non-circle diagram mode; the theorems
  themselves are all covered by other questions in the bank.

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

- 2026-07-20: Ctrl+F5 the admin page and click a learner's name to see the
  new timeline panel (it self-refreshes every 15s while open), plus the new
  "Every try" column on "Needs a hand". Deployed + verified live; nothing
  blocks play and phase15 is already applied — no SQL waiting for you.

- 2026-07-24: Daily Challenge overhaul + label fix are SHIPPED (committed + pushed).
  Eyeball on live when convenient: open the Daily Challenge and play a rider or two,
  and spot-check the five fixed diagrams (is78/is108/is110/round92/round150) read
  cleanly on your phone. Nothing blocks play; no SQL was involved.

## Next up
- **Homework-hub link is ON PAUSE (Megan's call, 2026-07-24).** The CQ → Maths
  Homework Quest funnel link is NOT built (confirmed: no reference anywhere in the
  app code). She'll do it later — don't build it until she says.

<!-- record of the shipped label fix (kept for the decision trail) -->
- 2026-07-24 (DONE — the label fix): every angle in daily-riders.js now carries an
  explicit `o.r` (33–46 px). Verified by measuring `hypot(label − vertex)` in the
  browser (all 64 labels land 33–46 px from their vertex; the bare fallback had let
  narrow wedges drift to 64–86). A whole-bank pairwise scan then caught FIVE label
  collisions in the "apex angle at O + a second angle" riders (is78, is108, is110,
  round92, round150) — the two labels fell on the line between the two vertices and
  overprinted. Fix: pull both labels in to hug their vertices; for round92/round150
  the two bisectors were exactly collinear, so P was also moved to another point on
  the SAME minor arc (∠APB is constant along the arc, so the value and the to-scale
  check are unchanged — only the picture reads cleaner). Method worth reusing: the
  pairwise-gap scan over computeGeometry label coords is how you find these; the eye
  misses the ones on later pages.
- Still deferred (not built, theorems covered elsewhere): co-interior angles and
  worksheet figures 1B #17, #18, #20, 1C #9 — they need a non-circle diagram mode
  / an external-secant primitive. Decide whether they're worth building.
- Term starts Tue 21 Jul: the holiday homework was PRE-teaching (this
  content gets taught in class from day 1), so read the round data as
  "who has met this yet", not "who is behind".
- Watch the "Needs a hand" arrows in week 1 — the panel now distinguishes
  climbing from stuck, so it should be actionable rather than just a list
  of people who tried twice. If a learner shows flat/falling, that's the
  one to talk to.
- Screenshot the crown/rally from the admin dashboard for the class WhatsApp
  group (switch the game's language toggle first if the Afrikaans version is
  wanted). Champion reveal fires Mon 20 Jul.
- Watch how the class takes to nicknames in week 1 of term; the remaining
  big-corp tricks from the brainstorm (variable "double XP" rewards, endowed
  progress on badge sets, limited-time events) are noted in chat but NOT
  specced — decide after seeing how these four land.
