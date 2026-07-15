# PHASE 05 — CONTENT DISCOVERY HIERARCHY REBUILD

## DOMAIN → STACK → PILLAR → MODULE

---

# Phase Objective

Rebuild the complete public content-discovery hierarchy of Interview Explainer.

The canonical hierarchy is:

```text
DOMAIN
   ↓
STACK
   ↓
PILLAR
   ↓
MODULE
   ↓
QUESTION
```

Examples:

```text
Software Engineering
        ↓
Java Backend
        ↓
Spring Boot
        ↓
Spring Security
        ↓
How does Spring Security authentication work?
```

Another example:

```text
Data & Analytics
        ↓
Data Analyst
        ↓
SQL
        ↓
Window Functions
        ↓
What is the difference between ROW_NUMBER, RANK and DENSE_RANK?
```

Future example:

```text
Management Consulting
        ↓
Case Interviews
        ↓
Profitability
        ↓
Profitability Framework
        ↓
How would you investigate declining profits?
```

The hierarchy must support the current content library while remaining extensible to:

* software engineering,
* DevOps,
* cloud,
* data engineering,
* data analytics,
* data science,
* product management,
* management consulting,
* behavioral interviews,
* company-specific preparation,
* future interview domains.

The goal is not to create four visually similar pages with different titles.

Each hierarchy level has a different job.

```text
DOMAIN
= What broad interview area do I want to prepare for?

STACK
= What role or technology track am I preparing for?

PILLAR
= What major competency area must I understand?

MODULE
= What focused topic should I study now?

QUESTION
= What exact interview concept should I learn?
```

The architecture must provide:

* clear hierarchy,
* low cognitive load,
* strong internal linking,
* crawlable navigation,
* useful SEO landing pages,
* meaningful progression,
* mobile usability,
* consistent V2 visual design,
* scalable rendering for thousands of questions.

---

# Core Architectural Principle

```text
DO NOT SHOW THE ENTIRE CONTENT DATABASE
AT EVERY LEVEL

EACH LEVEL SHOULD REVEAL
ONLY THE NEXT MEANINGFUL LEVEL
```

Therefore:

```text
DOMAIN PAGE
    → STACKS

STACK PAGE
    → PILLARS

PILLAR PAGE
    → MODULES

MODULE PAGE
    → QUESTIONS
```

Contextual secondary discovery may exist, but the primary hierarchy must remain obvious.

---

# Workstream A — Canonical Content Taxonomy

## P05-T001 — Define Canonical Content Hierarchy

Formalize:

* domain,
* stack,
* pillar,
* module,
* question.

**Priority:** P0

---

## P05-T002 — Define Domain Entity Contract

Specify required and optional fields.

**Priority:** P0

---

## P05-T003 — Define Stack Entity Contract

**Priority:** P0

---

## P05-T004 — Define Pillar Entity Contract

**Priority:** P0

---

## P05-T005 — Define Module Entity Contract

**Priority:** P0

---

## P05-T006 — Define Question Relationship Contract

Questions must resolve to their canonical hierarchy.

**Priority:** P0

---

## P05-T007 — Define Parent-Child Ownership

Every hierarchy entity must have explicit parent relationships.

**Priority:** P0

---

## P05-T008 — Prevent Ambiguous Parent Relationships

**Priority:** P0

---

## P05-T009 — Define Whether Multi-Parent Relationships Are Allowed

Do not introduce them accidentally.

**Priority:** P0

---

## P05-T010 — Define Canonical Parent for Multi-Category Content

Where cross-linking is required, preserve one canonical hierarchy.

**Priority:** P0

---

## P05-T011 — Separate Canonical Hierarchy from Tags

Tags must not become accidental structural parents.

**Priority:** P0

---

## P05-T012 — Separate Canonical Hierarchy from Search Categories

**Priority:** P0

---

## P05-T013 — Separate Canonical Hierarchy from Company Associations

**Priority:** P0

---

## P05-T014 — Separate Canonical Hierarchy from Difficulty

**Priority:** P0

---

## P05-T015 — Establish Taxonomy Naming Rules

Use user-understandable names.

**Priority:** P0

---

## P05-T016 — Establish Taxonomy Description Rules

**Priority:** P1

---

## P05-T017 — Establish Taxonomy Slug Rules

Use Phase 02.

**Priority:** P0

---

## P05-T018 — Establish Taxonomy Stable ID Rules

**Priority:** P0

---

## P05-T019 — Detect Duplicate Taxonomy Entities

**Priority:** P0

---

## P05-T020 — Detect Near-Duplicate Taxonomy Entities

**Priority:** P1

---

# Workstream B — Hierarchy Data Architecture

## P05-T021 — Identify Canonical Hierarchy Data Source

**Priority:** P0

---

## P05-T022 — Remove Competing Hierarchy Definitions

**Priority:** P0

---

## P05-T023 — Build Canonical Hierarchy Resolver

Resolve:

```text
domain
→ stacks
→ pillars
→ modules
→ questions
```

**Priority:** P0

---

## P05-T024 — Build Domain Resolver

**Priority:** P0

---

## P05-T025 — Build Stack Resolver

**Priority:** P0

---

## P05-T026 — Build Pillar Resolver

**Priority:** P0

---

## P05-T027 — Build Module Resolver

**Priority:** P0

---

## P05-T028 — Build Child Entity Resolver

**Priority:** P0

---

## P05-T029 — Build Parent Entity Resolver

**Priority:** P0

---

## P05-T030 — Build Hierarchy Path Resolver

**Priority:** P0

---

## P05-T031 — Build Hierarchy Validation

**Priority:** P0

---

## P05-T032 — Detect Orphan Stacks

**Priority:** P0

---

## P05-T033 — Detect Orphan Pillars

**Priority:** P0

---

## P05-T034 — Detect Orphan Modules

**Priority:** P0

---

## P05-T035 — Detect Orphan Questions

**Priority:** P0

---

## P05-T036 — Detect Circular Hierarchy Relationships

**Priority:** P0

---

## P05-T037 — Detect Missing Parent References

**Priority:** P0

---

## P05-T038 — Detect Invalid Child References

**Priority:** P0

---

## P05-T039 — Establish Deterministic Hierarchy Ordering

**Priority:** P0

---

## P05-T040 — Avoid Array Position as Permanent Content Identity

**Priority:** P0

---

# Workstream C — Hierarchy Route Architecture

## P05-T041 — Apply Canonical Domain Route Contract

**Priority:** P0

---

## P05-T042 — Apply Canonical Stack Route Contract

**Priority:** P0

---

## P05-T043 — Apply Canonical Pillar Route Contract

**Priority:** P0

---

## P05-T044 — Apply Canonical Module Route Contract

**Priority:** P0

---

## P05-T045 — Validate Hierarchy Route Parameter Resolution

**Priority:** P0

---

## P05-T046 — Validate Parent-Child URL Relationships

**Priority:** P0

---

## P05-T047 — Prevent Invalid Hierarchy Combinations

**Priority:** P0

---

## P05-T048 — Redirect Valid Legacy Hierarchy URLs

**Priority:** P0

---

## P05-T049 — Return True 404 for Invalid Hierarchy Paths

**Priority:** P0

---

## P05-T050 — Prevent Soft 404 Hierarchy Pages

**Priority:** P0

---

