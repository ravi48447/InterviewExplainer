# 64 — Swift / Apple Platforms Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. **New track** (not previously batched in playbook 58). iOS UI-specific content lives in playbook 68 (Mobile Hub); this playbook is the **Swift language + cross-Apple-platform + Server-side Swift** track.

## TL;DR

- **Input:** Working content factory + taxonomy + Swift idiom guide and exemplars (from playbook 53). Add Swift to taxonomy if missing.
- **Action:** Build `content/swift-fresher/` (~280 Q), `content/swift-intermediate/` (~800 Q), and `content/swift-advanced/` (~450 Q). Pillars emphasize what Swift interviews actually test in 2026: value vs reference semantics, optionals, protocols + generics + opaque/existential types, `async`/`await` + structured concurrency + actors, SwiftUI vs UIKit decisions, SwiftData/Core Data, Server-side Swift (Vapor, Hummingbird) for the back-end-curious iOS dev.
- **Output:** Three Swift level directories totalling ~1,500 Q, all idiomatic Swift 5.9+ / 6.0 (value semantics default, `guard let` over `if let` for early returns, `Result` / `throws` over completion handlers, `Sendable` honored where the concurrency model requires it), validated, registered in `LOCKED_DOMAINS` with flags off.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/swift.md` exists with sub-sections on "value vs reference types", "optional handling decision table", "async/await + actors + Sendable", "SwiftUI vs UIKit decision".
- [ ] `.cursor/content-factory/exemplars/swift/` has ≥ 3 polished exemplars (one async + actors, one SwiftUI + state, one Vapor REST + Fluent ORM).
- [ ] `.cursor/content-factory/taxonomy.yaml` has a `language_pillar_modules.swift.*` section (add it if missing — coordinate with the taxonomy owner per playbook 52).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

iOS / macOS engineering interviews are a high-value, under-served segment on existing prep sites (most lump everything under generic "iOS interview questions"). A track that separates the language (Swift) from the UI surface (covered in playbook 68 Mobile Hub) lets the platform serve both pure Swift candidates and full-app iOS candidates with the right depth at the right URL.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/swift.md` | Swift idioms; value semantics, optionals, concurrency, protocols. |
| `.cursor/content-factory/exemplars/swift/` | Polished exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.swift.*`) | Pillar → module mapping. |
| `expansion-plan/56-go-track-fullsize.md` | Reference for the wave-by-wave pattern. |
| `expansion-plan/68-mobile-development-hub.md` (when authored) | iOS-app-specific content lives there; this playbook cross-links rather than duplicates. |

## Q-count targets (level × pillar)

### Fresher (`swift-fresher`) — target 280 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | swift-language-core, value-vs-reference, control-flow, functions, closures-basics, tuples | 90 |
| optionals | optionals-basics, if-let-vs-guard-let, nil-coalescing | 40 |
| structs-classes-enums | struct-vs-class, enums-with-associated-values, basic-pattern-matching | 50 |
| collections-and-stdlib | array-set-dictionary, iteration, basic-string-handling | 40 |
| error-handling | throws-and-do-catch, result-type-intro | 20 |
| testing-and-tooling | xctest-basics, swift-package-manager-basics, swiftformat-basics | 20 |
| behavioral-and-interview | scenarios | 20 |

### Intermediate (`swift-intermediate`) — target 800 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | language-core, generics, protocols-and-extensions, opaque-types-some, existential-types-any, property-wrappers, key-paths, result-builders, scenario-based | 160 |
| concurrency-and-async | async-await-deep, structured-tasks, task-groups, async-sequences, actors, sendable, isolation-and-data-races | 130 |
| memory-and-arc | arc-deep, retain-cycles, weak-vs-unowned, capture-lists-in-closures | 60 |
| swiftui-and-ui-core | swiftui-state-binding-stateobject-environmentobject, view-lifecycle, navigation, animations, combine-intro | 90 |
| uikit-bridge | uikit-vs-swiftui-decision, uiviewcontroller-deep, autolayout, mvc-vs-mvvm-vs-tca | 60 |
| data-persistence | swiftdata, core-data, codable, file-io | 60 |
| networking | urlsession, async-urlsession, alamofire-vs-stdlib, json-decoding | 50 |
| server-side-swift | vapor-routing, fluent-orm, hummingbird, jwt-vapor | 60 |
| testing | xctest-deep, snapshot-testing, async-testing, mocking-protocols | 50 |
| build-and-deps | swift-package-manager-deep, xcconfig-basics, fastlane-intro | 30 |
| behavioral-and-interview | scenarios | 30 |
| security-and-production | keychain, app-transport-security, certificate-pinning | 20 |

### Advanced (`swift-advanced`) — target 450 Q

| Pillar | Modules | Q target |
|---|---|---|
| concurrency-deep | actor-reentrancy, custom-executors, swift6-strict-concurrency-migration, gcd-bridging | 90 |
| protocol-witnesses-and-pat | protocol-witness-tables, protocols-with-associated-types-deep, type-erasure-patterns, existential-vs-opaque-decision | 80 |
| performance-and-runtime | copy-on-write-deep, allocation-profiling-instruments, swift-perf-flags, generic-specialization | 70 |
| systems-and-ffi | c-and-objc-interop, unsafe-pointers, opaque-pointers, swift-on-linux-considerations | 60 |
| architecture-and-design | composable-architecture (tca), clean-architecture-ios, dependency-injection-swift, modular-app-architecture | 80 |
| server-side-swift-deep | vapor-internals, fluent-deep, observability-otel-swift, deployment-linux | 40 |
| scenario-based | senior architecture + war stories | 30 |

## Execution steps

### Step 1 — Confirm or create the three Swift level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in swift-fresher swift-intermediate swift-advanced; do
  mkdir -p "content/$L"
  if [ ! -f "content/$L/_index.json" ]; then
    cat > "content/$L/_index.json" <<EOF
{
  "level": "$L",
  "modules": [],
  "pillar_groups": []
}
EOF
  fi
done
```

