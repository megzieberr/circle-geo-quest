/* Dynamic Geometry dg3 — "Her method drill"  (DYNAMIC-GEO-PLAN.md §2)
   ------------------------------------------------------------------------
   dg2 showed WHY an arc length survives being unrolled. This round drills
   HER method (workbook p.100) exactly, on a fresh figure, static and
   verify-node-checkable: central angle of the swept arc → θ/360 → × 2πr.
   Every panel is tap-only (blank numpad or choice) — no typing.

   THE MATHS, worked by hand so verify-node.mjs can check every diagram:
     A = 200°, B = 335° → minor arc AB (the swept arc) = 335 − 200 = 135°.
     P = 80°, on the MAJOR arc (well outside [200°,335°]) → ∠APB = ½·135
       = 67.5° (∠ at centre = 2 × ∠ at circumference, read BACKWARDS: the
       inscribed angle is given, the central angle is what step 1 finds).
     r = 8 units (stated on the figure via the engine's d.key — symbol-only,
       language-neutral, same convention as every other value key in the
       app; see engine.js's keySVG header note).
     Step 1 — central angle: ∠AOB = 2 × 67.5° = 135°.
     Step 2 — fraction: 135/360.
     Step 3 — length: 135/360 × 2π×8 = 6π ≈ 18.8496… → 18.85 (2dp), the
       SAME number dg2's "highlighted length" readout held steady at
       through the whole scrub — this round is that number, done by hand.

   Distractors in panel 4 are the classic slips (her brief, verbatim):
   θ/360 of the diameter instead of 2πr (135/360 × 16 = 6), 360−θ instead
   of θ (225/360 × 2π×8 = 10π ≈ 31.42), the whole circumference with no
   fraction applied at all (2π×8 = 16π ≈ 50.27), and the fraction alone
   with the × 2πr step dropped (135/360 = 0.375, shown as "0.38"). */
const AC = "#f76707";
const HILITE = "#0ea271";

const A_DEG = 200, B_DEG = 335, P_DEG = 80;
const SWEEP = B_DEG - A_DEG;          // 135
const R_UNITS = 8;

/* ---- panel 2: find θ. ∠APB given, ∠AOB unknown — the reverse read of
   "∠ at centre = 2 × ∠ at circumference" that r3/dCentre already taught. */
const FIG_FIND_THETA = {
  pts: { A: A_DEG, B: B_DEG, P: P_DEG }, O: true,
  chords: [["A", "B"], ["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"]],
  angles: [
    { at: "P", legs: ["A", "B"], t: "67.5°", o: { v: 67.5 } },
    { at: "O", legs: ["A", "B"], t: "?", o: { v: 135, hl: HILITE } },
  ],
};

/* ---- panels 3–4: θ found, P dropped for a clean sector picture — the
   highlight wedge IS the swept arc's sector, and the key states r = 8. */
const FIG_SECTOR = {
  pts: { A: A_DEG, B: B_DEG }, O: true,
  chords: [["A", "B"], ["O", "A"], ["O", "B"]],
  angles: [{ at: "O", legs: ["A", "B"], t: "135°", o: { v: 135, hl: HILITE } }],
  key: [{ t: "r = 8", c: "#2b2f4a" }],
};

