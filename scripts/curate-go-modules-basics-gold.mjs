#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatInterviewArticle,
  interviewAnswerSize,
} from "./lib/interview-article.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/go-fresher");
const moduleRoot = path.join(domainRoot, "go-modules-basics");

const topicOrder = [
  "go-module-and-go-mod",
  "packages-and-imports",
  "exported-vs-unexported",
  "go-get-add-dependency",
  "go-mod-tidy",
  "go-sum",
  "module-path-convention",
  "comparisons",
];

const topicTitles = {
  "go-module-and-go-mod": "Modules and go.mod",
  "packages-and-imports": "Packages and Import Paths",
  "exported-vs-unexported": "Exported and Unexported Names",
  "go-get-add-dependency": "Managing Dependencies",
  "go-mod-tidy": "Keeping the Module Tidy",
  "go-sum": "Checksums and Private Modules",
  "module-path-convention": "Module Paths, Major Versions, and Workspaces",
  comparisons: "Module Decisions in Practice",
};

const paragraphs = (...values) => values.join("\n\n");
const source = (language, ...lines) => ({ language, text: `${lines.join("\n")}\n` });
const go = (...lines) => source("go", ...lines);
const mod = (...lines) => source("text", ...lines);
const shell = (...lines) => source("bash", ...lines);

function formatSource(file) {
  if (file.language !== "go") return file.text;
  return execFileSync("gofmt", [], { input: file.text, encoding: "utf8" });
}

function renderFiles(files, commands) {
  const blocks = Object.entries(files).map(([name, file]) => {
    const formatted = formatSource(file).trimEnd();
    return `**${name}**\n\n\`\`\`${file.language}\n${formatted}\n\`\`\``;
  });
  if (commands.length > 0) {
    blocks.push(`**Run it**\n\n\`\`\`bash\n${commands.join("\n")}\n\`\`\``);
  }
  return blocks.join("\n\n");
}

const standardFiles = (mainLines, extra = {}) => ({
  "go.mod": mod("module example.test/lesson", "", "go 1.23.0"),
  "main.go": go(...mainLines),
  ...extra,
});

const lessons = [];
const add = (lesson) => lessons.push(lesson);

add({
  topicSlug: "go-module-and-go-mod",
  question: "What is a Go module, and what does `go.mod` declare?",
  title: "Go modules and the role of go.mod",
  direct: "A Go module is a collection of packages that are versioned and distributed together. Its root contains `go.mod`, which gives the module its canonical path, records the minimum Go version, and describes dependency requirements and any main-module overrides. Package import paths below the root begin with that module path.",
  quick: [
    "A module is one versioned collection of Go packages.",
    "The directory containing `go.mod` is the module root.",
    "The `module` line supplies the canonical import-path prefix.",
    "The `go` line sets the module's minimum Go version and language semantics.",
    "`require` records minimum dependency versions; the build list may select higher ones.",
  ],
  speaking: paragraphs(
    "- A Go module is a collection of related packages that are versioned and distributed as one unit. The module root is the directory containing `go.mod`. A repository can contain one module at its root, several modules in subdirectories, or no published module at all, so module and repository are related concepts but not synonyms.",
    "- The first important line is `module example.com/acme/shop`. It is the canonical prefix for packages inside that module. If a package lives in the `cart` subdirectory, its import path is `example.com/acme/shop/cart`. The package name written in its Go files may simply be `cart`; import resolution uses the path, not only that short name.",
    "- The `go` directive records the minimum Go version required by the module. With modern Go versions it is an enforced minimum, and it also controls language and module behavior. `require` directives record dependency module paths and minimum versions. Commands compute the final build list from the whole module graph, so a selected version can be higher than the line written by the main module.",
    "- A `go.mod` file can also contain directives such as `replace`, `exclude`, `retract`, and `toolchain`, each with a narrower purpose. In the small example, no external dependency is needed: `go list -m` reads the module identity and `go test ./...` tests every package below the root.",
    "- The practical boundary is the module root. Module commands search upward for `go.mod`, and package import paths are interpreted within that context. I treat `go.mod` as reviewed source code because it defines the identity and dependency rules needed to reproduce the build, while `go.sum` separately records integrity evidence for downloaded modules."
  ),
  overviewTitle: "Identity at the root, packages below it",
  overview: "The module path answers “which versioned unit is this?”, while each subdirectory supplies a package path under that identity. The dependency directives then connect this main module to other modules needed by its packages.",
  deepTitle: "Read go.mod as a build contract",
  deep: paragraphs(
    "A module boundary begins at `go.mod` and includes packages in descendant directories until another nested `go.mod` starts a different module. Running a module-aware command inside that tree normally finds the nearest module file by walking upward.",
    "The module path is not merely documentation. It becomes the prefix used by import statements and the identity attached to released versions. Published paths usually correspond to a source repository location, but private and example paths follow the same syntactic rules without needing to be ordinary browser URLs.",
    "A `require` line contributes a minimum version to the module graph. Go's minimal version selection chooses one version of each module that satisfies all requirements. That is why reading only one `require` line is not enough to know every selected version; `go list -m all` shows the computed build list.",
    "The `go` line is also operational. For modules declaring Go 1.21 or later, it is a mandatory minimum toolchain version, and it can affect language features, graph pruning, and how commands maintain the module file. Changing it deserves the same review as changing code.",
    "A module with only standard-library imports may have no `require` block and no `go.sum`. That is valid. Dependency metadata appears when non-standard modules enter the graph; the module identity and package layout still work without them."
  ),
  visualType: "flow_diagram",
  visualTitle: "One module path prefixes several package paths",
  visual: "```mermaid\nflowchart TD\n  M[go.mod: module example.test/shop] --> R[Root package: example.test/shop]\n  M --> C[cart directory: example.test/shop/cart]\n  M --> P[price directory: example.test/shop/price]\n  C --> D[Dependency modules from require directives]\n  P --> D\n```",
  codeTitle: "A module with a root command and one package",
  files: {
    "go.mod": mod("module example.test/shop", "", "go 1.23.0"),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/shop/price\"",
      ")",
      "",
      "func main() {",
      "\tfmt.Println(price.WithTax(100, 10))",
      "}"
    ),
    "price/price.go": go(
      "package price",
      "",
      "func WithTax(amount, percent int) int {",
      "\treturn amount + amount*percent/100",
      "}"
    ),
    "price/price_test.go": go(
      "package price",
      "",
      "import \"testing\"",
      "",
      "func TestWithTax(t *testing.T) {",
      "\tif got := WithTax(100, 10); got != 110 {",
      "\t\tt.Fatalf(\"WithTax = %d; want 110\", got)",
      "\t}",
      "}"
    ),
  },
  commands: ["go list -m", "go test ./...", "go run ."],
  checks: [["go", "list", "-m"], ["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "The import path follows the module path plus the `price` directory. The package declaration stays the shorter name `price`.",
  followups: [
    "Can one repository contain more than one Go module?",
    "How is `example.test/shop/price` derived?",
    "Does a `require` line always equal the finally selected version?",
  ],
});

add({
  topicSlug: "packages-and-imports",
  question: "How do modules, directories, packages, and import paths relate in Go?",
  title: "From module root to package import path",
  direct: "A module is the versioned unit named by `go.mod`; a package is the code compiled from eligible Go files in one directory. The import path of a package is normally the module path plus that directory's relative path. The package clause supplies the local identifier, which can differ from the final path element, although matching it is the clearest convention.",
  quick: [
    "A module can contain many packages.",
    "A package normally comes from one directory of `.go` files.",
    "Import path = module path + relative package directory.",
    "The `package` clause declares the identifier used by default in code.",
    "A nested `go.mod` starts a separate module and stops the parent boundary.",
  ],
  speaking: paragraphs(
    "- A module and a package solve different grouping problems. The module is the versioned delivery unit described by `go.mod`. A package is the compilation unit formed from the eligible Go files in one directory. A small module may have one package, while an application module commonly contains commands and several library packages.",
    "- Import paths are derived from the module boundary. If `go.mod` says `module example.test/orders` and a directory under it is `money`, that package is imported as `example.test/orders/money`. A nested directory `money/format` would have the path `example.test/orders/money/format`; Go does not infer a hierarchy between their package APIs merely because the directories are nested.",
    "- Each source file begins with a package clause. Files built together in one directory normally declare the same package name. When another package imports the path, the declared name becomes the default qualifier, so code writes `money.Format`. A caller may give an explicit alias, but aliases should solve a real collision or clarify an unusual package name.",
    "- In the example, the root `main` package imports a reusable `money` package. Both belong to the same module, so no `require` directive is needed: the path is resolved directly beneath the module root. `go list ./...` reveals the two package import paths, while `go list -m` reports only one main module.",
    "- The important boundary is another `go.mod`. A nested module is not simply another package in the parent's module; it has its own identity and dependency graph, and parent patterns such as `./...` do not automatically cross into it. I choose module boundaries for independent versioning or ownership, and package directories for ordinary code organisation."
  ),
  overviewTitle: "Version together, compile by directory",
  overview: "The module path anchors identity, directories partition compilation, and import paths connect callers to those package directories. Keeping those layers separate prevents common mistakes such as adding a dependency for a package already inside the same module.",
  deepTitle: "Resolve an import from left to right",
  deep: paragraphs(
    "When the compiler sees an import, the go command first maps the package path to a module in the active build list. For a package owned by the main module, the module path is the prefix and the remaining suffix points to a directory below the root.",
    "Files selected in that directory depend on filenames, build constraints, target platform, and whether a test build is running. The selected non-test files must agree on their package clause. They are compiled as one unit and can refer to each other's unexported declarations.",
    "The short package name is not globally unique. Many modules can contain a package named `config`; import paths distinguish them. If two imported packages have the same declared name in one file, explicit aliases distinguish the local bindings without changing either package's identity.",
    "A directory named `main` builds an executable package when it supplies `func main`; other package names build importable archives. This is a package property rather than a module type—a module may contain several `main` packages under different command directories.",
    "Nested modules deliberately break the prefix mapping for the parent. They can be coordinated locally with a workspace, but they remain separately versioned units. Avoid creating one simply to get another folder: normal subpackages already provide code boundaries without multiplying module metadata."
  ),
  visualType: "flow_diagram",
  visualTitle: "Deriving an import path",
  visual: "```mermaid\nflowchart LR\n  A[go.mod: example.test/orders] --> B[Relative directory: money]\n  B --> C[Import path: example.test/orders/money]\n  C --> D[package money]\n  D --> E[Caller uses money.Format]\n```",
  codeTitle: "Two packages inside one module",
  files: {
    "go.mod": mod("module example.test/orders", "", "go 1.23.0"),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/orders/money\"",
      ")",
      "",
      "func main() { fmt.Println(money.Format(1250)) }"
    ),
    "money/format.go": go(
      "package money",
      "",
      "import \"fmt\"",
      "",
      "func Format(cents int) string {",
      "\treturn fmt.Sprintf(\"$%d.%02d\", cents/100, cents%100)",
      "}"
    ),
  },
  commands: ["go list -m", "go list ./...", "go run ."],
  checks: [["go", "list", "-m"], ["go", "list", "./..."], ["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "The `money` import is local to the module, so `go.mod` needs no `require` entry for it.",
  followups: [
    "Does every package need its own `go.mod` file?",
    "Can the declared package name differ from the last import-path segment?",
    "What boundary does a nested `go.mod` create?",
  ],
});

add({
  topicSlug: "exported-vs-unexported",
  question: "How does capitalisation control exported identifiers in Go?",
  title: "Exported names form a package's visible API",
  direct: "An identifier declared in a package is exported when its first character is an uppercase Unicode letter; otherwise it is unexported. Code in other packages can name exported types, functions, variables, constants, methods, and fields through the imported package. Unexported names remain usable throughout their own package, even across files.",
  quick: [
    "A name beginning with an uppercase Unicode letter is exported.",
    "A lowercase-starting name is visible only within its declaring package.",
    "Export rules apply to functions, types, variables, constants, methods, and fields.",
    "Files in the same package share access to unexported declarations.",
    "Importing a package does not expose its lowercase names.",
  ],
  speaking: paragraphs(
    "- Go uses the spelling of an identifier as its visibility rule. A package-level name is exported when its first character is an uppercase Unicode letter. Names such as `Parse`, `Client`, and `DefaultTimeout` can be selected by code in another package. A name beginning with a lowercase letter, such as `parseHeader`, is unexported.",
    "- The same rule applies inside types. An exported type can have exported and unexported fields or methods. Another package may construct and call what is exported, but it cannot name the hidden members directly. Within the declaring package, every file participates in the same package namespace, so an unexported helper is not file-private.",
    "- In the example, package `greeting` exposes `Hello` while keeping `normalise` private. The command imports `example.test/app/greeting` and calls `greeting.Hello`. If it tried `greeting.normalise`, compilation would fail even though that function exists and is used by another file in the package.",
    "- Exported does not mean globally available. The caller must still import the package and qualify the name unless it uses one of a few declaration contexts. It also does not mean immutable or safe: exported variables can expose mutable global state, so functions and types are usually better API boundaries.",
    "- Capitalisation is therefore both a compiler rule and an API-design decision. I export the smallest set of names callers need, give exported declarations stable behavior and documentation, and keep parsing details or invariants unexported so they can change without breaking users. Package tests may choose internal access, but consumers remain limited to the exported contract."
  ),
  overviewTitle: "Visibility belongs to the package, not the file",
  overview: "Uppercase opens a name to importers; lowercase keeps it inside the package. This simple rule makes the package directory the encapsulation boundary and turns naming into an explicit API choice.",
  deepTitle: "Apply the rule to every selectable name",
  deep: paragraphs(
    "Export status is determined by the first Unicode character, not by an `export` keyword or the filename. A declaration can be used from any file compiled into the same package regardless of whether its name is exported.",
    "Outside the package, selection is checked one step at a time. Importing `greeting` makes the package name available in the file; `greeting.Hello` is legal because `Hello` is exported, while `greeting.normalise` is rejected at compile time.",
    "Fields and methods follow the same rule. An exported struct type with hidden fields can be returned and passed around by callers, but direct struct literals may be intentionally constrained. Constructor functions and exported methods can preserve invariants around those fields.",
    "Interfaces have another consequence: an unexported method effectively limits implementation to the defining package, because an identically spelled lowercase method in another package is a different package-scoped name. This can intentionally seal an interface but should be used with care.",
    "Avoid exporting a declaration merely to make a test compile. A same-package test can reach internal details, while an external test should model the public API. Exporting creates compatibility expectations for real consumers, so it deserves a product reason rather than a testing shortcut."
  ),
  visualType: "comparison_table",
  visualTitle: "The same declaration viewed from two packages",
  visual: "| Declaration in `greeting` | Inside `greeting` | From an importing package |\n|---|---:|---:|\n| `func Hello` | Available | Available as `greeting.Hello` |\n| `func normalise` | Available | Not accessible |\n| `type Message` | Available | Available |\n| field `text` | Available | Not directly accessible |",
  codeTitle: "An exported function backed by an unexported helper",
  files: {
    "go.mod": mod("module example.test/app", "", "go 1.23.0"),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/app/greeting\"",
      ")",
      "",
      "func main() { fmt.Println(greeting.Hello(\"  Gopher  \")) }"
    ),
    "greeting/greeting.go": go(
      "package greeting",
      "",
      "import \"strings\"",
      "",
      "func normalise(name string) string { return strings.TrimSpace(name) }",
      "",
      "func Hello(name string) string { return \"Hello, \" + normalise(name) }"
    ),
  },
  commands: ["go test ./...", "go run ."],
  checks: [["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "Only `Hello` is part of the imported API. The helper remains shared across files in package `greeting` without becoming caller-visible.",
  followups: [
    "Are unexported declarations private to one file?",
    "Can an exported type contain unexported fields?",
    "Why is exporting a variable often a larger API commitment than exporting a function?",
  ],
});

add({
  topicSlug: "go-get-add-dependency",
  question: "What does `go get` do in a module today?",
  title: "Using go get to change dependency requirements",
  direct: "Inside a module, `go get` resolves the requested package or module versions and edits `go.mod` so the dependency graph meets them; it can also update `go.sum` after downloads. It is now a dependency-management command. To install an executable without changing the current module, use `go install package@version`.",
  quick: [
    "`go get` changes dependency versions required by the current module.",
    "Arguments may be package paths or module paths with version queries.",
    "The command can add or update `require` directives and checksums.",
    "Related dependencies may also change to satisfy the new graph.",
    "Use `go install command@version` for a tool outside the current module graph.",
  ],
  speaking: paragraphs(
    "- In current Go, `go get` is used to adjust dependencies in the active module. An argument can name an imported package or a module and may include a query such as `@v1.2.0`, `@latest`, `@upgrade`, `@patch`, or `@none`. The command resolves that request and updates `go.mod` so future module-aware commands keep a compatible graph.",
    "- Adding one dependency can change more than one line. The selected module may require newer versions of its own dependencies, and minimal version selection must produce one consistent build list. Downloads can add integrity records to `go.sum`. I therefore review the complete module-file diff and use `go list -m all` when the transitive effect matters.",
    "- In the local example, `main.go` imports `example.test/quote`, while a `replace` directive points that module path to `./quote`. Running `go get example.test/quote@v1.2.0` adds the missing requirement without network access. The replacement supplies content; the newly added requirement is what places the module in the graph.",
    "- `go get` should not be confused with downloading files or installing a standalone command. Normal build commands download needed modules automatically. `go mod download` is mainly useful for explicitly filling or inspecting a module cache. `go install example.com/tool@v1.2.3` builds a command at that version while ignoring the current module's `go.mod`.",
    "- I use an explicit version when reproducibility or a controlled upgrade matters, then run tests and inspect the graph. An unqualified `go get` uses upgrade behavior, so it may not express the intended boundary as clearly. The command manages constraints; tests still need to prove that the selected dependency behavior is compatible with the application."
  ),
  overviewTitle: "Request a graph change, then review its consequences",
  overview: "The command begins with a version request, resolves a valid module graph, and records the resulting requirements. Compilation and tests then verify the API-level effect; the module-file diff explains the dependency-level effect.",
  deepTitle: "A package request becomes a module requirement",
  deep: paragraphs(
    "A `go get` argument may name a package because developers usually think in imported APIs. The go command determines which module provides that package, selects a version from the query, and updates module requirements as needed.",
    "Without an explicit query, the operation uses upgrade semantics. A fixed semantic version requests that release, while `@none` removes the named module requirement and may trigger related downgrades or removals needed to keep the graph consistent.",
    "Requirements are minimums, not independent pins. If module A asks for C v1.3.0 and module B asks for C v1.5.0, the build list contains C v1.5.0. A change to A can therefore affect C even when the command did not name C directly.",
    "Package-loading commands can also add a missing dependency in writable module mode, but `go get` is the explicit interface for selecting upgrades, downgrades, and removals. CI commonly uses readonly or tidy checks to catch uncommitted metadata changes.",
    "Local replacement makes the example deterministic but changes one security property: local directories are trusted development input and do not receive `go.sum` entries. Published remote modules normally travel through the configured proxy or version control path and are authenticated according to checksum settings."
  ),
  visualType: "flow_diagram",
  visualTitle: "What a go get request changes",
  visual: "```mermaid\nflowchart LR\n  A[go get path@query] --> B[Resolve package to module]\n  B --> C[Apply version request]\n  C --> D[Recompute build list]\n  D --> E[Update go.mod / go.sum]\n  E --> F[Test the application]\n```",
  codeTitle: "Add a locally replaced dependency with go get",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "replace example.test/quote => ./quote"
    ),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/quote\"",
      ")",
      "",
      "func main() { fmt.Println(quote.Text()) }"
    ),
    "quote/go.mod": mod("module example.test/quote", "", "go 1.23.0"),
    "quote/quote.go": go("package quote", "", "func Text() string { return \"clear dependencies\" }"),
  },
  commands: [
    "GOPROXY=off go get example.test/quote@v1.2.0",
    "go list -m all",
    "go test ./...",
  ],
  checks: [["go", "get", "example.test/quote@v1.2.0"], ["go", "list", "-m", "all"], ["go", "test", "./..."], ["go", "vet", "./..."]],
  codeNote: "The local replacement makes the lesson offline-safe. After `go get`, `go.mod` contains both the replacement and a requirement for v1.2.0.",
  followups: [
    "What version query is used by an unqualified `go get`?",
    "Why can a single `go get` change transitive requirements?",
    "Which command should install a released executable without editing this module?",
  ],
});

