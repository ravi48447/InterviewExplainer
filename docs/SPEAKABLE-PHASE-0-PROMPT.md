# Speakable Redesign — Phase 0 Run Prompt

> **Paste this entire file into a new Cursor chat in this repo.** That's the whole brief. The agent has everything it needs — every reference is named, every deliverable has acceptance criteria, every pillar and topic is listed.

---

## 1. What this run does (and what it does *not* do)

You are running **Phase 0 only** of the Speakable redesign. Phase 0 produces foundation specs. **No code (except TS types + JSON Schema), no content edits, no migration work, no Phase 1 or beyond.** When Phase 0 is complete, **stop and write the report**. Do not start Phase 1 even if you have time and energy left. The user wants Phase 0 reviewed before Phase 1 begins.

Expected wall time: **60–120 minutes**. Eight deliverables, all spec-driven, mostly mirroring sections of the plan.

---

## 2. Read these references first (in this order)

Before you write a single line of output, read:

1. **`docs/SPEAKABLE-PLAN.md`** — the source of truth. **Read it in full** (it is ~1080 lines, ~70 KB). Pay special attention to:
   - §2 Guiding principles (especially §2.6, §2.7, §2.8 — these shape every deliverable).
   - §3 Archetype taxonomy → drives deliverable 0.1.
   - §4 Pillar register → drives deliverable 0.2.
   - §5 Structured Speakable data model → drives deliverable 0.3.
   - §6 Familiarity & Voice Codex → drives deliverable 0.5.
   - §7 Lint rubric → drives deliverable 0.4.
   - §8 Per-beat word ceilings → drives deliverable 0.6.
   - §9 Depth markers per archetype → drives deliverable 0.7.
   - §10.3 Per-beat-layout primitives → drives deliverable 0.8.
   - §15 Open decisions → all 18 are locked; restated below.
   - §16 Appendix A — Worked example (OOP four pillars) → use this as the canonical "shape of a finished v2".

2. **`content/java-backend-intermediate/_index.json`** — the canonical pillar/module mapping. Skim it. The 12 pillars (P01–P12) and their module slugs come from here.

3. **`content-md/oop-four-pillars-java.md`** lines 43–57 — one example of the *legacy* speakable shape (the long prose essay we are replacing). Read this once to know what raw material looks like.

4. **One existing `complete-qa.json`** (suggest `content/java-backend-intermediate/java-oop/oop-principles/complete-qa.json`) lines 100–120 — read just enough to confirm the existing JSON shape (`type: "speakable_answer"`, `content: "..."`). You will not modify this file or any other in `content/`.

That's it. Do not read more code. Phase 0 is design, not implementation.

---

## 3. Locked decisions you operate under (no decision-making here)

All of `SPEAKABLE-PLAN.md` §15 is locked. The ones that affect Phase 0 directly:

- **§15.1** — 7 archetypes: A Conceptual, B Comparison, C Internals, D Scenario, E Design, F System Design / LLD, G Behavioural. No more, no fewer.
- **§15.2** — Structured Speakable data model coexists with legacy. Schema in 0.3 reflects this — it must allow `speakable_status` field with values `legacy | pending_review | approved | rolled_back | priority_handcraft | pending_handcraft | pending_handcraft_blocked_by_smoke`.
- **§15.4** — Default `audience_assumption` is `beginner`.
- **§15.5** — Standard examples come from the codex; agents replace invented examples unless `familiarity_override: true`.
- **§15.7** — Per-beat ceilings, not per-archetype totals (mirror §8 in deliverable 0.6).
- **§15.8** — Depth markers mandatory for A/B/C/D/E, recommended for G, capacity numbers for F.
- **§15.12** — Lint score floor ≥ 80 absolute (no comparison to legacy). Reflect in deliverable 0.4.
- **§15.16** — Agent autonomy: iterate against lint until lint-green, escapes only on impasse (max 20 iterations OR 5-iteration plateau OR 3 critic rejections). Reflect in deliverable 0.4 reporting structure.
- **§15.17** — Speakable is the answer, not coaching. Layer 3 banned vocab list (zero-tolerance). Embedded below in §6 of this prompt.
- **§15.18** — Visual rhythm is part of the answer. Layout primitives in 0.3 schema; visual rhythm rules in 0.4 lint rubric; visual style guide in 0.8.
- **§15B.1 codex sourcing** — You are seeding the codex from your own training-data knowledge of canonical phrasings. **You may not scrape the internet.** Tag every codex entry with `"source": "agent-seeded"` so a future human pass can refine.
- **§15B.2 budget** — Agent loop budget is 20 lint-correction iterations per question, plus a 5-iteration plateau detector. Document in deliverable 0.4.
- **§15B.3 visual style guide** — Phase 0 ships the **text spec only**. No live components. The Phase 1 deliverable will build the actual React primitives.

