/* ============================================================
   RIDER TRANSFORMER (Phase 2 multi-step rounds)
   ------------------------------------------------------------
   Turns the teacher's verified tan-chord exercises (data-tanchord.js,
   each with a guaranteed-to-scale diagram AND a worked [statement,reason]
   solution) into "pick the correct final answer" multiple-choice riders.
   The full working is revealed afterwards.
   ============================================================ */
import { SECTIONS } from "./data-tanchord.js";

/* Afrikaans rendering of the (templated) English question text. */
function vraagAf(v) {
  return v
    .replace("PT and PS are tangents at T and S", "PT en PS is raaklyne by T en S")
    .replace("STU is a tangent at T, and ∠UTA = ∠STB = 60°", "STU is 'n raaklyn by T, en ∠UTA = ∠STB = 60°")
    .replace("STU is a tangent at T with ∠UTA = ∠STB = 56°", "STU is 'n raaklyn by T met ∠UTA = ∠STB = 56°")
    .replace("STU is a tangent at T. P and Q lie on the circle.", "STU is 'n raaklyn by T. P en Q lê op die sirkel.")
    .replace("STU is a tangent at T", "STU is 'n raaklyn by T")
    .replace(" and TD is a diameter", " en TD is 'n middellyn")
    .replace(" and TA is a diameter", " en TA is 'n middellyn")
    .replace(" and TA ⊥ TB", " en TA ⊥ TB")
    .replace(" and TA = TB", " en TA = TB")
    .replace(" and AB ∥ SU", " en AB ∥ SU")
    .replace("Calculate all three interior angles of △TAB, with reasons.", "Bereken al drie binnehoeke van △TAB, met redes.")
    .replace("Calculate the value of x, with reasons.", "Bereken die waarde van x, met redes.")
    .replace("Calculate the value of x.", "Bereken die waarde van x.")
    .replace("Calculate x, y and z, with reasons.", "Bereken x, y en z, met redes.")
    .replace("Calculate x and y, with reasons.", "Bereken x en y, met redes.")
    .replace("Calculate x and y, with a reason.", "Bereken x en y, met 'n rede.")
    .replace("Calculate ∠PTS (= y) and x, with reasons.", "Bereken ∠PTS (= y) en x, met redes.")
    .replace("Calculate y (= ∠PTS) and x, with reasons.", "Bereken y (= ∠PTS) en x, met redes.")
    .replace("Calculate x, with reasons.", "Bereken x, met redes.")
    .replace("Calculate x, with a reason.", "Bereken x, met 'n rede.")
    .replace("What type of triangle is △TAB?", "Watter soort driehoek is △TAB?")
    .replace("(Yes, the theorem also works for obtuse angles!)", "(Ja, die stelling werk ook vir stomphoeke!)");
}

/* Build 3 distinct, plausible wrong answers by perturbing the numbers in the
   correct answer string (keeping its exact format). */
function distractAnswer(antw) {
  const nums = (antw.match(/\d+/g) || []).map(Number);
  if (!nums.length) return [];
  const sub = fn => { let k = 0; return antw.replace(/\d+/g, m => String(fn(Number(m), k++))); };
  const cands = [];
  if (nums.length >= 2) { let k = 0; cands.push(antw.replace(/\d+/g, m => { const r = k === 0 ? nums[1] : (k === 1 ? nums[0] : Number(m)); k++; return String(r); })); }
  cands.push(sub((n, k) => (k === 0 ? (n < 168 ? n + 12 : n - 12) : n)));
  cands.push(sub(n => (n < 180 && 180 - n !== n ? 180 - n : n + 20)));
  cands.push(sub((n, k) => (k === nums.length - 1 ? (n > 8 ? n - 8 : n + 8) : n)));
  cands.push(sub((n, k) => (k === 0 ? n + 6 : n)));
  const out = [];
  for (const c of cands) { if (c !== antw && !out.includes(c)) out.push(c); if (out.length === 3) break; }
  let g = 5;
  while (out.length < 3 && g < 80) { const c = sub(n => ((n + g) % 176) + 2); if (c !== antw && !out.includes(c)) out.push(c); g += 7; }
  return out.slice(0, 3);
}

/* picks: [{ sec, ex }]  (both 0-indexed into SECTIONS / oefeninge) */
export function makeRiders(picks, accent, idPrefix) {
  return picks.map((p, i) => {
    const ex = SECTIONS[p.sec].oefeninge[p.ex];
    return {
      id: `${idPrefix}-${i}`, type: "calc-mc", accent,
      prompt: { en: ex.vraag, af: vraagAf(ex.vraag) },
      diagram: ex.d,
      options: [{ text: ex.antw, correct: true }, ...distractAnswer(ex.antw).map(t => ({ text: t }))],
      answer: { en: ex.antw, af: ex.antw },
      solution: ex.opl.map(st => ({ s: st[0], r: st[1] || "" })),
    };
  });
}