## P05-T051 — Prevent Duplicate Hierarchy URLs

**Priority:** P0

---

## P05-T052 — Prevent Internal Rendering URLs from Becoming Public

**Priority:** P0

---

## P05-T053 — Ensure All Hierarchy Links Use Canonical URL Generators

**Priority:** P0

---

## P05-T054 — Remove Legacy Hierarchy URL Builders

**Priority:** P0

---

# Workstream D — Shared Hierarchy Page Architecture

## P05-T055 — Define Shared Hierarchy Page Principles

Create consistency without making all levels identical.

**Priority:** P0

---

## P05-T056 — Build Shared Hierarchy Header Foundation

**Priority:** P0

---

## P05-T057 — Build Shared Hierarchy Breadcrumb Integration

**Priority:** P0

---

## P05-T058 — Build Shared Hierarchy Introduction Pattern

**Priority:** P0

---

## P05-T059 — Build Shared Child Discovery Foundation

**Priority:** P0

---

## P05-T060 — Build Shared Progress Foundation Where Appropriate

**Priority:** P1

---

## P05-T061 — Build Shared Related Content Foundation

**Priority:** P1

---

## P05-T062 — Build Shared Empty State Foundation

**Priority:** P0

---

## P05-T063 — Build Shared Loading Foundation

**Priority:** P1

---

## P05-T064 — Build Shared Error Foundation

**Priority:** P0

---

## P05-T065 — Prevent One Giant Generic Hierarchy Template

Each level must preserve its distinct purpose.

**Priority:** P0

---

# Workstream E — Domain Page Architecture

## P05-T066 — Define Domain Page Primary Job

A domain page introduces a broad interview-preparation area.

**Priority:** P0

---

## P05-T067 — Define Domain Page Information Architecture

Recommended hierarchy:

```text
Breadcrumb
Domain Header
Short Introduction
Primary Stacks / Tracks
Optional Guidance
Related Major Resources
```

**Priority:** P0

---

## P05-T068 — Build Canonical Domain Header

**Priority:** P0

---

## P05-T069 — Define Domain H1

**Priority:** P0

---

## P05-T070 — Define Domain Introduction

**Priority:** P0

---

## P05-T071 — Define Domain Primary CTA

**Priority:** P1

---

## P05-T072 — Build Domain Stack Discovery Section

**Priority:** P0

---

## P05-T073 — Define Domain Stack Preview Content

**Priority:** P0

---

## P05-T074 — Prevent Domain Page from Listing Every Question

**Priority:** P0

---

## P05-T075 — Prevent Domain Page from Listing Every Module

**Priority:** P0

---

## P05-T076 — Prevent Domain Page from Becoming a Giant Directory

**Priority:** P0

---

## P05-T077 — Provide Domain-Level Orientation

Explain how the preparation area is organized.

**Priority:** P1

---

## P05-T078 — Support Domain-Level Featured Resources

Only where useful.

**Priority:** P2

---

## P05-T079 — Support Domain-Level Roadmaps

Where available.

**Priority:** P1

---

## P05-T080 — Define Domain Mobile Layout

**Priority:** P0

---

# Workstream F — Domain Page Visual Rebuild

## P05-T081 — Reduce Domain Hero Size

**Priority:** P0

---

## P05-T082 — Avoid Marketing-Style Domain Heroes

**Priority:** P0

---

## P05-T083 — Avoid Excessive Domain Colour Branding

**Priority:** P0

---

## P05-T084 — Use Neutral Primary Surfaces

**Priority:** P0

---

## P05-T085 — Use Accent Colour Sparingly

**Priority:** P0

---

## P05-T086 — Reduce Domain Card Count

**Priority:** P0

---

## P05-T087 — Standardize Domain Stack Items

**Priority:** P0

---

## P05-T088 — Avoid Large Decorative Icons

**Priority:** P1

---

## P05-T089 — Avoid Redundant Metadata

**Priority:** P0

---

## P05-T090 — Maintain Strong Reading Hierarchy

**Priority:** P0

---

# Workstream G — Domain Page SEO

## P05-T091 — Apply Domain Metadata Contract

**Priority:** P0

---

## P05-T092 — Generate Unique Domain Title

**Priority:** P0

---

## P05-T093 — Generate Useful Domain Description

**Priority:** P0

---

## P05-T094 — Generate Domain Canonical

**Priority:** P0

---

## P05-T095 — Validate Domain Indexability

**Priority:** P0

---

## P05-T096 — Add Domain Breadcrumb Schema

**Priority:** P0

---

## P05-T097 — Ensure Domain Introduction Is Server-Rendered

**Priority:** P0

---

## P05-T098 — Ensure Stack Links Are Server-Rendered

**Priority:** P0

---

## P05-T099 — Include Valid Domain Pages in Sitemap

**Priority:** P0

---

## P05-T100 — Exclude Empty Domain Pages

**Priority:** P0

---

# Workstream H — Stack Page Architecture

## P05-T101 — Define Stack Page Primary Job

A stack page represents a major preparation track.

Examples:

* Java Backend,
* Frontend Engineering,
* DevOps,
* Data Analyst.

**Priority:** P0

---

## P05-T102 — Define Stack Page Information Architecture

Recommended hierarchy:

```text
Breadcrumb
Stack Header
Short Preparation Overview
Pillars
Optional Progress
Optional Recommended Starting Point
Related Resources
```

**Priority:** P0

---

## P05-T103 — Build Canonical Stack Header

**Priority:** P0

---

## P05-T104 — Define Stack H1

**Priority:** P0

---

## P05-T105 — Define Stack Introduction

**Priority:** P0

---

## P05-T106 — Define Stack Preparation Context

Explain what the track covers.

**Priority:** P1

---

## P05-T107 — Build Stack Pillar Discovery

**Priority:** P0

---

## P05-T108 — Define Pillar Preview Information

**Priority:** P0

---

## P05-T109 — Define Stack Starting Point Logic

**Priority:** P1

---

## P05-T110 — Define Stack Progress Integration

**Priority:** P1

---

## P05-T111 — Prevent Stack Page from Showing All Questions

**Priority:** P0

---

## P05-T112 — Prevent Stack Page from Showing All Modules

**Priority:** P0

---

## P05-T113 — Prevent Stack Page from Becoming a Dashboard

**Priority:** P0

---

## P05-T114 — Prevent Stack Page from Becoming a Marketing Landing Page

**Priority:** P0

---

## P05-T115 — Define Stack Mobile Layout

**Priority:** P0

---

# Workstream I — Stack Page Visual Rebuild

## P05-T116 — Reduce Stack Header Density

**Priority:** P0

---

## P05-T117 — Reduce Stack Metadata Density

**Priority:** P0

---

## P05-T118 — Standardize Pillar Discovery Items

**Priority:** P0

---

## P05-T119 — Avoid One Large Card per Minor Detail

**Priority:** P0

---

## P05-T120 — Use Clear Section Separation

**Priority:** P0

---

## P05-T121 — Use Consistent Progress Treatment

**Priority:** P1

---

## P05-T122 — Avoid Excessive Progress Visualizations

**Priority:** P0

---

## P05-T123 — Avoid Excessive Difficulty Colours

**Priority:** P0

---

## P05-T124 — Avoid Decorative Stack Gradients

**Priority:** P0

---

## P05-T125 — Ensure Stack Identity Remains Clear

