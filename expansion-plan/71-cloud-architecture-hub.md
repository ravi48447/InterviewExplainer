# 71 — Cloud Architecture Hub Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** hub feature work + cross-tree content aggregation. Pulls from JBI 17 (devops-cloud-production), PBI 34 (cloud-python), Go 56 (devops-and-cloud), and new cloud-cross-cutting modules introduced here.
> **Depends on:** 17 (JBI cloud), 34 (PBI cloud), 41 (interview-qa-hub pattern), 44 (system-design hub for SD cross-link), 72 (DevOps/SRE hub — order-independent but they share content).

## TL;DR

- **Goal:** A single browsable hub for **cloud architecture** content across AWS, GCP, Azure, plus cloud-agnostic patterns (multi-region, FinOps, well-architected frameworks). One URL for "aws interview questions", "gcp interview questions", "azure interview questions", "solutions architect interview questions", "cloud architect interview questions".
- **Action:** Add `frontend/lib/hubs/cloud-architecture.ts` aggregator, build `/cloud-architecture` index + 6 category pages, scaffold `content/cloud-cross-cutting/` for cloud-agnostic patterns (multi-region, well-architected, FinOps, cost optimisation, landing zones).
- **Output:** `/cloud-architecture` returns 200 with grouped content; ≥ 300 cloud cards across 6 categories; hub URLs in `sitemap.xml`; nav link added.

## Hard prerequisites

- [ ] Playbook 17 (JBI devops-cloud-production) DONE — AWS/GCP/Azure Java content lives there.
- [ ] Playbook 34 (PBI cloud) at least scaffolded — cloud Python content.
- [ ] Playbook 41 (interview-qa-hub rollout) DONE.
- [ ] Playbook 44 (system-design hub) DONE — for "cloud system design" cross-link.
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.cloudArchitecture` (add if missing; default `false`).

## Why this matters

"Cloud architect" and "solutions architect" are the dominant non-coding senior IC roles on AWS / GCP / Azure career pages, and their interview surface (services + well-architected pillars + cost + multi-region + landing zones) is platform-agnostic enough to deserve its own hub rather than living buried inside backend tracks. A dedicated cloud hub captures cert-prep traffic (AWS SAA / SAP, GCP PCA, Azure Solutions Architect Expert) alongside interview prep — two valuable audiences from one tree.

## Background

This hub aggregates from the following content trees:

| Content tree | Cloud focus | Key services covered |
|---|---|---|
| `content/java-backend-intermediate/` (playbook 17) | AWS, GCP, Azure | EC2/Lambda/S3/RDS, GKE/Cloud Run/BigQuery, Azure AKS/Functions/Cosmos DB — Java-flavoured |
| `content/python-backend-intermediate/` (playbook 34) | AWS, GCP, Azure | Same service families — Python-flavoured |
| `content/go-intermediate/` (playbook 56) | AWS, GCP | AWS-Go and GCP-Go service idioms |
| `content/cloud-cross-cutting/` (new, this playbook) | All / agnostic | AWS Well-Architected (5 pillars), GCP Architecture Framework, Azure Well-Architected, FinOps Foundation framework, multi-region patterns, landing zones |

The hub LINKS to language tracks for language-specific cloud content (Spring Cloud AWS, Boto3, GCP Python clients). The cross-cutting tree holds only provider-agnostic architecture patterns and service-comparison topics.

Real anchors: AWS IAM / VPC / S3 / EC2 / Lambda / RDS / EKS / CloudWatch — the core AWS Services for Solutions Architect Associate (SAA-C03, current as of 2024). GCP Cloud Run, BigQuery, GKE. Azure AKS, Azure Functions, Cosmos DB. AWS Well-Architected Framework (2024 revision: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability — 6 pillars). FinOps Foundation Cloud FinOps framework v1.1.

## Search phrases to own

| Search phrase | Target page |
|---|---|
| `aws interview questions` | `/cloud-architecture/aws` |
| `gcp interview questions` | `/cloud-architecture/gcp` |
| `azure interview questions` | `/cloud-architecture/azure` |
| `solutions architect interview questions` | `/cloud-architecture` |
| `aws solutions architect interview` | `/cloud-architecture/aws` (SAA sub-section) |
| `cloud architect interview questions` | `/cloud-architecture` |
| `multi region architecture interview` | `/cloud-architecture/multi-region-and-resilience` |
| `finops interview questions` | `/cloud-architecture/finops-and-cost` |
| `well architected framework interview` | `/cloud-architecture/cloud-agnostic-patterns` |
| `landing zone interview questions` | `/cloud-architecture/cloud-agnostic-patterns` |

## Current state

- AWS / GCP / Azure content exists scattered across JBI 17 (`docker-cloud-production`), PBI 34 (`cloud-python`), and Go (`devops-and-cloud` pillar).
- No cloud-cross-cutting tree (multi-region, FinOps, well-architected, landing zones) today.
- `/cloud-architecture` route does NOT exist today.

## Target state (measurable)

- 7 hub pages return 200 (`/cloud-architecture` + 6 categories below).
- Hub aggregator returns ≥ 300 cloud cards.
- All hub URLs appear in `sitemap.xml`.

## Categories (canonical — 6 frozen at launch)

| Category slug | Pulls from… |
|---|---|
| `aws` | `java-backend-intermediate/aws-*`, `python-backend-intermediate/aws-python`, `go-intermediate/aws-go`, `cloud-cross-cutting/aws-architecting` |
| `gcp` | `java-backend-intermediate/gcp-*`, `python-backend-intermediate/gcp-python`, `cloud-cross-cutting/gcp-architecting` |
| `azure` | `java-backend-intermediate/azure-*`, `python-backend-intermediate/azure-python`, `cloud-cross-cutting/azure-architecting` |
| `cloud-agnostic-patterns` | `cloud-cross-cutting/well-architected-pillars`, `cloud-cross-cutting/landing-zones`, `cloud-cross-cutting/cloud-design-patterns` |
| `multi-region-and-resilience` | `cloud-cross-cutting/multi-region-architecture`, `cloud-cross-cutting/disaster-recovery`, `cloud-cross-cutting/zero-rpo-rto-patterns` |
| `finops-and-cost` | `cloud-cross-cutting/finops-essentials`, `cloud-cross-cutting/cost-optimisation-patterns` |

**These 6 categories are frozen at launch.** Adding a 7th (e.g. `kubernetes-on-cloud`, `data-platforms-on-cloud`) requires its own playbook.

---

## Step 1 — Scaffold the cross-cutting module

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
mkdir -p content/cloud-cross-cutting
cat > content/cloud-cross-cutting/_index.json <<EOF
{
  "level": "cloud-cross-cutting",
  "modules": [],
  "pillar_groups": []
}
EOF

for M in \
  aws-architecting gcp-architecting azure-architecting \
  well-architected-pillars landing-zones cloud-design-patterns \
  multi-region-architecture disaster-recovery zero-rpo-rto-patterns \
  finops-essentials cost-optimisation-patterns; do
  mkdir -p "content/cloud-cross-cutting/$M"
done
```

