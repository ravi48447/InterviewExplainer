#!/usr/bin/env node

import fs from "node:fs";

const canonicalPath = "content/ruby-backend-fresher/blocks-and-iterators/block-syntax-yield/complete-qa.json";
const liveDuplicatePath = "content/ruby-backend-fresher/ruby-language-core-basics/blocks-and-yield-intro/complete-qa.json";
const archivedDuplicatePath = "content/.archive/source-of-truth-2026-09-05/ruby-backend-fresher/ruby-language-core-basics/blocks-and-yield-intro/complete-qa.json";
const sourcePath = fs.existsSync(liveDuplicatePath) ? liveDuplicatePath : archivedDuplicatePath;

if (!fs.existsSync(sourcePath)) {
  throw new Error("The reviewed blocks-and-yield source could not be found.");
}

const canonicalDocument = JSON.parse(fs.readFileSync(canonicalPath, "utf8"));
const sourceDocument = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const canonicalQuestions = Array.isArray(canonicalDocument)
  ? canonicalDocument
  : canonicalDocument.questions;
const sourceQuestions = Array.isArray(sourceDocument) ? sourceDocument : sourceDocument.questions;
const canonical = canonicalQuestions?.[0];
const source = sourceQuestions?.[0];

if (!canonical || !source) throw new Error("Expected one canonical and one reviewed question.");

canonical.direct_answer = source.direct_answer;
canonical.layout_type = source.layout_type;
canonical.difficulty = source.difficulty;
canonical.importance = source.importance;
canonical.reading_time_minutes = source.reading_time_minutes;
canonical.last_updated = "2026-09-07";
canonical.interviewer_intent = source.interviewer_intent;
canonical.answer = {
  ...source.answer,
  sections: source.answer.sections
    .filter((section) => section.type !== "interviewer_expectation")
    .map((section) => section.type === "speakable_answer"
      ? { ...section, answerSize: "standard" }
      : section),
};
canonical.followup_questions = source.followup_questions;
canonical.seo = {
  ...canonical.seo,
  metaTitle: "Ruby Blocks and yield Explained with Examples | InterviewExplainer",
  metaDescription: "Learn how Ruby blocks, yield, block_given?, closures, and &block work with a control-flow diagram, examples, and an interview-ready explanation.",
};

fs.writeFileSync(canonicalPath, `${JSON.stringify(canonicalDocument, null, 2)}\n`);
console.log(`Consolidated the reviewed blocks-and-yield lesson into ${canonicalPath}.`);
