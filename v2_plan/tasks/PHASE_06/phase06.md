# PHASE 06 — INDIVIDUAL QUESTION PAGE & INTERVIEW ANSWER READING EXPERIENCE REBUILD

---

# Phase Objective

Completely rebuild the individual interview-question experience across Interview Explainer.

The question page is the most important content-consumption surface in the product.

A user may arrive through:

* Google Search,
* another search engine,
* an AI search result,
* the Interview Explainer homepage,
* internal search,
* a domain page,
* a stack page,
* a pillar page,
* a module page,
* a related question,
* previous/next navigation,
* a company preparation page,
* a shared direct link.

Regardless of entry point, the page must immediately answer:

```text
WHERE AM I?

WHAT IS THE QUESTION?

WHAT IS THE ANSWER?

HOW DEEPLY SHOULD I UNDERSTAND THIS?

WHAT SHOULD I LEARN NEXT?
```

The canonical question-page journey is:

```text
ARRIVE
   ↓
ORIENT
   ↓
READ THE QUESTION
   ↓
GET THE CORE ANSWER
   ↓
UNDERSTAND THE CONCEPT
   ↓
STUDY EXAMPLES / CODE / FRAMEWORKS
   ↓
UNDERSTAND INTERVIEW CONTEXT
   ↓
EXPLORE FOLLOW-UPS
   ↓
CONTINUE TO THE NEXT RELEVANT QUESTION
```

The target experience is not:

```text
OPEN PAGE
   ↓
SEE MANY BOXES
   ↓
SEE MANY BADGES
   ↓
SEE MULTIPLE SIDEBARS
   ↓
SEARCH FOR THE ACTUAL ANSWER
```

The target experience is:

```text
QUESTION FIRST

ANSWER SECOND

SUPPORTING CONTEXT THIRD

NAVIGATION ALWAYS AVAILABLE
BUT NEVER DOMINANT
```

---

# Core Product Principle

```text
THE ANSWER IS THE PRODUCT

EVERYTHING ELSE ON THE PAGE
MUST SUPPORT THE ANSWER
```

Therefore:

* navigation must not overpower the answer,
* metadata must not overpower the question,
* badges must not overpower the title,
* related content must not interrupt reading,
* progress must not dominate the page,
* ads or future monetization must never destroy reading flow,
* SEO additions must not create visible filler,
* sidebars must remain secondary,
* decorative UI must remain restrained.

---

# Critical Phase Boundary

Phase 06 owns:

* question-page layout,
* answer presentation architecture,
* typography,
* reading width,
* answer-section rendering,
* code presentation,
* tables,
* callouts,
* examples,
* diagrams where already available,
* metadata presentation,
* breadcrumbs,
* content navigation,
* related questions,
* previous/next navigation,
* completion interactions,
* bookmark interactions,
* sharing,
* question-page SEO,
* structured data,
* server rendering,
* performance,
* backend data contracts,
* mobile reading experience,
* accessibility.

Phase 06 does not attempt to manually rewrite the entire answer database.

A later content-quality phase will address:

* weak answers,
* excessively technical language,
* unnatural AI-style wording,
* excessive verbosity,
* insufficient depth,
* inconsistent answer structure,
* factual quality,
* interview relevance,
* answer standardization.

However, Phase 06 must create the rendering architecture that future improved content can use.

---

# Workstream A — Question Page Product Definition

## P06-T001 — Define the Primary Job of a Question Page

The primary job is to help a user understand and prepare an interview concept.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: The primary job is to help a user understand and prepare an interview concept. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T002 — Define the Secondary Job of a Question Page

Help users continue through the relevant learning path.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Help users continue through the relevant learning path. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T003 — Define Search-Arrival User Journey

A user arriving directly from Google must understand the page without previous navigation context.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: A user arriving directly from Google must understand the page without previous navigation context. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T004 — Define Internal-Navigation User Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T005 — Define Returning-User Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T006 — Define Anonymous-User Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T007 — Define Authenticated-User Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T008 — Define Mobile Reading Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T009 — Define Long-Answer Reading Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T010 — Define Short-Answer Reading Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T011 — Define Code-Heavy Question Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T012 — Define Conceptual Question Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T013 — Define Scenario-Based Question Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T014 — Define Behavioral Question Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T015 — Define Consulting Question Journey


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream B — Current Question Page Audit

## P06-T016 — Inventory Current Question Page Templates


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T017 — Identify Duplicate Question Page Implementations


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T018 — Identify Legacy Question Routes


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T019 — Identify Current Answer Renderers


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T020 — Identify Current Markdown Renderers


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T021 — Identify Current Rich Content Renderers


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T022 — Identify Current Code Block Implementations


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T023 — Identify Current Table Implementations


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T024 — Identify Current Callout Implementations


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T025 — Identify Current Sidebar Implementations


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T026 — Identify Current Related Question Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T027 — Identify Current Previous/Next Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T028 — Identify Current Progress Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T029 — Identify Current Bookmark Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T030 — Identify Current Metadata Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T031 — Identify Current Structured Data Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T032 — Identify Current Client-Side Dependencies


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T033 — Identify Current Answer Page Performance Bottlenecks


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T034 — Identify Current Mobile Reading Problems


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T035 — Identify Current Visual Density Problems


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream C — Canonical Question Data Contract

## P06-T036 — Define Canonical Question Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T037 — Define Stable Question ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T038 — Define Canonical Question Slug


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T039 — Define Question Display Title


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T040 — Define Canonical Answer Payload


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T041 — Define Question Hierarchy Relationship

Every question must resolve to its canonical:

```text
domain
→ stack
→ pillar
→ module
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Every question must resolve to its canonical: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T042 — Define Question Difficulty Field


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T043 — Define Question Type Field


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T044 — Define Question Tags Field


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T045 — Define Question Company Associations

Keep separate from canonical hierarchy.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Keep separate from canonical hierarchy. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T046 — Define Question Follow-Up Relationships


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T047 — Define Related Question Relationships


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T048 — Define Previous/Next Ordering


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T049 — Define Question Publication State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T050 — Define Question Indexability State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T051 — Define Question Content Version


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T052 — Define Question Updated Timestamp Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T053 — Prevent Multiple Competing Question Sources


**Execution:** Execute this task against the current repository in the context of Workstream C — Canonical Question Data Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T054 — Build Canonical Question Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T055 — Build Question Validation Layer


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream D — Canonical Question Route Architecture

## P06-T056 — Apply Canonical Question URL Contract

Use Phase 02.

**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use Phase 02. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T057 — Resolve Question by Stable Canonical Identity


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T058 — Validate Question Hierarchy Against URL


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T059 — Redirect Valid Legacy Question URLs


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T060 — Redirect Noncanonical Question Aliases


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T061 — Return True 404 for Missing Questions


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T062 — Return True 404 for Invalid Hierarchy Combinations


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T063 — Prevent Soft 404 Question Pages


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T064 — Prevent Duplicate Question URLs


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T065 — Prevent Query Parameters from Creating Duplicate Indexable Questions


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T066 — Ensure Internal Links Always Use Canonical Question URLs


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Question Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T067 — Remove Legacy Question URL Builders


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream E — Canonical Question Page Information Architecture

## P06-T068 — Define Final Question Page Structure

Recommended structure:

```text
GLOBAL HEADER

BREADCRUMB

QUESTION CONTEXT
    Question title
    Minimal metadata
    Optional actions

ANSWER READING AREA
    Core answer
    Explanation
    Examples
    Code
    Tables
    Callouts
    Interview context

FOLLOW-UP / RELATED LEARNING

PREVIOUS / NEXT QUESTION

OPTIONAL CONTEXTUAL NAVIGATION

FOOTER
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Recommended structure: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T069 — Keep Question Title Above Answer


**Execution:** Execute this task against the current repository in the context of Workstream E — Canonical Question Page Information Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T070 — Keep Primary Answer Immediately Discoverable


**Execution:** Execute this task against the current repository in the context of Workstream E — Canonical Question Page Information Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T071 — Prevent Large Decorative Hero Above the Answer


**Execution:** Execute this task against the current repository in the context of Workstream E — Canonical Question Page Information Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T072 — Prevent Marketing Content Above the Answer


