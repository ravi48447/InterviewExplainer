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

**Priority:** P0

---

## P01-T002 — Define UI Ownership Boundaries

Determine which styling belongs in:

* global CSS,
* Tailwind configuration,
* component variants,
* layout components,
* route-specific components.

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

**Priority:** P0

---

## P01-T004 — Establish Canonical UI Import Boundaries

Prevent pages from bypassing shared V2 primitives unnecessarily.

**Priority:** P1

---

## P01-T005 — Establish Shared Component Naming Convention

Create predictable naming for canonical V2 components.

**Priority:** P2

---

## P01-T006 — Establish Component Variant Strategy

Define how visual variants are implemented without creating duplicate components.

**Priority:** P1

---

## P01-T007 — Establish Component Size Strategy

Standardize compact, default and large sizing where meaningful.

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

**Priority:** P0

---

## P01-T009 — Establish UI Deprecation Mechanism

Mark legacy UI components clearly during migration.

**Priority:** P1

---

## P01-T010 — Prevent New Legacy Styling During V2 Migration

Add development conventions that prevent new arbitrary styling patterns.

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

**Priority:** P0

---

## P01-T012 — Remove Conflicting Global Style Rules

Eliminate global selectors that unexpectedly override component behavior.

**Priority:** P0

---

## P01-T013 — Remove Obsolete Global V1 Styles

Delete confirmed unused legacy rules after dependency verification.

**Priority:** P1

---

## P01-T014 — Consolidate Duplicate CSS Variables

Create one canonical token source.

**Priority:** P0

---

## P01-T015 — Remove Uncontrolled Global Element Styling

Prevent generic selectors from causing route-specific inconsistencies.

**Priority:** P1

---

## P01-T016 — Normalize Browser Base Behavior

Establish predictable:

* box sizing,
* margins,
* typography inheritance,
* media behavior,
* form behavior.

**Priority:** P1

---

## P01-T017 — Standardize Selection Styling

Create theme-compatible text selection behavior.

**Priority:** P3

---

## P01-T018 — Standardize Scroll Behavior

Ensure predictable navigation and anchor behavior.

**Priority:** P2

---

## P01-T019 — Standardize Scrollbar Treatment

Use restrained styling only where appropriate.

**Priority:** P3

---

## P01-T020 — Establish Global Overflow Protection

Prevent common horizontal page overflow without hiding legitimate component defects.

**Priority:** P1

---

# Workstream C — Semantic Color Architecture

## P01-T021 — Remove Arbitrary Global Color Architecture

Replace uncontrolled page-level color decisions with semantic roles.

**Priority:** P0

---

## P01-T022 — Implement Background Color Tokens

Define:

* application background,
* elevated background,
* muted background,
* reading background.

**Priority:** P0

---

## P01-T023 — Implement Surface Color Tokens

Create canonical surfaces for intentional grouping.

**Priority:** P0

---

## P01-T024 — Implement Text Color Hierarchy

Define:

* primary text,
* secondary text,
* muted text,
* disabled text,
* inverse text.

**Priority:** P0

---

## P01-T025 — Implement Border Color Hierarchy

Define subtle and strong boundary roles.

**Priority:** P0

---

## P01-T026 — Implement Primary Action Color Tokens

Create one controlled primary interaction system.

**Priority:** P0

---

## P01-T027 — Implement Semantic Success Colors

Use success color only where semantic meaning exists.

**Priority:** P1

---

## P01-T028 — Implement Semantic Warning Colors

Prevent warning colors from becoming decorative noise.

**Priority:** P1

---

## P01-T029 — Implement Semantic Error Colors

Standardize destructive and validation states.

**Priority:** P1

---

## P01-T030 — Implement Semantic Information Colors

Create restrained informational emphasis.

**Priority:** P2

---

## P01-T031 — Implement Difficulty Color Semantics

Standardize easy, medium and hard indicators without overpowering content.

**Priority:** P1

---

## P01-T032 — Remove Decorative Rainbow Color Usage

Reduce unnecessary multi-colour visual competition.

**Priority:** P0

---

## P01-T033 — Remove Hard-Coded Hex Values from Shared UI

Migrate shared components to semantic tokens.

**Priority:** P0

---

## P01-T034 — Remove Hard-Coded Framework Palette Usage from Canonical Components

Prevent canonical V2 components from depending on arbitrary palette values.

**Priority:** P0

---

## P01-T035 — Validate Semantic Color Contrast

Ensure tokens support readable text and controls.

**Priority:** P0

---

# Workstream D — Light Theme Rebuild

## P01-T036 — Rebuild V2 Light Application Background

Create a calm base suitable for long reading sessions.

**Priority:** P0

---

## P01-T037 — Rebuild Light Surface Hierarchy

Ensure cards and sections do not all appear equally elevated.

**Priority:** P0

---

## P01-T038 — Rebuild Light Text Hierarchy

Improve contrast without making every element visually heavy.

**Priority:** P0

---

## P01-T039 — Rebuild Light Border Treatment

Reduce excessive visible boxes.

**Priority:** P0

---

## P01-T040 — Rebuild Light Interactive States

Standardize hover, active and selected states.

**Priority:** P1

---

