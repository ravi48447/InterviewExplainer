# PHASE 04 — HOMEPAGE & PUBLIC DISCOVERY EXPERIENCE REBUILD

## Phase Objective

Completely rebuild the Interview Explainer homepage and its primary public discovery experience using the canonical V2 foundations created in:

* Phase 01 — Design System & UI Foundation
* Phase 02 — SEO, Indexing & URL Architecture
* Phase 03 — Global Application Shell

The homepage must become:

* calm,
* focused,
* readable,
* immediately understandable,
* search-friendly,
* mobile-first,
* fast,
* accessible,
* conversion-aware,
* content-discovery oriented.

The homepage must not attempt to display every:

* technology,
* question,
* company,
* topic,
* feature,
* tool,
* roadmap,
* statistic,
* badge,
* CTA.

The homepage is an orientation layer.

The target journey is:

```text
LAND
  ↓
UNDERSTAND
  ↓
CHOOSE A PREPARATION PATH
  ↓
DISCOVER RELEVANT CONTENT
  ↓
START PREPARING
  ↓
CONTINUE DEEPER INTO THE SITE
```

The core homepage question is:

```text
CAN A NEW USER UNDERSTAND
WHAT INTERVIEW EXPLAINER OFFERS
AND FIND THE RIGHT STARTING POINT
WITHIN A FEW SECONDS?
```

---

# Workstream A — Homepage Product Strategy

## P04-T001 — Define the Primary Homepage Job

The homepage must primarily orient users and route them toward relevant interview preparation.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: The homepage must primarily orient users and route them toward relevant interview preparation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T002 — Define the Primary Homepage Audience

Identify the major user groups without creating separate competing homepages.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Identify the major user groups without creating separate competing homepages. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T003 — Define the First-Time Visitor Journey

Establish the expected path from arrival to first meaningful content interaction.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Establish the expected path from arrival to first meaningful content interaction. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T004 — Define the Returning Visitor Journey

Provide lightweight continuation without turning the public homepage into a dashboard.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Provide lightweight continuation without turning the public homepage into a dashboard. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T005 — Define the Anonymous Visitor Journey

Ensure the core product remains understandable without authentication.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Ensure the core product remains understandable without authentication. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T006 — Define the Authenticated Visitor Journey

Allow relevant continuation while preserving the homepage's public purpose.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Allow relevant continuation while preserving the homepage's public purpose. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T007 — Define Homepage Primary Conversion

Choose the most important user action.

Possible outcomes include:

* search for interview content,
* choose a preparation track,
* start a stack,
* start practicing.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Choose the most important user action. Possible outcomes include: search for interview content, choose a preparation track, start a stack, start practicing. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T008 — Define Homepage Secondary Conversions

Limit the number of competing secondary actions.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Limit the number of competing secondary actions. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T009 — Remove Homepage Feature Competition

Prevent every product capability from demanding equal visual attention.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Prevent every product capability from demanding equal visual attention. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T010 — Define Homepage Success Metrics

Track meaningful discovery and progression rather than superficial interaction counts.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Track meaningful discovery and progression rather than superficial interaction counts. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream B — Homepage Information Architecture

## P04-T011 — Audit Existing Homepage Sections

Classify every current section as:

* keep,
* simplify,
* merge,
* relocate,
* remove.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Classify every current section as: keep, simplify, merge, relocate, remove. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T012 — Identify Duplicate Homepage Messages

Remove repeated explanations of the same product value.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Remove repeated explanations of the same product value. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T013 — Identify Competing Homepage CTAs

Reduce decision overload.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Reduce decision overload. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T014 — Identify Decorative Sections Without Clear User Value

Remove or relocate them.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Remove or relocate them. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T015 — Define Final Homepage Section Order

Create one intentional narrative.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Create one intentional narrative. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T016 — Define Above-the-Fold Content

Only essential orientation should appear initially.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Only essential orientation should appear initially. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T017 — Define Mid-Page Discovery Content

Help users explore preparation paths.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Help users explore preparation paths. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T018 — Define Lower-Page Trust and Depth Content

Support credibility without overwhelming the primary experience.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Support credibility without overwhelming the primary experience. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T019 — Define Homepage Exit Paths

Every major section should lead somewhere meaningful.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Every major section should lead somewhere meaningful. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T020 — Prevent Homepage Dead Ends


**Execution:** Execute this task against the current repository in the context of Workstream B — Homepage Information Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream C — Homepage Content Hierarchy

## P04-T021 — Establish One Primary H1

The homepage must have one clear primary message.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: The homepage must have one clear primary message. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T022 — Establish Supporting Hero Copy

Explain the product concisely.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Explain the product concisely. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T023 — Establish Primary CTA Hierarchy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T024 — Establish Secondary CTA Hierarchy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T025 — Establish Section Heading Hierarchy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T026 — Remove Heading-Level Misuse

Use semantic headings rather than visual heading tags.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Use semantic headings rather than visual heading tags. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T027 — Reduce Excessive Marketing Copy

Prioritize clarity over exaggerated language.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Prioritize clarity over exaggerated language. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T028 — Remove Repeated Value Propositions


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T029 — Remove Unnecessary Microcopy

Reduce visual and cognitive noise.

**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Apply this specifically to: Reduce visual and cognitive noise. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P04-T030 — Establish Consistent Homepage Voice

Professional, useful and interview-focused.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Professional, useful and interview-focused. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream D — Hero Rebuild

## P04-T031 — Rebuild Homepage Hero

Create a focused opening experience.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Create a focused opening experience. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P04-T032 — Define Hero H1

Clearly communicate what Interview Explainer helps users do.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Clearly communicate what Interview Explainer helps users do. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T033 — Define Hero Supporting Text

Explain the platform without a dense paragraph.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Explain the platform without a dense paragraph. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T034 — Define Hero Primary Action


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T035 — Define Hero Secondary Action

Only if genuinely necessary.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Only if genuinely necessary. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T036 — Prevent Hero CTA Overload


**Execution:** Execute this task against the current repository in the context of Workstream D — Hero Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T037 — Remove Excessive Hero Badges


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T038 — Remove Decorative Hero Statistics Without Strong Value


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P04-T039 — Reduce Hero Colour Density

Use a restrained visual treatment.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Use a restrained visual treatment. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T040 — Reduce Hero Surface Layering

