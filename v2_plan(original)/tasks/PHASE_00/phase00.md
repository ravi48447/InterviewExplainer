# PHASE 00 — REPOSITORY, FRONTEND, BACKEND & PRODUCTION TRUTH

## Phase Objective

Establish an accurate, repository-specific understanding of the current Interview Explainer system before root-level V2 implementation begins.

Phase 00 must answer:

* What currently exists?
* What is actually used?
* Which URLs are public?
* Which pages are indexable?
* Where does content come from?
* How does the frontend communicate with the backend?
* How are users authenticated?
* Which database structures support current features?
* Which systems are duplicated or conflicting?
* Which immediate security or build issues could block V2?
* What current production behavior must not be accidentally broken?

Phase 00 is **not** intended to perfect the system.

It should produce enough verified truth to begin:

* Phase 01 — Root UI Architecture Rebuild
* Phase 02 — Root SEO, Indexing, Routing & URL Rebuild

---

# Workstream A — Repository & Architecture Truth

## TASK-0001 — Consolidate Existing Repository Audit

Review the completed repository audit and consolidate its verified findings into the canonical V2 repository audit document.

**Primary output:** `V2_REPOSITORY_AUDIT.md`
**Priority:** P0
**Status:** Existing audit work available; consolidation/verification required.

---

## TASK-0002 — Verify Current Repository Structure

Compare the existing audit against the current V2 working branch and identify files, directories or systems that have changed since the original audit.

**Priority:** P0

---

## TASK-0003 — Map Frontend Application Structure

Document the current frontend architecture, including:

* App Router structure
* layouts
* pages
* route handlers
* providers
* components
* feature modules
* utilities
* hooks
* services
* configuration
* styles
* content loaders

**Priority:** P0

---

## TASK-0004 — Map Backend Application Structure

Document the current Spring Boot architecture, including:

* controllers
* services
* repositories
* entities
* DTOs
* configuration
* authentication
* authorization
* search
* recommendations
* progress
* bookmarks
* dashboard
* database migrations

**Priority:** P0

---

## TASK-0005 — Map Frontend-to-Backend Integration

Identify every important frontend-to-backend interaction and classify whether it uses:

* direct backend API calls,
* Next.js route handlers,
* server-side fetches,
* client-side fetches,
* local content files,
* generated registries,
* direct database-dependent APIs.

**Priority:** P0

---

## TASK-0006 — Map Major Application Data Flows

Document the end-to-end data flow for:

* public content,
* question pages,
* search,
* authentication,
* bookmarks,
* completion,
* progress,
* dashboard,
* recommendations.

**Priority:** P0

---

## TASK-0007 — Identify Duplicate Architectural Systems

Find overlapping implementations for:

* navigation,
* content loading,
* search,
* authentication,
* metadata,
* URL generation,
* sitemap generation,
* question rendering,
* progress,
* recommendations.

**Priority:** P0

---

## TASK-0008 — Identify Legacy and Transitional Systems

Classify systems as:

* ACTIVE
* V2 TARGET
* LEGACY
* TRANSITIONAL
* GENERATED
* UNKNOWN

**Priority:** P1

---

## TASK-0009 — Identify High-Risk Shared Files

Create a list of files whose modification could affect large portions of the product, such as:

* root layouts,
* global styles,
* routing configuration,
* authentication configuration,
* canonical URL utilities,
* content loaders,
* shared navigation,
* shared answer renderers.

**Priority:** P0

---

## TASK-0010 — Create Repository Change-Risk Map

Classify major systems by migration risk and define where changes require additional regression protection.

**Priority:** P1

---

# Workstream B — Route & URL Truth

## TASK-0011 — Inventory Every Frontend Page Route

Enumerate all static and dynamic App Router pages.

**Primary output:** `V2_ROUTE_INVENTORY.md`
**Priority:** P0

---

## TASK-0012 — Inventory Every Route Handler

Document all frontend API and route-handler endpoints.

**Priority:** P0

---

## TASK-0013 — Inventory Every Backend API Endpoint

Document current Spring Boot endpoints and their consumers.

**Priority:** P0

---

## TASK-0014 — Classify Every Frontend Route

Classify routes as:

* PUBLIC INDEXABLE
* PUBLIC NOINDEX
* AUTHENTICATED
* INTERNAL
* DEVELOPMENT
* PREVIEW
* LEGACY
* UNKNOWN

**Priority:** P0

---

## TASK-0015 — Identify Dynamic Route Families

Document dynamic URL patterns for:

* domains,
* stacks,
* pillars,
* modules,
* questions,
* topics,
* companies,
* comparisons,
* tools,
* roadmaps,
* cheatsheets,
* DSA,
* other dynamic content.

