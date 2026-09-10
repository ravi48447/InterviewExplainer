#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const roots = args.filter((value) => !value.startsWith("--"));
const indexedOnly = args.includes("--indexed-only");
const requireGuided = args.includes("--require-guided");
const strict = args.includes("--strict");
const slugArgument = args.find((value) => value.startsWith("--slug="));
const targetSlug = slugArgument?.slice("--slug=".length).trim() || null;
const maxArgument = args.find((value) => value.startsWith("--max="));
const maxDetails = maxArgument ? Math.max(0, Number(maxArgument.split("=")[1]) || 0) : 20;
const contentRoots = roots.length > 0
  ? roots
  : [
      "content/java-backend-fresher",
      "content/go-fresher",
      "content/frontend-fresher",
      "content/python-backend-fresher",
      "content/ruby-backend-fresher",
    ];

const editorialStagePatterns = [
  /^point\s*\d*$/i,
  /^example$/i,
  /^direct answer$/i,
  /^what to say$/i,
  /^mention this$/i,
  /^introduction$/i,
];

function* jsonFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".archive", "_audits"].includes(entry.name)) continue;
      yield* jsonFiles(file);
    } else if (entry.name === "complete-qa.json") {
      yield file;
    }
  }
}

function indexedFilesFor(root) {
  if (!indexedOnly) return null;
  const indexPath = path.join(root, "_index.json");
  if (!fs.existsSync(indexPath)) return null;
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  const files = new Set();
  for (const module of index.modules ?? []) {
    if (!module?.moduleSlug || module.contentSource) continue;
    for (const topic of module.topics ?? []) {
      const file = path.resolve(root, module.moduleSlug, topic, "complete-qa.json");
      if (fs.existsSync(file)) files.add(file);
    }
  }
  return files;
}

function textOf(section) {
  if (typeof section?.content === "string") return section.content;
  if (Array.isArray(section?.content)) return section.content.join("\n");
  return "";
}

function normalized(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value = "") {
  const text = normalized(value);
  return text ? text.split(" ").length : 0;
}

