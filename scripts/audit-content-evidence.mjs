#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argumentsList = process.argv.slice(2);
const positional = argumentsList.filter((argument) => !argument.startsWith("--"));
const strict = argumentsList.includes("--strict");
const jsonOutput = argumentsList.includes("--json");
const summaryOnly = argumentsList.includes("--summary-only");
const selfTest = argumentsList.includes("--self-test");
const maxArgument = argumentsList.find((argument) => argument.startsWith("--max="));
const maxItems = maxArgument ? Math.max(0, Number(maxArgument.split("=")[1]) || 0) : 20;
const minimumCoverageArgument = argumentsList.find((argument) => argument.startsWith("--min-coverage="));
const minimumCoverage = minimumCoverageArgument
  ? Math.max(0, Math.min(100, Number(minimumCoverageArgument.split("=")[1]) || 0))
  : null;
const requiredStatusArgument = argumentsList.find((argument) => argument.startsWith("--require-status="));
const requiredStatus = requiredStatusArgument?.split("=")[1] ?? null;

const reviewOrder = new Map([
  ["draft", 0],
  ["fact_checked", 1],
  ["example_verified", 2],
  ["editorial_checked", 3],
  ["approved", 4],
]);
const sectionTargets = new Set(["quick_revision", "interview_answer", "deep_dive"]);
const truthAuthorities = new Set(["normative", "official", "canonical"]);
const authorityClaimUse = new Map([
  ["normative", "allowed"],
  ["official", "allowed"],
  ["canonical", "allowed"],
  ["explanatory", "supporting_only"],
  ["style_only", "forbidden"],
]);
const technicalQuestionTypes = new Set([
  "definition",
  "comparison",
  "api_or_syntax",
  "mechanism_or_lifecycle",
  "implementation",
  "debugging_scenario",
  "when_to_use_or_design",
  "security",
  "performance",
  "testing",
  "dsa",
]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizedText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (isObject(value)) {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, stableValue(value[key])]),
    );
  }
  return value;
}

function contentHash(question) {
  const learnerContent = stableValue({
    title: question?.title ?? null,
    question: question?.question ?? null,
    direct_answer: question?.direct_answer ?? null,
    answer: question?.answer ?? null,
  });
  return `sha256:${crypto.createHash("sha256").update(JSON.stringify(learnerContent)).digest("hex")}`;
}

function percentage(part, total) {
  return total === 0 ? 0 : Math.round((part / total) * 1000) / 10;
}

function walkFiles(root, accept, skipInternal = false) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const pending = [root];
  while (pending.length > 0) {
    const directory = pending.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name === ".archive" || entry.name === "_audits") continue;
        if (skipInternal && entry.name.startsWith("_")) continue;
        pending.push(path.join(directory, entry.name));
      } else {
        const file = path.join(directory, entry.name);
        if (accept(file)) files.push(file);
      }
    }
  }
  return files.sort();
}

function readJson(file, issues, label = file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    issues.push(`${label}: invalid JSON (${error.message})`);
    return null;
  }
}

function loadCatalog(contentRoot, issues) {
  const questions = new Map();
  const moduleCounts = new Map();
  const files = walkFiles(contentRoot, (file) => path.basename(file) === "complete-qa.json");

  for (const file of files) {
    const document = readJson(file, issues, path.relative(repoRoot, file));
    if (document === null) continue;
    const entries = Array.isArray(document) ? document : document.questions;
    if (!Array.isArray(entries)) {
      issues.push(`${path.relative(repoRoot, file)}: expected a top-level array or questions array`);
      continue;
    }

    const relativeParts = path.relative(contentRoot, file).split(path.sep);
    const moduleSlug = relativeParts[0];
    const topicSlug = relativeParts[1];
    for (const question of entries) {
      const slug = question?.slug;
      if (!nonEmptyString(slug)) {
        issues.push(`${path.relative(repoRoot, file)}: question is missing a slug`);
        continue;
      }
      if (questions.has(slug)) {
        issues.push(`${path.relative(repoRoot, file)}: duplicate canonical question slug ${slug}`);
        continue;
      }
      questions.set(slug, {
        moduleSlug,
        topicSlug,
        questionText: question.question,
        file: path.relative(repoRoot, file),
        contentHash: contentHash(question),
      });
      moduleCounts.set(moduleSlug, (moduleCounts.get(moduleSlug) ?? 0) + 1);
    }
  }

  return { questions, moduleCounts, files: files.length };
}