**Execution:** Execute this task against the current repository in the context of Workstream E — Canonical Question Page Information Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T073 — Prevent Related Content Above the Answer


**Execution:** Execute this task against the current repository in the context of Workstream E — Canonical Question Page Information Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T074 — Prevent Excessive Metadata Above the Answer


**Execution:** Execute this task against the current repository in the context of Workstream E — Canonical Question Page Information Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T075 — Prevent Progress Widgets from Dominating the Header


**Execution:** Execute this task against the current repository in the context of Workstream E — Canonical Question Page Information Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T076 — Define Main Reading Column


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T077 — Define Optional Secondary Navigation Column


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T078 — Define Question Footer Navigation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T079 — Define Long-Answer Section Navigation

Where useful.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Where useful. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T080 — Define Mobile Information Order


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream F — Question Header Rebuild

## P06-T081 — Build Canonical Question Header


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T082 — Make Question Title the Dominant Element


**Execution:** Execute this task against the current repository in the context of Workstream F — Question Header Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T083 — Define Question Title Maximum Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T084 — Define Question Title Responsive Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T085 — Handle Very Long Question Titles


**Execution:** Execute this task against the current repository in the context of Workstream F — Question Header Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T086 — Remove Decorative Question Hero Treatment


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T087 — Remove Excessive Header Gradients


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T088 — Remove Excessive Header Borders


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T089 — Remove Excessive Header Badges


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T090 — Keep Metadata Visually Secondary


**Execution:** Execute this task against the current repository in the context of Workstream F — Question Header Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T091 — Define Difficulty Placement


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T092 — Define Topic Placement


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T093 — Define Question Number Placement Where Useful


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T094 — Define Completion Action Placement


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T095 — Define Bookmark Action Placement


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T096 — Define Share Action Placement


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P06-T097 — Prevent Action Button Competition


**Execution:** Execute this task against the current repository in the context of Workstream F — Question Header Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T098 — Optimize Question Header for Mobile


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream G — Reading Width Architecture

## P06-T099 — Define Canonical Reading Width

The answer must not stretch across excessively wide desktop screens.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: The answer must not stretch across excessively wide desktop screens. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T100 — Define Reading Width for Normal Prose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T101 — Define Wider Escape Width for Tables


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T102 — Define Wider Escape Width for Large Code Blocks


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T103 — Define Wider Escape Width for Diagrams


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T104 — Prevent Full-Screen Prose Width


**Execution:** Execute this task against the current repository in the context of Workstream G — Reading Width Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T105 — Prevent Excessively Narrow Desktop Reading Width


**Execution:** Execute this task against the current repository in the context of Workstream G — Reading Width Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T106 — Define Mobile Reading Padding


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T107 — Define Tablet Reading Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T108 — Validate Reading Comfort Across Long Answers


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream H — Answer Typography System

## P06-T109 — Define Canonical Answer Body Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T110 — Define Answer Base Font Size


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T111 — Define Answer Line Height


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T112 — Define Paragraph Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T113 — Define H2 Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T114 — Define H3 Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T115 — Define H4 Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T116 — Define List Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T117 — Define Nested List Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T118 — Define Inline Code Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T119 — Define Blockquote Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T120 — Define Strong Text Usage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T121 — Prevent Excessive Bold Text


**Execution:** Execute this task against the current repository in the context of Workstream H — Answer Typography System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T122 — Prevent Excessive Heading Size


**Execution:** Execute this task against the current repository in the context of Workstream H — Answer Typography System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T123 — Prevent Tiny Supporting Text


**Execution:** Execute this task against the current repository in the context of Workstream H — Answer Typography System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T124 — Prevent Dense Paragraph Walls


**Execution:** Execute this task against the current repository in the context of Workstream H — Answer Typography System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T125 — Optimize Typography for Light Theme


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T126 — Optimize Typography for Dark Theme


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T127 — Optimize Typography for Mobile


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream I — Answer Vertical Rhythm

## P06-T128 — Define Paragraph-to-Paragraph Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T129 — Define Heading-to-Section Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T130 — Define List Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T131 — Define Code Block Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T132 — Define Table Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T133 — Define Callout Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T134 — Define Example Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T135 — Remove Arbitrary Content Margins


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T136 — Prevent Every Content Element from Becoming a Separate Card


**Execution:** Execute this task against the current repository in the context of Workstream I — Answer Vertical Rhythm, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T137 — Use Whitespace as Primary Section Separation


**Execution:** Execute this task against the current repository in the context of Workstream I — Answer Vertical Rhythm, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T138 — Use Dividers Only Where Structurally Useful


**Execution:** Execute this task against the current repository in the context of Workstream I — Answer Vertical Rhythm, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream J — Answer Content Renderer

## P06-T139 — Build One Canonical Answer Renderer


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T140 — Define Supported Content Elements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T141 — Support Paragraphs


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T142 — Support Headings


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T143 — Support Ordered Lists


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T144 — Support Unordered Lists


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T145 — Support Nested Lists


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T146 — Support Inline Code


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T147 — Support Code Blocks


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T148 — Support Tables


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T149 — Support Blockquotes


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T150 — Support Links


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T151 — Support Images Where Valid


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T152 — Support Callouts


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T153 — Support Interview Tips


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T154 — Support Warnings


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T155 — Support Notes


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T156 — Support Examples


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T157 — Support Comparison Sections


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T158 — Support Structured Steps


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T159 — Prevent Arbitrary Raw HTML


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T160 — Sanitize Rendered Content


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T161 — Prevent Renderer-Specific Styling Forks


**Execution:** Execute this task against the current repository in the context of Workstream J — Answer Content Renderer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T162 — Remove Duplicate Answer Renderers


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream K — Core Answer Presentation

## P06-T163 — Define Core Answer Pattern

Where content supports it, the user should receive a direct answer before deeper explanation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Where content supports it, the user should receive a direct answer before deeper explanation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T164 — Visually Distinguish Core Answer Without Creating a Giant Card


**Execution:** Execute this task against the current repository in the context of Workstream K — Core Answer Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T165 — Avoid Artificial “TL;DR” Generation at Runtime


**Execution:** Execute this task against the current repository in the context of Workstream K — Core Answer Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T166 — Render Explicit Summary Content When Present


**Execution:** Execute this task against the current repository in the context of Workstream K — Core Answer Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T167 — Avoid Duplicating the Same Answer in Summary and Main Body


**Execution:** Execute this task against the current repository in the context of Workstream K — Core Answer Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T168 — Keep Core Answer Search-Visible


**Execution:** Execute this task against the current repository in the context of Workstream K — Core Answer Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T169 — Keep Core Answer Accessible


**Execution:** Execute this task against the current repository in the context of Workstream K — Core Answer Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T170 — Handle Questions Without Explicit Summary Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream K — Core Answer Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream L — Section Hierarchy

## P06-T171 — Define Canonical Answer Section Hierarchy

Potential semantic sections include:

```text
Direct Answer
Explanation
How It Works
Example
Code Example
Comparison
When to Use
Common Mistakes
Interview Perspective
Follow-Up Questions
```

Not every answer requires every section.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Potential semantic sections include: Not every answer requires every section. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T172 — Prevent Mandatory Empty Sections


**Execution:** Execute this task against the current repository in the context of Workstream L — Section Hierarchy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T173 — Prevent Template Headings from Appearing Without Useful Content


**Execution:** Execute this task against the current repository in the context of Workstream L — Section Hierarchy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T174 — Preserve Existing Valid Content Structure


**Execution:** Execute this task against the current repository in the context of Workstream L — Section Hierarchy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T175 — Normalize Rendering Without Falsifying Content Structure


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P06-T176 — Prevent Excessive Heading Fragmentation


**Execution:** Execute this task against the current repository in the context of Workstream L — Section Hierarchy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T177 — Prevent Every Paragraph from Receiving a Heading


**Execution:** Execute this task against the current repository in the context of Workstream L — Section Hierarchy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T178 — Ensure Heading Levels Are Semantic


**Execution:** Execute this task against the current repository in the context of Workstream L — Section Hierarchy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T179 — Ensure Section IDs Are Stable Where Used


**Execution:** Execute this task against the current repository in the context of Workstream L — Section Hierarchy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream M — Code Block Experience

