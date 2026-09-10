#!/usr/bin/env python3
"""Replace answer.sections for Q5-Q9 in complete-qa.json with Z3+Z2+Z1 content."""

import json
import pathlib
import re

CB = "```"
FILE = pathlib.Path(__file__).parent / "complete-qa.json"


def wc(text: str) -> int:
    return len(re.findall(r"\S+", text))


# ═══════════════════════════════════════════════════════════════════
#  Q5  design-connection-pool-manager-java   complexity 4 (800-1100)
# ═══════════════════════════════════════════════════════════════════

Q5_SECTIONS = [
    # ── Z3 overview ──────────────────────────────────────────────
    {
        "type": "overview",
        "title": "The 30\u201350ms Tax on Every Query \u2014 Why Pools Exist",
        "content": f"""\
Every database query begins with a hidden cost that never shows up in \
your SQL explain plan. Opening a fresh JDBC connection requires a TCP \
three-way handshake, TLS negotiation, and server-side authentication \
\u2014 together consuming 30\u201350\u2009ms before the first byte of your actual \
query travels the wire. At 100 concurrent requests, that means 100 \
simultaneous TCP sessions all performing credential exchange in \
parallel, and most PostgreSQL or MySQL instances cap \
`max_connections` between 100 and 500.

Once that ceiling is hit, new requests are not just slow \u2014 they are \
**rejected outright** with a \u201ctoo many connections\u201d error. The \
application does not degrade gracefully; it falls off a cliff. This \
is the problem connection pooling solves.

A pool maintains a bounded set of pre-authenticated connections. \
Callers borrow one, execute their query, and return it. The pool \
enforces three invariants: **bounding** ensures the database\u2019s \
connection limit is never exceeded, **health validation** ensures no \
dead connection reaches a caller, and **leak detection** finds code \
paths that borrow but never return. Understanding how HikariCP \u2014 \
the default pool in Spring Boot \u2014 implements these three invariants \
with a `ConcurrentBag` and thread-local affinity is what separates a \
surface-level answer from a strong one.""",
    },
    # ── Z3 step 1 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "How a Semaphore and LIFO Stack Prevent Connection Exhaustion",
        "content": f"""\
The core data structure pairs a **Semaphore** for capacity control \
with a **ConcurrentLinkedDeque** as the idle-connection stack. The \
semaphore initializes to `maxPoolSize` and acts as a distributed \
permit counter \u2014 every `borrow()` call acquires a permit, and every \
`release()` returns one. When all permits are taken, the next caller \
blocks until a connection comes back or the configured timeout \
expires, producing a clear `SQLException` rather than a silent hang.

The idle stack uses **LIFO ordering** deliberately. When a connection \
is returned, it goes to the front of the deque. The next borrow \
takes from the front, getting the most recently used connection. \
This keeps hot connections warm in TCP send buffers and OS socket \
caches. Connections at the back sit idle longest and naturally age \
out, allowing the pool to shrink during low-traffic windows without \
any explicit shrink logic.

The implementation wraps raw JDBC connections in a \
`PooledConnection` that tracks a checkout timestamp for leak \
detection. The borrow method ties semaphore acquisition, health \
checking, and timestamp recording into a single call path that \
either succeeds or throws a meaningful exception.

{CB}java
public Connection borrow() throws SQLException {{
    if (!permits.tryAcquire(timeoutMs, TimeUnit.MILLISECONDS)) {{
        throw new SQLException(
            "Pool exhausted \u2014 waited " + timeoutMs + "ms");
    }}
    PooledConnection pc = idle.pollFirst();
    if (pc == null || !pc.getRawConnection().isValid(5)) {{
        if (pc != null) pc.closeQuietly();
        pc = new PooledConnection(
            DriverManager.getConnection(url, props));
    }}
    pc.markBorrowed(System.nanoTime());  // leak-detection timestamp
    active.add(pc);
    return pc.getRawConnection();
}}
{CB}

The `tryAcquire` with timeout converts an unbounded wait into an \
actionable failure. Without it, threads pile up silently during \
connection exhaustion and the only symptom is a frozen application \
\u2014 no error in any log.""",
    },
    # ── Z3 step 2 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Health Checks That Catch Dead Connections Before Callers Do",
        "content": """\
A connection sitting idle for two minutes can die without warning. \
**Firewalls** drop inactive TCP sessions after their own timeout, \
databases kill idle backends when `wait_timeout` expires, and \
network partitions sever the socket without sending a FIN packet. \
Handing a dead connection to a caller means their first query fails \
with a `CommunicationLinkFailure` instead of executing normally.

Three **validation strategies** address this at different points in \
the lifecycle. Test-on-borrow calls `connection.isValid(5)` before \
every handout \u2014 safe, but adds a network round-trip to the borrow \
path. Test-while-idle runs a background `ScheduledExecutorService` \
that sweeps idle connections every 30 seconds and evicts those that \
fail validation, keeping the borrow path clean. Max-lifetime \
eviction closes every connection older than a configurable duration \
regardless of health, preempting firewall kills before they happen.

HikariCP combines all three by default. It validates on borrow with \
a fast 500\u2009ms `isValid` check, runs an idle evictor at \
`idleTimeout` intervals (default 10 minutes), and enforces \
`maxLifetime` of 30 minutes. The **max-lifetime** strategy is \
especially valuable after a database failover \u2014 it forces connection \
rotation so traffic redistributes across replicas within 30 minutes \
instead of staying pinned to the old primary.

**Leak detection** tracks the `borrowedAt` nanosecond timestamp on \
each `PooledConnection`. A background thread scans the `active` set \
every few seconds and logs a warning with the **borrowing thread\u2019s \
full stack trace** for any connection held longer than \
`leakDetectionThreshold`. This is how you find the missing `finally` \
block in a legacy codebase. HikariCP defaults this threshold to zero \
(disabled), but setting it to 30 seconds in staging environments \
catches leaks before they reach production.""",
    },
    # ── Z3 step 3 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Why pool-size = (cores \u00d7 2) + spindles \u2014 and What HikariCP Does Differently",
        "content": """\
Most teams set pool size to 50 or 100 and never revisit it. This is \
almost always wrong, and **oversizing hurts more than undersizing**. \
Each connection consumes a backend process on the database server \u2014 \
memory for sort buffers, parse trees, and session state. More \
connections mean more OS context switching, more lock contention \
inside the database engine, and paradoxically lower throughput than a \
smaller pool would deliver.

The PostgreSQL wiki documents a formula validated across workloads: \
**connections = (CPU cores \u00d7 2) + effective_spindle_count**. For a \
4-core server with SSD storage (effectively 1 spindle), the optimal \
pool is 9 connections. A 16-core machine with NVMe needs only 33. \
Teams running 200-connection pools on an 8-core database are \
creating contention that dwarfs any benefit from connection reuse.

HikariCP\u2019s performance edge comes from its **ConcurrentBag** data \
structure. Instead of a shared `BlockingQueue` or `Deque` that every \
thread contends on, the ConcurrentBag gives each thread a \
**thread-local list** of recently used connections. When `borrow()` \
is called, the thread checks its own list first \u2014 if a connection is \
available, no CAS operation or lock is needed at all. Only when the \
thread-local list is empty does it fall back to the shared bag, \
which uses a lock-free state machine with three states: \
`NOT_IN_USE`, `IN_USE`, and `REMOVED`.

This thread-local affinity is what makes HikariCP achieve \
**sub-microsecond borrow latency** in benchmarks. Production \
monitoring should expose `active`, `idle`, `pending`, and \
`totalConnections` as Micrometer gauges. The critical alert is \
`pending > 0` sustained for more than 2 seconds \u2014 that signals pool \
exhaustion before users see request timeouts.""",
    },
    # ── Z1 key_points ────────────────────────────────────────────
    {
        "type": "key_points",
        "title": "Key Points",
        "content": (
            "- **Semaphore(maxPoolSize) with tryAcquire timeout** \u2014 "
            "converts silent thread pileup into an explicit SQLException; "
            "without it, pool exhaustion manifests as a frozen application "
            "with no error in any log\n"
            "- **LIFO idle stack** \u2014 most-recently-returned connection is "
            "borrowed next, keeping TCP buffers warm; tail connections age "
            "out naturally so the pool self-shrinks during low traffic\n"
            "- **Three validation layers: borrow, idle-sweep, max-lifetime** "
            "\u2014 test-on-borrow catches dead connections at checkout; "
            "max-lifetime at 30 minutes forces rotation and preempts "
            "firewall idle-timeout kills\n"
            "- **Leak detection via borrowedAt timestamp** \u2014 background "
            "thread logs the borrowing thread\u2019s stack trace when hold time "
            "exceeds threshold; this is how you find the missing finally "
            "block\n"
            "- **pool-size = (cores \u00d7 2) + spindle_count** \u2014 oversizing "
            "increases database lock contention and context switching; "
            "HikariCP\u2019s ConcurrentBag adds thread-local affinity to "
            "eliminate CAS contention on the shared pool"
        ),
    },
    # ── Z2 speakable_answer ──────────────────────────────────────
    {
        "type": "speakable_answer",
        "title": "How to Answer This Verbally",
        "content": """\
The core problem is connection creation cost \u2014 TCP handshake, TLS, \
and authentication take 30\u201350\u2009ms per connection, and databases cap \
`max_connections` low enough that creating on demand fails under \
load. A pool pre-creates and reuses connections to amortize that \
cost to near zero.

The design has three parts. **Bounding** uses a Semaphore \
initialized to `maxPoolSize` \u2014 every borrow acquires a permit with \
a timeout, so pool exhaustion produces a clear exception instead of \
a silent hang. Idle connections live in a **LIFO deque** \u2014 returning \
to the front means the next borrow gets the warmest connection, and \
connections at the back age out naturally.

**Health validation** is where most naive implementations fail. A \
connection idle for minutes can be killed by firewalls or database \
timeouts. I validate with `connection.isValid()` on borrow, run a \
background idle-sweep every 30 seconds, and enforce a `maxLifetime` \
of 30 minutes to preempt kills entirely. That third strategy also \
forces connection rotation after failovers, which is a detail \
production teams learn the hard way.

**Leak detection** records a `borrowedAt` timestamp on checkout. A \
background scanner logs the borrowing thread\u2019s stack trace when hold \
time exceeds a threshold \u2014 that is exactly how you find the missing \
`finally` block in a legacy codebase.

For pool sizing, I follow the PostgreSQL formula: **cores \u00d7 2 + \
spindle count** \u2014 typically 9\u201310 for a 4-core machine. Oversizing \
actually hurts throughput because each connection adds database-side \
memory and lock contention. In production I always use HikariCP, \
which adds thread-local affinity through its ConcurrentBag for \
sub-microsecond borrows.""",
    },
]


