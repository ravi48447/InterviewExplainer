# PHASE 12 — JOB DISCOVERY, JOB TRACKING, APPLICATION WORKSPACE, COMPANY & ROLE INTELLIGENCE, JOB-TO-PREPARATION ORCHESTRATION & CAREER OPPORTUNITY PIPELINE

---

# Phase Objective

Build the canonical opportunity intelligence and application workflow layer for Interview Explainer.

The system must connect:

```text
CAREER TARGET
   ↓
JOB OPPORTUNITY
   ↓
JOB REQUIREMENTS
   ↓
CANDIDATE PROFILE
   ↓
MATCH + GAPS
   ↓
PREPARATION
   ↓
APPLICATION
   ↓
INTERVIEW STAGES
   ↓
TARGETED PRACTICE
   ↓
REAL INTERVIEW
   ↓
OUTCOME
   ↓
LEARNING
```

The system must not become:

* a generic job board,
* a mass job scraper,
* a spam application bot,
* an auto-apply engine without user control,
* a fake job-match percentage generator,
* a duplicate of LinkedIn or Indeed,
* an uncontrolled company-data scraper,
* a system that stores job descriptions without provenance,
* or a dashboard filled with hundreds of irrelevant job cards.

The central product principle is:

```text
THE JOB IS NOT JUST
AN EXTERNAL LINK.

IT IS A PREPARATION CONTEXT.
```

Every saved opportunity can become:

```text
A ROLE REQUIREMENT MAP
+
A RESUME MATCH
+
A GAP ANALYSIS
+
A PREPARATION PLAN
+
A MOCK INTERVIEW BLUEPRINT
+
AN APPLICATION WORKSPACE
```

---

# Core Product Model

```text
USER
   ↓
CAREER TARGET
   ↓
OPPORTUNITY
   ↓
COMPANY
   +
ROLE
   +
JOB DESCRIPTION
   ↓
REQUIREMENTS
   ↓
CANDIDATE EVIDENCE
   ↓
MATCH / GAP
   ↓
APPLICATION DECISION
   ↓
PREPARATION PLAN
   ↓
APPLICATION
   ↓
INTERVIEW PIPELINE
   ↓
REAL INTERVIEW
   ↓
OUTCOME
```

---

# Critical Architectural Boundary

Interview Explainer should separate four concepts:

```text
JOB SOURCE
      ↓
Where the opportunity came from

JOB OPPORTUNITY
      ↓
The actual role being considered

APPLICATION
      ↓
The user's application to that opportunity

INTERVIEW PROCESS
      ↓
The stages resulting from that application
```

These must not be collapsed into one giant `jobs` table.

---

# Workstream A — Existing Job Feature Audit

## P12-T001 — Inventory Existing Job Routes


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T002 — Inventory Existing Job Pages


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T003 — Inventory Existing Job Components


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T004 — Inventory Existing Job APIs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T005 — Inventory Existing Job Data Models


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T006 — Inventory Existing Job Search Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T007 — Inventory Existing Job Import Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T008 — Inventory Existing Saved Job Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T009 — Inventory Existing Application Tracking


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T010 — Inventory Existing Company Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T011 — Inventory Existing Job Matching


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T012 — Inventory Existing Job AI Prompts


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T013 — Inventory Existing External Integrations


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T014 — Inventory Existing Job Scrapers


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T015 — Inventory Existing Job Cron Jobs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T016 — Identify Duplicate Job Systems


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T017 — Identify Dead Job Code


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T018 — Identify Unsupported Data Sources


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T019 — Identify Stale Job Records


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T020 — Identify Compliance Risks


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T021 — Produce Current Job Architecture Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream B — Job Product Definition

## P12-T022 — Define Job Discovery Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T023 — Define Job Tracking Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T024 — Define Application Workspace Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T025 — Define Company Intelligence Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T026 — Define Role Intelligence Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T027 — Define Job Preparation Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T028 — Define Application Tracking Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T029 — Define External Job Source Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T030 — Define Automation Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T031 — Define User-Control Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream C — Career Target Model

## P12-T032 — Define Career Target Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T033 — Define Target Role


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T034 — Define Target Seniority


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T035 — Define Target Technologies


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T036 — Define Target Domains


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T037 — Define Target Companies


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T038 — Define Preferred Locations


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T039 — Define Work Mode Preference

Examples:

```text
onsite
hybrid
remote
flexible
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Examples: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T040 — Define Employment Type


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T041 — Define Experience Range


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T042 — Define Career Target Status


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T043 — Support Multiple Career Targets


**Execution:** Execute this task against the current repository in the context of Workstream C — Career Target Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T044 — Define Active Career Target


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream D — Opportunity Model

## P12-T045 — Define Opportunity ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T046 — Define Opportunity Ownership


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T047 — Define Company Reference


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T048 — Define Role Title


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T049 — Define Job Description


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T050 — Define Job Source


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T051 — Define Source URL


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T052 — Define External Job ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T053 — Define Location


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T054 — Define Work Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T055 — Define Employment Type


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T056 — Define Salary Information


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T057 — Define Published Date


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T058 — Define Imported Date


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T059 — Define Opportunity Status


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T060 — Define Expiration State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T061 — Define Archived State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream E — Opportunity Status

## P12-T062 — Define Discovered


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T063 — Define Saved


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T064 — Define Reviewing


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T065 — Define Preparing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T066 — Define Ready to Apply


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T067 — Define Applied


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T068 — Define Interviewing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T069 — Define Offer


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T070 — Define Rejected


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T071 — Define Withdrawn


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T072 — Define Closed


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T073 — Define Archived


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream F — Job Source Architecture

## P12-T074 — Define Job Source Provider Interface


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T075 — Define Manual Job Entry


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T076 — Define Pasted Job Description


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T077 — Define Job URL Import


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T078 — Define External API Source


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T079 — Define Partner Feed Source


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P12-T080 — Define User-Forwarded Opportunity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P12-T081 — Preserve Source Provenance


**Execution:** Execute this task against the current repository in the context of Workstream F — Job Source Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T082 — Never Pretend Imported Data Is First-Party Data


**Execution:** Execute this task against the current repository in the context of Workstream F — Job Source Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream G — Manual Job Capture

## P12-T083 — Build Add Job Flow


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T084 — Support Job Title Input


**Execution:** Execute this task against the current repository in the context of Workstream G — Manual Job Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T085 — Support Company Input


**Execution:** Execute this task against the current repository in the context of Workstream G — Manual Job Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T086 — Support Job Description Paste


**Execution:** Execute this task against the current repository in the context of Workstream G — Manual Job Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T087 — Support Source URL


**Execution:** Execute this task against the current repository in the context of Workstream G — Manual Job Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T088 — Support Location


**Execution:** Execute this task against the current repository in the context of Workstream G — Manual Job Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T089 — Support Notes


**Execution:** Execute this task against the current repository in the context of Workstream G — Manual Job Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T090 — Minimize Required Fields


**Execution:** Execute this task against the current repository in the context of Workstream G — Manual Job Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T091 — Allow Immediate Save


**Execution:** Execute this task against the current repository in the context of Workstream G — Manual Job Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream H — Job URL Import

## P12-T092 — Define URL Import Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T093 — Validate URL


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T094 — Apply SSRF Protection


**Execution:** Execute this task against the current repository in the context of Workstream H — Job URL Import, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T095 — Block Private Network Targets


**Execution:** Execute this task against the current repository in the context of Workstream H — Job URL Import, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T096 — Restrict Redirect Behaviour


**Execution:** Execute this task against the current repository in the context of Workstream H — Job URL Import, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T097 — Define Supported Source Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T098 — Extract Publicly Available Job Content


**Execution:** Execute this task against the current repository in the context of Workstream H — Job URL Import, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T099 — Preserve Original URL


**Execution:** Execute this task against the current repository in the context of Workstream H — Job URL Import, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T100 — Handle Import Failure Gracefully


**Execution:** Execute this task against the current repository in the context of Workstream H — Job URL Import, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T101 — Allow Manual Fallback


**Execution:** Execute this task against the current repository in the context of Workstream H — Job URL Import, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream I — Job Discovery Strategy

## P12-T102 — Define Discovery as an Optional Layer


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T103 — Avoid Making Discovery Required for Core Product


**Execution:** Execute this task against the current repository in the context of Workstream I — Job Discovery Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T104 — Define Career-Target-Based Discovery


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T105 — Define Role-Based Discovery


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T106 — Define Skill-Based Discovery


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T107 — Define Location-Based Discovery


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T108 — Define Company-Based Discovery


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T109 — Define Recency Filter


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T110 — Define User-Controlled Filters


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T111 — Avoid Infinite Job Feed Design


**Execution:** Execute this task against the current repository in the context of Workstream I — Job Discovery Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream J — Job Discovery Relevance

## P12-T112 — Define Discovery Relevance Signals


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T113 — Use Career Target


**Execution:** Execute this task against the current repository in the context of Workstream J — Job Discovery Relevance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T114 — Use Role Similarity


**Execution:** Execute this task against the current repository in the context of Workstream J — Job Discovery Relevance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T115 — Use Skill Alignment


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P12-T116 — Use Seniority Alignment


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P12-T117 — Use Location Preference


**Execution:** Execute this task against the current repository in the context of Workstream J — Job Discovery Relevance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T118 — Use Work Mode Preference


**Execution:** Execute this task against the current repository in the context of Workstream J — Job Discovery Relevance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T119 — Use User Feedback


**Execution:** Execute this task against the current repository in the context of Workstream J — Job Discovery Relevance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P12-T120 — Avoid Black-Box Relevance Scores


**Execution:** Execute this task against the current repository in the context of Workstream J — Job Discovery Relevance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream K — Job Deduplication

## P12-T121 — Define Duplicate Opportunity Detection


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T122 — Compare External Job IDs


**Execution:** Execute this task against the current repository in the context of Workstream K — Job Deduplication, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T123 — Compare Canonical Source URLs


**Execution:** Execute this task against the current repository in the context of Workstream K — Job Deduplication, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T124 — Compare Company + Role + Location


**Execution:** Execute this task against the current repository in the context of Workstream K — Job Deduplication, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T125 — Compare Job Description Fingerprints


**Execution:** Execute this task against the current repository in the context of Workstream K — Job Deduplication, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T126 — Handle Reposted Jobs


**Execution:** Execute this task against the current repository in the context of Workstream K — Job Deduplication, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T127 — Avoid Duplicate Saved Opportunities


**Execution:** Execute this task against the current repository in the context of Workstream K — Job Deduplication, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T128 — Preserve Source History


**Execution:** Execute this task against the current repository in the context of Workstream K — Job Deduplication, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream L — Job Freshness

## P12-T129 — Define Job Freshness Model


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T130 — Track Published Date Where Available


**Execution:** Execute this task against the current repository in the context of Workstream L — Job Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T131 — Track Last Verified Date


**Execution:** Execute this task against the current repository in the context of Workstream L — Job Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T132 — Detect Source Removal


**Execution:** Execute this task against the current repository in the context of Workstream L — Job Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T133 — Mark Potentially Expired Jobs


**Execution:** Execute this task against the current repository in the context of Workstream L — Job Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T134 — Avoid Silently Deleting Saved Opportunities


**Execution:** Execute this task against the current repository in the context of Workstream L — Job Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T135 — Preserve Preparation Context After Job Closure


**Execution:** Execute this task against the current repository in the context of Workstream L — Job Freshness, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream M — Company Entity

## P12-T136 — Define Canonical Company Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T137 — Define Company Name


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T138 — Define Company Slug


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T139 — Define Company Website


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T140 — Define Company Domain


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T141 — Define Company Aliases


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T142 — Define Company Description Source


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T143 — Define Company Data Provenance


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T144 — Avoid Duplicate Company Records


**Execution:** Execute this task against the current repository in the context of Workstream M — Company Entity, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream N — Company Intelligence Boundary

## P12-T145 — Define Company Intelligence Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T146 — Focus on Interview Preparation Relevance


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Intelligence Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T147 — Avoid Building Generic Company Profiles


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T148 — Define Public Company Information Sources


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T149 — Define User-Contributed Interview Context


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T150 — Separate Facts from User Reports


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Intelligence Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T151 — Timestamp Time-Sensitive Company Information


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Intelligence Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T152 — Preserve Source Provenance


**Execution:** Execute this task against the current repository in the context of Workstream N — Company Intelligence Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream O — Company Preparation Context

## P12-T153 — Define Company Interview Overview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T154 — Define Common Role Families


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T155 — Define Interview Stage Patterns


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T156 — Define Reported Interview Topics


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T157 — Define Preparation Recommendations


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T158 — Define Confidence and Recency


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T159 — Avoid Presenting Anecdotes as Guaranteed Process


**Execution:** Execute this task against the current repository in the context of Workstream O — Company Preparation Context, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream P — Role Intelligence

## P12-T160 — Define Canonical Role Entity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T161 — Define Role Family


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T162 — Define Role Level


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T163 — Define Core Skills


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T164 — Define Common Responsibilities


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T165 — Define Common Interview Areas


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T166 — Define Role Preparation Blueprint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T167 — Connect Role to Canonical Content


**Execution:** Execute this task against the current repository in the context of Workstream P — Role Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T168 — Connect Role to Mock Interview Blueprint


**Execution:** Execute this task against the current repository in the context of Workstream P — Role Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Q — Role Normalization

## P12-T169 — Normalize Role Titles


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P12-T170 — Handle Backend Engineer Variants


**Execution:** Execute this task against the current repository in the context of Workstream Q — Role Normalization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T171 — Handle Software Engineer Variants


**Execution:** Execute this task against the current repository in the context of Workstream Q — Role Normalization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T172 — Handle Data Analyst Variants


**Execution:** Execute this task against the current repository in the context of Workstream Q — Role Normalization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T173 — Handle DevOps Variants


**Execution:** Execute this task against the current repository in the context of Workstream Q — Role Normalization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T174 — Handle Consulting Role Variants


**Execution:** Execute this task against the current repository in the context of Workstream Q — Role Normalization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T175 — Preserve Original Job Title


**Execution:** Execute this task against the current repository in the context of Workstream Q — Role Normalization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T176 — Avoid Over-Normalization


**Execution:** Execute this task against the current repository in the context of Workstream Q — Role Normalization, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream R — Job Description Intelligence

## P12-T177 — Reuse Phase 11 Job Parser


**Execution:** Execute this task against the current repository in the context of Workstream R — Job Description Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T178 — Extract Required Skills


**Execution:** Execute this task against the current repository in the context of Workstream R — Job Description Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T179 — Extract Preferred Skills


**Execution:** Execute this task against the current repository in the context of Workstream R — Job Description Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T180 — Extract Responsibilities


**Execution:** Execute this task against the current repository in the context of Workstream R — Job Description Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T181 — Extract Experience Expectations


**Execution:** Execute this task against the current repository in the context of Workstream R — Job Description Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T182 — Extract Domain Expectations


**Execution:** Execute this task against the current repository in the context of Workstream R — Job Description Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T183 — Extract Behavioural Expectations


**Execution:** Execute this task against the current repository in the context of Workstream R — Job Description Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T184 — Preserve Requirement Evidence


**Execution:** Execute this task against the current repository in the context of Workstream R — Job Description Intelligence, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream S — Job-to-Candidate Match

## P12-T185 — Reuse Phase 11 Matching Engine


**Execution:** Execute this task against the current repository in the context of Workstream S — Job-to-Candidate Match, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T186 — Match Resume Evidence


**Execution:** Execute this task against the current repository in the context of Workstream S — Job-to-Candidate Match, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T187 — Match Candidate Profile Evidence


**Execution:** Execute this task against the current repository in the context of Workstream S — Job-to-Candidate Match, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T188 — Match Experience Evidence


**Execution:** Execute this task against the current repository in the context of Workstream S — Job-to-Candidate Match, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T189 — Match Project Evidence


**Execution:** Execute this task against the current repository in the context of Workstream S — Job-to-Candidate Match, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T190 — Identify Preparation Gaps


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T191 — Identify Evidence Gaps


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T192 — Identify Experience Gaps


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T193 — Preserve Match Explanation


**Execution:** Execute this task against the current repository in the context of Workstream S — Job-to-Candidate Match, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream T — Opportunity Evaluation

## P12-T194 — Define Opportunity Evaluation Model


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T195 — Evaluate Role Alignment


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P12-T196 — Evaluate Skill Alignment


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P12-T197 — Evaluate Experience Alignment


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P12-T198 — Evaluate Preparation Effort


**Execution:** Execute this task against the current repository in the context of Workstream T — Opportunity Evaluation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T199 — Evaluate Candidate Interest


**Execution:** Execute this task against the current repository in the context of Workstream T — Opportunity Evaluation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T200 — Evaluate Application Urgency


**Execution:** Execute this task against the current repository in the context of Workstream T — Opportunity Evaluation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T201 — Avoid Fake Hiring Probability


**Execution:** Execute this task against the current repository in the context of Workstream T — Opportunity Evaluation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T202 — Explain Evaluation Dimensions


**Execution:** Execute this task against the current repository in the context of Workstream T — Opportunity Evaluation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream U — Opportunity Priority

## P12-T203 — Define User Priority


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T204 — Define System-Suggested Priority


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T205 — Consider Job Freshness


**Execution:** Execute this task against the current repository in the context of Workstream U — Opportunity Priority, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T206 — Consider Role Alignment


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P12-T207 — Consider Preparation Readiness


**Execution:** Execute this task against the current repository in the context of Workstream U — Opportunity Priority, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T208 — Consider Application Deadline


**Execution:** Execute this task against the current repository in the context of Workstream U — Opportunity Priority, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T209 — Consider Interview Stage


**Execution:** Execute this task against the current repository in the context of Workstream U — Opportunity Priority, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T210 — Allow User Override


**Execution:** Execute this task against the current repository in the context of Workstream U — Opportunity Priority, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream V — Application Entity

## P12-T211 — Define Application ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T212 — Define User Ownership


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T213 — Define Opportunity Reference


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T214 — Define Resume Version Used


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T215 — Define Application Date


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T216 — Define Application Source


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T217 — Define Application Status


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T218 — Define Notes


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T219 — Define Last Activity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T220 — Define Next Action


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream W — Application Status Model

## P12-T221 — Define Preparing


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T222 — Define Applied


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T223 — Define Screening


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T224 — Define Assessment


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T225 — Define Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T226 — Define Final Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T227 — Define Offer


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T228 — Define Rejected


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T229 — Define Withdrawn


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T230 — Define No Response


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T231 — Define Closed


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream X — Application Timeline

## P12-T232 — Define Application Event


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T233 — Record Application Created


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T234 — Record Status Changes


**Execution:** Execute this task against the current repository in the context of Workstream X — Application Timeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T235 — Record Recruiter Contact


**Execution:** Execute this task against the current repository in the context of Workstream X — Application Timeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T236 — Record Assessment


**Execution:** Execute this task against the current repository in the context of Workstream X — Application Timeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T237 — Record Interview Stage


**Execution:** Execute this task against the current repository in the context of Workstream X — Application Timeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T238 — Record Offer


**Execution:** Execute this task against the current repository in the context of Workstream X — Application Timeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T239 — Record Rejection


**Execution:** Execute this task against the current repository in the context of Workstream X — Application Timeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T240 — Preserve Event History


**Execution:** Execute this task against the current repository in the context of Workstream X — Application Timeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Y — Application Workspace

## P12-T241 — Build Canonical Application Detail Page


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T242 — Show Opportunity Summary


**Execution:** Execute this task against the current repository in the context of Workstream Y — Application Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T243 — Show Current Application Stage


**Execution:** Execute this task against the current repository in the context of Workstream Y — Application Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T244 — Show Next Action


**Execution:** Execute this task against the current repository in the context of Workstream Y — Application Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T245 — Show Preparation Priorities


**Execution:** Execute this task against the current repository in the context of Workstream Y — Application Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T246 — Show Upcoming Interview Stage


**Execution:** Execute this task against the current repository in the context of Workstream Y — Application Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T247 — Show Notes


**Execution:** Execute this task against the current repository in the context of Workstream Y — Application Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T248 — Show Timeline


**Execution:** Execute this task against the current repository in the context of Workstream Y — Application Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T249 — Avoid Dashboard-Within-Dashboard UI


**Execution:** Execute this task against the current repository in the context of Workstream Y — Application Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Z — Application Notes

## P12-T250 — Define Private Application Notes


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T251 — Support User Notes


**Execution:** Execute this task against the current repository in the context of Workstream Z — Application Notes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T252 — Support Recruiter Notes


**Execution:** Execute this task against the current repository in the context of Workstream Z — Application Notes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T253 — Support Interview Notes


**Execution:** Execute this task against the current repository in the context of Workstream Z — Application Notes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T254 — Support Follow-Up Notes


**Execution:** Execute this task against the current repository in the context of Workstream Z — Application Notes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T255 — Preserve Note Timestamps


**Execution:** Execute this task against the current repository in the context of Workstream Z — Application Notes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T256 — Protect Notes from Public Exposure


**Execution:** Execute this task against the current repository in the context of Workstream Z — Application Notes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AA — Next Action Engine

## P12-T257 — Define Next Action


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T258 — Define User-Created Action


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T259 — Define System-Suggested Action


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T260 — Suggest Resume Review Before Application


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P12-T261 — Suggest Critical Preparation Before Interview


**Execution:** Execute this task against the current repository in the context of Workstream AA — Next Action Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T262 — Suggest Mock Interview Before Interview Date


**Execution:** Execute this task against the current repository in the context of Workstream AA — Next Action Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T263 — Suggest Follow-Up Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AA — Next Action Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T264 — Never Automatically Contact Employers


**Execution:** Execute this task against the current repository in the context of Workstream AA — Next Action Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AB — Interview Process Model

## P12-T265 — Define Interview Process


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T266 — Define Interview Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T267 — Define Stage Type

Examples:

```text
recruiter_screen
hiring_manager
technical_screen
coding
system_design
case_interview
behavioural
panel
final
other
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Examples: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T268 — Define Scheduled Date


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T269 — Define Stage Status


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T270 — Define Preparation Scope


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T271 — Define Outcome


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T272 — Define User Notes


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream AC — Interview Stage Preparation