Avoid cards inside cards inside gradients.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Avoid cards inside cards inside gradients. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T041 — Use Subtle Background Treatment

Do not allow decorative gradients to reduce readability.

**Execution:** Execute this task against the current repository in the context of Workstream D — Hero Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not allow decorative gradients to reduce readability. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T042 — Establish Hero Maximum Text Width

Improve scanning and readability.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Improve scanning and readability. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T043 — Establish Hero Vertical Rhythm


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T044 — Optimize Hero for Mobile


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T045 — Prevent Hero from Occupying Excessive Mobile Height


**Execution:** Execute this task against the current repository in the context of Workstream D — Hero Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T046 — Prevent Hero Layout Shift


**Execution:** Execute this task against the current repository in the context of Workstream D — Hero Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T047 — Ensure Hero Primary Content Is Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream D — Hero Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T048 — Ensure Hero CTA Uses Canonical URL


**Execution:** Execute this task against the current repository in the context of Workstream D — Hero Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream E — Homepage Search Experience

## P04-T049 — Define Homepage Search Role

Determine whether search is the primary or secondary discovery mechanism.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Determine whether search is the primary or secondary discovery mechanism. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T050 — Build Homepage Search Entry

Use the canonical search foundation.

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Use the canonical search foundation. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P04-T051 — Define Search Placeholder Copy

Use clear task-oriented language.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use clear task-oriented language. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T052 — Support Question Search


**Execution:** Execute this task against the current repository in the context of Workstream E — Homepage Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T053 — Support Technology Search


**Execution:** Execute this task against the current repository in the context of Workstream E — Homepage Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T054 — Support Topic Search


**Execution:** Execute this task against the current repository in the context of Workstream E — Homepage Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T055 — Support Company Search Where Available


**Execution:** Execute this task against the current repository in the context of Workstream E — Homepage Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T056 — Define Search Result Grouping

Prevent mixed result types from becoming confusing.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prevent mixed result types from becoming confusing. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T057 — Define Search Result Visual Hierarchy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T058 — Ensure Search Results Use Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream E — Homepage Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T059 — Implement Search Empty State


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P04-T060 — Implement Search Error State


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P04-T061 — Implement Search Loading State


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P04-T062 — Implement Search Keyboard Navigation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P04-T063 — Implement Search Screen Reader Support


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P04-T064 — Optimize Search for Mobile


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T065 — Avoid Loading the Entire Search Dataset into the Initial Homepage Bundle


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T066 — Prevent Search from Creating Indexable Query Explosion


**Execution:** Execute this task against the current repository in the context of Workstream E — Homepage Search Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream F — Primary Preparation Pathways

## P04-T067 — Define Canonical Homepage Preparation Pathways

Possible pathways may include:

* software engineering,
* data and analytics,
* consulting,
* company-specific preparation,
* DSA,
* behavioral interviews.

Only expose pathways that are sufficiently developed.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Possible pathways may include: software engineering, data and analytics, consulting, company-specific preparation, DSA, behavioral interviews. Only expose pathways that are sufficiently developed. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T068 — Prioritize Pathways by User Value

Do not treat every taxonomy as equally important.

**Execution:** Execute this task against the current repository in the context of Workstream F — Primary Preparation Pathways, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not treat every taxonomy as equally important. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T069 — Build Preparation Pathway Section


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P04-T070 — Define Pathway Card Information Hierarchy

Keep each item concise.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Keep each item concise. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T071 — Use Consistent Pathway Visual Treatment


**Execution:** Execute this task against the current repository in the context of Workstream F — Primary Preparation Pathways, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T072 — Avoid Unique Colours for Every Pathway


**Execution:** Execute this task against the current repository in the context of Workstream F — Primary Preparation Pathways, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T073 — Avoid Excessive Icons


**Execution:** Execute this task against the current repository in the context of Workstream F — Primary Preparation Pathways, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T074 — Ensure Entire Interactive Card Behavior Is Accessible


**Execution:** Execute this task against the current repository in the context of Workstream F — Primary Preparation Pathways, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T075 — Ensure Pathway Links Use Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream F — Primary Preparation Pathways, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T076 — Ensure Pathways Have Meaningful Landing Destinations


**Execution:** Execute this task against the current repository in the context of Workstream F — Primary Preparation Pathways, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T077 — Prevent Empty or Thin Pathways from Homepage Promotion


**Execution:** Execute this task against the current repository in the context of Workstream F — Primary Preparation Pathways, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T078 — Define Mobile Pathway Layout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream G — Technology & Stack Discovery

## P04-T079 — Define Homepage Technology Discovery Strategy

Do not expose the entire taxonomy.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Do not expose the entire taxonomy. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T080 — Select High-Value Technology Entry Points


**Execution:** Execute this task against the current repository in the context of Workstream G — Technology & Stack Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T081 — Build Technology Discovery Section


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P04-T082 — Define Technology Item Content

Use only essential information.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use only essential information. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T083 — Prevent Technology Cards from Becoming Mini Dashboards


**Execution:** Execute this task against the current repository in the context of Workstream G — Technology & Stack Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T084 — Prevent Technology Logo Overload


**Execution:** Execute this task against the current repository in the context of Workstream G — Technology & Stack Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T085 — Use Consistent Technology Visual Treatment


**Execution:** Execute this task against the current repository in the context of Workstream G — Technology & Stack Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T086 — Link Technologies to Canonical Stack or Hub Pages


**Execution:** Execute this task against the current repository in the context of Workstream G — Technology & Stack Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T087 — Provide a Clear “Explore All” Path


**Execution:** Execute this task against the current repository in the context of Workstream G — Technology & Stack Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T088 — Avoid Rendering Hundreds of Technologies on the Homepage


**Execution:** Execute this task against the current repository in the context of Workstream G — Technology & Stack Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T089 — Ensure Technology Discovery Is Server-Visible


**Execution:** Execute this task against the current repository in the context of Workstream G — Technology & Stack Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T090 — Optimize Technology Section for Mobile


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream H — Domain Discovery

## P04-T091 — Define Domain-Level Discovery

Expose broad career or interview domains where useful.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Expose broad career or interview domains where useful. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T092 — Build Domain Discovery Section Where Product Coverage Supports It


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P04-T093 — Differentiate Domains from Technology Stacks

Prevent taxonomy confusion.

**Execution:** Execute this task against the current repository in the context of Workstream H — Domain Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Prevent taxonomy confusion. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T094 — Use Canonical Domain URLs


