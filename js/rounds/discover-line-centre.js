/* DISCOVERY — Line from the centre to a chord.
   Drag the foot M along the chord. The learner sees the angle the line
   from O makes with the chord, and the two pieces AM and MB it cuts.
   They discover: perpendicular ⇔ bisects, both ways, then meet the two
   formal reasons. Guided, never graded. */
const AC = "#f76707";
const PINK = "#e64980", BLUE = "#4263eb", GREEN = "#0ea271", INK = "#252a4a";

// the two cases, for the summary slide
const CASE_PERP = { O: true, pts: { A: 205, B: 335 }, mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"]], angles: [{ at: "M", legs: ["O", "B"], t: "", o: { v: 90, mark: 1 } }] };
const CASE_MID = { O: true, pts: { A: 205, B: 335 }, mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"]] };

// chord AB low across the circle; M is a handle sliding along it
const MODEL = () => ({
  w: 340, h: 286, cx: 168, cy: 132, R: 96,
  fixed: { O: true, pts: { A: 205, B: 335 }, chords: [["A", "B"]] },
  handles: [{ id: "M", kind: "segment", a: "A", b: "B", min: 0.12, max: 0.88, init: 0.3, snap: [0.5], snapR: 0.045 }],
  frame(pos, ctx, m) {
    const O = ctx.P("O"), A = ctx.P("A"), B = ctx.P("B"), M = pos.M;
    const far = ctx.rayToCircle(ctx.cx, ctx.cy, ctx.R, O.x, O.y, M.x, M.y);
    const sq = Math.abs(m.angle - 90) < 1.2;
    return {
      segments: [
        { x1: M.x, y1: M.y, x2: far.x, y2: far.y, cls: "faint" },
        { x1: O.x, y1: O.y, x2: M.x, y2: M.y, cls: "accent" },
        { x1: A.x, y1: A.y, x2: M.x, y2: M.y, color: PINK, cls: "thick" },
        { x1: M.x, y1: M.y, x2: B.x, y2: B.y, color: BLUE, cls: "thick" },
      ],
      angles: [{ vx: M.x, vy: M.y, ux: O.x, uy: O.y, wx: B.x, wy: B.y, mark: true, color: sq ? GREEN : INK, label: Math.round(m.angle) + "°" }],
      dots: [{ x: M.x, y: M.y, color: INK, label: "M", dx: -4, dy: 20 }],
    };
  },
  measure(pos, ctx) {
    const O = ctx.P("O"), A = ctx.P("A"), B = ctx.P("B"), M = pos.M;
    const am = ctx.dist(A, M), mb = ctx.dist(M, B);
    return { angle: ctx.angleAt(M, O, B), am, mb, diff: Math.abs(am - mb) };
  },
  readouts(m) {
    const sq = Math.abs(m.angle - 90) < 1;       // honest: only at the true perpendicular
    const eq = m.diff < 1;
    return [
      { label: { en: "Angle line makes with chord", af: "Hoek met die koord" }, value: Math.round(m.angle) + "°", hot: sq },
      { label: { en: "Left piece AM", af: "Linkerstuk AM" }, value: Math.round(m.am), color: PINK },
      { label: { en: "Right piece MB", af: "Regterstuk MB" }, value: Math.round(m.mb), color: BLUE },
      { label: { en: "Equal pieces?", af: "Gelyke stukke?" }, value: eq ? "✓ AM = MB" : "✗ not equal", hot: eq },
    ];
  },
});

export const round = {
  id: "dline", n: 1, accent: AC, kind: "discover", group: "g1",
  title: { en: "Discover: line from the centre", af: "Ontdek: lyn vanaf die middelpunt" },
  blurb: { en: "Drag to find the link between the angle and the two pieces.", af: "Sleep om die verband tussen die hoek en die twee stukke te vind." },
  panels: [
    { type: "explore",
      prompt: { en: "Drag M along the chord", af: "Sleep M langs die koord" },
      instruction: { en: "Watch the angle the line from O makes with the chord, and the two pieces AM and MB. Bring the line to where it stands straight up on the chord.", af: "Let op die hoek wat die lyn vanaf O met die koord maak, en die twee stukke AM en MB. Bring die lyn tot waar dit reguit op die koord staan." },
      interactive: MODEL(),
      until: m => Math.abs(m.angle - 90) < 2.5 },

    { type: "blank",
      prompt: { en: "Fill in what you discovered", af: "Vul in wat jy ontdek het" },
      interactive: MODEL(),
      sentence: [
        { en: "A line from the centre that meets a chord at a ", af: "'n Lyn vanaf die middelpunt wat 'n koord teen 'n " },
        { kind: "word", answer: "right", options: ["right", "acute", "obtuse", "straight", "reflex", "equal"] },
        { en: " angle cuts the chord into two ", af: " hoek ontmoet, sny die koord in twee " },
        { kind: "word", answer: "equal", options: ["equal", "unequal", "curved", "smaller", "parallel", "larger"] },
        { en: " parts.", af: " dele." },
      ],
      hints: [
        { en: "Drag M until the angle reads 90°. What kind of angle is exactly 90°?", af: "Sleep M tot die hoek 90° wys. Watter soort hoek is presies 90°?" },
        { en: "At 90°, compare AM and MB in the panel. Are they the same size?", af: "By 90°, vergelyk AM en MB in die paneel. Is hulle dieselfde grootte?" },
      ],
      reason: "centrePerpChord",
      note: { en: "So when the right angle is <b>given</b>, the line from the centre <b>bisects</b> the chord (AM = MB). Reason: <i>line from centre ⊥ to chord</i>.", af: "So wanneer die regte hoek <b>gegee</b> is, <b>halveer</b> die lyn vanaf die middelpunt die koord (AM = MB). Rede: <i>lyn vanuit mdpt ⊥ op koord</i>." } },

    { type: "blank",
      prompt: { en: "Now turn it around", af: "Draai dit nou om" },
      interactive: MODEL(),
      sentence: [
        { en: "If a line from the centre cuts a chord into two equal parts, then it is ", af: "As 'n lyn vanaf die middelpunt 'n koord in twee gelyke dele sny, dan is dit " },
        { kind: "word", answer: "perpendicular", options: ["perpendicular", "parallel", "tangent", "equal", "opposite", "larger"] },
        { en: " to the chord — meeting it at ", af: " op die koord — en ontmoet dit teen " },
        { kind: "num", answer: 90, unit: "°" },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "Drag M to the exact middle, so AM = MB. Now read the angle.", af: "Sleep M na die presiese middel, sodat AM = MB. Lees nou die hoek." },
        { en: "At the midpoint the line stands at 90° — that is what 'perpendicular' means.", af: "By die middelpunt staan die lyn teen 90° — dit is wat 'loodreg' beteken." },
      ],
      reason: "centreMidChord",
      note: { en: "So when the bisecting is <b>given</b> (M is the midpoint), the line from the centre is <b>perpendicular</b> to the chord. Reason: <i>line from centre to midpt of chord</i>.", af: "So wanneer die halvering <b>gegee</b> is (M is die middelpunt), is die lyn vanaf die middelpunt <b>loodreg</b> op die koord. Rede: <i>lyn vanuit mdpt na mdpt van koord</i>." } },

    { type: "note",
      prompt: { en: "Two reasons — pick by what you are GIVEN", af: "Twee redes — kies volgens wat GEGEE is" },
      diagrams: [
        { diagram: CASE_PERP, caption: { en: "<b>Given 90°</b> → it bisects<br><i>line from centre ⊥ to chord</i>", af: "<b>Gegee 90°</b> → dit halveer<br><i>lyn vanuit mdpt ⊥ op koord</i>" } },
        { diagram: CASE_MID, caption: { en: "<b>Given AM = MB</b> → it is ⊥<br><i>line from centre to midpt of chord</i>", af: "<b>Gegee AM = MB</b> → dit is ⊥<br><i>lyn vanuit mdpt na mdpt van koord</i>" } },
      ],
      note: { en: "Read what the question GIVES you, then pick the matching reason. Next you'll practise spotting which one to use.", af: "Lees wat die vraag vir jou GEE, kies dan die passende rede. Volgende oefen jy om te herken watter een om te gebruik." } },
  ],
};
