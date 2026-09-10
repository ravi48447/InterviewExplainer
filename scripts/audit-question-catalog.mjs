#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argumentsList = process.argv.slice(2);
const strict = argumentsList.includes("--strict");
const summaryOnly = argumentsList.includes("--summary-only");
const maxArgument = argumentsList.find((value) => value.startsWith("--max="));
const maxFailures = maxArgument ? Math.max(0, Number(maxArgument.split("=")[1]) || 0) : 40;
const requestedRoots = argumentsList.filter((value) => !value.startsWith("--"));
const defaultRoots = [
  "content/java-backend-fresher",
  "content/go-fresher",
  "content/python-backend-fresher",
  "content/frontend-fresher",
  "content/ruby-backend-fresher",
];
const roots = requestedRoots.length > 0 ? requestedRoots : defaultRoots;

const generatedQuestionPatterns = [
  /^what is .+, and when would you use it\?$/i,
  /^when would you use .+ in a real project\?$/i,
  /^what is a common mistake when using .+\?$/i,
  /^how would you compare .+ with an alternative\?$/i,
  /^how would you debug a problem involving .+\?$/i,
];

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionText(question, predicate) {
  return (question.answer?.sections ?? [])
    .filter(predicate)
    .flatMap((section) => [
      typeof section.content === "string" ? section.content : "",
      ...(Array.isArray(section.items) ? section.items : []),
    ])
    .filter(Boolean)
    .join("\n");
}

function addToMap(map, key, value) {
  if (!key) return;
  const entries = map.get(key) ?? [];
  entries.push(value);
  map.set(key, entries);
}

function duplicateGroups(map) {
  return [...map.entries()].filter(([, entries]) => entries.length > 1);
}

function topicFiles(moduleDirectory) {
  if (!fs.existsSync(moduleDirectory)) return [];
  return fs
    .readdirSync(moduleDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      topic: entry.name,
      file: path.join(moduleDirectory, entry.name, "complete-qa.json"),
    }))
    .filter((entry) => fs.existsSync(entry.file));
}

const failures = [];
const summaries = [];

