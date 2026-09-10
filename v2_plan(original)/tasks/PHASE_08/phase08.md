# PHASE 08 — AUTHENTICATION, USER STATE, PROGRESS, BOOKMARKS & PERSONALIZATION FOUNDATION

---

# Phase Objective

Build the canonical V2 user architecture for Interview Explainer.

This phase establishes the persistent user layer required for:

* authentication,
* accounts,
* sessions,
* user profiles,
* progress tracking,
* bookmarks,
* recently viewed content,
* learning history,
* preparation preferences,
* dashboard data,
* practice state,
* cross-device synchronization,
* anonymous-to-authenticated migration,
* future mock interviews,
* future resume analysis,
* future job hunting,
* future personalized recommendations.

The architecture must preserve the public SEO-first platform.

The intended model is:

```text
                    INTERVIEW EXPLAINER

                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼

   PUBLIC CONTENT                    USER PRODUCT LAYER

   Domains                           Account
   Stacks                            Progress
   Pillars                           Bookmarks
   Modules                           History
   Questions                         Practice state
   Companies                         Preferences
   Roles                             Dashboard
   SEO pages                         Personalization

          │                                 │
          └────────────────┬────────────────┘
                           │
                           ▼

                  SHARED CONTENT IDs
                  SHARED CANONICAL URLs
                  SHARED TAXONOMY
```

The user layer must attach to canonical content.

It must not create a second version of the content architecture.

---

# Core Architecture Principle

```text
PUBLIC CONTENT
MUST NOT DEPEND ON
AUTHENTICATION STATE
TO RENDER
```

The following must remain independently available where intended:

```text
/domain/...
/stack/...
/pillar/...
/module/...
/question/...
/company/...
/role/...
```

Authentication may add:

```text
✓ Save
✓ Mark complete
✓ Track progress
✓ Add to practice
✓ Resume preparation
✓ Personal recommendations
```

But the underlying page must remain usable without them.

---

# Critical Rendering Boundary

The wrong architecture is:

```text
PAGE REQUEST
     ↓
WAIT FOR AUTH
     ↓
WAIT FOR USER API
     ↓
WAIT FOR PROGRESS API
     ↓
WAIT FOR BOOKMARK API
     ↓
RENDER QUESTION
```

The V2 architecture should be:

```text
PAGE REQUEST
     ↓
RENDER PUBLIC CONTENT IMMEDIATELY
     │
     ├───────────────► SEO CONTENT AVAILABLE
     │
     └───────────────► USER ENHANCEMENTS LOAD INDEPENDENTLY
                              │
                              ├── Bookmark state
                              ├── Progress state
                              ├── History state
                              └── Personal actions
```

This separation is one of the most important architectural requirements in V2.

---

# Workstream A — User System Product Definition

## P08-T001 — Define Public User State

A visitor who has not authenticated.

**Priority:** P0

---

## P08-T002 — Define Anonymous Local User State

A visitor who may have local progress but no server account.

**Priority:** P0

---

## P08-T003 — Define Authenticated User State

**Priority:** P0

---

## P08-T004 — Define Partially Initialized User State

Authenticated but profile or onboarding data is incomplete.

**Priority:** P1

---

## P08-T005 — Define Logged-Out Returning User State

**Priority:** P1

---

## P08-T006 — Define Expired Session State

**Priority:** P0

---

## P08-T007 — Define Deleted Account State

**Priority:** P0

---

## P08-T008 — Define Suspended Account State if Required

**Priority:** P1

---

## P08-T009 — Define User System Scope for V2

**Priority:** P0

---

## P08-T010 — Define Features That Require Authentication

**Priority:** P0

---

## P08-T011 — Define Features That Must Never Require Authentication

Public educational content should remain public unless intentionally classified otherwise.

**Priority:** P0

---

## P08-T012 — Define Optional Authentication Enhancement Model

**Priority:** P0

---

## P08-T013 — Define User Data Ownership Boundaries

**Priority:** P0

---

## P08-T014 — Define User Data Retention Principles

**Priority:** P0

---

## P08-T015 — Define User Privacy Principles

**Priority:** P0

---

# Workstream B — Current Authentication Audit

## P08-T016 — Inventory Current Authentication Implementation

**Priority:** P0

---

## P08-T017 — Inventory Current Authentication Provider

**Priority:** P0

---

## P08-T018 — Inventory Current Login Routes

**Priority:** P0

---

## P08-T019 — Inventory Current Registration Routes

**Priority:** P0

---

## P08-T020 — Inventory Current Logout Flow

**Priority:** P0

---

## P08-T021 — Inventory Current Password Reset Flow

**Priority:** P0

---

## P08-T022 — Inventory Current Email Verification Flow

**Priority:** P0

---

## P08-T023 — Inventory Current OAuth Providers

**Priority:** P0

---

## P08-T024 — Inventory Current Session Storage

**Priority:** P0

---

## P08-T025 — Inventory Current Authentication Cookies

**Priority:** P0

---

## P08-T026 — Inventory Current Token Handling

**Priority:** P0

---

## P08-T027 — Inventory Current Protected Routes

**Priority:** P0

---

## P08-T028 — Inventory Current Frontend Auth Guards

**Priority:** P0

---

## P08-T029 — Inventory Current Backend Auth Guards

**Priority:** P0

---

## P08-T030 — Identify Duplicate Authentication Logic

**Priority:** P0

---

## P08-T031 — Identify Authentication Race Conditions

**Priority:** P0

---

## P08-T032 — Identify Authentication Loading Problems

**Priority:** P0

---

## P08-T033 — Identify Public Pages Blocked by Auth Resolution

**Priority:** P0

---

## P08-T034 — Identify Security Risks

**Priority:** P0

---

## P08-T035 — Produce Current Authentication Architecture Map

**Priority:** P0

---

# Workstream C — Canonical User Identity Model

## P08-T036 — Define Stable Internal User ID

**Priority:** P0

---

## P08-T037 — Separate Internal User ID from Email Address

**Priority:** P0

---

## P08-T038 — Separate Internal User ID from Authentication Provider ID

**Priority:** P0

---

## P08-T039 — Define User Email Field

**Priority:** P0

---

## P08-T040 — Define Email Verification State

**Priority:** P0

---

## P08-T041 — Define Account Creation Timestamp

**Priority:** P0

---

## P08-T042 — Define Account Update Timestamp

**Priority:** P0

---

## P08-T043 — Define Last Authentication Timestamp

**Priority:** P1

---

## P08-T044 — Define Account Status

Potential states:

```text
active
pending_verification
suspended
scheduled_for_deletion
deleted
```

**Priority:** P0

---

## P08-T045 — Define Authentication Provider Association

**Priority:** P0

---

## P08-T046 — Support Multiple Authentication Methods per User if Needed

**Priority:** P1

---

## P08-T047 — Prevent Duplicate User Accounts for the Same Verified Identity Where Possible

**Priority:** P0

---

## P08-T048 — Define Account Linking Policy

**Priority:** P1

---

## P08-T049 — Define User Identity Schema Version

**Priority:** P1

---

## P08-T050 — Document Canonical User Identity Contract

**Priority:** P0

---

# Workstream D — Authentication Technology Decision

## P08-T051 — Evaluate Existing Authentication System

**Priority:** P0

---

## P08-T052 — Determine Whether Existing Provider Should Be Retained

**Priority:** P0

---

## P08-T053 — Evaluate Build-vs-Provider Trade-Off

**Priority:** P0

---

## P08-T054 — Avoid Rebuilding Password Authentication Without Strong Reason

**Priority:** P0

---

## P08-T055 — Evaluate Current Cost at Expected User Scale

**Priority:** P0

---

## P08-T056 — Evaluate Provider Lock-In Risk

**Priority:** P1

---

## P08-T057 — Evaluate Session Architecture

**Priority:** P0

---

## P08-T058 — Evaluate Server-Side Authorization Compatibility

**Priority:** P0

---

## P08-T059 — Evaluate OAuth Support

**Priority:** P1

---

## P08-T060 — Evaluate Email Verification Support

**Priority:** P0

---

## P08-T061 — Evaluate Password Reset Support

**Priority:** P0

---

## P08-T062 — Evaluate Account Deletion Support

**Priority:** P0

---

## P08-T063 — Evaluate Migration Complexity

**Priority:** P0

---

## P08-T064 — Document Authentication Technology Decision

**Priority:** P0

---

# Workstream E — Authentication Boundary Architecture

## P08-T065 — Define Public Route Boundary

**Priority:** P0

---

## P08-T066 — Define Authenticated Route Boundary

**Priority:** P0

---

## P08-T067 — Define Admin Route Boundary

**Priority:** P0

---

## P08-T068 — Define API Authorization Boundary

**Priority:** P0

---

## P08-T069 — Prevent Frontend Route Guards from Acting as Security Controls

**Priority:** P0

---

## P08-T070 — Enforce Authorization Server-Side

**Priority:** P0

---

## P08-T071 — Keep Public Content APIs Public Where Intended

**Priority:** P0

---

## P08-T072 — Keep User Data APIs Protected

**Priority:** P0

---

## P08-T073 — Keep Admin APIs Separately Protected

**Priority:** P0

