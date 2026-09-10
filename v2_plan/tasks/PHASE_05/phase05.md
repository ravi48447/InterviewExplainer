# PHASE 05 — CONTENT DISCOVERY HIERARCHY REBUILD

## DOMAIN → STACK → PILLAR → MODULE

---

# Phase Objective

Rebuild the complete public content-discovery hierarchy of Interview Explainer.

The canonical hierarchy is:

```text
DOMAIN
   ↓
STACK
   ↓
PILLAR
   ↓
MODULE
   ↓
QUESTION
```

Examples:

```text
Software Engineering
        ↓
Java Backend
        ↓
Spring Boot
        ↓
Spring Security
        ↓
How does Spring Security authentication work?
```

Another example:

```text
Data & Analytics
        ↓
Data Analyst
        ↓
SQL
        ↓
Window Functions
        ↓
What is the difference between ROW_NUMBER, RANK and DENSE_RANK?
```

Future example:

```text
Management Consulting
        ↓
Case Interviews
        ↓
Profitability
        ↓
Profitability Framework
        ↓
How would you investigate declining profits?
```

The hierarchy must support the current content library while remaining extensible to:

* software engineering,
* DevOps,
* cloud,
* data engineering,
* data analytics,
* data science,
* product management,
* management consulting,
* behavioral interviews,
* company-specific preparation,
* future interview domains.

The goal is not to create four visually similar pages with different titles.

Each hierarchy level has a different job.

```text
DOMAIN
= What broad interview area do I want to prepare for?

STACK
= What role or technology track am I preparing for?

PILLAR
= What major competency area must I understand?

MODULE
= What focused topic should I study now?

QUESTION
= What exact interview concept should I learn?
```

The architecture must provide:

* clear hierarchy,
* low cognitive load,
* strong internal linking,
* crawlable navigation,
* useful SEO landing pages,
* meaningful progression,
* mobile usability,
* consistent V2 visual design,
* scalable rendering for thousands of questions.

---

# Core Architectural Principle

```text
DO NOT SHOW THE ENTIRE CONTENT DATABASE
AT EVERY LEVEL

EACH LEVEL SHOULD REVEAL
ONLY THE NEXT MEANINGFUL LEVEL
```

Therefore:

```text
DOMAIN PAGE
    → STACKS

STACK PAGE
    → PILLARS

PILLAR PAGE
    → MODULES

MODULE PAGE
    → QUESTIONS
```

Contextual secondary discovery may exist, but the primary hierarchy must remain obvious.

---

# Workstream A — Canonical Content Taxonomy

## P05-T001 — Define Canonical Content Hierarchy

Formalize:

* domain,
* stack,
* pillar,
* module,
* question.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Formalize: domain, stack, pillar, module, question. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T002 — Define Domain Entity Contract

Specify required and optional fields.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Specify required and optional fields. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T003 — Define Stack Entity Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T004 — Define Pillar Entity Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T005 — Define Module Entity Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T006 — Define Question Relationship Contract

Questions must resolve to their canonical hierarchy.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Questions must resolve to their canonical hierarchy. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T007 — Define Parent-Child Ownership

Every hierarchy entity must have explicit parent relationships.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Every hierarchy entity must have explicit parent relationships. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T008 — Prevent Ambiguous Parent Relationships


**Execution:** Execute this task against the current repository in the context of Workstream A — Canonical Content Taxonomy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T009 — Define Whether Multi-Parent Relationships Are Allowed

Do not introduce them accidentally.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Do not introduce them accidentally. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T010 — Define Canonical Parent for Multi-Category Content

Where cross-linking is required, preserve one canonical hierarchy.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Where cross-linking is required, preserve one canonical hierarchy. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T011 — Separate Canonical Hierarchy from Tags

Tags must not become accidental structural parents.

**Execution:** Execute this task against the current repository in the context of Workstream A — Canonical Content Taxonomy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Tags must not become accidental structural parents. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T012 — Separate Canonical Hierarchy from Search Categories


**Execution:** Execute this task against the current repository in the context of Workstream A — Canonical Content Taxonomy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T013 — Separate Canonical Hierarchy from Company Associations


**Execution:** Execute this task against the current repository in the context of Workstream A — Canonical Content Taxonomy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T014 — Separate Canonical Hierarchy from Difficulty


**Execution:** Execute this task against the current repository in the context of Workstream A — Canonical Content Taxonomy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T015 — Establish Taxonomy Naming Rules

Use user-understandable names.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use user-understandable names. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T016 — Establish Taxonomy Description Rules


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T017 — Establish Taxonomy Slug Rules

Use Phase 02.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use Phase 02. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T018 — Establish Taxonomy Stable ID Rules


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T019 — Detect Duplicate Taxonomy Entities


**Execution:** Execute this task against the current repository in the context of Workstream A — Canonical Content Taxonomy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T020 — Detect Near-Duplicate Taxonomy Entities


**Execution:** Execute this task against the current repository in the context of Workstream A — Canonical Content Taxonomy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream B — Hierarchy Data Architecture

## P05-T021 — Identify Canonical Hierarchy Data Source


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T022 — Remove Competing Hierarchy Definitions


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T023 — Build Canonical Hierarchy Resolver

Resolve:

```text
domain
→ stacks
→ pillars
→ modules
→ questions
```

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Resolve: Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T024 — Build Domain Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T025 — Build Stack Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T026 — Build Pillar Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T027 — Build Module Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T028 — Build Child Entity Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T029 — Build Parent Entity Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T030 — Build Hierarchy Path Resolver


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T031 — Build Hierarchy Validation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T032 — Detect Orphan Stacks


**Execution:** Execute this task against the current repository in the context of Workstream B — Hierarchy Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T033 — Detect Orphan Pillars


**Execution:** Execute this task against the current repository in the context of Workstream B — Hierarchy Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T034 — Detect Orphan Modules


**Execution:** Execute this task against the current repository in the context of Workstream B — Hierarchy Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T035 — Detect Orphan Questions


**Execution:** Execute this task against the current repository in the context of Workstream B — Hierarchy Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T036 — Detect Circular Hierarchy Relationships


**Execution:** Execute this task against the current repository in the context of Workstream B — Hierarchy Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T037 — Detect Missing Parent References


**Execution:** Execute this task against the current repository in the context of Workstream B — Hierarchy Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T038 — Detect Invalid Child References


**Execution:** Execute this task against the current repository in the context of Workstream B — Hierarchy Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T039 — Establish Deterministic Hierarchy Ordering


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T040 — Avoid Array Position as Permanent Content Identity


**Execution:** Execute this task against the current repository in the context of Workstream B — Hierarchy Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream C — Hierarchy Route Architecture

## P05-T041 — Apply Canonical Domain Route Contract


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T042 — Apply Canonical Stack Route Contract


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T043 — Apply Canonical Pillar Route Contract


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T044 — Apply Canonical Module Route Contract


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T045 — Validate Hierarchy Route Parameter Resolution


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T046 — Validate Parent-Child URL Relationships


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T047 — Prevent Invalid Hierarchy Combinations


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T048 — Redirect Valid Legacy Hierarchy URLs


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T049 — Return True 404 for Invalid Hierarchy Paths


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T050 — Prevent Soft 404 Hierarchy Pages


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T051 — Prevent Duplicate Hierarchy URLs


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T052 — Prevent Internal Rendering URLs from Becoming Public


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T053 — Ensure All Hierarchy Links Use Canonical URL Generators


