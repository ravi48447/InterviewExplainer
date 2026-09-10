# Interview Explainer V2 — AI Agent Master Execution Protocol

**Document:** `19_AI_AGENT_MASTER_EXECUTION_PROTOCOL.md`
**Status:** Final Master Control Document
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md` through `18_IMPLEMENTATION_ROADMAP.md`
**Purpose:** Define the permanent operating protocol for AI coding agents working on Interview Explainer V2 so that repository modifications remain controlled, context-aware, architecture-aligned, testable, reversible, documented, and consistent across long-running multi-session implementation.

---

# 1. Purpose of This Document

Interview Explainer V2 is too large to be safely implemented through a single instruction such as:

```text
Read these documents and rebuild the entire repository.
```

That approach creates predictable failure modes:

```text
Context Loss

Scope Drift

Architecture Drift

Duplicated Components

Inconsistent UI

SEO Regressions

Broken URLs

Unnecessary Rewrites

Half-Finished Features

Unverified Changes

Large Unreviewable Commits
```

The solution is not:

```text
Find an AI with a larger context window.
```

The solution is:

```text
Create a development process
that does not require one agent
to remember the entire project continuously.
```

This document defines that process.

---

# 2. Core Principle

The permanent AI implementation principle is:

> **The repository and project control documents must preserve project state. The AI agent should never be the only place where project context exists.**

The wrong architecture is:

```text
Human explains everything

↓

AI remembers everything

↓

AI implements everything

↓

Context window ends

↓

Project knowledge disappears
```

The correct architecture is:

```text
ARCHITECTURE DOCUMENTS

+

REPOSITORY

+

MIGRATION TRACKER

+

DECISION LOG

+

ISSUE LOG

+

TASK REPORTS

+

GIT HISTORY

        ↓

PERSISTENT PROJECT STATE
```

---

# 3. AI Is an Executor, Not the Project Memory

The AI agent may:

```text
Inspect

Reason

Plan

Implement

Test

Refactor

Document
```

But the project must not depend on the agent remembering:

```text
What happened 50 tasks ago

Why an architectural decision was made

Which route has already been migrated

Which issue was intentionally deferred

What the current V2 status is
```

That information must exist in the repository.

---

# 4. Source-of-Truth Hierarchy

When working on V2, use the following hierarchy:

```text
1. CURRENT REPOSITORY REALITY

2. V2 ARCHITECTURE DOCUMENTS

3. V2 DECISION LOG

4. V2 MIGRATION TRACKER

5. CURRENT TASK SPECIFICATION

6. HISTORICAL TASK REPORTS
```

This hierarchy requires careful interpretation.

---

# 5. Repository Reality

The repository defines:

```text
What currently exists

What currently builds

What currently runs

What current routes actually are

What current dependencies actually are
```

Architecture documents must not cause an agent to hallucinate files, frameworks, or systems that do not exist.

---

# 6. Architecture Documents

The V2 documents define:

```text
Target Principles

Target Experience

Target Architecture

Constraints

Standards
```

The repository defines the starting point.

The documents define the intended direction.

---

# 7. Decision Log

The decision log overrides earlier assumptions where an intentional project decision has been recorded.

Example:

```text
Original document suggested X.

Repository audit showed Y.

Decision made to implement Z.

Reason documented.
```

Future agents must follow:

```text
Z
```

unless a new decision explicitly supersedes it.

---

# 8. Current Task Specification

The current task defines:

```text
What to do now.
```

It does not authorize unrelated work.

---

# 9. Conflict Resolution

If sources conflict:

```text
STOP

↓

IDENTIFY CONFLICT

↓

INSPECT REPOSITORY

↓

CHECK DECISION LOG

↓

PRESERVE CORE V2 PRINCIPLE

↓

DOCUMENT REQUIRED DECISION
```

Do not silently choose.

---

# 10. Required Project Control Files

The V2 implementation should maintain:

```text
docs/v2/
├── 00_VISION.md
├── ...
├── 19_AI_AGENT_MASTER_EXECUTION_PROTOCOL.md
├── V2_REPOSITORY_AUDIT.md
├── V2_TECHNICAL_IMPLEMENTATION_PLAN.md
├── V2_MIGRATION_TRACKER.md
├── V2_DECISION_LOG.md
├── V2_ISSUE_LOG.md
└── task-reports/
```

The exact directory may adapt to repository structure.

---

# 11. V2 Migration Tracker

The migration tracker is the primary implementation status source.

Recommended structure:

```text
# Interview Explainer V2 Migration Tracker

Last Updated:
Current Phase:
Current Branch:
Current Commit:

## Phase Status

| Phase | Status | Validation |
|---|---|---|
| Repository Audit | VALIDATED | Yes |
| Baseline Capture | IN PROGRESS | Partial |
| Design Foundation | NOT STARTED | No |

## Current Task

Task ID:
Task Name:
Status:
Dependencies:

## Completed Tasks

...

## Next Recommended Tasks

...

## Blockers

...
```

---

# 12. Migration Tracker Rule

Every significant task must update the tracker.

The tracker must answer:

```text
Where are we?

What is complete?

What is currently being worked on?

What is blocked?

What should happen next?
```

---

# 13. Decision Log

Maintain:

```text
V2_DECISION_LOG.md
```

Recommended entry:

```text
## DEC-001 — Preserve Existing Question URLs

Date:
Status: Accepted

### Context

### Decision

### Reason

### Alternatives Considered

