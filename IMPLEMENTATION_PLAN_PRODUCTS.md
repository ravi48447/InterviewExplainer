# InterviewExplainer — Product Plan v2: The Free, Interconnected Interview OS

**Branch baseline:** `codex/home-learning-depth` (HEAD `aaf960a`)
**Constraint:** No LLM. All verification, adaptation, and suggestions are grounded in the human-authored content library.
**v2 mandate:** (1) whole site interconnected, (2) everything free — no paywall, (3) clean/best UI across all three products, (4) Mock Interview rebuilt as the flagship: a REAL-feeling adaptive interview — connected follow-up questions, never a fixed set. 180° changes to existing code/UI are sanctioned where they serve this.

---

## 0. What changed from v1 (and why)

| v1 said | v2 says | Driver |
|---|---|---|
| Pro tier ₹1999, beta-free | **Single free tier.** Billing module retired from the product path; keep only an optional "Support" surface | "free as well" — a paywall fragments the loop; the loop IS the product |
| Mock = question playlist + post-analysis | **Interview Director**: per-turn adaptive engine on an interview graph — probes your weak spots, drills follow-ups you authored content for, pivots when you're strong | "questions asking or connected questions again asked not a fixed set" |
| Topic-level coverage | **Concept-level mastery store** — the atomic interconnection unit shared by all three products | "whole website will become interconnected" |
| UI per product | **One design system + unified app shell**; every screen speaks the same language | "clean and best UI … all these 3 product" |
| AVE only post-interview | **AVE runs every turn, mid-interview** — its output is the Director's branching signal | Real mocks adapt live |

**Content audit that makes this credible** (measured on the branch, 1,236 filled topics):
- `followup_questions` present: **98%** → every topic ships interviewer drill-downs. The Director's probe library already exists.
- `interviewer_intent.to_stand_out`: **99%** → stretch-probe scripts per topic.
- `key_points` sections: **74%** → concept checklists (auto-scoring gracefully degrades where absent).
- `comparison_table`, `common_mistakes`: present across the library → trade-off probes and mistake-pokes.
- Current mock code serves a **hardcoded ~7-question list per domain** (`app/api/mock-interviews/questions/route.ts`) — the exact anti-pattern v2 removes.

---

## 1. The Big Picture: the Career Graph, free and closed-loop

### 1.1 One atomic unit: the Concept
Today the site is a library (topics), a dashboard (mock data), a mock (fixed questions). v2 makes everything address **concepts** — the `key_points` items, `comparison_table` row labels, and topic titles normalized into one registry (`concept_id` like `ruby/active-record/n-plus-one`). Every subsystem writes evidence to the same concept ledger:

```
RESUME (skills found)      →  "you know X" (evidence: claimed)
LEARNING (topic completed) →  "you studied X" (evidence: read)
MOCK (AVE concept match)   →  "you can SAY X" (evidence: spoken under pressure) ← strongest signal
```

Concept mastery = weighted blend (mock-spoken > written-claim > read), decaying over time (SM-2-lite review scheduling). One number per concept, visible everywhere, computed by one service.

### 1.2 The loop (all free)
```
        ┌─────────────┐   gaps    ┌──────────────┐  weak concepts ┌───────────────┐
        │  RESUME     │ ───────► │  DASHBOARD   │ ─────────────► │  MOCK         │
        │  analysis   │          │  mission     │                │  Interview    │
        └─────────────┘          │  control     │                │  Director     │
             ▲                   └─────────────┘                └───────┬───────┘
             │ re-upload                ▲                               │ every turn:
             │ after fixes               │ new evidence (spoke/missed)   │ AVE scores
             └───────────────────────────┴───────────────────────────────┘
```
No walls between products because no feature is gated: resume → gaps appear same-day on dashboard → "Practice now" opens a mock pre-seeded with YOUR weak concepts → report → radar updates → next mock starts where the last ended. A user can enter anywhere; the graph routes them through the loop.

### 1.3 Free, honestly
- `lib/billing.ts` → reduced to a feature-flag stub; `plan` checks collapse to `true`. Pricing page becomes a "Free while we build" + optional supporter tier (no feature gate, ever). Guest users get the full loop locally (localStorage, existing guest-progress merge pattern) — the loop must work BEFORE signup, not after.