## P06-T180 — Build Canonical Code Block Component


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T181 — Define Code Syntax Highlighting Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T182 — Prefer Server-Side Highlighting Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream M — Code Block Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T183 — Define Code Font


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T184 — Define Code Font Size


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T185 — Define Code Line Height


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T186 — Define Code Block Background


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T187 — Define Light Theme Code Treatment


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T188 — Define Dark Theme Code Treatment


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T189 — Add Language Label Where Known


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P06-T190 — Add Copy Action


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P06-T191 — Define Copy Success Feedback


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T192 — Prevent Copy UI from Dominating Code


**Execution:** Execute this task against the current repository in the context of Workstream M — Code Block Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T193 — Support Horizontal Overflow Safely


**Execution:** Execute this task against the current repository in the context of Workstream M — Code Block Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T194 — Prevent Page-Level Horizontal Overflow from Code


**Execution:** Execute this task against the current repository in the context of Workstream M — Code Block Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T195 — Handle Long Lines


**Execution:** Execute this task against the current repository in the context of Workstream M — Code Block Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T196 — Define Line Number Policy

Use only when useful.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use only when useful. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P06-T197 — Avoid Line Numbers on Tiny Code Examples


**Execution:** Execute this task against the current repository in the context of Workstream M — Code Block Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T198 — Support Accessible Code Labels


**Execution:** Execute this task against the current repository in the context of Workstream M — Code Block Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T199 — Ensure Code Remains Copyable


**Execution:** Execute this task against the current repository in the context of Workstream M — Code Block Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T200 — Avoid Heavy Client-Side Highlighting Bundles


**Execution:** Execute this task against the current repository in the context of Workstream M — Code Block Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream N — Table Experience

## P06-T201 — Build Canonical Answer Table Component


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T202 — Define Table Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T203 — Define Header Treatment


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T204 — Define Row Separation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T205 — Avoid Excessive Zebra Styling


**Execution:** Execute this task against the current repository in the context of Workstream N — Table Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T206 — Support Horizontal Scrolling on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream N — Table Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T207 — Prevent Table Overflow from Breaking Layout


**Execution:** Execute this task against the current repository in the context of Workstream N — Table Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T208 — Preserve Semantic Table Markup


**Execution:** Execute this task against the current repository in the context of Workstream N — Table Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T209 — Support Accessible Captions Where Present


**Execution:** Execute this task against the current repository in the context of Workstream N — Table Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T210 — Avoid Converting Every Comparison into a Card Grid


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

# Workstream O — Callout Architecture

## P06-T211 — Define Canonical Callout Types

Potentially:

* note,
* interview tip,
* warning,
* important.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Potentially: note, interview tip, warning, important. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T212 — Limit Number of Callout Variants


**Execution:** Execute this task against the current repository in the context of Workstream O — Callout Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T213 — Define Semantic Callout Colours


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T214 — Keep Callout Colours Restrained


**Execution:** Execute this task against the current repository in the context of Workstream O — Callout Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T215 — Define Callout Icon Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T216 — Prevent Every Important Sentence from Becoming a Callout


**Execution:** Execute this task against the current repository in the context of Workstream O — Callout Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T217 — Prevent Nested Callouts


**Execution:** Execute this task against the current repository in the context of Workstream O — Callout Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T218 — Ensure Callouts Work in Dark Theme


**Execution:** Execute this task against the current repository in the context of Workstream O — Callout Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T219 — Ensure Callouts Work on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream O — Callout Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T220 — Ensure Callouts Are Accessible Without Colour


**Execution:** Execute this task against the current repository in the context of Workstream O — Callout Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream P — Example Presentation

## P06-T221 — Define Canonical Example Pattern


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T222 — Distinguish Examples from Main Explanation


**Execution:** Execute this task against the current repository in the context of Workstream P — Example Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T223 — Avoid Excessively Decorative Example Cards


**Execution:** Execute this task against the current repository in the context of Workstream P — Example Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T224 — Support Text Examples


**Execution:** Execute this task against the current repository in the context of Workstream P — Example Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T225 — Support Code Examples


**Execution:** Execute this task against the current repository in the context of Workstream P — Example Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T226 — Support Scenario Examples


**Execution:** Execute this task against the current repository in the context of Workstream P — Example Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T227 — Support Input/Output Examples


**Execution:** Execute this task against the current repository in the context of Workstream P — Example Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T228 — Support Before/After Comparisons


**Execution:** Execute this task against the current repository in the context of Workstream P — Example Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T229 — Preserve Example Reading Flow


**Execution:** Execute this task against the current repository in the context of Workstream P — Example Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Q — Interview-Specific Context UI

## P06-T230 — Define Interview Context Presentation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T231 — Define “Why Interviewers Ask This” Presentation

Where content exists.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Where content exists. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T232 — Define “What a Strong Answer Should Cover” Presentation

Where content exists.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Where content exists. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T233 — Define Common Follow-Up Presentation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T234 — Define Common Mistake Presentation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T235 — Avoid Fake Interview Advice Generated at Runtime


**Execution:** Execute this task against the current repository in the context of Workstream Q — Interview-Specific Context UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T236 — Render Interview Context Only When Real Content Exists


**Execution:** Execute this task against the current repository in the context of Workstream Q — Interview-Specific Context UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T237 — Keep Interview Context Secondary to the Actual Answer


**Execution:** Execute this task against the current repository in the context of Workstream Q — Interview-Specific Context UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream R — Question Metadata Simplification

## P06-T238 — Inventory All Current Question Metadata


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T239 — Classify Metadata as Essential, Secondary or Remove


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T240 — Keep Question Title Primary


**Execution:** Execute this task against the current repository in the context of Workstream R — Question Metadata Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T241 — Keep Module Context Available


**Execution:** Execute this task against the current repository in the context of Workstream R — Question Metadata Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T242 — Keep Difficulty Secondary


**Execution:** Execute this task against the current repository in the context of Workstream R — Question Metadata Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T243 — Keep Question Type Secondary


**Execution:** Execute this task against the current repository in the context of Workstream R — Question Metadata Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T244 — Avoid Showing Internal IDs


**Execution:** Execute this task against the current repository in the context of Workstream R — Question Metadata Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T245 — Avoid Showing Redundant Taxonomy Labels


**Execution:** Execute this task against the current repository in the context of Workstream R — Question Metadata Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T246 — Avoid Showing Excessive Tag Lists


**Execution:** Execute this task against the current repository in the context of Workstream R — Question Metadata Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T247 — Collapse or Remove Low-Value Metadata


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T248 — Prevent Metadata from Creating a Badge Wall


**Execution:** Execute this task against the current repository in the context of Workstream R — Question Metadata Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream S — Breadcrumb Integration

## P06-T249 — Render Full Canonical Question Breadcrumb

Potential structure:

```text
Home
→ Domain
→ Stack
→ Pillar
→ Module
→ Question
```

**Execution:** Execute this task against the current repository in the context of Workstream S — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Potential structure: Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T250 — Optimize Deep Breadcrumb for Desktop


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T251 — Optimize Deep Breadcrumb for Mobile


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T252 — Prevent Breadcrumb from Wrapping into Visual Noise


**Execution:** Execute this task against the current repository in the context of Workstream S — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T253 — Allow Context Preservation Without Showing Every Level on Tiny Screens


**Execution:** Execute this task against the current repository in the context of Workstream S — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T254 — Ensure Breadcrumb Links Are Canonical


**Execution:** Execute this task against the current repository in the context of Workstream S — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T255 — Ensure Breadcrumb Labels Are Human-Readable


**Execution:** Execute this task against the current repository in the context of Workstream S — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T256 — Align Visible Breadcrumb with Structured Data


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

# Workstream T — Contextual Sidebar Architecture

## P06-T257 — Define Whether Question Pages Need a Desktop Sidebar


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T258 — Keep Main Answer Wider Than Secondary Navigation


**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T259 — Avoid Fixed 70/30 Layout as a Universal Rule

Determine width from reading needs.

**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Determine width from reading needs. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T260 — Define Sidebar Maximum Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T261 — Define Sidebar Content Priority

Potential content:

* current module,
* nearby questions,
* current progress.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Potential content: current module, nearby questions, current progress. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T262 — Prevent Sidebar from Showing Entire Site Taxonomy


**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T263 — Prevent Sidebar from Showing Unrelated Recommendations


**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T264 — Highlight Current Question


**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T265 — Keep Sidebar Scroll Behavior Predictable


**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T266 — Prevent Double Scroll Traps


**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T267 — Prevent Sticky Sidebar from Covering Footer Content


**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T268 — Define Mobile Replacement for Sidebar


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T269 — Consider Collapsible “Questions in this Module” Mobile Navigation


**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T270 — Keep Mobile Answer Flow Primary


**Execution:** Execute this task against the current repository in the context of Workstream T — Contextual Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream U — Table of Contents for Long Answers

## P06-T271 — Define Long-Answer TOC Eligibility


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T272 — Do Not Show TOC for Short Answers


**Execution:** Execute this task against the current repository in the context of Workstream U — Table of Contents for Long Answers, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T273 — Generate TOC from Semantic Answer Headings


**Execution:** Execute this task against the current repository in the context of Workstream U — Table of Contents for Long Answers, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T274 — Ensure TOC Anchors Are Stable


**Execution:** Execute this task against the current repository in the context of Workstream U — Table of Contents for Long Answers, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T275 — Define Desktop TOC Placement


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T276 — Define Mobile TOC Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T277 — Highlight Current Section Where Useful


**Execution:** Execute this task against the current repository in the context of Workstream U — Table of Contents for Long Answers, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T278 — Prevent TOC from Becoming Another Dominant Sidebar


**Execution:** Execute this task against the current repository in the context of Workstream U — Table of Contents for Long Answers, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T279 — Prevent Duplicate Navigation Systems


**Execution:** Execute this task against the current repository in the context of Workstream U — Table of Contents for Long Answers, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream V — Previous and Next Question Navigation

## P06-T280 — Build Canonical Previous Question Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T281 — Build Canonical Next Question Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T282 — Keep Navigation Within Current Module by Default


**Execution:** Execute this task against the current repository in the context of Workstream V — Previous and Next Question Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T283 — Define End-of-Module Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T284 — Define Start-of-Module Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T285 — Build Previous/Next Navigation UI


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T286 — Make Question Titles Visible in Navigation


**Execution:** Execute this task against the current repository in the context of Workstream V — Previous and Next Question Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T287 — Keep Previous/Next Navigation Visually Secondary


**Execution:** Execute this task against the current repository in the context of Workstream V — Previous and Next Question Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T288 — Ensure Previous/Next Links Are Canonical


**Execution:** Execute this task against the current repository in the context of Workstream V — Previous and Next Question Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T289 — Prevent Navigation to Unpublished Questions


**Execution:** Execute this task against the current repository in the context of Workstream V — Previous and Next Question Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T290 — Prevent Navigation to Invalid Questions


**Execution:** Execute this task against the current repository in the context of Workstream V — Previous and Next Question Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T291 — Optimize Previous/Next Navigation for Mobile


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream W — Related Questions

## P06-T292 — Define Related Question Semantics


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T293 — Prefer Explicit Relationships Where Available


**Execution:** Execute this task against the current repository in the context of Workstream W — Related Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T294 — Define Safe Algorithmic Fallback


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T295 — Prioritize Same Module Relationships


**Execution:** Execute this task against the current repository in the context of Workstream W — Related Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T296 — Allow Related Pillar Questions Where Useful


**Execution:** Execute this task against the current repository in the context of Workstream W — Related Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T297 — Prevent Random Related Questions


**Execution:** Execute this task against the current repository in the context of Workstream W — Related Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T298 — Limit Related Question Count


**Execution:** Execute this task against the current repository in the context of Workstream W — Related Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T299 — Keep Related Questions Below Primary Answer


**Execution:** Execute this task against the current repository in the context of Workstream W — Related Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T300 — Use Scannable Related Question Presentation


**Execution:** Execute this task against the current repository in the context of Workstream W — Related Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T301 — Ensure Related Links Are Canonical


**Execution:** Execute this task against the current repository in the context of Workstream W — Related Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T302 — Prevent Related Questions from Duplicating Previous/Next Navigation


**Execution:** Execute this task against the current repository in the context of Workstream W — Related Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream X — Follow-Up Questions

## P06-T303 — Distinguish Follow-Up Questions from Related Questions


**Execution:** Execute this task against the current repository in the context of Workstream X — Follow-Up Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T304 — Define Follow-Up Question Data Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T305 — Render Explicit Follow-Ups When Available


**Execution:** Execute this task against the current repository in the context of Workstream X — Follow-Up Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T306 — Link Follow-Ups to Existing Canonical Questions Where Possible


**Execution:** Execute this task against the current repository in the context of Workstream X — Follow-Up Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T307 — Avoid Dead Follow-Up Text


**Execution:** Execute this task against the current repository in the context of Workstream X — Follow-Up Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T308 — Avoid Generating Follow-Ups at Request Time


**Execution:** Execute this task against the current repository in the context of Workstream X — Follow-Up Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T309 — Keep Follow-Ups Below Main Learning Content


**Execution:** Execute this task against the current repository in the context of Workstream X — Follow-Up Questions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Y — Completion State

## P06-T310 — Define Question Completion Semantics


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T311 — Define Manual Completion Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T312 — Avoid Automatically Marking a Question Complete on Page Load


**Execution:** Execute this task against the current repository in the context of Workstream Y — Completion State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T313 — Define Completion Action UI


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T314 — Keep Completion Action Secondary


**Execution:** Execute this task against the current repository in the context of Workstream Y — Completion State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T315 — Support Anonymous User Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream Y — Completion State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T316 — Define Authentication Prompt Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T317 — Avoid Blocking Answer Access for Completion Tracking


**Execution:** Execute this task against the current repository in the context of Workstream Y — Completion State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T318 — Handle Completion API Failure Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream Y — Completion State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T319 — Prevent Completion State from Affecting Canonical HTML


**Execution:** Execute this task against the current repository in the context of Workstream Y — Completion State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Z — Bookmarking

## P06-T320 — Define Bookmark Data Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T321 — Define Bookmark Action UI


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T322 — Keep Bookmark Action Secondary


**Execution:** Execute this task against the current repository in the context of Workstream Z — Bookmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T323 — Support Anonymous User Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream Z — Bookmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T324 — Define Authentication Prompt Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T325 — Handle Bookmark API Failure Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream Z — Bookmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T326 — Prevent Bookmark State from Blocking Answer Rendering


**Execution:** Execute this task against the current repository in the context of Workstream Z — Bookmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AA — Sharing

## P06-T327 — Define Question Sharing Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P06-T328 — Add Copy Link Action Where Useful


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P06-T329 — Always Share Canonical URL


**Execution:** Execute this task against the current repository in the context of Workstream AA — Sharing, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T330 — Prevent Tracking Parameters from Becoming Shared Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream AA — Sharing, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T331 — Define Share Feedback


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P06-T332 — Keep Sharing Visually Secondary


**Execution:** Execute this task against the current repository in the context of Workstream AA — Sharing, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AB — Mobile Question Experience

## P06-T333 — Design Question Page Mobile-First


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T334 — Prioritize Question and Answer Above All Secondary UI


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T335 — Simplify Mobile Breadcrumbs


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T336 — Simplify Mobile Metadata


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T337 — Remove Persistent Desktop Sidebar on Mobile


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T338 — Provide Contextual Module Navigation Without Obstruction


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T339 — Define Mobile Reading Padding


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T340 — Define Mobile Typography


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T341 — Prevent Code Overflow


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T342 — Prevent Table Overflow


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T343 — Prevent Long URL Overflow


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T344 — Prevent Heading Overflow


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T345 — Prevent Fixed Elements from Covering Content


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T346 — Ensure Comfortable Touch Targets


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T347 — Avoid Excessive Sticky UI


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T348 — Test Very Long Answers on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T349 — Test Code-Heavy Answers on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T350 — Test Table-Heavy Answers on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream AB — Mobile Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AC — Tablet Question Experience

## P06-T351 — Define Tablet Reading Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T352 — Define Tablet Sidebar Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T353 — Prevent Cramped Two-Column Layout