Target counts per cross-cutting module: ~20-25 cards, ~250 total in the cross-cutting tree.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f content/cloud-cross-cutting/_index.json && echo "OK index" || echo "MISSING index"
for M in aws-architecting gcp-architecting azure-architecting well-architected-pillars landing-zones cloud-design-patterns multi-region-architecture disaster-recovery zero-rpo-rto-patterns finops-essentials cost-optimisation-patterns; do
  test -d "content/cloud-cross-cutting/$M" && echo "OK $M" || echo "MISSING $M"
done
```
Expected: 12 `OK` lines.

---

### Step 2 — Aggregator

`frontend/lib/hubs/cloud-architecture.ts`:

```typescript
export type CloudCategory =
  | 'aws'
  | 'gcp'
  | 'azure'
  | 'cloud-agnostic-patterns'
  | 'multi-region-and-resilience'
  | 'finops-and-cost';

export interface CloudCard {
  id:         string;
  title:      string;
  domain:     string;
  module:     string;
  topic:      string;
  href:       string;
  category:   CloudCategory;
  providers:  ('aws' | 'gcp' | 'azure' | 'agnostic')[];
  certPath?:  ('aws-saa' | 'aws-sap' | 'gcp-pca' | 'azure-saa')[];   // optional cert-prep tag
  difficulty: 'easy' | 'medium' | 'hard';
}

