# PHASE 02 — ROOT SEO, INDEXING, ROUTING & URL ARCHITECTURE REBUILD

## Phase Objective

Rebuild the technical SEO, URL, crawlability, indexability and search-discovery foundation of Interview Explainer.

The objective is not to manually add SEO fields to thousands of pages.

The objective is to create one canonical architecture that determines:

* which pages exist,
* which URLs are public,
* which URLs are canonical,
* which pages should be indexed,
* which pages should not be indexed,
* how crawlers discover pages,
* how sitemaps are generated,
* how metadata is generated,
* how structured data is generated,
* how duplicate URLs are prevented,
* how redirects are handled,
* how internal links expose the site hierarchy,
* how search engines reach deep content,
* how content remains server-visible,
* how indexing failures are detected.

The central principle is:

```text
CONTENT ENTITY
      ↓
CANONICAL ROUTE REGISTRY
      ↓
CANONICAL PUBLIC URL
      ↓
INDEXABILITY POLICY
      ↓
SERVER-RENDERED PAGE
      ↓
METADATA
      ↓
STRUCTURED DATA
      ↓
SITEMAP
      ↓
INTERNAL LINKS
      ↓
SEARCH ENGINE DISCOVERY
```

SEO must become a system, not a collection of page-specific patches.

---

# Workstream A — Canonical SEO Architecture

## P02-T001 — Establish Canonical SEO Architecture

Define the permanent relationship between:

* route entities,
* URL generation,
* metadata,
* canonical URLs,
* indexability,
* sitemaps,
* structured data,
* internal linking.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define the permanent relationship between: route entities, URL generation, metadata, canonical URLs, indexability, sitemaps, structured data, internal linking. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T002 — Establish SEO Ownership Boundaries

Define which SEO responsibilities belong to:

* route registry,
* page templates,
* metadata factory,
* sitemap system,
* structured-data system,
* content source,
* backend.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define which SEO responsibilities belong to: route registry, page templates, metadata factory, sitemap system, structured-data system, content source, backend. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T003 — Create Canonical SEO Module Structure

Organize reusable SEO logic into clear modules.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Organize reusable SEO logic into clear modules. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T004 — Remove SEO Logic from Arbitrary UI Components

Prevent presentation components from independently generating canonical SEO behavior.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Prevent presentation components from independently generating canonical SEO behavior. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T005 — Establish SEO Configuration Source

Create one canonical source for:

* production origin,
* site name,
* default metadata,
* social identity,
* indexing defaults.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create one canonical source for: production origin, site name, default metadata, social identity, indexing defaults. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T006 — Establish Environment-Safe SEO Behavior

Prevent local, preview or staging environments from accidentally behaving as canonical production.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent local, preview or staging environments from accidentally behaving as canonical production. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T007 — Establish SEO Failure Philosophy

Critical SEO generation failures must fail visibly during development rather than silently generating invalid URLs.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Critical SEO generation failures must fail visibly during development rather than silently generating invalid URLs. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T008 — Establish SEO Type Safety

Use explicit types for route families, entities and SEO configuration.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use explicit types for route families, entities and SEO configuration. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T009 — Establish SEO Utility Naming Convention

Prevent overlapping helper functions.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent overlapping helper functions. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P02-T010 — Establish SEO Deprecation Strategy

Mark legacy SEO helpers for removal during migration.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Mark legacy SEO helpers for removal during migration. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream B — Canonical Site Origin

## P02-T011 — Define Production Site Origin

Create one canonical production origin.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create one canonical production origin. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T012 — Eliminate Conflicting Base URL Definitions

Remove duplicate production URL constants.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Remove duplicate production URL constants. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T013 — Normalize WWW Policy

Choose and enforce the canonical hostname form.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Choose and enforce the canonical hostname form. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P02-T014 — Normalize HTTPS Policy

Ensure canonical URLs always use the production HTTPS scheme.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Ensure canonical URLs always use the production HTTPS scheme. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P02-T015 — Normalize Trailing Slash Policy

Choose one canonical trailing-slash behavior.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Choose one canonical trailing-slash behavior. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P02-T016 — Normalize URL Case Policy

Prevent case-based duplicate URLs.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Prevent case-based duplicate URLs. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P02-T017 — Normalize Default Port Behavior

Prevent malformed canonical origins.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Prevent malformed canonical origins. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P02-T018 — Prevent Localhost Canonicals

Ensure development configuration cannot leak into production metadata.

**Execution:** Execute this task against the current repository in the context of Workstream B — Canonical Site Origin, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Ensure development configuration cannot leak into production metadata. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T019 — Prevent Preview-Domain Canonicals

Ensure deployment preview URLs never become canonical production URLs.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Ensure deployment preview URLs never become canonical production URLs. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T020 — Create Canonical Absolute URL Builder

All absolute public URLs should use one implementation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: All absolute public URLs should use one implementation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream C — Canonical Route Registry

## P02-T021 — Build Canonical Public Route Registry

Create the authoritative registry of public route families.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create the authoritative registry of public route families. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T022 — Define Homepage Route Contract

Establish canonical behavior for the root route.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical behavior for the root route. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T023 — Define Domain Route Contract

Establish canonical domain URL generation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical domain URL generation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T024 — Define Stack Route Contract

Establish canonical stack URL generation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical stack URL generation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T025 — Define Pillar Route Contract

Establish canonical pillar URL generation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical pillar URL generation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T026 — Define Module Route Contract

Establish canonical module URL generation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical module URL generation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T027 — Define Question Route Contract

Establish one canonical public question URL.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish one canonical public question URL. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T028 — Define Topic Route Contract

Establish canonical topic URL behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical topic URL behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T029 — Define Company Route Contract

Establish canonical company URL behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical company URL behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T030 — Define Comparison Route Contract

Establish canonical comparison URL behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical comparison URL behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T031 — Define Tool Route Contract

Establish canonical tool URL behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical tool URL behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T032 — Define Roadmap Route Contract

Establish canonical roadmap URL behavior.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Establish canonical roadmap URL behavior. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P02-T033 — Define Cheatsheet Route Contract

Establish canonical cheatsheet URL behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical cheatsheet URL behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T034 — Define DSA Hub Route Contract

Establish canonical DSA hierarchy URLs.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical DSA hierarchy URLs. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T035 — Define DSA Problem Route Contract

Establish canonical problem URLs.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical problem URLs. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T036 — Define Career Content Route Contract

Establish canonical career-content URLs.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical career-content URLs. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T037 — Define Behavioral Content Route Contract

Establish canonical behavioral interview URLs.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical behavioral interview URLs. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T038 — Define Static Information Route Contracts

Establish canonical URLs for stable informational pages.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish canonical URLs for stable informational pages. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T039 — Define Authentication Route Classification

Explicitly separate authentication routes from public SEO routes.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Explicitly separate authentication routes from public SEO routes. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T040 — Define Dashboard Route Classification

Explicitly classify private application routes.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Explicitly classify private application routes. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T041 — Define Internal Route Classification

Prevent internal rendering routes from entering public SEO systems.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent internal rendering routes from entering public SEO systems. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T042 — Define Development Route Classification

Exclude development-only pages from production discovery.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Exclude development-only pages from production discovery. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T043 — Implement Route Registry Type Safety

Prevent unknown route families from silently generating URLs.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prevent unknown route families from silently generating URLs. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T044 — Implement Route Registry Validation

Detect duplicate route patterns.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Detect duplicate route patterns. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T045 — Replace Scattered Route Constants

Migrate public URL generation to the canonical registry.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Migrate public URL generation to the canonical registry. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

# Workstream D — Canonical URL Generation

## P02-T046 — Build Canonical URL Generator