## P12-T273 — Generate Stage-Specific Preparation


**Execution:** Execute this task against the current repository in the context of Workstream AC — Interview Stage Preparation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T274 — Prepare Recruiter Screen


**Execution:** Execute this task against the current repository in the context of Workstream AC — Interview Stage Preparation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T275 — Prepare Technical Screen


**Execution:** Execute this task against the current repository in the context of Workstream AC — Interview Stage Preparation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T276 — Prepare Coding Round


**Execution:** Execute this task against the current repository in the context of Workstream AC — Interview Stage Preparation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T277 — Prepare System Design Round


**Execution:** Execute this task against the current repository in the context of Workstream AC — Interview Stage Preparation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T278 — Prepare Behavioural Round


**Execution:** Execute this task against the current repository in the context of Workstream AC — Interview Stage Preparation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T279 — Prepare Case Interview


**Execution:** Execute this task against the current repository in the context of Workstream AC — Interview Stage Preparation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T280 — Prepare Final Round


**Execution:** Execute this task against the current repository in the context of Workstream AC — Interview Stage Preparation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AD — Job-to-Preparation Orchestration

## P12-T281 — Define Opportunity Preparation Context


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T282 — Combine Role Requirements


**Execution:** Execute this task against the current repository in the context of Workstream AD — Job-to-Preparation Orchestration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T283 — Combine Resume Claims


**Execution:** Execute this task against the current repository in the context of Workstream AD — Job-to-Preparation Orchestration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T284 — Combine Candidate Gaps


**Execution:** Execute this task against the current repository in the context of Workstream AD — Job-to-Preparation Orchestration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T285 — Combine Interview Stage


**Execution:** Execute this task against the current repository in the context of Workstream AD — Job-to-Preparation Orchestration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T286 — Combine Interview Date


**Execution:** Execute this task against the current repository in the context of Workstream AD — Job-to-Preparation Orchestration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T287 — Combine Existing Progress


**Execution:** Execute this task against the current repository in the context of Workstream AD — Job-to-Preparation Orchestration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T288 — Produce Prioritized Preparation


**Execution:** Execute this task against the current repository in the context of Workstream AD — Job-to-Preparation Orchestration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AE — Preparation Time Horizon

## P12-T289 — Define No Interview Date Plan


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T290 — Define Interview Within 30 Days Plan


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T291 — Define Interview Within 14 Days Plan


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T292 — Define Interview Within 7 Days Plan


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T293 — Define Interview Within 3 Days Plan


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T294 — Define Interview Tomorrow Plan


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T295 — Reduce Scope as Time Decreases


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P12-T296 — Prioritize High-Exposure Areas


**Execution:** Execute this task against the current repository in the context of Workstream AE — Preparation Time Horizon, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AF — Job-Specific Preparation Plan

## P12-T297 — Define Preparation Plan ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T298 — Associate Opportunity


**Execution:** Execute this task against the current repository in the context of Workstream AF — Job-Specific Preparation Plan, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T299 — Associate Application


**Execution:** Execute this task against the current repository in the context of Workstream AF — Job-Specific Preparation Plan, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T300 — Associate Interview Stage


**Execution:** Execute this task against the current repository in the context of Workstream AF — Job-Specific Preparation Plan, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T301 — Associate Resume Version


**Execution:** Execute this task against the current repository in the context of Workstream AF — Job-Specific Preparation Plan, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T302 — Define Preparation Items


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T303 — Define Priority


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T304 — Define Reason


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T305 — Define Completion State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream AG — Preparation Item Types

## P12-T306 — Define Learn Topic


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T307 — Define Revise Topic


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T308 — Define Practice Question


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T309 — Define Resume Defense


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T310 — Define Coding Practice


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T311 — Define Case Practice


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T312 — Define Behavioural Preparation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T313 — Define Mock Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream AH — Opportunity-Based Mock Interviews

## P12-T314 — Define Opportunity Mock Blueprint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T315 — Use Job Requirements


**Execution:** Execute this task against the current repository in the context of Workstream AH — Opportunity-Based Mock Interviews, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T316 — Use Candidate Resume


**Execution:** Execute this task against the current repository in the context of Workstream AH — Opportunity-Based Mock Interviews, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T317 — Use Identified Gaps


**Execution:** Execute this task against the current repository in the context of Workstream AH — Opportunity-Based Mock Interviews, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T318 — Use Interview Stage


**Execution:** Execute this task against the current repository in the context of Workstream AH — Opportunity-Based Mock Interviews, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T319 — Use Role Seniority


**Execution:** Execute this task against the current repository in the context of Workstream AH — Opportunity-Based Mock Interviews, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T320 — Use Previous Mock Performance


**Execution:** Execute this task against the current repository in the context of Workstream AH — Opportunity-Based Mock Interviews, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T321 — Connect to Phase 10 Engine


**Execution:** Execute this task against the current repository in the context of Workstream AH — Opportunity-Based Mock Interviews, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AI — Real Interview Preparation Workspace

## P12-T322 — Build Interview Preparation Page


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T323 — Show Interview Date


**Execution:** Execute this task against the current repository in the context of Workstream AI — Real Interview Preparation Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T324 — Show Interview Stage


**Execution:** Execute this task against the current repository in the context of Workstream AI — Real Interview Preparation Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T325 — Show Highest-Priority Topics


**Execution:** Execute this task against the current repository in the context of Workstream AI — Real Interview Preparation Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T326 — Show Resume Questions


**Execution:** Execute this task against the current repository in the context of Workstream AI — Real Interview Preparation Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T327 — Show Job-Specific Questions


**Execution:** Execute this task against the current repository in the context of Workstream AI — Real Interview Preparation Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T328 — Show Weakness Revision


**Execution:** Execute this task against the current repository in the context of Workstream AI — Real Interview Preparation Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T329 — Show Mock Interview Action


**Execution:** Execute this task against the current repository in the context of Workstream AI — Real Interview Preparation Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T330 — Keep UI Calm Under Time Pressure


**Execution:** Execute this task against the current repository in the context of Workstream AI — Real Interview Preparation Workspace, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AJ — Interview Countdown

## P12-T331 — Define Interview Countdown


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T332 — Show Days Remaining


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Interview Countdown, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T333 — Adapt Preparation Scope


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Interview Countdown, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T334 — Avoid Anxiety-Inducing UI


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Interview Countdown, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T335 — Avoid Excessive Red Alerts


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Interview Countdown, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T336 — Focus on Achievable Next Actions


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Interview Countdown, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AK — Real Interview Capture

## P12-T337 — Define Real Interview Record


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T338 — Associate Application


**Execution:** Execute this task against the current repository in the context of Workstream AK — Real Interview Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T339 — Associate Interview Stage


**Execution:** Execute this task against the current repository in the context of Workstream AK — Real Interview Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T340 — Record Date


**Execution:** Execute this task against the current repository in the context of Workstream AK — Real Interview Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T341 — Record User-Remembered Questions


**Execution:** Execute this task against the current repository in the context of Workstream AK — Real Interview Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T342 — Record Topics Asked


**Execution:** Execute this task against the current repository in the context of Workstream AK — Real Interview Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T343 — Record Difficulty


**Execution:** Execute this task against the current repository in the context of Workstream AK — Real Interview Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T344 — Record User Reflection


**Execution:** Execute this task against the current repository in the context of Workstream AK — Real Interview Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T345 — Record Outcome Later


**Execution:** Execute this task against the current repository in the context of Workstream AK — Real Interview Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AL — Post-Interview Reflection

## P12-T346 — Build Post-Interview Reflection Flow


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T347 — Ask What Was Asked


**Execution:** Execute this task against the current repository in the context of Workstream AL — Post-Interview Reflection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T348 — Ask What Went Well


**Execution:** Execute this task against the current repository in the context of Workstream AL — Post-Interview Reflection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T349 — Ask What Was Difficult


**Execution:** Execute this task against the current repository in the context of Workstream AL — Post-Interview Reflection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T350 — Ask What Was Unexpected


**Execution:** Execute this task against the current repository in the context of Workstream AL — Post-Interview Reflection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T351 — Ask What Needs Revision


**Execution:** Execute this task against the current repository in the context of Workstream AL — Post-Interview Reflection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T352 — Keep Reflection Short by Default


**Execution:** Execute this task against the current repository in the context of Workstream AL — Post-Interview Reflection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AM — Real Interview Learning Loop

## P12-T353 — Convert Interview Reflection into Weakness Signals


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P12-T354 — Map Asked Topics to Canonical Topics


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T355 — Map Remembered Questions to Canonical Questions


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T356 — Create Personal Revision Tasks


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T357 — Update Future Mock Scope


