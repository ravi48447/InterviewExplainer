#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const QUICK_TYPES = new Set(["key_points", "important_points"]);
const INTERVIEW_TYPE = "speakable_answer";
const META_TYPES = new Set(["interviewer_expectation"]);
const SUPPORT_TYPES = new Set(["code", "trace", "comparison", "checklist"]);
const CODE_SECTION_TYPES = new Set([
  "code",
  "code_example",
  "before_code",
  "after_code",
  "query_example",
]);

const STOP_WORDS = new Set([
  "a", "about", "advantage", "alternative", "an", "and", "answer", "are", "as", "at", "avoid", "backend",
  "basic", "basics", "be", "beginner", "between", "by", "can", "common", "compare",
  "concept", "describe", "difference", "do", "does", "during", "explain", "for",
  "frontend", "fresher", "from", "give", "go", "how", "important", "in", "interview", "is", "issue", "it",
  "java", "javascript", "js", "main", "mean", "means", "mistake", "mistakes", "of",
  "on", "or", "overview", "problem", "purpose", "python", "question", "react", "ruby", "scenario", "should", "show", "the",
  "their", "them", "these", "this", "to", "typescript", "use", "using", "versus", "vs",
  "what", "when", "where", "which", "why", "with", "work", "works", "would", "you",
]);

const INTENT_MARKERS = {
  comparison: /\b(?:better|both|but|compared|comparison|difference|instead|less|more|rather|unlike|whereas|while|worse)\b/i,
  decision: /\b(?:choose|fit|prefer|use|when)\b/i,
  diagnosis: /\b(?:avoid|bug|cause|check|debug|diagnos|error|fail|inspect|mistake|panic|trace)\w*\b/i,
  definition: /\b(?:allows?|are|describes?|is|means?|provides?|refers?\s+to|represents?|stands?\s+for)\b/i,
};

const argv = process.argv.slice(2);
const domainArguments = argv.filter((arg) => arg.startsWith("--domain="));
const domainArg = domainArguments[0];
const domain = domainArg?.slice("--domain=".length).trim() || null;
const moduleArguments = argv.filter((arg) => arg.startsWith("--module="));
const moduleArg = moduleArguments[0];
const moduleFilter = moduleArg?.slice("--module=".length).trim() || null;
const topicArguments = argv.filter((arg) => arg.startsWith("--topic="));
const topicArg = topicArguments[0];
const topicFilter = topicArg?.slice("--topic=".length).trim() || null;
const strict = argv.includes("--strict");
const selfTest = argv.includes("--self-test");
const maxArg = argv.find((arg) => arg.startsWith("--max="));
const maxFindings = maxArg ? Math.max(0, Number(maxArg.slice("--max=".length)) || 0) : 40;
const knownArguments = new Set(["--strict", "--self-test"]);
const unknownArguments = argv.filter(
  (arg) => !knownArguments.has(arg)
    && !arg.startsWith("--domain=")
    && !arg.startsWith("--module=")
    && !arg.startsWith("--topic=")
    && !arg.startsWith("--max="),
);

function isValidSlug(value) {
  return /^[a-z0-9][a-z0-9-]*$/.test(value);
}

function normalizeLineEndings(value = "") {
  return String(value).replace(/\r\n?/g, "\n");
}

function normalizeProse(value = "") {
  return normalizeLineEndings(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?“”\"'’/\\+=-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCode(value = "") {
  const lines = normalizeLineEndings(value)
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
  while (lines.length > 0 && !lines[0].trim()) lines.shift();
  while (lines.length > 0 && !lines.at(-1).trim()) lines.pop();
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0);
  const commonIndent = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(commonIndent)).join("\n");
}

function proseWords(value = "") {
  const normalized = normalizeProse(value);
  return normalized ? normalized.split(" ") : [];
}

function wordCount(value = "") {
  return proseWords(value).length;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isMeaningfulText(value) {
  if (!isNonEmptyString(value)) return false;
  const hasNonEmptyFence = /```[^\n`]*\n[\s\S]*?\S[\s\S]*?```/.test(normalizeLineEndings(value));
  return Boolean(normalizeProse(value) || hasNonEmptyFence);
}

function isMeaningfulLabel(value) {
  if (!isNonEmptyString(value)) return false;
  return Boolean(String(value).replace(/[`*_#>|~\[\](){}]/g, "").trim());
}

