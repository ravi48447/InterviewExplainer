# Speakable cheat sheet (notes, playbook 09)

> Baseline recorded: 2026-05-29. Lint script bugs fixed in this playbook:
> 1. `codex/examples.json` comment entries filtered (KeyError on `topic_id`).
> 2. `lint_complete_qa()` guards against non-dict JSON (list-typed files).
> `--pillar` flag NOT supported — gap recorded for playbook 10.

## The 7 archetypes (memorise letter → name → shape)

| ID | Name                    | Required beats (in instinct order)                                                     | Typical questions                                          |
| -- | ----------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| A  | Conceptual              | hook → definition → why_exists → parts_or_states → example → pitfalls → cap           | "What is X?"                                               |
| B  | Comparison              | hook → what_each_is → differences → when_to_pick → tiny_example → cap                 | "X vs Y", "Difference between X and Y"                     |
| C  | Internals               | hook → mental_model → mechanism → edge_cases → failure_mode → cap                     | "How does X work under the hood?"                          |
| D  | Scenario                | hook → clarify → hypothesis → step_by_step → tools → tradeoff → cap                   | "How would you debug …", "Walk me through …"               |
| E  | Design                  | hook → optimising_for → options → tradeoffs → decision → rethink_if → cap             | "Would you use X or Y here?", "X or Y for this case?"      |
| F  | System Design / LLD     | hook → requirements_fr_nfr → capacity → api → data_model → high_level → bottleneck_deep_dive → tradeoffs → cap | "Design X"    |
| G  | Behavioural / STAR      | hook → situation → task → action → result → reflection → cap                          | "Tell me about a time …"                                   |

### 30-second archetype decision tree

Walk in order; first yes wins:
1. Story prompt ("Tell me about a time…") → **G**
2. "Design X" with capacity numbers → **F**
3. Judgement call between named alternatives in a specific situation → **E**
4. Troubleshooting / on-call scenario → **D**
5. Abstract "X vs Y" comparison → **B**
6. "How does X work under the hood?" → **C**
7. Otherwise "What is X?" → **A**

Edge case: framing flips the archetype. "What is a HashMap?" = A. "How does HashMap work?" = C. "HashMap vs TreeMap?" = B.

## Speakable summary rules (≤ 320 chars, first-person)

- "I would explain auto-configuration as Spring Boot's mechanism to …"
- "The trade-off is throughput vs latency; I pick X when …"
- Never start with "Sure! Great question. Let me explain …"
- No code fences, markdown bold, or emoji.
- Don't repeat the question title verbatim.

## Banned phrases (the lint catches these — do not write them)

- great question
- in essence
- basically
- as we all know
- it depends (without naming dimensions)
- always / never (without justification)
- you've seen this / every tutorial / the classic line (Layer 2 — meta-references)
- you should say / tell the interviewer / make sure to mention (Layer 3 — coaching)
- leverage / utilize / battle-tested / seamless / robust (Layer 1 — hi-tech filler)

## How to run the lint

```bash
# One file:
python3 scripts/audit_speakable.py --check path/to/complete-qa.json

# Whole repo (with health report):
python3 scripts/audit_speakable.py --all --report --quiet

# Fixture test (SPEAKABLE-PLAN §16 worked example):
python3 scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16
```

Note: `--pillar P01` flag NOT supported in current version. Workaround for per-pillar scope:
```bash
python3 scripts/audit_speakable.py --all --quiet 2>&1 | grep "P01"
```

## Phase 3b starting baseline (recorded by playbook 09)

- pass=15
- warn=4
- fail=0
- legacy=5806
- total=5825
- Date measured: 2026-05-29

Interpretation: 5806 legacy Q-files have no `speakable_v2` block yet.
Phase 3b's job is to process the per-pillar queues in `content/_audits/agent-queues/`
and bring PASS count up from 15 toward ~200+ (JBI corpus) before launch.

## Score buckets

| Bucket | Score range | Meaning | Action |
|--------|-------------|---------|--------|
| PASS | 90–100 | Ships as-is | None |
| WARN | 70–89 | Ships but flagged | Polish next iteration |
| FAIL | < 70 | Does not ship | Rewrite required |
| LEGACY | n/a | No speakable_v2 present | Tag + rewrite in Phase 3b |

Score floor: ≥ 80 absolute required (lint-rules.md §7.8.3).

## Per-beat word ceilings (quick-ref)

| Archetype | Tightest beat | Hard cap |
|-----------|--------------|----------|
| A | hook, cap | 35 |
| B | differences / axis | 45 |
| C | hook, cap | 35 |
| D | hook, cap | 35 |
| E | hook, cap | 35 |
| F | hook, cap | 35 |
| G | hook, cap | 35 |

Full tables: `docs/speakable/word-ceilings.md`

## Where to look when stuck

- Per-pillar brief: `docs/speakable/agent-briefs/P0X-*.md`
- Per-pillar work queue: `content/_audits/agent-queues/P0X-queue.csv`
- Phase status: `docs/speakable/PHASE-STATUS.md`
- Human review queue: `docs/speakable/HUMAN-REVIEW-QUEUE.md`
- Lint rules: `docs/speakable/lint-rules.md`
- Word ceilings: `docs/speakable/word-ceilings.md`
- Archetypes: `docs/speakable/archetypes.md`

## Known gaps for playbook 10

1. `--pillar` flag not implemented — workaround: scope by directory path.
2. 5806 LEGACY Q-files. Process queues in `content/_audits/agent-queues/` order (P01 first).
3. Corpus example files in `content/java-backend-intermediate/` already have 15 PASS + 4 WARN — use these as reference quality when rewriting.
