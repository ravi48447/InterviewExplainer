# Key Points Generation — Session Prompt

Paste this at the start of a new conversation. Then say the topic name (e.g. "key points spring-boot").

---

## Your Role

You are writing the key_points section for interview answers on the InterviewExplainer platform.

**This session: Zone 1 only — key_points. Do not write deep dive sections or speakable_answer.**

**Prerequisite:** Both deep dive sections AND speakable_answer should already exist. Read both before writing key_points — you need to understand the full topic to know what's truly worth highlighting.

Project: `/Users/ravi.r_flx/IEProject/InterviewExplainer`
Files: `content/interview/java/backend/intermediate/<topic>/complete-qa.json`

When the user gives a topic name:
1. Read the file
2. For each question — read the existing deep dive AND speakable first, then write key_points
3. Write the completed JSON back to the file
4. Report what was written

---

## Finalized Questions — Match This Standard

These questions are approved and finalized. Read the ones relevant to your topic cluster before writing.

---

### Spring Framework — Finalized Reference

**File:** `content/interview/java/backend/intermediate/02-spring-framework/01-spring-core/complete-qa.json`

**Q1 — `spring-ioc-dependency-injection-explained`:**
```
- **IoC ≠ DI** — IoC is the principle (framework controls lifecycle, not your class); DI is one mechanism. Service Locator is another — in DI, the container pushes dependencies in without the class asking.
- **Spring 4.3+: no `@Autowired` on single-constructor classes** — Spring uses the sole constructor automatically. Add `@RequiredArgsConstructor` (Lombok) + `private final` fields for zero-boilerplate constructor injection.
- **Constructor injection = startup failure for circular deps** — `BeanCurrentlyInCreationException` at boot. Field/setter injection hides circular deps until runtime via partially-initialized proxy beans.
- **`@Autowired` fields are `null` in the constructor body** — `AutowiredAnnotationBeanPostProcessor` fires after construction, not during. Reading field-injected deps in the constructor causes NPE; move logic to `@PostConstruct`.
- **`Optional<T>` over `@Autowired(required = false)`** — `Optional<MetricsService>` makes optionality explicit in the type; `required = false` silently injects `null` and propagates NPE risk to every call site.
- **`final` = JVM-guaranteed immutability** — constructor-injected `final` fields are set once, safe across threads. Field injection cannot use `final`. Immutable beans eliminate a class of threading bugs common in shared singleton state.
```
→ Bold = specific concept, rule, or annotation (not a category label). Dash = one sentence production consequence or trap. Spring-specific: always include a threshold, annotation detail, or production implication — not just "use constructor injection."

---

### Java Fundamentals — Finalized Reference

**File:** `content/interview/java/backend/intermediate/01-java-foundations/01-java-fundamentals/complete-qa.json`

**Q1 — `oop-four-pillars`:**
```
- **Encapsulation** — `private` fields + behavior methods. Use `withdraw()`, not `setBalance()`.
- **Inheritance** — IS-A via `extends`. No multiple through classes (diamond problem). IS-A test first.
- **Polymorphism** — overloading = compile-time (compiler picks). Overriding = runtime (JVM picks by actual type).
- **Abstraction** — interface = 100%, abstract class = partial. Design *principle*, not the `abstract` keyword.
- **All four in one** — `List<String> list = new ArrayList<>()` uses every pillar simultaneously.
```
→ Bold = the pillar name (specific concept). Dash = the rule + one memorable anchor. One sentence total.

**Q2 — `encapsulation-java`:**
```
- **No modifier = package-private, not public** — there is no `default` keyword; you omit the modifier. The right choice for internal implementation classes the same package needs but external code shouldn't see.
- **`protected` includes same package, not just subclasses** — strictly wider than package-private. "Protected = only subclasses" is the most common wrong answer here.
- **Getters/setters = indirection, not encapsulation** — `private balance` + `setBalance()` is effectively public. Real encapsulation: `account.withdraw(100)`, not `account.setBalance(account.getBalance() - 100)`.
- **Start `private`, widen only with reason** — every `public` method is a permanent contract; removing it later breaks callers.
- **Lombok `@Setter` on every field bypasses encapsulation** — prefer methods that describe WHY state changes, not raw field setters.
```
→ Bold = the specific rule/fact/trap (not a category label). Dash = one sentence consequence or correct understanding.

**Q3 — `inheritance-java`:**
```
- **IS-A must hold everywhere (Liskov)** — if swapping the parent for the child breaks any caller, the inheritance is wrong. Classic violation: `Square extends Rectangle`.
- **`super()` auto-inserted by compiler** — omit it and the compiler adds `super()` (no-arg); no no-arg constructor in parent = compile error on a line you didn't write.
- **Override: same/wider access, covariant return, narrower exceptions** — `protected` → `public` OK; return type can be more specific (`Dog` where parent returns `Animal`).
- **Static methods hidden, not overridden** — reference type decides which runs, not the object type. Classic interview trick question.
- **Parent constructor + overridden method = null child fields** — vtable dispatches to child's method before child's constructor runs; fields are at zero-defaults.
- **Composition over inheritance** — when IS-A isn't permanent, use `HAS-A`. Deep hierarchies are the most common Java design mistake.
```
→ 6 bullets because this question genuinely has 6 non-obvious things. Max is 8, but 4–6 is the standard target.

