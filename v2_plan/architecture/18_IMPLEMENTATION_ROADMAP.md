# Interview Explainer V2 — Implementation Roadmap

**Document:** `18_IMPLEMENTATION_ROADMAP.md`
**Status:** Primary Execution Roadmap
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md` through `17_MONETIZATION_BUSINESS_MODEL.md`
**Purpose:** Convert the complete Interview Explainer V2 architecture into a controlled, measurable, repository-level implementation sequence that can be executed incrementally by human developers and AI coding agents without losing context, breaking production, damaging SEO, or allowing uncontrolled scope expansion.

---

# 1. Purpose of This Document

The previous architecture documents define:

```text
WHAT Interview Explainer V2 should become
```

This document defines:

```text
HOW Interview Explainer V2 should actually be built
```

The central implementation problem is not simply:

```text
Write code.
```

The real problem is:

```text
Understand Current Repository

↓

Capture Baseline

↓

Identify Risk

↓

Build Shared Foundation

↓

Migrate Incrementally

↓

Validate Continuously

↓

Compare Against Baseline

↓

Release Safely
```

---

# 2. Core Implementation Principle

The permanent implementation principle is:

> **Do not perform a blind redesign. Perform a controlled migration from a known current state to a validated target state.**

The wrong approach is:

```text
Read V2 documents

↓

Rewrite entire repository

↓

Deploy

↓

Discover what broke
```

The correct approach is:

```text
AUDIT

↓

BASELINE

↓

PLAN

↓

FOUNDATION

↓

MIGRATE

↓

VALIDATE

↓

RELEASE

↓

MEASURE
```

---

# 3. V2 Is a Migration, Not a New Greenfield Product

Interview Explainer already has:

```text
A Live Domain

Existing URLs

Existing Content

Existing Search Impressions

Existing Indexed or Discoverable Pages

Existing Users

Existing Analytics Signals

Existing Repository Structure
```

Therefore V2 must preserve valuable existing behavior while improving the system.

---

# 4. Existing Production Is the Starting Point

The current production system is not merely:

```text
Old code to replace.
```

It is also:

```text
The current behavioral specification.
```

Before changing something:

Understand what it currently does.

---

# 5. Architecture Documents Are Constraints

The V2 documents should be treated as:

```text
Implementation Constraints
```

not:

```text
Loose Inspiration
```

However:

If repository reality conflicts with an assumption in the documents:

```text
Inspect

↓

Document Conflict

↓

Choose Correct Adaptation

↓

Preserve V2 Principle
```

Do not blindly force an architecture that does not fit the actual codebase.

---

# 6. No Big-Bang Rewrite

The default implementation strategy is:

```text
Incremental Migration
```

Avoid:

```text
Delete current application

↓

Generate new application

↓

Move content later
```

unless repository inspection proves that a controlled replacement is genuinely safer.

---

# 7. Implementation Workstreams

V2 consists of several connected workstreams:

```text
WORKSTREAM A
Repository Audit

WORKSTREAM B
Baseline Capture

WORKSTREAM C
Design System Foundation

WORKSTREAM D
Application Shell

WORKSTREAM E
Public Page Migration

WORKSTREAM F
SEO Architecture

WORKSTREAM G
Search and Discovery

WORKSTREAM H
Authentication and User State

WORKSTREAM I
Dashboard and Practice

WORKSTREAM J
Performance

WORKSTREAM K
Accessibility

WORKSTREAM L
Security

WORKSTREAM M
Analytics and Observability

WORKSTREAM N
Content Operations

WORKSTREAM O
Testing and Release
```

These workstreams are connected.

They should not all be implemented simultaneously.

---

# 8. Execution Phases

The implementation should proceed through:

```text
PHASE 0
Repository Access and Safety

PHASE 1
Repository Audit

PHASE 2
Production Baseline

PHASE 3
V2 Technical Plan

PHASE 4
Design Foundation

PHASE 5
Application Shell

PHASE 6
Representative Page Migration

PHASE 7
Public Page-System Migration

PHASE 8
SEO and Indexing Hardening

PHASE 9
Search and Discovery

PHASE 10
User Product Surfaces

PHASE 11
Performance, Accessibility, and Security

PHASE 12
Content Operations Foundation

PHASE 13
Full Regression Validation

PHASE 14
Controlled Production Release

PHASE 15
Post-Release Observation
```

---

# 9. Phase 0 — Repository Access and Safety

Before code modification:

Confirm:

```text
Repository

Default Branch

V2 Working Branch

Local Development Command

Build Command

Test Command

Lint Command

Deployment Mechanism

Environment Variables

Production Dependencies
```

---

# 10. Dedicated V2 Branch

Create a dedicated branch.

Example:

```text
v2
```

or:

```text
feature/v2-rebuild
```

Do not perform the entire V2 migration directly on the production branch.

---

# 11. Branch Protection

The production branch should not receive uncontrolled direct commits from AI agents.

Recommended:

```text
V2 Working Branch

↓

Validation

↓

Review

↓

Merge
```

---

# 12. Initial Git Safety

Before modification:

Record:

```text
Current Branch

Current Commit SHA

Working Tree Status

Remote State
```

The initial repository state should be recoverable.

---

# 13. No Secret Exposure

Before giving repository access to tools or agents:

Check for:

```text
.env

API Keys

Database Credentials

