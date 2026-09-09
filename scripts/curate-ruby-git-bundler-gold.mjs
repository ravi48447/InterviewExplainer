#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const domainRoot = "content/ruby-backend-fresher";
const moduleRoot = path.join(domainRoot, "git-and-bundler-basics");
const legacyRoot = path.join(domainRoot, "git-and-build-basics");
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const migrations = [
  { source: "git-basics", target: "git-workflow", slug: "ruby-git-basics" },
  { source: "bundler-basics", target: "bundler-gemfile", slug: "ruby-bundler-basics" },
  { source: "gemfile-basics", target: "bundler-gemfile", slug: "ruby-gemfile-basics" },
];

for (const migration of migrations) {
  const sourceFile = path.join(legacyRoot, migration.source, "complete-qa.json");
  const targetFile = path.join(moduleRoot, migration.target, "complete-qa.json");
  if (!fs.existsSync(sourceFile)) continue;
  const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  const target = JSON.parse(fs.readFileSync(targetFile, "utf8"));
  const question = source.questions?.find((entry) => entry.slug === migration.slug);
  if (!question) throw new Error(`${sourceFile}: missing ${migration.slug}`);
  if (!target.questions.some((entry) => entry.slug === migration.slug)) {
    target.questions.push(question);
    fs.writeFileSync(targetFile, `${JSON.stringify(target, null, 2)}\n`);
  }
}

