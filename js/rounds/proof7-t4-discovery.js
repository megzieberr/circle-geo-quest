/* Proof rounds P7 — "T4 discovery: tangent-chord"
   (PROOF-ROUNDS-PLAN.md, session 5 — the T4 arc.)
   ------------------------------------------------------------------------
   REBUILT 2026-08-11/12 night (FIX-ROUND-2.md item 4 — overnight foreman
   build session C): full replacement of the construction. Her cheat-note
   pages are canon (also `C:\Users\megzi\Desktop\Circle Geo Proofs.pdf`):
   draw the diameter from the point of tangency T — call its far end D —
   and join D STRAIGHT TO P, the point in the alternate segment ITSELF.
   The PREVIOUS version of this file joined D to the chord's own other
   endpoint (A) instead, proved a triangle there, and only reached P at
   the very end via a second "angles in the same segment" hop — mechanically
   valid, but not her construction, and not what the disconnect audit
   flagged: "the app currently joins D to the chord's other endpoint and
   generalises to P later — that is the disconnect; her way joins D→P."
   Joining D straight to P instead means the SAME triangle (T-D-P) already
   contains the general point P from the start — no second hop needed:
     · tan ⊥ diameter splits the free 90° at T into T₁ (the tangent-chord
       angle) and T₂ = x (the piece between the diameter and the chord).
       T₁ = 90° − x falls straight out of that split — arithmetic, no
       triangle needed yet.
     · the diameter also hands P a free 90° (angle in a semicircle,
       ∠TPD — P is on the circle, TD is a diameter, so any point on the
       circle sees it at 90°, INCLUDING P — no restriction to D).
     · "angles in the same segment" (T and P both look at chord DA from
       the same side) carries T₂ = x straight across to ∠DPA, the piece of
       ∠TPD next to D.
     · ∠TPA — the angle we actually wanted — is what's left of that free
       90° once ∠DPA is taken out: ∠TPA = 90° − x. Exactly T₁. QED, for
       the P that was on the picture from panel 1, not a stand-in.
   P8 (proof8-t4-transfer.js) carries the SAME construction to the OTHER
   side of the chord, where the two 90°s combine differently: 90° + x.

   SIX PANELS, all taps, rendered through renderInvestigate() exactly like
   pr0-pr6 — `kind: "proof"` gets predict/choice/note panels and per-panel
   XP for free, no new engine surface:
     1 · predict — bare tan-chord figure + the claim (tangent-chord angle
         at T = ∠TPA, both UNLABELLED — nothing spoiled). "What do you
         THINK could prove this?"
     2 · choice  — the FULL construction has appeared at once: the
         diameter TD, and D joined straight to P — her own move, not two
         separate stages. WHY that specific pair of lines? (Together they
         bring BOTH known 90°s into the picture: tan ⊥ diameter at T, and
         the angle in a semicircle at P — the exact point already in the
         claim, not a stand-in for it.)
     3 · choice  — x is marked at T₂ (between the diameter and the chord);
         the free 90° at T (tan ⊥ diameter) is marked. What does that hand
         you for T₁, the tangent-chord angle? (90° − x — straight
         arithmetic, splitting a known right angle.)
     4 · choice  — the free 90° at P (angle in a semicircle, ∠TPD — P is
         on the circle, TD is a diameter) is marked. T and P both look at
         chord DA from the same side. What does "angles in the same
         segment" hand you for ∠DPA, the piece of that 90° next to D?
         (x — the SAME x as T₂, carried straight across.)
     5 · choice  — combine: ∠TPD = 90° splits into ∠DPA (= x, just found)
         and ∠TPA (the angle we actually wanted). What is ∠TPA, and how
         does it compare to T₁?  (∠TPA = 90° − x = T₁ — both targets land
         on the same expression. QED, for the actual P on the picture.)
     6 · note    — the recap sentence: "draw the diameter from the point
         of tangency, and join its far end straight to the point you're
         asked about — two free right angles and one same-segment swap
         chase you straight to the result." Genuinely the last panel.

   NUMBERED-ANGLE CONVENTION (carried over from the earlier follow-up,
   same T-crowd convention as before): T₁ = the tangent-chord angle, T₂ =
   x, the piece between the diameter and the chord — both at the same
   crowded vertex T, same reason as before for using subscripts there. At
   P there is no crowd needing a new subscript name: ∠DPA (the transferred
   piece) and ∠TPA (the theorem's own target angle) are both named in full
   wherever they appear, ∠TPA on purpose (per the ORIGINAL convention note,
   still true here) — it is the one thing this round wants remembered by
   its real name, and it is no longer a stand-in reached via D; it is the
   actual angle the whole construction was built around from panel 1.

   DIFFERENT COLOUR PER ANGLE FAMILY throughout (her red/purple/orange pen
   — FIX-ROUND-2.md's explicit ask, session C), reusing already-proven-
   readable app accents (the same array pr3/pr5/pr6 draw from):
     GREEN  #0ea271  — the x-family: T₂, and its transferred twin ∠DPA.
                        Same value pr3/pr5's own x-colour already uses.
     PINK   #e64980  — the 90°-family: the free right angle at T (tan ⊥
                        diameter) AND the free right angle at P (angle in
                        a semicircle) — two different theorems, same
                        "free right angle" role, same colour.
     PURPLE #9c36b5  — the target family: T₁ (the tangent-chord angle)
                        and ∠TPA (the angle in the alternate segment) —
                        the two angles the whole proof is chasing to make
                        equal. Same hex as this round's own accent (AC) —
                        no clash, AC only ever paints the round's map
                        icon, never a diagram element (same judgment call
                        pr5's own header already made for its own ∠A).
   Same family = same colour on label AND arc throughout. Every numbered
   angle is labelled on the diagram the moment its value is known (her
   explicit ask, session C: unlabelled numbered angles get bounced).

   GEOMETRY — reused, not invented. T:270, A:38, P:150 are data-tanchord.js's
   OWN exact degrees (section 1, "Spot the theorem", exercise 1), already
   checker-verified there as tangent-chord angle = 64°, ∠ in the alternate
   segment = 64° — UNCHANGED by this rebuild, only the CONSTRUCTION that
   reaches them changed. D:90 is discover-tangent-radius.js's OWN
   convention for "the far end of the diameter through the point of
   tangency" (T's exact antipode, 270 + 180 → 90, mod 360) — also
   unchanged.

   Every angle mark below is an EXACT integer, spot-checked against this
   engine's own verifyDiagram() (node, not hand-arithmetic alone — see the
   commit that added this file):
     tangent-chord ∠(tg+, A) = half the arc T→A (going the tg+ way, CCW):
       arc = (38 − 270 + 360) mod 360 = 128°  →  T₁ = 128 / 2 = 64°
     ∠(tg+, D) = 90°  (tan ⊥ diameter, exact, always)
     T₂ = ∠DTA = ∠(tg+,D) − ∠(tg+,A) = 90° − 64° = 26°   (A's direction,
       64° from tg+, sits between tg+'s 0° and D's 90° here, so this is a
       subtraction) — and T₁ = 90° − T₂ = 90° − 26° = 64° ✓, the SAME
       split, read the other way round: mark T₂ first, T₁ falls out.
     ∠TPD = 90°  (angle in a semicircle, exact, always — TD is a diameter,
       P is on the circle — engine-verified: 90.0°, not an estimate)
     T and P both lie on the SAME arc relative to chord DA — the 308° arc
       running D(90)→P(150)→T(270)→A(38, i.e. 398) — so "angles in the
       same segment" gives ∠DPA = ∠DTA = T₂ = 26° (engine-verified: 26.0°,
       not a rounded transfer)
     ∠TPA = ∠TPD − ∠DPA = 90° − 26° = 64°   (engine-verified: 64.0°) —
       EXACTLY T₁, the SAME expression, 90° − x, reached two different
       ways: split a known right angle at T, or subtract a same-segment
       transfer from a known right angle at P.                            */

