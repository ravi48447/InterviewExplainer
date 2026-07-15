# Interview Explainer V2 — Application Architecture

**Document:** `11_APPLICATION_ARCHITECTURE.md`
**Status:** Foundational / Software Architecture
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md` through `10_CONTENT_DATA_ARCHITECTURE.md`
**Purpose:** Define the application-level architecture, repository boundaries, dependency direction, routing responsibilities, rendering strategy, server/client boundaries, feature ownership, shared infrastructure, data access patterns, configuration, error handling, caching, observability, testing boundaries, and architectural rules for Interview Explainer V2.

---

# 1. Purpose of This Document

Interview Explainer is no longer a small collection of pages.

The product direction includes:

```text
Interview Preparation Content

Search

User Accounts

Progress Tracking

Dashboard

Mock Interviews

Real Interview Preparation

Resume Analysis

Job Discovery

Application Tracking

Company Preparation

Role Preparation

Practice Systems

Future AI Features
```

Without explicit application architecture, growth creates predictable problems:

```text
Everything becomes a shared component.

Pages contain business logic.

UI components fetch data directly.

SEO logic is duplicated.

Client components spread everywhere.

Authentication checks appear randomly.

Content sources leak into page components.

One feature imports another feature's internal files.

Circular dependencies emerge.

Global state becomes the default solution.

Every change affects unrelated pages.

AI coding agents create new patterns instead of following existing ones.
```

V2 must prevent this.

The central principle is:

> **The repository should reflect product responsibilities, not merely file types.**

---

# 2. Architecture Objectives

The V2 architecture should optimize for:

```text
Clarity

Modularity

Predictable Dependency Direction

Server-First Rendering

Controlled Client Interactivity

SEO Reliability

Feature Isolation

Testability

Incremental Migration

Operational Visibility

AI-Agent Safety

Future Repository Separation
```

The architecture should remain practical.

Do not introduce:

```text
Microservices
Event buses
Complex domain frameworks
Multiple databases
Distributed systems
```

unless actual product requirements justify them.

---

# 3. Architecture Philosophy

Interview Explainer should use:

```text
Simple boundaries
+
Explicit ownership
+
Controlled dependencies
```

instead of:

```text
Maximum abstraction
+
Maximum framework complexity
```

The architecture should make common work easy.

It should make dangerous architectural changes obvious.

---

# 4. The High-Level System

Conceptually:

```text
Users
    ↓
Web Application
    ↓
Application Features
    ↓
Domain / Content Services
    ↓
Data Sources
```

Supporting systems:

```text
SEO
Search
Authentication
Analytics
Observability
Caching
Configuration
```

Future external integrations may include:

```text
AI Providers
Email
Payments
Job Sources
Resume Processing
Calendar
Notifications
```

These should remain behind explicit boundaries.

---

# 5. The Primary Architectural Layers

The V2 application should conceptually contain:

```text
1. Route Layer

2. Feature Layer

3. Domain Layer

4. Data Access Layer

5. Shared UI Layer

6. Infrastructure Layer
```

These are logical responsibilities.

They do not require a complicated enterprise folder hierarchy.

---

# 6. Route Layer

The route layer owns:

```text
URL Resolution

Route Parameters

Page Composition

Route-Level Metadata

Route-Level Access Control

Not Found Behavior

Redirect Entry Points
```

The route layer should remain thin.

A page route should primarily:

```text
Resolve request
    ↓
Load page data
    ↓
Compose page archetype
    ↓
Return response
```

It should not contain the entire business system.

---

# 7. Feature Layer

The feature layer owns user-facing product capabilities.

Examples:

```text
Preparation

Search

Authentication

Dashboard

Progress

Bookmarks

Mock Interviews

Resume Analysis

Jobs

Applications

Real Interviews
```

Each feature should own:

```text
Feature-specific UI

Feature-specific logic

Feature-specific data contracts

Feature-specific server operations

Feature-specific tests
```

---

# 8. Domain Layer

The domain layer represents core product concepts.

Examples:

```text
Question

Module

Preparation Track

Company

Role

Mock Interview

Resume

Job

Application

Interview
```

The domain layer should express:

```text
What the product means
```

rather than:

```text
How one page happens to display it
```

---

# 9. Data Access Layer

The data layer owns access to:

```text
Static Content

Database

Search Index

External APIs

Object Storage

Future CMS
```

The rest of the application should not need to know unnecessary storage details.

---

# 10. Shared UI Layer

The shared UI layer owns reusable visual primitives and patterns.

Examples:

```text
Button

Input

Dialog

Card

Badge

Breadcrumb

PageContainer

ReadingContainer

QuestionListItem

EmptyState
```

However:

Not every reusable component belongs in global shared UI.

Feature-specific components should remain with their feature.

---

# 11. Infrastructure Layer

Infrastructure owns cross-cutting technical concerns.

Examples:

```text
Authentication Provider Integration

Analytics

Logging

Error Reporting

SEO Infrastructure

Configuration

Caching

External Service Clients

Feature Flags
```

Infrastructure should not contain product presentation logic.

---

# 12. Dependency Direction

The architecture should prefer:

```text
Routes
    ↓
Features
    ↓
Domain / Services
    ↓
Data Access
```

Shared infrastructure may support multiple layers.

Avoid reverse dependencies such as:

```text
Database layer
    ↓
imports page component
```

or:

```text
Shared Button
    ↓
imports Mock Interview feature
```

---

# 13. Dependency Rule

A lower-level reusable module should not depend on a higher-level product feature.

Example:

```text
GOOD

Mock Interview Feature
    ↓
Button
```

Not:

```text
BAD

Button
    ↓
Mock Interview Feature
```

---

# 14. Feature Boundary Rule

One feature should not casually import another feature's internal implementation.

Example:

```text
features/dashboard
```

should not reach into:

```text
features/preparation/internal/question-loader
```

Instead:

The preparation feature should expose an intentional public interface.

---

# 15. Public Feature Interface

A feature may expose:

```text
Public Components