function normalizeLabel(value = "") {
  return normalizeLineEndings(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[`*_#>|~\[\](){}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function compactLabel(value = "") {
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
}

function contentText(section) {
  if (isNonEmptyString(section?.content)) return section.content.trim();
  if (Array.isArray(section?.content)) {
    return section.content.filter(isNonEmptyString).map((item) => item.trim()).join("\n");
  }
  if (section?.content && typeof section.content === "object") {
    return Object.values(section.content)
      .flatMap((value) => Array.isArray(value) ? value.flat(2) : [value])
      .filter((value) => typeof value === "string" || typeof value === "number")
      .map(String)
      .filter(Boolean)
      .join("\n");
  }
  return "";
}

function itemText(item) {
  if (isNonEmptyString(item)) return item.trim();
  if (!item || typeof item !== "object") return "";
  return [item.label, item.value, item.detail, item.text, item.content]
    .filter(isNonEmptyString)
    .map((value) => value.trim())
    .join(" — ");
}

function sectionItemsText(section) {
  if (!Array.isArray(section?.items)) return "";
  return section.items.map(itemText).filter(Boolean).join("\n");
}

function visibleSectionText(section) {
  const tabular = [section?.columns, section?.rows]
    .filter(Array.isArray)
    .flatMap((value) => value.flat(2))
    .filter((value) => typeof value === "string" || typeof value === "number")
    .map(String)
    .join("\n");
  return [contentText(section), sectionItemsText(section), tabular].filter(Boolean).join("\n");
}

function interviewText(section) {
  const beats = Array.isArray(section?.beats) ? section.beats : [];
  if (beats.length > 0) {
    return beats.map((beat) => String(beat?.spokenText || "").trim()).filter(Boolean).join("\n\n");
  }
  return contentText(section);
}

function quickText(section) {
  return [sectionItemsText(section), contentText(section)].filter(Boolean).join("\n");
}

function isQuick(section) {
  return QUICK_TYPES.has(section?.type);
}

function isInterview(section) {
  return section?.type === INTERVIEW_TYPE;
}

function isDeep(section) {
  return section && !isQuick(section) && !isInterview(section) && !META_TYPES.has(section.type);
}

function codeFences(value = "") {
  const results = [];
  const pattern = /```([^\n`]*)\n([\s\S]*?)```/g;
  for (const match of normalizeLineEndings(value).matchAll(pattern)) {
    if (match[1].trim().toLowerCase() === "mermaid") continue;
    const code = normalizeCode(match[2]);
    if (code) results.push({ language: match[1].trim(), code });
  }
  return results;
}

function stemToken(token) {
  if (token.length > 5 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
  if (token.length > 4 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

function lexicalTokens(value = "") {
  return normalizeLineEndings(value)
    .toLowerCase()
    .replace(/[^a-z0-9_$]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(stemToken);
}

function topicTokens(questionText = "") {
  return [...new Set(lexicalTokens(questionText).filter((token) => token.length > 1 && !STOP_WORDS.has(token)))];
}

function tokenSet(value = "") {
  return new Set(lexicalTokens(value));
}

function overlap(tokens, value) {
  const haystack = tokenSet(value);
  return tokens.filter((token) => haystack.has(token));
}

function firstSentence(value = "") {
  const clean = String(value).replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const match = clean.match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : clean.split(" ").slice(0, 45).join(" ");
}

function shingleSet(value, size = 5) {
  const words = proseWords(value);
  const shingles = new Set();
  if (words.length < size) return shingles;
  for (let index = 0; index <= words.length - size; index += 1) {
    shingles.add(words.slice(index, index + size).join(" "));
  }
  return shingles;
}

function containmentSimilarity(left, right, size = 5) {
  const a = shingleSet(left, size);
  const b = shingleSet(right, size);
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const value of a) if (b.has(value)) shared += 1;
  return shared / Math.min(a.size, b.size);
}

function jaccardSimilarity(left, right, size = 5) {
  const a = shingleSet(left, size);
  const b = shingleSet(right, size);
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const value of a) if (b.has(value)) shared += 1;
  return shared / (a.size + b.size - shared);
}

function codeShingles(value) {
  const tokens = codeTokens(value);
  const result = new Set();
  for (let index = 0; index <= tokens.length - 5; index += 1) {
    result.add(tokens.slice(index, index + 5).join(" "));
  }
  return result;
}

function codeTokens(value) {
  return normalizeLineEndings(value)
    .match(/[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|===|!==|==|!=|=>|&&|\|\||\S/g) ?? [];
}

function codeTokenSimilarity(left, right) {
  const a = codeShingles(left);
  const b = codeShingles(right);
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const value of a) if (b.has(value)) shared += 1;
  return shared / Math.min(a.size, b.size);
}

function codeJaccardSimilarity(left, right) {
  const a = codeShingles(left);
  const b = codeShingles(right);
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const value of a) if (b.has(value)) shared += 1;
  return shared / (a.size + b.size - shared);
}

function finding(code, context, message, hint, zone = null) {
  return {
    code,
    file: context.file,
    domain: context.domain,
    topic: context.topic,
    slugs: [...new Set(context.slugs ?? [context.slug].filter(Boolean))].sort(),
    zone,
    message,
    hint,
  };
}

function directnessFindings(question, context) {
  const results = [];
  const prompt = String(question?.question || question?.title || "").trim();
  const direct = String(question?.direct_answer || "").trim();
  if (!prompt || !isMeaningfulText(direct)) return results;

  const concepts = topicTokens(prompt);
  const opening = firstSentence(direct);
  const openingHits = overlap(concepts, opening);
  const fullHits = overlap(concepts, direct);

  if (normalizeProse(prompt) === normalizeProse(direct)) {
    results.push(finding(
      "DIRECT_REPEATS_QUESTION",
      context,
      "Direct Answer repeats the question instead of answering it.",
      "Open with the concept's meaning, choice, or result in one plain sentence.",
      "direct",
    ));
  }
  if (/\b(?:this question asks|to answer (?:this|the question)|the interviewer (?:asks|wants))\b/i.test(direct)) {
    results.push(finding(
      "DIRECT_META_ANSWER",
      context,
      "Direct Answer talks about answering rather than the concept itself.",
      "Remove coaching language and state the actual answer first.",
      "direct",
    ));
  }
  if (concepts.length > 0 && fullHits.length === 0) {
    results.push(finding(
      "DIRECT_NO_TOPIC",
      context,
      `Direct Answer shares no specific concept term with “${compactLabel(prompt)}”.`,
      `Name the subject directly (expected signal: ${concepts.slice(0, 4).join(", ")}).`,
      "direct",
    ));
  } else if (concepts.length > 0 && openingHits.length === 0 && fullHits.length > 0) {
    results.push(finding(
      "DIRECT_TOPIC_DELAYED",
      context,
      "The first sentence does not name the question's subject.",
      "Move the concept-specific answer into the opening sentence.",
      "direct",
    ));
  }

  const promptLower = prompt.toLowerCase();
  if (/\b(?:compare|difference|versus|vs\.?|alternative)\b/.test(promptLower)) {
    const hitTarget = Math.min(2, concepts.length);
    if (!INTENT_MARKERS.comparison.test(direct) || (hitTarget > 0 && fullHits.length < hitTarget)) {
      results.push(finding(
        "DIRECT_MISSES_COMPARISON",
        context,
        "Comparison question lacks an explicit contrast between the relevant choices.",
        "Name both choices and state the deciding difference.",
        "direct",
      ));
    }
  }
  if (/\bwhen\b|\bshould\b[^?.]{0,40}\buse\b/.test(promptLower) && !INTENT_MARKERS.decision.test(direct)) {
    results.push(finding(
      "DIRECT_MISSES_DECISION",
      context,
      "Choice question does not give a clear use/selection rule.",
      "State when to choose it and the boundary that changes the choice.",
      "direct",
    ));
  }
  if (/\b(?:debug|diagnos|mistake|avoid|cause|failure|bug)\w*\b/.test(promptLower)
      && !INTENT_MARKERS.diagnosis.test(direct)) {
    results.push(finding(
      "DIRECT_MISSES_DIAGNOSIS",
      context,
      "Problem-solving question does not name a failure, cause, or diagnostic action.",
      "State the likely failure and the first concrete check or prevention step.",
      "direct",
    ));
  }
  if (/^(?:what (?:is|are)|define)\b/i.test(prompt) && !INTENT_MARKERS.definition.test(opening)) {
    results.push(finding(
      "DIRECT_MISSES_DEFINITION",
      context,
      "Definition question does not give a definition in the opening sentence.",
      "Use a plain “X is …” or “X means …” opening.",
      "direct",
    ));
  }

  return results;
}

function validateSupport(support, context, beatIndex) {
  const results = [];
  const prefix = `Beat ${beatIndex + 1}`;
  if (!support || typeof support !== "object" || Array.isArray(support)) {
    return [finding(
      "SUPPORT_MALFORMED",
      context,
      `${prefix} support must be an object.`,
      "Remove the support or supply one complete code, trace, comparison, or checklist object.",
      "interview",
    )];
  }

  if (!SUPPORT_TYPES.has(support.type)) {
    results.push(finding(
      "SUPPORT_UNKNOWN_TYPE",
      context,
      `${prefix} uses unsupported support type “${support.type ?? "missing"}”.`,
      `Use one of: ${[...SUPPORT_TYPES].join(", ")}.`,
      "interview",
    ));
  }
  if (!isMeaningfulLabel(support.title)) {
    results.push(finding(
      "SUPPORT_TITLE_EMPTY",
      context,
      `${prefix} support has no meaningful title.`,
      "Name the relationship, process, or example the support teaches.",
      "interview",
    ));
  }
  if (Object.hasOwn(support, "caption") && !isMeaningfulText(support.caption)) {
    results.push(finding(
      "SUPPORT_CAPTION_EMPTY",
      context,
      `${prefix} support includes an empty caption.`,
      "Write a useful caption or remove the empty field.",
      "interview",
    ));
  }

  if (support.type === "code") {
    if (!isNonEmptyString(support.language)) {
      results.push(finding(
        "SUPPORT_CODE_LANGUAGE_EMPTY",
        context,
        `${prefix} code support has no language.`,
        "Set a language so the example can be rendered and validated correctly.",
        "interview",
      ));
    }
    if (!isNonEmptyString(support.code)) {
      results.push(finding(
        "SUPPORT_CODE_EMPTY",
        context,
        `${prefix} code support is empty.`,
        "Add the focused example or remove the empty support.",
        "interview",
      ));
    }
  }

  if (["trace", "comparison", "checklist"].includes(support.type)) {
    if (!Array.isArray(support.items) || support.items.length < 2) {
      results.push(finding(
        "SUPPORT_ITEMS_INCOMPLETE",
        context,
        `${prefix} ${support.type} support needs at least two items.`,
        "Supply enough labelled items to teach the relationship, or remove the support.",
        "interview",
      ));
    } else {
      const labels = [];
      for (const [itemIndex, item] of support.items.entries()) {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          results.push(finding(
            "SUPPORT_ITEM_MALFORMED",
            context,
            `${prefix} ${support.type} item ${itemIndex + 1} must be an object.`,
            "Use a labelled item object with optional value and detail.",
            "interview",
          ));
          continue;
        }
        if (!isMeaningfulLabel(item.label)) {
          results.push(finding(
            "SUPPORT_ITEM_LABEL_EMPTY",
            context,
            `${prefix} ${support.type} item ${itemIndex + 1} has no label.`,
            "Give each item a short, distinct label.",
            "interview",
          ));
        } else {
          labels.push(normalizeLabel(item.label));
        }
        if (support.type !== "checklist"
            && ![item.value, item.detail, item.text, item.content].some(isNonEmptyString)) {
          results.push(finding(
            "SUPPORT_ITEM_BODY_EMPTY",
            context,
            `${prefix} ${support.type} item ${itemIndex + 1} has a label but no explanation.`,
            "Add the value or detail that makes this item teach something.",
            "interview",
          ));
        }
      }
      if (labels.length !== new Set(labels).size) {
        results.push(finding(
          "SUPPORT_ITEM_LABEL_DUPLICATE",
          context,
          `${prefix} ${support.type} repeats an item label.`,
          "Use distinct labels so the visual has an unambiguous sequence or comparison.",
          "interview",
        ));
      }
    }
  }
  return results;
}

function auditQuestion(question, context) {
  const results = [];
  const sections = Array.isArray(question?.answer?.sections) ? question.answer.sections : [];
  const quickSections = sections.filter(isQuick);
  const interviewSections = sections.filter(isInterview);
  const deepSections = sections.filter(isDeep);

  if (!isMeaningfulText(question?.question)) {
    results.push(finding(
      "QUESTION_EMPTY",
      context,
      "Question text is empty.",
      "Add the learner-facing question before auditing its answer.",
      "question",
    ));
  }
  if (!isMeaningfulText(question?.direct_answer)) {
    results.push(finding(
      "DIRECT_EMPTY",
      context,
      "Direct Answer is empty.",
      "Add a self-contained answer that states the result before details.",
      "direct",
    ));
  } else {
    results.push(...directnessFindings(question, context));
  }

  if (quickSections.length !== 1) {
    results.push(finding(
      "QUICK_ZONE_COUNT",
      context,
      `Expected exactly one Quick Revision zone; found ${quickSections.length}.`,
      "Keep one key_points or important_points section per question.",
      "quick",
    ));
  }
  if (interviewSections.length !== 1) {
    results.push(finding(
      "INTERVIEW_ZONE_COUNT",
      context,
      `Expected exactly one Interview Answer zone; found ${interviewSections.length}.`,
      "Keep one speakable_answer section per question.",
      "interview",
    ));
  }

  for (const section of quickSections) {
    if (!isMeaningfulText(quickText(section))) {
      results.push(finding(
        "QUICK_EMPTY",
        context,
        "Quick Revision has no visible content.",
        "Add concise, question-specific recall points.",
        "quick",
      ));
    }
  }

  for (const section of interviewSections) {
    const beats = Array.isArray(section?.beats) ? section.beats : [];
    if (!isMeaningfulText(interviewText(section))) {
      results.push(finding(
        "INTERVIEW_EMPTY",
        context,
        "Interview Answer has no visible content.",
        "Add a concept-specific answer or authored beats.",
        "interview",
      ));
    }
    if (!isMeaningfulText(contentText(section))) {
      results.push(finding(
        "INTERVIEW_FALLBACK_EMPTY",
        context,
        "Interview Answer has no non-empty fallback content.",
        "Keep content synchronized with the authored beat text for non-guided renderers.",
        "interview",
      ));
    }
    if (section.beats !== undefined && !Array.isArray(section.beats)) {
      results.push(finding(
        "INTERVIEW_BEATS_MALFORMED",
        context,
        "Interview Answer beats must be an array.",
        "Use an authored beat array or remove the invalid field.",
        "interview",
      ));
    }
    const stages = [];
    for (const [beatIndex, beat] of beats.entries()) {
      if (!beat || typeof beat !== "object" || Array.isArray(beat)) {
        results.push(finding(
          "INTERVIEW_BEAT_MALFORMED",
          context,
          `Interview beat ${beatIndex + 1} must be an object.`,
          "Supply a stage, cue, and spokenText object.",
          "interview",
        ));
        continue;
      }
      if (!isMeaningfulText(beat.stage)) {
        results.push(finding(
          "INTERVIEW_BEAT_STAGE_EMPTY",
          context,
          `Interview beat ${beatIndex + 1} has no stage heading.`,
          "Add a natural concept-specific heading.",
          "interview",
        ));
      } else {
        stages.push(normalizeProse(beat.stage));
      }
      if (!isMeaningfulText(beat.cue)) {
        results.push(finding(
          "INTERVIEW_BEAT_CUE_EMPTY",
          context,
          `Interview beat ${beatIndex + 1} has no cue.`,
          "Add a short editorial cue that describes this beat's teaching job.",
          "interview",
        ));
      }
      if (!isMeaningfulText(beat.spokenText)) {
        results.push(finding(
          "INTERVIEW_BEAT_TEXT_EMPTY",
          context,
          `Interview beat ${beatIndex + 1} has no explanation.`,
          "Add the learner-facing explanation or remove the empty beat.",
          "interview",
        ));
      }
      if (beat.support !== undefined) results.push(...validateSupport(beat.support, context, beatIndex));
    }
    if (stages.length !== new Set(stages).size) {
      results.push(finding(
        "INTERVIEW_BEAT_STAGE_DUPLICATE",
        context,
        "Interview Answer repeats a stage heading.",
        "Give each beat a distinct job in the learning flow.",
        "interview",
      ));
    }
    const supportCount = beats.filter((beat) => beat && beat.support !== undefined).length;
    if (supportCount > 2) {
      results.push(finding(
        "INTERVIEW_TOO_MANY_SUPPORTS",
        context,
        `Interview Answer contains ${supportCount} supports.`,
        "Keep only the one or two visuals that materially teach this answer.",
        "interview",
      ));
    }
    if (beats.length > 0 && contentText(section)
        && normalizeProse(contentText(section)) !== normalizeProse(interviewText(section))) {
      results.push(finding(
        "INTERVIEW_FALLBACK_DRIFT",
        context,
        "Interview fallback content differs from its authored beats.",
        "Regenerate content from the beat spokenText so both render paths teach the same answer.",
        "interview",
      ));
    }
  }

  if (deepSections.length === 0 || !deepSections.some((section) => isMeaningfulText(visibleSectionText(section)))) {
    results.push(finding(
      "DEEP_ZONE_EMPTY",
      context,
      "Deep Dive has no non-empty teaching section.",
      "Add an independent explanation, example, relationship, or boundary.",
      "deep",
    ));
  }
  for (const section of deepSections) {
    if (!isMeaningfulText(visibleSectionText(section))) {
      results.push(finding(
        "DEEP_SECTION_EMPTY",
        context,
        `Deep Dive section “${section?.title || section?.type || "untitled"}” is empty.`,
        "Fill the section with useful teaching content or remove it.",
        "deep",
      ));
    }
  }

  return { findings: results, quickSections, interviewSections, deepSections };
}

function exactGroups(records, minimumWords = 8, code = false) {
  const groups = new Map();
  for (const record of records) {
    const signature = code ? normalizeCode(record.text) : normalizeProse(record.text);
    const sufficient = code
      ? codeTokens(signature).length >= 12 || signature.length >= 40
      : wordCount(signature) >= minimumWords;
    if (!signature || !sufficient) continue;
    const list = groups.get(signature) ?? [];
    list.push(record);
    groups.set(signature, list);
  }
  return [...groups.values()].filter(
    (group) => new Set(group.map((record) => record.slug)).size > 1,
  );
}

function addGroupedDuplicateFindings(results, records, options, context) {
  const exactPairs = new Set();
  for (const group of exactGroups(records, options.minimumWords, options.code)) {
    const slugs = [...new Set(group.map((record) => record.slug))].sort();
    const artifactLabels = [...new Set(group.map((record) => compactLabel(record.label)).filter(Boolean))];
    const artifact = artifactLabels.length === 1 ? ` “${artifactLabels[0]}”` : "";
    for (let left = 0; left < slugs.length; left += 1) {
      for (let right = left + 1; right < slugs.length; right += 1) {
        exactPairs.add(`${slugs[left]}\u0000${slugs[right]}`);
      }
    }
    results.push(finding(
      options.exactCode,
      { ...context, slugs },
      `${options.label}${artifact} is identical across ${slugs.length} sibling questions.`,
      options.hint,
      options.zone,
    ));
  }

  const parent = records.map((_, index) => index);
  const findRoot = (index) => {
    let current = index;
    while (parent[current] !== current) {
      parent[current] = parent[parent[current]];
      current = parent[current];
    }
    return current;
  };
  const union = (left, right) => {
    const leftRoot = findRoot(left);
    const rightRoot = findRoot(right);
    if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot;
  };
  const edgeScores = [];
  for (let left = 0; left < records.length; left += 1) {
    for (let right = left + 1; right < records.length; right += 1) {
      const a = records[left];
      const b = records[right];
      if (a.slug === b.slug) continue;
      const slugs = [a.slug, b.slug].sort();
      const pair = `${slugs[0]}\u0000${slugs[1]}`;
      if (exactPairs.has(pair)) continue;
      const minLength = options.code
        ? Math.min(codeTokens(a.text).length, codeTokens(b.text).length)
        : Math.min(wordCount(a.text), wordCount(b.text));
      if (minLength < options.minimumNearWords) continue;
      const score = options.code
        ? codeTokenSimilarity(a.text, b.text)
        : containmentSimilarity(a.text, b.text, options.shingleSize ?? 5);
      const jaccard = options.code
        ? codeJaccardSimilarity(a.text, b.text)
        : jaccardSimilarity(a.text, b.text, options.shingleSize ?? 5);
      if (score < options.threshold || jaccard < options.minimumJaccard) continue;
      union(left, right);
      edgeScores.push({ left, right, score, jaccard });
    }
  }
  const components = new Map();
  for (const edge of edgeScores) {
    const root = findRoot(edge.left);
    const component = components.get(root) ?? { indexes: new Set(), scores: [] };
    component.indexes.add(edge.left);
    component.indexes.add(edge.right);
    component.scores.push(edge.score);
    components.set(root, component);
  }
  for (const component of components.values()) {
    const slugs = [...new Set([...component.indexes].map((index) => records[index].slug))].sort();
    if (slugs.length < 2) continue;
    const highestScore = Math.max(...component.scores);
    results.push(finding(
      options.nearCode,
      { ...context, slugs },
      `${options.label} has a near-duplicate pattern across ${slugs.length} sibling questions (up to ${Math.round(highestScore * 100)}% contained).`,
      options.hint,
      options.zone,
    ));
  }
}

function supportText(support) {
  if (!support || typeof support !== "object") return "";
  if (support.type === "code") {
    return [support.type, support.title, support.caption, support.code].filter(isNonEmptyString).join("\n");
  }
  return [support.type, support.title, ...(Array.isArray(support.items) ? support.items.map(itemText) : [])]
    .filter(isNonEmptyString)
    .join("\n");
}

function collectArtifacts(question, audited, slug) {
  const quick = audited.quickSections.map(quickText).filter(Boolean).join("\n");
  const quickItems = audited.quickSections.flatMap((section) => {
    if (Array.isArray(section?.items)) return section.items.map(itemText).filter(Boolean);
    return contentText(section).split(/\n+/).map((item) => item.replace(/^\s*[-*+]\s*/, "").trim()).filter(Boolean);
  });
  const interview = audited.interviewSections.map(interviewText).filter(Boolean).join("\n\n");
  const deepSections = audited.deepSections.map((section, index) => ({
    slug,
    text: visibleSectionText(section),
    label: section.title || section.type || `section ${index + 1}`,
  })).filter((record) => record.text.trim());
  const deep = deepSections.map((record) => record.text).join("\n\n");
  const supports = [];
  const interviewCodes = [];
  for (const section of audited.interviewSections) {
    for (const beat of Array.isArray(section?.beats) ? section.beats : []) {
      if (!beat?.support) continue;
      const text = supportText(beat.support);
      if (text && beat.support.type !== "code") {
        supports.push({ slug, text, label: beat.support.title || beat.support.type || "support" });
      }
      if (beat.support.type === "code" && isNonEmptyString(beat.support.code)) {
        interviewCodes.push({ slug, text: beat.support.code, label: beat.support.title || "code support", zone: "interview" });
      }
    }
  }

  const deepCodes = [];
  for (const section of audited.deepSections) {
    const raw = visibleSectionText(section);
    const fenced = codeFences(raw);
    for (const code of fenced) {
      deepCodes.push({ slug, text: code.code, label: section.title || section.type || "code", zone: "deep" });
    }
    if (CODE_SECTION_TYPES.has(section.type) && fenced.length === 0 && raw.trim()) {
      deepCodes.push({ slug, text: raw, label: section.title || section.type, zone: "deep" });
    }
  }

  return {
    direct: String(question.direct_answer || ""),
    quick,
    quickItems,
    interview,
    deep,
    deepSections,
    supports,
    interviewCodes,
    deepCodes,
  };
}

function addQuickItemOverlapFindings(results, artifactsBySlug, context) {
  const entries = [...artifactsBySlug.entries()]
    .map(([slug, artifacts]) => ({
      slug,
      quick: artifacts.quick,
      items: [...new Set(artifacts.quickItems.map(normalizeProse).filter(Boolean))],
    }))
    .filter((entry) => entry.items.length >= 3);
  const parent = entries.map((_, index) => index);
  const root = (index) => {
    let current = index;
    while (parent[current] !== current) {
      parent[current] = parent[parent[current]];
      current = parent[current];
    }
    return current;
  };
  const union = (left, right) => {
    const a = root(left);
    const b = root(right);
    if (a !== b) parent[b] = a;
  };
  const scores = [];
  for (let left = 0; left < entries.length; left += 1) {
    for (let right = left + 1; right < entries.length; right += 1) {
      const a = entries[left];
      const b = entries[right];
      if (normalizeProse(a.quick) === normalizeProse(b.quick)) continue;
      const aSet = new Set(a.items);
      const bSet = new Set(b.items);
      let shared = 0;
      for (const item of aSet) if (bSet.has(item)) shared += 1;
      const containment = shared / Math.min(aSet.size, bSet.size);
      const jaccard = shared / (aSet.size + bSet.size - shared);
      if (containment < 0.80 || jaccard < 0.60) continue;
      union(left, right);
      scores.push({ left, right, containment });
    }
  }
  const components = new Map();
  for (const score of scores) {
    const key = root(score.left);
    const component = components.get(key) ?? { indexes: new Set(), scores: [] };
    component.indexes.add(score.left);
    component.indexes.add(score.right);
    component.scores.push(score.containment);
    components.set(key, component);
  }
  for (const component of components.values()) {
    const slugs = [...component.indexes].map((index) => entries[index].slug).sort();
    results.push(finding(
      "SIBLING_QUICK_ITEMS_NEAR",
      { ...context, slugs },
      `Quick Revision reuses at least 80% of its items across ${slugs.length} sibling questions, even though order or wording differs.`,
      "Keep only the recall points that directly answer each sibling question.",
      "quick",
    ));
  }
}

function crossZoneFindings(artifacts, context) {
  const results = [];
  const zones = [
    ["Direct Answer", "direct", artifacts.direct],
    ["Quick Revision", "quick", artifacts.quick],
    ["Interview Answer", "interview", artifacts.interview],
    ["Deep Dive", "deep", artifacts.deep],
  ].filter(([, , text]) => normalizeProse(text));

  for (let left = 0; left < zones.length; left += 1) {
    for (let right = left + 1; right < zones.length; right += 1) {
      const [leftLabel, leftZone, leftText] = zones[left];
      const [rightLabel, rightZone, rightText] = zones[right];
      const minWords = Math.min(wordCount(leftText), wordCount(rightText));
      if (minWords < 5) continue;
      if (normalizeProse(leftText) === normalizeProse(rightText)) {
        results.push(finding(
          "CROSS_ZONE_EXACT",
          context,
          `${leftLabel} and ${rightLabel} repeat the same content.`,
          "Give each zone its own learning job instead of copying text between zones.",
          `${leftZone}/${rightZone}`,
        ));
        continue;
      }
      const pair = `${leftZone}/${rightZone}`;
      const threshold = {
        "direct/interview": { words: 25, containment: 0.90, jaccard: 0.30 },
        "direct/deep": { words: 25, containment: 0.90, jaccard: 0.30 },
        "quick/interview": { words: 20, containment: 0.85, jaccard: 0.35 },
        "quick/deep": { words: 20, containment: 0.85, jaccard: 0.35 },
        "interview/deep": { words: 70, containment: 0.65, jaccard: 0.45 },
      }[pair];
      if (!threshold || minWords < threshold.words) continue;
      const score = containmentSimilarity(leftText, rightText, 5);
      const jaccard = jaccardSimilarity(leftText, rightText, 5);
      if (score >= threshold.containment && jaccard >= threshold.jaccard) {
        results.push(finding(
          "CROSS_ZONE_NEAR",
          context,
          `${Math.round(score * 100)}% of the shorter ${leftLabel}/${rightLabel} text is reused.`,
          "Keep the central fact, but rewrite the depth, example, and purpose for each zone.",
          pair,
        ));
      }
    }
  }

  for (const interviewCode of artifacts.interviewCodes) {
    for (const deepCode of artifacts.deepCodes) {
      if (normalizeCode(interviewCode.text) === normalizeCode(deepCode.text)) {
        results.push(finding(
          "CROSS_ZONE_CODE_EXACT",
          context,
          `Interview code “${compactLabel(interviewCode.label)}” is copied unchanged into Deep Dive.`,
          "Use a focused snippet in Interview and a complete or differently purposed example in Deep Dive.",
          "interview/deep",
        ));
      } else if (Math.min(interviewCode.text.split(/\s+/).length, deepCode.text.split(/\s+/).length) >= 12) {
        const score = codeTokenSimilarity(interviewCode.text, deepCode.text);
        const jaccard = codeJaccardSimilarity(interviewCode.text, deepCode.text);
        if (score >= 0.90 && jaccard >= 0.72) {
          results.push(finding(
            "CROSS_ZONE_CODE_NEAR",
            context,
            `Interview and Deep Dive code are ${Math.round(score * 100)}% structurally reused.`,
            "Make the short support and full example serve visibly different teaching jobs.",
            "interview/deep",
          ));
        }
      }
    }
  }
  return results;
}

function auditSiblingQuestions(questions, baseContext) {
  const results = [];
  const artifactsBySlug = new Map();
  for (const [questionIndex, question] of questions.entries()) {
    const resolvedSlug = question?.slug || question?.id || `<question#${questionIndex + 1}>`;
    const context = { ...baseContext, slug: resolvedSlug };
    const audited = auditQuestion(question, context);
    results.push(...audited.findings);
    const artifacts = collectArtifacts(question, audited, resolvedSlug);
    artifactsBySlug.set(context.slug, artifacts);
    results.push(...crossZoneFindings(artifacts, context));
  }

  const records = (key) => [...artifactsBySlug.entries()]
    .map(([slug, artifacts]) => ({ slug, text: artifacts[key] }))
    .filter((record) => String(record.text || "").trim());
  const flatRecords = (key) => [...artifactsBySlug.entries()]
    .flatMap(([slug, artifacts]) => artifacts[key].map((record) => ({ ...record, slug })));

  addGroupedDuplicateFindings(results, records("quick"), {
    exactCode: "SIBLING_QUICK_EXACT",
    nearCode: "SIBLING_QUICK_NEAR",
    label: "Quick Revision",
    zone: "quick",
    minimumWords: 4,
    minimumNearWords: 24,
    threshold: 0.65,
    minimumJaccard: 0.45,
    shingleSize: 4,
    hint: "Rewrite each Quick Revision around its own question and recall cues.",
  }, baseContext);
  addQuickItemOverlapFindings(results, artifactsBySlug, baseContext);
  addGroupedDuplicateFindings(results, records("interview"), {
    exactCode: "SIBLING_INTERVIEW_EXACT",
    nearCode: "SIBLING_INTERVIEW_NEAR",
    label: "Interview Answer",
    zone: "interview",
    minimumWords: 8,
    minimumNearWords: 60,
    threshold: 0.75,
    minimumJaccard: 0.55,
    hint: "Preserve shared facts, but author the mechanism, example, and boundary for this prompt.",
  }, baseContext);
  addGroupedDuplicateFindings(results, records("deep"), {
    exactCode: "SIBLING_DEEP_EXACT",
    nearCode: "SIBLING_DEEP_NEAR",
    label: "Deep Dive",
    zone: "deep",
    minimumWords: 8,
    minimumNearWords: 60,
    threshold: 0.75,
    minimumJaccard: 0.55,
    hint: "Build an independent mini-article around the exact question instead of reusing a sibling lesson.",
  }, baseContext);
  addGroupedDuplicateFindings(results, flatRecords("deepSections"), {
    exactCode: "SIBLING_DEEP_SECTION_EXACT",
    nearCode: "SIBLING_DEEP_SECTION_NEAR",
    label: "Deep Dive section",
    zone: "deep",
    minimumWords: 8,
    minimumNearWords: 30,
    threshold: 0.80,
    minimumJaccard: 0.60,
    shingleSize: 4,
    hint: "Replace copied subsections with a question-specific explanation, example, or boundary.",
  }, baseContext);
  addGroupedDuplicateFindings(results, flatRecords("supports"), {
    exactCode: "SIBLING_SUPPORT_EXACT",
    nearCode: "SIBLING_SUPPORT_NEAR",
    label: "Interview support",
    zone: "interview",
    minimumWords: 4,
    minimumNearWords: 12,
    threshold: 0.85,
    minimumJaccard: 0.65,
    shingleSize: 4,
    hint: "Use a support only when it teaches this question's specific relationship or process.",
  }, baseContext);
  addGroupedDuplicateFindings(results, [
    ...flatRecords("interviewCodes"),
    ...flatRecords("deepCodes"),
  ], {
    exactCode: "SIBLING_CODE_EXACT",
    nearCode: "SIBLING_CODE_NEAR",
    label: "Code example",
    zone: "code",
    minimumWords: 0,
    minimumNearWords: 20,
    threshold: 0.90,
    minimumJaccard: 0.72,
    code: true,
    hint: "Give each sibling a focused example that demonstrates its own behavior or failure mode.",
  }, baseContext);

  return results;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function indexedTopicFiles(contentRoot, selectedDomain = null, selectedModule = null, selectedTopic = null) {
  if (!fs.existsSync(contentRoot)) {
    return { files: [], domains: [], skippedMissing: 0, errors: [`Content root not found: ${contentRoot}`] };
  }
  const domainNames = selectedDomain
    ? [selectedDomain]
    : fs.readdirSync(contentRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(contentRoot, entry.name, "_index.json")))
      .map((entry) => entry.name)
      .sort();
  const files = [];
  const errors = [];
  let skippedMissing = 0;

  const registryFile = path.join(contentRoot, "source-of-truth.json");
  let registry = {};
  if (fs.existsSync(registryFile)) {
    try {
      registry = readJson(registryFile)?.domains ?? {};
    } catch (error) {
      errors.push(`Cannot parse ${path.relative(process.cwd(), registryFile)}: ${error.message}`);
    }
  }
  const rootForDomain = (domainName) => {
    const registeredRoot = registry?.[domainName]?.canonicalRoot;
    return registeredRoot
      ? path.resolve(process.cwd(), registeredRoot)
      : path.join(contentRoot, domainName);
  };
  const indexCache = new Map();
  const loadIndex = (domainName) => {
    if (indexCache.has(domainName)) return indexCache.get(domainName);
    const indexFile = path.join(rootForDomain(domainName), "_index.json");
    if (!fs.existsSync(indexFile)) {
      errors.push(`Domain “${domainName}” has no _index.json at ${path.relative(process.cwd(), indexFile)}.`);
      indexCache.set(domainName, null);
      return null;
    }
    try {
      const index = readJson(indexFile);
      indexCache.set(domainName, index);
      return index;
    } catch (error) {
      errors.push(`Cannot parse ${path.relative(process.cwd(), indexFile)}: ${error.message}`);
      indexCache.set(domainName, null);
      return null;
    }
  };
  const resolveModuleSource = (domainName, module, trail = []) => {
    const key = `${domainName}/${module?.moduleSlug || "(missing module)"}`;
    if (trail.includes(key)) {
      errors.push(`contentSource cycle detected: ${[...trail, key].join(" -> ")}.`);
      return null;
    }
    if (!module?.contentSource) {
      return { domain: domainName, moduleSlug: module?.moduleSlug, module };
    }
    const sourceDomain = module.contentSource.domain;
    const sourceModuleSlug = module.contentSource.moduleSlug;
    if (!sourceDomain || !sourceModuleSlug) {
      errors.push(`Malformed contentSource on ${key}; domain and moduleSlug are required.`);
      return null;
    }
    const sourceIndex = loadIndex(sourceDomain);
    if (!sourceIndex) return null;
    const sourceModule = (sourceIndex.modules ?? []).find((candidate) => candidate?.moduleSlug === sourceModuleSlug);
    if (!sourceModule) {
      errors.push(`contentSource ${key} points to missing module ${sourceDomain}/${sourceModuleSlug}.`);
      return null;
    }
    return resolveModuleSource(sourceDomain, sourceModule, [...trail, key]);
  };

  for (const domainName of domainNames) {
    const index = loadIndex(domainName);
    if (!index) continue;
    for (const module of Array.isArray(index?.modules) ? index.modules : []) {
      if (!module?.moduleSlug) continue;
      if (selectedModule && module.moduleSlug !== selectedModule) continue;
      const resolved = resolveModuleSource(domainName, module);
      if (!resolved?.moduleSlug) continue;
      const topics = Array.isArray(module.topics) && module.topics.length > 0
        ? module.topics
        : resolved.module?.topics;
      for (const topicValue of Array.isArray(topics) ? topics : []) {
        const topic = typeof topicValue === "string"
          ? topicValue
          : topicValue?.topicSlug || topicValue?.slug;
        if (!topic) continue;
        if (selectedTopic && topic !== selectedTopic) continue;
        const file = path.resolve(rootForDomain(resolved.domain), resolved.moduleSlug, topic, "complete-qa.json");
        if (fs.existsSync(file)) {
          files.push({
            file,
            domain: selectedDomain ? domainName : resolved.domain,
            topic,
            module: selectedDomain ? module.moduleSlug : resolved.moduleSlug,
            sourceDomain: resolved.domain,
            sourceModule: resolved.moduleSlug,
          });
        } else {
          skippedMissing += 1;
        }
      }
    }
  }

  const unique = new Map();
  for (const entry of files) {
    if (!unique.has(entry.file)) unique.set(entry.file, entry);
  }
  return {
    files: [...unique.values()].sort((left, right) => left.file.localeCompare(right.file)),
    domains: domainNames,
    skippedMissing,
    errors,
  };
}

function auditFiles(entries) {
  const findings = [];
  let auditedFiles = 0;
  let auditedQuestions = 0;
  for (const entry of entries) {
    let document;
    try {
      document = readJson(entry.file);
    } catch (error) {
      findings.push(finding(
        "FILE_PARSE_ERROR",
        { ...entry, slugs: [] },
        `Cannot parse canonical question file: ${error.message}`,
        "Fix the JSON before rerunning the quality audit.",
        "file",
      ));
      continue;
    }
    const questions = Array.isArray(document) ? document : document?.questions;
    if (!Array.isArray(questions)) {
      findings.push(finding(
        "FILE_QUESTIONS_MISSING",
        { ...entry, slugs: [] },
        "Canonical question file has no questions array.",
        "Restore the expected top-level array or { questions: [] } shape.",
        "file",
      ));
      continue;
    }
    auditedFiles += 1;
    auditedQuestions += questions.length;
    findings.push(...auditSiblingQuestions(questions, entry));
  }
  return { findings, auditedFiles, auditedQuestions };
}

function sortFindings(findings) {
  return [...findings].sort((left, right) => {
    const leftKey = [left.file, left.code, left.slugs.join(",")].join("\u0000");
    const rightKey = [right.file, right.code, right.slugs.join(",")].join("\u0000");
    return leftKey.localeCompare(rightKey);
  });
}

function category(code) {
  if (code.startsWith("SUPPORT_") || code.startsWith("INTERVIEW_BEAT")) return "support/shape";
  if (code.includes("ZONE_COUNT")) return "zone-count";
  if (code.startsWith("DIRECT_")) return "directness";
  if (code.startsWith("SIBLING_") || code.startsWith("CROSS_ZONE_")) return "reuse";
  if (code.includes("EMPTY") || code.includes("MISSING")) return "empty/missing";
  return "other";
}

function printReport(discovery, audit, setupErrors) {
  const allFindings = sortFindings(audit.findings);
  const categories = new Map();
  for (const item of allFindings) categories.set(category(item.code), (categories.get(category(item.code)) ?? 0) + 1);
  const domainCount = new Set(discovery.files.map((entry) => entry.domain)).size;

  console.log("Answer-quality risk audit (structure, directness, and reuse; not technical fact validation)");
  console.log(`Audited ${audit.auditedFiles} indexed canonical files / ${audit.auditedQuestions} questions / ${domainCount} domains.`);
  if (discovery.skippedMissing > 0) {
    console.log(`Skipped ${discovery.skippedMissing} indexed topic paths with no complete-qa.json.`);
  }
  const categoryText = [...categories.entries()].map(([name, count]) => `${name} ${count}`).join(", ");
  console.log(`Findings: ${allFindings.length}${categoryText ? ` (${categoryText})` : ""}.`);

  for (const error of setupErrors) console.error(`ERROR SETUP — ${error}`);
  for (const item of allFindings.slice(0, maxFindings)) {
    const relativeFile = item.file ? path.relative(process.cwd(), item.file) : "(unknown file)";
    const slugs = item.slugs.length > 0 ? ` :: ${item.slugs.join(", ")}` : "";
    console.error(`- ${item.code} [${relativeFile}]${slugs} — ${item.message} Fix: ${item.hint}`);
  }
  if (allFindings.length > maxFindings) {
    console.error(`... ${allFindings.length - maxFindings} more findings (use --max=<n> to change the limit).`);
  }
}

function runSelfTest() {
  assert.equal(isValidSlug("rest-api-basics"), true);
  assert.equal(isValidSlug("../rest-api-basics"), false);
  assert.equal(normalizeProse("**Arrays** are `fixed`."), "arrays are fixed");
  assert.equal(normalizeCode("\r\n    one()  \r\n    two()\r\n"), "one()\ntwo()");
  assert.equal(isMeaningfulText("**"), false);
  assert.ok(containmentSimilarity(
    "one two three four five six seven eight nine ten",
    "zero one two three four five six seven eight nine ten extra",
  ) > 0.9);

  const validBeats = [
    { stage: "First in, first out", cue: "Define the order", spokenText: "A queue removes values in the order that they were added." },
    { stage: "Two ends have separate jobs", cue: "Explain the operations", spokenText: "Enqueue adds at the back, while dequeue removes from the front." },
  ];
  const validFixture = [{
    slug: "queue-meaning",
    question: "What is a queue data structure?",
    direct_answer: "A queue is an ordered collection that follows first in, first out order.",
    answer: { sections: [
      { type: "key_points", items: ["Insertion happens at the back.", "Removal happens at the front."] },
      { type: "speakable_answer", beats: validBeats, content: validBeats.map((beat) => beat.spokenText).join("\n\n") },
      { type: "deep_explanation", content: "Queues model waiting lines. Keeping insertion and removal at opposite ends preserves arrival order." },
    ] },
  }];
  assert.deepEqual(auditSiblingQuestions(validFixture, {
    file: "/fixture/valid.json",
    domain: "fixture-domain",
    topic: "queues",
  }), []);

  const repeatedQuick = [
    "A value belongs to the fixed collection.",
    "The boundary must be checked before indexing.",
  ];
  const repeatedCode = "items = [1, 2]\nputs items.length\nputs items.first";
  const fixture = [
    {
      slug: "array-meaning",
      question: "What are arrays in Ruby?",
      direct_answer: "An array is an ordered collection of values.",
      answer: { sections: [
        { type: "key_points", items: repeatedQuick },
        {
          type: "speakable_answer",
          content: "An array is an ordered collection.\n\nIt can hold several values.",
          beats: [
            { stage: "One ordered value", cue: "Define it", spokenText: "An array is an ordered collection.", support: { type: "code", title: "Small example", language: "ruby", code: repeatedCode } },
            { stage: "Several positions", cue: "Show indexing", spokenText: "It can hold several values." },
          ],
        },
        { type: "deep_explanation", content: "An array is an ordered collection of values." },
        { type: "code_example", content: `\`\`\`ruby\n${repeatedCode}\n\`\`\`` },
      ] },
    },
    {
      slug: "array-choice",
      question: "When should you use arrays in Ruby?",
      direct_answer: "A database transaction wraps several unrelated network calls.",
      answer: { sections: [
        { type: "key_points", items: repeatedQuick },
        {
          type: "speakable_answer",
          content: "Use a collection when order matters.\n\nChoose it for indexed values.",
          beats: [
            { stage: "Ordered data", cue: "Give the rule", spokenText: "Use a collection when order matters.", support: { type: "trace", title: "", items: [{ label: "Only" }] } },
            { stage: "Indexed access", cue: "Set a boundary", spokenText: "Choose it for indexed values." },
          ],
        },
        { type: "deep_explanation", content: "Use an array when order and indexed access matter." },
        { type: "code_example", content: `\`\`\`ruby\n${repeatedCode}\n\`\`\`` },
      ] },
    },
  ];

  const findings = auditSiblingQuestions(fixture, {
    file: "/fixture/complete-qa.json",
    domain: "fixture-domain",
    topic: "arrays",
  });
  const codes = new Set(findings.map((item) => item.code));
  assert.ok(codes.has("SIBLING_QUICK_EXACT"));
  assert.ok(codes.has("SIBLING_CODE_EXACT"));
  assert.ok(codes.has("DIRECT_NO_TOPIC"));
  assert.ok(codes.has("SUPPORT_TITLE_EMPTY"));
  assert.ok(codes.has("SUPPORT_ITEMS_INCOMPLETE"));
  assert.ok(codes.has("CROSS_ZONE_CODE_EXACT"));

  const reorderedQuickFindings = [];
  addQuickItemOverlapFindings(reorderedQuickFindings, new Map([
    ["first", { quick: "alpha\nbeta\ngamma", quickItems: ["alpha rule", "beta rule", "gamma rule"] }],
    ["second", { quick: "gamma\nalpha\nbeta", quickItems: ["gamma rule", "alpha rule", "beta rule"] }],
  ]), { file: "/fixture/quick.json", domain: "fixture-domain", topic: "quick" });
  assert.equal(reorderedQuickFindings[0]?.code, "SIBLING_QUICK_ITEMS_NEAR");
  console.log("Answer-quality audit self-test passed.");
}

if (unknownArguments.length > 0) {
  console.error(`Unknown argument${unknownArguments.length === 1 ? "" : "s"}: ${unknownArguments.join(", ")}`);
  process.exit(2);
}

if (domainArguments.length > 1) {
  console.error("Pass --domain=<slug> only once.");
  process.exit(2);
}

if (moduleArguments.length > 1) {
  console.error("Pass --module=<slug> only once.");
  process.exit(2);
}

if (topicArguments.length > 1) {
  console.error("Pass --topic=<slug> only once.");
  process.exit(2);
}

if (domainArg && !domain) {
  console.error("--domain requires a non-empty slug.");
  process.exit(2);
}

if (moduleArg && !moduleFilter) {
  console.error("--module requires a non-empty slug.");
  process.exit(2);
}

if (topicArg && !topicFilter) {
  console.error("--topic requires a non-empty slug.");
  process.exit(2);
}

if (selfTest) {
  runSelfTest();
  process.exit(0);
}

if (domain && !isValidSlug(domain)) {
  console.error(`Invalid --domain value “${domain}”; expected a lowercase slug.`);
  process.exit(2);
}
if (moduleFilter && !isValidSlug(moduleFilter)) {
  console.error(`Invalid --module value “${moduleFilter}”; expected a lowercase slug.`);
  process.exit(2);
}
if (topicFilter && !isValidSlug(topicFilter)) {
  console.error(`Invalid --topic value “${topicFilter}”; expected a lowercase slug.`);
  process.exit(2);
}

const contentRoot = path.resolve(process.cwd(), "content");
const discovery = indexedTopicFiles(contentRoot, domain, moduleFilter, topicFilter);
const audit = auditFiles(discovery.files);
const setupErrors = [...discovery.errors];
if (audit.auditedFiles === 0) {
  const requestedScope = [
    domain && `domain “${domain}”`,
    moduleFilter && `module “${moduleFilter}”`,
    topicFilter && `topic “${topicFilter}”`,
  ].filter(Boolean).join(", ");
  setupErrors.push(requestedScope
    ? `No indexed canonical complete-qa.json files were audited for ${requestedScope}.`
    : "No indexed canonical complete-qa.json files were audited.");
}
if (audit.auditedFiles > 0 && audit.auditedQuestions === 0) {
  setupErrors.push("Indexed canonical files were found, but they contained zero questions.");
}

printReport(discovery, audit, setupErrors);

if (setupErrors.length > 0) process.exit(2);
if (strict && audit.findings.length > 0) process.exit(1);
