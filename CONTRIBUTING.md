# Contributing to InterviewExplainer

Thanks for contributing. The single most important rule when adding
content is the **dual-tree decision rule** below.

## Where does new content go?

InterviewExplainer has TWO content trees. Use this rule on every PR.

1. **Is the module already listed in any locked domain's `_index.json`?**
   - `content/java-backend-intermediate/_index.json`
   - `content/java-fullstack-intermediate/_index.json`
   - `content/python-backend-intermediate/_index.json`
   - Any future locked domain registered in
     [`frontend/lib/content-reader.ts`](frontend/lib/content-reader.ts)
     under the `LOCKED_DOMAINS` map.

   **Yes** → write the content under the matching locked-domain folder.
   The locked tree is the SSOT for these domains until playbook 50
   migrates them.

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

Do **not** delete. Add a row to
`content/_audits/duplicate-modules-<DATE>.md` and surface the duplicate
in your PR description. Playbook 50 owns the migration.

### Why two trees?

The locked tree predates the interview tree and serves JBI / JFI / PBI
at frozen URLs. The interview tree hosts every other language + track.
Playbook 50 migrates locked → interview when the team commits to the
single-tree future; until then, both coexist and the rule above routes
new content correctly.
