#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  repoRoot,
  "content/java-backend-fresher/dsa-fundamentals/sorting-algorithms/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
const lesson = questions.find((entry) => entry.slug === "counting-sort-when-to-use");

if (!lesson) throw new Error("Missing counting-sort-when-to-use");
if (
  lesson.id !== "sorting-algorithms-q8"
  || lesson.question !== "When would you use counting sort instead of comparison-based sorts?"
) {
  throw new Error("Counting-sort ID or route question changed unexpectedly");
}

const sections = lesson.answer?.sections;
if (!Array.isArray(sections)) throw new Error("Counting-sort answer sections are missing");
const interviewSections = sections.filter((section) => section.type === "speakable_answer");
if (interviewSections.length !== 1) {
  throw new Error(`Expected one Interview answer; found ${interviewSections.length}`);
}
if (!sections.some((section) => section.type === "deep_explanation")) {
  throw new Error("Refusing to update counting sort without its Deep Dive lesson");
}

const interview = interviewSections[0];
interview.title = "Interview answer";
interview.answerSize = "compact";
interview.content = [
  "Counting sort is a non-comparison sorting algorithm for integer keys in a small, known range. Instead of comparing two values, it uses each value as an index and counts how many times that value appears.",
  "For example, 100,000 exam scores can only be from 0 to 100. Counting sort needs 101 counters: one pass records the frequencies, and a scan from 0 to 100 produces the sorted scores. The time is O(n + k), where n is the number of items and k is the size of the key range.",
  "A frequency-only version is enough for plain integers. To sort records and keep equal-key records in their original order, cumulative counts give final positions and records are placed into an output array from right to left. Negative values also work by subtracting the minimum value before indexing the count array.",
  "The key range is the deciding limit. A few numbers spread between 0 and one billion would require too much memory and too long a range scan. Counting sort is a strong choice for dense, bounded integer keys; a comparison-based library sort is safer for general values or a wide, unknown range.",
].join("\n\n");

fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`);
console.log("Curated counting-sort-when-to-use; preserved its ID, slug, route, order, Deep Dive, and teaching support.");
