#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-data-structures-basics/lists/complete-qa.json",
);

const presentations = {
  "python-list-basics-mutable-ordered-sequence": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the ordering and contents of a Python list",
        stage: "A list is an ordered sequence",
        spokenText: "A Python list is an ordered, mutable sequence. Each item has a zero-based position, iteration follows that order, duplicate values are allowed, and the list can grow or shrink. A list may legally contain different types, although keeping related values together usually makes the model and its operations easier to understand.",
      },
      {
        cue: "Connect mutation to stable object identity",
        stage: "Mutation keeps one identity",
        spokenText: "Mutability means the same list object can change its contents. `tasks.append(\"test\")` adds a position, `tasks[0] = \"design\"` replaces one stored reference, and `tasks.remove(\"test\")` removes an item. By contrast, `tasks + [\"deploy\"]` constructs another list and leaves the original object unchanged unless its name is rebound.",
      },
      {
        cue: "Explain why ordinary assignment creates an alias",
        stage: "Assignment can create aliases",
        spokenText: "Assignment does not copy a list. After `alias = tasks`, both names refer to one object, so an append through `alias` is visible through `tasks`. Passing the list to a function follows the same reference rule. This can be intentional shared state, but it becomes a bug when the caller expected independent ownership.",
        support: {
          type: "trace",
          title: "Two names reach one changing list",
          items: [
            {
              label: "tasks = ['plan']",
              value: "list A",
              detail: "Create one mutable list object.",
              tone: "blue",
            },
            {
              label: "alias = tasks",
              value: "same list A",
              detail: "Bind another name without copying.",
              tone: "orange",
            },
            {
              label: "alias.append('test')",
              value: "two items",
              detail: "Both names now observe `['plan', 'test']`.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Separate an outer copy from nested mutable values",
        stage: "A copy separates the outside",
        spokenText: "`tasks.copy()` or `tasks[:]` creates a different outer list, so later appends and removals on that outer container are isolated. The copy is shallow: nested lists or dictionaries are still the same objects. Copying solves only the ownership level it actually duplicates, so nested edits need their own copy or deliberate reconstruction.",
        support: {
          type: "code",
          title: "Compare an alias, an outer copy, and nested data",
          language: "python",
          code: "tasks = [\"plan\"]\nalias = tasks\nseparate = tasks.copy()\n\nalias.append(\"test\")\nseparate.append(\"review\")\nprint(tasks, separate)\nprint(alias is tasks, separate is tasks)\n\nnested = [[1], [2]]\nouter_copy = nested.copy()\nouter_copy[0].append(9)\nprint(nested)",
          caption: "Outer list changes are separated, but the copied list still points to the original nested lists.",
        },
      },
      {
        cue: "Set the boundary with sets and dictionaries",
        stage: "Use lists for ordered change",
        spokenText: "Choose a list when position, iteration order, duplicates, or later structural updates are part of the requirement. Use a set when unique membership is the main relationship and a dictionary when a stable key should find a value directly. Mutating methods such as `append()` and `sort()` return `None`, which makes it clear that they change the list rather than create a replacement result.",
        recallRule: "A list is an ordered mutable object; assignment may share it, while `copy()` separates only the outer container.",
      },
    ],
  },
  "python-list-indexing-and-slicing": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define indexing as selection of one required item",
        stage: "Indexing selects one position",
        spokenText: "Indexing selects exactly one item. Python lists use zero-based positions, so `items[0]` is the first element. A single index must identify an available position; asking for one outside the list raises `IndexError`. Direct list indexing is constant-time access and does not allocate another list.",
      },
      {
        cue: "Explain negative positions from the end",
        stage: "Negative indexes count back",
        spokenText: "A negative index counts backward from the end: `items[-1]` is the final item, `items[-2]` is the one before it, and so on. It is still a single-position lookup, so a negative index that reaches beyond the beginning also raises `IndexError`.",
      },
      {
        cue: "Read start stop and step as a directional walk",
        stage: "A slice is a half-open walk",
        spokenText: "A slice uses `items[start:stop:step]`. Python begins at `start`, repeatedly moves by `step`, and stops before reaching `stop` in that direction. The start is included and the stop is excluded, so `letters[1:4]` selects positions `1`, `2`, and `3`. A step of zero is invalid because the walk could never advance.",
        support: {
          type: "trace",
          title: "Walk through letters[1:4]",
          items: [
            {
              label: "index 1",
              value: "b",
              detail: "Start is included.",
              tone: "green",
            },
            {
              label: "index 2",
              value: "c",
              detail: "Advance by the default step of one.",
              tone: "green",
            },
            {
              label: "index 3",
              value: "d",
              detail: "This position is still before the stop.",
              tone: "green",
            },
            {
              label: "index 4",
              value: "stop",
              detail: "The stop boundary is not selected.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Cover omitted bounds clipping and reverse steps",
        stage: "Slice bounds are clipped",
        spokenText: "Omitted bounds use the reachable beginning or end, and the default step is `1`. A negative step walks backward, which is why `items[::-1]` returns a reversed result. Slice bounds beyond the list are clipped instead of raising `IndexError`, making slices useful for chunks and pages even near an outer boundary.",
      },
      {
        cue: "Explain the allocation and shallow-copy boundary",
        stage: "Slices copy only the outside",
        spokenText: "A list slice returns a new outer list containing references to the selected items, and its cost grows with the number of selected references. It is a shallow copy: if an item is itself a list, changing that nested object through the slice is visible in the original. Use an index for one required item and a slice for a natural subsequence.",
        support: {
          type: "code",
          title: "Run positive, stepped, reverse, and shallow slices",
          language: "python",
          code: "letters = [\"a\", \"b\", \"c\", \"d\", \"e\"]\nprint(letters[0], letters[-1])\nprint(letters[1:4])\nprint(letters[::2])\nprint(letters[::-1])\n\nnested = [[1], [2]]\npart = nested[:]\npart[0].append(9)\nprint(nested)",
          caption: "The slice has its own outer list, while the nested list at position zero remains shared.",
        },
        recallRule: "An index selects one position; a slice walks from an included start to an excluded stop and returns a shallow list.",
      },
    ],
  },
  "python-list-append-extend-insert-remove-pop": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define append as adding exactly one object",
        stage: "append adds one object",
        spokenText: "`append(x)` puts `x` at the end as one new list element. If `x` is itself `[3, 4]`, that entire list becomes one nested element. `append` mutates the existing list and returns `None`; assigning its result back to the list therefore loses the list reference.",
      },
      {
        cue: "Define extend as consuming an iterable",
        stage: "extend consumes an iterable",
        spokenText: "`extend(values)` iterates over `values` and appends each produced item. Starting with `[1, 2]`, extending with `[3, 4]` produces `[1, 2, 3, 4]`, while appending the same value produces `[1, 2, [3, 4]]`. Strings are iterable too, so extending with `\"ab\"` adds two characters.",
      },
      {
        cue: "Place insert at a selected position",
        stage: "insert shifts later items",
        spokenText: "`insert(i, x)` adds one object before position `i`. Existing references from that position onward shift to the right, so insertion near the front takes linear time. It is useful for occasional positional edits, but repeated left-end queue operations need a structure designed for both ends.",
      },
      {
        cue: "Separate removal by value from removal by position",
        stage: "Removal has two coordinates",
        spokenText: "`remove(x)` searches by equality and deletes the first matching value; it returns `None` and raises `ValueError` when no match exists. `pop(i)` removes by position and returns the item; `pop()` uses the final position and an empty list raises `IndexError`. `del` is a statement that deletes an index or slice without returning the removed data.",
        support: {
          type: "comparison",
          title: "Choose removal by what the code knows",
          items: [
            {
              label: "remove(x)",
              value: "known value",
              detail: "Delete the first equal value; no removed value is returned.",
              tone: "orange",
            },
            {
              label: "pop(i)",
              value: "known position",
              detail: "Delete by index and return the removed item.",
              tone: "green",
            },
            {
              label: "del items[i:j]",
              value: "index or slice",
              detail: "Delete positions without producing a result value.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Connect method choice to result shape and cost",
        stage: "Front changes cost more",
        spokenText: "Appending and popping at the right edge are amortized `O(1)`, while inserting or deleting near the front is `O(n)` because later references shift. Use `collections.deque` for a real queue with frequent left-end work. `clear()` removes every item while keeping the same list object. Choose from one object, an iterable, a value, or a position rather than from method names alone.",
        support: {
          type: "code",
          title: "See addition and removal create different shapes",
          language: "python",
          code: "values = [1, 2]\nvalues.append([3, 4])\nprint(values)\n\nflat = [1, 2]\nflat.extend([3, 4])\nflat.insert(1, 9)\nprint(flat)\n\nflat.remove(9)\nlast = flat.pop()\ndel flat[:1]\nprint(last, flat)",
          caption: "`append` nests one list, `extend` adds its items, and the removal operations differ in whether they return data.",
        },
        recallRule: "Add one object with `append`, consume many with `extend`, remove by value with `remove`, and remove-and-return by position with `pop`.",
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
console.log(`Curated Interview Answer presentations for ${curated} list questions`);
