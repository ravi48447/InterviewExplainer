# Interview Explainer V2 — Performance, Accessibility & Quality Standards

**Document:** `12_PERFORMANCE_ACCESSIBILITY_QUALITY.md`
**Status:** Foundational / Quality Engineering Standard
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md` through `11_APPLICATION_ARCHITECTURE.md`
**Purpose:** Define measurable performance, accessibility, responsiveness, browser compatibility, testing, visual quality, resilience, and release standards for Interview Explainer V2.

---

# 1. Purpose of This Document

A successful V2 redesign cannot be evaluated only by asking:

```text
Does the website look better?
```

A visually polished interface may still fail because it is:

```text
Slow

Heavy

Difficult to read

Poor on mobile

Keyboard inaccessible

Unstable during loading

Broken on smaller screens

Overdependent on JavaScript

Difficult for search engines to render

Inconsistent across browsers

Easy to regress
```

Interview Explainer is primarily a reading and preparation product.

Therefore, quality must be evaluated across several dimensions:

```text
Visual Quality

Reading Quality

Performance

Accessibility

Responsiveness

Functional Correctness

SEO Integrity

Reliability

Cross-Browser Compatibility

Regression Resistance
```

The central principle is:

> **Quality is not a final polish phase. Quality is an architectural requirement.**

---

# 2. V2 Quality Philosophy

V2 should optimize for:

```text
Fast enough to feel immediate

Calm enough to support long reading

Accessible enough to work without perfect vision, motion tolerance, or pointer control

Responsive enough to feel intentionally designed on every major screen size

Stable enough that loading does not constantly rearrange the page

Structured enough for search engines and assistive technology

Tested enough that improvements do not repeatedly break previous work
```

The goal is not theoretical perfection.

The goal is:

```text
Consistently high quality
+
Measurable standards
+
Controlled exceptions
```

---

# 3. Quality Dimensions

Every major page archetype should be evaluated across:

```text
1. Performance

2. Accessibility

3. Responsive Behavior

4. Visual Consistency

5. Functional Correctness

6. Content Readability

7. Loading Behavior

8. Error Resilience

9. Browser Compatibility

10. SEO Integrity
```

No single Lighthouse score represents total product quality.

---

# 4. Page Archetypes Under Quality Testing

At minimum:

```text
Homepage

Directory / Browse Page

Preparation Track Page

Major Area / Pillar Page

Module Page

Question Page

Search Page

Company Page

Role Page

Pricing Page if retained

Authentication Pages

Dashboard

404 Page

Error State
```

Future:

```text
Mock Interview

Resume Analysis

Jobs

Applications

Real Interview Workspace
```

Each archetype should have its own validation checklist.

---

# 5. Quality Baseline Before V2

Before large V2 implementation:

Capture a baseline.

For representative pages, record:

```text
Current Lighthouse Results

Core Web Vitals if available

Page Weight

JavaScript Weight

Request Count

Major Accessibility Issues

Mobile Layout Problems

Visual Screenshots

Console Errors

Broken Links

SEO Metadata State
```

This creates:

```text
V1 Baseline
    ↓
V2 Comparison
```

Without a baseline, improvement becomes subjective.

---

# 6. Performance Philosophy

Interview Explainer should feel lightweight.

The product is not:

```text
A 3D game

A video editor

A desktop simulation platform
```

Most public pages primarily contain:

```text
Text

Navigation

Structured Lists

Code

Small Icons

Limited Images
```

Therefore:

> **Public content pages should have a high performance standard.**

---

# 7. Performance Priorities

Priority order:

```text
1. Primary content appears quickly.

2. The page becomes readable quickly.

3. Layout remains stable.

4. Interaction becomes available quickly.

5. Secondary enhancements load later where appropriate.
```

Do not delay the answer because:

```text
Related Questions

Analytics

Animations

Decorative UI

User Progress
```

are still loading.

---

# 8. Core Web Vitals Targets

Target good thresholds:

```text
LCP
≤ 2.5 seconds

INP
≤ 200 milliseconds

CLS
≤ 0.1
```

These are target quality thresholds.

Real-world field data should ultimately matter more than a single local test.

---

# 9. Stronger Internal Aspiration

For lightweight public pages, V2 should often aim better than the minimum good threshold.

Internal aspiration:

```text
LCP
~ 2.0 seconds or better where practical

CLS
as close to 0 as practical

INP
comfortably within the good range
```

Do not artificially optimize one metric while harming usability.

---

# 10. Lab vs Field Performance

Understand the difference:

```text
Lab Data
→ controlled synthetic test

Field Data
→ actual user experience
```

Use both.

Lab tools help detect regressions before release.

Field data reveals real device and network behavior.

---

# 11. Performance Testing Conditions

Do not test only on:

```text
Powerful development laptop

Fast Wi-Fi

Warm cache
```

Representative testing should include:

```text
Mobile simulation

Slower CPU

Throttled network

Cold load

Production build
```

Development mode is not a valid performance benchmark.

---

# 12. Performance Page Set

Maintain a representative performance test set.

Example:

```text
Homepage

Large Module Page

Long Question Page

Code-Heavy Question Page

Search Page

Dashboard
```

These pages expose different performance risks.

---

# 13. Server-First Performance

Public content should be available in the initial server response where the framework supports it.

Avoid:

```text
Blank shell
    ↓
