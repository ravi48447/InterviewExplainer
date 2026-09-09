# Q6 — "What is the difference between an array and a slice in Go?"

## Quick Revision

- An array is a fixed-length value whose length lives in its type: `[3]int`.
  A slice is a runtime header — pointer, length, capacity — over a backing
  array: `[]int`.
- Copying an array copies the elements; copying a slice copies the header,
  so both slices then see the same elements.
- Arrays compare with `==` (same type only); slices cannot be compared
  with `==` except against nil.
- Array zero value is a block of zeroed elements; slice zero value is nil.
- When length is a fact of the data, array; when it varies, slice.

## Interview Answer

The difference begins in the type system. An array type includes its
length — `[3]int` — so the value is a fixed block and the compiler knows
its shape everywhere. A slice type is `[]int` and carries no length at
all; at runtime it is a small three-field header pointing into a backing
array, with its own length and capacity. Everything practical follows from
this split.

Copying is the clearest consequence. Assigning an array copies every
element — `y := x` produces two independent values. Assigning a slice
copies only the header — `t := s` leaves two headers pointing at the same
elements, so writes through either are visible in both. This is why the
two types produce different printed results from near-identical code:

```go
x := [3]int{10, 20, 30}
y := x
y[0] = 7
fmt.Println(x, y) // [10 20 30] [7 20 30] — independent

s := []int{10, 20, 30}
t := s
t[0] = 7
fmt.Println(s, t) // [7 20 30] [7 20 30] — shared storage
```

Comparison rules differ for the same reason. Two arrays of one type
compare element-wise (`[3]int{1,2,3} == [3]int{1,2,3}` is true, and the
compiler checks every element). A slice cannot be the operand of `==`
(except `s == nil`) because a meaningful equality would have to define
what it means for two windows over shared, growable storage — so Go
declines. Zero values match the pictures too: an uninitialized array is
a full block of zeroed elements, an uninitialized slice is nil.

In practice: use the array when the bound is meaning (a `[32]byte`
digest) or isolation is wanted; use the slice — the default — whenever
length varies or the data must travel between functions cheaply, since
passing a slice copies only the header.

## Deep Dive

Hold one picture and this whole topic stops being trivia: an array is the
storage; a slice is a window onto storage.

### The picture

```
array  x [3]int        slice  s []int
┌────┬────┬────┐      ┌──────────────┐
│ 10 │ 20 │ 30 │      │ ptr ────────────▶ ┌────┬────┬────┐
└────┴────┴────┘      │ len: 3       │      │ 10 │ 20 │ 30 │
   (the value          │ cap: 3       │      └────┴────┴────┘
    itself)            └──────────────┘    (backing array)
```

`y := x` copies the row → two rows. `t := s` copies the window record →
two windows, one row.

### Why `==` is legal for one and illegal for the other

Comparing two `[3]int` values is a closed question — the compiler emits
exactly three element comparisons. Comparing two slices is not closed:
their lengths can differ, their storage can overlap, and after any
`append` the answer could change. Instead of picking a semantics, Go
makes slice equality a compile error except for `s == nil` and sends you
to `reflect.DeepEqual` or `slices.Equal` when you genuinely need it — with
the awareness that those answer "same elements now," a different question
from "same window."

### The growth asymmetry

An array can never grow — its length is fixed in its type, which is
precisely why `[32]byte` is a safe digest type. A slice grows because
`append` may allocate new storage and rewrite the header's pointer and
capacity. That mechanism — when it copies versus writes in place — is the
subject of its own question in this sequence, and it is the direct result
of the window/storage split drawn here.


# Q7 — "Why does modifying a slice sometimes change another slice?"

## Quick Revision

- `t := s` or `t := s[:2]` copies only the header — both slices point at
  the same backing array, so writes through either are visible in both.
- `append` writes into the shared backing array whenever capacity is
  available; it does not necessarily allocate.
- Executed example: `s := []int{1,2,3}; t := s[:2]; t = append(t, 42)`
  leaves both printing `[1 2 42]` — the 42 landed in `s`'s third slot.
- The aliasing ends only when an append grows beyond capacity and the
  slice forks to new storage.
- If two slices must be independent, copy the elements — `copy()` or
  `append([]T(nil), s...)`.

## Interview Answer

It happens because slice assignment copies a three-field header, not the
elements. After `t := s`, there are two headers and one backing array;
both slices are views over the same memory, so a write through either
view is a write to the shared block.

