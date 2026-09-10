# PHASE 10 — MOCK INTERVIEW ENGINE, INTERVIEW SIMULATION, ANSWER CAPTURE, EVALUATION & FEEDBACK SYSTEM

---

# Phase Objective

Build the canonical mock interview system for Interview Explainer.

The system must support a complete interview lifecycle:

```text
PREPARATION CONTEXT
        ↓
INTERVIEW CONFIGURATION
        ↓
INTERVIEW SESSION
        ↓
QUESTION SELECTION
        ↓
QUESTION DELIVERY
        ↓
ANSWER CAPTURE
        ↓
ANSWER EVALUATION
        ↓
STRUCTURED FEEDBACK
        ↓
WEAKNESS IDENTIFICATION
        ↓
TARGETED PREPARATION
        ↓
FOLLOW-UP INTERVIEW
```

The mock interview engine must not become:

* a chatbot with random questions,
* an AI wrapper around a prompt,
* a generic voice recorder,
* a score generator without evidence,
* a fake interview readiness calculator,
* a collection of disconnected interview modes,
* or an expensive LLM call pipeline with no deterministic architecture.

The central product principle is:

```text
A MOCK INTERVIEW
IS NOT A LIST OF QUESTIONS.

IT IS A CONTROLLED,
STATEFUL,
EVALUATABLE
INTERVIEW SESSION.
```

---

# Core Product Model

```text
LEARN
   ↓
PRACTICE
   ↓
MOCK INTERVIEW
   ↓
PERFORM
   ↓
EVALUATE
   ↓
UNDERSTAND WEAKNESSES
   ↓
RETURN TO TARGETED LEARNING
   ↓
RE-INTERVIEW
```

Phase 10 must connect directly with:

* canonical content,
* question identity,
* user preparation tracks,
* user progress,
* daily preparation,
* revision,
* practice history,
* and future readiness systems.

---

# Workstream A — Existing Interview Feature Audit

## P10-T001 — Inventory Existing Mock Interview Routes


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T002 — Inventory Existing Interview Components


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T003 — Inventory Existing Interview APIs


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T004 — Inventory Existing Interview Data Models


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T005 — Inventory Existing Question Selection Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T006 — Inventory Existing AI Interview Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T007 — Inventory Existing Prompt Templates


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T008 — Inventory Existing Answer Capture Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T009 — Inventory Existing Audio Features


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T010 — Inventory Existing Speech-to-Text Features


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T011 — Inventory Existing Evaluation Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T012 — Inventory Existing Scoring Logic


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T013 — Inventory Existing Feedback UI


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T014 — Inventory Existing Interview History


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T015 — Identify Duplicate Interview Systems


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T016 — Identify Dead Interview Code


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T017 — Identify Hardcoded Interview Questions


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T018 — Identify Random Question Selection


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T019 — Identify Unbounded LLM Calls


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T020 — Identify Fake or Unsupported Scores


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T021 — Produce Existing Interview Architecture Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream B — Mock Interview Product Definition

## P10-T022 — Define Mock Interview Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T023 — Define Difference Between Practice and Mock Interview

Practice:

```text
LOW PRESSURE
LEARNING ORIENTED
QUESTION-BY-QUESTION
ANSWER CAN BE REVEALED
```

Mock interview:

```text
CONTROLLED SESSION
INTERVIEW CONDITIONS
NO ANSWER REVEAL DURING RESPONSE
SESSION-LEVEL EVALUATION
PERFORMANCE ORIENTED
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Practice: Mock interview: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T024 — Define Difference Between Mock Interview and Real Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T025 — Define Technical Interview Simulation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T026 — Define Behavioural Interview Simulation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T027 — Define Management Consulting Interview Simulation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T028 — Define Data Interview Simulation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T029 — Define Role-Specific Interview Simulation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T030 — Define Company-Specific Simulation Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T031 — Define Experience-Level Adaptation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T032 — Define Interview Difficulty


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T033 — Define Interview Duration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T034 — Define Interview Completion


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T035 — Define Interview Abandonment


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T036 — Define Interview Resumption Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream C — Interview Mode Architecture

## P10-T037 — Define Interview Mode Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T038 — Define Quick Mock Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T039 — Define Standard Mock Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T040 — Define Deep Mock Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T041 — Define Topic-Specific Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T042 — Define Module-Specific Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T043 — Define Role-Specific Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T044 — Define Preparation-Track Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T045 — Define Weakness-Focused Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T046 — Define Revision Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T047 — Define Custom Interview


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T048 — Avoid Creating Too Many User-Facing Modes Initially


**Execution:** Execute this task against the current repository in the context of Workstream C — Interview Mode Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T049 — Define Canonical V1 Mode Set

Recommended initial set:

```text
QUICK MOCK
STANDARD MOCK
TOPIC MOCK
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Apply this specifically to: Recommended initial set: Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream D — Interview Configuration

## P10-T050 — Define Interview Configuration Model


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T051 — Define Target Role


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T052 — Define Domain


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T053 — Define Stack


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T054 — Define Topic Scope


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T055 — Define Experience Level


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T056 — Define Difficulty


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T057 — Define Interview Duration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T058 — Define Question Count


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T059 — Define Answer Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T060 — Define Optional Company Context


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T061 — Define Optional Job Description Context


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P10-T062 — Define Interview Language


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T063 — Define Configuration Validation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T064 — Avoid Excessive Configuration Before Interview Start


**Execution:** Execute this task against the current repository in the context of Workstream D — Interview Configuration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream E — Interview Setup Experience

## P10-T065 — Build Canonical Interview Setup Flow


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T066 — Reuse Active Preparation Track by Default


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T067 — Preselect Relevant Role


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T068 — Preselect Relevant Experience Level


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T069 — Allow User Override


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T070 — Keep Setup Short


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T071 — Avoid Long Wizard by Default


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T072 — Show Interview Scope Before Starting


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T073 — Show Expected Duration


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T074 — Explain Answer Mode


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T075 — Explain Evaluation Boundary


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T076 — Provide Clear Start Interview Action


**Execution:** Execute this task against the current repository in the context of Workstream E — Interview Setup Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream F — Interview Session Data Model

## P10-T077 — Define Interview Session ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T078 — Define User ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T079 — Define Preparation Track ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T080 — Define Interview Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T081 — Define Interview Configuration Snapshot


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T082 — Define Session Status

