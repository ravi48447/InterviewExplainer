# 47 — Companies & Career Hubs

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content + hub flips (two related hubs ship together).
> **Depends on:** 21 (JBB), 28 (JFI), 35 (PBI). Behavioral hub (45)
> recommended but not blocking.

---

## §0 — Front-matter

```yaml
playbook:      47
version:       1.0
status:        ready
wave:          E
type:          hub-infrastructure + content
hubs:
  - companies
  - career
depends_on:    [21, 28, 35, 45]
flags:
  - ENABLED_HUBS.companies
  - ENABLED_HUBS.career
deliverables:
  company_pages: 12
  career_pages: 6
  profile_json_files: 18
```

---

## §3 — Glossary

| Term | Definition |
| --- | --- |
| **company hub** | A set of pages at `/companies/<slug>` that aggregate interview intel, loop structure, and representative questions for a specific employer. |
| **career hub** | A set of pages at `/career/<slug>` that describe what interviewers look for at a specific YOE band (fresher → staff → EM) with curated question lists. |
| **`company_tags`** | Field on every question JSON (`"company_tags": ["Amazon", "Google"]`) listing companies known to ask that question. The aggregator reads these to populate company pages. |
| **`profile.json`** | Per-company or per-career-stage JSON file under `content/companies/<slug>/` or `content/career/<slug>/` containing the hub page's structured data (loop, cultural Qs, emphasis). |
| **loop structure** | The sequence of interview rounds at a company: phone screen → online assessment → onsite loop → hiring committee. |
| **Leadership Principles (LPs)** | Amazon's 16 (now 17) guiding principles used as the behavioral rubric in every Amazon interview loop; questions map to specific LPs. |
| **`representativeFeeds`** | Field in `profile.json` listing locked-domain module paths (`domain/module`) whose questions should be surfaced on the company page. |
| **`behavioralFocus`** | Field in `profile.json` naming the behavioral Q archetype or cultural framework a company emphasizes (e.g. `"leadership-principles"` for Amazon). |
| **Levels.fyi** | Public compensation database; used in pay & leveling paragraphs as the external anchor for compensation data. All claims must cite public Levels.fyi data. |
| **YOE (Years of Experience)** | Shorthand used in career hub slugs to define the scope of each stage: 0–2 YOE = fresher, 3–5 = mid-level, etc. |
| **IC track** | Individual Contributor track: Staff, Principal, Distinguished/Fellow. Distinct from the EM (Engineering Manager) track. |
| **EM track** | Engineering Manager track: EM → Sr EM → Director. Separate career page from the IC track. |
| **`BreadcrumbList` JSON-LD** | Structured data for breadcrumb navigation; applied to all company and career pages to improve SERP display. |
| **`Organization` JSON-LD** | Structured data applied to company pages to help Google associate the page with the company entity. |
| **cultural questions** | Behavioral Qs tied to a specific company's values framework (Amazon LPs, Netflix culture deck); written in interviewer voice, distinct from generic STAR Qs. |
| **`ENABLED_HUBS`** | Feature-flag map in `frontend/lib/launch-config.ts`; each hub flips independently with its own commit. |

---

## §1 — TL;DR

