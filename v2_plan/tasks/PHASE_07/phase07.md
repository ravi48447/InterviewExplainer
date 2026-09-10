# PHASE 07 — GLOBAL SEARCH, DISCOVERY & CONTENT RETRIEVAL SYSTEM

---

# Phase Objective

Rebuild Interview Explainer search from the root level so users can quickly find the exact:

* domain,
* interview track,
* technology,
* stack,
* pillar,
* module,
* topic,
* interview question,
* company,
* role,
* resource,

they need.

The search system must support a content library that can grow from:

```text
10,000+ QUESTIONS
        ↓
50,000+ QUESTIONS
        ↓
MULTIPLE INTERVIEW DOMAINS
        ↓
MULTIPLE CONTENT TYPES
```

without becoming:

* slow,
* noisy,
* confusing,
* expensive,
* dependent on one frontend component,
* dependent on browser-only filtering,
* harmful to SEO.

The canonical discovery architecture is:

```text
USER KNOWS WHERE TO GO
        ↓
HIERARCHY NAVIGATION

USER KNOWS WHAT THEY WANT
        ↓
SEARCH

USER KNOWS THE CONCEPT
BUT NOT THE EXACT NAME
        ↓
SEARCH + RELEVANCE

USER DOES NOT KNOW
WHAT TO STUDY NEXT
        ↓
GUIDED DISCOVERY
```

Search must complement the hierarchy.

It must not replace it.

---

# Core Search Principle

```text
SEARCH SHOULD REDUCE
THE DISTANCE BETWEEN INTENT
AND THE CORRECT CANONICAL PAGE
```

The user should not need to know:

* the exact taxonomy,
* the exact URL,
* the exact question wording,
* the exact capitalization,
* the exact slug,
* the internal content structure.

Examples:

```text
"spring security jwt"
```

should help the user reach:

* the relevant Spring Security module,
* JWT authentication questions,
* related security questions.

```text
"hashmap"
```

should surface:

* HashMap questions,
* Java Collections context,
* relevant modules.

```text
"profitability case"
```

should eventually surface:

* Management Consulting,
* Case Interviews,
* Profitability,
* relevant frameworks and questions.

---

# Critical Search Boundary

Phase 07 owns:

* global search entry points,
* search interface,
* search data model,
* searchable content contracts,
* query normalization,
* result retrieval,
* result ranking,
* result grouping,
* autocomplete,
* suggestions,
* typo handling,
* keyboard interaction,
* mobile search,
* search backend,
* search performance,
* search analytics,
* search failure handling,
* SEO policy for search pages.

Phase 07 does not own:

* rewriting weak question content,
* AI-generated answers,
* chatbot functionality,
* semantic RAG answers,
* conversational interview coaching.

Those may use the search infrastructure later but are separate product systems.

---

# Workstream A — Search Product Definition

## P07-T001 — Define Search Primary Job

Find the most relevant canonical Interview Explainer content.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Find the most relevant canonical Interview Explainer content. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T002 — Define Search Secondary Job

Help users recover when their original query does not exactly match existing content.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Help users recover when their original query does not exactly match existing content. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T003 — Define Search as Navigation Infrastructure


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T004 — Prevent Search from Becoming a Second Content Database


**Execution:** Execute this task against the current repository in the context of Workstream A — Search Product Definition, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T005 — Define Global Search Scope


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T006 — Define Question Search Scope


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T007 — Define Taxonomy Search Scope


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T008 — Define Company Search Scope


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T009 — Define Role Search Scope


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T010 — Define Resource Search Scope


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P07-T011 — Define Search Success Criteria


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T012 — Define Search Failure Criteria


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T013 — Define Search Latency Target


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T014 — Define Search Result Quality Target


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T015 — Define Search Scalability Target


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream B — Current Search Audit

## P07-T016 — Inventory Current Search Entry Points


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T017 — Inventory Current Search Components


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T018 — Inventory Current Search APIs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T019 — Inventory Current Client-Side Search Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T020 — Inventory Current Server-Side Search Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T021 — Inventory Current Search Data Sources


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T022 — Identify Duplicate Search Implementations


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T023 — Identify Browser-Side Full Dataset Loading


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T024 — Identify Search Performance Bottlenecks


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T025 — Identify Search Relevance Problems


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T026 — Identify Search Mobile Problems


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T027 — Identify Search Accessibility Problems


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T028 — Identify Search SEO Risks


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T029 — Identify Search Analytics Gaps


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T030 — Produce Current Search Architecture Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream C — Canonical Searchable Entity Model

## P07-T031 — Define Searchable Domain Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T032 — Define Searchable Stack Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T033 — Define Searchable Pillar Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T034 — Define Searchable Module Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T035 — Define Searchable Question Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T036 — Define Searchable Company Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T037 — Define Searchable Role Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T038 — Define Searchable Resource Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P07-T039 — Define Search Entity Type


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T040 — Define Stable Search Entity ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T041 — Define Search Display Title


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T042 — Define Search Canonical URL


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T043 — Define Search Context Path

Example:

```text
Java Backend
→ Spring Boot
→ Spring Security
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Example: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T044 — Define Search Description Field


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T045 — Define Search Keywords Field


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T046 — Define Search Alias Field


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T047 — Define Search Acronym Field


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T048 — Define Search Publication State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T049 — Define Search Indexability State Separately from Searchability

A page may be searchable internally without necessarily being indexable externally.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: A page may be searchable internally without necessarily being indexable externally. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T050 — Define Search Ranking Signals


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream D — Canonical Search Document Contract

## P07-T051 — Build One Canonical Search Document Schema


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T052 — Include Stable Entity ID


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T053 — Include Entity Type


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T054 — Include Display Title


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T055 — Include Normalized Title


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P07-T056 — Include Canonical URL


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T057 — Include Hierarchy Context


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T058 — Include Searchable Keywords


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T059 — Include Aliases


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T060 — Include Acronyms


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T061 — Include Content Type


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T062 — Include Publication State


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T063 — Include Search Weight Signals


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T064 — Avoid Full Answer Payload in Lightweight Autocomplete Index


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical Search Document Contract, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T065 — Define Separate Full-Text Search Payload if Required


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T066 — Version Search Document Contract


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream E — Search Source of Truth

## P07-T067 — Define Canonical Search Source


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T068 — Generate Search Documents from Canonical Content Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T069 — Prevent Manual Duplicate Search Databases


**Execution:** Execute this task against the current repository in the context of Workstream E — Search Source of Truth, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T070 — Prevent Search Titles from Drifting from Page Titles


**Execution:** Execute this task against the current repository in the context of Workstream E — Search Source of Truth, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T071 — Prevent Search URLs from Drifting from Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream E — Search Source of Truth, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T072 — Prevent Deleted Content from Remaining Searchable


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T073 — Prevent Draft Content from Appearing in Public Search


**Execution:** Execute this task against the current repository in the context of Workstream E — Search Source of Truth, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T074 — Prevent Broken Entities from Appearing in Search


**Execution:** Execute this task against the current repository in the context of Workstream E — Search Source of Truth, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T075 — Define Search Index Refresh Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T076 — Define Incremental Search Update Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T077 — Define Full Search Rebuild Strategy


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P07-T078 — Define Search Index Validation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream F — Search Technology Decision

## P07-T079 — Measure Actual Current Search Scale


**Execution:** Execute this task against the current repository in the context of Workstream F — Search Technology Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T080 — Estimate 12-Month Search Scale


**Execution:** Execute this task against the current repository in the context of Workstream F — Search Technology Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T081 — Estimate Multi-Domain Search Scale


**Execution:** Execute this task against the current repository in the context of Workstream F — Search Technology Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T082 — Evaluate Database Full-Text Search


**Execution:** Execute this task against the current repository in the context of Workstream F — Search Technology Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T083 — Evaluate Lightweight In-Application Search


**Execution:** Execute this task against the current repository in the context of Workstream F — Search Technology Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T084 — Evaluate Dedicated Search Engine Only if Required


**Execution:** Execute this task against the current repository in the context of Workstream F — Search Technology Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T085 — Avoid Premature Search Infrastructure Complexity


**Execution:** Execute this task against the current repository in the context of Workstream F — Search Technology Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T086 — Avoid Browser-Only Full Dataset Search at Large Scale


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T087 — Document Search Technology Decision


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T088 — Define Migration Path if Search Scale Grows


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream G — Query Normalization

## P07-T089 — Normalize Leading and Trailing Whitespace


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P07-T090 — Normalize Repeated Whitespace


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P07-T091 — Normalize Case


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P07-T092 — Define Punctuation Handling


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T093 — Define Hyphen Handling


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T094 — Define Dot and Symbol Handling for Technology Names

Examples:

```text
.NET
C++
C#
Node.js
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Examples: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T095 — Preserve Meaningful Technical Symbols


