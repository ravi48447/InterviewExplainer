# Audit — git-build-tools

**Pillar:** P09 DevOps & Infrastructure
**Module:** M25 git-build-tools
**Topics present:** 6 (of 8 — `scenario-based` and `comparisons` are empty)
**Questions:** 22 (all written, no stubs)
**Benchmark sources:** Pro Git book (Chacon & Straub), Atlassian Git tutorials, Git SCM official docs, Maven: The Complete Reference, Gradle User Manual, Baeldung Maven series, Josh Long on Spring Boot build

---

## Module status — mostly clean structure, two content issues

22 questions with Zone 3 depth averaging ~565w and good code coverage (14 of 22 have ≥2 code blocks). No stubs, no CRITICALs.

The issues cluster into three patterns:

1. **Incomplete `interviewer_intent` in 7 questions** — all in git topics (git-internals, git-workflows, code-quality-gates)
2. **Command-line tool content with zero code** — 11 Qs have no code, including `git merge-vs-rebase`, `git cherry-pick`, `git-flow-vs-trunk`, `maven-vs-gradle`, `gradle-dependency-management`, `gradle-wrapper`, `gradle-incremental-build`. Tool content without tool commands is archetype-fail
3. **Analogy underutilization** — only 3 of 22 have analogies despite git/build tools being textbook analogy territory (rebase = "editing history book", bisect = "binary search for a bad commit", cherry-pick = "picking specific fruit", semver = "version license plate")

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Every git command question shows the actual command (`git rebase -i HEAD~3`, `git bisect start`, `git cherry-pick <sha>`) | **Failing on 4 of 7 git Qs** — merge-vs-rebase, git-flow-vs-trunk-based, resolving-merge-conflicts, cherry-pick-vs-merge-vs-rebase have 0 code |
| Every Maven/Gradle question shows pom.xml/build.gradle snippet | Mostly matching, but 7 Qs code-empty: maven-dependency-scopes, pom-inheritance, maven-vs-gradle, gradle-dep-mgmt, gradle-wrapper, gradle-incremental-build |
| Opening bolds the tool/command (`**rebase**`, `**cherry-pick**`, `**bisect**`, `**pom.xml**`, `**build.gradle**`) | **Failing** — 22 of 22 direct answers have zero bold anchors |
| Git content benefits from analogies (rebase = "rewriting the commit story", bisect = "binary search on commits") | Only 3 of 22 have analogies |
| Maven vs Gradle comparison always includes both pom.xml and build.gradle side-by-side | Q8 maven-vs-gradle has **0 code** — direct violation of the archetype |
| Interviewer intent / why-it's-asked is standard framing | **7 Qs missing complete `interviewer_intent`** — all in git section |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | INCOMPLETE INTERVIEWER_INTENT CLUSTER | **MAJOR** | 7 of 22 Qs have incomplete `interviewer_intent` — all in git topics. Batch authoring gap |
| S2 | CODE-EMPTY IN COMMAND-LINE TOPIC | **MAJOR** | 11 of 22 Zone 3s have zero code. For a CLI-tools + build-config module, this is archetype-fail. Particularly: merge-vs-rebase, cherry-pick-vs-merge-vs-rebase, git-flow-vs-trunk, resolving-merge-conflicts, maven-vs-gradle, gradle-dep-mgmt, gradle-wrapper |
| S3 | EMPTY TOPICS | **MAJOR** | `scenario-based` (0 Qs — "reset a pushed commit", "recover a deleted branch", "force-push gone wrong") and `comparisons` (0 Qs) |
| S4 | TOPIC-CATEGORY CONFUSION | MODERATE | `maven-vs-gradle-comparison` sits under `maven-build` topic — belongs in `comparisons`. `publish-java-library-maven-central-gradle` sits under `maven-build` but is cross-tool. `monorepo-vs-polyrepo` under `git-internals` is an architectural/organizational question, not a git-internals one |
| S5 | MODULE-WIDE ZONE 1 | MODERATE | 22 of 22 direct answers have zero bold anchors; 7 paragraph walls (concentrated in git topics) |
| S6 | ANALOGY UNDER-USE | MODERATE | 3 of 22 with analogies. Git+build = textbook analogy territory |
| S7 | NO GIT-HOOKS/ADVANCED GIT | MINOR | git-hooks has 1 Q (`code-quality-gates` topic Q1). Missing canonical advanced git: `git-reflog`, `git-stash-workflows`, `git-worktree`, `submodules-vs-subtrees` |