**Execution:** Execute this task against the current repository in the context of Workstream C — Hierarchy Route Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T054 — Remove Legacy Hierarchy URL Builders


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream D — Shared Hierarchy Page Architecture

## P05-T055 — Define Shared Hierarchy Page Principles

Create consistency without making all levels identical.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create consistency without making all levels identical. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T056 — Build Shared Hierarchy Header Foundation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T057 — Build Shared Hierarchy Breadcrumb Integration


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T058 — Build Shared Hierarchy Introduction Pattern


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T059 — Build Shared Child Discovery Foundation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T060 — Build Shared Progress Foundation Where Appropriate


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P05-T061 — Build Shared Related Content Foundation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P05-T062 — Build Shared Empty State Foundation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T063 — Build Shared Loading Foundation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P05-T064 — Build Shared Error Foundation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T065 — Prevent One Giant Generic Hierarchy Template

Each level must preserve its distinct purpose.

**Execution:** Execute this task against the current repository in the context of Workstream D — Shared Hierarchy Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Each level must preserve its distinct purpose. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream E — Domain Page Architecture

## P05-T066 — Define Domain Page Primary Job

A domain page introduces a broad interview-preparation area.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: A domain page introduces a broad interview-preparation area. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T067 — Define Domain Page Information Architecture

Recommended hierarchy:

```text
Breadcrumb
Domain Header
Short Introduction
Primary Stacks / Tracks
Optional Guidance
Related Major Resources
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Recommended hierarchy: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T068 — Build Canonical Domain Header


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T069 — Define Domain H1


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T070 — Define Domain Introduction


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T071 — Define Domain Primary CTA


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T072 — Build Domain Stack Discovery Section


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T073 — Define Domain Stack Preview Content


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T074 — Prevent Domain Page from Listing Every Question


**Execution:** Execute this task against the current repository in the context of Workstream E — Domain Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T075 — Prevent Domain Page from Listing Every Module


**Execution:** Execute this task against the current repository in the context of Workstream E — Domain Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T076 — Prevent Domain Page from Becoming a Giant Directory


**Execution:** Execute this task against the current repository in the context of Workstream E — Domain Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T077 — Provide Domain-Level Orientation

Explain how the preparation area is organized.

**Execution:** Execute this task against the current repository in the context of Workstream E — Domain Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Explain how the preparation area is organized. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T078 — Support Domain-Level Featured Resources

Only where useful.

**Execution:** Execute this task against the current repository in the context of Workstream E — Domain Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Only where useful. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P05-T079 — Support Domain-Level Roadmaps

Where available.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Where available. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P05-T080 — Define Domain Mobile Layout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream F — Domain Page Visual Rebuild

## P05-T081 — Reduce Domain Hero Size


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T082 — Avoid Marketing-Style Domain Heroes


**Execution:** Execute this task against the current repository in the context of Workstream F — Domain Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T083 — Avoid Excessive Domain Colour Branding


**Execution:** Execute this task against the current repository in the context of Workstream F — Domain Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T084 — Use Neutral Primary Surfaces


**Execution:** Execute this task against the current repository in the context of Workstream F — Domain Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T085 — Use Accent Colour Sparingly


**Execution:** Execute this task against the current repository in the context of Workstream F — Domain Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T086 — Reduce Domain Card Count


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T087 — Standardize Domain Stack Items


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T088 — Avoid Large Decorative Icons


**Execution:** Execute this task against the current repository in the context of Workstream F — Domain Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T089 — Avoid Redundant Metadata


**Execution:** Execute this task against the current repository in the context of Workstream F — Domain Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T090 — Maintain Strong Reading Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream F — Domain Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream G — Domain Page SEO

## P05-T091 — Apply Domain Metadata Contract


**Execution:** Execute this task against the current repository in the context of Workstream G — Domain Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T092 — Generate Unique Domain Title


**Execution:** Execute this task against the current repository in the context of Workstream G — Domain Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T093 — Generate Useful Domain Description


**Execution:** Execute this task against the current repository in the context of Workstream G — Domain Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T094 — Generate Domain Canonical


**Execution:** Execute this task against the current repository in the context of Workstream G — Domain Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T095 — Validate Domain Indexability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T096 — Add Domain Breadcrumb Schema


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T097 — Ensure Domain Introduction Is Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream G — Domain Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T098 — Ensure Stack Links Are Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream G — Domain Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T099 — Include Valid Domain Pages in Sitemap


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T100 — Exclude Empty Domain Pages


**Execution:** Execute this task against the current repository in the context of Workstream G — Domain Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream H — Stack Page Architecture

## P05-T101 — Define Stack Page Primary Job

A stack page represents a major preparation track.

Examples:

* Java Backend,
* Frontend Engineering,
* DevOps,
* Data Analyst.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: A stack page represents a major preparation track. Examples: Java Backend, Frontend Engineering, DevOps, Data Analyst. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T102 — Define Stack Page Information Architecture

Recommended hierarchy:

```text
Breadcrumb
Stack Header
Short Preparation Overview
Pillars
Optional Progress
Optional Recommended Starting Point
Related Resources
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Recommended hierarchy: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T103 — Build Canonical Stack Header


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T104 — Define Stack H1


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T105 — Define Stack Introduction


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T106 — Define Stack Preparation Context

Explain what the track covers.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Explain what the track covers. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T107 — Build Stack Pillar Discovery


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T108 — Define Pillar Preview Information


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T109 — Define Stack Starting Point Logic


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T110 — Define Stack Progress Integration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T111 — Prevent Stack Page from Showing All Questions


**Execution:** Execute this task against the current repository in the context of Workstream H — Stack Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T112 — Prevent Stack Page from Showing All Modules


**Execution:** Execute this task against the current repository in the context of Workstream H — Stack Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T113 — Prevent Stack Page from Becoming a Dashboard


**Execution:** Execute this task against the current repository in the context of Workstream H — Stack Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T114 — Prevent Stack Page from Becoming a Marketing Landing Page


**Execution:** Execute this task against the current repository in the context of Workstream H — Stack Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T115 — Define Stack Mobile Layout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream I — Stack Page Visual Rebuild

## P05-T116 — Reduce Stack Header Density


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T117 — Reduce Stack Metadata Density


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T118 — Standardize Pillar Discovery Items


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T119 — Avoid One Large Card per Minor Detail


**Execution:** Execute this task against the current repository in the context of Workstream I — Stack Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T120 — Use Clear Section Separation


**Execution:** Execute this task against the current repository in the context of Workstream I — Stack Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T121 — Use Consistent Progress Treatment


**Execution:** Execute this task against the current repository in the context of Workstream I — Stack Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T122 — Avoid Excessive Progress Visualizations


**Execution:** Execute this task against the current repository in the context of Workstream I — Stack Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T123 — Avoid Excessive Difficulty Colours


