# JBF Gold Rewrite — Plan & Question Curation

Goal: lift every Java Backend Fresher (JBF) module to a **gold standard better than JBI**,
written in a **beginner-first tone** so any fresher (or any person familiar with the topic
from the internet) understands the whole concept. Curate each module to **≤30 questions**:
drop low-value/duplicate questions, add missing must-know ones, modify the rest.

This is the single source of truth for the rewrite. Work module by module, M01 → M33.

---

## The new quality bar (every kept question MUST hit this)

1. **Beginner-first deep dive.** The `overview` (first deep-dive section) starts at the
   *most basic, internet-familiar* level — define the everyday idea first ("a variable is a
   named box that holds a value"), THEN climb to the nuance. Do **not** open with an advanced
   framing, a misconception, or "unlike objects…". Start where a total beginner is.
2. **Progressive flow.** simple line → why it exists → how it works → the interview nuance →
   the gotcha. Each step assumes only what the previous step taught.
3. **A real diagram on every concept.** Add at least one mermaid diagram
   (`flow_diagram` / `architecture_diagram` / `sequence_diagram`) OR a `concept_map` card grid.
   Prefer a true mermaid flowchart for anything with a flow/hierarchy/decision.
4. **Runnable Java 17 code** with prose-before-code and a follow-up sentence after it.
   Use `before_code` + `after_code` for any wrong→right pattern.
5. **Simple tone.** Short sentences. Define jargon on first use. ≤1 analogy per answer.
   Internet-standard (GeeksforGeeks / Baeldung) definitions, not staff-level abstraction.
6. **Keep every existing JSON key** (id, slug, seo, speakable_v2, …) and the file shape.
   `speakable_v2.hook` ≠ `direct_answer`. Update `last_updated` to today.
7. Validates clean: `python3 scripts/validate_jbf.py content/java-backend-fresher/<module>/`.

### Section recipe (default concept question)
`overview (beginner-first)` → `flow_diagram` or `concept_map` → `code_example`
(or `before_code`+`after_code`) → `common_mistakes` → `key_points` → `speakable_answer`.

---

## M01 — java-syntax-basics — curated list (target ≤30)

Reading order follows `_index.json` topics. Within each topic, simplest question first.
Currently 48 questions (8 topics × 6). Curated target: **28**.

### T1 · data-types-and-variables  (keep 5, drop 1)
1. KEEP+MODIFY — What are variables and the 8 primitive data types in Java? *(beginner-first
   opener: start from "what is a variable", add a diagram of the type families)*
2. KEEP — Instance vs local vs static variables
3. KEEP — `final` on a variable (reference vs value)
4. KEEP — `var` keyword (Java 10 local type inference)
5. KEEP — Primitive copy-by-value gotcha (`int b = a`)
6. DROP — Variable naming conventions *(low interview value; fold the 2 real rules into a
   key-point on Q1)*

### T2 · operators-and-expressions  (keep 4, drop 2)
1. KEEP — `==` vs `.equals()`
2. KEEP — pre-increment vs post-increment (`++i` vs `i++`)
3. KEEP — short-circuit evaluation (`&&`, `||`)
4. KEEP — ternary operator vs if-else
5. DROP — bitwise operators *(rare for freshers; mention as a key-point)*
6. DROP — operator precedence *(fold the one real pitfall into Q1/Q4)*

### T3 · control-flow  (keep 4, drop 2)
1. KEEP — for vs while vs do-while
2. KEEP — break vs continue vs return
3. KEEP — enhanced for-each loop
4. KEEP — switch with a missing `break` (output question + fall-through)
5. DROP — if-else vs switch *(duplicate of Q4 + comparisons)*
6. DROP — nested loops pitfalls *(fold into break/continue Q2)*

### T4 · arrays-basics  (keep 4, drop 2)
1. KEEP — declare/initialize an array + default values
2. KEEP — array vs ArrayList
3. KEEP — ArrayIndexOutOfBoundsException & prevention
4. KEEP — passing an array to a method (pass-by-value of the reference)
5. DROP — Arrays utility class methods *(reference list; fold key methods into Q1)*
6. DROP — jagged vs 2D arrays *(niche for freshers)*

### T5 · type-casting  (keep 3, drop 3)
1. KEEP — widening vs narrowing conversion
2. KEEP — String ↔ int conversion (parseInt / valueOf / toString)
3. KEEP — casting `double 9.99` to `int` (truncation, not rounding)
4. DROP — ClassCastException *(belongs with OOP/generics; mention as key-point)*
5. DROP — implicit type promotion *(fold into Q1 widening)*
6. DROP — parseInt vs `(int)` cast *(fold into Q2)*

### T6 · access-modifiers  (keep 3, drop 3)
1. KEEP — the four access modifiers (public/private/protected/default)
2. KEEP — why fields are private + getters/setters (encapsulation)
3. KEEP — protected vs default (package-private)
4. DROP — modifiers on local variables *(fold as a one-line note in Q1)*
5. DROP — most vs least restrictive *(answered by Q1's table)*
6. DROP — private vs public design *(fold into Q2)*

### T7 · keywords-and-literals  (keep 3, drop 3)
1. KEEP — what are keywords / can't be identifiers (+ literals intro)
2. KEEP — `static` keyword (where it applies)
3. KEEP — `final` on a class / method
4. DROP — this vs super *(belongs to M02 OOP)*
5. DROP — abstract keyword *(belongs to M02 OOP)*
6. DROP — string literal vs `new String` *(belongs to M03 Strings)*

### T8 · comparisons  (keep 2, drop 4)
1. KEEP — `==` for primitives vs `==` for objects
2. KEEP — Integer cache and how it affects `==`
3. DROP — if-else chain vs switch *(dup of T3)*
4. DROP — while vs do-while *(dup of T3)*
5. DROP — Comparable vs Comparator *(belongs to M04 Collections)*
6. DROP — String == vs equals vs compareTo *(belongs to M03 Strings)*

**M01 curated total: 5+4+4+4+3+3+3+2 = 28 questions.**

---

## Process per topic
1. Edit `complete-qa.json`: remove DROP questions, reorder simplest-first, rewrite kept
   answers to the new bar (beginner-first overview + diagram + code + mistakes + key_points +
   speakable). Keep all JSON keys; update `last_updated`.
2. `python3 -c "import json; json.load(open(<file>))"` then `validate_jbf.py <module>/`.
3. Tick the tracker below.

## Progress tracker
- [x] M01 T1 data-types-and-variables — 5 Q, beginner-first overviews, mermaid type-tree on Q1, dropped naming-conventions, validates 0/0
- [x] M01 T2 operators-and-expressions — 4 Q, gold speakable+deep dive, added common_mistakes + when_to_use + flow diagrams, validates 0/0
- [x] M01 T3 control-flow — 4 Q, gold speakable+deep dive rewrite, insight-header titles, validates 0/0
- [x] M01 T4 arrays-basics — 4 Q, gold speakable+deep dive, added common_mistakes + when_to_use, rebuilt thin speakable_v2, validates 0/0
- [x] M01 T5 type-casting — 3 Q, gold speakable+deep dive, hidden code surfaced to before/after, validates 0/0
- [x] M01 T6 access-modifiers — 3 Q, gold speakable+deep dive, added common_mistakes, fixed backtick-in-label mermaid, real familiarity_anchors, validates 0/0
- [x] M01 T7 keywords-and-literals — 3 Q, gold speakable+deep dive, real familiarity_anchors, validates 0/0
- [x] M01 T8 comparisons — 2 Q, gold speakable+deep dive, fixed subgraph stray-newline mermaid, validates 0/0
- **M01 v1 COMPLETE** — 28 Q, 0 CRITICAL / 0 MODERATE, every Q has overview→diagram→code→common_mistakes→key_points→speakable, beginner-first.
- [ ] M02 … M33 (apply same curation: ≤30, beginner-first, diagrams)

---

# M01 v2 — "Ladder from Zero" answer standard + final question list

User feedback (2026-06-07): answers are good but the deep-dive **overview still starts "from the
top."** It must start from the **plainest, internet-familiar, child-level first line** a beginner
already half-knows, THEN climb. Better than JBI. Simpler tone. Curate the question list (add/drop/
modify), max 30, but cover the whole topic. Most important: **answer quality**.

## The "Ladder from Zero" overview rule (overrides generic zone3 "no definition-first" for FRESHER)
Every `overview` must climb this ladder, in order:
1. **Rung 0 — the plain line.** Open with the simplest sentence a beginner would read on
   GeeksforGeeks. No misconception, no analogy, no "unlike…", no advanced framing as line 1.
   e.g. *"A variable is just a named box that holds a value."* / *"A loop repeats a block of code."*
2. **Rung 1 — the one-line distinction / why it exists.** What problem does it solve, in plain words.
3. **Rung 2 — how it actually works.** The mechanism (stack/heap, references, JVM behaviour),
   still in simple language, one concept at a time. An analogy is allowed HERE, not as line 1.
4. **Rung 3 — the interview nuance.** The non-obvious thing that shows real understanding.
5. **Rung 4 — the gotcha.** The trap that bites people / the production consequence.
Each rung assumes only what the previous rung taught. Short sentences. Define jargon on first use.
Result must teach a total beginner the WHOLE concept, yet still give an experienced reader the nuance.

Zones 1 (key_points) and 2 (speakable) stay at the v1 gold bar (already good). The v2 work is
**re-deepening every `overview` (and any other deep-dive section that opens too high)** + the list
changes below.

## Final M01 question list (target = 30; +2 high-value adds, 0 drops)
T1 data-types-and-variables (5 → 6): keep 5; **ADD** "int vs Integer — primitive vs wrapper +
  autoboxing/unboxing" (the single most-asked fresher basics Q, currently missing).
T2 operators-and-expressions (4): keep all 4.
T3 control-flow (4): keep all 4.
T4 arrays-basics (4): keep all 4.
T5 type-casting (3): keep all 3.
T6 access-modifiers (3): keep all 3.
T7 keywords-and-literals (3 → 4): keep 3; **ADD** "What does `public static void main(String[] args)`
  mean — every keyword explained" (classic day-1 first-program Q).
T8 comparisons (2): keep all 2.
**New total: 6+4+4+4+3+3+4+2 = 30.**

Drop candidates considered and REJECTED (coverage value too high to cut): none — list is already
curated; the 2 adds fill the only real gaps without exceeding 30.

## v2 progress tracker
- [x] Re-deepen all 28 overviews to "ladder from zero" (8 topic files) — every overview opens at Rung-0 (plainest GFG line), then climbs why→how→nuance→gotcha. 4 (final, var, String↔int, truncation) hand-fixed where the agent still opened with a misconception/meta hook.
- [x] Re-polished all 28 speakable_answer sections to gold (no definition openings, position-led, in-range word counts).
- [x] Validated: 28 Q, 0 CRITICAL / 0 MODERATE.
- [x] Added T1 `int` vs `Integer` (data-types-and-variables-006) — full gold structure.
- [x] Added T7 `public static void main` (keywords-and-literals-007) — full gold structure.
- **M01 FINAL: 30 Q, 0 CRITICAL / 0 MODERATE.** Ladder-from-zero overviews, gold speakable, mermaid uses `<br/>` (no literal \n, no backticks in labels).

---

# M02 — java-oop-fundamentals — COMPLETE (gold)
30 questions across 9 topics (classes-and-objects 4, encapsulation 3, inheritance 4, polymorphism 4,
abstraction 3, interfaces-vs-abstract-classes 3, constructors 4, this-and-super 3, comparisons 2).
Applied the full gold treatment in one pass per topic:
- Added `common_mistakes` to ALL 30 (none had it before).
- Fixed 1 CRITICAL (classes-and-objects "memory with new" had no recognized code block).
- Re-deepened every `overview` to "ladder from zero" (plain GFG line first, then climb).
- Rewrote every `speakable_answer` to gold (position-led, no definition openings, in-range length).
- Fixed mermaid labels repo-wide (`<br/>` instead of literal \n; no backticks in node labels).
- encapsulation + interfaces-vs-abstract-classes agents stalled on first launch; relaunched and completed.
- **M02 FINAL: 30 Q, 0 CRITICAL / 0 MODERATE.**

# Visual-polish pass (M01 + M02) — DONE
User feedback: answers good but "highlights, colored text, bullet points, better presentation missing
from both speakable and deep dive — visuals look not good." Ran a formatting-only pass (preserving
wording) across all 17 topic files / 60 questions:
- speakable_answer: added **bold** key phrases, `inline code` (blue pills) on every identifier, 2-4
  short paragraphs, and a short bullet list where listing parallel items.
- overview/prose: one bold anchor per paragraph, inline-code identifiers, parallel items converted to
  bullet lists, `>` blockquotes for key rules.
- Verified: 0 questions with weak speakable formatting (all >=2 bold & >=2 code); M01 30/0/0, M02
  30/0/0; 0 mermaid issues.
- Stalls handled: classes-and-objects polish agent stalled once, relaunched and completed.

NOTE FOR M03+: bake the visual formatting (bold / inline-code / bullets / blockquotes) into the FIRST
gold pass so a separate polish pass isn't needed.

# M03 — java-strings — COMPLETE (gold, "more detailed" standard)
26 Q across 8 topics (string-immutability 2, string-pool 3, string-methods 5, stringbuilder-vs-stringbuffer 3,
string-comparisons 4, string-programs 3, wrapper-classes 3, autoboxing-unboxing 3).
New standard applied (per user: "more detailed, focus on the 3 main content sections, don't add many extra blocks"):
- Focused effort on the 3 MAIN sections — key_points (5-6 sharp bullets), speakable (gold, 180-240w), deep-dive
  overview (ladder-from-zero, MORE detailed, 250-350w where the topic warrants).
- Added `common_mistakes` to all 26 (were missing) and ONE diagram where missing (cleared all 17 MODERATE).
- Rich visual formatting baked in from the first pass (bold anchors, inline-code pills, bullet lists, blockquotes).
- Fixed mermaid (`<br/>`, no backticks in labels). 0 weak speakables.
- **M03 FINAL: 26 Q, 0 CRITICAL / 0 MODERATE.**

# CRITICAL LEARNING — the speakable card renders `speakable_v2`, NOT `speakable_answer`
The on-screen "Interview Answer" card renders the structured `speakable_v2` (hook + beats) via
`frontend/components/question/QuestionPageLayout.tsx` (`v2?.speakableV2 ? <Speakable v2> : legacy`).
The `answer.sections[type=speakable_answer]` markdown is ONLY a fallback. EARLIER speakable edits went
into the wrong field and never showed. ALWAYS author the speakable in `speakable_v2` going forward.

`speakable_v2` has its own quality system:
- Linter: `python3 scripts/audit_speakable.py --check <file>` — floor is **score >= 80 / status PASS**.
- Authoring spec: `docs/speakable/agent-briefs/P01-java-core.md` (per-archetype required beats + golden
  YAML), `docs/speakable/{word-ceilings,depth-markers,lint-rules}.md`.
- Rules: avg sentence <=16 words, FK grade <=9, contractions >=30%, per-beat word ceilings, 3+ items must
  be bullets/grouped, <=3 inline `code` pills per beat, tts_overrides for every identifier/symbol, a
  depth-marker phrase per speakable, no second-person imperatives, hook/cap <=35 words.

# FRONTEND FIX (so speakable markdown actually renders)
Added `frontend/components/speakable/primitives/SpeakableInline.tsx` and wired it into every beat
primitive + the hook/cap (`shell.tsx`) so `**bold**` -> <strong> and `` `code` `` -> `.speakable-code-chip`
render in the speakable card. The TTS serializer (`lib/speakable/toSpeech.ts`) already strips markdown,
so read-aloud stays clean. Verified live (code chips render on M01/M02 pages).
NOTE: the content reader caches JSON in a globalThis map with NO mtime check
(`frontend/lib/content-reader.ts:799`) — content edits require a DEV SERVER RESTART to show.

# speakable_v2 GOLD — M01 + M02 + M03 COMPLETE
All **86 questions** (M01 30 + M02 30 + M03 26) now PASS `audit_speakable.py` (most 100/100), authored to
the P01 brief, with markdown emphasis that renders as bold + code chips. JBF content validator still
0 CRITICAL / 0 MODERATE for all three modules. Agents stall intermittently — relaunch single-file agents.

- [ ] M04 … M33 (apply: deep-dive ladder-from-zero + key_points + speakable_v2 PASS audit + rich visuals, common_mistakes everywhere, mermaid <br/>)
