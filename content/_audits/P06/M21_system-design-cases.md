# Audit — system-design-cases

**Pillar:** P06 System Design
**Module:** M21 system-design-cases
**Topics present:** 8 (each case study is a single-Q topic; `scenario-based` topic holds 4 extra cases)
**Questions:** 12 (all written, no stubs)
**Benchmark sources:** "Designing Data-Intensive Applications" (Martin Kleppmann), Alex Xu "System Design Interview Vol 1 & 2", bytebytego.com case studies, High Scalability blog (highscalability.com), "Grokking the System Design Interview" (educative.io), engineering blogs (Uber, Netflix, Airbnb)

---

## Module is structurally strong

- 12 written Qs, no stubs
- **Only 1 MODERATE** per-question issue (Q4 ride-sharing paragraph-wall); everything else is MINOR
- **Zone 3 depth is excellent** — 4 Qs over 1000 words (chat 1144w, ecommerce 1124w, file-storage 1042w, video 1020w)
- Uniform speakable format: all 12 are bulleted-subheaders 307–355w (consistent and appropriate for system design)
- 6 of 12 have detected analogies — strong coverage
- Universal `interviewer_intent` + `key_points` ≥ 5

**Note on code coverage**: case-study Qs have 1–4 code blocks each — low by the general audit standard, but **appropriate for the archetype**. System design case studies on bytebytego / Alex Xu / High Scalability are diagram-and-bullet-heavy, not code-heavy. The native artifact is architecture diagrams (described in text or phases), API sketches, schema sketches, back-of-envelope calculations — not runnable Java. Auditor flags like `zone3_no_code_examples` are not applied here because the benchmark is already narrative-heavy. All 12 case Qs still have 1–4 code blocks (API shapes, schema snippets, rate-limit algorithms), which is on-spec.

---

## Biggest finding — cross-module overlap with M20 system-design

Several case questions overlap with M20 system-design's pattern questions:

| Case in M21 | M20 pattern Q | Overlap |
|---|---|---|
| `design-rate-limiter` (Q1 rate-limiter topic) | M20 scenario-based may cover rate-limiting | High |
| `design-notification-service` | M20 event-driven / messaging tangentially | Medium |
| `design-api-idempotency-payments` | M20 `api-gateway-pattern` / idempotency | Medium |
| `design-chat-messaging-system` | M20 websocket / realtime angle | Medium |

The split should be: **M20 = generic system-design patterns** (CAP, load balancing, caching layers, circuit breaker pattern theory); **M21 = concrete case studies** applying those patterns to a specific product. Currently the split is loose — worth an explicit cross-module rule.

---

## Biggest finding — thin case coverage per topic

Each case is a single question in its own topic. Most real system-design cases have follow-ups: scaling phase 2, specific sub-components, failure modes, cross-region. For a "deep dive" module, 1 Q per case is surface-level. Possible expansions:

| Case | Natural follow-up Qs |
|---|---|
| URL shortener | Custom short codes + expiration + analytics; scaling to 1B URLs |
| Chat | Read receipts + presence; end-to-end encryption; 1:1 vs group vs channels |
| Ride sharing | Surge pricing; driver-matching algorithm; ETA prediction |
| Video streaming | CDN strategy; adaptive bitrate (HLS/DASH); live vs VOD |
| Payment idempotency | Saga + payment retries; double-spend prevention; ledger design |
| Rate limiter | Token bucket vs sliding window vs leaky bucket — implementation-level |

Current layout: 12 cases × 1 Q each is **breadth-first**. Typical system-design interview prep is **depth-first on the 4–5 canonical cases** (URL shortener, chat, news feed, rate limiter, file storage) — consider expanding those to 2–3 Qs each.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Case studies follow: requirements → estimation → high-level design → deep dive → trade-offs → scaling | Matching on most Qs (phase structure apparent in Zone 3 depth) |
| Back-of-envelope numbers cited (QPS, storage, bandwidth) | Present in several Qs but not uniformly |
| Diagrams described in phases when not drawable | Matching — bulleted-subheaders speakable shape handles this |
| Opening bolds the product/goal (`**URL shortener**`, `**notification service**`) | **Failing** — 12 of 12 direct answers have zero bold anchors |
| Analogies used for abstract components (rate limiter = "bouncer at a club", CDN = "local Amazon warehouse") | Matching — 6 of 12 have analogies |
| Trade-off sections explicit (strong vs eventual consistency, push vs pull, etc.) | Matching (several Qs have explicit trade-off sections) |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | CROSS-MODULE OVERLAP | **MAJOR** | Rate limiter, idempotency, notification, chat cases have adjacent M20 pattern Qs. Needs explicit scope split between M20 (patterns) and M21 (cases) |
| S2 | DEPTH VS BREADTH DECISION | MODERATE | 12 cases × 1 Q each is breadth-first. Industry standard for interview prep is depth-first on 5–6 canonical cases |
| S3 | MODULE-WIDE ZONE 1 | MODERATE | 12 of 12 direct answers have 0 bold anchors; 1 paragraph wall (Q4 ride-sharing, 65w) |
| S4 | ANALOGY GAP (moderate) | MINOR | 6 of 12 missing analogies — actually one of the better coverage rates, but cases are analogy-rich |
| S5 | BACK-OF-ENVELOPE NUMBERS NOT UNIFORM | MINOR | Some cases cite QPS / storage / bandwidth targets; others don't |