# ═══════════════════════════════════════════════════════════════════
#  Q6  design-pubsub-event-bus-java          complexity 3 (650-900)
# ═══════════════════════════════════════════════════════════════════

Q6_SECTIONS = [
    # ── Z3 overview ──────────────────────────────────────────────
    {
        "type": "overview",
        "title": "The Memory Leak Hiding Inside the Observer Pattern",
        "content": """\
When modules inside a monolith communicate through direct method \
calls, every caller compiles against the callee\u2019s interface. \
Refactoring one module ripples into every module that imports it. An \
in-process event bus breaks this coupling \u2014 publishers fire events \
into a central registry and subscribers receive them without knowing \
who published. This is the Observer pattern elevated to an \
application-level communication backbone.

The trap that catches most implementations is **subscriber \
lifecycle**. A subscriber registers a callback, and the bus holds a \
strong reference to it. When that subscriber is later removed from \
the application \u2014 a Spring bean destroyed during a scope change, a \
plugin unloaded \u2014 the bus\u2019s reference prevents garbage collection. \
Over hours or days in a long-running JVM, this becomes a **slow \
memory leak** that does not crash immediately but gradually consumes \
heap until a full GC pause or an `OutOfMemoryError` surfaces.

Guava\u2019s `EventBus` solved this with `@AllowConcurrentEvents` and \
configurable subscriber management; building your own reveals the \
concurrency and lifecycle decisions hidden behind that API.""",
    },
    # ── Z3 step 1 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Type-Safe Registry \u2014 Why Subscribe Returns a Token, Not Void",
        "content": f"""\
The registry maps event types to subscriber lists using a \
`ConcurrentHashMap<Class<?>, CopyOnWriteArrayList<Subscription<?>>>`. \
This pairing is deliberate \u2014 **CopyOnWriteArrayList** is optimized \
for workloads where reads vastly outnumber writes, which matches \
event buses perfectly: subscriptions change at startup and shutdown, \
but every `publish()` iterates the full subscriber list.

The `subscribe()` method accepts a `Class<E>` and a `Consumer<E>`, \
returning a `Subscription<E>` token. Generics on the method \
signature enforce **compile-time type safety**, so subscribing to \
`OrderCreated.class` produces a handler that only accepts \
`OrderCreated` events. The returned token serves as the unsubscribe \
handle \u2014 callers keep it and pass it back to `unsubscribe()` during \
teardown. This avoids the messy alternative of matching lambda \
references for deregistration, which is effectively impossible with \
anonymous lambdas.

Publishing dispatches each subscriber to an `ExecutorService` \
wrapped in a try-catch for **error isolation**. This pattern ensures \
a single failing subscriber never blocks the publisher thread or \
prevents other subscribers from receiving the event.

{CB}java
public <E> void publish(E event) {{
    var subs = registry.get(event.getClass());
    if (subs == null) return;
    for (Subscription<?> sub : subs) {{
        executor.submit(() -> {{
            try {{
                ((Consumer<E>) sub.handler()).accept(event);
            }} catch (Exception ex) {{
                log.warn("Subscriber failed for {{}}",
                    event.getClass().getSimpleName(), ex);
            }}
        }});
    }}
}}
{CB}

Each subscriber runs in its own task on the thread pool. If one \
throws an exception, the catch logs the failure and execution \
continues for every remaining subscriber \u2014 the publisher\u2019s thread \
is never blocked.""",
    },
    # ── Z3 step 2 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Event Hierarchy \u2014 Why Publishing a Subtype Should Notify Parent Listeners",
        "content": """\
The implementation above uses **exact-type matching** \u2014 publishing \
an `OrderCreatedEvent` notifies only subscribers registered for \
`OrderCreatedEvent`, not subscribers listening for its parent \
`DomainEvent`. In practice, teams often want a catch-all listener \
that receives every event for logging or auditing. Supporting this \
requires walking the class hierarchy at publish time.

The publish method checks the event\u2019s class, then its superclass, \
then its superclass\u2019s superclass, all the way up to `Object`. For \
each class in the chain, it dispatches to any registered \
subscribers. Guava\u2019s EventBus does exactly this, caching the type \
hierarchy per event class to avoid reflective `getSuperclass()` \
calls on every publish.

The trade-off is **ambiguity with interfaces**. If \
`OrderCreatedEvent` implements both `Auditable` and `Serializable`, \
should subscribers of `Auditable` receive it? Spring\u2019s \
`ApplicationEventPublisher` says yes \u2014 it resolves the full \
hierarchy plus all implemented interfaces. A simpler event bus \
typically sticks to class hierarchy only and documents this \
boundary. Whichever choice you make, the interviewer wants to hear \
that you thought about it and made a deliberate decision rather than \
discovering the gap when a listener mysteriously stops receiving \
events.""",
    },
    # ── Z3 step 3 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Dead Subscribers and Slow Subscribers \u2014 Two Production Traps",
        "content": """\
The memory leak from strong subscriber references has two solutions \
with different trade-offs. The **explicit approach** requires every \
subscriber to call `unsubscribe()` in a teardown hook \u2014 a \
`@PreDestroy` method in Spring, or a `close()` in a \
try-with-resources block. This is reliable but demands discipline \
from every team that registers a subscriber.

The **WeakReference approach** wraps each subscriber\u2019s `Consumer` in \
a `WeakReference`. When the subscriber object is garbage-collected, \
the reference is automatically cleared. The publish loop checks each \
reference before dispatching and evicts nulled entries on the fly. \
The downside is that subscribers can disappear unpredictably between \
GC cycles, making debugging harder. Guava chose the explicit route; \
most custom implementations default to explicit unsubscribe with \
weak references as an opt-in mode.

**Backpressure** is the other production concern. If a subscriber is \
slow and events arrive faster than it can process them, the \
`ExecutorService`\u2019s task queue grows unbounded toward an \
`OutOfMemoryError`. The fix is a bounded `LinkedBlockingQueue` on \
the thread pool with a `RejectedExecutionHandler` that logs and \
drops events. Losing an event is better than crashing the JVM. For \
testing, inject a **same-thread executor** (`Runnable::run`) so all \
delivery is synchronous and assertions are deterministic.""",
    },
    # ── Z1 key_points ────────────────────────────────────────────
    {
        "type": "key_points",
        "title": "Key Points",
        "content": (
            "- **ConcurrentHashMap + CopyOnWriteArrayList** \u2014 COWAL is "
            "ideal when subscriptions are set once at startup but iterated "
            "on every publish; mutations copy the array, reads never lock\n"
            "- **Subscription token for unsubscribe** \u2014 `subscribe()` "
            "returns an opaque token instead of requiring callers to match "
            "lambda references, which is impossible with anonymous lambdas\n"
            "- **WeakReference subscriber cleanup** \u2014 prevents memory "
            "leaks when subscribers are garbage-collected without explicit "
            "unsubscribe, but makes subscriber lifetime unpredictable "
            "between GC cycles\n"
            "- **Event hierarchy dispatch via getSuperclass() walk** \u2014 "
            "a `DomainEvent` listener receives all subtypes; cache the "
            "hierarchy per class to avoid per-publish reflection overhead\n"
            "- **Bounded executor queue with drop policy** \u2014 prevents "
            "slow subscribers from causing OOM; inject `Runnable::run` "
            "executor in tests for synchronous deterministic delivery"
        ),
    },
    # ── Z2 speakable_answer ──────────────────────────────────────
    {
        "type": "speakable_answer",
        "title": "How to Answer This Verbally",
        "content": """\
The event bus is a `ConcurrentHashMap` keyed by event `Class<?>`, \
mapping to a `CopyOnWriteArrayList` of subscriber callbacks. COWAL \
works perfectly here because subscriptions change rarely but are \
iterated on every publish \u2014 reads never lock.

`subscribe()` takes a typed `Class<E>` and `Consumer<E>`, returning \
a **Subscription token** for later unsubscribe. This is cleaner than \
matching lambda references, which is effectively impossible with \
anonymous lambdas. Publishing iterates subscribers and dispatches \
each to an `ExecutorService` inside a try-catch, so one failing \
handler never blocks the publisher or kills other subscribers.

Two production concerns make the difference. First, **subscriber \
lifecycle** \u2014 if the bus holds strong references, subscribers that \
are removed from the application but not explicitly unsubscribed \
leak memory slowly. The fix is either explicit `unsubscribe()` in \
`@PreDestroy` hooks or wrapping handlers in `WeakReference` for \
automatic GC cleanup. Second, **backpressure** \u2014 if a subscriber is \
slow, the thread pool queue grows toward OOM. A bounded queue with a \
drop-and-log rejection policy is safer than unbounded growth.

For hierarchy dispatch, walking `getSuperclass()` at publish time \
lets a `DomainEvent` listener receive all subtypes. Cache the \
hierarchy to avoid reflection on every call. In practice, I prefer \
the explicit unsubscribe model over weak references because it keeps \
subscriber lifetime predictable and debuggable.""",
    },
]


