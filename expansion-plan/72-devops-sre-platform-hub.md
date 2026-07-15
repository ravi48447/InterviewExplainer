# 72 — DevOps / SRE / Platform Engineering Hub Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** hub feature work + cross-tree content aggregation. Pulls from JBI 17 (devops-cloud-production), PBI 34 (devops-python), Go 56 (devops-and-cloud), and new platform-engineering-cross-cutting modules.
> **Depends on:** 17 (JBI devops), 34 (PBI devops), 41 (interview-qa-hub pattern), 71 (Cloud hub — for tool-vs-cloud overlap rules).

## TL;DR

- **Goal:** A single browsable hub for **DevOps + SRE + Platform Engineering** content — Docker, Kubernetes, Terraform / Pulumi / OpenTofu, CI/CD (GitHub Actions, GitLab CI, Jenkins, Argo CD), observability (OpenTelemetry, Prometheus, Grafana, Datadog), SRE practice (SLO/SLI, error budgets, blameless postmortems), platform-eng (Backstage, golden paths, internal developer platforms). One URL for "devops interview questions", "sre interview questions", "kubernetes interview questions", "terraform interview questions", "platform engineering interview questions".
- **Action:** Add `frontend/lib/hubs/devops-sre.ts` aggregator, build `/devops-sre` index + 7 category pages, scaffold `content/platform-engineering-cross-cutting/` (IDPs, golden paths, dev-portal patterns, SRE practice, on-call runbook patterns).
- **Output:** `/devops-sre` returns 200 with grouped content; ≥ 350 cards across 7 categories; hub URLs in `sitemap.xml`; nav link added.

## Hard prerequisites

