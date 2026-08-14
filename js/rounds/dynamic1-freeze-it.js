/* Dynamic Geometry dg1 — "Freeze it"  (DYNAMIC-GEO-PLAN.md §1)
   ------------------------------------------------------------------------
   Movie first, snapshot second (her exact phrase, 2026-08-14). dg0 showed
   the motion; this round glides C to a stop, freezes it there, and asks
   the booklet-style questions on the now-familiar still figure — answered
   with theorems the learner already knows (∠s in the same segment, opp
   ∠s of a cyclic quad), not new ones.

   Renders through renderInvestigate() the same way dg0 does. Fresh
   letters and fresh degrees from dg0's (A/B/C there were 200/340/60) —
   nothing here is the same question run twice.

   THE MATHS, worked by hand so verify-node.mjs can check every static
   diagram against it (the movie panel is exempt — draggable panels
   compute live and cannot disagree with themselves):
     A = 190°, B = 320° → minor arc AB = 320−190 = 130°, major arc = 230°.
     C = 40°  (major arc) → ∠ACB = ½·130 = 65°.
     D = 100° (major arc, SAME side as C) → ∠ADB = ½·130 = 65° too
       (∠s in the same segment).
     E = 250° (minor arc, the OTHER side) → ∠AEB = ½·230 = 115°
       (opp ∠s of cyclic quad: 65 + 115 = 180 ✓).
   The movie panel's glide lands C at exactly 40°, on purpose — the
   "frozen" static figure in every panel after it is the SAME position the
   learner just watched it stop at, not a different one swapped in. */
const AC = "#f76707";

/* ---- the movie: glides C to a stop at exactly 40°, the freeze point ----
   Deliberately stays on ONE arc throughout (100° → 40°, both on the major
   arc) — this round's job is the booklet questions, not a second look at
   the jump dg0 already covered. The constant readout during the glide is
   itself a quiet callback to dg0's discovery. */
function makeMovieModel() {
  return {
    w: 344, h: 300, cx: 172, cy: 150, R: 104,
    fixed: { pts: { A: 190, B: 320 }, chords: [["A", "B"]] },
    handles: [{ id: "C", kind: "circle", init: 100 }],
    measure(pos, ctx) {
      const A = ctx.P("A"), B = ctx.P("B"), C = pos.C;
      return { angle: ctx.angleAt(C, A, B) };
    },
    frame(pos, ctx, m) {
      const A = ctx.P("A"), B = ctx.P("B"), C = pos.C;
      return {
        segments: [
          { x1: C.x, y1: C.y, x2: A.x, y2: A.y, cls: "thin" },
          { x1: C.x, y1: C.y, x2: B.x, y2: B.y, cls: "thin" },
        ],
        angles: [{ vx: C.x, vy: C.y, ux: A.x, uy: A.y, wx: B.x, wy: B.y, color: "#f76707", label: Math.round(m.angle) + "°" }],
        dots: [{ x: C.x, y: C.y, color: "#252a4a", label: "C", dx: 12, dy: -10 }],
      };
    },
    readouts(m) {
      return [{ label: { en: "∠ACB", af: "∠ACB" }, value: Math.round(m.angle) + "°", color: "#f76707", big: true }];
    },
    glide: { handleId: "C", from: 100, to: 40, duration: 6000 },
  };
}

/* ---- the frozen still figures — static, declared, verify-node checked ---- */
const FIG_C_ONLY = {
  pts: { A: 190, B: 320, C: 40 },
  chords: [["A", "B"], ["C", "A"], ["C", "B"]],
  angles: [{ at: "C", legs: ["A", "B"], t: "65°", o: { v: 65 } }],
};
const FIG_ASK_D = {
  pts: { A: 190, B: 320, C: 40, D: 100 },
  chords: [["A", "B"], ["C", "A"], ["C", "B"], ["D", "A"], ["D", "B"]],
  angles: [
    { at: "C", legs: ["A", "B"], t: "65°", o: { v: 65 } },
    { at: "D", legs: ["A", "B"], t: "?", o: {} },
  ],
};
const FIG_D_DONE = {
  pts: { A: 190, B: 320, C: 40, D: 100 },
  chords: [["A", "B"], ["C", "A"], ["C", "B"], ["D", "A"], ["D", "B"]],
  angles: [
    { at: "C", legs: ["A", "B"], t: "65°", o: { v: 65 } },
    { at: "D", legs: ["A", "B"], t: "65°", o: { v: 65 } },
  ],
};
const FIG_ASK_E = {
  pts: { A: 190, B: 320, C: 40, E: 250 },
  chords: [["A", "B"], ["C", "A"], ["C", "B"], ["E", "A"], ["E", "B"]],
  angles: [
    { at: "C", legs: ["A", "B"], t: "65°", o: { v: 65 } },
    { at: "E", legs: ["A", "B"], t: "?", o: {} },
  ],
};

