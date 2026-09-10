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

**Priority:** P0

---

## P03-T002 — Define Public and Private Shell Boundaries

Separate:

* public SEO pages,
* authentication pages,
* dashboard,
* practice application,
* future interview application surfaces.

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

**Priority:** P0

---

## P03-T004 — Prevent Route Pages from Rebuilding Global Shell Elements

Pages should consume the canonical shell rather than recreate navigation.

**Priority:** P0

---

## P03-T005 — Establish Nested Layout Strategy

Use route layouts intentionally without unnecessary duplication.

**Priority:** P0

---

## P03-T006 — Establish Shell Composition Contracts

Define the supported composition patterns.

**Priority:** P1

---

## P03-T007 — Establish Shell Variant Strategy

Support legitimate differences between:

* public content,
* marketing,
* application,
* authentication.

**Priority:** P1

---

## P03-T008 — Prevent Unlimited Shell Variants

Avoid route-by-route shell divergence.

**Priority:** P0

---

## P03-T009 — Define Global Shell Server/Client Boundaries

Keep the shell server-compatible wherever possible.

**Priority:** P0

---

## P03-T010 — Document Canonical Shell Architecture

Record the final hierarchy for later route migrations.

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

**Priority:** P0

---

## P03-T012 — Simplify Root Layout

Keep only genuinely global responsibilities.

**Priority:** P0

---

## P03-T013 — Remove Route-Specific UI from Root Layout

Prevent unnecessary global rendering.

**Priority:** P0

---

## P03-T014 — Consolidate Global Providers

Remove duplicate provider nesting.

**Priority:** P0

---

## P03-T015 — Order Global Providers Correctly

Ensure provider dependencies are explicit.

**Priority:** P1

---

## P03-T016 — Remove Obsolete Global Providers

Delete confirmed unused infrastructure.

**Priority:** P1

---

## P03-T017 — Minimize Client Boundaries in Root Layout

Avoid making the entire application client-rendered.

**Priority:** P0

---

## P03-T018 — Integrate Canonical Font Architecture

Use the Phase 01 typography system.

**Priority:** P0

---

## P03-T019 — Integrate Canonical Theme Architecture

Use one theme provider.

**Priority:** P0

---

## P03-T020 — Integrate Canonical Metadata Base

Use the Phase 02 SEO architecture.

**Priority:** P0

---

## P03-T021 — Establish Root Body Styling

Apply canonical:

* background,
* text,
* font,
* minimum height.

**Priority:** P0

---

## P03-T022 — Prevent Global Horizontal Overflow

Fix root-level overflow causes.

**Priority:** P0

---

## P03-T023 — Establish Root Focus Behavior

Support keyboard navigation.

**Priority:** P0

---

## P03-T024 — Establish Root Skip Navigation Support

Allow users to bypass repeated navigation.

**Priority:** P0

---

## P03-T025 — Establish Main Content Landmark

Ensure semantic page structure.

**Priority:** P0

---

# Workstream C — Public Shell Rebuild

## P03-T026 — Build Canonical Public Shell

Create the shared shell for public content routes.

**Priority:** P0

---

## P03-T027 — Define Public Shell Width Behavior

Separate shell width from reading-content width.

**Priority:** P0

---

## P03-T028 — Define Public Shell Vertical Structure

Establish predictable header, content and footer flow.

**Priority:** P0

---

## P03-T029 — Prevent Public Shell from Forcing Card Layouts

Allow page content to remain structurally flexible.

**Priority:** P0

---

## P03-T030 — Prevent Public Shell from Adding Excessive Background Layers

Keep the global visual hierarchy calm.

**Priority:** P0

---

## P03-T031 — Support Full-Width Page Sections Where Required

Allow controlled breakouts.

**Priority:** P1

---

## P03-T032 — Support Reading-Focused Routes

Provide minimal surrounding distraction.

**Priority:** P0

---

## P03-T033 — Support Hub-Focused Routes

Allow wider discovery layouts.

**Priority:** P0

---

## P03-T034 — Support Contextual Sidebar Routes

Provide consistent sidebar integration.

**Priority:** P0

---

## P03-T035 — Support Routes Without Sidebars

Do not force sidebars onto every page.

**Priority:** P0

---

## P03-T036 — Establish Public Shell Responsive Behavior

Define desktop, tablet and mobile behavior.

**Priority:** P0

---

# Workstream D — Global Header Architecture

## P03-T037 — Rebuild Canonical Global Header

Create one permanent public header.

**Priority:** P0

---

## P03-T038 — Define Header Information Hierarchy

Prioritize:

1. brand,
2. primary navigation,
3. search,
4. user actions.

**Priority:** P0

---

## P03-T039 — Reduce Header Visual Density

Remove unnecessary controls and competing elements.

**Priority:** P0

---

## P03-T040 — Establish Header Height

Use a stable and restrained global dimension.

**Priority:** P0

---

## P03-T041 — Establish Header Background Behavior

Ensure readability without excessive visual weight.

**Priority:** P1

---

## P03-T042 — Establish Header Border Behavior

Use subtle separation only when necessary.

**Priority:** P1

---

## P03-T043 — Establish Header Sticky Behavior

Use sticky positioning intentionally.

**Priority:** P0

---

## P03-T044 — Prevent Sticky Header Content Obstruction

Account for anchor links and scroll positioning.

**Priority:** P0

---

## P03-T045 — Prevent Header Layout Shift

Reserve stable dimensions.

**Priority:** P0

---

