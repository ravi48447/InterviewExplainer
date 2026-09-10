#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const roots = args.filter((value) => !value.startsWith("--"));
const contentRoots = roots.length ? roots : ["content"];
const strict = args.includes("--strict");
const indexedOnly = args.includes("--indexed-only");
const summaryOnly = args.includes("--summary-only");
const maxArg = args.find((value) => value.startsWith("--max="));
const maxFailures = maxArg ? Math.max(0, Number(maxArg.split("=")[1]) || 0) : 30;

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

// These ranges are editorial alarms, not completion quotas. A question fails
// only when a learner-facing zone is missing, effectively empty, generic, or
// lacks the concrete evidence its explanation depends on.
const MIN_DIRECT_WORDS = 20;
const MAX_DIRECT_WORDS = 90;
const MIN_USABLE_DIRECT_WORDS = 6;
const MIN_USABLE_INTERVIEW_WORDS = 20;
const MIN_USABLE_DEEP_WORDS = 40;
const speakingLimits = {
  compact: { min: 120, max: 240 },
  standard: { min: 220, max: 360 },
  deep: { min: 320, max: 520 },
};
const depthLimits = {
  atomic: { min: 60, max: 650 },
  working: { min: 100, max: 950 },
  system: { min: 160, max: 1400 },
};
const systemLayouts = new Set([
  "architecture-map",
  "concept-and-architecture",
  "concept-and-runtime-lifecycle",
  "design-whiteboard",
]);
const workingLayouts = new Set([
  "algorithm-workshop",
  "comparison",
  "comparison-and-decision",
  "comparison-arena",
  "concept-and-byte-flow",
  "concept-and-file-system-semantics",
  "concept-and-io-pipeline",
  "concept-and-protocol-semantics",
  "lifecycle-timeline",
  "recipe-builder",
  "sql-playground",
]);

// Only prose that independently teaches the topic counts toward Deep Dive depth.
// Supporting code, tables, diagrams and exercises are intentionally excluded.
const teachingTypes = new Set([
  "overview",
  "core_concepts",
  "deep_explanation",
  "detailed_explanation",
  "explanation",
]);
const quickTypes = new Set(["key_points", "important_points"]);
const genericTeachingTitles = [
  /^concept explained$/i,
  /^deep dive$/i,
  /^overview$/i,
  /^detailed explanation$/i,
  /^how it works$/i,
];
const editorialHeading = /^(?:start|begin|follow|see|watch|know|remember|trace|read|use|choose|keep|separate|look at|think about)\b/i;

function* jsonFiles(root) {
  if (!fs.existsSync(root)) return;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.name === ".archive" || entry.name === "_audits") continue;
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(file);
    else if (entry.name === "complete-qa.json") yield file;
  }
}