Cloudflare Credentials

OAuth Secrets

Private Keys
```

Do not commit secrets to enable AI tooling.

---

# 14. Environment Inventory

Identify required environments:

```text
LOCAL

PREVIEW / STAGING

PRODUCTION
```

If preview does not exist:

Determine whether the existing deployment platform supports branch previews or equivalent safe testing.

---

# 15. Phase 0 Exit Gate

Do not proceed until:

```text
[ ] Repository can be cloned

[ ] Application can run locally

[ ] Build process is known

[ ] V2 branch exists

[ ] Production branch is protected operationally

[ ] Required environment configuration is understood

[ ] No secret-sharing shortcut is required
```

---

# 16. Phase 1 — Repository Audit

The first major engineering task is:

```text
Understand the current system.
```

Do not modify architecture before completing the audit.

---

# 17. Repository Tree Audit

Generate a repository tree.

Identify:

```text
Application Directories

Routes

Components

Content

API Routes

Database Layer

Authentication

Styles

Configuration

Scripts

Tests

Public Assets
```

---

# 18. Framework Audit

Confirm:

```text
Framework

Framework Version

Rendering Model

Routing Model

Build System

Deployment Model
```

Do not assume from filenames alone.

---

# 19. Dependency Audit

Inspect:

```text
package.json

Lockfile

Runtime Dependencies

Development Dependencies

Unused Dependencies

Duplicate Libraries

Outdated Critical Dependencies
```

Do not upgrade everything during the first audit.

---

# 20. Route Inventory

Generate an inventory of route families.

Example:

```text
/

/technology

/technology/[slug]

/technology/[slug]/[module]

/question/[slug]

/company/[slug]

/dashboard

/pricing

/login
```

The actual repository defines the real inventory.

---

# 21. Dynamic Route Audit

For every dynamic route:

Identify:

```text
Source Data

Parameter Generation

404 Behavior

Metadata Generation

Canonical Behavior

Sitemap Inclusion
```

---

# 22. Content Architecture Audit

Determine:

```text
Where questions live

How questions are loaded

How IDs are assigned

How slugs are generated

How modules relate to questions

Whether content is duplicated

Whether content is generated at build time
```

---

# 23. Styling Audit

Identify:

```text
Global CSS

Tailwind

CSS Modules

Inline Styles

Component Libraries

Theme System

Dark Mode Implementation
```

---

# 24. Component Audit

Classify current components:

```text
KEEP

REFACTOR

REPLACE

REMOVE

UNKNOWN
```

Do not replace components merely because they are old.

---

# 25. State Management Audit

Identify:

```text
Local State

Context

External State Libraries

Server State

Persistent Browser State
```

---

# 26. Authentication Audit

Determine:

```text
Provider

Session Model

Protected Routes

Server Authorization

Client Guards

User Data Model
```

---

# 27. Database Audit

If a database exists:

Identify:

```text
Database

ORM

Schema

Migrations

Connection Pattern

User Tables

Progress Tables

Content Tables
```

---

# 28. API Audit

Inventory:

```text
API Routes

Inputs

Outputs

Authentication

Validation

Rate Limits

External Services
```

---

# 29. SEO Audit

Inspect actual implementation of:

```text
Metadata

Titles

Descriptions

Canonicals

Robots

Sitemaps

Structured Data

Open Graph

Redirects

404s
```

---

# 30. Analytics Audit

Identify:

```text
Analytics Provider

Events

Pageviews

Consent Behavior

Search Console Integration

Cloudflare Analytics
```

---

# 31. Performance Audit

Measure representative pages for:

```text
LCP

CLS

INP

JavaScript Weight

Image Weight

Font Loading

Third-Party Scripts
```

---

# 32. Accessibility Audit

Inspect:

```text
Heading Hierarchy

Keyboard Navigation

Focus States

Contrast

Form Labels

Landmarks

Semantic HTML
```

---

# 33. Security Audit

Inspect:

```text
Authentication Boundaries

Authorization

Secrets

Input Validation

Unsafe Rendering

File Uploads

Rate Limits

Headers
```

---

# 34. Audit Output

Create:

```text
V2_REPOSITORY_AUDIT.md
```

This should contain:

```text
Current Architecture

Current Route Map

Current Content Model

Current SEO Model

Current Auth Model

Current Data Model

Current Risks

Migration Constraints
```

---

# 35. Phase 1 Exit Gate

Do not begin large implementation until:

```text
[ ] Repository structure is understood

[ ] Route families are inventoried

[ ] Content source is known

[ ] SEO implementation is known

[ ] Authentication implementation is known

[ ] Data model is known

[ ] Major risks are documented
```

---

# 36. Phase 2 — Production Baseline

Before changing production behavior:

Capture the current state.

---

# 37. Why Baseline Matters

Without a baseline:

After migration, the team cannot reliably answer:

```text
Did we improve?

Did we accidentally remove pages?

Did URLs change?

Did performance improve?

Did metadata disappear?
```

---

# 38. Route Baseline

Create a machine-readable inventory.

Example:

```text
route-baseline.json
```

Potential fields:

```text
URL

Route Type

Status

Canonical

Indexability

Title

Description
```

---

# 39. Content Baseline

Create:

```text
content-baseline.json
```

Potential fields:

```text
Content ID

Title

Slug

Parent

Status

