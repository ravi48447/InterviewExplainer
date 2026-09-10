# Audit — docker

**Pillar:** P09 Git, Build & CI/CD
**Module:** M27 docker
**Topics present:** 5 of 7 (`scenario-based`, `comparisons` empty)
**Questions:** 12 (all written, no stubs)
**Benchmark sources:** Docker documentation (docs.docker.com), "Docker Deep Dive" (Nigel Poulton), Spring Boot Docker guide (spring.io/guides/gs/spring-boot-docker), Baeldung Docker series, buildpacks.io, OWASP Docker Security Cheat Sheet

---

## Module is one of the cleanest audited

- 12 written questions, no stubs
- Universal `interviewer_intent` completeness, all 12 have `key_points`
- **Strong structural uniformity**: all speakables are 265–340w bulleted-subheaders (consistent format decision), all Zone 3s are 433–682w with 1–3 code blocks
- 4 of 12 have detected analogies — best analogy coverage of any P09 module
- Zero `MAJOR` or higher per-question issues — all 12 are `MINOR`

**But** 1 critical internal duplicate is auto-detected (Jaccard 0.67) and 2 topics are empty.

---

## Biggest finding — duplicate topic with Jaccard 0.67

Auto-detected overlap in `docker-fundamentals`:

- **Q1** `jvm-memory-docker-container-limits` (656w, 3 code, analogy)
- **Q5** `docker-container-resource-limits-jvm` (600w, 1 code, analogy)

Shared tokens: `container`, `docker`, `jvm`, `limits`. Both questions cover the same concept — how the JVM reads cgroup memory/CPU limits inside a container — but Q1 runs 656w with 3 code blocks (stronger) and Q5 runs 600w with 1 code block (weaker). Needs either consolidation (delete Q5, fold its unique content into Q1) or distinct scoping (Q1 = JVM ergonomics / UseContainerSupport, Q5 = OS-level Docker limits + operational impact).

---

## Biggest finding — empty `scenario-based` and `comparisons` topics

The topics are declared in `_index.json` but have 0 questions. For Docker, these are natural interview arenas:

**Missing `scenario-based` Qs**:
- `containerize-a-spring-boot-application-from-scratch`
- `debug-a-container-that-crashes-on-startup`
- `reduce-docker-image-size-for-a-java-app`
- `one-slow-container-among-many-how-to-diagnose`

**Missing `comparisons` Qs**:
- `docker-vs-podman-vs-containerd`
- `dockerfile-vs-buildpacks-vs-jib`
- `docker-image-vs-container-vs-layer`
- `docker-swarm-vs-kubernetes`

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Docker questions show the Dockerfile or `docker ...` CLI command | **Matching** — 12 of 12 have at least 1 code block |
| JVM-in-container questions cite `-XX:+UseContainerSupport` and cgroup behavior | Matching (Q1 fundamentals) |
| Multi-stage Dockerfile examples with named stages (`AS builder`, `AS runtime`) | Matching (Q1 multi-stage-builds) |
| Security Qs cite non-root user, image scanning (Trivy, Snyk, Clair), distroless images | Matching in docker-security topic |
| Opening bolds the Docker primitive (`**image**`, `**container**`, `**layer**`, `**volume**`, `**bridge network**`) | **Failing** — 12 of 12 direct answers have zero bold anchors |
| Analogies common (image = "blueprint", container = "running house from the blueprint", layers = "cake layers", volume = "external hard drive") | 4 of 12 have detected analogies — moderate; can improve |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | INTRA-MODULE DUPLICATE | **MAJOR** | `jvm-memory-docker-container-limits` vs `docker-container-resource-limits-jvm` — Jaccard 0.67, clear overlap. Requires consolidation or rescoping |
| S2 | EMPTY SCENARIO-BASED | **MAJOR** | Topic exists but 0 Qs. Docker scenario questions are common interview content |
| S3 | EMPTY COMPARISONS | **MAJOR** | Topic exists but 0 Qs. Docker vs Podman, Dockerfile vs buildpacks vs Jib are standard topics |
| S4 | MODULE-WIDE ZONE 1 | MODERATE | 12 of 12 direct answers have 0 bold anchors |
| S5 | ANALOGY GAP | MINOR | 8 of 12 missing analogies |
| S6 | THIN DOCKER-COMPOSE + NETWORKING | MINOR | Each has 1 Q only. docker-compose has more depth (profiles, depends_on health condition, override files). Networking should cover DNS resolution, macvlan, port conflicts |