**Priority:** P0

---

## TASK-0016 — Inventory Rewrites

Document every rewrite and explain:

* source URL,
* destination,
* reason,
* whether the destination is internal,
* whether the behavior is still required.

**Priority:** P0

---

## TASK-0017 — Inventory Redirects

Document all permanent and temporary redirects.

**Priority:** P0

---

## TASK-0018 — Identify Internal Rendering Routes

Find routes used only to render or resolve public URLs internally.

**Priority:** P0

---

## TASK-0019 — Identify Public URL Aliases

Find cases where multiple public URLs can resolve to the same content.

**Priority:** P0

---

## TASK-0020 — Identify Potential Duplicate URL Paths

Detect:

* trailing-slash variants,
* case variants,
* alternate slug structures,
* rewrite aliases,
* legacy aliases,
* parameter-order variants.

**Priority:** P0

---

## TASK-0021 — Establish Current Public URL Baseline

Create the list of existing public URLs and route patterns that V2 must intentionally preserve, redirect or retire.

**Priority:** P0

---

## TASK-0022 — Identify Broken or Unresolved Routes

Find routes that currently produce:

* 404,
* 500,
* empty content,
* redirect loops,
* unexpected fallback behavior.

**Priority:** P0

---

## TASK-0023 — Identify Orphan Route Families

Find public route families that are technically available but poorly linked from the rest of the application.

**Priority:** P1

---

## TASK-0024 — Create Route Migration Classification

Assign every route family one of:

* PRESERVE
* REBUILD IN PLACE
* CONSOLIDATE
* REDIRECT
* REMOVE
* INVESTIGATE

**Priority:** P0

---

# Workstream C — Current SEO & Indexing Truth

## TASK-0025 — Inventory All Metadata Implementations

Find:

* static metadata,
* `generateMetadata`,
* metadata helpers,
* page-specific SEO utilities,
* fallback metadata.

**Primary output:** `V2_SEO_AUDIT.md`
**Priority:** P0

---

## TASK-0026 — Inventory Canonical URL Implementations

Find every place canonical URLs are generated or hard-coded.

**Priority:** P0

---

## TASK-0027 — Identify Missing Canonicals

Find public indexable route families without reliable canonical URLs.

**Priority:** P0

---

## TASK-0028 — Identify Canonical Mismatches

Find pages where the canonical URL may differ from the actual intended public URL.

**Priority:** P0

---

## TASK-0029 — Inventory robots.txt Behavior

Document current crawler rules and their effect.

**Priority:** P0

---

## TASK-0030 — Inventory Page-Level Robots Directives

Find:

* `index`,
* `noindex`,
* `follow`,
* `nofollow`,
* conflicting directives.

**Priority:** P0

---

## TASK-0031 — Inventory Sitemap Architecture

Document:

* sitemap index,
* child sitemaps,
* generated sitemap routes,
* static sitemap files,
* content sources used to generate URLs.

**Priority:** P0

---

## TASK-0032 — Compare Sitemap Coverage Against Route Inventory

Determine which intended public pages are:

* included,
* missing,
* duplicated,
* noncanonical,
* redirected,
* invalid.

**Priority:** P0

---

## TASK-0033 — Identify Sitemap URLs That Do Not Return Canonical 200 Responses

Find sitemap URLs that:

* redirect,
* return 404,
* return 5xx,
* resolve to noncanonical variants.

**Priority:** P0

---

## TASK-0034 — Inventory Structured Data

Find all JSON-LD and schema implementations.

**Priority:** P1

---

## TASK-0035 — Identify Structured Data Duplication or Conflicts

Find pages emitting overlapping, invalid or inconsistent schemas.

**Priority:** P1

---

## TASK-0036 — Inventory Breadcrumb SEO Implementation

Determine whether breadcrumb UI and breadcrumb schema share a consistent hierarchy.

**Priority:** P1

---

## TASK-0037 — Identify Client-Only Critical SEO Content

Find public pages where important indexable content may depend unnecessarily on client-side rendering.

**Priority:** P0

---

## TASK-0038 — Identify Thin or Empty Search-Visible Routes

Find indexable routes that render insufficient useful content.

**Priority:** P1

---

## TASK-0039 — Identify SEO Logic Duplication

Map duplicated implementations of:

* titles,
* descriptions,
* canonical URLs,
* schemas,
* sitemap URLs,
* robots directives.

**Priority:** P0

---

## TASK-0040 — Create Current Indexability Matrix

For each public route family, record:

* intended indexability,
* actual indexability,
* canonical behavior,
* sitemap presence,
* internal-link availability.

**Priority:** P0

---

# Workstream D — Content & Taxonomy Truth

## TASK-0041 — Inventory Every Content Source

Identify all sources of public content.

**Primary output:** `V2_CONTENT_INVENTORY.md`
**Priority:** P0

---

## TASK-0042 — Classify Content Sources

Classify each source as:

* AUTHORITATIVE
* GENERATED
* RUNTIME
* CACHE
* LEGACY
* DUPLICATE
* UNKNOWN

**Priority:** P0

---

## TASK-0043 — Count Major Content Entities

Count:

* domains,
* stacks,
* pillars,
* modules,
* questions,
* topics,
* companies,
* comparisons,
* tools,
* roadmaps,
* cheatsheets,
* DSA entities.

**Priority:** P1

---

## TASK-0044 — Map Content Hierarchy

Document the current relationships between:

```text
Domain
    ↓
Stack
    ↓
Pillar
    ↓
Module
    ↓
Question
```

and all exceptions.

**Priority:** P0

---

## TASK-0045 — Inventory Slug Generation

Find every slug-generation implementation.

**Priority:** P0

---

## TASK-0046 — Identify Slug Collisions

Detect duplicate or ambiguous slugs.

**Priority:** P0

---

## TASK-0047 — Identify Identifier Instability

Find entities whose public identity depends on unstable array positions, mutable names or inconsistent IDs.

**Priority:** P0

---

## TASK-0048 — Identify Duplicate Content Records

Find content represented in multiple active sources.

**Priority:** P0

---

## TASK-0049 — Identify Content Synchronization Logic

Document any scripts, builds or runtime processes that copy or transform content.

**Priority:** P1

---

## TASK-0050 — Identify Content Loading Paths

Map how each route family obtains its content.

**Priority:** P0

---

## TASK-0051 — Identify Content Loading Failures

Find missing-content and fallback behavior that can create broken pages or soft 404s.

**Priority:** P0

---

## TASK-0052 — Create Content Source-of-Truth Decision Inputs

Prepare the evidence required for later canonicalization without prematurely rewriting the content architecture.

**Priority:** P0

---

# Workstream E — Current UI & Component Truth

## TASK-0053 — Inventory Global Styling Sources

Find:

* global CSS,
* Tailwind configuration,
* CSS variables,
* theme configuration,
* component-level styles,
* inline styles.

**Priority:** P0

---

## TASK-0054 — Inventory Shared UI Components

Create a repository-wide list of reusable UI primitives and shared components.

**Priority:** P0

---

## TASK-0055 — Identify Duplicate UI Components

Find overlapping implementations of:

* buttons,
* cards,
* badges,
* inputs,
* navigation,
* sidebars,
* breadcrumbs,
* dialogs,
* loaders,
* code blocks.

**Priority:** P0

---

## TASK-0056 — Identify Hard-Coded Color Usage

Find uncontrolled color values and arbitrary visual styling.

**Priority:** P1

---

## TASK-0057 — Identify Hard-Coded Spacing and Width Patterns

Find repeated arbitrary layout values that contribute to inconsistency.

**Priority:** P1

---

## TASK-0058 — Identify Excessive Card and Box Usage

Locate route families and components where unnecessary containers create visual density.

**Priority:** P0

---

## TASK-0059 — Identify Typography Inconsistency

Map competing heading, body, metadata and code styles.

**Priority:** P0

---

## TASK-0060 — Identify Page Width and Reading Width Inconsistency

Find pages using incompatible content widths and line lengths.

**Priority:** P0

---

## TASK-0061 — Identify Light/Dark Theme Inconsistency

Find components that do not correctly use semantic theme values.

**Priority:** P1

---

## TASK-0062 — Identify Responsive Architecture Problems

Find shared components and page families with major mobile or tablet issues.

**Priority:** P0

---

## TASK-0063 — Identify Legacy V1 UI Systems

Classify components and styles that should be replaced during V2.

**Priority:** P0

---

## TASK-0064 — Create UI Migration Inventory

For every major shared component and route family, classify:

* KEEP
* MODIFY
* REBUILD
* CONSOLIDATE
* REMOVE

**Priority:** P0

---

# Workstream F — Backend, API & Database Truth

## TASK-0065 — Inventory Backend Controllers

Map controller responsibilities and API boundaries.

**Priority:** P0

---

## TASK-0066 — Inventory Backend Services

Map business logic and major service dependencies.

**Priority:** P0

---

## TASK-0067 — Inventory Backend Repositories

Map persistence responsibilities.

**Priority:** P1

---

