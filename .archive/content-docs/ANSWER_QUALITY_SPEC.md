# Answer Quality Constitution v1.0

This document is the single source of truth for answer quality. It is injected into every generation prompt and every judge evaluation. Both the writer and reviewer agree on these rules.

---

## The Three Zones

Every answer has exactly three zones. Each zone serves a distinct purpose for a distinct user need.

### Zone 1: Key Points (Quick Revision Scan)

**Purpose:** Someone who already knows the topic refreshes their memory in 30 seconds before walking into an interview.

- 4–6 bullet points (up to 8 for complex topics, never fewer than 4)
- Each bullet = **concept name in bold** + why it matters (not just a label)
- Include small inline `code` or query snippets where they make the point crisper
- No prose paragraphs — bullets only
- Section type in JSON: `"type": "key_points"`

**Good bullet:**
`- **String is immutable** — s.concat("x") returns a new object, the original s is unchanged. This makes String thread-safe, usable as a HashMap key, and eligible for the JVM's String pool`

**Bad bullet:**
`- String is immutable` (just a label, no "why it matters")

---

### Zone 2: Interview Speakable Answer

**Purpose:** The exact words you would say out loud in an interview. Natural speech, not documentation.

- 3–5 paragraphs
- 150–300 words total (scales slightly with topic complexity)
- Must be **significantly shorter** than the deep dive (1/3 to 1/5 the length)
- Reads like a senior engineer explaining over coffee, not a textbook
- Combine: definition → concrete example → differentiation from similar concepts
- Bold/highlight 3–5 key terms with `**term**`
- **No fenced code blocks** — only inline `code` references
- Section type in JSON: `"type": "speakable_answer"`

**Test:** Read it aloud. If it sounds like someone reading a manual, rewrite it.

---

### Zone 3: Deep Dive (Learn the Full Topic)

**Purpose:** A mini-blog article that teaches the topic from zero to expert. Someone with no prior knowledge should understand the complete concept after reading.

#### Length Rules (The Critical Rule)

Length is proportional to topic complexity. NEVER pad a simple topic. NEVER under-explain a deep one.

| Complexity Score | Target Words | When to Use |
|---|---|---|
| 1 (shallow) | 500–650 | Single concept, one core idea. e.g., == vs equals |
| 2 (moderate) | 650–900 | 2–3 related concepts. e.g., String vs StringBuilder |
| 3 (substantial) | 900–1200 | Multiple interacting concepts with code. e.g., Exceptions, Clean Architecture |
| 4 (deep) | 1100–1500 | Internals, algorithms, production patterns. e.g., HashMap, GC |
| 5 (exhaustive) | 1500–2000 | System design, multi-concept architecture. e.g., Rate Limiter, API Gateway |

#### Structure Rules

- **Explanation-first:** Explain the concept in prose BEFORE showing code
- **Code comments:** Every code block must have inline comments on important lines
- **Progressive depth:** Build from basics → intermediate → advanced/production
- **Section size:** No section fewer than 100 words. If it's thinner, merge with adjacent section
- **Code ratio:** No section should be more than 60% code by character count. If it is, add more explanation
- Sections use types: `"overview"`, `"step"`, `"phase"`, `"code_example"`, `"comparison_table"`

#### Content Rules

- Teach, don't list. Each section should have "aha moments" — explain WHY something works that way
- Use concrete numbers and examples, not abstract descriptions
- Connect to real-world scenarios — production issues, performance implications, common bugs
- When comparing concepts, explain WHEN to use each, not just WHAT each does

---

## Anti-Patterns (What NOT to Do)

1. **Code dump:** Wall of code with a one-line introduction. Explanation must always outweigh code.
2. **Uniform length:** Making every answer the same length regardless of topic depth. A "what is X" question does NOT need the same depth as "design a rate limiter."
3. **Documentation voice in speakable:** "It is important to note that..." — nobody talks like this. Use "The key thing here is..." or "What catches people is..."
4. **Generic answers:** An answer that could be swapped with a similar question and nobody would notice. Each answer must be specific to THIS question.
5. **Padding:** Adding filler sentences to hit a word count. If the topic is simple, the answer should be short.
6. **Missing the interviewer's actual question:** If they ask "how does X work internally," the deep dive must cover internals, not just API usage.
7. **Orphan code:** Code examples that don't connect back to the explanation. Every code block should be referenced and explained.

---

## JSON Structure

```json
{
  "answer": {
    "sections": [
      { "type": "overview", "title": "...", "content": "..." },
      { "type": "step", "title": "...", "content": "..." },
      { "type": "comparison_table", "title": "...", "content": "| ... |" },
      { "type": "key_points", "title": "Key Points", "content": "- **Bold concept** — explanation\n- ..." },
      { "type": "speakable_answer", "title": "How to Answer This Verbally", "content": "..." }
    ]
  }
}
```

Key points and speakable answer are always present. Deep dive sections (overview, step, phase, code_example, comparison_table) vary by question type and complexity.

---

## Archetype-Specific Structure Templates

The archetype determines which section types to use, what the opening line must do, and whether a verdict is required. **Deviating from the template for your archetype is a quality failure.**

---

### `internals` — How something works under the hood

**Mental model:** Walk through the journey of a single operation, not a feature list.

**Section blueprint:** `overview` (one-sentence mental model) → `phase` (step 1) → `phase` (step 2) → `phase` (step 3) → `code_example` (bug demo or production pattern)

**Use `phase`, not `step`.** Phase = walkthrough of existing behavior. Step = recipe for doing something. "How does HashMap work" is a phase walkthrough, not a recipe.

**Opening hook rule:** The first sentence of the speakable must state the key mental model. NOT "HashMap is a data structure" but "HashMap is a `Node[]` bucket array where the slot index is derived from `hashCode`."