---

## 4. Hard boundaries — never cross these

1. **No `git push`.** Local commits only.
2. **Do not edit any file under `content/`, `content-md/`, or `frontend/components/preview/` or `frontend/components/question/`.** No content, no renderer changes. (You may create the new files listed in §7 below.)
3. **Do not delete or move any existing file.** Phase 0 is purely additive.
4. **Do not start Phase 1.** No `audit_speakable.py`, no React primitives, no admin UI. The schema (0.3) is the only TS/JSON code allowed in Phase 0; everything else is Markdown/JSON spec.
5. **Do not skip a deliverable.** All eight must be done before the run ends.
6. **Do not invent decisions.** If something in the plan is genuinely silent and you must choose, log it in `docs/speakable/HUMAN-REVIEW-QUEUE.md` with your best-instinct answer and continue. Do not halt waiting for the user.
7. **Do not commit a file with placeholder content** (no "TODO" or "TBD" or "fill this in later"). Each deliverable is finished or not present.

---

## 5. The 12 pillars (canonical names — use exactly)

From `content/java-backend-intermediate/_index.json`. These names are the source of truth — copy verbatim.

| ID | Name |
|---|---|
| P01 | Java Language & Core |
| P02 | Spring Ecosystem |
| P03 | Data & Persistence |
| P04 | APIs, Microservices & Messaging |
| P05 | Architecture & Design |
| P06 | System Design |
| P07 | Security |
| P08 | Testing & Quality |
| P09 | DevOps |
| P10 | Cloud |
| P11 | Production |
| P12 | Interview Readiness |

---

## 6. The 7 archetypes (canonical references — use exactly)

| Code | Name | Instinct skeleton |
|---|---|---|
| A | Conceptual | hook → definition → why → parts_or_states → example → pitfalls → cap |
| B | Comparison | hook → what_each_is → differences (mini_table) → when_to_use_which → gotcha → cap |
| C | Internals | hook → mental_model → mechanism → edge_cases → failure_mode → cap |
| D | Scenario | hook → clarify → hypothesis → step_by_step → tools → tradeoff → cap |
| E | Design | hook → options → decision → why → rethink_if → cap |
| F | System Design / LLD | hook → FR → NFR → capacity → API → data → bottleneck → trade-off → cap |
| G | Behavioural / STAR | hook → situation → task → action → result → reflection → cap |

(See `SPEAKABLE-PLAN.md` §3 for full details on each.)

---

## 7. The 8 deliverables — produce in this order

The build order is chosen to minimise rework: easy mirrors first (so you internalise the plan), then the structural artefacts, then the schema, then the big content artefact (codex), then the style spec.

### Deliverable 0.6 — Word ceilings reference *(do first)*

- **Path:** `docs/speakable/word-ceilings.md`
- **Mirrors:** `SPEAKABLE-PLAN.md` §8 verbatim.
- **Acceptance:**
    - Per-archetype tables (A through G) with **soft** and **hard** caps per beat, plus an "Expected total" row.
    - Top-of-doc notes: this file is the calibration target for the lint, locked at Phase 0 sign-off; subsequent tuning happens via documented review.
    - Bottom-of-doc note: cross-reference §7.4 (lint tightness rules) and §8 of the plan.

---

### Deliverable 0.7 — Depth markers reference *(do second)*

