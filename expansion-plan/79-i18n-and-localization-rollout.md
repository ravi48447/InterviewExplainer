# 79 — Internationalization (i18n) and Localization Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** infrastructure + content + SEO. Adds a UI-language layer (translation) AND a content-language layer (locale-specific question content), with a strict separation between the two so we don't paint ourselves into a corner.

## TL;DR

- **Goal:** Add a UI translation layer (English UI strings → ES, PT-BR, DE, FR, JA, KO, ZH-CN) AND scaffold the optional content-language layer (per-locale `complete-qa.<locale>.json` overlay files) without translating content yet. This playbook ships the **infra**; per-locale content packs are follow-up playbooks.
- **Action:** Pick i18n library (`next-intl` for the App-Router-native flow), add `frontend/lib/i18n/` with locale catalogues for the 7 launch locales, refactor existing strings out of UI components into the catalogue (machine-aided where possible, human review required for hero copy), wire the locale-routing strategy (sub-path: `/es/...`, `/pt-br/...`, etc.) with `en` as the default un-prefixed locale, add `hreflang` link tags + locale-aware sitemap.
- **Output:** Every page reachable at `/<locale>/...` for 7 locales (UI translated; content still in English with a "translation in progress" banner on non-English locales); `hreflang` alternates wired site-wide; sitemap split into per-locale files; English remains 100% backward-compatible.

## Hard prerequisites

- [ ] Playbook 50 (operations + sitemap) DONE — sitemap generator exists.
- [ ] Playbook 41 (interview-qa hub) DONE — the canonical URL pattern is stable.
- [ ] Playbook 76 (analytics) DONE — `page_view` event already exists; need to add `locale` prop.
- [ ] At least 6 hubs live so the translation work isn't wasted.
- [ ] Translation budget approved (human review of hero copy + nav strings; machine-translation acceptable for body strings with a `__needs_review: true` flag).

## Why this matters

International developer search volume for interview prep is 2-3× the US/UK volume (Brazil, India, Indonesia, Mexico, Vietnam, Germany combined), but most prep sites ship English-only and lose that traffic to local competitors. A clean i18n surface — UI strings translated, content remains English for now with localised landing copy — captures the search-intent and gives a runway to translate content per-locale on evidence rather than guesswork.

## Background

This playbook uses `next-intl` 3.x — the App Router-native i18n library for Next.js 14+. `next-intl` provides:
- `useTranslations()` hook for client components.
- `getTranslations()` async function for server components.
- Middleware-based locale routing (sub-path strategy: `/es/...`, `/pt-BR/...`; default `en` un-prefixed).
- ICU message format for plurals and substitutions.

The #1 trap with i18n in Next.js App Router is accidentally loading all locale catalogues into the client bundle. `next-intl` code-splits catalogues per locale — verify the bundle size doesn't grow proportionally with catalogue count.

The UI translation layer is separate from the content translation layer:
- **UI strings**: header nav, footer, hub index page labels, CTA copy — these go in `messages/<locale>.json`.
- **Content strings**: question titles, answer bodies, code explanations — these stay in English `complete-qa.json` files; per-locale overlays are a future concern.

Files to read before executing:

| Path | Why |
|---|---|
| `frontend/app/layout.tsx` | Root layout — locale provider mounts here. |
| `frontend/next.config.mjs` | Locale routing must be wired here (or in middleware). |
| `frontend/components/site-header.tsx`, `frontend/components/site-footer.tsx` | Where the language switcher lives + most translatable strings concentrate. |
| `scripts/build_sitemap.py` (from playbook 50) | Must learn to emit per-locale sitemap files. |
| `expansion-plan/04-master-url-and-seo-strategy.md` | URL strategy — locale prefix decisions must not break canonical SEO. |

---

## Step 1 — Decide launch locales (7 at v1 plus default English)

| Locale | Reason |
|---|---|
| `en` (default, no URL prefix) | Existing default. |
| `es` | LatAm + Spain — 500M+ speakers; high dev-prep search. |
| `pt-BR` | Brazil — single largest non-English search market for dev prep. |
| `de` | DACH — high enterprise / Java / cloud share. |
| `fr` | France + francophone Africa. |
| `ja` | Japan — paid-tier-friendly; high senior salary band. |
| `ko` | Korea — high coding-test market. |
| `zh-CN` | Mainland China — caveated: not reachable from inside China via standard DNS; ship for diaspora + cross-border companies. |

