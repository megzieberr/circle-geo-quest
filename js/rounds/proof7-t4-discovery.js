/* Proof rounds P7 — "T4 discovery: tangent-chord"
   (PROOF-ROUNDS-PLAN.md, session 5 — the T4 arc.)
   ------------------------------------------------------------------------
   T4 is "the angle between a tangent and a chord equals the angle in the
   ALTERNATE segment" (the tan-chord theorem). Her source notes' recipe:
   draw the diameter from the point of tangency T — call its far end D.
   tan ⊥ diameter gives a 90° at T, between the tangent and TD. The angle
   in a semicircle gives a SECOND 90°, at A (any point on the circle sees
   the diameter at 90°). Angle-chasing in triangle TDA (angles sum to
   180°) hands the tangent-chord angle straight over to ∠TDA — and D sits
   in the alternate segment, so "angles in the same segment" (already
   established elsewhere in the app) carries the result to every point P
   in that segment, not just D. This round teaches THAT construction.
   P8 (proof8-t4-transfer.js) carries it to the OTHER side of the chord —
   and springs the wrong-join trap.

   SIX PANELS, all taps, rendered through renderInvestigate() exactly like
   pr0-pr6 — `kind: "proof"` gets predict/choice/note panels and per-panel
   XP for free, no new engine surface:
     1 · predict — bare tan-chord figure + the claim (tangent-chord angle
         at T = ∠ at P in the alternate segment, both UNLABELLED — nothing
         spoiled). "What do you THINK could prove this?"
     2 · choice  — the construction has appeared: the diameter TD, drawn
         from the point of tangency. WHY that specific move? (It brings
         BOTH known 90°s into the picture at once: tan ⊥ diameter at T,
         and the semicircle at any point on the circle.)
     3 · choice  — the tangent-chord angle is labelled a; the free 90°
         between the tangent and TD is marked. What does that hand you
         for ∠DTA? (90° − a.)
     4 · choice  — D joined to A, closing the triangle; the semicircle
         hands a SECOND 90°, at A. Triangle TDA's angles sum to 180°.
         What is ∠TDA? (a — the sum collapses straight back to the
         original letter.)
     5 · choice  — the combine + generalise step: ∠TDA = a, and D sits in
         the alternate segment, the SAME segment as P. What does "angles
         in the same segment" (already known) then hand you for ∠TPA, the
         angle we actually wanted? (∠TPA = a too — QED for any P, not
         just D.)
     6 · note    — the recap sentence: "draw the diameter from the point
         of tangency; the two free right angles and a triangle chase you
         straight to the result." Genuinely the last panel of this round.

   REVISED 2026-08-11 (Megan's numbering follow-up, same convention as the
   T2 and T3 arcs): vertex T carries the crowd — three marked angles at
   one point (the free 90°, and its two pieces) — so T₁ = the
   tangent–chord angle (marked a) and T₂ = ∠DTA (marked 90°−a), each
   introduced in prose the panel it first gets marked/solved (T₁ + T₂ in
   panel 3). D₁ = ∠TDA (panel 4's own result) — a single angle at its own
   vertex, but "∠TDA" was doing a lot of repeating by panels 4-5, so it
   gets the same shorthand treatment. The 90° at A stays literal prose
   ("the 90° at A") since it's the round's one single fact there, not a
   crowd. ∠TPA — the punchline angle the whole proof is chasing, and the
   theorem's own name for it — stays literal throughout, on purpose: it's
   the one thing this round wants remembered by its real name. Figure
   glyphs (a, 90°−a) are untouched, same split as the earlier arcs.

   Every diagram stays SYMBOLIC throughout (labels a, 90°−a, a — never a
   literal spoiler number for the thing being proven), matching pr3/pr5's
   own no-spoilers convention for a discovery round; the actual numbers
   only ever live in `o.v` for the engine/checker, never in learner-facing
   text.

   GEOMETRY — reused, not invented. Session brief: search js/rounds/ for
   the app's own verified tan-chord figures and import exact coordinates
   rather than re-deriving new ones.
     T:270, A:38, P:150 are data-tanchord.js's OWN exact degrees (section 1,
     "Spot the theorem", exercise 1: `d:{pts:{T:270, A:38, P:150}, ...
     angles:[{at:"T",legs:["tg+","A"],t:"64°",o:{v:64}},
              {at:"P",legs:["T","A"],t:"x",o:{v:64}}]}`) — already
     checker-verified there (and reused twice more by the Investigation
     Station, per docs/chunk-d-practice-panels.md) as tangent-chord angle
     = 64°, ∠ in the alternate segment = 64°. Carried over verbatim.
     D:90 is discover-tangent-radius.js's OWN convention for "the far end
     of the diameter through the point of tangency" — that file's own
     `fixed: { O: true, pts: { T: 270, D: 90 } }`, T's exact antipode
     (270 + 180 → 90, mod 360).

   Every angle mark below is an EXACT integer. Two independent facts make
   that true here, not an estimate:
     · O-vertex-free angles like the tan-chord angle and inscribed angle
       are the classic "half the intercepted arc" identity — pure angle
       relationships that don't depend on radius or centre position, so
       they are exact for any circle, given points placed at exact integer
       degrees (same fact data-tanchord.js's own 64°/64° pair already
       leans on).
     · D is EXACTLY T's antipode (T + 180, mod 360), so TD is a true
       diameter and tan ⊥ TD is an EXACT 90°, not a rounded one.
   Derivation:
     tangent-chord ∠(tg+, A) = half the arc T→A (going the tg+ way, CCW):
       arc = (38 − 270 + 360) mod 360 = 128°  →  a = 128 / 2 = 64°
     ∠(tg+, D) = 90°  (tan ⊥ diameter, exact, always)
     ∠DTA = ∠(tg+,D) − ∠(tg+,A) = 90° − 64° = 26°   (A's direction, 64°,
       sits between tg+'s 0° and D's 90° here, so this is a subtraction)
     ∠TAD = 90°  (angle in a semicircle, exact, always — TD is a diameter)
     ∠TDA = 180° − ∠DTA − ∠TAD = 180° − 26° − 90° = 64°   (△ TDA, angle
       sum) — EXACTLY the original tangent-chord angle, 64° = 64° ✓
     D lies on arc A(38)→D(90)→P(150)→T(270), the SAME 232° arc that
     contains P (the 128° arc T→A the tangent-chord angle cuts off does
     NOT contain D or P) — so D and P share a segment, and "∠s in the
     same segment" (already established elsewhere in the app) hands
     ∠TPA = ∠TDA = 64° too, matching the figure's own already-verified
     ∠P = 64° value.                                                    */