export const CLOUD_CATEGORY_FEEDS: Record<CloudCategory, string[]> = {
  'aws': [
    'java-backend-intermediate/aws-fundamentals',
    'java-backend-intermediate/aws-services-deep',
    'python-backend-intermediate/aws-python',
    'go-intermediate/aws-go',
    'cloud-cross-cutting/aws-architecting',
  ],
  'gcp': [
    'java-backend-intermediate/gcp-fundamentals',
    'java-backend-intermediate/gcp-services-deep',
    'python-backend-intermediate/gcp-python',
    'cloud-cross-cutting/gcp-architecting',
  ],
  'azure': [
    'java-backend-intermediate/azure-fundamentals',
    'java-backend-intermediate/azure-services-deep',
    'python-backend-intermediate/azure-python',
    'cloud-cross-cutting/azure-architecting',
  ],
  'cloud-agnostic-patterns': [
    'cloud-cross-cutting/well-architected-pillars',
    'cloud-cross-cutting/landing-zones',
    'cloud-cross-cutting/cloud-design-patterns',
  ],
  'multi-region-and-resilience': [
    'cloud-cross-cutting/multi-region-architecture',
    'cloud-cross-cutting/disaster-recovery',
    'cloud-cross-cutting/zero-rpo-rto-patterns',
  ],
  'finops-and-cost': [
    'cloud-cross-cutting/finops-essentials',
    'cloud-cross-cutting/cost-optimisation-patterns',
  ],
};
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/hubs/cloud-architecture.ts && echo "OK aggregator" || echo "MISSING aggregator"
grep -c 'CLOUD_CATEGORY_FEEDS' frontend/lib/hubs/cloud-architecture.ts
```
Expected: `OK aggregator`; count ≥ 1.

---

### Step 3 — Pages

- `/cloud-architecture` — index of 6 categories with card counts + provider-mix histogram.
- `/cloud-architecture/<category>` — filterable card list; provider pill badges (AWS / GCP / Azure / agnostic); optional cert-path filter.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for F in \
  frontend/app/cloud-architecture/page.tsx \
  "frontend/app/cloud-architecture/[category]/page.tsx" \
  frontend/components/CloudCard.tsx; do
  test -f "$F" && echo "OK $F" || echo "MISSING $F"
done
```

---

### Step 4 — Category intros (250 words each)

Same template as playbook 44 step 3. AWS / GCP / Azure intros each name the cert paths covered (SAA-C03, SAP-C02, GCP PCA, Azure Solutions Architect Expert AZ-305) and the recommended study order. The `cloud-agnostic-patterns` intro leads with the decision rule: "Use the AWS Well-Architected Framework when your workload runs on AWS; use the GCP Architecture Framework on GCP; use the Azure Well-Architected Framework on Azure. All three share the same 5-6 pillars (Operational Excellence, Security, Reliability, Performance, Cost, Sustainability) but differ in service-specific implementation."

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for SLUG in aws gcp azure cloud-agnostic-patterns multi-region-and-resilience finops-and-cost; do
  INTRO="content/cloud-cross-cutting/${SLUG}-intro.md"
  [ -f "$INTRO" ] && WC=$(wc -w < "$INTRO") || WC=0
  [ "$WC" -ge 200 ] && echo "OK $SLUG ($WC)" || echo "SHORT $SLUG ($WC)"
done
```
Expected: 6 `OK` lines.

---

### Step 5 — Flip flag

```typescript
ENABLED_HUBS: {
  ...,
  cloudArchitecture: true,
}
```

Commit: `launch: enable cloudArchitecture hub`.

**Verify:**
```bash
grep -c 'cloudArchitecture: *true' \
  /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend/lib/launch-config.ts