add({
  topicSlug: "go-mod-tidy",
  question: "What does `go mod tidy` add and remove?",
  title: "Making module metadata match the source tree",
  direct: "`go mod tidy` loads the module's relevant packages and tests, adds requirements needed to provide their imports, removes requirements that provide no needed package, and reconciles `go.sum`. It can also adjust `// indirect` markers. It cleans dependency metadata; it does not rewrite imports or prove behavioral compatibility.",
  quick: [
    "Tidy adds missing module requirements for relevant imports.",
    "It removes requirements that no longer provide a needed package.",
    "It adds missing and removes unnecessary `go.sum` entries.",
    "It may update `// indirect` classification.",
    "It does not remove unused Go imports or validate application behavior.",
  ],
  speaking: paragraphs(
    "- `go mod tidy` reconciles dependency metadata with the source tree. It loads the packages in the main module, the tools and tests relevant to that module, and their imports. If an imported package is supplied by a module not represented correctly in `go.mod`, tidy adds the necessary requirement. If a requirement provides no package in that loaded set, tidy removes it.",
    "- Tidy also maintains integrity metadata. It adds `go.sum` entries needed for downloaded modules and removes entries that are no longer necessary under its compatibility rules. In modern module files it can add or remove `// indirect` comments to reflect whether a module directly supplies an imported package or enters through the wider graph.",
    "- For example, the project begins intentionally inconsistent. `main.go` imports `example.test/used`, but `go.mod` requires only `example.test/unused`; local replacements make both modules available without network access. Running tidy adds a requirement for `used` and removes the unused requirement. The unused replacement remains because tidy does not automatically erase every explicit policy directive.",
    "- Tidy operates on module metadata, not source hygiene. The compiler rejects unused imports in `.go` files; tidy does not edit them. It also cannot decide whether a dependency upgrade preserves behavior, whether a library is secure, or whether an import belongs in the architecture. Tests and review remain necessary.",
    "- I run tidy after intentional import or module changes and inspect its diff. Unexpected additions often reveal a test, tool, platform file, or build-tagged file that was overlooked. Unexpected removals may show dead source or a mistaken assumption about which module provides a package. The command is deterministic maintenance, but its output still explains real dependency ownership."
  ),
  overviewTitle: "Source imports drive the dependency record",
  overview: "Tidy walks from relevant packages to imported packages, maps external imports to modules, and then makes `go.mod` and `go.sum` sufficient without retaining unrelated requirements.",
  deepTitle: "Understand both sides of reconciliation",
  deep: paragraphs(
    "The add side begins with package loading. A source import names a package path; the go command finds a module that provides it and adds a requirement when the existing graph does not already preserve that provider appropriately.",
    "The remove side works from the same loaded set. A module can remain indirectly required because a reachable dependency needs it even when main-module source never imports it directly. The `// indirect` comment describes graph position; it does not mean optional, unimportant, or unused.",
    "Tidy maintains more than the current operating system's immediate build. Tests and build-tagged variants matter, which prevents a Linux developer from deleting a requirement needed by a Windows source file. That wider scope explains many apparently surprising additions.",
    "Explicit replace directives are policy rather than evidence that a module is used. A replacement alone does not enter the graph, and tidy can leave an unused replacement in place. Review stale overrides separately because they may mislead future dependency work.",
    "Checksum changes follow module loading and compatibility rules. A local replacement usually creates no checksum because no module zip is downloaded. A remote dependency may add hashes for content and go.mod data; extra historical hashes do not imply those versions are all in the current build list."
  ),
  visualType: "flow_diagram",
  visualTitle: "Tidy reconciles imports and module files",
  visual: "```mermaid\nflowchart LR\n  A[Packages, tests, tools, tagged files] --> B[Resolve all relevant imports]\n  B --> C{Module metadata matches?}\n  C -->|Missing provider| D[Add requirement/checksum]\n  C -->|No longer needed| E[Remove requirement/checksum]\n  D --> F[Review diff]\n  E --> F\n```",
  codeTitle: "Add one needed requirement and remove one unused requirement",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "require example.test/unused v1.0.0",
      "",
      "replace example.test/used => ./used",
      "",
      "replace example.test/unused => ./unused"
    ),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/used\"",
      ")",
      "",
      "func main() { fmt.Println(used.Message()) }"
    ),
    "used/go.mod": mod("module example.test/used", "", "go 1.23.0"),
    "used/used.go": go("package used", "", "func Message() string { return \"needed\" }"),
    "unused/go.mod": mod("module example.test/unused", "", "go 1.23.0"),
    "unused/unused.go": go("package unused", "", "func Message() string { return \"not imported\" }"),
  },
  commands: ["GOPROXY=off go mod tidy", "go list -m all", "go test ./..."],
  checks: [["go", "mod", "tidy"], ["go", "list", "-m", "all"], ["go", "test", "./..."], ["go", "vet", "./..."]],
  codeNote: "After tidy, `used` is required at the zero pseudo-version used for an unversioned local replacement, while the `unused` requirement is gone.",
  followups: [
    "Why can an indirect requirement remain after tidy?",
    "Will tidy delete an unused import from a Go source file?",
    "Why might an unused replace directive remain in `go.mod`?",
  ],
});

add({
  topicSlug: "go-sum",
  question: "What is the difference between `go.mod` and `go.sum`?",
  title: "Dependency rules in go.mod and integrity evidence in go.sum",
  direct: "`go.mod` defines the module's identity, Go version, dependency requirements, and main-module directives. `go.sum` records cryptographic hashes for downloaded module content and `go.mod` files that the Go tool has needed to authenticate. `go.sum` is not a lock file and can contain multiple or historical versions not selected in the current build.",
  quick: [
    "`go.mod` defines module identity and dependency graph constraints.",
    "`go.sum` records hashes for authenticated downloaded module data.",
    "The selected build list is computed from `go.mod` graphs, not locked by `go.sum`.",
    "`go.sum` may contain entries for more versions than the current build uses.",
    "A module with no downloaded dependencies may have no `go.sum` file.",
  ],
  speaking: paragraphs(
    "- `go.mod` and `go.sum` are both module files, but they answer different questions. `go.mod` says what the module is and what dependency graph it requires: it contains the module path, Go version, required module versions, and directives such as replacements. Those constraints are used to compute the build list.",
    "- `go.sum` records integrity evidence. Each line identifies a module path and version, optionally the version's `/go.mod` file, followed by a hash. When module data is downloaded, the go command compares its computed hash with the expected value and, for public modules by default, with the checksum database's globally recorded value.",
    "- It is incorrect to call `go.sum` a lock file. Minimal version selection calculates the selected version of every module from reachable `go.mod` requirements. `go.sum` may include hashes for versions whose metadata was examined during selection or versions retained for compatibility even though those versions are not in the current build list.",
    "- The example uses a dependency replaced by a local directory. `go.mod` still contains a requirement and replacement because the graph needs that package, but tidy creates no checksum for the local directory: it was not downloaded as a versioned module archive. A standard-library-only module can likewise have no `go.sum`.",
    "- In an ordinary project I commit `go.mod` and the `go.sum` produced for its downloaded dependencies so another environment can verify the same module content. I do not hand-edit hashes or delete the file merely because it has extra lines; `go mod tidy` maintains what is necessary, and `go mod verify` checks downloaded cache content against recorded hashes."
  ),
  overviewTitle: "Selection and authentication are separate",
  overview: "The module graph decides which versions belong in a build. Checksums then authenticate downloaded bytes for versions the toolchain needs to read. Confusing the two leads to false claims about locking or unexpected extra hashes.",
  deepTitle: "Read a checksum line precisely",
  deep: paragraphs(
    "A normal `go.sum` line has a module path, version, and hash. A version ending in `/go.mod` authenticates only that version's module file; a line without the suffix authenticates the module zip content.",
    "The go command may need several module files while resolving the graph, so hashes can outlive one selected version. Tidy removes entries that are no longer needed under its current graph and compatibility rules, but a simple comparison with `go list -m all` will not always be one-to-one.",
    "The build list is deterministic without a separate lock file because minimal version selection chooses the highest required version of each module path from the loaded graph. Newer releases appearing upstream do not automatically enter that graph merely because they exist.",
    "Local replacements have no downloaded module archive to authenticate. This is convenient for development but means the source directory itself must be trusted and controlled. Replacing a module can therefore change what builds without producing a corresponding checksum line.",
    "Commit module files as a pair when `go.sum` exists, use tidy for maintenance, and investigate checksum mismatch errors rather than bypassing them. A mismatch can indicate a damaged cache or inconsistent upstream content and should not be solved by casually rewriting expected hashes."
  ),
  visualType: "comparison_table",
  visualTitle: "Two files, two responsibilities",
  visual: "| Question | `go.mod` | `go.sum` |\n|---|---|---|\n| What is this module? | Module path and Go version | Not recorded |\n| Which versions may be selected? | Graph constraints and overrides | Does not select |\n| Are downloaded bytes the expected bytes? | Not the hash record | Cryptographic hashes |\n| Can extra versions appear? | Requirements describe graph | Yes, metadata/history may need hashes |",
  codeTitle: "A valid dependency graph with no checksum file",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "require example.test/message v1.0.0",
      "",
      "replace example.test/message => ./message"
    ),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/message\"",
      ")",
      "",
      "func main() { fmt.Println(message.Text()) }"
    ),
    "message/go.mod": mod("module example.test/message", "", "go 1.23.0"),
    "message/message.go": go("package message", "", "func Text() string { return \"local source\" }"),
  },
  commands: ["GOPROXY=off go mod tidy", "go list -m all", "go mod verify", "go run ."],
  checks: [["go", "mod", "tidy"], ["go", "list", "-m", "all"], ["go", "mod", "verify"], ["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "Because the dependency content comes from `./message`, no remote archive is downloaded and this project does not need a `go.sum` entry.",
  followups: [
    "Why can `go.sum` contain a version that `go list -m all` does not select?",
    "What does a `/go.mod` checksum line authenticate?",
    "Why does a local replacement normally have no checksum entry?",
  ],
});

