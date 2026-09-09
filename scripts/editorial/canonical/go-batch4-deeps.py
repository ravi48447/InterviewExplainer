"""go-batch4-deeps.py — the 12 missing Deep Dive sections for batch4's 3-tuples."""

DEEPS = {
("goroutine-vs-thread", 0): """The mechanical contrast, layer by layer:

Creation: a goroutine is a runtime bookkeeping entry — a struct with a stack pointer and state, linked into a scheduler queue. ~2KB of committed stack to start. A thread creation goes to the kernel: allocate kernel structures, a full stack region (megabytes), register with the scheduler — orders of magnitude more work and memory.

Switching: goroutine switches happen in userspace at scheduler points — channel operations, blocking calls, function-entry preemption checks. The switch is a few hundred bytes of register save/restore plus a stack pointer swap — no kernel transition, no address-space effects, cache still warm. Thread switches trap into the kernel: microsecond-scale, cache-flushing, bookkeeping-heavy.

Blocking: the Go runtime parks a goroutine at a channel send and the underlying thread moves on to another goroutine — the thread never idles. An OS thread that blocks on something without a non-blocking alternative parks in the kernel, doing nothing until woken.

Multiplexing: GOMAXPROCS goroutines run truly in parallel (that many threads busy); thousands more sit parked in queues costing only their stacks. That's the M:N shape: M goroutines over N threads, with the runtime (not the kernel) deciding the mapping — and having the information the kernel never has (which goroutines are waiting on which channels, which stacks can move).

The 100k-goroutine proof this all enables: 92ms wall time to spawn and complete 100,000 of them on one modest core-count box — under a microsecond each, most of it stack allocation. The same program with OS threads would hit ulimit and memory walls four orders of magnitude earlier.""",

("goroutine-vs-thread", 1): """Why three entities instead of two? Because the kernel thread (M) alone can't answer 'who runs next' — that's Go's job — and a global Go queue would serialize all scheduling on one lock. The P is the fix: a per-P local run queue means most scheduling decisions (push a new G, pop the next G) touch no shared lock at all — P-local, uncontended, fast. Only stealing and the global queue need coordination, and both are the cold path.

Walk the life of a G: created, pushed onto the current P's local queue. Some M holding that P pops and runs it. Three exits from 'running':

- Blocks on a channel: the G parks (into the channel's wait queue); the M picks the next G from its P. The M never left userspace scheduling.
- Blocks in a syscall: this G + its M dive into the kernel together. The runtime DETACHES the P — hands it to another M (from the runtime's spare-M pool, created on demand) so the rest of the P's queue keeps running. When the syscall returns, the original M re-acquires a P and continues.
- Yields / finishes: back to a queue; the M moves on.

Work stealing keeps the Ps balanced: a P with an empty local queue first checks the global queue (where long-waiting Gs go to prevent starvation), then steals half of some busy P's local queue. Net: no P starves while any other has work — the scheduler converges to full utilization without any central plan.

GOMAXPROCS bounds it: it's the number of Ps — the number of Ms simultaneously executing Go code — defaulting to the CPU count. One per core: the maximum useful parallelism; all the thousands of other Gs wait in queues, costing stacks, not cores.""",

("goroutine-vs-thread", 2): """Why 2KB is safe: Go's calling convention and runtime cooperate to make every stack frame inspectable. Each function's prologue (compiler-inserted) compares the stack pointer against the guard — the limit of the current stack block. Room enough: the call proceeds. Not enough: trigger growth.

Growth in detail: allocate a new block (double the size — amortized same reasoning as slice growth), copy the ENTIRE old stack into the new one (the deep-call frames included), then — the step that makes this possible and that C cannot do — fix up every pointer that pointed into the old stack: locals holding addresses of other locals, spill slots with pointer maps. The runtime knows exactly which words are pointers (the compiler emitted that map), so it can find and rewrite them all. Then the function's frame is re-entered on the new stack and execution continues as if nothing happened.

Why threads can't do this: C and most runtimes allow unrestricted pointers into the stack (address of a local escaping into a global). No metadata says which words in the stack are pointers — so no runtime can find the references to rewrite. Grow-in-place tricks (guard pages, jumping stacks) exist but are partial; the general solution is 'allocate enough at creation' — megabytes per thread.

The numbers that matter: 100k goroutines at ~2KB committed = ~200MB of stacks (and most never grow past the start — shallow handlers, parked waits). 100k OS threads at even 1MB = 100GB of address space reserved and tens of GB committed: the machine dies long before the program runs. The growth mechanism is what lets Go gamble on 2KB — the bet is that most goroutines never go deep, and the runtime only pays for the ones that do.""",

("goroutine-vs-thread", 3): """Why doesn't Go wait for goroutines at exit? Because 'wait for all' is undefined for real programs: servers have listener goroutines that never end, background pollers, caches. If main waited for every goroutine, most programs would never terminate — exit would require every goroutine to choose to finish. The design puts the exit decision where the structure is knowable: main, the goroutine that started everything, returns when ITS work is done.

What actually happens at the machine level: main returns → the runtime calls exit → the OS tears down the process — every thread, every goroutine's stack, in-flight writes, everything — in one process-level operation. There's no per-goroutine cleanup because the goroutines aren't independent processes; they're all one process's memory. The exit is atomic from the program's perspective.

The two sided exit story (the disciplined version):
- If the goroutine's work matters to the program's result: main joins it — WaitGroup.Wait() or a result channel — before returning. The program is correct by construction: exit happens after the needed work.
- If the goroutine's work must stop before exit: cancellation — the goroutine selects on ctx.Done() and returns; main cancels, waits (or sleeps grace-period), exits. Servers do this in Shutdown: stop accepting, cancel handlers, wait briefly, exit.

The failure shape in production: fire-and-forget goroutines writing output (log flusher, async writer). Tests are fast → goroutines win the race and finish → everything looks fine. Under load, main finishes its path while the writer is mid-write → process exits mid-flush → truncated logs, corrupted writes, at exactly the worst time (high load). The fix is never a sleep; it's making the join explicit — the goroutine's work was needed, so main waits for it.""",

("goroutine-vs-thread", 4): """The decision is a data-dependency question. Trace it:

Caller needs the result next line: the sequence is sequential — compute, then use. A goroutine adds a channel to hand back the result and a receive to wait for it: two extra moving parts producing the exact same sequence. The plain call wins on every axis — speed (no scheduling hop), readability (data flows through return values), correctness (no question of 'when is it done'). goroutine is the wrong tool.

Caller doesn't need the result — but the program does eventually: the correct shape is a channel and an explicit future. Don't fire the goroutine into the void; capture the join point (the channel) in the caller's structure, and wait at the point of use. This is 'async with a rendezvous later' — the goroutine is right, the discipline is keeping the join visible.

Caller never needs the result — fire-and-forget: this is where the questions live. A goroutine that runs unobserved needs: (1) a termination condition — loops need a cancellation path or they leak; (2) a failure path — a panic in an unobserved goroutine crashes the process (the goroutine-vs-thread question in this family): recover-at-the-boundary or the panic is your outage; (3) a reason to exist — if the caller skips it in tests and nothing changes, ask why it exists at all.

The code-review signature for each: a goroutine whose result is used on the next line — inline it. A channel created, sent to, received from all in the same function — the goroutine was sequential work wearing concurrency's clothes. A naked `go f()` with no join anywhere — the fire-and-forget triad above, each unanswered question a bug filed for later.""",

("closing-channels", 2): """Why panic on the second close, mechanically: close(ch) is not idempotent because the closed flag is a state transition, not a set operation. The first close sets the flag and wakes the waiters. The second close finds the flag set — and now the operation is being invoked on a channel whose state it already produced. Two interpretations exist: 'redundant no-op' or 'contract violation'. Go chose violation because a second close is ALWAYS a second owner believing they held the lifecycle — the exact ownership confusion the close discipline exists to prevent. Silent no-op would let that bug live forever; panic puts a stack trace at the second closer's feet.

The three channel panics as one family:
- close of closed channel — two owners.
- send on closed channel — a sender that missed the shutdown.
- (the contrast case) receive on closed channel — graceful, because receiving is observing, and observation can't corrupt.

The design principle, stated once: channel operations that mutate the channel's lifecycle contract panic on violation; operations that merely observe degrade gracefully. That's why the panic cases cluster on the producer side — lifecycle is producer territory, and producer-side bugs are the ones that corrupt consumers.

The fix pattern for double-close-shaped code: never write close in a branch. The lifecycle close lives in exactly one place — `defer close(ch)` at the top of the single owner function — so the path count through the close is exactly one. Multiple close calls in different branches is the same bug as multiple owners, just syntactically hidden.""",

("closing-channels", 4): """The tombstone-behind-the-queue structure is worth seeing mechanically because it explains everything:

close(ch) does NOT touch the ring buffer. It: takes the lock, sets closed=1, wakes every parked receiver. That's all. The buffered values — already committed copies sitting in the ring — are untouched. A receiver arriving after close follows the SAME path as before: check the ring; values there → deliver (ok=true). Ring empty → NOW consult the closed flag: closed → return zero, false. The tombstone is logically AT THE END of the queue — the position after the last buffered value.

That's why no value sent-before-close is ever lost: the value's delivery path doesn't check the closed flag at all — only emptiness does. Delivery is FIFO past the tombstone, guaranteed.

The unbuffered comparison: with no ring, 'empty' is always true, so every receive after close goes straight to the flag — end-signal immediately, first receive. Verified in the earlier executed demo: buffered gave (10, true) then (0, false); unbuffered gave (zero, false) on the first receive.

The composition into pipelines — the reason this property matters at scale: stage A does defer close(out). Stage B's range receives everything A sent (drain), then the end, then B's own defer close(out) fires. Termination cascades downstream at exactly the speed the data drains — each stage's exit is 'all my input, then the close, then I close my output'. A pipeline of N stages shuts down in N sequential drains with zero dropped values — the property that makes building pipelines out of channels safe to do casually.""",

("range-over-channel", 0): """The mechanics under the loop, once, because everything about range-over-channel follows from it: each iteration is a receive. The receive blocks until a value arrives (or the channel is closed-and-drained). ok=true → body runs with the value. ok=false → loop exits. Range doesn't 'know' about close as a special event — it sees exactly what a comma-ok receive sees: values, then the end-signal.

Which means range's termination depends ENTIRELY on the close discipline: an open channel that goes quiet just blocks the range at its next receive — the goroutine parks, forever, in the channel's wait queue. The range is patient to a fault; it will out-wait the program.

The pairing idiom that makes this safe — producer owns the close, defer at the top:

```go
func produce(out chan<- int) {
    defer close(out)
    // any number of sends, any exit path
}
```

Because the close is deferred, it fires on EVERY return — early exit, error return, panic-recover, natural completion. The downstream range terminates in all cases. Without the defer (close at the 'end'), an early return path skips it — the range hangs — and that bug is invisible in tests (the happy path closes) and fatal in production (the error path hangs the consumer).

Where range is the wrong tool: any exit condition OTHER than the channel's end. Early termination (break), multiple channels (select), timeouts (select+time.After), per-receive branching beyond processing — the explicit for+comma-ok loop states those visibly. Range is the one-shape consumer: single channel, run-to-completion, trust the producer's close.""",

("range-over-channel", 1): """The break leaves the channel open — and what happens next is a cross-goroutine question, not a loop question. Trace the two topologies:

Unbuffered, sender mid-send: the sender parked in the channel's send queue stays parked. Your range's receive was its rendezvous; you left before the meeting. That goroutine is leaked — holding its stack, its closure references, whatever it captured — until the channel itself is unreachable, which your break may prevent (if the caller keeps the channel variable, the parked sender is permanent). Memory monitors show it as a goroutine stuck on 'chan send'.

Buffered, sender mid-send: your break leaves buffered values unconsumed. Subsequent sends fill the ring to capacity, then park the sender — the leak again, just N sends later. The unconsumed values die with the channel (GC), which is fine; the parked SENDER is the leak.

The cancellation pattern completes the protocol: done := make(chan struct{}); close(done) is a broadcast — every sender selecting on it wakes and returns. That's why done channels (and context.Context, which IS a done channel with plumbing) exist: break answers 'stop receiving'; close(done) answers 'stop sending'. Both sides need both signals for a clean early exit — the consumer's break plus the producer's observation of done is the minimal complete teardown.

One subtlety: close(done) before break vs after. Close first, then break: the producer may send one more value into the buffer after your close (racing its select) — harmless, you're leaving. Break first: the producer might block on an unbuffered send before observing done — leaked until it checks. Order: close(done), then break — the producer's exit path is guaranteed reachable.""",

("range-over-channel", 2): """The equivalence, mechanically: the compiler's desugaring of range-over-channel is (modulo details) the explicit comma-ok loop. Every semantic of one is a semantic of the other — close termination, buffered-value drain, blocking on empty, nil-channel blocking forever. There is no behavior you can ONLY get with one.

The differences are all in expression power:
- range can't see ok — the loop body has the value only. When you need the closed-vs-open state at the receive site (you don't — ok=false IS the exit), no loss.
- range can't select — one channel, period. Multiple sources, timeouts, cancellation: select inside a for{} loop, which is the 'coordinator consumer' pattern: for { select { case v := <-chA: ...; case v := <-chB: ...; case <-ctx.Done(): return } }.
- range CAN break — from inside the body — which gives it early exit; just less visibly than a for loop's condition.

The readability rule that falls out: range says 'drain this source to its end'. A reader sees range and knows the shape: single upstream, all values, then done. A for+comma-ok says 'custom termination' — the reader immediately looks for the ok-check and whatever else the loop does. Both are honest signals; misleading ones are: a range with a break that does 90% of the exiting (pretends to be drain, isn't), and a for+comma-ok that is exactly the drain idiom (should be range). Write the form that tells the reader the truth about the loop's exit conditions.""",

("range-over-channel", 3): """The executed demo is the whole mechanism:

```go
ch := make(chan int, 3)
ch <- 1; ch <- 2; ch <- 3
close(ch)
for v := range ch { fmt.Println(v) }   // 1, 2, 3 — then exits
```

Three values print. The close never truncates. Why, mechanically: the range's receives check the ring FIRST — values present → deliver, ok=true, body runs. The closed flag is consulted only when the ring is empty. The close is positioned after the last value in the total order of the channel's events — FIFO of sends, then the tombstone — and the range walks that order exactly.

What this guarantees, precisely: every value that completed its send before the close is delivered to some receiver before any (zero, false) result. 'Completed its send' = the send returned (unbuffered: receiver took it; buffered: it's in the ring). No delivered-value-after-close-result, no skipped values. That's a happens-before chain the runtime maintains per channel — the same ordering that makes channels a synchronization primitive.

The pipeline shutdown cascade this enables — the reason defer-close-at-producer is the universal pattern: stage A closes; stage B's range drains A's buffer, sees the end, exits; B's own defer close fires; stage C drains B... termination propagates strictly downstream of the data. The pipeline ends in the same order the data flowed: nothing dropped, nothing hanging — the composition of 'tombstone-behind-queue' at every stage boundary.""",

("range-over-channel", 4): """The nil-channel rules, applied to range: a receive on nil blocks forever — range's FIRST receive blocks forever — the goroutine parks in the nil channel's (nonexistent) wait queue, permanently. The loop body never runs; there's no iteration count, no timeout, no error — just a parked goroutine with a stack showing the receive.

The diagnostic: runtime goroutine dump (pprof's goroutine profile, or SIGQUIT's dump) shows the goroutine blocked on 'chan receive' with the channel argument nil — the stack trace's frame shows the nil. That's the one way this bug identifies itself: it never self-heals, never crashes (unless it's the last runnable goroutine — then deadlock detector), just leaks.

How the nil reaches the range — the real-world patterns:
- Declared, never made: var results chan Result; go produce(results); for r := range results — producer blocks on its nil send, consumer blocks on its nil receive: two leaks, mutually invisible.
- A channel field in a struct not initialized by a constructor that half the code paths use: works in tests (the constructor path), hangs in production (the other path).
- A nil channel deliberately passed (select-disabled idiom) that someone ranges instead of selects: the trick doesn't transfer — nil disables a select CASE; it permanently parks a range.

The fix is the discipline the channel-creation question established: channels are born from make — at declaration, in a constructor, or immediately before use — and a struct holding a channel initializes it in ONE place every path passes through. A channel field that can be nil is a struct with an unset lifecycle: finish the construction.""",

("range-over-channel", 3): """The ordered demo IS the semantics:

ring: [1, 2, 3]; closed: true. range receives 1 (ok true), 2 (ok true), 3 (ok true), then (zero, false) → exits. The value-close order is: all sends that happened-before close, then close. The range observes that exact order.

The alternative designs and why Go rejected them:
- close-clears-the-buffer: loses in-flight data; every producer would need an external flush signal; pipelines would need acknowledgment protocols. Unacceptable.
- close-blocks-further-receives (close = channel dead, unreadable): receivers couldn't drain — every close would strand the tail; consumers would need to poll length (which is racy) before close. Worse.
- The tombstone: zero added operations at close (set flag, wake), natural FIFO preservation, receivers keep receiving until data runs out — the minimal correct design. Every other channel behavior (comma-ok, range termination) derives from it.

The invariant stated for review: after close(ch) returns, the channel is a finite, immutable-in-length queue: its remaining deliveries are exactly the values already buffered, in order, then the permanent end-signal. No send can add (panics), no receive can skip or reorder. That's the contract — and the reason a pipeline's defer close is both a termination signal AND a guarantee that everything sent was delivered: two properties from one flag.""",
}
