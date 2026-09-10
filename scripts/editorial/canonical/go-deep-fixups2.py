"""go-deep-fixups2.py — the 3 remaining custom-error deep dives."""

FIXUPS2 = {
"custom-error-types-basics": {
"Why define error types instead of using errors.New": """The decision is about what the CALLER can do next — and the progression from sentinel to type is the story of every maturing codebase.

Sentinel (errors.New): the caller gets identity — a bit. 'Was it ErrNotFound?' — branch on it. What the caller CANNOT do: ask which record, what status, how long. The sentinel's message is prose; parsing prose is the forbidden path (it couples the caller to your wording).

Type (struct + Error()): the caller gets identity AND data. errors.As extracts the struct; the fields are machine-readable facts. The caller's next line uses them: sleep target.RetryAfter, render target.UserMessage, log target.Name.

The forcing function in real code: the first time a caller NEEDS a fact the message carries. A retry wrapper that needs to know the backoff duration can't branch on ErrRateLimited — it needs the duration. An HTTP error renderer that needs the status code can't parse 'bad request' — it needs the number. That moment — 'the handler needs the failure's details' — is the migration point, and it arrives predictably: retry logic, error responses, metrics with labels, partial-failure reports.

The standard library's own fossils tell the story: os.ErrPermission (sentinel — 'permission denied' is a complete answer) beside os.LinkError (type — Op, Old, New fields, because 'which link, which end?' is the first question a caller of symlink code asks). Both exist because both are right — the question decides the tool. The interview version: sentinels answer WHAT, types answer WHAT AND THE DETAILS; pick by whether the caller's next action needs the details.""",

"Should custom errors be pointer or value receivers": """The pointer convention isn't style — it's what makes the As-matching machinery line up, and the mismatch is the classic silent bug.

The mechanics: errors.As(err, &target) walks the chain looking for an error assignable to the target's TYPE — the pointee of your pointer. A chain holding *NotFoundError (a pointer) matches a *NotFoundError target — the types agree. A value error (NotFoundError, no pointer) matches a value target. Cross them — pointer error, value target — and the assignability test fails for every node: *NotFoundError is not assignable to NotFoundError (different types), so As returns false forever. The code compiles (As takes any target), runs, and quietly never matches.

Why the ecosystem standardized on pointers:
- Methods on pointers are Go's default for anything with identity (every standard library error type: *os.LinkError, *net.AddrError, *time.ParseError — all pointers).
- The nil state: var target *NotFoundError starts nil — a clean 'not yet extracted' sentinel before As runs.
- Cheap passing: the error is one pointer wide, no matter the struct size.
- ONE convention beats two matched by discipline — every As is the same shape, and reviewers never check receiver-vs-target agreement.

The audit rule for a codebase mixing them: grep for value-receiver Error() methods — each is a latent As-mismatch for callers using the pointer idiom, or a signal the error was never meant for As. The fix is mechanical (add the star) but version-locked (value-errors in the wild change identity when converted) — which is why pointer-from-day-one is the cheaper habit.""",

"What is the error interface exactly": """The interface's minimalism is a design decision with consequences worth tracing:

type error interface {
    Error() string
}

ONE method means ANYTHING can be an error. A string wrapper (errors.New's *errorString), a formatted chain node (fmt.Errorf's *wrapError), your structs, a third-party HTTP error, a channel-closed sentinel — if it has Error() string, it flows through every return, every if err != nil, every errors.Is/As. No registration, no inheritance, no hierarchy to keep compatible. That's why error-returning code composes across packages that have never heard of each other.

But ONE method also means the interface itself carries NO structure: no chain, no cause, no code. Everything 'errors can do' beyond printing is PROTOCOL — optional methods the errors package probes for:

- Unwrap() error — chain edge. fmt.Errorf %w sets it; Is/As follow it.
- Unwrap() []error — branch edge (errors.Join); the tree-walk follows these too.
- Is(error) bool — custom class matching (os.ErrNotExist matches many filesystems' not-exist via this).

The errors package's Is/As are code that type-asserts for these methods. Your custom error participates in wrapping/matching to exactly the degree it implements the optional ones — a bare Error() struct is a fully valid error that Is/As see but can't see THROUGH.

That's the layered architecture: interface for universal compatibility, protocol for capability. Adding capability never breaks compatibility — old errors without the new methods simply don't offer the new behavior, nothing breaks. When you understand error as 'one method plus optional protocol,' the whole errors package stops being magic — it's plumbing over an interface any type can join.""",
},
}