add({
  topicSlug: "module-path-convention",
  question: "How should you choose a Go module path and derive package import paths?",
  title: "Choosing a stable module identity",
  direct: "Choose a globally meaningful path that will remain the module's canonical import prefix, usually the repository location or a controlled custom domain. Packages below the root use that path plus their relative directories. For unpublished examples and tests, reserved prefixes such as `example` or `example.com` avoid claiming a real namespace.",
  quick: [
    "The module path is the canonical identity in the `module` directive.",
    "Published paths usually match a durable repository or controlled domain.",
    "A subpackage path appends its relative directory to the module path.",
    "The path need not be a human-browsable page, but the go command must resolve published source.",
    "Use reserved example paths for tutorials and isolated tests.",
  ],
  speaking: paragraphs(
    "- A module path is the module's canonical name and the prefix of every package path it owns. For an open-source module hosted at a repository root, a path such as `github.com/acme/widget` is common. An organisation can also use a controlled domain with discovery metadata or a configured private source. The important property is stable ownership and resolution, not whether pasting the path into a browser shows a page.",
    "- The directory tree extends that identity. With `module example.com/acme/widget`, a package in `codec/jsonwire` is imported as `example.com/acme/widget/codec/jsonwire`. Its package clause may be `package jsonwire`; callers use that declared name by default while the full import path uniquely resolves the package.",
    "- I choose the path before the first published version because changing it changes every importing source file and creates a different module identity. Moving a repository can be managed with redirects or discovery configuration, but casually editing the module directive is not a transparent rename for existing users.",
    "- Major-version suffixes are part of this decision for v2 and later. A v2 module normally ends in `/v2`, and its package imports carry that suffix. A module kept in a repository subdirectory includes that subdirectory in its module path and uses corresponding tag prefixes when released.",
    "- The example deliberately uses `example.test/catalog`, a reserved-style local identity suitable for a self-contained lesson. The `format` directory becomes `example.test/catalog/format` with no external requirement. For real publishing I would use a path controlled by the project, confirm `go list` reports the intended imports, and treat the module path as a long-lived API name."
  ),
  overviewTitle: "The path is an identity, not a folder label",
  overview: "The module directive anchors a namespace; directories add package suffixes beneath it. A stable, owned prefix lets users and tooling refer to released code even when local checkout directory names differ.",
  deepTitle: "Map local structure to published identity",
  deep: paragraphs(
    "A checkout may live at any filesystem path. Module-aware commands use the `module` directive, not the local folder name, to identify its packages. This makes reproducible imports independent of where a developer clones the source.",
    "For published modules, the path must lead the go command to module versions through a proxy, version-control discovery, or private configuration. Repository-host paths encode that mapping directly; custom domains can provide `go-import` metadata and preserve branding or migration flexibility.",
    "Subdirectories contribute slash-separated suffixes until another `go.mod` creates a new module boundary. A nested module needs its own full module path and releases, rather than inheriting the parent module's version automatically.",
    "Reserved first path elements `example` and `test`, and conventional example domains, are intended for code that will not be fetched as a real public module. They keep demonstrations honest and prevent accidental requests to someone else's namespace.",
    "Renaming a package clause can change the qualifier callers write; changing a module path changes import identity. Plan both deliberately, but recognise that the latter has a much wider compatibility and distribution effect."
  ),
  visualType: "diagram",
  visualTitle: "One canonical prefix, several packages",
  visual: "```text\ngo.mod: module example.test/catalog\n│\n├── main.go              package main\n├── format/              example.test/catalog/format\n└── storage/sql/         example.test/catalog/storage/sql\n```",
  codeTitle: "A package path independent of the checkout directory",
  files: {
    "go.mod": mod("module example.test/catalog", "", "go 1.23.0"),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/catalog/format\"",
      ")",
      "",
      "func main() { fmt.Println(format.SKU(42)) }"
    ),
    "format/format.go": go(
      "package format",
      "",
      "import \"fmt\"",
      "",
      "func SKU(id int) string { return fmt.Sprintf(\"SKU-%04d\", id) }"
    ),
  },
  commands: ["go list -m", "go list ./...", "go run ."],
  checks: [["go", "list", "-m"], ["go", "list", "./..."], ["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "The local directory can have any name; the import remains `example.test/catalog/format` because `go.mod` supplies the canonical prefix.",
  followups: [
    "Must a module path always open as a normal web page?",
    "What happens to import paths when the module directive changes?",
    "How does a nested `go.mod` affect path derivation?",
  ],
});

add({
  topicSlug: "comparisons",
  question: "What is the difference between a Go module, package, and repository?",
  title: "Module, package, and repository boundaries",
  direct: "A package is one compiled namespace, normally from a directory. A module is one versioned collection of packages rooted at `go.mod`. A repository is a version-control storage boundary that may contain one module, multiple modules, or supporting files that are not Go packages. These boundaries often align in small projects but are not interchangeable.",
  quick: [
    "Package: one compilation and namespace unit.",
    "Module: one versioned package collection rooted at `go.mod`.",
    "Repository: one version-control history and storage boundary.",
    "One module commonly contains many packages.",
    "One repository can contain one, several, or no Go modules.",
  ],
  speaking: paragraphs(
    "- A package is the unit Go compiles and imports. It normally consists of eligible `.go` files in one directory that share a package name. Declarations inside that package can use one another directly, and exported names form the API visible to other packages.",
    "- A module is the unit of dependency versioning and distribution. Its root contains `go.mod`, and the module path becomes the prefix for package import paths beneath it. A module can contain a root package, many subpackages, and several command packages while sharing one version and dependency graph.",
    "- A repository is a source-control concept rather than a Go language concept. It stores commits, branches, tags, documentation, automation, and perhaps code in several languages. Many Go repositories use one root module because that is simple, but a monorepo can hold several independently versioned modules, and a documentation repository might contain no module.",
    "- For example, one module named `example.test/shop` contains a `main` package and a `price` package. These are two compiled packages but one versioned module. The surrounding Git repository could also contain deployment files or another nested module; those additions would not turn all repository content into this module's packages.",
    "- I choose each boundary for its own reason. A new package creates an API and dependency boundary inside code. A new module creates independent versioning, release, and dependency metadata, which costs more coordination. A new repository creates separate source ownership and history. Keeping code in one module until independent release is genuinely needed is usually the simplest starting point."
  ),
  overviewTitle: "Compile, version, and store at different layers",
  overview: "Packages shape code dependencies, modules shape released dependency graphs, and repositories shape source-control ownership. A project may align all three for convenience without making them the same concept.",
  deepTitle: "Test the boundary with the tool that owns it",
  deep: paragraphs(
    "`go list ./...` reports packages in the active module pattern, reflecting compilation units. `go list -m` reports the active module identity. Git commands report repository state, which can include files outside the module or multiple module roots.",
    "Adding a package directory does not require a new semantic version identity; it becomes part of the containing module's next release. Adding a nested `go.mod` does create a separate module whose versions and dependency graph must be managed independently.",
    "Repository tags interact with modules but remain version-control objects. A root module often uses tags like `v1.2.3`; modules in subdirectories use module-aware tag prefixes so the go command can associate a release with the correct module.",
    "A package cannot span arbitrary directories, while a module intentionally spans a directory tree. A repository may span anything its maintainers choose. These differences matter when moving code: a package move changes imports, a module move changes dependency identity, and a repository move changes source discovery and collaboration setup.",
    "Prefer the smallest number of release boundaries that match ownership. Multiple packages are cheap and normal. Multiple modules are valuable for truly independent consumers or release cycles, but they require workspaces or published versions for local coordination."
  ),
  visualType: "diagram",
  visualTitle: "A common, but not mandatory, nesting",
  visual: "```text\nGit repository\n└── module example.test/shop (go.mod)\n    ├── package main          ./main.go\n    ├── package price         ./price/*.go\n    └── package main          ./cmd/report/*.go\n\nThe repository may also contain another module or non-Go files.\n```",
  codeTitle: "Count packages and modules separately",
  files: {
    "go.mod": mod("module example.test/shop", "", "go 1.23.0"),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/shop/price\"",
      ")",
      "",
      "func main() { fmt.Println(price.Total(4, 25)) }"
    ),
    "price/price.go": go("package price", "", "func Total(count, each int) int { return count * each }"),
    "price/price_test.go": go(
      "package price",
      "",
      "import \"testing\"",
      "",
      "func TestTotal(t *testing.T) {",
      "\tif Total(4, 25) != 100 {",
      "\t\tt.Fatal(\"unexpected total\")",
      "\t}",
      "}"
    ),
  },
  commands: ["go list -m", "go list ./...", "go test ./..."],
  checks: [["go", "list", "-m"], ["go", "list", "./..."], ["go", "test", "./..."], ["go", "vet", "./..."]],
  codeNote: "The module command prints one identity, while the package command prints both `example.test/shop` and `example.test/shop/price`.",
  followups: [
    "Does every new package need an independent semantic version?",
    "Why might a repository contain several modules?",
    "Which boundary changes when a nested `go.mod` is added?",
  ],
});

function finalize() {
function plainWords(value) {
  return String(value)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_#>|~-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function metaDescription(value) {
  const plain = value.replace(/[`*_#]/g, "").replace(/\s+/g, " ").trim();
  return plain.length <= 210 ? plain : `${plain.slice(0, 207).trimEnd()}...`;
}

function metaTitle(value) {
  const suffix = " | Go interview";
  const limit = 80 - suffix.length;
  return `${value.length <= limit ? value : value.slice(0, limit).trimEnd()}${suffix}`;
}

function writeExampleFiles(root, files) {
  for (const [relative, file] of Object.entries(files)) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, formatSource(file));
  }
}

function validateExamples() {
  const validationRoot = fs.realpathSync(
    fs.mkdtempSync(path.join(os.tmpdir(), "go-modules-gold-"))
  );
  const sharedBuildCache = path.join(validationRoot, ".build-cache");
  fs.mkdirSync(sharedBuildCache, { recursive: true });
  try {
    lessons.forEach((lesson, index) => {
      const root = path.join(validationRoot, `${String(index + 1).padStart(2, "0")}-${lesson.topicSlug}`);
      fs.mkdirSync(root, { recursive: true });
      writeExampleFiles(root, lesson.files);
      const cacheRoot = path.join(root, ".validation-cache");
      fs.mkdirSync(path.join(cacheRoot, "modules"), { recursive: true });
      fs.mkdirSync(path.join(cacheRoot, "bin"), { recursive: true });
      const environment = {
        ...process.env,
        GOPROXY: "off",
        GOSUMDB: "off",
        GOCACHE: sharedBuildCache,
        GOMODCACHE: path.join(cacheRoot, "modules"),
        GOBIN: path.join(cacheRoot, "bin"),
        GOWORK: Object.hasOwn(lesson.files, "go.work") ? path.join(root, "go.work") : "off",
      };
      for (const [name, value] of Object.entries(lesson.checkEnv ?? {})) {
        environment[name] = value.replaceAll("$TMP", root);
      }
      for (const rawCheck of lesson.checks) {
        const check = Array.isArray(rawCheck) ? { argv: rawCheck } : rawCheck;
        const [command, ...args] = check.argv;
        const result = spawnSync(command, args, {
          cwd: root,
          env: environment,
          encoding: "utf8",
          timeout: 60_000,
        });
        if (result.error) {
          throw new Error(`${lesson.question}: ${check.argv.join(" ")} could not run: ${result.error.message}`);
        }
        if (check.expectFailure) {
          if (result.status === 0) {
            throw new Error(`${lesson.question}: ${check.argv.join(" ")} was expected to fail.`);
          }
          continue;
        }
        if (result.status !== 0) {
          throw new Error(
            `${lesson.question}: ${check.argv.join(" ")} failed (${result.status}).\n${result.stdout}${result.stderr}`
          );
        }
        if (check.stdoutIncludes && !result.stdout.includes(check.stdoutIncludes)) {
          throw new Error(
            `${lesson.question}: ${check.argv.join(" ")} did not print ${JSON.stringify(check.stdoutIncludes)}.\n${result.stdout}`
          );
        }
      }
      fs.rmSync(cacheRoot, { recursive: true, force: true });
    });
  } finally {
    fs.rmSync(validationRoot, { recursive: true, force: true });
  }
}

function curateTopic(topicSlug, specs) {
  if (specs.length !== 3) {
    throw new Error(`${topicSlug} must contain exactly three retained lessons.`);
  }
  const file = path.join(moduleRoot, topicSlug, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  const retained = document.questions.slice(0, 3);
  if (retained.length !== 3) {
    throw new Error(`${topicSlug} does not contain q001-q003.`);
  }
  document.topic = topicTitles[topicSlug];
  document.questions = specs.map((spec, index) => {
    const previous = retained[index];
    const expectedSuffix = `q00${index + 1}`;
    if (!previous.id.endsWith(expectedSuffix)) {
      throw new Error(`${topicSlug} expected ${expectedSuffix}, found ${previous.id}.`);
    }
    if (spec.quick.length < 3 || spec.quick.length > 6) {
      throw new Error(`${previous.id} has ${spec.quick.length} quick-revision points.`);
    }
    const speaking = formatInterviewArticle(spec.speaking);
    const speakingWords = plainWords(speaking);
    if (speakingWords < 220 || speakingWords > 320) {
      throw new Error(`${previous.id} interview answer has ${speakingWords} words; expected 220-320.`);
    }
    const deepWords = plainWords(spec.deep);
    if (deepWords < 150 || deepWords > 360) {
      throw new Error(`${previous.id} deep dive has ${deepWords} words; expected 150-360.`);
    }
    if (plainWords(spec.direct) < 24) {
      throw new Error(`${previous.id} direct answer is too short.`);
    }
    const example = `${renderFiles(spec.files, spec.commands)}\n\n${spec.codeNote}`;
    const sections = [
      { type: "key_points", title: "Quick revision", items: spec.quick },
      {
        type: "speakable_answer",
        title: "Interview answer",
        answerSize: interviewAnswerSize(speaking),
        content: speaking,
      },
      { type: "overview", title: spec.overviewTitle, content: spec.overview },
      { type: "deep_explanation", title: spec.deepTitle, content: spec.deep },
      { type: spec.visualType, title: spec.visualTitle, content: spec.visual },
      { type: "code_example", title: spec.codeTitle, content: example },
    ];
    const totalWords = [spec.direct, speaking, spec.overview, spec.deep, spec.visual, example]
      .map(plainWords)
      .reduce((sum, count) => sum + count, 0);
    const { interviewer_intent: _intent, speakable_v2: _speakable, ...stable } = previous;
    return {
      ...stable,
      question: spec.question,
      title: spec.title,
      direct_answer: spec.direct,
      layout_type: "concept-explanation",
      difficulty: "easy",
      importance: "high",
      reading_time_minutes: Math.max(5, Math.ceil(totalWords / 200)),
      last_updated: "2026-09-07",
      answer: { sections },
      followup_questions: spec.followups,
      order: index + 1,
      seo: {
        ...previous.seo,
        metaTitle: metaTitle(spec.title),
        metaDescription: metaDescription(spec.direct),
      },
    };
  });
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

function replaceIndexedModule(indexSource, moduleSlug, transform) {
  const marker = `"moduleSlug": "${moduleSlug}"`;
  const markerIndex = indexSource.indexOf(marker);
  if (markerIndex < 0) throw new Error(`${moduleSlug} is missing from _index.json.`);
  const objectStart = indexSource.lastIndexOf("\n    {", markerIndex) + 1;
  if (objectStart <= 0) throw new Error(`Could not locate ${moduleSlug} object start.`);
  let depth = 0;
  let inString = false;
  let escaped = false;
  let objectEnd = -1;
  for (let index = objectStart; index < indexSource.length; index += 1) {
    const character = indexSource[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        objectEnd = index + 1;
        break;
      }
    }
  }
  if (objectEnd < 0) throw new Error(`Could not locate ${moduleSlug} object end.`);
  const current = JSON.parse(indexSource.slice(objectStart, objectEnd));
  const updated = transform(current);
  const rendered = JSON.stringify(updated, null, 2)
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n")
    .replace(/[^\x00-\x7f]/g, (character) =>
      `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`
    );
  return `${indexSource.slice(0, objectStart)}${rendered}${indexSource.slice(objectEnd)}`;
}

function curateModuleDocuments() {
  const intro = "Learn how Go turns directories into importable packages and packages into reproducible module graphs: read `go.mod` as a build contract, choose stable paths, design exported APIs, change dependency versions deliberately, use tidy without guessing, understand checksum boundaries, configure private modules safely, coordinate local workspaces, and distinguish direct, indirect, cached, and vendored dependencies. Every retained lesson answers one common fresher interview question with an independently runnable or testable local example.";
  const configPath = path.join(moduleRoot, "_config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  Object.assign(config, {
    title: "Go Modules, Packages, and Dependencies",
    topics: topicOrder,
    intro,
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
  });
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  const revision = {
    title: "Go Modules, Packages, and Dependencies — Revision",
    estimatedMinutes: 15,
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
    sections: [
      {
        id: "identity-and-packages",
        title: "Identity and package boundaries",
        body: "- A module is a versioned collection rooted at `go.mod`; a package is one directory-level compilation unit. Package import paths normally combine the module path and relative directory.\n- Uppercase names form the caller-visible API; lowercase names stay inside one package. An `internal` path separately limits who may import a whole package.\n- Repository, module, and package boundaries often align in small projects but control source history, versioning, and compilation respectively.",
      },
      {
        id: "dependency-commands",
        title: "Dependency commands",
        body: "- `go get` changes requirements in the current module; explicit version queries add, upgrade, downgrade, or remove modules.\n- `go mod download` prepares or inspects cached module artifacts; normal build commands download what they need.\n- `go install path@version` installs a released command independently of the current module. `go mod tidy` reconciles metadata with source, tests, tools, and almost all build-tag variants.",
      },
      {
        id: "selection-and-integrity",
        title: "Selection and integrity",
        body: "- Minimal version selection chooses the highest required version of each module path: the minimum satisfying the reachable graph. `// indirect` describes graph position, not optionality.\n- `go.mod` defines identity and graph constraints. `go.sum` authenticates downloaded module bytes; it is not a lock file.\n- `GOPRIVATE` controls private-path proxy and checksum defaults, while credentials remain a separate concern.",
      },
      {
        id: "paths-and-local-development",
        title: "Paths and local development",
        body: "- Published module paths should be stable and controlled. v2+ modules normally carry `/vN` in the path, so incompatible majors can coexist.\n- A local `replace` is a main-module override; downstream users do not inherit a dependency's replacements. A `go.work` file coordinates several local main modules.\n- The module cache is shared Go-tool state; vendor is a project-owned derived copy. Commit workspace and vendor files only under an explicit repository policy.",
      },
    ],
  };
  fs.writeFileSync(path.join(moduleRoot, "_revision.json"), `${JSON.stringify(revision, null, 2)}\n`);

  const indexPath = path.join(domainRoot, "_index.json");
  const indexSource = fs.readFileSync(indexPath, "utf8");
  const updatedIndex = replaceIndexedModule(indexSource, "go-modules-basics", (module) => ({
    ...module,
    title: config.title,
    topics: topicOrder,
    intro,
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
  }));
  JSON.parse(updatedIndex);
  fs.writeFileSync(indexPath, updatedIndex);
}

