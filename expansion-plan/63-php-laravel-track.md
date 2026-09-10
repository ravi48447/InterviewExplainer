# 63 — PHP / Laravel Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. **Supersedes** the PHP batch in `58-long-tail-language-tracks.md`.

## TL;DR

- **Input:** Working content factory + taxonomy + PHP idiom guide and exemplars (from playbook 53). Optional thin shells from playbook 58.
- **Action:** Build `content/php-fresher/` (~280 Q), `content/php-intermediate/` (~850 Q), and `content/php-advanced/` (~450 Q). Pillars over-index on what PHP 8.x interviews actually test today: modern type system (enums, readonly, intersection types), attributes, Composer + PSR standards, Laravel (queues, Horizon, Octane, Inertia, Livewire), Symfony components, and the WordPress + WooCommerce ecosystem.
- **Output:** Three PHP level directories totalling ~1,600 Q, all idiomatic PHP 8.x (strict types declared, typed properties, no string-keyed magic, `readonly` for value objects, attributes over docblock metadata where the framework supports it), validated, registered in `LOCKED_DOMAINS` with flags off.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/php.md` exists with sub-sections on "PHP 8.x type system", "strict_types declaration rules", "PSR-12 + PSR-4", "Laravel-vs-Symfony decision table".
- [ ] `.cursor/content-factory/exemplars/php/` has ≥ 3 polished exemplars (one Laravel REST + Eloquent, one Symfony service + Doctrine, one queue worker with Horizon).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

PHP is dismissed by some, but it still powers ~75% of public websites (WordPress) and a large mid-market backend segment (Laravel shops, e-commerce platforms, healthcare CMS). Playbook 58 batched PHP at ~950 Q with no advanced level, which both leaves senior-PHP search demand on the table and signals to PHP candidates that the platform doesn't take them seriously; the dedicated track corrects both.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/php.md` | PHP-specific idioms; strict types, PSR, modern type system. |
| `.cursor/content-factory/exemplars/php/` | Polished exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.php.*`) | Pillar → module mapping. |
| `expansion-plan/56-go-track-fullsize.md` | Reference for the wave-by-wave pattern. |
| `expansion-plan/58-long-tail-language-tracks.md` (PHP sections) | What this playbook replaces. |
| `https://www.php.net/releases/8.3/en.php` (read-only reference) | PHP 8.3 features the prompt template should keep current with. |

## Q-count targets (level × pillar)

### Fresher (`php-fresher`) — target 280 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | php-language-core, types-and-conversions, control-flow, functions-basics, includes-vs-require, php-fpm-basics | 80 |
| oop-and-encapsulation | classes, inheritance-basics, interfaces-basics, traits-intro, access-modifiers, properties-and-promotion | 60 |
| stdlib-and-arrays | array-functions, string-handling, json-encode-decode, datetime-basics | 50 |
| error-handling | exceptions-basics, try-catch-finally, error-vs-exception | 20 |
| composer-and-deps | composer-basics, autoloading-psr-4, semantic-versioning-php | 20 |
| testing-and-tooling | phpunit-basics, php-cs-fixer-basics, php-cli-basics | 20 |
| behavioral-and-interview | scenarios | 30 |

### Intermediate (`php-intermediate`) — target 850 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | language-core, enums, readonly, named-args, first-class-callable-syntax, never-type, intersection-and-union-types, scenario-based | 140 |
| oop-and-design | traits-and-late-static-binding, abstract-and-interface-deep, value-objects, dto-patterns | 80 |
| frameworks-laravel | routing, controllers, blade, eloquent, migrations, factories, validation, middleware, service-container, service-providers, events-and-listeners, jobs-and-queues, horizon, octane, livewire, inertia, sanctum | 230 |
| frameworks-symfony | bundles, di-container-symfony, doctrine-orm, forms, security-bundle, messenger | 90 |
| api-and-realtime | rest-with-laravel, rest-with-symfony, graphql-lighthouse, websockets-with-soketi-or-pusher | 70 |
| data-and-orm | eloquent-deep, doctrine-deep, raw-pdo, postgres-with-php, redis-with-predis-or-phpredis | 70 |
| testing | phpunit-deep, pest, mockery, browser-tests-dusk, http-tests-laravel | 60 |
| build-and-deps | composer-deep, private-packages, packagist, autoloading-strategies | 30 |
| devops-and-cloud | docker-php-fpm, ci-with-gh-actions, laravel-forge-vs-envoyer, observability-laravel | 30 |
| security | csrf, xss, sql-injection-with-pdo, password-hashing, owasp-php | 20 |
| behavioral-and-interview | scenarios | 30 |

