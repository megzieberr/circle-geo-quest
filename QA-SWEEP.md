# QA sweep — Investigation Station audit, 2026-07-31 (COMPLETE)

Scope: inv1–inv6, bug hunt after the 2026-07-30 fixes + sentence/hint ambiguity
pass. Extra attention on Chunk D panels (Megan had not play-tested Chunk D).
READ-ONLY sweep: findings reported in chat, nothing fixed without her go-ahead.

States: [ ] todo · [x] clean · [!] finding(s) — see the chat report of 2026-07-31

## Programmatic checks
- [x] verify-node — 424 diagrams / 772 angles / 0 mismatches
- [x] audit-options — 29 shuffled + 1 keepOrder by design, no positional or length tell
- [x] check-bilingual — clean (8 af===en strings all legitimately symbol-only)
- [x] check-table-summary — all branches clean, both languages

## Stations
- [!] inv1 Measure & Notice — F6: panel-10 hint asserts a chords-match row the learner's table may not have
- [!] inv2 State the Conjecture — F3: panel-6 hint says "P" for external point A; F9: panel-7 note says "panel 3" (learners never see panel numbers)
- [x] inv3 Break It — clean; two-circle counterexample geometry recomputed and exact (97°/51°, both chords ≈6 cm at 15 px/cm). Low nit F8: "exactly one chord" (a kind, not a count)
- [!] inv4 Prove It — F1: s4p5 says "Last one." but two Chunk D panels follow; F4: panel-1 hint miscounts the options ("two … already in the solution" — only one is) and the ∠AOC=80° distractor is a false value for this figure (true ∠AOC=100°)
- [x] inv5 Turn It Around — clean; low nit F7: 3b hint-2 slightly circular
- [!] inv6 Explain It — F2: s6p4 says "Last one." but s6p5 follows; F5: "the tangent ray" in s6p5/inv4-p8 hints is ambiguous (two rays; only the one forming the 64° angle works)

## Cross-cutting
- [x] investigate.js engine — hint ladder, stuck ladder (3 taps → memo + Continue), predict/blank/choice/written paths, shuffle, XP tick all verified
- [x] word chips — every id used by blank panels exists in i18n (incl. ptDifferent, constant, posOn)
- [x] readings tables — px() rounds to integers, dedupe-vs-every-row works, unit:"" on length columns confirmed in DOM
- [x] panel_memos — 10 rows live, ids match the app's 10 typed panels exactly, s6p5 byte-identical to phase16.sql mirror (md5-verified)
- [x] browser walk — inv4 p7/p8, inv5 3b/3c, inv6 s6p5 answered in EN and AF; inv1 p7/p9, inv2 p6, inv3 counterexample mounted in AF; correct reason pills throughout; 0 console errors

## Verdict
No functional bugs. Six copy findings (F1–F6, two of them the same "Last one." class
introduced by appending Chunk D panels) + three low nits (F7–F9). All wording-level.

## Fixes — ALL NINE APPLIED same day, her go-ahead ("fix it now please yourself")
- F1 inv4: s4p5 "Last one." → "Now finish the solution." / "Rond nou die oplossing af.";
  p8 (the actual last panel) now opens "Last one, and a different theorem again."
- F2 inv6: s6p4 "Last one." → "Nearly done." / "Amper klaar."; s6p5 (the actual last
  task) now opens "Last one: a different theorem, and another friend…"
- F3 inv2 p6 hint 2: "as P moves away" → "as A moves away" (EN + AF)
- F4 inv4 p1: hint 2 recounted (one option already in the solution, two drag in the
  centre); the ∠AOC distractor corrected 80° → 100° (now a TRUE but unused line,
  same status as OA = OC — 80° was ∠BOC's value)
- F5 inv4 p8 + inv6 s6p5: hints/memoDisplay/note anchor on "the 64° angle at T",
  not "the tangent ray" (a tangent has two rays). SERVER MEMO UNTOUCHED — marking
  already accepts side-of-chord wordings, this was teaching copy only.
- F6 inv1 p10 hint 2: no longer asserts a chords-match row exists in the learner's
  table ("the closer the chords get, the closer the angles get")
- F7 inv5 3b hint 2: de-circularised — now the real argument (every other point of
  the perpendicular line is further than one radius from the centre)
- F8 inv3 p1 option + p2 sentence: "exactly one chord" → "exactly one kind of chord"
- F9 inv2 p7 note: "the four in panel 3" → "the four write-ups you judged earlier in
  this station" (learners never see panel numbers)

Re-verified after fixes: verify-node 424/772/0 · audit-options clean (29 shuffled +
1 keepOrder, no length tell) · check-bilingual clean · check-table-summary clean ·
all 15 changed strings confirmed served + mounting in a fresh browser tab, 0 console
errors. No server/memo changes, so no migration handshake needed. NOT COMMITTED —
these edits sit on top of the tan-chord commit (fd59720), awaiting her word.

## Observation → FIXED same day (her call: "let the second hint already show
## before the right answer is shown")
On CHOICE panels hint rung 2 could never display: wrong answers cap at
(options − 1) = 3, and rung 2 needed a 4th wrong — rung 1 itself only arrived once
elimination had left the correct option as the only live button. Fixed in
`js/investigate.js`: on choice panels every wrong tap now advances the ladder one
rung (wrong 1 → rung 1 with a real choice left, wrong 2 → the rung-2 tell with two
options still open). Blank and written panels keep the original 3-miss ladder
(their wrong count is unbounded, so every rung was always reachable). Verified in
the browser: choice = rung 1 / rung 2 / clamp, blank = no hint until the 3rd miss.
NOTE: `js/discover.js` (the frozen engine for the 11 live discovery rounds) has the
identical old ladder — mirroring it there is HER call, not made in this change.
