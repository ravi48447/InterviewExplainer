# 61 — Kotlin JVM Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. **Supersedes** the Kotlin batch in `58-long-tail-language-tracks.md`. Android-specific Kotlin content lives in playbook 68 (Mobile Hub); this playbook is the **JVM / server-side / multiplatform-core** Kotlin track.

## TL;DR

- **Input:** Working content factory + taxonomy + Kotlin idiom guide and exemplars (from playbook 53). Optional thin shells from playbook 58.
- **Action:** Build `content/kotlin-fresher/` (~300 Q), `content/kotlin-intermediate/` (~900 Q), and `content/kotlin-advanced/` (~500 Q). Pillars emphasize Kotlin's JVM strengths: null safety, coroutines + structured concurrency, sealed/data classes, DSL design, Ktor + Spring-Boot-with-Kotlin, Kotlin Multiplatform.
- **Output:** Three Kotlin level directories totalling ~1,700 Q, all idiomatic Kotlin (no `!!` outside guard cases, structured concurrency over GlobalScope, data classes for DTOs, scope functions used with intent), validated, registered in `LOCKED_DOMAINS` with flags off.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/kotlin.md` exists with sub-sections on "null safety patterns", "coroutines vs threads", and "scope functions (`apply`/`also`/`let`/`with`/`run`) intent table".
- [ ] `.cursor/content-factory/exemplars/kotlin/` has at least 3 polished exemplars (one coroutines, one DSL, one Spring-Boot-Kotlin).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

Kotlin is the default JVM language for new server work at many large shops (Square, Pinterest, Trello, Expedia) and is the official Android language — but its server-side interview signal is under-served by existing prep sites that conflate it with Android. A dedicated JVM-first track that complements (not duplicates) the Mobile Hub captures the senior-Kotlin-backend search demand and gives the Android playbook (68) a clean dependency.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/kotlin.md` | Kotlin-specific idioms; null safety, coroutines, scope functions, data classes. |
| `.cursor/content-factory/exemplars/kotlin/` | Three polished Kotlin exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.kotlin.*`) | Pillar→module mapping for Kotlin. |
| `expansion-plan/56-go-track-fullsize.md` | Reference for the wave-by-wave pattern this playbook reuses. |
| `expansion-plan/13-jbi-spring-ecosystem.md` | Java/Spring reference; Kotlin Spring topics should **link** here, not duplicate. |
| `expansion-plan/58-long-tail-language-tracks.md` (Kotlin sections only) | What this playbook replaces. |
| `expansion-plan/68-mobile-development-hub.md` (when authored) | Android-specific Kotlin lives there; this playbook cross-links rather than duplicates. |

## Q-count targets (level × pillar)

### Fresher (`kotlin-fresher`) — target 300 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | kotlin-language-core, types-and-conversions, control-flow, functions-basics, packages | 90 |
| null-safety | nullable-types-basics, safe-call-and-elvis, when-null-makes-sense | 40 |
| classes-and-data | classes-basics, data-classes-intro, enum-classes, sealed-classes-intro | 50 |
| collections-and-stdlib | list-set-map, iteration, basic-extension-functions | 40 |
| error-handling | try-catch-kotlin, basic-error-modeling | 20 |
| testing-and-tooling | junit5-with-kotlin, gradle-basics, ktlint-detekt | 30 |
| behavioral-and-interview | scenarios | 30 |

### Intermediate (`kotlin-intermediate`) — target 900 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | language-core, generics-and-variance, inline-and-reified, type-aliases, scope-functions-deep, scenario-based | 140 |
| null-safety | null-safety-deep, platform-types, late-init-vs-lazy | 50 |
| classes-and-types | data-classes, sealed-classes-and-when, value-classes, object-and-companion, delegation (by/by lazy) | 100 |
| coroutines-and-async | coroutine-basics, structured-concurrency, scopes-and-jobs, flow, stateflow-sharedflow, channels, dispatchers, exception-handling-in-coroutines | 180 |
| stdlib-and-collections | sequences-vs-collections, extension-functions, dsl-receivers, type-safe-builders | 80 |
| data-and-orm | exposed-orm, jpa-kotlin, jooq-kotlin, jackson-kotlin, kotlinx-serialization | 70 |
| web-frameworks | ktor, spring-boot-kotlin, micronaut-kotlin, javalin-kotlin | 90 |
| testing | junit5, kotest, mockk, coroutine-testing | 50 |
| build-and-deps | gradle-kotlin-dsl, kapt-vs-ksp, kotlin-multiplatform-intro, dependency-management | 30 |
| behavioral-and-interview | scenarios | 30 |

### Advanced (`kotlin-advanced`) — target 500 Q

| Pillar | Modules | Q target |
|---|---|---|
| coroutines-deep | structured-concurrency-deep, custom-coroutine-context, flow-operators-design, backpressure, cancellation-cooperative | 110 |
| dsl-and-metaprogramming | dsl-design, type-safe-builders-deep, context-receivers, ksp-and-compiler-plugins-intro | 80 |
| performance-and-jvm | inline-classes-perf, allocation-profiling, kotlinx-benchmark, jvm-interop-cost | 70 |
| multiplatform | kmp-targets, expect-and-actual, native-interop-basics, shared-business-logic-patterns | 80 |
| architecture-and-design | clean-architecture-with-kotlin, functional-error-modeling (`Either`, `Result`), arrow-kt, event-sourcing-kotlin | 80 |
| security-and-production | secrets, jwt-kotlin, owasp-considerations, observability-otel-kotlin | 40 |
| scenario-based | senior architecture + war stories | 40 |

## Execution steps

### Step 1 — Confirm or create the three Kotlin level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in kotlin-fresher kotlin-intermediate kotlin-advanced; do
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

If shells exist from playbook 58, extend in place — do not delete.

### Step 2 — Generate per-module `_config.json` files

Same pattern as playbook 56 step 2. ~58 module shells across the three levels. Pin every config's `version_pin` to `"Kotlin 2.0"` (or whatever taxonomy.yaml specifies) and `jvm_target: "17"`.

### Step 3 — Build the three queues

- `.cursor/content-factory/queues/kotlin_fresher.txt` (~75 lines).
- `.cursor/content-factory/queues/kotlin_intermediate.txt` (~210 lines).
- `.cursor/content-factory/queues/kotlin_advanced.txt` (~120 lines).

Layouts: heavy `concept-explainer` for fresher; `concept-deep-dive` + `comparison-arena` (e.g. `Flow` vs `RxJava`, coroutines vs reactor) for intermediate; `architecture-explainer` + `scenario-walkthrough` for advanced.

### Step 4 — Dry-run all three queues

```bash
for Q in kotlin_fresher kotlin_intermediate kotlin_advanced; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 5 — Run the fresher wave