### Step 2 — Generate per-module `_config.json` files

Same pattern as playbook 56 step 2. ~58 module shells across three levels. Pin every config's `version_pin` to `"Swift 6.0"` and `platform_targets: ["iOS 17", "macOS 14", "Linux"]`. For server-side modules, mark `platform_targets: ["Linux", "macOS"]`.

### Step 3 — Build the three queues

- `.cursor/content-factory/queues/swift_fresher.txt` (~70 lines).
- `.cursor/content-factory/queues/swift_intermediate.txt` (~200 lines).
- `.cursor/content-factory/queues/swift_advanced.txt` (~110 lines).

Layouts: `concept-explainer` heavy for fresher; `concept-deep-dive` + `comparison-arena` (SwiftUI vs UIKit, `some` vs `any`, `actor` vs `Sendable`-struct) for intermediate; `architecture-explainer` + `scenario-walkthrough` for advanced.

### Step 4 — Dry-run all three queues

```bash
for Q in swift_fresher swift_intermediate swift_advanced; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 5 — Run the fresher wave

```bash
WAVE=swift_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** ~70 topics. Wall time 4-8 hours.

### Step 6 — Run the intermediate wave

`WAVE=swift_intermediate`. Wall time 12-18 hours; split if needed (language+concurrency+memory first, swiftui+uikit+data+net+server second).

### Step 7 — Run the advanced wave

`WAVE=swift_advanced`. Wall time 8-12 hours.

### Step 8 — Validate all generated content

```bash
FAILED=0
for f in $(find content/swift-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — Swift anti-pattern fingerprint

```bash
python3 - <<'PY'
import re
from pathlib import Path

