# Audit — cicd

**Pillar:** P09 Git, Build & CI/CD
**Module:** M26 cicd
**Topics present:** 4 (of 8 — `deployment-strategies`, `rollback-strategies`, `scenario-based`, `comparisons` empty)
**Questions:** 25 (all written, no stubs)
**Benchmark sources:** Jenkins documentation (Declarative Pipeline reference), GitHub Actions docs, Terraform up & running (Yevgeniy Brikman 3rd ed), HashiCorp Terraform documentation, continuousdelivery.com, Martin Fowler on Deployment Pipelines

---

## Module is structurally clean but scope-unbalanced

- 25 written questions, no stubs
- **2 CLEAN questions** (terraform-variables-and-workspaces, terraform-import-vs-terraform-taint)
- Universal `interviewer_intent` completeness, all 25 have `key_points`
- Only 1 MODERATE issue
- Strong code coverage — most Qs have 1–3 code blocks

**The imbalance**: 10 of 25 questions (40%) are Terraform, 6 are Jenkins, 7 are GitHub Actions, 2 are CI/CD fundamentals. Zero questions on GitLab CI, CircleCI, Azure Pipelines, ArgoCD, Spinnaker, or deployment strategies (blue-green, canary, rolling) — all of which are standard interview topics.

Terraform content is more IaC (infrastructure as code) than CI/CD — **Terraform arguably doesn't belong here**. The rest of the IaC story (Ansible, Pulumi, CloudFormation, Helm) is absent and would belong in a dedicated IaC module or inside M29 aws-cloud.

---

## Biggest finding — empty `deployment-strategies` topic

`deployment-strategies` topic is empty. For a CI/CD module this is the biggest gap. Missing standard questions:

- `blue-green-deployment-spring-boot-kubernetes`
- `canary-deployment-strategy-with-istio-or-argo-rollouts`
- `rolling-deployment-kubernetes-deployment-strategy`
- `feature-flags-vs-deployment-strategies`
- `database-schema-migrations-zero-downtime-deployment`

Blue-green and canary are the two most-asked deployment questions in SRE / DevOps interviews.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| CI/CD questions show the YAML / Jenkinsfile / HCL snippet | **Matching** — 23 of 25 have code |
| Secrets questions explicitly show the mechanism (`secrets.GITHUB_TOKEN`, `credentials('my-id')`, `terraform remote state with encryption`) | 3 Qs on secrets — Q3 jenkins-credentials, Q2 github-actions-secrets, Q7 terraform-state-locking — all have code |
| Terraform questions follow: what → HCL example → `terraform plan` output → pitfall | Matching in most Terraform Qs |
| GitHub Actions uses real-world action references (`actions/checkout@v4`, `actions/setup-java@v4`) | Matching |
| Opening bolds the tool or concept (`**GitHub Actions**`, `**Jenkinsfile**`, `**Terraform**`, `**blue-green deployment**`) | **Failing** — 21 of 25 direct answers have zero bold anchors |
| Light analogies used (pipeline = "assembly line", terraform state = "source of truth ledger", secrets = "safe deposit box") | Only 3 of 25 have detected analogies |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | EMPTY DEPLOYMENT-STRATEGIES TOPIC | **MAJOR** | Topic exists but has 0 questions. Blue-green, canary, rolling are core CI/CD interview content |
| S2 | EMPTY ROLLBACK-STRATEGIES TOPIC | **MAJOR** | Topic exists but has 0 questions. DB migration rollback, container rollback, feature-flag-based rollback |
| S3 | TOOL COVERAGE GAP | **MAJOR** | Zero questions on GitLab CI, CircleCI, Azure Pipelines, ArgoCD, Spinnaker, Tekton. Also zero on Helm charts in CI/CD context |
| S4 | TERRAFORM SCOPE QUESTION | **MODERATE** | 10 of 25 Qs (40%) are Terraform. Terraform is IaC, not CI/CD. Either split into dedicated IaC module or rename the module to "CI/CD and IaC" |
| S5 | EMPTY COMPARISONS / SCENARIO | MODERATE | `comparisons`, `scenario-based` topics empty. Only `github-actions-vs-jenkins` is a comparison Q, filed under `jenkins-pipelines` |
| S6 | MODULE-WIDE ZONE 1 | MODERATE | 21 of 25 direct answers have 0 bold anchors |
| S7 | ANALOGY GAP | MINOR | 22 of 25 Qs lack analogies |
| S8 | OVERSIZED SPEAKABLE SMALL Z3 | MINOR | Q1 terraform-core-concepts: 415w speakable but 191w Zone 3 — inverted shape |

---

## Per-question issues — by topic

### `cicd-fundamentals` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** matrix-strategy-multi-version-java-testing | 482w / 2 code / analogy. Well-shaped | MINOR |
| **Q2** trigger-workflows-pull-requests-protect-branches | 604w / 1 code / no analogy | MINOR |

### `jenkins-pipelines` (6 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** declarative-jenkins-pipeline-spring-boot | 586w / 3 code / no analogy | MINOR |
| **Q2** jenkinsfile-structure-declarative | 511w / 1 code / no analogy. Should show full Jenkinsfile with agent/stages/steps/post (only 1 block feels thin) | MINOR |
| **Q3** jenkins-credentials-secrets-management | 572w / 1 code / no analogy | MINOR |
| **Q4** jenkins-sonarqube-integration | 507w / 2 code / no analogy. Cross-overlap with Q6 github-actions `sonarqube-code-quality-github-actions` — both SonarQube integrations | MINOR + OVERLAP |
| **Q5** jenkins-deploy-kubernetes | 659w / 2 code / no analogy | MINOR |
| **Q6** github-actions-vs-jenkins | 618w / **0 code** / no analogy. **Archetype-fail**: this is a comparison Q showing a side-by-side `.github/workflows/build.yml` vs `Jenkinsfile` would be the strongest artifact. Also **misfiled** — should live in `comparisons` topic | **MAJOR** |

