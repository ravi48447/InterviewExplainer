# Interview Explainer V2 — Testing, Migration & Release Strategy

**Document:** `15_TESTING_MIGRATION_RELEASE_STRATEGY.md`
**Status:** Foundational / Execution Safety Standard
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md` through `14_SECURITY_PRIVACY_AUTHENTICATION.md`
**Purpose:** Define how Interview Explainer is tested, migrated, validated, deployed, monitored, and rolled back while evolving from the current live V1 product into V2 without unnecessarily losing URLs, search visibility, indexed pages, content, user data, production stability, or the ability to recover from failure.

---

# 1. Purpose of This Document

Interview Explainer already exists as a live product.

Therefore V2 is not:

```text
Build something new
↓
Delete the old website
↓
Replace everything
```

The correct model is:

```text
Understand V1
↓
Define V2 target
↓
Preserve valuable contracts
↓
Change architecture safely
↓
Validate continuously
↓
Release incrementally
↓
Measure real production behavior
```

The migration must protect:

```text
Public URLs

SEO Signals

Indexed Pages

Canonical Structure

Content

User Data

Authentication

Analytics

Performance

Production Availability
```

---

# 2. Core Migration Principle

The fundamental rule is:

> **Change the implementation without unnecessarily changing the public contract.**

For example:

```text
V1 URL

/java/hashmap-interview-question
```

may continue to exist in V2 even if:

```text
Component Architecture

Design System

Database

Rendering Strategy

Internal Routing Logic
```

changes completely.

---

# 3. V2 Is an Evolution, Not a Reset

The existing production site already has:

```text
Search Engine Discovery

External URLs

Potential Backlinks

Search Console History

Analytics History

Existing Content

User Expectations
```

Therefore:

```text
Delete Everything and Relaunch
```

is not the default strategy.

---

# 4. Migration Priorities

The priority order is:

```text
1. Preserve Data

2. Preserve Important URLs

3. Preserve Search Accessibility

4. Preserve Core Functionality

5. Improve Architecture

6. Improve UX

7. Improve Performance

8. Add New Features
```

A beautiful V2 that destroys search visibility is not a successful migration.

---

# 5. Migration Risk Categories

Migration risks include:

```text
SEO Risk

Data Risk

Functional Risk

Authentication Risk

Performance Risk

Visual Regression Risk

Infrastructure Risk

Analytics Risk

Security Risk
```

Each release should consider all relevant categories.

---

# 6. Risk Classification

Use:

```text
LOW RISK

MEDIUM RISK

HIGH RISK

CRITICAL RISK
```

Examples:

```text
LOW
Button spacing adjustment

MEDIUM
Question page layout redesign

HIGH
Routing architecture change

HIGH
Database schema migration

CRITICAL
Authentication migration

CRITICAL
Mass URL restructuring
```

Higher-risk changes require stronger validation.

---

# 7. Migration Inventory

Before changing major architecture, create an inventory of the current production system.

The inventory should include:

```text
Routes

Page Types

Dynamic Route Patterns

Sitemaps

robots.txt

Canonical Rules

Redirects

Metadata

Structured Data

Content Sources

Database Models

Authentication

Analytics

APIs

Environment Variables

External Services
```

Do not migrate what has not been understood.

---

# 8. Route Inventory

Create a machine-readable list of current public routes where practical.

Categories may include:

```text
Homepage

Technology Hubs

Track Pages

Module Pages

Question Pages

Company Pages

Role Pages

Pricing

Authentication

Dashboard

Legal Pages
```

---

# 9. Dynamic Route Inventory

Dynamic routes require special attention.

Examples:

```text
/[technology]

/[technology]/[module]

/[technology]/[module]/[question]
```

The exact current repository structure must be inspected.

Do not assume route patterns from documentation alone.

---

# 10. Production URL Baseline

Before V2 release:

Capture representative production URLs.

Potential groups:

```text
Top Traffic Pages

Top Search Impression Pages

Top Search Click Pages

Recently Indexed Pages

Deep Question Pages

Hub Pages

Authentication Pages
```

These become migration test fixtures.

---

# 11. SEO URL Preservation

If a V1 URL is:

```text
Valid

Canonical

Indexed

Receiving Impressions

Receiving Clicks

Externally Linked
```

preserve it unless there is a strong reason to change it.

---

# 12. URL Change Decision

Before changing a URL:

Ask:

```text
Is the current URL technically harmful?

Is the new structure materially better?

Can the old URL redirect exactly?

Will internal links be updated?

Will canonical tags be correct?

Will the sitemap be updated?

