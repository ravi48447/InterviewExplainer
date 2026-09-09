#!/usr/bin/env node

import { curateIndexedModule, markdownTable } from "./lib/frontend-indexed-gold-curator.mjs";

const commands = (title, lines, note) => ({
  type: "code_example",
  title,
  content: ["```bash", ...lines, "```", "", note].join("\n"),
});

const table = (title, headers, rows) => ({
  type: "comparison_table",
  title,
  content: markdownTable(headers, rows),
});

const topicPacks = {
  "git-basics-and-branching": [
    {
      question: "What are the working tree, staging area, and commit in Git?",
      title: "Git's three everyday states",
      direct: "The working tree contains the files you are editing, the staging area selects the exact changes for the next snapshot, and a commit stores that snapshot in the repository history.",
      quick: ["Edit files in the working tree.", "Use `git add` to stage selected changes.", "Use `git commit` to save the staged snapshot.", "A commit does not automatically include every edited file."],
      interview: [
        "Git separates unfinished work from saved history. The working tree is the checked-out project on disk. The staging area, also called the index, holds the version of each file chosen for the next commit. A commit records that staged snapshot with its parent and message.",
        "For example, if `App.js` and `README.md` are edited but only `App.js` is added, the next commit contains the staged `App.js` change and leaves the README edit in the working tree. `git status` shows this difference before anything is committed.",
        "This separation lets a developer build a focused commit from related changes. It also means `git commit` is not a save-all button: unstaged edits remain local, and untracked files are ignored until they are explicitly added.",
      ],
      deepTitle: "How one edit becomes repository history",
      deep: [
        "The staging area stores proposed file content, not merely a checkbox beside a filename. If a staged file is edited again, Git can show a staged version and a newer unstaged version at the same time. Staging the file again updates what the next commit will contain.",
        "A commit points to a complete project snapshot and to one or more parent commits. Git uses those links to form history. The practical safety check is `git diff` for unstaged changes, `git diff --staged` for the proposed commit, and `git status` for the overall state.",
      ],
      support: commands("Inspect and save a focused change", ["git status", "git diff", "git add src/App.js", "git diff --staged", "git commit -m \"Fix empty state\""], "Only the staged version of `src/App.js` enters this commit."),
      followups: ["Can one file have both staged and unstaged changes?", "What information does a commit store?"],
    },
    {
      question: "How do you create, switch, and merge a Git feature branch?",
      title: "Feature branch workflow in Git",
      direct: "Create and switch with `git switch -c feature/name`, commit the feature on that branch, update the target branch, and merge with `git merge feature/name` after reviewing and testing the change.",
      quick: ["A branch is a movable name pointing to a commit.", "`git switch -c` creates and checks out a branch.", "Commits advance only the current branch.", "Merge combines the branch histories."],
      interview: [
        "A Git branch is a lightweight name that points to a commit. A feature branch lets work continue without moving the main branch until the change is ready. New commits move the currently checked-out branch pointer forward.",
        "For example, `git switch -c feature/search` creates a branch from the current commit. After the search work is committed, switching to `main` and running `git merge feature/search` brings those commits into main. If main did not move, Git can simply move its pointer forward in a fast-forward merge.",
        "Before merging, the developer should fetch current remote work, resolve any conflicts against the intended target, run the relevant tests, and review the diff. Deleting the feature branch later removes only its name; merged commits remain reachable from main.",
      ],
      deepTitle: "Branches are pointers, not copied folders",
      deep: [
        "Creating a branch does not duplicate the repository. Git creates another reference to the current commit. As work diverges, each branch points to a different tip while older commits are shared.",
        "A merge commit has two parents when both branches contain new commits. That preserves the point where two lines of work joined. Teams may instead require a squash merge for one combined commit, but that changes the recorded history and should be a deliberate repository policy.",
      ],
      support: commands("A small feature-branch flow", ["git switch -c feature/search", "git add src/Search.js", "git commit -m \"Add search form\"", "git switch main", "git merge feature/search"], "The merge target is the branch currently checked out when `git merge` runs."),
      followups: ["What is a fast-forward merge?", "What happens after a merged branch is deleted?"],
    },
    {
      question: "What is the difference between Git merge and rebase?",
      title: "Git merge versus rebase",
      direct: "Merge joins histories without rewriting existing commits, while rebase copies commits onto a new base to create a linear history. Avoid rebasing commits that other people already use unless the team has agreed to rewrite them.",
      quick: ["Merge preserves the existing branch history.", "Rebase creates new commit identities.", "Both can require conflict resolution.", "Shared published history should not be rewritten casually."],
      interview: [
        "Merge combines two development histories. When both sides have new work, it usually creates a merge commit with two parents. Rebase takes commits from one branch and reapplies their changes on top of another base, producing new commits and a straighter history.",
        "For example, a local feature branch can be rebased onto the latest `main` before opening a pull request. Its three commits receive new hashes on top of main. Merging the same branches would retain their original hashes and record where the histories joined.",
        "Rebase is useful for cleaning up private local work, while merge is safer for preserving shared history. Rebase does not make conflicts disappear; it may ask for a resolution while replaying each commit. Rewriting a public branch can force teammates to reconcile two versions of the same logical commits.",
      ],
      deepTitle: "Why rebased commits get new hashes",
      deep: [
        "For example, a Git commit includes its parent identity. Reapplying the same file changes on a different parent changes the commit object and therefore its hash. The old and rebased commits may look similar but are separate history objects.",
        "The best choice depends on the team's history policy. A linear history can be easier to scan, while merge commits retain branch context. Neither strategy improves the code by itself, so review and tests still matter.",
      ],
      support: table("History behavior", ["Operation", "History result", "Safe default"], [["Merge", "Keeps commits and may add a merge commit", "Shared branches"], ["Rebase", "Replays work as new commits", "Private local branches"], ["Squash merge", "Combines branch work into one target commit", "Repositories that prefer one commit per change"]]),
      followups: ["Why does rebase change commit hashes?", "Can both merge and rebase produce conflicts?"],
    },
    {
      question: "How do you safely undo changes in Git?",
      title: "Choose restore, reset, or revert by state",
      direct: "Use `git restore` for unwanted working-tree changes, `git restore --staged` to unstage, reset only for local history you can rewrite, and `git revert` to undo a published commit with a new commit.",
      quick: ["First identify whether the change is unstaged, staged, committed, or pushed.", "Restore changes file content or staging state.", "Reset moves a branch and can discard local work.", "Revert records a new inverse commit."],
      interview: [
        "The safe undo command depends on where the change exists. `git restore file` replaces an unstaged file with its index version, while `git restore --staged file` removes it from the next commit without deleting the working-tree edit.",
        "For example, if a bad commit has already been pushed and teammates may have pulled it, `git revert <commit>` creates a new commit that applies the opposite patch. History stays additive and other clones can pull the correction normally.",
        "`git reset` moves the current branch pointer and is suitable for private local commits when history rewriting is acceptable. Its `--hard` mode also replaces files, so it can destroy uncommitted work. Before undoing anything, inspect `git status`, the target commit, and whether the history is already shared.",
      ],
      deepTitle: "Undo content without confusing history",
      deep: [
        "Restore operates on files, reset operates primarily on the current branch and index, and revert adds history. Thinking in those three scopes makes the choice clearer than memorizing commands by name.",
        "A revert can itself conflict when later commits changed the same lines. The conflict must be resolved in the context of the current code, then the revert is completed and tested like any other change.",
      ],
      support: table("Undo decision", ["Situation", "Typical command", "Result"], [["Unstaged file edit", "`git restore file`", "Discard that edit"], ["Staged too early", "`git restore --staged file`", "Keep edit, remove from stage"], ["Private local commit", "`git reset`", "Move local branch"], ["Published bad commit", "`git revert <id>`", "Add an inverse commit"]]),
      followups: ["Why is revert preferred for shared history?", "What is the difference between mixed and hard reset?"],
    },
    {
      question: "How do you resolve a Git merge conflict?",
      title: "Resolve a merge conflict carefully",
      direct: "Read each conflicted file, choose or combine the intended code without leaving conflict markers, stage the resolved files, finish the merge or rebase, and run tests before sharing the result.",
      quick: ["`git status` lists conflicted paths.", "Conflict markers show the competing sections.", "The correct result may combine both sides.", "Stage, complete, then test the resolved code."],
      interview: [
        "A merge conflict means Git cannot safely choose the final content automatically. It usually happens when two histories change overlapping lines or one side deletes a file that the other side edits. The developer must decide what the project should contain now.",
        "For example, a file may contain `<<<<<<<`, `=======`, and `>>>>>>>` markers around two versions of a function. The resolution is not always 'ours' or 'theirs'; both changes may be required. After editing the final code and removing every marker, `git add` records that path as resolved.",
        "A normal merge is finished with `git commit`; a rebase continues with `git rebase --continue`. The result should be compiled and tested because a textually valid resolution can still break behavior. If the attempted operation is wrong, Git also provides merge or rebase abort commands to return to the earlier state.",
      ],
      deepTitle: "Git detects text overlap, not business intent",
      deep: [
        "Git's three-way merge compares both branch tips with their common ancestor. Changes on separate lines can often be joined automatically. Overlapping edits need a person because Git cannot infer which behavior the application requires.",
        "Good conflict prevention includes small focused commits, short-lived branches, and regular integration with the target branch. These habits reduce the distance between versions, but they cannot remove genuine conflicts when two features intentionally change the same behavior.",
      ],
      support: commands("Conflict-resolution loop", ["git status", "# edit each conflicted file and remove markers", "git add src/conflicted-file.js", "git status", "git commit   # for a merge"], "During a rebase, use `git rebase --continue` instead of creating the merge commit shown here."),
      followups: ["What does the common ancestor contribute to a merge?", "Why must a conflict resolution be tested?"],
    },
  ],

  "npm-and-package-json": [
    {
      question: "What is package.json, and which fields matter in a frontend project?",
      title: "Understanding package.json",
      direct: "`package.json` is the project manifest for Node-based tooling. It records package identity, runnable scripts, dependency ranges, module settings, and other metadata used by npm and development tools.",
      quick: ["`scripts` names repeatable project commands.", "`dependencies` are needed by the running package.", "`devDependencies` support development and builds.", "Version ranges describe acceptable releases, not necessarily the installed one."],
      interview: [
        "`package.json` is a JSON manifest at the project root. npm reads it to understand the project and its declared packages, while tools commonly use fields such as `scripts`, `type`, `engines`, and framework-specific settings.",
        "For example, a Vite app may define `\"dev\": \"vite\"` and `\"build\": \"vite build\"`. Running `npm run build` executes the named command from the local dependency environment, so every developer and CI can use the same entry point.",
        "The manifest usually stores version ranges rather than the exact dependency tree. The lockfile records concrete resolutions. Published libraries also rely on fields such as `name`, `version`, `main`, `exports`, and `files`, while a private application often sets `private: true` to prevent accidental publication.",
      ],
      deepTitle: "A manifest describes intent",
      deep: [
        "The `scripts` object is not limited to npm-owned commands; it is a convenient map from stable project names to shell commands. Local package executables are placed on the script path automatically, so a global installation is normally unnecessary.",
        "Dependency declarations are part of the source code because they describe what the project expects. Editing installed files under `node_modules` does not update that contract and will be lost on reinstall. Changes should happen in source, configuration, or an intentional package update.",
      ],
      support: { type: "code_example", title: "Small application manifest", content: "```json\n{\n  \"private\": true,\n  \"scripts\": { \"dev\": \"vite\", \"build\": \"vite build\" },\n  \"dependencies\": { \"react\": \"^19.1.0\" },\n  \"devDependencies\": { \"vite\": \"^7.0.0\" }\n}\n```\n\nThe lockfile, not this range alone, records the exact installed graph." },
      followups: ["Why should an application often set private to true?", "How do npm scripts find local executables?"],
    },
    {
      question: "What is the difference between dependencies and devDependencies?",
      title: "Runtime and development dependencies",
      direct: "Put packages required when the installed package runs in `dependencies`; put test runners, linters, compilers, and other development-only tools in `devDependencies`. For bundled frontend apps, the deployment process still needs dev tools during the build stage.",
      quick: ["Dependencies support runtime behavior.", "Dev dependencies support building, testing, or authoring.", "Frontend build tools may be absent from the final static output.", "The correct group depends on how the package is consumed."],
      interview: [
        "`dependencies` describe packages a consumer needs when the package runs. `devDependencies` describe tools used to develop, test, lint, or build it. npm keeps the two groups separate so production installation policies can omit development tools where appropriate.",
        "For example, an Express server normally needs `express` at runtime, while ESLint belongs in dev dependencies. In a React application built to static JavaScript, React may be bundled into the output and Vite is needed only during the build, but both groups must still be available in the CI build stage according to the project's setup.",
        "The distinction is especially important for published libraries because their consumers install runtime dependencies. It is less useful to blindly classify a package by its name: a code generator may be development-only in one project and invoked at runtime in another. The actual deployment and consumption model decides.",
      ],
      deepTitle: "Build time is different from serving time",
      deep: [
        "A static frontend often has two environments. The build environment installs source dependencies and creates browser assets. The serving environment may contain only HTML, CSS, and JavaScript files, so it does not need the original compiler or bundler packages.",
        "A server-rendered framework can require Node packages after deployment as well. Production installation options should be chosen only after identifying whether the target runs a server, serves a static export, or consumes the project as a library.",
      ],
      support: table("Where a package belongs", ["Package role", "Typical group", "Example"], [["Application runtime", "dependencies", "Express server framework"], ["Build or transpile", "devDependencies", "Vite or TypeScript compiler"], ["Test or lint", "devDependencies", "Vitest or ESLint"], ["Library runtime contract", "dependencies or peerDependencies", "Framework expected by consumers"]]),
      followups: ["Why can CI still need devDependencies?", "How does a published library change the decision?"],
    },
    {
      question: "Why should package-lock.json be committed?",
      title: "Reproducible installs with package-lock.json",
      direct: "`package-lock.json` records the resolved dependency graph and integrity data so developers and CI can install the same versions. Commit it for an application and update it together with package.json.",
      quick: ["The lockfile records exact resolved versions.", "It includes transitive dependencies.", "`npm ci` requires the manifest and lockfile to agree.", "Review dependency and lockfile changes together."],
      interview: [
        "`package-lock.json` is npm's description of the dependency tree selected for a project. It includes exact versions, resolved locations, integrity hashes, and relationships for direct and transitive packages.",
        "For example, `package.json` may allow any compatible `1.x` release while the lockfile records `1.4.2`. A teammate and CI using that lockfile can reproduce the selected graph instead of independently choosing a newer matching release.",
        "An application should normally commit its lockfile and change it in the same review as dependency declarations. It improves repeatability but does not prove that a package is safe; vulnerability review and planned updates still matter. Generated conflicts should be resolved with npm and the intended manifest, not by deleting the file without understanding the new graph.",
      ],
      deepTitle: "Ranges choose possibilities; locks record a resolution",
      deep: [
        "Semantic-version ranges in the manifest leave several releases acceptable. npm resolves those ranges along with nested package requirements, then stores the chosen graph. The lockfile therefore captures more than a flat list of top-level versions.",
        "The lockfile's integrity values help npm verify downloaded package contents against the recorded package archive. They are useful supply-chain evidence, but teams still need trusted registries, dependency review, and timely upgrades.",
      ],
      support: table("Manifest and lockfile", ["File", "Main job", "Typical review question"], [["package.json", "Declare direct dependency intent", "Is this package and range intended?"], ["package-lock.json", "Record the resolved full graph", "Do the actual version changes match the intent?"]]),
      followups: ["Does a lockfile remove the need for security updates?", "What does it record about transitive dependencies?"],
    },
    {
      question: "What is the difference between npm install and npm ci?",
      title: "npm install versus npm ci",
      direct: "`npm install` resolves and can update dependencies and the lockfile, while `npm ci` performs a clean install strictly from an existing matching lockfile. CI pipelines usually prefer `npm ci` for repeatability.",
      quick: ["`npm ci` requires package-lock.json.", "The manifest and lockfile must agree.", "It removes an existing node_modules before installing.", "Use install when intentionally changing dependencies."],
      interview: [
        "`npm install` is the normal development command for resolving dependencies. It can update `package-lock.json` when the manifest or requested package changes. `npm ci` is a clean, lockfile-based installation intended for automated and repeatable environments.",
        "For example, a build pipeline can run `npm ci` on a fresh checkout. If `package.json` asks for a dependency change that the lockfile does not contain, the command fails instead of silently rewriting the lockfile during the build.",
        "That strictness makes drift visible and is why CI commonly uses it. Developers still use `npm install package-name` when adding or upgrading a dependency, then commit both manifest and lockfile. Reproducibility also depends on compatible Node/npm versions and platform-specific packages, so those versions should be controlled when needed.",
      ],
      deepTitle: "A build should consume dependency decisions",
      deep: [
        "A CI run should normally verify the dependency state already reviewed in source control rather than make new resolution decisions. `npm ci` treats lockfile mismatch as an error and starts from a clean `node_modules`, making accidental local leftovers less likely.",
        "The command name does not make the build immutable on its own. Install scripts, remote registries, environment differences, and unpinned toolchains can still affect a build. A reliable pipeline controls those inputs according to its risk level.",
      ],
      support: table("Install commands", ["Command", "Best use", "Lockfile behavior"], [["npm install", "Local dependency work", "May create or update it"], ["npm ci", "CI and clean reproducible installs", "Requires and follows it strictly"]]),
      followups: ["Why does npm ci fail on lockfile mismatch?", "When should a developer use npm install instead?"],
    },
    {
      question: "How do caret, tilde, and exact npm version ranges differ?",
      title: "Reading npm semantic-version ranges",
      direct: "An exact version allows only that release, `~1.4.2` normally allows patch updates below 1.5.0, and `^1.4.2` normally allows compatible minor and patch updates below 2.0.0. Zero-major versions need extra care because caret boundaries are narrower.",
      quick: ["Exact means one version.", "Tilde usually permits patch-level movement.", "Caret usually permits compatible minor and patch movement.", "The lockfile records the version actually selected."],
      interview: [
        "npm version ranges are commonly based on semantic versioning: major, minor, and patch. An exact `1.4.2` selects only that version. `~1.4.2` accepts releases from `1.4.2` up to but not including `1.5.0`, while `^1.4.2` accepts compatible releases below `2.0.0`.",
        "For example, `1.4.9` satisfies both `~1.4.2` and `^1.4.2`, but `1.5.0` satisfies only the caret range. A lockfile may keep the project on an already resolved version until an install or update changes the resolution.",
        "Major version zero is treated more cautiously because the API is considered unstable: `^0.2.3` stays below `0.3.0`, and `^0.0.3` stays below `0.0.4`. Ranges express update policy, not safety. Teams still review changelogs, tests, and security notices before accepting dependency updates.",
      ],
      deepTitle: "Compatibility ranges and concrete installs",
      deep: [
        "Semantic versioning expects a major increase for incompatible API changes, a minor increase for backward-compatible features, and a patch increase for backward-compatible fixes. A range states which of those future releases the package manager may select.",
        "Package publishers do not always follow the convention perfectly, so a broader range can still introduce regressions. Automated update pull requests with tests make range movement visible without giving up useful bug and security fixes.",
      ],
      support: table("Common ranges from 1.4.2", ["Declaration", "Accepts", "Does not accept"], [["`1.4.2`", "1.4.2", "Any other release"], ["`~1.4.2`", ">=1.4.2 and <1.5.0", "1.5.0"], ["`^1.4.2`", ">=1.4.2 and <2.0.0", "2.0.0"]]),
      followups: ["Why is caret different for zero-major versions?", "How does a lockfile interact with ranges?"],
    },
  ],

  "vite-and-webpack-basics": [
    {
      question: "What problem do frontend build tools such as Vite and Webpack solve?",
      title: "Why frontend projects use build tools",
      direct: "Frontend build tools run a development environment and turn source modules, styles, and assets into browser-ready output. They can transform syntax, resolve imports, optimize files, and split code for deployment.",
      quick: ["They resolve source imports and assets.", "Development mode favors fast feedback.", "Production mode favors optimized output.", "The browser ultimately receives standard web assets."],
      interview: [
        "A frontend build tool connects the source a developer writes with the files a browser can efficiently load. It understands the project's module graph, applies configured transformations, handles imported assets, and creates production output.",
        "For example, a React project can import JSX, CSS, and an image from JavaScript. The development tool serves changes with fast updates, while a production build emits hashed JavaScript, CSS, and asset files that a web server or CDN can cache.",
        "Modern browsers support JavaScript modules, but a build tool still adds useful framework transforms, compatibility targets, asset processing, environment replacement, minification, and code splitting. A small static page may not need that complexity, so the tool should serve the project's needs rather than become a requirement by habit.",
      ],
      deepTitle: "The module graph drives the build",
      deep: [
        "Starting from one or more entry modules, the tool follows imports to form a dependency graph. That graph tells it which code and assets belong together, which modules are shared, and where lazy imports can form separate chunks.",
        "Development and production have different priorities. Development preserves useful source locations and minimizes update time. Production spends more work on optimized, cacheable files. Testing the production build catches assumptions hidden by the development server.",
      ],
      support: { type: "diagram", title: "Source-to-browser flow", content: "```mermaid\nflowchart LR\n  A[Source modules] --> B[Resolve imports]\n  B --> C[Transform code and assets]\n  C --> D[Split and optimize]\n  D --> E[Browser-ready files]\n```\n\nEvery step follows the imported dependency graph and the selected build mode." },
      followups: ["What is a module graph?", "Why should the production build be tested separately?"],
    },
    {
      question: "How does Vite serve development code and create a production build?",
      title: "Vite development and production modes",
      direct: "Vite serves source modules on demand through native browser ESM during development and uses a production build pipeline to emit optimized assets. The two modes share project configuration but do different work.",
      quick: ["Development requests modules on demand.", "Dependencies may be pre-bundled for faster startup and compatibility.", "Hot Module Replacement updates changed modules.", "`vite build` creates deployable production assets."],
      interview: [
        "In development, Vite starts a server that lets the browser request native ES modules. Source files are transformed as they are requested instead of waiting for the entire application to be bundled first. Dependencies may be pre-bundled to improve loading and convert incompatible module forms.",
        "For example, editing a React component lets Vite send a Hot Module Replacement update for the affected module. The browser can update the page quickly and, when the framework supports it, keep useful application state.",
        "For deployment, `vite build` creates optimized static assets rather than shipping the development server. A production preview is useful before release because base paths, environment values, chunk loading, and browser targets can behave differently from development.",
      ],
      deepTitle: "Fast feedback without confusing it with deployment",
      deep: [
        "For example, serving modules on demand makes development startup less dependent on total application size. Only the modules requested by the browser need immediate transformation, and cached transforms can be reused.",
        "The production build analyzes the complete graph for chunking and optimization. Its output should be hosted from the configured base path. Running a development server in production would miss the intended optimizations and expose tooling that is not designed as the deployed application server.",
      ],
      support: table("Vite modes", ["Mode", "Main goal", "Output"], [["Development", "Fast startup and updates", "Transformed modules served on request"], ["Production build", "Optimized deployment", "Static assets in the output directory"], ["Preview", "Locally inspect built files", "Serves the production output for checking"]]),
      followups: ["Why can production behave differently from development?", "What does dependency pre-bundling help with?"],
    },
    {
      question: "What is the main difference between Vite and Webpack?",
      title: "Vite versus Webpack",
      direct: "Vite uses native ESM and on-demand transforms for a fast development server, while Webpack traditionally builds a bundled dependency graph for development and production. Both can produce optimized production bundles and have extensible plugin systems.",
      quick: ["Vite emphasizes an on-demand ESM development server.", "Webpack is a highly configurable module bundler.", "Both understand module graphs and production chunks.", "Project ecosystem and requirements matter more than a simple speed slogan."],
      interview: [
        "Vite and Webpack both support modern frontend builds, but their common development models differ. Vite serves application modules to the browser on demand and transforms them as requested. Webpack traditionally compiles a module graph into bundles before serving it, although its caching and incremental features can make later builds fast.",
        "For example, a new Vite project often starts quickly with little configuration, while an established Webpack application may already depend on custom loaders, plugins, federation, or organization-specific build behavior. Replacing that setup is a migration decision, not just a benchmark comparison.",
        "Both tools can split code, process assets, create source maps, and optimize production output. Vite is often the simpler choice for a new supported framework project; Webpack remains suitable when its ecosystem or fine-grained configuration solves a real requirement. Build size, browser targets, plugins, and team maintenance should be measured in the actual project.",
      ],
      deepTitle: "Development architecture shapes perceived speed",
      deep: [
        "For example, an eager bundle does more graph work before the first page can load, while an on-demand server can defer transformation until a module is requested. As a project grows, that difference affects cold startup and update behavior.",
        "Production comparisons are less simple because both tools analyze and optimize a full graph. The chosen framework may also hide much of the tool configuration, so developers should follow the framework's supported path unless they have a concrete reason to customize it.",
      ],
      support: table("Practical comparison", ["Concern", "Vite", "Webpack"], [["Common dev model", "Native ESM with on-demand transforms", "Bundled module graph"], ["Configuration", "Strong modern defaults", "Broad and detailed control"], ["Established ecosystem", "Modern plugin ecosystem", "Long-standing loader/plugin ecosystem"], ["Production", "Optimized bundled output", "Optimized bundled output"]]),
      followups: ["Why is a real-project benchmark better than a slogan?", "Can both tools perform code splitting?"],
    },
    {
      question: "What are loaders and plugins in Webpack?",
      title: "Webpack loaders and plugins",
      direct: "Loaders transform imported module content before it joins the graph, while plugins hook into the wider compilation lifecycle to change bundles, assets, optimization, reporting, or generated files.",
      quick: ["A loader transforms matching modules.", "Loader rules commonly test file paths or extensions.", "A plugin participates in broader build events.", "Configuration order and options can change output."],
      interview: [
        "Webpack starts with JavaScript and JSON modules, and loaders teach it how to transform other source forms or newer syntax. A rule selects matching files and applies one or more loaders. Plugins work at the compilation level and can affect assets, optimization, environment values, analysis, or generated HTML.",
        "For example, a loader chain can turn Sass into CSS that Webpack can include, while an HTML plugin can create an HTML file containing the correct hashed script references. One acts on selected module input; the other coordinates a result across the build.",
        "Loaders can be chained, and Webpack applies a chain in its documented order, so copied configuration should be understood rather than guessed. Plugins are created as configured instances. Modern framework setups often provide these choices already; custom configuration is best kept only when it solves a measured requirement.",
      ],
      deepTitle: "Module transforms versus compilation hooks",
      deep: [
        "A transformed file becomes part of the same dependency graph as JavaScript imports. This is why an imported stylesheet or image can participate in hashing, watching, and output generation instead of being managed by an unrelated copy script.",
        "A plugin can inspect or modify information spanning many modules because it hooks into the compiler lifecycle. That power also makes plugin compatibility with the installed Webpack version important during upgrades.",
      ],
      support: table("Webpack extension points", ["Extension", "Scope", "Example job"], [["Loader", "Matching imported modules", "Transform TypeScript or Sass"], ["Plugin", "Compiler or compilation lifecycle", "Generate HTML or analyze chunks"]]),
      followups: ["Can loaders be chained?", "Why can plugin version compatibility matter?"],
    },
    {
      question: "How do source maps, tree shaking, and code splitting improve a frontend build?",
      title: "Three important production-build features",
      direct: "Source maps connect generated code to original source for debugging, tree shaking removes exports proven unused under safe module rules, and code splitting loads separate chunks only when their code path is needed.",
      quick: ["Source maps help locate original source lines.", "Tree shaking depends on analyzable ES modules and side-effect information.", "Dynamic import can create a lazy chunk.", "Too many chunks can add request overhead."],
      interview: [
        "The three features solve different problems. Source maps preserve a mapping from transformed output back to authored files. Tree shaking avoids including exports that static analysis can prove are unused. Code splitting divides the output so an entry page does not need every feature immediately.",
        "For example, `import('./AdminPage.js')` can place an admin screen in a separate chunk that ordinary visitors never download. If an error occurs in minified production code, an appropriately managed source map can point monitoring tools back to the original source line.",
        "These features have boundaries. Side effects and dynamic patterns can prevent safe removal, a lazy chunk still needs error and loading handling, and public source maps may expose readable source. Bundle reports and network measurements should confirm that optimization improves real loading rather than merely producing more files.",
      ],
      deepTitle: "Static knowledge enables safe optimization",
      deep: [
        "For example, ES module imports and exports are statically shaped, allowing a bundler to trace which bindings are used. Package side-effect declarations help it know whether an otherwise unused module can be omitted without changing behavior.",
        "Code splitting trades initial bytes for later requests and execution. Route-level boundaries often match user behavior well. Very small arbitrary chunks can add scheduling and request overhead, so chunk design should follow measured navigation paths.",
      ],
      support: table("Build feature and outcome", ["Feature", "Primary benefit", "Important limit"], [["Source maps", "Debug original source", "Access may need protection"], ["Tree shaking", "Remove provably unused code", "Side effects can block removal"], ["Code splitting", "Defer code until needed", "Adds chunk-loading work"]]),
      followups: ["Why do side effects matter to tree shaking?", "Where are useful code-splitting boundaries?"],
    },
  ],

  "browser-devtools": [
    {
      question: "How do you debug a CSS layout problem with the Elements panel?",
      title: "Debug CSS in the Elements panel",
      direct: "Inspect the exact element, read its computed styles and box model, identify which selector wins or which layout rule controls it, then test a small style change in DevTools before fixing the source file.",
      quick: ["Inspect the smallest wrong element.", "Check computed values, not only written rules.", "Look for crossed-out declarations and selector sources.", "Temporary DevTools edits disappear on reload."],
      interview: [
        "The Elements panel shows the live DOM and the CSS rules applied to a selected element. The Styles pane explains which declarations win, while Computed styles show the final values after inheritance, cascade, and browser defaults.",
        "For example, if a card is wider than expected, the box-model view can reveal content width, padding, border, and margin. A crossed-out `width` declaration shows that another rule won, and the linked source location identifies that selector.",
        "Editing a value in DevTools is a quick experiment, not the final fix. Once the controlling rule is known, change the real stylesheet and retest responsive sizes and states. Parent flex or grid rules may control a child's size, so inspecting only the child is sometimes insufficient.",
      ],
      deepTitle: "Debug the computed result of the cascade",
      deep: [
        "Browsers combine matching selectors, origin, cascade layers, importance, specificity, source order, inheritance, and defaults. Computed styles are the result of that process. Toggling one declaration at a time helps isolate the controlling rule.",
        "Layout badges and overlays can visualize grid tracks, flex alignment, gaps, and overflow. The tool shows current behavior, but the permanent solution should remain understandable in source rather than depending on a high-specificity override added only to win the cascade.",
      ],
      support: { type: "diagram", title: "A focused CSS-debugging path", content: "```mermaid\nflowchart LR\n  A[Inspect element] --> B[Read computed value]\n  B --> C[Find winning rule]\n  C --> D[Test one change]\n  D --> E[Fix source and retest]\n```" },
      followups: ["Why can a parent rule cause a child's layout issue?", "What does a crossed-out declaration mean?"],
    },
    {
      question: "How do you use the Network panel to debug a failed API request?",
      title: "Trace an API request in the Network panel",
      direct: "Filter to the request, inspect its URL, method, headers, payload, status, timing, response, and browser console message, then decide whether the failure is in request construction, network access, browser policy, or server behavior.",
      quick: ["Preserve the log when navigation reloads the page.", "Check the actual request URL and method.", "Read both status and response body.", "CORS and preflight failures need their own request evidence."],
      interview: [
        "The Network panel records browser requests and responses. For a failed API call, the useful evidence includes the final URL, HTTP method, request headers or body, response status, response headers, returned data, and timing phases.",
        "For example, a `404` with a JSON error means the server was reached but did not match the resource. A request marked as blocked by CORS can have a successful server response that JavaScript is not allowed to read, and an `OPTIONS` entry may show a failing preflight before the intended request.",
        "The panel should be opened before reproducing the issue, with Preserve log enabled when the page navigates. Sensitive authorization values should not be copied into public reports. After identifying the layer, confirm the fix with a fresh request rather than assuming that clearing the console changed network behavior.",
      ],
      deepTitle: "Status, policy, and timing tell different stories",
      deep: [
        "For example, an HTTP status describes a response from a server; a browser policy error can stop JavaScript from accessing that response; and a transport failure may produce no HTTP status at all. Treating every red row as the same error wastes time.",
        "Timing details separate queueing, connection, server wait, and download costs. A long waiting period may point to backend processing, while a delayed start can indicate connection or browser scheduling limits. Repeated samples are better evidence than one noisy request.",
      ],
      support: table("Network evidence", ["Observation", "Likely layer", "Next check"], [["4xx or 5xx with body", "Server/application", "Read status and response"], ["CORS console error", "Browser cross-origin policy", "Inspect Origin and allow headers"], ["Failed with no status", "DNS/TLS/connection/client block", "Read failure reason"], ["Long waiting time", "Server or network latency", "Compare server timing and repeated runs"]]),
      followups: ["How is a CORS failure different from a 500 response?", "What can an OPTIONS request reveal?"],
    },
    {
      question: "How do breakpoints help debug JavaScript in the Sources panel?",
      title: "Debug JavaScript with breakpoints",
      direct: "A breakpoint pauses JavaScript at a chosen condition so you can inspect scope values, the call stack, and execution one statement at a time instead of adding many logs and guessing the control flow.",
      quick: ["Line breakpoints pause before a statement runs.", "Conditional breakpoints reduce noisy pauses.", "The call stack shows how execution reached the line.", "Step over, into, and out answer different flow questions."],
      interview: [
        "A breakpoint pauses the JavaScript engine at a specific point. While paused, the Sources panel shows local and closure variables, watched expressions, the call stack, and controls for stepping through execution.",
        "For example, if a total becomes `NaN`, a conditional breakpoint such as `Number.isNaN(total)` can pause only when the bad state appears. The developer can inspect the current arguments and move up the call stack to find which caller supplied the unexpected value.",
        "Step over runs the current line without entering called functions, step into follows a call, and step out finishes the current function. Event-listener and exception breakpoints are useful when the responsible source line is unknown. Source maps are needed for a good authored-code view when production JavaScript is transformed.",
      ],
      deepTitle: "Pause at the state transition, not after the symptom",
      deep: [
        "For example, logs show selected values after code runs, while a pause exposes the complete reachable state at one moment. A condition or DOM/event breakpoint can stop close to the transition that creates the bug, reducing the number of unrelated executions to inspect.",
        "Async calls can make stacks less direct, but modern DevTools can preserve useful async ancestry. Minified code, optimized framework output, and missing source maps may limit readability, so reproducing the issue in a debuggable build is often the next step.",
      ],
      support: table("Stepping controls", ["Control", "Behavior", "Use it when"], [["Step over", "Run line without entering calls", "The called function is not the suspect"], ["Step into", "Enter the called function", "You need its internal flow"], ["Step out", "Finish current function", "You entered too deeply"], ["Resume", "Continue to next breakpoint", "You need the next relevant occurrence"]]),
      followups: ["When is a conditional breakpoint useful?", "What does the call stack reveal?"],
    },
    {
      question: "How do you investigate a slow page with the Performance panel?",
      title: "Find main-thread bottlenecks with a performance trace",
      direct: "Record the exact slow interaction, locate long tasks and expensive scripting, style, layout, or paint work, connect the cost to its source, make one change, and record again under the same conditions.",
      quick: ["Record a small reproducible interaction.", "Long main-thread tasks can delay input and rendering.", "Use the flame chart and summary to locate cost.", "Compare before and after under matching conditions."],
      interview: [
        "The Performance panel records what the browser does over time. A trace can show network activity, JavaScript tasks, style calculation, layout, painting, frames, and user-timing marks around a slow load or interaction.",
        "For example, clicking a filter may trigger a 300 ms JavaScript task followed by repeated layouts. Expanding the task in the flame chart can identify an expensive function, while layout events can suggest DOM measurement and mutation are being interleaved.",
        "A useful trace covers only the reproducible slow period and is taken under controlled CPU/network settings when comparisons matter. After changing the code, record the same action again. One trace is diagnostic evidence, not a guarantee of real-user performance, so field metrics and representative devices still matter.",
      ],
      deepTitle: "Frames compete for the main thread",
      deep: [
        "JavaScript, style calculation, layout, and much painting share the browser's main thread. A long uninterrupted task prevents timely input handling and can miss rendering frames even if total page load time looks acceptable.",
        "The right fix follows the dominant work: reduce or divide expensive JavaScript, avoid forced layout cycles, simplify heavy paint effects, or move suitable computation away from the main thread. Guessing an optimization before locating the cost can make code more complex without helping the user.",
      ],
      support: { type: "diagram", title: "Measure, locate, change, verify", content: "```mermaid\nflowchart LR\n  A[Record one action] --> B[Find longest work]\n  B --> C[Open source cause]\n  C --> D[Change one bottleneck]\n  D --> E[Record the same action]\n```" },
      followups: ["Why can a long task make input feel slow?", "Why should traces use matching conditions?"],
    },
    {
      question: "What can you inspect in the Application panel?",
      title: "Inspect browser storage, cache, and service workers",
      direct: "The Application panel exposes site data such as local and session storage, IndexedDB, cookies, cache storage, manifests, and service-worker state, making it useful for login, offline, and stale-data problems.",
      quick: ["Local and session storage hold string key-value data.", "IndexedDB stores structured client data.", "Cookies include scope and security attributes.", "Service workers and Cache Storage can serve stale resources."],
      interview: [
        "The Application panel groups browser-managed data and application capabilities for the current site. It can inspect and edit storage entries, view cookie attributes, explore IndexedDB, examine cache entries, and check service-worker registration and lifecycle state.",
        "For example, if a user still sees an old application after a deployment, the panel can show whether an active service worker and Cache Storage contain the earlier asset. If login disappears only in one route, cookie path, domain, SameSite, Secure, and expiry values provide concrete evidence.",
        "Clearing all site data may confirm that stored state is involved, but it can hide the actual product bug. The stronger diagnosis finds which key, cookie rule, cache strategy, or worker version is wrong. Storage can contain sensitive data, so screenshots and exported traces should be handled carefully.",
      ],
      deepTitle: "Persistence has scope and ownership",
      deep: [
        "Each storage system has different lifetime, capacity, access, and browser-policy behavior. Session storage is scoped to a page session, local storage persists for an origin, IndexedDB supports larger structured data, and cookies can travel with matching HTTP requests.",
        "A service worker can intercept network requests and answer from Cache Storage. That enables offline behavior but introduces a second response path. Update and invalidation rules must ensure a new deployment eventually controls open pages and receives the correct assets.",
      ],
      support: table("Application data areas", ["Area", "Typical use", "Common bug"], [["Cookies", "Server session or preference", "Wrong scope or SameSite rule"], ["Local/session storage", "Small client state", "Stale or malformed value"], ["IndexedDB", "Structured offline data", "Migration/version issue"], ["Service worker cache", "Offline and repeat loads", "Old asset remains served"]]),
      followups: ["Why can clearing all storage hide the root cause?", "How can a service worker serve an old asset?"],
    },
  ],

  "scenario-based": [
    {
      question: "A frontend works locally but fails after deployment. How do you debug it?",
      title: "Debug a local-versus-production failure",
      direct: "Reproduce the deployed failure, inspect console and network evidence, run the production build locally, then compare base paths, environment values, browser targets, server rewrites, case-sensitive filenames, and deployed assets.",
      quick: ["Capture the exact failing URL and environment.", "Check console errors and failed network requests.", "Build and preview the production output locally.", "Compare configuration rather than changing several things at once."],
      interview: [
        "A local development server and a deployed production build are different environments. The fastest route to the cause is to reproduce the exact deployed action and collect the first useful console error and failing network request.",
        "For example, a direct visit to `/settings` may return a server 404 even though client navigation works. That indicates the host lacks a rewrite to the application's HTML entry. A script 404 with `/assets/...` may instead point to an incorrect base path.",
        "Running the production build and preview locally separates build behavior from hosting behavior. Then compare public environment variables, API origins, HTTPS rules, file-name case, routing rewrites, and uploaded output. Fix one confirmed difference and verify both a fresh load and client navigation.",
      ],
      deepTitle: "Classify the failing boundary",
      deep: [
        "A production-only failure usually belongs to build transformation, deployment contents, host configuration, runtime configuration, or real browser/network policy. Console and Network evidence identify which boundary failed before code is changed.",
        "Case-insensitive local filesystems can allow an import whose letter case does not match the file. A Linux build or host can reject it. Similarly, development proxies can hide CORS or API-origin differences that appear when the deployed browser calls the real service.",
      ],
      support: { type: "diagram", title: "Production-debugging checkpoints", content: "```mermaid\nflowchart LR\n  A[Source] --> B[Production build]\n  B --> C[Uploaded assets]\n  C --> D[Host and routes]\n  D --> E[Browser and API]\n```\n\nTest each boundary with evidence from the failing deployment." },
      followups: ["Why can direct route navigation fail when client navigation works?", "How can a development proxy hide a production issue?"],
    },
    {
      question: "Why can npm install produce different results for teammates?",
      title: "Diagnose dependency-install differences",
      direct: "Compare the committed manifest and lockfile, Node and npm versions, registry configuration, platform, and install command. Restore a reviewed lockfile and use `npm ci` before blaming application code.",
      quick: ["Confirm both people use the same commit.", "Check package-lock.json was committed.", "Compare Node and npm versions.", "Use a clean lockfile-based install to reproduce."],
      interview: [
        "Two developers can receive different dependency trees when they use different manifests, lockfiles, package-manager versions, registries, platforms, or installation commands. An existing `node_modules` can also contain packages left from earlier work.",
        "For example, if one branch changed `package.json` but did not commit the matching lockfile, `npm install` may resolve a newer transitive package for one teammate. A clean checkout followed by `npm ci` will fail on a mismatch or install the recorded graph when the files agree.",
        "The diagnosis compares `git status`, the lockfile diff, Node/npm versions, npm configuration, and the first installation error. Deleting the lockfile and accepting a completely new graph is not the first fix because it removes reproducibility and can introduce unrelated upgrades.",
      ],
      deepTitle: "Dependency state has more inputs than package.json",
      deep: [
        "The manifest describes acceptable direct versions; the lockfile captures a resolved transitive graph. The package manager and platform interpret that graph, including optional and platform-specific packages. Controlling these inputs makes failures repeatable.",
        "A useful team setup pins or documents the runtime and package manager, commits the chosen lockfile, and makes CI use the same install policy. Cache invalidation should be keyed by that lockfile so an old dependency directory cannot silently survive a change.",
      ],
      support: table("Difference to compare", ["Input", "Evidence"], [["Source state", "Commit ID and clean git status"], ["Dependency graph", "package-lock.json diff"], ["Toolchain", "Node and npm versions"], ["Registry/config", "npm config and authentication"], ["Platform", "OS/CPU-specific package messages"]]),
      followups: ["Why is deleting the lockfile a risky first response?", "How should a dependency cache be keyed?"],
    },
    {
      question: "How do you handle a merge conflict before opening a pull request?",
      title: "Integrate current target-branch changes before review",
      direct: "Fetch the latest target branch, merge or rebase according to team policy, resolve conflicts by preserving the intended behavior from both sides, run tests, and review the final diff before pushing the updated feature branch.",
      quick: ["Fetch current remote references first.", "Use the team's merge or rebase policy.", "Read the common code, not just conflict markers.", "Test and review after resolution."],
      interview: [
        "A conflict before a pull request means the feature branch and target branch changed overlapping work. The developer should first fetch the current remote target, then integrate it with the team's approved merge or rebase workflow.",
        "For example, if main renamed a form field while the feature added validation to the old field, choosing one text block will lose behavior. The correct resolution applies validation to the renamed field and updates tests and callers together.",
        "After every file is resolved and staged, complete the operation, run focused and broader tests, and inspect the feature diff against the target branch. If a rebase rewrote a branch already on the remote, update it using the team's safe force-with-lease practice rather than an unchecked force push.",
      ],
      deepTitle: "Resolve the combined behavior, not the marker",
      deep: [
        "Conflict markers show where automatic text merging stopped. They do not show the complete semantic effect of renamed symbols, schema changes, or altered tests elsewhere. Searching for related references helps build a coherent final version.",
        "Integrating before review prevents reviewers from discussing code that cannot merge, but large unrelated target changes can make the pull request harder to inspect. Frequent small integration and focused feature commits keep the resolution understandable.",
      ],
      support: commands("Update a feature branch with a merge", ["git fetch origin", "git switch feature/form-validation", "git merge origin/main", "# resolve, stage, and test", "git commit"], "A rebase is also valid when the repository policy allows rewriting this feature branch."),
      followups: ["Why can selecting only ours or theirs lose behavior?", "When is force-with-lease relevant?"],
    },
    {
      question: "A production bundle loads slowly. How do you find the cause?",
      title: "Diagnose a slow frontend bundle",
      direct: "Measure the deployed page, inspect network transfer and execution cost, use a bundle report to find large entry dependencies, then apply targeted splitting, removal, compression, or caching and measure again.",
      quick: ["Separate download size from JavaScript execution time.", "Inspect initial and lazy chunks.", "Find which package owns the bytes.", "Verify improvement on realistic devices and networks."],
      interview: [
        "A slow bundle can be caused by too many transferred bytes, poor compression or caching, a network waterfall, or expensive parsing and execution. Network and Performance traces separate these costs before optimization begins.",
        "For example, a bundle analyzer may show a charting library in the initial chunk even though charts appear only on an admin route. Moving that import behind the route boundary can keep the package out of the first load. Replacing the library is useful only if its real cost justifies the maintenance change.",
        "The fix can include removing unused packages, importing smaller entry points, lazy-loading route code, enabling appropriate compression, and using hashed long-lived assets. A smaller file is not automatically faster if it creates many blocking requests, so the same user journey must be measured after the change.",
      ],
      deepTitle: "Loading has network and main-thread phases",
      deep: [
        "Compressed transfer size affects network time, while uncompressed JavaScript size influences parsing, compilation, and execution. Low-end devices can remain slow after excellent compression because they still execute the full program.",
        "A bundle report maps output bytes back to source modules. It should be paired with a runtime trace: code included in a chunk is not necessarily executed during the measured interaction, and expensive small code can matter more than a large inert asset.",
      ],
      support: { type: "diagram", title: "Bundle diagnosis", content: "```mermaid\nflowchart LR\n  A[Network trace] --> B{Download or CPU?}\n  B -->|Download| C[Bundle map and caching]\n  B -->|CPU| D[Performance flame chart]\n  C --> E[Targeted change]\n  D --> E\n  E --> F[Repeat measurement]\n```" },
      followups: ["Why are compressed and parsed sizes different concerns?", "When is route-level splitting useful?"],
    },
    {
      question: "Users still receive old frontend files after a deployment. What should you check?",
      title: "Debug stale assets after deployment",
      direct: "Check which HTML and asset URLs the browser receives, their cache headers and content hashes, CDN state, service-worker caches, and whether the deployment publishes HTML and hashed assets in a safe order.",
      quick: ["Inspect the actual response headers and file names.", "HTML usually needs revalidation sooner than hashed assets.", "A service worker can serve its own cached response.", "Keep old hashed assets available during a rollout."],
      interview: [
        "A frontend deployment often combines changing HTML with content-hashed static files. The HTML tells the browser which asset names to load, while browser caches, a CDN, or a service worker may answer each request.",
        "For example, new HTML can reference `app.NEW.js` while one server still lacks that file, causing a chunk 404. The opposite mismatch can occur when stale HTML references `app.OLD.js` that was deleted immediately. Network response headers and the exact requested names show which version is in use.",
        "A reliable release uploads new immutable assets before switching HTML, gives HTML a short or revalidated cache policy, and retains older hashed assets long enough for open sessions. Service-worker update logic must also move clients to the new cache safely. Asking every user to hard refresh is evidence of an invalidation problem, not a complete deployment strategy.",
      ],
      deepTitle: "Versioned assets make cache ownership explicit",
      deep: [
        "A content hash gives a changed file a new URL, so that URL can be cached for a long time without confusing it with later content. The non-hashed HTML entry is the pointer that must discover the new asset names and therefore needs a different cache policy.",
        "Rolling deployments temporarily contain multiple application versions. Keeping compatible old chunks avoids breaking tabs that loaded earlier HTML. APIs and persisted client state may also need backward compatibility during that window.",
      ],
      support: table("Stale-file evidence", ["Symptom", "Likely cause", "Check"], [["Old HTML", "Browser/CDN HTML cache", "Age, ETag, Cache-Control"], ["Chunk 404", "HTML and assets from different releases", "Requested hash and deployed files"], ["Old response despite network", "Service worker cache", "Worker and Cache Storage"], ["Only one region affected", "CDN or rolling-deploy inconsistency", "Response headers by region/origin"]]),
      followups: ["Why can hashed assets use a long cache lifetime?", "Why keep older chunks during a rollout?"],
    },
  ],
};

curateIndexedModule({ moduleSlug: "tooling-and-git-fresher", topicPacks });
