# Prompt for the next Circle Quest session (the "I don't get it" dashboard panel)

Paste everything between the lines into a fresh session.

*(Written 2026-07-30, end of the Chunk D session, after the Investigation Station
went live. The previous Chunk D prompt is done and has been replaced.)*

---

Circle Quest. I want to SEE the "I don't get it" flags in my admin dashboard.

The app logs every tap already, but there is no screen for it — so the only way I
can read them is to ask Claude to run a query, which is no use to me on a Sunday
morning before class. Build me a panel.

Read `PROJECT-STATUS.md` first — "Where we are" and the 2026-07-30 Decisions,
especially the two about the override link and the `s1p4` mark scheme. The reason
this data exists at all is in there.

## What the data is

`public.checker_calls` — one row per typed-answer event:

| column | notes |
|---|---|
| `student_id` | uuid → `students.id` |
| `panel_id` | `s1p4` `s2p4` `s2p5` `s3p4` `s4p4` `s4p5` `s5p4` `s6p3` `s6p4` — the nine typed panels |
| `verdict` | `got_it` · `partly` · `not_yet` · `unclear` · **`stuck`** · `override` · `error` · `nomemo` · `nokey` · NULL |
| `answer` | what the learner had typed at that moment |
| `created_at` | |

**`verdict = 'stuck'` is the new one** — a tap on "I don't get it". One row per tap,
and `answer` is prefixed `[stuck:1]` / `[stuck:2]` / `[stuck:3]` for the rung they
reached (1 = first hint, 3 = they asked to be shown a good answer). An **empty**
answer after that prefix is the loudest signal in the table: it means they could
not even start.

`override` rows are historical — that link was retired on 2026-07-30. Do not build
the panel around them.

## What I actually need to see

Layout is your call, but this is what I need on a Sunday morning:

- **By panel, most-stuck first**: how many learners got stuck, how many taps, and
  how many went all the way to rung 3. A panel lots of people tap *with nothing
  typed* is a panel that is not asking clearly enough — that is exactly what
  `s3p4` was doing to me, and catching that is the whole point.
- **By learner**, so I know who to sit next to.
- **The text they had typed**, because that is where I see the misconception.
- Ideally beside the marking verdicts for the same panel, so I can tell a *hard*
  question apart from a *badly worded* one.

## The four touch points — copy `cgg_admin_timeline` (phase15), it is the model

A new admin panel is **four** edits, and a fresh session always forgets the third:

1. **`supabase/phase17.sql`** (next free number) — a `cgg_admin_*` function.
   Follow phase15's shape exactly, including the `_cgg_admin_ok` auth check and the
   grant convention:
   ```sql
   revoke all on function public.cgg_admin_x(...) from public, anon, authenticated;
   grant execute on function public.cgg_admin_x(...) to anon, authenticated;
   ```
   ⚠️ `revoke ... from anon, authenticated` alone leaves a function callable —
   functions are granted to PUBLIC by default, so `public` must be in the revoke.
2. **`js/supabase.js`** — the real backend method (see `adminTimeline`, ~line 83).
3. **`js/api.js`** — BOTH stubs: `LocalBackend` (~line 466) and, easily missed,
   **`PreviewBackend` (~line 698)**, which must return `{ok:true, rows:[]}` so the
   dashboard does not break in teacher preview.
4. **`js/admin.js`** (789 lines) — the panel itself. `timelineAll` / `timelineOne`
   (lines ~22-27 and ~320-390) show how a panel loads once, opens per learner, and
   refreshes itself on a timer.

Apply the migration with the Supabase MCP (`apply_migration`) — this project is on
that account, so there is no dashboard step.

## Things that will bite

- ⚠️ **`checker_calls` is both the log AND the meter.** `cgg_checker_claim` counts
  rows in it to enforce the 20-marked-answers-per-hour cap. On 2026-07-30 the new
  `stuck` rows would have quietly eaten the marking budget until the counter was
  taught to skip them. **Anything you add to that table, check against that query.**
- **`answer` is learner-authored text and this repo is PUBLIC.** No real answers in
  any tracked file, no learner names in source, ever. There is a purge date for
  that column noted at the top of `phase16.sql`.
- The dashboard already shows real names, which is fine — it sits behind the admin
  password. Just never let any of it reach the repo.
- `sw.js` caches nothing in this app, so there is no cache version to bump.
- If edits stop showing up in the preview pane, read the stale-modules note in §4
  of `docs/chunk-d-practice-panels.md` before debugging anything else.

## Before you call it done

```bash
node tools/verify-node.mjs
node tools/audit-options.mjs
node tools/check-bilingual.mjs
node tools/check-table-summary.mjs
```

Then open `admin.html` against real data and check it reads properly. **Do not push
without my word.**

---

## Also open, but not part of this job

- **The marking cap, and this one is time-sensitive.** Each learner gets 20 marked
  answers per hour. In a two-hour lesson, a learner who takes several goes at the
  nine typed panels can reach it — and when they do, the panel silently falls back
  to static hints and says *"Not quite — try again"* on a correct answer. Raising
  the default in `cgg_checker_claim` (or passing `p_cap` from the edge function) is
  one number and costs cents. I was asked on 2026-07-30 and had not decided.
- **Chunk D's three remaining theorems**, in order: equal chords → tangent-radius →
  tan-chord. Brief and rules in `docs/chunk-d-practice-panels.md`.
  ⚠️ The line is LIVE now, so a station that gains a panel starts paying more XP —
  but learners who already finished that station keep the old total, because a
  replay pays 0. Decide per theorem: add to stations they have not reached yet, or
  accept the gap.
