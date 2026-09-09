#!/usr/bin/env python3
"""content_data.py — the transcribed editorial content for the Go arrays
calibration batch. Section text comes verbatim from the .md editorial sources;
every code example was executed under go1.22.5 before transcription."""

def sec(kind, title, content=None, items=None, columns=None, rows=None):
    s = {"type": kind, "title": title}
    if content is not None: s["content"] = content
    if items is not None: s["items"] = items
    if columns is not None: s["columns"] = columns
    if rows is not None: s["rows"] = rows
    return s

def q(id_, slug, question, title, quick, spoken, deep, intent, mistake, standout, code, diagram=None, table=None):
    sections = [
        sec("interviewer_expectation", "Quick Revision", content=quick),
        sec("speakable_answer", "Interview Answer", content=spoken),
    ]
    if diagram:
        sections.append(sec("flow_diagram", "Mental Model", content=diagram))
    if code:
        sections.append(sec("code_example", "Example (executed)", content=code))
    if table:
        sections.append(sec("comparison_table", table[0], columns=table[1], rows=table[2]))
    sections += [
        sec("deep_explanation", "Deep Dive", content=deep),
        sec("interviewer_intent", "What the interviewer checks", content=intent),
        sec("common_mistakes", "Common Mistakes", items=mistake),
        sec("key_points", "Key Takeaways", items=standout),
    ]
    return {
        "id": id_, "slug": slug, "question": question, "title": title,
        "direct_answer": quick.split("\n")[0].lstrip("- "),
        "layout_type": "concept-explanation",
        "difficulty": "easy", "importance": "high",
        "reading_time_minutes": 7, "last_updated": "2026-09-09",
        "answer": {"sections": sections},
        "followup_questions": [],
        "company_tags": [],
        "seo": {"metaTitle": title, "metaDescription": question},
        "order": 1,
    }

# ============ arrays-basics (identity frozen; content rewritten) ============

Q1_CODE = '''```go
x := [3]int{10, 20, 30}
y := x        // copies all three elements
y[0] = 7
fmt.Println(x, y) // [10 20 30] [7 20 30]
```'''

Q1_DIAGRAM = """```mermaid
flowchart LR
    subgraph after["y := x — two independent blocks"]
        X["x: [10 20 30]"] --- Y["y: [7 20 30]"]
    end
    Y2["y[0] = 7"] -.->|changes only y| Y
```"""