**Execution:** Execute this task against the current repository in the context of Workstream G — Query Normalization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T096 — Define Apostrophe Handling


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T097 — Define Slash Handling


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T098 — Define Unicode Normalization


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T099 — Prevent Empty Normalized Queries


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P07-T100 — Define Maximum Query Length


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream H — Technical Terminology Handling

## P07-T101 — Support Exact Technology Names


**Execution:** Execute this task against the current repository in the context of Workstream H — Technical Terminology Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T102 — Support Common Abbreviations

Examples:

```text
OOP
JVM
JPA
JWT
REST
SQL
DSA
CI/CD
```

**Execution:** Execute this task against the current repository in the context of Workstream H — Technical Terminology Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Examples: Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T103 — Support Expanded Forms


**Execution:** Execute this task against the current repository in the context of Workstream H — Technical Terminology Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T104 — Support Common Alternative Spellings


**Execution:** Execute this task against the current repository in the context of Workstream H — Technical Terminology Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T105 — Support Technology Aliases


**Execution:** Execute this task against the current repository in the context of Workstream H — Technical Terminology Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T106 — Support Framework Versions Without Breaking Base Search


**Execution:** Execute this task against the current repository in the context of Workstream H — Technical Terminology Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T107 — Avoid Aggressive Normalization that Changes Technical Meaning


**Execution:** Execute this task against the current repository in the context of Workstream H — Technical Terminology Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T108 — Maintain Curated Technical Alias Dictionary


**Execution:** Execute this task against the current repository in the context of Workstream H — Technical Terminology Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T109 — Generate Alias Candidates from Search Analytics


**Execution:** Execute this task against the current repository in the context of Workstream H — Technical Terminology Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P07-T110 — Require Review Before Promoting High-Impact Aliases


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream I — Query Intent Classification

## P07-T111 — Identify Exact Question Intent


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T112 — Identify Topic Intent


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T113 — Identify Technology Intent


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T114 — Identify Stack Intent


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T115 — Identify Company Intent


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T116 — Identify Role Intent


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T117 — Keep Intent Classification Lightweight Initially


**Execution:** Execute this task against the current repository in the context of Workstream I — Query Intent Classification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T118 — Avoid Mandatory AI Calls for Every Search


**Execution:** Execute this task against the current repository in the context of Workstream I — Query Intent Classification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T119 — Use Deterministic Signals Where Sufficient


**Execution:** Execute this task against the current repository in the context of Workstream I — Query Intent Classification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T120 — Allow Future Semantic Enhancement


**Execution:** Execute this task against the current repository in the context of Workstream I — Query Intent Classification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

# Workstream J — Exact Match Ranking

## P07-T121 — Rank Exact Title Matches Highly


**Execution:** Execute this task against the current repository in the context of Workstream J — Exact Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T122 — Rank Exact Technology Matches Highly


**Execution:** Execute this task against the current repository in the context of Workstream J — Exact Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T123 — Rank Exact Module Matches Highly


**Execution:** Execute this task against the current repository in the context of Workstream J — Exact Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T124 — Rank Exact Question Matches Highly


**Execution:** Execute this task against the current repository in the context of Workstream J — Exact Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T125 — Rank Exact Alias Matches Appropriately


**Execution:** Execute this task against the current repository in the context of Workstream J — Exact Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T126 — Rank Exact Acronym Matches Appropriately


**Execution:** Execute this task against the current repository in the context of Workstream J — Exact Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T127 — Avoid Popularity Overriding Strong Exact Matches


**Execution:** Execute this task against the current repository in the context of Workstream J — Exact Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T128 — Avoid Question Volume Overwhelming Taxonomy Results


**Execution:** Execute this task against the current repository in the context of Workstream J — Exact Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream K — Partial Match Ranking

## P07-T129 — Support Prefix Matching


**Execution:** Execute this task against the current repository in the context of Workstream K — Partial Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T130 — Support Word-Level Matching


**Execution:** Execute this task against the current repository in the context of Workstream K — Partial Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T131 — Support Multi-Token Queries


**Execution:** Execute this task against the current repository in the context of Workstream K — Partial Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T132 — Reward More Query Tokens Matching


**Execution:** Execute this task against the current repository in the context of Workstream K — Partial Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T133 — Reward Title Matches Over Deep Body Matches


**Execution:** Execute this task against the current repository in the context of Workstream K — Partial Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T134 — Reward Hierarchy Context Matches


**Execution:** Execute this task against the current repository in the context of Workstream K — Partial Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T135 — Avoid Weak Single-Token Noise Dominating Results


**Execution:** Execute this task against the current repository in the context of Workstream K — Partial Match Ranking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T136 — Define Minimum Relevance Threshold


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream L — Typo Tolerance

## P07-T137 — Define Typo Tolerance Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T138 — Support Minor Misspellings


**Execution:** Execute this task against the current repository in the context of Workstream L — Typo Tolerance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T139 — Protect Short Technical Acronyms from Overcorrection


**Execution:** Execute this task against the current repository in the context of Workstream L — Typo Tolerance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T140 — Protect Technology Names from Incorrect Autocorrection


**Execution:** Execute this task against the current repository in the context of Workstream L — Typo Tolerance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T141 — Define Edit Distance Thresholds


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T142 — Prefer Exact Results Before Fuzzy Results


**Execution:** Execute this task against the current repository in the context of Workstream L — Typo Tolerance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T143 — Label Corrected Search Intent Where Useful


**Execution:** Execute this task against the current repository in the context of Workstream L — Typo Tolerance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P07-T144 — Avoid Silent Destructive Query Rewriting


**Execution:** Execute this task against the current repository in the context of Workstream L — Typo Tolerance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream M — Search Result Ranking Model

## P07-T145 — Define Ranking Signal Hierarchy

Potential order:

```text
Exact title match
Exact alias match
Strong prefix match
Multi-token title match
Hierarchy context match
Keyword match
Body/content match
Popularity or engagement
Freshness where relevant
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Potential order: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T146 — Weight Entity Type Appropriately


**Execution:** Execute this task against the current repository in the context of Workstream M — Search Result Ranking Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T147 — Prevent Questions from Always Dominating Results


**Execution:** Execute this task against the current repository in the context of Workstream M — Search Result Ranking Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T148 — Prevent Broad Domains from Always Dominating Results


**Execution:** Execute this task against the current repository in the context of Workstream M — Search Result Ranking Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T149 — Define Popularity Signal Carefully


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P07-T150 — Define Freshness Signal Carefully

Interview concepts are often evergreen.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Interview concepts are often evergreen. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P07-T151 — Prevent Recency from Damaging Evergreen Relevance


**Execution:** Execute this task against the current repository in the context of Workstream M — Search Result Ranking Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T152 — Make Ranking Deterministic Where Possible


**Execution:** Execute this task against the current repository in the context of Workstream M — Search Result Ranking Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T153 — Document Ranking Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream N — Search Result Grouping

## P07-T154 — Define Whether Results Should Be Grouped


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T155 — Support “Topics” Group


**Execution:** Execute this task against the current repository in the context of Workstream N — Search Result Grouping, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T156 — Support “Modules” Group


**Execution:** Execute this task against the current repository in the context of Workstream N — Search Result Grouping, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T157 — Support “Questions” Group


**Execution:** Execute this task against the current repository in the context of Workstream N — Search Result Grouping, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T158 — Support “Companies” Group


**Execution:** Execute this task against the current repository in the context of Workstream N — Search Result Grouping, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T159 — Support “Roles” Group


**Execution:** Execute this task against the current repository in the context of Workstream N — Search Result Grouping, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T160 — Avoid Excessive Result Categories


**Execution:** Execute this task against the current repository in the context of Workstream N — Search Result Grouping, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T161 — Prioritize Most Relevant Groups


**Execution:** Execute this task against the current repository in the context of Workstream N — Search Result Grouping, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T162 — Define Cross-Type Result Limit


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T163 — Prevent Empty Group Headers


**Execution:** Execute this task against the current repository in the context of Workstream N — Search Result Grouping, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T164 — Prevent Grouping from Hiding the Best Result


**Execution:** Execute this task against the current repository in the context of Workstream N — Search Result Grouping, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream O — Global Search Entry Point

## P07-T165 — Define Global Header Search Entry


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T166 — Make Search Easy to Find


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Search Entry Point, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T167 — Prevent Search from Dominating Every Page


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Search Entry Point, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T168 — Define Desktop Search Trigger


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T169 — Define Mobile Search Trigger


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T170 — Define Keyboard Shortcut Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T171 — Display Keyboard Shortcut Only Where Supported


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Search Entry Point, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T172 — Avoid Search Trigger Duplication


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Search Entry Point, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T173 — Keep Header Search Consistent Across Public Pages


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Search Entry Point, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream P — Search Overlay Architecture

## P07-T174 — Define Search Overlay Pattern


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T175 — Define Search Dialog Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T176 — Define Search Input Placement


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T177 — Define Results Area


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T178 — Define Initial Empty State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T179 — Define Loading State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T180 — Define Results State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T181 — Define No-Results State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T182 — Define Error State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T183 — Define Close Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T184 — Define Escape-Key Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T185 — Define Outside-Click Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T186 — Define Focus Restoration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T187 — Prevent Background Scroll While Modal Search Is Active


**Execution:** Execute this task against the current repository in the context of Workstream P — Search Overlay Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Q — Search Input Design

## P07-T188 — Build Canonical Search Input


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T189 — Define Search Placeholder

Keep it useful and concise.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Keep it useful and concise. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T190 — Avoid Rotating Placeholder Marketing Text


**Execution:** Execute this task against the current repository in the context of Workstream Q — Search Input Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T191 — Define Search Icon Treatment


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T192 — Define Clear Query Action


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T193 — Define Loading Indicator


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T194 — Avoid Excessive Input Decoration


**Execution:** Execute this task against the current repository in the context of Workstream Q — Search Input Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T195 — Ensure Search Input Focus Visibility


**Execution:** Execute this task against the current repository in the context of Workstream Q — Search Input Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T196 — Ensure Mobile Keyboard Compatibility


**Execution:** Execute this task against the current repository in the context of Workstream Q — Search Input Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T197 — Prevent Browser Autofill from Breaking Search UI


**Execution:** Execute this task against the current repository in the context of Workstream Q — Search Input Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream R — Search Result Item Design

## P07-T198 — Build Canonical Search Result Item


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T199 — Make Result Title Primary


**Execution:** Execute this task against the current repository in the context of Workstream R — Search Result Item Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T200 — Show Entity Type Subtly


**Execution:** Execute this task against the current repository in the context of Workstream R — Search Result Item Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T201 — Show Hierarchy Context


**Execution:** Execute this task against the current repository in the context of Workstream R — Search Result Item Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T202 — Show Short Supporting Text Only Where Useful


**Execution:** Execute this task against the current repository in the context of Workstream R — Search Result Item Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T203 — Avoid Full Answer Previews


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T204 — Avoid Excessive Metadata


**Execution:** Execute this task against the current repository in the context of Workstream R — Search Result Item Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T205 — Avoid One Heavy Card per Search Result


**Execution:** Execute this task against the current repository in the context of Workstream R — Search Result Item Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T206 — Define Hover State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T207 — Define Keyboard Active State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T208 — Define Focus State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T209 — Ensure Entire Result Is Navigable


**Execution:** Execute this task against the current repository in the context of Workstream R — Search Result Item Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T210 — Use Canonical Destination URL


**Execution:** Execute this task against the current repository in the context of Workstream R — Search Result Item Design, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream S — Search Keyboard Navigation

## P07-T211 — Focus Search Input on Open


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T212 — Support Arrow Down Navigation


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T213 — Support Arrow Up Navigation


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T214 — Support Enter to Open Active Result


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T215 — Support Escape to Close


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T216 — Maintain Visible Active Result


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T217 — Prevent Focus Escape from Modal Search


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T218 — Restore Focus After Close


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T219 — Support Screen Reader Result Announcements


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T220 — Avoid Custom Keyboard Behavior That Conflicts with Native Input


**Execution:** Execute this task against the current repository in the context of Workstream S — Search Keyboard Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream T — Search Debouncing and Request Control

## P07-T221 — Define Minimum Query Length


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T222 — Define Search Debounce Duration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T223 — Cancel Obsolete Search Requests


**Execution:** Execute this task against the current repository in the context of Workstream T — Search Debouncing and Request Control, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T224 — Prevent Out-of-Order Response Replacement


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P07-T225 — Prevent One Request per Keystroke Without Control


**Execution:** Execute this task against the current repository in the context of Workstream T — Search Debouncing and Request Control, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T226 — Cache Repeated Queries Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream T — Search Debouncing and Request Control, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T227 — Normalize Cache Keys


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P07-T228 — Define Search Request Timeout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T229 — Handle Slow Search Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream T — Search Debouncing and Request Control, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream U — Initial Search State

## P07-T230 — Define Search State Before Query Entry


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T231 — Consider Recent Searches for Local User Convenience


**Execution:** Execute this task against the current repository in the context of Workstream U — Initial Search State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P07-T232 — Consider Popular Topics


**Execution:** Execute this task against the current repository in the context of Workstream U — Initial Search State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P07-T233 — Consider Major Preparation Tracks


**Execution:** Execute this task against the current repository in the context of Workstream U — Initial Search State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T234 — Avoid Filling Empty State with Marketing Noise


**Execution:** Execute this task against the current repository in the context of Workstream U — Initial Search State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T235 — Avoid Showing Random Questions


**Execution:** Execute this task against the current repository in the context of Workstream U — Initial Search State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T236 — Keep Initial Search State Lightweight


**Execution:** Execute this task against the current repository in the context of Workstream U — Initial Search State, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream V — Autocomplete

## P07-T237 — Define Autocomplete Scope


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T238 — Prioritize Entity Titles


**Execution:** Execute this task against the current repository in the context of Workstream V — Autocomplete, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T239 — Support Technology Names


**Execution:** Execute this task against the current repository in the context of Workstream V — Autocomplete, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T240 — Support Module Names


**Execution:** Execute this task against the current repository in the context of Workstream V — Autocomplete, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T241 — Support Question Titles


**Execution:** Execute this task against the current repository in the context of Workstream V — Autocomplete, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T242 — Support Company Names


**Execution:** Execute this task against the current repository in the context of Workstream V — Autocomplete, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T243 — Limit Autocomplete Result Count


**Execution:** Execute this task against the current repository in the context of Workstream V — Autocomplete, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T244 — Keep Autocomplete Fast


**Execution:** Execute this task against the current repository in the context of Workstream V — Autocomplete, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T245 — Avoid Loading Full Answer Text for Autocomplete


**Execution:** Execute this task against the current repository in the context of Workstream V — Autocomplete, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T246 — Define Autocomplete Ranking Separately if Required


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream W — No-Results Recovery

## P07-T247 — Build Useful No-Results State


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T248 — Show the Original Query


**Execution:** Execute this task against the current repository in the context of Workstream W — No-Results Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T249 — Suggest Removing Excessive Terms


**Execution:** Execute this task against the current repository in the context of Workstream W — No-Results Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T250 — Suggest Corrected Spelling Where Confidence Is High


**Execution:** Execute this task against the current repository in the context of Workstream W — No-Results Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T251 — Suggest Broader Topic Matches


**Execution:** Execute this task against the current repository in the context of Workstream W — No-Results Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T252 — Suggest Relevant Parent Topics


**Execution:** Execute this task against the current repository in the context of Workstream W — No-Results Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T253 — Provide Browse Alternative


**Execution:** Execute this task against the current repository in the context of Workstream W — No-Results Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T254 — Avoid Dead-End “No Results” Screens


**Execution:** Execute this task against the current repository in the context of Workstream W — No-Results Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T255 — Record Genuine Zero-Result Queries


**Execution:** Execute this task against the current repository in the context of Workstream W — No-Results Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream X — Search Error Handling

## P07-T256 — Distinguish No Results from Search Failure


**Execution:** Execute this task against the current repository in the context of Workstream X — Search Error Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T257 — Define Search API Failure State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T258 — Define Search Timeout State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T259 — Provide Retry Action Where Useful


**Execution:** Execute this task against the current repository in the context of Workstream X — Search Error Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T260 — Prevent Technical Errors from Reaching Users


**Execution:** Execute this task against the current repository in the context of Workstream X — Search Error Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T261 — Prevent Search Failure from Breaking Page Navigation


**Execution:** Execute this task against the current repository in the context of Workstream X — Search Error Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T262 — Log Search Failures


**Execution:** Execute this task against the current repository in the context of Workstream X — Search Error Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream Y — Mobile Search Experience

## P07-T263 — Build Dedicated Mobile Search Experience


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T264 — Use Available Mobile Width Effectively


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T265 — Keep Search Input Visible


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T266 — Ensure Mobile Keyboard Does Not Hide Active Results


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T267 — Support Touch-Friendly Result Items


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T268 — Avoid Tiny Metadata


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T269 — Avoid Horizontal Overflow


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T270 — Handle Long Question Titles


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T271 — Handle Mobile Back Navigation Correctly


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T272 — Restore Previous Page State Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T273 — Test Search with Small Mobile Viewports


**Execution:** Execute this task against the current repository in the context of Workstream Y — Mobile Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Z — Search Accessibility

## P07-T274 — Define Search Dialog Semantics


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T275 — Define Search Input Label


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T276 — Define Results List Semantics


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T277 — Define Active Result Semantics


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T278 — Announce Result Count Where Useful


**Execution:** Execute this task against the current repository in the context of Workstream Z — Search Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T279 — Announce No Results


**Execution:** Execute this task against the current repository in the context of Workstream Z — Search Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T280 — Announce Search Errors


**Execution:** Execute this task against the current repository in the context of Workstream Z — Search Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T281 — Validate Keyboard Navigation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T282 — Validate Focus Trap


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T283 — Validate Focus Restoration


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T284 — Validate Screen Reader Experience


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T285 — Validate Colour Contrast


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T286 — Validate Reduced Motion


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AA — Search Backend API

## P07-T287 — Define Canonical Search Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T288 — Define Search Request Contract

Potential input:

```text
query
limit
entity types
context
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Potential input: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T289 — Define Search Response Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T290 — Return Stable Entity IDs


