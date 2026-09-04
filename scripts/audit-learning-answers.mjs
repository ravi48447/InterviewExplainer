#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const roots = process.argv.slice(2).filter((value) => !value.startsWith("--"));
const strict = process.argv.includes("--strict");
const speakingOnly = process.argv.includes("--speaking-only");
const contentRoots = roots.length > 0 ? roots : ["content"];
const MIN_SPEAKING_WORDS = 240;
const MAX_SPEAKING_WORDS = 460;
const speakingSizeLimits = {
  compact: { min: 120, max: 240, thoughts: 4 },
  standard: { min: 220, max: 420, thoughts: 5 },
  deep: { min: 320, max: 520, thoughts: 6 },
};

const teachingTypes = new Set([
  "overview",
  "core_concepts",
  "deep_explanation",
  "detailed_explanation",
  "explanation",
]);
const exampleTypes = new Set(["code_example", "real_world_example", "scenario_based"]);
const visualTypes = new Set([
  "diagram",
  "design_diagram",
  "flow_diagram",
  "sequence_diagram",
  "architecture_diagram",
  "concept_map",
  "comparison_table",
]);
const fillerPatterns = [
  /use it when it fits/i,
  /compare the options by correctness, speed, clarity, and cost/i,
  /mention one (?:trade-off|edge case)/i,
  /walk through (?:a|the) (?:small )?example/i,
  /practical understanding of/i,
  /core interview concept/i,
  /a way to solve a common programming problem/i,
  /useful when it solves a clear problem/i,
  /using it from memory without checking/i,
  /I look at correctness first, then/i,
  /I explain what goes in, what happens/i,
  /show a small example of/i,
  /keep the implementation small/i,
];

const coachingPatterns = [
  /(?:tell|say|mention) (?:the|your|an) interviewer/i,
  /the interviewer (?:wants|is looking for)/i,
  /to stand out/i,
  /a good answer (?:includes|should)/i,
  /start by (?:defining|explaining)/i,
];

function wordCount(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function sentenceCount(value) {
  return (String(value ?? "").match(/[.!?](?:\s|$)/g) ?? []).length;
}

function* jsonFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(file);
    else if (entry.name === "complete-qa.json") yield file;
  }
}

const failures = [];
let files = 0;
let questions = 0;
let ready = 0;
const rootStats = new Map();

for (const root of contentRoots) {
  for (const file of jsonFiles(root)) {
    files += 1;
    let document;
    try {
      document = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (error) {
      failures.push({ file, slug: "<file>", problems: [`invalid JSON: ${error.message}`] });
      continue;
    }

    const entries = Array.isArray(document) ? document : document.questions;
    if (!Array.isArray(entries)) continue;

    for (const question of entries) {
      questions += 1;
      const sections = question.answer?.sections ?? [];
      const speakingSection = sections.find((section) => section.type === "speakable_answer");
      const hasStructuredExample = Array.isArray(speakingSection?.beats)
        && speakingSection.beats.some((beat) => beat.support?.type === "code");
      const structuredSpeaking = Array.isArray(speakingSection?.beats)
        ? speakingSection.beats
            // The learner-facing answer is the knowledge itself. `leadIn` is
            // retained only as migration metadata and is not rendered or read.
            .map((beat) => String(beat.spokenText ?? "").trim())
            .filter(Boolean)
            .join("\n")
        : "";
      const speaking = structuredSpeaking || speakingSection?.content || "";
      const types = new Set(sections.map((section) => section.type));
      const text = [
        question.direct_answer,
        ...sections.flatMap((section) => [section.content, ...(section.items ?? [])]),
      ]
        .filter((value) => typeof value === "string")
        .join("\n");
      const problems = [];

      if (!speakingOnly) {
        if (!question.direct_answer || question.direct_answer.trim().length < 80) {
          problems.push("direct answer is missing or too short");
        }
        if (![...types].some((type) => teachingTypes.has(type))) {
          problems.push("missing concept-teaching section");
        }
        if (![...types].some((type) => exampleTypes.has(type))) {
          problems.push("missing worked example");
        }
        if (![...types].some((type) => visualTypes.has(type)) && !text.includes("```mermaid")) {
          problems.push("missing relevant visual");
        }
      }
      if (!types.has("speakable_answer")) {
        problems.push("missing interview speaking answer");
      } else {
        const words = wordCount(speaking);
        const limits = speakingSizeLimits[speakingSection?.answerSize] ?? {
          min: MIN_SPEAKING_WORDS,
          max: MAX_SPEAKING_WORDS,
          thoughts: 6,
        };
        if (words < limits.min) {
          problems.push(`speaking answer is too short (${words} words; minimum ${limits.min})`);
        }
        if (words > limits.max) {
          problems.push(`speaking answer is too long (${words} words; maximum ${limits.max})`);
        }
        if (sentenceCount(speaking) < limits.thoughts) {
          problems.push(`speaking answer needs at least ${limits.thoughts} complete thoughts`);
        }
        if (!hasStructuredExample && !/(?:\bexample\b|for instance|consider|suppose|imagine|```)/i.test(speaking)) {
          problems.push("speaking answer is missing a concrete example");
        }
        const speakingFiller = fillerPatterns.find((pattern) => pattern.test(speaking));
        if (speakingFiller) problems.push(`generic speaking filler: ${speakingFiller}`);
        const coaching = coachingPatterns.find((pattern) => pattern.test(speaking));
        if (coaching) problems.push(`meta-coaching instead of a model answer: ${coaching}`);
      }
      if (!speakingOnly) {
        const filler = fillerPatterns.find((pattern) => pattern.test(text));
        if (filler) problems.push(`generic filler: ${filler}`);
      }

      const stat = rootStats.get(root) ?? { questions: 0, ready: 0 };
      stat.questions += 1;
      if (problems.length === 0) {
        ready += 1;
        stat.ready += 1;
      }
      rootStats.set(root, stat);

      if (problems.length > 0) failures.push({ file, slug: question.slug ?? "<unknown>", problems });
    }
  }
}

const percentage = questions === 0 ? 0 : Math.round((ready / questions) * 1000) / 10;
console.log(`Learning-answer audit: ${ready}/${questions} ready (${percentage}%) across ${files} files.`);
for (const [root, stat] of rootStats) {
  const rootPercentage = stat.questions === 0 ? 0 : Math.round((stat.ready / stat.questions) * 1000) / 10;
  console.log(`  ${root}: ${stat.ready}/${stat.questions} ready (${rootPercentage}%)`);
}
for (const failure of failures.slice(0, 30)) {
  console.log(`- ${failure.slug} (${failure.file}): ${failure.problems.join("; ")}`);
}
if (failures.length > 30) console.log(`...and ${failures.length - 30} more incomplete answers.`);

if (strict && failures.length > 0) process.exitCode = 1;
