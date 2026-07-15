# 58 — Long-Tail Language Tracks (C#, PHP, Rust, Kotlin)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. Four languages in one playbook because each is approached identically.

## TL;DR

- **Input:** Working content factory + taxonomy + idiom guides and exemplars (from playbook 53) for `csharp`, `php`, `rust`, `kotlin`.
- **Action:** For each of the four languages, build a Fresher level (~250-350 Q) and an Intermediate level (~600-900 Q). Use the same per-language wave pattern as playbooks 54-57. Register all 8 roots in `LOCKED_DOMAINS` with flags off.
- **Output:** 8 new level directories (~3000-4500 Q total across the four languages), all idiomatic, all validated, all registered.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] Idiom guides exist: `idioms/csharp.md`, `idioms/php.md`, `idioms/rust.md`, `idioms/kotlin.md`.
- [ ] Exemplars exist: `exemplars/csharp/`, `exemplars/php/`, `exemplars/rust/`, `exemplars/kotlin/` (≥ 2 files each).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

C# (.NET ecosystem), PHP (Laravel/WP), Rust (systems/cloud), and Kotlin (Android + JVM web) each cover a distinct candidate segment that the Java/JS/TS/Go/Ruby tracks cannot reach. Skipping them means leaving 25-35% of language SEO on the table; including them at this depth keeps the site comprehensive without exploding maintenance cost.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/{csharp,php,rust,kotlin}.md` | Per-language idioms. |
| `.cursor/content-factory/exemplars/{csharp,php,rust,kotlin}/` | Polished exemplars. |
| `.cursor/content-factory/taxonomy.yaml` | Pillar→module mappings for each. |
| `expansion-plan/07-locked-domain-pattern.md` | Registration pattern. |
| `expansion-plan/54-javascript-tracks-fullsize.md` | Reference for the wave-by-wave pattern this playbook reuses. |

## Q-count targets

### C# (`csharp-fresher` ~280 Q, `csharp-intermediate` ~800 Q)

| Level | Pillars (key modules) | Q target |
|---|---|---|
| fresher | csharp-fundamentals, oop-and-encapsulation, generics-basics, exceptions, file-io, xunit-basics, nuget-basics | 280 |
| intermediate | csharp-fundamentals, generics, linq, async-await-and-task, records-and-pattern-matching, nullable-reference-types, collections, ef-core, aspnet-core-mvc, minimal-apis, blazor-server, signalr, grpc-aspnet, xunit, nunit, moq, dotnet-cli, docker-dotnet, observability-otel, system-design-aspnet, security-aspnet | 800 |

### PHP (`php-fresher` ~250 Q, `php-intermediate` ~700 Q)

| Level | Pillars | Q target |
|---|---|---|
| fresher | php-fundamentals, oop-namespaces-basics, traits-intro, type-system-modern (8.x), error-handling, composer-basics, phpunit-basics | 250 |
| intermediate | php-fundamentals, traits-and-late-static-binding, psr-and-modern-type-system, error-handling, doctrine-orm, eloquent, laravel-core, symfony, slim, lumen, rest-with-laravel, websockets-laravel, queues-laravel-horizon, phpunit-deep, pest, docker-php, observability, scaling-laravel, security-php | 700 |

### Rust (`rust-fresher` ~300 Q, `rust-intermediate` ~700 Q)

Rust has no "advanced" level here — bulk depth is in intermediate.

| Level | Pillars | Q target |
|---|---|---|
| fresher | rust-fundamentals, ownership-and-borrowing-basics, lifetimes-basics, traits-and-generics-basics, error-handling-rust-basics (Result/Option), io-basics, cargo-basics, basic-tests | 300 |
| intermediate | rust-fundamentals, ownership-and-borrowing, lifetimes, traits-and-generics, error-handling-with-result, async-rust (tokio), futures, channels-mpsc, smart-pointers, unsafe-rust-basics, sqlx, diesel, actix-web, axum, rocket, grpc-tonic, tracing-otel, criterion-bench, cargo-workspaces, no-std-considerations, security-rust | 700 |

### Kotlin (`kotlin-fresher` ~280 Q, `kotlin-intermediate` ~700 Q)

| Level | Pillars | Q target |
|---|---|---|
| fresher | kotlin-fundamentals, null-safety, coroutines-intro, data-classes, sealed-classes, extension-functions, exceptions, file-io-kotlin, junit5-with-kotlin, gradle-basics | 280 |
| intermediate | kotlin-fundamentals, null-safety, coroutines-and-flow, structured-concurrency, sealed-classes-and-when, inline-functions, type-aliases, dsl-design, exposed-orm, jpa-with-kotlin, ktor, spring-boot-kotlin, jackson-kotlin, junit5-with-kotlin, mockk, gradle-deep, kotlin-multiplatform-intro, observability, security-kotlin | 700 |

