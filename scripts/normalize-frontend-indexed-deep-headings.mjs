#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(repoRoot, "content/frontend-fresher");
const index = JSON.parse(fs.readFileSync(path.join(contentRoot, "_index.json"), "utf8"));
const EXPECTED_INDEXED_QUESTIONS = 309;
const genericTitle = /^(?:concept explained|deep dive|overview|detailed explanation|how it works)$/i;
const teachingTypes = new Set(["overview", "core_concepts", "deep_explanation", "detailed_explanation", "explanation"]);

const replacements = new Map([
  ["Keep content, structure, and trust separate", "Safe DOM content and structure boundaries"],
  ["Trace the value from source to sink", "DOM injection data flow"],
  ["Use the simplest interaction pattern that fits", "CSS interaction pattern selection"],
  ["Choose space by ownership", "Margin, padding, and gap ownership"],
  ["Choose by constraint, then combine", "Grid and Flexbox constraint models"],
  ["Start, surplus, shortage", "Flexbox free-space distribution"],
  ["Use native semantics before custom behaviour", "Native form-control semantics"],
  ["Choose from the operation's meaning", "GET and POST form semantics"],
  ["Trace the actual submitter", "Form submitter behavior"],
  ["Choose the shape that states the meaning", "Array and object data-shape choices"],
  ["Know which reads depend on layout", "DOM layout reads and writes"],
  ["Choose whether intermediate activity matters", "Debounce and throttle event behavior"],
  ["Follow one edit from the keyboard to the submitted data", "Controlled form input lifecycle"],
  ["Choose navigation by who initiates the transition", "Declarative and programmatic navigation"],
  ["Separate malformed identity from valid-but-unavailable resources", "Route parameter and resource validation"],
  ["Use two not-found decisions, one at each layer", "Client and server not-found handling"],
  ["Choose by transition shape", "useState and useReducer transition models"],
]);

const files = [];
for (const module of index.modules ?? []) {
  if (!module?.moduleSlug || module.contentSource) continue;
  for (const topic of module.topics ?? []) {
    const file = path.join(contentRoot, module.moduleSlug, topic, "complete-qa.json");
    if (!fs.existsSync(file)) throw new Error(`Missing indexed topic file: ${file}`);
    files.push(file);
  }
}

const documents = new Map(files.map((file) => [file, JSON.parse(fs.readFileSync(file, "utf8"))]));
const indexedQuestionCount = [...documents.values()].reduce((total, document) => {
  const questions = Array.isArray(document) ? document : (document.questions ?? []);
  return total + questions.length;
}, 0);
if (indexedQuestionCount !== EXPECTED_INDEXED_QUESTIONS) {
  throw new Error(`Expected ${EXPECTED_INDEXED_QUESTIONS} indexed Frontend questions, found ${indexedQuestionCount}`);
}

let changed = 0;
let genericChanges = 0;
let namedChanges = 0;
for (const file of files) {
  const document = documents.get(file);
  const questions = Array.isArray(document) ? document : (document.questions ?? []);
  let fileChanged = false;
  for (const question of questions) {
    for (const section of question.answer?.sections ?? []) {
      if (!teachingTypes.has(section.type)) continue;
      const previous = String(section.title ?? "").trim();
      if (genericTitle.test(previous)) {
        if (!question.title) throw new Error(`${question.slug}: cannot replace generic heading without a question title`);
        section.title = `Concept: ${question.title}`;
        genericChanges += 1;
      } else if (replacements.has(previous)) {
        section.title = replacements.get(previous);
        namedChanges += 1;
      } else {
        continue;
      }
      changed += 1;
      fileChanged = true;
    }
  }
  if (fileChanged) fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

console.log(changed === 0
  ? "Indexed Frontend Deep Dive headings already name their concepts."
  : `Renamed ${changed} indexed Deep Dive headings (${genericChanges} generic, ${namedChanges} editorial).`);