function auditWrittenModule() {
  const ids = new Set();
  const slugs = new Set();
  const questions = new Set();
  const forbidden = /interviewer_expectation|interviewer_intent|speakable_v2|what the interviewer wants|to stand out/i;
  for (const topicSlug of topicOrder) {
    const document = JSON.parse(
      fs.readFileSync(path.join(moduleRoot, topicSlug, "complete-qa.json"), "utf8")
    );
    if (document.questions.length !== 3) {
      throw new Error(`${topicSlug} wrote ${document.questions.length} questions.`);
    }
    document.questions.forEach((question, index) => {
      if (!question.id.endsWith(`q00${index + 1}`)) {
        throw new Error(`${question.id} did not preserve its q001-q003 position.`);
      }
      for (const [label, value, set] of [
        ["id", question.id, ids],
        ["slug", question.slug, slugs],
        ["question", question.question.toLowerCase(), questions],
      ]) {
        if (set.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
        set.add(value);
      }
      const serialized = JSON.stringify(question);
      if (forbidden.test(serialized)) {
        throw new Error(`${question.id} retained coaching/meta content.`);
      }
      const sections = question.answer?.sections ?? [];
      if (sections.length !== 6) throw new Error(`${question.id} does not have six teaching sections.`);
      const quick = sections.find((section) => section.type === "key_points");
      const interview = sections.find((section) => section.type === "speakable_answer");
      const deep = sections.find((section) => section.type === "deep_explanation");
      const codeSection = sections.find((section) => section.type === "code_example");
      if (!quick || quick.items.length < 3 || quick.items.length > 6) {
        throw new Error(`${question.id} has invalid quick revision.`);
      }
      const speakingWords = plainWords(interview?.content ?? "");
      if (interview?.answerSize !== "standard" || speakingWords < 220 || speakingWords > 320) {
        throw new Error(`${question.id} has invalid interview depth (${speakingWords}).`);
      }
      if (plainWords(deep?.content ?? "") < 150) throw new Error(`${question.id} has shallow deep dive.`);
      if (!codeSection?.content.includes("```go")) throw new Error(`${question.id} has no Go example.`);
      if ((question.followup_questions ?? []).length < 3) throw new Error(`${question.id} lacks follow-ups.`);
    });
  }
  const config = JSON.parse(fs.readFileSync(path.join(moduleRoot, "_config.json"), "utf8"));
  const revision = JSON.parse(fs.readFileSync(path.join(moduleRoot, "_revision.json"), "utf8"));
  if (config.questionCount !== 24 || revision.questionCount !== 24) {
    throw new Error("Module documents do not report 24 questions.");
  }
  const index = JSON.parse(fs.readFileSync(path.join(domainRoot, "_index.json"), "utf8"));
  const indexed = index.modules.find((module) => module.moduleSlug === "go-modules-basics");
  if (!indexed || indexed.questionCount !== 24 || indexed.status !== "gold-standard") {
    throw new Error("Canonical Go index does not contain the curated M13 metadata.");
  }
}

const byTopic = new Map(topicOrder.map((topic) => [topic, []]));
for (const lesson of lessons) {
  const entries = byTopic.get(lesson.topicSlug);
  if (!entries) throw new Error(`Unexpected topic ${lesson.topicSlug}.`);
  entries.push(lesson);
}
if (lessons.length !== 24) {
  throw new Error(`Expected 24 lessons, found ${lessons.length}.`);
}

validateExamples();
for (const topic of topicOrder) curateTopic(topic, byTopic.get(topic));
curateModuleDocuments();
auditWrittenModule();

console.log(
  "Curated Go M13 go-modules-basics: 24 retained gold lessons; removed q004/q005 shells from eight topics; validated all 24 examples offline."
);
}

add({
  topicSlug: "comparisons",
  question: "What is the difference between direct and indirect dependencies in Go, and how is a version selected?",
  title: "Direct imports, indirect graph requirements, and MVS",
  direct: "A direct dependency provides a package imported by code in the main module; an indirect dependency reaches the graph through other requirements or records graph information needed by the module. Go uses minimal version selection to choose the highest required version of each module path—the minimum version satisfying all reachable requirements—not simply the newest available release.",
  quick: [
    "Direct means a main-module package imports a package from that module.",
    "Indirect means the module is needed through the wider graph or graph recording rules.",
    "`// indirect` does not mean optional or unused.",
    "MVS keeps the highest required version for each module path.",
    "New upstream releases do not enter the build list without a graph change.",
    "Use `go list -m all` to inspect selected versions.",
  ],
  speaking: paragraphs(
    "- A direct dependency provides at least one package imported by a package or test in the main module. Its requirement is tied to source you own. An indirect dependency enters through another module's requirements or is recorded explicitly so the pruned module graph contains enough information. The `// indirect` comment describes that relationship; it does not mean the module is optional or unused.",
    "- Version selection is shared across the graph. Go's minimal version selection walks reachable `go.mod` requirements and, for each module path, chooses the highest version required anywhere. It is called minimal because it picks the minimum version that satisfies all known lower bounds, not because it chooses the numerically lowest requirement.",
    "- For example, the app directly imports modules `a` and `b`. Module A requires `c` v1.2.0, while B requires C v1.4.0. The resulting build list selects C v1.4.0. C is indirect from the app's source perspective, but both direct dependencies depend on its API and the program cannot build without it.",
    "- Path-wide local replacements make all three module sources available offline; the version labels still let `go list -m all` demonstrate selection. In a real graph, selected C v1.4.0 supplies its actual released code. Adding an unrelated v1.5.0 upstream would not change this build because no reachable requirement requests it.",
    "- When a selected version is surprising, I inspect `go list -m all`, `go mod graph`, and `go mod why -m`. I avoid deleting indirect lines by hand: tidy maintains graph requirements under the module's Go version. The practical test is whether the selected combined APIs work, since MVS resolves versions but cannot guarantee semantic compatibility."
  ),
  overviewTitle: "Source ownership and graph selection answer different questions",
  overview: "Direct versus indirect explains why a module is connected to this code. MVS explains which one of that module's versions supplies content after all connected requirements are considered.",
  deepTitle: "Walk the graph to the selected version",
  deep: paragraphs(
    "Each module version is a graph node whose `require` lines point to minimum versions of other modules. Starting from the main module or workspace, the go command loads the relevant graph and tracks the highest requirement seen for every path.",
    "If two nodes require different versions of C, one selected C version must satisfy both. Choosing the higher required version accomplishes this without automatically jumping to a newer release that no node requested.",
    "Modern module graph pruning records more indirect requirements in the main `go.mod` so commands can avoid loading unnecessary transitive module files. The comment therefore carries graph-maintenance meaning, not a recommendation to remove the line.",
    "Directness can change when source imports change. If the main module begins importing a C package, tidy may reclassify its requirement as direct even when the selected version stays the same. Conversely, removing that import can make it indirect if A or B still needs C.",
    "MVS offers deterministic selection, but an upgrade can still break callers through behavior, bugs, or an improperly incompatible release. Dependency tests and review remain the evidence for application compatibility."
  ),
  visualType: "flow_diagram",
  visualTitle: "Highest required version wins the minimum satisfying graph",
  visual: "```mermaid\nflowchart TD\n  APP[Main module] --> A[A v1.0.0]\n  APP --> B[B v1.0.0]\n  A --> C12[C >= v1.2.0]\n  B --> C14[C >= v1.4.0]\n  C12 --> S[Selected C v1.4.0]\n  C14 --> S\n```",
  codeTitle: "Observe minimal version selection with local modules",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "require (",
      "\texample.test/a v1.0.0",
      "\texample.test/b v1.0.0",
      "\texample.test/c v1.4.0 // indirect",
      ")",
      "",
      "replace example.test/a => ./a",
      "replace example.test/b => ./b",
      "replace example.test/c => ./c"
    ),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/a\"",
      "\t\"example.test/b\"",
      ")",
      "",
      "func main() { fmt.Println(a.Value(), b.Value()) }"
    ),
    "a/go.mod": mod(
      "module example.test/a",
      "",
      "go 1.23.0",
      "",
      "require example.test/c v1.2.0"
    ),
    "a/a.go": go(
      "package a",
      "",
      "import \"example.test/c\"",
      "",
      "func Value() string { return \"a:\" + c.Value() }"
    ),
    "b/go.mod": mod(
      "module example.test/b",
      "",
      "go 1.23.0",
      "",
      "require example.test/c v1.4.0"
    ),
    "b/b.go": go(
      "package b",
      "",
      "import \"example.test/c\"",
      "",
      "func Value() string { return \"b:\" + c.Value() }"
    ),
    "c/go.mod": mod("module example.test/c", "", "go 1.23.0"),
    "c/c.go": go("package c", "", "func Value() string { return \"c\" }"),
  },
  commands: ["GOPROXY=off go list -m all", "go test ./...", "go run ."],
  checks: [["go", "list", "-m", "all"], ["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "`go list -m all` reports `example.test/c v1.4.0 => ./c`, the highest requirement reachable from A and B.",
  followups: [
    "Why does `// indirect` not mean a dependency is unused?",
    "Would a newly published C v1.5.0 enter this build automatically?",
    "Which command can explain why C is needed?",
  ],
});

add({
  topicSlug: "comparisons",
  question: "What is the difference between the Go module cache and a `vendor` directory?",
  title: "Shared module cache versus project-owned vendor source",
  direct: "The module cache is a machine-level cache of downloaded modules shared across projects and managed by the Go tool. A `vendor` directory is a copied dependency package tree owned by one main module or workspace, created with `go mod vendor`. Vendor mode builds from that tree; the module files still define which dependencies and versions should be vendored.",
  quick: [
    "The module cache is shared across projects on one Go environment.",
    "Cached module source should be treated as Go-tool-managed and read-only.",
    "`go mod vendor` copies needed dependency packages into `vendor`.",
    "Vendor belongs to the project and can support controlled or offline builds.",
    "`go.mod` remains the source of dependency selection; `vendor/modules.txt` records the copy.",
    "Vendoring increases repository size and requires regeneration after graph changes.",
  ],
  speaking: paragraphs(
    "- The module cache and vendor directory both hold dependency source, but they have different ownership. The module cache is managed by the go command, normally under `GOMODCACHE`, and is shared by many projects on the machine. Downloaded module versions are stored once and reused; application repositories should not edit those cached files.",
    "- A `vendor` directory belongs to a particular main module or workspace. `go mod vendor` recreates it from the packages needed to build and test the main module's packages, omitting dependency test packages. It also writes `vendor/modules.txt` with module information. Vendor content is a derived copy, while `go.mod` remains the graph definition.",
    "- In vendor mode, build commands resolve dependency imports from that directory instead of fetching or reading normal module-cache package source. Current Go can choose vendor mode automatically when the module's Go version and vendor metadata meet documented conditions, or a command can request it explicitly with `-mod=vendor`.",
    "- For example, this project requires a locally replaced dependency, runs `go mod vendor`, and tests with `-mod=vendor`. After copying, the dependency package is available under `vendor/example.test/message`; the nested source module remains only the input used to generate that copy. The executable prints the same behavior through vendored resolution.",
    "- Vendoring helps audited source snapshots, restricted-network builds, and environments that require dependencies inside the repository. Its costs are repository size, noisy diffs, and the risk of stale copies after `go.mod` changes. The shared cache is simpler for most development. I choose a policy explicitly and make CI verify vendor consistency when the project commits it."
  ),
  overviewTitle: "Global reuse or local ownership",
  overview: "The cache optimises downloads across projects and stays outside source control. Vendor trades duplication for a project-local dependency snapshot that build commands can consume under a deliberate mode.",
  deepTitle: "Know which source tree a build reads",
  deep: paragraphs(
    "Normal module mode resolves selected versions from the module cache, downloading missing content through configured proxies or version control. Checksums authenticate downloaded versions according to module policy.",
    "Vendor generation reads the selected graph and copies only packages needed by the main module's build and tests. It does not copy every file or dependency test, and it should be regenerated rather than edited as the authoritative source.",
    "`vendor/modules.txt` connects copied packages back to modules and versions. If its metadata is inconsistent with `go.mod`, vendor-mode commands can report the mismatch instead of silently using an arbitrary tree.",
    "A committed vendor tree can make a build independent of network availability and the machine's previous cache, but only if the checked-in copy is complete and the command actually uses vendor mode. It does not eliminate the need to review or update dependency metadata.",
    "Workspace vendoring has its own workspace-wide command and metadata in current Go. Whether module or workspace scoped, establish one reproducible command in CI so developers do not unknowingly test cached source while releases build vendored source."
  ),
  visualType: "comparison_table",
  visualTitle: "Two dependency source locations",
  visual: "| Property | Module cache | `vendor` directory |\n|---|---|---|\n| Ownership | Go environment | One project/workspace |\n| Shared across projects | Yes | No |\n| Usually committed | No | Policy-dependent, often yes when used |\n| Populated by | Downloads during Go commands | `go mod vendor` / `go work vendor` |\n| Main trade-off | External managed cache | Larger, regenerable source snapshot |",
  codeTitle: "Generate and build from a vendor tree",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "require example.test/message v1.0.0",
      "",
      "replace example.test/message => ./message"
    ),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/message\"",
      ")",
      "",
      "func main() { fmt.Println(message.Text()) }"
    ),
    "message/go.mod": mod("module example.test/message", "", "go 1.23.0"),
    "message/message.go": go("package message", "", "func Text() string { return \"vendored dependency\" }"),
  },
  commands: [
    "go mod vendor",
    "go test -mod=vendor ./...",
    "go run -mod=vendor .",
    "go env GOMODCACHE",
  ],
  checks: [["go", "mod", "vendor"], ["go", "test", "-mod=vendor", "./..."], ["go", "vet", "-mod=vendor", "./..."], ["go", "run", "-mod=vendor", "."], ["go", "env", "GOMODCACHE"]],
  codeNote: "The vendor command copies only the dependency package needed by the app. Subsequent commands explicitly choose that copy with `-mod=vendor`.",
  followups: [
    "Should developers edit source directly inside the module cache?",
    "Does vendoring replace the need for `go.mod`?",
    "Which dependency tests are copied by `go mod vendor`?",
  ],
});

add({
  topicSlug: "module-path-convention",
  question: "Why do Go modules at version 2 or later use `/v2` in the module path?",
  title: "Semantic import versioning for major releases",
  direct: "A v2-or-later module normally includes the major version in its module path, such as `example.com/lib/v2`. Its packages are imported through that new prefix, so incompatible majors have distinct identities and can coexist in one dependency graph. Versions v0 and v1 use the unsuffixed path.",
  quick: [
    "v0 and v1 normally use the base module path.",
    "v2 and later normally add `/vN` to the module path.",
    "The semantic version's major number must match the path suffix.",
    "Imports also include `/vN` before any package subdirectory.",
    "Different major paths can coexist because they are different modules.",
  ],
  speaking: paragraphs(
    "- Go puts the major version into the module path for incompatible releases after v1. A module released as v2 normally declares `module example.com/quote/v2`, and a package beneath it is imported through that prefix. The semantic version tag and path therefore agree: versions beginning with v2 belong to the `/v2` module identity.",
    "- This rule is called semantic import versioning. A new major version promises that compatibility may have broken, so source code must choose the new import path explicitly. Existing users of `example.com/quote` continue on the v0/v1 identity until they update their imports and code.",
    "- Distinct paths also allow coexistence. One part of a build can depend on the v1 path while another uses `/v2`; the graph treats them as separate modules and packages rather than forcing one version to satisfy incompatible APIs. This is useful during migrations, although passing types between the two APIs may require conversion because their named types are distinct.",
    "- In the example, the dependency module declares `example.test/quote/v2`, the main module requires v2.0.0, and the import is `example.test/quote/v2`. A local replacement supplies the source offline, but it does not relax path matching: the replacement module's declaration still needs to match the module path being replaced.",
    "- The base rule has established exceptions such as the `gopkg.in` path style, and modules stored in repository subdirectories need matching tag prefixes. For ordinary new modules, the reliable answer is simple: no `/v1`, but add `/v2`, `/v3`, and so on when publishing incompatible major versions, then update imports deliberately."
  ),
  overviewTitle: "Breaking compatibility creates a new import identity",
  overview: "The `/vN` suffix makes the incompatible choice visible in source. Dependency resolution can then retain old and new majors independently rather than guessing which API every importer expects.",
  deepTitle: "Keep path, tag, and imports aligned",
  deep: paragraphs(
    "For v0 and v1, the module path has no major suffix. These versions share one module identity, and minimal version selection chooses one version for that path. v0 communicates instability by convention; v1 is the first stable compatibility line.",
    "For v2+, the final path element is `/vN`. Tags at a repository root use `vN.x.y`; a module in a repository subdirectory uses tags that include the subdirectory prefix. The module directive inside the released source must agree with the path and version.",
    "Callers update imports, not merely the require line. If v2 changes `quote.Text()` to a different API, source choosing `/v2` must compile against that contract. Tooling cannot safely infer an incompatible migration.",
    "Because paths differ, v1 and v2 packages produce distinct named types even if declarations look identical. This is part of isolation, but it can make a long mixed-major transition costly when values cross package boundaries.",
    "Do not add `/v1` as a symmetry exercise; it changes the identity incorrectly. Introduce a new major only for genuine incompatible evolution and supply migration guidance so consumers understand both the source import change and behavioral differences."
  ),
  visualType: "flow_diagram",
  visualTitle: "Major version becomes part of identity",
  visual: "```mermaid\nflowchart LR\n  A[example.com/quote at v1.8.0] --> C[Import: example.com/quote]\n  B[example.com/quote/v2 at v2.0.0] --> D[Import: example.com/quote/v2]\n  C --> E[Both may appear in one build]\n  D --> E\n```",
  codeTitle: "Import a local v2 module through its major-version path",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "require example.test/quote/v2 v2.0.0",
      "",
      "replace example.test/quote/v2 => ./quotev2"
    ),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\tquote \"example.test/quote/v2\"",
      ")",
      "",
      "func main() { fmt.Println(quote.Text()) }"
    ),
    "quotev2/go.mod": mod("module example.test/quote/v2", "", "go 1.23.0"),
    "quotev2/quote.go": go("package quote", "", "func Text() string { return \"version two\" }"),
  },
  commands: ["GOPROXY=off go list -m all", "go test ./...", "go run ."],
  checks: [["go", "list", "-m", "all"], ["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "The module declaration, required semantic version, and import prefix all agree on major version 2.",
  followups: [
    "Why is `/v1` normally absent from a module path?",
    "Can v1 and v2 of a library appear in the same build?",
    "What happens to named types when two major package paths coexist?",
  ],
});

