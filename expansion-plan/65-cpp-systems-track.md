# 65 — C++ Systems Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. **New track** (not previously batched in playbook 58).

## TL;DR

- **Input:** Working content factory + taxonomy + C++ idiom guide and exemplars (from playbook 53). Add C++ to taxonomy if missing.
- **Action:** Build `content/cpp-fresher/` (~300 Q), `content/cpp-intermediate/` (~900 Q), and `content/cpp-systems-advanced/` (~600 Q). Pillars emphasize what C++ interviews at HFT, gaming, embedded, browser, and database shops actually test: RAII, value categories (lvalue / rvalue / xvalue), move semantics, smart pointers, templates + concepts + ranges, lock-free concurrency, undefined behavior boundary, modern build (CMake + Conan/vcpkg).
- **Output:** Three C++ level directories totalling ~1,800 Q, all idiomatic modern C++17/20/23 (RAII for every resource, smart pointers over raw new/delete, `auto` where it aids readability, `constexpr` where it can be, `noexcept` where it matters, `<ranges>` and `<concepts>` in advanced topics), validated, registered in `LOCKED_DOMAINS` with flags off.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/cpp.md` exists with sub-sections on "RAII and resource ownership", "value categories cheat sheet", "rule of 0/3/5/7", "when to use which smart pointer", "undefined behavior boundary".
- [ ] `.cursor/content-factory/exemplars/cpp/` has ≥ 3 polished exemplars (one RAII + smart-pointer, one templates + concepts, one lock-free concurrency).
- [ ] `.cursor/content-factory/taxonomy.yaml` has a `language_pillar_modules.cpp.*` section (add if missing).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

C++ powers the world's most performance-critical software — HFT (Jane Street, Citadel, Jump), browsers (Chromium, Firefox), databases (PostgreSQL, MySQL internals, ClickHouse), game engines (Unreal), embedded (automotive, aerospace) — and its interviews are notoriously brutal in ways generic prep sites don't cover (UB, value categories, ABI, allocator design). A dedicated track at modern C++17/20/23 depth, with HFT-grade attention to performance and UB, captures the highest-paying language segment in the industry.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/cpp.md` | C++ idioms; RAII, value categories, smart pointers, UB. |
| `.cursor/content-factory/exemplars/cpp/` | Polished exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.cpp.*`) | Pillar → module mapping. |
| `expansion-plan/56-go-track-fullsize.md` | Reference for the wave-by-wave pattern. |
| `https://en.cppreference.com/w/cpp/23` (read-only reference) | C++23 features the prompt template should keep current with. |

## Q-count targets (level × pillar)

### Fresher (`cpp-fresher`) — target 300 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | cpp-language-core, primitive-types, control-flow, functions, namespaces, header-vs-source | 90 |
| oop-and-encapsulation | classes, inheritance-basics, access-modifiers, constructors-destructors, basic-overloading | 60 |
| pointers-and-references | pointers-basics, references-basics, const-correctness-basics, arrays-vs-vectors | 50 |
| stdlib-and-strings | vector, string, map, iteration-basics, iostream-basics | 40 |
| memory-and-raii-intro | new-delete, smart-pointers-intro, raii-intro | 30 |
| testing-and-tooling | gtest-basics, cmake-basics, compiler-flags-intro | 20 |
| behavioral-and-interview | scenarios | 10 |

### Intermediate (`cpp-intermediate`) — target 900 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | language-core, value-categories, move-semantics, perfect-forwarding, structured-bindings, range-based-for, scenario-based | 160 |
| oop-and-types | rule-of-0-3-5, virtual-and-overriding, abstract-classes, multiple-inheritance, crtp-intro | 80 |
| templates-and-generics | function-templates, class-templates, variadic-templates, template-specialization, sfinae-intro, concepts-and-constraints, ranges | 130 |
| memory-and-raii | raii-deep, smart-pointers-deep (`unique`/`shared`/`weak`), allocators-intro, custom-deleters | 90 |
| concurrency-and-async | `std::thread`, `std::mutex`/`std::shared_mutex`, condition-variables, `std::async`/`std::future`, `std::atomic`, memory-orders-intro, thread-pools | 110 |
| stl-deep | iterators, algorithms, ranges-view-composition, `std::span`, `std::optional`, `std::variant`, `std::expected` | 80 |
| data-and-io | file-io, networking-with-boost-asio-intro, `std::format`, `<chrono>` | 50 |
| testing | gtest-deep, gmock, asan-tsan-ubsan, fuzzing-libfuzzer | 50 |
| build-and-deps | cmake-deep, conan, vcpkg, modules-cpp20, compiler-options-deep | 50 |
| behavioral-and-interview | scenarios | 30 |
| performance-intro | inline, constexpr, link-time-optimization, basic-profiling-intro | 30 |

