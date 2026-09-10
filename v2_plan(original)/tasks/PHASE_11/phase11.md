# PHASE 11 — RESUME INTELLIGENCE, RESUME ANALYSIS, JOB DESCRIPTION MATCHING, SKILL-GAP ANALYSIS & INTERVIEW PREPARATION BRIDGE

---

# Phase Objective

Build the canonical resume and job intelligence layer for Interview Explainer.

The system must transform:

```text
RESUME
   +
TARGET ROLE
   +
OPTIONAL JOB DESCRIPTION
   ↓
STRUCTURED CANDIDATE PROFILE
   ↓
EXPERIENCE EVIDENCE
   ↓
SKILLS
   ↓
PROJECTS
   ↓
ROLE REQUIREMENTS
   ↓
GAP ANALYSIS
   ↓
INTERVIEW RISK AREAS
   ↓
PERSONALIZED PREPARATION PLAN
   ↓
QUESTIONS
   ↓
PRACTICE
   ↓
MOCK INTERVIEWS
```

The system must not become:

* a generic ATS score generator,
* a keyword counter,
* a resume template marketplace,
* a fake hiring probability calculator,
* a job guarantee system,
* a black-box AI resume reviewer,
* an automatic resume fabricator,
* or an LLM prompt that simply says “analyse this resume.”

The central product principle is:

```text
A RESUME IS NOT JUST A DOCUMENT.

FOR INTERVIEW PREPARATION,
IT IS A MAP OF CLAIMS
THE CANDIDATE MAY BE ASKED
TO DEFEND, EXPLAIN,
AND DEMONSTRATE.
```

---

# Core Product Model

```text
CANDIDATE
   ↓
RESUME
   ↓
STRUCTURED PROFESSIONAL PROFILE
   ↓
CLAIMS + SKILLS + EXPERIENCE + PROJECTS
   ↓
TARGET ROLE / JOB DESCRIPTION
   ↓
REQUIREMENT MAPPING
   ↓
EVIDENCE MAPPING
   ↓
GAPS
   ↓
INTERVIEW EXPOSURE
   ↓
PREPARATION PRIORITIES
   ↓
QUESTIONS + LEARNING + PRACTICE + MOCKS
```

---

# Workstream A — Existing Resume and Job Feature Audit

## P11-T001 — Inventory Existing Resume Routes

**Priority:** P0

---

## P11-T002 — Inventory Existing Resume Upload Components

**Priority:** P0

---

## P11-T003 — Inventory Existing Resume Parsing Logic

**Priority:** P0

---

## P11-T004 — Inventory Existing Resume Analysis APIs

**Priority:** P0

---

## P11-T005 — Inventory Existing Resume Data Models

**Priority:** P0

---

## P11-T006 — Inventory Existing Job Description Features

**Priority:** P0

---

## P11-T007 — Inventory Existing Job Matching Logic

**Priority:** P0

---

## P11-T008 — Inventory Existing Skill Extraction Logic

**Priority:** P0

---

## P11-T009 — Inventory Existing AI Prompts

**Priority:** P0

---

## P11-T010 — Inventory Existing ATS Scoring Logic

**Priority:** P0

---

## P11-T011 — Inventory Existing Resume Recommendations

**Priority:** P0

---

## P11-T012 — Inventory Existing Resume Storage

**Priority:** P0

---

## P11-T013 — Inventory Existing File Upload Infrastructure

**Priority:** P0

---

## P11-T014 — Inventory Existing User Profile Integration

**Priority:** P0

---

## P11-T015 — Inventory Existing Preparation Integration

**Priority:** P0

---

## P11-T016 — Identify Duplicate Resume Systems

**Priority:** P0

---

## P11-T017 — Identify Dead Resume Code

**Priority:** P0

---

## P11-T018 — Identify Unbounded AI Calls

**Priority:** P0

---

## P11-T019 — Identify Unsupported ATS Claims

**Priority:** P0

---

## P11-T020 — Identify Resume Privacy Risks

**Priority:** P0

---

## P11-T021 — Produce Current Resume Architecture Map

**Priority:** P0

---

# Workstream B — Resume Intelligence Product Definition

## P11-T022 — Define Resume Intelligence Purpose

**Priority:** P0

---

## P11-T023 — Define Resume Analysis Boundary

**Priority:** P0

---

## P11-T024 — Define Resume Improvement Boundary

**Priority:** P0

---

## P11-T025 — Define Interview Preparation Boundary

**Priority:** P0

---

## P11-T026 — Define Job Matching Boundary

**Priority:** P0

---

## P11-T027 — Define Skill-Gap Analysis Boundary

**Priority:** P0

---

## P11-T028 — Define ATS Compatibility Boundary

**Priority:** P0

---

## P11-T029 — Define What the Product Can Reliably Claim

**Priority:** P0

---

## P11-T030 — Define What the Product Must Not Claim

Prohibited or heavily qualified outputs:

```text
YOU HAVE AN 87% CHANCE
OF GETTING THIS JOB

YOUR RESUME WILL PASS ATS

THIS COMPANY WILL SHORTLIST YOU

YOU ARE GUARANTEED AN INTERVIEW
```

**Priority:** P0

---

## P11-T031 — Define Resume Analysis as Evidence-Based Guidance

**Priority:** P0

---

# Workstream C — Resume Lifecycle

## P11-T032 — Define Resume Upload

**Priority:** P0

---

## P11-T033 — Define File Validation

**Priority:** P0

---

## P11-T034 — Define Secure Storage

**Priority:** P0

---

## P11-T035 — Define Text Extraction

**Priority:** P0

---

## P11-T036 — Define Parsing

**Priority:** P0

---

## P11-T037 — Define Normalization

**Priority:** P0

---

## P11-T038 — Define User Review

**Priority:** P0

---

## P11-T039 — Define Analysis

**Priority:** P0

---

## P11-T040 — Define Profile Generation

**Priority:** P0

---

## P11-T041 — Define Preparation Integration

**Priority:** P0

---

## P11-T042 — Define Resume Replacement

**Priority:** P0

---

## P11-T043 — Define Resume Deletion

**Priority:** P0

---

# Workstream D — Supported Resume Input

## P11-T044 — Define Supported File Types

Recommended initial scope:

```text
PDF
DOCX
```

**Priority:** P0

---

## P11-T045 — Define Maximum File Size

**Priority:** P0

---

## P11-T046 — Validate MIME Type

**Priority:** P0

---

## P11-T047 — Validate File Signature

**Priority:** P0

---

## P11-T048 — Reject Unsupported Files

**Priority:** P0

---

## P11-T049 — Reject Password-Protected Files Gracefully

**Priority:** P0

---

## P11-T050 — Handle Image-Based PDFs

**Priority:** P1

---

## P11-T051 — Define OCR Boundary

**Priority:** P1

---

## P11-T052 — Avoid Trusting Filename Extension Alone

**Priority:** P0

---

# Workstream E — Secure Resume Upload Architecture

## P11-T053 — Require Authentication for Personal Resume Upload

**Priority:** P0

---

## P11-T054 — Generate Server-Controlled File Identifier

**Priority:** P0

---

## P11-T055 — Prevent User-Controlled Storage Paths

**Priority:** P0

---

## P11-T056 — Scan Uploads Where Infrastructure Supports It

**Priority:** P1

---

## P11-T057 — Store Files Privately

**Priority:** P0

---

## P11-T058 — Prevent Public Resume URLs

**Priority:** P0

---

## P11-T059 — Enforce Resume Ownership

**Priority:** P0

---

## P11-T060 — Define Signed or Authorized Access

**Priority:** P0

---

## P11-T061 — Define Upload Expiration for Temporary Files

**Priority:** P0

---

## P11-T062 — Prevent Cross-User Resume Access

**Priority:** P0

---

# Workstream F — Resume Document Model

## P11-T063 — Define Resume Document ID

**Priority:** P0

---

## P11-T064 — Define User ID

**Priority:** P0

---

## P11-T065 — Define Original Filename Metadata

**Priority:** P1

---

## P11-T066 — Define Storage Reference

**Priority:** P0

---

## P11-T067 — Define File Type

**Priority:** P0

---

## P11-T068 — Define File Size

**Priority:** P0

---

## P11-T069 — Define Upload Timestamp

**Priority:** P0

---

## P11-T070 — Define Processing Status

```text
uploaded
extracting
extracted
parsing
parsed
review_required
ready
failed
deleted
```

**Priority:** P0

---

## P11-T071 — Define Parser Version

**Priority:** P0

---

## P11-T072 — Define Active Resume Flag

**Priority:** P0

---

# Workstream G — Resume Text Extraction

## P11-T073 — Define Extraction Provider Interface

**Priority:** P0

---

## P11-T074 — Extract PDF Text

**Priority:** P0

---

## P11-T075 — Extract DOCX Text

**Priority:** P0

---

## P11-T076 — Preserve Logical Reading Order Where Possible

**Priority:** P0

---

## P11-T077 — Detect Empty Extraction

**Priority:** P0

---

## P11-T078 — Detect Corrupted Extraction

**Priority:** P0

---

## P11-T079 — Detect Likely Scanned Resume

**Priority:** P1

---

## P11-T080 — Route Eligible Files to OCR

**Priority:** P1

---

## P11-T081 — Preserve Raw Extracted Text

**Priority:** P0

---

## P11-T082 — Version Extraction Logic

**Priority:** P0

---