Create the central entity-to-public-URL implementation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create the central entity-to-public-URL implementation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T047 — Build Canonical Domain URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T048 — Build Canonical Stack URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T049 — Build Canonical Pillar URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T050 — Build Canonical Module URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T051 — Build Canonical Question URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T052 — Build Canonical Topic URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T053 — Build Canonical Company URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T054 — Build Canonical Comparison URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T055 — Build Canonical Tool URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T056 — Build Canonical Roadmap URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T057 — Build Canonical Cheatsheet URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T058 — Build Canonical DSA URL Generators


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T059 — Build Canonical Static Page URL Generator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T060 — Reject Invalid URL Parameters

Prevent malformed URLs from being generated.

**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical URL Generation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prevent malformed URLs from being generated. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T061 — Normalize Slugs During URL Generation

Use canonical slug rules.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Use canonical slug rules. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P02-T062 — Encode Dynamic URL Segments Safely

Prevent malformed route generation.

**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical URL Generation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prevent malformed route generation. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T063 — Prevent Double Slash Generation


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical URL Generation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T064 — Prevent Duplicate Path Segment Generation


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical URL Generation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T065 — Prevent Query Parameters from Becoming Canonical by Default


**Execution:** Execute this task against the current repository in the context of Workstream D — Canonical URL Generation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T066 — Migrate Navigation URLs to Canonical Generators


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T067 — Migrate Breadcrumb URLs to Canonical Generators


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T068 — Migrate Related-Content URLs to Canonical Generators


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T069 — Migrate Search Result URLs to Canonical Generators


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T070 — Migrate Sitemap URLs to Canonical Generators


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T071 — Migrate Structured-Data URLs to Canonical Generators


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T072 — Remove Legacy URL Builders

Delete obsolete implementations after migration.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Delete obsolete implementations after migration. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream E — Slug Architecture

## P02-T073 — Establish Canonical Slug Policy

Define normalization rules.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define normalization rules. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T074 — Establish Stable Slug Ownership

Determine which content source owns each public slug.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Determine which content source owns each public slug. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T075 — Prevent Runtime Slug Drift

Avoid generating different URLs from mutable presentation labels.

**Execution:** Execute this task against the current repository in the context of Workstream E — Slug Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid generating different URLs from mutable presentation labels. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T076 — Detect Duplicate Slugs

Identify collisions within route scopes.

**Execution:** Execute this task against the current repository in the context of Workstream E — Slug Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Identify collisions within route scopes. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T077 — Detect Cross-Hierarchy Slug Ambiguity

Prevent incorrect entity resolution.

**Execution:** Execute this task against the current repository in the context of Workstream E — Slug Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prevent incorrect entity resolution. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T078 — Preserve Historical Slugs Where Required

Avoid unnecessary loss of existing search equity.

**Execution:** Execute this task against the current repository in the context of Workstream E — Slug Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid unnecessary loss of existing search equity. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T079 — Create Slug Migration Mapping

Map changed legacy slugs to canonical replacements.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Map changed legacy slugs to canonical replacements. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T080 — Implement Slug Validation

Reject invalid public identifiers.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Reject invalid public identifiers. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T081 — Prevent Empty Slug Generation


**Execution:** Execute this task against the current repository in the context of Workstream E — Slug Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T082 — Prevent Unstable Array Indexes from Becoming Public Identity


**Execution:** Execute this task against the current repository in the context of Workstream E — Slug Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T083 — Separate Display Names from Public Slugs


**Execution:** Execute this task against the current repository in the context of Workstream E — Slug Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T084 — Establish Slug Change Procedure

Require redirect planning for future public slug changes.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Require redirect planning for future public slug changes. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream F — Public URL Resolution

## P02-T085 — Build Canonical Entity Resolver

Resolve URL parameters to canonical content entities.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Resolve URL parameters to canonical content entities. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T086 — Distinguish Not Found from Temporary Data Failure

Prevent false 404 behavior.

**Execution:** Execute this task against the current repository in the context of Workstream F — Public URL Resolution, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prevent false 404 behavior. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T087 — Return True 404 for Missing Public Entities

Avoid soft 404 pages.

**Execution:** Execute this task against the current repository in the context of Workstream F — Public URL Resolution, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid soft 404 pages. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T088 — Redirect Noncanonical Valid URLs

Send valid aliases to canonical public URLs.

**Execution:** Execute this task against the current repository in the context of Workstream F — Public URL Resolution, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Send valid aliases to canonical public URLs. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T089 — Prevent Duplicate Entity Resolution

Ensure one entity cannot resolve unpredictably through multiple active paths.

**Execution:** Execute this task against the current repository in the context of Workstream F — Public URL Resolution, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Ensure one entity cannot resolve unpredictably through multiple active paths. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T090 — Validate Parent-Child Route Relationships

Ensure question URLs resolve to the correct hierarchy.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Ensure question URLs resolve to the correct hierarchy. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T091 — Handle Renamed Entities Safely

Preserve valid historical links.

**Execution:** Execute this task against the current repository in the context of Workstream F — Public URL Resolution, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Preserve valid historical links. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T092 — Handle Removed Entities Safely

Choose correct 404 or redirect behavior.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Choose correct 404 or redirect behavior. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P02-T093 — Remove Accidental Fallback-to-Homepage Behavior

Missing content must not masquerade as the homepage.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Missing content must not masquerade as the homepage. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T094 — Remove Generic 200 Responses for Missing Content

Prevent soft 404 indexing problems.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Prevent soft 404 indexing problems. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream G — Redirect Architecture

## P02-T095 — Create Canonical Redirect Registry

Centralize intentional permanent URL migrations.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Centralize intentional permanent URL migrations. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T096 — Classify Existing Redirects

Classify as:

* required,
* obsolete,
* temporary,
* incorrect,
* unknown.

**Execution:** Execute this task against the current repository in the context of Workstream G — Redirect Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Classify as: required, obsolete, temporary, incorrect, unknown. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T097 — Convert Permanent Migrations to Permanent Redirects

Use appropriate status behavior.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use appropriate status behavior. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T098 — Remove Unnecessary Redirect Chains

Reduce crawler and user latency.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce crawler and user latency. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T099 — Remove Redirect Loops


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T100 — Prevent Sitemap URLs from Redirecting

Sitemaps should list final canonical URLs.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Sitemaps should list final canonical URLs. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T101 — Prevent Internal Links from Targeting Redirects

Update internal links to canonical destinations.

**Execution:** Execute this task against the current repository in the context of Workstream G — Redirect Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Update internal links to canonical destinations. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T102 — Preserve High-Value Legacy URLs

Redirect retired URLs when a meaningful replacement exists.

**Execution:** Execute this task against the current repository in the context of Workstream G — Redirect Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Redirect retired URLs when a meaningful replacement exists. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T103 — Avoid Irrelevant Mass Redirects

Do not redirect unrelated removed content to generic pages.

**Execution:** Execute this task against the current repository in the context of Workstream G — Redirect Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not redirect unrelated removed content to generic pages. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T104 — Establish Redirect Retirement Policy

Define when temporary compatibility redirects can be removed.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define when temporary compatibility redirects can be removed. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

# Workstream H — Rewrite Architecture

## P02-T105 — Audit Internal Rewrites Against Canonical URLs

Ensure rewrites do not create public duplicate identities.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Ensure rewrites do not create public duplicate identities. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T106 — Separate Internal Rendering Paths from Public URLs

Keep implementation details invisible to crawlers.

**Execution:** Execute this task against the current repository in the context of Workstream H — Rewrite Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Keep implementation details invisible to crawlers. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T107 — Prevent Internal Rewrite Targets from Entering Sitemaps


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T108 — Prevent Internal Rewrite Targets from Becoming Canonical


**Execution:** Trace current consumers and behavior, refactor the responsibility at its shared owner, and migrate usage incrementally so externally visible behavior is preserved unless this task explicitly changes it. Remove duplicate legacy paths after migration and run targeted regression checks across the routes or features with the largest blast radius.