### Advanced (`cpp-systems-advanced`) — target 600 Q

| Pillar | Modules | Q target |
|---|---|---|
| memory-model-and-concurrency-deep | memory-orders-deep (acquire-release-seq-cst-relaxed), lock-free-queues, hazard-pointers, rcu-intro, false-sharing | 130 |
| ub-and-soundness | undefined-behavior-boundary, strict-aliasing, signed-overflow, lifetime-rules, sanitizer-driven-development | 100 |
| performance-and-low-level | branch-prediction-intuitions, cache-aware-data-structures, simd-intrinsics, vectorization, link-time-optimization-deep, profile-guided-opt | 100 |
| templates-and-metaprogramming | sfinae-deep, concepts-design, `if constexpr`, fold-expressions, expression-templates | 90 |
| systems-and-os | syscalls, mmap, signals, epoll-vs-io-uring, custom-allocators, page-cache-aware-io | 80 |
| architecture-and-design | pimpl-and-binary-compat, abi-stability, plugin-architectures, ddd-c++ | 60 |
| scenario-based | senior architecture + war stories (HFT, browser-engine, database internals) | 40 |

## Execution steps

### Step 1 — Confirm or create the three C++ level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in cpp-fresher cpp-intermediate cpp-systems-advanced; do
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

Same pattern as playbook 56 step 2. ~65 module shells across three levels. Pin every config's `version_pin` to `"C++20"` by default, with `c++23` overrides for individual topics covering 23-only features (`std::expected`, `std::print`, modules). Add `compiler_options: ["-Wall", "-Wextra", "-Wpedantic", "-fsanitize=address,undefined"]` so generated code expects to compile clean under all sanitizers.

### Step 3 — Build the three queues

- `.cursor/content-factory/queues/cpp_fresher.txt` (~75 lines).
- `.cursor/content-factory/queues/cpp_intermediate.txt` (~220 lines).
- `.cursor/content-factory/queues/cpp_systems_advanced.txt` (~150 lines).

Layouts: `concept-explainer` heavy for fresher; `concept-deep-dive` + `comparison-arena` (`unique_ptr` vs `shared_ptr`, `mutex` vs `shared_mutex` vs `atomic`, templates vs concepts) for intermediate; `architecture-explainer` + `scenario-walkthrough` (HFT order book, browser layout engine, database storage engine) for advanced.

### Step 4 — Dry-run all three queues

```bash
for Q in cpp_fresher cpp_intermediate cpp_systems_advanced; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 5 — Run the fresher wave

```bash
WAVE=cpp_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** ~75 topics. Wall time 5-9 hours.

### Step 6 — Run the intermediate wave

`WAVE=cpp_intermediate`. Wall time 14-22 hours; split if needed (language+templates+memory first; concurrency+stl+build second).

### Step 7 — Run the advanced wave

`WAVE=cpp_systems_advanced`. Wall time 10-16 hours.

### Step 8 — Validate all generated content

```bash
FAILED=0
for f in $(find content/cpp-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — C++ anti-pattern fingerprint

```bash
python3 - <<'PY'
import re
from pathlib import Path