### `github-actions` (7 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** java-cicd-pipeline-github-actions | 609w / 3 code / no analogy | MINOR |
| **Q2** manage-secrets-github-actions | 554w / 1 code / no analogy | MINOR |
| **Q3** cache-maven-gradle-dependencies-github-actions | 509w / 3 code / no analogy | MINOR |
| **Q4** deploy-spring-boot-github-actions | 610w / 3 code / no analogy | MINOR |
| **Q5** github-actions-reusable-workflows | 537w / 2 code / no analogy | MINOR |
| **Q6** sonarqube-code-quality-github-actions | 558w / 2 code / no analogy. **Overlaps with Q4 jenkins-sonarqube-integration** | MINOR + OVERLAP |
| **Q7** environment-specific-deployments-github-actions | 713w / 1 code / no analogy | MINOR |

### `infrastructure-as-code` (10 Qs) — Terraform-heavy

| Q | Issue | Severity |
|---|---|---|
| **Q1** terraform-core-concepts-providers-resources-state-modules | 191w Zone 3 / 3 code / no analogy. 4-in-1 overview with **oversized 415w speakable but thin Zone 3** — inverted shape. Should split into 4 Qs or expand Zone 3 | **MODERATE** |
| **Q2** terraform-state-management-remote-state | 418w / **0 code** / analogy. Must show: `backend "s3"` HCL block + state lock DynamoDB | **MAJOR** |
| **Q3** terraform-plan-and-apply-safely | 417w / 1 code / no analogy | MINOR |
| **Q4** what-is-terraform-module-how-to-create-one | 420w / 1 code / no analogy | MINOR |
| **Q5** terraform-variables-and-workspaces | 309w / 2 code / no analogy — **CLEAN** (tight, well-shaped) | CLEAN |
| **Q6** terraform-import-vs-terraform-taint | 256w / 0 code / no analogy — **CLEAN** by auditor. But **terraform taint is deprecated since Terraform 0.15** (replaced by `terraform apply -replace`) — content may be stale. Needs accuracy check | CLEAN-BUT-CHECK |
| **Q7** terraform-state-locking | 465w / 2 code / no analogy. Overlaps with Q2 terraform-state-management (state locking is part of remote state) | MINOR + OVERLAP |
| **Q8** provision-spring-boot-infrastructure-with-terraform | 429w / 1 code / analogy | MINOR |
| **Q9** terraform-data-sources-when-to-use | 456w / 1 code / no analogy | MINOR |
| **Q10** how-to-test-terraform-configurations | 439w / 1 code / no analogy. Should mention Terratest (Go), `terraform validate`, `terraform plan -detailed-exitcode`, `tflint` | MINOR |

### `deployment-strategies` (0 Qs) — **empty topic, MAJOR gap**

### `rollback-strategies` (0 Qs) — **empty topic, MAJOR gap**

### `scenario-based` (0 Qs) — empty

Suggested: `pipeline-failing-intermittently-diagnosis`, `rollback-a-bad-production-deploy`, `ci-builds-taking-too-long-to-run`.

### `comparisons` (0 Qs) — empty

Move candidates: `github-actions-vs-jenkins` (currently in jenkins-pipelines). Add: `terraform-vs-pulumi-vs-cloudformation`, `blue-green-vs-canary-vs-rolling`, `declarative-vs-scripted-jenkins-pipeline`.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **4** | S1 empty deployment-strategies, S2 empty rollback-strategies, S3 tool coverage gap, Q6 jenkins github-actions-vs-jenkins no-code, Q2 terraform-state-management no-code |
| **MODERATE** | **4** | S4 Terraform scope, S5 empty comparisons/scenario, S6 bold, Q1 terraform shape |
| **MINOR** | **17** | Mostly missing analogies + some missing bold anchors |
| **CLEAN** | **2** | Q5 + Q6 terraform (Q6 CLEAN by auditor but content accuracy needs check) |
| **NEEDS ACCURACY FIX** | **1** | Q6 terraform-taint is deprecated in Terraform 0.15+ |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 21
- `zone3_no_analogy` × 22
- `zone3_no_code_examples` × 2

---

## Suggested fix order

1. **Module scope decision FIRST** (S4). Decide whether Terraform content stays or splits into a dedicated IaC module. If splits, decide where Helm/Ansible/CloudFormation live.
2. **Fix Q6 `terraform-import-vs-terraform-taint`** — replace taint with `terraform apply -replace` (deprecation since 0.15). Accuracy issue.
3. **Author `deployment-strategies` topic** — 4–5 Qs on blue-green, canary, rolling, feature flags, DB-migration zero-downtime.
4. **Author `rollback-strategies` topic** — 3–4 Qs on container rollback, DB rollback, feature-flag-based rollback.
5. **Add tool coverage** — at least 1 each on GitLab CI, CircleCI, Azure Pipelines, ArgoCD.
6. **Fix 2 code-missing Qs** — Q6 jenkins-github-actions-vs-jenkins (add YAML + Jenkinsfile side-by-side), Q2 terraform-state-management (add backend s3 HCL).
7. **Move `github-actions-vs-jenkins` to `comparisons` topic** — archetype mismatch with jenkins-pipelines.
8. **Restructure Q1 terraform-core-concepts** — split the 415w speakable into 4 separate Qs OR expand Zone 3 to match speakable depth.
9. **Module-wide bold-anchor pass** — 21 mechanical fixes.
10. **Add analogies** — 5–6 top candidates (state = "ledger", secrets = "vault", pipeline = "assembly line", blue-green = "two kitchens", canary = "tasting before serving").