The surprising case is `append`, because it does not always allocate:

```go
s := []int{1, 2, 3}     // len 3, cap 3
t := s[:2]              // len 2, cap 3 — capacity available
t = append(t, 42)
fmt.Println(s, t)       // [1 2 42] [1 2 42]
```

At the moment of the append, `t` has length 2 but capacity 3 — one spare
slot inside the existing backing array. `append` sees capacity, so it
writes 42 directly into that slot. The slot it wrote into is `s`'s third
element, so `s` now prints `[1 2 42]` even though nobody touched `s`
directly. This is the mechanism behind the most common Go data-corruption
report: "I appended to my sub-slice and my original slice changed."

The sharing continues until a growth forces a fork: once a slice is at
capacity and appends again, `append` allocates new storage, copies, and
returns a header pointing elsewhere — the two slices finally diverge. The
safe patterns when independence is required are `copy(dst, src)` or
`append([]int(nil), s...)`, both of which produce genuinely separate
backing storage. The rule to carry away: assignment and re-slicing share
storage below capacity, and only growth severs it.

## Deep Dive

The header picture makes aliasing predictable instead of spooky — and
predictability is the point, because the follow-up questions (when does
append copy? how to copy safely?) are all this one mechanism.

### Two windows, one row

Start from the state the snippet creates:

```
s: ptr ──▶ [ 1  2  3 ]  ◀── ptr: t
    len 3, cap 3             len 2, cap 3
```

`t := s[:2]` reads as "make another window on the same storage, showing
two elements, with capacity to see three." No element was copied at any
point — only an 18-byte-or-so header.

### Watching the write land

Trace the append precisely: `t` has length 2, capacity 3, so slot index 2
of the backing array is beyond `t`'s length but within its capacity —
allocated, uninitialized, and reachable. `append(t, 42)` increments the
length to 3 and stores 42 at index 2. Because the row is shared, `s` —
whose length was already 3 — now observes 42 at its third element. The
printed pair `[1 2 42] [1 2 42]` is the executed proof.

### When sharing is a feature

Aliasing is not a defect to avoid — it is how sub-slicing is efficient.
Every `s[i:j]` in hot code paths shares storage precisely so that no
copy happens. The discipline is knowing which operations preserve sharing
(`s[i:j]`, in-capacity `append`, `copy` between overlapping windows) and
which sever it (out-of-capacity `append`, explicit `copy` to fresh
storage). When you hand data to code that may modify it and the original
must stay pristine, that is the moment to reach for a real copy.


# Q8 — "When you append to a slice, when does it copy the backing array?"

## Quick Revision

- `append` copies only when length has reached capacity. While
  `len < cap`, it writes into the existing backing array in place.
- With spare capacity, `append` never allocates — the write is visible to
  every slice sharing that storage.
- At capacity (`len == cap`), `append` allocates a larger backing array,
  copies the elements, and returns a header to the new storage — the
  caller's other slices keep the old array and no longer see changes.
- Verified fork: `s := []int{1,2,3}` (len 3, cap 3); `append(s, 77)`
  yields cap 6, and a later `s[0] = 5` is invisible in the appended
  slice.
- Growth factor: for small slices the new capacity is roughly double.

## Interview Answer

The single condition is capacity. `append` checks whether the slice's
length is below its capacity; if it is, there is already a spare slot in
the backing array, so append writes there and increments the length —
no allocation, no copy, and any other slice sharing that storage sees the
write.

When length equals capacity, there is no spare slot, so append must
grow: it allocates a new, larger backing array, copies the existing
elements over, appends the new element, and returns a slice header
pointing at the new storage. The original array is left behind. Executed:

```go
s := []int{1, 2, 3}    // len 3, cap 3 — full
u := append(s, 77)     // must grow: new array, cap 6
s[0] = 5               // writes to the OLD storage
fmt.Println(s, u)      // [5 2 3] [1 2 3 77] — forked
```

`s` and `u` printed different values because after the growth they are
two windows over two different arrays. Contrast the in-place case, where
the append fit inside existing capacity and every view saw it.

Two consequences matter in real code. First, `append` "may allocate" is
the honest description — you cannot rely on either branch, so never
ignore its return value (a common bug is `append(s, x)` without
capturing the result). Second, pre-sizing with `make([]T, 0, n)` when the
final size is known means every append writes in place — one allocation
up front instead of the allocate-copy-copy-copy chain of growth.