**Execution:** Execute this task against the current repository in the context of Workstream I — Stack Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T124 — Avoid Decorative Stack Gradients


**Execution:** Execute this task against the current repository in the context of Workstream I — Stack Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T125 — Ensure Stack Identity Remains Clear


**Execution:** Execute this task against the current repository in the context of Workstream I — Stack Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream J — Stack Page SEO

## P05-T126 — Apply Stack Metadata Contract


**Execution:** Execute this task against the current repository in the context of Workstream J — Stack Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T127 — Generate Unique Stack Title


**Execution:** Execute this task against the current repository in the context of Workstream J — Stack Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T128 — Generate Useful Stack Description


**Execution:** Execute this task against the current repository in the context of Workstream J — Stack Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T129 — Generate Stack Canonical


**Execution:** Execute this task against the current repository in the context of Workstream J — Stack Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T130 — Validate Stack Indexability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T131 — Add Stack Breadcrumb Schema


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T132 — Ensure Stack Introduction Is Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream J — Stack Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T133 — Ensure Pillar Links Are Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream J — Stack Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T134 — Include Valid Stack Pages in Sitemap


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T135 — Exclude Empty Stack Pages


**Execution:** Execute this task against the current repository in the context of Workstream J — Stack Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream K — Pillar Page Architecture

## P05-T136 — Define Pillar Page Primary Job

A pillar page represents a major competency area within a preparation track.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: A pillar page represents a major competency area within a preparation track. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T137 — Define Pillar Page Information Architecture

Recommended hierarchy:

```text
Breadcrumb
Pillar Header
Short Competency Overview
Modules
Optional Preparation Guidance
Related Pillars
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Recommended hierarchy: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T138 — Build Canonical Pillar Header


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T139 — Define Pillar H1


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T140 — Define Pillar Introduction


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T141 — Explain Pillar Relevance

Keep it concise and useful.

**Execution:** Execute this task against the current repository in the context of Workstream K — Pillar Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Keep it concise and useful. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T142 — Build Pillar Module Discovery


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T143 — Define Module Preview Information


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T144 — Define Pillar Progress Integration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T145 — Define Pillar Starting Point


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T146 — Prevent Pillar Page from Showing Every Question


**Execution:** Execute this task against the current repository in the context of Workstream K — Pillar Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T147 — Prevent Pillar Page from Duplicating Module Pages


**Execution:** Execute this task against the current repository in the context of Workstream K — Pillar Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T148 — Prevent Pillar Page from Becoming Visually Dense


**Execution:** Execute this task against the current repository in the context of Workstream K — Pillar Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T149 — Define Pillar Mobile Layout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream L — Pillar Page Visual Rebuild

## P05-T150 — Reduce Pillar Header Height


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T151 — Simplify Pillar Metadata


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T152 — Standardize Module Discovery Items


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T153 — Use Strong Module Titles


**Execution:** Execute this task against the current repository in the context of Workstream L — Pillar Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T154 — Use Short Module Supporting Information


**Execution:** Execute this task against the current repository in the context of Workstream L — Pillar Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T155 — Avoid Multiple Nested Card Layers


**Execution:** Execute this task against the current repository in the context of Workstream L — Pillar Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T156 — Avoid One Colour per Module


**Execution:** Execute this task against the current repository in the context of Workstream L — Pillar Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T157 — Avoid Excessive Icons


**Execution:** Execute this task against the current repository in the context of Workstream L — Pillar Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T158 — Preserve Clear Progression


**Execution:** Execute this task against the current repository in the context of Workstream L — Pillar Page Visual Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream M — Pillar Page SEO

## P05-T159 — Apply Pillar Metadata Contract


**Execution:** Execute this task against the current repository in the context of Workstream M — Pillar Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T160 — Generate Unique Pillar Title


**Execution:** Execute this task against the current repository in the context of Workstream M — Pillar Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T161 — Generate Useful Pillar Description


**Execution:** Execute this task against the current repository in the context of Workstream M — Pillar Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T162 — Generate Pillar Canonical


**Execution:** Execute this task against the current repository in the context of Workstream M — Pillar Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T163 — Validate Pillar Indexability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T164 — Add Pillar Breadcrumb Schema


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T165 — Ensure Pillar Introduction Is Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream M — Pillar Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T166 — Ensure Module Links Are Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream M — Pillar Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T167 — Include Valid Pillars in Sitemap


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T168 — Exclude Empty Pillars


**Execution:** Execute this task against the current repository in the context of Workstream M — Pillar Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream N — Module Page Architecture

## P05-T169 — Define Module Page Primary Job

A module page is the immediate discovery layer before individual interview questions.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: A module page is the immediate discovery layer before individual interview questions. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T170 — Define Module Page Information Architecture

Recommended hierarchy:

```text
Breadcrumb
Module Header
Short Topic Introduction
Question List
Optional Progress
Optional Related Modules
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Recommended hierarchy: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T171 — Build Canonical Module Header


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T172 — Define Module H1


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T173 — Define Module Introduction


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T174 — Explain Module Scope Concisely


**Execution:** Execute this task against the current repository in the context of Workstream N — Module Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T175 — Build Canonical Module Question List


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T176 — Define Question List Item Information Hierarchy

The question title must dominate.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: The question title must dominate. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T177 — Define Question Numbering Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T178 — Define Difficulty Display Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T179 — Define Completion State Display


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T180 — Define Bookmark State Display


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P05-T181 — Define Question Type Display Where Useful


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P05-T182 — Avoid Showing Full Answer Previews


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T183 — Avoid Excessive Metadata Per Question


**Execution:** Execute this task against the current repository in the context of Workstream N — Module Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T184 — Avoid One Heavy Card per Question


**Execution:** Execute this task against the current repository in the context of Workstream N — Module Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T185 — Support Large Question Lists


**Execution:** Execute this task against the current repository in the context of Workstream N — Module Page Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T186 — Define Module Mobile Layout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream O — Question List Design System

## P05-T187 — Build Canonical Question List Component


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T188 — Build Canonical Question List Item


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T189 — Make Question Title the Primary Visual Element


**Execution:** Execute this task against the current repository in the context of Workstream O — Question List Design System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T190 — Define Secondary Metadata Placement


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T191 — Define Completion Indicator


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T192 — Define Difficulty Indicator


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T193 — Define Hover State

Keep it subtle.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Keep it subtle. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T194 — Define Active State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T195 — Define Focus State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T196 — Define Visited State Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P05-T197 — Ensure Entire Item Interaction Is Accessible


**Execution:** Execute this task against the current repository in the context of Workstream O — Question List Design System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T198 — Ensure Question Link Uses Canonical URL


**Execution:** Execute this task against the current repository in the context of Workstream O — Question List Design System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T199 — Prevent Nested Interactive Elements


**Execution:** Execute this task against the current repository in the context of Workstream O — Question List Design System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T200 — Avoid Card Lift Animation


**Execution:** Execute this task against the current repository in the context of Workstream O — Question List Design System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T201 — Avoid Excessive Borders


**Execution:** Execute this task against the current repository in the context of Workstream O — Question List Design System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T202 — Avoid Excessive Badges