### Impact
```

---

# 14. Decision Log Rule

Record decisions that affect:

```text
Architecture

URLs

Data Model

SEO

Design System

Authentication

Infrastructure

Major Dependencies

Scope
```

Do not record every trivial CSS adjustment.

---

# 15. Issue Log

Maintain:

```text
V2_ISSUE_LOG.md
```

Use it for important problems discovered outside the current task.

Example:

```text
ISSUE-014

Duplicate canonical generation exists in company routes.

Severity: P1
Status: OPEN
Discovered During: TASK-022
Recommended Phase: SEO Hardening
```

---

# 16. Issue Log Rule

The issue log prevents:

```text
I found another problem,
so I rewrote another subsystem.
```

The default behavior is:

```text
Discover

↓

Record

↓

Continue Current Task
```

unless the issue blocks the task.

---

# 17. Task Reports

Every significant implementation task should create a concise report.

Recommended location:

```text
docs/v2/task-reports/TASK-XXX.md
```

---

# 18. Task Report Structure

```text
# TASK-XXX — Task Name

## Objective

## Files Inspected

## Files Changed

## Implementation Summary

## Decisions

## Validation Performed

## Validation Results

## Issues Discovered

## Remaining Risks

## Recommended Next Task

## Commit
```

---

# 19. Why Task Reports Matter

Git shows:

```text
What changed.
```

Task reports explain:

```text
Why it changed.

What was inspected.

What was validated.

What remains unresolved.
```

---

# 20. Agent Session Startup Protocol

Every new AI coding session must begin with:

```text
STEP 1
Inspect repository state

STEP 2
Read migration tracker

STEP 3
Read current task

STEP 4
Read relevant architecture documents

STEP 5
Inspect relevant code

STEP 6
Confirm task scope internally

STEP 7
Implement
```

---

# 21. Do Not Read Everything Every Time

The agent does not need to read all 20 architecture documents before every task.

That recreates context overload.

Instead:

```text
Read:

Master protocol

+

Migration tracker

+

Relevant architecture documents

+

Relevant code
```

---

# 22. Relevant Document Selection

Examples:

For UI foundation:

```text
Vision

Design System

UI Architecture

Accessibility

Implementation Roadmap

Master Protocol
```

For SEO:

```text
SEO Architecture

Information Architecture

Content Architecture

Performance

Implementation Roadmap

Master Protocol
```

For authentication:

```text
Authentication / User System

Security

Data Architecture

Implementation Roadmap

Master Protocol
```

---

# 23. Mandatory Master Context

Every implementation task should understand at minimum:

```text
Current Migration Tracker

Current Task Specification

Relevant V2 Documents

Current Repository Files
```

---

# 24. Agent Startup Command

The standard conceptual instruction is:

```text
You are implementing Interview Explainer V2.

Do not begin coding immediately.

First:

1. Inspect the current Git state.
2. Read the V2 migration tracker.
3. Read the current task specification.
4. Read only the V2 architecture documents relevant to this task.
5. Inspect the existing implementation before proposing changes.
6. Identify any conflict between repository reality and the V2 documents.
7. Do not modify unrelated systems.
8. Do not change public URLs unless explicitly authorized.
9. Do not rewrite content unless the task explicitly requires it.
10. Define the validation required for this task.

Then implement the smallest coherent solution that satisfies the task.
```

---

# 25. No Coding Before Inspection

The agent must not begin by:

```text
Creating new files based on assumptions.
```

It must first inspect:

```text
Existing Files

Existing Components

Existing Patterns

Existing Dependencies

Existing Tests
```

---

# 26. Reuse Before Create

Before creating a component:

Search for:

```text
Existing Equivalent

Existing Partial Equivalent

Existing Primitive
```

Then choose:

```text
Reuse

Refactor

Replace

Create
```

---

# 27. No Duplicate Architecture

The agent must not create:

```text
ButtonV2

NewButton

BetterButton

ButtonFinal
```

when one canonical component should exist.

---

# 28. Task Definition Requirement

No major coding task should begin without:

```text
Task ID

Objective

In Scope

Out of Scope

Relevant Documents

Expected Files / Areas

Constraints

Validation
```

---

# 29. Standard Task Template

```text
TASK ID:
TASK NAME:

OBJECTIVE:

IN SCOPE:

OUT OF SCOPE:

RELEVANT V2 DOCUMENTS:

FILES / AREAS TO INSPECT:

CONSTRAINTS:

IMPLEMENTATION REQUIREMENTS:

VALIDATION:

EXPECTED COMPLETION REPORT:
```

---

# 30. Example — Good UI Task

```text
TASK ID:
TASK-021

TASK NAME:
Migrate Question Detail Page to V2 Reading Layout

OBJECTIVE:
Implement the V2 reading experience for the existing question-detail route family.

IN SCOPE:
- Question page layout
- Typography
- Answer content container
- Metadata placement
- Question navigation
- Related question placement
- Mobile behavior
- Light and dark mode

OUT OF SCOPE:
- Rewriting answer content
- Changing question slugs
- Changing content storage
- Rebuilding search
- Changing authentication

RELEVANT V2 DOCUMENTS:
- Design System
- Page Architecture
- Accessibility
- Performance
- Implementation Roadmap

CONSTRAINTS:
- Preserve existing public URLs
- Preserve content
- Reuse V2 primitives
- Avoid unnecessary client-side JavaScript

