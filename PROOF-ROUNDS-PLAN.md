# Proof Rounds — build plan (written 2026-08-10, planning session with Megan)

**Status: PLANNED, not built.** Build scheduled for 2026-08-11 (foreman day, possibly
overnight with Fable monitoring). Megan reviews the morning of 2026-08-12 and teaches
proofs that day — the margin between morning review and class is the fix window.
Nothing here ships without her explicit go-ahead.

Her source notes: `C:\Users\megzi\Desktop\Circle Geo Proofs.pdf` — 10 scaffolded
worksheet pages (Construction → tool → Conclusion skeleton) + 9 pages of handwritten
cheat notes, one numbered recipe per theorem. **Her ruling: the notes are guidelines,
not law. The TOOLS and CONSTRUCTIONS are fixed; the wording and sequence are not.**

---

## Why the first proof rounds were nuked (never repeat this)

The old rounds asked learners to put pre-written statements and reasons in the
correct order. No discovery, no explanation — memorising with no rhyme or reason.
She hated it. **Nothing in this build may reduce to "order the steps" or "reproduce
the wording".** The skill being drilled is: *given a claim, which construction do I
draw and which tool do I reach for* — plus the common mistakes, practised safely
before they happen in a test.

## Non-negotiables (her rulings, this session)

1. **Guided discovery, never punished guessing.** The discovery round is a
   conversation: probe → guess honoured → construction appears → probe again →
   recap. A wrong guess gets "Good guess — here's a hint", NEVER "wrong, try
   again". The app draws the construction whether the guess was right or wrong.
2. **Everything tapped or dragged. NO typed answers.** "A spelling mistake will
   keep flagging as wrong and that is unfair. This is math, not English." (Also:
   the check-answer marking key is expired — typed marking is dead anyway.)
3. **Options, not tap-the-diagram-points** for "where does the construction go" —
   tapping precise points is unreliable on phones (her ruling).
4. **9 content rounds first, then expand.** She makes a lot of adjustments when
   she playtests — do not build 13 rounds of polish she'll rework. (With the
   intro round the group is 10 rounds total.)
5. **WHY everywhere.** She hates "it's just the way it is". Every rule the class
   has used all chapter has a reason, and these rounds show the machinery. This
   class told her circle geo is their favourite topic BECAUSE they understand it.
6. **Discovery rounds: no spoilers.** Show raw measurements/structure, never
   pre-announce the conclusion (standing rule from the Investigation Station).
7. Bilingual EN/AF as always; public repo — no learner names or identifiable data.

---

## The group

New group appended to the main quest map, after the current 43 rounds. (g6 is the
hidden Investigation Station — follow `config.js` / `rounds/index.js` conventions
for the next group id; read the code before choosing ids.) Ten rounds:

| # | Round | Shape |
|---|-------|-------|
| P0 | Why proofs? | Intro/reminder round |
| P1 | T1 discovery — line from centre & chord | Guided discovery |
| P2 | T1 transfer — variants B/C + traps | Constructions + error-spot |
| P3 | T2 discovery — ∠ at centre = 2× | Guided discovery |
| P4 | T2 transfer — reflex + bowtie | Constructions + error-spot |
| P5 | T3 discovery — cyclic quad opp ∠s | Guided discovery |
| P6 | T3 transfer + the wrong-radii trap | Constructions + error-spot |
| P7 | T4 discovery — tan-chord | Guided discovery |
| P8 | T4 transfer + the wrong-join trap | Constructions + error-spot |
| P9 | Mixed finale — pick your tool | Speed match + legal/illegal |

### P0 — Why proofs? (the bridge from the Investigation Station)

Reminds them of what the Station taught, whether or not they played it:
- We dragged, we measured, we noticed patterns — and none of that PROVED anything.
  A conjecture is "it looks true everywhere we checked". A theorem is "it MUST be
  true, and here's the chain of reasons".
- Why measuring can never be enough: you checked SOME circles, there are
  infinitely many; a protractor has error; "very close to 180°" is not 180°.
- Math has reasons. A theorem is never true because "someone smart said so" —
  every rule they've used all chapter earned its place, and now they get to see
  the machinery.
