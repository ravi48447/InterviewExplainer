# 66 — Scala FP / JVM Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. **New track** (not previously batched in playbook 58).

## TL;DR

- **Input:** Working content factory + taxonomy + Scala idiom guide and exemplars (from playbook 53). Add Scala to taxonomy if missing.
- **Action:** Build `content/scala-fresher/` (~260 Q), `content/scala-intermediate/` (~750 Q), and `content/scala-advanced/` (~450 Q). Pillars over-index on what Scala interviews at data-platform shops (Databricks, Snowflake, Lyft, Apple, Spotify) and FP-focused shops (Disney+, Spire, Iterable) actually test: case classes + pattern matching, immutable collections, for-comprehensions, type classes, the cats / cats-effect / ZIO ecosystem, Akka / Pekko, Apache Spark idioms, Scala 3 (Dotty) features.
- **Output:** Three Scala level directories totalling ~1,450 Q, all idiomatic modern Scala (Scala 3 by default; Scala 2.13 syntax noted only when migration is the topic), validated, registered in `LOCKED_DOMAINS` with flags off.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/scala.md` exists with sub-sections on "Scala 3 vs 2.13 syntax", "for-comprehensions as monadic syntax", "tagless final vs effect systems", "Cats Effect vs ZIO decision".
- [ ] `.cursor/content-factory/exemplars/scala/` has ≥ 3 polished exemplars (one pure-FP with cats-effect, one Spark dataset transformation, one Akka actor or Pekko stream).
- [ ] `.cursor/content-factory/taxonomy.yaml` has a `language_pillar_modules.scala.*` section (add if missing).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

Scala punches above its weight in two markets: data engineering (Spark is the de-facto big-data engine, written in Scala) and pure-FP shops where teams are willing to pay 30-50% premiums for the right candidates. A dedicated track that separately serves the "Scala for Spark" candidate from the "Scala for Cats-Effect/ZIO" candidate is differentiated against generic Scala prep sites that lump everything together.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/scala.md` | Scala idioms; Scala 3 first, FP patterns, effect systems. |
| `.cursor/content-factory/exemplars/scala/` | Polished exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.scala.*`) | Pillar → module mapping. |
| `expansion-plan/56-go-track-fullsize.md` | Reference for the wave-by-wave pattern. |
| `expansion-plan/69-data-engineering-hub.md` (when authored) | Spark-specific big-data content cross-links there; this playbook covers the language and Spark-idiomatic Scala. |

## Q-count targets (level × pillar)

### Fresher (`scala-fresher`) — target 260 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | scala-language-core (Scala 3), val-vs-var, control-flow, functions-and-lambdas, traits-basics | 80 |
| case-classes-and-pattern-match | case-classes, basic-pattern-matching, options-and-eithers-intro | 50 |
| collections-immutable | list-vector-map-set, iteration, higher-order-fns (`map`/`filter`/`foldLeft`) | 50 |
| oop-fp-bridge | classes, objects-and-companions, traits-and-mixins-basics | 40 |
| error-handling | try-success-failure, options-vs-eithers, exceptions | 20 |
| testing-and-tooling | scalatest-basics, munit, sbt-basics | 20 |

### Intermediate (`scala-intermediate`) — target 750 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | language-core (Scala 3), given-and-using (contextual abstractions), extension-methods, opaque-types, union-and-intersection-types, scenario-based | 130 |
| collections-and-fp | immutable-collections-deep, mutable-collections-when, lazy-evaluation, view-vs-strict, for-comprehensions-deep | 90 |
| type-classes | type-classes-pattern, given-instances, evidence-parameters, derives, kind-projector-style | 80 |
| concurrency-and-effects | futures-and-promises, ec-and-execution-contexts, cats-effect-intro, zio-intro, comparing-effect-systems | 110 |
| data-and-orm | slick, doobie, quill, postgres-with-scala | 50 |
| web-frameworks | http4s, play-framework, akka-http-pekko-http, tapir | 80 |
| streams | fs2, akka-streams-pekko-streams, zio-streams | 50 |
| spark-and-bigdata | spark-rdd-vs-dataset, spark-sql, spark-structured-streaming, scala-3-with-spark | 80 |
| testing | scalatest-deep, scalacheck, munit, mockito-scala | 40 |
| build-and-deps | sbt-deep, mill, scala-cli, cross-building-2.13-and-3 | 20 |
| behavioral-and-interview | scenarios | 20 |

### Advanced (`scala-advanced`) — target 450 Q

| Pillar | Modules | Q target |
|---|---|---|
| effect-systems-deep | cats-effect-3-deep (IO, Resource, Fiber), zio-2-deep (ZIO, ZLayer, ZIO scheduling), error-channels, structured-concurrency-effects | 100 |
| type-classes-and-tagless | tagless-final-pattern, free-monads, mtl-pattern, error-as-data-type | 80 |
| metaprogramming-and-scala3 | inline-and-compile-time, match-types, derives-deep, macros-scala-3 | 70 |
| streams-deep | fs2-deep, akka-pekko-streams-deep, backpressure-patterns, distributed-streaming-patterns | 70 |
| spark-deep | spark-catalyst-optimizer, spark-tungsten, custom-aggregations, performance-tuning, dataset-encoders | 60 |
| architecture-and-design | ddd-with-fp-scala, event-sourcing-fp-scala, modular-monolith-tagless | 40 |
| scenario-based | senior architecture + war stories | 30 |

## Execution steps

### Step 1 — Confirm or create the three Scala level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in scala-fresher scala-intermediate scala-advanced; do
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

Same pattern as playbook 56 step 2. ~55 module shells. Pin `version_pin: "Scala 3.3 LTS"` by default; mark cross-build topics with both `"3.3"` and `"2.13"`. `jvm_target: "17"`.

### Step 3 — Build the three queues

- `.cursor/content-factory/queues/scala_fresher.txt` (~65 lines).
- `.cursor/content-factory/queues/scala_intermediate.txt` (~190 lines).
- `.cursor/content-factory/queues/scala_advanced.txt` (~110 lines).

Layouts: `concept-explainer` for fresher; `concept-deep-dive` + `comparison-arena` (Cats Effect vs ZIO, Spark RDD vs Dataset, http4s vs Play) for intermediate; `architecture-explainer` + `scenario-walkthrough` for advanced.

### Step 4 — Dry-run all three queues

```bash
for Q in scala_fresher scala_intermediate scala_advanced; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 5 — Run the fresher wave