# Workstream H — Resume Parsing Architecture

## P11-T083 — Define Resume Parser Contract

**Priority:** P0

---

## P11-T084 — Parse Contact Section Carefully

**Priority:** P0

---

## P11-T085 — Parse Professional Summary

**Priority:** P0

---

## P11-T086 — Parse Work Experience

**Priority:** P0

---

## P11-T087 — Parse Projects

**Priority:** P0

---

## P11-T088 — Parse Skills

**Priority:** P0

---

## P11-T089 — Parse Education

**Priority:** P0

---

## P11-T090 — Parse Certifications

**Priority:** P1

---

## P11-T091 — Parse Achievements

**Priority:** P1

---

## P11-T092 — Parse Publications if Present

**Priority:** P2

---

## P11-T093 — Parse Links if Present

**Priority:** P1

---

## P11-T094 — Preserve Unclassified Sections

**Priority:** P1

---

# Workstream I — Structured Candidate Profile

## P11-T095 — Define Candidate Profile Model

**Priority:** P0

---

## P11-T096 — Define Current Role

**Priority:** P0

---

## P11-T097 — Define Experience Level

**Priority:** P0

---

## P11-T098 — Define Total Experience Carefully

**Priority:** P0

---

## P11-T099 — Define Role History

**Priority:** P0

---

## P11-T100 — Define Skill Inventory

**Priority:** P0

---

## P11-T101 — Define Project Inventory

**Priority:** P0

---

## P11-T102 — Define Education Inventory

**Priority:** P0

---

## P11-T103 — Define Certification Inventory

**Priority:** P1

---

## P11-T104 — Define Domain Experience

**Priority:** P1

---

## P11-T105 — Define Responsibility Evidence

**Priority:** P0

---

## P11-T106 — Define Achievement Evidence

**Priority:** P0

---

# Workstream J — Candidate Claim Model

## P11-T107 — Define Resume Claim

**Priority:** P0

---

## P11-T108 — Define Claim Source

**Priority:** P0

---

## P11-T109 — Define Claim Type

Examples:

```text
SKILL
RESPONSIBILITY
ACHIEVEMENT
PROJECT
TECHNOLOGY
LEADERSHIP
DOMAIN EXPERIENCE
```

**Priority:** P0

---

## P11-T110 — Define Claim Text

**Priority:** P0

---

## P11-T111 — Define Source Section

**Priority:** P0

---

## P11-T112 — Define Associated Role or Project

**Priority:** P0

---

## P11-T113 — Define Associated Skills

**Priority:** P0

---

## P11-T114 — Define Claim Confidence

**Priority:** P1

---

## P11-T115 — Preserve Original Resume Wording

**Priority:** P0

---

# Workstream K — Resume-to-Interview Claim Mapping

## P11-T116 — Identify Interview-Relevant Claims

**Priority:** P0

---

## P11-T117 — Identify Technology Claims

**Priority:** P0

---

## P11-T118 — Identify Architecture Claims

**Priority:** P0

---

## P11-T119 — Identify Ownership Claims

**Priority:** P0

---

## P11-T120 — Identify Performance Improvement Claims

**Priority:** P0

---

## P11-T121 — Identify Scale Claims

**Priority:** P0

---

## P11-T122 — Identify Leadership Claims

**Priority:** P1

---

## P11-T123 — Identify Automation Claims

**Priority:** P0

---

## P11-T124 — Identify Security Claims

**Priority:** P1

---

## P11-T125 — Identify Quantified Achievement Claims

**Priority:** P0

---

## P11-T126 — Generate Claim-Based Interview Topics

**Priority:** P0

---

# Workstream L — Claim Defensibility

## P11-T127 — Define Claim Defensibility Concept

**Priority:** P0

---

## P11-T128 — Determine Whether Claim Has Supporting Context

**Priority:** P0

---

## P11-T129 — Determine Whether Claim Explains Candidate Contribution

**Priority:** P0

---

## P11-T130 — Determine Whether Claim Uses Technology Without Demonstrating Use

**Priority:** P0

---

## P11-T131 — Identify Potentially Vague Claims

**Priority:** P0

---

## P11-T132 — Identify Claims Likely to Trigger Follow-Up Questions

**Priority:** P0

---

## P11-T133 — Avoid Accusing User of Lying

**Priority:** P0

---

## P11-T134 — Frame Weak Evidence as Interview Preparation Risk

**Priority:** P0

---

# Workstream M — Resume-Derived Interview Questions

## P11-T135 — Define Resume Question Generation Contract

**Priority:** P0

---

## P11-T136 — Prefer Canonical Questions Where Available

**Priority:** P0

---

## P11-T137 — Map Skill Claims to Canonical Questions

**Priority:** P0

---

## P11-T138 — Map Project Claims to Interview Themes

**Priority:** P0

---

## P11-T139 — Map Architecture Claims to System Questions

**Priority:** P0

---

## P11-T140 — Map Achievement Claims to Evidence Questions

**Priority:** P0

---

## P11-T141 — Generate Personalized Follow-Up Questions Where Necessary

**Priority:** P1

---

## P11-T142 — Distinguish Canonical Questions from Personalized Questions

**Priority:** P0

---

## P11-T143 — Do Not Publish Personalized Questions as Public SEO Content

**Priority:** P0

---

# Workstream N — Resume Question Categories

## P11-T144 — Define “Explain This Technology” Questions

**Priority:** P0

---

## P11-T145 — Define “How Did You Use It?” Questions

**Priority:** P0

---

## P11-T146 — Define “Why Did You Choose It?” Questions

**Priority:** P0

---

## P11-T147 — Define “What Alternatives Did You Consider?” Questions

**Priority:** P1

---

## P11-T148 — Define “What Went Wrong?” Questions

**Priority:** P0

---

## P11-T149 — Define “What Was Your Contribution?” Questions

**Priority:** P0

---

## P11-T150 — Define “How Did You Measure Impact?” Questions

**Priority:** P0

---

## P11-T151 — Define “What Would You Change?” Questions

**Priority:** P1

---

# Workstream O — Resume Analysis Dimensions

## P11-T152 — Define Structural Clarity

**Priority:** P0

---

## P11-T153 — Define Role Clarity

**Priority:** P0

---

## P11-T154 — Define Experience Clarity

**Priority:** P0

---

## P11-T155 — Define Skill Evidence

**Priority:** P0

---

## P11-T156 — Define Achievement Specificity

**Priority:** P0

---

## P11-T157 — Define Impact Evidence

**Priority:** P0

---

## P11-T158 — Define Readability

**Priority:** P0

---

## P11-T159 — Define Consistency

**Priority:** P0

---

## P11-T160 — Define Target Role Relevance

**Priority:** P0

---

## P11-T161 — Define Interview Defensibility

**Priority:** P0

---

# Workstream P — Resume Quality Analysis

## P11-T162 — Detect Missing Professional Context

**Priority:** P0

---

## P11-T163 — Detect Unclear Role Descriptions

**Priority:** P0

---

## P11-T164 — Detect Responsibility-Only Bullets

**Priority:** P0

---

## P11-T165 — Detect Unsupported Impact Claims

**Priority:** P0

---

## P11-T166 — Detect Excessive Generic Language

**Priority:** P0

---

## P11-T167 — Detect Repetitive Bullet Patterns

**Priority:** P1

---

## P11-T168 — Detect Excessive Skill Lists

**Priority:** P0

---

## P11-T169 — Detect Skills Without Experience Evidence

**Priority:** P0

---

## P11-T170 — Detect Inconsistent Dates Carefully

**Priority:** P1

---

## P11-T171 — Avoid Inventing Missing Information

**Priority:** P0

---

# Workstream Q — Resume Improvement Guidance

## P11-T172 — Explain Why an Issue Matters

**Priority:** P0

---

## P11-T173 — Show Original Context

**Priority:** P0

---

## P11-T174 — Provide Improvement Direction

**Priority:** P0

---

## P11-T175 — Provide Example Rewrite Only When Appropriate

**Priority:** P1

---

## P11-T176 — Never Fabricate Metrics

**Priority:** P0

---

## P11-T177 — Never Fabricate Responsibilities

**Priority:** P0

---

## P11-T178 — Never Fabricate Technologies

**Priority:** P0

---

## P11-T179 — Never Fabricate Achievements

**Priority:** P0

---

## P11-T180 — Ask User for Missing Evidence Where Required

**Priority:** P0

---

# Workstream R — Resume Score Architecture

## P11-T181 — Determine Whether a Single Resume Score Is Necessary

**Priority:** P0

---

## P11-T182 — Avoid Fake Universal Resume Score

**Priority:** P0

---

## P11-T183 — Prefer Dimension-Level Assessment

**Priority:** P0

---

## P11-T184 — Define Assessment Scale

Recommended:

```text
needs_attention
developing
solid
strong
```

**Priority:** P0

---

## P11-T185 — Explain Assessment Evidence

**Priority:** P0

---

## P11-T186 — Avoid False Precision

**Priority:** P0

---

## P11-T187 — Separate Resume Quality from Job Match

**Priority:** P0

---

## P11-T188 — Separate Job Match from Interview Readiness

**Priority:** P0

---

# Workstream S — Job Description Input

## P11-T189 — Define Job Description Input Model

**Priority:** P0

---

## P11-T190 — Support Pasted Job Description

**Priority:** P0

---

## P11-T191 — Support Job Description File in Future

**Priority:** P2

---