- [ ] Playbook 17 (JBI devops-cloud-production) DONE — Docker/K8s/Terraform Java content.
- [ ] Playbook 34 (PBI devops) at least scaffolded.
- [ ] Playbook 41 (interview-qa-hub rollout) DONE.
- [ ] Playbook 71 (Cloud hub) DONE — establishes the AWS/GCP/Azure split so DevOps hub doesn't double-count cloud-only content.
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.devopsSre` (add if missing; default `false`).

## Why this matters

"DevOps engineer", "SRE", and "platform engineer" are three distinct senior IC career paths in 2026 with overlapping but distinct interview vocabularies, and most prep sites treat them as one bucket. A hub that **separates** them — DevOps = CI/CD + IaC + container ops; SRE = SLOs + reliability + observability + incident response; Platform = IDPs + golden paths + dev portals — lets the platform serve each audience at the right depth.

## Background

This hub aggregates from the following content trees:

| Content tree | Role | Key tools covered |
|---|---|---|
| `content/java-backend-intermediate/` (playbook 17) | DevOps / Containers | Docker, Kubernetes, Terraform, GitHub Actions, Jenkins, OpenTelemetry Java, Prometheus |
| `content/python-backend-intermediate/` (playbook 34) | DevOps | Docker-Python, K8s-Python, CI/CD Python workflows |
| `content/go-intermediate/` (playbook 56) | DevOps / Observability | Docker-Go, OpenTelemetry-Go |
| `content/platform-engineering-cross-cutting/` (new) | SRE + Platform | SRE essentials (SLO/SLI/error budget), incident & postmortem, IaC patterns, observability design, IDP essentials, Backstage, golden paths, chaos engineering |

The hub separates cloud-provider-specific content from tool-level content. Tool-level container orchestration (EKS/GKE/AKS operations) belongs here; provider-specific service trade-offs belong in the Cloud Architecture hub (playbook 71).

Real anchors: Kubernetes 1.30 (latest stable as of mid-2024), Terraform 1.9, OpenTofu 1.7 (open-source fork), GitHub Actions (current runner images: ubuntu-22.04), Argo CD 2.11, OpenTelemetry SDK 1.x (stable signal: traces + metrics; logs GA in 1.0), Prometheus 2.53, Grafana 11, Backstage 1.27, Google SRE Book (O'Reilly, 2016 — still the canonical SRE reference for interview vocabulary). Team Topologies (Skelton & Pais, 2019) defines the platform team / stream-aligned team language.

## Search phrases to own

| Search phrase | Target page |
|---|---|
| `devops interview questions` | `/devops-sre` |
| `senior devops interview questions` | `/devops-sre` |
| `sre interview questions` | `/devops-sre/sre-practice` |
| `kubernetes interview questions` | `/devops-sre/kubernetes` |
| `kubernetes administrator interview` | `/devops-sre/kubernetes` (CKA sub-section) |
| `docker interview questions` | `/devops-sre/containers-and-docker` |
| `terraform interview questions` | `/devops-sre/iac-terraform-pulumi` |
| `pulumi interview questions` | `/devops-sre/iac-terraform-pulumi` |
| `ci cd interview questions` | `/devops-sre/ci-cd` |
| `github actions interview questions` | `/devops-sre/ci-cd` (GH Actions sub-section) |
| `observability interview questions` | `/devops-sre/observability` |
| `opentelemetry interview questions` | `/devops-sre/observability` (OTel sub-section) |
| `platform engineering interview questions` | `/devops-sre/platform-engineering` |
| `backstage interview questions` | `/devops-sre/platform-engineering` |
| `slo sli error budget interview` | `/devops-sre/sre-practice` |

## Current state

- JBI devops-cloud-production has Docker/K8s/Terraform/observability Java content.
- PBI devops has Python-flavoured devops content.
- No SRE-practice or platform-engineering-cross-cutting trees today.
- `/devops-sre` route does NOT exist today.

## Target state (measurable)

- 8 hub pages return 200 (`/devops-sre` + 7 categories below).
- Hub aggregator returns ≥ 350 cards.
- All hub URLs appear in `sitemap.xml`.

## Categories (canonical — 7 frozen at launch)

| Category slug | Pulls from… |
|---|---|
| `containers-and-docker` | `java-backend-intermediate/docker-*`, `python-backend-intermediate/docker-python`, `go-intermediate/docker-go` |
| `kubernetes` | `java-backend-intermediate/kubernetes-*`, `python-backend-intermediate/kubernetes-python`, `platform-engineering-cross-cutting/k8s-architecture-patterns` |
| `iac-terraform-pulumi` | `java-backend-intermediate/terraform-*`, `platform-engineering-cross-cutting/iac-patterns` |
| `ci-cd` | `java-backend-intermediate/ci-cd-*`, `python-backend-intermediate/ci-cd-python`, `platform-engineering-cross-cutting/cd-patterns` |
| `observability` | `java-backend-intermediate/observability-otel`, `python-backend-intermediate/observability-python`, `go-intermediate/observability-otel-go`, `platform-engineering-cross-cutting/observability-design` |
| `sre-practice` | `platform-engineering-cross-cutting/sre-essentials`, `platform-engineering-cross-cutting/incident-and-postmortem`, `platform-engineering-cross-cutting/error-budgets` |
| `platform-engineering` | `platform-engineering-cross-cutting/idp-essentials`, `platform-engineering-cross-cutting/golden-paths`, `platform-engineering-cross-cutting/backstage-and-dev-portals` |

**These 7 categories are frozen at launch.** Adding an 8th (e.g. `security-devsecops`, `database-ops`) requires its own playbook (note: SecOps lives in playbook 73; DB ops lives in playbook 75).

---

## Step 1 — Scaffold the cross-cutting module

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
mkdir -p content/platform-engineering-cross-cutting
cat > content/platform-engineering-cross-cutting/_index.json <<EOF
{
  "level": "platform-engineering-cross-cutting",
  "modules": [],
  "pillar_groups": []
}
EOF

for M in \
  k8s-architecture-patterns iac-patterns cd-patterns observability-design \
  sre-essentials incident-and-postmortem error-budgets \
  idp-essentials golden-paths backstage-and-dev-portals \
  on-call-runbooks chaos-and-game-days; do
  mkdir -p "content/platform-engineering-cross-cutting/$M"
done
```

