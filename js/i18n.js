/* ============================================================
   BILINGUAL LAYER (English / Afrikaans)
   ------------------------------------------------------------
   Every learner-facing string lives here as { en, af }.
   - tx(obj)        : resolve an inline {en, af} object
   - t(key)         : resolve a UI string by key
   - reason(code)   : resolve a CAPS reason by code
   - getLang/setLang/onLangChange : the toggle

   Afrikaans is filled for the whole UI and every reason. Where a
   round imports legacy English-only data (Round 10), reasonAuto()
   maps the known reason phrases to Afrikaans and falls back to the
   English string for anything not yet translated.
   ============================================================ */

const KEY = "cgg.lang";
let lang = localStorage.getItem(KEY) || "en";
const listeners = new Set();

export function getLang() { return lang; }
export function setLang(l) {
  lang = (l === "af") ? "af" : "en";
  localStorage.setItem(KEY, lang);
  document.documentElement.lang = lang;
  listeners.forEach(fn => fn(lang));
}
export function onLangChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/** Resolve an inline {en, af} string object (falls back to en). */
export function tx(obj) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] ?? obj.en ?? "";
}

/* ---------- UI strings ---------- */
const UI = {
  appName:        { en: "Circle Quest", af: "Circle Quest" },
  tagline:        { en: "Grade 11 Circle Geometry", af: "Graad 11 Sirkelmeetkunde" },

  // login
  chooseName:     { en: "Who are you?", af: "Wie is jy?" },
  chooseNameSub:  { en: "Tap your name to begin.", af: "Klik op jou naam om te begin." },
  searchName:     { en: "Search your name…", af: "Soek jou naam…" },
  setPassword:    { en: "Create your password", af: "Skep jou wagwoord" },
  setPasswordSub: { en: "First time here. Pick a password you'll remember — you'll use it every time you log in.", af: "Eerste keer hier. Kies 'n wagwoord wat jy sal onthou — jy gebruik dit elke keer wat jy inteken." },
  enterPassword:  { en: "Enter your password", af: "Tik jou wagwoord in" },
  password:       { en: "Password", af: "Wagwoord" },
  confirmPassword:{ en: "Confirm password", af: "Bevestig wagwoord" },
  login:          { en: "Log in", af: "Teken in" },
  start:          { en: "Start", af: "Begin" },
  back:           { en: "Back", af: "Terug" },
  logOut:         { en: "Log out", af: "Teken uit" },
  wrongPassword:  { en: "That password isn't right. Try again, or ask your teacher.", af: "Daardie wagwoord is verkeerd. Probeer weer, of vra jou onderwyser." },
  passwordsDiffer:{ en: "The two passwords don't match.", af: "Die twee wagwoorde stem nie ooreen nie." },
  passwordTooShort:{ en: "Use at least 4 characters.", af: "Gebruik ten minste 4 karakters." },
  offline:        { en: "Can't reach the server. Check your connection.", af: "Kan nie die bediener bereik nie. Kontroleer jou verbinding." },

  // home / map
  home:           { en: "Home", af: "Tuis" },
  yourQuest:      { en: "Your quest", af: "Jou soektog" },
  totalXp:        { en: "Total XP", af: "Totale XP" },
  badges:         { en: "Badges", af: "Badges" },
  rank:           { en: "Rank", af: "Rang" },
  locked:         { en: "Locked", af: "Gesluit" },
  passPrev:       { en: "Pass the round before to unlock.", af: "Slaag die vorige rondte om oop te sluit." },
  startHere:      { en: "Start here", af: "Begin hier" },
  continueQuest:  { en: "Continue your quest", af: "Gaan voort met jou soektog" },
  resume:         { en: "Continue", af: "Gaan voort" },
  upNext:         { en: "Up next", af: "Volgende" },
  roundsDone:     { en: "rounds done", af: "rondtes klaar" },
  moreToCome:     { en: "More rounds unlock as you go 🔓", af: "Meer rondtes ontsluit soos jy vorder 🔓" },
  play:           { en: "Play", af: "Speel" },
  replay:         { en: "Replay", af: "Speel weer" },
  watch:          { en: "Watch", af: "Kyk" },
  discover:       { en: "Discover", af: "Ontdek" },
  explore:        { en: "Explore", af: "Verken" },
  passed:         { en: "Passed", af: "Geslaag" },
  bestScore:      { en: "Best", af: "Beste" },
  leaderboard:    { en: "Leaderboard", af: "Leaderboard" },

  // round / play
  question:       { en: "Question", af: "Vraag" },
  of:             { en: "of", af: "van" },
  check:          { en: "Check", af: "Kontroleer" },
  next:           { en: "Next", af: "Volgende" },
  finish:         { en: "Finish", af: "Voltooi" },
  correct:        { en: "Correct!", af: "Korrek!" },
  notQuite:       { en: "Not quite.", af: "Nie heeltemal nie." },
  theAnswer:      { en: "Answer", af: "Antwoord" },
  reasonLabel:    { en: "Reason", af: "Rede" },
  tapToAnswer:    { en: "Tap the diagram to answer.", af: "Klik op die diagram om te antwoord." },
  yes:            { en: "Yes", af: "Ja" },
  no:             { en: "No", af: "Nee" },
  firstTry:       { en: "First try!", af: "Eerste poging!" },
  streak:         { en: "Streak", af: "Streak" },
  replayNoXp:     { en: "Replay — Badge already earned, so no XP this time.", af: "Herhaling — Badge reeds verdien, dus geen XP hierdie keer nie." },

  // results
  roundComplete:  { en: "Round complete", af: "Rondte voltooi" },
  youScored:      { en: "You scored", af: "Jy het behaal" },
  xpEarned:       { en: "XP earned", af: "XP verdien" },
  badgeEarned:    { en: "Badge earned!", af: "Badge verdien!" },
  roundPassed:    { en: "Round passed — next round unlocked!", af: "Rondte geslaag — volgende rondte oopgesluit!" },
  notPassedYet:   { en: "So close! Reach 80% to pass and unlock the next round.", af: "So naby! Behaal 80% om te slaag en die volgende rondte oop te sluit." },
  replayNoXpMsg:  { en: "You've already mastered this round, so no XP this time — but great practice! 💪", af: "Jy het hierdie rondte reeds bemeester, dus geen XP hierdie keer nie — maar goeie oefening! 💪" },
  backHome:       { en: "Back to map", af: "Terug na kaart" },
  tryAgain:       { en: "Try again", af: "Probeer weer" },
  nextRound:      { en: "Go to next round →", af: "Gaan na volgende rondte →" },

  // leaderboard
  weekly:         { en: "This week", af: "Hierdie week" },
  allTime:        { en: "All time", af: "Algeheel" },
  you:            { en: "You", af: "Jy" },
  yourRank:       { en: "Your rank", af: "Jou rang" },
  noScores:       { en: "No scores yet — be the first!", af: "Nog geen tellings nie — wees eerste!" },

  // proof builder
  buildProof:     { en: "Build the proof — tap the cards in order", af: "Bou die bewys — klik die kaarte in volgorde" },
  cardsLeft:      { en: "Cards left", af: "Kaarte oor" },
  checkProof:     { en: "Check proof", af: "Kontroleer bewys" },
  resetProof:     { en: "Reset", af: "Herstel" },
  proofCorrect:   { en: "Correct proof! 🎓", af: "Korrekte bewys! 🎓" },
  proofPartial:   { en: "in the right place", af: "op die regte plek" },
  correctOrder:   { en: "The correct order:", af: "Die korrekte volgorde:" },
  tapToPlace:     { en: "tap a card to place it here…", af: "klik 'n kaart om dit hier te plaas…" },

  // rank tiers
  rankLabel:      { en: "Your rank", af: "Jou rang" },
  rankEarned:     { en: "Earned", af: "Verdien" },
  rankProgress:   { en: "rounds", af: "rondtes" },
  newRank:        { en: "New rank unlocked!", af: "Nuwe rang oopgesluit!" },

  // discovery rounds
  continue:       { en: "Continue", af: "Gaan voort" },
  notQuiteTry:    { en: "Not quite — try again.", af: "Nie heeltemal nie — probeer weer." },
  notQuiteThink:  { en: "Not quite. Use the diagram and the hint below.", af: "Nie heeltemal nie. Gebruik die diagram en die wenk hieronder." },
  hereIsAnswer:   { en: "Here's the answer — read it through so it makes sense, then carry on. You'll get the next one!", af: "Hier is die antwoord — lees dit deur sodat dit sin maak, en gaan dan voort. Jy kry die volgende een reg!" },
  hint:           { en: "Hint", af: "Wenk" },
  youGotIt:       { en: "You've got it!", af: "Jy het dit!" },
  tapBlank:       { en: "Tap a blank above, then choose your answer.", af: "Klik op 'n oop spasie hierbo, kies dan jou antwoord." },
  discoverComplete:{ en: "Theorem discovered!", af: "Stelling ontdek!" },
  introDone:      { en: "You've met every part!", af: "Jy ken nou elke deel!" },
  discoverUnlocked:{ en: "Nice exploring — the next round is unlocked.", af: "Goed verken — die volgende rondte is oopgesluit." },
  dragHint:       { en: "Drag the dot to explore.", af: "Sleep die kol om te verken." },

  // adventures (Grand Master bonus)
  adventures:      { en: "Adventures", af: "Avonture" },
  grandMasterArena:{ en: "Grand Master Arena", af: "Grootmeester-arena" },
  adventuresBlurb: { en: "Bonus challenges for Grand Masters — earn extra XP!", af: "Bonus-uitdagings vir Grootmeesters — verdien ekstra XP!" },
  adventureLocked: { en: "Earn all 5 badges to unlock the Adventures.", af: "Verdien al 5 badges om die Avonture oop te sluit." },
  fillReasons:     { en: "Fill the reasons", af: "Vul die redes in" },
  fillValues:      { en: "Fill the values", af: "Vul die waardes in" },
  fillBoth:        { en: "Value + reason", af: "Waarde + rede" },
  spotError:       { en: "Spot the error", af: "Vind die fout" },
  completeProof:   { en: "Complete the proof", af: "Voltooi die bewys" },
  advProofHint:    { en: "Each line of the proof is given. Tap a blank and choose the missing reason.", af: "Elke reël van die bewys is gegee. Klik 'n oop spasie en kies die ontbrekende rede." },
  advReasonsHint:  { en: "Each statement is given. Tap a row, then choose its reason.", af: "Elke stelling is gegee. Klik 'n ry, kies dan sy rede." },
  advValuesHint:   { en: "Each reason is given. Tap a row, then type the angle.", af: "Elke rede is gegee. Klik 'n ry, tik dan die hoek." },
  advMixedHint:    { en: "Fill in BOTH the angle and its reason for every row.", af: "Vul BEIDE die hoek en sy rede vir elke ry in." },
  advSpotHint:     { en: "One line of the solution is wrong. Tap the line you think is the mistake.", af: "Een reël van die oplossing is verkeerd. Klik die reël wat jy dink die fout is." },
  advSpotCorrect:  { en: "Spotted it — that line is the mistake.", af: "Reg gesien — daardie reël is die fout." },
  advSpotWrong:    { en: "Not that one — the real mistake is highlighted.", af: "Nie daardie een nie — die werklike fout is uitgelig." },
  advPickReason:   { en: "tap to choose a reason…", af: "klik om 'n rede te kies…" },
  correctRows:     { en: "correct", af: "korrek" },
  advCleared:      { en: "Adventure cleared! 🏆", af: "Avontuur voltooi! 🏆" },
  advTryAgainMsg:  { en: "Give it another go to clear it (80%).", af: "Probeer weer om dit te voltooi (80%)." },

  // hints (graded rounds)
  needHint:       { en: "Stuck? Get a hint", af: "Vasgeval? Kry 'n wenk" },
  anotherHint:    { en: "Another hint", af: "Nog 'n wenk" },
  hintThink:      { en: "Think about", af: "Dink aan" },
  hintNoMore:     { en: "That's every hint — give it your best shot!", af: "Dis al die wenke — gee dit jou beste poging!" },
  hintUsedNote:   { en: "Hints are free here — use them to learn, not to lose marks.", af: "Wenke is gratis hier — gebruik dit om te leer." },

  // fix-my-mistakes
  fixMistakes:    { en: "Fix your mistakes", af: "Maak jou foute reg" },
  fixCardBlurb:   { en: "Re-try the questions you missed. Get one right and it leaves the pile.", af: "Probeer weer die vrae wat jy gemis het. Kry een reg en dit verlaat die stapel." },
  fixToFix:       { en: "to fix", af: "om reg te maak" },
  fixStart:       { en: "Fix them", af: "Maak reg" },
  fixNone:        { en: "Nothing to fix — you're all caught up! 🎉", af: "Niks om reg te maak nie — jy is op datum! 🎉" },
  fixEmptyHint:   { en: "Miss a question in a round and it lands here so you can master it.", af: "Mis 'n vraag in 'n rondte en dit beland hier sodat jy dit kan bemeester." },
  fixComplete:    { en: "Mistakes session done", af: "Foute-sessie klaar" },
  fixCleared:     { en: "cleared", af: "reggemaak" },
  fixStillToGo:   { en: "still to fix", af: "nog reg te maak" },
  fixFromRound:   { en: "From round", af: "Uit rondte" },
  fixAllClear:    { en: "Every mistake cleared — brilliant! 🌟", af: "Elke fout reggemaak — briljant! 🌟" },

  // daily challenge
  dailyChallenge: { en: "Daily Challenge", af: "Daaglikse Uitdaging" },
  dailyBlurb:     { en: "5 quick questions to keep every theorem fresh.", af: "5 vinnige vrae om elke stelling vars te hou." },
  dailyStart:     { en: "Start today's 5", af: "Begin vandag se 5" },
  dailyDoneToday: { en: "Done for today 🎉 Come back tomorrow!", af: "Klaar vir vandag 🎉 Kom môre terug!" },
  dailyReplay:    { en: "Practise again", af: "Oefen weer" },
  dayStreak:      { en: "day streak", af: "dag-streak" },
  streakBest:     { en: "best", af: "beste" },
  dailyLocked:    { en: "Pass your first round to unlock the Daily Challenge.", af: "Slaag jou eerste rondte om die Daaglikse Uitdaging oop te sluit." },
  dailyComplete:  { en: "Daily Challenge complete!", af: "Daaglikse Uitdaging voltooi!" },
  dailyStreakUp:  { en: "day streak — keep it alive tomorrow!", af: "dag-streak — hou dit môre lewendig!" },
  dailyStreakNew: { en: "Streak started! Come back tomorrow to build it.", af: "Streak begin! Kom môre terug om dit te bou." },
  dailyKeptFresh: { en: "Great retrieval practice — this is how it sticks. 🧠", af: "Goeie oefening — só bly dit vassteek. 🧠" },

  // weekly hype — "Star of the Week" (weekly.js)
  // -- Friday–Sunday rally (live standings + weekend push) --
  wkRallyEyebrow: { en: "Weekend rally", af: "Naweek-jaag" },
  wkRallyTitle:   { en: "The board locks soon!", af: "Die telbord sluit binnekort!" },
  wkLockHook:     { en: "The weekly board locks Sunday night.", af: "Die week-telbord sluit Sondagaand." },
  wkYouAreNum:    { en: "You're", af: "Jy is" },                         // …followed by "#4"
  wkOnly:         { en: "only", af: "net" },
  wkBehind:       { en: "behind", af: "agter" },                         // "only 20 XP behind #3"
  wkClimbHook:    { en: "One good round could do it!", af: "Een goeie rondte kan dit doen!" },
  wkRallyClimb:   { en: "climb the board before it locks!", af: "klim die telbord voor dit sluit!" },
  wkTopNow:       { en: "You're #1 this week — defend your crown! 👑", af: "Jy is #1 hierdie week — verdedig jou kroon! 👑" },
  wkNoScoreYet:   { en: "You haven't scored this week yet — a quick Daily Challenge bumps you up.", af: "Jy het nog nie hierdie week getel nie — 'n vinnige Daaglikse Uitdaging stoot jou op." },
  // -- Monday–Tuesday crown (last week's settled results) --
  wkCrownEyebrow: { en: "Results day", af: "Uitslagdag" },
  wkCrownTitle:   { en: "Last week's results", af: "Verlede week se uitslae" },
  wkAwardStar:    { en: "Star of the Week", af: "Ster van die Week" },
  wkAwardImproved:{ en: "Most Improved", af: "Meeste Verbeter" },        // Phase B
  wkAwardStreak:  { en: "On Fire", af: "Aan die Brand" },                // Phase B
  wkYouAreStar:   { en: "You're the Star of the Week! 🌟", af: "Jy is die Ster van die Week! 🌟" },
  wkFinishedNum:  { en: "You finished", af: "Jy het geëindig" },         // "You finished #4 last week — …"
  wkLastWeek:     { en: "last week", af: "verlede week" },
  wkUp:           { en: "up", af: "op" },                                // "up 2 spots 🔼"
  wkSteady:       { en: "holding steady 💪", af: "hou steady 💪" },
  wkBounceBack:   { en: "a fresh week to climb 💪", af: "'n vars week om te klim 💪" },
  wkBestWeek:     { en: "your best week yet! 🌟", af: "jou beste week tot dusver! 🌟" },
  wkFirstWeek:    { en: "your first full week — welcome aboard!", af: "jou eerste volle week — welkom aan boord!" },
  wkSatOut:       { en: "You sat last week out — this week's a clean slate. Jump in!", af: "Jy het verlede week oorgeslaan — hierdie week is 'n skoon lei. Spring in!" },
  // -- shared buttons --
  wkLetsGo:       { en: "Let's go →", af: "Kom ons gaan →" },
  wkNice:         { en: "Nice! 🎉", af: "Lekker! 🎉" },
  wkSeeBoard:     { en: "See full board →", af: "Sien volle telbord →" },

  // daily reminders (push notifications)
  remindTitle:    { en: "Daily reminder", af: "Daaglikse onthounota" },
  remindBlurb:    { en: "Get a friendly ping to do your daily quest.", af: "Kry 'n vriendelike por om jou daaglikse soektog te doen." },
  remindEnable:   { en: "🔔 Turn on", af: "🔔 Skakel aan" },
  remindAsking:   { en: "Just a sec…", af: "Net 'n oomblik…" },
  remindOn:       { en: "Reminders on", af: "Onthounotas aan" },
  remindTurnOff:  { en: "Turn off", af: "Skakel af" },
  remindBlocked:  { en: "Notifications are blocked. Turn them on in your phone's settings, then reopen the app.", af: "Kennisgewings is geblokkeer. Skakel dit aan in jou foon se instellings en maak die app weer oop." },
  remindFail:     { en: "Couldn't turn on reminders. Try again.", af: "Kon nie onthounotas aanskakel nie. Probeer weer." },
  remindIosHint:  { en: "On iPhone: add Circle Quest to your home screen and open it from there first.", af: "Op iPhone: voeg Circle Quest by jou tuisskerm en maak dit eers daar oop." },

  // install / "add to home screen" guide
  installBtn:     { en: "📱 How to install on your phone", af: "📱 Hoe om op jou foon te installeer" },
  installTitle:   { en: "Add Circle Quest to your phone", af: "Voeg Circle Quest by jou foon" },
  installWhy:     { en: "Install it like a normal app — you get a home-screen icon, and you can switch on daily reminders.", af: "Installeer dit soos 'n gewone app — jy kry 'n tuisskerm-ikoon en kan daaglikse onthounotas aanskakel." },
  installIphone:  { en: "iPhone or iPad", af: "iPhone of iPad" },
  installAndroid: { en: "Android phone or tablet", af: "Android-foon of -tablet" },
  installNotifLine:{ en: "Want daily reminders? After installing, open the app, tap 🔔 Turn on, then Allow.", af: "Wil jy daaglikse onthounotas hê? Ná installasie, maak die app oop, tik 🔔 Skakel aan, en kies Toelaat." },
  installAlready: { en: "You've already installed Circle Quest — you're all set! 🎉", af: "Jy het Circle Quest reeds geïnstalleer — alles reg! 🎉" },
  installGotIt:   { en: "Got it!", af: "Reg so!" },

  // anonymous end-of-game feedback survey
  surveyEyebrow:    { en: "Your turn 😄", af: "Jou beurt 😄" },
  surveyCardTitle:  { en: "Tell your teacher how it's going", af: "Vertel jou onderwyser hoe dit gaan" },
  surveyCardBlurb:  { en: "It's anonymous — your teacher won't see who said what. Be honest! 💛", af: "Dit is anoniem — jou onderwyser sal nie sien wie wat gesê het nie. Wees eerlik! 💛" },
  surveyGive:       { en: "Give feedback", af: "Gee terugvoer" },
  surveyChange:     { en: "Change my answer", af: "Verander my antwoord" },
  surveyThanks:     { en: "Thanks for your feedback! 💛", af: "Dankie vir jou terugvoer! 💛" },
  surveyTitle:      { en: "How was Circle Quest for you?", af: "Hoe was Circle Quest vir jou?" },
  surveyAnon:       { en: "100% anonymous — your teacher can't see who said what, so be totally honest.", af: "100% anoniem — jou onderwyser kan nie sien wie wat gesê het nie, so wees heeltemal eerlik." },
  surveyPickFace:   { en: "Tap the face that fits best", af: "Tik die gesig wat die beste pas" },
  surveyWriteLabel: { en: "Want to tell us more? (optional)", af: "Wil jy ons meer vertel? (opsioneel)" },
  surveyPlaceholder:{ en: "Was it fun or boring? Too easy or too hard? Did you get stuck or confused? Should we keep playing games like this for the rest of the term?", af: "Was dit lekker of vervelig? Te maklik of te moeilik? Het jy vasgehaak of deurmekaar geraak? Moet ons aanhou om sulke speletjies vir die res van die kwartaal te speel?" },
  surveySubmit:     { en: "Send to teacher", af: "Stuur aan onderwyser" },
  surveySending:    { en: "Sending…", af: "Stuur…" },
  surveyPickFirst:  { en: "Tap a face first 🙂", af: "Tik eers 'n gesig 🙂" },
  surveyFail:       { en: "Couldn't send. Check your connection and try again.", af: "Kon nie stuur nie. Kontroleer jou verbinding en probeer weer." },
  surveyDone:       { en: "Thank you! 💛", af: "Dankie! 💛" },
  surveyDoneMsg:    { en: "Your honest feedback helps your teacher make this better for you.", af: "Jou eerlike terugvoer help jou onderwyser om dit vir jou beter te maak." },
  surveyPopupTitle: { en: "You finished Circle Quest! 🎉", af: "Jy het Circle Quest klaar gespeel! 🎉" },
  surveyPopupBlurb: { en: "One last thing — tell your teacher how it felt. It's anonymous.", af: "Nog een ding — vertel jou onderwyser hoe dit gevoel het. Dit is anoniem." },
  surveyLater:      { en: "Maybe later", af: "Dalk later" },
  // the five faces (crying → heart-eyes); labels are for hover/accessibility
  face1:            { en: "Hated it", af: "Gehaat dit" },
  face2:            { en: "Didn't like it", af: "Nie van gehou nie" },
  face3:            { en: "It was OK", af: "Dit was OK" },
  face4:            { en: "Liked it", af: "Daarvan gehou" },
  face5:            { en: "Loved it!", af: "Mal daaroor!" },

  // misc
  language:       { en: "Afrikaans", af: "English" }, // label shows the OTHER language to switch to
  loading:        { en: "Loading…", af: "Laai…" },
  comingSoon:     { en: "Coming soon", af: "Binnekort beskikbaar" },
};