**Priority:** P0

---

# Workstream J — Stack Page SEO

## P05-T126 — Apply Stack Metadata Contract

**Priority:** P0

---

## P05-T127 — Generate Unique Stack Title

**Priority:** P0

---

## P05-T128 — Generate Useful Stack Description

**Priority:** P0

---

## P05-T129 — Generate Stack Canonical

**Priority:** P0

---

## P05-T130 — Validate Stack Indexability

**Priority:** P0

---

## P05-T131 — Add Stack Breadcrumb Schema

**Priority:** P0

---

## P05-T132 — Ensure Stack Introduction Is Server-Rendered

**Priority:** P0

---

## P05-T133 — Ensure Pillar Links Are Server-Rendered

**Priority:** P0

---

## P05-T134 — Include Valid Stack Pages in Sitemap

**Priority:** P0

---

## P05-T135 — Exclude Empty Stack Pages

**Priority:** P0

---

# Workstream K — Pillar Page Architecture

## P05-T136 — Define Pillar Page Primary Job

A pillar page represents a major competency area within a preparation track.

**Priority:** P0

---

## P05-T137 — Define Pillar Page Information Architecture

Recommended hierarchy:

```text
Breadcrumb
Pillar Header
Short Competency Overview
Modules
Optional Preparation Guidance
Related Pillars
```

**Priority:** P0

---

## P05-T138 — Build Canonical Pillar Header

**Priority:** P0

---

## P05-T139 — Define Pillar H1

**Priority:** P0

---

## P05-T140 — Define Pillar Introduction

**Priority:** P0

---

## P05-T141 — Explain Pillar Relevance

Keep it concise and useful.

**Priority:** P1

---

## P05-T142 — Build Pillar Module Discovery

**Priority:** P0

---

## P05-T143 — Define Module Preview Information

**Priority:** P0

---

## P05-T144 — Define Pillar Progress Integration

**Priority:** P1

---

## P05-T145 — Define Pillar Starting Point

**Priority:** P1

---

## P05-T146 — Prevent Pillar Page from Showing Every Question

**Priority:** P0

---

## P05-T147 — Prevent Pillar Page from Duplicating Module Pages

**Priority:** P0

---

## P05-T148 — Prevent Pillar Page from Becoming Visually Dense

**Priority:** P0

---

## P05-T149 — Define Pillar Mobile Layout

**Priority:** P0

---

# Workstream L — Pillar Page Visual Rebuild

## P05-T150 — Reduce Pillar Header Height

**Priority:** P0

---

## P05-T151 — Simplify Pillar Metadata

**Priority:** P0

---

## P05-T152 — Standardize Module Discovery Items

**Priority:** P0

---

## P05-T153 — Use Strong Module Titles

**Priority:** P0

---

## P05-T154 — Use Short Module Supporting Information

**Priority:** P0

---

## P05-T155 — Avoid Multiple Nested Card Layers

**Priority:** P0

---

## P05-T156 — Avoid One Colour per Module

**Priority:** P0

---

## P05-T157 — Avoid Excessive Icons

**Priority:** P1

---

## P05-T158 — Preserve Clear Progression

**Priority:** P0

---

# Workstream M — Pillar Page SEO

## P05-T159 — Apply Pillar Metadata Contract

**Priority:** P0

---

## P05-T160 — Generate Unique Pillar Title

**Priority:** P0

---

## P05-T161 — Generate Useful Pillar Description

**Priority:** P0

---

## P05-T162 — Generate Pillar Canonical

**Priority:** P0

---

## P05-T163 — Validate Pillar Indexability

**Priority:** P0

---

## P05-T164 — Add Pillar Breadcrumb Schema

**Priority:** P0

---

## P05-T165 — Ensure Pillar Introduction Is Server-Rendered

**Priority:** P0

---

## P05-T166 — Ensure Module Links Are Server-Rendered

**Priority:** P0

---

## P05-T167 — Include Valid Pillars in Sitemap

**Priority:** P0

---

## P05-T168 — Exclude Empty Pillars

**Priority:** P0

---

# Workstream N — Module Page Architecture

## P05-T169 — Define Module Page Primary Job

A module page is the immediate discovery layer before individual interview questions.

**Priority:** P0

---

## P05-T170 — Define Module Page Information Architecture

Recommended hierarchy:

```text
Breadcrumb
Module Header
Short Topic Introduction
Question List
Optional Progress
Optional Related Modules
```

**Priority:** P0

---

## P05-T171 — Build Canonical Module Header

**Priority:** P0

---

## P05-T172 — Define Module H1

**Priority:** P0

---

## P05-T173 — Define Module Introduction

**Priority:** P0

---

## P05-T174 — Explain Module Scope Concisely

**Priority:** P1

---

## P05-T175 — Build Canonical Module Question List

**Priority:** P0

---

## P05-T176 — Define Question List Item Information Hierarchy

The question title must dominate.

**Priority:** P0

---

## P05-T177 — Define Question Numbering Strategy

**Priority:** P1

---

## P05-T178 — Define Difficulty Display Strategy

**Priority:** P1

---

## P05-T179 — Define Completion State Display

**Priority:** P1

---

## P05-T180 — Define Bookmark State Display

**Priority:** P2

---

## P05-T181 — Define Question Type Display Where Useful

**Priority:** P2

---

## P05-T182 — Avoid Showing Full Answer Previews

**Priority:** P0

---

## P05-T183 — Avoid Excessive Metadata Per Question

**Priority:** P0

---

## P05-T184 — Avoid One Heavy Card per Question

**Priority:** P0

---

## P05-T185 — Support Large Question Lists

**Priority:** P0

---

## P05-T186 — Define Module Mobile Layout

**Priority:** P0

---

# Workstream O — Question List Design System

## P05-T187 — Build Canonical Question List Component

**Priority:** P0

---

## P05-T188 — Build Canonical Question List Item

**Priority:** P0

---

## P05-T189 — Make Question Title the Primary Visual Element

**Priority:** P0

---

## P05-T190 — Define Secondary Metadata Placement

**Priority:** P0

---

## P05-T191 — Define Completion Indicator

**Priority:** P1

---

## P05-T192 — Define Difficulty Indicator

**Priority:** P1

---

## P05-T193 — Define Hover State

Keep it subtle.

**Priority:** P1

---

## P05-T194 — Define Active State

**Priority:** P1

---

## P05-T195 — Define Focus State

**Priority:** P0

---

## P05-T196 — Define Visited State Policy

**Priority:** P2

---

## P05-T197 — Ensure Entire Item Interaction Is Accessible

**Priority:** P0

---

## P05-T198 — Ensure Question Link Uses Canonical URL

**Priority:** P0

---

## P05-T199 — Prevent Nested Interactive Elements

**Priority:** P0

---

## P05-T200 — Avoid Card Lift Animation

**Priority:** P1

---

## P05-T201 — Avoid Excessive Borders

**Priority:** P0

---

## P05-T202 — Avoid Excessive Badges

**Priority:** P0

---

## P05-T203 — Optimize Question List Density for Reading

**Priority:** P0

---

## P05-T204 — Optimize Question List for Mobile

**Priority:** P0

---

# Workstream P — Module Page SEO

## P05-T205 — Apply Module Metadata Contract

**Priority:** P0

---

## P05-T206 — Generate Unique Module Title

**Priority:** P0