**Execution:** Execute this task against the current repository in the context of Workstream H — Domain Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T095 — Prevent Duplicate Domain and Stack Promotion


**Execution:** Execute this task against the current repository in the context of Workstream H — Domain Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T096 — Avoid Empty Domain Landing Pages


**Execution:** Execute this task against the current repository in the context of Workstream H — Domain Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream I — Question Discovery

## P04-T097 — Define Homepage Question Discovery Role

Questions should demonstrate product depth without overwhelming the homepage.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Questions should demonstrate product depth without overwhelming the homepage. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T098 — Define Featured Question Selection Logic


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T099 — Avoid Random Question Selection Without Purpose


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T100 — Build Featured Question Section


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P04-T101 — Define Question Preview Content

Potentially include:

* question title,
* topic,
* difficulty,
* brief context.

Keep it minimal.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Potentially include: question title, topic, difficulty, brief context. Keep it minimal. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T102 — Avoid Showing Full Answers on the Homepage


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T103 — Avoid Excessive Question Metadata


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T104 — Ensure Question Links Use Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T105 — Ensure Question Titles Remain the Visual Focus


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T106 — Standardize Difficulty Treatment


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P04-T107 — Avoid Aggressive Difficulty Colours


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T108 — Define Mobile Question List Layout


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T109 — Ensure Featured Questions Are Indexable Destination Pages


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream J — Continue Preparation Experience

## P04-T110 — Define Returning-User Continuation Experience


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T111 — Keep Continuation Secondary to Public Discovery


**Execution:** Execute this task against the current repository in the context of Workstream J — Continue Preparation Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T112 — Show Continuation Only When Meaningful State Exists


**Execution:** Execute this task against the current repository in the context of Workstream J — Continue Preparation Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T113 — Avoid Empty Personalized Sections


**Execution:** Execute this task against the current repository in the context of Workstream J — Continue Preparation Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T114 — Avoid Blocking Homepage Rendering on User State


**Execution:** Execute this task against the current repository in the context of Workstream J — Continue Preparation Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T115 — Load Personalized Continuation Independently


**Execution:** Execute this task against the current repository in the context of Workstream J — Continue Preparation Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T116 — Define Continue-Learning Item Structure


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T117 — Use Canonical Content URLs


**Execution:** Execute this task against the current repository in the context of Workstream J — Continue Preparation Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T118 — Prevent Private User State from Affecting Canonical Homepage Content


**Execution:** Execute this task against the current repository in the context of Workstream J — Continue Preparation Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T119 — Prevent Personalized Content from Creating Layout Shift


**Execution:** Execute this task against the current repository in the context of Workstream J — Continue Preparation Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream K — Product Capability Presentation

## P04-T120 — Inventory Product Capabilities Currently Promoted


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T121 — Identify Capabilities Important Enough for Homepage Exposure


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T122 — Remove Low-Priority Feature Promotion


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T123 — Merge Overlapping Feature Sections


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P04-T124 — Build Concise Capability Section If Required


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P04-T125 — Explain Capabilities Through User Outcomes


**Execution:** Execute this task against the current repository in the context of Workstream K — Product Capability Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T126 — Avoid Icon-Grid Feature Walls


**Execution:** Execute this task against the current repository in the context of Workstream K — Product Capability Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T127 — Avoid Repetitive Feature Cards


**Execution:** Execute this task against the current repository in the context of Workstream K — Product Capability Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T128 — Avoid Unverified Superlative Claims


**Execution:** Execute this task against the current repository in the context of Workstream K — Product Capability Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T129 — Link Capabilities to Real Product Experiences


**Execution:** Execute this task against the current repository in the context of Workstream K — Product Capability Presentation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream L — Trust & Credibility

## P04-T130 — Define Genuine Trust Signals

Use only verifiable information.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Use only verifiable information. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T131 — Remove Unsupported User Counts


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T132 — Remove Unsupported Success Claims


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T133 — Remove Artificial Social Proof


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T134 — Avoid Fake Testimonials


**Execution:** Execute this task against the current repository in the context of Workstream L — Trust & Credibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T135 — Use Product Depth as a Trust Signal

Show real content breadth where meaningful.

**Execution:** Execute this task against the current repository in the context of Workstream L — Trust & Credibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Show real content breadth where meaningful. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T136 — Use Transparent Product Positioning


**Execution:** Execute this task against the current repository in the context of Workstream L — Trust & Credibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T137 — Use Real User Testimonials Only When Available


**Execution:** Execute this task against the current repository in the context of Workstream L — Trust & Credibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T138 — Keep Trust Section Visually Restrained


**Execution:** Execute this task against the current repository in the context of Workstream L — Trust & Credibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream M — Homepage Statistics

## P04-T139 — Audit Existing Homepage Statistics


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T140 — Verify Every Published Statistic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T141 — Remove Unverifiable Statistics


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T142 — Generate Content Counts from Canonical Data Where Used


**Execution:** Execute this task against the current repository in the context of Workstream M — Homepage Statistics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T143 — Prevent Stale Hard-Coded Counts


**Execution:** Execute this task against the current repository in the context of Workstream M — Homepage Statistics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T144 — Avoid Excessive Animated Counters


**Execution:** Execute this task against the current repository in the context of Workstream M — Homepage Statistics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T145 — Avoid Making Statistics the Primary Homepage Message


**Execution:** Execute this task against the current repository in the context of Workstream M — Homepage Statistics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream N — Company Discovery

## P04-T146 — Define Whether Company Discovery Belongs on Homepage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T147 — Promote Only Meaningful Company Content


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T148 — Build Company Discovery Section Where Coverage Supports It


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P04-T149 — Use Canonical Company URLs


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T150 — Avoid Logo Walls


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T151 — Avoid Implying Company Affiliation


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T152 — Clearly Position Company Pages as Preparation Resources


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T153 — Ensure Company Brand Usage Is Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream O — DSA Discovery

## P04-T154 — Define DSA Homepage Entry Point


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T155 — Avoid Mixing DSA Taxonomy Into Every Homepage Section


**Execution:** Execute this task against the current repository in the context of Workstream O — DSA Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T156 — Build Clear DSA Discovery Entry


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P04-T157 — Link to Canonical DSA Hub


**Execution:** Execute this task against the current repository in the context of Workstream O — DSA Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T158 — Explain DSA Value Concisely