function loadReferenceRegistry(file, issues) {
  const document = readJson(file, issues, path.relative(repoRoot, file));
  const sources = new Map();
  if (!isObject(document) || !Array.isArray(document.sources)) {
    issues.push(`${path.relative(repoRoot, file)}: sources must be an array`);
    return { document, sources };
  }
  for (const source of document.sources) {
    if (!nonEmptyString(source?.id)) {
      issues.push(`${path.relative(repoRoot, file)}: source is missing an id`);
      continue;
    }
    if (sources.has(source.id)) {
      issues.push(`${path.relative(repoRoot, file)}: duplicate source id ${source.id}`);
      continue;
    }
    if (!nonEmptyString(source.title) || !nonEmptyString(source.authority) || !nonEmptyString(source.claimUse)) {
      issues.push(`${path.relative(repoRoot, file)}: source ${source.id} is missing title, authority, or claimUse`);
    }
    const expectedClaimUse = authorityClaimUse.get(source.authority);
    if (!expectedClaimUse) {
      issues.push(`${path.relative(repoRoot, file)}: source ${source.id} has unknown authority ${source.authority}`);
    } else if (source.claimUse !== expectedClaimUse) {
      issues.push(`${path.relative(repoRoot, file)}: source ${source.id} must use claimUse ${expectedClaimUse}`);
    }
    sources.set(source.id, source);
  }
  return { document, sources };
}

function loadVersionPolicy(file, issues) {
  const document = readJson(file, issues, path.relative(repoRoot, file));
  const profiles = new Map();
  if (!isObject(document) || !isObject(document.profiles)) {
    issues.push(`${path.relative(repoRoot, file)}: profiles must be an object`);
    return { document, profiles };
  }
  for (const [id, profile] of Object.entries(document.profiles)) {
    if (!isObject(profile) || !nonEmptyString(profile.technology) || !nonEmptyString(profile.version)) {
      issues.push(`${path.relative(repoRoot, file)}: version profile ${id} is incomplete`);
      continue;
    }
    profiles.set(id, profile);
  }
  return { document, profiles };
}

function validateVersionPolicySources(policy, registry, issues, label) {
  if (!isObject(policy.document)) return;
  const defaultProfiles = policy.document.defaultProfiles;
  if (!Array.isArray(defaultProfiles) || defaultProfiles.length === 0) {
    issues.push(`${label}: defaultProfiles must contain at least one profile`);
  } else {
    for (const profileId of defaultProfiles) {
      if (!policy.profiles.has(profileId)) issues.push(`${label}: unknown default profile ${profileId}`);
    }
  }
  for (const [profileId, profile] of policy.profiles) {
    if (!Array.isArray(profile.sourceRefs) || profile.sourceRefs.length === 0) {
      issues.push(`${label}: version profile ${profileId} has no sourceRefs`);
      continue;
    }
    for (const sourceRef of profile.sourceRefs) {
      const source = registry.sources.get(sourceRef);
      if (!source) {
        issues.push(`${label}: version profile ${profileId} references unknown source ${sourceRef}`);
      } else if (source.claimUse === "forbidden" || source.authority === "style_only") {
        issues.push(`${label}: version profile ${profileId} uses style-only source ${sourceRef}`);
      }
    }
  }
}

