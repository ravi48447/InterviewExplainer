# Speakable archetypes

> Mirrors `SPEAKABLE-PLAN.md` §3 (the 7 instinct skeletons) and §16 (the worked example). Cross-references: `word-ceilings.md` (§8), `depth-markers.md` (§9), `lint-rules.md` (§7).

Every question in the catalogue maps to **exactly one** archetype. The archetype determines the **required and forbidden beats**, the **per-beat ceilings**, and the **depth marker** the lint will look for. The renderer (Phase 1) picks a layout composition based on archetype × per-beat `layout`.

---

## Quick-reference table

| Code | Name | Required beats (in instinct order) | Expected total (soft) | Depth marker |
|---|---|---|---:|---|
| **A** | Conceptual | hook → definition → why_exists → parts_or_states → *(how_to_use — recommended)* → example → pitfalls → cap | ~470 | Non-obvious sub-topic the concept implies |
| **B** | Comparison | hook → what_each_is → differences → when_to_pick → tiny_example → cap | ~290 | The gotcha most candidates miss |
| **C** | Internals | hook → mental_model → mechanism → edge_cases → failure_mode → cap | ~350 | Production failure mode (in `failure_mode`) |
| **D** | Scenario | hook → clarify → hypothesis → step_by_step → tools → tradeoff → cap | ~365 | Real evidence / tooling (in `tools`) |
| **E** | Design | hook → optimising_for → options → tradeoffs → decision → rethink_if → cap | ~270 | The `rethink_if` beat |
| **F** | System Design / LLD | hook → requirements_fr_nfr → capacity → api → data_model → high_level → bottleneck_deep_dive → tradeoffs → cap | ~620 | Concrete capacity numbers |
| **G** | Behavioural / STAR | hook → situation → task → action → result → reflection → cap | ~320 | Reflection beat (recommended, warn-only) |

---

## A — Conceptual

> *"What is X?"* — the answer walks through the natural mental sequence: name it, justify it, decompose it, show it, warn about the trap.

- **Definition:** A question that asks the speaker to introduce a concept from scratch, define it, and unpack it enough to demonstrate command. The speaker is not making a choice or comparing alternatives — they are mapping the territory.
- **Instinct skeleton:** `hook → definition → why_exists → parts_or_states → (how_to_use) → example → pitfalls → cap`
- **Required beats:** `hook`, `definition`, `why_exists`, `parts_or_states`, `example`, `pitfalls`, `cap`.
- **Recommended beats:** `how_to_use` — include it when the concept has a concrete usage angle separate from `example` (e.g. "what is a Stream API"). Many A questions don't need it (e.g. "what are threads" — the example beat already shows usage). The lint treats `how_to_use` as soft-required: missing it deducts 4 from the score (warn) but does not trigger a structural fail. (Resolution of HUMAN-REVIEW-QUEUE §3-vs-§16 — Phase 2 preflight.)
- **Forbidden beats:** none. (A may borrow no beats from B/C/D/E/F/G — but no beat is explicitly banned.)
- **Per-beat ceilings:** see `word-ceilings.md` § Archetype A.
- **Depth marker:** see `depth-markers.md` § A. Lives in `parts_or_states`, `pitfalls`, or `example`.

### A — example questions
1. **`java-concurrency / threads-and-lifecycle`** (P01) — *"What is a Thread?"* — pure conceptual: definition, lifecycle states, how to use, common pitfalls.
2. **`java-collections / collections-internals`** (P01) — *"What is a HashMap?"* — conceptual when framed as "what is", flips to archetype C ("how does HashMap work under the hood?") when framed as internals.
3. **`core-java / string-handling`** (P01) — *"What is the String pool?"* — name it, why it exists, how interning works, the `==` vs `equals` pitfall.

### A — fully-filled YAML example
(condensed; full reference example in `SPEAKABLE-PLAN.md` §16)

