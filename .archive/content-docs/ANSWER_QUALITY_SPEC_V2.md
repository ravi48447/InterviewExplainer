# Answer Quality Constitution v2.0

> Status: **draft for pilot** — supersedes v1 for Java Backend Intermediate.
> v1 (`ANSWER_QUALITY_SPEC.md`) remains the reference for archetype templates.
> v2 refines three things: **no universal word limits**, **explicit archetypes**, and **a per-module style anchor** for tone calibration.

---

## Why v2 exists

v1 enforced universal word ranges (direct_answer ≤ 120, speakable 150–300, deep dive 500–2000). In practice those ranges over-police short topics ("== vs equals") and under-serve long ones ("design a URL shortener"). The internet's own best answers for those two topics look nothing alike — forcing them into the same mold produces average answers for both.

v2's guiding principle:

> **Every answer should match the shape of the best answer on the internet for that specific kind of question — borrowed for its rhythm, tone, and structure, never for its content.**

We are not copying. We are reading five top Google results for a question, noticing how a senior engineer actually writes about that topic, and writing ours in that register. The reader should feel "I've seen/read/heard this kind of explanation before" — because the language rhythm matches their mental library of good explanations.

---

## The Three Zones — purposes restated

Each zone's purpose has not changed. What changed is the admission that purpose alone — not word count — determines whether a zone succeeds.

### Zone 1 — Quick Answer (`direct_answer` + `key_points`)

**Purpose.** Someone who already knows the topic refreshes their memory in 30 seconds before walking into an interview.

**Success test.** Can a candidate glance at it on the way into a meeting room and walk out holding 4–8 anchors in their head? If the bullets are label-only ("String is immutable") or prose-dense paragraphs, the test fails.

**What's required (regardless of topic).**
- `direct_answer` uses **bold anchors** (words/phrases the eye can grab), not flat prose.
- `key_points` is bullets-only. No prose paragraphs mixed in.
- Every bullet has a **bold concept name** plus a "why it matters" clause. Labels alone are not key points.

**What's flexible (depends on the question).**
- Bullet count. 3 can be right for a narrow direct-concept; 10 can be right for a full system-design case.
- Lede length. A direct-concept question needs a one-sentence verdict; a system-design case needs a scale-math hook.

### Zone 2 — Interview Answer (`speakable_answer`)

**Purpose.** The exact words a candidate would say out loud in the interview. Natural speech, not a document.

**Success test.** Read it aloud once. Does it sound like a senior engineer explaining over coffee? Or does it sound like someone reading a textbook? Sentences should be conversational lengths (8–25 words typically). Transitions like "So…", "The thing is…", "What catches people is…" are fine — those are how engineers actually talk.

**What's required (regardless of topic).**
- **Opening hook in sentence one.** Never "In computer science, X is…" — jump straight to the mental model: *"A HashMap is a `Node[]` bucket array where the slot comes from `hashCode`."*
- **Verdict before ending.** Every answer ends with a clear recommendation, not a neutral summary. *"My default is X. I reach for Y only when Z."*
- **No fenced code blocks.** You cannot speak triple backticks. Inline `` `code` `` only.
- **No documentation voice.** Phrases like "It is important to note that…", "In conclusion…", "Firstly, Secondly, Thirdly…" are rejected.
- **Bold 3–6 anchor terms** so the listener/scanner picks out structure.

**What's flexible (depends on the question).**
- Length. A direct-concept answer speaks in 45–75 seconds (120–220 words). A system-design answer speaks in 3–5 minutes (500–900 words). Both are legitimate speech. The number is never the target — the clock is.
- Paragraph count. 2 paragraphs is fine for a tight direct-concept; 6–8 is fine for a layered system-design walkthrough.

### Zone 3 — Deep Dive (everything else)

**Purpose.** A mini-article that teaches the topic from zero to expert. Someone with no prior knowledge should understand the complete concept after reading it.

**Success test.** Pick the top 3 Google results for the exact question. Read them. Does our deep dive match their shape — depth, section order, code density, trade-off discussion? If theirs has a comparison table and ours doesn't, ours is behind. If theirs has a single-paragraph answer and ours has eight sections, ours is padded.

**What's required (regardless of topic).**
- **Progressive depth.** No single monolithic section. Build from mental model → mechanics → trade-offs → production warnings.
- **Explanation outweighs code.** No non-code section is more than 60% code by character count. Code without framing is a code dump.
- **Code blocks carry language tags** (```` ```java ````, ```` ```sql ````, etc.) for syntax highlighting.
- **No orphan code.** Every `before_code` / `after_code` / `code_example` section needs at least a short prose frame (≥ 2 sentences) explaining what the reader is about to see.
- **Comparison archetype → a comparison table is required.** A paragraph of "on the other hand" prose is not a comparison.