Target counts per module: ~20-25 cards, ~270 total in the cross-cutting tree.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f content/platform-engineering-cross-cutting/_index.json && echo "OK index" || echo "MISSING index"
for M in k8s-architecture-patterns iac-patterns cd-patterns observability-design sre-essentials incident-and-postmortem error-budgets idp-essentials golden-paths backstage-and-dev-portals on-call-runbooks chaos-and-game-days; do
  test -d "content/platform-engineering-cross-cutting/$M" && echo "OK $M" || echo "MISSING $M"
done
```
Expected: 13 `OK` lines.

---

### Step 2 — Aggregator

`frontend/lib/hubs/devops-sre.ts`:

```typescript
export type DevOpsCategory =
  | 'containers-and-docker'
  | 'kubernetes'
  | 'iac-terraform-pulumi'
  | 'ci-cd'
  | 'observability'
  | 'sre-practice'
  | 'platform-engineering';

export interface DevOpsCard {
  id:        string;
  title:     string;
  domain:    string;
  module:    string;
  topic:     string;
  href:      string;
  category:  DevOpsCategory;
  toolTags:  string[];   // e.g. ["kubernetes", "argocd", "terraform"]
  difficulty:'easy' | 'medium' | 'hard';
  roleTags:  ('devops' | 'sre' | 'platform')[];
}

export const DEVOPS_CATEGORY_FEEDS: Record<DevOpsCategory, string[]> = {
  'containers-and-docker': [
    'java-backend-intermediate/docker-fundamentals',
    'java-backend-intermediate/docker-deep',
    'python-backend-intermediate/docker-python',
    'go-intermediate/docker-go',
  ],
  'kubernetes': [
    'java-backend-intermediate/kubernetes-fundamentals',
    'java-backend-intermediate/kubernetes-deep',
    'python-backend-intermediate/kubernetes-python',
    'platform-engineering-cross-cutting/k8s-architecture-patterns',
  ],
  'iac-terraform-pulumi': [
    'java-backend-intermediate/terraform-fundamentals',
    'java-backend-intermediate/terraform-deep',
    'platform-engineering-cross-cutting/iac-patterns',
  ],
  'ci-cd': [
    'java-backend-intermediate/ci-cd-fundamentals',
    'java-backend-intermediate/ci-cd-github-actions',
    'java-backend-intermediate/ci-cd-jenkins',
    'python-backend-intermediate/ci-cd-python',
    'platform-engineering-cross-cutting/cd-patterns',
  ],
  'observability': [
    'java-backend-intermediate/observability-otel',
    'java-backend-intermediate/observability-prometheus-grafana',
    'python-backend-intermediate/observability-python',
    'go-intermediate/observability-otel-go',
    'platform-engineering-cross-cutting/observability-design',
  ],
  'sre-practice': [
    'platform-engineering-cross-cutting/sre-essentials',
    'platform-engineering-cross-cutting/incident-and-postmortem',
    'platform-engineering-cross-cutting/error-budgets',
    'platform-engineering-cross-cutting/on-call-runbooks',
    'platform-engineering-cross-cutting/chaos-and-game-days',
  ],
  'platform-engineering': [
    'platform-engineering-cross-cutting/idp-essentials',
    'platform-engineering-cross-cutting/golden-paths',
    'platform-engineering-cross-cutting/backstage-and-dev-portals',
  ],
};
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/hubs/devops-sre.ts && echo "OK aggregator" || echo "MISSING aggregator"
grep -c 'DEVOPS_CATEGORY_FEEDS' frontend/lib/hubs/devops-sre.ts
```
Expected: `OK aggregator`; count ≥ 1.

---

### Step 3 — Pages

- `/devops-sre` — index of 7 categories with card counts + role-mix histogram (DevOps / SRE / Platform).
- `/devops-sre/<category>` — filterable list; tool-pill + role-pill badges.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for F in \
  frontend/app/devops-sre/page.tsx \
  "frontend/app/devops-sre/[category]/page.tsx" \
  frontend/components/DevOpsCard.tsx; do
  test -f "$F" && echo "OK $F" || echo "MISSING $F"
done
```

