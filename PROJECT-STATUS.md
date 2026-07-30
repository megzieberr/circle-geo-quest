# Project status — updated 2026-07-30

## Where we are
IN PROGRESS 2026-07-30 on branch `claude/investigation-station-circle-geo-dd1g0a`
(PR #4): INVESTIGATION STATION 🚂 — six graded "stations" that drill the
*investigation* skill (conjecture, counterexample, error-spotting, converses,
explaining) rather than more rider practice. Two things make it unlike every
other round: it PAYS XP (flat 50 per station, 300 for all six), and it accepts
TYPED answers, marked by a Supabase edge function calling Claude Haiku.

**CHUNK A IS DONE (2026-07-30): all six stations now exist.** Stations 1
"Measure & Notice", 3 "Break It", 5 "Turn It Around" and 6 "Explain It" were
built this session and join the two that were already there. The play order is
rounds 44-49 (`inv1`…`inv6`), all in group `g6`. Nine typed panels in total —
`s1p4 s2p4 s2p5 s3p4 s4p4 s4p5 s5p4 s6p3 s6p4` — and all nine memo rows are
LIVE (the five new ones applied via MCP `execute_sql` and verified; the app's
panelIds and the table's panel_ids match exactly, no orphans either way).
`verify.html` is green on the widened check: **406 diagrams, 749 angles, 0
mismatches** (up from 393/728 — the 13 new still diagrams and 21 new angles).
Walked all four new stations offline (`?local=1`) in both languages: every panel
mounts and advances, the new word chips render (EN *diameter/radius/tangent/arc*,
AF *middellyn/radius/raaklyn/boog*), and the never-stuck ladder degrades exactly
as designed when the checker is unreachable — hint at 3 misses, `memoDisplay` at
5, Continue appears, no error ever shown. **NOT YET COMMITTED**, and nothing is
on `main`; the live site is unchanged. Chunk B (the train) has NOT been started.

**MARKING TESTED AND CLEAN (2026-07-30): 22/22 on the five new panels.** Run
against the live edge function with a throwaway learner (`ZZ Checker Toets`,
created, used, and deleted — 0 progress rows, 0 xp_events, 0 events, and its 10
checker_calls cascaded away with it; 21 real students untouched). 9 accepted
answers accepted, 12 wrong answers rejected, 1 prompt-injection attempt refused
(`unclear`, and it answered the maths question instead of obeying). The three
probes that mattered most all passed:
  · `s1p4` accepted an Afrikaans answer whose ONLY reason was "a protractor is
    never exact" — the accept-any-one-of-three rule holds.
  · `s3p4` accepted an Afrikaans answer that gave only the first half of the
    question (every case → one failure breaks it) and never touched the "why a
    thousand examples still fail" half, which the scheme says not to require.
  · `s6p3` accepted the Afrikaans ISOSCELES-RADII proof, not just the
    centre-double route — the accept-either-route rule holds. This is the one
    that would have quietly failed a correct learner.
Every rejection came back `partly` or `not_yet` with a nudge that points at the
gap without leaking the answer ("Your testing is strong — but what does that
testing still not tell us?"). Response times 1.6-5.8s, well inside the 12s
client timeout.

**The `check-answer` edge function is DEPLOYED and WORKING (2026-07-30).** It
did not need the dashboard: the Supabase MCP connection can deploy edge
functions directly, so "Megan must paste it into the dashboard" was never true
— that item is dead, and `send-push` could have been deployed the same way.
Deployed with `verify_jwt: false`, matching send-push, because the app sends the
new-format publishable key (`sb_publishable_…`), which is not a JWT and would be
rejected by the gateway; the function does its own auth via `_cgg_auth`.
Now at version 3 — see the marking-quality decision below for why.
Also done: the reason bank now matches IEB Appendix G in BOTH languages
(Megan supplied the English + Afrikaans SAG PDFs), and 34 places in round copy
that QUOTE a reason as the string to write were corrected to match.


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
- 2026-07-30 (CHUNK A — where the four new stations DEPART from the plan's §4, and
  why. All four are one-figure-per-station calls, which is the rule Chunk A was
  handed; where the plan's content needed a second unrelated figure, the content
  moved rather than the rule.)
  1. **Station 1 panel 4 asks about the CENTRE-DOUBLE table, not a semicircle one.**
     The plan's wording was *"your table reads 89°, 91°, 90°, 90° — have you proved
     the angle is always 90°?"*, which is a semicircle question sitting at the end
     of a centre-double station. Rewritten to stay on the station's own figure:
     three rows exactly double, one row 2° out (a protractor reading), one row 42°
     out (impossible). The teaching point is unchanged and the 2° row now does
     double duty — it is the counterexample question in panel 3 AND the "even the
     measured cases were only read to the nearest degree" half of panel 4.
  2. **Station 5's two converse-verdict panels both live in the cyclic-quad family**,
     so the station keeps one figure. The FALSE converse is the exterior-angle one
     with the word "opposite" dropped — counterexample: any slanted parallelogram,
     where the exterior angle at B equals the interior angle at A (co-interior) and
     the figure is not cyclic. The TRUE-BUT-USELESS one is "if the four vertices lie
     on one circle, the quadrilateral is cyclic" — true, and the definition read
     backwards, so it tests nothing. Panel 5 then gives ∠A = 95° and ∠C = 85° so
     exactly ONE of the four converse reasons fits what the learner was GIVEN;
     asking "which converse proves a quad is cyclic" with no givens has two right
     answers (opp ∠s and ext ∠), which is why the plan's phrasing was tightened.
  3. **Station 6 panel 1 carries no diagram, and its four write-ups are about the
     CENTRE-DOUBLE theorem, not the semicircle.** Judging four explanations of the
     semicircle theorem two panels before `s6p3` asks the learner to write that same
     explanation would hand over the answer. `s6p4` carries no diagram either — it
     asks for a write-up, not a reading of a figure.
  4. `discover-centre-circ.js` now EXPORTS its `MODEL()` so Station 1 reuses the
     exact centre-double interactive instead of rebuilding it — same reasoning as
     `discover-same-segment.js` and Station 2. Four bare-noun word chips were added
     to `WORDS` (`wDiameter`/`wRadius`/`wTangent`/`wArc`) because the existing
     `tangent` chip carries its article ("a tangent"), which reads as "is the a
     tangent" in a mid-sentence slot.
- 2026-07-30 (the mark schemes for the five new panels — read with the three checker
  decisions below, which they were written against):
  · **`s6p3` accepts EITHER of two complete routes** to why the angle in a
    semicircle is 90°: the centre-double route (diameter → 180° at the centre →
    half) or the isosceles-radii route (OA = OC = OB → base angles x and y →
    2x + 2y = 180). Both are correct proofs. Requiring the first would mark down a
    learner who gives the second, which is precisely the failure the memo-vs-mark-
    scheme decision exists to prevent. The scheme says in those words: never ask
    for the other route as well.
  · **`s1p4` and `s3p4` each accept ONE reason, not a set.** `s1p4` takes any of
    (a) only the measured cases were checked, (b) measurement is not exact, (c) a
    proof is needed — all three are sound answers to "have you proved it?", so
    demanding the (a) argument specifically would punish a learner who gave (b).
    `s3p4` requires the "every case / one failure breaks it" logic and explicitly
    does NOT require the second half of the question (why a thousand examples still
    fail), because the panel's question can be fully answered without it.
  · **`s6p4` is deliberately LOOSER about the conjecture's wording than `s2p4`.**
    It asks for the three moves of a closing paragraph (state it · say it was
    tested · say a proof is still needed), so its first line takes "equal angles on
    the same chord or arc" and does not require the location condition. Precision
    of the conjecture is what `s2p4` marks; re-marking it here would mean five
    requirements on a paragraph the panel asked three things of.
  · **A memo is a prompt, so it cannot be eyeball-checked — fire real answers at it.**
    `tools/probe-checker.mjs` (new, 2026-07-30) holds 22 scored probes plus the three
    unscored s2p4 rulings, and reads its login from `CQ_NAME` / `CQ_PASS` so no
    credentials sit in a public repo. Run it after ANY edit to a `must_have`. The
    2026-07-30 route: insert one throwaway row into `students`, run batch 1, clear
    that learner's `checker_calls` (the cap is 20/hour), run batch 2, delete the row —
    the delete cascades the calls away, and a throwaway learner never plays a round
    so it writes no progress and never reaches the leaderboard.
  · Sections 6-9 of `phase16.sql` use **dollar-quoted `$m$…$m$` literals** with real
    newlines instead of `'…'` with `chr(10)`. The accept-lists carry a lot of
    Afrikaans and every `'n` would otherwise need hand-doubling — one missed pair
    silently changes a memo's meaning, and a memo cannot be eyeball-checked once it
    is inside a prompt.
- 2026-07-30 (MEGAN'S DESIGN RULING — the Investigation Station becomes a BRANCH LINE,
  not the next rung of the main ladder). Her four calls, all made after seeing Station 2:
  1. **The train gets a full-width tappable strip** on the home screen, directly above
     the badge panel, headed "Investigation Station". **Pi stays where he is.** She had
     floated putting the train in Pi's corner or removing him; the art decided it —
     the PNG is a locomotive on a full length of track with three trucks, roughly 2:1,
     so at Pi's 72px square it is unreadable. Full width also lets the painted track
     run into the station map when tapped. Crop the transparent padding in CSS; the
     file itself is her art and is never edited (see [[prefers-own-art-over-ai-drawn]]).
     The art now lives at `assets/investigation-station-train.png` — moved out of the
     repo root and renamed only to drop the space from "Investigation Station.png",
     because a space in an asset path has to be URL-encoded in every reference. The
     image bytes are untouched.
  2. **Build Stations 1, 3, 5, 6 BEFORE the map.** She chose a complete six-stop line
     over shipping a map with four "coming soon" halts. Nothing half-built in front of
     learners.
  3. **The train is the ONLY door in.** Once the map exists, the stations come off the
     main round map — the main line goes back to being the 43 rounds. No round appears
     in two places.
  4. **`g6` comes OFF the rank ladder.** Adding it had quietly demoted the game's crown:
     `renderRankLadder` (js/game.js ~line 200) takes the rank as
     `earned[earned.length - 1]`, so a learner who finished everything read
     "YOUR RANK 🚂 Line Inspector — 6/6 badges" instead of 🏆 Circle Grand Master.
     Finishing the 43 rounds must still end on Circle Grand Master, and the counter
     goes back to 5/5. Keep the g6 badge internally so the unlock celebration still
     fires on all six stations; just exclude it from the ladder and the counter, and
     show station progress on the train strip instead ("3 of 6 stations visited").
- 2026-07-30 (THE FIND OF THE CHECKER SESSION — do not lose this): the memo and the
  mark scheme are DIFFERENT DOCUMENTS, and the prompt has to say so. The first
  deployed prompt called the memo "the mathematical content that must be present",
  so the model marked against the whole memo. Memos are written as full teaching
  text for a learner who has missed five times, so they cover more ground than the
  panel asked for — and two genuinely CORRECT answers came back `partly`, asked to
  supply steps the question never requested. Fixed by demoting the memo to
  "BACKGROUND ONLY … never mark an answer down for leaving out something in the
  memo but not in the must-have list", and promoting must_have to "THIS IS THE MARK
  SCHEME, and the only thing you mark against". Rule for every future station:
  **must_have is a mark scheme — the smallest set of ideas that earns the tick —
  not a summary of the memo.** Anything listed there that the panel did not
  actually ask for will mark real learners down.
- 2026-07-30 (the same bug in Afrikaans): "naming a theorem" has to be defined, or
  the model demands a formal title on top of a correct description. A learner who
  wrote "dit is 'n hoek in 'n halwe sirkel" was told "what is that rule called?" —
  in Afrikaans the everyday wording IS the accepted wording. The prompt now says so
  explicitly. After both fixes: 10/10 correct answers accepted (6 Afrikaans/mixed),
  10/10 wrong answers rejected, both prompt-injection attempts refused.
- 2026-07-30 (memo wording that works): give the model an ACCEPT-LIST, not an
  argument. s2p4's location condition was first written as prose explaining why
  "on the same side of the chord" is not enough; the model over-weighted the
  emphasis and started rejecting "in dieselfde segment" too. Rewritten as an
  explicit list of equivalent accepted phrases in both languages, plus the one
  phrase that does NOT count — 15/15 on the next run. Mechanical rules beat
  reasoning for a small model.
- 2026-07-30: **s2p4 deliberately requires the LOCATION condition.** "Equal + same
  chord + on the same side of it" is rejected (`partly`, with a nudge), because the
  angle at the centre is also on the same side and is double — which is precisely
  the error panels 2 and 3 of that station just taught. "In the same segment" or
  "at the circumference" alone is accepted, since a segment already means at the
  circumference. This is a strictness call, not a technical one: if it proves too
  harsh with real learners, loosen the third `must_have` line of `s2p4` — one UPDATE,
  no redeploy.
- 2026-07-30: the client checker timeout went 8s → 12s (`js/checker.js`). Measured
  live: 1.8-4s warm, 6.7s cold start, one 8.9s outlier — so the planned 8s would
  have silently thrown away real answers and dropped the learner onto static hints.
- 2026-07-30 (correction to the plan, §1.2): the plan said anti-farming is already
  handled because "api.js submitRound awards `wasPassed ? 0 : xp`" and asked to
  verify it on the Supabase path too. **It does not hold there.** That line is in
  `LocalBackend` only; `js/supabase.js` passes `p_xp` straight through and the live
  `cgg_submit_round` RPC does `total_xp = total_xp + excluded.total_xp`
  unconditionally, plus an `xp_events` row every time. Replays are safe anyway
  because the CLIENT never sends the XP: `game.js` gates every accrual behind
  `if (!alreadyPassed)`, and `discover.js`/`investigate.js` skip the submit entirely
  when the round is already passed. Verified: replaying a passed station returns
  `xpAwarded: 0`, `alreadyPassed: true`, `total_xp` unchanged at 50. So the
  protection is real but lives one layer up from where the plan said — consistent
  with the 2026-07-18 ruling that anti-cheat here is detection, not prevention.
- 2026-07-30: `verify.html` now checks PANEL diagrams too, not just `questions`.
  It had only ever walked graded rounds, so every still diagram in the Investigation
  Station and in eleven discovery rounds was shipping unchecked. Coverage went
  361 → 393 diagrams and 698 → 728 angles, still 0 mismatches — nothing was
  actually wrong, but nothing was actually being checked either. Draggable panels
  stay exempt on purpose: they compute angles from live coordinates every frame,
  so there is no declared value that could disagree with the picture.
- 2026-07-30: Station 2 reuses `discover-same-segment.js`'s `MODEL()` by importing
  it (it is now exported) rather than rebuilding the figure, so the discovery round
  and the investigation station can never drift apart. It is a factory, so each
  caller still gets its own object.
- 2026-07-30: the reason bank now follows IEB Appendix G in BOTH languages. The IEB
  publishes the appendix in Afrikaans too (WISKUNDE SAGs pp.29-32), so the Afrikaans
  no longer falls back to the DBE list. Settles the open congruency question: the
  Afrikaans appendix translates the letters (S = sy, H = hoek), so SAS → **SHS** and
  AAS → **HHS**; SSS is unchanged. Also `∠ in halwe sirkel` (∠ singular, and
  "halfsirkel" not "semi sirkel"), `raaklyn koord stelling` unhyphenated,
  `Midpt∠ = 2 × Omtreks∠`, and `midpt` not `mdpt`.
- 2026-07-30 (the find worth keeping): a reason audit that only edits the REASONS bank
  is half an audit. 34 places in round copy QUOTE a reason as the string to write
  ("Rede: <i>lyn vanuit mdpt ⊥ op koord</i>", "die rede is 'binne-∠e van Δ'") and were
  still teaching pre-Appendix-G wording — which is exactly what the audit exists to
  prevent, since that is what a learner copies into the exam. Rule going forward:
  flowing prose that merely NAMES a theorem keeps its natural language in both
  languages ("the tan-chord theorem" / "die raaklyn-koord-stelling"); only a reason
  presented as the string to write follows the appendix. `data-tanchord.js` is
  deliberately never touched — its strings are LEGACY *keys*.
- 2026-07-30: Investigation Station XP is FLAT per station (50), not per panel and not
  scaled by attempts. The point of an investigation is to think it through, not to
  already know the answer — a learner who fights through five attempts per panel has
  investigated MORE than one who breezes it, and should not be paid less. Struggle is
  the product. Submitted with `score: 1` (completing IS passing — flat XP plus an 80%
  badge threshold would mean full XP and no badge), but `total`/`correct` still carry
  the real first-try numbers so the admin trajectory panel keeps working.
- 2026-07-30: the checker is a SCAFFOLDER, not a judge. Every failure path — bad key,
  timeout, cost cap, malformed JSON — degrades to the panel's static hint chain with
  no error shown, and the 3-wrong-hint / 5-wrong-reveal ladder is untouched. That
  ladder is what makes an occasionally-wrong text checker safe: the worst a misgrade
  can cost is one extra attempt, never a blocked learner. Plus an "I think my answer
  was right" link on every typed panel that always advances and logs for review.
- 2026-07-30 (bug caught in review, worth remembering): the plan's cost cap was a
  COUNT-then-INSERT, which does not actually close the race — under READ COMMITTED
  two concurrent taps both read 19 and both bill, because a count takes no lock.
  Fixed with a per-learner `pg_advisory_xact_lock`. Same review pass caught that
  `revoke ... from anon, authenticated` leaves a function callable, because functions
  are granted to PUBLIC by default — phase15's convention includes `public` and this
  one now does too.
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
- 💻 2 min **[whenever]**: ask whoever owns the school's AI-use / POPIA policy whether
  typed answers may leave the school's systems (only the answer text is sent).
- 👀 5 min **[whenever]**: decide whether `s2p4` is too strict — Claude runs
  `node tools/probe-checker.mjs 3` and you read the three verdicts.

**Do NOT push — Megan's call, 2026-07-30.** Nothing goes to origin until the train
is finished, so no learner sees a half-built station. Explained under "Next up".

(DONE 2026-07-30, the old blocking item: deploying `check-answer`. It never needed
the dashboard — the Supabase MCP deploys edge functions directly. Now live at
version 3 and tested end to end.)

(Done 2026-07-30: Anthropic API key created and pasted as the Supabase secret
`ANTHROPIC_API_KEY`; `phase16.sql` APPLIED to live via MCP and verified — RLS on with
0 policies, anon/authenticated denied on both tables AND both functions, both memos
seeded, cost cap tested live at cap=2 (2 claims allowed, 3rd refused with no row
written) and the test rows deleted. Security advisors: 0 errors; the only notes on the
new tables are the INFO-level "RLS enabled, no policy", which is the intended deny-all.)

(2026-07-25 amnesty still stands for everything before this: the four "eyeball on
live" batches from 19/20/24 Jul were killed on Megan's call — the kids had been
playing on those builds for days, so real use did the eyeballing.)

## Next up
**Megan is doing this over SEVERAL SESSIONS (her call, 2026-07-30) — no rush, and no
need to finish a chunk in one sitting.** Two chunks remain, in this order:

- **CHUNK A — Stations 1, 3, 5, 6. ✅ DONE 2026-07-30.** All six stations exist,
  memo rows are live, verify is green, both languages walked offline, marking probed
  22/22 against the live checker, and Megan has played all six in teacher preview
  ("they look very cute, had me thinking as well"). Committed at `bbafc96`, not
  pushed by her instruction. No loose ends.
- **CHUNK B — the train.** Home strip + the six-stop map screen + the four design
  rulings above (rank ladder, badge counter, train-only entry). Do NOT start this
  until all six stations exist; that was the whole point of ruling 2.

Chunk A was shown and approved on 2026-07-30 (she played all six in teacher
preview: "they look very cute, had me thinking as well"), so Chunk B is cleared
to start whenever she says.

**THE PUSH IS DEFERRED UNTIL CHUNK B IS DONE (her call, 2026-07-30).** The branch
sits 3 commits ahead of origin (`1312c97`, `bbafc96`, `6ebdf56`) and stays there.
Her reason: nothing visible to learners until the Investigation Station is
finished. Two things follow from that:
  · those local commits are the ONLY copy of Chunk A — don't let it ride for weeks.
  · when Chunk B lands, `/ship` clears all of it in one go.

**Teacher preview CANNOT test the marking, and that is not a bug.** `?preview=1`
logs in as "Teacher Preview", which is not a row in `students`, so `_cgg_auth`
returns 401, `checkAnswer` returns null, and every typed panel falls through to
the static hint ladder. So playing in preview tells you nothing about whether a
mark scheme is fair — that is what `tools/probe-checker.mjs` is for, and it is why
the s2p4 strictness question could not be settled by her playing Station 2.
- **Deploying edge functions is a Claude step now, not a Megan step.** The Supabase
  MCP has `deploy_edge_function`, and this project is on that account. The CLI is
  still not installed and no longer needs to be. PUSH-SETUP.md Part 6 is stale advice
  for anyone with the MCP connected.
- **When writing a new station's memos, read the three checker decisions above first.**
  The mark-scheme-vs-memo distinction and the accept-list rule are what make typed
  marking work; getting them wrong marks correct learners down, quietly.
- **Purge date for `checker_calls.answer`** (learner-authored text). Suggest end of
  term; the DELETE is written in a comment at the top of phase16.sql.
- **Homework-hub link is ON PAUSE (Megan's call, 2026-07-24).** The CQ → Maths
  Homework Quest funnel link is NOT built (confirmed: no reference anywhere in the
  app code). She'll do it later — don't build it until she says.
- **Sequencing ruling (Megan, 2026-07-25): the kids stay on Circle Quest for now.**
  The order is: she play-tests all Blipwork levels + the store gets upgraded →
  THEN the class migrates CQ → Blipwork → only then does Blipwork's term
  setup happen. Nothing on the CQ side until she calls the migration.

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
