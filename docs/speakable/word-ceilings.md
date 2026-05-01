# Per-beat word ceilings

> **Status:** locked at Phase 0 sign-off. This file is the calibration target the lint script (`scripts/audit_speakable.py`, Phase 1) reads to enforce §7.4 of `SPEAKABLE-PLAN.md`. Subsequent tuning happens via documented review, never silently.

Length is controlled **per beat**, never per archetype-total. A Speakable is "tight" when:

1. Every beat is at or below its **hard cap** (lint-fail otherwise).
2. ≥ 80 % of the beats sit at or below their **soft ceiling** (target).
3. The summed beat words land inside the archetype's **expected total** range.

Numbers are calibrated for spoken English at a relaxed pace (~140 words/min). The hooks and caps are deliberately tight so the answer opens cleanly and lands cleanly.

---

## Archetype A — Conceptual

| Beat | Soft ceiling | Hard cap |
|---|---:|---:|
| hook | 25 | 35 |
| definition | 60 | 80 |
| why_exists | 50 | 70 |
| parts_or_states | 90 | 130 |
| how_to_use / variants | 80 | 110 |
| example | 80 | 120 |
| pitfalls | 60 | 90 |
| cap | 25 | 35 |
| **Expected total** | **~470** | **~680** |

---

## Archetype B — Comparison

| Beat | Soft ceiling | Hard cap |
|---|---:|---:|
| hook | 25 | 35 |
| what_each_is | 50 | 70 |
| each `differences` axis (3–4 axes total) | 30 / axis | 45 / axis |
| when_to_pick | 60 | 90 |
| tiny_example | 40 | 60 |
| cap | 25 | 35 |
| **Expected total** (with 4 axes) | **~290** | **~430** |

---

## Archetype C — Internals

| Beat | Soft ceiling | Hard cap |
|---|---:|---:|
| hook | 25 | 35 |
| mental_model | 70 | 90 |
| mechanism | 100 | 140 |
| edge_cases | 70 | 100 |
| failure_mode | 60 | 90 |
| cap | 25 | 35 |
| **Expected total** | **~350** | **~490** |

---

## Archetype D — Scenario

| Beat | Soft ceiling | Hard cap |
|---|---:|---:|
| hook | 25 | 35 |
| clarify | 35 | 50 |
| hypothesis | 60 | 80 |
| step_by_step | 120 | 170 |
| tools | 50 | 70 |
| tradeoff | 50 | 70 |
| cap | 25 | 35 |
| **Expected total** | **~365** | **~510** |

---

## Archetype E — Design

> Plan §8 expresses E as a narrative bound (*"Total expected: ~250–350 words. Each beat tight; `rethink_if` ≤ 50 words"*). The per-beat numbers below are the Phase 0 expansion of that bound; they sum to within the plan's range. See human-review queue item E-1.

| Beat | Soft ceiling | Hard cap |
|---|---:|---:|
| hook | 25 | 35 |
| optimising_for | 30 | 45 |
| options | 70 | 100 |
| tradeoffs | 60 | 85 |
| decision | 25 | 40 |
| rethink_if | 35 | 50 |
| cap | 25 | 35 |
| **Expected total** | **~270** | **~390** |

---

## Archetype F — System Design / LLD

> Plan §8 expresses F as a narrative bound (*"Each phase ≤ ~120 words; total ~600–900 words"*). Per-beat numbers below are the Phase 0 expansion of that bound. F is intentionally the longest archetype — the format the interview demands. See human-review queue item F-1.

| Beat | Soft ceiling | Hard cap |
|---|---:|---:|
| hook | 25 | 35 |
| requirements_fr_nfr | 80 | 120 |
| capacity | 70 | 110 |
| api | 80 | 120 |
| data_model | 80 | 120 |
| high_level | 80 | 120 |
| bottleneck_deep_dive | 100 | 140 |
| tradeoffs | 80 | 110 |
| cap | 25 | 35 |
| **Expected total** | **~620** | **~910** |

---

## Archetype G — Behavioural / STAR

> Plan §8 expresses G as a narrative bound (*"S/T/A/R each ~50–80 words; Reflection ~40 words; total ~250–350"*). The numbers below are the Phase 0 expansion of that bound. See human-review queue item G-1.

| Beat | Soft ceiling | Hard cap |
|---|---:|---:|
| hook | 25 | 35 |
| situation | 60 | 80 |
| task | 50 | 70 |
| action | 70 | 100 |
| result | 50 | 70 |
| reflection | 40 | 55 |
| cap | 25 | 35 |
| **Expected total** | **~320** | **~445** |

---

## Cross-references

- Lint tightness rules: `docs/speakable/lint-rules.md` §7.4 (and `SPEAKABLE-PLAN.md` §7.4).
- Plan source: `SPEAKABLE-PLAN.md` §8.
- Visual rhythm interaction: paragraphs > 60 words must split (§7.5 paragraph length rule). The 60-word paragraph cap is independent of these per-beat caps and applies *inside* a beat to any single paragraph rendered with `layout: paragraph`.
- Locked decision §15.7 (per-beat ceilings, not per-archetype totals) and §15.12 (lint score floor ≥ 80 absolute) of the plan are what these numbers serve.