**Execution:** Execute this task against the current repository in the context of Workstream O — DSA Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T159 — Avoid Rendering Large Problem Lists on Homepage


**Execution:** Execute this task against the current repository in the context of Workstream O — DSA Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream P — Behavioral Interview Discovery

## P04-T160 — Define Behavioral Preparation Entry Point


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T161 — Build Behavioral Discovery Entry Where Coverage Supports It


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P04-T162 — Distinguish Behavioral Preparation from Technical Questions


**Execution:** Execute this task against the current repository in the context of Workstream P — Behavioral Interview Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T163 — Use Canonical Behavioral Content URLs


**Execution:** Execute this task against the current repository in the context of Workstream P — Behavioral Interview Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T164 — Avoid Empty Behavioral Promotion


**Execution:** Execute this task against the current repository in the context of Workstream P — Behavioral Interview Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Q — Consulting & Non-Technical Discovery

## P04-T165 — Define Non-Technical Interview Domain Discovery

Support future expansion beyond software interviews.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Support future expansion beyond software interviews. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T166 — Prevent Homepage Architecture from Being Hard-Coded to Java or Software Engineering


**Execution:** Execute this task against the current repository in the context of Workstream Q — Consulting & Non-Technical Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T167 — Support Data and Analytics Discovery

Where content exists.

**Execution:** Execute this task against the current repository in the context of Workstream Q — Consulting & Non-Technical Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Where content exists. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T168 — Support Management Consulting Discovery

Where content exists.

**Execution:** Execute this task against the current repository in the context of Workstream Q — Consulting & Non-Technical Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Where content exists. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T169 — Keep Undeveloped Domains Out of Primary Homepage Promotion


**Execution:** Execute this task against the current repository in the context of Workstream Q — Consulting & Non-Technical Discovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T170 — Build Extensible Discovery Data Model


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

# Workstream R — Homepage CTA Architecture

## P04-T171 — Define One Primary CTA Style


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T172 — Define One Secondary CTA Style


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T173 — Remove Competing CTA Colours


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T174 — Remove Repetitive “Get Started” Buttons


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T175 — Use Context-Specific CTA Labels


**Execution:** Execute this task against the current repository in the context of Workstream R — Homepage CTA Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T176 — Ensure CTA Destinations Match User Expectations


**Execution:** Execute this task against the current repository in the context of Workstream R — Homepage CTA Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T177 — Ensure CTA Links Use Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream R — Homepage CTA Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T178 — Ensure CTA Keyboard Accessibility


**Execution:** Execute this task against the current repository in the context of Workstream R — Homepage CTA Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T179 — Ensure CTA Mobile Touch Accessibility


**Execution:** Execute this task against the current repository in the context of Workstream R — Homepage CTA Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream S — Homepage Card Reduction

## P04-T180 — Inventory Every Homepage Card Type


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T181 — Remove Cards Used Only as Generic Containers


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T182 — Merge Duplicate Card Patterns


**Execution:** Inventory the competing implementations for this responsibility, select the canonical V2 owner using the phase architecture, and migrate active consumers to it instead of keeping parallel paths. Remove or deprecate the superseded path only after consumer migration, leaving one documented source of truth and no ambiguous ownership.

**Priority:** P0

---

## P04-T183 — Use Flat Sections Where Cards Add No Meaning


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P04-T184 — Reduce Card Border Density


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T185 — Reduce Card Shadow Density


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T186 — Reduce Nested Cards


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T187 — Reduce Card Hover Motion


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P04-T188 — Preserve Cards Only for Genuine Grouped Interactive Objects


**Execution:** Execute this task against the current repository in the context of Workstream S — Homepage Card Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T189 — Standardize Remaining Card Padding


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P04-T190 — Standardize Remaining Card Radius


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

# Workstream T — Colour Simplification

## P04-T191 — Audit Homepage Colour Usage


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T192 — Remove Arbitrary Section Colours


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T193 — Remove Excessive Gradient Usage


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T194 — Remove Rainbow Category Styling


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T195 — Use Accent Colour Primarily for Actions and Important States


**Execution:** Execute this task against the current repository in the context of Workstream T — Colour Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T196 — Use Neutral Surfaces for Most Content


**Execution:** Execute this task against the current repository in the context of Workstream T — Colour Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T197 — Preserve Semantic Colours Only for Semantic Meaning


**Execution:** Execute this task against the current repository in the context of Workstream T — Colour Simplification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T198 — Validate Light Theme Colour Balance


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T199 — Validate Dark Theme Colour Balance


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream U — Typography & Readability

## P04-T200 — Apply Canonical Homepage Typography Scale


**Execution:** Execute this task against the current repository in the context of Workstream U — Typography & Readability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T201 — Reduce Oversized Decorative Headings


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T202 — Increase Body Copy Readability


**Execution:** Execute this task against the current repository in the context of Workstream U — Typography & Readability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T203 — Establish Consistent Section Heading Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T204 — Establish Consistent Paragraph Width


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T205 — Avoid Tiny Supporting Text


**Execution:** Execute this task against the current repository in the context of Workstream U — Typography & Readability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T206 — Avoid Excessive Bold Text


**Execution:** Execute this task against the current repository in the context of Workstream U — Typography & Readability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T207 — Avoid Uppercase Overuse


**Execution:** Execute this task against the current repository in the context of Workstream U — Typography & Readability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T208 — Ensure Typography Scales Correctly on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream U — Typography & Readability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream V — Homepage Spacing & Rhythm

## P04-T209 — Establish Homepage Section Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T210 — Establish Hero-to-Content Transition Spacing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T211 — Establish Internal Section Rhythm


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T212 — Remove Arbitrary Margin Values


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T213 — Remove Excessive Section Compression


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T214 — Remove Excessive Empty Decorative Space


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P04-T215 — Balance Desktop Section Spacing


**Execution:** Execute this task against the current repository in the context of Workstream V — Homepage Spacing & Rhythm, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T216 — Balance Mobile Section Spacing


**Execution:** Execute this task against the current repository in the context of Workstream V — Homepage Spacing & Rhythm, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T217 — Prevent Mobile Sections from Becoming Endless Stacked Card Streams


**Execution:** Execute this task against the current repository in the context of Workstream V — Homepage Spacing & Rhythm, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream W — Homepage Mobile Rebuild