**Execution:** Execute this task against the current repository in the context of Workstream AM — Real Interview Learning Loop, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T358 — Update Personal Preparation Priority


**Execution:** Execute this task against the current repository in the context of Workstream AM — Real Interview Learning Loop, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T359 — Do Not Automatically Publish Interview Reports


**Execution:** Execute this task against the current repository in the context of Workstream AM — Real Interview Learning Loop, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AN — User-Contributed Interview Experience

## P12-T360 — Define Explicit Contribution Flow


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T361 — Require Separate User Consent


**Execution:** Execute this task against the current repository in the context of Workstream AN — User-Contributed Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T362 — Separate Private Reflection from Public Contribution


**Execution:** Execute this task against the current repository in the context of Workstream AN — User-Contributed Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T363 — Remove Personal Information


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P12-T364 — Remove Confidential Employer Information


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P12-T365 — Moderate Contributions


**Execution:** Execute this task against the current repository in the context of Workstream AN — User-Contributed Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T366 — Preserve Reported Nature


**Execution:** Execute this task against the current repository in the context of Workstream AN — User-Contributed Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T367 — Avoid Claiming Reported Questions Are Guaranteed


**Execution:** Execute this task against the current repository in the context of Workstream AN — User-Contributed Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AO — Application Dashboard

## P12-T368 — Build Focused Application Overview


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T369 — Show Active Applications


**Execution:** Execute this task against the current repository in the context of Workstream AO — Application Dashboard, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T370 — Show Upcoming Interviews


**Execution:** Execute this task against the current repository in the context of Workstream AO — Application Dashboard, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T371 — Show Next Actions


**Execution:** Execute this task against the current repository in the context of Workstream AO — Application Dashboard, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T372 — Show High-Priority Preparation


**Execution:** Execute this task against the current repository in the context of Workstream AO — Application Dashboard, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T373 — Show Recent Outcomes


**Execution:** Execute this task against the current repository in the context of Workstream AO — Application Dashboard, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T374 — Avoid Giant Analytics Dashboard


**Execution:** Execute this task against the current repository in the context of Workstream AO — Application Dashboard, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T375 — Avoid Excessive Cards


**Execution:** Execute this task against the current repository in the context of Workstream AO — Application Dashboard, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AP — Kanban View

## P12-T376 — Determine Whether Kanban Adds Real Value


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P12-T377 — Define Minimal Application Columns


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T378 — Support Drag-and-Drop Only if Accessible


**Execution:** Execute this task against the current repository in the context of Workstream AP — Kanban View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T379 — Preserve Non-Drag Status Controls


**Execution:** Execute this task against the current repository in the context of Workstream AP — Kanban View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T380 — Avoid Over-Complex CRM Behaviour


**Execution:** Execute this task against the current repository in the context of Workstream AP — Kanban View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AQ — List View

## P12-T381 — Build Canonical Application List


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T382 — Show Company


**Execution:** Execute this task against the current repository in the context of Workstream AQ — List View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T383 — Show Role


**Execution:** Execute this task against the current repository in the context of Workstream AQ — List View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T384 — Show Current Stage


**Execution:** Execute this task against the current repository in the context of Workstream AQ — List View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T385 — Show Next Action


**Execution:** Execute this task against the current repository in the context of Workstream AQ — List View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T386 — Show Upcoming Interview


**Execution:** Execute this task against the current repository in the context of Workstream AQ — List View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T387 — Support Filtering


**Execution:** Execute this task against the current repository in the context of Workstream AQ — List View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T388 — Support Sorting


**Execution:** Execute this task against the current repository in the context of Workstream AQ — List View, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AR — Job Detail UI

## P12-T389 — Build Canonical Opportunity Detail Page


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T390 — Show Role Summary


**Execution:** Execute this task against the current repository in the context of Workstream AR — Job Detail UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T391 — Show Company Context


**Execution:** Execute this task against the current repository in the context of Workstream AR — Job Detail UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T392 — Show Requirements


**Execution:** Execute this task against the current repository in the context of Workstream AR — Job Detail UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T393 — Show Candidate Evidence


**Execution:** Execute this task against the current repository in the context of Workstream AR — Job Detail UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T394 — Show Gaps


**Execution:** Execute this task against the current repository in the context of Workstream AR — Job Detail UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T395 — Show Preparation Priorities


**Execution:** Execute this task against the current repository in the context of Workstream AR — Job Detail UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T396 — Show Application Action


**Execution:** Execute this task against the current repository in the context of Workstream AR — Job Detail UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T397 — Avoid Dense Analytics Layout


**Execution:** Execute this task against the current repository in the context of Workstream AR — Job Detail UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AS — Root-Level Job UI Components

## P12-T398 — Build Opportunity Summary Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T399 — Build Requirement Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T400 — Build Match Evidence Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T401 — Build Application Stage Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T402 — Build Timeline Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T403 — Build Next Action Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T404 — Build Interview Countdown Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P12-T405 — Fix Shared Components Before Individual Pages


**Execution:** Execute this task against the current repository in the context of Workstream AS — Root-Level Job UI Components, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AT — Job UI Density

## P12-T406 — Limit Initial Visible Information


**Execution:** Execute this task against the current repository in the context of Workstream AT — Job UI Density, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T407 — Use Progressive Disclosure


**Execution:** Execute this task against the current repository in the context of Workstream AT — Job UI Density, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T408 — Avoid Showing Entire Job Description First


**Execution:** Execute this task against the current repository in the context of Workstream AT — Job UI Density, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T409 — Prioritize Decision-Relevant Information


**Execution:** Execute this task against the current repository in the context of Workstream AT — Job UI Density, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T410 — Maintain Comfortable Reading Width


**Execution:** Execute this task against the current repository in the context of Workstream AT — Job UI Density, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T411 — Use Calm Status Indicators


**Execution:** Execute this task against the current repository in the context of Workstream AT — Job UI Density, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T412 — Avoid Excessive Colour Coding


**Execution:** Execute this task against the current repository in the context of Workstream AT — Job UI Density, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T413 — Maintain Calm Light and Dark Modes


**Execution:** Execute this task against the current repository in the context of Workstream AT — Job UI Density, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AU — Backend Opportunity APIs

## P12-T414 — Define Create Opportunity Endpoint


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T415 — Define Import Opportunity Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T416 — Define Opportunity Detail Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T417 — Define Opportunity Update Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T418 — Define Opportunity Archive Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T419 — Define Opportunity List Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T420 — Define Opportunity Match Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T421 — Define Opportunity Preparation Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream AV — Backend Application APIs

## P12-T422 — Define Create Application Endpoint


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T423 — Define Application Detail Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T424 — Define Application Status Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T425 — Define Application Timeline Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T426 — Define Application Notes Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T427 — Define Next Action Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T428 — Define Interview Stage Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T429 — Define Interview Reflection Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream AW — API Contract Quality

## P12-T430 — Define Explicit Opportunity Schema


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T431 — Define Explicit Application Schema


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T432 — Define Explicit Interview Stage Schema


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T433 — Define Explicit Timeline Event Schema


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T434 — Define Explicit Preparation Context Schema


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T435 — Define Stable Error Codes


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T436 — Avoid Returning Raw Provider Payloads


**Execution:** Execute this task against the current repository in the context of Workstream AW — API Contract Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AX — External Job Provider Architecture

## P12-T437 — Define Provider Adapter Interface


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T438 — Isolate Provider-Specific Logic


**Execution:** Execute this task against the current repository in the context of Workstream AX — External Job Provider Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T439 — Normalize Provider Results


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P12-T440 — Preserve Provider Attribution


**Execution:** Execute this task against the current repository in the context of Workstream AX — External Job Provider Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T441 — Handle Provider Rate Limits


**Execution:** Execute this task against the current repository in the context of Workstream AX — External Job Provider Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T442 — Handle Provider Failure


**Execution:** Execute this task against the current repository in the context of Workstream AX — External Job Provider Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T443 — Handle Provider Removal


**Execution:** Execute this task against the current repository in the context of Workstream AX — External Job Provider Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T444 — Avoid Core Product Dependency on One Provider


**Execution:** Execute this task against the current repository in the context of Workstream AX — External Job Provider Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AY — Job Ingestion Pipeline

## P12-T445 — Define Ingestion Job


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T446 — Fetch Provider Data


**Execution:** Execute this task against the current repository in the context of Workstream AY — Job Ingestion Pipeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T447 — Validate Input


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P12-T448 — Normalize Opportunity


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P12-T449 — Deduplicate


**Execution:** Execute this task against the current repository in the context of Workstream AY — Job Ingestion Pipeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T450 — Classify Role


**Execution:** Execute this task against the current repository in the context of Workstream AY — Job Ingestion Pipeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T451 — Parse Requirements


**Execution:** Execute this task against the current repository in the context of Workstream AY — Job Ingestion Pipeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T452 — Store Provenance


**Execution:** Execute this task against the current repository in the context of Workstream AY — Job Ingestion Pipeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T453 — Publish Eligible Opportunity


**Execution:** Execute this task against the current repository in the context of Workstream AY — Job Ingestion Pipeline, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AZ — Background Jobs

## P12-T454 — Define Import Queue


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T455 — Define Parsing Queue


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T456 — Define Matching Queue


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T457 — Define Freshness Verification Queue


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T458 — Define Retry Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T459 — Define Idempotency


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T460 — Define Dead-Letter Handling


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream BA — Job Discovery Cost Controls

## P12-T461 — Measure Provider Cost


**Execution:** Execute this task against the current repository in the context of Workstream BA — Job Discovery Cost Controls, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T462 — Measure Import Cost


**Execution:** Execute this task against the current repository in the context of Workstream BA — Job Discovery Cost Controls, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T463 — Measure Parsing Cost


**Execution:** Execute this task against the current repository in the context of Workstream BA — Job Discovery Cost Controls, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T464 — Measure Matching Cost


**Execution:** Execute this task against the current repository in the context of Workstream BA — Job Discovery Cost Controls, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T465 — Cache Normalized Opportunities


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P0

---

## P12-T466 — Reuse Shared Job Parsing


**Execution:** Execute this task against the current repository in the context of Workstream BA — Job Discovery Cost Controls, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T467 — Avoid Re-Analysing Same Job Per User


**Execution:** Execute this task against the current repository in the context of Workstream BA — Job Discovery Cost Controls, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T468 — Separate Shared Job Analysis from Personal Match