add({
  topicSlug: "module-path-convention",
  question: "When should you use a local `replace` directive instead of a `go.work` workspace?",
  title: "Choosing between replace and a multi-module workspace",
  direct: "Use a local `replace` when one main module should redirect a dependency path, often for a focused temporary test or fork. Use `go.work` when developing several local modules together as main modules without editing each module's release metadata. Workspace commit policy depends on whether the repository intentionally shares that workspace with CI and the team.",
  quick: [
    "A `replace` in `go.mod` changes resolution for that main module.",
    "A local replacement target must contain a matching `go.mod`.",
    "A `go.work` file lists several local modules with `use` directives.",
    "Workspace-level replacements can override module-level replacements.",
    "Commit `go.work` only when the repository deliberately shares that workspace model.",
  ],
  speaking: paragraphs(
    "- Both mechanisms let local code stand in for released dependencies, but their scope is different. A `replace` directive belongs to one main module's `go.mod`. It redirects a module path or version to another version or local directory, which is useful for testing a focused patch, developing against a fork, or making one consumer use a sibling checkout.",
    "- A `go.work` file defines a workspace containing multiple main modules through `use` directives. Commands run in that workspace treat those modules together, so an app can import a sibling library without adding a temporary replacement to the app's release metadata. A workspace can also contain replace directives that apply across its main modules.",
    "- For example, `app` and `lib` each keep an independent `go.mod`; the root `go.work` uses both. `go -C app run .` resolves `example.test/lib` from the local workspace. Tests run from each listed module because the workspace root itself is not an ordinary module package.",
    "- Scope creates the main trade-off. A committed local path replacement can break consumers who do not have that filesystem layout, and a dependency's own replacements are ignored by downstream users. A workspace file can also make local commands test unreleased sibling code while CI or users test released versions if they are not using the same workspace.",
    "- I use replace for a narrow override owned by one main module and a workspace for deliberate multi-module development. Whether to commit `go.work` is a project decision: a monorepo may intentionally share it with CI, while an ad-hoc personal workspace should remain local. In either case, test each module's release state so local coordination does not hide missing requirements."
  ),
  overviewTitle: "One consumer override or several cooperating mains",
  overview: "Replace modifies dependency resolution from a main module. A workspace changes command context by making several modules main at once. The right choice follows who should see the local source and whether the setup is temporary or a shared repository contract.",
  deepTitle: "Understand what downstream users receive",
  deep: paragraphs(
    "A local replace line is interpreted only when its `go.mod` is part of the active main-module set. If a library publishes a replace directive, applications depending on that library do not inherit it. This keeps consumers in control of their own builds.",
    "A workspace's `use` entries identify module directories on disk. All become main modules for graph construction. Conflicting module-level replacements must be resolved, and a go.work replacement can provide the workspace-wide decision.",
    "`go env GOWORK` shows the active workspace file. The `GOWORK=off` setting is valuable when checking how a module behaves by itself, which catches missing release requirements that local sibling source may conceal.",
    "Commit policy has no universal answer. A repository designed as a coordinated multi-module workspace can version the file so local and CI commands agree. A workspace spanning unrelated checkouts or unpublished experimental versions is personal environment state and should not redefine everyone else's build.",
    "Before publishing, verify module paths, requirements, and tests outside accidental local overrides. A workspace improves development ergonomics; it does not publish sibling modules or make their unreleased source available to external consumers."
  ),
  visualType: "comparison_table",
  visualTitle: "Scope of local dependency coordination",
  visual: "| Choice | Stored in | Effective for | Best fit |\n|---|---|---|---|\n| Local `replace` | One `go.mod` | That active main module | Focused override or fork test |\n| `go.work use` | Workspace file | All listed main modules | Coordinated local multi-module work |\n| Released requirement | `go.mod` plus published version | Downstream consumers | Reproducible distribution |",
  codeTitle: "Develop an app and library as two workspace modules",
  files: {
    "go.work": mod("go 1.23.0", "", "use (", "\t./app", "\t./lib", ")"),
    "app/go.mod": mod("module example.test/app", "", "go 1.23.0"),
    "app/main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/lib\"",
      ")",
      "",
      "func main() { fmt.Println(lib.Message()) }"
    ),
    "lib/go.mod": mod("module example.test/lib", "", "go 1.23.0"),
    "lib/lib.go": go("package lib", "", "func Message() string { return \"workspace source\" }"),
    "lib/lib_test.go": go(
      "package lib",
      "",
      "import \"testing\"",
      "",
      "func TestMessage(t *testing.T) {",
      "\tif Message() != \"workspace source\" {",
      "\t\tt.Fatal(\"unexpected message\")",
      "\t}",
      "}"
    ),
  },
  commands: [
    "go env GOWORK",
    "go -C app test ./... && go -C lib test ./...",
    "go -C app run .",
  ],
  checks: [["go", "env", "GOWORK"], ["go", "-C", "app", "test", "./..."], ["go", "-C", "lib", "test", "./..."], ["go", "-C", "app", "vet", "./..."], ["go", "-C", "lib", "vet", "./..."], ["go", "-C", "app", "run", "."]],
  codeNote: "Neither module needs a local replace. The workspace makes both main modules available for these commands without merging their release identities.",
  followups: [
    "Do downstream users inherit a dependency module's replace directive?",
    "How can you test one module with workspace mode disabled?",
    "When is committing `go.work` appropriate?",
  ],
});

add({
  topicSlug: "go-sum",
  question: "How do `go.sum` and the Go checksum database protect dependencies?",
  title: "Authenticating downloaded module content",
  direct: "The Go tool hashes downloaded module files and compares them with `go.sum`; for public modules, it normally obtains or confirms expected hashes through the checksum database. This detects a proxy, mirror, origin, or damaged cache serving different bytes for the same module version. It authenticates content identity, not code quality or vulnerability status.",
  quick: [
    "Downloaded module content is hashed before use.",
    "`go.sum` stores expected hashes for module zips and module files.",
    "The public checksum database provides globally consistent hash records by default.",
    "A mismatch is a security error, not a routine update prompt.",
    "Checksums do not prove that dependency code is safe or bug-free.",
  ],
  speaking: paragraphs(
    "- Module versions are expected to be immutable: the same path and version should always mean the same bytes. When the go command downloads a module zip or module file, it computes a cryptographic hash. If `go.sum` already contains the corresponding entry, the downloaded data must match it or the command stops with a security error.",
    "- For publicly available modules, the default checksum database provides a globally consistent source of hash records. When a checksum is not yet in the main module's `go.sum`, the go command can look it up and verify the signed, append-only database record. This allows module proxies to be treated as distribution caches rather than trusted authors of replacement content.",
    "- The two common line forms authenticate different artifacts. `example.com/lib v1.2.3 h1:...` covers the module zip content, while `example.com/lib v1.2.3/go.mod h1:...` covers that version's `go.mod` file. Both may matter because graph resolution can read module metadata without downloading every package archive.",
    "- For example, `go mod verify` checks that downloaded module content in the local cache has not changed since it was downloaded, using the recorded hashes. This offline project has no downloaded dependencies, so verification succeeds with nothing external to inspect; it still demonstrates that verification is a module command rather than application logic.",
    "- Integrity has a clear boundary. A valid checksum proves that the bytes agree with the recorded module version, not that those bytes are well designed, licensed appropriately, free of malware, or without known vulnerabilities. Dependency review, trusted sources, vulnerability scanning, and update policy remain necessary alongside checksum authentication."
  ),
  overviewTitle: "Detect changed bytes for an unchanged version",
  overview: "The module path and version name an artifact; the hash identifies its contents. The checksum database makes the expected identity consistent across users, while `go.sum` carries the evidence needed by this module.",
  deepTitle: "Follow a public module download",
  deep: paragraphs(
    "The go command resolves a module version through configured proxies or version control, obtains module metadata and possibly a zip, and calculates hashes using the module hashing rules rather than arbitrary archive bytes.",
    "If the main module already records a hash, a different result is rejected. If it does not, public-module defaults can query `sum.golang.org`, verify the database's signed tree evidence, and add the authenticated line to `go.sum`.",
    "This design helps detect an origin retagging a release or a proxy returning modified contents under an existing version. It also makes independently downloaded copies comparable without making one proxy the authority for content identity.",
    "Private modules often cannot be disclosed to a public checksum database, so patterns such as `GOPRIVATE` or `GONOSUMDB` change that lookup policy. The organisation must then supply trust through authenticated version control or a private proxy.",
    "Do not respond to a mismatch by deleting `go.sum` and accepting new bytes until the cause is understood. Confirm the intended release, cache state, proxy configuration, and source history. The refusal is the protection working as designed."
  ),
  visualType: "sequence_diagram",
  visualTitle: "Public module integrity check",
  visual: "```mermaid\nsequenceDiagram\n  participant G as Go command\n  participant P as Module proxy/origin\n  participant S as Checksum database\n  participant F as go.sum\n  G->>P: Request module@version\n  P-->>G: Module bytes\n  G->>G: Compute h1 hash\n  G->>S: Confirm expected public hash\n  G->>F: Compare or record hash\n  G-->>G: Accept only matching content\n```",
  codeTitle: "Verify the current module cache state",
  files: standardFiles([
    "package main",
    "",
    "import \"fmt\"",
    "",
    "func main() { fmt.Println(\"standard-library-only module\") }",
  ]),
  commands: ["go mod tidy -diff", "go mod verify", "go test ./...", "go run ."],
  checks: [["go", "mod", "tidy", "-diff"], ["go", "mod", "verify"], ["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "The project has no downloaded dependencies, so verification is intentionally quiet. With remote modules, the same command checks cached content against recorded hashes.",
  followups: [
    "What attack or failure does a checksum mismatch reveal?",
    "Does a valid checksum mean a dependency has no vulnerabilities?",
    "Why might graph resolution need a `/go.mod` hash without a zip hash?",
  ],
});

add({
  topicSlug: "go-sum",
  question: "How should Go be configured for private modules?",
  title: "Keeping private module paths off public services",
  direct: "Set `GOPRIVATE` to comma-separated module-path prefix patterns that should not use the public proxy or checksum database. Use `GONOPROXY` or `GONOSUMDB` for narrower overrides, configure `GOPROXY` when an organisation has a private proxy, and provide Git or proxy credentials separately. These variables control discovery policy, not authentication credentials.",
  quick: [
    "`GOPRIVATE` marks matching module prefixes as private.",
    "Private matches bypass the public proxy and public checksum database by default.",
    "`GONOPROXY` and `GONOSUMDB` override those two decisions separately.",
    "Patterns are comma-separated `path.Match`-style globs over module prefixes.",
    "Credentials must still be configured for Git or the private proxy.",
  ],
  speaking: paragraphs(
    "- Private module configuration begins with path policy. `GOPRIVATE` is a comma-separated list of glob patterns that match module-path prefixes considered private, such as `corp.example.com` or `github.com/acme-private/*`. Matching paths are not sent to the public module proxy or public checksum database under the default configuration.",
    "- `GONOPROXY` and `GONOSUMDB` let those choices differ. They use the same pattern format and override `GOPRIVATE` for proxy and checksum decisions respectively. An organisation with a proxy that serves both public and private modules may instead set `GOPROXY` to that service and set `GONOSUMDB` for private paths it authenticates itself.",
    "- These variables do not contain credentials. Direct repository access still needs Git, SSH, token, or credential-helper configuration; a private proxy still needs its supported authentication. If credentials are missing, a correct `GOPRIVATE` value can prevent information leakage to public services but cannot make the private repository readable.",
    "- The example sets `GOPRIVATE` for one command and prints the effective value without changing global Go configuration. Its private-looking dependency is replaced by a local module, so the build is safe offline. In a real build without replacement, the matching policy would decide whether the go command uses public services or goes directly to the configured private source.",
    "- I choose the narrowest stable organisation prefix and verify it with `go env`. Overly broad patterns can disable public checksum protection for unrelated modules; overly narrow patterns can leak a private module path during failed public lookups. CI and developer machines need the same policy plus non-interactive credentials provided through their secret-management system."
  ),
  overviewTitle: "Policy chooses the route; credentials open the door",
  overview: "Private-module variables decide which proxy and checksum services may learn about a path. Repository or proxy authentication is a separate layer that must be configured securely in each execution environment.",
  deepTitle: "Resolve the three environment decisions",
  deep: paragraphs(
    "`GOPROXY` is an ordered source policy for module downloads. Its separators also control fallback behavior, so a corporate proxy configuration should be copied from the organisation's documented setup rather than improvised.",
    "`GOPRIVATE` supplies a default private-pattern decision for both proxy bypass and checksum-database bypass. Matching is based on module-path prefixes using comma-separated glob syntax, not repository visibility APIs.",
    "`GONOPROXY` and `GONOSUMDB` override the two branches independently. This is useful when a private proxy serves company source but public checksum lookup must still be disabled for confidential path names.",
    "Direct mode invokes version-control tooling. Authentication prompts are unsuitable for CI, and embedding tokens in module paths or committed Git configuration can leak secrets. Use the platform's credential mechanism, SSH setup, or authenticated proxy integration.",
    "A local replace short-circuits remote fetching for development, but it should not be mistaken for validating production private access. Test the real CI route in a controlled environment and confirm logs do not expose credentials or confidential repository paths unnecessarily."
  ),
  visualType: "flow_diagram",
  visualTitle: "Routing a module request",
  visual: "```mermaid\nflowchart TD\n  A[Requested module path] --> B{Matches private pattern?}\n  B -->|No| C[Configured public proxy + checksum DB]\n  B -->|Yes| D{Private proxy configured?}\n  D -->|Yes| E[Authenticated private proxy]\n  D -->|No| F[Direct VCS access]\n  E --> G[Organisation trust policy]\n  F --> H[Git/SSH credentials]\n```",
  codeTitle: "Inspect policy without changing global Go settings",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "require corp.example.com/team/message v1.0.0",
      "",
      "replace corp.example.com/team/message => ./message"
    ),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"corp.example.com/team/message\"",
      ")",
      "",
      "func main() { fmt.Println(message.Text()) }"
    ),
    "message/go.mod": mod("module corp.example.com/team/message", "", "go 1.23.0"),
    "message/message.go": go("package message", "", "func Text() string { return \"private module policy\" }"),
  },
  commands: [
    "GOPRIVATE='corp.example.com' go env GOPRIVATE",
    "GOPRIVATE='corp.example.com' GOPROXY=off go test ./...",
  ],
  checks: [["go", "env", "GOPRIVATE"], ["go", "test", "./..."], ["go", "vet", "./..."]],
  checkEnv: { GOPRIVATE: "corp.example.com" },
  codeNote: "The temporary environment value controls this process only. The local replacement avoids both a public lookup and a need for real credentials in the lesson.",
  followups: [
    "Does `GOPRIVATE` provide a Git password or token?",
    "When would `GONOSUMDB` differ from `GOPRIVATE`?",
    "What risk comes from an overly narrow private-module pattern?",
  ],
});