## P04-T218 — Design Homepage Mobile-First Flow


**Execution:** Execute this task against the current repository in the context of Workstream W — Homepage Mobile Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T219 — Prioritize Mobile Above-the-Fold Content


**Execution:** Execute this task against the current repository in the context of Workstream W — Homepage Mobile Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T220 — Simplify Mobile Hero


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T221 — Simplify Mobile Search Entry


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T222 — Simplify Mobile Preparation Pathways


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T223 — Reduce Mobile Card Count


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T224 — Prevent Horizontal Carousels Without Clear Benefit


**Execution:** Execute this task against the current repository in the context of Workstream W — Homepage Mobile Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T225 — Prevent Horizontal Overflow


**Execution:** Execute this task against the current repository in the context of Workstream W — Homepage Mobile Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T226 — Ensure Mobile Touch Targets


**Execution:** Execute this task against the current repository in the context of Workstream W — Homepage Mobile Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T227 — Ensure Mobile Text Readability


**Execution:** Execute this task against the current repository in the context of Workstream W — Homepage Mobile Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T228 — Ensure Mobile Search Keyboard Behavior


**Execution:** Execute this task against the current repository in the context of Workstream W — Homepage Mobile Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T229 — Ensure Mobile Section Order Matches User Intent


**Execution:** Execute this task against the current repository in the context of Workstream W — Homepage Mobile Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T230 — Avoid Desktop Content Simply Shrinking onto Mobile


**Execution:** Execute this task against the current repository in the context of Workstream W — Homepage Mobile Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream X — Homepage Tablet Experience

## P04-T231 — Define Tablet Layout Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T232 — Prevent Awkward Two-Column Compression


**Execution:** Execute this task against the current repository in the context of Workstream X — Homepage Tablet Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T233 — Adjust Section Grid Counts Intentionally


**Execution:** Execute this task against the current repository in the context of Workstream X — Homepage Tablet Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T234 — Validate Search Experience on Tablet


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T235 — Validate Navigation-to-Homepage Transition on Tablet


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream Y — Homepage Accessibility

## P04-T236 — Validate Semantic Heading Order


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T237 — Validate Main Landmark


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T238 — Validate Search Landmark and Labels


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T239 — Validate Link Purpose


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T240 — Validate Button Purpose


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T241 — Validate Keyboard Navigation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T242 — Validate Focus Order


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T243 — Validate Focus Visibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T244 — Validate Colour Contrast


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T245 — Validate Reduced Motion


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T246 — Validate Screen Reader Section Structure


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T247 — Validate Decorative Image Handling


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream Z — Homepage SEO Rebuild

## P04-T248 — Apply Canonical Homepage Metadata Contract

Use Phase 02.

**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Use Phase 02. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T249 — Finalize Homepage Title


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T250 — Finalize Homepage Meta Description


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T251 — Finalize Homepage Canonical URL


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T252 — Validate Homepage Indexability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T253 — Validate Homepage Robots Metadata


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T254 — Validate Homepage Open Graph Metadata


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T255 — Validate Homepage Twitter Metadata


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P2

---

## P04-T256 — Apply Homepage WebSite Structured Data

Where appropriate.

**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Where appropriate. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T257 — Apply Organization Structured Data Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T258 — Ensure Structured Data Matches Visible Site Identity


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T259 — Ensure Homepage H1 Matches Core Product Intent


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T260 — Ensure Important Discovery Links Exist in Server HTML


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T261 — Ensure Homepage Links Use Canonical Destinations


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T262 — Prevent Homepage from Linking to Redirects


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T263 — Prevent Homepage from Linking to Thin or Empty Pages


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T264 — Ensure Homepage Provides Crawl Paths to Major Hubs


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T265 — Avoid Homepage Keyword Stuffing


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T266 — Avoid Hidden SEO Content


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T267 — Ensure Homepage Visible Copy Is Useful to Humans First


**Execution:** Execute this task against the current repository in the context of Workstream Z — Homepage SEO Rebuild, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AA — Homepage Internal Linking

## P04-T268 — Define Homepage Crawl Distribution Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T269 — Link to Major Domain Hubs


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T270 — Link to High-Value Stack Hubs


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T271 — Link to DSA Hub


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T272 — Link to Behavioral Preparation Where Available


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T273 — Link to Company Preparation Where Available


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T274 — Link to Major Tools Where Useful


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T275 — Avoid Hundreds of Homepage Links


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T276 — Avoid Hidden Link Lists


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T277 — Use Contextual Anchor Text


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T278 — Ensure Important Links Are Not Interaction-Dependent


**Execution:** Execute this task against the current repository in the context of Workstream AA — Homepage Internal Linking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AB — Homepage Performance

## P04-T279 — Establish Homepage Performance Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T280 — Measure Initial JavaScript Cost


**Execution:** Execute this task against the current repository in the context of Workstream AB — Homepage Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T281 — Reduce Homepage Client Components


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T282 — Keep Static Discovery Sections Server-Rendered


**Execution:** Execute this task against the current repository in the context of Workstream AB — Homepage Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T283 — Lazy Load Noncritical Interactive Features


**Execution:** Execute this task against the current repository in the context of Workstream AB — Homepage Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T284 — Optimize Homepage Images


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T285 — Define Image Loading Priority


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T286 — Prevent Offscreen Images from Loading Eagerly


**Execution:** Execute this task against the current repository in the context of Workstream AB — Homepage Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T287 — Prevent Large Decorative Media from Blocking Initial Render


**Execution:** Execute this task against the current repository in the context of Workstream AB — Homepage Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T288 — Optimize Font Loading


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T289 — Prevent Search Data from Inflating Initial Payload


**Execution:** Execute this task against the current repository in the context of Workstream AB — Homepage Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T290 — Prevent User-State Fetching from Blocking Homepage


**Execution:** Execute this task against the current repository in the context of Workstream AB — Homepage Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T291 — Reduce Third-Party Script Cost


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T292 — Remove Unused Homepage Dependencies


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P04-T293 — Minimize Layout Shift


**Execution:** Execute this task against the current repository in the context of Workstream AB — Homepage Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T294 — Optimize Largest Contentful Paint Candidate


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T295 — Optimize Interaction Responsiveness


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream AC — Homepage Data Architecture

## P04-T296 — Inventory Homepage Data Sources


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T297 — Remove Duplicate Homepage Data Fetches


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T298 — Separate Static Discovery Data from User-Specific Data


