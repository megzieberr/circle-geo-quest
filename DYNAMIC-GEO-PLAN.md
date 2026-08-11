# Dynamic Geometry rounds — build plan (written 2026-08-10, planning session with Megan)

**Status: PLANNED, not built. Build target: week of 2026-08-17**, AFTER the proof
rounds group ships (see PROOF-ROUNDS-PLAN.md). Class sequence: 2D trig first,
then dynamic geometry — the rounds may assume the trig toolbox is fresh.

**Source materials (all read into the planning session):**
- English booklet: `Desktop\Wiskunde Boekies\2026\Grade 11\Term 3\3. Dynamic Geometry.pdf`
- Afrikaans class workbook with her worked solutions: `Desktop\Dynamic Geo.pdf`
  (book pp. 80–119: Oefening 11 (a)–(w) + exam-focus revision (a)–(o)) — this is
  the canon for solution style and AF reason vocabulary (rkl-koord, binne ∠e v. Δ,
  ∠e in semi ⊙, ∠e t.o. = sye, mdpt ∠ = 2× omtrek ∠, ko-binne ∠e, omgek. …)
- 2D trig notes: `Desktop\Wiskunde Boekies\2026\Grade 11\Term 3\1. 2D Trigonometry.pdf`
  (sine rule + ambiguous case, cosine rule, area rule, mixed diagrams)
- Last year's test question: Sept P2 Q5(d) (Curro Kathu 2025) — C moves
  anticlockwise to F such that EF ∥ BD, radius 5, calculate the distance C
  travels, 6 marks. **Model its STRUCTURE with fresh numbers/letters — never
  reproduce the actual test question (public repo, school paper).**

## The one-sentence brief (her words, 2026-08-10)

The booklet's static questions force kids to *imagine* motion and folding they
have never seen. **The app's whole job is to SHOW it** — let them drag and watch
— then hand them the frozen textbook-style picture they now recognise. That is
how it maps back to their textbooks.

## Standing rules (inherited, all apply)

Tap/drag only, no typing · discovery rounds show raw measurements, never
conclusions · fresh questions, never copied ones · to-scale diagrams, verified ·
bilingual EN/AF · public repo, no learner names, no real test content · XP per
panel Station-style (same ruling as proof rounds) · her notes are guidelines,
not law.

## The arcs

### 1 · Moving points (the heart)

- Drag C along the arc (or tap play and watch it glide) with live readouts.
  They SEE the inscribed angle hold constant across the whole arc (same
  segment — a theorem they proved, now in motion) and JUMP when C crosses the
  chord to the other segment (supplementary — cyclic quad, alive).
- Then the app freezes C at its new position and asks the booklet-style
  question on the still figure. Movie first, snapshot second.
- **Capstone round:** a moving point that stops when a CONDITION clicks in —
  modelled on Sept P2 Q5(d): drag C until EF ∥ BD visibly locks (parallel
  marks flash), then calculate the distance travelled. Fresh figure, fresh
  numbers. This is the exact question shape they will meet in the September
  paper.

### 2 · Arc length — THE UNROLL (her idea, the centrepiece)

Kids' #1 trip-up: the distance a point travels on the arc. Her design:

1. Point moves on the circle; the travelled arc highlights.
2. **The circle unrolls into a straight ruler of length 2πr** — the highlighted
   arc comes along and lands as a highlighted SEGMENT on the ruler. Arc length
   is just distance, temporarily bent.
3. The θ/360 pie sits beside the ruler: the centre's angle tells you the
   fraction of the ruler you get.
4. Roll it back up — same segment, curved again.

Then drill her method exactly (workbook p.100): central angle of the swept arc
→ θ/360 → × 2πr. Panels: read the swept angle off the figure (theorems find
it), pick the fraction, compute. The unroll animation replays on demand.

### 3 · Drawing diagrams from words

- **Pick-the-diagram:** four candidates, traps built from real misreadings
  (D on the wrong side of C · the given angle in the wrong segment · tangent
  vs chord confusion). Workbook (a)–(e) supply the scenarios.
