# Offer Ready — Implementation Plan
**The 30-day interview campaign product.** Duolingo-streak psychology × real company loops × the mastery graph — a day-by-day campaign that ends with a full dress rehearsal.

Baseline: `codex/home-learning-depth` snapshot. Everything below builds on the existing engine (Director, AVE, personas, dry-run, matching, company loops, mastery store, psychology) — no LLM, all deterministic, all content-grounded.

---

## 0. Product principles (the bar for every decision)

1. **The campaign is the product; sessions are its atoms.** Users don't buy mocks — they buy "I'll be ready on Oct 15."
2. **Every number has a receipt.** Readiness, deltas, "the one thing" — all traceable to evidence (existing invariant, extended).
3. **The interviewer must feel human-close, not human-like.** Not chatbot-cosplay: structured curiosity, memory, reactions, and time awareness. Deterministic templates + the candidate's own words = conversation.
4. **Nothing orphaned.** Every existing feature (quick mock, DSA, dry-run, peer, loops, redemption, calibration, rituals) is consumed by the campaign structure.
5. **Free users see the journey, Pro users run it.** Free: campaign preview (first 3 days live). Pro: the full campaign + certificate.

---

## 1. The Realism Layer — "Conversation Director v2" ⭐ (the core of this plan)

The single biggest differentiator. Today the Director adapts *what* it asks; v2 upgrades *how a session feels* — the human session structure, reactions, memory, and time awareness.

### 1.1 Session Beats (the human arc of every session)
Every session (all modes) runs through explicit beats, like a real interview:

```
beat 1 · OPENER (10-15s)      "Thanks for joining. Can you hear me okay? … Let's get started."
beat 2 · WARM-UP (1 easy q)   a genuinely easy question — calibrates state, settles nerves
beat 3 · CORE (N rounds)      the adaptive Director (existing) + Reaction system (new)
beat 4 · TIME-SIGNAL          at 75% elapsed: "We've got about X minutes, so let's…"
beat 5 · CLOSER               "That's everything from my side. Any questions for me about the team?"
                              → candidate picks from a question bank (2-3 real answers authored)
beat 6 · DEBRIEF              the report (existing) + 2-things-you-did-well-first sequencing (existing rule)
```

- Warm-up question selection: `difficulty=easy` + highest importance (we have this metadata).
- Closer Q&A bank: authored short answers ("team structure", "what does success look like", "why is this role open") — 6-8 entries, deterministic per persona.
- **Spec detail:** beats are a state machine layer ABOVE the Director's move machine — `SessionBeats` wraps `Director`, gating which moves are legal per beat (core beat = existing moves; opener/closer = fixed scripted beats with variety banks).

### 1.2 Reaction system (keyed to AVE signal — the "interviewer is listening" feel)

| AVE signal | Human reaction (banked, varied, persona-flavored) |
|---|---|
| `stronger_than_expected` | genuine interest: "Nice — okay, I want to push on that specifically." → STRETCH probe |
| `on_track` | measured acknowledgment → next planned question |
| `shaky` | gentle redirect: "Alright — let me ask it a different way." → rephrase (same concept, different topic carrier) |
| `lost` | empathy + protect: "No problem, let's set that one aside." → topic change, concept goes to redemption queue (never hammer) |

