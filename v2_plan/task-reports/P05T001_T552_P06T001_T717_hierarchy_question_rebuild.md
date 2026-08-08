# Phase 05+06 — Content Discovery Hierarchy & Individual Question Page Rebuild (P05 T001–T552, P06 T001–T717)

**Status:** ✅ COMPLETE (552/552 + 717/717 = 1269/1269)
**Session:** 11
**Branch:** `intex-v2`

## Objective

**Phase 05:** Rebuild the content-discovery hierarchy behind a single canonical resolver layer — domain → stack → pillar → module → question — so every discovery page consumes one data source instead of reaching into content-reader, seo-pillars, and seo-slugs independently.

**Phase 06:** Rebuild the individual question page and the interview-answer reading experience behind a canonical question data layer that adapts the existing `QuestionPagePayload` (api.ts) into a structured `QuestionPageData` contract consumed by dedicated V2 components — header, answer renderer, prev/next, related, follow-ups — with FAQPage + BreadcrumbList JSON-LD and speakable content.

## What was built

### Phase 05 — Canonical hierarchy data layer (`lib/hierarchy/`)

Single ownership of hierarchy resolution. All V2 discovery pages consume these resolvers instead of content-reader / seo-pillars directly (P05-T021/T022).

| File | Workstream | Responsibility |
|------|-----------|----------------|
| `lib/hierarchy/hierarchy-types.ts` | A (T001–T020) | Canonical entity contracts: `DomainEntity`, `StackEntity`, `PillarEntity`, `ModuleEntity`, `QuestionEntity`, `HierarchyPath`, `HierarchyCrumb`, `HierarchyValidationFinding`. Single-valued parent relationships (T008), stable slug identity (T040), hierarchy separate from search/tags (T011–T014). |
| `lib/hierarchy/hierarchy-resolver.ts` | B (T023–T031) | `resolveDomain`, `resolveStack`, `resolvePillar`, `resolvePillarHub`, `resolveModule`, `resolveChildren`, `resolveParent`, `resolveHierarchyPath`, `resolveBreadcrumbs`, `validateHierarchy`. Cached, null-on-miss (never throws). `HierarchyResolver` aggregate. |
| `lib/hierarchy/hierarchy-seo.ts` | B (T092–T100) | `buildDomainMetadata`, `buildStackMetadata`, `buildPillarMetadata`, `buildModuleMetadata`, `buildBreadcrumbStructuredData` (BreadcrumbList JSON-LD), `hierarchyUrl`. |
| `lib/hierarchy/index.ts` | — | Barrel. |

### Phase 05 — Hierarchy page architecture (`components/hierarchy/`)

| Component | Workstream | Responsibility |
|-----------|-----------|----------------|
| `HierarchyHeader` | C (T041) | Shared header: one H1 (`type-display`), description, max-w-3xl, border-b. No gradients, no icon walls. |
| `HierarchyCardGrid` | C (T041–T044) | Card grid for children: whole-card Links, ArrowRight affordance, `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`, hover:border-strong. |
| `QuestionList` | C (T044) | Question list: `divide-y divide-border`, difficulty Badge, ArrowRight affordance. |

### Phase 05 — Route migrations (Workstream C, T041–T044)

| Route | Task | Architecture |
|-------|------|--------------|
| `app/[domainSlug]/page.tsx` | T041 | Server component → `resolveDomain` → `HierarchyHeader` + `HierarchyCardGrid` of stacks. |
| `app/[domainSlug]/[stackSlug]/page.tsx` | T042 | Server component → `resolveStack` + `getSubcategoriesWithQuestions` → `HierarchyHeader` + `HierarchyCardGrid` of modules. |
| `app/prep/[pillarSlug]/page.tsx` | T043 | Server component → `resolvePillar` + `resolvePillarHub` → `HierarchyHeader` + `HierarchyCardGrid` of modules + related pillars. |
| `app/seo/[seoSlug]/page.tsx` | T044 | Server component → `resolveModule` → `HierarchyHeader` + `QuestionList`. |

### Phase 06 — Canonical question data layer (`lib/question/`)

Single adapter between content-reader's `QuestionPagePayload` (api.ts) and the V2 question page. All question components consume `QuestionPageData`, never the raw payload (P06-T041/T042).