## P01-T041 — Rebuild Light Code Presentation Foundation

Prepare comfortable code contrast.

**Priority:** P1

---

## P01-T042 — Rebuild Light Educational Callout Foundation

Create restrained semantic emphasis.

**Priority:** P1

---

## P01-T043 — Remove Pure-White Surface Overuse

Use hierarchy rather than stacking identical white boxes.

**Priority:** P1

---

## P01-T044 — Validate Long-Form Light Reading Comfort

Review sustained content reading rather than only component screenshots.

**Priority:** P0

---

# Workstream E — Dark Theme Rebuild

## P01-T045 — Rebuild V2 Dark Application Background

Create a comfortable dark foundation.

**Priority:** P0

---

## P01-T046 — Rebuild Dark Surface Hierarchy

Avoid excessive layers of differently coloured dark cards.

**Priority:** P0

---

## P01-T047 — Rebuild Dark Text Hierarchy

Avoid both low contrast and excessively bright text.

**Priority:** P0

---

## P01-T048 — Rebuild Dark Border Treatment

Use restrained boundaries.

**Priority:** P0

---

## P01-T049 — Rebuild Dark Interactive States

Create clear but calm interaction feedback.

**Priority:** P1

---

## P01-T050 — Rebuild Dark Code Presentation Foundation

Ensure code remains readable without visual dominance.

**Priority:** P1

---

## P01-T051 — Rebuild Dark Educational Callout Foundation

Prevent bright semantic blocks from overwhelming pages.

**Priority:** P1

---

## P01-T052 — Remove Near-Black Layer Proliferation

Reduce unnecessary dark-surface nesting.

**Priority:** P1

---

## P01-T053 — Validate Long-Form Dark Reading Comfort

Test sustained reading and code-heavy pages.

**Priority:** P0

---

# Workstream F — Typography Architecture

## P01-T054 — Establish Canonical UI Font Strategy

Define the primary UI and body font loading strategy.

**Priority:** P0

---

## P01-T055 — Establish Canonical Monospace Font Strategy

Define code typography without excessive loading cost.

**Priority:** P1

---

## P01-T056 — Implement Display Typography Scale

Standardize major page titles and marketing headings.

**Priority:** P1

---

## P01-T057 — Implement Content Heading Scale

Define H1 through H6 behavior for educational content.

**Priority:** P0

---

## P01-T058 — Implement Body Typography Scale

Define canonical body sizes and line heights.

**Priority:** P0

---

## P01-T059 — Implement Small Text Scale

Standardize secondary information.

**Priority:** P1

---

## P01-T060 — Implement Metadata Typography

Prevent metadata from competing with primary content.

**Priority:** P1

---

## P01-T061 — Implement Label Typography

Standardize form and UI labels.

**Priority:** P1

---

## P01-T062 — Implement Button Typography

Standardize control text weight and sizing.

**Priority:** P2

---

## P01-T063 — Implement Code Typography

Define inline and block code sizing.

**Priority:** P0

---

## P01-T064 — Standardize Font Weight Usage

Limit uncontrolled weight variation.

**Priority:** P1

---

## P01-T065 — Standardize Letter Spacing

Remove arbitrary tracking choices.

**Priority:** P2

---

## P01-T066 — Standardize Heading Line Heights

Improve multiline heading readability.

**Priority:** P1

---

## P01-T067 — Standardize Body Line Height

Optimize long-form reading.

**Priority:** P0

---

## P01-T068 — Standardize Paragraph Spacing

Create consistent reading rhythm.

**Priority:** P0

---

## P01-T069 — Standardize Heading-to-Content Spacing

Make content hierarchy visually understandable.

**Priority:** P0

---

## P01-T070 — Remove Route-Specific Typography Hacks

Migrate shared typography behavior to canonical styles.

**Priority:** P1

---

# Workstream G — Reading Experience Foundation

## P01-T071 — Define Canonical Reading Width

Establish maximum line length for long-form answers.

**Priority:** P0

---

## P01-T072 — Define Wide Content Width

Support tables, diagrams and code without forcing all prose to become wide.

**Priority:** P0

---

## P01-T073 — Define Standard Page Width

Create a canonical general-purpose page container.

**Priority:** P0

---

## P01-T074 — Define Wide Application Width

Support dashboards and complex application layouts.

**Priority:** P1

---

## P01-T075 — Separate Reading Width from Page Width

Prevent long-form text from stretching across large displays.

**Priority:** P0

---

## P01-T076 — Implement Prose Rhythm Foundation

Standardize spacing between content elements.

**Priority:** P0

---

## P01-T077 — Implement Long-Form List Styling

Improve ordered, unordered and nested lists.

**Priority:** P0

---

## P01-T078 — Implement Blockquote Styling

Create restrained quotation treatment.

**Priority:** P2

---

## P01-T079 — Implement Inline Code Styling

Make inline technical terms readable without excessive emphasis.

**Priority:** P1

---

## P01-T080 — Implement Link Styling for Reading Content

Ensure links are identifiable without overwhelming paragraphs.

**Priority:** P1

---

## P01-T081 — Implement Strong and Emphasis Rules

Prevent bold-heavy content from becoming visually noisy.

**Priority:** P1

---

