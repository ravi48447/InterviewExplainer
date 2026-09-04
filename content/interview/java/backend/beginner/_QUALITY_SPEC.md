# Java Backend Fresher (JBF) — Answer Quality Spec

This is the **Definition of Done** for every JBF question. Goal: lift all ~1,552 JBF
questions to the depth/structure of `java-backend-intermediate` (JBI) and `/dsa`, at
**fresher depth** (0–2 YOE; clear, grounded, internet-familiar definitions —
GeeksforGeeks / Baeldung level — not staff-level).

## Gold reference (READ THIS FIRST)

Open and study this file — it is the structural template:

`content/java-backend-intermediate/java-oop/oop-principles/complete-qa.json`
→ question slug `oop-four-pillars-java`.

It uses: `overview → concept_map → phase → before_code → after_code → ... → comparison_table → step → key_points → speakable_answer` with `layout_type: "article"`.

## File shapes (PRESERVE the existing shape)

Each topic = `content/java-backend-fresher/<module>/<topic>/complete-qa.json`. Two shapes exist:
- **dict shape**: `{ "topic": "...", "topicSlug": "...", "questions": [ ... ] }`
- **list shape**: a top-level JSON array of question objects.

Detect which shape the file already uses and KEEP it. Never change a file's shape.

## Per-question fields (keep all existing keys; upgrade these)

A question object has: `id, slug, question, title, direct_answer, layout_type,
difficulty, importance?, reading_time_minutes, last_updated, interviewer_intent,
company_tags, answer, followup_questions, seo, order, speakable_v2`.

Upgrade:
1. **`direct_answer`** — 2–3 sentences, **bold** the key terms, internet-familiar
   definition. No "Think of it like a combo meal" filler.
2. **`interviewer_intent`** — object `{testing, common_mistake, to_stand_out}`, tightened
   to a REAL fresher trap (not generic).
3. **`layout_type`** — set from the routing table below. NEVER leave `default` or
   `explanation`.
4. **`answer.sections`** — rebuild to match the archetype (see below).
5. **`followup_questions`** — 3 real interview threads (array of strings, or keep existing
   object shape if present).
6. **`speakable_v2.hook`** — must NOT be a copy of `direct_answer`. **`speakable_v2`** beats
   must be real spoken English (contractions OK, NO backticks, NO "at-RestController" — write
   "the at sign RestController annotation" or "RestController annotation").
7. Update `last_updated` to today's date (`2026-06-04`).

## Allowed `answer.sections[].type` (renderer-supported ONLY)

`overview`, `phase`, `step`, `code_example`, `before_code`, `after_code`,
`architecture_diagram`, `flow_diagram`, `sequence_diagram`, `concept_map`,
`comparison_table`, `key_points`, `common_mistakes`, `when_to_use`, `tradeoffs`,
`component`, `reference_group`.

Do NOT invent new types. Every section is `{ "type": "...", "title": "...", "content": "..." }`
(content is a string; for `key_points` content is a markdown bullet list string).

### Section format rules
- **code blocks** (`code_example`, `before_code`, `after_code`): content is a fenced
  block — ` ```java\n...code...\n``` ` — Java 17, runnable, with brief inline comments.
  Optional prose AFTER the closing fence renders as an italic note.
- **`before_code` + `after_code`**: MUST appear consecutively, immediately after the `phase`/
  `step`/`overview` they illustrate (the renderer groups trailing code blocks under the
  preceding main section and shows a "Without … vs … With" diff). Use them wherever a fresher
  writes the wrong pattern (e.g. `==` vs `.equals()`, public field vs getter, `Statement` vs
  `PreparedStatement`, field vs constructor injection, N+1 vs `JOIN FETCH`).
- **`concept_map`**: each line is `color|Title|~subtitle|point|point|point`. Colors:
  `amber|blue|emerald|violet|rose|cyan`. Use for hierarchies / "X at a glance".
- **`comparison_table`** / `step`: standard markdown tables (`| col | col |`).
- **Diagrams** (`architecture_diagram`, `flow_diagram`, `sequence_diagram`): content is a
  fenced ` ```mermaid\n...\n``` ` block (flowchart/sequenceDiagram). Use `<br/>` for line
  breaks inside nodes. Keep node labels short. One diagram per question max.
- **`speakable_answer`** section: 900–1400 chars spoken prose, no backticks, contractions OK.

## Archetype → layout_type → required sections

| Archetype | `layout_type` | Sections (in order) |
|---|---|---|
| What is X / how X works (concept) | `concept-explainer` | overview → (concept_map OR phase) → code_example → common_mistakes → key_points → speakable_answer |
| X vs Y (comparison) | `comparison-arena` | overview → comparison_table → before_code → after_code → when_to_use → key_points → speakable_answer |
| Steps / config / Maven / JUnit setup | `recipe-builder` | overview → step×N (or code_example) → common_mistakes → key_points → speakable_answer |
| Request/response or lifecycle flow | `lifecycle-timeline` | overview → flow_diagram (mermaid) → phase steps → key_points → speakable_answer |
| Architecture / "how does Spring …" | `architecture-map` | overview → architecture_diagram (mermaid) → phase → key_points → speakable_answer |
| SQL query | `sql-playground` | overview → code_example (query + sample output table) → common_mistakes → key_points → speakable_answer |
| LLD / design | `design-whiteboard` | overview → step → architecture_diagram → key_points → speakable_answer |
| DSA concept (in dsa modules) | `algorithm-workshop` | overview → flow_diagram → code_example (Java) → key_points → speakable_answer + `related_dsa_slug` |
| Behavioral / HR | `reference-cards` | overview → step (STAR example script) → key_points → speakable_answer |

Pick the archetype from the question wording. When unsure use `concept-explainer`.

## Quality bar (each upgraded question MUST)
- Have a non-`default`/`explanation` `layout_type`.
- Have ≥1 runnable Java 17 (or SQL) code block on any concept/coding question.
- Add `before_code` + `after_code` wherever a wrong→right pattern exists.
- Add ONE diagram (mermaid concept_map / flowchart) on flow/hierarchy questions.
- Have a `speakable_answer` section AND a `speakable_v2` whose `hook` ≠ `direct_answer`.
- Use internet-standard definitions; ≤1 analogy per answer.
- Be valid JSON (file parses) and preserve the file's original shape + all existing keys.

## DSA modules special rule (`dsa-fundamentals`, `problem-solving-patterns`)
For algorithmic topics that exist in `/dsa`, add a top-level `related_dsa_slug` on the
question pointing to the matching `content/dsa/.../` slug, keep a short verbal explanation +
a small Java snippet with a dry-run, and use `layout_type: "algorithm-workshop"`. Keep
~5–8 pure-concept questions verbal-only.

## Validation (run before finishing)
```
python3 scripts/validate_jbf.py content/java-backend-fresher/<module>/
```
Fix every CRITICAL it reports. Aim for 0 CRITICAL and minimal MODERATE.
