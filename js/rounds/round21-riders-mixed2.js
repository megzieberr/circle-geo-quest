/* PHASE 2 · Round (id r21) — Mixed exam riders II (multi-step).
   A second mixed set spanning sections 2, 4 and 5: parallel chords, equal
   tangents, diameters and several inscribed angles together.
   Pick the final answer; full working revealed. */
import { makeRiders } from "./riders.js";
const AC = "#9c36b5";

export const round = {
  id: "r21", n: 21, phase: 2, accent: AC,
  title: { en: "Mixed exam riders II", af: "Gemengde eksamen vraagstukke II" },
  blurb: { en: "More mixed multi-step riders.", af: "Meer gemengde veelstap vraagstukke." },
  reasonCode: null,
  questionsPerPlay: 10,
  questions: makeRiders(
    [{ sec: 3, ex: 5 }, { sec: 3, ex: 8 }, { sec: 4, ex: 9 }, { sec: 4, ex: 10 }, { sec: 4, ex: 13 }, { sec: 1, ex: 6 }, { sec: 4, ex: 11 },
     { sec: 2, ex: 9 }, { sec: 2, ex: 10 }, { sec: 2, ex: 11 }],
    AC, "r21"),
};
