# 73 — Security Engineering Hub Rollout

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** hub feature work + cross-tree content aggregation. Pulls from JBI 16 (security-testing-system-design), PBI 34 (security-python), Go 56 (security), and new security-cross-cutting modules.
> **Depends on:** 16 (JBI security), 34 (PBI security), 41 (interview-qa-hub pattern), 71 (cloud hub — for cloud-security overlap rules), 72 (devops hub — for DevSecOps overlap rules).

## TL;DR

- **Goal:** A single browsable hub for **security engineering** content — AppSec / SecureSDLC, Cloud Security, DevSecOps + supply chain, Identity & Access (OAuth 2.0, SAML, OIDC, mTLS), Cryptography & PKI, Threat Modeling & OWASP, Red Team / Blue Team / Incident Response, Compliance (SOC2 / ISO27001 / PCI-DSS / HIPAA / GDPR). One URL for "security engineer interview questions", "appsec interview questions", "cloud security interview questions", "oauth interview questions".
- **Action:** Add `frontend/lib/hubs/security-engineering.ts` aggregator, build `/security-engineering` index + up to 8 category pages, scaffold `content/security-cross-cutting/` (threat-modeling, OWASP frameworks, identity protocols, crypto primitives, compliance frameworks, IR runbooks).
- **Output:** `/security-engineering` returns 200 with grouped content; ≥ 320 cards across categories; hub URLs in `sitemap.xml`; nav link added.

## Hard prerequisites

- [ ] Playbook 16 (JBI security-system-design) DONE.
- [ ] Playbook 34 (PBI security) at least scaffolded.
- [ ] Playbook 41 (interview-qa-hub rollout) DONE.
- [ ] Playbook 71 (Cloud hub) DONE — cloud-security overlap rules established.
- [ ] Playbook 72 (DevOps/SRE hub) DONE — DevSecOps overlap rules established.
- [ ] `frontend/lib/launch-config.ts` has `ENABLED_HUBS.securityEngineering` (add if missing; default `false`).

## Why this matters

Security engineering interviews fragment across five buyer personas — AppSec engineer, Cloud Security engineer, DevSecOps engineer, IAM specialist, Detection & Response engineer — each with its own vocabulary that generic "security interview prep" sites flatten into noise. A consolidated hub that organises content by **practice area** (AppSec / Cloud / DevSecOps / IAM / Crypto / Detection / Compliance) lets candidates self-route, and lets the platform win on each long-tail keyword cluster simultaneously.

## Background

This hub aggregates from the following content trees:

| Content tree | Role | Key standards / tools |
|---|---|---|
| `content/java-backend-intermediate/` (playbook 16) | AppSec | OWASP Top 10 (2021), Spring Security, JWT, HTTPS/TLS, SQL injection in Java |
| `content/python-backend-intermediate/` (playbook 34) | AppSec | OWASP in Django/FastAPI, Python security tools |
| `content/go-intermediate/` (playbook 56) | AppSec | Go security idioms |
| `content/security-cross-cutting/` (new, this playbook) | All categories | Identity (OAuth 2.0 RFC 6749, OIDC Core spec, SAML 2.0, SPIFFE/SPIRE, mTLS), Crypto (AES-GCM, RSA-OAEP, ECDSA, TLS 1.3), PKI, OWASP Top 10 2021, OWASP API Security Top 10 2023, STRIDE / PASTA threat modelling, IR runbooks, SOC2 / ISO27001 / PCI-DSS / HIPAA / GDPR |

The cross-cutting tree holds practice-area content (identity protocols, crypto primitives, compliance frameworks, IR runbooks). Language-specific implementations (e.g. "JWT in Spring Security 6", "OWASP in Django 4.x") stay in the language tracks.

Real anchors: OWASP Top 10 (2021 version); OWASP API Security Top 10 (2023 version); NIST SP 800-53 (security controls catalogue); AWS IAM, GCP IAM, Azure Entra ID (cloud identity); HashiCorp Vault 1.16 (secrets management); AWS KMS, GCP Cloud KMS (key management); libsodium / NaCl (vetted crypto library); TLS 1.3 (RFC 8446, 2018); OAuth 2.0 RFC 6749; OIDC Core 1.0 spec.

## Search phrases to own