# ═══════════════════════════════════════════════════════════════════
#  Q7  design-in-memory-kv-store-ttl-java    complexity 4 (800-1100)
# ═══════════════════════════════════════════════════════════════════

Q7_SECTIONS = [
    # ── Z3 overview ──────────────────────────────────────────────
    {
        "type": "overview",
        "title": "The Silent Memory Leak in Lazy-Only Expiration",
        "content": """\
Most developers implement TTL expiration by checking the timestamp \
on every `get()` \u2014 if the key has expired, delete it and return \
null. This **lazy expiration** is simple and correct for keys that \
are actually read. The problem is keys that are written once and \
never read again. A session store where users abandon their \
sessions, a cache where keys change before the old value is ever \
fetched, a feature-flag store that accumulates stale entries \u2014 all \
of these silently grow memory because lazy expiration only fires on \
access.

The naive alternative \u2014 scheduling a `TimerTask` per key \u2014 swings \
to the opposite extreme. With a million keys, that is a million \
`TimerTask` objects consuming heap and a million entries in the \
timer\u2019s internal priority queue, regardless of whether those keys \
are anywhere near expiration.

Production systems like **Redis** solve this with a hybrid. Lazy \
expiration handles every read. A background loop samples a random \
subset of keys, deletes expired ones, and adaptively repeats if \
expiration pressure is high. The combination bounds memory without \
requiring per-key timers. This dual strategy is what the interviewer \
expects you to describe when they ask about TTL design.""",
    },
    # ── Z3 step 1 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Why Absolute Timestamps Beat Relative TTL",
        "content": f"""\
The store uses a `ConcurrentHashMap<K, Entry<V>>` where each \
`Entry` is a lightweight record wrapping the value and an \
`expiresAt` timestamp in epoch milliseconds. When `put()` is called \
with a TTL, the entry records `System.currentTimeMillis() + ttlMs` \
as the deadline. The `get()` method checks this timestamp before \
returning \u2014 if the current time is past `expiresAt`, the entry is \
considered expired.

The key design decision is storing **absolute expiration times** \
rather than relative TTLs. An absolute timestamp makes the \
expiration check a single comparison (`now >= expiresAt`) rather \
than requiring arithmetic on every read. It also makes the active \
cleaner\u2019s job simpler \u2014 it can compare timestamps directly without \
tracking when each key was written.

The `put()` method uses `ConcurrentHashMap.put()` which atomically \
replaces any existing entry. If a key is re-written with a new TTL, \
the old entry is overwritten and the new deadline takes effect \
immediately without needing to cancel a timer or modify a scheduled \
task. This simplicity is a major advantage over the per-key-timer \
approach.

{CB}java
private record Entry<V>(V value, long expiresAt) {{
    boolean isExpired() {{
        return System.currentTimeMillis() >= expiresAt;
    }}
}}

public void put(K key, V value, long ttlMs) {{
    long deadline = System.currentTimeMillis() + ttlMs;
    store.put(key, new Entry<>(value, deadline));
}}

public V get(K key) {{
    Entry<V> entry = store.get(key);
    if (entry == null) return null;
    if (entry.isExpired()) {{
        store.remove(key, entry);  // two-arg CAS remove
        return null;
    }}
    return entry.value();
}}
{CB}

The two-argument `store.remove(key, entry)` in the `get()` method \
is critical for correctness, and the next section explains why.""",
    },
    # ── Z3 step 2 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "The Race Condition That Deletes Fresh Data",
        "content": """\
The `get()` method checks expiration and then deletes the entry. \
Between those two operations, another thread can `put()` a fresh \
value for the same key. If `get()` uses the single-argument \
`remove(key)`, it deletes the **new** entry that Thread B just \
wrote \u2014 silently destroying fresh data that has not expired.

The fix is `ConcurrentHashMap.remove(key, expectedValue)` \u2014 the \
**two-argument CAS form** that only removes the entry if the current \
value is the exact object we checked. If another thread replaced it \
with a new entry between our read and our delete, the remove is a \
no-op. This is the single most common concurrency bug in hand-rolled \
cache implementations, and it is the detail that tells an \
interviewer you have actually built one.

The same CAS pattern applies to the active cleaner. When the \
background sweep finds an expired entry, it must use \
`remove(key, entry)` rather than `remove(key)`. Without this, the \
cleaner can race with a `put()` and delete a valid entry that was \
just written with a new TTL. Every code path that deletes \u2014 lazy \
expiration in `get()`, active sweep in the cleaner, even an explicit \
`delete()` API \u2014 must use the two-argument form. There are no \
exceptions to this rule.""",
    },
    # ── Z3 step 3 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Redis-Style Probabilistic Sweep \u2014 Why Sampling Beats Full Scan",
        "content": """\
A full scan of every key on every sweep cycle is O(n) and blocks the \
cleaner thread proportionally to store size. With millions of keys, \
each cycle takes seconds, creating latency spikes if the cleaner \
shares CPU with request threads. Redis avoids this with a \
**probabilistic approach**: sample 20 random keys, delete any that \
are expired, and if more than 25% of the sample was expired, \
immediately sample another 20.

This adaptive loop is elegant because it **self-tunes CPU usage** to \
expiration pressure. When few keys are expired, the loop finishes in \
one pass of 20 samples \u2014 negligible overhead. When a burst of keys \
expires simultaneously, the loop repeats rapidly until the expired \
fraction drops below the 25% threshold. The result is bounded memory \
growth without paying O(n) per sweep.

The sampling implementation calls `store.keySet().toArray()`, picks \
random indices with `ThreadLocalRandom`, and checks each entry for \
expiration. When the sweep finds an expired key, it uses the CAS \
`remove(key, entry)` pattern described above. Recursive calls \
continue until the expired fraction in the sample drops below the \
threshold.

One limitation is that `keySet().toArray()` allocates a snapshot \
array, which is **O(n) in memory** for that instant. For stores with \
tens of millions of keys, a more memory-efficient approach uses the \
`ConcurrentHashMap` iterator to process a fixed number of buckets \
per sweep rather than copying all keys. In practice, the snapshot \
allocation is short-lived and collected in the young generation, so \
it rarely causes issues below 10 million keys.""",
    },
    # ── Z1 key_points ────────────────────────────────────────────
    {
        "type": "key_points",
        "title": "Key Points",
        "content": (
            "- **Hybrid expiration: lazy + active** \u2014 lazy catches every "
            "accessed key at read time; active sampling prevents unbounded "
            "memory growth from keys that are written but never read\n"
            "- **CAS remove with two-argument form** \u2014 "
            "`remove(key, expectedEntry)` prevents a race where lazy "
            "expiration deletes a freshly-written entry that another "
            "thread just put with a new TTL\n"
            "- **Redis samples 20 keys per sweep** \u2014 deletes expired ones "
            "and repeats immediately if >25% of the sample was expired; "
            "self-tunes CPU to expiration pressure without O(n) full "
            "scans\n"
            "- **Per-key TimerTask is O(n) memory overhead** \u2014 a million "
            "keys means a million scheduled tasks consuming heap even "
            "when most are far from expiration\n"
            "- **Absolute timestamps over relative TTL** \u2014 store "
            "`expiresAt` in epoch millis so the expiration check is a "
            "single comparison; `put()` overwrites atomically without "
            "canceling timers"
        ),
    },
    # ── Z2 speakable_answer ──────────────────────────────────────
    {
        "type": "speakable_answer",
        "title": "How to Answer This Verbally",
        "content": """\
The store is a `ConcurrentHashMap` where each value is wrapped in \
an `Entry` record carrying the data plus an `expiresAt` timestamp \
in epoch milliseconds. Expiration uses a **hybrid strategy** \u2014 the \
same approach Redis uses in production.

**Lazy expiration** runs on every `get()` \u2014 if the entry\u2019s \
timestamp is past, delete it and return null. This costs nothing but \
only cleans keys that are actually read. Keys written once and never \
accessed again \u2014 abandoned sessions, stale cache entries \u2014 leak \
memory indefinitely under lazy-only expiration. That is the mistake \
most candidates make.

**Active expiration** runs in a background \
`ScheduledExecutorService` using Redis-style probabilistic sampling. \
Every second, sample 20 random keys and delete expired ones. If more \
than 25% of the sample was expired, repeat immediately. This \
adaptive loop self-adjusts CPU to expiration pressure \u2014 one pass \
during quiet periods, rapid bursts when many keys expire \
simultaneously.

The concurrency trap is in the lazy delete path. Between checking \
expiration and calling `remove()`, another thread can `put()` a \
fresh value for the same key. Using `remove(key)` would delete that \
fresh entry. The fix is the **two-argument CAS form** \u2014 \
`remove(key, expectedEntry)` \u2014 which only deletes if the current \
value is exactly what we read. This pattern must be used everywhere, \
including the active cleaner.

I mention two alternatives the interviewer might probe: a \
`DelayQueue` for exact-time eviction, which works well for small \
key sets but has O(log\u2009n) insertion overhead, and Netty\u2019s \
`HashedWheelTimer` for millions of keys with coarse-grained \
accuracy. In practice, the sampling approach is the best default \
because it is simple, bounded in CPU, and proven at Redis scale.""",
    },
]


