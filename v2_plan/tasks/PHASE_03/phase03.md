# PHASE 03 — GLOBAL APPLICATION SHELL & SHARED COMPONENT MIGRATION

## Phase Objective

Rebuild and migrate the global application shell of Interview Explainer onto the canonical V2 UI and SEO foundations.

This phase covers the shared interface surrounding almost every route:

* root layouts,
* public application shell,
* global header,
* desktop navigation,
* mobile navigation,
* global search entry,
* global content containers,
* breadcrumbs,
* contextual sidebars,
* footer,
* theme controls,
* authentication entry points,
* global loading states,
* global error handling,
* 404 experience,
* responsive shell behavior,
* shared navigation components,
* shared route transitions,
* legacy shell removal.

The goal is not to redesign every individual page.

The goal is to ensure that every page is rendered inside a consistent, lightweight, responsive and SEO-safe global architecture.

The architectural model should become:

```text
ROOT APPLICATION
        ↓
GLOBAL PROVIDERS
        ↓
PUBLIC / PRIVATE LAYOUT BOUNDARY
        ↓
GLOBAL SHELL
        ↓
HEADER + NAVIGATION
        ↓
PAGE-SPECIFIC LAYOUT
        ↓
PAGE CONTENT
        ↓
CONTEXTUAL NAVIGATION
        ↓
FOOTER
```

The shell must not dominate the content.

For Interview Explainer, the primary product is the interview-preparation content itself.

Therefore:

```text
THE SHELL SHOULD HELP USERS
FIND
UNDERSTAND
NAVIGATE
AND CONTINUE

IT SHOULD NOT COMPETE
WITH THE CONTENT
```

---

# Workstream A — Global Shell Architecture

## P03-T001 — Define Canonical Global Shell Architecture

Establish the permanent hierarchy between:

* root layout,
* providers,
* public shell,
* authenticated shell,
* route-family layouts,
* page content.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish the permanent hierarchy between: root layout, providers, public shell, authenticated shell, route-family layouts, page content. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T002 — Define Public and Private Shell Boundaries

Separate:

* public SEO pages,
* authentication pages,
* dashboard,
* practice application,
* future interview application surfaces.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Separate: public SEO pages, authentication pages, dashboard, practice application, future interview application surfaces. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T003 — Define Shell Ownership Responsibilities

Determine which layer owns:

* header,
* footer,
* navigation,
* breadcrumbs,
* sidebar,
* theme controls,
* search entry.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Determine which layer owns: header, footer, navigation, breadcrumbs, sidebar, theme controls, search entry. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T004 — Prevent Route Pages from Rebuilding Global Shell Elements

Pages should consume the canonical shell rather than recreate navigation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Pages should consume the canonical shell rather than recreate navigation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T005 — Establish Nested Layout Strategy

Use route layouts intentionally without unnecessary duplication.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use route layouts intentionally without unnecessary duplication. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T006 — Establish Shell Composition Contracts

Define the supported composition patterns.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define the supported composition patterns. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T007 — Establish Shell Variant Strategy

Support legitimate differences between:

* public content,
* marketing,
* application,
* authentication.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Support legitimate differences between: public content, marketing, application, authentication. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T008 — Prevent Unlimited Shell Variants

Avoid route-by-route shell divergence.

**Execution:** Execute this task against the current repository in the context of Workstream A — Global Shell Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid route-by-route shell divergence. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T009 — Define Global Shell Server/Client Boundaries

Keep the shell server-compatible wherever possible.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Keep the shell server-compatible wherever possible. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T010 — Document Canonical Shell Architecture

Record the final hierarchy for later route migrations.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Record the final hierarchy for later route migrations. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream B — Root Layout Rebuild

## P03-T011 — Audit Existing Root Layout Responsibilities

Identify:

* providers,
* metadata,
* fonts,
* theme behavior,
* scripts,
* shell components.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Identify: providers, metadata, fonts, theme behavior, scripts, shell components. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T012 — Simplify Root Layout

Keep only genuinely global responsibilities.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Keep only genuinely global responsibilities. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P03-T013 — Remove Route-Specific UI from Root Layout

Prevent unnecessary global rendering.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Prevent unnecessary global rendering. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P03-T014 — Consolidate Global Providers

Remove duplicate provider nesting.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Remove duplicate provider nesting. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P03-T015 — Order Global Providers Correctly

Ensure provider dependencies are explicit.

**Execution:** Execute this task against the current repository in the context of Workstream B — Root Layout Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Ensure provider dependencies are explicit. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T016 — Remove Obsolete Global Providers

Delete confirmed unused infrastructure.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Delete confirmed unused infrastructure. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P03-T017 — Minimize Client Boundaries in Root Layout

Avoid making the entire application client-rendered.

**Execution:** Execute this task against the current repository in the context of Workstream B — Root Layout Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid making the entire application client-rendered. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T018 — Integrate Canonical Font Architecture

Use the Phase 01 typography system.

**Execution:** Execute this task against the current repository in the context of Workstream B — Root Layout Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use the Phase 01 typography system. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T019 — Integrate Canonical Theme Architecture

Use one theme provider.

**Execution:** Execute this task against the current repository in the context of Workstream B — Root Layout Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use one theme provider. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T020 — Integrate Canonical Metadata Base

Use the Phase 02 SEO architecture.

**Execution:** Execute this task against the current repository in the context of Workstream B — Root Layout Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use the Phase 02 SEO architecture. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T021 — Establish Root Body Styling

Apply canonical:

* background,
* text,
* font,
* minimum height.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Apply canonical: background, text, font, minimum height. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T022 — Prevent Global Horizontal Overflow

Fix root-level overflow causes.

**Execution:** Execute this task against the current repository in the context of Workstream B — Root Layout Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Fix root-level overflow causes. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T023 — Establish Root Focus Behavior

Support keyboard navigation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Support keyboard navigation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T024 — Establish Root Skip Navigation Support

Allow users to bypass repeated navigation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Allow users to bypass repeated navigation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T025 — Establish Main Content Landmark

Ensure semantic page structure.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Ensure semantic page structure. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream C — Public Shell Rebuild

## P03-T026 — Build Canonical Public Shell