---

## P05-T207 — Generate Useful Module Description

**Priority:** P0

---

## P05-T208 — Generate Module Canonical

**Priority:** P0

---

## P05-T209 — Validate Module Indexability

**Priority:** P0

---

## P05-T210 — Add Module Breadcrumb Schema

**Priority:** P0

---

## P05-T211 — Ensure Module Introduction Is Server-Rendered

**Priority:** P0

---

## P05-T212 — Ensure Question Links Are Server-Rendered

**Priority:** P0

---

## P05-T213 — Include Valid Modules in Sitemap

**Priority:** P0

---

## P05-T214 — Exclude Empty Modules

**Priority:** P0

---

# Workstream Q — Hierarchy Breadcrumbs

## P05-T215 — Apply Canonical Domain Breadcrumbs

**Priority:** P0

---

## P05-T216 — Apply Canonical Stack Breadcrumbs

**Priority:** P0

---

## P05-T217 — Apply Canonical Pillar Breadcrumbs

**Priority:** P0

---

## P05-T218 — Apply Canonical Module Breadcrumbs

**Priority:** P0

---

## P05-T219 — Ensure Breadcrumb Labels Use Display Names

**Priority:** P0

---

## P05-T220 — Ensure Breadcrumb URLs Use Canonical Slugs

**Priority:** P0

---

## P05-T221 — Prevent Breadcrumb Links to Redirects

**Priority:** P0

---

## P05-T222 — Prevent Duplicate Breadcrumb Rendering

**Priority:** P0

---

## P05-T223 — Align Breadcrumb Schema with Visible Breadcrumbs

**Priority:** P0

---

## P05-T224 — Optimize Deep Breadcrumbs for Mobile

**Priority:** P0

---

# Workstream R — Content Sidebar Integration

## P05-T225 — Define Sidebar Eligibility by Hierarchy Level

**Priority:** P0

---

## P05-T226 — Avoid Sidebar on Pages Where It Adds No Value

**Priority:** P0

---

## P05-T227 — Integrate Content Tree on Appropriate Deep Routes

**Priority:** P0

---

## P05-T228 — Highlight Current Hierarchy Position

**Priority:** P0

---

## P05-T229 — Expand Current Parent Path

**Priority:** P0

---

## P05-T230 — Avoid Rendering Entire Global Taxonomy in Sidebar

**Priority:** P0

---

## P05-T231 — Load Relevant Hierarchy Context Only

**Priority:** P0

---

## P05-T232 — Define Sidebar Behavior for Domain Pages

**Priority:** P1

---

## P05-T233 — Define Sidebar Behavior for Stack Pages

**Priority:** P1

---

## P05-T234 — Define Sidebar Behavior for Pillar Pages

**Priority:** P1

---

## P05-T235 — Define Sidebar Behavior for Module Pages

**Priority:** P0

---

## P05-T236 — Define Mobile Sidebar Transformation

**Priority:** P0

---

# Workstream S — Hierarchy Progress Architecture

## P05-T237 — Define Progress Semantics

Clarify what “progress” actually means.

**Priority:** P0

---

## P05-T238 — Define Question Completion State

**Priority:** P0

---

## P05-T239 — Define Module Progress Calculation

**Priority:** P1

---

## P05-T240 — Define Pillar Progress Calculation

**Priority:** P1

---

## P05-T241 — Define Stack Progress Calculation

**Priority:** P1

---

## P05-T242 — Define Domain Progress Calculation Where Useful

**Priority:** P2

---

## P05-T243 — Prevent Progress from Blocking Public Content Rendering

**Priority:** P0

---

## P05-T244 — Keep Progress Secondary on Public Pages

**Priority:** P0

---

## P05-T245 — Avoid Multiple Progress Visualizations on One Page

**Priority:** P0

---

## P05-T246 — Handle Anonymous Users Gracefully

**Priority:** P0

---

## P05-T247 — Handle Authentication Loading Gracefully

**Priority:** P1

---

## P05-T248 — Handle Progress API Failure Gracefully

**Priority:** P0

---

## P05-T249 — Prevent Progress State from Affecting Canonical Content

**Priority:** P0

---

# Workstream T — Hierarchy Search & Filtering

## P05-T250 — Define Search Needs at Each Hierarchy Level

**Priority:** P0

---

## P05-T251 — Avoid Search Inputs on Pages with Small Child Sets

**Priority:** P0

---

## P05-T252 — Add Module Question Search Only Where Useful

**Priority:** P1

---

## P05-T253 — Define Question Filter Eligibility

**Priority:** P1

---

## P05-T254 — Define Difficulty Filtering

Where useful.

**Priority:** P2

---

## P05-T255 — Define Completion Filtering

For authenticated users where useful.

**Priority:** P2

---

## P05-T256 — Prevent Filter UI from Dominating Module Pages

**Priority:** P0

---

## P05-T257 — Prevent Filter URLs from Creating Crawl Explosion

**Priority:** P0

---

## P05-T258 — Preserve Canonical Question Links in Filtered Results

**Priority:** P0

---

## P05-T259 — Define Empty Filter Results State

**Priority:** P1

---

# Workstream U — Hierarchy Internal Linking

## P05-T260 — Link Domains to Child Stacks

**Priority:** P0

---

## P05-T261 — Link Stacks Back to Parent Domains

**Priority:** P0

---

## P05-T262 — Link Stacks to Child Pillars

**Priority:** P0

---

## P05-T263 — Link Pillars Back to Parent Stacks

**Priority:** P0

---

## P05-T264 — Link Pillars to Child Modules

**Priority:** P0

---

## P05-T265 — Link Modules Back to Parent Pillars

**Priority:** P0

---

## P05-T266 — Link Modules to Child Questions

**Priority:** P0

---

## P05-T267 — Link Questions Back to Parent Modules

**Priority:** P0

---

## P05-T268 — Add Related Sibling Links Where Useful

**Priority:** P1

---

## P05-T269 — Prevent Excessive Cross-Linking

**Priority:** P0

---

## P05-T270 — Prevent Internal Links to Noncanonical Aliases

**Priority:** P0

---

## P05-T271 — Prevent Internal Links to Redirects

**Priority:** P0

---

## P05-T272 — Prevent Broken Hierarchy Links

**Priority:** P0

---

## P05-T273 — Ensure Every Indexable Entity Has an Incoming Link

**Priority:** P0

---

# Workstream V — Crawl Depth Optimization

## P05-T274 — Measure Crawl Depth for Core Content

**Priority:** P0

---

## P05-T275 — Ensure Major Stacks Are Easily Reachable

**Priority:** P0

---

## P05-T276 — Ensure Pillars Are Reachable Through Stack Pages

**Priority:** P0

---

## P05-T277 — Ensure Modules Are Reachable Through Pillar Pages

**Priority:** P0

---

## P05-T278 — Ensure Questions Are Reachable Through Module Pages

**Priority:** P0

---

## P05-T279 — Identify Excessively Deep Question Routes

**Priority:** P0

---

## P05-T280 — Improve Discovery Without Flattening the Entire Hierarchy

**Priority:** P0

---

## P05-T281 — Add Contextual Shortcuts for High-Value Content

**Priority:** P1

---

## P05-T282 — Avoid Giant Global Link Directories

**Priority:** P0

---

# Workstream W — Thin Hierarchy Page Prevention

