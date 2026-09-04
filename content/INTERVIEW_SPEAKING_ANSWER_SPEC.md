# Interview Speaking Answer — Content Contract

The speaking answer is a complete model answer that a learner can understand,
practise, and deliver naturally. It is not a second quick revision, a list of
instructions, or commentary about what an interviewer wants.

## Required shape

- Match the answer to the size of the concept. Use `compact` (120–220 words)
  for one-rule language topics, `standard` (220–360 words) for most interview
  concepts, and `deep` (360–460 words) only when the question genuinely needs
  architecture, trade-offs, or several interacting mechanisms.
- Write four to six connected speaking cues. Each cue contains a short cue
  label (normally 3–8 familiar words) and about 25–55 spoken words. The labels
  form a memory path; the spoken text must still sound like one answer when
  read continuously.
- Open by answering the exact question. Do not restate the prompt or add a
  preamble.
- Explain the meaning, purpose, and relevant mechanism in familiar language.
- Include one concrete, topic-correct example and explain what happens in it.
- State practical usage: when the approach is a good fit and when another
  choice is clearer or safer.
- Include one real mistake, limitation, edge case, or trade-off.
- Close with a short decision rule or conclusion that follows from the answer.

These requirements are an authoring sequence, not visible subsection labels.
Do not add headings such as “Direct answer”, “How it works”, or “Takeaway”
inside the speaking answer.

## Visual presentation

- Present the complete answer in one balanced learning canvas. Do not make the
  learner open a row of tabs to discover the answer.
- Begin with the definition and important forms or types, then show one
  concrete example, followed by the question-specific reasoning or decision.
- Pair each cue with at most one useful support: a tiny code example, value
  trace, comparison, or checklist. Do not add decoration that teaches nothing.
- Keep all cues visible together, but use short paragraphs and visual grouping
  so the canvas can be scanned without becoming a wall of text.
- Audio follows the same top-to-bottom cue order and highlights the current
  part without hiding the rest of the answer.
- Preserve a plain `content` transcript as a compatibility fallback. Store the
  interactive form in `beats`, where each item has `cue`, `spokenText`, and an
  optional `support` object.

## Adaptation by question type

| Question | Answer emphasis |
|---|---|
| Definition | Meaning → purpose → mechanism → example → use → limitation |
| Comparison | Decisive difference → mechanics → same example → selection rule → trade-off |
| Internals | Mental model → internal steps → resulting behaviour → example → failure mode |
| How-to | Goal → choices → implementation → example → verification → production warning |
| Debugging | Symptom → likely cause → evidence → smallest reproduction → fix → regression test |
| Scenario | Context → constraints → options → decision → implementation → boundary case |
| Performance | Bottleneck → measurement → cause → change → result → trade-off |
| System design | Requirements → scale → components → request flow → failures → accepted trade-offs |

## Example policy

The example must match the domain:

- Language/framework: small valid code example and the observed behaviour.
- Frontend: component, browser, state, rendering, or user-interaction example.
- Backend: request, service, data, error, or concurrency example.
- Database: sample rows/query and the result or query-plan consequence.
- Infrastructure: deployment, request flow, configuration, or failure scenario.
- System design: concrete load assumptions and a component/data flow.
- Security: threat, vulnerable behaviour, and protection boundary.
- Behavioural: a credible situation with action, result, and reflection.

Code supports the spoken explanation. The learner should not need to read a
large code block aloud for the answer to make sense.

## Language rules

- Prefer short, complete sentences and familiar terminology.
- Define a term before relying on it.
- Use first person only for genuine decisions: “I use X when … because …”.
- Name the actual technology, operation, state, or failure being discussed.
- Explain why a fact matters; do not merely list facts.
- Keep claims proportional to the learner's level and the question asked.

## Rejected content

The following fail the contract:

- “Use it when it fits the situation.”
- “Compare correctness, speed, clarity, and cost.”
- “Mention one trade-off to stand out.”
- “The interviewer wants you to …”.
- “This is a core interview concept.”
- “Show a small example …” without providing the example.
- A generic debugging recipe unrelated to the named technology.
- Repeating the Quick Revision text with more connective words.
- SEO wording, buzzwords, or book-style filler inside the spoken answer.

## Verification

Run `npm run audit:speaking`. An answer is not considered complete until the
audit confirms the length, minimum number of complete thoughts, concrete
example, and absence of known generated filler. Mechanical checks are only the
first gate; factual accuracy and natural spoken flow still require editorial
review.