**Execution:** Execute this task against the current repository in the context of Workstream O — Question List Design System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T203 — Optimize Question List Density for Reading


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T204 — Optimize Question List for Mobile


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream P — Module Page SEO

## P05-T205 — Apply Module Metadata Contract


**Execution:** Execute this task against the current repository in the context of Workstream P — Module Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T206 — Generate Unique Module Title


**Execution:** Execute this task against the current repository in the context of Workstream P — Module Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T207 — Generate Useful Module Description


**Execution:** Execute this task against the current repository in the context of Workstream P — Module Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T208 — Generate Module Canonical


**Execution:** Execute this task against the current repository in the context of Workstream P — Module Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T209 — Validate Module Indexability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T210 — Add Module Breadcrumb Schema


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T211 — Ensure Module Introduction Is Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream P — Module Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T212 — Ensure Question Links Are Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream P — Module Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T213 — Include Valid Modules in Sitemap


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T214 — Exclude Empty Modules


**Execution:** Execute this task against the current repository in the context of Workstream P — Module Page SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Q — Hierarchy Breadcrumbs

## P05-T215 — Apply Canonical Domain Breadcrumbs


**Execution:** Execute this task against the current repository in the context of Workstream Q — Hierarchy Breadcrumbs, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T216 — Apply Canonical Stack Breadcrumbs


**Execution:** Execute this task against the current repository in the context of Workstream Q — Hierarchy Breadcrumbs, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T217 — Apply Canonical Pillar Breadcrumbs


**Execution:** Execute this task against the current repository in the context of Workstream Q — Hierarchy Breadcrumbs, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T218 — Apply Canonical Module Breadcrumbs


**Execution:** Execute this task against the current repository in the context of Workstream Q — Hierarchy Breadcrumbs, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T219 — Ensure Breadcrumb Labels Use Display Names


**Execution:** Execute this task against the current repository in the context of Workstream Q — Hierarchy Breadcrumbs, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T220 — Ensure Breadcrumb URLs Use Canonical Slugs


**Execution:** Execute this task against the current repository in the context of Workstream Q — Hierarchy Breadcrumbs, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T221 — Prevent Breadcrumb Links to Redirects


**Execution:** Execute this task against the current repository in the context of Workstream Q — Hierarchy Breadcrumbs, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T222 — Prevent Duplicate Breadcrumb Rendering


**Execution:** Execute this task against the current repository in the context of Workstream Q — Hierarchy Breadcrumbs, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T223 — Align Breadcrumb Schema with Visible Breadcrumbs


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T224 — Optimize Deep Breadcrumbs for Mobile


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream R — Content Sidebar Integration

## P05-T225 — Define Sidebar Eligibility by Hierarchy Level


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T226 — Avoid Sidebar on Pages Where It Adds No Value


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T227 — Integrate Content Tree on Appropriate Deep Routes


**Execution:** Execute this task against the current repository in the context of Workstream R — Content Sidebar Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T228 — Highlight Current Hierarchy Position


**Execution:** Execute this task against the current repository in the context of Workstream R — Content Sidebar Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T229 — Expand Current Parent Path


**Execution:** Execute this task against the current repository in the context of Workstream R — Content Sidebar Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T230 — Avoid Rendering Entire Global Taxonomy in Sidebar


**Execution:** Execute this task against the current repository in the context of Workstream R — Content Sidebar Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T231 — Load Relevant Hierarchy Context Only


**Execution:** Execute this task against the current repository in the context of Workstream R — Content Sidebar Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T232 — Define Sidebar Behavior for Domain Pages


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T233 — Define Sidebar Behavior for Stack Pages


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T234 — Define Sidebar Behavior for Pillar Pages


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T235 — Define Sidebar Behavior for Module Pages


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T236 — Define Mobile Sidebar Transformation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream S — Hierarchy Progress Architecture

## P05-T237 — Define Progress Semantics

Clarify what “progress” actually means.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Clarify what “progress” actually means. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T238 — Define Question Completion State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T239 — Define Module Progress Calculation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T240 — Define Pillar Progress Calculation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T241 — Define Stack Progress Calculation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T242 — Define Domain Progress Calculation Where Useful


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P05-T243 — Prevent Progress from Blocking Public Content Rendering


**Execution:** Execute this task against the current repository in the context of Workstream S — Hierarchy Progress Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T244 — Keep Progress Secondary on Public Pages


**Execution:** Execute this task against the current repository in the context of Workstream S — Hierarchy Progress Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T245 — Avoid Multiple Progress Visualizations on One Page


**Execution:** Execute this task against the current repository in the context of Workstream S — Hierarchy Progress Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T246 — Handle Anonymous Users Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream S — Hierarchy Progress Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T247 — Handle Authentication Loading Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream S — Hierarchy Progress Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T248 — Handle Progress API Failure Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream S — Hierarchy Progress Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T249 — Prevent Progress State from Affecting Canonical Content


**Execution:** Execute this task against the current repository in the context of Workstream S — Hierarchy Progress Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream T — Hierarchy Search & Filtering

## P05-T250 — Define Search Needs at Each Hierarchy Level


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T251 — Avoid Search Inputs on Pages with Small Child Sets


**Execution:** Execute this task against the current repository in the context of Workstream T — Hierarchy Search & Filtering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T252 — Add Module Question Search Only Where Useful


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P05-T253 — Define Question Filter Eligibility


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T254 — Define Difficulty Filtering

Where useful.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Where useful. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P05-T255 — Define Completion Filtering

For authenticated users where useful.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: For authenticated users where useful. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P05-T256 — Prevent Filter UI from Dominating Module Pages


**Execution:** Execute this task against the current repository in the context of Workstream T — Hierarchy Search & Filtering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T257 — Prevent Filter URLs from Creating Crawl Explosion


**Execution:** Execute this task against the current repository in the context of Workstream T — Hierarchy Search & Filtering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T258 — Preserve Canonical Question Links in Filtered Results


**Execution:** Execute this task against the current repository in the context of Workstream T — Hierarchy Search & Filtering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T259 — Define Empty Filter Results State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream U — Hierarchy Internal Linking

## P05-T260 — Link Domains to Child Stacks


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T261 — Link Stacks Back to Parent Domains


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T262 — Link Stacks to Child Pillars


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T263 — Link Pillars Back to Parent Stacks


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T264 — Link Pillars to Child Modules


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T265 — Link Modules Back to Parent Pillars


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T266 — Link Modules to Child Questions


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T267 — Link Questions Back to Parent Modules


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T268 — Add Related Sibling Links Where Useful


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P05-T269 — Prevent Excessive Cross-Linking


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T270 — Prevent Internal Links to Noncanonical Aliases


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T271 — Prevent Internal Links to Redirects


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T272 — Prevent Broken Hierarchy Links


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T273 — Ensure Every Indexable Entity Has an Incoming Link


**Execution:** Execute this task against the current repository in the context of Workstream U — Hierarchy Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream V — Crawl Depth Optimization

## P05-T274 — Measure Crawl Depth for Core Content


**Execution:** Execute this task against the current repository in the context of Workstream V — Crawl Depth Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T275 — Ensure Major Stacks Are Easily Reachable


