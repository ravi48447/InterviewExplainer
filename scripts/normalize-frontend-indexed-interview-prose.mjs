#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(repoRoot, "content/frontend-fresher");
const index = JSON.parse(fs.readFileSync(path.join(contentRoot, "_index.json"), "utf8"));

const EXPECTED_INDEXED_QUESTIONS = 309;

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function bulletParagraphs(value) {
  const markdown = String(value ?? "").trim();
  return markdown
    .split(/\n(?=\s*[-*+]\s+)/)
    .map((part) => part.replace(/^\s*[-*+]\s+/, "").trim())
    .filter(Boolean);
}

function isDenseLongBulletAnswer(value) {
  const markdown = String(value ?? "").trim();
  if (!markdown || /^(?:#{1,6}\s|```|\|)/m.test(markdown)) return false;
  const bullets = bulletParagraphs(markdown);
  if (bullets.length < 4) return false;
  const wordsIn = (text) => normalize(text).split(" ").filter(Boolean).length;
  const totalWords = wordsIn(markdown);
  const averageWords = bullets.reduce((sum, bullet) => sum + wordsIn(bullet), 0) / bullets.length;
  return totalWords >= 140 && averageWords >= 30;
}

function asFiveParagraphs(bullets) {
  if (bullets.length <= 5) return bullets;
  return Array.from({ length: 5 }, (_, index) => {
    const start = Math.floor((index * bullets.length) / 5);
    const end = Math.floor(((index + 1) * bullets.length) / 5);
    return bullets.slice(start, end).join(" ");
  });
}

const indexedFiles = [];
for (const module of index.modules ?? []) {
  if (!module?.moduleSlug || module.contentSource) continue;
  for (const topic of module.topics ?? []) {
    const file = path.join(contentRoot, module.moduleSlug, topic, "complete-qa.json");
    if (!fs.existsSync(file)) throw new Error(`Missing indexed topic file: ${file}`);
    indexedFiles.push(file);
  }
}

const candidates = [];
const documents = new Map();
let indexedQuestionCount = 0;
for (const file of indexedFiles) {
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  documents.set(file, document);
  const questions = Array.isArray(document) ? document : (document.questions ?? []);
  indexedQuestionCount += questions.length;
  for (const question of questions) {
    const section = question.answer?.sections?.find((item) => item.type === "speakable_answer");
    if (section && isDenseLongBulletAnswer(section.content)) {
      candidates.push({ file, question, section });
    }
  }
}

if (indexedQuestionCount !== EXPECTED_INDEXED_QUESTIONS) {
  throw new Error(`Expected ${EXPECTED_INDEXED_QUESTIONS} indexed Frontend questions, found ${indexedQuestionCount}`);
}

const changedFiles = new Set();
for (const { file, question, section } of candidates) {
  const paragraphs = asFiveParagraphs(bulletParagraphs(section.content));
  if (paragraphs.length < 3 || paragraphs.length > 5) {
    throw new Error(`${question.slug}: normalizer produced ${paragraphs.length} paragraphs`);
  }
  section.content = paragraphs.join("\n\n");
  if (isDenseLongBulletAnswer(section.content)) {
    throw new Error(`${question.slug}: dense bullet formatting remains after normalization`);
  }
  changedFiles.add(file);
}

for (const file of changedFiles) {
  fs.writeFileSync(file, `${JSON.stringify(documents.get(file), null, 2)}\n`);
}

console.log(
  candidates.length === 0
    ? "Frontend indexed Interview Answers already use readable prose."
    : `Normalized ${candidates.length} dense Interview Answers across ${changedFiles.size} indexed topic files.`,
);