Is the migration worth the SEO risk?
```

If the answer is unclear:

Preserve the existing URL.

---

# 13. Redirect Strategy

When URLs must change:

Use:

```text
Old URL
↓
Single Permanent Redirect
↓
Exact New Equivalent
```

Avoid:

```text
Old URL
↓
Homepage
```

unless no relevant replacement exists.

---

# 14. Redirect Chains

Avoid:

```text
A
→ B
→ C
→ D
```

Prefer:

```text
A
→ D
```

Update historical redirect rules where practical.

---

# 15. Redirect Loops

Test automatically for:

```text
A → B → A
```

Redirect loops can make pages inaccessible to both:

```text
Users

Search Engines
```

---

# 16. Redirect Map

Maintain a redirect map for intentional URL changes.

Example:

```text
OLD URL
NEW URL
REASON
STATUS
```

This becomes part of migration documentation.

---

# 17. Canonical Preservation

Every indexable page should maintain the correct canonical behavior after migration.

Test:

```text
Self-Canonical Pages

Duplicate Variants

Query Parameters

Trailing Slash Variants

Protocol Variants

Host Variants
```

---

# 18. Host Consistency

Choose one canonical host.

For example:

```text
https://www.interviewexplainer.com
```

or:

```text
https://interviewexplainer.com
```

The existing production decision should be inspected and preserved or migrated deliberately.

Do not allow accidental duplicate hosts.

---

# 19. HTTP to HTTPS

Ensure:

```text
HTTP
→
HTTPS
```

through a clean redirect.

---

# 20. Sitemap Migration

Before release:

Validate:

```text
Sitemap URLs exist

URLs return successful status

URLs are canonical

URLs are indexable

No unnecessary redirects exist

No noindex URLs are included
```

---

# 21. Sitemap Comparison

Compare:

```text
V1 Sitemap URL Set

vs

V2 Sitemap URL Set
```

Unexpected large removals require investigation.

---

# 22. robots.txt Migration

Verify production:

```text
robots.txt
```

does not accidentally contain:

```text
Disallow: /
```

or block important content sections.

---

# 23. Preview Environment Indexing

Preview and staging environments should not compete with production in search.

Use appropriate controls.

But:

Do not accidentally copy staging restrictions into production.

---

# 24. Metadata Preservation

For important existing pages:

Compare:

```text
Title

Description

Canonical

Robots

Open Graph

Structured Data
```

before and after migration.

---

# 25. Structured Data Migration

If structured data exists:

Validate:

```text
Schema Type

Required Properties

Page Relevance

No Invalid Duplicates
```

Do not preserve broken structured data merely because it existed in V1.

---

# 26. Content Preservation

V2 UI work must not accidentally:

```text
Drop Questions

Truncate Answers

Lose Code Examples

Remove Metadata

Break Internal Links
```

Content migration requires explicit validation.

---

# 27. Content Count Baseline

Before major migration:

Record counts such as:

```text
Technologies

Tracks

Modules

Questions

Companies

Roles
```

After migration:

Compare counts.

Unexpected differences require explanation.

---

# 28. Content Identity

Where possible:

Preserve stable identifiers for existing content.

Avoid regenerating all IDs merely because architecture changes.

Stable IDs support:

```text
Progress

Bookmarks

Analytics

Internal References
```

---

# 29. Slug Stability

Do not regenerate slugs automatically without understanding consequences.

A title change should not necessarily change the public URL.

---

# 30. Content Migration Validation

Validate:

```text
No missing records

No duplicate records

No broken parent relationships

No orphaned questions

No empty required fields

No unexpected slug changes
```

---

# 31. Database Migration Philosophy

Database migrations should be:

```text
Explicit

Versioned

Reviewable

Repeatable

Recoverable
```

Avoid manual production database editing as the normal deployment process.

---

# 32. Schema Migration

Typical safe sequence:

```text
Add New Structure

↓

Deploy Compatible Application

↓

Migrate / Backfill Data

↓

Validate

↓

Switch Read Path

↓

Switch Write Path

↓

Remove Old Structure Later
```

This is safer than:

```text
Delete Old Column

↓

Deploy New Code

↓

Hope Everything Works
```

---

# 33. Expand and Contract Pattern

For risky schema changes:

Use:

```text
EXPAND

Add new fields or tables
without breaking old code


MIGRATE

Populate and validate data


SWITCH

Move application behavior


CONTRACT

Remove obsolete structures later
```

---

# 34. Destructive Database Changes

Destructive operations include:

```text
DROP TABLE

DROP COLUMN

Mass Delete

Data Type Narrowing

Unique Constraint Addition
```

These require careful review.

---

# 35. Backup Before High-Risk Migration

Before destructive production migration:

Ensure a usable recovery path exists.

Potential:

```text
Database Backup

Snapshot

Export

Provider Recovery Mechanism
```

The exact method depends on infrastructure.

---

# 36. Backup Is Not Rollback

A backup may restore data.

It may not instantly restore:

```text
Application Version

DNS

Environment Configuration

Authentication Provider State
```

Recovery planning must consider the whole system.

---

# 37. Migration Idempotency

Where practical:

Migration scripts should safely handle:

```text
Retry