This list is **frozen** for v1; adding an 8th locale (Hindi, Indonesian, Vietnamese, Turkish, Arabic) requires its own playbook.

**Verify:**
```bash
grep -c 'LOCALES' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/lib/i18n/config.ts
```
Expected: ≥ 1 (after Step 2 completes).

---

## Step 2 — Install + wire next-intl

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm install next-intl
```

Add `frontend/lib/i18n/config.ts`:

```typescript
export const LOCALES = ['en', 'es', 'pt-BR', 'de', 'fr', 'ja', 'ko', 'zh-CN'] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'en';
```

Add `middleware.ts` at repo `frontend/` root (next-intl middleware) configured to use sub-path routing with `en` un-prefixed.

Move every existing route under `app/[locale]/` (or use next-intl's transparent variant that preserves un-prefixed `en`). Pick the variant that minimises diff to existing route files.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
test -f lib/i18n/config.ts && echo "OK config" || echo "MISSING config"
test -f middleware.ts && echo "OK middleware" || echo "MISSING middleware"
grep -c 'next-intl' package.json
```
Expected: `OK config`; `OK middleware`; `next-intl` in package.json ≥ 1.

---

## Step 3 — Translation catalogues

`frontend/lib/i18n/messages/en.json`:

```json
{
  "header": {
    "search":   "Search",
    "signIn":   "Sign in",
    "signUp":   "Sign up",
    "pricing":  "Pricing"
  },
  "footer": {
    "tagline":  "Interview prep that explains itself.",
    "privacy":  "Privacy",
    "terms":    "Terms"
  },
  "hub": {
    "cardCount": "{count} questions",
    "browseAll": "Browse all"
  }
}
```

One `messages/<locale>.json` per launch locale. Strict rule: every key in `en.json` MUST exist in every other locale file (CI lint enforces). No string concatenation; use ICU placeholders for plurals and substitutions.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
for LOCALE in en es pt-BR de fr ja ko zh-CN; do
  test -f "lib/i18n/messages/${LOCALE}.json" && echo "OK $LOCALE" || echo "MISSING $LOCALE"
done
```
Expected: 8 `OK` lines.

---

## Step 4 — Refactor UI strings out of components

Mechanical refactor: every literal string in `frontend/components/site-header.tsx`, `frontend/components/site-footer.tsx`, and the hub category page templates → catalogue lookup `t('header.signIn')`.

**Out of scope for v1**: translating topic/question content body. Body content stays in English with a banner on non-`en` locales: *"This question is currently English-only. UI is translated; content translation coming soon."*

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
# No raw English literals of 2+ words left in site-header or site-footer
rg '>[A-Z][a-z]+ [A-Z][a-z]' components/site-header.tsx components/site-footer.tsx | wc -l
```
Expected: 0 (all multi-word English literals replaced with `t(...)` calls).

---

## Step 5 — Locale-aware sitemap + hreflang

Extend `scripts/build_sitemap.py` to write `sitemap.xml` as an index pointing at per-locale `sitemap-<locale>.xml` files. Each per-locale sitemap includes only the URLs for that locale prefix.

In every page's `<head>`, emit `hreflang` link tags for all 8 locales + an `x-default` pointing at the unprefixed `en` URL.

