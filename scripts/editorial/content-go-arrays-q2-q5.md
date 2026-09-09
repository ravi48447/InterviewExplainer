# Q2 — "When should you use arrays in Go?"

## Quick Revision

- Use an array when the fixed length is part of the meaning: `[32]byte` for a
  SHA-256 digest, `[3]uint8` for an RGB color, `[N][N]float64` for a matrix.
- Use an array when you want copy-on-assign protection — handing data to a
  function without letting it mutate the caller's copy.
- Use `[...]T{...}` when the length is fixed but tedious to count; the
  compiler computes it and the result is still an array type.
- Default to slices for anything that grows, gets passed around, or has no
  meaningful fixed bound. Arrays are the deliberate exception in Go code.

## Interview Answer

Arrays earn their place in Go when the bound itself carries meaning. The
clearest example comes straight from the standard library: `crypto/sha256`
computes a digest with `Sum256`, and its return type is `[32]byte` — not a
slice. A SHA-256 digest is exactly thirty-two bytes by definition; a length
that could vary would be a different, wrong type. The same logic applies to
`[3]uint8` for an RGB pixel or `[4][4]float64` for a transformation matrix:
the number is part of what the value is, and the type system should enforce
it. Compile and run this and the type shows the intent:

```go
sum := sha256.Sum256([]byte("interview"))
fmt.Printf("%T\n", sum) // [32]uint8
```

The second reason is value semantics. Because assignment and function calls
copy arrays, passing one gives the callee a private copy — the caller's data
cannot change. When a small, fixed-size value deserves that protection (a
key, a coordinate pair), an array states the intent better than a defensive
slice copy.

There is also the literal-count form: `auto := [...]int{1, 2, 3, 4}` asks
the compiler to count, producing a `[4]int`. It is still an array — the
length is fixed at compile time — and `%T` confirms it: `[4]int`.

For everything else, slices are the default. A collection that grows, a
buffer passed between functions, a view over data — those all want shared
backing storage, which is what a slice provides. So the rule an interviewer
wants to hear: reach for an array when the size is a fact about the data,
and for a slice when the size is a variable about the problem.

## Deep Dive

The question "when should I use an array?" is really asking "what does an
array guarantee that a slice doesn't?" — and there are exactly two
guarantees worth having.

### Guarantee one: the type system enforces the bound

When `sha256.Sum256` declares that it returns `[32]byte`, every caller gets
a value whose length the compiler checked. You cannot accidentally pass a
`[31]byte` digest around, cannot loop past it with a wrong constant without
the compiler noticing the shape mismatch, and cannot store it where a
different-length array is expected. The length has been promoted from a
runtime fact (slice: `len(x)` varies) to a compile-time fact (array: part
of the type).

Executed proof of the distinction, from the Go compiler itself:

```go
arr := [...]int{1, 2, 3} // [...] counts for you: the type is [3]int
slc := []int{1, 2, 3}    // [] is a slice: length lives in the header
fmt.Printf("%T %T\n", arr, slc) // [3]int []int
```

One extra keystroke — `...` versus nothing — is the difference between a
value type carrying its length and a reference-header pointing at storage.
Misreading this literal is one of the most common beginner bugs, which is
why it appears among the traps in the next question.

### Guarantee two: copies are isolation

Because `y := x` copies the elements, an array is a cheap way to make a
function promise not to mutate. For small, fixed data — a key schedule, a
hash, a fixed set of coordinates — the copy cost is trivial and the
protection is exactly what you want. The moment data is large or you want
the function to modify the caller's view, that same copying becomes the
reason to switch to slices.

### The honest frequency answer

In real Go codebases, arrays appear mostly in these shapes: fixed-size
protocol fields, crypto and hashing, matrices and numeric kernels, and as
the hidden backing storage that slices are built on. If you cannot name
which of those reasons applies, a slice is almost certainly the right
choice — and being able to say that out loud, with the `[32]byte` example,
is what turns this from a trivia answer into an engineering answer.


# Q3 — "What common mistakes should you avoid with arrays in Go?"

## Quick Revision

- `append` does not work on arrays — it requires a slice. `a = append(a, 4)`
  on an array is a compile error, not a runtime growth.