Create the shared shell for public content routes.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create the shared shell for public content routes. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T027 — Define Public Shell Width Behavior

Separate shell width from reading-content width.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Separate shell width from reading-content width. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T028 — Define Public Shell Vertical Structure

Establish predictable header, content and footer flow.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish predictable header, content and footer flow. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T029 — Prevent Public Shell from Forcing Card Layouts

Allow page content to remain structurally flexible.

**Execution:** Execute this task against the current repository in the context of Workstream C — Public Shell Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Allow page content to remain structurally flexible. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T030 — Prevent Public Shell from Adding Excessive Background Layers

Keep the global visual hierarchy calm.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Keep the global visual hierarchy calm. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T031 — Support Full-Width Page Sections Where Required

Allow controlled breakouts.

**Execution:** Execute this task against the current repository in the context of Workstream C — Public Shell Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Allow controlled breakouts. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T032 — Support Reading-Focused Routes

Provide minimal surrounding distraction.

**Execution:** Execute this task against the current repository in the context of Workstream C — Public Shell Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Provide minimal surrounding distraction. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T033 — Support Hub-Focused Routes

Allow wider discovery layouts.

**Execution:** Execute this task against the current repository in the context of Workstream C — Public Shell Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Allow wider discovery layouts. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T034 — Support Contextual Sidebar Routes

Provide consistent sidebar integration.

**Execution:** Execute this task against the current repository in the context of Workstream C — Public Shell Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Provide consistent sidebar integration. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T035 — Support Routes Without Sidebars

Do not force sidebars onto every page.

**Execution:** Execute this task against the current repository in the context of Workstream C — Public Shell Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not force sidebars onto every page. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T036 — Establish Public Shell Responsive Behavior

Define desktop, tablet and mobile behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define desktop, tablet and mobile behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream D — Global Header Architecture

## P03-T037 — Rebuild Canonical Global Header

Create one permanent public header.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create one permanent public header. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T038 — Define Header Information Hierarchy

Prioritize:

1. brand,
2. primary navigation,
3. search,
4. user actions.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prioritize: 1. brand, 2. primary navigation, 3. search, 4. user actions. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T039 — Reduce Header Visual Density

Remove unnecessary controls and competing elements.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Remove unnecessary controls and competing elements. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P03-T040 — Establish Header Height

Use a stable and restrained global dimension.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use a stable and restrained global dimension. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T041 — Establish Header Background Behavior

Ensure readability without excessive visual weight.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Ensure readability without excessive visual weight. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T042 — Establish Header Border Behavior

Use subtle separation only when necessary.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use subtle separation only when necessary. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T043 — Establish Header Sticky Behavior

Use sticky positioning intentionally.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use sticky positioning intentionally. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T044 — Prevent Sticky Header Content Obstruction

Account for anchor links and scroll positioning.

**Execution:** Execute this task against the current repository in the context of Workstream D — Global Header Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Account for anchor links and scroll positioning. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T045 — Prevent Header Layout Shift

Reserve stable dimensions.

**Execution:** Execute this task against the current repository in the context of Workstream D — Global Header Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Reserve stable dimensions. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T046 — Keep Header Server-Compatible Where Possible

Isolate only interactive controls.

**Execution:** Execute this task against the current repository in the context of Workstream D — Global Header Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Isolate only interactive controls. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T047 — Remove Duplicate Header Implementations

Migrate route families toward one canonical header.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Migrate route families toward one canonical header. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P03-T048 — Remove Legacy Header Variants

Delete obsolete implementations after migration.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Delete obsolete implementations after migration. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

# Workstream E — Brand & Logo Treatment

## P03-T049 — Standardize Global Brand Mark

Use one canonical visual implementation.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Use one canonical visual implementation. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T050 — Standardize Brand Wordmark

Ensure consistent typography and spacing.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Ensure consistent typography and spacing. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T051 — Standardize Header Logo Dimensions

Prevent layout instability.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Prevent layout instability. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T052 — Ensure Brand Link Targets Canonical Homepage


**Execution:** Execute this task against the current repository in the context of Workstream E — Brand & Logo Treatment, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T053 — Ensure Brand Mark Works in Light Theme


**Execution:** Execute this task against the current repository in the context of Workstream E — Brand & Logo Treatment, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T054 — Ensure Brand Mark Works in Dark Theme


**Execution:** Execute this task against the current repository in the context of Workstream E — Brand & Logo Treatment, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T055 — Prevent Oversized Brand Presence

Keep navigation content-focused.

**Execution:** Execute this task against the current repository in the context of Workstream E — Brand & Logo Treatment, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Keep navigation content-focused. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T056 — Remove Duplicate Logo Assets Where Obsolete


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P2

---

# Workstream F — Desktop Primary Navigation

## P03-T057 — Define Canonical Primary Navigation Taxonomy

Choose only major user destinations.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Choose only major user destinations. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T058 — Reduce Top-Level Navigation Overload

Avoid exposing the entire site hierarchy in the header.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Avoid exposing the entire site hierarchy in the header. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P03-T059 — Build Canonical Desktop Navigation

Use the Phase 01 navigation primitives.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Use the Phase 01 navigation primitives. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T060 — Implement Active Navigation State

Show the current section clearly.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Show the current section clearly. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T061 — Implement Accessible Navigation Semantics


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T062 — Ensure Navigation Uses Canonical URLs

Use Phase 02 route generation.

**Execution:** Execute this task against the current repository in the context of Workstream F — Desktop Primary Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use Phase 02 route generation. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T063 — Prevent Navigation Links from Targeting Redirects


**Execution:** Execute this task against the current repository in the context of Workstream F — Desktop Primary Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T064 — Prevent JavaScript-Only Core Navigation

Use real crawlable links.

**Execution:** Execute this task against the current repository in the context of Workstream F — Desktop Primary Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use real crawlable links. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T065 — Standardize Navigation Item Spacing


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T066 — Standardize Navigation Hover Behavior

Use restrained interaction feedback.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Use restrained interaction feedback. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T067 — Standardize Navigation Focus Behavior


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P03-T068 — Prevent Excessive Icons in Primary Navigation


**Execution:** Execute this task against the current repository in the context of Workstream F — Desktop Primary Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T069 — Prevent Decorative Badges in Primary Navigation


