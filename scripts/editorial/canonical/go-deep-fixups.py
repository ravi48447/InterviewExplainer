"""go-deep-fixups.py — missing Deep Dive sections for 3-tuple entries."""

FIXUPS = {
("range-over-slice-map", "What does range over a slice give you"): """Why does range copy the element? Because the loop variable is an ordinary variable, and range's assignment into it is ordinary assignment — for value types (structs, ints, strings), assignment copies. The loop var is written fresh each iteration from the slot, and your body writes to that fresh copy, not the slot.

Watch the trap with a struct slice (executed):
```go
type Task struct{ Done bool }
tasks := []Task{{false}, {false}}
for _, t := range tasks {
    t.Done = true
}
fmt.Println(tasks[0].Done) // false — the loop never touched the slice
```
The write landed in t — a stack variable the runtime reuses per iteration — and the slice's backing array never saw it. Contrast the fix, `for i := range tasks { tasks[i].Done = true }`: here there's no element copy at all (you use the index), and the write goes through the slice's storage directly.

The pointer-slice case explains the boundary: `[]*Task` ranges with the copy being the POINTER — 8 bytes, pointing at the same Task. Field writes through the copy land on the shared struct. So 'range copies the element' is precisely true, and for pointers the copy is a reference — the aliasing you want.

Go 1.22 note: the loop variable is now fresh per iteration (the capture-bug fix), but it is STILL a copy of the element for value types — the two changes are orthogonal, and the copy-trap survives.""",

("range-over-slice-map", "Can you modify a map's values"): """The rules differ because the operations differ. Updating m[k] inside range m doesn't restructure anything — the key exists, the value slot exists, the write is just a store. The iterator is walking buckets, and stores to existing entries don't move them.

Deletion during iteration is tolerated with a relaxed contract: entries deleted ahead of the iterator's position may or may not be visited — the spec says unspecified, meaning 'the runtime may differ, don't depend on it.' What's guaranteed: no crash, no corruption, and entries that exist and aren't deleted will all be seen. The cleanup loop pattern (range + delete expired) is standard idiom precisely because those guarantees are enough.

Insertion is where the runtime refuses to promise anything at all: a new key may land in a bucket the iterator already passed (never visited) or hasn't reached (may be visited) — and with growth, the iterator might follow a growing structure indefinitely. An infinite loop is constructible, and the code that has one looks innocent:

```go
for k := range m {
    m[k+"-new"] = process(m[k])   // adds keys forever in the worst shapes
}
```
The fix pattern: collect the additions, apply them after the loop — two passes, deterministic, and the intent is visible in the shape.""",

("range-over-slice-map", "Does range copy the slice"): """The once-only evaluation is the language rule that makes loop semantics stable: 'The range expression x is evaluated once before beginning the loop.' For a slice, that evaluation yields the header (pointer, len, cap) — and the loop's internal snapshot is that header.

The append-invisibility follows mechanically: appends that fit in capacity write into the SAME backing array — the loop, walking its snapshot pointer, DOES see those in-place writes to elements it hasn't reached. But appends that grow the slice allocate a new array — the loop's snapshot still points at the old one — and those elements are invisible.

So the precise statement is subtler than 'appends are invisible': in-capacity appends to not-yet-visited indices ARE seen (shared storage); growth appends are not (forked storage). Both facts fall out of the header snapshot:

```go
s := make([]int, 3, 10)
for i, v := range s {
    s = append(s, 99)      // in-capacity: writes backing[3..]
    _ = v
    fmt.Println(i)          // 0 1 2 — the snapshot's len, never more
}
```
The loop length froze at 3; the shared-array writes happened where the loop never looks. Range can't loop forever on self-append — the frozen len is the safety.""",

("range-over-slice-map", "How do you skip or break"): """Labels are the feature people reach for last and should reach for earlier. The semantics: a label marks a statement; `break LABEL` exits the labeled loop regardless of nesting depth. Without it, break binds to the innermost loop only — and the boolean-flag-across-nested-loops pattern is what labels replace:

```go
// the pattern labels replace
found := false
for _, row := range matrix {
    for _, cell := range row {
        if cell == target {
            found = true
            break   // exits inner only — outer keeps scanning
        }
    }
    if found { break }
}
```
versus the labeled form, which says exactly what it means:

```go
outer:
    for _, row := range matrix {
        for _, cell := range row {
            if cell == target {
                break outer   // both loops, one statement
            }
        }
    }
```
Why no labeled continue? The Go spec discussions concluded it added a second axis of control flow for a case that extracting a function handles better — continue-to-outer-label is almost always a sign the inner loop wants to BE a function returning 'found it or not.' The tool set (continue, break, labeled break, goto for cleanup ladders) covers the real cases; the missing piece pushes you toward better structure.

goto's one surviving idiomatic use is the same family: error-ladder cleanup in C-era code translated to Go — forward goto a cleanup block, fall-through otherwise. Every other goto in review is a refactor request.""",

("slice-tricks", "How do you remove an element"): """Both idioms are append/copy mechanics, and seeing them as such removes the memorization. The ordered remove, `append(s[:i], s[i+1:]...)`, is a left-shift: the tail s[i+1:] is copied onto s starting at i — same backing array, elements slide down one, the header's len drops by one via the returned append result.

Executed: [1 2 3 4] remove index 1 → append([1], [3 4]...) → [1 3 4].

The swap-delete, `s[i] = s[len(s)-1]; s = s[:len(s)-1]`, never moves the tail: it copies the LAST element into the hole (one store) and shrinks the window (one reslice). Executed: [1 2 3 4] delete index 1 → s[1]=4 → [1 4 3 4] → s[:3] → [1 4 3].

The invariants each preserves explain when to use which:
- Order matters (display, pagination, priority queues backed by slices): append-shift — O(n) is the price of the contract.
- Order doesn't (membership sets, work queues, LRU scratch): swap-delete — O(1) with the honest cost that position is meaningless.

One subtlety worth knowing: remove-while-ranging. The ranged loop's snapshot means deleting the CURRENT index inside range needs a manual index (`for i := 0; i < len(s); i++` with the decrement after removal) — but the idiomatic form is filter-into-new because it states intent. The shift/swap tricks are for spot-removal; the filter is for sweeps.""",

("slice-tricks", "How do you insert an element"): """The one-liner is compositional — two appends — and each append does what append always does:

```go
s = append(s[:i], append([]T{x}, s[i:]...)...)
```
Inner: append([]T{x}, tail...) — a fresh slice with capacity for exactly one, immediately exceeded — so it takes the allocate path: new array holding [x, tail...]. Outer: append(prefix, that...) — copies that onto s at i, sliding everything right.

It allocates because the INNER append starts from a fresh []T{x} with no room. That's the whole difference from the manual version:

```go
s = append(s, zero)   // one growth if at cap
copy(s[i+1:], s[i:])  // right-shift the tail — copy handles overlap
s[i] = x
```
No temp slice — the shift happens inside s's own storage. The copy-overlap subtlety: Go's copy behaves as if copying through a temp when regions overlap, so a right-shift in one call is correct (a forward copy would otherwise clobber the tail before it's read).

Cost comparison at the same final state: one-liner = 1 temp allocation + 2 copies; manual = 1 capacity check + 1 overlapping copy. The manual version is what you write when the insert is in a loop (parsers, buffers); the one-liner is what you write once, where clarity dominates.""",

("slice-tricks", "How do you copy a slice safely"): """The two safe forms differ in who chooses capacity — and that's the whole choice between them.

make+copy: you chose. dst has exactly len(s) capacity — no waste, no headroom. The next append to dst allocates. Use when the copy is final-size.

append-idiom: append chose. The result's capacity is whatever growth policy gave — often more than len. Subsequent appends may fit without allocating. Use when the copy keeps growing.

The pointer-element boundary, verified: for []*int, both forms copy the pointer values — new headers, same pointees. *dst[0] = 99 is visible through src[0]. The slice-level safety is intact; the data-level sharing is unchanged. Deep copies are manual — copy the elements AND their pointees — there is no language-level deep copy, by design, because 'deep' is type-specific (what counts as deep for a struct containing a map?).

The test of a real copy — the one the executed examples ran: mutate the copy, print the source, see no change. Any copy idiom that fails that test is an alias (t := s and friends).""",

("slice-tricks", "How do you reverse a slice"): """The loop is two-pointer invariants: i only rises, j only falls, they swap every step, and the loop ends at the crossing. Each swap places one element in its final position — after the loop, every element has been placed, which is why it's O(n) with n/2 swaps and no allocation.

The mechanics worth noticing: Go's multiple assignment, `s[i], s[j] = s[j], s[i]`, evaluates both right-hand sides before assigning either — the classic swap without a temp. That single language feature is why the reversal is three lines total.

slices.Reverse (Go 1.21+) is the same algorithm, standardized — the generic version over any element type. The standard library resisted a Reverse for a decade because three lines didn't justify an API; generics changed the calculus: one maintained implementation beats a million re-writes, and the package's tests catch the boundary cases hand-written loops sometimes miss (the i <= j off-by-one that swaps the middle with itself, the len 0/1 edge).

String reversal is a different question — and a classic trap: reversing a string by bytes (b[i], b[j] swap) destroys multi-byte UTF-8 runes. Reverse the RUNES ([]rune(s), swap, string(...)) and the result stays valid — at the cost of the rune-slice allocation. That byte-index vs rune-index boundary on strings is a topic of its own for good reason.""",

("slice-tricks", "How do you filter a slice into a new one"): """The in-place filter is the idiom that looks like a bug and isn't — until it is. Its safety rests on one invariant: the write index never passes the read index.

```go
evens := all[:0]
for _, v := range all {
    if v%2 == 0 {
        evens = append(evens, v)
    }
}
```
The output starts at all's element 0. The input is read by range at index r (0, 1, 2, ...). Each append writes at index w — and w can only advance when r advanced past it, because w increments only for kept elements and r increments for every element. So w <= r always: the write to slot w can never clobber a value the loop hasn't read. Executed: [1 2 3 4 5] → evens [2 4], and all reads [2 4 3 4 5] — the first two slots overwritten, the tail garbage-but-unread.

That's the safety. The cost is the aliasing: all and evens share storage, so 'all' after the loop is corrupted from its original meaning. Every future reader of all is reading a lie unless the function's contract says the input is consumed.

Which is exactly why the fresh-destination version is the default in application code — the same three lines with make(...) instead of s[:0], zero cleverness, no preconditions. The in-place form earns its place inside library code where the input is already a private copy. The interview-grade answer names the invariant (w <= r), the corruption (all is consumed), and the ownership rule: use in-place only when you already own a disposable copy.""",

("if-err-not-nil-pattern", "Why is if err != nil the standard"): """The pattern is the visible half of a design decision. The invisible half: what Go got rid of. Exception systems interleave two control flows — normal and exceptional — and every call site is secretly a branch point whether it looks like one or not. Go's answer removes the second control flow from the language: errors ride returns, so there's exactly one flow to read.

The compound effect of small rules: multi-return makes the pair expressible; unused-variable checking means you can't grab the value while ignoring the error slot without WRITING your ignoring (_ is explicit); no finally/catch means the handling is inline, where the failure happened.

What reviewers actually do with this: read failure paths as first-class code. In a catch-based system, the handler is a paragraph elsewhere describing hypothetical failures; in Go, the handler is adjacent to the operation that can fail, with the state it needs (which file, which step) still in scope. Reviewers can see that os.ReadFile's failure is handled by wrapping with the path — because the path variable is right there.

The honest cost accounting, because interviews reward it: the verbosity is real, error wrapping is manual discipline (nothing forces %w over %v), and the check-shape repeats without abstraction. Go's position is that these costs buy total auditability — every failure path is in the diff. Whether that trade wins is the actual debate; knowing both sides is the answer.""",

("if-err-not-nil-pattern", "Should you check err after checking the result"): """The convention — zero values on failure — is a contract between every function and every caller, and the classic bug is violating the READ ORDER of that contract. The canonical demonstration is buffered IO:

```go
n, err := r.Read(buf)
total := n             // BUG: captured before knowing if n is valid
if err != nil {
    return total, err  // returns a value the docs may not promise
}
```
On failure, n is 0 for a fresh reader — or, for some implementations, a partially-valid count that the docs say to use... or don't. The caller can't know which without reading the specific API. The convention resolves this: DON'T read other returns until err is nil, UNLESS the API explicitly documents partial results.

io.Reader's Read is the exception that defines the rule — 'n bytes were successfully read before the error' is a documented, universal behavior, and code that handles Read errors is EXPECTED to process buf[:n] first. That's why you see:

```go
for {
    n, err := r.Read(buf)
    total += n          // LEGAL here: Read documents n-before-err
    if err != nil {
        break           // with the data already counted
    }
}
```
The io.EOF convention (n>0 with err==io.EOF is legal, and the read loop processes the data THEN exits) makes streaming possible — every bufio and io.Copy depends on it. So the deep rule: check err first by default; read the API docs when the failure itself carries usable data; and io.Read/Write are the two families where partial-data-plus-error is contractual, not accidental.""",

("if-err-not-nil-pattern", "What is the difference between returning err and wrapping"): """The choice is really about WHERE the reader's attention lands when something fails. A returned error's message chain reads top-down: the outermost wrap is the operation the caller attempted; each inner layer adds the context that layer had. That narrative structure is why wrapping with the right local facts is the default:

```go
// reads: 'start server: listen :8080: address already in use'
return fmt.Errorf("start server: %w", err)
```
versus passing raw, where the caller sees only 'address already in use' with no hint of what was being attempted. Same failure, different debugging cost.

The over-wrap anti-pattern has a signature: wrap messages that are pure ceremony. 'failed:', 'error:', 'operation failed:' add zero facts and the stack reads 'failed: failed: failed: address already in use' — the reader strips them mentally. The test: if your wrap text isn't a noun phrase or a fact (a file name, an operation, a step), it doesn't earn the line.

%w vs %v in the wrap is the other half of the discipline: %w preserves the chain so callers can Is/As; %v prints the same text but amputates the inspectability. Since no tooling warns %v-that-should-be-%w, it's convention — write %w by default, and reserve %v for terminal human-only formatting at the top of the program where no code will inspect below.""",

("if-err-not-nil-pattern", "What is the blank identifier's role"): """_ is the only way to opt out of a return value in Go, and its error-slot usage divides into three patterns of very different health:

1. `_, err := f()` — want the error only. Common and correct: existence checks, did-it-succeed calls. Nothing lost.

2. `v, _ := f()` — want the value only. The dangerous one. The error is gone at the moment it occurred; the zero value flows onward. The failure isn't handled — it's POSTPONED, to wherever the zero value misbehaves. That indirection is what makes these bugs hard: the crash site is three functions away from the cause site.

3. A bare `f()` — only legal when f returns nothing. When f returns an error, the call alone doesn't compile — Go requires the assignment shape for multi-return, which is precisely why _ exists: the language makes ignoring a DECISION — you type it.

That's the design insight: languages without this forcing function let failures disappear silently (unchecked exceptions, ignored return codes via lint-only warnings). Go makes ignore an explicit token at the exact line — so code review can catch it, linters can flag it, and the reader can ask 'why?'. The errcheck linter exists because reviewers asked it enough. The rule that survives review: every _ on an error slot carries a justifying comment — or it doesn't survive.""",

("if-err-not-nil-pattern", "Why does Go not use try/catch"): """The historical answer is specific: Go's designers (Pike, Thompson, Griesemer — all with deep Unix/C lineage) watched 20 years of C++/Java exception practice and concluded the cost wasn't the syntax, it was the semantics: exceptions make failure paths invisible and composition unpredictable.

The invisible-path problem: any call might throw anything. API surfaces can't say what fails; docs must. Callers can't locally reason; they must know the exception graph. Java's 'catch or declare' was the strongest enforcement ever tried — and it still left RuntimeException as the un-declared back door.

The unpredictable-composition problem: handlers interact with scope and cleanup in ways that make refactoring hazardous — moving a call across a try boundary changes which handler sees it, and destructors/finally interleave with unwinding in orders that surprise even experts.

Go's replacement is deliberately boring: errors ride return values, so the type system carries the failure surface, callers read it from the signature, and cleanup rides defer (which composes linearly — LIFO at scope exit, no unwinding interleaving). The result: every function is a contract you can read in one line. The cost — verbosity — was priced in consciously.

For interviews: acknowledge the trade honestly. 'Go chose visible ceremony over invisible control flow' is fair to both sides. The strongest counterpoint is Java's checked exceptions' unpopularity; the strongest rebuttal is Go's own error-wrapping evolution (errors.Is/As and %w were added BECAUSE bare returned errors were too weak for composition) — the design iterates toward usability while keeping the visibility.""",

("fmt-errorf", "%w vs %v in error messages"): """The printed output is byte-identical; the internal structure is completely different. It's worth seeing once what %v actually does to the cause:

%v calls the cause's Error() method AT FORMAT TIME and interpolates the string. The resulting wrapError holds your formatted text — the cause's message is now embedded characters, and the cause value itself was discarded after formatting. The chain ends: Unwrap() on the result has nothing to return.

%w stores the cause as a field. The message is built the same way (the cause's text appears identically), but the wrapError also implements Unwrap() -> cause. The errors package's Is/As walk that edge.

So the mental model: both verbs render the cause's MESSAGE; only %w preserves the cause's IDENTITY. Text vs identity is the whole difference — and every downstream question (Is this a DiskFull? What's the RateLimit's duration?) is an identity question. Answers that require identity need %w; answers satisfied by prose don't.

The migration trap: codebases that started %v-everywhere (or pre-1.13, before %w existed) have wraps that LOOK chainable but aren't. errors.Is through them is silently false. The audit is mechanical — grep for Errorf calls with %v and an err argument, and check each: terminal-format (fine) or chain-middle (should be %w).""",

("fmt-errorf", "Can you wrap multiple errors"): """errors.Join is the 1.20 answer to a pattern the community had already reinvented several times (hashicorp/go-multierror, the multierr libraries) — and the standard library's version has one API decision those didn't: it's an error, not an errors-collection API. You return it like any error; callers who don't care see one error with a newline-joined message.

The semantics that make Join correct (and hand-rolled versions subtly wrong):

- Is: joined matches a target if ANY component matches — callers still find sentinels inside batches.
- As: extracts the first component of the requested type — the caller gets typed data out of a many-failure return.
- Unwrap() []error: the Go 1.20 multi-edge — Is/As treat a []error unwrap as a branch, walking every branch. The subtle part older versions got wrong: walking a tree (Join of Joins) without double-visiting or missing branches. The stdlib's tree-walk is the tested one.

- nil handling: Join drops nil components, and Join() of all-nils returns nil — the builder pattern (collect errs, Join at the end) needs no guard.

When NOT to use it: sequential failure (step 2 didn't run because step 1 failed) — return the first error; joining implies 'all of these were attempted and failed,' which would be fiction. Join is for genuine parallelism: batch validation, fan-out requests, per-field form errors. The message shape tells the story: a Join prints as a list; a sequential chain prints as a narrative.""",

("fmt-errorf", "When should you add context with Errorf"): """The decision has a precise test, and it's about the READER's first question. When a caller sees an error from your function, the question is always 'what was happening?' — and the answer must be derivable from the error's chain. If your layer knows the answer and the chain doesn't carry it, wrap. If the chain already implies it, pass through.

The naming connection is the deep one: well-factored code needs LESS error context, because the function name carries it. `loadConfig()` returning a wrapped open-file error adds 'load config:' — but if the caller got that from calling loadConfig, they know that already. The wrap earns its line when the fact is otherwise invisible:

- a path the caller passed in (they know it — maybe skip)
- an INTERNAL path the caller never saw (they don't know it — wrap)
- which of several attempts failed (retry number, shard index — wrap)
- a value that matters to the failure (limit exceeded: N — wrap)

The read-aloud test: every segment should add a fact. 'failed, because: start server: listen :8080: address in use' — the 'failed because' segment never does.

Practical consequence: context belongs at the layer that HAS the fact, not the layer that noticed the failure. The deepest error knows the syscall; the top knows the operation; each layer adds its own fact and no one else's. That's how a well-wrapped chain reads like a debugging narrative without any layer guessing about others.""",

("fmt-errorf", "What does errors.Is do with a wrapped chain"): """Is is tree-walking identity comparison, and each clause deserves its own look.

IDENTITY: Is's default comparison is ==. errors.Is(err, target) walks the chain testing each node == target. For sentinel errors (single package-level values), == is exact: the pointer IS the sentinel's pointer. Is supports a second comparison channel: if the TARGET implements Is(error) bool, that method is consulted — this is how error types match as a CLASS (os.ErrNotExist matches various filesystem errors that aren't the same value but mean the same thing — their Is method says so).

THE WALK: Is follows Unwrap() error edges (linear chains — each fmt.Errorf %w adds one) AND Unwrap() []error edges (Join branches). The walk is depth-first; cyclic chains cause infinite loops (the errors package documents this — don't build cycles).

What the caller's code looks like, and why it composes:

```go
if errors.Is(err, context.Canceled) {
    return // client gave up — don't log as an error
}
if errors.Is(err, os.ErrNotExist) {
    return defaults() // the whole filesystem-family 'not exists' class
}
```
Neither check knows how many layers wrapped the error — that's the compatibility contract. Middle layers wrap freely with %w; boundary layers branch on identity through any wrapping depth. The sentinels stay matchable across package versions, refactorings of call depth, and third-party libraries in between. That indirection-proof matching is what made sentinel errors viable again post-1.13 — before Is, every == broke on the first wrap.""",

("custom-error-types-basics", "How do you create a custom error type"): """The moving parts are four, and each has a job:

The struct carries the DATA the caller will branch on — fields are the whole point. What fields? Ask what the caller's next line will be: RetryAfter for a rate limiter, Name for a lookup miss, Status for an HTTP layer. The struct is the caller's API into the failure.

The Error() method makes it an error — Go's structural typing means no registration, no inheritance; implement the one method and you're in the club. The message should render the fields (so logs are useful even where the caller doesn't use errors.As), but the fields are for code and the message is for logs — different audiences.

The pointer receiver serves two mechanics: identity (comparing *NotFoundError values — the As target matches by pointer) and nil-ness (a *NotFoundError variable starts nil). The convention: pointer, always — the ecosystem's As targets are written pointer-style, and consistency keeps the As patterns uniform.

The constructor is ordinary but deserves the standard shape:

```go
func NewNotFound(name string) error {
    return &NotFoundError{Name: name}
}
```
Returning error (not *NotFoundError) is the standard API choice: the caller sees the interface, uses errors.As when they need the fields, and your function signature stays the honest 'I can fail with various things.'

The pattern's economy: one struct, one method, one constructor — and the failure carries machine-readable data instead of prose. When a codebase's errors need MORE (codes, HTTP statuses, retryability), the extensions are methods on the same struct — the design extends without a rewrite.""",

("custom-error-types-basics", "How do callers inspect a custom error"): """errors.As is a two-phase tool, and each phase has a failure mode worth knowing.

Phase 1 — the walk: As follows Unwrap edges (linear and []error branches) like Is. It succeeds when it finds an error assignable to the TYPE of the target pointer's pointee. The chain may hold your type once, wrapped three layers deep — As finds it through all of them.

Phase 2 — the assignment: the found error is assigned into *target — the caller's variable now holds the concrete struct with its fields, and the branch proceeds.

The failure modes:
- Pointer mismatch: error stored as *NotFoundError, target is NotFoundError (or vice versa) — no match ever, compiles clean. The fix is the ecosystem convention: always pointer on both sides.
- Multiple types in the chain: As returns the FIRST match — if two layers wrapped with different types and both match, you get the outer one. Rare, but worth knowing when debugging 'wrong field values.'
- The target must be a non-nil pointer to a type implementing error — As panics otherwise. The var pattern (`var e *MyErr; errors.As(err, &e)`) is the safe shape.

When to use As vs Is: Is when the question is identity against a KNOWN value (a sentinel, a class representative). As when the question is about DATA — you need the fields. The practical ratio in real code: Is for control flow (is this retryable/cancelled/not-found), As when the handler uses failure details (log the name, sleep the duration, render the field).""",
}