JavaScript loads
    ↓
API request
    ↓
Content appears
```

for core public content.

Prefer:

```text
Request
    ↓
Server-rendered content
    ↓
Optional enhancement
```

---

# 14. JavaScript Budget Philosophy

JavaScript should be treated as a cost.

Every client-side dependency adds potential:

```text
Download Cost

Parse Cost

Execution Cost

Hydration Cost

Maintenance Cost
```

Public reading pages should require relatively little client JavaScript.

---

# 15. Client Component Audit

For every large client component:

Ask:

```text
Why must this run in the browser?

Can the static portion remain server-rendered?

Can the interactive portion become a smaller client island?
```

Do not convert an entire route to client rendering for:

```text
One bookmark button

One accordion

One theme toggle
```

---

# 16. Bundle Monitoring

V2 should monitor:

```text
Route-Level JavaScript

Shared JavaScript

Large Dependencies

Unexpected Client Bundles
```

A redesign must not silently double public page JavaScript.

---

# 17. Dependency Performance Rule

Before adding a client dependency:

Evaluate:

```text
Bundle Size

Tree Shaking

Usage Frequency

Existing Alternative

Native Browser Alternative

Server-Side Alternative
```

Do not add a large package for a tiny visual convenience.

---

# 18. Dynamic Imports

Use dynamic loading for genuinely non-critical heavy functionality.

Potential examples:

```text
Advanced Editor

Large Visualization

Mock Interview Tooling

Resume Preview System
```

Do not dynamically import everything by default.

Excessive fragmentation also creates complexity.

---

# 19. Third-Party Script Discipline

Third-party scripts can heavily affect performance.

Potential:

```text
Analytics

Ads

Chat Widgets

Heatmaps

Authentication

Payment Scripts
```

Every script should have:

```text
Purpose

Owner

Loading Strategy

Privacy Review

Performance Cost
```

Do not install multiple overlapping analytics systems casually.

---

# 20. Analytics Loading

Analytics must not block:

```text
Primary Content

Navigation

Reading
```

where avoidable.

Analytics failure should not break the page.

---

# 21. Future Advertising Performance

If advertising is introduced:

Ads must not destroy:

```text
CLS

Reading Flow

Mobile Layout

Page Speed

Content Trust
```

Reserve ad space where necessary.

Do not inject unpredictable blocks that move the answer while the user is reading.

---

# 22. Layout Stability

Common CLS causes:

```text
Images without dimensions

Late-loading banners

Fonts changing dimensions

Ads without reserved space

Dynamic user-state insertion

Loading placeholders with wrong height
```

V2 should explicitly prevent these.

---

# 23. Skeleton Stability

A skeleton should approximately match the final content region.

Bad:

```text
Tiny spinner
    ↓
Large content block appears
    ↓
Page jumps
```

Better:

```text
Reserved content-shaped skeleton
    ↓
Final content replaces it
```

---

# 24. Image Performance

Images should:

```text
Use appropriate dimensions

Avoid oversized source files

Use modern formats where appropriate

Load responsively

Lazy-load below-the-fold content where appropriate
```

Do not use large decorative images merely to make pages feel premium.

Interview Explainer is primarily a content product.

---

# 25. Hero Image Rule

Do not add a large hero image to every page archetype.

Images should serve:

```text
Understanding

Identity

Context
```

not compensate for weak layout.

---

# 26. Font Performance

Typography is critical.

But excessive font loading can harm performance.

Prefer:

```text
Limited Font Families

Limited Necessary Weights

Optimized Loading

Fallback Strategy
```

Do not load:

```text
Every weight from 100 to 900
```

if only:

```text
400
500
600
700
```

are used.

---

# 27. Font Stability

Font loading should minimize:

```text
Flash

Layout Shift

Unreadable Delay
```

The fallback stack should be reasonably compatible.

---

# 28. Code Highlighting Performance

Syntax highlighting should not unnecessarily ship a massive client-side highlighter to every page.

Prefer:

```text
Server-Side Highlighting

Build-Time Highlighting

Scoped Language Loading
```

where appropriate.

Do not load support for hundreds of languages if only a limited set is used.

---

# 29. Long Content Performance

Question pages may become long.

Avoid rendering patterns that create:

```text
Thousands of unnecessary client nodes

Expensive scroll listeners

Continuous layout calculations

Heavy animation on every section
```

Long-form content should remain simple.

---

# 30. Scroll Performance

Avoid:

```text
Unthrottled scroll handlers

Constant DOM measurement

Heavy parallax

Large fixed translucent layers

Excessive backdrop blur
```

especially on mobile.

---

# 31. Animation Performance

Prefer animations based on:

```text
Transform

Opacity
```

where possible.

Avoid frequently animating expensive layout properties.

Animations should remain subtle.

---

# 32. Performance Budget Categories

Track at least:

```text
JavaScript

CSS

Images

Fonts

Third-Party Scripts

Request Count
```

Exact budgets should be established after measuring the current production build.

Do not invent arbitrary numbers without baseline data.

---

# 33. Performance Regression Rule

If a V2 change materially worsens:

```text
LCP

INP

CLS

JavaScript Weight