## P11-T192 — Support Job URL Import Only Through Controlled Architecture

**Priority:** P1

---

## P11-T193 — Preserve Original Job Description

**Priority:** P0

---

## P11-T194 — Define Job Description Ownership

**Priority:** P0

---

## P11-T195 — Define Job Description Retention

**Priority:** P0

---

# Workstream T — Job Description Parsing

## P11-T196 — Define Job Parser Contract

**Priority:** P0

---

## P11-T197 — Extract Job Title

**Priority:** P0

---

## P11-T198 — Extract Seniority

**Priority:** P0

---

## P11-T199 — Extract Required Skills

**Priority:** P0

---

## P11-T200 — Extract Preferred Skills

**Priority:** P0

---

## P11-T201 — Extract Responsibilities

**Priority:** P0

---

## P11-T202 — Extract Experience Requirements

**Priority:** P0

---

## P11-T203 — Extract Domain Requirements

**Priority:** P1

---

## P11-T204 — Extract Education Requirements

**Priority:** P1

---

## P11-T205 — Extract Certification Requirements

**Priority:** P1

---

## P11-T206 — Extract Behavioural Competencies

**Priority:** P1

---

# Workstream U — Requirement Model

## P11-T207 — Define Job Requirement

**Priority:** P0

---

## P11-T208 — Define Requirement Type

**Priority:** P0

---

## P11-T209 — Define Requirement Importance

```text
required
preferred
contextual
```

**Priority:** P0

---

## P11-T210 — Define Requirement Evidence

**Priority:** P0

---

## P11-T211 — Define Normalized Skill Reference

**Priority:** P0

---

## P11-T212 — Define Experience Requirement

**Priority:** P0

---

## P11-T213 — Define Source Text

**Priority:** P0

---

## P11-T214 — Preserve Requirement Traceability

**Priority:** P0

---

# Workstream V — Skill Taxonomy

## P11-T215 — Define Canonical Skill Entity

**Priority:** P0

---

## P11-T216 — Define Skill Aliases

**Priority:** P0

---

## P11-T217 — Define Skill Categories

Examples:

```text
LANGUAGE
FRAMEWORK
DATABASE
CLOUD
DEVOPS
DATA
SECURITY
ARCHITECTURE
DOMAIN
SOFT_SKILL
```

**Priority:** P0

---

## P11-T218 — Normalize Skill Variants

**Priority:** P0

---

## P11-T219 — Handle Java vs JavaScript Correctly

**Priority:** P0

---

## P11-T220 — Handle Spring vs Spring Boot Correctly

**Priority:** P0

---

## P11-T221 — Handle SQL as Broad Capability

**Priority:** P0

---

## P11-T222 — Preserve Specific Technologies

**Priority:** P0

---

## P11-T223 — Avoid Naive Substring Matching

**Priority:** P0

---

# Workstream W — Resume Skill Evidence

## P11-T224 — Define Skill Evidence Source

**Priority:** P0

---

## P11-T225 — Distinguish Skill List Mention

**Priority:** P0

---

## P11-T226 — Distinguish Experience Bullet Evidence

**Priority:** P0

---

## P11-T227 — Distinguish Project Evidence

**Priority:** P0

---

## P11-T228 — Distinguish Certification Evidence

**Priority:** P1

---

## P11-T229 — Weight Evidence Sources Differently

**Priority:** P0

---

## P11-T230 — Avoid Treating Every Skill Mention Equally

**Priority:** P0

---

## P11-T231 — Preserve Evidence Traceability

**Priority:** P0

---

# Workstream X — Resume-to-Job Matching

## P11-T232 — Define Matching Engine Contract

**Priority:** P0

---

## P11-T233 — Match Required Skills

**Priority:** P0

---

## P11-T234 — Match Preferred Skills

**Priority:** P0

---

## P11-T235 — Match Experience Level

**Priority:** P0

---

## P11-T236 — Match Role Experience

**Priority:** P0

---

## P11-T237 — Match Domain Experience

**Priority:** P1

---

## P11-T238 — Match Responsibility Evidence

**Priority:** P0

---

## P11-T239 — Match Project Evidence

**Priority:** P0

---

## P11-T240 — Preserve Match Evidence

**Priority:** P0

---

# Workstream Y — Match Status Architecture

## P11-T241 — Define Strong Evidence Match

**Priority:** P0

---

## P11-T242 — Define Partial Evidence Match

**Priority:** P0

---

## P11-T243 — Define Mention-Only Match

**Priority:** P0

---

## P11-T244 — Define No Evidence Match

**Priority:** P0

---

## P11-T245 — Define Unclear Match

**Priority:** P0

---

## P11-T246 — Avoid Binary Keyword Match

**Priority:** P0

---

## P11-T247 — Explain Why Requirement Was Classified

**Priority:** P0

---

# Workstream Z — Skill-Gap Analysis

## P11-T248 — Define Skill Gap

**Priority:** P0

---

## P11-T249 — Distinguish Missing Skill

**Priority:** P0

---

## P11-T250 — Distinguish Weak Evidence

**Priority:** P0

---

## P11-T251 — Distinguish Resume Visibility Gap

**Priority:** P0

---

## P11-T252 — Distinguish Interview Knowledge Gap

**Priority:** P0

---

## P11-T253 — Distinguish Experience Gap

**Priority:** P0

---

## P11-T254 — Distinguish Unverified Gap

**Priority:** P0

---

## P11-T255 — Avoid Assuming Resume Absence Means No Skill

**Priority:** P0

---

# Workstream AA — Gap Severity

## P11-T256 — Define Gap Severity Model

**Priority:** P0

---

## P11-T257 — Consider Requirement Importance

**Priority:** P0

---

## P11-T258 — Consider Existing Evidence

**Priority:** P0

---

## P11-T259 — Consider Learning Feasibility

**Priority:** P1

---

## P11-T260 — Consider Interview Likelihood

**Priority:** P0

---

## P11-T261 — Consider Role Centrality

**Priority:** P0

---

## P11-T262 — Avoid One Universal Gap Percentage

**Priority:** P0

---

# Workstream AB — Preparation Gap vs Eligibility Gap

## P11-T263 — Define Preparation Gap

Example:

```text
Candidate has used Spring Boot
but needs deeper preparation
for transactions and security.
```

**Priority:** P0

---

## P11-T264 — Define Evidence Gap

Example:

```text
Candidate lists Kubernetes
but resume provides no context
showing how it was used.
```

**Priority:** P0

---

## P11-T265 — Define Experience Gap

Example:

```text
Role asks for direct team leadership,
but resume does not show leadership experience.
```

**Priority:** P0

---

## P11-T266 — Do Not Pretend Every Gap Can Be Fixed by Studying

**Priority:** P0

---

# Workstream AC — Interview Risk Analysis

## P11-T267 — Define Interview Risk

**Priority:** P0

---

## P11-T268 — Identify High-Visibility Resume Claims

**Priority:** P0

---

## P11-T269 — Identify Weakly Supported Technology Claims

**Priority:** P0

---

## P11-T270 — Identify Advanced Skills with Limited Evidence

**Priority:** P0

---

## P11-T271 — Identify Quantified Claims Likely to Trigger Follow-Ups

**Priority:** P0

---

## P11-T272 — Identify Architecture Claims Likely to Trigger Deep Questions

**Priority:** P0

---

## P11-T273 — Identify Role Transition Risks

**Priority:** P1

---

## P11-T274 — Identify Job Requirements with No Evidence

**Priority:** P0

---

# Workstream AD — Interview Exposure Model

## P11-T275 — Define Resume-Derived Exposure

**Priority:** P0

---

## P11-T276 — Define Job-Derived Exposure

**Priority:** P0

---

## P11-T277 — Define Role-Derived Exposure

**Priority:** P0

---

## P11-T278 — Define Experience-Level Exposure

**Priority:** P0

---

## P11-T279 — Combine Exposure Signals

**Priority:** P0

---

## P11-T280 — Rank Likely Preparation Areas

**Priority:** P0

---

## P11-T281 — Avoid Claiming Exact Interview Question Probability

**Priority:** P0

---

# Workstream AE — Preparation Priority Engine

## P11-T282 — Define Preparation Priority Score Internally

**Priority:** P0

---

## P11-T283 — Weight Required Job Skills

**Priority:** P0

---

## P11-T284 — Weight Resume Claims

**Priority:** P0

---

## P11-T285 — Weight Existing Weakness Evidence

**Priority:** P0

---

## P11-T286 — Weight Interview Exposure

**Priority:** P0

---

## P11-T287 — Weight Existing Preparation Progress

**Priority:** P0

---

## P11-T288 — Weight Recent Mock Interview Performance

**Priority:** P1

---

## P11-T289 — Produce Explainable Priority Reason

**Priority:** P0

---

# Workstream AF — Resume-to-Preparation Bridge

## P11-T290 — Map Resume Skills to Canonical Topics

**Priority:** P0

---

## P11-T291 — Map Resume Technologies to Modules

**Priority:** P0

---

## P11-T292 — Map Job Requirements to Canonical Topics

**Priority:** P0

---

## P11-T293 — Map Gaps to Learning Content

**Priority:** P0

---

## P11-T294 — Map Claims to Practice Questions

**Priority:** P0

---

## P11-T295 — Map Interview Risks to Mock Interview Scope

**Priority:** P0

---

## P11-T296 — Map Weaknesses to Revision

**Priority:** P0

