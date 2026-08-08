# Circle Quest — Fable full-scale audit, 2026-08-06 (overnight, report-only)

Scope: everything tracked in this repo, read-only. All four of the repo's own checkers were
re-run tonight and are green: **verify-node 424 diagrams / 772 angles / 0 mismatches**,
audit-options clean (no positional or length tell), check-bilingual clean, check-table-summary
clean. Working tree clean, nothing unpushed (`origin/main` = local `main` at `1704433`).
GitHub was down tonight, so nothing was fetched — this is an audit of what is on disk,
which is exactly what is deployed.

The headline: **this app is in genuinely good shape.** No learner-facing correctness bug was
found, no learner name is anywhere in the repo, and every one of the known data-integrity
rules is still honoured in the code. The findings below are ranked worst-first, and the worst
one is a shared-computer privacy leak, not a live-data danger.

---

## Finding 1 — a logged-out learner's password can stay behind on the device
**Severity: privacy, low-to-medium (shared computers only). Files:**
`js/sync.js` lines 34–38 (`enqueue` stores `{name, password, roundId, payload}` in
localStorage under `cgg.pendingSubmits`) and `js/session.js` lines 21–24 / `js/app.js`
line 94 (logout clears only `cgg.session`).

**What's wrong.** When a round submit can't reach the server, the retry queue saves the
whole submit — including the learner's password — to localStorage so it can be replayed
later. That's the right design for the dropped-save fix. But logging out only removes the
session key; the pending-submit queue is left behind. The session file's own comment accepts
password-in-localStorage *for the logged-in learner on their own device* — a queue entry
surviving logout goes one step beyond that acceptance.

**Failure scenario.** A learner plays on a shared computer (school lab, sibling's laptop),
the connection blips so a submit queues, they log out and walk away. The next person at that
machine can open devtools → Application → localStorage and read the first learner's
username and password in plain text.

**Suggested fix (described, not applied).** On logout: try one `flushPendingSubmits()` and
then, whatever happens, delete `cgg.pendingSubmits`. Or store queue entries without the
password and attach the *current* session's credentials at flush time (which also naturally
stops one learner's queue flushing under another's login). Small either way. The trade-off to
decide: clearing an unflushed queue at logout throws away that unsaved pass — flushing first
covers almost every real case.

## Finding 2 — the retired "override" branch in check-answer is a tiny open back door
**Severity: security, low (and currently moot). File:**
`supabase/functions/check-answer/index.ts` lines 190–203.

**What's wrong.** The old "I think my answer was right" path was retired on the client on
2026-07-30, but the server branch remains: any authenticated learner who POSTs
`override: true` gets back `verdict: "got_it"` with nothing actually marked. The stated
reason to keep it — "older cached clients" — doesn't really hold here, because this app's
service worker deliberately caches no code at all (sw.js header), so there are no old
cached clients to protect.

**Failure scenario.** A devtools-savvy learner scripts a call with `override: true` and shows
themselves a green "got it" on a typed panel. It affects only what they see — station XP is
paid per completion, not per verdict — so nothing in the database or the leaderboard can be
gamed with it. And right now `stationsLive` is false, so no typed panel is reachable in the
UI anyway.

**Suggested fix.** Next time this function is touched for any reason, delete the override
branch. Not worth its own deploy.

## Finding 3 — "I don't get it" taps are uncapped inserts
**Severity: security/robustness, low — a documented design choice, flagged for the record.
File:** `supabase/functions/check-answer/index.ts` lines 175–183.

**What's wrong (or rather, what to know).** The `stuck` path inserts into `checker_calls`
with no cap, deliberately — asking for a hint must never be rationed, and it costs no API
money. The flip side: a scripted client could insert unlimited rows and bloat the table (and
the admin "I don't get it" panel reads it). No cost, no data risk, just noise.

**Suggested fix, only if it ever bites.** A generous server-side ceiling (say 200 stuck rows
per learner per day) preserves the never-rationed promise for every real human while stopping
a script. Nothing to do today.

## Finding 4 — retried submits have no idempotency key
**Severity: data integrity, low. Files:** `js/sync.js` lines 45–55, `supabase/phase20.sql`.

**What's wrong.** `submitRoundReliable` retries up to 3 times. If the server *committed* a
submit but the response was lost (timeout on a bad connection), the retry sends the same
submit again and the server records it twice: `attempts + 1` and a duplicate `xp_events`
row. Related: phase20's own header notes that on a *first* play no progress row exists yet,
so `for update` locks nothing — two truly simultaneous first-play submits could each insert
an xp_events row. The client's disable-before-await guards make that near-impossible in
practice, and the paid-replays cap bounds what a replay race could ever pay.

