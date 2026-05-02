# Speakable run — live status

Last update: 2026-05-02T09:50:00Z
Phase: 2
Run mode: Phase 2 only — will halt at Phase 2 completion
Time elapsed (this phase): in progress

## Phase 0 summary (carried over)

8 deliverables done — see `PHASE-0-REPORT.md`.

## Phase 1 summary (carried over)

11 deliverables done — see `PHASE-1-REPORT.md`.

## Phase 2 progress

- [x] Preflight 6.1 — `how_to_use` recommended (not required) for archetype A; archetypes.md, lint-rules.md, audit_speakable.py updated; HUMAN-REVIEW §3-vs-§16 marked resolved.
- [x] Preflight 6.2 — §16 worked example canonicalised (archetype: A, speakable_status: approved); HUMAN-REVIEW §16-MISSING-FIELDS marked resolved.
- [x] Preflight 6.3 — RENDERER-1 closed with accepted-trade-off rationale; no code change.
- [x] Preflight 6.4 — lint UX polish: wrong-shape file → exit 2 with stderr error; `fails (N)` → `violations (N)` in human text rendering; lint-rules.md §7.8.6/§7.8.7 updated.
- [x] Preflight verification — `audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16` → PASS, score 100/100 (no warns).
- [ ] G1 — Conceptual / `java-thread-lifecycle-states`
- [ ] G2 — Comparison / `difference-between-equals-and-double-equals-java`
- [ ] G3 — Internals / `hashmap-collision-handling`
- [ ] G4 — Scenario / `cpu-spikes-java-applications-debugging`
- [ ] G5 — Design / `abstract-class-vs-interface-java-when-to-use`
- [ ] G6 — System Design / `design-url-shortener`
- [ ] G7 — Behavioural / `handle-technical-disagreements`
- [ ] Top-30 hand-craft list (priority_handcraft flips)
- [ ] Dev story page extended with Phase 2 golden references section
- [ ] Phase 2 final report

## Open items routed to human

See `HUMAN-REVIEW-QUEUE.md`. Phase 2 closed three open items (§3-vs-§16, §16-MISSING-FIELDS, RENDERER-1); E-1, F-1, G-1, DATA-1, L1-1, AUTH-1, AUDIO-1 carry over from earlier phases.

## Hard boundaries reasserted (per Phase 2 prompt §4)

- No `git push`.
- Touch only the 7 golden targets and the 30 priority-handcraft files in `content/`.
- No schema / codex / lint-rules-§7.x-rules / renderer / TTS modifications (the 6.4 lint UX changes are a documented exception logged in this report).
- Stage explicit paths only — never `git add .`.