**Execution:** Execute this task against the current repository in the context of Workstream AC — Tablet Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T354 — Validate Code Blocks on Tablet


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T355 — Validate Tables on Tablet


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AD — Desktop Question Experience

## P06-T356 — Define Standard Desktop Layout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T357 — Define Wide Desktop Layout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T358 — Prevent Prose from Expanding with Viewport Width


**Execution:** Execute this task against the current repository in the context of Workstream AD — Desktop Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T359 — Keep Secondary Navigation Proportional


**Execution:** Execute this task against the current repository in the context of Workstream AD — Desktop Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T360 — Prevent Excessive Empty Side Space from Being Filled with Noise


**Execution:** Execute this task against the current repository in the context of Workstream AD — Desktop Question Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AE — Light Theme Reading Experience

## P06-T361 — Define Question Page Background Hierarchy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T362 — Define Main Reading Surface


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T363 — Avoid Excessive White Cards on White Background


**Execution:** Execute this task against the current repository in the context of Workstream AE — Light Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T364 — Ensure Body Text Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AE — Light Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T365 — Ensure Secondary Text Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AE — Light Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T366 — Ensure Code Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AE — Light Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T367 — Ensure Table Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AE — Light Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T368 — Ensure Callout Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AE — Light Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T369 — Validate Long-Form Reading Comfort


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AF — Dark Theme Reading Experience

## P06-T370 — Define Question Page Dark Background Hierarchy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T371 — Avoid Pure Black Reading Surfaces Where Uncomfortable


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dark Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T372 — Avoid Excessive Glowing Borders


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dark Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T373 — Avoid Neon Accent Overuse


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dark Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T374 — Ensure Body Text Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dark Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T375 — Ensure Secondary Text Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dark Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T376 — Ensure Code Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dark Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T377 — Ensure Table Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dark Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T378 — Ensure Callout Contrast


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dark Theme Reading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T379 — Validate Long-Form Reading Comfort


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AG — Question Page Colour Reduction

## P06-T380 — Audit Current Question Page Colour Usage


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T381 — Remove Decorative Colour Blocks


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T382 — Remove Arbitrary Section Colours


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T383 — Remove Excessive Gradient Usage


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T384 — Remove Rainbow Metadata Styling


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T385 — Restrict Semantic Colours to Semantic Meaning


**Execution:** Execute this task against the current repository in the context of Workstream AG — Question Page Colour Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T386 — Keep Primary Accent for Interaction


**Execution:** Execute this task against the current repository in the context of Workstream AG — Question Page Colour Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T387 — Use Neutral Surfaces for Reading


**Execution:** Execute this task against the current repository in the context of Workstream AG — Question Page Colour Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AH — Question Page Card Reduction

## P06-T388 — Inventory All Question Page Cards


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T389 — Remove Cards Used Only as Generic Wrappers


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T390 — Remove Nested Cards


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T391 — Flatten Answer Content Structure


**Execution:** Execute this task against the current repository in the context of Workstream AH — Question Page Card Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T392 — Keep Cards Only for Genuine Grouped Interactions


**Execution:** Execute this task against the current repository in the context of Workstream AH — Question Page Card Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T393 — Use Whitespace Instead of Boxes


**Execution:** Execute this task against the current repository in the context of Workstream AH — Question Page Card Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T394 — Reduce Border Density


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T395 — Reduce Shadow Density


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T396 — Reduce Radius Overuse


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

# Workstream AI — Question Page Icon Reduction

## P06-T397 — Inventory Question Page Icons


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T398 — Remove Decorative Icons


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T399 — Keep Icons for Recognizable Actions


**Execution:** Execute this task against the current repository in the context of Workstream AI — Question Page Icon Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T400 — Avoid Icons Beside Every Heading


**Execution:** Execute this task against the current repository in the context of Workstream AI — Question Page Icon Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T401 — Avoid Icons Beside Every Metadata Label


**Execution:** Execute this task against the current repository in the context of Workstream AI — Question Page Icon Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T402 — Standardize Remaining Icon Size


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P06-T403 — Standardize Remaining Icon Stroke


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

# Workstream AJ — Answer Density Management

## P06-T404 — Define Comfortable Paragraph Length Guidance


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T405 — Define Comfortable Section Length Guidance


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T406 — Detect Extremely Long Unbroken Paragraphs


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Answer Density Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T407 — Detect Extremely Long Unbroken Lists


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Answer Density Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T408 — Detect Excessive Nested Lists


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Answer Density Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T409 — Detect Excessive Heading Fragmentation


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Answer Density Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T410 — Detect Excessive Callout Usage


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Answer Density Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T411 — Detect Excessive Code Block Frequency


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Answer Density Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T412 — Surface Content Quality Issues to Later Content Phase


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Answer Density Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T413 — Do Not Automatically Rewrite Content During UI Migration


**Execution:** Trace current consumers and behavior, refactor the responsibility at its shared owner, and migrate usage incrementally so externally visible behavior is preserved unless this task explicitly changes it. Remove duplicate legacy paths after migration and run targeted regression checks across the routes or features with the largest blast radius.

**Priority:** P0

---

# Workstream AK — Short Answer Handling

## P06-T414 — Detect Legitimately Short Answers


**Execution:** Execute this task against the current repository in the context of Workstream AK — Short Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T415 — Avoid Artificially Inflating Short Answers


**Execution:** Execute this task against the current repository in the context of Workstream AK — Short Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T416 — Avoid Large Empty Layout Around Short Answers


**Execution:** Execute this task against the current repository in the context of Workstream AK — Short Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T417 — Keep Navigation Useful After Short Answers


**Execution:** Execute this task against the current repository in the context of Workstream AK — Short Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T418 — Flag Suspiciously Thin Answers for Content Audit


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T419 — Prevent Thin Content from Being Hidden by Decorative UI


**Execution:** Execute this task against the current repository in the context of Workstream AK — Short Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AL — Long Answer Handling

## P06-T420 — Detect Long Answers


**Execution:** Execute this task against the current repository in the context of Workstream AL — Long Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T421 — Support Semantic Section Navigation


**Execution:** Execute this task against the current repository in the context of Workstream AL — Long Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T422 — Preserve Reading Rhythm Across Long Answers


**Execution:** Execute this task against the current repository in the context of Workstream AL — Long Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T423 — Avoid Excessive Sticky UI During Long Reading


**Execution:** Execute this task against the current repository in the context of Workstream AL — Long Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T424 — Avoid Interruptive Related Content Mid-Answer


**Execution:** Execute this task against the current repository in the context of Workstream AL — Long Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T425 — Avoid Repetitive CTA Insertion


**Execution:** Execute this task against the current repository in the context of Workstream AL — Long Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T426 — Preserve Browser Find Functionality


**Execution:** Execute this task against the current repository in the context of Workstream AL — Long Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T427 — Preserve Text Selection


**Execution:** Execute this task against the current repository in the context of Workstream AL — Long Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T428 — Preserve Deep Heading Links Where Supported


**Execution:** Execute this task against the current repository in the context of Workstream AL — Long Answer Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AM — Question Page Accessibility

## P06-T429 — Validate One H1


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T430 — Validate Semantic Heading Hierarchy


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T431 — Validate Main Landmark


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T432 — Validate Navigation Landmarks


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T433 — Validate Breadcrumb Accessibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T434 — Validate Code Accessibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T435 — Validate Table Accessibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T436 — Validate Callout Accessibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T437 — Validate Link Purpose


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T438 — Validate Button Labels


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T439 — Validate Keyboard Navigation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T440 — Validate Focus Order


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T441 — Validate Focus Visibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T442 — Validate Colour Contrast


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T443 — Validate Screen Reader Reading Order


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T444 — Validate Reduced Motion


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AN — Question Page SEO Metadata

## P06-T445 — Apply Canonical Question Metadata Factory


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T446 — Generate Unique Question Title


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T447 — Generate Useful Question Meta Description


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T448 — Generate Canonical Question URL


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T449 — Apply Correct Robots Metadata


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T450 — Apply Open Graph Metadata


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T451 — Apply Social Metadata Consistently


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T452 — Prevent Duplicate Metadata Across Questions


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T453 — Prevent Empty Metadata


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T454 — Prevent Keyword-Stuffed Metadata


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T455 — Ensure Metadata Matches Visible Question Content