Q1 = q("go-syntax-basics-arrays-basics-q001", "go-syntax-basics-arrays-basics-interview-basics",
    "What are arrays in Go, and how do they work?",
    "Go Arrays Explained",
    """- A Go array is a fixed-length block of elements of one type. The length is
  part of the type itself: `[3]int` and `[2]int` are two different types.
- Assignment copies the whole array. After `y := x`, changing `y[0]` does
  not change `x` — arrays are values, not references.
- An uninitialized array is filled with its type's zero values — `var a [3]int`
  prints `[0 0 0]`, never nil.
- Because the length is part of the type, you cannot compare or assign
  arrays of different lengths (`x == b` where x is `[3]int` and b is `[2]int`
  is a compile-time type error).
- Recall line: an array is a value whose length lives in its type; copying
  it copies the elements, not a pointer.""",
    """A Go array is a fixed-length sequence of elements of a single type, and its
defining property is that the length belongs to the type. When you write
`[3]int`, that whole expression — "three integers" — is the type, in the
same way `string` is a type. This has consequences you can observe in four
places.

Declaring `var a [3]int` gives you an array already populated with the zero
value of `int`, so it prints as `[0 0 0]`. There is no nil array; the
zero-value fill is the initialization.

Assignment copies the contents. In this snippet both `x` and `y` exist as
independent storage:

```go
x := [3]int{10, 20, 30}
y := x        // copies all three elements
y[0] = 7
fmt.Println(x, y) // [10 20 30] [7 20 30]
```

`x` still prints `[10 20 30]` after `y[0] = 7`, because `y` received the
elements, not a reference to `x`. The same thing happens when you pass an
array to a function — the function gets its own copy, so modifications inside
the function never reach the caller's array. This is the behavior most
interview questions about arrays are really testing.

Because the length is part of the type, `[3]int` and `[2]int` do not
interoperate. Comparing them with `==` fails to compile:

```go
x := [3]int{1, 2, 3}
b := [2]int{1, 2}
_ = x == b // compile error: mismatched types [3]int and [2]int
```

but two arrays of the same length and element type compare element by
element: `[3]int{1,2,3} == [3]int{1,2,3}` is true.

The place arrays genuinely shine is when the fixed size carries meaning —
`[32]byte` for a SHA-256 digest, `[3]uint8` for an RGB pixel — or when you
specifically want copy-on-assign value semantics. For everything else, Go
code passes slices, which share their backing storage instead of copying it.

The short version: an array in Go is a value — its length lives in its type,
its assignment copies its contents, and its zero value is a full block of
zero elements rather than nil.""",
    """To understand arrays in Go it helps to start with what the language actually
promises. The specification defines an array type as the number of elements
followed by the element type — so `[3]int` is not "an int array with a
runtime length of 3"; it is a distinct type, the same way a struct with
three fields is a distinct type. That single design decision explains every
surprising thing arrays do.

### The type carries the length

When the compiler sees `x := [3]int{10, 20, 30}`, it emits a variable whose
type is exactly "three consecutive integers inline". The compiler can do
this because the count is statically known. This is why arrays can be
compared with `==` (the compiler knows precisely how many elements to
compare) while slices cannot (their length changes at runtime, so equality
would have to answer "equal when?" — Go has no universal deep-equality).

It is also why this fails before the program ever runs:

```go
x := [3]int{1, 2, 3}
b := [2]int{1, 2}
_ = x == b // invalid operation: mismatched types [3]int and [2]int
```

These are different types in the strictest sense — not two values of one
"array" type that happen to have different sizes.

### Copying is the mechanism, not an optimization

The mental model that makes everything click: think of an array variable as
holding the elements themselves, the way an `int` variable holds a number.
Nobody expects `b := a` for two ints to link them; the same is true for
arrays:

```go
x := [3]int{10, 20, 30}
y := x
y[0] = 7
fmt.Println(x) // [10 20 30]
fmt.Println(y) // [7 20 30]
```

Two independent blocks of memory, printed verbatim from an executed program.
Contrast this with slices, where `t := s` copies a small header that still
points at the same elements — writing through `t` is visible in `s`. The
array/slice distinction in Go is exactly the value/reference-header
distinction, and arrays are how the language gives you the value side
deliberately.

Function calls follow the same rule, which is where the behavior turns
practical:

```go
func modify(a [3]int) { a[0] = 99 }

func main() {
	x := [3]int{10, 20, 30}
	modify(x)
	fmt.Println(x) // [10 20 30] — the function's copy was changed, not x
}
```

The call to `modify` copies the three integers into the function's own
parameter. The assignment inside the function touches only that copy. If
you want a function to mutate the caller's data, you pass a pointer
(`func modify(a *[3]int)`) or, more idiomatically, a slice.

### Zero values fill the block

`var a [3]int` needs no constructor. Memory for arrays is allocated as a
zeroed block, so every element starts at its type's zero value: `[0 0 0]`
for ints, `["" "" ""]` for strings, and for a struct array, each element's
fields zeroed. There is no "empty" state and no nil — an array of length
three always has exactly three somethings. This differs from slices, whose
zero value is `nil`, and it means array code rarely needs nil checks.

### Where this leaves you

Arrays appear constantly in Go code, but usually as the storage that a
slice points into, or in fixed-size domains where the bound is real
(crypto digests, matrices, buffers). When you reach for one deliberately,
you are choosing two properties: a length that the type system enforces
and copies that protect your data. When you need growth or shared views
over storage, that is what slices are for — the next question in this
sequence covers exactly that boundary.""",
    "Whether the candidate states that the length belongs to the type and predicts copy-on-assign behavior without running code.",
    ["Treating arrays as dynamically sized and trying append on them.",
     "Expecting array assignment or function calls to share storage."],
    ["Length is part of the array type; `[3]int` ≠ `[2]int`.",
     "Assignment and function calls copy the elements.",
     "Zero value is a filled block of zeroed elements, never nil.",
     "Same-type arrays compare element-wise with `==`."],
    Q1_CODE, Q1_DIAGRAM)