function checkpointComplete(checkpoint) {
  return isObject(checkpoint) && nonEmptyString(checkpoint.by) && /^\d{4}-\d{2}-\d{2}$/.test(checkpoint.at ?? "");
}

function validateEvidence(record, context, label) {
  const issues = [];
  const add = (message) => issues.push(`${label}: ${message}`);
  if (!isObject(record)) return [`${label}: evidence record must be an object`];

  for (const field of ["domainSlug", "moduleSlug", "topicSlug", "questionSlug", "questionText"]) {
    if (!nonEmptyString(record[field])) add(`missing ${field}`);
  }
  if (record.schemaVersion !== "1.0") add("schemaVersion must be 1.0");

  const canonical = context.catalog.get(record.questionSlug);
  if (!canonical) {
    add(`questionSlug ${record.questionSlug ?? "<missing>"} is not a canonical question`);
  } else {
    if (record.domainSlug !== context.domainSlug) add(`domainSlug must be ${context.domainSlug}`);
    if (record.moduleSlug !== canonical.moduleSlug) {
      add(`moduleSlug ${record.moduleSlug} does not match canonical module ${canonical.moduleSlug}`);
    }
    if (record.topicSlug !== canonical.topicSlug) {
      add(`topicSlug ${record.topicSlug} does not match canonical topic ${canonical.topicSlug}`);
    }
    if (normalizedText(record.questionText) !== normalizedText(canonical.questionText)) {
      add("questionText does not match the canonical question; refresh the target before reviewing claims");
    }
  }

  if (!isObject(record.target)) {
    add("target must be an object");
  } else {
    if (!nonEmptyString(record.target.questionType)) add("target.questionType is missing");
    if (!nonEmptyString(record.target.learningOutcome) || record.target.learningOutcome.trim().length < 20) {
      add("target.learningOutcome must be at least 20 characters");
    }
    if (!Array.isArray(record.target.inScope) || record.target.inScope.length === 0) {
      add("target.inScope must contain at least one item");
    }
    if (!Array.isArray(record.target.outOfScope)) add("target.outOfScope must be an array");
    if (!Array.isArray(record.target.prerequisites)) add("target.prerequisites must be an array");
  }

  if (!Array.isArray(record.versionProfiles) || record.versionProfiles.length === 0) {
    add("versionProfiles must contain at least one profile");
  } else {
    for (const profile of record.versionProfiles) {
      if (!context.versionProfiles.has(profile)) add(`unknown version profile ${profile}`);
    }
  }

  if (!Array.isArray(record.styleSourceRefs) || record.styleSourceRefs.length === 0) {
    add("styleSourceRefs must contain at least one familiar teaching reference");
  } else {
    for (const sourceRef of record.styleSourceRefs) {
      const source = context.sources.get(sourceRef);
      if (!source) add(`unknown style source ${sourceRef}`);
      else if (source.authority !== "style_only" || source.claimUse !== "forbidden") {
        add(`style source ${sourceRef} is not registered as style-only`);
      }
    }
  }

  const claimIds = new Set();
  let recordHasPrimary = false;
  if (!Array.isArray(record.claims) || record.claims.length === 0) {
    add("claims must contain at least one claim");
  } else {
    for (const [index, claim] of record.claims.entries()) {
      const claimLabel = `claims[${index}]`;
      if (!isObject(claim)) {
        add(`${claimLabel} must be an object`);
        continue;
      }
      if (!nonEmptyString(claim.id)) add(`${claimLabel}.id is missing`);
      else if (claimIds.has(claim.id)) add(`duplicate claim id ${claim.id}`);
      else claimIds.add(claim.id);
      if (!nonEmptyString(claim.statement) || claim.statement.trim().length < 20) {
        add(`${claimLabel}.statement must be at least 20 characters`);
      }
      if (!Array.isArray(claim.sectionTargets) || claim.sectionTargets.length === 0) {
        add(`${claimLabel}.sectionTargets must not be empty`);
      } else {
        for (const target of claim.sectionTargets) {
          if (!sectionTargets.has(target)) add(`${claimLabel} has unknown section target ${target}`);
        }
      }
      if (!Array.isArray(claim.sourceRefs) || claim.sourceRefs.length === 0) {
        add(`${claimLabel}.sourceRefs must not be empty`);
        continue;
      }

      let claimHasTruthSource = false;
      let claimHasNormativeSource = false;
      let claimHasOfficialSource = false;
      for (const sourceRef of claim.sourceRefs) {
        const source = context.sources.get(sourceRef);
        if (!source) {
          add(`${claimLabel} references unknown source ${sourceRef}`);
          continue;
        }
        if (source.claimUse === "forbidden" || source.authority === "style_only") {
          add(`${claimLabel} uses style-only source ${sourceRef} as factual evidence`);
          continue;
        }
        if (
          Array.isArray(source.scope) &&
          source.scope.length > 0 &&
          !source.scope.includes(record.moduleSlug)
        ) {
          add(`${claimLabel} uses source ${sourceRef} outside its registered module scope`);
        }
        if (truthAuthorities.has(source.authority) && source.claimUse === "allowed") {
          claimHasTruthSource = true;
          recordHasPrimary = true;
        }
        if (source.authority === "normative") claimHasNormativeSource = true;
        if (source.authority === "official") claimHasOfficialSource = true;
      }
      if (!claimHasTruthSource) add(`${claimLabel} has no truth-capable source`);
      if (claim.classification === "normative" && !claimHasNormativeSource) {
        add(`${claimLabel} is classified normative but has no normative source`);
      }
      if (claim.classification === "implementation_detail" && !claimHasOfficialSource) {
        add(`${claimLabel} is an implementation detail but has no official implementation source`);
      }
      if (claim.versionDependent !== true && claim.versionDependent !== false) {
        add(`${claimLabel}.versionDependent must be a boolean`);
      }
      if (claim.versionDependent === true) {
        if (!Array.isArray(claim.versionProfiles) || claim.versionProfiles.length === 0) {
          add(`${claimLabel} is version-dependent but names no version profile`);
        } else {
          for (const profile of claim.versionProfiles) {
            if (!context.versionProfiles.has(profile)) {
              add(`${claimLabel} references unknown version profile ${profile}`);
            }
            if (!record.versionProfiles?.includes(profile)) {
              add(`${claimLabel} uses version profile ${profile} that is not declared by the evidence record`);
            }
          }
        }
      }
    }
  }

  if (technicalQuestionTypes.has(record.target?.questionType) && !recordHasPrimary) {
    add("technical question has no normative, official, or canonical primary source");
  }

  const examples = Array.isArray(record.examples) ? record.examples : null;
  if (!examples) {
    add("examples must be an array");
  } else {
    const exampleIds = new Set();
    for (const [index, example] of examples.entries()) {
      const exampleLabel = `examples[${index}]`;
      if (!isObject(example)) {
        add(`${exampleLabel} must be an object`);
        continue;
      }
      if (!nonEmptyString(example.id)) add(`${exampleLabel}.id is missing`);
      else if (exampleIds.has(example.id)) add(`duplicate example id ${example.id}`);
      else exampleIds.add(example.id);
      if (!sectionTargets.has(example.sectionTarget)) {
        add(`${exampleLabel} has unknown section target ${example.sectionTarget}`);
      }
      if (!Array.isArray(example.claimRefs) || example.claimRefs.length === 0) {
        add(`${exampleLabel}.claimRefs must not be empty`);
      } else {
        for (const claimRef of example.claimRefs) {
          if (!claimIds.has(claimRef)) add(`${exampleLabel} references unknown claim ${claimRef}`);
        }
      }
      if (!isObject(example.validation) || !nonEmptyString(example.validation.method)
          || !nonEmptyString(example.validation.status)) {
        add(`${exampleLabel}.validation must include method and status`);
      } else if (["passed", "manual_review"].includes(example.validation.status)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(example.validation.checkedAt ?? "")) {
          add(`${exampleLabel} is verified but has no checkedAt date`);
        }
        if (!nonEmptyString(example.validation.checkedBy)) {
          add(`${exampleLabel} is verified but has no checkedBy reviewer`);
        }
      }
    }
  }

  const visuals = Array.isArray(record.visuals) ? record.visuals : null;
  if (!visuals) {
    add("visuals must be an array");
  } else {
    const visualIds = new Set();
    for (const [index, visual] of visuals.entries()) {
      const visualLabel = `visuals[${index}]`;
      if (!isObject(visual)) {
        add(`${visualLabel} must be an object`);
        continue;
      }
      if (!nonEmptyString(visual.id)) add(`${visualLabel}.id is missing`);
      else if (visualIds.has(visual.id)) add(`duplicate visual id ${visual.id}`);
      else visualIds.add(visual.id);
      if (!Array.isArray(visual.claimRefs) || visual.claimRefs.length === 0) {
        add(`${visualLabel}.claimRefs must not be empty`);
      } else {
        for (const claimRef of visual.claimRefs) {
          if (!claimIds.has(claimRef)) add(`${visualLabel} references unknown claim ${claimRef}`);
        }
      }
      if (!nonEmptyString(visual.reviewStatus)) add(`${visualLabel}.reviewStatus is missing`);
      if (visual.reviewStatus === "verified") {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(visual.reviewedAt ?? "")) {
          add(`${visualLabel} is verified but has no reviewedAt date`);
        }
        if (!nonEmptyString(visual.reviewedBy)) {
          add(`${visualLabel} is verified but has no reviewedBy reviewer`);
        }
      }
    }
  }

  if (!isObject(record.review) || !reviewOrder.has(record.review.status)) {
    add("review.status is missing or unknown");
  } else {
    const statusRank = reviewOrder.get(record.review.status);
    if (statusRank >= reviewOrder.get("fact_checked")) {
      if (!nonEmptyString(record.contentHash)) {
        add(`fact_checked or later status requires contentHash (expected ${canonical?.contentHash ?? "canonical hash unavailable"})`);
      } else if (canonical && record.contentHash !== canonical.contentHash) {
        add(`contentHash does not match the current learner-facing answer; review is stale (expected ${canonical.contentHash})`);
      }
    }
    if (statusRank >= reviewOrder.get("fact_checked") && !checkpointComplete(record.review.factChecked)) {
      add("fact_checked or later status requires review.factChecked with by and date");
    }
    if (statusRank >= reviewOrder.get("example_verified")) {
      if (!checkpointComplete(record.review.exampleVerified)) {
        add("example_verified or later status requires review.exampleVerified with by and date");
      }
      const unfinished = (examples ?? []).filter((example) =>
        !["passed", "manual_review"].includes(example?.validation?.status),
      );
      if (unfinished.length > 0) add(`${unfinished.length} example(s) are not verified at ${record.review.status} status`);
    }
    if (statusRank >= reviewOrder.get("editorial_checked")) {
      if (!checkpointComplete(record.review.editorialChecked)) {
        add("editorial_checked or approved status requires review.editorialChecked with by and date");
      }
      const unfinishedVisuals = (visuals ?? []).filter((visual) => visual?.reviewStatus !== "verified");
      if (unfinishedVisuals.length > 0) {
        add(`${unfinishedVisuals.length} visual(s) are not verified at ${record.review.status} status`);
      }
    }
  }

  return issues;
}