## P05-T283 — Define Minimum Domain Page Requirements

**Priority:** P0

---

## P05-T284 — Define Minimum Stack Page Requirements

**Priority:** P0

---

## P05-T285 — Define Minimum Pillar Page Requirements

**Priority:** P0

---

## P05-T286 — Define Minimum Module Page Requirements

**Priority:** P0

---

## P05-T287 — Prevent Empty Domain Indexing

**Priority:** P0

---

## P05-T288 — Prevent Empty Stack Indexing

**Priority:** P0

---

## P05-T289 — Prevent Empty Pillar Indexing

**Priority:** P0

---

## P05-T290 — Prevent Empty Module Indexing

**Priority:** P0

---

## P05-T291 — Prevent Placeholder Introductions from Creating False Page Value

**Priority:** P0

---

## P05-T292 — Prevent Metadata-Only Differentiation

**Priority:** P0

---

## P05-T293 — Merge or Remove Meaningless Taxonomy Levels

**Priority:** P0

---

## P05-T294 — Avoid Creating Hierarchy Pages Only for SEO

**Priority:** P0

---

# Workstream X — Hierarchy Content Introductions

## P05-T295 — Define Domain Introduction Content Contract

**Priority:** P1

---

## P05-T296 — Define Stack Introduction Content Contract

**Priority:** P1

---

## P05-T297 — Define Pillar Introduction Content Contract

**Priority:** P1

---

## P05-T298 — Define Module Introduction Content Contract

**Priority:** P1

---

## P05-T299 — Keep Introductions Concise

**Priority:** P0

---

## P05-T300 — Avoid Generic Repeated Introductions

**Priority:** P0

---

## P05-T301 — Avoid Keyword-Stuffed Introductions

**Priority:** P0

---

## P05-T302 — Ensure Introductions Explain Page Scope

**Priority:** P0

---

## P05-T303 — Ensure Introductions Help Users Choose the Next Step

**Priority:** P0

---

## P05-T304 — Prevent AI-Generated Filler from Becoming Default Taxonomy Content

**Priority:** P0

---

# Workstream Y — Hierarchy Visual Density Reduction

## P05-T305 — Audit Visible Elements on Domain Pages

**Priority:** P0

---

## P05-T306 — Audit Visible Elements on Stack Pages

**Priority:** P0

---

## P05-T307 — Audit Visible Elements on Pillar Pages

**Priority:** P0

---

## P05-T308 — Audit Visible Elements on Module Pages

**Priority:** P0

---

## P05-T309 — Reduce Competing Metadata

**Priority:** P0

---

## P05-T310 — Reduce Badge Count

**Priority:** P0

---

## P05-T311 — Reduce Icon Count

**Priority:** P0

---

## P05-T312 — Reduce Border Count

**Priority:** P0

---

## P05-T313 — Reduce Surface Count

**Priority:** P0

---

## P05-T314 — Reduce CTA Count

**Priority:** P0

---

## P05-T315 — Increase Meaningful Whitespace

**Priority:** P0

---

## P05-T316 — Preserve Useful Content Density

**Priority:** P0

---

# Workstream Z — Hierarchy Colour Simplification

## P05-T317 — Remove Arbitrary Domain Colour Systems

**Priority:** P0

---

## P05-T318 — Remove Arbitrary Stack Colour Systems

**Priority:** P0

---

## P05-T319 — Remove Arbitrary Pillar Colour Systems

**Priority:** P0

---

## P05-T320 — Remove Arbitrary Module Colour Systems

**Priority:** P0

---

## P05-T321 — Use Semantic Accent Tokens

**Priority:** P0

---

## P05-T322 — Use Neutral Discovery Surfaces

**Priority:** P0

---

## P05-T323 — Keep Difficulty Colour Semantic

**Priority:** P1

---

## P05-T324 — Prevent Colour from Becoming the Only Hierarchy Signal

**Priority:** P0

---

# Workstream AA — Hierarchy Typography

## P05-T325 — Apply Canonical Domain Typography

**Priority:** P0

---

## P05-T326 — Apply Canonical Stack Typography

**Priority:** P0

---

## P05-T327 — Apply Canonical Pillar Typography

**Priority:** P0

---

## P05-T328 — Apply Canonical Module Typography

**Priority:** P0

---

## P05-T329 — Standardize Entity Titles

**Priority:** P0

---

## P05-T330 — Standardize Entity Descriptions

**Priority:** P0

---

## P05-T331 — Standardize Metadata Typography

**Priority:** P1

---

## P05-T332 — Prevent Tiny Metadata Text

**Priority:** P0

---

## P05-T333 — Prevent Excessive Bold Weight

**Priority:** P1

---

## P05-T334 — Preserve Question Title Readability

**Priority:** P0

---

# Workstream AB — Hierarchy Spacing

## P05-T335 — Standardize Hierarchy Page Top Spacing

**Priority:** P0

---

## P05-T336 — Standardize Header-to-Content Spacing

**Priority:** P0

---

## P05-T337 — Standardize Child List Spacing

**Priority:** P0

---

## P05-T338 — Standardize Section Spacing

**Priority:** P0

---

## P05-T339 — Prevent Overcompressed Lists

**Priority:** P0

---

## P05-T340 — Prevent Excessive Card Gaps

**Priority:** P1

---

## P05-T341 — Optimize Mobile Vertical Rhythm

**Priority:** P0

---

# Workstream AC — Hierarchy Mobile Experience

## P05-T342 — Rebuild Domain Mobile Experience

**Priority:** P0

---

## P05-T343 — Rebuild Stack Mobile Experience

**Priority:** P0

---

## P05-T344 — Rebuild Pillar Mobile Experience

**Priority:** P0

---

## P05-T345 — Rebuild Module Mobile Experience

**Priority:** P0

---

## P05-T346 — Prevent Desktop Grid Compression

**Priority:** P0

---

## P05-T347 — Prevent Horizontal Overflow

**Priority:** P0

---

## P05-T348 — Simplify Mobile Metadata

**Priority:** P0

---

## P05-T349 — Simplify Mobile Breadcrumbs

**Priority:** P0

---

## P05-T350 — Transform Sidebar Navigation Appropriately

**Priority:** P0

---

## P05-T351 — Preserve Question Scannability on Mobile

**Priority:** P0

---

## P05-T352 — Ensure Touch Target Accessibility

**Priority:** P0

---

## P05-T353 — Avoid Endless Streams of Large Cards

**Priority:** P0

---

# Workstream AD — Hierarchy Accessibility

## P05-T354 — Validate One H1 per Hierarchy Page

**Priority:** P0

---

## P05-T355 — Validate Heading Hierarchy

**Priority:** P0

---

## P05-T356 — Validate Breadcrumb Accessibility

**Priority:** P0

---

## P05-T357 — Validate Child Navigation Semantics

**Priority:** P0

---

## P05-T358 — Validate Question List Semantics

**Priority:** P0

---

## P05-T359 — Validate Keyboard Navigation

**Priority:** P0

---

## P05-T360 — Validate Focus Visibility

**Priority:** P0

---

## P05-T361 — Validate Link Purpose

**Priority:** P0

---

## P05-T362 — Validate Colour Contrast

**Priority:** P0

---

## P05-T363 — Validate Progress Accessibility

**Priority:** P1

---

## P05-T364 — Validate Screen Reader Hierarchy Context