- `i <= len(values)` loops past the end: the last valid index is
  `len(values) - 1`. The panic is `index out of range [3] with length 3`.
- Passing an array to a function copies it, so `a[0] = 99` inside the
  function never reaches the caller — the mistake is expecting mutation.
- `[]int{...}` is a slice; `[...]int{...}` (or `[3]int{...}`) is an array.
  One character changes copying, append, and comparability.
- All four traps share one root: arrays are fixed-length values.

## Interview Answer

Most array mistakes in Go come from expecting slice behavior, so they are
worth walking through as four specific traps.

The first is calling `append` on an array. `append` grows a slice by
possibly reallocating its backing storage — an array has no indirection to
reallocate, so this fails before the program runs:

```go
a := [3]int{1, 2, 3}
a = append(a, 4) // compile error: first argument to append must be slice
```

The fix is not to make it work but to ask why you are growing a
fixed-length value; if growth is real, the data wants to be a slice.

The second is the classic off-by-one. Valid indices run from `0` to
`len(values)-1`, so `i <= len(values)` walks one step too far:

```go
for i := 0; i <= len(values); i++ { // i reaches 3, the array ends at 2
	fmt.Println(values[i])
}
```

This compiles and then panics the moment `i` hits 3, with the runtime
telling you everything: `panic: runtime error: index out of range [3] with
length 3`. The index and the length in that message are the two numbers
you need.

The third is mutation-by-proxy. A function that takes `[3]int` receives a
copy, so assignments inside it are invisible to the caller:

```go
func setFirst(a [3]int) { a[0] = 99 }
x := [3]int{10, 20, 30}
setFirst(x)
fmt.Println(x) // [10 20 30] — the 99 only touched the copy
```

The program prints `[10 20 30]`, not `[99 20 30]`. If you want the function
to change the caller's data, take a pointer (`a *[3]int`) or a slice.

The fourth is literal confusion: `[]int{1,2,3}` is a slice, `[...]int{1,2,3}`
is an array. The printed types make it concrete: `[]int` versus `[3]int`.
Copy semantics, append, and comparability all flip on that one character.

All four traps reduce to the same sentence — an array is a fixed-length
value — and saying that sentence, with these four failure modes attached,
is the complete answer.

## Deep Dive

Each of these mistakes is instructive because the compiler or runtime gives
you a distinct, honest signal — learning to read those signals is the real
skill this question tests.

### Why append cannot exist for arrays

`append`'s contract is "return a possibly-longer slice", which works because
a slice header (pointer, length, capacity) can be redirected to new storage.
An array is the storage itself, inline in the variable — there is nothing to
redirect and no header to update. So Go rejects the call at compile time
with `first argument to append must be slice; have a (variable of type
[3]int)`. That error text is doing you a favor: it is telling you your data
model is wrong, not your syntax.

### Reading the range panic precisely

The panic `index out of range [3] with length 3` contains a complete
diagnosis: the index you used, the length you had. The bug is always one of
three shapes — a `<=` where `<` was intended, a length used as an index
(`values[len(values)]`), or stale length assumptions after data changes.
Checking which shape it is takes seconds once you read the two numbers.

### The silent one: copies that "don't work"

The mutation trap is the most dangerous of the four because there is no
error at all — the program simply continues with the original data. The
defense is knowing the boundary rule: everything in Go passes by value, and
for arrays the value is the whole block. When silence is the failure mode,
the fix is making the copy visible or changing the type: pointer for
in-place mutation, slice for shared storage, or return the modified value
instead of mutating a parameter.

### One character, two data models

`[]int` and `[3]int` differ by one glyph and by everything that matters:
copy-on-assign versus header sharing, comparable versus not, fixed versus
growable. The `...` in `[...]int{1,2,3}` is the only place Go lets the
compiler count for you, and the result is still a real array type — verified
by `%T` printing `[3]int`. When a program's behavior flips unexpectedly,
checking which literal was written is a good first move.


# Q4 — "How do arrays compare with a slice in Go?"

## Quick Revision

- Type shape: array is `[n]T` with the length in the type; slice is `[]T`,
  a runtime header (pointer, length, capacity) over backing storage.
