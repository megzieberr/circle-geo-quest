/* TEACH — What is a cyclic quadrilateral?
   This round EXPLAINS the definition (the theorems come next, for them to
   discover). A quadrilateral with all four vertices on the circle is cyclic.
   Short: define, check, segue. Not graded. */
const AC = "#9c36b5";

const QUAD = { pts: { A: 135, B: 55, C: 315, D: 215 }, chords: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]] };

export const round = {
  id: "qcyclic", n: 1, accent: AC, kind: "discover", group: "g2",
  title: { en: "What is a cyclic quadrilateral?", af: "Wat is 'n koordevierhoek?" },
  blurb: { en: "Meet the shape before you unlock its secrets.", af: "Leer die vorm ken voor jy sy geheime oopsluit." },
  panels: [
    { type: "note",
      prompt: { en: "A special four-sided shape", af: "'n Spesiale vierkantige vorm" },
      diagram: QUAD,
      note: { en: "A <b>cyclic quadrilateral</b> is a four-sided shape with <b>all four vertices (corners) on the circle</b> — like ABCD here. \"Cyclic\" comes from \"circle\": the corners lie on a circle.", af: "'n <b>Koordevierhoek</b> is 'n viersydige vorm met <b>al vier hoekpunte op die sirkel</b> — soos ABCD hier. Die hoekpunte lê op 'n sirkel." } },

    { type: "choice",
      prompt: { en: "Which shape is a cyclic quadrilateral?", af: "Watter vorm is 'n koordevierhoek?" },
      options: [
        { text: { en: "A quadrilateral with all 4 vertices on the circle", af: "'n Vierhoek met al 4 hoekpunte op die sirkel" }, correct: true },
        { text: { en: "A quadrilateral with 3 vertices on the circle and 1 inside it", af: "'n Vierhoek met 3 hoekpunte op die sirkel en 1 binne-in" } },
        { text: { en: "Any four-sided shape", af: "Enige viersydige vorm" } },
        { text: { en: "A quadrilateral with four equal sides", af: "'n Vierhoek met vier gelyke sye" } },
      ],
      hints: [
        { en: "The word 'cyclic' is the clue. Where must every corner lie?", af: "Die woord 'koorde/siklies' is die leidraad. Waar moet elke hoekpunt lê?" },
      ],
      note: { en: "Exactly — <b>all four</b> vertices must be on the circle. If even one corner is off the circle, it is not cyclic.", af: "Presies — <b>al vier</b> hoekpunte moet op die sirkel wees. As selfs een hoekpunt van die sirkel af is, is dit nie 'n koordevierhoek nie." } },

    { type: "note",
      prompt: { en: "Now for the secrets", af: "Nou vir die geheime" },
      diagram: QUAD,
      note: { en: "Because all four corners are locked onto the circle, the angles of a cyclic quad hide two surprising patterns. In the next rounds you'll <b>discover them yourself</b>.", af: "Omdat al vier hoekpunte op die sirkel vasgemaak is, versteek die hoeke van 'n koordevierhoek twee verrassende patrone. In die volgende rondtes gaan jy <b>hulle self ontdek</b>." } },
  ],
};