VALIDATION:
- Lint
- Type check
- Build
- Desktop review
- Mobile review
- Light mode
- Dark mode
- Metadata unchanged unless intentionally improved
```

---

# 31. Example — Bad Task

```text
Improve question pages and fix anything else you notice.
```

This creates unlimited scope.

---

# 32. Task Size Rule

A task should be:

```text
Large enough to produce a coherent improvement.

Small enough to understand completely.
```

---

# 33. Recommended Task Duration

Do not define tasks by clock time.

Define them by:

```text
One coherent architectural responsibility.
```

Examples:

```text
Design tokens

Application shell

Question page route family

Sitemap generator

Canonical architecture

Search result component
```

---

# 34. Task Dependency Rule

A task should not begin if a required foundation is incomplete.

Example:

```text
Do not migrate 500 pages
before the design primitives are validated.
```

---

# 35. Task Status

Use:

```text
NOT STARTED

IN PROGRESS

BLOCKED

DONE

VALIDATED
```

---

# 36. DONE Is Not VALIDATED

```text
DONE
```

means:

```text
Code implementation is complete.
```

```text
VALIDATED
```

means:

```text
Required checks have passed.
```

---

# 37. Agent Planning Protocol

Before editing code, the agent should determine:

```text
What exists?

What must change?

What must remain unchanged?

What is the smallest coherent implementation?

How will success be verified?
```

---

# 38. No Unnecessary Rewrites

Prefer:

```text
Targeted Refactor
```

over:

```text
Rewrite
```

unless the current implementation fundamentally prevents the target architecture.

---

# 39. Rewrite Justification

A rewrite requires explicit reasoning:

```text
Current limitation

Why incremental migration is unsafe or inefficient

Replacement scope

Migration risk

Validation
```

---

# 40. Public URL Protection

Public URLs are protected by default.

The agent must not:

```text
Rename route segments

Change slug generation

Move content to new URLs
```

without explicit authorization.

---

# 41. URL Change Protocol

If a URL change is necessary:

```text
Document Current URL

Document Target URL

Explain Reason

Create Redirect

Update Internal Links

Update Sitemap

Validate Canonical
```

---

# 42. Content Protection

During UI and architecture migration:

The agent must not:

```text
Summarize

Rewrite

Expand

Shorten

Regenerate
```

existing interview answers unless the task explicitly belongs to the content workstream.

---

# 43. Content Formatting Exception

The agent may change:

```text
Rendering

Spacing

Section Components

Code Presentation

Visual Hierarchy
```

without changing the semantic content.

---

# 44. SEO Protection

Every public route modification should consider:

```text
URL

Status Code

Title

Description

Canonical

Robots

Structured Data

Internal Links

Rendered Content
```

---

# 45. SEO Change Rule

Do not modify SEO behavior incidentally.

If SEO changes:

It should be:

```text
Intentional

Documented

Validated
```

---

# 46. Indexability Protection

The agent must actively guard against:

```text
Accidental noindex

Accidental robots blocking

Client-only core content

Broken sitemap URLs

Canonical to wrong domain

Preview domain canonicals
```

---

# 47. Design-System Protection

Once V2 tokens and primitives are validated:

New pages should use them.

Avoid page-specific parallel design systems.

---

# 48. UI Density Rule

The V2 UI should prioritize:

```text
Reading

Hierarchy

Focus

Whitespace

Progressive Disclosure
```

over:

```text
Maximum information visible simultaneously.
```

---

# 49. Question Page Priority

The question-detail page is the primary reading surface.

When visual trade-offs occur:

Prioritize:

```text
Answer Readability

Question Clarity

Code Readability

Navigation
```

over:

```text
Decorative Density

Extra Widgets

Excessive Metadata
```

---

# 50. Mobile-First Validation

Every public UI task must be checked on mobile.

Do not assume responsive utility classes guarantee a good mobile experience.

---

# 51. Dark Mode Validation

Every shared UI component should be checked in:

```text
Light

Dark
```

where both themes are supported.

---

# 52. Accessibility Protocol

Every interactive component should consider:

```text
Keyboard

Focus

Semantic Element

Accessible Name

Contrast

Reduced Motion
```

---

# 53. Performance Protocol

Before adding a dependency:

Ask:

```text
Can the existing stack already do this?
```

Before making a component client-side:

Ask:

```text
Does this actually require browser interactivity?
```

---

# 54. Dependency Addition Protocol

A new dependency should have:

```text
Purpose

Reason existing stack is insufficient

Maintenance confidence

Bundle impact where relevant
```

---

# 55. No Dependency Tourism

Do not add libraries merely because:

```text
They are popular.
```

---

# 56. Security Protocol

The agent must not:

```text
Expose secrets

Disable authorization to make something work

Trust client-side role checks

Commit environment values

Log sensitive user data
```

---

# 57. Database Change Protocol

Before changing schema:

Inspect:

```text
Current schema

Migration system

Existing data

Backward compatibility

Deployment order
```

---

# 58. Database Migration Rule

Do not make destructive schema changes casually.

Prefer:

```text
Add

Migrate

Validate

Remove Later
```

when practical.

---

# 59. Authentication Change Protocol

Authentication changes require explicit validation of:

```text
Login

Logout

Session

Protected Routes

Server Authorization

Failure States
```

---

# 60. Search Change Protocol

Search changes should validate:

```text
Exact Match

Partial Match

No Result

Special Characters

Performance

Navigation to Result
```

---

# 61. Analytics Change Protocol

Analytics events should answer a real product question.

Do not instrument every click indiscriminately.

---

# 62. Event Naming

Use a consistent convention.

Example:

```text
search_performed

