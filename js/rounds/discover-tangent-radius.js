/* DISCOVERY — Tangent ⊥ radius, DERIVED from tan-chord (Socratic).
   We don't tell them it's 90° — we ask. Diameter TD through the contact point T.
   1) Drag P, then work out ∠TPD yourself (angle in a semicircle).
   2) Draw the tangent — it makes two angles with the diameter, T₁ and T₂.
   3) Which is the tangent–chord angle in the alternate segment to P? (T₂)
   4) By tan-chord, T₂ = ∠P, so T₂ = 90° → the tangent is ⊥ to the radius.
   The learner chains the two theorems they already own. Not graded. */
const AC = "#f76707";
const ORANGE = "#f76707", BLUE = "#4263eb", PURPLE = "#9c36b5", GREEN = "#0ea271", INK = "#252a4a";

// explore: diameter TD, drag P. ∠TPD is shown as a plain arc — no value, no
// right-angle square — so they must recall the semicircle theorem themselves.
const MODEL = () => ({
  w: 336, h: 300, cx: 168, cy: 140, R: 98,
  fixed: { O: true, pts: { T: 270, D: 90 } },
  handles: [{ id: "P", kind: "arc", min: 110, max: 250, init: 175 }],
  frame(pos, ctx) {
    const T = ctx.P("T"), D = ctx.P("D"), P = pos.P;
    return {
      segments: [
        { x1: T.x, y1: T.y, x2: D.x, y2: D.y, cls: "accent" },          // diameter TD
        { x1: P.x, y1: P.y, x2: T.x, y2: T.y, cls: "thin", color: BLUE },
        { x1: P.x, y1: P.y, x2: D.x, y2: D.y, cls: "thin", color: BLUE },
      ],
      angles: [{ vx: P.x, vy: P.y, ux: T.x, uy: T.y, wx: D.x, wy: D.y, color: BLUE }],   // plain arc, no value
      dots: [
        { x: T.x, y: T.y, color: INK, label: "T", dx: 0, dy: 18 },
        { x: D.x, y: D.y, color: INK, label: "D", dx: 0, dy: -10 },
        { x: P.x, y: P.y, color: INK, label: "P", dx: -13, dy: 2 },
      ],
    };
  },
  measure() { return {}; },
  readouts() { return [{ label: { en: "∠TPD as you drag P", af: "∠TPD terwyl jy P sleep" }, value: { en: "always the same…", af: "altyd dieselfde…" } }]; },
});

// no tangent yet — they answer ∠TPD from the semicircle theorem
const D_ASK = { O: true, pts: { T: 270, D: 90, P: 175 }, chords: [["T", "D"], ["P", "T"], ["P", "D"]],
  angles: [{ at: "P", legs: ["T", "D"], t: "?", o: { c: BLUE } }] };
// tangent drawn, two angles T₁ (left) and T₂ (right) with the diameter
const D_TAN = { O: true, pts: { T: 270, D: 90, P: 175 }, tang: [{ at: "T", lab: ["S", "U"] }], chords: [["T", "D"], ["P", "T"], ["P", "D"]],
  angles: [
    { at: "P", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: BLUE } },
    { at: "T", legs: ["tg-", "D"], t: "T₁", o: { c: PURPLE } },
    { at: "T", legs: ["tg+", "D"], t: "T₂", o: { c: GREEN } },
  ] };

