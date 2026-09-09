#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const statusFile = "content/java-backend-fresher/rest-api-basics/http-status-codes/complete-qa.json";
const jsonFile = "content/java-backend-fresher/rest-api-basics/json-basics/complete-qa.json";

const contracts = {
  "spring-boot-error-response-design": {
    file: statusFile,
    owner: "scripts/curate-java-fresher-http-status-gold.mjs",
    stages: ["One public error contract", "Map meaning to status", "ProblemDetail carries meaning", "Keep internals on the server", "Test the full response"],
    supports: ["comparison"],
    evidence: ["@RestControllerAdvice", "404 Not Found", "ProblemDetail.forStatusAndDetail", "application/problem+json", "correlation ID"],
    hashes: {
      question: "c652ad355b51b36c3d5ea20fc06538448c9e312834ef7fd9c9fc548a3651a848",
      direct: "ceeb85c1a34d393233a7381e05900fee41aec2a5b3d289c311a8182ba12a1858",
      quick: "022e82643a635849fd9feb6275c93ea2897b1cbb28a032e20de9d63152f641e3",
      deep: "2b9080db44ab76fe59fbad05d873f262995f6af17b36c8da67671e53c3a72181",
      visual: "dafcf39560db88de14fdc3ecb026dded24c8ff1115742b5a2cf68b75edac3056",
      example: "62f8c9927d94ad8fde85cf587d2da0a83aa87f4db08d64bc0f5b472be151fd67",
    },
    language: "java",
  },
  "json-in-rest-apis": {
    file: jsonFile,
    owner: "scripts/curate-java-fresher-rest-remaining-gold.mjs",
    stages: ["JSON is structured text", "Why web APIs use JSON", "HTTP identifies the format", "The API supplies meaning", "Common does not mean required"],
    supports: ["comparison"],
    evidence: ["object, array, string, number", "Content-Type: application/json", "Accept: application/json", "totalMinor", "REST and HTTP do not require JSON"],
    hashes: {
      question: "5837f8be21f005256e0b32764b8a8f441a918198d503814517b8ab9dc8834609",
      direct: "a472be0c875ba44b4c028d11b992895fe9363f58e2458e632cdb62543d92bd83",
      quick: "e89eb58ad55509a55fd4f57800ae6c61c61182388d316a6d5326620d5100d7ff",
      deep: "336d82a14a9c34a6631254437f54bf5abbb7a1f072f97adac3e9fb27d66e57df",
      visual: "bd1bee862b1ee5f91101727b77222711a8c6a9c9d0f0f1ba8b1077fb31207005",
      example: "af3481b223b2a46eeb3d98a6641fe9096bffc69fcb7ac9dcf8ce6526f2ea3bc3",
    },
    language: "json",
  },
  "jackson-json-serialization-in-spring-boot": {
    file: jsonFile,
    owner: "scripts/curate-java-fresher-rest-remaining-gold.mjs",
    stages: ["Spring selects a converter", "JSON becomes a request DTO", "A response DTO becomes JSON", "Configure the public contract", "Failures happen in stages"],
    supports: ["comparison"],
    evidence: ["@RequestBody CreateUserRequest request", "@JsonProperty", "@Valid", "new UserResponse", "unknown-member policy"],
    hashes: {
      question: "42bfb189cef6853763b849a552572259af37244b74b096b300acb1c6e4e528dd",
      direct: "a78980286054f46dfb52387a452e0ae4f4084ea183caae9f735edaaaa75f29ba",
      quick: "56694585130e7e99e57e10eaa4b3fd71efba52a95e787ce97e320d5e951d0e61",
      deep: "ac258d70a6b29c2f099fd8c9c86870f27bcb36cf2b77a0e79110ff6f80158ea9",
      visual: "ce62abab6e123ccf72607130584c032efc2eebb93197755f4fc06648edfce7f9",
      example: "9cdab1b4a03e7c9ece3e385a02510ef83a932a0367af155ae7380deb2480d9dd",
    },
    language: "java",
  },
};