**Execution:** Execute this task against the current repository in the context of Workstream AN — Question Page SEO Metadata, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AO — Question Structured Data

## P06-T456 — Audit Current Question Structured Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T457 — Determine Correct Schema Types from Actual Page Content


**Execution:** Execute this task against the current repository in the context of Workstream AO — Question Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T458 — Avoid Automatically Treating Every Interview Question as FAQ Schema


**Execution:** Execute this task against the current repository in the context of Workstream AO — Question Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T459 — Avoid Unsupported Structured Data


**Execution:** Execute this task against the current repository in the context of Workstream AO — Question Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T460 — Apply BreadcrumbList Where Valid


**Execution:** Execute this task against the current repository in the context of Workstream AO — Question Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T461 — Apply Article-Like Schema Only Where Semantically Valid


**Execution:** Execute this task against the current repository in the context of Workstream AO — Question Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T462 — Ensure Structured Data Matches Visible Content


**Execution:** Execute this task against the current repository in the context of Workstream AO — Question Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T463 — Ensure Structured Data URLs Are Canonical


**Execution:** Execute this task against the current repository in the context of Workstream AO — Question Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T464 — Prevent Duplicate Structured Data Blocks


**Execution:** Execute this task against the current repository in the context of Workstream AO — Question Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T465 — Validate Structured Data Output


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AP — Question Indexability

## P06-T466 — Define Minimum Indexable Question Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T467 — Prevent Empty Questions from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream AP — Question Indexability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T468 — Prevent Placeholder Questions from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream AP — Question Indexability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T469 — Prevent Broken Answer Pages from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream AP — Question Indexability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T470 — Prevent Duplicate Question Variants from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream AP — Question Indexability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T471 — Prevent Draft Questions from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream AP — Question Indexability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T472 — Prevent Invalid Hierarchy Questions from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream AP — Question Indexability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T473 — Ensure Indexable Questions Return Canonical 200


**Execution:** Execute this task against the current repository in the context of Workstream AP — Question Indexability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T474 — Ensure Indexable Questions Have Crawlable Incoming Links


**Execution:** Execute this task against the current repository in the context of Workstream AP — Question Indexability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T475 — Ensure Indexable Questions Participate Correctly in Sitemap


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AQ — Question Sitemap Integration

## P06-T476 — Generate Question Sitemap Entries from Canonical Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T477 — Exclude Draft Questions


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Question Sitemap Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T478 — Exclude Noindex Questions


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Question Sitemap Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T479 — Exclude Missing-Answer Questions


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Question Sitemap Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T480 — Exclude Noncanonical Question Aliases


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Question Sitemap Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T481 — Detect Duplicate Sitemap Questions


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T482 — Detect Redirecting Sitemap Questions


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T483 — Detect 404 Sitemap Questions


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T484 — Validate Question Sitemap Counts


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T485 — Define Question Sitemap Partitioning if Scale Requires It


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AR — Search Engine Arrival Experience

## P06-T486 — Test Direct Search Arrival


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search Engine Arrival Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T487 — Ensure User Immediately Sees the Question


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search Engine Arrival Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T488 — Ensure User Immediately Finds the Answer


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search Engine Arrival Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T489 — Ensure User Understands Topic Context


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search Engine Arrival Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T490 — Ensure User Can Navigate Up the Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search Engine Arrival Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T491 — Ensure User Can Continue to Another Question


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search Engine Arrival Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T492 — Avoid Forced Login on Search Arrival


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search Engine Arrival Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T493 — Avoid Pop-Up Interruption on Initial Search Arrival


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search Engine Arrival Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T494 — Avoid Giant Promotional Banner Before Answer


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search Engine Arrival Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AS — Server Rendering Architecture

## P06-T495 — Server-Render Question Title


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T496 — Server-Render Primary Answer Content


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T497 — Server-Render Breadcrumb Links


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T498 — Server-Render Primary Internal Links


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T499 — Server-Render Previous/Next Links Where Available


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T500 — Server-Render Related Question Links Where Stable


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T501 — Keep Bookmark State as Progressive Enhancement


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T502 — Keep Completion State as Progressive Enhancement


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T503 — Keep Copy Interaction Client-Side


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T504 — Keep Share Interaction Client-Side Where Needed


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T505 — Prevent Client Loading State from Replacing Main Answer


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T506 — Minimize Question Page Client Boundaries


**Execution:** Execute this task against the current repository in the context of Workstream AS — Server Rendering Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AT — Question Page Performance

## P06-T507 — Establish Question Page Performance Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T508 — Measure Initial HTML Payload


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T509 — Measure JavaScript Payload


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T510 — Measure Answer Renderer Cost


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T511 — Measure Syntax Highlighting Cost


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T512 — Measure Sidebar Cost


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T513 — Measure User-State Request Cost


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T514 — Avoid Fetching Entire Module Answer Data


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T515 — Fetch Only Navigation Metadata for Nearby Questions


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T516 — Avoid Duplicate Question Fetches


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T517 — Cache Stable Public Question Content Appropriately


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T518 — Define Question Revalidation Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T519 — Lazy Load Noncritical Enhancements


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T520 — Optimize Embedded Images


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P06-T521 — Prevent Third-Party Scripts from Blocking Answer Rendering


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T522 — Optimize LCP


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T523 — Minimize CLS


**Execution:** Execute this task against the current repository in the context of Workstream AT — Question Page Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T524 — Optimize Interaction Responsiveness


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream AU — Backend Question Support

## P06-T525 — Identify Question Page Backend Dependencies


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T526 — Stabilize Public Question Fetch Contract


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T527 — Stabilize Question Navigation Contract


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T528 — Stabilize Related Question Contract


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T529 — Stabilize Completion Contract


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T530 — Stabilize Bookmark Contract


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T531 — Separate Public Content Fetch from User-State Fetch


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T532 — Prevent Authentication Dependency for Public Answer Fetching


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T533 — Return Explicit Not-Found State for Missing Question


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T534 — Distinguish Missing Question from Backend Failure


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T535 — Prevent Backend Failure from Returning Empty 200 Question Pages


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T536 — Optimize Question Fetch Query


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P06-T537 — Avoid Fetching Unused Question Fields


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T538 — Avoid N+1 Related Question Queries


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T539 — Cache Stable Public Question Content


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T540 — Keep User Progress Data Uncached Per User as Required


**Execution:** Execute this task against the current repository in the context of Workstream AU — Backend Question Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AV — Error and Failure States

## P06-T541 — Define Missing Question State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T542 — Define Invalid Hierarchy State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T543 — Define Public Content Fetch Failure State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T544 — Define Progress Fetch Failure State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T545 — Define Bookmark Failure State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T546 — Define Copy Failure State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P06-T547 — Prevent Technical Stack Traces from Reaching Users


**Execution:** Execute this task against the current repository in the context of Workstream AV — Error and Failure States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T548 — Prevent Blank Answer Shells


**Execution:** Execute this task against the current repository in the context of Workstream AV — Error and Failure States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T549 — Prevent Infinite Loading States


**Execution:** Execute this task against the current repository in the context of Workstream AV — Error and Failure States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T550 — Preserve Public Answer Access During User-State Failures


**Execution:** Execute this task against the current repository in the context of Workstream AV — Error and Failure States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AW — Question Page Loading States

## P06-T551 — Avoid Plain “Loading…” for User-State Enhancements


**Execution:** Execute this task against the current repository in the context of Workstream AW — Question Page Loading States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T552 — Avoid Skeleton Replacing Server-Rendered Answer Content


**Execution:** Execute this task against the current repository in the context of Workstream AW — Question Page Loading States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T553 — Use Skeletons Only for Genuine Deferred UI


**Execution:** Execute this task against the current repository in the context of Workstream AW — Question Page Loading States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T554 — Match Skeleton Dimensions to Final UI


**Execution:** Execute this task against the current repository in the context of Workstream AW — Question Page Loading States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T555 — Prevent Skeleton-Induced Layout Shift


**Execution:** Execute this task against the current repository in the context of Workstream AW — Question Page Loading States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AX — Content Safety and Rendering Integrity

## P06-T556 — Sanitize User-Unsafe HTML