Q2 = q("go-syntax-basics-arrays-basics-q002", "go-syntax-basics-arrays-basics-when-to-use",
    "When should you use arrays in Go?",
    "When Arrays Are the Right Choice",
    """- Use an array when the fixed length is part of the meaning: `[32]byte` for a
  SHA-256 digest, `[3]uint8` for an RGB color, `[N][N]float64` for a matrix.
- Use an array when you want copy-on-assign protection — handing data to a
  function without letting it mutate the caller's copy.
- Use `[...]T{...}` when the length is fixed but tedious to count; the
  compiler computes it and the result is still an array type.
- Default to slices for anything that grows, gets passed around, or has no
  meaningful fixed bound. Arrays are the deliberate exception in Go code.""",
    """Arrays earn their place in Go when the bound itself carries meaning. The
clearest example comes straight from the standard library: `crypto/sha256`
computes a digest with `Sum256`, and its return type is `[32]byte` — not a
slice. A SHA-256 digest is exactly thirty-two bytes by definition; a length
that could vary would be a different, wrong type. The same logic applies to
`[3]uint8` for an RGB pixel or `[4][4]float64` for a transformation matrix:
the number is part of what the value is, and the type system should enforce
it. Compile and run this and the type shows the intent:

```go
sum := sha256.Sum256([]byte("interview"))
fmt.Printf("%T\\n", sum) // [32]uint8
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
and for a slice when the size is a variable about the problem.""",
    """The question "when should I use an array?" is really asking "what does an
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
fmt.Printf("%T %T\\n", arr, slc) // [3]int []int
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
is what turns this from a trivia answer into an engineering answer.""",
    "Whether the candidate names concrete domains (digests, colors, matrices) rather than the vague 'when size is fixed'.",
    ["Using arrays as the default collection and converting to slices later.",
     "Missing the [...] literal-count form and hand-counting constants."],
    ["Choose an array when the bound is a fact about the data ([32]byte digest).",
     "Choose an array when copy-on-assign isolation is the point.",
     "[...] lets the compiler count; the result is still a fixed-length type.",
     "Everything else defaults to slices."],
    '''```go
sum := sha256.Sum256([]byte("interview"))
fmt.Printf("%T\\n", sum) // [32]uint8

rgb := [3]uint8{255, 128, 0}
auto := [...]int{1, 2, 3, 4} // still an array: [4]int
```''', None,
    ("Array or slice — the decision", ["Situation", "Use"],
     [["Length is a fact of the data (digest, pixel, matrix)", "array"],
      ["Copy protection for small fixed data", "array"],
      ["Collection grows or varies", "slice"],
      ["Cheap passing between functions", "slice"]]))

Q3_CODE = '''```go
// trap 1: append on an array — compile error
a := [3]int{1, 2, 3}
a = append(a, 4) // compile error: first argument to append must be slice

// trap 2: off-by-one — runtime panic
for i := 0; i <= len(values); i++ { // i reaches 3, array ends at 2
	fmt.Println(values[i])
}

// trap 3: mutation through a copy
func setFirst(a [3]int) { a[0] = 99 }
x := [3]int{10, 20, 30}
setFirst(x)
fmt.Println(x) // [10 20 30] — the 99 only touched the copy
```'''

Q3 = q("go-syntax-basics-arrays-basics-q003", "go-syntax-basics-arrays-basics-common-mistake",
    "What common mistakes should you avoid with arrays in Go?",
    "Four Real Array Traps",
    """- `append` does not work on arrays — it requires a slice. `a = append(a, 4)`
  on an array is a compile error, not a runtime growth.
- `i <= len(values)` loops past the end: the last valid index is
  `len(values) - 1`. The panic is `index out of range [3] with length 3`.
- Passing an array to a function copies it, so `a[0] = 99` inside the
  function never reaches the caller — the mistake is expecting mutation.
- `[]int{...}` is a slice; `[...]int{...}` (or `[3]int{...}`) is an array.
  One character changes copying, append, and comparability.
- All four traps share one root: arrays are fixed-length values.""",
    """Most array mistakes in Go come from expecting slice behavior, so they are
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
for i := 0; i <= len(values); i++ {
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
is the complete answer.""",
    """Each of these mistakes is instructive because the compiler or runtime gives
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
checking which literal was written is a good first move.""",
    "Whether the candidate can attach a concrete failure mode (compile error, panic, silent non-mutation) to each mistake rather than listing vague advice.",
    ["Trying to append to an array instead of using a slice.",
     "Writing i <= len(values) and being surprised by the range panic.",
     "Expecting function parameters to mutate the caller's array."],
    ["append requires a slice; on an array it is a compile error.",
     "Last valid index is len-1; the panic message contains both numbers.",
     "Function parameters get a copy — mutations never reach the caller.",
     "[]int is a slice; [...]int and [3]int are arrays."],
    Q3_CODE, None,
    ("The four traps", ["Trap", "Signal", "Root cause"],
     [["append on array", "compile error", "no header to reallocate"],
      ["i <= len(values)", "range panic", "off-by-one bound"],
      ["mutate via parameter", "silent", "copy at call boundary"],
      ["[] vs [...] literal", "wrong semantics", "slice vs array type"]]))

