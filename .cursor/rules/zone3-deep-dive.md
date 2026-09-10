# Deep Dive Generation — Session Prompt

Paste this at the start of a new conversation. Then say the topic name (e.g. "deep dive spring-boot").

---

## Your Role

You are writing the deep dive sections for interview answers on the InterviewExplainer platform.

**This session: Zone 3 only — deep dive sections. Do not write speakable_answer or key_points.**

Project: `/Users/ravi.r_flx/IEProject/InterviewExplainer`
Files: `content/interview/java/backend/intermediate/<module>/<subtopic>/complete-qa.json`

When the user gives a topic name:
1. Read the file
2. For each question — read the full question object including `interviewer_intent`, `difficulty`, and `direct_answer` fields before writing anything
3. Classify archetype + complexity, then write the deep dive sections
4. Write the completed JSON back to the file
5. Report what was written

---

## UI Rendering Awareness — How Your Content Appears

The frontend renders each section through `SectionRenderer` + `MarkdownContent`. Your content choices directly control the visual result.

### Section types → visual treatment

| Section `type` | How it renders | When to use |
|---|---|---|
| `overview` | Plain block + h3 title | Opening section, always |
| `phase` | Blue left border + blue dot + h3 | Tracing what happens during an operation (internals) |
| `step` | Blue left border + blue dot + h3 | Action the reader takes (how-to) |
| `code_example` | **Collapsed by default** — user must click "expand" | Supplementary/reference code only |
| `comparison_table` | Plain block + h3 | Any X vs Y comparison |
| `best_practices` / `tip` | Green card + CheckCircle icon | Positive recommendations |
| `common_mistakes` / `warning` | Red card + AlertTriangle icon | Traps and pitfalls |
| `approach` | Amber card + Lightbulb icon | Strategy or approach explanation |
| `when_to_use` | Green card + Wrench icon | Decision guidance |
| `real_world_example` | Gray card | Production scenarios |
| `problem_statement` | Red card + Bug icon | Debugging: what breaks |
| `diagnosis` | Amber card + Search icon | Debugging: how to detect |
| `before_code` | Red left border + red dot | Debugging: broken code |
| `after_code` | Green left border + green dot | Debugging: fixed code |
| `component` | Indigo left border + Layers icon | Architecture: structural role |

**Critical: `code_example` is collapsed.** Users must click to see it. Never put essential code in `code_example` — embed code directly in `overview`, `phase`, `step`, or `component` sections using fenced code blocks in the `content` markdown. Reserve `code_example` type only for long reference code that supplements the explanation.

### Markdown in `content` — what renders

The `content` string is parsed as full GitHub-Flavored Markdown:
- `**bold text**` → semibold dark text (use for visual anchors)
- `` `inline code` `` → blue text on gray pill background
- ` ```java ... ``` ` → syntax-highlighted code block on dark background
- `| col | col |` → bordered table with header background
- `> blockquote` → blue left-border quote box
- `## heading` → styled sub-heading within the section
- `- list item` → bulleted list
- Paragraphs separated by `\n\n` → proper spacing with 1.8 line height

### Section `title` field → h3 heading

The `title` field renders as a bold h3 heading above each section. Make it count — it's the first thing the reader sees. Write insight headers, not labels.

---

## What the Deep Dive Is

A mini blog post written by someone who understands this topic deeply. They start where the reader is, build understanding progressively, prove points with code, and leave the reader with something they couldn't have gotten from a GFG article.

**It is NOT:** documentation, a feature list, a code file with labels, a reference page.

**The test:** After reading just the deep dive, could someone who knew nothing about this topic understand it fully — the concept, why it exists, how it works, what to watch out for? If no, it failed.

---

## Length by Complexity — This Is the Critical Rule

| Complexity | Typical range | Hard ceiling |
|---|---|---|
| 1 | 300–500 | 600 |
| 2 | 500–700 | 800 |
| 3 | 650–900 | 1000 |
| 4 | 800–1100 | 1200 |
| 5 | 900–1200 | 1400 |