function runSelfTest() {
  const canonicalQuestion = {
    moduleSlug: "java-syntax-basics",
    topicSlug: "data-types-and-variables",
    questionText: "What is a Java variable?",
    contentHash: `sha256:${"a".repeat(64)}`,
  };
  const context = {
    domainSlug: "java-backend-fresher",
    catalog: new Map([["java-variable", canonicalQuestion]]),
    versionProfiles: new Map([["java-17", {}]]),
    sources: new Map([
      ["java-jls-17", { authority: "normative", claimUse: "allowed" }],
      ["geeksforgeeks-java-style", { authority: "style_only", claimUse: "forbidden" }],
    ]),
  };
  const validRecord = {
    schemaVersion: "1.0",
    domainSlug: "java-backend-fresher",
    moduleSlug: "java-syntax-basics",
    topicSlug: "data-types-and-variables",
    questionSlug: "java-variable",
    questionText: "What is a Java variable?",
    target: {
      questionType: "definition",
      learningOutcome: "The learner can define a variable and show one simple declaration.",
      inScope: ["Definition"],
      outOfScope: [],
      prerequisites: [],
    },
    versionProfiles: ["java-17"],
    styleSourceRefs: ["geeksforgeeks-java-style"],
    claims: [{
      id: "definition",
      kind: "definition",
      classification: "normative",
      statement: "A variable denotes a storage location through a name in a declared scope.",
      sectionTargets: ["quick_revision", "interview_answer", "deep_dive"],
      sourceRefs: ["java-jls-17"],
      versionDependent: false,
    }],
    examples: [],
    visuals: [],
    review: { status: "draft" },
  };
  const validIssues = validateEvidence(validRecord, context, "valid-fixture");
  if (validIssues.length > 0) {
    throw new Error(`valid fixture failed:\n${validIssues.join("\n")}`);
  }

  const invalidRecord = JSON.parse(JSON.stringify(validRecord));
  invalidRecord.claims[0].sourceRefs = ["geeksforgeeks-java-style"];
  const invalidIssues = validateEvidence(invalidRecord, context, "invalid-fixture");
  if (!invalidIssues.some((issue) => issue.includes("style-only source"))) {
    throw new Error("invalid fixture did not reject a style-only factual source");
  }
  if (!invalidIssues.some((issue) => issue.includes("no truth-capable source"))) {
    throw new Error("invalid fixture did not detect the missing truth-capable source");
  }
  const missingClaimProfile = JSON.parse(JSON.stringify(validRecord));
  missingClaimProfile.claims[0].versionDependent = true;
  const versionIssues = validateEvidence(missingClaimProfile, context, "version-fixture");
  if (!versionIssues.some((issue) => issue.includes("names no version profile"))) {
    throw new Error("version fixture did not require a claim-level version profile");
  }
  const staleReview = JSON.parse(JSON.stringify(validRecord));
  staleReview.contentHash = `sha256:${"b".repeat(64)}`;
  staleReview.review = {
    status: "fact_checked",
    factChecked: { by: "reviewer", at: "2026-09-09" },
  };
  const staleIssues = validateEvidence(staleReview, context, "stale-fixture");
  if (!staleIssues.some((issue) => issue.includes("review is stale"))) {
    throw new Error("stale fixture did not reject a mismatched learner-content hash");
  }
  console.log("Evidence audit self-test passed.");
}

