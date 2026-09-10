#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const roots = process.argv.slice(2).filter((value) => !value.startsWith("--"));
const strict = process.argv.includes("--strict");
const speakingOnly = process.argv.includes("--speaking-only");
const indexedOnly = process.argv.includes("--indexed-only");
const summaryOnly = process.argv.includes("--summary-only");
const maxArgument = process.argv.find((value) => value.startsWith("--max="));
const maxFailures = maxArgument ? Math.max(0, Number(maxArgument.split("=")[1]) || 0) : 30;
const contentRoots = roots.length > 0 ? roots : ["content"];

function indexedFilesFor(root) {
  if (!indexedOnly) return null;
  const indexPath = path.join(root, "_index.json");
  if (!fs.existsSync(indexPath)) return null;

  try {
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
  } catch {
    return null;
  }
}

const teachingTypes = new Set([
  "overview",
  "core_concepts",
  "deep_explanation",
  "detailed_explanation",
  "explanation",
]);
const exampleTypes = new Set([
  "code_example",
  "before_code",
  "after_code",
  "query_example",
  "real_world_example",
  "scenario_based",
  "sample_data",
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
  /when the problem matches its main benefit/i,
  /when its rule makes the code safer, clearer, or more efficient/i,
  /with the simpler alternative by looking at correctness first/i,
  /reproducing it with the smallest input first/i,
  /using the rule without checking its boundary conditions/i,
];

const coachingPatterns = [
  /(?:tell|say|mention) (?:the|your|an) interviewer/i,
  /the interviewer (?:wants|is looking for)/i,
  /to stand out/i,
  /a good answer (?:includes|should)/i,
  /start by (?:defining|explaining)/i,
];

const generatedQuestionPatterns = [
  /how would you compare .+ with an alternative\?/i,
  /what is .+, and when would you use it\?/i,
  /when would you use .+ in a real project\?/i,
  /how would you debug a problem involving .+\?/i,
  /what is a common mistake when using .+\?/i,
];

function structuredBeatText(beat) {
  return [
    beat?.kind,
    beat?.stage,
    beat?.cue,
    beat?.spokenText,
    beat?.text,
  ]
    .filter((value) => typeof value === "string")
    .join(" ");
}

function beatContainsExample(beat) {
  if (!beat || typeof beat !== "object") return false;
  if (["code", "trace", "timeline", "state"].includes(beat.support?.type)) {
    return true;
  }
  return /\b(example|scenario|case|walkthrough|demonstration)\b/i.test(
    structuredBeatText(beat),
  );
}

function textContainsExample(value) {
  const text = String(value ?? "");
  if (/(?:\bexample\b|\bfor instance\b|\be\.g\.|\bsuch as\b|\bconsider\b|\bsuppose\b|\bimagine\b|\bpicture\b|\blet(?:'s| us) (?:say|take)\b|\bsay you\b|\blike\s+(?:a|an|the|[A-Z][\w.]*)\b|```|\b(?:GET|POST|PUT|PATCH|DELETE) \/)/i.test(text)) {
    return true;
  }

  // Existing hand-authored answers often demonstrate the idea directly
  // (`Student s = new Student()`, `List` versus `ArrayList`) without adding an
  // editorial "for example" label. Two distinct inline-code anchors are
  // concrete enough to verify and practise; a single highlighted term is not.
  const inlineCode = text.match(/`[^`\n]+`/g) ?? [];
  if (new Set(inlineCode).size >= 2) return true;

  const namedCode = text.match(/\b[A-Z][a-z]+(?:[A-Z][A-Za-z0-9]*)+\b/g) ?? [];
  if (new Set(namedCode).size >= 2) return true;

  if (/\b(?:good|bad|common|real(?:-world)?) use cases?\b|\b(?:take|say) (?:a|an|the|this)\b/i.test(text)) {
    return true;
  }

  // A named, conditional case is also a real example even when it is written
  // as prose: "If a transfer debits A but cannot credit B ...".
  return /\b(?:if|when) (?:a|an|the|i|you|we|my|your)\b[^.!?]{12,}(?:,| then |\bso\b)/i.test(text);
}

function questionNeedsConcreteExample(question) {
  return /\b(?:how|implement|write|build|create|design|debug|trace|compare|comparison|difference|versus|vs\.?|when|use|work|flow|lifecycle|what happens|scenario|example)\b/i.test(
    String(question?.question ?? ""),
  );
}

function normalizedText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  const averageBulletWords = bullets.reduce((total, bullet) => total + wordsIn(bullet), 0) / bullets.length;

  // Four essay-sized bullets already render as a wall of text and receive list
  // styling that makes full explanatory paragraphs harder to scan. Ordinary
  // recall lists stay below both the total and per-item boundaries.
  return totalWords >= 140 && averageBulletWords >= 30;
}

function shingleContainment(left, right, size = 5) {
  const leftWords = normalizedText(left).split(" ").filter(Boolean);
  const rightWords = normalizedText(right).split(" ").filter(Boolean);
  if (leftWords.length < size || rightWords.length < size) return 0;

  const shingles = (words) => new Set(
    Array.from(
      { length: words.length - size + 1 },
      (_, index) => words.slice(index, index + size).join(" "),
    ),
  );
  const leftShingles = shingles(leftWords);
  const rightShingles = shingles(rightWords);
  let overlap = 0;
  for (const shingle of leftShingles) {
    if (rightShingles.has(shingle)) overlap += 1;
  }
  return overlap / Math.min(leftShingles.size, rightShingles.size);
}

function issueCategory(problem) {
  if (problem.startsWith("direct answer is repeated") || problem.startsWith("Interview Answer substantially repeats")) {
    return "cross-zone-repetition";
  }
  if (problem.startsWith("direct answer")) return "direct-answer";
  if (problem.startsWith("quick revision")) return "quick-revision";
  if (problem.startsWith("missing concept")) return "deep-teaching";
  if (problem.startsWith("missing worked")) return "worked-example";
  if (problem.startsWith("missing relevant visual")) return "semantic-visual";
  if (problem.startsWith("missing interview")) return "interview-answer";
  if (problem.startsWith("dense long-bullet")) return "interview-reading-flow";
  if (problem.startsWith("speaking answer is missing")) return "interview-example";
  if (problem.startsWith("generic speaking") || problem.startsWith("generic filler")) return "generic-filler";
  if (problem.startsWith("meta-coaching")) return "meta-coaching";
  if (problem.startsWith("generated shell")) return "generated-shell";
  return "other";
}

function* jsonFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".archive" || entry.name === "_audits") continue;
      yield* jsonFiles(file);
    }
    else if (entry.name === "complete-qa.json") yield file;
  }
}

const failures = [];
let files = 0;
let questions = 0;
let ready = 0;
const rootStats = new Map();

for (const root of contentRoots) {
  const indexedFiles = indexedFilesFor(root);
  for (const file of jsonFiles(root)) {
    if (indexedFiles && !indexedFiles.has(path.resolve(file))) continue;
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
      const approvedSpeakableV2 = question.speakable_v2?.speakable_status === "approved"
        && Array.isArray(question.speakable_v2?.beats)
        ? question.speakable_v2
        : null;
      const hasArticleBeats = Array.isArray(speakingSection?.beats) && speakingSection.beats.length > 0;
      const hasArticleContent = typeof speakingSection?.content === "string" && speakingSection.content.trim().length > 0;
      const effectiveBeats = hasArticleBeats
        ? speakingSection.beats
        : hasArticleContent
          ? null
          : approvedSpeakableV2?.beats;
      const hasStructuredExample = Array.isArray(effectiveBeats)
        && effectiveBeats.some(beatContainsExample);
      const structuredSpeaking = Array.isArray(effectiveBeats)
        ? effectiveBeats
            // The learner-facing answer is the knowledge itself. `leadIn` is
            // retained only as migration metadata and is not rendered or read.
            .map((beat) => String(beat.spokenText ?? beat.text ?? "").trim())
            .filter(Boolean)
            .join("\n")
        : "";
      const speaking = hasArticleBeats
        ? structuredSpeaking
        : speakingSection?.content || structuredSpeaking || "";
      const types = new Set(sections.map((section) => section.type));
      const quickSection = sections.find((section) => ["key_points", "important_points"].includes(section.type));
      const quickPoints = Array.isArray(quickSection?.items)
        ? quickSection.items.filter((item) => typeof item === "string" && item.trim())
        : Array.isArray(quickSection?.content)
          ? quickSection.content.filter((item) => typeof item === "string" && item.trim())
          : String(quickSection?.content ?? "")
              .split("\n")
              .filter((line) => /^\s*[-*]\s+/.test(line));
      const text = [
        question.direct_answer,
        ...sections.flatMap((section) => [section.content, ...(section.items ?? [])]),
      ]
        .filter((value) => typeof value === "string")
        .join("\n");
      const deepText = sections
        .filter((section) => !["key_points", "important_points", "speakable_answer", "interviewer_expectation"].includes(section.type))
        .flatMap((section) => [section.content, ...(section.items ?? [])])
        .filter((value) => typeof value === "string")
        .join("\n");
      const problems = [];
      const hasWorkedExample = [...types].some((type) => exampleTypes.has(type))
        || hasStructuredExample
        || text.includes("```");

      if (!speakingOnly) {
        if (!question.direct_answer || question.direct_answer.trim().length < 24) {
          problems.push("direct answer is missing or too short");
        }
        if (quickPoints.length === 0) {
          problems.push("quick revision is missing or empty");
        }
        if (![...types].some((type) => teachingTypes.has(type))) {
          problems.push("missing concept-teaching section");
        }
        if (questionNeedsConcreteExample(question) && !hasWorkedExample && !textContainsExample(deepText)) {
          problems.push("missing worked example");
        }
      }
      if (!types.has("speakable_answer")) {
        problems.push("missing interview speaking answer");
      } else {
        if (
          questionNeedsConcreteExample(question)
          && !hasStructuredExample
          && !textContainsExample(speaking)
        ) {
          problems.push("speaking answer is missing a concrete example");
        }
        const speakingFiller = fillerPatterns.find((pattern) => pattern.test(speaking));
        if (speakingFiller) problems.push(`generic speaking filler: ${speakingFiller}`);
        const coaching = coachingPatterns.find((pattern) => pattern.test(speaking));
        if (coaching) problems.push(`meta-coaching instead of a model answer: ${coaching}`);
        if (!hasArticleBeats && hasDenseLongBulletInterview(speaking)) {
          problems.push("dense long-bullet interview answer; use short article paragraphs or concise bullets");
        }
      }
      if (!speakingOnly) {
        const filler = fillerPatterns.find((pattern) => pattern.test(text));
        if (filler) problems.push(`generic filler: ${filler}`);
        const generatedQuestion = generatedQuestionPatterns.find((pattern) => pattern.test(question.question ?? ""));
        if (generatedQuestion && filler) {
          problems.push(`generated shell question: ${generatedQuestion}`);
        }

        const directNormalized = normalizedText(question.direct_answer);
        const speakingNormalized = normalizedText(speaking);
        const deepNormalized = normalizedText(
          sections
            .filter((section) => !["key_points", "important_points", "speakable_answer", "interviewer_expectation"].includes(section.type))
            .map((section) => [section.content, ...(section.items ?? [])].filter(Boolean).join(" "))
            .join(" "),
        );
        if (
          directNormalized.split(" ").length >= 30
          && shingleContainment(directNormalized, deepNormalized) >= 0.75
        ) {
          problems.push("direct answer is repeated in the Deep Dive");
        }
        if (
          speakingNormalized.split(" ").length >= 80
          && deepNormalized.split(" ").length >= 80
          && shingleContainment(speakingNormalized, deepNormalized) >= 0.45
        ) {
          problems.push("Interview Answer substantially repeats the Deep Dive");
        }
      }

      const stat = rootStats.get(root) ?? { questions: 0, ready: 0, issues: new Map() };
      stat.questions += 1;
      if (problems.length === 0) {
        ready += 1;
        stat.ready += 1;
      }
      for (const problem of problems) {
        const category = issueCategory(problem);
        stat.issues.set(category, (stat.issues.get(category) ?? 0) + 1);
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
  const topIssues = [...stat.issues.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([category, count]) => `${category}=${count}`)
    .join(", ");
  if (topIssues) console.log(`    issues: ${topIssues}`);
}
if (!summaryOnly) {
  for (const failure of failures.slice(0, maxFailures)) {
    console.log(`- ${failure.slug} (${failure.file}): ${failure.problems.join("; ")}`);
  }
  if (failures.length > maxFailures) console.log(`...and ${failures.length - maxFailures} more incomplete answers.`);
}

if (strict && failures.length > 0) process.exitCode = 1;
