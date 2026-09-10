#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(repoRoot, "content/java-backend-fresher");
const apply = process.argv.includes("--apply");
const slugArgument = process.argv.find((value) => value.startsWith("--slug="));
const onlySlug = slugArgument?.slice("--slug=".length);

const zoneTypes = new Set([
  "key_points",
  "important_points",
  "speakable_answer",
  "interviewer_expectation",
]);

const proseTypes = new Set([
  "overview",
  "core_concepts",
  "deep_explanation",
  "detailed_explanation",
  "explanation",
]);

function* completeQaFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* completeQaFiles(file);
    else if (entry.name === "complete-qa.json") yield file;
  }
}

function questionsIn(document) {
  return Array.isArray(document) ? document : document.questions;
}

function textOf(section) {
  return [section?.content, ...(Array.isArray(section?.items) ? section.items : [])]
    .filter((value) => typeof value === "string")
    .join("\n");
}

function fingerprint(section) {
  return `${section?.type ?? ""}|${section?.title ?? ""}|${textOf(section)}`
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const changedFiles = [];
const changedQuestions = [];
const supportTypes = new Map();
let eligible = 0;
let withoutHistoricalSupport = 0;

for (const file of completeQaFiles(contentRoot)) {
  const relative = path.relative(repoRoot, file).split(path.sep).join("/");
  if (relative.startsWith("content/java-backend-fresher/rest-api-basics/")) continue;

  const currentDocument = JSON.parse(fs.readFileSync(file, "utf8"));
  const currentQuestions = questionsIn(currentDocument);
  if (!Array.isArray(currentQuestions)) continue;

  let baseDocument;
  try {
    baseDocument = JSON.parse(execFileSync("git", ["show", `HEAD:${relative}`], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }));
  } catch {
    continue;
  }

  const baseQuestions = questionsIn(baseDocument);
  if (!Array.isArray(baseQuestions)) continue;
  const baseBySlug = new Map(baseQuestions.map((question) => [question.slug, question]));
  let fileChanged = false;

  for (const question of currentQuestions) {
    if (onlySlug && question.slug !== onlySlug) continue;
    const sections = question.answer?.sections;
    if (!Array.isArray(sections)) continue;

    const teaching = sections.filter((section) => !zoneTypes.has(section.type));
    const currentSupport = teaching.filter((section) => !proseTypes.has(section.type));
    if (sections.length !== 3 || currentSupport.length > 0) continue;

    eligible += 1;
    const historical = baseBySlug.get(question.slug);
    const historicalSections = historical?.answer?.sections;
    if (!Array.isArray(historicalSections)) {
      withoutHistoricalSupport += 1;
      continue;
    }

    const existing = new Set(sections.map(fingerprint));
    const support = historicalSections.filter((section) => {
      if (!section || typeof section !== "object") return false;
      if (zoneTypes.has(section.type) || proseTypes.has(section.type)) return false;
      if (!textOf(section).trim()) return false;
      return !existing.has(fingerprint(section));
    });

    if (support.length === 0) {
      withoutHistoricalSupport += 1;
      continue;
    }

    for (const section of support) {
      supportTypes.set(section.type, (supportTypes.get(section.type) ?? 0) + 1);
    }
    question.answer.sections = [...sections, ...structuredClone(support)];
    changedQuestions.push(`${relative}\t${question.slug}\t+${support.length}`);
    fileChanged = true;
  }

  if (fileChanged) {
    changedFiles.push(relative);
    if (apply) fs.writeFileSync(file, `${JSON.stringify(currentDocument, null, 2)}\n`);
  }
}

console.log(`${apply ? "Restored" : "Would restore"} historical teaching support for ${changedQuestions.length}/${eligible} shallow questions across ${changedFiles.length} files.`);
console.log(`Eligible questions without reusable historical support: ${withoutHistoricalSupport}.`);
console.log(`Support sections: ${[...supportTypes.entries()].sort((a, b) => b[1] - a[1]).map(([type, count]) => `${type}=${count}`).join(", ") || "none"}.`);
for (const row of changedQuestions) console.log(row);