question_opened

question_completed

bookmark_added
```

The actual convention should follow the repository standard.

---

# 63. Validation Before Completion

Every task must run the validation appropriate to its scope.

Potential:

```text
Lint

Type Check

Unit Tests

Integration Tests

Production Build

Route Tests

Visual Review

Accessibility Review

SEO Inspection
```

---

# 64. Validation Must Be Real

Do not report:

```text
Should work.
```

Report:

```text
Command run

Result

Failures

Warnings
```

---

# 65. Validation Failure Rule

If validation fails:

Do not mark the task validated.

Classify failure:

```text
Caused by Current Task

Pre-Existing

Environment-Related

Unknown
```

---

# 66. Pre-Existing Failure Rule

If a failure existed before the task:

Document it.

Do not automatically fix unrelated failures unless they block the task.

---

# 67. Build Rule

Before a major phase is merged:

A production build must pass.

---

# 68. Browser Validation

For visual tasks:

Code compilation is insufficient.

Inspect the rendered result.

---

# 69. Screenshot Validation

For major UI migrations:

Capture representative screenshots where tooling permits.

Compare against:

```text
Current Baseline

V2 Design Intent
```

---

# 70. SEO Validation

For SEO tasks:

Inspect actual generated output.

Do not assume framework metadata configuration produces the expected HTML.

---

# 71. Route Validation

For route changes:

Test:

```text
Valid Route

Invalid Route

Trailing Slash Behavior if relevant

Canonical

Redirect

404
```

---

# 72. Sitemap Validation

Sitemap checks should detect:

```text
404 URLs

Redirect URLs

Duplicate URLs

Noncanonical URLs

Private URLs
```

---

# 73. Commit Protocol

After a coherent validated task:

Create a logical commit.

---

# 74. Commit Scope

A commit should represent:

```text
One understandable change.
```

---

# 75. Commit Message

Use the repository's convention.

If none exists:

Prefer conventional descriptive messages.

Examples:

```text
feat(ui): add v2 design system foundations

refactor(question): migrate detail page reading layout

fix(seo): correct canonical URL generation

test(content): validate duplicate question slugs
```

---

# 76. No Automatic Push Without Authorization

An agent may:

```text
Modify

Validate

Commit
```

according to the working agreement.

But pushing to a remote or merging into production should follow explicit repository permissions and workflow.

---

# 77. Production Branch Protection

Never directly modify production merely because:

```text
The change looks safe.
```

---

# 78. Task Completion Protocol

At the end of every significant task:

```text
1. Run required validation.

2. Update task report.

3. Update migration tracker.

4. Update decision log if required.

5. Update issue log if required.

6. Create logical commit if authorized.

7. Report current repository state.

8. Recommend the next bounded task.
```

---

# 79. Completion Report Format

The agent should report:

```text
TASK:
STATUS:

FILES INSPECTED:

FILES CHANGED:

WHAT CHANGED:

WHAT DID NOT CHANGE:

VALIDATION:

RESULTS:

DECISIONS:

ISSUES DISCOVERED:

REMAINING RISKS:

COMMIT:

NEXT RECOMMENDED TASK:
```

---

# 80. Context Handoff Protocol

When a session ends:

The next agent should not need the previous chat transcript.

The repository should contain enough state to continue.

---

# 81. Handoff Minimum State

Before ending:

Ensure:

```text
Migration Tracker Updated

Task Report Written

Decision Log Updated if needed

Issue Log Updated if needed

Git State Known
```

---

# 82. New Session Recovery

A new session should be able to execute:

```text
Read Master Protocol

↓

Read Migration Tracker

↓

Inspect Git State

↓

Read Current / Next Task

↓

Read Relevant Documents

↓

Continue
```

---

# 83. No Dependence on Chat History

Chat history is helpful.

It is not the authoritative implementation state.

---

# 84. Context Compression

Do not repeatedly paste all architecture documents into every prompt.

Instead reference repository files.

Example:

```text
Read:

docs/v2/19_AI_AGENT_MASTER_EXECUTION_PROTOCOL.md

docs/v2/V2_MIGRATION_TRACKER.md

docs/v2/04_DESIGN_SYSTEM.md

docs/v2/05_PAGE_ARCHITECTURE.md

Then inspect the current question route.
```

---

# 85. Context Refresh Rule

Before a major new phase:

Re-read:

```text
Vision

Implementation Roadmap

Master Protocol

Relevant Phase Documents
```

---

# 86. Long-Running Agent Rule

Even if one agent can continue for many tasks:

Still update persistent state after every task.

Do not rely on:

```text
I still remember.
```

---

# 87. Agent Drift Detection

Signs of drift:

```text
Creating unrelated features

Changing URLs without task requirement

Introducing new visual language

Rewriting content during UI work

Adding dependencies unnecessarily

Ignoring migration tracker

Skipping validation

Changing architecture without decision record
```

---

# 88. Drift Response

If drift is detected:

```text
STOP CURRENT EXPANSION

↓

RETURN TO TASK SCOPE

↓

REVERT UNRELATED CHANGES IF NECESSARY

↓

LOG IMPORTANT DISCOVERIES

↓

CONTINUE BOUNDED TASK
```

---

# 89. Scope Expansion Request

If the agent believes scope must expand:

It should report:

```text
Current blocker

Required additional scope

Why it is necessary

Files affected

Risk
```

before performing major expansion.

---

# 90. Blocking Issue Protocol

If a blocker prevents completion:

Mark:

```text
BLOCKED
```

and record:

```text
Blocker

