# IEB acceptable reasons — audit of `js/i18n.js` `REASONS`

**Source of truth:** *Appendix G: Euclidean Geometry: Acceptable Reasons*, IEB SAGs 2026
(`27. MATHEMATICS SAGs 2026`, pp. 29–32). The SAGs say the shortened forms below are the
encouraged ones, and markers work from this list.

**Scope note — English only.** Appendix G is published in English. IEB does not publish an
Afrikaans reasons list, so **for `af` the DBE "Aanvaarbare Redes (Euclidean Geometry)" list
remains the authority.** The `js/i18n.js` header comment is therefore right about Afrikaans
and wrong only about English; it should say so explicitly rather than being replaced.

Status key: ✅ already exact · ✏️ wording changed · ➕ added · ⚠️ needs a decision

---

## Circles

| Appendix G accepted reason(s) | App code | Was | Now | |
|---|---|---|---|---|
| `tan ⊥ radius` | `tanRadius` | `tan ⊥ radius` | — | ✅ |
| `tan ⊥ diameter` | `tanDiameter` | `tan ⊥ diameter` | — | ✅ |
| `line ⊥ radius` OR `converse tan ⊥ radius` OR `converse tan ⊥ diameter` | `tanRadiusConv` | `converse tan ⊥ radius` | — | ✅ |
| `line from centre to midpt of chord` | `centreMidChord` | exact | — | ✅ |
| `line from centre ⊥ to chord` | `centrePerpChord` | exact | — | ✅ |
| `perp bisector of chord` | `perpBisChord` | *absent* | `perp bisector of chord` | ➕ |
| `∠ at centre = 2 × ∠ at circumference` | `centreDouble` | exact | — | ✅ |
| `∠s in semi-circle` OR `diameter subtends right angle` OR `∠ in ½⊙` | `semiCircle` | `∠ in semi-circle` | `∠s in semi-circle` | ✏️ |
| `chord subtends 90º` OR `converse ∠s in semi-circle` | `semiCircleConv` | *absent* | `converse ∠s in semi-circle` | ➕ |
| `∠s in the same seg` | `sameSeg` | `∠s in same seg` | `∠s in the same seg` | ✏️ |
| `line subtends equal ∠s` OR `converse ∠s in the same seg` | `sameSegConv` | `converse ∠s in same seg` | `converse ∠s in the same seg` | ✏️ |
| `equal chords; equal ∠s` (at circumference **and** at centre — same reason both ways) | `equalChords` | `equal chords subtend equal ∠s` | `equal chords; equal ∠s` | ✏️ |
| `equal circles; equal chords; equal ∠s` | `equalCirclesChords` | *absent* | added | ➕ |
| `opp ∠s of cyclic quad` | `cyclicOpp` | exact | — | ✅ |
| `opp ∠s quad supp` OR `converse opp ∠s of cyclic quad` | `cyclicOppConv` | exact | — | ✅ |
| `ext ∠ of cyclic quad` | `cyclicExt` | exact | — | ✅ |
| `ext ∠ = int opp ∠` OR `converse ext ∠ of cyclic quad` | `cyclicExtConv` | exact | — | ✅ |
| `Tans from common pt` OR `Tans from same pt` | `tansCommonPt` | `tans from same pt` | — | ✅ (both accepted) |
| `tan chord theorem` | `tanChord` | `tan-chord theorem` | `tan chord theorem` | ✏️ |
| `converse tan chord theorem` OR `∠ between line and chord` | `tanChordConv` | `converse tan-chord` | `converse tan chord theorem` | ✏️ |

**On `equalChords`:** Appendix G lists the same accepted reason — `equal chords; equal ∠s` —
for the circumference form *and* the centre form. One code covers both, which is what the app
already does. Note the app's Afrikaans (`gelyke koorde; gelyke ∠e`) was already in the
semicolon form; the English was the only one out of step.

---

## Lines

| Appendix G accepted reason(s) | App code | Was | Now | |
|---|---|---|---|---|
| `∠s on a str line` | `straightLine` | exact | — | ✅ |
| `adj ∠s supp` | `adjSupp` | *absent* | `adj ∠s supp` | ➕ |
| `∠s round a pt` OR `∠s in a rev` | `roundPt` | `∠s around a point` | `∠s round a pt` | ✏️ |
| `vert opp ∠s =` | `vertOpp` | *absent* | `vert opp ∠s =` | ➕ |
| `alt ∠s; AB \|\| CD` | `altAngles` | `alt ∠s ; lines ∥` | — | ⚠️ see below |
| `corresp ∠s; AB \|\| CD` | `correspAngles` | `corresp ∠s ; lines ∥` | — | ⚠️ |
| `co-int ∠s; AB \|\| CD` | `coIntAngles` | `co-int ∠s ; lines ∥` | — | ⚠️ |
| `alt ∠s =` (converse — proves lines parallel) | — | *absent* | *not added* | ⚠️ |
| `corresp ∠s =` (converse) | — | *absent* | *not added* | ⚠️ |
| `coint ∠s supp` (converse) | — | *absent* | *not added* | ⚠️ |

### ⚠️ The parallel-lines reasons need a code change, not a string change