## P03-T046 — Keep Header Server-Compatible Where Possible

Isolate only interactive controls.

**Priority:** P0

---

## P03-T047 — Remove Duplicate Header Implementations

Migrate route families toward one canonical header.

**Priority:** P0

---

## P03-T048 — Remove Legacy Header Variants

Delete obsolete implementations after migration.

**Priority:** P1

---

# Workstream E — Brand & Logo Treatment

## P03-T049 — Standardize Global Brand Mark

Use one canonical visual implementation.

**Priority:** P1

---

## P03-T050 — Standardize Brand Wordmark

Ensure consistent typography and spacing.

**Priority:** P1

---

## P03-T051 — Standardize Header Logo Dimensions

Prevent layout instability.

**Priority:** P1

---

## P03-T052 — Ensure Brand Link Targets Canonical Homepage

**Priority:** P0

---

## P03-T053 — Ensure Brand Mark Works in Light Theme

**Priority:** P1

---

## P03-T054 — Ensure Brand Mark Works in Dark Theme

**Priority:** P1

---

## P03-T055 — Prevent Oversized Brand Presence

Keep navigation content-focused.

**Priority:** P1

---

## P03-T056 — Remove Duplicate Logo Assets Where Obsolete

**Priority:** P2

---

# Workstream F — Desktop Primary Navigation

## P03-T057 — Define Canonical Primary Navigation Taxonomy

Choose only major user destinations.

**Priority:** P0

---

## P03-T058 — Reduce Top-Level Navigation Overload

Avoid exposing the entire site hierarchy in the header.

**Priority:** P0

---

## P03-T059 — Build Canonical Desktop Navigation

Use the Phase 01 navigation primitives.

**Priority:** P0

---

## P03-T060 — Implement Active Navigation State

Show the current section clearly.

**Priority:** P0

---

## P03-T061 — Implement Accessible Navigation Semantics

**Priority:** P0

---

## P03-T062 — Ensure Navigation Uses Canonical URLs

Use Phase 02 route generation.

**Priority:** P0

---

## P03-T063 — Prevent Navigation Links from Targeting Redirects

**Priority:** P0

---

## P03-T064 — Prevent JavaScript-Only Core Navigation

Use real crawlable links.

**Priority:** P0

---

## P03-T065 — Standardize Navigation Item Spacing

**Priority:** P1

---

## P03-T066 — Standardize Navigation Hover Behavior

Use restrained interaction feedback.

**Priority:** P1

---

## P03-T067 — Standardize Navigation Focus Behavior

**Priority:** P0

---

## P03-T068 — Prevent Excessive Icons in Primary Navigation

**Priority:** P1

---

## P03-T069 — Prevent Decorative Badges in Primary Navigation

**Priority:** P1

---

## P03-T070 — Remove Duplicate Desktop Navigation Components

**Priority:** P0

---

# Workstream G — Navigation Dropdowns & Mega Menus

## P03-T071 — Determine Whether Mega Navigation Is Actually Required

Do not implement complexity without a clear discovery benefit.

**Priority:** P0

---

## P03-T072 — Define Dropdown Navigation Use Cases

Use only for meaningful grouped navigation.

**Priority:** P1

---

## P03-T073 — Build Canonical Navigation Dropdown

**Priority:** P1

---

## P03-T074 — Build Canonical Navigation Group Structure

**Priority:** P1

---

## P03-T075 — Ensure Dropdown Links Are Crawlable

**Priority:** P0

---

## P03-T076 — Ensure Keyboard Navigation

**Priority:** P0

---

## P03-T077 — Ensure Escape-Key Closing

**Priority:** P1

---

## P03-T078 — Ensure Focus Restoration

**Priority:** P0

---

## P03-T079 — Prevent Hover-Only Accessibility

**Priority:** P0

---

## P03-T080 — Prevent Giant Link Dumps

Keep navigation curated.

**Priority:** P0

---

## P03-T081 — Ensure Dropdown Mobile Strategy Is Separate

Do not force desktop dropdown behavior onto mobile.

**Priority:** P0

---

# Workstream H — Mobile Navigation Rebuild

## P03-T082 — Rebuild Canonical Mobile Navigation

Create one coherent mobile navigation system.

**Priority:** P0

---

## P03-T083 — Define Mobile Navigation Entry Control

Use a clear accessible trigger.

**Priority:** P0

---

## P03-T084 — Build Mobile Navigation Drawer

Use the canonical drawer primitive.

**Priority:** P0

---

## P03-T085 — Define Mobile Navigation Hierarchy

Prioritize major destinations.

**Priority:** P0

---

## P03-T086 — Implement Nested Mobile Navigation

Support deeper sections without displaying everything simultaneously.

**Priority:** P1

---

## P03-T087 — Implement Mobile Navigation Active State

**Priority:** P0

---

## P03-T088 — Ensure Mobile Navigation Uses Canonical URLs

**Priority:** P0

---

## P03-T089 — Ensure Mobile Navigation Keyboard Accessibility

**Priority:** P0

---

## P03-T090 — Ensure Mobile Navigation Screen Reader Accessibility

**Priority:** P0

---

## P03-T091 — Prevent Background Scrolling While Drawer Is Open

**Priority:** P1

---

## P03-T092 — Restore Focus After Drawer Close

**Priority:** P0

---

## P03-T093 — Ensure Mobile Navigation Fits Short Viewports

**Priority:** P0

---

## P03-T094 — Ensure Mobile Navigation Is Scrollable Internally

**Priority:** P0

---

