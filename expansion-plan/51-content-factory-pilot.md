# 51 — Content Factory Pilot

> **Executor:** AI coding agent operating autonomously.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** infrastructure scaffold + 3-topic content pilot. No frontend edits.

## TL;DR

- **Input:** Working JBI flagship at `content/java-backend-intermediate/core-java/java-io-nio/complete-qa.json` (the gold standard exemplar). The schema/pillar work from playbooks 06-08 is DONE. The PBI shell at `content/python-backend-intermediate/` exists with mostly empty topic folders.
- **Action:** Build `.cursor/content-factory/` containing JSON Schema validator, prompt template, gold-standard exemplars, and orchestrator script. Then run a **3-topic pilot** that generates real `complete-qa.json` files for thin PBI topics, validates every output, and commits to a dedicated branch.
- **Output:** A production-ready content pipeline that all downstream playbooks (52-80) reuse, plus 3 validated PBI topics (~10-12 Qs total) demonstrating Java-parity quality on the Python side.

## Hard prerequisites

- [ ] Playbook 06 DONE (`content-schema-and-qa-format.md`) — schema documented.
- [ ] Playbook 07 DONE (`locked-domain-pattern.md`) — locked-domain registration pattern documented.
- [ ] `cursor-agent --version` returns 3.x and `cursor-agent status` shows authenticated.
- [ ] `python3 --version` >= 3.11.
- [ ] `git status` clean (no uncommitted changes on main or feature branches).
- [ ] At least one git remote configured (we never push, but commits need a tracked destination).

## Why this matters (2 sentences)

Playbooks 12-18, 30-35, and every Wave G language track (56-65) all say "fill content to N Q" without defining how. Without this pipeline, each fill-playbook becomes 80-160 hours of hand-execution; with it, the same playbook becomes ~12 hours of supervised auto-generation against a strict validator.

## Background context the executing agent must read first

| Path | Why |
|---|---|
| `content/java-backend-intermediate/core-java/java-io-nio/complete-qa.json` | The gold-standard exemplar. The bar for every Q produced by this pipeline. |
| `content/java-backend-intermediate/microservices/contract-testing/complete-qa.json` | Reference for the `architecture_diagram` (mermaid) section type. |
| `content/java-backend-intermediate/_index.json` | JBI module registry — confirms how `_index.json` documents pillar groupings. |
| `content/python-backend-intermediate/_index.json` | PBI shell — destination tree for pilot output. |
| `content/python-backend-intermediate/core-python/_config.json` | How a module is configured. |
| `frontend/lib/content-reader.ts` (skim only, no edits) | Confirms `LOCKED_DOMAINS` registration; do not break the contract. |
| `frontend/lib/seo-slugs.ts` (skim only) | Confirms the SEO slug mapping pattern. |

## Execution steps

### Step 1 — Create the dedicated factory branch

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
TODAY=$(date +%F)
git switch -c "content-factory/${TODAY}"
```

**Expected output:** `Switched to a new branch 'content-factory/<YYYY-MM-DD>'`.

**If it fails:** Branch already exists → `git switch content-factory/<YYYY-MM-DD>` (reuse). Or pick a unique slug: `content-factory/${TODAY}-pilot`.

### Step 2 — Create the directory layout

**Command:**

```bash
mkdir -p .cursor/content-factory/{schemas,exemplars,prompts,queues,runs,lib}
ls -la .cursor/content-factory/
```

**Expected output:** Six subdirectories listed: `exemplars`, `lib`, `prompts`, `queues`, `runs`, `schemas`.

### Step 3 — Write the JSON Schema

Write `.cursor/content-factory/schemas/complete_qa.schema.json` (Draft-07) covering:

- Top-level required: `topic`, `topicSlug`, `questions[]`.
- Per-question required: `id`, `slug`, `question`, `title`, `direct_answer`, `layout_type`, `difficulty`, `importance`, `reading_time_minutes`, `interviewer_intent`, `company_tags` (minItems 3), `answer.sections[]` (minItems 4), `seo`, `order`.
- `direct_answer` minLength 200.
- `interviewer_intent` requires `testing` / `common_mistake` / `to_stand_out`, each minLength 30.
- `seo.metaTitle` 30-75 chars; `seo.metaDescription` 60-200 chars.
- Section `type` enum: `overview`, `step`, `key_points`, `speakable_answer`, `tradeoffs`, `comparison_table`, `code_example`, `architecture_diagram`, `when_to_use`, `component`, `reference_group`, `phase`.
- `layout_type` enum from observed corpus: `default`, `concept-explainer`, `comparison-arena`, `comparison-explainer`, `recipe-builder`, `scenario-walkthrough`, `reference-cards`, `sql-playground`, `problem-detective`, `concept-deep-dive`. **Do NOT add new layout types** — adding a new value breaks the renderer.
- `id` and `slug` patterns: `^[a-z0-9]+(-[a-z0-9]+)*$`.

### Step 4 — Copy gold-standard exemplars

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
cp content/java-backend-intermediate/core-java/java-io-nio/complete-qa.json \
   .cursor/content-factory/exemplars/java-io-nio.json

cp content/java-backend-intermediate/microservices/contract-testing/complete-qa.json \
   .cursor/content-factory/exemplars/contract-testing.json

# Find a comparison-arena layout and copy it
COMPARISON_FILE=$(rg -l '"layout_type": "comparison-arena"' content/java-backend-intermediate/ | head -1)
cp "$COMPARISON_FILE" .cursor/content-factory/exemplars/comparisons.json

ls -la .cursor/content-factory/exemplars/
```