Evidence

Possible Resolutions

Recommended Decision
```

---

# 91. Do Not Fake Completion

Never mark:

```text
DONE
```

because:

```text
Most of it works.
```

---

# 92. Partial Completion

Use:

```text
IN PROGRESS
```

or:

```text
BLOCKED
```

with explicit remaining work.

---

# 93. Rollback Protocol

Before high-risk changes:

Ensure a known Git checkpoint exists.

---

# 94. Rollback Triggers

Consider rollback when:

```text
Critical functionality breaks

Public content disappears

Major SEO regression occurs

Data integrity is threatened

Architecture becomes less maintainable
```

---

# 95. Fix-Forward vs Rollback

Use:

```text
Fix Forward
```

for small isolated defects.

Use:

```text
Rollback
```

for broad high-risk regressions.

---

# 96. AI Agent Permissions Model

Agents should operate with the minimum permissions required.

Avoid giving:

```text
Production Secrets

Unrestricted Infrastructure Access

Direct Production Database Access
```

unless explicitly required and controlled.

---

# 97. Repository Write Access

Repository write access should preferably target:

```text
Dedicated V2 Branch
```

rather than production.

---

# 98. Secret Handling

Secrets belong in:

```text
Environment Configuration

Secret Managers

Platform Configuration
```

not:

```text
Prompts

Documentation

Committed Files
```

---

# 99. External Service Changes

Changes to:

```text
Cloudflare

DNS

Authentication Provider

Database Provider

Payment Provider

Analytics Provider
```

require explicit task scope.

---

# 100. No Infrastructure Surprise

An AI agent should not:

```text
Change DNS

Delete production resources

Rotate credentials

Change billing plans
```

as incidental implementation work.

---

# 101. Human Approval Gates

Human approval should be required before:

```text
Production Deployment

Destructive Database Migration

Public URL Restructure

Authentication Provider Migration

DNS Change

Payment Activation

Major Data Deletion
```

---

# 102. AI Autonomy Within a Task

Within an approved bounded task:

The agent should be able to:

```text
Inspect

Edit

Refactor

Test

Document
```

without requiring approval for every line.

---

# 103. The Goal Is Controlled Autonomy

Avoid both extremes:

```text
EXTREME A

Ask permission before every file edit.
```

and:

```text
EXTREME B

Rewrite the entire product without checkpoints.
```

The target is:

```text
BOUNDED AUTONOMY
```

---

# 104. Bounded Autonomy Model

```text
Human / Project Plan defines:

WHAT

WHY

BOUNDARY

SUCCESS


AI Agent determines:

HOW

IMPLEMENTATION DETAILS

LOCAL REFACTORING

VALIDATION
```

---

# 105. Architecture Change Boundary

If implementation requires changing:

```text
Major architecture

Public URL policy

Core data model

Authentication model

Product scope
```

the agent should create or request a decision.

---

# 106. Minor Implementation Freedom

The agent may choose:

```text
Function Names

Internal Component Composition

Local File Organization

Implementation Details
```

when consistent with repository standards.

---

# 107. Parallel Agent Protocol

Multiple agents may work in parallel only when ownership boundaries are clear.

---

# 108. Safe Parallel Example

```text
Agent A

Design Tokens


Agent B

SEO Audit


Agent C

Content Inventory Tool
```

provided they do not modify the same core files.

---

# 109. Unsafe Parallel Example

```text
Agent A

Rewrite App Layout


Agent B

Rewrite Navigation


Agent C

Rewrite Global Styles
```

simultaneously.

---

# 110. Parallel Work Ownership

Define:

```text
Task

Files / Areas

Dependencies

Merge Order
```

---

# 111. Shared File Conflict

Files such as:

```text
Global Layout

Global CSS

Package Manifest

Core Configuration
```

should have coordinated ownership.

---

# 112. Parallel Merge Protocol

Before merging parallel work:

```text
Rebase / Update

Resolve Conflicts Intentionally

Run Combined Validation

Inspect Integration
```

---

# 113. AI Review Protocol

An AI agent may review another agent's work.

The reviewer should inspect:

```text
Task Requirements

Diff

Validation

Architecture Alignment

Scope Compliance
```

---

# 114. Review Is Not Reimplementation

The reviewer should not rewrite everything according to personal preference.

---

# 115. Review Severity

Classify findings:

```text
BLOCKER

MAJOR

MINOR

OPTIONAL
```

---

# 116. Review Questions

Ask:

```text
Does it satisfy the task?

Did it preserve required behavior?

Did it introduce unrelated changes?

Does validation pass?

Does it follow V2 principles?

Is there unnecessary complexity?
```

---

# 117. No Style Wars

Do not block implementation over arbitrary preferences when:

```text
Repository convention is followed

Architecture is sound

Task requirements are met
```

---

# 118. Repository Audit Agent Protocol

The first major AI task should be:

```text
AUDIT ONLY
```

No code modification.

---

# 119. Audit Agent Responsibilities

Inspect:

```text
Repository Tree

Framework

Routes

Content

SEO

Authentication

Database

APIs

Styles

Dependencies

Tests

Deployment
```

---

# 120. Audit Output

Produce:

```text
V2_REPOSITORY_AUDIT.md
```

with evidence from actual files.

---

# 121. Audit Prohibition

The audit task must not:

```text
Fix

Refactor

Upgrade

Delete
```

anything.

---

# 122. Baseline Agent Protocol

The next task should capture:

```text
Routes