| Search phrase | Target page |
|---|---|
| `security engineer interview questions` | `/security-engineering` |
| `application security interview questions` | `/security-engineering/appsec-and-secure-sdlc` |
| `appsec interview questions` | `/security-engineering/appsec-and-secure-sdlc` |
| `cloud security interview questions` | `/security-engineering/cloud-security` |
| `aws security interview questions` | `/security-engineering/cloud-security` (AWS sub-section) |
| `devsecops interview questions` | `/security-engineering/devsecops-and-supply-chain` |
| `oauth interview questions` | `/security-engineering/identity-and-access` |
| `oidc interview questions` | `/security-engineering/identity-and-access` |
| `saml interview questions` | `/security-engineering/identity-and-access` |
| `pki interview questions` | `/security-engineering/cryptography-and-pki` |
| `cryptography interview questions` | `/security-engineering/cryptography-and-pki` |
| `threat modeling interview questions` | `/security-engineering/threat-modeling-and-owasp` |
| `owasp top 10 interview questions` | `/security-engineering/threat-modeling-and-owasp` |
| `incident response interview questions` | `/security-engineering/detection-and-ir` |
| `compliance interview questions` | `/security-engineering/compliance-and-governance` |
| `soc2 interview questions` | `/security-engineering/compliance-and-governance` |

## Current state

- JBI 16 has Java-flavoured AppSec + security-system-design content.
- PBI 34 has Python-flavoured security content.
- No identity / crypto / compliance / IR cross-cutting trees today.
- `/security-engineering` route does NOT exist today.

## Target state (measurable)

- Up to 9 hub pages return 200 (`/security-engineering` + up to 8 categories below).
- Hub aggregator returns ≥ 320 cards.
- All hub URLs appear in `sitemap.xml`.

## Categories (canonical — 7 minimum at launch, up to 8)

| Category slug | Pulls from… |
|---|---|
| `appsec-and-secure-sdlc` | `java-backend-intermediate/application-security`, `python-backend-intermediate/application-security`, `security-cross-cutting/secure-sdlc-essentials`, `security-cross-cutting/sast-dast-sca` |
| `cloud-security` | `security-cross-cutting/cloud-security-aws`, `security-cross-cutting/cloud-security-gcp`, `security-cross-cutting/cloud-security-azure`, `security-cross-cutting/cspm-and-cwpp` |
| `devsecops-and-supply-chain` | `security-cross-cutting/devsecops-pipeline`, `security-cross-cutting/sbom-and-supply-chain`, `security-cross-cutting/secrets-management-vault-aws` |
| `identity-and-access` | `security-cross-cutting/oauth-2-and-oidc`, `security-cross-cutting/saml-and-federation`, `security-cross-cutting/mtls-and-spiffe`, `security-cross-cutting/zero-trust-essentials` |
| `cryptography-and-pki` | `security-cross-cutting/crypto-primitives`, `security-cross-cutting/pki-and-certs`, `security-cross-cutting/key-management-kms-hsm` |
| `threat-modeling-and-owasp` | `security-cross-cutting/owasp-top-10`, `security-cross-cutting/owasp-api-top-10`, `security-cross-cutting/stride-and-pasta`, `java-backend-intermediate/security-architecture` |
| `detection-and-ir` | `security-cross-cutting/detection-engineering`, `security-cross-cutting/ir-runbooks`, `security-cross-cutting/forensics-essentials` |
| `compliance-and-governance` | `security-cross-cutting/compliance-frameworks`, `security-cross-cutting/audit-prep`, `security-cross-cutting/privacy-gdpr-ccpa` |

**Minimum 7 frozen at launch.** `compliance-and-governance` may be deferred to a follow-up if launch budget is tight. Once the set is chosen, it is frozen — adding a 9th requires its own playbook.

---

## Step 1 — Scaffold the cross-cutting module

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
mkdir -p content/security-cross-cutting
cat > content/security-cross-cutting/_index.json <<EOF
{
  "level": "security-cross-cutting",
  "modules": [],
  "pillar_groups": []
}
EOF

