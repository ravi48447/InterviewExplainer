# Audit — kubernetes

**Pillar:** P09 Git, Build & CI/CD
**Module:** M28 kubernetes
**Topics present:** 5 of 8 (`helm`, `scenario-based`, `comparisons` empty)
**Questions:** 12 (all written, no stubs)
**Benchmark sources:** Kubernetes documentation (kubernetes.io/docs), "Kubernetes in Action" (Marko Lukša, 2nd ed), Kubernetes Patterns (Ibryam & Huß), Spring Boot Kubernetes guide (spring.io/guides), Baeldung Kubernetes series, CNCF landscape

---

## Biggest finding — 3 code-missing Qs in a YAML-heavy module

Kubernetes is a YAML-manifest domain. Any substantive Kubernetes answer should include at least one manifest snippet (Pod, Deployment, Service, ConfigMap, etc.) or a `kubectl` command. Three Qs have **0 code blocks** in Zone 3:

- **Q1 `kubernetes-core-objects-pod-deployment-service`** (560w) — a foundational "what are the core objects" Q with no Pod/Deployment/Service YAML is archetype-fail. This is the single most important code-injection target in the module
- **Q5 `kubernetes-persistent-volumes-statefulsets`** (663w) — StatefulSet + PVC questions without showing the `volumeClaimTemplates` block and the PV/PVC binding are incomplete
- **Q2 `kubernetes-pod-networking-cross-node`** (703w, paragraph-wall DA) — CNI / pod networking across nodes without showing a `NetworkPolicy` or `kubectl exec ... -- ping` output

---

## Biggest finding — empty `helm` topic

Helm is the de-facto Kubernetes package manager. For a 2024+ Kubernetes module, zero Helm questions is a major gap. Natural questions:

- `what-is-helm-and-when-to-use-charts`
- `helm-chart-structure-values-templates-hooks`
- `helm-release-upgrade-rollback-flow`
- `helm-vs-kustomize-comparison`
- `helm-chart-for-spring-boot-application`

Additional gaps: no ArgoCD / Flux / GitOps content, no service mesh (Istio/Linkerd — Linkerd touched in M16 sidecar but not k8s-specific), no operator pattern Q, no `kubectl debug` or ephemeral containers.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Kubernetes Qs show the YAML manifest alongside the `kubectl` command | **Mostly matching** — 9 of 12 Qs have 1–3 code blocks; 3 Qs have 0 |
| Probes Qs show `livenessProbe:` / `readinessProbe:` blocks | Matching (Q2 workloads) |
| Resource Qs cite `requests:` / `limits:` with CPU + memory examples | Matching (Q3 workloads) |
| Service-type Qs include ClusterIP/NodePort/LoadBalancer + Ingress with annotations | Matching (Q1 networking) |
| Opening bolds the K8s primitive (`**Pod**`, `**Deployment**`, `**Service**`, `**ConfigMap**`, `**StatefulSet**`) | **Failing** — 12 of 12 direct answers have zero bold anchors |
| Analogies common (pod = "smallest unit, like a single dish in a buffet", deployment = "recipe for replicas", service = "stable phone number for pods") | 4 of 12 have detected analogies — moderate |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | CODE-MISSING IN YAML DOMAIN | **MAJOR** | 3 of 12 Qs have 0 code in Zone 3. For Kubernetes this is archetype-fail — especially Q1 core-objects which is *the* foundational K8s question |
| S2 | EMPTY HELM TOPIC | **MAJOR** | Topic declared, 0 Qs. Helm is standard K8s interview content in 2024+ |
| S3 | EMPTY SCENARIO-BASED + COMPARISONS | **MAJOR** | Both declared topics empty |
| S4 | MODULE-WIDE ZONE 1 | MODERATE | 12 of 12 direct answers have 0 bold anchors; 1 paragraph wall (Q2 networking) |
| S5 | THIN TOPIC COVERAGE | MODERATE | `kubernetes-scaling` topic has 1 Q — HPA only. VPA (vertical pod autoscaler), cluster autoscaler, KEDA are all missing |
| S6 | ANALOGY GAP | MINOR | 8 of 12 missing analogies in an analogy-friendly domain |
| S7 | MISSING CORE TOPICS | MINOR | No operator pattern, no CRDs, no GitOps, no Istio/Linkerd, no ArgoCD |

---

## Per-question issues