- Panel ideas: sort statements into conjecture vs theorem; "what would it take to
  turn this conjecture into a theorem?" (options); a measured-vs-proved judge
  panel reusing Station DNA. Keep it short — 4-5 panels, all taps.
- **The wonder moment (her request, 2026-08-10): every triangle is cyclic.** Any
  three points not in a line have exactly ONE circle through them, whether you
  draw it or not — every triangle they have ever drawn had a secret circle
  around it. (Station 3 showed four dots can FAIL to fit a circle; the flip side
  is that three never fail.) Use it as P0's proof-of-why-proofs-matter: dragging
  and measuring makes you FEEL it's true; the perpendicular-bisector reason
  makes it MUST-be-true. That gap is the whole chapter.

### The per-theorem arc (×4)

**Discovery round** (the conversation — P1, P3, P5, P7):
1. Bare figure + the claim. First probe: *"What do you THINK could prove this?"*
   — tool list options (congruent triangles / ∠ at centre = 2× / isosceles
   triangles / exterior angle / Pythagoras / tan-chord…). Use the **`predict`
   panel type** (Chunk C): accepted, never scored, never reaches trajectory
   stats. Wrong pick → "Good guess — here's a hint" and the construction draws.
   Right pick → affirm, construction draws anyway.
2. Keep probing on the augmented figure, one panel per stage, diagrams staged
   exactly like her cheat notes' three-stage figures: *"Now that you see the two
   triangles — what proves them congruent?"* (RHS/SAS/SSS options with the given
   info visible) → *"Which side do they share?"* → *"So what does the congruency
   hand us?"*
3. **Recap panel — the takeaway sentence**, e.g. *"Construct two radii, prove the
   triangles congruent."* One line. This sentence is what they memorise, not the
   proof wording.

**Transfer round** (P2, P4, P6, P8): same proof, different picture. New
orientation, new letters, and the theorem's own case-variants as the transfer
material:
- T1: her cheat-note variants A/B/C (⊥ → bisects; midpoint → ⊥; perp bisector
  passes through centre). Same construction (join the two radii) survives all.
- T2: reflex and bowtie. The punchline: the SAME five steps survive all three
  pictures (diameter through the circumference point → label x, y → isosceles →
  exterior angles → combine).
