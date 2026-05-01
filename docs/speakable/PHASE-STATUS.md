# Speakable run — live status

Last update: 2026-05-02T02:50:00Z
Phase: 1
Run mode: Phase 1 only — will halt at Phase 1 completion (per Phase 1 prompt §22)
Time elapsed (this phase): 00:15

## Phase 0 summary (carried over)
8 deliverables done — see `PHASE-0-REPORT.md`. Locked artefacts:
- `frontend/lib/speakable/schema.ts` + `scripts/speakable_schema.json` (schema)
- `codex/banned.json` + `codex/phrasings.json` + `codex/examples.json` + `docs/speakable/familiarity-codex.md`
- `docs/speakable/lint-rules.md`, `archetypes.md`, `pillar-register.md`, `word-ceilings.md`, `depth-markers.md`, `visual-style-guide.md`

## Phase 1 deliverables
- [x] Preflight: §16-1 plan-fix commit (`ea8eacd`)
- [x] Preflight: human-review-queue update (`f384ee7`)
- [x] Preflight: `scripts/data/word-ceilings.json` + `scripts/data/depth-markers.json` (`9969b6b`)
- [ ] 1.1 `scripts/audit_speakable.py` — lint script
- [ ] 1.2 `frontend/components/speakable/primitives/*` — 7 layout primitives
- [ ] 1.7 `frontend/app/dev/speakable-primitives/page.tsx` — visual story page
- [ ] 1.3 `frontend/components/speakable/layouts/*` — 7 per-archetype layouts
- [ ] 1.4 `frontend/components/speakable/Speakable.tsx` + `Legacy.tsx` — wrapper + fallback
- [ ] 1.5 `frontend/lib/speakable/toSpeech.ts` — TTS-clean serializer
- [ ] 1.6 `frontend/components/speakable/ReadAloudButton.tsx` + audio-page wiring
- [ ] 1.8 admin/speakable-review page + API route
- [ ] 1.9 renderer integration — `QuestionPageLayout.tsx` + `PreviewArticle.tsx`, remove OOP-hardcoded CSS
- [ ] 1.10 health dashboard initial run + commit `speakable_health.md`

## Open items routed to human
See `HUMAN-REVIEW-QUEUE.md` — 8 items total (6 carried from Phase 0, 2 new in Phase 1: §3-vs-§16, §16-MISSING-FIELDS, AUTH-1 will be added when 1.8 lands).

## Hard boundaries reasserted (per Phase 1 prompt §4)
- No `git push`. Local commits only.
- Zero modifications to `content/`, `content-md/`, schema files, or codex JSON.
- Stage explicitly — `git add <paths>` only.
- Renderer integration (1.9) must produce visually-identical legacy output for every existing question.

## Stop condition (per Phase 1 prompt §22)
1. All 10 functional deliverables exist + preflight committed. (in progress)
2. All commits local. (clean)
3. Lint script passes on §16 fixture, score ≥ 90.
4. Existing legacy questions render visually unchanged (3-question manual check).
5. PHASE-1-REPORT.md and PHASE-STATUS.md written and committed.
6. `git diff` against locked paths returns empty.
