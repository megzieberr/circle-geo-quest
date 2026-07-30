/* Does every learner-facing string have BOTH languages?
   ------------------------------------------------------------------
   The app renders copy through tx({en, af}). A missing or empty `af`
   silently shows English to an Afrikaans learner, and eyeballing a
   walkthrough only catches it on the panels you happen to look at.
   This walks every round and every panel and reports:

     · a {en,…} object with no `af` (or an empty one), and vice versa
     · an `af` string identical to its `en` — sometimes correct
       ("∠AOB = 2 × ∠APB", "radii"), so these are listed to READ, not
       failed, unless they contain enough letters to be real prose
     · leftover template placeholders

   Run: node tools/check-bilingual.mjs        (exit 1 on a real gap) */
import { ROUNDS } from "../js/rounds/index.js";

const missing = [], identical = [], placeholders = [];

/* An {en, af} pair is the shape we care about. Walk everything else looking
   for them — that way a new panel field is covered without editing this file. */
function walk(node, path, seen = new Set()) {
  if (!node || typeof node !== "object") return;
  if (seen.has(node)) return;
  seen.add(node);
  if (Array.isArray(node)) { node.forEach((v, i) => walk(v, `${path}[${i}]`, seen)); return; }

  const hasEn = Object.prototype.hasOwnProperty.call(node, "en");
  const hasAf = Object.prototype.hasOwnProperty.call(node, "af");
  if (hasEn || hasAf) {
    const en = typeof node.en === "string" ? node.en : "";
    const af = typeof node.af === "string" ? node.af : "";
    if (!en.trim() || !af.trim()) {
      // both blank is a deliberate "unlabelled" marker, not a gap
      if (en.trim() || af.trim()) missing.push({ path, en: en.slice(0, 70), af: af.slice(0, 70) });
    } else if (en === af) {
      // real prose is >3 words; a formula or a shared word is fine
      if (en.split(/\s+/).length > 3) identical.push({ path, text: en.slice(0, 80) });
    }
    for (const s of [en, af]) if (/\{[a-z]+\}/i.test(s) && !/\{n\}|\{min\}/.test(s)) placeholders.push({ path, text: s.slice(0, 80) });
    return;   // don't descend into the string keys
  }
  for (const k of Object.keys(node)) {
    if (k === "interactive") continue;        // model factories, not copy
    walk(node[k], `${path}.${k}`, seen);
  }
}

for (const r of ROUNDS) {
  walk({ title: r.title, blurb: r.blurb }, `${r.id}`);
  (r.panels || []).forEach((p, i) => {
    // a prompt may be a FUNCTION of the run's scratch — call it with a
    // representative scratch so its generated copy is checked too
    const panel = { ...p };
    if (typeof panel.prompt === "function") {
      try { panel.prompt = panel.prompt({ readings: [[112, 56], [99, 50], [140, 70]] }); }
      catch (e) { missing.push({ path: `${r.id} panel${i + 1}.prompt`, en: "prompt() threw: " + e.message, af: "" }); delete panel.prompt; }
    }
    walk(panel, `${r.id} panel${i + 1}`);
  });
}

if (identical.length) {
  console.log(`ℹ️  ${identical.length} string(s) where af === en — read these, some are legitimately the same:`);
  identical.forEach(x => console.log(`   ${x.path}\n     ${x.text}`));
  console.log("");
}
if (placeholders.length) {
  console.log(`⚠️  ${placeholders.length} unreplaced placeholder(s):`);
  placeholders.forEach(x => console.log(`   ${x.path}: ${x.text}`));
  console.log("");
}
if (missing.length) {
  console.error(`✗ ${missing.length} one-language string(s):`);
  missing.forEach(x => console.error(`   ${x.path}\n     en: ${x.en || "(empty)"}\n     af: ${x.af || "(empty)"}`));
  process.exit(1);
}
console.log("✓ every learner-facing string carries both languages.");