```text
created
ready
in_progress
completed
abandoned
expired
evaluation_pending
evaluated
evaluation_failed
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T083 — Define Session Created Timestamp


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T084 — Define Session Start Timestamp


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T085 — Define Session Completion Timestamp


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T086 — Define Session Duration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T087 — Define Question Count


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T088 — Define Answer Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T089 — Define Evaluation Version


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T090 — Define Interview Engine Version


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream G — Interview Session State Machine

## P10-T091 — Define Session Creation Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T092 — Define Ready Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T093 — Define Start Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T094 — Define Question Active Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T095 — Define Answer Submission Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T096 — Define Next Question Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T097 — Define Interview Completion Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T098 — Define Evaluation Pending Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T099 — Define Evaluation Completion Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T100 — Define Evaluation Failure Transition


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T101 — Prevent Invalid State Transitions


**Execution:** Execute this task against the current repository in the context of Workstream G — Interview Session State Machine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T102 — Make Transitions Idempotent Where Required


**Execution:** Execute this task against the current repository in the context of Workstream G — Interview Session State Machine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream H — Interview Question Instance Model

## P10-T103 — Define Interview Question Instance


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T104 — Reference Stable Canonical Question ID


**Execution:** Execute this task against the current repository in the context of Workstream H — Interview Question Instance Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T105 — Define Session ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T106 — Define Question Order


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T107 — Define Question Snapshot


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T108 — Define Difficulty Snapshot


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T109 — Define Topic Snapshot


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T110 — Define Selection Reason


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T111 — Define Question Delivery Timestamp


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T112 — Define Answer Start Timestamp


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T113 — Define Answer Submission Timestamp


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T114 — Preserve Historical Interview Integrity After Content Changes


**Execution:** Execute this task against the current repository in the context of Workstream H — Interview Question Instance Model, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream I — Question Selection Engine

## P10-T115 — Define Question Selection Engine Contract


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T116 — Use Canonical Published Questions


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T117 — Exclude Draft Questions


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T118 — Exclude Archived Questions Unless Explicitly Required


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T119 — Respect Interview Scope


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T120 — Respect Experience Level


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T121 — Respect Difficulty Distribution


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T122 — Respect Question Count


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T123 — Avoid Pure Random Selection


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T124 — Avoid Repeating Recently Asked Questions Excessively


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T125 — Include Coverage Across Relevant Topics


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T126 — Define Selection Seed if Reproducibility Is Needed


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T127 — Log Selection Reason


**Execution:** Execute this task against the current repository in the context of Workstream I — Question Selection Engine, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream J — Question Distribution Strategy

## P10-T128 — Define Foundational Question Ratio


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T129 — Define Intermediate Question Ratio


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T130 — Define Advanced Question Ratio


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T131 — Define Conceptual Question Ratio


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T132 — Define Practical Question Ratio


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T133 — Define Scenario-Based Question Ratio


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T134 — Define Troubleshooting Question Ratio


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T135 — Define Architecture Question Ratio Where Relevant


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T136 — Make Distribution Role-Aware


**Execution:** Execute this task against the current repository in the context of Workstream J — Question Distribution Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T137 — Make Distribution Experience-Aware


**Execution:** Execute this task against the current repository in the context of Workstream J — Question Distribution Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream K — Interview Blueprint

## P10-T138 — Define Interview Blueprint Model


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T139 — Define Blueprint Role


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T140 — Define Blueprint Experience Level


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T141 — Define Blueprint Duration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T142 — Define Blueprint Sections


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T143 — Define Section Question Counts


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T144 — Define Topic Distribution


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T145 — Define Difficulty Distribution


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T146 — Version Interview Blueprints


**Execution:** Execute this task against the current repository in the context of Workstream K — Interview Blueprint, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T147 — Avoid Hardcoding Blueprint Logic in UI


**Execution:** Execute this task against the current repository in the context of Workstream K — Interview Blueprint, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream L — Technical Interview Blueprint

## P10-T148 — Define Opening Question Pattern


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T149 — Define Core Fundamentals Section


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T150 — Define Applied Knowledge Section


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T151 — Define Scenario Section


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T152 — Define Troubleshooting Section


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T153 — Define Advanced Depth Section


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T154 — Define Closing Question Pattern


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P10-T155 — Adapt Blueprint by Experience Level


**Execution:** Execute this task against the current repository in the context of Workstream L — Technical Interview Blueprint, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream M — Follow-Up Question Architecture

## P10-T156 — Define Follow-Up Question Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T157 — Distinguish Planned Questions from Dynamic Follow-Ups


**Execution:** Execute this task against the current repository in the context of Workstream M — Follow-Up Question Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T158 — Define Follow-Up Eligibility


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T159 — Define Maximum Follow-Ups per Question


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T160 — Define Maximum Follow-Ups per Session


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T161 — Prevent Infinite Follow-Up Loops


**Execution:** Execute this task against the current repository in the context of Workstream M — Follow-Up Question Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T162 — Define Clarification Follow-Up


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T163 — Define Depth Follow-Up


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T164 — Define Scenario Follow-Up


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T165 — Define Correction Follow-Up Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream N — Deterministic Follow-Up Strategy

## P10-T166 — Prefer Curated Follow-Ups Where Available


**Execution:** Execute this task against the current repository in the context of Workstream N — Deterministic Follow-Up Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T167 — Store Follow-Up Relationships in Content Model


**Execution:** Execute this task against the current repository in the context of Workstream N — Deterministic Follow-Up Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T168 — Define Follow-Up Trigger Rules


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T169 — Avoid AI Follow-Up Generation for Every Question


**Execution:** Execute this task against the current repository in the context of Workstream N — Deterministic Follow-Up Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T170 — Use AI Dynamic Follow-Up Only Where It Adds Value


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P10-T171 — Validate AI Follow-Up Scope


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T172 — Prevent Topic Drift


**Execution:** Execute this task against the current repository in the context of Workstream N — Deterministic Follow-Up Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T173 — Preserve Session Duration Budget


**Execution:** Execute this task against the current repository in the context of Workstream N — Deterministic Follow-Up Strategy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream O — Interview Runtime UI

## P10-T174 — Build Canonical Interview Runtime Shell


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T175 — Remove Normal Content Navigation During Active Interview Where Appropriate


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P1

---

## P10-T176 — Keep Interface Focused


**Execution:** Execute this task against the current repository in the context of Workstream O — Interview Runtime UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T177 — Show Current Question Clearly


**Execution:** Execute this task against the current repository in the context of Workstream O — Interview Runtime UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T178 — Show Question Number


**Execution:** Execute this task against the current repository in the context of Workstream O — Interview Runtime UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T179 — Show Session Progress Minimally


**Execution:** Execute this task against the current repository in the context of Workstream O — Interview Runtime UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T180 — Show Timer Only When Product-Relevant


**Execution:** Execute this task against the current repository in the context of Workstream O — Interview Runtime UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T181 — Avoid Distracting Dashboard Elements


**Execution:** Execute this task against the current repository in the context of Workstream O — Interview Runtime UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T182 — Avoid Decorative Animation


**Execution:** Execute this task against the current repository in the context of Workstream O — Interview Runtime UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T183 — Avoid Excessive Colour


**Execution:** Execute this task against the current repository in the context of Workstream O — Interview Runtime UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T184 — Maintain Calm Interview Environment


**Execution:** Execute this task against the current repository in the context of Workstream O — Interview Runtime UI, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream P — Question Delivery Experience

## P10-T185 — Define Question Presentation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T186 — Ensure Long Questions Remain Readable


**Execution:** Execute this task against the current repository in the context of Workstream P — Question Delivery Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T187 — Support Code Blocks Where Required


**Execution:** Execute this task against the current repository in the context of Workstream P — Question Delivery Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T188 — Support Scenario Context


**Execution:** Execute this task against the current repository in the context of Workstream P — Question Delivery Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T189 — Support Supporting Data Where Required


**Execution:** Execute this task against the current repository in the context of Workstream P — Question Delivery Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T190 — Avoid Showing Canonical Answer During Interview


**Execution:** Execute this task against the current repository in the context of Workstream P — Question Delivery Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T191 — Avoid Showing Hints Unless Interview Mode Allows Them


**Execution:** Execute this task against the current repository in the context of Workstream P — Question Delivery Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T192 — Avoid Showing Related Questions


**Execution:** Execute this task against the current repository in the context of Workstream P — Question Delivery Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T193 — Avoid SEO Content UI Inside Interview Runtime


**Execution:** Execute this task against the current repository in the context of Workstream P — Question Delivery Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Q — Answer Mode Architecture

## P10-T194 — Define Text Answer Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T195 — Define Voice Answer Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T196 — Define Future Code Answer Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T197 — Define Future Whiteboard Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P10-T198 — Define Future Video Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P2

---

## P10-T199 — Keep Answer Modes Behind Shared Contract


**Execution:** Execute this task against the current repository in the context of Workstream Q — Answer Mode Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T200 — Avoid Separate Interview Engines Per Answer Mode


**Execution:** Execute this task against the current repository in the context of Workstream Q — Answer Mode Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream R — Text Answer Capture

## P10-T201 — Build Text Answer Input


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T202 — Define Minimum Submission Rules


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T203 — Define Maximum Answer Length


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T204 — Support Multiline Answers


**Execution:** Execute this task against the current repository in the context of Workstream R — Text Answer Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T205 — Preserve Draft During Active Question


**Execution:** Execute this task against the current repository in the context of Workstream R — Text Answer Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T206 — Prevent Duplicate Submission


**Execution:** Execute this task against the current repository in the context of Workstream R — Text Answer Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T207 — Handle Network Failure


**Execution:** Execute this task against the current repository in the context of Workstream R — Text Answer Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T208 — Confirm Persistence Before Advancing


**Execution:** Execute this task against the current repository in the context of Workstream R — Text Answer Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T209 — Clear Draft After Successful Transition


**Execution:** Execute this task against the current repository in the context of Workstream R — Text Answer Capture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream S — Voice Answer Capture Foundation

## P10-T210 — Define Voice Capture Architecture


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T211 — Request Microphone Permission Contextually


**Execution:** Execute this task against the current repository in the context of Workstream S — Voice Answer Capture Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T212 — Handle Permission Denial


**Execution:** Execute this task against the current repository in the context of Workstream S — Voice Answer Capture Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T213 — Handle Missing Microphone


**Execution:** Execute this task against the current repository in the context of Workstream S — Voice Answer Capture Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T214 — Handle Unsupported Browser


**Execution:** Execute this task against the current repository in the context of Workstream S — Voice Answer Capture Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T215 — Define Recording Start


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T216 — Define Recording Pause Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T217 — Define Recording Stop


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T218 — Show Clear Recording State


**Execution:** Execute this task against the current repository in the context of Workstream S — Voice Answer Capture Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T219 — Avoid Fake Audio Visualizers


**Execution:** Execute this task against the current repository in the context of Workstream S — Voice Answer Capture Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T220 — Show Actual Recording Duration


**Execution:** Execute this task against the current repository in the context of Workstream S — Voice Answer Capture Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream T — Audio Upload Architecture

## P10-T221 — Define Supported Audio Formats


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T222 — Define Maximum Audio Duration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T223 — Define Maximum File Size


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T224 — Define Upload Lifecycle


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T225 — Define Temporary Upload State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T226 — Define Finalized Audio State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T227 — Define Failed Upload State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T228 — Prevent Duplicate Uploads


**Execution:** Execute this task against the current repository in the context of Workstream T — Audio Upload Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T229 — Define Retry Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T230 — Define Audio Retention Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream U — Speech-to-Text Architecture

## P10-T231 — Define Transcription Provider Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T232 — Avoid Provider-Specific Logic Across Product Code


**Execution:** Execute this task against the current repository in the context of Workstream U — Speech-to-Text Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T233 — Define Transcription Job


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T234 — Define Transcription Status

```text
pending
processing
completed
failed
```

**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T235 — Store Raw Transcript


**Execution:** Execute this task against the current repository in the context of Workstream U — Speech-to-Text Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T236 — Store Normalized Transcript Separately if Required


**Execution:** Find the current variants of this behavior, define the canonical V2 rule in the correct shared token, primitive, component, layout, or service layer, and migrate inconsistent consumers to it. Keep only documented exceptions that have a real product need, then verify representative routes or flows so the standard is actually applied rather than merely documented.

**Priority:** P1

---

## P10-T237 — Preserve Original Audio Reference


**Execution:** Execute this task against the current repository in the context of Workstream U — Speech-to-Text Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T238 — Define Transcription Confidence Handling


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T239 — Handle Partial Transcription Failure


**Execution:** Execute this task against the current repository in the context of Workstream U — Speech-to-Text Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T240 — Allow Evaluation Retry Without Re-Uploading Audio


**Execution:** Execute this task against the current repository in the context of Workstream U — Speech-to-Text Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream V — Voice Privacy

## P10-T241 — Define Explicit Voice Data Policy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T242 — Inform User Before Recording


**Execution:** Execute this task against the current repository in the context of Workstream V — Voice Privacy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T243 — Define Audio Retention Duration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T244 — Allow Audio Deletion


**Execution:** Execute this task against the current repository in the context of Workstream V — Voice Privacy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T245 — Define Transcript Retention


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T246 — Prevent Public Audio URLs


**Execution:** Execute this task against the current repository in the context of Workstream V — Voice Privacy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T247 — Use Authorized Audio Access


**Execution:** Execute this task against the current repository in the context of Workstream V — Voice Privacy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T248 — Prevent Cross-User Audio Access


**Execution:** Execute this task against the current repository in the context of Workstream V — Voice Privacy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T249 — Avoid Using User Audio for Unrelated Purposes


**Execution:** Execute this task against the current repository in the context of Workstream V — Voice Privacy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream W — Answer Data Model

## P10-T250 — Define Interview Answer Record


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T251 — Define Session ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T252 — Define Question Instance ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T253 — Define User ID


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T254 — Define Answer Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T255 — Define Raw Text Answer


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T256 — Define Transcript Reference


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T257 — Define Audio Reference


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T258 — Define Submission Timestamp


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T259 — Define Answer Duration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T260 — Define Answer Version


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream X — Evaluation Product Philosophy

## P10-T261 — Define Evaluation Purpose


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T262 — Evaluation Must Help Improvement


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P10-T263 — Evaluation Must Be Explainable


**Execution:** Execute this task against the current repository in the context of Workstream X — Evaluation Product Philosophy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T264 — Evaluation Must Separate Dimensions


**Execution:** Execute this task against the current repository in the context of Workstream X — Evaluation Product Philosophy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T265 — Avoid One Unsupported Overall Score


**Execution:** Execute this task against the current repository in the context of Workstream X — Evaluation Product Philosophy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T266 — Avoid Pretending AI Evaluation Is Objective Truth


**Execution:** Execute this task against the current repository in the context of Workstream X — Evaluation Product Philosophy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T267 — Avoid Hiring Predictions


**Execution:** Execute this task against the current repository in the context of Workstream X — Evaluation Product Philosophy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T268 — Avoid “You Would Pass This Interview” Claims


**Execution:** Execute this task against the current repository in the context of Workstream X — Evaluation Product Philosophy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T269 — Present Evaluation as Preparation Feedback


**Execution:** Execute this task against the current repository in the context of Workstream X — Evaluation Product Philosophy, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Y — Evaluation Dimension Architecture

## P10-T270 — Define Correctness


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T271 — Define Completeness


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T272 — Define Relevance


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T273 — Define Clarity


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T274 — Define Structure


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T275 — Define Depth


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T276 — Define Practical Understanding


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T277 — Define Communication Quality for Voice Answers


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T278 — Define Confidence Boundary Carefully


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T279 — Avoid Inferring Personality


**Execution:** Execute this task against the current repository in the context of Workstream Y — Evaluation Dimension Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T280 — Avoid Inferring Protected or Sensitive Traits


**Execution:** Execute this task against the current repository in the context of Workstream Y — Evaluation Dimension Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream Z — Question-Specific Evaluation Rubric

## P10-T281 — Define Canonical Evaluation Rubric per Question


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T282 — Define Required Concepts


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T283 — Define Important Supporting Concepts


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T284 — Define Common Misconceptions


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T285 — Define Strong Answer Indicators


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T286 — Define Weak Answer Indicators


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T287 — Define Optional Advanced Concepts


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T288 — Version Evaluation Rubrics


**Execution:** Execute this task against the current repository in the context of Workstream Z — Question-Specific Evaluation Rubric, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T289 — Separate Canonical Answer from Evaluation Rubric


**Execution:** Execute this task against the current repository in the context of Workstream Z — Question-Specific Evaluation Rubric, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AA — Deterministic Evaluation Layer

## P10-T290 — Build Pre-Evaluation Validation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T291 — Detect Empty Answer


**Execution:** Execute this task against the current repository in the context of Workstream AA — Deterministic Evaluation Layer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T292 — Detect Extremely Short Answer


**Execution:** Execute this task against the current repository in the context of Workstream AA — Deterministic Evaluation Layer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T293 — Detect Evaluation-Ineligible Answer


**Execution:** Execute this task against the current repository in the context of Workstream AA — Deterministic Evaluation Layer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T294 — Validate Question Context


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T295 — Validate Rubric Availability


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T296 — Validate Transcript Availability for Voice Answer


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T297 — Avoid LLM Call When Evaluation Cannot Be Meaningful


**Execution:** Execute this task against the current repository in the context of Workstream AA — Deterministic Evaluation Layer, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AB — AI Evaluation Boundary

## P10-T298 — Define Evaluation Provider Interface


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T299 — Keep Provider Replaceable


**Execution:** Identify every active consumer of the current implementation, move them to the V2 target in a controlled sequence, and preserve compatibility only where an active dependency still requires it. Verify the migrated paths before retiring the old implementation, then update the migration tracker with completed consumers and remaining exceptions.

**Priority:** P0

---

## P10-T300 — Keep Model Configuration Versioned


**Execution:** Execute this task against the current repository in the context of Workstream AB — AI Evaluation Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T301 — Keep Prompt Versioned


**Execution:** Execute this task against the current repository in the context of Workstream AB — AI Evaluation Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T302 — Keep Rubric Versioned


**Execution:** Execute this task against the current repository in the context of Workstream AB — AI Evaluation Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T303 — Store Evaluation Provenance


**Execution:** Execute this task against the current repository in the context of Workstream AB — AI Evaluation Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T304 — Avoid Model Calls from Frontend


**Execution:** Execute this task against the current repository in the context of Workstream AB — AI Evaluation Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T305 — Protect Provider Credentials


**Execution:** Execute this task against the current repository in the context of Workstream AB — AI Evaluation Boundary, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T306 — Define Timeout Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T307 — Define Retry Strategy


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream AC — Evaluation Prompt Architecture

## P10-T308 — Define System Evaluation Instructions


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T309 — Provide Question Context


**Execution:** Execute this task against the current repository in the context of Workstream AC — Evaluation Prompt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T310 — Provide Evaluation Rubric


**Execution:** Execute this task against the current repository in the context of Workstream AC — Evaluation Prompt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T311 — Provide User Answer


**Execution:** Execute this task against the current repository in the context of Workstream AC — Evaluation Prompt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T312 — Provide Experience-Level Context


**Execution:** Execute this task against the current repository in the context of Workstream AC — Evaluation Prompt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T313 — Require Structured Output


**Execution:** Execute this task against the current repository in the context of Workstream AC — Evaluation Prompt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T314 — Require Evidence-Based Feedback


**Execution:** Execute this task against the current repository in the context of Workstream AC — Evaluation Prompt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T315 — Require Missing Concepts


**Execution:** Execute this task against the current repository in the context of Workstream AC — Evaluation Prompt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T316 — Require Improvement Guidance


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P10-T317 — Prevent Unsupported Claims


**Execution:** Execute this task against the current repository in the context of Workstream AC — Evaluation Prompt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T318 — Prevent Prompt Injection Through User Answer


**Execution:** Execute this task against the current repository in the context of Workstream AC — Evaluation Prompt Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AD — Structured Evaluation Schema

## P10-T319 — Define Evaluation Result Schema


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T320 — Define Evaluation Status


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T321 — Define Dimension Results


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T322 — Define Strengths


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T323 — Define Missing Concepts


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T324 — Define Incorrect Claims


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T325 — Define Improvement Suggestions


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T326 — Define Recommended Review Content


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P10-T327 — Define Confidence or Reliability Metadata if Supported


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T328 — Reject Invalid Evaluation Output


**Execution:** Execute this task against the current repository in the context of Workstream AD — Structured Evaluation Schema, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AE — Evaluation Score Architecture

## P10-T329 — Determine Whether Numeric Scores Are Necessary


**Execution:** Execute this task against the current repository in the context of Workstream AE — Evaluation Score Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T330 — Define Dimension Scale if Used


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T331 — Keep Scale Consistent


**Execution:** Execute this task against the current repository in the context of Workstream AE — Evaluation Score Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T332 — Define Score Meaning


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T333 — Avoid False Decimal Precision


**Execution:** Execute this task against the current repository in the context of Workstream AE — Evaluation Score Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T334 — Avoid 87.4/100 Style Precision Without Evidence


**Execution:** Execute this task against the current repository in the context of Workstream AE — Evaluation Score Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T335 — Prefer Small Understandable Scales

Potential example:

```text
needs_work
developing
solid
strong
```

**Execution:** Execute this task against the current repository in the context of Workstream AE — Evaluation Score Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Potential example: Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T336 — Separate Dimension Results from Overall Summary


**Execution:** Execute this task against the current repository in the context of Workstream AE — Evaluation Score Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AF — Evaluation Reliability

## P10-T337 — Create Evaluation Benchmark Set


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T338 — Include Strong Sample Answers


**Execution:** Execute this task against the current repository in the context of Workstream AF — Evaluation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T339 — Include Partial Sample Answers


**Execution:** Execute this task against the current repository in the context of Workstream AF — Evaluation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T340 — Include Incorrect Sample Answers


**Execution:** Execute this task against the current repository in the context of Workstream AF — Evaluation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T341 — Include Verbose but Incorrect Answers


**Execution:** Execute this task against the current repository in the context of Workstream AF — Evaluation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T342 — Include Short but Correct Answers


**Execution:** Execute this task against the current repository in the context of Workstream AF — Evaluation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T343 — Include Off-Topic Answers


**Execution:** Execute this task against the current repository in the context of Workstream AF — Evaluation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T344 — Include Adversarial Answers


**Execution:** Execute this task against the current repository in the context of Workstream AF — Evaluation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T345 — Measure Evaluation Consistency


**Execution:** Execute this task against the current repository in the context of Workstream AF — Evaluation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T346 — Measure Evaluation Drift Across Model Changes


**Execution:** Execute this task against the current repository in the context of Workstream AF — Evaluation Reliability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AG — Evaluation Cost Architecture

## P10-T347 — Measure Evaluation Cost per Answer


**Execution:** Execute this task against the current repository in the context of Workstream AG — Evaluation Cost Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T348 — Measure Evaluation Cost per Interview


**Execution:** Execute this task against the current repository in the context of Workstream AG — Evaluation Cost Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T349 — Define Maximum Evaluation Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T350 — Avoid Re-Evaluating Unchanged Answers


**Execution:** Execute this task against the current repository in the context of Workstream AG — Evaluation Cost Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T351 — Cache Immutable Evaluation Results


**Execution:** Execute this task against the current repository in the context of Workstream AG — Evaluation Cost Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T352 — Allow Explicit Re-Evaluation Only Under Defined Rules


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T353 — Avoid Sending Unnecessary Content to Model


**Execution:** Execute this task against the current repository in the context of Workstream AG — Evaluation Cost Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T354 — Use Appropriate Model by Evaluation Complexity


**Execution:** Execute this task against the current repository in the context of Workstream AG — Evaluation Cost Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AH — Asynchronous Evaluation

## P10-T355 — Define Evaluation Job Queue


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T356 — Create Evaluation Job


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T357 — Process Evaluation Asynchronously Where Appropriate


**Execution:** Execute this task against the current repository in the context of Workstream AH — Asynchronous Evaluation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T358 — Define Job Status


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T359 — Define Retry Count


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T360 — Define Failure Reason


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T361 — Prevent Duplicate Evaluation Jobs


**Execution:** Execute this task against the current repository in the context of Workstream AH — Asynchronous Evaluation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T362 — Make Evaluation Processing Idempotent


**Execution:** Execute this task against the current repository in the context of Workstream AH — Asynchronous Evaluation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T363 — Define Dead-Letter Handling


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream AI — Per-Question Feedback

## P10-T364 — Show User Answer


**Execution:** Execute this task against the current repository in the context of Workstream AI — Per-Question Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T365 — Show Evaluation Summary


**Execution:** Execute this task against the current repository in the context of Workstream AI — Per-Question Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T366 — Show What Was Done Well


**Execution:** Execute this task against the current repository in the context of Workstream AI — Per-Question Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T367 — Show Missing Concepts


**Execution:** Execute this task against the current repository in the context of Workstream AI — Per-Question Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T368 — Show Incorrect Claims


**Execution:** Execute this task against the current repository in the context of Workstream AI — Per-Question Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T369 — Show How to Improve


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P10-T370 — Link to Canonical Learning Content


**Execution:** Execute this task against the current repository in the context of Workstream AI — Per-Question Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T371 — Avoid Dumping Full Canonical Answer as Feedback


**Execution:** Execute this task against the current repository in the context of Workstream AI — Per-Question Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T372 — Keep Feedback Actionable


**Execution:** Execute this task against the current repository in the context of Workstream AI — Per-Question Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AJ — Interview-Level Feedback

## P10-T373 — Define Interview Summary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T374 — Define Strong Areas


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T375 — Define Areas Needing Improvement


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T376 — Define Topic Coverage Summary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T377 — Define Performance Pattern Summary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T378 — Define Recommended Next Actions


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T379 — Avoid Generic Motivational Text


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Interview-Level Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T380 — Avoid Unsupported Hiring Outcome Predictions


**Execution:** Execute this task against the current repository in the context of Workstream AJ — Interview-Level Feedback, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AK — Feedback UI Architecture

## P10-T381 — Build Canonical Interview Results Page


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T382 — Prioritize Summary Before Detail


**Execution:** Execute this task against the current repository in the context of Workstream AK — Feedback UI Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T383 — Show Key Improvement Areas Clearly


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P10-T384 — Show Recommended Next Action


**Execution:** Execute this task against the current repository in the context of Workstream AK — Feedback UI Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T385 — Allow Question-by-Question Review


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T386 — Avoid Giant Analytics Dashboard


**Execution:** Execute this task against the current repository in the context of Workstream AK — Feedback UI Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T387 — Avoid Excessive Charts


**Execution:** Execute this task against the current repository in the context of Workstream AK — Feedback UI Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T388 — Avoid Colour-Coding Every Metric


**Execution:** Execute this task against the current repository in the context of Workstream AK — Feedback UI Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T389 — Keep Results Readable in Light and Dark Mode


**Execution:** Execute this task against the current repository in the context of Workstream AK — Feedback UI Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AL — Weakness Identification

## P10-T390 — Define Weakness Evidence Threshold


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T391 — Avoid Declaring Weakness from One Minor Mistake


**Execution:** Execute this task against the current repository in the context of Workstream AL — Weakness Identification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T392 — Identify Missing Fundamental Concepts


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T393 — Identify Repeated Topic Weakness


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P10-T394 — Identify Repeated Communication Weakness Carefully


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P1

---

## P10-T395 — Store Weakness Evidence


**Execution:** Execute this task against the current repository in the context of Workstream AL — Weakness Identification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T396 — Store Weakness Source


**Execution:** Execute this task against the current repository in the context of Workstream AL — Weakness Identification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T397 — Store Weakness Timestamp


**Execution:** Execute this task against the current repository in the context of Workstream AL — Weakness Identification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T398 — Allow Weakness Resolution


**Execution:** Execute this task against the current repository in the context of Workstream AL — Weakness Identification, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

# Workstream AM — Feedback-to-Learning Loop

## P10-T399 — Map Missing Concepts to Canonical Content


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T400 — Map Weak Topics to Modules


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T401 — Map Weak Questions to Revision Items


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T402 — Create Revision Input


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T403 — Create Practice Recommendation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T404 — Create Next Learning Recommendation


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T405 — Avoid Generic “Study More” Recommendation


**Execution:** Execute this task against the current repository in the context of Workstream AM — Feedback-to-Learning Loop, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T406 — Provide Direct Recovery Path


**Execution:** Execute this task against the current repository in the context of Workstream AM — Feedback-to-Learning Loop, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AN — Interview History

## P10-T407 — Define Interview History Route


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T408 — List Completed Interviews


**Execution:** Execute this task against the current repository in the context of Workstream AN — Interview History, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T409 — List Incomplete Interviews Separately


**Execution:** Execute this task against the current repository in the context of Workstream AN — Interview History, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T410 — Show Interview Type


**Execution:** Execute this task against the current repository in the context of Workstream AN — Interview History, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T411 — Show Interview Date


**Execution:** Execute this task against the current repository in the context of Workstream AN — Interview History, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T412 — Show Scope


**Execution:** Execute this task against the current repository in the context of Workstream AN — Interview History, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T413 — Show Summary Outcome


**Execution:** Execute this task against the current repository in the context of Workstream AN — Interview History, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T414 — Link to Detailed Results


**Execution:** Execute this task against the current repository in the context of Workstream AN — Interview History, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T415 — Avoid Dense Table on Mobile


**Execution:** Execute this task against the current repository in the context of Workstream AN — Interview History, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AO — Interview Comparison

## P10-T416 — Define Whether Comparison Is Product-Useful


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T417 — Compare Same-Domain Interviews Carefully


**Execution:** Execute this task against the current repository in the context of Workstream AO — Interview Comparison, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T418 — Compare Dimension Trends


**Execution:** Execute this task against the current repository in the context of Workstream AO — Interview Comparison, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T419 — Compare Repeated Topic Performance


**Execution:** Execute this task against the current repository in the context of Workstream AO — Interview Comparison, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T420 — Avoid Comparing Incompatible Interview Types


**Execution:** Execute this task against the current repository in the context of Workstream AO — Interview Comparison, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T421 — Avoid False Trend Claims from Insufficient Data


**Execution:** Execute this task against the current repository in the context of Workstream AO — Interview Comparison, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T422 — Require Minimum Evidence for Trend


**Execution:** Execute this task against the current repository in the context of Workstream AO — Interview Comparison, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AP — Interview Readiness Integration

## P10-T423 — Feed Mock Interview Evidence into Readiness Model


**Execution:** Execute this task against the current repository in the context of Workstream AP — Interview Readiness Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T424 — Keep Mock Performance Separate from Content Coverage


**Execution:** Execute this task against the current repository in the context of Workstream AP — Interview Readiness Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T425 — Keep Mock Performance Separate from Self-Assessment


**Execution:** Execute this task against the current repository in the context of Workstream AP — Interview Readiness Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T426 — Define Interview Performance Signal


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T427 — Define Evidence Window


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T428 — Weight Recent Relevant Interviews Carefully


**Execution:** Execute this task against the current repository in the context of Workstream AP — Interview Readiness Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T429 — Avoid Universal Readiness Percentage Without Validation


**Execution:** Execute this task against the current repository in the context of Workstream AP — Interview Readiness Integration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AQ — Behavioural Interview Foundation

## P10-T430 — Define Behavioural Question Model


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T431 — Define Competency Categories


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T432 — Define STAR Structure Evaluation


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T433 — Evaluate Situation Clarity


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Behavioural Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T434 — Evaluate Task Clarity


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Behavioural Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T435 — Evaluate Action Ownership


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Behavioural Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T436 — Evaluate Result Specificity


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Behavioural Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T437 — Avoid Evaluating Personality


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Behavioural Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T438 — Avoid Protected Trait Inference


**Execution:** Execute this task against the current repository in the context of Workstream AQ — Behavioural Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AR — Management Consulting Interview Foundation

## P10-T439 — Define Consulting Interview Mode Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T440 — Separate Case Interview from Standard Q&A Interview


**Execution:** Execute this task against the current repository in the context of Workstream AR — Management Consulting Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T441 — Define Case Interview Session Model


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T442 — Define Case Prompt


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T443 — Define Clarifying Questions Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T444 — Define Structure Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T445 — Define Analysis Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T446 — Define Recommendation Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T447 — Avoid Forcing Case Interviews into Standard Question Engine


**Execution:** Execute this task against the current repository in the context of Workstream AR — Management Consulting Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AS — Coding Interview Foundation

## P10-T448 — Define Coding Interview Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T449 — Define Coding Question Type


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T450 — Define Code Answer Mode


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T451 — Define Supported Languages


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T452 — Define Code Execution Isolation Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T453 — Never Execute Untrusted Code in Main Application Runtime


**Execution:** Execute this task against the current repository in the context of Workstream AS — Coding Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T454 — Define Future Sandbox Architecture


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T455 — Keep Coding Runtime Separate from Standard Text Evaluation


**Execution:** Execute this task against the current repository in the context of Workstream AS — Coding Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AT — System Design Interview Foundation

## P10-T456 — Define System Design Interview Type


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T457 — Define Requirement Clarification Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T458 — Define High-Level Design Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T459 — Define Deep-Dive Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T460 — Define Trade-Off Discussion Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T461 — Define Scaling Discussion Stage


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T462 — Avoid Evaluating System Design as Simple Keyword Matching


**Execution:** Execute this task against the current repository in the context of Workstream AT — System Design Interview Foundation, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AU — Interview Engine Extensibility

## P10-T463 — Define Shared Interview Session Core


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T464 — Define Interview-Type Adapter


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T465 — Define Question Provider Interface


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T466 — Define Answer Capture Adapter


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T467 — Define Evaluation Adapter


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T468 — Define Feedback Adapter


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T469 — Avoid One Giant Interview Service


**Execution:** Execute this task against the current repository in the context of Workstream AU — Interview Engine Extensibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T470 — Avoid Separate Full Architecture per Interview Type


**Execution:** Execute this task against the current repository in the context of Workstream AU — Interview Engine Extensibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AV — Backend Interview API

## P10-T471 — Define Create Interview Endpoint


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T472 — Define Start Interview Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T473 — Define Current Interview State Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T474 — Define Submit Answer Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T475 — Define Next Question Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T476 — Define Complete Interview Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T477 — Define Interview Results Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T478 — Define Interview History Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T479 — Define Audio Upload Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T480 — Define Evaluation Status Endpoint


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream AW — API Contract Quality

## P10-T481 — Use Explicit Request Schemas


**Execution:** Execute this task against the current repository in the context of Workstream AW — API Contract Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T482 — Use Explicit Response Schemas


**Execution:** Execute this task against the current repository in the context of Workstream AW — API Contract Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T483 — Define Stable Error Codes


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T484 — Define Idempotency Requirements


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T485 — Prevent Client-Controlled Session Ownership


**Execution:** Execute this task against the current repository in the context of Workstream AW — API Contract Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T486 — Prevent Client-Controlled Evaluation Results


**Execution:** Execute this task against the current repository in the context of Workstream AW — API Contract Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T487 — Prevent Client-Controlled Question Order


**Execution:** Execute this task against the current repository in the context of Workstream AW — API Contract Quality, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T488 — Validate Every Session Transition Server-Side


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream AX — Interview Security

## P10-T489 — Require Authentication for Personal Mock Interviews


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T490 — Resolve User from Session


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T491 — Enforce Interview Ownership


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T492 — Enforce Answer Ownership


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T493 — Enforce Audio Ownership


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T494 — Enforce Transcript Ownership


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T495 — Enforce Evaluation Ownership


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T496 — Prevent Cross-User Interview Access


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T497 — Rate Limit Interview Creation


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T498 — Rate Limit Evaluation Requests


**Execution:** Execute this task against the current repository in the context of Workstream AX — Interview Security, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AY — Prompt Injection Protection

## P10-T499 — Treat User Answer as Untrusted Data


**Execution:** Execute this task against the current repository in the context of Workstream AY — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T500 — Delimit User Answer Clearly


**Execution:** Execute this task against the current repository in the context of Workstream AY — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T501 — Prevent Answer Text from Overriding Evaluation Instructions


**Execution:** Execute this task against the current repository in the context of Workstream AY — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T502 — Validate Structured Evaluation Output


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T503 — Reject Unexpected Tool Instructions


**Execution:** Execute this task against the current repository in the context of Workstream AY — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T504 — Avoid Exposing Internal Prompts


**Execution:** Execute this task against the current repository in the context of Workstream AY — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T505 — Avoid Returning Provider Debug Information


**Execution:** Execute this task against the current repository in the context of Workstream AY — Prompt Injection Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream AZ — Abuse and Cost Protection

## P10-T506 — Define Interview Usage Limits


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T507 — Define Evaluation Usage Limits


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T508 — Define Voice Duration Limits


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T509 — Define Concurrent Interview Limits


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T510 — Prevent Automated Interview Generation Abuse


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Abuse and Cost Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T511 — Prevent Repeated Evaluation Spam


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Abuse and Cost Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T512 — Track Cost by Interview


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Abuse and Cost Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T513 — Track Cost by User


**Execution:** Execute this task against the current repository in the context of Workstream AZ — Abuse and Cost Protection, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T514 — Define Cost Alerts


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

# Workstream BA — Evaluation Failure Handling

## P10-T515 — Define Provider Timeout State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T516 — Define Provider Error State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T517 — Define Invalid Output State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T518 — Define Partial Evaluation State


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T519 — Preserve User Answer on Failure


**Execution:** Execute this task against the current repository in the context of Workstream BA — Evaluation Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T520 — Allow Safe Retry


**Execution:** Execute this task against the current repository in the context of Workstream BA — Evaluation Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T521 — Prevent Duplicate Charges Where Possible


**Execution:** Execute this task against the current repository in the context of Workstream BA — Evaluation Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T522 — Avoid Blocking Entire Interview History Due to One Failed Evaluation


**Execution:** Execute this task against the current repository in the context of Workstream BA — Evaluation Failure Handling, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BB — Interview Resume and Recovery

## P10-T523 — Define Recoverable Session States


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T524 — Persist Current Question


**Execution:** Execute this task against the current repository in the context of Workstream BB — Interview Resume and Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T525 — Persist Submitted Answers


**Execution:** Execute this task against the current repository in the context of Workstream BB — Interview Resume and Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T526 — Preserve Question Order


**Execution:** Execute this task against the current repository in the context of Workstream BB — Interview Resume and Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T527 — Restore Interview Runtime Safely


**Execution:** Execute this task against the current repository in the context of Workstream BB — Interview Resume and Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T528 — Prevent Re-Answering Submitted Question Accidentally


**Execution:** Execute this task against the current repository in the context of Workstream BB — Interview Resume and Recovery, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T529 — Define Session Expiration


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T530 — Define Abandonment Rules


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

# Workstream BC — Interview Timer Architecture

## P10-T531 — Define Whether Session Timer Is Required


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T532 — Define Question Timer Boundary


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T533 — Keep Server as Time Authority Where Required


**Execution:** Execute this task against the current repository in the context of Workstream BC — Interview Timer Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T534 — Prevent Client Refresh from Resetting Timer


**Execution:** Execute this task against the current repository in the context of Workstream BC — Interview Timer Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T535 — Define Timer Expiry Behaviour


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P1

---

## P10-T536 — Avoid Artificial Time Pressure in Beginner Modes


**Execution:** Execute this task against the current repository in the context of Workstream BC — Interview Timer Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T537 — Make Timing Mode Explicit


**Execution:** Execute this task against the current repository in the context of Workstream BC — Interview Timer Architecture, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BD — Interview Accessibility

## P10-T538 — Ensure Keyboard Navigation


**Execution:** Execute this task against the current repository in the context of Workstream BD — Interview Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T539 — Ensure Focus Management Between Questions


**Execution:** Execute this task against the current repository in the context of Workstream BD — Interview Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T540 — Ensure Recording Controls Are Accessible


**Execution:** Execute this task against the current repository in the context of Workstream BD — Interview Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T541 — Ensure Timer Is Accessible


**Execution:** Execute this task against the current repository in the context of Workstream BD — Interview Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T542 — Ensure Progress Is Not Colour-Only


**Execution:** Execute this task against the current repository in the context of Workstream BD — Interview Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T543 — Ensure Evaluation Results Have Semantic Structure


**Execution:** Execute this task against the current repository in the context of Workstream BD — Interview Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T544 — Ensure Long Feedback Is Readable


**Execution:** Execute this task against the current repository in the context of Workstream BD — Interview Accessibility, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T545 — Support Reduced Motion


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

# Workstream BE — Mobile Interview Experience

## P10-T546 — Define Mobile Interview Runtime


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T547 — Keep Question Readable


**Execution:** Execute this task against the current repository in the context of Workstream BE — Mobile Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T548 — Keep Answer Controls Reachable


**Execution:** Execute this task against the current repository in the context of Workstream BE — Mobile Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T549 — Handle Mobile Keyboard Correctly


**Execution:** Execute this task against the current repository in the context of Workstream BE — Mobile Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T550 — Handle Mobile Voice Recording


**Execution:** Execute this task against the current repository in the context of Workstream BE — Mobile Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T551 — Handle Browser Backgrounding


**Execution:** Execute this task against the current repository in the context of Workstream BE — Mobile Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T552 — Prevent Accidental Session Loss


**Execution:** Execute this task against the current repository in the context of Workstream BE — Mobile Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T553 — Test Small Viewports


**Execution:** Execute this task against the current repository in the context of Workstream BE — Mobile Interview Experience, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BF — Interview Performance

## P10-T554 — Define Interview Runtime Performance Budget


**Execution:** Turn this requirement into one explicit V2 rule and encode it in the repository location that will enforce or guide it; do not leave the result as an abstract recommendation. Update the affected shared architecture or implementation entry points so later tasks have one unambiguous convention to follow, with existing exceptions recorded for migration.

**Priority:** P0

---

## P10-T555 — Keep Question Transition Fast


**Execution:** Execute this task against the current repository in the context of Workstream BF — Interview Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T556 — Avoid Loading Full Interview Results During Runtime


**Execution:** Execute this task against the current repository in the context of Workstream BF — Interview Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T557 — Avoid Loading Canonical Answers Before Required


**Execution:** Execute this task against the current repository in the context of Workstream BF — Interview Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T558 — Lazy Load Voice Infrastructure


**Execution:** Execute this task against the current repository in the context of Workstream BF — Interview Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T559 — Lazy Load Results Visualizations


**Execution:** Execute this task against the current repository in the context of Workstream BF — Interview Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T560 — Avoid Heavy Animation Libraries


**Execution:** Execute this task against the current repository in the context of Workstream BF — Interview Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T561 — Measure Audio Upload Performance


**Execution:** Execute this task against the current repository in the context of Workstream BF — Interview Performance, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BG — Private Route SEO

## P10-T562 — Noindex Interview Runtime


**Execution:** Execute this task against the current repository in the context of Workstream BG — Private Route SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T563 — Noindex Interview Results


**Execution:** Execute this task against the current repository in the context of Workstream BG — Private Route SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T564 — Noindex Interview History


**Execution:** Execute this task against the current repository in the context of Workstream BG — Private Route SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T565 — Noindex Audio Resources


**Execution:** Execute this task against the current repository in the context of Workstream BG — Private Route SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T566 — Exclude Interview Sessions from Sitemap


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T567 — Prevent User Answers from Appearing in Metadata


**Execution:** Execute this task against the current repository in the context of Workstream BG — Private Route SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T568 — Prevent Session IDs from Creating Crawlable URL Space


**Execution:** Execute this task against the current repository in the context of Workstream BG — Private Route SEO, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BH — Analytics

## P10-T569 — Track Interview Creation


**Execution:** Execute this task against the current repository in the context of Workstream BH — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T570 — Track Interview Start


**Execution:** Execute this task against the current repository in the context of Workstream BH — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T571 — Track Interview Completion


**Execution:** Execute this task against the current repository in the context of Workstream BH — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T572 — Track Interview Abandonment


**Execution:** Execute this task against the current repository in the context of Workstream BH — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T573 — Track Answer Submission


**Execution:** Execute this task against the current repository in the context of Workstream BH — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T574 — Track Voice Mode Usage


**Execution:** Execute this task against the current repository in the context of Workstream BH — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P2

---

## P10-T575 — Track Evaluation Completion


**Execution:** Execute this task against the current repository in the context of Workstream BH — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T576 — Track Feedback Review


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P2

---

## P10-T577 — Track Recommended Learning Action


**Execution:** Execute this task against the current repository in the context of Workstream BH — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T578 — Protect Answer Privacy in Analytics


**Execution:** Execute this task against the current repository in the context of Workstream BH — Analytics, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BI — Observability

## P10-T579 — Log Interview Lifecycle Events


**Execution:** Execute this task against the current repository in the context of Workstream BI — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T580 — Log State Transition Failures


**Execution:** Execute this task against the current repository in the context of Workstream BI — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T581 — Log Question Selection Failures


**Execution:** Execute this task against the current repository in the context of Workstream BI — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T582 — Log Audio Upload Failures


**Execution:** Execute this task against the current repository in the context of Workstream BI — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T583 — Log Transcription Failures


**Execution:** Execute this task against the current repository in the context of Workstream BI — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T584 — Log Evaluation Failures


**Execution:** Execute this task against the current repository in the context of Workstream BI — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T585 — Track Evaluation Latency


**Execution:** Execute this task against the current repository in the context of Workstream BI — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T586 — Track Evaluation Cost


**Execution:** Execute this task against the current repository in the context of Workstream BI — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T587 — Protect Sensitive User Content in Logs


**Execution:** Execute this task against the current repository in the context of Workstream BI — Observability, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BJ — Root-Level UI Fixes

## P10-T588 — Build Shared Interview Runtime Shell


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T589 — Build Shared Question Presentation Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T590 — Build Shared Answer Capture Contract


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T591 — Build Shared Interview Progress Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T592 — Build Shared Results Section Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T593 — Build Shared Evaluation Dimension Primitive


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T594 — Fix Shared Components Before Individual Interview Types


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Root-Level UI Fixes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T595 — Avoid One-Off Interview Layouts


**Execution:** Execute this task against the current repository in the context of Workstream BJ — Root-Level UI Fixes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BK — Root-Level Backend Fixes

## P10-T596 — Centralize Session State Machine


**Execution:** Execute this task against the current repository in the context of Workstream BK — Root-Level Backend Fixes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T597 — Centralize Question Selection


**Execution:** Execute this task against the current repository in the context of Workstream BK — Root-Level Backend Fixes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T598 — Centralize Answer Persistence


**Execution:** Execute this task against the current repository in the context of Workstream BK — Root-Level Backend Fixes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T599 — Centralize Evaluation Orchestration


**Execution:** Execute this task against the current repository in the context of Workstream BK — Root-Level Backend Fixes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T600 — Centralize Feedback Mapping


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T601 — Centralize Weakness Generation


**Execution:** Execute this task against the current repository in the context of Workstream BK — Root-Level Backend Fixes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T602 — Avoid Interview Logic Duplication Across Routes


**Execution:** Execute this task against the current repository in the context of Workstream BK — Root-Level Backend Fixes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T603 — Avoid Business Logic in UI


**Execution:** Execute this task against the current repository in the context of Workstream BK — Root-Level Backend Fixes, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BL — Interview Acceptance Scenarios

## P10-T604 — User Creates Quick Mock Interview


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T605 — User Creates Standard Mock Interview


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T606 — User Creates Topic Mock Interview


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T607 — Interview Questions Match Scope


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T608 — Question Order Remains Stable


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T609 — User Submits Text Answer


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T610 — User Submits Voice Answer


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T611 — User Refreshes Mid-Interview


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T612 — User Loses Network Mid-Answer


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T613 — User Completes Interview


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T614 — Evaluation Is Generated


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T615 — Evaluation Fails and Retries Safely


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T616 — Feedback Links to Canonical Learning Content


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T617 — Weakness Feeds Revision System


**Execution:** Execute this task against the current repository in the context of Workstream BL — Interview Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BM — Voice Acceptance Scenarios

## P10-T618 — User Grants Microphone Permission


**Execution:** Execute this task against the current repository in the context of Workstream BM — Voice Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T619 — User Denies Microphone Permission


**Execution:** Execute this task against the current repository in the context of Workstream BM — Voice Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T620 — Recording Starts


**Execution:** Execute this task against the current repository in the context of Workstream BM — Voice Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T621 — Recording Stops


**Execution:** Execute this task against the current repository in the context of Workstream BM — Voice Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T622 — Audio Uploads Successfully


**Execution:** Execute this task against the current repository in the context of Workstream BM — Voice Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T623 — Audio Upload Fails


**Execution:** Execute this task against the current repository in the context of Workstream BM — Voice Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T624 — Transcription Completes


**Execution:** Execute this task against the current repository in the context of Workstream BM — Voice Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T625 — Transcription Fails


**Execution:** Execute this task against the current repository in the context of Workstream BM — Voice Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T626 — Evaluation Uses Transcript


**Execution:** Execute this task against the current repository in the context of Workstream BM — Voice Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T627 — User Deletes Audio


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream BN — Evaluation Acceptance Scenarios

## P10-T628 — Strong Answer Receives Strong Evaluation


**Execution:** Execute this task against the current repository in the context of Workstream BN — Evaluation Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T629 — Incorrect Answer Is Not Rewarded for Verbosity


**Execution:** Execute this task against the current repository in the context of Workstream BN — Evaluation Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T630 — Short Correct Answer Is Not Automatically Penalized


**Execution:** Execute this task against the current repository in the context of Workstream BN — Evaluation Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T631 — Off-Topic Answer Is Identified


**Execution:** Execute this task against the current repository in the context of Workstream BN — Evaluation Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T632 — Missing Concepts Are Identified


**Execution:** Execute this task against the current repository in the context of Workstream BN — Evaluation Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T633 — Incorrect Claims Are Identified


**Execution:** Execute this task against the current repository in the context of Workstream BN — Evaluation Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T634 — Improvement Guidance Is Actionable


**Execution:** Measure or inspect the current problem first, change the root shared cause rather than applying isolated patches, and apply the improvement to the affected page or feature family. Compare the resulting behavior against the current baseline and record any remaining exceptions or regressions that need a later task.

**Priority:** P0

---

## P10-T635 — Prompt Injection Attempt Does Not Override Evaluation


**Execution:** Execute this task against the current repository in the context of Workstream BN — Evaluation Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T636 — Invalid Model Output Is Rejected


**Execution:** Execute this task against the current repository in the context of Workstream BN — Evaluation Acceptance Scenarios, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BO — Evaluation Benchmarking

## P10-T637 — Build Gold Evaluation Dataset


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T638 — Define Human-Reviewed Expected Outcomes


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T639 — Run Evaluation Benchmark Before Model Change


**Execution:** Execute this task against the current repository in the context of Workstream BO — Evaluation Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T640 — Compare New Evaluation Version


**Execution:** Execute this task against the current repository in the context of Workstream BO — Evaluation Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T641 — Detect Regression


**Execution:** Execute this task against the current repository in the context of Workstream BO — Evaluation Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T642 — Block Severe Evaluation Regression


**Execution:** Execute this task against the current repository in the context of Workstream BO — Evaluation Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T643 — Record Benchmark Results


**Execution:** Execute this task against the current repository in the context of Workstream BO — Evaluation Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T644 — Version Benchmark Dataset


**Execution:** Execute this task against the current repository in the context of Workstream BO — Evaluation Benchmarking, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Workstream BP — Interview Engine Regression Coverage

## P10-T645 — Add Session State Machine Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T646 — Add Interview Creation Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T647 — Add Question Selection Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T648 — Add Question Distribution Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T649 — Add Answer Submission Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T650 — Add Interview Resume Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T651 — Add Interview Completion Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T652 — Add Evaluation Job Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T653 — Add Evaluation Schema Validation Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T654 — Add Weakness Mapping Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T655 — Add Revision Integration Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

## P10-T656 — Add Authorization Coverage


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P0

---

# Workstream BQ — Legacy Interview Migration

## P10-T657 — Inventory Existing Interview Session Data


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T658 — Determine Migration Eligibility


**Execution:** Execute this task against the current repository in the context of Workstream BQ — Legacy Interview Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T659 — Map Existing Session States


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T660 — Map Existing Answers


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T661 — Map Existing Evaluation Results


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T662 — Preserve Valid Historical Data


**Execution:** Execute this task against the current repository in the context of Workstream BQ — Legacy Interview Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T663 — Mark Unsupported Legacy Evaluation Versions


**Execution:** Execute this task against the current repository in the context of Workstream BQ — Legacy Interview Migration, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T664 — Document Migration Exceptions


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

# Workstream BR — Legacy Interview Cleanup

## P10-T665 — Remove Duplicate Interview Engines


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P10-T666 — Remove Random Question Logic


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P10-T667 — Remove Hardcoded Interview Questions


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P10-T668 — Remove Dead Prompt Templates


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P10-T669 — Remove Unsupported Scoring Logic


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P10-T670 — Remove Dead Audio Code


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P10-T671 — Remove Duplicate Evaluation Paths


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

## P10-T672 — Remove Client-Side Interview Business Logic


**Execution:** Locate every active instance covered by this task, trace its consumers first, then remove only the confirmed obsolete or conflicting implementation and update affected references. Run the relevant build, route, visual, or feature checks so the cleanup leaves no broken imports, hidden fallback dependency, or replacement gap.

**Priority:** P0

---

# Workstream BS — Phase Completion

## P10-T673 — Freeze Mock Interview Product Definition


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T674 — Freeze Interview Mode Contract


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T675 — Freeze Interview Configuration Contract


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T676 — Freeze Interview Session State Machine


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T677 — Freeze Question Instance Contract


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T678 — Freeze Question Selection Engine


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T679 — Freeze Interview Blueprint Contract


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T680 — Freeze Answer Capture Contract


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T681 — Freeze Voice Capture Architecture


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T682 — Freeze Transcription Boundary


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T683 — Freeze Evaluation Rubric Contract


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T684 — Freeze Evaluation Provider Interface


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T685 — Freeze Structured Evaluation Schema


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T686 — Freeze Feedback Architecture


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T687 — Freeze Weakness Evidence Contract


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T688 — Freeze Feedback-to-Learning Integration


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T689 — Freeze Interview Security Model


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T690 — Freeze Evaluation Cost Budgets


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T691 — Publish Interview Architecture Map


**Execution:** Inspect the actual repository implementation for this scope, record concrete files, routes, components, APIs, or data paths found, and classify each finding by the action it requires. Write the result into the phase’s existing audit, tracker, or task artifact and create follow-up issues for unresolved findings instead of leaving generic observations.

**Priority:** P0

---

## P10-T692 — Publish Interview Session State Diagram


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T693 — Publish Question Selection Flow


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T694 — Publish Voice Processing Flow


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T695 — Publish Evaluation Pipeline


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T696 — Publish Feedback-to-Learning Flow


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

## P10-T697 — Update V2 Technical Implementation Plan


**Execution:** Implement this in the shared layer that owns the responsibility, using the existing V2 architecture and the task requirements below rather than adding a route-specific workaround. Migrate the immediately affected consumers, cover responsive/theme/state behavior where relevant, and verify the resulting implementation through the appropriate build and regression checks.

**Priority:** P1

---

## P10-T698 — Update V2 Decision Log


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T699 — Update V2 Issue Log


**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P1

---

## P10-T700 — Produce Phase 10 Completion Report

Document:

* current interview audit,
* mock interview product model,
* interview modes,
* configuration,
* session architecture,
* state machine,
* question selection,
* interview blueprints,
* follow-up architecture,
* runtime UI,
* text answer capture,
* voice answer capture,
* audio lifecycle,
* transcription,
* evaluation philosophy,
* evaluation dimensions,
* question rubrics,
* structured evaluation,
* AI provider boundary,
* evaluation reliability,
* evaluation cost,
* asynchronous processing,
* question feedback,
* interview feedback,
* weakness identification,
* learning integration,
* interview history,
* behavioural interview foundation,
* consulting interview foundation,
* coding interview foundation,
* system design foundation,
* security,
* privacy,
* performance,
* accessibility,
* migration,
* legacy cleanup.

**Execution:** Execute this task against the current repository in the context of Workstream BS — Phase Completion, using the existing requirement below as the scope and changing the owning shared implementation rather than adding an isolated workaround. Apply this specifically to: Document: current interview audit, mock interview product model, interview modes, configuration, session architecture, state machine, question selection, interview blueprints, follow-up architecture, runtime UI, text answer capture, voice answer capture, audio lifecycle, transcription, evaluation philosophy, evaluation dimensions, question rubrics, structured evaluation, AI provider boundary, evaluation reliability, Verify the affected routes, components, APIs, or workflows and record any unresolved dependency or exception in the existing V2 execution logs.

**Priority:** P0

---

# Phase 10 Exit Criteria

Phase 10 is complete when Interview Explainer has:

* one canonical mock interview engine,
* a defined interview session state machine,
* deterministic interview configuration,
* role-aware question selection,
* experience-aware question selection,
* interview blueprints,
* stable question ordering,
* text answer capture,
* voice answer capture,
* secure audio handling,
* transcription architecture,
* structured evaluation rubrics,
* versioned AI evaluation,
* evidence-based feedback,
* question-level feedback,
* interview-level feedback,
* weakness identification,
* direct feedback-to-learning integration,
* revision integration,
* interview history,
* session recovery,
* evaluation benchmarking,
* evaluation cost controls,
* secure private interview data,
* mobile interview support,
* accessible interview runtime,
* extensibility for behavioural interviews,
* extensibility for consulting interviews,
* extensibility for coding interviews,
* extensibility for system design interviews.

---

# Phase 10 Core Principle

```text
DO NOT BUILD:

QUESTION
   ↓
SEND TO AI
   ↓
GET SCORE
```

Build:

```text
PREPARATION CONTEXT
        ↓
INTERVIEW BLUEPRINT
        ↓
CONTROLLED QUESTION SELECTION
        ↓
STATEFUL INTERVIEW SESSION
        ↓
ANSWER CAPTURE
        ↓
QUESTION-SPECIFIC RUBRIC
        ↓
STRUCTURED EVALUATION
        ↓
EVIDENCE-BASED FEEDBACK
        ↓
WEAKNESS MAPPING
        ↓
TARGETED LEARNING
```

---

# Canonical Interview Lifecycle

```text
USER
  ↓
SELECTS MOCK INTERVIEW
  ↓
SYSTEM LOADS PREPARATION CONTEXT
  ↓
INTERVIEW CONFIGURATION
  ↓
INTERVIEW BLUEPRINT SELECTED
  ↓
QUESTION SET GENERATED
  ↓
SESSION CREATED
  ↓
INTERVIEW STARTS
  ↓
QUESTION 1
  ↓
ANSWER
  ↓
QUESTION 2
  ↓
ANSWER
  ↓
...
  ↓
INTERVIEW COMPLETED
  ↓
EVALUATION JOBS
  ↓
QUESTION-LEVEL RESULTS
  ↓
