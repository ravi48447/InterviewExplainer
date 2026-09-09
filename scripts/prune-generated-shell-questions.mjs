#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const write = process.argv.includes("--write");
const roots = process.argv.slice(2).filter((value) => !value.startsWith("--"));

if (roots.length === 0) {
  console.error("Usage: node scripts/prune-generated-shell-questions.mjs [--write] <content-root> [...]");
  process.exit(1);
}

const generatedQuestionPatterns = [
  /how would you compare .+ with an alternative\?/i,
  /what is .+, and when would you use it\?/i,
  /when would you use .+ in a real project\?/i,
  /how would you debug a problem involving .+\?/i,
  /what is a common mistake when using .+\?/i,
];

const generatedContentPatterns = [
  /use it when it fits/i,
  /compare the options by correctness, speed, clarity, and cost/i,
  /mention one (?:trade-off|edge case)/i,
  /walk through (?:a|the) (?:small )?example/i,
  /practical understanding of/i,
  /core interview concept/i,
  /a way to solve a common programming problem/i,
  /useful when it solves a clear problem/i,
  /using it from memory without checking/i,
  /I look at correctness first, then/i,
  /I explain what goes in, what happens/i,
  /show a small example of/i,
  /keep the implementation small/i,
  /when the problem matches its main benefit/i,
  /when its rule makes the code safer, clearer, or more efficient/i,
  /with the simpler alternative by looking at correctness first/i,
  /reproducing it with the smallest input first/i,
  /using the rule without checking its boundary conditions/i,
];

function* jsonFiles(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(file);
    else if (entry.name === "complete-qa.json") yield file;
  }
}

function learnerText(question) {
  return [
    question.question,
    question.direct_answer,
    ...(question.answer?.sections ?? []).flatMap((section) => [
      section.content,
      ...(section.items ?? []),
    ]),
  ]
    .filter((value) => typeof value === "string")
    .join("\n");
}

function isGeneratedShell(question) {
  return generatedQuestionPatterns.some((pattern) => pattern.test(question.question ?? ""))
    && generatedContentPatterns.some((pattern) => pattern.test(learnerText(question)));
}

let scannedFiles = 0;
let changedFiles = 0;
let removedQuestions = 0;
let protectedQuestions = 0;

for (const root of roots) {
  for (const file of jsonFiles(root)) {
    scannedFiles += 1;
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    const questions = Array.isArray(document) ? document : document.questions;
    if (!Array.isArray(questions) || questions.length === 0) continue;

    const retained = questions.filter((question) => !isGeneratedShell(question));
    if (retained.length === 0) {
      protectedQuestions += questions.length;
      continue;
    }

    const removed = questions.length - retained.length;
    if (removed === 0) continue;
    changedFiles += 1;
    removedQuestions += removed;

    if (write) {
      const output = Array.isArray(document)
        ? retained
        : { ...document, questions: retained };
      fs.writeFileSync(file, `${JSON.stringify(output, null, 2)}\n`);
    }
  }
}

console.log(
  `${write ? "Removed" : "Would remove"} ${removedQuestions} generated shell questions from ${changedFiles}/${scannedFiles} files.`,
);
if (protectedQuestions > 0) {
  console.log(
    `Protected ${protectedQuestions} questions because removing them would empty their topic; curate those topics before pruning.`,
  );
}