- Assignment: array copies elements; slice copies the header — both now
  point at the same elements.
- `==` works between arrays of the same type (element-wise); slices cannot
  be compared with `==` at all (except against nil).
- Zero value: array is a block of zeroed elements; slice is nil.
- Rule of thumb: fixed meaning or copy protection → array; growth, sharing,
  function-passing → slice.

## Interview Answer

An array and a slice differ at the type level, and every practical
difference follows from that. An array type includes its length — `[3]int`
— so the length is fixed at compile time and the value is the storage
itself. A slice type is just `[]int`: at runtime a slice is a small
structure with three fields — a pointer into a backing array, a length,
and a capacity. The elements live in the backing array; the slice is a
window onto them.

Assignment is where the difference becomes visible:

```go
x := [3]int{10, 20, 30}
y := x        // copies the three elements
y[0] = 7      // x is unchanged

s := []int{1, 2, 3}
t := s        // copies the header — same backing storage
t[0] = 9      // s[0] is now 9 too
```

The array pair prints `[10 20 30]` and `[7 20 30]`. The slice pair both see
the write, because `t` and `s` are two windows over one block.

Comparability follows the same logic. Two arrays of the same type compare
element by element — `[3]int{1,2,3} == [3]int{1,2,3}` is true — because
the compiler knows exactly how many elements to check. Slices cannot be
compared with `==` (except `s == nil`) because lengths and backing storage
change at runtime; equality would be ambiguous, so the language forbids
it. Their zero values differ the same way: an uninitialized array is a
filled block (`[0 0 0]`), an uninitialized slice is nil.

Practically: arrays are chosen deliberately when the bound is meaning or
copy protection is wanted; slices are the default for anything that grows
or travels between functions — passing a slice copies only the three-word
header, not the elements.

## Deep Dive

The cleanest way to hold the comparison is to see the slice header as a
real data structure, because then "why do these behave differently" stops
being a memorized table and becomes mechanics.

### What each one actually is

Draw an array as the elements in a row, inline in the variable. Draw a
slice as a small three-field record on the left — `ptr`, `len 2`, `cap 3` —
with an arrow to a row of elements elsewhere. Both pictures are literally
true at the machine level, and they predict every behavior:

- `y := x` for arrays copies the row → independent values.
- `t := s` for slices copies the record → two records, one row.
- `==` for arrays compares two known-length rows → well defined.
- `==` for slices would compare two records pointing to possibly-shared
  rows → ambiguous, banned.

### The experiment that fixes it in memory

The single most valuable snippet in this family, executed:

```go
s := []int{1, 2, 3}
t := s[:2]     // len 2, cap 1 remaining — same backing array
t = append(t, 42)
fmt.Println(s, t) // [1 2 42] [1 2 42]
```

`append` had capacity available (cap 3, len 2), so it wrote `42` straight
into `s`'s third slot. The source slice changed without anyone touching
it. This is not a bug in Go — it is what header-sharing means, and it is
why the follow-up questions about aliasing, capacity growth, and safe
copying exist. The array version of this snippet cannot happen: copies
have no shared row to write through.

### Choosing between them, in one pass

If the length is a fact about the data (digest sizes, dimensions, fixed
protocol fields) or you want assignment to isolate — array. If length is a
variable of the problem, data must grow, or functions should share a view —
slice. In practice the second case dominates, which is why Go code shows
slices everywhere and arrays in the specific niches where their guarantees
pay.


# Q5 — "How would you debug a problem involving arrays in Go?"

## Quick Revision

- Compile error about append or mismatched types: the bug is the data model
  (array where slice behavior is expected) — reread the type in the message.
- Panic `index out of range [3] with length 3`: the message contains both
  numbers; check for `<=` loops, length-as-index, or stale bounds.
- "My function's changes disappeared": arrays copy on call — print at the
  boundary, then switch to a pointer or slice if mutation is intended.
- `%v` prints values; `%#v` prints Go syntax including the type —
  `[3]int{10, 20, 30}` vs `[10 20 30]` — use it to confirm array vs slice.
- In Delve: `print x`, `print len(x)` at the faulting line; the locals view
  shows the array with its type.