add({
  topicSlug: "go-mod-tidy",
  question: "Why can `go mod tidy` add dependencies used only by tests or other build targets?",
  title: "Why tidy sees more than the current build",
  direct: "Tidy considers imports from the main module's tests and acts as if nearly all build tags are enabled, including platform-specific files; the special `ignore` tag is excluded. This keeps module metadata sufficient for supported tests and targets instead of reflecting only the developer's current OS, architecture, and command.",
  quick: [
    "Test imports are part of tidy's dependency analysis.",
    "Platform-specific source is considered even on another current platform.",
    "Tidy acts as if all build tags are enabled except `ignore`.",
    "Dependencies of loaded packages and tests can become indirect requirements.",
    "A normal build may need fewer packages than tidy records for the module.",
  ],
  speaking: paragraphs(
    "- `go mod tidy` has a broader view than one ordinary build. A build selects files for the current `GOOS`, `GOARCH`, tags, and requested packages. Tidy must keep the module usable across its relevant source tree, so it includes packages imported by tests and acts as if almost all build tags are enabled. The special `ignore` build tag is the documented exception.",
    "- This prevents a common reproducibility problem. Suppose a developer on macOS tidies a project that also has `storage_windows.go`. If tidy considered only the current target, it could remove the module that provides the Windows implementation. Similarly, removing a module used only in `_test.go` would make a clean checkout unable to reproduce the test suite.",
    "- The example has three local dependencies: one imported by ordinary source, one imported only from a test, and one imported from a file guarded by a custom `lessonextra` build constraint. Tidy records all three, even though plain `go test` does not compile the custom-tagged file. Local replacements keep the demonstration offline.",
    "- This broad scan does not mean every imaginable file is included. Directories such as `testdata`, names beginning with a dot or underscore, and files using the `ignore` tag have special treatment unless imported in a relevant way. Dependencies' own tests are also not equivalent to main-module tests for every operation, so wording should follow the command's documented loaded set.",
    "- When tidy adds a surprising module, I locate its importer instead of deleting the line manually. `go mod why -m`, `go list -deps`, targeted tag builds, and source search can reveal the path. If the tagged or test code is obsolete, remove that source intentionally and tidy again; otherwise the requirement is real module metadata."
  ),
  overviewTitle: "Tidy protects the module's full supported surface",
  overview: "The active laptop shows only one slice of a module. Tidy expands that slice to relevant tests and build variants so committing its result does not silently break another target or the test suite.",
  deepTitle: "Compare package loading scopes",
  deep: paragraphs(
    "A command such as `go build ./cmd/app` loads only the requested package closure for the current target and tags. It can succeed while test-only or alternate-platform packages remain unresolved because those files were not selected.",
    "Tidy loads all packages in the main module plus tools and the recursively imported packages needed for that analysis. It includes test imports, including cases reached through the loaded graph, because test reproducibility is part of module consistency.",
    "Treating build tags as enabled makes mutually exclusive files visible to dependency analysis. Tidy is analyzing imports rather than trying to compile every tagged file together, so it can record providers for platform variants that cannot be built simultaneously.",
    "The `ignore` tag traditionally marks standalone generator programs or files intentionally excluded from package builds; tidy does not enable it. A tool dependency meant to be tracked should use the current supported tool mechanism or an explicit project pattern rather than depending on accidental ignored-file discovery.",
    "The result may contain direct requirements for modules imported only by a test or tagged source in the main module. “Direct” here means a package in this module imports a package from that module; it does not mean production execution always uses it."
  ),
  visualType: "diagram",
  visualTitle: "The wider tidy input set",
  visual: "```text\nOrdinary build now: current packages + current OS/architecture/tags\n                         ⊂\nTidy analysis: module packages + tests + tools + platform/tag variants\n               (`ignore` remains excluded)\n```",
  codeTitle: "Dependencies visible only to a test or build tag",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "replace example.test/base => ./deps/base",
      "replace example.test/check => ./deps/check",
      "replace example.test/extra => ./deps/extra"
    ),
    "message.go": go(
      "package app",
      "",
      "import \"example.test/base\"",
      "",
      "func Message() string { return base.Value() }"
    ),
    "message_test.go": go(
      "package app",
      "",
      "import (",
      "\t\"testing\"",
      "",
      "\t\"example.test/check\"",
      ")",
      "",
      "func TestMessage(t *testing.T) { check.Equal(t, Message(), \"base\") }"
    ),
    "extra.go": go(
      "//go:build lessonextra",
      "",
      "package app",
      "",
      "import \"example.test/extra\"",
      "",
      "var Extra = extra.Value()"
    ),
    "deps/base/go.mod": mod("module example.test/base", "", "go 1.23.0"),
    "deps/base/base.go": go("package base", "", "func Value() string { return \"base\" }"),
    "deps/check/go.mod": mod("module example.test/check", "", "go 1.23.0"),
    "deps/check/check.go": go(
      "package check",
      "",
      "type TestingT interface { Helper(); Fatalf(string, ...any) }",
      "",
      "func Equal(t TestingT, got, want string) {",
      "\tt.Helper()",
      "\tif got != want {",
      "\t\tt.Fatalf(\"got %q; want %q\", got, want)",
      "\t}",
      "}"
    ),
    "deps/extra/go.mod": mod("module example.test/extra", "", "go 1.23.0"),
    "deps/extra/extra.go": go("package extra", "", "func Value() string { return \"tagged\" }"),
  },
  commands: [
    "GOPROXY=off go mod tidy",
    "go test ./...",
    "go test -tags lessonextra ./...",
    "go list -m all",
  ],
  checks: [["go", "mod", "tidy"], ["go", "test", "./..."], ["go", "test", "-tags", "lessonextra", "./..."], ["go", "vet", "./..."], ["go", "vet", "-tags", "lessonextra", "./..."]],
  codeNote: "Tidy adds all three local modules. The two test commands then prove both the ordinary and custom-tag package selections compile.",
  followups: [
    "Why can tidy differ from `go build` on one laptop?",
    "Which special build tag does tidy not enable?",
    "How would you trace the source import behind a surprising requirement?",
  ],
});

add({
  topicSlug: "go-mod-tidy",
  question: "How can `go mod tidy -diff` keep module files clean in CI?",
  title: "Checking tidy state without rewriting files",
  direct: "`go mod tidy -diff` calculates the changes tidy would make, prints them as a unified diff, leaves `go.mod` and `go.sum` untouched, and exits non-zero when the diff is not empty. CI can run it as a consistency gate; developers then run normal tidy, review the changes, and commit them.",
  quick: [
    "`-diff` reports required `go.mod` and `go.sum` changes.",
    "It does not modify either file.",
    "A non-empty diff produces a non-zero exit status.",
    "Normal `go mod tidy` applies the repair locally.",
    "Review why each dependency changed before committing.",
  ],
  speaking: paragraphs(
    "- `go mod tidy -diff` is the non-mutating form of the tidy check. It performs the same reconciliation analysis, prints a unified diff for changes required in `go.mod` or `go.sum`, and exits with a non-zero status when that diff is not empty. This makes it suitable for CI because the job reports drift instead of silently editing its checkout.",
    "- For example, the project starts with a requirement on a local module that no source imports. The first `go mod tidy -diff` reports that the `require` line should be removed and intentionally fails. Running ordinary `go mod tidy` applies the change. A second diff command succeeds with no output, followed by tests and vet.",
    "- A failure should be diagnosed, not fixed by copying a command blindly. An added requirement may come from a new source import, a test, a tool, or tagged source. A removed requirement may be genuinely unused or may expose that expected source was excluded. Check the module-file diff beside the code diff and use `go mod why -m` for a module whose path is unclear.",
    "- Tidy has compatibility controls. `-go=version` changes the module's Go directive and associated graph behavior; `-compat=version` adjusts the compatibility version used for checksum and graph checks. Those are deliberate migration options, not routine flags to make a diff disappear. The default should normally agree with project policy.",
    "- I use the CI sequence as a cleanliness gate before tests, but not as a replacement for them. A tidy module can still call a dependency incorrectly. Conversely, tests may pass with local uncommitted module edits that CI would lack. Together, the diff check and behavioral tests prove both metadata sufficiency and program behavior from reviewed files."
  ),
  overviewTitle: "Detect drift, repair locally, verify again",
  overview: "The CI command is read-only and should fail visibly. The developer applies tidy, interprets the dependency change, then reruns the same check so the committed module files become the reproducible input.",
  deepTitle: "Use exit status as the consistency signal",
  deep: paragraphs(
    "The important property of `-diff` is that it separates diagnosis from mutation. CI does not need permission to rewrite source, and the patch it prints shows exactly which generated metadata differs from tidy's current model.",
    "An empty diff means module metadata is tidy for that toolchain and chosen compatibility settings. It does not guarantee another toolchain will produce identical metadata if the project's Go-version policy is ambiguous, so CI should use the supported version declared by the project.",
    "When a dependency is added, search for its package imports and inspect why the provider entered the graph. When one is removed, verify that no intended platform, generated source, or tool has fallen outside the module's tracked set.",
    "`-go` may update the go directive and alter pruning or requirement recording. `-compat` controls the prior-version compatibility check in versions where it applies. Treat either flag as a version-policy change with its own review.",
    "A useful pipeline runs the diff check, tests all packages, and performs vet or other project checks. Keeping these steps separate yields better diagnosis: metadata drift, behavioral failure, and static-analysis findings have different remedies."
  ),
  visualType: "flow_diagram",
  visualTitle: "A non-mutating module consistency gate",
  visual: "```mermaid\nflowchart LR\n  A[CI: go mod tidy -diff] --> B{Diff empty?}\n  B -->|Yes| C[Run tests and vet]\n  B -->|No| D[Fail with unified diff]\n  D --> E[Developer runs go mod tidy]\n  E --> F[Review and commit]\n  F --> A\n```",
  codeTitle: "Observe a failing diff, apply tidy, then pass",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "require example.test/unused v1.0.0",
      "",
      "replace example.test/unused => ./unused"
    ),
    "main.go": go("package main", "", "import \"fmt\"", "", "func main() { fmt.Println(\"tidy\") }"),
    "unused/go.mod": mod("module example.test/unused", "", "go 1.23.0"),
    "unused/unused.go": go("package unused", "", "func Value() string { return \"unused\" }"),
  },
  commands: [
    "go mod tidy -diff  # prints a diff and exits non-zero",
    "go mod tidy",
    "go mod tidy -diff  # now clean",
    "go test ./... && go vet ./...",
  ],
  checks: [
    { argv: ["go", "mod", "tidy", "-diff"], expectFailure: true },
    ["go", "mod", "tidy"],
    ["go", "mod", "tidy", "-diff"],
    ["go", "test", "./..."],
    ["go", "vet", "./..."],
  ],
  codeNote: "The first non-zero result is expected evidence of drift. After applying tidy, the identical read-only check becomes quiet and successful.",
  followups: [
    "Why is `-diff` preferable to mutating files in CI?",
    "What kinds of source can explain an unexpected added requirement?",
    "When would `-go` or `-compat` be a deliberate migration choice?",
  ],
});

add({
  topicSlug: "go-get-add-dependency",
  question: "How do you add, upgrade, downgrade, or remove a Go module dependency?",
  title: "Changing a dependency version deliberately",
  direct: "Use `go get module@version` to add or select a version, `@latest` or an update query to upgrade, an older explicit version to downgrade, and `@none` to remove the requirement. After each intentional change, inspect `go.mod`, check `go list -m all`, run `go mod tidy`, and test the affected behavior.",
  quick: [
    "Add or pin a request with `go get module@vX.Y.Z`.",
    "Use `@latest`, `@upgrade`, or `@patch` only when that policy is intended.",
    "Request an older version to downgrade.",
    "Use `@none` to remove a module from the graph.",
    "Review transitive changes, tidy metadata, and run tests.",
  ],
  speaking: paragraphs(
    "- Dependency changes are version queries applied to the current module graph. To add a known release, I use `go get example.com/lib@v1.4.2`. An explicit version makes the requested boundary visible. `@latest` chooses the latest allowed release according to module-version rules, while `@upgrade` and `@patch` express controlled update policies.",
    "- Downgrading uses the same command with an older version. Go may also downgrade other modules if their existing requirements are no longer compatible with the requested graph. Removing uses `go get module@none`; if source still imports a package from that module, a later build or tidy will report the missing dependency or add it again according to command mode.",
    "- The example uses a local replacement that can stand in for several v1 version labels, so the commands run without a network. It begins at v1.1.0, moves to v1.2.0, returns to v1.0.0, removes the requirement, and finally restores v1.1.0 before testing. `go list -m all` shows the selected build list after restoration.",
    "- The version written in one `require` directive remains a minimum. Another dependency can require a higher version of the same module, and minimal version selection will choose that higher one. `go mod why -m` explains why a module is needed; `go mod graph` or `go list -m all` helps diagnose version selection.",
    "- A safe change ends with behavior checks, not only a clean module diff. I read release notes for meaningful upgrades, run targeted and full tests, and consider compatibility when downgrading. Tidy removes metadata that is no longer needed, but it cannot prove the new dependency version behaves correctly for the application."
  ),
  overviewTitle: "One command, four explicit intentions",
  overview: "Adding, moving up, moving down, and removing all modify the graph, but they carry different compatibility risks. Explicit queries plus graph inspection make the intended transition reviewable.",
  deepTitle: "Version queries constrain a shared graph",
  deep: paragraphs(
    "Semantic import versioning separates incompatible major versions by module path. Within one path, a version query selects a candidate and the go command reconciles that request with requirements from every other reachable module.",
    "`latest` does not simply choose the lexically largest tag: release versions are preferred over prereleases, retracted and excluded versions are normally avoided, and module-path major-version rules must match. A commit or branch query is converted to a canonical version, often a pseudo-version.",
    "A downgrade may have a wider blast radius because dependencies requiring versions above the request must also change or leave the graph. Always inspect the complete diff rather than assuming only the named line moved.",
    "Removal is a graph operation, not source deletion. If no relevant package imports the module, tidy can keep it gone. If an import remains, the project is inconsistent until the import changes or the requirement is restored.",
    "Local replacement validates the mechanics but does not model remote release contents. In production, an older tag may lack an API even when the local replacement compiles, so tests must run against the actual selected module version through the organisation's trusted dependency path."
  ),
  visualType: "flow_diagram",
  visualTitle: "Dependency lifecycle commands",
  visual: "```mermaid\nflowchart LR\n  A[No requirement] -->|@v1.1.0| B[Added]\n  B -->|@v1.2.0| C[Upgraded]\n  C -->|@v1.0.0| D[Downgraded]\n  D -->|@none| E[Removed]\n  B --> F[tidy + test + review]\n  C --> F\n  D --> F\n  E --> F\n```",
  codeTitle: "Exercise all four transitions without the network",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "require example.test/label v1.1.0",
      "",
      "replace example.test/label => ./label"
    ),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/label\"",
      ")",
      "",
      "func main() { fmt.Println(label.Value()) }"
    ),
    "label/go.mod": mod("module example.test/label", "", "go 1.23.0"),
    "label/label.go": go("package label", "", "func Value() string { return \"local module\" }"),
  },
  commands: [
    "GOPROXY=off go get example.test/label@v1.2.0",
    "GOPROXY=off go get example.test/label@v1.0.0",
    "GOPROXY=off go get example.test/label@none",
    "GOPROXY=off go get example.test/label@v1.1.0",
    "go mod tidy -diff && go test ./...",
  ],
  checks: [
    ["go", "get", "example.test/label@v1.2.0"],
    ["go", "get", "example.test/label@v1.0.0"],
    ["go", "get", "example.test/label@none"],
    ["go", "get", "example.test/label@v1.1.0"],
    ["go", "mod", "tidy"],
    ["go", "test", "./..."],
    ["go", "vet", "./..."],
  ],
  codeNote: "A path-wide local replacement accepts the requested v1 labels for this command exercise. Real upgrades must test the actual released source.",
  followups: [
    "What does `@none` change if source still imports the package?",
    "Why might a downgrade change modules you did not name?",
    "Which commands show why a module is present and which version was selected?",
  ],
});

