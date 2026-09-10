#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = path.join(root, "content/java-backend-fresher/java-io-basics");
const curator = path.join(root, "scripts/curate-java-fresher-io-remaining-gold.mjs");
const expected = {
  "character-streams": [
    ["character-streams-001", "java-character-streams-overview"],
    ["character-streams-002", "reading-text-files-line-by-line"],
    ["character-streams-003", "writing-text-files-in-java"],
    ["character-streams-004", "printwriter-in-java"],
  ],
  "nio-path-files": [
    ["jbf-io-nio-path-files-001", "path-and-paths-get"],
    ["jbf-io-nio-path-files-002", "files-utility-class-operations"],
    ["jbf-io-nio-path-files-003", "files-walk-directory-traversal"],
    ["jbf-io-nio-path-files-004", "path-operations-resolve-relativize"],
    ["jbf-io-nio-path-files-005", "watchservice-file-monitoring"],
  ],
  "serialization-basics": [
    ["serialization-basics-001", "java-serialization-overview"],
    ["serialization-basics-003", "transient-keyword"],
    ["serialization-basics-002", "serialversionuid-explained"],
    ["serialization-basics-005", "alternatives-to-java-serialization"],
    ["serialization-basics-004", "java-serialization-security-risks"],
  ],
  "try-with-resources-io": [
    ["jbf-io-try-with-resources-001", "try-with-resources-syntax"],
    ["jbf-io-try-with-resources-003", "try-with-resources-vs-finally"],
    ["jbf-io-try-with-resources-005", "try-with-resources-multiple-resources"],
    ["jbf-io-try-with-resources-002", "suppressed-exceptions-try-with-resources"],
    ["jbf-io-try-with-resources-004", "custom-autocloseable"],
    ["jbf-io-try-with-resources-006", "try-with-resources-effectively-final"],
  ],
};
const originalQuestions = {
  "java-character-streams-overview": "What are character streams in Java and what are their main classes?",
  "reading-text-files-line-by-line": "How do you read a text file line by line in Java?",
  "writing-text-files-in-java": "How do you write text to a file in Java?",
  "printwriter-in-java": "What is PrintWriter and when do you use it?",
  "path-and-paths-get": "What is java.nio.file.Path and how do you create one?",
  "files-utility-class-operations": "What are the most important methods in the java.nio.file.Files utility class?",
  "files-walk-directory-traversal": "How do you traverse a directory recursively using Files.walk() in Java?",
  "path-operations-resolve-relativize": "How do Path.resolve(), relativize(), and normalize() work?",
  "watchservice-file-monitoring": "What is WatchService in Java NIO2 and what is it used for?",
  "java-serialization-overview": "What is Java serialization and how does it work?",
  "transient-keyword": "What is the transient keyword in Java?",
  "serialversionuid-explained": "What is serialVersionUID and why does it matter?",
  "alternatives-to-java-serialization": "What are modern alternatives to Java serialization?",
  "java-serialization-security-risks": "What are the security risks of Java serialization?",
  "try-with-resources-syntax": "How does try-with-resources work in Java and what interfaces does it require?",
  "try-with-resources-vs-finally": "How does try-with-resources compare to the old try-catch-finally for closing resources?",
  "try-with-resources-multiple-resources": "How do you use try-with-resources with multiple resources and what order are they closed?",
  "suppressed-exceptions-try-with-resources": "What are suppressed exceptions in Java try-with-resources?",
  "custom-autocloseable": "How do you create a custom class that works with try-with-resources?",
  "try-with-resources-effectively-final": "Can you use an existing variable in try-with-resources, or must you declare a new one?",
};
const files = Object.keys(expected).map((topic) => path.join(moduleRoot, topic, "complete-qa.json"));
const die = (label, message) => { throw new Error(`${label}: ${message}`); };
const words = (value) => String(value).replace(/```[\s\S]*?```/g, " ").replace(/[^\p{L}\p{N}'-]+/gu, " ").trim().split(/\s+/).filter(Boolean).length;
const tokens = (value) => new Set(String(value).toLowerCase().replace(/```[\s\S]*?```/g, " ").replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter((word) => word.length > 3));
const similarity = (a, b) => {
  const left = tokens(a);
  const right = tokens(b);
  const common = [...left].filter((word) => right.has(word)).length;
  return common / new Set([...left, ...right]).size;
};
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

function fence(content, language, label) {
  const match = String(content).match(/^```([a-z0-9-]+)\n([\s\S]*?)\n```$/);
  if (!match || match[1] !== language) die(label, `expected exactly one ${language} fence`);
  return match[2];
}

function balanced(source) {
  const pairs = { "[": "]", "{": "}", "(": ")" };
  const stack = [];
  for (const char of source) {
    if (pairs[char]) stack.push(pairs[char]);
    else if (Object.values(pairs).includes(char) && stack.pop() !== char) return false;
  }
  return stack.length === 0;
}

function checkVisual(section, label) {
  if (section.type === "comparison_table") {
    const rows = String(section.content).split("\n");
    if (rows.length < 4 || !/^\|(?:\s*:?-{3,}:?\s*\|)+$/.test(rows[1])) die(label, "malformed table");
    const columns = rows[0].split("|").length;
    if (rows.some((row) => row.split("|").length !== columns)) die(label, "uneven table columns");
    return;
  }
  const source = fence(section.content, "mermaid", label);
  if (!/^(flowchart (?:LR|TD)|stateDiagram-v2)\n/.test(source) || !balanced(source)) die(label, "malformed Mermaid");
  if (source.split("\n").length < 5) die(label, "visual is not a useful relationship or process");
}

function checkJava(source, label) {
  const className = source.match(/(?:^|\n)class\s+([A-Za-z_$][\w$]*)\s*(?:\{|extends|implements)/)?.[1];
  if (!className || !/public\s+static\s+void\s+main\s*\(/.test(source)) die(label, "example is not a runnable class");
  if (/public\s+(?:final\s+)?class\s/.test(source)) die(label, "top-level example class must be package-private");
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "java-io-gold-"));
  try {
    const file = path.join(temp, `${className}.java`);
    fs.writeFileSync(file, `${source}\n`);
    const compile = spawnSync("javac", ["--release", "17", "-Xlint:all", "-d", temp, file], { encoding: "utf8", timeout: 15000 });
    if (compile.error || compile.status !== 0) die(label, `javac failed\n${compile.stdout}${compile.stderr}${compile.error ?? ""}`);
    const run = spawnSync("java", ["-ea", "-cp", temp, className], { encoding: "utf8", timeout: 15000 });
    if (run.error || run.status !== 0) die(label, `example failed\n${run.stdout}${run.stderr}${run.error ?? ""}`);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

const visuals = new Set(["flow_diagram", "concept_map", "comparison_table"]);
const interviewCorpus = [];
const deepCorpus = [];
let exampleCount = 0;

for (const [topic, signatures] of Object.entries(expected)) {
  const doc = JSON.parse(fs.readFileSync(path.join(moduleRoot, topic, "complete-qa.json"), "utf8"));
  const questions = Array.isArray(doc) ? doc : doc.questions;
  const actual = questions.map((item) => [item.id, item.slug]);
  if (JSON.stringify(actual) !== JSON.stringify(signatures)) die(topic, "ID, slug, count, or order drifted");
  for (const question of questions) {
    const label = `${topic}/${question.slug}`;
    if (question.question !== originalQuestions[question.slug]) die(label, "question wording drifted");
    if (question.interviewer_intent || question.speakable_v2) die(label, "legacy coaching remains");
    if (/\b(?:interviewer (?:wants|expects)|to stand out|how to answer|say this|you should say)\b/i.test(JSON.stringify(question))) die(label, "coaching language remains");
    if (words(question.direct_answer) < 14) die(label, "direct answer is shallow");

    const sections = question.answer?.sections;
    if (!Array.isArray(sections) || sections.length !== 5) die(label, "expected five teaching sections");
    const [quick, interview, deep, visual, example] = sections;
    if (quick.type !== "key_points" || !Array.isArray(quick.items) || quick.items.length < 3 || quick.items.length > 6) die(label, "Quick Revision contract failed");
    if (quick.items.some((item) => words(item) < 5 || words(item) > 28)) die(label, "Quick point is vague or too long");
    const interviewWords = words(interview.content);
    if (interview.type !== "speakable_answer" || interview.answerSize !== "standard" || interviewWords < 220 || interviewWords > 320) die(label, `Interview Answer contract failed (${interviewWords} words)`);
    if (!String(interview.content).includes("For example")) die(label, "Interview Answer lacks a concrete example");
    if (!/\b(?:but|however|only|not|risk|limit|boundary|trade-off)\b/i.test(interview.content)) die(label, "Interview Answer lacks a boundary");
    const deepWords = words(deep.content);
    if (deep.type !== "deep_explanation" || deepWords < 180 || String(deep.content).split("\n\n").length < 3) die(label, `Deep Dive contract failed (${deepWords} words)`);
    if (similarity(interview.content, deep.content) > 0.64) die(label, "Deep Dive repeats the Interview Answer");
    if (!visuals.has(visual.type) || sections.filter((part) => visuals.has(part.type)).length !== 1) die(label, "expected exactly one semantic visual");
    checkVisual(visual, label);
    if (example.type !== "code_example" || sections.filter((part) => part.type === "code_example").length !== 1) die(label, "expected exactly one Java example");
    checkJava(fence(example.content, "java", label), label);
    if (!Array.isArray(question.followup_questions) || question.followup_questions.length < 2 || new Set(question.followup_questions).size !== question.followup_questions.length) die(label, "follow-ups are missing or duplicated");
    interviewCorpus.push([label, interview.content]);
    deepCorpus.push([label, deep.content]);
    exampleCount += 1;
  }
}

for (const corpus of [interviewCorpus, deepCorpus]) {
  for (let i = 0; i < corpus.length; i += 1) {
    for (let j = i + 1; j < corpus.length; j += 1) {
      const score = similarity(corpus[i][1], corpus[j][1]);
      if (score > 0.72) die(`${corpus[i][0]} <> ${corpus[j][0]}`, `cross-lesson similarity ${score.toFixed(2)}`);
    }
  }
}

const mustContain = {
  "reading-text-files-line-by-line": ["returns `null`", "line terminator", "Files.lines"],
  "printwriter-in-java": ["checkError()", "do not propagate `IOException`", "println", "printf", "format"],
  "path-and-paths-get": ["does not create a file", "toRealPath"],
  "files-walk-directory-traversal": ["weakly consistent", "UncheckedIOException", "FOLLOW_LINKS"],
  "watchservice-file-monitoring": ["OVERFLOW", "reset()", "platform dependent", "does not recursively register"],
  "serialversionuid-explained": ["InvalidClassException", "necessary but not sufficient", "default UID"],
  "java-serialization-security-risks": ["before the cast", "ObjectInputFilter", "defense in depth"],
  "try-with-resources-multiple-resources": ["left to right", "reverse order"],
  "suppressed-exceptions-try-with-resources": ["getSuppressed()", "body exception remains primary"],
  "try-with-resources-effectively-final": ["Since Java 9", "effectively-final", "already closed"],
};
for (const topic of Object.keys(expected)) {
  const doc = JSON.parse(fs.readFileSync(path.join(moduleRoot, topic, "complete-qa.json"), "utf8"));
  for (const question of (Array.isArray(doc) ? doc : doc.questions)) {
    const all = JSON.stringify(question);
    for (const fact of mustContain[question.slug] ?? []) if (!all.toLowerCase().includes(fact.toLowerCase())) die(`${topic}/${question.slug}`, `missing fact: ${fact}`);
  }
}

const hashes = Object.fromEntries(files.map((file) => [file, digest(file)]));
const rerun = spawnSync(process.execPath, [curator], { cwd: root, encoding: "utf8" });
if (rerun.status !== 0) die("idempotence", `${rerun.stdout}${rerun.stderr}`);
for (const file of files) if (digest(file) !== hashes[file]) die("idempotence", `${path.relative(root, file)} changed on rerun`);

console.log(`Validated 20 Java I/O lessons: ${exampleCount} compiled and ran on Java 17, 20 semantic visuals, preserved routes, gold reading depth, uniqueness, and curator idempotence.`);
