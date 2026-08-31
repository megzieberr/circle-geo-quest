# Project status — updated 2026-08-14 — 🧲 DYNAMIC GEO DAY 1: dg0–dg3 BUILT + FOREMAN-REVIEWED, LOCAL ONLY

> 📓 The full session-by-session diary (every build log, verification table and
> ruling with its full reasoning, back to July) lives in **PROJECT-HISTORY.md**
> — local only, gitignored. This file holds only the current state. New
> sessions append their full write-up to the history file at wrap-up, and
> update the four sections here in place.
> *(Split done 2026-08-31 — the old single file had reached 181 KB / 2 486
> lines and was burning the catch-up budget it existed to save.)*

## Where we are

Foreman build day (Fable foreman, two Sonnet build sessions she authorized in
chat). **Arcs 1+2 of DYNAMIC-GEO-PLAN.md are BUILT and foreman-reviewed: dg0
"Watch it move", dg1 "Freeze it", dg2 "The unroll" (her centrepiece —
length-preserving morph, measured 148.42–148.44px against 148.44 expected at
five scrub positions), dg3 "Her method drill".** New group g8 with its own home
card (Proofs pattern), kind "dynamic" through renderInvestigate(), engine
additions all additive: condition-lock drag (capstone mechanism, demo only),
live derived readouts, play/glide + scrubbable slider, noCircle/paths/onT for
the unroll. **7 local commits ahead of origin, NOTHING pushed, no migrations,
no sw.js.** All four checkers green at close: 513 diagrams / 985 angles /
0 mismatches. Her playtest of the extracted figures already landed 3 fixes
(C label radial, E's "?" pinned, demo double-Y) — committed. Diagram sheets on
her Desktop: `dyngeo-session1-diagrams.html` + `dyngeo-session2-diagrams.html`.

## Decisions (dated one-liners — full reasoning for each is in PROJECT-HISTORY.md under its date)

**Current build (dynamic geo):**
- **2026-08-14** — arcs 1+2 first, own home card, sandbox panels YES; group g8 hidden from the badge ladder like g7.
- **2026-08-14** — draggable-point letters sit radially OUTWARD from the centre; fixed offsets are banned for points that travel (dg0 dots comment = the pattern).
- **2026-08-14** — NEW rounds use her AF drag verbs (Trek / Skuif / Klik op). ⚠️ EXISTING rounds still say "Sleep"/"tik" — sweep-or-leave is an OPEN ruling, hers.
- **2026-08-14** — prompt 3 (arcs 3+4, in `DYNGEO-SESSION-PROMPTS.md`) is GATED on her playthrough of dg0–dg3. Do not dispatch before her review.

**Standing rulings (hers unless marked):**
- **2026-08-13** — proofs progress lives on the main learner table (🔗 N/11 chip row); the timeline's own strip stays as a secondary copy.
- **2026-08-12** — dashboard panels are switched off with the `SHOW` flag block in `js/admin.js`, never deleted. Any "hide this panel" request goes there.
- **2026-08-12** — pr5's chord BD stays: *"leave that one, it has a purpose."* Do not re-flag in future sweeps.
- **2026-08-12** — the diagram states VALUES, the prose names ANGLES (bare `90−x` on wedges, no "T₁ =" prefix; same rule as pr5's `180−x`).
- **2026-08-12** — the bowtie rescue is a conditional inline `panel.scaffold` (appears on a wrong answer), NOT a conditional panel — keeps the counter and XP honest.
- **2026-08-12** — `d.key` value keys are SYMBOL-ONLY and untranslated (same as `solution.lines[].st`); lines left-aligned as a list.
- **2026-08-12** — label QA: text-vs-text, text-vs-point-dot, clipping and key alignment probes are reliable; arc-vs-label is NOT — rendering and LOOKING is not optional. `await document.fonts.ready` before measuring.
- **2026-08-11** — T1 proof uses SSS vs her notes' SAS: *"SSS is fine, not set in stone."* Accepted app-vs-notes difference; don't re-flag.
- **2026-08-06** — Investigation Station is HIDDEN, not retired (`stationsLive:false`): *"we will need it again for the grade 11 learners of next year."* Return = flag `true` + fresh `ANTHROPIC_API_KEY` in Supabase secrets. Never clean up its code/SQL.
- **2026-08-02** — the inflated inv4 row keeps its XP (her call — clawing it back punishes a learner who did nothing wrong).
- **2026-08-02** — any button firing an async submit: disable BEFORE the await + a `spent` flag; any counter read-then-write in an RPC gets `for update`.
- **2026-08-01** — station-reminder button retired (*"I don't need that button"*). A browser-called edge function needs the CORS block AND a from-the-browser test.
- **2026-07-31** — Station choice panels advance the hint ladder on every wrong tap; the 11 discovery rounds keep the OLD 3-miss ladder — `js/discover.js` stays frozen (*"leave the discovery rounds please"*). Do not mirror.
- **2026-07-31** — appending panels to a station: FIRST search its copy for "Last one"/"Laaste een". Error-spot distractors are TRUE-but-unused lines, never false statements.
- **2026-07-30** — "I don't get it" replaced the override link; an escape hatch must never speak in the voice of a mark. `checker_calls` is both log and meter — anything new written there must be checked against the cap query.
- **2026-07-30** — `must_have` IS the mark scheme, the memo is background only; alternatives written as EITHER/OR (never a lettered list); accept-any-one schemes need a probe per route PER LANGUAGE (`tools/probe-checker.mjs` after ANY memo edit).
- **2026-07-30** — `s2p4` deliberately requires the location condition ("in the same segment"). Do not loosen.
- **2026-07-30** — station/proof XP is per panel and NEVER scaled by attempts or correctness — struggle is the product.
- **2026-07-30** — proof rounds sit in `ORDER` after `r21` and before `inv1` — LOAD-BEARING (unlock chain). The end-of-quest survey is pinned to `FINAL_QUEST_ROUND_ID = "r21"`. Don't "tidy" either.
- **2026-07-30** — the Preview MCP reads the GLOBAL `C:\Users\megzi\.claude\.claude\launch.json`; this project's own launch.json is decorative. Stale-module symptoms = the tab's ES-module registry, fix = a brand-new tab.
- **2026-07-30** — reason bank follows IEB Appendix G in BOTH languages (SHS/HHS etc.); quoted write-this reasons follow the appendix, flowing prose keeps natural language.
- **2026-07-23** — the Daily Challenge is typed and hard for everyone; split marking (½ angle + ½ reason) on single-step.
- **2026-07-20** — a stuck learner's ATTEMPT TRAJECTORY, not best score, decides intervention (rising = leave alone). The Daily is recall, never evidence of reasoning ability.
- **2026-07-19** — `sw.js` caches NOTHING in this app — no cache bump exists here. Pi is pure amusement (setInterval not rAF; recolour = rerun the slicer, never Canva).
- **2026-07-18** — nickname moderation = teacher authority (no profanity blocklists — Scunthorpe/AF false positives); anti-cheat = DETECTION not prevention.
- **2026-07-13/18** — PUBLIC REPO: no learner names or learner-identifiable data, ever (repo was deleted+recreated once to purge a name; initials are fine). Check dispatch PRs before merging.

**Engine options (all additive, all opt-in):** `o.reflex` reflex-angle marks · `d.key` colour-matched value key · `o.rot` slide a label along its arc · `panel.scaffold` wrong-answer rescue figure · `noCircle`/`pts` free points · `solution` statement/reason blocks · readings table + `scratch` + function prompts · `onRelease` drag hook. Details per option in the history file.

## 📌 Pending on Megan
- 💻 10 min **[blocking]**: play dg0–dg3 (local: `localhost:5180/?local=1&preview=1`, or wait for a ship). This gates prompt 3.
- 📱 1 min [whenever]: rule on the dg3 name — "Her method drill" reads oddly to a learner; options: "Juffrou se metode" or "Die drie-stap-metode".
- 🌐 1 min [whenever]: carried from 08-13 — live admin main table: your row and B.M.'s should both read 1/11 with chip 1 green.
- 🎬 [whenever]: the Tripo paper-fold WebP (arc 5's session needs the file path when it exists).
- 💬 [whenever]: ruling — sweep the OLD rounds' "Sleep"/"tik" to Trek/Skuif/Klik op, or leave shipped rounds as they are?

## 🔭 Next up
1. **Her review of dg0–dg3, then Prompt 3** (arcs 3+4: pick-the-diagram, build-it-with-me, which-line-unlocks-it — dg4/dg5/dg6, no new engine). Full prompt in `DYNGEO-SESSION-PROMPTS.md`, marked DO NOT DISPATCH until her review.
2. **Arc 5 (folding)** waits on her Tripo WebP + the fold-reflection engine piece. **Arc 6 (trig bridge)** + the **condition-lock capstone** close the chapter.
3. **Ship** is its own step on her explicit yes — plain push, no migration — after her playthrough. 7 commits are queued locally.
4. Standing hers, unchanged: mini-diagram stacking CSS one-liner, "Proofs"/"Bewyse" card name, pr8 "T₁ = " one-word revert, CQ↔Blipwork bridge plan (separate build day).