---

## P11-T297 — Preserve Mapping Reasons

**Priority:** P0

---

# Workstream AG — Personalized Preparation Plan

## P11-T298 — Define Resume-Based Preparation Plan

**Priority:** P0

---

## P11-T299 — Define Job-Based Preparation Plan

**Priority:** P0

---

## P11-T300 — Define Resume + Job Combined Plan

**Priority:** P0

---

## P11-T301 — Prioritize Critical Topics

**Priority:** P0

---

## P11-T302 — Prioritize Resume Defense

**Priority:** P0

---

## P11-T303 — Prioritize Missing Required Knowledge

**Priority:** P0

---

## P11-T304 — Prioritize Weak Mock Interview Areas

**Priority:** P1

---

## P11-T305 — Avoid Creating Hundreds of Tasks at Once

**Priority:** P0

---

## P11-T306 — Create Actionable Initial Plan

**Priority:** P0

---

# Workstream AH — Resume Defense Mode

## P11-T307 — Define Resume Defense Preparation

**Priority:** P0

---

## P11-T308 — Generate Questions from Work Experience

**Priority:** P0

---

## P11-T309 — Generate Questions from Projects

**Priority:** P0

---

## P11-T310 — Generate Questions from Skills

**Priority:** P0

---

## P11-T311 — Generate Questions from Achievements

**Priority:** P0

---

## P11-T312 — Generate Questions from Architecture Claims

**Priority:** P0

---

## P11-T313 — Generate Questions from Leadership Claims

**Priority:** P1

---

## P11-T314 — Create Resume Defense Practice Session

**Priority:** P0

---

# Workstream AI — Resume-Based Mock Interview

## P11-T315 — Define Resume Mock Interview Blueprint

**Priority:** P0

---

## P11-T316 — Select High-Exposure Resume Claims

**Priority:** P0

---

## P11-T317 — Include Technology Fundamentals

**Priority:** P0

---

## P11-T318 — Include Project Deep Dives

**Priority:** P0

---

## P11-T319 — Include Ownership Questions

**Priority:** P0

---

## P11-T320 — Include Challenge Questions

**Priority:** P0

---

## P11-T321 — Include Trade-Off Questions

**Priority:** P1

---

## P11-T322 — Connect to Phase 10 Interview Engine

**Priority:** P0

---

# Workstream AJ — Job-Specific Mock Interview

## P11-T323 — Define Job-Specific Interview Blueprint

**Priority:** P0

---

## P11-T324 — Use Required Job Skills

**Priority:** P0

---

## P11-T325 — Use Role Responsibilities

**Priority:** P0

---

## P11-T326 — Use Candidate Resume Evidence

**Priority:** P0

---

## P11-T327 — Include Critical Gap Areas

**Priority:** P0

---

## P11-T328 — Keep Questions Relevant to Candidate Experience

**Priority:** P0

---

## P11-T329 — Avoid Pretending to Reproduce Exact Employer Interview

**Priority:** P0

---

# Workstream AK — Job Match Results UI

## P11-T330 — Build Canonical Job Match Results Page

**Priority:** P0

---

## P11-T331 — Show Strong Evidence Areas

**Priority:** P0

---

## P11-T332 — Show Partial Evidence Areas

**Priority:** P0

---

## P11-T333 — Show Missing Evidence Areas

**Priority:** P0

---

## P11-T334 — Show Preparation Gaps

**Priority:** P0

---

## P11-T335 — Show Experience Gaps Separately

**Priority:** P0

---

## P11-T336 — Show Recommended Preparation

**Priority:** P0

---

## P11-T337 — Avoid Giant Percentage as Hero Element

**Priority:** P0

---

## P11-T338 — Avoid Red/Green Overload

**Priority:** P0

---

# Workstream AL — Resume Analysis Results UI

## P11-T339 — Build Canonical Resume Analysis Page

**Priority:** P0

---

## P11-T340 — Start with Executive Summary

**Priority:** P0

---

## P11-T341 — Show Highest-Priority Issues First

**Priority:** P0

---

## P11-T342 — Show Resume Strengths

**Priority:** P0

---

## P11-T343 — Show Interview Risk Areas

**Priority:** P0

---

## P11-T344 — Show Resume-Derived Questions

**Priority:** P0

---

## P11-T345 — Show Preparation Actions

**Priority:** P0

---

## P11-T346 — Avoid Dense Dashboard Layout

**Priority:** P0

---

# Workstream AM — Root-Level Resume UI

## P11-T347 — Build Shared Upload Primitive

**Priority:** P0

---

## P11-T348 — Build Shared Processing State Primitive

**Priority:** P0

---

## P11-T349 — Build Shared Analysis Section Primitive

**Priority:** P0

---

## P11-T350 — Build Shared Evidence Card

**Priority:** P0

---

## P11-T351 — Build Shared Gap Item

**Priority:** P0

---

## P11-T352 — Build Shared Recommendation Item

**Priority:** P0

---

## P11-T353 — Build Shared Requirement Mapping Primitive

**Priority:** P0

---

## P11-T354 — Fix Shared Components Before Individual Pages

**Priority:** P0

---

# Workstream AN — Resume Analysis UX Density

## P11-T355 — Limit Initial Visible Analysis

**Priority:** P0

---

## P11-T356 — Use Progressive Disclosure

**Priority:** P0

---

## P11-T357 — Keep Long Evidence Expandable

**Priority:** P0

---

## P11-T358 — Avoid Showing Every Finding at Once

**Priority:** P0

---

## P11-T359 — Prioritize Action Over Decoration

**Priority:** P0

---

## P11-T360 — Maintain Comfortable Reading Width

**Priority:** P0

---

## P11-T361 — Maintain Strong Typography Hierarchy

**Priority:** P0

---

## P11-T362 — Maintain Calm Light and Dark Modes

**Priority:** P0

---

# Workstream AO — User Review of Parsed Resume

## P11-T363 — Show Parsed Experience

**Priority:** P0

---

## P11-T364 — Show Parsed Skills

**Priority:** P0

---

## P11-T365 — Show Parsed Projects

**Priority:** P0

---

## P11-T366 — Allow User Correction

**Priority:** P0

---

## P11-T367 — Allow Missing Skill Addition

**Priority:** P1

---

## P11-T368 — Allow Incorrect Skill Removal

**Priority:** P0

---

## P11-T369 — Preserve Original Parse Separately

**Priority:** P0

---

## P11-T370 — Track User-Corrected Profile

**Priority:** P0

---

# Workstream AP — AI Parsing Boundary

## P11-T371 — Define AI Parsing Provider Interface

**Priority:** P0

---

## P11-T372 — Keep Deterministic Extraction Separate

**Priority:** P0

---

## P11-T373 — Use Structured Output

**Priority:** P0

---

## P11-T374 — Validate Parsed Output

**Priority:** P0

---

## P11-T375 — Reject Invalid Schema

**Priority:** P0

---

## P11-T376 — Version Parsing Prompt

**Priority:** P0

---

## P11-T377 — Version Parsing Model

**Priority:** P0

---

## P11-T378 — Store Parsing Provenance

**Priority:** P0

---

# Workstream AQ — AI Analysis Boundary

## P11-T379 — Define Resume Analysis Provider Interface

**Priority:** P0

---

## P11-T380 — Separate Parsing from Analysis

**Priority:** P0

---

## P11-T381 — Separate Analysis from Rewriting

**Priority:** P0

---

## P11-T382 — Separate Job Matching from Resume Quality

**Priority:** P0

---

## P11-T383 — Provide Structured Context

**Priority:** P0

---

## P11-T384 — Require Evidence References

**Priority:** P0

---

## P11-T385 — Require Structured Output

**Priority:** P0

---

## P11-T386 — Reject Unsupported Findings

**Priority:** P0

---

# Workstream AR — Resume Prompt Injection Protection

## P11-T387 — Treat Resume Text as Untrusted Data

**Priority:** P0

---

## P11-T388 — Treat Job Description as Untrusted Data

**Priority:** P0

---

## P11-T389 — Delimit Documents Clearly

**Priority:** P0

---

## P11-T390 — Prevent Document Text from Overriding Instructions

**Priority:** P0

---

## P11-T391 — Validate Structured Output

**Priority:** P0

---

## P11-T392 — Prevent Tool Instructions from Resume Content

**Priority:** P0

---

## P11-T393 — Avoid Exposing Internal Prompts

**Priority:** P0

---

# Workstream AS — Resume Rewriting Foundation

## P11-T394 — Define Rewrite Scope

**Priority:** P1

---

## P11-T395 — Rewrite Only Using User-Provided Facts

**Priority:** P0

---

## P11-T396 — Preserve Meaning

**Priority:** P0

---

## P11-T397 — Improve Clarity

**Priority:** P1

---

## P11-T398 — Improve Concision

**Priority:** P1

---

## P11-T399 — Improve Action Orientation

**Priority:** P1

---

## P11-T400 — Never Invent Metrics

**Priority:** P0

---

## P11-T401 — Never Inflate Seniority

**Priority:** P0

---

## P11-T402 — Never Add Unverified Skills

**Priority:** P0

---

# Workstream AT — Resume Versioning

## P11-T403 — Define Resume Version

**Priority:** P0

---

## P11-T404 — Preserve Historical Resume Analysis

**Priority:** P0

---

## P11-T405 — Associate Analysis with Resume Version

**Priority:** P0

---

