# V2 Issue Log (P15-T6294..T6358)

Records unresolved issues, exceptions, and follow-ups discovered during the
v2 migration, with owners and dispositions. Supersedes ad-hoc notes scattered
across phase reports.

## Open issues

| ID | Phase | Severity | Description | Owner | Disposition |
|----|-------|----------|-------------|-------|-------------|
| V2-I-001 | P01 | Low | Button retains legacy variant aliases (`accent`, `success`, `premium`, `shadow`) mapping to `primary` (Decision D3). | Frontend | Keep aliases; migrate 3 consumers in a follow-up. Not blocking. |
| V2-I-002 | P09 | Low | Richer legacy modular cards (`SkillRadarCard`, `ActivityHeatmapCard`, `AchievementsCard`) remain composed by legacy dashboard glue, not re-wrapped by the new shell (Decision D26). | Frontend | Intentional deviation; documented. |
| V2-I-003 | P10 | Med | Mock interview history has no persistence API; history route shows an empty-state CTA (Decision D27). | Backend | Backlog: add session-store + history API. |
| V2-I-004 | P11–13 | Med | New data layers (`lib/resume`, `lib/opportunity`, `lib/community`) call API paths (`/resume`, `/opportunities`, `/applications`, `/career-targets`, `/community`, `/moderation`) that must be implemented by backend services. Frontend falls back to local compute / empty states until then. | Backend | Backlog: implement the 6 API groups. |
| V2-I-005 | P14 | Med | Rate-limit store is in-memory (single-instance). Multi-instance production needs a Redis-backed `RateLimitStore` (Decision D30). | Backend/Infra | Backlog: implement Redis store before multi-instance rollout. |
| V2-I-006 | P14 | Low | CSP allows `'unsafe-inline'` + `'unsafe-eval'` for scripts to support Next.js SSR. Tighten with nonces in a follow-up. | Frontend | Backlog: move to nonce-based CSP. |
| V2-I-007 | P15 | Low | Legacy backend/database removal (Workstream AO/AP) is owned by backend services outside this repo. | Backend | Backlog: tracked per-service. |

## Resolved during migration

| ID | Phase | Description | Resolution |
|----|-------|-------------|------------|
| V2-R-001 | P11 | `resume-data.ts` imported non-existent `apiFetch`. | Rewrote to default `apiClient` (D28). |
| V2-R-002 | P11 | `ResumeFormat` vs `ResumeFileType` type-name mismatch. | Aligned to `ResumeFileType`. |
| V2-R-003 | P11 | Badge `variant="secondary"` not in variant union. | Changed to `default`/`outline`. |
| V2-R-004 | P11 | `JobTarget.rawText` / `Claim.source.location` field mismatches. | Aligned to `description` / `sourceSection`. |
| V2-R-005 | P12 | `Timeline` icon not exported by lucide-react. | Used `History`. |
| V2-R-006 | P11–13 | Repeated duplicate-export errors in barrel `index.ts` files from sequential edits. | Rewrote barrels cleanly with Write. |
| V2-R-007 | P13 | `form-input` utility class not defined. | Replaced with inline standard input classes. |

## tsc baseline

- 8 pre-existing errors, all in `__tests__/launch-config.test.ts` (unrelated to v2 work).
- 0 new errors introduced across Phases 11–15.
- Verification command: `npx tsc --noEmit 2>&1 | grep "error TS" | grep -v "launch-config.test.ts" | wc -l` → `0`.