**Expected output:** Three files listed: `comparisons.json`, `contract-testing.json`, `java-io-nio.json`.

**If it fails:** No comparison-arena file exists → use any other layout file from `content/java-backend-intermediate/core-java/comparisons/complete-qa.json`. Annotate in comments which exemplar covers which layout.

### Step 5 — Build the validator

Write `.cursor/content-factory/lib/validate_qa.py`. Python stdlib only (no pip installs). Required checks:

1. **JSON Schema**: load `schemas/complete_qa.schema.json` and re-implement Draft-07 `required` / `enum` / `minLength` / `maxLength` / `minItems` / `pattern` checks. Do NOT pull in the `jsonschema` package.
2. **Section presence**: every Q must contain ≥1 `overview`, ≥2 `step`, ≥1 `key_points`, ≥1 `speakable_answer`.
3. **Word counts**:
   - `direct_answer`: 80-200 words.
   - each `overview` content: ≥150 words.
   - each `step` content: ≥120 words.
   - `key_points` content: ≥6 lines starting with `-`.
   - `speakable_answer` content: 250-700 words AND no `|` characters AND no triple-fence code blocks.
4. **Code-block parity**: every triple-fence opener has a matching closer.
5. **Mermaid syntax**: `architecture_diagram` content starts with ` ```mermaid`, contains one of `flowchart`, `sequenceDiagram`, `graph`, `classDiagram`, `stateDiagram`, ends with ` ``` `.
6. **Company tags**: ≥3 entries, each ≥2 chars.
7. **SEO**: `metaTitle` 30-75; `metaDescription` 60-200.
8. **IDs/slugs**: kebab-case `^[a-z0-9]+(-[a-z0-9]+)*$`.

CLI shape:

```bash
python3 .cursor/content-factory/lib/validate_qa.py path/to/complete-qa.json
```

Exit 0 with `OK` on success; exit non-zero with one `[FAIL] <pointer>: <reason>` line per violation.

**Expected output after writing:** running on `java-io-nio.json` returns `OK`.

### Step 6 — Write the prompt template

Write `.cursor/content-factory/prompts/generate_qa.md`. Placeholders: `{{TOPIC_SLUG}}`, `{{TOPIC_TITLE}}`, `{{DOMAIN_PATH}}`, `{{TARGET_PATH}}`, `{{Q_COUNT}}`, `{{LAYOUT_TYPE}}`, `{{LANGUAGE}}`, `{{EXEMPLAR_PATH}}`.

The prompt must instruct the executing sub-agent to:

1. Read `{{EXEMPLAR_PATH}}` end-to-end.
2. Read `.cursor/content-factory/schemas/complete_qa.schema.json`.
3. Generate `{{Q_COUNT}}` substantive questions for `{{TOPIC_TITLE}}` aimed at the same depth as the exemplar.
4. Each Q must include the four core section types (overview, ≥2 step, key_points, speakable_answer) plus one or more of {tradeoffs, comparison_table, code_example, architecture_diagram} where appropriate.
5. Code examples must be real, runnable, version-correct for `{{LANGUAGE}}`. No `// ...` placeholders.
6. `speakable_answer` must be TTS-safe: paragraphs and bullets only, no tables, no fenced code, no markdown links.
7. Write to `{{TARGET_PATH}}`.
8. Run `python3 .cursor/content-factory/lib/validate_qa.py {{TARGET_PATH}}`. If it fails, fix violations and re-run, max 3 attempts. If still failing, save as `{{TARGET_PATH}}.failed.json` with the validator output appended at the top.

The prompt also lists hard anti-patterns:

- No fabricated method names or framework features.
- No "etc." in code examples.
- No markdown tables in `speakable_answer`.
- No copy-paste from exemplar — every Q is original content.

### Step 7 — Build the orchestrator (factory.sh)

Write `.cursor/content-factory/factory.sh`. Behavior:

- `bash factory.sh <queue-file>` reads each queue line.
- Queue line format: `<domain>/<module>/<topic>|<layout_type>|<q_count>|<exemplar_basename>`.
- For each line: substitute placeholders into the prompt template, save to `runs/<ts>/<topic-slug>.prompt.txt`.
- `--dry-run` flag prints rendered prompts and exits without invoking cursor-agent.
- On real run: `cursor-agent -p --workspace . --trust --force "$(cat <prompt>)"` with stdout teed to `runs/<ts>/<topic-slug>.log`.
- After cursor-agent exits: run validator. If pass → commit with message `factory: <topic> (passed validator)`. If fail → retry up to 2x with validator output appended to the prompt; if still failing, log to `runs/<ts>/FAILED.txt` and continue to next topic.
- Stop conditions: end of queue, `runs/<ts>/.stop` file appears, 3 consecutive validator failures across topics.
- Final action: write `runs/<ts>/MANIFEST.json` with totals (passed, failed, skipped, est tokens, wall time).
- Make script executable: `chmod +x .cursor/content-factory/factory.sh`.

### Step 8 — Create the pilot queue

Write `.cursor/content-factory/queues/pilot.txt`:

```
python-backend-intermediate/core-python/string-handling|concept-explainer|4|java-io-nio.json
python-backend-intermediate/core-python/exception-handling|concept-explainer|4|java-io-nio.json
python-backend-intermediate/core-python/comparisons|comparison-arena|3|comparisons.json
```

If any pilot path already has a non-empty `complete-qa.json`, **do not overwrite**. Append `.pilot.json` to the new file path and note in the report that the existing one was preserved for diff comparison.

Write `.cursor/content-factory/queues/README.md` documenting the pipe-delimited line format.

