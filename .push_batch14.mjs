#!/usr/bin/env node
// Single-commit multi-file push via GitHub Git Data API (P01 Batch 14).
import { readFileSync } from 'node:fs';

const OWNER = 'ravi48447';
const REPO = 'InterviewExplainer';
const BRANCH = 'intex-v2';
const TOKEN = process.env.GH_PAT;

if (!TOKEN) { console.error('GH_PAT not set'); process.exit(1); }

const api = (path, init = {}) => fetch(`https://api.github.com/repos/${OWNER}/${REPO}/git/${path}`, {
  ...init,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  },
});

const files = [
  'components/ui/form-field.tsx',
  'components/ui/spinner.tsx',
  'components/ui/search-input.tsx',
  'components/ui/nav-link.tsx',
  'components/ui/prev-next-nav.tsx',
  'components/ui/code-block.tsx',
  'components/ui/callout.tsx',
  'components/ui/prose.tsx',
  'components/ui/error-state.tsx',
  'components/ui/inline-error.tsx',
  'components/ui/success-feedback.tsx',
  'components/ui/table-wrapper.tsx',
  'components/ui/figure.tsx',
  'components/ui/skeleton.tsx',
  'app/globals.css',
  'tailwind.config.ts',
  'app/dev/v2/page.tsx',
  'v2_plan/task-reports/P01-T149_T327_phase01_completion.md',
  'v2_plan/execution/LEGACY_REPLACEMENT_MAP.md',
  'v2_plan/execution/DECISION_LOG.md',
  'v2_plan/execution/COMPLETION_REPORT.md',
  'v2_plan/execution/ARBITRARY_VALUE_AUDIT.md',
  'v2_plan/execution/V2_MIGRATION_TRACKER.md',
];

(async () => {
  // 1. Get the branch SHA (base tree)
  const refRes = await api(`refs/heads/${BRANCH}`);
  if (!refRes.ok) { console.error('ref fetch failed', refRes.status, await refRes.text()); process.exit(1); }
  const ref = await refRes.json();
  const baseSha = ref.object.sha;
  console.log('base sha:', baseSha);

  // 2. Create blobs
  const treeEntries = [];
  for (const path of files) {
    const content = readFileSync(path, 'utf8');
    const blobRes = await api('blobs', {
      method: 'POST',
      body: JSON.stringify({ content, encoding: 'utf-8' }),
    });
    if (!blobRes.ok) { console.error('blob fail', path, blobRes.status, await blobRes.text()); process.exit(1); }
    const blob = await blobRes.json();
    treeEntries.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
    console.log('blob:', path, blob.sha.slice(0, 7));
  }

  // 3. Create tree (base_tree preserves unchanged files)
  const treeRes = await api('trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseSha, tree: treeEntries }),
  });
  if (!treeRes.ok) { console.error('tree fail', treeRes.status, await treeRes.text()); process.exit(1); }
  const tree = await treeRes.json();
  console.log('tree sha:', tree.sha);

  // 4. Create commit
  const commitRes = await api('commits', {
    method: 'POST',
    body: JSON.stringify({
      message: 'feat(v2): P01-T149..T327 — complete Phase 01 design system (form, nav, overlays, content, loading/empty/error, a11y, motion, theme, freeze)\n\n14 new components (FormField, Spinner, SearchInput, NavLink, PrevNextNav, CodeBlock, Callout, Prose, ErrorState, InlineError, SuccessFeedback, TableWrapper, Figure + skeleton composites), motion/z-index/focus/touch-target/prose/table CSS tokens, /dev/v2 review surface, legacy replacement map, decision log, arbitrary-value audit, completion report. Phase 01 = 327/327 DONE. Tailwind compiles clean; tsc at 8-error pre-existing baseline (zero new errors).',
      tree: tree.sha,
      parents: [baseSha],
    }),
  });
  if (!commitRes.ok) { console.error('commit fail', commitRes.status, await commitRes.text()); process.exit(1); }
  const commit = await commitRes.json();
  console.log('commit sha:', commit.sha);

  // 5. Update ref
  const updateRes = await api(`refs/heads/${BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
  if (!updateRes.ok) { console.error('ref update fail', updateRes.status, await updateRes.text()); process.exit(1); }
  console.log('PUSH OK — branch', BRANCH, 'updated to', commit.sha);
})().catch((e) => { console.error(e); process.exit(1); });