**Priority:** P0

---

## P02-T109 — Prevent Internal Rewrite Targets from Internal Linking


**Execution:** Trace current consumers and behavior, refactor the responsibility at its shared owner, and migrate usage incrementally so externally visible behavior is preserved unless this task explicitly changes it. Remove duplicate legacy paths after migration and run targeted regression checks across the routes or features with the largest blast radius.

**Priority:** P0

---

## P02-T110 — Remove Obsolete Rewrites

Delete unnecessary compatibility layers.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Delete unnecessary compatibility layers. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P02-T111 — Document Required Rewrite Contracts

Protect intentional public-to-internal routing.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Protect intentional public-to-internal routing. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream I — Indexability Policy Engine

## P02-T112 — Build Canonical Indexability Policy

Create one decision system for whether a route should be indexed.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create one decision system for whether a route should be indexed. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T113 — Define Homepage Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T114 — Define Domain Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T115 — Define Stack Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T116 — Define Pillar Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T117 — Define Module Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T118 — Define Question Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T119 — Define Topic Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T120 — Define Company Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T121 — Define Comparison Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T122 — Define Tool Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T123 — Define Roadmap Page Indexability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P02-T124 — Define Cheatsheet Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T125 — Define DSA Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T126 — Define Authentication Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T127 — Define Dashboard Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T128 — Define Search Result Page Indexability

Prevent uncontrolled internal-search result indexing.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent uncontrolled internal-search result indexing. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T129 — Define Filtered Page Indexability

Prevent faceted URL explosion.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent faceted URL explosion. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T130 — Define Pagination Indexability

Choose deliberate behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Choose deliberate behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T131 — Define Preview Page Indexability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T132 — Define Development Page Indexability


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T133 — Define Empty Page Indexability

Prevent empty pages from being submitted for indexing.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent empty pages from being submitted for indexing. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T134 — Define Thin Generated Page Indexability

Require minimum useful content.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Require minimum useful content. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T135 — Implement Indexability Resolver

Generate robots behavior from route policy.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Generate robots behavior from route policy. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T136 — Prevent Conflicting Indexability Signals

Avoid `noindex` pages appearing in sitemaps.

**Execution:** Execute this task against the current repository in the context of Workstream I — Indexability Policy Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid `noindex` pages appearing in sitemaps. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T137 — Prevent Indexable Pages from Being Robots-Blocked

Ensure crawlers can access pages intended for indexing.

**Execution:** Execute this task against the current repository in the context of Workstream I — Indexability Policy Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Ensure crawlers can access pages intended for indexing. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T138 — Remove Accidental Noindex Directives


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T139 — Remove Accidental Nofollow Directives


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream J — robots.txt Architecture

## P02-T140 — Rebuild Canonical robots.txt

Generate crawler rules intentionally.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Generate crawler rules intentionally. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T141 — Reference Canonical Sitemap Location


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T142 — Allow Crawl of Public Indexable Content


**Execution:** Execute this task against the current repository in the context of Workstream J — robots.txt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T143 — Block Truly Internal Crawl Surfaces Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream J — robots.txt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T144 — Avoid Blocking Resources Required for Rendering


**Execution:** Execute this task against the current repository in the context of Workstream J — robots.txt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T145 — Remove Obsolete Robots Rules


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P02-T146 — Validate Production robots.txt Separately from Development Behavior


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream K — Metadata Factory

## P02-T147 — Build Canonical Metadata Factory

Create one reusable metadata generation system.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create one reusable metadata generation system. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T148 — Define Site-Wide Metadata Defaults


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T149 — Define Metadata Fallback Hierarchy

Prevent missing titles and descriptions.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent missing titles and descriptions. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T150 — Generate Canonical Alternates Centrally


**Execution:** Execute this task against the current repository in the context of Workstream K — Metadata Factory, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T151 — Generate Robots Metadata from Indexability Policy


**Execution:** Execute this task against the current repository in the context of Workstream K — Metadata Factory, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T152 — Generate Open Graph Metadata Centrally


**Execution:** Execute this task against the current repository in the context of Workstream K — Metadata Factory, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T153 — Generate Twitter Metadata Centrally


**Execution:** Execute this task against the current repository in the context of Workstream K — Metadata Factory, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T154 — Generate Metadata Base Correctly


**Execution:** Execute this task against the current repository in the context of Workstream K — Metadata Factory, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T155 — Prevent Undefined Metadata Values


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T156 — Prevent Empty Metadata Values


**Execution:** Execute this task against the current repository in the context of Workstream K — Metadata Factory, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T157 — Prevent Duplicate Site Name Suffixes


**Execution:** Execute this task against the current repository in the context of Workstream K — Metadata Factory, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T158 — Normalize Metadata Text

Remove malformed whitespace and rendering artifacts.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Remove malformed whitespace and rendering artifacts. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P02-T159 — Sanitize Metadata Derived from Rich Content

Prevent markup from leaking into search snippets.

**Execution:** Execute this task against the current repository in the context of Workstream K — Metadata Factory, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prevent markup from leaking into search snippets. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T160 — Enforce Metadata Type Safety


**Execution:** Execute this task against the current repository in the context of Workstream K — Metadata Factory, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T161 — Remove Duplicate Metadata Helpers


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T162 — Remove Hard-Coded Canonical Metadata from Shared Pages


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream L — Title Architecture

## P02-T163 — Establish Site Title Pattern


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T164 — Establish Homepage Title Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T165 — Establish Domain Title Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T166 — Establish Stack Title Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T167 — Establish Pillar Title Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T168 — Establish Module Title Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T169 — Establish Question Title Template

Prioritize the actual interview query rather than keyword stuffing.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prioritize the actual interview query rather than keyword stuffing. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T170 — Establish Topic Title Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T171 — Establish Company Title Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T172 — Establish Comparison Title Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T173 — Establish Tool Title Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T174 — Establish Roadmap Title Template


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P02-T175 — Establish Cheatsheet Title Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T176 — Establish DSA Title Templates


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T177 — Prevent Identical Titles Across Distinct Pages


**Execution:** Execute this task against the current repository in the context of Workstream L — Title Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T178 — Prevent Excessively Generic Titles


**Execution:** Execute this task against the current repository in the context of Workstream L — Title Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T179 — Prevent Programmatic Keyword Stuffing


**Execution:** Execute this task against the current repository in the context of Workstream L — Title Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T180 — Preserve Human Readability in Generated Titles


**Execution:** Execute this task against the current repository in the context of Workstream L — Title Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream M — Meta Description Architecture

## P02-T181 — Establish Description Generation Strategy

Use useful page-specific summaries.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use useful page-specific summaries. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T182 — Establish Homepage Description


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T183 — Establish Domain Description Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T184 — Establish Stack Description Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T185 — Establish Pillar Description Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T186 — Establish Module Description Template


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T187 — Establish Question Description Strategy

Use meaningful question-specific context.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use meaningful question-specific context. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T188 — Establish Topic Description Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T189 — Establish Company Description Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T190 — Establish Comparison Description Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T191 — Establish Tool Description Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T192 — Establish Roadmap Description Strategy


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P02-T193 — Establish Cheatsheet Description Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T194 — Establish DSA Description Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T195 — Prevent Identical Generated Descriptions at Scale


**Execution:** Execute this task against the current repository in the context of Workstream M — Meta Description Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T196 — Prevent Empty Description Fallbacks


**Execution:** Execute this task against the current repository in the context of Workstream M — Meta Description Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T197 — Prevent Raw Answer Markup in Descriptions


**Execution:** Execute this task against the current repository in the context of Workstream M — Meta Description Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T198 — Normalize Generated Description Length

Avoid severe truncation or meaningless short descriptions.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Avoid severe truncation or meaningless short descriptions. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

# Workstream N — Canonical Tag Architecture

