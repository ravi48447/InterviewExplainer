# Editorial Briefs — Go Arrays calibration batch (10 questions)

Frozen identities, per-question briefs, and identity decisions per the
one-question editorial cycle. Every example below was executed under
go1.22.5 linux/arm64; outputs recorded verbatim.

## Identity decisions (Step 1 + catalog calls)

The `arrays-vs-slices` file (go-slices-maps module) contains 5 questions
generated from a template treating "Arrays Vs Slices" as a noun — broken
English, 360-char shared passages, no distinct identity. Per the plan
(§1: duplicates attach to canonical anchors, not deleted):

- `go-syntax-basics/arrays-basics` keeps q001–q005 as the **canonical anchor
  family** for arrays (identity intact, content rewritten).
- `arrays-vs-slices` q001–q005 are **re-identified** as the canonical
  slice-vs-array comparison family in the slices module (their natural home —
  the module is go-slices-maps). Their template identities are replaced with
  real questions that a Go interviewer actually asks about the comparison.
  Routes and IDs stay stable; only question text + answers change, because
  the current text is unusable generated shells ("What is Arrays Vs Slices,
  and when would you use it?" is not a question any human asks).

## Q1 — go-syntax-basics-arrays-basics-q001
**"What are arrays in Go, and how do they work?"**
- Brief: The question wants the value-semantic fixed-length collection:
  length is part of the type, assignment copies, zero values fill unset
  elements. A beginner must leave able to predict `y := x` output.
- Central truth: `[3]int` and `[2]int` are different types; arrays are
  values, not references to a header.
- Misunderstanding prevented: "arrays are like slices but shorter" — no,
  the copy-on-assign behavior is the whole point.
- Version: Go 1.22. Verified: `x := [3]int{10,20,30}; y := x; y[0]=7` →
  `x` unchanged `[10 20 30]`.
- Visual: memory diagram of two independent 3-slot blocks after copy —
  removing it would make copy semantics harder. KEEP.

## Q2 — ...-q002 "When should you use arrays in Go?"
- Brief: The honest answer is "rarely, deliberately" — fixed sizes with
  meaning (SHA-256 [32]byte, RGB [3]uint8, [N]M for matrices), in tests,
  and as slice backing storage. Not "when you don't need dynamic size" (that
  phrasing suggests arrays are the default).
- Central truth: choose an array when the *bound itself carries meaning* or
  you need value copy semantics; otherwise slices.
- Misunderstanding prevented: arrays as a beginner default.
- Verified: `[32]byte` sha256 idiom; `[...]int{1,2,3}` literal-length form.
- Visual: none needed — a two-column when/when-not table teaches it. TABLE.

## Q3 — ...-q003 "What common mistakes should you avoid with arrays in Go?"
- Brief: Four real traps, each with the panic/output it causes: (1) assuming
  append works (compile error), (2) `i <= len(a)` off-by-one → index out of
  range, (3) expecting mutation through a function parameter (copy!),
  (4) `[...]` vs `[]` literal confusion in := (array vs slice).
- Central truth: every trap traces back to value semantics + fixed length.
- Verified each trap compiles/fails as claimed (compile error for append;
  runtime panic for off-by-one).
- Visual: symptom → cause → fix table. TABLE.

## Q4 — ...-q004 "How do arrays compare with a slice in Go?"
- Brief: The anchor comparison. Same axis: type signature, copy vs share,
  length mutability, nil vs zero-value, typical passing to functions.
- Central truth: array = value with size in type; slice = small struct
  header (ptr, len, cap) pointing at backing storage, shared until growth.
- Misunderstanding prevented: "slices are dynamic arrays" without the
  header mental model — that's what makes append aliasing (Q5) mysterious.
- Verified: the `t := s[:2]; append(t, 42)` experiment → s becomes
  `[1 2 42]` (backing array overwritten).
- Visual: side-by-side memory diagram (two blocks vs header→block). KEEP —
  this one diagram prevents the most common Go bug family.

## Q5 — ...-q005 "How would you debug a problem involving arrays in Go?"
- Brief: Real diagnostic paths with the exact evidence each produces:
  compile-time index errors, runtime `index out of range [4] with length 3`,
  "surprising non-mutation" from copy semantics (print at boundary),
  printf `%v`/`%#v` inspection, Delve `print x` at breakpoint.
- Central truth: the panic message already contains index and length —
  read it before guessing.
- Verified: deliberate off-by-one produces
  `panic: runtime error: index out of range [3] with length 3`.
- Visual: symptom→evidence→cause table. TABLE.

---

## go-slices-maps/arrays-vs-slices — re-identified family

## Q6 — arrays-vs-slices-q001 → "What is the difference between an array and a slice in Go?"
- Brief: The interview-real phrasing of the comparison (this is THE canonical
  Go question). Type-system answer first ([n]T vs []T + header), then the
  observable behaviors: copy vs share, == comparability, nil zero value.
- Verified: `[2]int{1,2} == [2]int{1,2}` → true; slices can't be compared
  with == (compile error) except to nil.
- Visual: the header diagram (ptr/len/cap) — KEEP, single best mental model.

## Q7 — ...-q002 → "Why does modifying a slice sometimes change another slice?"
- Brief: The aliasing question — the #1 real-world Go bug in this family.
  s and t share backing storage; writes through either are visible in both
  until append grows capacity and forks.
- Central truth: append may or may not fork — aliasing is safe only below
  cap; growth is the fork point.
- Verified: the exact three-step trace (s, s[:2], append) → `[1 2 42]`.
- Visual: before/after frames of the shared block. KEEP (state diagram).

## Q8 — ...-q003 → "When you append to a slice, when does it copy the backing array?"
- Brief: The cap-growth mechanism: below cap → write in place (aliases see
  it); at cap → allocate ~2x, copy, fork. len vs cap distinction fully.
- Central truth: append is conditional — "may allocate" is the honest verb.
- Verified: cap(s)==3, append 4th → new storage; aliases unchanged.
- Visual: capacity timeline (len 2→3→4 with cap 3→6). KEEP (timeline).

## Q9 — ...-q004 → "Should you pass a large array or a slice to a function in Go?"
- Brief: The cost/mechanics decision: arrays copy entirely on every call
  (and by value in range too); slices copy only the 3-word header. The
  general rule: pass slices, with the explicit exception — when you WANT
  copy semantics (not mutating caller's data), passing an array is honest.
- Verified: modify(a [3]int) leaves x unchanged (executed); modify(s []int)
  changes caller's storage.
- Visual: small cost table. TABLE.

## Q10 — ...-q005 → "How do you copy a slice safely in Go?"
- Brief: The fix for aliasing: three real options — copy(dst, src) exact
  transfer, append([]T(nil), src...) idiom, and make+copy when you pre-know
  size; with when-each guidance and the shared gotcha of copying a slice
  of pointers.
- Verified: copy(u, s) then mutate u → s unchanged.
- Visual: none needed beyond code. NONE.