if (selfTest) {
  runSelfTest();
  process.exit(0);
}

const requested = positional[0] ?? "java-backend-fresher";
const requestedPath = path.resolve(repoRoot, requested);
const contentRoot = fs.existsSync(requestedPath)
  ? requestedPath
  : path.join(repoRoot, "content", requested);
const setupIssues = [];
const indexPath = path.join(contentRoot, "_index.json");
const indexDocument = fs.existsSync(indexPath)
  ? readJson(indexPath, setupIssues, path.relative(repoRoot, indexPath))
  : null;
const domainSlug = indexDocument?.domainSlug ?? path.basename(contentRoot);
const evidenceRoot = path.join(repoRoot, "content", "_evidence", domainSlug);
const registryPath = path.join(repoRoot, "content", "_references", `${domainSlug}.json`);
const versionPolicyPath = path.join(repoRoot, "content", "_references", "version-policy.json");

if (!fs.existsSync(contentRoot)) setupIssues.push(`${requested}: content root does not exist`);
if (!fs.existsSync(registryPath)) setupIssues.push(`${domainSlug}: missing reference registry ${path.relative(repoRoot, registryPath)}`);
if (!fs.existsSync(versionPolicyPath)) setupIssues.push(`${domainSlug}: missing version policy ${path.relative(repoRoot, versionPolicyPath)}`);

