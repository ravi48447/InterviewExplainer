import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "content/gold-standard.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

const genericPatterns = [
  /when the problem matches its main benefit/i,
  /compare the options by correctness, speed, clarity, and cost/i,
  /pick the simplest one that works/i,
  /empty,? nil,? duplicate,? or maximum-size/i,
  /i would first check the input and constraints/i,
  /how would you compare .* with an alternative/i,
];

const stripMarkdown = (value = "") =>
  String(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|\[\](){}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const words = (value) => {
  const text = stripMarkdown(value);
  return text ? text.split(" ").length : 0;
};

const sectionText = (section) => {
  if (Array.isArray(section?.content)) return section.content.join("\n");
  if (Array.isArray(section?.items)) return section.items.join("\n");
  return section?.content || "";
};

const findQuestion = (data, slug) => {
  if (Array.isArray(data)) return data.find((question) => question.slug === slug);
  if (Array.isArray(data.questions)) return data.questions.find((question) => question.slug === slug);
  return data.slug === slug ? data : undefined;
};

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
const visualTypes = new Set([
  "diagram",
  "design_diagram",
  "flow_diagram",
  "sequence_diagram",
  "architecture_diagram",
  "concept_map",
  "comparison_table",
]);
const coachingPatterns = [
  /(?:tell|say|mention) (?:the|your|an) interviewer/i,
  /the interviewer (?:wants|is looking for)/i,
  /to stand out/i,
  /a good answer (?:includes|should)/i,
];

const editorialStagePatterns = [
  /^point\s*\d*$/i,
  /^example$/i,
  /^what to say$/i,
  /^mention this$/i,
  /^direct answer$/i,
];

const normalizedProse = (value = "") => stripMarkdown(value).toLowerCase();

function validateGuidedInterviewPresentation(speakable, errors) {
  const beats = Array.isArray(speakable?.beats) ? speakable.beats : [];
  if (beats.length < 2) {
    errors.push("guided Interview Answer needs authored beats");
    return;
  }

  const stages = beats.map((beat) => String(beat.stage || "").trim());
  if (stages.some((stage) => !stage)) errors.push("every guided beat needs a concept-specific stage heading");
  if (new Set(stages.map((stage) => stage.toLowerCase())).size !== stages.length) {
    errors.push("guided beat stage headings must be unique");
  }
  if (stages.some((stage) => editorialStagePatterns.some((pattern) => pattern.test(stage)))) {
    errors.push("guided beat uses a generic or coaching stage heading");
  }

  let supportCount = 0;
  for (const beat of beats) {
    const spokenText = String(beat.spokenText || "").trim();
    if (!spokenText) errors.push("guided beat is missing spokenText");
    if (words(spokenText) > 90) errors.push("guided beat is still an essay-sized paragraph");
    if (/```|^\s*\|.+\|\s*$/m.test(spokenText)) {
      errors.push("move fenced code or table into support");
    }
    const inlineCode = [...spokenText.matchAll(/`([^`\n]+)`/g)].map((match) => match[1].trim());
    if (inlineCode.some((fragment) => fragment.length > 72)) {
      errors.push("move the long inline code fragment into support");
    }
    const support = beat.support;
    if (!support) continue;
    supportCount += 1;
    if (support.type === "code" && (!String(support.code || "").trim() || !String(support.language || "").trim())) {
      errors.push("code support needs both code and language");
    }
    if (["comparison", "trace", "checklist"].includes(support.type) && (!Array.isArray(support.items) || support.items.length < 2)) {
      errors.push(`${support.type} support needs at least two meaningful items`);
    }
  }

  if (supportCount === 0) errors.push("guided gold reference needs at least one teaching support");
  if (supportCount > 2) errors.push("guided gold reference has more than two competing support blocks");

  const beatFallback = beats.map((beat) => String(beat.spokenText || "").trim()).join("\n\n");
  if (normalizedProse(sectionText(speakable)) !== normalizedProse(beatFallback)) {
    errors.push("Interview content has drifted from its authored beats");
  }
}

const questionNeedsExample = (question) =>
  /\b(?:how|implement|write|build|create|design|debug|trace|compare|comparison|difference|versus|vs\.?|when|use|work|flow|lifecycle|what happens|scenario|example)\b/i
    .test(String(question?.question ?? ""));

const textContainsExample = (value) => {
  const text = String(value ?? "");
  if (/\b(?:example|for instance|such as|consider|suppose)\b|```|\b(?:GET|POST|PUT|PATCH|DELETE) \//i.test(text)) return true;
  return new Set(text.match(/`[^`\n]+`/g) ?? []).size >= 2;
};

let failures = 0;

for (const example of registry.examples) {
  const absolutePath = path.join(root, example.path);
  const errors = [];

  if (!fs.existsSync(absolutePath)) {
    console.error(`FAIL ${example.domain}/${example.slug}: missing ${example.path}`);
    failures += 1;
    continue;
  }

  const data = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const question = findQuestion(data, example.slug);
  if (!question) {
    console.error(`FAIL ${example.domain}/${example.slug}: slug not found`);
    failures += 1;
    continue;
  }

  if (example.scope === "algorithm") {
    const direct = question.directAnswer || "";
    if (words(direct) < 20) errors.push("quick answer is too short");
    if ((question.remember?.rules || []).length < 3) errors.push("missing recall rules");
    if ((question.approaches || []).length < 2) errors.push("needs brute-force and improved approaches");
    if (!(question.approaches || []).some((approach) => approach.dryRun)) errors.push("missing a dry run");
    if (!(question.approaches || []).some((approach) => approach.code)) errors.push("missing solution code");
    if (!(question.diagrams || []).length && !(question.approaches || []).some((approach) => approach.diagrams?.length)) {
      errors.push("missing a semantic visual");
    }
  } else {
    const sections = question.answer?.sections || [];
    const quick = sections.find((section) => ["key_points", "important_points"].includes(section.type));
    const speakable = sections.find((section) => section.type === "speakable_answer");
    const deep = sections.filter((section) => !["key_points", "important_points", "speakable_answer", "interviewer_expectation"].includes(section.type));
    const teaching = sections.filter((section) => teachingTypes.has(section.type));
    const quickItems = quick?.items || (Array.isArray(quick?.content)
      ? quick.content
      : String(quick?.content || "")
          .split("\n")
          .filter((line) => /^\s*[-*]\s+/.test(line)));
    const directWords = words(question.direct_answer);
    const speakingWords = words(sectionText(speakable));
    const combined = [question.question, question.direct_answer, ...sections.map(sectionText)].join("\n");
    const speakingText = sectionText(speakable);
    const deepText = deep.map(sectionText).join("\n");

    if (directWords < 6) errors.push(`direct answer is missing or unusably short (${directWords} words)`);
    if (quickItems.length < 1) errors.push("quick revision is missing or empty");
    if (!speakable) errors.push("missing interview answer");
    else if (speakingWords < 20) errors.push(`interview answer is unusably short (${speakingWords} words)`);
    if (speakable && example.interviewPresentation === "guided") {
      validateGuidedInterviewPresentation(speakable, errors);
    }
    const coaching = coachingPatterns.find((pattern) => pattern.test(speakingText));
    if (coaching) errors.push(`interview answer contains coaching instead of answer content: ${coaching}`);
    if (!teaching.length || words(teaching.map(sectionText).join("\n")) < 40) {
      errors.push("Deep Dive is missing an independent, usable teaching explanation");
    }
    if (questionNeedsExample(question) && !deep.some((section) =>
      exampleTypes.has(section.type) || sectionText(section).includes("```")
    ) && !textContainsExample(`${speakingText}\n${deepText}`)) {
      errors.push("Deep Dive is missing a worked or code example");
    }
    const expectsVisual = example.visual && !["none", "optional"].includes(example.visual);
    const deepHasVisual = deep.some((section) => visualTypes.has(section.type) || sectionText(section).includes("```mermaid"));
    if (expectsVisual && example.interviewPresentation === "guided") {
      const supports = (speakable?.beats ?? []).map((beat) => beat.support).filter(Boolean);
      const requiredSupportTypes = ["code", "comparison", "trace", "checklist"]
        .filter((type) => String(example.visual).includes(type));
      for (const type of requiredSupportTypes) {
        if (!supports.some((support) => support.type === type)) {
          errors.push(`guided Interview Answer is missing its declared ${type} support`);
        }
      }
      if (requiredSupportTypes.length === 0 && supports.length === 0 && !deepHasVisual) {
        errors.push(`question is missing its declared ${example.visual} teaching visual`);
      }
    } else if (expectsVisual && !deepHasVisual) {
      errors.push(`Deep Dive is missing its declared ${example.visual} teaching visual`);
    }
    for (const pattern of genericPatterns) {
      if (pattern.test(combined)) errors.push(`generic filler matched ${pattern}`);
    }
  }

  if (errors.length) {
    failures += 1;
    console.error(`FAIL ${example.domain}/${example.slug}`);
    for (const error of errors) console.error(`  - ${error}`);
  } else {
    console.log(`PASS ${example.domain}/${example.slug}`);
  }
}

if (failures) {
  console.error(`\n${failures} gold-standard example(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${registry.examples.length} gold-standard examples passed.`);