## P02-T199 — Generate Canonical Tags from Route Registry


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T200 — Ensure Canonical URLs Are Absolute


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T201 — Ensure Canonical URLs Use Production Origin


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T202 — Ensure Canonicals Use Final Public URLs


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T203 — Prevent Self-Canonicalization to Internal Routes


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T204 — Prevent Canonicalization to Redirecting URLs


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T205 — Prevent Canonicalization to 404 URLs


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T206 — Prevent Canonicalization Across Unrelated Content


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T207 — Ensure Paginated Canonical Behavior Is Deliberate


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T208 — Ensure Query Parameters Do Not Corrupt Canonicals


**Execution:** Execute this task against the current repository in the context of Workstream N — Canonical Tag Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T209 — Remove Duplicate Canonical Tags


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream O — Sitemap Architecture

## P02-T210 — Rebuild Canonical Sitemap System

Use the route registry and canonical entity sources.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Use the route registry and canonical entity sources. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T211 — Define Sitemap Index Architecture

Split large sitemap sets logically where needed.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Split large sitemap sets logically where needed. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T212 — Build Static Page Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T213 — Build Domain Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T214 — Build Stack Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T215 — Build Pillar Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T216 — Build Module Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T217 — Build Question Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T218 — Build Topic Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T219 — Build Company Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T220 — Build Comparison Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T221 — Build Tool Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T222 — Build Roadmap Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T223 — Build Cheatsheet Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T224 — Build DSA Sitemap


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T225 — Exclude Authentication Routes


**Execution:** Execute this task against the current repository in the context of Workstream O — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T226 — Exclude Dashboard and Private Routes


**Execution:** Execute this task against the current repository in the context of Workstream O — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T227 — Exclude Internal Rendering Routes


**Execution:** Execute this task against the current repository in the context of Workstream O — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T228 — Exclude Development Routes


**Execution:** Execute this task against the current repository in the context of Workstream O — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T229 — Exclude Noindex Routes


**Execution:** Execute this task against the current repository in the context of Workstream O — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T230 — Exclude Empty Content Routes


**Execution:** Execute this task against the current repository in the context of Workstream O — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T231 — Exclude Redirecting URLs


**Execution:** Execute this task against the current repository in the context of Workstream O — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T232 — Exclude Noncanonical Aliases


**Execution:** Execute this task against the current repository in the context of Workstream O — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T233 — Deduplicate Sitemap URLs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T234 — Normalize Sitemap URL Formatting


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P02-T235 — Generate Accurate Last-Modified Values Where Reliable

Do not fabricate meaningless timestamps.

**Execution:** Execute this task against the current repository in the context of Workstream O — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not fabricate meaningless timestamps. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T236 — Remove Misleading Change Frequency Metadata

Avoid unsupported signals.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Avoid unsupported signals. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P2

---

## P02-T237 — Remove Misleading Priority Metadata

Avoid arbitrary values.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Avoid arbitrary values. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P2

---

## P02-T238 — Validate Sitemap URL Count

Compare generated counts against canonical content entities.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Compare generated counts against canonical content entities. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T239 — Validate Every Sitemap URL Resolves


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T240 — Validate Every Sitemap URL Returns Canonical 200


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T241 — Validate Sitemap and Indexability Agreement


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T242 — Validate Sitemap and Canonical Agreement


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T243 — Prevent Sitemap Generation from Fragmented Sources

Use authoritative content ownership.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Use authoritative content ownership. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T244 — Remove Legacy Sitemap Generators


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream P — Sitemap Scale & Reliability

## P02-T245 — Implement Sitemap Chunking Where Required

Respect practical sitemap limits.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Respect practical sitemap limits. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T246 — Ensure Deterministic Sitemap Generation

The same content state should produce the same URL set.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: The same content state should produce the same URL set. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P02-T247 — Prevent Duplicate URLs Across Sitemap Files


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T248 — Handle Sitemap Generation Failures Safely

Avoid silently publishing incomplete sets.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Avoid silently publishing incomplete sets. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T249 — Add Sitemap Generation Diagnostics

Expose counts and failures during build or validation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Expose counts and failures during build or validation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T250 — Add Sitemap Regression Comparison

Detect major unexpected URL loss or explosion.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Detect major unexpected URL loss or explosion. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream Q — Structured Data Architecture

## P02-T251 — Build Canonical Structured Data System

Create reusable schema generation utilities.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create reusable schema generation utilities. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T252 — Establish WebSite Schema


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T253 — Establish Organization Schema Where Appropriate


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T254 — Establish BreadcrumbList Schema


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T255 — Establish WebPage Schema Foundation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T256 — Establish Article-Like Schema Policy

Use only where content genuinely qualifies.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use only where content genuinely qualifies. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T257 — Establish FAQ Schema Policy

Do not apply FAQ schema indiscriminately.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Do not apply FAQ schema indiscriminately. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T258 — Establish Question-Content Schema Policy

Use only schema types that accurately represent the page.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use only schema types that accurately represent the page. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T259 — Establish Software Tool Schema Policy

Apply only to genuine tool pages where appropriate.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Apply only to genuine tool pages where appropriate. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P02-T260 — Establish Breadcrumb Entity Generation

Use canonical route hierarchy.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use canonical route hierarchy. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T261 — Ensure Structured Data Uses Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream Q — Structured Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T262 — Ensure Structured Data Matches Visible Content


**Execution:** Execute this task against the current repository in the context of Workstream Q — Structured Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T263 — Prevent Hidden SEO-Only Structured Content


**Execution:** Execute this task against the current repository in the context of Workstream Q — Structured Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T264 — Prevent Duplicate Schema Blocks


**Execution:** Execute this task against the current repository in the context of Workstream Q — Structured Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T265 — Prevent Conflicting Schema Identities


**Execution:** Execute this task against the current repository in the context of Workstream Q — Structured Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T266 — Sanitize Structured Data Inputs


**Execution:** Execute this task against the current repository in the context of Workstream Q — Structured Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T267 — Remove Invalid Legacy Structured Data


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream R — Breadcrumb Architecture

## P02-T268 — Establish Canonical Breadcrumb Hierarchy

Create one route-aware hierarchy.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create one route-aware hierarchy. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T269 — Generate Breadcrumbs from Canonical Entities


**Execution:** Execute this task against the current repository in the context of Workstream R — Breadcrumb Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T270 — Use Canonical URLs in Breadcrumb Links


**Execution:** Execute this task against the current repository in the context of Workstream R — Breadcrumb Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T271 — Align Visual Breadcrumbs with Breadcrumb Schema


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P02-T272 — Prevent Duplicate Hierarchy Names


**Execution:** Execute this task against the current repository in the context of Workstream R — Breadcrumb Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T273 — Handle Deep Question Hierarchies

Maintain useful context without excessive breadcrumb length.

**Execution:** Execute this task against the current repository in the context of Workstream R — Breadcrumb Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Maintain useful context without excessive breadcrumb length. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T274 — Handle Mobile Breadcrumb Presentation

Preserve semantic hierarchy while reducing visual clutter.

**Execution:** Execute this task against the current repository in the context of Workstream R — Breadcrumb Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Preserve semantic hierarchy while reducing visual clutter. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T275 — Remove Duplicate Breadcrumb Generators


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream S — Server Rendering & Crawlable Content

## P02-T276 — Identify SEO-Critical Client-Only Rendering

Find public content that depends unnecessarily on browser JavaScript.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Find public content that depends unnecessarily on browser JavaScript. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T277 — Move Primary Public Content to Server-Visible Rendering

Ensure crawlers receive meaningful HTML.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Ensure crawlers receive meaningful HTML. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T278 — Ensure Question Titles Are Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream S — Server Rendering & Crawlable Content, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T279 — Ensure Question Answers Are Server-Available Where Architecture Allows

Avoid unnecessary empty shells.

**Execution:** Execute this task against the current repository in the context of Workstream S — Server Rendering & Crawlable Content, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid unnecessary empty shells. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T280 — Ensure Hierarchy Pages Render Meaningful Server Content


