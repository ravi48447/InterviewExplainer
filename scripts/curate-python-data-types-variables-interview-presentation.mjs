#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/python-syntax-essentials/data-types-and-variables/complete-qa.json",
);

const presentations = {
  "python-mutable-immutable-types": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define mutability on the object rather than the name",
        stage: "Objects decide mutability",
        spokenText: "Mutability is a property of an object, not of the variable name that refers to it. A mutable object can keep the same identity while its contents change; lists, dictionaries, sets, and bytearrays are common examples. An immutable object's value cannot change after creation; numbers, strings, bytes, tuples, and frozensets are common examples.",
      },
      {
        cue: "Connect assignment to shared identity",
        stage: "Assignment creates aliases",
        spokenText: "Assignment binds a name to an existing object and does not copy it. After `alias = original`, both names may reach the same list. Calling `original.append(3)` changes that one list, so the update is also visible through `alias`. This is shared identity, not Python synchronizing two separate values.",
        support: {
          type: "trace",
          title: "Two names follow one list",
          items: [
            {
              label: "original = [1, 2]",
              value: "list A",
              detail: "The first name refers to a new mutable list object.",
              tone: "blue",
            },
            {
              label: "alias = original",
              value: "same list A",
              detail: "Assignment creates another reference; it creates no list.",
              tone: "orange",
            },
            {
              label: "original.append(3)",
              value: "[1, 2, 3]",
              detail: "Both names now observe the changed contents of list A.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Contrast an in-place change with name rebinding",
        stage: "Mutation is not rebinding",
        spokenText: "With an immutable integer, `count += 1` produces another integer and rebinds `count`; it does not modify the object representing `3`. With a list, `items += [4]` can update the same list in place. The same rule crosses a function call: appending to a received list affects the caller's object, while adding to a received integer only changes the function's local binding unless the new value is returned.",
        support: {
          type: "code",
          title: "A list mutates while an integer is rebound",
          language: "python",
          code: "def add_tag(tags):\n    tags.append(\"python\")\n\ndef increment(number):\n    number += 1\n    return number\n\nskills = [\"sql\"]\nalias = skills\nadd_tag(skills)\n\nlevel = 1\nnew_level = increment(level)\nprint(skills, alias)\nprint(level, new_level)",
          caption: "The two list names show the same change; `level` remains `1` while the returned value is `2`.",
        },
      },
      {
        cue: "Explain the nested-object and hashability boundary",
        stage: "Immutable can contain mutable",
        spokenText: "Immutability is not always deep. A tuple cannot replace one of its element references, but a list stored inside that tuple can still be changed. That tuple is also not hashable because one of its elements is unhashable. Mutable collections suit state that should evolve; immutable values suit stable facts and dictionary keys when every contained value is hashable.",
        recallRule: "Ask whether the object changes in place, whether another name shares it, and whether nested values can still mutate.",
      },
    ],
  },
  "python-syntax-essentials-data-types-and-variables-when-to-use": {
    answerSize: "standard",
    beats: [
      {
        cue: "Choose a list for a changing sequence",
        stage: "Lists keep an editable order",
        spokenText: "Use a list for an ordered sequence whose contents may grow, shrink, or be replaced. A task queue shown in arrival order is a simple example. Lists allow duplicates, support indexing, and make operations such as `tasks.append(new_task)` explicit. They are a poor substitute for a keyed index or for uniqueness rules that must be enforced manually.",
        support: {
          type: "comparison",
          title: "The relationship each collection expresses",
          items: [
            {
              label: "list",
              value: "ordered sequence",
              detail: "Keeps position and duplicates; the container can change.",
              tone: "blue",
            },
            {
              label: "tuple",
              value: "fixed sequence",
              detail: "Keeps position but cannot add, remove, or replace elements.",
              tone: "neutral",
            },
            {
              label: "set",
              value: "unique membership",
              detail: "Stores hashable values once and supports set operations.",
              tone: "green",
            },
            {
              label: "dict",
              value: "keyed lookup",
              detail: "Connects each unique hashable key to a value.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Choose a tuple for a fixed-position value",
        stage: "Tuples fix the outer shape",
        spokenText: "Use a tuple when positions form a fixed group, such as `(latitude, longitude)`, and the outer structure should not be edited. A tuple may be a dictionary key when every element is hashable. It does not freeze objects stored inside it, so a tuple containing a list is neither deeply immutable nor hashable.",
      },
      {
        cue: "Choose a set for uniqueness and membership",
        stage: "Sets model unique membership",
        spokenText: "Use a set when the important question is whether a value is present, when duplicates should disappear, or when union, intersection, and difference describe the problem. `required_skills <= candidate_skills` directly tests whether every required skill is present. Do not choose a set when duplicate counts or positional order carry meaning, and do not depend on its iteration order.",
      },
      {
        cue: "Choose a dictionary for named lookup",
        stage: "Dictionaries map keys to data",
        spokenText: "Use a dictionary when a meaningful key identifies each value, as in `users_by_id[user_id]`. Keys are unique and hashable, while values may be any objects. Dictionaries preserve insertion order in current Python, but their main signal is the key-to-value relationship and direct average-case lookup rather than a repeated scan through a list.",
      },
      {
        cue: "Show how one model can use all four relationships",
        stage: "Use each type for one rule",
        spokenText: "One order model can use several collection types without conflict: a list keeps line-item order, each tuple holds a fixed `(sku, quantity)` pair, a set records unique promotion codes, and a dictionary finds product names by SKU. The best type is the narrowest one that preserves the ordering, duplicate, mutation, and lookup rules the application actually needs.",
        support: {
          type: "code",
          title: "Four collections in one small order",
          language: "python",
          code: "line_items = [(\"A17\", 2), (\"B04\", 1)]\napplied_codes = {\"WELCOME\", \"FREESHIP\"}\nproducts = {\"A17\": \"Keyboard\", \"B04\": \"Mouse\"}\n\nfor sku, quantity in line_items:\n    print(quantity, products[sku])\n\nprint(\"FREESHIP\" in applied_codes)",
          caption: "Each type records a different rule instead of forcing every relationship into a list.",
        },
        recallRule: "Use list for ordered work, tuple for fixed positions, set for unique membership, and dict for keyed lookup.",
      },
    ],
  },
  "python-syntax-essentials-data-types-and-variables-common-mistake": {
    answerSize: "compact",
    beats: [
      {
        cue: "Place default evaluation at function definition time",
        stage: "Defaults begin at definition",
        spokenText: "Python evaluates default argument expressions when the `def` statement runs. The resulting objects are stored with the function and reused whenever a later call omits those arguments. A default list therefore lives with the function rather than belonging to one call, which is the lifetime mismatch behind this bug.",
        support: {
          type: "trace",
          title: "One default object survives multiple calls",
          items: [
            {
              label: "Function is defined",
              value: "basket = []",
              detail: "Python creates and stores one list object.",
              tone: "blue",
            },
            {
              label: "First omitted argument",
              value: "['book']",
              detail: "The call appends to the stored default list.",
              tone: "orange",
            },
            {
              label: "Second omitted argument",
              value: "['book', 'pen']",
              detail: "The next call receives that already changed list.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Show how hidden state reaches the next call",
        stage: "Later calls reuse the object",
        spokenText: "In `def add_item(item, basket=[])`, the expression `basket.append(item)` mutates the stored default. Calling `add_item(\"book\")` and then `add_item(\"pen\")` makes the second result contain both items. The problem is not that lists are invalid arguments; it is that callers expecting fresh state silently share one object.",
      },
      {
        cue: "Move collection creation to call time",
        stage: "None delays creation",
        spokenText: "When every omitted argument needs a new collection, use `None` as a sentinel and create the list inside the function. Check `basket is None`, not `if not basket`, because an explicitly supplied empty list is a valid caller-owned object and should not be replaced. A supplied list is still mutated intentionally by this version.",
        support: {
          type: "code",
          title: "Definition-time default and call-time list",
          language: "python",
          code: "def unsafe_add(item, basket=[]):\n    basket.append(item)\n    return basket\n\ndef safe_add(item, basket=None):\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket\n\nprint(unsafe_add(\"book\"))\nprint(unsafe_add(\"pen\"))\nprint(safe_add(\"book\"))\nprint(safe_add(\"pen\"))",
          caption: "The unsafe calls accumulate state; the safe omitted arguments produce independent lists.",
        },
      },
      {
        cue: "Separate deliberate shared state from accidental state",
        stage: "Make shared state visible",
        spokenText: "A mutable default can deliberately act as a cache or accumulator, but that shared lifetime should be obvious and documented. In application code, an explicitly named cache object, closure, or class usually communicates the ownership better than hidden state in a signature. Keep stable immutable defaults in the signature and create per-call mutable state inside the body.",
        recallRule: "Default expressions run once at definition time; create mutable per-call values inside the function body.",
      },
    ],
  },
  "python-syntax-essentials-data-types-and-variables-compare": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define assignment as another reference",
        stage: "Assignment copies no object",
        spokenText: "Assignment creates no copy. After `alias = original`, both names refer to the same outer object and therefore reach the same nested objects too. Any in-place change made through either name is visible through the other. This is appropriate only when both parts of the program are meant to share one state.",
        support: {
          type: "comparison",
          title: "Where each operation creates a new object",
          items: [
            {
              label: "Assignment",
              value: "no new object",
              detail: "The outer and every nested object are shared.",
              tone: "orange",
            },
            {
              label: "Shallow copy",
              value: "new outer",
              detail: "The outer container is new, but nested objects remain shared.",
              tone: "blue",
            },
            {
              label: "Deep copy",
              value: "recursive copies",
              detail: "Nested mutable objects are normally copied into a separate graph.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Separate the outer container with a shallow copy",
        stage: "Shallow copy splits the outer",
        spokenText: "A shallow copy creates a new outer container and places references to the original nested objects inside it. For a list, `original.copy()`, `list(original)`, slicing, and `copy.copy(original)` are shallow operations. Appending an outer element affects only the copy, but editing `shallow[0]` may still change data seen by `original[0]`.",
      },
      {
        cue: "Explain recursive copying and its memo",
        stage: "Deep copy follows references",
        spokenText: "`copy.deepcopy(original)` walks the object graph and recursively copies nested content. It keeps a memo of objects already copied, which preserves repeated references consistently and prevents infinite recursion on cycles. The result can edit copied nested lists or dictionaries without changing their originals, unless a type defines special copying behaviour or remains shared.",
      },
      {
        cue: "Demonstrate the outer and nested identity boundary",
        stage: "Watch identity at both levels",
        spokenText: "The important test is not only whether the outer lists differ, but whether their nested elements differ. In the example, `shallow.append(...)` changes only the shallow outer list, `shallow[0].append(...)` reaches a nested list shared with the original, and an edit inside `deep` stays inside the copied graph.",
        support: {
          type: "code",
          title: "Trace one outer change and two nested changes",
          language: "python",
          code: "from copy import deepcopy\n\noriginal = [[\"Ada\"], [\"Linus\"]]\nalias = original\nshallow = original.copy()\ndeep = deepcopy(original)\n\nshallow.append([\"Grace\"])\nshallow[0].append(\"Lovelace\")\ndeep[1].append(\"Torvalds\")\n\nprint(alias is original)\nprint(original)\nprint(shallow)\nprint(deep)",
          caption: "The shallow outer list differs, but its first nested list is still shared with `original`.",
        },
      },
      {
        cue: "Choose the smallest ownership boundary that works",
        stage: "Copy only the needed boundary",
        spokenText: "Use a shallow copy when only outer membership or order will change. Consider deep copy when nested mutable state must be independent, but remember that it costs more work and memory and may be wrong for files, connections, caches, or identity-sensitive objects. A targeted rebuild is often clearer because it copies exactly the fields whose ownership must change.",
        recallRule: "Assignment shares everything, shallow copy separates the outer object, and deep copy follows nested references.",
      },
    ],
  },
  "python-syntax-essentials-data-types-and-variables-scenario": {
    answerSize: "standard",
    beats: [
      {
        cue: "Reduce the symptom to the earliest changed value",
        stage: "Find the first changed state",
        spokenText: "Reduce the failure to the smallest object and operation that still reproduces the unexpected change. Then move backward from the visible symptom to the first point where the value differs from what was expected. Later incorrect values are usually consequences; the first in-place write is the useful debugging target.",
        support: {
          type: "trace",
          title: "Follow identity to the ownership decision",
          items: [
            {
              label: "Reproduce",
              value: "one mutation",
              detail: "Keep the smallest nested structure that still fails.",
              tone: "blue",
            },
            {
              label: "Check identity",
              value: "a is b",
              detail: "Learn whether two paths reach the same object.",
              tone: "orange",
            },
            {
              label: "Locate the write",
              value: "first change",
              detail: "Inspect every in-place operation after the last good state.",
              tone: "orange",
            },
            {
              label: "Set ownership",
              value: "mutate or copy",
              detail: "Make the chosen contract explicit and test it.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Use object identity to prove an alias",
        stage: "Identity reveals the alias",
        spokenText: "Compare identity as well as value. `a == b` says two objects currently hold equal values, while `a is b` says both names refer to one object. Temporary `id()` output can help pair references during debugging, but application logic should not depend on that numeric ID. Draw the names and the objects they reach when nesting is involved.",
      },
      {
        cue: "Inspect every operation that can mutate in place",
        stage: "In-place operations are writes",
        spokenText: "Between the last good state and the first bad state, inspect calls such as `append`, `extend`, `sort`, `dict.update`, `set.add`, item assignment, deletion, and mutable `+=`. A helper can change an object owned by its caller even when it returns nothing. The write may be far from the code that later notices it.",
      },
      {
        cue: "Expose the nested object shared by a shallow copy",
        stage: "Nested aliases survive copies",
        spokenText: "A shallow copy can make the outer container look independent while its nested records remain shared. After `draft = saved.copy()`, `draft is saved` is false, but `draft[0] is saved[0]` can be true. Building the exact public record avoids removing a private field from the saved source.",
        support: {
          type: "code",
          title: "Check the nested identity, then rebuild precisely",
          language: "python",
          code: "saved = [{\"name\": \"Ada\", \"secret\": \"token\"}]\ndraft = saved.copy()\n\nprint(draft is saved)\nprint(draft[0] is saved[0])\n\npublic = [\n    {key: value for key, value in record.items() if key != \"secret\"}\n    for record in saved\n]\n\nprint(public)\nprint(saved)",
          caption: "The outer list is new, the nested dictionary is shared, and the targeted rebuild leaves `saved` unchanged.",
        },
      },
      {
        cue: "Turn the ownership rule into a regression test",
        stage: "Make ownership explicit",
        spokenText: "Repair the ownership boundary rather than adding copies everywhere. A mutating function can make that contract clear in its name and documentation; a non-mutating function can return newly built data; selected nested fields can be copied when only they need isolation. The regression test should assert both the result and whether the original input must remain unchanged.",
        recallRule: "Find the first write, prove the alias with identity, and test the intended ownership of both output and input.",
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
console.log(`Curated Interview Answer presentations for ${curated} data-type questions`);
