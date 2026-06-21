/* DISCOVERY — Angle at the centre = 2 × angle at the circumference.
   ALL THREE points move: drag A and B (the chord ends) to change the central
   angle, and drag P (on the circle) — ∠AOB stays exactly double ∠APB no matter
   what. Also teaches what "subtends" means. Guided, not graded.
   A is kept on the lower-left arc, B on the lower-right, P on the top arc, so
   the central angle is never reflex and the relationship is always clean. */
const AC = "#f76707";
const ORANGE = "#f76707", BLUE = "#4263eb", INK = "#252a4a";

const MODEL = () => ({
  w: 340, h: 304, cx: 168, cy: 152, R: 100,
  fixed: { O: true },
  handles: [
    { id: "A", kind: "arc", min: 188, max: 250, init: 214 },
    { id: "B", kind: "arc", min: 290, max: 352, init: 326 },
    { id: "P", kind: "arc", min: 22, max: 158, init: 90 },
  ],
  frame(pos, ctx, m) {
    const O = ctx.P("O"), A = pos.A, B = pos.B, P = pos.P;
    return {
      segments: [
        { x1: A.x, y1: A.y, x2: B.x, y2: B.y, cls: "faint" },   // chord AB
        { x1: O.x, y1: O.y, x2: A.x, y2: A.y, cls: "thin" },     // radius OA
        { x1: O.x, y1: O.y, x2: B.x, y2: B.y, cls: "thin" },     // radius OB
        { x1: P.x, y1: P.y, x2: A.x, y2: A.y, cls: "thin" },     // PA
        { x1: P.x, y1: P.y, x2: B.x, y2: B.y, cls: "thin" },     // PB
      ],
      angles: [
        { vx: O.x, vy: O.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: ORANGE, label: Math.round(m.centre) + "°" },
        { vx: P.x, vy: P.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: BLUE, label: Math.round(m.circ) + "°" },
      ],
      dots: [
        { x: A.x, y: A.y, color: INK, label: "A", dx: -14, dy: 5 },
        { x: B.x, y: B.y, color: INK, label: "B", dx: 13, dy: 5 },
        { x: P.x, y: P.y, color: INK, label: "P", dx: 0, dy: -15 },
      ],
    };
  },
  measure(pos, ctx) {
    const O = ctx.P("O"), A = pos.A, B = pos.B, P = pos.P;
    const centre = ctx.angleAt(O, A, B), circ = ctx.angleAt(P, A, B);
    return { centre, circ, ratio: circ ? centre / circ : 0 };
  },
  // deliberately NO ratio readout — the learner must spot the "double"
  // relationship themselves by watching the two angles.
  readouts(m) {
    return [
      { label: { en: "∠AOB  at the centre", af: "∠AOB  by die middelpunt" }, value: Math.round(m.centre) + "°", color: ORANGE },
      { label: { en: "∠APB  at the circumference", af: "∠APB  by die omtrek" }, value: Math.round(m.circ) + "°", color: BLUE },
    ];
  },
});

export const round = {
  id: "dcentre", n: 1, accent: AC, kind: "discover", group: "g1",
  title: { en: "Discover: angle at the centre", af: "Ontdek: hoek by die middelpunt" },
  blurb: { en: "Drag A, B and P — find how the two angles on chord AB compare.", af: "Sleep A, B en P — vind hoe die twee hoeke op koord AB vergelyk." },
  panels: [
    { type: "explore",
      prompt: { en: "Chord AB makes two angles", af: "Koord AB maak twee hoeke" },
      instruction: { en: "∠AOB (orange) is at the centre; ∠APB (blue) is on the circle. Drag A and B to change the chord, and drag P around the top. Watch the two angle numbers — can you spot how they always compare?", af: "∠AOB (oranje) is by die middelpunt; ∠APB (blou) is op die sirkel. Sleep A en B om die koord te verander, en sleep P om die bokant. Let op die twee hoekgetalle — kan jy sien hoe hulle altyd vergelyk?" },
      interactive: MODEL() },

    { type: "note",
      prompt: { en: "What does \"subtends\" mean?", af: "Wat beteken \"onderspan\"?" },
      note: { en: "Chord <b>AB</b> <i>subtends</i> ∠AOB at the centre and ∠APB on the circle. \"Subtends\" just means the chord's two ends, A and B, are the arms of the angle. Both angles stand on the <b>same chord AB</b>.", af: "Koord <b>AB</b> <i>onderspan</i> ∠AOB by die middelpunt en ∠APB op die sirkel. \"Onderspan\" beteken net die koord se twee punte, A en B, is die bene van die hoek. Albei hoeke staan op <b>dieselfde koord AB</b>." } },

    { type: "blank",
      prompt: { en: "Fill in the pattern you saw", af: "Vul die patroon in wat jy gesien het" },
      interactive: MODEL(),
      sentence: [
        { en: "The angle at the centre is ", af: "Die hoek by die middelpunt is " },
        { kind: "word", answer: "double", options: ["double", "half", "equal", "triple", "same", "bigger"] },
        { en: " the angle at the circumference (on the same chord).", af: " die hoek by die omtrek (op dieselfde koord)." },
      ],
      hints: [
        { en: "Pick a position and compare the two angles. Try dividing the centre angle by the circumference angle — what do you get? Drag and try a few.", af: "Kies 'n posisie en vergelyk die twee hoeke. Probeer die middelpuntshoek deur die omtrekshoek deel — wat kry jy? Sleep en probeer 'n paar." },
        { en: "However you drag it, the centre angle is always 2 times the circumference angle — that is 'double'.", af: "Hoe jy dit ook al sleep, die middelpuntshoek is altyd 2 keer die omtrekshoek — dit is 'dubbel'." },
      ],
      reason: "centreDouble",
      note: { en: "∠ at centre = 2 × ∠ at circumference — true for every chord you tried. (And ∠APB stayed equal for any P on the same arc — same segment.)", af: "∠ by middelpunt = 2 × ∠ by omtrek — waar vir elke koord wat jy probeer het. (En ∠APB het gelyk gebly vir enige P op dieselfde boog — selfde segment.)" } },

    { type: "blank",
      prompt: { en: "Try it with a number", af: "Probeer dit met 'n getal" },
      // geometry matches the numbers: arc gives ∠AOB = 80°, so ∠APB = 40°
      diagram: { O: true, pts: { A: 230, B: 310, P: 90 }, chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
        angles: [{ at: "O", legs: ["A", "B"], t: "", o: { v: 80 } }, { at: "P", legs: ["A", "B"], t: "40°", o: { v: 40 } }] },
      sentence: [
        { en: "If the angle at the circumference is 40°, then the angle at the centre is ", af: "As die hoek by die omtrek 40° is, dan is die hoek by die middelpunt " },
        { kind: "num", answer: 80, unit: "°" },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "Centre = 2 × circumference. Work out 2 × 40.", af: "Middelpunt = 2 × omtrek. Bereken 2 × 40." },
      ],
      reason: "centreDouble",
      note: { en: "Centre = 2 × 40° = 80°. Reason: ∠ at centre = 2 × ∠ at circumference.", af: "Middelpunt = 2 × 40° = 80°. Rede: middelpuntshoek = 2 × omtrekshoek." } },
  ],
};
