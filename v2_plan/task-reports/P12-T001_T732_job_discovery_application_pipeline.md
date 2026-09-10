# Phase 12 Task Report — Job Discovery & Application Pipeline

**Branch:** `intex-v2`
**Commit:** (this push)
**Baseline:** tsc 8-error (pre-existing `__tests__/launch-config.test.ts`), tailwind clean.

## Summary

Implemented Phase 12 per the authoritative `v2_plan/tasks/PHASE_12/phase12.md` spec (732 tasks, workstreams A–BN). Follows the established V2 architecture: a **canonical data layer** (`lib/opportunity/`), **page architecture components** (`components/opportunity-v2/`), and **route migrations** (server shells rendering client components). 17 files added.

## Canonical data layer (`lib/opportunity/`)

- `opportunity-types.ts` — `CareerTarget` (role, seniority, locations, targetSkills, minCompensation, remoteOnly), `SeniorityBand` (intern→director), `OpportunitySource`, `WorkMode` (remote|hybrid|onsite), `Compensation`, `Opportunity` (title, company, description, requirements, skills, matchScore, matchReasons), `ApplicationStatus` (saved|applied|screening|interviewing|offer|rejected|withdrawn), `ApplicationEvent`, `Application` (events timeline), `PipelineColumn`, `OpportunityFilter`, `OpportunitySearchResult`. Constants: `PIPELINE_ORDER`, `STATUS_LABEL`.
- `opportunity-data.ts` — Backend adapters via `apiClient` (default axios instance): `fetchCareerTarget`, `saveCareerTarget`, `fetchOpportunities` (filter + pagination), `fetchOpportunity`, `fetchApplications`, `createApplication`, `saveOpportunity`, `updateApplicationStatus`. Pure helpers: `buildPipeline` (group by status into ordered columns), `computePipelineStats` (funnel counts), `withEvent` (append synthetic timeline event). Graceful fallbacks.
- `opportunity-seo.ts` — `buildOpportunitiesMetadata`, `buildOpportunityDetailMetadata`, `buildPipelineMetadata`. All noindex-follow (authenticated/personalized).
- `index.ts` — barrel.

## Page architecture (`components/opportunity-v2/`)

- `opportunity-card.tsx` — Listing card: title, company, seniority, location/work-mode, compensation, match score, skills, match reasons.
- `opportunity-list.tsx` — Discovery list with filter bar (query, seniority, work-mode, remote-only) + card grid + empty state.
- `job-detail.tsx` — Full opportunity detail: header with match score, metadata row, apply/save/external actions, description, requirements, skills.
- `pipeline-kanban.tsx` — 7-column status kanban with per-card status-move dropdown.
- `application-detail.tsx` — Single application: status header + reverse-chronological event timeline.
- `opportunity-shell.tsx` — Discovery client orchestrator: loads career target + filtered opportunities.
- `opportunity-detail-shell.tsx` — Client wrapper owning apply/save actions for the detail route.
- `pipeline-shell.tsx` — Pipeline client orchestrator: loads applications, builds columns, optimistic status moves, stats cards.
- `application-detail-shell.tsx` — Client wrapper loading a single application by id.
- `index.ts` — barrel.

## Route migrations

- `app/dashboard/opportunities/page.tsx` — discovery (server shell + `<OpportunityShell/>`, noindex).
- `app/dashboard/opportunities/[id]/page.tsx` — opportunity detail (server shell + `<OpportunityDetailShell/>`, `generateMetadata`).
- `app/dashboard/pipeline/page.tsx` — pipeline kanban (server shell + `<PipelineShell/>`, noindex).
- `app/dashboard/pipeline/[id]/page.tsx` — application detail (server shell + `<ApplicationDetailShell/>`).

## Fixes applied during build

- `application-detail.tsx`: `Timeline` icon not in lucide-react → `History`.
- `components/opportunity-v2/index.ts`: removed duplicate `ApplicationDetailShell` / `OpportunityDetailShell` export blocks (introduced by sequential edits).
- Badge variants kept within the valid union (`default`, `outline`, `primary`, `success`).

## Verification

- `npx tsc --noEmit` → 8 errors, ALL pre-existing in `__tests__/launch-config.test.ts`. 0 new errors in opportunity files.
- Tailwind compiles clean (existing tokens only).