**Execution:** Execute this task against the current repository in the context of Workstream BA — Job Discovery Cost Controls, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BB — Shared vs Personal Job Data

## P12-T469 — Define Shared Opportunity Data


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T470 — Define Personal Saved State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T471 — Define Personal Match Result


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T472 — Define Personal Preparation Plan


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T473 — Define Personal Application Data


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T474 — Avoid Duplicating Full Job Record Per User


**Execution:** Execute this task against the current repository in the context of Workstream BB — Shared vs Personal Job Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T475 — Protect Personal State


**Execution:** Execute this task against the current repository in the context of Workstream BB — Shared vs Personal Job Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BC — Job Data Provenance

## P12-T476 — Record Source


**Execution:** Execute this task against the current repository in the context of Workstream BC — Job Data Provenance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T477 — Record Source URL


**Execution:** Execute this task against the current repository in the context of Workstream BC — Job Data Provenance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T478 — Record Imported Timestamp


**Execution:** Execute this task against the current repository in the context of Workstream BC — Job Data Provenance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T479 — Record Last Verified Timestamp


**Execution:** Execute this task against the current repository in the context of Workstream BC — Job Data Provenance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T480 — Record Parser Version


**Execution:** Execute this task against the current repository in the context of Workstream BC — Job Data Provenance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T481 — Record Source-Specific Identifier


**Execution:** Execute this task against the current repository in the context of Workstream BC — Job Data Provenance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T482 — Preserve Original Job Description Snapshot Where Allowed


**Execution:** Execute this task against the current repository in the context of Workstream BC — Job Data Provenance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BD — Job Data Compliance

## P12-T483 — Review Source Terms Before Integration


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T484 — Respect Robots and Access Restrictions Where Applicable


**Execution:** Execute this task against the current repository in the context of Workstream BD — Job Data Compliance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T485 — Avoid Circumventing Authentication


**Execution:** Execute this task against the current repository in the context of Workstream BD — Job Data Compliance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T486 — Avoid Circumventing Anti-Bot Controls


**Execution:** Execute this task against the current repository in the context of Workstream BD — Job Data Compliance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T487 — Avoid Unauthorized Mass Scraping


**Execution:** Execute this task against the current repository in the context of Workstream BD — Job Data Compliance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T488 — Define Content Retention by Source


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T489 — Define Attribution Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T490 — Document Provider Compliance Decisions


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream BE — Auto-Apply Boundary

## P12-T491 — Explicitly Exclude Uncontrolled Auto-Apply from V2 Core


**Execution:** Execute this task against the current repository in the context of Workstream BE — Auto-Apply Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T492 — Do Not Submit Applications Without Explicit User Action


**Execution:** Execute this task against the current repository in the context of Workstream BE — Auto-Apply Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T493 — Do Not Fabricate Application Answers


**Execution:** Execute this task against the current repository in the context of Workstream BE — Auto-Apply Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T494 — Do Not Misrepresent Candidate Experience


**Execution:** Execute this task against the current repository in the context of Workstream BE — Auto-Apply Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T495 — Do Not Bypass Employer Controls


**Execution:** Execute this task against the current repository in the context of Workstream BE — Auto-Apply Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T496 — Allow Future Assisted Application Architecture Separately


**Execution:** Execute this task against the current repository in the context of Workstream BE — Auto-Apply Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

# Workstream BF — Job Alerts Foundation

## P12-T497 — Define Saved Search


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T498 — Define Alert Criteria


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T499 — Define Alert Frequency


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T500 — Deduplicate Alerted Opportunities


**Execution:** Execute this task against the current repository in the context of Workstream BF — Job Alerts Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T501 — Respect User Notification Preferences


**Execution:** Execute this task against the current repository in the context of Workstream BF — Job Alerts Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T502 — Avoid Excessive Notifications


**Execution:** Execute this task against the current repository in the context of Workstream BF — Job Alerts Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T503 — Allow Alert Pause


**Execution:** Execute this task against the current repository in the context of Workstream BF — Job Alerts Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream BG — Deadline and Interview Reminders

## P12-T504 — Define Application Deadline Reminder


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T505 — Define Interview Reminder


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T506 — Define Preparation Reminder


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T507 — Define Follow-Up Reminder


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T508 — Respect User Timezone


**Execution:** Execute this task against the current repository in the context of Workstream BG — Deadline and Interview Reminders, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T509 — Prevent Duplicate Reminders


**Execution:** Execute this task against the current repository in the context of Workstream BG — Deadline and Interview Reminders, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T510 — Allow Reminder Cancellation


**Execution:** Execute this task against the current repository in the context of Workstream BG — Deadline and Interview Reminders, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BH — Calendar Integration Boundary

## P12-T511 — Define Calendar Integration as Optional


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T512 — Require Explicit User Authorization


**Execution:** Execute this task against the current repository in the context of Workstream BH — Calendar Integration Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T513 — Create Interview Events Only with User Action


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P12-T514 — Avoid Broad Calendar Access Where Unnecessary


**Execution:** Execute this task against the current repository in the context of Workstream BH — Calendar Integration Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T515 — Preserve Interview Timezone


**Execution:** Execute this task against the current repository in the context of Workstream BH — Calendar Integration Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T516 — Handle Rescheduled Interviews


**Execution:** Execute this task against the current repository in the context of Workstream BH — Calendar Integration Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream BI — Email Integration Boundary

## P12-T517 — Define Email Integration as Optional


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P12-T518 — Require Explicit Authorization


**Execution:** Execute this task against the current repository in the context of Workstream BI — Email Integration Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T519 — Minimize Email Permissions


**Execution:** Execute this task against the current repository in the context of Workstream BI — Email Integration Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T520 — Detect Potential Interview Messages Carefully


**Execution:** Execute this task against the current repository in the context of Workstream BI — Email Integration Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P12-T521 — Require User Confirmation Before Creating Application Events


**Execution:** Execute this task against the current repository in the context of Workstream BI — Email Integration Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T522 — Avoid Storing Entire Mailbox Content


**Execution:** Execute this task against the current repository in the context of Workstream BI — Email Integration Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BJ — Privacy

## P12-T523 — Define Application Data Privacy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T524 — Define Interview Note Privacy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T525 — Define Recruiter Contact Data Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T526 — Define Job Target Retention


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T527 — Define Application History Retention


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T528 — Allow User Deletion


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Privacy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T529 — Prevent Private Application Data from Public Indexing


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Privacy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T530 — Prevent Private Notes from Analytics


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Privacy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BK — Security

## P12-T531 — Enforce Opportunity Ownership for Personal Records


**Execution:** Execute this task against the current repository in the context of Workstream BK — Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T532 — Enforce Application Ownership


**Execution:** Execute this task against the current repository in the context of Workstream BK — Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T533 — Enforce Interview Record Ownership


**Execution:** Execute this task against the current repository in the context of Workstream BK — Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T534 — Enforce Note Ownership


**Execution:** Execute this task against the current repository in the context of Workstream BK — Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T535 — Prevent IDOR


**Execution:** Execute this task against the current repository in the context of Workstream BK — Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T536 — Protect Job URL Import from SSRF


**Execution:** Execute this task against the current repository in the context of Workstream BK — Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T537 — Rate Limit Import


**Execution:** Execute this task against the current repository in the context of Workstream BK — Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T538 — Rate Limit Matching


**Execution:** Execute this task against the current repository in the context of Workstream BK — Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T539 — Validate External Content as Untrusted Input


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream BL — Prompt Injection Protection

## P12-T540 — Treat Job Description as Untrusted Data


**Execution:** Execute this task against the current repository in the context of Workstream BL — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T541 — Treat Imported Web Content as Untrusted Data


**Execution:** Execute this task against the current repository in the context of Workstream BL — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T542 — Delimit External Content


**Execution:** Execute this task against the current repository in the context of Workstream BL — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T543 — Prevent Job Text from Overriding System Instructions


**Execution:** Execute this task against the current repository in the context of Workstream BL — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T544 — Validate Structured AI Output


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T545 — Prevent Tool Execution Instructions from Imported Content


**Execution:** Execute this task against the current repository in the context of Workstream BL — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BM — Public Job SEO Strategy

## P12-T546 — Decide Whether Public Job Pages Belong in V2


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T547 — Avoid Indexing User-Saved Jobs


**Execution:** Execute this task against the current repository in the context of Workstream BM — Public Job SEO Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T548 — Avoid Indexing Personal Match Results


**Execution:** Execute this task against the current repository in the context of Workstream BM — Public Job SEO Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T549 — Avoid Indexing Application Pages


**Execution:** Execute this task against the current repository in the context of Workstream BM — Public Job SEO Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T550 — Avoid Indexing Private Interview Notes


**Execution:** Execute this task against the current repository in the context of Workstream BM — Public Job SEO Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T551 — Separate Public Career Content from Personal Workspace


**Execution:** Execute this task against the current repository in the context of Workstream BM — Public Job SEO Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BN — Public Role SEO

## P12-T552 — Build Canonical Role Preparation Pages

Examples:

```text
/backend-developer-interview
/java-developer-interview
/data-analyst-interview
/management-consultant-interview
```

**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Apply this specifically to: Examples: Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P12-T553 — Define Unique Search Intent


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T554 — Connect Role Pages to Canonical Questions


**Execution:** Execute this task against the current repository in the context of Workstream BN — Public Role SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T555 — Connect Role Pages to Preparation Paths


**Execution:** Execute this task against the current repository in the context of Workstream BN — Public Role SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T556 — Avoid Thin Programmatic Role Pages


**Execution:** Execute this task against the current repository in the context of Workstream BN — Public Role SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T557 — Define Canonical Metadata


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream BO — Public Company Interview SEO

## P12-T558 — Evaluate Company Interview Page Strategy


**Execution:** Execute this task against the current repository in the context of Workstream BO — Public Company Interview SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T559 — Require Sufficient Unique Evidence


**Execution:** Execute this task against the current repository in the context of Workstream BO — Public Company Interview SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T560 — Avoid Creating Thousands of Empty Company Pages


**Execution:** Execute this task against the current repository in the context of Workstream BO — Public Company Interview SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T561 — Separate Reported Experiences from Verified Facts


**Execution:** Execute this task against the current repository in the context of Workstream BO — Public Company Interview SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T562 — Timestamp Time-Sensitive Interview Information