## P03-T095 — Prevent Oversized Mobile Navigation Controls

Maintain touch accessibility without wasting space.

**Priority:** P1

---

## P03-T096 — Remove Duplicate Mobile Navigation Systems

**Priority:** P0

---

# Workstream I — Bottom Navigation Decision

## P03-T097 — Evaluate Whether Bottom Navigation Belongs in Public Content

Do not add mobile-app patterns automatically.

**Priority:** P0

---

## P03-T098 — Separate Public Navigation from Authenticated App Navigation

A dashboard may justify bottom navigation where public reading pages do not.

**Priority:** P0

---

## P03-T099 — Prevent Duplicate Mobile Navigation Layers

Avoid drawer plus bottom bar plus floating actions competing simultaneously.

**Priority:** P0

---

## P03-T100 — Document Final Mobile Navigation Decision

**Priority:** P1

---

# Workstream J — Global Search Entry

## P03-T101 — Define Global Search Entry Strategy

Decide how users enter search from desktop and mobile.

**Priority:** P0

---

## P03-T102 — Integrate Canonical Search Input Foundation

Use Phase 01 components.

**Priority:** P0

---

## P03-T103 — Keep Header Search Visually Proportionate

Do not let search dominate every page.

**Priority:** P1

---

## P03-T104 — Implement Desktop Search Entry

**Priority:** P0

---

## P03-T105 — Implement Mobile Search Entry

**Priority:** P0

---

## P03-T106 — Implement Search Keyboard Shortcut

Where appropriate.

**Priority:** P2

---

## P03-T107 — Implement Accessible Search Labels

**Priority:** P0

---

## P03-T108 — Implement Search Clear Behavior

**Priority:** P1

---

## P03-T109 — Implement Search Loading Feedback

**Priority:** P1

---

## P03-T110 — Implement Search Error Feedback

**Priority:** P1

---

## P03-T111 — Ensure Search Results Use Canonical URLs

**Priority:** P0

---

## P03-T112 — Prevent Search Query URLs from Becoming Uncontrolled Indexable Pages

Use Phase 02 indexability rules.

**Priority:** P0

---

## P03-T113 — Remove Duplicate Search Entry Components

**Priority:** P0

---

# Workstream K — Header User Actions

## P03-T114 — Define Anonymous User Header Actions

Keep the action set minimal.

**Priority:** P0

---

## P03-T115 — Define Authenticated User Header Actions

Avoid overloading the header.

**Priority:** P0

---

## P03-T116 — Standardize Sign-In Entry

**Priority:** P1

---

## P03-T117 — Standardize Sign-Up Entry

**Priority:** P1

---

## P03-T118 — Standardize Dashboard Entry

**Priority:** P1

---

## P03-T119 — Standardize Profile Menu Entry

**Priority:** P1

---

## P03-T120 — Prevent Authentication State Layout Shift

Reserve predictable header space where possible.

**Priority:** P1

---

## P03-T121 — Prevent User State from Blocking Public Shell Rendering

**Priority:** P0

---

## P03-T122 — Handle Authentication Loading Gracefully

**Priority:** P1

---

## P03-T123 — Consolidate Duplicate User Menu Components

**Priority:** P1

---

# Workstream L — Theme Control Integration

## P03-T124 — Integrate Canonical Theme Control

Use Phase 01 theme infrastructure.

**Priority:** P0

---

## P03-T125 — Define Theme Control Placement

Avoid unnecessary duplication.

**Priority:** P1

---

## P03-T126 — Support Light Theme Selection

**Priority:** P0

---

## P03-T127 — Support Dark Theme Selection

**Priority:** P0

---

## P03-T128 — Support System Theme Selection Where Exposed

**Priority:** P1

---

## P03-T129 — Ensure Accessible Theme Control Labels

**Priority:** P0

---

## P03-T130 — Prevent Theme Flash During Shell Rendering

**Priority:** P0

---

## P03-T131 — Remove Duplicate Theme Toggles

**Priority:** P0

---

# Workstream M — Global Page Container Migration

## P03-T132 — Replace Legacy Global Width Containers

Use canonical Phase 01 containers.

**Priority:** P0

---

## P03-T133 — Establish Standard Public Page Width

**Priority:** P0

---

## P03-T134 — Establish Reading Page Width

**Priority:** P0

---

## P03-T135 — Establish Wide Hub Page Width

**Priority:** P0

---

## P03-T136 — Establish Application Page Width

**Priority:** P1

---

## P03-T137 — Standardize Responsive Page Gutters

**Priority:** P0

---

## P03-T138 — Remove Arbitrary Max-Width Definitions from Shared Layouts

**Priority:** P0

---

## P03-T139 — Remove Duplicate Container Components

**Priority:** P0

---

## P03-T140 — Prevent Nested Container Padding Duplication

**Priority:** P0

---

# Workstream N — Breadcrumb Integration

## P03-T141 — Integrate Canonical Breadcrumb Component

Use Phase 01 UI and Phase 02 hierarchy.

**Priority:** P0

---

## P03-T142 — Generate Breadcrumbs from Canonical Route Hierarchy

**Priority:** P0

---

## P03-T143 — Align Visual Breadcrumbs with Structured Data

**Priority:** P0

---

## P03-T144 — Use Canonical URLs in Breadcrumbs

**Priority:** P0

---

## P03-T145 — Define Breadcrumb Placement

Keep hierarchy visible but secondary.

**Priority:** P0

---

## P03-T146 — Define Breadcrumb Spacing

Prevent excessive vertical overhead.