**Execution:** Execute this task against the current repository in the context of Workstream F — Desktop Primary Navigation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T070 — Remove Duplicate Desktop Navigation Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream G — Navigation Dropdowns & Mega Menus

## P03-T071 — Determine Whether Mega Navigation Is Actually Required

Do not implement complexity without a clear discovery benefit.

**Execution:** Execute this task against the current repository in the context of Workstream G — Navigation Dropdowns & Mega Menus, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not implement complexity without a clear discovery benefit. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T072 — Define Dropdown Navigation Use Cases

Use only for meaningful grouped navigation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use only for meaningful grouped navigation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T073 — Build Canonical Navigation Dropdown


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T074 — Build Canonical Navigation Group Structure


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T075 — Ensure Dropdown Links Are Crawlable


**Execution:** Execute this task against the current repository in the context of Workstream G — Navigation Dropdowns & Mega Menus, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T076 — Ensure Keyboard Navigation


**Execution:** Execute this task against the current repository in the context of Workstream G — Navigation Dropdowns & Mega Menus, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T077 — Ensure Escape-Key Closing


**Execution:** Execute this task against the current repository in the context of Workstream G — Navigation Dropdowns & Mega Menus, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T078 — Ensure Focus Restoration


**Execution:** Execute this task against the current repository in the context of Workstream G — Navigation Dropdowns & Mega Menus, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T079 — Prevent Hover-Only Accessibility


**Execution:** Execute this task against the current repository in the context of Workstream G — Navigation Dropdowns & Mega Menus, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T080 — Prevent Giant Link Dumps

Keep navigation curated.

**Execution:** Execute this task against the current repository in the context of Workstream G — Navigation Dropdowns & Mega Menus, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Keep navigation curated. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T081 — Ensure Dropdown Mobile Strategy Is Separate

Do not force desktop dropdown behavior onto mobile.

**Execution:** Execute this task against the current repository in the context of Workstream G — Navigation Dropdowns & Mega Menus, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not force desktop dropdown behavior onto mobile. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream H — Mobile Navigation Rebuild

## P03-T082 — Rebuild Canonical Mobile Navigation

Create one coherent mobile navigation system.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create one coherent mobile navigation system. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T083 — Define Mobile Navigation Entry Control

Use a clear accessible trigger.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use a clear accessible trigger. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T084 — Build Mobile Navigation Drawer

Use the canonical drawer primitive.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Use the canonical drawer primitive. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T085 — Define Mobile Navigation Hierarchy

Prioritize major destinations.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prioritize major destinations. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T086 — Implement Nested Mobile Navigation

Support deeper sections without displaying everything simultaneously.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support deeper sections without displaying everything simultaneously. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T087 — Implement Mobile Navigation Active State


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T088 — Ensure Mobile Navigation Uses Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream H — Mobile Navigation Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T089 — Ensure Mobile Navigation Keyboard Accessibility


**Execution:** Execute this task against the current repository in the context of Workstream H — Mobile Navigation Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T090 — Ensure Mobile Navigation Screen Reader Accessibility


**Execution:** Execute this task against the current repository in the context of Workstream H — Mobile Navigation Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T091 — Prevent Background Scrolling While Drawer Is Open


**Execution:** Execute this task against the current repository in the context of Workstream H — Mobile Navigation Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T092 — Restore Focus After Drawer Close


**Execution:** Execute this task against the current repository in the context of Workstream H — Mobile Navigation Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T093 — Ensure Mobile Navigation Fits Short Viewports


**Execution:** Execute this task against the current repository in the context of Workstream H — Mobile Navigation Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T094 — Ensure Mobile Navigation Is Scrollable Internally


**Execution:** Execute this task against the current repository in the context of Workstream H — Mobile Navigation Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T095 — Prevent Oversized Mobile Navigation Controls

Maintain touch accessibility without wasting space.

**Execution:** Execute this task against the current repository in the context of Workstream H — Mobile Navigation Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Maintain touch accessibility without wasting space. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T096 — Remove Duplicate Mobile Navigation Systems


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream I — Bottom Navigation Decision

## P03-T097 — Evaluate Whether Bottom Navigation Belongs in Public Content

Do not add mobile-app patterns automatically.

**Execution:** Execute this task against the current repository in the context of Workstream I — Bottom Navigation Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not add mobile-app patterns automatically. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T098 — Separate Public Navigation from Authenticated App Navigation

A dashboard may justify bottom navigation where public reading pages do not.

**Execution:** Execute this task against the current repository in the context of Workstream I — Bottom Navigation Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: A dashboard may justify bottom navigation where public reading pages do not. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T099 — Prevent Duplicate Mobile Navigation Layers

Avoid drawer plus bottom bar plus floating actions competing simultaneously.

**Execution:** Execute this task against the current repository in the context of Workstream I — Bottom Navigation Decision, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid drawer plus bottom bar plus floating actions competing simultaneously. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T100 — Document Final Mobile Navigation Decision


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream J — Global Search Entry

## P03-T101 — Define Global Search Entry Strategy

Decide how users enter search from desktop and mobile.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Decide how users enter search from desktop and mobile. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T102 — Integrate Canonical Search Input Foundation

Use Phase 01 components.

**Execution:** Execute this task against the current repository in the context of Workstream J — Global Search Entry, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use Phase 01 components. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T103 — Keep Header Search Visually Proportionate

Do not let search dominate every page.

**Execution:** Execute this task against the current repository in the context of Workstream J — Global Search Entry, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not let search dominate every page. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T104 — Implement Desktop Search Entry


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T105 — Implement Mobile Search Entry


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T106 — Implement Search Keyboard Shortcut

Where appropriate.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Where appropriate. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P03-T107 — Implement Accessible Search Labels


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T108 — Implement Search Clear Behavior


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T109 — Implement Search Loading Feedback


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T110 — Implement Search Error Feedback


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T111 — Ensure Search Results Use Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream J — Global Search Entry, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T112 — Prevent Search Query URLs from Becoming Uncontrolled Indexable Pages

Use Phase 02 indexability rules.

**Execution:** Execute this task against the current repository in the context of Workstream J — Global Search Entry, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use Phase 02 indexability rules. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T113 — Remove Duplicate Search Entry Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream K — Header User Actions