Q4_DIAGRAM = """```mermaid
flowchart LR
    subgraph ARR["array — value"]
        A1["[10 20 30]"]
    end
    subgraph SL["slice — header over backing storage"]
        H["ptr/len/cap"] --> B1["[10 20 30]"]
    end
    A2["y := x"] -->|"copies the row"| ARR
    H2["t := s"] -->|"copies the header"| SL
```"""

Q4 = q("go-syntax-basics-arrays-basics-q004", "go-syntax-basics-arrays-basics-compare",
    "How do arrays compare with a slice in Go?",
    "Array versus Slice",
    """- Type shape: array is `[n]T` with the length in the type; slice is `[]T`,
  a runtime header (pointer, length, capacity) over backing storage.
- Assignment: array copies elements; slice copies the header — both now
  point at the same elements.
- `==` works between arrays of the same type (element-wise); slices cannot
  be compared with `==` at all (except against nil).
- Zero value: array is a block of zeroed elements; slice is nil.
- Rule of thumb: fixed meaning or copy protection → array; growth, sharing,
  function-passing → slice.""",
    """An array and a slice differ at the type level, and every practical
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
header, not the elements.""",
    """The cleanest way to hold the comparison is to see the slice header as a
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
pay.""",
    "Whether the candidate explains the slice header as the mechanism behind every behavioral difference rather than reciting a table.",
    ["Describing slices as 'dynamic arrays' without the header model — which makes append aliasing inexplicable.",
     "Claiming slices can be compared with == (they cannot, except nil)."],
    ["Array: length in type, copy on assign, == comparable. Slice: header over shared storage, nil zero value.",
     "Assignment copies elements (array) versus the header (slice).",
     "The s[:2]+append experiment shows shared storage in one line."],
    '''```go
x := [3]int{10, 20, 30}
y := x
y[0] = 7      // x unchanged

s := []int{1, 2, 3}
t := s[:2]
t = append(t, 42) // s is now [1 2 42]
```''', Q4_DIAGRAM,
    ("Array vs slice — same axes", ["Property", "Array [n]T", "Slice []T"],
     [["Length", "in the type", "in the header (runtime)"],
      ["Assignment", "copies elements", "copies the header"],
      ["==", "element-wise, same type", "only vs nil"],
      ["Zero value", "zeroed block", "nil"],
      ["Growth", "impossible", "append may allocate"]]))

Q5_CODE = '''```go
x := [3]int{10, 20, 30}
fmt.Printf("%v\\n", x)   // [10 20 30]        — values
fmt.Printf("%#v\\n", x)  // [3]int{10, 20, 30} — values + type
fmt.Println(len(x), cap(x)) // 3 3
```'''