**Priority:** P1

---

## P03-T147 — Define Mobile Breadcrumb Behavior

Avoid wrapping into large multi-line blocks.

**Priority:** P0

---

## P03-T148 — Handle Deep Hierarchies Gracefully

**Priority:** P1

---

## P03-T149 — Prevent Breadcrumb Duplication Across Nested Layouts

**Priority:** P0

---

## P03-T150 — Remove Legacy Breadcrumb Implementations

**Priority:** P0

---

# Workstream O — Global Sidebar Architecture

## P03-T151 — Define Sidebar Use Cases

Separate:

* content hierarchy sidebar,
* application navigation sidebar,
* contextual information sidebar.

**Priority:** P0

---

## P03-T152 — Prevent One Universal Sidebar from Serving Every Purpose

**Priority:** P0

---

## P03-T153 — Build Canonical Content Navigation Sidebar

**Priority:** P0

---

## P03-T154 — Build Canonical Application Sidebar Foundation

**Priority:** P1

---

## P03-T155 — Build Canonical Contextual Sidebar Foundation

**Priority:** P1

---

## P03-T156 — Define Sidebar Width Tokens

**Priority:** P1

---

## P03-T157 — Define Sidebar Sticky Behavior

**Priority:** P0

---

## P03-T158 — Define Sidebar Scroll Behavior

**Priority:** P0

---

## P03-T159 — Prevent Multiple Independent Page Scrollbars Where Possible

**Priority:** P0

---

## P03-T160 — Define Sidebar Collapse Behavior

**Priority:** P1

---

## P03-T161 — Define Mobile Sidebar Transformation

Convert to drawer, accordion or inline navigation based on context.

**Priority:** P0

---

## P03-T162 — Prevent Desktop Sidebar Assumptions on Mobile

**Priority:** P0

---

## P03-T163 — Standardize Sidebar Navigation Items

**Priority:** P0

---

## P03-T164 — Standardize Sidebar Active States

**Priority:** P0

---

## P03-T165 — Standardize Sidebar Nested Hierarchy

**Priority:** P0

---

## P03-T166 — Prevent Excessive Sidebar Colour

**Priority:** P0

---

## P03-T167 — Prevent Excessive Sidebar Borders

**Priority:** P1

---

## P03-T168 — Remove Duplicate Sidebar Components

**Priority:** P0

---

# Workstream P — Content Tree Navigation Foundation

## P03-T169 — Define Canonical Content Tree Data Contract

Represent:

* stack,
* pillar,
* module,
* question.

**Priority:** P0

---

## P03-T170 — Build Canonical Content Tree Renderer

**Priority:** P0

---

## P03-T171 — Implement Current Route Highlighting

**Priority:** P0

---

## P03-T172 — Implement Parent Expansion Behavior

**Priority:** P0

---

## P03-T173 — Implement Manual Expand and Collapse

**Priority:** P1

---

## P03-T174 — Implement Keyboard Navigation

**Priority:** P1

---

## P03-T175 — Implement Accessible Tree Semantics Where Appropriate

**Priority:** P1

---

## P03-T176 — Ensure Content Tree Links Use Canonical URLs

**Priority:** P0

---

## P03-T177 — Prevent Content Tree from Rendering Thousands of Items Unnecessarily

**Priority:** P0

---

## P03-T178 — Define Large Tree Performance Strategy

**Priority:** P1

---

## P03-T179 — Define Mobile Content Tree Strategy

**Priority:** P0

---

## P03-T180 — Consolidate Legacy Topic Tree Components

**Priority:** P0

---

# Workstream Q — Contextual Right Sidebar Foundation

## P03-T181 — Define Right Sidebar Eligibility

Only use when secondary information is genuinely useful.

**Priority:** P0

---

## P03-T182 — Prevent Mandatory Right Sidebar on Every Content Page

**Priority:** P0

---

## P03-T183 — Build Canonical Contextual Sidebar Container

**Priority:** P1

---

## P03-T184 — Support Table of Contents

**Priority:** P1

---

## P03-T185 — Support Question Metadata

**Priority:** P1

---

## P03-T186 — Support Related Content

**Priority:** P1

---

## P03-T187 — Support Progress Information Where Appropriate

**Priority:** P2

---

## P03-T188 — Define Sticky Behavior

**Priority:** P1

---

## P03-T189 — Define Collapse Behavior

**Priority:** P1

---

## P03-T190 — Define Mobile Repositioning

Move secondary information into logical content positions.

**Priority:** P0

---

## P03-T191 — Prevent Sidebar Content Duplication

**Priority:** P0

---

# Workstream R — Table of Contents Foundation

## P03-T192 — Build Canonical Table of Contents Component

**Priority:** P1

---

## P03-T193 — Generate TOC from Semantic Headings

**Priority:** P1

---

## P03-T194 — Ensure Stable Heading Anchors

**Priority:** P0

---

## P03-T195 — Account for Sticky Header Offset

**Priority:** P0

---

## P03-T196 — Implement Active Section Highlighting Where Useful

**Priority:** P2

---

## P03-T197 — Avoid Excessive TOC Depth

**Priority:** P1

---

## P03-T198 — Define Mobile TOC Behavior

**Priority:** P1

---

## P03-T199 — Prevent Duplicate TOC Implementations

**Priority:** P1

---

# Workstream S — Footer Rebuild

## P03-T200 — Rebuild Canonical Global Footer

Create one restrained footer.

**Priority:** P0

---

## P03-T201 — Define Footer Information Architecture

