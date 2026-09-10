# Q-file Schema — `complete-qa.json`

The canonical shape for every `complete-qa.json` under `content/`.
Machine-checked by `scripts/validate_complete_qa.py` against
`content/_schemas/complete-qa.schema.json`.

## Top-level shape

```json
{
  "topic":     "Exception Handling",
  "topicSlug": "exception-handling",
  "questions": [ /* array of question objects */ ]
}
```

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `topic` | string | yes | Human-readable topic name |
| `topicSlug` | string | yes | kebab-case (`^[a-z0-9][a-z0-9-]*$`) |
| `questions` | array | yes | One or more question objects |

## Question shape

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `id` | string | yes | kebab-case, unique within the topic |
| `slug` | string | yes | Same as `id`, used in URL |
| `question` | string | yes | The interview question text |
| `title` | string | yes | SEO-friendly title (5–220 chars) |
| `direct_answer` | string | yes | Hero paragraph — ≥ 40 chars |
| `interviewer_intent` | object | yes | See below |
| `answer` | object | yes | Contains `sections[]` |
| `followup_questions` | array | yes | Plain-text follow-ups |
| `seo` | object | yes | `metaTitle` + `metaDescription` |
| `difficulty` | enum | no | `easy`, `medium`, `hard`, `intermediate` |
| `importance` | enum | no | `low`, `medium`, `high` |
| `layout_type` | string | no | Renderer hint |
| `reading_time_minutes` | integer | no | Estimated read time |
| `last_updated` | string | no | `YYYY-MM-DD` |
| `company_tags` | string[] | no | Companies that ask this Q |
| `order` | integer | no | Display order within topic |

## `interviewer_intent` shape

```json
{
  "testing":        "Whether the candidate understands X",
  "common_mistake": "Saying Y without explaining Z",
  "to_stand_out":   "Mention the production failure mode named W"
}
```

`testing` is required. `common_mistake` and `to_stand_out` are optional
but expected in every JBI-quality question.

## Section types

Each entry in `answer.sections[]` has a `type` field that the renderer
dispatches to a specific component.

| Type | Purpose |
| ---- | ------- |
| `overview` | Short intro paragraph |
| `speakable_answer` | Voice-overlay text — reads aloud naturally |
| `step` | Numbered step list with optional code |
| `comparison_table` | Markdown table comparing 2+ options |
| `tradeoffs` | When-to-use / when-to-avoid block |
| `key_points` | Bulleted summary |
| `phase` | Phase-of-work block (setup → run → cleanup) |
| `before_code` / `after_code` | Paired diff-style examples |
| `code_example` | Standalone code block |
| `code` | Inline code (backwards compat) |
| `architecture_diagram` | Architecture visual |
| `mermaid` | Embedded mermaid diagram |
| `concept_map` | Concept relationship map |
| `interviewer_expectation` | What the interviewer wants to hear |
| `deep_explanation` | In-depth technical section |
| `when_to_use` | Specific use-case guidance |
| `diagnosis` | Debugging / root-cause walkthrough |
| `component` | Component-level detail |
| `explanation` | General explanation block |
| `warning` | Production gotcha / anti-pattern |
| `tip` | Quick actionable tip |
| `important_points` | Key callouts |
| `common_mistakes` | Named anti-patterns |
| `recipe` | Step-by-step recipe |
| `practice_prompt` | Coding practice prompt |
| `requirements` | Requirement list |
| `approach` | Solution approach block |
| `problem_statement` | Problem context |
| `reference_group` | Reference links group |
| `design_diagram` | Design-level visual |
| `sample_data` | Sample input/output |
| `query_example` | SQL/query example |
| `diagram` | Generic diagram |
| `sequence_diagram` | Sequence flow visual |
| `decision_tree` | Decision flowchart |
| `followup_questions` | Follow-up Q block (rare — usually top-level) |

## Per-archetype required sections

Archetypes A–G are defined in `docs/speakable/archetypes.md`.
Minimum section requirements per archetype:

| Archetype | Required section types |
| --------- | ---------------------- |
| A — What is X? | `overview`, `speakable_answer`, `key_points` |
| B — Compare X vs Y | `overview`, `comparison_table`, `speakable_answer` |
| C — How does X work? | `overview`, `step`, `speakable_answer` |
| D — Debug/fix scenario | `overview`, `diagnosis`, `speakable_answer` |
| E — When would you use X? | `overview`, `when_to_use`, `speakable_answer` |
| F — Design question | `overview`, `architecture_diagram`, `speakable_answer` |
| G — Code/implement X | `overview`, `code_example`, `speakable_answer` |

## Voice rules (mandatory for every section)

1. `speakable_answer` content reads aloud naturally — contractions, ≤ 16-word sentences.
2. No banned vocabulary: `leverage`, `utilize`, `battle-tested`, `seamless`, `robust`,
   `holistic`, `synergize`, `world-class`, `cutting-edge`, `paradigm`.
3. Every claim that could fail in production has a named failure mode.
4. Depth marker required: name the bug, the gotcha, or the rethink_if.

## Validating locally

```bash
# Install once
pip install jsonschema>=4.21

# Validate all files
python3 scripts/validate_complete_qa.py

# Validate one file
python3 scripts/validate_complete_qa.py content/java-backend-intermediate/core-java/exception-handling/complete-qa.json
```

Exit code 0 = all files valid. Exit code 1 = schema drift found.

## Schema file location

`content/_schemas/complete-qa.schema.json` — JSON Schema Draft 2020-12.
Do not edit the schema directly; changes require a schema-version playbook.
