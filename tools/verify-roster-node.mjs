/* verify-roster.html's checks, runnable from the terminal.
   ------------------------------------------------------------------
   The Gr11/Gr12 roster split (phase21) is mostly data logic — who is in
   which list — and the LocalBackend in js/api.js is a faithful mirror of
   the SQL, so the whole split can be proved without a browser. That
   matters here: the Browser pane never fires rAF and its screenshots
   time out, so opening a page is the slow way to learn the same thing.
   verify-roster.html stays the on-screen proof (it also covers the
   ?class=gr12 link and the admin toggle, which need a DOM); this is the
   assertion.

   It runs entirely against a localStorage SHIM in memory — it never
   touches a browser profile, never sets cgg.forceLocal, and never talks
   to Supabase.

   Run: node tools/verify-roster-node.mjs      (exit 1 on any failure) */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

/* ---------- a localStorage that lives in memory ---------- */
const store = new Map();
globalThis.localStorage = {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: k => store.delete(k),
  clear: () => store.clear(),
};

const { LocalBackend, PreviewBackend } = await import("../js/api.js");

/* ---------- tiny check harness ---------- */
const fails = [];
let count = 0;
function check(label, pass, detail = "") {
  count++;
  if (!pass) fails.push(`${label}${detail ? " — " + detail : ""}`);
  console.log(`${pass ? "  ✓" : "  ✗"} ${label}${detail ? " — " + detail : ""}`);
}
const G = title => console.log(`\n${title}`);
const names = list => list.map(s => s.display_name || s.name).sort();
const has = (list, n) => names(list).includes(n);

/* same Monday-based week start js/api.js uses */
const startOfWeek = (ts = Date.now()) => {
  const d = new Date(ts);
  const day = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
};
const readLS = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } };
const writeLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

const PW = "admin";                 // LocalBackend seeds this admin password
const L11 = "Demo Learner", L12 = "Demo Matric";

/* ============ (a) the picker is one class only ============ */
G("(a) The name picker shows one class only");
const g11 = await LocalBackend.listStudents("gr11");
const g12 = await LocalBackend.listStudents("gr12");
check("both demo classes have learners", g11.length > 0 && g12.length > 0, `gr11=${g11.length}, gr12=${g12.length}`);
check("the two pickers share no name", !names(g11).some(n => names(g12).includes(n)),
  `gr12 = ${names(g12).join(", ")}`);
check("the Gr12 demo learner exists (so ?local=1 can prove the split)", has(g12, L12));
check("the Gr11 picker never offers the Gr12 learner", !has(g11, L12));
const dflt = await LocalBackend.listStudents();
check("no cohort at all means gr11", JSON.stringify(names(dflt)) === JSON.stringify(names(g11)));
const loud = await LocalBackend.listStudents("  GR12 ");
check("case and spaces are tolerated ('  GR12 ' is gr12)", JSON.stringify(names(loud)) === JSON.stringify(names(g12)));
const junk = await LocalBackend.listStudents("grade-12-final");
check("an unrecognised class falls back to gr11, never to the other class",
  JSON.stringify(names(junk)) === JSON.stringify(names(g11)));

/* ============ (b) boards are filtered by the LEARNER, not the link ============ */
G("(b) Leaderboards are the learner's OWN class");
await LocalBackend.firstLogin(L11, "pw11");
await LocalBackend.firstLogin(L12, "pw12");

// XP this week and last week for one learner in each class, written straight
// into the event store so "last week" is really last week.
const lastWeekTs = startOfWeek() - 3 * 864e5;
const idOf = n => Object.values(readLS("cgg.students", {})).find(s => s.display_name === n).id;
const ev = readLS("cgg.events", []);
ev.push({ studentId: idOf(L11), roundId: "r1", xp: 40, score: 1, ts: Date.now() });
ev.push({ studentId: idOf(L11), roundId: "daily", xp: 25, score: 1, ts: lastWeekTs });
ev.push({ studentId: idOf(L12), roundId: "r1", xp: 60, score: 1, ts: Date.now() });
ev.push({ studentId: idOf(L12), roundId: "daily", xp: 30, score: 1, ts: lastWeekTs });
writeLS("cgg.events", ev);

const lb11 = await LocalBackend.leaderboard(L11, "pw11");
const lb12 = await LocalBackend.leaderboard(L12, "pw12");
check("a Gr11 learner's weekly board holds no Gr12 name", !has(lb11.weekly, L12));
check("a Gr11 learner's all-time board holds no Gr12 name", !has(lb11.allTime, L12));
check("a Gr12 learner's weekly board holds no Gr11 name", !has(lb12.weekly, L11),
  `gr12 board = ${names(lb12.weekly).join(", ")}`);
check("a Gr12 learner's all-time board holds no Gr11 name", !has(lb12.allTime, L11));
check("each learner still finds themselves on their own board",
  !!(lb11.myWeekly && lb11.myWeekly.me) && !!(lb12.myWeekly && lb12.myWeekly.me));