**Execution:** Execute this task against the current repository in the context of Workstream AC — Homepage Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T299 — Define Canonical Data Source for Featured Technologies


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T300 — Define Canonical Data Source for Featured Questions


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T301 — Define Canonical Data Source for Domains


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T302 — Define Canonical Data Source for Companies Where Used


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T303 — Define Canonical Data Source for Content Statistics


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T304 — Avoid Hard-Coded Data Duplicating Canonical Content Sources


**Execution:** Execute this task against the current repository in the context of Workstream AC — Homepage Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T305 — Establish Homepage Data Failure Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T306 — Ensure One Failed Section Does Not Break Entire Homepage


**Execution:** Execute this task against the current repository in the context of Workstream AC — Homepage Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T307 — Cache Stable Homepage Data Appropriately


**Execution:** Execute this task against the current repository in the context of Workstream AC — Homepage Data Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T308 — Define Homepage Revalidation Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream AD — Backend Support for Homepage

## P04-T309 — Identify Homepage Backend Dependencies


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T310 — Remove Unnecessary Backend Dependencies


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T311 — Ensure Public Homepage Data Does Not Require Authentication


**Execution:** Execute this task against the current repository in the context of Workstream AD — Backend Support for Homepage, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T312 — Stabilize Homepage Public Data Contracts


**Execution:** Execute this task against the current repository in the context of Workstream AD — Backend Support for Homepage, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T313 — Optimize Homepage Aggregation Queries

Where backend aggregation is required.

**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Apply this specifically to: Where backend aggregation is required. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P04-T314 — Prevent Backend Failure from Producing Empty Homepage


**Execution:** Execute this task against the current repository in the context of Workstream AD — Backend Support for Homepage, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T315 — Prevent User Progress API Failure from Breaking Public Homepage


**Execution:** Execute this task against the current repository in the context of Workstream AD — Backend Support for Homepage, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T316 — Define Graceful Personalized Section Failure


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T317 — Cache Expensive Stable Aggregations


**Execution:** Execute this task against the current repository in the context of Workstream AD — Backend Support for Homepage, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T318 — Avoid Fetching Full Content Records for Small Homepage Previews


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AE — Homepage Analytics

## P04-T319 — Define Homepage Analytics Events

Track only meaningful interactions.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Track only meaningful interactions. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T320 — Track Primary CTA Interaction


**Execution:** Execute this task against the current repository in the context of Workstream AE — Homepage Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T321 — Track Search Engagement


**Execution:** Execute this task against the current repository in the context of Workstream AE — Homepage Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T322 — Track Preparation Path Selection


**Execution:** Execute this task against the current repository in the context of Workstream AE — Homepage Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T323 — Track Technology Discovery Interaction


**Execution:** Execute this task against the current repository in the context of Workstream AE — Homepage Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P04-T324 — Track Featured Question Entry


**Execution:** Execute this task against the current repository in the context of Workstream AE — Homepage Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P04-T325 — Track Continuation Interaction


**Execution:** Execute this task against the current repository in the context of Workstream AE — Homepage Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P04-T326 — Avoid Tracking Every Hover and Decorative Interaction


**Execution:** Execute this task against the current repository in the context of Workstream AE — Homepage Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T327 — Ensure Analytics Does Not Block Rendering


**Execution:** Execute this task against the current repository in the context of Workstream AE — Homepage Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T328 — Respect Privacy and Consent Requirements


**Execution:** Execute this task against the current repository in the context of Workstream AE — Homepage Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AF — Homepage Conversion Architecture

## P04-T329 — Define Conversion Funnel from Homepage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T330 — Reduce Steps to First Useful Content


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T331 — Avoid Premature Authentication Gates


**Execution:** Execute this task against the current repository in the context of Workstream AF — Homepage Conversion Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T332 — Allow Users to Experience Public Content Before Registration


**Execution:** Execute this task against the current repository in the context of Workstream AF — Homepage Conversion Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T333 — Place Authentication Prompts at Meaningful Product Moments


**Execution:** Execute this task against the current repository in the context of Workstream AF — Homepage Conversion Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T334 — Avoid Repetitive Sign-Up CTAs


**Execution:** Execute this task against the current repository in the context of Workstream AF — Homepage Conversion Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T335 — Avoid Modal Interruption on Initial Arrival


**Execution:** Execute this task against the current repository in the context of Workstream AF — Homepage Conversion Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T336 — Keep Primary Discovery Functional Without Account Creation


**Execution:** Execute this task against the current repository in the context of Workstream AF — Homepage Conversion Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AG — Homepage Empty & Failure States

## P04-T337 — Define Featured Content Empty State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T338 — Define Search Empty State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T339 — Define Search Failure State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T340 — Define Personalized Continuation Empty State

Prefer omission when there is no useful content.

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Prefer omission when there is no useful content. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T341 — Define Partial Data Failure Behavior


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T342 — Prevent Technical Error Messages from Reaching Users


**Execution:** Execute this task against the current repository in the context of Workstream AG — Homepage Empty & Failure States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T343 — Prevent Empty Card Shells


**Execution:** Execute this task against the current repository in the context of Workstream AG — Homepage Empty & Failure States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T344 — Prevent Placeholder Content from Appearing in Production


**Execution:** Execute this task against the current repository in the context of Workstream AG — Homepage Empty & Failure States, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AH — Homepage Motion & Interaction

## P04-T345 — Audit Existing Homepage Animations


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T346 — Remove Decorative Continuous Animation


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T347 — Remove Excessive Card Lift Effects


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T348 — Remove Unnecessary Scale Effects


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T349 — Use Motion Only for State Change


**Execution:** Execute this task against the current repository in the context of Workstream AH — Homepage Motion & Interaction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T350 — Standardize Transition Duration


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P04-T351 — Respect Reduced Motion


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T352 — Prevent Animation from Delaying Content Visibility


**Execution:** Execute this task against the current repository in the context of Workstream AH — Homepage Motion & Interaction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AI — Homepage Light Theme

## P04-T353 — Validate Homepage Background Hierarchy in Light Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T354 — Validate Text Contrast in Light Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T355 — Validate Surface Separation in Light Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T356 — Prevent Excessive Pure White Card Layering


**Execution:** Execute this task against the current repository in the context of Workstream AI — Homepage Light Theme, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T357 — Validate Accent Restraint


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T358 — Validate Search Input Visibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T359 — Validate Footer Transition


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AJ — Homepage Dark Theme