## P11-T406 — Associate Job Match with Resume Version

**Priority:** P0

---

## P11-T407 — Associate Preparation Plan with Resume Version

**Priority:** P1

---

## P11-T408 — Mark Active Resume Version

**Priority:** P0

---

## P11-T409 — Avoid Silently Replacing Historical Context

**Priority:** P0

---

# Workstream AU — Job Description Versioning

## P11-T410 — Define Job Target ID

**Priority:** P0

---

## P11-T411 — Define Job Description Version

**Priority:** P1

---

## P11-T412 — Preserve Original Input

**Priority:** P0

---

## P11-T413 — Associate Match Analysis with Version

**Priority:** P0

---

## P11-T414 — Associate Preparation Plan with Version

**Priority:** P0

---

## P11-T415 — Avoid Mutating Historical Match Results

**Priority:** P0

---

# Workstream AV — Resume Analysis Jobs

## P11-T416 — Define Analysis Job Queue

**Priority:** P0

---

## P11-T417 — Define Processing Status

**Priority:** P0

---

## P11-T418 — Define Retry Count

**Priority:** P0

---

## P11-T419 — Define Failure Reason

**Priority:** P0

---

## P11-T420 — Make Analysis Idempotent

**Priority:** P0

---

## P11-T421 — Prevent Duplicate Analysis Jobs

**Priority:** P0

---

## P11-T422 — Define Dead-Letter Handling

**Priority:** P1

---

# Workstream AW — Resume Analysis Cost

## P11-T423 — Measure Parsing Cost

**Priority:** P0

---

## P11-T424 — Measure Analysis Cost

**Priority:** P0

---

## P11-T425 — Measure Job Match Cost

**Priority:** P0

---

## P11-T426 — Measure Preparation Generation Cost

**Priority:** P0

---

## P11-T427 — Cache Immutable Results

**Priority:** P0

---

## P11-T428 — Avoid Re-Analysing Unchanged Resume

**Priority:** P0

---

## P11-T429 — Avoid Re-Parsing Unchanged Job Description

**Priority:** P0

---

## P11-T430 — Define Per-User Usage Limits

**Priority:** P0

---

# Workstream AX — Resume Privacy

## P11-T431 — Define Resume Privacy Policy

**Priority:** P0

---

## P11-T432 — Define File Retention

**Priority:** P0

---

## P11-T433 — Define Extracted Text Retention

**Priority:** P0

---

## P11-T434 — Define Analysis Retention

**Priority:** P0

---

## P11-T435 — Allow Resume Deletion

**Priority:** P0

---

## P11-T436 — Delete Associated File References Safely

**Priority:** P0

---

## P11-T437 — Define Historical Analysis Deletion Behaviour

**Priority:** P0

---

## P11-T438 — Prevent Resume Data in Public Pages

**Priority:** P0

---

## P11-T439 — Prevent Resume Data in Search Indexes

**Priority:** P0

---

## P11-T440 — Prevent Sensitive Resume Content in Logs

**Priority:** P0

---

# Workstream AY — Personal Data Minimization

## P11-T441 — Identify Data Required for Preparation

**Priority:** P0

---

## P11-T442 — Avoid Unnecessary Contact Data Processing

**Priority:** P0

---

## P11-T443 — Avoid Displaying Contact Details in Analysis

**Priority:** P0

---

## P11-T444 — Avoid Sending Unnecessary Personal Data to AI Provider

**Priority:** P0

---

## P11-T445 — Redact Irrelevant Sensitive Fields Where Appropriate

**Priority:** P1

---

## P11-T446 — Document Provider Data Boundary

**Priority:** P0

---

# Workstream AZ — Resume Security

## P11-T447 — Enforce Authentication

**Priority:** P0

---

## P11-T448 — Enforce Resume Ownership

**Priority:** P0

---

## P11-T449 — Enforce Job Target Ownership

**Priority:** P0

---

## P11-T450 — Enforce Analysis Ownership

**Priority:** P0

---

## P11-T451 — Enforce Preparation Plan Ownership

**Priority:** P0

---

## P11-T452 — Prevent IDOR

**Priority:** P0

---

## P11-T453 — Rate Limit Uploads

**Priority:** P0

---

## P11-T454 — Rate Limit Analysis

**Priority:** P0

---

## P11-T455 — Validate Every File Access

**Priority:** P0

---

# Workstream BA — Backend Resume APIs

## P11-T456 — Define Upload Resume Endpoint

**Priority:** P0

---

## P11-T457 — Define Resume Processing Status Endpoint

**Priority:** P0

---

## P11-T458 — Define Parsed Resume Endpoint

**Priority:** P0

---

## P11-T459 — Define Resume Correction Endpoint

**Priority:** P0

---

## P11-T460 — Define Resume Analysis Endpoint

**Priority:** P0

---

## P11-T461 — Define Resume Analysis Result Endpoint

**Priority:** P0

---

## P11-T462 — Define Resume Delete Endpoint

**Priority:** P0

---

## P11-T463 — Define Job Target Create Endpoint

**Priority:** P0

---

## P11-T464 — Define Job Match Endpoint

**Priority:** P0

---

## P11-T465 — Define Preparation Plan Endpoint

**Priority:** P0

---

# Workstream BB — API Contract Quality

## P11-T466 — Use Explicit Upload Contracts

**Priority:** P0

---

## P11-T467 — Use Explicit Processing Status

**Priority:** P0

---

## P11-T468 — Use Explicit Parsed Resume Schema

**Priority:** P0

---

## P11-T469 — Use Explicit Analysis Schema

**Priority:** P0

---

## P11-T470 — Use Explicit Job Match Schema

**Priority:** P0

---

## P11-T471 — Use Explicit Gap Schema

**Priority:** P0

---

## P11-T472 — Use Explicit Preparation Plan Schema

**Priority:** P0

---

## P11-T473 — Define Stable Error Codes

**Priority:** P0

---

# Workstream BC — Job Match Explanation

## P11-T474 — Show Requirement

**Priority:** P0

---

## P11-T475 — Show Candidate Evidence

**Priority:** P0

---

## P11-T476 — Show Match Status

**Priority:** P0

---

## P11-T477 — Show Why It Matters

**Priority:** P0

---

## P11-T478 — Show Preparation Recommendation

**Priority:** P0

---

## P11-T479 — Show Resume Visibility Recommendation Separately

**Priority:** P0

---

## P11-T480 — Avoid Generic Keyword Match Output

**Priority:** P0

---

# Workstream BD — ATS Compatibility Foundation

## P11-T481 — Define ATS Compatibility Scope

**Priority:** P1

---

## P11-T482 — Check Parseability

**Priority:** P1

---

## P11-T483 — Check Section Clarity

**Priority:** P1

---

## P11-T484 — Check Text Extraction Quality

**Priority:** P1

---

## P11-T485 — Check Common Structural Risks

**Priority:** P1

---

## P11-T486 — Avoid Claiming Knowledge of Every ATS

**Priority:** P0

---

## P11-T487 — Avoid Guaranteed ATS Pass Claims

**Priority:** P0

---

## P11-T488 — Explain Compatibility as General Guidance

**Priority:** P0

---

# Workstream BE — Resume Analysis Reliability

## P11-T489 — Build Resume Benchmark Dataset

**Priority:** P0

---

## P11-T490 — Include Junior Resume Examples

**Priority:** P0

---

## P11-T491 — Include Mid-Level Resume Examples

**Priority:** P0

---

## P11-T492 — Include Senior Resume Examples

**Priority:** P0

---

## P11-T493 — Include Career Transition Examples

**Priority:** P1

---

## P11-T494 — Include Dense Resume Examples

**Priority:** P0

---

## P11-T495 — Include Poorly Structured Resume Examples

**Priority:** P0

---

## P11-T496 — Include Multi-Column Resume Examples

**Priority:** P1

---

## P11-T497 — Include Scanned Resume Examples

**Priority:** P1

---

# Workstream BF — Parsing Benchmarking

## P11-T498 — Benchmark Experience Extraction

**Priority:** P0

---

## P11-T499 — Benchmark Skill Extraction

**Priority:** P0

---

## P11-T500 — Benchmark Project Extraction

**Priority:** P0

---

## P11-T501 — Benchmark Date Extraction

**Priority:** P0

---

## P11-T502 — Benchmark Section Classification

**Priority:** P0

---

## P11-T503 — Measure False Skill Extraction

**Priority:** P0

---

## P11-T504 — Measure Missing Skill Extraction

**Priority:** P0

---

## P11-T505 — Block Severe Parser Regression

**Priority:** P0

---

# Workstream BG — Job Match Benchmarking

## P11-T506 — Create Resume-to-JD Benchmark Pairs

**Priority:** P0

---

## P11-T507 — Define Human-Reviewed Requirement Mapping

**Priority:** P0

---

## P11-T508 — Define Expected Strong Matches

**Priority:** P0

---

## P11-T509 — Define Expected Partial Matches

**Priority:** P0

---

## P11-T510 — Define Expected Gaps

**Priority:** P0

---

## P11-T511 — Measure False Gap Generation

**Priority:** P0

---

## P11-T512 — Measure Missed Critical Gaps

**Priority:** P0

---

## P11-T513 — Detect Match Regression

**Priority:** P0

---

# Workstream BH — Preparation Recommendation Reliability

## P11-T514 — Verify Recommended Topics Exist

**Priority:** P0

---