### Advanced (`php-advanced`) — target 450 Q

| Pillar | Modules | Q target |
|---|---|---|
| performance-and-runtime | opcache, jit-php-8, fpm-tuning, octane-with-swoole-or-roadrunner, memory-profiling | 100 |
| architecture-and-design | hexagonal-architecture-php, ddd-with-php, event-sourcing-prooph, cqrs-with-laravel, modular-monolith-laravel | 90 |
| distributed-and-messaging | rabbit-php, kafka-php, outbox-pattern-php, distributed-tx-considerations | 70 |
| security-and-production | secrets-with-vault, security-headers, rate-limiting, observability-otel-php, blue-green-php | 60 |
| frameworks-deep | laravel-internals (service-container-deep, facades-internals), symfony-internals (kernel-events, http-foundation), package-development | 80 |
| scenario-based | senior architecture + war stories | 50 |

## Execution steps

### Step 1 — Confirm or create the three PHP level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in php-fresher php-intermediate php-advanced; do
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

If shells exist from playbook 58, extend in place.

### Step 2 — Generate per-module `_config.json` files

Same pattern as playbook 56 step 2. ~60 module shells across three levels. Pin every config's `version_pin` to `"PHP 8.3"` and `framework_versions: {laravel: "11.x", symfony: "7.x"}`.

### Step 3 — Build the three queues

- `.cursor/content-factory/queues/php_fresher.txt` (~70 lines).
- `.cursor/content-factory/queues/php_intermediate.txt` (~210 lines).
- `.cursor/content-factory/queues/php_advanced.txt` (~110 lines).

Layouts: `concept-explainer` heavy for fresher; `concept-deep-dive` + `comparison-arena` (Laravel vs Symfony, Eloquent vs Doctrine, Horizon vs Octane) for intermediate; `architecture-explainer` + `scenario-walkthrough` for advanced.

### Step 4 — Dry-run all three queues

```bash
for Q in php_fresher php_intermediate php_advanced; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 5 — Run the fresher wave

```bash
WAVE=php_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** ~70 topics. Wall time 4-8 hours.

### Step 6 — Run the intermediate wave

`WAVE=php_intermediate`. Wall time 13-20 hours; split (language+oop+laravel-core first, the rest second).

### Step 7 — Run the advanced wave

`WAVE=php_advanced`. Wall time 8-12 hours.

### Step 8 — Validate all generated content

```bash
FAILED=0
for f in $(find content/php-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — PHP anti-pattern fingerprint

```bash
python3 - <<'PY'
import re
from pathlib import Path