## P04-T360 — Validate Homepage Background Hierarchy in Dark Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T361 — Validate Text Contrast in Dark Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T362 — Avoid Pure Black Dominance


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Homepage Dark Theme, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T363 — Prevent Excessive Glowing Borders


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Homepage Dark Theme, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T364 — Prevent Excessive Neon Accents


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Homepage Dark Theme, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T365 — Validate Surface Separation Without Heavy Borders


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T366 — Validate Search Input Visibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T367 — Validate Footer Transition


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AK — Homepage Content Freshness

## P04-T368 — Define Which Homepage Sections Are Static


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T369 — Define Which Homepage Sections Are Data-Driven


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T370 — Prevent Stale Featured Content


**Execution:** Execute this task against the current repository in the context of Workstream AK — Homepage Content Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T371 — Prevent Removed Content from Remaining Featured


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T372 — Prevent Noncanonical Content from Being Featured


**Execution:** Execute this task against the current repository in the context of Workstream AK — Homepage Content Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T373 — Define Featured Content Update Process


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P04-T374 — Avoid Fake “Trending” Labels Without Real Trend Data


**Execution:** Execute this task against the current repository in the context of Workstream AK — Homepage Content Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T375 — Avoid Fake “Popular” Labels Without Supporting Logic


**Execution:** Execute this task against the current repository in the context of Workstream AK — Homepage Content Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AL — Homepage Component Architecture

## P04-T376 — Define Homepage Section Component Boundaries


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P04-T377 — Avoid One Monolithic Homepage Component


**Execution:** Execute this task against the current repository in the context of Workstream AL — Homepage Component Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T378 — Avoid Excessive Micro-Components


**Execution:** Execute this task against the current repository in the context of Workstream AL — Homepage Component Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T379 — Keep Section Data Contracts Explicit


**Execution:** Execute this task against the current repository in the context of Workstream AL — Homepage Component Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T380 — Keep Static Sections Server-Compatible


**Execution:** Execute this task against the current repository in the context of Workstream AL — Homepage Component Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T381 — Isolate Interactive Search Logic


**Execution:** Execute this task against the current repository in the context of Workstream AL — Homepage Component Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T382 — Isolate Personalized User Logic


**Execution:** Execute this task against the current repository in the context of Workstream AL — Homepage Component Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T383 — Reuse Canonical V2 Components


**Execution:** Execute this task against the current repository in the context of Workstream AL — Homepage Component Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T384 — Prevent Homepage-Specific Design-System Forks


**Execution:** Execute this task against the current repository in the context of Workstream AL — Homepage Component Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T385 — Remove Duplicate Homepage Component Variants


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream AM — Legacy Homepage Cleanup

## P04-T386 — Identify Legacy Homepage Components


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T387 — Identify Legacy Homepage CSS


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T388 — Identify Legacy Homepage Data Utilities


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T389 — Identify Legacy Homepage Analytics Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T390 — Remove Confirmed Dead Homepage Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T391 — Remove Confirmed Dead Homepage CSS


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T392 — Remove Confirmed Dead Homepage Data Utilities


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T393 — Remove Obsolete Hero Variants


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T394 — Remove Obsolete Feature Sections


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T395 — Remove Obsolete CTA Components


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P04-T396 — Prevent Legacy Homepage Reintroduction


**Execution:** Execute this task against the current repository in the context of Workstream AM — Legacy Homepage Cleanup, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AN — Homepage Visual Density Reduction

## P04-T397 — Measure Visible Above-the-Fold Element Count


**Execution:** Execute this task against the current repository in the context of Workstream AN — Homepage Visual Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T398 — Reduce Above-the-Fold Competing Elements


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T399 — Reduce Number of Simultaneous Accent Colours


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T400 — Reduce Number of Card Boundaries


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T401 — Reduce Number of Badges


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T402 — Reduce Number of Icons


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T403 — Reduce Number of CTA Styles


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T404 — Reduce Number of Typography Styles


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P04-T405 — Increase Visual Breathing Room


**Execution:** Execute this task against the current repository in the context of Workstream AN — Homepage Visual Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T406 — Preserve Useful Information Density

Do not confuse simplicity with removing useful content.

**Execution:** Execute this task against the current repository in the context of Workstream AN — Homepage Visual Density Reduction, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Do not confuse simplicity with removing useful content. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AO — Homepage Discovery Quality

## P04-T407 — Verify Every Major User Type Has a Clear Entry Path


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T408 — Verify New Users Can Find a Starting Point


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T409 — Verify Experienced Users Can Reach Deep Content Quickly


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T410 — Verify Search Is Easy to Find


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T411 — Verify Major Interview Domains Are Understandable


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T412 — Verify Taxonomy Terminology Is User-Friendly

Do not expose internal architecture language unnecessarily.

**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Apply this specifically to: Do not expose internal architecture language unnecessarily. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T413 — Verify Homepage Does Not Require Prior Product Knowledge


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T414 — Verify Homepage Does Not Feel Like an Admin Dashboard


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T415 — Verify Homepage Does Not Feel Like a Link Directory


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T416 — Verify Homepage Does Not Feel Like a Marketing Template


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AP — Homepage Testing

## P04-T417 — Validate Homepage Rendering


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T418 — Validate Homepage Hydration


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T419 — Validate Homepage Without Authentication


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T420 — Validate Homepage With Authentication


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T421 — Validate Homepage Without JavaScript for Core Content


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T422 — Validate Homepage Keyboard Navigation


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T423 — Validate Homepage Screen Reader Structure


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T424 — Validate Homepage Mobile Layout


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T425 — Validate Homepage Tablet Layout


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T426 — Validate Homepage Desktop Layout


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T427 — Validate Homepage Wide Desktop Layout


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T428 — Validate Homepage Light Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T429 — Validate Homepage Dark Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T430 — Validate Slow Network Behavior


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T431 — Validate Partial Backend Failure


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T432 — Validate Search Failure


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

# Workstream AQ — Homepage SEO & Crawl Validation

## P04-T433 — Validate Rendered Homepage Title


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T434 — Validate Rendered Homepage Description


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T435 — Validate Rendered Canonical


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T436 — Validate Rendered Robots Directives


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T437 — Validate Structured Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T438 — Validate One H1


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T439 — Validate Heading Hierarchy


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T440 — Validate Canonical Internal Links


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T441 — Validate No Broken Homepage Links


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T442 — Validate No Links to Redirects


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T443 — Validate Major Hubs Are Crawlable from Homepage


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T444 — Validate Homepage Returns Canonical 200


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AR — Homepage Performance Validation