---

## P08-T074 — Define Authentication Middleware Responsibility

**Priority:** P0

---

## P08-T075 — Define Authorization Middleware Responsibility

**Priority:** P0

---

## P08-T076 — Prevent Authentication Logic Duplication Across Endpoints

**Priority:** P0

---

# Workstream F — Public Page Independence

## P08-T077 — Remove Mandatory Auth Dependency from Public Page Rendering

**Priority:** P0

---

## P08-T078 — Remove Mandatory User Profile Dependency from Public Page Rendering

**Priority:** P0

---

## P08-T079 — Remove Mandatory Progress Dependency from Public Page Rendering

**Priority:** P0

---

## P08-T080 — Remove Mandatory Bookmark Dependency from Public Page Rendering

**Priority:** P0

---

## P08-T081 — Remove Mandatory History Dependency from Public Page Rendering

**Priority:** P0

---

## P08-T082 — Ensure Public HTML Contains Primary Content

**Priority:** P0

---

## P08-T083 — Ensure Search Crawlers Do Not Require User Session

**Priority:** P0

---

## P08-T084 — Ensure Public Pages Work with Cookies Disabled Where Reasonably Possible

**Priority:** P1

---

## P08-T085 — Ensure Auth Service Failure Does Not Remove Public Content

**Priority:** P0

---

## P08-T086 — Ensure User API Failure Does Not Remove Public Content

**Priority:** P0

---

# Workstream G — Session Architecture

## P08-T087 — Define Canonical Session Model

**Priority:** P0

---

## P08-T088 — Define Session Creation

**Priority:** P0

---

## P08-T089 — Define Session Validation

**Priority:** P0

---

## P08-T090 — Define Session Refresh

**Priority:** P0

---

## P08-T091 — Define Session Expiration

**Priority:** P0

---

## P08-T092 — Define Session Revocation

**Priority:** P0

---

## P08-T093 — Define Logout Invalidation

**Priority:** P0

---

## P08-T094 — Define Multi-Device Session Behavior

**Priority:** P1

---

## P08-T095 — Define Remember-Me Behavior if Used

**Priority:** P1

---

## P08-T096 — Avoid Storing Sensitive Long-Lived Tokens in Unsafe Browser Storage

**Priority:** P0

---

## P08-T097 — Define Secure Cookie Strategy Where Applicable

**Priority:** P0

---

## P08-T098 — Define SameSite Policy

**Priority:** P0

---

## P08-T099 — Define Secure Cookie Policy

**Priority:** P0

---

## P08-T100 — Define HttpOnly Policy Where Applicable

**Priority:** P0

---

# Workstream H — Authentication State Resolution

## P08-T101 — Define Initial Unknown Auth State

**Priority:** P0

---

## P08-T102 — Define Authenticated State

**Priority:** P0

---

## P08-T103 — Define Unauthenticated State

**Priority:** P0

---

## P08-T104 — Define Expired State

**Priority:** P0

---

## P08-T105 — Define Error State

**Priority:** P0

---

## P08-T106 — Prevent Auth State Flicker

**Priority:** P0

---

## P08-T107 — Prevent Login Button/User Avatar Flashing Between States

**Priority:** P1

---

## P08-T108 — Prevent Full Public Page Blocking During Auth Resolution

**Priority:** P0

---

## P08-T109 — Scope Auth Loading to Auth-Dependent UI

**Priority:** P0

---

## P08-T110 — Define Auth State Cache Strategy

**Priority:** P1

---

## P08-T111 — Define Auth State Refresh Strategy

**Priority:** P1

---

# Workstream I — Login Experience

## P08-T112 — Build Canonical Login Page

**Priority:** P0

---

## P08-T113 — Use V2 Design System

**Priority:** P0

---

## P08-T114 — Keep Login Page Visually Calm

**Priority:** P0

---

## P08-T115 — Define Email Input

**Priority:** P0

---

## P08-T116 — Define Password Input if Password Authentication Exists

**Priority:** P0

---

## P08-T117 — Define Password Visibility Control

**Priority:** P1

---

## P08-T118 — Define Primary Login Action

**Priority:** P0

---

## P08-T119 — Define OAuth Login Actions

**Priority:** P1

---

## P08-T120 — Define Forgot Password Action

**Priority:** P0

---

## P08-T121 — Define Registration Navigation

**Priority:** P0

---

## P08-T122 — Define Login Loading State

**Priority:** P0

---

## P08-T123 — Define Invalid Credentials State

**Priority:** P0

---

## P08-T124 — Define Network Failure State

**Priority:** P0

---

## P08-T125 — Prevent Duplicate Login Submission

**Priority:** P0

---

## P08-T126 — Preserve Intended Destination After Login

**Priority:** P0

---

# Workstream J — Registration Experience

## P08-T127 — Build Canonical Registration Page

**Priority:** P0

---

## P08-T128 — Minimize Required Registration Fields

**Priority:** P0

---

## P08-T129 — Avoid Asking for Preparation Preferences During Account Creation

Collect optional profile data after account creation.

**Priority:** P0

---

## P08-T130 — Define Email Validation

**Priority:** P0

---

## P08-T131 — Define Password Requirements if Applicable

**Priority:** P0

---

## P08-T132 — Display Password Requirements Clearly

**Priority:** P1

---

## P08-T133 — Define Duplicate Account Handling

**Priority:** P0

---

## P08-T134 — Define Registration Loading State

**Priority:** P0

---

## P08-T135 — Define Registration Error State

**Priority:** P0

---

## P08-T136 — Prevent Duplicate Registration Submission

**Priority:** P0

---

## P08-T137 — Define Post-Registration Destination

**Priority:** P0

---

# Workstream K — Email Verification

## P08-T138 — Define Whether Verification Is Required

**Priority:** P0

---

## P08-T139 — Define Verification Email Trigger

**Priority:** P0

---

## P08-T140 — Define Verification Link Expiration

**Priority:** P0

---

## P08-T141 — Define Verification Success State

**Priority:** P0

---

## P08-T142 — Define Expired Verification Link State

**Priority:** P0

---

## P08-T143 — Define Invalid Verification Link State

**Priority:** P0

---

## P08-T144 — Define Resend Verification Flow

**Priority:** P0

---

## P08-T145 — Rate Limit Verification Resends

**Priority:** P0

---

## P08-T146 — Prevent Account Enumeration

**Priority:** P0

---

# Workstream L — Password Recovery

## P08-T147 — Build Forgot Password Flow

**Priority:** P0

---

## P08-T148 — Define Recovery Request Contract

**Priority:** P0

---

## P08-T149 — Prevent Account Enumeration

**Priority:** P0

---

## P08-T150 — Define Reset Token Expiration

**Priority:** P0

---

## P08-T151 — Define Reset Token Single-Use Behavior

**Priority:** P0

---

## P08-T152 — Build Password Reset Page

**Priority:** P0

---

## P08-T153 — Define Successful Reset Behavior

**Priority:** P0

---

## P08-T154 — Define Invalid Token State

**Priority:** P0

---

## P08-T155 — Define Expired Token State

**Priority:** P0

---

## P08-T156 — Revoke Relevant Sessions After Password Change Where Appropriate

**Priority:** P1

---

# Workstream M — OAuth Authentication

## P08-T157 — Define Supported OAuth Providers

**Priority:** P1

---

## P08-T158 — Prefer High-Value Providers Only

**Priority:** P1

---

## P08-T159 — Define OAuth Callback Architecture

**Priority:** P0

---

## P08-T160 — Validate OAuth State

**Priority:** P0

---

## P08-T161 — Define OAuth Failure State

**Priority:** P0

---

## P08-T162 — Define Existing Email Collision Handling

**Priority:** P0

---

## P08-T163 — Define Account Linking

**Priority:** P1

---

## P08-T164 — Preserve Intended Destination Through OAuth

**Priority:** P0

---

## P08-T165 — Avoid Creating Duplicate Accounts from Provider Differences

**Priority:** P0

---

# Workstream N — Logout Experience

## P08-T166 — Define Logout Action

**Priority:** P0

---

## P08-T167 — Invalidate Session Correctly

**Priority:** P0

---

## P08-T168 — Clear User-Specific Client Cache

**Priority:** P0

---

## P08-T169 — Preserve Public Content Access After Logout

**Priority:** P0

---

## P08-T170 — Prevent Previous User Data from Appearing After Logout

**Priority:** P0

---

## P08-T171 — Define Logout Destination

**Priority:** P1

---

# Workstream O — User Profile Data Model

## P08-T172 — Separate Identity from Profile

**Priority:** P0

---

## P08-T173 — Define Display Name

**Priority:** P1

---

## P08-T174 — Define Optional Avatar

**Priority:** P2

---

## P08-T175 — Define Preparation Role

Examples:

```text
Java Backend Developer
Software Engineer
Data Analyst
Data Engineer
Management Consultant
```

**Priority:** P1

---

## P08-T176 — Define Experience Level

**Priority:** P1

---

## P08-T177 — Define Target Companies as Optional Preference

**Priority:** P2

---

## P08-T178 — Define Preparation Goals

**Priority:** P1

---

## P08-T179 — Define Preferred Domains

**Priority:** P1