```bash
WAVE=scala_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** ~65 topics. Wall time 4-7 hours.

### Step 6 — Run the intermediate wave

`WAVE=scala_intermediate`. Wall time 12-18 hours.

### Step 7 — Run the advanced wave

`WAVE=scala_advanced`. Wall time 8-12 hours.

### Step 8 — Validate all generated content

```bash
FAILED=0
for f in $(find content/scala-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — Scala anti-pattern fingerprint

```bash
python3 - <<'PY'
import re
from pathlib import Path

flags = {
    "var_overuse": r"\bvar\s+\w+\s*=",                              # var should be rare
    "null_in_examples": r"\bnull\b",                                # null is anti-FP in Scala
    "asInstanceOf_overuse": r"\.asInstanceOf\[",
    "isInstanceOf_overuse": r"\.isInstanceOf\[",
    "future_block_await": r"Await\.(result|ready)\(",               # blocking the future
    "global_implicit_ec": r"ExecutionContext\.Implicits\.global",   # cargo cult
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("scala-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text))

for k, v in flagged.items():
    print(f"{k}: {v} occurrences")
PY
```

`var` should be rare (val by default); `null` should be near zero outside Java-interop topics; `asInstanceOf` / `isInstanceOf` should be rare (use pattern matching); `Await.result` in production code is a blocking anti-pattern; `ExecutionContext.Implicits.global` in production code is cargo culting (use a properly-tuned EC or an effect-system's runtime).

### Step 10 — Locked-domain registration

```typescript
export const CONTENT_SCF_ROOT = 'content/scala-fresher';
export const CONTENT_SCI_ROOT = 'content/scala-intermediate';
export const CONTENT_SCA_ROOT = 'content/scala-advanced';

'scala-fresher':      { root: CONTENT_SCF_ROOT, displayName: 'Scala (Fresher)',      icon: 'scala', enabled: false },
'scala-intermediate': { root: CONTENT_SCI_ROOT, displayName: 'Scala (Intermediate)', icon: 'scala', enabled: false },
'scala-advanced':     { root: CONTENT_SCA_ROOT, displayName: 'Scala (Advanced)',     icon: 'scala', enabled: false },
```

SEO slugs: `scala-interview-questions-for-freshers`, `scala-interview-questions`, `senior-scala-fp-interview-questions`.

All three flags FALSE.

### Step 11 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → Scala cards hidden on `/domains`.
2. Local-only flip `scala-intermediate` to enabled; open `concurrency-and-effects/cats-effect-intro`; verify Scala 3 syntax, no `Await.result`, mermaid renders.
3. Revert local flip.
4. Open existing Java topic — confirm no regression.

### Step 12 — Commit and update INDEX

```bash
git add content/scala-fresher/ content/scala-intermediate/ content/scala-advanced/
git commit -m "content(scala): finalize fresher + intermediate + advanced"

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register scala locked domains (flags off)"

git add .cursor/content-factory/taxonomy.yaml
git commit -m "chore(taxonomy): add scala language_pillar_modules" --allow-empty

git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 66-scala-fp-jvm-track DONE"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 240 | count | sum questions in `content/scala-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 700 | count | sum questions in `content/scala-intermediate/**/complete-qa.json` |
| Q-count advanced ≥ 420 | count | sum questions in `content/scala-advanced/**/complete-qa.json` |
| Validator passes 100% | step 8 returns 0 | step 8 |
| `Await.result`/`Await.ready` in non-counterexample code ≤ 3 | step 9 + review | step 9 |
| `ExecutionContext.Implicits.global` in production code = 0 | step 9 | step 9 |
| `null` outside Java-interop topics ≤ 5 | step 9 + review | step 9 |
| Scala anti-pattern fingerprint reviewed and documented | manual | step 9 |
| Locked-domain edit limited to 3 files | clean diff | step 10 diff check |
| `npm run build` exits 0 | exit | step 11 |
| With flags=false, Scala hidden on `/domains` | manual | step 11 |
| With flag=true (local), Scala topic renders | manual | step 11 |
| Existing pages: zero regression | manual | step 11 |
| Taxonomy has `language_pillar_modules.scala.*` populated | grep | `grep -c '^\s*scala:' .cursor/content-factory/taxonomy.yaml` ≥ 1 |
| Scala 3 syntax used by default | manual sample (10 topics) | review |

## Failure modes & rollback

- **`Await.result` used as a normal control-flow tool**: prompt must say "Blocking on a `Future` (`Await.result`/`Await.ready`) is allowed only in tests or one-shot scripts. In production-style code, compose with `flatMap`/`for`-comprehensions, or use an effect system (Cats Effect IO, ZIO)."
- **`ExecutionContext.Implicits.global` in production code**: prompt must say "Production code uses an explicit ExecutionContext (e.g. `ExecutionContext.fromExecutorService(Executors.newFixedThreadPool(...))`) or the effect system's runtime. `Implicits.global` is for one-shot scripts and tests."
- **`null` outside Java-interop topics**: prompt must say "Use `Option`/`Either`/`Try`. `null` appears only in topics about interop with Java APIs."
- **Scala 2.13 syntax in Scala-3-default topics**: regenerate with prompt scope locked to Scala 3 (given/using over implicit, `enum` over sealed-trait-+-case-object pattern where appropriate).
- **Cats Effect vs ZIO bias**: target 50/50 in the effect-systems pillar at intermediate; either both ecosystems carry their weight or the comparison-arena topics suffer.
- **Spark sections too thin**: if Spark pillar in intermediate < 60 Q, regenerate with explicit RDD vs Dataset vs Structured Streaming emphasis.
- **Wall time blow > 40h**: split intermediate; advanced last. Use handoff skill.

## Definition of Done

- [ ] Three Scala level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] Scala anti-pattern fingerprint reviewed; `ExecutionContext.Implicits.global` in production code at zero.
- [ ] Three locked-domain entries (`enabled: false`).
- [ ] SEO slugs added.
- [ ] Taxonomy `language_pillar_modules.scala.*` populated and committed.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, Scala topic renders when flag locally true).
- [ ] All 15 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `66` flipped to `DONE`.
- [ ] ROADMAP.md has "Scala launch checklist" row pending.

## Estimated effort

- **Ideal:** 28 hours (4h fresher + 13h intermediate + 8h advanced + 3h infra/taxonomy/locked-domain).
- **Hard stop:** 56 hours.
- **Recommended split:** 4 agent sessions:
  1. Steps 1-4 (taxonomy + scaffold + dry runs).
  2. Step 5 (fresher).
  3. Step 6 (intermediate).
  4. Steps 7-12 (advanced + validation + locked-domain + UI smoke + commits + INDEX).

Use the handoff skill between sessions.