- **Path:** `docs/speakable/depth-markers.md`
- **Mirrors:** `SPEAKABLE-PLAN.md` §9 verbatim.
- **Acceptance:**
    - Table mapping archetype → depth marker → 1–3 worked examples per archetype.
    - Note: mandatory for A/B/C/D/E, recommended for G, equivalent for F (concrete capacity numbers).
    - Cross-reference §7.6 (lint depth rules) and §15.8.

---

### Deliverable 0.4 — Lint rubric doc *(do third)*

- **Path:** `docs/speakable/lint-rules.md`
- **Mirrors:** `SPEAKABLE-PLAN.md` §7 in full.
- **Acceptance — every one of these subsections present, in this order:**
    - 7.1 Structural rules
    - 7.2 Familiarity rules (Layer 1 + Layer 2 + Layer 3 banned vocab references)
    - 7.3 Voice rules (sentence length, FK grade, contractions, active voice, no second-person imperatives)
    - 7.4 Tightness rules (per-beat caps from 0.6)
    - 7.5 Visual rhythm rules (paragraph length, list-when-many, comparison gate, sequence gate, layout-payload consistency, visual variety, code density)
    - 7.6 Depth rules
    - 7.7 TTS-cleanness rules
    - 7.8 Reporting (output format, score 0–100, score floor ≥ 80 absolute, by-pillar/by-archetype dashboard)
- **Each rule has a one-line "pass criterion" and a one-line "fail mode example".** No prose paragraphs masquerading as rules.
- **Add an Appendix A: agent loop policy** documenting the §15.16 escape hatches (20 iterations, 5-iteration plateau, 3 critic rejections → `pending_handcraft`).

---

### Deliverable 0.1 — Archetype taxonomy doc *(do fourth)*

- **Path:** `docs/speakable/archetypes.md`
- **References:** `SPEAKABLE-PLAN.md` §3 (the 7 instinct skeletons) + §16 (the worked example for archetype A).
- **Acceptance — for each of A, B, C, D, E, F, G:**
    1. Archetype code + name + 1-line definition.
    2. Instinct skeleton (ordered list of beat kinds, with `kind` matching the schema in §5 / 0.3).
    3. Required beats (must be present) vs Forbidden beats (must not be present, e.g. archetype B should not have `parts_or_states`).
    4. Soft + hard ceilings per beat (cite 0.6).
    5. Depth marker (cite 0.7).
    6. **3 example questions** drawn from the actual `_index.json` modules — pillar + question slug + 1-line "why this archetype".
    7. **1 fully-filled YAML example** using the §5 schema (so future agents and humans see what a finished v2 in this archetype looks like). Use canonical phrasing from your own knowledge — keep it short, lint-green-equivalent.
- **Top-of-doc:** a quick-reference table: archetype × required beats × soft total × depth marker.
- **Bottom-of-doc:** "Choosing an archetype: a 30-second decision tree" — 5–7 yes/no questions that map a question title to one of A–G.

---

### Deliverable 0.2 — Pillar register sheet *(do fifth)*

- **Path:** `docs/speakable/pillar-register.md`
- **References:** `SPEAKABLE-PLAN.md` §4 + `content/java-backend-intermediate/_index.json` (for pillar/module mapping).
- **Acceptance — for each of P01–P12:**
    1. Pillar code + name (from §5 of this prompt).
    2. **Modules in this pillar** (read from `_index.json`) — list of `moduleSlug` values.
    3. **Topic must-includes** — the high-frequency topics agents should expect to see. (Use the §8 lists below as your starting set; expand if you find others in `_index.json`.)
    4. **Voice tweaks** — 2–3 lines on how this pillar's tone differs from the default friendly/beginner voice. E.g.:
        - P11 Production = "calm war-room voice; concrete tools; no hedging."
        - P12 Behavioural = "first-person warmth; STAR rigor; no jargon."
        - P06 System Design = "longer answer; trade-off-led; capacity numbers mandatory."
    5. **Pillar-specific standard examples** — 3–5 examples this pillar tends to anchor on (e.g., P01 → `Dog extends Animal`, `BankAccount.withdraw()`, `List<String> = new ArrayList<>()`).
    6. **Common archetypes** — which of A–G dominate this pillar.
- **Top-of-doc summary table:** pillar × module count × dominant archetypes × key voice note.

---

### Deliverable 0.3 — Structured Speakable schema *(do sixth)*