Page Weight
```

the change requires:

```text
Investigation
+
Justification
```

A prettier page is not automatically worth a major performance regression.

---

# 34. Accessibility Standard

V2 should target:

```text
WCAG 2.2 AA
```

as the practical accessibility baseline.

This is not merely a compliance exercise.

Accessibility improves:

```text
Keyboard Use

Readability

Mobile Usability

Semantic Structure

Screen Reader Experience

Focus Clarity

General Product Quality
```

---

# 35. Accessibility Is Not an Audit at the End

Accessibility should be built into:

```text
Design Tokens

Components

Page Archetypes

Content Structure

Forms

Navigation

Testing
```

Fixing everything after the redesign is slower.

---

# 36. Semantic HTML

Use the correct semantic element where practical.

Examples:

```text
header

nav

main

article

section

aside

footer

button

form
```

Avoid making every element:

```text
div
```

with click handlers.

---

# 37. Button vs Link

Use:

```text
Link
→ navigation

Button
→ action
```

Do not use a button to navigate merely because it looks like a button.

Do not use an anchor for an action without valid navigation semantics.

---

# 38. Heading Hierarchy

Pages should have a logical heading structure.

Typically:

```text
One primary H1

Logical H2 sections

Nested H3 sections
```

Do not choose heading levels based only on desired font size.

Typography and semantics are separate.

---

# 39. Question Page Semantics

A question page may conceptually contain:

```text
H1
Question Title

H2
Major Answer Sections

H3
Subsections
```

Do not create repeated unrelated H1 elements for decorative cards.

---

# 40. Landmark Structure

Major pages should expose clear landmarks.

Example:

```text
Header

Navigation

Main Content

Optional Complementary Content

Footer
```

This improves assistive navigation.

---

# 41. Keyboard Accessibility

Every interactive element must be usable without a mouse.

Test:

```text
Tab

Shift + Tab

Enter

Space

Escape

Arrow Keys
```

where appropriate.

---

# 42. Keyboard Test Journeys

At minimum test:

```text
Navigate Header

Open Mobile Navigation

Use Search

Open and Close Dialog

Submit Authentication Form

Navigate Question Actions

Use Dashboard Controls
```

Future:

```text
Complete Mock Interview Controls
```

---

# 43. Focus Visibility

Keyboard focus must be clearly visible.

Target:

```text
Consistent Focus Ring

High Contrast

Not Hidden by Overflow

Not Removed Without Replacement
```

Never globally apply:

```text
outline: none
```

without an accessible replacement.

---

# 44. Focus Order

Focus order should follow the visual and logical reading order.

Avoid:

```text
CSS visual reordering
```

that causes keyboard focus to jump unpredictably.

---

# 45. Focus Management

When opening:

```text
Dialog

Search Overlay

Mobile Menu
```

focus should move appropriately.

When closing:

Focus should return to the triggering element where appropriate.

---

# 46. Skip Navigation

Long public pages should support a:

```text
Skip to main content
```

mechanism.

It may remain visually hidden until focused.

This is especially useful on question pages.

---

# 47. Color Contrast

Text and interactive elements should meet appropriate contrast requirements.

Do not rely on:

```text
Very light gray text

Low-opacity text

Subtle pastel combinations
```

merely because they look modern.

---

# 48. Dark Mode Contrast

Dark mode requires independent validation.

A color that works in light mode may fail in dark mode.

Test:

```text
Body Text

Muted Text

Borders

Links

Code Blocks

Badges

Focus Rings

Disabled States
```

---

# 49. Color Is Not the Only Signal

Do not communicate:

```text
Success

Error

Difficulty

Selected State
```

through color alone.

Use:

```text
Text

Icon

Shape

Label
```

where appropriate.

---

# 50. Text Readability

The reading experience should consider:

```text
Font Size

Line Height

Line Length

Paragraph Spacing

Heading Rhythm

Contrast

Code Legibility
```

A page can technically pass accessibility checks and still be exhausting to read.

---

# 51. Minimum Body Readability

The default body text should generally remain around a comfortable readable size.

Avoid shrinking content merely to fit more on screen.

The V1 problem of excessive density must not return.

---

# 52. Line Length

Long-form content should avoid extremely wide text lines.

Use a deliberate reading width.

The main answer column should prioritize comprehension.

Not maximum horizontal utilization.

---

# 53. Zoom Support

The interface should remain usable when users zoom text or page content.

Avoid layouts that break immediately at:

```text
200% zoom
```

where practical.

---

# 54. Touch Targets

Interactive controls on touch devices should be comfortably usable.

Avoid tiny:

```text
Icons

Close Buttons

Pagination Controls

Checkboxes
```

with insufficient touch area.

---

# 55. Form Labels

Inputs should have accessible labels.

Placeholder text is not a substitute for a label when a label is required.

---

# 56. Form Errors

Errors should:

```text
Identify the problem

Be associated with the relevant input

Remain understandable without color alone
```

Do not display:

```text
Error 422
```

to ordinary users.

---

# 57. Error Summary

For complex forms:

An error summary may help users understand multiple failures.

Do not overcomplicate simple forms.

---

# 58. Accessible Names

Icon-only controls require an accessible name.

Examples:

```text
Search

Close

Copy Code

Open Menu

