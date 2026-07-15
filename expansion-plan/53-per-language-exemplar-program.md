# 53 — Per-Language Exemplar Program

> **Executor:** AI coding agent operating autonomously, producing real content.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content generation + idiom documentation. **No frontend edits.**

## TL;DR

- **Input:** Working content factory (playbook 51) + taxonomy (playbook 52). The factory currently has only Java exemplars — every other language relies on cross-language pattern matching, which produces "Java-flavored Python" / "Java-flavored Go" content of low quality.
- **Action:** For each language listed in `taxonomy.yaml` (10 languages total), write (a) one **idiom guide** (`.cursor/content-factory/idioms/<lang>.md`) and (b) **two gold-standard topic exemplars** generated, validated, hand-polished, and committed under `.cursor/content-factory/exemplars/<lang>/`. Topics chosen are the language's most-distinctive paradigm topics so subsequent bulk runs have a real anchor.
- **Output:** 10 idiom guides + 20 polished exemplar JSON files. Bulk-generation playbooks (54-58, 64) reference these instead of the Java exemplar, eliminating the "Java-flavored everything" failure mode.

## Hard prerequisites

- [ ] Playbook 51 DONE (factory exists, validator works).
- [ ] Playbook 52 DONE (taxonomy + UI contract exist).
- [ ] `cursor-agent --version` returns 3.x and authenticated.
- [ ] `git status` clean.
- [ ] Working factory branch (`content-factory/<date>`) exists and is checked out.

## Why this matters (2 sentences)

Without per-language exemplars, the factory's prompt template forces every language to be measured against `java-io-nio.json` — which produces Pythonic code that imports `Optional<T>`, Go code with `try/catch`, Ruby code that overuses verbose explicit returns. With idiom guides + per-language exemplars, the prompt grounds the model in the language's actual conventions, lifting bulk-output quality from 60% to 90%+ on first attempt.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `.cursor/content-factory/exemplars/java-io-nio.json` | The shape and depth bar. |
| `.cursor/content-factory/taxonomy.yaml` | Source of truth for which languages need exemplars. |
| `.cursor/content-factory/UI_CONTRACT.md` | Reminder that you may NOT add new layout types or section types here. |
| `.cursor/content-factory/lib/validate_qa.py` | The validator every exemplar must pass. |
| Each language's official style guide (linked in idiom doc): PEP 8 for Python, Effective Go, Airbnb JS, etc. | Source of authoritative idioms. |

## Execution steps

### Step 1 — Decide topic pairs per language

These pairs are chosen because they expose the most distinctive idioms of each language. Substitutions are allowed but each pair must (a) expose a paradigm-defining feature and (b) require real, runnable code.

| Language | Topic 1 | Topic 2 |
|---|---|---|
| java | java-io-nio (existing) | contract-testing (existing) |
| python | decorators-and-context-managers | asyncio-fundamentals |
| javascript | event-loop-and-microtasks | promises-and-async-await |
| typescript | generics-and-conditional-types | type-narrowing-and-discriminated-unions |
| go | goroutines-and-channels | error-handling-and-wrapping |
| ruby | blocks-procs-lambdas | metaprogramming-with-method-missing |
| csharp | async-await-and-task | linq-deep-dive |
| php | traits-and-late-static-binding | psr-and-modern-type-system |
| rust | ownership-and-borrowing | error-handling-with-result |
| kotlin | coroutines-and-flow | null-safety-and-smart-casts |

### Step 2 — Write each language idiom guide

For each language, write `.cursor/content-factory/idioms/<lang>.md` (~150-250 lines). Required sections:

1. **Authoritative style references** (PEP 8, Effective Go, etc., with URLs).
2. **Naming conventions** (snake_case vs camelCase vs PascalCase per construct).
3. **File and module conventions** (`__init__.py`, `pkg/`, `lib/`, etc.).
4. **Idiomatic error handling** (exceptions vs Result vs nil-error vs panic).
5. **Idiomatic concurrency** (asyncio vs goroutines vs threads vs Promises).
6. **Idiomatic data classes / structs** (dataclass vs struct vs record vs case class).
7. **Idiomatic dependency / build tooling** (pip+venv vs go mod vs bundler vs npm).
8. **Anti-patterns to NEVER produce**: 8-12 concrete anti-pattern examples with the idiomatic replacement code beside each. This is the most important section — it is what stops the model from emitting Java-flavored output.
9. **Version-specific gotchas**: Python 3.12 vs 3.11 deltas, Go generics availability, JS top-level await, etc.
10. **Code-example formatting**: imports always at the top, `if __name__ == "__main__":` for Python entry points, `package main` for Go runnable demos, etc.

### Step 3 — Generate the per-language exemplar pair

For each language other than Java, run the factory in **single-topic mode** twice. Wrap each invocation as below.

