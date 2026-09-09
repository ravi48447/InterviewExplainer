# Contributing to InterviewExplainer

Thanks for contributing. The single most important rule when adding
content is the **dual-tree decision rule** below.

## Where does new content go?

InterviewExplainer has a locked-domain tree and a secondary interview tree.
Use this rule on every PR.

1. **Is the module already listed in any locked domain's `_index.json`?**
   - `content/java-backend-intermediate/_index.json`
   - `content/java-fullstack-intermediate/_index.json`
   - `content/python-backend-intermediate/_index.json`
   - Any future locked domain registered in
     [`lib/content-reader.ts`](lib/content-reader.ts)
     under the `LOCKED_DOMAINS` map.

   **Yes** → write the content under the matching locked-domain folder.
   The locked tree is the permanent source of truth for that domain.

2. **Otherwise** → write the content under
   `content/interview/{lang}/{track}/{level}/<module>/<topic>/complete-qa.json`.
   The interview tree is the SSOT for everything not in `LOCKED_DOMAINS`.

### Reuse across locked domains

Reuse is **only** legal via `contentSource` in `_index.json`:

```json
{
  "moduleSlug": "core-java",
  "contentSource": "java-backend-intermediate"
}
```

NEVER copy files between locked domains. The `contentSource`
pointer keeps the SSOT in one place; copies drift.

### What if I find duplicate content across both trees?

Do not edit both copies. Preserve the locked-domain copy, verify legacy URLs,
then move the interview-tree mirror into `content/.archive/`. Record the move
in `content/source-of-truth.json` and run `npm run audit:content-sources`.

The former Java Backend Intermediate mirror was archived on 2026-09-05.
Do not recreate `content/interview/java/backend/intermediate`; its canonical
source is `content/java-backend-intermediate`.

### Why two trees?

The locked tree predates the interview tree and serves registered domains at
stable URLs. The interview tree hosts domains that have not been promoted to
a locked curriculum. `content/source-of-truth.json` records migrations and
legacy aliases so only one active copy owns a migrated domain.
