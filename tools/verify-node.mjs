/* verify.html's check, runnable from the terminal.
   ------------------------------------------------------------------
   engine.js builds SVG as a STRING and never touches the DOM, so the
   whole "diagrams cannot lie" check runs in node — which matters here
   because the Browser pane never fires rAF and its screenshots time
   out, so opening verify.html is the slow way to learn the same thing.
   verify.html stays the visual gallery; this is the assertion.

   Same enumeration as verify.html: graded rounds carry `questions`,
   discovery/investigate rounds carry `panels` (plus optional
   `panel.diagrams` mini-figures), and draggable `interactive` panels
   are exempt by design — they compute their angles from live
   coordinates, so there is no declared value to disagree with.

   Run: node tools/verify-node.mjs        (exit 1 on any mismatch) */
import { verifyDiagram } from "../js/engine.js";
import { ROUNDS } from "../js/rounds/index.js";
import { SECTIONS } from "../js/rounds/data-tanchord.js";

let diagrams = 0, angles = 0;
const fails = [];

function check(label, d) {
  if (!d) return;
  diagrams++;
  for (const r of verifyDiagram(d)) {
    angles++;
    if (!r.ok) fails.push(`${label}  ∠${r.at} drawn ${r.drawn}° but declared ${r.v}° (off by ${r.diff}°)`);
  }
}

for (const r of ROUNDS) {
  (r.questions || []).forEach(q => check(`${r.id} ${q.id}`, q.diagram));
  (r.panels || []).forEach((p, i) => {
    check(`${r.id} panel${i + 1}`, p.diagram);
    (p.diagrams || []).forEach((d, j) => check(`${r.id} panel${i + 1}.${j + 1}`, d.diagram));
  });
}
// raw source data (sanity check that the engine port matches the original)
for (const sec of SECTIONS) {
  check(`src ${sec.id} mini`, sec.mini);
  (sec.oefeninge || []).forEach((ex, oi) => check(`src ${sec.id} ex${oi + 1}`, ex.d));
}

if (fails.length) {
  console.error(`✗ ${fails.length} mismatch(es) across ${diagrams} diagrams (${angles} angles):`);
  fails.forEach(f => console.error("  " + f));
  process.exit(1);
}
console.log(`✓ ALL TO SCALE — ${diagrams} diagrams, ${angles} angles checked, 0 mismatches.`);
