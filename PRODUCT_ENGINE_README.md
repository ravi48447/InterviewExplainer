# Product Engine — Implementation Summary

Three interconnected products on one deterministic engine. **No LLM anywhere** —
all verification, adaptation, and suggestions are grounded in the human-authored
content library (`content/<domain>/<module>/<topic>/complete-qa.json`).

## What was built

### 0. The Engine (shared spine) — `lib/engine/`
| Module | Role |
|---|---|
| `text.mjs` | normalize/tokenize/TF-IDF/BM25/light-stem + stemMatch |
| `contentIndex.mjs` | CIS: concepts (matchable nuclei), probes, mistakes, tradeoffs, corpus |
| `ave.mjs` | Answer Verification Engine: rubric scorer (Coverage 50/Depth 20/Structure 15/Communication 15), alias map, concept hits/missed, mistake flags, Director signal |
| `director.mjs` | Interview Director: 8-move state machine (open/probe/stretch/poke/tradeoff/scaffold/circle_back/pivot/wrap/next), topic-dwell cap, scaffold-run limit, poke-once, deterministic seeds, transition templates quoting the candidate |
| `skills.mjs` | Skill Dictionary (term-shaped entries + CORE_TECH + aliases) for resume matching |
| `resume.mjs` | skill→concept bridge, readiness math, hygiene checks |
| `mastery.mjs` | Concept Mastery Store (claimed/studied/spoken evidence, decay, merge, NBA) |
| `server.mjs` | server loaders + deterministic Director reconstruction from client state |

### 1. Dashboard — career graph entry
- `modules/dashboard/components/NextBestActionCard.tsx` — the loop's steering wheel (weak-concept drill CTA), injected after HeroSection.
- `/api/engine/coverage` — concept registry per domain + readiness math.

### 2. Resume Analysis — `/dashboard/resume`
- Paste-first (dependency-free), skills onto the concept registry, readiness vs target, gaps with [Study]/[Mock it] CTAs, hygiene report.
- `claimedConceptIds` — the bridge that translates resume skills into the Director's seeding space.
- PDF/DOCX = documented seam (needs pdfjs/mammoth).

### 3. Mock Interview (flagship) — `/mock-interviews/audio` + `/results`
- **Adaptive Director session**: probes what you said, stretches when strong, scaffolds when lost, circles back to dodged concepts, pivots for breadth. Never a fixed set.
- `/api/engine/session` (start) → `/api/engine/turn` (answer → AVE → next move) → `/api/engine/report` (post-session rollup).
- Spoken evidence recorded into the mastery store at session end (the loop).
- Report: per-question receipts (covered/missed), expert suggested answer, drills, move-log replay.

## The loop
```
resume (claims) -> mastery store -> dashboard gaps (NBA)
  -> mock seeded with weak concepts -> AVE per turn (adaptation)
  -> report -> spoken evidence -> mastery store -> NBA updates -> repeat
```

## Verification (all green)
- `npm run engine:test` — 208 checks: AVE oracle (library grades itself: expert corpus scores high; partial mid-band; unrelated <30), Director state-machine scripts (strong→stretch, weak→scaffold, mistake→poke), 100-session no-repeat (0 collisions), gap-targeting.
- Full loop simulation: resume claims 38 registry concepts → 34 overlap with ruby-backend-fresher → next mock seeds with the 258 unclaimed.
- Structural checks on all new TSX/TS routes.

## Run
```bash
npm run engine:build     # rebuild data/content-index*.json + rubrics
npm run engine:test      # 208-check self-test
npm run dev              # Next app; visit /mock-interviews/audio, /dashboard/resume
```

## Constraints honored
- Zero new npm dependencies (pdfjs/mammoth/kafka-clients etc. documented as seams).
- Guest-first: mastery store in localStorage, merges on login.
- Free: no feature gates in the loop.
- Honest scoring: framed as "concept coverage vs the expert answer", receipts on every number.

## Round 2 additions (premium mock)
- Duration presets: 15-min quick / 30-min standard / 60-min full (sessionConfig.mjs)
- Modes: technical (adaptive), behavioral (STAR tracking + probes), coding round
  (347 expert code topics; deterministic verification; PISTON_URL seam for self-hosted execution)
- Gentle scoring bands (Strong/Solid/Getting there/Needs practice) — engine scores stay strict,
  users see encouraging, honest framing + one actionable line
- Voice: questions spoken (TTS persona), spoken verdict after each answer, full voice review
  on demand (results page + mid-session), live transcript while recording
- Topic URLs: every question + report links into our Q&A library (/{domain}/{module}/{topic})
- Persistence (persist.mjs): session records survive tab close; streaks, score trends,
  best/avg stats; server-sync seam for the Java backend accounts
- Dashboard: MockTrendsCard (sparkline + history) beside NextBestActionCard
- Note: the public Piston API is whitelist-only since 2/2026 — coding verification is
  structural (deterministic) with PISTON_URL env seam for a self-hosted instance

## Seams — status
- **PDF/DOCX resume parsing: SHIPPED** — dependency-free (`lib/engine/parse.mjs`): DOCX via ZIP central-directory + raw-deflate (`node:zlib`), PDF via FlateDecode stream inflate + text-operator extraction, with a word/alpha confidence gate and paste fallback on low confidence. Upload at `/api/engine/resume-upload` (10 MB cap).
- **Live 1:1 WebRTC rooms: SHIPPED (v1)** — signaling over versioned HTTP long-poll (`/api/engine/room`, no WebSocket server needed), in-memory room store (2h TTL, single-instance), guest-join tokens, SDP/ICE relay, room-full guard. Client: `lib/engine/useRoom.mjs` + `/mock-interviews/live` (host Director-assist console with rubric ticks; guest focus view). TURN/coturn remains a config add for restrictive NATs; multi-instance signaling needs a Redis swap (documented).
- **Server-side ASR: still a seam** — browser STT + typed fallback (needs model infra).
- **Semantic search: still a seam** — BM25 + aliases today (needs embeddings).
