# Depth markers per archetype

> Mirrors `SPEAKABLE-PLAN.md` §9. Cross-references: lint depth rules in `docs/speakable/lint-rules.md` §7.6; locked decision §15.8.

The depth marker is the *one moment in the answer that proves the speaker is not surface-level*. A definition without a depth marker reads as a tutorial paragraph; with the marker it reads as someone who has been bitten before. The marker is **mandatory for A/B/C/D/E**, **recommended for G**, and replaced by **concrete capacity numbers** for F.

The lint script (`audit_speakable.py`, Phase 1) will look for the marker either in a dedicated beat (where the archetype has one — e.g. E's `rethink_if`, G's `reflection`, C's `failure_mode`) or by topic-tagged signal phrases sourced from the codex.

---

## Quick-reference table

| Archetype | Depth-marker rule | Required / Optional |
|---|---|---|
| A Conceptual | Non-obvious sub-topic the concept implies (a "where this hides a sharp edge" clause) | Mandatory |
| B Comparison | The gotcha most candidates miss in one of the axes | Mandatory |
| C Internals | Production failure mode (in the `failure_mode` beat) | Mandatory |
| D Scenario | Real evidence / tooling — named tools, named outputs | Mandatory |
| E Design | The `rethink_if` beat — what would change my mind | Mandatory |
| F System Design / LLD | Concrete capacity numbers (writes/sec, GB/day, percentile latencies) | Mandatory in the `capacity` and `bottleneck_deep_dive` beats |
| G Behavioural | The `reflection` beat — what I'd do differently | Recommended (warn-only in lint) |

---

## A — Conceptual

**Marker:** The non-obvious sub-topic the concept implies. The answer surfaces a sharper question hidden inside the obvious one.

**Worked examples:**
1. **Thread** → states (New / Runnable / Running / Blocked / Waiting / Terminated). Most beginners answer "a lightweight process" and stop. The depth marker is naming the lifecycle.
2. **HashMap** → collisions and the bucket-resolution strategy (chaining → tree at threshold 8). The depth marker is naming what happens when two keys land in the same bucket, not just "key-value store".
3. **OOP** → IS-A vs HAS-A (the difference between `Dog extends Animal` and a `Car` that *has* an engine). The depth marker is the boundary test for when inheritance is the wrong tool.

---

## B — Comparison

**Marker:** The gotcha most candidates miss — usually a property that *doesn't* show up in the surface comparison axes.

**Worked examples:**
1. **ArrayList vs LinkedList** → CPU cache locality. Most candidates list memory layout and Big-O. The depth marker is "even with O(1) inserts in the middle, LinkedList loses on real hardware because nodes are scattered across memory and the prefetcher can't help".
2. **`==` vs `equals`** → the String pool. The standard answer covers reference vs content. The depth marker is "two `String` literals can compare equal with `==` because the JVM interns literals into the pool — but `new String("a") == "a"` is false".
3. **REST vs GraphQL** → the N+1 problem at the resolver layer. The depth marker is naming the trap GraphQL hides where REST exposes it bluntly.

---

## C — Internals

**Marker:** The production failure mode — the way this thing breaks under load, not the way it works on the happy path. Lives in the `failure_mode` beat.

**Worked examples:**
1. **HashMap** → the resize storm. Under sustained insert pressure with poor hash distribution, the rehash blocks every put and every reader sees the half-built table. Two threads resizing concurrently in pre-Java-8 HashMap caused infinite loops in production.
2. **Hibernate persistence context** → N+1 queries. The first `find` returns the parent; iterating the lazy collection triggers one SELECT per child. A list of 200 orders becomes 201 round-trips and the request times out.
3. **Kafka consumer groups** → the rebalance storm. A slow consumer fails its session timeout, the group rebalances, partitions reassign, in-flight messages get re-processed by a different consumer — and if the workload triggers another timeout, the cycle repeats.

---

## D — Scenario

**Marker:** Real evidence and named tooling. The answer cites the diagnostic the speaker would actually look at, not abstract "logs and metrics".

**Worked examples:**
1. **Latency spike in a Java service** → `jstack` for thread dumps to spot lock contention; `async-profiler` for CPU and allocation flame graphs; the histogram from Micrometer rather than the average; GC logs filtered for pause-time outliers.
2. **Slow query** → `EXPLAIN ANALYZE` for the actual plan and timings; `pg_stat_statements` for the worst offenders; the index-usage view to spot indexes that aren't being chosen.
3. **Pod in CrashLoopBackOff** → `kubectl describe pod` for events; `kubectl logs --previous` for the crash trail; `kubectl get events --sort-by='.lastTimestamp'` for the cluster-side story.

---

## E — Design

**Marker:** The `rethink_if` beat — the explicit answer to "what would change my mind?" Always present, always specific, never vague.

**Worked examples:**
1. **Microservices vs modular monolith** → "I'd rethink microservices if the team is three engineers, the deploy cadence is weekly, and we don't yet have the platform to absorb the operational tax."
2. **Saga vs 2PC** → "I'd rethink saga and reach for 2PC if the failure window of an inconsistent intermediate state is unacceptable for a regulated transaction — for example, anything that touches double-entry bookkeeping."
3. **Abstract class vs interface** → "I'd rethink the abstract class the moment a second sibling needs to mix in behaviour from elsewhere — multiple inheritance closes that door, interfaces leave it open."

---

## F — System Design / LLD

**Marker:** Concrete capacity numbers — writes/sec, GB/day, p99 latencies, fan-out factors. Vague phrases like "lots of users" or "high traffic" fail the depth check.

**Worked examples:**
1. **URL shortener** → "10 M URLs/day means ~115 writes/sec average, ~5× peak so ~600 writes/sec, ~50 reads per write so ~30 K reads/sec; at 500 bytes per record that's ~1.8 GB/day raw, ~650 GB over a year before TTL."
2. **News feed** → "100 M DAU, ~5 reads per session, ~500 writes/day per active user. Fan-out-on-write costs ~5 K writes per celebrity post; fan-out-on-read shifts the cost to read time and pushes p99 over 200 ms without aggressive caching."
3. **Rate limiter** → "1 M req/s across N edge nodes, 1 KB per token-bucket entry, ~1 GB hot state — fits in Redis cluster memory; sliding window with second-precision over 60 s = 60 counters per key, ~6× the storage."

---

## G — Behavioural

**Marker:** The `reflection` beat — the speaker names what they would do differently with the benefit of hindsight. Recommended, not mandatory; the lint emits a warning rather than a failure when it's missing.

**Worked examples:**
1. **A late-running project** → "Looking back, I'd have escalated two days earlier. The signal that we were going to miss was clear by Tuesday; I held it because I thought we'd recover, and we didn't. Now I escalate the moment I see the trend, not when the trend is unrecoverable."
2. **A production incident I caused** → "I'd have written the rollback plan before the rollout, not during the incident. We had the migration plan, but the reverse migration was 'we'll figure it out' — and that cost us 40 minutes during a P0."
3. **A disagreement with a teammate** → "I'd have framed it as a decision to make together, not a position to defend. Once I was defending, the conversation stopped being technical."

---

## Lint contract

The lint script's `7.6 Depth rules` (see `docs/speakable/lint-rules.md`) checks:

- **A:** the topic-tagged signal phrase for the question's depth marker is present in the `parts_or_states`, `pitfalls`, or `example` beat.
- **B:** the gotcha phrase is present in the `differences`, `when_to_pick`, or `tiny_example` beat.
- **C:** the `failure_mode` beat is non-empty *and* contains a named failure-mode signal (resize storm, N+1, rebalance, deadlock, etc., from the codex).
- **D:** the `tools` beat names ≥ 2 concrete tools or outputs (jstack, EXPLAIN, dashboards, etc., from the codex).
- **E:** the `rethink_if` beat is present and contains a specific, conditional clause (the lint heuristic looks for an "if" or equivalent trigger word plus a concrete threshold).
- **F:** the `capacity` beat contains ≥ 1 numeric value with a unit (req/s, GB, ms, etc.); `bottleneck_deep_dive` likewise.
- **G:** the `reflection` beat is non-empty (warning-level only).