Content

SEO

Sitemap

Screenshots

Performance

Search Metrics
```

where available.

---

# 123. Technical Planning Agent Protocol

Only after audit and baseline:

Create:

```text
V2_TECHNICAL_IMPLEMENTATION_PLAN.md
```

---

# 124. Technical Plan Must Be Repository-Specific

Do not repeat generic architecture documentation.

It should say:

```text
Current file X

will become

Target structure Y

through migration Z
```

---

# 125. First Coding Task

The first coding task should generally be:

```text
V2 Design Foundation
```

after audit and technical planning.

---

# 126. Design Foundation Task

Implement:

```text
Tokens

Typography

Spacing

Core Layout

Required Primitives
```

Do not redesign all pages yet.

---

# 127. First Page Migration

Prefer a core question-detail route.

---

# 128. First Page Validation

Use it to test:

```text
Reading Width

Typography

Spacing

Code Blocks

Navigation

Mobile

Dark Mode
```

---

# 129. Design Correction Window

After representative page migration:

Allow one deliberate design correction pass.

---

# 130. Design Freeze

After correction:

Freeze core design language.

Future route migrations should not reinvent it.

---

# 131. Route-Family Migration Protocol

For each route family:

```text
Inspect

Map

Implement

Validate

Update Tracker

Commit
```

---

# 132. Route-Family Completion

A route family is not validated until:

```text
Layout

Responsive Behavior

Metadata

Canonical

Internal Links

404 Behavior

Sitemap Behavior
```

are checked where relevant.

---

# 133. SEO Hardening Protocol

After major public migration:

Run a dedicated SEO hardening phase.

---

# 134. SEO Hardening Is Not an Excuse

Do not intentionally ignore SEO during UI migration because:

```text
We will fix SEO later.
```

The hardening phase is for comprehensive validation.

---

# 135. Full Regression Protocol

Before preview release:

Compare V2 against baseline.

---

# 136. Regression Categories

```text
Routes

Content

SEO

Visual

Functional

Performance

Accessibility

Security
```

---

# 137. Missing Route Protocol

Every missing baseline route must be classified:

```text
Intentionally Removed

Redirected

Replaced

Regression
```

---

# 138. Content Count Difference

Every significant content count difference should be investigated.

---

# 139. Production Release Protocol

AI may prepare release artifacts.

Production release requires explicit approval.

---

# 140. Release Checklist

```text
[ ] Production build passes

[ ] Critical tests pass

[ ] Route regression reviewed

[ ] SEO regression reviewed

[ ] Mobile reviewed

[ ] Rollback point known

[ ] Environment changes documented

[ ] Human approval received
```

---

# 141. Post-Release Protocol

After deployment:

Verify actual production.

Do not assume deployment success means application success.

---

# 142. Production Smoke Test

Check:

```text
Homepage

Question

Hub

Search

Authentication

Dashboard

robots.txt

sitemap
```

---

# 143. Search Observation

Track:

```text
Indexed Pages

Crawl Activity

Impressions

Clicks

CTR

Average Position
```

over meaningful time windows.

---

# 144. No Daily SEO Panic

Do not rewrite SEO architecture because:

```text
Average position changed for one day.
```

---

# 145. Data-Based Iteration

Post-release changes should use:

```text
Observed Problem

Evidence

Hypothesis

Bounded Change

Measurement
```

---

# 146. Master Agent Prompt

The following prompt may be used to start an AI coding agent on Interview Explainer V2.

```text
You are an implementation agent working on Interview Explainer V2.

Your job is not to redesign or rewrite the entire repository autonomously.

Your job is to execute one bounded V2 task at a time while preserving repository integrity, public URLs, SEO, content, and project context.

Before making any code change:

1. Inspect the current Git branch, commit, and working tree.
2. Read docs/v2/19_AI_AGENT_MASTER_EXECUTION_PROTOCOL.md.
3. Read docs/v2/V2_MIGRATION_TRACKER.md.
4. Read the current task specification.
5. Read only the V2 architecture documents relevant to the current task.
6. Inspect the existing repository implementation related to the task.
7. Search for existing components, utilities, patterns, and dependencies before creating new ones.
8. Identify conflicts between repository reality and the architecture documents.
9. Do not silently resolve major architectural conflicts. Record or request a decision.
10. Determine the validation required before implementation.

Permanent constraints:

- Do not modify unrelated systems.
- Do not change existing public URLs unless explicitly authorized.
- Do not change slug-generation behavior unless explicitly authorized.
- Do not rewrite interview content unless the task explicitly belongs to the content workstream.
- Do not introduce a parallel design system.
- Do not create duplicate components when an existing component can be reused or refactored.
- Do not add dependencies without a clear need.
- Do not expose secrets.
- Do not weaken authentication or authorization.
- Do not treat client-side checks as security.
- Do not mark a task VALIDATED unless the required checks actually pass.
- Do not hide validation failures.
- Do not fix unrelated pre-existing issues unless they block the assigned task.
- Record important out-of-scope issues in V2_ISSUE_LOG.md.
- Record meaningful architectural decisions in V2_DECISION_LOG.md.
- Update V2_MIGRATION_TRACKER.md after every significant task.
- Create a task report for every significant implementation task.

Implementation behavior:

1. Understand the existing implementation.
2. Define the smallest coherent change.
3. Preserve behavior that is outside the task.
4. Implement according to relevant V2 architecture.
5. Run task-appropriate validation.
6. Fix failures caused by the task.
7. Document pre-existing failures separately.
8. Update project state documents.
9. Create a logical commit if authorized.
10. Report exactly what changed, what did not change, what validation ran, and what should happen next.