**Execution:** Execute this task against the current repository in the context of Workstream AA — Search Backend API, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T291 — Return Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream AA — Search Backend API, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T292 — Return Display Titles


**Execution:** Execute this task against the current repository in the context of Workstream AA — Search Backend API, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T293 — Return Entity Types


**Execution:** Execute this task against the current repository in the context of Workstream AA — Search Backend API, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T294 — Return Hierarchy Context


**Execution:** Execute this task against the current repository in the context of Workstream AA — Search Backend API, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T295 — Return Minimal Supporting Text


**Execution:** Execute this task against the current repository in the context of Workstream AA — Search Backend API, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T296 — Avoid Returning Full Content Payloads


**Execution:** Execute this task against the current repository in the context of Workstream AA — Search Backend API, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T297 — Define Result Limit


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T298 — Define Pagination Only if Needed


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T299 — Validate Search Input Server-Side


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T300 — Enforce Maximum Query Length Server-Side


**Execution:** Execute this task against the current repository in the context of Workstream AA — Search Backend API, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AB — Search Backend Performance

## P07-T301 — Establish Search API Latency Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T302 — Measure Cold Search Latency


**Execution:** Execute this task against the current repository in the context of Workstream AB — Search Backend Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T303 — Measure Warm Search Latency


**Execution:** Execute this task against the current repository in the context of Workstream AB — Search Backend Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T304 — Optimize Search Queries


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P07-T305 — Add Appropriate Search Indexes


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T306 — Avoid N+1 Search Result Enrichment


**Execution:** Execute this task against the current repository in the context of Workstream AB — Search Backend Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T307 — Avoid Per-Result Database Queries


**Execution:** Execute this task against the current repository in the context of Workstream AB — Search Backend Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T308 — Cache Stable Search Metadata Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AB — Search Backend Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T309 — Define Query Result Caching Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T310 — Define Cache Invalidation Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T311 — Protect Search Backend from Expensive Queries


**Execution:** Execute this task against the current repository in the context of Workstream AB — Search Backend Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T312 — Add Rate Protection Where Required


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

# Workstream AC — Search Security

## P07-T313 — Sanitize Search Input


**Execution:** Execute this task against the current repository in the context of Workstream AC — Search Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T314 — Prevent Query Injection


**Execution:** Execute this task against the current repository in the context of Workstream AC — Search Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T315 — Prevent Raw Search Backend Errors from Reaching Users


**Execution:** Execute this task against the current repository in the context of Workstream AC — Search Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T316 — Prevent Unpublished Content Leakage


**Execution:** Execute this task against the current repository in the context of Workstream AC — Search Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T317 — Prevent Private User Data from Entering Public Search Index


**Execution:** Execute this task against the current repository in the context of Workstream AC — Search Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T318 — Prevent Internal Admin Content from Public Search


**Execution:** Execute this task against the current repository in the context of Workstream AC — Search Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T319 — Validate Search Result URLs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T320 — Prevent Arbitrary Redirect URLs in Search Results


**Execution:** Execute this task against the current repository in the context of Workstream AC — Search Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AD — Contextual Search

