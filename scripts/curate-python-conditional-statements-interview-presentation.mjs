#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-syntax-essentials/conditional-statements/complete-qa.json",
);

const presentations = {
  "python-if-elif-else-branch-order": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the chain as one ordered decision",
        stage: "One chain makes one decision",
        spokenText: "An `if`/`elif`/`else` chain represents one ordered decision. Python checks the `if` condition first and continues through the `elif` conditions only while no earlier branch has matched. When one condition is truthy, Python runs that block, skips the rest of the chain, and then continues after it. The final `else` is optional and has no condition.",
      },
      {
        cue: "Explain how a condition gets its truth value",
        stage: "Conditions use truth values",
        spokenText: "A condition does not have to be the literal value `True`. `False`, `None`, numeric zero, and empty strings or collections are falsy; most other objects are truthy. Therefore `if items:` asks whether the collection is non-empty, while `if items is None:` asks whether no value was supplied. Those questions may require different branches.",
      },
      {
        cue: "Trace the first matching score rule",
        stage: "First true branch wins",
        spokenText: "A score of `95` satisfies both `score >= 90` and `score >= 60`, but only the first matching branch runs. Starting with validation and then moving from the narrowest or highest-priority rule to the broadest prevents an earlier general condition from hiding the result the program actually needs.",
        support: {
          type: "trace",
          title: "How score 95 moves through the chain",
          items: [
            {
              label: "Valid range?",
              value: "yes",
              detail: "The invalid branch is skipped.",
              tone: "blue",
            },
            {
              label: "score >= 90?",
              value: "yes",
              detail: "Run the `excellent` branch.",
              tone: "green",
            },
            {
              label: "score >= 60?",
              value: "skipped",
              detail: "An earlier branch already matched.",
              tone: "neutral",
            },
            {
              label: "else",
              value: "skipped",
              detail: "The catch-all is not needed.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Order overlapping rules from narrow to broad",
        stage: "Specific rules must come first",
        spokenText: "Branch order is part of the program's meaning whenever conditions overlap. In the grade example, an out-of-range score is handled before grade thresholds, and `score >= 90` appears before `score >= 60`. Reversing those two grade checks would classify `95` as merely a pass because Python would never reach the more specific rule.",
        support: {
          type: "code",
          title: "Order validation and grade thresholds",
          language: "python",
          code: "def grade(score):\n    if not 0 <= score <= 100:\n        return \"invalid\"\n    elif score >= 90:\n        return \"excellent\"\n    elif score >= 60:\n        return \"pass\"\n    else:\n        return \"retry\"\n\nfor score in (95, 72, 41, 120):\n    print(score, grade(score))",
          caption: "Each score takes one path, and the special cases are checked before broader passing rules.",
        },
      },
      {
        cue: "Separate one decision chain from independent checks",
        stage: "Separate if statements differ",
        spokenText: "Separate `if` statements are independent: Python evaluates every condition, so several blocks may run. That is useful when one input can produce several validation messages. Use one `if`/`elif` chain when the outcomes exclude one another, and separate checks when multiple rules can apply. If a chain becomes deeply nested or repeats conditions, named Boolean expressions or small functions keep the decision readable.",
        recallRule: "Python checks from top to bottom, runs the first truthy branch, and uses `else` only when no earlier condition matches.",
      },
    ],
  },
  "python-conditional-expression-vs-if-statement": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the expression as a two-value choice",
        stage: "An expression chooses a value",
        spokenText: "A conditional expression has the form `value_if_true if condition else value_if_false`. It produces one value, so it can appear in an assignment, function argument, or `return`. A normal `if` is a statement that organizes blocks of work rather than becoming a value itself.",
        support: {
          type: "comparison",
          title: "Choose the form from the job",
          items: [
            {
              label: "Conditional expression",
              value: "select a value",
              detail: "Best for one short value versus another; both alternatives are required.",
              tone: "green",
            },
            {
              label: "if statement",
              value: "perform actions",
              detail: "Handles several steps, optional `else`, and multiple named outcomes.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Preserve lazy evaluation of the two alternatives",
        stage: "Only one side is evaluated",
        spokenText: "Python evaluates the condition and then evaluates only the selected alternative. In `cached if cached is not None else load()`, `load()` is skipped when a cached value exists. The alternatives are not calculated in advance, but side effects inside them can still make a compact expression harder to understand.",
      },
      {
        cue: "Keep the expression for a small readable result",
        stage: "Keep simple choices short",
        spokenText: "Use the expression when the decision really is one simple value versus another. `label = \"adult\" if age >= 18 else \"minor\"` reads naturally and needs no explanation. A small default, display label, or direct return is a good fit as long as both alternatives remain obvious without nested punctuation.",
      },
      {
        cue: "Use statements for validation and several outcomes",
        stage: "Statements handle real work",
        spokenText: "Use a normal `if` when a branch validates input, changes several values, logs, raises an exception, or has more than two meaningful outcomes. Statements give each action its own line and provide natural places for comments and breakpoints. They can also omit `else`, while a conditional expression must always provide both possible values.",
        support: {
          type: "code",
          title: "A value choice beside a multi-step decision",
          language: "python",
          code: "def shipping_label(express):\n    return \"Express\" if express else \"Standard\"\n\ndef shipping_cost(weight):\n    if weight < 0:\n        raise ValueError(\"weight cannot be negative\")\n    if weight == 0:\n        return 0\n    elif weight <= 5:\n        return 80\n    else:\n        return 150\n\nprint(shipping_label(True))\nprint(shipping_cost(4))",
          caption: "The label is one value choice; cost calculation has validation and several outcomes.",
        },
      },
      {
        cue: "Expand nested expressions into named branches",
        stage: "Nested choices should expand",
        spokenText: "Nested conditional expressions are legal but quickly hide their grouping and reverse the natural reading flow. Needing an `elif`, repeated function calls, or a comment for either side is a strong signal to expand the code. The useful distinction is not fewer lines: an expression selects a small value, while a statement explains and performs a decision process.",
        recallRule: "Use a conditional expression for one clear value choice and an `if` statement when either path performs real work.",
      },
    ],
  },
  "python-match-case-vs-if-elif": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define structural matching on one subject",
        stage: "match reads the data shape",
        spokenText: "Python's `match` statement performs structural pattern matching. It evaluates one subject and tries `case` patterns from top to bottom; only the first matching case runs. A final `case _` is the usual catch-all, but it is optional, so no case body runs when nothing matches and no catch-all is present.",
      },
      {
        cue: "Show that a pattern can validate and unpack",
        stage: "Patterns can unpack values",
        spokenText: "A pattern can match a literal or inspect and unpack a sequence, mapping, or supported class object. `case {\"type\": \"move\", \"x\": x, \"y\": y}` checks selected keys and binds the two coordinates in one step. Extra mapping keys do not stop that pattern from matching, so the data may contain additional fields.",
        support: {
          type: "code",
          title: "Match and unpack tagged messages",
          language: "python",
          code: "def handle(message):\n    match message:\n        case {\"type\": \"move\", \"x\": x, \"y\": y}:\n            return f\"move to {x},{y}\"\n        case {\"type\": \"say\", \"text\": str(text)} if text:\n            return f\"say: {text}\"\n        case {\"type\": \"quit\"}:\n            return \"quit\"\n        case _:\n            return \"unknown command\"\n\nprint(handle({\"type\": \"move\", \"x\": 4, \"y\": 2}))\nprint(handle({\"type\": \"move\", \"x\": 4, \"y\": 2, \"speed\": 3}))",
          caption: "Both messages match because the mapping pattern requires selected keys and allows extra ones.",
        },
      },
      {
        cue: "Add a Boolean guard after structural matching",
        stage: "Guards refine a matched shape",
        spokenText: "A guard adds an ordinary condition after the structure matches, as in `case [x, y] if x == y:`. The pattern first checks and unpacks the two-item sequence; only then does the guard compare the values. This keeps the data shape in the pattern and the extra value relationship in the guard.",
      },
      {
        cue: "Choose if for arbitrary Boolean rules",
        stage: "if handles any condition",
        spokenText: "Use `if` and `elif` when branches ask unrelated Boolean questions, such as `temperature > limit`, a range check, or several permissions. Use `match` when many branches interpret different forms of the same subject, such as tagged events, parsed commands, or payload shapes. A few literal cases can use either form; choose the one that shows the rule more clearly.",
        support: {
          type: "comparison",
          title: "Match the question to the control form",
          items: [
            {
              label: "Range or permission rule",
              value: "if / elif",
              detail: "The branch depends on an arbitrary Boolean condition.",
              tone: "blue",
            },
            {
              label: "Tagged message shape",
              value: "match",
              detail: "A pattern can check keys and unpack fields together.",
              tone: "green",
            },
            {
              label: "Shape plus value rule",
              value: "case + guard",
              detail: "The pattern handles structure and the guard handles the extra condition.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Order cases carefully and recognize capture names",
        stage: "Case order and captures matter",
        spokenText: "Case order matters because an early broad pattern can hide every narrower case below it. A bare name such as `case status:` is a capture pattern, not a comparison with an existing variable, so it matches almost any remaining subject. Use a literal such as `case \"ready\":` or a qualified constant such as `case State.READY:` when the case should compare a value.",
        recallRule: "Use `match` to expose the shape of one subject and `if`/`elif` for arbitrary Boolean conditions.",
      },
    ],
  },
};

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
let curated = 0;

for (const [targetSlug, presentation] of Object.entries(presentations)) {
  const matches = document.questions.filter((question) => question.slug === targetSlug);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one ${targetSlug} question, found ${matches.length}`);
  }

  const speakable = matches[0].answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  if (!speakable) {
    throw new Error(`Missing speakable_answer section for ${targetSlug}`);
  }

  speakable.answerSize = presentation.answerSize;
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");
  curated += 1;
}

if (curated !== document.questions.length) {
  throw new Error(`Curated ${curated} of ${document.questions.length} questions`);
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated Interview Answer presentations for ${curated} conditional questions`);