## P03-T114 — Define Anonymous User Header Actions

Keep the action set minimal.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Keep the action set minimal. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T115 — Define Authenticated User Header Actions

Avoid overloading the header.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Avoid overloading the header. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T116 — Standardize Sign-In Entry


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T117 — Standardize Sign-Up Entry


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T118 — Standardize Dashboard Entry


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T119 — Standardize Profile Menu Entry


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T120 — Prevent Authentication State Layout Shift

Reserve predictable header space where possible.

**Execution:** Execute this task against the current repository in the context of Workstream K — Header User Actions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Reserve predictable header space where possible. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T121 — Prevent User State from Blocking Public Shell Rendering


**Execution:** Execute this task against the current repository in the context of Workstream K — Header User Actions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T122 — Handle Authentication Loading Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream K — Header User Actions, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T123 — Consolidate Duplicate User Menu Components


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

# Workstream L — Theme Control Integration

## P03-T124 — Integrate Canonical Theme Control

Use Phase 01 theme infrastructure.

**Execution:** Execute this task against the current repository in the context of Workstream L — Theme Control Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use Phase 01 theme infrastructure. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T125 — Define Theme Control Placement

Avoid unnecessary duplication.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Avoid unnecessary duplication. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T126 — Support Light Theme Selection


**Execution:** Execute this task against the current repository in the context of Workstream L — Theme Control Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T127 — Support Dark Theme Selection


**Execution:** Execute this task against the current repository in the context of Workstream L — Theme Control Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T128 — Support System Theme Selection Where Exposed


**Execution:** Execute this task against the current repository in the context of Workstream L — Theme Control Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T129 — Ensure Accessible Theme Control Labels


**Execution:** Execute this task against the current repository in the context of Workstream L — Theme Control Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T130 — Prevent Theme Flash During Shell Rendering


**Execution:** Execute this task against the current repository in the context of Workstream L — Theme Control Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T131 — Remove Duplicate Theme Toggles


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream M — Global Page Container Migration

## P03-T132 — Replace Legacy Global Width Containers

Use canonical Phase 01 containers.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use canonical Phase 01 containers. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P03-T133 — Establish Standard Public Page Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T134 — Establish Reading Page Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T135 — Establish Wide Hub Page Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T136 — Establish Application Page Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T137 — Standardize Responsive Page Gutters


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P03-T138 — Remove Arbitrary Max-Width Definitions from Shared Layouts


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P03-T139 — Remove Duplicate Container Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P03-T140 — Prevent Nested Container Padding Duplication


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream N — Breadcrumb Integration

## P03-T141 — Integrate Canonical Breadcrumb Component

Use Phase 01 UI and Phase 02 hierarchy.

**Execution:** Execute this task against the current repository in the context of Workstream N — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use Phase 01 UI and Phase 02 hierarchy. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T142 — Generate Breadcrumbs from Canonical Route Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream N — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T143 — Align Visual Breadcrumbs with Structured Data


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P03-T144 — Use Canonical URLs in Breadcrumbs


**Execution:** Execute this task against the current repository in the context of Workstream N — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T145 — Define Breadcrumb Placement

Keep hierarchy visible but secondary.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Keep hierarchy visible but secondary. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T146 — Define Breadcrumb Spacing

Prevent excessive vertical overhead.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent excessive vertical overhead. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T147 — Define Mobile Breadcrumb Behavior

Avoid wrapping into large multi-line blocks.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Avoid wrapping into large multi-line blocks. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T148 — Handle Deep Hierarchies Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream N — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T149 — Prevent Breadcrumb Duplication Across Nested Layouts


**Execution:** Execute this task against the current repository in the context of Workstream N — Breadcrumb Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T150 — Remove Legacy Breadcrumb Implementations


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream O — Global Sidebar Architecture

## P03-T151 — Define Sidebar Use Cases

Separate:

* content hierarchy sidebar,
* application navigation sidebar,
* contextual information sidebar.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Separate: content hierarchy sidebar, application navigation sidebar, contextual information sidebar. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T152 — Prevent One Universal Sidebar from Serving Every Purpose


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T153 — Build Canonical Content Navigation Sidebar


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T154 — Build Canonical Application Sidebar Foundation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T155 — Build Canonical Contextual Sidebar Foundation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T156 — Define Sidebar Width Tokens


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T157 — Define Sidebar Sticky Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T158 — Define Sidebar Scroll Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T159 — Prevent Multiple Independent Page Scrollbars Where Possible


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T160 — Define Sidebar Collapse Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T161 — Define Mobile Sidebar Transformation

Convert to drawer, accordion or inline navigation based on context.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Convert to drawer, accordion or inline navigation based on context. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T162 — Prevent Desktop Sidebar Assumptions on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T163 — Standardize Sidebar Navigation Items


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P03-T164 — Standardize Sidebar Active States


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P03-T165 — Standardize Sidebar Nested Hierarchy


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P03-T166 — Prevent Excessive Sidebar Colour


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T167 — Prevent Excessive Sidebar Borders


**Execution:** Execute this task against the current repository in the context of Workstream O — Global Sidebar Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T168 — Remove Duplicate Sidebar Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream P — Content Tree Navigation Foundation

## P03-T169 — Define Canonical Content Tree Data Contract

Represent:

* stack,
* pillar,
* module,
* question.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Represent: stack, pillar, module, question. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T170 — Build Canonical Content Tree Renderer


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T171 — Implement Current Route Highlighting


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T172 — Implement Parent Expansion Behavior


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T173 — Implement Manual Expand and Collapse


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T174 — Implement Keyboard Navigation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T175 — Implement Accessible Tree Semantics Where Appropriate


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T176 — Ensure Content Tree Links Use Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream P — Content Tree Navigation Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T177 — Prevent Content Tree from Rendering Thousands of Items Unnecessarily


**Execution:** Execute this task against the current repository in the context of Workstream P — Content Tree Navigation Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T178 — Define Large Tree Performance Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T179 — Define Mobile Content Tree Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T180 — Consolidate Legacy Topic Tree Components


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

# Workstream Q — Contextual Right Sidebar Foundation

## P03-T181 — Define Right Sidebar Eligibility