const AC = "#9c36b5";

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

/* ---- panel 2: the construction has appeared — the diameter TD, drawn
   from the point of tangency. No angle marks yet: this panel is about
   WHY, before any angle gets a letter. ---- */
const FIG_CONSTRUCT_BARE = {
  O: true,
  pts: { T: 270, D: 90, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "A"], ["P", "T"], ["P", "A"], ["T", "D"]],
};

/* ---- panel 3: tangent-chord angle labelled a; the free 90° between the
   tangent and TD marked; ∠DTA is what this panel is determining
   (unlabelled). ---- */
const FIG_LABEL_A = {
  O: true,
  pts: { T: 270, D: 90, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "A"], ["P", "T"], ["P", "A"], ["T", "D"]],
  angles: [
    { at: "T", legs: ["tg+", "A"], t: "a", o: { v: 64 } },
    { at: "T", legs: ["tg+", "D"], t: "", o: { v: 90, mark: 1 } },
    { at: "T", legs: ["D", "A"], t: "", o: { v: 26 } },
  ],
};

/* ---- panel 4: D joined to A, closing the triangle; ∠DTA now labelled
   with its answer; the semicircle hands a second 90° at A. ∠TDA is what
   this panel is determining (unlabelled). ---- */
const FIG_SEMI = {
  O: true,
  pts: { T: 270, D: 90, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "A"], ["P", "T"], ["P", "A"], ["T", "D"], ["D", "A"]],
  angles: [
    { at: "T", legs: ["tg+", "A"], t: "a", o: { v: 64 } },
    { at: "T", legs: ["tg+", "D"], t: "", o: { v: 90, mark: 1 } },
    /* r pins this label to its arc (FIX-ROUND-1.md item 13's general
       re-sweep): a 26° sweep with a 5-char label defaults to r≈66, which
       risks drifting near the canvas edge this close to T at 270°. */
    { at: "T", legs: ["D", "A"], t: "90°−a", o: { v: 26, r: 40 } },
    { at: "A", legs: ["T", "D"], t: "", o: { v: 90, mark: 1 } },
  ],
};

/* ---- panels 5-6: the combine + generalise figure — ∠TDA now labelled a
   too (the triangle-sum result), and ∠P brought back into the marks so
   the "same segment" step has both angles visible at once. Reused for
   the closing recap. ---- */