INTERVIEW-LEVEL SUMMARY
  ↓
WEAKNESSES IDENTIFIED
  ↓
REVISION + PRACTICE + LEARNING ACTIONS
```

---

# Evaluation Architecture

The evaluation system should not ask:

```text
HOW GOOD IS THIS ANSWER
FROM 0 TO 100?
```

It should ask:

```text
DID THE ANSWER ADDRESS
THE ACTUAL QUESTION?

WERE THE REQUIRED CONCEPTS PRESENT?

WERE ANY CLAIMS INCORRECT?

WHAT IMPORTANT CONCEPTS WERE MISSING?

WAS THE EXPLANATION CLEAR?

WAS THE DEPTH APPROPRIATE
FOR THE USER'S EXPERIENCE LEVEL?

WHAT SHOULD THE USER IMPROVE NEXT?
```

Example structured output:

```text
CORRECTNESS
solid

COMPLETENESS
developing

CLARITY
strong

DEPTH
developing

WHAT WAS DONE WELL
- Correctly explained dependency injection
- Distinguished constructor injection

MISSING
- Bean lifecycle implications
- Testing advantages

INCORRECT
- No major factual errors

NEXT STEP
Review constructor injection and bean lifecycle,
then retry a focused Spring interview.
```

---

# Root-Level Product Rules

If interview questions feel random:

```text
DO NOT
ADD A BETTER RANDOMIZER
```

Fix:

```text
INTERVIEW BLUEPRINT
+
QUESTION TAXONOMY
+
DIFFICULTY DISTRIBUTION
+
EXPERIENCE LEVEL
+
RECENT QUESTION HISTORY
```

If evaluation feels unreliable:

```text
DO NOT
JUST CHANGE THE PROMPT
```

Fix:

```text
QUESTION RUBRIC
+
STRUCTURED SCHEMA
+
BENCHMARK DATASET
+
VERSIONING
+
REGRESSION EVALUATION
```

If feedback is generic:

```text
DO NOT
ASK THE MODEL TO BE MORE DETAILED
```

Fix:

```text
REQUIRED CONCEPTS
+
MISSING CONCEPTS
+
INCORRECT CLAIMS
+
CANONICAL CONTENT MAPPING
+
ACTIONABLE NEXT STEPS
```

If mock interviews become expensive:

```text
DO NOT
REMOVE FEEDBACK QUALITY RANDOMLY
```

Fix:

```text
MODEL ROUTING
+
PROMPT SIZE
+
CACHING
+
ASYNC EVALUATION
+
CALL COUNT
+
QUESTION RUBRICS
+
EVALUATION BUDGETS
```

---

# Relationship with Previous Phases

```text
CONTENT ARCHITECTURE
        ↓