const catalog = loadCatalog(contentRoot, setupIssues);
const registry = loadReferenceRegistry(registryPath, setupIssues);
const versionPolicy = loadVersionPolicy(versionPolicyPath, setupIssues);
validateVersionPolicySources(
  versionPolicy,
  registry,
  setupIssues,
  path.relative(repoRoot, versionPolicyPath),
);
const context = {
  domainSlug,
  catalog: catalog.questions,
  sources: registry.sources,
  versionProfiles: versionPolicy.profiles,
};

const evidenceFiles = walkFiles(
  evidenceRoot,
  (file) => file.endsWith(".evidence.json"),
  true,
);
const evidenceBySlug = new Map();
const evidenceIssues = [];
const recordIssues = new Map();
const statusCounts = Object.fromEntries([...reviewOrder.keys()].map((status) => [status, 0]));

for (const file of evidenceFiles) {
  const relativeFile = path.relative(repoRoot, file);
  const record = readJson(file, evidenceIssues, relativeFile);
  if (record === null) continue;
  const slug = record.questionSlug ?? `<missing:${relativeFile}>`;
  if (evidenceBySlug.has(slug)) {
    evidenceIssues.push(`${relativeFile}: duplicate evidence for ${slug}`);
    continue;
  }
  evidenceBySlug.set(slug, { record, file: relativeFile });
  if (reviewOrder.has(record.review?.status)) statusCounts[record.review.status] += 1;
  const issues = validateEvidence(record, context, relativeFile);
  if (issues.length > 0) {
    recordIssues.set(slug, issues);
    evidenceIssues.push(...issues);
  }
}

