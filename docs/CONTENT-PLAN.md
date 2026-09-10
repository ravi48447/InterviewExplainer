# Content Plan & SEO Roadmap

> The "whole set in perspective." Every landing page, theory page, and
> question/problem surface InterviewExplainer should ship to dominate
> Google search for coding-interview intent and genuinely beat
> LeetCode, NeetCode, GeeksforGeeks, Educative, InterviewBit, and
> Glassdoor on experience + depth.

**Scope**: DSA + Java Backend + Java Fullstack tracks, plus all
cross-track SEO surfaces. Python/TypeScript tracks are out of scope
for this plan — they will reuse the patterns established here.

**Status tags** used throughout:

| Tag       | Meaning                                                               |
|-----------|-----------------------------------------------------------------------|
| **LIVE**  | Page renders with authored content.                                   |
| **STUB**  | Route + data scaffolded, body content pending.                        |
| **QUEUED**| Declared in plan, no files yet.                                       |
| **SKIP**  | Intentionally not planned (explain why inline).                       |

---

## 1. Competitor landscape

| Competitor         | Strengths                                      | Weaknesses we exploit                                               |
|--------------------|------------------------------------------------|---------------------------------------------------------------------|
| **LeetCode**       | Authoritative problem set, big discussion community, adaptive difficulty | Editorial quality uneven; no multi-language code toggle; no framework/domain questions; paid premium gates key content |
| **NeetCode**       | Excellent curated sheets (Blind 75, NC150); clean taxonomy; great videos | Written explanations shallow; single-language (Python-first); no Java-native coverage; no framework/system-design depth |
| **GeeksforGeeks**  | Enormous breadth; highest SEO traffic in India | Ad-soaked UX; inconsistent depth; no curated learning path; code quality varies; no interview-voice framing |
| **Glassdoor**      | Real interview reports by company              | No teaching content; no solutions; heavy account-wall friction; hostile reading UX |
| **Educative**      | Polished interactive courses; Grokking series  | Paywalled; monolithic courses; no problem-level SEO destination |
| **InterviewBit**   | Structured tracks; free                        | Dated UI; aggressive signup gates; limited DSA depth; no language toggle |
| **AlgoExpert**     | Video-first; polished production               | Paywalled; low SEO presence; no written canonical page per problem |
| **CodePath**       | Cohort programs                                | Enterprise-focused; not open-web SEO destination                |
| **Striver A2Z / takeUforward** | YouTube-first; highly engaged           | Videos drive YouTube traffic, not site SEO; written depth inconsistent |

**Takeaway**: the gap on the written, open-web side is a hybrid of
**(a) NeetCode's taxonomy quality + (b) LeetCode's problem fidelity +
(c) Educative's teaching depth — with the paywall and
single-language limitations removed**. That's the spot we own.

---

## 2. Our differentiation (and how to protect it)

Six levers, in order of interview-relevance and SEO value:

1. **Line-by-line walkthroughs.** Every approach has a `lineByLine`
   block mapping each code line to plain-English explanation. No
   competitor ships this systematically.
2. **Java + Python on every page.** One click to switch language.
   Solutions, walkthroughs, and interview-voice answers all track
   the toggle.
3. **Interview voice section.** The literal sentence to say. No
   competitor does this.
4. **Curriculum-first ordering.** 18 DSA modules arranged by how
   interviewers test, with a learn→practice flow per module. Closer
   to a textbook than a flash-card wall.
5. **Framework/domain Q&A integrated.** Spring Boot, JPA, JVM,
   system design, microservices — Q&A in the SAME app as DSA. No
   competitor combines both.
6. **Free, no paywall, fast.** Next.js SSG, lightweight UI, no ad
   network, no signup gate.

These six are the **north star**: every content decision should
advance at least one lever. If a page we're tempted to build advances
none of them, we don't build it.

---

## 3. SEO priorities — keyword buckets

### 3.1 Bucket A — Module/topic pillar pages (highest intrinsic authority)

Target pattern: `<topic> interview questions`, `<topic> explained`,
`<topic> cheat sheet`. Each DSA module gets one. Each JBI/JFI pillar
gets one (already in place — spring, spring-boot, jpa, jvm, etc).