**Failure scenario.** A learner on flaky mobile data passes a round; the response times out;
the retry lands; the admin panel shows 2 attempts and double XP for one clean play — a
small-scale echo of the station double-save from 2026-08-02, though far rarer because the
retry loop (not the learner's thumb) is the only trigger.

**Suggested fix, only if it ever shows in the data.** A client-generated submit id passed to
`cgg_submit_round`, with a unique index on (student_id, round_id, submit_id) — a retry then
becomes a no-op server-side. Given the guards already in place, this is a "watch for it in
the admin timeline" item, not a build item.

## Finding 5 — README.md describes the app of three months ago
**Severity: stale docs, cosmetic but worth a pass. File:** `README.md`.

**What's wrong.** The README says "the 12 rounds" (there are 43 main rounds plus 6 hidden
stations), lists migrations as "phase2.sql … phase6.sql" (they run to phase20), and never
mentions the Investigation Station, the check-answer edge function, Boost mode, replays,
streaks, or Fix Mistakes. Anyone landing on the public repo — including a future session
told to "read the README first" — gets a wrong picture. `PUSH-SETUP.md` also still walks
through pasting the edge function into the Supabase dashboard by hand, which the 2026-07-30
session proved unnecessary (MCP deploys it directly); the manual route still *works*, so
this is secondary.

**Suggested fix.** A 20-minute README refresh next time the repo is open: round count,
migration range, one paragraph on the (currently hidden) Investigation Station, one on the
Daily Challenge/streak/replay economy.

## Finding 6 — dead code: the expired station-reminder banner
**Severity: polish. File:** `js/announce.js` lines 22–51.

`maybeShowStationReminder` hard-expired at 2026-08-03 00:00 SA and can never show again.
It is fully self-disarming (checked: the expiry gate is the first thing that runs), so this
is safe, silent dead weight — delete whenever convenient. The four excluded ids are opaque
UUIDs, exactly as the comment promises; no name risk.

---

## What was checked and found CLEAN (the important half of an audit)

- **Correctness.** All four checkers green (numbers above). Hand-spot-checks: round 7
  (cyclic quad) — all ten questions' values, options and memo arithmetic correct; the newest
  Chunk D geometry (`TANCHORD_ERR_FIG`, T at 270°, A at 38°, Q at 350°) re-derived by hand —
  tangent-chord angle 64° = half the 128° arc, ∠TQA = 116° = half the 232° arc. Exact.
- **No learner names anywhere.** `supabase/admin-and-seed.sql` seeds only "Learner One…Five"
  with an explicit public-repo warning; a name-pattern sweep over every tracked .md/.js/.sql
  found nothing; the reminder exclusions are UUIDs only.
- **No secrets.** Only the public VAPID key (`js/push-config.js` — safe by design) and the
  Supabase publishable key (`js/supabase-config.js` — RLS-locked, safe by design). Admin
  password lives bcrypt-hashed server-side; the client never holds a service-role key.
  `netlify.toml` even 404s the `/supabase/*` folder on that deploy path.
- **XSS.** Every place learner-typed or learner-named content is rendered was traced:
  admin stuck-panel typed text (`js/admin.js` line 749), survey comments (line 556),
  timeline names, leaderboard names/nicknames (`js/leaderboard.js` line 55) — all go through
  an escape helper. Nicknames are additionally validated server-side (phase14 allow-list for
  avatars).
- **The four known data-integrity rules, re-verified in code:**
  1. *Dropped-save gap* — `js/sync.js` retry + queue, and `js/game.js` line 524 passes
     `saved:false` through so results can't let a learner skip an unsaved round.
  2. *Double-submit* — disable-before-await plus a `spent` flag in `js/investigate.js`
     (306–310) and `js/discover.js` (135–139); `js/game.js` 497; `js/daily.js` 246;
     survey and profile disable too; `js/adventure.js` uses a `locked` flag before its
     awaits on all three submit paths. All present.
  3. *Paid replays* — `progress.paid_replays` is a column, never a count of xp_events
     (phase18 lines 53–99), read under `for update` (phase20 line 73), and the results
     screen shows the server's `xpAwarded` (game.js 517–519).
  4. *checker_calls read-only* — phase17 contains no INSERT/UPDATE/DELETE; the admin panel
     only reads.
- **Service worker / PWA.** `sw.js` deliberately caches nothing (comment block, lines 6–9),
  so there is no cache version to bump and no stale-code risk from the SW — push and
  installability only. Consistent with how the app actually updates (every push redeploys).
- **stationsLive gating.** Confirmed in `js/stations.js` line 86 (`?stations=1` override),
  `js/app.js` route bounce, `js/game.js` — matches the status file's description exactly.

## In short
Nothing is broken and nothing dangerous was found. The one real fix worth doing: clear the
pending-submit queue at logout, because right now a learner's password can be left readable
on a shared computer. After that it's tidy-ups — delete the retired override branch and the
expired banner, and refresh the very stale README.