check("the board reports which class it is", lb11.cohort === "gr11" && lb12.cohort === "gr12");
check("ranks restart at 1 inside each class",
  lb11.weekly[0].rank === 1 && lb12.weekly[0].rank === 1);

/* ============ (c) the Monday popup ============ */
G("(c) The Monday results popup is per class");
const wr11 = await LocalBackend.weeklyResults(L11, "pw11");
const wr12 = await LocalBackend.weeklyResults(L12, "pw12");
check("last week's board excludes the other class (Gr11 view)", !has(wr11.board, L12),
  `board = ${names(wr11.board).join(", ") || "—"}`);
check("last week's board excludes the other class (Gr12 view)", !has(wr12.board, L11),
  `board = ${names(wr12.board).join(", ") || "—"}`);
check("Star of the Week is picked inside the class",
  (!wr11.star || wr11.star.name !== L12) && (!wr12.star || wr12.star.name !== L11),
  `gr11 star = ${wr11.star ? wr11.star.name : "—"}, gr12 star = ${wr12.star ? wr12.star.name : "—"}`);

/* ============ (d) the champion is per class ============ */
G("(d) The Circle Champion is per class");
const champOk = await LocalBackend.adminSetChampion(PW, L12, "gr12");
check("a Gr12 learner can be crowned Gr12 champion", champOk.ok === true);
const champBad = await LocalBackend.adminSetChampion(PW, L12, "gr11");
check("the same learner is REFUSED as Gr11 champion", champBad.ok === false && champBad.error === "wrong_cohort");
const wr11b = await LocalBackend.weeklyResults(L11, "pw11");
const wr12b = await LocalBackend.weeklyResults(L12, "pw12");
check("the Gr12 champion shows on the Gr12 popup", wr12b.champion === L12);
check("and does not show on the Gr11 popup", wr11b.champion !== L12, `gr11 champion = ${wr11b.champion || "none"}`);

/* ============ (e) the weekly reset is per class ============ */
G("(e) Resetting one class's weekly board leaves the other alone");
const before = await LocalBackend.adminData(PW);
const weeklyOf = (d, n) => d.rows.find(r => r.name === n).weeklyXp;
const gr11Before = weeklyOf(before, L11), gr12Before = weeklyOf(before, L12);
await LocalBackend.adminResetWeekly(PW, "gr12");
const after = await LocalBackend.adminData(PW);
check("the reset class's weekly XP is zeroed", weeklyOf(after, L12) === 0, `was ${gr12Before}`);
check("the other class's weekly XP is untouched", weeklyOf(after, L11) === gr11Before,
  `${gr11Before} before, ${weeklyOf(after, L11)} after`);

/* ============ (f) the admin fetch carries the class ============ */
G("(f) The dashboard can tell the two classes apart");
check("every admin row carries a cohort", after.rows.every(r => r.cohort === "gr11" || r.cohort === "gr12"));
check("rank is counted inside the class (both classes have a #1)",
  after.rows.some(r => r.cohort === "gr11" && r.rank === 1) && after.rows.some(r => r.cohort === "gr12" && r.rank === 1));
const awr11 = await LocalBackend.adminWeeklyResults(PW, "gr11");
const awr12 = await LocalBackend.adminWeeklyResults(PW, "gr12");
check("the weekly-winners screenshot is one class (Gr11)", !has(awr11.board, L12) && awr11.cohort === "gr11");
check("the weekly-winners screenshot is one class (Gr12)", !has(awr12.board, L11) && awr12.cohort === "gr12");
const integ = await LocalBackend.adminIntegrity(PW);
check("'Worth a look' rows carry a cohort", (integ.students || []).every(s => s.cohort === "gr11" || s.cohort === "gr12"));
const tl = await LocalBackend.adminTimeline(PW, null, 400);
check("timeline rows carry a cohort", (tl.rows || []).length > 0 && tl.rows.every(r => r.cohort === "gr11" || r.cohort === "gr12"));

/* ============ (g) adding and moving learners ============ */
G("(g) Adding into a class, and moving between classes");
await LocalBackend.adminAddStudent(PW, "Test Matric", "gr12");
check("a new learner lands in the class she chose",
  has(await LocalBackend.listStudents("gr12"), "Test Matric") &&
  !has(await LocalBackend.listStudents("gr11"), "Test Matric"));

const moveId = idOf(L12);
const moved = await LocalBackend.adminSetCohort(PW, moveId, "gr11");
check("the move reports where it came from and where it went",
  moved.ok && moved.moved === true && moved.from === "gr12" && moved.cohort === "gr11");
check("the learner now appears on the other class's picker",
  has(await LocalBackend.listStudents("gr11"), L12) && !has(await LocalBackend.listStudents("gr12"), L12));