Appendix G writes these with **the actual line names**: `alt ∠s; AB || CD`. The app's
`reason(code)` returns one fixed string, so it can only produce a generic `lines ∥` form.
No rename fixes that — matching the SAGs exactly means `reason()` needs to accept an
argument:

```js
reason("altAngles", "AB || CD")   // → "alt ∠s; AB || CD"
```

That is a small change to `js/i18n.js` plus every call site that uses one of the three
parallel-line reasons. **Not done in this pass** — it touches question data across many
rounds and deserves its own commit. Until then the generic form stands; a marker would
accept it in context but it is not the published form.

Two smaller judgement calls, both left as-is:

- **`∥` vs `||`.** The app uses `∥` (U+2225); the SAGs PDF renders `||`. This is a
  typesetting artifact, not a mathematical difference, and both are universally accepted.
  Recommend keeping `∥`.
- **Spacing.** The app writes `alt ∠s ; lines ∥` with a space before the semicolon;
  Appendix G has no space. Will be fixed when the templating change above lands.

### ⚠️ The three converses are deliberately not added

`alt ∠s =`, `corresp ∠s =`, `coint ∠s supp` prove that two lines *are* parallel. Nothing in
the app currently asks a learner to prove lines parallel, so adding them now would put
unused chips in reason-pickers and make those questions harder for the wrong reason. Add
them the day a round needs them.

---

## Triangles

| Appendix G accepted reason(s) | App code | Was | Now | |
|---|---|---|---|---|
| `∠sum in Δ` OR `sum of ∠s in Δ` OR `Int ∠s Δ` | `triSum` | `int ∠s of Δ` | `Int ∠s Δ` | ✏️ |
| `ext ∠ of Δ` | `triExt` | exact | — | ✅ |
| `∠s opp equal sides` | `isosBase` | exact | — | ✅ |
| `sides opp equal ∠s` | `sidesOppAngles` | exact | — | ✅ |
| `Pythagoras` OR `Theorem of Pythagoras` | `pythagoras` | `Pythagoras` | — | ✅ |
| `SSS` | `sss` | *absent* | `SSS` | ➕ |
| `SAS` OR `S∠S` | `sas` | *absent* | `SAS` | ➕ |
| `AAS` OR `∠∠S` | `aas` | *absent* | `AAS` | ➕ |
| `RHS` OR `90°HS` | `rhs` | `RHS` | — | ✅ |

`Int ∠s Δ` was chosen over the other two accepted forms because the existing Afrikaans
(`binne-∠e van Δ` — "interior ∠s of Δ") already matches that sense, so the English change
does not force an unverified Afrikaans change.

---

## Suspect entries — resolved

| Code | Problem | Action |
|---|---|---|
| `diamMidChord` | `"line from centre to midpt of chord ⊥ chord"` is not an Appendix G reason — it welds two separate theorems together. Its `af` string was byte-identical to `centrePerpChord`'s, which is what gave it away. | Removed. `LEGACY` entry added so any imported data using the old phrase resolves to `centrePerpChord`. **Verify no round data references it before merging.** |
| `radiiEqual` | Near-duplicate of `radii` (`"radii equal"` vs `"radii"`). Appendix G-adjacent convention is `radii`. | Removed. `LEGACY["radii equal"] → radii`. |
| header comment | Claimed the whole table follows the DBE list. | Corrected to: English follows IEB Appendix G, Afrikaans follows the DBE list (IEB publishes English only). |

---

## Afrikaans — needs a second pass

Every `af` string was left alone except where the English change forced a pluralisation.
The following need checking against the DBE *Aanvaarbare Redes* list before the Afrikaans
build ships. They are marked `TODO(af)` in `js/i18n.js`:

- `sss` / `sas` / `aas` — the DBE Afrikaans abbreviations are likely `SSS` / `SHS` / `HHS`
  (sy-hoek-sy, hoek-hoek-sy). Currently set to the English forms so nothing is silently
  wrong. **Do not ship the `af` build until confirmed.**
- `semiCircle` — `"∠e in semi sirkel"`. `halfsirkel` (one word) is the standard term;
  `semi sirkel` looks like an anglicism that predates this audit. Vocabulary left
  untouched, only the `∠ → ∠e` pluralisation applied.
- `tanChordConv` — `"omgekeerde raaklyn-koord"` is missing the noun (`-stelling`).
- `vertOpp`, `adjSupp`, `perpBisChord`, `semiCircleConv`, `equalCirclesChords` — new
  entries, translations are best-effort.

---

## Not a wording problem

Megan is seeing gaps in **prior** geometry — alternate angles, angles opposite equal
sides — rather than in circle theorems. Worth separating the two issues:

- `isosBase` (`∠s opp equal sides`) and `sidesOppAngles` were **already exact**. Nothing
  in the app was teaching those wrong.
- But `vert opp ∠s =` and `adj ∠s supp` were **missing entirely**, so a learner could
  never pick them in a reason-picker even when they were the right answer. Both are now
  present. That is a small but real gap in the foundation layer the circle theorems sit on.

If the gap persists, the cheapest fix is a short foundations round in front of Investigation
Station — the reason-picker questions in `js/questions.js` (`type: "reason"`) already do
exactly this job and would need content, not code.
