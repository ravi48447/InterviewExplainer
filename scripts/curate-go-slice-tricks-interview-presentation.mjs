#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-slices-maps/slice-tricks/complete-qa.json",
);
const fence = String.fromCharCode(96).repeat(3);

const lessons = {
  "go-slices-maps-slice-tricks-interview-basics": {
    directAnswer: "To delete a slice element while keeping order, move every later element one position left, clear the obsolete tail slot when it may hold references, and shorten the slice. The standard form is `values = slices.Delete(values, i, i+1)`. It returns the shorter slice and preserves the relative order of all remaining elements. The work is O(n-i) because the suffix must move. The operation reuses and rewrites the backing array, so other slice aliases can observe the change.",
    quick: [
      "Ordered deletion closes the gap because a slice's elements are contiguous.",
      "Delete one element with `values = slices.Delete(values, i, i+1)`.",
      "Always keep the returned slice because its length is shorter.",
      "The operation is O(n-i) because elements after the gap move left.",
      "The obsolete tail is cleared, but aliases still observe the backing-array rewrite.",
    ],
    beats: [
      {
        cue: "Explain why preserving order requires movement",
        stage: "Deletion closes the gap",
        spokenText: "A slice exposes contiguous array positions. Removing index `i` while preserving order leaves a gap, so the elements after it must move left. Deleting 20 from `[10, 20, 30, 40]` therefore produces `[10, 30, 40]`.",
      },
      {
        cue: "Show the standard operation and returned descriptor",
        stage: "Delete returns a new length",
        spokenText: "For one element, write `values = slices.Delete(values, i, i+1)`. The second index is exclusive. The helper mutates the element storage and returns a slice descriptor whose length is one smaller, so ignoring the result keeps the wrong logical length.",
      },
      {
        cue: "Connect order preservation to complexity",
        stage: "The suffix sets the cost",
        spokenText: "The cost depends on how much data follows the removed range. Deleting near the front can move almost every remaining element, making the worst case O(n). Deleting near the end moves little or no suffix.",
      },
      {
        cue: "Explain why clearing the old tail matters",
        stage: "The old tail still exists",
        spokenText: "Shortening a slice does not shrink its backing array. The old final slot remains outside the returned length. Current `slices.Delete` clears obsolete slots, which prevents pointers, strings, slices, or maps there from keeping referenced data reachable.",
      },
      {
        cue: "State the ownership boundary",
        stage: "Aliases observe the rewrite",
        spokenText: "The helper performs an in-place rewrite before returning the shorter view. Another slice that shares the same array may see shifted values or the cleared tail. Make a copy first when another owner needs an unchanged snapshot.",
        recallRule: "Ordered deletion shifts the suffix, clears the old tail, and returns a shorter slice over rewritten storage.",
      },
    ],
    overview: {
      title: "Ordered deletion rewrites a contiguous slice",
      content: "A slice does not own a removable node for each element. It presents a contiguous range of an underlying array, and the array keeps its allocated slots. To remove an element while preserving order, the algorithm overwrites the gap with the suffix and then returns a slice with a smaller length.\n\nThe standard helper expresses the complete operation as `values = slices.Delete(values, i, j)`. It removes the half-open range from `i` through `j-1`. For one element, use `i, i+1`. Both indexes must describe a valid range. The returned slice is required because the helper cannot replace the caller's slice descriptor by value.\n\nMoving the suffix gives ordered deletion its cost. Removing near the front may copy almost all later elements, while removing the last element needs no shift. The running time is O(len(values)-j), plus the removed tail that must be cleared. This is the price of keeping every survivor in the same relative order.\n\nThe backing array remains allocated after the result becomes shorter. Obsolete positions can otherwise retain references that no longer belong to the logical collection. Current `slices.Delete` clears those positions. It still reuses and mutates the array, so aliases may observe the shifted values and cleared tail. If another part of the program needs the original contents, clone the slice before deleting or build a separate result instead of relying on in-place ownership.",
    },
    visual: {
      type: "flow_diagram",
      title: "An ordered delete closes one gap",
      content: "```mermaid\nflowchart LR\n  A[10 | 20 | 30 | 40] --> B[Remove index 1]\n  B --> C[Shift 30 and 40 left]\n  C --> D[Clear obsolete last slot]\n  D --> E[Return 10 | 30 | 40]\n```\nThe suffix moves so every remaining value keeps its original order.",
    },
    example: {
      title: "Delete in order and observe the cleared tail",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"slices\"\n)\n\nfunc main() {\n\tstorage := []string{\"A\", \"B\", \"C\", \"D\"}\n\tresult := slices.Delete(storage, 1, 2)\n\n\tfmt.Println(\"result:\", result)\n\tfmt.Printf(\"old view: %q\\n\", storage)\n\tfmt.Println(\"tail cleared:\", storage[3] == \"\")\n}",
    },
  },
  "go-slices-maps-slice-tricks-when-to-use": {
    directAnswer: "When order does not matter, delete a slice element by copying the last live element into the removed position, clearing the old last slot, and returning `values[:len(values)-1]`. Only one live element moves, so the operation is O(1). It changes order and mutates shared backing storage, so it fits sets, bags, or internal pools—not ranked results or any sequence whose position has meaning. Validate the index and always keep the returned shorter slice.",
    quick: [
      "Save the last index with `last := len(values) - 1`.",
      "Fill the gap with `values[i] = values[last]`.",
      "Clear `values[last:]` when the element can retain referenced data.",
      "Return `values[:last]`; the work is O(1), but order changes.",
      "Use this only when positions and relative order have no meaning.",
    ],
    beats: [
      {
        cue: "Remove the expensive order requirement",
        stage: "Last value fills the gap",
        spokenText: "If order is irrelevant, the suffix does not need to shift. Put the last live value into the removed slot with `values[i] = values[last]`. Removing B from `[A, B, C, D]` can become `[A, D, C]`.",
      },
      {
        cue: "Clean the slot that is leaving the logical slice",
        stage: "Clearing drops old references",
        spokenText: "After the move, the old final position is redundant but still exists in the array. `clear(values[last:])` writes the element type's zero value there, preventing an obsolete pointer, string, slice, or map from retaining referenced data.",
      },
      {
        cue: "Return the shorter slice descriptor",
        stage: "Reslicing removes the tail",
        spokenText: "Return `values[:last]` and assign that result at the call site. The backing array size is unchanged; only the slice's logical length falls by one. Check that `i` is between zero and `len(values)-1` before indexing.",
      },
      {
        cue: "Explain the exact performance exchange",
        stage: "Constant work changes order",
        spokenText: "One assignment, one clear, and one reslice do not grow with the collection length, so deletion is O(1). The moved final value changes position, which is the deliberate trade-off that avoids an O(n) suffix shift.",
      },
      {
        cue: "Tie the operation to the collection contract",
        stage: "Use only for unordered data",
        spokenText: "This technique fits an internal bag, free list, randomized pool, or another collection where index is temporary. It is wrong for queues, sorted data, UI rows, logs, or any API that promises stable order. Aliases also observe the mutation.",
        recallRule: "Replace with the last value for O(1) deletion only when the collection is unordered by contract.",
      },
    ],
    overview: {
      title: "Unordered deletion trades position for constant work",
      content: "Stable slice deletion is expensive because later elements must keep their relative positions. When the collection has no ordering rule, the last live element can fill the removed slot instead. The algorithm does not need to visit or shift the suffix.\n\nFirst validate the removal index and calculate `last := len(values) - 1`. Assign `values[i] = values[last]`, clear the former last slot, and return `values[:last]`. This also handles removal of the final element: the assignment writes the value to its existing position, the clear zeros it, and reslicing removes that position from the logical view.\n\nThe clear matters for element types that carry references. A shortened slice does not release its backing array, and another alias may keep the full array reachable. Leaving a pointer, map, slice, interface, or string in the old tail can therefore retain data that the collection considers deleted. Zeroing the slot removes that stale link.\n\nThe operation is O(1), but the moved element receives a different index. That makes the technique correct only when positions and relative order are not part of the contract. It can work well for pools and unordered internal sets. It does not work for sorted results, queues, presentation order, or identifiers stored by index elsewhere. The rewrite also affects other slices sharing the array, so clone first when the input is not privately owned.",
    },
    visual: {
      type: "flow_diagram",
      title: "The last value fills the removed slot",
      content: "```mermaid\nflowchart LR\n  A[A | B | C | D] --> B[Remove index 1]\n  B --> C[Copy D into index 1]\n  C --> D[Clear old last slot]\n  D --> E[Return A | D | C]\n```\nOnly one live value moves, so the operation is constant time and order changes.",
    },
    example: {
      title: "Remove from an unordered slice and clear the tail",
      code: "package main\n\nimport \"fmt\"\n\nfunc removeUnordered[T any](values []T, i int) []T {\n\tif i < 0 || i >= len(values) {\n\t\tpanic(\"index out of range\")\n\t}\n\tlast := len(values) - 1\n\tvalues[i] = values[last]\n\tclear(values[last:])\n\treturn values[:last]\n}\n\nfunc main() {\n\tstorage := []string{\"A\", \"B\", \"C\", \"D\"}\n\tresult := removeUnordered(storage, 1)\n\n\tfmt.Println(\"result:\", result)\n\tfmt.Printf(\"old view: %q\\n\", storage)\n\tfmt.Println(\"tail cleared:\", storage[3] == \"\")\n}",
    },
  },
  "go-slices-maps-slice-tricks-common-mistake": {
    directAnswer: "To copy a slice into independent outer storage, use `clone := slices.Clone(source)` or allocate `clone := make([]T, len(source))` and call `copy(clone, source)`. Plain assignment copies only the slice descriptor and leaves both slices sharing elements. Both cloning methods are shallow: they copy the element values, but pointers, maps, inner slices, and other references inside those values can still point to the same data. Build an explicit deep copy only when that nested ownership is required.",
    quick: [
      "`clone := source` copies a descriptor and normally shares the backing array.",
      "`slices.Clone(source)` creates independent outer element storage.",
      "`make` plus `copy` is the explicit alternative and reports how many elements copied.",
      "Both methods are shallow, so referenced data inside elements may stay shared.",
      "Clone at an ownership boundary when later element writes must not affect the caller.",
    ],
    beats: [
      {
        cue: "Rule out ordinary assignment as a clone",
        stage: "Assignment shares element data",
        spokenText: "The statement `clone := source` copies only the slice descriptor. Both descriptors normally reach the same underlying array, so `clone[0] = value` can overwrite what `source[0]` returns.",
      },
      {
        cue: "Show the shortest standard copy",
        stage: "Clone copies outer slots",
        spokenText: "`clone := slices.Clone(source)` copies the element slots into separate outer storage. Replacing `clone[i]` then leaves `source[i]` unchanged. Clone also preserves a nil input as nil, which can matter at a representation boundary.",
      },
      {
        cue: "Explain the explicit allocation form",
        stage: "Make and copy are explicit",
        spokenText: "The equivalent visible steps are `clone := make([]T, len(source))` followed by `copy(clone, source)`. The built-in returns the number of elements copied and copies only up to the shorter of source and destination.",
      },
      {
        cue: "Define the shallow-copy boundary",
        stage: "Nested data may stay shared",
        spokenText: "A slice element can itself contain a pointer, map, or slice. Cloning copies that value but not the referenced object. With `[][]int`, outer slots become independent while `clone[0][0] = 9` can still change the first inner slice seen by source.",
      },
      {
        cue: "Choose copy depth from ownership",
        stage: "Copy at ownership boundaries",
        spokenText: "A shallow clone is enough for integers and value-only structs. When nested data must also be independent, clone each owned inner value according to the model. Copying has O(n) time and outer storage cost, so use it where ownership requires it.",
        recallRule: "Clone separates the outer slice storage; deep independence requires copying referenced values too.",
      },
    ],
    overview: {
      title: "Independent slice storage is still a shallow copy",
      content: "Assigning a slice does not duplicate its elements. A slice value describes an underlying array, length, and capacity, so `second := first` copies that description. A write through either slice can affect shared array positions. This is useful when mutation is intentionally shared, but it is not an independent copy.\n\nUse `slices.Clone(source)` for a concise outer copy. It returns a slice whose element slots do not overlap the source slots, and it preserves nilness. The explicit form creates a destination with `make([]T, len(source))` and calls `copy(destination, source)`. The built-in copies up to the shorter length and returns the number copied, which is useful when destination size is chosen separately.\n\nBoth operations are shallow because they use ordinary assignment for each element. Integers, strings, and value-only structs are copied as values. A pointer element is still a pointer to the same object. A map element still names the same map, and an inner slice still describes the same inner array. Cloning `[][]byte` therefore separates the outer rows but not each row's bytes.\n\nDeep copying is not one universal operation. The program must decide which referenced objects it owns, whether identity should remain shared, and how cycles are handled. Clone each inner slice or object only when the boundary promises full independence. A shallow clone is the right default when only replacement of outer elements must be isolated.",
    },
    visual: {
      type: "comparison_table",
      title: "What each slice copy operation separates",
      content: "| Operation | New outer storage | Nested references | Nil input |\n|---|---|---|---|\n| `b := a` | No | Shared | Preserved |\n| `slices.Clone(a)` | Yes | Still shared shallowly | Preserved |\n| `make` plus `copy` | Yes | Still shared shallowly | Destination policy decides |\n| Model-specific deep copy | Yes | Copied only by the chosen policy | Policy decides |",
    },
    example: {
      title: "Separate outer slots, then copy one inner slice",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"slices\"\n)\n\nfunc main() {\n\tsource := [][]int{{1, 2}, {3}}\n\tclone := slices.Clone(source)\n\tclone[0][0] = 9\n\tfmt.Println(\"after shallow change:\", source, clone)\n\n\tclone[0] = slices.Clone(clone[0])\n\tclone[0][0] = 7\n\tfmt.Println(\"after inner clone:\", source, clone)\n\n\tvar nilValues []int\n\tfmt.Println(\"nil preserved:\", slices.Clone(nilValues) == nil)\n}",
    },
  },
  "go-slices-maps-slice-tricks-compare": {
    directAnswer: "To filter a slice in place, start with `out := values[:0]`, scan the original slice, and append only values that should remain. The kept values are compacted into the same backing array. Clear `values[len(out):]` before discarding the old length so rejected pointer-like values do not remain in obsolete slots, then keep `out`. This is O(n) and avoids another element array, but aliases observe overwritten and cleared data. Allocate a fresh result when the input must remain unchanged.",
    quick: [
      "Start with `out := values[:0]` to reuse all existing capacity.",
      "Append only accepted values; the write position never passes the read position.",
      "Clear `values[len(out):]` while the original length is still available.",
      "Keep `out`; filtering is O(n) and does not need another element array.",
      "Use a fresh destination when aliases or callers need the original contents.",
    ],
    beats: [
      {
        cue: "Create an empty destination over existing storage",
        stage: "Zero length reuses capacity",
        spokenText: "`out := values[:0]` creates a zero-length slice that starts at the same array position and keeps the original capacity. Appending to out can therefore write accepted values from the beginning without allocating another element array.",
      },
      {
        cue: "Explain why forward compaction is safe",
        stage: "Read ahead and write behind",
        spokenText: "Scan `values` from left to right and run `out = append(out, value)` only when the value passes the predicate. The write position is never ahead of the current read position, so it cannot overwrite an element that has not been tested.",
      },
      {
        cue: "Remove stale references beyond the result",
        stage: "Clear the rejected tail",
        spokenText: "After compaction, positions from `len(out)` to the old length still exist in the backing array. Call `clear(values[len(out):])` before losing the old view so rejected strings, pointers, maps, or slices do not keep data reachable.",
      },
      {
        cue: "State the ownership consequence",
        stage: "Aliases see compacted data",
        spokenText: "The operation overwrites and clears shared array positions. Another slice alias can observe the compacted prefix or zeroed tail even when its own descriptor keeps the old length. In-place filtering is safe only when this code owns those mutations.",
      },
      {
        cue: "Contrast a fresh result and standard helper",
        stage: "Fresh output protects input",
        spokenText: "Allocate `out := make([]T, 0, len(values))` when the source must remain a snapshot. For a standard in-place delete predicate, `slices.DeleteFunc` also compacts, clears obsolete slots, and returns the shorter slice. Choose from the ownership contract.",
        recallRule: "Reuse storage only when aliases may observe the compacted prefix and cleared tail.",
      },
    ],
    overview: {
      title: "In-place filtering compacts owned slice storage",
      content: "Filtering creates a sequence containing only values accepted by a predicate. A fresh destination is simple, but it needs another element array. When the input storage is privately owned, the existing array can also serve as the destination by taking the zero-length view `out := values[:0]`.\n\nThe algorithm reads the original slice from left to right and appends accepted values to out. The number of accepted values can never exceed the number already examined, so the write position stays at or behind the read position. Earlier writes therefore do not destroy an unread value. The scan is O(n), and out has enough capacity for every possible survivor, so no new element array is required.\n\nCompaction leaves an obsolete tail between the result length and the original length. Those slots are outside out but remain inside the allocated array. If they still contain pointers, maps, slices, interfaces, or strings, they can retain data that the logical result rejected. Clear `values[len(out):]` while values still has its old length, then return or assign out.\n\nReusing storage is visible to every alias of the array. A caller expecting the original sequence may see overwritten values or cleared slots. Build a fresh destination with `make([]T, 0, len(values))` when input preservation matters. The standard `slices.DeleteFunc` is another in-place option when a predicate names values to remove; it also returns the shorter slice and clears obsolete positions.",
    },
    visual: {
      type: "flow_diagram",
      title: "Accepted values compact toward the front",
      content: "```mermaid\nflowchart LR\n  A[Read each original value] --> B{Keep it?}\n  B -- Yes --> C[Append at next output position]\n  B -- No --> D[Skip it]\n  C --> E[Continue scan]\n  D --> E\n  E --> F[Clear slots after output length]\n  F --> G[Return shorter view]\n```\nThe output position never moves ahead of the read position.",
    },
    example: {
      title: "Compact non-empty strings and clear rejected slots",
      code: "package main\n\nimport \"fmt\"\n\nfunc nonEmpty(values []string) []string {\n\tout := values[:0]\n\tfor _, value := range values {\n\t\tif value != \"\" {\n\t\t\tout = append(out, value)\n\t\t}\n\t}\n\tclear(values[len(out):])\n\treturn out\n}\n\nfunc main() {\n\tstorage := []string{\"Go\", \"\", \"Ruby\", \"\"}\n\tresult := nonEmpty(storage)\n\n\tfmt.Println(\"result:\", result)\n\tfmt.Printf(\"old view: %q\\n\", storage)\n\tfmt.Println(\"tail cleared:\", storage[2] == \"\", storage[3] == \"\")\n}",
    },
  },
};

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
let curated = 0;