- **Build-it-with-me:** each tap adds ONE given fact and the diagram assembles
  in stages — the read-the-sentence-draw-the-piece habit, animated.

### 4 · Adding lines to diagrams

Reuses the proof rounds' construction DNA (options, not point-taps): which
line unlocks this figure? Join BC (semi-circle 90°) · join the two centres ·
drop the perpendicular. The legal-constructions rule carries over verbatim —
join points and draw radii, never "construct" a property you haven't proven.
Workbook (f)–(p) supply the scenarios (two-circle raaklyn figures included).

### 5 · Folding (trip-up #2) — Tripo + engine, split jobs

- **Tripo3D asset (Megan's pipeline) for the teaching moment:** a real
  textured piece of paper folding over in 3D, exported as animated WebP in a
  plain `<img>` (the Katse pattern — no engine work, plays everywhere). It
  opens the folding round so every learner knows what folding IS before any
  geometry gets asked. She produces the asset in studio.tripo3d.ai; the build
  session embeds it as-is (her art, used untouched).
- **Engine interactive for the working diagrams:** a fold is a reflection
  across a line. Drag the flap over the fold line (or slider-replay it slowly)
  and watch A land on its image F. What reflection preserves — lengths,
  angles — is VISIBLE, then the frozen after-picture gets the booklet
  questions (workbook (u)–(w): the rectangle fold, the equilateral-onto-centre
  fold, the paper-corner fold). Must be to-scale per question and
  verify-node-checkable, which is why this half cannot be a baked render.

### 6 · The trig bridge — max area + the ambiguous case

- **Max area (her favourite):** drag Q around the circle; a live area counter
  climbs and falls; it peaks exactly when the angle hits 90° — ½ab·sinθ drawn
  by their own thumb (workbook p.100's sine-graph note, made touchable).
- **THE AMBIGUOUS CASE IS A MOVING POINT** (this session's lightning bolt —
  write-that-down ruling). Given two sides and a non-included angle, the third
  vertex has TWO valid landing spots on its arc — sine rule's θ and 180°−θ are
  the two places the same drag can stop (her own workbook solution:
  "Skerph. θ=60° / Stomph. θ=120°"). One draggable figure turns the most
  confusing idea in the trig chapter into a picture: drag the vertex, watch
  BOTH triangles satisfy the given data.
- These rounds ASSUME the trig toolbox (sine/cosine/area rule) and lightly
  refresh it: toolbox-pick panels ("which tool bites here?") in the proofs-
  finale style, now mixing theorems AND trig rules — which is exactly what the
  exam-focus workbook section (pp. 106–119) does.

## Engine notes

Exists already: drags with onRelease · live readouts/readings tables · staged
per-panel figures · choice/predict panels · noCircle + free pts · bilingual
i18n · verify-node.

**New capabilities this chapter needs (daytime build work, not overnight):**
1. The unroll animation (circle ⇄ ruler morph with a highlighted sub-arc that
   survives the morph).
2. The fold interactive (reflection across a line, draggable flap + slider).
3. Condition-click drags (drag until a relation locks — EF ∥ BD — with a
   visible snap + flash).
4. Live derived readouts (area counter, swept-angle counter) — small extension
   of the existing measurement display.

**Tripo asset list (Megan produces):** one paper-fold animation (WebP). More
only if the folding arc wants a second pose.

## Cross-pollination note → blipwork (Maths Homework Quest)

Her call this session: the ambiguous-case-as-moving-point figure **also
belongs in blipwork's 2D trig rounds** (Gr11 hub). Not built here — carry the
idea over when blipwork's trig chapter comes up. It needs only the drag
capability blipwork already has for its own diagrams.

## Open for the build-week session (decide with her, not before)

- Round count and grouping (she playtests and adjusts — start lean like the
  proofs group; the six arcs above could be ~8–10 rounds).
- Where the group sits: after the proofs group on the main map, presumably.
- Whether the unroll and fold interactives get their own "just play" sandbox
  panel before any questions (the Station's drag-and-notice DNA suggests yes).
- Which workbook scenarios become which rounds — she picks favourites.