# ═══════════════════════════════════════════════════════════════════
#  Q8  design-rate-limiter-component-java    complexity 3 (650-900)
# ═══════════════════════════════════════════════════════════════════

Q8_SECTIONS = [
    # ── Z3 overview ──────────────────────────────────────────────
    {
        "type": "overview",
        "title": "The Boundary-Burst Problem That Breaks Fixed-Window Counters",
        "content": """\
The simplest rate limiter counts requests per time window \u2014 100 \
requests allowed per second, counter resets at each second boundary. \
This works until a client sends 100 requests at second 0.99 and \
another 100 at second 1.01. From the counter\u2019s perspective, each \
window saw only 100 requests. From the server\u2019s perspective, 200 \
requests arrived in 200 milliseconds.

This **boundary-burst problem** is the reason fixed-window counters \
are insufficient for production rate limiting. Two algorithms solve \
it with different trade-offs. **Token bucket** maintains a bucket of \
permits that refills at a constant rate \u2014 it inherently allows short \
bursts up to the bucket size, which is a feature, not a bug. APIs \
that need smooth throughput use this approach. **Sliding window \
counter** divides time into overlapping sub-windows and sums recent \
counts, giving hard per-interval limits without boundary artifacts.

The choice depends on whether your use case tolerates controlled \
bursts or demands strict caps. Most production systems layer both: \
a token bucket for per-second smoothing and a sliding window counter \
for per-minute hard caps.""",
    },
    # ── Z3 step 1 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Token Bucket \u2014 Burst Capacity as a Deliberate Design Choice",
        "content": f"""\
The token bucket algorithm stores two values: the current number of \
available tokens and the timestamp of the last refill. Each \
`tryAcquire()` call computes how many tokens have accumulated since \
the last check using elapsed-time math, adds them to the available \
count capped at the bucket maximum, and then attempts to consume one \
token. If the bucket is empty, the request is rejected.

The elegance is that **no background thread** is needed. Tokens are \
calculated lazily on each call by multiplying elapsed nanoseconds by \
the refill rate. This makes the limiter zero-overhead when idle \u2014 \
no timers, no scheduled tasks. Guava\u2019s `RateLimiter` uses exactly \
this technique internally.

**Burst tolerance** is controlled by bucket size. A bucket of 10 \
with a refill rate of 5 per second allows an initial burst of 10 \
requests followed by a steady 5 per second. This is intentional \u2014 \
many APIs want short bursts for page loads and batch requests while \
throttling sustained abuse. The implementation uses synchronized \
access on a private lock object because the critical section is \
microsecond-scale.

{CB}java
public boolean tryAcquire() {{
    synchronized (lock) {{
        long now = System.nanoTime();
        double elapsed = (now - lastRefillNanos) * refillPerNano;
        availableTokens = Math.min(maxTokens,
            availableTokens + elapsed);
        lastRefillNanos = now;
        if (availableTokens >= 1.0) {{
            availableTokens -= 1.0;
            return true;  // token consumed
        }}
        return false;     // rejected
    }}
}}
{CB}

The `Math.min` cap is essential \u2014 without it, a limiter idle for an \
hour would accumulate millions of tokens and allow a massive burst \
that defeats the purpose of rate limiting entirely.""",
    },
    # ── Z3 step 2 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Sliding Window \u2014 Eliminating Boundary Bursts with Sub-Window Counters",
        "content": """\
A sliding window divides time into fixed sub-windows \u2014 for example, \
sixty 1-second slices within a 1-minute window. Each incoming \
request increments the counter for the current sub-window, and the \
decision to allow or reject sums all sub-windows in the current \
sliding range. When time advances, stale sub-windows are zeroed out.

The data structure is a **circular `int` array** indexed by \
`currentTimeMs / subWindowMs % arrayLength`. This keeps memory \
constant regardless of how long the limiter runs. When the window \
advances past a sub-window, that slot is reset to zero before being \
reused. The sum of all slots gives the request count over the most \
recent window period \u2014 a true sliding count without the \
boundary-burst artifact of fixed windows.

The trade-off versus token bucket is **strict enforcement versus \
burst tolerance**. Sliding window says \u201cno more than N requests in \
any rolling period\u201d \u2014 there is no burst capacity. This is \
appropriate for billing APIs, authentication endpoints, and anywhere \
a hard per-interval cap is a regulatory or contractual requirement. \
Token bucket is the better fit for general traffic shaping where \
short bursts are acceptable.""",
    },
    # ── Z3 step 3 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Per-Client Isolation and the Lock-Free CAS Upgrade Path",
        "content": """\
Production rate limiters need per-client state. A \
`ConcurrentHashMap<String, RateLimiter>` keyed by API key or client \
ID creates limiter instances lazily with `computeIfAbsent()`. The \
**memory concern** with this approach is real \u2014 millions of API keys \
mean millions of limiter objects. A background sweep should evict \
entries not accessed in the last 10 minutes to prevent unbounded \
growth.

For high-throughput scenarios where `synchronized` contention \
becomes measurable, a **CAS-based lock-free** token bucket replaces \
the lock with an `AtomicLong` that encodes both the token count and \
the last-refill timestamp into a single 64-bit value. The \
`tryAcquire()` method reads the current value, computes the new \
state, and attempts a `compareAndSet()`. If another thread modified \
the state between the read and the CAS, the loop retries. Under \
contention, CAS loops outperform synchronized blocks because they \
avoid OS-level thread parking and context switches.

For **distributed rate limiting** across multiple JVM instances, the \
same algorithms apply but the state moves to Redis. A Lua script \
performs the token-bucket or sliding-window logic atomically on the \
Redis server. The code structure remains identical \u2014 only the \
storage backend changes from `ConcurrentHashMap` to Redis commands. \
The `CL.THROTTLE` command from the redis-cell module provides a \
production-ready token bucket that handles distributed state without \
any custom Lua.""",
    },
    # ── Z1 key_points ────────────────────────────────────────────
    {
        "type": "key_points",
        "title": "Key Points",
        "content": (
            "- **Token bucket allows bursts by design** \u2014 bucket size "
            "controls burst tolerance; a bucket of 10 at 5/sec refill "
            "allows 10 requests instantly then steady 5/sec; this is "
            "intentional, not a bug\n"
            "- **Fixed-window boundary burst** \u2014 2\u00d7 the limit can "
            "arrive in a single second by straddling the window reset; "
            "sliding sub-windows eliminate this by summing overlapping "
            "time slices\n"
            "- **Lazy elapsed-time refill** \u2014 tokens calculated from "
            "nanosecond delta on each call, no background thread; zero "
            "CPU when idle; Guava `RateLimiter` uses this exact "
            "technique\n"
            "- **CAS lock-free upgrade** \u2014 encode tokens and timestamp "
            "in a single `AtomicLong`; `compareAndSet` loop avoids "
            "OS-level thread parking under high contention\n"
            "- **Per-client ConcurrentHashMap with eviction sweep** \u2014 "
            "`computeIfAbsent` creates limiters lazily; background task "
            "evicts entries unused for 10 minutes to prevent unbounded "
            "memory growth"
        ),
    },
    # ── Z2 speakable_answer ──────────────────────────────────────
    {
        "type": "speakable_answer",
        "title": "How to Answer This Verbally",
        "content": """\
I implement two strategies behind a common interface. **Token \
bucket** is the default for smooth rate limiting \u2014 a bucket of N \
tokens refilled at a fixed rate. Each `tryAcquire` calculates \
elapsed nanoseconds since the last call, adds proportional tokens \
capped at the bucket maximum, and tries to consume one. No \
background thread \u2014 the refill is purely lazy math, which is how \
Guava `RateLimiter` works internally. Burst tolerance equals the \
bucket size, and that is a deliberate design choice.

For hard per-interval caps I use a **sliding window counter** \u2014 a \
circular `int` array of sub-windows where each request increments \
the current slot and the allow/reject decision sums all slots. This \
avoids the fixed-window boundary problem where clients send 2\u00d7 the \
limit by straddling the reset point.

Per-client isolation uses a `ConcurrentHashMap<String, RateLimiter>` \
with `computeIfAbsent`. The memory concern is real \u2014 millions of \
keys need a background sweep to evict stale entries.

Thread safety in the token bucket uses `synchronized` on a private \
lock because the critical section is microsecond-scale. For extreme \
throughput, a CAS-based lock-free variant encodes state in an \
`AtomicLong` and uses a compare-and-swap loop. For distributed \
deployments, the same logic moves to Redis Lua scripts \u2014 the \
algorithm stays identical, only the storage backend changes. I \
always recommend token bucket as the default unless the use case \
requires strict hard caps.""",
    },
]