Partial Execution

Already Migrated Records
```

Avoid scripts that duplicate data on rerun.

---

# 38. Migration Logging

High-risk migrations should report:

```text
Records Read

Records Changed

Records Skipped

Errors

Duration
```

This helps validate production execution.

---

# 39. Dry Runs

Where practical:

Support:

```text
Dry Run
```

for data transformations.

A dry run should report intended changes without modifying production data.

---

# 40. Test Data

Tests should use:

```text
Synthetic Data

Fixtures

Factories

Controlled Test Accounts
```

Avoid depending on production data for normal automated testing.

---

# 41. Testing Pyramid

V2 should use multiple testing layers:

```text
Static Validation

Unit Tests

Component Tests

Integration Tests

End-to-End Tests

Production Smoke Tests
```

Not every feature requires the same amount of every layer.

---

# 42. Static Validation

Run:

```text
Type Checking

Linting

Formatting Validation

Build Validation
```

These catch many defects cheaply.

---

# 43. Unit Tests

Use unit tests for isolated logic such as:

```text
Slug Generation

URL Helpers

Content Transformation

Permission Logic

Validation Functions

SEO Metadata Builders
```

Do not unit-test trivial framework behavior.

---

# 44. Component Tests

Useful for:

```text
Question Cards

Navigation

Search UI

Forms

Progress Components

Error States
```

Focus on behavior.

Not implementation details.

---

# 45. Integration Tests

Use for interactions between:

```text
API + Database

Authentication + Authorization

Search + Content

Progress + User

Upload + Storage
```

---

# 46. End-to-End Tests

E2E tests should cover critical user journeys.

Potential:

```text
Homepage
→ Technology
→ Module
→ Question

Google Landing Simulation
→ Question
→ Related Question

Search
→ Result
→ Question

Signup
→ Login
→ Progress

Admin Login
→ Authorized Action
```

Only test journeys that actually exist.

---

# 47. Critical Path Tests

At minimum, protect:

```text
Homepage Loads

Question Page Loads

Navigation Works

Search Works

Authentication Works

Private Data Is Protected

Sitemap Loads

robots.txt Loads
```

---

# 48. SEO Regression Tests

Automate checks for representative pages.

Validate:

```text
Status Code

Canonical

Title

Meta Description

Robots

Heading Structure

Structured Data

Internal Links
```

---

# 49. URL Regression Tests

Maintain a fixture of important URLs.

For each:

Expect:

```text
200
```

or:

```text
Intentional Redirect
```

Never silently allow large groups of URLs to become 404.

---

# 50. Sitemap Regression Test

Validate:

```text
Sitemap Generates Successfully

URLs Are Valid

No Duplicate Canonical URLs

No Obvious Non-Indexable URLs
```

---

# 51. robots.txt Regression Test

Production build validation should verify expected crawler policy.

A production release should never accidentally inherit:

```text
Disallow: /
```

from a development environment.

---

# 52. Internal Link Testing

Crawl representative sections and detect:

```text
Broken Links

Redirecting Internal Links

Orphan Pages

Malformed URLs
```

---

# 53. Visual Regression

V2 is a major visual redesign.

Test representative pages at:

```text
Desktop

Tablet

Mobile
```

Focus on:

```text
Layout

Overflow

Navigation

Typography

Dark Mode

Light Mode

Code Blocks

Long Answers
```

---

# 54. Screenshot Testing

Automated screenshot comparison may be useful for stable components.

However:

Do not create brittle screenshot tests for every pixel.

Use them where visual regression risk is meaningful.

---

# 55. Responsive Testing

Test realistic widths.

Examples:

```text
Small Mobile

Large Mobile

Tablet

Laptop

Desktop
```

Do not test only:

```text
1440px Desktop
```

---

# 56. Content Stress Testing

Question pages must handle:

```text
Very Short Answer

Very Long Answer

Large Code Block

Multiple Code Blocks

Long Heading

Long URL

Large Table

Many Sections
```

The layout must not assume ideal content length.

---

# 57. Accessibility Testing

Validate:

```text
Keyboard Navigation

Focus Visibility

Semantic Headings

Form Labels

Contrast

Screen Reader Basics

Reduced Motion where appropriate
```

Use both automated and manual checks.

---

# 58. Performance Testing

Before and after major changes:

Measure representative pages.

Track:

```text
LCP

INP

CLS

JavaScript Size

Image Weight

Request Count
```

---

# 59. Performance Baseline

Capture V1 performance before major V2 replacement.

Otherwise:

You cannot objectively know whether V2 improved or regressed.

---

# 60. Performance Budgets

Define practical budgets for:

```text
JavaScript

Images

Fonts

Third-Party Scripts
```

Budgets should reflect the actual stack and page type.

---

# 61. Search Performance Testing

Test:

```text
Common Query