flags = {
    "force_unwrap_in_examples": r"![^=\w!]",                  # heuristic; review by hand
    "implicitly_unwrapped_optional_in_signatures": r":\s*\w+!\s*[,)]",
    "completion_handler_in_modern_api_code": r"completion:\s*@escaping\s*\(",
    "missing_sendable_on_actor_passing_type": r"@unchecked\s+Sendable",
    "main_thread_assertion_anywhere": r"DispatchQueue\.main\.sync",
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("swift-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text))

for k, v in flagged.items():
    print(f"{k}: {v} occurrences")
PY
```

Force-unwrap (`!`) is allowed only in clearly-justified contexts (IBOutlets historically, programmer-error assertions). `completion: @escaping (...)` in modern Swift 5.5+ examples should be rare — modern APIs use `async`/`await`; `@unchecked Sendable` requires a justifying comment. `DispatchQueue.main.sync` is a deadlock invitation — must be near zero.

### Step 10 — Cross-link to playbook 68 (Mobile Hub)

In every SwiftUI / UIKit / SwiftData / Core Data topic, add a "See also: iOS App Architecture" cross-link to the relevant section in playbook 68's content tree. Do **not** duplicate UI-specific app-shell content here; cover only the language + framework primitives.

### Step 11 — Locked-domain registration

```typescript
export const CONTENT_SWF_ROOT = 'content/swift-fresher';
export const CONTENT_SWI_ROOT = 'content/swift-intermediate';
export const CONTENT_SWA_ROOT = 'content/swift-advanced';

'swift-fresher':      { root: CONTENT_SWF_ROOT, displayName: 'Swift (Fresher)',      icon: 'swift', enabled: false },
'swift-intermediate': { root: CONTENT_SWI_ROOT, displayName: 'Swift (Intermediate)', icon: 'swift', enabled: false },
'swift-advanced':     { root: CONTENT_SWA_ROOT, displayName: 'Swift (Advanced)',     icon: 'swift', enabled: false },
```

SEO slugs: `swift-interview-questions-for-freshers`, `swift-ios-interview-questions`, `senior-swift-developer-interview-questions`.

All three flags FALSE.

### Step 12 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → Swift cards hidden on `/domains`.
2. Local-only flip `swift-intermediate` to enabled; open `concurrency-and-async/actors`; verify `Sendable` discussion present, no `DispatchQueue.main.sync`, mermaid renders.
3. Revert local flip.
4. Open existing JBI topic — confirm no regression.

### Step 13 — Commit and update INDEX

```bash
git add content/swift-fresher/ content/swift-intermediate/ content/swift-advanced/
git commit -m "content(swift): finalize fresher + intermediate + advanced"

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register swift locked domains (flags off)"

git add .cursor/content-factory/taxonomy.yaml
git commit -m "chore(taxonomy): add swift language_pillar_modules" --allow-empty

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 64-swift-apple-track DONE"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 260 | count | sum questions in `content/swift-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 750 | count | sum questions in `content/swift-intermediate/**/complete-qa.json` |
| Q-count advanced ≥ 420 | count | sum questions in `content/swift-advanced/**/complete-qa.json` |
| Validator passes 100% | step 8 returns 0 | step 8 |
| `DispatchQueue.main.sync` in non-counterexample code = 0 | step 9 | step 9 |
| `@unchecked Sendable` with no justifying comment = 0 | step 9 + manual | step 9 |
| Swift anti-pattern fingerprint reviewed and documented | manual | step 9 |
| Cross-links from SwiftUI/UIKit topics → playbook 68 present (where 68 exists) | grep | scripted link probe |
| Locked-domain edit limited to 3 files | clean diff | step 11 diff check |
| `npm run build` exits 0 | exit | step 12 |
| With flags=false, Swift hidden on `/domains` | manual | step 12 |
| With flag=true (local), Swift topic renders | manual | step 12 |
| Existing pages: zero regression | manual | step 12 |
| Taxonomy has `language_pillar_modules.swift.*` populated | grep | `grep -c 'swift:' .cursor/content-factory/taxonomy.yaml` ≥ 1 |

## Failure modes & rollback

- **Force-unwrap (`!`) everywhere**: tighten idiom doc and prompt: "Prefer `guard let`, `if let`, `??`. `!` is only for IBOutlets / programmer-error invariants / freshly-constructed `Some(_)` values, with a comment when not obvious."
- **Completion-handler APIs in modern Swift examples**: prompt must say "All asynchronous APIs in Swift 5.5+ examples use `async`/`await`. Completion-handler examples are only allowed in topics that explicitly bridge to legacy or callback-style APIs."
- **Generic Sendable warnings ignored**: examples must show how to satisfy Sendable correctly (value types, `final class` with immutable state, or `@unchecked Sendable` with a comment).
- **SwiftUI examples leaking imperative state**: enforce `@State` / `@Binding` / `@StateObject` / `@EnvironmentObject` intent table. Side-effects must be in `.task`/`.onAppear` modifiers.
- **Server-side Swift sections too thin**: if the server-side pillar has < 80 Q in intermediate, regenerate with explicit Vapor + Fluent emphasis.
- **Wall time blow > 50h**: split intermediate; advanced last. Use handoff skill.

## Definition of Done

- [ ] Three Swift level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] Swift anti-pattern fingerprint reviewed; `DispatchQueue.main.sync` at zero in non-counterexample code.
- [ ] Three locked-domain entries (`enabled: false`).
- [ ] SEO slugs added.
- [ ] Taxonomy `language_pillar_modules.swift.*` populated and committed.
- [ ] Cross-links from SwiftUI / UIKit topics to playbook 68 present (deferrable until 68 is authored — track as a follow-up issue if 68 not yet done).
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, Swift topic renders when flag locally true).
- [ ] All 14 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `64` flipped to `DONE`.
- [ ] ROADMAP.md has "Swift launch checklist" row pending.

## Estimated effort

- **Ideal:** 30 hours (4h fresher + 14h intermediate + 8h advanced + 4h infra/taxonomy/locked-domain).
- **Hard stop:** 60 hours.
- **Recommended split:** 5 agent sessions:
  1. Steps 1-4 (taxonomy + scaffold + dry runs).
  2. Step 5 (fresher).
  3. Step 6 (intermediate, possibly split).
  4. Step 7 (advanced).
  5. Steps 8-13 (validation + locked-domain + UI smoke + commits + INDEX).

Use the handoff skill between sessions.