**The only rule that matters:** Stop when the topic is fully explained. Complexity is a guide for depth, not a word count to hit. A complexity 5 question explained clearly at 850 words is done — don't add sections to reach 1100. A complexity 2 question with genuinely interacting concepts can go to 750 — don't cut it short to stay under 700.

The ranges are where most questions land. The ceiling is the absolute maximum — never exceed it, even for the most complex topics.

Complexity is determined by the question's depth, not its length. "What is == vs equals?" is complexity 1. "How does HashMap work internally?" is complexity 4. Never pad a simple topic. Never compress a deep one.

---

## Before Writing Any Section — Read These First

Every question JSON has fields that directly tell you what the deep dive must cover:

```json
"interviewer_intent": {
  "testing": "what the interviewer is actually evaluating",
  "common_mistake": "what most candidates get wrong — address this explicitly",
  "to_stand_out": "what makes an answer exceptional — include this"
}
```

**The `common_mistake` field is especially important.** If candidates typically get this wrong, the deep dive must explain it clearly enough that after reading, the reader won't make that mistake. Name it. Explain why it's wrong. Show the correct understanding.

**The `to_stand_out` field is your depth target.** If it mentions a specific mechanism, threshold, or production pattern — that must be in the deep dive. This is what separates a good answer from a great one.

---

## How to Classify Complexity

Read the question, difficulty, and `interviewer_intent` fields. Ask:
- Is this one concept with a clear answer? → 1–2
- Does it involve multiple interacting concepts? → 3
- Does it involve internals, algorithms, or production patterns? → 4
- Is it system design or a topic that could fill a 30-minute discussion? → 5

---

## Archetype → Section Blueprint

The archetype determines which section types to use. Match the question to the archetype, then follow the blueprint.

### `internals` — How something works under the hood
Blueprint: `overview` → `phase` → `phase` → `phase` → (inline code in phases)
- Use **phase** (not step). Phase = tracing what happens during one real operation
- Trace a single operation from start to finish: "when you call `put()`..."
- Each phase advances one step in the mechanism
- Embed code directly in phase sections — do NOT use `code_example` for critical code

### `comparison` — X vs Y
Blueprint: `overview` → `comparison_table` → `step` or `when_to_use`
- comparison_table is required — never compare two things without a table
- overview states the key difference in one paragraph
- Final section gives a clear recommendation with reasoning

### `direct-concept` — What is X (simple)
Blueprint: `overview` → `comparison_table` (if applicable) → (inline code if needed)
- Maximum 3 sections for complexity 1–2
- Short is correct. Do not add sections to look thorough.

### `how-to-recipe` — How to do X step by step
Blueprint: `overview` → `step` → `step` → `step`
- Use **step** (not phase). Step = action you take. Phase = thing that happens.
- Each step explains WHY, not just WHAT
- At least one step must warn about a real production mistake
- Embed code in step sections directly

### `tool-config` — Configure or use a tool
Blueprint: `overview` → `step` → `step` → `step`
- overview: what problem this tool solves (not a feature list)
- Each step: config option + why it exists + what breaks if misused
- Must include at least one production footgun with specific consequence

### `architecture` — Architectural pattern or principle
Blueprint: `overview` → `component` → `component` → `component`
- Use **component** (not step). Component = structural role, not sequential action.
- overview: the fundamental problem this architecture solves — WHY it exists
- Each component: one layer or principle, its responsibility, what breaks without it
- Embed code showing the dependency rule in component sections

### `debugging-pattern` — Find and fix a problem
Blueprint: `problem_statement` → `before_code` → `diagnosis` → `after_code`
- problem_statement: what breaks, why it's subtle, why people miss it
- before_code: the broken code with explanation of why it fails
- diagnosis: how to detect this in a real codebase
- after_code: the fix with explanation of why it works

