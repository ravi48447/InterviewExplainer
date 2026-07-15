# 60 — Rust Systems Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. **Supersedes** the Rust batch in `58-long-tail-language-tracks.md`.

## TL;DR

- **Input:** Working content factory + taxonomy + Rust idiom guide and exemplars (from playbook 53). Rust shells under `content/rust-fresher/` and `content/rust-intermediate/` may already exist as thin stubs from playbook 58.
- **Action:** Build `content/rust-fresher/` (~330 Q), `content/rust-intermediate/` (~1,000 Q), and a new `content/rust-systems-advanced/` (~600 Q) focused on async runtimes, `unsafe`, embedded `no_std`, and FFI. Pillars over-index on what Rust is famous for: ownership, lifetimes, traits, `Result`/`?`, fearless concurrency, zero-cost abstractions.
- **Output:** Three Rust level directories totalling ~1,900-2,000 Q, all idiomatic Rust (no `.unwrap()` in production examples, `Result<T,E>` over panics, `&str` vs `String` distinguished, every `unsafe` block justified), validated, and registered in `LOCKED_DOMAINS` with flags off.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/rust.md` exists and has been updated to include the "lifetimes elision rules", "`Send`/`Sync` rationale", and "when `unsafe` is acceptable" sub-sections.
- [ ] `.cursor/content-factory/exemplars/rust/` has at least 3 polished exemplars (one ownership, one async, one trait-heavy).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch (`git switch -c content-factory/<date>-rust` if starting fresh).

## Why this matters (2 sentences)

Rust interview demand is concentrated in systems, cloud-native infra (Cloudflare, AWS Firecracker, Fastly), embedded, and blockchain — segments that pay 20-40% above generic backend roles. Playbook 58's batch allocation (~1,000 Q across fresher + intermediate) is too thin to compete with `rust-by-example` or `https://doc.rust-lang.org/rust-by-example/`; a dedicated track at ~2,000 Q with an advanced level pulls Rust onto the same depth shelf as Java and Python.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/rust.md` | Rust-specific idioms; emphasis on ownership, `?` for error propagation, lifetimes elision, `Result` over `panic!`. |
| `.cursor/content-factory/exemplars/rust/` | Three polished Rust exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.rust.*`) | Pillar→module mapping for Rust; update if adding the new `unsafe-and-ffi` or `embedded-no-std` pillars for the advanced level. |
| `expansion-plan/56-go-track-fullsize.md` | Reference for the wave-by-wave pattern this playbook reuses. |
| `expansion-plan/58-long-tail-language-tracks.md` (Rust sections only) | What this playbook replaces. |
| `expansion-plan/07-locked-domain-pattern.md` | Registration pattern. |

## Q-count targets (level × pillar)

### Fresher (`rust-fresher`) — target 330 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | rust-language-core, primitive-types, control-flow, functions, modules-and-crates | 90 |
| ownership-and-borrowing | ownership-basics, references-and-borrowing, slices, copy-vs-clone | 60 |
| structs-enums-pattern-match | structs, enums-and-variants, basic-pattern-matching, options-and-results-intro | 50 |
| error-handling | panic-vs-result-intro, the-question-mark-operator-basics | 30 |
| stdlib-collections | vec, hashmap, string-vs-str | 30 |
| testing-and-tooling | cargo-basics, unit-tests-with-cfg-test, rustfmt-clippy | 30 |
| behavioral-and-interview | scenarios | 40 |

### Intermediate (`rust-intermediate`) — target 1,000 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | language-core, generics, type-inference, scenario-based | 130 |
| ownership-and-borrowing | ownership-deep, lifetimes-and-elision, smart-pointers (`Box`/`Rc`/`Arc`), interior-mutability (`Cell`/`RefCell`) | 130 |
| traits-and-polymorphism | traits, trait-objects, generic-bounds, blanket-impls, deriving, marker-traits (`Send`/`Sync`/`Copy`) | 110 |
| error-handling | result-pattern, the-question-mark-operator, custom-error-types, `thiserror`, `anyhow` | 70 |
| concurrency-and-async | threads, `Mutex`/`RwLock`, channels (mpsc), `Send`/`Sync` deep, async-foundations, `Future` trait, tokio, async-streams | 160 |
| stdlib-and-collections | string-handling, iterators-and-adapters, hashmaps, btreemaps, slices-deep | 80 |
| data-and-orm | sqlx (async), diesel, sea-orm, pgx-style queries | 70 |
| web-frameworks | axum, actix-web, rocket, warp, tonic-grpc | 80 |
| testing | unit, integration, criterion-benches, fuzzing-with-cargo-fuzz | 50 |
| build-and-deps | cargo-workspaces, features, conditional-compilation, publish-to-crates-io | 30 |
| behavioral-and-interview | scenarios | 30 |

### Advanced (`rust-systems-advanced`) — target 600 Q

| Pillar | Modules | Q target |
|---|---|---|
| async-runtimes-deep | tokio-internals, async-await-desugar, pinning-and-poll, manual-`Future`, runtime-comparison (tokio/async-std/smol) | 110 |
| unsafe-and-ffi | unsafe-rust, raw-pointers, ffi-with-c, bindgen-and-cbindgen, abi-considerations, soundness-rules | 110 |
| memory-and-perf | allocators, miri-and-loom, profiling (perf, flamegraph), criterion, zero-cost-abstractions-proof | 80 |
| systems-and-os | syscalls-with-libc, mmap, signals, process-spawning, embedded-no-std-intro | 80 |
| networking-and-protocols | low-level-networking, custom-protocols, quinn-quic, hyper-internals | 60 |
| compiler-and-types | macros (declarative + procedural), const-generics, gat (generic-associated-types), specialization-status | 60 |
| security-and-soundness | secure-coding-rust, integer-overflow, validating-FFI-inputs, supply-chain (cargo-audit/deny) | 50 |
| scenario-based | senior architecture + war stories | 50 |

## Execution steps

### Step 1 — Confirm or create the three Rust level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in rust-fresher rust-intermediate rust-systems-advanced; do
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

If any of these already exist as stubs from playbook 58, **do not delete** — extend in place. Add `pillar_groups` per the tables above using the same shape as `content/go-intermediate/_index.json`.

### Step 2 — Generate per-module `_config.json` files

Same pattern as playbook 56 step 2. Iterate over taxonomy modules. ~65 module shells across the three levels. Pin every config's `version_pin` to `"Rust 1.78"` (or whatever taxonomy.yaml specifies). For the advanced level, additionally pin `edition: "2021"` and `toolchain_channel: "stable"` with a per-module override to `"nightly"` for any topic that requires it (e.g. specialization, certain `unsafe` proofs).

### Step 3 — Build the three queues

Write three queue files:

- `.cursor/content-factory/queues/rust_fresher.txt` (~80 lines, avg ~4 Q per topic).
- `.cursor/content-factory/queues/rust_intermediate.txt` (~240 lines).
- `.cursor/content-factory/queues/rust_systems_advanced.txt` (~140 lines).

Layouts: heavy `concept-explainer` for fresher; `concept-deep-dive` + `comparison-arena` for intermediate (lifetimes vs GC, `Arc<Mutex>` vs channels, `tokio` vs `async-std`); `scenario-walkthrough` + `architecture-explainer` for advanced.

### Step 4 — Dry-run all three queues

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for Q in rust_fresher rust_intermediate rust_systems_advanced; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 5 — Run the fresher wave

```bash
WAVE=rust_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** ~80 topics generated, validated, committed. Wall time 5-9 hours.

