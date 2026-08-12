# Handoff — the tan-chord "paired exercise" (the one FIX-ROUND-3 item left out)

Written 2026-08-12, end of the FIX-ROUND-3 foreman session. Megan's ruling:
build this in its OWN session, after she has played the whole FIX-ROUND-3
batch through. Nothing ships before that playthrough either — as of this
handoff the repo is 30+ local commits ahead of origin and LIVE IS UNTOUCHED.

## What this is

Her Tan-chord Proof Misconception pages
(`C:\Users\megzi\Desktop\Tan-chord Proof Misconception.pdf`, 4 pages) teach
the construction rule as a PAIRED exercise, and the pair is the point:

> **"You must join the point that you are trying to prove!"** (her pink
> cloud, verbatim; AF in the app: "verbind die punt wat jy probeer bewys")

- Same figure, TWO possible targets. Page 1: prove the tangent-chord angle
  equals **Ê** → correct join is **EP** (E, the target point, to the
  diameter's far end P); the common mistake is joining **PD**. Page 2, SAME
  figure: prove the other tangent-chord angle equals **D̂** → correct join
  is now **PD**, and **EP** is the mistake. The correct and wrong joins
  SWAP when the target swaps.
- Pages 3–4 repeat the pair on a second figure (tangency S, centre P,
  diameter SPQ): prove RŜU = V̂ → join QV (mistake QU); prove VŜT = Û →
  join QU (mistake QV).
- Pedagogical point: the join is NOT a memorised move. You must ask "which
  angle am I proving?" first. A learner who joins by habit gets a legal
  construction and a genuine right angle — at the wrong point.

## What already exists (don't rebuild it)

- `js/rounds/proof8-t4-transfer.js` (11 panels) already teaches ONE half:
  claim hosted at P → correct join D→P, trap = D→B (real 90° at the wrong
  point), closing on her rule. Its geometry: T:270 (tangency), D:90
  (antipode), chord TB with B:30, P:330 (alternate segment). All values
  engine-verified; derivations in the file header.
- `js/rounds/proof7-t4-discovery.js` (case A, 90°−x) teaches the
  construction the first time: T:270, A:38, D:90, P:150.
- The rule already appears verbatim in pr8's trap note, correct-join panel
  and recap — the new work should REUSE that thread, not restate it cold.

## What to build (design with her, then dispatch)

The missing piece: the SWAP experience — same figure, new target, and the
learner must choose the join afresh, discovering that yesterday's wrong
answer is today's right one. Options to put to Megan (foreman decides the
shape WITH her, not for her):
1. **Append 2–3 panels to pr8** after the current combine panel: "Now
   prove the OTHER angle instead — which join?" The other natural target
   on pr8's figure is the angle hosted at **B** (∠TBD-side claim, chord
   TP): correct join becomes D→B, and D→P is now the useless one. Needs
   its own engine-verified algebra chain for the B-hosted claim (this is
   the "second construction's worth of content" the FIX-ROUND-3 session
   declined to rush).
2. **A new short round** (pr10?) mirroring her PDF exactly: two paired
   mini-exercises, four join-choice panels, no full chains — pure
   which-join drills on both of her figures. Lighter to build; ⚠️ adding a
   round touches group `g7`'s ORDER (position is load-bearing — see
   PROJECT-STATUS 2026-08-11, session 1 notes) and the map count.
3. Fold one swap panel into pr9's mixed finale instead (it already does
   speed-match "claim → tool"; a "claim → join" panel is its natural
   shape).

Whichever shape she picks: exact-integer geometry, engine-verified, her
letters need not match the PDF's (the app's T/D/B/P convention wins), all
taps, bilingual, the label-pinning standard (≤55 units to vertex, no
overlaps), all four checkers + foreman browser walk both languages at
375px.

## Also waiting on her (same next session)

- Her full playthrough of the FIX-ROUND-3 batch (pr4: 13 panels, pr5/pr6
  two-colour families + earned labels, pr7 pins, pr8: 11 panels) —
  playtest link: dev server `circle-quest` → localhost:5180/?preview=1.
- THEN ship on her explicit yes: plain push, no migration, no
  edge-function change.
- Standing: mini-diagram stacking CSS one-liner · "Proofs"/"Bewyse" card
  name · both hers, both unchanged.
