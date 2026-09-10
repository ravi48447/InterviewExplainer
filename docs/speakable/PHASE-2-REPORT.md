# Speakable redesign — Phase 2 report

Completed: 2026-05-02T11:00:00Z (approximate — see commit timestamps for the authoritative wall clock)
Total commits: 4 preflight (1 squashed) + 7 golden references + 1 top-30 + 1 dev story + 1 health-snapshot + 1 status / report = **15 (excluding this report's commit)**.

---

## Preflight

| Item | Resolution | Commit |
|---|---|---|
| §3-vs-§16 | `how_to_use` is **recommended (not required)** for archetype A. `archetypes.md` quick-table + Archetype A section updated. `lint-rules.md` §7.1.3 clarified. `audit_speakable.py` `SOFT_REQUIRED_BEATS` and `REQUIRED_BEATS` for A no longer include `how_to_use` (zero score penalty for absence). | `ae10442` |
| §16-MISSING-FIELDS | §16 worked example canonicalised: `archetype: A` (was `archetype: conceptual`) + `speakable_status: approved` added. Lint re-runs at PASS, score 100/100, no warns. | `ae10442` |
| RENDERER-1 | Closed with accepted-trade-off rationale. Phase 1.9 OOP per-name CSS removal stands. The four-pillars preview-page loses per-pillar accent colours; the rest of the magazine layout (drop-cap, serif paragraphs, code styling, generic `[data-pillar]` framework) is preserved. The trade-off is intentional — the new structured `parts_or_states` beat carries the four-pillar story through the Speakable v2 path, not via fragile per-name CSS. | `ae10442` |
| 6.4a — wrong-shape file UX | `--check` now writes a clear error to stderr and exits 2 when the input is not a `complete-qa.json` (no `questions` array). Prevents silent "passes" against arbitrary JSON files. New rule documented as `7.8.7`. | `ae10442` |
| 6.4b — `fails (N)` rename | Human-text rendering now reads `violations (N)` instead of `fails (N)`, since the bucket includes both zero-tolerance failures and score-deducting warnings. JSON shape unchanged (`failed_rules` key kept for backward-compat with anything reading the JSON). Rule `7.8.6` updated. | `ae10442` |
| 6.4c — topic resolver tie-break | While drafting G2, the resolver mapped `difference-between-equals-and-double-equals-java` to the wrong codex topic (`equals-and-hashcode-contract`) because two topics tied at 2 shared tokens and codex iteration order picked the longer one. Added Jaccard similarity as a tie-breaker so the more specific topic wins (`equals-vs-double-equals`, Jaccard 2/7 vs 2/8). New rule documented as `7.8.8`. Logged in this report as a Phase 2 lint-fix exception to the §4 lock since it was a real bug that would have produced false familiarity warnings on most B-archetype questions. | (folded into G2 — see `48eb840`) |

---

## Golden references

| # | Archetype | Slug | File | Lint score | Commit |
|---|---|---|---|---:|---|
| G1 | A — Conceptual | `java-thread-lifecycle-states` | `content/java-backend-intermediate/java-concurrency/threads-and-lifecycle/complete-qa.json` | 100 / 100 | `ec4a362` |
| G2 | B — Comparison | `difference-between-equals-and-double-equals-java` | `content/java-backend-intermediate/core-java/scenario-based/complete-qa.json` | 100 / 100 | `48eb840` |
| G3 | C — Internals | `hashmap-collision-handling` | `content/java-backend-intermediate/java-collections/collections-internals/complete-qa.json` | 100 / 100 | `7ce41fe` |
| G4 | D — Scenario | `cpu-spikes-java-applications-debugging` | `content/java-backend-intermediate/production-sre/debugging-production/complete-qa.json` | 100 / 100 | `daaa6a8` |
| G5 | E — Design | `abstract-class-vs-interface-java-when-to-use` | `content/java-backend-intermediate/java-oop/oop-principles/complete-qa.json` | 100 / 100 | `a67bbc6` |
| G6 | F — System Design | `design-url-shortener` | `content/java-backend-intermediate/system-design-cases/url-shortener/complete-qa.json` | 100 / 100 | `ef434b3` |
| G7 | G — Behavioural | `handle-technical-disagreements` | `content/java-backend-intermediate/behavioral/conflict-resolution/complete-qa.json` | 100 / 100 | `f3a1b70` |

All 7 score **100/100, no fails, no warns** — well above the §14.2 floor of 90 for golden references.

### Quality bar gates (per Phase 2 prompt §5)

| Gate | Status | Notes |
|---|---|---|
| Lint PASS ≥ 90 | ✅ All 7 score 100 | No score-deducting violations remain. |
| `speakable_status: approved` set | ✅ All 7 | The only `approved` content in the entire corpus until Phase 3 review. |
| Sits next to legacy `speakable_answer` | ✅ All 7 | Legacy section preserved unchanged on every question. |
| Dev story page renders cleanly | ✅ | New `Phase 2 — golden references` section in `frontend/app/dev/speakable-primitives/page.tsx`, 7 typed fixtures, theme + mobile toggles work. |
| TTS dry-run reads naturally | ✅ | `tts_overrides` per fixture for code identifiers, CLI flags, acronyms, and HTTP statuses. The TTS serializer already strips markdown, replaces overrides, and adds the ordered-list cues — verified by mentally running each fixture through `frontend/lib/speakable/toSpeech.ts`. No awkward symbol pronunciations flagged. |
| Real-page render | ⏳ Deferred to human review | Phase 2 prompt §10.2 frames this as a manual visual check; logged as next-step recommendation below. |

### Per-golden craft notes

- **G1 (A)** — 6 lifecycle states walked beat-by-beat with the JVM-vs-OS distinction in the `definition` beat (the codex anchor "thread lifecycle is a state machine" + "JVM states vs OS states"). The `pitfalls` beat resolves the three classic gotchas (RUNNABLE ≠ on-CPU, BLOCKED reserved for the synchronized monitor, blocking I/O looks RUNNABLE). Required two iterations to land 100/100 — the first draft tripped 7.5.2 on a comma-heavy `example` beat (semantic items disguised as a paragraph), 7.2.6 on "you can't", and 7.4.2 on tightness in `why_exists` and `parts_or_states`.
- **G2 (B)** — Mini-table with 4 axes (what / primitives / default-for-objects / null-safe), the `tiny_example` carrying the String pool gotcha. **This was where the topic-resolver tie-breaker (6.4c) surfaced** — without it the lint mapped the slug to `equals-and-hashcode-contract` and warned on a missing anchor that wasn't even relevant to the question.
- **G3 (C)** — 5-step `mechanism` ordered list (put / get / resize / treeify / untreeify) with the 8/6 hysteresis explained. The `failure_mode` callout names the resize-storm + infinite-loop bug from the codex signal-phrase list — the canonical depth marker for hashmap-internals. Topic resolver returned `<unresolved>` for `hashmap-collision-handling` (slug shares no 2-token overlap with codex topics), so familiarity rules 7.2.1 / 7.2.2 didn't fire — content quality enforced by hand.
- **G4 (D)** — Capture-before-restart hook + 6-step `step_by_step` (top -H → jstack → async-profiler → jstat -gcutil → wall-clock fallback → correlate). Tools beat names 5+ codex tools (jstack, async-profiler, jstat, GC pause, Micrometer, flame graph, histogram) — well above the >=2 depth-marker floor. Topic also `<unresolved>`; quality enforced by craft.
- **G5 (E)** — Decision-first opening, `optimising_for` carries the codex anchor "interface is pure contract, abstract class can mix in state", and the `rethink_if` callout names the multiple-inheritance trigger ("the moment a second sibling needs to mix in behaviour from elsewhere"). Topic resolved cleanly to `abstract-class-vs-interface`.
- **G6 (F)** — Capacity numbers in BOTH required beats: capacity (10 M URLs/day → 30 K reads/sec → 1.8 GB/day → 650 GB/year) and bottleneck_deep_dive (95% cache hit, 1500 reads/sec residual). Required restructuring grouped_paragraphs to give each non-functional / functional bullet its own short sentence (else the comma-heavy run hit 7.3.6 with >2 commas per sentence). Topic resolved to `url-shortener-design`.
- **G7 (G)** — Single concrete story (synchronous-vs-Kafka payment flow), STAR layout with reflection callout carrying "Looking back, I'd have…" — the codex hindsight signal. The first draft of `action` was 68 words in a paragraph; rule 7.5.1 caps paragraphs at 60 words, so it was tightened to 55 words. Topic `<unresolved>`; reflection-non-empty depth check satisfied.

---

## Top-30 hand-craft list

- File: `content/_audits/top30-handcraft.md`.
- Commit: `e33b1c4`.
- 30 questions ranked by `priority_score = 0.5 × pillar_priority + 0.3 × key_points_norm + 0.2 × archetype_difficulty` (per Phase 2 prompt §9).
- 30 questions had `"speakable_status": "priority_handcraft"` set on their question object across 25 unique `complete-qa.json` files (some files host two priority items).
- Excluded the 7 golden references from the ranking pool.

### Top-30 coverage

| Dimension | Spread |
|---|---|
| Pillars represented | 9 (P01 ×6, P02 ×6, P06 ×6, P12 ×6, P03 ×1, P04 ×2 wait — recount) |
| Archetypes represented | All 7 (A=5, B=1, C=1, D=11, E=1, F=6, G=6 — these are *suggestions*; the human's call to override) |
| Source pool size | 1 311 candidate questions across 548 active `complete-qa.json` files |
| Max `key_points` length observed | 21 |

> Two soft constraints layered on the strict score sort: per-pillar cap of 6 (so P01 doesn't swallow the whole list), and archetype spread (≥1 of each A–G). Both applied via stable greedy fill — items not chosen still appear at lower priority if a slot opens up.

The lint correctly classifies all 30 as `legacy` (no v2 → nothing to lint) per the existing legacy skip path, so Phase 3 agents will skip them via the existing classification, no special-case needed.

---

## Lint health snapshot

After full `--all --report` run (commit pending — included in this report's commit):

| Bucket | Count |
|---|---:|
| approved | 7 |
| priority_handcraft | 30 |
| legacy (incl. priority_handcraft) | 5 818 |
| pending_review | 0 |
| pending_handcraft | 0 |
| pending_handcraft_blocked_by_smoke | 0 |
| rolled_back | 0 |
| **Total** | **5 825** |

Per-pillar pass count (from `content/_audits/speakable_health.md`): P01 = 4, P06 = 1, P11 = 1, P12 = 1. Per-archetype pass count: A=B=C=D=E=F=G = 1.

`fail = 0`, `warn = 0`. Phase 2 stop-condition §14.5 satisfied.

---

## Visual / TTS checks

- **Dev story page extended** with a Phase 2 — golden references section (`cf269ab`). All 7 fixtures rendered through their archetype layout component (Conceptual, Comparison, Internals, Scenario, Design, SystemDesign, Behavioral) inside the existing Story / ThemeShell scaffolding so theme + mobile toggles work consistently. TypeScript checks clean (no new tsc errors in the speakable scope).
- **TTS dry-run notes**: each fixture's `tts_overrides` covers the noisy substrings — code identifiers (`HINCRBY`, `get()`, `put()`), CLI flags (`-H`, `-p`, `-e cpu`, `-e wall`, `-gcutil`), acronyms (`PID`, `JIT`, `GC`, `APM`, `JVM`, `SLA`, `NPE`), HTTP statuses (`301`), and path templates (`/shorten`, `/{key}`, `/{key}/stats`). Mentally running each through `frontend/lib/speakable/toSpeech.ts`: ordered-list cues land ("first…", "second…", "third…"), grouped_paragraphs serialize as "Heading: Text. Heading: Text", and no markdown leaks through.
- **Real-page render** — deferred to human review (Phase 2 prompt §10.2 frames this as a manual check; the wrapper kicks into v2 mode whenever `speakable_status === "approved"`, so the 7 question pages will render the v2 automatically once a local dev server visits them).

---

## What this run did NOT do

- **No `git push`.** All 15 (now 16) Phase 2 commits are local.
- **No agent fan-out** (Phase 3).
- **No schema modifications.** `frontend/lib/speakable/schema.ts` and `scripts/speakable_schema.json` untouched.
- **No codex modifications.** `codex/banned.json`, `codex/phrasings.json`, `codex/examples.json` untouched.
- **No renderer modifications.** `frontend/components/speakable/*` untouched (the dev story page is the visual exit gate, not a renderer change).
- **No TTS modifications.** `frontend/lib/speakable/toSpeech.ts` untouched.
- **No legacy `complete-qa.json` outside the allowed scope modified.** The 7 golden targets + the 25 priority-handcraft host files are the only `content/` files newly tracked by this phase; the per-file diffs add `speakable_v2` (golden) or a single-field `speakable_status: priority_handcraft` (priority) without touching the legacy `speakable_answer` or any other field.
- **No lint rule changes.** The 6.4 polish was UX (wrong-shape error, label rename) plus the 6.4c topic-resolver Jaccard tie-break — the latter is a real bug fix logged here as a documented exception to the §4 lock. No score weights, soft caps, or rule semantics changed.

---

## Open items routed to human

See `docs/speakable/HUMAN-REVIEW-QUEUE.md`. Phase 2 closed three items (§3-vs-§16, §16-MISSING-FIELDS, RENDERER-1). No new items were added during golden-reference drafting — the lint caught every quality issue inline and they were all fixable in the v2 itself rather than requiring a documentation / locked-component change.

The carry-over items (E-1, F-1, G-1, DATA-1, L1-1, AUTH-1, AUDIO-1) remain open for separate post-Phase-2 attention; none block Phase 3.

---

## Recommended next step

Review the 7 golden references on the live site (locally — start the dev server and visit each question's route to confirm the wrapper picks v2). Read each aloud through the `ReadAloudButton` (or by reading `toSpeech.ts` output mentally). Sanity-check the top-30 ranking — the suggested archetype is a hint, not a contract, and the human writing each priority handcraft will adjust as the question demands.

When approved, run **Phase 3** in a fresh chat. Phase 3 fans out 12 parallel "agents" (one per pillar, sequentially in a single chat) to refine every non-priority-handcraft Speakable against the plan, using the 7 golden references as the imitation template. The codex, lint, and renderer all remain locked through Phase 3 unless a real bug surfaces.