**Execution:** Execute this task against the current repository in the context of Workstream S — Server Rendering & Crawlable Content, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T281 — Ensure Internal Links Exist in Rendered HTML

Do not rely entirely on client interactions for discovery.

**Execution:** Execute this task against the current repository in the context of Workstream S — Server Rendering & Crawlable Content, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not rely entirely on client interactions for discovery. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T282 — Prevent Loading States from Becoming Primary Crawl Output


**Execution:** Execute this task against the current repository in the context of Workstream S — Server Rendering & Crawlable Content, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T283 — Prevent Client Fetch Failure from Creating Empty Indexable Pages


**Execution:** Execute this task against the current repository in the context of Workstream S — Server Rendering & Crawlable Content, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T284 — Reduce Unnecessary Client Boundaries on Public Pages


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P02-T285 — Preserve Interactive Features as Client Islands

Keep interactivity without making the whole page client-only.

**Execution:** Execute this task against the current repository in the context of Workstream S — Server Rendering & Crawlable Content, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Keep interactivity without making the whole page client-only. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream T — HTTP Status Correctness

## P02-T286 — Ensure Valid Public Pages Return 200


**Execution:** Execute this task against the current repository in the context of Workstream T — HTTP Status Correctness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T287 — Ensure Missing Pages Return 404


**Execution:** Execute this task against the current repository in the context of Workstream T — HTTP Status Correctness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T288 — Ensure Permanent Migrations Return Appropriate Redirect Status


**Execution:** Execute this task against the current repository in the context of Workstream T — HTTP Status Correctness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T289 — Ensure Temporary Redirects Are Used Only Intentionally


**Execution:** Execute this task against the current repository in the context of Workstream T — HTTP Status Correctness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T290 — Prevent Error Pages from Returning 200


**Execution:** Execute this task against the current repository in the context of Workstream T — HTTP Status Correctness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T291 — Prevent Authentication Failures from Affecting Public Content Status


**Execution:** Execute this task against the current repository in the context of Workstream T — HTTP Status Correctness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T292 — Prevent Backend Data Failures from Masquerading as Valid Empty Pages


**Execution:** Execute this task against the current repository in the context of Workstream T — HTTP Status Correctness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T293 — Define Temporary Upstream Failure Behavior

Avoid accidental permanent deindexing during transient failures.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Avoid accidental permanent deindexing during transient failures. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream U — Internal Linking Architecture

## P02-T294 — Establish Canonical Internal Linking Strategy

Use links as both user navigation and crawl discovery.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use links as both user navigation and crawl discovery. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T295 — Link Homepage to Major Content Hubs


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T296 — Link Domain Pages to Relevant Stacks


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T297 — Link Stack Pages to Pillars


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T298 — Link Pillars to Modules


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T299 — Link Modules to Questions


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T300 — Link Questions to Parent Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T301 — Link Questions to Related Questions


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T302 — Link Questions to Previous and Next Questions


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T303 — Link Topics to Relevant Questions


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T304 — Link Companies to Relevant Interview Content


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T305 — Link Roadmaps to Relevant Learning Content


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P02-T306 — Link Cheatsheets to Relevant Deep Content


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T307 — Link DSA Hierarchy Consistently


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T308 — Prevent Internal Links to Redirects


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T309 — Prevent Internal Links to Noncanonical Aliases


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T310 — Prevent Broken Internal Links


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T311 — Prevent Important Pages from Becoming Orphans


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T312 — Establish Maximum Crawl Depth Targets for Core Content

Keep important pages discoverable through reasonable hierarchy depth.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Keep important pages discoverable through reasonable hierarchy depth. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T313 — Avoid Excessive Site-Wide Link Spam

Do not place thousands of low-context links on every page.

**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not place thousands of low-context links on every page. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T314 — Prefer Contextual Links Over Decorative Link Dumps


**Execution:** Execute this task against the current repository in the context of Workstream U — Internal Linking Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream V — Content Hierarchy & Crawl Graph

## P02-T315 — Build Canonical Crawl Graph Model

Represent how crawlers move through the site.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Represent how crawlers move through the site. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T316 — Ensure Every Indexable Question Has an Incoming Crawl Path


**Execution:** Execute this task against the current repository in the context of Workstream V — Content Hierarchy & Crawl Graph, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T317 — Ensure Every Indexable Module Has an Incoming Crawl Path


**Execution:** Execute this task against the current repository in the context of Workstream V — Content Hierarchy & Crawl Graph, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T318 — Ensure Every Indexable Pillar Has an Incoming Crawl Path


**Execution:** Execute this task against the current repository in the context of Workstream V — Content Hierarchy & Crawl Graph, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T319 — Ensure Every Indexable Stack Has an Incoming Crawl Path


**Execution:** Execute this task against the current repository in the context of Workstream V — Content Hierarchy & Crawl Graph, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T320 — Identify Deep Orphan Clusters


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T321 — Repair Broken Hierarchy Links


**Execution:** Execute this task against the current repository in the context of Workstream V — Content Hierarchy & Crawl Graph, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T322 — Prevent Infinite Navigation Spaces

Avoid crawler traps.

**Execution:** Execute this task against the current repository in the context of Workstream V — Content Hierarchy & Crawl Graph, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid crawler traps. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T323 — Prevent Calendar-Like or Parameter-Based URL Explosion


**Execution:** Execute this task against the current repository in the context of Workstream V — Content Hierarchy & Crawl Graph, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T324 — Prevent Search Filter Crawl Explosion


**Execution:** Execute this task against the current repository in the context of Workstream V — Content Hierarchy & Crawl Graph, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream W — Duplicate Content Prevention

## P02-T325 — Identify Duplicate Public Content Routes


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T326 — Consolidate Duplicate Question URLs


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T327 — Consolidate Duplicate Topic URLs


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T328 — Consolidate Duplicate Hierarchy Routes


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T329 — Prevent Query-Parameter Duplicate Pages


**Execution:** Execute this task against the current repository in the context of Workstream W — Duplicate Content Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T330 — Prevent Case-Variant Duplicate Pages


**Execution:** Execute this task against the current repository in the context of Workstream W — Duplicate Content Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T331 — Prevent Trailing-Slash Duplicate Pages


**Execution:** Execute this task against the current repository in the context of Workstream W — Duplicate Content Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T332 — Prevent WWW/Non-WWW Duplicate Pages


**Execution:** Execute this task against the current repository in the context of Workstream W — Duplicate Content Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T333 — Prevent HTTP/HTTPS Duplicate Indexing


**Execution:** Execute this task against the current repository in the context of Workstream W — Duplicate Content Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T334 — Prevent Internal Renderer Duplicate Indexing


**Execution:** Execute this task against the current repository in the context of Workstream W — Duplicate Content Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T335 — Prevent Duplicate Generated Taxonomy Pages


**Execution:** Execute this task against the current repository in the context of Workstream W — Duplicate Content Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T336 — Consolidate Near-Identical Programmatic Pages Where Necessary

Avoid large-scale low-value duplication.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Avoid large-scale low-value duplication. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

# Workstream X — Thin Page Prevention

## P02-T337 — Establish Minimum Public Page Value Criteria

Define what makes an indexable page useful enough to exist.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define what makes an indexable page useful enough to exist. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T338 — Prevent Empty Taxonomy Pages from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream X — Thin Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T339 — Prevent Empty Company Pages from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream X — Thin Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T340 — Prevent Empty Topic Pages from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream X — Thin Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T341 — Prevent Placeholder Pages from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream X — Thin Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T342 — Prevent Generated Pages with No Distinct Value from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream X — Thin Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T343 — Define Minimum Question Page Completeness


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T344 — Define Minimum Hub Page Completeness


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T345 — Route Incomplete Content to Appropriate Draft or Noindex State


**Execution:** Execute this task against the current repository in the context of Workstream X — Thin Page Prevention, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Y — Pagination & Faceted Navigation