**Command (per language, per topic):**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

LANG=python
TOPIC_SLUG=decorators-and-context-managers
TOPIC_TITLE="Decorators and Context Managers"

mkdir -p .cursor/content-factory/exemplars/${LANG}

# Single-topic queue
echo "exemplars/${LANG}/${TOPIC_SLUG}|concept-explainer|6|java-io-nio.json" \
  > .cursor/content-factory/queues/exemplar_${LANG}_${TOPIC_SLUG}.txt

# Run with idiom guide injected via env var
EXEMPLAR_IDIOMS_DOC=".cursor/content-factory/idioms/${LANG}.md" \
EXEMPLAR_TARGET_DIR=".cursor/content-factory/exemplars/${LANG}" \
bash .cursor/content-factory/factory.sh \
  .cursor/content-factory/queues/exemplar_${LANG}_${TOPIC_SLUG}.txt
```

**Expected output:** `.cursor/content-factory/exemplars/python/decorators-and-context-managers.json` exists, validator passes, code blocks use Python idioms (no `Optional<T>`, no `final` keyword, etc.).

**If validator fails:** factory retries 2x, then logs to `runs/<ts>/FAILED.txt`. Fix the prompt template to include the idioms doc path AND retry.

### Step 4 — Hand-polish each exemplar

Generated content is the *starting point*; exemplars must be hand-polished to gold-standard. For each generated exemplar:

1. Read end-to-end.
2. Run through every code block: does it actually compile/run with the documented language version?
3. Check anti-pattern checklist from the language idiom doc — if any anti-pattern found, edit the exemplar.
4. Improve `speakable_answer` for fluency (read aloud).
5. Add at least one mermaid `architecture_diagram` if the topic has any spatial/temporal flow.
6. Run validator after edits.
7. Save edited exemplar with comment `// EXEMPLAR — hand-polished, last reviewed <date>` in the topic JSON's first `seo.description` line (purely as a marker; remove if validator complains).

Hand-polishing time per exemplar: 30-60 minutes. Across 18 non-Java exemplars (2 already exist for Java), budget 9-18 hours over a few sessions.

### Step 5 — Update prompt template to use language-specific exemplar

Edit `.cursor/content-factory/prompts/generate_qa.md` to add a new placeholder block: `{{IDIOMS_DOC}}`. Update factory.sh to populate it from `taxonomy.yaml`'s `languages.<slug>.idioms_doc`. Re-test the dry-run rendering.

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
bash .cursor/content-factory/factory.sh --dry-run \
  .cursor/content-factory/queues/exemplar_python_decorators-and-context-managers.txt | \
  grep -c "idioms/python.md"
```

**Expected output:** `1` (or higher), confirming the prompt now references the language idiom guide.

### Step 6 — Spot-check anti-Java-flavor

For each non-Java exemplar, run a content fingerprint check that flags Java-isms:

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

python3 - <<'PY'
import json, re
from pathlib import Path

JAVA_ISMS = {
    "python": [r"Optional<", r"\bfinal\b", r"\bpublic class\b", r"\bprivate \w+ \w+;"],
    "javascript": [r"Optional<", r"\bpublic class\b", r"@Override"],
    "go": [r"\btry\b\s*\{", r"\bcatch\b", r"\bclass\b\s+\w+\s*\{", r"Optional<"],
    "ruby": [r"\bclass\s+\w+\s*\{", r"Optional<", r"final\s+\w+"],
    "rust": [r"\bclass\b", r"Optional<", r"\bnew\s+\w+\s*\("],
}

for lang, isms in JAVA_ISMS.items():
    base = Path(f".cursor/content-factory/exemplars/{lang}")
    if not base.exists(): continue
    for f in base.glob("*.json"):
        text = f.read_text()
        for ism in isms:
            if re.search(ism, text):
                print(f"[FAIL] {f}: matched Java-ism /{ism}/")

print("done")
PY
```

**Expected output:** `done` with zero `[FAIL]` lines. Each `[FAIL]` represents a hand-polish miss; fix and rerun.

### Step 7 — UI smoke test

This playbook does not write into `content/`, only into `.cursor/content-factory/exemplars/`. So `npm run build` should not change behavior.

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

**Expected output:** exit 0.

### Step 8 — Commit each language exemplar

Commit per language so any rollback is granular.

**Command (per language):**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
LANG=python
git add .cursor/content-factory/idioms/${LANG}.md \
        .cursor/content-factory/exemplars/${LANG}/
git commit -m "factory(exemplars): ${LANG} idiom guide + 2 polished exemplars"
```

**Expected output:** 9 commits across the 9 non-Java languages (java already has exemplars from playbook 51).

### Step 9 — Mark playbook 53 DONE

**Command:**

```bash
# Edit expansion-plan/00-INDEX.md to flip Status for row 53
git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 53-per-language-exemplar-program DONE"
```

## Copy-paste templates

### Idiom guide skeleton (per language)

```markdown
# <Language> Idiom Guide