**Execution:** Execute this task against the current repository in the context of Workstream AX — Content Safety and Rendering Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T557 — Validate External Links


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T558 — Apply Safe External Link Attributes Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AX — Content Safety and Rendering Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T559 — Prevent Script Injection Through Content


**Execution:** Execute this task against the current repository in the context of Workstream AX — Content Safety and Rendering Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T560 — Prevent Unsafe Embedded Content


**Execution:** Execute this task against the current repository in the context of Workstream AX — Content Safety and Rendering Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T561 — Validate Image Sources


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P06-T562 — Prevent Broken Media from Destroying Layout


**Execution:** Execute this task against the current repository in the context of Workstream AX — Content Safety and Rendering Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T563 — Preserve Code as Code Rather Than Executing It


**Execution:** Execute this task against the current repository in the context of Workstream AX — Content Safety and Rendering Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AY — Question Analytics

## P06-T564 — Define Meaningful Question Page Analytics


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P06-T565 — Track Question Page View


**Execution:** Execute this task against the current repository in the context of Workstream AY — Question Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T566 — Track Previous/Next Navigation


**Execution:** Execute this task against the current repository in the context of Workstream AY — Question Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T567 — Track Related Question Navigation


**Execution:** Execute this task against the current repository in the context of Workstream AY — Question Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T568 — Track Completion Action


**Execution:** Execute this task against the current repository in the context of Workstream AY — Question Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T569 — Track Bookmark Action


**Execution:** Execute this task against the current repository in the context of Workstream AY — Question Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T570 — Track Search-to-Question Arrival Where Available


**Execution:** Execute this task against the current repository in the context of Workstream AY — Question Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P06-T571 — Avoid Tracking Every Scroll Event


**Execution:** Execute this task against the current repository in the context of Workstream AY — Question Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T572 — Avoid Heavy Client-Side Analytics Logic


**Execution:** Execute this task against the current repository in the context of Workstream AY — Question Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T573 — Respect Privacy Requirements


**Execution:** Execute this task against the current repository in the context of Workstream AY — Question Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AZ — Representative Question Migration

## P06-T574 — Select Representative Short Conceptual Question


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T575 — Select Representative Long Conceptual Question


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T576 — Select Representative Code-Heavy Java Question


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T577 — Select Representative Spring Boot Question


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T578 — Select Representative Comparison Question


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T579 — Select Representative Table-Heavy Question


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T580 — Select Representative Scenario Question


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T581 — Migrate All Representative Questions


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P06-T582 — Compare Rendering Across Question Types


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T583 — Fix Root Renderer Defects


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T584 — Fix Root Layout Defects


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T585 — Fix Root Mobile Defects


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T586 — Fix Root SEO Defects


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Representative Question Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BA — Cross-Domain Question Validation

## P06-T587 — Validate Software Engineering Question


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T588 — Validate Code Question


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T589 — Validate Data Analyst Question


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P06-T590 — Validate SQL Question


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P06-T591 — Validate Behavioral Question


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P06-T592 — Validate Management Consulting Question


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P06-T593 — Identify Software-Specific Renderer Assumptions


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T594 — Remove Java-Specific Layout Assumptions


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T595 — Support Non-Code Answer Structures


**Execution:** Execute this task against the current repository in the context of Workstream BA — Cross-Domain Question Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T596 — Support Framework-Based Answers


**Execution:** Execute this task against the current repository in the context of Workstream BA — Cross-Domain Question Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T597 — Support Case-Style Answers


**Execution:** Execute this task against the current repository in the context of Workstream BA — Cross-Domain Question Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream BB — Legacy Question Page Cleanup

## P06-T598 — Inventory Legacy Question Components


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T599 — Inventory Legacy Answer Components


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T600 — Inventory Legacy Code Components


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T601 — Inventory Legacy Metadata Components


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T602 — Inventory Legacy Sidebar Components


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T603 — Inventory Legacy Question CSS


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T604 — Remove Confirmed Dead Question Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T605 — Remove Confirmed Dead Answer Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T606 — Remove Confirmed Dead Code Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T607 — Remove Confirmed Dead Question CSS


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T608 — Remove Duplicate Renderer Dependencies


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T609 — Remove Obsolete Metadata Logic


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P06-T610 — Prevent Legacy Question UI Reintroduction


**Execution:** Execute this task against the current repository in the context of Workstream BB — Legacy Question Page Cleanup, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream BC — Answer Content Quality Signal Collection

## P06-T611 — Define Content Quality Flags for Later Phase

Potential flags:

* too short,
* excessively long,
* unbroken paragraph,
* excessive jargon,
* missing example,
* malformed code,
* malformed table,
* duplicate answer,
* suspiciously generic answer,
* incomplete answer.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Potential flags: too short, excessively long, unbroken paragraph, excessive jargon, missing example, malformed code, malformed table, duplicate answer, suspiciously generic answer, incomplete answer. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T612 — Detect Empty Answers


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T613 — Detect Extremely Short Answers


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T614 — Detect Extremely Long Answers


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T615 — Detect Malformed Markdown


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T616 — Detect Broken Code Fences


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T617 — Detect Broken Tables


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T618 — Detect Duplicate Question Titles


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T619 — Detect Duplicate Answer Bodies


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T620 — Detect Placeholder Content


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T621 — Store Findings for Dedicated Content Quality Phase


**Execution:** Execute this task against the current repository in the context of Workstream BC — Answer Content Quality Signal Collection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T622 — Do Not Block UI Migration on Full Content Rewrite


**Execution:** Trace current consumers and behavior, refactor the responsibility at its shared owner, and migrate usage incrementally so externally visible behavior is preserved unless this task explicitly changes it. Remove duplicate legacy paths after migration and run targeted regression checks across the routes or features with the largest blast radius.

**Priority:** P0

---

# Workstream BD — Question Page Visual Validation

## P06-T623 — Review Above-the-Fold Density


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T624 — Review Question Title Dominance


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T625 — Review Answer Discoverability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T626 — Review Reading Width


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T627 — Review Typography


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T628 — Review Vertical Rhythm


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T629 — Review Code Blocks


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T630 — Review Tables


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T631 — Review Callouts


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T632 — Review Sidebar Competition


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T633 — Review Related Content Competition


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T634 — Review Colour Density


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T635 — Review Card Density


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T636 — Review Icon Density


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream BE — Question Page UX Validation

## P06-T637 — Test “I Need the Answer Quickly”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T638 — Test “I Want Deep Understanding”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T639 — Test “I Want to Study the Whole Module”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T640 — Test “I Arrived from Google”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T641 — Test “I Arrived from Internal Search”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T642 — Test “I Am on Mobile”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T643 — Test “I Am Reading a Very Long Answer”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T644 — Test “I Am Reading a Code-Heavy Answer”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T645 — Test “I Want the Next Question”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T646 — Test “I Want to Return to the Module”


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T647 — Test Anonymous User Experience


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T648 — Test Authenticated User Experience


**Execution:** Execute this task against the current repository in the context of Workstream BE — Question Page UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream BF — Question SEO Validation

## P06-T649 — Validate Rendered Title


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T650 — Validate Rendered Description


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T651 — Validate Canonical


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T652 — Validate Robots Metadata


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T653 — Validate Structured Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T654 — Validate Breadcrumb Schema


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T655 — Validate One H1


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T656 — Validate Heading Hierarchy


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T657 — Validate Server-Rendered Answer Content


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T658 — Validate Crawlable Internal Links


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T659 — Validate Canonical 200 Status


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T660 — Validate No Soft 404


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T661 — Validate Sitemap Participation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream BG — Question Performance Validation

## P06-T662 — Measure LCP


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T663 — Measure CLS


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T664 — Measure Interaction Responsiveness


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T665 — Measure JavaScript Payload


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T666 — Measure Answer Renderer Cost


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T667 — Measure Code Highlighting Cost


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T668 — Measure User-State Enhancement Cost


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T669 — Measure Large Answer Performance


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T670 — Measure Mobile Performance


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T671 — Fix Root Performance Regressions


**Execution:** Execute this task against the current repository in the context of Workstream BG — Question Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BH — Question Regression Protection