| Keyword                                        | Est. monthly volume | Current status | Target page                                               |
|------------------------------------------------|---------------------|----------------|-----------------------------------------------------------|
| `dynamic programming interview questions`      | 18K                 | STUB (module page exists, no theory yet) | `/dsa/module/dynamic-programming` + `/dynamic-programming-interview-questions` canonical |
| `system design interview questions`            | 40K                 | LIVE (pillar hub `/system-design`)       | `/system-design` — expand with sub-pages             |
| `java interview questions`                     | 100K                | LIVE (pillar hub `/java`)                | `/java` — expand with depth tiers                    |
| `spring boot interview questions`              | 30K                 | LIVE                                     | `/spring-boot-interview-questions`                   |
| `dsa interview questions`                      | 20K                 | LIVE (hub `/dsa`)                        | `/dsa` — expand with problem authoring                |
| `arrays interview questions`                   | 12K                 | STUB (module exists, theory authored)    | `/dsa/module/arrays-and-hashing`                     |
| `binary search interview questions`            | 8K                  | STUB (module exists, theory pending)     | `/dsa/module/binary-search`                          |
| `two pointers interview questions`             | 6K                  | STUB (module exists, theory authored)    | `/dsa/module/two-pointers`                           |
| `sliding window interview questions`           | 7K                  | STUB (module exists, theory pending)     | `/dsa/module/sliding-window`                         |
| `graph interview questions`                    | 9K                  | STUB                                     | `/dsa/module/graphs`                                 |
| `tree interview questions`                     | 8K                  | STUB                                     | `/dsa/module/trees-and-bst`                          |
| `linked list interview questions`              | 8K                  | STUB                                     | `/dsa/module/linked-list`                            |
| `recursion interview questions`                | 6K                  | STUB                                     | `/dsa/module/recursion-fundamentals`                 |
| `big o notation interview questions`           | 5K                  | LIVE (theory authored)                   | `/dsa/module/complexity-big-o`                       |
| `backtracking interview questions`             | 4K                  | STUB                                     | `/dsa/module/backtracking`                           |
| `greedy algorithm interview questions`         | 3K                  | STUB                                     | `/dsa/module/greedy`                                 |
| `jvm interview questions`                      | 9K                  | LIVE                                     | `/jvm-interview-questions`                           |
| `concurrency interview questions java`         | 6K                  | LIVE                                     | `/java-concurrency-interview-questions`              |
| `microservices interview questions`            | 14K                 | LIVE                                     | `/microservices-interview-questions`                 |
| `rest api interview questions`                 | 10K                 | LIVE                                     | `/rest-api-interview-questions`                      |
| `sql interview questions`                      | 45K                 | LIVE (pillar)                            | `/sql`                                               |

**Action**: every DSA module needs a `learn/` JSON file authored.
Currently 3/18 are done (complexity-big-o, arrays-and-hashing,
two-pointers). Remaining 15 are the authoring backlog.

### 3.2 Bucket B — Curated-sheet pages (branded keywords, very high intent)

High-intent branded search. These bring people already in prep mode.

| Keyword                        | Est. monthly volume | Target page                         | Status   |
|--------------------------------|---------------------|-------------------------------------|----------|
| `blind 75`                     | 30K                 | `/dsa/sheet/blind-75`              | STUB (this PR) |
| `blind 75 leetcode`            | 18K                 | same                                | STUB |
| `neetcode 150`                 | 22K                 | `/dsa/sheet/neetcode-150`          | STUB (this PR) |
| `grind 75`                     | 8K                  | `/dsa/sheet/grind-75`              | STUB (this PR) |
| `top 100 interview questions`  | 6K                  | `/dsa/sheet/top-100` (future)       | QUEUED |
| `striver sde sheet`            | 9K                  | `/dsa/sheet/striver-a2z` (future)   | QUEUED |

**Action**: publish the three core sheets with full problem orderings
(this PR). Content body thin (sheet name + list). Still beats
Glassdoor/NeetCode for written completeness because every problem on
the sheet eventually links to our own walkthrough.

### 3.3 Bucket C — Problem-specific pages (long tail, huge volume)

Each LeetCode problem has a Google search for its name. Examples:
`two sum java`, `two sum python solution`, `number of islands
explained`, `longest substring without repeating characters`.

Each individual DSA problem page (`/dsa/problem/<slug>`) is a landing
page for that long-tail query. With ~100 curated problems authored,
this alone is ~3M monthly long-tail impressions at industry CTR.

**Action**: scaffold problem metadata for the full curated list in
`_index.json` so each has an index entry, URL, and breadcrumb link.
Authoring the rich JSON (with approaches/line-by-line/code) happens
per problem, priority-weighted.

### 3.4 Bucket D — Company-pattern pages (bottom-funnel, very high intent)