**Execution:** Execute this task against the current repository in the context of Workstream V — Crawl Depth Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T276 — Ensure Pillars Are Reachable Through Stack Pages


**Execution:** Execute this task against the current repository in the context of Workstream V — Crawl Depth Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T277 — Ensure Modules Are Reachable Through Pillar Pages


**Execution:** Execute this task against the current repository in the context of Workstream V — Crawl Depth Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T278 — Ensure Questions Are Reachable Through Module Pages


**Execution:** Execute this task against the current repository in the context of Workstream V — Crawl Depth Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T279 — Identify Excessively Deep Question Routes


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T280 — Improve Discovery Without Flattening the Entire Hierarchy


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T281 — Add Contextual Shortcuts for High-Value Content


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P05-T282 — Avoid Giant Global Link Directories


**Execution:** Execute this task against the current repository in the context of Workstream V — Crawl Depth Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream W — Thin Hierarchy Page Prevention

## P05-T283 — Define Minimum Domain Page Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T284 — Define Minimum Stack Page Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T285 — Define Minimum Pillar Page Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T286 — Define Minimum Module Page Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T287 — Prevent Empty Domain Indexing


**Execution:** Execute this task against the current repository in the context of Workstream W — Thin Hierarchy Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T288 — Prevent Empty Stack Indexing


**Execution:** Execute this task against the current repository in the context of Workstream W — Thin Hierarchy Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T289 — Prevent Empty Pillar Indexing


**Execution:** Execute this task against the current repository in the context of Workstream W — Thin Hierarchy Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T290 — Prevent Empty Module Indexing


**Execution:** Execute this task against the current repository in the context of Workstream W — Thin Hierarchy Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T291 — Prevent Placeholder Introductions from Creating False Page Value


**Execution:** Execute this task against the current repository in the context of Workstream W — Thin Hierarchy Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T292 — Prevent Metadata-Only Differentiation


**Execution:** Execute this task against the current repository in the context of Workstream W — Thin Hierarchy Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T293 — Merge or Remove Meaningless Taxonomy Levels


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T294 — Avoid Creating Hierarchy Pages Only for SEO


**Execution:** Execute this task against the current repository in the context of Workstream W — Thin Hierarchy Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream X — Hierarchy Content Introductions

## P05-T295 — Define Domain Introduction Content Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T296 — Define Stack Introduction Content Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T297 — Define Pillar Introduction Content Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T298 — Define Module Introduction Content Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T299 — Keep Introductions Concise


**Execution:** Execute this task against the current repository in the context of Workstream X — Hierarchy Content Introductions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T300 — Avoid Generic Repeated Introductions


**Execution:** Execute this task against the current repository in the context of Workstream X — Hierarchy Content Introductions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T301 — Avoid Keyword-Stuffed Introductions


**Execution:** Execute this task against the current repository in the context of Workstream X — Hierarchy Content Introductions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T302 — Ensure Introductions Explain Page Scope


**Execution:** Execute this task against the current repository in the context of Workstream X — Hierarchy Content Introductions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T303 — Ensure Introductions Help Users Choose the Next Step


**Execution:** Execute this task against the current repository in the context of Workstream X — Hierarchy Content Introductions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T304 — Prevent AI-Generated Filler from Becoming Default Taxonomy Content


**Execution:** Execute this task against the current repository in the context of Workstream X — Hierarchy Content Introductions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Y — Hierarchy Visual Density Reduction

## P05-T305 — Audit Visible Elements on Domain Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T306 — Audit Visible Elements on Stack Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T307 — Audit Visible Elements on Pillar Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T308 — Audit Visible Elements on Module Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T309 — Reduce Competing Metadata


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T310 — Reduce Badge Count


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T311 — Reduce Icon Count


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T312 — Reduce Border Count


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T313 — Reduce Surface Count


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T314 — Reduce CTA Count


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T315 — Increase Meaningful Whitespace


**Execution:** Execute this task against the current repository in the context of Workstream Y — Hierarchy Visual Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T316 — Preserve Useful Content Density


**Execution:** Execute this task against the current repository in the context of Workstream Y — Hierarchy Visual Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Z — Hierarchy Colour Simplification

## P05-T317 — Remove Arbitrary Domain Colour Systems


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T318 — Remove Arbitrary Stack Colour Systems


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T319 — Remove Arbitrary Pillar Colour Systems


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T320 — Remove Arbitrary Module Colour Systems


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T321 — Use Semantic Accent Tokens


**Execution:** Execute this task against the current repository in the context of Workstream Z — Hierarchy Colour Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T322 — Use Neutral Discovery Surfaces


**Execution:** Execute this task against the current repository in the context of Workstream Z — Hierarchy Colour Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T323 — Keep Difficulty Colour Semantic


**Execution:** Execute this task against the current repository in the context of Workstream Z — Hierarchy Colour Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T324 — Prevent Colour from Becoming the Only Hierarchy Signal


**Execution:** Execute this task against the current repository in the context of Workstream Z — Hierarchy Colour Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AA — Hierarchy Typography

## P05-T325 — Apply Canonical Domain Typography


**Execution:** Execute this task against the current repository in the context of Workstream AA — Hierarchy Typography, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T326 — Apply Canonical Stack Typography


**Execution:** Execute this task against the current repository in the context of Workstream AA — Hierarchy Typography, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T327 — Apply Canonical Pillar Typography


**Execution:** Execute this task against the current repository in the context of Workstream AA — Hierarchy Typography, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T328 — Apply Canonical Module Typography


**Execution:** Execute this task against the current repository in the context of Workstream AA — Hierarchy Typography, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T329 — Standardize Entity Titles


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T330 — Standardize Entity Descriptions


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T331 — Standardize Metadata Typography


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P05-T332 — Prevent Tiny Metadata Text


**Execution:** Execute this task against the current repository in the context of Workstream AA — Hierarchy Typography, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T333 — Prevent Excessive Bold Weight


**Execution:** Execute this task against the current repository in the context of Workstream AA — Hierarchy Typography, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T334 — Preserve Question Title Readability


**Execution:** Execute this task against the current repository in the context of Workstream AA — Hierarchy Typography, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AB — Hierarchy Spacing

## P05-T335 — Standardize Hierarchy Page Top Spacing


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T336 — Standardize Header-to-Content Spacing


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T337 — Standardize Child List Spacing


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T338 — Standardize Section Spacing


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P05-T339 — Prevent Overcompressed Lists


**Execution:** Execute this task against the current repository in the context of Workstream AB — Hierarchy Spacing, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T340 — Prevent Excessive Card Gaps


**Execution:** Execute this task against the current repository in the context of Workstream AB — Hierarchy Spacing, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T341 — Optimize Mobile Vertical Rhythm


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream AC — Hierarchy Mobile Experience

## P05-T342 — Rebuild Domain Mobile Experience


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T343 — Rebuild Stack Mobile Experience


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T344 — Rebuild Pillar Mobile Experience


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T345 — Rebuild Module Mobile Experience


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T346 — Prevent Desktop Grid Compression


**Execution:** Execute this task against the current repository in the context of Workstream AC — Hierarchy Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T347 — Prevent Horizontal Overflow


