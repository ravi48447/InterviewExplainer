#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(repoRoot, "content/source-of-truth.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const failures = [];
const warnings = [];
const canonicalRoots = new Map();

function completeQaFiles(root) {
  const files = [];
  if (!fs.existsSync(root)) return files;
  const pending = [root];
  while (pending.length) {
    const dir = pending.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) pending.push(file);
      else if (entry.name === "complete-qa.json") files.push(file);
    }
  }
  return files;
}

function questionsFromDocument(document, file) {
  const questions = Array.isArray(document) ? document : document?.questions;
  if (!Array.isArray(questions)) {
    failures.push(`${path.relative(repoRoot, file)}: expected an array or a questions array`);
    return [];
  }
  return questions;
}

function routeKey(route) {
  if (!route || !route.lang || !route.track || !route.level) return null;
  return `${route.lang}/${route.track}/${route.level}`;
}

for (const [domainSlug, config] of Object.entries(registry.domains ?? {})) {
  const canonicalRoot = path.join(repoRoot, config.canonicalRoot);
  const existingOwner = canonicalRoots.get(canonicalRoot);
  if (existingOwner) {
    failures.push(`${domainSlug}: canonical root is already owned by ${existingOwner}`);
  } else {
    canonicalRoots.set(canonicalRoot, domainSlug);
  }

  const legacyRoute = routeKey(config.legacyRoute);
  if (!legacyRoute) {
    failures.push(`${domainSlug}: legacyRoute must explicitly declare lang, track and level`);
  }

  const indexPath = path.join(canonicalRoot, "_index.json");
  if (!fs.existsSync(indexPath)) {
    failures.push(`${domainSlug}: missing canonical _index.json at ${config.canonicalRoot}`);
    continue;
  }

  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  const modules = Array.isArray(index.modules) ? index.modules : [];
  if (modules.length === 0) failures.push(`${domainSlug}: canonical index has no modules`);

  for (const module of modules) {
    if (!module?.moduleSlug || module.contentSource) continue;
    const moduleDir = path.join(canonicalRoot, module.moduleSlug);
    if (!fs.existsSync(moduleDir)) {
      failures.push(`${domainSlug}: indexed module directory is missing: ${module.moduleSlug}`);
    }
  }

  const legacySourceRoots = config.legacySourceRoots ?? [];
  if (legacySourceRoots.length === 0) {
    failures.push(`${domainSlug}: legacySourceRoots must name every retired live source explicitly`);
  }
  for (const sourceRoot of legacySourceRoots) {
    const activeFiles = completeQaFiles(path.join(repoRoot, sourceRoot));
    if (activeFiles.length > 0) {
      failures.push(`${domainSlug}: ${activeFiles.length} answer files remain active under ${sourceRoot}`);
    }
  }

  for (const archivedMirror of config.archivedMirrors ?? []) {
    if (!fs.existsSync(path.join(repoRoot, archivedMirror))) {
      failures.push(`${domainSlug}: registered archive is missing: ${archivedMirror}`);
    }
  }

  for (const [oldStack, newStack] of Object.entries(config.legacyStackSlugs ?? {})) {
    if (!oldStack || !newStack) failures.push(`${domainSlug}: invalid stack alias ${oldStack}`);
    if (!modules.some((module) => module.moduleSlug === newStack)) {
      failures.push(`${domainSlug}: stack alias ${oldStack} points to unknown module ${newStack}`);
    }
  }

  const canonicalQuestions = new Map();
  const canonicalRoutes = new Map();
  let canonicalQuestionCount = 0;
  for (const file of completeQaFiles(canonicalRoot)) {
    const document = JSON.parse(fs.readFileSync(file, "utf8"));
    const questions = questionsFromDocument(document, file);
    for (const question of questions) {
      if (!question?.slug) continue;
      canonicalQuestionCount += 1;
      const stackSlug = path.relative(canonicalRoot, file).split(path.sep)[0];
      const route = `${stackSlug}/${question.slug}`;
      const previousRoute = canonicalRoutes.get(route);
      if (previousRoute) {
        failures.push(
          `${domainSlug}: duplicate canonical route ${route} in ` +
          `${path.relative(repoRoot, previousRoute)} and ${path.relative(repoRoot, file)}`,
        );
      } else {
        canonicalRoutes.set(route, file);
      }

      const slugOwners = canonicalQuestions.get(question.slug) ?? [];
      slugOwners.push({ file, stackSlug });
      canonicalQuestions.set(question.slug, slugOwners);
      if (slugOwners.length === 2 && slugOwners[0].stackSlug !== slugOwners[1].stackSlug) {
        warnings.push(
          `${domainSlug}: question slug ${question.slug} exists in more than one module; ` +
          `one-segment legacy lookup must choose an owner`,
        );
      }
    }
  }
  for (const [oldQuestion, target] of Object.entries(config.legacyQuestionRoutes ?? {})) {
    const targetRoute = `${target.stackSlug}/${target.questionSlug}`;
    if (!canonicalRoutes.has(targetRoute)) {
      failures.push(`${domainSlug}: question redirect ${oldQuestion} points to unknown question ${target.questionSlug}`);
    }
  }

  console.log(
    `${domainSlug}: ${modules.length} modules, ${canonicalQuestions.size}/${canonicalQuestionCount} unique canonical questions, ` +
    `${legacyRoute ?? "missing legacy route"}, no active registered mirror.`,
  );
}

if (failures.length > 0) {
  for (const warning of warnings) console.warn(`! ${warning}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  for (const warning of warnings) console.warn(`! ${warning}`);
  console.log("Content source-of-truth audit passed.");
}
