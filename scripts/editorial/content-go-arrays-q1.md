# Q1 rewritten content — "What are arrays in Go, and how do they work?"
# (editorial source of truth; the JSON below is generated from this)

## Quick Revision

- A Go array is a fixed-length block of elements of one type. The length is
  part of the type itself: `[3]int` and `[2]int` are two different types.
- Assignment copies the whole array. After `y := x`, changing `y[0]` does
  not change `x` — arrays are values, not references.
- An uninitialized array is filled with its type's zero values — `var a [3]int`
  prints `[0 0 0]`, never nil.
- Because the length is part of the type, you cannot compare or assign
  arrays of different lengths (`x == b` where x is `[3]int` and b is `[2]int`
  is a compile-time type error).
- Recall line: an array is a value whose length lives in its type; copying
  it copies the elements, not a pointer.

## Interview Answer

A Go array is a fixed-length sequence of elements of a single type, and its
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
zero elements rather than nil.

## Deep Dive

To understand arrays in Go it helps to start with what the language actually
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
sequence covers exactly that boundary.