For visual tasks:

- Prioritize reading comfort over information density.
- Use the shared V2 design system.
- Validate mobile.
- Validate light and dark modes.
- Validate keyboard and focus behavior.
- Avoid unnecessary client-side JavaScript.

For public route tasks:

- Preserve URLs by default.
- Verify status codes.
- Verify metadata.
- Verify canonical behavior.
- Verify indexability.
- Verify internal links.
- Verify sitemap behavior where relevant.

For SEO tasks:

- Inspect generated output.
- Do not rely only on configuration.
- Detect accidental noindex.
- Detect robots blocking.
- Detect wrong-domain canonicals.
- Detect redirect URLs in sitemaps.
- Detect 404 URLs in sitemaps.
- Preserve server-visible core content.

For database tasks:

- Inspect the current schema and migration system first.
- Avoid destructive changes where a staged migration is possible.
- Consider deployment order and backward compatibility.

For authentication tasks:

- Validate login, logout, sessions, protected routes, and server-side authorization.

At task completion, report:

TASK:
STATUS:

FILES INSPECTED:

FILES CHANGED:

WHAT CHANGED:

WHAT DID NOT CHANGE:

VALIDATION RUN:

VALIDATION RESULTS:

DECISIONS:

ISSUES DISCOVERED:

REMAINING RISKS:

COMMIT:

NEXT RECOMMENDED TASK:

Do not proceed to the next task automatically unless explicitly instructed or unless the approved execution mode authorizes sequential task execution.
```

---

# 147. Task-Specific Prompt Template

Use this after the master protocol is established.

```text
TASK ID:

TASK NAME:

OBJECTIVE:

IN SCOPE:

OUT OF SCOPE:

RELEVANT V2 DOCUMENTS:

FILES / AREAS TO INSPECT:

CONSTRAINTS:

IMPLEMENTATION REQUIREMENTS:

VALIDATION:

EXPECTED OUTPUT:
```

---

# 148. Autonomous Sequential Execution Mode

Interview Explainer may later use a more autonomous mode.

In that mode:

The agent may:

```text
Complete Task

↓

Validate

↓

Update State

↓

Commit

↓

Select Next Approved Task

↓

Continue
```

But only within an approved phase and task queue.

---

# 149. Autonomous Mode Boundary

Autonomous mode must stop when encountering:

```text
Major Architecture Decision

Destructive Migration

Public URL Restructure

Production Deployment

Secret Requirement

External Billing Change

Unclear Product Decision

Repeated Validation Failure
```

---

# 150. Approved Task Queue

Autonomous mode should operate from:

```text
V2_MIGRATION_TRACKER.md
```

or a dedicated:

```text
V2_TASK_QUEUE.md
```

---

# 151. Task Queue Example

```text
TASK-001
Repository Audit
STATUS: READY

TASK-002
Route Inventory
STATUS: BLOCKED BY TASK-001

TASK-003
SEO Audit
STATUS: BLOCKED BY TASK-001

TASK-004
Production Baseline
STATUS: BLOCKED BY TASK-002

TASK-005
Technical Migration Plan
STATUS: BLOCKED BY TASK-001, TASK-002, TASK-003, TASK-004
```

---

# 152. Dependency-Aware Execution

The agent may select only tasks whose dependencies are:

```text
VALIDATED
```

---

# 153. Autonomous Mode Must Still Create Checkpoints

Autonomy does not remove:

```text
Task Reports

Validation

Tracker Updates

Commits
```

---

# 154. Maximum Safe Autonomy

The safest long-running model is:

```text
PHASE APPROVED BY HUMAN

↓

TASK QUEUE APPROVED

↓

AI EXECUTES BOUNDED TASKS

↓

EACH TASK VALIDATED + COMMITTED

↓

AI STOPS AT DECISION GATE

↓

HUMAN REVIEWS PHASE

↓

NEXT PHASE APPROVED
```

---

# 155. Why This Model Is Better Than One Giant Prompt

A giant prompt depends on:

```text
Continuous Context

Perfect Memory

Perfect Planning

No Unexpected Repository Reality
```

This protocol depends on:

```text
Persistent State

Small Tasks

Validation

Git

Documentation

Explicit Decisions
```

The second model is more reliable.

---

# 156. Why This Model Is Better Than Pure Manual Development

The AI agent can still perform substantial work:

```text
Repository Inspection

Refactoring

Implementation

Testing

Documentation

Repetitive Migration

Validation
```

The process does not remove AI autonomy.

It makes autonomy safer.

---

# 157. Why This Model Is Better Than Cursor Drift

The common failure pattern is:

```text
Prompt 1
Good context

Prompt 10
Partial context

Prompt 30
Different assumptions

Prompt 60
Architecture drift
```

The protocol changes this to:

```text
Every Task

↓

Reload Current State from Repository
```

---

# 158. Why This Model Is Better Than Chat Memory

Chat memory may help understand the project.

But implementation state belongs in:

```text
Repository Files

Git History

Project Trackers
```

---

# 159. Repository as External Memory

The repository should function as:

```text
LONG-TERM MEMORY
```

for the implementation process.

---

# 160. Git as Recovery System

Git provides:

```text
History

Diff

Checkpoint

Rollback

Blame

Branch Isolation
```

Use it deliberately.

---

# 161. Documents as Architecture Memory

The V2 documents preserve:

```text
Intent