## TASK-0068 — Inventory Database Entities

Document current persistence models and relationships.

**Priority:** P0

---

## TASK-0069 — Inventory DTOs and API Contracts

Identify the active request/response contracts consumed by the frontend.

**Priority:** P0

---

## TASK-0070 — Identify Duplicate or Conflicting API Responsibilities

Find cases where multiple APIs provide overlapping functionality.

**Priority:** P0

---

## TASK-0071 — Identify Frontend Workarounds for Backend Problems

Find UI-side complexity caused by unstable or insufficient backend contracts.

**Priority:** P1

---

## TASK-0072 — Identify Backend Work That Is Actually Unnecessary

Prevent V2 from rewriting stable backend systems merely for architectural symmetry.

**Priority:** P1

---

## TASK-0073 — Inventory Database Migration System

Document Flyway, legacy SQL migrations and schema-generation behavior.

**Priority:** P0

---

## TASK-0074 — Identify Schema Ownership Conflicts

Find cases where multiple systems can modify database structure.

**Priority:** P0

---

## TASK-0075 — Inventory Redis and Caching Usage

Document where cache state affects content, users, search or recommendations.

**Priority:** P1

---

## TASK-0076 — Identify High-Risk Backend Dependencies

Find services or APIs whose changes could affect multiple product areas.

**Priority:** P0

---

## TASK-0077 — Create Backend Migration Classification

For major backend systems, classify:

* PRESERVE
* FIX
* CONSOLIDATE
* REBUILD
* REMOVE
* INVESTIGATE

**Priority:** P0

---

# Workstream G — Authentication & User-State Truth

## TASK-0078 — Map Authentication Entry Points

Document every supported authentication mechanism.

**Priority:** P0

---

## TASK-0079 — Map Session Lifecycle

Document creation, validation, refresh, expiration and logout behavior.

**Priority:** P0

---

## TASK-0080 — Map Authorization Boundaries

Identify where access control is enforced.

**Priority:** P0

---

## TASK-0081 — Map User Persistence

Document the canonical database records associated with users.

**Priority:** P0

---

## TASK-0082 — Map Bookmark Data Flow

Trace bookmark state from UI to persistence.

**Priority:** P1

---

## TASK-0083 — Map Completion and Progress Data Flow

Trace completion and progress behavior.

**Priority:** P0

---

## TASK-0084 — Map Dashboard Data Flow

Document every source feeding the dashboard.

**Priority:** P1

---

## TASK-0085 — Map Recommendation Data Flow

Document recommendation inputs and execution.

**Priority:** P1

---

## TASK-0086 — Identify Duplicate User-State Systems

Find competing frontend, backend or local-storage implementations.

**Priority:** P0

---

## TASK-0087 — Identify User-State Integrity Risks

Find unstable identifiers, ownership issues or synchronization problems.

**Priority:** P0

---

# Workstream H — Search & Discovery Truth

## TASK-0088 — Inventory Search Implementations

Find all frontend and backend search systems.

**Priority:** P0

---

## TASK-0089 — Identify Search Data Sources

Determine what data each search implementation searches.

**Priority:** P0

---

## TASK-0090 — Map Search Request Flow

Trace query input through result rendering.

**Priority:** P0

---

## TASK-0091 — Identify Search Ranking Logic

Document exact, partial, fuzzy or custom ranking behavior.

**Priority:** P1

---

## TASK-0092 — Identify Search Scalability Risks

Find approaches likely to fail as content volume grows.

**Priority:** P1

---

## TASK-0093 — Inventory Related-Content Systems

Map related questions, recommendations and continuation logic.

**Priority:** P1

---

## TASK-0094 — Identify Discovery Duplication

Find overlapping search, tree-navigation and recommendation systems.

**Priority:** P0

---

# Workstream I — Build, Runtime, Security & Production Baseline

## TASK-0095 — Verify Frontend Installation

Record the canonical dependency-installation process and blockers.

**Priority:** P0

---

## TASK-0096 — Verify Frontend Type Checking

Record current type errors and distinguish existing failures from future regressions.

**Priority:** P0

---

## TASK-0097 — Verify Frontend Linting

Record current lint behavior and major blockers.

**Priority:** P1

---

## TASK-0098 — Verify Frontend Production Build

Confirm whether the current frontend builds successfully.

**Priority:** P0

---

## TASK-0099 — Verify Backend Build

Confirm the current backend build and test state.

**Priority:** P0

---

## TASK-0100 — Inventory Runtime Environment Requirements

Document required:

* Node version,
* Java version,
* database,
* Redis,
* environment variables,
* external services.

**Priority:** P0

---