add({
  topicSlug: "go-get-add-dependency",
  question: "What is the difference between `go get`, `go mod download`, and `go install`?",
  title: "Choosing the right dependency or installation command",
  direct: "`go get` changes dependencies of the current module. `go mod download` explicitly downloads module source and metadata to the cache, although build commands normally do that automatically. `go install` compiles and installs packages; the `package@version` form installs a command independently and does not edit or use the current module's dependency graph.",
  quick: [
    "`go get` edits the current module's dependency requirements.",
    "`go mod download` fills or inspects the module cache.",
    "Build and test commands already download dependencies they need.",
    "`go install ./cmd/tool` installs a command from the current module.",
    "`go install path@version` installs a released command independently of current `go.mod`.",
  ],
  speaking: paragraphs(
    "- These commands sound similar because all may cause compilation or module-cache activity, but their primary outputs differ. `go get` is a dependency-management command for the active module. It resolves version queries and changes `go.mod`, and downloads may also change `go.sum`. Use it when the application's dependency graph is the thing being edited.",
    "- `go mod download` downloads named modules, or modules needed to preload the graph, into the module cache. It can emit JSON containing paths, versions, checksums, and cache files. Ordinary `go build`, `go test`, and related commands already download what they need, so application developers rarely need a separate download step except for cache preparation, diagnostics, or proxy tooling.",
    "- `go install` compiles and installs command packages. Without a version suffix, it operates in the current module context, as `go install ./cmd/greet` does in the example. With a suffix such as `go install example.com/tools/cmd/check@v1.4.0`, it builds that released command independently: the current directory's `go.mod` is ignored and is not edited.",
    "- The executable destination is controlled by `GOBIN`, or otherwise derived from the Go environment. Installing a library package does not produce a useful executable; the common target is a `main` package. A versioned install also has restrictions designed to make the chosen module version self-contained, including ignoring vendor directories and main-module replacements.",
    "- I choose by intent: change an application dependency with `go get`, prepare or inspect cached module data with `go mod download`, and install a command with `go install`. After a current-module install, I still test the module. For a team tool, I record the exact install version in documentation or managed tooling so every developer runs the intended binary."
  ),
  overviewTitle: "Graph, cache, or binary",
  overview: "Ask which durable thing should change. A dependency requirement belongs to the module graph, downloaded archives belong to the cache, and an installed command belongs in a binary directory. The command names then become much easier to remember.",
  deepTitle: "Follow each command's context",
  deep: paragraphs(
    "`go get` starts from the active main module or workspace. Its version requests can affect direct and indirect requirements, so it belongs in a reviewed source change and should be followed by tests.",
    "`go mod download` works at the module-artifact layer. With no arguments it downloads modules needed by the main module; with explicit module queries it can fetch particular artifacts. The `-json` form is useful to tools, and normal build commands usually make manual prefetching unnecessary.",
    "Unversioned `go install` uses normal package resolution in the current context. It can therefore build a command that imports code from the main module and selected dependencies. In the example, setting `GOBIN` keeps the installed binary in a visible local destination.",
    "Versioned `go install` is deliberately detached. Every argument must refer to command packages at the same version, and module directives such as replace are not allowed to control that installation. This prevents an unrelated project checkout from silently changing the tool source.",
    "None of the three is a substitute for dependency policy. Proxies, private-module authentication, checksum verification, vulnerability checks, and upgrade review remain separate concerns. Choosing the correct command simply ensures the intended graph, cache, or binary is what changes."
  ),
  visualType: "comparison_table",
  visualTitle: "Choose by the artifact you need",
  visual: "| Command | Main purpose | Edits current `go.mod`? | Typical result |\n|---|---|---:|---|\n| `go get path@query` | Change dependency graph | Yes | New selected requirements |\n| `go mod download` | Fill or inspect module cache | No | Cached module files |\n| `go install ./cmd/x` | Install current-module command | No | Executable |\n| `go install path@version` | Install released command independently | No | Versioned executable |",
  codeTitle: "Install a command from the current module",
  files: {
    "go.mod": mod("module example.test/tools", "", "go 1.23.0"),
    "cmd/greet/main.go": go(
      "package main",
      "",
      "import \"fmt\"",
      "",
      "func main() { fmt.Println(\"hello from greet\") }"
    ),
    "cmd/greet/main_test.go": go(
      "package main",
      "",
      "import \"testing\"",
      "",
      "func TestCommandBuilds(t *testing.T) {}"
    ),
  },
  commands: [
    "go test ./...",
    "GOBIN=$(pwd)/bin go install ./cmd/greet",
    "./bin/greet",
    "# Released tools use: go install example.com/tool/cmd/name@v1.2.3",
  ],
  checks: [["go", "test", "./..."], ["go", "vet", "./..."], ["go", "install", "./cmd/greet"]],
  checkEnv: { GOBIN: "$TMP/bin" },
  codeNote: "The executable is built from the current module without editing `go.mod`. The versioned form shown in the comment is for independently released commands.",
  followups: [
    "Do ordinary build commands require a separate `go mod download` first?",
    "Why does `go install path@version` ignore the current module file?",
    "Where does `go install` place the resulting executable?",
  ],
});

add({
  topicSlug: "exported-vs-unexported",
  question: "How do exported struct fields and methods affect a Go package API?",
  title: "Designing a stable API with fields and methods",
  direct: "Exported fields let callers read, assign, construct, encode, and reflect on struct state directly. Unexported fields let the package preserve invariants through constructors and methods. Exported methods define behavior available to callers, and their receiver choice also determines the method sets used for interface satisfaction.",
  quick: [
    "Exported fields are directly accessible to importing packages.",
    "Unexported fields can be controlled through constructors and methods.",
    "Common encoders such as `encoding/json` operate on exported fields.",
    "Exported methods add caller-visible behavior without exposing representation.",
    "Value and pointer receivers produce different method sets.",
  ],
  speaking: paragraphs(
    "- Exporting a struct type does not automatically expose all of its representation. Each field has its own export status. If a field is uppercase, callers can read it, assign it when addressable, and include it in composite literals. Reflection-based packages such as `encoding/json` normally see exported fields, subject to tags and their own rules.",
    "- An unexported field keeps direct mutation inside the package. A constructor can validate input and return a value that satisfies an invariant, while exported methods expose supported behavior. In the example, `account.Account` stores `balance` privately. `New` rejects a negative opening balance, `Deposit` protects against invalid changes, and `Balance` exposes a read operation without giving callers the field itself.",
    "- Methods also participate in interfaces. A method declared on a value receiver belongs to the method set of both the value and its pointer; a method declared only on a pointer receiver belongs to the pointer's method set. Receiver choice should primarily follow mutation, copying, and consistency needs, but interface assignment will reveal the resulting boundary at compile time.",
    "- Exposed fields are convenient for plain data transfer values, configuration, and encoding, where direct construction is part of the design. Hidden fields are useful when arbitrary states would be invalid or when the representation may change. Hiding everything behind getters without an invariant can add ceremony without meaningful protection.",
    "- I decide field-by-field. Once consumers compile against an exported field's name and type, changing it can be a breaking API change. Methods provide more room to preserve behavior while changing storage, but they also become compatibility commitments. The goal is a small coherent contract, not maximum secrecy or maximum exposure."
  ),
  overviewTitle: "Representation and behavior are separate choices",
  overview: "A package can export a useful type while hiding the state that requires protection. Constructors establish valid values, methods perform supported transitions, and deliberately exported fields remain appropriate for honest data-shaped APIs.",
  deepTitle: "Trace what an outside caller can do",
  deep: paragraphs(
    "With an exported field, outside code can form a keyed struct literal, inspect the value, and often mutate it directly. This is simple and idiomatic when every representable combination is valid. Tags can guide encoders, but a tag does not export a lowercase field.",
    "With unexported fields, an outside package cannot name those keys in a literal. It can still hold, copy, compare, or pass the exported type according to the type's other properties. Constructors are ordinary functions rather than a language requirement, so the package must decide whether the zero value is useful or construction is mandatory.",
    "Pointer-receiver methods can mutate the original value and avoid copying large values. Value receivers work on a copy and appear in both value and pointer method sets. Mixing receiver styles carelessly can make interface use surprising, especially when only `*T` satisfies an interface.",
    "JSON demonstrates the visibility boundary clearly: exported fields can be marshaled, while unexported state is omitted. A package that needs a custom wire representation can implement marshaling behavior rather than exporting internal storage solely for an encoder.",
    "API evolution favors behavior-oriented boundaries when invariants matter. A method can preserve its signature while storage changes from an integer to another representation. A public field exposes both meaning and representation, so choose it when that simplicity is intended to remain part of the contract."
  ),
  visualType: "flow_diagram",
  visualTitle: "Keeping invalid state outside the API",
  visual: "```mermaid\nflowchart LR\n  I[Caller input] --> N[account.New validates]\n  N -->|valid| A[Account with hidden balance]\n  N -->|invalid| E[error]\n  A --> D[Deposit validates transition]\n  A --> R[Balance reads state]\n```",
  codeTitle: "An exported type with controlled state",
  files: {
    "go.mod": mod("module example.test/bank", "", "go 1.23.0"),
    "account/account.go": go(
      "package account",
      "",
      "import \"fmt\"",
      "",
      "type Account struct { balance int }",
      "",
      "func New(opening int) (Account, error) {",
      "\tif opening < 0 {",
      "\t\treturn Account{}, fmt.Errorf(\"negative opening balance: %d\", opening)",
      "\t}",
      "\treturn Account{balance: opening}, nil",
      "}",
      "",
      "func (a *Account) Deposit(amount int) error {",
      "\tif amount <= 0 {",
      "\t\treturn fmt.Errorf(\"deposit must be positive\")",
      "\t}",
      "\ta.balance += amount",
      "\treturn nil",
      "}",
      "",
      "func (a Account) Balance() int { return a.balance }"
    ),
    "account/account_test.go": go(
      "package account_test",
      "",
      "import (",
      "\t\"testing\"",
      "",
      "\t\"example.test/bank/account\"",
      ")",
      "",
      "func TestDeposit(t *testing.T) {",
      "\ta, err := account.New(100)",
      "\tif err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\tif err := a.Deposit(25); err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\tif a.Balance() != 125 {",
      "\t\tt.Fatalf(\"balance = %d\", a.Balance())",
      "\t}",
      "}"
    ),
  },
  commands: ["go test ./..."],
  checks: [["go", "test", "./..."], ["go", "vet", "./..."]],
  codeNote: "Callers can name `Account` and its methods but cannot place an arbitrary value directly into `balance`.",
  followups: [
    "Why will `encoding/json` omit an unexported field?",
    "When is an exported data field simpler than accessor methods?",
    "Which values satisfy an interface containing a pointer-receiver method?",
  ],
});