for (const [targetSlug, lesson] of Object.entries(lessons)) {
  const matches = document.questions.filter((question) => question.slug === targetSlug);
  if (matches.length !== 1) {
    throw new Error("Expected exactly one " + targetSlug + " question, found " + matches.length);
  }

  const question = matches[0];
  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const speaking = sections.find((section) => section.type === "speakable_answer");
  const overview = sections.find((section) => section.type === "overview");
  const visual = sections.find((section) => section.type === lesson.visual.type);
  const example = sections.find((section) => section.type === "code_example");
  if (!quick || !speaking || !overview || !visual || !example) {
    throw new Error("Missing an existing slice-trick section for " + targetSlug);
  }

  question.direct_answer = lesson.directAnswer;
  quick.items = lesson.quick;
  speaking.answerSize = "compact";
  speaking.beats = lesson.beats;
  speaking.content = lesson.beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  overview.title = lesson.overview.title;
  overview.content = lesson.overview.content;
  visual.title = lesson.visual.title;
  visual.content = lesson.visual.content;
  example.title = lesson.example.title;
  example.content = fence + "go\n" + lesson.example.code.trim() + "\n" + fence;
  curated += 1;
}

if (curated !== document.questions.length) {
  throw new Error("Curated " + curated + " of " + document.questions.length + " questions");
}

fs.writeFileSync(questionFile, JSON.stringify(document, null, 2) + "\n");
console.log("Curated " + curated + " Go slice-trick lessons");