---

## Per-question issues

### `docker-fundamentals` (5 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** jvm-memory-docker-container-limits | 656w / 3 code / analogy. Well-shaped. **Overlaps with Q5** | MINOR + OVERLAP |
| **Q2** docker-volumes-named-vs-bind-mounts | 546w / 1 code / no analogy | MINOR |
| **Q3** docker-health-checks-spring-boot | 509w / 2 code / analogy — well-shaped | MINOR |
| **Q4** debugging-spring-boot-in-docker | 663w / 3 code / analogy — well-shaped | MINOR |
| **Q5** docker-container-resource-limits-jvm | 600w / 1 code / analogy. **Overlaps with Q1**; weaker code coverage. Candidate for deletion or rescoping | MINOR + OVERLAP |

### `docker-compose` (1 Q) — thin topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** docker-compose-spring-boot-postgres-redis | 433w / 2 code / no analogy. Standard integration Q | MINOR |

### `docker-networking` (1 Q) — thin topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** docker-networking-bridge-host-overlay | 557w / 1 code / no analogy. For a networking Q, 1 code block is light — should show network creation + a service connecting + `docker inspect` network output | MINOR |

### `docker-security` (3 Qs) — well-covered

| Q | Issue | Severity |
|---|---|---|
| **Q1** docker-non-root-user-java-security | 475w / 2 code / no analogy | MINOR |
| **Q2** docker-image-scanning-security-best-practices | 562w / 1 code / no analogy. Should cite Trivy, Snyk, Clair commands specifically | MINOR |
| **Q3** docker-environment-variables-vs-secrets | 549w / 2 code / analogy — well-shaped | MINOR |

### `multi-stage-builds` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** multistage-dockerfile-spring-boot | 564w / 3 code / no analogy | MINOR |
| **Q2** docker-layer-caching-optimization | 682w / 2 code / analogy — well-shaped | MINOR |

### `scenario-based` (0 Qs) — **empty, MAJOR gap**

### `comparisons` (0 Qs) — **empty, MAJOR gap**

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **3** | S1 intra-module duplicate, S2 empty scenario-based, S3 empty comparisons |
| **MODERATE** | **1** | S4 module-wide bold |
| **MINOR** | **12** | All 12 Qs — polish-level (bold anchors + some analogy gaps) |
| **CLEAN** | **0** by auditor (but Q3/Q4 fundamentals, Q3 security, Q2 multi-stage are effectively clean pending bold anchors) |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 12 (100%)
- `zone3_no_analogy` × 8
- `zone3_no_code_examples` × 0 (none)

---

## Suggested fix order

1. **Resolve the intra-module duplicate** (S1). Decision options: (a) delete Q5 `docker-container-resource-limits-jvm` and fold unique content into Q1, (b) keep both but rescope — Q1 = JVM ergonomics / `-XX:+UseContainerSupport` / MaxRAMPercentage, Q5 = Docker-level `--memory` / `--cpus` / OOM-kill behavior.
2. **Author `comparisons` topic** — 2–3 Qs: `docker-vs-podman-vs-containerd`, `dockerfile-vs-buildpacks-vs-jib`, `docker-swarm-vs-kubernetes`.
3. **Author `scenario-based` topic** — 2–3 Qs: `containerize-a-spring-boot-app`, `debug-crashing-container`, `shrink-a-fat-java-image`.
4. **Module-wide bold-anchor pass** — 12 mechanical edits.
5. **Add analogies to 8 Qs** — image/container/layer/volume analogies above.
6. **Expand docker-compose topic** — at least 1 more Q (profiles + depends_on healthcheck condition).
7. **Expand docker-networking topic** — at least 1 more Q (DNS resolution inside a compose network, or macvlan).

---

## Overall

This is a **well-shaped module with localized issues**: one duplicate, two empty topics, and module-wide Zone 1 bold-anchor gaps. Once those are fixed, the module is close to interview-ready. Compared to cicd (M26) and git-build-tools (M25), this is the strongest P09 module after structural cleanup.
