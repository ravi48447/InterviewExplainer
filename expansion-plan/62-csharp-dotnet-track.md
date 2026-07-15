# 62 — C# / .NET Track (Full Size)

> **Executor:** AI coding agent operating autonomously, producing real content in bulk.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content fill + locked-domain registration. **Supersedes** the C# batch in `58-long-tail-language-tracks.md`.

## TL;DR

- **Input:** Working content factory + taxonomy + C# / .NET idiom guide and exemplars (from playbook 53). Optional thin shells from playbook 58.
- **Action:** Build `content/csharp-fresher/` (~320 Q), `content/csharp-intermediate/` (~950 Q), and `content/csharp-advanced/` (~550 Q). Pillars emphasize what .NET interviews actually test today: `async`/`await` and the SynchronizationContext, LINQ + IEnumerable laziness, generics + records + pattern matching, EF Core, ASP.NET Core (MVC + Minimal APIs + Blazor + SignalR + gRPC), and the .NET 8/9 modern runtime story (NativeAOT, source generators).
- **Output:** Three C# level directories totalling ~1,800 Q, all idiomatic modern C# (records over POCOs where appropriate, `IAsyncEnumerable` over manual streams, no `ConfigureAwait(false)` cargo culting, `async`/`await` end-to-end, no `.Result`/`.Wait()` in user code), validated, registered in `LOCKED_DOMAINS` with flags off.

## Hard prerequisites

- [ ] Playbooks 51, 52, 53 DONE.
- [ ] `.cursor/content-factory/idioms/csharp.md` exists with sub-sections on "async/await rules", "ConfigureAwait when and when not", "records vs classes vs structs", "nullable reference types".
- [ ] `.cursor/content-factory/exemplars/csharp/` has ≥ 3 polished exemplars (one async, one LINQ, one ASP.NET-Core minimal-API + EF-Core).
- [ ] `cursor-agent` 3.x authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch.

## Why this matters (2 sentences)

