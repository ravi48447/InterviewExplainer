#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const roots = process.argv.slice(2);
if (!roots.length) {
  console.error("Usage: node scripts/normalize-quick-revision.mjs <content-root> [...]");
  process.exit(1);
}

function* completeQaFiles(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    if (entry.name === ".archive" || entry.name === "_audits") continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* completeQaFiles(target);
    else if (entry.name === "complete-qa.json") yield target;
  }
}

let filesChanged = 0;
let questionsChanged = 0;

for (const contentRoot of roots) {
  for (const file of completeQaFiles(contentRoot)) {
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    const questions = Array.isArray(document) ? document : document.questions;
    if (!Array.isArray(questions)) continue;
    let changed = false;

    for (const question of questions) {
      let questionChanged = false;
      const sections = question.answer?.sections ?? [];
      const section = sections.find((item) =>
        ["key_points", "important_points"].includes(item.type),
      );
      if (section && section.title !== "Quick revision") {
        section.title = "Quick revision";
        questionChanged = true;
      }

      const interview = sections.find((item) => item.type === "speakable_answer");
      if (interview && interview.title !== "Interview answer") {
        interview.title = "Interview answer";
        questionChanged = true;
      }

      if (questionChanged) {
        changed = true;
        questionsChanged += 1;
      }
    }

    if (changed) {
      fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
      filesChanged += 1;
    }
  }
}

console.log(`Normalized three-zone labels in ${questionsChanged} questions across ${filesChanged} files; answer content was preserved.`);
