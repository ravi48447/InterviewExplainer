#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const DEFAULT_ROOTS = [
  "content/interview",
  "content/shared",
  "content/go-fresher",
  "content/go-intermediate",
  "content/frontend-fresher",
  "content/frontend-intermediate",
  "content/python-backend-fresher",
  "content/python-backend-intermediate",
  "content/ruby-backend-fresher",
  "content/ruby-backend-intermediate",
  "content/java-backend-fresher",
  "content/java-backend-intermediate",
  "content/java-fullstack-fresher",
  "content/java-fullstack-intermediate",
];

const args = process.argv.slice(2);
const write = args.includes("--write");
const previewArg = args.indexOf("--preview");
const previewSlug = previewArg >= 0 ? args[previewArg + 1] : undefined;
const reportInsufficient = args.includes("--report-insufficient");
const requestedRoots = args.filter((arg, index) =>
  !arg.startsWith("--") && (index === 0 || args[index - 1] !== "--preview")
);
const roots = requestedRoots.length > 0 ? requestedRoots : DEFAULT_ROOTS;

const META_TYPES = new Set([
  "interviewer_expectation",
  "speakable_answer",
  "speakable_v2",
  "key_points",
  "important_points",
]);
const EXPLANATION_TYPES = new Set([
  "overview",
  "explanation",
  "deep_explanation",
  "detailed_explanation",
]);
const CODE_TYPES = new Set(["code", "code_example", "before_code", "after_code"]);
const VISUAL_TYPES = new Set([
  "diagram",
  "design_diagram",
  "flow_diagram",
  "sequence_diagram",
  "architecture_diagram",
  "concept_map",
  "comparison_table",
]);

const GENERIC_PATTERNS = [
  /use a three-step check/i,
  /create one normal case and one boundary case/i,
  /walk through the example step by step, then say/i,
  /compare the options by correctness, speed, clarity, and cost/i,
  /start with a small example of/i,
  /practical understanding of/i,
  /use it when it fits/i,
  /show the value before the operation/i,
  /add the narrowest fix/i,
  /without checking its scope, boundary cases, or trade-offs/i,
  /i would use .* when the problem matches its main benefit/i,
  /in a real project, i would confirm that benefit/i,
  /i would debug a problem involving/i,
  /a common mistake with .* is using the rule without checking/i,
  /i compare .* with the simpler alternative by looking at correctness/i,
  /the better choice depends on the input and the failure modes/i,
  /empty, nil, duplicate, or maximum-size case/i,
];

function* jsonFiles(root) {
  if (!fs.existsSync(root)) return;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const item = path.join(root, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(item);
    else if (entry.name === "complete-qa.json") yield item;
  }
}

function questionsIn(document) {
  if (Array.isArray(document)) return document;
  return Array.isArray(document?.questions) ? document.questions : [];
}

function contentText(content) {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) return content.filter((item) => typeof item === "string").join("\n").trim();
  return "";
}