## P01-T082 — Implement Horizontal Rule Treatment

Use subtle content separation.

**Priority:** P2

---

## P01-T083 — Implement Anchor Offset Behavior

Ensure heading links work correctly beneath sticky navigation.

**Priority:** P1

---

## P01-T084 — Implement Long-Word Overflow Handling

Prevent technical terms and URLs from breaking layouts.

**Priority:** P0

---

## P01-T085 — Implement Mixed Prose-and-Code Layout Rules

Allow code to use more width than surrounding prose when appropriate.

**Priority:** P0

---

# Workstream H — Spacing & Density Architecture

## P01-T086 — Establish Canonical Spacing Scale

Define the permitted spacing system.

**Priority:** P0

---

## P01-T087 — Establish Component Internal Padding Rules

Standardize control and container padding.

**Priority:** P0

---

## P01-T088 — Establish Section Spacing Rules

Create consistent separation between major page regions.

**Priority:** P0

---

## P01-T089 — Establish Content Element Spacing Rules

Standardize paragraph, list, code and heading rhythm.

**Priority:** P0

---

## P01-T090 — Establish Page Edge Padding

Create consistent responsive horizontal gutters.

**Priority:** P0

---

## P01-T091 — Remove Arbitrary Margin Proliferation

Replace repeated one-off spacing fixes.

**Priority:** P1

---

## P01-T092 — Remove Arbitrary Padding Proliferation

Migrate reusable patterns to shared primitives.

**Priority:** P1

---

## P01-T093 — Reduce Excessive Vertical Compression

Increase breathing room where content currently feels crowded.

**Priority:** P0

---

## P01-T094 — Reduce Excessive Decorative Whitespace

Avoid oversized empty sections that harm information flow.

**Priority:** P2

---

## P01-T095 — Define Compact Density Mode for Data-Heavy UI

Allow legitimately dense application surfaces without affecting reading pages.

**Priority:** P2

---

# Workstream I — Surface, Border, Radius & Depth Architecture

## P01-T096 — Define When a Surface Is Necessary

Establish rules for when content should actually be placed inside a card or panel.

**Priority:** P0

---

## P01-T097 — Define Flat Section Pattern

Support grouping without boxes.

**Priority:** P0

---

## P01-T098 — Define Bordered Section Pattern

Use boundaries only where structural separation is useful.

**Priority:** P1

---

## P01-T099 — Define Elevated Surface Pattern

Reserve elevation for appropriate interactive or floating UI.

**Priority:** P1

---

## P01-T100 — Establish Border Width Rules

Prevent inconsistent boundary weights.

**Priority:** P2

---

## P01-T101 — Establish Radius Scale

Create a restrained radius system.

**Priority:** P1

---

## P01-T102 — Remove Excessive Rounded-Rectangle Styling

Reduce the “everything is a pill/card” appearance.

**Priority:** P0

---

## P01-T103 — Establish Shadow Scale

Define minimal elevation levels.

**Priority:** P1

---

## P01-T104 — Remove Decorative Shadow Overuse

Reduce visual heaviness.

**Priority:** P1

---

## P01-T105 — Remove Nested Surface Anti-Patterns

Prevent card-inside-card-inside-card layouts.

**Priority:** P0

---

# Workstream J — Layout Primitives

## P01-T106 — Build Canonical Page Container

Create the default V2 horizontal page boundary.

**Priority:** P0

---

## P01-T107 — Build Canonical Reading Container

Create the long-form content boundary.

**Priority:** P0

---

## P01-T108 — Build Canonical Wide Container

Support complex layouts and wide content.

**Priority:** P0

---

## P01-T109 — Build Canonical Section Component

Standardize vertical page grouping.

**Priority:** P1

---

## P01-T110 — Build Canonical Stack Layout Primitive

Standardize vertical spacing composition.

**Priority:** P1

---

## P01-T111 — Build Canonical Inline Layout Primitive

Standardize horizontal control grouping.

**Priority:** P2

---

## P01-T112 — Build Canonical Grid Primitive

Standardize responsive card and feature grids.

**Priority:** P1

---

## P01-T113 — Build Canonical Split Layout

Support main-content and secondary-content structures.

**Priority:** P0

---

## P01-T114 — Build Canonical Sidebar Layout

Support content navigation without forcing every page into a sidebar.

**Priority:** P0

---

## P01-T115 — Build Canonical Sticky Region Primitive

Standardize sticky behavior and offsets.

**Priority:** P1

---

## P01-T116 — Build Canonical Full-Width Breakout

Allow wide code, diagrams or tables inside constrained reading layouts.

**Priority:** P1

---

## P01-T117 — Build Canonical Responsive Visibility Utilities

Avoid duplicate breakpoint logic.

**Priority:** P1

---

## P01-T118 — Remove Duplicate Container Components

Migrate overlapping container implementations.

**Priority:** P0

---

# Workstream K — Button & Action System

## P01-T119 — Rebuild Canonical Button Component

Create the permanent V2 button primitive.

**Priority:** P0

---

## P01-T120 — Implement Primary Button Variant

Use only for primary page actions.

**Priority:** P0

---

## P01-T121 — Implement Secondary Button Variant

Support lower-priority actions.