export function t(key) {
  const o = UI[key];
  if (!o) return key;
  return o[lang] ?? o.en;
}

/* ---------- Parts of a circle (Round 1 vocabulary) ---------- */
export const PARTS = {
  centre:        { en: "centre",        af: "middelpunt" },
  radius:        { en: "radius",        af: "radius" },
  diameter:      { en: "diameter",      af: "middellyn" },
  chord:         { en: "chord",         af: "koord" },
  arc:           { en: "arc",           af: "boog" },
  sector:        { en: "sector",        af: "sektor" },
  segment:       { en: "segment",       af: "segment" },
  tangent:       { en: "tangent",       af: "raaklyn" },
  circumference: { en: "circumference", af: "omtrek" },
};

/* ---------- CAPS reason bank ----------
   Afrikaans wording follows the official DBE "Aanvaarbare Redes
   (Euclidean Geometry)" list so it matches exactly what learners
   must write in the exam. */
export const REASONS = {
  tanChord:      { en: "tan-chord theorem",        af: "raaklyn-koord-stelling" },
  straightLine:  { en: "∠s on a str line",         af: "∠e op 'n reguitlyn" },
  triSum:        { en: "int ∠s of Δ",              af: "binne-∠e van Δ" },
  tanRadius:     { en: "tan ⊥ radius",             af: "raaklyn ⊥ radius" },
  tanDiameter:   { en: "tan ⊥ diameter",           af: "raaklyn ⊥ middellyn" },
  // converses — used to PROVE a line is a tangent
  tanRadiusConv: { en: "converse tan ⊥ radius",    af: "omgekeerde raaklyn ⊥ radius" },
  tanChordConv:  { en: "converse tan-chord",       af: "omgekeerde raaklyn-koord" },
  semiCircle:    { en: "∠ in semi-circle",         af: "∠ in semi sirkel" },
  tansCommonPt:  { en: "tans from same pt",        af: "raaklyne vanuit dieselfde punt" },
  sameSeg:       { en: "∠s in same seg",           af: "∠e in dieselfde segment" },
  isosBase:      { en: "∠s opp equal sides",       af: "∠e teenoor gelyke sye" },
  sidesOppAngles:{ en: "sides opp equal ∠s",       af: "sye teenoor gelyke ∠e" },
  centreDouble:  { en: "∠ at centre = 2 × ∠ at circumference", af: "middelpuntshoek = 2 × omtrekshoek" },
  centrePerpChord:{ en: "line from centre ⊥ to chord", af: "lyn vanuit mdpt ⊥ op koord" },
  centreMidChord:{ en: "line from centre to midpt of chord", af: "lyn vanuit mdpt na mdpt van koord" },
  cyclicOpp:     { en: "opp ∠s of cyclic quad",    af: "teenoorst. ∠e van kvh" },
  cyclicExt:     { en: "ext ∠ of cyclic quad",     af: "buite∠ van kvh" },
  // converses — used to PROVE a quadrilateral is cyclic ("converse" is essential)
  cyclicOppConv: { en: "converse opp ∠s of cyclic quad", af: "omgekeerde teenoorst. ∠e van kvh" },
  cyclicExtConv: { en: "converse ext ∠ of cyclic quad",  af: "omgekeerde buite∠ van kvh" },
  sameSegConv:   { en: "converse ∠s in same seg",        af: "omgekeerde ∠e in selfde segm." },
  equalChords:   { en: "equal chords subtend equal ∠s", af: "gelyke koorde; gelyke ∠e" },
  pythagoras:    { en: "Pythagoras",               af: "Pythagoras" },
  radiiEqual:    { en: "radii equal",              af: "radii" },
  altAngles:     { en: "alt ∠s ; lines ∥",         af: "verw. ∠e ; lyne ∥" },
  diamMidChord:  { en: "line from centre to midpt of chord ⊥ chord", af: "lyn vanuit mdpt ⊥ op koord" },
  // proof-building reasons
  construction:  { en: "construction",        af: "konstruksie" },
  given:         { en: "given",               af: "gegee" },
  radii:         { en: "radii",               af: "radii" },
  commonSide:    { en: "common",              af: "gemeen" },
  rhs:           { en: "RHS",                 af: "RHS" },
  congTri:       { en: "≡ Δs",                af: "≡ Δe" },
  triExt:        { en: "ext ∠ of Δ",          af: "buite∠ van Δ" },
  roundPt:       { en: "∠s around a point",   af: "∠e rondom 'n punt" },
};

