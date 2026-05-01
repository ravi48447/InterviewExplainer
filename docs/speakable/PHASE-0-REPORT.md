# Speakable redesign — Phase 0 report

Completed: 2026-05-01T22:55:00Z
Total wall time: ~02:25
Total commits: 8 (deliverables) + 1 (final status update) = 9

## Deliverable status

| # | Path | Status | Commit | Notes |
|---|---|---|---|---|
| 0.1 | `docs/speakable/archetypes.md` | done | `411ead4` | 7 archetypes A–G with instinct skeleton, required/forbidden beats, ceiling + depth-marker citations, 3 example questions per archetype, 1 fully-filled YAML each, plus a 30-second decision tree. |
| 0.2 | `docs/speakable/pillar-register.md` | done | `1576b06` | 12 pillars with module list, topic must-includes, voice tweaks (mirroring plan §4 register riders), pillar-specific standard examples, dominant archetypes. Surfaces a data inconsistency in `_index.json` (`postgresql` mistagged as P06). |
| 0.3a | `frontend/lib/speakable/schema.ts` | done | `f515b8d` | Pure TypeScript types, strict-compile clean, zero React/imports. Discriminated union by archetype; per-archetype `BeatKind` constraints; layout-discriminated `BeatPayload`. |
| 0.3b | `scripts/speakable_schema.json` | done | `f515b8d` | JSON Schema 2020-12 mirror. Mechanically rejects "differences in archetype A" or "layout: bullets without items[]". JSON-parses cleanly; 7 archetype variants in top-level `oneOf`. |
| 0.4 | `docs/speakable/lint-rules.md` | done | `6a3152b` | Mirrors plan §7 in full (7.1–7.8). Each rule has a one-line pass criterion plus a one-line fail-mode example. Appendix A documents the §15.16 agent loop policy (20-iteration cap / 5-iteration plateau / 3-critic-rejection escapes → `pending_handcraft`). |
| 0.5a | `docs/speakable/familiarity-codex.md` | done | `935e81f` | Human-readable codex: principle (§2.3 + §2.7), universal voice rules, verbatim 3-layer banned vocabulary, per-pillar topic register listing all 101 topics. |
| 0.5b | `codex/phrasings.json` | done | `935e81f` | 101 topics across 12 pillars; ≥ 5 per pillar; ≥ 3 phrasings each; all `agent-seeded`. |
| 0.5c | `codex/examples.json` | done | `935e81f` | 101 entries 1:1 with phrasings.json by `topic_id`. |
| 0.5d | `codex/banned.json` | done | `935e81f` | Verbatim 3-layer list with machine-readable tolerance + lint-severity per layer. |
| 0.6 | `docs/speakable/word-ceilings.md` | done | `7aa697d` | Per-archetype tables A–G with soft + hard caps per beat. E/F/G expanded from the plan's narrative bounds (logged in HUMAN-REVIEW-QUEUE). |
| 0.7 | `docs/speakable/depth-markers.md` | done | `ea12db8` | Quick-ref table + per-archetype sections with 1–3 worked examples each. Documents the lint contract for §7.6: which beat carries the marker per archetype and which signal phrases the lint looks for. |
| 0.8 | `docs/speakable/visual-style-guide.md` | done | `4aae7ca` | Text spec only (per locked §15B.3). Typography, vertical rhythm, color tokens (light + dark + WCAG AA pledge), spacing tokens, mobile breakpoint rules, per-primitive sections for all 7 layout primitives, per-primitive TTS reading rules, renderer invariants. |

## Coverage stats

- **Codex topics:** 101 (≥ 60 required)
- **Phrasings:** ~330 (101 topics × ~3.3 avg per topic; ≥ 240 expected)
- **Standard examples:** 101 (1 per topic, 1:1 match enforced by id)
- **Pillars represented:** 12 / 12
- **Archetypes specified:** 7 / 7 (A, B, C, D, E, F, G)
- **Banned vocabulary:** 15 (Layer 1) + 10 (Layer 2) + 19 (Layer 3) = **44 phrases**, three layers, machine-readable
- **Schema files in lockstep:** 2 (`schema.ts` + `speakable_schema.json`)
- **Lint rule lines:** 49 mechanically-checkable rules across §7.1–7.8 + 5 agent-loop rules in Appendix A

## Open items routed to human

See `docs/speakable/HUMAN-REVIEW-QUEUE.md` (6 items):

