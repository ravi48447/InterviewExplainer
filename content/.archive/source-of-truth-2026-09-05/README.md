# Java Backend Intermediate source-of-truth archive

Archived on 2026-09-05 while consolidating Java Backend Intermediate onto a
single active content source.

## Active source

- Domain: `java-backend-intermediate`
- Canonical content: `content/java-backend-intermediate`
- Canonical curriculum: `content/java-backend-intermediate/_index.json`
- Archived mirror: `interview/java/backend/intermediate`

The archived mirror contains 70 files in 63 directories, including 45
`complete-qa.json` files and 627 question entries. Before the move, 623 of its
question slugs were already present in the canonical tree.

Four remaining legacy slugs are preserved through redirects recorded in
`content/source-of-truth.json`. Three lead to stronger equivalent canonical
lessons (EXPLAIN ANALYZE, JSONB, and N+1). The PostgreSQL locking/deadlock URL
leads to the canonical PostgreSQL transactions lesson, which teaches MVCC,
`FOR UPDATE`, deterministic lock ordering, and concurrency failure handling.

## Rules

- Do not edit or serve this directory as live content.
- Do not recreate `content/interview/java/backend/intermediate`.
- Make Java Backend Intermediate content changes only in the active source.
- Run `npm run audit:content-sources` after changing curriculum roots,
  aliases, or legacy redirects.

## Recovery

This is a tracked, recoverable snapshot. If historical comparison is needed,
read it in place. Restoring it as an active source requires an explicit
architecture decision and an update to `content/source-of-truth.json`; copying
it back without that change will fail the source-of-truth audit.