---

## P08-T180 — Define Profile Completion State

**Priority:** P2

---

## P08-T181 — Keep Profile Fields Optional Unless Operationally Required

**Priority:** P0

---

## P08-T182 — Avoid Collecting Data Without Product Purpose

**Priority:** P0

---

# Workstream P — User Preferences Model

## P08-T183 — Define Theme Preference

**Priority:** P1

---

## P08-T184 — Define Content Display Preferences if Needed

**Priority:** P2

---

## P08-T185 — Define Preparation Preferences

**Priority:** P1

---

## P08-T186 — Define Notification Preferences for Future Use

**Priority:** P2

---

## P08-T187 — Define Email Communication Preferences

**Priority:** P1

---

## P08-T188 — Separate Essential Preferences from Marketing Consent

**Priority:** P0

---

## P08-T189 — Define Preference Schema Version

**Priority:** P1

---

## P08-T190 — Define Default Preference Values

**Priority:** P0

---

## P08-T191 — Allow Preference Updates

**Priority:** P0

---

# Workstream Q — Canonical User State API Architecture

## P08-T192 — Define Current User Endpoint

**Priority:** P0

---

## P08-T193 — Define User Profile Endpoint

**Priority:** P0

---

## P08-T194 — Define User Preferences Endpoint

**Priority:** P0

---

## P08-T195 — Define User Progress Endpoint

**Priority:** P0

---

## P08-T196 — Define User Bookmark Endpoint

**Priority:** P0

---

## P08-T197 — Define Recent Activity Endpoint

**Priority:** P1

---

## P08-T198 — Define User Summary Endpoint

**Priority:** P1

---

## P08-T199 — Avoid One Giant User Payload

**Priority:** P0

---

## P08-T200 — Avoid Excessive Tiny Requests

**Priority:** P0

---

## P08-T201 — Define Appropriate Aggregation Boundaries

**Priority:** P0

---

## P08-T202 — Version User API Contracts

**Priority:** P1

---

# Workstream R — Progress Tracking Product Definition

## P08-T203 — Define What “Progress” Means

**Priority:** P0

---

## P08-T204 — Separate Viewed from Completed

**Priority:** P0

---

## P08-T205 — Separate Completed from Mastered

**Priority:** P0

---

## P08-T206 — Avoid Treating Page Views as Learning Completion

**Priority:** P0

---

## P08-T207 — Define Manual Completion

**Priority:** P0

---

## P08-T208 — Define Future Practice-Based Mastery

**Priority:** P1

---

## P08-T209 — Define Progress at Question Level

**Priority:** P0

---

## P08-T210 — Define Aggregated Progress at Module Level

**Priority:** P0

---

## P08-T211 — Define Aggregated Progress at Pillar Level

**Priority:** P0

---

## P08-T212 — Define Aggregated Progress at Stack Level

**Priority:** P0

---

## P08-T213 — Define Aggregated Progress at Domain Level

**Priority:** P0

---

# Workstream S — Progress Data Model

## P08-T214 — Use Stable User ID

**Priority:** P0

---

## P08-T215 — Use Stable Content Entity ID

**Priority:** P0

---

## P08-T216 — Store Content Entity Type Where Useful

**Priority:** P1

---

## P08-T217 — Define Progress Status

Potential states:

```text
not_started
in_progress
completed
```

Mastery should be treated separately unless the product definition explicitly combines it.

**Priority:** P0

---

## P08-T218 — Define First Started Timestamp

**Priority:** P1

---

## P08-T219 — Define Last Interaction Timestamp

**Priority:** P1

---

## P08-T220 — Define Completion Timestamp

**Priority:** P1

---

## P08-T221 — Define Progress Source

Examples:

```text
manual
practice
mock_interview
migration
```

**Priority:** P1

---

## P08-T222 — Prevent Duplicate Progress Records

**Priority:** P0

---

## P08-T223 — Define Unique User-Content Constraint

**Priority:** P0

---

## P08-T224 — Define Progress Schema Version

**Priority:** P1

---

# Workstream T — Question Completion Experience

## P08-T225 — Define “Mark Complete” Action

**Priority:** P0

---

## P08-T226 — Keep Completion Action Visually Secondary to Reading

**Priority:** P0

---

## P08-T227 — Avoid Large Gamified Completion Controls

**Priority:** P0

---

## P08-T228 — Support Undo Completion

**Priority:** P0

---

## P08-T229 — Use Optimistic UI Where Safe

**Priority:** P1

---

## P08-T230 — Roll Back Failed Optimistic Updates

**Priority:** P0

---

## P08-T231 — Define Anonymous Completion Behavior

**Priority:** P0

---

## P08-T232 — Define Authenticated Completion Behavior

**Priority:** P0

---

## P08-T233 — Prevent Duplicate Completion Requests

**Priority:** P0

---

## P08-T234 — Ensure Completion Failure Does Not Break Question Reading

**Priority:** P0

---

# Workstream U — Progress Aggregation Architecture

## P08-T235 — Define Module Completion Calculation

**Priority:** P0

---

## P08-T236 — Define Pillar Completion Calculation

**Priority:** P0

---

## P08-T237 — Define Stack Completion Calculation

**Priority:** P0

---

## P08-T238 — Define Domain Completion Calculation

**Priority:** P0

---

## P08-T239 — Define Denominator Rules

**Priority:** P0

---

## P08-T240 — Exclude Draft Questions

**Priority:** P0

---

## P08-T241 — Define Archived Question Handling

**Priority:** P0

---

## P08-T242 — Define Newly Added Question Impact

**Priority:** P1

---

## P08-T243 — Avoid Persisting Every Aggregate if It Can Be Derived Efficiently

**Priority:** P0

---

## P08-T244 — Cache Aggregates Only Where Needed

**Priority:** P1

---

## P08-T245 — Prevent N+1 Progress Queries

**Priority:** P0

---

# Workstream V — Progress UI

## P08-T246 — Define Canonical Progress Indicator

**Priority:** P0

---

## P08-T247 — Define Small Progress Indicator

**Priority:** P0

---

## P08-T248 — Define Detailed Progress Summary

**Priority:** P1

---

## P08-T249 — Avoid Progress Indicators on Every Surface

**Priority:** P0

---

## P08-T250 — Avoid Excessive Progress Colours

**Priority:** P0

---

## P08-T251 — Avoid Progress Ring Overuse

**Priority:** P0

---

## P08-T252 — Prefer Clear Numeric Progress Where Useful

Example:

```text
18 of 42 questions completed
```

**Priority:** P0

---

## P08-T253 — Use Percentage Only Where Meaningful

**Priority:** P0

---

## P08-T254 — Keep Progress Secondary to Content Navigation

**Priority:** P0

---

# Workstream W — Bookmark Product Definition

## P08-T255 — Define Bookmark Purpose

Save content for later review.

**Priority:** P0

---

## P08-T256 — Define Bookmarkable Entity Types

**Priority:** P0

---

## P08-T257 — Prioritize Question Bookmarks

**Priority:** P0

---

## P08-T258 — Consider Module Bookmarks

**Priority:** P1

---

## P08-T259 — Consider Resource Bookmarks

**Priority:** P2

---

## P08-T260 — Avoid Bookmarking Every Entity Type Without Product Need

**Priority:** P0

---

## P08-T261 — Define Bookmark Ordering

**Priority:** P1

---

## P08-T262 — Define Bookmark Removal

**Priority:** P0

---

# Workstream X — Bookmark Data Model

## P08-T263 — Use Stable User ID

**Priority:** P0

---

## P08-T264 — Use Stable Content Entity ID

**Priority:** P0

---

## P08-T265 — Define Entity Type

**Priority:** P0

---

## P08-T266 — Define Bookmark Creation Timestamp

**Priority:** P0

---

## P08-T267 — Prevent Duplicate Bookmarks

**Priority:** P0

---

## P08-T268 — Define Unique User-Entity Constraint

**Priority:** P0

---

## P08-T269 — Avoid Copying Full Content into Bookmark Records

**Priority:** P0

---

## P08-T270 — Resolve Current Content from Canonical Content Source

**Priority:** P0

---

## P08-T271 — Define Deleted Content Handling

**Priority:** P0

---

## P08-T272 — Define Bookmark Schema Version

**Priority:** P1

---

# Workstream Y — Bookmark UI

## P08-T273 — Build Canonical Bookmark Action

**Priority:** P0

---

## P08-T274 — Define Saved State

**Priority:** P0

---

## P08-T275 — Define Unsaved State

**Priority:** P0

---

## P08-T276 — Define Loading State

**Priority:** P0

---

## P08-T277 — Define Failure State

**Priority:** P0

---

## P08-T278 — Support Optimistic Update Where Safe

**Priority:** P1

---

## P08-T279 — Roll Back Failed Updates

**Priority:** P0

---

## P08-T280 — Avoid Blocking Content Interaction

**Priority:** P0

---

## P08-T281 — Avoid Large Bookmark Buttons

**Priority:** P0

---

## P08-T282 — Ensure Accessible State Communication

**Priority:** P0

---

# Workstream Z — Anonymous User State

## P08-T283 — Define Anonymous Local State Scope

**Priority:** P0