Only use when secondary information is genuinely useful.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Only use when secondary information is genuinely useful. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T182 — Prevent Mandatory Right Sidebar on Every Content Page


**Execution:** Execute this task against the current repository in the context of Workstream Q — Contextual Right Sidebar Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T183 — Build Canonical Contextual Sidebar Container


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T184 — Support Table of Contents


**Execution:** Execute this task against the current repository in the context of Workstream Q — Contextual Right Sidebar Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T185 — Support Question Metadata


**Execution:** Execute this task against the current repository in the context of Workstream Q — Contextual Right Sidebar Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T186 — Support Related Content


**Execution:** Execute this task against the current repository in the context of Workstream Q — Contextual Right Sidebar Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T187 — Support Progress Information Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream Q — Contextual Right Sidebar Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P03-T188 — Define Sticky Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T189 — Define Collapse Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T190 — Define Mobile Repositioning

Move secondary information into logical content positions.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Move secondary information into logical content positions. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T191 — Prevent Sidebar Content Duplication


**Execution:** Execute this task against the current repository in the context of Workstream Q — Contextual Right Sidebar Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream R — Table of Contents Foundation

## P03-T192 — Build Canonical Table of Contents Component


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T193 — Generate TOC from Semantic Headings


**Execution:** Execute this task against the current repository in the context of Workstream R — Table of Contents Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T194 — Ensure Stable Heading Anchors


**Execution:** Execute this task against the current repository in the context of Workstream R — Table of Contents Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T195 — Account for Sticky Header Offset


**Execution:** Execute this task against the current repository in the context of Workstream R — Table of Contents Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T196 — Implement Active Section Highlighting Where Useful


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P03-T197 — Avoid Excessive TOC Depth


**Execution:** Execute this task against the current repository in the context of Workstream R — Table of Contents Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T198 — Define Mobile TOC Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T199 — Prevent Duplicate TOC Implementations


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

# Workstream S — Footer Rebuild

## P03-T200 — Rebuild Canonical Global Footer

Create one restrained footer.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create one restrained footer. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T201 — Define Footer Information Architecture

Include only useful destinations.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Include only useful destinations. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T202 — Define Footer Navigation Groups


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T203 — Ensure Footer Links Use Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream S — Footer Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T204 — Prevent Footer Link Spam

Avoid turning the footer into an SEO link dump.

**Execution:** Execute this task against the current repository in the context of Workstream S — Footer Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Avoid turning the footer into an SEO link dump. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T205 — Include Essential Company and Legal Links


**Execution:** Execute this task against the current repository in the context of Workstream S — Footer Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T206 — Include Major Product Discovery Links


**Execution:** Execute this task against the current repository in the context of Workstream S — Footer Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T207 — Standardize Footer Brand Treatment


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P03-T208 — Standardize Footer Typography


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T209 — Standardize Footer Spacing


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P03-T210 — Ensure Footer Mobile Responsiveness


**Execution:** Execute this task against the current repository in the context of Workstream S — Footer Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T211 — Remove Excessive Decorative Footer Elements


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P03-T212 — Remove Duplicate Footer Implementations


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream T — Global Loading Architecture

## P03-T213 — Define Global Loading Philosophy

Prefer stable layout-preserving feedback.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prefer stable layout-preserving feedback. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T214 — Build Root Loading State


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T215 — Build Public Shell Loading State


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T216 — Build Route-Family Loading Foundation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T217 — Preserve Header Stability During Loading


**Execution:** Execute this task against the current repository in the context of Workstream T — Global Loading Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T218 — Preserve Main Layout Dimensions During Loading


**Execution:** Execute this task against the current repository in the context of Workstream T — Global Loading Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T219 — Avoid Full-Screen Spinners for Normal Content Navigation


**Execution:** Execute this task against the current repository in the context of Workstream T — Global Loading Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T220 — Replace Shared Plain “Loading...” Text


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P03-T221 — Prevent Loading Skeleton Overanimation


**Execution:** Execute this task against the current repository in the context of Workstream T — Global Loading Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P03-T222 — Respect Reduced Motion


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

# Workstream U — Global Error Architecture

## P03-T223 — Define Global Error Hierarchy

Separate:

* recoverable component errors,
* route errors,
* root application failures.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Separate: recoverable component errors, route errors, root application failures. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T224 — Build Canonical Route Error Experience


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T225 — Build Canonical Root Error Experience


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T226 — Provide Useful Recovery Actions


**Execution:** Execute this task against the current repository in the context of Workstream U — Global Error Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T227 — Avoid Exposing Internal Error Details


**Execution:** Execute this task against the current repository in the context of Workstream U — Global Error Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T228 — Preserve Navigation During Recoverable Route Errors

Where architecture allows.

**Execution:** Execute this task against the current repository in the context of Workstream U — Global Error Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Where architecture allows. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T229 — Distinguish Error from Not Found


**Execution:** Execute this task against the current repository in the context of Workstream U — Global Error Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T230 — Distinguish Temporary Backend Failure from Missing Content


**Execution:** Execute this task against the current repository in the context of Workstream U — Global Error Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T231 — Remove Duplicate Error Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

# Workstream V — 404 Experience Rebuild

## P03-T232 — Rebuild Canonical 404 Page


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T233 — Keep 404 Visual Design Consistent with V2


**Execution:** Execute this task against the current repository in the context of Workstream V — 404 Experience Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T234 — Provide Homepage Recovery Link


**Execution:** Execute this task against the current repository in the context of Workstream V — 404 Experience Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T235 — Provide Search Recovery


**Execution:** Execute this task against the current repository in the context of Workstream V — 404 Experience Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T236 — Provide Relevant Major Hub Links


**Execution:** Execute this task against the current repository in the context of Workstream V — 404 Experience Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T237 — Avoid Overloading 404 with Content


**Execution:** Execute this task against the current repository in the context of Workstream V — 404 Experience Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T238 — Ensure 404 Returns Correct HTTP Status

Use Phase 02 behavior.

**Execution:** Execute this task against the current repository in the context of Workstream V — 404 Experience Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use Phase 02 behavior. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T239 — Prevent 404 Page from Being Indexed as Valid Content


