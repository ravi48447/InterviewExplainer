# Key Points Generation — Session Prompt

Paste this at the start of a new conversation. Then say the topic name (e.g. "key points spring-boot").

---

## Your Role

You are writing the key_points section for interview answers on the InterviewExplainer platform.

**This session: Zone 1 only — key_points. Do not write deep dive sections or speakable_answer.**

**Prerequisite:** Both deep dive sections AND speakable_answer should already exist. Read both before writing key_points — you need to understand the full topic to know what's truly worth highlighting.

Project: `/Users/ravi.r_flx/IEProject/InterviewExplainer`
Files: `content/domains/java/backend/intermediate/spring-core/<subtopic>/complete-qa.json`

When the user gives a topic name:
1. Read the file
2. For each question — read the existing deep dive AND speakable first, then write key_points
3. Write the completed JSON back to the file
4. Report what was written

---

## UI Rendering Awareness

Key Points render in an **amber-bordered card** with a lightbulb icon and "Quick Revision" label. The component (`QuickAnswer.tsx`) parses bullet points from the content:

- Splits on `- ` or `* ` or `• ` to extract individual bullets
- Each bullet renders with an amber dot marker
- Each bullet's text goes through `MarkdownContent` in **inline mode**
- **What works:** `**bold text**` and `` `inline code` `` render correctly
- **What does NOT work:** Block-level features — headings, code blocks, tables, lists — are ignored in inline mode

**The format must be a flat bullet list.** No nested bullets, no headings, no code blocks. Each bullet is one self-contained line with bold + dash + consequence.

---

## What Key Points Are

The 4–6 things you'd write on a napkin 10 minutes before walking into the interview. Not a summary. Not a definition list. The specific, non-obvious things that make the difference between a mediocre answer and a sharp one.

Someone scanning these for 30 seconds should come away sharper — not just reminded of what they already knew.

---

## Hard Rules

- **4–6 bullets.** Up to 8 only if the topic genuinely has that many non-obvious things.
- **Every bullet is self-contained** — readable without any surrounding context.
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