Q5 = q("go-syntax-basics-arrays-basics-q005", "go-syntax-basics-arrays-basics-scenario",
    "How would you debug a problem involving arrays in Go?",
    "Debugging Array Problems",
    """- Compile error about append or mismatched types: the bug is the data model
  (array where slice behavior is expected) — reread the type in the message.
- Panic `index out of range [3] with length 3`: the message contains both
  numbers; check for `<=` loops, length-as-index, or stale bounds.
- "My function's changes disappeared": arrays copy on call — print at the
  boundary, then switch to a pointer or slice if mutation is intended.
- `%v` prints values; `%#v` prints Go syntax including the type —
  `[3]int{10, 20, 30}` — use it to confirm array vs slice.
- In Delve: `print x`, `print len(x)` at the faulting line; the locals view
  shows the array with its type.""",
    """Debugging array problems in Go is mostly reading the very precise signals
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
"didn't change" symptom as copy semantics until proven otherwise.""",
    """What makes array debugging teachable is that each failure class produces a
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

Delve at the panic line, then `print i`, `print len(values)` — the two
numbers in the message, verified live.

### Class three: silence, the hardest one

A mutation that never lands produces no output at all — the program's data
just stays the same. The procedure is to bracket the boundary:

```go
fmt.Printf("before: %#v\\n", x)
setFirst(x)
fmt.Printf("after:  %#v\\n", x) // unchanged → the function got a copy
```

If "before" and "after" match while an interior print inside the function
shows the change, copy semantics are confirmed. Then make a deliberate
choice rather than patching randomly: `*` if the function should mutate in
place, a slice if shared access is wanted, or a return value if the
cleanest Go style fits.

### The inspection toolkit, in one run

Executed together, these are the prints that resolve most array questions
at a glance:

```go
x := [3]int{10, 20, 30}
fmt.Printf("%v\\n", x)   // [10 20 30]     — the values
fmt.Printf("%#v\\n", x)  // [3]int{10, 20, 30} — values + the type
fmt.Println(len(x), cap(x)) // 3 3
```

`%#v`'s inclusion of the type is what lets you catch the array/slice
confusion (`[]int` vs `[3]int`) that `%v` hides — and in a codebase where
`[]int{...}` and `[...]int{...}` look nearly identical at a glance, that
one format verb is the fastest disambiguator you have.""",
    "Whether the candidate reads the actual error messages (panic index/length pair, compile error types) instead of guessing, and knows the silent copy-semantics failure mode.",
    ["Guessing at the panic instead of reading the index/length pair in the message.",
     "Not suspecting copy semantics when a function's changes 'disappear'."],
    ["Read the panic message first: it names the index and the length.",
     "Print %#v at boundaries to confirm array-vs-slice and values.",
     "Silent non-mutation means copy semantics — verify, then choose pointer/slice/return."],
    Q5_CODE, None,
    ("Failure classes and their evidence", ["Class", "Signal", "First move"],
     [["Type-model bug", "compile error text", "reread the types in the message"],
      ["Off-by-one", "range panic", "read index + length, check <="],
      ["Copy semantics", "silent", "print %#v before/after the call"]]))

ARRAYS_BASICS = [Q1, Q2, Q3, Q4, Q5]

# ============ arrays-vs-slices (declared re-identification; IDs stable) ============
# The template identities ("What is Arrays Vs Slices...") are replaced with the
# questions a Go interviewer actually asks about this comparison. IDs/slugs unchanged.

Q6 = q("go-slices-maps-arrays-vs-slices-q001", "go-slices-maps-arrays-vs-slices-interview-basics",
    "What is the difference between an array and a slice in Go?",
    "The Array–Slice Difference",
    """- An array is a fixed-length value whose length lives in its type: `[3]int`.
  A slice is a runtime header — pointer, length, capacity — over a backing
  array: `[]int`.
- Copying an array copies the elements; copying a slice copies the header,
  so both slices then see the same elements.
- Arrays compare with `==` (same type only); slices cannot be compared
  with `==` except against nil.
- Array zero value is a block of zeroed elements; slice zero value is nil.
- When length is a fact of the data, array; when it varies, slice.""",
    """The difference begins in the type system. An array type includes its
length — `[3]int` — so the value is a fixed block and the compiler knows
its shape everywhere. A slice type is `[]int` and carries no length at
all; at runtime it is a small three-field header pointing into a backing
array, with its own length and capacity. Everything practical follows from
this split.

Copying is the clearest consequence. Assigning an array copies every
element — `y := x` produces two independent values. Assigning a slice
copies only the header — `t := s` leaves two headers pointing at the same
elements, so writes through either are visible in both:

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
compare element-wise (`[3]int{1,2,3} == [3]int{1,2,3}` is true). A slice
cannot be the operand of `==` (except `s == nil`) because a meaningful
equality would have to define what it means for two windows over shared,
growable storage — so Go declines. Zero values match the pictures too: an
uninitialized array is a full block of zeroed elements, an uninitialized
slice is nil.

In practice: use the array when the bound is meaning (a `[32]byte`
digest) or isolation is wanted; use the slice — the default — whenever
length varies or the data must travel between functions cheaply, since
passing a slice copies only the header.""",
    """Hold one picture and this whole topic stops being trivia: an array is the
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

### Why == is legal for one and illegal for the other

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
of the window/storage split drawn here.""",
    "Whether the candidate grounds every behavioral difference in the header model rather than memorized table rows.",
    ["'Slices are just dynamic arrays' — the phrase that makes aliasing inexplicable.",
     "Believing slices support == comparison."],
    ["Array = storage inline; slice = header pointing at storage.",
     "Assignment copies elements vs copies the header.",
     "== is element-wise for arrays, illegal for slices except nil."],
    '''```go
x := [3]int{10, 20, 30}
y := x
y[0] = 7          // x unchanged

s := []int{10, 20, 30}
t := s
t[0] = 7          // s changed too — shared storage
```''',
    """```mermaid
flowchart LR
    subgraph ARR["array"]
        A["[10 20 30] — the value itself"]
    end
    subgraph SLI["slice"]
        H["header: ptr, len, cap"] --> BA["backing array: [10 20 30]"]
    end
```""")