Include only useful destinations.

**Priority:** P0

---

## P03-T202 — Define Footer Navigation Groups

**Priority:** P1

---

## P03-T203 — Ensure Footer Links Use Canonical URLs

**Priority:** P0

---

## P03-T204 — Prevent Footer Link Spam

Avoid turning the footer into an SEO link dump.

**Priority:** P0

---

## P03-T205 — Include Essential Company and Legal Links

**Priority:** P1

---

## P03-T206 — Include Major Product Discovery Links

**Priority:** P1

---

## P03-T207 — Standardize Footer Brand Treatment

**Priority:** P2

---

## P03-T208 — Standardize Footer Typography

**Priority:** P1

---

## P03-T209 — Standardize Footer Spacing

**Priority:** P1

---

## P03-T210 — Ensure Footer Mobile Responsiveness

**Priority:** P0

---

## P03-T211 — Remove Excessive Decorative Footer Elements

**Priority:** P1

---

## P03-T212 — Remove Duplicate Footer Implementations

**Priority:** P0

---

# Workstream T — Global Loading Architecture

## P03-T213 — Define Global Loading Philosophy

Prefer stable layout-preserving feedback.

**Priority:** P0

---

## P03-T214 — Build Root Loading State

**Priority:** P1

---

## P03-T215 — Build Public Shell Loading State

**Priority:** P1

---

## P03-T216 — Build Route-Family Loading Foundation

**Priority:** P1

---

## P03-T217 — Preserve Header Stability During Loading

**Priority:** P0

---

## P03-T218 — Preserve Main Layout Dimensions During Loading

**Priority:** P0

---

## P03-T219 — Avoid Full-Screen Spinners for Normal Content Navigation

**Priority:** P0

---

## P03-T220 — Replace Shared Plain “Loading...” Text

**Priority:** P1

---

## P03-T221 — Prevent Loading Skeleton Overanimation

**Priority:** P2

---

## P03-T222 — Respect Reduced Motion

**Priority:** P1

---

# Workstream U — Global Error Architecture

## P03-T223 — Define Global Error Hierarchy

Separate:

* recoverable component errors,
* route errors,
* root application failures.

**Priority:** P0

---

## P03-T224 — Build Canonical Route Error Experience

**Priority:** P0

---

## P03-T225 — Build Canonical Root Error Experience

**Priority:** P0

---

## P03-T226 — Provide Useful Recovery Actions

**Priority:** P1

---

## P03-T227 — Avoid Exposing Internal Error Details

**Priority:** P0

---

## P03-T228 — Preserve Navigation During Recoverable Route Errors

Where architecture allows.

**Priority:** P1

---

## P03-T229 — Distinguish Error from Not Found

**Priority:** P0

---

## P03-T230 — Distinguish Temporary Backend Failure from Missing Content

**Priority:** P0

---

## P03-T231 — Remove Duplicate Error Components

**Priority:** P1

---

# Workstream V — 404 Experience Rebuild

## P03-T232 — Rebuild Canonical 404 Page

**Priority:** P0

---

## P03-T233 — Keep 404 Visual Design Consistent with V2

**Priority:** P1

---

## P03-T234 — Provide Homepage Recovery Link

**Priority:** P0

---

## P03-T235 — Provide Search Recovery

**Priority:** P1

---

## P03-T236 — Provide Relevant Major Hub Links

**Priority:** P1

---

## P03-T237 — Avoid Overloading 404 with Content

**Priority:** P1

---

## P03-T238 — Ensure 404 Returns Correct HTTP Status

Use Phase 02 behavior.

**Priority:** P0

---

## P03-T239 — Prevent 404 Page from Being Indexed as Valid Content

**Priority:** P0

---

## P03-T240 — Remove Duplicate Not-Found Experiences

**Priority:** P0

---

# Workstream W — Route Transition Experience

## P03-T241 — Define Route Transition Philosophy

Avoid unnecessary animation.

**Priority:** P1

---

## P03-T242 — Preserve Scroll Behavior Intentionally

**Priority:** P1

---

## P03-T243 — Handle Anchor Navigation Correctly

**Priority:** P0

---

## P03-T244 — Prevent Unexpected Scroll Jumps

**Priority:** P1

---

## P03-T245 — Preserve Navigation Context During Content Transitions

**Priority:** P1

---

## P03-T246 — Prevent Full Shell Remounting Where Unnecessary

**Priority:** P0

---

## P03-T247 — Prevent Theme Flash During Navigation

**Priority:** P0

---

## P03-T248 — Prevent Header Layout Shift During Navigation

**Priority:** P0

---

# Workstream X — Global Responsive Architecture

## P03-T249 — Define Shell Breakpoint Behavior

**Priority:** P0

---

## P03-T250 — Validate Header at Small Mobile Widths

**Priority:** P0

---

## P03-T251 — Validate Header at Large Mobile Widths

**Priority:** P0

---

## P03-T252 — Validate Header at Tablet Widths

**Priority:** P0

---

## P03-T253 — Validate Header at Desktop Widths

**Priority:** P0

---

## P03-T254 — Validate Header at Wide Desktop Widths

**Priority:** P1

---

## P03-T255 — Validate Navigation Overflow Behavior

**Priority:** P0

---

## P03-T256 — Validate Search Entry Responsiveness

**Priority:** P0

---

## P03-T257 — Validate Breadcrumb Responsiveness

**Priority:** P0

---

## P03-T258 — Validate Sidebar Responsiveness

**Priority:** P0

---