## Execution steps (per language; repeat for each of csharp, php, rust, kotlin)

The pattern is identical to playbooks 54-57. Below the steps reference variables `<L>` (language slug) and `<F>` / `<I>` for fresher and intermediate level slugs (e.g. `csharp-fresher`, `csharp-intermediate`).

### Step 1 — Confirm or create the level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
LANG=csharp   # repeat for php, rust, kotlin
for L in ${LANG}-fresher ${LANG}-intermediate; do
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

Same pattern as previous playbooks. Pin `version_pin` per language: ".NET 8 / C# 12", "PHP 8.3 / Laravel 11", "Rust 1.75", "Kotlin 1.9 / Spring Boot Kotlin".

### Step 3 — Build the per-language queues

For each language, write two queue files:

- `.cursor/content-factory/queues/<L>_fresher.txt`
- `.cursor/content-factory/queues/<L>_intermediate.txt`

Sizes per language (fresher / intermediate):

- C#: ~70 / ~180 lines.
- PHP: ~60 / ~160 lines.
- Rust: ~75 / ~165 lines.
- Kotlin: ~65 / ~165 lines.

Layouts: `concept-explainer` / `concept-deep-dive` / `comparison-arena` / `scenario-walkthrough` as appropriate per topic.

### Step 4 — Dry-run all queues for the language

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
LANG=csharp
for Q in ${LANG}_fresher ${LANG}_intermediate; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 5 — Run fresher wave

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
LANG=csharp
WAVE=${LANG}_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

Wall time: 4-7 hours per language fresher.

### Step 6 — Run intermediate wave

Same shape, `WAVE=${LANG}_intermediate`. Wall time: 10-18 hours per language intermediate; split if needed.