for M in \
  secure-sdlc-essentials sast-dast-sca \
  cloud-security-aws cloud-security-gcp cloud-security-azure cspm-and-cwpp \
  devsecops-pipeline sbom-and-supply-chain secrets-management-vault-aws \
  oauth-2-and-oidc saml-and-federation mtls-and-spiffe zero-trust-essentials \
  crypto-primitives pki-and-certs key-management-kms-hsm \
  owasp-top-10 owasp-api-top-10 stride-and-pasta \
  detection-engineering ir-runbooks forensics-essentials \
  compliance-frameworks audit-prep privacy-gdpr-ccpa; do
  mkdir -p "content/security-cross-cutting/$M"
done
```

Target counts per module: ~12-15 cards, ~300 total in the cross-cutting tree.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f content/security-cross-cutting/_index.json && echo "OK index" || echo "MISSING index"
MODULE_COUNT=$(find content/security-cross-cutting -mindepth 1 -maxdepth 1 -type d | wc -l)
echo "Module dirs: $MODULE_COUNT (want 24)"
```
Expected: `OK index`; module dirs = 24.

---

### Step 2 — Aggregator

`frontend/lib/hubs/security-engineering.ts`:

```typescript
export type SecCategory =
  | 'appsec-and-secure-sdlc'
  | 'cloud-security'
  | 'devsecops-and-supply-chain'
  | 'identity-and-access'
  | 'cryptography-and-pki'
  | 'threat-modeling-and-owasp'
  | 'detection-and-ir'
  | 'compliance-and-governance';

export interface SecCard {
  id:        string;
  title:     string;
  domain:    string;
  module:    string;
  topic:     string;
  href:      string;
  category:  SecCategory;
  roleTags:  ('appsec' | 'cloud-sec' | 'devsecops' | 'iam' | 'detection' | 'compliance')[];
  difficulty:'easy' | 'medium' | 'hard';
}

export const SEC_CATEGORY_FEEDS: Record<SecCategory, string[]> = {
  'appsec-and-secure-sdlc': [
    'java-backend-intermediate/application-security',
    'python-backend-intermediate/application-security',
    'security-cross-cutting/secure-sdlc-essentials',
    'security-cross-cutting/sast-dast-sca',
  ],
  'cloud-security': [
    'security-cross-cutting/cloud-security-aws',
    'security-cross-cutting/cloud-security-gcp',
    'security-cross-cutting/cloud-security-azure',
    'security-cross-cutting/cspm-and-cwpp',
  ],
  'devsecops-and-supply-chain': [
    'security-cross-cutting/devsecops-pipeline',
    'security-cross-cutting/sbom-and-supply-chain',
    'security-cross-cutting/secrets-management-vault-aws',
  ],
  'identity-and-access': [
    'security-cross-cutting/oauth-2-and-oidc',
    'security-cross-cutting/saml-and-federation',
    'security-cross-cutting/mtls-and-spiffe',
    'security-cross-cutting/zero-trust-essentials',
  ],
  'cryptography-and-pki': [
    'security-cross-cutting/crypto-primitives',
    'security-cross-cutting/pki-and-certs',
    'security-cross-cutting/key-management-kms-hsm',
  ],
  'threat-modeling-and-owasp': [
    'security-cross-cutting/owasp-top-10',
    'security-cross-cutting/owasp-api-top-10',
    'security-cross-cutting/stride-and-pasta',
    'java-backend-intermediate/security-architecture',
  ],
  'detection-and-ir': [
    'security-cross-cutting/detection-engineering',
    'security-cross-cutting/ir-runbooks',
    'security-cross-cutting/forensics-essentials',
  ],
  'compliance-and-governance': [
    'security-cross-cutting/compliance-frameworks',
    'security-cross-cutting/audit-prep',
    'security-cross-cutting/privacy-gdpr-ccpa',
  ],
};
```

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
test -f frontend/lib/hubs/security-engineering.ts && echo "OK aggregator" || echo "MISSING aggregator"
grep -c 'SEC_CATEGORY_FEEDS' frontend/lib/hubs/security-engineering.ts
```
Expected: `OK aggregator`; count ≥ 1.

---

### Step 3 — Pages

- `/security-engineering` — index of active categories with card counts + role-mix histogram.
- `/security-engineering/<category>` — filterable card list; role-pill badges.

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for F in \
  frontend/app/security-engineering/page.tsx \
  "frontend/app/security-engineering/[category]/page.tsx" \
  frontend/components/SecCard.tsx; do
  test -f "$F" && echo "OK $F" || echo "MISSING $F"
done
```