- Banks of 4-6 variants per reaction per persona (7 personas × 4 signals ≈ 150 authored lines — we write these, they're config not content-tree).
- Anti-repeat: per-session reaction memory (same variant never twice in a row; exhaustion → neutral bank).
- **Rule: one reaction per answer, never stacked.** Over-acknowledging is the #1 chatbot tell.

### 1.3 Memory threading (the "interviewer remembers" feel)

- **Quote bank:** store the candidate's key phrase per turn (existing `keyPhrases`); reference 2-4 turns later in PROBE/PIVOT: *"Earlier you mentioned 'eager loading' — how does that play here?"*
- **Concept memory:** circle-back already exists for dodged concepts; extend PIVOT to prefer concepts *spoken confidently* earlier (callback = rapport).
- **Contradiction check (v1):** session-scoped polarity detection on a curated contradiction list (thread-safe vs not, mutable vs immutable, O(n) vs O(n²)) — flag → POKE: *"Hold on — five minutes ago you said it was thread-safe. Now it isn't?"* Start with ~12 curated polarity pairs; grow with content.
- **Cross-session memory (Pro):** next session's OPENER references last session's weakest concept: *"Last time we struggled with indexes — let's see where you are today."* (mastery store already knows this.)

### 1.4 Time-awareness in language

- 75% elapsed → time-signal beat (template with computed minutes).
- Per-question soft-time (rapid mode) → "let's keep these short and sharp from here."
- Final question framing → "last one from me:" (wrap beat already exists; now it speaks time).

### 1.5 Voice & pacing polish

- Persona TTS configs exist (rate/pitch); add micro-pauses via SSML-ish breaks (SpeechSynthesis utterance splitting: reaction line → 400ms pause → question).
- Interjection frequency capped per persona (`pushback` param exists) — never twice in a row.

### 1.6 Question realism (the content side)

- **Session curation per mode** (already partly done via mode pools): quick → weakness-ranked (have); DSA → `codeExample` topics (347, have); system design → 89 design-ish topics across 20 modules (have); behavioral → 5 genuine behavioral modules (thin — see Risks).
- **The DSA gap:** `content/dsa/` is 533 scaffolding topics, mostly empty. DSA Mock degrades to `codeExample` topics from language domains today. Content ask (separate track): fill ~60 core DSA topics (arrays/strings/DP/graphs at two levels) with the same rubric schema. Until then: DSA mode honestly labeled "code + algorithms from your domain's library."

---

## 2. Campaign Engine (`lib/engine/campaign.mjs`)

### 2.1 Generator — date-backward, phase-structured

```
input: { interviewDate, company?, level, domain(s), minutesPerDay=45, daysPerWeek=5 }
output: days[] — each { date, phase, dayType, title, "oneThing", sessionSpecs[], est minutes }

phases (backward from interviewDate):
  FOUNDATION  (D-30..D-22): quick mocks (weakness), DSA basics, redemption auto-queue
  DEPTH       (D-21..D-13): live-coding + system design at gap areas, calibration coaching
  PRESSURE    (D-12..D-4):  tier 4/5 sessions, rapid drills, peer role-swap rounds, timing under fatigue
  REHEARSAL   (D-3..D-1):  full company loop (all rounds, one day) + patch session on what broke + rest day
  D-1: DRESS REHEARSAL — full loop at the user's real interview time-of-day
```

- Day types: `drill` (quick/DSA), `deep` (design/live-coding), `pressure` (tier-4/5 + interruptions), `peer` (match), `rehearsal` (company loop), `rest` (light review only — spaced-repetition research says recovery days consolidate).
- Rest days: 1/week minimum (auto).
- Company-optional: no company → generic loop archetype by level.

### 2.2 Adaptive re-planning (the "it pays attention" feel)

- Every completed session updates mastery (existing) → next day's `oneThing` re-ranked: weakest decayed concept not yet redeemed today.
- Phase gates: entering PRESSURE requires foundation coverage ≥ threshold OR the campaign auto-extends foundation ("you're not ready for pressure drills yet — 2 more foundation days first"). Honest, not flattering.
- Missed-day handling: re-flow remaining days, never guilt-trip; 2 missed days → offer a lighter "intensive track" re-plan.

### 2.3 Readiness score (the campaign's headline number)

```
readiness = 0.40 × coverageRatio (importance-weighted, decayed — exists in analytics)
          + 0.30 × recentTrend   (last-7-day session avg, recency-weighted)
          + 0.20 × calibration  (1 − |bias|/50, capped — exists in psychology.mjs)
          + 0.10 × rehearsalScore (best full-loop score, if any)
```
- Daily delta animation on the dashboard; `readinessHistory[]` per campaign.
- Provenance receipts on hover (existing invariant): each component shows its evidence.

### 2.4 Certificate (the emotional payoff)

- Deterministic data: sessions completed, minutes, concepts strengthened (count + top 5), loops run, final readiness, company + date.
- Render: pure SVG/CSS branded view (shareable URL); PNG-export seam via html2canvas later.
- Copy: *"You've done 31 sessions and 4 full loops. Walk in like you've been there — because you have."*

### 2.5 Data model (engine-store extension)

```ts
campaigns: [{
  id, interviewDate, company?, level, domains[], minutesPerDay, daysPerWeek,
  createdAt, days: [{ date, phase, dayType, title, oneThing, sessionSpecs, status }],
  completedSessions: number, readinessHistory: [{ ts, value }], status
}]
```
Per-user, file-backed (existing store pattern); Java backend swap remains the prod seam.

---

## 3. API surface (4 routes, thin)

| Route | Purpose |
|---|---|
| `POST /api/engine/campaign` | create (generates days[]) · `GET ?id=` state+today |
| `POST /api/engine/campaign/day-complete` | mark day, update readiness, trigger re-plan |
| `GET /api/engine/campaign/preview?days=3` | free-tier preview generation (plan-gated at 3 days) |
| *(existing)* `/api/engine/analytics` | extended with `readiness` + campaign fields |

Gating: free = preview + 3 live days; interview_pro = full campaign + certificate.

---

## 4. UI & Presentation

### 4.1 Design direction

- Consistent dark-first shell; **campaign accent = amber→violet gradient** (distinct from mock-blue, reads as "journey").
- The brand motif continues: readiness RING (dashboard hero) ↔ coverage rings ↔ loop verdict — one visual language.
- Motion with meaning: countdown ticks, readiness delta grows, day-card completion ripple. Reduced-motion respected (pressure features are opt-in/skippable — existing rule).

### 4.2 Offer Ready landing (the pitch page) — `/offer-ready`
1. **Hero:** "You have an interview. We have the 30 days before it." + start CTA.
2. **The journey visual:** 4 phase cards (Foundation → Depth → Pressure → Rehearsal) + D-day, each with what happens and why (psychology, honestly stated: exposure, retrieval, calibration).
3. **What's inside:** the feature grid (consumes every mode — quick/DSA/design/live-coding/peer/company loops as the weekly structure).
4. **A real sample week** (static render of day cards — set expectations precisely).
5. **Pricing position** + certificate sample.
6. Social proof seam (testimonials later).

### 4.3 Creation wizard — `/offer-ready/start` (3 steps)
1. **When's the interview?** (date picker; past-safe validation; "I'm exploring — no date" option → open-ended track)
2. **Which company + level?** (company picker from the 97, or generic; level toggle)
3. **Your prep reality:** domains (multi), minutes/day (15/30/45/60), days/week.
→ Generates the plan → **preview screen showing week 1 before committing** (no blind signup).

### 4.4 Campaign dashboard — `/offer-ready/campaign/[id]` (the daily home)
```
┌─ COUNTDOWN HERO ──────────────────────────────────┐
│  "12 days to your Amazon loop"   [readiness ring   │
│   streak flame · phase badge      with delta]      │
└───────────────────────────────────────────────────┘
┌─ TODAY ───────────────────────────────────────────┐
│  "The one thing: redeem 'connection pooling'"     │
│  [Start today's session →]  (pre-seeded params)   │
│  est 30 min · what it trains · why now            │
└───────────────────────────────────────────────────┘
┌─ THIS WEEK (strip of day cards) ───────────────────┐
│  done days (emerald ✓ + score), today (pulsing),  │
│  upcoming (dim, oneThing preview on hover)         │
└───────────────────────────────────────────────────┘
┌─ PHASES (progress rail) ── streak · trend ─────────┐
```
- Day tap → session handoff with all params pre-set (existing URL-param flow) → completion returns here, delta animates.
- Phase-gate moments surface as cards ("You're ready for pressure week — here's why: receipts").

### 4.5 Day session integration
- Sessions launched from a day carry `campaignDay` context → session report writes back (day-complete + readiness + oneThing re-rank) — the loop closes on return.
- Dress rehearsal day: special card (full loop at user's real interview time; time-of-day aware nudge).

### 4.6 Certificate — `/offer-ready/certificate/[id]`
Full-page branded view, shareable link, top-5 concepts, loops run, readiness arc (mini sparkline of readinessHistory).

### 4.7 Empty/degraded states (quality bar)
- No company → generic loop; no behavioral content depth → honest labels; content-thin domain → completeness note on coverage numbers (existing rule, extended here).

---

## 5. Implementation phases

| Phase | Scope | Est | Quality gate |
|---|---|---|---|
| **P1 · Realism v2** | SessionBeats, reaction system, memory threading + quote bank, time-awareness, voice pauses, contradiction pairs | 2-3 days | Beat-sequencing tests; reaction-variety oracle; memory-thread test; **hand-reviewed full-session dialogue dumps** (real transcripts read by us) |
| **P2 · Campaign engine** | generator, day types, adaptive re-plan, readiness score, phase gates, certificate data | 2 days | 30-day scripted-candidate sim end-to-end; readiness monotonicity check; re-plan correctness tests; missed-day re-flow test |
| **P3 · Campaign UI** | wizard, dashboard, day cards, handoff + write-back, report integration | 3 days | tsc + build green; full user-flow works E2E; delta animations verified |
| **P4 · Presentation + polish** | Offer Ready landing/pitch, certificate view, preview gating, mobile pass, UAT | 2 days | "Feels human" scorecard UAT (5-8 users, blind scripted-vs-v2 comparison); visual QA |

~9-10 days total. P1 is the risk-reducer (realism is the product's soul) — it ships first and everything else inherits it.

### 5.1 P1 test specs (the new oracle tests)
- **Beat order:** every session opens with OPENER → WARM-UP(easy) → … → CLOSER → never out of order.
- **Reaction-keying:** scripted strong/shaky/lost answers produce the mapped reaction class, with no variant repeating in a session.
- **Memory thread:** a distinctive phrase in turn 2 must appear in a later PROBE/PIVOT transition within 3 turns.
- **Empathy rule:** `lost` never produces the same question again; topic changes and redemption is queued.
- **Full dialogue dump:** 3 personas × full session transcripts printed for human review — we read them and iterate banks before shipping.

---

## 6. What this consumes (nothing orphaned)

| Existing feature | Campaign use |
|---|---|
| Quick mock / weakness targeting | Foundation day drills |
| DSA mock + dry-run debate | Foundation/Depth DSA days |
| System design mock (tier 4, Sofia) | Depth days |
| Live coding (camera, Dr. Anika) | Depth days |
| Peer matching + role-swap | Pressure week peer days |
| Company loops (97) | Rehearsal week + dress rehearsal |
| Redemption loop | Auto-queued across all weeks |
| Calibration (psychology) | Depth-week coaching + readiness component |
| Rituals (breathing, reappraisal) | Dress-rehearsal day + opt-in daily |
| Personas × pressure tiers | Phase-appropriate progression |

---

## 7. Risks & honest gaps

1. **Behavioral content is thin** (5 modules) — behavioral rounds in loops lean on them. Content ask: +10 behavioral topics with rich STAR rubrics.
2. **DSA content** mostly empty scaffolding (533) — DSA days use domain codeExample topics; labeled honestly. Content ask: 60 core DSA topics.
3. **Voice realism ceiling** — browser TTS is decent, not human; pauses and persona tuning mitigate; server-TTS is the seam.
4. **Campaign adherence** — users will miss days; the re-flow must feel supportive, never punitive (churn risk). Tested explicitly in P2.
5. **Single-instance persistence** — engine-store is file-backed; Java-backend swap documented (unchanged seam).

---

## 8. Launch sequence (after P4)

1. Internal dogfood: we each run a 7-day mini-campaign.
2. Free preview live for all → measure → Pro gating on.
3. Certificate shareables as the growth loop.