**Priority:** P1

---

## P01-T122 — Implement Ghost Button Variant

Support low-emphasis actions.

**Priority:** P1

---

## P01-T123 — Implement Destructive Button Variant

Standardize destructive operations.

**Priority:** P1

---

## P01-T124 — Implement Icon Button Variant

Standardize compact icon actions.

**Priority:** P1

---

## P01-T125 — Implement Button Loading State

Prevent duplicate submissions and unclear waiting states.

**Priority:** P1

---

## P01-T126 — Implement Button Disabled State

Ensure accessible disabled behavior.

**Priority:** P1

---

## P01-T127 — Standardize Button Sizes

Remove arbitrary button dimensions.

**Priority:** P1

---

## P01-T128 — Standardize Icon Alignment in Buttons

Fix inconsistent icon/text positioning.

**Priority:** P2

---

## P01-T129 — Consolidate Duplicate Button Components

Migrate shared consumers where safe.

**Priority:** P0

---

## P01-T130 — Remove Legacy Button Implementations

Delete confirmed obsolete versions after migration.

**Priority:** P1

---

# Workstream L — Card, Panel & Section System

## P01-T131 — Rebuild Canonical Card Component

Create a restrained general-purpose card.

**Priority:** P0

---

## P01-T132 — Implement Interactive Card Variant

Provide clear but subtle interaction behavior.

**Priority:** P1

---

## P01-T133 — Implement Static Information Card Variant

Avoid hover effects on noninteractive content.

**Priority:** P1

---

## P01-T134 — Implement Minimal Card Variant

Support grouping with minimal visual chrome.

**Priority:** P1

---

## P01-T135 — Implement Panel Component

Separate application panels from generic cards.

**Priority:** P1

---

## P01-T136 — Implement Section Header Pattern

Standardize title, description and optional actions.

**Priority:** P1

---

## P01-T137 — Remove Card Hover Effects from Noninteractive Content

Eliminate misleading interaction cues.

**Priority:** P0

---

## P01-T138 — Remove Universal Scale-on-Hover Behavior

Avoid unnecessary motion and layout instability.

**Priority:** P0

---

## P01-T139 — Reduce Card Usage in Reading Flows

Prefer typography and spacing for content hierarchy.

**Priority:** P0

---

## P01-T140 — Consolidate Duplicate Card Components

Migrate shared implementations.

**Priority:** P0

---

# Workstream M — Badge, Tag & Metadata System

## P01-T141 — Rebuild Canonical Badge Component

Create restrained semantic badges.

**Priority:** P1

---

## P01-T142 — Implement Difficulty Badge Variants

Standardize difficulty presentation.

**Priority:** P1

---

## P01-T143 — Implement Status Badge Variants

Support actual status semantics.

**Priority:** P2

---

## P01-T144 — Implement Neutral Metadata Badge

Support low-emphasis metadata where a badge is genuinely needed.

**Priority:** P2

---

## P01-T145 — Build Tag Component

Separate content tags from status badges.

**Priority:** P1

---

## P01-T146 — Reduce Excessive Badge Usage

Replace decorative badges with plain metadata text where appropriate.

**Priority:** P0

---

## P01-T147 — Prevent Badge Colour Proliferation

Restrict arbitrary category colours.

**Priority:** P1

---

## P01-T148 — Consolidate Duplicate Badge Components

Migrate shared consumers.

**Priority:** P1

---

# Workstream N — Form & Input System

## P01-T149 — Rebuild Canonical Input Component

Standardize text input behavior.

**Priority:** P0

---

## P01-T150 — Rebuild Canonical Textarea Component

Support longer input consistently.

**Priority:** P1

---

## P01-T151 — Rebuild Canonical Select Component

Standardize selection controls.

**Priority:** P1

---

## P01-T152 — Rebuild Canonical Checkbox Component

Ensure clear states and accessibility.

**Priority:** P1

---

## P01-T153 — Rebuild Canonical Radio Component

Standardize exclusive selection.

**Priority:** P2

---

## P01-T154 — Implement Form Label Component

Create consistent accessible labels.

**Priority:** P1

---

## P01-T155 — Implement Form Description Component

Support contextual help.

**Priority:** P2

---

## P01-T156 — Implement Field Error Component

Standardize validation messages.

**Priority:** P1

---

## P01-T157 — Implement Input Icon Pattern

Support search and contextual inputs.

**Priority:** P1

---

## P01-T158 — Standardize Input Heights

Remove arbitrary control dimensions.

**Priority:** P1

---

## P01-T159 — Standardize Form Focus States

Create consistent keyboard visibility.

**Priority:** P0

---

## P01-T160 — Consolidate Duplicate Form Components

Migrate reusable implementations.

**Priority:** P1

---

# Workstream O — Search Input Foundation

## P01-T161 — Build Canonical Search Input

Create the shared visual search primitive.

**Priority:** P0

---

## P01-T162 — Implement Search Icon Treatment

Standardize icon placement.

**Priority:** P2

---

## P01-T163 — Implement Search Clear Action

Support quick query reset.

**Priority:** P1

---

## P01-T164 — Implement Search Loading State

Communicate active search behavior.

**Priority:** P1

---

## P01-T165 — Implement Search Empty Input State