- T3: cyclic quad relabelled/rotated.
- T4: tangent on the other side of the chord (her notes' case B).

Each transfer round contains, as choice panels:
- **The trap, sprung deliberately.** The tempting wrong option sits right there:
  - T3: "Join OA and OC" (wrong — you need OB and OD, the vertices NOT in the
    angle pair). Falling in gets a gentle correction that shows WHY it dies:
    the angles you built connect to nothing — no arc-pair subtends them.
  - T4: diameter correctly drawn, then "join the wrong points" (must join the
    diameter's far end to the circumference point). Same treatment: experience
    the dead end, then name it.
- **One error-spotting panel**: a learner's flawed construction drawn on the
  figure — *"What mistake did this learner make?"* (Station 4 "Prove It" DNA,
  reused on the main map.)
- **One legal-or-illegal construction panel** (the running thread, below).

### The legal-constructions thread

Her classroom rule, drilled as a recurring thread: **you may JOIN two points that
exist, and you may draw a radius/diameter (centre and point both exist). You may
NOT "construct" a line with a property you haven't proven** — no "construct a
parallel line", no "construct a tangent".

The WHY (this must be taught, not just stated): a legal construction adds a
guaranteed TRUE fact to the diagram — two points always define a line, a centre
and a circumference point always define a radius. "Construct a tangent" smuggles
an unproven CLAIM in through the back door: being a tangent is a property you'd
have to prove first. If the proof leans on a smuggled claim, everything after it
is sand. Her class catchphrase, used in BOTH language versions in English (her ruling
2026-08-10 — "all Afrikaans kids understand English", and it's her real
classroom line): *"When we assume, we make an ass out of u and me."* Keep the
surrounding sentence in the panel's own language; the catchphrase itself stays
English verbatim in both.

### P9 — Mixed finale

- Tool-match speed panels: a claim flashes up ("prove the opposite angles of a
  cyclic quad are supplementary") → tap the engine + construction ("join two
  radii to the other two vertices; ∠ at centre = 2×"). All four theorems
  shuffled, several variants each. This drills the exact reflex she described:
  *claim → tool*, no sequence, no wording.
- A legal/illegal lightning set ("this learner constructed a tangent through P —
  legal move?").

---

## Engine notes (what exists / what's banned)

Exists, use freely: `predict` panels · choice panels with hint ladders ·
per-panel staged diagrams · drags (`interactive.js`) · readings tables ·
bilingual i18n · `verify-node` diagram checking · options shuffle rules
(`options-order.js` — mind `keepOrder`/`pin` where an option list is a sequence).

**Banned this build:** new interaction modes (no tap-the-point mode — her
ruling), typed panels, edge-function work, migrations. Overnight sessions build
with existing capabilities only; anything needing new engine surface gets listed
in the morning report instead of improvised.

**XP — DECIDED (her ruling 2026-08-10): same as the Investigation Station.**
Per panel, 10/panel via the `finish()` pattern (`CONFIG.investigationXpPerPanel`
or a sibling key — do NOT hardcode totals; cards compute from `panels.length`).
Reuse the Station's double-submit guard (disable + `spent` flag before the
await) — it exists because eight duplicate submits once hit one learner's row.

## Build-day checklist (bake into every session prompt)

- [ ] **Survey stays pinned to round 43.** The end-of-quest survey fires on the
      "last main round" — appending a group moves that trigger unless pinned.
      The class already met it; it must not re-fire on P9.
- [ ] Home counter ("N / 43 rounds done"), unlock chain, and continue-card all
      derive from `MAIN_ROUNDS` — verify they read 53 and unlock correctly.
- [ ] `verify-node` 0 mismatches; `audit-options` clean (mind the length tell —
      pad distractors, never shorten the right answer); `check-bilingual` clean.
- [ ] Browser walk of every new panel in BOTH languages (`solution.lines[].st`
      is symbol-only, never prose — that bug class is invisible to checkers).
- [ ] "Last one." rule: appending panels to anything must not strand an old
      "Last one." / "Laaste een." mid-round.
- [ ] No real learner names/marks anywhere (public repo).
- [ ] No service-worker cache bump needed (this app's SW caches no code) — but
      verify fresh modules serve after deploy (new tab, not force-reload).
- [ ] Commits stay LOCAL. No push. Megan reviews in the morning; ship is a
      separate explicit step after her yes.

## Foreman dispatch plan (2026-08-11)

Six numbered sessions, built in order, Fable reviews each diff + browser-walk
before dispatching the next. Draft prompts (Fable pastes final versions in chat
on the day, per the foreman pattern; each carries the /go delegation block):

1. **Scaffolding + P0.** Read `rounds/index.js`, `config.js`, `game.js` survey
   trigger. Create the new group wired into the map, pin the survey to round 43,
   build P0's panels. All checks green + both-language walk.
2. **T1 arc (P1, P2).** The template session — its shape is the model the other
   arcs copy. Cheat notes pages: variants A/B/C.
3. **T2 arc (P3, P4).** Standard + reflex + bowtie; the "same five steps" story.
4. **T3 arc (P5, P6).** Cyclic quad; the wrong-radii trap is the centrepiece.
5. **T4 arc (P7, P8).** Tan-chord both cases; the wrong-join trap.
6. **P9 finale + sweep.** Needs all arcs done. Mixed tool-match + legal/illegal
   set, then the full checklist above across the whole group.

Session 2 gets reviewed hardest — it sets the pattern. If overnight, sessions
run sequentially and Fable's morning report lists per-session diffs, check
results, and anything deferred.

## After this: Dynamic Geometry (Ch 8) — separate plan

Planned next (booklet read this session: Drawing diagrams from given info /
Adding lines / Moving points on circles / Folding in two dimensions). Her core
brief: **the kids must SEE what is happening** — the booklet's static questions
force them to imagine motion they've never seen; the app's draggable diagrams
are the whole point. Folding = reflections = genuinely new engine territory,
its own chunk. Details to follow in DYNAMIC-GEO-PLAN.md after the proofs ship.