---

## 2. Shared Platform (Phase 0 — everything consumes this)

### 2.1 Content Index Service (CIS)
Build-time script over `content/**` producing, per question:
- `concepts[]` (normalized key_points + comparison-table row labels), each mapped to a registry id
- `probes[]` — the adaptive fuel: `followup_questions` (drill-downs), `to_stand_out` (stretch), `interviewer_intent.testing` (what this question is really testing)
- `mistakes[]` (common_mistakes), `tradeoffs[]` (comparison rows), `spoken` (speakable_answer), `deep` (deep_explanation), `difficulty`, `importance`
- corpus text for matching; taxonomy path; cross-links (same-module siblings, shared concepts across topics — the pivot map)

Delivered as static JSON via `/api/v2/*` (pattern exists) **and** loaded into Postgres (Flyway + seeding, pattern exists) for graph queries. Versioned, rebuildable, content tree remains the only source of truth.

### 2.2 Concept Mastery Store
- Table `concept_mastery(user_id, concept_id, strength, last_evidence_type, last_evidence_at, next_review_at)`
- One `MasteryService` (Java) is the only writer; all readers go through it. This is the interconnection contract — nobody computes their own coverage.

### 2.3 Answer Verification Engine (AVE) — deterministic, rubric-grounded
Same contract as v1 but now **streamed per turn** and concept-addressed:
```
verifyTurn(transcript, questionRubric, sessionState) → {
  conceptsHit[], conceptsMissed[], mistakeFlags[],
  depthScore, structureScore (STAR | Def→Mech→Tradeoff→Example),
  rambleIndex (words w/o concept hits), silenceMap,
  signalForDirector: { strongerThanExpected | onTrack | shaky | lost },
  suggestedAnswer { spoken, deep, checklist[] }, nextDrills[]
}
```
Matching: normalization + TF-IDF/BM25 against per-question corpora + curated alias map ("DI"≡"dependency injection", "GC"≡"garbage collection"). Zero models; pluggable `Scorer` seam for the future.

### 2.4 Interview Graph + Director (the flagship engine — detailed in §5)
Per-topic graph: opener → branches (probe / scaffold / poke-mistake / tradeoff / pivot) whose edges are literally the authored `followup_questions`, `to_stand_out`, `common_mistakes`, `comparison_table`. The Director walks it per turn using AVE's signal. Shared because the dashboard ("what should I practice?") and the Director ("what do I ask next?") are the same brain: **gap-ranked concept selection**.

### 2.5 Unified App Shell + Design System (UI, §7)
One shell, one navigation mental model ("Learn / Practice / Analyze / Track"), one token set.

### 2.6 Storage & media
Object storage (MinIO dev / S3 prod) with TTL + hard-delete for recordings and resumes; coturn for TURN; Spring WebSocket signaling. Shared by mock (recordings) and resume (documents) under one retention policy.

---

## 3. Product 1 — Dashboard: Mission Control

### Role in the loop
The single screen where the graph is visible. Not three dashboards — one home that answers "where do I stand, what's next, what happened."

### Core features
1. **Career Graph view (hero):** per-domain concept map — mastered / learning / weak / untested, importance-weighted into one readiness ring per domain. Click a domain → concept clusters, each with evidence provenance icons (claimed via resume / studied / spoken in mock).
2. **Next Best Action card:** one primary CTA, always — e.g. "Mock interview targeting your 7 weakest Spring Security concepts (12 min)" or "Your resume claims Kafka — prove it (3 questions)". Generated by the same selector the Director uses.
3. **Session history, real this time:** replaces the hardcoded results page; per-session report browser (per-concept hits/misses, clips, suggested answers).
4. **Streaks & review queue:** spaced-repetition of decaying concepts; streak = loop engagement, not page views.
5. **Resume readiness panel:** latest analysis snapshot, diff vs previous, "fix then re-upload" flow.
6. **Upcoming/past live mocks** (scheduler card).

### User flow
```
/ → (guest: same, local) → Career Graph
  → weak cluster "Spring Security: 41% — 7 weak concepts"
    → [Mock these now] → Director session pre-seeded (mode=weakness-drill)
    → [Study first] → content reader (marks read-evidence) → graph tint shifts
  → Next Best Action rotates as evidence lands — no manual refresh mental model
```