**Execution:** Execute this task against the current repository in the context of Workstream AC — Hierarchy Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T348 — Simplify Mobile Metadata


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T349 — Simplify Mobile Breadcrumbs


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T350 — Transform Sidebar Navigation Appropriately


**Execution:** Execute this task against the current repository in the context of Workstream AC — Hierarchy Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T351 — Preserve Question Scannability on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream AC — Hierarchy Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T352 — Ensure Touch Target Accessibility


**Execution:** Execute this task against the current repository in the context of Workstream AC — Hierarchy Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T353 — Avoid Endless Streams of Large Cards


**Execution:** Execute this task against the current repository in the context of Workstream AC — Hierarchy Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AD — Hierarchy Accessibility

## P05-T354 — Validate One H1 per Hierarchy Page


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T355 — Validate Heading Hierarchy


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T356 — Validate Breadcrumb Accessibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T357 — Validate Child Navigation Semantics


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T358 — Validate Question List Semantics


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T359 — Validate Keyboard Navigation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T360 — Validate Focus Visibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T361 — Validate Link Purpose


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T362 — Validate Colour Contrast


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T363 — Validate Progress Accessibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P05-T364 — Validate Screen Reader Hierarchy Context


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AE — Hierarchy Server Rendering

## P05-T365 — Server-Render Domain Primary Content


**Execution:** Execute this task against the current repository in the context of Workstream AE — Hierarchy Server Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T366 — Server-Render Stack Primary Content


**Execution:** Execute this task against the current repository in the context of Workstream AE — Hierarchy Server Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T367 — Server-Render Pillar Primary Content


**Execution:** Execute this task against the current repository in the context of Workstream AE — Hierarchy Server Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T368 — Server-Render Module Primary Content


**Execution:** Execute this task against the current repository in the context of Workstream AE — Hierarchy Server Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T369 — Server-Render Child Navigation Links


**Execution:** Execute this task against the current repository in the context of Workstream AE — Hierarchy Server Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T370 — Server-Render Question Links


**Execution:** Execute this task against the current repository in the context of Workstream AE — Hierarchy Server Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T371 — Keep Progress Enhancement Client-Side Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AE — Hierarchy Server Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T372 — Keep Bookmark Enhancement Client-Side Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AE — Hierarchy Server Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T373 — Prevent Client Loading State from Replacing Core Hierarchy Content


**Execution:** Execute this task against the current repository in the context of Workstream AE — Hierarchy Server Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T374 — Reduce Client Boundaries


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream AF — Hierarchy Performance

## P05-T375 — Establish Domain Page Performance Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T376 — Establish Stack Page Performance Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T377 — Establish Pillar Page Performance Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T378 — Establish Module Page Performance Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P05-T379 — Avoid Fetching Full Descendant Trees Unnecessarily


**Execution:** Execute this task against the current repository in the context of Workstream AF — Hierarchy Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T380 — Avoid Fetching Full Question Answers for Module Lists


**Execution:** Execute this task against the current repository in the context of Workstream AF — Hierarchy Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T381 — Fetch Only Required Question Preview Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T382 — Cache Stable Hierarchy Data


**Execution:** Execute this task against the current repository in the context of Workstream AF — Hierarchy Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T383 — Define Hierarchy Revalidation Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P05-T384 — Prevent Duplicate Hierarchy Fetches


**Execution:** Execute this task against the current repository in the context of Workstream AF — Hierarchy Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T385 — Optimize Large Module Question Lists


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T386 — Avoid Premature Client-Side Virtualization

Use only when actual list size requires it.

**Execution:** Execute this task against the current repository in the context of Workstream AF — Hierarchy Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use only when actual list size requires it. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T387 — Minimize Hierarchy JavaScript


**Execution:** Execute this task against the current repository in the context of Workstream AF — Hierarchy Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T388 — Prevent User Progress Fetching from Blocking Content


**Execution:** Execute this task against the current repository in the context of Workstream AF — Hierarchy Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AG — Backend Support

## P05-T389 — Identify Hierarchy Backend Dependencies


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T390 — Stabilize Domain Data Contract


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T391 — Stabilize Stack Data Contract


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T392 — Stabilize Pillar Data Contract


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T393 — Stabilize Module Data Contract


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T394 — Stabilize Question Preview Data Contract


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T395 — Expose Stable Hierarchy IDs


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T396 — Expose Canonical Slugs


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T397 — Expose Parent Relationships


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T398 — Expose Child Ordering


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T399 — Avoid Returning Full Answer Payloads for Hierarchy Pages


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T400 — Optimize Hierarchy Queries


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P05-T401 — Prevent N+1 Hierarchy Queries


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T402 — Cache Stable Taxonomy Data Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T403 — Distinguish Missing Entity from Backend Failure


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T404 — Prevent Backend Failure from Producing Empty Indexable Pages


**Execution:** Execute this task against the current repository in the context of Workstream AG — Backend Support, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AH — Hierarchy SEO Integration

## P05-T405 — Apply Canonical Metadata Factory to All Domain Pages


**Execution:** Execute this task against the current repository in the context of Workstream AH — Hierarchy SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T406 — Apply Canonical Metadata Factory to All Stack Pages


**Execution:** Execute this task against the current repository in the context of Workstream AH — Hierarchy SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T407 — Apply Canonical Metadata Factory to All Pillar Pages


**Execution:** Execute this task against the current repository in the context of Workstream AH — Hierarchy SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T408 — Apply Canonical Metadata Factory to All Module Pages


**Execution:** Execute this task against the current repository in the context of Workstream AH — Hierarchy SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T409 — Apply Canonical Indexability Policy


**Execution:** Execute this task against the current repository in the context of Workstream AH — Hierarchy SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T410 — Apply Canonical URL Generation


**Execution:** Execute this task against the current repository in the context of Workstream AH — Hierarchy SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T411 — Apply Canonical Breadcrumb Schema


**Execution:** Execute this task against the current repository in the context of Workstream AH — Hierarchy SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T412 — Apply Sitemap Participation Rules


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T413 — Prevent Duplicate Titles Across Hierarchy Levels


**Execution:** Execute this task against the current repository in the context of Workstream AH — Hierarchy SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T414 — Prevent Duplicate Descriptions Across Hierarchy Levels


**Execution:** Execute this task against the current repository in the context of Workstream AH — Hierarchy SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T415 — Prevent Thin Hierarchy Pages from Sitemap Inclusion


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T416 — Prevent Noindex Hierarchy Pages from Sitemap Inclusion


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T417 — Ensure Every Sitemap Hierarchy URL Resolves to Canonical 200


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AI — Programmatic Hierarchy SEO Quality

## P05-T418 — Ensure Every Domain Page Has Distinct Purpose


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T419 — Ensure Every Stack Page Has Distinct Purpose


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T420 — Ensure Every Pillar Page Has Distinct Purpose


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T421 — Ensure Every Module Page Has Distinct Purpose


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T422 — Prevent Template-Only Page Differentiation


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T423 — Prevent Automatically Generated Filler Copy


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T424 — Prevent Taxonomy Explosion


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T425 — Merge Redundant Taxonomy Entities


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P05-T426 — Noindex Incomplete Hierarchy Entities


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T427 — Require Useful Child Discovery


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T428 — Require Meaningful Visible Context