Misspelled Query

No-Result Query

Long Query

Mobile Search

Keyboard Interaction
```

---

# 62. Authentication Testing

Test:

```text
Login

Logout

Session Persistence

Expired Session

Unauthorized Access

Authorized Access

Multiple Tabs
```

---

# 63. Authorization Testing

Critical rule:

```text
User A
cannot access
User B's private resource
```

Test directly at the API/server boundary.

---

# 64. Admin Testing

Test:

```text
Anonymous → denied

Normal User → denied

Admin → allowed
```

for administrative operations.

---

# 65. Security Regression Testing

Before production:

Review changes affecting:

```text
Authentication

Authorization

Secrets

Uploads

AI Endpoints

Admin

Payments
```

according to Document 14.

---

# 66. Analytics Regression Testing

V2 must not launch with broken measurement.

Validate:

```text
Pageviews

Question Views

Search Events

Signup Events

Environment Separation
```

Avoid duplicate events.

---

# 67. Analytics Baseline Continuity

If event names change:

Document the change.

Avoid silently making:

```text
Before V2
```

and:

```text
After V2
```

incomparable.

---

# 68. Error-State Testing

Test:

```text
404

500

Network Failure

Empty Search

Missing Content

Authentication Failure

Rate Limit

AI Provider Failure
```

A production product is defined partly by how it fails.

---

# 69. Empty-State Testing

Test:

```text
No Progress

No Bookmarks

No Search Results

No Applications

No Mock Interviews
```

Do not allow empty states to appear broken.

---

# 70. Loading-State Testing

Verify:

```text
No Infinite Loading

No Major Layout Jump

Skeleton Matches Final Layout

Failure Eventually Surfaces
```

---

# 71. Browser Testing

Prioritize:

```text
Chrome

Safari

Mobile Safari

Android Chrome
```

and other browsers based on actual usage data.

Do not attempt equal manual testing of every historical browser.

---

# 72. Device Testing

Real-device testing is especially important for:

```text
Mobile Navigation

Touch Targets

Keyboard Behavior

Viewport Height

Safari Rendering
```

---

# 73. Production-Like Testing

Local success is insufficient.

Test the deployed environment because production may differ in:

```text
Environment Variables

CDN

Caching

Headers

Domains

Authentication Redirects

Database Connectivity
```

---

# 74. Preview Deployments

Where available:

Use preview deployments for:

```text
Visual Review

Functional Review

Stakeholder Review

Automated Tests
```

Ensure previews are not accidentally indexed.

---

# 75. Staging Decision

A dedicated staging environment is useful when:

```text
Production Complexity

Database Migrations

Authentication

Payments

Team Size
```

justify it.

Do not create expensive infrastructure merely for appearance.

---

# 76. Feature Flags

Feature flags may help release:

```text
New Dashboard

New Search

Mock Interviews

Premium Features
```

gradually.

Do not put every CSS change behind a feature flag.

---

# 77. Feature Flag Lifecycle

Every flag should eventually be:

```text
Enabled Permanently

or

Removed
```

Avoid permanent dead flags.

---

# 78. Dark Launch

A feature may be deployed without exposing it publicly.

Useful for:

```text
Backend Changes

Data Migration

New APIs

Search Index Preparation
```

---

# 79. Canary Release

For higher traffic later:

A new version may be exposed to a small percentage of traffic first.

This is optional for current scale.

Do not overengineer canary infrastructure prematurely.

---

# 80. Current V2 Release Recommendation

For the current Interview Explainer scale:

Prefer:

```text
Small Controlled Changes

↓

Preview Validation

↓

Automated Checks

↓

Production Deployment

↓

Immediate Smoke Test

↓

Monitoring
```

This is simpler and appropriate.

---

# 81. Migration by Vertical Slice

Avoid:

```text
Rewrite Entire Frontend

↓

Rewrite Entire Backend

↓

Rewrite Entire Database

↓

Launch Everything at Once
```

Prefer vertical slices.

Example:

```text
Design Foundation

↓

Global Shell

↓

Homepage

↓

Technology Hub

↓

Module

↓

Question Page

↓

Search

↓

Dashboard
```

---

# 82. Why Vertical Slices

A vertical slice can be:

```text
Implemented

Tested

Reviewed

Released
```

before the entire V2 is complete.

This reduces:

```text
Merge Risk

Context Loss

Regression Scope

Rollback Complexity
```

---

# 83. Foundation-First Rule

Some work must happen before page-by-page migration.

Examples:

```text
Design Tokens

Typography

Layout Containers

Navigation

SEO Utilities

Analytics Foundation

Testing Infrastructure
```

Build shared foundations first.

---

# 84. Avoid Premature Shared Abstraction

Do not build a giant generic component system before real page patterns are understood.

Recommended:

```text
Build Foundation

↓