Bookmark
```

A visual icon alone is insufficient.

---

# 59. Tooltip Rule

Tooltips should not be required to understand critical functionality.

They may supplement clear controls.

Keyboard and touch users must not be excluded.

---

# 60. Images and Alternative Text

Informative images need meaningful alternative text.

Decorative images should not create unnecessary screen-reader noise.

Do not write:

```text
image
```

as alt text.

---

# 61. Decorative Icons

Decorative icons should generally be hidden from assistive technology when the accompanying text already communicates the meaning.

Avoid duplicate announcements.

---

# 62. Code Accessibility

Code blocks should remain:

```text
Selectable

Readable

Keyboard Accessible
```

Copy controls should have clear labels.

Horizontal scrolling should not break the entire page.

---

# 63. Tables

Use real table semantics for tabular data.

Do not use tables merely for visual layout.

On small screens:

Choose an intentional strategy.

Potential:

```text
Horizontal Scroll

Responsive Simplification

Alternative Presentation
```

Do not let tables destroy the viewport.

---

# 64. Reduced Motion

Respect:

```text
prefers-reduced-motion
```

for non-essential animation.

Users who request reduced motion should not receive unnecessary movement.

---

# 65. Motion Philosophy

V2 animation should support:

```text
Orientation

Feedback

Continuity
```

not constant decoration.

Avoid:

```text
Large entrance animations

Repeated bouncing

Excessive scaling

Parallax-heavy reading pages
```

---

# 66. Autoplay

Avoid autoplaying distracting media.

If future media is introduced:

Users should retain control.

---

# 67. Accessibility Testing Layers

Use:

```text
Automated Testing

Manual Keyboard Testing

Screen Reader Spot Checks

Visual Review

Real Device Testing
```

Automated tools cannot detect every accessibility problem.

---

# 68. Automated Accessibility Tools

Potential tools include:

```text
axe

Lighthouse

Framework-integrated accessibility checks
```

The final toolset should fit the repository.

Automated violations should be treated seriously.

---

# 69. Screen Reader Testing

At minimum, periodically test major workflows with a screen reader available on the target operating system.

Focus on:

```text
Navigation

Headings

Question Content

Forms

Dialogs

Search
```

The goal is not to test every page manually every release.

The goal is to validate core patterns.

---

# 70. Responsive Design Philosophy

Responsive design is not:

```text
Desktop layout
+
everything stacked vertically
```

Each archetype should define intentional behavior across screen sizes.

---

# 71. Breakpoint Philosophy

Use a limited, consistent breakpoint system.

Avoid component-specific arbitrary breakpoints unless genuinely required.

The design should respond to available space.

Not specific device model names.

---

# 72. Required Responsive Ranges

At minimum validate representative widths around:

```text
Small Mobile

Large Mobile

Tablet

Laptop

Desktop

Wide Desktop
```

Exact viewport fixtures should be defined in the test system.

---

# 73. Minimum Width Test

The interface should remain usable at approximately:

```text
320px width
```

unless a specific feature has a justified minimum.

No core public page should require horizontal page scrolling.

---

# 74. Wide Screen Test

Very wide screens should not produce:

```text
Extremely long text lines

Huge empty gaps

Overstretched cards
```

Use max-width containers appropriately.

---

# 75. Question Page Responsive Behavior

Desktop may support:

```text
Reading Column
+
Contextual Side Region
```

Mobile should prioritize:

```text
Question

Answer

Primary Navigation

Secondary Context
```

Do not preserve a desktop sidebar by shrinking the answer into an unreadable column.

---

# 76. Module Page Responsive Behavior

Desktop may use:

```text
Structured List

Optional Contextual Navigation
```

Mobile should preserve:

```text
Readable Question Titles

Clear Progress

Comfortable Touch Targets
```

Avoid dense miniature cards.

---

# 77. Navigation Responsive Behavior

Desktop and mobile navigation may differ structurally.

Mobile navigation should not be:

```text
Desktop navigation squeezed smaller
```

It should have its own intentional interaction model.

---

# 78. Bottom Navigation Caution

A mobile bottom navigation should exist only if the authenticated product truly has a small number of persistent top-level destinations.

Do not add one merely because mobile applications commonly use it.

Public reading pages may not need persistent bottom navigation.

---

# 79. Sticky Element Testing

Sticky elements can fail on:

```text
Small Screens

Short Viewports

Mobile Browsers

Zoomed Interfaces
```

Test:

```text
Sticky Header

Sticky Sidebar

Sticky Actions
```

carefully.

---

# 80. Mobile Browser Viewport

Account for dynamic browser chrome where relevant.

Avoid relying blindly on:

```text
100vh
```

for critical layouts.

Use modern viewport units where supported and appropriate.

---

# 81. Safe Areas

If controls sit near mobile screen edges:

Consider safe-area insets where relevant.

Do not allow important controls to collide with device interface areas.

---

# 82. Orientation

Core public pages should remain usable in:

```text
Portrait

Landscape
```

where practical.

Do not optimize only for portrait mobile.

---

# 83. Content Overflow

Test:

```text
Long Question Titles

Long URLs

Long Code Lines

Long Company Names

Large Numbers

Unbroken Strings
```

The layout should degrade gracefully.

---

# 84. Internationalization Resilience

Even before full localization:

Avoid layouts that assume every label is short.

Future languages may require more space.

Do not hardcode extremely narrow label containers unnecessarily.

---

# 85. Visual Quality Standards

The V2 design system should produce:

```text
Consistent Spacing