- **Goal:** Capture **company-specific** search ("amazon java interview
  questions", "google python interview questions") and **career-stage**
  search ("how to become a staff engineer", "principal engineer
  interview").
- **Action:** Build the `companies` and `career` hubs, ship 12 company
  guides + 6 career-stage guides, cross-link both into existing
  module content.
- **Output:** `/companies` and `/career` hubs live; ≥ 12 company pages
  + ≥ 6 career stage pages return 200; both hubs in sitemap.

## Hard prerequisites

- [ ] At least JBI + PBI live (so company answers can link to depth).
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.companies` and
      `ENABLED_HUBS.career` (add if missing; default `false`).
- [ ] `content/companies/` directory exists (create if missing).
- [ ] Speakable lint passes on the modules feeding these hubs.

## Why this matters (2 sentences)

Company-specific search ("amazon interview questions" alone clears
~40k monthly) is one of the **highest-intent buckets in interview
prep** — users searching this are within weeks of an interview and
convert at 3-4x site average. Career-stage pages ("staff engineer
interview") capture **planning-stage** users 6-12 months out, which
seeds long-term funnel growth and gives us a content tent for every
behavioral / leadership Q we've already written.

## Search phrases to own

| Hub        | Search phrase                                          | Target page                                  |
| ---------- | ------------------------------------------------------ | -------------------------------------------- |
| Companies  | `amazon interview questions`                           | `/companies/amazon`                          |
| Companies  | `amazon java interview questions`                      | `/companies/amazon?lang=java`                |
| Companies  | `google interview questions software engineer`         | `/companies/google`                          |
| Companies  | `google python interview questions`                    | `/companies/google?lang=python`              |
| Companies  | `meta interview questions`                             | `/companies/meta`                            |
| Companies  | `microsoft interview questions`                        | `/companies/microsoft`                       |
| Companies  | `netflix interview questions`                          | `/companies/netflix`                         |
| Companies  | `stripe interview questions`                           | `/companies/stripe`                          |
| Companies  | `uber interview questions`                             | `/companies/uber`                            |
| Companies  | `atlassian interview questions`                        | `/companies/atlassian`                       |
| Companies  | `apple interview questions software engineer`          | `/companies/apple`                           |
| Companies  | `adobe interview questions`                            | `/companies/adobe`                           |
| Companies  | `goldman sachs interview questions software engineer`  | `/companies/goldman-sachs`                   |
| Career     | `how to become a staff engineer`                       | `/career/staff`                              |
| Career     | `staff engineer interview questions`                   | `/career/staff`                              |
| Career     | `principal engineer interview questions`               | `/career/principal`                          |
| Career     | `engineering manager interview questions`              | `/career/engineering-manager-first-time`     |
| Career     | `senior software engineer interview questions`         | `/career/senior`                             |
| Career     | `software engineer fresher interview questions`        | `/career/fresher`                            |
| Career     | `mid level software engineer interview`                 | `/career/mid-level`                          |

## Current state

- `content/companies/` does NOT exist (or is empty stub) today.
- No `/companies` or `/career` routes.
- Company-tagged questions DO exist across modules (each Q has
  `company_tags: [...]`) but no aggregator.

## Target state (measurable)

- 12 company pages + 6 career stage pages return 200.
- Each company page links to ≥ 10 representative module Qs.
- Each career page links to ≥ 30 representative module Qs and ≥ 5
  behavioral stories.
- Sitemap includes all 18 hub URLs.
- Each page has unique `<title>`, `<meta description>`, and
  `BreadcrumbList` JSON-LD.

## 47.1 — Companies hub

### Launch company list (12 at launch)

| Company        | Slug             | Loop signature (cross-link emphasis)                                    |
| -------------- | ---------------- | ----------------------------------------------------------------------- |
| Amazon         | `amazon`         | Leadership principles + system design + Java                            |
| Google         | `google`         | Algorithms + system design + Python                                     |
| Microsoft      | `microsoft`      | Mixed; teams-specific (Azure / O365); .NET + Java + Python              |
| Meta           | `meta`           | Algorithms (LeetCode hard) + system design + behavioral                 |
| Apple          | `apple`          | Domain-deep (specific role); Swift / Java / system design               |
| Netflix        | `netflix`        | System design + culture (KTLO, freedom & responsibility); Java          |
| Uber           | `uber`           | System design at scale + Go + Java                                       |
| Stripe         | `stripe`         | API design + Ruby + Go + behavioral                                     |
| Atlassian      | `atlassian`      | Java + system design + collaboration culture                            |
| Adobe          | `adobe`          | Java + system design + craft questions                                  |
| Walmart        | `walmart`        | Java + system design at scale                                            |
| Goldman Sachs  | `goldman-sachs`  | Java + low-latency + concurrency                                        |

(Add Indian / European targets — Flipkart, Razorpay, Booking, Adyen — as
growth playbooks; not blocking.)

### Each company page contains

- **Overview** (200 words): engineering culture, public tech stack
  signals, what they grade.
- **Interview loop structure** (3-5 rounds typically): phone screen,
  loop format, follow-up, hiring committee.
- **Topic emphasis** (200 words): what *this company* leans on most
  vs the industry baseline.
- **Representative questions** (≥ 10, ≥ 20 ideal): aggregated from
  `company_tags` in locked-domain content; each card hrefs to the
  source Q page.
- **Company-cultural questions** (5): behavioral questions tied to
  *this company's* values (e.g. Amazon LPs, Netflix culture deck).
- **Pay & leveling cheat** (one paragraph): public Levels.fyi anchor +
  link, no insider claims.

### Implementation

`content/companies/<slug>/profile.json`:

```json
{
  "slug": "amazon",
  "name": "Amazon",
  "blurb": "200-word overview …",
  "loop": [
    { "round": "phone screen", "duration": "45m", "focus": "coding (LeetCode med)" },
    { "round": "online assessment", "duration": "90m", "focus": "coding + work-style survey" },
    { "round": "onsite loop", "duration": "5h", "focus": "system design + 4× behavioral (LPs)" }
  ],
  "topicEmphasis": ["leadership-principles", "system-design", "java"],
  "behavioralFocus": "leadership-principles",
  "representativeFeeds": [
    "java-backend-intermediate/system-design-cases",
    "java-backend-intermediate/behavioral",
    "java-backend-advanced/staff-engineer-leadership"
  ],
  "culturalQuestions": [
    "Tell me about a time you took ownership of a problem outside your scope.",
    "Tell me about a time you disagreed with a senior engineer's design.",
    "Tell me about a time you delivered something on a very short timeline.",
    "Tell me about a time you simplified a complex system.",
    "Tell me about a time you delivered a project despite ambiguity."
  ]
}
```

`frontend/lib/hubs/companies.ts`:

```typescript
export interface CompanyProfile { /* mirror of profile.json shape */ }

export function listCompanies(): CompanyProfile[] { /* ls content/companies */ }
export function getCompanyProfile(slug: string): CompanyProfile | undefined { /* read profile.json */ }
export function listCompanyQuestions(slug: string) {
  const profile = getCompanyProfile(slug);
  if (!profile) return [];
  // walk LOCKED_DOMAINS, filter Qs whose company_tags include profile.slug
  // OR Qs sourced from profile.representativeFeeds
  return [];
}
```

## 47.2 — Career hub

### Launch career-stage list (6 at launch)

| Stage                          | Slug                             | YOE                | Anchor modules                                       |
| ------------------------------ | -------------------------------- | ------------------ | --------------------------------------------------- |
| Fresher                        | `fresher`                        | 0–2 YOE            | JBB, PBB, behavioral-and-fresher-qa                  |
| Mid-level                      | `mid-level`                      | 3–5 YOE            | JBI, PBI                                             |
| Senior                         | `senior`                         | 5–8 YOE            | JBI advanced topics + JBA easy half                  |
| Staff                          | `staff`                          | 8+ YOE IC          | JBA staff-engineer-leadership + system-design-at-scale |
| Principal                      | `principal`                      | 10+ YOE IC         | JBA principal-architect topics                       |
| EM (first-time)                | `engineering-manager-first-time` | EM track           | JBA engineering-management-and-hiring                |

### Each career page contains

- **Definition + scope** (200 words): what this level *means*, not
  what the title says.
- **What interviewers look for** (300 words): explicit signal list.
- **Representative technical questions** (≥ 20): cross-linked.
- **Representative behavioral questions** (≥ 10): cross-linked to
  behavioral hub (playbook 45).
- **Recommended reading order** across the site (8-12 items).
- **Common failure modes** (5 bullets specific to this level).
- **Sample 60-min mock outline** (one template).

### Implementation

`content/career/<slug>/profile.json` mirroring companies pattern.

`frontend/lib/hubs/career.ts` mirroring companies.

## Step 1 — Write 12 company profile.json + 6 career profile.json

Hand-write each (the cultural questions and topic emphasis matter for
SEO — these CANNOT be auto-generated).

## Step 2 — Build the hubs

Routes:

```
frontend/app/companies/page.tsx          // index of 12 cards
frontend/app/companies/[slug]/page.tsx   // company page

frontend/app/career/page.tsx              // index of 6 cards
frontend/app/career/[slug]/page.tsx       // career stage page
```

Shared components: `<CompanyCard>`, `<CareerCard>`, `<QuestionList>`
(reuse playbook 41's `<QuestionTable>`).

## Step 3 — Flip flags

```typescript
// frontend/lib/launch-config.ts
ENABLED_HUBS: {
  ...,
  companies: true,
  career:    true,
};
```

Commit per hub (2 commits).

## Step 4 — Smoke

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20

npm run dev &
DEV_PID=$!
sleep 5

for url in \
  /companies \
  /companies/amazon /companies/google /companies/meta /companies/microsoft \
  /companies/stripe /companies/uber /companies/netflix \
  /career \
  /career/fresher /career/mid-level /career/senior /career/staff \
  /career/principal /career/engineering-manager-first-time; do
  printf "%-55s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

Expected: all `200`.

## Files and code to touch

| Path                                                | Change                          |
| --------------------------------------------------- | ------------------------------- |
| `frontend/lib/launch-config.ts`                     | add 2 flags                     |
| `content/companies/<slug>/profile.json` × 12        | NEW                             |
| `content/career/<slug>/profile.json` × 6            | NEW                             |
| `frontend/lib/hubs/companies.ts`                    | NEW                             |
| `frontend/lib/hubs/career.ts`                       | NEW                             |
| `frontend/app/companies/page.tsx` + `[slug]`        | NEW                             |
| `frontend/app/career/page.tsx` + `[slug]`           | NEW                             |
| `scripts/build_sitemap.ts`                          | enumerate 20 hub URLs           |
| `frontend/components/Header.tsx`                    | add 2 nav links                 |

## Content rules

- Company overviews use only **public information** — Levels.fyi,
  team blog posts, public-tech-stack mentions. No insider claims.
- Cultural questions are written in the **interviewer's voice**
  (questions, not statements).
- Each company page MUST cross-link ≥ 10 module Qs (build assertion).
- Career pages are level-specific — no "this stage is whatever your
  company says it is"; pick a defensible definition (we use
  Levels.fyi mapping).

## SEO and URLs

- Canonical: `/companies/<slug>`, `/career/<slug>`.
- `BreadcrumbList` + `Organization` JSON-LD on company pages.
- `BreadcrumbList` + `ItemList` JSON-LD on career pages.
- Title format: `<Company> Interview Questions | InterviewExplainer`
  and `<Stage> Interview Questions & Prep | InterviewExplainer`.

## Quality gates

| Gate                                          | Threshold     | Verify with                                                              |
| --------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| 12 company pages live                         | 12 of 12      | smoke loop                                                                |
| 6 career pages live                           | 6 of 6        | smoke loop                                                                |
| Each company links ≥ 10 module Qs             | 12 of 12      | aggregator output per page                                                |
| Each career links ≥ 30 module Qs              | 6 of 6        | aggregator output per page                                                |
| Each company has 5 cultural Qs                | 12 of 12      | jq on profile.json                                                        |
| All hub pages return 200                      | 20 of 20      | smoke loop                                                                |
| Sitemap includes all hub URLs                 | yes           | `grep -cE '/(companies|career)/' frontend/public/sitemap.xml` ≥ 20       |
| `npm run build` exit 0                        | 0             | build log                                                                  |

## Failure modes & rollback

- **Company page lists < 10 cross-links** because `company_tags` was
  thin: add the company tag to existing high-quality Qs (don't write
  new content here — that's playbook 12-17 work).
- **A company profile claims insider info** (compensation bands,
  unposted recruiter scripts): rewrite using public sources only.
- **Career page mixes IC + EM signals**: split — staff/principal are
  IC; EM is its own page.
- **Rollback (per hub):** `ENABLED_HUBS.companies = false` or
  `career = false`.

## Definition of Done

- [ ] `ENABLED_HUBS.companies = true` and `career = true`.
- [ ] All 20 smoke URLs return 200.
- [ ] All gate thresholds met.
- [ ] All hub URLs in sitemap.
- [ ] Header has 2 new nav entries.
- [ ] `00-INDEX.md` row for `47` flipped to `DONE`.

## Estimated effort

- **Ideal:** 50 hours (≈ 2 h per company × 12 + 4 h per career × 6 +
  hub UI + flags).
- **Hard stop:** 80 hours.