---

### Step 4 — Category intros (250 words each)

Same template as playbook 44 step 3. Each intro names the canonical reference and recommended cert path:

- **SRE category**: cites the Google SRE Book (O'Reilly, 2016) for vocabulary (SLO, SLI, error budget, toil, blameless postmortem); cites the SRE Workbook (O'Reilly, 2018) for implementation patterns.
- **Platform Engineering category**: cites Team Topologies (Skelton & Pais, 2019) for team topology vocabulary (platform team, stream-aligned team, enabling team); cites Backstage 1.27 as the reference IDP implementation.
- **Observability category**: leads with "Use OpenTelemetry as the data layer (traces, metrics, logs) regardless of backend; use Prometheus/Grafana or Datadog as the backend. The #1 trap is coupling instrumentation code to a specific backend — OTel's vendor-neutral SDK prevents this."
- **Kubernetes category**: notes CKA (Certified Kubernetes Administrator) and CKAD (Certified Kubernetes Application Developer) cert coverage at Kubernetes 1.30.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for SLUG in containers-and-docker kubernetes iac-terraform-pulumi ci-cd observability sre-practice platform-engineering; do
  INTRO="content/platform-engineering-cross-cutting/${SLUG}-intro.md"
  [ -f "$INTRO" ] && WC=$(wc -w < "$INTRO") || WC=0
  [ "$WC" -ge 200 ] && echo "OK $SLUG ($WC)" || echo "SHORT $SLUG ($WC)"
done
```

---

### Step 5 — Flip flag

```typescript
ENABLED_HUBS: {
  ...,
  devopsSre: true,
}
```

Commit: `launch: enable devopsSre hub`.

**Verify:**
```bash
grep -c 'devopsSre: *true' \
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
  /devops-sre \
  /devops-sre/containers-and-docker \
  /devops-sre/kubernetes \
  /devops-sre/iac-terraform-pulumi \
  /devops-sre/ci-cd \
  /devops-sre/observability \
  /devops-sre/sre-practice \
  /devops-sre/platform-engineering; do
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
| `frontend/lib/launch-config.ts` | add `devopsSre` flag |
| `frontend/lib/hubs/devops-sre.ts` | NEW — aggregator |
| `frontend/app/devops-sre/page.tsx` | NEW — index |
| `frontend/app/devops-sre/[category]/page.tsx` | NEW — category page |
| `frontend/components/DevOpsCard.tsx` | NEW — card with tool + role badges |
| `frontend/components/site-header.tsx` | add DevOps & SRE nav link |
| `scripts/build_sitemap.py` | enumerate 8 DevOps hub URLs |
| `content/platform-engineering-cross-cutting/` | NEW directory + 12 modules |

## Content rules

- Hub LINKS, never duplicates JBI / PBI / Go devops content.
- Cross-cutting tree holds only role-/practice-shaped content (SRE essentials, IDP design, runbook patterns). Tool-specific deep-dives stay in the language tracks.
- Each card carries role tags (`devops`/`sre`/`platform`) — a card can have multiple if the topic spans roles (e.g. "Designing SLOs in Backstage" → `["sre", "platform"]`).
- Cards in `kubernetes`/`docker`/`iac-terraform-pulumi` must NOT also appear in `/cloud-architecture` provider categories — those are cloud-provider-specific service deep-dives; tool-level content belongs here. Validate at aggregator build time.
- The 7 categories are **frozen** — adding an 8th requires its own playbook.

## SEO and URLs