---

## Per-question issues

### `git-internals` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** git-interactive-rebase-squashing-commits | 639w / 1 code / no analogy / **II incomplete**. Analogy ("rewrite your commit history book before publishing") | MODERATE |
| **Q2** monorepo-vs-polyrepo | Paragraph wall (74w). 585w / **0 code** / no analogy / **II incomplete**. Topic-placement issue (S4). Also 0 code for a comparison Q | **MAJOR** |
| **Q3** git-bisect-find-bug-commit | Paragraph wall (78w — longest in module). 737w / 1 code / no analogy / **II incomplete**. Bisect = "binary search for the bug commit" is a standard analogy | MODERATE |

### `git-workflows` (4 Qs) — **worst topic code coverage**

| Q | Issue | Severity |
|---|---|---|
| **Q1** git-merge-vs-rebase | 562w / **0 code** / analogy / **II incomplete**. Merge-vs-rebase question without showing `git merge feature` vs `git rebase main` output is archetype-fail | **MAJOR** |
| **Q2** git-flow-vs-trunk-based-development | 525w / **0 code** / analogy / **II incomplete**. Branching model comparison without showing branch diagrams/commands | **MAJOR** |
| **Q3** resolving-merge-conflicts | Paragraph wall (64w). 700w / **0 code** / analogy / **II incomplete**. **MUST show** the conflict marker syntax (`<<<<<<<`, `=======`, `>>>>>>>`), `git status`, `git add`, `git rebase --continue` | **MAJOR** |
| **Q4** cherry-pick-vs-merge-vs-rebase-backporting | Paragraph wall (61w). 505w / 1 code / no analogy / **II incomplete**. 3-way comparison needs all 3 commands shown | MODERATE |

### `maven-build` (9 Qs) — **strongest topic structurally**

| Q | Issue | Severity |
|---|---|---|
| **Q1** maven-lifecycle-phases | 688w / 1 code / no analogy. Phases as a 23-step list — analogy ("factory assembly line with inspections at each station") | MINOR |
| **Q2** maven-dependency-scopes | 442w / **0 code** / analogy. Scopes question without pom.xml dependency block snippet | **MAJOR** |
| **Q3** maven-pom-inheritance-aggregation | 564w / **0 code** / analogy. Must show: parent pom + child pom + `<modules>` aggregation | **MAJOR** |
| **Q4** maven-transitive-dependencies-conflict-resolution | 586w / 2 code / no analogy — good | MINOR |
| **Q5** maven-multi-module-project | 537w / 2 code / no analogy | MINOR |
| **Q6** maven-profiles-environment-builds | 509w / 2 code / no analogy | MINOR |
| **Q7** publish-artifact-nexus-maven | 605w / 3 code / no analogy — good | MINOR |
| **Q8** maven-vs-gradle-comparison | 602w / **0 code** / no analogy. **Comparison without the comparative artifacts — pom.xml vs build.gradle side-by-side is the entire point**. Also belongs in `comparisons` topic | **MAJOR** |
| **Q9** publish-java-library-maven-central-gradle | 560w / 2 code / no analogy. Cross-tool content (Maven Central publishing works from both) | MINOR |

