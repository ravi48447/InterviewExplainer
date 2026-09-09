#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = "content/java-backend-fresher/rest-api-basics/json-basics/complete-qa.json";
const owner = "scripts/curate-java-fresher-rest-remaining-gold.mjs";

const contracts = {
  "json-serialization-vs-deserialization": {
    stages: [
      "Two opposite directions",
      "Serialization controls output",
      "Deserialization accepts input",
      "One request, two DTOs",
      "Round trips are not mirrors",
    ],
    supports: ["comparison"],
    evidence: [
      "writeValueAsString(orderResponse)",
      "readValue(json, CreateOrderRequest.class)",
      "POST /orders",
      "@Valid",
      "round trip",
    ],
    hashes: {
      question: "73a65367211a597169dba6abae91faa9d1347ca83990318adb90d8113b0b4725",
      direct: "7965e3b2a87b697ed5e8b55094fd80a7ed888fd52c535987e02a37a93f24518a",
      quick: "1238c4ca9c1fe07b92a397970d54bac4d9de60bab2d7812fd71887253b0d1159",
      deep: "ff229966198832d1e41674bfeaeca0792ee9b0522170edaf2a674073485f953a",
      visual: "8e1fd4225f45b859e7a1d118d44020bfef63d3af486a04bbf6cfce1c9d42d2f0",
      example: "9083da7c614d441befeb73dc708f9a17ce2db6bbd59124662d14e853f438e68e",
    },
  },
  "request-body-validation-in-spring-boot": {
    stages: [
      "Conversion comes first",
      "Constraints check the DTO",
      "Nested values need a cascade",
      "Business rules come later",
      "Return useful field errors",
    ],
    supports: ["comparison"],
    evidence: [
      "HTTP message converter",
      "@Valid @RequestBody",
      "List<@Valid OrderItemRequest>",
      "@ControllerAdvice",
      "database",
    ],
    hashes: {
      question: "c551b136bd024562a32a2322a2aed73ddde1a940d1c21ebe65784ead9ba83dc9",
      direct: "b7b5a1899a32d75b5a92fa518dd1c1acf70f7495a84addc1741c8d1bf61529fc",
      quick: "7e4b49909ac969501c29a10872dadfcbf88f5c295584bbc979046dbfd86f21ea",
      deep: "a537c72836093259441da4aeab0818e14b55e23055ad9bb4e937853733ee7f79",
      visual: "e250237c05746f07d3bd03e7c7616f9ec30f2cf2323e8b31a3dde6a4b504ea83",
      example: "bd0000c41ffd7704295c809a60d4839e1a2e60e978309bd1f22effb102774302",
    },
  },
  "dto-vs-entity-in-rest-apis": {
    stages: [
      "Two models, two jobs",
      "Request DTO limits input",
      "Entity owns persistence",
      "Response DTO controls output",
      "Mapping buys independence",
    ],
    supports: ["trace"],
    evidence: [
      "CreateUserRequest",
      "UserEntity",
      "UserResponse",
      "passwordHash",
      "persistence context",
    ],
    hashes: {
      question: "7e05cb9da41352c69fa06688efe00e90dba27c675b7d79c72e110df439209bbe",
      direct: "56ceccc98790c89dec9a98d5dd6eff3089dfd9cda173c06647ede3eeb2211211",
      quick: "6cc2ce5be446c0605eba4fca216eb69e7a6191112f4fcd3cc65da7c1e1a47190",
      deep: "cadf9111c3b99194effd31e4e9ee154caf2485d3ed27e9133e46a7f86f01dbf9",
      visual: "9c75c2ec97330e1e51b0e38db538998c078a642dd2f76cd57cb2b2719200c0bd",
      example: "d046de0592b9c341ec72a36d53d49d5614daa05077e71b656350ffe3adfea787",
    },
  },
};

const unrelated = {
  "json-in-rest-apis": "5837f8be21f005256e0b32764b8a8f441a918198d503814517b8ab9dc8834609",
  "jackson-json-serialization-in-spring-boot": "42bfb189cef6853763b849a552572259af37244b74b096b300acb1c6e4e528dd",
};

