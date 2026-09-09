#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-syntax-essentials/loops-and-iteration/complete-qa.json",
);

const presentations = {
  "python-for-loop-vs-while-loop": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define for through the iteration protocol",
        stage: "for consumes an iterable",
        spokenText: "A Python `for` loop consumes an iterable such as a list, string, dictionary, file, range, or generator. Python obtains one item at a time and binds it to the loop variable. The loop ends when the iterator reports that it is exhausted, so `for` does not require a numeric counter or a known collection length.",
      },
      {
        cue: "Define while through its repeated condition",
        stage: "while repeats a condition",
        spokenText: "A `while` loop checks its condition before every iteration, runs the body while that condition is truthy, and stops when it becomes false. It has no source iterator. That makes it suitable for retries, polling, sentinel-controlled input, or any process where changing state rather than a collection decides when to stop.",
      },
      {
        cue: "Choose from the rule that proves termination",
        stage: "Termination chooses the loop",
        spokenText: "Use `for line in file:` when the task is to visit every supplied item. Use `while attempts < limit and not connected:` when the process continues until state reaches a result or limit. The useful distinction is not speed; it is whether iterable exhaustion or a changing condition explains why the loop must finish.",
        support: {
          type: "comparison",
          title: "What controls the next iteration",
          items: [
            {
              label: "for item in source",
              value: "next item",
              detail: "Continues while the iterable can supply another value.",
              tone: "blue",
            },
            {
              label: "while condition",
              value: "state check",
              detail: "Continues while the condition remains truthy.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Use enumerate when position and item both matter",
        stage: "enumerate removes bookkeeping",
        spokenText: "A `for` loop usually avoids manual indexes and their off-by-one errors. When the body genuinely needs both position and value, `enumerate(items)` supplies them together. `range(len(items))` is less direct when the only purpose of the index is to retrieve the corresponding item again.",
      },
      {
        cue: "Show progress and the shared loop controls",
        stage: "while must make progress",
        spokenText: "A `while` body must change state used by its condition or deliberately exit with `break`; otherwise it can run forever. Both loop forms also support `continue`, `break`, and an optional `else` that runs only when no `break` occurs. The example uses data to drive one loop and visible state changes to drive the other.",
        support: {
          type: "code",
          title: "Iterate data, then retry from state",
          language: "python",
          code: "orders = [120, 75, 210]\nfor position, amount in enumerate(orders, start=1):\n    print(position, amount)\n\nattempts = 0\nconnected = False\nwhile attempts < 3 and not connected:\n    attempts += 1\n    connected = attempts == 2\n\nprint(connected, attempts)",
          caption: "The `for` loop ends with the data; the `while` loop ends when connection state or the attempt limit changes the condition.",
        },
        recallRule: "Use `for` when an iterable supplies the work and `while` when a changing condition supplies the stopping rule.",
      },
    ],
  },
  "python-range-enumerate-zip": {
    answerSize: "compact",
    beats: [
      {
        cue: "Use range when the values themselves are integers",
        stage: "range yields integer steps",
        spokenText: "Use `range(start, stop, step)` when the loop needs an arithmetic sequence of integers. The `stop` value is excluded, so `range(2, 8, 2)` yields `2`, `4`, and `6`. A range stores its boundaries compactly and produces values during iteration rather than first building a list of every integer.",
        support: {
          type: "comparison",
          title: "Choose from what the loop body needs",
          items: [
            {
              label: "range",
              value: "integers",
              detail: "Produces a controlled arithmetic sequence and excludes `stop`.",
              tone: "blue",
            },
            {
              label: "enumerate",
              value: "index + item",
              detail: "Adds a position to values from one iterable.",
              tone: "green",
            },
            {
              label: "zip",
              value: "aligned items",
              detail: "Combines corresponding values from several iterables.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Use enumerate when the position has meaning",
        stage: "enumerate adds a position",
        spokenText: "Use `enumerate(iterable, start=0)` when the body needs both an item and its position. It yields `(index, item)` pairs, and `start=1` is useful for line numbers or display ranks. Direct iteration with `enumerate` is clearer than generating indexes with `range(len(items))` only to look each item up again.",
      },
      {
        cue: "Use zip for values aligned by position",
        stage: "zip aligns several iterables",
        spokenText: "Use `zip(a, b)` when several iterables describe corresponding values, such as names and scores. Ordinary `zip` stops when its shortest input is exhausted, which can silently discard unmatched values. Use `zip(..., strict=True)` when unequal lengths mean invalid data; Python then raises `ValueError` instead of truncating.",
      },
      {
        cue: "Compose the tools without manual counters",
        stage: "Name the rule in the header",
        spokenText: "`range`, `enumerate`, and `zip` are iterable objects and produce values on demand. They can also be composed: `enumerate(zip(names, scores, strict=True), start=1)` adds a rank to aligned records. Convert the result to a list only when the program really needs to store or reuse all produced values.",
        support: {
          type: "code",
          title: "Rank aligned scores and generate even numbers",
          language: "python",
          code: "names = [\"Asha\", \"Bo\", \"Chen\"]\nscores = [88, 91, 76]\n\nfor rank, (name, score) in enumerate(\n    zip(names, scores, strict=True), start=1\n):\n    print(f\"{rank}. {name}: {score}\")\n\nfor even in range(2, 8, 2):\n    print(even)",
          caption: "The header states alignment and ranking directly; `range` is used only for actual integer values.",
        },
        recallRule: "Use `range` for integers, `enumerate` for position plus item, and `zip` for aligned iterables.",
      },
    ],
  },
  "python-break-continue-pass-loop-else": {
    answerSize: "standard",
    beats: [
      {
        cue: "Explain the loop boundary affected by break",
        stage: "break leaves the inner loop",
        spokenText: "`break` immediately exits the innermost enclosing `for` or `while` loop. Execution resumes after that loop; it does not leave every surrounding loop. This is useful when a search has found its result or when an otherwise open-ended loop reaches an explicit stopping event.",
      },
      {
        cue: "Explain the current-iteration effect of continue",
        stage: "continue skips one cycle",
        spokenText: "`continue` stays inside the same loop but skips the remaining statements in the current iteration. A `for` loop then asks for its next item, while a `while` loop checks its condition again. A state update placed below `continue` is skipped too, which can accidentally stop a `while` loop from making progress.",
      },
      {
        cue: "Separate a no-operation placeholder from control transfer",
        stage: "pass changes nothing",
        spokenText: "`pass` performs no operation. It can occupy a function, class, loop, or branch body when Python requires an indented suite but the code is intentionally empty for now. It does not exit the loop and does not skip the rest of the current iteration, so replacing `continue` with `pass` changes the behavior.",
      },
      {
        cue: "Define normal loop completion through absence of break",
        stage: "Loop else means no break",
        spokenText: "A loop's `else` runs when a `for` iterable is exhausted or a `while` condition becomes false without executing `break`. It also runs for an empty iterable because that is normal exhaustion. A `break`, `return`, or exception prevents the `else` because control does not reach normal loop completion.",
        support: {
          type: "trace",
          title: "Found path versus exhausted path",
          items: [
            {
              label: "Read next item",
              value: "available",
              detail: "Test whether this item is the requested one.",
              tone: "blue",
            },
            {
              label: "Match found",
              value: "break",
              detail: "Leave the loop and skip its `else`.",
              tone: "green",
            },
            {
              label: "No items remain",
              value: "normal end",
              detail: "Run the loop `else` because no `break` happened.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Use search code to connect all four constructs",
        stage: "Search makes the rule clear",
        spokenText: "Search logic makes the loop `else` relationship easy to see. `continue` ignores cancelled orders, `break` stops at the first active match, and `else` reports that every eligible item was examined without a match. If several flags are needed to explain the outcome, a small function with an early `return` can be clearer than a complicated loop.",
        support: {
          type: "code",
          title: "Skip cancelled orders and detect exhaustion",
          language: "python",
          code: "def find_order(orders, wanted_id):\n    for order in orders:\n        if order[\"cancelled\"]:\n            continue\n        if order[\"id\"] == wanted_id:\n            print(\"found\", order[\"id\"])\n            break\n    else:\n        print(\"active order not found\")\n\norders = [\n    {\"id\": 1, \"cancelled\": True},\n    {\"id\": 2, \"cancelled\": False},\n]\nfind_order(orders, 2)\nfind_order(orders, 3)",
          caption: "The successful search executes `break`; the missing search exhausts the iterable and reaches `else`.",
        },
        recallRule: "`break` exits, `continue` advances, `pass` does nothing, and loop `else` means no `break` occurred.",
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
console.log(`Curated Interview Answer presentations for ${curated} loop questions`);
