#!/usr/bin/env node

/**
 * Remove a Deep Dive paragraph only when it is a normalized, word-for-word
 * copy of direct_answer and useful teaching prose remains after removal.
 *
 * This is deliberately narrower than the similarity audit: near-duplicates
 * need editorial rewriting, not an automatic deletion.
 *
 * Usage:
 *   node scripts/dedupe-jbf-zone-intros.mjs --check
 *   node scripts/dedupe-jbf-zone-intros.mjs --write
 *   node scripts/dedupe-jbf-zone-intros.mjs --write <module-or-file> ...
 */

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const write = args.includes("--write");
const targets = args.filter((arg) => !arg.startsWith("--"));
const roots = targets.length > 0 ? targets : ["content/java-backend-fresher"];
const excludedSegments = args
  .filter((arg) => arg.startsWith("--exclude="))
  .map((arg) => arg.slice("--exclude=".length))
  .filter(Boolean);
const teachingTypes = new Set([
  "overview",
  "core_concepts",
  "deep_explanation",
  "detailed_explanation",
  "explanation",
]);

function* jsonFiles(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (path.basename(target) === "complete-qa.json") yield target;
    return;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if ([".archive", "_audits"].includes(entry.name)) continue;
    const child = path.join(target, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(child);
    else if (entry.name === "complete-qa.json") yield child;
  }
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function proseWords(value) {
  const normalized = normalize(value);
  return normalized ? normalized.split(" ").length : 0;
}

let filesChanged = 0;
let questionsChanged = 0;
const changes = [];

for (const file of [...new Set(roots.flatMap((root) => [...jsonFiles(root)]))].sort()) {
  const segments = path.normalize(file).split(path.sep);
  if (excludedSegments.some((segment) => segments.includes(segment))) continue;
  const source = fs.readFileSync(file, "utf8");
  const document = JSON.parse(source);
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions)) continue;
  let fileChanged = false;

  for (const question of questions) {
    const direct = normalize(question.direct_answer);
    if (proseWords(direct) < 30) continue;
    const sections = question.answer?.sections;
    if (!Array.isArray(sections)) continue;

    const teaching = sections.filter((section) => teachingTypes.has(section?.type));
    const rewritten = teaching.map((section) => {
      const paragraphs = String(section.content ?? "").split(/\n\s*\n/);
      const kept = paragraphs.filter((paragraph) => normalize(paragraph) !== direct);
      return { section, paragraphs, kept };
    });
    const removed = rewritten.reduce(
      (count, item) => count + item.paragraphs.length - item.kept.length,
      0,
    );
    if (removed === 0) continue;

    const remainingProse = rewritten.map((item) => item.kept.join("\n\n")).join("\n\n");
    if (proseWords(remainingProse) < 40) continue;

    for (const item of rewritten) {
      if (item.paragraphs.length !== item.kept.length) {
        item.section.content = item.kept.join("\n\n").trim();
      }
    }
    question.answer.sections = sections.filter(
      (section) => !teachingTypes.has(section?.type) || String(section.content ?? "").trim(),
    );
    fileChanged = true;
    questionsChanged += 1;
    changes.push(`${file} :: ${question.slug ?? question.id ?? "<unknown>"}`);
  }

  if (fileChanged) {
    filesChanged += 1;
    if (write) fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
  }
}

for (const change of changes) console.log(change);
console.log(
  `${write ? "Updated" : "Would update"} ${questionsChanged} question(s) across ${filesChanged} file(s).`,
);