const unrelated = {
  [statusFile]: {
    "http-status-code-ranges": "896706e73e6b4be37ed8749d37577d5ece9579970dfddcddf36942bcb59dde66",
    "401-vs-403-status-codes": "bdf301ed9c9d060bed8bf0c3b0894f4058d17ea5b77a5390abc0c4f532e6fd66",
    "200-vs-201-vs-204-status-codes": "3db058f3b635f5dde4721167f58fc8b2a2a3d6c45e87d6c656ac3c534ee9b6df",
    "4xx-status-code-distinctions": "98abd5231f7ba0d37434e326074a9575932f9d8f1c4e156dd6562be96d06c4de",
  },
  [jsonFile]: {
    "json-serialization-vs-deserialization": "73a65367211a597169dba6abae91faa9d1347ca83990318adb90d8113b0b4725",
    "request-body-validation-in-spring-boot": "c551b136bd024562a32a2322a2aed73ddde1a940d1c21ebe65784ead9ba83dc9",
    "dto-vs-entity-in-rest-apis": "7e05cb9da41352c69fa06688efe00e90dba27c675b7d79c72e110df439209bbe",
  },
};

const hash = (value) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

function normalized(value = "") {
  return String(value).toLowerCase().replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(value = "") {
  const valueText = normalized(value);
  return valueText ? valueText.split(" ").length : 0;
}

function extractFence(section, language) {
  const match = String(section?.content ?? "").match(new RegExp("```" + language + "\\n([\\s\\S]*?)\\n```"));
  if (!match) throw new Error(`${section?.title ?? "example"}: missing ${language} fence`);
  return match[1];
}

function latestJar(group, artifact) {
  const artifactRoot = path.join(os.homedir(), ".m2/repository", group, artifact);
  if (!fs.existsSync(artifactRoot)) return null;
  const versions = fs.readdirSync(artifactRoot).sort((left, right) =>
    right.localeCompare(left, undefined, { numeric: true }),
  );
  for (const version of versions) {
    const jar = path.join(artifactRoot, version, `${artifact}-${version}.jar`);
    if (fs.existsSync(jar)) return jar;
  }
  return null;
}

const artifacts = [
  ["org/springframework", "spring-beans"],
  ["org/springframework", "spring-context"],
  ["org/springframework", "spring-core"],
  ["org/springframework", "spring-expression"],
  ["org/springframework", "spring-jcl"],
  ["org/springframework", "spring-web"],
  ["org/springframework", "spring-webmvc"],
  ["com/fasterxml/jackson/core", "jackson-annotations"],
];
const jars = artifacts.map(([group, artifact]) => latestJar(group, artifact));

function compileJava(source, slug) {
  const missing = artifacts.filter((_, index) => !jars[index]);
  if (missing.length) throw new Error(`Maven cache misses ${missing.map(([, artifact]) => artifact).join(", ")}`);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "rest-error-json-example-"));
  try {
    const javaFile = path.join(temp, "Example.java");
    fs.writeFileSync(javaFile, `${source}\n`);
    const result = spawnSync(
      "javac",
      ["--release", "17", "-proc:none", "-cp", jars.join(path.delimiter), javaFile],
      { encoding: "utf8", timeout: 30000 },
    );
    if (result.error || result.status !== 0) {
      throw new Error(`${slug}: javac failed\n${result.stdout}${result.stderr}${result.error ?? ""}`);
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}


const documents = new Map();
for (const file of new Set(Object.values(contracts).map((contract) => contract.file))) {
  documents.set(file, JSON.parse(fs.readFileSync(path.join(root, file), "utf8")));
}

for (const [slug, contract] of Object.entries(contracts)) {
  const question = documents.get(contract.file).find((entry) => entry.slug === slug);
  if (!question) throw new Error(`${slug}: target question is missing`);
  const sections = question.answer?.sections ?? [];
  const quick = sections.find((section) => section.type === "key_points");
  const interview = sections.find((section) => section.type === "speakable_answer");
  const deep = sections.find((section) => section.type === "deep_explanation");
  const visual = sections.find((section) => ["comparison_table", "flow_diagram", "concept_map", "sequence_diagram"].includes(section.type));
  const example = sections.find((section) => section.type === "code_example");
  if (!quick || !interview || !deep || !visual || !example) throw new Error(`${slug}: a learning zone is missing`);

  const actualHashes = {
    question: hash(question),
    direct: hash(question.direct_answer),
    quick: hash(quick),
    deep: hash(deep),
    visual: hash(visual),
    example: hash(example),
  };
  for (const [zone, expected] of Object.entries(contract.hashes)) {
    if (actualHashes[zone] !== expected) throw new Error(`${slug}: ${zone} drifted`);
  }
  if (question.last_updated !== "2026-09-08") throw new Error(`${slug}: stale last_updated`);

  const beats = interview.beats ?? [];
  if (interview.answerSize !== "standard" || beats.length !== contract.stages.length) {
    throw new Error(`${slug}: Interview Answer is not the expected guided article`);
  }
  if (JSON.stringify(beats.map((beat) => beat.stage)) !== JSON.stringify(contract.stages)) {
    throw new Error(`${slug}: stage sequence drifted`);
  }
  if (beats.some((beat) => beat.stage.length > 30 || wordCount(beat.spokenText) > 90)) {
    throw new Error(`${slug}: a stage heading or beat exceeds the presentation limit`);
  }
  const fallback = beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (fallback !== interview.content) throw new Error(`${slug}: fallback content drifted from beats`);
  if (/\b(?:I would|you should say|mention this|in an interview)\b/i.test(interview.content)) {
    throw new Error(`${slug}: coaching language leaked into the answer`);
  }
  const supports = beats.map((beat) => beat.support?.type).filter(Boolean);
  if (supports.length > 2 || JSON.stringify(supports) !== JSON.stringify(contract.supports)) {
    throw new Error(`${slug}: expected supports ${contract.supports}, found ${supports}`);
  }
  const evidence = beats.flatMap((beat) => [
    beat.spokenText,
    beat.support?.title,
    ...(beat.support?.items ?? []).flatMap((item) => [item.label, item.value, item.detail]),
  ]).filter(Boolean).join("\n");
  for (const token of contract.evidence) {
    if (!evidence.includes(token)) throw new Error(`${slug}: missing evidence ${JSON.stringify(token)}`);
  }

  const deepParagraphs = new Set(String(deep.content).split(/\n\s*\n/).map(normalized));
  if (beats.some((beat) => deepParagraphs.has(normalized(beat.spokenText)))) {
    throw new Error(`${slug}: Interview Answer copied a Deep Dive paragraph`);
  }
  const source = extractFence(example, contract.language);
  if (contract.language === "json") JSON.parse(source);
  else compileJava(source, slug);
}

for (const [file, expected] of Object.entries(unrelated)) {
  const document = documents.get(file);
  for (const [slug, expectedHash] of Object.entries(expected)) {
    const question = document.find((entry) => entry.slug === slug);
    if (!question || hash(question) !== expectedHash) throw new Error(`${slug}: unrelated question drifted`);
  }
}

const before = new Map([...documents.keys()].map((file) => [file, fs.readFileSync(path.join(root, file), "utf8")]));
for (const [slug, contract] of Object.entries(contracts)) {
  const result = spawnSync(process.execPath, [path.join(root, contract.owner), slug], {
    cwd: root,
    encoding: "utf8",
    timeout: 30000,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${slug}: deterministic owner failed\n${result.stdout}${result.stderr}${result.error ?? ""}`);
  }
}
for (const [file, original] of before) {
  if (fs.readFileSync(path.join(root, file), "utf8") !== original) throw new Error(`${file}: targeted owner is not byte deterministic`);
}

console.log("Validated 3/3 Spring-error and JSON guided lessons, two javac 17 examples, one JSON example, independent Deep Dives, determinism, and unrelated-question preservation.");
