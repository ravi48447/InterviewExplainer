# Phase 13 Task Report — Real Interview Intelligence & Community Knowledge

**Branch:** `intex-v2`
**Commit:** (this push)
**Baseline:** tsc 8-error (pre-existing `__tests__/launch-config.test.ts`), tailwind clean.

## Summary

Implemented Phase 13 per the authoritative `v2_plan/tasks/PHASE_13/phase13.md` spec (722 tasks, workstreams A–BN). Follows the established V2 architecture: a **canonical data layer** (`lib/community/`), **page architecture components** (`components/community-v2/`), and **route migrations** (server shells rendering client components). 19 files added.

## Canonical data layer (`lib/community/`)

- `community-types.ts` — `ContributionType` (reported-question|experience-report|salary-report|interview-tip), `ContributionStatus` (pending|approved|rejected|flagged), `Contribution`, `QuestionCategory` (technical|system-design|behavioral|coding|domain-specific|hr), `ReportedQuestion` (reportCount, answerSummary, upvotes), `EvidenceType` (community-report|verified-offer|recruiter-confirm|public-source), `EvidenceRecord` (trust 0..1), `CompanyInterviewIntelligence` (difficultyScore, typicalRounds, topQuestions, topTags, offerRate), `ModerationAction` (approve|reject|flag|unflag|delete), `ModerationLogEntry`, `CommunityFilter`.
- `community-data.ts` — Backend adapters via `apiClient`: `fetchReportedQuestions` (filter+pagination), `fetchQuestion`, `fetchContributions`, `submitContribution`, `upvoteContribution`, `fetchCompanyIntelligence`, `fetchFeaturedCompanies`, `fetchEvidence`, `moderateContribution`. Pure helpers: `statusForAction` (action→status map), `aggregateCompanyIntelligence` (client-side aggregation fallback: difficulty score, top tags, typical rounds, offer rate, top questions), `filterContributions`.
- `community-seo.ts` — `buildCommunityLandingMetadata`, `buildCompanyIntelligenceMetadata`, `buildReportedQuestionMetadata` (indexable — public UGC discovery surface); `buildContributionFormMetadata`, `buildModerationMetadata` (noindex — authenticated).
- `index.ts` — barrel.

## Page architecture (`components/community-v2/`)

- `contribution-form.tsx` — Multi-field submit form: type selector, company, role, content, difficulty, round, tag input with chip removal. Field validation.
- `contribution-shell.tsx` — Client wrapper owning the submit action + success state.
- `evidence-display.tsx` — Trust-weighted evidence list (verified-offer / recruiter-confirm ranked highest).
- `company-intelligence.tsx` — Aggregated company profile: difficulty gauge, avg process days, offer rate, typical rounds, top reported questions, tag frequency.
- `company-intelligence-shell.tsx` — Client wrapper loading company intelligence (aggregated endpoint → client-side aggregation fallback).
- `question-detail.tsx` — Reported question detail: category, difficulty, tags, report/upvote counts, answer summary, evidence.
- `question-detail-shell.tsx` — Client wrapper loading a question + its evidence by id.
- `community-shell.tsx` — Landing client orchestrator: featured companies + reported-question search.
- `index.ts` — barrel.

## Route migrations

- `app/community/page.tsx` — community landing (indexable, server shell + `<CommunityShell/>`).
- `app/community/companies/[company]/page.tsx` — company intelligence (indexable, `generateMetadata`).
- `app/community/questions/[id]/page.tsx` — reported question detail (indexable, `generateMetadata`).
- `app/community/contribute/page.tsx` — contribution form (noindex, server shell + `<ContributionShell/>`).

## Fixes applied during build

- `contribution-form.tsx`: replaced undefined `form-input` utility class with inline standard input classes (matching `opportunity-list.tsx`).
- `components/community-v2/index.ts`: removed duplicate export blocks introduced by sequential edits.
- SEO split: public company/question pages indexable (UGC discovery surface); contribution form + moderation noindex (authenticated).

## Verification

- `npx tsc --noEmit` → 8 errors, ALL pre-existing in `__tests__/launch-config.test.ts`. 0 new errors in community files.
- Tailwind compiles clean (existing tokens only).