# ═══════════════════════════════════════════════════════════════════
#  Q9  design-retry-exponential-backoff-java complexity 3 (650-900)
# ═══════════════════════════════════════════════════════════════════

Q9_SECTIONS = [
    # ── Z3 overview ──────────────────────────────────────────────
    {
        "type": "overview",
        "title": "Why Retrying Without Jitter Creates a Thundering Herd",
        "content": """\
Network calls fail transiently \u2014 connection timeouts, HTTP 503 \
responses, TCP resets during load balancer rotation. The instinct to \
retry is correct, but the implementation details determine whether \
retries help recovery or accelerate collapse.

Without **exponential backoff**, a client that retries immediately \
after a failure hammers a service that is already struggling to \
recover. The fix is straightforward: wait 100\u2009ms after the first \
failure, 200\u2009ms after the second, 400\u2009ms after the third. Each \
successive attempt doubles the delay, giving the downstream service \
breathing room proportional to how long the outage has lasted.

But exponential backoff alone has a critical flaw. If 1,000 clients \
all experience the same failure at the same instant, they all \
compute the same backoff intervals and retry at exactly the same \
moments \u2014 creating **synchronized retry waves** that hit the \
recovering service in concentrated bursts. This is the thundering \
herd problem, and **jitter** is the solution. Adding randomness to \
each delay scatters retries across the interval, converting a spike \
into a smooth distribution of traffic that a recovering service can \
absorb gradually.""",
    },
    # ── Z3 step 1 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Full Jitter vs Equal Jitter vs Decorrelated \u2014 The AWS Comparison",
        "content": """\
The AWS Architecture Blog tested three jitter strategies in \
simulations and found meaningful differences in recovery time. \
**Full jitter** selects a random value between 0 and the computed \
exponential delay: `random(0, base \u00d7 2^attempt)`. This spreads \
retries most widely because some clients wait near zero while others \
wait near the maximum. It minimizes contention on the recovering \
service but makes individual retry latency unpredictable.

**Equal jitter** splits the delay in half \u2014 one fixed portion plus \
one random: `(delay / 2) + random(0, delay / 2)`. This guarantees a \
minimum wait of half the computed backoff, giving more predictable \
latency per client at the cost of tighter clustering than full \
jitter.

**Decorrelated jitter** bases each delay on the previous one rather \
than the attempt number: `random(base, previousDelay \u00d7 3)`. This \
creates naturally diverging retry patterns across clients because \
each client\u2019s sequence evolves independently. The AWS blog found it \
performed comparably to full jitter in most scenarios.

For most applications, **full jitter is the right default** because \
it maximizes spread with the simplest implementation. The delay \
formula becomes a single line: \
`ThreadLocalRandom.current().nextLong(0, Math.min(cap, base * (1L << attempt)))`. \
The `Math.min` cap prevents the exponential from growing to absurd \
values \u2014 without it, the 20th retry would compute a delay of over \
12 days.""",
    },
    # ── Z3 step 2 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Classifying Errors \u2014 Why Retrying a 400 Wastes Everyone\u2019s Time",
        "content": """\
Not every failure deserves a retry. A `SocketTimeoutException` is \
transient \u2014 the server was probably busy, and the next attempt \
might succeed. An HTTP 400 is permanent \u2014 the request is \
malformed, and resending it will fail identically every time. \
Retrying permanent errors wastes time, clutters logs, and delays the \
real fix: correcting the request.

The cleanest classification approach uses a \
`Predicate<Throwable>` that callers configure per use case. This is \
more flexible than requiring exceptions to extend a marker interface \
because it works with **third-party libraries** whose exception \
types you cannot modify. A typical HTTP predicate marks 429 (Too \
Many Requests), 502, 503, and 504 as retryable while treating all \
other 4xx responses as fatal.

A smarter implementation also inspects the **Retry-After header** on \
429 and 503 responses. When the server tells you exactly how long to \
wait, that value is more accurate than any computed backoff. \
Resilience4j\u2019s `Retry` module supports this via an \
`IntervalBiFunction` that receives both the attempt count and the \
exception, allowing the delay to incorporate server-provided hints.

**Idempotency** is the prerequisite that candidates often forget. \
Retrying a `POST /orders` without a client-generated idempotency key \
can create duplicate orders. GET is safe by definition, but every \
mutation must carry a deduplication token that the server checks \
before executing side effects.""",
    },
    # ── Z3 step 3 ────────────────────────────────────────────────
    {
        "type": "step",
        "title": "Circuit Breaker Composition \u2014 Stopping Retries That Amplify Failures",
        "content": """\
Retries without a circuit breaker can turn a partial outage into a \
total one. If a downstream service is down and 100 clients each \
retry 3 times, that is 300 failing requests where 100 would have \
sufficed. The **circuit breaker** pattern short-circuits requests \
when the failure rate crosses a threshold, preventing retries from \
amplifying load on an already-suffering service.

The key is that the retry runs **inside** the circuit breaker, not \
outside. If the breaker wraps the retryer, it sees each retry \
attempt as a separate call and trips too eagerly. If the retryer \
wraps the breaker, it retries the breaker-protected call \u2014 and when \
the breaker opens, the retry gets an immediate \
`CircuitBreakerOpenException` without hitting the downstream at all. \
Resilience4j models this as nested decorators: \
`Retry.of(config).compose(CircuitBreaker.of(config))`.

**Monitoring** should emit metrics on every retry attempt \u2014 count \
per endpoint, attempt number distribution, delay histogram, and \
final outcome. The critical alert threshold is **retry rate above 5% \
of total calls**, which signals a degrading dependency before it \
becomes an outage. Resilience4j integrates with Micrometer to \
publish these metrics automatically.

For **async retries** in reactive or non-blocking stacks, replace \
`Thread.sleep()` with a `ScheduledExecutorService` that schedules \
the next attempt as a delayed task. The retry logic is identical \u2014 \
only the waiting mechanism changes from blocking to scheduling. \
Spring Retry\u2019s `@Retryable` and Resilience4j both support reactive \
return types out of the box.""",
    },
    # ── Z1 key_points ────────────────────────────────────────────
    {
        "type": "key_points",
        "title": "Key Points",
        "content": (
            "- **Full jitter: random(0, base \u00d7 2^attempt)** \u2014 spreads "
            "retries most widely and is the AWS-recommended default; "
            "prevents synchronized retry storms that overwhelm recovering "
            "services\n"
            "- **Max-delay cap is mandatory** \u2014 without it, exponential "
            "growth reaches absurd values; the 20th retry computes a "
            "12-day delay; cap at 30\u201360 seconds for user-facing systems\n"
            "- **Predicate-based error classification** \u2014 "
            "`Predicate<Throwable>` works with third-party exceptions you "
            "cannot modify; mark 429/502/503/504 as retryable, treat all "
            "other 4xx as fatal\n"
            "- **Retry inside circuit breaker, not outside** \u2014 retry "
            "wrapping breaker means an open breaker returns immediately "
            "without hitting downstream; the reverse trips the breaker "
            "on every retry attempt\n"
            "- **Idempotency key for mutations** \u2014 retrying POST without "
            "a deduplication token creates duplicate orders; every "
            "retry-eligible mutation must carry a client-generated "
            "request ID"
        ),
    },
    # ── Z2 speakable_answer ──────────────────────────────────────
    {
        "type": "speakable_answer",
        "title": "How to Answer This Verbally",
        "content": """\
A retry wraps a `Callable` in a loop that catches exceptions, \
classifies them as retryable or fatal with a **Predicate**, and \
waits an exponentially increasing duration before the next attempt. \
The delay formula is `base \u00d7 2^attempt` capped at a maximum \u2014 \
without the cap, the 20th retry would compute a delay of over 12 \
days.

**Jitter** is the detail that separates a textbook answer from a \
production-ready one. Without it, every client that failed at the \
same moment computes identical backoff intervals and retries in \
lockstep \u2014 a thundering herd that overwhelms the recovering \
service. **Full jitter** \u2014 a random value between zero and the \
computed delay \u2014 spreads retries most widely and is the \
AWS-recommended default.

Error classification matters because retrying a 400 wastes time \
while the real bug sits in the request payload. I use a Predicate \
because it handles third-party exceptions I cannot modify. For HTTP, \
I also honor `Retry-After` headers rather than relying solely on \
computed delays.

The production concern I always raise is composition with a \
**circuit breaker**. Retries must run inside the breaker so that \
when the failure rate trips the threshold, subsequent retries get an \
immediate rejection without adding load downstream. Resilience4j \
models this as nested decorators. I monitor retry rate as a \
percentage of total calls and alert above 5% \u2014 in practice, that \
is the most reliable leading indicator of a dependency starting to \
degrade.""",
    },
]