### `system-design` — Design X at scale
Blueprint: `overview` → `step` or `phase` sections → `comparison_table`
- overview: quantify the problem with real math — "10M/day ÷ 86,400s ≈ 115 req/sec"
- comparison_table: algorithm or approach trade-offs with explicit recommendation
- Cover failure modes: what happens when the system itself fails?

### `moderate-concept` — Multi-faceted concept
Blueprint: `overview` → `phase` or `step` → (inline code)
- overview title: "The Problem" — what breaks when people misunderstand this
- Teach through bugs: broken code first, then why it breaks, then the fix

### Fallback
Use the blueprint that matches the question's actual nature. If it's asking "how does X work" use internals. If it's asking "how do you implement X" use how-to-recipe. Don't force an archetype — derive it.

---

## The Overview Section — Most Critical, Gets the Most Attention

The overview is the first section every reader sees. It sets the entire mental model. If it's weak, nothing that follows can save it.

**The overview must do one of these — pick the one that fits this specific question:**
- **Problem-first:** Start with the problem that made this thing necessary. "Before X, you had to Y — and it was painful because Z." Then introduce what X does.
- **Analogy-first:** A concrete comparison that makes the mechanism immediately intuitive. Then layer in the technical detail.
- **Misconception-first:** The thing everyone thinks — then immediately correct it. "Most people think HashMap is just a lookup table. It's actually a bucket array where slot assignment is computed from the key's hash."
- **Decision-first (for comparison/tool questions):** State the core trade-off in one sentence. The rest of the overview builds on that.

**What the overview must never do:**
- Start with a definition ("X is a Y that provides Z")
- List features ("X supports A, B, C, and D")
- Be shorter than 150 words — it's laying the foundation, it needs substance

---

## The Prose-to-Code Rule — No Exceptions

Every code block follows this exact pattern:

1. **Setup prose** (2–4 sentences): What are we about to see? Why does this code exist? What problem does it demonstrate or solve?
2. **The code**: Concise. Not a full application. Just enough to make the point.
3. **Inline comments**: Only on non-obvious lines. The lines where a reader would pause and wonder "why?".
4. **Follow-up prose** (1–3 sentences): What did we just see? What does it mean? What breaks if you change it?

If a section is more than 50% code by character count — add more explanation.
If code is there just to look complete — remove it.

**When to skip code entirely:** If the topic is conceptual (architectural patterns, design principles, trade-off decisions) and no code example would genuinely make it clearer — don't include one. A forced code example is worse than no code. Ask: does this code prove a point that prose alone can't make? If no, cut it.

**When to use a real-world scenario instead of code:** Some concepts land better with a scenario than a code snippet. "Imagine you're building an order service and the payment service is slow — here's what happens to your threads without a circuit breaker." A scenario makes abstract concepts concrete without requiring code. Use scenarios when: the concept is architectural or behavioral (not implementation-specific), the code would be too long to be useful, or a real situation makes the point more vividly than syntax. Scenarios should be brief — 2–4 sentences, grounded in something recognizable (an e-commerce flow, a user login, a file upload).

**Minimum section length: 100 words.** No section should be fewer than 100 words. If you can't write 100 words about a section, it probably doesn't deserve its own section — merge it with an adjacent one.

---

## Visual Formatting — How It Reads on Screen

The content renders as markdown. How it looks matters as much as what it says. A well-written section that renders as a wall of text feels hard. The same content with proper breathing room feels readable.

**Paragraphs:**
- Maximum 3–4 sentences per paragraph. Then a blank line.
- Vary the length. One short punchy sentence after a longer explanation creates rhythm. A paragraph that's 8 sentences long feels like a wall — break it.
- Use **bold** inside prose to create visual anchors for the key term or concept in that paragraph. One bold per paragraph is enough.

**Transitioning into code:**
The last sentence of setup prose should lead directly into the code — not end with a colon or "here is an example." It should feel like the code is the natural next thing, not something dropped in.

Bad: `Here is how to configure it:`
Good: `The configuration registers a single bean that Spring picks up automatically at startup.`

The code feels like it's part of the same thought, not a separate block.

