# Speakable redesign — Phase 1 report

Completed: 2026-05-02T03:30:00Z (approx — see commit timestamps for authoritative)
Total commits: 14 (10 functional deliverables + 1 preflight + 3 status / docs)

## Deliverable status

| # | Path | Status | Commit | Notes |
|---|---|---|---|---|
| Preflight A | `docs/SPEAKABLE-PLAN.md` (committed; §16-1 fix carried in) | done | `ea8eacd` | resolves §16-1 in HUMAN-REVIEW |
| Preflight B | `docs/speakable/HUMAN-REVIEW-QUEUE.md` updates | done | `f384ee7` | logs §3-vs-§16, §16-MISSING-FIELDS, AUTH-1 |
| Preflight C | `scripts/data/word-ceilings.json` + `scripts/data/depth-markers.json` | done | `9969b6b` | per-beat caps for all 7 archetypes |
| Preflight D | `docs/speakable/PHASE-STATUS.md` flip to Phase 1 | done | `db82138` |  |
| 1.1 | `scripts/audit_speakable.py` | done | `15059ef` | passes §16 fixture, score 96/100 (≥ 90) |
| 1.2 | `frontend/components/speakable/primitives/*` + `speakable.css` | done | `9f5d01d` | 7 primitives, light/dark, mobile-collapsing table |
| 1.7 | `frontend/app/dev/speakable-primitives/page.tsx` | done | `92eebab` | theme + mobile toggle |
| 1.3 | `frontend/components/speakable/layouts/*` | done | `3c4a17c` | 7 archetype layouts + dispatch + shell + visual story extension |
| 1.4 | `frontend/components/speakable/Speakable.tsx` + `Legacy.tsx` + `index.ts` | done | `7818105` | byte-equivalent legacy parity for `question` variant |
| 1.5 | `frontend/lib/speakable/toSpeech.ts` | done | `e9b0732` | 1:1 port of Python `to_speech_text`; inline `__runTests` |
| 1.6 | `frontend/components/speakable/ReadAloudButton.tsx` (+ audio-page wiring) | done | `f2e0258` | wired into mock-interviews/audio (post-answer); see AUDIO-1 |
| 1.8 | `frontend/app/admin/speakable-review/*` + `frontend/app/api/admin/speakable-review/*` | done | `b0a1c52` | empty queue → "All clear" empty state; lint route also exposed per-violation detail (added `violations` to `result_to_dict`) |
| 1.9 | renderer integration (`QuestionPageLayout.tsx` + `PreviewArticle.tsx`) | done | `507f49e` | OOP four-name CSS rules removed; see RENDERER-1 |
| 1.10 | `content/_audits/speakable_health.md` | done | `5f2e4f4` | initial snapshot — 5825 / 5825 questions = legacy |

## Coverage stats

- **Files added (this phase):** ~28 new files (primitives, layouts, wrapper, Legacy, ReadAloudButton, admin page + 4 API routes + 2 admin libs, speakable.css, toSpeech.ts, audit_speakable.py, two preflight JSONs, speakable_health.md, dev visual story page, 3 docs).
- **Files modified (this phase):** 4 (`QuestionPageLayout.tsx`, `PreviewArticle.tsx`, `frontend/app/mock-interviews/audio/page.tsx`, `scripts/audit_speakable.py` for the `violations` JSON addition).
- **Lines of code (approx):** TypeScript ≈ 4 100, Python ≈ 1 660, JSON / docs ≈ 600.
- **Lint script:** §16 worked-example fixture scores **96 / 100** (target ≥ 90; one structural warn from §3-vs-§16 inconsistency, weight −4).
- **Existing legacy questions render visually unchanged:** `QuestionPageLayout` swap is byte-equivalent (`Legacy.tsx variant="question"` is a verbatim port). `PreviewArticle` swap drops the four hardcoded OOP per-name CSS rules per the §16.4 instruction; the rest of the magazine layout (drop-cap, serif paragraphs, code styling, generic `[data-pillar]` framework) carries over via the global `<style>` tag in `PreviewArticle`. Logged as RENDERER-1 in HUMAN-REVIEW for confirmation.

## What this run did NOT do

- **No `complete-qa.json` modified.** Zero touches to `content/` apart from the regenerated `content/_audits/speakable_health.md` (auto-generated audit artefact, not content).
- **No schema or codex edits.** Phase 0 outputs locked.
- **No `git push`.** All 14 commits are local.
- **No Phase 2 work** (golden references, top-30 hand-craft list).
- **No Phase 3 work** (parallel agents).

## Verification (Phase 1 prompt §22 stop conditions)

1. ✅ All 10 functional deliverables exist + preflight committed.
2. ✅ All commits local; nothing pushed.
3. ✅ `python3 scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16` → score 96/100 (≥ 90).
4. ⚠️ Visual parity: byte-equivalent for `QuestionPageLayout`. For `PreviewArticle`, the four hardcoded OOP per-name CSS rules were removed per the §16.4 explicit instruction; the OOP four-pillars page now renders the four pillar paragraphs without the per-pillar accent colors. Logged in HUMAN-REVIEW (RENDERER-1) for confirmation. The Phase 1 prompt acknowledges this trade-off in §16.4.
5. ✅ `PHASE-1-REPORT.md` and `PHASE-STATUS.md` written and committed.
6. ✅ `git diff --name-only HEAD~14 HEAD -- content/ content-md/ codex/ frontend/lib/speakable/schema.ts scripts/speakable_schema.json` → only `content/_audits/speakable_health.md` (the auto-generated dashboard).

## Open items routed to human

See `docs/speakable/HUMAN-REVIEW-QUEUE.md`. Phase 1 added three new items on top of the Phase 0 carry-over:

- **§3-vs-§16** — `how_to_use` is required in plan §3 but absent in §16 worked example. Lint treats as soft-required (warn-only).
- **§16-MISSING-FIELDS** — §16 YAML uses `archetype: conceptual` and omits `speakable_status`. Lint's `--check-fixture` normalises both for testing only; production data must use the canonical form.
- **AUTH-1** — Admin review UI gated behind `?key=` query param vs `SPEAKABLE_ADMIN_KEY` env. Dev-only; needs real auth before any external use.
- **AUDIO-1** — Audio mock page never read the speakable answer aloud, so Phase 1.6's "wire into audio page" had no obvious replace point. ReadAloudButton was added next to "Replay Question" but only renders after the candidate has answered.
- **RENDERER-1** — Phase 1.9 OOP per-name CSS removal vs visual parity guardrail. The four hardcoded rules are gone per the explicit instruction; the OOP four-pillars preview-page visual shifts (loses per-pillar accent colors) but the rest of the magazine layout is preserved.

## Recommended next step

Review the Phase 1 deliverables. Visit `/dev/speakable-primitives` (light/dark + mobile toggles) and `/admin/speakable-review?key=<env>` (will show "All clear" empty state with current data) locally. Confirm visual parity manually on three legacy questions per §16.5. Resolve the HUMAN-REVIEW-QUEUE items (especially §3-vs-§16 and RENDERER-1) before Phase 2.

When the human reviewer is satisfied, run **Phase 2** in a fresh chat to hand-craft the 7 golden references + produce the top-30 hand-craft list.