Migrate Representative Pages

↓

Observe Repeated Patterns

↓

Extract Stable Components
```

---

# 85. Page Archetype Migration

Migrate by archetype.

Potential order:

```text
1. Global Shell

2. Homepage

3. Hub / Track

4. Module

5. Question

6. Search

7. Company / Role

8. Dashboard

9. Authentication

10. Utility Pages
```

The exact order should follow repository inspection.

---

# 86. Question Page Priority

Question pages are likely among the most important SEO and product surfaces.

They require strong validation for:

```text
Reading Experience

SEO

Content Preservation

Internal Linking

Mobile Layout

Performance
```

---

# 87. Representative Page Strategy

For each archetype:

Choose representative examples.

Example:

```text
Short Question

Long Question

Code-Heavy Question

Highly Nested Module

Large Technology Hub
```

Do not validate only one ideal page.

---

# 88. Component Migration

When replacing components:

Search the repository for all usages.

Do not assume:

```text
Component imported in one place
```

means:

```text
Component used in one place
```

---

# 89. Dead Code Removal

Remove old code only after:

```text
Replacement Works

References Are Gone

Tests Pass

Production Is Stable
```

Do not combine every migration with aggressive cleanup.

---

# 90. Cleanup Phase

After stable migration:

Perform targeted cleanup of:

```text
Old Components

Unused Styles

Dead Routes

Deprecated Utilities

Temporary Compatibility Code
```

---

# 91. Compatibility Layer

Temporary compatibility code is acceptable during migration.

Example:

```text
Old Data Shape
↓
Adapter
↓
New Component
```

But compatibility layers should be documented for later removal.

---

# 92. Big-Bang Rewrite Risk

A complete rewrite creates:

```text
Large Review Surface

Large Regression Surface

Difficult Rollback

Long-Lived Branches

Merge Conflicts

Context Loss
```

Avoid unless the existing system truly makes incremental migration impossible.

---

# 93. Long-Lived Branch Risk

A V2 branch that remains separate for months can diverge heavily from production.

Prefer:

```text
Small Mergeable Changes
```

where architecture allows.

---

# 94. Git Strategy

Use:

```text
Main Production Branch

Short-Lived Feature Branches

Focused Pull Requests

Clear Commits
```

The exact branch names depend on current repository conventions.

---

# 95. Commit Strategy

Commits should represent understandable units.

Good:

```text
Add V2 typography tokens

Migrate question page shell

Add SEO regression tests
```

Avoid:

```text
Massive V2 changes
```

containing unrelated work.

---

# 96. Commit Before Risk

Before high-risk refactoring:

Create a clean recoverable commit state.

This improves:

```text
Diff Review

Rollback

Debugging
```

---

# 97. Pull Request Scope

A PR should be small enough to understand.

Large foundational changes may still be substantial.

But unrelated:

```text
UI

Database

Authentication

SEO

Content Rewrite
```

should not be combined without necessity.

---

# 98. Review Checklist

Every meaningful PR should consider:

```text
Functionality

SEO

Accessibility

Performance

Security

Analytics

Responsive Behavior
```

Not every category requires extensive changes.

But every category should be considered.

---

# 99. Automated CI Gates

Before merge, ideally run:

```text
Install

Lint

Type Check

Tests

Build
```

Potentially:

```text
SEO Checks

E2E Smoke Tests
```

as infrastructure matures.

---

# 100. Build Must Pass

A known broken production build should never be merged intentionally merely because:

```text
We will fix it later.
```

---

# 101. Flaky Test Policy

Do not normalize:

```text
Just rerun until green.
```

A flaky test should be:

```text
Fixed

Rewritten

or Temporarily Quarantined with clear ownership
```

---

# 102. Pre-Release Checklist

Before production deployment:

```text
[ ] Build passes

[ ] Type checking passes

[ ] Critical tests pass

[ ] Representative pages reviewed

[ ] Mobile reviewed

[ ] Dark mode reviewed

[ ] Light mode reviewed

[ ] SEO metadata checked

[ ] Sitemap checked if affected

[ ] robots.txt checked if affected

[ ] Authentication checked if affected

[ ] Database migration reviewed if affected

[ ] Analytics checked if affected

[ ] Rollback path understood
```

---

# 103. Production Deployment

Deployment should be:

```text
Repeatable

Observable

Recoverable
```

Avoid undocumented manual production changes.

---

# 104. Deployment Record

For significant releases, record:

```text
Version / Commit

Deployment Time

Major Changes

Migration Performed

Known Risks
```

---

# 105. Post-Deployment Smoke Test

Immediately verify:

```text
Homepage

Representative Question

Representative Hub

Search

Authentication if relevant

Sitemap

robots.txt
```

---

# 106. Production Monitoring Window

After significant deployment:

Watch:

```text
Errors

Availability

Traffic

Performance

Authentication

