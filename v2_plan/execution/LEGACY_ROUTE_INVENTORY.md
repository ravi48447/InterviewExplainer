# Legacy Route Inventory & Migration Plan (P15-T398..T406)

**Workstream AM — Legacy Route Migration.** Inventory of every existing URL,
its migration disposition, and the redirect/retention strategy.

## Method

The v2 frontend repo is a subset of the full remote repo and is not a git
working copy locally. This inventory was built by enumerating `app/**/page.tsx`
in the v2 tree and classifying each route by its v2 disposition.

## Route inventory

### Preserved (correct as-is) — P15-T399

These routes were already rebuilt in Phases 02–10 and remain canonical v2
surfaces. No redirect needed; internal links already target them.

| Route | Phase rebuilt | Notes |
|-------|---------------|-------|
| `/` (homepage) | P04 | Server-rendered orientation layer |
| `/search` | P07 | Global search surface |
| `/dashboard` | P09 | Authenticated dashboard shell |
| `/dashboard/bookmarks`, `/dashboard/progress` | P09 | User-system surfaces |
| `/dashboard/resume` | P11 | Resume intelligence (new) |
| `/dashboard/opportunities`, `/dashboard/opportunities/[id]` | P12 | Job discovery (new) |
| `/dashboard/pipeline`, `/dashboard/pipeline/[id]` | P12 | Application pipeline (new) |
| `/community` | P13 | Community landing (new, indexable) |
| `/community/companies/[company]` | P13 | Company intelligence (new, indexable) |
| `/community/questions/[id]` | P13 | Reported question (new, indexable) |
| `/community/contribute` | P13 | Contribution form (new, noindex) |
| Content hierarchy routes (`/[domain]/[stack]/...`) | P05/P06 | Hierarchy + question reading |
| Mock interview routes | P10 | Session + evaluation |

### Redirected (changed URL) — P15-T400

No v1→v2 URL *shape* changes were introduced in Phases 11–15 — all new
surfaces use fresh, canonical paths under `/dashboard/*` and `/community/*`
that did not exist in v1. Therefore no new redirect rules are required for the
Phase 11–15 additions. Redirect rules for the Phase 02–06 v1→v2 URL changes
were delivered in Phase 02 and remain in effect.

### Avoiding redirect chains / loops — P15-T401..T402

- All v2 redirects point directly to the final canonical URL (single hop).
- No redirect targets another redirect.
- The middleware matcher excludes static assets and the canonical
  sitemap/robots, so redirect logic never re-enters for those paths.

### 410 Gone for intentionally removed content — P15-T403

Surfaces removed during Phases 01–04 (the v1 "everything-on-the-page" hero,
feature-card walls, newsletter capture, etc.) were *component* removals, not
URL removals — no route returned 410. If a v1 route is later identified that
served removed content, it should return `410 Gone` via a route handler;
none are currently known.

## Internal link audit — P15-T404

All new Phase 11–15 navigation is internal-link-clean:
- Dashboard sidebar/nav links to `/dashboard/resume`, `/dashboard/opportunities`, `/dashboard/pipeline`.
- Community landing links to `/community/companies/[company]` and `/community/questions/[id]`.
- Opportunity cards link to `/dashboard/opportunities/[id]`; pipeline cards link to `/dashboard/pipeline/[id]`.
- Resume shell links JD match → `/dashboard/resume` analysis view.

No broken internal links were introduced; `npx tsc --noEmit` is clean.

## Backend / database legacy — P15-T405..T406

The frontend repo contains no backend route handlers or database access. The
data layers in `lib/resume`, `lib/opportunity`, `lib/community` call API paths
(`/resume`, `/opportunities`, `/applications`, `/career-targets`, `/community`,
`/moderation`) that are owned by backend services outside this repo. Legacy
backend/database removal (Workstream AO/AP) is owned by those services and
tracked in the product backlog (P15-T742).

## Conclusion

The frontend route surface is fully v2-canonical. The only legacy-removal
work remaining is backend-owned and is converted to the product backlog.
