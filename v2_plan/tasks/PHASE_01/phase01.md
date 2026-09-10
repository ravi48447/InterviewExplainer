# PHASE 01 — ROOT UI ARCHITECTURE & DESIGN SYSTEM REBUILD

## Phase Objective

Rebuild the visual and structural UI foundation of Interview Explainer so every later V2 page can inherit a calm, readable, consistent and maintainable interface.

The current UI problems should not be fixed through hundreds of isolated page-specific CSS patches.

The root causes must be addressed first.

Phase 01 focuses on:

* global styling architecture,
* semantic design tokens,
* typography,
* reading experience,
* spacing,
* page widths,
* surfaces,
* density reduction,
* shared primitives,
* reusable content components,
* light and dark themes,
* responsive foundations,
* interaction states,
* accessibility foundations,
* removal of duplicate and conflicting UI systems.

This phase does **not** fully redesign every route.

Instead, it creates the canonical V2 UI system that later phases will apply to:

* global application shell,
* question pages,
* content hubs,
* public route families,
* authentication,
* dashboard,
* practice,
* search.

---

# Workstream A — UI Architecture Foundation

## P01-T001 — Establish Canonical V2 UI Architecture

Define the permanent hierarchy between:

* design tokens,
* global styles,
* shared primitives,
* composite components,
* feature components,
* page layouts,
* route-specific presentation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define the permanent hierarchy between: design tokens, global styles, shared primitives, composite components, feature components, page layouts, route-specific presentation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T002 — Define UI Ownership Boundaries

Determine which styling belongs in:

* global CSS,
* Tailwind configuration,
* component variants,
* layout components,
* route-specific components.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Determine which styling belongs in: global CSS, Tailwind configuration, component variants, layout components, route-specific components. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T003 — Establish V2 Component Layering Model

Organize components into:

```text
PRIMITIVES
    ↓
COMPOSITES
    ↓
CONTENT COMPONENTS
    ↓
FEATURE COMPONENTS
    ↓
PAGE COMPOSITION
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Organize components into: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T004 — Establish Canonical UI Import Boundaries

Prevent pages from bypassing shared V2 primitives unnecessarily.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent pages from bypassing shared V2 primitives unnecessarily. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T005 — Establish Shared Component Naming Convention

Create predictable naming for canonical V2 components.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create predictable naming for canonical V2 components. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P01-T006 — Establish Component Variant Strategy

Define how visual variants are implemented without creating duplicate components.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define how visual variants are implemented without creating duplicate components. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T007 — Establish Component Size Strategy

Standardize compact, default and large sizing where meaningful.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Standardize compact, default and large sizing where meaningful. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T008 — Establish Component State Strategy

Standardize:

* default,
* hover,
* active,
* focus,
* disabled,
* loading,
* selected,
* error.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Standardize: default, hover, active, focus, disabled, loading, selected, error. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T009 — Establish UI Deprecation Mechanism

Mark legacy UI components clearly during migration.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Mark legacy UI components clearly during migration. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T010 — Prevent New Legacy Styling During V2 Migration

Add development conventions that prevent new arbitrary styling patterns.

**Execution:** Execute this task against the current repository in the context of Workstream A — UI Architecture Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Add development conventions that prevent new arbitrary styling patterns. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream B — Global CSS & Styling Architecture

## P01-T011 — Reorganize Global CSS

Separate:

* reset/base styles,
* tokens,
* typography,
* content styles,
* utilities,
* theme behavior.

**Execution:** Trace current consumers and behavior, refactor the responsibility at its shared owner, and migrate usage incrementally so externally visible behavior is preserved unless this task explicitly changes it. Apply this specifically to: Separate: reset/base styles, tokens, typography, content styles, utilities, theme behavior. Remove duplicate legacy paths after migration and run targeted regression checks across the routes or features with the largest blast radius.

**Priority:** P0

---

## P01-T012 — Remove Conflicting Global Style Rules

Eliminate global selectors that unexpectedly override component behavior.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Eliminate global selectors that unexpectedly override component behavior. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T013 — Remove Obsolete Global V1 Styles

Delete confirmed unused legacy rules after dependency verification.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Delete confirmed unused legacy rules after dependency verification. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T014 — Consolidate Duplicate CSS Variables

Create one canonical token source.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Create one canonical token source. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P01-T015 — Remove Uncontrolled Global Element Styling

Prevent generic selectors from causing route-specific inconsistencies.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Prevent generic selectors from causing route-specific inconsistencies. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T016 — Normalize Browser Base Behavior

Establish predictable:

* box sizing,
* margins,
* typography inheritance,
* media behavior,
* form behavior.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Establish predictable: box sizing, margins, typography inheritance, media behavior, form behavior. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P01-T017 — Standardize Selection Styling

Create theme-compatible text selection behavior.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Create theme-compatible text selection behavior. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P3

---

## P01-T018 — Standardize Scroll Behavior

Ensure predictable navigation and anchor behavior.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Ensure predictable navigation and anchor behavior. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P01-T019 — Standardize Scrollbar Treatment

Use restrained styling only where appropriate.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Use restrained styling only where appropriate. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P3

---

## P01-T020 — Establish Global Overflow Protection

Prevent common horizontal page overflow without hiding legitimate component defects.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent common horizontal page overflow without hiding legitimate component defects. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream C — Semantic Color Architecture

## P01-T021 — Remove Arbitrary Global Color Architecture

Replace uncontrolled page-level color decisions with semantic roles.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Replace uncontrolled page-level color decisions with semantic roles. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T022 — Implement Background Color Tokens

Define:

* application background,
* elevated background,
* muted background,
* reading background.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Define: application background, elevated background, muted background, reading background. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T023 — Implement Surface Color Tokens

Create canonical surfaces for intentional grouping.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create canonical surfaces for intentional grouping. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T024 — Implement Text Color Hierarchy

Define:

* primary text,
* secondary text,
* muted text,
* disabled text,
* inverse text.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Define: primary text, secondary text, muted text, disabled text, inverse text. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T025 — Implement Border Color Hierarchy

Define subtle and strong boundary roles.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Define subtle and strong boundary roles. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T026 — Implement Primary Action Color Tokens

Create one controlled primary interaction system.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create one controlled primary interaction system. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T027 — Implement Semantic Success Colors

Use success color only where semantic meaning exists.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Use success color only where semantic meaning exists. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T028 — Implement Semantic Warning Colors

Prevent warning colors from becoming decorative noise.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prevent warning colors from becoming decorative noise. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T029 — Implement Semantic Error Colors

Standardize destructive and validation states.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize destructive and validation states. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T030 — Implement Semantic Information Colors

Create restrained informational emphasis.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create restrained informational emphasis. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T031 — Implement Difficulty Color Semantics

Standardize easy, medium and hard indicators without overpowering content.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize easy, medium and hard indicators without overpowering content. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T032 — Remove Decorative Rainbow Color Usage

Reduce unnecessary multi-colour visual competition.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce unnecessary multi-colour visual competition. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T033 — Remove Hard-Coded Hex Values from Shared UI

Migrate shared components to semantic tokens.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Migrate shared components to semantic tokens. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T034 — Remove Hard-Coded Framework Palette Usage from Canonical Components

Prevent canonical V2 components from depending on arbitrary palette values.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Prevent canonical V2 components from depending on arbitrary palette values. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T035 — Validate Semantic Color Contrast

Ensure tokens support readable text and controls.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Ensure tokens support readable text and controls. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream D — Light Theme Rebuild

## P01-T036 — Rebuild V2 Light Application Background

Create a calm base suitable for long reading sessions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create a calm base suitable for long reading sessions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T037 — Rebuild Light Surface Hierarchy

Ensure cards and sections do not all appear equally elevated.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Ensure cards and sections do not all appear equally elevated. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T038 — Rebuild Light Text Hierarchy

Improve contrast without making every element visually heavy.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Improve contrast without making every element visually heavy. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T039 — Rebuild Light Border Treatment

Reduce excessive visible boxes.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Reduce excessive visible boxes. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T040 — Rebuild Light Interactive States

Standardize hover, active and selected states.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize hover, active and selected states. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T041 — Rebuild Light Code Presentation Foundation

Prepare comfortable code contrast.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prepare comfortable code contrast. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T042 — Rebuild Light Educational Callout Foundation

Create restrained semantic emphasis.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create restrained semantic emphasis. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T043 — Remove Pure-White Surface Overuse

Use hierarchy rather than stacking identical white boxes.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Use hierarchy rather than stacking identical white boxes. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T044 — Validate Long-Form Light Reading Comfort

Review sustained content reading rather than only component screenshots.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Review sustained content reading rather than only component screenshots. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream E — Dark Theme Rebuild

## P01-T045 — Rebuild V2 Dark Application Background

Create a comfortable dark foundation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create a comfortable dark foundation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T046 — Rebuild Dark Surface Hierarchy

Avoid excessive layers of differently coloured dark cards.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Avoid excessive layers of differently coloured dark cards. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T047 — Rebuild Dark Text Hierarchy

Avoid both low contrast and excessively bright text.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Avoid both low contrast and excessively bright text. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T048 — Rebuild Dark Border Treatment

Use restrained boundaries.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Use restrained boundaries. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T049 — Rebuild Dark Interactive States

Create clear but calm interaction feedback.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create clear but calm interaction feedback. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T050 — Rebuild Dark Code Presentation Foundation

Ensure code remains readable without visual dominance.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Ensure code remains readable without visual dominance. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T051 — Rebuild Dark Educational Callout Foundation

Prevent bright semantic blocks from overwhelming pages.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prevent bright semantic blocks from overwhelming pages. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T052 — Remove Near-Black Layer Proliferation

Reduce unnecessary dark-surface nesting.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce unnecessary dark-surface nesting. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T053 — Validate Long-Form Dark Reading Comfort

Test sustained reading and code-heavy pages.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Test sustained reading and code-heavy pages. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream F — Typography Architecture

## P01-T054 — Establish Canonical UI Font Strategy

Define the primary UI and body font loading strategy.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define the primary UI and body font loading strategy. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T055 — Establish Canonical Monospace Font Strategy

Define code typography without excessive loading cost.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define code typography without excessive loading cost. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T056 — Implement Display Typography Scale

Standardize major page titles and marketing headings.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize major page titles and marketing headings. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T057 — Implement Content Heading Scale

Define H1 through H6 behavior for educational content.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Define H1 through H6 behavior for educational content. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T058 — Implement Body Typography Scale

Define canonical body sizes and line heights.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Define canonical body sizes and line heights. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T059 — Implement Small Text Scale

Standardize secondary information.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize secondary information. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T060 — Implement Metadata Typography

Prevent metadata from competing with primary content.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prevent metadata from competing with primary content. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T061 — Implement Label Typography

Standardize form and UI labels.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize form and UI labels. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T062 — Implement Button Typography

Standardize control text weight and sizing.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize control text weight and sizing. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T063 — Implement Code Typography

Define inline and block code sizing.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Define inline and block code sizing. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T064 — Standardize Font Weight Usage

Limit uncontrolled weight variation.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Limit uncontrolled weight variation. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P01-T065 — Standardize Letter Spacing

Remove arbitrary tracking choices.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Remove arbitrary tracking choices. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P01-T066 — Standardize Heading Line Heights

Improve multiline heading readability.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Improve multiline heading readability. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P01-T067 — Standardize Body Line Height

Optimize long-form reading.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Optimize long-form reading. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P01-T068 — Standardize Paragraph Spacing

Create consistent reading rhythm.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Create consistent reading rhythm. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P01-T069 — Standardize Heading-to-Content Spacing

Make content hierarchy visually understandable.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Make content hierarchy visually understandable. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P01-T070 — Remove Route-Specific Typography Hacks

Migrate shared typography behavior to canonical styles.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Migrate shared typography behavior to canonical styles. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

# Workstream G — Reading Experience Foundation

## P01-T071 — Define Canonical Reading Width

Establish maximum line length for long-form answers.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish maximum line length for long-form answers. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T072 — Define Wide Content Width

Support tables, diagrams and code without forcing all prose to become wide.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Support tables, diagrams and code without forcing all prose to become wide. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T073 — Define Standard Page Width

Create a canonical general-purpose page container.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create a canonical general-purpose page container. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T074 — Define Wide Application Width

Support dashboards and complex application layouts.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Support dashboards and complex application layouts. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T075 — Separate Reading Width from Page Width

Prevent long-form text from stretching across large displays.

**Execution:** Execute this task against the current repository in the context of Workstream G — Reading Experience Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prevent long-form text from stretching across large displays. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P01-T076 — Implement Prose Rhythm Foundation

Standardize spacing between content elements.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize spacing between content elements. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T077 — Implement Long-Form List Styling

Improve ordered, unordered and nested lists.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Improve ordered, unordered and nested lists. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T078 — Implement Blockquote Styling

Create restrained quotation treatment.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create restrained quotation treatment. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T079 — Implement Inline Code Styling

Make inline technical terms readable without excessive emphasis.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Make inline technical terms readable without excessive emphasis. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T080 — Implement Link Styling for Reading Content

Ensure links are identifiable without overwhelming paragraphs.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Ensure links are identifiable without overwhelming paragraphs. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T081 — Implement Strong and Emphasis Rules

Prevent bold-heavy content from becoming visually noisy.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prevent bold-heavy content from becoming visually noisy. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T082 — Implement Horizontal Rule Treatment

Use subtle content separation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Use subtle content separation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T083 — Implement Anchor Offset Behavior

Ensure heading links work correctly beneath sticky navigation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Ensure heading links work correctly beneath sticky navigation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T084 — Implement Long-Word Overflow Handling

Prevent technical terms and URLs from breaking layouts.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prevent technical terms and URLs from breaking layouts. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T085 — Implement Mixed Prose-and-Code Layout Rules

Allow code to use more width than surrounding prose when appropriate.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Allow code to use more width than surrounding prose when appropriate. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream H — Spacing & Density Architecture

## P01-T086 — Establish Canonical Spacing Scale

Define the permitted spacing system.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define the permitted spacing system. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T087 — Establish Component Internal Padding Rules

Standardize control and container padding.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize control and container padding. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T088 — Establish Section Spacing Rules

Create consistent separation between major page regions.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create consistent separation between major page regions. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T089 — Establish Content Element Spacing Rules

Standardize paragraph, list, code and heading rhythm.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Standardize paragraph, list, code and heading rhythm. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T090 — Establish Page Edge Padding

Create consistent responsive horizontal gutters.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create consistent responsive horizontal gutters. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T091 — Remove Arbitrary Margin Proliferation

Replace repeated one-off spacing fixes.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Replace repeated one-off spacing fixes. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T092 — Remove Arbitrary Padding Proliferation

Migrate reusable patterns to shared primitives.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Migrate reusable patterns to shared primitives. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T093 — Reduce Excessive Vertical Compression

Increase breathing room where content currently feels crowded.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Increase breathing room where content currently feels crowded. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P01-T094 — Reduce Excessive Decorative Whitespace

Avoid oversized empty sections that harm information flow.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Avoid oversized empty sections that harm information flow. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P2

---

## P01-T095 — Define Compact Density Mode for Data-Heavy UI

Allow legitimately dense application surfaces without affecting reading pages.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Allow legitimately dense application surfaces without affecting reading pages. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

# Workstream I — Surface, Border, Radius & Depth Architecture

## P01-T096 — Define When a Surface Is Necessary

Establish rules for when content should actually be placed inside a card or panel.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish rules for when content should actually be placed inside a card or panel. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T097 — Define Flat Section Pattern

Support grouping without boxes.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Support grouping without boxes. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T098 — Define Bordered Section Pattern

Use boundaries only where structural separation is useful.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use boundaries only where structural separation is useful. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T099 — Define Elevated Surface Pattern

Reserve elevation for appropriate interactive or floating UI.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Reserve elevation for appropriate interactive or floating UI. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T100 — Establish Border Width Rules

Prevent inconsistent boundary weights.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent inconsistent boundary weights. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P01-T101 — Establish Radius Scale

Create a restrained radius system.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create a restrained radius system. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T102 — Remove Excessive Rounded-Rectangle Styling

Reduce the “everything is a pill/card” appearance.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce the “everything is a pill/card” appearance. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T103 — Establish Shadow Scale

Define minimal elevation levels.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define minimal elevation levels. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T104 — Remove Decorative Shadow Overuse

Reduce visual heaviness.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce visual heaviness. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T105 — Remove Nested Surface Anti-Patterns

Prevent card-inside-card-inside-card layouts.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Prevent card-inside-card-inside-card layouts. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream J — Layout Primitives

## P01-T106 — Build Canonical Page Container

Create the default V2 horizontal page boundary.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create the default V2 horizontal page boundary. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T107 — Build Canonical Reading Container

Create the long-form content boundary.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create the long-form content boundary. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T108 — Build Canonical Wide Container

Support complex layouts and wide content.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support complex layouts and wide content. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T109 — Build Canonical Section Component

Standardize vertical page grouping.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize vertical page grouping. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T110 — Build Canonical Stack Layout Primitive

Standardize vertical spacing composition.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize vertical spacing composition. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T111 — Build Canonical Inline Layout Primitive

Standardize horizontal control grouping.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize horizontal control grouping. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T112 — Build Canonical Grid Primitive

Standardize responsive card and feature grids.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize responsive card and feature grids. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T113 — Build Canonical Split Layout

Support main-content and secondary-content structures.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support main-content and secondary-content structures. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T114 — Build Canonical Sidebar Layout

Support content navigation without forcing every page into a sidebar.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support content navigation without forcing every page into a sidebar. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T115 — Build Canonical Sticky Region Primitive

Standardize sticky behavior and offsets.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize sticky behavior and offsets. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T116 — Build Canonical Full-Width Breakout

Allow wide code, diagrams or tables inside constrained reading layouts.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Allow wide code, diagrams or tables inside constrained reading layouts. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T117 — Build Canonical Responsive Visibility Utilities

Avoid duplicate breakpoint logic.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Avoid duplicate breakpoint logic. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T118 — Remove Duplicate Container Components

Migrate overlapping container implementations.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Migrate overlapping container implementations. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream K — Button & Action System

## P01-T119 — Rebuild Canonical Button Component

Create the permanent V2 button primitive.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create the permanent V2 button primitive. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T120 — Implement Primary Button Variant

Use only for primary page actions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Use only for primary page actions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T121 — Implement Secondary Button Variant

Support lower-priority actions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support lower-priority actions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T122 — Implement Ghost Button Variant

Support low-emphasis actions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support low-emphasis actions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T123 — Implement Destructive Button Variant

Standardize destructive operations.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize destructive operations. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T124 — Implement Icon Button Variant

Standardize compact icon actions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize compact icon actions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T125 — Implement Button Loading State

Prevent duplicate submissions and unclear waiting states.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prevent duplicate submissions and unclear waiting states. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T126 — Implement Button Disabled State

Ensure accessible disabled behavior.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Ensure accessible disabled behavior. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T127 — Standardize Button Sizes

Remove arbitrary button dimensions.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Remove arbitrary button dimensions. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P01-T128 — Standardize Icon Alignment in Buttons

Fix inconsistent icon/text positioning.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Fix inconsistent icon/text positioning. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P01-T129 — Consolidate Duplicate Button Components

Migrate shared consumers where safe.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Migrate shared consumers where safe. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P01-T130 — Remove Legacy Button Implementations

Delete confirmed obsolete versions after migration.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Delete confirmed obsolete versions after migration. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

# Workstream L — Card, Panel & Section System

## P01-T131 — Rebuild Canonical Card Component

Create a restrained general-purpose card.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create a restrained general-purpose card. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T132 — Implement Interactive Card Variant

Provide clear but subtle interaction behavior.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Provide clear but subtle interaction behavior. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T133 — Implement Static Information Card Variant

Avoid hover effects on noninteractive content.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Avoid hover effects on noninteractive content. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T134 — Implement Minimal Card Variant

Support grouping with minimal visual chrome.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support grouping with minimal visual chrome. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T135 — Implement Panel Component

Separate application panels from generic cards.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Separate application panels from generic cards. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T136 — Implement Section Header Pattern

Standardize title, description and optional actions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize title, description and optional actions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T137 — Remove Card Hover Effects from Noninteractive Content

Eliminate misleading interaction cues.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Eliminate misleading interaction cues. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T138 — Remove Universal Scale-on-Hover Behavior

Avoid unnecessary motion and layout instability.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Avoid unnecessary motion and layout instability. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T139 — Reduce Card Usage in Reading Flows

Prefer typography and spacing for content hierarchy.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Prefer typography and spacing for content hierarchy. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P01-T140 — Consolidate Duplicate Card Components

Migrate shared implementations.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Migrate shared implementations. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

# Workstream M — Badge, Tag & Metadata System

## P01-T141 — Rebuild Canonical Badge Component

Create restrained semantic badges.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create restrained semantic badges. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T142 — Implement Difficulty Badge Variants

Standardize difficulty presentation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize difficulty presentation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T143 — Implement Status Badge Variants

Support actual status semantics.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support actual status semantics. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T144 — Implement Neutral Metadata Badge

Support low-emphasis metadata where a badge is genuinely needed.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support low-emphasis metadata where a badge is genuinely needed. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T145 — Build Tag Component

Separate content tags from status badges.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Separate content tags from status badges. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T146 — Reduce Excessive Badge Usage

Replace decorative badges with plain metadata text where appropriate.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Replace decorative badges with plain metadata text where appropriate. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P01-T147 — Prevent Badge Colour Proliferation

Restrict arbitrary category colours.

**Execution:** Execute this task against the current repository in the context of Workstream M — Badge, Tag & Metadata System, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Restrict arbitrary category colours. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P01-T148 — Consolidate Duplicate Badge Components

Migrate shared consumers.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Migrate shared consumers. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

# Workstream N — Form & Input System

## P01-T149 — Rebuild Canonical Input Component

Standardize text input behavior.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize text input behavior. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T150 — Rebuild Canonical Textarea Component

Support longer input consistently.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support longer input consistently. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T151 — Rebuild Canonical Select Component

Standardize selection controls.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize selection controls. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T152 — Rebuild Canonical Checkbox Component

Ensure clear states and accessibility.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Ensure clear states and accessibility. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T153 — Rebuild Canonical Radio Component

Standardize exclusive selection.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize exclusive selection. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T154 — Implement Form Label Component

Create consistent accessible labels.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create consistent accessible labels. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T155 — Implement Form Description Component

Support contextual help.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support contextual help. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T156 — Implement Field Error Component

Standardize validation messages.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize validation messages. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T157 — Implement Input Icon Pattern

Support search and contextual inputs.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support search and contextual inputs. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T158 — Standardize Input Heights

Remove arbitrary control dimensions.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Remove arbitrary control dimensions. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P01-T159 — Standardize Form Focus States

Create consistent keyboard visibility.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Create consistent keyboard visibility. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P01-T160 — Consolidate Duplicate Form Components

Migrate reusable implementations.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Migrate reusable implementations. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

# Workstream O — Search Input Foundation

## P01-T161 — Build Canonical Search Input

Create the shared visual search primitive.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create the shared visual search primitive. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T162 — Implement Search Icon Treatment

Standardize icon placement.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize icon placement. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T163 — Implement Search Clear Action

Support quick query reset.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support quick query reset. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T164 — Implement Search Loading State

Communicate active search behavior.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Communicate active search behavior. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T165 — Implement Search Empty Input State

Create clear placeholder behavior.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create clear placeholder behavior. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T166 — Implement Search Keyboard Shortcut Hint

Support desktop discoverability without clutter.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support desktop discoverability without clutter. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T167 — Ensure Search Input Mobile Usability

Provide appropriate touch targets and sizing.

**Execution:** Execute this task against the current repository in the context of Workstream O — Search Input Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Provide appropriate touch targets and sizing. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream P — Navigation Primitives

## P01-T168 — Build Canonical Navigation Link

Standardize navigation states.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize navigation states. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T169 — Implement Active Navigation State

Make current location clear without excessive colour.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Make current location clear without excessive colour. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T170 — Implement Nested Navigation Item

Support content hierarchy.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support content hierarchy. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T171 — Implement Navigation Group

Standardize grouped links.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize grouped links. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T172 — Build Canonical Breadcrumb Component

Create accessible visual breadcrumb presentation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create accessible visual breadcrumb presentation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T173 — Build Canonical Pagination Component

Standardize multi-page navigation where required.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize multi-page navigation where required. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T174 — Build Canonical Previous/Next Navigation Primitive

Support sequential learning flows.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support sequential learning flows. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T175 — Build Canonical Tab Navigation

Support local content switching without misuse as global navigation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support local content switching without misuse as global navigation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T176 — Build Canonical Accordion Navigation

Support progressive disclosure.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support progressive disclosure. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T177 — Build Canonical Tree Navigation Primitives

Prepare for later content-tree consolidation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prepare for later content-tree consolidation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream Q — Overlay & Floating UI

## P01-T178 — Rebuild Canonical Dialog

Standardize modal behavior.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize modal behavior. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T179 — Rebuild Canonical Drawer

Support mobile and contextual panels.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support mobile and contextual panels. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T180 — Rebuild Canonical Dropdown Menu

Standardize contextual actions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize contextual actions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T181 — Rebuild Canonical Popover

Support lightweight contextual content.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support lightweight contextual content. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T182 — Rebuild Canonical Tooltip

Use tooltips only for genuinely unclear icon actions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Use tooltips only for genuinely unclear icon actions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T183 — Standardize Overlay Backdrop

Create consistent visual hierarchy.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Create consistent visual hierarchy. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P01-T184 — Standardize Overlay Z-Index Architecture

Prevent stacking conflicts.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Prevent stacking conflicts. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P01-T185 — Standardize Overlay Focus Management

Ensure accessible keyboard behavior.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Ensure accessible keyboard behavior. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P01-T186 — Standardize Overlay Mobile Behavior

Prevent unusable desktop-style modals on small screens.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Prevent unusable desktop-style modals on small screens. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

# Workstream R — Loading, Empty, Error & Feedback States

## P01-T187 — Build Canonical Skeleton Primitive

Create reusable loading placeholders.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create reusable loading placeholders. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T188 — Build Text Skeleton Pattern

Support reading-content loading.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support reading-content loading. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T189 — Build Card Skeleton Pattern

Support structured content loading.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support structured content loading. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T190 — Build List Skeleton Pattern

Support search and question-list loading.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support search and question-list loading. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T191 — Build Canonical Spinner

Reserve spinner use for appropriate compact actions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Reserve spinner use for appropriate compact actions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T192 — Replace Plain Loading Text in Shared Experiences

Use context-appropriate loading feedback.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use context-appropriate loading feedback. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P01-T193 — Build Canonical Empty State

Create clear recovery-oriented empty states.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create clear recovery-oriented empty states. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T194 — Build Canonical Error State

Create understandable error recovery.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create understandable error recovery. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T195 — Build Inline Error Pattern

Support component-level failures.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support component-level failures. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T196 — Build Success Feedback Pattern

Provide restrained confirmation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Provide restrained confirmation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T197 — Standardize Toast Notifications

Use transient feedback consistently.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Use transient feedback consistently. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P01-T198 — Prevent Toast Overuse

Keep persistent information in the interface when appropriate.

**Execution:** Execute this task against the current repository in the context of Workstream R — Loading, Empty, Error & Feedback States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Keep persistent information in the interface when appropriate. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

# Workstream S — Educational Content Components

## P01-T199 — Build Canonical Prose Component

Create the root long-form content renderer styling contract.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create the root long-form content renderer styling contract. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T200 — Build Canonical Code Block Shell

Prepare reusable code presentation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prepare reusable code presentation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T201 — Build Canonical Code Header

Support language labels and actions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support language labels and actions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T202 — Build Canonical Copy-Code Action

Provide consistent copy feedback.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Provide consistent copy feedback. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T203 — Build Canonical Inline Code Style

Standardize technical references.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize technical references. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T204 — Build Canonical Callout Component

Create the base semantic callout.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create the base semantic callout. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T205 — Implement Note Callout

Support neutral supplementary information.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support neutral supplementary information. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T206 — Implement Tip Callout

Support useful guidance without excessive colour.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support useful guidance without excessive colour. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T207 — Implement Warning Callout

Reserve warning emphasis for meaningful caution.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Reserve warning emphasis for meaningful caution. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T208 — Implement Example Block

Create consistent worked-example presentation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create consistent worked-example presentation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T209 — Implement Key Takeaway Block

Support concise summary emphasis.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support concise summary emphasis. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T210 — Build Canonical Table Wrapper

Support responsive technical tables.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support responsive technical tables. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T211 — Implement Table Overflow Behavior

Prevent mobile page overflow.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Prevent mobile page overflow. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T212 — Implement Table Header Styling

Improve scanability.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Improve scanability. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T213 — Implement Table Row Styling

Avoid excessive striping and visual noise.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Avoid excessive striping and visual noise. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T214 — Build Canonical Diagram Container

Support diagrams without forcing card styling.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support diagrams without forcing card styling. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T215 — Build Canonical Media Container

Standardize images and visual content.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Standardize images and visual content. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T216 — Build Canonical Content Caption

Support diagrams, tables and media.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Support diagrams, tables and media. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

# Workstream T — Responsive Foundation

## P01-T217 — Establish Canonical Breakpoint Strategy

Standardize responsive behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Standardize responsive behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T218 — Establish Mobile-First Layout Rules

Avoid desktop layouts patched down for phones.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Avoid desktop layouts patched down for phones. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T219 — Establish Responsive Page Gutters

Standardize horizontal spacing.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Standardize horizontal spacing. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T220 — Establish Responsive Typography Behavior

Prevent oversized headings and cramped body text.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent oversized headings and cramped body text. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T221 — Establish Responsive Grid Rules

Create predictable grid collapse behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create predictable grid collapse behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T222 — Establish Responsive Sidebar Rules

Define when sidebars remain, collapse or move.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Define when sidebars remain, collapse or move. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T223 — Establish Responsive Navigation Rules

Prepare consistent global and content navigation behavior.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prepare consistent global and content navigation behavior. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T224 — Establish Responsive Table Rules

Prevent unusable data presentation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent unusable data presentation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T225 — Establish Responsive Code Block Rules

Prevent code from breaking the viewport.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent code from breaking the viewport. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T226 — Establish Responsive Dialog and Drawer Rules

Use appropriate interaction patterns by viewport.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use appropriate interaction patterns by viewport. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T227 — Establish Touch Target Minimums

Improve mobile usability.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Improve mobile usability. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T228 — Remove Shared Fixed-Width Mobile Breakage

Fix reusable components that assume desktop width.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Fix reusable components that assume desktop width. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream U — Accessibility Foundation

## P01-T229 — Establish Focus-Visible System

Create consistent keyboard focus indicators.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create consistent keyboard focus indicators. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T230 — Remove Focus Outline Suppression

Eliminate inaccessible focus removal.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Eliminate inaccessible focus removal. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T231 — Establish Semantic Heading Rules

Prevent visual heading styles from breaking document structure.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent visual heading styles from breaking document structure. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T232 — Establish Accessible Icon Button Rules

Require accessible names.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Require accessible names. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T233 — Establish Form Accessibility Rules

Standardize labels, descriptions and errors.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Standardize labels, descriptions and errors. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T234 — Establish Navigation Accessibility Rules

Support semantic and keyboard navigation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Support semantic and keyboard navigation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T235 — Establish Overlay Accessibility Rules

Standardize focus trapping and restoration.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Standardize focus trapping and restoration. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P01-T236 — Establish Reduced Motion Support

Respect user preferences.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Respect user preferences. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T237 — Establish Screen Reader Utility Patterns

Support visually hidden accessible content.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Support visually hidden accessible content. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T238 — Establish Minimum Contrast Requirements

Apply them to canonical tokens and components.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Apply them to canonical tokens and components. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream V — Motion & Interaction Foundation

## P01-T239 — Define Motion Principles

Use motion to explain state changes rather than decorate everything.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use motion to explain state changes rather than decorate everything. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T240 — Standardize Transition Durations

Remove inconsistent animation timing.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Remove inconsistent animation timing. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P01-T241 — Standardize Transition Easing

Create consistent interaction feel.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Create consistent interaction feel. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P01-T242 — Remove Universal Transition-All Usage Where Harmful

Avoid unnecessary property animation.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Avoid unnecessary property animation. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T243 — Remove Unnecessary Hover Scaling

Reduce visual instability.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce visual instability. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T244 — Standardize Hover Feedback

Use restrained colour, border or background changes.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Use restrained colour, border or background changes. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P01-T245 — Standardize Pressed and Active Feedback

Improve control responsiveness.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Improve control responsiveness. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P01-T246 — Implement Reduced-Motion Alternatives

Ensure essential interaction remains understandable.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Ensure essential interaction remains understandable. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

# Workstream W — Icon Architecture

## P01-T247 — Establish Canonical Icon Library

Use one primary icon system.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use one primary icon system. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P01-T248 — Standardize Icon Sizes

Create predictable sizing roles.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Create predictable sizing roles. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P01-T249 — Standardize Icon Stroke Treatment

Avoid inconsistent visual weight.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Avoid inconsistent visual weight. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

## P01-T250 — Remove Decorative Icon Overuse

Use icons only where they improve comprehension.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Use icons only where they improve comprehension. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T251 — Remove Mixed Icon Libraries Where Unnecessary

Reduce inconsistency and bundle duplication.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce inconsistency and bundle duplication. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T252 — Standardize Icon and Text Spacing

Improve control alignment.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Improve control alignment. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P2

---

# Workstream X — Theme Infrastructure

## P01-T253 — Consolidate Theme Provider Architecture

Ensure one canonical theme system.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Ensure one canonical theme system. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P01-T254 — Implement System Theme Support

Respect operating-system preference.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Respect operating-system preference. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T255 — Prevent Theme Flash

Reduce incorrect-theme rendering during load.

**Execution:** Execute this task against the current repository in the context of Workstream X — Theme Infrastructure, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Reduce incorrect-theme rendering during load. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P01-T256 — Standardize Theme Persistence

Ensure predictable user preference behavior.

**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Apply this specifically to: Ensure predictable user preference behavior. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P01-T257 — Remove Component-Level Theme Hacks

Migrate components to semantic tokens.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Migrate components to semantic tokens. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T258 — Remove Duplicate Theme Detection Logic

Use one canonical mechanism.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Use one canonical mechanism. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T259 — Validate Native Control Theme Behavior

Ensure browser-native elements align with the selected theme.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Ensure browser-native elements align with the selected theme. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P2

---

# Workstream Y — Legacy UI Consolidation

## P01-T260 — Build Legacy Component Replacement Map

Map every major legacy shared component to its V2 replacement.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Map every major legacy shared component to its V2 replacement. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T261 — Consolidate Duplicate Button Systems

Choose and migrate toward one canonical implementation.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Choose and migrate toward one canonical implementation. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P01-T262 — Consolidate Duplicate Card Systems

Reduce parallel card architectures.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Reduce parallel card architectures. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P01-T263 — Consolidate Duplicate Badge Systems

Remove unnecessary variants and implementations.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Remove unnecessary variants and implementations. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

## P01-T264 — Consolidate Duplicate Input Systems

Create one shared form foundation.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Create one shared form foundation. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

## P01-T265 — Consolidate Duplicate Dialog Systems

Standardize overlay behavior.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Standardize overlay behavior. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

## P01-T266 — Consolidate Duplicate Drawer Systems

Prepare for mobile navigation migration.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Prepare for mobile navigation migration. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

## P01-T267 — Consolidate Duplicate Breadcrumb Systems

Prepare for unified UX and SEO hierarchy.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Prepare for unified UX and SEO hierarchy. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P01-T268 — Consolidate Duplicate Loading Systems

Create consistent feedback.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Create consistent feedback. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

## P01-T269 — Consolidate Duplicate Empty-State Systems

Remove route-specific reinvention.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Remove route-specific reinvention. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P2

---

## P01-T270 — Consolidate Duplicate Error-State Systems

Standardize recovery patterns.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Standardize recovery patterns. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

## P01-T271 — Consolidate Duplicate Code Block Shells

Prepare for question-page migration.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Prepare for question-page migration. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P01-T272 — Consolidate Duplicate Content Callouts

Create one educational component family.

**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Apply this specifically to: Create one educational component family. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P1

---

## P01-T273 — Remove Confirmed Dead Shared UI Components

Delete only after usage verification.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Delete only after usage verification. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T274 — Prevent Legacy Component Reintroduction

Document replacement rules for active development.

**Execution:** Execute this task against the current repository in the context of Workstream Y — Legacy UI Consolidation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document replacement rules for active development. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream Z — Repository-Wide Root Style Migration

## P01-T275 — Replace Shared Hard-Coded Background Colors

Migrate common shared components to semantic tokens.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Migrate common shared components to semantic tokens. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T276 — Replace Shared Hard-Coded Text Colors

Migrate common shared components to semantic hierarchy.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Migrate common shared components to semantic hierarchy. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T277 — Replace Shared Hard-Coded Border Colors

Use canonical border tokens.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use canonical border tokens. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T278 — Replace Shared Arbitrary Border Radii

Use the canonical radius scale.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use the canonical radius scale. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P01-T279 — Replace Shared Arbitrary Shadows

Use canonical elevation roles.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use canonical elevation roles. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P01-T280 — Replace Shared Arbitrary Width Constraints

Use canonical containers.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use canonical containers. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T281 — Replace Shared Arbitrary Spacing Patterns

Use the canonical spacing system.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use the canonical spacing system. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T282 — Replace Shared Arbitrary Typography

Use canonical text roles.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use canonical text roles. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T283 — Replace Shared Arbitrary Hover Effects

Use canonical interaction behavior.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use canonical interaction behavior. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P1

---

## P01-T284 — Replace Shared Arbitrary Focus States

Use the global focus system.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Use the global focus system. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T285 — Remove Shared Nested-Card Patterns

Flatten reusable composition where possible.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Flatten reusable composition where possible. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T286 — Remove Shared Decorative Gradient Overuse

Reserve gradients for intentional brand or hero use.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reserve gradients for intentional brand or hero use. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T287 — Remove Shared Excessive Border Usage

Use whitespace and hierarchy where possible.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Use whitespace and hierarchy where possible. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T288 — Remove Shared Excessive Badge Usage

Reduce visual fragmentation.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce visual fragmentation. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P01-T289 — Remove Shared Excessive Icon Usage

Improve visual calm.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Improve visual calm. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P01-T290 — Remove Shared Unnecessary Motion

Reduce distraction.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce distraction. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

# Workstream AA — V2 UI Development & Review Surfaces

## P01-T291 — Create V2 Primitive Review Surface

Render canonical primitives together for rapid comparison.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Render canonical primitives together for rapid comparison. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T292 — Create Typography Review Surface

Review headings, body text, lists and code.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Review headings, body text, lists and code. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T293 — Create Color and Surface Review Surface

Review semantic hierarchy in both themes.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Review semantic hierarchy in both themes. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T294 — Create Form Component Review Surface

Validate all states consistently.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Validate all states consistently. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T295 — Create Educational Content Review Surface

Test prose, code, callouts, tables and diagrams.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Test prose, code, callouts, tables and diagrams. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T296 — Create Density Stress-Test Surface

Test highly populated content without reverting to visual clutter.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Test highly populated content without reverting to visual clutter. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T297 — Create Long-Reading Stress-Test Surface

Test sustained reading in light and dark themes.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Test sustained reading in light and dark themes. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T298 — Create Mobile Component Stress-Test Surface

Test narrow viewport behavior.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Test narrow viewport behavior. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T299 — Create Wide Desktop Stress-Test Surface

Ensure layouts do not become excessively stretched.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Ensure layouts do not become excessively stretched. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

# Workstream AB — Root UI Performance

## P01-T300 — Audit Design-System Bundle Cost

Prevent the V2 component foundation from introducing excessive JavaScript.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Prevent the V2 component foundation from introducing excessive JavaScript. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P01-T301 — Minimize Client-Only UI Primitives

Keep static visual components server-compatible where possible.

**Execution:** Execute this task against the current repository in the context of Workstream AB — Root UI Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Keep static visual components server-compatible where possible. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P01-T302 — Avoid Unnecessary Runtime Styling

Prefer predictable build-time styling where appropriate.

**Execution:** Execute this task against the current repository in the context of Workstream AB — Root UI Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prefer predictable build-time styling where appropriate. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P01-T303 — Reduce Duplicate Icon Bundle Cost

Consolidate icon usage.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Consolidate icon usage. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P2

---

## P01-T304 — Reduce Duplicate Component Dependencies

Avoid multiple libraries solving the same UI problem.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Avoid multiple libraries solving the same UI problem. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P01-T305 — Optimize Font Loading

Avoid unnecessary weights and files.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Avoid unnecessary weights and files. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P01-T306 — Prevent Layout Shift from UI Foundation

Stabilize font and component sizing.

**Execution:** Execute this task against the current repository in the context of Workstream AB — Root UI Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Stabilize font and component sizing. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AC — Root UI Integration Protection

## P01-T307 — Add Canonical Component Unit Coverage Where Valuable

Protect complex shared behavior without testing trivial CSS implementation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Protect complex shared behavior without testing trivial CSS implementation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

## P01-T308 — Add Interaction Coverage for Critical Primitives

Protect dialogs, drawers, menus and form interactions.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Protect dialogs, drawers, menus and form interactions. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T309 — Add Accessibility Checks for Canonical Components

Catch shared accessibility regressions early.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Catch shared accessibility regressions early. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P01-T310 — Add Theme Regression Coverage for Critical Components

Protect semantic token usage.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Protect semantic token usage. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T311 — Add Responsive Regression Coverage for High-Risk Primitives

Protect shared navigation and overflow-sensitive components.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Protect shared navigation and overflow-sensitive components. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T312 — Add Legacy Import Detection Where Practical

Detect reintroduction of deprecated components.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Detect reintroduction of deprecated components. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P2

---

# Workstream AD — Phase 01 Integration & Completion

## P01-T313 — Migrate One Representative Simple Page to Root V2 System

Verify the design foundation in a realistic page.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Verify the design foundation in a realistic page. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T314 — Migrate One Representative Dense Page to Root V2 System

Test whether the new system genuinely solves density.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Test whether the new system genuinely solves density. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T315 — Migrate One Representative Long-Reading Page to Root V2 System

Test typography and reading width.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Test typography and reading width. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T316 — Migrate One Representative Code-Heavy Surface

Test technical content primitives.

**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Apply this specifically to: Test technical content primitives. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P01-T317 — Compare V1 and V2 Density

Verify that V2 reduces unnecessary visual competition.

**Execution:** Execute this task against the current repository in the context of Workstream AD — Phase 01 Integration & Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Verify that V2 reduces unnecessary visual competition. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P01-T318 — Compare V1 and V2 Reading Comfort

Verify improvements in typography, width and spacing.

**Execution:** Execute this task against the current repository in the context of Workstream AD — Phase 01 Integration & Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Verify improvements in typography, width and spacing. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P01-T319 — Resolve Root-Level UI Defects Found During Representative Migration

Fix the system rather than patching representative pages locally.

**Execution:** Execute this task against the current repository in the context of Workstream AD — Phase 01 Integration & Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Fix the system rather than patching representative pages locally. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P01-T320 — Freeze Canonical V2 Design Tokens

Prevent uncontrolled token changes during mass migration.

**Execution:** Execute this task against the current repository in the context of Workstream AD — Phase 01 Integration & Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prevent uncontrolled token changes during mass migration. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P01-T321 — Freeze Canonical V2 Primitive APIs

Stabilize shared component interfaces before broad adoption.

**Execution:** Execute this task against the current repository in the context of Workstream AD — Phase 01 Integration & Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Stabilize shared component interfaces before broad adoption. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P01-T322 — Publish Legacy-to-V2 Component Mapping

Give later phases an explicit migration path.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Give later phases an explicit migration path. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P01-T323 — Update V2 Technical Implementation Plan

Record the actual implemented UI architecture.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Record the actual implemented UI architecture. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P01-T324 — Update V2 Decision Log

Record important UI architecture decisions.

**Execution:** Execute this task against the current repository in the context of Workstream AD — Phase 01 Integration & Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Record important UI architecture decisions. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P01-T325 — Update V2 Issue Log

Record unresolved UI issues that belong to later route-specific phases.

**Execution:** Execute this task against the current repository in the context of Workstream AD — Phase 01 Integration & Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Record unresolved UI issues that belong to later route-specific phases. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P01-T326 — Produce Phase 01 Completion Report

Document:

* implemented root systems,
* migrated primitives,
* removed legacy systems,
* remaining route-specific work,
* known risks.

**Execution:** Execute this task against the current repository in the context of Workstream AD — Phase 01 Integration & Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document: implemented root systems, migrated primitives, removed legacy systems, remaining route-specific work, known risks. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P01-T327 — Approve Phase 01 Foundation for Mass Page Migration

Confirm that later phases can build on the canonical V2 system rather than creating new visual architectures.

**Execution:** Execute this task against the current repository in the context of Workstream AD — Phase 01 Integration & Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Confirm that later phases can build on the canonical V2 system rather than creating new visual architectures. # Phase 01 Exit Criteria Phase 01 is complete when Interview Explainer has: one canonical semantic color architecture, one coherent light theme, one coherent dark theme, one typography system, one reading-width architecture, one spacing system, one surface hierarchy, one radius and shadow system, canonical la Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Phase 01 Exit Criteria

Phase 01 is complete when Interview Explainer has:

* one canonical semantic color architecture,
* one coherent light theme,
* one coherent dark theme,
* one typography system,
* one reading-width architecture,
* one spacing system,
* one surface hierarchy,
* one radius and shadow system,
* canonical layout primitives,
* canonical buttons,
* canonical cards and panels,
* canonical badges and tags,
* canonical form components,
* canonical search input foundation,
* canonical navigation primitives,
* canonical overlays,
* canonical loading, empty and error states,
* canonical educational content components,
* responsive foundations,
* accessibility foundations,
* motion rules,
* icon rules,
* theme infrastructure,
* a legacy component replacement map,
* representative pages proving the system works.

Phase 01 does not require every route to be visually migrated.

It requires the **root system to be strong enough that every later route can be migrated without inventing another design language**.

---

# Phase 01 Core Principle

```text
DO NOT FIX 100 PAGES
WITH 100 DIFFERENT CSS PATCHES

FIX THE ROOT SYSTEM

THEN MIGRATE 100 PAGES
ONTO THAT SYSTEM
```

The intended visual transformation is:

```text
CURRENT

Dense
Boxed
Highly coloured
Competing surfaces
Inconsistent widths
Inconsistent typography
Too many badges
Too many borders
Too many hover effects
Parallel component systems

        ↓

V2

Calm
Readable
Content-first
Intentional hierarchy
Controlled colour
Strong typography
Generous but efficient spacing
Minimal unnecessary surfaces
Consistent responsive behavior
One reusable UI architecture
```

---

# Next Phase

```text
PHASE 02

ROOT SEO, INDEXING,
ROUTING & URL ARCHITECTURE REBUILD
```

Phase 02 should be similarly implementation-heavy and should rebuild the root search-engine architecture before performing the later page-by-page SEO completion sweep.
