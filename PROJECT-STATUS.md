# Project status — updated 2026-08-11 (proof rounds: ALL TEN ROUNDS BUILT, P0–P9, awaiting her review)

## ☀️ 2026-08-11 — daytime resume after the wifi drop, ALL SIX SESSIONS DONE. Nothing pushed.

The overnight run stopped early (session 2, wifi). Her instruction in the
morning: pick up where it left off and run it during the day while she's at
school. That run is now COMPLETE: **all six build sessions done, every arc
foreman-reviewed with a full both-languages browser walk at 375px, and
committed LOCAL.** No push, no deploy, no migration, no edge-function change,
nothing that cost money. She reviews when she's home today; **she teaches
proofs from TOMORROW, 2026-08-12** — ship is a separate explicit step after
her yes.

**Where the app actually stands: P0 through P9, all ten proof rounds, are
built and wired into the map.** `MAIN_ROUNDS` now reads **53** (43 + 10).
Nobody has this yet outside her review — the group (`g7`) is `hidden: true`,
so a learner finishing the 43 rounds still reads 5/5 badges, same as before.

### ✅ Session 6 — P9 mixed finale + full-group checklist sweep · DONE
Commits `bd2e67e` (build) + `b232ca7` (foreman review fix: the T1 tool card
now says "RHS or SSS", because the variant-B claim genuinely runs on SSS).