Pattern: `<company> interview questions`, `<company> coding round`,
`<company> <language> interview`.

| Keyword                              | Volume | Current | Target                              |
|--------------------------------------|--------|---------|-------------------------------------|
| `amazon interview questions`         | 35K    | LIVE (`/dsa/company/amazon`)          | Enhance with structured prep plan |
| `google interview questions`         | 40K    | LIVE                                   | Enhance |
| `microsoft interview questions`      | 22K    | LIVE                                   | Enhance |
| `meta interview questions`           | 18K    | LIVE                                   | Enhance |
| `apple interview questions`          | 10K    | LIVE                                   | Enhance |
| `netflix interview questions`        | 4K     | LIVE                                   | Enhance |
| `uber interview questions`           | 5K     | LIVE                                   | Enhance |
| `goldman sachs interview questions`  | 4K     | LIVE                                   | Enhance |

The existing `/dsa/company/<slug>` pages list problems tagged with
that company. They need a header block with:
- Company-specific interview format (rounds, difficulty skew)
- Most-asked DSA topics (from problem company_tags aggregation)
- Framework questions to expect (cross-link to JBI/JFI)
- FAQ + JSON-LD

**Action**: QUEUED — schedule for PR-G after theory authoring.

### 3.5 Bucket E — Comparison pages ("X vs Y", high buying-intent for engineers)

Pattern: `<X> vs <Y>` — one of the highest conversion keyword families.
We already have `content/compare/*` — audit what's there.

| Keyword                                | Volume | Status |
|----------------------------------------|--------|--------|
| `arraylist vs linkedlist`              | 8K     | LIVE (JBI has this) |
| `hashmap vs hashtable`                 | 7K     | LIVE |
| `rest vs graphql`                      | 9K     | QUEUED |
| `spring vs spring boot`                | 15K    | Audit needed |
| `java 8 vs java 17`                    | 4K     | QUEUED |
| `mysql vs postgresql`                  | 12K    | QUEUED |
| `sql vs nosql`                         | 14K    | QUEUED |
| `monolith vs microservices`            | 7K     | LIVE? audit |
| `react vs angular`                     | 8K     | QUEUED |
| `rest vs soap`                         | 5K     | QUEUED |
| `docker vs kubernetes`                 | 20K    | QUEUED |
| `tcp vs udp`                           | 10K    | QUEUED |
| `http vs https`                        | 12K    | QUEUED |
| `jwt vs oauth`                         | 4K     | QUEUED |

**Action**: audit existing `/compare/*` tree, publish a uniform page
template for all the above. Each "vs" page needs: tl;dr table,
6–8 row feature comparison, when-to-use for each, interview-voice
cheat sheet, 3–5 follow-up questions. Target 1500–2000 words per page.

### 3.6 Bucket F — Experience-level landing pages

Pattern: `<language> interview questions for <N> years experience`.

| Keyword                                         | Volume | Target                                     |
|-------------------------------------------------|--------|---------------------------------------------|
| `java interview questions for 3 years experience`   | 8K  | `/java-interview-questions-3-years-experience` |
| `java interview questions for 5 years experience`   | 9K  | `/java-interview-questions-5-years-experience` |
| `java interview questions for 7 years experience`   | 4K  | `/java-interview-questions-7-years-experience` |
| `java interview questions for freshers`             | 18K | `/java-interview-questions-freshers`        |
| `spring boot interview questions for 5 years`       | 3K  | `/spring-boot-interview-questions-experienced` |

**Action**: QUEUED. These are derived pages built from tags on
existing questions + a short intro. Each page reuses the shared
QuestionPageLayout with a filter in the top.

### 3.7 Bucket G — Informational long-form (top-of-funnel)

Pattern: `how to prepare for <X>`, `<topic> roadmap`, `<topic>
cheat sheet`, `<topic> guide`.

| Keyword                                   | Volume | Target                                  |
|-------------------------------------------|--------|------------------------------------------|
| `how to prepare for coding interview`     | 14K    | `/coding-interview-preparation-guide`   |
| `how to prepare for system design interview` | 12K | `/system-design-preparation-guide`      |
| `dsa roadmap`                             | 9K     | `/dsa-roadmap` (reuse curriculum?)       |
| `spring boot roadmap`                     | 6K     | `/spring-boot-roadmap`                  |
| `java roadmap`                            | 18K    | `/java-roadmap`                         |
| `java cheat sheet`                        | 8K     | `/java-cheat-sheet`                     |
| `big o cheat sheet`                       | 10K    | `/big-o-cheat-sheet` (alt of module)    |
| `sql cheat sheet`                         | 14K    | `/sql-cheat-sheet`                      |