Public Data Functions

Public Types

Public Actions
```

Internal implementation should remain internal.

Conceptually:

```text
features/preparation/
    index
    components/
    server/
    internal/
```

Other features import through the public boundary.

---

# 16. Repository Organization Philosophy

The exact V2 repository structure should be determined after auditing the current repository.

Do not reorganize the entire codebase based only on a theoretical folder tree.

However, the desired direction is:

```text
Application Routes

Feature Modules

Shared UI

Domain / Content

Infrastructure

Configuration

Tests
```

---

# 17. Conceptual Repository Structure

A possible structure:

```text
src/
├── app/
├── features/
├── components/
├── domain/
├── data/
├── lib/
├── seo/
├── config/
└── types/
```

This is conceptual.

The final implementation must adapt to:

* current framework,
* current repository,
* existing route structure,
* current content system.

---

# 18. App Directory Responsibility

If the application uses a framework such as Next.js App Router:

```text
app/
```

should primarily contain:

```text
Routes

Layouts

Loading Boundaries

Error Boundaries

Metadata Entry Points

Route Handlers
```

Avoid placing all business logic inside route folders.

---

# 19. Feature Directory Responsibility

Conceptually:

```text
features/
├── preparation/
├── search/
├── auth/
├── dashboard/
├── progress/
├── mock-interview/
├── resume/
├── jobs/
├── applications/
└── interviews/
```

Not all features need to exist immediately.

Create feature directories when the feature actually exists.

---

# 20. Shared Components Responsibility

Conceptually:

```text
components/
├── ui/
├── layout/
└── shared/
```

Potential distinction:

```text
ui/
→ primitives

layout/
→ application-level layout pieces

shared/
→ genuinely cross-feature composed components
```

Do not create:

```text
components/everything/
```

---

# 21. Domain Directory Responsibility

Potential:

```text
domain/
├── preparation/
├── company/
├── role/
└── user/
```

This layer may contain:

```text
Types

Validation

Domain Rules

Pure Transformations
```

Do not create a complex domain-driven design framework unless necessary.

---

# 22. Data Directory Responsibility

Potential:

```text
data/
├── repositories/
├── database/
├── content/
└── adapters/
```

This layer should answer:

```text
Where does data come from?
```

without leaking that decision throughout the application.

---

# 23. Lib Directory Warning

A generic:

```text
lib/
```

directory often becomes a dumping ground.

Every new file should have a clear reason to belong there.

Good candidates:

```text
Small cross-cutting technical utilities
External service wrappers
Framework adapters
```

Bad candidates:

```text
Random business logic
Page-specific helpers
Unrelated functions
```

---

# 24. Utility Function Rule

Before creating:

```text
utils.ts
```

ask:

```text
What responsibility does this utility belong to?
```

Prefer:

```text
seo/canonical.ts

preparation/question-order.ts

search/normalize-query.ts
```

over:

```text
utils.ts
```

containing 80 unrelated functions.

---

# 25. Route Groups

If supported by the framework, route groups may separate application experiences.

Conceptually:

```text
(public)

(auth)

(app)

(admin)
```

Potential purpose:

```text
Public SEO Pages

Authentication Pages

Authenticated Product

Internal Administration
```

Route groups should reflect meaningful shell or access differences.

---

# 26. Public Application Shell

Public content pages may share:

```text
Global Header

Main Content

Footer
```

Examples:

```text
Homepage

Track

Module

Question

Company

Role
```

The shell should remain lightweight.

---

# 27. Authenticated Application Shell

Future authenticated product areas may use:

```text
Application Navigation

Workspace Context

Account Access

Main Workspace
```

Examples:

```text
Dashboard

Mock Interviews

Resume

Jobs

Applications

Real Interviews
```

Do not force public reading pages into the authenticated dashboard shell.

---

# 28. Shell Separation

The public website and authenticated application may share:

```text
Brand

Design Tokens

UI Primitives

Authentication State
```

They do not need identical layouts.

The page archetype should determine the experience.

---

# 29. Server-First Principle

Public content pages should default to server-rendered architecture where the framework supports it.

Examples:

```text
Track Pages

Module Pages

Question Pages

Company Pages

Role Pages
```

The primary content should not require client-side JavaScript merely to appear.

---

# 30. Client Component Rule

A component should become client-side only when it needs browser capabilities such as:

```text
Local Interactive State

Event Handlers

Browser APIs

Client-Only Libraries

Interactive Forms

Real-Time Interaction
```

Do not add:

```text
"use client"
```

to an entire page because one small child is interactive.

---

# 31. Client Boundary Principle

Prefer:

```text
Server Page
    ↓
Server Content
    ↓
Small Client Interactive Island
```

over:

```text
Entire Page
    ↓
Client Component
```

This improves:

* performance,
* crawlability,
* bundle size,
* architecture clarity.

---

# 32. Example Question Page Boundary

Conceptually:

```text
Question Page
    Server

Question Content
    Server

Breadcrumb
    Server

Previous / Next
    Server

Bookmark Button
    Client

Progress Toggle
    Client

Feedback Interaction
    Client
```

Do not make the entire answer client-rendered for a bookmark button.

---

# 33. Client State Principle

Local UI state should remain local.

Examples:

```text
Dialog open state

Accordion state

Search input state

Temporary filter state
```

Do not place everything into global state.

---

# 34. Global State Rule

Global client state should be introduced only when multiple distant parts of the active client application genuinely require shared mutable state.

Potential future examples:

```text
Active Mock Interview Session

Global Notification State

Certain Authenticated Workspace Context
```

Do not use global state for:

```text
Question content

Module data

Server-loaded page content
```

---

# 35. URL as State

Where useful, durable navigation state may belong in the URL.

Examples:

```text
Search Query

