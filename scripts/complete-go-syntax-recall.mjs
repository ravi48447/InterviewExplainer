#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

const recalls = {
  "go-syntax-basics-variables-and-short-declaration-when-to-use": [
    "Use `var` at package scope or when the declared type or zero value should be visible.",
    "Use `:=` for concise local declarations with inferred types.",
    "Use `=` when every name already exists in the current scope.",
    "A short declaration must introduce at least one new name in that scope.",
    "Watch for shadowing when `:=` appears inside a nested block.",
  ],
  "go-syntax-basics-variables-and-short-declaration-common-mistake": [
    "`:=` can silently create a new inner variable instead of updating an outer one.",
    "At least one name on the left must be new in the current scope.",
    "The declaration form works only inside functions.",
    "Use `=` when all target variables already exist in the current scope.",
    "Keep error handling close enough to make shadowing visible.",
  ],
  "go-syntax-basics-variables-and-short-declaration-scenario": [
    "Compare the variable's value and address before and after the suspicious block.",
    "Find the nearest declaration of the same name.",
    "Check whether `:=` created an inner variable.",
    "Replace `:=` with `=` only when every target already exists.",
    "Add a focused test that crosses the scope boundary.",
  ],
  "go-syntax-basics-constants-and-iota-when-to-use": [
    "Use constants for values known at compile time.",
    "Use `iota` for a private sequence or formula.",
    "A named type gives generated numbers domain meaning.",
    "Use explicit values when numbers are stored or exposed externally.",
    "Use variables for runtime input, function results, and configuration.",
  ],
  "go-syntax-basics-constants-and-iota-common-mistake": [
    "An `iota` value depends on its specification's position.",
    "Inserting a line can renumber every later constant.",
    "A blank-identifier specification still consumes a position.",
    "A new `const` block resets `iota` to zero.",
    "Use explicit numbers for database, API, and file-format contracts.",
  ],
  "go-syntax-basics-constants-and-iota-compare": [
    "`iota` expresses a sequence or formula without repeated numbers.",
    "Explicit assignments keep every numeric value visible and stable.",
    "Both forms create compile-time constants.",
    "Choose `iota` for private patterns and explicit values for public contracts.",
    "Test important numeric mappings when compatibility matters.",
  ],
  "go-syntax-basics-constants-and-iota-scenario": [
    "Write down the expected numeric value of every specification.",
    "Expand omitted expressions using the current `iota` position.",
    "Check inserted lines, blank identifiers, and new `const` blocks.",
    "Inspect stored or transmitted historical values before editing the declaration.",
    "Protect stable mappings with regression tests.",
  ],
};

const targets = [
  "content/go-fresher/go-syntax-basics/variables-and-short-declaration/complete-qa.json",
  "content/go-fresher/go-syntax-basics/constants-and-iota/complete-qa.json",
];

for (const relative of targets) {
  const absolute = path.join(root, relative);
  const document = JSON.parse(fs.readFileSync(absolute, "utf8"));

  for (const question of document.questions) {
    const sections = question.answer?.sections ?? [];
    const speakable = sections.find((section) => section.type === "speakable_answer");
    if (speakable && !speakable.answerSize) speakable.answerSize = "standard";

    const points = recalls[question.slug];
    if (points) {
      const existing = sections.findIndex((section) => ["key_points", "important_points"].includes(section.type));
      const quick = {type: "key_points", title: "Quick revision", items: points};
      if (existing >= 0) sections[existing] = quick;
      else sections.unshift(quick);
    }

    if (question.slug === "go-syntax-basics-variables-and-short-declaration-scenario") {
      const hasFlow = sections.some((section) => section.type === "flow_diagram");
      if (!hasFlow) {
        sections.push({
          type: "flow_diagram",
          title: "Trace a suspected shadowed variable",
          content: "```mermaid\nflowchart TD\n  A[Unexpected outer value] --> B[Find nearest assignment]\n  B --> C{Does it use := in a nested scope?}\n  C -- Yes --> D[Compare inner and outer declarations]\n  C -- No --> E[Trace the earlier assignment]\n  D --> F[Use = only when every target already exists]\n  E --> G[Fix the first incorrect write]\n  F --> H[Add a scope-boundary test]\n  G --> H\n```",
        });
      }
    }
  }

  fs.writeFileSync(absolute, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Completed Quick Revision coverage in ${relative}`);
}