function validateGuided(section) {
  const problems = [];
  const beats = Array.isArray(section?.beats) ? section.beats : [];
  if (beats.length < 2) return ["fewer than two authored beats"];

  const stages = beats.map((beat) => String(beat?.stage || "").trim());
  if (stages.some((stage) => !stage)) problems.push("missing concept-specific stage heading");
  if (new Set(stages.map((stage) => stage.toLowerCase())).size !== stages.length) {
    problems.push("duplicate stage heading");
  }
  if (stages.some((stage) => editorialStagePatterns.some((pattern) => pattern.test(stage)))) {
    problems.push("generic or coaching stage heading");
  }

  let supportCount = 0;
  for (const beat of beats) {
    const spokenText = String(beat?.spokenText || "").trim();
    if (!spokenText) problems.push("empty beat text");
    if (wordCount(spokenText) > 90) problems.push("one beat is still an essay-sized paragraph");
    if (/```|^\s*\|.+\|\s*$/m.test(spokenText)) {
      problems.push("code or table mixed into beat prose");
    }
    const inlineCode = [...spokenText.matchAll(/`([^`\n]+)`/g)].map((match) => match[1].trim());
    if (inlineCode.some((fragment) => fragment.length > 72)) {
      problems.push("long code fragment mixed into beat prose");
    }
    const support = beat?.support;
    if (!support) continue;
    supportCount += 1;
    if (support.type === "code" && (!String(support.code || "").trim() || !String(support.language || "").trim())) {
      problems.push("incomplete code support");
    }
    if (["comparison", "trace", "checklist"].includes(support.type) && (!Array.isArray(support.items) || support.items.length < 2)) {
      problems.push(`incomplete ${support.type} support`);
    }
  }
  if (supportCount > 2) problems.push("more than two support blocks compete with the answer flow");

  const canonicalFallback = beats.map((beat) => String(beat?.spokenText || "").trim()).join("\n\n");
  if (normalized(textOf(section)) !== normalized(canonicalFallback)) {
    problems.push("fallback content has drifted from beats");
  }
  return [...new Set(problems)];
}

const totals = {
  questions: 0,
  guided: 0,
  authoredMarkdown: 0,
  plain: 0,
  wallRisk: 0,
  inlineCodeRisk: 0,
  invalidGuided: 0,
};
const rootStats = new Map();
const details = [];

for (const root of contentRoots) {
  const indexedFiles = indexedFilesFor(root);
  const stats = { questions: 0, guided: 0, plain: 0, wallRisk: 0 };
  for (const file of jsonFiles(root)) {
    if (indexedFiles && !indexedFiles.has(path.resolve(file))) continue;
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    const questions = Array.isArray(document) ? document : document.questions;
    if (!Array.isArray(questions)) continue;

    for (const question of questions) {
      if (targetSlug && question.slug !== targetSlug) continue;
      const speakable = question.answer?.sections?.find((section) => section.type === "speakable_answer");
      if (!speakable) continue;
      totals.questions += 1;
      stats.questions += 1;

      const content = textOf(speakable);
      const beats = Array.isArray(speakable.beats) ? speakable.beats : [];
      const hasAuthoredMarkdown = /^\s{0,3}(?:#{1,6}\s|[-*+]\s|\d+[.)]\s|>|```|\|)/m.test(content);
      const paragraphCount = content.split(/\n\s*\n+/).map((part) => part.trim()).filter(Boolean).length;
      const inlineCodeCount = (content.match(/`[^`\n]+`/g) ?? []).length;
      const plainWallRisk = beats.length === 0 && !hasAuthoredMarkdown && wordCount(content) >= 120 && paragraphCount <= 6;
      const inlineCodeRisk = beats.length === 0 && !/```/.test(content) && inlineCodeCount >= 4;

      if (beats.length > 0) {
        totals.guided += 1;
        stats.guided += 1;
        const problems = validateGuided(speakable);
        if (problems.length > 0) {
          totals.invalidGuided += 1;
          details.push({ root, file, slug: question.slug, problems });
        }
      } else if (hasAuthoredMarkdown) {
        totals.authoredMarkdown += 1;
      } else {
        totals.plain += 1;
        stats.plain += 1;
      }

      if (plainWallRisk) {
        totals.wallRisk += 1;
        stats.wallRisk += 1;
      }
      if (inlineCodeRisk) totals.inlineCodeRisk += 1;
      if (requireGuided && beats.length === 0) {
        details.push({ root, file, slug: question.slug, problems: ["missing authored guided presentation"] });
      }
    }
  }
  rootStats.set(root, stats);
}

console.log("Interview Answer presentation audit");
for (const [root, stats] of rootStats) {
  console.log(
    `${root}: ${stats.guided}/${stats.questions} guided; ${stats.plain} plain; ${stats.wallRisk} wall-risk`,
  );
}
console.log(`Total: ${totals.questions}`);
console.log(`Guided articles: ${totals.guided}`);
console.log(`Authored Markdown fallbacks: ${totals.authoredMarkdown}`);
console.log(`Plain prose fallbacks: ${totals.plain}`);
console.log(`Wall-of-text risk: ${totals.wallRisk}`);
console.log(`Inline-code-in-prose risk: ${totals.inlineCodeRisk}`);
console.log(`Invalid guided articles: ${totals.invalidGuided}`);

if (targetSlug && totals.questions === 0) {
  console.error(`FAIL target slug not found: ${targetSlug}`);
  process.exit(1);
}

for (const detail of details.slice(0, maxDetails)) {
  console.error(`FAIL ${detail.slug} (${path.relative(process.cwd(), detail.file)})`);
  for (const problem of detail.problems) console.error(`  - ${problem}`);
}
if (details.length > maxDetails) console.error(`... ${details.length - maxDetails} more`);

if (strict && (totals.invalidGuided > 0 || (requireGuided && details.length > 0))) process.exit(1);