Defines interview knowledge

QUESTION EXPERIENCE
        ↓
Defines canonical questions

SEARCH
        ↓
Enables discovery

USER FOUNDATION
        ↓
Persists identity and progress

DASHBOARD + PRACTICE
        ↓
Creates preparation continuity

MOCK INTERVIEW ENGINE
        ↓
MEASURES PERFORMANCE
UNDER INTERVIEW CONDITIONS
```

---

# What Phase 10 Deliberately Does Not Fully Build

Phase 10 creates foundations for several advanced interview systems, but should not allow the phase to become unlimited.

The following can be architecturally supported without requiring complete implementation:

```text
LIVE HUMAN INTERVIEW MARKETPLACE
REAL-TIME HUMAN INTERVIEWER MATCHING
LIVE INTERVIEW ASSISTANCE
VIDEO BODY-LANGUAGE ANALYSIS
FULL CODE EXECUTION PLATFORM
FULL COLLABORATIVE WHITEBOARD
FULL MCKINSEY-STYLE CASE SIMULATOR
FULL SYSTEM DESIGN CANVAS
JOB-SPECIFIC INTERVIEW GENERATION
RECRUITER PLATFORM
EMPLOYER ASSESSMENT PLATFORM
```

Those require separate focused phases.

---

# Recommended Implementation Order

```text
1. AUDIT CURRENT INTERVIEW SYSTEM
        ↓