> Source-of-truth conventions for content generated by InterviewExplainer's content factory.
> Version: <date>

## Authoritative style references

- <Official style guide URL 1>
- <Official style guide URL 2>

## Naming conventions

| Construct | Convention | Example |
|---|---|---|
| variables | snake_case | `user_count` |
| classes | PascalCase | `UserService` |
| constants | UPPER_SNAKE | `MAX_RETRIES` |

## Idiomatic error handling

(language-specific paragraph)

## Anti-patterns — NEVER produce these

### Anti-pattern: Using `Optional<T>` syntax

WRONG (Java-flavored):
\`\`\`python
def find_user(id) -> Optional<User>:
    ...
\`\`\`

RIGHT (Pythonic):
\`\`\`python
def find_user(id: int) -> User | None:
    ...
\`\`\`

(repeat for 8-12 anti-patterns)

## Version notes

- <version delta 1>
- <version delta 2>

## Code-example formatting rules

(specific to language)
```

### Single-topic queue line

```
exemplars/<lang>/<topic-slug>|<layout_type>|<q_count>|<base_exemplar>
```

`base_exemplar` is the seed exemplar to imitate for shape; the idiom doc steers the actual code style.

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Idiom guide exists per language | 10 files | `ls .cursor/content-factory/idioms/ \| wc -l` returns ≥ 10 |
| Each idiom guide ≥ 150 lines | length check | `wc -l .cursor/content-factory/idioms/*.md \| awk '$1<150{print $2}'` returns empty |
| Each language has ≥ 2 exemplars | count check | `for L in python javascript typescript go ruby csharp php rust kotlin; do echo -n "$L "; ls .cursor/content-factory/exemplars/$L/*.json 2>/dev/null \| wc -l; done` |
| Every exemplar passes validator | exit 0 | loop over all exemplar files |
| No Java-isms in non-Java exemplars | step-6 check returns no `[FAIL]` | step-6 script |
| `frontend/` clean | empty diff | `git diff --name-only HEAD~10 HEAD \| grep '^frontend/'` empty |
| Build still passes | exit 0 | `cd frontend && npm run build` |
| Prompt template references `{{IDIOMS_DOC}}` | grep | `grep -c '{{IDIOMS_DOC}}' .cursor/content-factory/prompts/generate_qa.md` ≥ 1 |

## Failure modes & rollback

- **Generated exemplar fails Java-isms check repeatedly**: the language's idiom guide is too thin. Add 4-6 more anti-patterns with concrete RIGHT/WRONG code, then regenerate. Do NOT mark playbook DONE while Java-isms persist.
- **Hand-polish takes >2h per exemplar**: the topic chosen is too broad. Narrow it (e.g. "Python decorators" instead of "Python decorators and context managers"); regenerate.
- **Validator fails after hand-polish edits**: you accidentally violated word counts or section requirements. Run validator and fix listed pointers.
- **Branch grows >50 commits**: that's fine — keep going, but at the end consider `git rebase -i` to squash exemplar commits if desired (NOT in this playbook; this playbook does NOT rebase).
- **Cursor-agent costs balloon**: each exemplar pair is ~6 questions × ~3000 tokens = ~36k tokens; full pair generation is bounded. If costs spike, you're regenerating instead of hand-polishing — switch to manual editing for the failing exemplar.

## Definition of Done

- [ ] 10 idiom guides exist (one per language) under `.cursor/content-factory/idioms/`.
- [ ] Each language directory under `.cursor/content-factory/exemplars/<lang>/` has ≥ 2 files (Java already has 3 from playbook 51).
- [ ] Every exemplar passes `validate_qa.py`.
- [ ] Java-ism fingerprint check (step 6) reports zero failures.
- [ ] Prompt template `generate_qa.md` includes `{{IDIOMS_DOC}}` placeholder.
- [ ] `factory.sh` populates `{{IDIOMS_DOC}}` from `taxonomy.yaml`.
- [ ] `npm run build` exits 0.
- [ ] No edits in `frontend/`, `backend/`, `content/`.
- [ ] All 8 quality gates pass.
- [ ] `00-INDEX.md` row for `53` flipped to `DONE`.

## Estimated effort

- **Ideal:** 14 hours. (1h idiom-guide research per language × 10 = 10h; 30min hand-polish per exemplar × 18 exemplars = 9h... in practice agents and humans share these steps.)
- **Hard stop:** 28 hours spread across multiple agent sessions. Use the handoff skill (`.cursor/skills/handoff/SKILL.md`) to break this into per-language sessions if needed; each language is independent and can be split.
- **Recommended split:** 2-3 languages per agent session to keep context windows healthy.