**Action**: QUEUED. These drive top-of-funnel traffic and route into
tracks/modules via internal CTAs.

---

## 4. URL / page inventory

### 4.1 Track landing pages — LIVE

- `/java-backend-intermediate` — LIVE
- `/java-fullstack-intermediate` — LIVE
- `/python-backend-intermediate` — QUEUED (no files yet)
- `/react-intermediate` — QUEUED (no files yet)

### 4.2 DSA pillar — current state and target

#### 4.2.1 Hub (`/dsa`)
- LIVE with phased curriculum, browse chips, sheets, FAQ.

#### 4.2.2 Module pages (`/dsa/module/<slug>`) — 18 total

| # | moduleSlug              | Level        | Focus    | Theory   | Problems indexed | Problems authored |
|---|-------------------------|--------------|----------|----------|------------------|-------------------|
| M01 | complexity-big-o      | beginner     | theory   | ✅ LIVE  | 0 (N/A)           | 0                 |
| M02 | recursion-fundamentals| beginner     | theory   | STUB     | 0 (N/A)           | 0                 |
| M03 | arrays-and-hashing    | beginner     | practice | ✅ LIVE  | 9 (target 15)     | 1 (two-sum)       |
| M04 | two-pointers          | beginner     | practice | ✅ LIVE  | 5 (target 10)     | 0                 |
| M05 | sliding-window        | intermediate | practice | STUB     | 5 (target 8)      | 0                 |
| M06 | binary-search         | intermediate | practice | STUB     | 6 (target 8)      | 0                 |
| M07 | stack-and-queue       | intermediate | practice | STUB     | 5 (target 8)      | 0                 |
| M08 | linked-list           | intermediate | practice | STUB     | 7 (target 10)     | 0                 |
| M09 | trees-and-bst         | intermediate | practice | STUB     | 13 (target 15)    | 0                 |
| M10 | heap-and-priority-queue| intermediate | practice | STUB    | 4 (target 6)      | 0                 |
| M11 | graphs                | advanced     | practice | STUB     | 8 (target 12)     | 0                 |
| M12 | backtracking          | advanced     | practice | STUB     | 7 (target 9)      | 0                 |
| M13 | dynamic-programming   | advanced     | practice | STUB     | 13 (target 15)    | 0                 |
| M14 | greedy                | advanced     | practice | STUB     | 5 (target 7)      | 0                 |
| M15 | intervals             | intermediate | practice | STUB     | 5 (target 6)      | 0                 |
| M16 | bit-manipulation      | intermediate | practice | STUB     | 6 (target 6)      | 0                 |
| M17 | math-and-number-theory| intermediate | practice | STUB     | 5 (target 5)      | 0                 |
| M18 | tries                 | intermediate | practice | STUB     | 4 (target 4)      | 0                 |

Numbers above reflect the state **after** PR-F (this plan round)
expands the `_index.json` `problems[]` to the 75-problem curated
target (see §5).

#### 4.2.3 Problem pages (`/dsa/problem/<slug>`)

Scaffolded in `_index.json` for the full 75-problem curated list
(this PR). Rich authoring (approaches + line-by-line + code in
Java/Python) happens per problem, prioritised Blind-75 first.

#### 4.2.4 Sheet pages (`/dsa/sheet/<slug>`)

| sheetSlug        | Status (post-PR-F) | Canonical                    |
|------------------|--------------------|-------------------------------|
| blind-75         | STUB (live sheet page, problems scaffolded) | `/dsa/sheet/blind-75`  |
| neetcode-150     | STUB               | `/dsa/sheet/neetcode-150`    |
| grind-75         | STUB               | `/dsa/sheet/grind-75`        |
| striver-sde      | QUEUED             | `/dsa/sheet/striver-sde`     |
| top-100          | QUEUED             | `/dsa/sheet/top-100`         |

#### 4.2.5 Browse / filter pages

- `/dsa/[category]` — LIVE (one per data-structure category)
- `/dsa/pattern/<slug>` — LIVE (one per pattern)
- `/dsa/company/<slug>` — LIVE (one per company)
- `/dsa/<difficulty>` (easy/medium/hard) — LIVE

### 4.3 DSA theory / learn pages (`/dsa/module/<slug>` with learn body)

Authoring status for the 18 learn JSONs (`content/dsa/learn/<slug>/index.json`):