const afterMove = await LocalBackend.adminData(PW);
const movedRow = afterMove.rows.find(r => r.name === L12);
check("their XP travelled with them", movedRow.allTimeXp === 90, `all-time XP = ${movedRow.allTimeXp}`);
const wr12c = await LocalBackend.weeklyResults(L12, "pw12");
check("a champion who leaves the class stops leading its popup", wr12c.champion !== L12 || wr12c.cohort === "gr11",
  `now reads as ${wr12c.cohort}, champion = ${wr12c.champion || "none"}`);
const backAgain = await LocalBackend.adminSetCohort(PW, moveId, "gr12");
check("moving them back works, and a second move to the same class is a no-op",
  backAgain.moved === true && (await LocalBackend.adminSetCohort(PW, moveId, "gr12")).moved === false);

/* ============ (h) the preview sandbox ============ */
G("(h) The teacher's preview sandbox is unaffected");
const pv = await PreviewBackend.listStudents("gr12");
check("preview still offers exactly one made-up account, whatever the link says",
  pv.length === 1 && pv[0].display_name === "Teacher Preview");
const pvMove = await PreviewBackend.adminSetCohort(PW, "preview", "gr11");
check("preview cannot move a real learner (write is a no-op)", pvMove.ok === true && pvMove.moved === false);

/* ============ (i) the Supabase backend passes the class through ============ */
G("(i) js/supabase.js sends the class to every RPC that needs it");
const sb = readFileSync(join(ROOT, "js", "supabase.js"), "utf8");
[
  ["cgg_list_students", "p_cohort"],
  ["cgg_admin_weekly_results", "p_cohort"],
  ["cgg_admin_set_champion", "p_cohort"],
  ["cgg_admin_reset_weekly", "p_cohort"],
  ["cgg_admin_add_student", "p_cohort"],
].forEach(([fn, arg]) => {
  const line = sb.split("\n").find(l => l.includes(`"${fn}"`));
  check(`${fn} is called with ${arg}`, !!line && line.includes(arg), line ? line.trim() : "call not found");
});
check("cgg_admin_set_cohort is wired up", sb.includes("cgg_admin_set_cohort"));

/* ============ (j) the migration file's own house rules ============ */
G("(j) supabase/phase21.sql keeps the house rules");
const sql = readFileSync(join(ROOT, "supabase", "phase21.sql"), "utf8");
const created = [...sql.matchAll(/create or replace function public\.([a-z0-9_]+)\s*\(/gi)].map(m => m[1]);
check("the migration creates the functions the plan lists", created.length >= 12, `${created.length} functions`);
// every function body must pin search_path, and every public RPC must be SECURITY DEFINER
const blocks = sql.split(/create or replace function public\./i).slice(1);
const noPath = [], noDefiner = [];
blocks.forEach(b => {
  const name = (b.match(/^([a-z0-9_]+)/i) || [])[1];
  const head = b.slice(0, b.indexOf("$$") === -1 ? 400 : b.indexOf("$$"));
  if (!/set search_path\s*=\s*public/i.test(head)) noPath.push(name);
  if (!name.startsWith("_") && !/security definer/i.test(head)) noDefiner.push(name);
});
check("every function pins search_path", noPath.length === 0, noPath.join(", "));
check("every learner/admin RPC is SECURITY DEFINER", noDefiner.length === 0, noDefiner.join(", "));
const ungranted = created.filter(n => !n.startsWith("_") &&
  !new RegExp(`grant execute on function[\\s\\S]{0,400}public\\.${n}\\s*\\(`, "i").test(sql));
check("every created RPC has its grant re-declared", ungranted.length === 0, ungranted.join(", "));
// the signatures that MUST be dropped first or PostgREST hits "function is not unique"
["cgg_list_students()", "cgg_admin_weekly_results(text)", "cgg_admin_set_champion(text, text)",
 "cgg_admin_reset_weekly(text)", "cgg_admin_add_student(text, text)"].forEach(sig => {
  check(`the old ${sig} is dropped before the new shape is created`,
    sql.includes(`drop function if exists public.${sig}`));
});
check("the read-then-write in cgg_admin_set_cohort holds its row (for update)",
  /select \* into s from public\.students where id = p_student_id for update/i.test(sql));
check("the learner move is left OUT of the file (public repo: no names)",
  /update public\.students set cohort = 'gr12'/.test(sql) === false ||
  sql.split("\n").filter(l => /update public\.students set cohort = 'gr12'/.test(l)).every(l => l.trim().startsWith("--")));

/* ---------------- summary ---------------- */
console.log("");
if (fails.length) {
  console.error(`✗ ${fails.length} of ${count} checks FAILED:`);
  fails.forEach(f => console.error("  " + f));
  process.exit(1);
}
console.log(`✓ ALL ${count} CHECKS PASS — Gr11 and Gr12 share no picker, no leaderboard, no Monday popup, no champion and no weekly reset.`);
