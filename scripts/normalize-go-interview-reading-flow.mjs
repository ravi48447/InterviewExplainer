#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatInterviewArticle,
  interviewAnswerSize,
  isDenseBulletInterview,
} from "./lib/interview-article.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/go-fresher");
const index = JSON.parse(fs.readFileSync(path.join(domainRoot, "_index.json"), "utf8"));
const expectedArg = process.argv.find((argument) => argument.startsWith("--expect="));
const expected = expectedArg ? Number(expectedArg.split("=")[1]) : null;

const files = new Set();
for (const module of index.modules ?? []) {
  if (!module?.moduleSlug || module.contentSource) continue;
  for (const topic of module.topics ?? []) {
    const file = path.join(domainRoot, module.moduleSlug, topic, "complete-qa.json");
    if (fs.existsSync(file)) files.add(file);
  }
}

let changedFiles = 0;
let changedQuestions = 0;
const paragraphCounts = new Map();
const sizeCounts = new Map();

for (const file of [...files].sort()) {
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions)) continue;

  const identityBefore = JSON.stringify(
    questions.map(({ id, slug, order }) => ({ id, slug, order })),
  );
  let changed = false;

  for (const question of questions) {
    const section = (question.answer?.sections ?? []).find(
      (item) => item.type === "speakable_answer",
    );
    if (!section || (Array.isArray(section.beats) && section.beats.length > 0)) continue;
    if (!isDenseBulletInterview(section.content)) continue;

    const content = formatInterviewArticle(section.content);
    const paragraphs = content.split(/\n\s*\n/).filter((part) => part.trim());
    if (paragraphs.length < 3 || paragraphs.length > 5) {
      throw new Error(`${question.slug}: normalized to ${paragraphs.length} paragraphs`);
    }

    section.content = content;
    section.answerSize = interviewAnswerSize(content, question);
    changed = true;
    changedQuestions += 1;
    paragraphCounts.set(paragraphs.length, (paragraphCounts.get(paragraphs.length) ?? 0) + 1);
    sizeCounts.set(section.answerSize, (sizeCounts.get(section.answerSize) ?? 0) + 1);
  }

  const identityAfter = JSON.stringify(
    questions.map(({ id, slug, order }) => ({ id, slug, order })),
  );
  if (identityAfter !== identityBefore) throw new Error(`${file}: question identity changed`);

  if (changed) {
    fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
    changedFiles += 1;
  }
}

if (expected !== null && changedQuestions !== expected) {
  throw new Error(`Expected ${expected} rewrites, found ${changedQuestions}`);
}

console.log(
  `Normalized ${changedQuestions} Go Interview Answers across ${changedFiles} indexed files; `
  + `paragraphs=${JSON.stringify(Object.fromEntries([...paragraphCounts].sort()))}; `
  + `answerSize=${JSON.stringify(Object.fromEntries([...sizeCounts].sort()))}.`,
);