```yaml
speakable:
  archetype: A
  pillar: P01
  audience_assumption: beginner
  voice: friendly
  familiarity_anchors:
    - "data plus the methods"
    - "blueprint vs instance"
  standard_example: "Dog extends Animal"

  hook: "OOP is just a way of writing code around objects."

  beats:
    - kind: definition
      layout: paragraph
      text: "An object is data plus the methods that work on that data. The class is the blueprint; the object is one real example of it. A Dog class might have name and bark() — every dog has its own name but the same shape."

    - kind: why_exists
      layout: paragraph
      text: "Without it, data sits in one place and the code touching that data scatters everywhere. Small changes cascade across the codebase. OOP keeps the change local."

    - kind: parts_or_states
      label: "The four pillars"
      layout: grouped_paragraphs
      groups:
        - heading: "Encapsulation"
          text: "The class controls its own state. Fields stay private; callers change them through methods like withdraw(), not setBalance()."
        - heading: "Inheritance"
          text: "The IS-A relationship. Dog extends Animal. Java only allows one parent because of the diamond problem; for multiple, use interfaces."
        - heading: "Polymorphism"
          text: "Same call, different behaviour by object. Shape s = new Circle(); s.area() runs Circle's version because the JVM looks at the actual object at runtime."
        - heading: "Abstraction"
          text: "Depend on the contract, not the implementation. List l = new ArrayList<>() lets you swap to LinkedList tomorrow without changing any caller."

    - kind: how_to_use
      layout: paragraph
      text: "Reach for OOP when the system has nouns that own behaviour. If everything is just functions over data, a procedural style is often cleaner."

    - kind: example
      layout: paragraph
      text: "List<String> names = new ArrayList<>() uses all four at once. List is the abstraction. ArrayList's array is encapsulated. Any List works in its place via polymorphism. ArrayList implements List through inheritance."

    - kind: pitfalls
      layout: bullets
      items:
        - "Don't confuse abstraction with the abstract keyword — one is a design idea, the other a Java mechanism."
        - "A private field plus setBalance() is not encapsulation; it's a public field wearing a coat."

  cap: "OOP isn't four rules to memorise — they reinforce each other, and most real bugs come from breaking one of them."

  followup_handoff:
    - "What is the difference between compile-time and runtime polymorphism?"
    - "When would you use composition over inheritance?"
    - "What is the diamond problem in Java?"

  tts_overrides:
    "List<String>": "list of strings"
    "==": "double-equals"
```

---

## B — Comparison

> *"X vs Y"* — three or four crisp axes, then a "when to pick which" judgement, then the gotcha.

- **Definition:** A question whose entire shape is a side-by-side. Both items already exist; the speaker's job is to surface the axes that distinguish them and the gotcha that decides the call in real code.
- **Instinct skeleton:** `hook → what_each_is → differences (3–4 axes) → when_to_pick → tiny_example → cap`
- **Required beats:** `hook`, `what_each_is`, `differences`, `when_to_pick`, `tiny_example`, `cap`.
- **Forbidden beats:** `parts_or_states`, `how_to_use` (these would bloat a comparison — kept out by the lint at 7.1.4).
- **Per-beat ceilings:** see `word-ceilings.md` § Archetype B (each `differences` axis has its own 30/45 cap).
- **Depth marker:** see `depth-markers.md` § B. Lives in `differences`, `when_to_pick`, or `tiny_example`.

### B — example questions
1. **`java-collections / comparisons`** (P01) — *"ArrayList vs LinkedList"* — memory layout, random access cost, insertion cost; gotcha = CPU cache locality.
2. **`core-java / comparisons`** (P01) — *"`==` vs `equals`"* — reference vs content; gotcha = the String pool.
3. **`spring-data-jpa / comparisons`** (P02) — *"JPA vs Hibernate vs MyBatis"* — abstraction layer, control over SQL, learning curve; gotcha = N+1 surfaces with JPA where MyBatis makes you write the join.

### B — fully-filled YAML example