## P04-T445 — Measure Homepage LCP


**Execution:** Execute this task against the current repository in the context of Workstream AR — Homepage Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T446 — Measure Homepage CLS


**Execution:** Execute this task against the current repository in the context of Workstream AR — Homepage Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T447 — Measure Homepage Interaction Responsiveness


**Execution:** Execute this task against the current repository in the context of Workstream AR — Homepage Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T448 — Measure Initial JavaScript Payload


**Execution:** Execute this task against the current repository in the context of Workstream AR — Homepage Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T449 — Measure Initial HTML Content Availability


**Execution:** Execute this task against the current repository in the context of Workstream AR — Homepage Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T450 — Measure Image Payload


**Execution:** Execute this task against the current repository in the context of Workstream AR — Homepage Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T451 — Measure Font Payload


**Execution:** Execute this task against the current repository in the context of Workstream AR — Homepage Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T452 — Measure Third-Party Script Impact


**Execution:** Execute this task against the current repository in the context of Workstream AR — Homepage Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T453 — Fix Root Performance Regressions


**Execution:** Execute this task against the current repository in the context of Workstream AR — Homepage Performance Validation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AS — Homepage Acceptance Review

## P04-T454 — Review Homepage as a First-Time Job Seeker


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T455 — Review Homepage as an Experienced Software Engineer


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T456 — Review Homepage as a Data Analyst Candidate


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T457 — Review Homepage as a Consulting Candidate


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T458 — Review Homepage on a Small Mobile Device


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T459 — Review Homepage in Light Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T460 — Review Homepage in Dark Theme


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T461 — Review Homepage for Visual Density


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T462 — Review Homepage for Reading Comfort


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T463 — Review Homepage for Discovery Clarity


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T464 — Review Homepage for SEO Crawl Paths


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T465 — Fix Root Homepage Defects Rather Than Cosmetic Symptoms


**Execution:** Execute this task against the current repository in the context of Workstream AS — Homepage Acceptance Review, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AT — Phase 04 Completion

## P04-T466 — Freeze Homepage Information Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T467 — Freeze Homepage Hero Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T468 — Freeze Homepage Discovery Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T469 — Freeze Homepage Search Entry Architecture


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T470 — Freeze Homepage CTA Hierarchy


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T471 — Freeze Homepage SEO Contract


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T472 — Freeze Homepage Data Contracts


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T473 — Publish Homepage Component Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P04-T474 — Publish Legacy-to-V2 Homepage Migration Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P04-T475 — Update V2 Technical Implementation Plan


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P04-T476 — Update V2 Decision Log


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T477 — Update V2 Issue Log


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P04-T478 — Produce Phase 04 Completion Report

Document:

* final homepage information architecture,
* final hero,
* discovery paths,
* search integration,
* data sources,
* SEO behavior,
* performance,
* removed legacy components,
* remaining dependencies.

**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document: final homepage information architecture, final hero, discovery paths, search integration, data sources, SEO behavior, performance, removed legacy components, remaining dependencies. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P04-T479 — Approve Homepage as V2 Public Entry Experience


**Execution:** Execute this task against the current repository in the context of Workstream AT — Phase 04 Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: # Phase 04 Exit Criteria Phase 04 is complete when the Interview Explainer homepage: immediately explains the product, has one clear primary message, has one clear primary action, provides obvious preparation starting points, exposes search without overwhelming the interface, links to major canonical content hubs, supports both technical and future non-technical interview domains, does not behave like a dashboard, do Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Phase 04 Exit Criteria

Phase 04 is complete when the Interview Explainer homepage:

* immediately explains the product,
* has one clear primary message,
* has one clear primary action,
* provides obvious preparation starting points,
* exposes search without overwhelming the interface,
* links to major canonical content hubs,
* supports both technical and future non-technical interview domains,
* does not behave like a dashboard,
* does not behave like a giant link directory,
* does not contain excessive cards,
* does not contain excessive colours,
* does not contain excessive badges,
* does not contain excessive icons,
* does not contain competing CTA styles,
* works in light mode,
* works in dark mode,
* works on mobile,
* works on tablet,
* works on desktop,
* remains useful without authentication,
* remains crawlable without client-side interaction,
* uses canonical SEO architecture,
* provides meaningful internal crawl paths,
* loads quickly,
* handles partial backend failure gracefully.

---

# Phase 04 Core Principle

```text id="8d6r1p"
THE HOMEPAGE SHOULD NOT SAY:

LOOK AT EVERYTHING WE HAVE

IT SHOULD SAY:

HERE IS WHAT WE HELP YOU DO
HERE IS WHERE YOU CAN START
```

The intended transformation is:

```text id="1mh9c7"
CURRENT RISK

Too much information
Too many cards
Too many colours
Too many simultaneous entry points
Feature competition
Taxonomy competition
Dashboard-like density
Unclear visual priority

        ↓

V2

Clear product explanation
Calm hero
Strong search entry
Curated preparation pathways
Selective content discovery
Clear hierarchy
Minimal visual noise
Strong canonical internal linking
Fast public rendering
```

---

# Important Architecture Boundary

Phase 04 should not fully redesign:

* stack pages,
* pillar pages,
* module pages,
* question pages,
* answer content,
* company pages,
* DSA problem pages,
* dashboard pages.

The homepage should link into those systems.

Their detailed redesign belongs to dedicated phases.

---

# Next Phase

```text id="bf3w8q"
PHASE 05

CONTENT DISCOVERY HIERARCHY
DOMAIN → STACK → PILLAR → MODULE
```

Phase 05 should rebuild the entire browse-and-discovery hierarchy between the homepage and individual questions.

Its central problem is:

```text id="58trjk"
HOW DOES A USER MOVE FROM:

I WANT TO PREPARE FOR JAVA BACKEND

TO:

JAVA BACKEND
    ↓
SPRING BOOT
    ↓
SECURITY
    ↓
AUTHENTICATION
    ↓
SPECIFIC INTERVIEW QUESTION

WITHOUT GETTING LOST
OR FACING A WALL OF CARDS?
```

That phase should cover all hierarchy hub pages at the root level before the individual question-page redesign begins.