### `kubernetes-fundamentals` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** deploying-spring-boot-kubernetes-step-by-step | 730w / 2 code / analogy — well-shaped | MINOR |
| **Q2** spring-boot-oomkilled-kubernetes-debugging | 859w / 3 code / analogy — **longest Zone 3 in module**, well-shaped debugging walkthrough | MINOR |

### `kubernetes-workloads` (5 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** kubernetes-core-objects-pod-deployment-service | 560w / **0 code** / no analogy. **Archetype-fail** — the "core objects" Q without YAML examples is the highest-priority fix in the module | **MAJOR** |
| **Q2** liveness-readiness-startup-probes-spring-boot | 574w / 1 code / analogy — well-shaped | MINOR |
| **Q3** kubernetes-resource-requests-limits-jvm | 633w / 1 code / analogy. Cross-module overlap with M27 docker JVM+container Qs — K8s angle is distinct (QoS class, OOMKilled) | MINOR + potential OVERLAP |
| **Q4** kubernetes-rolling-updates-rollbacks | 569w / 1 code / no analogy | MINOR |
| **Q5** kubernetes-persistent-volumes-statefulsets | 663w / **0 code** / no analogy. Needs `volumeClaimTemplates`, PV/PVC binding, StorageClass examples | **MAJOR** |

### `kubernetes-configuration` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** kubernetes-configmaps-secrets-spring-boot | 721w / 1 code / no analogy. Should show ConfigMap YAML + Secret YAML + Spring Boot property injection flow | MINOR |
| **Q2** kubernetes-namespaces-rbac-multi-team | 541w / 2 code / no analogy. RBAC Q should show `Role` + `RoleBinding` + `ServiceAccount` YAML | MINOR |

### `kubernetes-networking` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** kubernetes-service-types-clusterip-nodeport-loadbalancer-ingress | 565w / 1 code / no analogy. 4-way comparison Q — 1 code block is light. Should show a small YAML for each service type | MINOR |
| **Q2** kubernetes-pod-networking-cross-node | Paragraph-wall DA (65w). 703w / **0 code** / no analogy. CNI + overlay / routing Q without any network config or `ip route` / `kubectl exec ping` output | **MAJOR** |

### `kubernetes-scaling` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** horizontal-pod-autoscaler-spring-boot | 728w / 3 code / no analogy — well-shaped | MINOR |

### `helm` (0 Qs) — **empty, MAJOR gap**

### `scenario-based` (0 Qs) — empty

### `comparisons` (0 Qs) — empty

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **6** | S1 code-missing pattern, S2 empty helm, S3 empty scenario/comparisons, Q1 workloads, Q5 workloads, Q2 networking (code-missing) |
| **MODERATE** | **2** | S4 bold, S5 thin scaling |
| **MINOR** | **9** | Well-shaped Qs needing bold anchors + some analogies |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 12 (100%)
- `zone3_no_analogy` × 8
- `zone3_no_code_examples` × 3
- `zone1_direct_answer_paragraph_wall` × 1

---

## Suggested fix order

1. **Code-inject the 3 code-missing Qs** (Q1 core-objects, Q5 persistent-volumes, Q2 pod-networking). Q1 is highest priority — a foundational K8s Q with no YAML is indefensible.
2. **Author `helm` topic** — minimum 3 Qs (Helm concepts, chart structure, Helm vs Kustomize).
3. **Author `comparisons` topic** — at least `helm-vs-kustomize`, `deployment-vs-statefulset-vs-daemonset`, `kubernetes-vs-docker-swarm`.
4. **Author `scenario-based` topic** — at least `debug-pod-in-crashloopbackoff`, `design-multi-tenant-kubernetes-cluster`, `zero-downtime-upgrade-of-stateful-service`.
5. **Module-wide bold-anchor pass** — 12 mechanical edits. Fix Q2 networking paragraph wall.
6. **Expand kubernetes-scaling** — add VPA, cluster-autoscaler, KEDA, event-driven scaling.
7. **Add analogies to 8 Qs** — pod/deployment/service/configmap/statefulset analogies.
8. **Consider authoring missing core topics** — operator pattern + CRDs, GitOps (ArgoCD/Flux), service mesh refresher.

---

## Overall

Mid-shape module — strong Zone 3 depth (541–859w) and strong uniformity in speakable format (12 of 12 bulleted-subheaders 238–355w), but hurt by 3 code-missing answers in critical Qs and the entirely empty Helm topic. After code-injection + Helm authoring, this becomes a solid module.