const hash = (value) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

function normalized(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~\[\](){},.:;!?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value = "") {
  const text = normalized(value);
  return text ? text.split(" ").length : 0;
}

function extractFence(section) {
  const match = String(section?.content ?? "").match(/```java\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`${section?.title ?? "example"}: missing Java fence`);
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
  ["org/springframework", "spring-aop"],
  ["org/springframework", "spring-beans"],
  ["org/springframework", "spring-context"],
  ["org/springframework", "spring-core"],
  ["org/springframework", "spring-expression"],
  ["org/springframework", "spring-jcl"],
  ["org/springframework", "spring-web"],
  ["org/springframework", "spring-webmvc"],
  ["com/fasterxml/jackson/core", "jackson-annotations"],
  ["com/fasterxml/jackson/core", "jackson-core"],
  ["com/fasterxml/jackson/core", "jackson-databind"],
  ["jakarta/validation", "jakarta.validation-api"],
];
const jars = artifacts.map(([group, artifact]) => latestJar(group, artifact));

function compileJava(source, slug) {
  const missing = artifacts.filter((_, index) => !jars[index]);
  if (missing.length) throw new Error(`Maven cache misses ${missing.map(([, artifact]) => artifact).join(", ")}`);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "rest-json-boundary-example-"));
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

const absoluteFile = path.join(root, file);
const document = JSON.parse(fs.readFileSync(absoluteFile, "utf8"));

for (const [slug, contract] of Object.entries(contracts)) {
  const question = document.find((entry) => entry.slug === slug);
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
  if (!Array.isArray(quick.items) || quick.items.length !== 5) throw new Error(`${slug}: Quick Revision is not five exact points`);

  const beats = interview.beats ?? [];
  if (interview.answerSize !== "standard" || beats.length !== contract.stages.length) {
    throw new Error(`${slug}: Interview Answer is not the expected guided article`);
  }
  if (JSON.stringify(beats.map((beat) => beat.stage)) !== JSON.stringify(contract.stages)) {
    throw new Error(`${slug}: stage sequence drifted`);
  }
  if (beats.some((beat) => beat.stage.length > 30 || wordCount(beat.spokenText) > 90)) {
    throw new Error(`${slug}: a heading or beat is too long for guided reading`);
  }
  const fallback = beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  if (fallback !== interview.content) throw new Error(`${slug}: fallback content drifted from beats`);
  if (/\b(?:I would|you should say|mention this|in an interview)\b/i.test(interview.content)) {
    throw new Error(`${slug}: generic coaching language entered the answer`);
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
    if (!evidence.includes(token)) throw new Error(`${slug}: missing teaching evidence ${JSON.stringify(token)}`);
  }

  const deepParagraphs = new Set(String(deep.content).split(/\n\s*\n/).map(normalized));
  if (beats.some((beat) => deepParagraphs.has(normalized(beat.spokenText)))) {
    throw new Error(`${slug}: Interview Answer copied a Deep Dive paragraph`);
  }
  compileJava(extractFence(example), slug);
}

for (const [slug, expectedHash] of Object.entries(unrelated)) {
  const question = document.find((entry) => entry.slug === slug);
  if (!question || hash(question) !== expectedHash) throw new Error(`${slug}: unrelated question drifted`);
}

const before = fs.readFileSync(absoluteFile, "utf8");
for (const slug of Object.keys(contracts)) {
  const result = spawnSync(process.execPath, [path.join(root, owner), slug], {
    cwd: root,
    encoding: "utf8",
    timeout: 30000,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${slug}: deterministic owner failed\n${result.stdout}${result.stderr}${result.error ?? ""}`);
  }
}
if (fs.readFileSync(absoluteFile, "utf8") !== before) {
  throw new Error(`${file}: targeted curator is not byte deterministic`);
}

console.log("Validated 3/3 JSON-boundary guided lessons, three javac 17 examples, independent Deep Dives, determinism, and two unrelated-question hashes.");
