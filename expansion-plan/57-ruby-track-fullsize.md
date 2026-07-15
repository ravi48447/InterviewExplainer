# 57 — Ruby Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration.

## TL;DR

- **Input:** Working content factory + taxonomy + Ruby idiom guide and exemplars.
- **Action:** Build out `content/ruby-fresher/` (~300 Q) and `content/ruby-intermediate/` (~800-950 Q). The intermediate level is heavily Rails-flavored: Active Record, Action Controller, Action Cable, Hotwire, Sidekiq.
- **Output:** Two Ruby levels totalling ~1100-1250 Q, idiomatic (proper use of blocks/procs/lambdas, no Java-flavored explicit returns, idiomatic enumerable usage), validated and registered.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/ruby.md` and `.cursor/content-factory/exemplars/ruby/` exist.
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

Rails interview demand has stabilized as a reliable mid-traffic SEO segment, particularly for early-stage startups in NA/EU. Without a Ruby track, our long-tail SEO loses an entire ecosystem; with one, we own the keyword "ruby on rails interview questions" against blog spam.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/ruby.md` | Ruby-specific idioms; key sections cover blocks vs procs vs lambdas, snake_case, predicate methods (`?` suffix), bang methods (`!` suffix), implicit returns. |
| `.cursor/content-factory/exemplars/ruby/` | Two polished Ruby exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.ruby.*`) | Pillar→module mapping for Ruby. |
| `expansion-plan/07-locked-domain-pattern.md` | Registration steps. |

## Q-count targets (level × pillar)

### Fresher (`ruby-fresher`) — target 300 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | ruby-language-core, classes-modules-mixins-basics, blocks-and-yield, enumerable-basics, string-and-symbol | 100 |
| error-handling | begin-rescue-ensure, raise-and-custom-exceptions | 40 |
| io-and-streams | file-io, stdin-stdout, json-yaml | 30 |
| testing | rspec-basics, minitest-basics | 30 |
| build-and-deps | bundler-basics, gemfile-basics | 30 |
| behavioral-and-interview | scenarios | 30 |
| scenario-based | mixed | 40 |

### Intermediate (`ruby-intermediate`) — target 800-950 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | ruby-language-core, classes-modules-mixins, blocks-procs-lambdas, metaprogramming, enumerable, scenario-based | 180 |
| concurrency-and-async | threads, mutex, fibers, async-gem, ractor-intro | 70 |
| memory-and-runtime | gc-mark-and-sweep, gc-tuning, jemalloc, memory-profiling | 40 |
| error-handling | exception-hierarchy, retry-patterns, error-tracking | 50 |
| io-and-streams | file-io-deep, net-http, streaming, marshal | 40 |
| data-and-orm | active-record, active-record-associations, scopes, n-plus-1, sequel-gem, raw-sql | 130 |
| web-frameworks | rails-core, rails-action-controller, rails-action-view, rails-action-cable, hotwire-turbo, sinatra, hanami | 200 |
| apis-and-messaging | rails-api-mode, jsonapi, graphql-ruby, sidekiq, action-cable-pubsub | 80 |
| testing | rspec-deep, capybara, factorybot, vcr, contract-testing-pact | 70 |
| build-and-deps | bundler, gemfile-deep, rubygems-publishing | 30 |
| devops-and-cloud | docker-rails, heroku-vs-aws, observability-rails | 30 |
| system-design | scaling-rails, caching-russian-doll, background-jobs, multi-tenancy | 50 |
| security | rails-security, owasp-rails, secrets-mgmt, devise | 30 |
| behavioral-and-interview | scenarios | 30 |

## Execution steps

### Step 1 — Confirm or create the Ruby level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in ruby-fresher ruby-intermediate; do
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

Same pattern; pin `version_pin` to `"Ruby 3.3 / Rails 7"`. Total ~50 module shells.

### Step 3 — Build the Ruby-fresher queue

Write `.cursor/content-factory/queues/ruby_fresher.txt`. ~70-80 lines, avg 4 Q per topic.

### Step 4 — Build the Ruby-intermediate queue

Write `.cursor/content-factory/queues/ruby_intermediate.txt`. ~200 lines, avg 4-5 Q per topic. Layouts: heavy `concept-explainer` for blocks/procs/lambdas; `comparison-arena` for ORM and framework comparisons; `scenario-walkthrough` for system-design.

### Step 5 — Dry-run both queues

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for Q in ruby_fresher ruby_intermediate; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 6 — Run Ruby-fresher wave

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
WAVE=ruby_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** Wall time 5-8 hours.

### Step 7 — Run Ruby-intermediate wave

Same shape, `WAVE=ruby_intermediate`. Wall time 12-20 hours; split if needed.

### Step 8 — Validate all generated content

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
FAILED=0
for f in $(find content/ruby-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — Ruby-specific anti-pattern fingerprint

Common Java-flavored regressions:

- `class Foo { ... }` (curly-brace bodies). Ruby uses `class Foo ... end`.
- Verbose explicit `return` everywhere instead of relying on the last-expression return.
- `Optional<...>`. Ruby uses `nil` and idiomatic guards.
- `final` keyword. Ruby has no `final`.
- Type annotations in business code that should be untyped (Sorbet/RBS is fine in dedicated topics, but mainstream Ruby code is dynamically typed).

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
python3 - <<'PY'
import json, re
from pathlib import Path

flags = {
    "curly_brace_class_body": r"\bclass\s+\w+(?:\s*<\s*\w+)?\s*\{",
    "java_optional": r"Optional<",
    "final_keyword": r"\bfinal\s+\w+\s*=",
    "verbose_return": r"^\s*return\s+\w+(?!\s*if|\s*unless)",  # rough
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("ruby-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text, re.MULTILINE))

for k, v in flagged.items():
    print(f"{k}: {v}")
PY
```