---

## Per-question issues

### `url-shortener`

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-url-shortener | 750w / 2 code / no analogy. Shortened URL = "short name on a visitor badge pointing to the full name on your ID"; Base62 encoding topic is a natural analogy hook | MINOR |

### `notification-service`

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-notification-service | 733w / 1 code / analogy — well-shaped. 1 code block is light — should show either the notification template schema or the consumer fan-out pseudo-code | MINOR |

### `payment-system` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-api-idempotency-payments | 753w / 2 code / no analogy. Idempotency = "restaurant bill you can swipe the card twice but only charged once thanks to the receipt ID" — natural analogy | MINOR |
| **Q2** design-ecommerce-order-management | 1124w / 4 code / analogy — **strong, well-shaped**, second-longest Zone 3 in module | MINOR (near-CLEAN) |

### `social-media-feed`

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-social-media-feed | 904w / 3 code / no analogy. Fanout-on-write vs fanout-on-read is a classic trade-off — "restaurant kitchen cooking on order vs pre-cooked buffet" analogy works | MINOR |

### `rate-limiter`

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-rate-limiter | 921w / 2 code / no analogy. Should show token bucket + sliding window + Redis `INCR` + `EXPIRE` implementations. 2 code blocks is light for this Q | MINOR (code-light relative to content) |

### `chat-system`

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-chat-messaging-system | 1144w / 4 code / analogy — **longest Zone 3 in module, strong** | MINOR (near-CLEAN) |

### `search-autocomplete`

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-search-autocomplete | 716w / 1 code / no analogy. Trie + Redis sorted-set hybrid is standard — 1 code block is very light. "Autocomplete = friend finishing your sentences" analogy works | MINOR |

### `scenario-based` (4 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-leaderboard-system | 581w / 1 code / no analogy. Redis sorted sets Q — should show `ZADD`/`ZRANGE` commands. **Overlaps potentially with M14 redis-caching** | MINOR + possible OVERLAP |
| **Q2** design-file-storage-service | 1042w / 3 code / analogy — strong | MINOR |
| **Q3** design-video-streaming-platform | 1020w / 4 code / analogy — strong | MINOR |
| **Q4** design-ride-sharing-service | Paragraph-wall DA (65w). 997w / 4 code / analogy | **MODERATE** (paragraph wall only) |

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **1** | S1 cross-module overlap |
| **MODERATE** | **3** | S2 depth-vs-breadth, S3 module-wide bold, Q4 ride-sharing paragraph wall |
| **MINOR** | **12** | All 12 Qs — bold anchors + some analogy and code-light fills |
| **CLEAN** | **0 by auditor** (Q2 payment, Q1 chat, Q2 file-storage, Q3 video-streaming effectively clean pending bold anchors) |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 12 (100%)
- `zone3_no_analogy` × 6
- `zone1_direct_answer_paragraph_wall` × 1

---

## Suggested fix order

1. **Cross-module scope decision FIRST** (S1) — document a rule: M20 = patterns, M21 = cases; cross-link rather than duplicate.
2. **Depth vs breadth decision** (S2) — pick 4–5 canonical cases (URL shortener, chat, news feed, rate limiter, file storage) and expand each to 2–3 Qs (phase 1 design + scaling + deep-dive on hardest sub-component). Keep the rest at single-Q.
3. **Code-expand Q1 rate-limiter and Q1 search-autocomplete** — their Zone 3 lengths justify more code artifacts.
4. **Fix Q4 ride-sharing paragraph wall** + module-wide bold-anchor pass (12 edits).
5. **Add analogies to 6 Qs** — rate limiter (bouncer), idempotency (receipt ID), autocomplete (friend finishing sentences), URL shortener (visitor badge), social feed (pre-cooked buffet vs on-order), leaderboard (scoreboard + sorted rankings).
6. **Uniform back-of-envelope coverage** — each case should cite QPS / storage / bandwidth targets.

---

## Overall

Together with M18 design-patterns and M16 microservices, M21 is among the **top 3 best-authored modules** in the audit. Strong depth, consistent format, good analogy coverage. The main work is at the module-level (scope split with M20, depth-vs-breadth decision) rather than per-question.
