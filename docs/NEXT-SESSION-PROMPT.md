# Prompt for the next Circle Quest session (Chunk C — the corrections pass)

Paste everything between the lines into a fresh session.

---

Continuing Circle Quest — Investigation Station, CHUNK C (the corrections pass).
Branch: claude/investigation-station-circle-geo-dd1g0a (PR #4).

Read these two files first, in this order:
  1. docs/investigation-station-playthrough-notes.md — this is the brief. I played
     all six stations and it holds all 21 findings, ordered by station, each with a
     status (to decide / agreed / built) and draft copy where it exists. The ROOT
     CAUSE table at the top is the important part.
  2. PROJECT-STATUS.md — "Where we are", the 2026-07-30 playthrough rulings under
     Decisions, and the suggested build order under "Next up".

DONE, don't redo: all six stations exist and play (rounds 44-49, inv1..inv6). The
train is finished and committed (27e71bf) — home strip, six-stop map, stations off
the main round map, g6 off the rank ladder so finishing the 43 rounds still ends on
Circle Grand Master. The line-wide scaffolding pass is committed too (731feed): the
nine typed panels carry "Your answer needs to:" lists, the starter chips sit above
the answer box, the predict panel type exists, the "IEB says" attribution is out of
learner copy (marks talk deliberately stayed), and s2p4's hints stopped teaching the
one wording its mark scheme refuses.

THE HEADLINE FINDING, which most of the work follows from: the panels were written
as ASSESSMENT when the station is INSTRUCTION — the teaching sits AFTER the answer
instead of before it. Five panels are instances. Fix it as one editing pass over the
line, not five patches. Rule for anything new: a learner who has read everything
above the question must be able to answer it.

Today's job, in this order (all of it is spelled out in the notes doc):
  1. Line-wide: shuffle the options in investigate.js and discover.js (the correct
     answer is currently FIRST in 12 of 12 station panels and 7 of 7 discovery
     panels) with a keepOrder opt-out for sequences; then the teach-before-you-ask
     pass over the five root-cause panels.
  2. Station 1: make the app record my own readings as I drag (N1, the big one),
     then the protractor→rounding rewrite it drags along (N2 — note rounding can only
     ever be 1° out, so 96/49 becomes 97/49), the row count (N4), and the new
     "conjecture is a fancy word for a hunch" slide (N21).
  3. Station 3: the diagram + rewrite on the three-points-vs-four panel (N7b); the
     rotating-line interactive if we're doing N8.
  4. Station 4: the proof block on screen (N12), "to find x" in the prompt (N12b),
     "solution" not "proof" (N13), and the s4p4 split (N15 — that SETTLES N14, so
     don't also loosen the mark scheme).
  5. Stations 5 and 6: the IF…THEN restatement and the rain/sprinkler example (N16,
     N17), the definition of "conclusion" (N19), and the carried-forward figures
     (N20).

Ask me before you build if a finding is still marked 🔴 in the notes — several are
mine to decide, including whether Station 4 keeps the title "Prove It".

Things that will bite:
  · ZZ Toets / toets1234 is a REAL learner row on live Supabase, created so I could
    test the typed panels with real marking (teacher preview can't — "Teacher
    Preview" isn't in `students`, so the checker 401s and every typed answer falls
    through to the hint ladder). The class can see the name on the login list. Ask me
    at the start whether to keep it or delete it; both statements are at the top of
    the notes doc. Its checker cap is 20 calls per hour per learner — a rate limit,
    not a spend limit, so my $10 of API credit doesn't lift it.
  · Anything that touches a `must_have` needs `node tools/probe-checker.mjs` re-run
    afterwards with that login. A memo is a prompt and cannot be eyeball-checked.
  · sw.js caches NOTHING in this app by design — there is no cache version to bump,
    unlike my other quest apps.
  · The Browser pane never fires rAF/IntersectionObserver and screenshots time out.
    Verify by reading the DOM and measuring in JS.
  · Deploying edge functions is a Claude step via the Supabase MCP, not a dashboard
    step. PUSH-SETUP.md Part 6 is stale.

DO NOT PUSH. Nothing goes to origin until Chunk C is done — the line exists but has
21 known defects and I don't want learners on it yet. The branch is 7 commits ahead
and stays there; /ship clears the lot when we're finished.

---