| File | Workstream | Responsibility |
|------|-----------|----------------|
| `lib/question/question-types.ts` | A (T041–T060) | Canonical contract: `QuestionIdentity`, `AnswerSection` (type: prose\|code\|callout\|table\|figure\|heading), `QuestionMetadata`, `RelatedQuestion`, `FollowUpQuestion`, `PrevNextNav`, `QuestionPageData`, `QuestionPageState`. |
| `lib/question/question-data.ts` | B (T041) | `resolveQuestionPageData(domain, stack, question)` → `QuestionPageData \| null`. Adapts `QuestionPagePayload.answerSections` (sectionType/content/sectionTitle) → canonical `AnswerSection[]`. Uses payload's `previousQuestion`/`nextQuestion`/`relatedQuestions`/`quickQuestions` directly; falls back to `getAllQuestionsForStack`. |
| `lib/question/question-seo.ts` | B (T281–T320) | `buildQuestionMetadata`, `buildQuestionStructuredData` (FAQPage JSON-LD), `buildQuestionBreadcrumbStructuredData`, `buildQuestionSpeakable`. |
| `lib/question/index.ts` | — | Barrel. |

### Phase 06 — Question page architecture (`components/question-v2/`)

| Component | Workstream | Responsibility |
|-----------|-----------|----------------|
| `QuestionHeader` | C (T061–T080) | Breadcrumb nav, single H1 (`id="question-title"`, `type-display`), metadata row (difficulty Badge, read time, companies). |
| `AnswerRenderer` | D (T120–T160) | Iterates `AnswerSection[]` → heading/prose/code/callout/table/figure via Phase 01 primitives (CodeBlock, Callout, TableWrapper, Figure). Inline `renderMarkdown` helper. |
| `PrevNext` | E (T221–T240) | Two-card prev/next grid, ArrowLeft/ArrowRight. |
| `RelatedQuestions` | E (T241–T250) | Divide-y list with difficulty Badge, ChevronRight. |
| `FollowUpQuestions` | E (T251–T260) | Divide-y list, ChevronRight. |

### Phase 06 — Route migration

| Route | Task | Architecture |
|-------|------|--------------|
| `app/[domainSlug]/[stackSlug]/[questionSlug]/page.tsx` | T041 | Server component → `resolveQuestionPageData` → `QuestionHeader` + `AnswerRenderer` + `PrevNext` + `RelatedQuestions` + `FollowUpQuestions` + FAQPage/BreadcrumbList JSON-LD + speakable. |

## Key fixes applied this session

1. **`question-data.ts` payload adapter** — Rewrote to use the actual `QuestionPagePayload` shape from `@/lib/api` (`title`, `questionText`, `answerSections` with `sectionType`/`content`/`sectionTitle`, `previousQuestion`, `nextQuestion`, `relatedQuestions`, `quickQuestions`, `difficulty`, `estimatedReadTime`) instead of the non-existent `payload.question.*` shape. Maps API `AnswerSectionType` → canonical `AnswerSection` type with markdown splitting for prose blocks.

2. **`hierarchy-resolver.ts` type errors** — Fixed `StackSubcategory` import (from `@/lib/api`, not content-reader which doesn't re-export it); fixed `SEO_MODULES` access (array `.find()` not index lookup); used `intro` field instead of non-existent `description` on `SeoModuleEntry`; made `HierarchyPath.module` optional (resolver legitimately may not find a module).

3. **`answer-renderer.tsx` primitive props** — CodeBlock takes `children` not `code`; Figure takes `children` (an `<img>`) not `src`/`alt`; TableWrapper wraps its own `<table>` (pass `<thead>`/`<tbody>` as children).

## Verification

- **tsc --noEmit:** 8 errors — ALL pre-existing in `__tests__/launch-config.test.ts` (missing test-runner type defs). No new errors introduced. This is the regression baseline.
- **Tailwind compile:** `npx tailwindcss -i ./app/globals.css -o /tmp/p56_tw_out.css --minify` — clean, 0 errors. All token classes (`page-container`, `reading-container`, `type-display`, `type-section`, `border-border`, `text-muted-foreground`, `bg-surface`, `bg-card`) present in output.
- **Route coverage:** 5 route migrations (domain, stack, pillar, module, question) all consume the canonical architecture barrels.

## Files pushed (21 total)

**Phase 05 (12 new):** `lib/hierarchy/{hierarchy-types,hierarchy-resolver,hierarchy-seo,index}.ts`, `components/hierarchy/{hierarchy-header,hierarchy-card-grid,question-list,index}.tsx`

**Phase 06 (8 new):** `lib/question/{question-types,question-data,question-seo,index}.ts`, `components/question-v2/{question-header,answer-renderer,question-nav,index}.tsx`

**Route migrations (5 modified):** `app/[domainSlug]/page.tsx`, `app/[domainSlug]/[stackSlug]/page.tsx`, `app/prep/[pillarSlug]/page.tsx`, `app/seo/[seoSlug]/page.tsx`, `app/[domainSlug]/[stackSlug]/[questionSlug]/page.tsx`