## Deep Dive

Capacity is the quiet third field of the slice header, and `append`'s
behavior is a pure function of the comparison `len == cap`. Walk both
branches with the actual numbers and the mechanism locks in.

### Branch one: capacity available

```go
s := make([]int, 2, 3)   // two used, one spare
t := append(s, 99)       // fits: writes index 2 of the same array
s[0] = 5                 // visible in t — still shared
// s: [5 2]   t: [5 2 99]
```

One backing array the whole time. The append changed `t`'s length from 2
to 3 and wrote into slot 2; `s` still has length 2, so it shows `[5 2]`,
but the storage is shared — which is exactly why the `s[0] = 5` write
appears in both. Efficient, and a booby trap for anyone who believed
append returns independent data.

### Branch two: at capacity, the fork

```go
s := []int{1, 2, 3}      // len 3, cap 3 — no spare slot
u := append(s, 77)       // allocate (cap → 6), copy 3, add 77
s[0] = 5                 // lands in the OLD array
// s: [5 2 3]   u: [1 2 3 77]
```

The growth is why `u` stopped tracking `s`: after the fork there are two
arrays. The doubling (3 → 6) is the growth strategy for small slices —
amortized constant time over many appends, at the cost of transiently
over-allocating.

### The practical reading

Whenever correctness (not just performance) depends on whether two slices
share storage, you are in fork territory: either cap the sharing
deliberately (sub-slice, then never append) or break it deliberately
(`copy`). And when a function receives a slice, appends, and returns the
result, the caller's slice may or may not reflect the new elements —
which is why the idiomatic signature is `return append(s, ...)` and the
idiomatic call is always `s = append(s, x)`.


# Q9 — "Should you pass a large array or a slice to a function in Go?"

## Quick Revision

- Passing an array copies all of its elements on every call; passing a
  slice copies only the three-word header.
- If the function should see or modify the caller's data, pass a slice —
  `modifySlc(s)` leaves `s[0]` changed (executed: `[99 20 30]`).
- If the caller's data must be protected, an array copy is the
  protection itself — `modifyArr(x)` leaves x `[10 20 30]`.
- `range` over an array copies each element too; range over a slice
  copies the element values but iterates the shared storage.
- Default: pass slices. Arrays only when copy-isolation is the intent or
  the size is small and meaningful.

## Interview Answer

Mechanically, the question is about what gets copied at the call boundary.
An array parameter receives a complete copy of the elements — a
`[3]int` copies three integers, a `[1<<20]byte` copies a megabyte, every
call. A slice parameter receives a copy of the header only — three words —
no matter how many elements it views. For large data the slice is
therefore the only reasonable default.

The behavior difference is just as important as the cost, and one executed
pair shows both:

```go
func modifyArr(a [3]int) { a[0] = 99 }
func modifySlc(s []int)  { s[0] = 99 }

x := [3]int{10, 20, 30}
modifyArr(x)
fmt.Println(x) // [10 20 30] — the copy inside the function took the 99

s := []int{10, 20, 30}
modifySlc(s)
fmt.Println(s) // [99 20 30] — shared storage, the caller sees it
```

So the decision has two legitimate answers, depending on intent. When the
function should read and possibly modify the caller's data — the common
case — pass a slice. When the caller's data must remain untouched and the
size is modest, an array (or an explicit defensive copy) is the honest
choice: the copy is not overhead, it is the guarantee. The anti-pattern is
passing large arrays around by value by accident — the cost repeats on
every call and signals that the data wanted to be a slice.

## Deep Dive

The call boundary is where Go's "everything is passed by value" rule
meets the array/slice split, and the result is one rule with two very
different costs.

### What the copy actually is

For an array, the copy is a full element-wise transfer — the same
operation as `y := x`, triggered at every call. For a slice, the copy is
the header: one pointer, one length, one capacity. This is why slice
passing is O(1) regardless of element count while array passing is O(n)
per call — a loop passing a `[1000000]int` by value copies a megabyte per
iteration.

### The mutation asymmetry, precisely