## P02-T346 — Establish Pagination URL Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T347 — Establish Pagination Canonical Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T348 — Ensure Paginated Content Remains Discoverable


**Execution:** Execute this task against the current repository in the context of Workstream Y — Pagination & Faceted Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T349 — Establish Filter Parameter Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T350 — Establish Sort Parameter Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T351 — Prevent Filter Combinations from Creating Unlimited Indexable URLs


**Execution:** Execute this task against the current repository in the context of Workstream Y — Pagination & Faceted Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T352 — Prevent Sort Variants from Becoming Duplicate Indexable Pages


**Execution:** Execute this task against the current repository in the context of Workstream Y — Pagination & Faceted Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T353 — Ensure Filtered UI Still Links to Canonical Content Entities


**Execution:** Execute this task against the current repository in the context of Workstream Y — Pagination & Faceted Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Z — Search Engine Access & Rendering

## P02-T354 — Validate Public Pages Without Authentication

Search crawlers must not depend on user sessions.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Search crawlers must not depend on user sessions. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T355 — Remove Accidental Authentication Gates from Public Content


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T356 — Validate Public Pages Without Local Storage


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T357 — Validate Public Pages Without Client Hydration for Core Content


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T358 — Ensure Cookie Logic Does Not Hide Primary Public Content


**Execution:** Execute this task against the current repository in the context of Workstream Z — Search Engine Access & Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T359 — Ensure Consent UI Does Not Replace Crawlable Content


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P02-T360 — Prevent Geolocation or Personalization from Changing Canonical Core Content


**Execution:** Execute this task against the current repository in the context of Workstream Z — Search Engine Access & Rendering, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AA — Performance Foundations for SEO

## P02-T361 — Reduce SEO-Critical Server Response Delays

Prioritize public content routes.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Prioritize public content routes. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P02-T362 — Prevent Slow Backend Dependencies from Blocking Static Public Content


**Execution:** Execute this task against the current repository in the context of Workstream AA — Performance Foundations for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T363 — Cache Stable Public Content Appropriately


**Execution:** Execute this task against the current repository in the context of Workstream AA — Performance Foundations for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T364 — Establish Public Route Revalidation Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T365 — Prevent Stale Canonical Metadata


**Execution:** Execute this task against the current repository in the context of Workstream AA — Performance Foundations for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T366 — Prevent Stale Sitemap Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T367 — Prevent Unnecessary Dynamic Rendering

Use static or cached rendering where appropriate.

**Execution:** Execute this task against the current repository in the context of Workstream AA — Performance Foundations for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use static or cached rendering where appropriate. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T368 — Preserve Freshness Where Content Actually Changes


**Execution:** Execute this task against the current repository in the context of Workstream AA — Performance Foundations for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T369 — Optimize Metadata Data Fetching

Avoid duplicate page and metadata fetches where possible.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Avoid duplicate page and metadata fetches where possible. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P02-T370 — Optimize Sitemap Generation Cost

Ensure large content volume remains manageable.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Ensure large content volume remains manageable. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AB — Backend Support for SEO

## P02-T371 — Identify SEO-Critical Backend Dependencies

Determine which public pages require backend data.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Determine which public pages require backend data. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T372 — Stabilize Public Content API Contracts

Prevent unstable responses from breaking indexable pages.

**Execution:** Execute this task against the current repository in the context of Workstream AB — Backend Support for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prevent unstable responses from breaking indexable pages. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T373 — Ensure Public Content APIs Do Not Require Authentication

Where content is intentionally public.

**Execution:** Execute this task against the current repository in the context of Workstream AB — Backend Support for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Where content is intentionally public. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T374 — Ensure Public Content APIs Distinguish Missing Entities Correctly


**Execution:** Execute this task against the current repository in the context of Workstream AB — Backend Support for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T375 — Ensure Public Content APIs Expose Stable Identifiers


**Execution:** Execute this task against the current repository in the context of Workstream AB — Backend Support for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T376 — Ensure Public Content APIs Expose Canonical Slugs Where Required


**Execution:** Execute this task against the current repository in the context of Workstream AB — Backend Support for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T377 — Remove Frontend Slug Guessing Caused by Weak API Contracts


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T378 — Optimize Backend Queries Used by Public Pages


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P02-T379 — Prevent Backend Errors from Generating Indexable Empty Pages


**Execution:** Execute this task against the current repository in the context of Workstream AB — Backend Support for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T380 — Establish Backend Caching for Stable Public Data Where Beneficial


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T381 — Preserve SEO Independence from User-Specific Backend State

Public indexing should not depend on bookmarks or progress APIs.

**Execution:** Execute this task against the current repository in the context of Workstream AB — Backend Support for SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Public indexing should not depend on bookmarks or progress APIs. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AC — Content Source Integration

## P02-T382 — Connect Route Registry to Canonical Content Source


**Execution:** Execute this task against the current repository in the context of Workstream AC — Content Source Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T383 — Connect Sitemap Generation to Canonical Content Source


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T384 — Connect Metadata Generation to Canonical Content Entities


**Execution:** Execute this task against the current repository in the context of Workstream AC — Content Source Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T385 — Connect Breadcrumb Generation to Canonical Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream AC — Content Source Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T386 — Connect Internal Linking to Canonical Entity Relationships


**Execution:** Execute this task against the current repository in the context of Workstream AC — Content Source Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T387 — Prevent Different SEO Systems from Reading Different Content Inventories


**Execution:** Execute this task against the current repository in the context of Workstream AC — Content Source Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T388 — Prevent Deleted Content from Remaining in Sitemaps


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T389 — Prevent New Content from Missing SEO Discovery Systems


**Execution:** Execute this task against the current repository in the context of Workstream AC — Content Source Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T390 — Establish Automatic SEO Participation for New Canonical Entities

New valid content should automatically receive the correct route, metadata and sitemap behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: New valid content should automatically receive the correct route, metadata and sitemap behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream AD — Open Graph & Social Sharing

## P02-T391 — Establish Canonical Open Graph Defaults


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T392 — Establish Open Graph Title Generation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T393 — Establish Open Graph Description Generation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T394 — Establish Open Graph Canonical URL Generation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T395 — Establish Open Graph Image Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P02-T396 — Prevent Broken Social Image URLs


**Execution:** Execute this task against the current repository in the context of Workstream AD — Open Graph & Social Sharing, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T397 — Establish Twitter Card Defaults


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P02-T398 — Remove Duplicate Social Metadata Implementations


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

# Workstream AE — Heading & Document Structure Foundation

## P02-T399 — Establish One Primary H1 Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T400 — Align H1 with Page Search Intent


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P02-T401 — Establish Semantic Heading Hierarchy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T402 — Prevent Heading Levels Used Only for Visual Styling


**Execution:** Execute this task against the current repository in the context of Workstream AE — Heading & Document Structure Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T403 — Prevent Hidden Duplicate H1 Elements


**Execution:** Execute this task against the current repository in the context of Workstream AE — Heading & Document Structure Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T404 — Ensure Question Pages Expose the Actual Question Prominently


**Execution:** Execute this task against the current repository in the context of Workstream AE — Heading & Document Structure Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T405 — Ensure Hub Pages Explain Their Purpose in Visible Content


**Execution:** Execute this task against the current repository in the context of Workstream AE — Heading & Document Structure Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AF — Image & Media SEO Foundation

## P02-T406 — Establish Meaningful Alt Text Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T407 — Prevent Decorative Images from Receiving Keyword-Stuffed Alt Text


**Execution:** Execute this task against the current repository in the context of Workstream AF — Image & Media SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T408 — Ensure Content Images Have Stable URLs


**Execution:** Execute this task against the current repository in the context of Workstream AF — Image & Media SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T409 — Prevent Broken Images from Degrading Public Pages


**Execution:** Execute this task against the current repository in the context of Workstream AF — Image & Media SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T410 — Establish Image Dimension Strategy