```yaml
speakable:
  archetype: B
  pillar: P01
  audience_assumption: beginner
  voice: friendly
  familiarity_anchors:
    - "array under the hood"
    - "nodes with pointers"
  standard_example: "ArrayList vs LinkedList"

  hook: "Both implement List, but they trade off completely differently under the hood."

  beats:
    - kind: what_each_is
      layout: paragraph
      text: "ArrayList is an array under the hood; it grows by allocating a bigger array and copying. LinkedList is a chain of nodes — each node holds a value and a pointer to the next."

    - kind: differences
      layout: mini_table
      columns: ["ArrayList", "LinkedList"]
      rows:
        - axis: "Random access by index"
          values: ["O(1) — direct array offset", "O(n) — walk from the head"]
        - axis: "Insert/remove in the middle"
          values: ["O(n) — shift elements", "O(1) once you have the node"]
        - axis: "Memory per element"
          values: ["compact — just the value", "value plus two pointers"]
        - axis: "Cache locality"
          values: ["excellent — contiguous memory", "poor — nodes scattered on the heap"]

    - kind: when_to_pick
      layout: paragraph
      text: "Pick ArrayList for almost everything: reads, scans, random access, and any list that fits comfortably in memory. Pick LinkedList only when most of your work is queue-style — adds and removes at the ends — and you almost never do random access."

    - kind: tiny_example
      layout: paragraph
      text: "Even with O(1) middle-insert, LinkedList loses on real hardware: you walk pointers across scattered memory and the prefetcher can't help. ArrayList's O(n) shift is faster in practice on lists under a few thousand elements."

  cap: "In modern Java code, reach for ArrayDeque for queue work and ArrayList for lists — LinkedList rarely earns its keep."

  followup_handoff:
    - "When would you pick ArrayDeque over LinkedList?"
    - "What's the cost of resizing an ArrayList?"

  tts_overrides:
    "O(1)": "constant time"
    "O(n)": "linear time"
```

---

## C — Internals

> *"How does X work under the hood?"* — mental model first, then the mechanism, then the edges, then the production failure mode.

- **Definition:** A question that asks the speaker to open the box. The interviewer wants to see the mental model, the mechanism step-by-step, and the way the system actually fails in production — not the happy-path walkthrough.
- **Instinct skeleton:** `hook → mental_model → mechanism → edge_cases → failure_mode → cap` (`example` optional)
- **Required beats:** `hook`, `mental_model`, `mechanism`, `edge_cases`, `failure_mode`, `cap`.
- **Optional beats:** `example`.
- **Forbidden beats:** `differences` (that's archetype B), `step_by_step` (that's archetype D — internals is sequential by mechanism, not by debug-step).
- **Per-beat ceilings:** see `word-ceilings.md` § Archetype C.
- **Depth marker:** the `failure_mode` beat itself, with a named codex-tagged failure (resize storm / N+1 / rebalance / split-brain / deadlock / etc.).

### C — example questions
1. **`java-collections / collections-internals`** (P01) — *"How does HashMap work internally?"* — array of buckets, hashing, chaining, treeify at threshold 8; failure = resize storm.
2. **`spring-data-jpa / hibernate-internals`** (P02) — *"How does Hibernate's persistence context work?"* — first-level cache, dirty checking, flush; failure = N+1 query problem.
3. **`messaging-events / kafka-architecture`** (P04) — *"How does Kafka assign partitions to consumers?"* — group coordinator, range/round-robin/sticky; failure = the rebalance storm.

### C — fully-filled YAML example