export function reason(code) {
  const o = REASONS[code];
  if (!o) return code;
  return o[lang] ?? o.en;
}

/* ---------- Word bank for fill-in-the-blank discovery ----------
   Blanks store a stable id; we display the localized word, so a
   learner can't read the answer off the chip and it works in both
   languages. Any id not listed here is shown as-is. */
export const WORDS = {
  right:          { en: "right",          af: "regte" },
  acute:          { en: "acute",          af: "skerp" },
  obtuse:         { en: "obtuse",         af: "stomp" },
  straight:       { en: "straight",       af: "gestrekte" },
  reflex:         { en: "reflex",         af: "inspringende" },
  equal:          { en: "equal",          af: "gelyke" },
  unequal:        { en: "unequal",        af: "ongelyke" },
  curved:         { en: "curved",         af: "geboë" },
  smaller:        { en: "smaller",        af: "kleiner" },
  larger:         { en: "larger",         af: "groter" },
  perpendicular:  { en: "perpendicular",  af: "loodreg" },
  parallel:       { en: "parallel",       af: "ewewydig" },
  tangent:        { en: "a tangent",      af: "'n raaklyn" },
  opposite:       { en: "opposite",       af: "teenoorgestelde" },
  adjacent:       { en: "adjacent",       af: "aangrensende" },
  alternate:      { en: "alternate",      af: "oorstaande" },
  bisects:        { en: "bisects",        af: "halveer" },
  halves:         { en: "halves",         af: "halveer" },
  double:         { en: "double",         af: "dubbel" },
  twice:          { en: "twice",          af: "twee keer" },
  half:           { en: "half",           af: "die helfte van" },
  triple:         { en: "triple",         af: "driedubbel" },
  same:           { en: "the same as",    af: "dieselfde as" },
  bigger:         { en: "bigger than",    af: "groter as" },
  supplementary:  { en: "supplementary",  af: "supplementêr" },
  complementary:  { en: "complementary",  af: "komplementêr" },
  midpoint:       { en: "midpoint",       af: "middelpunt" },
  centre:         { en: "centre",         af: "middelpunt" },
  constant:       { en: "constant",       af: "konstant" },
  changes:        { en: "changes",        af: "verander" },
};
export function word(id) {
  const o = WORDS[id];
  if (!o) return id;
  return o[lang] ?? o.en;
}

