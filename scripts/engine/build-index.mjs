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
console.log(
  `  questions: ${index.questions.length} | domains: ${Object.keys(index.byDomain).length} | concepts: ${index.concepts.length} | crosslinks: ${Object.keys(index.crossLinks).length} | ${((Date.now() - t0) / 1000).toFixed(1)}s`
);