const canonicalSlugs = [...catalog.questions.keys()];
const recordedSlugs = canonicalSlugs.filter((slug) => evidenceBySlug.has(slug));
const validSlugs = recordedSlugs.filter((slug) => !recordIssues.has(slug));
const approvedSlugs = validSlugs.filter((slug) =>
  evidenceBySlug.get(slug)?.record.review?.status === "approved",
);
const uncoveredSlugs = canonicalSlugs.filter((slug) => !evidenceBySlug.has(slug));
const orphanSlugs = [...evidenceBySlug.keys()].filter((slug) => !catalog.questions.has(slug));

const orderedModules = Array.isArray(indexDocument?.modules)
  ? indexDocument.modules.map((module) => module.moduleSlug).filter(Boolean)
  : [...catalog.moduleCounts.keys()].sort();
const moduleRows = orderedModules.map((moduleSlug) => {
  const total = catalog.moduleCounts.get(moduleSlug) ?? 0;
  const recorded = recordedSlugs.filter((slug) => catalog.questions.get(slug)?.moduleSlug === moduleSlug).length;
  const valid = validSlugs.filter((slug) => catalog.questions.get(slug)?.moduleSlug === moduleSlug).length;
  const approved = approvedSlugs.filter((slug) => catalog.questions.get(slug)?.moduleSlug === moduleSlug).length;
  return {
    moduleSlug,
    total,
    recorded,
    valid,
    approved,
    coveragePercent: percentage(recorded, total),
  };
});