Consistent Typography

Consistent Radius

Consistent Borders

Consistent Interactive States

Consistent Content Width
```

Visual quality comes primarily from consistency.

Not decoration.

---

# 86. Visual Density Review

Every major page should be reviewed for:

```text
Too many borders

Too many cards

Too many badges

Too many colors

Too many simultaneous actions

Insufficient whitespace

Weak hierarchy
```

This directly addresses the V1 density problem.

---

# 87. Card Usage Review

Before release, ask:

```text
Does this region need a card?
```

A card should provide meaningful grouping.

Not every piece of content requires:

```text
Border
+
Background
+
Shadow
+
Radius
```

---

# 88. Typography Review

Check:

```text
H1 dominance

H2 hierarchy

Body readability

Muted text contrast

Code typography

Metadata hierarchy
```

The page should remain understandable even if decorative color is removed.

---

# 89. Light and Dark Mode Parity

If both themes are supported:

Both are production experiences.

Do not treat dark mode as:

```text
Invert colors and hope
```

Validate every major archetype independently.

---

# 90. Theme Regression

Visual regression testing should include both themes for critical pages where feasible.

At minimum:

```text
Homepage

Question Page

Module Page

Dashboard
```

---

# 91. Loading State Quality

Every asynchronous region should define:

```text
Initial

Loading

Success

Empty

Error
```

where applicable.

Do not assume success-only behavior.

---

# 92. Loading State Principle

Loading UI should answer:

```text
What is happening?
```

without creating unnecessary anxiety or visual noise.

For short operations:

A large loading experience may not be necessary.

---

# 93. Empty States

An empty state should explain:

```text
What is empty?

Why might it be empty?

What can the user do next?
```

Examples:

```text
No Search Results

No Bookmarks

No Progress Yet

No Applications
```

---

# 94. Error States

Error states should distinguish:

```text
Retryable Failure

Permanent Missing Content

Authentication Requirement

Permission Failure

Unexpected Failure
```

Do not use the same generic message for everything.

---

# 95. Retry Behavior

If an operation can reasonably be retried:

Provide a clear retry path.

Avoid infinite automatic retry loops.

---

# 96. Offline / Network Failure

Future authenticated interactive features should degrade appropriately during network failure.

Do not claim an action succeeded before the server confirms it.

---

# 97. Optimistic UI

Use optimistic updates only when:

```text
Failure is uncommon

Rollback is understandable

The action is low risk
```

Potential:

```text
Bookmark
```

Less suitable without careful design:

```text
Payment

Destructive Data Operation
```

---

# 98. Error Logging

Unexpected user-facing failures should produce enough internal diagnostic information to investigate.

User messages should remain simple.

Logs may remain detailed.

---

# 99. Browser Support Philosophy

Support should follow actual user needs and modern web standards.

At minimum test current major versions of:

```text
Chrome

Safari

Firefox

Edge
```

Mobile testing should include:

```text
iOS Safari

Android Chrome
```

---

# 100. Browser Compatibility

Do not assume behavior tested in Chromium works identically in Safari.

Particularly test:

```text
Sticky Positioning

Viewport Units

Forms

Focus

Scrolling

Backdrop Effects

Font Rendering
```

---

# 101. Progressive Enhancement

Core public content should remain usable even if optional JavaScript enhancement fails.

This is especially important for:

```text
Question Pages

Module Pages

Track Pages
```

---

# 102. JavaScript Failure Test

Periodically inspect a public content page with JavaScript disabled or heavily restricted.

The exact experience may not be fully interactive.

But core content and navigation should remain reasonably available where architecture permits.

---

# 103. Console Quality

Production pages should not continuously emit:

```text
Errors

Hydration Warnings

Missing Key Warnings

Deprecated API Warnings
```

Console noise hides real problems.

---

# 104. Hydration Integrity

Server and client rendering should not produce mismatched content.

Common causes:

```text
Random Values

Date Formatting Differences

Browser-Only State During Initial Render

Theme Mismatch

Invalid HTML Nesting
```

Hydration warnings should be investigated.

---

# 105. HTML Validation

Major page archetypes should avoid invalid semantic nesting.

Examples:

```text
Interactive element inside incompatible interactive element

Invalid heading structure

Duplicate IDs
```

---

# 106. Link Quality

Internal links should be checked for:

```text
Broken Destinations

Redirect Chains

Incorrect Canonicals

Accidental External Navigation

Missing Accessible Names
```

---

# 107. Broken Link Testing

Automated link validation should eventually cover:

```text
Core Navigation

Sitemap URLs

Internal Content Links

Canonical Destinations
```

Do not crawl uncontrolled external websites during normal CI.

---

# 108. Visual Regression Testing

Visual regression helps detect:

```text
Spacing Changes

Missing Styles

Broken Responsive Layout

Theme Regressions

Unexpected Component Changes
```

It should focus on important representative pages.

---

# 109. Screenshot Baselines

Potential baseline set:

```text
Homepage — Desktop

Homepage — Mobile

Question — Desktop

Question — Mobile

Module — Desktop

Module — Mobile

Dashboard — Desktop

