/* PHASE 3 · Round (id r22) — Proof builder.
   The learner arranges shuffled statement-and-reason cards into the correct
   order to complete each proof. Partial credit per proof (steps in the right
   place). `phase: 3` ties it to the Circle Grand Master rank. */
const AC = "#9c36b5";
const S = (en, af) => ({ en, af });

export const round = {
  id: "r22", n: 22, phase: 3, accent: AC,
  title: { en: "Proof builder", af: "Bewysbouer" },
  blurb: { en: "Arrange the steps to complete each proof.", af: "Rangskik die stappe om elke bewys te voltooi." },
  reasonCode: null,
  questionsPerPlay: 4,
  questions: [
    {
      id: "r22-tanchord", type: "proof", accent: AC,
      prompt: { en: "Prove the tan-chord theorem: ∠TAB = ∠APB. (ST is a tangent at A; P is in the alternate segment.)", af: "Bewys die raaklyn-koord stelling: ∠TAB = ∠APB. (ST is 'n raaklyn by A; P is in die oorstaande segment.)" },
      diagram: { O: true, pts: { A: 270, B: 150, D: 90, P: 40 }, tang: [{ at: "A", lab: ["S", "T"] }],
        chords: [["A", "B"], ["A", "D"], ["B", "D"], ["A", "P"], ["B", "P"]],
        angles: [{ at: "B", legs: ["A", "D"], t: "", o: { v: 90, mark: 1 } }] },
      steps: [
        { s: S("Draw diameter AOD; join BD.", "Trek middellyn AOD; verbind BD."), r: "construction" },
        { s: S("∠ABD = 90°", "∠ABD = 90°"), r: "semiCircle" },
        { s: S("∠TAD = 90°", "∠TAD = 90°"), r: "tanDiameter" },
        { s: S("∠ADB = ∠TAB  (both make 90° with ∠DAB)", "∠ADB = ∠TAB  (albei maak 90° met ∠DAB)"), r: "" },
        { s: S("∠ADB = ∠APB", "∠ADB = ∠APB"), r: "sameSeg" },
        { s: S("∴ ∠TAB = ∠APB", "∴ ∠TAB = ∠APB"), r: "" },
      ],
    },
    {
      id: "r22-centre", type: "proof", accent: AC,
      prompt: { en: "O is the centre. Prove that ∠AOB = 2 × ∠APB.", af: "O is die middelpunt. Bewys dat ∠AOB = 2 × ∠APB." },
      diagram: { O: true, pts: { A: 200, B: 340, P: 90, D: 270 },
        chords: [["O", "A"], ["O", "B"], ["P", "A"], ["P", "B"], ["P", "D"]], angles: [] },
      steps: [
        { s: S("Join PO and produce to D.", "Verbind PO en verleng na D."), r: "construction" },
        { s: S("∠AOD = 2∠OPA  (△OAP isosceles)", "∠AOD = 2∠OPA  (△OAP gelykbenig)"), r: "triExt" },
        { s: S("∠BOD = 2∠OPB  (△OBP isosceles)", "∠BOD = 2∠OPB  (△OBP gelykbenig)"), r: "triExt" },
        { s: S("∠AOB = ∠AOD + ∠BOD", "∠AOB = ∠AOD + ∠BOD"), r: "" },
        { s: S("∴ ∠AOB = 2∠OPA + 2∠OPB = 2∠APB", "∴ ∠AOB = 2∠OPA + 2∠OPB = 2∠APB"), r: "" },
      ],
    },
    {
      id: "r22-cyclic", type: "proof", accent: AC,
      prompt: { en: "ABCD is a cyclic quad with centre O. Prove that ∠B + ∠D = 180°.", af: "ABCD is 'n koordevierhoek met middelpunt O. Bewys dat ∠B + ∠D = 180°." },
      diagram: { O: true, pts: { A: 160, B: 80, C: 340, D: 250 },
        chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["O", "A"], ["O", "C"]], angles: [] },
      steps: [
        { s: S("Join OA and OC.", "Verbind OA en OC."), r: "construction" },
        { s: S("∠O₁ = 2∠B   (∠O₁ and ∠B stand on AC)", "∠O₁ = 2∠B   (∠O₁ en ∠B staan op AC)"), r: "centreDouble" },
        { s: S("∠O₂ = 2∠D   (reflex angle on AC)", "∠O₂ = 2∠D   (refleks hoek op AC)"), r: "centreDouble" },
        { s: S("∠O₁ + ∠O₂ = 360°", "∠O₁ + ∠O₂ = 360°"), r: "roundPt" },
        { s: S("2∠B + 2∠D = 360°", "2∠B + 2∠D = 360°"), r: "" },
        { s: S("∴ ∠B + ∠D = 180°", "∴ ∠B + ∠D = 180°"), r: "" },
      ],
    },
    {
      id: "r22-perpchord", type: "proof", accent: AC,
      prompt: { en: "O is the centre and OM ⊥ AB. Prove that AM = MB.", af: "O is die middelpunt en OM ⊥ AB. Bewys dat AM = MB." },
      diagram: { O: true, pts: { A: 200, B: 340 }, mid: [{ name: "M", of: ["A", "B"] }],
        chords: [["A", "B"], ["O", "M"], ["O", "A"], ["O", "B"]],
        angles: [{ at: "M", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } }] },
      steps: [
        { s: S("Join OA and OB.", "Verbind OA en OB."), r: "construction" },
        { s: S("∠OMA = ∠OMB = 90°", "∠OMA = ∠OMB = 90°"), r: "given" },
        { s: S("OA = OB", "OA = OB"), r: "radii" },
        { s: S("OM = OM", "OM = OM"), r: "commonSide" },
        { s: S("△OAM ≡ △OBM", "△OAM ≡ △OBM"), r: "rhs" },
        { s: S("∴ AM = MB", "∴ AM = MB"), r: "congTri" },
      ],
    },
  ],
};