Public URL
```

---

# 40. Sitemap Baseline

Capture:

```text
Current Sitemap URLs

Sitemap Count

Route Families Represented
```

---

# 41. Metadata Baseline

Sample representative pages.

Capture:

```text
Title

Description

Canonical

Robots

Open Graph

Structured Data
```

---

# 42. Screenshot Baseline

Capture representative current pages:

```text
Homepage

Technology Hub

Module Page

Question Page

Company Page

Search

Dashboard

Login

Pricing

404
```

Capture where relevant:

```text
Desktop

Mobile

Light

Dark
```

---

# 43. Performance Baseline

Measure representative pages.

Record:

```text
Lighthouse

Core Web Vitals where available

Bundle Information

Page Weight
```

---

# 44. Search Baseline

Record current Search Console metrics:

```text
Indexed Pages

Not Indexed Pages

Impressions

Clicks

CTR

Average Position

Top Queries

Top Pages
```

Use date ranges consistently.

---

# 45. Analytics Baseline

Record:

```text
Real Users

Sessions

Pageviews

Engagement

Traffic Sources
```

Do not substitute Cloudflare request count for users.

---

# 46. Error Baseline

Capture:

```text
404s

Console Errors

Server Errors

Broken Links
```

---

# 47. Phase 2 Exit Gate

Before migration:

```text
[ ] Route baseline exists

[ ] Content baseline exists

[ ] Sitemap baseline exists

[ ] Representative metadata is captured

[ ] Representative screenshots exist

[ ] Performance baseline exists

[ ] Search baseline exists

[ ] Analytics baseline exists
```

---

# 48. Phase 3 — V2 Technical Plan

Now compare:

```text
CURRENT REPOSITORY

vs

V2 ARCHITECTURE
```

Create:

```text
V2_TECHNICAL_IMPLEMENTATION_PLAN.md
```

---

# 49. Technical Plan Contents

For every major area:

```text
Current State

Target State

Migration Strategy

Files / Modules Affected

Risk

Validation Method
```

---

# 50. Migration Matrix

Create a matrix:

```text
Current Component
→ V2 Component
→ Action
```

Actions:

```text
KEEP

REFACTOR

REPLACE

REMOVE

DEFER
```

---

# 51. Route Migration Matrix

For every route family:

```text
Current Route

Target Route

URL Change?

Redirect Required?

Metadata Change?

Sitemap Change?
```

---

# 52. URL Freeze Decision

Before page migration:

Define which existing public URLs must remain unchanged.

Default:

```text
Preserve Existing Valid Public URLs
```

---

# 53. Redirect Map

If URLs must change:

Create:

```text
redirect-map.json
```

before deployment.

---

# 54. Scope Freeze

The implementation plan should identify:

```text
V2 REQUIRED

V2 OPTIONAL

POST-V2
```

This prevents scope expansion.

---

# 55. Phase 3 Exit Gate

```text
[ ] Current-to-target mapping exists

[ ] Route migration strategy exists

[ ] URL policy exists

[ ] Redirect requirements are known

[ ] Component migration strategy exists

[ ] V2 scope is frozen
```

---

# 56. Phase 4 — Design System Foundation

Do not begin by redesigning every page independently.

Build the shared foundation first.

---

# 57. Foundation Order

Recommended:

```text
Design Tokens

↓

Typography

↓

Spacing

↓

Layout Containers

↓

Buttons

↓

Inputs

↓

Cards

↓

Badges

↓

Navigation Primitives

↓

Content Primitives

↓

Feedback Components
```

---

# 58. Token Implementation

Implement:

```text
Background

Surface

Text

Muted Text

Border

Primary

Success

Warning

Danger

Focus
```

for:

```text
Light Theme

Dark Theme
```

---

# 59. No Page-Specific Color Chaos

Pages should not introduce arbitrary:

```text
Blue 1

Blue 2

Blue 3

Purple Gradient

Random Green
```

outside the design system without justification.

---

# 60. Typography Foundation

Define:

```text
Display

H1

H2

H3

Body

Small

Caption

Code
```

---

# 61. Reading Width

For answer content:

Use a deliberate readable line length.

Do not allow long text to stretch across the entire desktop viewport.

---

# 62. Spacing Foundation

Define consistent:

```text
Page Padding

Section Gap

Card Padding

Inline Gap

Content Rhythm
```

---

# 63. Primitive Components

Implement only primitives required by actual pages.

Potential:

```text
Button

Input

Card

Badge

Breadcrumb

Tabs

Accordion

Dialog

Tooltip

Skeleton

Empty State

Error State
```

---

# 64. Content Components

Important for Interview Explainer:

```text
AnswerSection

CodeBlock

ExampleBlock

Callout

QuestionHeader

QuestionNavigation

RelatedQuestions

MetadataRow
```

---

# 65. Foundation Story Page

Create an internal development page if useful to inspect:

```text
Typography

Colors

Buttons

Cards

Content Blocks

States
```

Do not expose it publicly in production unless intended.

---

# 66. Phase 4 Exit Gate

```text
[ ] Theme tokens exist

[ ] Light and dark modes work

[ ] Typography is consistent

[ ] Layout primitives exist

[ ] Core UI primitives exist

[ ] Core content primitives exist

[ ] No major page migration has duplicated foundational styling
```

---

# 67. Phase 5 — Application Shell

Build the shared frame.

---

# 68. Shell Includes

Potential:

```text
Header