The only "code" in Phase 0. Two files, kept in lockstep.

#### 0.3a — TypeScript types

- **Path:** `frontend/lib/speakable/schema.ts`
- **Content:**
    - Discriminated union `SpeakableV2` keyed by `archetype: "A" | "B" | "C" | "D" | "E" | "F" | "G"`.
    - Per-archetype types specifying which `BeatKind` values are valid (e.g., archetype B has `differences` as a required beat; archetype E has `options` and `rethink_if`).
    - `Beat` is a discriminated union by `kind` AND `layout`. Each `(kind, layout)` pair has a specific payload type:
        - `layout: "paragraph"` → `{ text: string }`
        - `layout: "paragraphs"` → `{ paragraphs: string[] }`
        - `layout: "grouped_paragraphs"` → `{ groups: { heading: string, text: string }[] }`
        - `layout: "bullets"` → `{ items: string[] }`
        - `layout: "ordered_list"` → `{ steps: string[] }`
        - `layout: "mini_table"` → `{ columns: string[], rows: { axis: string, values: string[] }[] }`
        - `layout: "callout"` → `{ text: string }`
    - Top-level fields: `archetype`, `pillar` (P01–P12 union), `audience_assumption` (`"beginner" | "familiar" | "advanced"`), `voice` (`"friendly" | "neutral" | "technical"`), `familiarity_anchors: string[]`, `standard_example: string`, `hook: string`, `beats: Beat[]`, `cap: string`, `followup_handoff: string[]`, `tts_overrides: Record<string, string>`, `speakable_status` (the 7-state union from §3 of this prompt).
    - Export a JSDoc comment block on each type explaining the role; no implementation, just types.