```yaml
speakable:
  archetype: C
  pillar: P01
  audience_assumption: beginner
  voice: friendly
  familiarity_anchors:
    - "array of buckets"
    - "key-value pair"
    - "hashcode"
    - "collision"
    - "chaining"
  standard_example: "put(\"key\", value)"

  hook: "A HashMap is an array of buckets, with the hashcode picking which bucket."

  beats:
    - kind: mental_model
      layout: paragraph
      text: "Imagine a row of mailboxes. The key's hashcode tells you which mailbox. If two keys land in the same mailbox, they queue up inside it. The map keeps a load factor so the row stays sparse enough to keep lookups fast."

    - kind: mechanism
      layout: ordered_list
      steps:
        - "put(key, value): compute hash, find the bucket index, walk the bucket's chain checking equals(), replace or append."
        - "get(key): compute hash, find the bucket, walk the chain, return the value whose key passes equals()."
        - "Past 75% load factor: allocate a new array twice the size and rehash every entry into it."
        - "If a single bucket grows past 8 entries (Java 8+): convert that bucket from a linked list to a red-black tree for O(log n) lookup."

    - kind: edge_cases
      layout: bullets
      items:
        - "Mutating a key after insert breaks the contract — the new hashcode points to the wrong bucket and get() silently returns null."
        - "Null keys are allowed (one), null values are allowed (many) — different from Hashtable."
        - "Iteration order is not the insertion order; use LinkedHashMap if you need it."

    - kind: failure_mode
      layout: callout
      text: "The classic failure is the resize storm. Under sustained insert pressure with a poor hashcode, the rehash blocks every put. Pre-Java-8, two threads resizing the same HashMap concurrently could form a circular linked list inside a bucket and pin a CPU forever. Use ConcurrentHashMap when threads share a map."

  cap: "HashMap is fast and forgiving — until the hashcode is bad or the threads are sharing it without protection."

  followup_handoff:
    - "How does ConcurrentHashMap differ from HashMap internally?"
    - "What changes in HashMap with Java 8 and the treeify threshold?"

  tts_overrides:
    "put(key, value)": "put key value"
    "get(key)": "get key"
```

---

## D — Scenario

> *"How would you debug / handle…?"* — clarify the scope, form a hypothesis, walk the steps, name the tools, name the trade-off you accept.

