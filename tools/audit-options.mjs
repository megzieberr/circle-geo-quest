/* Are the options giving the answer away?
   ------------------------------------------------------------------
   Two separate tells, both measured here, because on 2026-07-30 the
   whole Investigation Station had one of them and nobody had noticed:

     1 · POSITION. The correct option was written FIRST in 19 of 19
         choice panels, and neither investigate.js nor discover.js
         shuffled. "Always tap the top one" cleared the line.
     2 · LENGTH. The correct option was also the LONGEST in 13 of
         those 19, so it could be picked out without being read.
         Shuffling does nothing about this one — it is a copy job.

   Position is now handled by orderedOptions() in js/options-order.js,
   which this script imports and SAMPLES rather than reimplements: a
   copy of the logic here could drift from the real thing and report
   green while the app shipped the tell. Length is reported so the
   remaining copy work stays visible.

   Also flags panels whose options are a SEQUENCE but are not marked
   `keepOrder`, which renders as nonsense. Two different things, and
   only the first is a hard failure:
     • numbered steps ("Step 1: …") are unarguably a sequence;
     • a "None / Both / Neither" opener only breaks if it refers BACK
       to the other options ("none of THEM", "ALL THREE are needed") —
       those need a referent above them. A self-contained verdict
       ("Neither is guaranteed — it depends where the dots land")
       reads fine in any slot, so that is reported, not failed.

   Run: node tools/audit-options.mjs        (exit 1 if a tell remains) */
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { orderedOptions } from "../js/options-order.js";

const DIR = "js/rounds";
/* numbered steps — always a sequence, wherever they appear */
const STEP = /^(step|stap)\s*\d/i;
/* a catch-all opener … */
const CATCHALL = /^(none|nie een|both|albei|neither|geen van|all of|al drie)\b/i;
/* … which only breaks when it points back at the options above it */
const BACKREF = /\b(them|hulle|these|hierdie|all three|al drie|either|any of)\b/i;
const SAMPLES = 4000;          // enough to make a stuck position obvious
const LENGTH_GAP = 1.6;        // correct/longest-other ratio worth flagging

/* Select by `kind`, NOT by filename: two of the discovery rounds are
   `converse-intro.js` / `cyclic-quad-intro.js`, so a `discover-*` glob misses
   them — which is how the first run of this came out at 5 discovery panels
   instead of 7. Graded rounds are excluded; js/game.js already shuffles. */
const KINDS = new Set(["discover", "investigate"]);
const files = readdirSync(DIR).filter(f => f.endsWith(".js") && f !== "index.js").sort();

const rows = [];
for (const f of files) {
  const mod = await import(pathToFileURL(resolve(DIR, f)).href);
  if (!mod.round || !KINDS.has(mod.round.kind)) continue;
  (mod.round.panels || []).forEach((p, i) => {
    if (!Array.isArray(p.options)) return;
    const texts = p.options.map(o => String((o.text && (o.text.en ?? o.text)) || ""));
    const ci = p.options.findIndex(o => o.correct);
    const lens = texts.map(t => t.length);

    /* where does the correct option actually LAND once rendered? */
    const landed = new Array(p.options.length).fill(0);
    if (ci >= 0) {
      for (let s = 0; s < SAMPLES; s++) {
        landed[orderedOptions(p).findIndex(o => o.correct)]++;
      }
    }
    const worstShare = ci >= 0 ? Math.max(...landed) / SAMPLES : 0;

    const otherMax = ci >= 0 ? Math.max(...lens.filter((_, j) => j !== ci)) : 0;
    rows.push({
      id: `${mod.round.id} p${i + 1}`, type: p.type, ci, lens, texts, landed, worstShare,
      keepOrder: !!p.keepOrder,
      pinned: p.options.filter(o => o.pin).length,
      isSequence: texts.some(t => STEP.test(t.trim())),
      backrefCatchall: texts.some(t => CATCHALL.test(t.trim()) && BACKREF.test(t)),
      looseCatchall: texts.some(t => CATCHALL.test(t.trim()) && !BACKREF.test(t)),
      lengthRatio: otherMax ? lens[ci] / otherMax : 0,
    });
  });
}

const problems = [];
for (const r of rows) {
  const nOpts = r.lens.length;
  const even = 1 / nOpts;
  // A shuffled panel should land the correct option in every slot about
  // evenly. keepOrder panels are exempt by design and reported, not failed.
  const stuck = !r.keepOrder && r.worstShare > even * 1.6;
  const longTell = r.lengthRatio >= LENGTH_GAP;
  const unmarked = (r.isSequence || r.backrefCatchall) && !r.keepOrder && !r.pinned;

  if (stuck) problems.push(`${r.id}: correct option lands in one slot ${(r.worstShare * 100).toFixed(0)}% of the time (even would be ${(even * 100).toFixed(0)}%)`);
  if (unmarked) problems.push(`${r.id}: ${r.isSequence ? "numbered steps" : "a catch-all that refers back to the options above it"} — needs keepOrder or pin`);

  const flags = [
    r.keepOrder ? "keepOrder (not shuffled, by design)" : "",
    r.pinned ? `${r.pinned} pinned` : "",
    longTell ? `LENGTH TELL ${r.lengthRatio.toFixed(1)}x` : "",
    r.isSequence ? "numbered-steps" : "",
    r.looseCatchall && !r.pinned ? "self-contained catch-all (shuffles, review if odd)" : "",
  ].filter(Boolean).join(" · ");
  console.log(`\n${r.id}  (${r.type})${flags ? "  " + flags : ""}`);
  console.log(`   correct lands at: ${r.landed.map((n, j) => `[${j}] ${(n / SAMPLES * 100).toFixed(0)}%`).join("  ")}`);
  r.texts.forEach((t, j) => console.log(`   ${j === r.ci ? "*" : " "} [${String(r.lens[j]).padStart(3)}] ${t.slice(0, 84)}`));
}

const longTells = rows.filter(r => r.lengthRatio >= LENGTH_GAP);
console.log(`\n---\npanels with options:        ${rows.length}`);
console.log(`shuffled:                  ${rows.filter(r => !r.keepOrder).length}`);
console.log(`keepOrder (by design):     ${rows.filter(r => r.keepOrder).map(r => r.id).join(", ") || "none"}`);
console.log(`correct-is-longest ≥${LENGTH_GAP}x:  ${longTells.length}${longTells.length ? " — " + longTells.map(r => `${r.id} (${r.lengthRatio.toFixed(1)}x)` ).join(", ") : ""}`);

if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  problems.forEach(p => console.error("  " + p));
  process.exit(1);
}
console.log("\n✓ no positional tell; no unmarked sequence.");