### Step 6 — Run the intermediate wave

Same shape, `WAVE=rust_intermediate`. Wall time 15-22 hours; split into 2-3 sessions if needed (suggested cut: language+ownership+traits first; concurrency+web+data second).

### Step 7 — Run the advanced wave

Same shape, `WAVE=rust_systems_advanced`. Wall time 10-15 hours. Run last because it depends on the intermediate exemplars being in place to anchor cross-links.

### Step 8 — Validate all generated content

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
FAILED=0
for f in $(find content/rust-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — Rust-specific anti-pattern fingerprint

Beyond generic non-language-isms, check for:

- `.unwrap()` or `.expect("...")` in production code examples (acceptable only in tests, prototypes, or after an `Option`/`Result` was just constructed in the same expression).
- `unsafe` blocks without an accompanying `// SAFETY:` comment.
- `&String` parameter type instead of `&str`.
- Mutable shared state without an explanation of the `Send`/`Sync` choice.

```bash
python3 - <<'PY'
import re
from pathlib import Path

flags = {
    "unwrap_in_examples": r"\.unwrap\(\)",
    "expect_in_examples": r"\.expect\(",
    "unsafe_without_safety_comment": r"unsafe\s*\{(?![\s\S]{0,40}SAFETY:)",
    "ref_string_param": r"&\s*String\b",
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("rust-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text))

for k, v in flagged.items():
    print(f"{k}: {v} occurrences")
PY
```

Goal isn't zero (`.unwrap()` in a test is fine), but every `unsafe` block missing a `SAFETY:` comment **must** be fixed. Document the threshold decisions in the wave run-dir log.

### Step 10 — Locked-domain registration

Edit ONLY `frontend/lib/content-reader.ts`, `frontend/lib/seo-slugs.ts`, `frontend/lib/launch-config.ts`.

**`frontend/lib/content-reader.ts`:**

```typescript
export const CONTENT_RUSTF_ROOT = 'content/rust-fresher';
export const CONTENT_RUSTI_ROOT = 'content/rust-intermediate';
export const CONTENT_RUSTA_ROOT = 'content/rust-systems-advanced';

// In LOCKED_DOMAINS:
'rust-fresher':          { root: CONTENT_RUSTF_ROOT, displayName: 'Rust (Fresher)',          icon: 'rust', enabled: false },
'rust-intermediate':     { root: CONTENT_RUSTI_ROOT, displayName: 'Rust (Intermediate)',     icon: 'rust', enabled: false },
'rust-systems-advanced': { root: CONTENT_RUSTA_ROOT, displayName: 'Rust (Systems Advanced)', icon: 'rust', enabled: false },
```

**`frontend/lib/seo-slugs.ts`:** add canonical mappings:

- `rust-fresher` ↔ `rust-interview-questions-for-freshers`
- `rust-intermediate` ↔ `rust-interview-questions`
- `rust-systems-advanced` ↔ `rust-systems-programming-interview-questions`

**`frontend/lib/launch-config.ts`:** keep all three flags FALSE.

### Step 11 — Remove Rust from playbook 58's queue list

Edit `expansion-plan/58-long-tail-language-tracks.md`: in the title row and the per-language Q-target table, mark the Rust sub-section as `SUPERSEDED → see 60-rust-systems-track.md`. Do **not** delete the headings — keep them for traceability.

### Step 12 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → Rust cards hidden on `/domains`.
2. Local-only flip `rust-intermediate` to enabled, run dev, open one Rust topic (suggest `ownership-and-borrowing/lifetimes-deep`). Verify code (no `.unwrap()` flagged, lifetimes annotated where needed, mermaid renders).
3. Revert local flip.
4. Open existing JBI/Go/JS topic — zero regression.

### Step 13 — Commit and update INDEX

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add content/rust-fresher/ content/rust-intermediate/ content/rust-systems-advanced/
git commit -m "content(rust): finalize fresher + intermediate + systems-advanced"

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register rust locked domains (flags off)"

git add expansion-plan/00-INDEX.md expansion-plan/58-long-tail-language-tracks.md
git commit -m "docs(expansion-plan): mark 60-rust-systems-track DONE; mark 58 Rust SUPERSEDED"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 300 | count | sum questions in `content/rust-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 950 | count | sum questions in `content/rust-intermediate/**/complete-qa.json` |
| Q-count advanced ≥ 550 | count | sum questions in `content/rust-systems-advanced/**/complete-qa.json` |
| Validator passes 100% | step 8 returns 0 | step 8 |
| `unsafe` without `// SAFETY:` = 0 | step 9 fingerprint | step 9 |
| Rust anti-pattern fingerprint reviewed and documented | manual | step 9 |
| Locked-domain edit limited to 3 files | clean diff | `git diff --name-only HEAD~3 HEAD \| grep '^frontend/' \| grep -v -E 'frontend/lib/(content-reader\|seo-slugs\|launch-config)\.ts'` empty |
| `npm run build` exits 0 | exit | step 12 |
| With flags=false, Rust hidden on `/domains` | manual | step 12 |
| With flag=true (local), Rust topic renders | manual | step 12 |
| Existing language pages: zero regression | manual | step 12 |
| Playbook 58 Rust sub-sections marked SUPERSEDED | grep | `grep -c 'SUPERSEDED' expansion-plan/58-long-tail-language-tracks.md` ≥ 2 |

## Failure modes & rollback

- **Generated code is full of `.unwrap()`**: tighten idiom doc and prompt template: "Production code in concept-explainer layouts must propagate errors via `?` and `Result<T,E>`. `.unwrap()` is only allowed in tests, in `main()` for prototypes, and in cases where the value was just constructed (e.g. `Some(x).unwrap()` after a literal `Some(x)`)."
- **`unsafe` blocks without `// SAFETY:` comments**: prompt template must say "Every `unsafe { … }` block requires a `// SAFETY: …` comment immediately above explaining the invariants the author is upholding." Regenerate the offending topics.
- **Lifetimes over-explained or under-explained**: calibrate against the exemplar set. The intermediate `lifetimes-and-elision` module should hit elision rules and HRTBs; the fresher module should not.
- **Async examples mixing tokio and async-std**: prompt should say "Every async example uses `tokio` by default unless the topic explicitly compares runtimes."
- **Advanced track drifts into the same content as intermediate**: gate is the per-pillar uniqueness check — if 30%+ of advanced topic slugs duplicate intermediate slugs, the queue is mis-scoped; revise queue and regenerate.
- **Wall time blow >50h across all three waves**: split intermediate into two halves and run advanced last. Use the handoff skill between sessions.

## Definition of Done

- [ ] Three Rust level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] Rust anti-pattern fingerprint reviewed; `unsafe` without `// SAFETY:` count = 0.
- [ ] Three locked-domain entries (`enabled: false`).
- [ ] SEO slugs added for all three levels.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, Rust topic renders when flag locally true).
- [ ] All 12 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `60` flipped to `DONE`.
- [ ] `58-long-tail-language-tracks.md` Rust sub-sections flagged `SUPERSEDED → see 60-rust-systems-track.md`.
- [ ] ROADMAP.md has "Rust launch checklist" row pending.

## Estimated effort

- **Ideal:** 38 hours (5h fresher + 18h intermediate + 10h advanced + 5h infra/locked-domain).
- **Hard stop:** 75 hours.
- **Recommended split:** 5 agent sessions:
  1. Steps 1-4 (scaffold + dry runs).
  2. Step 5 (fresher wave).
  3. Step 6 (intermediate wave, possibly split into 2 sub-sessions).
  4. Step 7 (advanced wave).
  5. Steps 8-13 (validation + locked-domain + UI smoke + commits + INDEX).

Use the handoff skill between sessions; each ends with `bash .cursor/skills/handoff/scripts/new_handoff.sh rust-track-session-<n>`.