Desktop Navigation

Mobile Navigation

Sidebar Framework

Main Content Container

Footer

Global Search Entry

Theme Control
```

---

# 69. Header Goal

The header should prioritize:

```text
Brand

Primary Navigation

Search

User Access
```

Avoid excessive actions.

---

# 70. Sidebar Goal

The sidebar should support context where useful.

It should not appear merely because:

```text
Dashboards have sidebars.
```

---

# 71. Mobile Shell

Design mobile intentionally.

Do not merely collapse desktop navigation until it fits.

---

# 72. Global Search Entry

Search should be visible but not visually dominate every page.

---

# 73. Shell Validation

Test:

```text
Desktop

Tablet

Mobile

Light

Dark

Keyboard Navigation
```

---

# 74. Phase 5 Exit Gate

```text
[ ] Shared shell is functional

[ ] Mobile navigation works

[ ] Desktop navigation works

[ ] Theme works

[ ] Search entry exists

[ ] Focus behavior works

[ ] Layout does not shift unexpectedly
```

---

# 75. Phase 6 — Representative Page Migration

Before migrating the whole site:

Choose representative pages.

---

# 76. Representative Page Set

Recommended:

```text
Homepage

Technology Hub

Module / Question List

Question Detail

Company Page

Search Results

Dashboard
```

If some do not exist, adapt to the repository.

---

# 77. Why Representative Pages First

These pages expose most system requirements:

```text
Marketing

Navigation

Content

Long Reading

Lists

Search

Authenticated Product
```

---

# 78. Homepage Migration

Focus on:

```text
Clear Value Proposition

Primary Discovery Paths

Calm Visual Hierarchy

Search

Popular / Important Preparation Areas

No Excessive Card Density
```

---

# 79. Hub Page Migration

Focus on:

```text
Context

Hierarchy

Progressive Disclosure

Readable Navigation

Clear Module Structure
```

Avoid a giant wall of equally weighted cards.

---

# 80. Question List Migration

Focus on:

```text
Scannability

Difficulty

Progress

Search / Filter where useful

Clear Question Titles
```

---

# 81. Question Detail Migration

This is the most important reading surface.

Focus on:

```text
Readable Width

Clear Question

Calm Answer Presentation

Strong Typography

Code Readability

Progressive Structure

Useful Navigation

Related Questions
```

---

# 82. Answer Page Principle

The page should feel like:

```text
A focused learning document
```

not:

```text
A dashboard surrounding an article.
```

---

# 83. Question Sidebar

Only include information that helps:

```text
Navigate

Understand Context

Continue Preparation
```

Avoid filling the sidebar with decorative metadata.

---

# 84. Company Page Migration

Focus on:

```text
Company Context

Interview Preparation Paths

Relevant Roles

Relevant Questions

Clear Information Hierarchy
```

---

# 85. Search Results Migration

Focus on:

```text
Query Clarity

Result Relevance

Readable Results

Useful Empty State
```

---

# 86. Dashboard Migration

The dashboard should answer:

```text
What should I do next?
```

not merely display:

```text
Statistics.
```

---

# 87. Representative Page Review

Before scaling migration:

Review:

```text
Visual Consistency

Density

Reading Comfort

Mobile

Dark Mode

Accessibility

Performance
```

---

# 88. Design Freeze Gate

Once representative pages establish the correct V2 language:

Freeze major design primitives.

Do not redesign the design system every few pages.

---

# 89. Phase 6 Exit Gate

```text
[ ] Representative pages are migrated

[ ] Question reading experience is validated

[ ] Mobile experience is validated

[ ] Dark mode is validated

[ ] Design system works across different page types

[ ] Major density problems are resolved
```

---

# 90. Phase 7 — Public Page-System Migration

Now migrate remaining public route families.

---

# 91. Migration by Route Family

Do not migrate random individual pages.

Migrate:

```text
One Route Family at a Time
```

Example:

```text
All Technology Hubs

↓

All Module Pages

↓

All Question Pages

↓

All Company Pages
```

---

# 92. Route-Family Checklist

For each route family:

```text
[ ] Layout migrated

[ ] Responsive behavior tested

[ ] Metadata verified

[ ] Canonical verified

[ ] Internal links verified

[ ] 404 behavior verified

[ ] Sitemap behavior verified

[ ] Performance checked
```

---

# 93. Content Preservation

UI migration should not silently rewrite answer content.

Content transformation is a separate workstream.

---

# 94. URL Preservation

Do not change slugs merely to make routes look cleaner.

Existing search-visible URLs have value.

---

# 95. Internal Link Migration

When layouts change:

Verify internal links still point to canonical destinations.

---

# 96. Empty Page Handling

Do not publish empty hubs.

Use:

```text
404

Noindex

Deferred Publication
```

according to page purpose.

---

# 97. Phase 7 Exit Gate

```text
[ ] All required public route families are migrated

[ ] Existing valid URLs are preserved or redirected

[ ] No major content loss exists

[ ] Public navigation works

[ ] Internal links are validated
```

---

# 98. Phase 8 — SEO and Indexing Hardening

SEO should have been considered throughout migration.

This phase performs full-system hardening.

---

# 99. Crawlability Validation

Verify:

```text
Production pages are accessible

No accidental authentication wall

No accidental robots block