Create clear placeholder behavior.

**Priority:** P2

---

## P01-T166 — Implement Search Keyboard Shortcut Hint

Support desktop discoverability without clutter.

**Priority:** P2

---

## P01-T167 — Ensure Search Input Mobile Usability

Provide appropriate touch targets and sizing.

**Priority:** P0

---

# Workstream P — Navigation Primitives

## P01-T168 — Build Canonical Navigation Link

Standardize navigation states.

**Priority:** P0

---

## P01-T169 — Implement Active Navigation State

Make current location clear without excessive colour.

**Priority:** P0

---

## P01-T170 — Implement Nested Navigation Item

Support content hierarchy.

**Priority:** P1

---

## P01-T171 — Implement Navigation Group

Standardize grouped links.

**Priority:** P1

---

## P01-T172 — Build Canonical Breadcrumb Component

Create accessible visual breadcrumb presentation.

**Priority:** P0

---

## P01-T173 — Build Canonical Pagination Component

Standardize multi-page navigation where required.

**Priority:** P1

---

## P01-T174 — Build Canonical Previous/Next Navigation Primitive

Support sequential learning flows.

**Priority:** P1

---

## P01-T175 — Build Canonical Tab Navigation

Support local content switching without misuse as global navigation.

**Priority:** P1

---

## P01-T176 — Build Canonical Accordion Navigation

Support progressive disclosure.

**Priority:** P1

---

## P01-T177 — Build Canonical Tree Navigation Primitives

Prepare for later content-tree consolidation.

**Priority:** P0

---

# Workstream Q — Overlay & Floating UI

## P01-T178 — Rebuild Canonical Dialog

Standardize modal behavior.

**Priority:** P1

---

## P01-T179 — Rebuild Canonical Drawer

Support mobile and contextual panels.

**Priority:** P0

---

## P01-T180 — Rebuild Canonical Dropdown Menu

Standardize contextual actions.

**Priority:** P1

---

## P01-T181 — Rebuild Canonical Popover

Support lightweight contextual content.

**Priority:** P2

---

## P01-T182 — Rebuild Canonical Tooltip

Use tooltips only for genuinely unclear icon actions.

**Priority:** P2

---

## P01-T183 — Standardize Overlay Backdrop

Create consistent visual hierarchy.

**Priority:** P1

---

## P01-T184 — Standardize Overlay Z-Index Architecture

Prevent stacking conflicts.

**Priority:** P0

---

## P01-T185 — Standardize Overlay Focus Management

Ensure accessible keyboard behavior.

**Priority:** P0

---

## P01-T186 — Standardize Overlay Mobile Behavior

Prevent unusable desktop-style modals on small screens.

**Priority:** P1

---

# Workstream R — Loading, Empty, Error & Feedback States

## P01-T187 — Build Canonical Skeleton Primitive

Create reusable loading placeholders.

**Priority:** P1

---

## P01-T188 — Build Text Skeleton Pattern

Support reading-content loading.

**Priority:** P1

---

## P01-T189 — Build Card Skeleton Pattern

Support structured content loading.

**Priority:** P2

---

## P01-T190 — Build List Skeleton Pattern

Support search and question-list loading.

**Priority:** P1

---

## P01-T191 — Build Canonical Spinner

Reserve spinner use for appropriate compact actions.

**Priority:** P2

---

## P01-T192 — Replace Plain Loading Text in Shared Experiences

Use context-appropriate loading feedback.

**Priority:** P1

---

## P01-T193 — Build Canonical Empty State

Create clear recovery-oriented empty states.

**Priority:** P1

---

## P01-T194 — Build Canonical Error State

Create understandable error recovery.

**Priority:** P0

---

## P01-T195 — Build Inline Error Pattern

Support component-level failures.

**Priority:** P1

---

## P01-T196 — Build Success Feedback Pattern

Provide restrained confirmation.

**Priority:** P2

---

## P01-T197 — Standardize Toast Notifications

Use transient feedback consistently.

**Priority:** P2

---

## P01-T198 — Prevent Toast Overuse

Keep persistent information in the interface when appropriate.

**Priority:** P2

---

# Workstream S — Educational Content Components

## P01-T199 — Build Canonical Prose Component

Create the root long-form content renderer styling contract.

**Priority:** P0

---

## P01-T200 — Build Canonical Code Block Shell

Prepare reusable code presentation.

**Priority:** P0

---

## P01-T201 — Build Canonical Code Header

Support language labels and actions.

**Priority:** P1

---

## P01-T202 — Build Canonical Copy-Code Action

Provide consistent copy feedback.

**Priority:** P1

---

## P01-T203 — Build Canonical Inline Code Style

Standardize technical references.

**Priority:** P0

---

## P01-T204 — Build Canonical Callout Component

Create the base semantic callout.

**Priority:** P0

---

## P01-T205 — Implement Note Callout

Support neutral supplementary information.

**Priority:** P1

---

## P01-T206 — Implement Tip Callout

Support useful guidance without excessive colour.

**Priority:** P1

---

## P01-T207 — Implement Warning Callout

Reserve warning emphasis for meaningful caution.

**Priority:** P1

---

## P01-T208 — Implement Example Block

