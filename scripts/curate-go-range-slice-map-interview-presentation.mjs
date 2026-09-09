#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-slices-maps/range-over-slice-map/complete-qa.json",
);
const fence = String.fromCharCode(96).repeat(3);

const lessons = {
  "go-slices-maps-range-over-slice-map-interview-basics": {
    directAnswer: "For an array or slice, two-value range produces an integer index and a copy of the element at that index. With one variable, it produces only the index, and indexes arrive in increasing order. For a map, two-value range produces a key and a copy of its current value; with one variable, it produces only the key, and order is unspecified. Use the blank identifier only to discard a produced value you do not need. Reassigning the copied element or map value does not replace the collection entry.",
    quick: [
      "Array and slice range produces \u0060index, value\u0060 in increasing index order.",
      "One variable over an array or slice receives the index, not the element.",
      "Map range produces \u0060key, value\u0060 in an unspecified order.",
      "One variable over a map receives the key.",
      "The element or map value is copied into the iteration variable.",
    ],
    beats: [
      {
        cue: "Describe the pair for arrays and slices",
        stage: "Slices yield index and value",
        spokenText: "For a slice, \u0060for i, value := range items\u0060 produces integer indexes from zero through the original length minus one. Value is assigned from \u0060items[i]\u0060. Arrays use the same index-and-value shape.",
      },
      {
        cue: "Explain the one-variable slice form",
        stage: "One slice variable is index",
        spokenText: "With one variable, \u0060for i := range items\u0060 receives only the index. It does not receive each element. If the index is not needed but the element is, write \u0060for _, value := range items\u0060 and discard the first result explicitly.",
      },
      {
        cue: "Describe the pair for maps",
        stage: "Maps yield key and value",
        spokenText: "For a map, \u0060for key, value := range scores\u0060 produces a key and the value associated with that key. The order is unspecified, unlike increasing slice indexes, so the arrival order must not carry application meaning.",
      },
      {
        cue: "Explain the one-variable map form",
        stage: "One map variable is key",
        spokenText: "With one map variable, \u0060for key := range scores\u0060 produces keys. This is clearer than writing \u0060for key, _ := range scores\u0060. A zero-variable form, \u0060for range collection\u0060, is available when only the iteration count or repeated action matters.",
      },
      {
        cue: "State the copy rule and its mutation effect",
        stage: "Produced values are copies",
        spokenText: "The second range value is copied into the loop variable. Reassigning it does not replace the slice element or map entry. Update a slice through \u0060items[i]\u0060 and update a map by assigning a complete value to \u0060m[key]\u0060. Reference-like fields inside a copied value may still share underlying data.",
        recallRule: "Slices produce index then copied element; maps produce key then copied value.",
      },
    ],
    overview: {
      title: "Range results follow the collection type",
      content: "Range uses one loop syntax but produces values according to the operand. An array or slice has numbered positions, so the first result is an integer index and the optional second result is the value found at that index. The indexes progress from zero through the length established for the loop. A nil or empty slice produces no iterations.\n\nA map is organized by keys instead of positions. Its first result is a key and its optional second result is the corresponding map value. Map order is unspecified, so the sequence cannot be treated as insertion order or repeated reliably. A nil or empty map also produces no iterations.\n\nThe number of variables changes which results are kept. One variable over a slice receives the index; one variable over a map receives the key. To keep only slice elements, use \u0060for _, value := range items\u0060. To keep only map keys, omit the second variable entirely with \u0060for key := range m\u0060. The blank identifier is useful only when an earlier produced value must be skipped.\n\nRange assigns the element or map value into an iteration variable, so that variable is a copy. Reassigning it does not write back. For a slice, index the stored element when it must change. For a map, compute the new value and assign it under the key. A copied struct can still contain slices, maps, or pointers that refer to shared data, so the exact field being changed determines whether an effect is visible.",
    },
    visual: {
      type: "comparison_table",
      title: "Values produced by range",
      content: "| Range operand | First value | Second value | Order |\n|---|---|---|---|\n| Array or slice | Index as \u0060int\u0060 | Copy of \u0060a[index]\u0060 | Increasing indexes |\n| Map | Key | Copy of \u0060m[key]\u0060 | Unspecified |\n| One variable over slice | Index | — | Increasing indexes |\n| One variable over map | Key | — | Unspecified |",
    },
    example: {
      title: "Use slice indexes, slice values, and map keys correctly",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tnames := []string{\"Ada\", \"Lin\"}\n\tfor index, name := range names {\n\t\tfmt.Println(index, name)\n\t}\n\n\tscores := map[string]int{\"Ada\": 9, \"Lin\": 8}\n\ttotal := 0\n\tfor _, score := range scores {\n\t\ttotal += score\n\t}\n\n\tkeys := make([]string, 0, len(scores))\n\tfor key := range scores {\n\t\tkeys = append(keys, key)\n\t}\n\tsort.Strings(keys)\n\tfmt.Println(total, keys)\n}",
    },
  },
  "go-slices-maps-range-over-slice-map-when-to-use": {
    directAnswer: "The value variable in \u0060for _, item := range items\u0060 receives a copy of each slice element. With a slice of structs, \u0060item.Done = true\u0060 changes only that loop copy, so the stored struct remains unchanged. Iterate by index and write \u0060items[i].Done = true\u0060, or assign a modified value back to \u0060items[i]\u0060. A slice of pointers behaves differently because the copied pointer still reaches the same object; changing that object is visible and introduces normal aliasing concerns.",
    quick: [
      "The second range variable is assigned a copy of the slice element.",
      "Changing fields on a copied struct does not replace the stored struct.",
      "Use \u0060for i := range items\u0060 and mutate \u0060items[i]\u0060 for value elements.",
      "A copied pointer still reaches the same object, so pointee changes are visible.",
      "A copied struct may also share nested slices, maps, or pointers.",
    ],
    beats: [
      {
        cue: "Explain what the loop variable receives",
        stage: "Range assigns an element copy",
        spokenText: "In \u0060for _, task := range tasks\u0060, task is assigned the current element's value. If the element type is a struct, ordinary assignment copies that struct. The loop variable and the slot inside tasks are different variables.",
      },
      {
        cue: "Show why field assignment misses the slice",
        stage: "Field writes stay on the copy",
        spokenText: "The statement \u0060task.Done = true\u0060 changes the local task copy. It never assigns that copy back to the slice, so the stored element keeps its old Done value. The loop runs correctly but writes to the wrong variable.",
      },
      {
        cue: "Reach the actual value element by index",
        stage: "Indexing reaches slice storage",
        spokenText: "Iterate with \u0060for i := range tasks\u0060 and set \u0060tasks[i].Done = true\u0060. The index expression names the stored struct, so field assignment updates the slice. Another valid form modifies a copy and then writes \u0060tasks[i] = task\u0060.",
      },
      {
        cue: "Contrast a slice of pointers",
        stage: "Pointer elements share objects",
        spokenText: "For \u0060[]*Task\u0060, range still copies each element, but the element is a pointer. The copied pointer reaches the same Task object, so \u0060task.Done = true\u0060 changes that object. Missing or nil pointers must be checked when they are possible.",
      },
      {
        cue: "Cover shallow copies and ownership",
        stage: "Nested references stay shared",
        spokenText: "A value struct may contain a slice, map, or pointer. Copying the outer struct does not deep-copy those referenced values, so changing nested data may still be visible even though replacing a plain field is not. Choose value or pointer elements from the ownership model, not as a loop shortcut.",
        recallRule: "Range copies the element; use its index to replace value elements and follow pointers only when shared identity is intended.",
      },
    ],
    overview: {
      title: "The loop variable is not the stored slice slot",
      content: "A range loop assigns each produced element value to the variables in its clause. For a slice of structs, that assignment creates a struct copy. The copy has the same field values, but it is a different variable from the element stored in the slice. Changing a plain field on the loop variable therefore disappears when that iteration ends.\n\nIndexing names the actual slice slot. The common in-place update is \u0060for i := range tasks { tasks[i].Done = true }\u0060. If the transformation is easier to express on a local value, copy the element, change it, and explicitly assign the whole value back to \u0060tasks[i]\u0060. Both patterns make the write destination visible.\n\nA pointer element changes the result without changing range semantics. In a \u0060[]*Task\u0060, the loop variable receives a copied pointer. Dereferencing it reaches the same Task object as the pointer stored in the slice, so field mutation is visible. This may be exactly right for shared mutable identity, but it also means aliases can change the object from elsewhere and nil pointers need handling.\n\nCopies are shallow. A struct value containing a slice, map, or pointer receives copied descriptors or pointers that can still refer to shared data. Replacing a number or boolean on the copied struct stays local, while mutating a nested map may cross the copy boundary. Reason from the exact field being changed and choose value or pointer elements from the data's ownership requirements.",
    },
    visual: {
      type: "flow_diagram",
      title: "A copied value and an indexed element have different write targets",
      content: "\u0060\u0060\u0060mermaid\nflowchart LR\n  A[Stored Task in slice] -->|range assigns copy| B[Loop variable Task]\n  B --> C[Changing field affects only copy]\n  D[Slice index] --> E[Stored Task in slice]\n  E --> F[Changing field updates slice]\n\u0060\u0060\u0060\nIndexing reaches the stored struct; the range value is a separate copy.",
    },
    example: {
      title: "Update value elements by index and pointer elements through pointers",
      code: "package main\n\nimport \"fmt\"\n\ntype Task struct {\n\tName string\n\tDone bool\n}\n\nfunc main() {\n\ttasks := []Task{{Name: \"test\"}, {Name: \"ship\"}}\n\tfor _, task := range tasks {\n\t\ttask.Done = true\n\t}\n\tfmt.Println(\"after copied values:\", tasks)\n\n\tfor i := range tasks {\n\t\ttasks[i].Done = true\n\t}\n\tfmt.Println(\"after indexes:\", tasks)\n\n\tpointed := []*Task{{Name: \"review\"}}\n\tfor _, task := range pointed {\n\t\ttask.Done = true\n\t}\n\tfmt.Println(\"after pointer:\", *pointed[0])\n}",
    },
  },
  "go-slices-maps-range-over-slice-map-common-mistake": {
    directAnswer: "During a map range in one goroutine, deleting an entry that has not yet been reached guarantees that the entry will not be produced later in that loop. Deleting the current or an already visited entry still removes it from the map. A newly added entry may be visited or skipped, with the choice varying by entry and iteration, so additions cannot act as a reliable work queue. Capture keys first or build a separate destination when the processed set must be fixed. Unsynchronized mutation from another goroutine remains unsafe.",
    quick: [
      "Deleting map entries during range is defined when one goroutine owns the map.",
      "A deleted entry that has not been reached will not be produced later.",
      "An entry added during range may be produced or skipped.",
      "Snapshot keys or use a separate destination for a fixed processing set.",
      "Concurrent map mutation still requires synchronization.",
    ],
    beats: [
      {
        cue: "State the deletion guarantee precisely",
        stage: "Deletion has a clear rule",
        spokenText: "Go permits deletion from a map while the same goroutine ranges over it. If an entry has not yet been reached and is deleted, that entry will not be produced later in the loop. This makes in-place filtering by deletion a supported pattern.",
      },
      {
        cue: "Contrast entries created during the loop",
        stage: "Added entries are uncertain",
        spokenText: "An entry added during map range may be produced in the current loop or may be skipped. The choice can differ for each added entry and each iteration. Code must not use \u0060m[newKey] = value\u0060 as a promise that new work will be visited.",
      },
      {
        cue: "Keep iteration order separate from mutation visibility",
        stage: "Map order stays unspecified",
        spokenText: "Deletion and insertion rules do not create an order. Map range remains unspecified, so code cannot know whether a particular original entry would have appeared early or late. Deleting the current entry is safe, but its current visit has already happened.",
      },
      {
        cue: "Choose a stable processing set when required",
        stage: "Snapshot fixed work first",
        spokenText: "When every starting key must be processed exactly once, collect keys into a slice before mutation. When producing new entries, write them into a separate destination map. Sorting the key snapshot adds deterministic order when output or tests require it.",
      },
      {
        cue: "Separate same-owner mutation from concurrency",
        stage: "Concurrent mutation is unsafe",
        spokenText: "These rules cover changes made within the iteration's coordinated ownership. They do not make ordinary maps safe for a second goroutine to mutate while range reads them. Overlapping reads and writes need a mutex, one owning goroutine, or another concurrent design.",
        recallRule: "Unreached deleted entries stay out; newly added entries may or may not join the current range.",
      },
    ],
    overview: {
      title: "A changing map is not a stable work queue",
      content: "Go defines a useful rule for deletion during map range. If an entry has not yet been produced and code removes it, the current iteration will not produce it later. An entry already produced cannot have that visit undone, but deleting it still removes it from the map. Filtering unwanted entries in place is therefore valid when one goroutine owns the operation.\n\nInsertion deliberately has a weaker rule. An entry created during the loop may appear in the remaining iterations or may be skipped. The decision can vary between entries and runs because map traversal order and internal progress are not an application contract. A loop that adds replacement work to the same map cannot assume that work will be processed now.\n\nUse two phases when the algorithm needs a fixed set. Capture the starting keys first, optionally sort them, and then process that slice while changing the map. Use a separate destination map for transformations that create keys. These patterns make the input set and output set explicit instead of depending on mutation visibility.\n\nThe language rule describes mutation performed under the loop's own coordinated access. A different goroutine writing while range reads is an ordinary concurrent map race and is unsafe without synchronization. The same warning applies to deletion and insertion. Establish one owner or lock the complete operation before using the in-loop deletion guarantee.",
    },
    visual: {
      type: "comparison_table",
      title: "Changes made during one map range",
      content: "| Change | Current-loop guarantee | Reliable use |\n|---|---|---|\n| Delete an unreached entry | It will not be produced | In-place filtering |\n| Delete the current or visited entry | Its visit already happened; entry is removed | Remove processed data |\n| Add an entry | It may be produced or skipped | Do not depend on this loop seeing it |\n| Write from another goroutine | Unsafe without coordination | Lock or use one owner |",
    },
    example: {
      title: "Filter in place and build new entries separately",
      code: "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\nfunc main() {\n\tscores := map[string]int{\"Ada\": 9, \"Lin\": 4, \"Mina\": 7}\n\tfor name, score := range scores {\n\t\tif score < 6 {\n\t\t\tdelete(scores, name)\n\t\t}\n\t}\n\n\tlabels := make(map[string]int, len(scores))\n\tfor name, score := range scores {\n\t\tlabels[\"qualified:\"+name] = score\n\t}\n\n\tkeys := make([]string, 0, len(labels))\n\tfor key := range labels {\n\t\tkeys = append(keys, key)\n\t}\n\tsort.Strings(keys)\n\tfmt.Println(keys)\n}",
    },
  },
  "go-slices-maps-range-over-slice-map-compare": {
    directAnswer: "Slice range evaluates its slice before the loop, so the original length fixes the indexes visited. Appending can grow the variable, but new elements do not join that range. Append writes beyond the old length; it does not replace an original element. If backing storage is reused, later assignments through an overlapping slice can still change original positions not yet read. If append allocates new storage, range keeps its earlier view. Use an index loop when appended items should become work.",
    quick: [
      "The slice range expression is evaluated before iteration begins.",
      "The loop visits indexes from zero to the original range length minus one.",
      "Elements appended inside the body are not visited by that range.",
      "Storage reuse matters only when other writes touch original shared positions.",
      "Use \u0060for i := 0; i < len(queue); i++\u0060 for a deliberate growing queue.",
    ],
    beats: [
      {
        cue: "Explain when the iteration boundary is chosen",
        stage: "Range fixes the index count",
        spokenText: "Before a slice range starts, Go evaluates the range expression and establishes the slice value used by the loop. Its length determines the index sequence. If that length is two, range visits indexes zero and one and then stops.",
      },
      {
        cue: "Separate the loop's slice from a reassigned variable",
        stage: "Append grows another slice",
        spokenText: "Inside the body, \u0060values = append(values, next)\u0060 assigns a possibly longer slice to values. That does not replace the slice value already being used for range. The loop's fixed index count does not follow the variable's new length.",
      },
      {
        cue: "State the direct visible result",
        stage: "New elements are not visited",
        spokenText: "Ranging over \u0060[]int{1, 2}\u0060 and appending one value during each visit still performs two iterations. The final slice can contain \u0060[1, 2, 11, 12]\u0060, but 11 and 12 are not part of the current range.",
      },
      {
        cue: "Correctly place the backing-array nuance",
        stage: "Storage sharing still matters",
        spokenText: "Append places new values after the current length, so that write alone does not replace original positions. If append reuses storage, later assignments through values or another overlapping slice may still change an original position that range has not reached. If append reallocates, range continues on its earlier storage.",
      },
      {
        cue: "Choose syntax that exposes deliberate growth",
        stage: "Use an index for a worklist",
        spokenText: "For a queue that should process appended work, use \u0060for i := 0; i < len(queue); i++\u0060. The condition reads the current length each time and makes growth part of the algorithm. Add a clear stopping rule so newly generated work cannot grow forever.",
        recallRule: "Range uses the original slice length; a dynamic index loop can intentionally follow growth.",
      },
    ],
    overview: {
      title: "Range keeps its original length while the variable grows",
      content: "A slice range begins by evaluating its range expression. The resulting slice value supplies the backing-storage view and the length used for iteration. Range then produces indexes from zero through that original length minus one. Reassigning the source variable during the body does not extend this already established index sequence.\n\nAppend returns a slice value with a longer length. If the source has spare capacity, that value can use the same backing array; otherwise it uses other storage. In both cases, newly appended elements lie after the old length and are not scheduled for the current range. This keeps the loop finite even when the variable grows on every visit.\n\nBacking storage still matters for other mutations. Append's own new-element write does not replace an original position, but code can later assign to an existing index through the grown slice or through an overlapping subslice. When storage was reused, the range may observe that changed original element on a later iteration. When append moved the result, range retains its earlier array view. Depending on this distinction makes traversal difficult to reason about.\n\nIf appended items are meant to become future work, use an explicit index with a condition that reads the current length, such as \u0060i < len(queue)\u0060. That code openly models a growing queue. It also needs a termination rule, because each processed item could otherwise create more work forever. For ordinary traversal, avoid structural changes and keep range focused on the original collection.",
    },
    visual: {
      type: "flow_diagram",
      title: "Original length controls a slice range",
      content: "\u0060\u0060\u0060mermaid\nflowchart LR\n  A[Start with length 2] --> B[Range fixes indexes 0 and 1]\n  B --> C[Body appends new values]\n  C --> D[Slice variable becomes longer]\n  D --> E[Range still stops after index 1]\n\u0060\u0060\u0060\nThe variable grows, but the range's original index plan does not.",
    },
    example: {
      title: "Compare fixed range with a growing index loop",
      code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvalues := []int{1, 2}\n\tvisits := make([]int, 0, len(values))\n\tfor _, value := range values {\n\t\tvisits = append(visits, value)\n\t\tvalues = append(values, value+10)\n\t}\n\tfmt.Println(\"range visits:\", visits)\n\tfmt.Println(\"after range:\", values)\n\n\tqueue := []int{1, 2}\n\tfor i := 0; i < len(queue); i++ {\n\t\tif queue[i] < 3 {\n\t\t\tqueue = append(queue, queue[i]+2)\n\t\t}\n\t}\n\tfmt.Println(\"growing queue:\", queue)\n}",
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
    throw new Error("Missing an existing range lesson section for " + targetSlug);
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
console.log("Curated " + curated + " Go range-over-collection lessons");