## P07-T321 — Define Global Search Context


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T322 — Define Stack-Scoped Search Where Useful


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T323 — Define Pillar-Scoped Search Where Useful


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T324 — Define Module Question Search Where Useful


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T325 — Avoid Building Separate Search Engines per Page Type


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T326 — Reuse Canonical Search Infrastructure


**Execution:** Execute this task against the current repository in the context of Workstream AD — Contextual Search, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T327 — Pass Context as Ranking Signal Rather Than Hard Filter Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AD — Contextual Search, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T328 — Allow User to Escape Context


**Execution:** Execute this task against the current repository in the context of Workstream AD — Contextual Search, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AE — Module-Level Question Filtering

## P07-T329 — Distinguish Search from Local Filtering


**Execution:** Execute this task against the current repository in the context of Workstream AE — Module-Level Question Filtering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T330 — Define Module Question Filter Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T331 — Keep Small Module Lists Unfiltered


**Execution:** Execute this task against the current repository in the context of Workstream AE — Module-Level Question Filtering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T332 — Add Search Only for Large Question Lists


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P07-T333 — Filter Existing Module Question Metadata Efficiently


**Execution:** Execute this task against the current repository in the context of Workstream AE — Module-Level Question Filtering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T334 — Prevent Local Filter State from Creating Indexable URLs


**Execution:** Execute this task against the current repository in the context of Workstream AE — Module-Level Question Filtering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T335 — Prevent Local Filtering from Changing Canonical URL


**Execution:** Execute this task against the current repository in the context of Workstream AE — Module-Level Question Filtering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AF — Search Result Page Decision

## P07-T336 — Determine Whether a Dedicated Search Results Page Is Needed


**Execution:** Execute this task against the current repository in the context of Workstream AF — Search Result Page Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T337 — Avoid Creating Search Pages Solely for SEO


**Execution:** Execute this task against the current repository in the context of Workstream AF — Search Result Page Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T338 — Define Search Results Route if Product Requires It


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T339 — Define Query Parameter Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T340 — Define Search Results Page Canonical Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T341 — Define Search Results Page Robots Policy

Default toward non-indexing unless a deliberate search landing-page strategy exists.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Default toward non-indexing unless a deliberate search landing-page strategy exists. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T342 — Prevent Infinite Indexable Query Combinations


**Execution:** Execute this task against the current repository in the context of Workstream AF — Search Result Page Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T343 — Prevent Search Parameters from Polluting Sitemap


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T344 — Prevent Internal Search Results from Becoming Crawl Traps


**Execution:** Execute this task against the current repository in the context of Workstream AF — Search Result Page Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AG — Search SEO Protection

## P07-T345 — Noindex Internal Search Result Pages by Default


**Execution:** Execute this task against the current repository in the context of Workstream AG — Search SEO Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T346 — Do Not Include Search Result URLs in Sitemap


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T347 — Do Not Use Internal Search Pages as Canonical Topic Pages


**Execution:** Execute this task against the current repository in the context of Workstream AG — Search SEO Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T348 — Route Search Users to Canonical Content Pages


**Execution:** Execute this task against the current repository in the context of Workstream AG — Search SEO Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T349 — Prevent Query Parameters from Creating Duplicate Canonicals


**Execution:** Execute this task against the current repository in the context of Workstream AG — Search SEO Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T350 — Prevent Search Result Snippets from Creating Duplicate Content Pages


**Execution:** Execute this task against the current repository in the context of Workstream AG — Search SEO Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T351 — Keep Search Links Crawlable Where They Point to Canonical Pages


**Execution:** Execute this task against the current repository in the context of Workstream AG — Search SEO Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T352 — Audit Search URLs in Search Engine Indexes


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AH — Search Analytics Architecture

## P07-T353 — Define Search Analytics Events


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T354 — Track Search Submission


**Execution:** Execute this task against the current repository in the context of Workstream AH — Search Analytics Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T355 — Track Result Selection


**Execution:** Execute this task against the current repository in the context of Workstream AH — Search Analytics Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T356 — Track Selected Result Position


**Execution:** Execute this task against the current repository in the context of Workstream AH — Search Analytics Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P07-T357 — Track Zero-Result Queries


**Execution:** Execute this task against the current repository in the context of Workstream AH — Search Analytics Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T358 — Track Search Errors


**Execution:** Execute this task against the current repository in the context of Workstream AH — Search Analytics Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T359 — Track Abandoned Searches Carefully


**Execution:** Execute this task against the current repository in the context of Workstream AH — Search Analytics Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P07-T360 — Avoid Recording Sensitive Raw Queries Without Policy Review


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T361 — Define Search Data Retention Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T362 — Respect Privacy Requirements


**Execution:** Execute this task against the current repository in the context of Workstream AH — Search Analytics Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AI — Search Gap Detection

## P07-T363 — Build Zero-Result Query Report


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P07-T364 — Build Low-Click Query Report


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P07-T365 — Build Repeated Query Report


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P07-T366 — Identify Missing Aliases


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T367 — Identify Missing Content Topics


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T368 — Identify Poorly Named Existing Content


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T369 — Identify Ranking Failures


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T370 — Feed Content Gaps into Future Content Planning


**Execution:** Execute this task against the current repository in the context of Workstream AI — Search Gap Detection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T371 — Feed Taxonomy Problems into Hierarchy Maintenance


**Execution:** Execute this task against the current repository in the context of Workstream AI — Search Gap Detection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AJ — Search Quality Dataset

## P07-T372 — Create Representative Search Query Dataset


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T373 — Include Exact Technology Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T374 — Include Acronym Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T375 — Include Partial Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T376 — Include Misspelled Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T377 — Include Multi-Word Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T378 — Include Exact Question Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T379 — Include Broad Topic Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T380 — Include Ambiguous Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T381 — Include Company Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T382 — Include Role Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T383 — Include Non-Code Domain Queries


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Search Quality Dataset, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AK — Java Backend Search Validation

## P07-T384 — Test “java”


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T385 — Test “spring boot”


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T386 — Test “spring security”


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T387 — Test “jwt”


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T388 — Test “hashmap”


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T389 — Test “concurrent hashmap”


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T390 — Test “jvm memory”


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T391 — Test “rest api”


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T392 — Test “microservices”


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T393 — Test “hibernate”


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T394 — Test Common Misspellings


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T395 — Fix Root Ranking Problems


**Execution:** Execute this task against the current repository in the context of Workstream AK — Java Backend Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AL — Cross-Domain Search Validation

## P07-T396 — Test Software Engineering Queries


**Execution:** Execute this task against the current repository in the context of Workstream AL — Cross-Domain Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T397 — Test Data Analyst Queries


**Execution:** Execute this task against the current repository in the context of Workstream AL — Cross-Domain Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T398 — Test SQL Queries


**Execution:** Execute this task against the current repository in the context of Workstream AL — Cross-Domain Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T399 — Test Data Engineering Queries


**Execution:** Execute this task against the current repository in the context of Workstream AL — Cross-Domain Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T400 — Test DevOps Queries


**Execution:** Execute this task against the current repository in the context of Workstream AL — Cross-Domain Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T401 — Test Behavioral Interview Queries


**Execution:** Execute this task against the current repository in the context of Workstream AL — Cross-Domain Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T402 — Test Management Consulting Queries


**Execution:** Execute this task against the current repository in the context of Workstream AL — Cross-Domain Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T403 — Test Company Queries


**Execution:** Execute this task against the current repository in the context of Workstream AL — Cross-Domain Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T404 — Identify Domain-Specific Ranking Problems


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T405 — Avoid Hardcoding Search Around Java Backend


**Execution:** Execute this task against the current repository in the context of Workstream AL — Cross-Domain Search Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AM — Search UI Density Reduction

## P07-T406 — Limit Visible Result Count


