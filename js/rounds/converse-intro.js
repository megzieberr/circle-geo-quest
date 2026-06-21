/* TEACH — Using the converse to prove a cyclic quad.
   A theorem runs cyclic ⟹ angle fact. To PROVE a quad is cyclic we run it
   backwards (the converse): angle fact ⟹ cyclic. Then lists the THREE ways to
   prove a cyclic quad, each with a colour-coded diagram. Not graded. */
const AC = "#9c36b5";
const PUR = "#9c36b5", GRN = "#0ea271", PINK = "#e64980";
const QUAD = { pts: { A: 135, B: 55, C: 315, D: 215 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]] };

// the three ways, as colour-coded mini diagrams
const WAY_OPP = { pts: { A: 140, B: 50, C: 320, D: 215 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
  angles: [{ at: "A", legs: ["D", "B"], t: "", o: { c: PUR } }, { at: "C", legs: ["B", "D"], t: "", o: { c: GRN } }] };
const WAY_EXT = { pts: { A: 140, B: 50, C: 320, D: 215 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["C", "E"]],
  out: [{ name: "E", along: ["B", "C"], len: 28 }],
  angles: [{ at: "C", legs: ["D", "E"], t: "", o: { c: PUR } }, { at: "A", legs: ["D", "B"], t: "", o: { c: GRN } }] };
const WAY_SEG = { pts: { A: 205, B: 335, P: 70, Q: 120 }, chords: [["A", "B"], ["A", "P"], ["B", "P"], ["A", "Q"], ["B", "Q"]],
  angles: [{ at: "P", legs: ["A", "B"], t: "", o: { c: PUR } }, { at: "Q", legs: ["A", "B"], t: "", o: { c: GRN } }] };

// fill-in diagrams
const D_OPP = { pts: { A: 135, B: 55, C: 315, D: 215 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
  angles: [{ at: "A", legs: ["D", "B"], t: "", o: { c: PUR } }, { at: "C", legs: ["B", "D"], t: "", o: { c: GRN } }] };
const D_EXT = { pts: { A: 135, B: 55, C: 315, D: 215 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["C", "E"]],
  out: [{ name: "E", along: ["B", "C"], len: 30 }],
  angles: [{ at: "C", legs: ["D", "E"], t: "", o: { c: PUR } }, { at: "A", legs: ["D", "B"], t: "", o: { c: GRN } }] };
// bowtie: A and B above subtend chord DC below
const D_BOW = { pts: { A: 135, B: 55, C: 325, D: 215 }, chords: [["D", "C"], ["A", "D"], ["A", "C"], ["B", "D"], ["B", "C"]],
  angles: [{ at: "A", legs: ["D", "C"], t: "", o: { c: PUR } }, { at: "B", legs: ["D", "C"], t: "", o: { c: GRN } }] };

export const round = {
  id: "convintro", n: 1, accent: AC, kind: "discover", group: "g2",
  title: { en: "Proving cyclic: the converse", af: "Bewys koordevierhoek: die omgekeerde" },
  blurb: { en: "Theorems run two ways — and three ways to prove cyclic.", af: "Stellings werk twee rigtings — en drie maniere om koordevierhoek te bewys." },
  panels: [
    { type: "note",
      prompt: { en: "Theorems run two ways", af: "Stellings werk twee rigtings" },
      diagram: QUAD,
      note: { en: "The theorem you discovered says:<br><b>cyclic quad ⟹ opposite angles add to 180°.</b><br><br>To <b>prove</b> a quadrilateral IS cyclic, you run it backwards — the <b>converse</b>:<br><b>opposite angles add to 180° ⟹ cyclic quad.</b>", af: "Die stelling wat jy ontdek het sê:<br><b>koordevierhoek ⟹ teenoorstaande hoeke tel op tot 180°.</b><br><br>Om te <b>bewys</b> dat 'n vierhoek 'n koordevierhoek IS, werk jy agtertoe — die <b>omgekeerde</b>:<br><b>teenoorstaande hoeke tel op tot 180° ⟹ koordevierhoek.</b>" } },

    { type: "choice",
      prompt: { en: "To PROVE a quad is cyclic, how do you argue?", af: "Om te BEWYS 'n vierhoek is 'n koordevierhoek, hoe redeneer jy?" },
      options: [
        { text: { en: "From the angle facts TO “it is cyclic” (the converse)", af: "Vanaf die hoekfeite NA “dit is 'n koordevierhoek” (die omgekeerde)" }, correct: true },
        { text: { en: "From “it is cyclic” to the angle facts (the theorem)", af: "Vanaf “dit is 'n koordevierhoek” na die hoekfeite (die stelling)" } },
        { text: { en: "You can't prove it — you just measure the angles", af: "Jy kan dit nie bewys nie — jy meet net die hoeke" } },
      ],
      hints: [{ en: "Proving means ENDING at 'it is cyclic'. So you must START from the angle facts.", af: "Bewys beteken om te EINDIG by 'dit is 'n koordevierhoek'. So jy moet BEGIN by die hoekfeite." }],
      note: { en: "Right — you start from the angles and conclude it's cyclic. That's the converse.", af: "Reg — jy begin by die hoeke en lei af dis 'n koordevierhoek. Dít is die omgekeerde." } },

    { type: "note",
      prompt: { en: "Three ways to prove a cyclic quad", af: "Drie maniere om 'n koordevierhoek te bewys" },
      diagrams: [
        { diagram: WAY_OPP, caption: { en: "<b>1.</b> Opposite ∠s add to 180°<br><i>converse opp ∠s of cyclic quad</i>", af: "<b>1.</b> Teenoorst. ∠e tel tot 180°<br><i>omgekeerde teenoorst. ∠e van kvh</i>" } },
        { diagram: WAY_EXT, caption: { en: "<b>2.</b> Ext ∠ = int opposite ∠<br><i>converse ext ∠ of cyclic quad</i>", af: "<b>2.</b> Buite∠ = binne-teenoorst. ∠<br><i>omgekeerde buite∠ van kvh</i>" } },
        { diagram: WAY_SEG, caption: { en: "<b>3.</b> Two equal ∠s, same side of a line<br><i>converse ∠s in same seg</i>", af: "<b>3.</b> Twee gelyke ∠e, selfde kant<br><i>omgekeerde ∠e in selfde segm.</i>" } },
      ],
      note: { en: "Any ONE of these three proves a quad (or four points) is cyclic. Each reason starts with the word <b>converse</b> — that word is essential. Watch out: the plain reasons (no “converse”) are the forward theorems, only used once you ALREADY know it's cyclic.", af: "Enige EEN van hierdie drie bewys 'n vierhoek (of vier punte) is 'n koordevierhoek. Elke rede begin met die woord <b>omgekeerde</b> — daardie woord is noodsaaklik. Pasop: die gewone redes (geen “omgekeerde”) is die vorentoe stellings, net gebruik wanneer jy AL weet dis 'n koordevierhoek." } },

    { type: "blank",
      prompt: { en: "Now you try — opposite angles", af: "Nou jy — teenoorstaande hoeke" },
      diagram: D_OPP,
      sentence: [
        { en: "If ∠A and ∠C are ", af: "As ∠A en ∠C " },
        { kind: "word", answer: "supplementary", options: ["supplementary", "equal", "complementary", "opposite", "double", "half"] },
        { en: " (they add up to 180°), then ABCD is a cyclic quad. Reason: ", af: " is (hulle tel op tot 180°), dan is ABCD 'n koordevierhoek. Rede: " },
        { kind: "reason", answer: "cyclicOppConv", options: ["cyclicOppConv", "cyclicOpp", "cyclicExtConv", "sameSegConv"] },
        { en: "", af: "" },
      ],
      hints: [
        { en: "Two angles that add to 180° are 'supplementary'. And the reason MUST start with 'converse'.", af: "Twee hoeke wat tot 180° optel is 'supplementêr'. En die rede MOET met 'omgekeerde' begin." },
        { en: "Supplementary opposite angles → converse opp ∠s of cyclic quad.", af: "Supplementêre teenoorstaande hoeke → omgekeerde teenoorst. ∠e van kvh." },
      ],
      note: { en: "Supplementary opposite angles prove a cyclic quad — by the converse.", af: "Supplementêre teenoorstaande hoeke bewys 'n koordevierhoek — deur die omgekeerde." } },

    { type: "blank",
      prompt: { en: "Now you try — exterior angle", af: "Nou jy — buitehoek" },
      diagram: D_EXT,
      sentence: [
        { en: "If the exterior angle at C equals the interior ", af: "As die buitehoek by C gelyk is aan die binne-" },
        { kind: "word", answer: "opposite", options: ["opposite", "adjacent", "equal", "supplementary", "double", "half"] },
        { en: " angle, then ABCD is a cyclic quad. Reason: ", af: " hoek, dan is ABCD 'n koordevierhoek. Rede: " },
        { kind: "reason", answer: "cyclicExtConv", options: ["cyclicExtConv", "cyclicExt", "cyclicOppConv", "sameSegConv"] },
        { en: "", af: "" },
      ],
      hints: [
        { en: "The exterior angle copies the angle diagonally across the quad — and pick the 'converse' reason.", af: "Die buitehoek kopieer die hoek dwarsoor die vierhoek — en kies die 'omgekeerde' rede." },
        { en: "Exterior = interior OPPOSITE angle → converse ext ∠ of cyclic quad.", af: "Buite = binne-TEENOORSTAANDE hoek → omgekeerde buite∠ van kvh." },
      ],
      note: { en: "Exterior angle = interior opposite angle proves a cyclic quad — by the converse.", af: "Buitehoek = binne-teenoorstaande hoek bewys 'n koordevierhoek — deur die omgekeerde." } },

    { type: "blank",
      prompt: { en: "Now you try — the bowtie", af: "Nou jy — die strikdas" },
      diagram: D_BOW,
      sentence: [
        { en: "∠A and ∠B both stand on chord DC. If ∠A and ∠B are ", af: "∠A en ∠B staan albei op koord DC. As ∠A en ∠B " },
        { kind: "word", answer: "equal", options: ["equal", "unequal", "supplementary", "double", "half", "opposite"] },
        { en: ", then A, B, C and D lie on a circle. Reason: ", af: " is, dan lê A, B, C en D op 'n sirkel. Rede: " },
        { kind: "reason", answer: "sameSegConv", options: ["sameSegConv", "sameSeg", "cyclicOppConv", "cyclicExtConv"] },
        { en: "", af: "" },
      ],
      hints: [
        { en: "Two angles on the same chord, on the same side — what must they be to force the points onto one circle?", af: "Twee hoeke op dieselfde koord, aan dieselfde kant — wat moet hulle wees om die punte op een sirkel te dwing?" },
        { en: "If they're EQUAL → converse ∠s in same seg.", af: "As hulle GELYK is → omgekeerde ∠e in selfde segm." },
      ],
      note: { en: "Equal angles on the same chord (same side) prove the points are concyclic — by the converse.", af: "Gelyke hoeke op dieselfde koord (selfde kant) bewys die punte is konsiklies — deur die omgekeerde." } },
  ],
};
