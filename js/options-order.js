/* ============================================================
   WHAT ORDER THE OPTIONS ARE RENDERED IN
   ------------------------------------------------------------
   A LEAF MODULE ON PURPOSE: it imports nothing. Everything else
   in js/ reaches localStorage or the DOM somewhere in its import
   graph, so none of it can be imported from node — and this is
   the one piece that has to be TESTABLE, because the bug it
   fixes went unnoticed across a whole line of panels.
   `node tools/audit-options.mjs` imports this directly.

   THE BUG (measured 2026-07-30): js/investigate.js and
   js/discover.js rendered `panel.options` in source order, and
   every panel had been authored with the correct option written
   first — 19 of 19 across the Investigation Station and the
   discovery rounds. So "always tap the top one" cleared every
   choice panel in both without reading a word. js/game.js has
   shuffled since it was written, which is why the 43 graded
   rounds never showed the same tell.

   TWO OPT-OUTS, and there should never be a third:
     • `keepOrder: true` on the PANEL — the options are a
       SEQUENCE, not a set ("Step 1 / Step 2 / Step 3 / None of
       them"). Shuffled, they read as nonsense.
     • `pin: true` on ONE OPTION — it holds its own index while
       the others move around it. For a trailing catch-all
       ("Nothing is wrong — every reason fits") which belongs
       last wherever the rest land.

   ⚠️ AUTHORING RULE: never describe an option by its POSITION in
   a panel's `note`, `hints` or `memoDisplay`. "The first one
   works because…" was true when it was written and is a lie
   after the shuffle. Quote the option's words instead.
   ============================================================ */

/* Fisher–Yates (returns a new array). ui.js re-exports this so js/game.js
   keeps importing it from where it always has, and there is exactly one
   shuffle in the codebase. */
export function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* The order a panel's options should be rendered in. Returns a NEW array;
   callers must index into the returned array and never into `panel.options`,
   or the after-five-misses reveal will highlight the wrong button. */
export function orderedOptions(panel) {
  const src = panel.options || [];
  if (panel.keepOrder) return src.slice();
  const movable = shuffled(src.filter(o => !o.pin));
  let k = 0;
  return src.map(o => (o.pin ? o : movable[k++]));
}