**Execution:** Execute this task against the current repository in the context of Workstream AM — Search UI Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T407 — Reduce Result Metadata


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P07-T408 — Reduce Result Badges


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P07-T409 — Reduce Result Icons


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P07-T410 — Avoid Card Walls


**Execution:** Execute this task against the current repository in the context of Workstream AM — Search UI Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T411 — Use Clear Typography Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream AM — Search UI Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T412 — Use Whitespace Between Result Groups


**Execution:** Execute this task against the current repository in the context of Workstream AM — Search UI Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T413 — Avoid Multiple Competing Accent Colours


**Execution:** Execute this task against the current repository in the context of Workstream AM — Search UI Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T414 — Keep Active Result State Clear but Restrained


**Execution:** Execute this task against the current repository in the context of Workstream AM — Search UI Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AN — Search Theme Integration

## P07-T415 — Apply V2 Light Theme Tokens


**Execution:** Execute this task against the current repository in the context of Workstream AN — Search Theme Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T416 — Apply V2 Dark Theme Tokens


**Execution:** Execute this task against the current repository in the context of Workstream AN — Search Theme Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T417 — Avoid Search-Specific Colour System


**Execution:** Execute this task against the current repository in the context of Workstream AN — Search Theme Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T418 — Validate Search Overlay Contrast


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T419 — Validate Search Input Contrast


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T420 — Validate Active Result Contrast


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T421 — Validate Search Error Contrast


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AO — Search Loading Experience

## P07-T422 — Define Lightweight Search Loading State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T423 — Avoid Large Skeleton Layouts for Fast Search


**Execution:** Execute this task against the current repository in the context of Workstream AO — Search Loading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T424 — Preserve Existing Results During Short Refreshes Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AO — Search Loading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T425 — Prevent Results Flicker


**Execution:** Execute this task against the current repository in the context of Workstream AO — Search Loading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T426 — Prevent Layout Jump Between Search States


**Execution:** Execute this task against the current repository in the context of Workstream AO — Search Loading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T427 — Avoid “Loading…” Text as the Only Feedback


**Execution:** Execute this task against the current repository in the context of Workstream AO — Search Loading Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AP — Search State Management

## P07-T428 — Define Search Query State Ownership


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T429 — Define Search Open/Closed State Ownership


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T430 — Define Active Result State Ownership


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T431 — Define Search Results State Ownership


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T432 — Avoid Global State for Search Data Unless Necessary


**Execution:** Execute this task against the current repository in the context of Workstream AP — Search State Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T433 — Prevent Stale Results Between Queries


**Execution:** Execute this task against the current repository in the context of Workstream AP — Search State Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T434 — Reset Search State Predictably


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P07-T435 — Preserve Query on Navigation Only Where Product Value Exists


**Execution:** Execute this task against the current repository in the context of Workstream AP — Search State Management, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AQ — Search URL and Navigation Behavior

## P07-T436 — Navigate Directly to Canonical Result URL


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Search URL and Navigation Behavior, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T437 — Close Search on Successful Navigation


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Search URL and Navigation Behavior, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T438 — Preserve Browser History Correctly


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Search URL and Navigation Behavior, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T439 — Avoid Intermediate Redirect Routes


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Search URL and Navigation Behavior, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T440 — Avoid Search Tracking Parameters in Canonical Destination URL


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Search URL and Navigation Behavior, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T441 — Record Analytics Without Polluting Destination URL


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Search URL and Navigation Behavior, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AR — Search and Content Hierarchy Integration

## P07-T442 — Show Domain Context for Broad Results


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search and Content Hierarchy Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T443 — Show Stack Context for Pillar Results


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search and Content Hierarchy Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T444 — Show Pillar Context for Module Results


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search and Content Hierarchy Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T445 — Show Module Context for Question Results


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search and Content Hierarchy Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T446 — Avoid Showing Full Breadcrumb for Every Result


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search and Content Hierarchy Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T447 — Use Compact Context Paths


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search and Content Hierarchy Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T448 — Ensure Search Context Matches Canonical Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream AR — Search and Content Hierarchy Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AS — Search and Company Architecture

## P07-T449 — Define Searchable Company Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T450 — Define Company Name Aliases


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T451 — Define Company Canonical URL


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T452 — Separate Company Entity from Question Association


**Execution:** Execute this task against the current repository in the context of Workstream AS — Search and Company Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T453 — Search Company Names Directly


**Execution:** Execute this task against the current repository in the context of Workstream AS — Search and Company Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T454 — Surface Company Pages Before Individual Questions for Exact Company Queries Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AS — Search and Company Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T455 — Avoid Creating Duplicate Company Search Entities


**Execution:** Execute this task against the current repository in the context of Workstream AS — Search and Company Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AT — Search and Role Architecture

## P07-T456 — Define Searchable Role Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T457 — Define Role Aliases

Examples:

```text
SDE
Software Engineer
Backend Engineer
Java Developer
Data Analyst
Management Consultant
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Examples: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T458 — Define Role Canonical URL


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T459 — Search Roles Directly


**Execution:** Execute this task against the current repository in the context of Workstream AT — Search and Role Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T460 — Distinguish Roles from Technologies


**Execution:** Execute this task against the current repository in the context of Workstream AT — Search and Role Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T461 — Distinguish Roles from Stacks


**Execution:** Execute this task against the current repository in the context of Workstream AT — Search and Role Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AU — Future Semantic Search Readiness

## P07-T462 — Keep Search Document Model Embedding-Ready


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P2

---

## P07-T463 — Preserve Stable Entity IDs for Future Vector Indexes


**Execution:** Execute this task against the current repository in the context of Workstream AU — Future Semantic Search Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T464 — Preserve Canonical URLs Independently of Search Technology


**Execution:** Execute this task against the current repository in the context of Workstream AU — Future Semantic Search Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T465 — Avoid Coupling UI to Search Engine-Specific Response Format


**Execution:** Execute this task against the current repository in the context of Workstream AU — Future Semantic Search Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T466 — Define Search Provider Adapter Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T467 — Allow Future Hybrid Lexical and Semantic Search


**Execution:** Execute this task against the current repository in the context of Workstream AU — Future Semantic Search Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P07-T468 — Do Not Require Semantic Search for V2 Launch


**Execution:** Execute this task against the current repository in the context of Workstream AU — Future Semantic Search Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T469 — Avoid Per-Query LLM Dependency


**Execution:** Execute this task against the current repository in the context of Workstream AU — Future Semantic Search Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AV — Future AI Retrieval Readiness

## P07-T470 — Keep Search Results Referencable by Stable IDs


**Execution:** Execute this task against the current repository in the context of Workstream AV — Future AI Retrieval Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T471 — Preserve Hierarchy Metadata for Future Retrieval


**Execution:** Execute this task against the current repository in the context of Workstream AV — Future AI Retrieval Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T472 — Preserve Content-Type Metadata


**Execution:** Execute this task against the current repository in the context of Workstream AV — Future AI Retrieval Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T473 — Preserve Publication State


**Execution:** Execute this task against the current repository in the context of Workstream AV — Future AI Retrieval Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T474 — Preserve Content Versioning


**Execution:** Execute this task against the current repository in the context of Workstream AV — Future AI Retrieval Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T475 — Separate Search Retrieval from Answer Generation


**Execution:** Execute this task against the current repository in the context of Workstream AV — Future AI Retrieval Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T476 — Prevent Future AI Features from Bypassing Canonical Content Permissions


**Execution:** Execute this task against the current repository in the context of Workstream AV — Future AI Retrieval Readiness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AW — Search Observability

## P07-T477 — Measure Search Request Volume


**Execution:** Execute this task against the current repository in the context of Workstream AW — Search Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T478 — Measure Search Latency


**Execution:** Execute this task against the current repository in the context of Workstream AW — Search Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T479 — Measure Search Error Rate


**Execution:** Execute this task against the current repository in the context of Workstream AW — Search Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T480 — Measure Zero-Result Rate


**Execution:** Execute this task against the current repository in the context of Workstream AW — Search Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T481 — Measure Result Click Rate


**Execution:** Execute this task against the current repository in the context of Workstream AW — Search Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T482 — Measure Search-to-Destination Success


**Execution:** Execute this task against the current repository in the context of Workstream AW — Search Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P07-T483 — Identify Slow Query Patterns


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T484 — Identify Search Backend Failures


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T485 — Add Search Health Visibility


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

# Workstream AX — Search Index Integrity

## P07-T486 — Detect Duplicate Search Documents


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T487 — Detect Missing Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream AX — Search Index Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T488 — Detect Broken Search URLs


**Execution:** Execute this task against the current repository in the context of Workstream AX — Search Index Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T489 — Detect Draft Content Leakage


**Execution:** Execute this task against the current repository in the context of Workstream AX — Search Index Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T490 — Detect Deleted Content Remaining in Search


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T491 — Detect Missing Published Content


**Execution:** Execute this task against the current repository in the context of Workstream AX — Search Index Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T492 — Detect Search Title Drift


**Execution:** Execute this task against the current repository in the context of Workstream AX — Search Index Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T493 — Detect Search Hierarchy Drift


**Execution:** Execute this task against the current repository in the context of Workstream AX — Search Index Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T494 — Validate Search Index After Content Deployment


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AY — Search Abuse Protection

## P07-T495 — Define Reasonable Query Rate Limits


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P07-T496 — Prevent Extremely Expensive Wildcard Queries


**Execution:** Execute this task against the current repository in the context of Workstream AY — Search Abuse Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T497 — Prevent Unbounded Result Requests


**Execution:** Execute this task against the current repository in the context of Workstream AY — Search Abuse Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T498 — Prevent Automated Search Abuse from Degrading Site Performance


**Execution:** Execute this task against the current repository in the context of Workstream AY — Search Abuse Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T499 — Avoid Aggressive Protection That Harms Normal Typing


**Execution:** Execute this task against the current repository in the context of Workstream AY — Search Abuse Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T500 — Log Repeated Search Abuse Patterns Safely


**Execution:** Execute this task against the current repository in the context of Workstream AY — Search Abuse Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

# Workstream AZ — Search Migration

## P07-T501 — Build New Search Infrastructure Alongside Legacy Search


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T502 — Validate New Search Against Representative Dataset


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T503 — Compare Legacy and V2 Search Results


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Search Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T504 — Fix Major V2 Relevance Gaps


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Search Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T505 — Migrate Global Header Search


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P07-T506 — Migrate Mobile Search


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P07-T507 — Migrate Contextual Search Where Required


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P07-T508 — Remove Legacy Search Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T509 — Remove Legacy Search APIs Where Superseded


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T510 — Remove Legacy Search CSS


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T511 — Remove Legacy Search State Logic


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T512 — Prevent Legacy Search Reintroduction


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Search Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream BA — Search Quality Validation

## P07-T513 — Validate Exact Match Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T514 — Validate Prefix Match Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T515 — Validate Multi-Token Match Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T516 — Validate Alias Match Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T517 — Validate Acronym Match Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T518 — Validate Typo Match Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T519 — Validate Broad Query Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T520 — Validate Ambiguous Query Quality


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P07-T521 — Validate No-Result Recovery


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T522 — Fix Ranking Rules Rather Than Individual Query Hacks Where Possible


**Execution:** Execute this task against the current repository in the context of Workstream BA — Search Quality Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BB — Search UI Validation

## P07-T523 — Validate Search Discoverability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T524 — Validate Search Open Speed


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T525 — Validate Input Focus


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T526 — Validate Typing Responsiveness


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T527 — Validate Result Scannability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T528 — Validate Keyboard Navigation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T529 — Validate Touch Navigation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T530 — Validate Empty State


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T531 — Validate Loading State


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T532 — Validate No-Results State


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T533 — Validate Error State


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T534 — Validate Light Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T535 — Validate Dark Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream BC — Search Performance Validation

## P07-T536 — Measure Search Overlay Open Time


**Execution:** Execute this task against the current repository in the context of Workstream BC — Search Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T537 — Measure Time to First Useful Result


**Execution:** Execute this task against the current repository in the context of Workstream BC — Search Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T538 — Measure Search API P50 Latency


**Execution:** Execute this task against the current repository in the context of Workstream BC — Search Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T539 — Measure Search API P95 Latency


**Execution:** Execute this task against the current repository in the context of Workstream BC — Search Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T540 — Measure Search API Error Rate


**Execution:** Execute this task against the current repository in the context of Workstream BC — Search Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T541 — Measure Search JavaScript Cost


**Execution:** Execute this task against the current repository in the context of Workstream BC — Search Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T542 — Measure Search Bundle Impact on Non-Search Page Loads


**Execution:** Execute this task against the current repository in the context of Workstream BC — Search Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T543 — Lazy Load Heavy Search UI Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream BC — Search Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T544 — Fix Root Search Performance Regressions


**Execution:** Execute this task against the current repository in the context of Workstream BC — Search Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BD — Search Regression Protection

## P07-T545 — Add Query Normalization Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T546 — Add Exact Match Ranking Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T547 — Add Multi-Token Ranking Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T548 — Add Acronym Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T549 — Add Technical Symbol Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T550 — Add Typo Tolerance Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P07-T551 — Add Draft Content Exclusion Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T552 — Add Canonical URL Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T553 — Add Search API Contract Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P07-T554 — Add Keyboard Navigation Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P07-T555 — Add Mobile Search Regression Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P07-T556 — Add Search SEO Protection Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream BE — Representative Search Acceptance Scenarios

## P07-T557 — Search Exact Technology

```text
spring boot
```

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T558 — Search Exact Question Concept

```text
how hashmap works
```

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T559 — Search Acronym

```text
JVM
```

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T560 — Search Combined Topic

```text
spring security jwt
```

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T561 — Search Partial Topic

```text
concurrent
```

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T562 — Search Misspelling

```text
sprng securty
```

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T563 — Search Broad Role

```text
data analyst
```

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T564 — Search Consulting Topic

```text
profitability case
```

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T565 — Search Company

```text
McKinsey
```

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T566 — Search Unknown Topic

Validate recovery.

**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Validate recovery. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T567 — Search from Mobile


**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T568 — Search Using Keyboard Only


**Execution:** Execute this task against the current repository in the context of Workstream BE — Representative Search Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BF — Search Architecture Cleanup

## P07-T569 — Remove Duplicate Search Data Sources


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T570 — Remove Duplicate Search Result Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T571 — Remove Duplicate Query Normalizers


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T572 — Remove Duplicate Search Hooks


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T573 — Remove Dead Search Utilities


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T574 — Remove Dead Search Routes


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T575 — Remove Search-Specific Design Token Forks


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P07-T576 — Consolidate Search Logging


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

# Workstream BG — Phase 07 Completion

## P07-T577 — Freeze Canonical Search Entity Contract


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T578 — Freeze Canonical Search Document Contract


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T579 — Freeze Canonical Query Normalization Rules


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T580 — Freeze Canonical Ranking Rules


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T581 — Freeze Canonical Search API Contract


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T582 — Freeze Canonical Search UI Architecture


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T583 — Freeze Canonical Search Result Item


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T584 — Freeze Canonical Search SEO Policy


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T585 — Freeze Canonical Search Analytics Contract


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T586 — Publish Search Architecture Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T587 — Publish Search Ranking Documentation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P07-T588 — Publish Search Quality Dataset


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T589 — Publish Search Gap Reporting Process


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T590 — Update V2 Technical Implementation Plan


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P07-T591 — Update V2 Decision Log


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T592 — Update V2 Issue Log


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P07-T593 — Produce Phase 07 Completion Report

Document:

* search architecture,
* searchable entities,
* search document contract,
* technology choice,
* query normalization,
* terminology handling,
* ranking,
* typo tolerance,
* result grouping,
* global search UI,
* mobile search,
* backend API,
* performance,
* accessibility,
* analytics,
* SEO protection,
* migration,
* legacy cleanup.

**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document: search architecture, searchable entities, search document contract, technology choice, query normalization, terminology handling, ranking, typo tolerance, result grouping, global search UI, mobile search, backend API, performance, accessibility, analytics, SEO protection, migration, legacy cleanup. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P07-T594 — Approve Search Infrastructure for V2 Product Expansion


**Execution:** Execute this task against the current repository in the context of Workstream BG — Phase 07 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: # Phase 07 Exit Criteria Phase 07 is complete when Interview Explainer has: one canonical global search system, one canonical searchable entity model, one canonical search document contract, one canonical search API, deterministic query normalization, technical acronym support, technical symbol support, useful exact matching, useful partial matching, controlled typo tolerance, documented ranking logic, clear result g Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Phase 07 Exit Criteria

Phase 07 is complete when Interview Explainer has:

* one canonical global search system,
* one canonical searchable entity model,
* one canonical search document contract,
* one canonical search API,
* deterministic query normalization,
* technical acronym support,
* technical symbol support,
* useful exact matching,
* useful partial matching,
* controlled typo tolerance,
* documented ranking logic,
* clear result grouping,
* a calm search interface,
* keyboard navigation,
* first-class mobile search,
* useful no-results recovery,
* explicit error handling,
* search backend performance controls,
* no unpublished content leakage,
* canonical destination URLs,
* no search-result crawl traps,
* no search URLs in sitemaps,
* zero-result query reporting,
* search quality validation,
* architecture ready for future semantic retrieval without requiring it now.

---

# Phase 07 Core Principle

```text
THE USER SHOULD SEARCH
FOR THE CONCEPT THEY KNOW

