#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/go-fresher");
const index = JSON.parse(fs.readFileSync(path.join(domainRoot, "_index.json"), "utf8"));
const expectedArg = process.argv.find((argument) => argument.startsWith("--expect="));
const expected = expectedArg ? Number(expectedArg.split("=")[1]) : null;
const teachingTypes = new Set(["overview", "core_concepts", "deep_explanation", "detailed_explanation", "explanation"]);
const genericTitles = [/^concept explained$/i, /^deep dive$/i, /^overview$/i, /^detailed explanation$/i, /^how it works$/i];
const editorialTitle = /^(?:start|begin|follow|see|watch|know|remember|trace|read|use|choose|keep|separate|look at|think about)\b/i;

const files = [];
for (const module of index.modules ?? []) {
  if (!module?.moduleSlug || module.contentSource) continue;
  for (const topic of module.topics ?? []) {
    const file = path.join(domainRoot, module.moduleSlug, topic, "complete-qa.json");
    if (fs.existsSync(file)) files.push(file);
  }
}

let changedFiles = 0;
let changedHeadings = 0;
for (const file of files) {
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions)) continue;

  let changed = false;
  for (const question of questions) {
    const base = String(question.title || question.question || "Go concept")
      .replace(/\?$/, "")
      .trim();
    for (const section of question.answer?.sections ?? []) {
      if (!teachingTypes.has(section.type)) continue;
      const title = String(section.title ?? "").trim();
      if (!genericTitles.some((pattern) => pattern.test(title)) && !editorialTitle.test(title)) continue;
      section.title = `Concept guide · ${base}`;
      changed = true;
      changedHeadings += 1;
    }
  }

  if (changed) {
    fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
    changedFiles += 1;
  }
}

if (expected !== null && changedHeadings !== expected) {
  throw new Error(`Expected ${expected} heading rewrites, found ${changedHeadings}`);
}

console.log(`Normalized ${changedHeadings} Go Deep Dive headings across ${changedFiles} indexed files.`);
