#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apply = process.argv.includes("--apply");
const configurations = [
  {
    name: "Python",
    root: "content/python-backend-fresher",
  },
  {
    name: "Ruby",
    root: "content/ruby-backend-fresher",
  },
];

const architecturePattern = /\b(system design|architecture|design .+ system|scalability|distributed|microservices?)\b/i;
const boundarySizeSlugs = new Set([
  "python-nested-dictionaries-lists-json-data",
  "python-syntax-essentials-data-types-and-variables-common-mistake",
]);

function questionsIn(document) {
  return Array.isArray(document) ? document : document.questions;
}

function normalizedText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\]()-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function hasDenseLongBulletInterview(value) {
  const markdown = String(value ?? "").trim();
  if (!markdown || /^(?:#{1,6}\s|```|\|)/m.test(markdown)) return false;

  const bullets = (markdown.match(/^\s*[-*+]\s+.+$/gm) ?? [])
    .map((line) => line.replace(/^\s*[-*+]\s+/, "").trim())
    .filter(Boolean);
  if (bullets.length < 4) return false;

  const wordsIn = (text) => normalizedText(text).split(" ").filter(Boolean).length;
  const totalWords = wordsIn(markdown);
  const averageBulletWords = bullets.reduce(
    (total, bullet) => total + wordsIn(bullet),
    0,
  ) / bullets.length;
  return totalWords >= 140 && averageBulletWords >= 30;
}

function indexedFiles(relativeRoot) {
  const root = path.join(repoRoot, relativeRoot);
  const index = JSON.parse(fs.readFileSync(path.join(root, "_index.json"), "utf8"));
  const files = [];
  const missing = [];
  for (const module of index.modules ?? []) {
    if (module.contentSource) continue;
    for (const topic of module.topics ?? []) {
      const file = path.join(root, module.moduleSlug, topic, "complete-qa.json");
      if (fs.existsSync(file)) files.push(file);
      else missing.push(path.relative(repoRoot, file));
    }
  }
  return { files: [...new Set(files)], missing };
}

function proseParagraphs(content) {
  const paragraphs = String(content)
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim().replace(/^[-*+]\s+/, ""))
    .filter(Boolean);
  while (paragraphs.length > 5) {
    const conclusion = paragraphs.pop();
    paragraphs[paragraphs.length - 1] = `${paragraphs.at(-1)} ${conclusion}`;
  }
  return paragraphs;
}

function contentWordsIgnoringListMarkers(content) {
  return normalizedText(
    String(content).replace(/(^|\n)\s*[-*+]\s+/g, "$1"),
  );
}

function answerSize(question, content) {
  const words = wordCount(content);
  const isArchitecture = architecturePattern.test(
    `${question.question ?? ""} ${question.title ?? ""} ${question.layout_type ?? ""}`,
  );
  if (isArchitecture || words > 420) return "deep";
  return words <= 240 ? "compact" : "standard";
}

const totals = { changed: 0, files: 0 };

for (const configuration of configurations) {
  const { files, missing } = indexedFiles(configuration.root);
  const documents = files.map((file) => ({
    file,
    document: JSON.parse(fs.readFileSync(file, "utf8")),
  }));
  const routeBefore = JSON.stringify(documents.flatMap(({ document }) =>
    (questionsIn(document) ?? []).map((question) => ({
      id: question.id,
      slug: question.slug,
      question: question.question,
      order: question.order,
    }))));
  const candidates = [];

  for (const record of documents) {
    for (const question of questionsIn(record.document) ?? []) {
      const interviewSections = (question.answer?.sections ?? [])
        .filter((section) => section.type === "speakable_answer");
      if (interviewSections.length !== 1) continue;
      const interview = interviewSections[0];
      if (!hasDenseLongBulletInterview(interview.content)) continue;
      candidates.push({ record, question, interview });
    }
  }

  const changedFiles = new Set();
  let sizeCorrections = 0;
  for (const { record, question, interview } of candidates) {
    const paragraphs = proseParagraphs(interview.content);
    if (paragraphs.length < 3 || paragraphs.length > 5) {
      throw new Error(`${configuration.name}/${question.slug}: expected 3–5 prose paragraphs; found ${paragraphs.length}`);
    }
    const beforeWords = contentWordsIgnoringListMarkers(interview.content);
    const supportBefore = JSON.stringify(
      question.answer.sections.filter((section) => section !== interview),
    );
    const updatedContent = paragraphs.join("\n\n");
    if (contentWordsIgnoringListMarkers(updatedContent) !== beforeWords) {
      throw new Error(`${configuration.name}/${question.slug}: prose normalization changed teaching words`);
    }

    interview.content = updatedContent;
    interview.answerSize = answerSize(question, updatedContent);
    if (JSON.stringify(question.answer.sections.filter((section) => section !== interview)) !== supportBefore) {
      throw new Error(`${configuration.name}/${question.slug}: Deep Dive or teaching support changed`);
    }
    changedFiles.add(record.file);
  }

  for (const record of documents) {
    for (const question of questionsIn(record.document) ?? []) {
      if (!boundarySizeSlugs.has(question.slug)) continue;
      const interview = (question.answer?.sections ?? [])
        .find((section) => section.type === "speakable_answer");
      if (!interview) throw new Error(`${question.slug}: Interview answer is missing`);
      const desiredSize = answerSize(question, interview.content);
      if (interview.answerSize === desiredSize) continue;
      interview.answerSize = desiredSize;
      changedFiles.add(record.file);
      sizeCorrections += 1;
    }
  }

  const routeAfter = JSON.stringify(documents.flatMap(({ document }) =>
    (questionsIn(document) ?? []).map((question) => ({
      id: question.id,
      slug: question.slug,
      question: question.question,
      order: question.order,
    }))));
  if (routeAfter !== routeBefore) {
    throw new Error(`${configuration.name}: an ID, slug, question, route order, or explicit order changed`);
  }

  const remainingDense = documents.flatMap(({ document }) => questionsIn(document) ?? [])
    .flatMap((question) => (question.answer?.sections ?? [])
      .filter((section) => section.type === "speakable_answer"))
    .filter((section) => hasDenseLongBulletInterview(section.content));
  if (remainingDense.length !== 0) {
    throw new Error(`${configuration.name}: ${remainingDense.length} dense indexed answers remain after normalization`);
  }

  if (apply) {
    for (const record of documents) {
      if (!changedFiles.has(record.file)) continue;
      fs.writeFileSync(record.file, `${JSON.stringify(record.document, null, 2)}\n`);
    }
  }

  console.log(
    `${configuration.name}: ${candidates.length} dense answers ${apply ? "normalized" : "ready to normalize"}, ${sizeCorrections} boundary size corrections, across ${changedFiles.size} files; ${missing.length} pre-existing indexed topic files are absent.`,
  );
  totals.changed += candidates.length;
  totals.files += changedFiles.size;
}

console.log(
  `${apply ? "Normalized" : "Would normalize"} ${totals.changed} indexed Interview answers across ${totals.files} files without changing teaching words, IDs, slugs, routes, order, Deep Dive, or support.`,
);