export const round = {
  id: "dg3", n: 0, accent: AC, kind: "dynamic", group: "g8",
  title: { en: "Her method drill", af: "Haar metode-oefening" },
  blurb: {
    en: "Central angle → θ/360 → × 2πr. Her exact method, on a fresh figure, all taps.",
    af: "Middelpunthoek → θ/360 → × 2πr. Haar presiese metode, op 'n vars figuur, alles tikke.",
  },
  panels: [

    /* ---------- 1 · the method, named up front (a drill, not a discovery) ---------- */
    {
      type: "note",
      prompt: { en: "Her method, three steps", af: "Haar metode, drie stappe" },
      note: {
        en: "Every arc-length question in the booklet works the same way, every time: find the central angle of the swept arc, turn it into the fraction θ/360 of the whole circle, then multiply that fraction by the whole circumference 2πr. Same three steps, on a fresh figure.",
        af: "Elke boog-lengte-vraag in die boekie werk elke keer op dieselfde manier: vind die middelpunthoek van die boog wat afgelê is, verander dit in die breuk θ/360 van die hele sirkel, en vermenigvuldig dan daardie breuk met die hele omtrek 2πr. Dieselfde drie stappe, op 'n vars figuur.",
      },
    },

    /* ---------- 2 · step 1, the central angle (reverse-read the theorem) ---------- */
    {
      type: "blank",
      prompt: { en: "Step 1: find the central angle of the swept arc AB.", af: "Stap 1: vind die middelpunthoek van die boog AB wat afgelê is." },
      diagram: FIG_FIND_THETA,
      sentence: [
        { en: "∠AOB = ", af: "∠AOB = " },
        { kind: "num", answer: 135, unit: "°" },
      ],
      hints: [
        { en: "∠APB is the angle at the CIRCUMFERENCE, and ∠AOB is the angle at the CENTRE, both standing on the same arc AB. What connects those two?", af: "∠APB is die hoek by die OMTREK, en ∠AOB is die hoek by die MIDDELPUNT, en albei staan op dieselfde boog AB. Wat verbind daardie twee?" },
        { en: "∠ at centre = 2 × ∠ at circumference. ∠APB = 67.5°, so ∠AOB = 2 × 67.5°.", af: "Midpt∠ = 2 × Omtreks∠. ∠APB = 67.5°, dus ∠AOB = 2 × 67.5°." },
      ],
      reason: "centreDouble",
      note: {
        en: "∠AOB = 135°. The angle at the centre is always double the angle at the circumference, standing on the same arc — 2 × 67.5° = 135°. That 135° is the number every remaining step is built from.",
        af: "∠AOB = 135°. Die hoek by die middelpunt is altyd dubbel die hoek by die omtrek, wat op dieselfde boog staan — 2 × 67.5° = 135°. Daardie 135° is die getal waarop elke oorblywende stap gebou is.",
      },
    },

    /* ---------- 3 · step 2, the fraction ---------- */
    {
      type: "choice",
      prompt: { en: "Step 2: what fraction of the whole circle does arc AB take up?", af: "Stap 2: watter breuk van die hele sirkel maak boog AB op?" },
      diagram: FIG_SECTOR,
      options: [
        { text: { en: "135/360", af: "135/360" }, correct: true },
        { text: { en: "67.5/360 — the angle before it was doubled.", af: "67.5/360 — die hoek voordat dit verdubbel is." } },
        { text: { en: "225/360 — using 360 − θ instead of θ.", af: "225/360 — deur 360 − θ te gebruik in plaas van θ." } },
        { text: { en: "135/180 — over a semicircle's angle, not the full circle.", af: "135/180 — oor 'n halfsirkel se hoek, nie die hele sirkel nie." } },
      ],
      hints: [
        { en: "The angle sitting at the top of the fraction is the one you just found in Step 1 — read it straight off the figure.", af: "Die hoek bo-in die breuk is die een wat jy nou net in Stap 1 gevind het — lees dit reguit van die figuur af." },
        { en: "A full turn all the way around a circle is always 360°, whatever the figure — that is what goes on the bottom.", af: "'n Volle draai heeltemal om 'n sirkel is altyd 360°, ongeag die figuur — dit is wat onder gaan." },
      ],
      note: {
        en: "135/360. The central angle you found in Step 1 goes on top, and a full turn — always 360° — goes on the bottom. This fraction alone already tells you what SHARE of the circle's whole distance around belongs to arc AB.",
        af: "135/360. Die middelpunthoek wat jy in Stap 1 gevind het, gaan bo, en 'n volle draai — altyd 360° — gaan onder. Hierdie breuk alleen vertel jou reeds watter AANDEEL van die sirkel se hele afstand rondom aan boog AB behoort.",
      },
    },

    /* ---------- 4 · step 3, the length — the classic slips as distractors ---------- */
    {
      type: "choice",
      prompt: { en: "Step 3: r = 8. What is the length of arc AB?", af: "Stap 3: r = 8. Wat is die lengte van boog AB?" },
      diagram: FIG_SECTOR,
      options: [
        { text: { en: "≈ 18.85 units — 135/360 × 2π(8)", af: "≈ 18.85 eenhede — 135/360 × 2π(8)" }, correct: true },
        { text: { en: "6 units — 135/360 × the diameter, 16", af: "6 eenhede — 135/360 × die deursnee, 16" } },
        { text: { en: "≈ 31.42 units — 225/360 × 2π(8), using 360 − θ", af: "≈ 31.42 eenhede — 225/360 × 2π(8), deur 360 − θ te gebruik" } },
        { text: { en: "≈ 50.27 units — the whole circumference 2π(8), no fraction applied", af: "≈ 50.27 eenhede — die hele omtrek 2π(8), geen breuk toegepas nie" } },
        { text: { en: "0.38 — the fraction 135/360 on its own, never multiplied by 2πr", af: "0.38 — die breuk 135/360 alleen, nooit met 2πr vermenigvuldig nie" } },
      ],
      hints: [
        { en: "Multiply the fraction from Step 2 by the WHOLE circumference — that is 2πr, never the diameter on its own, and never r on its own.", af: "Vermenigvuldig die breuk van Stap 2 met die HELE omtrek — dit is 2πr, nooit die deursnee alleen nie, en nooit r alleen nie." },
        { en: "2π(8) is the length of the ENTIRE circle. Arc AB is only 135/360 of that whole distance.", af: "2π(8) is die lengte van die HELE sirkel. Boog AB is net 135/360 van daardie hele afstand." },
      ],
      note: {
        en: "≈ 18.85 units. The fraction from Step 2 always multiplies the WHOLE circumference, 2πr: 135/360 × 2π(8) = 6π ≈ 18.85. Every other option skips or swaps one piece of that — the diameter instead of 2πr, the wrong angle, no fraction at all, or the fraction with nothing multiplied onto it.",
        af: "≈ 18.85 eenhede. Die breuk van Stap 2 vermenigvuldig altyd die HELE omtrek, 2πr: 135/360 × 2π(8) = 6π ≈ 18.85. Elke ander opsie slaan een stuk daarvan oor of verruil dit — die deursnee in plaas van 2πr, die verkeerde hoek, geen breuk nie, of die breuk met niks daarmee vermenigvuldig nie.",
      },
    },

    /* ---------- 5 · closing note ---------- */
    {
      type: "note",
      prompt: { en: "Three steps, every time", af: "Drie stappe, elke keer" },
      note: {
        en: "Central angle → θ/360 → × 2πr. That is the whole method, and it never changes — only the numbers on the figure do. You watched dg2 hold this exact length steady through an entire unroll; here you found the same 18.85 by hand, three steps, no picture needed to move at all.",
        af: "Middelpunthoek → θ/360 → × 2πr. Dit is die hele metode, en dit verander nooit — net die getalle op die figuur verander. Jy het dg2 hierdie presiese lengte deur 'n hele oopvou sien standhou; hier het jy dieselfde 18.85 met die hand gevind, drie stappe, sonder dat die prentjie hoegenaamd moes beweeg.",
      },
    },

  ],
};
