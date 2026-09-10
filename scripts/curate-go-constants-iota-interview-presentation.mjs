#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/go-fresher/go-syntax-basics/constants-and-iota/complete-qa.json";

const presentations = {
  "go-constants-and-iota": [
    {
      cue: "Define a Go constant",
      stage: "Constants are fixed values",
      spokenText: "A Go constant is a value the compiler can determine at compile time and the program cannot reassign while it runs. Constants can hold boolean, string, or numeric values. `const MaxRetries = 3` is untyped, while `const MaxRetries int = 3` fixes the type immediately.",
      support: {
        type: "comparison",
        title: "Typed and untyped constants",
        items: [
          { label: "Untyped", value: "const N = 3", detail: "Takes a concrete type from the context where it is used.", tone: "blue" },
          { label: "Typed", value: "const N int = 3", detail: "Has the named type from its declaration.", tone: "green" }
        ]
      }
    },
    {
      cue: "Explain the counter",
      stage: "iota counts specifications",
      spokenText: "`iota` is a counter available inside a `const` block. It is zero in the first constant specification and increases once for every following specification. A new `const` block starts again at zero; `iota` is not a runtime counter and does not continue across the package.",
      support: {
        type: "code",
        title: "A complete three-value sequence",
        language: "go",
        code: "package main\n\nimport \"fmt\"\n\ntype Level int\n\nconst (\n\tLow Level = iota\n\tMedium\n\tHigh\n)\n\nfunc main() { fmt.Println(Low, Medium, High) }",
        caption: "Output: `0 1 2`. Each line is evaluated at a new `iota` position."
      }
    },
    {
      cue: "Explain the shortened lines",
      stage: "Omitted expressions repeat",
      spokenText: "Inside the block, an omitted expression repeats the complete previous expression. Therefore `Medium` and `High` reuse `Level = iota`, but each line sees its own counter value. The same rule also supports formulas such as `Read Permission = 1 << iota` followed by `Write` and `Execute`.",
    },
    {
      cue: "State the stability boundary",
      stage: "Keep public numbers stable",
      spokenText: "Use `iota` for a small internal sequence when the pattern matters more than the exact numbers. Inserting a new specification renumbers the lines below it, so database values, API values, and file-format values should normally use explicit constants such as `Active Status = 10`.",
      recallRule: "Constants name fixed compile-time values; `iota` generates a position-based sequence inside one const block."
    }
  ],
  "go-syntax-basics-constants-and-iota-when-to-use": [
    {
      cue: "Choose a constant or variable",
      stage: "Use const for fixed meaning",
      spokenText: "Use a constant when the value is known at compile time, has a stable meaning, and must not be reassigned. Retry limits and built-in defaults are common examples. Use a variable for a value read from input, an environment variable, `time.Now()`, or any other function call because that information exists only at runtime.",
    },
    {
      cue: "Recognise an iota sequence",
      stage: "Use iota for a pattern",
      spokenText: "Use `iota` when a related internal set follows a clear sequence or formula. `const (Pending Status = iota; Running; Done)` is concise because the relationship zero, one, two is useful and renumbering does not affect another system. A named `Status` type also explains what those integers mean.",
      support: {
        type: "comparison",
        title: "Choose from where the value comes from",
        items: [
          { label: "Fixed compile-time value", value: "const", detail: "The name should never be reassigned.", tone: "blue" },
          { label: "Internal sequence", value: "iota", detail: "The position or formula is the useful part.", tone: "green" },
          { label: "Runtime information", value: "variable", detail: "The value arrives while the program runs.", tone: "orange" }
        ]
      }
    },
    {
      cue: "Show a formula-based use",
      stage: "Bit flags use one bit each",
      spokenText: "Bit flags are a strong `iota` use because the expression describes the pattern. Starting with `Read Permission = 1 << iota` creates one, two, and four. The program can combine permissions with `|` and test one permission with `&`.",
      support: {
        type: "code",
        title: "Create and check permission bits",
        language: "go",
        code: "package main\n\nimport \"fmt\"\n\ntype Permission uint\n\nconst (\n\tRead Permission = 1 << iota\n\tWrite\n\tExecute\n)\n\nfunc main() {\n\tp := Read | Write\n\tfmt.Println(p&Write != 0)\n}",
        caption: "Output: `true`. Each constant owns a different bit."
      }
    },
    {
      cue: "Protect external contracts",
      stage: "External numbers stay explicit",
      spokenText: "Avoid generated values when the exact number is stored in a database, sent through an API, or written to a file. Adding a line can change every later number. Explicit assignments are more repetitive, but they make compatibility visible and stable across releases.",
      recallRule: "Use a constant for a fixed value, `iota` for a private pattern, and explicit numbers at a durable boundary."
    }
  ],
  "go-syntax-basics-constants-and-iota-common-mistake": [
    {
      cue: "Identify the main risk",
      stage: "Position determines the value",
      spokenText: "The most important mistake is treating an `iota` value as permanently stable. Its value comes from its specification's position in the block. Insert a new specification above `Running`, and `Running` receives a different number even though its name and type have not changed.",
      support: {
        type: "trace",
        title: "One inserted line shifts the mapping",
        items: [
          { label: "Pending", value: "0", detail: "First specification stays unchanged.", tone: "blue" },
          { label: "Paused", value: "1", detail: "A newly inserted specification uses the next position.", tone: "orange" },
          { label: "Running", value: "2", detail: "This was previously `1` and has now moved.", tone: "green" }
        ]
      }
    },
    {
      cue: "Connect the shift to old data",
      stage: "Old data keeps old numbers",
      spokenText: "Suppose existing database rows store `1` for Running. After inserting Paused, the new program reads that same `1` as Paused. The program compiles because every constant is valid; the bug is a mismatch between the new declaration and data written by the old declaration.",
    },
    {
      cue: "Cover the subtle counting rules",
      stage: "Blank identifier still counts",
      spokenText: "A specification such as `_ = iota` still consumes a position. An omitted expression repeats the previous complete expression, and a separate `const` block resets `iota` to zero. Also decide what zero means: reserving `Unknown State = iota` can expose an uninitialised value instead of silently treating it as a real state.",
    },
    {
      cue: "Make important values explicit",
      stage: "Lock the external mapping",
      spokenText: "Use explicit numbers when values leave the process, and add a focused test for the mapping. The small program below fails immediately if a later edit changes a promised value; a production package would normally express the same check as a table-driven unit test.",
      support: {
        type: "code",
        title: "Make the promised values visible",
        language: "go",
        code: "package main\n\nimport \"fmt\"\n\ntype State int\n\nconst (\n\tUnknown State = 0\n\tPending State = 1\n\tRunning State = 2\n)\n\nfunc main() {\n\tif Running != 2 { panic(\"status mapping changed\") }\n\tfmt.Println(Unknown, Pending, Running)\n}",
        caption: "Output: `0 1 2`. Explicit values protect data and API compatibility."
      },
      recallRule: "`iota` removes repeated numbering; it does not promise that generated numbers will never move."
    }
  ],
  "go-syntax-basics-constants-and-iota-compare": [
    {
      cue: "Remove the false performance difference",
      stage: "Both are compile-time values",
      spokenText: "`iota` constants and explicit constants are both evaluated at compile time, so neither has a meaningful runtime speed advantage. The real difference is how the number is written: `iota` derives it from position, while an explicit declaration records the number directly.",
    },
    {
      cue: "Compare their maintenance cost",
      stage: "Conciseness or stability",
      spokenText: "`iota` keeps an internal sequence or formula short and makes the pattern easy to see. Explicit constants repeat more text, but a new declaration can be inserted without silently changing old values. That makes the explicit form easier to audit when the numeric mapping itself matters.",
      support: {
        type: "comparison",
        title: "The decision is about the contract",
        items: [
          { label: "Generated with iota", value: "position", detail: "Concise for private sequences and bit patterns.", tone: "green" },
          { label: "Assigned explicitly", value: "stable", detail: "Safer for stored values and external contracts.", tone: "orange" },
          { label: "Runtime cost", value: "same", detail: "Both forms produce constants before the program runs.", tone: "blue" }
        ]
      }
    },
    {
      cue: "Show both forms together",
      stage: "Declarations show the choice",
      spokenText: "The program uses generated values for a private workflow and fixed numbers for a wire protocol. Both are readable, but only the second declaration promises the precise numbers as part of an external contract.",
      support: {
        type: "code",
        title: "Internal sequence and wire values",
        language: "go",
        code: "package main\n\nimport \"fmt\"\n\ntype Step int\n\nconst (\n\tQueued Step = iota\n\tRunning\n\tDone\n)\n\ntype WireStatus int\n\nconst (\n\tWireQueued  WireStatus = 10\n\tWireRunning WireStatus = 20\n)\n\nfunc main() {\n\tfmt.Println(Queued, Running, Done)\n\tfmt.Println(WireQueued, WireRunning)\n}",
        caption: "Output: `0 1 2` and `10 20`. The wire values do not depend on line position."
      }
    },
    {
      cue: "State what neither form guarantees",
      stage: "Named integers are not closed",
      spokenText: "Neither form creates a closed enum. Code can still convert another integer to the named type, so input from JSON, a database, or an API may need validation. Use `iota` when the pattern matters; use explicit values when the number is the contract.",
      recallRule: "Choose `iota` for a maintainable pattern and explicit values for a maintainable numeric contract."
    }
  ],
  "go-syntax-basics-constants-and-iota-scenario": [
    {
      cue: "Reduce the declaration",
      stage: "Annotate the smallest block",
      spokenText: "First reduce the problem to the smallest `const` block and write the value expected beside every specification. Then print the actual values in a tiny program or assert them in a test. This quickly separates an `iota` problem from code that only converts or displays the value later.",
    },
    {
      cue: "Check every way the position moves",
      stage: "Inspect the counting rules",
      spokenText: "Look for a newly inserted specification, `_ = iota`, an omitted expression, or a second `const` block. A blank identifier still consumes a position, the previous expression can repeat with a new position, and a new block resets the counter to zero.",
      support: {
        type: "checklist",
        title: "Fast checks for an unexpected value",
        items: [
          { label: "Inserted specification", detail: "Shifts every generated value below it.", tone: "orange" },
          { label: "Blank identifier", value: "_", detail: "Still advances the counter.", tone: "blue" },
          { label: "Omitted expression", detail: "Repeats the previous expression at a new position.", tone: "green" },
          { label: "New const block", detail: "Starts again at zero.", tone: "neutral" }
        ]
      }
    },
    {
      cue: "Find the compatibility boundary",
      stage: "Check where numbers are stored",
      spokenText: "If the values never leave the current program, restoring the intended order may be enough. If a database, API, message, or file already contains the old numbers, inspect that historical mapping before editing the block. The fix may require explicit values or a data migration.",
    },
    {
      cue: "Make the fix testable",
      stage: "Lock the corrected mapping",
      spokenText: "After choosing stable values, add a small table-driven test. It documents the promised mapping and turns a future reorder into a clear test failure instead of a silent production bug.",
      support: {
        type: "code",
        title: "A complete mapping test",
        language: "go",
        code: "package status\n\nimport \"testing\"\n\ntype Status int\n\nconst (\n\tPending Status = 0\n\tReady   Status = 1\n\tPaused  Status = 2\n)\n\nfunc TestValues(t *testing.T) {\n\ttests := []struct {\n\t\tgot  Status\n\t\twant Status\n\t}{\n\t\t{Pending, 0},\n\t\t{Ready, 1},\n\t\t{Paused, 2},\n\t}\n\n\tfor _, tt := range tests {\n\t\tif tt.got != tt.want {\n\t\t\tt.Fatalf(\"got %d, want %d\", tt.got, tt.want)\n\t\t}\n\t}\n}",
        caption: "Run with `go test`. A changed number now fails before it reaches stored data."
      },
      recallRule: "Trace positions, locate persisted values, choose a compatible fix, and lock the result with a test."
    }
  ]
};

const absolutePath = path.join(repoRoot, file);
const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));

for (const [slug, beats] of Object.entries(presentations)) {
  const question = document.questions?.find((entry) => entry.slug === slug);
  if (!question) throw new Error(`Question not found: ${slug}`);
  const speaking = question.answer?.sections?.find((section) => section.type === "speakable_answer");
  if (!speaking) throw new Error(`Interview answer not found: ${slug}`);
  speaking.answerSize = "compact";
  speaking.beats = beats;
  speaking.content = beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  console.log(`Curated Interview Answer presentation for ${slug}.`);
}

fs.writeFileSync(absolutePath, `${JSON.stringify(document, null, 2)}\n`);