add({
  topicSlug: "exported-vs-unexported",
  question: "What does an `internal` package restrict that unexported names do not?",
  title: "Identifier privacy versus package import privacy",
  direct: "Lowercase names restrict individual declarations to their package, but they do not stop anyone from importing that package and using its exported names. An `internal` path restricts the whole package: only code within the parent tree of that `internal` directory may import it, even when its declarations are exported.",
  quick: [
    "Lowercase controls access to one identifier.",
    "`internal` controls who may import an entire package.",
    "Exported names inside an internal package remain usable by allowed importers.",
    "Allowed importers must live beneath the parent of the `internal` directory.",
    "Use both rules when a shared implementation needs a bounded audience.",
  ],
  speaking: paragraphs(
    "- Unexported identifiers and `internal` packages protect different boundaries. A lowercase function such as `parse` can be used only inside its declaring package. The package itself may still be imported by anyone, and any uppercase names it exposes remain available to those importers.",
    "- An `internal` directory restricts the import path for the whole package. If the path is `example.test/store/internal/token`, the parent is `example.test/store`. Packages within that tree may import `token`; code at `example.test/other` or in another module may not. The go command reports an import-not-allowed error before ordinary API use matters.",
    "- Exported names inside an internal package are still useful. In the example, two packages owned by the store module could call `token.New` even though `New` begins with uppercase. Capitalisation makes it visible across allowed package boundaries, while the internal path prevents unsupported outside imports. Lowercase helpers inside `token` remain private to `token` itself.",
    "- This is stronger than documentation that says “please do not import.” It lets a large repository share code among commands and sibling packages without promising that path to external consumers. It does not provide runtime security, access control, or protection from copied source; it is a compile-time import rule.",
    "- I use unexported names for implementation details within one package and `internal` when several owned packages need an API that should not become public. Making one giant internal package can still create coupling, so it should expose a focused contract. If outside users genuinely need the behavior, it belongs at a supported non-internal path instead."
  ),
  overviewTitle: "Two nested visibility gates",
  overview: "The import-path gate is checked first: may this caller import the package? For an allowed caller, normal uppercase and lowercase identifier rules then decide which declarations it can name.",
  deepTitle: "Find the parent of the internal segment",
  deep: paragraphs(
    "For a path containing `internal`, locate the directory immediately before that segment. The importing code's path must be within the tree rooted there. This rule can appear below a module root and may be used more than once at different ownership levels.",
    "Inside the permitted tree, the internal package behaves like any other package. It has a package name, exported declarations, tests, and dependencies. Capitalised names cross from the internal package into allowed importers; lowercase names do not.",
    "Outside the permitted tree, aliasing the import or knowing an exported symbol does not help. The restriction applies when resolving the import path. This is why `internal` communicates a stronger compatibility boundary than a README warning.",
    "The rule does not mean secrets are secure. Built binaries, source access, logs, and runtime APIs have separate security concerns. Internal packages are about source-level architecture and supported imports, not confidentiality.",
    "Combining the mechanisms gives useful layers: private helpers stay lowercase, a small exported API serves owned packages through an internal path, and a separate public package exposes only the stable behavior intended for third parties."
  ),
  visualType: "flow_diagram",
  visualTitle: "Two checks before a name is usable",
  visual: "```mermaid\nflowchart LR\n  C[Caller package] --> I{Inside internal parent tree?}\n  I -->|No| X[Import rejected]\n  I -->|Yes| P[Package imported]\n  P --> E{Identifier exported?}\n  E -->|Yes| U[Caller may use it]\n  E -->|No| H[Only declaring package may use it]\n```",
  codeTitle: "An exported API inside an enforced internal path",
  files: {
    "go.mod": mod("module example.test/store", "", "go 1.23.0"),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/store/internal/token\"",
      ")",
      "",
      "func main() { fmt.Println(token.New(7)) }"
    ),
    "internal/token/token.go": go(
      "package token",
      "",
      "import \"fmt\"",
      "",
      "func prefix() string { return \"order\" }",
      "",
      "func New(id int) string { return fmt.Sprintf(\"%s-%d\", prefix(), id) }"
    ),
    "internal/token/token_test.go": go(
      "package token",
      "",
      "import \"testing\"",
      "",
      "func TestNew(t *testing.T) {",
      "\tif New(7) != \"order-7\" {",
      "\t\tt.Fatal(\"unexpected token\")",
      "\t}",
      "}"
    ),
  },
  commands: ["go test ./...", "go run ."],
  checks: [["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "The root command is beneath `example.test/store`, so it may import `internal/token` and use exported `New`; only package `token` may use `prefix`.",
  followups: [
    "Can an internal package export a function?",
    "Does `internal` protect runtime secrets?",
    "Which callers may import `a/b/internal/c`?",
  ],
});

add({
  topicSlug: "packages-and-imports",
  question: "Can one directory contain more than one Go package?",
  title: "The one-package-per-directory rule and its test exception",
  direct: "Ordinary non-test Go files in one directory must belong to one package. Test files may use that same package or one external test package named with the `_test` suffix, such as `calc_test`. Put a different production package in another directory; do not mix unrelated package declarations beside each other.",
  quick: [
    "Non-test Go files in one directory declare one package.",
    "Internal tests can use the same package name.",
    "External tests can use one `<package>_test` package in `_test.go` files.",
    "A different production package belongs in another directory.",
    "A `main` package is still subject to the same directory rule.",
  ],
  speaking: paragraphs(
    "- In normal source, one directory represents one Go package. All eligible non-test `.go` files in that directory must use the same package clause. The compiler combines those files, so splitting a type and its methods across files is fine, but declaring `package calc` in one production file and `package report` in its neighbour produces a package-conflict error.",
    "- Tests have one deliberate exception. Files ending in `_test.go` may declare the ordinary package, such as `package calc`, which lets them inspect unexported implementation details. They may instead declare an external test package named `calc_test`; that package imports `calc` and can use only its exported API. A directory may contain both internal and external test files around the one production package.",
    "- External tests are useful when the claim concerns a caller's experience. In the example, `add.go` is package `calc`, an internal test checks the private `normalise` helper, and an external test imports `example.test/calc` to verify `Add`. The external package cannot call `normalise`, which keeps the public boundary honest.",
    "- `package main` is not an escape from the rule. A command directory uses `package main` and provides a main function; reusable code should usually move to another directory with an importable package. That prevents application wiring and domain logic from becoming one oversized compilation unit.",
    "- Generated files, platform-specific files, and files selected by build tags still need compatible package declarations whenever they can be built together. If two distinct APIs deserve distinct names, I give them distinct directories. The directory boundary then supplies a stable import path and makes dependencies explicit instead of relying on file placement tricks."
  ),
  overviewTitle: "One production namespace, two testing viewpoints",
  overview: "The directory creates one production namespace. Internal tests join it; external tests stand outside it and exercise the exported contract. The exception exists for verification, not for mixing two production packages.",
  deepTitle: "Why compilation follows the directory",
  deep: paragraphs(
    "Go does not compile individual files as independently importable units. It selects the files for a package directory, parses their common package clause, and compiles their declarations together. Functions in one file can therefore use unexported names from another file without an import.",
    "File selection can vary by target. A `_windows.go` file and a `_unix.go` file may provide different implementations, but any target combination that selects files together must still agree on the package. Build constraints are implementation selection, not a way to host unrelated packages in one folder.",
    "During `go test`, the tool builds a variant containing the package's own test files and may also build the external `_test` package. The suffix distinguishes that special testing relationship. An arbitrary second name such as `package calcclient` is not accepted as the external test package for the directory.",
    "Commands deserve their own directories because each `main` package produces one executable. A module can contain `cmd/api` and `cmd/worker`, both named `main`, since their import paths and directories are distinct.",
    "When a package becomes too broad, divide behavior along a dependency boundary and move one part to a subdirectory. Avoid packages whose only purpose is mirroring every source file; the useful unit is a cohesive API, not the number of files."
  ),
  visualType: "comparison_table",
  visualTitle: "Which package declarations can share a directory?",
  visual: "| File kind | Allowed declaration beside `package calc` | Visibility |\n|---|---|---|\n| Ordinary `.go` | `package calc` | Full package namespace |\n| Internal `_test.go` | `package calc` | Includes unexported names |\n| External `_test.go` | `package calc_test` | Exported API through import |\n| Another production package | Not allowed | Move to another directory |",
  codeTitle: "Internal and external tests around one package",
  files: {
    "go.mod": mod("module example.test/calc", "", "go 1.23.0"),
    "add.go": go(
      "package calc",
      "",
      "func normalise(value int) int {",
      "\tif value < 0 {",
      "\t\treturn 0",
      "\t}",
      "\treturn value",
      "}",
      "",
      "func Add(a, b int) int { return normalise(a) + normalise(b) }"
    ),
    "add_internal_test.go": go(
      "package calc",
      "",
      "import \"testing\"",
      "",
      "func TestNormalise(t *testing.T) {",
      "\tif normalise(-2) != 0 {",
      "\t\tt.Fatal(\"negative input was not normalised\")",
      "\t}",
      "}"
    ),
    "add_external_test.go": go(
      "package calc_test",
      "",
      "import (",
      "\t\"testing\"",
      "",
      "\tcalc \"example.test/calc\"",
      ")",
      "",
      "func TestAdd(t *testing.T) {",
      "\tif got := calc.Add(-2, 5); got != 5 {",
      "\t\tt.Fatalf(\"Add = %d; want 5\", got)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test ./...", "go list -f '{{.Name}}'"],
  checks: [["go", "test", "./..."], ["go", "vet", "./..."], ["go", "list", "-f", "{{.Name}}"]],
  codeNote: "The production directory remains package `calc`; the special external test package models an importing user.",
  followups: [
    "Why can an external test not access `normalise`?",
    "Can two unrelated production packages share a directory using build tags?",
    "Where should two executable `main` packages live?",
  ],
});

add({
  topicSlug: "packages-and-imports",
  question: "How should `cmd`, `internal`, and reusable packages be organised in a Go module?",
  title: "Organising commands, internal code, and reusable packages",
  direct: "Keep each executable in its own command directory, commonly under `cmd/<name>`. Put code that must not be imported outside a parent tree under an `internal` directory, which the Go tool enforces. Reusable packages can live in any clearly named directory; `pkg` is an optional repository convention and has no special compiler meaning.",
  quick: [
    "Each executable needs a directory containing `package main` and `func main`.",
    "`cmd/<name>` is a common convention for multiple commands.",
    "The Go tool enforces import restrictions for `internal` directories.",
    "A `pkg` directory is only a convention, not a language rule.",
    "Prefer package names that describe cohesive behavior, not generic layers.",
  ],
  speaking: paragraphs(
    "- A Go module can hold several commands and many importable packages. Each executable is a `main` package in its own directory. Placing commands under `cmd/api`, `cmd/worker`, and similar names is a widely understood convention, but the toolchain only cares that each directory is a valid `main` package with a main function.",
    "- `internal` is different because it has enforced meaning. Code at `example.test/shop/internal/config` may be imported by packages rooted at `example.test/shop`, but code outside that parent tree cannot import it. This lets a project share implementation across its own commands without promising that package as a public dependency.",
    "- Reusable packages do not need a `pkg` wrapper. A directory such as `money` or `order` is already importable when its path and exported API are appropriate. Some repositories use `pkg` to signal intended reuse, but Go gives the name no visibility rule. The signal can help a team, yet it should not create an unnecessary `pkg/everything` layer.",
    "- In the example, `cmd/shop` performs wiring, `internal/config` owns application-only defaults, and `money` supplies a small reusable calculation. The main package depends on both; the reusable package does not depend on the command. This keeps dependency direction toward focused capabilities instead of back into executable setup.",
    "- Layout should follow ownership and API boundaries rather than a universal folder template. I keep main functions thin, use `internal` when outside imports would be unsupported, and promote a package to a stable reusable API only when callers genuinely need it. A simple module with one command may need none of these extra folders."
  ),
  overviewTitle: "Convention, enforcement, and API intent",
  overview: "`cmd` communicates where executables live, `internal` creates a compiler-enforced import boundary, and ordinary named package directories carry reusable APIs. Only `internal` changes what an outside importer is allowed to do.",
  deepTitle: "Let dependencies point away from command wiring",
  deep: paragraphs(
    "The main package owns process concerns: reading flags or environment, constructing dependencies, starting work, and choosing an exit status. Moving domain behavior into importable packages makes it testable without launching the process and lets multiple commands share it.",
    "An internal-directory restriction is based on the path segment named `internal`. Importers must be inside the tree rooted at the parent of that directory. This works at any depth, so `a/b/internal/c` is available only to code beneath `a/b`.",
    "The restriction is about import paths, not exported identifiers. An internal package can contain capitalised names for use by allowed sibling packages, yet outside modules still cannot import it. Conversely, an ordinary package outside `internal` can hide details with lowercase names while exposing a deliberate API.",
    "The `pkg` convention has no such enforcement. It appears in some large repositories, but a top-level descriptive package is equally valid and often shorter to import. Consistency within the project is more useful than copying a layout designed for a different system.",
    "Watch for dependency cycles. A command may import domain and adapter packages; those packages should not import the command. Small interfaces at the consumer boundary and explicit construction in main keep the graph acyclic and make package ownership easier to understand."
  ),
  visualType: "diagram",
  visualTitle: "A small application module",
  visual: "```text\nexample.test/shop\n├── cmd/shop/main.go       executable wiring\n├── internal/config/       enforced application-only package\n└── money/                 ordinary reusable package\n\ncmd/shop ──imports──> internal/config\n         └─imports──> money\n```",
  codeTitle: "A thin command using internal and reusable packages",
  files: {
    "go.mod": mod("module example.test/shop", "", "go 1.23.0"),
    "cmd/shop/main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/shop/internal/config\"",
      "\t\"example.test/shop/money\"",
      ")",
      "",
      "func main() {",
      "\tfmt.Printf(\"%s total: %d\\n\", config.ServiceName(), money.Total(100, 20))",
      "}"
    ),
    "internal/config/config.go": go(
      "package config",
      "",
      "func ServiceName() string { return \"shop\" }"
    ),
    "money/money.go": go(
      "package money",
      "",
      "func Total(subtotal, tax int) int { return subtotal + tax }"
    ),
    "money/money_test.go": go(
      "package money",
      "",
      "import \"testing\"",
      "",
      "func TestTotal(t *testing.T) {",
      "\tif Total(100, 20) != 120 {",
      "\t\tt.Fatal(\"unexpected total\")",
      "\t}",
      "}"
    ),
  },
  commands: ["go test ./...", "go run ./cmd/shop"],
  checks: [["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "./cmd/shop"]],
  codeNote: "`cmd/shop` is inside the module's parent tree, so it may import `internal/config`; an outside module would be rejected.",
  followups: [
    "What part of the `internal` rule is enforced by the Go tool?",
    "Does placing a package under `pkg` make it public?",
    "Why should a main package usually contain little domain logic?",
  ],
});

add({
  topicSlug: "go-module-and-go-mod",
  question: "What do the main directives in a `go.mod` file mean?",
  title: "Reading the main go.mod directives",
  direct: "`module` names the module, `go` sets its minimum Go version, and `require` records dependency constraints. `replace` changes where a required module is resolved for the main module, `exclude` disallows a particular version, `toolchain` suggests a toolchain, and `retract` is published by a module author to warn against released versions.",
  quick: [
    "`module` declares the module's canonical path.",
    "`go` declares the minimum Go version; `toolchain` can suggest a newer toolchain.",
    "`require` contributes minimum dependency versions to the graph.",
    "`replace` redirects a module version or path in the main module/workspace.",
    "`exclude` prevents one version from being selected; `retract` warns users about published versions.",
  ],
  speaking: paragraphs(
    "- A `go.mod` file is a set of directives, and each directive answers a different build question. `module` gives the current module its canonical path. `go` declares the minimum Go version and controls relevant language and module behavior. An optional `toolchain` line suggests which Go toolchain should be used when the current one is older.",
    "- `require` connects the module graph. A line such as `require example.test/clock v1.2.0` says this module needs at least that version; it is not a promise that every build uses exactly that line's version. Minimal version selection considers all reachable requirements and may choose a higher version.",
    "- `replace` changes the source used for a module path or a particular version. In the example it redirects `example.test/clock` to a sibling directory, which is useful while developing two modules together. The target directory needs its own `go.mod`. A replacement by itself does not add a dependency: some `require` in the graph must still select the replaced module.",
    "- `exclude` is a main-module rule that prevents one known-bad version from entering the build list. `retract` works from the publisher's side: an author places it in a newer module version to signal that earlier versions should not be chosen by ordinary version queries. Existing users are warned rather than silently rewritten.",
    "- These directives do not all propagate. A dependency's `replace` and `exclude` directives are ignored by consumers; the main module or active workspace controls those overrides. That boundary keeps a build governed by the project being built. I use overrides deliberately and remove temporary local replacements before publishing unless the repository workflow explicitly depends on them."
  ),
  overviewTitle: "Each directive controls one layer",
  overview: "Identity (`module`), compatibility (`go` and `toolchain`), graph constraints (`require`), local build overrides (`replace` and `exclude`), and publisher guidance (`retract`) should not be treated as interchangeable version pins.",
  deepTitle: "Separate dependency constraints from build overrides",
  deep: paragraphs(
    "The module graph is formed primarily from `require` directives. Each required version is a lower bound. Minimal version selection walks the reachable graph and keeps the highest required version for each module path, producing one build list for the command.",
    "A replacement changes the content associated with a selected module path or version. A path-only replacement applies to every version of that module, while a version-specific replacement applies only to its left-hand version. When the right side is a local directory, it has no version and must contain a compatible module declaration.",
    "An exclusion rejects one specific module version in the main module. It is a narrow escape hatch, not a general security policy. A retraction is different because it travels in the module author's published metadata and explains that a version or range should be avoided; a user can still request a retracted version explicitly.",
    "The `go` and `toolchain` lines describe tool compatibility, not application dependencies. The `go` line is the minimum required version. The toolchain line, when present, is a suggested toolchain and is meaningful only when it is newer than the `go` line.",
    "Review the directives by role. A surprising `replace` can make local tests use code that consumers never see, while a casual `go` version bump can stop older builders. Commands such as `go mod edit`, `go get`, and `go mod tidy` can make controlled edits, but the resulting file remains normal source that should be reviewed."
  ),
  visualType: "comparison_table",
  visualTitle: "Directive, owner, and effect",
  visual: "| Directive | Main purpose | Important boundary |\n|---|---|---|\n| `module` | Name this module | Prefixes package import paths |\n| `go` / `toolchain` | State tool compatibility | Not dependency versions |\n| `require` | Add a graph constraint | Version is a minimum |\n| `replace` | Redirect selected content | Effective only from a main module/workspace |\n| `exclude` | Reject one version | Main-module rule |\n| `retract` | Warn about published versions | Authored in a released module |",
  codeTitle: "Require a module and replace it with local source",
  files: {
    "go.mod": mod(
      "module example.test/app",
      "",
      "go 1.23.0",
      "",
      "require example.test/clock v1.2.0",
      "",
      "replace example.test/clock => ./clock"
    ),
    "main.go": go(
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "",
      "\t\"example.test/clock\"",
      ")",
      "",
      "func main() {",
      "\tfmt.Println(clock.Zone())",
      "}"
    ),
    "clock/go.mod": mod("module example.test/clock", "", "go 1.23.0"),
    "clock/clock.go": go("package clock", "", "func Zone() string { return \"UTC\" }"),
  },
  commands: ["go list -m all", "go test ./...", "go run ."],
  checks: [["go", "list", "-m", "all"], ["go", "test", "./..."], ["go", "vet", "./..."], ["go", "run", "."]],
  codeNote: "The `require` places `example.test/clock` in the graph; `replace` makes this main module read its code from `./clock` without contacting a proxy.",
  followups: [
    "Why does a `replace` directive still need a reachable requirement?",
    "Do replacements declared by a dependency affect its consumers?",
    "How is `retract` different from `exclude`?",
  ],
});

add({
  topicSlug: "go-module-and-go-mod",
  question: "How do you initialise and check a new Go module?",
  title: "Initialising a module and checking a clean checkout",
  direct: "Create the project directory, choose its canonical module path, and run `go mod init <path>`. Add source and tests, run `go mod tidy`, then use `go test ./...` and `go vet ./...` to check the package tree. Review and commit `go.mod` and, when downloaded dependencies produce it, `go.sum`.",
  quick: [
    "Choose the module path before running `go mod init <path>`.",
    "Run the command at the intended module root.",
    "Use `go mod tidy` to align dependency metadata with source and tests.",
    "Run `go test ./...` and `go vet ./...` from the module root.",
    "Commit reviewed `go.mod` and applicable `go.sum` changes.",
  ],
  speaking: paragraphs(
    "- I initialise a module at the directory that should own its package tree. The command is `go mod init example.com/acme/report`, where the argument is the canonical path future packages will import. It creates `go.mod`; it does not create application files, publish a repository, or download dependencies by itself.",
    "- Next I add the smallest source and test that prove the package builds. If code imports another module, normal build commands may add a requirement, and `go mod tidy` makes the module metadata match all relevant packages and tests. For a standard-library-only project, tidy may leave only the module and Go lines and there may be no `go.sum` at all.",
    "- The clean-checkout check is important because a developer's module cache can hide assumptions. From the module root I run `go test ./...` to compile and test every listed package, followed by `go vet ./...` for standard static checks. `go list -m` confirms which main module the command found. CI should perform the equivalent steps from checked-in files.",
    "- For example, the starting directory has `main.go` and `main_test.go` but no module file. `go mod init` creates the boundary, `go mod tidy -diff` confirms that no further metadata edit is needed, and the tests verify the command behavior. A real project with dependencies would also review the new requirements and checksums rather than accepting a large unexplained diff.",
    "- I avoid running `go mod init` inside an existing module unless I intentionally want a nested, independently versioned module. The nearest `go.mod` defines command context, so accidental nesting can make parent commands skip that subtree. The result should be one deliberate module boundary with reproducible tests, not merely a generated file."
  ),
  overviewTitle: "Create, reconcile, then prove",
  overview: "Initialisation establishes identity. Tidy reconciles metadata with source. Tests, vet, and a clean environment then prove the checked-in module is sufficient to build rather than relying on an editor or an accidental parent module.",
  deepTitle: "A clean checkout tests the real contract",
  deep: paragraphs(
    "`go mod init` refuses to overwrite an existing `go.mod`. Its optional path inference has limited cases, so supplying the intended path explicitly makes the public or private identity reviewable from the first commit.",
    "After source exists, `go mod tidy` loads relevant packages and tests, adds missing requirements, removes requirements that no longer provide needed packages, and reconciles `go.sum`. `go mod tidy -diff` is useful in CI because it prints the required patch and exits unsuccessfully instead of modifying files.",
    "`go test ./...` starts at the active module and expands packages beneath it, excluding nested modules. It compiles packages even when they have no tests, which catches missing imports and type errors. Vet complements tests by inspecting suspicious constructs; it is not a proof of correctness.",
    "A fresh module cache is a stronger reproducibility check when external modules are involved, but it may need authorised network or an internal proxy. Offline projects can use checked-in vendor content or controlled local replacements for exercises; production dependency verification should match the organisation's proxy and authentication policy.",
    "Finally, review the files. A path typo becomes an import-compatibility problem after publication, and an unexpected requirement may reveal a test or tool import. Generated does not mean unimportant: the module files are the build inputs another developer or CI runner will receive."
  ),
  visualType: "flow_diagram",
  visualTitle: "A deliberate module bootstrap",
  visual: "```mermaid\nflowchart LR\n  A[Choose module root and path] --> B[go mod init path]\n  B --> C[Add source and tests]\n  C --> D[go mod tidy]\n  D --> E[go test ./... + go vet ./...]\n  E --> F[Review module-file diff]\n```",
  codeTitle: "Start from source files and create the module boundary",
  files: {
    "main.go": go(
      "package main",
      "",
      "import \"fmt\"",
      "",
      "func greeting(name string) string { return \"Hello, \" + name }",
      "",
      "func main() { fmt.Println(greeting(\"Go\")) }"
    ),
    "main_test.go": go(
      "package main",
      "",
      "import \"testing\"",
      "",
      "func TestGreeting(t *testing.T) {",
      "\tif got := greeting(\"Go\"); got != \"Hello, Go\" {",
      "\t\tt.Fatalf(\"greeting = %q\", got)",
      "\t}",
      "}"
    ),
  },
  commands: [
    "go mod init example.test/hello",
    "go mod tidy -diff",
    "go test ./...",
    "go vet ./...",
  ],
  checks: [["go", "mod", "init", "example.test/hello"], ["go", "mod", "tidy", "-diff"], ["go", "test", "./..."], ["go", "vet", "./..."]],
  codeNote: "The example intentionally starts without `go.mod`, so the first command demonstrates creation rather than displaying a file that already exists.",
  followups: [
    "What happens if `go mod init` is run beneath another module?",
    "Why can a module with no external dependencies lack `go.sum`?",
    "How would CI check that tidy would not change committed files?",
  ],
});

finalize();