Reduce layout shift.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Reduce layout shift. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T411 — Optimize Large Public Content Images


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P02-T412 — Ensure Diagrams Remain Understandable with Supporting Text


**Execution:** Execute this task against the current repository in the context of Workstream AF — Image & Media SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AG — Navigation SEO Foundation

## P02-T413 — Ensure Primary Navigation Uses Crawlable Links


**Execution:** Execute this task against the current repository in the context of Workstream AG — Navigation SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T414 — Ensure Footer Navigation Uses Canonical Links


**Execution:** Execute this task against the current repository in the context of Workstream AG — Navigation SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T415 — Ensure Sidebar Navigation Uses Canonical Links


**Execution:** Execute this task against the current repository in the context of Workstream AG — Navigation SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T416 — Ensure Mobile Navigation Preserves Crawlable Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AG — Navigation SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T417 — Avoid JavaScript-Only Navigation for Core Public Destinations


**Execution:** Execute this task against the current repository in the context of Workstream AG — Navigation SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T418 — Prevent Duplicate Navigation Link Variants


**Execution:** Execute this task against the current repository in the context of Workstream AG — Navigation SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AH — 404 & Removed Content Architecture

## P02-T419 — Rebuild SEO-Correct 404 Behavior


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T420 — Ensure 404 Pages Return 404 Status


**Execution:** Execute this task against the current repository in the context of Workstream AH — 404 & Removed Content Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T421 — Provide Useful Recovery Links on 404 Pages


**Execution:** Execute this task against the current repository in the context of Workstream AH — 404 & Removed Content Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T422 — Avoid Indexable 404-Like Pages


**Execution:** Execute this task against the current repository in the context of Workstream AH — 404 & Removed Content Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T423 — Establish Removed Content Policy

Choose between redirect, 404 and other appropriate handling.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Choose between redirect, 404 and other appropriate handling. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T424 — Prevent Deleted Entities from Resolving to Generic Content


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T425 — Remove Deleted Entities from Sitemaps


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T426 — Remove Internal Links to Deleted Entities


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream AI — Build-Time SEO Validation

## P02-T427 — Build Route Registry Validator


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T428 — Build Duplicate Canonical URL Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T429 — Build Duplicate Slug Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T430 — Build Missing Canonical Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T431 — Build Missing Metadata Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T432 — Build Sitemap Duplication Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T433 — Build Sitemap-to-Indexability Conflict Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T434 — Build Sitemap-to-Canonical Conflict Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T435 — Build Broken Internal Link Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T436 — Build Orphan Page Detector Where Practical


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T437 — Build Redirect Chain Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T438 — Build Internal Route Exposure Detector


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T439 — Build SEO Validation Summary

Produce actionable failures rather than raw logs.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Produce actionable failures rather than raw logs. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

# Workstream AJ — Runtime SEO Validation

## P02-T440 — Validate Representative Public Pages in Production-Like Runtime


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T441 — Validate Canonical Tags from Rendered HTML


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T442 — Validate Robots Metadata from Rendered HTML


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T443 — Validate Structured Data from Rendered HTML


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T444 — Validate Primary Content in Initial HTML


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T445 — Validate HTTP Status Codes


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T446 — Validate Redirect Behavior


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T447 — Validate Sitemap Accessibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T448 — Validate robots.txt Accessibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T449 — Validate No Authentication Dependency for Public Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AK — Search Console & Indexing Readiness

## P02-T450 — Establish Canonical Search Console Property Strategy

Ensure the monitored property matches the canonical hostname architecture.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Ensure the monitored property matches the canonical hostname architecture. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T451 — Establish Sitemap Submission Strategy


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T452 — Establish Indexing Baseline Categories

Track:

* indexed,
* discovered,
* crawled not indexed,
* duplicate,
* redirect,
* not found,
* blocked,
* noindex.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Track: indexed, discovered, crawled not indexed, duplicate, redirect, not found, blocked, noindex. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T453 — Establish Representative URL Inspection Set

Choose examples from every major route family.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Choose examples from every major route family. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T454 — Establish Post-Deployment Indexing Monitoring Procedure


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T455 — Establish Sitemap URL Count Monitoring

Detect unexpected growth or loss.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Detect unexpected growth or loss. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P02-T456 — Establish Indexed-Page Trend Monitoring


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T457 — Establish Crawl Error Monitoring


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T458 — Establish Impression Trend Monitoring by Route Family


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P02-T459 — Establish Query Performance Monitoring

Track emerging search queries.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Track emerging search queries. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P02-T460 — Establish CTR Monitoring by Page Type


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

# Workstream AL — Programmatic SEO Safety

## P02-T461 — Establish Programmatic Page Quality Rules

Scale must not create low-value pages.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Scale must not create low-value pages. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T462 — Require Distinct Search Intent per Indexable Template


**Execution:** Execute this task against the current repository in the context of Workstream AL — Programmatic SEO Safety, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T463 — Require Distinct Visible Content per Indexable Entity


**Execution:** Execute this task against the current repository in the context of Workstream AL — Programmatic SEO Safety, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T464 — Prevent Metadata-Only Page Differentiation

Changing only title and description is insufficient.

**Execution:** Execute this task against the current repository in the context of Workstream AL — Programmatic SEO Safety, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Changing only title and description is insufficient. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T465 — Prevent Empty Taxonomy Expansion


**Execution:** Execute this task against the current repository in the context of Workstream AL — Programmatic SEO Safety, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T466 — Prevent Combinatorial URL Generation


**Execution:** Execute this task against the current repository in the context of Workstream AL — Programmatic SEO Safety, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T467 — Prevent Automatic Indexing of Every Database Record


**Execution:** Execute this task against the current repository in the context of Workstream AL — Programmatic SEO Safety, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T468 — Establish Indexability Quality Gate for New Page Families


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T469 — Establish Programmatic Template Review Process


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AM — Question SEO Foundation

## P02-T470 — Define Canonical Question Identity

Each question must have one stable public identity.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Each question must have one stable public identity. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T471 — Define Question URL Hierarchy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T472 — Define Question Metadata Input Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T473 — Define Question Title Generation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T474 — Define Question Description Generation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T475 — Define Question Canonical Generation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T476 — Define Question Breadcrumb Generation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T477 — Define Question Structured Data Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T478 — Define Question Sitemap Participation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T479 — Define Question Internal-Link Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T480 — Define Question Indexability Quality Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T481 — Prevent Duplicate Questions from Producing Multiple Canonical Pages


**Execution:** Execute this task against the current repository in the context of Workstream AM — Question SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T482 — Preserve Existing Valuable Question URLs During Migration


**Execution:** Execute this task against the current repository in the context of Workstream AM — Question SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AN — Hierarchy Page SEO Foundation

## P02-T483 — Define Domain Page SEO Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T484 — Define Stack Page SEO Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T485 — Define Pillar Page SEO Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T486 — Define Module Page SEO Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T487 — Define Hierarchy Page Visible Introduction Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T488 — Define Hierarchy Page Child-Link Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T489 — Define Hierarchy Page Breadcrumb Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P02-T490 — Define Hierarchy Page Sitemap Requirements


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T491 — Prevent Empty Hierarchy Pages from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream AN — Hierarchy Page SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T492 — Prevent Duplicate Hierarchy Taxonomies


**Execution:** Execute this task against the current repository in the context of Workstream AN — Hierarchy Page SEO Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AO — SEO Security & Integrity

## P02-T493 — Prevent User Input from Controlling Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream AO — SEO Security & Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T494 — Prevent User Input from Injecting Metadata


**Execution:** Execute this task against the current repository in the context of Workstream AO — SEO Security & Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T495 — Prevent Unsafe Structured Data Serialization


**Execution:** Execute this task against the current repository in the context of Workstream AO — SEO Security & Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T496 — Prevent Open Redirects in SEO Routing Logic


**Execution:** Execute this task against the current repository in the context of Workstream AO — SEO Security & Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T497 — Prevent Host Header Manipulation of Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream AO — SEO Security & Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T498 — Prevent Preview Content from Accidental Indexing


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T499 — Prevent Private User Data from Appearing in Public Metadata