Dashboard — Mobile
```

Add additional archetypes as they stabilize.

---

# 110. Visual Regression Philosophy

Not every pixel difference is a failure.

The system should help identify unexpected changes.

Human review remains necessary for intentional redesign.

---

# 111. Screenshot Stability

Avoid visual tests that change constantly because of:

```text
Random Content

Current Time

Unstable Ads

Uncontrolled Animations
```

Use stable fixtures where possible.

---

# 112. Functional Testing

Critical functionality should be tested according to user risk.

Examples:

```text
Navigation Works

Search Returns Results

Question Opens

Authentication Works

Progress Saves

Bookmark Saves
```

Future:

```text
Mock Interview Session Persists

Resume Upload Processes

Application Status Updates
```

---

# 113. Smoke Test Suite

Every production deployment should have a fast smoke test.

Potential checks:

```text
Homepage returns successfully

Representative question opens

Representative module opens

Search page opens

Login page opens

Sitemap is available

Robots file is available
```

---

# 114. SEO Regression Testing

Quality testing must include SEO.

Validate:

```text
Title

Description

Canonical

Robots

H1

Status Code

Structured Data where applicable

Internal Links

Sitemap Inclusion
```

A UI redesign must not silently break indexing.

---

# 115. Indexability Contract Test

For every representative indexable page:

```text
Status = 200

Canonical = valid

Robots = indexable

H1 = present

Primary content = server-visible

Sitemap policy = correct
```

---

# 116. Noindex Contract Test

For pages intentionally excluded:

```text
Robots = noindex
```

and:

```text
Not included in sitemap
```

where appropriate.

---

# 117. Sitemap Validation

Test:

```text
Valid XML

Canonical URLs

No obvious 404 URLs

No noindex URLs

No duplicate URL forms

Production origin only
```

---

# 118. Robots Validation

Validate production separately from:

```text
Development

Preview

Staging
```

A staging protection rule must not accidentally reach production.

---

# 119. Structured Data Validation

Where structured data is used:

Validate:

```text
Syntax

Required Properties

Visible Content Alignment

Correct Page Type
```

Do not create schema markup merely to pass a validator.

---

# 120. Content Integrity Testing

During V2 migration, verify:

```text
Question Count

Answer Presence

Module Relationships

Track Relationships

Canonical Slugs

Previous / Next Navigation
```

UI migration must not silently lose content.

---

# 121. Data Quality Testing

Potential automated checks:

```text
Duplicate Slugs

Missing Parent

Missing Answer

Invalid Status

Broken Relationship

Invalid Canonical Override
```

These complement application tests.

---

# 122. Release Environment Validation

Before production release:

Test the production build.

Not only:

```text
Local development mode
```

Production behavior may differ in:

```text
Rendering

Caching

Minification

Environment Variables

Routing

Metadata
```

---

# 123. Preview Deployment Review

If preview deployments are available:

Use them for:

```text
Responsive Review

Cross-Browser Review

Stakeholder Review

SEO Safety Check

Visual Regression
```

Preview environments must remain protected from indexing.

---

# 124. Device Testing Strategy

Emulators are useful.

Real devices remain important.

At minimum periodically test:

```text
One modern iPhone

One representative Android device

One laptop

One desktop-size viewport
```

Use available devices pragmatically.

---

# 125. Network Testing

Test critical experiences under:

```text
Fast Network

Moderate Mobile Network

Temporary Failure
```

The product should not assume perfect connectivity.

---

# 126. Accessibility Release Gate

A major page should not ship with known critical accessibility failures such as:

```text
Keyboard Trap

Unreachable Navigation

Missing Form Labels

Invisible Focus

Severe Contrast Failure

Unusable Dialog

Broken Heading Structure
```

---

# 127. Performance Release Gate

A major page should not ship with unexplained severe regressions in:

```text
Core Web Vitals

JavaScript Weight

Layout Stability

Primary Content Rendering
```

Exceptions require explicit documentation.

---

# 128. Functional Release Gate

Critical user journeys must work.

A release should be blocked if:

```text
Core navigation is broken

Question content cannot load

Search is unusable

Authentication is broken

Public pages return incorrect status codes
```

---

# 129. SEO Release Gate

A public-page migration should be blocked if it causes:

```text
Canonical loss

Accidental noindex

Sitemap removal

Broken public URL

Client-only primary content

Incorrect status code
```

unless intentionally planned.

---

# 130. Visual Release Gate

A page should not ship if:

```text
Mobile layout visibly breaks

Text overlaps

Content is clipped

Dark mode becomes unreadable

Important actions disappear

Horizontal page scrolling appears unexpectedly
```

---

# 131. Release Severity Levels

Potential:

```text
BLOCKER

CRITICAL

MAJOR

MINOR
```

Example:

```text
BLOCKER
Production homepage unavailable

CRITICAL
Question pages accidentally noindex

MAJOR
Mobile sidebar overlaps content

MINOR
Small spacing inconsistency
```

Not every minor defect should block the entire release.

---

# 132. Quality Exception Process

If a known issue ships:

Record:

```text
Issue

Severity

Reason for Exception

Affected Pages

Owner

Planned Resolution
```

Do not normalize silent known regressions.

---

# 133. Definition of Done for a Page Archetype

A migrated page archetype is not complete when:

```text
The JSX is finished.
```

It is complete when:

```text
[ ] Visual design matches V2 principles

[ ] Light mode works