Create consistent worked-example presentation.

**Priority:** P0

---

## P01-T209 — Implement Key Takeaway Block

Support concise summary emphasis.

**Priority:** P1

---

## P01-T210 — Build Canonical Table Wrapper

Support responsive technical tables.

**Priority:** P0

---

## P01-T211 — Implement Table Overflow Behavior

Prevent mobile page overflow.

**Priority:** P0

---

## P01-T212 — Implement Table Header Styling

Improve scanability.

**Priority:** P1

---

## P01-T213 — Implement Table Row Styling

Avoid excessive striping and visual noise.

**Priority:** P2

---

## P01-T214 — Build Canonical Diagram Container

Support diagrams without forcing card styling.

**Priority:** P1

---

## P01-T215 — Build Canonical Media Container

Standardize images and visual content.

**Priority:** P2

---

## P01-T216 — Build Canonical Content Caption

Support diagrams, tables and media.

**Priority:** P2

---

# Workstream T — Responsive Foundation

## P01-T217 — Establish Canonical Breakpoint Strategy

Standardize responsive behavior.

**Priority:** P0

---

## P01-T218 — Establish Mobile-First Layout Rules

Avoid desktop layouts patched down for phones.

**Priority:** P0

---

## P01-T219 — Establish Responsive Page Gutters

Standardize horizontal spacing.

**Priority:** P0

---

## P01-T220 — Establish Responsive Typography Behavior

Prevent oversized headings and cramped body text.

**Priority:** P0

---

## P01-T221 — Establish Responsive Grid Rules

Create predictable grid collapse behavior.

**Priority:** P1

---

## P01-T222 — Establish Responsive Sidebar Rules

Define when sidebars remain, collapse or move.

**Priority:** P0

---

## P01-T223 — Establish Responsive Navigation Rules

Prepare consistent global and content navigation behavior.

**Priority:** P0

---

## P01-T224 — Establish Responsive Table Rules

Prevent unusable data presentation.

**Priority:** P0

---

## P01-T225 — Establish Responsive Code Block Rules

Prevent code from breaking the viewport.

**Priority:** P0

---

## P01-T226 — Establish Responsive Dialog and Drawer Rules

Use appropriate interaction patterns by viewport.

**Priority:** P1

---

## P01-T227 — Establish Touch Target Minimums

Improve mobile usability.

**Priority:** P0

---

## P01-T228 — Remove Shared Fixed-Width Mobile Breakage

Fix reusable components that assume desktop width.

**Priority:** P0

---

# Workstream U — Accessibility Foundation

## P01-T229 — Establish Focus-Visible System

Create consistent keyboard focus indicators.

**Priority:** P0

---

## P01-T230 — Remove Focus Outline Suppression

Eliminate inaccessible focus removal.

**Priority:** P0

---

## P01-T231 — Establish Semantic Heading Rules

Prevent visual heading styles from breaking document structure.

**Priority:** P0

---

## P01-T232 — Establish Accessible Icon Button Rules

Require accessible names.

**Priority:** P0

---

## P01-T233 — Establish Form Accessibility Rules

Standardize labels, descriptions and errors.

**Priority:** P0

---

## P01-T234 — Establish Navigation Accessibility Rules

Support semantic and keyboard navigation.

**Priority:** P0

---

## P01-T235 — Establish Overlay Accessibility Rules

Standardize focus trapping and restoration.

**Priority:** P0

---

## P01-T236 — Establish Reduced Motion Support

Respect user preferences.

**Priority:** P1

---

## P01-T237 — Establish Screen Reader Utility Patterns

Support visually hidden accessible content.

**Priority:** P1

---

## P01-T238 — Establish Minimum Contrast Requirements

Apply them to canonical tokens and components.

**Priority:** P0

---

# Workstream V — Motion & Interaction Foundation

## P01-T239 — Define Motion Principles

Use motion to explain state changes rather than decorate everything.

**Priority:** P1

---

## P01-T240 — Standardize Transition Durations

Remove inconsistent animation timing.

**Priority:** P2

---

## P01-T241 — Standardize Transition Easing

Create consistent interaction feel.

**Priority:** P2

---

## P01-T242 — Remove Universal Transition-All Usage Where Harmful

Avoid unnecessary property animation.

**Priority:** P1

---

## P01-T243 — Remove Unnecessary Hover Scaling

Reduce visual instability.

**Priority:** P0

---

## P01-T244 — Standardize Hover Feedback

Use restrained colour, border or background changes.

**Priority:** P1

---

## P01-T245 — Standardize Pressed and Active Feedback

Improve control responsiveness.

**Priority:** P2

---

## P01-T246 — Implement Reduced-Motion Alternatives

Ensure essential interaction remains understandable.

**Priority:** P1

---

# Workstream W — Icon Architecture

## P01-T247 — Establish Canonical Icon Library

Use one primary icon system.

**Priority:** P1

---

## P01-T248 — Standardize Icon Sizes

Create predictable sizing roles.

**Priority:** P2

---

## P01-T249 — Standardize Icon Stroke Treatment

Avoid inconsistent visual weight.

**Priority:** P2

---

## P01-T250 — Remove Decorative Icon Overuse

Use icons only where they improve comprehension.