# ═══════════════════════════════════════════════════════════════════
#  Slug → sections map
# ═══════════════════════════════════════════════════════════════════

UPDATES = {
    "design-connection-pool-manager-java": Q5_SECTIONS,
    "design-pubsub-event-bus-java": Q6_SECTIONS,
    "design-in-memory-kv-store-ttl-java": Q7_SECTIONS,
    "design-rate-limiter-component-java": Q8_SECTIONS,
    "design-retry-exponential-backoff-java": Q9_SECTIONS,
}


# ═══════════════════════════════════════════════════════════════════
#  Main
# ═══════════════════════════════════════════════════════════════════

def main():
    data = json.loads(FILE.read_text(encoding="utf-8"))

    updated_slugs = []
    for q in data["questions"]:
        if q["slug"] in UPDATES:
            q["answer"]["sections"] = UPDATES[q["slug"]]
            updated_slugs.append(q["slug"])

    FILE.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(f"Updated {len(updated_slugs)} questions in {FILE.name}\n")
    print("=== Word counts per question ===")
    for slug in updated_slugs:
        sections = UPDATES[slug]
        z3_words = sum(
            wc(s["content"])
            for s in sections
            if s["type"] not in ("key_points", "speakable_answer")
        )
        z2_words = sum(
            wc(s["content"])
            for s in sections
            if s["type"] == "speakable_answer"
        )
        z1_words = sum(
            wc(s["content"])
            for s in sections
            if s["type"] == "key_points"
        )
        total = z3_words + z2_words + z1_words
        print(f"  {slug}")
        print(f"    Z3={z3_words:>4d}  Z2={z2_words:>3d}  Z1={z1_words:>3d}  total={total}")
    print()


if __name__ == "__main__":
    main()