- **P9 (`pr9`), 11 panels, all taps, figure-free throughout** (the claim is
  entirely in words, so a diagram would be decoration — same call P0 made).
  Six speed-match panels ("claim → tap the construction+engine that proves
  it") cover all four theorems, with T1 and T2 each getting a second, harder
  phrasing (T1's variant-B direction; T2's reflex angle, and "angles in the
  same segment" — which is T2's own construction in disguise, established in
  P4). All six panels share the same four options (the four theorems' own
  recap sentences, expanded into construction+engine phrases), so a wrong tap
  is always a real tool, just the wrong one. Three fresh legal/illegal
  lightning panels follow (binary Legal/Illegal tap, not a clone of the
  earlier four-option "which is legal" shape) — one classroom-catchphrase use,
  verbatim English in both languages, as her ruling requires. Opening and
  closing `note` panels bookend it; the closing one recaps all four tools
  side by side and ends on the actual takeaway line.
- **Full-group sweep, all items checked against the actual code, not assumed:**
  - Survey still pinned: `FINAL_QUEST_ROUND_ID = "r21"` unchanged; read
    `js/game.js`'s trigger (`round.id === FINAL_QUEST_ROUND_ID`) and
    `js/stations.js`'s stop-1 gate directly — both still read the pinned id.
  - `MAIN_ROUNDS.length` = **53** in node; grepped `js/` for stray `43`/`46`
    literals outside comments — every hit is an unrelated diagram-label
    radius or angle-degree value, not a round count.
  - All four checkers green: `verify-node` **476 diagrams / 867 angles / 0
    mismatches** (unchanged from before P9 — it added no diagrams, all
    figure-free); `audit-options` clean, no positional or length tell;
    `check-bilingual` clean; `check-table-summary` clean (pre-existing,
    unrelated to proof rounds).
  - Grepped pr0–pr9 for "Last one"/"Laaste een" (none present, nothing to
    strand), real-name leaks (none), "radii" inside AF prose (none — the
    only AF "radii" hits are the fixed IEB reason-tag values, which are
    supposed to stay "radii"), "reguit hoek" (none), and internal round-ids
    inside learner-facing `en:`/`af:` strings (none — `pr9` only appears in
    the `id:` field and header comments).
  - `git diff origin/main --stat -- supabase sw.js css` is empty — nothing
    under those paths touched across the whole six-session run.
- **Browser-walked by the foreman** (this supersedes the build session's own
  "no browser walk" note): all 11 panels of P9, BOTH languages, 375px — first
  pass banks 110 XP (11 × 10), a replay pays 55 (half), the catchphrase
  renders once in panel 8's note, the map counter reads /53, no horizontal
  overflow, 0 console errors. She should still play it herself before
  teaching from it — a foreman walk is not her eye.

### ✅ Sessions 2–5 — T1/T2/T3/T4 arcs (P1–P8) · DONE, each committed
Commits `a55d4dd`+`bb6b943` (T1), `5f6c0a7`+`823760b` (T2), `3439aaa`+`6b68ec3`
(T3), `74ab931`+`3c30a84` (T4) — build + review-fix pairs, per the foreman
pattern. Each arc: a discovery round teaching one construction, a transfer
round carrying it to a relabelled/rotated picture plus that theorem's
signature trap (T3's wrong-radii join, T4's wrong-join-after-diameter), an
error-spotting panel, and one legal-constructions panel with the catchphrase
used once per arc. Every arc was foreman-reviewed before the next session
started: hand-rechecked geometry, all four checkers re-run fresh, and a full
browser walk of both rounds in BOTH languages at 375px including label-overlap
measurements (two real placement bugs found and fixed that way — pr3's x/y
labels rendering beside O instead of P, and pr5's "a"/"2c" head-on collision).
The review-fix commit messages carry each arc's detail; the git log is the
record for that stretch.

### ✅ Session 1 — scaffolding + P0 "Why proofs?" · DONE, reviewed, accepted
Commits `834ac53` (the build) and `c7c8c07` (one review fix of mine).

- **New round kind `"proof"`, rendered by the EXISTING `renderInvestigate()`** —
  no new renderer, no new panel type, no new engine surface. Proof rounds get
  `predict` / `choice` / `note` panels and per-panel XP for free.
  `CONFIG.proofXpPerPanel: 10`, computed from `panels.length`, never hard-coded.
- **Round ids are `pr0` … `pr9`, group `g7`.** ⚠️ **`g7` is `hidden: true`**, the
  same as the Investigation Station's `g6` — so a learner who finished the 43
  rounds still reads **5/5 badges** and still ranks 🏆 Circle Grand Master
  instead of being silently demoted to 5/6 the moment this group exists.
  Verified in the browser: the badge counter still says 0/5. Easy to reverse if
  she'd rather proofs sat on the ladder.
- ⚠️ **The proof rounds sit in `ORDER` AFTER `r21` and BEFORE `inv1`, and that
  position is load-bearing.** `unlockedIds()` chains on ORDER position, and the
  Investigation Station is hidden (`stationsLive: false`), so nobody can pass
  `inv6` — putting the proof rounds after the stations would mean **P0 never
  unlocks for anyone.** Don't "tidy" them to the end of the array.
- **The survey is PINNED** (build-checklist item #1). New export
  `FINAL_QUEST_ROUND_ID = "r21"`; `js/game.js` fires the end-of-quest survey on
  that id instead of "the last entry in MAIN_ROUNDS", which had become a proof
  round the moment the group was appended. The class has already met the
  survey; it cannot re-fire on a proof round. `js/stations.js`'s stop-1 gate is
  pinned to the same id for the same reason.
- **P0 itself: five panels, all taps.** Conjecture vs theorem → why a hundred
  measured circles still prove nothing → what actually turns a conjecture into
  a theorem → **the wonder moment** (a `predict` guess on three bare dots: how
  many circles pass through all three?) → the reveal: exactly one, always,
  because two perpendicular bisectors meet at exactly one point. Every triangle
  they've ever drawn had a secret circle around it. The two figures reuse
  Investigation Station 3's already-verified coordinates rather than new ones.
- **Checked:** verify-node **427 diagrams / 774 angles / 0 mismatches**;
  audit-options, check-bilingual, check-table-summary all clean. Walked in the
  browser at phone width (375px) in **both languages**: all five panels render
  and advance, a wrong tap on the predict panel gets "Fair guess — …" with no
  scolding and no gating, results screen reads 🔗 "Nice reasoning!", no "Next
  station" button, no horizontal overflow, no console errors.
- **My one review fix (`c7c8c07`):** a choice panel shows its first nudge after
  one wrong tap, and that nudge said *"Use the diagram and the hint below."* P0
  is the first round here with choice panels that have **no diagram at all**, so
  a learner was being pointed at a picture that isn't on the screen. Now the
  wording depends on whether the panel actually has a figure. Every existing
  station and discovery panel has one, so nothing else changed.

### 🔍 One open finding, NOT fixed (pre-existing, app-wide — her call)
**Two-up mini diagrams are unreadable on a phone.** A panel using the
`diagrams: [...]` row renders each figure only ~147px wide at 375px, which puts
the point labels at about **6 effective pixels**. This is NOT new — it already
affects `converse-intro`, `discover-line-centre`, `invest03` and `round10b`, so
I deliberately did not change shared CSS unreviewed overnight on rounds she
teaches from tomorrow. One line fixes it, for her to approve:

```css
@media (max-width:420px){ .dp-mini{ flex-basis:100%; max-width:none; } }
```

Stacking makes each figure full width (~314px, labels back to normal size); the
only loss is seeing two figures at once, which at 6px nobody could read anyway.

### 📌 To pick up when she's home (she teaches proofs from TOMORROW, 2026-08-12)
1. **Her review first.** All ten proof rounds (P0–P9) are built, checked and
   committed LOCAL — nothing has shipped. Play through the group in the app
   tonight; tomorrow morning is the fix window before class.
2. Decide the mini-diagram CSS question above (one line, or leave it) — still
   open, still pre-existing, still her call. ⚠️ One NEW panel joins the
   affected list: pr4's recap gallery puts THREE minis in the row (147px
   each, labels 7–9px at phone width) — the same one-line fix would stack
   those full-width too.
3. Ship is a separate explicit step once she's happy: plain push, no
   migration, no edge-function change — this whole build never touched any of
   those.
4. After proofs: Dynamic Geometry (Ch 8) is planned in `DYNAMIC-GEO-PLAN.md`,
   build week of 2026-08-17.

## 📋 2026-08-10 — planning day (Fable session, nothing built)

The class finished circle geo; **proofs are next (she teaches them from
2026-08-12), then dynamic geometry (build week of 2026-08-17).** Two plan files
written in the repo root, both LOCAL and uncommitted — the build day commits
them:

- **PROOF-ROUNDS-PLAN.md** — new main-map group, 10 rounds: P0 "Why proofs?"
  intro (conjecture vs theorem; the every-triangle-is-cyclic wonder moment) +
  four guided-discovery theorem arcs (probe → construction draws → probe →
  recap; traps for the wrong-radii and wrong-join mistakes; legal-constructions
  thread with her assume-pun in English in BOTH languages) + mixed tool-match
  finale. Rulings: tap/drag only (no typing), options not point-taps, XP per
  panel Station-style, 9+intro rounds first then expand, never the nuked
  order-the-steps shape. Six numbered dispatch prompts inside.
- **DYNAMIC-GEO-PLAN.md** — six arcs for the chapter after proofs: moving
  points, the UNROLL arc-length animation (her idea), diagram-from-words,
  adding lines, folding (Tripo WebP intro + engine reflection interactive),
  and the trig bridge (max area + **the ambiguous case is a moving point** —
  also flagged for blipwork's trig rounds). Four new engine capabilities
  listed; daytime build, not overnight.

**⏰ Overnight build scheduled:** a one-time scheduled task
(`circle-quest-proof-rounds-overnight`) fires 2026-08-11 01:15 (after her
usage-limit reset) and runs the foreman pattern: six Sonnet build sessions,
foreman reviews each, commits LOCAL only, morning report in that session's
chat. She reviews in the morning; ship is a separate explicit step.

## 🔧 2026-08-07 — overnight audit fixes (all local, nothing shipped)

Off `FABLE-AUDIT-2026-08-06.md`. All four checkers re-run green afterwards:
**verify-node 424 diagrams / 772 angles / 0 mismatches**, audit-options,
check-bilingual, check-table-summary. App boots clean, no console errors.

- **🔴 The one that mattered — a logged-out learner's password could stay on the
  device.** `js/sync.js`'s offline retry queue stored `{name, password, …}` in
  localStorage and logout cleared only `cgg.session`, so on a shared computer the
  next person could read the previous learner's login in devtools.
  **Fixed at the root: the queue no longer stores a password at all.** Credentials
  come from the live session at flush time, and an entry only ever replays under
  the name that queued it (so one learner's queue can never flush under another's
  login either). `js/app.js` logout now takes a copy of the credentials, flushes
  best-effort, then goes to the login screen.
  ⚠️ **A one-time stripper runs on module load** and removes the password from any
  queue already sitting on a device — so phones that have one clean themselves the
  next time the app opens, instead of waiting for the queue to drain. Proven in the
  browser: a planted password vanished while the queued round survived to replay.
- **Removed the retired `override` branch** from `supabase/functions/check-answer/
  index.ts`. It answered `verdict: "got_it"` without marking anything. It was kept
  for "older cached clients", but this app's service worker caches no code at all,
  so there were none. ⚠️ **EDITED BUT NOT DEPLOYED** — the live edge function still
  has it until someone runs a deploy. Harmless (the client stopped calling it on
  2026-07-30 and `stationsLive` is false), but it is real drift: deploy with the
  next ship.
- **Deleted the expired station-reminder banner** (`js/announce.js` + its caller in
  `js/game.js`). It hard-expired 2026-08-03, so it was unreachable code carrying a
  list of learner ids. The pattern is in git if a dated one-off is wanted again.
- **README refreshed** — it described the app of three months ago ("the 12 rounds",
  migrations "phase2…phase6"). Now: 49 rounds = 43 main + 6 Investigation Station,
  the four round kinds, phase2…phase20, the check-answer function, the Station (and
  that it is hidden, not retired), Daily Challenge / streaks / paid replays / Fix
  Mistakes.

**Left open deliberately:** retried submits still carry no idempotency key, so a
committed-but-lost response can double-count (audit F4 — "watch for it in the admin
timeline", not a build item). Uncapped "stuck" inserts likewise.



## Where we are (INVESTIGATION STATION HIDDEN AGAIN — 2026-08-06 — pushed, deploy QUEUED behind a GitHub outage)

**The Investigation Station is hidden from learners again — her call.** This
year's class is finished with the line, the `ANTHROPIC_API_KEY` behind the
typed-panel marker has expired, and nobody is playing it anymore. **Hidden, not
retired** — she was explicit: next year's Grade 11s will need it back.

  · **One line changed:** `stationsLive: true → false` in `js/config.js`
    (commit `393d396`). The flag does everything: no train strip on the home
    screen, and the `stations`/`investigate` routes bounce back to the quest
    map, so a guessed or shared URL can't reach it either. `?stations=1` still
    opens the line for her own review.
  · **Nothing was deleted.** The six stations, every panel, the `panel_memos`
    rows in Supabase, the `check-answer` edge function, and the two learners'
    completed station progress all stay exactly as they are.
  · **To bring it back next year, TWO things:** flip the flag to `true`, AND
    put a valid `ANTHROPIC_API_KEY` back into the Supabase secrets — the
    expired key is why hiding costs nothing now (`check-answer` is the ONLY
    thing that uses it, and only station typed panels call `check-answer`).
    Both steps are also in the comment block above the flag in config.js.
  · **Verified locally** (`?local=1`, dev server): no train strip on home,
    both station routes render the quest map instead, `?stations=1` still
    opens the station map, 0 console errors. The 43 main rounds, Daily
    Challenge, Fix Mistakes and streak are all untouched.
  · ⚠️ **The deploy was NOT verified live this session.** The push landed on
    `main` fine, but GitHub itself was mid-outage (their status page: Pages
    "degraded performance", Actions "partial outage") and the Pages build sat
    in "building" for 15+ minutes. It will publish itself when GitHub
    recovers; the checked-off item is in Pending below. The gap is harmless —
    a learner who opens the station today just sees it as it was, and the
    typed panels degrade gently when the marker is unreachable (never-stuck
    ladder: hints still come, Continue still appears, no error shown).

**Also this session: the best possible news.** A learner's voice note: doing
circle geometry in class, she "could see everything in 2 minutes… I know how
to write my story now" — unprompted, naming the app as what got her there.
Three months of building, and the first spontaneous learner testimony says it
worked. Kept here because this file is also the project's memory of WHY.

## Where we are (INVESTIGATION-WORDS HANDOUT SHIPPED — 2026-08-04 — DONE, LIVE)

Added `handouts/investigation-words.html` (+ a `.pdf` copy) — a one-page A4
printable on the language of a circle geometry investigation, styled to match
the app's brand accents. Committed `817211f`, pushed, verified live (200 OK).
Nothing else touched this session; no migration, no `sw.js` change.

## Where we are (STATION DOUBLE-SAVE FIXED — 2026-08-02 — DONE, LIVE)

**Megan's read of the data was that the class was "bodging" the Investigation
Station. They weren't — the app was saving each play 2–8 times.** Commit
`4061af8`, pushed and verified live; phase20 applied to live the same session.

  · **The tell.** Every "extra attempt" on a station landed within 1–2 seconds
    of the one before it. Across the graded rounds: 0 of 228 replays did that.
    Across the stations: 9 of 9. A learner cannot redo an investigation in
    1.6s — those were duplicate submits, not replays.
  · **Fault 1 (client).** The last panel's Continue button stayed enabled
    right through `finish()` — an async submit (up to ~1.2s with sync.js
    retries) plus `refreshState()`, with nothing moving on screen. A tap that
    looked like it did nothing got repeated, and each repeat ran `finish()`
    again: another submit, another `xp_events` row, another `+1` on attempts.
    `game.js` has always set `next.disabled = true` before its await;
    `investigate.js` and `discover.js` never did. Both now take a one-tap
    guard — a `spent` flag AS WELL AS the disable, so a click already queued
    when the button dies is dropped too. Reuses the existing `loading` i18n
    key, so it stays bilingual.
  · **Fault 2 (server).** `cgg_submit_round` read `paid_replays`, decided the
    award, then wrote — nothing holding the row in between. Eight submits
    arriving together all read the counter before any had committed, so the
    first four each spent the same remaining replay: **80, 40, 40, 40, 40, 0,
    0, 0 against a cap of 2.** `supabase/phase20.sql` adds `for update` to
    that select. Body otherwise byte-identical to the LIVE
    `pg_get_functiondef` output, per the phase18 note.
  · **Neither fault bites alone.** Fault 1 without Fault 2 = inflated attempts
    but correct XP. Fault 2 without Fault 1 never fires, because real replays
    are minutes apart. The Station is the first thing here that both pays XP
    and had an un-disabled button, which is why it surfaced now.
  · **Where it came from:** `discover.js` has had the identical hole since
    June — 115 duplicate submits — but it sends `xpGained: 0` and skips the
    submit once already done, so it only ever inflated attempts. The Station
    was built from that file (its own comment says "Matches discover.js
    exactly") and made it pay. Fixed at the source so it can't be copied
    forward a third time.
  · **Verified in the app** (local mode, 900ms of injected latency to widen
    the in-flight window): six rapid taps on the final Continue now fire ONE
    submit, not six; the button disables and reads "Loading…" on the first
    tap. A genuine replay still fires exactly one and reaches results. On a
    discovery round, four rapid taps advance one panel, not four. Live deploy
    re-checked after push: both files serving the guard, 0 console errors.
  · ⚠️ **The inflated row was left alone, her ruling.** One learner's inv4
    still reads 8 attempts / 240 XP / 4 paid replays for one clean play.
    Fixing it would have taken 160 XP off a learner who did nothing wrong.
  · **Worth knowing for reading the admin panel:** duplicates hit
    `attempts + 1` too, so that inv4 row shows as badly stuck on a round that
    was passed first time. Only affects rows created before today's fix.
  · **The real finding wasn't the bug.** 9 of 21 learners have opened the
    Station at all; only 2 finished all six stops. But of the 12 who haven't,
    **five haven't opened the app AT ALL in over a week** (last active
    19–27 Jul) — they drifted off before the Station existed, so this isn't a
    verdict on the investigations. The ones who did turn up did real work:
    4–17 minutes per stop, one learner did all six in ~75 minutes.

## Where we are (REMINDER SENT, BUTTON RETIRED — 2026-08-01, later session — DONE, LIVE)

**The Investigation Station push reminder WENT OUT on 2026-08-01**, and the
dashboard button from the section below is GONE — her call ("I don't need that
button"), removed and pushed the same session.

  · **Why the button never worked:** the send-push Edge Function has no CORS
    handling — it was only ever called server-to-server (pg_cron), so it never
    answers the browser's preflight OPTIONS request. check-answer has the CORS
    block; send-push doesn't. A browser on megzieberr.github.io therefore can't
    call it at all: the preflight comes back 401, the fetch throws, and the
    button alerted "Couldn't send — nothing went out." with no error code.
    Last session's checks missed it because the 401 test ran directly against
    the function (no browser, no preflight) and the click-flow test ran in
    `?local=1` (no fetch). **Rule: a browser-called edge function needs the
    CORS block AND a from-the-browser test against the live function.**
  · **How the send actually happened: server-side, via SQL.** The cron secret
    lives inside `cron.job`'s command text on live. One `execute_sql` call
    extracted it IN SQL (never printed to chat) and called send-push's
    targeted mode once per non-excluded subscribed learner via
    `net.http_post`. Result, verified from `net._http_response`: **7 of 7
    learners sent, 1 device each, 0 failures, 0 stale subscriptions.**
    (9 learners have push on; 2 of the 4 excluded ids were among them.)
  · **The in-app banner stays** (`js/announce.js`, `maybeShowStationReminder`)
    — it reaches the 12 learners without push and expires itself after Sunday
    2026-08-03 00:00 SA. Nothing to clean up later.
  · **Removed from the client:** the 📣 button + `sendStationReminder()` +
    `STATION_REMINDER_EXCLUDE_IDS` (js/admin.js), and the now-unreferenced
    `adminBroadcastPush` in BOTH js/supabase.js and js/api.js (LocalBackend).
    The deployed send-push v4 keeps its broadcast branch — cron uses the same
    function daily, so it was left untouched; the branch is unreachable from
    any client and still admin-password-gated if anything ever calls it.
  · Verified in the browser (`?local=1`, own dev server on 5181): admin
    login + dashboard render clean, toolbar shows the remaining nine buttons,
    0 console errors.

## Where we are (INVESTIGATION STATION REMINDER — push button + banner — superseded, see section above)

**Her ask, later the same day:** remind the class to play the Investigation
Station before Sunday's class, skipping three learners (two already asked to
be left out, one hasn't started playing at all yet) plus her own test account.

  · **New "📣 Station reminder" button on the admin dashboard.** Click it and
    it shows the exact excluded names (looked up live from the loaded
    roster — never hardcoded, this is a public repo) before you confirm, then
    pushes to every OTHER subscribed device. **(2026-08-01: the button turned
    out to be unable to send at all — no CORS on send-push — and was removed;
    the reminder went out server-side instead. See the section above.)**
  · **In-app banner** (`js/announce.js`, `maybeShowStationReminder`) — fires
    once per learner on next login, same exclusions, and quietly stops
    showing after Sunday 2026-08-02 (hardcoded expiry) so it never lingers
    into a normal week.
  · **New send-push Edge Function mode: `broadcast`.** Previously EVERY call
    to send-push (including the already-built but never-wired-up
    single-learner "personal note" mode) required the cron secret, which the
    browser can never hold — so nothing on the dashboard could trigger a push
    at all before today. Broadcast mode is instead gated by the teacher's own
    admin password, checked server-side via the same `_cgg_admin_ok` helper
    every other admin RPC uses. Deployed as send-push v4; verified live that
    a missing/wrong admin password gets a clean 401 with no send and no
    crash, before ever risking a real send.
  · **Only 9 of 21 learners have push enabled at all** (checked live) — the
    banner is what actually reaches the other 12.
  · ⚠️ **No real learner names as literals anywhere in the diff.** First
    draft had names in code comments and in a hardcoded confirm-dialog
    string — caught before committing (this is a public repo). Fixed:
    comments reference "three excluded learners" generically, and the admin
    confirm dialog looks names up from `data.rows` (live, never committed)
    by id at click-time instead.
  · Verified in the browser: the button's confirm/alert flow works end to
    end in `?local=1` (graceful "0 targets" since local mode has no push
    server); the banner correctly shows for a non-excluded fake student id
    and correctly stays hidden for an excluded one, tested directly against
    the exported function. 0 console errors either way.

## Where we are (DASHBOARD CLEANUP — Hardest Questions retired, Station activity log added — SHIPPED, LIVE)

**Her ask, two small dashboard jobs:** retire "Hardest Questions" (she'd already
pulled what she needed from it) and add a separate panel showing who's played
the Investigation Station and when — it doesn't appear in the per-learner
progress bar (her call, fine as is), so it needed its own home.

  · **"Hardest Questions" is gone** — the panel, its `itemStats` fetch, and the
    now-dead `adminItemStats` client methods in `js/api.js` (LocalBackend) and
    `js/supabase.js` (SupabaseBackend). The underlying item-logging
    (`logItems`) was left untouched — the "Worth a look" cheat-detection panel
    depends on that same data (per-question counts) to catch a round "passed"
    with zero questions answered. The Supabase RPC `cgg_admin_item_stats`
    itself was left in place too (dropping it needs a migration, not required
    just to hide a client panel).
  · **New "🔬 Investigation Station activity" panel**, same spot on the
    dashboard. No migration needed — every station finish already writes a
    normal `xp_events` row (score is always 1; completing a station IS passing
    it), so the panel just reuses `cgg_admin_timeline` (phase15), filtered to
    the six station round ids, with its own high-limit fetch (2000, not the
    shared 400-row one) so a busy class doesn't crowd station rows out of
    view. Table: Learner · Station · When · XP · replay tag (first play per
    learner-per-station vs. a later replay, detected client-side by earliest
    timestamp).
  · Verified in the browser (`?local=1`): panel renders correctly empty
    (no plays yet) and, with synthetic test rows injected via console, renders
    correctly populated — sorted newest-first, right learner/station labels,
    replay tag landing on the second entry for the same learner+station. 0
    console errors. Test data cleared afterward.

**Pushed and live** — her call, same session.

## Where we are (INVESTIGATION STATION AUDIT — SHIPPED, LIVE, same day)

**A full fresh-eyes audit of inv1–inv6 ran after Chunk D went live** (her ask:
final pass for leftover bugs + a sentence/hint ambiguity sweep, extra weight on
the un-play-tested Chunk D panels). **Verdict: no functional bugs anywhere.**
All four checkers green; all 10 panel memos live and matching (s6p5 md5-verified
against phase16.sql); every Chunk D panel walked in the browser in BOTH
languages, 0 console errors; every new figure's geometry re-derived by hand and
exact. Nine copy-level findings, all fixed same day on her go-ahead and pushed
(`16c59d1`), verified serving live:

  · **The "Last one." class (the real pattern):** appending Chunk D panels made
    two panels lie — inv4 s4p5 and inv6 s6p4 both said "Last one." with panels
    now after them. Fixed; each station's ACTUAL last panel now carries the
    closer. **Rule for any future append: search the station for "Last one" /
    "Laaste een" first.**
  · inv2 p6 hint said "P" for external point A · inv4 p1 hint miscounted its
    options, and its ∠AOC distractor said 80° (false — that's ∠BOC; now 100°,
    a true-but-unused line like OA = OC) · tan-chord teaching copy now anchors
    on "the 64° angle at T", never "the tangent ray" (a tangent has TWO rays —
    only the marked one makes the rule work; server memo untouched, marking
    already accepted side-of-chord wordings) · inv1 p10 hint no longer asserts
    a chords-match row the learner's table may not have (N4 rule) · inv5 3b
    hint de-circularised · inv3 "one KIND of chord" · inv2 p7 note no longer
    says "panel 3" (learners never see panel numbers).
  · **Full audit trail in `QA-SWEEP.md` (repo root, committed)** — including
    one no-action observation worth a future decision: on CHOICE panels hint
    rung 2 can never display (wrong answers cap at options−1 = 3; rung 2 needs
    a 4th). Only blank/written panels and the written stuck-ladder reach it.

## Where we are (CHUNK D — TAN-CHORD, session 4 — the LAST theorem — SHIPPED, LIVE)

**Tan-chord is the fourth and final theorem of Chunk D.** `progress` was
checked for `inv4`/`inv6` before starting — still empty for both, so no
back-pay gap, same as every prior session. **With this, Chunk D is done: all
four theorems are in, every station that needed extra practice panels has
them, and nothing further is required by the original brief.**

  · **Station 4 "Prove It"** gets one more appended `choice` panel (after the
    tangent-radius one from last session — panels 1-6 are one continuous
    argument, and new theorem additions keep appending at the end). New
    figure `TANCHORD_ERR_FIG` reuses T:270/A:38, the exact points already
    verified in `data-tanchord.js`'s own "spot the theorem" mini-figure (tg+
    gives a 64° tangent-chord angle), plus a new point Q at 350° on the NEAR
    side of chord TA — the same side the tangent points into. A "learner's
    solution" line claims `∠TQA = 64° (tan-chord theorem)`; the real fault is
    that Q sits in the SAME segment as the tangent-chord angle, not the
    alternate one, so the theorem never applied to it — `∠TQA` actually works
    out to 116° (the two segments of a chord are supplementary). This is the
    exact error the brief named: grabbing the nearest point instead of
    checking which side of the chord it's on.
  · **Station 6 "Explain It"** gets `s6p5` — the ONE typed panel the whole of
    Chunk D budgeted for (§3: "mostly taps, 1-2 typed in the whole of Chunk
    D" — the count was 0 going in). Inserted before the closing note. New
    figure `TANCHORD_FIG` reuses the same T/A points and shows BOTH
    candidates, P (150°, the true alternate segment) and Q (350°, the trap) —
    neither labelled with its angle value, so the figure doesn't hand over
    the answer. The learner explains to a friend how to find the alternate
    segment and why the near point is a trap.
  · **The `s6p5` memo is applied to live** (`panel_memos`, mirrored into
    `phase16.sql`) and probed: `node tools/probe-checker.mjs s6p5` against a
    throwaway learner (created → probed → deleted, cascade clean) — 4/4
    passed. Both accepted answers (EN full, AF informal) came back `got_it`;
    a near-miss (names the right point, never explains why the other is
    wrong) came back `partly` with a nudge; a wrong-theorem answer (blames
    "OQ is not a radius" instead of which side of the chord) came back
    `not_yet` with a corrective nudge. Neither `must_have` line requires the
    letters P/Q by name — a purely spatial explanation (near/far,
    same/opposite side) is a complete answer.
  · **No new interactive, and no `solution.lines[].st` prose risk this
    time.** Both new figures build on already-verified T:270/A:38 geometry;
    Station 4's one `solution` line stays symbol-only (`∠TQA = 64°`), and
    Station 6's panel doesn't use a `solution` block at all, so the bug the
    tangent-radius session found (an English sentence in a field the engine
    never translates) had nowhere to recur. Walked anyway, in both
    languages, since that bug is invisible to the checkers by design.
  · Full write-up, including the exact geometry and the probe results, is in
    `docs/chunk-d-practice-panels.md`'s checklist.

**Checks:** `verify-node` 424 diagrams / 772 angles / 0 mismatches (up from
422/767); `audit-options` clean (inv4's new panel: correct option 217 chars
vs a 138-char runner-up, 1.57× — under the 1.6× tell threshold, no padding
needed); `check-bilingual` clean; `check-table-summary` clean (no Station 1
change this session). Walked in the browser via `?local=1` on the
`circle-quest-b` port (this folder's default port was held by another
session's dev server) and the fast console jump (below), in both English and
Afrikaans: Station 4's tap shows the right REASON pill (`tan chord theorem` /
`raaklyn koord stelling`) and note in both languages; Station 6's hint ladder
(rung 1 question, rung 2 tell) and `memoDisplay` reveal all render clean in
both languages. No console errors.

**PUSHED and LIVE — 2026-07-31, her call:** *"you can push so the kids have it
once they start playing today."* `main` was fast-forwarded from `claude/
investigation-station-circle-geo-dd1g0a` (commit `fd59720`) and pushed to
`origin/main`; verified live by fetching the two changed modules straight off
`megzieberr.github.io/circle-geo-quest` (both show the new content) and
confirming the homepage returns 200. **This push also carried the two prior
Chunk D sessions that were sitting committed-but-unpushed** (equal chords,
tangent-radius) — all four theorems went live together in this one push, not
just tan-chord.

**Next up: nothing required by the original brief — Chunk D is complete and
live.** What's still open, listed in the brief's "Also open" section: the
marking cap (not urgent — Chunk D's typed-panel count is now 1 of the
budgeted 1-2), and whether she wants the on-screen-tick XP decision
revisited (her call already stands: the tick is enough, see the checklist).
Otherwise nothing pending from this brief — the next session starts fresh on
whatever she brings.

## Where we are (CHUNK D — TANGENT-RADIUS, session 3 — built, checked, NOT pushed)

**Tangent-radius is the third of Chunk D's four theorems, done the same shape as
the previous two: three panels, all taps, no new memo, no probe run needed.**
`progress` was checked for `inv4`/`inv5` rows before starting — still empty, so
no back-pay gap to worry about, same as the last two sessions.

  · **Station 5 "Turn It Around"** gets two panels, inserted between the
    station's "true but useless" example (panel 3) and the start of the
    cyclic-quad deep-dive (panel 4): a judge panel — tangent-radius's converse
    is the station's promised fourth example, true AND useful, alongside the
    false one and the true-but-useless one already there — and an apply
    panel, which models the judge-then-apply shape the station later uses on
    the harder cyclic-quad converse. Both reuse the plain O–radius–tangent
    figure already verified for round09 and the discovery round `dtanrad`.
  · **Station 4 "Prove It"** gets one panel, appended after the closing typed
    panel (s4p5) rather than inserted mid-station — panels 1-6 there are one
    continuous argument, same call as Station 2 in the two-tangents session.
    It reuses the T/D/P points from `discover-tangent-radius.js`'s own
    derivation figure (∠TPD = 90° by the semicircle theorem): a learner's
    solution reaches the right value but reasons "tan ⊥ radius" where no
    tangent is drawn at all — TP and PD are chords. The sharp distractor
    swaps in "tan ⊥ diameter", which fixes the terminology and still misses
    that there is no tangent anywhere in the picture.
  · **A real bug, caught only by walking the browser in Afrikaans, not by the
    checkers.** Station 4's first draft put an English sentence into a
    `solution.lines[].st` field, which the engine renders verbatim and never
    translates — every existing use of that field is symbol-only
    (`∠ABC = 50°`), so `check-bilingual.mjs` doesn't scan it and passed clean
    both before and after the bug was present. Fixed by moving the setup into
    the bilingual `prompt` and leaving the solution line as pure symbol.
    **Worth keeping: `solution.lines[].st` is symbol-only, never prose — and
    a `solution`-block panel needs an Afrikaans walkthrough even when every
    checker is green, because this class of bug is invisible to them.**
  · Full write-up, including the exact panel copy and the bug, is in
    `docs/chunk-d-practice-panels.md`'s checklist.

**Checks:** `verify-node` 422 diagrams / 767 angles / 0 mismatches (up from
420/765); `audit-options` clean (inv5 p4/p5 both land at 25/25/25/25 across
the sample, no length tell); `check-bilingual` clean; `check-table-summary`
clean. Walked in the browser via `?local=1` and the fast console jump (below)
in both English and Afrikaans: all three new panels answer correctly, show
the right REASON pill, and — after the fix — render clean in both languages.
No console errors.

**Not yet reviewed by her, and NOT PUSHED** — same as the last two sessions,
awaiting her word. Committed locally only, once she says so.

**Next up:** tan-chord is the last of the four theorems → Station 4 (the wrong
alternate segment) and Station 6 (explain which segment is which — the one
typed panel Chunk D may still need, per §3 of the brief). Once that lands,
Chunk D is done.

## Where we are (CHUNK D — EQUAL CHORDS, session 2 — built, checked, NOT pushed)

**Equal chords is the second of Chunk D's four theorems, done the same shape as
two-tangents: three panels, all taps, no new memo, no probe run needed.** Nobody
has played the Investigation Station yet (her words going in: "the kids haven't
started playing the investigation station"), so there is no back-pay gap to
worry about this time either.

  · **Station 3 "Break It"** gets the counterexample: two circles of different
    radius (4 cm and 7 cm), each carrying a chord of the SAME real length
    (6 cm, marked with tick marks), whose central angles come out at 97° and
    51°. "Equal chords, equal angles" was always quietly assuming one circle —
    this is the dropped-condition move the station already teaches, on a
    second theorem.
  · **Station 1 "Measure & Notice"** gets a drag-and-record panel on
    `discover-equal-chords.js`'s own figure (its `CENTRE` factory renamed to
    `MODEL` and exported — same reuse convention as the other two theorems
    already on this station), plus a choice panel reading the learner's own
    table back to them. **My call on the open "Station 1 or 2" question**: 1,
    to match the theorem table's own pairing and keep the same drag-then-read
    shape Station 1 already used for two-tangents.
  · Full write-up, including the exact geometry and why the two circles' 6 cm
    chords don't need to be pixel-identical, is in
    `docs/chunk-d-practice-panels.md`'s checklist.

**Checks:** `verify-node` 419 diagrams / 764 angles / 0 mismatches (up from
417/762); `audit-options` clean; `check-bilingual` clean; `check-table-summary`
clean. Walked in the browser via `?local=1` and a dev-console pointer-drag
simulation (the preview pane cannot drag by hand) — both new Station 1 panels
and the Station 3 counterexample confirmed correct in EN and AF, tick marks
render on both Station 3 diagrams, no console errors.

**She reviewed it the same session** — checked both new panels herself via the
fast console jump (below) rather than replaying the whole line, and is happy.
**Still NOT PUSHED — her explicit call**: "commit, don't push yet." Committed
locally only.

**Next up:** tangent-radius → Station 5 (its true, useful converse) and
Station 4 (used where the line is not actually a tangent). Then tan-chord
last, and that is the whole of Chunk D. Paste-ready prompt for that session is
in `docs/NEXT-SESSION-PROMPT.md`.

**Fast way to preview just the new panels of a station, without replaying the
whole line** (found useful this session, worth keeping): open the dev server
with `?local=1`, log in, then in the browser console —
```js
const mod = await import('/js/rounds/index.js');
const round = mod.ROUND_BY_ID['inv1'];   // or whichever station
round.panels = round.panels.slice(N);    // N = index of the first new panel
window.__APP__.go("investigate", { roundId: "inv1" });
```
Nothing persists — a page reload puts the station back to normal. `?preview=1`
(the existing teacher-preview mode) also unlocks every station instantly if a
fuller walkthrough is wanted instead.

## Where we are (THE STREAK FIX — SHIPPED AND LIVE, same day, later session)

**THE DAY-STREAK IS SERVER-COMPUTED NOW.** A learner's written comment
(2026-07-25: "the streak doesn't count it if it's completed on another device")
was correct — the streak lived only in localStorage. Commit `c379ce9` on `main`,
live on Pages and verified serving; **phase19.sql is APPLIED to live** (via MCP,
migration `streak_server_computed_phase19`) and probed with a throwaway learner
(created → probed → deleted, cascade clean, 21 real learners untouched).

  · `cgg_get_streak` (phase19) is **READ-ONLY** — counts distinct SA-time days
    of `round_id='daily'` xp_events rows via gaps-and-islands. streak = run
    ending today (or yesterday while today is open), best = longest run ever.
  · Client: `syncStreak()` in daily.js mirrors the server number into
    localStorage (now only the offline fallback); the Daily screen syncs on
    entry — a daily done on another device shows as DONE here with the right
    number; milestones detect on the SERVER streak and skip the celebration if
    already claimed elsewhere; home card syncs once per page load (game.js).
  · All four touch points done: RPC · js/supabase.js · BOTH api.js stubs
    (LocalBackend computes it; PreviewBackend returns ok:false ON PURPOSE so
    the teacher preview keeps its optimistic display).
  · **Retroactive by nature** — the history was in xp_events all along, so the
    reporting learner's streak came back by itself. Known limit (accepted, in
    the phase19 header): a fully OFFLINE day never reached the server and can't
    count, exactly as it never earned daily XP or Perfect Week credit.
  · Verified: offline mirror (streak 3→4 across a wiped "device B", best 5
    kept, 0 console errors) and live SQL probe (same numbers through the real
    cgg_submit_daily). verify-node 417/762/0; check-bilingual green; advisors
    0 errors. Test data cleaned up on both sides.

**The post-squash housekeeping is DONE** (same session): the working branch was
rebased onto `origin/main` — every duplicate commit dropped as already-upstream
(the tree was byte-identical, checked before skipping the status-file
conflicts) — and force-pushed with `--force-with-lease`. The streak commit was
then pushed to BOTH the branch and `main` (`git push origin HEAD:main`), so the
two now sit on the SAME commit and no divergence exists to clean up next time.
Also: preview entry `circle-quest-b` (port 5181) added to the global
launch.json, because another session held 5180.

## Where we are (THE DASHBOARD SESSION — SHIPPED AND LIVE)

**NOTHING IS PENDING.** [PR #5](https://github.com/megzieberr/circle-geo-quest/pull/5)
was merged to `main` on 2026-07-30 (squash, `0d395a9`), GitHub Pages rebuilt on
that exact commit, and the live site was verified serving the new modules
(`config.js` carries `replayMaxPaid`, `api.js` `adminStuck`, `admin.js`
`renderStuckReport`, `announce.js` `maybeShowReplayAnnounce`). All three
migrations were already applied. Client and database now agree.

What the class meets next time they open it: **replays pay half XP** (two per
round) and the **one-time announcement popup** explaining it. What Megan meets on
`admin.html`: the **"I don't get it" panel** — empty until the class plays,
because the table genuinely has 0 rows today.

⚠️ **HOUSEKEEPING FOR THE NEXT SESSION, and it is only housekeeping.** PR #5 was
**squash**-merged, so `main` holds one new commit while
`claude/investigation-station-circle-geo-dd1g0a` still holds the three originals.
The two histories have therefore DIVERGED, and re-merging that branch into `main`
now fails with "the merge commit cannot be cleanly created" — that is expected
after a squash, not a broken branch. `main` has every line of the work. Before
starting the next chunk, **rebase the working branch onto `origin/main`** (per
the dispatch-branch rule: rebase on top, never delete the branch). Nothing is
lost either way; the code on `main` is what the learners are running.

Three things landed, all verified:

**1 · THE "I DON'T GET IT" PANEL EXISTS.** Every tap has logged to
`checker_calls` (verdict `stuck`) since this morning with no screen to read it.
`cgg_admin_stuck` (**phase17.sql**) + a panel in `js/admin.js`, under "Needs a
hand":
  · **by panel, most-stuck first** — learners · taps · how many rode it to rung 3
    · **how many taps arrived with NOTHING typed**. Mostly-blank panels get a
    red "wording?" flag, gated at 2+ learners so one confused learner can't fire
    it. That is the s3p4 signature, and catching it is the whole point.
  · **the marking verdicts for the same panel sit in the same row.** Lots of taps
    + a healthy spread = a HARD question. Lots of taps + nothing typed = a BADLY
    WORDED one. Different problems, different fixes.
  · **click a panel to read the typed text.** Blank taps render as a dashed empty
    card. Then "Who to sit next to" rolls the same taps up per learner.
  · ⚠️ **READ-ONLY BY DESIGN.** `checker_calls` is both the log and the meter, so
    the function has no INSERT/UPDATE/DELETE anywhere and `cgg_checker_claim`'s
    cap query is untouched. Verified: 0 rows written by it. **Keep it that way.**
  · All four touch points done, including the third one a fresh session forgets:
    the RPC · `js/supabase.js` · **BOTH** stubs in `js/api.js` (LocalBackend and
    PreviewBackend) · the panel.
  · **The table is genuinely empty today** — her play-test rows went when that
    throwaway learner was deleted. The panel will honestly say "nobody has tapped
    it yet" until the class plays.

**2 · MARKING CAP 20 → 40** (her call). One number in `cgg_checker_claim`. The
edge function passes **no `p_cap`**, so that default IS the live cap — no
redeploy was needed. Mirrored into phase16.sql.

**3 · REPLAYS PAY AGAIN — two paid replays per round at HALF rate** (her call,
half chosen over full so revisiting an easy round can never out-earn pushing into
a new one on the weekly board). **phase18.sql.**
  · ⚠️ **THE COUNTER IS A COLUMN, NOT A COUNT OF `xp_events`, AND THE LIVE DATA
    IS WHY.** The obvious version — "count paid xp_events, pay half for the 2nd
    and 3rd" — is WRONG here. Under the old rules a FAILED attempt on a
    not-yet-passed round still earned XP, so **60 learner-round pairs across 18
    of the 21 learners already sat at 3+ paid events** — precisely the rounds
    each learner found HARDEST. That version would have paid nothing for
    revisiting exactly the rounds most worth revisiting, and full value for the
    ones they aced. Caught by checking the real table before shipping, not after.
    So `progress.paid_replays` counts REPLAYS (a paid play on an already-passed
    round); it starts at 0, which is historically true, so everyone begins with a
    clean two goes per round whatever their history. Attempts before a first pass
    are untouched and still pay in full.
  · **The ceiling MOVED from the client to the server.** It used to live in
    `js/game.js`'s `if (!alreadyPassed)` gate — fine while replays pay nothing,
    useless once they pay something. This closes the gap the 2026-07-30 entry
    below flagged as "the protection is real but lives one layer up". Consistent
    with the 2026-07-18 ruling: this does not make faking XP harder, it stops an
    HONEST learner farming one easy round all evening.
  · **The results screen now shows the SERVER's `xpAwarded`**, not the client's
    own estimate, so the number a learner sees is always the number banked.
    Per-question popups show the halved figure on a replay (one combined figure,
    because three separately-halved numbers do not visibly add up).
  · **The Investigation Station submits replays too**, which also closes most of
    the Chunk D back-pay gap: a learner who finished a station before it gains a
    panel now gets paid for the longer station when they replay it.
  · A one-time announcement popup explains it in both languages
    (`maybeShowReplayAnnounce`, its own storage key so it and the Boost popup
    never stack and neither burns the other's key).
  · Verified on live Postgres against a throwaway learner, deleted afterwards:
    failures before the pass pay full and burn nothing · first pass full ·
    replays 50, 50, 0 · **a replay earning nothing does not burn a go**. The
    offline backend matches exactly. Back to 21 learners, 0 checker_calls,
    0 paid_replays used.

**Checks:** verify-node **417 diagrams / 762 angles / 0 mismatches**;
audit-options, check-bilingual and check-table-summary all green. Dashboard panel
walked in all three states (data / empty / migration-missing), no console errors,
no horizontal overflow.

**Chunk D was DEFERRED, her call** — she is at 75% of her weekly token limit and
there is no cheap version (one theorem = new panels in two stations, both
languages, diagrams to verify, possibly new memo rows). It costs less next week
now that replays pay, because the back-pay gap mostly closes by itself.

⚠️ **The stale-module trap bit again and the fix is NOT what §4 of the chunk-d
doc says.** The server was serving the new code with correct `no-store` headers
the whole time — it was the TAB's ES-module registry holding the old modules, and
`navigate` with `force: true` did not clear it (it also silently dropped the query
string). What worked: **open a brand-new tab**. A `fetch(url, {cache:'reload'})`
check comparing the served bytes against the file on disk is the fastest way to
tell the two apart — if the served bytes are new and the page still behaves old,
it is the registry, not the cache.

## Where we are (CHUNK D, session 1 — SHIPPED)
**THE INVESTIGATION STATION IS LIVE.** `CONFIG.stationsLive` is **true** as of
2026-07-30 — her call after play-testing the whole line herself ("make it visible
for the learners"). Committed and pushed.

**It went live with ONE of Chunk D's four theorems in**, which is earlier than the
original plan said. That is deliberate and safe: the six stations were complete
before Chunk D started, and the remaining three theorems (equal chords,
tangent-radius, tan-chord) only ADD practice panels to finished stations. Nothing a
learner meets today is half-built. Setting the flag back to false hides the whole
line again in one line.

⚠️ **One consequence of releasing early, for whoever adds the next theorem:** a
station that gains a panel starts paying more XP automatically (the total is
`panels.length × rate`), but **a learner who already finished that station is not
paid the difference — a replay pays 0.** That is exactly the back-pay problem §1's
sequencing existed to avoid, and it is now live. Per theorem, either add the panels
to stations the class has not reached yet, or accept the gap knowingly.

The whole session, in order: XP per panel · two tangents from a point (three panels,
then rebuilt as a drag on her call) · the `s1p4` mark-scheme unfairness · the
concyclic "why" slide · the override link replaced by "I don't get it". Details in
the Decisions below.

**1 · XP is per panel now.** `CONFIG.investigationXpPerPanel: 10` replaces
`investigationXp: 50` (the old key is gone rather than repurposed, so nothing can
read the new number as the old meaning). `finish()` banks `panels.length × rate`
ONCE, which keeps the single reliable write; a "+10 XP" tick in the station header
flashes as each panel clears and settles to a running total. **Her sub-decision,
asked and answered: the tick is enough**, not genuine mid-station banking — there
is no resume today, so a learner who quits restarts at panel 1, and paying as you
go would need a record of which panels already paid plus resume screens.
Landed while `progress`/`xp_events` are still at 0 rows, which was the whole point
of the sequencing. Verified end to end: Station 1 banks 70 (7 panels), Station 2
banks 70 (7 panels), a replay pays 0 and shows no tick at all.

Two things the change turned up, both fixed and both pre-existing:
  · **The station map promised one number for every stop.** It now states the RATE
    ("every step you finish pays 10 XP") and each stop card computes its own total
    from its panels — so a station that gains a panel starts advertising the higher
    number by itself. No station total is hard-coded anywhere.
  · **The results screen never mentioned station XP, and never had.** `game.js`'s
    `params.discovery` branch is marked "no score, no XP" — true of discovery
    rounds, false of an Investigation Station reusing that branch. So the line had
    always been banking 50 silently. The pill is now gated on `params.xp > 0`.

**2 · Two tangents from a point — four panels.** Station 1 gains a **drag-and-record**
panel (her call while play-testing: "I want it to be draggable please") plus the
choice panel that reads the learner's own tangent table back to them; Station 2
gains the sentence-build and the four-learners judge, appended after panel 5.
  · **No new interactive was written.** `discover-tangents-point.js` (`dtanpoint`)
    already had exactly this figure, so its `MODEL()` is now exported and imported —
    the same trick Station 1 already uses for the centre-double drag and Station 2
    for the bowtie. The class therefore sees the identical picture they met on the
    main line, and the two can never drift apart.
  · **The letters match across both stations.** Station 2's still figure was
    relabelled from P/T/S to **A/F/C** to agree with the drag. The stations are
    played days apart, and meeting AF/AC at Stop 1 then PT/PS at Stop 2 reads as a
    different theorem.
  · Defect caught on the way: the readings table defaults a column's unit to `"°"`,
    so the tangent LENGTHS rendered as "149°". Both tangent columns now carry
    `unit: ""`. Worth remembering for any future non-angle table.
  · Station 1's own recorded table proved the dedupe is right, not broken: dragging
    P along its arc records ONE row, because ∠APB does not change along that arc.
    Different readings need A or B moved. The counter's "different positions"
    wording is what explains that to a learner.

**3 · THE STALE-MODULE MYSTERY IS SOLVED, and it was not what the notes said.**
See the Decisions entry below. Short version: the Preview MCP never reads the
project's `.claude/launch.json` from these sessions, so Chunk C's fix had never
once been in effect. Fixed in `C:\Users\megzi\.claude\.claude\launch.json`.

## Where we are (Chunk C, for the trail)
**CHUNK C IS BUILT AND COMMITTED — all 21 playthrough findings are closed.** The
line now teaches before it asks, the app records the learner's own readings, the
options no longer give themselves away, and the two mark schemes that were unfair
have been fixed and re-probed 13/13 against the live checker.

**The line is deliberately HIDDEN from learners** (`CONFIG.stationsLive: false`) —
her call: finish the whole build, including Chunk D's extra practice panels, before
the class meets it. `?stations=1` walks it anyway. Four commits, branch 11 ahead of
origin, **nothing pushed** and the working tree is clean.

Worth knowing: **pushing is now safe whenever she wants it**, because the flag hides
the station while everything else goes live. Chunk C also fixed two discovery rounds
the class plays TODAY (`dsameseg` p1 and `dsemi` p4 had the reason bolted onto the
correct option — a giveaway and a length tell) plus the shared diagram engine. Those
fixes are sitting unpushed behind a station they no longer depend on.

What changed, grouped the way the findings were:

**Line-wide**
  · **N18 — options are shuffled now.** They rendered in source order and the
    correct one had been written FIRST in 19 of 19 choice panels across
    `investigate.js` and `discover.js`, so tapping the top one cleared the whole
    line without reading. The rules live in the new **`js/options-order.js`** (a
    leaf module that imports nothing, so it is testable from node); `ui.js`
    re-exports `shuffled` from there so `game.js` is untouched. Two opt-outs and
    no more: `keepOrder` on a panel whose options are a sequence (only `inv4` p3
    qualifies) and `pin` on a single option that must hold its place (`inv4` p2's
    "Nothing is wrong"). **`node tools/audit-options.mjs`** samples the real
    function 4000 times per panel and fails if the correct answer sticks in one
    slot, or if a numbered sequence is unmarked.
  · **N18b — the length tell is gone too** (correct-is-longest was 13 of 19,
    now 0 above 1.6×). On `inv6` p1/p2 the distractors were PADDED per her
    ruling, never the right answer shortened — and the padded ones now fail
    while being long, which is better teaching. Two live discovery panels had
    the reason bolted onto the correct option (`dsameseg` p1 was 19.5×): that
    came off, which also stopped a small answer leak.
  · ⚠️ **Three post-answer notes described options BY POSITION** ("The first one
    works because…") and became lies once shuffled. Rewritten to name each
    option by its words. The rule is now written at the top of
    `js/options-order.js`.

**The root cause (five panels)** — every one now teaches above its question:
`s1p4` (a `needs` list, plus the split below), `inv3` p3, `inv4` p1, `s5p4`,
`inv6` p2. Details under Decisions.

**Two new engine capabilities**, both opt-in and additive:
  · `engine.js` gained **`noCircle`** and free **`pts: {P:{x,y}}`** points, for
    Station 3's "four dots and no circle that fits them" figure. This is the
    non-circle diagram mode the deferred worksheet items also wanted.
  · `investigate.js` gained a **`solution`** block (statement + reason per line,
    with a gap for a missing statement or a missing reason), a **readings table**
    (`record` / `showRecord`), a per-run **`scratch`** so a panel can hand
    something to a later panel, and **prompts may be functions** of that scratch.
  · `interactive.js` gained **`onRelease`**, which fires once when a drag ENDS —
    that is what makes recording one reading per position possible.

**Checks, all green:** `verify.html` **413 diagrams / 760 angles / 0 mismatches**
(up from 406/749; the browser page and the new `tools/verify-node.mjs` agree
exactly). Marking probes **13/13** on the two changed schemes. Every learner
string carries both languages (`tools/check-bilingual.mjs`). Both languages
walked in the browser; no console errors.

TWO COMMITS LANDED TODAY, both on the branch, neither pushed:
  · `27e71bf` **CHUNK B — the train.** Details below; all four rulings verified.
  · `731feed` **the line-wide scaffolding pass.** Every one of the nine typed
    panels now carries a `needs` list ("Your answer needs to:") rendered above the
    answer box, written from that panel's live `must_have` with the answers
    stripped out; the starter chips moved above the box too; a new `predict` panel
    type (a guess is accepted, never scored, never reaches the trajectory stats)
    with `inv3` panel 1 converted to it; the "IEB says" attribution stripped from
    every learner-facing string while every marks sentence stayed; and `s2p4`'s
    hints and reveal text fixed — they had been teaching "on the same side of the
    chord", the ONE location wording its mark scheme refuses.

**CHUNK B (2026-07-30, committed at `27e71bf`).** All four of her design rulings
are in and verified in the browser:
  1. `js/stations.js` (new) holds `trainStrip()` — a full-width tappable strip on
     the home screen, inserted directly above the rank ladder — and
     `renderStations()`, the six-stop map, routed as the new `stations` screen.
     Pi is untouched. Her art is used as-is: the PNG's transparent padding
     (13.85% top, 32.85% bottom of its width) is cropped in CSS with negative
     percentage margins, which resolve against the WIDTH, so the numbers land the
     crop exactly. Measured live: a 520px-wide box renders the art 520x277, i.e.
     the true 1066/2000 aspect. The file itself was never opened for editing.
  2. The map is a real six-stop line — no "coming soon" halts.
  3. The stations are OFF the main map: `rounds/index.js` now exports
     `MAIN_ROUNDS` / `STATIONS` (split by `kind`, not a hand-kept id list) plus
     `unlockedIds()`, which both maps share so the unlock chain can't drift.
     Verified: 43 cards on the home map, 0 of them a station, and the continue
     card reads "0 / 43 rounds done" again.
  4. `g6` is off the ladder via a `hidden: true` flag on the group (config.js) +
     `LADDER_GROUPS`. Verified with all six stations passed: the home stat reads
     **5/5 BADGES** and the rank reads **🏆 Circle Grand Master**. The badge is
     still earned and still fires the ceremony; it is displayed on the station map
     once the line is done. Side effect worth knowing: the Adventures banner is
     back for finishers — it had been gated on 6/6, which g6 made unreachable.
Also: ✕ inside a station and a station's results now return to the station map,
not home; the end-of-quest survey fires on the last MAIN round again (it had moved
to inv6). `verify.html` still green — **406 diagrams / 749 angles / 0 mismatches**.
Walked in both languages at 375px and 1280px, no console errors, no horizontal
overflow. Nothing pushed; the branch is 6 commits ahead of origin.

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
- 2026-08-06 — **The Investigation Station is HIDDEN, not retired — her exact words:
  "not retire or nuke. We will need it again for the grade 11 learners of next year."**
  The one flag (`stationsLive`) does the hiding; all content, memos, edge function and
  progress stay. Re-enable = flag `true` + a fresh `ANTHROPIC_API_KEY` in Supabase
  secrets. Do not clean up, drop, or "simplify away" any station code or SQL in the
  meantime.
- 2026-08-02 — **The inflated inv4 row keeps its XP, her call.** 8 attempts / 240 XP /
  4 paid replays on one clean play, caused by the double-save. Correcting it would have
  clawed 160 XP back off a learner who did nothing wrong and may well have seen the
  total. Left as-is. Only rows created before 2026-08-02 can be affected.
- 2026-08-02 — **A button that triggers an async submit must be disabled BEFORE the
  await, and carry a `spent` flag as well.** `game.js` always did; `investigate.js` and
  `discover.js` didn't, and that alone cost 250 XP and nine phantom attempts. The flag
  matters separately from the disable: a click already queued when the button dies still
  runs its handler.
- 2026-08-02 — ⚠️ **`js/discover.js` was touched despite the "stays frozen" ruling —
  flagged to her, not assumed.** That ruling (2026-07-31) is about the HINT LADDER: the
  11 discovery rounds keep the old 3-miss rungs, do not mirror the Station's. This change
  touches neither hints nor teaching — only the submit guard, so a double-tap can't save
  twice. Nothing a learner sees changes except Continue reading "Loading…" for a moment.
  If she'd rather discover.js went back to untouched, it's `git revert` of the
  `discover.js` hunk in `4061af8` alone; `investigate.js` and phase20 stand on their own.
- 2026-08-02 — **A read-then-write on a counter inside an RPC needs `for update`.** The
  replay cap looked correct and tested correct, because real replays are minutes apart.
  It only ever leaked when a client bug delivered eight submits in under a second. Assume
  any cap that guards XP will eventually be hit concurrently.
- 2026-08-01 — **The Station-reminder button is retired, her call ("I don't need that
  button").** The reminder was sent server-side instead (7/7 learners, verified), so
  the button and the whole `adminBroadcastPush` client path were removed. If a
  dashboard-triggered push is ever wanted again, send-push needs check-answer's CORS
  block first — the browser path never worked and was never tested from the browser.
- 2026-08-01 — **send-push's deployed broadcast branch stays as-is.** Unreachable from
  any client now, still admin-password-gated, and not worth a redeploy of the function
  the daily cron depends on just to delete dead code.
- 2026-07-31 — **Station 4 title and inv6 p2 wording: leave as is, her call.** "Prove It"
  still reads fine even though the copy inside now says "solution"; the fictional
  learner's protractor line stays too — it's a quoted write-up, not the app's own claim.
- 2026-07-31 — **"I don't get it" panel: closed, no action needed.** Watched the first
  lesson back — the class is struggling on some typed panels but not giving up, which is
  the healthy outcome. No panel wording needs fixing.
- 2026-07-31 — **POPIA/AI-use policy question dropped — her call.** She doesn't work for
  the school, so it isn't hers to raise with them.
- 2026-07-31 (**TAP-PANEL HINTS RUN AHEAD OF ELIMINATION; DISCOVERY ROUNDS DO NOT** —
  her calls, audit session.)
  · On Investigation Station CHOICE panels, every wrong tap advances the hint ladder
    one rung (wrong 1 → rung 1, wrong 2 → the rung-2 tell) so both hints land while a
    real choice remains — before, rung 2 was unreachable and rung 1 arrived only once
    elimination had answered the question. Blank/written panels keep the 3-miss ladder.
  · **The 11 discovery rounds keep the OLD ladder** — `js/discover.js` stays frozen,
    her explicit ruling ("leave the discovery rounds please"). Do not mirror.
- 2026-07-31 (**AUDIT RULINGS, from the fresh-eyes sweep — see `QA-SWEEP.md`.**)
  · Appending panels to a station: FIRST search its copy for "Last one" / "Laaste een"
    and move the closer to the panel that is actually last. Both inv4 and inv6 lied
    after Chunk D's appends; fixed, and the actual last panels now carry it.
  · Tan-chord teaching copy anchors on "the 64° angle at T", never "the tangent ray" —
    a tangent has two rays, one per side of the chord, and only the marked angle makes
    the find-the-alternate-segment rule read one way. Server memo untouched (it already
    accepts side-of-chord wordings).
  · Distractors on error-spotting panels should be TRUE-but-unused lines, not false
    statements — inv4 p1's ∠AOC option corrected 80° → 100° to match that standard.
- 2026-07-30 (**"I THINK MY ANSWER WAS RIGHT" IS GONE. "I DON'T GET IT" REPLACES IT** —
  her call, same session, once the entry below showed what the old link really did.)
  · Her reasoning, and it is right: the old link let a learner mark their own work,
    and it was never load-bearing anyway. The never-stuck ladder already guarantees
    nobody is blocked (3 wrong → hint, 5 wrong → answer + Continue), so all the link
    added was a self-mark any class would find in a day.
  · **The new link asks for help instead of claiming correctness**, and it is available
    IMMEDIATELY, before any attempt — a learner who does not understand the question
    cannot produce three meaningful wrong answers first, and making them fail three
    times to earn a hint punishes being lost. Each tap walks the same ladder:
    **tap 1 → hint rung 1 · tap 2 → hint rung 2 · tap 3 → a good answer + Continue**
    (her call on the third rung: yes, it should let them through). The label changes
    as it goes, so the learner can see there is more behind it. **Typed panels only**
    — also her call. Nothing here touches `stats.firstTry`: asking is not answering.
  · **Two server changes were needed, and the second one is the subtle one:**
    1. `check-answer` **v4** gained a `stuck` branch that logs to `checker_calls` with
       verdict `stuck`, makes no API call, and sits ABOVE the cost cap. The old
       `override` branch is kept so a stale cached client still works rather than
       erroring at a learner mid-panel.
    2. ⚠️ `cgg_checker_claim` counted **every** row in `checker_calls` inside the
       window — so the new stuck rows would have eaten the 20-per-hour MARKING budget.
       Exactly backwards: the learner asking for help is the one who still needs their
       answers marked. The counter now ignores `verdict = 'stuck'` (a NULL verdict is
       still counted — that is a claim in flight). Applied as migration
       `checker_cap_ignores_stuck_rows` and mirrored into `supabase/phase16.sql`.
       **Rule: anything new written to `checker_calls` must be checked against the cap
       query, because that table is both the log and the meter.**
  · Verified live end to end: the three rungs render in order, the button disappears
    after the reveal, four `stuck` rows logged with the panel id and whatever had been
    typed (often nothing, which is itself the signal), and `cgg_checker_claim` reports
    8 marking calls used while ignoring all four.
- 2026-07-30 (**THE OVERRIDE LINK WAS MARKING WRONG ANSWERS RIGHT — she found it play-testing.**)
  · "I think my answer was right" called the same `onRight()` as a genuine pass, so it
    printed **"✓ You've got it!"** over an answer nobody had judged. Her own session is
    the proof, in `checker_calls`: `s3p4` came back **`partly`** at 17:59:51 (correctly —
    her sentence said a conjecture claims something about "every tested value" rather
    than about ALL values), and the override at 18:00:26 turned that into a green tick.
  · Two harms, and **the second one she had not spotted**: the message teaches a learner
    that a wrong answer was right and turns the hatch into a one-tap "tell me I am
    correct" button that a class finds within a day — AND `onRight()` set
    `stats.firstTry = (wrong === 0)`, so an override tapped straight away was recorded
    as a **first-try success**, quietly inflating the very numbers the admin trajectory
    panel exists to read. A learner coasting on the hatch would have looked like a
    learner who never needed help.
  · Fix: `onRight({ overridden })`. The hatch still ALWAYS advances — the never-stuck
    ladder is the whole design and is untouched — but it now shows a neutral, honest
    line ("Noted — your teacher will read this one herself. Carry on for now.") in the
    `revealed` style rather than the green pass style, and it forces `firstTry = false`.
    The answer is still logged with verdict `override` for her review; verified in the
    table after the change.
  · Rule worth keeping: **an escape hatch must never speak in the voice of a mark.**
    Advancing a learner and telling them they were right are different promises.
- 2026-07-30 (**`s1p4` WAS MARKING A CORRECT ANSWER DOWN — found by play-testing, fixed
  and re-probed. The lesson generalises to every accept-any-one scheme on the line.**)
  · Symptom: "Even the positions I did measure were rounded off to whole degrees…"
    came back **`partly`**, asking for "all the positions you didn't measure". But the
    panel promises the opposite in THREE places — the `needs` list says "one good
    reason is enough", hint rung 2 says "(Another sound reason on its own: the readings
    were rounded…)", and `memoDisplay` says "A second reason on its own is also enough".
    A learner who got stuck, read the hint, and did exactly what it said was marked down.
  · **The `must_have` text was already right** — it said "ACCEPT ANY ONE … treat them as
    fully equivalent … do not ask for a second one". The failure was in its SHAPE: the
    three routes were written as an **(a)/(b)/(c) list**, and the system prompt tells the
    model to "check the must-have list one line at a time" and award got_it only "if
    every line is present". A lettered list inside a conjunctive frame reads as a
    checklist, so the model demanded all three and reported the unused two as `missing`.
  · **Fix:** rewritten as `EITHER … OR … OR …` with the satisfaction rule FIRST ("ANY
    SINGLE REASON BELOW SATISFIES THIS MARK SCHEME IN FULL"), plus an explicit
    instruction not to put the unchosen alternatives into the `missing` field. No
    redeploy — one UPDATE on `panel_memos`, mirrored into `supabase/phase16.sql`, and
    verified the live row and the file are byte-identical.
  · **Re-probed: 7/7 on the existing s1p4 set, plus both English rounding sentences now
    `got_it`** (they were the regression). Both are now permanent probes in
    `tools/probe-checker.mjs` — the Afrikaans rounding probe had been passing all along,
    which is exactly why this survived: one wording passing is not the same as the ROUTE
    passing, so an accept-any-one scheme needs a probe per route PER LANGUAGE.
  · ⚠️ **Generalise this before the next memo is written:** never express alternatives as
    a lettered list. `s3p4` and `s6p3` are the other accept-either schemes on the line
    and are worth re-reading against this — `s6p3` accepts either of two proof routes,
    which is the same shape that just failed here.
- 2026-07-30 (**THE PREVIEW PANE'S STALE MODULES — root cause found, and the note in
  the Chunk C entry below is WRONG about the fix.** Kept both so the trail reads.)
  · Chunk C concluded the pane served stale ES modules because `.claude/launch.json`
    ran `python -m http.server` instead of `serve.py`, and edited that file. The
    edit was correct and **had no effect, because that file is never read.** These
    sessions start with the working directory `C:\Users\megzi\.claude`, so the
    Preview MCP resolves its config to **`C:\Users\megzi\.claude\.claude\launch.json`**
    — a global file listing every one of her projects — and ITS `circle-quest` entry
    was still `python -m http.server`. Plain `SimpleHTTPRequestHandler` honours
    `If-Modified-Since` and answers **304**, so every edited module went on loading
    from the browser cache. This cost most of a session in Chunk C and cost time
    again today before it was chased down.
  · Caught by the symptom the brief predicts: a word chip rendered as its raw id
    (`ptDifferent`) although the chip existed on disk and `check-bilingual` passed.
    Bare URL 38161 chars, `?bust=` 38704 — the file on disk was fine all along.
  · **The fix is in the GLOBAL file**, and it is `cmd /c cd /d <project> && python
    serve.py 5180`, matching the shape the `nwu-hub` entry already used. Two traps
    on the way: `serve.py` serves its own CWD and takes no `--directory`, so
    launching it by absolute path from `~/.claude` served a directory listing of
    `~/.claude`; and quoting the path inside the `cmd /c` string makes the MCP fail
    to start it (`nwu-hub` leaves the spaces unquoted, which works).
  · Verified after the change: responses carry
    `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`, and the BARE
    url serves the edited file. **Also worth keeping: `fetch()` answers from the
    HTTP cache**, so when checking response headers use `fetch(url, {cache:'reload'})`
    — a plain `fetch` reported "no cache-control header" from a cached response and
    briefly pointed the diagnosis the wrong way.
  · ⚠️ `.claude/` is gitignored at BOTH levels, so none of this travels to a fresh
    clone, and the project's own `.claude/launch.json` is now decorative. Left in
    place (correct, and read if a session ever runs with the project as cwd).
- 2026-07-30 (**CHUNK D session 1 — the two build calls that were mine, not hers.**)
  1. **The new panels are STILL FIGURES, not a new draggable.** §2 of the brief
     suggested two-tangents "suits a drag-and-record panel". It does — but the N8
     ruling (do not build a new interactive without asking) is the governing
     precedent, a new `MODEL()` is a real build rather than a panel, and the preview
     pane cannot test dragging at all (`innerWidth` is 0). Station 1 already teaches
     drag-and-record on the centre-double figure; what it had never practised is
     reading a table you did NOT take yourself and saying what it does and does not
     support, which is most of what a marker asks for. **Open for her: say the word
     and the draggable version gets built.**
  2. **Station 2's new panels go AFTER panel 5, not before it.** §5's rule is that
     new panels precede a station's closing `note` — Stations 1, 3 and 6 end on one.
     Station 2 does not: it ends on a typed panel whose note is the payoff of a
     single five-panel argument about one conjecture, which cannot be interrupted
     halfway. Appending also turned out to be the better teaching, because that
     note's last line is about a condition that "was never decoration" — and the
     condition this theorem drops is the SAME external point.
- 2026-07-30 (**CHUNK D's shape, and the XP RULING — her call at the end of the Chunk C
  session.** Full brief in `docs/chunk-d-practice-panels.md`.)
  · **More panels inside the six existing stations, not new stations.** 2-3 extra
    questions per station on the theorems the line never uses (tangent-radius,
    tan-chord, two tangents from a point, equal chords). The train stays six stops; no
    badge or ladder changes. One theorem per session — she was explicit it need not
    land in one sitting.
  · **XP IS NOW PER PANEL, not a flat 50 per station** — her words: *"they earn XP for
    each panel, shame."* This reverses half of the original flat-XP decision, and the
    half it reverses is fine to reverse. What must NOT change is the rest of that
    rationale, written in `js/investigate.js`'s header: **XP is never scaled by
    attempts or by correctness**, because a learner who fights through five attempts
    has investigated MORE, not less. Per-panel is compatible with that; per-attempt is
    not. Do not let it drift into the second one.
  · **The sequencing is load-bearing: this has to land BEFORE the push.** Checked on
    the day — `progress` holds 0 rows for `inv%` and `xp_events` 0, because the line
    has never been pushed, so no learner has banked station XP and there is nothing to
    back-pay. But a re-play pays 0 (`alreadyDone` in `finish()`), so once learners
    start finishing stations, everyone who finished before the change is stuck on the
    old amount with no way to top them up. Change it while that number is still zero.
  · Recommended (hers to confirm): **10 XP per panel, every panel type**, still banked
    once at the end as `panels.length × rate`, with a "+10 XP" tick shown per panel so
    it feels per-panel without needing partial submission. Today's 34 panels → 340 XP
    against 300 now; after Chunk D's ~15 → ~490. Paying only for *answerable* panels
    (26 of 34) was considered and rejected — Station 1's explore panel now makes the
    learner record three readings, which is real work.
  · **Open sub-decision for her:** is the on-screen tick enough, or does she want XP
    genuinely banked panel-by-panel so it survives quitting halfway? The second needs
    a mid-station `progress` write. Ask before building it.
- 2026-07-30 (CHUNK C — where the build DEPARTED from the playthrough plan, and why.
  Everything else went in as written up in the notes doc.)
  1. **`s4p4`'s second slide is a TAP, not a second typed panel.** N15 said split it
     into "what did it spot?" then "name the theorem" — but `s4p5` ALREADY asks the
     learner to write that same theorem's reason in an accepted wording, two panels
     later. Two typed asks for the same words is the same question twice. So the
     naming slide is a four-option tap: notice it → identify it → write it the way a
     marker accepts it, which is three different skills. Costs no checker call.
  2. **`s5p4`'s split is a tap too, and needed NO new memo row.** Slide A has the
     learner RECOGNISE the IF…THEN swap (with the *inverse* — "if NOT cyclic then NOT
     180°" — as a distractor, because that is the mistake this shape invites and it
     is worth naming). Slide B then asks the original question with the pair restated
     above it. Since the typed question is unchanged, `s5p4`'s mark scheme is
     untouched and did not need re-probing. Cheaper than the plan and still a split.
  3. **N14 IS the fix for `s4p4`, not N15 — the two are not alternatives here.**
     Because slide B no longer asks for a typed name, the old `must_have` line
     "names the semi-circle theorem as the shortcut" had to come out regardless: the
     panel asks what the shorter solution SPOTTED. It now accepts a description, a
     name, OR a derivation, and refuses only a 90° credited to a different theorem or
     never linked to the diameter. Her exact answer — the one that came back `partly`
     and made her ask "..... why is this wrong" — is now a probe, and it passes.
  4. **`s1p4` dropped its yes/no requirement**, because the yes/no is a tap now. A
     learner who already tapped "No" must not be marked down for answering only the
     "why" that the panel actually asks.
  5. **The 1° bound is stated in the copy, not just used.** Rounding two whole-degree
     readings can only ever land 1° from exact double (|2·round(x) − round(2x)| ≤ 1),
     so 96/49 became 97/49 and the note now says outright that rounding can never put
     a row 2° out. That is what makes "a degree off is a reading, 42° off is a
     different claim" a rule the learner can apply rather than a fact to accept.
  6. **`s3p4` said "five measurements" and had to change too.** Found while walking
     the Afrikaans: it hard-coded a count of Station 1's table, which the learner now
     fills in themselves (three to six rows). Same defect as N4, one station over.
     Reworded to need no count. **The general rule: copy must not assert a number it
     cannot know.**
  7. **`.claude/launch.json` now runs `serve.py`, not `python -m http.server`.**
     `serve.py` exists precisely to send no-store headers, and the config was not
     using it — so the pane served STALE ES modules and a rewritten station appeared
     unchanged for several minutes of debugging. Two things follow, both worth
     keeping: the launch config must stay pointed at `serve.py`, and after editing a
     module that the page has already loaded, navigate with **`force: true`** — a
     plain reload or even a new tab shares the HTTP cache and will lie to you.
- 2026-07-30 (**`s2p4` IS NOT TOO STRICT — her open question, now answered by firing
  real answers at it.** This closes the item that had been carried for two sessions.)
  · "Angles subtended by the same chord **at the circumference** are equal" comes
    back `partly`, and the checker is RIGHT: at the circumference but on opposite
    sides of the chord the angles are supplementary, not equal. So "at the
    circumference" is not a sufficient location condition on its own.
  · "…**in the same segment**" is accepted (`got_it`). That single phrase rules out
    both the centre and the opposite segment, which is why it is the one that passes.
  · "on the **same side** of it" alone is refused, as designed — the angle at the
    centre is on that side too, and it is double.
  · So the notes' description of the accept-list was too generous, not the scheme too
    harsh. The N11 scaffolding fix already points the hints and the reveal at "in the
    same segment", which is the wording that satisfies it. **Do not loosen `s2p4`.**
- 2026-07-30 (THE PLAYTHROUGH RULINGS — her calls while walking all six stations. Each
  one is written up in full, with draft copy where it exists, in
  `docs/investigation-station-playthrough-notes.md`; the note numbers are given so the
  two documents can be read together.)
  · **Teach before you ask (the root cause, N-root).** Every panel's explanation must sit
    ABOVE its question. Rule for new panels: a learner who has read everything above the
    question must be able to answer it. Five existing panels break this.
  · **Marks talk STAYS; the exam board goes (N5).** Her exact refinement: "comments about
    where they get their marks, that's fine, because it teaches them in general how to
    approach an investigation… some kids really like those solid points to look for, but
    let's just take out the 'IEB says' stuff." So strip the attribution, keep every
    sentence about where marks are won or lost. DONE and committed.
  · **"Proof" is not a calculation (N13).** She has drilled her class that you prove a
    CLAIM — that something is a tangent, a cyclic quad, a diameter, parallel — and you
    calculate a number. Station 4's calculation panels must stop calling themselves
    proofs ("solution" / "oplossing"). `inv1`/`inv3`/`inv5` already use "proof" only for
    claims, so they are already on her side of the line. Open: whether the station's
    TITLE ("Prove It") changes too — her call, and her lean was body copy first.
  · **A guess is not an answer (N7).** Where a panel asks a learner to commit to a
    conclusion they have no way to investigate yet, every option is accepted and the next
    panel reveals. DONE for `inv3` p1; the `predict` type now exists for reuse.
  · **`needs` lists are the SHAPE of the answer, never its content (N10).** Written from
    the panel's mark scheme with the answers removed. DONE for all nine typed panels.
  · **Split the two-part typed panels (N15), and note it SUPERSEDES the `s4p4` scheme
    loosening (N14).** `s4p4` → "what did it spot?" then "name the theorem"; `s1p4` →
    a Yes/No TAP (no checker call at all) then the reason. Do NOT split `s2p4` or `s6p4`:
    assembling one precise sentence / one closing paragraph IS the skill there. Cost is
    not a constraint — she loaded $10 of API credit; the 20-per-hour cap is a per-learner
    rate limit, not a spend limit.
  · **The app records the learner's OWN readings (N1).** Station 1's table stops being
    narration the learner never wrote. This is the biggest single build item left.
  · **Rain and the sprinkler (N17).** "If it is raining, the ground is wet" is true; turn
    it around and it is false — someone's sprinkler. Goes in `inv5` panel 1 right after
    "this one happens to be true, which is lucky", with a callback in `s5p4`. Her words:
    "it will help them understand." Draft copy in both languages is in the notes.
  · **Explain "conjecture" as a HUNCH, on its own slide, before anything is asked (N21).**
    "it's a big word for a 17 year old to hear." Lead with the familiar word and let the
    technical one attach to it. Note the languages are not equally hard here: Afrikaans
    *vermoede* already IS "hunch", so the English copy carries the whole burden.
  · **A panel that refers back to another station must carry what it refers to (N20).**
    This deliberately REVERSES the Chunk A decision that `s6p4` needs no diagram ("it
    asks for a write-up, not a reading of a figure") — true, but it asks for a conclusion
    ABOUT an investigation played days earlier. Show Station 2's figure with the angles
    marked but UNLABELLED, so the setup is restored without handing over the conjecture.
  · **Option order and length are giving the answers away (N18) — measured, not guessed.**
    The correct option is FIRST in 12 of 12 panels on the line, and also the longest in 7
    of them; `js/discover.js` has the same flaw in 7 of 7 of its choice panels. `game.js`
    shuffles and the 43 graded rounds are fine. Fix = shuffle in `investigate.js` and
    `discover.js` with a `keepOrder` opt-out for sequences ("Step 1/2/3/None of them"),
    PLUS levelling the lengths — and on `inv6` p1/p2 that means padding the distractors,
    not shortening the right answer, because there completeness is the point.
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
- 💻 20 min **[blocking]**: open the dev server with `?local=1` → play the ten
  proof rounds (map, after round 43) → say "ship it" or list fixes. Class is
  tomorrow; tonight + early morning is the window.
- 💻 1 min **[blocking]**: say yes/no to the one-line mini-diagram CSS fix
  (section above) — yes makes small figures stack full-width on phones.
- 🌐 1 min **[whenever]**: open megzieberr.github.io/circle-geo-quest in a fresh tab —
  the train strip should be GONE from the home screen. (GitHub was mid-outage at push
  time, so the deploy queued; if the train is still there, the queue just hasn't
  cleared — check again later, nothing to fix.)

(2026-08-06: the "double-tap a station's Continue on live" check is moot — the station
is hidden now. 2026-08-02: phase20.sql was applied to live via MCP and verified
in-session — nothing to run. 2026-08-01: the 📣 Station-reminder push went out
server-side, 7/7 learners, button removed; the banner covered the rest of the class
until Sunday.)

## Pending archive (all DONE — history only, moved here 2026-08-02 so the pending sweep stays clean)

- (2026-07-31: Station 4's "Prove It" title and inv6 p2's protractor wording
  both closed, her call — leave as is.)

(Done 2026-07-30, and it was the one carried for two sessions: **`s2p4` is not too
strict** — see the Decisions entry. Do not loosen it.)

(Done 2026-07-30 — the old `s2p4` strictness question is probably ANSWERED, not open: its
own hints and reveal text were teaching "on the same side of the chord", the one location
wording the mark scheme refuses. The coaching was wrong, not the strictness. Fixed and
committed; re-test with a real answer next session before touching `must_have`.)

(EXPIRED 2026-07-31 — "**Do NOT push** until the train is finished", Megan's call
2026-07-30. The Investigation Station train finished, was audited and pushed; normal
shipping applies again.)

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
**NOTHING IS OWED. Chunk D is complete, audited (2026-07-31 fresh-eyes sweep,
`QA-SWEEP.md`), and everything is pushed and live** — the working tree is clean and
`main` matches `origin/main` at `4061af8`. The Investigation Station is done as
briefed, and as of 2026-08-02 it saves once per play.

**The open question is engagement, not the app.** 9 of 21 learners have opened the
Station; 5 of the 12 who haven't have not opened the app AT ALL since 19–27 Jul. Megan
has already sent five reminders and reminds them every class, so more reminders are not
the lever. If she wants to pick this up, the useful next step is working out whether
those five stopped for a reason that shows in the data (all mid-round? all after a
specific round? all on one device type?) rather than pushing harder. Her call entirely —
do not start this unprompted.

Open threads, none urgent, whenever she raises them:
  · the brief's "Also open" pair — the marking cap (now 40; Chunk D added only 1
    typed panel against the budgeted 1-2) and whether to revisit the on-screen-tick
    XP decision;
  · ~~the choice-panel hint-rung-2 observation~~ RESOLVED same day (`b6721ba`, live):
    on Investigation Station tap panels every wrong tap now advances the ladder a
    rung, so both hints land while a real choice remains. **Her ruling: the 11
    discovery rounds keep the old ladder — leave `js/discover.js` alone.**
  · Station 4's "Prove It" title (her call: body copy first, see Pending).

In order:
  1. ~~XP per panel~~ **DONE 2026-07-30**, and the sequencing held: it landed while
     `progress` and `xp_events` are still at 0 rows, so nobody is stuck on an old
     amount.
  2. **One theorem per session.** ~~Two tangents from a point~~ **DONE 2026-07-30**
     (3 panels, all taps). ~~Equal chords~~ **DONE 2026-07-31** (3 panels, all
     taps — Station 3's counterexample plus Station 1's drag-and-record; see
     `docs/chunk-d-practice-panels.md`'s checklist for the full write-up). Next,
     in the brief's order: **tangent-radius** → Station 5 (its true, useful
     converse) and Station 4 (used where the line is not a tangent). Then
     tan-chord last.
  3. **She reads it**, flip `CONFIG.stationsLive` to true, then **`/ship`**.

**Worth deciding before the next session:** the two-tangents panels are still
figures. If she wants Station 1's version to be a real drag-and-record — which is
what §2 of the brief originally pictured — that is a new `MODEL()` in
`interactive.js` and a session's work on its own, and it cannot be verified in the
preview pane (no dragging there), so it would need her eyes on a real browser.

**THE LINE IS HIDDEN FROM LEARNERS (`CONFIG.stationsLive: false`, her call
2026-07-30).** No train strip, and the `stations` / `investigate` routes bounce home,
so a guessed URL cannot reach it. `?stations=1` walks it anyway. Two things follow:
**the rest of the app is now safe to push at any time** (Chunk C also fixed two live
discovery rounds, which no longer have to wait for the station), and **flipping the
flag is the release** — do that with the last Chunk D tick, not before.

(Done 2026-07-30: the `ZZ Toets` row is deleted — cascade took its progress,
xp_events, events and checker_calls; the 21 real learners were untouched.)

**Still not built, and deliberately so:**
  · **N8 — the rotating-line interactive for "Break It".** Her call on 2026-07-30 was
    static figures only for Station 3. So `inv3` still opens on a tap rather than a
    drag, and it is the one station whose name promises something to break. The design
    is written up in the notes: put the DIAMETER up and let the learner rotate a line
    through O — every position bisects AB, because the chord's midpoint IS O, and only
    one position is perpendicular. `discover-line-centre.js`'s model cannot be reused
    (its chord is fixed off-centre so it can never reach the diameter case), but a line
    rotating through O is simpler than anything already shipped.
  · **N7's fuller version** — a predict panel remembering which option was tapped so a
    later panel can open with "you were right". The cheap version shipped; this needs
    cross-panel state, which the new per-run `scratch` now makes easy.

**Before touching a mark scheme again:** `node tools/probe-checker.mjs <panelId>` now
takes panel ids, so a targeted re-run after one memo edit costs 5-6 calls instead of
spending the 20-per-hour cap on panels that did not change. A memo is a prompt and
cannot be eyeball-checked — that is how the `s4p4` unfairness survived a whole session.

**THE PUSH STAYS DEFERRED until she has read Chunk C.** Everything the earlier deferral
was protecting against is fixed, so this is now just her review gate, not a defect gate.

---
(Historical, kept for the trail) **Megan is doing this over SEVERAL SESSIONS (her call,
2026-07-30) — no rush, and no need to finish a chunk in one sitting.** The two original
chunks, both now done:

- **CHUNK A — Stations 1, 3, 5, 6. ✅ DONE 2026-07-30.** All six stations exist,
  memo rows are live, verify is green, both languages walked offline, marking probed
  22/22 against the live checker, and Megan has played all six in teacher preview
  ("they look very cute, had me thinking as well"). Committed at `bbafc96`, not
  pushed by her instruction. No loose ends.
- **CHUNK B — the train. ✅ DONE 2026-07-30, committed at `27e71bf`.** Home strip +
  the six-stop map screen + all four design rulings (rank ladder, badge counter,
  train-only entry, Pi untouched). Shown to her before committing; her words: "omw,
  that's soooo cute, yes, I love it". Then she played the whole line, which is where
  Chunk C came from.

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