## TASK-0101 — Audit Tracked Secrets and Credentials

Identify credentials or secrets that must not remain in source control.

**Priority:** P0

---

## TASK-0102 — Remove Confirmed Exposed Secrets

Remove confirmed sensitive values from tracked files and replace them with environment-based configuration.

**Priority:** P0

---

## TASK-0103 — Rotate Exposed Credentials Where Required

Treat previously committed credentials as potentially compromised.

**Priority:** P0

---

## TASK-0104 — Identify Unsafe Development Defaults

Find production-risky fallback credentials, permissive settings or debug behavior.

**Priority:** P0

---

## TASK-0105 — Inventory Production Deployment Architecture

Document how the current application is served and connected in production.

**Priority:** P0

---

## TASK-0106 — Capture Representative Production Route Baseline

Record behavior for major route families before migration.

**Primary output:** `V2_BASELINE_REPORT.md`
**Priority:** P0

---

## TASK-0107 — Capture Current Performance Baseline

Record representative loading and rendering characteristics where measurable.

**Priority:** P1

---

## TASK-0108 — Capture Current Search Visibility Baseline

Record available:

* indexed-page signals,
* impressions,
* clicks,
* CTR,
* average position,
* sitemap status.

**Priority:** P1

---

## TASK-0109 — Capture Current User Journey Baseline

Document the current behavior of:

* content discovery,
* question reading,
* search,
* login,
* bookmarks,
* progress,
* dashboard.

**Priority:** P1

---

# Workstream J — Phase 00 Consolidation & Transition to Implementation

## TASK-0110 — Consolidate Critical Findings

Summarize only findings that materially affect V2 implementation.

**Priority:** P0

---

## TASK-0111 — Create P0 Blocker List

Identify issues that must be resolved before Phase 01 or Phase 02 implementation.

**Priority:** P0

---

## TASK-0112 — Create P1 Migration Risk List

Identify important but nonblocking migration risks.

**Priority:** P1

---

## TASK-0113 — Populate V2 Decision Inputs

Prepare unresolved architectural decisions for explicit resolution.

**Priority:** P0

---

## TASK-0114 — Populate V2 Issue Log

Record verified current-state defects and technical risks.

**Priority:** P1

---

## TASK-0115 — Finalize Route Inventory Document

Complete `V2_ROUTE_INVENTORY.md`.

**Priority:** P0

---

## TASK-0116 — Finalize SEO Audit Document

Complete `V2_SEO_AUDIT.md`.

**Priority:** P0

---

## TASK-0117 — Finalize Content Inventory Document

Complete `V2_CONTENT_INVENTORY.md`.

**Priority:** P0

---

## TASK-0118 — Finalize Baseline Report

Complete `V2_BASELINE_REPORT.md`.

**Priority:** P0

---

## TASK-0119 — Create Repository-Specific V2 Technical Implementation Plan

Translate verified repository truth into the actual migration strategy for:

* UI,
* SEO,
* routing,
* content,
* frontend,
* backend,
* database,
* search,
* authentication,
* user state.

**Primary output:** `V2_TECHNICAL_IMPLEMENTATION_PLAN.md`
**Priority:** P0

---

## TASK-0120 — Approve Phase 00 Exit

Confirm that enough repository truth exists to begin implementation-heavy phases without unresolved P0 uncertainty.

**Priority:** P0

---

# Phase 00 Exit Criteria

Phase 00 is complete when:

* the current repository architecture is understood,
* frontend and backend boundaries are mapped,
* public route families are inventoried,
* current public URL behavior is known,
* SEO and indexing architecture is understood,
* sitemap behavior is known,
* content sources and hierarchy are mapped,
* major UI systems and duplicate components are identified,
* backend/API/database responsibilities are mapped,
* authentication and user-state flows are understood,
* search architecture is understood,
* current builds are baselined,
* immediate security blockers are addressed,
* production behavior is baselined,
* Phase 01 and Phase 02 can begin without major architectural guesswork.

---

# Phase 00 Guardrail

Phase 00 must not become an endless analysis phase.

The rule is:

```text
DISCOVER ENOUGH TO CHANGE SAFELY
        ↓
DOCUMENT THE VERIFIED TRUTH
        ↓
REMOVE IMMEDIATE BLOCKERS
        ↓
BEGIN IMPLEMENTATION
```

Do not postpone root UI and SEO work merely to achieve perfect documentation.

The next major phases are intentionally implementation-heavy:

```text
PHASE 01
ROOT UI ARCHITECTURE REBUILD

        +

PHASE 02
ROOT SEO, INDEXING, ROUTING & URL REBUILD
```