Q7_CODE = '''```go
s := []int{1, 2, 3}     // len 3, cap 3
t := s[:2]              // len 2, cap 3 — capacity available
t = append(t, 42)
fmt.Println(s, t)       // [1 2 42] [1 2 42]
```'''

Q7 = q("go-slices-maps-arrays-vs-slices-q002", "go-slices-maps-arrays-vs-slices-when-to-use",
    "Why does modifying a slice sometimes change another slice?",
    "Slice Aliasing",
    """- `t := s` or `t := s[:2]` copies only the header — both slices point at
  the same backing array, so writes through either are visible in both.
- `append` writes into the shared backing array whenever capacity is
  available; it does not necessarily allocate.
- Executed example: `s := []int{1,2,3}; t := s[:2]; t = append(t, 42)`
  leaves both printing `[1 2 42]` — the 42 landed in `s`'s third slot.
- The aliasing ends only when an append grows beyond capacity and the
  slice forks to new storage.
- If two slices must be independent, copy the elements — `copy()` or
  `append([]T(nil), s...)`.""",
    """It happens because slice assignment copies a three-field header, not the
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
directly. This is the mechanism behind the most common Go
data-corruption report: "I appended to my sub-slice and my original slice
changed."

The sharing continues until a growth forces a fork: once a slice is at
capacity and appends again, `append` allocates new storage, copies, and
returns a header pointing elsewhere — the two slices finally diverge. The
safe patterns when independence is required are `copy(dst, src)` or
`append([]int(nil), s...)`, both of which produce genuinely separate
backing storage. The rule to carry away: assignment and re-slicing share
storage below capacity, and only growth severs it.""",
    """The header picture makes aliasing predictable instead of spooky — and
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
point — only a small header.

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
must stay pristine, that is the moment to reach for a real copy.""",
    "Whether the candidate explains the shared-backing-array mechanism and predicts when a write through one slice appears in another.",
    ["Believing append always allocates fresh storage.",
     "Treating aliasing as a Go bug rather than header semantics."],
    ["Assignment and re-slicing copy the header, not the elements.",
     "append with spare capacity writes into the shared storage.",
     "Only an at-capacity append forks the slices apart."],
    Q7_CODE,
    """```mermaid
flowchart LR
    S["s: ptr/len3/cap3"] --> BA["[1 2 3]"]
    T["t: ptr/len2/cap3"] --> BA
    A["append(t, 42)"] -.writes slot 2.-> BA
    BA --> R["both print [1 2 42]"]
```""")

Q8_CODE = '''```go
s := []int{1, 2, 3}    // len 3, cap 3 — full
u := append(s, 77)     // must grow: new array, cap 6
s[0] = 5               // writes to the OLD storage
fmt.Println(s, u)      // [5 2 3] [1 2 3 77] — forked
```'''