export const round = {
  id: "dg1", n: 0, accent: AC, kind: "dynamic", group: "g8",
  title: { en: "Freeze it", af: "Vries dit" },
  blurb: {
    en: "Watch it glide to a stop — then answer the booklet-style questions on the frozen figure.",
    af: "Kyk dit gly tot stilstand — beantwoord dan die handboek-styl vrae op die bevrore figuur.",
  },
  panels: [

    /* ---------- 1 · the movie ---------- */
    {
      type: "explore",
      prompt: { en: "Watch it glide to a stop", af: "Kyk dit gly tot stilstand" },
      instruction: {
        en: "Tap ▶ and watch C glide across the arc — or drag it yourself. When it settles, look carefully: this exact figure is what the next few questions are about.",
        af: "Tik ▶ en kyk hoe C oor die boog gly — of drag dit self. Wanneer dit tot rus kom, kyk mooi: hierdie presiese figuur is waaroor die volgende paar vrae gaan.",
      },
      interactive: makeMovieModel(),
    },

    /* ---------- 2 · the freeze moment ---------- */
    {
      type: "note",
      prompt: { en: "Frozen — right where it stopped", af: "Bevries — presies waar dit gestop het" },
      diagram: FIG_C_ONLY,
      note: {
        en: "That is the exact spot C glided to. ∠ACB = 65° — check that against what the readout showed you. From here it is just a picture, and every theorem you already know still applies to it.",
        af: "Dit is die presiese plek waarheen C gegly het. ∠ACB = 65° — gaan dit na teen wat die lesing jou gewys het. Van hier af is dit net 'n prentjie, en elke stelling wat jy reeds ken, geld steeds daarvoor.",
      },
    },

    /* ---------- 3 · D, same segment as C ---------- */
    {
      type: "blank",
      prompt: { en: "D sits on the SAME arc as C", af: "D sit op DIESELFDE boog as C" },
      diagram: FIG_ASK_D,
      sentence: [
        { en: "∠ADB = ", af: "∠ADB = " },
        { kind: "num", answer: 65, unit: "°" },
      ],
      hints: [
        { en: "C and D are on the same arc, both looking at the same chord AB. What did dg0 just show you about that?", af: "C en D is op dieselfde boog, en kyk albei na dieselfde koord AB. Wat het dg0 jou nou net daaroor gewys?" },
        { en: "Same segment, same chord — the angle cannot be anything other than what ∠ACB already is.", af: "Dieselfde segment, dieselfde koord — die hoek kan nie iets anders wees as wat ∠ACB reeds is nie." },
      ],
      reason: "sameSeg",
      note: {
        en: "∠ADB = ∠ACB = 65°, because C and D stand on the same arc and subtend the same chord AB — ∠s in the same segment. You watched this exact invariance in dg0; here it is the actual answer to an actual question.",
        af: "∠ADB = ∠ACB = 65°, want C en D staan op dieselfde boog en span dieselfde koord AB op — ∠e in dieselfde segment. Jy het presies hierdie onveranderlikheid in dg0 gesien; hier is dit die werklike antwoord op 'n werklike vraag.",
      },
    },

    /* ---------- 4 · E, the other arc ---------- */
    {
      type: "blank",
      prompt: { en: "E sits on the OTHER arc", af: "E sit op die ANDER boog" },
      diagram: FIG_ASK_E,
      sentence: [
        { en: "∠AEB = ", af: "∠AEB = " },
        { kind: "num", answer: 115, unit: "°" },
      ],
      hints: [
        { en: "E is across chord AB from C — this is the jump dg0 showed you, not the invariance.", af: "E is oorkant koord AB van C af — dit is die sprong wat dg0 jou gewys het, nie die onveranderlikheid nie." },
        { en: "ACBE is a cyclic quadrilateral, and ∠ACB and ∠AEB are its opposite angles — they add to 180°. 180 − 65 = 115.", af: "ACBE is 'n koordevierhoek, en ∠ACB en ∠AEB is sy teenoorstaande hoeke — hulle tel op tot 180°. 180 − 65 = 115." },
      ],
      reason: "cyclicOpp",
      note: {
        en: "∠AEB = 115°. A, C, B and E in order around the circle form a cyclic quadrilateral, and ∠ACB and ∠AEB are its opposite angles — opposite angles of a cyclic quad add to 180°, and 65 + 115 = 180.",
        af: "∠AEB = 115°. A, C, B en E in volgorde om die sirkel vorm 'n koordevierhoek, en ∠ACB en ∠AEB is sy teenoorstaande hoeke — teenoorstaande hoeke van 'n koordevierhoek tel op tot 180°, en 65 + 115 = 180.",
      },
    },

    /* ---------- 5 · name the reason, D's case ---------- */
    {
      type: "choice",
      prompt: { en: "Which reason justifies ∠ADB = ∠ACB?", af: "Watter rede regverdig ∠ADB = ∠ACB?" },
      diagram: FIG_D_DONE,
      options: [
        { text: { en: "∠s in the same segment — C and D both stand on chord AB from the same arc.", af: "∠e in dieselfde segment — C en D staan albei op koord AB vanaf dieselfde boog." }, correct: true },
        { text: { en: "Opp ∠s of a cyclic quad — ACBD happens to be a cyclic quadrilateral.", af: "Teenoorst. ∠e van 'n koordevierhoek — ACBD is toevallig 'n koordevierhoek." } },
        { text: { en: "∠s on a straight line — A, D and B happen to line up.", af: "∠e op 'n reguit lyn — A, D en B lê toevallig in 'n ry." } },
        { text: { en: "Tan-chord theorem — AB happens to act as a tangent at C.", af: "Raaklyn-koord stelling — AB tree toevallig op as raaklyn by C." } },
      ],
      hints: [
        { en: "Look at where C and D actually sit relative to the chord — same side, or opposite sides?", af: "Kyk waar C en D werklik relatief tot die koord sit — dieselfde kant, of teenoorgestelde kante?" },
        { en: "Same arc, same chord, same angle — that pairing has one name.", af: "Dieselfde boog, dieselfde koord, dieselfde hoek — daardie paring het een naam." },
      ],
      reason: "sameSeg",
      note: {
        en: "∠s in the same segment. The other three reasons name real theorems, but none of them describe this figure — C and D are simply two points on the same arc, looking at the same chord.",
        af: "∠e in dieselfde segment. Die ander drie redes benoem regte stellings, maar geeneen van hulle beskryf hierdie figuur nie — C en D is bloot twee punte op dieselfde boog, wat na dieselfde koord kyk.",
      },
    },

    /* ---------- 6 · closing note ---------- */
    {
      type: "note",
      prompt: { en: "Same theorems, a figure you've seen move", af: "Dieselfde stellings, 'n figuur wat jy sien beweeg het" },
      note: {
        en: "Nothing in this round used a new theorem — every answer came from ∠s in the same segment or opp ∠s of a cyclic quad, both things you already knew. What changed is that you watched the figure get to that position, instead of being handed a picture out of nowhere. That is the whole point of dragging and gliding: by the time the booklet asks the question, the figure already makes sense.",
        af: "Niks in hierdie rondte het 'n nuwe stelling gebruik nie — elke antwoord het gekom van ∠e in dieselfde segment of teenoorst. ∠e van 'n koordevierhoek, altwee dinge wat jy reeds geweet het. Wat verander het, is dat jy die figuur na daardie posisie sien beweeg het, in plaas daarvan om 'n prentjie uit die niet gegee te word. Dit is die hele punt van drag en gly: teen die tyd wat die handboek die vraag vra, maak die figuur reeds sin.",
      },
    },

  ],
};