const AC = "#9c36b5";
const GREEN = "#0ea271";    // T₂ / x, and its transferred twin ∠DPA
const PINK = "#e64980";     // the two free right angles (T, then P)
const PURPLE = "#9c36b5";   // T₁ and ∠TPA — the two target angles (= AC)

/* ---- shared construction chords, once the diameter + D→P join exist ---- */
const CHORDS_BUILT = [["T", "A"], ["P", "T"], ["P", "A"], ["T", "D"], ["D", "P"]];

/* ---- panel 1: the bare tan-chord figure, before any construction.
   data-tanchord.js's own exercise-1 picture, angles marked but
   UNLABELLED (t: "") — the claim is general, nothing spoiled before the
   guess. ---- */
const FIG_CLAIM = {
  O: true,
  pts: { T: 270, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "A"], ["P", "T"], ["P", "A"]],
  angles: [
    { at: "T", legs: ["tg+", "A"], t: "", o: { v: 64 } },
    { at: "P", legs: ["T", "A"], t: "", o: { v: 64 } },
  ],
};

/* ---- panel 2: the FULL construction, both new lines at once — the
   diameter TD, and D joined STRAIGHT TO P (her own move, not the old
   two-stage build). Highlighted in PINK: these two lines together are
   the whole trick, the same colour the two right angles they produce
   will carry. No angle marks yet — this panel is about WHY, before any
   angle gets a letter. ---- */
