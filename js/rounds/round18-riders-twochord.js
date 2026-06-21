/* PHASE 2 · Round (id r18) — Two-chord riders (multi-step).
   From section 2 of the tan-chord set: two chords at the point of contact,
   combining the tan-chord theorem with ∠s on a straight line and the angle
   sum of a triangle. Pick the final answer; full working revealed. */
import { makeRiders } from "./riders.js";
const AC = "#f76707";

export const round = {
  id: "r18", n: 18, phase: 2, accent: AC,
  title: { en: "Two-chord riders", af: "Twee-koord vraagstukke" },
  blurb: { en: "Two chords at the contact point — multi-step.", af: "Twee koorde by die raakpunt — veelstap." },
  reasonCode: null,
  questionsPerPlay: 10,
  questions: makeRiders(
    [{ sec: 1, ex: 2 }, { sec: 1, ex: 3 }, { sec: 1, ex: 4 }, { sec: 1, ex: 5 }, { sec: 1, ex: 9 }, { sec: 1, ex: 10 }, { sec: 1, ex: 11 },
     { sec: 2, ex: 0 }, { sec: 2, ex: 1 }, { sec: 2, ex: 2 }],
    AC, "r18"),
};