**Priority:** P1

---

## P01-T251 — Remove Mixed Icon Libraries Where Unnecessary

Reduce inconsistency and bundle duplication.

**Priority:** P1

---

## P01-T252 — Standardize Icon and Text Spacing

Improve control alignment.

**Priority:** P2

---

# Workstream X — Theme Infrastructure

## P01-T253 — Consolidate Theme Provider Architecture

Ensure one canonical theme system.

**Priority:** P0

---

## P01-T254 — Implement System Theme Support

Respect operating-system preference.

**Priority:** P1

---

## P01-T255 — Prevent Theme Flash

Reduce incorrect-theme rendering during load.

**Priority:** P0

---

## P01-T256 — Standardize Theme Persistence

Ensure predictable user preference behavior.

**Priority:** P1

---

## P01-T257 — Remove Component-Level Theme Hacks

Migrate components to semantic tokens.

**Priority:** P0

---

## P01-T258 — Remove Duplicate Theme Detection Logic

Use one canonical mechanism.

**Priority:** P1

---

## P01-T259 — Validate Native Control Theme Behavior

Ensure browser-native elements align with the selected theme.

**Priority:** P2

---

# Workstream Y — Legacy UI Consolidation

## P01-T260 — Build Legacy Component Replacement Map

Map every major legacy shared component to its V2 replacement.

**Priority:** P0

---

## P01-T261 — Consolidate Duplicate Button Systems

Choose and migrate toward one canonical implementation.

**Priority:** P0

---

## P01-T262 — Consolidate Duplicate Card Systems

Reduce parallel card architectures.

**Priority:** P0

---

## P01-T263 — Consolidate Duplicate Badge Systems

Remove unnecessary variants and implementations.

**Priority:** P1

---

## P01-T264 — Consolidate Duplicate Input Systems

Create one shared form foundation.

**Priority:** P1

---

## P01-T265 — Consolidate Duplicate Dialog Systems

Standardize overlay behavior.

**Priority:** P1

---

## P01-T266 — Consolidate Duplicate Drawer Systems

Prepare for mobile navigation migration.

**Priority:** P1

---

## P01-T267 — Consolidate Duplicate Breadcrumb Systems

Prepare for unified UX and SEO hierarchy.

**Priority:** P0

---

## P01-T268 — Consolidate Duplicate Loading Systems

Create consistent feedback.

**Priority:** P1

---

## P01-T269 — Consolidate Duplicate Empty-State Systems

Remove route-specific reinvention.

**Priority:** P2

---

## P01-T270 — Consolidate Duplicate Error-State Systems

Standardize recovery patterns.

**Priority:** P1

---

## P01-T271 — Consolidate Duplicate Code Block Shells

Prepare for question-page migration.

**Priority:** P0

---

## P01-T272 — Consolidate Duplicate Content Callouts

Create one educational component family.

**Priority:** P1

---

## P01-T273 — Remove Confirmed Dead Shared UI Components

Delete only after usage verification.

**Priority:** P1

---

## P01-T274 — Prevent Legacy Component Reintroduction

Document replacement rules for active development.

**Priority:** P1

---

# Workstream Z — Repository-Wide Root Style Migration

## P01-T275 — Replace Shared Hard-Coded Background Colors

Migrate common shared components to semantic tokens.

**Priority:** P0

---

## P01-T276 — Replace Shared Hard-Coded Text Colors

Migrate common shared components to semantic hierarchy.

**Priority:** P0

---

## P01-T277 — Replace Shared Hard-Coded Border Colors

Use canonical border tokens.

**Priority:** P0

---

## P01-T278 — Replace Shared Arbitrary Border Radii

Use the canonical radius scale.

**Priority:** P1

---

## P01-T279 — Replace Shared Arbitrary Shadows

Use canonical elevation roles.

**Priority:** P1

---

## P01-T280 — Replace Shared Arbitrary Width Constraints

Use canonical containers.

**Priority:** P0

---

## P01-T281 — Replace Shared Arbitrary Spacing Patterns

Use the canonical spacing system.

**Priority:** P0

---

## P01-T282 — Replace Shared Arbitrary Typography

Use canonical text roles.

**Priority:** P0

---

## P01-T283 — Replace Shared Arbitrary Hover Effects

Use canonical interaction behavior.

**Priority:** P1

---

## P01-T284 — Replace Shared Arbitrary Focus States

Use the global focus system.

**Priority:** P0

---

## P01-T285 — Remove Shared Nested-Card Patterns

Flatten reusable composition where possible.

**Priority:** P0

---

## P01-T286 — Remove Shared Decorative Gradient Overuse

Reserve gradients for intentional brand or hero use.

**Priority:** P1

---

## P01-T287 — Remove Shared Excessive Border Usage

Use whitespace and hierarchy where possible.

**Priority:** P0

---

## P01-T288 — Remove Shared Excessive Badge Usage

Reduce visual fragmentation.

**Priority:** P0

---

## P01-T289 — Remove Shared Excessive Icon Usage

Improve visual calm.

**Priority:** P1

---

## P01-T290 — Remove Shared Unnecessary Motion

Reduce distraction.

**Priority:** P1

---

