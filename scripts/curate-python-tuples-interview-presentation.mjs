#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-data-structures-basics/tuples/complete-qa.json",
);

const presentations = {
  "python-tuple-basics-and-immutability": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the ordered but fixed tuple structure",
        stage: "A tuple fixes its positions",
        spokenText: "A tuple is an ordered sequence whose structure is immutable. It supports zero-based indexing, slicing, iteration, duplicate values, and mixed element types, but Python does not allow an existing position to be replaced, an item to be appended, or a position to be deleted in place after the tuple is created.",
      },
      {
        cue: "Explain the syntax of a one-item tuple",
        stage: "The comma creates the tuple",
        spokenText: "The comma is what creates a tuple; parentheses usually make the grouping easier to read. `(7,)` is a one-item tuple because it has the trailing comma, while `(7)` is just the integer `7` inside parentheses. A multi-item value such as `point = 3, 4` is also a tuple even without visible parentheses.",
      },
      {
        cue: "Limit immutability to the fixed element references",
        stage: "Immutability stops at slots",
        spokenText: "Tuple immutability is shallow. In `record = (\"A17\", [\"new\"])`, the tuple cannot store a different object at position `1`, but the list already referenced there may still run `append(\"paid\")`. The tuple keeps the same reference in that slot while the nested object changes its own contents.",
        support: {
          type: "trace",
          title: "A fixed slot can point to a changing list",
          items: [
            {
              label: "tuple slot 0",
              value: "'A17'",
              detail: "The stored reference cannot be replaced.",
              tone: "blue",
            },
            {
              label: "tuple slot 1",
              value: "list A",
              detail: "The slot continues to reference the same list.",
              tone: "blue",
            },
            {
              label: "list A appends 'paid'",
              value: "changes",
              detail: "The nested object mutates without changing either tuple slot.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Distinguish a new tuple from changing the old one",
        stage: "Tuple operations return new",
        spokenText: "An expression that appears to add to a tuple actually creates another tuple. `point + (3,)` returns a new sequence and leaves `point` unchanged. This is different from a list's in-place structural methods. The example also shows that mutating a nested list remains legal and that the comma, not parentheses alone, controls the one-item case.",
        support: {
          type: "code",
          title: "Test shallow immutability and tuple syntax",
          language: "python",
          code: "record = (\"A17\", [\"new\"])\nrecord[1].append(\"paid\")\nprint(record)\n\nsingle = (7,)\nnot_a_tuple = (7)\nprint(type(single).__name__)\nprint(type(not_a_tuple).__name__)\n\npoint = (1, 2)\nextended = point + (3,)\nprint(point, extended)",
          caption: "The nested list changes, the one-item comma controls the type, and concatenation leaves the original tuple untouched.",
        },
      },
      {
        cue: "Choose a tuple only when positions stay meaningful",
        stage: "Use tuples for fixed meaning",
        spokenText: "Use a tuple for a short fixed-position value such as `(latitude, longitude)`, for multiple return values, or as a composite dictionary key when every element is hashable. Use a list when the sequence should evolve. When a record has many positions or needs field names and behavior, a named tuple, dataclass, or regular class communicates the meaning more clearly.",
        recallRule: "A tuple fixes its element references, but mutable objects stored in those fixed slots can still change internally.",
      },
    ],
  },
  "python-tuple-packing-and-unpacking": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define packing through comma-separated values",
        stage: "Commas pack values together",
        spokenText: "Packing groups comma-separated values into one tuple. `point = 3, 4` creates `(3, 4)`, even without visible parentheses. The same mechanism appears when a function writes `return name, age`: it returns one tuple containing two values rather than returning through two separate channels.",
      },
      {
        cue: "Define unpacking as binding from any iterable",
        stage: "Targets unpack an iterable",
        spokenText: "Unpacking distributes items from an iterable across several targets. `x, y = point` reads two items and binds them to `x` and `y`. The source does not have to be a tuple; a list, string, generator, or another iterable can be unpacked when its produced shape matches the target pattern.",
      },
      {
        cue: "Treat ordinary unpacking as an exact shape check",
        stage: "Counts must match exactly",
        spokenText: "Without a starred target, the number of produced items must match the number of targets. Too few or too many values raises `ValueError` rather than silently dropping data. This makes unpacking a useful shape check at a boundary, but it also means callers and return values must agree on their positional contract.",
      },
      {
        cue: "Explain how one starred target divides the remainder",
        stage: "One star collects the rest",
        spokenText: "One target prefixed with `*` absorbs the remaining items. In `first, *middle, last = [10, 20, 30, 40]`, the edge targets receive `10` and `40`, while `middle` receives `[20, 30]`. The starred target always receives a list in assignment, even when the source iterable is a tuple.",
        support: {
          type: "trace",
          title: "How starred unpacking divides four values",
          items: [
            {
              label: "first",
              value: "10",
              detail: "The target before the star takes from the beginning.",
              tone: "blue",
            },
            {
              label: "middle",
              value: "[20, 30]",
              detail: "The starred target collects the remaining center as a list.",
              tone: "green",
            },
            {
              label: "last",
              value: "40",
              detail: "The target after the star takes from the end.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Use right-side-first evaluation to explain swapping",
        stage: "Right side is evaluated first",
        spokenText: "Python evaluates the full right side before rebinding any assignment targets. That is why `left, right = right, left` preserves both old values and swaps them safely. Packing and unpacking are convenient for small, obvious positional groups; when many positions carry domain meaning, named fields are safer than a long tuple contract.",
        support: {
          type: "code",
          title: "Pack, unpack a return value, collect, and swap",
          language: "python",
          code: "def user_summary():\n    return \"Mina\", 3\n\npacked = 3, 4\nx, y = packed\nname, count = user_summary()\nfirst, *middle, last = [10, 20, 30, 40]\nx, y = y, x\n\nprint(packed, x, y)\nprint(name, count)\nprint(first, middle, last)",
          caption: "All four forms use the same binding model; the starred target is the only one that receives a list.",
        },
        recallRule: "Commas pack values, matching targets unpack them, and one starred target may collect the remainder into a list.",
      },
    ],
  },
  "python-tuple-hashable-dictionary-key": {
    answerSize: "standard",
    beats: [
      {
        cue: "Connect dictionary and set lookup to stable hashes",
        stage: "Hash tables need stable keys",
        spokenText: "Dictionary keys and set elements must be hashable. A hashable object's hash must remain stable during its lifetime, and two objects that compare equal must have equal hashes. Hash tables use that value to narrow the lookup location, so a key whose hash changed after insertion could no longer be found reliably.",
      },
      {
        cue: "Explain recursive tuple hashability",
        stage: "Tuple hash reaches every item",
        spokenText: "A tuple's fixed structure can support a stable composite hash, but Python must be able to hash every contained element. `(51.5, -0.1)` works because both floats are hashable. When `hash()` reaches a nested list, dictionary, or set, it raises `TypeError`; tuple immutability alone cannot make that mutable object hashable.",
      },
      {
        cue: "Compare valid ordered and unordered composite keys",
        stage: "A nested list blocks hashing",
        spokenText: "The distinction is recursive. A tuple of strings, numbers, or other fully hashable tuples can normally be a key. `([51.5], -0.1)` cannot because the first element is a list. When the group itself has no meaningful order, a `frozenset` can provide an immutable, hashable set value instead of forcing an arbitrary tuple order.",
        support: {
          type: "comparison",
          title: "Three composite values and their lookup meaning",
          items: [
            {
              label: "(51.5, -0.1)",
              value: "hashable",
              detail: "A fixed ordered pair whose elements are both hashable.",
              tone: "green",
            },
            {
              label: "([51.5], -0.1)",
              value: "unhashable",
              detail: "The nested list prevents a stable recursive hash.",
              tone: "orange",
            },
            {
              label: "frozenset({'a', 'b'})",
              value: "hashable",
              detail: "Represents a composite group whose order does not matter.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Preserve the separate parts of a composite key",
        stage: "Composite keys keep structure",
        spokenText: "Tuples are useful composite keys because they preserve separate fields. A cache keyed by `(country_code, postal_code)` does not need to join the parts into a string and parse them later. Ordering remains part of tuple equality, so `('US', '10001')` is a different key from `('10001', 'US')`.",
      },
      {
        cue: "Set the equality and user-defined object boundary",
        stage: "Choose tuple or frozenset",
        spokenText: "Hashing is checked when a hash is requested, not when the tuple is created. A user-defined object used inside a key also needs compatible `__eq__` and `__hash__` behavior. Choose a tuple when position and order are meaningful, and choose `frozenset` when the same members in any order should identify one key.",
        support: {
          type: "code",
          title: "Use ordered and unordered composite keys",
          language: "python",
          code: "weather = {(51.5, -0.1): \"cloudy\"}\nprint(weather[(51.5, -0.1)])\n\ntry:\n    invalid = {([51.5], -0.1): \"cloudy\"}\nexcept TypeError as error:\n    print(type(error).__name__)\n\nunordered_pair = frozenset({\"alice\", \"bob\"})\nconnections = {unordered_pair: \"connected\"}\nprint(connections[frozenset({\"bob\", \"alice\"})])",
          caption: "The coordinate tuple is ordered, the nested-list tuple fails at hashing, and the frozenset ignores member order.",
        },
        recallRule: "A tuple is hashable only when every nested element is hashable; choose its ordered equality deliberately.",
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
console.log(`Curated Interview Answer presentations for ${curated} tuple questions`);