## P03-T259 — Validate Footer Responsiveness

**Priority:** P0

---

## P03-T260 — Prevent Horizontal Shell Overflow

**Priority:** P0

---

## P03-T261 — Prevent Fixed Desktop Dimensions from Reaching Mobile

**Priority:** P0

---

## P03-T262 — Ensure Touch Target Accessibility

**Priority:** P0

---

# Workstream Y — Global Accessibility Integration

## P03-T263 — Add Skip-to-Main Navigation

**Priority:** P0

---

## P03-T264 — Define Main Landmark

**Priority:** P0

---

## P03-T265 — Define Header Landmark

**Priority:** P0

---

## P03-T266 — Define Navigation Landmarks

**Priority:** P0

---

## P03-T267 — Define Footer Landmark

**Priority:** P0

---

## P03-T268 — Ensure Unique Navigation Labels

Where multiple navigation regions exist.

**Priority:** P0

---

## P03-T269 — Ensure Keyboard Access to All Header Actions

**Priority:** P0

---

## P03-T270 — Ensure Keyboard Access to Mobile Navigation

**Priority:** P0

---

## P03-T271 — Ensure Keyboard Access to Search

**Priority:** P0

---

## P03-T272 — Ensure Keyboard Access to Theme Controls

**Priority:** P0

---

## P03-T273 — Validate Focus Order

**Priority:** P0

---

## P03-T274 — Validate Focus Visibility

**Priority:** P0

---

## P03-T275 — Validate Screen Reader Navigation Structure

**Priority:** P1

---

## P03-T276 — Validate Reduced Motion Behavior

**Priority:** P1

---

# Workstream Z — Global SEO Integration

## P03-T277 — Ensure Shell Navigation Uses Canonical Links

**Priority:** P0

---

## P03-T278 — Ensure Header Links Are Crawlable

**Priority:** P0

---

## P03-T279 — Ensure Footer Links Are Crawlable

**Priority:** P0

---

## P03-T280 — Ensure Sidebar Links Are Crawlable

**Priority:** P0

---

## P03-T281 — Ensure Breadcrumb Links Are Crawlable

**Priority:** P0

---

## P03-T282 — Prevent Shell from Injecting Duplicate H1 Elements

**Priority:** P0

---

## P03-T283 — Prevent Shell from Injecting Duplicate Metadata

**Priority:** P0

---

## P03-T284 — Prevent Shell Components from Creating Alternate Canonicals

**Priority:** P0

---

## P03-T285 — Prevent Client Authentication State from Hiding Public Links

**Priority:** P0

---

## P03-T286 — Ensure Search UI Does Not Create Crawl Traps

**Priority:** P0

---

## P03-T287 — Ensure Mobile Navigation Preserves Crawl Discovery

**Priority:** P0

---

# Workstream AA — Shell Performance Optimization

## P03-T288 — Measure Global Shell JavaScript Cost

**Priority:** P0

---

## P03-T289 — Reduce Header Client JavaScript

**Priority:** P0

---

## P03-T290 — Reduce Navigation Client JavaScript

**Priority:** P0

---

## P03-T291 — Lazy Load Noncritical Interactive Shell Features

**Priority:** P1

---

## P03-T292 — Avoid Shipping Dashboard Logic to Public Pages

**Priority:** P0

---

## P03-T293 — Avoid Shipping Heavy Search Logic Before Search Interaction

Where appropriate.

**Priority:** P1

---

## P03-T294 — Avoid Shipping Unused Navigation Libraries

**Priority:** P1

---

## P03-T295 — Reduce Duplicate Icon Imports

**Priority:** P1

---

## P03-T296 — Prevent Global Shell Layout Shift

**Priority:** P0

---

## P03-T297 — Optimize Logo and Brand Assets

**Priority:** P1

---

## P03-T298 — Optimize Theme Initialization

**Priority:** P0

---

## P03-T299 — Preserve Fast Initial Public Content Rendering

**Priority:** P0

---

# Workstream AB — Shared Component Migration

## P03-T300 — Inventory Shared Components Used by Global Shell

**Priority:** P0

---

## P03-T301 — Map Legacy Header Components to V2

**Priority:** P0

---

## P03-T302 — Map Legacy Navigation Components to V2

**Priority:** P0

---

## P03-T303 — Map Legacy Mobile Navigation Components to V2

**Priority:** P0

---

## P03-T304 — Map Legacy Search Components to V2

**Priority:** P0

---

## P03-T305 — Map Legacy Breadcrumb Components to V2

**Priority:** P0

---

## P03-T306 — Map Legacy Sidebar Components to V2

**Priority:** P0

---

## P03-T307 — Map Legacy Footer Components to V2

**Priority:** P0

---

## P03-T308 — Map Legacy Loading Components to V2

**Priority:** P1

---

## P03-T309 — Map Legacy Error Components to V2

**Priority:** P1

---

## P03-T310 — Map Legacy Theme Components to V2

**Priority:** P0

---

## P03-T311 — Migrate Shared Shell Buttons to Canonical Button

**Priority:** P0

---

## P03-T312 — Migrate Shared Shell Inputs to Canonical Inputs

**Priority:** P0

---

## P03-T313 — Migrate Shared Shell Icons to Canonical Icon System

**Priority:** P1

---

## P03-T314 — Migrate Shared Shell Surfaces to Semantic Tokens

**Priority:** P0

---

## P03-T315 — Migrate Shared Shell Typography to Canonical Scale

**Priority:** P0

---