```
Expected: ≥ 1.

---

### Step 6 — Smoke

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm run build 2>&1 | tail -20

npm run dev &
DEV_PID=$!
sleep 5

for url in \
  /cloud-architecture \
  /cloud-architecture/aws \
  /cloud-architecture/gcp \
  /cloud-architecture/azure \
  /cloud-architecture/cloud-agnostic-patterns \
  /cloud-architecture/multi-region-and-resilience \
  /cloud-architecture/finops-and-cost; do
  printf "%-50s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

Expected: all `200`.

---

## Files and code to touch

| Path | Change |
|---|---|
| `frontend/lib/launch-config.ts` | add `cloudArchitecture` flag |
| `frontend/lib/hubs/cloud-architecture.ts` | NEW — aggregator |
| `frontend/app/cloud-architecture/page.tsx` | NEW — index |
| `frontend/app/cloud-architecture/[category]/page.tsx` | NEW — category page |
| `frontend/components/CloudCard.tsx` | NEW — card with provider + cert tags |
| `frontend/components/site-header.tsx` | add Cloud Architecture nav link |
| `scripts/build_sitemap.py` | enumerate 7 cloud hub URLs |
| `content/cloud-cross-cutting/` | NEW directory + 11 modules |

## Content rules

- Hub LINKS, never duplicates JBI / PBI / Go cloud content.
- Cross-cutting tree holds only provider-agnostic patterns; provider-specific service deep-dives stay in the language tracks.
- Cards carry provider badges; a card may have multiple providers if the topic explicitly compares (e.g. "S3 vs GCS vs Blob Storage" → `["aws", "gcp", "azure"]`).
- Cert-path tags are optional but recommended for AWS SAA / SAP / GCP PCA / Azure AZ-305; they enable cert-track filtering on category pages.
- The #1 trap is routing Kubernetes (EKS, GKE, AKS) content into the cloud provider categories — tool-level container orchestration belongs in the DevOps/SRE hub (playbook 72), not here. Cloud provider categories should contain service-comparison and architecture topics, not plain K8s operational content.
- The 6 categories are **frozen** at launch — adding a 7th requires its own playbook.

## SEO and URLs

- Canonical: `/cloud-architecture`, `/cloud-architecture/<category>`.
- JSON-LD: `BreadcrumbList` + `CollectionPage` per category; AWS / GCP / Azure category pages additionally emit a `Course` JSON-LD object listing the cert-prep coverage.
- Title format: `<Provider> Interview Questions — Cloud Architecture Hub | InterviewExplainer` for provider categories; `<Pattern> Interview Questions — Cloud Architecture Hub | InterviewExplainer` for pattern categories.

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| 7 hub pages return 200 | 7 of 7 | `for url in /cloud-architecture /cloud-architecture/aws /cloud-architecture/gcp /cloud-architecture/azure /cloud-architecture/cloud-agnostic-patterns /cloud-architecture/multi-region-and-resilience /cloud-architecture/finops-and-cost; do curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url"; done` |
| Hub aggregator returns ≥ 300 cards | ≥ 300 | `console.log(listCards().length)` in aggregator; `npm run build` |
| AWS category ≥ 100 cards | ≥ 100 | `console.log(listCards('aws').length)` |
| GCP + Azure each ≥ 50 cards | ≥ 50 | `console.log(listCards('gcp').length)` and `listCards('azure').length` |
| Each category intro ≥ 200 words | 6 of 6 | `for F in content/cloud-cross-cutting/*-intro.md; do wc -w < "$F"; done` all ≥ 200 |
| Provider badge present on every card | 100 % | `rg 'providers=\{' frontend/components/CloudCard.tsx` ≥ 1 |
| Sitemap includes 7 cloud hub URLs | 7 | `grep -c '/cloud-architecture' frontend/public/sitemap.xml` ≥ 7 |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Existing JBI cloud + PBI cloud + Go cloud pages: zero regression | manual | open one of each |
| Site-header has Cloud Architecture link | grep | `grep -c 'href="/cloud-architecture"' frontend/components/site-header.tsx` ≥ 1 |
| Cross-link from `/cloud-architecture` to `/system-design/fundamentals` present | grep | `grep -c '/system-design/fundamentals' frontend/app/cloud-architecture/page.tsx` ≥ 1 |

## Failure modes & rollback

- **AWS card count < 100**: JBI/PBI AWS content gap — do not flip flag for AWS sub-page. Generate more before launch.
- **GCP/Azure thin**: acceptable to launch the hub but mark thin categories with a "more coming" banner.
- **Cert-path tags inconsistent**: aggregator-side validation — every card tagged `aws-saa` must have its href under an AWS feed. Validate on build.
- **Multi-provider topics double-counted**: aggregator should pin each card to a single category by the **primary** provider (the one in the topic title); cross-provider comparison topics live in `cloud-agnostic-patterns`.
- **FinOps section too thin**: acceptable to launch with a "coming soon" notice; track as follow-up.
- **Rollback:** `ENABLED_HUBS.cloudArchitecture = false`.

## Definition of Done

- [ ] `grep -c 'cloudArchitecture: *true' frontend/lib/launch-config.ts` ≥ 1
- [ ] `for url in /cloud-architecture /cloud-architecture/aws /cloud-architecture/gcp /cloud-architecture/azure /cloud-architecture/cloud-agnostic-patterns /cloud-architecture/multi-region-and-resilience /cloud-architecture/finops-and-cost; do curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url"; done` — all 200
- [ ] `console.log(listCards().length)` ≥ 300
- [ ] `console.log(listCards('aws').length)` ≥ 100
- [ ] `console.log(listCards('gcp').length)` ≥ 50 and `listCards('azure').length` ≥ 50
- [ ] `for F in content/cloud-cross-cutting/*-intro.md; do wc -w < "$F"; done` — all ≥ 200
- [ ] `grep -c '/cloud-architecture' frontend/public/sitemap.xml` ≥ 7
- [ ] `grep -c 'href="/cloud-architecture"' frontend/components/site-header.tsx` ≥ 1
- [ ] `cd frontend && npm run build; echo $?` — exits 0
- [ ] `grep -c '/system-design/fundamentals' frontend/app/cloud-architecture/page.tsx` ≥ 1

## Estimated effort

- **Ideal:** 22 hours (3h scaffold + 9h cross-cutting content + 7h hub UI + 3h intros + smoke).
- **Hard stop:** 45 hours.
- **Recommended split:** 3 agent sessions:
  1. Steps 1-2 (scaffold cross-cutting + aggregator).
  2. Steps 3-4 (pages + intros + seed cross-cutting to ≥ 150 cards).
  3. Steps 5-6 (flag + smoke + commits + INDEX).