**Execution:** Execute this task against the current repository in the context of Workstream AO — SEO Security & Integrity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T500 — Prevent Private User Routes from Sitemap Inclusion


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AP — SEO Legacy Cleanup

## P02-T501 — Create Legacy SEO Replacement Map


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T502 — Consolidate Duplicate Metadata Utilities


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T503 — Consolidate Duplicate Canonical Utilities


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T504 — Consolidate Duplicate Sitemap Systems


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T505 — Consolidate Duplicate Structured Data Utilities


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T506 — Consolidate Duplicate Breadcrumb Generators


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T507 — Consolidate Duplicate Slug Utilities


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T508 — Consolidate Duplicate Route Constants


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P02-T509 — Remove Hard-Coded Production Origins


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T510 — Remove Obsolete SEO Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P02-T511 — Remove Obsolete Sitemap Files


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T512 — Remove Obsolete Redirect Rules


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P02-T513 — Remove Obsolete Rewrite Rules


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P02-T514 — Remove Legacy Indexability Hacks


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P02-T515 — Prevent Legacy SEO Utility Reintroduction


**Execution:** Execute this task against the current repository in the context of Workstream AP — SEO Legacy Cleanup, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AQ — Representative Route Migration

## P02-T516 — Migrate Homepage to Canonical SEO Architecture


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T517 — Migrate One Domain Page to Canonical SEO Architecture


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T518 — Migrate One Stack Page to Canonical SEO Architecture


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T519 — Migrate One Pillar Page to Canonical SEO Architecture


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T520 — Migrate One Module Page to Canonical SEO Architecture


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T521 — Migrate One Question Page to Canonical SEO Architecture


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T522 — Migrate One Topic Page to Canonical SEO Architecture


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P02-T523 — Migrate One Company Page to Canonical SEO Architecture


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P02-T524 — Migrate One DSA Page to Canonical SEO Architecture


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P02-T525 — Validate Representative Route Family Consistency


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T526 — Fix Root Architecture Defects Found During Representative Migration

Do not patch representative pages locally when the defect belongs to the SEO foundation.

**Execution:** Execute this task against the current repository in the context of Workstream AQ — Representative Route Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not patch representative pages locally when the defect belongs to the SEO foundation. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AR — SEO Architecture Regression Protection

## P02-T527 — Add Canonical URL Unit Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T528 — Add Route Registry Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T529 — Add Slug Normalization Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T530 — Add Indexability Policy Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T531 — Add Metadata Factory Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T532 — Add Sitemap Generation Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T533 — Add Redirect Registry Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T534 — Add Structured Data Coverage for Critical Templates


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P02-T535 — Add Internal Link Integrity Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T536 — Add HTTP Status Regression Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T537 — Add Noindex/Sitemap Conflict Protection


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T538 — Add Canonical/Sitemap Conflict Protection


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream AS — Phase 02 Consolidation

## P02-T539 — Produce Canonical Route Registry Documentation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T540 — Produce Canonical URL Architecture Documentation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T541 — Produce Indexability Policy Documentation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T542 — Produce Metadata Template Documentation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P02-T543 — Produce Sitemap Architecture Documentation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T544 — Produce Structured Data Policy Documentation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P02-T545 — Produce Internal Linking Architecture Documentation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T546 — Publish Legacy-to-V2 SEO Migration Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P02-T547 — Update V2 Technical Implementation Plan

Record the implemented SEO architecture.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Record the implemented SEO architecture. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P02-T548 — Update V2 Decision Log

Record major URL, indexing and SEO decisions.

**Execution:** Execute this task against the current repository in the context of Workstream AS — Phase 02 Consolidation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Record major URL, indexing and SEO decisions. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T549 — Update V2 Issue Log

Record unresolved route-specific SEO defects.

**Execution:** Execute this task against the current repository in the context of Workstream AS — Phase 02 Consolidation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Record unresolved route-specific SEO defects. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P02-T550 — Produce Phase 02 Completion Report

Document:

* canonical architecture,
* route registry,
* URL system,
* metadata system,
* sitemap system,
* indexability system,
* structured data,
* internal linking,
* remaining route migrations.

**Execution:** Execute this task against the current repository in the context of Workstream AS — Phase 02 Consolidation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document: canonical architecture, route registry, URL system, metadata system, sitemap system, indexability system, structured data, internal linking, remaining route migrations. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P02-T551 — Approve SEO Foundation for Mass Route Migration

Confirm later phases can migrate pages without creating new SEO architectures.

**Execution:** Execute this task against the current repository in the context of Workstream AS — Phase 02 Consolidation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Confirm later phases can migrate pages without creating new SEO architectures. # Phase 02 Exit Criteria Phase 02 is complete when Interview Explainer has: one canonical production origin, one public route registry, one URL-generation architecture, one slug policy, one entity-resolution model, one redirect architecture, one rewrite policy, one indexability system, one robots architecture, one metadata factory, one tit Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Phase 02 Exit Criteria

Phase 02 is complete when Interview Explainer has:

* one canonical production origin,
* one public route registry,
* one URL-generation architecture,
* one slug policy,
* one entity-resolution model,
* one redirect architecture,
* one rewrite policy,
* one indexability system,
* one robots architecture,
* one metadata factory,
* one title architecture,
* one description architecture,
* one canonical-tag architecture,
* one sitemap system,
* one structured-data system,
* one breadcrumb hierarchy,
* crawlable server-visible public content,
* correct HTTP status behavior,
* one internal-linking architecture,
* duplicate URL prevention,
* thin-page protection,
* programmatic SEO quality rules,
* backend support where public SEO depends on backend data,
* automated validation for major SEO failures,
* representative route families proving the architecture works.

Phase 02 does **not** require every public route to be fully migrated.

That happens in later route-family and repository-wide SEO phases.

Phase 02 creates the root architecture that makes correct SEO the default.

---

# Phase 02 Core Principle

```text
DO NOT MANUALLY SEO 10,000+ PAGES

BUILD A SYSTEM WHERE:

ONE CONTENT ENTITY
        ↓
ONE STABLE IDENTITY
        ↓
ONE CANONICAL URL
        ↓
ONE INDEXABILITY DECISION
        ↓
ONE METADATA CONTRACT
        ↓
ONE SITEMAP ENTRY
        ↓
ONE INTERNAL DISCOVERY GRAPH
```

The intended transformation is:

```text
CURRENT RISK

Fragmented routes
Multiple URL builders
Potential aliases
Incomplete sitemap coverage
Low indexed-page coverage
Possible orphan pages
Scattered metadata
Unclear canonical ownership
Client-dependent content
SEO fixes performed page by page

        ↓

V2

Canonical route registry
Stable entity identity
One URL per public entity
Correct redirects
Correct 404 behavior
Central metadata generation
Central indexability policy
Canonical sitemap generation
Server-visible public content
Strong crawl hierarchy
Automatic SEO participation for valid new content
Automated detection of structural SEO failures
```

---

# Important Boundary

Phase 02 must not attempt to manipulate search engines into indexing every possible URL.

The goal is:

```text
NOT

MAXIMUM NUMBER OF URLS

BUT

MAXIMUM NUMBER OF
USEFUL
CANONICAL
DISCOVERABLE
INDEXABLE
HIGH-VALUE PAGES
```

A technically indexable page is not automatically a page that should be indexed.

---

# Next Phase

```text
PHASE 03

GLOBAL APPLICATION SHELL
&
SHARED COMPONENT MIGRATION
```

Phase 03 takes the canonical UI system from Phase 01 and begins applying it to the actual global product shell:

* root layout,
* header,
* desktop navigation,
* mobile navigation,
* global search entry,
* breadcrumbs,
* sidebars,
* footer,
* loading,
* errors,
* 404,
* theme controls,
* global responsive behavior.
