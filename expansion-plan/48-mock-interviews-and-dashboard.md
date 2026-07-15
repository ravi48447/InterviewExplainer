# 48 — Mock Interviews & User Dashboard

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** product feature work; requires real product surface (not just
> content). Highest implementation complexity of all hub playbooks.
> **Depends on:** 41 (Interview Q&A hub — supplies the filter contract),
> 43 (DSA hub — feeds coding mocks), 45 (Behavioral hub — feeds STAR mocks).

---

## §0 — Front-matter

```yaml
playbook:      48
version:       1.0
status:        ready
wave:          E
type:          product-feature
depends_on:    [41, 43, 45]
phases:        4
flags:
  - ENABLED_HUBS.mockInterviews   # flipped after Phase 3
  - ENABLED_HUBS.dashboard        # flipped after Phase 4
deliverables:
  mock_templates: 5
  dashboard_routes: 4
  db_tables: 4
  react_components: [SaveButton, MockRunner, StreakHeatmap]
requires_auth: true
requires_db: true
```

---

## §3 — Glossary

| Term | Definition |
| --- | --- |
| **Mock (interview mock)** | A timed sequence of N questions drawn from a `HubFilter`, run in the mock runner UI with per-question timers and a reveal gate. |
| **`HubFilter`** | TypeScript type from playbook 41 describing a set of questions by domain, module, difficulty, language, or pillar. Mock templates are stored `HubFilter` instances. |
| **mock template** | A pre-configured filter + duration combination giving the user a one-click starting point (e.g. `java-backend-30min`). |
| **reveal gate** | UX mechanism that prevents the user from seeing the answer before they either type a guess or the per-Q timer expires. |
| **`MockSession`** | TypeScript interface representing one mock run: filter, duration, question list, per-question attempts, status. |
| **self-rating** | 1–5 rating the user gives themselves after seeing the answer; stored in `attempts[]`; used for spaced-repetition signals. |
| **dashboard** | User's personal prep hub at `/dashboard`; shows streak, saved questions, module progress, mock history. |
| **streak** | Consecutive calendar days the user viewed or completed at least one question. Computed server-side from `user_streak.activeDates`. |
| **`useUserState()`** | React hook that reads from DB when authenticated, falls back to `localStorage` when not, and migrates localStorage data on first login. |
| **`SaveButton`** | React component (heart icon) on every question page; toggles the question in/out of the user's saved list. |
| **`StreakHeatmap`** | React component rendering a GitHub-style contribution heatmap on `/dashboard/streak`. |
| **`user_saved_questions`** | DB table: `(user_id, question_id, saved_at)`. |
| **`user_recently_viewed`** | DB table: `(user_id, question_id, viewed_at)`. Capped at 50 rows per user (FIFO). |
| **`mock_sessions`** | DB table storing `MockSession` serialized as JSON. No PII, no free-text notes. |
| **localStorage** | Browser-side key-value store; Phase 1 uses this as the persistence layer (no auth required). Phase 2 migrates to DB on login. |
| **module progress** | Per-user, per-module ratio of questions viewed vs total questions; displayed as progress bars on the dashboard. |
| **calendar heatmap** | Visual grid (52 weeks × 7 days) showing practice intensity per day; each cell's shade encodes Q count. |
| **`sessionId`** | UUID identifying a `MockSession`; embedded in `/mock/run/<sessionId>` URL so the runner can resume across page reloads. |
| **noindex** | HTML/robots meta tag telling Google not to index a page; applied to session-specific runner URLs to avoid canonicalisation confusion. |

---

## §1 — TL;DR

- **Goal:** Two product surfaces that take the user from "browsing"
  to "preparing":
  - **Mock Interviews** — timed Q sets pulled from a filter, with a
    runner UX and final summary.
  - **User Dashboard** — saved questions + recently viewed + streak +
    module progress + mock history.
- **Action:** Ship a deliberately small MVP for both surfaces in 4
  sequential phases. Each phase ships in its own PR.
- **Output:** `/mock` and `/dashboard` return 200; user state persists;
  5 pre-built mock templates run end-to-end.

## Hard prerequisites