```typescript
// in app/layout.tsx (or a shared SEO component)
export function HreflangTags({ path }: { path: string }) {
  return (
    <>
      {LOCALES.map(loc => (
        <link
          key={loc}
          rel="alternate"
          hrefLang={loc}
          href={`https://interviewexplainer.com${loc === 'en' ? '' : '/' + loc}${path}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`https://interviewexplainer.com${path}`} />
    </>
  );
}
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
# Per-locale sitemap files exist after build
ls frontend/public/sitemap-*.xml 2>/dev/null | wc -l
# Sitemap index references per-locale files
grep -c '<sitemap>' frontend/public/sitemap.xml 2>/dev/null
```
Expected: ≥ 8 sitemap files; `<sitemap>` count ≥ 8.

---

## Step 6 — Language switcher

Add a language picker in the footer (not header — saves header real estate) that:

- Lists the 8 locales with native names (`English`, `Español`, `Português (Brasil)`, `Deutsch`, `Français`, `日本語`, `한국어`, `简体中文`).
- Persists user choice to `localStorage.ie_locale`.
- On first visit, suggests a locale based on `Accept-Language` header but never auto-redirects (a redirect would break sitemap signals + frustrate users on shared devices).

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
grep -c 'ie_locale' components/site-footer.tsx
grep -c 'Español\|Português\|Deutsch' components/site-footer.tsx
```
Expected: each ≥ 1.

---

## Step 7 — Analytics schema extension

Add a `locale` prop to `page_view` and `topic_view` in the analytics event schema (playbook 76). Update the wrapper to read locale from the router and inject it on every event.

```typescript
// in events.ts — schema v3
| { name: 'page_view'; props: { path: string; referrer?: string; hub?: HubSlug; locale: Locale } }
| { name: 'topic_view'; props: { domain: string; module: string; topic: string; isCanonical: boolean; locale: Locale } }
```

This is a schema bump — bump the version comment.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
grep -c 'locale: Locale' lib/analytics/events.ts
grep -c 'schema v3' lib/analytics/events.ts
```
Expected: each ≥ 1.

---

## Step 8 — Translation workflow doc

`docs/i18n-workflow.md` describes:

- How to add a new key (add to `en.json`, then `npm run i18n:fill` machine-translates into the other 7 files with a `__needs_review: true` flag, then a human reviewer flips the flag).
- How translation reviewers work in PRs (per-locale CODEOWNERS, one approver per locale).
- The hero-copy and pricing-copy exception: machine translation is NEVER acceptable; human-first.
- The legal-copy exception: privacy / ToS translations must come from a legal-translation source; never machine.

Add `scripts/i18n_fill.py` that fills missing keys using a translation provider (OpenAI / DeepL), with explicit `__needs_review: true` markers.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f docs/i18n-workflow.md && echo "OK workflow doc" || echo "MISSING workflow doc"
test -f scripts/i18n_fill.py && echo "OK fill script" || echo "MISSING fill script"
python3 scripts/i18n_fill.py --dry-run 2>&1 | head -5
```

---

## Step 9 — Smoke + commits

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20

npm run dev &
DEV_PID=$!
sleep 5

# Hit one URL per locale
for loc in '' es pt-BR de fr ja ko zh-CN; do
  PREFIX=$([[ -z "$loc" ]] && echo "" || echo "/$loc")
  URL="http://localhost:3000${PREFIX}/databases"
  printf "%-45s -> " "$URL"
  curl -s -o /dev/null -w "%{http_code}\n" "$URL"
done

kill ${DEV_PID}
```

Expected: all `200`.

Commits:

```bash
git add frontend/lib/i18n/ frontend/middleware.ts frontend/next.config.mjs
git commit -m "feat(i18n): next-intl setup + 8 locale routing"

git add frontend/lib/i18n/messages/
git commit -m "feat(i18n): seed translation catalogues for 7 launch locales"

git add frontend/components/site-header.tsx frontend/components/site-footer.tsx
git commit -m "refactor(i18n): replace literal strings with catalogue lookups (header/footer)"

git add 'frontend/app/**/page.tsx'
git commit -m "refactor(i18n): replace literal strings in hub + topic page templates"

git add scripts/build_sitemap.py
git commit -m "feat(seo): emit per-locale sitemaps + hreflang link tags"

git add frontend/lib/analytics/events.ts
git commit -m "feat(analytics): add locale prop to page_view + topic_view (schema v3)"