Page Number

Meaningful Filters
```

However:

URL state must follow the SEO parameter policy.

Not every UI state belongs in the URL.

---

# 36. Server State

Data originating from:

```text
Database

Content Repository

External API
```

is server state.

Do not duplicate server state into client stores without reason.

---

# 37. Data Loading Principle

Data should be loaded as close as practical to the server boundary that owns the page or feature.

Avoid:

```text
Page
    ↓
Client loads
    ↓
API route
    ↓
Same server application
    ↓
Database
```

when the server page could directly use the server data layer.

---

# 38. Internal API Rule

Do not create HTTP API calls merely to communicate between server code inside the same application.

Use direct server-side function calls where appropriate.

APIs should exist when there is a real boundary.

---

# 39. API Boundary Examples

A real API boundary may be justified for:

```text
External Clients

Mobile Application

Webhooks

Third-Party Integrations

Browser Mutations

Public API
```

Not every data query needs an API route.

---

# 40. Data Repository Interface

Conceptually:

```text
QuestionRepository

ModuleRepository

TrackRepository
```

or a broader:

```text
ContentRepository
```

may expose semantic operations.

Example:

```text
getQuestionBySlug()

getModuleBySlug()

getQuestionNavigation()

listPublishedTracks()
```

The exact abstraction should remain simple.

---

# 41. Repository Implementation

The repository may initially read:

```text
Static Files
```

and later:

```text
Database
```

without requiring every page to change.

This supports gradual migration.

---

# 42. Service Layer Rule

Create a service when business logic exists.

Do not create:

```text
QuestionService
```

merely to call:

```text
QuestionRepository.getQuestion()
```

with no additional responsibility.

Avoid ceremonial layers.

---

# 43. Domain Service Example

A real preparation service may eventually calculate:

```text
Next Recommended Question

Preparation Completion

Track Continuation

Question Eligibility
```

These are product rules.

They may justify a service.

---

# 44. Query Function Principle

Simple server-side query functions are acceptable.

The architecture does not require every read operation to use classes.

Prefer understandable code over pattern worship.

---

# 45. Mutation Architecture

Mutations may include:

```text
Complete Question

Bookmark Question

Start Mock Interview

Save Resume Analysis

Update Application Status
```

Each mutation should define:

```text
Authentication

Authorization

Validation

Execution

Persistence

Cache Invalidation

Error Handling

Analytics if needed
```

---

# 46. Mutation Validation

Never trust browser input.

Validate mutation input on the server.

Client validation improves UX.

Server validation protects correctness.

Both may exist.

---

# 47. Authentication Boundary

Authentication answers:

```text
Who is the user?
```

Authorization answers:

```text
What is this user allowed to do?
```

Do not confuse them.

---

# 48. Public Page Authentication

Public content pages should not require authentication.

Optional authenticated enhancements may include:

```text
Progress

Bookmarking

Personalized Continuation
```

The base content should remain accessible.

---

# 49. Authentication Failure

If an optional user-state request fails:

The public question content should still render where appropriate.

Do not make the entire public page depend on progress data.

---

# 50. Authorization Rule

Private resources must be authorized server-side.

Example:

```text
Resume Analysis ID
```

must not be accessible merely because the user knows the URL.

The server must verify ownership or permission.

---

# 51. User Data Boundary

User-specific data includes:

```text
Progress

Bookmarks

Mock Interview Sessions

Resume Data

Applications

Interview Notes
```

This should remain clearly separated from global public content.

---

# 52. Feature Ownership

Each major feature should own its user-specific operations.

Example:

```text
features/progress
```

owns:

```text
Mark Complete

Get User Progress

Calculate Completion
```

The question content system should not directly own user progress.

---

# 53. Search Architecture Boundary

Search should consume canonical content.

Conceptually:

```text
Content Source
    ↓
Search Projection
    ↓
Search Index
    ↓
Search Feature
```

Search should not become the source of truth.

---

# 54. Search Feature Responsibility

Search owns:

```text
Query Input

Query Normalization

Retrieval

Ranking Interface

Result Presentation

Search Analytics
```

It should not own canonical question content.

---

# 55. SEO Architecture Boundary

SEO should consume:

```text
Canonical Content

Page Archetype

Indexability Policy

Canonical URL Policy
```

SEO logic should not be duplicated inside every feature.

---

# 56. Metadata Generation Boundary

Page routes may call:

```text
generateQuestionMetadata()

generateModuleMetadata()

generateTrackMetadata()
```

or equivalent centralized functions.

Do not manually reconstruct title, canonical, and robots logic in every route.

---

# 57. Analytics Boundary

Application code should emit meaningful product events.

Examples:

```text
question_viewed

question_completed

track_started

search_performed

mock_interview_started
```

Analytics infrastructure decides:

```text
Where events are sent
```

Feature code decides:

```text
What meaningful event occurred
```

---

# 58. Analytics Provider Isolation

Avoid calling a vendor SDK directly from dozens of feature files.

Use an internal analytics interface where practical.

This allows:

* provider changes,
* testing,
* privacy controls.

---

# 59. Logging Boundary

Server logs should support:

```text
Operational Debugging

Error Investigation

Security Investigation

Performance Diagnosis
```

Do not use:

```text
console.log()
```

as the long-term production observability architecture.

---

# 60. Structured Logging

Useful logs may include:

```text
event

request context

feature

error code

entity ID

duration
```

Avoid logging:

```text
Passwords

Authentication Tokens

Sensitive Resume Content

Private User Data
```

---

# 61. Error Reporting

Unexpected errors should be captured through an error monitoring system when introduced.

Errors should include enough context to diagnose the issue.

Do not expose internal stack traces to users.

---

# 62. Error Taxonomy

Conceptually distinguish:

```text
Validation Error

Authentication Error

Authorization Error

Not Found

