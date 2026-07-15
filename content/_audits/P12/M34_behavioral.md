# Audit — behavioral

**Pillar:** P12 Interview Readiness
**Module:** M34 behavioral
**Topics present:** 6 (of 7 — `agile-and-scrum` has 0 questions)
**Questions:** 12 (all written, no stubs)
**Benchmark sources:** Themuse ("STAR Method", "Common Behavioral Questions"), Levels.fyi guides, Big Interview, Lewis C. Lin "Decode and Conquer", Google interview prep materials, published staff-engineer memoirs (Will Larson, Tanya Reilly)

---

## Auditor calibration note

**Important:** the v3 structural auditor flags `zone3_no_code_examples` on all 12 behavioral questions. This is a **false positive for this archetype** — behavioral questions should not have code, and the sampled Q1 (`debug-complex-production-issue`) is actually a high-quality STAR answer with grounded technical detail (Datadog, `EXPLAIN ANALYZE`, P99 numbers) delivered properly in prose. All 12 "MODERATE" labels from the auto-pass are being reclassified below based on what actually matters for behavioral content.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| STAR framing (Situation / Task / Action / Result / Reflection) with labeled beats | **Matching perfectly** — Q1 `debug-complex-production-issue` has `Step 1 — Situation`, `Step 2 — Task`, etc. Need to verify the other 11 do the same |
| Specific, grounded detail over generic claims ("$4K/min revenue impact, 40M-row table, P99 2.3s → 180ms") | Q1 is exemplary here. Spot-check needed on the other 11 |
| Prose speakable (not bulleted) — behavioral answers are spoken as a story, not a list | **Matching** — all 12 use prose shape. Correct for archetype |
| Speakable length 200–300w (roughly 90 seconds spoken) | **Matching** — all 12 are in 230–266w range |
| Interviewer-intent / what's being tested / red flags to avoid | Q1 has rich `interviewer_intent`. Need to verify the other 11 |
| Followup-question list per scenario | Need to check — auditor doesn't read `followup_questions` |
| Coverage of the full behavioral canon | **Partial** — see topic gaps below |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | MISSING TOPIC | **CRITICAL** | **`agile-and-scrum` has 0 questions.** For a behavioral module, agile/scrum questions are table-stakes at every company running Scrum or SAFe. Missing: sprint retrospective, daily standup disagreement, story-point estimation conflicts, working with a difficult PM, handling mid-sprint scope change. Suggest 4 questions |
| S2 | MISSING CANONICAL BEHAVIORALS | **MAJOR** | Current 12 Qs skip the behavioral canon. Missing: **"tell me about yourself"** intro, **"greatest weakness"**, **"why this company"**, **"why leave your current role"**, **"questions for the interviewer"**, **"describe your biggest achievement"**. These are asked in ~every interview above intern level |
| S3 | THIN TOPIC COVERAGE | **MAJOR** | 5 of 6 topics have only 1–2 questions each. `star-method` has 1 Q, `conflict-resolution` has 1 Q, `failure-and-learning` has 1 Q, `delivering-under-pressure` has 2, `career-growth` has 2. Real interviews probe 3–5 scenarios per category. Suggest growing to 3 Qs per topic minimum |
| S4 | MISSING META-QUESTION | **MAJOR** | `star-method` topic has a *situational* question (`debug-complex-production-issue`) but no **meta question** explaining the STAR framework itself. Standard first question on this topic across every interview-prep site: "What is the STAR method and how do you use it?" |
| S5 | MODULE-WIDE ZONE 1 | **MODERATE** | 12 of 12 `direct_answer`s have zero bold anchors; 5 are paragraph walls. For behavioral, Zone 1 should surface 2–3 principles the candidate will demonstrate (e.g., **observability over intuition**, **surgical mitigation**, **blameless postmortem**) |
| S6 | NO `agile-and-scrum` EVEN AS STUB | MINOR | The `_config.json` presumably lists this topic; worth confirming a folder exists with an empty `complete-qa.json` at minimum |

---

## Per-question issues

### Topic: `star-method` (1 Q)

| Q | Strengths | Issues | Severity |
|---|---|---|---|
| **Q1** debug-complex-production-issue | **Exemplary** — labeled STAR beats, grounded detail (Datadog, EXPLAIN ANALYZE, 40M rows, $4K/min), quantified outcome (P99 2.3s → 180ms), reflection loop ("I'd push for pganalyze in staging") | No bold anchors in direct_answer (add: `**observability**`, `**reproduce before you mutate**`, `**blameless postmortem**`) | MINOR |

**Topic gap:** need the STAR **meta question** (what is STAR, why it works, typical pitfalls — "action stuffed, result skipped"). This is the topic's flagship question and is currently absent.

### Topic: `conflict-resolution` (1 Q)

| Q | Needs spot-check for | Severity (pending read) |
|---|---|---|
| **Q1** handle-technical-disagreements | Paragraph-wall direct answer (65w). Must verify: does it use STAR? Is there a concrete disagreement example (architecture choice? library pick?) or is it abstract principle? Recommendation closer ("I'd pick X") present per structural signal | MINOR–MODERATE pending read |

**Topic gap:** need at least 2 more scenarios — `disagree-with-manager`, `peer-unresponsive-in-review`, `different-working-style`.

### Topic: `technical-leadership` (5 Qs)