**Execution:** Execute this task against the current repository in the context of Workstream V — 404 Experience Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T240 — Remove Duplicate Not-Found Experiences


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream W — Route Transition Experience

## P03-T241 — Define Route Transition Philosophy

Avoid unnecessary animation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Avoid unnecessary animation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T242 — Preserve Scroll Behavior Intentionally


**Execution:** Execute this task against the current repository in the context of Workstream W — Route Transition Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T243 — Handle Anchor Navigation Correctly


**Execution:** Execute this task against the current repository in the context of Workstream W — Route Transition Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T244 — Prevent Unexpected Scroll Jumps


**Execution:** Execute this task against the current repository in the context of Workstream W — Route Transition Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T245 — Preserve Navigation Context During Content Transitions


**Execution:** Execute this task against the current repository in the context of Workstream W — Route Transition Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T246 — Prevent Full Shell Remounting Where Unnecessary


**Execution:** Execute this task against the current repository in the context of Workstream W — Route Transition Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T247 — Prevent Theme Flash During Navigation


**Execution:** Execute this task against the current repository in the context of Workstream W — Route Transition Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T248 — Prevent Header Layout Shift During Navigation


**Execution:** Execute this task against the current repository in the context of Workstream W — Route Transition Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream X — Global Responsive Architecture

## P03-T249 — Define Shell Breakpoint Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T250 — Validate Header at Small Mobile Widths


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T251 — Validate Header at Large Mobile Widths


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T252 — Validate Header at Tablet Widths


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T253 — Validate Header at Desktop Widths


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T254 — Validate Header at Wide Desktop Widths


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T255 — Validate Navigation Overflow Behavior


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T256 — Validate Search Entry Responsiveness


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T257 — Validate Breadcrumb Responsiveness


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T258 — Validate Sidebar Responsiveness


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T259 — Validate Footer Responsiveness


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T260 — Prevent Horizontal Shell Overflow


**Execution:** Execute this task against the current repository in the context of Workstream X — Global Responsive Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T261 — Prevent Fixed Desktop Dimensions from Reaching Mobile


**Execution:** Execute this task against the current repository in the context of Workstream X — Global Responsive Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T262 — Ensure Touch Target Accessibility


**Execution:** Execute this task against the current repository in the context of Workstream X — Global Responsive Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Y — Global Accessibility Integration

## P03-T263 — Add Skip-to-Main Navigation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T264 — Define Main Landmark


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T265 — Define Header Landmark


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T266 — Define Navigation Landmarks


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T267 — Define Footer Landmark


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T268 — Ensure Unique Navigation Labels

Where multiple navigation regions exist.

**Execution:** Execute this task against the current repository in the context of Workstream Y — Global Accessibility Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Where multiple navigation regions exist. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T269 — Ensure Keyboard Access to All Header Actions


**Execution:** Execute this task against the current repository in the context of Workstream Y — Global Accessibility Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T270 — Ensure Keyboard Access to Mobile Navigation


**Execution:** Execute this task against the current repository in the context of Workstream Y — Global Accessibility Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T271 — Ensure Keyboard Access to Search


**Execution:** Execute this task against the current repository in the context of Workstream Y — Global Accessibility Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T272 — Ensure Keyboard Access to Theme Controls


**Execution:** Execute this task against the current repository in the context of Workstream Y — Global Accessibility Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T273 — Validate Focus Order


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T274 — Validate Focus Visibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T275 — Validate Screen Reader Navigation Structure


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T276 — Validate Reduced Motion Behavior


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream Z — Global SEO Integration

## P03-T277 — Ensure Shell Navigation Uses Canonical Links


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T278 — Ensure Header Links Are Crawlable


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T279 — Ensure Footer Links Are Crawlable


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T280 — Ensure Sidebar Links Are Crawlable


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T281 — Ensure Breadcrumb Links Are Crawlable


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T282 — Prevent Shell from Injecting Duplicate H1 Elements


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T283 — Prevent Shell from Injecting Duplicate Metadata


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T284 — Prevent Shell Components from Creating Alternate Canonicals


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T285 — Prevent Client Authentication State from Hiding Public Links


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T286 — Ensure Search UI Does Not Create Crawl Traps


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T287 — Ensure Mobile Navigation Preserves Crawl Discovery


**Execution:** Execute this task against the current repository in the context of Workstream Z — Global SEO Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AA — Shell Performance Optimization

## P03-T288 — Measure Global Shell JavaScript Cost


**Execution:** Execute this task against the current repository in the context of Workstream AA — Shell Performance Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T289 — Reduce Header Client JavaScript


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P03-T290 — Reduce Navigation Client JavaScript


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P03-T291 — Lazy Load Noncritical Interactive Shell Features


**Execution:** Execute this task against the current repository in the context of Workstream AA — Shell Performance Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T292 — Avoid Shipping Dashboard Logic to Public Pages


**Execution:** Execute this task against the current repository in the context of Workstream AA — Shell Performance Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T293 — Avoid Shipping Heavy Search Logic Before Search Interaction

Where appropriate.

**Execution:** Execute this task against the current repository in the context of Workstream AA — Shell Performance Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Where appropriate. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T294 — Avoid Shipping Unused Navigation Libraries


**Execution:** Execute this task against the current repository in the context of Workstream AA — Shell Performance Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T295 — Reduce Duplicate Icon Imports


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P03-T296 — Prevent Global Shell Layout Shift


**Execution:** Execute this task against the current repository in the context of Workstream AA — Shell Performance Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T297 — Optimize Logo and Brand Assets


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P03-T298 — Optimize Theme Initialization


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P03-T299 — Preserve Fast Initial Public Content Rendering


**Execution:** Execute this task against the current repository in the context of Workstream AA — Shell Performance Optimization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AB — Shared Component Migration

## P03-T300 — Inventory Shared Components Used by Global Shell


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T301 — Map Legacy Header Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T302 — Map Legacy Navigation Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T303 — Map Legacy Mobile Navigation Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T304 — Map Legacy Search Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T305 — Map Legacy Breadcrumb Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T306 — Map Legacy Sidebar Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T307 — Map Legacy Footer Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T308 — Map Legacy Loading Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T309 — Map Legacy Error Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T310 — Map Legacy Theme Components to V2


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T311 — Migrate Shared Shell Buttons to Canonical Button


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P03-T312 — Migrate Shared Shell Inputs to Canonical Inputs


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P03-T313 — Migrate Shared Shell Icons to Canonical Icon System


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P03-T314 — Migrate Shared Shell Surfaces to Semantic Tokens


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P03-T315 — Migrate Shared Shell Typography to Canonical Scale


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P03-T316 — Migrate Shared Shell Spacing to Canonical Scale


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P03-T317 — Migrate Shared Shell Focus States


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P03-T318 — Migrate Shared Shell Responsive Logic


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