const FIG_CONSTRUCT_BARE = {
  O: true,
  pts: { T: 270, D: 90, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [
    ["T", "A"], ["P", "T"], ["P", "A"],
    { a: "T", b: "D", hl: PINK },
    { a: "D", b: "P", hl: PINK },
  ],
};

/* ---- panel 3: T₂ = x marked (between the diameter and the chord); the
   free 90° at T marked. T₁ is what this panel determines (shown as an
   unlabelled arc so the learner can see what they're solving for). ---- */
const FIG_LABEL_X = {
  O: true,
  pts: { T: 270, D: 90, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: CHORDS_BUILT,
  angles: [
    { at: "T", legs: ["tg+", "A"], t: "", o: { v: 64 } },
    { at: "T", legs: ["tg+", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    /* r pins the label to its arc (FIX-ROUND-1.md item 13's general
       re-sweep): a 26° sweep with a short label still drifts close to
       the canvas edge this near T at 270°. */
    { at: "T", legs: ["D", "A"], t: "x", o: { v: 26, r: 40, c: GREEN } },
  ],
};

/* ---- panel 4: T₁ now resolved and labelled; the free 90° at P (angle
   in a semicircle — P is on the circle, TD is a diameter) is marked.
   ∠DPA is what this panel determines (unlabelled). ---- */
const FIG_SEMI = {
  O: true,
  pts: { T: 270, D: 90, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: CHORDS_BUILT,
  angles: [
    /* FIX-ROUND-3.md item 8: r:34 (was unset, defaulting to ~54.5 —
       headless-probed and browser-pane-rendered: the default floated the
       label past its own arc, nearly touching the U tangent label; r:34
       hugs T's arc, still clear of the tangent line and the x-label
       above it). */
    { at: "T", legs: ["tg+", "A"], t: "T₁ = 90−x", o: { v: 64, r: 34, c: PURPLE } },
    { at: "T", legs: ["tg+", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "T", legs: ["D", "A"], t: "x", o: { v: 26, r: 40, c: GREEN } },
    { at: "P", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "P", legs: ["D", "A"], t: "", o: { v: 26 } },
  ],
};

/* ---- panels 5-6: the combine + conclude figure — ∠DPA now labelled x
   too (the same-segment transfer), and ∠TPA labelled with the matching
   result. Reused for the closing recap. ---- */
const FIG_FINAL = {
  O: true,
  pts: { T: 270, D: 90, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: CHORDS_BUILT,
  angles: [
    /* FIX-ROUND-3.md item 8: r:34, same fix and same reason as FIG_SEMI
       above (this figure is reused for the recap gallery too, so both
       spots get it at once). */
    { at: "T", legs: ["tg+", "A"], t: "T₁ = 90−x", o: { v: 64, r: 34, c: PURPLE } },
    { at: "T", legs: ["tg+", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    { at: "T", legs: ["D", "A"], t: "x", o: { v: 26, r: 40, c: GREEN } },
    { at: "P", legs: ["T", "D"], t: "", o: { v: 90, mark: 1, c: PINK } },
    /* FIX-ROUND-3.md item 9: r:26 (was unset, defaulting to ~64 — the
       transferred x at P drifted up toward D, per her playtest screenshot;
       headless-probed and browser-pane-rendered: r:26 pins it right beside
       P's own arc mark, clear of the P-A and P-D chords). */
    { at: "P", legs: ["D", "A"], t: "x", o: { v: 26, r: 26, c: GREEN } },
    { at: "P", legs: ["T", "A"], t: "90−x", o: { v: 64, r: 40, c: PURPLE } },
  ],
};

export const round = {
  id: "pr7", n: 0, accent: AC, kind: "proof", group: "g7",
  title: { en: "T4 discovery: tangent–chord", af: "T4-ontdekking: raaklyn–koord" },
  blurb: {
    en: "Prove the tangent-chord angle equals the angle in the alternate segment — the diameter hands you two right angles for free.",
    af: "Bewys die raaklyn–koord-hoek is gelyk aan die hoek in die oorstaande segment — die middellyn gee jou twee regte hoeke verniet.",
  },
  panels: [

    /* ---------- 1 · the claim, and a guess ---------- */
    {
      type: "predict",
      prompt: {
        en: "Here is the picture: STU is a tangent, touching the circle at T. TA is a chord from the point of contact, making a tangent–chord angle at T (marked, no number). P is a point on the circle, on the OTHER side of the chord — ∠TPA is the angle in the alternate segment (also marked, no number). The claim is that these two angles are always equal. What other geometry theorem do you THINK can prove that this claim is ALWAYS true?",
        af: "Hier is die prentjie: STU is 'n raaklyn wat die sirkel by T raak. TA is 'n koord vanaf die raakpunt, wat 'n raaklyn–koord-hoek by T maak (gemerk, geen getal nie). P is 'n punt op die sirkel, aan die ANDER kant van die koord — ∠TPA is die hoek in die oorstaande segment (ook gemerk, geen getal nie). Die bewering is dat hierdie twee hoeke altyd gelyk is. Watter ander meetkundestelling dink jy kan bewys dat hierdie bewering ALTYD waar is?",
      },
      diagram: FIG_CLAIM,
      options: [
        { text: { en: "Tan ⊥ diameter and the angle in a semicircle", af: "Raaklyn ⊥ middellyn en die hoek in 'n halfsirkel" }, correct: true },
        { text: { en: "Congruent triangles, matched up some other way", af: "Kongruente driehoeke, op een of ander ander manier gepaar" } },
        { text: { en: "Isosceles triangles, built from two equal chords", af: "Gelykbenige driehoeke, gebou uit twee gelyke koorde" } },
        { text: { en: "The angle-at-centre theorem, run twice over", af: "Die hoek-by-middelpunt-stelling, twee keer uitgevoer" } },
        { text: { en: "Equal chords always giving you equal angles", af: "Gelyke koorde wat altyd gelyke hoeke gee" } },
      ],
      reactRight: {
        en: "Good instinct — those two facts really are the key here, chained together. Let's build the construction and see exactly how.",
        af: "Goeie aanvoeling — daardie twee feite is werklik die sleutel hier, aanmekaar geskakel. Kom ons bou die konstruksie en kyk presies hoe.",
      },
      reactWrong: {
        en: "Good guess — here's a hint: watch what happens the moment we draw the diameter from T, then join its far end STRAIGHT to P.",
        af: "Goeie raaiskoot — hier's 'n wenk: kyk wat gebeur die oomblik wat ons die middellyn vanaf T trek, en die verste punt daarvan REGUIT aan P verbind.",
      },
      after: {
        en: "Two new lines are about to appear at once — the diameter through T, and a line straight from its far end to P. Nothing else changes yet.",
        af: "Twee nuwe lyne gaan nou-nou gelyktydig verskyn — die middellyn deur T, en 'n lyn reguit vanaf sy verste punt na P. Niks anders verander nog nie.",
      },
    },

    /* ---------- 2 · the construction, and why THESE two lines ---------- */
    {
      type: "choice",
      prompt: {
        en: "The construction: the diameter TD has been drawn, straight through the point of tangency T — AND D has been joined straight to P, the very point in the alternate segment the claim is about. Why is that pair of lines the useful first move?",
        af: "Die konstruksie: die middellyn TD is getrek, reguit deur die raakpunt T — EN D is reguit aan P verbind, die selfde punt in die oorstaande segment waaroor die bewering gaan. Hoekom is daardie paar lyne die nuttige eerste stap?",
      },
      diagram: FIG_CONSTRUCT_BARE,
      options: [
        { text: { en: "Together they bring two already-known 90°s into the picture at once — tan ⊥ diameter at T, and the angle in a semicircle at P itself",
                  af: "Saam bring hulle twee reeds-bekende 90°'e gelyktydig in die prentjie in — raaklyn ⊥ middellyn by T, en die hoek in 'n halfsirkel by P self" }, correct: true },
        { text: { en: "It automatically makes triangle TDP isosceles, since two of its sides happen to come out equal", af: "Dit maak driehoek TDP outomaties gelykbenig, aangesien twee van sy sye toevallig gelyk uitkom" } },
        { text: { en: "It creates two congruent triangles, TDP and TDA, that can be matched up directly with no extra work", af: "Dit skep twee kongruente driehoeke, TDP en TDA, wat direk sonder ekstra werk gepaar kan word" } },
        { text: { en: "It automatically bisects the tangent-chord angle in half, with no theorem required at all", af: "Dit halveer die raaklyn–koord-hoek outomaties in twee, sonder dat enige stelling glad nodig is" } },
      ],
      hints: [
        { en: "You already know two theorems about a diameter: what does it do to the tangent at its own endpoint, and what does it do to the angle it subtends at ANY other point on the circle — including P?",
          af: "Jy ken reeds twee stellings oor 'n middellyn: wat doen dit aan die raaklyn by sy eie eindpunt, en wat doen dit aan die hoek wat dit by ENIGE ander punt op die sirkel onderspan — P ingesluit?" },
        { en: "A tangent is always perpendicular to the diameter at the point of contact (90° at T), and P is already on the circle, so it sees that same diameter at 90° too (angle in a semicircle). Two lines, two free right angles — and P was never a stand-in, it's the real point from panel 1.",
          af: "'n Raaklyn is altyd loodreg op die middellyn by die raakpunt (90° by T), en P is reeds op die sirkel, dus sien dit dieselfde middellyn ook teen 90° (hoek in 'n halfsirkel). Twee lyne, twee verniet-regte-hoeke — en P was nooit 'n plaasvervanger nie, dis die werklike punt van paneel 1 af." },
      ],
      reason: "construction",
      note: {
        en: "Drawing the diameter through T, then joining its far end straight to P, is the whole trick: it hands you 90° at T for free (tan ⊥ diameter) AND 90° at P for free (angle in a semicircle) — two already-proven facts, both switched on by these two lines, and both anchored to the actual P you were asked about.",
        af: "Om die middellyn deur T te trek, en dan die verste punt daarvan reguit aan P te verbind, is die hele kunsie: dit gee jou 90° by T verniet (raaklyn ⊥ middellyn) EN 90° by P verniet (hoek in 'n halfsirkel) — twee reeds-bewese feite, altwee aangeskakel deur hierdie twee lyne, en albei geanker aan die werklike P waaroor jy gevra is.",
      },
    },

    /* ---------- 3 · label x — what tan ⊥ diameter hands you for T₁ ---------- */
    {
      type: "choice",
      prompt: {
        en: "Mark T₂ = x (marked) — the piece of the free 90° at T between the diameter and the chord. Tan ⊥ diameter gives you the WHOLE 90° between the tangent and TD (also marked). What does that hand you for T₁, the tangent–chord angle?",
        af: "Merk T₂ = x (gemerk) — die stuk van die verniet 90° by T tussen die middellyn en die koord. Raaklyn ⊥ middellyn gee jou die HELE 90° tussen die raaklyn en TD (ook gemerk). Wat gee dit jou vir T₁, die raaklyn–koord-hoek?",
      },
      diagram: FIG_LABEL_X,
      options: [
        { text: { en: "T₁ = 90° − x", af: "T₁ = 90° − x" }, correct: true },
        { text: { en: "T₁ = x", af: "T₁ = x" } },
        { text: { en: "T₁ = 90° + x", af: "T₁ = 90° + x" } },
        { text: { en: "T₁ = 2x", af: "T₁ = 2x" } },
      ],
      hints: [
        { en: "The chord TA sits INSIDE the 90° angle between the tangent and the diameter — that 90° splits into two adjacent pieces: T₁ (tangent to the chord) and T₂ (the chord to the diameter, = x).",
          af: "Die koord TA sit BINNE die 90°-hoek tussen die raaklyn en die middellyn — daardie 90° verdeel in twee aangrensende stukke: T₁ (raaklyn na die koord) en T₂ (die koord na die middellyn, = x)." },
        { en: "The whole 90° is T₁ + T₂. Rearranged: T₁ = 90° − T₂ = 90° − x.",
          af: "Die hele 90° is T₁ + T₂. Herrangskik: T₁ = 90° − T₂ = 90° − x." },
      ],
      reason: "tanDiameter",
      note: {
        en: "Tan ⊥ diameter gives 90° between the tangent and TD, and the chord TA splits that 90° into two adjacent pieces: T₁ (the tangent-chord angle) and T₂ (= x). So T₁ = 90° − x — no measuring, just subtraction from an already-known right angle. Now watch the exact same split happen again, at P.",
        af: "Raaklyn ⊥ middellyn gee 90° tussen die raaklyn en TD, en koord TA verdeel daardie 90° in twee aangrensende stukke: T₁ (die raaklyn–koord-hoek) en T₂ (= x). Dus T₁ = 90° − x — geen meting nodig nie, net aftrekking van 'n reeds-bekende regte hoek. Kyk nou hoe presies dieselfde verdeling weer gebeur, by P.",
      },
    },

    /* ---------- 4 · the free 90° at P, and the same-segment transfer ---------- */
    {
      type: "choice",
      prompt: {
        en: "P is already joined to both T and A (from the claim), and now to D too (the new construction). TD is a diameter, and P is on the circle — so ∠TPD = 90° (angle in a semicircle, marked), completely free. T and P both look at chord DA from the SAME side. What does \"angles in the same segment\" hand you for ∠DPA, the piece of that 90° next to D?",
        af: "P is reeds aan albei T en A verbind (van die bewering af), en nou ook aan D (die nuwe konstruksie). TD is 'n middellyn, en P is op die sirkel — dus ∠TPD = 90° (hoek in 'n halfsirkel, gemerk), heeltemal verniet. T en P kyk albei na koord DA vanaf DIESELFDE kant. Wat gee \"hoeke in dieselfde segment\" jou vir ∠DPA, die stuk van daardie 90° langs D?",
      },
      diagram: FIG_SEMI,
      options: [
        { text: { en: "∠DPA = x — the same x as T₂, both standing on the same arc DA", af: "∠DPA = x — dieselfde x as T₂, albei staan op dieselfde boog DA" }, correct: true },
        { text: { en: "∠DPA = 90° − x, the same as T₁", af: "∠DPA = 90° − x, dieselfde as T₁" } },
        { text: { en: "∠DPA can't be pinned down without knowing exactly where P sits", af: "∠DPA kan nie vasgepen word sonder om presies te weet waar P sit nie" } },
        { text: { en: "∠DPA = 2x, double T₂", af: "∠DPA = 2x, dubbel T₂" } },
      ],
      hints: [
        { en: "T and P are two DIFFERENT points, but they're on the SAME side of chord DA. Is there a theorem about two circumference points on the same side of a chord?",
          af: "T en P is twee VERSKILLENDE punte, maar hulle is aan DIESELFDE kant van koord DA. Is daar 'n stelling oor twee omtrekpunte aan dieselfde kant van 'n koord?" },
        { en: "Angles in the same segment, standing on the same chord, are always equal — no matter which two points you pick. T₂ (= ∠DTA) and ∠DPA both stand on chord DA from the same side, so ∠DPA = T₂ = x.",
          af: "Hoeke in dieselfde segment, wat op dieselfde koord staan, is altyd gelyk — ongeag watter twee punte jy kies. T₂ (= ∠DTA) en ∠DPA staan albei op koord DA vanaf dieselfde kant, dus ∠DPA = T₂ = x." },
      ],
      reason: "sameSeg",
      note: {
        en: "T₂ = ∠DTA and ∠DPA both stand on chord DA, from the same side — so \"angles in the same segment\" hands you ∠DPA = T₂ = x directly, no measuring. The free 90° at P (∠TPD) has now split into two named pieces, exactly the same way the free 90° at T did.",
        af: "T₂ = ∠DTA en ∠DPA staan albei op koord DA, vanaf dieselfde kant — dus gee \"hoeke in dieselfde segment\" jou ∠DPA = T₂ = x direk, geen meting nodig nie. Die verniet 90° by P (∠TPD) het nou in twee benoemde stukke verdeel, presies soos die verniet 90° by T ook gedoen het.",
      },
    },

    /* ---------- 5 · combine + conclude ---------- */
    {
      type: "choice",
      prompt: {
        en: "∠TPD = 90° splits into ∠DPA (= x, just found) and ∠TPA — the angle we actually wanted, right from the start. What is ∠TPA, and how does it compare to T₁?",
        af: "∠TPD = 90° verdeel in ∠DPA (= x, pas gekry) en ∠TPA — die hoek wat ons van die begin af eintlik wou hê. Wat is ∠TPA, en hoe vergelyk dit met T₁?",
      },
      diagram: FIG_FINAL,
      options: [
        { text: { en: "∠TPA = 90° − x, exactly the same as T₁", af: "∠TPA = 90° − x, presies dieselfde as T₁" } , correct: true },
        { text: { en: "∠TPA = x, the same as ∠DPA", af: "∠TPA = x, dieselfde as ∠DPA" } },
        { text: { en: "∠TPA = 90° + x", af: "∠TPA = 90° + x" } },
        { text: { en: "∠TPA can't be pinned down without an actual number for x", af: "∠TPA kan nie vasgepen word sonder 'n werklike getal vir x nie" } },
      ],
      hints: [
        { en: "∠TPD (= 90°, the whole) is made of two adjacent pieces: ∠DPA (= x, just found) and ∠TPA. Rearrange for ∠TPA.",
          af: "∠TPD (= 90°, die geheel) bestaan uit twee aangrensende stukke: ∠DPA (= x, pas gekry) en ∠TPA. Herrangskik vir ∠TPA." },
        { en: "∠TPA = 90° − ∠DPA = 90° − x. And T₁, back at panel 3, was ALSO 90° − x — the exact same expression, reached from a completely different vertex.",
          af: "∠TPA = 90° − ∠DPA = 90° − x. En T₁, terug by paneel 3, was OOK 90° − x — presies dieselfde uitdrukking, van 'n heeltemal ander hoekpunt af bereik." },
      ],
      reason: "tanChord",
      note: {
        en: "∠TPA = 90° − ∠DPA = 90° − x — exactly T₁. That is the whole proof, for the actual P from panel 1, not a stand-in reached through D: draw the diameter from the point of tangency, join its far end straight to P, let tan ⊥ diameter split the free 90° at T, and let angle-in-a-semicircle plus angles-in-the-same-segment split the free 90° at P the exact same way.",
        af: "∠TPA = 90° − ∠DPA = 90° − x — presies T₁. Dit is die hele bewys, vir die werklike P van paneel 1 af, nie 'n plaasvervanger wat deur D bereik word nie: trek die middellyn vanaf die raakpunt, verbind die verste punt daarvan reguit aan P, laat raaklyn ⊥ middellyn die verniet 90° by T verdeel, en laat hoek-in-'n-halfsirkel plus hoeke-in-dieselfde-segment die verniet 90° by P presies dieselfde manier verdeel.",
      },
    },

    /* ---------- 6 · the recap — the sentence to carry forward ---------- */
    {
      type: "note",
      prompt: { en: "The sentence to carry forward", af: "Die sin om saam te dra" },
      diagram: FIG_FINAL,
      note: {
        en: "<b>Draw the diameter from the point of tangency, and join its far end STRAIGHT to the point you're asked about — two free right angles and one same-segment swap chase you straight to the result.</b><br><br>Tan ⊥ diameter splits the free 90° at T into the tangent-chord angle and x. The same diameter gives P a free 90° too, and \"angles in the same segment\" splits THAT 90° the exact same way — x, then the angle you actually wanted. Both halves land on 90° − x. No detour through a stand-in point required.<br><br>Next: the exact same construction, on the OTHER side of the chord — where the two 90°s combine differently.",
        af: "<b>Trek die middellyn vanaf die raakpunt, en verbind die verste punt daarvan REGUIT aan die punt waaroor jy gevra is — twee verniet-regte-hoeke en een selfde-segment-verwisseling jaag jou reguit na die resultaat.</b><br><br>Raaklyn ⊥ middellyn verdeel die verniet 90° by T in die raaklyn–koord-hoek en x. Dieselfde middellyn gee P ook 'n verniet 90°, en \"hoeke in dieselfde segment\" verdeel DAARDIE 90° presies dieselfde manier — x, dan die hoek wat jy eintlik wou hê. Albei helftes land op 90° − x. Geen ompad deur 'n plaasvervangerpunt nodig nie.<br><br>Volgende: presies dieselfde konstruksie, aan die ANDER kant van die koord — waar die twee 90°'e verskillend saamkom.",
      },
    },

  ],
};