---

## P08-T284 — Define Which Progress Can Be Stored Locally

**Priority:** P0

---

## P08-T285 — Define Which Bookmarks Can Be Stored Locally

**Priority:** P0

---

## P08-T286 — Define Recent History Local Storage Policy

**Priority:** P1

---

## P08-T287 — Avoid Storing Sensitive Data Locally

**Priority:** P0

---

## P08-T288 — Define Local Storage Schema

**Priority:** P0

---

## P08-T289 — Version Local State Schema

**Priority:** P1

---

## P08-T290 — Handle Corrupted Local State

**Priority:** P0

---

## P08-T291 — Handle Storage Unavailability

**Priority:** P0

---

## P08-T292 — Prevent Local State Failure from Breaking Public Content

**Priority:** P0

---

# Workstream AA — Anonymous-to-Authenticated Migration

## P08-T293 — Detect Local Anonymous State After Login

**Priority:** P0

---

## P08-T294 — Define Progress Merge Strategy

**Priority:** P0

---

## P08-T295 — Define Bookmark Merge Strategy

**Priority:** P0

---

## P08-T296 — Define Recent History Merge Strategy

**Priority:** P1

---

## P08-T297 — Prevent Authenticated Data Loss

**Priority:** P0

---

## P08-T298 — Prevent Duplicate Records

**Priority:** P0

---

## P08-T299 — Define Conflict Resolution

**Priority:** P0

---

## P08-T300 — Make Merge Idempotent

**Priority:** P0

---

## P08-T301 — Mark Successful Migration

**Priority:** P1

---

## P08-T302 — Prevent Repeated Migration on Every Login

**Priority:** P0

---

## P08-T303 — Handle Partial Migration Failure

**Priority:** P0

---

## P08-T304 — Log Migration Failures Safely

**Priority:** P1

---

# Workstream AB — Recently Viewed Content

## P08-T305 — Define Recently Viewed Product Value

**Priority:** P1

---

## P08-T306 — Define Trackable Entity Types

**Priority:** P1

---

## P08-T307 — Prioritize Questions and Modules

**Priority:** P1

---

## P08-T308 — Define Maximum History Size

**Priority:** P1

---

## P08-T309 — Define Deduplication Behavior

**Priority:** P1

---

## P08-T310 — Define Ordering by Recent Interaction

**Priority:** P1

---

## P08-T311 — Avoid Writing History on Every Minor Interaction

**Priority:** P0

---

## P08-T312 — Avoid Excessive Backend Writes

**Priority:** P0

---

## P08-T313 — Define History Retention

**Priority:** P1

---

## P08-T314 — Allow User to Clear History if Product Exposes It

**Priority:** P1

---

# Workstream AC — Learning Activity Model

## P08-T315 — Distinguish Recent Views from Learning Events

**Priority:** P0

---

## P08-T316 — Define Completion Event

**Priority:** P1

---

## P08-T317 — Define Practice Event for Future Integration

**Priority:** P1

---

## P08-T318 — Define Mock Interview Event for Future Integration

**Priority:** P2

---

## P08-T319 — Define Resume Activity Event for Future Integration

**Priority:** P2

---

## P08-T320 — Define Job Activity Event for Future Integration

**Priority:** P2

---

## P08-T321 — Avoid Building an Unbounded Event Log Without Retention Strategy

**Priority:** P0

---

## P08-T322 — Define Event Schema Version

**Priority:** P1

---

# Workstream AD — Dashboard Foundation API

## P08-T323 — Define Dashboard Summary Contract

**Priority:** P1

---

## P08-T324 — Include Continue Preparation Data

**Priority:** P1

---

## P08-T325 — Include Recent Activity Data

**Priority:** P1

---

## P08-T326 — Include Bookmark Summary

**Priority:** P1

---

## P08-T327 — Include Progress Summary

**Priority:** P1

---

## P08-T328 — Include Active Preparation Track

**Priority:** P1

---

## P08-T329 — Avoid Building Full Dashboard UI in This Phase

**Priority:** P0

---

## P08-T330 — Build Stable Backend Foundation for Dashboard Phase

**Priority:** P0

---

## P08-T331 — Avoid Dashboard Requiring Dozens of Independent API Requests

**Priority:** P0

---

## P08-T332 — Define Efficient Dashboard Aggregation Endpoint

**Priority:** P1

---

# Workstream AE — Continue Preparation Logic

## P08-T333 — Define What “Continue” Means

**Priority:** P1

---

## P08-T334 — Prefer Last Meaningful Learning Activity

**Priority:** P1

---

## P08-T335 — Avoid Using Any Random Last Page View

**Priority:** P0

---

## P08-T336 — Store Stable Content Reference

**Priority:** P0

---

## P08-T337 — Resolve Current Canonical URL

**Priority:** P0

---

## P08-T338 — Handle Deleted Content

**Priority:** P0

---

## P08-T339 — Handle Moved Content Through Canonical Mapping

**Priority:** P0

---

# Workstream AF — Preparation Track Model

## P08-T340 — Define Active Preparation Track

**Priority:** P1

---

## P08-T341 — Allow Multiple Future Tracks Without Breaking Schema

**Priority:** P1

---

## P08-T342 — Define Track Domain

**Priority:** P1

---

## P08-T343 — Define Target Role

**Priority:** P1

---

## P08-T344 — Define Target Experience Level

**Priority:** P1

---

## P08-T345 — Define Optional Target Company

**Priority:** P2

---

## P08-T346 — Define Track Creation Timestamp

**Priority:** P1

---

## P08-T347 — Define Track Status

Potential states:

```text
active
paused
completed
archived
```

**Priority:** P1

---

## P08-T348 — Avoid Coupling Track Model Only to Java Backend

**Priority:** P0

---

# Workstream AG — Personalization Foundation

## P08-T349 — Define Personalization Inputs

**Priority:** P1

---

## P08-T350 — Use Explicit User Preferences First

**Priority:** P0

---

## P08-T351 — Use Progress Data Carefully

**Priority:** P1

---

## P08-T352 — Use Recent Activity Carefully

**Priority:** P1

---

## P08-T353 — Avoid Opaque Personalization at V2 Foundation Stage

**Priority:** P0

---

## P08-T354 — Avoid Mandatory AI Personalization

**Priority:** P0

---

## P08-T355 — Define Deterministic Recommendation Inputs

**Priority:** P1

---

## P08-T356 — Keep User in Control of Preparation Track

**Priority:** P0

---

## P08-T357 — Allow Personalization to Be Reset

**Priority:** P1

---

# Workstream AH — User State Loading Architecture

## P08-T358 — Load Only Required User State per Surface

**Priority:** P0

---

## P08-T359 — Avoid Loading Full User Profile on Every Page

**Priority:** P0

---

## P08-T360 — Avoid Loading Full Progress History on Every Page

**Priority:** P0

---

## P08-T361 — Avoid Loading All Bookmarks on Every Page

**Priority:** P0

---

## P08-T362 — Load Current Question State Where Required

**Priority:** P0

---

## P08-T363 — Load Current Module Progress Where Required

**Priority:** P1

---

## P08-T364 — Load Dashboard Summary Only on Dashboard Surfaces

**Priority:** P0

---

## P08-T365 — Define User State Query Keys

**Priority:** P1

---

## P08-T366 — Define User State Cache Boundaries

**Priority:** P1

---

# Workstream AI — User State Mutation Architecture

## P08-T367 — Define Bookmark Mutation

**Priority:** P0

---

## P08-T368 — Define Progress Mutation

**Priority:** P0

---

## P08-T369 — Define Preference Mutation

**Priority:** P0

---

## P08-T370 — Define Profile Mutation

**Priority:** P0

---

## P08-T371 — Define Preparation Track Mutation

**Priority:** P1

---

## P08-T372 — Use Idempotent Mutations Where Appropriate

**Priority:** P0

---

## P08-T373 — Prevent Duplicate Mutation Submission

**Priority:** P0

---

## P08-T374 — Define Optimistic Update Rules

**Priority:** P1

---

## P08-T375 — Define Rollback Rules

**Priority:** P0

---

## P08-T376 — Define Cache Invalidation Rules

**Priority:** P0

---

# Workstream AJ — User State Backend Performance

## P08-T377 — Measure Current User API Latency

**Priority:** P0

---

## P08-T378 — Define User API Latency Budgets

**Priority:** P0

---

## P08-T379 — Add Appropriate Database Indexes

**Priority:** P0

---

## P08-T380 — Index Progress by User and Content

**Priority:** P0

---

## P08-T381 — Index Bookmarks by User

**Priority:** P0

---

## P08-T382 — Index Recent Activity by User and Time

**Priority:** P1

---

## P08-T383 — Prevent N+1 Content Resolution

**Priority:** P0

---

## P08-T384 — Batch User State Requests Where Appropriate

**Priority:** P1

---

## P08-T385 — Avoid Giant User-State Responses

**Priority:** P0

---

## P08-T386 — Define Pagination for Large Collections

**Priority:** P1

---

# Workstream AK — User Data Security

## P08-T387 — Enforce User Ownership Server-Side

**Priority:** P0

---

## P08-T388 — Never Trust User ID from Client for Ownership

