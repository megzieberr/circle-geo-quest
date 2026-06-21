/* PHASE 2 · Round (id r20) — Mixed exam riders I (multi-step).
   From section 5: shuffled exam-style problems mixing the tan-chord theorem
   with angles in the same segment, parallel lines, diameters and triangles.
   Pick the final answer; full working revealed. */
import { makeRiders } from "./riders.js";
const AC = "#4263eb";

export const round = {
  id: "r20", n: 20, phase: 2, accent: AC,
  title: { en: "Mixed exam riders I", af: "Gemengde eksamen vraagstukke I" },
  blurb: { en: "Exam-style tan-chord riders.", af: "Eksamenstyl raaklyn-koord vraagstukke." },
  reasonCode: null,
  questionsPerPlay: 10,
  questions: makeRiders(
    [{ sec: 4, ex: 1 }, { sec: 4, ex: 3 }, { sec: 4, ex: 4 }, { sec: 4, ex: 5 }, { sec: 4, ex: 7 }, { sec: 4, ex: 8 }, { sec: 4, ex: 12 },
     { sec: 2, ex: 6 }, { sec: 2, ex: 7 }, { sec: 2, ex: 8 }],
    AC, "r20"),
};