function wordCount(value) {
  return String(value ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\]()-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function paragraphs(value) {
  return String(value ?? "")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function quickItems(section) {
  if (Array.isArray(section?.items)) return section.items.filter((item) => String(item).trim());
  if (Array.isArray(section?.content)) return section.content.filter((item) => String(item).trim());
  return String(section?.content ?? "")
    .split("\n")
    .filter((line) => /^\s*[-*]\s+/.test(line));
}

function containsConcreteExample(value) {
  const text = String(value ?? "");
  if (/(?:\bexample\b|\bfor instance\b|\be\.g\.|\bsuch as\b|\bconsider\b|\bsuppose\b|\bimagine\b|\bpicture\b|\blet(?:'s| us) (?:say|take)\b|\bsay you\b|\blike\s+(?:a|an|the|[A-Z][\w.]*)\b|```|\b(?:GET|POST|PUT|PATCH|DELETE) \/)/i.test(text)) {
    return true;
  }
  const inlineCode = text.match(/`[^`\n]+`/g) ?? [];
  if (new Set(inlineCode).size >= 2) return true;
  const namedCode = text.match(/\b[A-Z][a-z]+(?:[A-Z][A-Za-z0-9]*)+\b/g) ?? [];
  if (new Set(namedCode).size >= 2) return true;
  if (/\b(?:good|bad|common|real(?:-world)?) use cases?\b|\b(?:take|say) (?:a|an|the|this)\b/i.test(text)) {
    return true;
  }
  return /\b(?:if|when) (?:a|an|the|i|you|we|my|your)\b[^.!?]{12,}(?:,| then |\bso\b)/i.test(text);
}

function interviewProse(section) {
  if (Array.isArray(section?.beats) && section.beats.length > 0) {
    return section.beats
      .map((beat) => String(beat?.spokenText ?? "").trim())
      .filter(Boolean)
      .join("\n\n");
  }
  return String(section?.content ?? "");
}

function interviewEvidence(section) {
  if (!Array.isArray(section?.beats) || section.beats.length === 0) {
    return String(section?.content ?? "");
  }
  return section.beats
    .flatMap((beat) => [
      beat?.spokenText,
      beat?.support?.title,
      beat?.support?.code,
      beat?.support?.caption,
      ...(beat?.support?.items ?? []).flatMap((item) => [item?.label, item?.value, item?.detail]),
    ])
    .filter(Boolean)
    .join("\n");
}

function questionNeedsConcreteExample(question) {
  return /\b(?:how|implement|write|build|create|design|debug|trace|compare|comparison|difference|versus|vs\.?|when|use|work|flow|lifecycle|what happens|scenario|example)\b/i.test(
    String(question?.question ?? ""),
  );
}

function questionScope(question) {
  const layout = String(question?.layout_type ?? "");
  const prompt = String(question?.question ?? "");
  if (
    systemLayouts.has(layout)
    || /\b(?:design (?:an?|the)|architecture|end-to-end|production|thread-safe|concurrent access|security flow|request lifecycle|debug(?:ging)? (?:a|an|the)|what happens when)\b/i.test(prompt)
  ) {
    return "system";
  }
  if (
    workingLayouts.has(layout)
    || /\b(?:how|why|compare|difference|versus|vs\.?|when|trade-?offs?|algorithm|flow|lifecycle|implement|build|create)\b/i.test(prompt)
  ) {
    return "working";
  }
  return "atomic";
}

function hasReadableStructure(value) {
  const text = String(value ?? "");
  return paragraphs(text).length >= 3
    || (text.match(/^\s*[-*]\s+/gm) ?? []).length >= 3
    || (text.match(/\*\*[^*]+\*\*/g) ?? []).length >= 2;
}

const failures = [];
const warnings = [];
const stats = new Map();
let questions = 0;
let ready = 0;

for (const root of contentRoots) {
  const indexedFiles = indexedFilesFor(root);
  const rootStats = {
    questions: 0,
    ready: 0,
    directWarnings: 0,
    quickWarnings: 0,
    interviewWarnings: 0,
    deepWarnings: 0,
    blockers: 0,
  };
  for (const file of jsonFiles(root)) {
    if (indexedFiles && !indexedFiles.has(path.resolve(file))) continue;
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
      const sections = question.answer?.sections;
      if (!Array.isArray(sections)) continue;

      questions += 1;
      rootStats.questions += 1;
      const problems = [];
      const questionWarnings = [];
      const directWords = wordCount(question.direct_answer);
      const quick = sections.find((section) => quickTypes.has(section.type));
      const quickCount = quickItems(quick).length;
      const speaking = sections.find((section) => section.type === "speakable_answer");
      const speakingWords = wordCount(interviewProse(speaking));
      const limits = speakingLimits[speaking?.answerSize] ?? speakingLimits.standard;
      const teachingSections = sections.filter((section) => teachingTypes.has(section.type));
      const deepText = teachingSections.map((section) => section.content ?? "").join("\n\n");
      const deepWords = wordCount(deepText);
      const scope = questionScope(question);
      const depth = depthLimits[scope];

      if (directWords < MIN_USABLE_DIRECT_WORDS) {
        problems.push(`direct answer is missing or unusably short (${directWords} words)`);
      } else if (directWords < MIN_DIRECT_WORDS || directWords > MAX_DIRECT_WORDS) {
        rootStats.directWarnings += 1;
        questionWarnings.push(`direct answer has ${directWords} words; review for completeness or excess`);
      }
      if (!quick || quickCount === 0) {
        problems.push("Quick Revision is missing or empty");
      } else if (quickCount > 8) {
        rootStats.quickWarnings += 1;
        questionWarnings.push(`Quick Revision has ${quickCount} points; review whether every point aids recall`);
      }
      if (!speaking || speakingWords < MIN_USABLE_INTERVIEW_WORDS) {
        problems.push(`Interview Answer is missing or unusably short (${speakingWords} prose words)`);
      } else if (speakingWords < limits.min || speakingWords > limits.max) {
        rootStats.interviewWarnings += 1;
        questionWarnings.push(`Interview Answer has ${speakingWords} prose words; review against the question outcome`);
      }
      if (questionNeedsConcreteExample(question) && !containsConcreteExample(interviewEvidence(speaking))) {
        problems.push("Interview Answer lacks a concrete example");
      }
      if (teachingSections.length === 0 || deepWords < MIN_USABLE_DEEP_WORDS) {
        problems.push(`independent Deep Dive is missing or unusably short (${deepWords} prose words)`);
      } else if (deepWords < depth.min || deepWords > depth.max) {
        rootStats.deepWarnings += 1;
        questionWarnings.push(`independent Deep Dive has ${deepWords} prose words for ${scope} scope; review against the question outcome`);
      }
      if (teachingSections.some((section) => genericTeachingTitles.some((pattern) => pattern.test(section.title ?? "")))) {
        problems.push("Deep Dive uses a generic title instead of a question-specific teaching title");
      }
      const visibleHeadings = teachingSections.flatMap((section) => [
        section.title ?? "",
        ...[...String(section.content ?? "").matchAll(/^\s*\*\*([^*]+)\*\*\s*$/gm)]
          .map((match) => match[1].trim()),
      ]);
      const instructionalHeading = visibleHeadings.find((heading) => editorialHeading.test(heading));
      if (instructionalHeading) {
        problems.push(`editorial heading should name the concept instead: "${instructionalHeading}"`);
      }
      // Short, focused lessons can read naturally as one or two connected
      // paragraphs. Treat structure as a blocker only when the answer is long
      // enough to become a genuine wall of text; otherwise keep it as an
      // editorial warning rather than rejecting useful, concise teaching.
      if (deepWords >= 240 && !hasReadableStructure(deepText)) {
        problems.push("Deep Dive prose is not broken into readable paragraphs, bullets, or mini-headings");
      } else if (deepWords >= 160 && !hasReadableStructure(deepText)) {
        rootStats.deepWarnings += 1;
        questionWarnings.push("Deep Dive would scan better with a paragraph break, bullets, or a mini-heading");
      }

      if (problems.length === 0) {
        ready += 1;
        rootStats.ready += 1;
      } else {
        rootStats.blockers += 1;
        failures.push({ file, slug: question.slug ?? question.id ?? "<unknown>", problems });
      }
      if (questionWarnings.length) {
        warnings.push({ file, slug: question.slug ?? question.id ?? "<unknown>", problems: questionWarnings });
      }
    }
  }
  stats.set(root, rootStats);
}

const pct = questions ? Math.round((ready / questions) * 1000) / 10 : 0;
console.log(`Teaching-depth audit: ${ready}/${questions} ready (${pct}%).`);
for (const [root, value] of stats) {
  const rootPct = value.questions ? Math.round((value.ready / value.questions) * 1000) / 10 : 0;
  console.log(
    `  ${root}: ${value.ready}/${value.questions} ready (${rootPct}%); `
      + `blockers=${value.blockers}; warnings: direct=${value.directWarnings}, `
      + `quick=${value.quickWarnings}, interview=${value.interviewWarnings}, deep=${value.deepWarnings}`,
  );
}

if (!summaryOnly) {
  for (const failure of failures.slice(0, maxFailures)) {
    console.log(`- ${failure.slug} (${failure.file}): ${failure.problems.join("; ")}`);
  }
  if (failures.length > maxFailures) {
    console.log(`...and ${failures.length - maxFailures} more answers below the reading-depth standard.`);
  }
  const remaining = Math.max(0, maxFailures - failures.length);
  for (const warning of warnings.slice(0, remaining)) {
    console.log(`~ ${warning.slug} (${warning.file}): ${warning.problems.join("; ")}`);
  }
  if (warnings.length > remaining) {
    console.log(`...and ${warnings.length - remaining} more adaptive-depth warning(s).`);
  }
}

if (strict && failures.length) process.exitCode = 1;