Conflict

External Service Failure

Internal Error
```

Different errors require different handling.

---

# 63. Expected vs Unexpected Errors

Expected:

```text
Invalid search query

Question not found

User not authenticated for bookmark
```

Unexpected:

```text
Database unavailable

Unhandled exception

Corrupted content record
```

Do not treat every error as a generic 500.

---

# 64. Error Boundary Scope

Errors should be isolated where possible.

Example:

```text
Related Questions Fail
```

should not necessarily destroy:

```text
Question Answer
```

The failure boundary should match the feature boundary.

---

# 65. Not Found Architecture

Missing canonical content should produce:

```text
404
```

not:

```text
200 + empty state
```

Route-level not-found behavior should be consistent.

---

# 66. Loading Architecture

Loading behavior should match page archetypes.

Avoid one global loading spinner.

Potential:

```text
Question
→ content-shaped skeleton

Module
→ question-row skeleton

Dashboard
→ priority-region skeleton
```

---

# 67. Streaming Principle

If supported by the framework:

Secondary content may stream after primary content.

Example:

```text
Question Answer
    first

Related Recommendations
    later
```

Do not delay primary content for secondary data.

---

# 68. Suspense Boundary Principle

Use boundaries around meaningful independently loading regions.

Do not wrap every tiny component in a loading boundary.

---

# 69. Caching Architecture

Caching should be based on data behavior.

Categories:

```text
Stable Public Content

Frequently Updated Public Content

User-Specific Data

Real-Time Session Data
```

These require different strategies.

---

# 70. Stable Public Content

Examples:

```text
Question Answers

Module Structure

Track Structure
```

may support:

```text
Static Generation

Server Cache

CDN Cache

Revalidation
```

depending on the framework and content workflow.

---

# 71. User-Specific Data

Examples:

```text
Progress

Bookmarks

Applications
```

must not be accidentally shared across users through public caching.

Caching policy must respect identity.

---

# 72. Cache Key Safety

User-specific cache keys must include the correct user scope where caching is used.

Do not cache:

```text
getDashboard()
```

globally without user identity.

---

# 73. Cache Invalidation

When content changes:

Invalidate only relevant data where practical.

Example:

```text
Question Updated
    ↓
Question Page

Potentially Module Projection

Search Index

Related Cached Data
```

Avoid:

```text
Clear all caches
```

as the permanent strategy.

---

# 74. Configuration Architecture

Configuration may include:

```text
Production Origin

Environment

Authentication

Database

Analytics

Search

AI Providers

Feature Flags
```

Configuration should be centralized and validated.

---

# 75. Environment Variable Validation

Required environment variables should be validated at startup or build time.

Avoid discovering in production that:

```text
DATABASE_URL
```

is missing only after a user triggers the affected feature.

---

# 76. Public vs Private Environment Variables

Client-exposed variables are public.

Never expose:

```text
Database Credentials

Private API Keys

Authentication Secrets
```

through client bundles.

Naming conventions alone are not enough.

Architecture must enforce the boundary.

---

# 77. Environment Configuration

Potential environments:

```text
Development

Test

Preview

Production
```

Each should have explicit behavior.

Particularly:

```text
Indexability

Logging

External Services

Feature Flags
```

---

# 78. Production Origin Rule

One configuration source should define the canonical production origin.

SEO, sitemaps, metadata, and redirects should use it consistently.

---

# 79. Feature Flags

Feature flags may support gradual rollout.

Potential examples:

```text
New Question Page

New Search

Mock Interviews Beta
```

However:

Do not create a feature flag for every minor change.

Flags require lifecycle management.

---

# 80. Feature Flag Removal

Temporary flags should eventually be removed.

Otherwise the codebase accumulates:

```text
if old
else new
```

forever.

---

# 81. External Service Boundary

Every external service should have an internal adapter.

Potential:

```text
AIProvider

EmailProvider

SearchProvider

AnalyticsProvider

PaymentProvider
```

Feature code should depend on the capability.

Not unnecessary vendor-specific details.

---

# 82. AI Provider Boundary

Future AI features may use one or more model providers.

The product should define internal capabilities such as:

```text
Generate Interview Question

Evaluate Mock Answer

Analyze Resume

Generate Feedback
```

Do not scatter raw provider calls across UI components.

---

# 83. AI Prompt Ownership

Prompts should belong to the feature or capability that uses them.

Avoid one giant:

```text
prompts.ts
```

containing unrelated product behavior.

---

# 84. AI Output Validation

AI output should be treated as untrusted external output.

Validate:

```text
Structure

Required Fields

Length

Allowed Values
```

where applicable.

Do not assume model output always matches the requested format.

---

# 85. AI Failure Handling

AI features should handle:

```text
Timeout

Provider Failure

Invalid Output

Rate Limit

Partial Response
```

without corrupting product state.

---

# 86. Background Work

Future operations may require background processing.

Examples:

```text
Large Resume Analysis

Search Reindexing

Email Notifications

Large Content Import

Batch AI Generation
```

Do not run long operations inside a user request if they exceed reliable request boundaries.

---

# 87. Background Job Introduction Rule

Do not introduce a queue system until actual asynchronous workload requires it.

When required:

Background jobs should have:

```text
Stable Job Identity

Retry Policy

Failure Handling

Idempotency

Observability
```

---

# 88. Idempotency

Operations that may retry should avoid duplicate side effects.

Example:

```text
Create Mock Interview Result
```

should not create three results because the request retried.

---

# 89. Database Transaction Boundary

Related mutations requiring atomic consistency should use transactions where supported.

Example:

```text
Create Application
+
Create Initial Status History
```

should not leave partial state.

---

# 90. Database Access Rule

UI components should not directly query the database.

Use:

```text
Server Data Function

Repository

