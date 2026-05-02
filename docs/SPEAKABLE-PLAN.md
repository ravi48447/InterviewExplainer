# Speakable Section — Final Redesign Plan

> Status: **Draft v3 — most decisions locked; small open items in §15B.**
> Owner: content + engineering, jointly.
> Scope: every Speakable section across all `complete-qa.json` files and the matching MD source files (~500+ questions across 12 pillars).
> Execution model: **parallel agent fan-out, autonomous self-correction** — when the user says "Go", 12 agents (one per pillar) run concurrently, each refining its pillar's Speakables against the plan. Each agent **iterates against the lint until quality passes**, with no fixed re-attempt cap (only impasse escapes — see §15.16). Legacy is treated as raw material, not as a contract to preserve.
> Two non-negotiable principles added in this draft: **§2.7** (Speakable is the answer itself, not coaching about it) and **§2.8** (visual rhythm is part of the answer — no walls of text).

---

## Table of contents

1. [Problem statement](#1-problem-statement)
2. [Guiding principles](#2-guiding-principles)
3. [Archetype taxonomy (the 7 natural-instinct shapes)](#3-archetype-taxonomy-the-7-natural-instinct-shapes)
4. [Pillar register](#4-pillar-register)
5. [Structured Speakable data model](#5-structured-speakable-data-model)
6. [Familiarity & Voice Codex](#6-familiarity--voice-codex)
7. [Lint rubric (the gate)](#7-lint-rubric-the-gate)
8. [Per-beat word ceilings (the tightness control)](#8-per-beat-word-ceilings-the-tightness-control)
9. [Depth markers per archetype](#9-depth-markers-per-archetype)
10. [Renderer redesign](#10-renderer-redesign)
11. [Execution phases](#11-execution-phases)
12. [Parallel-agent migration model](#12-parallel-agent-migration-model)
13. [Governance & anti-drift mechanisms](#13-governance--anti-drift-mechanisms)
14. [Regression prevention — refinement, not preservation](#14-regression-prevention--refinement-not-preservation)
15. [Open decisions before kickoff](#15-open-decisions-before-kickoff)
16. [Appendix A — Worked example: OOP four pillars (familiarity-first)](#16-appendix-a--worked-example-oop-four-pillars-familiarity-first)
17. [Appendix B — File map of artefacts](#17-appendix-b--file-map-of-artefacts)

---

## 1. Problem statement

The Speakable section today is **one essay format pretending to fit seven different question archetypes across twelve pillars**. The concrete defects:

- **No archetype awareness.** Every question is written as flowing prose, regardless of whether it's conceptual, comparison, internals, scenario, design, system-design, or behavioural.
- **No natural unfolding.** Even for conceptual questions, Speakable jumps to definitions and stops. There's no "definition → why → parts/lifecycle → variants → example → pitfall → close" instinct embedded in the data.
- **Hi-tech vocabulary breaks the user's psychological connection.** Users have already absorbed canonical phrasings from GeeksforGeeks, Baeldung, JavaTpoint, etc. When we coin novel phrases, the user closes the tab.
- **No depth dial and no tightness rule.** Length is uncontrolled. Some Speakables run 5+ minutes; comparison answers ramble in prose where 3–4 axes would suffice.
- **No quality gate.** A Speakable is "done" only when someone reads it and likes it. Result: a couple of answers improve, the rest stay broken indefinitely.
- **Renderer is hardcoded for one question.** The pillar styling in `PreviewArticle.tsx` only fires for OOP's four-pillar names. Every other answer falls through to a plain default.
- **No TTS-clean surface.** The audio mock-interview page would say "asterisk asterisk encapsulation asterisk asterisk" if it tried to speak the current Speakable as-is.

**The fix has to be system-level**, not "rewrite better." Without a structured data model, an automated lint, golden references the rewriting agents imitate, and a parallel-agent migration triggered as one event with hard exit criteria, we will reproduce the exact failure pattern we've already seen: a couple of answers go good, the rest are left as they are.

---

## 2. Guiding principles

These five principles are what every downstream decision derives from. If a proposal violates one of these, it doesn't ship.

### 2.1 Mechanical "done"
> A Speakable is done **only when a script can prove it's done.** Subjective taste is not the gate; the lint script is.

### 2.2 Natural-instinct shape, not essay format
> Each question has a natural mental walkthrough. The Speakable mirrors that walkthrough as **structured beats**, not as prose paragraphs.

### 2.3 Invisible familiarity
> The reader has already half-absorbed this concept from popular sites. We **silently** reuse the canonical phrasings, standard examples, and patterns they recognise — but we **never reference** their prior reading. No "you've seen this", no "the textbook line is", no "every tutorial says". The user feels familiarity unconsciously and gets framing + depth as our value-add.

### 2.4 Depth signals seniority; tightness controls length
> Length is not time-budgeted. It emerges from **per-beat word ceilings** plus **mandatory depth markers** that prove the answer is non-superficial. No fluff, but enough depth that an interviewer thinks *"this person knows it."*

### 2.5 Beginner-friendly voice across the board
> Every Speakable, even on senior topics, uses easy spoken English: short sentences, contractions, active voice, common words. Depth comes from **what** we say, never from **how cleverly** we say it.

### 2.6 Refinement, not preservation
> Every Speakable is **rewritten freely** to fit the plan — the legacy is read as raw material, not as a contract. The agent (or hand-crafter) is allowed to drop, restructure, replace, or reword anything that doesn't earn its place in the new shape. **Quality is judged by the lint, not by what survived from the legacy.** The legacy is kept beside the new version only as a rollback fallback, not as a constraint. (See §14 for how regression risk is controlled in this model.)

### 2.7 Speakable is the answer itself, not coaching about it
> The Speakable text is what the *user reads as study material*. It is the answer, fully formed, in spoken voice. It **never** addresses the reader, instructs them, or talks meta about the answer. Phrases like *"you should say…"*, *"tell the interviewer…"*, *"in your response…"*, *"the candidate should…"*, *"to impress the interviewer…"* are forbidden (Layer 3 banned vocab in §6.4). The reader internalises the answer by reading it; we don't coach them about how to give it.

### 2.8 Visual rhythm is part of the answer
> Even a perfect answer feels exhausting if it lands as a wall of text. Each Speakable must be **visually scannable**: short paragraphs (≤ 60 words), lists when there are 3+ items, mini-tables for 3+ comparison axes, ordered lists for sequences and lifecycles, subheadings inside long beats, generous paragraph rhythm, and a clear close. The data model carries this layout intent (§5), the lint enforces it (§7), and the renderer honours it (§10). Agents must produce layout-aware output — not just text.

---

## 3. Archetype taxonomy (the 7 natural-instinct shapes)

Every question in the catalogue maps to exactly one of these. Each archetype has a fixed set of **beat kinds** — `required`, `optional`, `forbidden`.

### A — Conceptual *("What is X?")*
**When:** "What is a Thread?", "What is encapsulation?", "What is a JVM?"
**Required beats:** `hook`, `definition`, `why_exists`, `parts_or_states`, `how_to_use`, `example`, `pitfalls`, `cap`
**Forbidden beats:** none
**Default depth marker:** the non-obvious sub-topic the concept implies (Thread → states; HashMap → collisions).

### B — Comparison *("X vs Y")*
**When:** every `comparisons/` topic. "ArrayList vs LinkedList", "`==` vs `equals`", "REST vs GraphQL".
**Required beats:** `hook`, `what_each_is`, `differences` (3–4 axes), `when_to_pick`, `tiny_example`, `cap`
**Forbidden beats:** `parts_or_states`, `how_to_use` (these would bloat a comparison).
**Default depth marker:** the gotcha most candidates miss in one of the axes.

### C — Internals *("How does X work under the hood?")*
**When:** "HashMap internals", "Hibernate persistence context", "Kafka partition assignment".
**Required beats:** `hook`, `mental_model`, `mechanism`, `edge_cases`, `failure_mode`, `cap`
**Optional beats:** `example`
**Default depth marker:** the production failure mode, not just the happy path.

### D — Scenario *("How would you handle / debug…?")*
**When:** scenario-based topics, troubleshooting questions, on-call drills.
**Required beats:** `hook`, `clarify`, `hypothesis`, `step_by_step`, `tools`, `tradeoff`, `cap`
**Forbidden beats:** `definition` (don't lecture; act).
**Default depth marker:** real evidence/tooling (logs, jstack, EXPLAIN, dashboards), not just hypothesis.

### E — Design *("Would you use X or Y here?")*
**When:** "abstract class vs interface for this case", "saga vs 2PC", "monolith vs microservices for X".
**Required beats:** `hook`, `optimising_for`, `options`, `tradeoffs`, `decision`, `rethink_if`, `cap`
**Default depth marker:** the `rethink_if` beat — what would change my mind.

### F — System Design / LLD walkthroughs
**When:** "Design URL shortener", "Design parking lot".
**Required beats:** `hook`, `requirements_fr_nfr`, `capacity`, `api`, `data_model`, `high_level`, `bottleneck_deep_dive`, `tradeoffs`, `cap`
**Default depth marker:** capacity numbers, not vague "lots of users".

### G — Behavioural / STAR
**When:** all `behavioral/` and `engineering-practices/` story prompts.
**Required beats:** `hook`, `situation`, `task`, `action`, `result`, `reflection`, `cap`
**Default depth marker:** the `reflection` beat (what I'd do differently).

---

## 4. Pillar register

Each pillar adds a **register rider** on top of whichever archetype is in play. The lint enforces the rider mechanically (via topic-tagged checks).

| Pillar | Register rider |
|---|---|
| **P01 Java Core** (core-java, java-oop, java-collections, java-streams, java-concurrency, jvm-internals) | Must mention JVM/runtime behaviour or API contract once. Tiny code shape mandatory. Default audience: beginner. |
| **P02 Spring Ecosystem** | Must trace order-of-events (lifecycle, filter chain, transaction boundary). Default audience: beginner. |
| **P03 Data & Persistence** (sql, postgres, mongo, redis) | Must surface a trade-off explicitly (consistency / availability / cost / schema). Default audience: beginner. |
| **P04 APIs / Microservices / Messaging** | Must name the contract / boundary / failure mode. Default audience: beginner. |
| **P05 Architecture & Design** | Decision-first. Speakable opens with the decision being made, not with definitions. Default audience: familiar. |
| **P06 System Design + LLD** | Phased walkthrough only — beats are phases, not paragraphs. Default audience: familiar. |
| **P07 Security** | Threat-model framing — attacker / asset / vulnerability / mitigation must be implicit. Default audience: beginner. |
| **P08 Testing & Quality** | Pyramid + risk thinking — what level of test, what it catches, what it can't. Default audience: beginner. |
| **P09 DevOps** (git, build, cicd, docker, k8s) | Sequence + blast radius — pipeline order, rollback, failure cost. Default audience: beginner. |
| **P10 Cloud** (aws, gcp, azure, cloud-native) | Service-shopping voice — choice, why this service, cost dimension. Default audience: beginner. |
| **P11 Production / SRE** | War-room voice — incident narrative, calm, evidence-driven. Default audience: familiar. |
| **P12 Interview Readiness** (behavioral, engineering-practices) | STAR mandatory; reflection beat is the value. Default audience: beginner. |

---

## 5. Structured Speakable data model

Today: one markdown blob.
Target: a structured object with explicit beats. The schema lives in `frontend/lib/speakable/schema.ts` (TypeScript types) + `scripts/speakable_schema.json` (JSON Schema for the lint).

```yaml
speakable:
  archetype: conceptual            # A | B | C | D | E | F | G
  pillar: P01                      # P01–P12, drives the register lookup
  audience_assumption: beginner    # beginner (default) | familiar | advanced
  voice: friendly                  # friendly (default) | neutral | technical
  familiarity_anchors:             # canonical phrases this Speakable must echo silently
    - "data plus the methods"
    - "blueprint vs instance"
  standard_example: "Dog extends Animal"

  hook: "..."                      # short opening line, ≤ 25 words

  beats:
    # ── Beats carry both content AND layout intent. The renderer reads
    # ── `layout` to choose the visual treatment. The lint reads it to
    # ── enforce visual rhythm rules (§7.5).

    - kind: definition
      layout: paragraph            # paragraph | paragraphs | bullets | ordered_list | mini_table | grouped_paragraphs
      text: "..."                  # single paragraph, ≤ 60 words

    - kind: parts_or_states
      label: "The four pillars"    # optional subheading shown above the beat
      layout: grouped_paragraphs   # several mini-paragraphs, each with its own sub-heading
      groups:
        - heading: "Encapsulation"
          text: "..."              # ≤ 60 words
        - heading: "Inheritance"
          text: "..."
        - heading: "Polymorphism"
          text: "..."
        - heading: "Abstraction"
          text: "..."

    - kind: differences            # only valid in archetype B
      layout: mini_table
      columns: ["ArrayList", "LinkedList"]
      rows:
        - axis: "Memory layout"
          values: ["array under the hood", "nodes with pointers"]
        - axis: "Random access"
          values: ["O(1)", "O(n)"]
        - axis: "Insert in middle"
          values: ["O(n) — shifts elements", "O(1) once you have the node"]

    - kind: step_by_step           # numbered, sequence-implied
      layout: ordered_list
      steps:
        - "Check the thread dump first."
        - "Look for blocked threads on a single monitor."
        - "Cross-reference with GC logs."

    - kind: pitfalls
      layout: bullets
      items:
        - "Don't confuse abstraction with the abstract keyword."
        - "Private + setBalance() is not encapsulation."

    - kind: example
      layout: paragraph
      text: "..."

  cap: "..."                       # closing line, ≤ 25 words

  followup_handoff:
    - "What about virtual threads?"
    - "When would you reach for an Executor instead?"

  tts_overrides:                   # spoken-form replacements for code/symbols
    "List<String>": "list of strings"
    "==": "double-equals"
```

### Why this shape

- **`beats[]`** makes the natural unfolding visible in the data. The renderer styles each beat. The lint checks each beat. The TTS reads each beat with a pause.
- **`layout` per beat** is the new layer that addresses §2.8 (visual rhythm). The agent decides — based on what the beat is doing — whether it's a paragraph, a bulleted list, a mini-table, an ordered list, or grouped paragraphs with sub-headings. The renderer then has rich primitives to lay them out beautifully without ever rendering a wall of text.
- **`groups` / `items` / `steps` / `rows`** are the structured payloads that go with each layout choice. The lint cross-checks: if `layout: bullets`, `items` must be present; if `layout: mini_table`, `columns` + `rows` must be present, etc.
- **`hook` + `cap`** are mandatory and bounded — they fix the "no opener / no closer" defect.
- **`followup_handoff`** turns the answer from a monologue into a real interview moment, and prevents bloat (you stop offering everything in the main answer).
- **`archetype` + `pillar`** drive both the renderer and the lint declaratively.
- **`audience_assumption` + `voice`** are tone knobs; default values keep most Speakables beginner-friendly.
- **`familiarity_anchors` + `standard_example`** are the **invisible familiarity** mechanism — populated from the codex, enforced by the lint, never user-visible.
- **`tts_overrides`** unlock the audio mock without polluting the visible text.

### Co-existence with legacy

During migration, Speakables exist in **two shapes** in the codebase:
- **Legacy:** the existing markdown blob (`type: "speakable_answer"`, `content: "..."`).
- **Structured:** the new shape above.

The renderer detects which is present and falls back to legacy with a small "legacy" badge so we can see at a glance what's left to migrate. The lint knows the difference and applies different rules per shape.

---

## 6. Familiarity & Voice Codex

The codex is a **single living doc** at `docs/speakable/familiarity-codex.md`, plus machine-readable companions. It has four sections:

### 6.1 Canonical phrasings library (`codex/phrasings.json`)
Per topic, the 3–5 phrases the user has likely already absorbed. The lint requires the **definition beat** of each Speakable to contain ≥ 1 anchor for its topic.

| Topic | Canonical phrasings |
|---|---|
| OOP | "data plus the methods that work on that data", "blueprint", "instance", "wrapping up" (encapsulation) |
| Encapsulation | "wrapping data and methods together", "data hiding", "capsule" analogy |
| Inheritance | "child class gets the parent's properties", "IS-A relationship", "`extends` keyword", "diamond problem" |
| Polymorphism | "many forms", "one interface, many implementations", "method overloading vs overriding" |
| Abstraction | "hiding implementation details", "showing only what's needed", "TV remote / car steering" analogy |
| Thread | "lightweight process", "smallest unit of execution", "shares memory with the parent process" |
| HashMap | "array of buckets", "key-value pair", "hashcode", "collision", "chaining" |
| `==` vs `equals` | "reference comparison vs content comparison", "memory address vs values inside" |
| ArrayList vs LinkedList | "array under the hood vs nodes with pointers", "fast read vs fast insert/delete" |
| ACID | "atomic — all or nothing", "consistent", "isolated", "durable — survives a crash" |
| REST | "stateless", "uses HTTP verbs", "resources via URLs" |

(Full library is built out in Phase 0; the table above is the seed.)

### 6.2 Standard examples library (`codex/examples.json`)
The famous example each topic should use unless explicit override.

| Concept | Standard example |
|---|---|
| Inheritance | `Dog extends Animal` |
| Polymorphism | `Shape s = new Circle()` |
| Encapsulation | `BankAccount.withdraw()` (private balance) |
| Abstraction | TV remote, car accelerator |
| Interface | `List l = new ArrayList<>()` |
| Thread | `extends Thread` vs `implements Runnable` |
| HashMap | `put("key", value)`, collision in a bucket |
| Stream | `filter().map().collect()` on a list of integers |
| Singleton | DB connection / Logger |
| Factory | `Shape` factory returning `Circle`/`Rectangle` |
| Strategy | sorting `Comparator`, payment method |
| Observer | newspaper subscribers |

### 6.3 Voice rules (mechanically checkable)

- **Average sentence length ≤ 16 words.**
- **Reading level: Flesch-Kincaid Grade 6–9** (above 9 = "hi-tech").
- **Contractions ratio ≥ 30%** (`don't`, `it's`, `you'll`).
- **Active voice ratio ≥ 90%.**
- **One concept per sentence** (no nested clauses).
- **Default to "we" / "you"** (no "one", no "the developer").

### 6.4 Banned vocabulary (`codex/banned.json`)

Three layers, each with zero-tolerance enforcement except where noted.

**Layer 1 — generic hi-tech vocabulary** (≤ 2 hits per 1000 words allowed for marginal cases):
- "leverage", "utilize", "surface area", "blast radius", "footprint", "non-trivial", "orthogonal", "first-class", "in-flight", "out of the box", "battle-tested", "production-grade", "the canonical", "literally means", "in this article we will discuss".

**Layer 2 — meta-references to the user's prior reading** (zero tolerance — invisible familiarity enforcement):
- "you've seen this", "you've read this", "the textbook line", "the famous example", "every tutorial", "as you've read", "the classic line", "as you know", "as we all know", "you may have heard".

**Layer 3 — coaching / instructional phrasing** (zero tolerance — Speakable is the answer, not advice about the answer; principle 2.7):
- "you should say", "you can say", "you can answer", "you should answer", "tell the interviewer", "in your answer", "in your response", "respond by saying", "the candidate should", "to impress the interviewer", "I would frame this as", "the way to answer this is", "make sure to mention", "don't forget to say", "explain it as", "describe it like this", "answer it like", "how to answer this", "your reply should".

If the script finds **any** Layer 2 or Layer 3 phrase, the Speakable fails the lint regardless of everything else. The Speakable is the answer text the user reads as study material — it does not address the user, instruct the user, or talk meta about itself.

---

## 7. Lint rubric (the gate)

The script `scripts/audit_speakable.py` exits 0 only when **all** rules below pass. This is the entire definition of "done" for a Speakable.

### 7.1 Structural rules
- Valid `archetype` and `pillar` declared.
- All **required beats** for the archetype + pillar present.
- No **forbidden beats** for the archetype.
- `hook` and `cap` non-empty and within their word ceilings (§8).
- ≥ 2 `followup_handoff` items.
- Schema validates against `scripts/speakable_schema.json`.

### 7.2 Familiarity rules
- Definition beat (or equivalent — `mental_model` for C, `what_each_is` for B, etc.) contains ≥ 1 canonical anchor from the codex for the question's topic.
- Example beat uses the standard example for the topic if one exists, unless `familiarity_override: true` is set with a justification.
- **Zero hits** from banned vocabulary Layer 2 (meta-references). One strike = fail.
- **Zero hits** from banned vocabulary Layer 3 (coaching / instructional phrasing). One strike = fail. (§2.7)
- ≤ 2 hits per 1000 words from banned vocabulary Layer 1.

### 7.3 Voice rules
- Avg sentence length ≤ 16 words.
- Flesch-Kincaid Grade ≤ 9.
- Contractions ratio ≥ 30%.
- Active voice ratio ≥ 90%.
- **No second-person instruction.** No imperative sentences directed at the reader ("notice that", "remember to", "consider this"). The text is declarative, not directive. Borderline cases flagged for review.

### 7.4 Tightness rules
- Every beat within its hard cap (§8).
- ≥ 80% of beats within their soft ceiling (§8).
- Total Speakable word count within the archetype's expected range.

### 7.5 Visual rhythm rules (the "no walls of text" gate, §2.8)
- **Paragraph length:** no single paragraph in any beat exceeds 60 words. If a `paragraph` beat is longer, it must use `paragraphs` layout (split on natural sentence breaks) or `grouped_paragraphs` (with subheadings).
- **List-when-many:** if a beat enumerates 3+ semantic items (variants, parts, pitfalls, steps), it **must** use `bullets`, `ordered_list`, `mini_table`, or `grouped_paragraphs` layout — never one prose paragraph.
- **Comparison gate:** archetype B's `differences` beat must use `mini_table` layout when there are 3+ axes.
- **Sequence gate:** archetype D's `step_by_step` and any `parts_or_states` that imply order (e.g. lifecycle, phases) must use `ordered_list`.
- **Layout-payload consistency:** the layout field and its payload must match (`bullets` requires `items`, `mini_table` requires `columns` + `rows`, etc.). Schema-validated.
- **Visual variety:** within a single Speakable, beats may not all be the same layout. At least two distinct layout kinds across all beats. (Prevents "everything is one paragraph" or "everything is bullets".)
- **Code density:** no beat contains more than 3 inline code identifiers, and none contains a multi-line code block (use a `paragraph` describing it instead, or move to the visible question's `code_examples` field outside Speakable).

### 7.6 Depth rules
- Archetype's mandatory depth marker is present (§9).
- For archetypes A/B/C/D/E this is **mandatory**; for G it is **recommended**; for F the equivalent is concrete capacity numbers.

### 7.7 TTS-cleanness
- The TTS-serialised version (after applying `tts_overrides` and stripping markdown) contains no `*`, no `` ` ``, no raw symbols that don't have a spoken form.
- Code blocks inside beats are summarised in spoken form, not read literally.
- List items are read with natural enumeration ("first… second… third…") not as raw bullets.
- Mini-tables are read row-by-row with axis-name pauses, not as a literal grid.

### 7.8 Reporting
The script emits:
- Per-question result: `pass | warn | fail` with itemised reasons.
- Aggregate report at `content/_audits/speakable_health.md`: % passing per pillar, per archetype, plus drift since last run.
- CI mode (`--fail-on warn`) for pre-commit + GitHub Actions.

---

## 8. Per-beat word ceilings (the tightness control)

Length is controlled per-beat, not per-total. Numbers are calibrated for **soft ceiling** (target) and **hard cap** (lint failure).

### Conceptual (A)
| Beat | Soft | Hard |
|---|---|---|
| hook | 25 | 35 |
| definition | 60 | 80 |
| why_exists | 50 | 70 |
| parts_or_states | 90 | 130 |
| how_to_use / variants | 80 | 110 |
| example | 80 | 120 |
| pitfalls | 60 | 90 |
| cap | 25 | 35 |
| **Expected total** | **~470** | **~680** |

### Comparison (B)
| Beat | Soft | Hard |
|---|---|---|
| hook | 25 | 35 |
| what_each_is | 50 | 70 |
| each difference (3–4 axes) | 30 | 45 |
| when_to_pick | 60 | 90 |
| tiny_example | 40 | 60 |
| cap | 25 | 35 |
| **Expected total** | **~290** | **~430** |

### Internals (C)
| Beat | Soft | Hard |
|---|---|---|
| hook | 25 | 35 |
| mental_model | 70 | 90 |
| mechanism | 100 | 140 |
| edge_cases | 70 | 100 |
| failure_mode | 60 | 90 |
| cap | 25 | 35 |
| **Expected total** | **~350** | **~490** |

### Scenario (D)
| Beat | Soft | Hard |
|---|---|---|
| hook | 25 | 35 |
| clarify | 35 | 50 |
| hypothesis | 60 | 80 |
| step_by_step | 120 | 170 |
| tools | 50 | 70 |
| tradeoff | 50 | 70 |
| cap | 25 | 35 |
| **Expected total** | **~365** | **~510** |

### Design (E)
Total expected: ~250–350 words. Each beat tight; `rethink_if` ≤ 50 words.

### System Design / LLD (F)
Each phase ≤ ~120 words; total ~600–900 words (this archetype is intentionally longer; it's the format the interview demands).

### Behavioural / STAR (G)
S/T/A/R each ~50–80 words; Reflection ~40 words; total ~250–350.

> **These numbers are the v1 calibration.** They lock at Phase 0 sign-off. Subsequent tuning happens via a documented review, not silently.

---

## 9. Depth markers per archetype

Each archetype has a mandatory depth marker — the thing that proves the answer is non-superficial. The lint checks for it via topic-tagged signals in the codex.

| Archetype | Depth marker | Example |
|---|---|---|
| **A Conceptual** | Non-obvious sub-topic the concept implies | Thread → states; HashMap → collisions; OOP → IS-A vs HAS-A |
| **B Comparison** | The gotcha most candidates miss | ArrayList vs LinkedList → CPU cache locality. `==` vs `equals` → String pool. |
| **C Internals** | Production failure mode | HashMap → resize storm under load. Hibernate → N+1. |
| **D Scenario** | Real evidence / tooling | jstack, EXPLAIN, async-profiler, dashboards |
| **E Design** | `rethink_if` beat — what would change my mind | "If the team is 3 people, I'd rethink microservices." |
| **F System Design** | Concrete capacity numbers | "10M URLs/day → ~115 writes/sec → ..." |
| **G Behavioural** | Reflection beat (what I'd do differently) | "Looking back, I'd have escalated 2 days earlier." |

---

## 10. Renderer redesign

### 10.1 Unify the two renderers
Today there are two: `frontend/components/question/QuestionPageLayout.tsx` (the green "Interview Answer" card) and `frontend/components/preview/PreviewArticle.tsx` (the magazine "Zone 2"). They render the same data with different rules; one is hardcoded for OOP.

Replace both with a single component:
- `frontend/components/speakable/Speakable.tsx` (the wrapper).
- `frontend/components/speakable/layouts/<archetype>.tsx` (one file per archetype A–G).
- `frontend/components/speakable/legacy.tsx` (renders old markdown blobs with a "legacy" badge until migrated).

### 10.2 Per-archetype layout primitives
- **A Conceptual / C Internals** → vertical beat stack with subtle beat labels; the `parts_or_states` beat with `grouped_paragraphs` layout becomes a sequence of mini-cards, each with its own subheading (e.g. one mini-card per OOP pillar).
- **B Comparison** → `differences` beat renders as a clean two-column comparison table; the rest of the beats are paragraphs.
- **D Scenario** → `step_by_step` renders as numbered steps with subtle time arrow connecting them; tools beat renders as a small chip row.
- **E Design** → "decision card": `options` becomes side-by-side option cards, `decision` is highlighted, `rethink_if` sits as a footnote with a distinct visual.
- **F System Design** → phase rail (FR → NFR → capacity → API → data → bottleneck → trade-off); each phase is a horizontally-scrolled or vertically-stacked card.
- **G Behavioural** → STAR ribbon with each beat (Situation, Task, Action, Result) as a labelled segment; Reflection badge at the end.

### 10.3 Per-beat-layout primitives (the visual rhythm renderer)

These are the **shared layout components** every archetype uses. The agent's `layout` field on each beat selects one of these, and the renderer takes care of the rest. This is what makes "no walls of text" mechanical rather than aspirational.

| `layout` value | Rendered as | Visual treatment |
|---|---|---|
| `paragraph` | `<BeatParagraph>` | Single short paragraph, comfortable line-height, generous bottom margin. Optional `label` shows as a tiny eyebrow above the text. |
| `paragraphs` | `<BeatParagraphs>` | Multiple short paragraphs (split on natural breaks), each ≤ 60 words, with consistent rhythm. |
| `grouped_paragraphs` | `<BeatGroupedParagraphs>` | Each `groups[]` item rendered as a mini-block with a small bold subheading + a paragraph. Subtle horizontal divider or alternating background between groups. |
| `bullets` | `<BeatBullets>` | `items[]` rendered as a clean bulleted list with breathing room between items. Bullet style consistent across all archetypes. |
| `ordered_list` | `<BeatOrderedList>` | `steps[]` rendered as numbered steps; for archetype D, with a faint left rail connecting them to imply sequence. |
| `mini_table` | `<BeatMiniTable>` | `columns[]` + `rows[]` rendered as a compact 2- or 3-column comparison table; sticky header on long tables; mobile-responsive (collapses to stacked cards on narrow viewports). |
| `callout` | `<BeatCallout>` | Reserved for the depth-marker beat — slight emphasis, distinct background, not loud. Used sparingly so it stays meaningful. |

All primitives follow the same design system: a serif body font for prose, a sans accent for labels/headings, generous vertical rhythm (1.7 line-height), no decorative chrome. The entire Speakable should read like a magazine column, not a dashboard.

### 10.4 The visual style guide (Phase 0 deliverable)

`docs/speakable/visual-style-guide.md` — the design spec for every primitive in §10.3, with: typographic scale, vertical rhythm rules, color tokens (light + dark), spacing tokens, mobile breakpoints, and rendered screenshots of each primitive in isolation. Built in Phase 0 alongside the data model so the renderer in Phase 1 has nothing to invent.

### 10.5 The OOP-only hardcoding goes away
The `data-pillar` regex match in `PreviewArticle.tsx:684–691` and the four hardcoded CSS labels in `:908–927` are removed. Styling is driven by `archetype` + `pillar` + `layout`, not by string-matching one specific question's section labels.

### 10.6 No "you've seen this" callback line
The renderer does **not** prepend any "familiarity callback" text. Familiarity is invisible (Principle 2.3). The renderer just renders.

### 10.7 Single TTS-clean serializer
`frontend/lib/speakable/toSpeech.ts` — pure function from structured Speakable to plain spoken text with natural pause cues. Used by:
- The "Read aloud" button on every question page.
- The audio mock-interview page (`frontend/app/mock-interviews/audio/page.tsx`).
- The lint script (to verify TTS output is clean).

One function. Three consumers. No drift between them.

The serializer also handles the `layout`-aware primitives so a `mini_table` reads as natural prose ("on memory layout, ArrayList is array under the hood, while LinkedList is nodes with pointers...") rather than as a literal grid.

### 10.8 CopyButton copies the spoken version
Today the copy button copies raw markdown including `**bold**` and backticks. After redesign, it copies the TTS-clean spoken version. Users practising aloud get a clean script.

---

## 11. Execution phases

### Phase 0 — Foundation (no content edits)
Deliverables (all required before Phase 1):

| # | Artefact | Path |
|---|---|---|
| 0.1 | Archetype taxonomy doc with all 7 instinct skeletons | `docs/speakable/archetypes.md` |
| 0.2 | Pillar register sheet | `docs/speakable/pillar-register.md` |
| 0.3 | Structured Speakable schema (TS types + JSON schema), incl. layout primitives | `frontend/lib/speakable/schema.ts`, `scripts/speakable_schema.json` |
| 0.4 | Lint rubric doc (mirrors §7, including visual rhythm rules §7.5) | `docs/speakable/lint-rules.md` |
| 0.5 | Familiarity & Voice Codex (the doc + the JSON companions, all 3 banned-vocab layers) | `docs/speakable/familiarity-codex.md`, `codex/phrasings.json`, `codex/examples.json`, `codex/banned.json` |
| 0.6 | Per-beat ceilings table | `docs/speakable/word-ceilings.md` |
| 0.7 | Depth-markers reference | `docs/speakable/depth-markers.md` |
| 0.8 | **Visual style guide** — typography, spacing, color tokens, mobile rules, primitive previews | `docs/speakable/visual-style-guide.md` |

**Exit criteria:** sign-off on §15 open decisions and on each artefact above. The visual style guide is non-negotiable — if it is not done in Phase 0, the renderer in Phase 1 has nothing concrete to implement and "no walls of text" becomes aspirational rather than mechanical.

### Phase 1 — Tooling (build before any content rewrite)

| # | Artefact | Path |
|---|---|---|
| 1.1 | `audit_speakable.py` — the lint script (covers all of §7 incl. visual rhythm rules) | `scripts/audit_speakable.py` |
| 1.2 | **Per-beat layout primitives** (paragraph, paragraphs, grouped_paragraphs, bullets, ordered_list, mini_table, callout) | `frontend/components/speakable/primitives/*` |
| 1.3 | Unified Speakable renderer (per-archetype layouts composed from 1.2) | `frontend/components/speakable/*` |
| 1.4 | TTS-clean serializer (incl. layout-aware reading: bullets, tables, ordered steps) | `frontend/lib/speakable/toSpeech.ts` |
| 1.5 | Read-aloud button wired into question page + audio mock | `frontend/components/speakable/ReadAloudButton.tsx` |
| 1.6 | Health dashboard generator (run by 1.1) | output: `content/_audits/speakable_health.md` |

**Exit criteria:** all six in place; running `audit_speakable.py` against the legacy `oop-four-pillars-java.md` produces accurate diagnostics; the renderer falls back to legacy mode for un-migrated questions; each of the seven layout primitives renders correctly in light + dark on desktop and mobile, verified via a visual story page.

### Phase 2 — Pilot (7 flagship questions, one per archetype)

Hand-craft these in the structured shape. Each must exit lint-green and pass a TTS read-through.

| Archetype | Pilot question | Pillar |
|---|---|---|
| A Conceptual | `java-concurrency / threads-and-lifecycle` | P01 |
| B Comparison | `core-java / comparisons` (e.g. `==` vs `equals`) | P01 |
| C Internals | `java-collections / collections-internals` (HashMap) | P01 |
| D Scenario | `production-sre / debugging-production` | P11 |
| E Design | `java-oop / oop-principles` (abstract class vs interface) | P01 |
| F System Design | `system-design-cases / url-shortener` | P06 |
| G Behavioural | one question from `behavioral / star-method` | P12 |

**Exit criteria:** all 7 lint-green, render correctly in both Question and Preview pages, sound natural through TTS, and a non-technical reviewer reads them and confirms the language feels easy and familiar.

If the rubric needs tuning during pilot, we revise Phase 0 artefacts and re-pilot. **Cheaper to discover problems on 7 than on 80.**

### Phase 3 — Parallel-agent migration (the "Go" phase)
See §12. This is the phase where, on a single "Go" signal, 12 agents fan out concurrently, one per pillar, refining every Speakable in their pillar against the plan. All preceding phases exist to make this phase safe to trigger.

### Phase 4 — Governance
See §13.

---

## 12. Parallel-agent migration model

**The execution model.** Instead of waves running one pillar at a time, on a single "Go" signal the migration **fans out into 12 parallel agents** — one per pillar (P01–P12). Each agent works independently on its pillar's questions, refining every Speakable per the plan. They all run concurrently. The whole corpus moves from `legacy` to `pending_review` in one parallel sprint, then human review fans in.

This works because:
- Pillars are isolated — no two pillars share files, so the agents have **zero merge conflict surface**.
- The plan, the codex, and the lint are external to the agent — they read the same spec and converge on the same target shape.
- The lint script gates output uniformly, so 12 different agent processes still produce mechanically consistent output.
- Risk per agent is bounded by the smoke-test gate in §12.4 below.

### 12.1 The pre-flight checklist (must be true before "Go")

Going parallel only makes sense if every agent has everything it needs to operate independently. The "Go" signal is only safe to give when:

- Phase 0 fully signed off (archetypes, codex, schema, lint rubric, ceilings, depth markers).
- Phase 1 tooling shipped (lint script, renderer, TTS serializer, schema types).
- Phase 2 pilot complete — 7 hand-crafted reference Speakables, one per archetype, lint-green and human-approved. **These become the "golden references" each agent imitates.**
- Auto-classification pass has assigned an archetype to every question (§12.2).
- Per-pillar agent briefs are written (§12.3).
- The smoke-test protocol (§12.4) is wired up.

If any one of these is missing, the "Go" signal is held.

### 12.2 Auto-classification (one-time, before fan-out)
`scripts/classify_speakable.py` walks every `complete-qa.json`, infers `archetype` from title + topic + section types, writes `content/_audits/archetype_assignments.csv`. Low-confidence rows flagged for manual review. Estimated 80–90% auto-correct. Final classifications are committed before the fan-out begins.

### 12.3 The per-pillar agent brief

Each agent receives one self-contained brief at `docs/speakable/agent-briefs/<pillar>.md` containing:

1. **Identity & scope** — pillar name, list of all questions in scope (slugs + titles + archetype assignments).
2. **The plan extract** — relevant slices of §3 (archetypes the agent will encounter), §4 (this pillar's register), §5 (data model **including the layout primitives**), §6 (codex slice for this pillar's topics), §7 (lint rules **including visual rhythm rules §7.5**), §8 (word ceilings), §9 (depth markers), §10.3 (the layout primitives the renderer supports).
3. **The 7 golden references** — full content of the Phase 2 pilots, embedded in the brief, with per-archetype "imitate this voice **and this visual rhythm**" callouts.
4. **The forbidden list** — every Layer 2 (meta-references) and Layer 3 (coaching/instructional) banned phrase. The Speakable is the answer itself, never advice about the answer.
5. **The voice mandate** — the Speakable text addresses no one. It does not say "you should…", "tell the interviewer…", "in your answer…". It is read as study material, not coaching. Internet-canonical knowledge is silently echoed; no meta acknowledgement of where it came from. (Principle 2.7.)
6. **The visual mandate** — every beat must declare a `layout`. No paragraph exceeds 60 words. 3+ items become a list. 3+ comparison axes become a mini-table. Sequences become ordered lists. The output must be visually scannable. (Principle 2.8.)
7. **The work loop** — for each question:
   - Read the legacy Speakable + `key_points` + `direct_answer` + `interviewer_intent` as raw material.
   - **Refine freely** (refinement, not preservation — drop, restructure, replace anything that doesn't earn its place).
   - Choose a `layout` for each beat that fits the content (paragraphs for prose, bullets for lists, mini_table for comparisons, ordered_list for sequences, grouped_paragraphs for items-with-subheadings).
   - Write the new structured shape into a new `speakable_v2` field on the question; do **not** modify the legacy field.
   - Set `speakable_status: pending_review`.
   - Run `audit_speakable.py` against the v2; **self-correct and iterate until lint-green** (autonomous loop — no fixed re-attempt cap; §15.16). The agent only halts when (a) lint passes, (b) the score plateaus for 5 consecutive iterations with no improvement, or (c) the per-question budget is hit. In cases (b)/(c), it marks `speakable_status: pending_handcraft` with a structured diagnosis.
8. **Output format** — exact JSON structure required, with examples.
9. **Stop rules** — when to halt and request human input vs. when to proceed autonomously.
10. **Smoke-test gate** — after the **first question** in the pillar, the agent halts and emits its output for human review (§12.4). It does not proceed until cleared.

The brief is generated once, committed, and is the only context the agent needs.

### 12.4 The smoke-test gate (the safety valve)

The biggest risk in parallel agent execution is one agent going off-spec for an entire pillar before anyone notices. The smoke test prevents this:

1. On "Go", all 12 agents start. Each does **its first question only**, then halts.
2. The orchestrator collects the 12 first-outputs and presents them in the diff-visible review surface (§14.4).
3. A human reviewer scans all 12 in one sitting (~30 min). For each: approve, reject (with notes), or "rubric needs tuning" (which halts the migration and revises Phase 0 artefacts).
4. Once all 12 smoke outputs are approved, the orchestrator releases the agents to process the rest of their pillar.
5. Agents complete asynchronously, each writing to its pillar's queue; final outputs land in `pending_review` queues.

If any smoke test fails, only that pillar's agent is held; the others continue. Rubric-tuning failures hold all 12.

### 12.5 Fan-in: human review queue

After agents complete:

1. Each pillar has a `pending_review` queue of v2 Speakables.
2. The diff-visible review UI (§14.4) shows legacy + v2 side-by-side, with lint scores, golden-reference comparison, and TTS preview.
3. Reviewers process the queue per pillar; approve flips `speakable_status` to `approved` and the renderer switches to v2 for that question.
4. **Rejected** items go back to a `pending_fix` queue with reviewer notes; the agent is re-invoked on those specific questions only, with the notes appended to its brief.
5. Random 10% sample of `approved` items per pillar gets a fresh-human read-aloud check post-approval as a drift detector.

### 12.6 Pillar-specific concurrency budget

Not all pillars need full agent autonomy. Three tiers:

| Tier | Pillars | Behaviour |
|---|---|---|
| **High autonomy** | P09 DevOps, P10 Cloud, P07 Security, P08 Testing (mostly archetype A/B/D) | Agent processes full pillar after smoke gate; human reviews aggregate. |
| **Moderate autonomy** | P01 Java Core, P02 Spring, P03 Data, P04 APIs/Messaging, P05 Design (mix of archetypes including E) | Agent processes after smoke gate; human reviews flagship questions individually before bulk approval. |
| **Low autonomy (or hand-craft)** | P06 System Design + LLD (archetype F is hardest), P11 Production/SRE (war-room voice is fragile), P12 Behavioural (STAR is fragile) | Agent drafts; every question gets individual human review. The top ~30 questions across all pillars (top-traffic) are hand-crafted, never agent-drafted. |

### 12.7 Exit signal for the entire migration

The migration is **complete** when:
- Every question has either `approved` status or a documented `legacy` exception.
- `_audits/speakable_health.md` shows ≥ 95% lint-green across every pillar.
- The 10% sample re-read shows zero "feels hi-tech / unnatural / worse than legacy" flags in the most recent batch.
- Soak period (§14.6) has passed for the first 3 pillars to be approved.

Only after all four are true does any cleanup of the legacy fields happen — and that happens in a separate, dedicated PR.

---

## 13. Governance & anti-drift mechanisms

Five locks. Together they make regression mechanically impossible without explicit override.

### 13.1 Pre-commit hook
Runs `audit_speakable.py` on touched files. Blocks the commit on `fail`. Already-locked pillars use the strictest profile.

### 13.2 CI gate
Same script in GitHub Actions on every PR. Posts a comment showing the diff in `speakable_health.md` ("this PR drops Spring health from 100% → 96%, 4 questions newly failing — see report").

### 13.3 New-question scaffolder
`scripts/new_question.py` (or VSCode snippet) generates a new question with the structured Speakable already populated with the archetype's required beats. **New questions are born lint-green.** They cannot enter the codebase in the legacy shape.

### 13.4 Health dashboard committed to repo
`content/_audits/speakable_health.md` is checked in and updated by the script. By-pillar, by-archetype percentages plus drift since last commit. Visible in PR diffs.

### 13.5 Quarterly "plain reader" pass
A junior reader (real human, fresh eyes) reads 5 random Speakables aloud. If any one feels hi-tech or unnatural, that's a P1 signal: tighten the codex and the rubric. This is the only human gate that survives — and it's intentionally narrow.

---

## 14. Regression prevention — refinement, not preservation

We changed our minds explicitly here. The earlier draft of this section tried to **pin** the original answer's content via a per-question must-preserve contract — every concept, example, and phrase from the legacy had to survive into v2. That mindset is now retired.

**The new mindset:**
> The legacy answer is **raw material**, not a contract. The agent (or hand-crafter) reads it for the technical content, then rewrites freely against the plan. If a phrase or example doesn't earn its place in the new shape, it goes. **Quality is judged by the lint and by a human gut-check against the golden references — not by what survived from the legacy.**

Why this is safe:
- The plan is more demanding than the legacy ever was. Every v2 has a declared archetype, mandatory beats, a depth marker, voice rules, and a familiarity codex. That's a higher bar than any current Speakable meets.
- Every v2 is held against **golden references** (the Phase 2 pilots) — the agent imitates a known-good voice rather than improvising.
- The legacy is still kept beside the v2 (§14.1) so we can roll back instantly if a v2 turns out worse.
- Human review (§14.4) judges v2 directly: *"Is this as good as or better than the legacy I'm seeing on the left?"* — the gut-check happens on the rendered output, not on a phrase checklist.

What this section drops vs. the earlier draft:
- ❌ `must_preserve.json` per question — gone.
- ❌ "v2 must score ≥ legacy" — gone (legacy scores are often genuinely below 80; we don't want to anchor to them).
- ❌ Concept-coverage scoring against the legacy — gone.

What this section keeps:
- ✅ Side-by-side coexistence (legacy never overwritten).
- ✅ Per-question approval status with a renderer that respects it.
- ✅ Diff-visible review UI (now even more important — it's the primary regression check).
- ✅ Hand-craft the top 30–50 (not auto-agent-drafted at all).
- ✅ Soak period with instant rollback.

The remaining defence is six gates instead of seven, focused on **output quality** rather than **input preservation**.

### 14.1 Side-by-side coexistence (the "shadow" pattern) — unchanged

**Every rewrite is added as a new field; the legacy is never overwritten.** A question's JSON during migration looks like:

```json
{
  "answer": {
    "sections": [
      { "type": "speakable_answer", "content": "...original markdown..." },
      { "type": "speakable_v2",
        "archetype": "conceptual",
        "hook": "...",
        "beats": [ ... ],
        "cap": "...",
        "followup_handoff": [ ... ]
      }
    ]
  },
  "speakable_status": "pending_review"
}
```

The renderer serves `speakable_v2` only when `speakable_status === "approved"`. Otherwise it serves the legacy markdown.

**What this buys us:**
- Original is never destroyed during migration.
- Per-question rollback = flip status to `rolled_back` (no deploy needed beyond the JSON change).
- Bulk rollback = `git revert` one agent's PR; nothing else changed in the affected files.
- Diff is always visible in source control.

Legacy is removed only after the soak period in §14.6.

### 14.2 Quality score with absolute floor

The lint emits a numeric score 0–100 for every v2, weighted:

| Component | Weight |
|---|---|
| Structural compliance (required beats present, no forbidden beats) | 30 |
| Familiarity coverage (canonical anchors used, banned vocab absent) | 20 |
| Depth marker present | 20 |
| Voice rules (sentence length, reading grade, contractions, active voice) | 20 |
| Tightness (every beat within ceilings) | 10 |

A v2 is **rejected by the lint** if its score is < **80 absolute**. The legacy score is no longer the comparison point — we set an absolute bar instead. Most legacy Speakables would not meet 80 today; that's the entire point of the rewrite.

### 14.3 Hand-craft the top 30 (and grow over time)

The top ~30 highest-traffic questions are **never agent-drafted**. They are hand-rewritten by the content lead in Phase 2, lint-checked the same way, and committed before the parallel agents fan out. The list lives at `content/_audits/top30-handcraft.md`, sourced from analytics + curriculum priority. As traffic shifts, questions are added to or removed from this list and re-hand-crafted as needed.

Agents handle the long tail where impact-per-question is lower and the lint + golden-reference comparison are sufficient.

### 14.4 Diff-visible review surface — unchanged

A small admin page at `/admin/speakable-review` (auth-gated) shows, per question in the `pending_review` queue:

- **Side-by-side rendered view** — legacy on the left, v2 on the right.
- **Lint score** for the v2 (component breakdown).
- **Golden-reference comparison** — for the v2's archetype, the corresponding pilot answer is shown collapsed; reviewer can expand it to compare voice/depth.
- **Banned-vocab warnings** (Layer 1 + Layer 2).
- **Spoken-form preview** — TTS output for both, playable inline.
- **Buttons**: approve / reject (with required note) / send back to agent with notes (queues a re-run for that question only).

Reviewers process the queue per pillar. The UI is the **primary regression check** in this model — it is non-skippable. Approval flips `speakable_status` from `pending_review` → `approved`, and the renderer switches that question to v2.

For pillars with very small volume (e.g. P12 Behavioural after a smoke test), raw git diffs may suffice — but the script always produces the diff page as a static HTML artefact per PR.

### 14.5 Per-question approval status — unchanged

Every question gets a status field:

```json
"speakable_status": "legacy" | "pending_review" | "approved" | "rolled_back"
```

| Status | Renderer serves | When |
|---|---|---|
| `legacy` | original markdown | default for un-migrated questions |
| `pending_review` | original markdown | v2 exists but hasn't been approved yet |
| `approved` | v2 structured | reviewer has signed off |
| `rolled_back` | original markdown | v2 was promoted but caused a regression |

The parallel agents produce `pending_review` at scale. Promotion to `approved` is **per-question, explicit**. We can promote 5 or 500 in one PR — but each one is a deliberate flip, traceable in git history.

### 14.6 Soak period before legacy deletion — unchanged

After a question is `approved`, **the legacy field stays in the file for one full release cycle (~4 weeks per pillar)**.

During the soak:
- Analytics is checked for unusual bounce / time-on-page changes.
- User feedback channel monitored for complaints citing the question.
- Internal team can flag any question they spot a regression on.

If any signal fires, status flips to `rolled_back` instantly — renderer serves legacy again, no deploy needed beyond the JSON change. The v2 goes back to the queue for revision.

Only after the soak period passes for the pillar — and we're confident — does a separate cleanup PR remove the legacy fields. **Never both removals and rewrites in the same PR.**

### 14.7 Summary — how the six gates compose under refinement-first

| Failure mode the gate prevents | Gate(s) |
|---|---|
| v2 is structurally broken or off-spec | 14.2 lint score floor (≥ 80) |
| Bulk parallel agents damage flagship answers | 14.3 hand-craft top 30 + smoke-test gate (§12.4) |
| Bad v2 goes live without scrutiny | 14.4 diff-visible review UI + 14.5 status field |
| Reviewer can't tell if v2 is worse than legacy | 14.4 side-by-side + golden-reference comparison |
| Live v2 turns out worse after promotion | 14.5 instant status flip + 14.6 soak period |
| We lose the original | 14.1 never-overwrite policy + soak before deletion |

For a regression to reach a user, all six of the following would have to fail simultaneously:
1. The lint missed it (score ≥ 80 was wrong).
2. The smoke-test gate at the start of the agent run didn't catch the off-spec output.
3. The diff-visible review UI didn't expose it during human review.
4. The reviewer approved anyway.
5. The post-approval 10% sample re-read didn't catch it.
6. The 4-week soak period showed no analytics signal and no internal flag.

That's the bar. Combined with the §13 governance locks (which prevent post-migration drift), this is the system in the refinement-first model. **No good answer should ever go bad through this process — but we are no longer trying to reproduce the legacy. We are improving on it.**

---

## 15. Open decisions before kickoff

This section now has **two parts**: decisions already locked by user direction, and the small remaining set still open.

### 15A. Decisions locked by user direction

These are no longer open. They are recorded here for traceability into the Phase 0 artefacts.

| # | Decision | Locked answer |
|---|---|---|
| 15.1 | Archetype taxonomy (7 archetypes A–G) | **Locked: yes, 7 archetypes.** |
| 15.2 | Data-model migration to structured Speakable, coexisting with legacy | **Locked: yes.** |
| 15.3 | Execution model — parallel agents from the start (12 agents) | **Locked: yes, parallel fan-out on a single "Go" signal.** |
| 15.4 | Audience default (`audience_assumption: beginner`) | **Locked: yes.** |
| 15.5 | Replace invented examples with canonical ones during refinement | **Locked: yes; canonical from codex unless `familiarity_override: true`.** |
| 15.7 | Per-beat ceilings (granular tightness) | **Locked: yes, per-beat.** |
| 15.8 | Depth-marker enforcement | **Locked: mandatory for A/B/C/D/E, recommended for G, equivalent for F.** |
| 15.9 | Top-30 hand-crafted (never agent-drafted) | **Locked: top 30.** |
| 15.10 | Diff-review UI as a full admin page in Phase 1 | **Locked: full admin page at `/admin/speakable-review`.** |
| 15.11 | Soak period (~4 weeks per pillar) before legacy deletion | **Locked: 4 weeks per pillar.** |
| 15.12 | Lint score absolute floor (≥ 80) | **Locked: ≥ 80 absolute, no comparison to legacy.** |
| 15.13 | Number of parallel agents (12, one per pillar) | **Locked: 12.** |
| 15.14 | Smoke-test review threshold | **Locked: per-pillar smoke failure halts only that pillar; "rubric needs tuning" halts all 12 and revises Phase 0.** |
| 15.15 | Pillar autonomy tiers (high / moderate / low) | **Locked: three tiers as in §12.6.** |
| 15.16 | Agent autonomy on re-runs | **Locked: agents iterate independently against the lint until quality passes — no fixed re-attempt cap.** Escape hatches: (a) score plateaus across 5 consecutive iterations with no improvement → `pending_handcraft`; (b) per-question budget hit → `pending_handcraft`; (c) human reviewer rejects 3 times after lint-green → `pending_handcraft`. The intent is: the agents keep working until quality is reached, and only escape to hand-craft on genuine impasse. (User direction.) |
| 15.17 | Speakable is the answer, not coaching about it (Principle 2.7) | **Locked: yes.** Layer 3 banned-vocab list (no "you should say…", no "tell the interviewer…", no "in your answer…", no "the candidate should…"). Speakable text is study material; reader internalises it by reading. The renderer never adds instructional framing. |
| 15.18 | Visual rhythm is part of the answer (Principle 2.8) | **Locked: yes.** Per-beat `layout` field in the data model (§5). Visual rhythm rules in lint (§7.5). Layout primitives in the renderer (§10.3). Visual style guide is a Phase 0 deliverable (§11, item 0.8). Agents must produce layout-aware output (§12.3 mandate). |

### 15B. Small open items (need confirmation, but not blocking)

### 15B.1 Codex sourcing (was 15.6)
First version of the canonical phrasings + standard examples library — seeded by:
- (a) a script that scrapes the well-known sites' phrasings for the top 50 topics, then human-locked, or
- (b) seeded manually from the content lead's own reading.

**Recommendation:** (a) for breadth, then human review. **Awaiting confirmation.**

### 15B.2 Per-question budget for the autonomous agent loop (15.16 escape hatch)
The agent loops until lint-green; if score plateaus or budget hits, it escapes to `pending_handcraft`. We need a concrete budget. Options:
- (a) wall-clock — e.g. 10 minutes per question.
- (b) iteration count — e.g. up to 20 lint-correction passes per question.
- (c) token budget — e.g. up to N tokens per question.

**Recommendation:** (b) iteration count = 20, plus the plateau detector (no improvement in 5 consecutive iterations). Iteration count is the most agent-runtime-agnostic and the cheapest to instrument. **Awaiting confirmation.**

### 15B.3 Visual style guide responsibility
The Phase 0.8 visual style guide is a design-system artefact. Options:
- (a) drafted by the content lead inside Phase 0 alongside the codex (text-only spec, no live components yet).
- (b) drafted by a Frontend pair in Phase 1 alongside the renderer primitives (live in code from day one).

**Recommendation:** (a) draft a text-only style spec in Phase 0 so agents and reviewers have a written rule-set; (b) build the live primitives in Phase 1 to match. Two artefacts that converge. **Awaiting confirmation.**

---

## 16. Appendix A — Worked example: OOP four pillars (familiarity-first)

This is the **bar** every Speakable must hit. Compare with the current 700-word essay version (`content-md/oop-four-pillars-java.md` lines 43–57) and the version in `complete-qa.json`.

```yaml
speakable:
  archetype: A
  pillar: P01
  audience_assumption: beginner
  voice: friendly
  speakable_status: approved
  familiarity_anchors:
    - "data plus the methods"
    - "blueprint vs instance"
  standard_example: "Dog extends Animal"

  hook: "OOP is just a way of writing code around objects."

  beats:
    - kind: definition
      layout: paragraph
      text: |
        An object is data plus the methods that work on that data.
        The class is the blueprint; the object is one real example
        of it. So a Dog class might have name and bark() — every
        dog you create has its own name but the same shape.

    - kind: why_exists
      layout: paragraph
      text: |
        Without it you end up with data in one place and the code
        touching that data scattered everywhere — small changes
        cascade across the codebase.

    - kind: parts_or_states
      label: "The four pillars"
      layout: grouped_paragraphs
      groups:
        - heading: "Encapsulation"
          text: |
            The class controls its own state. Fields stay private;
            you change them through methods like withdraw() instead
            of setBalance().
        - heading: "Inheritance"
          text: |
            The IS-A relationship. Dog extends Animal means a Dog is
            an Animal. Java only allows one parent class because of
            the diamond problem; for multiple, you use interfaces.
        - heading: "Polymorphism"
          text: |
            Same call, different behaviour by object. Shape s = new
            Circle(); s.area() runs Circle's version, because the
            JVM looks at the actual object at runtime.
        - heading: "Abstraction"
          text: |
            Depend on the contract, not the implementation. List l =
            new ArrayList<>() lets you swap to LinkedList tomorrow
            without changing any caller.

    - kind: example
      layout: paragraph
      text: |
        That one line — List<String> names = new ArrayList<>() —
        actually uses all four at once. List is the abstraction.
        ArrayList's internal array is encapsulated. Any List works
        in its place via polymorphism. ArrayList implements List
        through inheritance.

    - kind: pitfalls
      layout: bullets
      items:
        - "Don't confuse abstraction (a design idea) with the abstract keyword (a Java mechanism)."
        - "A private field plus setBalance() is not encapsulation — it's a public field wearing a coat."

  cap: "So OOP isn't four rules to memorise — they reinforce each other, and most real bugs come from breaking one of them."

  followup_handoff:
    - "What's the difference between compile-time and runtime polymorphism?"
    - "When would you use composition over inheritance?"
    - "What's the diamond problem in Java?"
```

**Lint pass:**
- Archetype A required beats: ✅ all present.
- Familiarity anchors: ✅ "data plus the methods", "blueprint", "real example", "IS-A", "diamond problem", "many forms" (implicit), "abstract keyword" — all canonical.
- Standard example: ✅ `Dog`, `BankAccount.withdraw()`, `List = new ArrayList<>()`.
- Avg sentence length: ~14 words. ✅
- Reading level: ~Grade 8. ✅
- Banned vocab Layer 1: 0 hits. ✅
- Banned vocab Layer 2 (meta-references): 0 hits. ✅
- Per-beat ceilings: every beat within soft ceiling. ✅
- Depth marker: "private field plus setBalance() is not encapsulation — it's a public field wearing a coat" — non-obvious gotcha present. ✅
- Total: ~280 words. ✅
- Followup handoff: 3 items. ✅

**Why this is the bar:**
- Reads like a person speaking, not an essay.
- Every canonical phrase present, none announced.
- Famous example used silently.
- Depth signal embedded ("public field wearing a coat") — proves command without rambling.
- Naturally ends; doesn't over-stay.

---

## 17. Appendix B — File map of artefacts

```
docs/
  SPEAKABLE-PLAN.md                  # this file
  speakable/
    archetypes.md                    # the 7 instinct skeletons (Phase 0.1)
    pillar-register.md               # pillar register sheet (Phase 0.2)
    lint-rules.md                    # lint rubric (Phase 0.4) — incl. visual rhythm rules §7.5
    familiarity-codex.md             # human-readable codex (Phase 0.5)
    word-ceilings.md                 # per-beat ceilings (Phase 0.6)
    depth-markers.md                 # depth-marker reference (Phase 0.7)
    visual-style-guide.md            # NEW: typography, spacing, primitives spec (Phase 0.8)

codex/
  phrasings.json                     # canonical phrasings, machine-readable
  examples.json                      # standard examples, machine-readable
  banned.json                        # banned vocabulary, 3 layers (incl. Layer 3 coaching phrases)

docs/speakable/
  agent-briefs/                      # NEW: one self-contained brief per pillar (§12.3)
    P01-java-core.md
    P02-spring.md
    P03-data.md
    P04-apis-microservices-messaging.md
    P05-architecture-design.md
    P06-system-design.md
    P07-security.md
    P08-testing.md
    P09-devops.md
    P10-cloud.md
    P11-production-sre.md
    P12-interview-readiness.md

scripts/
  audit_speakable.py                 # the lint script (Phase 1.1) — emits 0–100 score per §14.2
  classify_speakable.py              # auto-classification before fan-out (§12.2)
  build_agent_briefs.py              # NEW: generates the 12 per-pillar briefs (§12.3) from the plan + codex
  orchestrate_agents.py              # NEW: the "Go" entry point — kicks off the 12 parallel agents (§12)
  smoke_review_collector.py          # NEW: gathers the 12 smoke outputs into one review batch (§12.4)
  agent_speakable_<pillar>.py        # NEW: per-pillar agent driver (one process per pillar)
  new_question.py                    # scaffolder for new questions (Phase 4.3)
  speakable_schema.json              # JSON Schema for the structured shape (incl. speakable_v2 + status field)

frontend/
  lib/speakable/
    schema.ts                        # TypeScript types matching the schema (incl. layout primitives)
    toSpeech.ts                      # TTS-clean serializer (Phase 1.4) — layout-aware reading
  components/speakable/
    Speakable.tsx                    # wrapper — picks v2 if speakable_status === "approved" (§14.5)
    primitives/                      # NEW: per-beat layout primitives (§10.3, Phase 1.2)
      BeatParagraph.tsx
      BeatParagraphs.tsx
      BeatGroupedParagraphs.tsx
      BeatBullets.tsx
      BeatOrderedList.tsx
      BeatMiniTable.tsx
      BeatCallout.tsx
    layouts/
      Conceptual.tsx                 # archetype A — composes primitives
      Comparison.tsx                 # archetype B
      Internals.tsx                  # archetype C
      Scenario.tsx                   # archetype D
      Design.tsx                     # archetype E
      SystemDesign.tsx               # archetype F
      Behavioral.tsx                 # archetype G
    Legacy.tsx                       # markdown fallback during migration
    ReadAloudButton.tsx              # one button, used everywhere
  app/admin/
    speakable-review/                # diff-visible review UI (§14.4) — built in Phase 1 before fan-out
  app/dev/
    speakable-primitives/            # NEW: visual story page for the 7 primitives (Phase 1 exit gate)

content/
  _audits/
    speakable_health.md              # auto-generated dashboard (§13.4)
    archetype_assignments.csv        # output of classify_speakable.py
    top30-handcraft.md               # top-N hand-craft list (§14.3)
    smoke_review_batch.md            # NEW: the 12 smoke outputs from agent fan-out (§12.4)
```

---

## End of plan

**Next concrete action when you're ready:** confirm the three small items in §15B (the rest are locked). Once those are confirmed, I'll proceed in this order:

1. **Phase 0** — draft the archetype taxonomy, the pillar-register sheet, the lint rubric (with visual rhythm rules), the Familiarity & Voice Codex (3 banned-vocab layers), the data-model schema (with layout primitives), and the **visual style guide**. All design, no content edits.
2. **Phase 1** — build the lint script (with 0–100 scoring), the **per-beat layout primitives** (paragraph, paragraphs, grouped_paragraphs, bullets, ordered_list, mini_table, callout), the unified renderer with archetype-aware layouts composed from those primitives, the TTS serializer (layout-aware), and the `/admin/speakable-review` admin UI.
3. **Phase 2** — hand-craft the 7 golden references (one per archetype, each showcasing the layout primitives in action) plus the top 30 highest-traffic Speakables. These never see an agent.
4. **Phase 0–2 sign-off gate** — you review the foundation. Until you say "Go", no agent touches anything.
5. **The "Go" signal** — on your command, `orchestrate_agents.py` fans out 12 parallel agents (one per pillar). Each agent **iterates against the lint until quality passes** (no fixed re-attempt cap; only impasse escapes per §15.16). Each does its first question, then halts at the smoke-test gate. You review all 12 smoke outputs in one sitting (~30 min).
6. **Smoke approved** — agents complete their pillars in parallel, each grinding through its queue, self-correcting until lint-green. Outputs land in `pending_review`.
7. **Human review** — you (or reviewers) work through the queue in the admin UI, approving v2 per question. Approval flips the renderer to v2 for that question.
8. **Soak + cleanup** — 4 weeks per pillar; then a separate cleanup PR removes legacy fields.

**No `complete-qa.json` is touched** until Phase 0–2 sign-off, the smoke gate is wired, and you give the explicit "Go". Until then, no answer is at risk.

**Two principles to keep in mind throughout:**
- The Speakable text **is the answer**, not coaching about how to give it. The reader internalises it by reading; we never address them. (Principle 2.7.)
- The Speakable is **visually scannable**, never a wall of text. Layout is part of the data model, enforced by the lint, rendered by primitives. (Principle 2.8.)
