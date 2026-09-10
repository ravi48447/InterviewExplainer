#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = path.join(repoRoot, "content/java-backend-fresher/rest-api-basics");
const topics = [
  "api-design-basics",
  "idempotency",
  "json-basics",
  "rest-constraints",
  "rest-vs-soap",
];

function extractFence(content) {
  const match = String(content).match(/^```([a-z]+)\n([\s\S]*?)\n```(?:\n\n[\s\S]+)?$/);
  if (!match) throw new Error("example does not contain one well-formed fenced block");
  return { language: match[1], source: match[2] };
}

function balanced(source, pairs) {
  const stack = [];
  let quote = "";
  let escaped = false;
  for (const char of source) {
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (pairs[char]) stack.push(pairs[char]);
    else if (Object.values(pairs).includes(char) && stack.pop() !== char) return false;
  }
  return !quote && stack.length === 0;
}

function validateHttp(source) {
  const lines = source.split("\n");
  let messages = 0;
  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (line.startsWith("{")) {
      const jsonLines = [];
      let depth = 0;
      let inString = false;
      let escaped = false;
      do {
        const jsonLine = lines[index];
        jsonLines.push(jsonLine);
        for (const char of jsonLine) {
          if (inString) {
            if (escaped) escaped = false;
            else if (char === "\\") escaped = true;
            else if (char === '"') inString = false;
          } else if (char === '"') inString = true;
          else if (char === "{" || char === "[") depth += 1;
          else if (char === "}" || char === "]") depth -= 1;
        }
        index += 1;
      } while (index < lines.length && depth > 0);
      JSON.parse(jsonLines.join("\n"));
      continue;
    }
    if (/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) \S+ HTTP\/1\.1$/.test(line)
        || /^HTTP\/1\.1 [1-5][0-9]{2} [A-Za-z][A-Za-z -]+$/.test(line)) {
      messages += 1;
    } else if (!/^[A-Za-z0-9-]+: .+$/.test(line)) {
      throw new Error(`unrecognized HTTP example line: ${line}`);
    }
    index += 1;
  }
  if (messages === 0) throw new Error("HTTP example contains no request or response start-line");
}

function latestJar(groupPath, artifact) {
  const artifactRoot = path.join(os.homedir(), ".m2/repository", groupPath, artifact);
  if (!fs.existsSync(artifactRoot)) return null;
  const versions = fs.readdirSync(artifactRoot).sort((left, right) =>
    left.localeCompare(right, undefined, { numeric: true }),
  );
  for (const version of versions.reverse()) {
    const jar = path.join(artifactRoot, version, `${artifact}-${version}.jar`);
    if (fs.existsSync(jar)) return jar;
  }
  return null;
}

const javaArtifacts = [
  ["org/springframework", "spring-aop"],
  ["org/springframework", "spring-beans"],
  ["org/springframework", "spring-context"],
  ["org/springframework", "spring-core"],
  ["org/springframework", "spring-expression"],
  ["org/springframework", "spring-jcl"],
  ["org/springframework", "spring-tx"],
  ["org/springframework", "spring-web"],
  ["org/springframework", "spring-webmvc"],
  ["com/fasterxml/jackson/core", "jackson-annotations"],
  ["com/fasterxml/jackson/core", "jackson-core"],
  ["com/fasterxml/jackson/core", "jackson-databind"],
  ["jakarta/validation", "jakarta.validation-api"],
];
const javaJars = javaArtifacts.map(([group, artifact]) => latestJar(group, artifact));

function validateJava(source, label) {
  const missing = javaArtifacts.filter((_, index) => !javaJars[index]);
  if (missing.length) {
    throw new Error(`local Maven cache misses ${missing.map(([, name]) => name).join(", ")}`);
  }
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "java-rest-example-"));
  try {
    const file = path.join(temp, "Example.java");
    fs.writeFileSync(file, `${source}\n`);
    const result = spawnSync(
      "javac",
      ["--release", "17", "-proc:none", "-cp", javaJars.join(path.delimiter), file],
      { encoding: "utf8" },
    );
    if (result.status !== 0) {
      throw new Error(`${label}: javac failed\n${result.stdout}${result.stderr}`);
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

function validateExample(language, source, label) {
  if (language === "json") JSON.parse(source);
  else if (language === "http") validateHttp(source);
  else if (language === "java") validateJava(source, label);
  else if (language === "xml") {
    const result = spawnSync(
      "python3",
      ["-c", "import sys, xml.etree.ElementTree as ET; ET.fromstring(sys.stdin.read())"],
      { input: source, encoding: "utf8" },
    );
    if (result.status !== 0) throw new Error(`${label}: XML parse failed: ${result.stderr}`);
  } else if (language === "graphql") {
    if (!/^query\s+[A-Za-z_]/.test(source) || !balanced(source, { "{": "}", "(": ")" })) {
      throw new Error("GraphQL operation has invalid root syntax or delimiters");
    }
  } else if (language === "text") {
    if (source.split("\n").filter(Boolean).length < 4) throw new Error("text example is incomplete");
  } else throw new Error(`unsupported example language: ${language}`);
}

function validateVisual(section) {
  if (section.type === "comparison_table") {
    const lines = section.content.split("\n");
    if (lines.length < 4 || !/^\|(?:---|:?-+)/.test(lines[1])) {
      throw new Error("comparison table is malformed");
    }
    return;
  }
  const { language, source } = extractFence(section.content);
  if (language !== "mermaid") throw new Error("diagram is not a Mermaid block");
  if (!/^(flowchart (?:LR|TD)|sequenceDiagram)\n/.test(source)) {
    throw new Error("unsupported Mermaid diagram root");
  }
  if (!balanced(source, { "[": "]", "{": "}" })) {
    throw new Error("Mermaid diagram has unbalanced nodes");
  }
}

let examples = 0;
let javaExamples = 0;
for (const topic of topics) {
  const file = path.join(moduleRoot, topic, "complete-qa.json");
  for (const question of JSON.parse(fs.readFileSync(file, "utf8"))) {
    const sections = question.answer?.sections ?? [];
    const examplesFound = sections.filter((section) => section.type === "code_example");
    const visuals = sections.filter((section) =>
      ["comparison_table", "concept_map", "flow_diagram", "sequence_diagram", "architecture_diagram"]
        .includes(section.type),
    );
    const layeredTableExample = question.slug === "layered-system-constraint"
      ? visuals.find((section) =>
          section.type === "comparison_table" && section.title === "What each layer can do")
      : undefined;

    if (layeredTableExample) {
      const semanticVisuals = visuals.filter((section) => section !== layeredTableExample);
      if (examplesFound.length !== 0) {
        throw new Error(`${question.slug}: expected the comparison table to be its only example`);
      }
      if (semanticVisuals.length !== 1) {
        throw new Error(`${question.slug}: expected one semantic visual beside its table example`);
      }
      validateVisual(semanticVisuals[0]);
      validateVisual(layeredTableExample);
      examples += 1;
      continue;
    }

    if (examplesFound.length !== 1) throw new Error(`${question.slug}: expected one example`);
    if (visuals.length !== 1) throw new Error(`${question.slug}: expected one semantic visual`);
    validateVisual(visuals[0]);
    const { language, source } = extractFence(examplesFound[0].content);
    validateExample(language, source, question.slug);
    examples += 1;
    if (language === "java") javaExamples += 1;
  }
}

console.log(`Validated ${examples} examples (${javaExamples} with javac 17) and ${examples} semantic visuals across five Java REST topics.`);
