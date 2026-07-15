# 68 — Mobile Development Hub Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** hub feature work; content lives partly in language tracks (61 Kotlin JVM, 64 Swift) and partly in new mobile-specific modules introduced here.
> **Depends on:** 41 (interview-qa-hub rollout pattern), 61 (Kotlin JVM track, for shared language fundamentals), 64 (Swift Apple track, for shared language fundamentals).

## TL;DR

- **Goal:** A single browsable hub for **mobile app engineering** content across iOS (Swift / SwiftUI / UIKit), Android (Kotlin / Jetpack Compose), and cross-platform (React Native, Flutter). One URL for the perennial "android interview questions", "ios interview questions", "react native interview questions" searches.
- **Action:** Add `frontend/lib/hubs/mobile.ts` aggregator, build `/mobile` index + 5 category pages, scaffold five new content modules (`content/mobile-ios-app/`, `content/mobile-android-app/`, `content/mobile-react-native/`, `content/mobile-flutter/`, `content/mobile-cross-cutting/`) that focus on app-shell / lifecycle / platform / store-submission concerns (language fundamentals continue to live in 61/64).
- **Output:** `/mobile` returns 200 with grouped content by platform; ≥ 250 mobile-specific cards across 5 platforms; hub URLs in `sitemap.xml`; nav link added.

## Hard prerequisites