| Module                   | Status      | SEO priority | Target word count |
|--------------------------|-------------|--------------|-------------------|
| complexity-big-o         | ✅ LIVE     | P0 (5K vol)  | 1200 (done)       |
| arrays-and-hashing       | ✅ LIVE     | P0 (12K vol) | 1500 (done)       |
| two-pointers             | ✅ LIVE     | P0 (6K vol)  | 1400 (done)       |
| sliding-window           | QUEUED      | P0 (7K vol)  | 1400              |
| binary-search            | QUEUED      | P0 (8K vol)  | 1500              |
| dynamic-programming      | QUEUED      | P0 (18K vol) | 1800              |
| trees-and-bst            | QUEUED      | P0 (8K vol)  | 1600              |
| graphs                   | QUEUED      | P0 (9K vol)  | 1700              |
| linked-list              | QUEUED      | P0 (8K vol)  | 1300              |
| stack-and-queue          | QUEUED      | P1           | 1300              |
| heap-and-priority-queue  | QUEUED      | P1           | 1400              |
| backtracking             | QUEUED      | P1 (4K vol)  | 1500              |
| greedy                   | QUEUED      | P1 (3K vol)  | 1300              |
| intervals                | QUEUED      | P1           | 1200              |
| recursion-fundamentals   | QUEUED      | P1 (6K vol)  | 1200              |
| tries                    | QUEUED      | P2           | 1100              |
| bit-manipulation         | QUEUED      | P2           | 1200              |
| math-and-number-theory   | QUEUED      | P2           | 1100              |

Total remaining: **15 learn files, ~20,000 words**.

### 4.4 Pillar hubs — current state and gaps

Current pillar hubs (from `frontend/lib/seo-pillars.ts`):
`/spring`, `/spring-boot`, `/jpa`, `/jvm`, `/concurrency`,
`/system-design`, `/microservices`, `/devops`, `/sre`, `/java`,
`/java-testing`, `/behavioral`, `/sql`, `/rest-api`, `/security`.

Gaps to add (estimated order by volume):

| Proposed pillarSlug          | Target keyword                              | Volume |
|------------------------------|----------------------------------------------|--------|
| `/cloud`                     | cloud interview questions                   | 8K     |
| `/aws`                       | aws interview questions                     | 20K    |
| `/kubernetes`                | kubernetes interview questions              | 10K    |
| `/docker`                    | docker interview questions                  | 8K     |
| `/design-patterns`           | design patterns interview questions         | 12K    |
| `/low-level-design`          | low level design interview questions        | 9K     |
| `/object-oriented-design`    | oop interview questions                     | 7K     |
| `/graphql`                   | graphql interview questions                 | 4K     |
| `/kafka`                     | kafka interview questions                   | 8K     |
| `/redis`                     | redis interview questions                   | 5K     |
| `/nosql`                     | nosql interview questions                   | 6K     |

**Action**: QUEUED, schedule for PR-H. Each new pillar hub is a
registry entry + a moduleSlugs list. Trivial to author, high SEO ROI.

### 4.5 Comparison pages (`/compare/*` or root canonicals)

See §3.5 bucket for the list. QUEUED as a batch — a uniform
template plus ~20 MD-style pages.

### 4.6 Guide / long-form pages

See §3.7 bucket. QUEUED.

### 4.7 Root-level SEO canonicals

Beyond the existing `SEO_MODULES` registry (each JBI/JFI module's
`seoSlug`), DSA modules need similar registration so their root
canonicals (`/arrays-and-hashing-interview-questions`) resolve.

**Action**: QUEUED for PR-G. Requires extending `seo-slugs.ts` with
a dynamic loader that reads `content/dsa/_index.json` `modules[]`
and adds each `seoSlug` to `SEO_MODULES` with synthetic domain
`dsa-pillar`, plus a proxy rewrite from `/<seoSlug>` to
`/dsa/module/<moduleSlug>`.

---

## 5. DSA curated problem master list (post-PR-F)

Target: 75 curated interview-defining problems. Not 450 — breadth
without depth is the GeeksforGeeks trap. Every problem on this list
must earn its slot by (a) appearing on at least one canonical sheet
or (b) being explicitly asked at FAANG in the last 2 years.

Grouped by module, each entry eventually ships as a rich
`/dsa/problem/<slug>` page.