## P11-T515 — Verify Recommended Questions Exist

**Priority:** P0

---

## P11-T516 — Verify Recommendation Scope

**Priority:** P0

---

## P11-T517 — Prevent Broken Content References

**Priority:** P0

---

## P11-T518 — Prevent Irrelevant Preparation Recommendations

**Priority:** P0

---

## P11-T519 — Explain Recommendation Reason

**Priority:** P0

---

# Workstream BI — Resume and Dashboard Integration

## P11-T520 — Show Active Resume Context

**Priority:** P1

---

## P11-T521 — Show Resume Preparation Priorities

**Priority:** P0

---

## P11-T522 — Show Job Target Priorities

**Priority:** P0

---

## P11-T523 — Show Resume Defense Action

**Priority:** P0

---

## P11-T524 — Show Job-Specific Mock Interview Action

**Priority:** P0

---

## P11-T525 — Avoid Turning Dashboard into Resume Analytics Screen

**Priority:** P0

---

# Workstream BJ — Daily Preparation Integration

## P11-T526 — Add High-Priority Resume Topic to Daily Plan

**Priority:** P1

---

## P11-T527 — Add Critical Job Gap to Daily Plan

**Priority:** P1

---

## P11-T528 — Add Resume Defense Question

**Priority:** P1

---

## P11-T529 — Respect Daily Workload Limits

**Priority:** P0

---

## P11-T530 — Avoid Replacing Entire Preparation Track Automatically

**Priority:** P0

---

# Workstream BK — Search Integration

## P11-T531 — Map Resume Skills to Search

**Priority:** P1

---

## P11-T532 — Provide Direct Search for Missing Topics

**Priority:** P1

---

## P11-T533 — Provide Direct Search for Resume Technologies

**Priority:** P1

---

## P11-T534 — Avoid Indexing Personal Search Context

**Priority:** P0

---

# Workstream BL — Content Gap Discovery

## P11-T535 — Detect Required Job Skills Without Canonical Content

**Priority:** P1

---

## P11-T536 — Detect Resume Skills Without Canonical Content

**Priority:** P1

---

## P11-T537 — Log Internal Content Coverage Gaps

**Priority:** P1

---

## P11-T538 — Do Not Expose Internal Content Gaps as Product Errors

**Priority:** P0

---

## P11-T539 — Use Aggregate Demand to Inform Future Content

**Priority:** P2

---

## P11-T540 — Protect User Privacy in Aggregate Analysis

**Priority:** P0

---

# Workstream BM — Multi-Resume Support

## P11-T541 — Define Multiple Resume Versions

**Priority:** P1

---

## P11-T542 — Define Active Resume

**Priority:** P0

---

## P11-T543 — Allow Resume Selection per Job Target

**Priority:** P1

---

## P11-T544 — Preserve Analysis per Resume

**Priority:** P0

---

## P11-T545 — Avoid Mixing Evidence Across Resume Versions

**Priority:** P0

---

# Workstream BN — Multiple Job Targets

## P11-T546 — Support Multiple Job Targets

**Priority:** P1

---

## P11-T547 — Associate Target Role

**Priority:** P0

---

## P11-T548 — Associate Job Description

**Priority:** P0

---

## P11-T549 — Associate Resume Version

**Priority:** P0

---

## P11-T550 — Associate Preparation Plan

**Priority:** P0

---

## P11-T551 — Archive Old Job Targets

**Priority:** P1

---

# Workstream BO — Resume Comparison

## P11-T552 — Define Resume Version Comparison

**Priority:** P1

---

## P11-T553 — Show Structural Improvements

**Priority:** P1

---

## P11-T554 — Show Evidence Improvements

**Priority:** P1

---

## P11-T555 — Show Target Role Relevance Changes

**Priority:** P1

---

## P11-T556 — Avoid Fake Score Improvement Narratives

**Priority:** P0

---

# Workstream BP — Job Target Workflow

## P11-T557 — Create Job Target

**Priority:** P0

---

## P11-T558 — Attach Resume

**Priority:** P0

---

## P11-T559 — Add Job Description

**Priority:** P0

---

## P11-T560 — Parse Requirements

**Priority:** P0

---

## P11-T561 — Match Candidate Evidence

**Priority:** P0

---

## P11-T562 — Identify Gaps

**Priority:** P0

---

## P11-T563 — Generate Preparation Priorities

**Priority:** P0

---

## P11-T564 — Start Job-Specific Preparation

**Priority:** P0

---

# Workstream BQ — Public Resume SEO Pages

## P11-T565 — Define Public Resume Resource Strategy Separately

**Priority:** P1

---

## P11-T566 — Do Not Expose User Resume Data Publicly

**Priority:** P0

---

## P11-T567 — Noindex Personal Resume Analysis

**Priority:** P0

---

## P11-T568 — Noindex Personal Job Match Results

**Priority:** P0

---

## P11-T569 — Noindex Resume Files

**Priority:** P0

---

## P11-T570 — Exclude Personal Resume Routes from Sitemap

**Priority:** P0

---

## P11-T571 — Prevent Resume Content in Metadata

**Priority:** P0

---

# Workstream BR — Public SEO Opportunity

## P11-T572 — Define Public Resume Interview Guide Pages

Potential examples:

```text
Java Developer Resume Interview Questions
Spring Boot Resume Interview Questions
Backend Developer Resume Interview Questions
Data Analyst Resume Interview Questions
```

**Priority:** P1

---

## P11-T573 — Keep Public Guides Separate from User Analysis

**Priority:** P0

---

## P11-T574 — Use Canonical Public Content

**Priority:** P0

---

## P11-T575 — Avoid Programmatic Thin Resume Pages

**Priority:** P0

---

## P11-T576 — Define Search Intent Before Creating Public Pages

**Priority:** P0

---

# Workstream BS — Analytics

## P11-T577 — Track Resume Upload

**Priority:** P1

---

## P11-T578 — Track Resume Processing Completion

**Priority:** P1

---

## P11-T579 — Track Resume Analysis Completion

**Priority:** P1

---

## P11-T580 — Track Job Target Creation

**Priority:** P1

---

## P11-T581 — Track Job Match Completion

**Priority:** P1

---

## P11-T582 — Track Preparation Plan Start

**Priority:** P1

---

## P11-T583 — Track Resume Defense Start

**Priority:** P1

---

## P11-T584 — Track Job-Specific Mock Start

**Priority:** P1

---

## P11-T585 — Protect Resume Content from Analytics

**Priority:** P0

---

# Workstream BT — Observability

## P11-T586 — Log Resume Processing Lifecycle

**Priority:** P0

---

## P11-T587 — Log Extraction Failures

**Priority:** P0

---

## P11-T588 — Log Parsing Failures

**Priority:** P0

---

## P11-T589 — Log Analysis Failures

**Priority:** P0

---

## P11-T590 — Log Job Match Failures

**Priority:** P0

---

## P11-T591 — Track Processing Latency

**Priority:** P0

---

## P11-T592 — Track Analysis Cost

**Priority:** P0

---

## P11-T593 — Track Parser Version

**Priority:** P0

---

## P11-T594 — Protect Personal Content in Logs

**Priority:** P0

---

# Workstream BU — Failure Handling

## P11-T595 — Handle Unsupported File

**Priority:** P0

---

## P11-T596 — Handle Corrupted File

**Priority:** P0

---

## P11-T597 — Handle Empty Extraction

**Priority:** P0

---

## P11-T598 — Handle Parser Failure

**Priority:** P0

---

## P11-T599 — Handle AI Provider Failure

**Priority:** P0

---

## P11-T600 — Handle Invalid Analysis Output

**Priority:** P0

---

## P11-T601 — Preserve Uploaded Resume on Recoverable Failure

**Priority:** P0

---

## P11-T602 — Allow Safe Retry

**Priority:** P0

---

# Workstream BV — Mobile Resume Experience

## P11-T603 — Build Mobile Upload Experience

**Priority:** P0

---

## P11-T604 — Support Mobile File Picker

**Priority:** P0

---

## P11-T605 — Keep Processing State Clear

**Priority:** P0

---

## P11-T606 — Make Analysis Readable on Small Screens

**Priority:** P0

---

## P11-T607 — Avoid Wide Requirement Tables

**Priority:** P0

---

## P11-T608 — Use Stacked Evidence Presentation

**Priority:** P0

---

## P11-T609 — Keep Primary Actions Reachable

**Priority:** P0

---

# Workstream BW — Accessibility

## P11-T610 — Make Upload Control Accessible

**Priority:** P0

---

## P11-T611 — Announce Processing State

**Priority:** P0

---

## P11-T612 — Ensure Analysis Structure Uses Semantic Headings

**Priority:** P0

---

## P11-T613 — Avoid Colour-Only Gap Indicators

**Priority:** P0

---

## P11-T614 — Ensure Expandable Evidence Is Keyboard Accessible

**Priority:** P0

---

## P11-T615 — Ensure Job Match Results Are Screen-Reader Friendly

**Priority:** P0

---

# Workstream BX — Performance

## P11-T616 — Define Upload Performance Budget

**Priority:** P0

---

## P11-T617 — Process Heavy Analysis Asynchronously

**Priority:** P0

---

## P11-T618 — Avoid Blocking UI on Full Analysis

**Priority:** P0

---

## P11-T619 — Load Analysis Sections Progressively

**Priority:** P1

---

## P11-T620 — Avoid Repeated Large Document Transfer

