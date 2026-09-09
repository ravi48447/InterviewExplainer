# Content evidence

This directory stores internal provenance for canonical learning questions. It does not
add another learner-facing page section.

## Layout

```text
content/_references/java-backend-fresher.json
content/_references/version-policy.json
content/_evidence/_schemas/question-evidence.schema.json
content/_evidence/_templates/question-evidence.template.json
content/_evidence/<domain>/<module>/<topic>/<question>.evidence.json
```

Copy the template for one canonical question, replace every placeholder, and map each
important claim to source IDs from the reference registry. Familiar tutorial sources go
only in `styleSourceRefs`; the audit rejects them when they are used as factual evidence.
When `versionDependent` is true, the claim must also list its exact `versionProfiles`;
those profiles must be declared by the record and the shared version policy.

Review progresses through:

```text
draft -> fact_checked -> example_verified -> editorial_checked -> approved
```

At `fact_checked` or any later state, the evidence record must store the
learner-content `contentHash` reported by the audit. Any material answer edit
changes that hash and invalidates the old review instead of silently preserving
an approval for different content.

Examples remain `planned` until they are compiled, executed, parsed, or manually reviewed.
A visual remains `planned` until every node and edge agrees with its referenced claims.

## Audit commands

Coverage reporting is incremental and succeeds when uncovered questions remain:

```bash
node scripts/audit-content-evidence.mjs java-backend-fresher
```

Machine-readable output:

```bash
node scripts/audit-content-evidence.mjs java-backend-fresher --json
```

Use a gradual release gate while migration is in progress:

```bash
node scripts/audit-content-evidence.mjs java-backend-fresher --min-coverage=10
```

The final strict gate requires valid, approved evidence for every canonical question:

```bash
node scripts/audit-content-evidence.mjs java-backend-fresher --strict
```

Audit implementation self-test:

```bash
node scripts/audit-content-evidence.mjs --self-test
```