# Workstream AC — Legacy Shell Cleanup

## P03-T319 — Identify Duplicate Root Layout Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T320 — Identify Duplicate Header Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T321 — Identify Duplicate Navigation Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T322 — Identify Duplicate Sidebar Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T323 — Identify Duplicate Footer Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T324 — Identify Duplicate Theme Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T325 — Identify Duplicate Search Entry Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T326 — Remove Confirmed Dead Header Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P03-T327 — Remove Confirmed Dead Navigation Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P03-T328 — Remove Confirmed Dead Sidebar Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P03-T329 — Remove Confirmed Dead Footer Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P03-T330 — Remove Confirmed Dead Theme Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P03-T331 — Remove Confirmed Dead Search Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P03-T332 — Remove Legacy Shell CSS

After dependency verification.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: After dependency verification. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P03-T333 — Remove Legacy Shell Imports


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P03-T334 — Prevent Legacy Shell Reintroduction


**Execution:** Execute this task against the current repository in the context of Workstream AC — Legacy Shell Cleanup, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AD — Public Route Shell Adoption

## P03-T335 — Apply Canonical Shell to Homepage


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T336 — Apply Canonical Shell to Domain Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T337 — Apply Canonical Shell to Stack Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T338 — Apply Canonical Shell to Pillar Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T339 — Apply Canonical Shell to Module Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T340 — Apply Canonical Shell to Question Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T341 — Apply Canonical Shell to Topic Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T342 — Apply Canonical Shell to Company Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T343 — Apply Canonical Shell to Comparison Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T344 — Apply Canonical Shell to Tool Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T345 — Apply Canonical Shell to Roadmap Routes


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T346 — Apply Canonical Shell to Cheatsheet Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T347 — Apply Canonical Shell to DSA Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T348 — Apply Canonical Shell to Static Information Routes


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T349 — Prevent Route-Specific Shell Forks During Adoption


**Execution:** Execute this task against the current repository in the context of Workstream AD — Public Route Shell Adoption, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AE — Authentication Shell Boundary

## P03-T350 — Define Authentication Layout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T351 — Keep Authentication Pages Visually Consistent with V2


**Execution:** Execute this task against the current repository in the context of Workstream AE — Authentication Shell Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T352 — Avoid Full Public Content Navigation Where Unnecessary


**Execution:** Execute this task against the current repository in the context of Workstream AE — Authentication Shell Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T353 — Preserve Brand Consistency


**Execution:** Execute this task against the current repository in the context of Workstream AE — Authentication Shell Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T354 — Ensure Authentication Routes Remain SEO-Classified Correctly


**Execution:** Execute this task against the current repository in the context of Workstream AE — Authentication Shell Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T355 — Prevent Authentication Layout from Leaking into Public Routes


**Execution:** Execute this task against the current repository in the context of Workstream AE — Authentication Shell Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AF — Dashboard Shell Boundary

## P03-T356 — Define Authenticated Application Shell


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P03-T357 — Separate Dashboard Navigation from Public Content Navigation


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dashboard Shell Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T358 — Define Dashboard Header Responsibilities


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T359 — Define Dashboard Sidebar Responsibilities


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T360 — Define Dashboard Mobile Navigation Foundation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P03-T361 — Prevent Dashboard JavaScript from Shipping to Public Routes


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dashboard Shell Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T362 — Preserve Shared Design Tokens Across Public and Private Shells


**Execution:** Execute this task against the current repository in the context of Workstream AF — Dashboard Shell Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T363 — Preserve Different Density Requirements

Application surfaces may be denser than reading pages.

**Execution:** Execute this task against the current repository in the context of Workstream AF — Dashboard Shell Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Application surfaces may be denser than reading pages. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AG — Global Shell Data Boundaries

## P03-T364 — Identify Data Required by Global Header


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T365 — Remove Unnecessary Header Data Fetching


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P03-T366 — Identify Data Required by Global Navigation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T367 — Avoid Fetching Entire Content Trees Globally


**Execution:** Execute this task against the current repository in the context of Workstream AG — Global Shell Data Boundaries, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T368 — Load Contextual Navigation Only Where Needed


**Execution:** Execute this task against the current repository in the context of Workstream AG — Global Shell Data Boundaries, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T369 — Identify Data Required by User Menu


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T370 — Isolate User-Specific Data from Public Content Rendering


**Execution:** Execute this task against the current repository in the context of Workstream AG — Global Shell Data Boundaries, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T371 — Prevent Global Shell Failure When User API Fails


**Execution:** Execute this task against the current repository in the context of Workstream AG — Global Shell Data Boundaries, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T372 — Cache Stable Global Navigation Data Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AG — Global Shell Data Boundaries, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T373 — Avoid Duplicate Shell Data Requests


**Execution:** Execute this task against the current repository in the context of Workstream AG — Global Shell Data Boundaries, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AH — Global Shell Security

## P03-T374 — Prevent Unsafe Dynamic Navigation URLs


**Execution:** Execute this task against the current repository in the context of Workstream AH — Global Shell Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T375 — Prevent User-Controlled HTML in Global Shell


**Execution:** Execute this task against the current repository in the context of Workstream AH — Global Shell Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T376 — Prevent Open Redirects from Header Authentication Actions


**Execution:** Execute this task against the current repository in the context of Workstream AH — Global Shell Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T377 — Prevent Sensitive User Data from Public Shell HTML


**Execution:** Execute this task against the current repository in the context of Workstream AH — Global Shell Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T378 — Prevent Private Navigation Items from Appearing for Anonymous Users


**Execution:** Execute this task against the current repository in the context of Workstream AH — Global Shell Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T379 — Prevent Authentication State Leakage Through Caching


**Execution:** Execute this task against the current repository in the context of Workstream AH — Global Shell Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T380 — Validate Safe External Footer Links


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AI — Global Shell Quality Validation

