/* ============================================================
   GAME CONFIG — tunable rules in one place.
   ============================================================ */
export const CONFIG = {
  // XP economy
  xpPerCorrect: 10,
  firstTryBonus: 5,        // extra XP when correct on the first attempt of a question
  streakStep: 2,           // streak bonus = streakStep * (current streak, capped)
  streakCap: 5,            // streak bonus stops growing after this many in a row
  // daily challenge
  dailyXp: 25,             // flat XP for completing the Daily Challenge (server grants this, once per local day)
  // round pass rule
  passThreshold: 0.8,      // 80% correct (first-try) to pass a round and earn its badge
  // struggling-learner support ("Boost mode")
  rescueAfterFails: 2,     // after this many failed attempts, replays get open hints + second chances
  comebackBonus: 40,       // extra XP for finally passing a round on the 3rd+ attempt
  // admin / participation
  inactiveDays: 7,         // learners not active in this many days get flagged in admin
  // weekly leaderboard resets every Monday 00:00 (handled server-side)
};

// The five brand accents from the tan-chord page, reused across rounds.
export const ACCENTS = ["#e64980", "#f76707", "#0ea271", "#4263eb", "#9c36b5"];
export const INK = "#252a4a";

/* ============================================================
   BADGE GROUPS — earned by completing every round of a group.
   The nine theorems are split into three groups; the mixed rounds
   form two more. A round belongs to a group via its `group` field
   (set in rounds/index.js). Earn a group's badge by passing all of
   its rounds. Intro rounds (group "intro") carry no badge.
   ============================================================ */
export const GROUPS = [
  { id: "g1", icon: "🎯", name: "Centre Seeker",
    blurb: { en: "Midpoints of a Circle — line from the centre, angle at the centre, semicircle.",
             af: "Middelpunte van 'n Sirkel — lyn vanaf die middelpunt, hoek by die middelpunt, halfsirkel." } },
  { id: "g2", icon: "🎓", name: "Cyclic Scholar",
    blurb: { en: "Circumference of a Circle — same segment, equal chords, cyclic quads.",
             af: "Omtrek van 'n Sirkel — selfde segment, gelyke koorde, koordevierhoeke." } },
  { id: "g3", icon: "📐", name: "Tangent Tamer",
    blurb: { en: "Tangents — tangent ⊥ radius, tangent–chord, tangents from a point.",
             af: "Raaklyne — raaklyn ⊥ radius, raaklyn–koord, raaklyne vanuit 'n punt." } },
  { id: "g4", icon: "🔍", name: "Circle Detective",
    blurb: { en: "Spot the theorem and solve multi-step riders.",
             af: "Herken die stelling en los veelstap-vraagstukke op." } },
  { id: "g5", icon: "🏆", name: "Circle Grand Master",
    blurb: { en: "Tough mixed exam-style riders.",
             af: "Moeilike gemengde eksamen-styl vraagstukke." } },
];
export const BASE_RANK = "Newcomer";
