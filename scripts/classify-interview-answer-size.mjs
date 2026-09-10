#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const roots = process.argv.slice(2);
if (!roots.length) {
  console.error("Usage: node scripts/classify-interview-answer-size.mjs <content-root> [...]");
  process.exit(1);
}

const architecturePattern = /\b(system design|architecture|design .+ system|scalability|distributed|microservices?)\b/i;

function* files(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* files(target);
    else if (entry.name === "complete-qa.json") yield target;
  }
}

const countWords = (value) => String(value ?? "")
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/[`*_#>|~-]/g, " ")
  .split(/\s+/)
  .filter(Boolean)
  .length;

let changedQuestions = 0;
let changedFiles = 0;

for (const contentRoot of roots) {
  for (const file of files(contentRoot)) {
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    const questions = Array.isArray(document) ? document : document.questions;
    if (!Array.isArray(questions)) continue;
    let changed = false;

    for (const question of questions) {
      const section = (question.answer?.sections ?? []).find((item) => item.type === "speakable_answer");
      if (!section) continue;
      const words = countWords(
        Array.isArray(section.beats)
          ? section.beats.map((beat) => beat.spokenText ?? "").join(" ")
          : section.content,
      );
      const isArchitecture = architecturePattern.test(`${question.question ?? ""} ${question.title ?? ""} ${question.layout_type ?? ""}`);
      const answerSize = isArchitecture || words > 420
        ? "deep"
        : words <= 240
          ? "compact"
          : "standard";
      if (section.answerSize !== answerSize) {
        section.answerSize = answerSize;
        changed = true;
        changedQuestions += 1;
      }
    }

    if (changed) {
      fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
      changedFiles += 1;
    }
  }
}

console.log(`Classified ${changedQuestions} interview answers across ${changedFiles} files.`);