No accidental noindex
```

---

# 100. Robots Validation

Check:

```text
Production robots.txt

Preview environment behavior

Admin exclusion

Private route exclusion
```

---

# 101. Sitemap Generation

Generate sitemaps from authoritative route data.

Do not manually maintain thousands of URLs.

---

# 102. Sitemap Validation

Check:

```text
Only canonical URLs

Only intended indexable pages

No 404s

No redirect URLs

No duplicate URLs
```

---

# 103. Metadata Validation

For each route family:

Verify:

```text
Unique Title

Useful Description

Canonical

Open Graph

Robots
```

---

# 104. Canonical Validation

Detect:

```text
Missing Canonical

Wrong Domain

Canonical Loop

Canonical to 404

Multiple URLs claiming same content
```

---

# 105. Structured Data

Implement only schema that accurately represents page content.

Potential:

```text
WebSite

BreadcrumbList

Organization
```

Other schema types should be used only when valid.

---

# 106. Search Engine Rendering

Verify important content is present in rendered HTML where required for discovery.

Do not rely on fragile client-only loading for core SEO content.

---

# 107. Internal Linking

Ensure:

```text
Homepage

↓

Hubs

↓

Modules

↓

Questions
```

forms a crawlable hierarchy.

---

# 108. Orphan Detection

Generate a report of indexable pages with no meaningful internal incoming links.

---

# 109. Indexability Matrix

For every route family define:

```text
INDEX

NOINDEX

PRIVATE

NOT APPLICABLE
```

---

# 110. Search Console Submission

After production release:

Submit or refresh:

```text
Sitemap
```

and inspect representative URLs.

Do not repeatedly request indexing for thousands of pages manually.

---

# 111. Indexing Expectation

Deployment does not mean:

```text
Instant Google Indexing.
```

The goal is:

```text
Technically Correct

Crawlable

Discoverable

Useful

Internally Linked
```

Search engines decide crawl and indexing timing.

---

# 112. Phase 8 Exit Gate

```text
[ ] robots.txt is correct

[ ] sitemap is correct

[ ] canonicals are correct

[ ] metadata is correct

[ ] indexability matrix is implemented

[ ] important pages are server-visible

[ ] internal linking is crawlable

[ ] orphan report is reviewed
```

---

# 113. Phase 9 — Search and Discovery

Now improve how users move through the content library.

---

# 114. Search Architecture

Search should support:

```text
Questions

Technologies

Modules

Companies

Roles
```

based on available content.

---

# 115. Search Relevance

Prioritize:

```text
Exact Title Match

Strong Keyword Match

Relevant Semantic Match
```

Avoid returning everything loosely related.

---

# 116. Search Empty State

When no result exists:

Provide:

```text
Alternative Query

Nearby Topic

Clear Recovery Path
```

---

# 117. Related Content

Implement controlled related content.

Potential:

```text
Same Module

Same Topic

Prerequisite

Next Question
```

---

# 118. Next-Step Navigation

Every deep content page should help answer:

```text
What should I read or practice next?
```

---

# 119. Phase 9 Exit Gate

```text
[ ] Search works

[ ] Search relevance is acceptable

[ ] Empty states are useful

[ ] Related content is relevant

[ ] Deep pages provide next-step navigation
```

---

# 120. Phase 10 — User Product Surfaces

After the public foundation is stable:

Improve authenticated experiences.

---

# 121. Account Priority

Accounts should enable:

```text
Progress

Bookmarks

Practice

Personalization
```

not exist merely to collect registrations.

---

# 122. Progress

Define what:

```text
Completed
```

actually means.

Avoid ambiguous progress.

---

# 123. Bookmarks

Bookmarks should be:

```text
Fast

Reliable

Easy to Find
```

---

# 124. Dashboard

Dashboard priority:

```text
Continue Preparation

Recent Activity

Progress

Recommended Next Step
```

---

# 125. Practice

Initial practice may include:

```text
Question Review

Self-Assessment

Basic Quiz

Daily Practice
```

Do not prematurely build the full AI mock-interview system inside the V2 foundation migration.

---

# 126. Premium Preparation

Keep architectural extension points for:

```text
Resume Analysis

Mock Interviews

Personalized Plans

Real Interview Preparation
```

Do not block V2 release on them.

---

# 127. Phase 10 Exit Gate

```text
[ ] Account has meaningful value

[ ] Progress works

[ ] Bookmarks work if included

[ ] Dashboard gives next-step guidance

[ ] Practice foundation works if included
```

---

# 128. Phase 11 — Performance, Accessibility, and Security

These are not final decorative tasks.

They should have been considered continuously.

This phase performs complete hardening.

---

# 129. Performance Pass

Audit:

```text
JavaScript

Images

Fonts

Third-Party Scripts

Data Fetching

Caching

Rendering
```

---

# 130. Bundle Review

Identify:

```text
Large Dependencies

Duplicate Dependencies

Client Components That Could Be Server Components

Unused Code
```

---

# 131. Image Review

Verify:

```text
Correct Dimensions

Lazy Loading where appropriate

No Oversized Assets

No Layout Shift
```

---

# 132. Font Review

Verify:

```text
Minimal Required Weights

Efficient Loading

No Invisible Text Problem
```

---

# 133. Accessibility Pass

Test:

```text
Keyboard

Screen Reader Landmarks

Focus