**Priority:** P1

---

# Workstream AE — Hierarchy Server Rendering

## P05-T365 — Server-Render Domain Primary Content

**Priority:** P0

---

## P05-T366 — Server-Render Stack Primary Content

**Priority:** P0

---

## P05-T367 — Server-Render Pillar Primary Content

**Priority:** P0

---

## P05-T368 — Server-Render Module Primary Content

**Priority:** P0

---

## P05-T369 — Server-Render Child Navigation Links

**Priority:** P0

---

## P05-T370 — Server-Render Question Links

**Priority:** P0

---

## P05-T371 — Keep Progress Enhancement Client-Side Where Appropriate

**Priority:** P1

---

## P05-T372 — Keep Bookmark Enhancement Client-Side Where Appropriate

**Priority:** P1

---

## P05-T373 — Prevent Client Loading State from Replacing Core Hierarchy Content

**Priority:** P0

---

## P05-T374 — Reduce Client Boundaries

**Priority:** P0

---

# Workstream AF — Hierarchy Performance

## P05-T375 — Establish Domain Page Performance Budget

**Priority:** P1

---

## P05-T376 — Establish Stack Page Performance Budget

**Priority:** P1

---

## P05-T377 — Establish Pillar Page Performance Budget

**Priority:** P1

---

## P05-T378 — Establish Module Page Performance Budget

**Priority:** P0

---

## P05-T379 — Avoid Fetching Full Descendant Trees Unnecessarily

**Priority:** P0

---

## P05-T380 — Avoid Fetching Full Question Answers for Module Lists

**Priority:** P0

---

## P05-T381 — Fetch Only Required Question Preview Data

**Priority:** P0

---

## P05-T382 — Cache Stable Hierarchy Data

**Priority:** P1

---

## P05-T383 — Define Hierarchy Revalidation Strategy

**Priority:** P1

---

## P05-T384 — Prevent Duplicate Hierarchy Fetches

**Priority:** P0

---

## P05-T385 — Optimize Large Module Question Lists

**Priority:** P0

---

## P05-T386 — Avoid Premature Client-Side Virtualization

Use only when actual list size requires it.

**Priority:** P1

---

## P05-T387 — Minimize Hierarchy JavaScript

**Priority:** P0

---

## P05-T388 — Prevent User Progress Fetching from Blocking Content

**Priority:** P0

---

# Workstream AG — Backend Support

## P05-T389 — Identify Hierarchy Backend Dependencies

**Priority:** P0

---

## P05-T390 — Stabilize Domain Data Contract

**Priority:** P0

---

## P05-T391 — Stabilize Stack Data Contract

**Priority:** P0

---

## P05-T392 — Stabilize Pillar Data Contract

**Priority:** P0

---

## P05-T393 — Stabilize Module Data Contract

**Priority:** P0

---

## P05-T394 — Stabilize Question Preview Data Contract

**Priority:** P0

---

## P05-T395 — Expose Stable Hierarchy IDs

**Priority:** P0

---

## P05-T396 — Expose Canonical Slugs

**Priority:** P0

---

## P05-T397 — Expose Parent Relationships

**Priority:** P0

---

## P05-T398 — Expose Child Ordering

**Priority:** P0

---

## P05-T399 — Avoid Returning Full Answer Payloads for Hierarchy Pages

**Priority:** P0

---

## P05-T400 — Optimize Hierarchy Queries

**Priority:** P0

---

## P05-T401 — Prevent N+1 Hierarchy Queries

**Priority:** P0

---

## P05-T402 — Cache Stable Taxonomy Data Where Appropriate

**Priority:** P1

---

## P05-T403 — Distinguish Missing Entity from Backend Failure

**Priority:** P0

---

## P05-T404 — Prevent Backend Failure from Producing Empty Indexable Pages

**Priority:** P0

---

# Workstream AH — Hierarchy SEO Integration

## P05-T405 — Apply Canonical Metadata Factory to All Domain Pages

**Priority:** P0

---

## P05-T406 — Apply Canonical Metadata Factory to All Stack Pages

**Priority:** P0

---

## P05-T407 — Apply Canonical Metadata Factory to All Pillar Pages

**Priority:** P0

---

## P05-T408 — Apply Canonical Metadata Factory to All Module Pages

**Priority:** P0

---

## P05-T409 — Apply Canonical Indexability Policy

**Priority:** P0

---

## P05-T410 — Apply Canonical URL Generation

**Priority:** P0

---

## P05-T411 — Apply Canonical Breadcrumb Schema

**Priority:** P0

---

## P05-T412 — Apply Sitemap Participation Rules

**Priority:** P0

---

## P05-T413 — Prevent Duplicate Titles Across Hierarchy Levels

**Priority:** P0

---

## P05-T414 — Prevent Duplicate Descriptions Across Hierarchy Levels

**Priority:** P0

---

## P05-T415 — Prevent Thin Hierarchy Pages from Sitemap Inclusion

**Priority:** P0

---

## P05-T416 — Prevent Noindex Hierarchy Pages from Sitemap Inclusion

**Priority:** P0

---

## P05-T417 — Ensure Every Sitemap Hierarchy URL Resolves to Canonical 200

**Priority:** P0

---

# Workstream AI — Programmatic Hierarchy SEO Quality

## P05-T418 — Ensure Every Domain Page Has Distinct Purpose

**Priority:** P0

---

## P05-T419 — Ensure Every Stack Page Has Distinct Purpose

**Priority:** P0

---

## P05-T420 — Ensure Every Pillar Page Has Distinct Purpose

**Priority:** P0

---

## P05-T421 — Ensure Every Module Page Has Distinct Purpose

**Priority:** P0

---

## P05-T422 — Prevent Template-Only Page Differentiation

**Priority:** P0

---

## P05-T423 — Prevent Automatically Generated Filler Copy

**Priority:** P0

---

## P05-T424 — Prevent Taxonomy Explosion

**Priority:** P0

---

## P05-T425 — Merge Redundant Taxonomy Entities

**Priority:** P0

---

## P05-T426 — Noindex Incomplete Hierarchy Entities

**Priority:** P0

---

## P05-T427 — Require Useful Child Discovery

**Priority:** P0

---

## P05-T428 — Require Meaningful Visible Context

**Priority:** P0

---

# Workstream AJ — Hierarchy Sitemap Migration

## P05-T429 — Generate Domain Sitemap Entries from Canonical Data

**Priority:** P0

---

## P05-T430 — Generate Stack Sitemap Entries from Canonical Data

**Priority:** P0

---

## P05-T431 — Generate Pillar Sitemap Entries from Canonical Data

**Priority:** P0

---

## P05-T432 — Generate Module Sitemap Entries from Canonical Data

**Priority:** P0

---

## P05-T433 — Validate Hierarchy Sitemap Counts

**Priority:** P0

---

## P05-T434 — Detect Missing Hierarchy Sitemap Entries

**Priority:** P0

---

## P05-T435 — Detect Duplicate Hierarchy Sitemap Entries

**Priority:** P0

---

## P05-T436 — Detect Redirecting Hierarchy Sitemap URLs

**Priority:** P0

---

## P05-T437 — Detect 404 Hierarchy Sitemap URLs

**Priority:** P0

---

## P05-T438 — Detect Noindex Hierarchy Sitemap URLs

**Priority:** P0