Q8 = q("go-slices-maps-arrays-vs-slices-q003", "go-slices-maps-arrays-vs-slices-common-mistake",
    "When you append to a slice, when does it copy the backing array?",
    "When append Copies",
    """- `append` copies only when length has reached capacity. While
  `len < cap`, it writes into the existing backing array in place.
- With spare capacity, `append` never allocates — the write is visible to
  every slice sharing that storage.
- At capacity (`len == cap`), `append` allocates a larger backing array,
  copies the elements, and returns a header to the new storage — the
  caller's other slices keep the old array and no longer see changes.
- Verified fork: `s := []int{1,2,3}` (len 3, cap 3); `append(s, 77)`
  yields cap 6, and a later `s[0] = 5` is invisible in the appended slice.
- Growth factor: for small slices the new capacity is roughly double.""",
    """The single condition is capacity. `append` checks whether the slice's
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
up front instead of the allocate-copy-copy-copy chain of growth.""",
    """Capacity is the quiet third field of the slice header, and `append`'s
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
idiomatic call is always `s = append(s, x)`.""",
    "Whether the candidate states the single condition (len == cap) and both branches with their aliasing consequences.",
    ["Ignoring append's return value because 'it modifies in place' — only sometimes true.",
     "Assuming append always copies, then being surprised by aliasing."],
    ["len < cap: write in place, no allocation, aliases see it.",
     "len == cap: allocate, copy, fork — old slices keep old storage.",
     "Always capture the return: s = append(s, x).",
     "make([]T, 0, n) pre-sizing makes appends copy-free."],
    Q8_CODE,
    """```mermaid
flowchart LR
    subgraph inPlace["len < cap — in place"]
        S1["[1 2 _] cap3"] -->|"append 99 writes slot 2"| S2["[1 2 99] shared"]
    end
    subgraph fork["len == cap — fork"]
        F1["[1 2 3] cap3"] -->|"append 77: allocate+copy"| F2["[1 2 3 77] cap6 — new storage"]
        F1 -.->|"s[0]=5 stays here"| F1
    end
```""")

Q9_CODE = '''```go
func modifyArr(a [3]int) { a[0] = 99 }
func modifySlc(s []int)  { s[0] = 99 }

x := [3]int{10, 20, 30}
modifyArr(x)
fmt.Println(x) // [10 20 30] — the copy inside took the 99

s := []int{10, 20, 30}
modifySlc(s)
fmt.Println(s) // [99 20 30] — shared storage
```'''

Q9 = q("go-slices-maps-arrays-vs-slices-q004", "go-slices-maps-arrays-vs-slices-compare",
    "Should you pass a large array or a slice to a function in Go?",
    "Passing Arrays vs Slices",
    """- Passing an array copies all of its elements on every call; passing a
  slice copies only the three-word header.
- If the function should see or modify the caller's data, pass a slice —
  `modifySlc(s)` leaves `s[0]` changed (executed: `[99 20 30]`).
- If the caller's data must be protected, an array copy is the
  protection itself — `modifyArr(x)` leaves x `[10 20 30]`.
- `range` over an array copies each element too; range over a slice
  copies the element values but iterates the shared storage.
- Default: pass slices. Arrays only when copy-isolation is the intent or
  the size is small and meaningful.""",
    """Mechanically, the question is about what gets copied at the call boundary.
An array parameter receives a complete copy of the elements — a
`[3]int` copies three integers, a large array copies its entire contents,
every call. A slice parameter receives a copy of the header only — three
words — no matter how many elements it views. For large data the slice is
therefore the only reasonable default.

The behavior difference is just as important as the cost, and one executed
pair shows both:

```go
func modifyArr(a [3]int) { a[0] = 99 }
func modifySlc(s []int)  { s[0] = 99 }

x := [3]int{10, 20, 30}
modifyArr(x)
fmt.Println(x) // [10 20 30] — the copy inside took the 99

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
every call and signals that the data wanted to be a slice.""",
    """The call boundary is where Go's "everything is passed by value" rule
meets the array/slice split, and the result is one rule with two very
different costs.

### What the copy actually is

For an array, the copy is a full element-wise transfer — the same
operation as `y := x`, triggered at every call. For a slice, the copy is
the header: one pointer, one length, one capacity. This is why slice
passing is O(1) regardless of element count while array passing is O(n)
per call.

### The mutation asymmetry, precisely

`modifySlc(s)` works because the function's header copy points at the
caller's storage — `s[0] = 99` lands in shared memory. `modifyArr(x)`
silently "fails" to mutate because the function's array copy is private.
Neither is wrong; they are two contracts. The bug pattern is expecting
one contract and writing the other — say, a normalization function that
mutates its copy while the caller assumes normalization happened. The
fixes, in order of preference: return the new value, take a slice, or
take a pointer when in-place mutation is genuinely intended.

### Why the idiomatic answer is "slice"

Standard-library Go settles the default: nearly every data-carrying API
takes slices, because O(1) passing plus clear shared-view semantics
compose well. The deliberate exceptions prove the rule — fixed-size
values like `[32]byte` digests flow by value precisely because their size
is small and their isolation is the point. When you choose, name which
property you are buying: cheap shared access (slice) or copy-protected
handoff (array).""",
    "Whether the candidate connects the copy cost AND the mutation contract to the choice, not just performance.",
    ["Passing big arrays by value on every call out of habit.",
     "Expecting an array parameter to mutate the caller's data."],
    ["Array parameter: full copy per call, O(n); slice parameter: header copy, O(1).",
     "Slice params see and modify caller storage; array params cannot.",
     "Default to slices; use arrays when the copy IS the guarantee."],
    Q9_CODE, None,
    ("The two contracts", ["Pass", "Cost per call", "Caller sees changes?"],
     [["[n]T (array)", "copies n elements", "no — private copy"],
      ["[]T (slice)", "copies 3-word header", "yes — shared storage"],
      ["*[n]T (pointer)", "one word", "yes — in place"]]))