Contrast

Headings

Forms

Dialogs
```

---

# 134. Security Pass

Verify:

```text
Authentication

Authorization

Input Validation

Secrets

Headers

Rate Limits

Uploads

Admin Boundaries
```

---

# 135. Phase 11 Exit Gate

```text
[ ] Performance regressions are addressed

[ ] Accessibility blockers are addressed

[ ] Security blockers are addressed

[ ] Core Web Vitals risks are understood

[ ] No critical secret exposure exists
```

---

# 136. Phase 12 — Content Operations Foundation

Do not build the entire future CMS.

Implement only what current operations need.

---

# 137. Content Inventory

Create repeatable tooling to inspect:

```text
Questions

Modules

Tracks

Slugs

Relationships
```

---

# 138. Content Validation

Implement:

```text
Schema Validation

Duplicate Slug Detection

Broken Parent Detection

Broken Internal Reference Detection
```

---

# 139. Content Health Report

Produce actionable output.

Example:

```text
12 duplicate slugs

43 orphan questions

8 broken internal references
```

---

# 140. Admin Foundation

Only if current operations require it:

Implement minimal:

```text
Content Search

Filtering

Inspection

Validation Status
```

Editing can remain repository-based if that is currently safer.

---

# 141. Phase 12 Exit Gate

```text
[ ] Content inventory is reproducible

[ ] Content validation exists

[ ] Critical content errors can be detected

[ ] Current content source of truth remains clear
```

---

# 142. Phase 13 — Full Regression Validation

Before production release:

Perform full-system comparison.

---

# 143. Build Validation

Run:

```text
Install

Lint

Type Check

Tests

Production Build
```

---

# 144. Route Validation

Compare:

```text
Baseline Routes

vs

V2 Routes
```

Investigate:

```text
Missing

Unexpected

Changed
```

---

# 145. Content Validation

Compare:

```text
Baseline Content

vs

V2 Content
```

---

# 146. SEO Regression Validation

Compare:

```text
Titles

Canonicals

Indexability

Sitemaps

Structured Data
```

---

# 147. Visual Regression

Review representative pages:

```text
Desktop

Mobile

Light

Dark
```

---

# 148. Functional Regression

Test:

```text
Navigation

Search

Authentication

Progress

Bookmarks

Forms

Error States
```

---

# 149. Browser Testing

Test supported browsers.

At minimum:

```text
Chrome

Safari

Mobile Safari

Relevant Chromium Mobile
```

---

# 150. Device Testing

Prioritize:

```text
Mobile

Laptop

Large Desktop
```

based on actual analytics.

---

# 151. Accessibility Regression

Repeat keyboard and semantic checks after final integration.

---

# 152. Performance Regression

Compare against baseline.

A prettier V2 should not become dramatically slower.

---

# 153. Phase 13 Exit Gate

Production release is blocked if:

```text
Critical routes are missing

Major URLs changed without redirects

Sitemap is broken

Production build fails

Authentication is broken

Critical security issue exists

Major mobile layout is broken

Question content is inaccessible
```

---

# 154. Phase 14 — Controlled Production Release

Do not treat:

```text
git push
```

as the entire release strategy.

---

# 155. Release Preparation

Before merge:

Record:

```text
Release Commit

Migration Requirements

Environment Changes

Redirect Map

Known Limitations

Rollback Point
```

---

# 156. Database Migration Safety

If database changes exist:

Determine:

```text
Backward Compatibility

Migration Order

Rollback Limitations

Backup
```

---

# 157. Deployment Order

Potential:

```text
Database-Compatible Changes

↓

Application Deployment

↓

Validation

↓

Optional Cleanup
```

The actual order depends on architecture.

---

# 158. Production Smoke Test

Immediately verify:

```text
Homepage

Representative Hub

Representative Question

Search

Login

Dashboard

robots.txt

sitemap
```

---

# 159. Production SEO Smoke Test

Verify:

```text
Canonical Domain

No Accidental Noindex

No Preview URLs

Sitemap Accessible

Representative Metadata Correct
```

---

# 160. Production Error Monitoring

Watch:

```text
5xx Errors

404 Spikes

Client Errors

Authentication Failures

Performance
```

---

# 161. Rollback Decision

Rollback if:

```text
Critical public pages fail

Major content becomes inaccessible

Authentication is critically broken

SEO configuration is catastrophically incorrect

Data integrity is at risk
```

---

# 162. Do Not Roll Back for Minor Cosmetic Issues

Small visual imperfections can be fixed forward.

Rollback should be proportional to risk.

---

# 163. Phase 14 Exit Gate

```text
[ ] Production is live

[ ] Critical pages work

[ ] SEO smoke test passes

[ ] Error monitoring is stable

[ ] No critical rollback condition exists
```

---

# 164. Phase 15 — Post-Release Observation

V2 release is not the end.

Observe.

---

# 165. First 24 Hours

Monitor:

```text
Errors

Traffic

404s

Performance

Authentication

Sitemap Access
```

---

# 166. First 7 Days

Monitor:

```text
Search Console

Indexed Pages

Crawl Behavior

Impressions

Clicks

CTR

Top Pages

User Engagement
```

Do not overreact to one day of search volatility.

---

# 167. First 30 Days

Evaluate:

```text
Organic Growth

Indexing Trend

Engagement

Return Users

Pages per Session

