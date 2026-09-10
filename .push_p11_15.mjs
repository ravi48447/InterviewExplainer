#!/usr/bin/env node
// Push Phases 11–15 to ravi48447/InterviewExplainer:intex-v2 via GitHub Git Data API.
// Additions + modifications ONLY (no deletions). base_tree in tree POST body.
// Fast-forward the branch ref. Verifies blob count did not decrease.
import { readFileSync } from 'node:fs';

const OWNER = 'ravi48447';
const REPO = 'InterviewExplainer';
const BRANCH = 'intex-v2';
const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) { console.error('GH_TOKEN not set'); process.exit(1); }

const api = (path, init = {}) =>
  fetch(`https://api.github.com/repos/${OWNER}/${REPO}/git/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

// Every file created or modified in Phases 11–15 (additions + modifications; NO deletions).
const files = [
  // Phase 11 — Resume Intelligence
  'lib/resume/resume-types.ts',
  'lib/resume/resume-data.ts',
  'lib/resume/skill-taxonomy.ts',
  'lib/resume/resume-seo.ts',
  'lib/resume/index.ts',
  'components/resume-v2/resume-upload.tsx',
  'components/resume-v2/evidence-card.tsx',
  'components/resume-v2/gap-item.tsx',
  'components/resume-v2/recommendation-item.tsx',
  'components/resume-v2/analysis-results.tsx',
  'components/resume-v2/job-match-results.tsx',
  'components/resume-v2/resume-shell.tsx',
  'components/resume-v2/index.ts',
  'app/dashboard/resume/page.tsx',
  'v2_plan/task-reports/P11-T001_T700_resume_intelligence.md',

  // Phase 12 — Job Discovery & Application Pipeline
  'lib/opportunity/opportunity-types.ts',
  'lib/opportunity/opportunity-data.ts',
  'lib/opportunity/opportunity-seo.ts',
  'lib/opportunity/index.ts',
  'components/opportunity-v2/opportunity-card.tsx',
  'components/opportunity-v2/opportunity-list.tsx',
  'components/opportunity-v2/job-detail.tsx',
  'components/opportunity-v2/pipeline-kanban.tsx',
  'components/opportunity-v2/application-detail.tsx',
  'components/opportunity-v2/opportunity-shell.tsx',
  'components/opportunity-v2/opportunity-detail-shell.tsx',
  'components/opportunity-v2/pipeline-shell.tsx',
  'components/opportunity-v2/application-detail-shell.tsx',
  'components/opportunity-v2/index.ts',
  'app/dashboard/opportunities/page.tsx',
  'app/dashboard/opportunities/[id]/page.tsx',
  'app/dashboard/pipeline/page.tsx',
  'app/dashboard/pipeline/[id]/page.tsx',
  'v2_plan/task-reports/P12-T001_T732_job_discovery_application_pipeline.md',

  // Phase 13 — Real Interview Intelligence & Community Knowledge
  'lib/community/community-types.ts',
  'lib/community/community-data.ts',
  'lib/community/community-seo.ts',
  'lib/community/index.ts',
  'components/community-v2/contribution-form.tsx',
  'components/community-v2/evidence-display.tsx',
  'components/community-v2/company-intelligence.tsx',
  'components/community-v2/question-detail.tsx',
  'components/community-v2/community-shell.tsx',
  'components/community-v2/contribution-shell.tsx',
  'components/community-v2/company-intelligence-shell.tsx',
  'components/community-v2/question-detail-shell.tsx',
  'components/community-v2/index.ts',
  'app/community/page.tsx',
  'app/community/companies/[company]/page.tsx',
  'app/community/questions/[id]/page.tsx',
  'app/community/contribute/page.tsx',
  'v2_plan/task-reports/P13-T001_T722_community_intelligence.md',

  // Phase 14 — Production Readiness, Security & Observability
  'lib/platform/platform-types.ts',
  'lib/platform/platform-config.ts',
  'lib/platform/security-headers.ts',
  'lib/platform/rate-limit.ts',
  'lib/platform/authorization.ts',
  'lib/platform/logger.ts',
  'lib/platform/cache-policy.ts',
  'lib/platform/validation.ts',
  'lib/platform/data-classification.ts',
  'lib/platform/index.ts',
  'middleware.ts',
  'v2_plan/task-reports/P14-T001_T743_production_readiness.md',

  // Phase 15 — Final Integration, Cleanup, Legacy Removal & Release
  'v2_plan/execution/V2_MIGRATION_TRACKER.md',
  'v2_plan/execution/DECISION_LOG.md',
  'v2_plan/execution/LEGACY_ROUTE_INVENTORY.md',
  'v2_plan/execution/V2_ISSUE_LOG.md',
  'v2_plan/execution/V2_FINAL_COMPLETION_REPORT.md',
  'v2_plan/task-reports/P15-T001_T743_final_integration_release.md',
];

(async () => {
  // 1. Get the branch ref SHA (base commit for fast-forward).
  const refRes = await api(`refs/heads/${BRANCH}`);
  if (!refRes.ok) { console.error('ref fetch failed', refRes.status, await refRes.text()); process.exit(1); }
  const ref = await refRes.json();
  const baseSha = ref.object.sha;
  console.log('base sha:', baseSha);

  // 2. Get the base commit to retrieve its tree (base_tree).
  const commitRes = await api(`commits/${baseSha}`);
  if (!commitRes.ok) { console.error('commit fetch failed', commitRes.status, await commitRes.text()); process.exit(1); }
  const baseCommit = await commitRes.json();
  const baseTreeSha = baseCommit.tree.sha ?? baseCommit.tree;
  console.log('base tree:', baseTreeSha);

  // Fetch the base tree recursively to count its blobs (for the no-deletion guard).
  const baseTreeRecRes = await api(`trees/${baseTreeSha}?recursive=1`);
  if (!baseTreeRecRes.ok) { console.error('base tree recursive fetch failed', baseTreeRecRes.status, await baseTreeRecRes.text()); process.exit(1); }
  const baseTreeRec = await baseTreeRecRes.json();
  const baseBlobCount = baseTreeRec.tree.filter((e) => e.type === 'blob').length;
  console.log('base blob count:', baseBlobCount);

  // 3. Create a blob for each file and collect tree entries.
  const treeEntries = [];
  for (const path of files) {
    const content = readFileSync(path, 'utf8');
    const blobRes = await api('blobs', {
      method: 'POST',
      body: JSON.stringify({ content, encoding: 'utf-8' }),
    });
    if (!blobRes.ok) { console.error('blob failed', path, blobRes.status, await blobRes.text()); process.exit(1); }
    const blob = await blobRes.json();
    treeEntries.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
    process.stdout.write('.');
  }
  console.log(`\ncreated ${treeEntries.length} blobs`);

  // 4. Create a tree WITH base_tree in the body (additions/modifications layered on the full remote tree).
  const treeRes = await api('trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
  });
  if (!treeRes.ok) { console.error('tree failed', treeRes.status, await treeRes.text()); process.exit(1); }
  const tree = await treeRes.json();
  console.log('new tree:', tree.sha, 'tree entries:', tree.tree.length);

  // Fetch the new tree recursively to count its blobs.
  const newTreeRecRes = await api(`trees/${tree.sha}?recursive=1`);
  if (!newTreeRecRes.ok) { console.error('new tree recursive fetch failed', newTreeRecRes.status, await newTreeRecRes.text()); process.exit(1); }
  const newTreeRec = await newTreeRecRes.json();
  const newBlobCount = newTreeRec.tree.filter((e) => e.type === 'blob').length;

  // SAFETY: the new tree must have AT LEAST as many blobs as the base tree (no deletions).
  if (newBlobCount < baseBlobCount) {
    console.error(`ABORT: blob count shrunk ${baseBlobCount} -> ${newBlobCount} (deletions detected)`);
    process.exit(1);
  }
  console.log('blob count ok:', baseBlobCount, '->', newBlobCount);

  // 5. Create the commit pointing to the new tree, parent = baseSha.
  const newCommitRes = await api('commits', {
    method: 'POST',
    body: JSON.stringify({
      message: 'V2 Phases 11–15: Resume Intelligence, Job Discovery, Community Intelligence, Production Readiness & Final Integration',
      tree: tree.sha,
      parents: [baseSha],
    }),
  });
  if (!newCommitRes.ok) { console.error('commit failed', newCommitRes.status, await newCommitRes.text()); process.exit(1); }
  const newCommit = await newCommitRes.json();
  console.log('new commit:', newCommit.sha);

  // 6. Fast-forward the branch ref to the new commit.
  const patchRes = await api(`refs/heads/${BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha, force: false }),
  });
  if (!patchRes.ok) { console.error('ref patch failed', patchRes.status, await patchRes.text()); process.exit(1); }
  const patched = await patchRes.json();
  console.log('ref updated to:', patched.object.sha);

  // 7. Verify: fetch the ref again and confirm it points at the new commit.
  const verifyRes = await api(`refs/heads/${BRANCH}`);
  const verifyRef = await verifyRes.json();
  if (verifyRef.object.sha !== newCommit.sha) {
    console.error(`ABORT: ref mismatch ${verifyRef.object.sha} !== ${newCommit.sha}`);
    process.exit(1);
  }
  console.log('verify ref sha:', verifyRef.object.sha);
  console.log('PUSH OK — Phases 11–15 pushed to', BRANCH, '(', newBlobCount, 'blobs )');
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
