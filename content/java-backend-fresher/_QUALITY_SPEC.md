# Java Backend Fresher content contract

This is the definition of done for content under `content/java-backend-fresher`.
It extends `docs/GOLD-STANDARD-CONTENT.md` for a 0–2 YOE Java backend learner.
The goal is not to make every answer equally long. The goal is to give every
question the amount and kind of teaching it actually needs.

## One source and three learner zones

`content/java-backend-fresher` is the active source of truth for this domain.
Legacy trees are not alternative authoring locations.

Every question has exactly three learner-facing zones:

1. **Quick Revision** — recall the exact answer.
2. **Interview Answer** — understand the complete answer expected in an interview.
3. **Deep Dive** — learn the subject from the beginning and apply it.

The zones are independent. A learner may open any one of them directly, so each
must name and answer the real question without relying on text from another zone.
They may share the same central fact, but they must not repeat the same paragraphs.

## Preserve stable identity

Content improvement must not break routes or curriculum order.

- Preserve every existing `id`, `slug`, and `order` unless a separately reviewed
  catalog migration explicitly changes it.
- Preserve the existing top-level file shape. A topic may be either an object with
  a `questions` array or a top-level array; do not convert between the two.
- Keep existing SEO URLs and aliases stable. Improve a malformed visible question
  through a catalog migration rather than silently changing its route identity.
- Keep one canonical question body. Do not maintain divergent copies in a legacy
  content tree.

## Reference and language standard

Technical claims must be checked against the strongest available primary source:
the Java Language Specification and JDK API for Java, official Spring/Jakarta
documentation for frameworks, RFCs for HTTP, OWASP guidance for security, and the
official documentation for JUnit, Mockito, Git, Maven, Gradle, Docker, and database
products.

GeeksforGeeks, JavaTpoint, InterviewBit, and Baeldung may be used to understand the
familiar vocabulary and examples learners already recognise. They are not the
authority for disputed facts, and their wording must not be copied.

Write in simple, natural English:

- use the common name before an internal implementation term;
- define an unavoidable advanced term where it first appears;
- prefer a concrete example over abstract promotional language;
- remove coaching filler such as “say this,” “to impress the interviewer,” or
  “I would begin by” unless the question genuinely asks for a debugging or design
  process;
- never use a generated shell such as “compare X with an alternative.”

## 1. Quick Revision

Quick Revision is a self-contained memory aid.

- Begin with the direct answer, definition, or decision.
- Add only the few facts needed to recall the concept correctly.
- Include a boundary when it prevents a common wrong answer.
- Make every point specific to the question; generic interview advice fails.
- Do not introduce a code listing, table, or diagram unless that small artifact is
  genuinely the shortest way to recall the answer.

A small syntax question may need one rule and one example. A lifecycle or design
question may need more recall points. Completeness and recall value decide the
depth, not a universal word or bullet count.

## 2. Interview Answer

Interview Answer is a complete technical answer, not a performance script. It must
give learners the information they need and let them choose their own speaking
style.

Select only the elements the question needs:

- a plain definition or direct decision;
- the important mechanism or reasoning;
- a concrete example, request, query, or small code sample;
- when it matters or when to choose it;
- a real limitation, failure mode, or trade-off;
- a concise conclusion that answers the question.

The order should feel like one connected explanation. Bullets are useful when they
make a comparison or sequence easier to follow; they must not turn the answer into
disconnected notes. An example must be complete enough to prove the explanation.
Do not stretch an atomic question into an essay or compress an implementation or
architecture question into a few generic lines.

## 3. Deep Dive

Deep Dive is a self-contained mini lesson written as a readable article. It should
teach a learner who has not opened Quick Revision or Interview Answer.

Choose a natural teaching path for the question, for example:

- plain meaning and the problem the concept solves;
- mental model, lifecycle, or internal mechanism;
- one worked example carried through the explanation;
- important variants or comparison boundaries;
- common failure and its correction;
- verification or a short knowledge check.

These are possible teaching moves, not mandatory sub-sections. Keep headings
meaningful and connected. Supporting code, tables, traces, and diagrams belong
inside the article where they explain the surrounding text; they are not a second
collection of unrelated cards.

## Adaptive depth

Decide depth from the question before writing:

- **Atomic question:** one rule, definition, annotation, or syntax difference.
  Explain it accurately, give a small example, and stop.
- **Working concept:** a mechanism, comparison, API, data structure, or testing
  choice. Explain how it behaves, demonstrate it, and cover the main boundary.
- **System question:** an implementation, lifecycle, debugging scenario, security
  flow, or architecture decision. Trace the system end to end, include failure
  behavior, and show how the result is verified.

There is no required word count, paragraph count, heading count, or reading time
for a zone. Longer is better only when every additional part teaches something the
question requires.

## Meaning-driven code and visuals

Use an artifact only when it teaches better than prose:

- use code for language behavior, an implementation, a query, or a correct/wrong
  pattern that must be seen;
- use a sequence or flow diagram for order, state changes, request flow, or data
  movement;
- use a concept map for a genuine hierarchy or ownership relationship;
- use a table for a symmetric comparison or compact reference data;
- use before/after code only when both versions reveal a real mistake and fix.

No question is required to contain code, a diagram, a table, or a particular block
type. Decorative diagrams and forced code reduce quality and should be removed.
Prefer one strong explanatory artifact to several weak ones.

All examples must be verified. Java examples must match the Java version they
claim, framework examples must use compatible APIs, SQL must be traceable against
sample data, HTTP examples must have valid semantics, and Mermaid must render and
match the prose. Pseudocode must be labelled as pseudocode.

## Question-archetype outcome

Use the question wording to set the learning outcome rather than to force a fixed
section sequence:

| Question | Learner must be able to do after Deep Dive |
|---|---|
| What is X? | Define X, recognise it, explain its purpose, and separate it from a nearby concept. |
| X vs Y | Compare the same meaningful criteria and choose one for a concrete situation. |
| How does X work? | Trace one input through the important stages to its output or state change. |
| How do you implement X? | Build and verify a minimal complete example, including the relevant failure path. |
| Debug this scenario | Use evidence to isolate the cause, justify a fix, and add a regression check. |
| When should X be used? | State positive and negative selection criteria and defend a decision. |
| What is the common mistake? | Recognise the wrong pattern, explain its consequence, and correct it. |
| Architecture or security | Explain responsibilities, trust or data boundaries, flow, failure behavior, and the main trade-off. |
| Testing | Choose the correct scope, identify real and mocked parts, and write assertions that catch a named bug. |

## Per-question definition of done

A question is complete only when all of the following are true:

- the visible question is clear, natural, and contains no answer text;
- all three zones answer that exact question independently;
- Quick Revision supports correct recall rather than generic advice;
- Interview Answer contains a complete, question-specific explanation;
- Deep Dive teaches the concept in a coherent article flow;
- content depth matches the complexity of the question;
- every factual claim and example has been checked;
- code or visuals are present only when meaningful and are technically valid;
- no paragraph is copied across zones or unrelated questions;
- `id`, `slug`, `order`, file shape, and canonical routing are preserved.

## Validation

Run the relevant content, catalog, source, JSON, example, and build checks after
each topic-sized batch. Automated length and presence checks are warning signals,
not proof of quality. Every batch also requires semantic review for exactness,
simple language, factual accuracy, unnecessary repetition, and artifact value.