Search Usage

Performance
```

---

# 168. SEO Evaluation Window

SEO changes may require:

```text
Weeks

or longer
```

to show stable effects.

Do not rebuild the entire SEO architecture after three days of noisy data.

---

# 169. Post-Release Issue Categories

Classify:

```text
P0
Critical outage or data risk

P1
Major product or SEO failure

P2
Important usability issue

P3
Polish
```

---

# 170. Fix Order

Prioritize:

```text
Correctness

↓

Accessibility

↓

SEO

↓

Performance

↓

Usability

↓

Polish
```

The exact order may vary by severity.

---

# 171. Parallel Work Rules

Some work can happen in parallel.

Examples:

```text
Design Tokens

+

Repository SEO Audit
```

or:

```text
Content Validation Tooling

+

Representative Page Design
```

---

# 172. Unsafe Parallel Work

Avoid simultaneously changing:

```text
Route Architecture

Content Storage

Slug Generation

SEO Metadata

Page Design
```

across the same route family without coordination.

---

# 173. One Ownership Boundary Per Task

Each implementation task should have:

```text
Scope

Files

Expected Outcome

Validation
```

---

# 174. Task Size

AI-agent tasks should usually be small enough to:

```text
Understand

Implement

Validate

Review
```

within one bounded work unit.

---

# 175. Bad Task Example

```text
Fix entire V2.
```

This is too broad.

---

# 176. Better Task Example

```text
Audit the current question-detail route family.

Do not modify code.

Report:

- route files
- data source
- metadata generation
- canonical behavior
- content rendering
- related components
- migration risks
```

---

# 177. Implementation Task Template

Every coding task should define:

```text
OBJECTIVE

CONTEXT

IN-SCOPE

OUT-OF-SCOPE

FILES TO INSPECT

CONSTRAINTS

IMPLEMENTATION

VALIDATION

EXPECTED OUTPUT
```

---

# 178. Task Completion Report

After each task:

Report:

```text
Files Inspected

Files Changed

What Changed

Why

Validation Run

Validation Result

Known Issues

Next Recommended Task
```

---

# 179. No Silent Scope Expansion

If an agent discovers adjacent problems:

It should:

```text
Report Them
```

not automatically rewrite unrelated systems.

---

# 180. Exception for Blocking Issues

If an adjacent issue blocks the assigned task:

The agent may propose:

```text
Minimal Required Fix
```

and explain why.

---

# 181. Commit Strategy

Prefer logical commits.

Examples:

```text
feat(ui): add v2 design tokens

refactor(layout): migrate application shell

fix(seo): correct canonical generation

test(content): add duplicate slug validation
```

---

# 182. Avoid Giant Commits

Do not create one commit containing:

```text
1,200 changed files

UI redesign

SEO migration

Database changes

Content rewrite
```

unless the repository architecture makes separation impossible.

---

# 183. Commit Validation

Before commit:

Run relevant:

```text
Lint

Type Check

Tests

Build
```

based on change scope.

---

# 184. Full Build Frequency

Run a full production build:

```text
At Major Phase Gates

Before Merge

Before Release
```

not necessarily after every trivial CSS edit.

---

# 185. Documentation Updates

When architecture changes:

Update relevant V2 documents or implementation notes.

Do not allow documentation to describe a system that no longer exists.

---

# 186. Decision Log

Create:

```text
V2_DECISION_LOG.md
```

for meaningful deviations.

Example:

```text
Decision

Reason

Alternatives

Impact
```

---

# 187. Issue Log

Create:

```text
V2_ISSUE_LOG.md
```

for discovered issues that are:

```text
Important

But Out of Current Scope
```

---

# 188. Migration Tracker

Create:

```text
V2_MIGRATION_TRACKER.md
```

Track:

```text
Phase

Task

Status

Owner / Agent

Validation

Commit
```

---

# 189. Status Values

Use simple states:

```text
NOT STARTED

IN PROGRESS

BLOCKED

DONE

VALIDATED
```

---

# 190. Done vs Validated

A task is:

```text
DONE
```

when implementation is complete.

It is:

```text
VALIDATED
```

when required checks pass.

Do not treat them as identical.

---

# 191. Recommended First Implementation Sequence

The actual first repository work should be:

```text
TASK 1
Clone and run repository

TASK 2
Generate repository audit

TASK 3
Generate route inventory

TASK 4
Generate content inventory

TASK 5
Audit SEO implementation

TASK 6
Capture production baseline

TASK 7
Create technical migration plan

TASK 8
Create V2 design tokens

TASK 9
Create typography and layout foundation

TASK 10
Create application shell

TASK 11
Migrate question-detail page

TASK 12
Migrate one hub page

TASK 13
Validate design language

TASK 14
Scale route-family migration

TASK 15
Harden SEO

TASK 16
Validate full site

TASK 17
Release preview

TASK 18
Production release
```

---

# 192. Why Question Detail Should Be Migrated Early

The question-detail page represents the core product experience.

If V2 cannot make:

```text
One Question

+

One Answer
```

feel:

```text
Readable

Calm

Useful

Professional
```

then redesigning the rest of the platform first is misplaced effort.

---

# 193. Why Homepage Should Not Define Everything

A visually impressive homepage can hide a weak product.

The core content experience should drive the design system.

---

# 194. Why SEO Must Be Audited Before UI Migration

A UI refactor may accidentally change:

```text
Rendering

