#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-data-structures-basics/sets/complete-qa.json",
);

const presentations = {
  "python-set-basics-membership-and-deduplication": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define a set through uniqueness and membership",
        stage: "Sets model unique membership",
        spokenText: "A Python set is a mutable collection of distinct hashable values. Adding a value already present does not create a second copy, and a set provides no numeric indexes or sequence-order contract. Use `set()` for an empty set because `{}` creates an empty dictionary.",
      },
      {
        cue: "Connect membership lookup to element hashability",
        stage: "Hashing makes lookup direct",
        spokenText: "Sets use hash-based lookup, so `value in seen` is average `O(1)` instead of the average linear scan required by a list. Elements must be hashable: strings, numbers, and fully hashable tuples work, while lists and dictionaries do not. Collisions mean constant time is an average behavior rather than an unconditional promise.",
      },
      {
        cue: "Trace one-pass duplicate detection",
        stage: "A seen set finds repeats",
        spokenText: "A duplicate detector can keep a `seen` set while reading values once. If the next value is already present, it is a repeat; otherwise it is added for later checks. A separate output list can preserve the order in which duplicates are first discovered, while another set prevents the same duplicate from being reported repeatedly.",
        support: {
          type: "trace",
          title: "How each incoming value updates seen state",
          items: [
            {
              label: "Read value",
              value: "email",
              detail: "Take the next value from the ordered input.",
              tone: "blue",
            },
            {
              label: "email in seen?",
              value: "membership",
              detail: "A true result means this value appeared earlier.",
              tone: "orange",
            },
            {
              label: "First occurrence",
              value: "add",
              detail: "Store the hashable value in `seen`.",
              tone: "green",
            },
            {
              label: "First repeat",
              value: "report",
              detail: "Append once to the ordered duplicate output.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "State which information set conversion discards",
        stage: "Deduplication loses detail",
        spokenText: "Converting `['a', 'b', 'a']` to a set keeps only `'a'` and `'b'`. It discards duplicate counts and should not be used when first-seen output order is required. Use `collections.Counter` when frequency is the result, and use `dict.fromkeys(values)` or a set-plus-list pattern when order must be preserved.",
      },
      {
        cue: "Set the boundary with sequences mappings and counters",
        stage: "Choose sets for membership",
        spokenText: "Choose a set when the real question is whether a value has been seen, which values overlap, or whether one group contains another. Keep a list when positions, duplicates, or iteration order are data, and use a dictionary when each key has an associated value. The example detects repeats without relying on the set's display order.",
        support: {
          type: "code",
          title: "Detect duplicates in first-repeat order",
          language: "python",
          code: "values = [\"a\", \"b\", \"a\", \"c\", \"b\", \"a\"]\nseen = set()\nreported = set()\nduplicates = []\n\nfor value in values:\n    if value in seen and value not in reported:\n        duplicates.append(value)\n        reported.add(value)\n    seen.add(value)\n\nprint(sorted(seen))\nprint(duplicates)",
          caption: "The sets provide membership, while the list preserves the order in which repeated values are first discovered.",
        },
        recallRule: "Use a set for distinct hashable membership only when losing positions and duplicate counts is acceptable.",
      },
    ],
  },
  "python-set-union-intersection-difference": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define union as membership in either input",
        stage: "Union keeps either side",
        spokenText: "Union, written `a | b`, returns every value present in `a`, `b`, or both. The result still contains each value once because it is a set. Use it when the question is which distinct values appear anywhere across the two groups.",
        support: {
          type: "comparison",
          title: "Which membership region each operator keeps",
          items: [
            {
              label: "a | b",
              value: "either side",
              detail: "Keep values from the left, right, or their overlap.",
              tone: "blue",
            },
            {
              label: "a & b",
              value: "overlap",
              detail: "Keep only values that occur in both sets.",
              tone: "green",
            },
            {
              label: "a - b",
              value: "left only",
              detail: "Remove from `a` every value also present in `b`.",
              tone: "orange",
            },
            {
              label: "a ^ b",
              value: "exactly one side",
              detail: "Keep both non-overlapping sides and discard the overlap.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Define intersection as shared membership",
        stage: "Intersection keeps overlap",
        spokenText: "Intersection, `a & b`, returns only values that belong to both sets. With `required = {'python', 'sql'}` and `known = {'python', 'git'}`, the intersection is `{'python'}`. It directly expresses a shared-membership question without a nested loop.",
      },
      {
        cue: "Emphasize the operand direction of difference",
        stage: "Difference is directional",
        spokenText: "Difference, `a - b`, keeps values in the left set that are absent from the right. `required - known` gives missing skills, while `known - required` gives extra known skills; reversing the operands changes the question. Difference is not the same as symmetric difference.",
      },
      {
        cue: "Define symmetric difference as exactly one side",
        stage: "Symmetric difference keeps one",
        spokenText: "Symmetric difference, `a ^ b`, keeps values present in exactly one input and removes the common overlap. It is different from union because union includes shared values. For the skill sets, it returns `{'sql', 'git'}`: the values on either non-overlapping side.",
      },
      {
        cue: "Use direct Boolean relations when no result set is needed",
        stage: "Boolean relations need no set",
        spokenText: "Use `required <= known` when the result should simply say whether every requirement is present, and `a.isdisjoint(b)` when the groups must have no overlap. Operator forms expect set-like operands, while methods such as `intersection(iterable)` accept general iterables. Non-mutating operations keep the inputs; updating variants deliberately change one set.",
        support: {
          type: "code",
          title: "Compare required and known skill membership",
          language: "python",
          code: "required = {\"python\", \"sql\"}\nknown = {\"python\", \"git\"}\n\nprint(sorted(required | known))\nprint(sorted(required & known))\nprint(sorted(required - known))\nprint(sorted(required ^ known))\nprint(required <= known)\nprint(required.isdisjoint({\"java\"}))",
          caption: "Sorting is only for stable display; each set operation is defined by membership rather than output order.",
        },
        recallRule: "Union keeps either side, intersection keeps overlap, difference keeps left-only, and symmetric difference keeps exactly one side.",
      },
    ],
  },
  "python-set-vs-frozenset": {
    answerSize: "standard",
    beats: [
      {
        cue: "Begin with the membership behavior both types share",
        stage: "Both model unique membership",
        spokenText: "`set` and `frozenset` both represent unordered collections of distinct hashable elements. Both support membership checks, union, intersection, difference, and subset relationships. Neither provides a positional index or allows an unhashable list or dictionary as an element.",
        support: {
          type: "comparison",
          title: "Same membership model, different container contract",
          items: [
            {
              label: "set",
              value: "mutable",
              detail: "Can add, remove, and update elements; the container is unhashable.",
              tone: "orange",
            },
            {
              label: "frozenset",
              value: "immutable",
              detail: "Has no mutating operations and can itself participate in hash-based lookup.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Use set while membership is expected to evolve",
        stage: "set allows membership changes",
        spokenText: "A normal set provides methods such as `add`, `remove`, `discard`, and `update`, so its membership can change after construction. That makes it the direct choice while collecting permissions, tracking visited nodes, or accumulating unique values. Because its value can change, the set object itself is unhashable.",
      },
      {
        cue: "Use frozenset for a fixed unordered value",
        stage: "frozenset fixes the group",
        spokenText: "A `frozenset` has no mutating methods. Once created, the membership cannot change, giving the group stable value-based identity. It is not merely a faster set, and its elements must still be hashable. Use it only when the complete unordered group should remain fixed.",
      },
      {
        cue: "Connect fixed membership to a stable composite hash",
        stage: "A stable group can be hashed",
        spokenText: "A frozenset can itself be a dictionary key or an element of another set. `frozenset({'read', 'write'})` and a frozenset created in the opposite order are equal and have compatible hashes because membership, not construction order, defines the value. This works well for a cache keyed by an unordered permission group.",
        support: {
          type: "code",
          title: "Use one unordered permission group as a key",
          language: "python",
          code: "permissions = {\"read\"}\npermissions.add(\"write\")\n\ngroup = frozenset(permissions)\ncache = {group: \"read-write policy\"}\n\nsame_group = frozenset([\"write\", \"read\"])\nprint(cache[same_group])\nprint(group == same_group)\nprint(hash(group) == hash(same_group))",
          caption: "Opposite construction order produces the same frozenset key because only membership defines equality.",
        },
      },
      {
        cue: "Choose ordered or unordered composite identity",
        stage: "Choose tuple or frozenset",
        spokenText: "Choose a tuple when position and order are part of composite identity, such as `(latitude, longitude)`. Choose a frozenset when the same members in any order should represent one value. Use an ordinary set when membership is still evolving and does not itself need to be stored as a hashable key.",
        recallRule: "Use `set` for changing membership and `frozenset` for a fixed unordered value that may need its own hash.",
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
console.log(`Curated Interview Answer presentations for ${curated} set questions`);