**Priority:** P0

---

## P08-T389 — Resolve Authenticated User from Validated Session

**Priority:** P0

---

## P08-T390 — Prevent Cross-User Bookmark Access

**Priority:** P0

---

## P08-T391 — Prevent Cross-User Progress Access

**Priority:** P0

---

## P08-T392 — Prevent Cross-User History Access

**Priority:** P0

---

## P08-T393 — Prevent Cross-User Profile Modification

**Priority:** P0

---

## P08-T394 — Validate All Mutation Payloads

**Priority:** P0

---

## P08-T395 — Define Maximum Payload Sizes

**Priority:** P0

---

## P08-T396 — Sanitize User-Controlled Display Fields

**Priority:** P0

---

## P08-T397 — Protect Sensitive Logs

**Priority:** P0

---

## P08-T398 — Avoid Logging Authentication Secrets

**Priority:** P0

---

# Workstream AL — CSRF and Request Security

## P08-T399 — Determine CSRF Requirements Based on Session Architecture

**Priority:** P0

---

## P08-T400 — Implement CSRF Protection Where Required

**Priority:** P0

---

## P08-T401 — Validate Request Origin Where Appropriate

**Priority:** P0

---

## P08-T402 — Define CORS Policy

**Priority:** P0

---

## P08-T403 — Avoid Wildcard Credentialed CORS

**Priority:** P0

---

## P08-T404 — Define Trusted Origins

**Priority:** P0

---

## P08-T405 — Review Authentication Callback Origins

**Priority:** P0

---

# Workstream AM — Rate Limiting and Abuse Protection

## P08-T406 — Rate Limit Login Attempts

**Priority:** P0

---

## P08-T407 — Rate Limit Registration Attempts

**Priority:** P0

---

## P08-T408 — Rate Limit Password Reset Requests

**Priority:** P0

---

## P08-T409 — Rate Limit Verification Resends

**Priority:** P0

---

## P08-T410 — Protect User Mutation Endpoints from Abuse

**Priority:** P1

---

## P08-T411 — Avoid Locking Out Legitimate Users Excessively

**Priority:** P0

---

## P08-T412 — Define Abuse Logging

**Priority:** P1

---

# Workstream AN — Account Settings Foundation

## P08-T413 — Define Account Settings Route

**Priority:** P1

---

## P08-T414 — Define Profile Settings Section

**Priority:** P1

---

## P08-T415 — Define Preparation Preferences Section

**Priority:** P1

---

## P08-T416 — Define Appearance Preferences Section

**Priority:** P2

---

## P08-T417 — Define Security Section

**Priority:** P1

---

## P08-T418 — Define Data and Privacy Section

**Priority:** P0

---

## P08-T419 — Define Account Deletion Section

**Priority:** P0

---

## P08-T420 — Avoid Overloading Settings with Future Features

**Priority:** P0

---

# Workstream AO — Account Deletion

## P08-T421 — Define Account Deletion Policy

**Priority:** P0

---

## P08-T422 — Define Immediate vs Delayed Deletion

**Priority:** P0

---

## P08-T423 — Define Reauthentication Requirement

**Priority:** P0

---

## P08-T424 — Define Confirmation Flow

**Priority:** P0

---

## P08-T425 — Define User Data Deletion Scope

**Priority:** P0

---

## P08-T426 — Define Legal Retention Exceptions if Applicable

**Priority:** P0

---

## P08-T427 — Remove or Anonymize User-Owned Data as Required

**Priority:** P0

---

## P08-T428 — Revoke Active Sessions

**Priority:** P0

---

## P08-T429 — Prevent Deleted Account Login

**Priority:** P0

---

## P08-T430 — Define Restoration Window if Offered

**Priority:** P1

---

# Workstream AP — User Data Export Readiness

## P08-T431 — Define Exportable User Data

**Priority:** P1

---

## P08-T432 — Include Profile Data

**Priority:** P1

---

## P08-T433 — Include Preferences

**Priority:** P1

---

## P08-T434 — Include Progress

**Priority:** P1

---

## P08-T435 — Include Bookmarks

**Priority:** P1

---

## P08-T436 — Include Relevant Activity Data

**Priority:** P1

---

## P08-T437 — Exclude Internal Security Metadata

**Priority:** P0

---

## P08-T438 — Define Export Format

**Priority:** P1

---

## P08-T439 — Protect Export Request

**Priority:** P0

---

# Workstream AQ — Header Authentication UI

## P08-T440 — Define Logged-Out Header State

**Priority:** P0

---

## P08-T441 — Define Logged-In Header State

**Priority:** P0

---

## P08-T442 — Define Auth-Resolving Header State

**Priority:** P0

---

## P08-T443 — Avoid Header Layout Shift During Auth Resolution

**Priority:** P0

---

## P08-T444 — Define User Menu Trigger

**Priority:** P0

---

## P08-T445 — Define User Menu Content

**Priority:** P0

---

## P08-T446 — Include Dashboard Link

**Priority:** P1

---

## P08-T447 — Include Bookmarks Link

**Priority:** P1

---

## P08-T448 — Include Settings Link

**Priority:** P1

---

## P08-T449 — Include Logout Action

**Priority:** P0

---

## P08-T450 — Avoid Overloaded User Menus

**Priority:** P0

---

# Workstream AR — Authentication Prompt Strategy

## P08-T451 — Define When to Prompt for Authentication

**Priority:** P0

---

## P08-T452 — Do Not Interrupt Initial Reading

**Priority:** P0

---

## P08-T453 — Do Not Show Immediate Login Modal on Public Content

**Priority:** P0

---

## P08-T454 — Prompt When User Invokes a Persistent Feature

Examples:

```text
Save
Sync progress
Access dashboard
Resume across devices
```

**Priority:** P0

---

## P08-T455 — Preserve Intended User Action Through Login

**Priority:** P0

---

## P08-T456 — Complete Original Action After Authentication Where Safe

**Priority:** P1

---

## P08-T457 — Avoid Repeated Authentication Prompts

**Priority:** P0

---

## P08-T458 — Avoid Manipulative Authentication Walls

**Priority:** P0

---

# Workstream AS — Authentication Modal vs Page Decision

## P08-T459 — Define Canonical Authentication Surface

**Priority:** P0

---

## P08-T460 — Prefer Dedicated Routes for Reliable Auth Flows

**Priority:** P0

---

## P08-T461 — Use Modal Authentication Only if Product Value Justifies Complexity

**Priority:** P1

---

## P08-T462 — Ensure OAuth Works Reliably with Chosen Pattern

**Priority:** P0

---

## P08-T463 — Ensure Password Managers Work Reliably

**Priority:** P0

---

## P08-T464 — Ensure Browser Navigation Works Reliably

**Priority:** P0

---

## P08-T465 — Ensure Deep-Link Return Works Reliably

**Priority:** P0

---

# Workstream AT — SEO Protection for Authentication Routes

## P08-T466 — Noindex Login Page

**Priority:** P0

---

## P08-T467 — Noindex Registration Page

**Priority:** P0

---

## P08-T468 — Noindex Password Reset Pages

**Priority:** P0

---

## P08-T469 — Noindex Verification Pages

**Priority:** P0

---

## P08-T470 — Noindex User Settings Pages

**Priority:** P0

---

## P08-T471 — Noindex Private Dashboard Pages

**Priority:** P0

---

## P08-T472 — Exclude Private Routes from Sitemap

**Priority:** P0

---

## P08-T473 — Prevent User-Specific URLs from Entering Public Sitemap

**Priority:** P0

---

## P08-T474 — Prevent Authentication Query Parameters from Creating Duplicate Public URLs

**Priority:** P0

---

## P08-T475 — Preserve Canonical Public Page URLs Through Login Redirects

**Priority:** P0

---

# Workstream AU — User State and SEO Isolation

## P08-T476 — Ensure Personalized State Does Not Change Canonical URL

**Priority:** P0

---

## P08-T477 — Ensure Bookmark State Does Not Change Canonical Metadata

**Priority:** P0

---

## P08-T478 — Ensure Progress State Does Not Change Canonical Metadata

**Priority:** P0

---

## P08-T479 — Ensure User Name Does Not Enter Public Page Metadata

**Priority:** P0

---

## P08-T480 — Ensure Personalized Recommendations Do Not Replace Primary Crawlable Content

**Priority:** P0

---

## P08-T481 — Ensure Auth Errors Do Not Produce False 404 Responses for Public Pages

**Priority:** P0

---

## P08-T482 — Ensure Expired Sessions Do Not Redirect Public Content Pages to Login

**Priority:** P0

---

# Workstream AV — Backend Database Architecture

## P08-T483 — Define User Table

**Priority:** P0

---

## P08-T484 — Define Authentication Identity Table if Required

**Priority:** P0

---

## P08-T485 — Define User Profile Table

**Priority:** P0

---

## P08-T486 — Define User Preferences Table

**Priority:** P0

---

## P08-T487 — Define Progress Table

**Priority:** P0

---

## P08-T488 — Define Bookmark Table

**Priority:** P0

---

## P08-T489 — Define Recent Activity Table

**Priority:** P1

---

## P08-T490 — Define Preparation Track Table

**Priority:** P1