---

### Step 4 — Category intros (250 words each)

Same template. Intro requirements per category:

- **AppSec intro**: names OWASP Top 10 (2021) + OWASP ASVS v4.0 as the reference frameworks.
- **Cloud Security intro**: names the per-cloud benchmarks — CIS AWS Benchmark v2.0, CIS GCP Benchmark v2.0, CIS Azure Benchmark v2.0 — and AWS GuardDuty, AWS Security Hub as canonical detection tools.
- **Crypto intro**: opens with the rule "Do NOT implement cryptographic primitives from scratch in production; use vetted libraries: JCA (Java), libsodium (C/Python/Go), AWS KMS / GCP Cloud KMS for key management." The classic bug is using AES-ECB mode — it leaks block patterns even when encrypted.
- **Compliance intro**: lists the five frameworks covered: SOC2 Type II, ISO 27001:2022, PCI-DSS v4.0, HIPAA Security Rule, GDPR / CCPA. Each maps to at least one concrete control mapping (e.g. SOC2 CC6.1 → encryption-at-rest + KMS).

**Verify:**
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer
for SLUG in appsec-and-secure-sdlc cloud-security devsecops-and-supply-chain identity-and-access cryptography-and-pki threat-modeling-and-owasp detection-and-ir compliance-and-governance; do
  INTRO="content/security-cross-cutting/${SLUG}-intro.md"
  [ -f "$INTRO" ] && WC=$(wc -w < "$INTRO") || WC=0
  [ "$WC" -ge 200 ] && echo "OK $SLUG ($WC)" || echo "SHORT $SLUG ($WC)"
done
```

---

### Step 5 — Flip flag

```typescript
ENABLED_HUBS: {
  ...,
  securityEngineering: true,
}
```

Commit: `launch: enable securityEngineering hub`.

**Verify:**
```bash
grep -c 'securityEngineering: *true' \
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
  /security-engineering \
  /security-engineering/appsec-and-secure-sdlc \
  /security-engineering/cloud-security \
  /security-engineering/devsecops-and-supply-chain \
  /security-engineering/identity-and-access \
  /security-engineering/cryptography-and-pki \
  /security-engineering/threat-modeling-and-owasp \
  /security-engineering/detection-and-ir \
  /security-engineering/compliance-and-governance; do
  printf "%-55s -> " "${url}"
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000${url}"
done