- [ ] User auth in place (a login flow exists in the app — verify with
      `rg -n 'signIn|getServerSession' frontend/lib/`).
- [ ] At least 2 locked domains live.
- [ ] Playbook 41 DONE (the `HubFilter` contract is the mock template
      contract).
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.mockInterviews`
      and `ENABLED_HUBS.dashboard` (add if missing; default `false`).
- [ ] A persistence layer (DB or KV) exists for user state — confirm
      `frontend/lib/db.ts` or equivalent before phase 2.

## Why this matters (2 sentences)

A mock-interview surface converts **browsers → engaged users** at
~10x the rate of a static Q library (every successful subscription
platform — Pramp, Interviewing.io, Educative — uses this exact lever).
The dashboard locks engagement in: streaks + saved Qs + progress bars
create return-visit habits that compound monthly active users (MAU)
quarter over quarter, regardless of new content.

## Search phrases to own

| Search phrase                                          | Target page                                |
| ------------------------------------------------------ | ------------------------------------------ |
| `mock interview`                                       | `/mock`                                    |
| `mock interview practice`                              | `/mock`                                    |
| `timed coding interview practice`                      | `/mock/new?type=coding`                    |
| `system design mock interview`                         | `/mock/new?type=system-design`             |
| `behavioral mock interview`                            | `/mock/new?type=behavioral`                |
| `interview prep dashboard`                             | `/dashboard`                               |
| `interview prep streak`                                | `/dashboard/streak`                        |
| `practice interview questions timed`                   | `/mock`                                    |

## Current state

- No `/mock` or `/dashboard` routes today.
- User state (if any) is partial — confirm what already exists before
  adding new tables.
- No saved-question or recently-viewed UX.

## Target state (measurable)

- `/mock`, `/mock/new`, `/mock/run/<sessionId>`, `/mock/run/<sessionId>/summary`
  all return 200.
- `/dashboard`, `/dashboard/saved`, `/dashboard/mocks`, `/dashboard/streak`
  all return 200.
- 5 pre-built mock templates execute end-to-end.
- Streak increments correctly over 3 simulated days.
- Saved-question toggles persist across reload (Phase 1: localStorage;
  Phase 2: DB).

## 48.1 — Mock interviews

### Feature scope (MVP)

A "Mock" is a **timed sequence of N questions drawn from a filter**:

- 30 / 45 / 60 / 90 minute durations.
- Question source = a saved `HubFilter` (from playbook 41).
- "Reveal answer" gated behind either a guess input OR a timer (user
  cannot accidentally skim).
- Each question shows a per-question timer (target time per Q based
  on duration / N).
- Final summary: attempted / skipped / time-per-question / self-rating.

### Routes

- `/mock` — start screen with mock templates + "custom mock" CTA.
- `/mock/new` — pick filter + duration; preview Q count.
- `/mock/run/<sessionId>` — runner; one Q at a time; persists state
  every 5 s.
- `/mock/run/<sessionId>/summary` — results; CTA to retry or browse
  failed Qs.

### Data model

```typescript
export interface MockSession {
  id:           string;
  userId:       string;
  filter:       HubFilter;      // from playbook 41
  durationMin:  number;
  startedAt:    Date;
  endedAt?:     Date;
  questions:    string[];       // ordered list of Q ids
  attempts:     {
    questionId:   string;
    secondsSpent: number;
    selfRating?:  1 | 2 | 3 | 4 | 5;
    revealed:     boolean;
  }[];
  status:       'in_progress' | 'completed' | 'abandoned';
}
```

### Pre-built templates (5 at launch)

| Template slug                  | Filter                                                              | Duration |
| ------------------------------ | ------------------------------------------------------------------- | -------- |
| `java-backend-30min`           | `{ language: 'java', level: 'intermediate', difficulty: 'medium' }` | 30 min   |
| `staff-system-design-60min`    | `{ pillar: 'P06', level: 'advanced' }`                              | 60 min   |
| `python-behavioral-30min`      | `{ language: 'python', pillar: 'P12' }`                             | 30 min   |
| `coding-pattern-mixed-45min`   | from DSA hub, mixed patterns                                         | 45 min   |
| `ml-system-design-90min`       | `{ domain: 'python-ml-ai', module: 'ml-system-design-cases' }`       | 90 min   |

Q count target: duration / 6 (i.e. ~6 min per Q for technical; ~10 min
per Q for system design).

## 48.2 — User dashboard

### Feature scope (MVP)

- Saved questions (heart icon on any question page).
- "Recently viewed" list (last 50).
- Streak counter (consecutive days the user touched a question).
- Module progress bars (per locked-domain module, % Qs interacted
  with).
- Mock history (list of past sessions with quick replay).

### Routes

- `/dashboard` — overview cards: streak, saved count, mock count,
  module-progress mini bars.
- `/dashboard/saved` — full saved-Q list with filters.
- `/dashboard/mocks` — chronological mock history; tap to view summary.
- `/dashboard/streak` — calendar heatmap (GitHub-style); longest streak
  badge.

### Data model

```typescript
export interface UserState {
  userId:           string;
  saved:            { questionId: string; savedAt: Date }[];
  recentlyViewed:   { questionId: string; viewedAt: Date }[];   // capped at 50, FIFO
  streak: {
    current:        number;
    longest:        number;
    lastActiveAt:   Date;
    activeDates:    string[];   // ISO YYYY-MM-DD, capped at 365
  };
  moduleProgress:   Record<string, { viewed: number; total: number }>;
  mockSessions:     string[];   // ids → mock_sessions table
}
```

## Implementation phases (sequential — ship one at a time)

### Phase 1 — Heart + recently viewed (localStorage only)

- Add heart icon to every question page (component
  `<SaveButton qid={…} />`).
- Track recently-viewed in `localStorage` (capped at 50).
- Show "Recently viewed" tray in nav (signed-out OK).
- Ship + smoke. No flag flip yet.

### Phase 2 — Persisted user state (DB layer)

- Add tables `user_saved_questions`, `user_recently_viewed`,
  `user_streak`, `mock_sessions`.
- Add a hook `useUserState()` that reads from DB when authenticated,
  falls back to localStorage when not (and migrates on first login).
- `/dashboard` and `/dashboard/saved` go live (gated on auth).

### Phase 3 — Mock runner MVP

- Build `/mock/new` filter picker (reuses `HubFilter` UI from playbook 41).
- Build `/mock/run/<sessionId>` runner with per-Q timer + reveal gate.
- Build `/mock/run/<sessionId>/summary`.
- Ship the 5 pre-built templates.
- Flip `ENABLED_HUBS.mockInterviews`.

### Phase 4 — Streak + progress bars

- Compute streak on every "active" event (question viewed, mock run).
- Module progress bars from `user_recently_viewed` + module Q totals.
- Calendar heatmap.
- Flip `ENABLED_HUBS.dashboard` (the dashboard "graduates" from
  partial → full).

**Each phase ships in its own commit + PR; do NOT bundle.**

## Step — Flip flags (after phase 3 / 4 respectively)

```typescript
// frontend/lib/launch-config.ts
ENABLED_HUBS: {
  ...,
  mockInterviews: true,   // flipped after phase 3
  dashboard:      true,   // flipped after phase 4
};
```

## Smoke (after each phase)

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build && npm test 2>&1 | tail -20

npm run dev &
DEV_PID=$!
sleep 5

# Phase 3 smoke
for url in /mock /mock/new; do
  printf "%-30s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

# Phase 4 smoke (auth'd; use a test cookie)
for url in /dashboard /dashboard/saved /dashboard/mocks /dashboard/streak; do
  printf "%-30s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" \
    --cookie "session=$TEST_USER_SESSION" \
    "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

## Files and code to touch

| Path                                                | Change                          |
| --------------------------------------------------- | ------------------------------- |
| `frontend/lib/launch-config.ts`                     | 2 flags (flip in phase 3 / 4)   |
| `frontend/lib/db/schema.ts` (or Prisma)             | 4 new tables                    |
| `frontend/lib/user-state.ts`                        | NEW — useUserState hook         |
| `frontend/lib/mock/session.ts`                      | NEW — session create / persist  |
| `frontend/lib/mock/templates.ts`                    | NEW — 5 pre-built templates     |
| `frontend/components/SaveButton.tsx`                | NEW — heart icon                |
| `frontend/components/MockRunner.tsx`                | NEW — runner UX                 |
| `frontend/components/StreakHeatmap.tsx`             | NEW — GitHub-style heatmap      |
| `frontend/app/mock/{page,new}/page.tsx`             | NEW                             |
| `frontend/app/mock/run/[sessionId]/page.tsx`        | NEW                             |
| `frontend/app/mock/run/[sessionId]/summary/page.tsx`| NEW                             |
| `frontend/app/dashboard/{page,saved,mocks,streak}/page.tsx` | NEW                     |
| `frontend/components/Header.tsx`                    | add nav links per phase         |

## Content rules

- "Mock template" filters are **declarative**; do not hard-code Q lists.
- The reveal-gate is **non-bypassable** — the answer body is only
  rendered after the user submits a guess or the per-Q timer expires.
- Saved-Q toggles persist offline-first (localStorage); DB sync is
  best-effort.
- No PII in mock summaries — store only Q ids, durations, ratings; no
  free-text notes in Phase 1.

## SEO and URLs

- `/mock` and `/dashboard` are **noindex** for the runner pages
  (per-session URLs); only the landing pages (`/mock`, `/dashboard`)
  are indexed.
- Mock template URLs (e.g. `/mock/new?template=java-backend-30min`)
  carry canonical `/mock/new` to dedupe.

## Quality gates

| Gate                                              | Threshold     | Verify with                                                              |
| ------------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| Phase 1 ships independently                       | yes           | Heart works without DB / auth                                             |
| 5 mock templates run end-to-end                   | 5 of 5        | manual run-through                                                        |
| Heart toggles persist across page reload          | yes           | manual: heart, reload, see heart                                          |
| Recently-viewed list shows ≥ last 10              | yes           | view 10 Qs; check tray                                                    |
| Streak increments correctly over 3 simulated days | yes           | unit test on `computeStreak()`                                            |
| `/dashboard` returns 200 for logged-in user       | 200           | smoke w/ test cookie                                                      |
| `/mock/new` returns 200                           | 200           | smoke                                                                     |
| Mock summary persists across reload               | yes           | run mock; reload at summary; same state                                   |
| `npm run build` exit 0                            | 0             | build log                                                                  |
| No PII in mock_sessions table                     | yes           | schema review                                                             |

## Failure modes & rollback

- **DB migration fails on the persistence step** (phase 2): roll back
  the migration and keep Phase 1 (localStorage) only. Surface as
  blocker.
- **Streak miscount across timezone boundaries**: store dates as
  UTC `YYYY-MM-DD` and resolve in the user's TZ on read; add a unit
  test.
- **Mock runner state lost on refresh**: ensure the runner persists
  state every 5 s OR on each navigation. If lost, surface to user
  with "resume previous mock?" prompt.
- **Reveal-gate bypassable via dev-tools**: that's expected; do not
  burn cycles "fixing" — the gate is UX, not security.
- **Rollback (per hub):** flip the matching `ENABLED_HUBS` flag to
  `false`. Phase 1 (heart + recently viewed) stays on regardless —
  it's not gated by either flag.

## Definition of Done

- [ ] All 4 phases shipped sequentially (4 commits / PRs minimum).
- [ ] `ENABLED_HUBS.mockInterviews = true` after Phase 3.
- [ ] `ENABLED_HUBS.dashboard = true` after Phase 4.
- [ ] All smoke gates above green.
- [ ] All 5 mock templates run end-to-end.
- [ ] No PII stored in mock_sessions table.
- [ ] Header has 2 new nav entries.
- [ ] `00-INDEX.md` row for `48` flipped to `DONE`.

## Estimated effort

- **Ideal:** 80 hours, split as: Phase 1 ≈ 10 h, Phase 2 ≈ 25 h
  (DB + auth), Phase 3 ≈ 30 h (runner UX), Phase 4 ≈ 15 h (streak +
  heatmap).
- **Hard stop:** 120 hours.