**Priority:** P0

---

## P11-T621 — Cache Stable Structured Profile

**Priority:** P0

---

# Workstream BY — Root-Level Backend Architecture

## P11-T622 — Centralize Resume Storage

**Priority:** P0

---

## P11-T623 — Centralize Text Extraction

**Priority:** P0

---

## P11-T624 — Centralize Resume Parsing

**Priority:** P0

---

## P11-T625 — Centralize Candidate Profile Generation

**Priority:** P0

---

## P11-T626 — Centralize Skill Normalization

**Priority:** P0

---

## P11-T627 — Centralize Job Parsing

**Priority:** P0

---

## P11-T628 — Centralize Requirement Matching

**Priority:** P0

---

## P11-T629 — Centralize Gap Analysis

**Priority:** P0

---

## P11-T630 — Centralize Preparation Mapping

**Priority:** P0

---

## P11-T631 — Avoid Resume Business Logic in UI

**Priority:** P0

---

# Workstream BZ — Resume Acceptance Scenarios

## P11-T632 — User Uploads Valid PDF

**Priority:** P0

---

## P11-T633 — User Uploads Valid DOCX

**Priority:** P0

---

## P11-T634 — User Uploads Unsupported File

**Priority:** P0

---

## P11-T635 — Resume Text Extracts Correctly

**Priority:** P0

---

## P11-T636 — Resume Parsing Completes

**Priority:** P0

---

## P11-T637 — User Reviews Parsed Profile

**Priority:** P0

---

## P11-T638 — User Corrects Parsed Skill

**Priority:** P0

---

## P11-T639 — Resume Analysis Completes

**Priority:** P0

---

## P11-T640 — Resume-Derived Questions Are Generated

**Priority:** P0

---

## P11-T641 — Preparation Plan Is Generated

**Priority:** P0

---

# Workstream CA — Job Match Acceptance Scenarios

## P11-T642 — User Adds Job Description

**Priority:** P0

---

## P11-T643 — Requirements Are Parsed

**Priority:** P0

---

## P11-T644 — Required Skills Are Identified

**Priority:** P0

---

## P11-T645 — Candidate Evidence Is Matched

**Priority:** P0

---

## P11-T646 — Partial Evidence Is Distinguished

**Priority:** P0

---

## P11-T647 — Missing Evidence Is Distinguished from Missing Skill

**Priority:** P0

---

## P11-T648 — Preparation Gaps Are Generated

**Priority:** P0

---

## P11-T649 — Experience Gaps Are Shown Separately

**Priority:** P0

---

## P11-T650 — Job-Specific Preparation Plan Is Created

**Priority:** P0

---

## P11-T651 — Job-Specific Mock Interview Can Be Started

**Priority:** P0

---

# Workstream CB — Security Acceptance Scenarios

## P11-T652 — User Cannot Access Another User’s Resume

**Priority:** P0

---

## P11-T653 — User Cannot Access Another User’s Analysis

**Priority:** P0

---

## P11-T654 — User Cannot Access Another User’s Job Target

**Priority:** P0

---

## P11-T655 — Resume File Is Not Publicly Accessible

**Priority:** P0

---

## P11-T656 — Resume Content Does Not Enter Public Metadata

**Priority:** P0

---

## P11-T657 — Resume Content Does Not Enter Analytics Payload

**Priority:** P0

---

## P11-T658 — Resume Prompt Injection Does Not Override Analysis

**Priority:** P0

---

# Workstream CC — Reliability Acceptance Scenarios

## P11-T659 — Parser Does Not Confuse Java and JavaScript

**Priority:** P0

---

## P11-T660 — Skill Mention Is Not Automatically Strong Evidence

**Priority:** P0

---

## P11-T661 — Missing Resume Skill Is Not Automatically Declared Missing Knowledge

**Priority:** P0

---

## P11-T662 — Generic Job Requirement Does Not Create False Gap

**Priority:** P0

---

## P11-T663 — Resume Rewrite Does Not Invent Metrics

**Priority:** P0

---

## P11-T664 — Resume Rewrite Does Not Invent Skills

**Priority:** P0

---

## P11-T665 — Match Result Preserves Evidence

**Priority:** P0

---

## P11-T666 — Preparation Recommendation Maps to Real Content

**Priority:** P0

---

# Workstream CD — Legacy Resume Migration

## P11-T667 — Inventory Existing Resume Records

**Priority:** P0

---

## P11-T668 — Inventory Existing Analysis Records

**Priority:** P0

---

## P11-T669 — Determine Migration Eligibility

**Priority:** P0

---

## P11-T670 — Map Existing Files

**Priority:** P0

---

## P11-T671 — Map Existing Parsed Data

**Priority:** P0

---

## P11-T672 — Preserve Valid Historical Analysis

**Priority:** P0

---

## P11-T673 — Mark Unsupported Analysis Versions

**Priority:** P0

---

## P11-T674 — Document Migration Exceptions

**Priority:** P0

---

# Workstream CE — Legacy Resume Cleanup

## P11-T675 — Remove Duplicate Upload Flows

**Priority:** P0

---

## P11-T676 — Remove Duplicate Parsers

**Priority:** P0

---

## P11-T677 — Remove Keyword-Only Matching Logic

**Priority:** P0

---

## P11-T678 — Remove Unsupported ATS Scores

**Priority:** P0

---

## P11-T679 — Remove Dead Resume Prompts

**Priority:** P0

---

## P11-T680 — Remove Duplicate Analysis Paths

**Priority:** P0

---

## P11-T681 — Remove Client-Side Resume Business Logic

**Priority:** P0

---

## P11-T682 — Remove Publicly Exposed Resume Assets

**Priority:** P0

---

# Workstream CF — Phase Completion

## P11-T683 — Freeze Resume Product Definition

**Priority:** P0

---

## P11-T684 — Freeze Resume Document Contract

**Priority:** P0

---

## P11-T685 — Freeze Extraction Contract

**Priority:** P0

---

## P11-T686 — Freeze Parsing Contract

**Priority:** P0

---

## P11-T687 — Freeze Candidate Profile Contract

**Priority:** P0

---

## P11-T688 — Freeze Candidate Claim Contract

**Priority:** P0

---

## P11-T689 — Freeze Skill Taxonomy

**Priority:** P0

---

## P11-T690 — Freeze Job Requirement Contract

**Priority:** P0

---

## P11-T691 — Freeze Matching Contract

**Priority:** P0

---

## P11-T692 — Freeze Gap Classification

**Priority:** P0

---

## P11-T693 — Freeze Interview Exposure Model

**Priority:** P0

---

## P11-T694 — Freeze Preparation Priority Model

**Priority:** P0

---

## P11-T695 — Freeze Resume-to-Preparation Bridge

**Priority:** P0

---

## P11-T696 — Freeze Resume Security Model

**Priority:** P0

---

## P11-T697 — Publish Resume Processing Architecture

**Priority:** P0

---

## P11-T698 — Publish Resume-to-Job Matching Flow

**Priority:** P0

---

## P11-T699 — Publish Resume-to-Interview Preparation Flow

**Priority:** P0

---

## P11-T700 — Produce Phase 11 Completion Report

Document:

* current resume system audit,
* resume product model,
* secure upload architecture,
* extraction architecture,
* parsing architecture,
* candidate profile,
* candidate claims,
* claim defensibility,
* resume-derived interview questions,
* resume analysis dimensions,
* improvement guidance,
* job description parsing,
* skill taxonomy,
* evidence mapping,
* resume-to-job matching,
* gap classification,
* interview risk,
* interview exposure,
* preparation priority,
* resume defense,
* resume-based mock interviews,
* job-specific mock interviews,
* privacy,
* security,
* AI boundaries,
* cost,
* reliability,
* benchmarking,
* migration,
* legacy cleanup.

**Priority:** P0

---

# Phase 11 Exit Criteria

Phase 11 is complete when Interview Explainer has:

* secure resume upload,
* reliable PDF and DOCX extraction,
* structured resume parsing,
* user-correctable candidate profiles,
* canonical skill normalization,
* resume claim extraction,
* claim-to-interview mapping,
* resume-derived interview questions,
* resume defense preparation,
* job description parsing,
* structured job requirements,
* evidence-based resume-to-job matching,
* clear separation of missing skill and missing evidence,
* skill-gap analysis,
* experience-gap analysis,
* interview risk analysis,
* preparation priority generation,
* personalized preparation plans,
* resume-based mock interviews,
* job-specific mock interviews,
* private resume storage,
* safe AI processing,
* prompt injection protection,
* analysis benchmarking,
* cost controls,
* mobile support,
* accessible analysis,
* migration of valid legacy data,
* removal of obsolete resume systems.

---

# Phase 11 Core Principle

```text
DO NOT BUILD:

UPLOAD RESUME
      ↓
SEND ENTIRE FILE TO AI
      ↓
GET 82/100
      ↓
SHOW GENERIC SUGGESTIONS
```

Build:

```text
SECURE DOCUMENT
      ↓
TEXT EXTRACTION
      ↓
STRUCTURED PARSING
      ↓
USER-VERIFIED PROFILE
      ↓
CLAIMS + SKILLS + EXPERIENCE
      ↓
TARGET ROLE / JOB REQUIREMENTS
      ↓
EVIDENCE MAPPING
      ↓
GAP CLASSIFICATION
      ↓
INTERVIEW EXPOSURE
      ↓
PREPARATION PRIORITIES
      ↓
CANONICAL CONTENT
      +
PRACTICE
      +
MOCK INTERVIEW
```