## P03-T381 — Validate Shell in Light Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T382 — Validate Shell in Dark Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T383 — Validate Shell Without Authentication


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T384 — Validate Shell With Authentication


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T385 — Validate Shell Without JavaScript for Core Navigation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T386 — Validate Shell with Keyboard Only


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T387 — Validate Shell at Mobile Width


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T388 — Validate Shell at Tablet Width


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T389 — Validate Shell at Desktop Width


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T390 — Validate Shell at Wide Desktop Width


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T391 — Validate Long Navigation Labels


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T392 — Validate Deep Breadcrumbs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T393 — Validate Large Content Trees


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T394 — Validate Slow Authentication State Resolution


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T395 — Validate Search Failure Behavior


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P03-T396 — Validate Theme Persistence


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AJ — Representative Page Integration

## P03-T397 — Integrate Homepage with Final Global Shell


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T398 — Integrate Representative Hub Page


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T399 — Integrate Representative Question Page


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T400 — Integrate Representative Deep Hierarchy Page


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T401 — Integrate Representative Mobile Experience


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T402 — Integrate Representative Authenticated State


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T403 — Compare V1 and V2 Global Density


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T404 — Compare V1 and V2 Navigation Clarity


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T405 — Compare V1 and V2 Content Focus


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T406 — Fix Root Shell Defects Rather Than Page-Level Symptoms


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Representative Page Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AK — Regression Protection

## P03-T407 — Add Header Interaction Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T408 — Add Mobile Navigation Interaction Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T409 — Add Navigation Accessibility Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T410 — Add Search Entry Interaction Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T411 — Add Theme Control Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T412 — Add Breadcrumb Rendering Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T413 — Add Sidebar Responsive Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T414 — Add Shell Link Integrity Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T415 — Add Shell Overflow Regression Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P03-T416 — Add Shell Layout Shift Monitoring


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T417 — Add Legacy Shell Import Detection

Where practical.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Where practical. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

# Workstream AL — Phase 03 Completion

## P03-T418 — Freeze Canonical Public Shell API


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T419 — Freeze Canonical Header Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T420 — Freeze Canonical Navigation Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T421 — Freeze Canonical Mobile Navigation Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T422 — Freeze Canonical Breadcrumb Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T423 — Freeze Canonical Sidebar Foundation


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T424 — Freeze Canonical Footer Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T425 — Publish Shell Migration Guide


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T426 — Publish Legacy-to-V2 Shell Component Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P03-T427 — Update V2 Technical Implementation Plan


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P03-T428 — Update V2 Decision Log


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T429 — Update V2 Issue Log


**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P03-T430 — Produce Phase 03 Completion Report

Document:

* shell architecture,
* header,
* navigation,
* mobile navigation,
* search entry,
* breadcrumbs,
* sidebars,
* footer,
* loading,
* errors,
* legacy removals,
* remaining route-specific work.

**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document: shell architecture, header, navigation, mobile navigation, search entry, breadcrumbs, sidebars, footer, loading, errors, legacy removals, remaining route-specific work. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P03-T431 — Approve Global Shell for Route-Family Migration

Confirm later phases can migrate actual page families without rebuilding global navigation and shell infrastructure.

**Execution:** Execute this task against the current repository in the context of Workstream AL — Phase 03 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Confirm later phases can migrate actual page families without rebuilding global navigation and shell infrastructure. # Phase 03 Exit Criteria Phase 03 is complete when Interview Explainer has: one canonical root layout, clear public and private shell boundaries, one canonical public shell, one global header, one desktop navigation system, one mobile navigation system, one global search entry architecture, one global Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Phase 03 Exit Criteria

Phase 03 is complete when Interview Explainer has:

* one canonical root layout,
* clear public and private shell boundaries,
* one canonical public shell,
* one global header,
* one desktop navigation system,
* one mobile navigation system,
* one global search entry architecture,
* one global container architecture,
* one breadcrumb system,
* one content sidebar foundation,
* one contextual sidebar foundation,
* one content-tree navigation foundation,
* one footer,
* one theme control integration,
* one loading architecture,
* one error architecture,
* one correct 404 experience,
* responsive shell behavior,
* accessible global navigation,
* SEO-safe crawlable navigation,
* reduced shell JavaScript,
* no major duplicate legacy shell systems.

The shell should feel visually quieter than V1.

It should provide structure without creating the feeling that every page is surrounded by:

* boxes,
* buttons,
* badges,
* navigation panels,
* coloured surfaces,
* competing controls.

---

# Phase 03 Core Principle

```text
THE USER CAME FOR THE CONTENT

THE SHELL EXISTS TO HELP THEM:

FIND IT
UNDERSTAND WHERE THEY ARE
MOVE THROUGH IT
RETURN TO IT

THE SHELL IS NOT THE PRODUCT
```

The intended transformation is:

```text
CURRENT

Multiple navigation patterns
Dense header
Potentially duplicated shell logic
Different sidebars
Different page widths
Different breadcrumb behavior
Mobile complexity
Too many visible controls
Content competing with navigation

        ↓

V2

One calm global shell
Clear navigation hierarchy
Minimal header
Focused search access
Canonical breadcrumbs
Context-aware sidebars
Consistent responsive behavior
Content-first page framing
Shared SEO-safe links
Lower global JavaScript cost
```

---

# Important Architecture Boundary

Phase 03 should not redesign the detailed internals of:

* homepage sections,
* question answers,
* stack hubs,
* pillar pages,
* module pages,
* company pages,
* dashboard widgets.

Those belong to their dedicated route-family phases.

Phase 03 owns the shared frame around those experiences.

---

# Next Phase

```text
PHASE 04

HOMEPAGE
&
PUBLIC DISCOVERY EXPERIENCE REBUILD
```

Phase 04 should rebuild the homepage as the primary discovery and conversion surface for Interview Explainer.

It should cover:

* homepage information architecture,
* hero,
* primary value proposition,
* search and discovery,
* interview preparation pathways,
* technology/domain discovery,
* featured content,
* trust and credibility,
* new-user onboarding path,
* returning-user continuation path,
* SEO landing-page quality,
* mobile homepage experience,
* removal of current homepage density and visual overload.
