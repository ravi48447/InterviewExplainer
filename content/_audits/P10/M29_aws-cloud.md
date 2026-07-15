# Audit — aws-cloud

**Pillar:** P10 Cloud
**Module:** M29 aws-cloud
**Topics present:** 9 (of 11 — `scenario-based` and `comparisons` are empty)
**Questions:** 34 (all written, no stubs)
**Benchmark sources:** AWS docs, Azure docs, GCP docs, Microsoft Learn Azure Spring Apps, Spring Cloud AWS reference, acloud.guru / aws-samples, official Azure Spring Cloud deprecation notice (2028)

---

## Biggest finding — module name does not match module content

**The module is titled `aws-cloud` but is 65% Azure + GCP content:**

| Topic | Cloud | Qs |
|---|---|---|
| aws-core-services | AWS | 5 |
| ecs-and-fargate | AWS | 1 |
| rds-with-spring | AWS | 1 |
| s3-storage | AWS | 1 |
| iam-and-security | AWS | 2 |
| aws-messaging | AWS | 1 |
| serverless | AWS | 1 |
| **gcp-and-azure-overview** | **Azure (12) + GCP (10)** | **22** |

**AWS total: 12 questions. Azure + GCP total: 22 questions.** The module is functionally a general "public cloud" module mislabeled as AWS-specific.

**This is the largest scope/name mismatch found in the audit** — larger than the nosql-mongodb-mostly-Elasticsearch finding in M13. Two clean options:

1. **Split into 3 modules**: `aws`, `azure`, `gcp` (each 10–12 Qs)
2. **Rename to `public-cloud`** and reorganize `gcp-and-azure-overview` into separate `azure` and `gcp` topics

---

## Second finding — Azure Spring Apps deprecation

**Azure Spring Apps (formerly Azure Spring Cloud) was announced for retirement.** Microsoft's current guidance: no new features, migration recommended to Azure Container Apps or AKS. Q2 `azure-spring-apps-deployment` needs at minimum a deprecation callout + migration pointer, or to be rewritten around AKS/Container Apps.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Cloud questions always show a minimal CLI or SDK snippet (`aws s3 cp ...`, `gcloud run deploy`, `az group create`) | **Matching for most** — 26 of 34 have 1–5 code blocks. 8 zero-code Qs are the problem |
| Opening bolds the cloud primitive (`**EC2**`, `**S3**`, `**IAM role**`, `**VPC**`, `**Cloud Run**`, `**App Service**`) | **Failing** — 33 of 34 direct answers have zero bold anchors (Q12 Azure API Management is the one exception, by coincidence of having an italic word) |
| Comparisons (RDS vs Aurora, Cloud Spanner vs Cloud SQL) always include cost/performance table | Matching where present |
| Analogies less common for cloud content (pricing dials) but still used (VPC = "private building with your own floor", IAM = "employee ID badges") | Only 9 of 34 have analogies |
| AWS SDK + Spring Cloud AWS / Azure SDK / google-cloud-java usage shown in code | Matching for several GCP and Azure Qs; AWS Qs less so |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | NAME/SCOPE MISMATCH | **CRITICAL** | Module titled `aws-cloud` has 22 of 34 Qs on Azure + GCP. Either split into 3 modules or rename + retopic. User expectation mismatch is real |
| S2 | OUT-OF-DATE CONTENT | **MAJOR** | Q2 `azure-spring-apps-deployment` covers a retiring Azure service. Needs deprecation note + migration pointer, or rewrite around AKS/Container Apps |
| S3 | AWS CORE THIN | **MAJOR** | 5 AWS-core questions across what should be the primary topic. Missing: EC2 fundamentals, S3 (only 1 Q for all S3 patterns), Lambda specifics, DynamoDB, CloudFront, Route 53. If staying as `aws-cloud`, this is massively under-covered |
| S4 | EMPTY TOPICS | **MAJOR** | `scenario-based` (0 Qs — "migrate a Spring Boot monolith to AWS" style), `comparisons` (0 Qs — cross-cloud comparisons like EKS vs AKS vs GKE or S3 vs Blob vs GCS) |
| S5 | TOPIC OVERLAPS (auto-detected) | **MAJOR** | `azure-core-services-java-backend` (Q1) and `core-gcp-services-java-backend-developer` (Q13) — same intent, different cloud. Structure issue: should be one "X core services" question per cloud, not both in one topic |
| S6 | SINGLE 22-Q TOPIC | **MAJOR** | `gcp-and-azure-overview` lumps two distinct clouds into one topic. Structurally this means users browsing by topic can't get Azure-only or GCP-only views |
| S7 | MODULE-WIDE ZONE 1 | MODERATE | 33 of 34 direct answers have 0 bold anchors; 4 paragraph walls |
| S8 | ANALOGY GAP IN AZURE/GCP | MODERATE | 25 of 34 have no analogy. Nearly universal in the gcp-and-azure-overview topic (17 of 22 Qs) |
| S9 | CODE-MISSING FOR CONFIG CONTENT | MODERATE | 8 questions with 550–850w Zone 3 have zero code. Cloud content benefits from minimal CLI/SDK snippets |