## P06-T672 — Add Question Resolver Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T673 — Add Question Route Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T674 — Add Canonical URL Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T675 — Add Missing Question Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T676 — Add Invalid Hierarchy Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T677 — Add Answer Renderer Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T678 — Add Code Block Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T679 — Add Table Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T680 — Add Breadcrumb Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T681 — Add Previous/Next Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T682 — Add Sitemap Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P06-T683 — Add Mobile Layout Regression Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P06-T684 — Add Accessibility Regression Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

# Workstream BI — Question Page Acceptance Review

## P06-T685 — Review as a First-Time Interview Candidate


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T686 — Review as an Experienced Engineer


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T687 — Review as a User Arriving from Search


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T688 — Review as a Mobile User


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T689 — Review in Light Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T690 — Review in Dark Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T691 — Review Short Answer Experience


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T692 — Review Long Answer Experience


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T693 — Review Code-Heavy Answer Experience


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T694 — Review Non-Code Answer Experience


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T695 — Review Reading Comfort


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T696 — Review Navigation Clarity


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T697 — Review SEO Integrity


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T698 — Review Performance


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T699 — Fix Root Defects Instead of Per-Question CSS Patches


**Execution:** Execute this task against the current repository in the context of Workstream BI — Question Page Acceptance Review, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BJ — Phase 06 Completion

## P06-T700 — Freeze Canonical Question Page Architecture


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T701 — Freeze Canonical Answer Renderer


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T702 — Freeze Canonical Reading Width


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T703 — Freeze Canonical Answer Typography


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T704 — Freeze Canonical Code Block Architecture


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T705 — Freeze Canonical Table Architecture


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T706 — Freeze Canonical Callout Architecture


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T707 — Freeze Canonical Question Navigation


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T708 — Freeze Canonical Question SEO Contract


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T709 — Freeze Canonical Question Backend Contract


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T710 — Publish Question Component Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P06-T711 — Publish Legacy-to-V2 Question Migration Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P06-T712 — Publish Content Quality Issue Dataset for Later Phase


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P06-T713 — Update V2 Technical Implementation Plan


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P06-T714 — Update V2 Decision Log


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T715 — Update V2 Issue Log


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P06-T716 — Produce Phase 06 Completion Report

Document:

* final question-page architecture,
* answer renderer,
* typography,
* reading width,
* code rendering,
* table rendering,
* callouts,
* sidebar behavior,
* previous/next behavior,
* related questions,
* mobile behavior,
* SEO behavior,
* structured data,
* backend contracts,
* performance,
* legacy cleanup,
* content-quality issues discovered.

**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document: final question-page architecture, answer renderer, typography, reading width, code rendering, table rendering, callouts, sidebar behavior, previous/next behavior, related questions, mobile behavior, SEO behavior, structured data, backend contracts, performance, legacy cleanup, content-quality issues discovered. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P06-T717 — Approve Question Experience as the Canonical V2 Content Surface


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Phase 06 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: # Phase 06 Exit Criteria Phase 06 is complete when: the question is immediately visible, the answer is immediately discoverable, the answer is the dominant page element, reading width is comfortable, typography supports long-form reading, long answers remain navigable, short answers do not look broken, code blocks are readable and copyable, tables work on mobile, callouts are restrained, metadata is secondary, badges Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Phase 06 Exit Criteria

Phase 06 is complete when:

* the question is immediately visible,
* the answer is immediately discoverable,
* the answer is the dominant page element,
* reading width is comfortable,
* typography supports long-form reading,
* long answers remain navigable,
* short answers do not look broken,
* code blocks are readable and copyable,
* tables work on mobile,
* callouts are restrained,
* metadata is secondary,
* badges are limited,
* colours are restrained,
* cards are dramatically reduced,
* sidebars support rather than compete,
* mobile reading is first-class,
* public answers do not require authentication,
* question content is server-rendered,
* canonical URLs are stable,
* invalid questions return true 404s,
* legacy URLs redirect correctly,
* indexable questions are included correctly in sitemaps,
* structured data is semantically valid,
* question pages have strong internal links,
* backend user-state failures do not break public answers,
* the renderer supports multiple interview domains,
* the system can scale to 10,000+ questions without per-question UI hacks.

---

# Phase 06 Core Principle

```text
A USER SHOULD NEVER HAVE TO
FIGHT THE INTERFACE
TO READ THE ANSWER
```

The intended transformation is:

```text
CURRENT RISK

Question title
Badges
Metadata
Cards
Sidebar
Progress
Actions
Colours
Boxes
Answer
More boxes
More metadata
Related content

Everything competing simultaneously

        ↓

V2

Context

QUESTION

ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clear explanation

Readable examples

Readable code

Useful interview context

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continue learning
```

---

# The Most Important Visual Rule

The question page should not look like:

```text
┌─────────────┐ ┌─────────────┐
│   Badge     │ │   Badge     │
└─────────────┘ └─────────────┘

┌──────────────────────────────┐
│       QUESTION CARD          │
└──────────────────────────────┘

┌──────────────────────────────┐
│       ANSWER CARD            │
│                              │
│  ┌────────────────────────┐  │
│  │      TIP CARD          │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │     EXAMPLE CARD       │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

It should feel closer to:

```text
Java Backend › Spring Boot › Spring Security

How does Spring Security authentication work?

Intermediate · Spring Security

Spring Security authentication is the process of verifying
the identity of a user before allowing access to protected
resources.

## How it works

The authentication flow begins when...

1. The user submits credentials.
2. The authentication filter intercepts the request.
3. AuthenticationManager delegates authentication.
4. The authenticated identity is stored in SecurityContext.

## Example

[clean code block]

## Interview perspective

A strong interview answer should explain...

────────────────────────────────────────

Previous question                Next question
```

The page should feel like a **high-quality technical reading environment**, not a collection of dashboard widgets.

---

# Critical Implementation Rule

Do not manually redesign thousands of question pages.

The implementation model must be:

```text
CANONICAL QUESTION DATA
        ↓
ONE QUESTION RESOLVER
        ↓
ONE ANSWER RENDERER
        ↓
ONE QUESTION PAGE ARCHITECTURE
        ↓
10,000+ QUESTIONS IMPROVE TOGETHER
```

If a visual problem is found across 2,000 question pages:

```text
DO NOT PATCH 2,000 PAGES

FIX THE SHARED ROOT COMPONENT
```

If a metadata problem exists across 5,000 pages:

```text
DO NOT EDIT 5,000 METADATA FILES

FIX THE METADATA FACTORY
```

If a canonical problem exists across thousands of URLs:

```text
DO NOT PATCH INDIVIDUAL ROUTES

FIX THE URL RESOLVER
```

This is the fundamental V2 execution model.

---

# Content Quality Boundary

Phase 06 should collect and classify content problems but should not become blocked by rewriting all content.

The content audit output should eventually allow questions to be classified approximately as:

```text
A — Excellent
B — Good, minor polish needed
C — Useful but requires restructuring
D — Weak, requires substantial rewrite
E — Broken, duplicate, empty or unsafe
```

That later system can prioritize the 10,000+ question library intelligently instead of blindly rewriting everything.

---

# Next Phase

```text
PHASE 07

GLOBAL SEARCH, DISCOVERY
&
CONTENT RETRIEVAL SYSTEM
```

Phase 07 should rebuild how users find content when they do not want to manually navigate:

```text
USER INTENT
    ↓
SEARCH
    ↓
QUERY UNDERSTANDING
    ↓
RESULT GROUPING
    ↓
DOMAIN / STACK / PILLAR / MODULE / QUESTION
    ↓
CANONICAL DESTINATION
```

It should cover:

* global search architecture,
* search index/data source,
* question search,
* technology search,
* topic search,
* company search,
* grouped results,
* ranking,
* typo tolerance,
* keyboard navigation,
* mobile search,
* empty states,
* no-result recovery,
* search performance,
* backend search contracts,
* SEO-safe search behavior,
* prevention of indexable search-result explosion,
* analytics for genuine search gaps.

Phase 07 is especially important because with **10,000+ questions**, hierarchy alone is not enough. Users need a fast route from:

```text
"spring security jwt"

→

the exact relevant module and questions
```

without searching through hundreds of cards.