**What's flexible (depends on the question).**
- Length. A direct-concept deep dive of 450 words can be complete; a system-design deep dive of 2800 words can be the right size. The test is "does it match the shape of the best article on the internet for this topic", not a word counter.
- Section types. An internals walkthrough uses `phase` sections. A recipe uses `step` sections. An architecture explanation uses `component` sections. Using the wrong type is a quality defect even if the content is fine.

---

## Universal rules (always enforced)

These rules never depend on topic, length, or archetype. They either pass or fail.

| Rule | What fails | Why |
|---|---|---|
| Zone presence | stub (no sections), or any of {direct_answer, key_points, speakable_answer, deep_dive} missing | the page renders with empty zones |
| Zone 1 bullets only | prose paragraphs mixed into `key_points` | 30-second scan breaks when eyes hit prose |
| Zone 1 bold anchors | direct_answer with zero bold, or key_points bullets with no bold term | scan-ability is the whole point |
| Zone 2 inline code only | fenced code block in speakable | you can't speak triple-backticks |
| Zone 2 opening hook | first sentence is a preamble ("In computer science…", "In today's world…", "Let us discuss…") | wastes the interviewer's attention |
| Zone 2 no documentation voice | "It is important to note…", "Firstly / Secondly / Thirdly", "Moreover", "In conclusion" | nobody talks like this |
| Zone 2 has a verdict | no recommendation / "my default is X" closer | answer ends without a point of view |
| Zone 3 explanation > code | any non-`*_code` section >60% code by char count | code dump |
| Zone 3 no orphan code | `before_code` / `after_code` / `code_example` with < 2 sentences of frame | code needs "what you're about to see" framing |
| Zone 3 code language tag | ```` ``` ```` without a language after the fence | breaks syntax highlighting |
| Comparison → has table | comparison archetype missing `comparison_table` section | spec makes this non-negotiable |
| No Zone1/Zone2 duplication | >85% word-set overlap between key_points and speakable | duplicating content wastes the three zones |

---

## What we DO NOT enforce any longer

These v1 checks are removed — they produced false positives at the top of the previous audit:

- `direct_answer_too_long` (word-count cap)
- `speakable_too_long`, `speakable_slightly_long` (word-count caps)
- `deep_dive_too_long` (word-count cap)
- `key_points_too_many` (bullet-count cap)
- `speakable_bold_spam` (bold-count cap)
- `deep_dive_too_short` as a *universal* floor

Length-related flagging is moved into the archetype layer below, where it only fires for **radical deviations**, not mild ones.

---

## Archetype catalog (explicit field required)

Every question must declare its archetype. Auditing uses this field to choose the right shape rules.

| Archetype | When to use | Blueprint (Zone 3) | Verdict rule | Typical DD band (guidance) | Typical speakable band |
|---|---|---|---|---:|---:|
| **direct-concept** | "What is X?", simple single-concept | overview → (optional code_example) → key_points | one-sentence verdict | 400–800 | 120–220 |
| **comparison** | "X vs Y", "difference between", "which is better" | overview → **comparison_table** → when_to_use → verdict | explicit "my default is X; Y when Z" | 600–1100 | 150–280 |
| **internals** | "How does X work", "What happens when X", "Walk through X" | overview (mental model) → phase → phase → phase → code_example | a production consequence ("I've seen this cause p99 spikes") | 900–1500 | 250–400 |
| **moderate-concept** | multi-faceted concept that is not a comparison | problem_statement → phase/step → code_example (wrong→fixed→idiomatic) | the "broken → fixed → best practice" progression itself | 800–1300 | 220–320 |
| **debugging-pattern** | "Why does X fail", "How to fix Y", production bugs | problem_statement → before_code → diagnosis → after_code | the preventive pattern that ends the bug forever | 700–1200 | 200–300 |
| **how-to-recipe** | "How do you implement/build/configure X" (sequence of do-this-next-this) | overview → step → step → step → code_example → production warnings | at least one "never do X in production because Y" | 800–1400 | 220–350 |
| **tool-config** | "How to configure Actuator / Kafka / Redis", options & defaults | overview → step (each option with why + danger) → production warnings | every tool's sharp edge stated | 700–1300 | 220–350 |
| **architecture** | "What is Clean / Hexagonal / DDD", pattern explanations | overview (the problem it solves) → component → component → code_example | one concrete payoff picked (testability / replaceability / maintainability) | 1000–1700 | 250–400 |
| **system-design** | "Design X at scale", capacity-sized problems | overview (scale math) → step/phase (components) → comparison_table (trade-offs) | explicit design choices + failure modes | 1500–3000 | 500–900 |
| **behavioral** | "Tell me about a time", leadership / conflict / growth | context (situation+task) → action → result → reflection | the lesson made explicit | 400–800 | 300–600 |
| **scenario-based** | "You have X problem, how do you solve?" applied engineering | problem_statement → approach → code_example → trade-offs | the approach chosen and why it beats the alternatives | 600–1100 | 200–320 |

**Bands are guidance, not walls.** The auditor flags only **radical deviations** (below 50% of the lower band, or above 200% of the upper band). Anything inside or near the band is writer's judgment.

---

## Per-module benchmark sources (style anchors)

For each module, we pick 3–5 websites whose *voice, rhythm, and structural habits* our answers should match. These are not to be copied — they're the calibration target for how a senior engineer in that domain writes.

| Pillar | Module | Primary style anchors |
|---|---|---|
| P01 | `core-java` | Baeldung, Oracle Java docs, Jenkov, Stack Overflow top-voted, *Effective Java* excerpts |
| P01 | `java-collections` | Baeldung, Jenkov, Oracle Javadoc pages, Stack Overflow top-voted |
| P01 | `java-streams` | Baeldung, Oracle docs, Venkat Subramaniam blog, Stack Overflow top-voted |
| P01 | `java-concurrency` | Baeldung, Jenkov, *Java Concurrency in Practice* excerpts, Aleksey Shipilev posts |
| P01 | `jvm-internals` | Oracle HotSpot docs, Aleksey Shipilev, Baeldung, JVM deep-dive blog posts |
| P02 | `spring-core` | Spring.io reference docs, Baeldung Spring, Reflectoring |
| P02 | `spring-boot` | Spring.io guides, Baeldung, Reflectoring, Josh Long talks |
| P02 | `spring-data-jpa` | Vlad Mihalcea, Baeldung JPA, Spring Data docs, Thorben Janssen |
| P02 | `spring-security` | Spring Security reference docs, Baeldung, OWASP |
| P02 | `spring-webflux` | Spring reference docs, Project Reactor docs, Baeldung Reactive |
| P02 | `spring-batch` | Spring Batch reference docs, Baeldung |
| P03 | `sql-databases` | Use The Index Luke, PostgreSQL docs, Markus Winand, DDIA excerpts |
| P03 | `nosql-mongodb` | MongoDB docs, MongoDB blog, Martin Fowler NoSQL articles |
| P03 | `redis-caching` | Redis docs, Redis Labs blog, Baeldung caching articles |
| P04 | `rest-api` | Google REST API design guide, Martin Fowler REST, Baeldung |
| P04 | `microservices` | microservices.io (Chris Richardson), Martin Fowler, Sam Newman excerpts |
| P04 | `messaging-events` | Confluent Kafka blog, Apache Kafka docs, Sam Newman |
| P05 | `design-patterns` | Refactoring.guru, *Effective Java* excerpts, SourceMaking |
| P05 | `architecture-patterns` | Bob Martin (Clean Architecture), Herberto Graça, DDD Reference (Eric Evans), microservices.io |
| P06 | `system-design` | ByteByteGo, High Scalability, DDIA, System Design Primer (Donne Martin) |
| P06 | `system-design-cases` | ByteByteGo case studies, Grokking the System Design Interview, High Scalability |
| P07 | `application-security` | OWASP Top 10, PortSwigger Web Security Academy, Troy Hunt blog |
| P08 | `unit-testing` | Martin Fowler testing articles, Mockito docs, Baeldung testing |
| P08 | `advanced-testing` | Martin Fowler (Test Pyramid, Contract Testing), Pact docs, Kent Beck TDD |
| P09 | `git-build-tools` | Atlassian Git tutorials, Pro Git book excerpts, Maven/Gradle docs |
| P09 | `cicd` | Jenkins docs, GitHub Actions docs, ThoughtWorks CI/CD articles |
| P09 | `docker` | Docker docs, Docker Captain blog posts |
| P09 | `kubernetes` | Kubernetes docs, Kelsey Hightower talks/writing, learnk8s.io |
| P10 | `aws-cloud` | AWS Well-Architected Framework, AWS blog, Jeff Barr posts |
| P10 | `cloud-native` | 12factor.net, HashiCorp Terraform guides, AWS Well-Architected |
| P11 | `observability` | Google SRE book (chapter 6), Honeycomb blog, Charity Majors posts, Grafana blog |
| P11 | `production-sre` | Google SRE book, Charity Majors, Increment magazine posts |
| P12 | `engineering-practices` | *The Manager's Path*, Google engineering practices docs, StaffEng.com |
| P12 | `behavioral` | Amazon Leadership Principles guides, MIT Career Advising, STAR-format coaching sites |

This map is editable. A module can have additional anchors added.

---

## Style-borrowing charter — what we take, what we don't

### What we borrow from the anchors

- **Sentence rhythm** — short declarative openings, medium-length mechanics sentences, punchy closers.
- **Opening patterns** — how the best writer in that domain starts (scale math for system design, mental model for internals, problem statement for debugging).
- **Section ordering** — the order a good article marches through the topic (context → mechanics → trade-offs → warnings).
- **Code introduction style** — how they frame a code block (two sentences of "here's what you're about to see", never a raw dump).
- **How they handle trade-offs** — explicit comparison with a verdict, never "on the other hand, some people prefer…".
- **How they end** — every good piece ends with a point of view or a concrete next step, never a neutral recap.

### What we never borrow

- **Factual content / examples.** Our examples must be ours.
- **Structural boilerplate** that's specific to their site (author boxes, call-outs, promotional sections).
- **Their voice for our voice.** Baeldung's slightly-formal tutorial tone is fine for a "what is" topic; it would be wrong for a behavioral STAR answer. Match the *domain-appropriate* style of the anchor, not the anchor itself.

### How the writer uses this in practice

Before writing an answer for a question:
1. Search Google for the exact question title. Open the top 5 results.
2. Skim — **not read** — for: sentence rhythm, how they open, how they introduce code, how they end, whether they use tables.
3. Close the tabs.
4. Write the answer in that register, using your own content.

The reader shouldn't be able to name which site our answer "feels like" — they should just feel the answer is *written the way people explain this topic*.

---

## What the v2 auditor flags

### Flags (universal shape/tone rules)

- `stub_no_sections`
- `zone1_missing_direct_answer`, `zone1_missing_key_points`
- `zone2_missing_speakable`, `zone3_missing_deepdive`
- `zone1_direct_answer_no_bold`, `zone1_direct_answer_has_fence`
- `zone1_key_points_has_prose`, `zone1_key_points_bullets_label_only`, `zone1_key_points_bullets_no_bold`
- `zone2_speakable_has_fence`, `zone2_speakable_documentation_voice`, `zone2_speakable_weak_opener`, `zone2_speakable_no_verdict`, `zone2_speakable_no_bold`
- `zone3_code_heavy_section` (>60% code in a non-code section)
- `zone3_orphan_code` (*_code section with <2 sentences of frame)
- `zone3_code_no_language`
- `zone3_single_section` (monolithic deep dive)
- `comparison_missing_table` (archetype-specific)
- `zone1_zone2_high_overlap` (>85% word-set overlap)
- `speakable_near_duplicate_of_deepdive` (>80% overlap by word-set)

### Flags (archetype-specific shape rules)

- `internals_no_phase_sections`
- `system_design_no_scale_math`
- `how_to_recipe_no_step_sections`
- `architecture_no_component_sections`
- `behavioral_missing_star_beats` (no Situation / Task / Action / Result signals)
- `debugging_pattern_no_before_after`
- `tool_config_no_production_warning`

### Flags (length — only radical deviations, archetype-banded)

- `dd_radically_short` — deep dive < 50% of the archetype's lower band
- `dd_radically_long` — deep dive > 200% of the archetype's upper band
- `speakable_radically_short` — speakable < 50% of the archetype's lower band
- `speakable_radically_long` — speakable > 200% of the archetype's upper band

Mild over/under of bands is **not** flagged. That's writer judgment.

### What is explicitly tolerated

- A direct-concept deep dive of 450 words ends right at the edge of the band — that's fine.
- A system-design speakable of 750 words sits above v1's ceiling — that's the archetype's norm, not a defect.
- A behavioral speakable that's 400 words of storytelling — STAR length is variable and tolerated.

---

## Relationship to v1

- v1's archetype templates (internals / comparison / debugging-pattern / how-to-recipe / tool-config / architecture / direct-concept / moderate-concept / system-design) are kept verbatim — they're high quality.
- v1's anti-patterns (code dump, uniform length, documentation voice, generic answers, padding, missing interviewer intent) are kept.
- v1's length rules are replaced by the archetype-banded guidance table above.
- v1's "complexity 1–5" concept is retired. Archetype + question-specific judgment is the replacement.

---

## Pilot scope

v2 is validated on three pillars before being rolled out to all 34 modules:

- **P01 Java Language & Core** — dominated by direct-concept, comparison, and internals archetypes. Tests that short answers aren't falsely flagged.
- **P06 System Design** — dominated by the system-design archetype. Tests that long answers aren't falsely flagged.
- **P12 Interview Readiness** — dominated by behavioral. Tests that a narrative shape is respected.

After the pilot, we adjust bands and rules based on what the pilot surfaces, then do the full sweep.