- [ ] Playbook 41 (interview-qa-hub rollout) DONE — establishes the hub-page pattern.
- [ ] Playbook 64 (Swift track) at least scaffolded — Swift language pillars referenced from hub.
- [ ] Playbook 61 (Kotlin JVM track) at least scaffolded — Kotlin language pillars referenced from hub.
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.mobile` (add if missing; default `false`).

## Why this matters

Mobile engineering interview demand has its own vocabulary — Activity vs Fragment, View vs ViewController, Compose recomposition, SwiftUI body re-evaluation, the Hermes JS engine vs JSC, the Flutter widget tree — that the language-only tracks (Kotlin, Swift) cannot cover without becoming bloated. A dedicated mobile hub captures the cross-platform candidate ("react native interview questions", "flutter interview questions"), the platform-native candidate ("android interview questions", "ios interview questions"), and the architect candidate ("mobile system design interview") under one entry point.

## Background

This hub aggregates content from the following trees:

| Content tree | Platform | Language |
|---|---|---|
| `content/kotlin-intermediate/` (playbook 61) | Android | Kotlin |
| `content/swift-intermediate/` (playbook 64) | iOS | Swift |
| `content/mobile-android-app/` (new, this playbook) | Android | Kotlin / Jetpack |
| `content/mobile-ios-app/` (new, this playbook) | iOS | Swift / SwiftUI / UIKit |
| `content/mobile-react-native/` (new, this playbook) | Cross-platform | JS / TS |
| `content/mobile-flutter/` (new, this playbook) | Cross-platform | Dart |
| `content/mobile-cross-cutting/` (new, this playbook) | All | Language-agnostic |

The hub does NOT duplicate language-fundamentals from Kotlin or Swift tracks. It links to them via `MOBILE_LANGUAGE_BRIDGES`.

React Native uses the New Architecture (Hermes + Fabric + JSI), shipping by default since React Native 0.74 (April 2024). Flutter uses the Impeller rendering engine, stable since Flutter 3.10 (May 2023). Jetpack Compose is the primary Android UI toolkit since Android Studio Hedgehog (2023) and officially preferred over XML Views. SwiftUI is the primary iOS UI toolkit since iOS 17 / Xcode 15 (September 2023).

## Search phrases to own

| Search phrase | Target page |
|---|---|
| `mobile developer interview questions` | `/mobile` |
| `android interview questions` | `/mobile/android` |
| `android interview questions for experienced` | `/mobile/android` |
| `jetpack compose interview questions` | `/mobile/android` (modern-android pillar) |
| `ios interview questions` | `/mobile/ios` |
| `swiftui interview questions` | `/mobile/ios` (swiftui-pillar landing) |
| `uikit interview questions` | `/mobile/ios` (uikit-pillar landing) |
| `react native interview questions` | `/mobile/react-native` |
| `flutter interview questions` | `/mobile/flutter` |
| `mobile system design interview questions` | `/mobile/system-design` |
| `mobile app architecture interview` | `/mobile/system-design` |

## Current state

- Swift language content lives (or will live) under `content/swift-*` (playbook 64).
- Kotlin language content lives (or will live) under `content/kotlin-*` (playbook 61).
- No platform-app content exists today (no Activity / ViewController / Compose / SwiftUI / RN / Flutter modules).
- `/mobile` route does NOT exist today.

## Target state (measurable)

- 6 hub pages return 200 (`/mobile`, `/mobile/android`, `/mobile/ios`, `/mobile/react-native`, `/mobile/flutter`, `/mobile/system-design`).
- Hub aggregator returns ≥ 250 mobile-specific cards (excluding language-only fundamentals which the hub LINKS to).
- Each platform card carries a deep-link badge to the language track when relevant (Android card → Kotlin language pillar; iOS card → Swift language pillar).
- All hub URLs appear in `sitemap.xml`.

## Categories (canonical — 5 frozen at launch)

| Category slug | Pulls from… |
|---|---|
| `android` | `content/mobile-android-app/*` (new); cross-link to `kotlin-intermediate` pillars |
| `ios` | `content/mobile-ios-app/*` (new); cross-link to `swift-intermediate` pillars |
| `react-native` | `content/mobile-react-native/*` (new); cross-link to `javascript-intermediate` pillars |
| `flutter` | `content/mobile-flutter/*` (new); Dart language fundamentals also live here |
| `system-design` | `content/mobile-cross-cutting/mobile-system-design/*` (new) + cross-link to `/system-design` |

**These 5 categories are frozen at launch.** Adding a 6th (e.g. `pwa` or `kmm`) requires its own playbook.

---

## Step 1 — Scaffold the five mobile content modules

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for D in mobile-android-app mobile-ios-app mobile-react-native mobile-flutter mobile-cross-cutting; do
  mkdir -p "content/$D"
  if [ ! -f "content/$D/_index.json" ]; then
    cat > "content/$D/_index.json" <<EOF
{
  "level": "$D",
  "modules": [],
  "pillar_groups": []
}
EOF
  fi
done
```

Module targets:

- `mobile-android-app/{app-architecture,activity-and-fragment,jetpack-compose,navigation-component,room,workmanager,android-system-design,play-store-submission}` — target ~70 cards
- `mobile-ios-app/{app-lifecycle,swiftui-app-architecture,uikit-app-architecture,coredata-vs-swiftdata,combine-and-async,ios-system-design,app-store-submission,push-notifications-apns}` — target ~70 cards
- `mobile-react-native/{rn-architecture,new-architecture-hermes-fabric,navigation-react-navigation,state-redux-zustand-jotai,native-modules,debugging-flipper,rn-system-design,store-submission}` — target ~50 cards
- `mobile-flutter/{flutter-architecture,widget-tree-and-elements,state-bloc-riverpod-provider,dart-language-essentials,platform-channels,flutter-system-design,store-submission}` — target ~45 cards
- `mobile-cross-cutting/{mobile-system-design,offline-first-and-sync,energy-and-perf-budgets,deeplinking-and-app-links,ci-cd-mobile-fastlane-bitrise}` — target ~30 cards

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for D in mobile-android-app mobile-ios-app mobile-react-native mobile-flutter mobile-cross-cutting; do
  test -f "content/$D/_index.json" && echo "OK $D" || echo "MISSING $D"
done
```
Expected: 5 lines of `OK`.

---

### Step 2 — Aggregator

`frontend/lib/hubs/mobile.ts`:

```typescript
import type { DomainSlug } from '../types';

export type MobileCategory = 'android' | 'ios' | 'react-native' | 'flutter' | 'system-design';

export interface MobileCard {
  id:            string;
  title:         string;
  domain:        DomainSlug;
  module:        string;
  topic:         string;
  href:          string;
  category:      MobileCategory;
  platform:      'android' | 'ios' | 'cross-platform';
  languageLinks: { label: string; href: string }[];  // e.g. Kotlin pillar link for Android
  difficulty:    'easy' | 'medium' | 'hard';
}

export const MOBILE_CATEGORY_FEEDS: Record<MobileCategory, string[]> = {
  'android':       ['mobile-android-app'],
  'ios':           ['mobile-ios-app'],
  'react-native':  ['mobile-react-native'],
  'flutter':       ['mobile-flutter'],
  'system-design': ['mobile-cross-cutting/mobile-system-design'],
};

export const MOBILE_LANGUAGE_BRIDGES: Record<MobileCategory, { label: string; href: string }[]> = {
  'android':      [{ label: 'Kotlin (Intermediate)',          href: '/interview/kotlin-intermediate' }],
  'ios':          [{ label: 'Swift (Intermediate)',            href: '/interview/swift-intermediate'  }],
  'react-native': [{ label: 'JavaScript (Intermediate)',      href: '/interview/javascript-intermediate' },
                   { label: 'TypeScript',                      href: '/interview/typescript'           }],
  'flutter':      [{ label: 'Dart language (in Flutter pillars)', href: '/mobile/flutter#dart-language-essentials' }],
  'system-design':[{ label: 'General system-design hub',      href: '/system-design' }],
};

export function listCards(category?: MobileCategory): MobileCard[] {
  // walk feeds, read each complete-qa.json, push as MobileCard
  return [];
}
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/hubs/mobile.ts && echo "OK aggregator" || echo "MISSING aggregator"
grep -c 'MobileCategory' frontend/lib/hubs/mobile.ts
```
Expected: `OK aggregator`; count ≥ 1.

---

### Step 3 — Pages

- `/mobile` — index of 5 categories; each card shows count and the language bridge link.
- `/mobile/<category>` — list of cards in that category; filterable by topic/module.
- Card click navigates to `/interview/<domain>/<module>/<topic>` (no duplication).

New files:

```
frontend/app/mobile/page.tsx
frontend/app/mobile/[category]/page.tsx
frontend/components/MobileCard.tsx
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for F in \
  frontend/app/mobile/page.tsx \
  frontend/app/mobile/[category]/page.tsx \
  frontend/components/MobileCard.tsx; do
  test -f "$F" && echo "OK $F" || echo "MISSING $F"
done
```

---

### Step 4 — Hand-tuned category intros (250 words each)

Same template as playbook 44 step 3. Each platform intro must mention the bridge language track explicitly so candidates land where they need to.

- Android intro: names Jetpack Compose (preferred), the classic Activity/Fragment lifecycle, and the Kotlin language pillar link.
- iOS intro: names SwiftUI (iOS 17+) vs UIKit with the decision rule ("Use SwiftUI when targeting iOS 17+; use UIKit when supporting < iOS 16 or needing fine-grained layout control").
- React Native intro: names the New Architecture (Hermes + Fabric + JSI, default since RN 0.74), Flipper for debugging.
- Flutter intro: names Impeller (stable since Flutter 3.10), the three state approaches (setState / BLoC / Riverpod), Dart as the sole language.
- System-design intro: names the cross-platform trade-offs at architecture level (offline-first sync, push notification delivery, energy budgets on battery-constrained devices).

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for SLUG in android ios react-native flutter system-design; do
  INTRO_FILE="content/mobile-${SLUG}/intro.md"
  if [ -f "$INTRO_FILE" ]; then
    WC=$(wc -w < "$INTRO_FILE")
    [ "$WC" -ge 200 ] && echo "OK $SLUG ($WC words)" || echo "SHORT $SLUG ($WC words)"
  else
    echo "MISSING intro for $SLUG"
  fi
done
```
Expected: 5 `OK` lines.

---

### Step 5 — Flip flag

```typescript
// frontend/lib/launch-config.ts
ENABLED_HUBS: {
  ...,
  mobile: true,
}
```

Commit: `launch: enable mobile hub`.

**Verify:**
```bash
grep -c 'mobile: *true' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/lib/launch-config.ts
```
Expected: ≥ 1.

---

### Step 6 — Smoke

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20

npm run dev &
DEV_PID=$!
sleep 5

for url in /mobile /mobile/android /mobile/ios /mobile/react-native /mobile/flutter /mobile/system-design; do
  printf "%-40s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

Expected: all `200`.

**Card count verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
find content/mobile-* -name 'complete-qa.json' | wc -l
```
Expected: count implies ≥ 250 cards when summed. Cross-check by adding `console.log(listCards().length)` temporarily in the aggregator and running `npm run build`.

---

## Files and code to touch

| Path | Change |
|---|---|
| `frontend/lib/launch-config.ts` | add `ENABLED_HUBS.mobile` flag |
| `frontend/lib/hubs/mobile.ts` | NEW — aggregator |
| `frontend/app/mobile/page.tsx` | NEW — index |
| `frontend/app/mobile/[category]/page.tsx` | NEW — category page |
| `frontend/components/MobileCard.tsx` | NEW — card with platform + bridge link |
| `frontend/components/site-header.tsx` | add Mobile nav link |
| `scripts/build_sitemap.py` | enumerate 6 mobile hub URLs |
| `content/mobile-*/` | NEW directories (5 of them) |

## Content rules

- Hub LINKS to language fundamentals (Kotlin / Swift / JS-TS / Dart) — never duplicates them.
- Each card in `android` / `ios` / `react-native` / `flutter` MUST link to the bridge language track in the bottom-of-card "See also" block.
- A topic appears in **only one** mobile category (no double-counting; e.g. "Compose recomposition" goes in `android`, not `flutter`).
- The #1 trap when building the aggregator is feeding Kotlin language-fundamentals cards (which live in `kotlin-intermediate`) into the `android` feed — those cards do not belong here. The Android feed contains only `mobile-android-app` content.
- The 5 categories are **frozen** — adding a 6th (e.g. `pwa` or `kmm`) requires its own playbook.

## SEO and URLs

- Canonical: `/mobile`, `/mobile/<category>`.
- Each category page emits `BreadcrumbList` + `CollectionPage` JSON-LD.
- Title format: `<Platform> Interview Questions — Mobile Hub | InterviewExplainer`.

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| 6 hub pages return 200 | 6 of 6 | `for url in /mobile /mobile/android /mobile/ios /mobile/react-native /mobile/flutter /mobile/system-design; do curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000$url"; done` all 200 |
| Hub aggregator returns ≥ 250 cards | ≥ 250 | `console.log(listCards().length)` temporarily in aggregator; `npm run build` |
| Every card has at least one language bridge link | 100 % | `rg -l 'languageLinks.*\[\]' frontend/components/MobileCard.tsx` — must be empty (no empty bridge arrays rendered) |
| Each category intro ≥ 200 words | 5 of 5 | `for F in content/mobile-*/intro.md; do wc -w < "$F"; done` all ≥ 200 |
| Sitemap includes 6 mobile hub URLs | 6 | `grep -c '/mobile' frontend/public/sitemap.xml` ≥ 6 |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Existing Kotlin + Swift language pages: zero regression | manual | open one Kotlin + one Swift topic page |
| Site-header has Mobile link | grep | `grep -c 'href="/mobile"' frontend/components/site-header.tsx` ≥ 1 |