## P03-T316 — Migrate Shared Shell Spacing to Canonical Scale

**Priority:** P0

---

## P03-T317 — Migrate Shared Shell Focus States

**Priority:** P0

---

## P03-T318 — Migrate Shared Shell Responsive Logic

**Priority:** P0

---

# Workstream AC — Legacy Shell Cleanup

## P03-T319 — Identify Duplicate Root Layout Logic

**Priority:** P0

---

## P03-T320 — Identify Duplicate Header Logic

**Priority:** P0

---

## P03-T321 — Identify Duplicate Navigation Logic

**Priority:** P0

---

## P03-T322 — Identify Duplicate Sidebar Logic

**Priority:** P0

---

## P03-T323 — Identify Duplicate Footer Logic

**Priority:** P0

---

## P03-T324 — Identify Duplicate Theme Logic

**Priority:** P0

---

## P03-T325 — Identify Duplicate Search Entry Logic

**Priority:** P0

---

## P03-T326 — Remove Confirmed Dead Header Components

**Priority:** P1

---

## P03-T327 — Remove Confirmed Dead Navigation Components

**Priority:** P1

---

## P03-T328 — Remove Confirmed Dead Sidebar Components

**Priority:** P1

---

## P03-T329 — Remove Confirmed Dead Footer Components

**Priority:** P1

---

## P03-T330 — Remove Confirmed Dead Theme Components

**Priority:** P1

---

## P03-T331 — Remove Confirmed Dead Search Components

**Priority:** P1

---

## P03-T332 — Remove Legacy Shell CSS

After dependency verification.

**Priority:** P0

---

## P03-T333 — Remove Legacy Shell Imports

**Priority:** P0

---

## P03-T334 — Prevent Legacy Shell Reintroduction

**Priority:** P1

---

# Workstream AD — Public Route Shell Adoption

## P03-T335 — Apply Canonical Shell to Homepage

**Priority:** P0

---

## P03-T336 — Apply Canonical Shell to Domain Routes

**Priority:** P0

---

## P03-T337 — Apply Canonical Shell to Stack Routes

**Priority:** P0

---

## P03-T338 — Apply Canonical Shell to Pillar Routes

**Priority:** P0

---

## P03-T339 — Apply Canonical Shell to Module Routes

**Priority:** P0

---

## P03-T340 — Apply Canonical Shell to Question Routes

**Priority:** P0

---

## P03-T341 — Apply Canonical Shell to Topic Routes

**Priority:** P0

---

## P03-T342 — Apply Canonical Shell to Company Routes

**Priority:** P0

---

## P03-T343 — Apply Canonical Shell to Comparison Routes

**Priority:** P1

---

## P03-T344 — Apply Canonical Shell to Tool Routes

**Priority:** P1

---

## P03-T345 — Apply Canonical Shell to Roadmap Routes

**Priority:** P1

---

## P03-T346 — Apply Canonical Shell to Cheatsheet Routes

**Priority:** P1

---

## P03-T347 — Apply Canonical Shell to DSA Routes

**Priority:** P0

---

## P03-T348 — Apply Canonical Shell to Static Information Routes

**Priority:** P1

---

## P03-T349 — Prevent Route-Specific Shell Forks During Adoption

**Priority:** P0

---

# Workstream AE — Authentication Shell Boundary

## P03-T350 — Define Authentication Layout

**Priority:** P0

---

## P03-T351 — Keep Authentication Pages Visually Consistent with V2

**Priority:** P1

---

## P03-T352 — Avoid Full Public Content Navigation Where Unnecessary

**Priority:** P1

---

## P03-T353 — Preserve Brand Consistency

**Priority:** P1

---

## P03-T354 — Ensure Authentication Routes Remain SEO-Classified Correctly

**Priority:** P0

---

## P03-T355 — Prevent Authentication Layout from Leaking into Public Routes

**Priority:** P0

---

# Workstream AF — Dashboard Shell Boundary

## P03-T356 — Define Authenticated Application Shell

**Priority:** P0

---

## P03-T357 — Separate Dashboard Navigation from Public Content Navigation

**Priority:** P0

---

## P03-T358 — Define Dashboard Header Responsibilities

**Priority:** P1

---

## P03-T359 — Define Dashboard Sidebar Responsibilities

**Priority:** P1

---

## P03-T360 — Define Dashboard Mobile Navigation Foundation

**Priority:** P1

---

## P03-T361 — Prevent Dashboard JavaScript from Shipping to Public Routes

**Priority:** P0

---

## P03-T362 — Preserve Shared Design Tokens Across Public and Private Shells

**Priority:** P0

---

## P03-T363 — Preserve Different Density Requirements

Application surfaces may be denser than reading pages.

**Priority:** P0

---

# Workstream AG — Global Shell Data Boundaries

## P03-T364 — Identify Data Required by Global Header

**Priority:** P0

---

## P03-T365 — Remove Unnecessary Header Data Fetching

**Priority:** P0

---

## P03-T366 — Identify Data Required by Global Navigation

**Priority:** P0

---

## P03-T367 — Avoid Fetching Entire Content Trees Globally

**Priority:** P0

---

## P03-T368 — Load Contextual Navigation Only Where Needed

**Priority:** P0

---

## P03-T369 — Identify Data Required by User Menu

**Priority:** P1

---

## P03-T370 — Isolate User-Specific Data from Public Content Rendering

**Priority:** P0

---

## P03-T371 — Prevent Global Shell Failure When User API Fails

**Priority:** P0

---