`modifySlc(s)` works because the function's header copy points at the
caller's storage — `s[0] = 99` lands in shared memory. `modifyArr(x)`
silently "fails" to mutate because the function's array copy is private.
Neither is wrong; they are two contracts. The bug pattern is expecting
one contract and writing the other — say, a `normalize(a [N]float64)`
that mutates its copy while the caller assumes normalization happened.
The fixes, in order of preference: return the new value, take a slice,
or take a pointer (`a *[N]float64`) when in-place mutation is genuinely
intended.

### Why the idiomatic answer is "slice"

Standard-library Go settles the default: nearly every data-carrying API
takes slices, because O(1) passing plus clear shared-view semantics
compose well. The deliberate exceptions prove the rule — fixed-size
values like `[32]byte` digests flow by value precisely because their size
is small and their isolation is the point. When you choose, name which
property you are buying: cheap shared access (slice) or copy-protected
handoff (array).


# Q10 — "How do you copy a slice safely in Go?"

## Quick Revision

- `t := s` is NOT a copy — it shares backing storage; writes through
  either are visible in both.
- Real copy option one: `dst := make([]T, len(s)); copy(dst, s)` —
  exact-size transfer, capacity known.
- Real copy option two: `dst := append([]T(nil), s...)` — one-line idiom,
  capacity chosen by append.
- With `make(len)`, index-assign: `dst[i] = s[i]` — same as option one,
  spelled out.
- Executed proof: after either copy, `u[0] = 50` leaves `s` as
  `[1 2 3]` — genuinely independent.
- Gotcha: copying a slice of pointers copies the pointers — the pointees
  remain shared.

## Interview Answer

A safe copy means new backing storage, and Go gives you three ways to get
it. The built-in is `copy(dst, src)`, which transfers elements into
existing storage:

```go
s := []int{1, 2, 3}
u := make([]int, len(s))
copy(u, s)        // elements moved into u's own array
u[0] = 50
fmt.Println(s, u) // [1 2 3] [50 2 3] — independent
```

The second is the append idiom, which allocates and copies in one
expression:

```go
v := append([]int(nil), s...)
v[0] = 60
fmt.Println(s, v) // [1 2 3] [60 2 3] — also independent
```

`append(nil, s...)` starts from a nil slice (no storage) and appends the
elements of `s`, forcing allocation. Both executed forms leave `s`
untouched — that is the test of a real copy.

Choose between them by what you know: `make`+`copy` when the destination
size is known and you want exact capacity; the append idiom when you want
one short line and accept append's capacity choice. The third spelling —
`make` then element-by-element assignment — is the same as the first,
useful when the copy needs a transformation anyway.

The boundary case that bites: a slice of pointers (or slices containing
reference types) copies the pointers, not the objects — the copy shares
the pointees. For element types that are themselves references, "safe
copy" of the data requires copying the pointed-to values too, which is a
deep copy and outside `copy`'s job.

## Deep Dive

Safe copying is the deliberate severing of the sharing that Q7 walked
through — so the deep version of this question is: what exactly does
each option allocate, and what stays shared afterward?

### What copy() does and does not do

`copy(dst, src)` is a memory transfer: it copies `min(len(dst), len(src))`
elements from one backing array into another. It never allocates — which
is why the idiom pairs it with `make`. Its return value (the number of
elements copied) matters when the lengths differ: `copy` stops at the
shorter side, so copying into an undersized destination silently copies
less than the whole source.

```
before:  s ──▶ [1 2 3]        u (make) ──▶ [0 0 0]
copy:                     transfer ──▶
after:   s ──▶ [1 2 3]        u ──▶ [1 2 3]   (two arrays)
u[0]=50: s ──▶ [1 2 3]        u ──▶ [50 2 3]
```

### Why the append idiom is safe, precisely

`append([]int(nil), s...)` begins with a nil slice — len 0, cap 0, no
backing array. Spreading `s...` presents len(s) elements that cannot fit
(no capacity), so append takes the allocate-copy branch from Q8 every
time: fresh storage, guaranteed. It is the same mechanism, used on
purpose.

### The pointer-slice boundary

Trace `ps := []*int{&a, &b}` and `pc := append([]*int(nil), ps...)`: the
copy holds new pointer values — different headers — but each points at
the same `a` and `b`. `*pc[0] = 99` changes `a` for every view of it.
The copy is safe at the slice level, shared at the data level; whether
that is acceptable depends on whether the elements are values (ints,
structs — fully safe) or references (pointers, maps, inner slices —
shared). That boundary, stated out loud, is the difference between a
candidate who has used `copy` and one who understands it.
