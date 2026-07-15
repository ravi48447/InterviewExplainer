"""Upgrade M26 CICD module: inject mermaid diagrams + tradeoffs into 25 existing Qs."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from upgrade_helper import insert_sections

ROOT = os.path.join(os.path.dirname(__file__), "..", "content", "java-backend-intermediate", "cicd")


# --- cicd-fundamentals (2 Qs) ---
fundamentals_upgrades = {
    "matrix-strategy-multi-version-java-testing": {
        "diagram": {
            "title": "Matrix Expansion \u2014 One Workflow, N\u00d7M\u00d7K Jobs",
            "content": "A matrix definition fans out one job into the cartesian product of every dimension. The CI scheduler then runs each combination in parallel.\n\n```mermaid\nflowchart TB\n    Trigger[git push or PR] --> Workflow[ci.yml workflow]\n    Workflow --> Matrix{matrix expansion<br/>java: [17, 21]<br/>os: [ubuntu, macos, windows]<br/>spring: [3.2, 3.3]}\n    Matrix -->|2x3x2 = 12 jobs| J1[java 17 / ubuntu / spring 3.2]\n    Matrix --> J2[java 17 / ubuntu / spring 3.3]\n    Matrix --> J3[java 17 / macos / spring 3.2]\n    Matrix --> Jdots[... 8 more parallel jobs]\n    Matrix --> J12[java 21 / windows / spring 3.3]\n    J1 --> Agg[Aggregate results<br/>fail if any combo fails]\n    J2 --> Agg\n    J3 --> Agg\n    Jdots --> Agg\n    J12 --> Agg\n    Agg --> Status[PR status check]\n    style Matrix fill:#fff3e0\n    style Agg fill:#c8e6c9\n```\n\n**12 parallel jobs from one workflow definition.** The matrix is the cheapest way to broaden coverage \u2014 cost scales linearly with combinations, but wall-clock time stays roughly constant."
        },
        "tradeoffs": {
            "title": "Trade-offs \u2014 Matrix Sprawl vs Coverage",
            "content": "**Cost vs coverage.** Every new dimension multiplies job count. A 3-OS \u00d7 4-Java \u00d7 3-Spring matrix is 36 jobs. At GitHub Actions' $0.008/min for Linux runners, a 5-minute test running 36 times is $1.44 per push. For a busy repo with 100 pushes/day, that is $144/day just for matrix runs. Use `include`/`exclude` to skip uninteresting combinations (e.g., Spring 3.3 only on Java 21).\n\n**Fail-fast trade-off.** `fail-fast: true` (the default) cancels remaining jobs the moment any combination fails \u2014 cheaper but loses visibility into whether the failure is a single-combination flake or a systemic bug. `fail-fast: false` runs every combination so the team sees the full pattern at the cost of wasted runner time on already-failing PRs.\n\n**Matrix vs separate jobs.** Matrix is succinct but harder to debug \u2014 logs are scattered across N jobs. For a small fixed set of variants (just Java 17 and 21), separate jobs with explicit names can be clearer. Matrix wins above 4\u20136 combinations.\n\n**Resource constraints.** Public GitHub repos get unlimited free Linux minutes; private repos are charged. Matrix jobs on macOS cost 10x Linux. Filter aggressively: run macOS only on `main` branch, Linux on every PR.\n\n**Required vs optional matrix legs.** Configure branch protection to require only the most critical matrix combination (e.g., Java 21 + Linux + latest Spring). Other combos can fail-soft as informational. Otherwise a flaky Windows test blocks every PR."
        },
    },
    "trigger-workflows-pull-requests-protect-branches": {
        "diagram": {
            "title": "Branch Protection \u2014 Required Checks Gate the Merge",
            "content": "Branch protection rules combine multiple status checks (CI, code review, signed commits) into a merge gate.\n\n```mermaid\nflowchart LR\n    Dev[Developer pushes branch] --> PR[Open PR to main]\n    PR --> CI[CI workflow runs<br/>on pull_request event]\n    CI --> Tests[Unit + integration tests]\n    CI --> Lint[Lint + SAST]\n    CI --> Sec[Trivy + OWASP dep-check]\n    PR --> Review[2 reviewers required]\n    PR --> Sign[Signed commits required]\n    Tests --> CheckPass{All checks green?}\n    Lint --> CheckPass\n    Sec --> CheckPass\n    Review --> CheckPass\n    Sign --> CheckPass\n    CheckPass -->|Yes| Merge[Merge button enabled]\n    CheckPass -->|No| Block[Merge blocked<br/>with reason]\n    Merge --> Main[main branch updated]\n    Main --> CD[CD workflow:<br/>deploy to staging]\n    style CheckPass fill:#fff9c4\n    style Block fill:#ffcdd2\n    style Merge fill:#c8e6c9\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs and Branch Protection Patterns",
            "content": "**Required reviewers \u2014 1 vs 2 vs CODEOWNERS.** One reviewer is the default for fast-moving teams; two reviewers slows things significantly but catches more issues. CODEOWNERS routing requires specific people for specific paths \u2014 best for teams with domain experts but creates bottlenecks when owners are on vacation.\n\n**`pull_request` vs `pull_request_target` events.** `pull_request` runs on the merge ref with no secrets exposed to fork PRs (safe). `pull_request_target` runs on the base branch with secrets available (can deploy preview environments) but can be exploited by malicious PRs that modify workflow files. Use `pull_request` by default; only use `pull_request_target` for very specific cases with extra hardening.\n\n**Status check naming stability.** Required checks are matched by name. If you rename a workflow job, the protection rule still requires the old name and blocks all PRs. Establish a naming convention early; treat job renames as a coordination task with security/admin who manages branch protection.\n\n**Linear history vs merge commits.** `Require linear history` enforces rebase or squash-merge. Cleaner git log but loses the visual indication of feature-branch work. Most teams prefer squash-merge for PRs.\n\n**Bypass for hotfixes.** Branch protection without an `Allow specified actors to bypass` escape hatch becomes a problem during incidents \u2014 fixing a P0 outage requires merging without 2 reviewers. Configure a small group (SRE on-call rotation) with bypass and audit every use."
        },
    },
}

# --- github-actions (7 Qs) ---
github_upgrades = {
    "java-cicd-pipeline-github-actions": {
        "diagram": {
            "title": "End-to-End Java CI/CD Pipeline in GitHub Actions",
            "content": "A production-ready pipeline has distinct phases: validate \u2192 build \u2192 test \u2192 scan \u2192 publish \u2192 deploy. Each phase has gates that must pass.\n\n```mermaid\nflowchart LR\n    Push[git push] --> Trig{Trigger}\n    Trig -->|PR| CI[CI: validate + test]\n    Trig -->|push to main| CD[CI/CD: + publish + deploy]\n    CI --> S1[Setup JDK 21<br/>actions/setup-java]\n    S1 --> S2[Cache Maven<br/>~/.m2/repository]\n    S2 --> S3[mvn verify<br/>unit + integration tests]\n    S3 --> S4[Trivy filesystem scan<br/>SAST]\n    S4 --> S5[SonarQube quality gate]\n    S5 --> CIP{All gates pass?}\n    CIP -->|Yes| PRStatus[PR check green]\n    CIP -->|No| FailPR[Block merge]\n    CD --> S1\n    PRStatus -.merge to main.-> CD\n    CD --> S6[Build Docker image<br/>buildx with cache]\n    S6 --> S7[Trivy image scan]\n    S7 --> S8[Cosign sign image]\n    S8 --> S9[Push to ECR/GHCR]\n    S9 --> S10[Deploy to staging<br/>kubectl / Helm / ArgoCD]\n    S10 --> S11[Smoke test]\n    S11 --> S12[Promote to prod<br/>with manual approval]\n    style CIP fill:#fff9c4\n    style FailPR fill:#ffcdd2\n    style PRStatus fill:#c8e6c9\n    style S12 fill:#bbdefb\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs in Pipeline Design",
            "content": "**One workflow vs split CI/CD.** A single workflow keeps everything visible but mixes concerns. Splitting into `ci.yml` (PR validation) and `cd.yml` (deploy on main) keeps each focused. Use `workflow_call` to share reusable jobs between them.\n\n**Self-hosted vs hosted runners.** GitHub-hosted runners are zero-maintenance but cost-per-minute. Self-hosted runners are free at the runtime cost but require security hardening (each runner can be exploited to compromise the host). For private code with high CI volume, self-hosted Ephemeral runners on Kubernetes (via actions-runner-controller) are the cost-optimal choice.\n\n**Caching aggressiveness.** Caching Maven, Docker layers, SonarQube state can cut build time 70%+. The risk is cache poisoning \u2014 a malicious dependency pollutes the cache and persists across builds. Scope cache keys carefully and use `actions/cache@v4` with explicit invalidation on dependency-file changes.\n\n**Test parallelization.** Splitting tests across N runners with `--include` patterns reduces wall-clock time linearly but each runner cost is fixed \u2014 4 runners cost 4x. Worth it when total test time exceeds 10 minutes; not worth it for sub-5-minute test suites.\n\n**Deploy gating.** Auto-deploy to staging on every main push is fast feedback but can cascade incidents. Manual approval for prod deploys is mandatory; for staging, smoke tests as gates strike a good balance."
        },
    },
    "manage-secrets-github-actions": {
        "diagram": {
            "title": "Secret Sources and Their Reach",
            "content": "GitHub provides three scopes of secrets, each visible to a different blast radius. Picking the right scope limits exposure.\n\n```mermaid\nflowchart TB\n    subgraph Org[\"Organization secrets\"]\n        O1[available to all repos<br/>or repo allowlist]\n    end\n    subgraph Repo[\"Repository secrets\"]\n        R1[available to all workflows<br/>in this repo]\n    end\n    subgraph Env[\"Environment secrets\"]\n        E1[available only when<br/>job specifies environment:]\n        E1G[Plus: required reviewers<br/>before job runs]\n    end\n    subgraph OIDC[\"OIDC federation\"]\n        OD[Short-lived AWS / Azure / GCP<br/>tokens, no static credentials]\n    end\n    Job[Workflow job] --> O1\n    Job --> R1\n    Job --> E1\n    Job --> OD\n    O1 -.broad blast radius.-> Bad[hundreds of repos]\n    R1 -.medium.-> Mid[all workflows]\n    E1 -.narrow.-> Good[only deploy jobs]\n    OD -.zero static.-> Best[automatic rotation]\n    style Bad fill:#ffcdd2\n    style Mid fill:#fff9c4\n    style Good fill:#c8e6c9\n    style Best fill:#a5d6a7\n```\n\n**OIDC is the modern default for cloud credentials** \u2014 no static AWS/Azure/GCP keys stored in GitHub at all."
        },
        "tradeoffs": {
            "title": "Trade-offs and OIDC Migration",
            "content": "**Static secrets vs OIDC.** Static AWS access keys in GitHub Secrets are easy but never rotated, and a leaked workflow file logging the key compromises the account. OIDC federation issues short-lived (15-minute) AWS STS tokens minted from GitHub's OIDC token \u2014 no static credentials at all. Migration takes a day; payoff is permanent.\n\n**Environment vs repo secrets.** Use environment-scoped secrets for production credentials so only deploy-to-prod jobs (which specify `environment: production`) can read them. A misconfigured PR build cannot accidentally use prod credentials.\n\n**Required reviewers on environments.** Add reviewers on the `production` environment so deploy jobs pause for human approval before consuming prod secrets. Adds friction; prevents accidental prod deploys.\n\n**Secret masking is best-effort.** GitHub auto-masks secret values in logs but only matches exact strings. A secret split across log lines or transformed (base64-decoded, JSON-parsed) is not masked. Never log decoded secret content.\n\n**Fork PR exposure.** Workflows triggered by `pull_request` from forks do NOT have access to repo secrets \u2014 a security feature. If you need preview environments for fork PRs, use `pull_request_target` carefully or use GitHub Apps with scoped tokens."
        },
    },
    "cache-maven-gradle-dependencies-github-actions": {
        "diagram": {
            "title": "Dependency Cache Lifecycle in CI",
            "content": "The cache lives in GitHub-managed storage (10GB per repo limit, 7-day eviction for unused entries).\n\n```mermaid\nsequenceDiagram\n    participant W as Workflow run\n    participant A as actions/cache\n    participant S as GitHub cache storage\n    participant M as Maven\n    W->>A: restore key=mvn-${{hashFiles('**/pom.xml')}}\n    A->>S: GET cache by key\n    alt Cache hit\n        S->>A: zip stream of ~/.m2\n        A->>W: extract to ~/.m2\n        W->>M: mvn verify (deps already local)\n    else Cache miss\n        S->>A: 404\n        W->>M: mvn verify (downloads everything)\n        M->>W: deps in ~/.m2\n        W->>A: save key=mvn-... (post-job step)\n        A->>S: upload zip\n    end\n    Note over S: 10GB per repo<br/>7-day eviction for stale\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Dependency Caching",
            "content": "**Cache hit ratio depends on key stability.** Use `hashFiles('**/pom.xml')` so cache invalidates only when dependencies change. Adding the OS to the key (`runs-on-${{ runner.os }}-mvn-...`) prevents Linux cache being restored on macOS where binaries differ.\n\n**Cache size limits.** GitHub allows 10GB per repo. A heavy Spring Boot project's `~/.m2/repository` can be 1\u20132GB. Across feature branches, the limit is often hit. Use restore-keys with prefixes so older caches can serve as a starting point: a partial cache with most deps is much better than no cache.\n\n**`actions/setup-java`'s built-in cache.** The recent versions of `setup-java` accept `cache: maven` and `cache: gradle` and handle caching automatically. Simpler than `actions/cache` for the common case, but less customizable.\n\n**Cache poisoning risk.** A malicious dependency that gets into the cache stays there until eviction. Pin Maven to download from a verified source (Maven Central via HTTPS, not random repositories) and consider scanning cache contents in security audits.\n\n**Cross-workflow cache sharing.** Caches are scoped per branch by default, with restore from base branch as fallback. Feature branches inherit main's cache; main builds fresh on dependency change. Tune the restore-keys hierarchy to match your branching strategy."
        },
    },
    "deploy-spring-boot-github-actions": {
        "diagram": {
            "title": "Deploy Pipeline \u2014 Build, Push, Roll Out",
            "content": "```mermaid\nflowchart LR\n    Tag[git tag v1.2.3<br/>or push to main] --> Build[Build artifact<br/>mvn package]\n    Build --> Image[Build Docker image<br/>tag = ${SHA}]\n    Image --> Scan[Trivy scan]\n    Scan -->|pass| Sign[Cosign sign]\n    Scan -->|fail| FailB[Block deploy]\n    Sign --> Push[Push to registry<br/>ECR / GHCR]\n    Push --> Choice{Deploy target}\n    Choice -->|VM / EC2| SSH[ssh + systemctl restart<br/>OR AWS CodeDeploy]\n    Choice -->|Kubernetes| Helm[helm upgrade --wait<br/>OR kubectl set image]\n    Choice -->|GitOps| Argo[Update gitops repo<br/>ArgoCD / Flux syncs]\n    Helm --> Verify[Smoke test<br/>curl /actuator/health]\n    SSH --> Verify\n    Argo --> Verify\n    Verify -->|pass| Done[Deploy complete]\n    Verify -->|fail| RB[Rollback:<br/>helm rollback / kubectl undo]\n    style FailB fill:#ffcdd2\n    style RB fill:#ff8a80\n    style Done fill:#c8e6c9\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Deployment Approaches",
            "content": "**Direct kubectl vs Helm vs GitOps.** Direct `kubectl set image` is fastest to set up but loses release history. Helm tracks releases and supports rollback (`helm rollback`). GitOps (ArgoCD/Flux) is the most decoupled \u2014 CI commits a manifest update, the cluster pulls and applies. GitOps wins for audit trail and disaster recovery; Helm is the pragmatic middle ground.\n\n**Push-based vs pull-based deploy.** Push (CI runs `kubectl apply`) requires CI to have cluster credentials \u2014 a security concern for prod. Pull-based (GitOps) flips this: clusters watch a git repo and pull updates; CI never touches the cluster API. Pull-based is the modern best practice.\n\n**Staging then prod vs single environment.** Auto-deploy to staging on main, manual approval for prod is the standard. Skipping staging is faster but loses an integration safety net. Skipping prod approval enables fully automated rollouts but only with strong test coverage and canary analysis.\n\n**Image tag strategy.** Tag with commit SHA (immutable, correlates with code), semver (release-friendly), or `latest` (NEVER for K8s \u2014 breaks rollback). SHA tags pair best with GitOps; semver pairs with release engineering.\n\n**Rollback automation.** A truly robust pipeline includes automated rollback on health check failure. Manual rollback is fine for low-traffic services; for revenue-critical paths, the runbook should be `argocd app rollback` or equivalent without human in the loop for the rollback decision."
        },
    },
    "github-actions-reusable-workflows": {
        "diagram": {
            "title": "Reusable Workflow vs Composite Action vs Org Template",
            "content": "Three reuse mechanisms with different scopes and trade-offs.\n\n```mermaid\nflowchart TB\n    subgraph RW[\"Reusable workflow (workflow_call)\"]\n        R1[Full job graph<br/>own runners, secrets, matrix]\n        R2[Caller passes inputs +<br/>secrets via with: + secrets:]\n    end\n    subgraph CA[\"Composite action\"]\n        C1[Reusable steps inside<br/>a single job]\n        C2[Lightweight; runs on caller's runner]\n    end\n    subgraph OT[\"Org-level workflow template\"]\n        O1[Starter workflow<br/>copied into new repos]\n        O2[Diverges over time;<br/>not centrally updated]\n    end\n    Use{What you need} --> RW\n    Use --> CA\n    Use --> OT\n    RW -.best for.-> RWUse[Cross-repo standard pipelines<br/>centrally maintained]\n    CA -.best for.-> CAUse[Reusable steps within workflows<br/>e.g., setup, login, deploy]\n    OT -.best for.-> OTUse[Bootstrapping new repos]\n    style RW fill:#bbdefb\n    style CA fill:#c8e6c9\n    style OT fill:#fff9c4\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs and When to Use Each",
            "content": "**Reusable workflow vs composite action.** Reusable workflows can have multiple jobs and run on their own runners; composite actions are inline steps. Use reusable workflows for full pipelines (build-test-scan-publish); use composite actions for sequences of steps (login + cache + setup).\n\n**Versioning.** Pin reusable workflows to a tag or SHA, not a branch \u2014 `org/.github/.github/workflows/build.yml@v1.2.0`. Pinning to `main` means anyone with write access to the central repo can change behavior in every consuming pipeline.\n\n**Secrets passing.** Reusable workflows do not inherit caller secrets by default. Pass explicitly with `secrets:` block or use `secrets: inherit` (passes everything \u2014 use carefully). Inheriting all secrets is convenient but expands the blast radius if the reusable workflow has a vulnerability.\n\n**Output and reuse limits.** A reusable workflow can be called from another reusable workflow (max nesting depth 4). Beyond that, GitHub rejects. Plan the abstraction levels: caller \u2192 deploy.yml \u2192 helm.yml is two levels and easy to reason about; deeper than that loses readability.\n\n**Org template drift.** Starter workflows copied into new repos diverge over weeks as teams modify them. The 50th repo is wildly different from the 1st. Reusable workflows are the only way to centrally maintain pipeline behavior across many repos."
        },
    },
    "sonarqube-code-quality-github-actions": {
        "diagram": {
            "title": "SonarQube Quality Gate in PR Workflow",
            "content": "```mermaid\nsequenceDiagram\n    participant Dev as Developer\n    participant GH as GitHub\n    participant W as Workflow\n    participant SQ as SonarQube/SonarCloud\n    Dev->>GH: open PR\n    GH->>W: pull_request event\n    W->>W: mvn verify with jacoco\n    W->>W: mvn sonar:sonar -Dsonar.pullrequest.key=...\n    W->>SQ: upload analysis\n    SQ->>SQ: compute new code coverage<br/>+ duplications + smells\n    SQ->>SQ: evaluate Quality Gate<br/>(e.g. coverage >= 80% on new code)\n    SQ->>GH: post status check<br/>+ inline PR comments\n    GH->>Dev: PR check shows pass/fail<br/>+ comments on lines\n    alt Quality Gate fail\n        GH->>Dev: merge button blocked\n    else Quality Gate pass\n        GH->>Dev: merge button enabled\n    end\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Quality Gates",
            "content": "**SonarCloud (hosted) vs SonarQube (self-hosted).** SonarCloud is cheaper for small teams and zero-maintenance; SonarQube is required if you have policy reasons to keep code internal. SonarCloud is free for public repos.\n\n**Quality Gate strictness.** A common gate: `Coverage on New Code >= 80%`, `Duplicated Lines on New Code <= 3%`, `Maintainability rating <= A`. Strict gates catch issues but block merges \u2014 calibrate to your team's reality. Starting too strict creates revolt; starting too loose makes the gate ceremonial.\n\n**Blocking vs informational.** Configure the SonarQube check as Required in branch protection to block merges, or Informational so the team sees results without blocking. Blocking is the right default for new code metrics; informational is fine for retrofitting onto a legacy codebase.\n\n**Coverage metric choice.** \"New code coverage\" focuses on PR diffs \u2014 fair to legacy code. \"Overall coverage\" is harder to game but penalizes legacy. Use new-code coverage as the primary blocker.\n\n**SonarQube vs JaCoCo + GitHub Actions report.** SonarQube adds duplication, code smells, security hotspots, technical debt estimation. JaCoCo alone gives just coverage. For coverage-only, JaCoCo + a GitHub Action like `madrapps/jacoco-report` is simpler and free."
        },
    },
    "environment-specific-deployments-github-actions": {
        "diagram": {
            "title": "Environment Promotion Pipeline",
            "content": "```mermaid\nflowchart LR\n    Build[Build artifact<br/>once] --> ImgT[image: SHA]\n    ImgT --> DevD[Deploy to dev<br/>environment: dev]\n    DevD --> DevT[Smoke test]\n    DevT -->|pass| StgApprove{Approve<br/>staging?}\n    StgApprove -->|approved| StgD[Deploy to staging<br/>environment: staging]\n    StgD --> StgT[Integration tests +<br/>load test]\n    StgT -->|pass| ProdApprove{Approve<br/>prod?<br/>2 reviewers}\n    ProdApprove -->|approved| ProdD[Deploy to prod<br/>environment: production]\n    ProdD --> Canary[Canary 5%]\n    Canary --> SLO{SLO check}\n    SLO -->|pass| Full[Full rollout 100%]\n    SLO -->|fail| Rollback[Auto rollback]\n    style ProdApprove fill:#fff9c4\n    style Rollback fill:#ff8a80\n    style Full fill:#c8e6c9\n```\n\n**Build once, promote the same artifact.** Never rebuild for prod \u2014 the artifact tested in staging must be the artifact deployed to prod. Different builds = different bugs."
        },
        "tradeoffs": {
            "title": "Trade-offs and Promotion Patterns",
            "content": "**Build-once vs rebuild-per-env.** Build-once is the only safe pattern \u2014 rebuilding for prod risks dependency drift, build environment differences, and the artifact-tested-not-deployed gap. Use the same image SHA from dev through prod.\n\n**GitHub Actions environments vs Helm values per env.** GitHub environments give you required reviewers, environment secrets, and deployment history. Helm values files give you per-env Kubernetes config. They compose well: GitHub environment for approval gates, Helm values for cluster config.\n\n**Auto-promote vs manual gate.** Auto-promote dev \u2192 staging on green tests is fast and safe. Auto-promote staging \u2192 prod is risky for any service with revenue or user impact \u2014 always require manual approval. Exception: feature flags can decouple deploy from release, making auto-promotion safer.\n\n**Per-PR preview environments.** Spin up an ephemeral env per PR for review \u2014 invaluable for frontend, useful for backend. Cost: each preview env consumes resources. Use `workflow_dispatch` to deploy on demand or `pull_request` event with cleanup on close.\n\n**Secrets rotation per environment.** Each env has its own secrets in GitHub environments. Rotation is per-env. Critical detail: prod secrets should NEVER appear in non-prod workflows \u2014 environment-scoped secrets enforce this automatically."
        },
    },
}

# --- jenkins-pipelines (6 Qs) ---
jenkins_upgrades = {
    "declarative-jenkins-pipeline-spring-boot": {
        "diagram": {
            "title": "Jenkins Declarative Pipeline Stages",
            "content": "```mermaid\nflowchart LR\n    Trig[SCM webhook<br/>or scheduled] --> Co[Checkout<br/>git scm]\n    Co --> Build[Build stage<br/>mvn package -DskipTests]\n    Build --> Test[Test stage<br/>mvn verify]\n    Test --> Sonar[SonarQube stage<br/>quality gate]\n    Sonar --> Img[Build Docker<br/>docker build]\n    Img --> Push[Push to registry<br/>withCredentials]\n    Push --> Deploy{Branch?}\n    Deploy -->|main| Stage[Deploy staging<br/>kubectl apply]\n    Deploy -->|tag v*| Prod[Deploy prod<br/>requires input gate]\n    Stage --> Done[Done]\n    Prod --> Done\n    style Sonar fill:#fff9c4\n    style Prod fill:#bbdefb\n```\n\nEach stage is a checkpoint visible in Jenkins Blue Ocean. Failures stop the pipeline at that stage."
        },
        "tradeoffs": {
            "title": "Trade-offs of Jenkins for Java CI/CD",
            "content": "**Declarative vs scripted pipeline.** Declarative is the modern default \u2014 structured, validated, easier to read. Scripted (Groovy) is more powerful but error-prone. Use declarative; drop into `script {}` blocks only when you need imperative logic.\n\n**Self-hosted Jenkins vs hosted CI.** Jenkins's plugin ecosystem is unmatched (1,800+ plugins). The cost is operational burden: master upgrades, agent management, plugin compatibility. For new projects, GitHub Actions or GitLab CI usually wins on simplicity.\n\n**Master + agent vs Kubernetes agents.** Static agents are simple but always-on (cost). Kubernetes agents (jenkins/kubernetes-plugin) spin up pods per-build \u2014 elastic and cheap. Always use K8s agents for new Jenkins setups.\n\n**Jenkinsfile location.** Storing Jenkinsfile in the repo (Pipeline-as-Code) is the right choice. Pipeline configuration in the Jenkins UI is unaudited and breaks code review.\n\n**Plugin sprawl.** Jenkins's strength is also its weakness \u2014 each plugin is an attack surface and an upgrade headache. Limit to plugins from the official Jenkins ecosystem and review the LTS update guide before upgrading."
        },
    },
    "jenkinsfile-structure-declarative": {
        "diagram": {
            "title": "Declarative Jenkinsfile Block Structure",
            "content": "```mermaid\nflowchart TB\n    P[pipeline] --> A[agent any/label/docker]\n    P --> Opts[options:<br/>timeout, retry, buildDiscarder]\n    P --> Tools[tools: maven, jdk]\n    P --> Env[environment: vars]\n    P --> Stages[stages]\n    Stages --> S1[stage Checkout]\n    Stages --> S2[stage Build]\n    Stages --> S3[stage Test<br/>parallel: unit + integration]\n    Stages --> S4[stage Deploy<br/>when: branch = main]\n    P --> Post[post:<br/>always, success, failure, unstable]\n    style P fill:#bbdefb\n    style Stages fill:#c8e6c9\n    style Post fill:#fff9c4\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs and Best Practices",
            "content": "**`agent any` vs specific labels.** `agent any` is convenient but runs on whatever agent is free \u2014 includes the Jenkins master if no other agents (security risk). Always specify a label or `none` (with per-stage agents).\n\n**`when` clauses.** Branch-conditional stages keep one Jenkinsfile serving all branches. Use `when { branch 'main' }` for deploy stages. The alternative \u2014 separate Jenkinsfiles per branch \u2014 leads to drift.\n\n**`post` block.** `post { always { archiveArtifacts ...; junit ...; cleanWs() } }` ensures test results are recorded and workspace cleaned even on failure. Without this, failed builds leave orphaned files.\n\n**Shared libraries.** For organizations with many pipelines, extract common stages into a Jenkins shared library (Groovy). One change to the library updates every pipeline. Without shared libraries, pipeline patterns diverge over time.\n\n**Parallel stages.** Tests and SAST can run in parallel within `parallel { }`. Cuts wall-clock time but multiplies agent usage \u2014 plan capacity. Do not parallelize stages with shared mutable state (e.g., both writing to the same artifact)."
        },
    },
    "jenkins-credentials-secrets-management": {
        "diagram": {
            "title": "Credentials Plugin and `withCredentials` Binding",
            "content": "```mermaid\nflowchart LR\n    UI[Jenkins UI:<br/>Manage Credentials] --> Store[Credentials Store<br/>encrypted at rest]\n    Store --> Scope{Scope}\n    Scope -->|Global| All[All jobs]\n    Scope -->|Folder| FolderJobs[Folder jobs]\n    Scope -->|Domain| DomainJobs[URL-restricted]\n    Pipe[Pipeline] -->|withCredentials block| Bind[Bind to env vars]\n    Bind --> Use[Use in stage]\n    Use --> Mask[Auto-masked in console]\n    Vault[Vault plugin / AWS Secrets] -.dynamic.-> Bind\n    style Mask fill:#c8e6c9\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs and Hardening",
            "content": "**Built-in credentials store vs Vault.** Built-in is convenient (encrypted in `secrets.xml` on master). Vault adds dynamic credentials and rotation. For mature orgs, Vault wins; for small teams, built-in plus rotation discipline is fine.\n\n**`withCredentials` scope.** Always wrap secret usage in `withCredentials { }` so the binding is scoped and masked. Storing secrets in `environment {}` block leaks them in build logs.\n\n**Credential types.** Use the right type: `Username with password` for HTTP, `SSH Username with private key` for git, `Secret file` for service-account JSON. Each type has correct masking and binding semantics.\n\n**Folder-scoped credentials.** A common pattern: per-team folder with its own credentials. Prevents one team's job from accidentally using another team's prod credentials.\n\n**Audit and rotation.** Jenkins credentials are not auto-rotated. Set up periodic rotation reminders and audit logs (Audit Trail plugin) to track usage."
        },
    },
    "jenkins-sonarqube-integration": {
        "diagram": {
            "title": "Jenkins + SonarQube Quality Gate Loop",
            "content": "```mermaid\nsequenceDiagram\n    participant J as Jenkins\n    participant SQ as SonarQube\n    J->>J: stage('SonarQube analysis')\n    J->>J: withSonarQubeEnv: mvn sonar:sonar\n    J->>SQ: POST analysis (token auth)\n    SQ->>SQ: compute metrics + Quality Gate\n    SQ-->>J: webhook callback when done\n    J->>J: stage('Quality Gate'): waitForQualityGate()\n    alt Gate passes\n        J->>J: continue pipeline\n    else Gate fails\n        J->>J: abortPipeline=true \u2192 stop\n    end\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs and Integration Patterns",
            "content": "**Webhook vs polling.** `waitForQualityGate(webhook=true)` (default with the SonarQube plugin) is event-driven \u2014 efficient. Polling would burn agent time waiting. Always use webhook.\n\n**`abortPipeline: true` vs `false`.** Abort halts the pipeline on gate failure (block deploy). False allows the pipeline to continue but marks the build unstable. Block for prod-bound branches; allow continuation for feature branches with informational reporting.\n\n**Per-PR analysis.** SonarQube's PR decoration mode comments inline on the PR. Requires `sonar.pullrequest.*` parameters. Worth setting up for every team \u2014 inline feedback is much more actionable than a build status.\n\n**Quality Gate scope.** Default \"Sonar way\" gate is reasonable for new code. Customize for legacy projects (focus on new-code coverage, not overall) so legacy debt doesn't block PRs.\n\n**Coverage tool integration.** Pair SonarQube with JaCoCo. Configure JaCoCo to write `target/site/jacoco/jacoco.xml`; SonarQube auto-discovers it. Without this, SonarQube reports 0% coverage."
        },
    },
    "jenkins-deploy-kubernetes": {
        "diagram": {
            "title": "Jenkins-to-Kubernetes Deploy Patterns",
            "content": "```mermaid\nflowchart TB\n    J[Jenkins pipeline] --> Method{Deploy method}\n    Method -->|kubectl direct| K1[withKubeConfig:<br/>kubectl apply]\n    Method -->|Helm| K2[helm upgrade --install]\n    Method -->|GitOps| K3[git commit to manifests repo<br/>ArgoCD syncs]\n    K1 --> Cred[Needs cluster<br/>kubeconfig stored<br/>in Jenkins]\n    K2 --> Cred\n    K3 --> NoCred[Jenkins never<br/>touches cluster]\n    Cred --> Risk[Cluster credentials<br/>in Jenkins = risk]\n    NoCred --> Safe[Cluster pulls,<br/>least privilege]\n    style Risk fill:#fff9c4\n    style Safe fill:#c8e6c9\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs and Kubernetes Deploy Strategies",
            "content": "**Direct kubectl vs Helm.** Direct `kubectl apply` is simplest but loses release tracking. Helm tracks releases (`helm list`, `helm rollback`) and templates per-environment. Use Helm for any non-trivial workload.\n\n**Push (Jenkins to cluster) vs Pull (GitOps).** Push requires Jenkins to hold cluster credentials \u2014 a security concern; a Jenkins exploit grants cluster access. Pull (GitOps) keeps clusters watching a manifest repo. CI commits to git, ArgoCD/Flux applies. Pull is the modern best practice.\n\n**`--wait` flag on Helm.** `helm upgrade --wait` blocks until all resources are Ready. Without it, the pipeline returns success the moment Helm submits manifests \u2014 even if pods crash-loop. Always use `--wait` with a `--timeout`.\n\n**Rolling vs blue-green vs canary.** Rolling is the K8s default and works for stateless apps. Blue-green needs two environments (cost). Canary needs Istio/Argo Rollouts (complexity). Pick based on risk tolerance and infrastructure maturity.\n\n**Smoke test step.** After `helm upgrade --wait`, add a smoke test stage: `curl /actuator/health/readiness` against the deployed service. Catches failures Helm doesn't (e.g., DB connection issues that don't fail pod readiness)."
        },
    },
    "github-actions-vs-jenkins": {
        "diagram": {
            "title": "Architecture Comparison",
            "content": "```mermaid\nflowchart TB\n    subgraph GHA[\"GitHub Actions\"]\n        GH[GitHub-hosted<br/>or self-hosted runners]\n        Y[YAML in .github/workflows/]\n        M[Marketplace<br/>20,000+ actions]\n    end\n    subgraph J[\"Jenkins\"]\n        Master[Jenkins master<br/>UI + scheduling]\n        Agent[Agents: static or K8s]\n        Plugins[1,800+ plugins]\n        JF[Jenkinsfile in repo]\n    end\n    Repo[Code repo] --> GHA\n    Repo --> J\n    GHA -.SaaS, no infra.-> Cloud[GitHub-hosted]\n    J -.you operate.-> Self[Self-hosted infra]\n    style GHA fill:#bbdefb\n    style J fill:#fff3e0\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs Side by Side",
            "content": "**Operational burden.** GitHub Actions: zero infra to manage on hosted runners. Jenkins: master upgrades, plugin compatibility, agent management, backups. For new projects, GHA wins decisively.\n\n**Plugin/marketplace ecosystem.** Jenkins has 1,800+ plugins covering every imaginable tool. GHA Marketplace has 20,000+ actions but quality varies. Jenkins wins for niche enterprise integrations; GHA wins for modern stack.\n\n**Self-hosted execution.** Jenkins is the gold standard for self-hosted CI. GHA self-hosted runners exist and are good but the runner setup story is less mature than Jenkins agents.\n\n**Cost.** GHA: $0 for public repos, free tier for private then per-minute. Jenkins: free software, but you pay for the hosts and the operator's time.\n\n**Pipeline-as-code.** Both support it (Jenkinsfile, .github/workflows). Jenkins's scripted Groovy is more powerful but more error-prone; GHA YAML is more constrained but simpler.\n\n**The pragmatic recommendation.** New projects: GitHub Actions if your code is on GitHub; GitLab CI if on GitLab; Jenkins only if you have organizational lock-in or need its specific plugin ecosystem. Existing Jenkins setups: maintain, but evaluate migration to GHA when the operational cost outpaces the migration cost."
        },
    },
}

# --- infrastructure-as-code (10 Qs) ---
iac_upgrades = {
    "terraform-core-concepts-providers-resources-state-modules": {
        "diagram": {
            "title": "Terraform Core Workflow and Object Model",
            "content": "```mermaid\nflowchart LR\n    HCL[.tf files<br/>HCL config] --> Init[terraform init<br/>install providers]\n    Init --> Plan[terraform plan<br/>compare desired vs actual]\n    Plan --> Apply[terraform apply<br/>create/update/destroy]\n    Apply --> State[(state file<br/>terraform.tfstate)]\n    State --> Plan\n    subgraph Objects[Object types]\n        P[provider<br/>aws, azurerm, google]\n        R[resource<br/>aws_instance, etc.]\n        D[data source<br/>read existing]\n        M[module<br/>reusable group]\n        V[variable / output]\n    end\n    HCL --> P\n    HCL --> R\n    HCL --> D\n    HCL --> M\n    HCL --> V\n    style State fill:#fff3e0\n    style Plan fill:#fff9c4\n    style Apply fill:#c8e6c9\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Terraform's Model",
            "content": "**Declarative state vs imperative scripts.** Terraform compares desired state (HCL) to actual state (cloud APIs) and computes the diff. Imperative scripts (Bash, Python with SDK) require you to write the diff logic yourself. Declarative is much safer at scale.\n\n**State as source of truth.** State is the single point of consistency \u2014 lose it and Terraform forgets what it owns. Always use remote state with locking (S3 + DynamoDB, or Terraform Cloud). Local state is acceptable only for prototypes.\n\n**Provider versions.** Pin provider versions (`required_providers { aws = \"~> 5.0\" }`). Floating provider versions cause unexpected behavior changes between team members and runs.\n\n**Resource vs module.** Use modules to encapsulate patterns (e.g., \"VPC with public/private subnets\"). Don't over-modularize \u2014 a resource used once does not need its own module. Rule of thumb: extract a module when it is used in 3+ places or is conceptually self-contained.\n\n**Terraform vs Pulumi vs CDK.** Terraform's HCL is intentionally limited \u2014 forces declarative thinking. Pulumi/CDK use general-purpose languages \u2014 more flexible but easier to write spaghetti. Terraform wins for ops; Pulumi wins for developer-led IaC."
        },
    },
    "terraform-state-management-remote-state": {
        "diagram": {
            "title": "Remote State with S3 + DynamoDB Locking",
            "content": "```mermaid\nsequenceDiagram\n    participant Dev1 as Dev 1<br/>terraform apply\n    participant TF as Terraform CLI\n    participant DDB as DynamoDB lock table\n    participant S3 as S3 state bucket\n    participant Dev2 as Dev 2<br/>terraform apply\n    Dev1->>TF: terraform apply\n    TF->>DDB: acquire lock (atomic write)\n    DDB-->>TF: lock acquired\n    TF->>S3: read current state\n    S3-->>TF: state.tfstate\n    Note over TF: compute plan, ask for approval\n    Dev2->>TF: terraform apply (concurrent)\n    Dev2->>DDB: try acquire lock\n    DDB-->>Dev2: LOCK HELD by dev1<br/>error: state locked\n    Dev1->>TF: confirm yes\n    TF->>TF: apply changes\n    TF->>S3: write new state\n    TF->>DDB: release lock\n    DDB-->>Dev2: lock free; retry\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Remote State",
            "content": "**S3 + DynamoDB vs Terraform Cloud vs Spacelift.** S3+DDB is free and self-managed. Terraform Cloud is managed but adds team workflow features. Spacelift/env0/Atlantis are alternatives. For small teams, S3+DDB is fine; for larger orgs, managed solutions earn their cost via PR-based workflows and policy enforcement.\n\n**State locking is critical.** Without locking, two `terraform apply` runs can corrupt state. Always enable DynamoDB locking with S3 backend. Test it: run two applies simultaneously and verify the second blocks.\n\n**State encryption at rest.** Enable S3 default encryption (SSE-S3 or KMS). State files contain secrets (passwords, RDS endpoints, IAM keys). Without encryption, anyone with bucket read access has all secrets.\n\n**State splitting.** One giant state file becomes slow and a single point of failure. Split by environment (dev/stg/prod state files), or by ownership (network team's state, app team's state). Use `terraform_remote_state` data source to read across.\n\n**State drift detection.** Manual changes (someone clicks in the AWS console) cause drift. `terraform plan` shows the drift. Run scheduled `plan` (without apply) in CI to detect drift early.\n\n**Workspace vs separate state.** Workspaces share one configuration but different state. Useful for ephemeral environments (preview envs). For long-lived dev/stg/prod, separate state files in separate directories are clearer."
        },
    },
    "terraform-plan-and-apply-safely": {
        "diagram": {
            "title": "Safe Apply Flow with Plan Review",
            "content": "```mermaid\nflowchart LR\n    PR[PR opened] --> CI[CI: terraform plan]\n    CI --> Out[Plan output as<br/>PR comment]\n    Out --> Review{Review +<br/>approve?}\n    Review -->|No| Block[Cannot merge]\n    Review -->|Yes| Merge[Merge PR]\n    Merge --> Apply[CI: terraform apply<br/>using approved plan file]\n    Apply --> State[Update remote state]\n    State --> Notify[Slack notification]\n    style Out fill:#fff9c4\n    style Apply fill:#c8e6c9\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Safe Plan/Apply",
            "content": "**Plan-then-apply discipline.** Always `terraform plan -out=tfplan` then `terraform apply tfplan`. Apply without `-out` re-plans \u2014 if state changed between plan and apply, the actual changes differ from the reviewed plan.\n\n**Manual apply vs automated.** For prod, manual approval after PR merge is standard. For non-prod, auto-apply on merge is acceptable with strong tests.\n\n**Plan output as PR comment.** Atlantis, Terraform Cloud, and tools like tf-controller post plan diffs as PR comments. Reviewers see exactly what will change. Without this, PR review is just HCL syntax review \u2014 misses semantic issues.\n\n**Targeted apply.** `terraform apply -target=resource.foo` is for emergencies (one resource needs immediate fix). Avoid as a workflow \u2014 it bypasses dependency tracking and can leave state inconsistent.\n\n**Destroy protection.** Add `lifecycle { prevent_destroy = true }` on critical resources (RDS, S3 buckets, KMS keys). Stops accidental `terraform destroy` from nuking production data.\n\n**Refresh-only mode.** `terraform plan -refresh-only` updates state from real cloud state without proposing changes \u2014 useful for detecting drift without making changes."
        },
    },
    "what-is-terraform-module-how-to-create-one": {
        "diagram": {
            "title": "Module Composition",
            "content": "```mermaid\nflowchart LR\n    subgraph M[Module: vpc]\n        V[main.tf<br/>aws_vpc, subnets]\n        Vars[variables.tf<br/>cidr, az_count]\n        Out[outputs.tf<br/>vpc_id, subnet_ids]\n    end\n    Caller1[caller A] -->|module \"vpc\" {<br/>source = \"./modules/vpc\"<br/>cidr = \"10.0.0.0/16\"}| M\n    Caller2[caller B] -->|module \"vpc\" {<br/>source = \"./modules/vpc\"<br/>cidr = \"10.1.0.0/16\"}| M\n    Caller3[caller C] -->|module \"vpc\" {<br/>source = \"git::https://...\"}| M\n    style M fill:#bbdefb\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Module Design",
            "content": "**Local vs git vs Terraform Registry sources.** Local for repo-internal modules. Git for cross-repo sharing inside the org. Terraform Registry (public or private) for distributable modules.\n\n**Pinning module versions.** `source = \"git::ssh://...?ref=v1.2.0\"` or `version = \"~> 2.0\"` for Registry. NEVER point to `main` \u2014 module changes ripple unpredictably.\n\n**Module size.** A single-resource module is overkill. A module with 50 resources is hard to use. Sweet spot: 5\u201320 resources representing one logical unit (a VPC, a service, a database).\n\n**Inputs and outputs.** Inputs should be the variation surface (CIDR, instance type, name). Outputs should be every resource ID a caller might need. Underscoring outputs (`output \"_internal\"`) signals not-public; Terraform doesn't enforce this but it documents intent.\n\n**Validation.** Use `validation { condition = ... }` blocks on variables to fail fast on invalid input. Without validation, errors surface deep in resource creation, slow to debug."
        },
    },
    "terraform-variables-and-workspaces": {
        "diagram": {
            "title": "Variable Precedence and Workspace Selection",
            "content": "```mermaid\nflowchart TB\n    Sources[Variable sources<br/>highest \u2192 lowest precedence] --> CL[CLI -var]\n    CL --> ENV[TF_VAR_* env vars]\n    ENV --> AutoTfvars[*.auto.tfvars]\n    AutoTfvars --> Tfvars[terraform.tfvars]\n    Tfvars --> Default[default in variable block]\n    WS[terraform workspace] --> WSel{which workspace?}\n    WSel -->|default| WD[uses terraform.tfvars]\n    WSel -->|prod| WP[uses prod.tfvars or<br/>prod.auto.tfvars]\n    style Sources fill:#fff9c4\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Variables and Workspaces",
            "content": "**Workspaces vs separate state.** Workspaces share one configuration with different state. Quick for ephemeral envs (PR previews). Bad for long-lived envs because they hide environmental config in workspace name. For dev/stg/prod, separate directories with separate state files are clearer.\n\n**`terraform.tfvars` vs `*.auto.tfvars`.** Both auto-loaded. The `.auto.tfvars` pattern allows multiple files (e.g., `network.auto.tfvars`, `iam.auto.tfvars`) for organization.\n\n**Sensitive variables.** Mark `sensitive = true` on variables holding secrets so they don't appear in plan output. Better: use a secrets manager (AWS Secrets Manager) and read via data source instead of passing as variable.\n\n**Type constraints.** Use complex types (`list(object({ name=string, port=number }))`) to validate variable shape. Without types, errors appear at resource creation time.\n\n**Variable defaults.** Provide defaults for optional config; require values for environment-specific (no default forces explicit). Forces caller to be intentional about prod."
        },
    },
    "terraform-import-vs-terraform-taint": {
        "diagram": {
            "title": "import vs taint vs replace \u2014 Three State Modifications",
            "content": "```mermaid\nflowchart TB\n    Existing[Existing cloud resource<br/>not in TF state] --> Imp[terraform import<br/>resource.id]\n    Imp --> InState[Resource now in state<br/>but you must write HCL to match]\n    StateRes[Resource in state<br/>working but stale] --> Taint[terraform taint<br/>marks for replacement]\n    Taint --> Replace[Next apply destroys<br/>and recreates]\n    StateRes2[Resource in state] --> RepFlag[terraform apply<br/>-replace=resource.id]\n    RepFlag --> Replace\n    Note1[Modern Terraform 1.0+:<br/>-replace flag preferred over taint] -.-> Taint\n    style Imp fill:#bbdefb\n    style Taint fill:#fff9c4\n    style RepFlag fill:#c8e6c9\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs and Modern Practices",
            "content": "**`terraform import` vs `terraform plan -generate-config-out`.** Classic import: `terraform import resource.foo abc-123` adds to state but you must write the HCL. Newer approach (1.5+): `import {}` block in HCL + `plan -generate-config-out=imported.tf` generates the HCL automatically. Use the modern approach \u2014 less error-prone.\n\n**Importing vs adopting via tag.** For a cloud account with thousands of resources to import, terraformer or aws2tf can bulk-generate state and HCL. Worth using for migrations away from click-ops.\n\n**`taint` is deprecated** in modern Terraform. Use `terraform apply -replace=resource.id` instead. Same effect, more explicit.\n\n**Why replace?** Some changes can't be made in-place (e.g., changing an EC2 AMI requires destroy+create). Use `-replace` to force the recreation explicitly when the provider doesn't detect the need.\n\n**State manipulation risks.** `terraform state rm` removes a resource from state without deleting the cloud resource. Useful for migration but dangerous \u2014 the resource becomes invisible to TF. Always backup state before manipulation."
        },
    },
    "terraform-state-locking": {
        "diagram": {
            "title": "Lock Lifecycle During an Apply",
            "content": "```mermaid\nstateDiagram-v2\n    [*] --> Acquiring: terraform apply starts\n    Acquiring --> Locked: DynamoDB conditional write succeeds\n    Acquiring --> Failed: another apply holds lock\n    Failed --> [*]: error to user; retry later\n    Locked --> Reading: read state from S3\n    Reading --> Planning\n    Planning --> Applying\n    Applying --> Writing: write new state\n    Writing --> Releasing\n    Releasing --> [*]: DynamoDB delete\n    note right of Locked: Other terraform operations<br/>see error: state locked\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Locking",
            "content": "**Always enable locking.** Free, prevents corruption, basically zero downside. The only acceptable unlocked state is local-only state for personal prototypes.\n\n**Lock timeout.** Default lock has no timeout. A crashed `apply` leaves the lock in place forever. `terraform force-unlock <lock-id>` releases it manually. Document the runbook for this.\n\n**`-lock-timeout` flag.** `terraform apply -lock-timeout=10m` waits up to 10 minutes for the lock instead of failing immediately. Useful in CI to handle concurrent runs.\n\n**Lock granularity.** Lock is per-state-file. If you split state by environment, each environment is independently lockable \u2014 a long staging deploy doesn't block prod work.\n\n**Lock backend choices.** S3+DynamoDB (AWS), Azure Storage (built-in lease), Google Cloud Storage (object generation). Terraform Cloud handles locking automatically.\n\n**Lock observability.** A persistent lock means a stuck or crashed apply. Monitor lock age via Cloud Watch on DynamoDB \u2014 alert if a lock is held >30 minutes."
        },
    },
    "provision-spring-boot-infrastructure-with-terraform": {
        "diagram": {
            "title": "End-to-End Spring Boot Infra Stack via Terraform",
            "content": "```mermaid\nflowchart TB\n    TF[Terraform config] --> Net[VPC + subnets + IGW]\n    Net --> SG[Security Groups]\n    Net --> RDS[RDS PostgreSQL]\n    Net --> ECR[ECR repository]\n    Net --> EKS[EKS cluster +<br/>node group]\n    EKS --> Helm[Helm release<br/>via terraform-provider-helm]\n    Helm --> Pod[Spring Boot pods]\n    Pod -->|read| RDS\n    Pod -->|pull image| ECR\n    Net --> ALB[Application LB]\n    ALB --> Pod\n    R53[Route53 record] --> ALB\n    style RDS fill:#fff3e0\n    style EKS fill:#e3f2fd\n    style Pod fill:#c8e6c9\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs and Layering",
            "content": "**Single-state vs split-state.** Putting VPC, RDS, EKS, and app deploy in one state is convenient for small projects but slow at scale (every plan re-checks all resources). Split into base infra (VPC, RDS) and app layer (EKS workloads). The app layer reads outputs from base via `terraform_remote_state`.\n\n**Terraform vs cloud-native IaC (CDK, Pulumi).** Terraform HCL is universal across clouds. AWS CDK is more powerful for AWS-only with full TypeScript/Python. Terraform wins for multi-cloud or for ops teams; CDK wins for single-cloud dev teams.\n\n**Provisioning vs deploying.** Terraform is best at provisioning long-lived infrastructure (VPC, RDS, EKS cluster). It's mediocre at deploying applications (Helm release via TF works but Argo CD is better). Use Terraform for infrastructure, GitOps for app deploys.\n\n**Drift between TF and reality.** Apps team modifying K8s resources outside Terraform creates drift. Either gate all changes through Terraform (strict, slow) or carve out clear ownership (network/RDS/EKS via TF; K8s workloads via GitOps).\n\n**Cost guards.** Infracost in CI estimates cost change of each PR. Without it, an innocent-looking variable change can 10x the bill. Worth adding for any non-trivial Terraform repo."
        },
    },
    "terraform-data-sources-when-to-use": {
        "diagram": {
            "title": "data Source vs resource",
            "content": "```mermaid\nflowchart LR\n    R[resource block] -->|create + manage| Cloud[Cloud API]\n    D[data source block] -->|read existing| Cloud\n    Cloud --> S[State]\n    R -.adds to state.-> S\n    D -.does not modify state.-> S\n    Use1[Use case: VPC owned by another team] --> D\n    Use2[Use case: lookup latest AMI] --> D\n    Use3[Use case: find existing IAM role] --> D\n    Use4[Use case: create new RDS] --> R\n    style R fill:#fff3e0\n    style D fill:#bbdefb\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Data Sources",
            "content": "**Data source vs hardcoded value.** A data source for the latest Amazon Linux AMI keeps you current. A hardcoded AMI ID is stable but stale. For prod, hardcode and update intentionally; for dev, use data source for convenience.\n\n**Data source vs `terraform_remote_state`.** Both read external info. Data source queries the cloud API directly. `terraform_remote_state` reads another TF state file's outputs. Data source is more decoupled (no shared state); remote_state is tighter and shows dependencies in the graph.\n\n**Data source refresh on every plan.** Data sources are queried on every `plan` and `apply`. If they're slow (paginated API listing thousands of resources), plan time suffers. Cache infrequently-changing values manually.\n\n**Data source as input validation.** A data source that fails on missing resource is a useful pre-condition (e.g., `data.aws_vpc.shared` failing means the network team hasn't created it yet). Surfaces the dependency problem early.\n\n**Filter precision.** Loose filter \u2192 multiple results \u2192 error. Tight filter \u2192 specific resource. Use `most_recent = true` and unique tag filters to be deterministic."
        },
    },
    "how-to-test-terraform-configurations": {
        "diagram": {
            "title": "Terraform Testing Pyramid",
            "content": "```mermaid\nflowchart TB\n    Pyr[Test layers, top \u2192 bottom: cheaper + faster] --> L1[Static analysis<br/>terraform fmt, validate, tflint, tfsec]\n    L1 --> L2[Plan-based tests<br/>terraform plan + assertion]\n    L2 --> L3[Module tests<br/>terraform test 1.6+]\n    L3 --> L4[Integration tests<br/>Terratest in real account]\n    L4 --> L5[Manual / staging environment]\n    style L1 fill:#c8e6c9\n    style L2 fill:#fff9c4\n    style L3 fill:#bbdefb\n    style L4 fill:#ffe0b2\n    style L5 fill:#ffcdd2\n```"
        },
        "tradeoffs": {
            "title": "Trade-offs of Terraform Testing",
            "content": "**Static analysis is cheap and high-ROI.** `tflint` catches common mistakes; `tfsec`/`checkov` catches security misconfigurations (open security groups, unencrypted S3 buckets). Run on every PR.\n\n**`terraform test` (1.6+).** Native testing framework with mock providers and assertion blocks. Good for module-level logic. Replaces older third-party tools for many cases.\n\n**Terratest.** Go-based integration tests. Spins up real infrastructure, validates with API calls or curl, tears down. Slow (minutes per test) and incurs cloud cost. Use for module gold-standard tests, not on every PR.\n\n**Plan-only tests.** `terraform plan` followed by parsing the JSON plan and asserting resources are correct. Fast (seconds), no real cloud changes. Good middle ground.\n\n**Cost vs confidence.** Static + plan tests on every PR; Terratest nightly or pre-release; staging env validates end-to-end. Diminishing returns the further down the pyramid you go.\n\n**Drift testing.** Schedule `terraform plan` (no apply) periodically and alert on non-empty plans. Detects manual changes drifting from IaC."
        },
    },
}


def main():
    files = [
        ("cicd-fundamentals/complete-qa.json", fundamentals_upgrades),
        ("github-actions/complete-qa.json", github_upgrades),
        ("jenkins-pipelines/complete-qa.json", jenkins_upgrades),
        ("infrastructure-as-code/complete-qa.json", iac_upgrades),
    ]
    for rel, ups in files:
        path = os.path.join(ROOT, rel)
        log = insert_sections(path, ups)
        print(f"\n=== {rel} ===")
        for slug, msg in log.items():
            print(f"  {slug}: {msg}")


if __name__ == "__main__":
    main()