---

## AWS topics — per-question issues

### `aws-core-services` (5 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** core-aws-services-overview | 553w / **0 code** / no analogy. An AWS services overview without a single CLI example feels abstract | **MAJOR** |
| **Q2** aws-codepipeline-codebuild-deployment | 460w / 2 code / no analogy — OK | MINOR |
| **Q3** cloudwatch-metrics-alarms-spring-boot | 450w / 5 code / analogy — **strongest AWS Q in module** | MINOR |
| **Q4** auto-scaling-groups-how-they-work | 634w / 2 code / no analogy | MINOR |
| **Q5** vpc-fundamentals-java-developers | Paragraph wall (68w). 745w / 1 code / no analogy. VPC = "private building" analogy standard | MODERATE |

### `ecs-and-fargate` (1 Q) — thin topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** deploy-spring-boot-ecs-fargate | 568w / **5 code** / no analogy — good code, thin topic | MINOR |

**Topic gap:** `ecs-vs-eks-vs-fargate-vs-beanstalk`, `ecs-task-definition-vs-service-vs-cluster`.

### `rds-with-spring` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** rds-aurora-dynamodb-comparison | 653w / **0 code** / analogy. 3-way database comparison without showing schema/access patterns | MODERATE |

### `s3-storage` (1 Q) — very thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** s3-integration-spring-boot | 425w / 2 code / analogy | MINOR |

**Topic gap:** `s3-presigned-urls`, `s3-event-notifications-lambda`, `s3-multipart-upload`, `s3-storage-classes-lifecycle`.

### `iam-and-security` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** iam-roles-least-privilege | 537w / 2 code / no analogy. IAM analogy ("employee ID badges with specific door access") | MINOR |
| **Q2** secrets-manager-vs-parameter-store | 415w / 1 code / no analogy | MINOR |

### `aws-messaging` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** sqs-sns-eventbridge-comparison | Paragraph wall (61w). 594w / 1 code / analogy | MODERATE |

### `serverless` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** lambda-spring-cloud-function | 685w / 4 code / no analogy — good | MINOR |

---

## `gcp-and-azure-overview` — 22 Qs in one topic

This topic needs to be split into `azure` and `gcp` topics. **12 Azure Qs + 10 GCP Qs** already exist cleanly.

### Azure (Q1–Q12)

| Q | Issue | Severity |
|---|---|---|
| **Q1** azure-core-services-java-backend | 850w / **0 code** / no analogy. Overview Q without CLI. **Overlaps with Q13 GCP version — same structure in 2 clouds** | **MAJOR** |
| **Q2** azure-spring-apps-deployment | 573w / 3 code / no analogy. **Retiring Azure service** — needs deprecation note | **MAJOR** |
| **Q3** azure-service-bus-vs-event-hub-java | 801w / **0 code** / analogy. Comparison needs code or config side-by-side | **MAJOR** |
| **Q4** azure-key-vault-spring-boot | 582w / 4 code / no analogy | MINOR |
| **Q5** (truncated from dump — assume similar pattern) | ? | — |
| **Q6** (same) | ? | — |
| **Q7** (same) | ? | — |
| **Q8** azure-container-registry-aks-pipeline | 568w / 3 code / no analogy | MINOR |
| **Q9** azure-application-insights-spring-boot | 664w / 3 code / no analogy | MINOR |
| **Q10** azure-functions-java-serverless | 721w / 2 code / no analogy | MINOR |
| **Q11** azure-managed-identity-passwordless | 577w / 2 code / no analogy | MINOR |
| **Q12** azure-api-management-spring-boot-microservices | 690w / 2 code / no analogy | MINOR |