## Failure modes & rollback

- **Card count < 250**: content gap — do not flip flag. Generate more cards in the thinnest module before launch.
- **Bridge link missing on cards**: aggregator missed `MOBILE_LANGUAGE_BRIDGES` lookup; fix and re-verify.
- **Kotlin / Swift tracks not yet launched**: ship `/mobile` anyway; bridge links resolve to `/interview/<slug>` which 404 until those tracks are enabled. Acceptable so long as ROADMAP.md notes the dependency.
- **The classic bug** with React Native content: confusing the Old Architecture (Bridge) with the New Architecture (JSI). All React Native content in this hub targets the New Architecture (Hermes + Fabric, default since RN 0.74). Cards describing Bridge-based native modules must be clearly marked "Old Architecture" and cross-linked to their JSI replacements.
- **`/mobile/flutter` Dart content too thin**: Flutter playbook here intentionally bundles Dart fundamentals (Dart doesn't get its own language track). If the Dart pillar has < 25 Q, generate more before launch.
- **Rollback:** `ENABLED_HUBS.mobile = false`.

## Definition of Done

- [ ] `grep -c 'mobile: *true' frontend/lib/launch-config.ts` ≥ 1
- [ ] `for url in /mobile /mobile/android /mobile/ios /mobile/react-native /mobile/flutter /mobile/system-design; do curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url"; done` — all 200
- [ ] `console.log(listCards().length)` in aggregator ≥ 250 (remove log before merge)
- [ ] `for F in content/mobile-android-app/intro.md content/mobile-ios-app/intro.md content/mobile-react-native/intro.md content/mobile-flutter/intro.md content/mobile-cross-cutting/intro.md; do wc -w < "$F"; done` — all ≥ 200
- [ ] `grep -c '/mobile' frontend/public/sitemap.xml` ≥ 6
- [ ] `grep -c 'href="/mobile"' frontend/components/site-header.tsx` ≥ 1
- [ ] `cd frontend && npm run build; echo $?` — exits 0
- [ ] `grep -c 'href="/interview/kotlin-intermediate"' frontend/components/MobileCard.tsx` ≥ 1 (Android bridge link present)
- [ ] `grep -c 'href="/interview/swift-intermediate"' frontend/components/MobileCard.tsx` ≥ 1 (iOS bridge link present)
- [ ] `grep -c 'DONE' expansion-plan/00-INDEX.md | head` — row for `68` shows DONE

## Estimated effort

- **Ideal:** 22 hours (4h scaffold + 12h content + 6h hub UI + flag).
- **Hard stop:** 45 hours.
- **Recommended split:** 3 agent sessions:
  1. Steps 1-2 (scaffold + aggregator + initial content seed for ≥ 50 cards/platform).
  2. Steps 3-4 (pages + intros + remaining content fill).
  3. Steps 5-6 (flag + smoke + commits + INDEX).