URLs

Metadata

Internal Links

Heading Structure
```

Understanding SEO first reduces accidental damage.

---

# 195. Why Content Should Not Be Rewritten During Initial V2 Migration

Content quality is a major future workstream.

But combining:

```text
UI Rewrite

+

SEO Rewrite

+

Content Rewrite
```

makes failures difficult to diagnose.

---

# 196. V2 Scope Protection

The V2 foundation should not be blocked by:

```text
Perfecting 10,000 answers

Building Full Voice Mock Interviews

Building Full Job Marketplace

Building Enterprise B2B

Building Advanced Content Engine
```

---

# 197. V2 Required Outcome

V2 should establish:

```text
Excellent Public Reading Experience

Clear Information Architecture

Strong SEO Foundation

Reliable Indexability

Consistent Design System

Responsive Experience

Search and Discovery

Stable Architecture

Testing and Release Discipline
```

---

# 198. V2 Optional Outcome

Depending on current repository maturity:

```text
Improved Dashboard

Progress

Bookmarks

Basic Practice

Minimal Admin Improvements
```

---

# 199. Post-V2 Workstreams

After V2 foundation:

```text
CONTENT QUALITY

MOCK INTERVIEWS

RESUME ANALYSIS

REAL INTERVIEW PREPARATION

JOB HUNTING

MONETIZATION
```

can proceed as focused product workstreams.

---

# 200. V2 Completion Criteria

V2 is not complete because:

```text
The homepage looks better.
```

V2 is complete when:

```text
[ ] Core route families use the V2 design system

[ ] Question reading experience is materially improved

[ ] Mobile experience is reliable

[ ] Light and dark themes are coherent

[ ] Existing important URLs are preserved

[ ] Redirects exist for intentional URL changes

[ ] Metadata architecture is consistent

[ ] Sitemap architecture is correct

[ ] robots behavior is correct

[ ] Important pages are crawlable

[ ] Internal linking is improved

[ ] Search and discovery are functional

[ ] Performance has no major regression

[ ] Accessibility blockers are addressed

[ ] Security blockers are addressed

[ ] Content integrity is preserved

[ ] Production release is validated

[ ] Post-release monitoring is active
```

---

# 201. V2 Master Execution Flow

The complete flow is:

```text
CURRENT PRODUCTION

        ↓

REPOSITORY SAFETY

        ↓

REPOSITORY AUDIT

        ↓

ROUTE + CONTENT INVENTORY

        ↓

PRODUCTION BASELINE

        ↓

CURRENT → TARGET MIGRATION PLAN

        ↓

DESIGN TOKENS

        ↓

TYPOGRAPHY + LAYOUT

        ↓

APPLICATION SHELL

        ↓

QUESTION DETAIL PAGE

        ↓

REPRESENTATIVE HUB PAGE

        ↓

DESIGN VALIDATION

        ↓

PUBLIC ROUTE-FAMILY MIGRATION

        ↓

SEO HARDENING

        ↓

SEARCH + DISCOVERY

        ↓

USER PRODUCT SURFACES

        ↓

PERFORMANCE

        ↓

ACCESSIBILITY

        ↓

SECURITY

        ↓

CONTENT VALIDATION

        ↓

FULL REGRESSION

        ↓

PREVIEW RELEASE

        ↓

PRODUCTION RELEASE

        ↓

24-HOUR MONITORING

        ↓

7-DAY SEARCH OBSERVATION

        ↓

30-DAY PRODUCT EVALUATION
```

---

# 202. Final Implementation Principle

The V2 rebuild should not depend on one AI agent remembering hundreds of pages of architecture indefinitely.

The process itself must preserve context.

The permanent implementation principles are:

> **Audit before modifying.**

> **Capture a baseline before migrating.**

> **Treat existing production URLs as valuable contracts.**

> **Do not perform a blind big-bang rewrite.**

> **Build shared foundations before redesigning individual pages.**

> **Use the question-detail experience as a primary design test.**

> **Migrate route families, not random pages.**

> **Separate UI migration from large-scale content rewriting.**

> **SEO must be preserved throughout migration, not added at the end.**

> **Every implementation task should have explicit scope and validation.**

> **AI agents should receive bounded tasks rather than “fix the whole repository.”**

> **A completed coding task is not validated until required checks pass.**

> **Large repository changes should be divided into logical commits.**

> **Unexpected adjacent issues should be recorded rather than silently expanding scope.**

> **The production baseline must be compared against the migrated system.**

> **A successful build does not prove a successful migration.**

> **A beautiful homepage does not prove a successful product redesign.**

> **A deployed page does not prove an indexable page.**

> **A submitted sitemap does not guarantee indexing.**

> **Search performance should be evaluated over meaningful time windows rather than day-to-day noise.**

> **V2 should establish the platform foundation; it should not attempt to finish every future product idea simultaneously.**

The implementation discipline is:

```text
UNDERSTAND

↓

BASELINE

↓

DESIGN

↓

IMPLEMENT

↓

VALIDATE

↓

COMPARE

↓

RELEASE

↓

OBSERVE

↓

IMPROVE
```

The objective is not simply to produce more code.

The objective is to move Interview Explainer from its current live state to a substantially better V2 while preserving everything valuable that already exists and creating a foundation that future features can safely build upon.