**Execution:** Execute this task against the current repository in the context of Workstream BO — Public Company Interview SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T563 — Use Canonical URLs


**Execution:** Execute this task against the current repository in the context of Workstream BO — Public Company Interview SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T564 — Prevent Duplicate Company Slugs


**Execution:** Execute this task against the current repository in the context of Workstream BO — Public Company Interview SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BP — Structured Data

## P12-T565 — Evaluate JobPosting Structured Data Only for Eligible First-Party Pages


**Execution:** Execute this task against the current repository in the context of Workstream BP — Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T566 — Do Not Add JobPosting Schema to Personal Saved Jobs


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T567 — Do Not Misrepresent Third-Party Job Ownership


**Execution:** Execute this task against the current repository in the context of Workstream BP — Structured Data, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T568 — Validate Structured Data Eligibility


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T569 — Remove Invalid Job Schema


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream BQ — Sitemap Architecture

## P12-T570 — Exclude Personal Job Routes


**Execution:** Execute this task against the current repository in the context of Workstream BQ — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T571 — Exclude Application Routes


**Execution:** Execute this task against the current repository in the context of Workstream BQ — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T572 — Exclude Interview Workspace Routes


**Execution:** Execute this task against the current repository in the context of Workstream BQ — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T573 — Include Only Canonical Public Role Pages


**Execution:** Execute this task against the current repository in the context of Workstream BQ — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T574 — Include Eligible Public Company Pages Only


**Execution:** Execute this task against the current repository in the context of Workstream BQ — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T575 — Prevent Parameterized Job Search Pages from Indexing


**Execution:** Execute this task against the current repository in the context of Workstream BQ — Sitemap Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BR — Dashboard Integration

## P12-T576 — Show Active Career Target


**Execution:** Execute this task against the current repository in the context of Workstream BR — Dashboard Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T577 — Show Upcoming Interview


**Execution:** Execute this task against the current repository in the context of Workstream BR — Dashboard Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T578 — Show Most Important Application Action


**Execution:** Execute this task against the current repository in the context of Workstream BR — Dashboard Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T579 — Show Highest-Priority Preparation Action


**Execution:** Execute this task against the current repository in the context of Workstream BR — Dashboard Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T580 — Show Limited Active Opportunities


**Execution:** Execute this task against the current repository in the context of Workstream BR — Dashboard Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T581 — Avoid Showing Entire Application CRM on Dashboard


**Execution:** Execute this task against the current repository in the context of Workstream BR — Dashboard Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BS — Daily Preparation Integration

## P12-T582 — Prioritize Upcoming Interview Preparation


**Execution:** Execute this task against the current repository in the context of Workstream BS — Daily Preparation Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T583 — Prioritize High-Exposure Job Topics


**Execution:** Execute this task against the current repository in the context of Workstream BS — Daily Preparation Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T584 — Include Resume Defense Questions


**Execution:** Execute this task against the current repository in the context of Workstream BS — Daily Preparation Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T585 — Include Weakness Revision


**Execution:** Execute this task against the current repository in the context of Workstream BS — Daily Preparation Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T586 — Respect Existing Daily Workload


**Execution:** Execute this task against the current repository in the context of Workstream BS — Daily Preparation Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T587 — Avoid Rebuilding Daily Plan on Every Application Change


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream BT — Notification Architecture

## P12-T588 — Define Notification Types


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T589 — Define In-App Notification


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T590 — Define Email Notification Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T591 — Define Push Notification Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P12-T592 — Define Notification Preference Model


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T593 — Define Quiet Hours


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P12-T594 — Avoid Notification Spam


**Execution:** Execute this task against the current repository in the context of Workstream BT — Notification Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BU — Analytics

## P12-T595 — Track Opportunity Saved


**Execution:** Execute this task against the current repository in the context of Workstream BU — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T596 — Track Opportunity Reviewed


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P12-T597 — Track Match Viewed


**Execution:** Execute this task against the current repository in the context of Workstream BU — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T598 — Track Preparation Started


**Execution:** Execute this task against the current repository in the context of Workstream BU — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T599 — Track Application Created


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P12-T600 — Track Application Stage Changed


**Execution:** Execute this task against the current repository in the context of Workstream BU — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T601 — Track Interview Added


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P12-T602 — Track Mock Started from Application


**Execution:** Execute this task against the current repository in the context of Workstream BU — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T603 — Track Interview Reflection Completed


**Execution:** Execute this task against the current repository in the context of Workstream BU — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T604 — Protect Private Job and Interview Content


**Execution:** Execute this task against the current repository in the context of Workstream BU — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BV — Product Funnel Analytics

## P12-T605 — Measure Job Saved to Match Viewed


**Execution:** Execute this task against the current repository in the context of Workstream BV — Product Funnel Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T606 — Measure Match Viewed to Preparation Started


**Execution:** Execute this task against the current repository in the context of Workstream BV — Product Funnel Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T607 — Measure Preparation to Application


**Execution:** Execute this task against the current repository in the context of Workstream BV — Product Funnel Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T608 — Measure Application to Interview


**Execution:** Execute this task against the current repository in the context of Workstream BV — Product Funnel Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T609 — Measure Interview Preparation Usage


**Execution:** Execute this task against the current repository in the context of Workstream BV — Product Funnel Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T610 — Measure Mock Usage Before Real Interviews


**Execution:** Execute this task against the current repository in the context of Workstream BV — Product Funnel Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T611 — Avoid Interpreting Correlation as Hiring Causation


**Execution:** Execute this task against the current repository in the context of Workstream BV — Product Funnel Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BW — Outcome Model

## P12-T612 — Define Application Outcome


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T613 — Define Interview Outcome


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T614 — Define Offer Outcome


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T615 — Define User-Reported Outcome


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T616 — Preserve Outcome Timestamp


**Execution:** Execute this task against the current repository in the context of Workstream BW — Outcome Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T617 — Avoid Claiming Platform Caused Outcome


**Execution:** Execute this task against the current repository in the context of Workstream BW — Outcome Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BX — Outcome Learning

## P12-T618 — Use Outcomes for Personal Reflection


**Execution:** Execute this task against the current repository in the context of Workstream BX — Outcome Learning, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T619 — Compare Preparation Areas with Interview Experience


**Execution:** Execute this task against the current repository in the context of Workstream BX — Outcome Learning, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T620 — Identify Repeated Personal Weaknesses


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P12-T621 — Improve Future Personal Preparation Priority


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P1

---

## P12-T622 — Require Sufficient Evidence Before Aggregate Product Learning


**Execution:** Execute this task against the current repository in the context of Workstream BX — Outcome Learning, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T623 — Protect User Privacy in Aggregation


**Execution:** Execute this task against the current repository in the context of Workstream BX — Outcome Learning, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BY — Mobile Experience

## P12-T624 — Build Mobile Opportunity Capture


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T625 — Make Job URL Save Easy on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream BY — Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T626 — Build Mobile Application List


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T627 — Build Mobile Interview Preparation View


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T628 — Avoid Wide Match Tables


**Execution:** Execute this task against the current repository in the context of Workstream BY — Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T629 — Use Stacked Requirement Evidence


**Execution:** Execute this task against the current repository in the context of Workstream BY — Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T630 — Keep Next Action Reachable


**Execution:** Execute this task against the current repository in the context of Workstream BY — Mobile Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BZ — Accessibility

## P12-T631 — Use Semantic Application Status


**Execution:** Execute this task against the current repository in the context of Workstream BZ — Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T632 — Avoid Colour-Only Status Communication


**Execution:** Execute this task against the current repository in the context of Workstream BZ — Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T633 — Make Timeline Accessible


**Execution:** Execute this task against the current repository in the context of Workstream BZ — Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T634 — Make Kanban Optional


**Execution:** Execute this task against the current repository in the context of Workstream BZ — Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T635 — Provide Keyboard Status Controls


**Execution:** Execute this task against the current repository in the context of Workstream BZ — Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T636 — Announce Import Processing States


**Execution:** Execute this task against the current repository in the context of Workstream BZ — Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T637 — Make Interview Countdown Screen-Reader Friendly


**Execution:** Execute this task against the current repository in the context of Workstream BZ — Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream CA — Performance

## P12-T638 — Define Job List Performance Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P12-T639 — Paginate Opportunity Lists


**Execution:** Execute this task against the current repository in the context of Workstream CA — Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T640 — Paginate Application History


**Execution:** Execute this task against the current repository in the context of Workstream CA — Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T641 — Avoid Recomputing Shared Job Analysis


**Execution:** Execute this task against the current repository in the context of Workstream CA — Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T642 — Cache Stable Company Data


**Execution:** Execute this task against the current repository in the context of Workstream CA — Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T643 — Load Heavy Match Analysis on Demand


**Execution:** Execute this task against the current repository in the context of Workstream CA — Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T644 — Process Imports Asynchronously


**Execution:** Execute this task against the current repository in the context of Workstream CA — Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream CB — Observability

## P12-T645 — Log Opportunity Import Lifecycle


**Execution:** Execute this task against the current repository in the context of Workstream CB — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T646 — Log Parsing Failure


**Execution:** Execute this task against the current repository in the context of Workstream CB — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T647 — Log Deduplication Decisions


**Execution:** Execute this task against the current repository in the context of Workstream CB — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T648 — Log Matching Failure


**Execution:** Execute this task against the current repository in the context of Workstream CB — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T649 — Log Preparation Generation Failure


**Execution:** Execute this task against the current repository in the context of Workstream CB — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T650 — Track Provider Reliability


**Execution:** Execute this task against the current repository in the context of Workstream CB — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T651 — Track Import Latency


**Execution:** Execute this task against the current repository in the context of Workstream CB — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T652 — Protect Personal Data in Logs


**Execution:** Execute this task against the current repository in the context of Workstream CB — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream CC — Failure Handling

## P12-T653 — Handle Invalid Job URL


**Execution:** Execute this task against the current repository in the context of Workstream CC — Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T654 — Handle Unsupported Job Source


**Execution:** Execute this task against the current repository in the context of Workstream CC — Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T655 — Handle Removed Job


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P12-T656 — Handle Incomplete Job Description


**Execution:** Execute this task against the current repository in the context of Workstream CC — Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T657 — Handle Parser Failure


**Execution:** Execute this task against the current repository in the context of Workstream CC — Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T658 — Handle Match Failure


**Execution:** Execute this task against the current repository in the context of Workstream CC — Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T659 — Preserve Saved Opportunity on Recoverable Failure