---

# Workstream AK — Hierarchy Legacy Migration

## P05-T439 — Inventory Legacy Domain Pages

**Priority:** P0

---

## P05-T440 — Inventory Legacy Stack Pages

**Priority:** P0

---

## P05-T441 — Inventory Legacy Pillar Pages

**Priority:** P0

---

## P05-T442 — Inventory Legacy Module Pages

**Priority:** P0

---

## P05-T443 — Map Legacy Domains to Canonical Domains

**Priority:** P0

---

## P05-T444 — Map Legacy Stacks to Canonical Stacks

**Priority:** P0

---

## P05-T445 — Map Legacy Pillars to Canonical Pillars

**Priority:** P0

---

## P05-T446 — Map Legacy Modules to Canonical Modules

**Priority:** P0

---

## P05-T447 — Preserve Valuable Existing URLs Where Possible

**Priority:** P0

---

## P05-T448 — Redirect Changed Legacy URLs

**Priority:** P0

---

## P05-T449 — Remove Duplicate Legacy Routes

**Priority:** P0

---

## P05-T450 — Remove Legacy Hierarchy Components

**Priority:** P0

---

## P05-T451 — Remove Legacy Hierarchy CSS

**Priority:** P0

---

## P05-T452 — Remove Legacy Hierarchy Data Utilities

**Priority:** P0

---

## P05-T453 — Remove Legacy Hierarchy Metadata Logic

**Priority:** P0

---

## P05-T454 — Prevent Legacy Hierarchy Reintroduction

**Priority:** P1

---

# Workstream AL — Representative Domain Migration

## P05-T455 — Select Representative Domain

Use a mature content domain.

**Priority:** P0

---

## P05-T456 — Migrate Representative Domain Page

**Priority:** P0

---

## P05-T457 — Validate Domain UI Architecture

**Priority:** P0

---

## P05-T458 — Validate Domain SEO Architecture

**Priority:** P0

---

## P05-T459 — Validate Domain Internal Linking

**Priority:** P0

---

## P05-T460 — Validate Domain Mobile Experience

**Priority:** P0

---

## P05-T461 — Fix Root Domain Template Defects

**Priority:** P0

---

# Workstream AM — Representative Stack Migration

## P05-T462 — Select Java Backend as Primary Representative Stack

Use the mature Java Backend hierarchy to validate the V2 system.

**Priority:** P0

---

## P05-T463 — Migrate Java Backend Stack Page

**Priority:** P0

---

## P05-T464 — Validate Java Backend Pillar Discovery

**Priority:** P0

---

## P05-T465 — Validate Java Backend Progression Clarity

**Priority:** P0

---

## P05-T466 — Validate Java Backend SEO

**Priority:** P0

---

## P05-T467 — Validate Java Backend Mobile Experience

**Priority:** P0

---

## P05-T468 — Fix Root Stack Template Defects

**Priority:** P0

---

# Workstream AN — Representative Pillar Migration

## P05-T469 — Select Representative Java Backend Pillar

Choose a mature pillar with multiple modules.

**Priority:** P0

---

## P05-T470 — Migrate Representative Pillar Page

**Priority:** P0

---

## P05-T471 — Validate Module Discovery

**Priority:** P0

---

## P05-T472 — Validate Pillar SEO

**Priority:** P0

---

## P05-T473 — Validate Pillar Internal Linking

**Priority:** P0

---

## P05-T474 — Validate Pillar Mobile Experience

**Priority:** P0

---

## P05-T475 — Fix Root Pillar Template Defects

**Priority:** P0

---

# Workstream AO — Representative Module Migration

## P05-T476 — Select Representative Large Module

Use a module with enough questions to expose scale issues.

**Priority:** P0

---

## P05-T477 — Migrate Representative Module Page

**Priority:** P0

---

## P05-T478 — Validate Large Question List Performance

**Priority:** P0

---

## P05-T479 — Validate Question Scannability

**Priority:** P0

---

## P05-T480 — Validate Module SEO

**Priority:** P0

---

## P05-T481 — Validate Module Internal Linking

**Priority:** P0

---

## P05-T482 — Validate Module Mobile Experience

**Priority:** P0

---

## P05-T483 — Fix Root Module Template Defects

**Priority:** P0

---

# Workstream AP — Cross-Domain Extensibility

## P05-T484 — Validate Hierarchy with Software Engineering

**Priority:** P0

---

## P05-T485 — Validate Hierarchy with Data Analytics

**Priority:** P1

---

## P05-T486 — Validate Hierarchy with Management Consulting

**Priority:** P1

---

## P05-T487 — Identify Software-Specific Assumptions

**Priority:** P0

---

## P05-T488 — Remove Technology-Only Naming Assumptions

**Priority:** P0

---

## P05-T489 — Support Non-Code Modules

**Priority:** P0

---

## P05-T490 — Support Case Interview Modules

**Priority:** P1

---

## P05-T491 — Support Behavioral Modules

**Priority:** P1

---

## P05-T492 — Preserve One Shared Discovery Architecture

**Priority:** P0

---

# Workstream AQ — Hierarchy Quality Validation

## P05-T493 — Validate Domain Page Quality

**Priority:** P0

---

## P05-T494 — Validate Stack Page Quality

**Priority:** P0

---

## P05-T495 — Validate Pillar Page Quality

**Priority:** P0

---

## P05-T496 — Validate Module Page Quality

**Priority:** P0

---

## P05-T497 — Validate Hierarchy Navigation Clarity

**Priority:** P0

---

## P05-T498 — Validate Parent-Child Relationships

**Priority:** P0

---

## P05-T499 — Validate Breadcrumb Accuracy

**Priority:** P0

---

## P05-T500 — Validate Internal Link Integrity

**Priority:** P0

---

## P05-T501 — Validate Crawl Depth

**Priority:** P0

---

## P05-T502 — Validate No Orphan Indexable Entities

**Priority:** P0

---

## P05-T503 — Validate No Empty Indexable Hierarchy Pages

**Priority:** P0

---

## P05-T504 — Validate No Duplicate Canonical Hierarchy URLs

**Priority:** P0

---

## P05-T505 — Validate No Hierarchy Sitemap Conflicts

**Priority:** P0

---

# Workstream AR — Hierarchy UX Validation

## P05-T506 — Test “I Want to Prepare for Java Backend”

**Priority:** P0

---

## P05-T507 — Test “I Want to Learn Spring Boot”

**Priority:** P0

---

## P05-T508 — Test “I Want Questions About Spring Security”

**Priority:** P0

---

## P05-T509 — Test “I Know the Exact Topic I Need”

**Priority:** P0

---

## P05-T510 — Test “I Am Exploring Without Knowing Where to Start”

**Priority:** P0

---

## P05-T511 — Test New User Navigation

**Priority:** P0

---

## P05-T512 — Test Returning User Navigation

**Priority:** P1

---

## P05-T513 — Test Anonymous User Navigation

**Priority:** P0

---

## P05-T514 — Test Mobile Navigation Through Entire Hierarchy

**Priority:** P0

---

## P05-T515 — Test Back Navigation Through Entire Hierarchy

**Priority:** P0

---

## P05-T516 — Test Direct Search Arrival on a Deep Page

**Priority:** P0

---

## P05-T517 — Ensure Deep Search Visitors Understand Where They Are

**Priority:** P0