2. FREEZE MOCK INTERVIEW PRODUCT MODEL
        ↓
3. BUILD INTERVIEW SESSION STATE MACHINE
        ↓
4. BUILD INTERVIEW BLUEPRINT MODEL
        ↓
5. BUILD QUESTION SELECTION ENGINE
        ↓
6. BUILD TEXT INTERVIEW RUNTIME
        ↓
7. BUILD ANSWER PERSISTENCE
        ↓
8. BUILD QUESTION-SPECIFIC RUBRICS
        ↓
9. BUILD STRUCTURED EVALUATION PIPELINE
        ↓
10. BUILD EVALUATION BENCHMARKS
        ↓
11. BUILD QUESTION FEEDBACK
        ↓
12. BUILD INTERVIEW SUMMARY
        ↓
13. CONNECT FEEDBACK TO LEARNING
        ↓
14. BUILD VOICE CAPTURE
        ↓
15. BUILD TRANSCRIPTION PIPELINE
        ↓
16. ADD INTERVIEW HISTORY
        ↓
17. SECURITY + PRIVACY + COST CONTROL
        ↓
18. MOBILE + ACCESSIBILITY
        ↓
19. MIGRATE VALID LEGACY DATA
        ↓
20. REMOVE LEGACY INTERVIEW SYSTEMS
```

---

# Recommended Phase 10 Directory

```text
docs/v2/tasks/PHASE_10/
│
├── README.md
├── 00_PHASE_OVERVIEW.md
├── 01_CURRENT_INTERVIEW_AUDIT.md
├── 02_MOCK_INTERVIEW_PRODUCT_MODEL.md
├── 03_INTERVIEW_MODES.md
├── 04_INTERVIEW_SESSION_STATE_MACHINE.md
├── 05_INTERVIEW_BLUEPRINTS.md
├── 06_QUESTION_SELECTION_ENGINE.md
├── 07_INTERVIEW_RUNTIME_UI.md
├── 08_ANSWER_CAPTURE.md
├── 09_VOICE_AND_TRANSCRIPTION.md
├── 10_EVALUATION_ARCHITECTURE.md
├── 11_EVALUATION_RUBRICS.md
├── 12_EVALUATION_RELIABILITY.md
├── 13_FEEDBACK_SYSTEM.md
├── 14_WEAKNESS_AND_LEARNING_LOOP.md
├── 15_INTERVIEW_HISTORY.md
├── 16_ADVANCED_INTERVIEW_FOUNDATIONS.md
├── 17_SECURITY_PRIVACY_COST.md
├── 18_PERFORMANCE_ACCESSIBILITY.md
├── 19_LEGACY_MIGRATION_CLEANUP.md
└── 20_COMPLETION_REPORT.md
```

---

# Phase 10 Summary

```text
700 TASKS

