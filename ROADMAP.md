# InterviewExplainer — Launch Roadmap

> **Source of truth for what's live vs. hidden on the public site.**
> If you touch the home page, site header, site footer, or `/domains` page,
> read this first.

The runtime feature flags live in [`frontend/lib/launch-config.ts`](./frontend/lib/launch-config.ts).
**That file is the only place to change "what the visitor sees".** Don't add or
remove individual links in the UI components — flip flags and let the UI react.

---

## ✅ Phase 1 — MVP Launch (now)

**Scope:** the smallest surface we're confident is polished, content-rich, and
link-clean end-to-end.

### Languages live on `/domains` and the home-page language grid

| Language | Tracks with content                                | Status      |
| -------- | -------------------------------------------------- | ----------- |
| Java     | backend (beginner + **intermediate**), fullstack, android | ✅ Live      |
| Python   | backend, fullstack, data-engineering, ml-ai         | ✅ Live      |

The flagship path is **`java-backend-intermediate`** (the locked JBI tree under
`content/java-backend-intermediate/` — 35 modules, ~400 Q&A).

### Hubs live on the site

| Hub             | Route                 | Status |
| --------------- | --------------------- | ------ |
| Interview Q&A   | `/domains` + domain pages | ✅ Live |
| Dashboard       | `/dashboard`          | ✅ Live (auth users) |
| Auth            | `/login`, `/signup`   | ✅ Live |
| Legal           | `/privacy`, `/terms`, `/cookies` | ✅ Live |
| Company pages   | `/about`, `/support`  | ✅ Live |

---

## 🕑 Phase 2 — Expand languages (next)

Unlock by flipping `ENABLED_LANGUAGES` in `launch-config.ts`.

| Language   | Content today                         | Gap to ship                                        |
| ---------- | ------------------------------------- | -------------------------------------------------- |
| JavaScript | `content/interview/javascript/{backend,frontend,fullstack}` | QA pass, fill beginner + advanced gaps             |
| TypeScript | none                                  | write full track (backend, frontend, fullstack)    |
| Go         | `content/interview/go/backend`        | expand beyond starter set, add fullstack/cloud     |
| Ruby       | `content/interview/ruby/{backend,fullstack}` | thin — needs 30+ questions per level               |
| Kotlin     | none                                  | android + backend                                  |
| C# / .NET  | none                                  | full backend track                                 |

---

## 🕓 Phase 3 — Secondary hubs (later)

All of these pages exist at their route (look under `frontend/app/`) but render
placeholder landings, broken internal links, or content we haven't reviewed.
**The UI intentionally hides them.** Flip the matching flag in
`ENABLED_HUBS` once the work below is done.

| Hub                | Route            | Flag                          | Work required to ship                                            |
| ------------------ | ---------------- | ----------------------------- | ----------------------------------------------------------------- |
| System Design      | `/system-design` | `systemDesign`                | Populate 25+ real problems with diagrams; QA internal links       |
| DSA Problems       | `/dsa`           | `dsa`                         | Hook up pattern → problem data, remove lorem-ipsum placeholders   |
| Behavioral         | `/behavioral`    | `behavioral`                  | STAR framework articles + 70+ questions with model answers         |
| Topics & Concepts  | `/topics`        | `topics`                      | Decide whether this survives or folds into `/domains`             |
| Tools Deep Dive    | `/tools`         | `tools`                       | Docker, Kafka, Redis, AWS deep-dives                              |
| Compare X vs Y     | `/compare`       | `compare`                     | Build out comparison matrices                                      |
| Company Prep       | `/companies`     | `companies`                   | FAANG + unicorn process breakdowns                                 |
| Career Guide       | `/career`        | `career`                      | Resume, negotiation, transitions                                   |
| Roadmaps           | `/roadmaps`      | `roadmaps`                    | 4/8/12-week study plans                                           |
| Cheatsheets        | `/cheatsheets`   | `cheatsheets`                 | Quick references per language                                      |
| Mock Interviews    | `/mock-interviews` | `mockInterviews`            | Wire up the backend scheduling + recording flow                    |
| Search             | `/search`        | `search`                      | Rebuild the full-text index over the launch-scope content          |
| Browse by Language | `/interview`     | `interviewByLang`             | Superseded by `/domains` — kill or redirect                        |

---

## 🗃️ Content we have but aren't exposing

These are fully authored but **not linked from any visible UI** in MVP. They're
reachable only if you know the URL or open the folder directly.

- `content/interview/javascript/**`
- `content/interview/go/**`
- `content/interview/ruby/**`
- `content/business-analyst/**`
- `content/data-analyst/**`

All of the above still resolve at their canonical domain URL
(`/{lang}-{track}-{level}`) because the `content-reader` mapping in
`frontend/lib/content-reader.ts` keeps the SLUG_TO_PATH entries intact —
that's deliberate so nothing rots while it's hidden.

---

## 🧪 Smoke-test checklist before pushing "live"

Run through this whenever you flip a flag:

1. `npm run build` in `frontend/` — build must succeed with no type errors.
2. Click every link on `/` (home) — none should 404.
3. `/domains` — every card whose `hasContent` is true must open a real page.
4. Open one Java and one Python question end-to-end (sidebar navigation works,
   prev/next buttons work, code blocks render, mermaid diagrams render).
5. Header dropdown + mobile drawer — every link must lead somewhere useful.
6. Footer — every link must lead somewhere useful.
7. `/login`, `/signup`, `/privacy`, `/terms`, `/cookies` — render, no console
   errors.

---

## 📐 Architecture reminders

- `frontend/proxy.ts` canonicalises legacy URL shapes (`/java-backend-0-1` →
  `/java-backend-beginner`, `/interview/java/backend/intermediate/...` →
  `/java-backend-intermediate/...` for migrated domains).
- `frontend/lib/content-reader.ts` holds `SLUG_TO_PATH` — the mapping from
  public domain slug to on-disk content folder. **Add new languages there
  before adding them to `ENABLED_LANGUAGES`.**
- `frontend/lib/launch-config.ts` — the ONLY place to flip visibility.
- `frontend/lib/seo-slugs.ts` — alternative SEO-friendly URLs for indexing.

---

## 📚 Sequential expansion playbooks

For the full step-by-step plan that grows the site from today's MVP into a
multi-language, multi-hub platform, follow the 51 playbooks under
[`expansion-plan/`](./expansion-plan/). Start at
[`expansion-plan/00-INDEX.md`](./expansion-plan/00-INDEX.md) and do not skip
file 05 before any launch playbook.