**Execution:** Execute this task against the current repository in the context of Workstream AI — Programmatic Hierarchy SEO Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AJ — Hierarchy Sitemap Migration

## P05-T429 — Generate Domain Sitemap Entries from Canonical Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T430 — Generate Stack Sitemap Entries from Canonical Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T431 — Generate Pillar Sitemap Entries from Canonical Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T432 — Generate Module Sitemap Entries from Canonical Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T433 — Validate Hierarchy Sitemap Counts


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T434 — Detect Missing Hierarchy Sitemap Entries


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T435 — Detect Duplicate Hierarchy Sitemap Entries


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T436 — Detect Redirecting Hierarchy Sitemap URLs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T437 — Detect 404 Hierarchy Sitemap URLs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T438 — Detect Noindex Hierarchy Sitemap URLs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AK — Hierarchy Legacy Migration

## P05-T439 — Inventory Legacy Domain Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T440 — Inventory Legacy Stack Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T441 — Inventory Legacy Pillar Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T442 — Inventory Legacy Module Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T443 — Map Legacy Domains to Canonical Domains


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T444 — Map Legacy Stacks to Canonical Stacks


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T445 — Map Legacy Pillars to Canonical Pillars


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T446 — Map Legacy Modules to Canonical Modules


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T447 — Preserve Valuable Existing URLs Where Possible


**Execution:** Execute this task against the current repository in the context of Workstream AK — Hierarchy Legacy Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T448 — Redirect Changed Legacy URLs


**Execution:** Execute this task against the current repository in the context of Workstream AK — Hierarchy Legacy Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T449 — Remove Duplicate Legacy Routes


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T450 — Remove Legacy Hierarchy Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T451 — Remove Legacy Hierarchy CSS


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T452 — Remove Legacy Hierarchy Data Utilities


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T453 — Remove Legacy Hierarchy Metadata Logic


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T454 — Prevent Legacy Hierarchy Reintroduction


**Execution:** Execute this task against the current repository in the context of Workstream AK — Hierarchy Legacy Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AL — Representative Domain Migration

## P05-T455 — Select Representative Domain

Use a mature content domain.

**Execution:** Execute this task against the current repository in the context of Workstream AL — Representative Domain Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use a mature content domain. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T456 — Migrate Representative Domain Page


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P05-T457 — Validate Domain UI Architecture


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T458 — Validate Domain SEO Architecture


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T459 — Validate Domain Internal Linking


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T460 — Validate Domain Mobile Experience


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T461 — Fix Root Domain Template Defects


**Execution:** Execute this task against the current repository in the context of Workstream AL — Representative Domain Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AM — Representative Stack Migration

## P05-T462 — Select Java Backend as Primary Representative Stack

Use the mature Java Backend hierarchy to validate the V2 system.

**Execution:** Execute this task against the current repository in the context of Workstream AM — Representative Stack Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use the mature Java Backend hierarchy to validate the V2 system. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T463 — Migrate Java Backend Stack Page


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P05-T464 — Validate Java Backend Pillar Discovery


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T465 — Validate Java Backend Progression Clarity


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T466 — Validate Java Backend SEO


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T467 — Validate Java Backend Mobile Experience


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T468 — Fix Root Stack Template Defects


**Execution:** Execute this task against the current repository in the context of Workstream AM — Representative Stack Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AN — Representative Pillar Migration

## P05-T469 — Select Representative Java Backend Pillar

Choose a mature pillar with multiple modules.

**Execution:** Execute this task against the current repository in the context of Workstream AN — Representative Pillar Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Choose a mature pillar with multiple modules. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T470 — Migrate Representative Pillar Page


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P05-T471 — Validate Module Discovery


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T472 — Validate Pillar SEO


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T473 — Validate Pillar Internal Linking


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T474 — Validate Pillar Mobile Experience


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T475 — Fix Root Pillar Template Defects


**Execution:** Execute this task against the current repository in the context of Workstream AN — Representative Pillar Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AO — Representative Module Migration

## P05-T476 — Select Representative Large Module

Use a module with enough questions to expose scale issues.

**Execution:** Execute this task against the current repository in the context of Workstream AO — Representative Module Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use a module with enough questions to expose scale issues. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T477 — Migrate Representative Module Page


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P05-T478 — Validate Large Question List Performance


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T479 — Validate Question Scannability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T480 — Validate Module SEO


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T481 — Validate Module Internal Linking


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T482 — Validate Module Mobile Experience


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T483 — Fix Root Module Template Defects


**Execution:** Execute this task against the current repository in the context of Workstream AO — Representative Module Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AP — Cross-Domain Extensibility

## P05-T484 — Validate Hierarchy with Software Engineering


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T485 — Validate Hierarchy with Data Analytics


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P05-T486 — Validate Hierarchy with Management Consulting


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P05-T487 — Identify Software-Specific Assumptions


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T488 — Remove Technology-Only Naming Assumptions


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P05-T489 — Support Non-Code Modules


**Execution:** Execute this task against the current repository in the context of Workstream AP — Cross-Domain Extensibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T490 — Support Case Interview Modules


**Execution:** Execute this task against the current repository in the context of Workstream AP — Cross-Domain Extensibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T491 — Support Behavioral Modules


**Execution:** Execute this task against the current repository in the context of Workstream AP — Cross-Domain Extensibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T492 — Preserve One Shared Discovery Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AP — Cross-Domain Extensibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AQ — Hierarchy Quality Validation

## P05-T493 — Validate Domain Page Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T494 — Validate Stack Page Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T495 — Validate Pillar Page Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T496 — Validate Module Page Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T497 — Validate Hierarchy Navigation Clarity


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T498 — Validate Parent-Child Relationships


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T499 — Validate Breadcrumb Accuracy


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T500 — Validate Internal Link Integrity


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T501 — Validate Crawl Depth


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T502 — Validate No Orphan Indexable Entities


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T503 — Validate No Empty Indexable Hierarchy Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T504 — Validate No Duplicate Canonical Hierarchy URLs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T505 — Validate No Hierarchy Sitemap Conflicts


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AR — Hierarchy UX Validation

## P05-T506 — Test “I Want to Prepare for Java Backend”


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T507 — Test “I Want to Learn Spring Boot”


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T508 — Test “I Want Questions About Spring Security”


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T509 — Test “I Know the Exact Topic I Need”


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T510 — Test “I Am Exploring Without Knowing Where to Start”


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T511 — Test New User Navigation


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T512 — Test Returning User Navigation


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T513 — Test Anonymous User Navigation


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T514 — Test Mobile Navigation Through Entire Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T515 — Test Back Navigation Through Entire Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T516 — Test Direct Search Arrival on a Deep Page


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T517 — Ensure Deep Search Visitors Understand Where They Are


**Execution:** Execute this task against the current repository in the context of Workstream AR — Hierarchy UX Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AS — Hierarchy Performance Validation

## P05-T518 — Measure Domain Page Performance


**Execution:** Execute this task against the current repository in the context of Workstream AS — Hierarchy Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T519 — Measure Stack Page Performance


**Execution:** Execute this task against the current repository in the context of Workstream AS — Hierarchy Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T520 — Measure Pillar Page Performance