---

## P08-T491 — Define Appropriate Foreign Keys

**Priority:** P0

---

## P08-T492 — Define Appropriate Unique Constraints

**Priority:** P0

---

## P08-T493 — Define Appropriate Indexes

**Priority:** P0

---

## P08-T494 — Define Cascade Behavior Carefully

**Priority:** P0

---

## P08-T495 — Avoid Accidental User Data Deletion Through Content Deletion

**Priority:** P0

---

## P08-T496 — Define Soft Delete Requirements

**Priority:** P1

---

# Workstream AW — Content Reference Integrity

## P08-T497 — Reference Stable Content IDs

**Priority:** P0

---

## P08-T498 — Do Not Use Question Title as Foreign Key

**Priority:** P0

---

## P08-T499 — Do Not Use Mutable Slug as Sole User-State Identifier

**Priority:** P0

---

## P08-T500 — Resolve Current URL from Canonical Content Record

**Priority:** P0

---

## P08-T501 — Handle Content Slug Changes

**Priority:** P0

---

## P08-T502 — Handle Content Moves Between Modules

**Priority:** P0

---

## P08-T503 — Handle Archived Content

**Priority:** P0

---

## P08-T504 — Handle Deleted Content

**Priority:** P0

---

## P08-T505 — Preserve User Progress Through URL Changes

**Priority:** P0

---

# Workstream AX — User State Consistency

## P08-T506 — Define Server as Source of Truth for Authenticated Persistent State

**Priority:** P0

---

## P08-T507 — Define Local Cache as Performance Layer

**Priority:** P0

---

## P08-T508 — Prevent Multiple Conflicting Sources of Truth

**Priority:** P0

---

## P08-T509 — Define Stale Data Handling

**Priority:** P1

---

## P08-T510 — Define Cross-Tab Synchronization

**Priority:** P1

---

## P08-T511 — Define Cross-Device Synchronization

**Priority:** P0

---

## P08-T512 — Define Conflict Resolution

**Priority:** P0

---

## P08-T513 — Prefer Idempotent State Transitions

**Priority:** P0

---

# Workstream AY — Offline and Network Failure Behavior

## P08-T514 — Ensure Public Content Remains Readable During User API Failure

**Priority:** P0

---

## P08-T515 — Define Bookmark Offline Failure Behavior

**Priority:** P1

---

## P08-T516 — Define Progress Offline Failure Behavior

**Priority:** P1

---

## P08-T517 — Avoid Falsely Confirming Unsaved Server State

**Priority:** P0

---

## P08-T518 — Queue Mutations Only if Reliability Model Is Clearly Defined

**Priority:** P2

---

## P08-T519 — Avoid Complex Offline Sync in V2 Unless Required

**Priority:** P0

---

## P08-T520 — Provide Clear Retry Behavior

**Priority:** P1

---

# Workstream AZ — Accessibility

## P08-T521 — Validate Login Form Labels

**Priority:** P0

---

## P08-T522 — Validate Registration Form Labels

**Priority:** P0

---

## P08-T523 — Validate Password Error Announcements

**Priority:** P0

---

## P08-T524 — Validate Authentication Loading States

**Priority:** P0

---

## P08-T525 — Validate User Menu Keyboard Navigation

**Priority:** P0

---

## P08-T526 — Validate Bookmark State Communication

**Priority:** P0

---

## P08-T527 — Validate Progress Action State Communication

**Priority:** P0

---

## P08-T528 — Validate Focus Management After Authentication Errors

**Priority:** P0

---

## P08-T529 — Validate Focus Visibility

**Priority:** P0

---

## P08-T530 — Validate Mobile Authentication Forms

**Priority:** P0

---

# Workstream BA — Authentication UI Density Reduction

## P08-T531 — Remove Decorative Authentication Panels Where Unnecessary

**Priority:** P0

---

## P08-T532 — Avoid Giant Marketing Panels Beside Login Forms

**Priority:** P0

---

## P08-T533 — Avoid Excessive Social Proof on Authentication Pages

**Priority:** P0

---

## P08-T534 — Avoid Multiple Competing CTAs

**Priority:** P0

---

## P08-T535 — Keep Form Width Readable

**Priority:** P0

---

## P08-T536 — Use Clear Field Spacing

**Priority:** P0

---

## P08-T537 — Use V2 Typography Scale

**Priority:** P0

---

## P08-T538 — Use Restrained Colour

**Priority:** P0

---

## P08-T539 — Support Light Theme

**Priority:** P0

---

## P08-T540 — Support Dark Theme

**Priority:** P0

---

# Workstream BB — Authentication Error Architecture

## P08-T541 — Define Invalid Credentials Error

**Priority:** P0

---

## P08-T542 — Define Unverified Account Error

**Priority:** P0

---

## P08-T543 — Define Suspended Account Error

**Priority:** P0

---

## P08-T544 — Define Expired Session Error

**Priority:** P0

---

## P08-T545 — Define OAuth Failure Error

**Priority:** P0

---

## P08-T546 — Define Network Failure Error

**Priority:** P0

---

## P08-T547 — Define Rate Limit Error

**Priority:** P0

---

## P08-T548 — Avoid Exposing Internal Provider Errors

**Priority:** P0

---

## P08-T549 — Provide Recovery Actions

**Priority:** P0

---

## P08-T550 — Log Technical Details Server-Side

**Priority:** P1

---

# Workstream BC — Observability

## P08-T551 — Measure Login Success Rate

**Priority:** P1

---

## P08-T552 — Measure Login Failure Categories

**Priority:** P1

---

## P08-T553 — Measure Registration Success Rate

**Priority:** P1

---

## P08-T554 — Measure OAuth Failure Rate

**Priority:** P1

---

## P08-T555 — Measure Session Validation Failures

**Priority:** P0

---

## P08-T556 — Measure User API Error Rate

**Priority:** P0

---

## P08-T557 — Measure Progress Mutation Failure Rate

**Priority:** P1

---

## P08-T558 — Measure Bookmark Mutation Failure Rate

**Priority:** P1

---

## P08-T559 — Measure Anonymous Migration Failure Rate

**Priority:** P1

---

## P08-T560 — Protect User Privacy in Telemetry

**Priority:** P0

---

# Workstream BD — Authentication Analytics

## P08-T561 — Track Login Initiation

**Priority:** P2

---

## P08-T562 — Track Login Completion

**Priority:** P2

---

## P08-T563 — Track Registration Initiation

**Priority:** P2

---

## P08-T564 — Track Registration Completion

**Priority:** P2

---

## P08-T565 — Track Authentication Prompt Source

**Priority:** P2

---

## P08-T566 — Track Bookmark Conversion to Registration Carefully

**Priority:** P2

---

## P08-T567 — Track Progress Sync Conversion Carefully

**Priority:** P2

---

## P08-T568 — Avoid Dark-Pattern Optimization

**Priority:** P0

---

# Workstream BE — Migration from Current User System

## P08-T569 — Inventory Existing Users

**Priority:** P0

---

## P08-T570 — Inventory Existing User IDs

**Priority:** P0

---

## P08-T571 — Inventory Existing Authentication Identities

**Priority:** P0

---

## P08-T572 — Inventory Existing Progress Data

**Priority:** P0

---

## P08-T573 — Inventory Existing Bookmark Data

**Priority:** P0

---

## P08-T574 — Inventory Existing User Preferences

**Priority:** P0

---

## P08-T575 — Map Existing User IDs to V2 Stable IDs

**Priority:** P0

---

## P08-T576 — Preserve Existing Account Access

**Priority:** P0

---

## P08-T577 — Preserve Existing Progress Where Valid

**Priority:** P0

---

## P08-T578 — Preserve Existing Bookmarks Where Valid

**Priority:** P0

---

## P08-T579 — Handle Orphaned User Data

**Priority:** P0

---

## P08-T580 — Validate Migration Before Cutover

**Priority:** P0

---

## P08-T581 — Define Migration Rollback Strategy

**Priority:** P0

---

# Workstream BF — Legacy Authentication Cleanup

## P08-T582 — Remove Duplicate Auth Providers

**Priority:** P0

---

## P08-T583 — Remove Duplicate Auth Contexts

**Priority:** P0

---

## P08-T584 — Remove Duplicate Session Logic

**Priority:** P0

---

## P08-T585 — Remove Duplicate Route Guards

**Priority:** P0

---

## P08-T586 — Remove Dead Login Components

**Priority:** P0

---

## P08-T587 — Remove Dead Registration Components

**Priority:** P0

---

## P08-T588 — Remove Dead User API Endpoints

**Priority:** P0

---

## P08-T589 — Remove Dead User State Stores

**Priority:** P0

---

## P08-T590 — Remove Legacy Auth CSS

**Priority:** P0

---

## P08-T591 — Remove Unsafe Token Storage

**Priority:** P0

---

## P08-T592 — Prevent Legacy Auth Reintroduction

**Priority:** P1

---

# Workstream BG — Security Validation

## P08-T593 — Validate Authentication Bypass Resistance

**Priority:** P0

---

## P08-T594 — Validate Authorization Boundaries

**Priority:** P0

---

## P08-T595 — Validate Cross-User Data Isolation