git add docs/i18n-workflow.md scripts/i18n_fill.py
git commit -m "docs(i18n): workflow + machine-fill script"

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 79-i18n-and-localization-rollout DONE"
```

---

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| All 8 locales return 200 on /databases | 8 of 8 | `for loc in '' es pt-BR de fr ja ko zh-CN; do PREFIX=$([[ -z "$loc" ]] && echo "" || echo "/$loc"); curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${PREFIX}/databases"; done` |
| English (un-prefixed) URLs unchanged | 100 % | `diff` old sitemap vs new sitemap-en.xml (modulo per-locale split) |
| Every key in `en.json` exists in all other locale files | 100 % | `node scripts/check_i18n_keys.js` exits 0 |
| Component literal strings refactored | spot-checked | `rg '>[A-Z][a-z]+ [A-Z]' frontend/components/site-header.tsx` empty |
| `hreflang` tags present on every page | 100 % | `curl http://localhost:3000/databases \| grep -c 'hreflang'` ≥ 9 (8 locales + x-default) |
| Per-locale sitemap files generated | 8 | `ls frontend/public/sitemap-*.xml \| wc -l` ≥ 8 |
| Sitemap index references all per-locale files | 8 | `grep -c '<sitemap>' frontend/public/sitemap.xml` ≥ 8 |
| Analytics `page_view` carries `locale` prop | 100 % | `grep -c 'locale: Locale' frontend/lib/analytics/events.ts` ≥ 1 |
| Non-`en` pages show "translation in progress" banner | 100 % | manual on one topic page at `/es/interview/...` |
| Language switcher persists choice | manual | click → navigate → `localStorage.ie_locale` persists |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| First-visit auto-suggest does NOT auto-redirect | manual | set `Accept-Language: ja`; visit `/`; observe no 30x |

## Failure modes & rollback

- **Hero / pricing copy auto-translated to nonsense**: hard rule in workflow doc — those strings MUST be human-reviewed. CI lint should fail if a key tagged `__hero` or `__pricing` has `__needs_review: true`.
- **Per-locale URL collisions** (e.g. `/de/databases` collides with a German keyword): every locale's hero copy reviewer must check the URL slug. If a slug is genuinely embarrassing in a locale, use a translated slug and emit a redirect from the English-slug variant.
- **Catalogue files diverge** (someone adds a key in `en.json` but not in the others): pre-commit hook + CI lint must enforce parity.
- **next-intl performance regression**: locale catalogues must be code-split per locale. Verify the JS bundle for `/es/databases` doesn't include `zh-CN.json`.
- **RTL languages not supported**: deliberately not in v1. Add a follow-up playbook before shipping `ar` or `he`.
- **Rollback:** delete `middleware.ts`'s locale routing → all non-`en` URLs return 404 (or 308 to `en`); pages remain English-only. Catalogues stay in repo, dormant. Cost of rollback: ~1 file change.

## Definition of Done

- [ ] `for LOCALE in en es pt-BR de fr ja ko zh-CN; do test -f "frontend/lib/i18n/messages/${LOCALE}.json" && echo OK || echo MISSING; done` — all OK
- [ ] `node scripts/check_i18n_keys.js; echo $?` — exits 0
- [ ] All 8 locales return 200 on one hub page (smoke loop)
- [ ] `curl http://localhost:3000/databases | grep -c 'hreflang'` ≥ 9
- [ ] `ls frontend/public/sitemap-*.xml | wc -l` ≥ 8
- [ ] `grep -c '<sitemap>' frontend/public/sitemap.xml` ≥ 8
- [ ] `grep -c 'locale: Locale' frontend/lib/analytics/events.ts` ≥ 1
- [ ] `grep -c 'ie_locale' frontend/components/site-footer.tsx` ≥ 1
- [ ] `test -f docs/i18n-workflow.md && echo OK` — OK
- [ ] `cd frontend && npm run build; echo $?` — exits 0

## Estimated effort

- **Ideal:** 28 hours (3h locale decision + 4h next-intl setup + 6h refactor strings + 4h sitemap + hreflang + 4h analytics schema + 3h language switcher + 2h workflow doc + 2h smoke).
- **Hard stop:** 56 hours.
- **Recommended split:** 3 agent sessions:
  1. Steps 1-3 (decide + install + catalogues seeded).
  2. Steps 4-6 (refactor strings + sitemap + switcher).
  3. Steps 7-9 (analytics + workflow + smoke + commits + INDEX).