### Phases
- **D1:** real history + mastery store surfaced (kills mock data) — 1 wk
- **D2:** Career Graph + Next Best Action (needs CIS+Director-selector) — 1.5 wk
- **D3:** review queue, resume panel, scheduler — 1 wk

### Validation
- Fixture users with scripted evidence → ring math is pure function, golden-JSON tests.
- Provenance audit: every concept % traceable to evidence rows (UI tooltip shows the receipt — trust through transparency).
- Playwright: guest loop works pre-signup; merge preserves evidence.

### Risks / assumptions
- Degradation where `key_points` absent (26% of topics) → those topics show topic-level (not concept-level) progress; auto-upgrades as content track resumes.
- Ring math must never feel like a game-y gimmick: importance weighting + evidence provenance visible on hover.

---

## 4. Product 2 — Resume Analysis: the graph's entry point

### Role in the loop
Seeds the graph with "claimed" evidence and produces the first gap list. Free, instant, no signup to see the headline result (signup to persist — guest-first, like everything).

### Core features
1. **Instant upload** (pdf/docx/txt, ≤10 MB) → parse preview with **user-confirmed sections** (never silent-guess; paste-fallback when text extraction is ugly).
2. **Skill map to the taxonomy:** extraction against CIS dictionary + alias map → concepts marked `claimed`. "You list Kubernetes & Kafka — here's how they connect to your target role's graph."
3. **Readiness vs target role / pasted JD:** importance-weighted coverage of the target domain's concept registry; JD mode maps JD keywords onto the same registry.
4. **Gap list → one click to anywhere:** each gap has [Study] [Mock it] [Sample answer]. The mock option opens a Director session seeded exactly with those gap concepts — resume and flagship literally shake hands.
5. **Claim-verification queue:** "Resume says X — prove it" mini-mocks (3 questions, targeted) that upgrade `claimed` → `spoken` evidence. Nobody else does this; it only exists because of the shared concept store.
6. **Hygiene & impact report:** deterministic checks (quantified achievements ratio, bullet length, action verbs, date gaps) with before/after examples.
7. **Version history & diff:** readiness over time; feeds dashboard trend.

### Phases
- **R1:** upload+parse+confirm, skill extraction v1 — 1 wk
- **R2:** readiness/JD/gaps, claim-verification queue, dashboard wiring — 1.5 wk
- **R3:** hygiene, versions/diff, alias expansion — 1 wk

### Validation
- 8–10 fixture resumes (junior/senior × Java/Go/Python/frontend × layouts) → skills P/R ≥ 0.85; malformed-PDF fuzz set; JD fixture keyword P ≥ 0.9.
- Claim-verification end-to-end: resume "Kafka" → mock hit → concept upgrades in dashboard same session.

### Risks / assumptions
- **Parse variance remains risk #1:** quality gate + confirm + paste-fallback. Text-extraction confidence under threshold → explicitly labeled.
- English-first aliases; unmatched-n-gram telemetry (shape only, never content) guides dictionary growth.
- PII: private bucket, encrypted, user-delete proof, never in logs (align SECURITY.md).

---

## 5. Product 3 — Mock Interview: the flagship (real, adaptive, never the same twice)

### 5.1 What "real" means here (spec, not vibes)
A real interviewer doesn't read a list. They: open broad → listen → probe what you said → push on what you skipped → poke the mistake you just made → pivot when you're solid → circle back to what you dodged. v2 builds exactly that loop:

1. **Every question is connected** — the next question references what YOU just said. Deterministic connective tissue: AVE extracts your key phrases → the Director renders transitions from a template bank: *"Okay — you mentioned **caching**. Now: what actually happens on a cache **miss**?"* The template slots are your words + the authored probe. No LLM; it reads like a conversation because it quotes you.
2. **Never a fixed set:** session DNA = (target-gaps ∪ recency-avoidance ∪ breadth-quota) seeded selector → graph branching per turn. Same user, same domain, two sessions → different paths. Repeat-protection at both question AND concept level (asked-set, spoken-set).
3. **Difficulty breathes:** `easy → medium → hard` ladders within a topic; two strong answers in a row → stretch probes (`to_stand_out`); two shaky → scaffold to fundamentals, recover confidence, then return.
4. **The interviewer has memory:** dodged concepts re-enter 2–3 turns later rephrased ("Earlier I asked about indexes — take another angle on that: why would an index SLOW a write?"). Flagged `common_mistakes` earn a polite poke ("You said threads are expensive — expensive how, exactly?").
5. **Human behaviors, simulated honestly:** ramble → gentle steering ("Let's park that — the core of my question was X"); silence → a nudge after N seconds; wrong-but-confident → evidence-based counter ("Hmm — that's actually one of the classic traps with this: …" quoting `common_mistakes`).
6. **Behavioral mode is a first-class citizen:** STAR tracker per answer — missing R? "What was YOUR specific role?"; missing numbers? "Can you quantify the impact?". Probes templated from the STAR rubric.

### 5.2 The Interview Director (engine spec)
```
DirectorState = {
  plan: { targetConcepts[], quotaPerModule, difficultyStart },
  asked{questionIds}, spoken{conceptIds}, dodged{conceptIds},
  streak{strong|weak}, lastMoves[], persona, sessionSeed
}

turn(candidateTranscript | silence | askToRepeat):
  1. AVE.verifyTurn(...)                       → concept hits/misses, ramble, signal
  2. MasteryStore.upsert(evidence)             → the loop updates MID-interview
  3. chooseMove(): one of
       PROBE        — authored followup_questions on said-concept
       STRETCH      — to_stand_out script (on strong streak)
       POKE         — common_mistakes challenge (on mistake flag)
       TRADEOFF     — comparison_table row as A-vs-B question
       SCAFFOLD     — step to easier concept (on shaky/lost)
       CIRCLE_BACK  — re-ask dodged concept, rephrased
       PIVOT        — cross-topic via shared-concept edge
       WRAP         — time/quota reached → closing ritual
     move selection = deterministic policy (rules table + priority + anti-repeat) over
       (signal, streak, dodged, quota, time, askedSet) — no randomness except seed-flavored
       tie-breaks; every move LOGGED with its reason (session replay shows WHY)
  4. renderTransition(templates, yourKeyPhrases, nextQuestion) → TTS speaks it
```
- **Solo mode:** Director runs candidate-side; TTS persona voice (existing SpeechSynthesis), pacing, filler interjections ("Okay… makes sense. Let's push on that.").
- **Live 1:1 mode:** Director runs **interviewer-side as an assistant**: suggests next move + rubric checklist on the interviewer's screen; human can accept/override; marks merge 60/40 with AVE at report time.
- **Panel mode:** out of scope; Director's room abstraction is the seam.

### 5.3 Media & interaction architecture
- WebRTC 1:1 mesh; Spring WS (STOMP) signaling; coturn TURN; local MediaRecorder → object storage on end; per-question clip slicing by timestamps.
- STT: Web Speech live both sides; live captions via data channel; typed fallback; `Transcriber` seam for server ASR later.
- **Interviewer console (live mode):** Director-suggested next move + the hidden rubric (key_points) + candidate's live concept-hits — so a peer interviewer feels like a pro.
- Consent gate + TTL + hard delete on recordings (highest-trust data tier).

### 5.4 Session report (shared with solo)
Per question: score with receipts (concepts hit/missed, mistake flags), the suggested improved answer (speakable + deep + checklist — "here's how our expert answers it"), clip replay, drills queued to dashboard, and the move log (why each question followed yours). Weak concepts flow to mastery store → dashboard radar updates → Next Best Action adapts. **The report is the loop's heartbeat.**

### 5.5 Phases
- **M1:** Director v1 (rules table, probes/stretch/poke/scaffold/pivot, transition templates) + solo flow with real AVE per turn; hardcoded questions API deleted — 2.5 wk
- **M2:** behavioral mode + circle-back + wrap rituals + report browser — 1 wk
- **M3:** live 1:1 audio rooms + interviewer console (Director-assist) + captions — 2 wk
- **M4:** recording + clips + video toggle + reconnect/TURN hardening + consent/retention — 1.5 wk