# Workstream AA — V2 UI Development & Review Surfaces

## P01-T291 — Create V2 Primitive Review Surface

Render canonical primitives together for rapid comparison.

**Priority:** P1

---

## P01-T292 — Create Typography Review Surface

Review headings, body text, lists and code.

**Priority:** P1

---

## P01-T293 — Create Color and Surface Review Surface

Review semantic hierarchy in both themes.

**Priority:** P1

---

## P01-T294 — Create Form Component Review Surface

Validate all states consistently.

**Priority:** P2

---

## P01-T295 — Create Educational Content Review Surface

Test prose, code, callouts, tables and diagrams.

**Priority:** P0

---

## P01-T296 — Create Density Stress-Test Surface

Test highly populated content without reverting to visual clutter.

**Priority:** P0

---

## P01-T297 — Create Long-Reading Stress-Test Surface

Test sustained reading in light and dark themes.

**Priority:** P0

---

## P01-T298 — Create Mobile Component Stress-Test Surface

Test narrow viewport behavior.

**Priority:** P0

---

## P01-T299 — Create Wide Desktop Stress-Test Surface

Ensure layouts do not become excessively stretched.

**Priority:** P1

---

# Workstream AB — Root UI Performance

## P01-T300 — Audit Design-System Bundle Cost

Prevent the V2 component foundation from introducing excessive JavaScript.

**Priority:** P1

---

## P01-T301 — Minimize Client-Only UI Primitives

Keep static visual components server-compatible where possible.

**Priority:** P0

---

## P01-T302 — Avoid Unnecessary Runtime Styling

Prefer predictable build-time styling where appropriate.

**Priority:** P1

---

## P01-T303 — Reduce Duplicate Icon Bundle Cost

Consolidate icon usage.

**Priority:** P2

---

## P01-T304 — Reduce Duplicate Component Dependencies

Avoid multiple libraries solving the same UI problem.

**Priority:** P1

---

## P01-T305 — Optimize Font Loading

Avoid unnecessary weights and files.

**Priority:** P0

---

## P01-T306 — Prevent Layout Shift from UI Foundation

Stabilize font and component sizing.

**Priority:** P0

---

# Workstream AC — Root UI Integration Protection

## P01-T307 — Add Canonical Component Unit Coverage Where Valuable

Protect complex shared behavior without testing trivial CSS implementation.

**Priority:** P2

---

## P01-T308 — Add Interaction Coverage for Critical Primitives

Protect dialogs, drawers, menus and form interactions.

**Priority:** P1

---

## P01-T309 — Add Accessibility Checks for Canonical Components

Catch shared accessibility regressions early.

**Priority:** P0

---

## P01-T310 — Add Theme Regression Coverage for Critical Components

Protect semantic token usage.

**Priority:** P1

---

## P01-T311 — Add Responsive Regression Coverage for High-Risk Primitives

Protect shared navigation and overflow-sensitive components.

**Priority:** P1

---

## P01-T312 — Add Legacy Import Detection Where Practical

Detect reintroduction of deprecated components.

**Priority:** P2

---

# Workstream AD — Phase 01 Integration & Completion

## P01-T313 — Migrate One Representative Simple Page to Root V2 System

Verify the design foundation in a realistic page.

**Priority:** P0

---

## P01-T314 — Migrate One Representative Dense Page to Root V2 System

Test whether the new system genuinely solves density.

**Priority:** P0

---

## P01-T315 — Migrate One Representative Long-Reading Page to Root V2 System

Test typography and reading width.

**Priority:** P0

---

## P01-T316 — Migrate One Representative Code-Heavy Surface

Test technical content primitives.

**Priority:** P0

---

## P01-T317 — Compare V1 and V2 Density

Verify that V2 reduces unnecessary visual competition.

**Priority:** P0

---

## P01-T318 — Compare V1 and V2 Reading Comfort

Verify improvements in typography, width and spacing.

**Priority:** P0

---

## P01-T319 — Resolve Root-Level UI Defects Found During Representative Migration

Fix the system rather than patching representative pages locally.

**Priority:** P0

---

## P01-T320 — Freeze Canonical V2 Design Tokens

Prevent uncontrolled token changes during mass migration.

**Priority:** P0

---

## P01-T321 — Freeze Canonical V2 Primitive APIs

Stabilize shared component interfaces before broad adoption.

**Priority:** P0

---

## P01-T322 — Publish Legacy-to-V2 Component Mapping

Give later phases an explicit migration path.

**Priority:** P0

---

## P01-T323 — Update V2 Technical Implementation Plan

Record the actual implemented UI architecture.

**Priority:** P1

---

## P01-T324 — Update V2 Decision Log

Record important UI architecture decisions.

**Priority:** P1

---

## P01-T325 — Update V2 Issue Log

Record unresolved UI issues that belong to later route-specific phases.

**Priority:** P1

---

## P01-T326 — Produce Phase 01 Completion Report

Document:

* implemented root systems,
* migrated primitives,
* removed legacy systems,
* remaining route-specific work,
* known risks.

**Priority:** P0

---

## P01-T327 — Approve Phase 01 Foundation for Mass Page Migration

Confirm that later phases can build on the canonical V2 system rather than creating new visual architectures.

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
