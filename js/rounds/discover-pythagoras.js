/* DISCOVERY — Pythagoras on the half-chord (Socratic).
   Once the line from the centre is ⊥ to the chord, a right-angled triangle
   appears: radius = hypotenuse, half-chord and distance-from-centre = legs.
   The learner is guided to use Pythagoras to find the missing length.
   Guided, never graded. */
const AC = "#f76707";

const TRI = { O: true, pts: { A: 205, B: 335 }, mid: [{ name: "M", of: ["A", "B"] }],
  chords: [["A", "B"], ["O", "M"], ["O", "A"]],
  angles: [{ at: "M", legs: ["O", "A"], t: "", o: { v: 90, mark: 1 } }] };

export const round = {
  id: "dpyth", n: 1, accent: AC, kind: "discover", group: "g1",
  title: { en: "Discover: Pythagoras on the chord", af: "Ontdek: Pythagoras op die koord" },
  blurb: { en: "Turn the right angle into a way to find lengths.", af: "Verander die regte hoek in 'n manier om lengtes te vind." },
  panels: [
    { type: "choice",
      prompt: { en: "OM ⊥ AB, so △OMA has a right angle at M. Which side is the hypotenuse?", af: "OM ⊥ AB, dus het △OMA 'n regte hoek by M. Watter sy is die skuinssy?" },
      diagram: TRI,
      options: [
        { text: { en: "OA — the radius (opposite the right angle)", af: "OA — die radius (oorkant die regte hoek)" }, correct: true },
        { text: { en: "OM — from the centre to the chord", af: "OM — van die middelpunt na die koord" } },
        { text: { en: "AM — half of the chord", af: "AM — die helfte van die koord" } },
      ],
      hints: [
        { en: "The hypotenuse is always opposite the right angle. The right angle is at M.", af: "Die skuinssy is altyd oorkant die regte hoek. Die regte hoek is by M." },
      ],
      note: { en: "OA (the radius) is the hypotenuse. The two legs are OM and AM.", af: "OA (die radius) is die skuinssy. Die twee sye is OM en AM." } },

    { type: "blank",
      prompt: { en: "Use Pythagoras to find the half-chord AM", af: "Gebruik Pythagoras om die halfkoord AM te vind" },
      diagram: TRI,
      sentence: [
        { en: "Radius OA = 5 and OM = 3. Then AM = √(5² − 3²) = √(25 − 9) = ", af: "Radius OA = 5 en OM = 3. Dan AM = √(5² − 3²) = √(25 − 9) = " },
        { kind: "num", answer: 4 },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "AM² = OA² − OM² = 25 − 9 = 16. Now take the square root.", af: "AM² = OA² − OM² = 25 − 9 = 16. Neem nou die vierkantswortel." },
        { en: "√16 = 4.", af: "√16 = 4." },
      ],
      reason: "pythagoras",
      note: { en: "AM = √(5² − 3²) = √16 = 4.", af: "AM = √(5² − 3²) = √16 = 4." } },

    { type: "blank",
      prompt: { en: "The half-chord is only half the story", af: "Die halfkoord is net die helfte van die storie" },
      diagram: TRI,
      sentence: [
        { en: "AM = 4, and the centre bisects the chord, so the WHOLE chord AB = 2 × 4 = ", af: "AM = 4, en die middelpunt halveer die koord, dus die HELE koord AB = 2 × 4 = " },
        { kind: "num", answer: 8 },
        { en: ".", af: "." },
      ],
      hints: [
        { en: "The perpendicular from the centre bisects the chord, so AB = 2 × AM.", af: "Die loodlyn vanaf die middelpunt halveer die koord, dus AB = 2 × AM." },
      ],
      note: { en: "Always watch the question: it may ask for the half-chord (AM) or the whole chord (AB = 2·AM).", af: "Let altyd op die vraag: dit kan die halfkoord (AM) of die hele koord (AB = 2·AM) vra." } },

    { type: "note",
      prompt: { en: "Your length toolkit", af: "Jou lengte-gereedskap" },
      note: { en: "In any chord question with a ⊥ from the centre:<br>• <b>radius² = distance² + half-chord²</b><br>• whole chord = 2 × half-chord<br><br>Next you'll use this to solve for the radius, the distance, or the chord.", af: "In enige koordvraag met 'n ⊥ vanaf die middelpunt:<br>• <b>radius² = afstand² + halfkoord²</b><br>• hele koord = 2 × halfkoord<br><br>Volgende gebruik jy dit om die radius, die afstand of die koord op te los." } },
  ],
};