[ ] Dark mode works if supported

[ ] Mobile works

[ ] Tablet works

[ ] Desktop works

[ ] Keyboard navigation works

[ ] Focus is visible

[ ] Semantic structure is valid

[ ] Loading state works

[ ] Empty state works where applicable

[ ] Error state works

[ ] SEO metadata works

[ ] Canonical is correct

[ ] Status codes are correct

[ ] Primary content is server-visible

[ ] No serious console errors exist

[ ] Performance is within acceptable range

[ ] Accessibility audit has no known critical issue

[ ] Representative tests pass
```

---

# 134. Quality Automation in CI

As the repository matures, CI may include:

```text
Type Check

Lint

Unit Tests

Content Validation

Build

Selected Accessibility Checks

Selected SEO Contract Tests

Selected E2E Tests
```

Do not make CI unnecessarily slow by running every possible test for every tiny change.

---

# 135. Test Pyramid Principle

Use many:

```text
Fast focused tests
```

and fewer:

```text
Slow full-browser tests
```

E2E tests should protect important journeys.

Not duplicate every unit test.

---

# 136. CI Failure Philosophy

A failing test should provide actionable information.

Avoid a test suite that:

```text
Fails randomly

Produces huge unreadable logs

Is routinely ignored
```

Untrusted tests are almost equivalent to no tests.

---

# 137. Flaky Test Rule

Flaky tests should be:

```text
Investigated

Fixed

Temporarily quarantined with visibility
```

not repeatedly rerun until they pass.

---

# 138. Quality Ownership

Quality is shared.

Design owns:

```text
Visual and interaction intent
```

Engineering owns:

```text
Implementation integrity
```

Content owns:

```text
Content correctness and readability
```

SEO owns:

```text
Search integrity
```

But the final product crosses all of these boundaries.

---

# 139. AI Coding Agent Quality Rules

Before declaring a task complete, an AI coding agent must validate the relevant quality dimensions.

At minimum:

```text
Build / Type Check

Lint where configured

Relevant Tests

Responsive Inspection

Console Errors

SEO Impact

Accessibility Basics
```

The exact commands must come from the repository.

Do not invent commands without inspecting the project.

---

# 140. AI Agent Screenshot Rule

For visual tasks:

The agent should inspect the actual rendered result where tooling permits.

Do not assume:

```text
Code looks correct
```

therefore:

```text
UI looks correct
```

Visual implementation requires visual verification.

---

# 141. AI Agent Responsive Rule

For significant UI changes:

Inspect at least:

```text
Mobile

Desktop
```

and preferably an intermediate width.

Do not implement only at one viewport.

---

# 142. AI Agent Accessibility Rule

The agent must not:

```text
Remove focus outlines

Create clickable divs unnecessarily

Use icon-only controls without labels

Break heading hierarchy for styling

Use color as the only state signal
```

---

# 143. AI Agent Performance Rule

The agent must not solve small UI requirements by:

```text
Making an entire page client-side

Adding a large dependency

Loading heavy assets globally

Introducing unnecessary third-party scripts
```

without justification.

---

# 144. AI Agent SEO Quality Rule

When modifying a public route:

The agent must check:

```text
URL

Status

Canonical

Metadata

Robots

Server-rendered content

Internal links
```

The task is not complete if the page merely renders visually.

---

# 145. AI Agent No-Fake-Quality Rule

The agent must not claim:

```text
100 Lighthouse

Fully Accessible

SEO Perfect

Pixel Perfect
```

without actual validation.

Report what was tested.

Separate:

```text
Verified

Inferred

Not Yet Tested
```

---

# 146. Quality Reporting Format

After a major migration task, report:

```text
Implemented

Validated

Known Issues

Not Tested

Performance Impact

SEO Impact

Accessibility Impact
```

This prevents false confidence.

---

# 147. V2 Quality Review Cadence

Quality review should happen:

```text
During Foundation Work

After Each Page Archetype

Before Major Release

After Production Deployment

After Significant Traffic Growth
```

Do not wait until the entire V2 project is finished.

---

# 148. Production Monitoring

After deployment, monitor:

```text
Error Rate

Core Web Vitals

Traffic Changes

Search Console

Indexing

404s

User Feedback
```

A release is not fully validated merely because deployment succeeded.

---

# 149. Search Performance Monitoring

After V2 public-page changes:

Watch:

```text
Impressions

Clicks

CTR

Average Position

Indexed Pages

Crawl Issues
```

Do not react emotionally to one day of data.

Search changes require time and trend analysis.

---

# 150. Performance Monitoring After Ads

If ads are introduced later:

Compare:

```text
Before Ads

After Ads
```

for:

```text
LCP

CLS

INP

Bounce / Engagement

Reading Experience
```

Revenue should not be evaluated independently of product degradation.

---

# 151. Quality Debt

Quality debt includes:

```text
Known Accessibility Failures

Performance Regressions

Broken Responsive Edge Cases

Flaky Tests

Console Warnings

Temporary Compatibility Code

Unverified SEO Changes
```

Track meaningful debt.

Do not create an endless backlog of microscopic imperfections.

---

# 152. Quality Priority

Fix first:

```text
User-blocking problems

SEO-breaking problems

Accessibility blockers

Major mobile failures

Severe performance regressions

Data loss risks
```

Then:

```text
Polish