Q10_CODE = '''```go
s := []int{1, 2, 3}

u := make([]int, len(s))
copy(u, s)        // exact-size transfer
u[0] = 50
fmt.Println(s, u) // [1 2 3] [50 2 3] — independent

v := append([]int(nil), s...) // allocate-and-copy idiom
v[0] = 60
fmt.Println(s, v) // [1 2 3] [60 2 3] — also independent
```'''

Q10 = q("go-slices-maps-arrays-vs-slices-q005", "go-slices-maps-arrays-vs-slices-scenario",
    "How do you copy a slice safely in Go?",
    "Copying Slices Safely",
    """- `t := s` is NOT a copy — it shares backing storage; writes through
  either are visible in both.
- Real copy option one: `dst := make([]T, len(s)); copy(dst, s)` —
  exact-size transfer, capacity known.
- Real copy option two: `dst := append([]T(nil), s...)` — one-line idiom,
  capacity chosen by append.
- Executed proof: after either copy, `u[0] = 50` leaves `s` as
  `[1 2 3]` — genuinely independent.
- Gotcha: copying a slice of pointers copies the pointers — the pointees
  remain shared.""",
    """A safe copy means new backing storage, and Go gives you three ways to get
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
deep copy and outside `copy`'s job.""",
    """Safe copying is the deliberate severing of the sharing that aliasing
creates — so the deep version of this question is: what exactly does
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
copy:                    transfer
after:   s ──▶ [1 2 3]        u ──▶ [1 2 3]   (two arrays)
u[0]=50: s ──▶ [1 2 3]        u ──▶ [50 2 3]
```

### Why the append idiom is safe, precisely

`append([]int(nil), s...)` begins with a nil slice — len 0, cap 0, no
backing array. Spreading `s...` presents len(s) elements that cannot fit
(no capacity), so append takes the allocate-copy branch every time: fresh
storage, guaranteed. It is the same mechanism, used on purpose.

### The pointer-slice boundary

Trace `ps := []*int{&a, &b}` and `pc := append([]*int(nil), ps...)`: the
copy holds new pointer values — different headers — but each points at
the same `a` and `b`. `*pc[0] = 99` changes `a` for every view of it.
The copy is safe at the slice level, shared at the data level; whether
that is acceptable depends on whether the elements are values (ints,
structs — fully safe) or references (pointers, maps, inner slices —
shared). That boundary, stated out loud, is the difference between a
candidate who has used `copy` and one who understands it.""",
    "Whether the candidate knows what a safe copy means (new backing storage) and the pointer-element boundary where copies stay shared.",
    ["Believing t := s is a copy.",
     "Copying slices of pointers and expecting deep isolation."],
    ["t := s shares storage — not a copy.",
     "make+copy: exact capacity, explicit.",
     "append([]T(nil), s...): one line, always allocates.",
     "Pointer elements stay shared across any slice-level copy."],
    Q10_CODE, None)

ARRAYS_VS_SLICES = [Q6, Q7, Q8, Q9, Q10]
