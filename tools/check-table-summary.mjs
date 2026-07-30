/* Station 1's generated table sentence, in every branch and both languages.
   ------------------------------------------------------------------------
   The sentence that describes the learner's own readings is BUILT from the
   rows (N4 — the old hand-written one claimed five positions above a table of
   four). Generated copy is only as good as its plurals, so this prints every
   branch for reading and asserts the things that can be checked mechanically:
   no leftover placeholder, no digits (numbers are spelled out), no doubled
   space, one full stop at the end.

   Run: node tools/check-table-summary.mjs */
import { tableSummary } from "../js/rounds/invest01-measure.js";

/* a row is [centreAngle, circumferenceAngle]; exact when centre === 2*circ */
const exact = (c) => [2 * c, c];
const off = (c) => [2 * c - 1, c];      // the 1° rounding case

const cases = [
  ["no rows at all",          []],
  ["one row, exact",          [exact(56)]],
  ["one row, 1° out",         [off(50)]],
  ["three rows, all exact",   [exact(56), exact(70), exact(40)]],
  ["three rows, none exact",  [off(50), off(35), off(61)]],
  ["three: 2 exact, 1 out",   [exact(56), off(50), exact(70)]],
  ["three: 1 exact, 2 out",   [exact(56), off(50), off(35)]],
  ["six: 5 exact, 1 out",     [exact(56), off(50), exact(70), exact(40), exact(30), exact(25)]],
];

let bad = 0;
for (const [label, readings] of cases) {
  const s = tableSummary({ readings });
  console.log(`\n${label}`);
  for (const lang of ["en", "af"]) {
    const text = s[lang];
    console.log(`  ${lang}: ${text}`);
    const problems = [];
    if (/\{|\}/.test(text)) problems.push("unreplaced placeholder");
    if (/\d/.test(text)) problems.push("a digit survived — numbers should be spelled out");
    if (/undefined|NaN/.test(text)) problems.push("undefined/NaN");
    if (/ {2}/.test(text)) problems.push("double space");
    if (!/\.$/.test(text)) problems.push("does not end in a full stop");
    if (problems.length) { bad++; console.log(`     ✗ ${problems.join("; ")}`); }
  }
}

console.log(bad ? `\n✗ ${bad} problem(s) — read the sentences above.` : "\n✓ all branches clean in both languages.");
process.exit(bad ? 1 : 0);