**Execution:** Execute this task against the current repository in the context of Workstream AS — Hierarchy Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T521 — Measure Module Page Performance


**Execution:** Execute this task against the current repository in the context of Workstream AS — Hierarchy Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T522 — Measure Large Question List Rendering


**Execution:** Execute this task against the current repository in the context of Workstream AS — Hierarchy Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T523 — Measure Hierarchy Data Payload


**Execution:** Execute this task against the current repository in the context of Workstream AS — Hierarchy Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T524 — Measure Client JavaScript Cost


**Execution:** Execute this task against the current repository in the context of Workstream AS — Hierarchy Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T525 — Measure Layout Shift


**Execution:** Execute this task against the current repository in the context of Workstream AS — Hierarchy Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T526 — Fix Root Hierarchy Performance Problems


**Execution:** Execute this task against the current repository in the context of Workstream AS — Hierarchy Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AT — Hierarchy Regression Protection

## P05-T527 — Add Hierarchy Resolver Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T528 — Add Parent-Child Relationship Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T529 — Add Hierarchy Route Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T530 — Add Hierarchy Canonical Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T531 — Add Hierarchy Sitemap Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T532 — Add Empty Hierarchy Page Protection


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T533 — Add Broken Child Link Detection


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T534 — Add Orphan Entity Detection


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T535 — Add Duplicate Taxonomy Detection


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P05-T536 — Add Question List Rendering Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P05-T537 — Add Mobile Hierarchy Regression Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

# Workstream AU — Phase 05 Completion

## P05-T538 — Freeze Canonical Domain Page Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T539 — Freeze Canonical Stack Page Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T540 — Freeze Canonical Pillar Page Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T541 — Freeze Canonical Module Page Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T542 — Freeze Canonical Question List Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T543 — Freeze Canonical Hierarchy Data Contract


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T544 — Freeze Canonical Hierarchy Navigation Contract


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T545 — Freeze Canonical Hierarchy SEO Contract


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T546 — Publish Hierarchy Component Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P05-T547 — Publish Legacy-to-V2 Hierarchy Migration Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P05-T548 — Update V2 Technical Implementation Plan


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P05-T549 — Update V2 Decision Log


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T550 — Update V2 Issue Log


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P05-T551 — Produce Phase 05 Completion Report

Document:

* taxonomy architecture,
* data contracts,
* domain architecture,
* stack architecture,
* pillar architecture,
* module architecture,
* question list architecture,
* internal linking,
* SEO,
* sitemap participation,
* backend dependencies,
* legacy migration.

**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document: taxonomy architecture, data contracts, domain architecture, stack architecture, pillar architecture, module architecture, question list architecture, internal linking, SEO, sitemap participation, backend dependencies, legacy migration. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P05-T552 — Approve Hierarchy Foundation for Question Experience Migration


**Execution:** Execute this task against the current repository in the context of Workstream AU — Phase 05 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: # Phase 05 Exit Criteria Phase 05 is complete when Interview Explainer has: one canonical content hierarchy, one canonical domain model, one canonical stack model, one canonical pillar model, one canonical module model, explicit question relationships, no major orphan hierarchy entities, canonical hierarchy URLs, correct hierarchy 404 behavior, correct legacy redirects, one domain-page architecture, one stack-page ar Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Phase 05 Exit Criteria

Phase 05 is complete when Interview Explainer has:

* one canonical content hierarchy,
* one canonical domain model,
* one canonical stack model,
* one canonical pillar model,
* one canonical module model,
* explicit question relationships,
* no major orphan hierarchy entities,
* canonical hierarchy URLs,
* correct hierarchy 404 behavior,
* correct legacy redirects,
* one domain-page architecture,
* one stack-page architecture,
* one pillar-page architecture,
* one module-page architecture,
* one scalable question-list architecture,
* canonical breadcrumbs,
* contextual hierarchy navigation,
* strong internal linking,
* controlled crawl depth,
* server-rendered child links,
* mobile-friendly hierarchy navigation,
* SEO-safe taxonomy pages,
* sitemap participation based on page quality,
* backend contracts supporting stable public hierarchy,
* no requirement to load full answers on discovery pages.

---

# Phase 05 Core Principle

```text
THE HIERARCHY SHOULD ANSWER
ONE QUESTION AT EACH LEVEL

DOMAIN
What broad area am I preparing for?

STACK
What preparation track am I following?

PILLAR
What major competency am I learning?

MODULE
What focused topic am I studying?

QUESTION
What exact concept am I understanding?
```

The intended transformation is:

```text
CURRENT RISK

Large content library
Too many cards
Too much metadata
Taxonomy exposed everywhere
Users unsure where they are
Deep questions difficult to discover
Potential orphan pages
Hierarchy pages with unclear purpose
SEO pages created without enough value

        ↓

V2

Clear progressive discovery
One purpose per hierarchy level
Canonical parent-child relationships
Calm hub pages
Scannable question lists
Strong breadcrumbs
Contextual navigation
Server-visible links
Controlled crawl depth
Meaningful SEO landing pages
Scalable support for 10,000+ questions
```

---

# Critical Rule for Interview Explainer

The hierarchy must not be designed only around the current Java Backend structure.

Java Backend is the best **reference implementation** because it already has deep content:

```text
18+ pillars
        ↓
many modules
        ↓
30–50 questions per module
        ↓
thousands of interview questions
```

But the architecture must also support:

```text
DATA ANALYST

Domain
    ↓
Role / Preparation Track
    ↓
Competency Area
    ↓
Focused Topic
    ↓
Interview Question
```

And:

```text
MANAGEMENT CONSULTING

Domain
    ↓
Interview Track
    ↓
Case Category
    ↓
Case Skill / Framework
    ↓
Interview Prompt
```

The labels displayed to users may eventually differ by domain.

The underlying architecture should remain stable.

---

# Important Architecture Boundary

Phase 05 owns:

* discovery hierarchy,
* taxonomy pages,
* parent-child navigation,
* module question lists.

Phase 05 does **not** own the detailed individual question reading experience.

That is the next phase.

---

# Next Phase

```text
PHASE 06

INDIVIDUAL QUESTION PAGE
&
INTERVIEW ANSWER READING EXPERIENCE
```

Phase 06 is one of the most important V2 phases.

It will rebuild the page where the user actually consumes the product:

```text
QUESTION
    ↓
DIRECT ANSWER
    ↓
DEEP EXPLANATION
    ↓
EXAMPLE / CODE / FRAMEWORK
    ↓
INTERVIEW CONTEXT
    ↓
FOLLOW-UP QUESTIONS
    ↓
RELATED LEARNING
```

The phase should focus heavily on the problem already identified in the current website:

* answer pages feel dense,
* too many boxes compete with the answer,
* typography does not create enough reading rhythm,
* sidebars can compete with the main content,
* long answers become walls of text,
* short answers may feel underdeveloped,
* code and explanation need stronger hierarchy,
* interview-specific usefulness must remain central.

Phase 06 will focus on the **presentation architecture and reading experience of answers**, while the separate later content-quality phase can improve the actual answer language, depth and substance at scale.
