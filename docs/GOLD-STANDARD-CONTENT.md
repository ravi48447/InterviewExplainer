# Gold-standard learning content

The learning page has one journey and exactly three learner-facing zones:

**Recall → Explain → Understand**

This contract applies to every technology domain. The zones are independent: a
learner may open any one directly, so it must name and answer the real question
without requiring another zone. Depth changes with the question; the purpose of
each zone does not.

## 1. Quick revision

Quick revision is memory support, not a second Deep Dive.

- Answer the exact question in the first sentence.
- Keep one compact definition or decision and only the recall points needed to
  remember it correctly.
- Include the important boundary that prevents a common wrong answer.
- Prefer familiar technical words over SEO phrasing.
- Do not include coaching such as “say this in the interview.”

A small syntax rule may need one fact and one example. A system-design decision
may need several recall points. There is no universal word or bullet count.

## 2. Interview answer

The interview answer is the complete answer a learner can understand, practise, and adapt. It must teach the content rather than describe how to answer.

A strong answer selects the parts the question needs:

1. Direct definition or decision.
2. Meaning or mechanism.
3. One concrete example.
4. When the idea matters.
5. One boundary, failure mode, or trade-off.
6. A concise conclusion.

Use short connected paragraphs or bullets when they reduce reading strain. Do not
add labels such as “first I would say” or “to impress the interviewer.” Do not
force a fixed speaking duration or word range: an atomic question should finish
once its rule and example are clear, while an implementation or architecture
question must continue until its flow, example, boundary, and result are complete.

### Interview presentation contract

The answer is a continuous guided article, not an unbroken transcript and not a
grid of equal-looking cards. Gold-reference questions use authored
`speakable_answer.beats` so that structure comes from the meaning of that exact
question rather than keyword guessing in the UI.

- Each beat owns one connected idea and uses a concept-specific heading. Prefer
  “Scope decides `:=` or `=`” to generic labels such as “Point 3” or “Example.”
- Ordinary explanation stays as readable prose on one article spine. A support
  block is added only when it teaches faster than another paragraph.
- Put runnable or traceable code in a `code` support block instead of packing
  several code expressions into a long paragraph.
- Keep a method name, operator, annotation, command, or one short expression
  inline beside the sentence that explains it. Once the learner must follow two
  or more lines, move that evidence into a code block with a clear title.
- For implementation and language-behaviour questions, include a minimal complete
  program when running the whole example teaches something that isolated snippets
  cannot. Explain the important snippets in the prose as well; a large code block
  must never replace the definition or mechanism.
- Use `comparison` for real alternatives, `trace` for an ordered flow, and
  `checklist` for genuine rules or conditions. These are evidence, not decoration.
- Select diagrams per question. A lifecycle, request path, ownership change, or
  branching decision benefits from a visual; a small syntax definition often does
  not. Never add the same diagram shape merely because another question used it.
- A working-concept answer normally needs one or two supports; a small definition
  may need none. Do not create one coloured card for every paragraph.
- Keep the comprehensive program, full diagram, extended pitfalls, and exercises
  in Deep Dive. The Interview answer uses the smallest evidence needed to make its
  explanation complete and memorable.
- `content` is the plain fallback and is generated from the beat text. It must not
  drift into a second, conflicting answer.

The schema accepts one or more beats; it does not impose a paragraph count or a
speaking-duration quota. The correct count is the smallest number of distinct
ideas needed to answer the question completely.

## 3. Deep Dive

Deep Dive is a self-contained mini lesson. It teaches the learner from the
beginning as a coherent article, not as a wall of unrelated cards. Blocks are
selected by meaning, not by a fixed template.

Useful blocks include:

- mental model or definition;
- mechanism or lifecycle;
- semantic diagram or trace;
- comparison or decision boundary;
- worked example;
- common failure;
- short knowledge check.

A visual is used only when it explains a relationship, sequence, state change,
ownership, or decision more clearly than prose. Code is used only when the learner
needs to see language behavior, implementation, a query, or a real wrong/right
pattern. No question has a universal requirement for code, a diagram, a table, or
a particular block type. Decorative concept-card grids do not count as teaching
visuals.

## Adaptive depth

Decide how much content a question needs before writing it:

- **Atomic:** a definition, syntax rule, annotation, or small distinction. Give the
  exact rule, one useful example, and the important boundary, then stop.
- **Working concept:** a mechanism, comparison, API, data structure, or test
  choice. Explain its behavior, demonstrate it, and cover the main failure or
  decision boundary.
- **System:** an implementation, lifecycle, debugging scenario, security flow, or
  architecture decision. Trace it end to end, cover failure behavior, and show how
  the result is verified.

Completeness is measured by the learner outcome, never by word count, number of
headings, or number of artifacts.

## Content rules

- One canonical question owns the answer. Other routes must resolve to that source instead of keeping divergent copies.
- Facts are checked against official specifications, standards, or product documentation where those exist. Tutorial sites may guide familiar vocabulary, but they are not the authority for disputed facts and their wording is not copied.
- Examples must be runnable or mechanically traceable with the language, framework, protocol, or database version they claim to teach. Pseudocode is labelled.
- The three zones must share the central truth while adding depth rather than repeating identical sentences or paragraphs.
- Use simple, familiar language. Introduce the common name first and define any unavoidable internal term where it appears.
- Preserve stable question IDs, slugs, curriculum order, canonical routes, and existing file shape during content improvement unless a separately reviewed catalog migration explicitly changes them.
- Question titles describe the real concept. Generated shells such as “How would you compare X with an alternative?” are not gold-standard questions.
- Reading time is derived from useful content and must never display an invalid range such as `6–5 min`.

## Approved reference set

The machine-readable reference set lives in `content/gold-standard.json`. It intentionally covers different domains and answer shapes before any broad migration is attempted. Every reference must pass `npm run audit:gold-content`.

## Release gates

Content is not complete merely because every file that exists passes an answer check. A domain is ready only when all of these gates pass:

- `npm run audit:answers -- --strict <domain-root>` checks the three learning zones, question-driven examples, filler, coaching language, and repetition inside each lesson.
- `npm run audit:answer-quality -- --domain=<domain-slug> --module=<module-slug> --topic=<topic-slug> --strict` checks exact zone ownership, empty content, generic openings, sibling duplication, copied code/supports, and cross-zone reuse for one independently reviewed batch. It is a risk detector, not a substitute for fact checking.
- `npm run audit:java-fresher` reports code and visual opportunities as editorial review signals; it does not force an artifact into a lesson when prose is clearer.
- `npm run audit:catalog -- --strict <domain-root>` checks that every indexed topic has content, no active module or topic is orphaned, no generated shell question remains, and IDs, slugs, questions, and long answer bodies are not duplicated.
- `npm run audit:content-sources` proves that registered domains have one active source and that legacy redirects reach a canonical question.
- `npm run audit:gold-content` protects the cross-domain reference lessons.
- Every executable example is parsed and run with the language or framework version it claims to teach; relationship and process visuals are reviewed against the explanation rather than counted as decoration.
- Automated presence and length checks are warning signals, not proof of quality. Each question also receives semantic review for exactness, simple language, factual accuracy, independent zones, and artifact value.