flags = {
    "raw_new_delete_in_examples": r"\b(new|delete)\b",          # heuristic
    "c_style_array_in_signatures": r"\w+\s+\w+\[\s*\]\s*[,)]",
    "using_namespace_std_in_headers": r"#include\s*<[^>]+>[\s\S]{0,200}using\s+namespace\s+std",
    "c_style_cast": r"\(\s*(int|long|double|char|float|void)\s*\)\s*\w+",
    "manual_lock_unlock": r"\.lock\(\)[\s\S]{0,300}\.unlock\(\)",
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("cpp-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text))

for k, v in flagged.items():
    print(f"{k}: {v} occurrences")
PY
```

Raw `new`/`delete` is acceptable only in topics specifically teaching them. `using namespace std;` in headers is poison — must be near zero. C-style casts must be near zero (prefer `static_cast` / `dynamic_cast` / `reinterpret_cast` / `const_cast`). Manual `.lock()`/`.unlock()` should be replaced with `std::lock_guard` / `std::scoped_lock` / `std::unique_lock`.

### Step 10 — Locked-domain registration

```typescript
export const CONTENT_CPPF_ROOT = 'content/cpp-fresher';
export const CONTENT_CPPI_ROOT = 'content/cpp-intermediate';
export const CONTENT_CPPA_ROOT = 'content/cpp-systems-advanced';

'cpp-fresher':          { root: CONTENT_CPPF_ROOT, displayName: 'C++ (Fresher)',          icon: 'cpp', enabled: false },
'cpp-intermediate':     { root: CONTENT_CPPI_ROOT, displayName: 'C++ (Intermediate)',     icon: 'cpp', enabled: false },
'cpp-systems-advanced': { root: CONTENT_CPPA_ROOT, displayName: 'C++ (Systems Advanced)', icon: 'cpp', enabled: false },
```

SEO slugs: `cpp-interview-questions-for-freshers`, `cpp-interview-questions`, `senior-cpp-systems-programming-interview-questions`.

All three flags FALSE.

### Step 11 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → C++ cards hidden on `/domains`.
2. Local-only flip `cpp-intermediate` to enabled; open `templates-and-generics/concepts-and-constraints`; verify `concept` keyword used correctly, no `using namespace std;` in header examples, mermaid renders.
3. Revert local flip.
4. Open existing pages — confirm no regression.

### Step 12 — Commit and update INDEX

```bash
git add content/cpp-fresher/ content/cpp-intermediate/ content/cpp-systems-advanced/
git commit -m "content(cpp): finalize fresher + intermediate + systems-advanced"

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register cpp locked domains (flags off)"

git add .cursor/content-factory/taxonomy.yaml
git commit -m "chore(taxonomy): add cpp language_pillar_modules" --allow-empty

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 65-cpp-systems-track DONE"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 280 | count | sum questions in `content/cpp-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 850 | count | sum questions in `content/cpp-intermediate/**/complete-qa.json` |
| Q-count advanced ≥ 560 | count | sum questions in `content/cpp-systems-advanced/**/complete-qa.json` |
| Validator passes 100% | step 8 returns 0 | step 8 |
| `using namespace std;` in header examples = 0 | step 9 | step 9 |
| C-style casts in non-counterexample code ≤ 5 (manual review for exceptions) | step 9 + review | step 9 |
| Manual `.lock()`/`.unlock()` in non-counterexample code ≤ 5 | step 9 + review | step 9 |
| Raw `new`/`delete` outside of "smart-pointers-intro" and "memory-management" topics ≤ 10 | step 9 + review | step 9 |
| C++ anti-pattern fingerprint reviewed and documented | manual | step 9 |
| Locked-domain edit limited to 3 files | clean diff | step 10 diff check |
| `npm run build` exits 0 | exit | step 11 |
| With flags=false, C++ hidden on `/domains` | manual | step 11 |
| With flag=true (local), C++ topic renders | manual | step 11 |
| Existing pages: zero regression | manual | step 11 |
| Taxonomy has `language_pillar_modules.cpp.*` populated | grep | `grep -c '^\s*cpp:' .cursor/content-factory/taxonomy.yaml` ≥ 1 |

## Failure modes & rollback

- **Raw `new`/`delete` everywhere**: prompt must say "All resource ownership in C++ examples uses RAII. `new`/`delete` directly is allowed only in topics specifically about memory management (`memory-and-raii.smart-pointers-intro` etc.). Use `std::make_unique` / `std::make_shared` / `std::vector` / `std::array`."
- **`using namespace std;` in headers**: prompt must say "Never `using namespace std;` in header files. In source files, only inside a function scope, never at the top of the file."
- **Manual `.lock()`/`.unlock()`**: prompt must say "Always use `std::lock_guard`, `std::scoped_lock`, or `std::unique_lock` to manage mutex lifetime. Direct `.lock()`/`.unlock()` is only acceptable in topics demonstrating the underlying primitives."
- **Modern features missing in intermediate**: if `<ranges>`, `<concepts>`, `if constexpr`, structured bindings don't appear ≥ 50 times across intermediate, regenerate the relevant pillars.
- **Sanitizer-clean discipline broken**: every example in the advanced track that involves pointers must compile under `-fsanitize=address,undefined` cleanly; the prompt should state this and the validator should grep for an explicit `// asan-ubsan-clean` annotation in lock-free and unsafe-pointer examples.
- **Wall time blow > 60h**: split intermediate into two halves; advanced last. Use handoff skill.

## Definition of Done

- [ ] Three C++ level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] C++ anti-pattern fingerprint reviewed; `using namespace std;` in headers at zero.
- [ ] Three locked-domain entries (`enabled: false`).
- [ ] SEO slugs added.
- [ ] Taxonomy `language_pillar_modules.cpp.*` populated and committed.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, C++ topic renders when flag locally true).
- [ ] All 15 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `65` flipped to `DONE`.
- [ ] ROADMAP.md has "C++ launch checklist" row pending.

## Estimated effort

- **Ideal:** 40 hours (5h fresher + 18h intermediate + 12h advanced + 5h infra/taxonomy/locked-domain).
- **Hard stop:** 80 hours.
- **Recommended split:** 5 agent sessions:
  1. Steps 1-4 (taxonomy + scaffold + dry runs).
  2. Step 5 (fresher).
  3. Step 6 (intermediate, possibly split).
  4. Step 7 (advanced).
  5. Steps 8-12 (validation + locked-domain + UI smoke + commits + INDEX).

Use the handoff skill between sessions.