/* Map a legacy English reason phrase (from imported tan-chord data)
   to the current language. Falls back to the original phrase. */
const LEGACY = {};
for (const k in REASONS) LEGACY[REASONS[k].en] = REASONS[k];
// a few compound / variant phrases used in the imported data:
LEGACY["∠ sum of △"] = REASONS.triSum;
LEGACY["∠s on a str line"] = REASONS.straightLine;
// imported (data-tanchord) phrases must still resolve after the reasons above were renamed:
LEGACY["base ∠s of isos Δ"] = REASONS.isosBase;          // → "∠s opp equal sides"
LEGACY["tans from common pt"] = REASONS.tansCommonPt;     // → "tans from same pt"
LEGACY["tans from common pt; base ∠s of isos △"] = {
  en: "tans from same pt; ∠s opp equal sides",
  af: "raaklyne vanuit dieselfde punt; ∠e teenoor gelyke sye",
};
LEGACY["base ∠s of isos △ (TA = TB)"] = {
  en: "∠s opp equal sides (TA = TB)",
  af: "∠e teenoor gelyke sye (TA = TB)",
};
LEGACY["tan-chord theorem (chord TS at T)"] = {
  en: "tan-chord theorem (chord TS at T)",
  af: "raaklyn-koord-stelling (koord TS by T)",
};
LEGACY["alt ∠s, AB ∥ SU"] = { en: "alt ∠s, AB ∥ SU", af: "verw. ∠e, AB ∥ SU" };

export function reasonAuto(phrase) {
  if (!phrase) return "";
  const norm = phrase.replace(/△/g, "Δ");
  const hit = LEGACY[phrase] || LEGACY[norm];
  if (hit) return hit[lang] ?? hit.en;
  return phrase; // not yet translated — show as-is (English)
}