Principles

Standards

Target Architecture
```

---

# 162. Tracker as Execution Memory

The tracker preserves:

```text
Current State

Completed Work

Next Work

Blockers
```

---

# 163. Decision Log as Reasoning Memory

The decision log preserves:

```text
Why the system differs from the original plan.
```

---

# 164. Issue Log as Deferred Memory

The issue log preserves:

```text
Important problems that should not derail the current task.
```

---

# 165. Task Reports as Local Memory

Task reports preserve:

```text
What happened during each implementation unit.
```

---

# 166. Complete Persistent Context System

```text
ARCHITECTURE DOCS
What should the system become?


REPOSITORY
What actually exists?


MIGRATION TRACKER
Where are we?


DECISION LOG
Why did we choose this?


ISSUE LOG
What remains wrong?


TASK REPORTS
What happened?


GIT
Exactly what changed?
```

---

# 167. Agent Failure Recovery

If an agent stops unexpectedly:

The next agent should:

```text
Inspect Git Status

Read Tracker

Read Last Task Report

Inspect Uncommitted Diff

Determine Whether Work Is:

Complete

Partial

Broken

Unknown
```

---

# 168. Never Assume Partial Work Is Correct

Validate it.

---

# 169. Uncommitted Work Recovery

Classify:

```text
Keep

Complete

Revert

Split
```

based on inspection.

---

# 170. Corrupted Task State

If tracker and repository disagree:

Repository reality wins.

Then repair the tracker.

---

# 171. Lost Context Recovery

If project context is unclear:

Do not guess.

Read:

```text
Vision

Roadmap

Master Protocol

Tracker

Decision Log

Relevant Code
```

---

# 172. Final Execution Architecture

The complete V2 implementation operating system is:

```text
                    ┌──────────────────────┐
                    │   V2 ARCHITECTURE    │
                    │      DOCUMENTS       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  REPOSITORY AUDIT    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ PRODUCTION BASELINE  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ TECHNICAL MIGRATION  │
                    │        PLAN          │
                    └──────────┬───────────┘
                               │
                               ▼
          ┌─────────────────────────────────────────┐
          │            MIGRATION TRACKER            │
          │                                         │
          │ Current Phase                           │
          │ Current Task                            │
          │ Completed Tasks                         │
          │ Blockers                                │
          │ Next Tasks                              │
          └───────────────────┬─────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │    BOUNDED TASK      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ INSPECT RELEVANT CODE│
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      IMPLEMENT       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       VALIDATE       │
                    └──────────┬───────────┘
                               │
                     ┌─────────┴─────────┐
                     │                   │
                   FAIL                PASS
                     │                   │
                     ▼                   ▼
              ┌─────────────┐    ┌─────────────┐
              │ FIX / BLOCK │    │ TASK REPORT │
              └──────┬──────┘    └──────┬──────┘
                     │                   │
                     └─────────┬─────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ UPDATE PROJECT STATE │
                    │                      │
                    │ Tracker              │
                    │ Decision Log         │
                    │ Issue Log            │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   LOGICAL COMMIT     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      NEXT TASK       │
                    └──────────────────────┘
```

---

# 173. Final Master Principles

The permanent execution principles are:

> **No AI agent should be the sole holder of project context.**

> **The repository must preserve implementation state.**

> **Architecture documents preserve intent.**

> **The migration tracker preserves progress.**

> **The decision log preserves reasoning.**

> **The issue log preserves deferred problems.**

> **Task reports preserve implementation history.**

> **Git preserves exact changes and recovery points.**

> **Every new agent session should be recoverable from repository state.**

> **Do not ask an AI agent to implement the entire V2 in one uncontrolled task.**

> **Use bounded autonomy rather than unlimited autonomy.**

> **Inspect before editing.**

> **Reuse before creating.**

> **Refactor before rewriting when practical.**

> **Do not change public URLs casually.**

> **Do not rewrite content during unrelated implementation work.**

> **Do not create parallel design systems.**

> **Do not silently expand task scope.**

> **Do not hide validation failures.**

> **Do not mark work validated without evidence.**

> **Do not allow discovered adjacent problems to derail every task.**

> **Record important problems and continue the approved scope.**

> **Stop at genuine decision boundaries.**

> **Human approval should be required for high-risk irreversible actions.**

> **AI should have meaningful autonomy inside clearly defined boundaries.**

> **Each coherent task should leave the repository in a known state.**

> **Each completed task should make the next task easier to understand.**

> **The process must survive context-window limits, agent changes, session interruptions, and long implementation timelines.**

The operating model is:

```text
HUMAN DIRECTION

+

PERSISTENT PROJECT STATE

+

BOUNDED AI AUTONOMY

+

AUTOMATED VALIDATION

+

GIT CHECKPOINTS

=

CONTROLLED LONG-RUNNING IMPLEMENTATION
```

The final Interview Explainer V2 execution principle is:

> **We do not solve AI context loss by hoping the AI remembers more. We solve it by designing a development system in which nothing important needs to exist only in the AI's memory.**

The complete V2 implementation should therefore proceed as:

```text
READ CURRENT STATE

↓

SELECT ONE APPROVED TASK

↓

INSPECT ACTUAL CODE

↓

IMPLEMENT WITHIN BOUNDARY

↓

VALIDATE

↓

WRITE STATE BACK TO REPOSITORY

↓

COMMIT CHECKPOINT

↓

CONTINUE
```

This is the permanent execution protocol for Interview Explainer V2.