- Canonical: `/devops-sre`, `/devops-sre/<category>`.
- JSON-LD: `BreadcrumbList` + `CollectionPage` per category.
- Title format: `<Topic> Interview Questions — DevOps & SRE Hub | InterviewExplainer`.

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| 8 hub pages return 200 | 8 of 8 | `for url in /devops-sre /devops-sre/containers-and-docker /devops-sre/kubernetes /devops-sre/iac-terraform-pulumi /devops-sre/ci-cd /devops-sre/observability /devops-sre/sre-practice /devops-sre/platform-engineering; do curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url"; done` |
| Hub aggregator returns ≥ 350 cards | ≥ 350 | `console.log(listCards().length)` in aggregator; `npm run build` |
| Kubernetes category ≥ 70 cards | ≥ 70 | `console.log(listCards('kubernetes').length)` |
| Observability category ≥ 50 cards | ≥ 50 | `console.log(listCards('observability').length)` |
| SRE practice category ≥ 60 cards | ≥ 60 | `console.log(listCards('sre-practice').length)` |
| Platform engineering category ≥ 50 cards | ≥ 50 | `console.log(listCards('platform-engineering').length)` |
| Each category intro ≥ 200 words | 7 of 7 | `for F in content/platform-engineering-cross-cutting/*-intro.md; do wc -w < "$F"; done` all ≥ 200 |
| Sitemap includes 8 DevOps hub URLs | 8 | `grep -c '/devops-sre' frontend/public/sitemap.xml` ≥ 8 |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Role tags present on every card | 100 % | `rg 'roleTags=\{' frontend/components/DevOpsCard.tsx` ≥ 1 |
| Cloud-hub / DevOps-hub overlap = 0 | 0 | aggregator-side cross-check: `grep -c 'cloud-architecture' frontend/lib/hubs/devops-sre.ts` must be 0 |
| Site-header has DevOps & SRE link | grep | `grep -c 'href="/devops-sre"' frontend/components/site-header.tsx` ≥ 1 |

## Failure modes & rollback

- **SRE / platform-engineering categories thin**: the cross-cutting tree is the primary source for these — generate more before launch.
- **Cloud / DevOps overlap detected**: aggregator finds a card appearing in both `/cloud-architecture/aws` and `/devops-sre/kubernetes` — keep it in the DevOps hub (the tool-shaped page) and emit a "see also: AWS EKS" cross-link on the cloud page instead.
- **CKA / CKAD cert-prep coverage incomplete**: acceptable to launch; add cert-prep tag in a follow-up.
- **Observability fragmented across OTel / Prometheus / Datadog with no synthesis**: the cross-cutting `observability-design` module must include the "OTel as data layer, Prometheus/Datadog as backend" synthesis topic. The most common mistake is explaining each tool in isolation without naming the integration pattern.
- **Rollback:** `ENABLED_HUBS.devopsSre = false`.

## Definition of Done

- [ ] `grep -c 'devopsSre: *true' frontend/lib/launch-config.ts` ≥ 1
- [ ] `for url in /devops-sre /devops-sre/containers-and-docker /devops-sre/kubernetes /devops-sre/iac-terraform-pulumi /devops-sre/ci-cd /devops-sre/observability /devops-sre/sre-practice /devops-sre/platform-engineering; do curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url"; done` — all 200
- [ ] `console.log(listCards().length)` ≥ 350
- [ ] `console.log(listCards('kubernetes').length)` ≥ 70
- [ ] `console.log(listCards('observability').length)` ≥ 50
- [ ] `console.log(listCards('sre-practice').length)` ≥ 60
- [ ] `for F in content/platform-engineering-cross-cutting/*-intro.md; do wc -w < "$F"; done` — all ≥ 200
- [ ] `grep -c '/devops-sre' frontend/public/sitemap.xml` ≥ 8
- [ ] `grep -c 'href="/devops-sre"' frontend/components/site-header.tsx` ≥ 1
- [ ] `cd frontend && npm run build; echo $?` — exits 0

## Estimated effort

- **Ideal:** 24 hours (3h scaffold + 10h cross-cutting content + 8h hub UI + 3h intros + smoke).
- **Hard stop:** 48 hours.
- **Recommended split:** 3 agent sessions:
  1. Steps 1-2 (scaffold cross-cutting + aggregator).
  2. Steps 3-4 (pages + intros + seed cross-cutting to ≥ 180 cards).
  3. Steps 5-6 (flag + smoke + commits + INDEX).