PRIMARY FOCUS:

MOCK INTERVIEWS
INTERVIEW SESSION ENGINE
INTERVIEW STATE MACHINE
INTERVIEW BLUEPRINTS
QUESTION SELECTION
TEXT ANSWERS
VOICE ANSWERS
AUDIO PROCESSING
TRANSCRIPTION
QUESTION RUBRICS
AI EVALUATION
STRUCTURED FEEDBACK
EVALUATION RELIABILITY
EVALUATION COST
WEAKNESS IDENTIFICATION
LEARNING LOOP
INTERVIEW HISTORY
BEHAVIOURAL INTERVIEW FOUNDATION
CONSULTING INTERVIEW FOUNDATION
CODING INTERVIEW FOUNDATION
SYSTEM DESIGN FOUNDATION
SECURITY
PRIVACY
PERFORMANCE
LEGACY CLEANUP
```

---

# Next Phase

```text
PHASE 11

RESUME INTELLIGENCE,
RESUME ANALYSIS,
JOB DESCRIPTION MATCHING,
SKILL-GAP ANALYSIS
&
INTERVIEW PREPARATION BRIDGE
```

The next major system should connect:

```text
USER'S ACTUAL EXPERIENCE
        +
RESUME
        +
TARGET JOB
        ↓
PERSONALIZED PREPARATION CONTEXT
```

That creates the bridge from generic preparation to:

```text
THIS IS YOUR RESUME.

THIS IS THE JOB YOU WANT.

THESE ARE THE QUESTIONS
YOU ARE LIKELY TO NEED
TO PREPARE FOR.

THESE ARE THE GAPS
YOU SHOULD WORK ON.

AND THIS IS HOW
INTERVIEW EXPLAINER
CAN HELP YOU PREPARE.
```