### `gradle-build` (5 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** gradle-build-script-spring-boot | 373w / 2 code — **only CLEAN question in module** | CLEAN |
| **Q2** gradle-dependency-management | 501w / **0 code** / no analogy. Gradle dep config without `implementation 'org.springframework.boot:...'` syntax is incomplete | **MAJOR** |
| **Q3** gradle-wrapper-why-use-it | 309w / **0 code** / analogy. Wrapper Q without `./gradlew` example + `gradle-wrapper.properties` | MODERATE |
| **Q4** gradle-multi-module-project | 519w / 3 code / no analogy | MINOR |
| **Q5** gradle-incremental-build | 700w / **0 code** / no analogy. Incremental build is task-input/output cache based — showing `@Input` / `@OutputFile` task annotations is standard | **MAJOR** |

### `code-quality-gates` (1 Q) — thin topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** git-hooks-code-quality | Paragraph wall (70w). 591w / 3 code / analogy / **II incomplete** | MODERATE |

**Topic gap:** `sonarqube-integration`, `pre-commit-vs-pre-push-hooks`, `enforcing-conventional-commits`, `branch-protection-rules`.

### `scenario-based` (0 Qs) — **empty**

Suggested content:
- `undo-pushed-commit-git` — `git revert` vs `git reset --hard` + force-push implications
- `recover-deleted-branch-git-reflog`
- `fix-committed-to-wrong-branch`
- `rebase-with-conflicts-safely`
- `squash-merged-pr-lost-history-recovery`

### `comparisons` (0 Qs) — **empty**

Move candidates: `maven-vs-gradle-comparison`, `monorepo-vs-polyrepo`, `git-flow-vs-trunk-based-development`, `cherry-pick-vs-merge-vs-rebase-backporting`. Add: `npm-vs-maven-vs-gradle-build-philosophy`, `mvn-vs-mvnd-vs-bazel`.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **9** | S1 II-incomplete cluster, S2 code-missing in tool content, S3 empty topics, Q2 monorepo-vs-polyrepo, Q1 merge-vs-rebase, Q2 git-flow-vs-trunk, Q3 resolving-merge-conflicts, Q2 maven-dependency-scopes, Q3 pom-inheritance, Q8 maven-vs-gradle, Q2 gradle-dep-mgmt, Q5 gradle-incremental |
| **MODERATE** | **7** | S4 topic placement, S5 bold, S6 analogy, Q1 rebase, Q3 bisect, Q4 cherry-pick, Q3 gradle-wrapper, Q1 git-hooks wall |
| **MINOR** | **6** | Well-shaped maven + gradle Qs needing polish |
| **CLEAN** | **1** | Q1 gradle-build-script-spring-boot |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 21
- `zone3_no_code_examples` × 11
- `zone3_no_analogy` × 19
- `zone1_interviewer_intent_incomplete` × 7
- `zone1_direct_answer_paragraph_wall` × 7

---

## Suggested fix order

1. **Batch-fill the 7 incomplete `interviewer_intent` fields in git topics** (S1) — mechanical, once per question.
2. **Add commands to the 4 git-workflows code-empty Qs** (Q1 merge-vs-rebase, Q2 git-flow-vs-trunk, Q3 resolving-merge-conflicts, Q4 cherry-pick). Each one is 1–3 lines of commands that transform the answer from abstract to actionable.
3. **Add pom.xml / build.gradle snippets to the 5 build-config code-empty Qs** — maven-dep-scopes, pom-inheritance, maven-vs-gradle, gradle-dep-mgmt, gradle-incremental. These are the most mechanical fixes in any module in the project.
4. **Author `comparisons` topic** — move existing comparison Qs there (4 candidates already exist).
5. **Author `scenario-based` topic** — the "git disaster recovery" questions are heavily asked in senior interviews.
6. **Module-wide bold-anchor + paragraph-wall pass**.
7. **Add analogies selectively** — rebase, bisect, cherry-pick, pom inheritance, gradle incremental build are the highest-value candidates.
8. **Expand code-quality-gates topic** (S7) — currently 1 Q.
