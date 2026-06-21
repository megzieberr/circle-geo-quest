/* PHASE 2 · Round (id r19) — Diameters & isosceles riders (multi-step).
   From section 4: tan ⊥ diameter, angle in a semicircle, two tangents from a
   point and base angles of isosceles triangles, alongside the tan-chord
   theorem. Pick the final answer; full working revealed. */
import { makeRiders } from "./riders.js";
const AC = "#0ea271";

export const round = {
  id: "r19", n: 19, phase: 2, accent: AC,
  title: { en: "Diameters & isosceles", af: "Middellyne & gelykbenig" },
  blurb: { en: "Tangents, diameters and isosceles triangles.", af: "Raaklyne, middellyne en gelykbenige driehoeke." },
  reasonCode: null,
  questionsPerPlay: 10,
  questions: makeRiders(
    [{ sec: 3, ex: 0 }, { sec: 3, ex: 1 }, { sec: 3, ex: 3 }, { sec: 3, ex: 4 }, { sec: 3, ex: 6 }, { sec: 3, ex: 10 }, { sec: 3, ex: 11 },
     { sec: 2, ex: 3 }, { sec: 2, ex: 4 }, { sec: 2, ex: 5 }],
    AC, "r19"),
};