## Interview Answer

Debugging array problems in Go is mostly reading the very precise signals
the toolchain already gives you, in this order.

Start with compile errors, because several array bugs never reach runtime.
`first argument to append must be slice` means an array was used where a
slice's growth was intended — the fix is reconsidering the type, not the
call. `mismatched types [3]int and [2]int` means two different array types
met; the lengths in the message name the mismatch directly.

Runtime panics are equally legible. An off-by-one loop produces:

```go
values := [3]int{10, 20, 30}
for i := 0; i <= len(values); i++ {
	fmt.Println(values[i]) // panics when i reaches 3
}
```

and the runtime states the exact failure: `panic: runtime error: index out
of range [3] with length 3`. Index 3, length 3, therefore the last valid
index was 2 — the message is the whole diagnosis. Search the loop condition
for `<=`, the body for `values[len(values)]`, and any recently changed
length arithmetic.

The silent class is non-mutation — the function ran, assigned, and the
caller's array still prints the original value:

```go
func setFirst(a [3]int) { a[0] = 99 }
// caller: [10 20 30] — the copy inside the function took the 99
```

Confirm it by printing the array immediately before and after the call; if
the value changes inside but not outside, you are seeing copy semantics.
Decide deliberately: pointer parameter for mutation, slice for shared
storage, or return the new value instead.

For inspection, `fmt.Printf("%#v", x)` is the array-debugging workhorse —
it prints `[3]int{10, 20, 30}`, type included, which immediately
distinguishes an array from a slice where `%v` would not. In Delve, set a
breakpoint at the faulting line, `print x`, `print len(x)`, and read the
elements directly.

The short method: read the message (it names index and length), print
`%#v` at the boundary when behavior surprises you, and treat every
"didn't change" symptom as copy semantics until proven otherwise.

## Deep Dive

What makes array debugging teachable is that each failure class produces a
different kind of evidence — compile-time, panic-time, or silent — and each
class has a small, complete procedure.

### Class one: errors before the program runs

Two compile errors dominate. The append error appears when code assumes a
growable collection but the variable is an array; the compiler's phrase
`must be a slice` is a data-model instruction. The mismatched-types error
appears when two array types of different lengths are assigned or
compared; because the length lives in the type, this is the same class of
error as assigning a `string` to an `int`. Both are caught before any
damage, which is exactly the protection array types exist to provide.

### Class two: the panic with a complete story

The runtime error `index out of range [3] with length 3` is unusually
generous: index attempted, actual length, and by arithmetic, the last legal
index. The three shapes that produce it:

1. `i <= len(a)` where `<` was meant — the loop takes one extra step.
2. `a[len(a)]` — using the length as an index; the last index is `len(a)-1`.
3. A bound computed from a different array or a stale size — the panic's
   length tells you which array the runtime actually saw.

Delve at the panic line (`dlv` prints the faulting frame by default), then
`print i`, `print len(values)` — the two numbers in the message, verified
live.

### Class three: silence, the hardest one

A mutation that never lands produces no output at all — the program's data
just stays the same. The procedure is to bracket the boundary:

```go
fmt.Printf("before: %#v\n", x)
setFirst(x)
fmt.Printf("after:  %#v\n", x) // unchanged → the function got a copy
```

If "before" and "after" match while an interior print inside the function
shows the change, copy semantics are confirmed. Then make a deliberate
choice rather than patching randomly: `*` if the function should mutate in
place, a slice if shared access is wanted, or a return value if the
cleanest Go style fits.

### The inspection toolkit, in one run

Executed together, these are the four prints that resolve most array
questions at a glance:

```go
x := [3]int{10, 20, 30}
fmt.Printf("%v\n", x)   // [10 20 30]     — the values
fmt.Printf("%#v\n", x)  // [3]int{10, 20, 30} — values + the type
fmt.Println(len(x), cap(x)) // 3 3
```

`%#v`'s inclusion of the type is what lets you catch the array/slice
confusion (`[]int` vs `[3]int`) that `%v` hides — and in a codebase where
`[]int{...}` and `[...]int{...}` look nearly identical at a glance, that
one format verb is the fastest disambiguator you have.