Service
```

depending on complexity.

This preserves boundaries and testability.

---

# 91. Database Schema vs Domain Model

Database tables do not need to map one-to-one with UI components.

Avoid:

```text
QuestionCard table
```

because a card exists in the interface.

Persist domain concepts.

Not presentation concepts.

---

# 92. Database Migration Discipline

Schema changes should use versioned migrations.

Do not manually change production schema without reproducible migration history.

---

# 93. Backward-Compatible Migration

For high-impact changes:

Prefer:

```text
Add New Structure

Migrate Data

Update Application

Validate

Remove Old Structure Later
```

over:

```text
Drop Old Column

Deploy

Hope
```

---

# 94. Migration and Deployment Coordination

Application code and database migrations must be deployable safely together.

Avoid requiring:

```text
new code
```

and:

```text
new schema
```

to become active in an impossible exact instant.

---

# 95. Testing Architecture

Testing should follow risk.

Potential layers:

```text
Unit Tests

Integration Tests

Component Tests

End-to-End Tests

SEO Contract Tests

Content Validation Tests
```

Not every function needs every test type.

---

# 96. Unit Tests

Best for:

```text
Pure Domain Logic

Normalization

Ordering

Validation

Canonical URL Logic
```

---

# 97. Integration Tests

Best for:

```text
Repository Behavior

Database Operations

Authentication Boundaries

Search Integration

Content Loading
```

---

# 98. Component Tests

Useful for complex interactive components.

Examples:

```text
Search Interface

Authentication Form

Mock Interview Controls
```

Do not snapshot-test every static wrapper.

---

# 99. End-to-End Tests

Reserve E2E coverage for critical journeys.

Examples:

```text
Open Track
→ Open Module
→ Open Question

Sign In
→ Continue Preparation

Search
→ Open Result

Start Mock Interview
→ Complete Session
```

---

# 100. Architecture Contract Tests

Some of the most valuable tests may verify architecture assumptions.

Examples:

```text
Public page has canonical

Indexable page has valid metadata

Question route returns 404 for invalid slug

Private route requires authentication

No sitemap URL is noindex
```

---

# 101. Dependency Tests

As the repository grows, automated rules may prevent:

```text
shared UI importing feature code

client code importing server-only modules

public feature importing another feature's internals
```

Introduce such tooling when repository complexity justifies it.

---

# 102. Server-Only Module Protection

Modules containing:

```text
Database Access

Secrets

Private API Keys

Server Authentication
```

must not enter client bundles.

Use framework-supported server-only protections where available.

---

# 103. Type Architecture

Types should live near their ownership.

Example:

```text
Preparation-specific types
→ preparation feature/domain

Search result types
→ search feature

Generic button props
→ UI component
```

Avoid one giant global:

```text
types.ts
```

---

# 104. Generated Types

If database or API tools generate types:

Treat generated files as generated artifacts.

Do not manually edit them.

Wrap them where domain-specific behavior is required.

---

# 105. Naming Conventions

Naming should communicate responsibility.

Examples:

```text
QuestionPage

QuestionListItem

getQuestionBySlug

generateQuestionMetadata

QuestionRepository
```

Avoid vague names:

```text
Manager

Handler

Helper

Data

Thing
```

without context.

---

# 106. File Size Is a Signal

A large file is not automatically wrong.

However:

A page file containing:

```text
Data Fetching

SEO

Business Logic

UI

Analytics

Authentication

Formatting

Error Handling
```

is likely carrying too many responsibilities.

Split by responsibility.

Not arbitrary line count.

---

# 107. Component Extraction Rule

Do not extract a component merely because:

```text
the JSX is long
```

Extract when:

```text
The element is reusable

The element has independent responsibility

The element has independent behavior

The page becomes clearer through extraction
```

---

# 108. Premature Componentization

Avoid creating:

```text
QuestionTitleText

QuestionTitleWrapper

QuestionTitleContainer

QuestionTitleSection
```

for a simple heading.

Abstraction should reduce complexity.

Not multiply files.

---

# 109. Shared Component Promotion Rule

A component should move into shared infrastructure only after genuine reuse is demonstrated or clearly inherent.

Example:

```text
Button
```

is inherently shared.

A:

```text
JavaModuleProgressCard
```

is not.

---

# 110. Feature-Specific UI

Feature components should remain near the feature.

Examples:

```text
PreparationProgress

MockInterviewTimer

ResumeIssueCard

ApplicationStatusTimeline
```

Do not globalize them unnecessarily.

---

# 111. Design System Enforcement

All product features should use:

```text
Shared Tokens

Shared UI Primitives

Shared Typography Rules

Shared Spacing Rules
```

Feature ownership does not permit inventing a separate design system.

---

# 112. CSS Architecture

The application should prefer:

```text
Design Tokens

Utility Classes

Component Variants

Limited Global CSS
```

depending on the current stack.

Avoid:

```text
Large uncontrolled global stylesheets

Page-specific global selectors

!important wars
```

---

# 113. Global CSS Responsibility

Global CSS should primarily contain:

```text
Design Tokens

Base Styles

Typography Foundations

Global Accessibility Behavior

Intentional Browser Normalization
```

Not every page's styling.

---

# 114. Tailwind Configuration

If Tailwind is used:

The configuration should reflect the design system.

Avoid arbitrary values everywhere such as:

```text
mt-[37px]