| Q | Pattern detected | Severity |
|---|---|---|
| **Q1** improve-system-performance | Analogy detected in speakable; 5 step-beats (likely STAR) | MINOR |
| **Q2** end-to-end-project-ownership | Paragraph wall (67w); 5 step-beats | MINOR |
| **Q3** approach-code-reviews | Analogy in speakable; 2 step-beats under an overview — **fewer than STAR's 4–5 beats**, may need expansion | MINOR–MODERATE pending read |
| **Q4** advocate-for-technical-debt | Analogy in speakable; 5 step-beats | MINOR |
| **Q5** mentor-junior-developer | Paragraph wall (65w); recommendation closer present; 5 step-beats | MINOR |

**Strongest topic in module** — 5 Qs with analogy usage and labeled beats. Keep as the coverage template for the thinner topics.

### Topic: `agile-and-scrum` (0 Qs) — **CRITICAL gap**

Suggest adding (minimum):
1. `handle-mid-sprint-scope-change` — PM adds an urgent story on day 3 of a 2-week sprint
2. `sprint-retrospective-leadership` — how do you drive improvements without making it feel performative
3. `story-point-estimation-disagreement` — your estimate differs from a senior teammate's by 3×
4. `working-with-difficult-pm` — ambiguous requirements, conflicting priorities, shipping pressure

### Topic: `delivering-under-pressure` (2 Qs)

| Q | Pattern | Severity |
|---|---|---|
| **Q1** prioritize-multiple-urgent-tasks | Overview + 2 step-beats (not full STAR) | MINOR |
| **Q2** ensure-code-quality-under-pressure | Paragraph wall (68w); analogy present; overview + 2 step-beats | MINOR |

**Topic is thin on depth per question** (2 step-beats vs 5 in the leadership topic). Either convert these to full STAR or add a 3rd question with full STAR.

### Topic: `failure-and-learning` (1 Q)

| Q | Pattern | Severity |
|---|---|---|
| **Q1** project-failure-and-lessons-learned | 5 step-beats (likely STAR) | MINOR |

**Topic gap:** add at least one more — `received-harsh-feedback`, `missed-a-deadline`, `production-outage-you-caused` (powerful: requires owning the mistake while showing growth). The canonical one-failure question begs for contrasting scenarios.

### Topic: `career-growth` (2 Qs)

| Q | Pattern | Severity |
|---|---|---|
| **Q1** learn-new-technology-quickly | Paragraph wall (61w); 5 step-beats | MINOR |
| **Q2** stay-current-with-java-technology | Overview + 2 step-beats; analogy in Zone 3 | MINOR |

**Topic is reasonable for scope** — though consider adding `career-goals-next-5-years` (always asked) or `transitioning-between-roles`.

---

## Content-quality checks the auditor cannot do (flagging for manual review)

These apply to every question and can't be detected structurally:

1. **Story authenticity** — do the stories sound like real engineering situations or like AI-generated composites? Q1 `debug-complex-production-issue` passes this test (specific tools, specific numbers, believable team size of 5, specific hour "2 a.m."). Sample 4–5 others to confirm the pattern holds.
2. **Specific quantified outcomes** — does every story land a number (latency improvement, team-growth metric, bugs prevented, revenue saved)? Stories without a quantified result are red-flagged by interviewers as "performative" answers.
3. **Honest reflection** — does every STAR end with a real "what I'd do differently"? Self-critical reflection separates mid-level from senior answers.
4. **Anti-generic phrases** — watch for "I believe in communication and teamwork" / "I strive to write clean code" boilerplate. Top sources always pair principles with concrete examples.
5. **`followup_questions` populated** — behavioral interviewers always have follow-ups ("what was the hardest part?", "how did your manager react?", "what did the postmortem reveal?"). Structural auditor doesn't check this field; verify manually.

---

## Tally (recalibrated for behavioral archetype)

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **1** | S1 agile-and-scrum topic empty (table-stakes for backend behaviorals) |
| **MAJOR** | **3** | S2 missing canonical behaviorals, S3 thin topic coverage, S4 missing STAR meta-question |
| **MODERATE** | **1** | S5 module-wide bold-anchor / paragraph-wall pass |
| **MINOR** | **12** | All individual questions — all are structurally valid with polish-level issues only |
| **CLEAN** | **0** | Q1 star-method is near-clean apart from the module-wide bold-anchor gap |
| **FALSE-POSITIVES SUPPRESSED** | 12 | `zone3_no_code_examples` on all 12 Qs — behavioral archetype doesn't take code |

---

## Suggested fix order

1. **Author `agile-and-scrum` topic** (4 questions minimum — list above).
2. **Author the 5 missing canonical behaviorals** — tell-me-about-yourself, greatest-weakness, why-this-company, why-leaving, questions-for-interviewer. These should land in existing or new topics.
3. **Add STAR meta-question** to `star-method` topic.
4. **Grow each topic to 3+ questions** — prioritize `conflict-resolution` (1 Q today) and `failure-and-learning` (1 Q today).
5. **Spot-check Q2–Q12** against the Q1 quality bar — do they have grounded detail, quantified outcomes, honest reflection? If any read as generic, rewrite with concrete scenarios.
6. **Module-wide bold-anchor pass** — 12 direct answers, mechanical.
7. **Calibrate auditor to suppress `zone3_no_code_examples` for behavioral archetype** (update `audit_jbi_v3.py` — small fix so this module doesn't light up red on future passes).