flags = {
    "missing_strict_types": r"<\?php(?!\s*declare\(strict_types\s*=\s*1\))",
    "mysql_star_extension": r"\bmysql_(?:query|connect|fetch)\b",   # deprecated since 5.5
    "string_concatenation_sql": r"\"SELECT\b[^\"]*\.\s*\$",
    "untyped_property_in_modern_class": r"^\s*public\s+\$\w+\s*;",
    "deprecated_each": r"\beach\s*\(",
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("php-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text))

for k, v in flagged.items():
    print(f"{k}: {v} occurrences")
PY
```

`declare(strict_types=1);` must be at the top of every PHP example unless the topic explicitly demonstrates weak typing. `mysql_*` and `each()` are PHP 5.x — must be zero. String-concatenated SQL must be zero in non-counterexample contexts (counterexamples for the SQL-injection topic are fine).

### Step 10 — Locked-domain registration

```typescript
export const CONTENT_PHPF_ROOT = 'content/php-fresher';
export const CONTENT_PHPI_ROOT = 'content/php-intermediate';
export const CONTENT_PHPA_ROOT = 'content/php-advanced';

'php-fresher':      { root: CONTENT_PHPF_ROOT, displayName: 'PHP (Fresher)',      icon: 'php', enabled: false },
'php-intermediate': { root: CONTENT_PHPI_ROOT, displayName: 'PHP (Intermediate)', icon: 'php', enabled: false },
'php-advanced':     { root: CONTENT_PHPA_ROOT, displayName: 'PHP (Advanced)',     icon: 'php', enabled: false },
```

SEO slugs: `php-interview-questions-for-freshers`, `php-laravel-interview-questions`, `senior-php-developer-interview-questions`.

All three flags FALSE.

### Step 11 — Supersede playbook 58

Mark the PHP sub-section in `expansion-plan/58-long-tail-language-tracks.md` as `SUPERSEDED → see 63-php-laravel-track.md`.

### Step 12 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → PHP cards hidden on `/domains`.
2. Local-only flip `php-intermediate` to enabled; open `frameworks-laravel/jobs-and-queues`; verify `declare(strict_types=1);` present, no `mysql_*`, mermaid renders.
3. Revert local flip.
4. Open existing JS topic — confirm no regression.

### Step 13 — Commit and update INDEX

```bash
git add content/php-fresher/ content/php-intermediate/ content/php-advanced/
git commit -m "content(php): finalize fresher + intermediate + advanced"

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register php locked domains (flags off)"

git add expansion-plan/00-INDEX.md expansion-plan/58-long-tail-language-tracks.md
git commit -m "docs(expansion-plan): mark 63-php-laravel-track DONE; mark 58 PHP SUPERSEDED"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 260 | count | sum questions in `content/php-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 800 | count | sum questions in `content/php-intermediate/**/complete-qa.json` |
| Q-count advanced ≥ 420 | count | sum questions in `content/php-advanced/**/complete-qa.json` |
| Validator passes 100% | step 8 returns 0 | step 8 |
| `mysql_*` occurrences = 0 | step 9 | step 9 |
| `each()` occurrences = 0 | step 9 | step 9 |
| String-concat SQL = 0 in non-counterexample code | step 9 + manual review | step 9 |
| PHP anti-pattern fingerprint reviewed and documented | manual | step 9 |
| Locked-domain edit limited to 3 files | clean diff | step 10 diff check |
| `npm run build` exits 0 | exit | step 12 |
| With flags=false, PHP hidden on `/domains` | manual | step 12 |
| With flag=true (local), PHP topic renders | manual | step 12 |
| Existing pages: zero regression | manual | step 12 |
| Playbook 58 PHP sub-section marked SUPERSEDED | grep | `grep -c 'SUPERSEDED → see 63' expansion-plan/58-long-tail-language-tracks.md` ≥ 1 |

## Failure modes & rollback

- **`mysql_*` resurfaces**: prompt must say "All database examples use PDO or the framework's query builder. `mysql_*` functions have been removed since PHP 7."
- **String-concatenated SQL leaks into examples**: prompt must say "All SQL in examples uses prepared statements (`PDO::prepare` + bind, or `DB::table(...)->where(...)` / `Eloquent::where(...)`). Only the dedicated SQL-injection topic may show counterexamples — and those must be inside a labelled 'INSECURE — DO NOT COPY' block."
- **Untyped properties in modern classes**: prompt must say "All class properties in PHP 8.x examples are typed (e.g. `public string $name`). Untyped public properties are only allowed when the topic explicitly demonstrates pre-7.4 syntax."
- **Magic-array overuse**: enforce DTO / value-object pattern in modern code. Magic associative arrays as return types are fine in legacy WordPress contexts; flag elsewhere.
- **Laravel-vs-Symfony content imbalance**: target 60% Laravel / 25% Symfony / 15% framework-agnostic in the intermediate framework pillar. Recount after each wave.
- **Wall time blow > 50h**: split intermediate; advanced last. Use handoff skill.

## Definition of Done

- [ ] Three PHP level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] PHP anti-pattern fingerprint reviewed; `mysql_*` and `each()` both at zero.
- [ ] Three locked-domain entries (`enabled: false`).
- [ ] SEO slugs added.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, PHP topic renders when flag locally true).
- [ ] All 14 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `63` flipped to `DONE`.
- [ ] `58-long-tail-language-tracks.md` PHP sub-section flagged `SUPERSEDED → see 63-php-laravel-track.md`.
- [ ] ROADMAP.md has "PHP launch checklist" row pending.

## Estimated effort

- **Ideal:** 30 hours (4h fresher + 16h intermediate + 7h advanced + 3h infra).
- **Hard stop:** 60 hours.
- **Recommended split:** 5 agent sessions:
  1. Steps 1-4 (scaffold + dry runs).
  2. Step 5 (fresher).
  3. Step 6 (intermediate, possibly split).
  4. Step 7 (advanced).
  5. Steps 8-13 (validation + locked-domain + UI smoke + commits + INDEX).

Use the handoff skill between sessions; each ends with `bash .cursor/skills/handoff/scripts/new_handoff.sh php-track-session-<n>`.