**Source authority** for inclusion:
- [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU) — the canonical 75 from Blind.
- [NeetCode 150](https://neetcode.io/practice) — expanded to 150.
- [Grind 75](https://www.techinterviewhandbook.org/grind75) — time-aware sequence by Yangshun.
- FAANG company tags aggregated from LeetCode discuss + Glassdoor.

### M03 · Arrays & Hashing (target 15, current 9 after PR-F)
- two-sum · valid-anagram · contains-duplicate · group-anagrams ·
  product-of-array-except-self · encode-decode-strings ·
  longest-consecutive-sequence · valid-sudoku · first-unique-character

### M04 · Two Pointers (target 10, current 5)
- reverse-linked-list (shared ref) · detect-cycle (shared ref) ·
  valid-palindrome · 3sum · container-with-most-water ·
  trapping-rain-water

### M05 · Sliding Window (target 8, current 5)
- best-time-to-buy-stock · longest-substring-without-repeat ·
  longest-repeating-character-replacement ·
  minimum-window-substring · permutation-in-string

### M06 · Binary Search (target 8, current 6)
- search-in-rotated-sorted-array ·
  find-minimum-in-rotated-sorted-array · binary-search ·
  search-in-2d-matrix · koko-eating-bananas ·
  median-of-two-sorted-arrays

### M07 · Stack & Queue (target 8, current 5)
- valid-parentheses · min-stack ·
  evaluate-reverse-polish-notation · generate-parentheses ·
  daily-temperatures

### M08 · Linked List (target 10, current 7)
- reverse-linked-list · detect-cycle · merge-two-sorted-lists ·
  reorder-list · remove-nth-from-end ·
  copy-list-with-random-pointer · lru-cache

### M09 · Trees & BST (target 15, current 13)
- binary-tree-traversal · validate-bst · invert-binary-tree ·
  maximum-depth-of-binary-tree · balanced-binary-tree · same-tree ·
  subtree-of-another-tree · lowest-common-ancestor-bst ·
  binary-tree-level-order-traversal · binary-tree-right-side-view ·
  kth-smallest-in-bst · construct-binary-tree-from-preorder-inorder ·
  binary-tree-maximum-path-sum

### M10 · Heap & Priority Queue (target 6, current 4)
- top-k-frequent-elements · find-median-from-data-stream ·
  k-closest-points-to-origin · task-scheduler

### M11 · Graphs (target 12, current 8)
- number-of-islands · course-schedule · clone-graph ·
  pacific-atlantic-water-flow · rotting-oranges ·
  graph-valid-tree · number-of-connected-components ·
  word-ladder

### M12 · Backtracking (target 9, current 7)
- subsets · combination-sum · permutations · word-search ·
  palindrome-partitioning · letter-combinations-of-phone-number ·
  n-queens

### M13 · Dynamic Programming (target 15, current 13)
- maximum-subarray · climbing-stairs · coin-change · house-robber ·
  house-robber-ii · longest-palindromic-substring ·
  palindromic-substrings · decode-ways ·
  longest-increasing-subsequence · word-break · unique-paths ·
  longest-common-subsequence · maximum-product-subarray

### M14 · Greedy (target 7, current 5)
- jump-game · jump-game-ii · gas-station · hand-of-straights ·
  merge-triplets

### M15 · Intervals (target 6, current 5)
- insert-interval · merge-intervals · non-overlapping-intervals ·
  meeting-rooms · meeting-rooms-ii

### M16 · Bit Manipulation (target 6, current 6)
- single-number · number-of-1-bits · counting-bits · reverse-bits ·
  missing-number · sum-of-two-integers

### M17 · Math & Geometry (target 5, current 5)
- rotate-image · spiral-matrix · set-matrix-zeroes ·
  happy-number · plus-one

### M18 · Tries (target 4, current 4)
- implement-trie · design-add-and-search-words · word-search-ii ·
  replace-words

**Authoring priority order** (when we start writing the rich problem
JSONs): anything in Blind 75 first (P0), then NeetCode 150-only
additions (P1), then the handful of essentials we added for module
balance (P2).

---

## 6. JBI audit — what's strong, what's missing

JBI is the mature track. Structure is solid; gaps are around
**SEO surface coverage** not schema.

### 6.1 Strong (no changes needed)
- Spring Boot, JPA, Hibernate, JVM, concurrency, collections,
  streams, exceptions, microservices, system design, REST API.
- Per-module SEO slugs registered.
- Pillar hubs for the big ones.

### 6.2 Gaps to consider (user approval required before any changes)

| Gap                                                        | Action        |
|------------------------------------------------------------|---------------|
| No `/design-patterns` pillar hub                            | Add pillar hub, reuse 2–3 existing JBI modules |
| No `/low-level-design` pillar hub                          | Add pillar hub, cross-link to system design |
| Spring Security module exists? Audit needed                 | Verify, add if missing |
| Kafka / messaging coverage                                 | Confirm, add module if missing |
| AWS / cloud deployment module                              | Out of scope — belongs in DevOps or new track |

**User directive: "keep JBI domain intact".** All of §6.2 is advisory
only — no files will be touched without explicit go-ahead.

---

## 7. JFI audit — what needs fleshing

JFI reuses JBI backend via `contentSource`. Its own contribution is
the frontend/fullstack-specific modules.

### 7.1 Frontend modules (JFI-owned) — current state

| Module                     | Reuses? | Theory | Questions |
|----------------------------|---------|--------|-----------|
| javascript                 | JFI     | ?      | ?         |
| typescript                 | JFI     | ?      | ?         |
| react                      | JFI     | ?      | ?         |
| angular                    | JFI     | ?      | ?         |
| web-foundations            | JFI     | ?      | ?         |
| frontend-build-delivery    | JFI     | ?      | ?         |
| fullstack-integration      | JFI     | ?      | ?         |

**Action**: §7 is flagged for audit in PR-H. Need to enumerate which
JFI-owned modules have `complete-qa.json` actually authored vs just
scaffolded empties from the earlier PR.

### 7.2 JFI-specific pillar hubs to add

When each frontend topic reaches authoring threshold:

- `/react` — react interview questions (18K volume)
- `/javascript` — js interview questions (55K volume)
- `/typescript` — ts interview questions (12K volume)
- `/angular` — angular interview questions (10K volume)
- `/nodejs` — node interview questions (14K volume)

**Action**: QUEUED. Gate each pillar on the underlying module having
≥20 authored questions — otherwise it's an empty hub that hurts SEO.

---

## 8. Content authoring templates (for future writing sessions)

### 8.1 DSA learn page template (30–60 min per module once cadence hits)

```jsonc
{
  "moduleSlug": "...",
  "title": "...",
  "tagline": "... (1 line)",
  "intro": "... (2–3 paragraphs, ~250 words)",
  "objectives": ["...", "..."],            // 5–7 bullets
  "whenToUse": {
    "signals": ["..."],                    // 4–6 bullets
    "antiSignals": ["..."]                 // 2–4 bullets
  },
  "sections": [
    {
      "id": "...",
      "heading": "...",
      "body": "... (150–300 words)",
      "codeExamples": [
        { "language": "java",   "label": "...", "code": "..." },
        { "language": "python", "label": "...", "code": "..." }
      ],
      "callouts": [ { "type": "tip", "text": "..." } ]
    }
  ],
  "interviewTalking": "... (1 paragraph)",
  "commonMistakes": ["..."],               // 4–6 bullets
  "complexityNotes": "...",
  "problemOrder": ["...", "..."],          // intended practice sequence
  "seo": { "title": "...", "description": "...", "altSlugs": ["..."] }
}
```

### 8.2 DSA problem page template (already live, documented for reference)

The rich problem schema (`DSAProblem` in `contentV2-types.ts`) has:
- `problemStatement`, `constraints`, `examples[]`
- `howToThink` (approach selection narration)
- `approaches[]`: each with `whenToMention`, `complexity`,
  `explanation`, `code` (per language), `lineByLine` (per language)
- `interviewVoice`, `commonMistakes`, `followupVariations`,
  `patternNote`
- `seo` block

Reference implementation: `content/dsa/arrays/two-sum.json`.

### 8.3 Pillar hub template

`frontend/lib/seo-pillars.ts` registry entry:
```ts
{
  pillarSlug: "design-patterns",
  title: "Design Patterns Interview Questions",
  tagline: "Gang of Four patterns interviewers actually ask about.",
  heroBlurb: "… 40–60 word hand-authored intro …",
  moduleSlugs: ["...", "..."],
  metaDescription: "… ≤160 chars …",
  relatedPillars: ["system-design", "low-level-design", "java"]
}
```

### 8.4 Comparison page template (1500–2000 words target)

```
# X vs Y — The Interview-Grade Comparison

## TL;DR (table — 6 rows)

## Feature-by-feature (10 rows)

## When to use X

## When to use Y

## Interview-voice cheat sheet
  - How to answer "X vs Y" in 30 seconds
  - How to answer in 3 minutes
  - How to answer in a whiteboard deep-dive

## Common follow-up questions (5)

## Related
```

---

## 9. Phased roadmap (PRs, in dependency order)

| PR  | Scope                                                                  | Session              | Status       |
|-----|-------------------------------------------------------------------------|----------------------|--------------|
| PR-A | DSA hub credibility fix (live counts, FAQ, JSON-LD)                     | Earlier              | ✅ Done      |
| PR-B | DSA pillar + modules data layer (modules[] + moduleSlug back-ref)       | Earlier              | ✅ Done      |
| PR-C | DSA module landing pages + 3 exemplar learn files                       | Earlier              | ✅ Done      |
| PR-D | DSA hub UX overhaul (phase grouping, module links)                      | Earlier              | ✅ Done      |
| PR-F | Content plan + DSA problem master list + Sheets system                  | Earlier              | ✅ Done      |
| **DSA-UX** | **Surface harmonisation (shared shell, pills, problem rows, data-driven difficulty/pattern/company pages, canonical `/dsa/problem/<slug>`)** | **This session** | **✅ Done** |
| **PR-G** | **Register DSA module seoSlugs in SEO_MODULES; proxy rewrites**      | **This session**     | **✅ Done**  |
| PR-H | Author remaining 15 DSA learn files (P0 first: DP, trees, graphs, BS)   | Next                 | Pending      |
| PR-I | Author P0 rich problem JSONs (Blind 75 priority)                        | Ongoing              | Pending      |
| PR-J | Company page enhancements (header blocks, prep plans)                   | Later                | Pending      |
| PR-K | `externalSource` resolver — embed DSA modules into JBI/JFI/Python       | Later                | Pending      |
| PR-L | Comparison page template + bulk "X vs Y" publishing                     | Later                | Pending      |
| PR-M | New pillar hubs (aws, docker, kubernetes, kafka, design-patterns, …)    | Later                | Pending      |
| PR-N | Guide / long-form (how-to-prepare-for-X, roadmaps, cheat sheets)        | Later                | Pending      |
| PR-O | Experience-level landing pages (java for 3/5/7 yrs; freshers)           | Later                | Pending      |

---

## 10. Metrics to watch (once PRs ship)

| Metric                                    | Tool                | Baseline | 90-day target |
|-------------------------------------------|---------------------|----------|----------------|
| GSC impressions                           | Google Search Console | (before PRs) | 10x          |
| GSC clicks                                | GSC                 | (before)  | 15x            |
| Top-10 rankings for listed keywords       | GSC / Ahrefs        | tbd       | 30+ terms      |
| Pages indexed                             | GSC                 | ~200      | 800+           |
| Avg session duration                      | Plausible/GA        | tbd       | 3+ min         |
| Bounce rate on DSA hub                    | Plausible/GA        | tbd       | <40%          |

---

## 11. Non-goals / explicit SKIPs

- **Video content**: out of scope. Videos live on YouTube; site
  pages stay text-and-code. If we want videos, they embed, we don't
  host.
- **Paywalled tiers / subscription**: out of scope. Free is the moat.
- **Discussion forum / comments**: out of scope. Signal-to-noise poor.
- **User-generated content**: out of scope. Editorial quality is
  the moat.
- **More than 1 Indian-exam-style question bucket**: e.g. we do NOT
  go after "java interview questions pdf download" — that's a GFG
  floor, not a FAANG prep floor.
- **Mobile-native apps**: site is mobile-responsive; native apps are
  a distraction.

---

## 12. Ownership model

Every new page or content unit lives in one of these folders:

| Content kind            | Location                                        |
|-------------------------|--------------------------------------------------|
| Locked domain module Q&A| `content/<domain>/<module>/<question>/complete-qa.json` |
| Shared module Q&A       | `content/shared/<pillar>/<stack>/<level>/complete-qa.json` |
| DSA problem (rich)      | `content/dsa/<category>/<slug>.json`            |
| DSA learn / theory      | `content/dsa/learn/<moduleSlug>/index.json`     |
| DSA sheet               | `content/dsa/sheets/<sheetSlug>/index.json`     |
| Pillar hub definition   | `frontend/lib/seo-pillars.ts`                   |
| SEO slug registry       | `frontend/lib/seo-slugs.ts`                     |
| Comparison pages        | `content/compare/<x>-vs-<y>/index.json`         |

**When you add a new piece of content**: verify it falls in one of
the above buckets. If it doesn't, propose a new bucket in
URL-REGISTRY.md §5 / §12 first — don't invent a new schema ad hoc.

---

*Keep this file in lockstep with `docs/URL-REGISTRY.md` §11 change
log whenever a PR from §9 ships.*