**Verdict rule:** The speakable must connect internals to a production consequence. "I've seen this cause p99 latency spikes" — an insight that only someone who actually uses the technology would say.

---

### `comparison` — X vs Y, or choosing between options

**Mental model:** State the key difference first, give a table, then give a verdict.

**Section blueprint:** `overview` (key difference in one sentence) → `comparison_table` → `when_to_use` or `step` (practical guidance) → verdict paragraph in speakable

**A comparison table is required.** If you compare two things without a table, you've written a paragraph that forces the reader to extract structure themselves.

**Opening hook rule:** The first sentence of the speakable must be the key difference. "String is immutable, StringBuilder is mutable — that one difference drives every other decision."

**Verdict rule (non-negotiable):** Give a clear personal recommendation. "My default is X because Y. I use Z only when W." A neutral listing of facts is a failed comparison answer.

---

### `debugging-pattern` — How to find and fix a problem

**Mental model:** Show the broken state, explain why it breaks, then fix it.

**Section blueprint:** `problem_statement` → `before_code` (broken code) → `diagnosis` (what's actually wrong) → `after_code` (fixed code)

**Do NOT use `step` or `phase`.** The problem/diagnosis/fix structure is not a recipe and not a walkthrough — it's forensic. Use the dedicated section types.

**Opening hook rule:** Open with the problem: what fails, why it's subtle, and why people get it wrong.

**Verdict rule:** End with the preventive pattern — the systemic change that means you never hit this bug again.

---

### `system-design` — Design X at scale

**Mental model:** Quantify the problem first, then design toward those numbers.

**Section blueprint:** `overview` (scale math + the core challenge) → `step` or `phase` sections for components → `comparison_table` for algorithm/approach trade-offs

**Opening hook rule:** The first sentence of the speakable must quantify the scale. "10M requests/day ÷ 86,400s ≈ 115 req/sec average, but peaks run 10–50× that." Numbers first, then design.

**Verdict rule:** Explicitly state your design decisions and the trade-offs you accepted. "I chose token bucket over leaky bucket because X." Cover failure modes: what happens when the rate limiter itself goes down?

---

### `how-to-recipe` — How to do X (step-by-step with code)

**Mental model:** Each step teaches why, not just what.

**Section blueprint:** `overview` (end goal + why this matters) → `step` (numbered, each explains the reasoning) → `code_example` → production warnings section

**Use `step`, not `phase`.** Steps are for things you do in sequence to achieve a result. Phases are for describing how something already works.

**Opening hook rule:** Open with the end goal, then walk through how to get there.

**Verdict rule (required):** Include at least one "Never do X because Y in production" warning. Practical answers save people from real mistakes.

---

### `tool-config` — How to configure or use a specific tool

**Mental model:** What problem does this tool solve, and what are the sharp edges?

**Section blueprint:** `overview` (problem this tool solves + when you'd use it) → `step` sections (setup + config options with WHY each exists) → production warnings

**Every config option must explain its purpose AND its danger.** "Never use `include: '*'` in production — it exposes `/env` (your passwords) and `/heapdump` (full JVM memory)."

**Opening hook rule:** Open with the problem this tool solves, not a feature list.

**Verdict rule:** Every tool has at least one production footgun. State it explicitly.

---

### `architecture` — What is X architectural pattern

**Mental model:** Why does this architecture exist? What problem does it solve that simpler approaches don't?

**Section blueprint:** `overview` (the fundamental problem this solves) → `component` sections (one per layer/principle) → `code_example` (the dependency rule in code)

**Use `component`, not `step`.** Architecture layers are not sequential steps — they're structural roles with dependency rules between them.

**Opening hook rule:** Open with WHY. "Business rules change slowly, frameworks change rapidly — Clean Architecture is the structural response to that asymmetry."

**Verdict rule:** The payoff must be explicit. Pick one: testability, replaceability, or maintainability. Don't list all three abstractly — make one concrete.

---

### `direct-concept` — What is X, or simple X vs Y

**Mental model:** Simple question, decisive answer. Do not pad.

**Section blueprint:** `overview` (key distinction in 1–2 sentences) → `comparison_table` (if side-by-side) → `code_example` (if one brief example helps) — 2–3 sections total for complexity 1–2

**The cardinal rule: simple questions get short answers.** If the topic is "what is == vs equals", a 1500-word deep dive is a failure — it signals the generator doesn't understand the question's scope.

**Opening hook rule:** One sentence that captures the entire distinction. Done.

**Verdict rule:** Give a clear verdict. "I use `equals()` for every object comparison. The only time `==` is correct is for enums and identity checks." Not "it depends" without a follow-up.

---

### `moderate-concept` — Multi-faceted concept (not a simple comparison)

**Mental model:** Teach through bugs, not through theory. Show what goes wrong first, then explain why.

**Section blueprint:** `overview` (titled "The Problem" — what breaks when people misunderstand this) → `phase` or `step` (the mechanics, building from the bug) → `code_example` (broken → fixed → best practice)

**Opening hook rule:** Open with the problem, not the definition. "The Java Memory Model doesn't describe what your code does — it describes the minimum guarantees the JVM must honor. Everything else is undefined behavior."

**Verdict rule:** The progression broken → fixed → best practice is the verdict. Show three versions of code: wrong, corrected, idiomatic.

---

## The Two Rules That Apply to Every Archetype

1. **Opening hook:** The first sentence of the speakable answer must deliver the key mental model immediately — not a preamble, not a definition of terms, not "In computer science...". Jump straight to the insight.

2. **Verdict:** Every answer must have a recommendation, opinion, or practical guidance. "It depends" without a follow-up is not a verdict. "My default is X, I reach for Y when Z" is a verdict. An answer without a verdict is a Wikipedia article, not interview prep.