Micro-spacing

Minor animation details
```

---

# 153. V2 Quality Dashboard Future

A future internal quality dashboard may combine:

```text
Core Web Vitals

Error Rate

Indexed Pages

Broken Links

Accessibility Checks

Build Health

Content Validation
```

This is useful later.

Do not build it before the product requires it.

---

# 154. Performance Checklist

Before major release:

```text
[ ] Production build tested

[ ] Representative pages measured

[ ] Primary content appears quickly

[ ] No unnecessary client rendering introduced

[ ] No major JavaScript regression

[ ] Images are appropriately sized

[ ] Fonts are controlled

[ ] Layout shift is acceptable

[ ] Third-party scripts are justified

[ ] Long pages scroll smoothly

[ ] Mobile performance reviewed
```

---

# 155. Accessibility Checklist

Before major release:

```text
[ ] Semantic landmarks exist

[ ] Heading hierarchy is logical

[ ] Keyboard navigation works

[ ] Focus is visible

[ ] No keyboard traps exist

[ ] Forms have labels

[ ] Errors are understandable

[ ] Icon-only buttons have accessible names

[ ] Contrast is acceptable

[ ] Color is not the only signal

[ ] Reduced motion is respected

[ ] Dialog focus works

[ ] Mobile navigation is keyboard accessible

[ ] Code blocks remain usable

[ ] Major automated accessibility violations are resolved
```

---

# 156. Responsive Checklist

Before major release:

```text
[ ] Small mobile tested

[ ] Large mobile tested

[ ] Tablet tested

[ ] Laptop tested

[ ] Desktop tested

[ ] Wide screen reviewed

[ ] No unexpected horizontal page scroll

[ ] Long titles tested

[ ] Long code tested

[ ] Sticky elements tested

[ ] Navigation tested

[ ] Touch targets are usable
```

---

# 157. Functional Checklist

Before major release:

```text
[ ] Core navigation works

[ ] Search works

[ ] Representative question opens

[ ] Representative module opens

[ ] Representative track opens

[ ] Authentication works where relevant

[ ] User state works where relevant

[ ] 404 behavior works

[ ] Error behavior works

[ ] No serious console errors remain
```

---

# 158. SEO Quality Checklist

Before public-page release:

```text
[ ] Correct status code

[ ] Correct canonical

[ ] Correct robots directive

[ ] Correct title

[ ] Correct description

[ ] One meaningful H1

[ ] Primary content server-visible

[ ] Internal links preserved

[ ] Sitemap behavior correct

[ ] Structured data valid where used

[ ] Old URLs redirected where required
```

---

# 159. V2 Quality Definition of Done

The V2 quality foundation is established when:

```text
[ ] Performance targets are documented

[ ] Representative page benchmarks exist

[ ] Public pages follow server-first rendering

[ ] Client JavaScript is controlled

[ ] Core Web Vitals are monitored

[ ] Accessibility targets WCAG 2.2 AA

[ ] Keyboard behavior is tested

[ ] Focus standards exist

[ ] Semantic HTML standards exist

[ ] Responsive archetype behavior is defined

[ ] Mobile and desktop are both validated

[ ] Light and dark themes are reviewed

[ ] Loading, empty, and error states are defined

[ ] Browser coverage is defined

[ ] Visual regression strategy exists

[ ] Functional smoke tests exist

[ ] SEO contract tests exist

[ ] Content integrity is validated during migration

[ ] Production builds are tested before release

[ ] Release blockers are defined

[ ] AI agents have explicit quality validation rules
```

---

# 160. Final Quality Principle

Interview Explainer V2 should not be judged by:

```text
How many gradients were added

How many animations were added

How many cards were redesigned

How modern one screenshot looks
```

It should be judged by:

```text
How quickly users reach useful content

How comfortably they can read it

How easily they can navigate it

How reliably it works

How well it adapts to their device

How accessible the experience is

How stable the page feels

How safely the product can continue evolving
```

The permanent quality principles are:

> **Performance is a feature.**

> **Accessibility is a product requirement.**

> **Mobile is not a compressed desktop layout.**

> **Public content should remain server-first.**

> **JavaScript is a cost and should be justified.**

> **Primary content must not wait for secondary enhancements.**

> **Layout stability matters during reading.**

> **Typography quality matters as much as visual decoration.**

> **Dark mode requires independent validation.**

> **Every interactive element must work without a mouse.**

> **Focus must remain visible.**

> **Semantic HTML is infrastructure.**

> **Loading states should preserve layout.**

> **Errors should fail at the smallest appropriate boundary.**

> **A successful build does not prove a successful interface.**

> **A good screenshot does not prove a good product.**

> **A high Lighthouse score does not prove complete quality.**

> **Automated accessibility testing does not replace manual interaction testing.**

> **SEO must be regression-tested during UI migration.**

> **Quality must be verified, not claimed.**

> **Every major page archetype requires its own definition of done.**

> **V2 should become harder to accidentally break than V1.**

The desired outcome is not merely a more attractive Interview Explainer.

The desired outcome is:

```text
A calm interface
+
A fast website
+
A readable knowledge product
+
An accessible experience
+
A stable technical foundation
+
A measurable release standard
```

That is what allows Interview Explainer V2 to move from an early launched product into a credible, scalable platform.