NOT FOR THE TAXONOMY
THE DATABASE EXPECTS
```

The intended transformation is:

```text
CURRENT RISK

User opens search
        ↓
Frontend loads large dataset
        ↓
Simple string filtering
        ↓
Too many similar results
        ↓
Weak context
        ↓
Exact wording required
        ↓
Poor scalability

                ↓

V2

User expresses intent
        ↓
Query normalized safely
        ↓
Canonical search system
        ↓
Relevant entities ranked
        ↓
Results show useful context
        ↓
User reaches canonical page
```

---

# Search Architecture Principle

The search system should initially prefer the simplest architecture that can reliably handle the real scale.

Do not automatically introduce:

```text
Elasticsearch
OpenSearch
Vector database
LLM query rewriting
Embedding pipeline
RAG infrastructure
```

simply because the platform has thousands of questions.

The decision should follow evidence:

```text
CURRENT DATA SIZE
        +
QUERY COMPLEXITY
        +
LATENCY REQUIREMENTS
        +
EXPECTED GROWTH
        ↓
SEARCH TECHNOLOGY DECISION
```

A mature database-backed full-text search system may be enough initially.

If the platform later reaches a point where:

* semantic similarity is essential,
* lexical search quality becomes insufficient,
* content volume becomes much larger,
* cross-domain intent becomes difficult,
* AI retrieval becomes a major product capability,

the canonical search document and provider abstraction created in this phase should allow migration without rebuilding the frontend.

---

# Important SEO Boundary

Internal search and search-engine indexing are different systems.

```text
INTERNAL SEARCH

Helps users find content
inside Interview Explainer

        ≠

GOOGLE INDEXING

Helps external search engines
discover canonical pages
```

Therefore:

```text
/search?q=spring+boot
```

must not automatically become another indexable SEO page.

The preferred model is:

```text
SEARCH QUERY
        ↓
SEARCH RESULTS
        ↓
CANONICAL DOMAIN / STACK / PILLAR / MODULE / QUESTION
```

This prevents:

* infinite query URLs,
* duplicate search-result pages,
* crawl traps,
* thin pages,
* index bloat.

---

# Critical Root-Level Fix Rule

If:

```text
"spring security"
```

returns poor results across the system:

```text
DO NOT HARD-CODE
A SPECIAL SPRING SECURITY FIX
```

First inspect:

* tokenization,
* exact-match weighting,
* hierarchy weighting,
* aliases,
* title quality,
* entity ranking.

Fix the shared ranking architecture.

Similarly:

```text
10,000 QUESTIONS
WITH POOR SEARCH CONTEXT

≠

10,000 INDIVIDUAL FIXES
```

The solution is:

```text
ONE CANONICAL SEARCH DOCUMENT
        +
ONE CANONICAL HIERARCHY CONTEXT
        +
ONE RANKING SYSTEM
```

---

# Recommended V2 Search Experience

A user presses the search trigger and sees:

```text
┌──────────────────────────────────────────────┐
│  Search interview topics and questions...   │
├──────────────────────────────────────────────┤
│                                              │
│  TOPICS                                      │
│                                              │
│  Spring Security                             │
│  Java Backend › Spring Boot                  │
│                                              │
│  JWT Authentication                          │
│  Java Backend › Spring Security              │
│                                              │
│  QUESTIONS                                   │
│                                              │
│  How does JWT authentication work?           │
│  Spring Security › Authentication            │
│                                              │
│  How do you secure a REST API with JWT?      │
│  Spring Security › Authentication            │
│                                              │
└──────────────────────────────────────────────┘
```

Not:

```text
12 coloured cards

8 badges per result

full answer previews

multiple filters

large icons

unrelated recommendations

pagination inside a small search modal
```

Search should feel fast, quiet and precise.

---

# Relationship with Previous Phases

```text
PHASE 02
CANONICAL URL ARCHITECTURE
        ↓
Search knows the correct destination

PHASE 03
DESIGN SYSTEM
        ↓
Search uses canonical visual primitives

PHASE 04
GLOBAL SHELL
        ↓
Search has a consistent global entry point

PHASE 05
CONTENT HIERARCHY
        ↓
Search understands context

PHASE 06
QUESTION EXPERIENCE
        ↓
Search sends users to the core content surface

PHASE 07
SEARCH & RETRIEVAL
        ↓
Users can reach the right content directly
```

---

# Next Phase

```text
PHASE 08

AUTHENTICATION, USER STATE,
PROGRESS, BOOKMARKS
&
PERSONALIZATION FOUNDATION
```

Phase 08 should rebuild the boundary between the public SEO-first content platform and authenticated product features.

The critical architecture should become:

```text
PUBLIC CONTENT
        ↓
Always readable
Always crawlable where eligible
Never blocked by auth state

                +

OPTIONAL USER LAYER
        ↓
Progress
Bookmarks
History
Preferences
Practice state
Dashboard state
```

It should cover:

* authentication architecture,
* login and registration UI,
* session handling,
* auth loading states,
* public versus protected routes,
* backend authorization,
* user database contracts,
* progress tracking,
* bookmarks,
* recent activity,
* learning history,
* synchronization,
* anonymous-to-authenticated transition,
* failure handling,
* privacy,
* security,
* performance,
* preventing user-state APIs from blocking public pages,
* preparing the foundation for dashboards, practice systems, mock interviews and future personalization.