const totalQuestions = canonicalSlugs.length;
const coveragePercent = percentage(recordedSlugs.length, totalQuestions);
const report = {
  domainSlug,
  contentRoot: path.relative(repoRoot, contentRoot),
  evidenceRoot: path.relative(repoRoot, evidenceRoot),
  catalogFiles: catalog.files,
  evidenceFiles: evidenceFiles.length,
  sources: registry.sources.size,
  versionProfiles: versionPolicy.profiles.size,
  questions: totalQuestions,
  recorded: recordedSlugs.length,
  valid: validSlugs.length,
  approved: approvedSlugs.length,
  uncovered: uncoveredSlugs.length,
  orphans: orphanSlugs.length,
  coveragePercent,
  statusCounts,
  modules: moduleRows,
  issues: [...setupIssues, ...evidenceIssues],
  sampleUncovered: uncoveredSlugs.slice(0, maxItems),
  sampleOrphans: orphanSlugs.slice(0, maxItems),
};

let gateFailed = report.issues.length > 0;
if (strict && (report.recorded !== report.questions || report.valid !== report.questions
    || report.approved !== report.questions)) {
  gateFailed = true;
}
if (minimumCoverage !== null && coveragePercent < minimumCoverage) gateFailed = true;
if (requiredStatus && reviewOrder.has(requiredStatus)) {
  const requiredRank = reviewOrder.get(requiredStatus);
  const belowRequired = validSlugs.filter((slug) =>
    (reviewOrder.get(evidenceBySlug.get(slug)?.record.review?.status) ?? -1) < requiredRank,
  );
  report.requiredStatus = requiredStatus;
  report.belowRequiredStatus = belowRequired.length;
  report.sampleBelowRequiredStatus = belowRequired.slice(0, maxItems);
  if (belowRequired.length > 0 || report.uncovered > 0) gateFailed = true;
} else if (requiredStatus) {
  report.issues.push(`unknown required status ${requiredStatus}`);
  gateFailed = true;
}

if (jsonOutput) {
  console.log(JSON.stringify({ ...report, gateFailed }, null, 2));
} else {
  console.log(
    `Evidence coverage for ${domainSlug}: ${report.recorded}/${report.questions} recorded `
      + `(${report.coveragePercent}%), ${report.valid} valid, ${report.approved} approved.`,
  );
  console.log(
    `Registry: ${report.sources} sources; version policy: ${report.versionProfiles} profiles; `
      + `evidence files: ${report.evidenceFiles}; uncovered: ${report.uncovered}.`,
  );
  console.log("\nMODULE                                    RECORDED    VALID  APPROVED  COVERAGE");
  for (const row of moduleRows) {
    console.log(
      `${row.moduleSlug.padEnd(40)} ${String(`${row.recorded}/${row.total}`).padStart(9)} `
        + `${String(row.valid).padStart(8)} ${String(row.approved).padStart(9)} `
        + `${String(`${row.coveragePercent}%`).padStart(9)}`,
    );
  }

  if (!summaryOnly && report.sampleUncovered.length > 0) {
    console.log(`\nFirst ${report.sampleUncovered.length} uncovered question(s):`);
    for (const slug of report.sampleUncovered) console.log(`- ${slug}`);
    if (report.uncovered > report.sampleUncovered.length) {
      console.log(`...and ${report.uncovered - report.sampleUncovered.length} more.`);
    }
  }
  if (!summaryOnly && report.issues.length > 0) {
    console.log(`\nEvidence issue(s): ${report.issues.length}`);
    for (const issue of report.issues.slice(0, maxItems)) console.log(`- ${issue}`);
    if (report.issues.length > maxItems) console.log(`...and ${report.issues.length - maxItems} more.`);
  }
  if (minimumCoverage !== null) {
    console.log(`\nMinimum coverage gate: ${minimumCoverage}% (${coveragePercent >= minimumCoverage ? "pass" : "fail"}).`);
  }
  if (strict) {
    console.log("Strict gate requires every canonical question to have valid, approved evidence.");
  }
}

if (gateFailed) process.exitCode = 1;