const FIG_FINAL = {
  O: true,
  pts: { T: 270, D: 90, A: 38, P: 150 },
  tang: [{ at: "T", lab: ["S", "U"] }],
  chords: [["T", "A"], ["P", "T"], ["P", "A"], ["T", "D"], ["D", "A"]],
  angles: [
    { at: "T", legs: ["tg+", "A"], t: "a", o: { v: 64 } },
    { at: "T", legs: ["tg+", "D"], t: "", o: { v: 90, mark: 1 } },
    { at: "A", legs: ["T", "D"], t: "", o: { v: 90, mark: 1 } },
    { at: "D", legs: ["T", "A"], t: "a", o: { v: 64 } },
    { at: "P", legs: ["T", "A"], t: "a", o: { v: 64 } },
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
        en: "Good guess — here's a hint: watch what happens the moment we draw the diameter from T, the point of tangency.",
        af: "Goeie raaiskoot — hier's 'n wenk: kyk wat gebeur die oomblik wat ons die middellyn vanaf T, die raakpunt, trek.",
      },
      after: {
        en: "A new line is about to appear — the diameter through T. Nothing else changes yet.",
        af: "'n Nuwe lyn gaan nou-nou verskyn — die middellyn deur T. Niks anders verander nog nie.",
      },
    },

    /* ---------- 2 · the construction, and why the diameter specifically ---------- */
    {
      type: "choice",
      prompt: {
        en: "The construction: the diameter TD has been drawn, straight through the point of tangency T. Why is that the useful first move here?",
        af: "Die konstruksie: die middellyn TD is getrek, reguit deur die raakpunt T. Hoekom is dit die nuttige eerste stap hier?",
      },
      diagram: FIG_CONSTRUCT_BARE,
      options: [
        { text: { en: "It brings two already-known 90°s into the picture at once — tan ⊥ diameter at T, and the angle in a semicircle at any point on the circle",
                  af: "Dit bring twee reeds-bekende 90°'e gelyktydig in die prentjie in — raaklyn ⊥ middellyn by T, en die hoek in 'n halfsirkel by enige punt op die sirkel" }, correct: true },
        { text: { en: "It automatically makes triangle TDA isosceles, since two of its sides happen to come out equal", af: "Dit maak driehoek TDA outomaties gelykbenig, aangesien twee van sy sye toevallig gelyk uitkom" } },
        { text: { en: "It creates two congruent triangles, TDA and TDP, that can be matched up directly with no extra work", af: "Dit skep twee kongruente driehoeke, TDA en TDP, wat direk sonder ekstra werk gepaar kan word" } },
        { text: { en: "It automatically bisects the tangent-chord angle in half, with no theorem required at all", af: "Dit halveer die raaklyn–koord-hoek outomaties in twee, sonder dat enige stelling glad nodig is" } },
      ],
      hints: [
        { en: "You already know two theorems about a diameter: what does it do to the tangent at its own endpoint, and what does it do to the angle it subtends anywhere else on the circle?",
          af: "Jy ken reeds twee stellings oor 'n middellyn: wat doen dit aan die raaklyn by sy eie eindpunt, en wat doen dit aan die hoek wat dit enige plek anders op die sirkel onderspan?" },
        { en: "A tangent is always perpendicular to the diameter at the point of contact (90° at T), and any point on the circle sees a diameter at 90° too (angle in a semicircle, at A). One line, two free right angles.",
          af: "'n Raaklyn is altyd loodreg op die middellyn by die raakpunt (90° by T), en enige punt op die sirkel sien 'n middellyn ook teen 90° (hoek in 'n halfsirkel, by A). Een lyn, twee verniet-regte-hoeke." },
      ],
      reason: "construction",
      note: {
        en: "Drawing the diameter through T is the whole trick: it hands you 90° at T for free (tan ⊥ diameter) AND 90° at A for free (angle in a semicircle) — two already-proven facts, both switched on by one line.",
        af: "Om die middellyn deur T te trek is die hele kunsie: dit gee jou 90° by T verniet (raaklyn ⊥ middellyn) EN 90° by A verniet (hoek in 'n halfsirkel) — twee reeds-bewese feite, altwee aangeskakel deur een lyn.",
      },
    },

    /* ---------- 3 · label a — what tan ⊥ diameter hands you for ∠DTA ---------- */
    {
      type: "choice",
      prompt: {
        en: "Label the tangent–chord angle T₁ = a (marked). Tan ⊥ diameter gives you a free 90° between the tangent and TD (also marked). What does that hand you for T₂ — ∠DTA, the angle between the diameter and the chord?",
        af: "Merk die raaklyn–koord-hoek T₁ = a (gemerk). Raaklyn ⊥ middellyn gee jou 'n verniet 90° tussen die raaklyn en TD (ook gemerk). Wat gee dit jou vir T₂ — ∠DTA, die hoek tussen die middellyn en die koord?",
      },
      diagram: FIG_LABEL_A,
      options: [
        { text: { en: "T₂ = 90° − a", af: "T₂ = 90° − a" }, correct: true },
        { text: { en: "T₂ = a", af: "T₂ = a" } },
        { text: { en: "T₂ = 90° + a", af: "T₂ = 90° + a" } },
        { text: { en: "T₂ = 2a", af: "T₂ = 2a" } },
      ],
      hints: [
        { en: "The chord TA sits INSIDE the 90° angle between the tangent and the diameter — a splits into two pieces: T₁ (= a), and T₂ (= ∠DTA) next to it.",
          af: "Die koord TA sit BINNE die 90°-hoek tussen die raaklyn en die middellyn — dit verdeel in twee stukke: T₁ (= a), en T₂ (= ∠DTA) daarnaas." },
        { en: "The whole 90° angle is made of two adjacent pieces: T₁ (tangent to TA) and T₂ (TA to TD). So T₂ = 90° − a.",
          af: "Die hele 90°-hoek bestaan uit twee aangrensende stukke: T₁ (raaklyn na TA) en T₂ (TA na TD). Dus T₂ = 90° − a." },
      ],
      reason: "tanDiameter",
      note: {
        en: "Tan ⊥ diameter gives 90° between the tangent and TD, and TA splits that 90° into two adjacent pieces: T₁ (= a), and T₂ (= ∠DTA). So T₂ = 90° − a — no measuring, just subtraction from an already-known right angle.",
        af: "Raaklyn ⊥ middellyn gee 90° tussen die raaklyn en TD, en TA verdeel daardie 90° in twee aangrensende stukke: T₁ (= a), en T₂ (= ∠DTA). Dus T₂ = 90° − a — geen meting nodig nie, net aftrekking van 'n reeds-bekende regte hoek.",
      },
    },

    /* ---------- 4 · D joined to A — the semicircle, and the triangle sum ---------- */
    {
      type: "choice",
      prompt: {
        en: "D has been joined to A, closing triangle TDA. The angle in a semicircle hands you a SECOND free 90°, at A (marked) — TD is a diameter, so any point on the circle sees it at 90°. Triangle TDA's angles must sum to 180°: T₂ + the 90° at A + D₁ (∠TDA) = 180°. What is D₁?",
        af: "D is aan A verbind, wat driehoek TDA sluit. Die hoek in 'n halfsirkel gee jou 'n TWEEDE verniet 90°, by A (gemerk) — TD is 'n middellyn, dus sien enige punt op die sirkel dit teen 90°. Driehoek TDA se hoeke moet optel tot 180°: T₂ + die 90° by A + D₁ (∠TDA) = 180°. Wat is D₁?",
      },
      diagram: FIG_SEMI,
      options: [
        { text: { en: "D₁ = 180° − (90° − a) − 90° = a", af: "D₁ = 180° − (90° − a) − 90° = a" }, correct: true },
        { text: { en: "D₁ = 90° − a, the same as T₂", af: "D₁ = 90° − a, dieselfde as T₂" } },
        { text: { en: "D₁ = 180° − a", af: "D₁ = 180° − a" } },
        { text: { en: "D₁ can't be found without an actual number for a", af: "D₁ kan nie gevind word sonder 'n werklike getal vir a nie" } },
      ],
      hints: [
        { en: "You have two of the triangle's three angles already: T₂ = 90° − a, and the 90° at A. The third angle, D₁, is whatever's left of 180°.",
          af: "Jy het reeds twee van die driehoek se drie hoeke: T₂ = 90° − a, en die 90° by A. Die derde hoek, D₁, is wat ook al van 180° oorbly." },
        { en: "180° − (90° − a) − 90° = 180° − 90° + a − 90° = a. The two 90°s cancel each other out, and you're left with exactly a.",
          af: "180° − (90° − a) − 90° = 180° − 90° + a − 90° = a. Die twee 90°'e kanselleer mekaar uit, en jy bly met presies a." },
      ],
      reason: "triSum",
      note: {
        en: "T₂ = 90° − a and the 90° at A — substitute into the triangle's angle sum: D₁ = 180° − (90° − a) − 90° = a. The two right angles cancel out completely, and D₁ lands back on exactly the same letter you started with.",
        af: "T₂ = 90° − a en die 90° by A — vervang in die driehoek se hoeksom: D₁ = 180° − (90° − a) − 90° = a. Die twee regte hoeke kanselleer heeltemal uit, en D₁ land terug op presies dieselfde letter waarmee jy begin het.",
      },
    },

    /* ---------- 5 · combine + generalise: D's segment is P's segment too ---------- */
    {
      type: "choice",
      prompt: {
        en: "So D₁ = a — exactly T₁, the tangent–chord angle you started with. D sits in the alternate segment, the SAME segment as P (both on the far side of chord TA from the tangent-chord angle). What does \"angles in the same segment are equal\" — a fact you already know — then hand you for ∠TPA, the angle we actually wanted?",
        af: "So D₁ = a — presies T₁, die raaklyn–koord-hoek waarmee jy begin het. D sit in die oorstaande segment, DIESELFDE segment as P (albei aan die verste kant van koord TA vanaf die raaklyn–koord-hoek). Wat gee \"hoeke in dieselfde segment is gelyk\" — 'n feit wat jy reeds ken — dan vir ∠TPA, die hoek wat ons eintlik wou hê?",
      },
      diagram: FIG_FINAL,
      options: [
        { text: { en: "∠TPA = a too — D and P share a segment, and angles in the same segment are equal", af: "∠TPA = a ook — D en P deel 'n segment, en hoeke in dieselfde segment is gelyk" }, correct: true },
        { text: { en: "∠TPA = 90° − a, the same as T₂", af: "∠TPA = 90° − a, dieselfde as T₂" } },
        { text: { en: "∠TPA can't be pinned down without knowing exactly where P sits", af: "∠TPA kan nie vasgepen word sonder om presies te weet waar P sit nie" } },
        { text: { en: "∠TPA = 2a, double T₁", af: "∠TPA = 2a, dubbel T₁" } },
      ],
      hints: [
        { en: "D and P are two DIFFERENT points, but they're on the SAME side of chord TA. Is there a theorem about two circumference points on the same side of a chord?",
          af: "D en P is twee VERSKILLENDE punte, maar hulle is aan DIESELFDE kant van koord TA. Is daar 'n stelling oor twee omtrekpunte aan dieselfde kant van 'n koord?" },
        { en: "Angles in the same segment, standing on the same chord, are always equal — no matter which two points you pick. So ∠TPA = D₁ = a.",
          af: "Hoeke in dieselfde segment, wat op dieselfde koord staan, is altyd gelyk — ongeag watter twee punte jy kies. Dus ∠TPA = D₁ = a." },
      ],
      reason: "tanChord",
      note: {
        en: "D₁ = a, and D and P sit in the same segment relative to chord TA — so \"angles in the same segment\" hands you ∠TPA = D₁ = a as well. That is the whole proof, for ANY point P in the alternate segment, not just D: draw the diameter from the point of tangency, chase two free right angles through a triangle, then let the same-segment fact carry the result the rest of the way.",
        af: "D₁ = a, en D en P sit in dieselfde segment relatief tot koord TA — dus gee \"hoeke in dieselfde segment\" jou ∠TPA = D₁ = a ook. Dit is die hele bewys, vir ENIGE punt P in die oorstaande segment, nie net D nie: trek die middellyn vanaf die raakpunt, jaag twee verniet-regte-hoeke deur 'n driehoek, en laat die selfde-segment-feit die resultaat dan die res van die pad dra.",
      },
    },

    /* ---------- 6 · the recap — the sentence to carry forward ---------- */
    {
      type: "note",
      prompt: { en: "The sentence to carry forward", af: "Die sin om saam te dra" },
      diagram: FIG_FINAL,
      note: {
        en: "<b>Draw the diameter from the point of tangency — two free right angles and a triangle chase you straight to the result.</b><br><br>Tan ⊥ diameter gives 90° at T; the angle in a semicircle gives a second 90° at any point on the circle; the triangle's angle sum cancels both away and hands the tangent-chord angle right back to you, at a point in the alternate segment. \"Angles in the same segment\" then carries it to every point there, not just the one you drew.<br><br>Next: the exact same construction, on the OTHER side of the chord — and the trap of joining the wrong point once the diameter is down.",
        af: "<b>Trek die middellyn vanaf die raakpunt — twee verniet-regte-hoeke en 'n driehoek jaag jou reguit na die resultaat.</b><br><br>Raaklyn ⊥ middellyn gee 90° by T; die hoek in 'n halfsirkel gee 'n tweede 90° by enige punt op die sirkel; die driehoek se hoeksom kanselleer altwee uit en gee die raaklyn–koord-hoek reguit terug vir jou, by 'n punt in die oorstaande segment. \"Hoeke in dieselfde segment\" dra dit dan na elke punt daar, nie net die een wat jy geteken het nie.<br><br>Volgende: presies dieselfde konstruksie, aan die ANDER kant van die koord — en die strik om die verkeerde punt te verbind sodra die middellyn af is.",
      },
    },

  ],
};