C# is the #2 enterprise backend language by job posting volume (LinkedIn, ZipRecruiter) and dominates US healthcare, finance, and gov-contractor segments. Playbook 58's batch C# allocation (~1,000 Q) is below the parity bar with Java; a dedicated track at ~1,800 Q with .NET-8/9 modern idioms closes the gap and lets the platform compete for Microsoft-stack-shop candidates.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/idioms/csharp.md` | C# idioms; async/await, LINQ laziness, NRTs, records. |
| `.cursor/content-factory/exemplars/csharp/` | Polished exemplars from playbook 53. |
| `.cursor/content-factory/taxonomy.yaml` (`language_pillar_modules.csharp.*`) | Pillar → module mapping. |
| `expansion-plan/56-go-track-fullsize.md` | Reference for the wave-by-wave pattern. |
| `expansion-plan/13-jbi-spring-ecosystem.md` | Java/Spring reference; ASP.NET Core topics should cross-link to JBI for shared concepts (DI, AOP, observability). |
| `expansion-plan/58-long-tail-language-tracks.md` (C# sections) | What this playbook replaces. |

## Q-count targets (level × pillar)

### Fresher (`csharp-fresher`) — target 320 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | csharp-language-core, value-vs-reference-types, control-flow, methods-and-overloading, namespaces | 90 |
| oop-and-encapsulation | classes, inheritance-basics, interfaces-basics, access-modifiers, properties-and-fields | 60 |
| generics-basics | generic-classes-basics, generic-methods-basics, common-constraints | 30 |
| collections-and-stdlib | List/Dictionary/HashSet, foreach-and-iteration, basic-string-handling | 50 |
| error-handling | exceptions-basics, try-catch-finally, custom-exception-basics | 30 |
| testing-and-tooling | xunit-basics, dotnet-cli-basics, nuget-basics | 30 |
| behavioral-and-interview | scenarios | 30 |

### Intermediate (`csharp-intermediate`) — target 950 Q

| Pillar | Modules | Q target |
|---|---|---|
| core-language | language-core, records, pattern-matching, init-only-and-required, nullable-reference-types, scenario-based | 150 |
| generics-and-types | generics-deep, variance-in-and-out, generic-math (`INumber<T>`), default-interface-methods | 70 |
| async-and-concurrency | async-await-deep, the-synchronization-context, tasks-vs-valuetask, cancellation-tokens, `Channel<T>`, `IAsyncEnumerable`, parallel-linq, threadpool-vs-tasks | 160 |
| linq-and-functional | linq-to-objects, deferred-execution, expression-trees-intro, immutability-patterns | 90 |
| data-and-orm | ef-core-basics, change-tracking, migrations, dapper, querying-postgres, transactions | 110 |
| aspnet-core | aspnet-core-mvc, minimal-apis, middleware-pipeline, model-binding-and-validation, di-and-services, options-pattern, configuration | 130 |
| realtime-and-grpc | signalr, grpc-aspnet, server-sent-events, websockets | 50 |
| testing | xunit, nunit, fluent-assertions, moq, integration-testing-with-webapplicationfactory | 60 |
| build-and-deps | dotnet-cli-deep, nuget-private-feeds, msbuild-basics | 30 |
| devops-and-cloud | docker-dotnet, azure-functions, azure-app-service, observability-otel | 40 |
| security | aspnet-auth, oauth-jwt-aspnet, owasp-aspnet, secrets-with-user-secrets-and-keyvault | 30 |
| behavioral-and-interview | scenarios | 30 |

### Advanced (`csharp-advanced`) — target 550 Q

| Pillar | Modules | Q target |
|---|---|---|
| runtime-and-performance | nativeaot, source-generators, span-and-memory, ref-struct, allocation-profiling, benchmarkdotnet, pgo, tiered-compilation | 130 |
| advanced-async | task-scheduling-deep, valuetask-pitfalls, async-state-machine, deadlocks-and-the-synchronization-context, configure-await-true-vs-false-decision-table | 90 |
| architecture-and-design | clean-architecture-dotnet, vertical-slice-architecture, mediatr, ddd-with-csharp, event-sourcing-marten | 90 |
| advanced-linq-expressions | expression-trees-deep, custom-iqueryable-providers, advanced-ef-core (query-splitting, compiled-queries) | 70 |
| messaging-and-distributed | masstransit, rabbit-aspnet, kafka-confluent-dotnet, dapr, outbox-pattern | 70 |
| security-and-production | authn-with-identityserver-alternatives, oauth-deep, app-secrets-in-production, observability-otel-deep | 50 |
| scenario-based | senior architecture + war stories | 50 |

## Execution steps

### Step 1 — Confirm or create the three C# level shells

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for L in csharp-fresher csharp-intermediate csharp-advanced; do
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

Same pattern as playbook 56 step 2. ~62 module shells across the three levels. Pin every config's `version_pin` to `".NET 8 (C# 12)"` (or whatever taxonomy.yaml specifies). For the advanced level, add `runtime_features: ["NativeAOT", "tiered-PGO"]` so layouts know they can reference those.

### Step 3 — Build the three queues

- `.cursor/content-factory/queues/csharp_fresher.txt` (~80 lines).
- `.cursor/content-factory/queues/csharp_intermediate.txt` (~230 lines).
- `.cursor/content-factory/queues/csharp_advanced.txt` (~130 lines).

Layouts: `concept-explainer` heavy for fresher; `concept-deep-dive` + `comparison-arena` (e.g. `Task` vs `ValueTask`, EF Core vs Dapper, MVC vs Minimal APIs) for intermediate; `architecture-explainer` + `scenario-walkthrough` for advanced.

### Step 4 — Dry-run all three queues

```bash
for Q in csharp_fresher csharp_intermediate csharp_advanced; do
  echo "=== $Q ==="
  bash .cursor/content-factory/factory.sh --dry-run \
    .cursor/content-factory/queues/$Q.txt | head -30
done
```

### Step 5 — Run the fresher wave

```bash
WAVE=csharp_fresher
TS=$(date +%Y-%m-%dT%H%M)
mkdir -p .cursor/content-factory/runs/${TS}_${WAVE}
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/${WAVE}.txt \
  2>&1 | tee .cursor/content-factory/runs/${TS}_${WAVE}/wall.log
```

**Expected:** ~80 topics. Wall time 5-9 hours.

### Step 6 — Run the intermediate wave

Same shape, `WAVE=csharp_intermediate`. Wall time 14-21 hours; split if needed (language+generics+linq first, async+aspnet+data second).

### Step 7 — Run the advanced wave

Same shape, `WAVE=csharp_advanced`. Wall time 9-14 hours.

### Step 8 — Validate all generated content

```bash
FAILED=0
for f in $(find content/csharp-* -name complete-qa.json); do
  if ! python3 .cursor/content-factory/lib/validate_qa.py "$f" >/dev/null; then
    echo "[FAIL] $f"
    FAILED=$((FAILED + 1))
  fi
done
echo "Total failures: $FAILED"
```

**Expected:** `Total failures: 0`.

### Step 9 — C# anti-pattern fingerprint

```bash
python3 - <<'PY'
import re
from pathlib import Path

flags = {
    "result_or_wait_blocking_async": r"\.(Result|Wait)\(\)",
    "configureawait_cargo_cult": r"\.ConfigureAwait\(false\)",   # informational, not a hard fail
    "var_overuse_in_signatures": r"public\s+var\s+",            # impossible — sanity check signal
    "throw_ex_losing_stack": r"throw\s+ex\s*;",
    "linq_to_list_then_select": r"\.ToList\(\)\s*\.Select\(",
}

flagged = {k: 0 for k in flags}
for f in Path("content").rglob("csharp-*/**/complete-qa.json"):
    text = f.read_text()
    for k, pat in flags.items():
        flagged[k] += len(re.findall(pat, text))

for k, v in flagged.items():
    print(f"{k}: {v} occurrences")
PY
```

`.Result`/`.Wait()` outside of a `Main` in a console example or a test is a deadlock risk in older sync contexts — should be near zero. `ConfigureAwait(false)` is informational only: in library code it's correct, in ASP.NET Core 6+ app code it's unnecessary; an explanation must accompany each occurrence. `throw ex;` (vs `throw;`) loses the stack — must be zero in non-counterexample contexts.

### Step 10 — Cross-link to playbook 13 (Spring) for shared concepts

In every ASP.NET-Core DI / observability / middleware topic, add a "See also" pointer to the corresponding JBI Spring topic so candidates moving between stacks see the parallel. Do **not** duplicate JBI content; cover only the .NET-specific delta.

### Step 11 — Locked-domain registration

Edit ONLY `frontend/lib/content-reader.ts`, `frontend/lib/seo-slugs.ts`, `frontend/lib/launch-config.ts`.

```typescript
export const CONTENT_CSF_ROOT = 'content/csharp-fresher';
export const CONTENT_CSI_ROOT = 'content/csharp-intermediate';
export const CONTENT_CSA_ROOT = 'content/csharp-advanced';

'csharp-fresher':      { root: CONTENT_CSF_ROOT, displayName: 'C# / .NET (Fresher)',      icon: 'csharp', enabled: false },
'csharp-intermediate': { root: CONTENT_CSI_ROOT, displayName: 'C# / .NET (Intermediate)', icon: 'csharp', enabled: false },
'csharp-advanced':     { root: CONTENT_CSA_ROOT, displayName: 'C# / .NET (Advanced)',     icon: 'csharp', enabled: false },
```

SEO slugs: `csharp-interview-questions-for-freshers`, `csharp-net-interview-questions`, `senior-dotnet-developer-interview-questions`.

All three flags FALSE.

### Step 12 — Supersede playbook 58

Mark the C# sub-section in `expansion-plan/58-long-tail-language-tracks.md` as `SUPERSEDED → see 62-csharp-dotnet-track.md`.

### Step 13 — UI smoke test

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

Manual:

1. Flags off → C# cards hidden on `/domains`.
2. Local-only flip `csharp-intermediate` to enabled; open `async-and-concurrency/async-await-deep`; verify no `.Result`/`.Wait()`, async chain end-to-end, mermaid renders.
3. Revert local flip.
4. Open existing Java Spring topic — confirm no regression.

### Step 14 — Commit and update INDEX

```bash
git add content/csharp-fresher/ content/csharp-intermediate/ content/csharp-advanced/
git commit -m "content(csharp): finalize fresher + intermediate + advanced"

git add frontend/lib/content-reader.ts frontend/lib/seo-slugs.ts frontend/lib/launch-config.ts
git commit -m "feat(content-reader): register csharp/.net locked domains (flags off)"

git add expansion-plan/00-INDEX.md expansion-plan/58-long-tail-language-tracks.md
git commit -m "docs(expansion-plan): mark 62-csharp-dotnet-track DONE; mark 58 C# SUPERSEDED"
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Q-count fresher ≥ 300 | count | sum questions in `content/csharp-fresher/**/complete-qa.json` |
| Q-count intermediate ≥ 900 | count | sum questions in `content/csharp-intermediate/**/complete-qa.json` |
| Q-count advanced ≥ 520 | count | sum questions in `content/csharp-advanced/**/complete-qa.json` |
| Validator passes 100% | step 8 returns 0 | step 8 |
| `.Result`/`.Wait()` in non-counterexample code = 0 | step 9 | step 9 |
| `throw ex;` (vs `throw;`) = 0 in non-counterexample code | step 9 | step 9 |
| C# anti-pattern fingerprint reviewed and documented | manual | step 9 |
| Cross-links from ASP.NET Core → JBI Spring all resolve | grep + link probe | pre-flight script |
| Locked-domain edit limited to 3 files | clean diff | step 11 diff check |
| `npm run build` exits 0 | exit | step 13 |
| With flags=false, C# hidden on `/domains` | manual | step 13 |
| With flag=true (local), C# topic renders | manual | step 13 |
| Existing pages: zero regression | manual | step 13 |
| Playbook 58 C# sub-section marked SUPERSEDED | grep | `grep -c 'SUPERSEDED → see 62' expansion-plan/58-long-tail-language-tracks.md` ≥ 1 |

## Failure modes & rollback

- **`.Result`/`.Wait()` in user code**: prompt must enforce "Async chain end-to-end. If a sync entry point must call async, use `await Task.Run(…)` only with an explicit note about thread-pool growth; never `.Result`/`.Wait()` in user code outside `Main` in a console prototype."
- **`ConfigureAwait(false)` cargo cult in app code**: prompt must include "Library code uses `ConfigureAwait(false)`. ASP.NET Core 6+ app code does not need it (no SynchronizationContext). Each occurrence must justify itself."
- **Outdated APIs (`HttpClient` per call, `WebClient`)**: idiom doc + prompt should pin .NET 8/9 APIs: `HttpClient` via `IHttpClientFactory`, `HttpClient` reuse, `System.Text.Json` over Newtonsoft unless the topic explicitly compares.
- **EF Core N+1 examples not flagged as anti-patterns**: every EF Core `Include` / `Select` example should call out whether it triggers query splitting or a join, and whether it's an N+1 risk.
- **NRT (`#nullable enable`) not enabled in examples**: enforce `#nullable enable` at the top of every C# example unless the topic explicitly demonstrates the legacy mode.
- **Wall time blow > 55h**: split intermediate; run advanced last. Use handoff skill.

## Definition of Done

- [ ] Three C# level directories populated; Q-count targets met.
- [ ] 100% validator pass rate.
- [ ] C# anti-pattern fingerprint reviewed; `.Result`/`.Wait()` and `throw ex;` both at zero in non-counterexample code.
- [ ] Three locked-domain entries (`enabled: false`).
- [ ] SEO slugs added.
- [ ] Cross-links from ASP.NET Core topics to JBI Spring counterparts present and resolved.
- [ ] `npm run build` exit 0.
- [ ] UI smoke (existing pages identical, C# topic renders when flag locally true).
- [ ] All 14 quality gates pass.
- [ ] Commits on factory branch.
- [ ] `00-INDEX.md` row for `62` flipped to `DONE`.
- [ ] `58-long-tail-language-tracks.md` C# sub-section flagged `SUPERSEDED → see 62-csharp-dotnet-track.md`.
- [ ] ROADMAP.md has "C#/.NET launch checklist" row pending.

## Estimated effort

- **Ideal:** 36 hours (5h fresher + 17h intermediate + 9h advanced + 5h infra).
- **Hard stop:** 72 hours.
- **Recommended split:** 5 agent sessions:
  1. Steps 1-4 (scaffold + dry runs).
  2. Step 5 (fresher).
  3. Step 6 (intermediate, possibly split).
  4. Step 7 (advanced).
  5. Steps 8-14 (validation + locked-domain + UI smoke + commits + INDEX).

Use the handoff skill between sessions; each ends with `bash .cursor/skills/handoff/scripts/new_handoff.sh csharp-track-session-<n>`.