- **Definition:** A question framed as a situation rather than a concept. The speaker is the on-call engineer or the senior in the room — the answer is an action plan with named tools.
- **Instinct skeleton:** `hook → clarify → hypothesis → step_by_step → tools → tradeoff → cap`
- **Required beats:** `hook`, `clarify`, `hypothesis`, `step_by_step`, `tools`, `tradeoff`, `cap`.
- **Forbidden beats:** `definition` (don't lecture; act).
- **Per-beat ceilings:** see `word-ceilings.md` § Archetype D.
- **Depth marker:** `tools` beat names ≥ 2 concrete tools or outputs from the codex.

### D — example questions
1. **`production-sre / debugging-production`** (P11) — *"A Java service is suddenly slow — walk me through your debug."* — clarify scope, form hypothesis (lock vs CPU vs GC), step-by-step, tools = jstack/async-profiler/Micrometer histograms.
2. **`production-sre / performance-troubleshooting`** (P11) — *"P99 latency spiked at 2 a.m. — what do you do?"*
3. **`jvm-internals / scenario-based`** (P01) — *"The app OOMs under load — diagnose."*

### D — fully-filled YAML example

```yaml
speakable:
  archetype: D
  pillar: P11
  audience_assumption: familiar
  voice: neutral
  familiarity_anchors:
    - "thread dump"
    - "flame graph"
    - "tail latency"
  standard_example: "jstack + async-profiler"

  hook: "First, I'd narrow whether it's a hot CPU, a blocked thread, or a GC pause."

  beats:
    - kind: clarify
      layout: paragraph
      text: "Two questions before I touch anything: is it the whole service or one endpoint, and is the slowdown gradual or a step-change. The answers tell me whether to start at the JVM or at a recent deploy."

    - kind: hypothesis
      layout: paragraph
      text: "If memory and CPU are both up, I lean GC pressure or a memory leak. If CPU is up alone, a hot loop or a sudden cache miss. If CPU is calm but threads are stuck, a lock or an external dependency timing out."

    - kind: step_by_step
      layout: ordered_list
      steps:
        - "Pull the latency histogram from Micrometer or the equivalent — confirm whether p50 moved or only the tail."
        - "Capture a thread dump with jstack and look for many threads parked on the same monitor or socket read."
        - "Run async-profiler for 30 seconds in CPU and allocation modes; open the flame graphs."
        - "Cross-reference GC logs filtered for pauses over 200 ms."
        - "Check the deploy timeline for anything in the last 24 hours and the dependency dashboards for upstream regressions."

    - kind: tools
      layout: bullets
      items:
        - "jstack — thread dumps for lock contention."
        - "async-profiler — CPU and allocation flame graphs without bytecode instrumentation."
        - "Micrometer histograms or your APM — percentile-aware, not averages."
        - "GC logs with -Xlog:gc* and a filter for long pauses."

    - kind: tradeoff
      layout: paragraph
      text: "I take the latency hit of running async-profiler in production over guessing — a 30-second profile costs less than another hour of incident."

  cap: "The shape of the slowdown tells you which tool to reach for first; the rest of the toolkit confirms the call."

  followup_handoff:
    - "What would change if it's a Kubernetes pod with a CPU limit?"
    - "How would you verify the fix once you ship it?"

  tts_overrides:
    "p50": "p fifty"
    "p99": "p ninety-nine"
    "-Xlog:gc*": "x log g c star"
```

---

## E — Design

> *"Would you use X or Y here?"* — name what you're optimising for, lay out the options, weigh trade-offs, decide, and say what would change your mind.

- **Definition:** A judgement question. The interviewer is testing whether the speaker can hold trade-offs in their head and make a defensible choice — and, crucially, name the conditions under which they would unmake the choice.
- **Instinct skeleton:** `hook → optimising_for → options → tradeoffs → decision → rethink_if → cap`
- **Required beats:** all seven above.
- **Forbidden beats:** `definition` (the speaker is choosing, not introducing).
- **Per-beat ceilings:** see `word-ceilings.md` § Archetype E.
- **Depth marker:** the `rethink_if` beat itself — must contain an "if"-style trigger plus a concrete threshold.

### E — example questions
1. **`java-oop / oop-principles`** (P01) — *"Abstract class or interface for this case?"* — optimising for evolution vs sharing of behaviour; rethink-if = a second sibling needs to mix in behaviour from elsewhere.
2. **`architecture-patterns / scenario-based`** (P05) — *"Monolith or microservices for a 5-engineer team?"* — rethink-if = team size, deploy cadence, platform maturity.
3. **`messaging-events / scenario-based`** (P04) — *"Saga or 2PC for a cross-service payment?"* — rethink-if = the cost of a visible inconsistent intermediate state.

### E — fully-filled YAML example

```yaml
speakable:
  archetype: E
  pillar: P01
  audience_assumption: familiar
  voice: friendly
  familiarity_anchors:
    - "abstract class vs interface"
    - "diamond problem"
  standard_example: "Shape with abstract draw() vs Drawable interface"

  hook: "I usually start from the interface and only switch to an abstract class if I need to share behaviour."

  beats:
    - kind: optimising_for
      layout: paragraph
      text: "I'm optimising for the freedom to evolve. Interfaces leave the door open; abstract classes lock my callers into a single inheritance line."

    - kind: options
      layout: grouped_paragraphs
      groups:
        - heading: "Interface"
          text: "Pure contract. Multiple inheritance is allowed. Default methods (since Java 8) let me ship behaviour without breaking implementers."
        - heading: "Abstract class"
          text: "Lets me share state and partial implementation. Cleaner when several siblings genuinely share a chunk of code that doesn't belong on every implementer."

    - kind: tradeoffs
      layout: bullets
      items:
        - "Interface gives flexibility, costs me shared state."
        - "Abstract class gives shared state, costs me single-inheritance — and a future sibling can't mix in behaviour from elsewhere."

    - kind: decision
      layout: paragraph
      text: "I'd start with an interface. If two implementers begin duplicating the same five lines, I'd pull them into an abstract class — but only then."

    - kind: rethink_if
      layout: callout
      text: "I'd rethink the abstract class the moment a second sibling needs to mix in behaviour from elsewhere — multiple inheritance closes that door, interfaces leave it open."

  cap: "Default to interface; promote to abstract class only when shared state forces my hand."

  followup_handoff:
    - "What changed for this decision after Java 8 default methods?"
    - "When would you reach for composition instead of either?"
```

---

## F — System Design / LLD

> *"Design X."* — phased walkthrough: requirements, capacity, API, data, high-level, the bottleneck, the trade-off.

- **Definition:** A long-form prompt. The speaker structures the answer as phases the interviewer can interrupt at. Numbers replace adjectives.
- **Instinct skeleton:** `hook → requirements_fr_nfr → capacity → api → data_model → high_level → bottleneck_deep_dive → tradeoffs → cap`
- **Required beats:** all nine above.
- **Forbidden beats:** `definition`, `parts_or_states`, `step_by_step` (the phases *are* the structure; no extra scaffolding).
- **Per-beat ceilings:** see `word-ceilings.md` § Archetype F (the longest archetype by design).
- **Depth marker:** concrete capacity numbers in `capacity` *and* `bottleneck_deep_dive` (units mandatory: req/s, GB, ms, K, M, %).

### F — example questions
1. **`system-design-cases / url-shortener`** (P06) — the staple first-round prompt.
2. **`system-design-cases / rate-limiter`** (P06) — token bucket or sliding window; fan-out to N edge nodes.
3. **`low-level-design / parking-lot`** (P06) — the OOP-heavy LLD variant; the same nine beats with smaller numbers.

### F — fully-filled YAML example

```yaml
speakable:
  archetype: F
  pillar: P06
  audience_assumption: familiar
  voice: neutral
  familiarity_anchors:
    - "writes per second"
    - "p99 latency"
    - "cache hit ratio"
  standard_example: "URL shortener at 10 M URLs/day"

  hook: "I'd anchor on numbers first — capacity decides almost every design choice that follows."

  beats:
    - kind: requirements_fr_nfr
      layout: grouped_paragraphs
      groups:
        - heading: "Functional"
          text: "Shorten a long URL to a 7-character key, redirect on GET, optional custom alias, optional analytics on click."
        - heading: "Non-functional"
          text: "p99 redirect under 50 ms, 99.9% availability, links live for at least one year, no link guessable from another."

    - kind: capacity
      layout: paragraph
      text: "10 million new URLs per day means about 115 writes per second average and around 600 at peak. Reads are 50 to 1, so 30 K reads per second. Each row is roughly 500 bytes, so 1.8 GB per day raw and around 650 GB over a year."

    - kind: api
      layout: bullets
      items:
        - "POST /shorten — body has the long URL and optional alias; returns the short key."
        - "GET /{key} — 301 redirect to the long URL."
        - "GET /{key}/stats — click count and per-day breakdown."

    - kind: data_model
      layout: paragraph
      text: "One main table keyed by short key: long URL, owner, created-at, expires-at. A separate counter table or Redis HINCRBY for click counts to avoid contention on the main row."

    - kind: high_level
      layout: paragraph
      text: "Edge load balancer fronts a stateless redirect service. The redirect service reads from a Redis cache; on miss, it falls back to the primary store. Writes go through a separate write API that checks alias availability and persists."

    - kind: bottleneck_deep_dive
      layout: callout
      text: "The bottleneck is the read path under hot keys. With 30 K reads per second, a 95% cache hit ratio still leaves 1500 reads per second hitting the database. I'd shard the cache by key prefix and keep the store partitioned the same way so a hot prefix doesn't burn one node."

    - kind: tradeoffs
      layout: paragraph
      text: "Sequential keys would let me reuse a counter and trade off guessability against one less round-trip; base-62 random keys with a uniqueness check trade one extra read for unguessability. I'd take the random keys."

  cap: "Numbers picked the design — caches, sharding, and a key strategy that holds at the year-mark."

  followup_handoff:
    - "How would you handle a viral link that breaks the cache shard?"
    - "What changes if links expire after 24 hours instead of a year?"
```

---

## G — Behavioural / STAR

> *"Tell me about a time…"* — situation, task, action, result, then what you'd do differently.

- **Definition:** A first-person story prompt. The speaker is the protagonist; the interviewer is judging clarity and self-awareness, not technical depth.
- **Instinct skeleton:** `hook → situation → task → action → result → reflection → cap`
- **Required beats:** all seven above. (`reflection` is required-but-warn-only at the lint level — see `lint-rules.md` 7.6.7.)
- **Forbidden beats:** `definition`, `differences`, `mechanism`, `step_by_step`, `decision`, `rethink_if`, `parts_or_states`, `failure_mode`, `tools`, `capacity` (anything technical-archetype-shaped).
- **Per-beat ceilings:** see `word-ceilings.md` § Archetype G.
- **Depth marker:** the `reflection` beat — recommended, warn-only.

### G — example questions
1. **`behavioral / star-method`** (P12) — *"Tell me about a time you had to deliver under pressure."*
2. **`behavioral / failure-and-learning`** (P12) — *"Tell me about a time you failed."*
3. **`behavioral / conflict-resolution`** (P12) — *"Tell me about a disagreement with a teammate."*

### G — fully-filled YAML example

```yaml
speakable:
  archetype: G
  pillar: P12
  audience_assumption: beginner
  voice: friendly
  familiarity_anchors:
    - "STAR"
    - "what I'd do differently"
  standard_example: "a late-running project I owned"

  hook: "I'll take the project where I had to ship a payment integration in three weeks."

  beats:
    - kind: situation
      layout: paragraph
      text: "We were rolling out a new merchant onboarding flow. The chosen payment provider had to be live before our marketing launch, and the launch date was non-negotiable."

    - kind: task
      layout: paragraph
      text: "I owned the integration end-to-end — build, test, soak, and the rollout plan. The team was three engineers, and the original estimate had been six weeks."

    - kind: action
      layout: paragraph
      text: "I cut scope to a single-currency, single-region launch, deferred the analytics integration, and pair-programmed the webhook handlers since they were the riskiest piece. We shipped behind a feature flag and rolled out one merchant per day for the first week."

    - kind: result
      layout: paragraph
      text: "We hit the launch date with one rollback in the first week — a webhook retry storm we caught in two hours. By week three the rollout was clean and analytics shipped right after."

    - kind: reflection
      layout: callout
      text: "Looking back, I'd have escalated for a fourth engineer two weeks earlier. I held the ask because I thought we'd recover, and we mostly did — but the cost was a pair of late nights I shouldn't have absorbed."

  cap: "Tight scope, feature flags, and a one-merchant-a-day rollout were what kept the launch from breaking."

  followup_handoff:
    - "Tell me about a time the scope cut was the wrong call."
    - "How do you decide when to escalate for more people?"
```

---

## Choosing an archetype: a 30-second decision tree

Walk these in order. The first **yes** wins.

1. Is the prompt a story prompt — *"Tell me about a time…"* / *"Describe a situation when…"* / behavioural? **→ G**.
2. Is the prompt *"Design X"* with capacity numbers expected (URL shortener, news feed, parking lot, rate limiter)? **→ F**.
3. Is the prompt a judgement call between named alternatives in a specific situation — *"Would you use X or Y here?"* / *"X or Y for this case?"* — where the speaker has to **decide** rather than compare in the abstract? **→ E**.
4. Is the prompt a troubleshooting / on-call situation — *"How would you debug…"* / *"The service is slow, walk me through…"* / *"Diagnose this"*? **→ D**.
5. Is the prompt an *"X vs Y"* comparison without a forced decision — the speaker lays out the axes and lets the listener choose? **→ B**.
6. Is the prompt asking *"How does X work under the hood?"* / *"Walk me through what happens internally"* / *"What does the JVM do when…"*? **→ C**.
7. Otherwise, the prompt is *"What is X?"* / *"Explain X"* — a conceptual definition. **→ A**.

> Edge case: a question can flip archetypes by framing. *"What is a HashMap?"* is **A**. *"How does HashMap work internally?"* is **C**. *"HashMap vs TreeMap?"* is **B**. The archetype is decided by the **prompt's verb**, not the topic.
