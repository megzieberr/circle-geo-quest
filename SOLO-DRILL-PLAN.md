# Solo Daily Drill — build plan (written 2026-09-12, approved as a plan only, NOT built)

A tiny standalone page for **one private Gr12 IEB rewrite learner (K.)**: a daily
circle-geometry drill on his phone. No account, no Supabase, no leaderboard —
everything saves in his browser's localStorage. Megan's framing: *"the finger of
Circle Quest"* — copy what we need from the big app, nothing new invented.

⚠️ Public repo rule applies to THIS file and the build: **no learner names
anywhere** ([[circle-geo-quest-hosting]]). Initials are fine.

---

## The head start: the app already HAS this feature

`js/daily.js` is already a daily drill: 10 exam-style riders per local day,
fixed draw (no re-rolling), a day-streak, and wrong answers dropping into the
Fix-My-Mistakes pile. So this build is **subtraction, not construction**:

- `js/mistakes.js` — already localStorage-only, zero server calls, and its
  storage key already falls back to `"anon"` with no login. Import UNTOUCHED.
- `js/rounds/daily-riders.js` + `daily-extra.js` via `js/rounds/index.js`
  (`DAILY_RIDERS`, `DAILY_RIDERS_MULTI`, `DAILY_RIDERS_SINGLE`) — the verified
  question bank, diagrams to scale with hand-set label radii. UNTOUCHED.
- `js/questions.js` (mountQuestion), `js/engine.js`, `js/ui.js`, `js/i18n.js`,
  `js/why.js`, `js/sound.js`, `css/` — the rendering core. UNTOUCHED.
- The **`num-reason` single-step riders mark ½ angle + ½ reason** — that is the
  reason-drilling this exists for. The multi-step `num` riders reveal the full
  statement-and-reason chain afterwards. Both formats stay.

The ONLY file with server wiring in this dependency set is `daily.js` itself
(`api.js`, `session.js`, `config.js`, server streak). That's the one file that
gets a solo twin.

## What gets built (2 new files, nothing else touched)

1. **`drill.html`** — standalone entry page, phone-first, same look as the app
   (reuse the existing css). Home screen = today's streak + one big "Start
   today's drill" button + a "Fix my mistakes (n)" button. No router, no home
   card in the main app, no service-worker involvement (the app caches nothing
   anyway). Neutral filename on purpose — it carries no learner identity.
2. **`js/solo-drill.js`** — `daily.js` rewritten for solo use:
   - Same draw logic: fixed set per LOCAL day, seeded by the date, no re-rolls.
   - Draw from the WHOLE riders bank (no progress gating — K. has covered the
     theorems in lessons; there is no quest progress to gate on).
   - Wrong answer → `addMistake()` (the existing pile, `anon` key).
   - **Streak computed locally** from a small history object
     `cgg.solo.history = { "2026-09-12": {done, score}, ... }` in localStorage.
     Known trade-off, named to Megan: the big app moved streaks server-side
     because localStorage dies with cleared browser data / a new phone. With
     no Supabase that risk is accepted; the history object doubles as the
     record she can ask him to screenshot.
   - NO imports of `api.js`, `session.js`, `supabase*.js`, `config.js`,
     `push.js`, `leaderboard.js`, `celebrate.js` (or a celebrate call kept only
     if it has no server path — check, don't assume).
   - Language: EN fixed (K. is English-only, standing ruling in his tutoring folder);
     the AF strings stay in the bank, the toggle just isn't shown.

## Decisions for Megan (defaults proposed, one line each)

- **Questions per day:** app default is 10 (5 multi + 5 single-reason). For a
  5-minute phone drill, propose **5 (2 multi + 3 single-reason)** — reasons are
  the target. Her call.
- **Getting it on his phone:** plain URL + Add-to-Home-Screen bookmark
  (proposed), or a minimal second manifest for a proper icon. The main
  manifest's start_url must NOT be touched.
- **XP/sounds/confetti:** propose keep sounds, drop XP entirely (no economy to
  protect, and no server to hold it).

## Verification before handover (the /verify-done gate)

- A `verify-drill.html` in the pattern of the existing `verify-daily.html`:
  headless check that a day's draw is stable, marks split correctly on
  `num-reason`, and the mistakes pile round-trips.
- Grep-proof **zero network**: no fetch/supabase/api import reachable from
  `drill.html`'s module graph, and the Network tab silent on a full drill.
- Render at PHONE WIDTH and play a full round as a learner would — green data
  checks are not a teachable round (standing rule). Diagram labels: LOOK at
  them, measuring misses labels ([[circle-quest-diagram-labels]]).
- Repeated questions across days are a FEATURE (spaced repetition), never a
  bug to fix ([[repeat-questions-on-struggle-points]]).

## Build notes

- One worker session, Opus, roughly an hour or two — it's mostly deleting
  wiring and writing one small controller + page. Not a Sonnet job: the trim
  decisions touch learner-facing behaviour.
- Test locally with `serve.py` (ES modules won't load off file://). `?local=1`
  is irrelevant here — there is no live config to hit — but NOTHING in this
  build may import the live config either.
- Deploys with the normal push to GitHub Pages; it's just a new static page in
  the same repo, so it inherits every future fix to the bank and engine
  automatically — that is the point of the finger staying attached to the hand.