for (const requestedRoot of roots) {
  const absoluteRoot = path.resolve(repoRoot, requestedRoot);
  const relativeRoot = path.relative(repoRoot, absoluteRoot);
  const indexPath = path.join(absoluteRoot, "_index.json");

  if (!fs.existsSync(indexPath)) {
    failures.push(`${relativeRoot}: missing _index.json`);
    continue;
  }

  let index;
  try {
    index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  } catch (error) {
    failures.push(`${relativeRoot}: invalid _index.json (${error.message})`);
    continue;
  }

  const modules = Array.isArray(index.modules) ? index.modules : [];
  const indexedModuleSlugs = new Set(modules.map((module) => module.moduleSlug).filter(Boolean));
  const physicalModuleSlugs = fs
    .readdirSync(absoluteRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith("."))
    .map((entry) => entry.name);
  const unindexedModules = physicalModuleSlugs.filter((moduleSlug) => !indexedModuleSlugs.has(moduleSlug));
  for (const moduleSlug of unindexedModules) {
    failures.push(`${relativeRoot}: unindexed physical module ${moduleSlug}`);
  }

  const ids = new Map();
  const slugs = new Map();
  const questionTexts = new Map();
  const directAnswers = new Map();
  const interviewAnswers = new Map();
  const deepAnswers = new Map();
  let questionCount = 0;
  let shellCount = 0;
  let missingTopicCount = 0;
  let unindexedTopicCount = 0;

  for (const module of modules) {
    if (!module?.moduleSlug) {
      failures.push(`${relativeRoot}: indexed module is missing moduleSlug`);
      continue;
    }

    if (module.contentSource) continue;

    const moduleDirectory = path.join(absoluteRoot, module.moduleSlug);
    if (!fs.existsSync(moduleDirectory)) {
      failures.push(`${relativeRoot}: indexed module directory is missing: ${module.moduleSlug}`);
      continue;
    }

    const files = topicFiles(moduleDirectory);
    const expectedTopics = new Set(Array.isArray(module.topics) ? module.topics : []);
    const physicalTopics = new Set(files.map((entry) => entry.topic));
    for (const topic of expectedTopics) {
      if (!physicalTopics.has(topic)) {
        missingTopicCount += 1;
        failures.push(`${relativeRoot}/${module.moduleSlug}: indexed topic is missing: ${topic}`);
      }
    }
    for (const topic of physicalTopics) {
      if (!expectedTopics.has(topic)) {
        unindexedTopicCount += 1;
        failures.push(`${relativeRoot}/${module.moduleSlug}: unindexed answer topic: ${topic}`);
      }
    }

    // Only indexed topics are part of the live catalog. Physical legacy topics
    // are still reported above, but must not inflate canonical counts or make
    // active-content duplicate checks fail.
    for (const { topic, file } of files.filter((entry) => expectedTopics.has(entry.topic))) {
      let document;
      try {
        document = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch (error) {
        failures.push(`${path.relative(repoRoot, file)}: invalid JSON (${error.message})`);
        continue;
      }

      const questions = Array.isArray(document) ? document : (document.questions ?? []);
      for (const question of questions) {
        questionCount += 1;
        const location = `${module.moduleSlug}/${topic}/${question.slug ?? "<missing-slug>"}`;
        addToMap(ids, question.id, location);
        addToMap(slugs, question.slug, location);
        addToMap(questionTexts, normalize(question.question), location);

        const direct = normalize(question.direct_answer);
        if (direct.split(" ").length >= 18) addToMap(directAnswers, direct, location);

        const interview = normalize(
          sectionText(question, (section) => section.type === "speakable_answer"),
        );
        if (interview.split(" ").length >= 40) addToMap(interviewAnswers, interview, location);

        const deep = normalize(
          sectionText(
            question,
            (section) => ![
              "key_points",
              "important_points",
              "speakable_answer",
              "interviewer_expectation",
            ].includes(section.type),
          ),
        );
        if (deep.split(" ").length >= 40) addToMap(deepAnswers, deep, location);

        if (generatedQuestionPatterns.some((pattern) => pattern.test(question.question ?? ""))) {
          shellCount += 1;
          failures.push(`${relativeRoot}/${location}: generated-shell question: ${question.question}`);
        }
      }
    }
  }

  const duplicateCollections = [
    ["question ID", duplicateGroups(ids)],
    ["question slug", duplicateGroups(slugs)],
    ["exact question", duplicateGroups(questionTexts)],
    ["copied direct answer", duplicateGroups(directAnswers)],
    ["copied Interview Answer", duplicateGroups(interviewAnswers)],
    ["copied Deep Dive", duplicateGroups(deepAnswers)],
  ];

  let duplicateCount = 0;
  for (const [label, groups] of duplicateCollections) {
    duplicateCount += groups.length;
    for (const [, locations] of groups) {
      failures.push(`${relativeRoot}: duplicate ${label}: ${locations.join(" | ")}`);
    }
  }

  summaries.push({
    root: relativeRoot,
    modules: modules.length,
    questions: questionCount,
    unindexedModules: unindexedModules.length,
    missingTopics: missingTopicCount,
    unindexedTopics: unindexedTopicCount,
    shellQuestions: shellCount,
    duplicateGroups: duplicateCount,
  });
}

for (const summary of summaries) {
  console.log(
    `${summary.root}: ${summary.modules} indexed modules, ${summary.questions} canonical questions, `
      + `${summary.unindexedModules} unindexed modules, ${summary.missingTopics} missing topics, `
      + `${summary.unindexedTopics} unindexed topics, ${summary.shellQuestions} shell questions, `
      + `${summary.duplicateGroups} duplicate groups.`,
  );
}

if (!summaryOnly) {
  for (const failure of failures.slice(0, maxFailures)) console.error(`- ${failure}`);
  if (failures.length > maxFailures) {
    console.error(`...and ${failures.length - maxFailures} more catalog issues.`);
  }
}

if (failures.length === 0) {
  console.log("Question catalog audit passed.");
} else {
  console.log(`Question catalog audit found ${failures.length} issue(s).`);
  if (strict) process.exitCode = 1;
}
