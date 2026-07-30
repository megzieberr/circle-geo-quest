# Prompt for the next Circle Quest session (Chunk D — more practice panels)

Paste everything between the lines into a fresh session.

---

Continuing Circle Quest — Investigation Station, CHUNK D.
Branch: claude/investigation-station-circle-geo-dd1g0a (PR #4). 8 commits ahead of
origin, nothing pushed.

Read these first, in this order:
  1. docs/chunk-d-practice-panels.md — this is the brief. It holds the XP change,
     which theorems go in which station and why, the rules every new panel has to
     follow, and a progress checklist. §4 is the important part: those rules are
     each a defect I already found once.
  2. PROJECT-STATUS.md — "Where we are" and the 2026-07-30 Decisions.

DONE, don't redo. Chunk C is committed (f42892f) and closed all 21 of my
playthrough findings: the whole line teaches before it asks, the app records my own
readings in Station 1 and generates the sentence that describes them, options are
shuffled (the correct one had been FIRST in 19 of 19 panels), Station 3 has its two
figures, Station 4 shows its solutions on screen, Stations 5 and 6 carry the
figures and definitions they refer to, and the two unfair mark schemes are fixed
and re-probed 13/13 against the live checker. Don't reopen any of it.

TODAY'S JOB, in this order:
  1. XP PER PANEL — do this before anything else. I want the kids to earn XP for
     each panel, not a flat 50 for the whole station. Nobody has banked station XP
     yet (0 progress rows, checked 2026-07-30) so it is free to change now and
     expensive later. §1 of the brief has the recommended shape and the one
     sub-decision that is still mine. Ask me that one before you build it.
  2. THEN the practice panels — 2 or 3 extra questions inside each of the six
     stations, on the theorems the line never touches (tangent-radius, tan-chord,
     two tangents from a point, equal chords). I want all four eventually but NOT
     in one session — do ONE THEOREM this session, all the way, and tick it off the
     checklist in §6. Start with two-tangents-from-a-point; it is the easiest.
  3. Mostly taps. I only want 1-2 typed panels in the whole of Chunk D, because
     each one costs a mark scheme and a probe run. Spend them where writing is
     actually the skill.

Ask me before you build if the brief says a decision is mine.

Things that will bite:
  · The Browser pane SERVES STALE ES MODULES. .claude/launch.json now points at
    serve.py for that reason, but after you edit a module the page has already
    loaded you must navigate with force: true — a plain reload, and even a
    brand-new tab, will show you the old file and cost you twenty minutes.
    Diagnose it by fetching the bare URL vs the URL with ?bust=random and
    comparing byte length.
  · The pane never fires rAF or IntersectionObserver and screenshots time out, so
    verify by reading the DOM and measuring in JS. innerWidth is 0 there, so
    coordinate dragging cannot be tested — drive an interactive's onRelease /
    onChange directly instead.
  · Anything that touches a `must_have` needs `node tools/probe-checker.mjs
    <panelId>` re-run afterwards. It takes panel ids now, so a targeted run costs
    about 6 calls instead of spending the 20-per-hour cap. A memo is a prompt and
    cannot be eyeball-checked — that is how s4p4 shipped unfair.
  · There is NO throwaway learner on the database any more — I had it deleted at
    the end of Chunk C. If you need one for a probe run, ask me, then insert it,
    use it, and delete it in the same session. The cap is 20 calls per hour per
    learner; it is a rate limit, not a spend limit, so my API credit doesn't lift it.
  · sw.js caches NOTHING in this app by design — there is no cache version to bump,
    unlike my other quest apps.
  · Deploying edge functions is a Claude step via the Supabase MCP, not a dashboard
    step. PUSH-SETUP.md Part 6 is stale.
  · .claude/ is gitignored, so the serve.py launch fix is local-only and will not
    travel to a fresh clone.

DO NOT PUSH until I say. The line is in good shape now — the hold is just so I can
read Chunk D first. /ship clears all of it when I give the word.