---

# Workstream AS — Hierarchy Performance Validation

## P05-T518 — Measure Domain Page Performance

**Priority:** P1

---

## P05-T519 — Measure Stack Page Performance

**Priority:** P1

---

## P05-T520 — Measure Pillar Page Performance

**Priority:** P1

---

## P05-T521 — Measure Module Page Performance

**Priority:** P0

---

## P05-T522 — Measure Large Question List Rendering

**Priority:** P0

---

## P05-T523 — Measure Hierarchy Data Payload

**Priority:** P0

---

## P05-T524 — Measure Client JavaScript Cost

**Priority:** P0

---

## P05-T525 — Measure Layout Shift

**Priority:** P0

---

## P05-T526 — Fix Root Hierarchy Performance Problems

**Priority:** P0

---

# Workstream AT — Hierarchy Regression Protection

## P05-T527 — Add Hierarchy Resolver Coverage

**Priority:** P0

---

## P05-T528 — Add Parent-Child Relationship Coverage

**Priority:** P0

---

## P05-T529 — Add Hierarchy Route Coverage

**Priority:** P0

---

## P05-T530 — Add Hierarchy Canonical Coverage

**Priority:** P0

---

## P05-T531 — Add Hierarchy Sitemap Coverage

**Priority:** P0

---

## P05-T532 — Add Empty Hierarchy Page Protection

**Priority:** P0

---

## P05-T533 — Add Broken Child Link Detection

**Priority:** P0

---

## P05-T534 — Add Orphan Entity Detection

**Priority:** P0

---

## P05-T535 — Add Duplicate Taxonomy Detection

**Priority:** P0

---

## P05-T536 — Add Question List Rendering Coverage

**Priority:** P1

---

## P05-T537 — Add Mobile Hierarchy Regression Coverage

**Priority:** P1

---

# Workstream AU — Phase 05 Completion

## P05-T538 — Freeze Canonical Domain Page Architecture

**Priority:** P0

---

## P05-T539 — Freeze Canonical Stack Page Architecture

**Priority:** P0

---

## P05-T540 — Freeze Canonical Pillar Page Architecture

**Priority:** P0

---

## P05-T541 — Freeze Canonical Module Page Architecture

**Priority:** P0

---

## P05-T542 — Freeze Canonical Question List Architecture

**Priority:** P0

---

## P05-T543 — Freeze Canonical Hierarchy Data Contract

**Priority:** P0

---

## P05-T544 — Freeze Canonical Hierarchy Navigation Contract

**Priority:** P0

---

## P05-T545 — Freeze Canonical Hierarchy SEO Contract

**Priority:** P0

---

## P05-T546 — Publish Hierarchy Component Map

**Priority:** P1

---

## P05-T547 — Publish Legacy-to-V2 Hierarchy Migration Map

**Priority:** P0

---

## P05-T548 — Update V2 Technical Implementation Plan

**Priority:** P1

---

## P05-T549 — Update V2 Decision Log

**Priority:** P1

---

## P05-T550 — Update V2 Issue Log

**Priority:** P1

---

## P05-T551 — Produce Phase 05 Completion Report

Document:

* taxonomy architecture,
* data contracts,
* domain architecture,
* stack architecture,
* pillar architecture,
* module architecture,
* question list architecture,
* internal linking,
* SEO,
* sitemap participation,
* backend dependencies,
* legacy migration.

**Priority:** P0

---

## P05-T552 — Approve Hierarchy Foundation for Question Experience Migration

**Priority:** P0

---

# Phase 05 Exit Criteria

Phase 05 is complete when Interview Explainer has:

* one canonical content hierarchy,
* one canonical domain model,
* one canonical stack model,
* one canonical pillar model,
* one canonical module model,
* explicit question relationships,
* no major orphan hierarchy entities,
* canonical hierarchy URLs,
* correct hierarchy 404 behavior,
* correct legacy redirects,
* one domain-page architecture,
* one stack-page architecture,
* one pillar-page architecture,
* one module-page architecture,
* one scalable question-list architecture,
* canonical breadcrumbs,
* contextual hierarchy navigation,
* strong internal linking,
* controlled crawl depth,
* server-rendered child links,
* mobile-friendly hierarchy navigation,
* SEO-safe taxonomy pages,
* sitemap participation based on page quality,
* backend contracts supporting stable public hierarchy,
* no requirement to load full answers on discovery pages.

---

# Phase 05 Core Principle

```text
THE HIERARCHY SHOULD ANSWER
ONE QUESTION AT EACH LEVEL

DOMAIN
What broad area am I preparing for?

STACK
What preparation track am I following?

PILLAR
What major competency am I learning?

MODULE
What focused topic am I studying?

QUESTION
What exact concept am I understanding?
```

The intended transformation is:

```text
CURRENT RISK

Large content library
Too many cards
Too much metadata
Taxonomy exposed everywhere
Users unsure where they are
Deep questions difficult to discover
Potential orphan pages
Hierarchy pages with unclear purpose
SEO pages created without enough value

        ↓

V2

Clear progressive discovery
One purpose per hierarchy level
Canonical parent-child relationships
Calm hub pages
Scannable question lists
Strong breadcrumbs
Contextual navigation
Server-visible links
Controlled crawl depth
Meaningful SEO landing pages
Scalable support for 10,000+ questions
```

---

# Critical Rule for Interview Explainer

The hierarchy must not be designed only around the current Java Backend structure.

Java Backend is the best **reference implementation** because it already has deep content:

```text
18+ pillars
        ↓
many modules
        ↓
30–50 questions per module
        ↓
thousands of interview questions
```

But the architecture must also support:

```text
DATA ANALYST

Domain
    ↓
Role / Preparation Track
    ↓
Competency Area
    ↓
Focused Topic
    ↓
Interview Question
```

And:

```text
MANAGEMENT CONSULTING

Domain
    ↓
Interview Track
    ↓
Case Category
    ↓
Case Skill / Framework
    ↓
Interview Prompt
```

The labels displayed to users may eventually differ by domain.

The underlying architecture should remain stable.

---

# Important Architecture Boundary

Phase 05 owns:

* discovery hierarchy,
* taxonomy pages,
* parent-child navigation,
* module question lists.

Phase 05 does **not** own the detailed individual question reading experience.

That is the next phase.

---

# Next Phase

```text
PHASE 06

INDIVIDUAL QUESTION PAGE
&
INTERVIEW ANSWER READING EXPERIENCE
```

Phase 06 is one of the most important V2 phases.

It will rebuild the page where the user actually consumes the product:

```text
QUESTION
    ↓
DIRECT ANSWER
    ↓
DEEP EXPLANATION
    ↓
EXAMPLE / CODE / FRAMEWORK
    ↓
INTERVIEW CONTEXT
    ↓
FOLLOW-UP QUESTIONS
    ↓
RELATED LEARNING
```

The phase should focus heavily on the problem already identified in the current website:

* answer pages feel dense,
* too many boxes compete with the answer,
* typography does not create enough reading rhythm,
* sidebars can compete with the main content,
* long answers become walls of text,
* short answers may feel underdeveloped,
* code and explanation need stronger hierarchy,
* interview-specific usefulness must remain central.

Phase 06 will focus on the **presentation architecture and reading experience of answers**, while the separate later content-quality phase can improve the actual answer language, depth and substance at scale.