`curly_brace_class_body`, `java_optional`, `final_keyword` should all be 0. Some `verbose_return` is ok but high counts mean regenerate.

### Step 10 — Locked-domain registration

Edit ONLY `frontend/lib/content-reader.ts`, `frontend/lib/seo-slugs.ts`, `frontend/lib/launch-config.ts`.

**`frontend/lib/content-reader.ts`:**

```typescript
export const CONTENT_RBF_ROOT = 'content/ruby-fresher';
export const CONTENT_RBI_ROOT = 'content/ruby-intermediate';

// In LOCKED_DOMAINS:
'ruby-fresher': { root: CONTENT_RBF_ROOT, displayName: 'Ruby (Fresher)', icon: 'ruby', enabled: false },
'ruby-intermediate': { root: CONTENT_RBI_ROOT, displayName: 'Ruby (Intermediate)', icon: 'ruby', enabled: false },
```

**`frontend/lib/seo-slugs.ts`:** add canonical mappings (`ruby-intermediate` ↔ `ruby-on-rails-interview-questions`).

**`frontend/lib/launch-config.ts`:** flags FALSE.

### Step 11 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → Ruby hidden on `/domains`.
2. Local-only flip `ruby-intermediate` to enabled. Open one Ruby topic; verify code (idiomatic Ruby, no Java-flavor) and mermaid render.
3. Revert local flip.
4. Open existing JBI/JS/TS/Go pages → zero regression.

### Step 12 — Commit and update INDEX

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add content/ruby-fresher/ content/ruby-intermediate/
git commit -m "content(ruby): finalize fresher + intermediate" --allow-empty

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register ruby locked domains (flags off)"

git add ROADMAP.md expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 57-ruby-track-fullsize DONE"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 270 | count | sum questions across `content/ruby-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 750 | count | (same shape, ruby-intermediate) |
| Validator passes 100% | step 8 returns 0 | step 8 |
| Ruby anti-pattern fingerprint: 0 hits for `curly_brace_class_body`, `java_optional`, `final_keyword` | step 9 | step 9 |
| Locked-domain edit limited to 3 files | clean diff | `git diff --name-only HEAD~3 HEAD \| grep '^frontend/' \| grep -v -E 'frontend/lib/(content-reader\|seo-slugs\|launch-config)\.ts'` empty |
| `npm run build` exits 0 | exit | step 11 |
| With flags=false, Ruby hidden | manual | step 11 |
| With flag=true (local), Ruby topic renders | manual | step 11 |
| Existing language pages: zero regression | manual | step 11 |

## Failure modes & rollback

- **Java-flavored class bodies** (curly braces): tighten idiom doc; regenerate offending topics.
- **Excessive Sorbet/RBS in mainstream topics**: prompt should reserve type annotations for the `core-language/typing-with-rbs` topic; mainstream code stays dynamic.
- **Rails 6 idioms in Rails 7 contexts**: pin all generated code to Rails 7 in the version-pin field; regenerate topics that referenced old Rails patterns.
- **Wall time blow >30h**: split intermediate into two halves. Use handoff skill.

## Definition of Done

- [ ] Two Ruby level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] Ruby anti-pattern fingerprint clean (zero on the three hard checks).
- [ ] Two locked-domain entries (flags FALSE).
- [ ] SEO slugs added.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, Ruby topic renders when flag locally true).
- [ ] All 9 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `57` flipped to `DONE`.
- [ ] ROADMAP.md has "Ruby launch checklist" row pending.

## Estimated effort

- **Ideal:** 25 hours (5h fresher + 16h intermediate + 4h infra).
- **Hard stop:** 50 hours.
- **Recommended split:** 4 agent sessions; same shape as Go playbook.
