/* Round 10 — Tan-chord theorem.
   The teacher's existing exercises (data-tanchord.js) are REUSED, not
   rewritten: single-answer exercises become multiple choice (the real
   answer wrapped with three sensible distractors), and the "spot the
   theorem" diagrams become tap-the-equal-angle questions. */
import { SECTIONS } from "./data-tanchord.js";

const AC = "#9c36b5";

/* sensible numeric distractors around the true value v */
function distractors(letter, v) {
  const pool = [180 - v, 90 - v, v + 10, v - 10, v + 6, v - 6, 2 * v, Math.round(v / 2), v + 18, v - 18];
  const seen = new Set([v]);
  const out = [];
  for (const c of pool) {
    if (Number.isInteger(c) && c > 0 && c < 180 && !seen.has(c)) { seen.add(c); out.push(c); }
    if (out.length === 3) break;
  }
  while (out.length < 3) { const f = (v + 7 * (out.length + 1)) % 175 + 2; if (!seen.has(f)) { seen.add(f); out.push(f); } }
  return out.map(n => `${letter} = ${n}°`);
}

/* Translate the imported English question text to Afrikaans. The exercises
   follow fixed templates, so clause-by-clause replacement is exact. */
function vraagAf(v) {
  return v
    .replace("STU is a tangent at T", "STU is 'n raaklyn by T")
    .replace("PT and PS are tangents at T and S", "PT en PS is raaklyne by T en S")
    .replace(" and TD is a diameter", " en TD is 'n middellyn")
    .replace(" and TA is a diameter", " en TA is 'n middellyn")
    .replace(" and TA = TB", " en TA = TB")
    .replace(" and TA ⊥ TB", " en TA ⊥ TB")
    .replace("Calculate the value of x, with reasons.", "Bereken die waarde van x, met redes.")
    .replace("Calculate the value of x.", "Bereken die waarde van x.")
    .replace("Calculate x and y, with reasons.", "Bereken x en y, met redes.")
    .replace("Calculate x, with a reason.", "Bereken x, met 'n rede.")
    .replace("Calculate x, with reasons.", "Bereken x, met redes.")
    .replace("(Yes, the theorem also works for obtuse angles!)", "(Ja, die stelling werk ook vir stomphoeke!)");
}

// MULTIPLE CHOICE from every single-unknown exercise across all sections.
const mcQuestions = [];
SECTIONS.forEach((sec, si) => {
  sec.oefeninge.forEach((ex, oi) => {
    const m = ex.antw.match(/^([a-z])\s*=\s*(\d+)°$/);
    if (!m) return;                      // skip multi-answer / proof exercises
    const letter = m[1], v = +m[2];
    const correct = `${letter} = ${v}°`;
    const opts = [{ text: correct, correct: true }, ...distractors(letter, v).map(t => ({ text: t }))];
    mcQuestions.push({
      id: `r10mc-${si}-${oi}`, type: "calc-mc", accent: AC,
      prompt: { en: ex.vraag, af: vraagAf(ex.vraag) },
      diagram: ex.d,
      options: opts,
      answer: { en: ex.antw, af: ex.antw },
      explainReason: "tanChord",
    });
  });
});

// TAP-THE-EQUAL-ANGLE from "Spot the theorem" (section 1): the tangent-chord
// angle at T and the inscribed angle at P are equal; angle at A is a decoy.
const tapQuestions = SECTIONS[0].oefeninge.slice(0, 8).map((ex, i) => {
  const a0 = ex.d.angles[0];           // tangent-chord angle at T
  const a1 = ex.d.angles[1];           // inscribed angle at P (the alternate segment)
  const d = {
    ...ex.d,
    angles: [
      { at: "T", legs: a0.legs, t: "•", o: { v: a0.o.v } },
      { at: "P", legs: ["T", "A"], t: "", o: { v: a1.o.v } },
      { at: "A", legs: ["T", "P"], t: "", o: {} },
    ],
  };
  return {
    id: `r10tap-${i}`, type: "tap", accent: AC,
    prompt: { en: "The tangent-chord angle at T is marked. Tap the angle in the alternate segment that equals it.", af: "Die raaklyn-koord-hoek by T is gemerk. Klik op die hoek in die oorstaande segment wat daaraan gelyk is." },
    diagram: d,
    tap: { targets: [ { id: "p", kind: "angle", angleIndex: 1 }, { id: "a", kind: "angle", angleIndex: 2 } ], correctId: "p" },
    answer: { en: "The angle at P (alternate segment) equals the tangent-chord angle.", af: "Die hoek by P (oorstaande segment) is gelyk aan die raaklyn-koord-hoek." },
    explainReason: "tanChord",
  };
});

export const round = {
  id: "r10", n: 10, accent: AC,
  title: { en: "Tan-chord theorem", af: "Raaklyn-koord-stelling" },
  blurb: { en: "Tangent-chord angle = angle in the alternate segment.", af: "Raaklyn-koord-hoek = hoek in die oorstaande segment." },
  reasonCode: "tanChord",
  questionsPerPlay: 10,
  questions: [...tapQuestions, ...mcQuestions],
};