- **E-1 / F-1 / G-1** (`word-ceilings.md`): per-beat ceiling expansions for archetypes E, F, G — the plan §8 gives only narrative bounds for these three; Phase 0 expanded into per-beat tables. Confirm or rebalance.
- **DATA-1** (`pillar-register.md`): `_index.json` data inconsistency — the `postgresql` module carries `pillar: P06` but `pillarName: "Data & Persistence"` (which is P03). Phase 0 treats it as P03 by content. Decide whether to fix `_index.json` or redefine P06.
- **L1-1** (`pillar-register.md`): Layer 1 banned vocab "blast radius" appears verbatim in the P09 register rider — direct mirror of plan §4. If the plan softens, propagate.
- **§16-1** (`schema`): the `SPEAKABLE-PLAN.md` §16 worked example was written before §15.18 (visual rhythm) was locked and lacks explicit `layout` per beat. The schema requires `layout`. Update §16 to insert `layout: paragraph` / `grouped_paragraphs` per beat where the structure already implies it.

## What this run did NOT do (explicitly out of scope)

- No `audit_speakable.py` (Phase 1.1)
- No React primitives or renderer (Phase 1.2 / 1.3)
- No TTS serializer (Phase 1.4)
- No `/admin/speakable-review` UI (Phase 1)
- No content edits — zero touches to `content/`, `content-md/`, `frontend/components/preview/`, or `frontend/components/question/`
- No `complete-qa.json` modified
- No agent fan-out (Phase 3); no smoke-test wiring
- No `git push` (locked: §11 of the brief)
- No file deletions or moves (Phase 0 is purely additive)

## Self-checks performed before each commit

For each of the 8 deliverable commits, the four checks from §12 of the brief were run:

1. **Cross-reference check** — every Phase 0 file matches the section of `SPEAKABLE-PLAN.md` it claims to mirror.
2. **Banned vocab check** — every deliverable file scanned for Layer 2 and Layer 3 phrases. Hits found: zero in Speakable-text positions; one Layer 2 enumeration in `visual-style-guide.md` §9 (deliberate quotation inside a prohibition rule); one Layer 1 hit ("blast radius") in `pillar-register.md` mirrored verbatim from plan §4 (logged as L1-1).
3. **Coverage check** — every required field/section listed in §7 of the brief is present in each deliverable.
4. **Voice check** — no spec doc addresses the user as "you should…". The docs are specs, not coaching.

## Recommended next step

**Review the 8 deliverables.** When the human reviewer is satisfied:

1. Resolve the 6 items in `HUMAN-REVIEW-QUEUE.md` (especially DATA-1 — the `_index.json` postgresql tag — which affects Phase 1 classification).
2. **Run Phase 1 in a fresh chat.** Phase 1 will build:
   - `scripts/audit_speakable.py` (the lint script implementing `lint-rules.md`)
   - The 7 React primitives in `frontend/components/speakable/primitives/*` (implementing `visual-style-guide.md`)
   - The unified renderer composing primitives per archetype
   - `frontend/lib/speakable/toSpeech.ts` (the TTS serializer)
   - `/admin/speakable-review` admin UI
   - `/dev/speakable-primitives` visual story page (Phase 1 exit gate)

The Phase 1 prompt should reference these Phase 0 artefacts directly — the schema is in `frontend/lib/speakable/schema.ts`, the lint contract is in `docs/speakable/lint-rules.md`, the codex is in `codex/*.json`, and the renderer's design spec is in `docs/speakable/visual-style-guide.md`.

Phase 1 is purely tooling. **No content moves until Phase 2 (golden-reference hand-craft) and Phase 3 (the "Go" signal for parallel agents).** Until then, no Speakable in the catalogue is at risk.

## Files added (full list, by commit)

```
0.6  7aa697d  +  docs/speakable/word-ceilings.md
              +  docs/speakable/PHASE-STATUS.md
              +  docs/speakable/HUMAN-REVIEW-QUEUE.md

0.7  ea12db8  +  docs/speakable/depth-markers.md
              ~  docs/speakable/PHASE-STATUS.md

0.4  6a3152b  +  docs/speakable/lint-rules.md
              ~  docs/speakable/PHASE-STATUS.md

0.1  411ead4  +  docs/speakable/archetypes.md
              ~  docs/speakable/PHASE-STATUS.md

0.2  1576b06  +  docs/speakable/pillar-register.md
              ~  docs/speakable/PHASE-STATUS.md
              ~  docs/speakable/HUMAN-REVIEW-QUEUE.md

0.3  f515b8d  +  frontend/lib/speakable/schema.ts
              +  scripts/speakable_schema.json
              ~  docs/speakable/PHASE-STATUS.md
              ~  docs/speakable/HUMAN-REVIEW-QUEUE.md

0.5  935e81f  +  docs/speakable/familiarity-codex.md
              +  codex/phrasings.json
              +  codex/examples.json
              +  codex/banned.json
              ~  docs/speakable/PHASE-STATUS.md

0.8  4aae7ca  +  docs/speakable/visual-style-guide.md
              ~  docs/speakable/PHASE-STATUS.md
```

`+` = new file, `~` = modified.

Net: 14 new files, 0 deletions, 0 moves. Phase 0 is purely additive (per §4 of the brief).