**Execution:** Execute this task against the current repository in the context of Workstream CC — Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T660 — Allow Manual Correction


**Execution:** Execute this task against the current repository in the context of Workstream CC — Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream CD — Job Intelligence Reliability

## P12-T661 — Build Job Parsing Benchmark Dataset


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T662 — Include Backend Roles


**Execution:** Execute this task against the current repository in the context of Workstream CD — Job Intelligence Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T663 — Include Frontend Roles


**Execution:** Execute this task against the current repository in the context of Workstream CD — Job Intelligence Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T664 — Include Data Roles


**Execution:** Execute this task against the current repository in the context of Workstream CD — Job Intelligence Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T665 — Include DevOps Roles


**Execution:** Execute this task against the current repository in the context of Workstream CD — Job Intelligence Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T666 — Include Consulting Roles


**Execution:** Execute this task against the current repository in the context of Workstream CD — Job Intelligence Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T667 — Include Ambiguous Job Descriptions


**Execution:** Execute this task against the current repository in the context of Workstream CD — Job Intelligence Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T668 — Include Poorly Structured Job Descriptions


**Execution:** Execute this task against the current repository in the context of Workstream CD — Job Intelligence Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream CE — Job Parsing Benchmarking

## P12-T669 — Benchmark Role Extraction


**Execution:** Execute this task against the current repository in the context of Workstream CE — Job Parsing Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T670 — Benchmark Skill Extraction


**Execution:** Execute this task against the current repository in the context of Workstream CE — Job Parsing Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T671 — Benchmark Required vs Preferred Classification


**Execution:** Execute this task against the current repository in the context of Workstream CE — Job Parsing Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T672 — Benchmark Experience Extraction


**Execution:** Execute this task against the current repository in the context of Workstream CE — Job Parsing Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T673 — Benchmark Responsibility Extraction


**Execution:** Execute this task against the current repository in the context of Workstream CE — Job Parsing Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T674 — Measure False Requirement Extraction


**Execution:** Execute this task against the current repository in the context of Workstream CE — Job Parsing Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T675 — Measure Missed Critical Requirements


**Execution:** Execute this task against the current repository in the context of Workstream CE — Job Parsing Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream CF — Opportunity Recommendation Reliability

## P12-T676 — Benchmark Role Relevance


**Execution:** Execute this task against the current repository in the context of Workstream CF — Opportunity Recommendation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T677 — Benchmark Seniority Relevance


**Execution:** Execute this task against the current repository in the context of Workstream CF — Opportunity Recommendation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T678 — Benchmark Skill Relevance


**Execution:** Execute this task against the current repository in the context of Workstream CF — Opportunity Recommendation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T679 — Measure Irrelevant Opportunity Rate


**Execution:** Execute this task against the current repository in the context of Workstream CF — Opportunity Recommendation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T680 — Measure Duplicate Opportunity Rate


**Execution:** Execute this task against the current repository in the context of Workstream CF — Opportunity Recommendation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P12-T681 — Allow User Feedback on Relevance


**Execution:** Execute this task against the current repository in the context of Workstream CF — Opportunity Recommendation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream CG — Application Acceptance Scenarios

## P12-T682 — User Saves Job Manually


**Execution:** Execute this task against the current repository in the context of Workstream CG — Application Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T683 — User Imports Job from URL


**Execution:** Execute this task against the current repository in the context of Workstream CG — Application Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T684 — Job Requirements Are Parsed


**Execution:** Execute this task against the current repository in the context of Workstream CG — Application Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T685 — Resume Is Matched


**Execution:** Execute this task against the current repository in the context of Workstream CG — Application Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T686 — Gaps Are Classified


**Execution:** Execute this task against the current repository in the context of Workstream CG — Application Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T687 — Preparation Plan Is Created


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T688 — User Marks Job as Applied


**Execution:** Execute this task against the current repository in the context of Workstream CG — Application Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T689 — User Adds Interview Stage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P12-T690 — Interview Preparation Is Generated


**Execution:** Execute this task against the current repository in the context of Workstream CG — Application Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T691 — User Records Interview Reflection


**Execution:** Execute this task against the current repository in the context of Workstream CG — Application Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream CH — Security Acceptance Scenarios

## P12-T692 — User Cannot Access Another User’s Application


**Execution:** Execute this task against the current repository in the context of Workstream CH — Security Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T693 — User Cannot Access Another User’s Notes


**Execution:** Execute this task against the current repository in the context of Workstream CH — Security Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T694 — User Cannot Access Another User’s Interview Records


**Execution:** Execute this task against the current repository in the context of Workstream CH — Security Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T695 — Job URL Import Cannot Reach Private Network


**Execution:** Execute this task against the current repository in the context of Workstream CH — Security Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T696 — Imported Job Text Cannot Override AI Instructions


**Execution:** Execute this task against the current repository in the context of Workstream CH — Security Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T697 — Private Application Pages Are Not Indexed


**Execution:** Execute this task against the current repository in the context of Workstream CH — Security Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream CI — Legacy Job Migration

## P12-T698 — Inventory Existing Job Records


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T699 — Inventory Existing Saved Jobs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T700 — Inventory Existing Applications


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T701 — Map Valid Job Records to Opportunity Model


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T702 — Map Valid User State


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T703 — Map Existing Match Results


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P12-T704 — Preserve Source Provenance Where Available


**Execution:** Execute this task against the current repository in the context of Workstream CI — Legacy Job Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T705 — Document Unmigratable Records


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream CJ — Legacy Cleanup

## P12-T706 — Remove Duplicate Job Models


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P12-T707 — Remove Duplicate Job Import Flows


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P12-T708 — Remove Unsupported Scrapers


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P12-T709 — Remove Dead Provider Integrations


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P12-T710 — Remove Duplicate Matching Logic


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P12-T711 — Remove Client-Side Job Business Logic


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P12-T712 — Remove Invalid Public Job Routes


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream CK — Phase Completion

## P12-T713 — Freeze Career Target Contract


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T714 — Freeze Opportunity Contract


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T715 — Freeze Job Source Contract


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T716 — Freeze Company Contract


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T717 — Freeze Role Contract


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T718 — Freeze Application Contract


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T719 — Freeze Application Status Model


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T720 — Freeze Interview Process Contract


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T721 — Freeze Interview Stage Contract


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T722 — Freeze Opportunity Preparation Context


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T723 — Freeze Job-to-Preparation Orchestration


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T724 — Freeze Job Provider Architecture


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T725 — Freeze Job Data Provenance Model


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T726 — Freeze Job Privacy Model


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T727 — Freeze Job Security Model


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T728 — Publish Opportunity Lifecycle Architecture


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T729 — Publish Application Lifecycle Architecture


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T730 — Publish Job-to-Interview Preparation Flow


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T731 — Publish Real Interview Learning Loop


**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P12-T732 — Produce Phase 12 Completion Report

Document:

* current job-system audit,
* career target model,
* opportunity architecture,
* job source architecture,
* manual capture,
* URL import,
* discovery boundary,
* deduplication,
* freshness,
* company model,
* role model,
* job parsing,
* candidate matching,
* opportunity evaluation,
* application tracking,
* interview stages,
* job-specific preparation,
* interview countdown,
* real interview reflection,
* learning loop,
* provider architecture,
* compliance,
* security,
* privacy,
* SEO boundaries,
* performance,
* reliability,
* migration,
* legacy cleanup.

**Execution:** Execute this task against the current repository in the context of Workstream CK — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document: current job-system audit, career target model, opportunity architecture, job source architecture, manual capture, URL import, discovery boundary, deduplication, freshness, company model, role model, job parsing, candidate matching, opportunity evaluation, application tracking, interview stages, job-specific preparation, interview countdown, real interview reflection, learning loop, provider architecture, co Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Phase 12 Exit Criteria

Phase 12 is complete when Interview Explainer has:

* a canonical career target model,
* a canonical opportunity model,
* manual job capture,
* safe job URL import,
* optional job discovery architecture,
* source provenance,
* job deduplication,
* freshness tracking,
* company normalization,
* role normalization,
* job description parsing,
* resume-to-job matching,
* opportunity evaluation,
* application tracking,
* application timeline,
* next actions,
* interview stage tracking,
* stage-specific preparation,
* interview countdown,
* job-specific preparation plans,
* opportunity-based mock interviews,
* real interview reflection,
* personal post-interview learning,
* privacy protection,
* security controls,
* external provider abstraction,
* job data compliance,
* mobile support,
* accessible workflows,
* migration of valid legacy job data,
* removal of obsolete job systems.

---

# Phase 12 Core Principle

Do not build:

```text
SCRAPE MILLIONS OF JOBS
      ↓
SHOW ENDLESS FEED
      ↓
ADD AI MATCH SCORE
      ↓
AUTO-APPLY EVERYWHERE
```

Build:

```text
CAREER TARGET
      ↓
RELEVANT OPPORTUNITY
      ↓
UNDERSTAND REQUIREMENTS
      ↓
COMPARE WITH CANDIDATE EVIDENCE
      ↓
DECIDE WHETHER TO PURSUE
      ↓
PREPARE FOR THE ROLE
      ↓
APPLY
      ↓
TRACK PROCESS
      ↓
PREPARE FOR EACH INTERVIEW STAGE
      ↓
LEARN FROM THE REAL INTERVIEW
```

---

# The Most Important Architectural Distinction

The system should not have:

```text
JOB
```

as one overloaded concept.

It should have:

```text
COMPANY
   ↓
OPPORTUNITY
   ↓
APPLICATION
   ↓
INTERVIEW PROCESS
   ↓
INTERVIEW STAGE
   ↓
REAL INTERVIEW RECORD
   ↓
OUTCOME
```

Example:

```text
COMPANY
Nutanix

OPPORTUNITY
Software Engineer — Backend

APPLICATION
Applied on 10 July

INTERVIEW PROCESS
Active

STAGE 1
Recruiter Screen
Completed

STAGE 2
Technical Interview
Scheduled

STAGE 3
System Design
Expected

CURRENT PREPARATION
Java
Spring Boot
Microservices
Resume Defense
System Design
```

This gives the product meaningful context.

---

# The Opportunity Intelligence Loop