Analytics
```

for unexpected changes.

---

# 107. Rollback Philosophy

Rollback should be considered before deployment.

Ask:

```text
If this fails,
how do we return to the previous working state?
```

---

# 108. Application Rollback

For code-only failure:

Rollback may mean:

```text
Redeploy Previous Known-Good Version
```

This is relatively simple.

---

# 109. Database Rollback Complexity

Database changes may not be safely reversible.

Therefore:

Prefer forward-compatible migration patterns.

Do not assume:

```text
git revert
```

reverts production data.

---

# 110. Roll-Forward Strategy

Sometimes safer than rollback:

```text
Deploy Fix Forward
```

especially after irreversible data migration.

The release plan should know which strategy applies.

---

# 111. Feature Disable Strategy

For risky optional features:

A feature flag or configuration switch may allow:

```text
Disable Feature

Without Rolling Back Entire Release
```

---

# 112. Emergency Rollback Trigger

Potential triggers:

```text
Major Site Outage

Authentication Failure

Private Data Exposure

Mass 404 Regression

Severe Performance Failure

Critical User Flow Broken
```

---

# 113. SEO Rollback Trigger

Investigate urgently if release causes:

```text
Large Important URL Set → 404

Accidental noindex

robots.txt block

Canonical corruption

Sitemap failure

Mass redirect loop
```

---

# 114. Search Ranking Fluctuation Is Not Automatic Rollback

Normal ranking volatility after changes does not automatically justify rollback.

First inspect:

```text
Technical SEO

Indexing

URLs

Content

Search Console
```

SEO effects may take time.

---

# 115. V1 Baseline Snapshot

Before major V2 rollout:

Capture:

```text
Production Route Inventory

Sitemap

Indexed Page Estimate

Search Console Baseline

Analytics Baseline

Performance Baseline

Content Counts

Representative Screenshots
```

---

# 116. V2 Release Baseline

At release:

Record:

```text
Release Date

Commit

URL Changes

Redirects

Major UI Changes

SEO Changes

Analytics Changes
```

This is essential for interpreting future metrics.

---

# 117. Search Console Monitoring

After release:

Monitor:

```text
Pages

Indexing

Sitemaps

Clicks

Impressions

Queries

Average Position
```

Do not react emotionally to one day of partial data.

---

# 118. Indexing Monitoring

Watch for:

```text
Unexpected Indexed Page Drop

Crawled but Not Indexed Increase

Duplicate Canonical Issues

Redirect Errors

404 Growth
```

---

# 119. Analytics Monitoring

Compare:

```text
Users

Sessions

Organic Traffic

Engagement

Question Views

Multi-Question Sessions
```

against the pre-release baseline.

---

# 120. Performance Monitoring

Compare V1 and V2:

```text
LCP

INP

CLS

Page Weight

JavaScript
```

V2 should not become slower merely because it looks more polished.

---

# 121. Error Monitoring

Compare:

```text
Before Release Error Rate

After Release Error Rate
```

Investigate new error signatures.

---

# 122. Release Observation Period

For major releases:

Avoid immediately layering another unrelated high-risk release before initial stability is understood.

---

# 123. Phased V2 Rollout

Recommended high-level sequence:

```text
PHASE 0
Repository Audit and Baseline

PHASE 1
Testing and Quality Foundation

PHASE 2
Design System Foundation

PHASE 3
Global Application Shell

PHASE 4
Public SEO Page Migration

PHASE 5
Search and Discovery

PHASE 6
Authenticated Product Surfaces

PHASE 7
Performance and Accessibility Hardening

PHASE 8
SEO Validation

PHASE 9
Cleanup and Consolidation
```

---

# 124. Phase 0 — Repository Audit

Before implementation:

Inspect:

```text
Current Architecture

Routes

Components

Styles

Data

SEO

Authentication

Analytics

Tests

Deployment
```

Deliver:

```text
Current-State Map

Risk Register

Migration Map
```

---

# 125. Phase 1 — Quality Foundation

Establish:

```text
Build Validation

Type Checking

Linting

Critical Tests

Representative URL Fixtures
```

Do not redesign the whole site before basic regression detection exists.

---

# 126. Phase 2 — Design Foundation

Implement:

```text
Tokens

Typography

Spacing

Colors

Surfaces

Buttons

Inputs

Cards

Theme
```

Validate:

```text
Light Mode

Dark Mode

Mobile
```

---

# 127. Phase 3 — Global Shell

Migrate:

```text
Header

Navigation

Sidebar

Search Entry

Main Container

Footer

Mobile Navigation
```

This creates the shared V2 experience.

---

# 128. Phase 4 — Public SEO Pages

Migrate public page archetypes carefully.

Priority:

```text
Question Pages

Module Pages

Track / Technology Hubs

Company / Role Pages
```

Preserve:

```text
URLs

Metadata