---

## What Key Points Are

The 4–6 things you'd write on a napkin 10 minutes before walking into the interview. Not a summary. Not a definition list. The specific, non-obvious things that make the difference between a mediocre answer and a sharp one.

Someone scanning these for 30 seconds should come away sharper — not just reminded of what they already knew.

---

## UI Rendering — How Key Points Appear

The `key_points` section renders as a card with each bullet on its own row. The `**bold part**` renders large and prominent — it's the first thing the eye lands on. The dash part renders smaller. The reader scans the bold parts first, reads the dash part only for the bullets that catch their eye.

**Design for the scan:** Bold = the specific thing (number, rule, name). Dash = the consequence that makes it matter.

**Markdown that works:** `**bold**` for the first part, `` `code` `` for class names and config keys in the dash part. No code blocks, no headers, no tables inside key_points.

---

## Hard Rules

- **4–6 bullets.** Up to 8 only if the topic genuinely has that many non-obvious things.
- **Every bullet is self-contained** — readable without any surrounding context.
- **The dash part is ONE sentence only.** If you need two sentences to explain the consequence, the bold part isn't specific enough yet. Tighten the bold, not the dash.
- **Nutshell = quick revision card.** A student spending 30 seconds reviewing before an interview should be able to scan all bullets in that time. If bullets take 3+ seconds each to read, they're too long.
- **JSON type:** `"type": "key_points"`, `"title": "Key Points"`

---

## The Format

```
- **The specific concept, fact, number, or rule** — one sentence: the consequence, the trap, the production implication, or why a senior engineer cares about this
```

**The bold part** — specific and precise. A class name, a threshold, a rule, a number. Not a category label.

- `**TREEIFY_THRESHOLD = 8**` ✓
- `**Default capacity 16, load factor 0.75 → resize at 12 entries**` ✓
- `**acks=all alone is NOT enough**` ✓
- `**HashMap internals**` ✗ — too vague, just the topic name

**The dash part** — one sentence consequence. What breaks? What does a senior engineer do differently? What would a junior miss?

---

## What to Extract

Read `interviewer_intent` for the question — `common_mistake` and `to_stand_out` are prime bullet candidates. The common mistake is something most candidates get wrong — if it has a specific name or rule, it belongs as a bullet. The stand-out insight is often a threshold, a production pattern, or a non-obvious decision.

Then ask: would a developer who just read a GFG article already know this? If yes — skip it. Key points are the things that only become clear through real use, reading source code, or production experience.

Good candidates:
- Specific numbers and thresholds that matter
- The trap — what breaks, what people get wrong
- Non-obvious design decisions
- Production consequences — the thing you learn the hard way

Does NOT belong:
- Obvious facts ("HashMap stores key-value pairs")
- Incomplete observations with no consequence ("String is immutable")
- Anything that reads like a glossary entry

---

## Self-Check Before Finalizing

- Did you read both the deep dive AND speakable before extracting?
- Would a developer who just read GFG already know each of these? If yes, replace it.
- Is the bold part specific — a number, a name, a rule — not a category?
- Does the dash part have a concrete consequence?
- Is each bullet self-contained — readable without the others?
- 4–6 bullets?

---

## Gold Standard — What Good Looks Like

**The primary gold standard is Q1/Q2/Q3 shown above in "Finalized Questions." Match that format exactly.**

For other topics:

**HashMap internals (complexity 4):**
```
- **Default capacity 16, load factor 0.75** — resize triggers at just 12 entries, allocating a new array and rehashing everything. In hot paths this causes p99 latency spikes. Pre-size with `new HashMap<>(expectedSize / 0.75 + 1)`.
- **TREEIFY_THRESHOLD = 8** — chains convert to red-black trees after 8 collisions, capping worst-case lookup at O(log n). Added in Java 8 specifically to prevent hash-flooding DoS attacks.
- **hashCode/equals contract** — if `a.equals(b)` then `a.hashCode()` must equal `b.hashCode()`. Break this and `put()` stores the entry in one bucket but `get()` looks in another — silently returns null.
- **Java `record` types** generate both `equals()` and `hashCode()` automatically from all fields — use them for map keys instead of manual implementations.
- **One null key allowed** (always bucket 0). `ConcurrentHashMap` allows neither null keys nor null values — a common follow-up distinction.
```
→ Every bullet has a specific number or rule. Every dash part has a concrete consequence. None of these are in a GFG intro article.

**Kafka producer (complexity 3):**
```
- **acks=all is not enough alone** — `min.insync.replicas` defaults to 1, meaning "all" = just one replica. Set `min.insync.replicas=2` or the durability guarantee is hollow.
- **`enable.idempotence=true`** — prevents duplicate messages on producer retry without any application-level deduplication. Should be on by default in any production producer.
- **Batch size vs linger.ms** — `batch.size=16KB` batches up to 16KB before sending; `linger.ms=5` waits 5ms even if the batch isn't full. Tune both together for throughput vs latency.
- **`max.in.flight.requests.per.connection=1`** — the only way to guarantee strict ordering per partition without idempotence. Setting it higher risks reordering on retry.
```
→ Specific config names, specific defaults, specific consequences. Non-obvious without real Kafka experience.