text-[#172819]

rounded-[13px]
```

unless genuinely required.

---

# 115. Component Variant Architecture

Variants should represent real semantic differences.

Example:

```text
Button

primary
secondary
ghost
danger
```

Avoid dozens of page-specific variants.

---

# 116. Icon Architecture

Use the approved icon system consistently.

Do not:

```text
Mix icon libraries

Use random SVG sources

Use emoji as functional icons
```

without a deliberate reason.

---

# 117. Accessibility Architecture

Accessibility belongs at:

```text
Primitive Level

Component Level

Page Level

Workflow Level
```

A perfect Button component cannot fix an inaccessible page hierarchy.

---

# 118. Keyboard Interaction

Interactive components should follow expected keyboard behavior.

Prefer proven accessible primitives for:

```text
Dialogs

Menus

Tabs

Accordions

Selects
```

when appropriate.

---

# 119. Focus Management

Features such as:

```text
Dialogs

Search Overlays

Mobile Navigation
```

must manage focus correctly.

Do not solve visual appearance while ignoring interaction semantics.

---

# 120. Form Architecture

Forms should define:

```text
Schema

Default Values

Client Validation where useful

Server Validation

Submission State

Error State

Success State
```

Avoid custom one-off form behavior for every feature.

---

# 121. Form Error Principle

Errors should appear:

* near the relevant field where appropriate,
* in understandable language,
* without exposing implementation details.

---

# 122. Search Input Architecture

Global search should be one coherent capability.

Avoid separate incompatible search implementations for:

```text
Header

Search Page

Mobile Search

Dashboard
```

Different surfaces may use the same search capability.

---

# 123. Navigation Architecture

Navigation should derive from an intentional navigation model.

Do not duplicate route lists manually across:

```text
Desktop Header

Mobile Menu

Footer

Sidebar
```

when they represent the same destinations.

---

# 124. Navigation Data

Navigation configuration may define:

```text
Label

Destination

Visibility

Optional Icon

Context
```

Do not turn navigation configuration into a full CMS unless required.

---

# 125. Breadcrumb Architecture

Breadcrumbs should derive from canonical page hierarchy.

Avoid manually hardcoding breadcrumb arrays in every question page.

The content hierarchy should provide the context.

---

# 126. URL Generation

Internal links should use centralized route builders where useful.

Example conceptually:

```text
questionUrl(question)

moduleUrl(module)

trackUrl(track)
```

This reduces path inconsistency.

---

# 127. Route Builder Rule

Do not create complex route builders for simple static paths.

Use them where:

* dynamic canonical paths exist,
* route consistency matters,
* migrations may occur.

---

# 128. Redirect Ownership

Redirect rules should have clear ownership.

Potential sources:

```text
Framework Configuration

Redirect Registry

Slug History

Migration Map
```

Avoid random redirects inside page components.

---

# 129. 404 vs Redirect Decision

A missing route should not automatically redirect.

Use:

```text
Redirect
```

only when a meaningful replacement exists.

Otherwise:

```text
404
```

---

# 130. Observability Architecture

The application should eventually provide visibility into:

```text
Errors

Performance

Traffic

Search Health

Background Jobs

External Service Failures
```

Observability should grow with product complexity.

---

# 131. Minimum Early Observability

At the current stage:

Prioritize:

```text
Application Error Monitoring

Basic Web Analytics

Search Console

Cloudflare / Infrastructure Metrics

Production Logs
```

Do not build an expensive enterprise observability platform prematurely.

---

# 132. Health Checks

Future infrastructure may expose health checks for:

```text
Application

Database

Critical Dependencies
```

Do not expose sensitive operational information publicly.

---

# 133. Performance Budgets

Public content pages should have stricter performance expectations than complex authenticated workspaces.

Potential concerns:

```text
JavaScript Bundle

Image Weight

Font Weight

Third-Party Scripts

Server Response Time
```

Performance regressions should be visible.

---

# 134. Bundle Discipline

Before adding a dependency:

Ask:

```text
What does it provide?

Can the existing stack already do this?

Is it client-side?

How large is it?

Will it affect all pages or one feature?
```

Do not install libraries casually.

---

# 135. Dependency Ownership

A dependency should have a reason.

Remove:

```text
Unused

Duplicate

Abandoned

Redundant
```

dependencies during controlled cleanup.

Do not perform mass dependency upgrades simultaneously with architectural migration unless necessary.

---

# 136. Dependency Upgrade Rule

Separate:

```text
Architecture Change

Framework Upgrade

Major Dependency Upgrade
```

where practical.

Combining all three makes failures difficult to diagnose.

---

# 137. Security Architecture

Security responsibilities include:

```text
Authentication

Authorization

Input Validation

Output Safety

Secret Management

Dependency Security

Rate Limiting

Abuse Protection
```

Security should be proportional to the feature risk.

---

# 138. Public Read Endpoints

Public content may be openly readable.

However:

Expensive endpoints such as:

```text
AI Generation

Large Search Queries

Resume Processing
```

may require:

```text
Authentication

Rate Limiting

Usage Controls
```

---

# 139. Rate Limiting

Rate limiting should be introduced where abuse or cost risk exists.

Examples:

```text
Login Attempts

AI Generation

Search Abuse

Feedback Spam
```

Do not rate-limit ordinary static content unnecessarily.

---

# 140. Secret Management

Secrets should exist only in secure server environments.

Never:

```text
Commit secrets

Expose them to browser bundles

Print them in logs
```

---

# 141. Content Security

Rendered content should be treated according to trust level.

If arbitrary HTML is allowed:

Sanitization is required.

Prefer safer structured content formats where practical.

---

# 142. Future Repository Separation

Interview Explainer may eventually use multiple repositories.

Potential domains:

```text
Web Product

Content Generation Pipeline

AI Evaluation Services

Data / Analytics

Infrastructure
```

However:

Repository separation should follow real ownership and deployment boundaries.

Not aesthetic preference.

---

# 143. Monorepo vs Multiple Repositories

The decision should consider:

```text
Deployment Independence

Team Ownership

Shared Code

Release Cadence

Security Boundaries

Operational Complexity
```

Do not split a small tightly coupled product into many repositories merely to appear scalable.

---

# 144. Current V2 Repository Principle

For the current web application:

Prefer a coherent application repository with strong internal feature boundaries.

This provides:

```text
Simpler Development

Simpler Deployment

Shared Design System

Easier Refactoring
```

until real boundaries justify separation.

---

# 145. Content Engine Separation

If a separate content-generation engine exists or is created:

It should not become the runtime source of truth merely because it generates content.

Conceptually:

```text
Content Generation System
    ↓
Validated Content Artifact
    ↓
Canonical Content Store
    ↓
Interview Explainer Runtime
```

Generation and serving are different responsibilities.

---

# 146. Mock Interview Separation

Mock interviews may eventually require:

```text
Session State

Real-Time Interaction

AI Calls

Evaluation

Persistence
```

This feature may become architecturally substantial.

It should remain isolated behind a feature boundary rather than spreading AI session logic throughout the application.

---

# 147. Resume Analysis Separation

Resume processing may require:

```text
File Upload

Parsing

Extraction

AI Analysis

Result Storage
```

These responsibilities should belong to the resume feature and supporting infrastructure.

The dashboard should consume results.

It should not perform resume processing.

---

# 148. Job System Separation

Future job functionality may include:

```text
Job Discovery

Job Storage

Matching

Application Tracking
```

These are related but not identical responsibilities.

The architecture should permit future separation without requiring it today.

---

# 149. Real Interview Workspace Separation

A real interview workspace may aggregate:

```text
Company

Role

Date

Resume

Preparation

Mock Interviews

Notes
```

It is an orchestration feature.

It should consume other capabilities through public interfaces.

It should not own all underlying data systems.

---

# 150. Dashboard as Aggregator

The dashboard is an aggregator.

It may consume:

```text
Preparation

Mock Interviews

Applications

Interviews

Resume
```

The dashboard should not become the owner of those domains.

---

# 151. Cross-Feature Composition

Cross-feature pages should compose public feature interfaces.

Example:

```text
Dashboard
    ↓
Preparation Summary

Mock Interview Summary

Application Summary
```

Each underlying feature owns its data and logic.

---

# 152. Circular Dependency Prevention

Potential bad cycle:

```text
Dashboard
→ Preparation

Preparation
→ Dashboard
```

Avoid.

A lower-level feature should not depend on the aggregator that displays it.

---

# 153. Shared Domain Extraction

If two features genuinely share a domain concept:

Extract the concept into an appropriate shared domain layer.

Do not make one feature import another's internals.

---

# 154. Architecture Decision Records

Significant architectural decisions should be documented.

Potential examples:

```text
Why question URLs remain flat

Why public content uses server rendering

Why current content remains file-based

Why a database was introduced

Why a search provider was selected
```

An ADR should record:

```text
Context

Decision

Consequences
```

---

# 155. ADR Threshold

Do not write an ADR for every button.

Use ADRs for decisions that:

* affect many features,
* are difficult to reverse,
* or future developers may reasonably question.

---

# 156. AI Coding Agent Architecture Context

AI coding agents should read:

```text
AI Constitution

Information Architecture

Design System

Component Library

Page Archetypes

SEO Architecture

Content Architecture

Application Architecture
```

before large implementation work.

The purpose is to reduce architectural drift across long sessions.

---

# 157. AI Agent Task Scope

Each implementation task should define:

```text
Objective

Allowed Scope

Forbidden Scope

Relevant Architecture Documents

Files Expected to Change

Validation Commands

Acceptance Criteria
```

Do not ask:

```text
Improve the whole website.
```

for production implementation.

---

# 158. AI Agent Repository Rule

Before editing:

The agent should inspect:

```text
Current Structure

Existing Components

Existing Patterns

Current Dependencies

Current Routes

Current Data Flow
```

It must not assume the theoretical architecture already exists.

---

# 159. AI Agent Minimal Change Rule

When fixing one feature:

Do not rewrite unrelated architecture unless required.

If broader refactoring is needed:

Document it as a separate task.

---

# 160. AI Agent No-Duplicate-System Rule

Before creating:

```text
New Button

New Card

New Metadata Helper

New Data Loader

New Search Function

New Route Utility
```

the agent must search for an existing equivalent.

Duplicate systems are one of the largest risks in AI-assisted development.

---

# 161. AI Agent Import Rule

The agent should respect feature boundaries.

It must not solve a problem by:

```text
importing internal files from unrelated features
```

merely because that is faster.

---

# 162. AI Agent Client Component Rule

The agent must justify new client boundaries.

It must not add:

```text
"use client"
```

to a large route or layout merely to resolve one interactive requirement.

---

# 163. AI Agent Dependency Rule

The agent must not install a new dependency without:

```text
Identifying the requirement

Checking existing capabilities

Explaining why the dependency is needed

Considering bundle / maintenance impact
```

---

# 164. AI Agent Migration Rule

The agent must not simultaneously:

```text
Redesign UI

Change Routes

Change Content Schema

Rewrite Answers

Upgrade Framework

Replace Authentication
```

unless the task explicitly requires a coordinated migration.

Large transformations should be staged.

---

# 165. AI Agent Deletion Rule

The agent must not delete:

```text
Components

Routes

Content

Dependencies

Configuration
```

merely because they appear unused from a quick search.

Usage must be verified.

---

# 166. Architecture Validation Questions

Before approving a significant implementation:

```text
Does the route remain thin?

Is business logic owned by the correct feature?

Is the content source still canonical?

Did we create unnecessary client rendering?

Did we duplicate an existing component or utility?

Did we introduce a reverse dependency?

Did we mix user data with global content?

Did we preserve SEO behavior?

Did we preserve public URLs?

Is error handling appropriate?

Is the change testable?

Can future developers understand where this responsibility belongs?
```

---

# 167. V2 Implementation Strategy

The application architecture should be introduced incrementally.

Recommended sequence:

```text
PHASE 1 — REPOSITORY AUDIT

1. Map current routes.
2. Map current components.
3. Map current content sources.
4. Map current data access.
5. Identify client-heavy areas.
6. Identify duplicated systems.
7. Identify global CSS and styling debt.
8. Identify authentication boundaries.
9. Identify SEO logic.
10. Identify dead or uncertain code.

PHASE 2 — FOUNDATIONAL BOUNDARIES

11. Establish design tokens.
12. Establish shared UI primitives.
13. Establish layout primitives.
14. Establish canonical route helpers where needed.
15. Establish SEO infrastructure.
16. Establish content access boundary.
17. Establish environment configuration.

PHASE 3 — PUBLIC PAGE MIGRATION

18. Migrate global shell.
19. Migrate homepage.
20. Migrate directory pages.
21. Migrate track pages.
22. Migrate major-area pages.
23. Migrate module pages.
24. Migrate question pages.
25. Validate responsive behavior.
26. Validate SEO behavior.

PHASE 4 — AUTHENTICATED PRODUCT

27. Normalize authentication boundaries.
28. Migrate dashboard.
29. Separate user progress.
30. Improve authenticated shell.

PHASE 5 — FUTURE FEATURES

31. Mock Interview feature boundary.
32. Resume feature boundary.
33. Job feature boundary.
34. Application feature boundary.
35. Real Interview workspace boundary.
```

---

# 168. No Big-Bang Rewrite Rule

V2 should not require:

```text
Delete V1
    ↓
Build everything again
    ↓
Launch months later
```

Prefer:

```text
Audit
    ↓
Establish Foundations
    ↓
Migrate Archetype by Archetype
    ↓
Validate
    ↓
Continue
```

This reduces risk.

---

# 169. Vertical Slice Migration

A useful migration unit may be:

```text
One Page Archetype
```

Example:

```text
Question Page

Design System
+
Components
+
Data Loading
+
SEO
+
Responsive Behavior
+
Testing
```

Complete the archetype properly.

Then reuse the architecture.

---

# 170. Migration Priority

The initial migration should prioritize high-impact public experiences.

Potential order:

```text
Global Shell

Question Page

Module Page

Track Hub

Homepage

Directories

Company / Role Pages

Dashboard
```

The exact order should follow repository audit findings.

---

# 171. Question Page as Architecture Test

The question page is an excellent V2 architecture test because it requires:

```text
Content

Typography

SEO

Breadcrumbs

Navigation

Code Rendering

Responsive Layout

Optional User State

Related Content
```

If the architecture handles the question page cleanly:

Many core boundaries are likely working.

---

# 172. Migration Compatibility Layer

Temporary adapters are acceptable.

Examples:

```text
Legacy Content
    ↓
V2 Content Adapter

Legacy Route
    ↓
Canonical Route Resolver

Legacy Component Data
    ↓
V2 View Model
```

Temporary compatibility code should be clearly marked and eventually removed.

---

# 173. Temporary Code Rule

Temporary architecture must have:

```text
Reason

Owner

Removal Condition
```

Otherwise temporary code becomes permanent.

---

# 174. Architecture Cleanup Timing

Do not attempt to clean every file before V2 migration begins.

Clean when:

```text
The area is being migrated

The cleanup unlocks foundational architecture

The code is clearly dangerous
```

Avoid endless preparatory refactoring.

---

# 175. Architecture Definition of Done

The V2 application architecture is established when:

```text
[ ] Route responsibilities are clear

[ ] Public and authenticated shells are separated where appropriate

[ ] Feature ownership is documented

[ ] Shared UI boundaries are clear

[ ] Content access is centralized enough to avoid page-level source coupling

[ ] SEO infrastructure has clear ownership

[ ] Server/client boundaries are intentional

[ ] Public content does not require unnecessary client rendering

[ ] User-specific data is separated from public content

[ ] Authentication and authorization responsibilities are clear

[ ] Error handling has consistent categories

[ ] Loading boundaries follow page archetypes

[ ] Configuration is centralized and validated

[ ] External services have explicit boundaries

[ ] Analytics and logging do not leak across random files

[ ] Testing responsibilities are defined

[ ] AI agents have architectural constraints

[ ] V2 can be migrated incrementally

[ ] Future features can be added without turning the dashboard or app directory into the owner of everything
```

---

# 176. Final Application Architecture Principle

Interview Explainer V2 should not optimize for:

```text
The fewest number of files.
```

Nor should it optimize for:

```text
The maximum number of architectural layers.
```

It should optimize for:

> **Clear ownership of responsibility.**

The permanent application architecture principles are:

> **Routes compose.**

> **Features own product capabilities.**

> **Domain concepts remain independent of page presentation.**

> **Data access hides storage details.**

> **Shared UI contains genuinely shared visual foundations.**

> **Public content is server-first.**

> **Client interactivity is introduced deliberately.**

> **User state remains separate from canonical content.**

> **SEO is infrastructure, not scattered page decoration.**

> **Search consumes canonical content; it does not own it.**

> **The dashboard aggregates features; it does not own them.**

> **Future workspaces orchestrate capabilities through boundaries.**

> **External providers remain replaceable behind internal interfaces.**

> **Errors should fail at the smallest appropriate scope.**

> **Configuration should be explicit and validated.**

> **Public URLs and content identity are infrastructure.**

> **Large migrations require compatibility and staged rollout.**

> **AI agents must follow existing architecture rather than inventing a new one per task.**

> **A new abstraction must reduce complexity, not merely move it.**

> **A monolith with strong boundaries is better than premature distributed complexity.**

> **V2 is an incremental architectural migration—not a blind rewrite.**

The desired result is a repository where a developer or AI coding agent can answer:

```text
Where does this feature belong?

Where does this data come from?

Who owns this business rule?

Should this component be shared?

Should this code run on the server or client?

What happens if this fails?

Will this affect SEO?

Will this affect a public URL?

How can this be tested?
```

without guessing.

That is the foundation required for Interview Explainer to grow from its current content product into a larger interview and career platform without repeatedly rebuilding the entire application.