- **Acceptance:** the file compiles under the existing TS config (don't break the project — verify with no extra config); zero functions, zero React, zero imports beyond TS-internal.

#### 0.3b — JSON Schema

- **Path:** `scripts/speakable_schema.json`
- **Content:** equivalent of 0.3a expressed in JSON Schema 2020-12 dialect, usable by the future `audit_speakable.py`. Use `oneOf` for the archetype discriminator; use nested `oneOf`s for the layout discriminator on each beat.
- **Acceptance:** validating the worked example from `SPEAKABLE-PLAN.md` §16 against this schema (mentally; no need to run the validator) results in pass.

---

### Deliverable 0.5 — Familiarity & Voice Codex *(do seventh — biggest single artefact)*

Four files, kept in sync.

#### 0.5a — Human-readable codex

- **Path:** `docs/speakable/familiarity-codex.md`
- **Content:**
    - Top section: the principle (§2.3 invisible familiarity + §2.7 not-coaching).
    - Voice rules section (sentence length, FK grade, contractions, active voice, **no second-person instruction**, **no meta-references**).
    - 3-layer banned vocabulary list (verbatim from §6.4 / §6 of this prompt below).
    - Per-pillar topic register: under each P01–P12 heading, list all topics from §8 of this prompt with the canonical phrasing(s) and standard example for each.

#### 0.5b — Phrasings JSON

- **Path:** `codex/phrasings.json`
- **Shape:**
    ```json
    {
      "topics": [
        {
          "id": "thread-basics",
          "pillar": "P01",
          "title": "Thread basics & lifecycle",
          "phrasings": [
            "a unit of execution within a process",
            "Java threads are OS threads in HotSpot",
            "lifecycle: New, Runnable, Running, Blocked/Waiting, Terminated"
          ],
          "source": "agent-seeded"
        }
      ]
    }
    ```
- **Acceptance:** ≥ 60 entries; ≥ 5 entries per pillar; ≥ 3 phrasings per entry; every entry tagged `"source": "agent-seeded"`. Use the topic seed list in §8 of this prompt.

#### 0.5c — Examples JSON

- **Path:** `codex/examples.json`
- **Shape:**
    ```json
    {
      "examples": [
        {
          "topic_id": "oop-four-pillars",
          "example": "Dog extends Animal",
          "use_when": "explaining inheritance / IS-A relationship",
          "source": "agent-seeded"
        }
      ]
    }
    ```
- **Acceptance:** ≥ 1 standard example per topic in 0.5b. Match by `topic_id`.

#### 0.5d — Banned vocabulary JSON

- **Path:** `codex/banned.json`
- **Shape:**
    ```json
    {
      "layer1": { "tolerance": "≤ 2 hits per 1000 words", "phrases": [ ... ] },
      "layer2": { "tolerance": "zero", "phrases": [ ... ] },
      "layer3": { "tolerance": "zero", "phrases": [ ... ] }
    }
    ```
- **Content:** Use the lists in §6 of this prompt verbatim.

---

### Deliverable 0.8 — Visual style guide *(do last)*

- **Path:** `docs/speakable/visual-style-guide.md`
- **Scope:** TEXT spec only (per §15B.3). No code, no live React, no Tailwind classes referenced as truth. The Phase 1 primitives implement what's specified here.
- **Acceptance — the doc must contain:**
    1. **Typography scale** — body, eyebrow/label, subheading, hook, cap. Specify font family family role (serif body, sans accent), size in rem, line-height, weight.
    2. **Vertical rhythm** — paragraph spacing, beat spacing, section spacing. Specify in rem.
    3. **Color tokens** — light + dark palettes for: body text, muted text, accent text, callout background, table border, divider, code chip background. Express as named tokens (e.g., `--speakable-body`) plus suggested HEX values.
    4. **Spacing tokens** — `--space-1` through `--space-6` ramp.
    5. **Mobile breakpoint rules** — what collapses, what stays. Mini-tables collapse to stacked cards on < 640px.
    6. **The 7 primitives — one section per primitive:**
        - `BeatParagraph` — single paragraph, ≤ 60 words, optional eyebrow label.
        - `BeatParagraphs` — 2–4 short paragraphs, comfortable rhythm.
        - `BeatGroupedParagraphs` — sub-headings + paragraphs, alternating subtle background or divider.
        - `BeatBullets` — clean bulleted list, ≥ 0.5rem item spacing, no decorative bullets.
        - `BeatOrderedList` — numbered list, optional left-rail connector for sequences (archetype D).
        - `BeatMiniTable` — 2- or 3-col comparison table, sticky header, mobile-collapse to stacked cards.
        - `BeatCallout` — depth-marker emphasis, distinct background, used sparingly.
       Each primitive section includes: purpose, when to use it, when not to, an ASCII layout sketch, and a "do/don't" bullet list.
    7. **TTS reading rules per primitive** — how each primitive reads aloud (e.g., mini-table reads row-by-row with axis-name pauses; ordered list reads with "first… second… third…").

---

## 8. Topic seed list for the codex (deliverable 0.5)

Use these as the minimum coverage per pillar. Expand if you spot more in `_index.json`. Every topic listed here must appear in `phrasings.json` with ≥ 3 phrasings.

**P01 Java Language & Core (~20 topics):** thread basics & lifecycle; Thread vs Runnable vs Callable; Executor framework; synchronization & locks; volatile vs atomic; HashMap internals; ArrayList vs LinkedList; HashSet & TreeMap; equals & hashCode contract; Comparable vs Comparator; generics & type erasure; checked vs unchecked exceptions; try-with-resources; String immutability & String pool; `==` vs `equals`; OOP four pillars; abstract class vs interface; inner classes; static & final keywords; garbage collection generations; JIT compilation; reflection & annotations.

**P02 Spring Ecosystem (~10 topics):** IoC & DI; bean lifecycle; bean scopes; `@Component` / `@Service` / `@Repository` / `@Controller`; Spring AOP basics; `@Transactional` propagation & isolation; Spring Boot auto-configuration; `@RestController` & `@ResponseBody`; exception handling (`@ControllerAdvice`); profiles & properties; Actuator endpoints.

**P03 Data & Persistence (~8 topics):** ACID properties; SQL transaction isolation levels; JPA cascades; lazy vs eager loading; N+1 query problem; indexing & EXPLAIN; connection pooling; optimistic vs pessimistic locking.

**P04 APIs, Microservices & Messaging (~10 topics):** REST principles; idempotency; HTTP status codes; API versioning; pagination patterns; JWT structure; OAuth 2.0 flows; rate limiting; circuit breaker; Kafka basics + partitions + consumer groups; exactly-once vs at-least-once delivery.

**P05 Architecture & Design (~8 topics):** SOLID principles; design patterns (singleton / factory / builder / strategy / observer); composition over inheritance; layered architecture; hexagonal / clean architecture; CQRS basics; event-driven design; DRY vs KISS.

**P06 System Design (~8 topics):** capacity estimation; FR vs NFR; CAP theorem & trade-offs; caching strategies; load balancing; sharding & replication; URL shortener; rate limiter; news feed.

**P07 Security (~6 topics):** authentication vs authorization; OAuth 2.0 flows; JWT signing; CSRF & XSS; password hashing (bcrypt); TLS handshake basics.

**P08 Testing & Quality (~5 topics):** test pyramid; unit vs integration vs contract test; mocking vs stubbing; code coverage; TDD basics.

**P09 DevOps (~5 topics):** CI/CD pipeline stages; Docker layers & multi-stage builds; Kubernetes pod & service; blue-green & canary; rolling updates.

**P10 Cloud (~5 topics):** region vs AZ; IAM basics; S3 consistency model; autoscaling; VPC & networking basics.

**P11 Production (~6 topics):** log levels & structured logging; distributed tracing; SLI / SLO / SLA; error budget; incident response & runbooks; post-mortem & RCA.

**P12 Interview Readiness (~5 topics):** STAR method; self-introduction; conflict resolution; mistake / failure stories; weakness question.

That's ~96 topics. Aim for 80–100 in `phrasings.json`.

---

## 9. The 3-layer banned vocabulary (verbatim — copy into `codex/banned.json` and `familiarity-codex.md`)

### Layer 1 — generic hi-tech vocabulary (≤ 2 hits per 1000 words)
`leverage`, `utilize`, `surface area`, `blast radius`, `footprint`, `non-trivial`, `orthogonal`, `first-class`, `in-flight`, `out of the box`, `battle-tested`, `production-grade`, `the canonical`, `literally means`, `in this article we will discuss`.

### Layer 2 — meta-references to user's prior reading (zero tolerance)
`you've seen this`, `you've read this`, `the textbook line`, `the famous example`, `every tutorial`, `as you've read`, `the classic line`, `as you know`, `as we all know`, `you may have heard`.

### Layer 3 — coaching / instructional phrasing (zero tolerance — Speakable IS the answer, not advice about it)
`you should say`, `you can say`, `you can answer`, `you should answer`, `tell the interviewer`, `in your answer`, `in your response`, `respond by saying`, `the candidate should`, `to impress the interviewer`, `I would frame this as`, `the way to answer this is`, `make sure to mention`, `don't forget to say`, `explain it as`, `describe it like this`, `answer it like`, `how to answer this`, `your reply should`.

These three layers are the master list. They go verbatim into `codex/banned.json`.

---

## 10. Status tracking — `docs/speakable/PHASE-STATUS.md`

Create this file at the start of the run (it does not exist yet). Update it after **every single deliverable**. Format:

```markdown
# Speakable run — live status

Last update: <ISO timestamp>
Phase: 0
Run mode: Phase 0 only — will halt at Phase 0 completion
Time elapsed: <hh:mm>

## Deliverables
- [x] 0.6 word-ceilings.md         — committed (`<commit-sha-short>`)
- [x] 0.7 depth-markers.md         — committed
- [x] 0.4 lint-rules.md            — committed
- [ ] 0.1 archetypes.md            — in progress
- [ ] 0.2 pillar-register.md
- [ ] 0.3 schema (TS + JSON)
- [ ] 0.5 codex (4 files)
- [ ] 0.8 visual-style-guide.md

## Open questions for human
See HUMAN-REVIEW-QUEUE.md (count: <N>)
```

Also create `docs/speakable/HUMAN-REVIEW-QUEUE.md` even if empty, so it's there to append to.

---

## 11. Commit policy

- **One commit per deliverable.** Commit message format: `feat(speakable): Phase 0.<N> — <deliverable name>`.
    - e.g. `feat(speakable): Phase 0.6 — word ceilings reference`
- **Never `git push`.** User reviews everything locally first.
- **Never `git commit --amend`.** Each deliverable is its own commit so the user can see incremental progress.
- **Never `--no-verify`.** No pre-commit hook exists yet (it's Phase 4), but if one appears, respect it.
- After commit, update `PHASE-STATUS.md` (a separate, smaller commit is fine: `chore(speakable): update Phase 0 status`).

---

## 12. Self-check before each commit

Before committing each deliverable, mentally run this 4-step check:

1. **Cross-reference check:** does the file's content match the section of `SPEAKABLE-PLAN.md` it claims to mirror?
2. **Banned vocab check:** the deliverable file itself has zero Layer-2 and Layer-3 phrases. (Layer 1 is allowed in spec docs but flag if you used any.)
3. **Coverage check:** every required field/section listed in §7 of this prompt is present.
4. **Voice check:** the file does not address the user as "you should…". It is a spec, not a coaching doc.

If any check fails, fix it before committing.

---

## 13. Final report

When all 8 deliverables are committed, write `docs/speakable/PHASE-0-REPORT.md`:

```markdown
# Speakable redesign — Phase 0 report

Completed: <ISO timestamp>
Total wall time: <hh:mm>
Total commits: 8 (deliverables) + N (status updates)

## Deliverable status
| # | Path | Status | Commit | Notes |
|---|---|---|---|---|
| 0.1 | docs/speakable/archetypes.md | done | abc123 |  |
| 0.2 | docs/speakable/pillar-register.md | done | def456 |  |
| ... |

## Coverage stats
- Codex topics: <count> (≥ 60 required)
- Phrasings: <count> (≥ 240 expected at 4 avg per topic)
- Standard examples: <count>
- Pillars represented: 12 / 12
- Archetypes specified: 7 / 7

## Open items routed to human
- See HUMAN-REVIEW-QUEUE.md (<N> items, summary per category)

## Recommended next step
Review the 8 deliverables. When approved, run Phase 1 (build the lint script + renderer + primitives + admin UI). The Phase 1 prompt will reference these Phase 0 artefacts directly.

## Things explicitly NOT done in this phase
- No `audit_speakable.py` (Phase 1)
- No React primitives or renderer (Phase 1)
- No admin review UI (Phase 1)
- No content edits, no `complete-qa.json` modified
- No git push
```

Then update `PHASE-STATUS.md` one final time:
- `Phase: complete`
- All deliverables checked
- Final commit time

---

## 14. Stop condition

Phase 0 is **done** when:

1. All 8 deliverables exist at their specified paths.
2. All 8 are committed (`git log` shows 8 `feat(speakable): Phase 0.x` commits).
3. `PHASE-0-REPORT.md` and `PHASE-STATUS.md` are written and committed.
4. `HUMAN-REVIEW-QUEUE.md` exists (even if empty).
5. No file under `content/`, `content-md/`, `frontend/components/preview/`, or `frontend/components/question/` has been modified or deleted.

When all five are true: **post one summary message to the user and stop.** Do not start Phase 1. Do not even sketch Phase 1. The user will run Phase 1 in a fresh chat once they've reviewed Phase 0.

---

## 15. Summary message format (when you stop)

End the run with a single message in this exact shape:

```
Phase 0 complete.

Deliverables (8 of 8):
- docs/speakable/word-ceilings.md
- docs/speakable/depth-markers.md
- docs/speakable/lint-rules.md
- docs/speakable/archetypes.md
- docs/speakable/pillar-register.md
- frontend/lib/speakable/schema.ts + scripts/speakable_schema.json
- docs/speakable/familiarity-codex.md + codex/{phrasings,examples,banned}.json
- docs/speakable/visual-style-guide.md

Reports:
- docs/speakable/PHASE-0-REPORT.md
- docs/speakable/PHASE-STATUS.md (Phase: complete)
- docs/speakable/HUMAN-REVIEW-QUEUE.md (<N> items)

Commits: 8 deliverable commits + <N> status commits, none pushed.

No content, no `complete-qa.json`, no renderer files modified.

Next step: human reviews the 8 deliverables. When approved, kick off Phase 1 in a fresh chat.
```

That's the run. Read the plan first, then start with deliverable 0.6, and grind through to 0.8 in the order in §7.