---

# The Most Important Concept: Resume Claims

Every important resume bullet creates potential interview exposure.

Example:

```text
Built and maintained
Spring Boot microservices
serving high-volume traffic.
```

The system should not only say:

```text
SPRING BOOT DETECTED
```

It should understand potential preparation areas:

```text
SPRING BOOT FUNDAMENTALS
DEPENDENCY INJECTION
REST API DESIGN
ERROR HANDLING
DATABASE TRANSACTIONS
MICROSERVICE COMMUNICATION
OBSERVABILITY
PERFORMANCE
SCALING
FAILURE HANDLING
```

And claim-defense questions:

```text
What exactly did you build?

What part did you personally own?

Why did you use Spring Boot?

How were the services structured?

How did services communicate?

What failures occurred?

How did you debug production issues?

What was the traffic volume?

How was that volume measured?

What would break first at 10x scale?
```

This is where Interview Explainer can become significantly more useful than a generic resume checker.

---

# Gap Classification Model

The product must not treat all gaps equally.

```text
GAP TYPE 1
KNOWLEDGE GAP

The candidate needs to learn the topic.
```

```text
GAP TYPE 2
PREPARATION GAP

The candidate has experience,
but cannot yet explain it deeply.
```

```text
GAP TYPE 3
EVIDENCE GAP

The candidate may have the skill,
but the resume does not demonstrate it.
```

```text
GAP TYPE 4
EXPERIENCE GAP

The role asks for experience
the candidate does not currently demonstrate.
```

```text
GAP TYPE 5
VISIBILITY GAP

The candidate has relevant evidence,
but it is poorly communicated in the resume.
```

```text
GAP TYPE 6
UNVERIFIED GAP

The available information is insufficient
to determine whether a real gap exists.
```

This classification is critical because:

```text
NOT EVERY GAP
SHOULD PRODUCE
“GO LEARN THIS TOPIC.”
```

---

# Resume-to-Interview Bridge

The final Phase 11 system should create this flow:

```text
RESUME CLAIM
      ↓
INTERVIEW EXPOSURE
      ↓
QUESTION MAPPING
      ↓
PREPARATION CHECK
      ↓
WEAKNESS DETECTION
      ↓
TARGETED LEARNING
      ↓
PRACTICE
      ↓
RESUME-BASED MOCK INTERVIEW
```

Example:

```text
RESUME:

“Automated a 12-stage CI/CD pipeline
using Python, Shell and Groovy.”
```

The system can derive:

```text
CLAIMS

CI/CD
JENKINS
PIPELINE AUTOMATION
PYTHON
SHELL
GROOVY
AUTOMATION OWNERSHIP
```

Then:

```text
INTERVIEW EXPOSURE

How was the pipeline structured?

Why were there 12 stages?

What happened when a stage failed?

How did you make the pipeline idempotent?

How were credentials handled?

What logic was implemented in Groovy?

What logic was implemented in Python?

Why was the work split across languages?

How did you measure improvement?

What would you redesign today?
```

Then:

```text
PREPARATION PLAN

1. Jenkins pipeline architecture
2. CI/CD fundamentals
3. Failure handling
4. Pipeline security
5. Python automation
6. Shell scripting
7. Groovy pipeline concepts
8. Personal project explanation
```

That is a genuine Interview Explainer product loop.

---

# Relationship with Previous Phases

```text
CONTENT
   ↓
Defines what can be learned

QUESTION SYSTEM
   ↓
Defines what can be asked

USER SYSTEM
   ↓
Knows the candidate

PRACTICE SYSTEM
   ↓
Builds preparation

MOCK INTERVIEW
   ↓
Measures interview performance

RESUME INTELLIGENCE
   ↓
DETERMINES WHAT THIS
SPECIFIC CANDIDATE
SHOULD PREPARE FOR
```

---

# Root-Level Product Rule

If job matching feels inaccurate:

```text
DO NOT
JUST IMPROVE THE AI PROMPT
```

Fix:

```text
SKILL TAXONOMY
+
REQUIREMENT MODEL
+
EVIDENCE MODEL
+
MATCH CLASSIFICATION
+
TRACEABILITY
```

If resume recommendations feel generic:

```text
DO NOT
ASK AI TO BE MORE PERSONALIZED
```

Fix:

```text
RESUME CLAIMS
+
TARGET ROLE
+
JOB REQUIREMENTS
+
CANDIDATE EVIDENCE
+
INTERVIEW EXPOSURE
```

If resume analysis becomes too dense:

```text
DO NOT
ADD MORE CARDS
```

Fix:

```text
PRIORITY
+
HIERARCHY
+
PROGRESSIVE DISCLOSURE
+
ACTIONABLE NEXT STEP
```

---

# Recommended Implementation Order

```text
1. AUDIT CURRENT RESUME SYSTEM
        ↓
2. FREEZE RESUME PRODUCT MODEL
        ↓
3. BUILD SECURE FILE STORAGE
        ↓
4. BUILD TEXT EXTRACTION
        ↓
5. BUILD STRUCTURED PARSER
        ↓
6. BUILD USER REVIEW FLOW
        ↓
7. BUILD CANDIDATE PROFILE
        ↓
8. BUILD SKILL TAXONOMY
        ↓
9. BUILD CLAIM MODEL
        ↓
10. BUILD RESUME ANALYSIS
        ↓
11. BUILD JOB DESCRIPTION PARSER
        ↓
12. BUILD REQUIREMENT MODEL
        ↓
13. BUILD EVIDENCE MATCHING
        ↓
14. BUILD GAP CLASSIFICATION
        ↓
15. BUILD INTERVIEW EXPOSURE
        ↓
16. BUILD PREPARATION PRIORITY ENGINE
        ↓
17. CONNECT TO CONTENT
        ↓
18. CONNECT TO PRACTICE
        ↓
19. CONNECT TO MOCK INTERVIEWS
        ↓
20. SECURITY + PRIVACY + BENCHMARKING
        ↓
21. MIGRATE VALID LEGACY DATA
        ↓
22. REMOVE LEGACY SYSTEMS
```

---

# Recommended Phase 11 Directory

```text
docs/v2/tasks/PHASE_11/
│
├── README.md
├── 00_PHASE_OVERVIEW.md
├── 01_CURRENT_RESUME_AUDIT.md
├── 02_RESUME_PRODUCT_MODEL.md
├── 03_SECURE_UPLOAD_ARCHITECTURE.md
├── 04_EXTRACTION_AND_PARSING.md
├── 05_CANDIDATE_PROFILE.md
├── 06_RESUME_CLAIMS.md
├── 07_SKILL_TAXONOMY.md
├── 08_RESUME_ANALYSIS.md
├── 09_JOB_DESCRIPTION_MODEL.md
├── 10_REQUIREMENT_MATCHING.md
├── 11_GAP_CLASSIFICATION.md
├── 12_INTERVIEW_EXPOSURE.md
├── 13_PREPARATION_PRIORITY.md
├── 14_RESUME_DEFENSE.md
├── 15_RESUME_AND_JOB_MOCKS.md
├── 16_SECURITY_AND_PRIVACY.md
├── 17_RELIABILITY_AND_COST.md
├── 18_UI_AND_ACCESSIBILITY.md
├── 19_LEGACY_MIGRATION_CLEANUP.md
└── 20_COMPLETION_REPORT.md
```

---

# Phase 11 Summary

```text
700 TASKS

PRIMARY FOCUS:

RESUME UPLOAD
SECURE FILE HANDLING
TEXT EXTRACTION
RESUME PARSING
CANDIDATE PROFILE
RESUME CLAIMS
CLAIM DEFENSIBILITY
SKILL TAXONOMY
RESUME ANALYSIS
JOB DESCRIPTION PARSING
JOB REQUIREMENTS
EVIDENCE MATCHING
SKILL GAPS
EVIDENCE GAPS
EXPERIENCE GAPS
INTERVIEW RISKS
INTERVIEW EXPOSURE
PREPARATION PRIORITIES
RESUME DEFENSE
RESUME-BASED MOCK INTERVIEWS
JOB-SPECIFIC MOCK INTERVIEWS
PRIVACY
SECURITY
AI RELIABILITY
COST CONTROL
LEGACY CLEANUP
```

---

# Next Phase

```text
PHASE 12

JOB DISCOVERY,
JOB TRACKING,
APPLICATION WORKSPACE,
COMPANY & ROLE INTELLIGENCE,
JOB-TO-PREPARATION ORCHESTRATION
&
CAREER OPPORTUNITY PIPELINE
```

Phase 12 should connect:

```text
FIND JOB
   ↓
SAVE JOB
   ↓
UNDERSTAND JOB
   ↓
MATCH RESUME
   ↓
IDENTIFY GAPS
   ↓
PREPARE
   ↓
APPLY
   ↓
TRACK APPLICATION
   ↓
PREPARE FOR INTERVIEW
```

This turns Interview Explainer from:

```text
A WEBSITE WHERE PEOPLE
READ INTERVIEW QUESTIONS
```

into:

```text
A SYSTEM THAT CONNECTS

CAREER TARGET
      ↓
JOB OPPORTUNITY
      ↓
RESUME
      ↓
PREPARATION
      ↓
PRACTICE
      ↓
MOCK INTERVIEW
      ↓
REAL INTERVIEW
```