Content

Internal Links
```

---

# 129. Phase 5 — Search and Discovery

Improve:

```text
Global Search

Search Results

Related Questions

Next Question Navigation

Internal Discovery
```

Measure behavior.

---

# 130. Phase 6 — Authenticated Surfaces

Migrate:

```text
Login

Dashboard

Progress

Bookmarks
```

without weakening authentication or authorization.

---

# 131. Phase 7 — Hardening

Focus on:

```text
Performance

Accessibility

Responsive Behavior

Security

Error States

Loading States
```

---

# 132. Phase 8 — SEO Validation

Run:

```text
Route Comparison

Sitemap Comparison

Canonical Validation

Metadata Validation

Structured Data Validation

Internal Link Crawl
```

---

# 133. Phase 9 — Cleanup

Remove:

```text
Dead Components

Old Styles

Unused Dependencies

Temporary Adapters

Obsolete Feature Flags
```

only after stability is established.

---

# 134. V2 Release Gates

V2 should not be considered ready merely because:

```text
It looks good.
```

Release gates should include:

```text
FUNCTIONAL

SEO

PERFORMANCE

ACCESSIBILITY

SECURITY

ANALYTICS

MIGRATION
```

---

# 135. Functional Gate

Required:

```text
Critical Journeys Work

No Major Broken Navigation

Search Works

Question Pages Work

Authentication Works if included
```

---

# 136. SEO Gate

Required:

```text
Important URLs Preserved or Redirected

Canonical Correct

Sitemap Valid

robots.txt Correct

No Accidental noindex

Metadata Present
```

---

# 137. Performance Gate

Required:

```text
No Severe Regression

No Massive Unnecessary JS Increase

No Major Layout Instability
```

---

# 138. Accessibility Gate

Required:

```text
Keyboard Basics Work

Focus Is Visible

Contrast Is Acceptable

Forms Have Labels

Heading Structure Is Reasonable
```

---

# 139. Security Gate

Required:

```text
No Exposed Secrets

Authorization Still Works

Private Data Remains Private

Sensitive Endpoints Protected
```

---

# 140. Analytics Gate

Required:

```text
Core Page Tracking Works

Critical Events Work

No Obvious Duplicate Events

Production Data Is Being Received
```

---

# 141. Migration Gate

Required:

```text
Content Counts Reconciled

Data Migration Validated

Redirect Map Applied

Recovery Path Understood
```

---

# 142. Definition of Successful Migration

V2 migration is successful when:

```text
Users Can Access the Product

Existing Valuable URLs Continue Working

Search Engines Can Crawl Correctly

Content Is Preserved

User Data Is Preserved

Critical Features Work

Performance Is Acceptable

Analytics Still Measures Reality

The Team Can Continue Development
```

---

# 143. Migration Failure Modes

Avoid:

```text
Big-Bang Rewrite

Mass URL Changes

Unverified Database Migration

No Production Baseline

No Rollback Plan

No SEO Validation

No Mobile Testing

No Analytics Validation

Deleting Old Code Too Early

Deploying Too Many Unrelated Changes Together
```

---

# 144. AI Coding Agent Migration Rules

AI coding agents must not:

```text
Rewrite the entire repository in one uncontrolled pass

Change public URLs casually

Delete existing routes without route analysis

Change authentication casually

Run destructive migrations without review

Remove existing SEO metadata without replacement

Declare success because the build passes
```

---

# 145. AI Agent Pre-Change Protocol

Before a meaningful change:

The agent should inspect:

```text
Relevant Files

Route Usage

Component Usage

Data Dependencies

SEO Impact

Tests

Related Documentation
```

---

# 146. AI Agent Change Plan

For non-trivial work:

State:

```text
What will change

What will remain unchanged

Risks

Validation plan
```

before implementation.

---

# 147. AI Agent Implementation Scope

Prefer:

```text
One coherent implementation unit
```

at a time.

Examples:

```text
Typography Foundation

Question Page Shell

SEO Metadata Utility

Sitemap Validation
```

---

# 148. AI Agent Post-Change Protocol

After implementation:

Report:

```text
Files Changed

Behavior Changed

Tests Run

Build Result

Known Limitations

Next Recommended Step
```

---

# 149. AI Agent No-Fake-Validation Rule

Do not say:

```text
Everything works perfectly.
```

unless the relevant validation was actually performed.

Use precise language:

```text
Build passed.

Unit tests passed.

Production behavior was not tested.
```

---

# 150. AI Agent Repository Truth Rule

The repository is the implementation truth.

Documentation is the architectural intent.

If they conflict:

```text
Inspect

Understand

Explain

Resolve Deliberately
```

Do not blindly force documentation assumptions onto incompatible code.

---

# 151. Documentation Update Rule

If implementation intentionally changes an architectural decision:

Update the relevant documentation.

Avoid:

```text
Docs describe one system