export const round = {
  id: "dtanrad", n: 1, accent: AC, kind: "discover", group: "g3",
  title: { en: "Discover: tangent ⊥ radius", af: "Ontdek: raaklyn ⊥ radius" },
  blurb: { en: "Build it yourself from tan-chord and the semicircle.", af: "Bou dit self uit raaklyn-koord en die halfsirkel." },
  panels: [
    { type: "explore",
      prompt: { en: "TD is a diameter — drag P", af: "TD is 'n middellyn — sleep P" },
      instruction: { en: "P is joined to both ends of the diameter TD. Drag P around — does ∠TPD ever change? In a moment you'll work out exactly what it is.", af: "P is aan albei punte van die middellyn TD verbind. Sleep P rond — verander ∠TPD ooit? Netnou werk jy presies uit wat dit is." },
      interactive: MODEL() },

    { type: "blank",
      prompt: { en: "So… what is ∠TPD?", af: "So… wat is ∠TPD?" },
      diagram: D_ASK,
      sentence: [
        { en: "TD is a diameter, so ∠TPD is the angle in a semicircle. ∠TPD = ", af: "TD is 'n middellyn, dus is ∠TPD die hoek in 'n halfsirkel. ∠TPD = " },
        { kind: "num", answer: 90, unit: "°" },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "Which theorem is about a diameter and a point on the circle? The angle in a semicircle is always…?", af: "Watter stelling gaan oor 'n middellyn en 'n punt op die sirkel? Die hoek in 'n halfsirkel is altyd…?" },
      ],
      reason: "semiCircle",
      note: { en: "∠TPD = 90° — the angle in a semicircle.", af: "∠TPD = 90° — die hoek in 'n halfsirkel." } },

    { type: "choice",
      prompt: { en: "Now draw the tangent — which angle equals ∠P?", af: "Trek nou die raaklyn — watter hoek is gelyk aan ∠P?" },
      diagram: D_TAN,
      options: [
        { text: { en: "T₂ — the right-hand angle (its alternate segment holds P)", af: "T₂ — die regterhandse hoek (sy oorstaande segment bevat P)" }, correct: true },
        { text: { en: "T₁ — the left-hand angle (same side as P)", af: "T₁ — die linkerhandse hoek (dieselfde kant as P)" } },
      ],
      hints: [
        { en: "Tan-chord links a tangent–chord angle to the angle in the OPPOSITE segment. P is on the LEFT, so its matching angle is on the…?", af: "Raaklyn-koord koppel 'n raaklyn–koord-hoek aan die hoek in die TEENOORGESTELDE segment. P is aan die LINKERKANT, so sy passende hoek is aan die…?" },
      ],
      reason: "tanChord",
      note: { en: "T₂ is the tangent–chord angle whose alternate segment contains P, so T₂ = ∠TPD.", af: "T₂ is die raaklyn–koord-hoek wie se oorstaande segment P bevat, dus T₂ = ∠TPD." } },

    { type: "blank",
      prompt: { en: "Use the tan-chord theorem on T₂", af: "Gebruik die raaklyn-koord-stelling op T₂" },
      diagram: D_TAN,
      sentence: [
        { en: "By the tan-chord theorem, T₂ = ∠TPD (the angle in the alternate segment). So T₂ = ", af: "Deur die raaklyn-koord-stelling, T₂ = ∠TPD (die hoek in die oorstaande segment). So T₂ = " },
        { kind: "num", answer: 90, unit: "°" },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "You already found ∠TPD. Tan-chord says T₂ equals it.", af: "Jy het ∠TPD reeds gevind. Raaklyn-koord sê T₂ is daaraan gelyk." },
      ],
      reason: "tanChord",
      note: { en: "T₂ = ∠TPD = 90°.", af: "T₂ = ∠TPD = 90°." } },

    { type: "blank",
      prompt: { en: "Finish the argument", af: "Voltooi die argument" },
      diagram: D_TAN,
      sentence: [
        { en: "T₂ = 90°, and the diameter TD lies along the radius OT. So the tangent is ", af: "T₂ = 90°, en die middellyn TD lê langs die radius OT. So die raaklyn is " },
        { kind: "word", answer: "perpendicular", options: ["perpendicular", "parallel", "equal", "opposite", "tangent", "double"] },
        { en: " to the radius.", af: " op die radius." },
      ],
      hints: [
        { en: "A 90° angle between two lines means they are…?", af: "'n 90°-hoek tussen twee lyne beteken hulle is…?" },
      ],
      reason: "tanRadius",
      note: { en: "Tangent ⊥ radius — and YOU derived it, from the tan-chord theorem and the angle in a semicircle! Reason: <i>tan ⊥ radius</i>.", af: "Raaklyn ⊥ radius — en JY het dit afgelei, uit die raaklyn-koord-stelling en die hoek in 'n halfsirkel! Rede: <i>raaklyn ⊥ radius</i>." } },
  ],
};