### Step 7 — Validate

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
LANG=csharp
FAILED=0
for f in $(find content/${LANG}-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 8 — Per-language anti-pattern fingerprint

Each language has its own slop-vector. Run a per-language check:

#### C#

- `goto` (very rare in modern C#). 
- Empty XML doc comments `/// <summary></summary>` — ok if intentional, but not pervasive.
- Manual `IDisposable` boilerplate where `using` declarations would do.

#### PHP

- `<?php` missing in standalone code blocks.
- `mysql_*` deprecated functions — must use PDO or mysqli.
- `var $foo` (PHP 4 syntax) — must be `public $foo` / `private $foo` / typed properties (PHP 8.x).

#### Rust

- `unwrap()` overuse outside teaching contexts. (Some `unwrap()` is fine in tests/examples, but not as the dominant style.)
- `clone()` overuse where references would do.
- Missing lifetime annotations where required.

#### Kotlin

- `!!` (force-unwrap) overuse. Should appear only when the doc explicitly addresses it.
- Java-style getters/setters (`fun getName()` instead of property).
- Missing `data class` where a value object is implied.

Run the relevant python regex script per language; document threshold decisions in the wave's run dir.

### Step 9 — Locked-domain registration (per language)

Edit ONLY `frontend/lib/content-reader.ts`, `frontend/lib/seo-slugs.ts`, `frontend/lib/launch-config.ts`. Per language, two LOCKED_DOMAINS entries, two `CONTENT_*_ROOT` constants, two SEO slug mappings, two flag entries (FALSE).

Concrete entries:

```typescript
// content-reader.ts
export const CONTENT_CSF_ROOT = 'content/csharp-fresher';
export const CONTENT_CSI_ROOT = 'content/csharp-intermediate';
export const CONTENT_PHPF_ROOT = 'content/php-fresher';
export const CONTENT_PHPI_ROOT = 'content/php-intermediate';
export const CONTENT_RUSTF_ROOT = 'content/rust-fresher';
export const CONTENT_RUSTI_ROOT = 'content/rust-intermediate';
export const CONTENT_KOTF_ROOT = 'content/kotlin-fresher';
export const CONTENT_KOTI_ROOT = 'content/kotlin-intermediate';

// LOCKED_DOMAINS additions (do not modify other entries):
'csharp-fresher': { root: CONTENT_CSF_ROOT, displayName: 'C# (Fresher)', icon: 'csharp', enabled: false },
'csharp-intermediate': { root: CONTENT_CSI_ROOT, displayName: 'C# (Intermediate)', icon: 'csharp', enabled: false },
'php-fresher': { root: CONTENT_PHPF_ROOT, displayName: 'PHP (Fresher)', icon: 'php', enabled: false },
'php-intermediate': { root: CONTENT_PHPI_ROOT, displayName: 'PHP (Intermediate)', icon: 'php', enabled: false },
'rust-fresher': { root: CONTENT_RUSTF_ROOT, displayName: 'Rust (Fresher)', icon: 'rust', enabled: false },
'rust-intermediate': { root: CONTENT_RUSTI_ROOT, displayName: 'Rust (Intermediate)', icon: 'rust', enabled: false },
'kotlin-fresher': { root: CONTENT_KOTF_ROOT, displayName: 'Kotlin (Fresher)', icon: 'kotlin', enabled: false },
'kotlin-intermediate': { root: CONTENT_KOTI_ROOT, displayName: 'Kotlin (Intermediate)', icon: 'kotlin', enabled: false },
```

### Step 10 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

**Expected:** exit 0.

Manual:

1. With all flags off, the four new languages do NOT show on `/domains`.
2. Local-only flip ONE intermediate at a time (csharp-intermediate, then php-intermediate, etc.); for each, open one topic and verify code/mermaid render.
3. Revert each local flip.
4. Open one existing JBI / JS / TS / Go / Ruby topic — zero regression.

### Step 11 — Commit and update INDEX

Commit per language so rollback is granular:

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

for LANG in csharp php rust kotlin; do
  git add content/${LANG}-fresher/ content/${LANG}-intermediate/
  git commit -m "content(${LANG}): finalize fresher + intermediate" --allow-empty
done

# Single locked-domain commit with all 8 entries
git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register csharp/php/rust/kotlin locked domains (flags off)"

git add ROADMAP.md expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 58-long-tail-language-tracks DONE"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher per language ≥ 90% of target | per-language count | sum questions in `content/<L>-fresher/**/complete-qa.json` |
| Q-count intermediate per language ≥ 90% of target | per-language count | (same shape, intermediate level) |
| Validator passes 100% for all 8 levels | step 7 returns 0 per language | step 7 |
| Per-language anti-pattern fingerprint clean (or thresholds documented) | manual review | step 8 |
| Locked-domain edit limited to 3 allowed files | clean diff | `git diff --name-only HEAD~5 HEAD \| grep '^frontend/' \| grep -v -E 'frontend/lib/(content-reader\|seo-slugs\|launch-config)\.ts'` empty |
| `npm run build` exits 0 | exit | step 10 |
| With flags=false, all four new languages hidden on `/domains` | manual | step 10 |
| With flag=true (local), one topic renders per language | manual | step 10 |
| Existing language pages: zero regression | manual | step 10 |

## Failure modes & rollback

- **C# code shows .NET Framework idioms (4.x) instead of .NET 8**: pin version in queue; tighten prompt; regenerate.
- **PHP code missing `<?php` tag in standalone snippets**: prompt template addendum: "All standalone PHP code blocks must start with `<?php` unless explicitly tagged as a snippet within a class body."
- **Rust intermediate code overuses `unwrap()` everywhere**: tighten idiom doc with concrete examples of `?` operator usage; regenerate offending topics.
- **Kotlin code uses Java-style getters/setters**: idiom doc emphasis on properties; regenerate.
- **Wall time blows >100h** (across all 4 languages): expected over multiple sessions. Use handoff skill aggressively. Each language is independent — split across separate factory branches if it helps reasoning.
- **One language is far worse quality than others**: don't ship that language's commits in this playbook. Defer to a follow-up "deep redo" playbook (numbered in the 80s) for that one language while shipping the other three.

## Definition of Done

- [ ] All 8 level directories populated; Q-count targets met (≥ 90% of stated target per level).
- [ ] 100% validator pass rate.
- [ ] Per-language anti-pattern fingerprint clean or thresholds explicitly documented.
- [ ] All 8 locked-domain entries (flags FALSE).
- [ ] SEO slugs added for all 8.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, one topic per new language renders when flag locally true).
- [ ] All 9 quality gates pass.
- [ ] Commits on factory branch (one per language for content, one shared for locked-domain).
- [ ] `00-INDEX.md` row for `58` flipped to `DONE`.
- [ ] ROADMAP.md has 4 launch-checklist rows pending (csharp, php, rust, kotlin).

## Estimated effort

- **Ideal:** 95 hours total across the four languages (≈ 24h per language).
- **Hard stop:** 180 hours.
- **Recommended split:** 12-16 agent sessions, distributed roughly 3-4 sessions per language. Use handoff skill between sessions. Recommended order: csharp → kotlin → rust → php (front-loaded by traffic potential).