Repository contains another
```

---

# 152. Release Notes

Significant V2 releases should summarize:

```text
What Changed

User Impact

SEO Impact

Migration Notes

Known Issues
```

---

# 153. Changelog Philosophy

The changelog should describe meaningful product changes.

Avoid filling it with every internal formatting commit.

---

# 154. Production Incident During Migration

If a serious incident occurs:

```text
Stop Additional Changes

Assess Scope

Restore Service

Protect Data

Investigate Root Cause

Document Learning
```

Do not continue stacking unrelated changes onto an unstable system.

---

# 155. Post-Migration Review

After V2 stabilizes:

Review:

```text
What Worked

What Broke

What Was Hard to Test

What Was Hard to Roll Back

What Documentation Was Missing
```

Use the findings to improve future releases.

---

# 156. Migration Completion Criteria

The migration is not complete merely when V2 is deployed.

It is complete when:

```text
Production Is Stable

SEO Is Technically Healthy

Important URLs Are Accounted For

Data Is Validated

Old Compatibility Code Is Understood

Monitoring Is Working

The Team Can Develop Normally
```

---

# 157. V1 Decommissioning

Only remove V1-specific systems after confirming:

```text
No Active Dependency

No Required Route

No Required Data

No Rollback Dependency

No Important Analytics Dependency
```

---

# 158. Historical URL Preservation

Even after V2 stabilizes:

Historical redirects may need to remain.

Do not delete redirect rules merely because:

```text
The migration happened months ago.
```

External links may still use old URLs.

---

# 159. Permanent Quality Loop

After V2:

The release process becomes:

```text
Plan

↓

Implement

↓

Test

↓

Review

↓

Deploy

↓

Observe

↓

Learn

↓

Improve
```

This is not only a migration process.

It becomes the permanent engineering process.

---

# 160. Testing Definition of Done

The V2 testing foundation is established when:

```text
[ ] Static validation exists

[ ] Critical user journeys are tested

[ ] Important URL fixtures exist

[ ] SEO regression checks exist

[ ] Sitemap can be validated

[ ] Authentication tests exist where applicable

[ ] Authorization tests exist for private resources

[ ] Mobile layouts are tested

[ ] Dark and light modes are tested

[ ] Performance baseline exists

[ ] Analytics events are validated

[ ] Production smoke tests are defined
```

---

# 161. Migration Definition of Done

The V2 migration foundation is established when:

```text
[ ] Current routes are inventoried

[ ] Important URLs are classified

[ ] Redirect strategy exists

[ ] Content counts are baselined

[ ] Database migration strategy exists

[ ] High-risk migrations have recovery paths

[ ] V1 baseline is captured

[ ] V2 changes are phased

[ ] Public SEO pages preserve their contracts

[ ] User data preservation is validated
```

---

# 162. Release Definition of Done

The V2 release process is established when:

```text
[ ] Pre-release checks exist

[ ] Deployment is repeatable

[ ] Production smoke tests exist

[ ] Monitoring occurs after deployment

[ ] Rollback or roll-forward strategy is understood

[ ] Significant releases are documented

[ ] Incidents can be handled without guessing
```

---

# 163. Final Migration Principle

Interview Explainer V2 should not be created by destroying Interview Explainer V1.

The permanent migration principles are:

> **Preserve what already has value.**

> **Do not change public URLs without a reason.**

> **Internal architecture may change completely while external contracts remain stable.**

> **A successful build does not prove a successful migration.**

> **A successful visual redesign does not prove SEO safety.**

> **A backup is not the same as a rollback strategy.**

> **Database changes require more care than code changes.**

> **Search engines are production users of public architecture.**

> **Analytics must survive the migration so improvement can actually be measured.**

> **The repository must be inspected before migration assumptions are made.**

> **High-risk changes require stronger validation.**

> **Small reversible changes are preferable to uncontrolled rewrites.**

> **V2 should be built in coherent vertical slices.**

> **Old code should be removed only after replacement behavior is proven.**

> **Documentation defines intent; the repository reveals implementation reality.**

> **Production is the final environment that must be validated.**

> **Every important release should have a recovery path.**

The desired transition is:

```text
INTERVIEW EXPLAINER V1

Existing URLs
Existing Content
Existing Search Signals
Existing Product
Existing Data

        ↓

CONTROLLED MIGRATION

Audit
Baseline
Foundations
Incremental Implementation
Testing
SEO Validation
Data Validation
Monitoring

        ↓

INTERVIEW EXPLAINER V2

Calmer UI
Better Reading Experience
Stronger SEO
Better Performance
Cleaner Architecture
Safer Authentication
Reliable Analytics
Scalable Product Foundation
```

V2 should feel like a major transformation to users.

But to:

```text
Google

Existing Links

Existing Data

Returning Users
```

the transition should be as controlled and stable as possible.