### 5.6 Validation
- **Director oracle tests:** scripted candidate transcripts (strong/weak/dodging/rambling) → deterministic move sequences asserted against the rules table. The engine is a state machine: testable exhaustively.
- **No-repeat guarantee:** property test — 100 sessions same seed profile → question-sequence collision rate ≈ 0 beyond authored-probe reuse.
- **AVE oracle:** ~200 `speakable_answer`s ≥ 85; concept-stripped 40–70; unrelated < 30 (CI, extends `audit:answers`).
- **Realism UAT (the subjective metric that matters):** 10 users, two rounds: scripted-fixed mock vs Director mock, blind order — target: "felt like an interviewer adapting" ≥ 8/10 preferring Director; template-grammar audit for repeats.
- Human-vs-AVE agreement on 50 labeled answers (Spearman ≥ 0.6).
- WebRTC Playwright two-context fake-media suite; reconnect; TURN-forced path; 100-room signaling load test.

### 5.7 Risks / assumptions
- **Template monotony** (the 180° risk of no-LLM): mitigate with a large transition bank + persona variety + quoting the candidate (their words differ every time) + move-reason logging; UAT specifically hunts repeats.
- Browser STT: Chromium-first assumption, typed fallback, `Transcriber` seam.
- AVE ceiling (can't judge reasoning depth): framed honestly as "concept coverage vs expert answer"; live mode weights human marks 60/40.
- P2P NAT failures: TURN mandatory; degraded typed mode as first-class, not an error state.

---

## 6. Interconnection contract (what makes it ONE product)

| Asset | Writer | Readers |
|---|---|---|
| Concept registry (CIS) | content build | ALL |
| Mastery store | AVE / learning / resume-import | Dashboard, Director, Resume readiness |
| Gap selector | MasteryService | Director seeding, Next Best Action, Resume gaps |
| Session reports | interviews module | Dashboard history, trend, clips |
| Resume analyses | resume module | Dashboard panel, claim-verification, Director seeding |
| Storage (recordings/resumes) | mock/resume modules | report browser, version diff |

**Invariants (enforced, not aspirational):**
1. No subsystem computes its own coverage — MasteryService only.
2. Every number shown has a provenance receipt (which evidence produced it).
3. Every recommendation is executable — [Study]/[Mock]/[Prove] CTAs, never dead-end text.
4. Guest loop parity: every loop step works pre-signup locally, merges on login.
5. Zero feature gates: all of this is free tier.

---

## 7. UI: one design system, three products (clean = best)

### 7.1 Principles
1. **One shell** — persistent left rail: Learn / Practice / Analyze / Track; the user never relearns navigation between products.
2. **The graph is the visual identity** — the concept-graph motif (dots/edges, mastery-tinted) recurs: dashboard hero, resume readiness, mock report. One visual metaphor, brand-defining.
3. **Calm professional palette** — dark-first (repo is already dark-capable via next-themes), one accent, mastery colors consistent everywhere (red=weak, amber=learning, green=mastered, gray=untested).
4. **Motion with meaning** — framer-motion used for state transitions only (concept tints shifting as evidence lands; report building), never decoration.
5. **Receipts on hover** — any score/metric reveals its evidence inline. Trust is a UI feature.
6. **Typographic hierarchy, Radix primitives, existing tokens** (`design-tokens.ts`) extended, not replaced.

### 7.2 Screen-level direction (per product)
- **Dashboard:** hero = domain readiness rings + graph; single Next Best Action card above the fold; history as timeline, not table.
- **Resume:** 3-step wizard (upload → confirm sections → results) with progress that never dead-ends; results as annotated resume (inline highlights on extracted skills) + gap list with per-gap CTAs.
- **Mock — solo:** **focus-mode full-screen** — question card, live waveform, subtle timer arc, transcript ribbon (dismissible), nothing else. Interviewer persona header (avatar + name + role) sells the "real" feeling.
- **Mock — live:** interviewer console (left: Director suggestion + rubric ticks; right: candidate video + captions); candidate sees clean focus-mode.
- **Mock — report:** question-by-question accordion (score + receipts + suggested answer + clip), move-log replay ("why the interviewer asked this"), and the radar delta animation (before → after this session).

### 7.3 Cleanup mandate (the 180°)
- Delete: hardcoded questions API, hardcoded results scores, mock-interviews page sprawl (6 routes → one flow shell), billing gates in navigation.
- Keep: content tree + readers, auth + guest merge, Radix/Tailwind kit, backend modules (extend, don't rewrite), Playwright harness.

---

## 8. Timeline (10–11 weeks, three tracks)

| Wk | Platform (A) | Products (B) | Media/Infra (C) |
|---|---|---|---|
| 1–2 | CIS + concept registry + mastery store; AVE v1 + oracle CI | D1 dashboard real history | compose: coturn, MinIO |
| 3–4 | Director rules engine + transition bank; unification shell v1 | D2 Career Graph; R1 resume parse | signaling prototype |
| 5 | Report rollup; receipts system | R2 resume gaps + claim-verify | signaling + 1:1 audio |
| 6 | Director hardening + no-repeat property tests | **M1 Director solo launch** | interviewer console |
| 7 | Behavioral mode + move-log replay | M2 report browser | recording + clips |
| 8 | R3 hygiene/versions; D3 review queue | resume↔mock↔dashboard loop E2E | video toggle |
| 9–10 | Load, reconnect, privacy suite; UAT rounds | realism UAT + tuning | TURN hardening |
| 11 | Buffer: template-bank expansion + polish | — | — |

Critical path: **CIS → mastery store → AVE → Director**. The loop (all three wired) exists end-to-end by week 8; media hardening is deliberately last.

---

## 9. Validation strategy (consolidated)
1. **Self-testing content** (AVE oracle in CI) — the library grades itself.
2. **Director state-machine tests** — scripted candidate behaviors → asserted move sequences; the engine is deterministic, so it's exhaustively testable.
3. **No-repeat property tests** — 100 seeded sessions, collision ≈ 0.
4. **Fixture users/resumes/JDs** — dashboard math, skill extraction, JD overlap (P/R targets per product).
5. **Agreement study** — human marks vs AVE (Spearman ≥ 0.6) before weights ship.
6. **Playwright two-context WebRTC** (fake media), reconnect, TURN-failure paths.
7. **Privacy proofs** — PII scrubber on transcripts; deletion actually deletes (storage + DB trace); authz user-scoped on every new endpoint.
8. **Realism UAT** — blind A/B scripted vs Director, ≥ 8/10 preference; template-repetition audit.
9. **Loop E2E** — resume upload → gap → seeded mock → report → radar delta in ONE automated session.

---

## 10. Key risks & assumptions

**Assumptions (stated):** 1:1 interviews (no SFU v1); desktop-Chromium-first STT with typed fallback; English-first aliases; content tree is sole truth, index rebuildable; Postgres + object store + TURN are the only new infra; content track (paused) resumes later and auto-enriches concepts for 26% of topics.

**Risks (ranked):**
1. **Template monotony** — no-LLM transitions could feel canned → transition bank size, candidate-quoting, persona variety, UAT hunting repeats with move-log telemetry to spot fatigue patterns.
2. **Director rules quality** — bad branching = worse than a list → exhaustive state-machine tests + move-reason logging + UAT; rules are data, tunable without redeploy.
3. **AVE ceiling** → honest "concept coverage" framing + 60/40 human weighting in live mode.
4. **Resume parse variance** → confirm-then-proceed + paste fallback; confidence labeling.
5. **Browser STT inconsistency** → support matrix, typed fallback as first-class mode, Transcriber seam.
6. **Recording privacy** → consent, TTL, delete proofs; highest-trust tier.
7. **Free-forever economics** → out of scope here, but the loop + concept ledger is the defensible asset; monetization (if ever) must not gate the loop — sponsor/supporter surface only.
8. **Scope discipline** → 180° enthusiasm vs 10 weeks: the phase table is the contract; Director v1 (M1) is the only "must-ship" miracle; live mode can trail by a sprint without breaking the loop.

---

## 11. Deliberately not built (seams documented)
- **LLM anywhere** — AVE + Director rules replace it. Seams: `Scorer`, `Transcriber`, transition-template provider.
- **Server ASR** — browser STT + typed fallback. Seam: `Transcriber`.
- **SFU/panel** — 1:1 mesh; room abstraction is the seam.
- **Semantic search** — BM25 + aliases. Seam: CIS query interface.
- **Payments gating** — retired from product path; supporter surface only, loop never gates.
- **Content backfill** — separate paused track; everything degrades gracefully without it and auto-upgrades as it lands.