function wordCount(value) {
  return contentText(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function normalize(value) {
  return contentText(value)
    .toLowerCase()
    .replace(/[`*_#>|~“”‘’'".,:;!?()[\]{}<>/=+_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isGeneric(value) {
  return GENERIC_PATTERNS.some((pattern) => pattern.test(contentText(value)));
}

function looksLikeCode(value) {
  const text = contentText(value);
  if (/```[a-z0-9_+-]*\s*\n[\s\S]+```/i.test(text)) return true;
  const lines = text.split("\n").filter((line) => line.trim());
  if (lines.length < 3) return false;
  const codeSignals = (text.match(/[{}();=<>\[\]]|=>|:=|\b(?:class|def|func|function|const|let|var|public|private|return|import|package|SELECT|FROM)\b/g) ?? []).length;
  return codeSignals >= 3;
}

function fencedCode(value, language = "text") {
  const text = contentText(value);
  if (text.includes("```")) return text;
  return `\`\`\`${language}\n${text}\n\`\`\``;
}

function questionKind(question) {
  const value = `${question?.question ?? ""} ${question?.title ?? ""} ${question?.slug ?? ""}`.toLowerCase();
  if (/\b(?:difference|compare|comparison|versus|\bvs\.?\b)\b/.test(value)) return "comparison";
  if (/\b(?:mistake|pitfall|avoid|wrong|incorrect)\b/.test(value)) return "mistake";
  if (/\b(?:debug|scenario|problem|troubleshoot|fix|failure|fails)\b/.test(value)) return "scenario";
  if (/\b(?:when to use|when should|where to use|choose|choice|prefer)\b/.test(value)) return "usage";
  return "concept";
}

function speakableText(question) {
  const section = (question?.answer?.sections ?? []).find((item) => item.type === "speakable_answer");
  if (Array.isArray(section?.beats)) {
    return section.beats.map((beat) => contentText(beat.spokenText)).filter(Boolean).join("\n\n");
  }
  return contentText(section?.content);
}

function answerFact(question) {
  return contentText(question?.direct_answer) || speakableText(question);
}

function truncateWords(value, maximum) {
  const words = contentText(value).split(/\s+/).filter(Boolean);
  if (words.length <= maximum) return words.join(" ");
  const sentences = contentText(value)
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[`"'(]*[A-Za-z])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const selected = [];
  let selectedWords = 0;
  for (const sentence of sentences) {
    const sentenceWords = sentence.split(/\s+/).filter(Boolean).length;
    if (selected.length > 0 && selectedWords + sentenceWords > maximum) break;
    selected.push(sentence);
    selectedWords += sentenceWords;
    if (selectedWords >= maximum) break;
  }
  return selected.join(" ") || contentText(value);
}

function firstUsefulSentences(value, maximumWords = 95) {
  const cleaned = contentText(value).replace(/^\s*[-*+]\s+/gm, "").replace(/\n+/g, " ");
  return truncateWords(cleaned, maximumWords);
}

function sentenceGroups(value, maximumWords = 92) {
  const sentences = contentText(value)
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[`"'(]*[A-Za-z])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  return sentences.map((sentence) => firstUsefulSentences(sentence, maximumWords));
}

function boundaryFact(value) {
  const text = firstUsefulSentences(value, 75);
  if (!text || isGeneric(text)) return "";
  if (/^(?:calling|checking|using|giving|assuming|forgetting|confusing|repeating|reading)\b/i.test(text)) {
    return `A common mistake is ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  }
  return text;
}

function uniqueParagraphs(values) {
  const result = [];
  for (const value of values) {
    const text = firstUsefulSentences(value);
    if (!text || isGeneric(text)) continue;
    const key = normalize(text);
    if (!key) continue;
    const duplicate = result.some((existing) => {
      const other = normalize(existing);
      const keyWords = new Set(key.split(" "));
      const otherWords = new Set(other.split(" "));
      const shared = [...keyWords].filter((word) => otherWords.has(word)).length;
      const similarity = shared / Math.max(1, Math.min(keyWords.size, otherWords.size));
      return key === other || key.includes(other) || other.includes(key) || similarity >= 0.72;
    });
    if (!duplicate) result.push(text);
  }
  return result;
}

function findSibling(questions, kind) {
  return questions.find((question) => {
    const fact = answerFact(question);
    return questionKind(question) === kind && fact && !isGeneric(fact);
  });
}

function findTopicAnchor(questions) {
  return questions
    .map((question) => ({ question, fact: answerFact(question) }))
    .filter(({ fact }) => fact && !isGeneric(fact))
    .sort((left, right) => wordCount(right.fact) - wordCount(left.fact))[0]?.question;
}

function sectionFact(question, types) {
  const section = (question?.answer?.sections ?? []).find((item) =>
    types.includes(item.type) && contentText(item.content) && !isGeneric(item.content)
  );
  return contentText(section?.content);
}

function sectionItemsFact(question, types) {
  const section = (question?.answer?.sections ?? []).find((item) =>
    types.includes(item.type) && Array.isArray(item.items) && item.items.some((entry) => typeof entry === "string")
  );
  const items = (section?.items ?? []).filter((entry) => typeof entry === "string" && !isGeneric(entry));
  return items.join(" ");
}

function intentFact(question, key) {
  const value = contentText(question?.interviewer_intent?.[key]);
  return value && !isGeneric(value) ? value : "";
}

function firstIntentFact(questions, key) {
  for (const question of questions) {
    const value = intentFact(question, key);
    if (value) return value;
  }
  return "";
}

function structuredCode(question) {
  const section = (question?.answer?.sections ?? []).find((item) => item.type === "speakable_answer");
  const beat = section?.beats?.find((item) => item.support?.type === "code" && contentText(item.support.code));
  if (!beat) return undefined;
  const language = beat.support.language || "text";
  let code = contentText(beat.support.code);
  if (language === "go") {
    const typedConstant = code.match(/^\s*([A-Za-z_]\w*)\s+([A-Z][A-Za-z0-9_]*)\s*=\s*iota\b/m);
    if (typedConstant && !new RegExp(`\\btype\\s+${typedConstant[2]}\\b`).test(code)) {
      code = `type ${typedConstant[2]} int\n\n${code}`;
    }
  }
  return {
    type: "code_example",
    title: beat.support.title || "Worked example",
    content: fencedCode(code, language),
  };
}

function validCodeSection(question) {
  const section = (question?.answer?.sections ?? []).find((item) => CODE_TYPES.has(item.type) && looksLikeCode(item.content));
  return section ? { ...section, content: fencedCode(section.content) } : undefined;
}

function deepSections(question) {
  return (question?.answer?.sections ?? []).filter((section) => !META_TYPES.has(section.type) && contentText(section.content));
}

function isShallow(question) {
  const sections = deepSections(question);
  const proseWords = sections
    .filter((section) => !CODE_TYPES.has(section.type))
    .reduce((total, section) => total + wordCount(section.content), 0);
  const hasGenericSection = sections.some((section) => isGeneric(section.content));
  const hasFakeCode = sections.some((section) => CODE_TYPES.has(section.type) && !looksLikeCode(section.content));
  const meaningfulParts = sections.filter((section) => !isGeneric(section.content) && (!CODE_TYPES.has(section.type) || looksLikeCode(section.content))).length;
  const structuredLesson = sections.find((section) =>
    EXPLANATION_TYPES.has(section.type) && !isGeneric(section.content)
  );
  const structuredParagraphs = contentText(structuredLesson?.content)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  if (
    structuredParagraphs.length >= 3 &&
    structuredParagraphs.length <= 4 &&
    wordCount(structuredLesson?.content) >= 30 &&
    !hasFakeCode
  ) {
    return false;
  }
  const hasRealCode = sections.some((section) => CODE_TYPES.has(section.type) && looksLikeCode(section.content));
  if (proseWords >= 85 && meaningfulParts >= 2 && hasRealCode && !hasGenericSection && !hasFakeCode) {
    return false;
  }
  return proseWords < 220 || meaningfulParts < 3 || hasGenericSection || hasFakeCode;
}

function supportSection(kind, current, siblings) {
  const comparison = findSibling(siblings, "comparison");
  const usage = findSibling(siblings, "usage");
  const mistake = findSibling(siblings, "mistake");

  if (kind === "comparison" && comparison && !isGeneric(answerFact(comparison))) {
    return { type: "tradeoffs", title: "How the choices differ", content: answerFact(comparison) };
  }
  if (kind === "concept" && usage && !isGeneric(answerFact(usage))) {
    return { type: "when_to_use", title: "When this choice makes sense", content: answerFact(usage) };
  }
  if (comparison && !isGeneric(answerFact(comparison))) {
    return { type: "tradeoffs", title: "Important trade-off", content: answerFact(comparison) };
  }
  if (mistake && !isGeneric(answerFact(mistake))) {
    return { type: "common_mistakes", title: "Boundary to remember", content: answerFact(mistake) };
  }
  return undefined;
}

function buildDeepExplanation(question, siblings) {
  const concept = findTopicAnchor(siblings) || findSibling(siblings, "concept");
  const usage = findSibling(siblings, "usage");
  const mistake = findSibling(siblings, "mistake");
  const scenario = findSibling(siblings, "scenario");
  const currentKind = questionKind(question);
  const currentFact = answerFact(question);
  const conceptOverview = sectionFact(concept, ["overview", "explanation", "deep_explanation", "detailed_explanation"]);
  const currentOverview = sectionFact(question, ["overview", "explanation"]);
  const boundaryIntent = boundaryFact(firstIntentFact(siblings, "common_mistake"));
  const conceptFact = concept && !isGeneric(answerFact(concept))
    ? answerFact(concept)
    : (!isGeneric(currentFact) ? currentFact : conceptOverview || currentOverview);
  const conceptGroups = sentenceGroups(conceptFact);
  const anchorPoints = sectionItemsFact(concept, ["key_points", "important_points"]);
  const mechanics = currentKind === "mistake"
    ? (scenario && !isGeneric(answerFact(scenario)) ? answerFact(scenario) : currentOverview)
    : (!isGeneric(currentFact) && normalize(currentFact) !== normalize(conceptFact) ? currentFact : currentOverview);
  const usageFact = usage && !isGeneric(answerFact(usage))
    ? answerFact(usage)
    : siblings.map((candidate) => sectionFact(candidate, ["when_to_use"])).find(Boolean);
  const mistakeFact = mistake && !isGeneric(answerFact(mistake))
    ? boundaryFact(answerFact(mistake))
    : boundaryIntent;

  const behaviour = conceptGroups[1];
  const supportingDetail = firstUsefulSentences(conceptGroups.slice(2).join(" "), 105);
  const middle = uniqueParagraphs([
    mechanics,
    currentKind === "usage" && !isGeneric(currentFact) ? currentFact : usageFact,
  ])[0];
  const middleCandidates = currentKind === "concept"
    ? [supportingDetail, anchorPoints, middle]
    : [middle, supportingDetail, anchorPoints];
  const coreParagraphs = uniqueParagraphs([
    conceptGroups[0] || conceptFact,
    behaviour,
    ...middleCandidates,
  ]).slice(0, 3);
  const paragraphs = uniqueParagraphs([
    ...coreParagraphs,
    currentKind === "mistake" && !isGeneric(currentFact) ? boundaryFact(currentFact) : mistakeFact,
  ]).slice(0, 4);

  if (paragraphs.length < 3) return undefined;
  const titles = {
    concept: "Build the mental model",
    comparison: "Understand the decision",
    mistake: "Why the mistake happens",
    scenario: "Reason through the problem",
    usage: "Make the choice confidently",
  };
  return {
    type: "deep_explanation",
    title: titles[currentKind],
    content: paragraphs.join("\n\n"),
  };
}

function enrichQuestion(question, siblings) {
  if (!isShallow(question)) return { changed: false, reason: "already-deep" };
  const sections = question?.answer?.sections;
  if (!Array.isArray(sections)) return { changed: false, reason: "no-sections" };

  const explanation = buildDeepExplanation(question, siblings);
  if (!explanation) return { changed: false, reason: "insufficient-source-facts" };

  const meta = sections.filter((section) => META_TYPES.has(section.type));
  const preserved = sections.filter((section) => {
    if (META_TYPES.has(section.type) || EXPLANATION_TYPES.has(section.type)) return false;
    if (!contentText(section.content) || isGeneric(section.content)) return false;
    if (CODE_TYPES.has(section.type) && !looksLikeCode(section.content)) return false;
    return true;
  });

  const hasCode = preserved.some((section) => CODE_TYPES.has(section.type));
  const code = hasCode
    ? undefined
    : structuredCode(question) || validCodeSection(question) || siblings.map(validCodeSection).find(Boolean);
  const support = supportSection(questionKind(question), question, siblings);
  const supportDuplicatesLesson = support && (() => {
    const lesson = normalize(explanation.content);
    const candidate = normalize(support.content);
    return candidate.length > 0 && lesson.includes(candidate);
  })();
  const hasSupportType = support && preserved.some((section) => section.type === support.type);

  question.answer.sections = [
    ...meta,
    explanation,
    ...preserved,
    ...(code ? [code] : []),
    ...(support && !hasSupportType && !supportDuplicatesLesson ? [support] : []),
  ];

  const topicFollowups = siblings
    .filter((candidate) => candidate !== question && contentText(candidate.question))
    .sort((a, b) => {
      const priority = { concept: 0, comparison: 1, usage: 2, mistake: 3, scenario: 4 };
      return priority[questionKind(a)] - priority[questionKind(b)];
    })
    .map((candidate) => contentText(candidate.question))
    .filter((candidate, index, all) => all.indexOf(candidate) === index)
    .slice(0, 3);
  if (topicFollowups.length >= 2) question.followup_questions = topicFollowups;

  return { changed: true, reason: "enriched" };
}

const stats = {
  files: 0,
  questions: 0,
  shallow: 0,
  changed: 0,
  alreadyDeep: 0,
  insufficient: 0,
  noSections: 0,
  references: 0,
  filesChanged: 0,
  insufficientAnswers: [],
  noSectionAnswers: [],
};

for (const root of roots) {
  for (const file of jsonFiles(root)) {
    stats.files += 1;
    const original = fs.readFileSync(file, "utf8");
    let document;
    try {
      document = JSON.parse(original);
    } catch (error) {
      console.error(`Invalid JSON: ${file}: ${error.message}`);
      continue;
    }
    const questions = questionsIn(document);
    let fileChanged = false;

    for (const question of questions) {
      stats.questions += 1;
      if (typeof question?.$ref === "string") {
        stats.references += 1;
        continue;
      }
      const shallowBefore = isShallow(question);
      if (shallowBefore) stats.shallow += 1;
      const result = enrichQuestion(question, questions);
      if (result.changed) {
        stats.changed += 1;
        fileChanged = true;
      } else if (result.reason === "already-deep") {
        stats.alreadyDeep += 1;
      } else if (result.reason === "insufficient-source-facts") {
        stats.insufficient += 1;
        stats.insufficientAnswers.push({ file, slug: question.slug, question: question.question });
      } else if (result.reason === "no-sections") {
        stats.noSections += 1;
        stats.noSectionAnswers.push({ file, slug: question.slug, question: question.question });
      }

      if (previewSlug && question.slug === previewSlug) {
        console.log(JSON.stringify({ file, question }, null, 2));
      }
    }

    if (fileChanged) {
      stats.filesChanged += 1;
      if (write) fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
    }
  }
}

console.log(`${write ? "Deep Dive migration" : "Deep Dive dry run"}: ${stats.changed}/${stats.shallow} shallow answers enriched.`);
console.log(`Scanned ${stats.questions} questions across ${stats.files} files; ${stats.filesChanged} files ${write ? "changed" : "would change"}.`);
console.log(`${stats.alreadyDeep} answers already meet the depth floor; ${stats.insufficient} shallow answers need manual source enrichment.`);
if (stats.references > 0) console.log(`${stats.references} reference entries inherit their resolved shared answers.`);
if (reportInsufficient && stats.insufficientAnswers.length > 0) {
  for (const answer of stats.insufficientAnswers) {
    console.log(`- ${answer.slug} | ${answer.question} | ${answer.file}`);
  }
}
if (reportInsufficient && stats.noSectionAnswers.length > 0) {
  console.log(`${stats.noSections} entries do not use the three-section answer schema:`);
  for (const answer of stats.noSectionAnswers) {
    console.log(`- ${answer.slug} | ${answer.question} | ${answer.file}`);
  }
}