### Step 9 — Run pilot in DRY_RUN mode

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
bash .cursor/content-factory/factory.sh --dry-run .cursor/content-factory/queues/pilot.txt
```

**Expected output:** Three rendered prompts printed to stdout. Each prompt has all placeholders substituted (no `{{` remains). No API credits spent.

**If it fails:** Placeholder substitution leaves `{{` in output → fix the sed/envsubst logic in factory.sh.

### Step 10 — Run pilot for real

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
bash .cursor/content-factory/factory.sh .cursor/content-factory/queues/pilot.txt 2>&1 | tee .cursor/content-factory/runs/$(date +%Y-%m-%dT%H%M)/wall.log
```

**Expected output:** Per topic: cursor-agent invocation logs, validator output, git commit message. Wall time 30-60 minutes total. Final manifest printed.

**If it fails:** cursor-agent rate limit → wait and resume; queue is idempotent. Validator fails 3x for one topic → that topic's `.failed.json` is created; continue to next topic.

### Step 11 — Manual quality review

For each pilot topic, diff the generated file against `java-io-nio.json` on these dimensions:

- Section count and types.
- Word counts per section.
- Code example quality (compiles? real APIs?).
- Speakable answer fluency.
- SEO meta length.
- Mermaid validity (if any).

Note 2-3 quoted snippets that fall short of the exemplar bar.

### Step 12 — Write the quality report

Write `.cursor/content-factory/runs/<YYYY-MM-DDTHHMM>/QUALITY_REPORT.md`. Required sections:

1. **Topics attempted** (table: slug | layout | q_count | validator_status | wall_time).
2. **Strengths observed** (concrete examples).
3. **Weaknesses observed** (2-3 quoted snippets that fell short).
4. **Recommended prompt-template tightenings** (specific edits to `prompts/generate_qa.md`).
5. **Estimated cost extrapolation** (at observed avg tokens/Q, 10,000 Qs would cost $X).
6. **Go / no-go for scaling** (honest assessment).

### Step 13 — UI smoke test

The most important regression check. Confirms no UI breaks despite new content.

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build
```

**Expected output:** exit 0, no TypeScript errors.

Then manually:

1. Open `/domains` — every card with `hasContent: true` opens a real page.
2. Open one of the new PBI topic pages end-to-end. Verify: prev/next sidebar nav works, code blocks render, mermaid renders (if present), no console errors.
3. Open one existing JBI topic page (e.g. `/java-interview-questions/core-java/java-io-nio`) — confirm zero regression.

**If any UI test fails:** STOP. Roll back the pilot commits with `git restore content/python-backend-intermediate/core-python/`. Do not mark playbook DONE. Open an issue with the broken page screenshot.

### Step 14 — Commit and update INDEX

**Command:**

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
git add .cursor/content-factory/ content/python-backend-intermediate/core-python/
git commit -m "factory: complete v1 pilot — 3 PBI topics validated"

# Mark playbook 51 DONE in the index
# Edit expansion-plan/00-INDEX.md to flip Status for row 51
git add expansion-plan/00-INDEX.md
git commit -m "docs(expansion-plan): mark 51-content-factory-pilot DONE"
```

**Expected output:** Two commits on `content-factory/<date>` branch.

## Copy-paste templates

### Schema skeleton

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "InterviewExplainer complete-qa.json",
  "type": "object",
  "required": ["topic", "topicSlug", "questions"],
  "properties": {
    "topic": { "type": "string", "minLength": 2 },
    "topicSlug": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" },
    "questions": {
      "type": "array",
      "minItems": 1,
      "items": { "$ref": "#/definitions/question" }
    }
  },
  "definitions": { "question": {  }, "section": {  } }
}
```

(See [content/java-backend-intermediate/core-java/java-io-nio/complete-qa.json](../content/java-backend-intermediate/core-java/java-io-nio/complete-qa.json) for the full structure.)

### Validator skeleton

```python
#!/usr/bin/env python3
"""Stdlib-only validator for complete-qa.json files."""
import json, re, sys
from pathlib import Path

def word_count(text: str) -> int:
    return len(re.findall(r"\S+", text))

def validate_q(q: dict, errors: list) -> None:
    pass

def main(path: str) -> int:
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    errors: list[str] = []
    for q in data.get("questions", []):
        validate_q(q, errors)
    if errors:
        for e in errors:
            print(f"[FAIL] {e}")
        return 1
    print("OK")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
```

### Prompt template skeleton

```markdown
You are generating one `complete-qa.json` topic file for InterviewExplainer.

## Target

- Topic: {{TOPIC_TITLE}} ({{TOPIC_SLUG}})
- Domain path: {{DOMAIN_PATH}}
- Output path: {{TARGET_PATH}}
- Questions to write: {{Q_COUNT}}
- Layout: {{LAYOUT_TYPE}}
- Language: {{LANGUAGE}}

## Required reading

1. Schema: `.cursor/content-factory/schemas/complete_qa.schema.json`.
2. Exemplar: `{{EXEMPLAR_PATH}}` — match this depth and quality.

## Hard rules

(see playbook 51 step 6)
```

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| Schema validator passes on every pilot file | exit 0 for all 3 | `for f in <pilot files>; do python3 .cursor/content-factory/lib/validate_qa.py "$f" \|\| break; done` |
| Each Q has ≥4 answer sections | all Qs | manual count |
| Each Q's `speakable_answer` is 250-700 words and contains no `|` | all Qs | validator |
| Each pilot file matches exemplar depth manually | reviewer judgement | quality report section 3 |
| `frontend/` builds clean | exit 0 | `cd frontend && npm run build` |
| `/domains` opens every card without 404 | manual UI check | step 13 |
| No edits to `frontend/`, `backend/`, `node_modules/`, `*.zip` | clean diff | `git diff --name-only main...HEAD \| grep -v -E '^(\.cursor/content-factory/\|content/\|expansion-plan/00-INDEX)'` returns empty |

## Failure modes & rollback

- **Validator passes but quality is poor** (LLM slop, fabricated APIs): roll back commits, tighten `prompts/generate_qa.md` per the report's recommendations, rerun pilot. Do NOT mark playbook DONE.
- **`npm run build` breaks**: roll back content commits with `git restore content/python-backend-intermediate/core-python/` and the schema/validator commits if they too caused issues. Open an issue for the breaking change.
- **cursor-agent runs out of credits mid-pilot**: queue is idempotent — fix billing, rerun `bash factory.sh queues/pilot.txt`. Existing passed topics will skip on detection of an existing valid output file.
- **Wall-time blow past 12h**: STOP. Pilot is too ambitious. Reduce queue to 1 topic and try again.

## Definition of Done

- [ ] `.cursor/content-factory/` exists with all subdirectories populated.
- [ ] `validate_qa.py` returns OK on the existing `java-io-nio.json` exemplar.
- [ ] Three pilot `complete-qa.json` files exist under `content/python-backend-intermediate/core-python/`.
- [ ] Each pilot file passes the validator.
- [ ] `runs/<ts>/QUALITY_REPORT.md` exists with all 6 required sections.
- [ ] `npm run build` exits 0.
- [ ] No edits outside the allowed paths (per quality gate).
- [ ] All 7 quality gates pass.
- [ ] Three commits on `content-factory/<date>` branch (factory artifacts, pilot content, INDEX update).
- [ ] `00-INDEX.md` row for `51` flipped to `DONE`.

## Estimated effort

- **Ideal:** 6 hours (3h to build pipeline, 1h for pilot generation, 1h review, 1h smoke test).
- **Hard stop:** 12 hours. If exceeded, the prompt template is producing slop or the validator is missing rules; surface to user with the failing topic + validator output appended to a fresh handoff snapshot.