## P03-T372 — Cache Stable Global Navigation Data Where Appropriate

**Priority:** P1

---

## P03-T373 — Avoid Duplicate Shell Data Requests

**Priority:** P1

---

# Workstream AH — Global Shell Security

## P03-T374 — Prevent Unsafe Dynamic Navigation URLs

**Priority:** P0

---

## P03-T375 — Prevent User-Controlled HTML in Global Shell

**Priority:** P0

---

## P03-T376 — Prevent Open Redirects from Header Authentication Actions

**Priority:** P0

---

## P03-T377 — Prevent Sensitive User Data from Public Shell HTML

**Priority:** P0

---

## P03-T378 — Prevent Private Navigation Items from Appearing for Anonymous Users

**Priority:** P0

---

## P03-T379 — Prevent Authentication State Leakage Through Caching

**Priority:** P0

---

## P03-T380 — Validate Safe External Footer Links

**Priority:** P1

---

# Workstream AI — Global Shell Quality Validation

## P03-T381 — Validate Shell in Light Theme

**Priority:** P0

---

## P03-T382 — Validate Shell in Dark Theme

**Priority:** P0

---

## P03-T383 — Validate Shell Without Authentication

**Priority:** P0

---

## P03-T384 — Validate Shell With Authentication

**Priority:** P0

---

## P03-T385 — Validate Shell Without JavaScript for Core Navigation

**Priority:** P0

---

## P03-T386 — Validate Shell with Keyboard Only

**Priority:** P0

---

## P03-T387 — Validate Shell at Mobile Width

**Priority:** P0

---

## P03-T388 — Validate Shell at Tablet Width

**Priority:** P0

---

## P03-T389 — Validate Shell at Desktop Width

**Priority:** P0

---

## P03-T390 — Validate Shell at Wide Desktop Width

**Priority:** P1

---

## P03-T391 — Validate Long Navigation Labels

**Priority:** P1

---

## P03-T392 — Validate Deep Breadcrumbs

**Priority:** P1

---

## P03-T393 — Validate Large Content Trees

**Priority:** P1

---

## P03-T394 — Validate Slow Authentication State Resolution

**Priority:** P1

---

## P03-T395 — Validate Search Failure Behavior

**Priority:** P1

---

## P03-T396 — Validate Theme Persistence

**Priority:** P1

---

# Workstream AJ — Representative Page Integration

## P03-T397 — Integrate Homepage with Final Global Shell

**Priority:** P0

---

## P03-T398 — Integrate Representative Hub Page

**Priority:** P0

---

## P03-T399 — Integrate Representative Question Page

**Priority:** P0

---

## P03-T400 — Integrate Representative Deep Hierarchy Page

**Priority:** P0

---

## P03-T401 — Integrate Representative Mobile Experience

**Priority:** P0

---

## P03-T402 — Integrate Representative Authenticated State

**Priority:** P1

---

## P03-T403 — Compare V1 and V2 Global Density

**Priority:** P0

---

## P03-T404 — Compare V1 and V2 Navigation Clarity

**Priority:** P0

---

## P03-T405 — Compare V1 and V2 Content Focus

**Priority:** P0

---

## P03-T406 — Fix Root Shell Defects Rather Than Page-Level Symptoms

**Priority:** P0

---

# Workstream AK — Regression Protection

## P03-T407 — Add Header Interaction Coverage

**Priority:** P1

---

## P03-T408 — Add Mobile Navigation Interaction Coverage

**Priority:** P0

---

## P03-T409 — Add Navigation Accessibility Coverage

**Priority:** P0

---

## P03-T410 — Add Search Entry Interaction Coverage

**Priority:** P1

---

## P03-T411 — Add Theme Control Coverage

**Priority:** P1

---

## P03-T412 — Add Breadcrumb Rendering Coverage

**Priority:** P1

---

## P03-T413 — Add Sidebar Responsive Coverage

**Priority:** P1

---

## P03-T414 — Add Shell Link Integrity Coverage

**Priority:** P0

---

## P03-T415 — Add Shell Overflow Regression Coverage

**Priority:** P0

---

## P03-T416 — Add Shell Layout Shift Monitoring

**Priority:** P1

---

## P03-T417 — Add Legacy Shell Import Detection

Where practical.

**Priority:** P2

---

# Workstream AL — Phase 03 Completion

## P03-T418 — Freeze Canonical Public Shell API

**Priority:** P0

---

## P03-T419 — Freeze Canonical Header Architecture

**Priority:** P0

---

## P03-T420 — Freeze Canonical Navigation Architecture

**Priority:** P0

---

## P03-T421 — Freeze Canonical Mobile Navigation Architecture

**Priority:** P0

---

## P03-T422 — Freeze Canonical Breadcrumb Architecture

**Priority:** P0

---

## P03-T423 — Freeze Canonical Sidebar Foundation

**Priority:** P0

---

## P03-T424 — Freeze Canonical Footer Architecture

**Priority:** P0

---

## P03-T425 — Publish Shell Migration Guide

**Priority:** P0

---

## P03-T426 — Publish Legacy-to-V2 Shell Component Map

**Priority:** P0

---

## P03-T427 — Update V2 Technical Implementation Plan

**Priority:** P1

---

## P03-T428 — Update V2 Decision Log

**Priority:** P1

---

## P03-T429 — Update V2 Issue Log

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

**Priority:** P0

---

## P03-T431 — Approve Global Shell for Route-Family Migration

Confirm later phases can migrate actual page families without rebuilding global navigation and shell infrastructure.

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
