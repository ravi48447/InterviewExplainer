#!/usr/bin/env node
/**
 * build-index.mjs — build the Content Index (CIS) artifact from the content tree.
 * Output: data/content-index.json (committed or generated at deploy).
 * Usage: node scripts/engine/build-index.mjs [contentDir] [outPath]
 */

import fs from 'node:fs';
import path from 'node:path';
import { buildIndex } from '../../lib/engine/contentIndex.mjs';

const root = process.cwd();
const contentDir = process.argv[2] ?? path.join(root, 'content');
const outPath = process.argv[3] ?? path.join(root, 'data', 'content-index.json');

console.log(`building content index from ${contentDir} ...`);
const t0 = Date.now();
const index = buildIndex(contentDir);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(index));
console.log(`wrote ${outPath}`);

// The lean artifact: the runtime-sized index the engine serves from
// (lib/engine/server.mjs loadLeanIndex). Keep the two in lockstep — a stale
// lean index means the engine sees an old corpus even after a rebuild.
const lean = {
  questions: index.questions.map((q) => ({
    id: q.id,
    domain: q.domain,
    module: q.module,
    topic: q.topic,
    question: q.question,
    title: q.title,
    difficulty: q.difficulty,
    importance: q.importance,
    readingMinutes: q.readingMinutes,
    concepts: q.concepts,
    conceptLabels: q.conceptLabels,
    codeExampleLines: q.codeExampleLines,
    learnUrl: q.learnUrl,
    ...(q.isDsaProblem ? { isDsaProblem: true, examples: q.examples, constraints: q.constraints } : {}),
  })),
  byDomain: Object.fromEntries(
    Object.entries(index.byDomain).map(([d, mods]) => [d, Object.fromEntries(Object.entries(mods).map(([m, ids]) => [m, ids]))])
  ),
  concepts: index.concepts,
  conceptIndex: index.conceptIndex,
  crossLinks: index.crossLinks,
  domains: Object.keys(index.byDomain),
};
const leanPath = path.join(path.dirname(outPath), 'content-index-lean.json');
fs.writeFileSync(leanPath, JSON.stringify(lean));
console.log(`wrote ${leanPath}`);
console.log(
  `  questions: ${index.questions.length} | domains: ${Object.keys(index.byDomain).length} | concepts: ${index.concepts.length} | crosslinks: ${Object.keys(index.crossLinks).length} | ${((Date.now() - t0) / 1000).toFixed(1)}s`
);
