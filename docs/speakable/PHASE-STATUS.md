# Speakable run — live status

Last update: 2026-05-02T03:30:00Z
Phase: 1
Run mode: Phase 1 only — **complete** (per Phase 1 prompt §22)
Time elapsed (this phase): ~00:45 (autonomous run)

## Phase 0 summary (carried over)

8 deliverables done — see `PHASE-0-REPORT.md`. Locked artefacts:
- `frontend/lib/speakable/schema.ts` + `scripts/speakable_schema.json` (schema)
- `codex/banned.json` + `codex/phrasings.json` + `codex/examples.json` + `docs/speakable/familiarity-codex.md`
- `docs/speakable/lint-rules.md`, `archetypes.md`, `pillar-register.md`, `word-ceilings.md`, `depth-markers.md`, `visual-style-guide.md`

## Phase 1 deliverables

- [x] Preflight: §16-1 plan-fix commit (`ea8eacd`)
- [x] Preflight: human-review-queue update (`f384ee7`)
- [x] Preflight: `scripts/data/word-ceilings.json` + `scripts/data/depth-markers.json` (`9969b6b`)
- [x] Preflight: PHASE-STATUS flip (`db82138`)
- [x] 1.1 `scripts/audit_speakable.py` — lint script (`15059ef`)
- [x] 1.2 `frontend/components/speakable/primitives/*` — 7 layout primitives (`9f5d01d`)
- [x] 1.7 `frontend/app/dev/speakable-primitives/page.tsx` — visual story page (`92eebab`)
- [x] 1.3 `frontend/components/speakable/layouts/*` — 7 per-archetype layouts (`3c4a17c`)
- [x] 1.4 `frontend/components/speakable/Speakable.tsx` + `Legacy.tsx` — wrapper + fallback (`7818105`)
- [x] 1.5 `frontend/lib/speakable/toSpeech.ts` — TTS-clean serializer (`e9b0732`)
- [x] 1.6 `frontend/components/speakable/ReadAloudButton.tsx` + audio-page wiring (`f2e0258`)
- [x] 1.8 admin/speakable-review page + API routes (`b0a1c52`)
- [x] 1.9 renderer integration — `QuestionPageLayout.tsx` + `PreviewArticle.tsx`, OOP per-name CSS removed (`507f49e`)
- [x] 1.10 health dashboard initial run + commit `speakable_health.md` (`5f2e4f4`)

## Open items routed to human

See `HUMAN-REVIEW-QUEUE.md` — 11 items total (6 carried from Phase 0, 5 new in Phase 1: §3-vs-§16, §16-MISSING-FIELDS, AUTH-1, AUDIO-1, RENDERER-1).

## Hard boundaries reasserted (per Phase 1 prompt §4)

- ✅ No `git push` — all 14 commits local.
- ✅ Zero modifications to `content/` apart from auto-generated `content/_audits/speakable_health.md`.
- ✅ Zero modifications to `content-md/`.
- ✅ Zero modifications to schema files (`frontend/lib/speakable/schema.ts`, `scripts/speakable_schema.json`).
- ✅ Zero modifications to codex JSON (`codex/banned.json`, `codex/phrasings.json`, `codex/examples.json`).
- ✅ Stage explicitly — `git add <paths>` only on every commit.
- ⚠️ Renderer integration (1.9) is byte-equivalent for `QuestionPageLayout`. For `PreviewArticle`, the four hardcoded OOP per-name CSS rules were dropped per the explicit §16.4 instruction; the OOP four-pillars page no longer shows per-pillar accent colors. See RENDERER-1 in HUMAN-REVIEW-QUEUE.

## Stop condition (per Phase 1 prompt §22) — all met

1. ✅ All 10 functional deliverables exist + preflight committed.
2. ✅ All commits local; nothing pushed.
3. ✅ Lint script: `python3 scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16` → score 96/100 (≥ 90).
4. ⚠️ Visual parity: byte-equivalent for QuestionPageLayout; intentional OOP-only deviation for PreviewArticle per §16.4. Logged as RENDERER-1.
5. ✅ PHASE-1-REPORT.md and PHASE-STATUS.md written and committed.
6. ✅ `git diff --name-only HEAD~14 HEAD -- content/ content-md/ codex/ frontend/lib/speakable/schema.ts scripts/speakable_schema.json` → only `content/_audits/speakable_health.md` (auto-generated dashboard, not content).

**Phase 1: complete.** Halt and await human review per §22. Do not start Phase 2 — the human runs it in a fresh chat.