```text
JOB DESCRIPTION
      ↓
ROLE REQUIREMENTS
      ↓
CANDIDATE EVIDENCE
      ↓
GAP CLASSIFICATION
      ↓
INTERVIEW EXPOSURE
      ↓
PREPARATION PRIORITY
      ↓
CONTENT
      ↓
PRACTICE
      ↓
MOCK INTERVIEW
```

The opportunity should therefore become a temporary personalization layer over the canonical preparation system.

It must not create a duplicate copy of the entire content system.

---

# Shared vs Personal Data

This is a major backend requirement.

Do not store:

```text
USER A
   → FULL COPY OF JOB

USER B
   → FULL COPY OF SAME JOB

USER C
   → FULL COPY OF SAME JOB
```

Prefer:

```text
SHARED OPPORTUNITY
   ↓
CANONICAL JOB DATA
   ↓
USER A SAVED STATE
USER B SAVED STATE
USER C SAVED STATE
```

Then:

```text
USER-SPECIFIC DATA

RESUME MATCH
PREPARATION PLAN
APPLICATION
NOTES
INTERVIEW STAGES
OUTCOME
```

This reduces:

* duplicate storage,
* duplicate parsing,
* duplicate AI analysis,
* inconsistent job data,
* unnecessary cost.

---

# Job Discovery Should Not Block V2

The product can launch the core workflow with:

```text
PASTE JOB DESCRIPTION
OR
SAVE JOB URL
OR
ENTER JOB MANUALLY
```

Then:

```text
ANALYZE
      ↓
MATCH
      ↓
PREPARE
      ↓
TRACK
```

A full job discovery engine can be added later.

This is strategically important because external job discovery introduces:

* API dependencies,
* provider costs,
* licensing questions,
* scraping restrictions,
* stale data,
* deduplication complexity,
* source reliability problems.

The highest-value V2 flow is:

```text
I FOUND A JOB
      ↓
HELP ME UNDERSTAND IT
      ↓
TELL ME WHAT I NEED TO PREPARE
      ↓
HELP ME TRACK THE PROCESS
      ↓
PREPARE ME FOR THE INTERVIEW
```

---

# Real Interview Learning Loop

This is one of the strongest long-term product loops:

```text
PREPARE
   ↓
MOCK INTERVIEW
   ↓
REAL INTERVIEW
   ↓
PRIVATE REFLECTION
   ↓
WHAT WAS ACTUALLY ASKED?
   ↓
WHAT WAS DIFFICULT?
   ↓
WHAT DID I MISS?
   ↓
PERSONAL WEAKNESS UPDATE
   ↓
BETTER NEXT PREPARATION
```

Later, only with explicit user consent:

```text
PRIVATE INTERVIEW EXPERIENCE
      ↓
ANONYMIZATION
      ↓
MODERATION
      ↓
AGGREGATED INTERVIEW INTELLIGENCE
```

Private reflection and public contribution must remain completely separate.

---

# Job Search Scope Recommendation

For V2, prioritize:

```text
P0

MANUAL JOB CAPTURE
JOB DESCRIPTION PASTE
SAFE JOB URL IMPORT
JOB REQUIREMENT PARSING
RESUME MATCHING
GAP ANALYSIS
JOB-SPECIFIC PREPARATION
APPLICATION TRACKING
INTERVIEW STAGE TRACKING
REAL INTERVIEW PREPARATION
POST-INTERVIEW REFLECTION
```

Then:

```text
P1

OPTIONAL JOB DISCOVERY
JOB ALERTS
COMPANY INTELLIGENCE
ROLE INTELLIGENCE
CALENDAR INTEGRATION
REMINDERS
```

Then:

```text
P2

EMAIL INTEGRATION
PARTNER JOB FEEDS
ASSISTED APPLICATION WORKFLOWS
ADVANCED OPPORTUNITY RECOMMENDATIONS
```

This keeps V2 focused.

---

# Root-Level Product Rule

If job recommendations are poor:

```text
DO NOT
JUST CHANGE THE AI PROMPT
```

Fix:

```text
CAREER TARGET
+
ROLE NORMALIZATION
+
SKILL TAXONOMY
+
SENIORITY MATCHING
+
LOCATION PREFERENCES
+
RELEVANCE SIGNALS
```

If application tracking becomes overwhelming:

```text
DO NOT
ADD MORE DASHBOARD CARDS
```

Fix:

```text
CURRENT STAGE
+
NEXT ACTION
+
UPCOMING INTERVIEW
+
PREPARATION PRIORITY
```

If job-specific preparation feels generic:

```text
DO NOT
ASK AI TO PERSONALIZE MORE
```

Fix:

```text
JOB REQUIREMENTS
+
RESUME CLAIMS
+
CANDIDATE EVIDENCE
+
GAP CLASSIFICATION
+
INTERVIEW STAGE
+
TIME REMAINING
```

---

# Recommended Implementation Order

```text
1. AUDIT CURRENT JOB SYSTEM
        ↓
2. FREEZE CAREER TARGET MODEL
        ↓
3. FREEZE OPPORTUNITY MODEL
        ↓
4. BUILD MANUAL JOB CAPTURE
        ↓
5. BUILD SAFE URL IMPORT
        ↓
6. REUSE JOB PARSER
        ↓
7. REUSE RESUME MATCHING
        ↓
8. BUILD OPPORTUNITY EVALUATION
        ↓
9. BUILD APPLICATION MODEL
        ↓
10. BUILD APPLICATION WORKSPACE
        ↓
11. BUILD INTERVIEW STAGE MODEL
        ↓
12. BUILD JOB-SPECIFIC PREPARATION
        ↓
13. CONNECT TO PRACTICE
        ↓
14. CONNECT TO MOCK INTERVIEWS
        ↓
15. BUILD REAL INTERVIEW REFLECTION
        ↓
16. BUILD PERSONAL LEARNING LOOP
        ↓
17. ADD OPTIONAL DISCOVERY
        ↓
18. ADD ALERTS AND REMINDERS
        ↓
19. SECURITY + PRIVACY + COMPLIANCE
        ↓
20. MIGRATE VALID LEGACY DATA
        ↓
21. REMOVE LEGACY SYSTEMS
```

---

# Recommended Phase 12 Directory

```text
docs/v2/tasks/PHASE_12/
│
├── README.md
├── 00_PHASE_OVERVIEW.md
├── 01_CURRENT_JOB_SYSTEM_AUDIT.md
├── 02_CAREER_TARGET_MODEL.md
├── 03_OPPORTUNITY_ARCHITECTURE.md
├── 04_JOB_SOURCE_ARCHITECTURE.md
├── 05_JOB_CAPTURE_AND_IMPORT.md
├── 06_COMPANY_AND_ROLE_MODEL.md
├── 07_JOB_INTELLIGENCE.md
├── 08_OPPORTUNITY_EVALUATION.md
├── 09_APPLICATION_MODEL.md
├── 10_APPLICATION_WORKSPACE.md
├── 11_INTERVIEW_PROCESS_MODEL.md
├── 12_JOB_PREPARATION_ORCHESTRATION.md
├── 13_REAL_INTERVIEW_LEARNING_LOOP.md
├── 14_JOB_DISCOVERY_AND_PROVIDERS.md
├── 15_SECURITY_PRIVACY_COMPLIANCE.md
├── 16_SEO_BOUNDARIES.md
├── 17_RELIABILITY_PERFORMANCE_COST.md
├── 18_UI_MOBILE_ACCESSIBILITY.md
├── 19_LEGACY_MIGRATION_CLEANUP.md
└── 20_COMPLETION_REPORT.md
```

---

# Phase 12 Summary

```text
732 TASKS

PRIMARY FOCUS:

CAREER TARGETS
JOB OPPORTUNITIES
JOB CAPTURE
JOB URL IMPORT
JOB DISCOVERY BOUNDARY
JOB SOURCES
JOB FRESHNESS
DEDUPLICATION
COMPANY INTELLIGENCE
ROLE INTELLIGENCE
JOB REQUIREMENTS
RESUME MATCHING
OPPORTUNITY EVALUATION
APPLICATION TRACKING
APPLICATION TIMELINE
NEXT ACTIONS
INTERVIEW STAGES
JOB-SPECIFIC PREPARATION
INTERVIEW COUNTDOWN
OPPORTUNITY-BASED MOCK INTERVIEWS
REAL INTERVIEW REFLECTION
PERSONAL LEARNING LOOP
JOB ALERTS
REMINDERS
PRIVACY
SECURITY
COMPLIANCE
SEO BOUNDARIES
LEGACY CLEANUP
```

---

# Relationship with Previous Phases

```text
CONTENT SYSTEM
      ↓
WHAT CAN BE LEARNED

QUESTION SYSTEM
      ↓
WHAT CAN BE ASKED

USER SYSTEM
      ↓
WHO THE CANDIDATE IS

PRACTICE SYSTEM
      ↓
HOW THE CANDIDATE PREPARES

MOCK INTERVIEW SYSTEM
      ↓
HOW THE CANDIDATE PERFORMS

RESUME INTELLIGENCE
      ↓
WHAT THE CANDIDATE CLAIMS

JOB INTELLIGENCE
      ↓
WHAT THE OPPORTUNITY REQUIRES

APPLICATION WORKSPACE
      ↓
WHAT THE CANDIDATE
NEEDS TO DO NEXT
```

---

# Next Phase

```text
PHASE 13

REAL INTERVIEW EXPERIENCE,
INTERVIEW QUESTION CONTRIBUTION,
COMPANY INTERVIEW INTELLIGENCE,
COMMUNITY KNOWLEDGE,
TRUST, MODERATION,
PROVENANCE
&
KNOWLEDGE FEEDBACK LOOPS
```

Phase 13 should solve a different problem:

```text
HOW DOES INTERVIEW EXPLAINER
LEARN FROM REAL INTERVIEWS
WITHOUT BECOMING
AN UNVERIFIED DUMP
OF RANDOM QUESTIONS?
```

The architecture should connect:

```text
REAL INTERVIEW
      ↓
PRIVATE REFLECTION
      ↓
OPTIONAL CONTRIBUTION
      ↓
ANONYMIZATION
      ↓
MODERATION
      ↓
NORMALIZATION
      ↓
CANONICAL QUESTION MATCHING
      ↓
EVIDENCE + RECENCY + PROVENANCE
      ↓
COMPANY / ROLE INTELLIGENCE
      ↓
BETTER PREPARATION
```