**Transitioning out of code:**
The first sentence after a code block picks up the thread — what we just saw, what it means, or what to watch for. Don't leave code as the last thing in a section with nothing after it.

**Lists inside sections:**
Use a short bulleted list when you have 3+ parallel items that would be awkward as prose. Not for everything — only when the list genuinely helps scan. A list of 2 items is just two sentences. A list of 7 items is a dump.

**What bad formatting looks like:**
- Six sentences in a row with no paragraph break
- Code block with "Here is an example:" as the only setup
- Code as the last thing in a section with no follow-up sentence
- Every paragraph the same length

---

## Section Titles Are Blog Headers

The title should tell the reader what insight they're about to get — not what the section covers.

| Bad (content label) | Good (insight header) |
|---|---|
| "Step 2 — HashCode" | "Why Two Keys With the Same Value Land in Different Buckets" |
| "Overview of Resizing" | "The Hidden Cost That Hits You at 12 Entries" |
| "Code Example" | "The Bug You Get When You Override equals() But Not hashCode()" |
| "Step 1 — Introduction" | "Why This Pattern Exists: The Problem It Was Designed to Solve" |

---

## The Progression

Every deep dive builds in the same direction: start where the reader is → build toward nuance → end where production concerns live.

**Start:** The why. The problem this thing was created to solve. The simplest possible version of what it is. The analogy that makes it click.

**Middle:** The actual mechanism or implementation. How the parts fit together. Where the complexity lives.

**End:** What matters in practice. The common mistakes. The production implications. The thing a senior engineer knows that a junior one doesn't.

---

## JSON Schema

```json
{
  "answer": {
    "sections": [
      { "type": "overview", "title": "Why This Exists: The Problem It Solves", "content": "..." },
      { "type": "phase", "title": "Step 1 — What Happens When You Call put()", "content": "..." },
      { "type": "comparison_table", "title": "X vs Y: The Decision", "content": "| Col | Col |\n|---|---|\n| ... | ... |" },
      { "type": "step", "title": "Step 1 — Configure the DataSource", "content": "..." },
      { "type": "component", "title": "The Domain Layer: Where Business Rules Live", "content": "..." },
      { "type": "problem_statement", "title": "The Deadlock You Don't See Coming", "content": "..." },
      { "type": "diagnosis", "title": "How to Detect This in a Running System", "content": "..." },
      { "type": "before_code", "title": "The Broken Code", "content": "..." },
      { "type": "after_code", "title": "The Fix and Why It Works", "content": "..." }
    ]
  }
}
```

**Always `title`, never `label` or `index`.**
Do NOT include `key_points` or `speakable_answer` — those are separate sessions.

---

## The Quality Bar

A reader who just read the GFG or Interviewbit article on this topic should get something different here — a cleaner mental model, the non-obvious mechanism, the production consequence they hadn't considered, the `common_mistake` addressed clearly, the `to_stand_out` insight included.

If the deep dive covers the same ground as GFG in the same order with similar depth — it failed.

---

## Self-Check Before Writing Each Question

**Before starting:**
- Did you read `interviewer_intent.testing`, `common_mistake`, and `to_stand_out`?
- What is this question specifically asking — not the topic, the angle?
- Which archetype and what complexity?

**While writing:**
- For each section: can you write one sentence — "after reading this section, the reader understands X"? If you can't, rewrite or merge the section.
- Is the overview problem-first, analogy-first, or misconception-first — not definition-first?
- Is every section at least 100 words?
- Is prose always before code? Every code block has setup + inline comments + follow-up?
- Are section titles insights, not labels?
- Is critical code embedded in phase/step/overview sections — NOT in code_example (which is collapsed)?

**After writing:**
- Is the `common_mistake` addressed explicitly somewhere?
- Is the `to_stand_out` content included?
- Does the progression go: why it exists → how it works → what matters in practice?
- Is there anything that could be cut without losing understanding? Cut it.
- Would this teach someone who knew nothing? Would it also give something to someone who knew a lot?