**Priority:** P0

---

## P08-T596 — Validate Session Expiration

**Priority:** P0

---

## P08-T597 — Validate Session Revocation

**Priority:** P0

---

## P08-T598 — Validate Logout Invalidation

**Priority:** P0

---

## P08-T599 — Validate Password Reset Tokens

**Priority:** P0

---

## P08-T600 — Validate Verification Tokens

**Priority:** P0

---

## P08-T601 — Validate OAuth State Handling

**Priority:** P0

---

## P08-T602 — Validate CSRF Protection Where Required

**Priority:** P0

---

## P08-T603 — Validate CORS Policy

**Priority:** P0

---

## P08-T604 — Validate Rate Limiting

**Priority:** P0

---

## P08-T605 — Validate Sensitive Logging Controls

**Priority:** P0

---

# Workstream BH — Public Page Regression Validation

## P08-T606 — Test Public Page While Logged Out

**Priority:** P0

---

## P08-T607 — Test Public Page While Logged In

**Priority:** P0

---

## P08-T608 — Test Public Page with Expired Session

**Priority:** P0

---

## P08-T609 — Test Public Page with Auth Service Failure

**Priority:** P0

---

## P08-T610 — Test Public Page with User API Failure

**Priority:** P0

---

## P08-T611 — Test Public Page with Progress API Failure

**Priority:** P0

---

## P08-T612 — Test Public Page with Bookmark API Failure

**Priority:** P0

---

## P08-T613 — Ensure Primary Content Is Identical Where Personalization Is Not Intended

**Priority:** P0

---

## P08-T614 — Ensure Metadata Remains Stable

**Priority:** P0

---

## P08-T615 — Ensure Canonical URL Remains Stable

**Priority:** P0

---

# Workstream BI — User State Regression Coverage

## P08-T616 — Add User Identity Contract Coverage

**Priority:** P0

---

## P08-T617 — Add Session Contract Coverage

**Priority:** P0

---

## P08-T618 — Add Authorization Coverage

**Priority:** P0

---

## P08-T619 — Add Progress Contract Coverage

**Priority:** P0

---

## P08-T620 — Add Bookmark Contract Coverage

**Priority:** P0

---

## P08-T621 — Add Anonymous State Coverage

**Priority:** P0

---

## P08-T622 — Add Anonymous Migration Coverage

**Priority:** P0

---

## P08-T623 — Add Content Reference Integrity Coverage

**Priority:** P0

---

## P08-T624 — Add Account Deletion Coverage

**Priority:** P0

---

## P08-T625 — Add Public Page Independence Coverage

**Priority:** P0

---

# Workstream BJ — Representative Acceptance Scenarios

## P08-T626 — Anonymous User Reads Question

No login required.

**Priority:** P0

---

## P08-T627 — Anonymous User Marks Question Complete Locally

**Priority:** P0

---

## P08-T628 — Anonymous User Saves Question Locally if Supported

**Priority:** P0

---

## P08-T629 — Anonymous User Creates Account

**Priority:** P0

---

## P08-T630 — Anonymous Progress Merges into Account

**Priority:** P0

---

## P08-T631 — Existing User Logs In

**Priority:** P0

---

## P08-T632 — Existing User Sees Synced Progress

**Priority:** P0

---

## P08-T633 — Existing User Adds Bookmark

**Priority:** P0

---

## P08-T634 — Bookmark Appears on Another Device

**Priority:** P0

---

## P08-T635 — User Marks Question Complete

**Priority:** P0

---

## P08-T636 — Module Progress Updates

**Priority:** P0

---

## P08-T637 — User Logs Out

**Priority:** P0

---

## P08-T638 — Previous User Data Disappears from Shared Browser UI

**Priority:** P0

---

## P08-T639 — Expired Session Does Not Block Public Question

**Priority:** P0

---

## P08-T640 — Auth Backend Failure Does Not Block Public Question

**Priority:** P0

---

## P08-T641 — User Deletes Account

**Priority:** P0

---

# Workstream BK — Backend Integrity Validation

## P08-T642 — Validate User Foreign Keys

**Priority:** P0

---

## P08-T643 — Validate Content Reference Foreign Keys or Integrity Layer

**Priority:** P0

---

## P08-T644 — Validate Unique Progress Constraints

**Priority:** P0

---

## P08-T645 — Validate Unique Bookmark Constraints

**Priority:** P0

---

## P08-T646 — Validate Cascade Rules

**Priority:** P0

---

## P08-T647 — Validate Account Deletion Behavior

**Priority:** P0

---

## P08-T648 — Validate Content Deletion Behavior

**Priority:** P0

---

## P08-T649 — Validate Slug Change Behavior

**Priority:** P0

---

## P08-T650 — Validate Concurrent Mutations

**Priority:** P0

---

## P08-T651 — Validate Idempotency

**Priority:** P0

---

# Workstream BL — Performance Validation

## P08-T652 — Measure Public Page Performance Logged Out

**Priority:** P0

---

## P08-T653 — Measure Public Page Performance Logged In

**Priority:** P0

---

## P08-T654 — Compare Authenticated Overhead

**Priority:** P0

---

## P08-T655 — Measure Auth Resolution Time

**Priority:** P0

---

## P08-T656 — Measure Current User Endpoint Latency

**Priority:** P0

---

## P08-T657 — Measure Bookmark State Latency

**Priority:** P1

---

## P08-T658 — Measure Progress State Latency

**Priority:** P1

---

## P08-T659 — Measure Dashboard Summary API Latency

**Priority:** P1

---

## P08-T660 — Fix Root User-State Performance Bottlenecks

**Priority:** P0

---

# Workstream BM — Data Migration Safety

## P08-T661 — Back Up Existing User Data Before Migration

**Priority:** P0

---

## P08-T662 — Create Migration Verification Counts

**Priority:** P0

---

## P08-T663 — Compare User Counts Before and After Migration

**Priority:** P0

---

## P08-T664 — Compare Progress Record Counts

**Priority:** P0

---

## P08-T665 — Compare Bookmark Record Counts

**Priority:** P0

---

## P08-T666 — Detect Orphaned Records

**Priority:** P0

---

## P08-T667 — Detect Duplicate Records

**Priority:** P0

---

## P08-T668 — Produce Migration Exception Report

**Priority:** P0

---

## P08-T669 — Do Not Delete Legacy Data Until V2 Validation Completes

**Priority:** P0

---

# Workstream BN — Phase 08 Completion

## P08-T670 — Freeze Canonical User Identity Contract

**Priority:** P0

---

## P08-T671 — Freeze Canonical Authentication Architecture

**Priority:** P0

---

## P08-T672 — Freeze Canonical Session Architecture

**Priority:** P0

---

## P08-T673 — Freeze Canonical Authorization Boundary

**Priority:** P0

---

## P08-T674 — Freeze Canonical User Profile Contract

**Priority:** P0

---

## P08-T675 — Freeze Canonical User Preference Contract

**Priority:** P0

---

## P08-T676 — Freeze Canonical Progress Contract

**Priority:** P0

---

## P08-T677 — Freeze Canonical Bookmark Contract

**Priority:** P0

---

## P08-T678 — Freeze Canonical Anonymous State Contract

**Priority:** P0

---

## P08-T679 — Freeze Canonical Anonymous Migration Strategy

**Priority:** P0

---

## P08-T680 — Freeze Canonical User State API Contracts

**Priority:** P0

---

## P08-T681 — Freeze Canonical Public/Auth Rendering Boundary

**Priority:** P0

---

## P08-T682 — Freeze Canonical Authentication SEO Policy

**Priority:** P0

---

## P08-T683 — Publish Authentication Architecture Map

**Priority:** P0

---

## P08-T684 — Publish User Data Model

**Priority:** P0

---

## P08-T685 — Publish User State Flow Diagram

**Priority:** P0

---

## P08-T686 — Publish Anonymous Migration Flow

**Priority:** P0

---

## P08-T687 — Publish Security Boundary Documentation

**Priority:** P0

---

## P08-T688 — Update V2 Technical Implementation Plan

**Priority:** P1

---

## P08-T689 — Update V2 Decision Log

**Priority:** P1

---

## P08-T690 — Update V2 Issue Log

**Priority:** P1

---

## P08-T691 — Produce Phase 08 Completion Report

Document:

* authentication architecture,
* user identity,
* session architecture,
* authorization,
* public/auth separation,
* login,
* registration,
* OAuth,
* password recovery,
* profile,
* preferences,
* progress,
* bookmarks,
* anonymous state,
* anonymous migration,
* recent activity,
* dashboard foundation,
* personalization foundation,
* database architecture,
* API architecture,
* security,
* privacy,
* performance,
* migration,
* legacy cleanup.

**Priority:** P0

---

## P08-T692 — Approve User Foundation for Higher-Level Product Features

**Priority:** P0

---

# Phase 08 Exit Criteria

Phase 08 is complete when Interview Explainer has:

* one canonical user identity model,
* one canonical authentication architecture,
* secure session handling,
* server-side authorization,
* public content independent from auth state,
* no public page blocked by user-state loading,
* canonical login and registration experiences,
* reliable account recovery,
* reliable OAuth where selected,
* canonical profile architecture,
* canonical preferences architecture,
* question-level progress tracking,
* hierarchical progress aggregation,
* canonical bookmark architecture,
* anonymous local state where intentionally supported,
* anonymous-to-account migration,
* cross-device synchronization,
* recent activity foundation,
* preparation track foundation,
* dashboard backend foundation,
* personalization-ready data contracts,
* stable content references,
* protected user data APIs,
* account deletion architecture,
* SEO isolation for private routes,
* migration strategy for existing users,
* legacy authentication cleanup.

---

# Phase 08 Core Principle

```text
THE PUBLIC WEBSITE
SHOULD WORK WITHOUT AN ACCOUNT.

THE PRODUCT
SHOULD BECOME MORE USEFUL
WITH AN ACCOUNT.
```

---

# Canonical User Experience

The intended progression is:

```text
GOOGLE
   ↓
QUESTION PAGE
   ↓
READ ANSWER
   ↓
EXPLORE RELATED CONTENT
   ↓
MARK COMPLETE / SAVE
   ↓
OPTIONAL ACCOUNT
   ↓
SYNC PROGRESS
   ↓
CONTINUE PREPARATION
   ↓
PERSONAL DASHBOARD
   ↓
PRACTICE
   ↓
MOCK INTERVIEWS
```

Not:

```text
GOOGLE
   ↓
QUESTION PAGE
   ↓
LOGIN WALL
   ↓
REGISTRATION FORM
   ↓
ONBOARDING
   ↓
DASHBOARD
   ↓
MAYBE FIND THE QUESTION AGAIN
```

---

# Critical Backend Principle

User-state tables must reference stable content identity.

Correct:

```text
USER
  │
  ├── PROGRESS
  │      └── content_id
  │
  ├── BOOKMARK
  │      └── content_id
  │
  └── ACTIVITY
         └── content_id

CONTENT ENTITY
  │
  ├── stable_id
  ├── current_slug
  ├── canonical_url
  └── publication_state
```

Incorrect:

```text
BOOKMARK
  └── question_title

PROGRESS
  └── current_url_string

HISTORY
  └── mutable_slug_only
```

The stable-ID model allows:

* slug changes,
* URL migrations,
* taxonomy restructuring,
* module moves,
* title improvements,

without destroying user history.

---

# Critical SEO Principle

Authentication must never become a hidden dependency of SEO.

The following architecture is prohibited:

```text
CRAWLER REQUEST
      ↓
AUTH PROVIDER INITIALIZATION
      ↓
USER STATE RESOLUTION
      ↓
PAGE CONTENT
```

The correct architecture is:

```text
CRAWLER / USER REQUEST
      ↓
PUBLIC PAGE CONTENT
      ↓
CANONICAL METADATA
      ↓
PRIMARY CONTENT AVAILABLE

AUTHENTICATED USER ONLY
      ↓
OPTIONAL PERSONAL STATE
```

---

# Root-Level Fix Rule

If bookmarks fail on many pages:

```text
DO NOT FIX
50 BOOKMARK BUTTONS
```

Fix:

```text
CANONICAL BOOKMARK COMPONENT
        +
CANONICAL BOOKMARK API
        +
CANONICAL USER-ENTITY CONTRACT
```

If progress is inconsistent:

```text
DO NOT PATCH
MODULE PERCENTAGES INDIVIDUALLY
```

Fix:

```text
ONE PROGRESS DATA MODEL
        +
ONE AGGREGATION RULE
        +
ONE CONTENT IDENTITY SYSTEM
```

If authenticated pages become slow:

```text
DO NOT REMOVE
RANDOM USER FEATURES
```

Inspect:

```text
AUTH RESOLUTION
USER API WATERFALLS
N+1 QUERIES
OVERFETCHING
CACHE BOUNDARIES
PUBLIC/AUTH COUPLING
```

Fix the shared architecture.

---

# Relationship with Previous Phases

```text
PHASE 02
CANONICAL URL ARCHITECTURE
        ↓
User state survives URL changes

PHASE 03
DESIGN SYSTEM
        ↓
Authentication and user UI use shared primitives

PHASE 04
GLOBAL SHELL
        ↓
Header supports authenticated and public states

PHASE 05
CONTENT HIERARCHY
        ↓
Progress aggregates through canonical taxonomy

PHASE 06
QUESTION EXPERIENCE
        ↓
Questions become trackable learning units

PHASE 07
SEARCH
        ↓
Users discover canonical content

PHASE 08
USER FOUNDATION
        ↓
Users can persist their preparation state
```

---

# What Phase 08 Deliberately Does Not Do

This phase creates the foundation but should not expand uncontrollably into:

```text
FULL DASHBOARD REDESIGN
FULL PRACTICE ENGINE
AI MOCK INTERVIEWS
REAL INTERVIEW PLATFORM
RESUME ANALYSIS
JOB HUNTING AUTOMATION
SOCIAL NETWORK
GAMIFICATION SYSTEM
PAYMENTS
SUBSCRIPTIONS
```

Those systems should build on the contracts created here.

Phase 08 establishes:

```text
IDENTITY
+
STATE
+
OWNERSHIP
+
PERSISTENCE
+
SYNC
```

Everything later depends on those foundations.

---

# Recommended Implementation Order

The phase should not be executed strictly by numerical task order.

The recommended dependency sequence is:

```text
1. AUDIT CURRENT AUTH + USER SYSTEM
        ↓
2. FREEZE USER IDENTITY MODEL
        ↓
3. FREEZE PUBLIC / AUTH BOUNDARY
        ↓
4. FREEZE SESSION + AUTHORIZATION MODEL
        ↓
5. FIX LOGIN / REGISTRATION / RECOVERY
        ↓
6. BUILD USER DATA SCHEMA
        ↓
7. BUILD USER STATE APIs
        ↓
8. BUILD PROGRESS
        ↓
9. BUILD BOOKMARKS
        ↓
10. BUILD ANONYMOUS STATE
        ↓
11. BUILD ANONYMOUS → ACCOUNT MIGRATION
        ↓
12. BUILD RECENT ACTIVITY
        ↓
13. BUILD DASHBOARD FOUNDATION API
        ↓
14. MIGRATE EXISTING USERS
        ↓
15. REMOVE LEGACY SYSTEMS
        ↓
16. SECURITY + PERFORMANCE VALIDATION
```

---

# Phase 08 Deliverable Structure

Recommended task directory:

```text
docs/v2/tasks/PHASE_08/
│
├── README.md
├── 00_PHASE_OVERVIEW.md
├── 01_CURRENT_AUTH_AUDIT.md
├── 02_USER_IDENTITY.md
├── 03_AUTH_ARCHITECTURE.md
├── 04_SESSION_ARCHITECTURE.md
├── 05_AUTHORIZATION.md
├── 06_PUBLIC_AUTH_BOUNDARY.md
├── 07_LOGIN_REGISTRATION.md
├── 08_USER_DATA_MODEL.md
├── 09_PROGRESS_SYSTEM.md
├── 10_BOOKMARK_SYSTEM.md
├── 11_ANONYMOUS_STATE.md
├── 12_STATE_MIGRATION.md
├── 13_ACTIVITY_SYSTEM.md
├── 14_DASHBOARD_FOUNDATION.md
├── 15_SECURITY.md
├── 16_MIGRATION.md
├── 17_LEGACY_CLEANUP.md
└── 18_COMPLETION_REPORT.md
```

---

# Phase 08 Summary

```text
692 TASKS

PRIMARY FOCUS:

AUTHENTICATION
USER IDENTITY
SESSIONS
AUTHORIZATION
BACKEND USER DATABASE
PROGRESS
BOOKMARKS
ANONYMOUS STATE
CROSS-DEVICE SYNC
USER HISTORY
DASHBOARD FOUNDATION
PERSONALIZATION FOUNDATION
SECURITY
PRIVACY
SEO ISOLATION
PERFORMANCE
MIGRATION
LEGACY CLEANUP
```

---

# Next Phase

```text
PHASE 09

DASHBOARD,
PERSONAL PREPARATION WORKSPACE,
DAILY PRACTICE
&
LEARNING CONTINUITY
```

Phase 09 should transform the raw user-state infrastructure from Phase 08 into the actual **returning-user experience**.

The central question becomes:

```text
A USER RETURNS TO
INTERVIEW EXPLAINER TOMORROW.

DO THEY IMMEDIATELY KNOW:

WHAT THEY WERE STUDYING?
WHAT THEY COMPLETED?
WHAT THEY SHOULD DO NEXT?
WHAT NEEDS REVISION?
WHAT TO PRACTICE TODAY?
```

Phase 09 should therefore cover:

* dashboard information architecture,
* continue preparation,
* active preparation tracks,
* daily practice,
* preparation plans,
* progress summaries,
* bookmarks workspace,
* recent activity,
* weak areas,
* revision queues,
* streaks only if genuinely useful,
* personalized next actions,
* multi-domain preparation,
* backend aggregation,
* dashboard performance,
* mobile dashboard,
* empty states,
* new-user dashboard,
* returning-user dashboard,
* avoiding a dense “analytics control panel” UI,
* and creating a calm personal workspace rather than another card-heavy page.