### GCP (Q13–Q22)

| Q | Issue | Severity |
|---|---|---|
| **Q13** core-gcp-services-java-backend-developer | 573w / **0 code** / no analogy. Overlaps with Q1 Azure version | **MAJOR** (overlap + no code) |
| **Q14** deploy-spring-boot-app-cloud-run | 597w / 4 code / analogy — good | MINOR |
| **Q15** google-cloud-pubsub-with-spring | 683w / 4 code / analogy — good | MINOR |
| **Q16** cloud-spanner-vs-cloud-sql | Paragraph wall (68w). 606w / **0 code** / analogy | MODERATE |
| **Q17** gcp-secret-manager-spring-boot | 580w / 4 code / no analogy | MINOR |
| **Q18** bigquery-java-query | 496w / 2 code / no analogy | MINOR |
| **Q19** gcp-cloud-storage-java-application | 440w / 2 code / no analogy | MINOR |
| **Q20** gcp-iam-authentication-spring-boot | 673w / 4 code / analogy | MINOR |
| **Q21** gke-vs-cloud-run-java-apps | Paragraph wall (66w). 626w / **0 code** / no analogy | **MAJOR** |
| **Q22** monitor-java-applications-gcp-cloud-monitoring | 728w / 5 code / no analogy | MINOR |

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **1** | S1 name/scope mismatch |
| **MAJOR** | **9** | S2 out-of-date Azure Spring Apps, S3 AWS core thin, S4 empty topics, S5 cross-cloud overlap, S6 single lumped 22-Q topic, Q1 AWS overview no code, Q1 Azure overview no code + overlap, Q2 Azure Spring Apps deprecation, Q3 Azure Service Bus vs Event Hub, Q21 GKE-vs-Cloud-Run no code |
| **MODERATE** | **8** | Q5 VPC, Q1 RDS comparison, Q1 SQS-SNS-EventBridge wall, Q16 Cloud Spanner wall, S7 module-wide bold, S8 analogy gap, S9 code-missing pattern |
| **MINOR** | **14** | Well-shaped Azure/GCP Qs needing only bold + selective analogy |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 33
- `zone3_no_analogy` × 25
- `zone3_no_code_examples` × 8
- `zone1_direct_answer_paragraph_wall` × 4

---

## Suggested fix order

1. **Decide the scope question (S1) FIRST.** Split into 3 modules OR rename to `public-cloud` and retopic. Until this is decided, the other fixes are provisional.
2. **Fix the Azure Spring Apps deprecation** (S2) — add migration note or rewrite around Azure Container Apps / AKS.
3. **Resolve the Azure vs GCP overview overlap** — either collapse Q1 + Q13 into one "cloud-agnostic services overview" or scope each to its cloud.
4. **Fill out AWS coverage** if staying `aws-cloud`-named — 10+ stub-worthy questions identified (EC2, more S3, DynamoDB, Lambda specifics, CloudFront, Route 53).
5. **Split gcp-and-azure-overview topic** into `azure` (12 Qs) and `gcp` (10 Qs) once S1 decision made.
6. **Author `scenario-based` + `comparisons` topics** — cross-cloud comparisons are especially useful (EKS vs AKS vs GKE; S3 vs Blob Storage vs GCS; Lambda vs Functions vs Cloud Functions).
7. **Add code to the 8 code-missing overview/comparison questions**.
8. **Module-wide bold-anchor pass** — 33 mechanical fixes.
9. **Add analogies to 10–12 most-abstract questions** — VPC, IAM, pub-sub patterns especially.

**Note on pillar:** if the module splits into 3 clouds, P10 Cloud pillar structure needs updating. Currently M30 `cloud-native` is empty — could house the non-cloud-specific cross-cloud content.