const lessons = {
  "ruby-git-basics": {
    question: "What do `git status`, `add`, `commit`, `pull`, and `push` do?",
    title: "Essential Git Commands and Their Boundaries",
    answerSize: "standard",
    direct: "`git status` compares the working tree and staging area with the current commit; `git add` copies selected changes into the staging area; `git commit` records the staged snapshot in the local repository; `git pull` fetches remote commits and integrates them into the current branch; and `git push` sends reachable local commits to a remote branch. `add` does not upload code, `commit` does not include unstaged changes, and `push` does not first bring remote work into your branch.",
    quick: [
      "`status` shows untracked, modified, staged, and branch information.",
      "`add` selects the exact file content for the next commit.",
      "`commit` records only the staged snapshot in local history.",
      "`pull` fetches remote work and then integrates it locally.",
      "`push` publishes local commits when the remote accepts the update.",
    ],
    interview: [
      "- Git tracks snapshots through a local workflow before anything reaches a server. The working tree contains the files I am editing, the staging area—also called the index—contains the proposed next snapshot, and the current commit is the last recorded snapshot on the branch.",
      "- `git status` explains the differences between those states. `git add app.rb` stages the current content of that file. If I edit it again, the new edit remains unstaged until I add it too. `git commit` then creates a local commit from exactly what is staged, together with its parent and message.",
      "- For example, after fixing a validation I run `git diff`, stage the implementation and its test, inspect `git diff --staged`, and commit them together. Unrelated debugging output remains in the working tree instead of leaking into the commit.",
      "- `git pull` is a convenience operation that first fetches remote references and then integrates the selected upstream branch, normally by merge or rebase according to configuration. `git push` sends local commits and asks the remote reference to advance. A push can be rejected if the remote branch has work I do not yet contain.",
      "- The key boundaries are that `add` is not an upload, `commit` is not a server action, and unstaged edits are not part of a normal commit. I use `status` and staged diff before every commit so the recorded snapshot says one clear thing.",
    ],
    deepTitle: "Follow one change through Git's four locations",
    deep: [
      "A new edit begins only in the working tree. Git can show how it differs from the index with `git diff`. Staging copies the chosen version into the index; it does not freeze the file, so later working-tree edits can exist beside a staged version of the same path.",
      "A commit turns the index into an immutable repository object and moves the current branch reference to it. Other local branches and remote-tracking references do not move automatically. This is why a developer can create several commits while offline and publish them later.",
      "Fetching and integrating are separate ideas. `git fetch` updates knowledge of remote references without changing the working tree. A merge combines histories with a merge commit when necessary; a rebase replays local commits onto a new base. `pull` performs a fetch followed by the configured integration strategy, so checking the branch and working state first prevents surprises.",
      "Pushing asks a remote to update one or more references. Normal servers reject a non-fast-forward update because it could discard commits that already exist there. Incorporating remote work and resolving conflicts locally creates a history the remote can accept without losing another person's snapshot.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Where each everyday Git command moves data",
    visual: fence("mermaid", [
      "flowchart LR",
      "  W[working tree] -->|git add| I[staging area / index]",
      "  I -->|git commit| L[local commits]",
      "  L -->|git push| R[remote branch]",
      "  R -->|git fetch| T[remote-tracking reference]",
      "  T -->|merge or rebase| L",
      "  S[git status] -. compares .-> W",
      "  S -. compares .-> I",
      "  S -. compares .-> L",
    ]),
    codeLanguage: "bash",
    codeTitle: "Inspect the snapshot before recording it",
    code: [
      "git status",
      "git diff",
      "git add app/models/order.rb test/models/order_test.rb",
      "git diff --staged",
      "git commit -m 'Validate positive order quantity'",
      "git pull --rebase origin main",
      "git push origin feature/order-validation",
    ],
    followups: [
      "Can one file have both staged and unstaged changes?",
      "What two operations are normally performed by `git pull`?",
      "Why can a remote reject a normal `git push`?",
    ],
  },
  "ruby-git-workflow-basics": {
    question: "What is a healthy Git workflow for a development team?",
    title: "A Healthy Team Git Workflow",
    answerSize: "compact",
    direct: "A healthy Git workflow starts from an updated shared branch, makes one focused change on a short-lived branch, records small tested commits, publishes the branch, and uses a pull request for automated checks and review before merge. The developer resolves conflicts with the latest target branch and removes temporary code or secrets before review. The exact merge policy can vary; consistency, recoverability, and reviewable change size matter more than choosing merge or rebase everywhere.",
    quick: [
      "Start a short-lived branch from an updated shared branch.",
      "Keep each commit focused, tested, and free of unrelated files.",
      "Push the branch and open a pull request with purpose and verification.",
      "Run automated checks and respond to review before merging.",
      "Resolve conflicts locally and never commit secrets or generated noise.",
    ],
    interview: [
      "- A team workflow turns an individual edit into a reviewable, recoverable change. I start from the latest agreed base branch, create a short-lived feature or fix branch, and keep its scope small enough that another developer can understand it without reconstructing several unrelated tasks.",
      "- While working, I inspect the diff and create focused commits whose messages explain the intent. Tests, migrations, documentation, and configuration needed by the behaviour travel with it. Local-only settings, logs, build output, and secrets belong in appropriate ignore rules and never in history.",
      "- For example, a payment validation branch can contain one commit for the rule and tests, followed by a small review fix. I push the branch and open a pull request describing the problem, the chosen behaviour, how it was verified, and any rollout or migration concern.",
      "- Continuous-integration checks and human review catch different risks. Before merge, I bring the current target branch into my work using the team's merge or rebase policy, resolve conflicts by understanding both intended changes, rerun tests, and let the author of the surrounding code review uncertain resolutions.",
      "- Teams may use merge commits, squash merges, or rebasing. A healthy policy is documented and consistently applied; the enduring goals are small changes, protected shared branches, clear review, passing checks, and history that can be traced or reverted safely.",
    ],
    deepTitle: "Make every hand-off preserve intent",
    deep: [
      "Branching isolates an unfinished line of work, but isolation is temporary. The longer and broader a branch becomes, the more assumptions diverge from the shared branch. Short-lived branches reduce conflict size and allow review while the reason for a change is still fresh.",
      "A useful commit is an atomic explanation: the repository should remain coherent after it, and reverting it should remove one idea. Mechanical formatting mixed with behaviour changes hides review signals. Staging selected paths or hunks lets a developer separate work even when the working tree contains several experiments.",
      "A pull request is a quality gate and a communication record. Automated checks can prove repeatable facts such as compilation, tests, formatting, and migrations. Reviewers examine design, missing cases, security, clarity, and fit with neighbouring changes. A good description gives them the context the diff cannot provide.",
      "A conflict is not solved merely when marker lines disappear. Both branches changed a shared base, so the resolver must decide the combined intended result. After editing, stage the resolved file, inspect the final diff, and rerun affected checks. Never choose an entire side mechanically when both contributions matter.",
    ],
    visualType: "flow_diagram",
    visualTitle: "The review loop from shared branch to merge",
    visual: fence("mermaid", [
      "flowchart LR",
      "  B[update shared base] --> F[short-lived branch]",
      "  F --> C[focused commits plus tests]",
      "  C --> P[push and open pull request]",
      "  P --> Q{checks and review pass?}",
      "  Q -->|no| C",
      "  Q -->|yes| M[merge by team policy]",
      "  M --> D[delete branch and monitor change]",
    ]),
    codeLanguage: "bash",
    codeTitle: "A small feature-branch hand-off",
    code: [
      "git switch main",
      "git pull --ff-only origin main",
      "git switch -c feature/order-validation",
      "# edit and test the focused change",
      "git add app/models/order.rb test/models/order_test.rb",
      "git commit -m 'Validate positive order quantity'",
      "git push -u origin feature/order-validation",
      "# open a pull request, address review, then merge by team policy",
    ],
    followups: [
      "What makes a commit atomic and easy to revert?",
      "Why should a merge conflict be followed by relevant tests?",
      "How do automated checks and human review complement each other?",
    ],
  },
  "ruby-bundler-gemfile-workflow": {
    question: "How do Bundler, `Gemfile`, and `Gemfile.lock` work together?",
    title: "Bundler, Gemfile, and Gemfile.lock",
    answerSize: "standard",
    direct: "The `Gemfile` declares an application's direct gem dependencies, sources, groups, and allowed version ranges. Bundler resolves those requirements together with transitive dependencies and records the selected versions and platforms in `Gemfile.lock`. Later `bundle install` runs reuse the lockfile so development, CI, and deployment use the tested dependency graph. Ruby applications normally commit both files; reusable gems generally declare runtime dependencies in the gemspec and often do not publish a lockfile for consumers.",
    quick: [
      "`Gemfile` states direct dependencies and the versions the app permits.",
      "Bundler resolves the full graph, including dependencies of dependencies.",
      "`Gemfile.lock` records the exact resolved graph and platform information.",
      "`bundle install` respects a current lockfile instead of freely upgrading gems.",
      "Applications normally commit the lockfile; library consumption has different needs.",
    ],
    interview: [
      "- Bundler creates a consistent gem environment for a Ruby application. The `Gemfile` is the human-maintained declaration: it names direct gems, their sources, optional version requirements, and groups such as development or test. Those lines do not list every transitive dependency the application will load.",
      "- When Bundler resolves the bundle, it finds one compatible version for every direct and transitive gem across the supported platforms. It writes that snapshot to `Gemfile.lock`, including exact versions, dependency relationships, platforms, and the Bundler version that last changed the lockfile.",
      "- For example, the Gemfile may allow `rack`, `~> 3.1`. If the lockfile records Rack 3.1.12, a normal `bundle install` on CI installs the locked graph rather than silently selecting a newer allowed Rack release. An intentional update recalculates the relevant part of the graph and produces a reviewable lockfile diff.",
      "- Ruby applications should normally commit both `Gemfile` and `Gemfile.lock` so production runs the versions tested in development and CI. The `.bundle` directory is machine-specific and should not be committed. A reusable gem puts consumer dependencies in its gemspec; its development lockfile has different trade-offs because downstream applications perform their own resolution.",
      "- The `Gemfile` therefore expresses policy and the lockfile records one solved result. Bundler connects them by installing and activating that exact compatible set, preventing whichever gem happens to be globally installed from deciding application behaviour.",
    ],
    deepTitle: "Separate allowed ranges from the resolved dependency graph",
    deep: [
      "Dependency resolution is a graph problem. A Gemfile entry for Rails leads to requirements on Active Support, Active Record, Rack, and many more gems, and each of those brings constraints of its own. Bundler must select one version of each gem that satisfies the combined graph for the selected platforms.",
      "The lockfile preserves the successful solution. It distinguishes direct dependencies from resolved specifications and records sources and platforms. Two developers with the same application lockfile can install the same graph even when newer compatible releases appear after the file was created.",
      "A changed Gemfile does not mean every dependency should move. A normal install tries to preserve locked versions while satisfying the new declaration. A targeted update deliberately unlocks a selected gem and the dependencies that must move with it. Reviewing the lockfile shows whether the change stayed within the intended area.",
      "Groups influence which gems are installed or automatically required in an environment, but Bundler still resolves a single coherent graph. It cannot safely choose one version of the same gem for development and another for production inside one lockfile. Consistency is the feature the bundle is protecting.",
    ],
    visualType: "flow_diagram",
    visualTitle: "From dependency policy to repeatable installation",
    visual: fence("mermaid", [
      "flowchart LR",
      "  G[Gemfile: direct gems and ranges] --> R[Bundler resolver]",
      "  T[transitive gem requirements] --> R",
      "  R --> L[Gemfile.lock: exact graph and platforms]",
      "  L --> D[developer install]",
      "  L --> C[CI install]",
      "  L --> P[production install]",
    ]),
    codeLanguage: "ruby",
    codeTitle: "Declare policy in the Gemfile and commit its resolution",
    code: [
      "source 'https://rubygems.org'",
      "",
      "ruby '3.3.6'",
      "gem 'rails', '~> 8.0.0'",
      "gem 'pg', '>= 1.5', '< 2.0'",
      "",
      "group :development, :test do",
      "  gem 'rspec-rails', require: false",
      "end",
      "",
      "# Commit Gemfile and Gemfile.lock for an application.",
      "# Do not edit Gemfile.lock by hand; let Bundler resolve it.",
    ],
    followups: [
      "Why can exact versions in only the Gemfile still miss transitive dependencies?",
      "Should an application commit `Gemfile.lock`?",
      "Why does Bundler resolve one gem version across all groups?",
    ],
  },
  "ruby-bundler-basics": {
    question: "What is the difference between `bundle install`, `bundle update`, and `bundle exec`?",
    title: "Bundler's Install, Update, and Exec Commands",
    answerSize: "compact",
    direct: "`bundle install` makes the machine match the Gemfile and current lockfile, resolving only when the declarations require it. `bundle update GEM` intentionally unlocks and re-resolves that gem plus necessary dependencies within allowed ranges; `bundle update` without names may move the whole allowed graph. `bundle exec COMMAND` runs an executable inside the locked bundle so a different globally installed gem version cannot be activated. Install reproduces, update changes, and exec activates.",
    quick: [
      "`bundle install` reproduces the current locked dependency graph.",
      "It updates resolution only when Gemfile changes require a new solution.",
      "`bundle update GEM` intentionally moves a selected dependency within constraints.",
      "Bare `bundle update` can move every gem the Gemfile permits.",
      "`bundle exec` runs a command with the bundle's activated gem versions.",
    ],
    interview: [
      "- The three commands serve different stages of dependency management. `bundle install` is the normal setup and synchronization command. With a current lockfile it installs the recorded versions; after a Gemfile change it tries to satisfy the new declaration while preserving locked gems that do not need to move.",
      "- `bundle update` is an intentional version-changing operation. `bundle update rack` unlocks Rack and any dependencies that must be reconsidered, but still obeys the Gemfile's version requirements. Running it without gem names can update the entire graph to the newest versions those requirements allow.",
      "- For example, if a security fix is released for one HTTP gem, I update that gem by name, inspect the `Gemfile.lock` diff, run the suite, and commit the changed lockfile. I do not delete the lockfile or update everything unless a broader upgrade is the actual task.",
      "- `bundle exec rspec` is not an installer. It launches RSpec with the executables and gems from the current bundle activated. Without that boundary, a command found on the machine can use a global version that differs from the project's resolved version. A generated binstub such as `bin/rspec` can provide the same bundle-scoped convenience.",
      "- A simple memory rule is: install reproduces the chosen environment, update deliberately changes it, and exec runs inside it. Keeping those intentions separate makes dependency changes small enough to review and test.",
    ],
    deepTitle: "Control when the resolver is allowed to change its answer",
    deep: [
      "The lockfile is Bundler's starting solution. Installation checks that it still satisfies the Gemfile and current platform, then obtains missing gems without looking for unrelated upgrades. This makes a fresh checkout predictable instead of time-dependent.",
      "An update relaxes selected locked choices so the resolver can choose newer allowed versions. Transitive dependencies may also change because the selected gem declares a different range. A targeted command limits the search area but does not promise a one-line lockfile diff, so review remains necessary.",
      "Execution has a separate problem: RubyGems may know about several installed versions. Bundler setup restricts activation to the resolved graph. `bundle exec` establishes that environment before loading an executable, preventing a globally installed command from selecting incompatible libraries.",
      "CI and deployment should fail when the declared and locked state disagree rather than silently create a new production-only resolution. Updating belongs in a reviewed development change; installing and executing belong in repeatable automation.",
    ],
    visualType: "comparison_table",
    visualTitle: "Each Bundler command has one intent",
    visual: "| Command | Primary intent | Expected lockfile effect |\n|---|---|---|\n| `bundle install` | reproduce dependencies | none unless declarations require resolution |\n| `bundle update rack` | upgrade a selected area | Rack and required related changes |\n| `bundle update` | upgrade the allowed graph | potentially broad changes |\n| `bundle exec rspec` | run in the resolved environment | none |\n| `bin/rails test` | bundle-scoped binstub execution | none |",
    codeLanguage: "bash",
    codeTitle: "Keep a dependency upgrade targeted",
    code: [
      "bundle install",
      "bundle outdated rack",
      "bundle update rack",
      "git diff -- Gemfile.lock",
      "bundle exec ruby -Itest test/rack_adapter_test.rb",
      "# Commit the reviewed lockfile change with the tested upgrade.",
    ],
    followups: [
      "Can a targeted update change transitive dependencies too?",
      "Why is deleting `Gemfile.lock` a poor routine update strategy?",
      "What problem does `bundle exec` prevent?",
    ],
  },
  "ruby-gemfile-basics": {
    question: "How do you read gem versions, groups, and sources in a `Gemfile`?",
    title: "Reading a Gemfile",
    answerSize: "compact",
    direct: "A `Gemfile` names gem sources and direct dependencies. Each `gem` line may include version requirements, a group, platform condition, or alternate source such as `git` or `path`. `~> 2.1` means at least 2.1 and below 3.0, while `~> 2.1.4` stays below 2.2; `>=` alone permits all later versions. Groups describe environment use, and `require: false` prevents automatic require rather than preventing installation. The lockfile records the version actually selected.",
    quick: [
      "The global `source` tells Bundler where ordinary gems are resolved.",
      "A `gem` line names a direct dependency and optional version requirements.",
      "`~> 2.1` allows below 3.0; `~> 2.1.4` allows below 2.2.",
      "Groups organise environment use but still share one resolved gem version.",
      "`require: false` changes automatic loading, not dependency installation.",
    ],
    interview: [
      "- I read a Gemfile as the application's dependency policy. The `source` line identifies the normal gem repository, and each `gem` entry declares a direct dependency. Version requirements say which releases the application is prepared to accept; the exact resolved result appears in `Gemfile.lock`.",
      "- RubyGems requirements can be combined. `gem 'pg', '>= 1.5', '< 2.0'` states an explicit range. The pessimistic operator uses the last written version segment as the update boundary: `~> 2.1` means at least 2.1 and below 3.0, while `~> 2.1.4` means at least 2.1.4 and below 2.2.",
      "- For example, test tools can live in `group :development, :test` so production installation may omit that group. Bundler still resolves one version of a shared dependency across all groups; groups are not separate universes with conflicting versions.",
      "- Options change source or loading behaviour. A `git`, `github`, or `path` dependency uses code outside the normal RubyGems source and should be pinned and reviewed carefully. `require: false` tells automatic loading not to require the gem; the gem is still part of the bundle when its group is installed.",
      "- I avoid constraints that are looser than the compatibility the team has tested, but I also avoid unnecessary exact pins in the Gemfile because the application lockfile already supplies reproducibility. Every dependency change should produce an understandable declaration and a reviewed resolved diff.",
    ],
    deepTitle: "Read every line as a compatibility and trust decision",
    deep: [
      "The Gemfile DSL is evaluated by Bundler, so its entries can express conditions, but a straightforward declarative file is easier to audit. A single trusted global source avoids ambiguity about where indirect dependencies are downloaded. Alternate sources should be attached to the dependency that needs them.",
      "A version constraint creates a lower and upper compatibility promise. An exact version prevents even patch fixes until edited. A lone lower bound allows future major versions that may break the API. A pessimistic range gives controlled movement, with its precision determining the upper boundary. The project's tests must still verify that an allowed release actually works.",
      "Groups control installation and automatic requiring for environments such as development, test, or production. They do not allow two versions of one gem in the same resolved bundle. This property prevents code tested against one dependency from silently running against another when environments change.",
      "A Gemfile in an application differs from a gemspec in a reusable library. The gemspec communicates runtime and development dependencies to consumers; the application Gemfile composes the deployable environment. Understanding that boundary prevents a library's private development setup from unnecessarily constraining every downstream application.",
    ],
    visualType: "comparison_table",
    visualTitle: "Common Gemfile declarations and their meaning",
    visual: "| Declaration | Meaning | Important boundary |\n|---|---|---|\n| `gem 'rack'` | any compatible resolver choice | lockfile supplies exactness |\n| `gem 'rack', '~> 3.1'` | `>= 3.1` and `< 4.0` | later 3.x releases allowed |\n| `gem 'rack', '~> 3.1.4'` | `>= 3.1.4` and `< 3.2` | later 3.1.x releases allowed |\n| `group :test` | dependency used for test work | version still resolved globally |\n| `require: false` | do not auto-require | gem may still be installed |\n| `path:` or `git:` | alternate code source | pin and review the source |",
    codeLanguage: "ruby",
    codeTitle: "A readable Gemfile with bounded intent",
    code: [
      "source 'https://rubygems.org'",
      "",
      "gem 'rails', '~> 8.0.0'       # >= 8.0.0 and < 8.1",
      "gem 'pg', '>= 1.5', '< 2.0'",
      "",
      "group :development, :test do",
      "  gem 'rspec-rails', require: false",
      "end",
      "",
      "group :development do",
      "  gem 'rubocop', require: false",
      "end",
    ],
    followups: [
      "What is the difference between `~> 2.1` and `~> 2.1.4`?",
      "Does `require: false` stop Bundler from installing the gem?",
      "Why can a very loose lower-bound-only requirement be risky?",
    ],
  },
  "ruby-semantic-versioning-basics": {
    question: "What is semantic versioning, and how does it relate to gem constraints?",
    title: "Semantic Versioning and Gem Constraints",
    answerSize: "compact",
    direct: "Semantic Versioning uses `MAJOR.MINOR.PATCH` to describe changes to a declared public API: major for incompatible changes, minor for backward-compatible features, and patch for backward-compatible fixes. A `0.y.z` release is initial development and may change at any time; pre-release identifiers sort before the normal release, while build metadata does not affect precedence. Gem constraints express versions an application permits, but they cannot guarantee a gem author followed SemVer correctly—tests and lockfile review still matter.",
    quick: [
      "Major means an incompatible public-API change.",
      "Minor means backward-compatible functionality; patch means a compatible fix.",
      "Version zero indicates initial development without a stable public API.",
      "Pre-release labels have lower precedence; build metadata does not change precedence.",
      "Dependency constraints trust version policy, while tests verify real compatibility.",
    ],
    interview: [
      "- Semantic Versioning gives release numbers meaning relative to a declared public API. In `MAJOR.MINOR.PATCH`, a backward-incompatible API change increments major, backward-compatible functionality increments minor, and a backward-compatible bug fix increments patch. Advancing a higher component resets the lower components to zero.",
      "- For example, changing `Invoice#total` so existing callers need a new required argument is a major change. Adding an optional currency formatter without breaking callers can be minor, and correcting an incorrect rounding result without changing the contract can be patch.",
      "- SemVer has boundaries people often miss. Versions below 1.0.0 represent initial development and may change at any time. A version such as `2.0.0-rc.1` has lower precedence than `2.0.0`; build metadata after `+`, such as `2.0.0+sha.abc`, does not affect precedence.",
      "- RubyGems constraints use these numbers to describe an accepted range. `~> 2.3` allows later 2.x releases below 3.0, while `~> 2.3.4` stays below 2.4. The application's lockfile then records one exact chosen release until an intentional update.",
      "- SemVer is a communication contract, not an automatic proof of compatibility. A maintainer can misclassify a breaking change or an application can rely on undocumented behaviour, so dependency upgrades still need changelog review, tests, and a controlled lockfile change.",
    ],
    deepTitle: "Version numbers are promises about an explicit public API",
    deep: [
      "SemVer works only when a project can identify its public API. That API may be code, a command-line interface, a data format, or documented behaviour. Refactoring private internals can remain a patch when users observe no changed contract; a one-line public removal can require a major release.",
      "Pre-release identifiers communicate that a version may not satisfy the compatibility expectations of its normal release. Their parts participate in precedence comparisons. Build metadata identifies a build but is deliberately ignored for precedence, so two builds differing only after `+` have equal SemVer precedence.",
      "A dependency range converts the upstream promise into local upgrade policy. A wide range makes fixes and features easier to receive but trusts more future releases. A narrow range reduces surprise but increases manual maintenance and resolution conflict. An application lockfile separates permission from timing by recording exactly when one allowed release was adopted.",
      "Compatibility is contextual. Even a correct patch release can expose an application's accidental dependence on a bug, timing, or private API. Automated tests, deprecation review, and staged deployment are the evidence that a permitted version is safe for this application.",
    ],
    visualType: "comparison_table",
    visualTitle: "Map a public change to a version signal",
    visual: "| Change to declared public API | SemVer increment | Example transition |\n|---|---|---|\n| incompatible removal or required input | major | `2.4.1` → `3.0.0` |\n| backward-compatible feature | minor | `2.4.1` → `2.5.0` |\n| backward-compatible bug fix | patch | `2.4.1` → `2.4.2` |\n| initial development | version zero | `0.6.2` may still break |\n| release candidate | pre-release | `2.5.0-rc.1` < `2.5.0` |\n| build identity | metadata | `2.5.0+sha.abc` has equal precedence |",
    codeLanguage: "ruby",
    codeTitle: "Let RubyGems evaluate the accepted range",
    code: [
      "require 'rubygems'",
      "",
      "minor_range = Gem::Requirement.new('~> 2.3')",
      "patch_range = Gem::Requirement.new('~> 2.3.4')",
      "",
      "minor_range.satisfied_by?(Gem::Version.new('2.9.0')) # => true",
      "minor_range.satisfied_by?(Gem::Version.new('3.0.0')) # => false",
      "patch_range.satisfied_by?(Gem::Version.new('2.3.9')) # => true",
      "patch_range.satisfied_by?(Gem::Version.new('2.4.0')) # => false",
    ],
    followups: [
      "What must a project define before SemVer has useful meaning?",
      "How do pre-release labels and build metadata affect precedence differently?",
      "Why can a SemVer-compatible dependency update still break an application?",
    ],
  },
};

const desiredOrder = {
  "ruby-git-basics": 1,
  "ruby-git-workflow-basics": 2,
  "ruby-bundler-gemfile-workflow": 1,
  "ruby-bundler-basics": 2,
  "ruby-gemfile-basics": 3,
  "ruby-semantic-versioning-basics": 1,
};

const topicDirectories = ["git-workflow", "bundler-gemfile", "semantic-versioning"];
let curated = 0;
for (const topicDirectory of topicDirectories) {
  const file = path.join(moduleRoot, topicDirectory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  document.questions.sort((left, right) => desiredOrder[left.slug] - desiredOrder[right.slug]);
  for (const [index, question] of document.questions.entries()) {
    const lesson = lessons[question.slug];
    if (!lesson) throw new Error(`${file}: no lesson for ${question.slug}`);
    question.question = lesson.question;
    question.title = lesson.title;
    question.direct_answer = lesson.direct;
    question.last_updated = "2026-09-07";
    question.reading_time_minutes = lesson.answerSize === "standard" ? 8 : 6;
    question.order = index + 1;
    question.answer = {
      ...(question.answer ?? {}),
      sections: [
        { type: "key_points", title: "Quick Revision", content: lesson.quick.map((point) => `- ${point}`).join("\n") },
        { type: "speakable_answer", title: "Interview Answer", answerSize: lesson.answerSize, content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n") },
        { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep.join("\n\n") },
        { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
        { type: "code_example", title: lesson.codeTitle, content: fence(lesson.codeLanguage, lesson.code) },
      ],
    };
    question.followup_questions = lesson.followups;
    question.seo = {
      ...(question.seo ?? {}),
      metaTitle: `${lesson.title} | Ruby Interview Guide`,
      metaDescription: `Learn ${lesson.question} with a direct answer, verified example, practical boundary, and focused follow-up questions.`,
    };
    curated += 1;
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(lessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(lessons).length} Git and Bundler lessons`);
}

console.log(`Curated ${curated} canonical Git and Bundler questions.`);