```bash
WAVE=kotlin_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** ~75 topics. Wall time 5-8 hours.

### Step 6 — Run the intermediate wave

Same shape, `WAVE=kotlin_intermediate`. Wall time 13-19 hours; consider split (language+null+classes first, coroutines+web+data second).

### Step 7 — Run the advanced wave

Same shape, `WAVE=kotlin_advanced`. Wall time 8-12 hours.

### Step 8 — Validate all generated content

```bash
FAILED=0
for f in $(find content/kotlin-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — Kotlin-specific anti-pattern fingerprint

```bash
python3 - <<'PY'
import re
from pathlib import Path

flags = {
    "double_bang_in_examples": r"!!",
    "global_scope_launch": r"GlobalScope\.launch",
    "runblocking_in_production_code": r"runBlocking\s*\{",
    "java_style_getters_in_data_class": r"public\s+fun\s+get[A-Z]\w*\(\)",
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("kotlin-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text))

for k, v in flagged.items():
    print(f"{k}: {v} occurrences")
PY
```

`!!` is acceptable in a topic specifically demonstrating it; `GlobalScope.launch` and `runBlocking` outside of a `main()` example or a test are red flags. Document the threshold decisions in the run-dir log.

### Step 10 — Cross-link to playbook 13 (Spring) and reserve playbook 68 for Android

- In every Kotlin `spring-boot-kotlin` topic, add a cross-link block to the relevant Java/Spring topic in JBI (e.g. `content/java-backend-intermediate/spring-ecosystem/spring-boot-autoconfiguration/`). The link should point at the canonical JBI page; the Kotlin topic only covers the Kotlin-specific delta.
- In `kotlin-multiplatform-intro`, add a "See also" pointer to `expansion-plan/68-mobile-development-hub.md` for the Android target.

### Step 11 — Locked-domain registration

Edit ONLY `frontend/lib/content-reader.ts`, `frontend/lib/seo-slugs.ts`, `frontend/lib/launch-config.ts`.

**`frontend/lib/content-reader.ts`:**

```typescript
export const CONTENT_KTF_ROOT = 'content/kotlin-fresher';
export const CONTENT_KTI_ROOT = 'content/kotlin-intermediate';
export const CONTENT_KTA_ROOT = 'content/kotlin-advanced';

'kotlin-fresher':      { root: CONTENT_KTF_ROOT, displayName: 'Kotlin (Fresher)',      icon: 'kotlin', enabled: false },
'kotlin-intermediate': { root: CONTENT_KTI_ROOT, displayName: 'Kotlin (Intermediate)', icon: 'kotlin', enabled: false },
'kotlin-advanced':     { root: CONTENT_KTA_ROOT, displayName: 'Kotlin (Advanced)',     icon: 'kotlin', enabled: false },
```

**`frontend/lib/seo-slugs.ts`:** add canonical mappings:

- `kotlin-fresher` ↔ `kotlin-interview-questions-for-freshers`
- `kotlin-intermediate` ↔ `kotlin-interview-questions`
- `kotlin-advanced` ↔ `senior-kotlin-developer-interview-questions`

**`frontend/lib/launch-config.ts`:** keep all three flags FALSE.

### Step 12 — Supersede playbook 58

In `expansion-plan/58-long-tail-language-tracks.md`, mark the Kotlin sub-section as `SUPERSEDED → see 61-kotlin-jvm-track.md`. Keep the headings for traceability.

### Step 13 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → Kotlin cards hidden on `/domains`.
2. Local-only flip `kotlin-intermediate` to enabled; open `coroutines-and-async/structured-concurrency`; verify `runBlocking`/`GlobalScope` flags are clean, mermaid renders.
3. Revert local flip.
4. Open existing Java Spring topic — confirm no regression (cross-link from Kotlin Spring topic resolves both ways).

### Step 14 — Commit and update INDEX

```bash
git add content/kotlin-fresher/ content/kotlin-intermediate/ content/kotlin-advanced/
git commit -m "content(kotlin): finalize fresher + intermediate + advanced"

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register kotlin locked domains (flags off)"

git add expansion-plan/00-INDEX.md expansion-plan/58-long-tail-language-tracks.md
git commit -m "docs(expansion-plan): mark 61-kotlin-jvm-track DONE; mark 58 Kotlin SUPERSEDED"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 280 | count | sum questions in `content/kotlin-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 850 | count | sum questions in `content/kotlin-intermediate/**/complete-qa.json` |
| Q-count advanced ≥ 470 | count | sum questions in `content/kotlin-advanced/**/complete-qa.json` |
| Validator passes 100% | step 8 returns 0 | step 8 |
| Kotlin anti-pattern fingerprint reviewed and documented | manual | step 9 |
| Cross-links from Kotlin Spring → JBI Spring all resolve | grep + URL probe | `python3 -c` reachable-link check (or pre-flight script) |
| Locked-domain edit limited to 3 files | clean diff | `git diff --name-only HEAD~3 HEAD \| grep '^frontend/'` shows only the 3 expected paths |
| `npm run build` exits 0 | exit | step 13 |
| With flags=false, Kotlin hidden on `/domains` | manual | step 13 |
| With flag=true (local), Kotlin topic renders | manual | step 13 |
| Existing Java/Spring pages: zero regression | manual | step 13 |
| Playbook 58 Kotlin sub-section marked SUPERSEDED | grep | `grep -c 'SUPERSEDED → see 61' expansion-plan/58-long-tail-language-tracks.md` ≥ 1 |

## Failure modes & rollback

- **`!!` operator everywhere**: tighten idiom doc and prompt: "Prefer `?.`/`?:`/`requireNotNull(...)`/`checkNotNull(...)`. `!!` is allowed only in topics that explicitly demonstrate it or in guard-style assertions with a clear message."
- **`GlobalScope.launch` in non-tutorial code**: prompt must say "All coroutine launches in production-style code use a scoped `CoroutineScope` (e.g. `viewModelScope`, `applicationScope`, or an explicitly constructed one). `GlobalScope` is only acceptable in `main()` for prototypes."
- **Kotlin Spring topics duplicating Java Spring content**: regenerate with prompt scope locked to "the Kotlin-specific delta only — null safety in `@Autowired`, coroutines in `@Controller`, Kotlin DSL in `RouterFunction`. Link the canonical Java page for shared concepts."
- **Scope functions misused**: enforce the intent table from the idiom doc (`apply` configures, `also` side-effects, `let` transforms-of-nullable, `with`/`run` group-and-return).
- **Wall time blow > 50h**: split intermediate, run advanced last. Use handoff skill.

## Definition of Done

- [ ] Three Kotlin level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] Kotlin anti-pattern fingerprint reviewed and documented.
- [ ] Three locked-domain entries (`enabled: false`).
- [ ] SEO slugs added for all three levels.
- [ ] Cross-links from Kotlin Spring topics to JBI Spring counterparts present and resolved.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, Kotlin topic renders when flag locally true).
- [ ] All 12 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `61` flipped to `DONE`.
- [ ] `58-long-tail-language-tracks.md` Kotlin sub-section flagged `SUPERSEDED → see 61-kotlin-jvm-track.md`.
- [ ] ROADMAP.md has "Kotlin launch checklist" row pending.

## Estimated effort

- **Ideal:** 32 hours (5h fresher + 15h intermediate + 8h advanced + 4h infra/locked-domain).
- **Hard stop:** 65 hours.
- **Recommended split:** 5 agent sessions:
  1. Steps 1-4 (scaffold + dry runs).
  2. Step 5 (fresher wave).
  3. Step 6 (intermediate, possibly split).
  4. Step 7 (advanced wave).
  5. Steps 8-14 (validation + cross-link + locked-domain + UI smoke + commits + INDEX).

Use the handoff skill between sessions; each ends with `bash .cursor/skills/handoff/scripts/new_handoff.sh kotlin-track-session-<n>`.