kill ${DEV_PID}
```

Expected: all `200` (skip deferred categories).

---

## Files and code to touch

| Path | Change |
|---|---|
| `frontend/lib/launch-config.ts` | add `securityEngineering` flag |
| `frontend/lib/hubs/security-engineering.ts` | NEW — aggregator |
| `frontend/app/security-engineering/page.tsx` | NEW — index |
| `frontend/app/security-engineering/[category]/page.tsx` | NEW — category page |
| `frontend/components/SecCard.tsx` | NEW — card with role-tag pill |
| `frontend/components/site-header.tsx` | add Security nav link |
| `scripts/build_sitemap.py` | enumerate security hub URLs |
| `content/security-cross-cutting/` | NEW directory + 24 modules |

## Content rules

- Hub LINKS, never duplicates JBI / PBI security content.
- Cross-cutting tree holds practice-area content (identity protocols, crypto primitives, compliance frameworks, IR runbooks); language-specific implementations stay in the language tracks.
- Cards in `cloud-security` MUST NOT also appear in `/cloud-architecture` provider categories. Validate at aggregator build time with a cross-hub feed intersection check.
- Cards in `devsecops-and-supply-chain` MUST NOT also appear in `/devops-sre/ci-cd`. Validate similarly.
- Every crypto example must use a vetted library (JCA, libsodium, AWS KMS, GCP KMS). The category intro must include the bold statement "Do NOT implement cryptographic primitives from scratch in production."
- The 8-category set is **frozen** at launch — adding a 9th requires its own playbook.

## SEO and URLs

- Canonical: `/security-engineering`, `/security-engineering/<category>`.
- JSON-LD: `BreadcrumbList` + `CollectionPage` per category.
- Title format: `<Topic> Interview Questions — Security Engineering Hub | InterviewExplainer`.

## Quality gates

| Gate | Threshold | Verify with |
|---|---|---|
| All active hub pages return 200 | all of them | smoke loop (all 200) |
| Hub aggregator returns ≥ 320 cards | ≥ 320 | `console.log(listCards().length)` in aggregator; `npm run build` |
| AppSec category ≥ 50 cards | ≥ 50 | `console.log(listCards('appsec-and-secure-sdlc').length)` |
| Cloud Security category ≥ 50 cards | ≥ 50 | `console.log(listCards('cloud-security').length)` |
| Identity & Access category ≥ 40 cards | ≥ 40 | `console.log(listCards('identity-and-access').length)` |
| Each active category intro ≥ 200 words | all intros | `for F in content/security-cross-cutting/*-intro.md; do wc -w < "$F"; done` all ≥ 200 |
| Sitemap includes all security hub URLs | count | `grep -c '/security-engineering' frontend/public/sitemap.xml` ≥ active-count + 1 |
| `npm run build` exit 0 | 0 | `cd frontend && npm run build; echo $?` |
| Role tags present on every card | 100 % | `rg 'roleTags=\{' frontend/components/SecCard.tsx` ≥ 1 |
| Cross-hub overlap (Cloud / DevOps) = 0 | 0 | `python3 scripts/check_hub_overlap.py --hubs security-engineering cloud-architecture devops-sre` exits 0 |
| Site-header has Security link | grep | `grep -c 'href="/security-engineering"' frontend/components/site-header.tsx` ≥ 1 |
| Compliance category lists ≥ 5 frameworks | ≥ 5 | `grep -c -E 'SOC2|ISO27001|PCI-DSS|HIPAA|GDPR' content/security-cross-cutting/compliance-and-governance-intro.md` ≥ 5 |

## Failure modes & rollback

- **Cross-hub overlap detected**: aggregator finds a card appearing in `/cloud-architecture/aws` AND `/security-engineering/cloud-security`. Keep it in the Security hub (security-shaped page) and emit a "see also: security" link on the cloud page.
- **DevSecOps overlap with `/devops-sre/ci-cd`**: same rule — security-shaped overlay goes here; plain CI/CD plumbing stays in DevOps hub.
- **Crypto section drifts into "roll your own crypto" examples**: every crypto example must use a vetted library. CI lint should grep for custom cryptographic constructs.
- **Compliance content too generic**: each compliance topic must include at least one concrete control mapping — not just framework summaries.
- **Detection / IR section thin**: acceptable to launch at lower volume; flag for follow-up. Detection engineering content is differentiating long-term.
- **Rollback:** `ENABLED_HUBS.securityEngineering = false`.

## Definition of Done

- [ ] `grep -c 'securityEngineering: *true' frontend/lib/launch-config.ts` ≥ 1
- [ ] Smoke loop — all active category pages return 200
- [ ] `console.log(listCards().length)` ≥ 320
- [ ] `console.log(listCards('appsec-and-secure-sdlc').length)` ≥ 50
- [ ] `console.log(listCards('cloud-security').length)` ≥ 50
- [ ] `console.log(listCards('identity-and-access').length)` ≥ 40
- [ ] `for F in content/security-cross-cutting/*-intro.md; do wc -w < "$F"; done` — all ≥ 200
- [ ] `grep -c '/security-engineering' frontend/public/sitemap.xml` ≥ active-category-count + 1
- [ ] `grep -c 'href="/security-engineering"' frontend/components/site-header.tsx` ≥ 1
- [ ] `cd frontend && npm run build; echo $?` — exits 0
- [ ] `grep -c -E 'SOC2|ISO27001|PCI-DSS|HIPAA|GDPR' content/security-cross-cutting/compliance-and-governance-intro.md` ≥ 5

## Estimated effort

- **Ideal:** 28 hours (3h scaffold + 13h cross-cutting content + 8h hub UI + 4h intros + smoke).
- **Hard stop:** 55 hours.
- **Recommended split:** 4 agent sessions:
  1. Steps 1-2 (scaffold cross-cutting + aggregator).
  2. Step 3 (pages + filtering).
  3. Step 4 (intros + seed cross-cutting to ≥ 200 cards).
  4. Steps 5-6 (flag + smoke + commits + INDEX).