#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatInterviewArticle,
  interviewAnswerSize,
} from "./lib/interview-article.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const domainRoot = path.join(repoRoot, "content/go-fresher");
const moduleRoot = path.join(domainRoot, "testing-basics-go");

const topicOrder = [
  "test-file-naming",
  "testing-t-basics",
  "t-error-vs-t-fatal",
  "table-driven-tests",
  "running-tests",
  "test-coverage",
  "example-functions",
  "comparisons",
];

const topicTitles = {
  "test-file-naming": "Test Files and Test Data",
  "testing-t-basics": "testing.T Basics",
  "t-error-vs-t-fatal": "Error versus Fatal",
  "table-driven-tests": "Table-Driven Tests",
  "running-tests": "Running and Diagnosing Tests",
  "test-coverage": "Test Coverage",
  "example-functions": "Example Functions",
  comparisons: "Choosing the Right Test Tool",
};

const paragraphs = (...values) => values.join("\n\n");
const go = (...lines) => ({ language: "go", text: `${lines.join("\n")}\n` });
const textFile = (...lines) => ({ language: "text", text: `${lines.join("\n")}\n` });

function formatSource(file) {
  if (file.language !== "go") return file.text;
  return execFileSync("gofmt", [], { input: file.text, encoding: "utf8" });
}

function renderFiles(files, commands = []) {
  const blocks = Object.entries(files).map(([name, file]) => {
    const source = formatSource(file).trimEnd();
    return `**${name}**\n\n\`\`\`${file.language}\n${source}\n\`\`\``;
  });
  if (commands.length > 0) {
    blocks.push(`**Run it**\n\n\`\`\`bash\n${commands.join("\n")}\n\`\`\``);
  }
  return blocks.join("\n\n");
}

const lessons = [];
const add = (lesson) => lessons.push(lesson);

add({
  topicSlug: "test-file-naming",
  question: "How does Go discover tests in `_test.go` files?",
  title: "How Go discovers test files and functions",
  direct: "The `go test` command includes files whose names end in `_test.go`, builds a temporary test binary, and discovers functions with recognised signatures such as `func TestName(t *testing.T)`. The part after `Test` must not begin with a lowercase letter. Ordinary `go build` excludes these files, so tests and test-only helpers do not become part of the production binary.",
  quick: [
    "Test source files must end in `_test.go`.",
    "A test has the form `func TestXxx(t *testing.T)` and returns nothing.",
    "The name after `Test` must not begin with a lowercase letter.",
    "`go test` builds and runs a temporary test binary.",
    "Ordinary package builds exclude `_test.go` files.",
  ],
  speaking: paragraphs(
    "- Go testing is convention-driven. A source file is considered test source when its filename ends in `_test.go`. Inside it, a test function has the exact shape `func TestXxx(t *testing.T)`: it is exported-looking, accepts one `*testing.T`, and has no return values. `Xxx` must not start with a lowercase letter, so `TestAdd` and `Test_add` are recognised but `Testadd` is not.",
    "- When `go test` runs, the Go tool recompiles the package together with its test files, creates a temporary test binary, and runs the matching tests. The same `_test.go` files are left out of an ordinary `go build`, which keeps assertions, fixtures, and helper code outside the shipped package.",
    "- For example, `add.go` contains the production `Add` function and `add_test.go` contains `TestAdd`. Running `go test` discovers and executes that function; running `go build` compiles only the production file. The function name, parameter, and suffix are the discovery contract—there is no annotation or base test class.",
    "- The suffix alone does not make every function a test. Benchmarks use `BenchmarkXxx(*testing.B)`, fuzz tests use `FuzzXxx(*testing.F)`, and examples use the documented `Example...` naming forms. The result is a small standard protocol: name the file and function correctly, then let the toolchain build an isolated test program."
  ),
  overviewTitle: "Two filters decide what runs",
  overview: "Go first selects test source by filename, then the testing package selects entry points by function name and signature. Keeping those two filters separate explains why a correctly named function in `add.go` is not a test and why a lowercase `Testadd` inside `add_test.go` is only an ordinary helper function.",
  deepTitle: "Follow the package-to-test-binary pipeline",
  deep: paragraphs(
    "A normal package build reads the applicable `.go` files for the target platform but ignores files ending in `_test.go`. A test build starts from the same package and adds the internal test files. It may also compile an external test package whose name ends in `_test`; that package imports and tests the compiled package through its exported API.",
    "The tool then generates a main program that registers recognised tests, benchmarks, fuzz targets, and examples. This generated program becomes a temporary binary. That detail is why package initialisation runs for tests and why a test failure is reported through `testing.T` instead of being returned from the test function.",
    "Discovery is intentionally strict. `TestParse(t *testing.T)` qualifies; `Testparse`, `TestParse()`, and `TestParse(t *testing.T) error` do not. A test can call ordinary helper functions with any useful signature, but only the entry point follows the testing contract.",
    "Selection happens after discovery. Flags such as `-run` choose from recognised tests and subtests; they cannot turn an incorrectly named function into a test. Similarly, a file ignored because it lacks `_test.go` remains ordinary package source even if it contains a `TestXxx` function.",
    "The separation is valuable because production APIs do not need test hooks merely for discovery. Test-only constructors, fake values, and assertions can remain beside the code they exercise without being included in a normal build. Shared production behaviour should still live in ordinary files so that tests exercise the same implementation users receive."
  ),
  visualType: "flow_diagram",
  visualTitle: "From source files to a test result",
  visual: "```mermaid\nflowchart LR\n  A[Package .go files] --> C[Compile package]\n  B[*_test.go files] --> D[Compile tests]\n  C --> E[Generated test main]\n  D --> E\n  E --> F[Temporary test binary]\n  F --> G[Run recognised TestXxx functions]\n```",
  codeTitle: "A discoverable test beside production code",
  files: {
    "add.go": go(
      "package lesson",
      "",
      "func Add(a, b int) int {",
      "\treturn a + b",
      "}"
    ),
    "add_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestAdd(t *testing.T) {",
      "\tif got := Add(2, 3); got != 5 {",
      "\t\tt.Fatalf(\"Add(2, 3) = %d; want 5\", got)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -v ./...", "go build ./..."],
  codeNote: "The test file participates in the first command but not in the ordinary build. Both commands compile the same `Add` implementation.",
  followups: [
    "Would `func Testadd(t *testing.T)` be discovered?",
    "Why does `go test` build a separate binary?",
    "Which files does an ordinary `go build` exclude?",
  ],
});

add({
  topicSlug: "test-file-naming",
  question: "What belongs in a Go `_test.go` file, and when is it compiled?",
  title: "Keeping tests and test-only helpers in `_test.go`",
  direct: "A `_test.go` file normally contains tests, benchmarks, fuzz targets, examples, and helpers used only by them. The Go tool includes it while building a package for `go test` and excludes it from ordinary builds. Put real application behaviour in normal `.go` files; use test files for verification and test scaffolding, not a second implementation of the feature.",
  quick: [
    "Tests, examples, benchmarks, fuzz targets, and test helpers belong in `_test.go`.",
    "The file is compiled for `go test`, not for a normal package build.",
    "Test-only helpers may be unexported and live close to the tests.",
    "Production behaviour must remain in ordinary `.go` files.",
    "Build tags can further limit when a test file participates.",
  ],
  speaking: paragraphs(
    "- A `_test.go` file is the home for code whose purpose is to verify or demonstrate a package. That includes `TestXxx` functions, benchmarks, fuzz targets, executable examples, and small helper functions that build fixtures or compare results. Helpers do not need special names unless the testing package must discover them.",
    "- The file is included when the package is compiled by `go test` and excluded from ordinary package builds. Therefore an unexported `mustParse` helper in `parser_test.go` is available to tests without becoming part of the application or library delivered to callers.",
    "- For example, the production file below exposes `Normalize`, while `normalize_test.go` defines `wantEqual`, marks it with `t.Helper`, and uses it from two cases. The helper improves the failure location but does not duplicate the normalization rule. Both cases call the real production function.",
    "- The boundary matters. If a helper contains an alternative implementation and tests compare the function against that copied logic, the test may repeat the same mistake instead of checking an observable result. Keep expected values simple and explicit. Larger integration tests may also use build tags, but the `_test.go` suffix remains required for the Go testing workflow."
  ),
  overviewTitle: "Test scaffolding is not production behaviour",
  overview: "A useful test file supplies inputs, invokes public or package-visible behaviour, and checks outcomes. It may reduce setup noise, but it should not become a shadow application. Expected values that a reader can inspect are stronger than an elaborate helper which calculates the same answer as the code under test.",
  deepTitle: "Use the compilation boundary deliberately",
  deep: paragraphs(
    "Because `_test.go` is excluded from regular builds, it is safe to define names that exist only for verification. A helper can accept `*testing.T`, call `t.Helper`, prepare a temporary resource, and register cleanup. None of that expands the production API.",
    "The same-package form, such as `package parser`, can access unexported declarations. That makes it useful for focused checks of difficult internal invariants, but it can also couple tests to refactoring details. An external `package parser_test` sees only exported behaviour and provides a different boundary; both forms still live in `_test.go`.",
    "Build constraints can separate slow or environment-specific tests, but they add another selection rule. A tag should describe a real execution boundary, and the normal suite should remain valuable without hidden setup. Merely renaming a slow test file does not create a recognised test category.",
    "Test code must compile even when a particular test is filtered out. The package test binary is built before `-run` chooses functions. A broken unused helper therefore fails the command, which is useful: the complete test source remains type-checked rather than quietly decaying.",
    "Keep reusable domain behaviour in normal files. If production needs a clock, filesystem, or network dependency to be replaceable, model that boundary in production design and supply a small fake in the test file. This tests the actual contract while keeping test-only data and assertions out of the shipped binary."
  ),
  visualType: "comparison_table",
  visualTitle: "Where each kind of code belongs",
  visual: "| Code | Normal `.go` file | `_test.go` file |\n|---|---:|---:|\n| Application behaviour | Yes | No duplicate implementation |\n| Test entry points | No | Yes |\n| Test-only fixture builders | No | Yes |\n| Public dependency boundary | Yes | Fake implementation may be in tests |\n| Executable documentation | API stays normal | `Example...` lives here |",
  codeTitle: "A test-only assertion helper",
  files: {
    "normalize.go": go(
      "package lesson",
      "",
      "import \"strings\"",
      "",
      "func Normalize(value string) string {",
      "\treturn strings.ToLower(strings.TrimSpace(value))",
      "}"
    ),
    "normalize_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func wantEqual(t *testing.T, got, want string) {",
      "\tt.Helper()",
      "\tif got != want {",
      "\t\tt.Errorf(\"got %q; want %q\", got, want)",
      "\t}",
      "}",
      "",
      "func TestNormalize(t *testing.T) {",
      "\twantEqual(t, Normalize(\" Go \"), \"go\")",
      "\twantEqual(t, Normalize(\"READY\"), \"ready\")",
      "}"
    ),
  },
  commands: ["go test ./...", "go build ./..."],
  codeNote: "`wantEqual` is compiled for the test command only. `Normalize` remains the single implementation of the production rule.",
  followups: [
    "Are helper functions in `_test.go` required to start with `Test`?",
    "Why can a filtered test still be affected by a compilation error elsewhere?",
    "When might an external `_test` package give a better boundary?",
  ],
});

add({
  topicSlug: "test-file-naming",
  question: "How should Go tests use `testdata` and `t.TempDir`?",
  title: "Stable input fixtures and disposable test output",
  direct: "Keep read-only fixtures in a package-level `testdata` directory; the Go tool ignores that directory as a package but tests run with the package directory as their working directory. Use `t.TempDir()` for files a test creates or changes. Each call returns a unique directory that testing removes after the test and all its subtests finish.",
  quick: [
    "`testdata` is ignored as a Go package and is available for fixtures.",
    "Tests normally run with the package source directory as the working directory.",
    "Treat checked-in fixtures as read-only inputs.",
    "Use `t.TempDir()` for generated or mutable files.",
    "The testing package removes each temporary directory automatically.",
  ],
  speaking: paragraphs(
    "- Go gives tests two useful filesystem locations with different jobs. A directory named `testdata` is ignored when the Go tool scans packages, so it can hold checked-in JSON, text, certificates, or other stable inputs. A test can usually open a relative path such as `testdata/greeting.txt` because the test binary runs with the package source directory as its working directory.",
    "- `t.TempDir()` is for output and mutable state. It creates a unique directory for that test, and the testing package removes it after the test and its subtests complete. Separate calls and separate tests do not have to coordinate filenames, which makes parallel execution safer.",
    "- For example, the fixture supplies the known input `hello`. The test uppercases it and writes the result under `t.TempDir`, then reads it back. The repository fixture never changes, while the generated file has a clear disposable lifetime.",
    "- Tests should not write into the package directory or modify `testdata`: source trees and module caches may be read-only, and shared files make order-dependent tests. A very large fixture can also make the repository slow and obscure the behaviour being checked. Use the smallest representative fixture, generate bulky data in a temporary directory, and pass paths into production code rather than relying on a hidden global location."
  ),
  overviewTitle: "Separate durable evidence from temporary state",
  overview: "A fixture is part of the test's specification and should be stable enough to review. Generated output is an implementation detail of one run and should be isolated. The `testdata` plus `TempDir` split makes that ownership visible without a custom cleanup framework.",
  deepTitle: "Design filesystem tests around ownership",
  deep: paragraphs(
    "The special `testdata` name affects package discovery, not file access. Go does not try to compile its contents as another package, yet files remain beside the test source. This works well for inputs where byte-for-byte form matters, such as malformed documents or golden output reviewed in version control.",
    "Relative fixture paths are resolved from the package's test working directory. A helper can centralise a path with `filepath.Join(\"testdata\", name)`, but production functions should receive the path, reader, or filesystem dependency explicitly. That keeps the application independent from the test layout.",
    "Temporary directories solve the opposite problem. Each test receives its own namespace, may create subdirectories and files freely, and does not need to defer `os.RemoveAll`. Cleanup happens after descendant subtests, so a parent can prepare a directory and let its children use it while they run.",
    "Do not confuse automatic deletion with closing open files. A test still needs to close handles and check write or close errors where they matter. TempDir manages directory lifetime; it does not make incomplete writes or leaked resources correct.",
    "For a golden-file workflow, compare generated bytes with a checked-in file and make updates an explicit developer action rather than silently rewriting expectations during an ordinary test. This preserves reproducibility: a normal `go test` reads its evidence and writes only inside a private temporary area."
  ),
  visualType: "comparison_table",
  visualTitle: "Two filesystem homes, two ownership rules",
  visual: "| Location | Best for | Lifetime | May tests mutate it? |\n|---|---|---|---:|\n| `testdata/...` | Small reviewed input fixtures | Stored with source | No |\n| `t.TempDir()` | Generated output and mutable state | One test tree | Yes |\n| Package directory | Go source | Repository/module cache | Avoid test writes |",
  codeTitle: "Read a fixture and write only to a temporary directory",
  files: {
    "transform.go": go(
      "package lesson",
      "",
      "import \"bytes\"",
      "",
      "func Upper(input []byte) []byte {",
      "\treturn bytes.ToUpper(input)",
      "}"
    ),
    "transform_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"os\"",
      "\t\"path/filepath\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestUpperFile(t *testing.T) {",
      "\tinput, err := os.ReadFile(filepath.Join(\"testdata\", \"greeting.txt\"))",
      "\tif err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\toutputPath := filepath.Join(t.TempDir(), \"result.txt\")",
      "\tif err := os.WriteFile(outputPath, Upper(input), 0o600); err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\tgot, err := os.ReadFile(outputPath)",
      "\tif err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\tif string(got) != \"HELLO\\n\" {",
      "\t\tt.Fatalf(\"got %q; want %q\", got, \"HELLO\\n\")",
      "\t}",
      "}"
    ),
    "testdata/greeting.txt": textFile("hello"),
  },
  commands: ["go test ./..."],
  codeNote: "The checked-in fixture is only read. Every generated file is contained in the test's automatically managed directory.",
  followups: [
    "Why is `testdata` not treated as another Go package?",
    "When is an inline string better than a fixture file?",
    "Does `t.TempDir` close files opened inside it?",
  ],
});

add({
  topicSlug: "testing-t-basics",
  question: "What does `*testing.T` provide to a Go test?",
  title: "The test handle for state, logs, and subtests",
  direct: "`*testing.T` is the handle for one running test or subtest. It records failures and logs, exposes the test name, runs child tests with `Run`, marks helper frames, registers cleanup, creates temporary directories, and provides test-scoped context and environment helpers. A test reports through this handle instead of returning an error or boolean.",
  quick: [
    "Each test receives its own `*testing.T` handle.",
    "`Error` records failure and continues; `Fatal` records failure and stops that test goroutine.",
    "`Run` creates a named subtest with its own `*testing.T`.",
    "`Helper`, `Cleanup`, and `TempDir` support reusable test setup.",
    "`Name`, `Deadline`, and `Context` expose test-scoped information.",
  ],
  speaking: paragraphs(
    "- `*testing.T` represents the state and lifecycle of one test. The testing package constructs it and passes it to `TestXxx`; application code does not create one. Calls such as `Logf`, `Errorf`, and `Fatalf` attach diagnostics and failure status to that test instead of returning a result from the test function.",
    "- The same handle coordinates structure and resources. `t.Run(name, fn)` creates a child test with its own handle and hierarchical name. `t.Helper()` improves failure locations in assertion helpers, `t.Cleanup(fn)` registers LIFO cleanup, and `t.TempDir()` gives the test isolated filesystem state.",
    "- For example, one parent test runs valid and invalid `ParsePort` cases as named subtests. Each child can fail independently, and its full name identifies the input that broke. The test uses `t.Fatalf` only when the returned error makes the value impossible to inspect safely.",
    "- A `T` is not an ordinary logger and should not be stored for later work after the test finishes. Reporting methods such as `Errorf` may be called concurrently, but methods that end a test, including `Fatalf`, must be called from the goroutine running that test. Treat `*testing.T` as the scoped control surface for a live test, with ownership ending when that test and its subtests complete."
  ),
  overviewTitle: "One object carries the test lifecycle",
  overview: "A test function has no result type because its `*testing.T` already carries status and diagnostics back to the runner. Child tests repeat the same model, creating a tree in which each node can log, fail, own resources, and report a precise path.",
  deepTitle: "Read `T` as state plus services",
  deep: paragraphs(
    "The failure methods change test state. `Fail` marks the test failed, `Failed` reads that state, and `Error` combines a log with `Fail`. The runner lets the function continue unless a FailNow-based method is used, so later independent checks can produce more evidence in one run.",
    "Logging is associated with the current test rather than written as unstructured global output. Successful-test logs are normally shown with verbose output, while failure diagnostics are retained for the failing result. This makes parallel package output and named subtests easier to understand.",
    "Lifecycle helpers reduce manual cleanup. Cleanup callbacks run after the test and all its subtests finish, in last-added-first-called order. TempDir registers directory removal through that lifecycle. A test-scoped context is cancelled just before cleanup begins, which lets background work observe shutdown before resources are dismantled.",
    "Structure also belongs to T. A child created by Run has a slash-separated name beneath its parent, and command-line patterns can select name components. A parent does not finish until its subtests finish, including parallel children that resume later.",
    "Some methods have stricter goroutine rules than others. Log and Error-style reporting can be invoked concurrently, but FailNow, Fatal, SkipNow, and Parallel must run in the test's own goroutine. Code under test should normally return errors or values to that goroutine rather than depend directly on `testing.T`."
  ),
  visualType: "concept_map",
  visualTitle: "What one `testing.T` controls",
  visual: "```mermaid\nflowchart TD\n  T[*testing.T] --> S[Status: Fail / Failed]\n  T --> L[Diagnostics: Log / Error / Fatal]\n  T --> C[Children: Run / Parallel]\n  T --> R[Resources: Cleanup / TempDir]\n  T --> M[Metadata: Name / Deadline / Context]\n```",
  codeTitle: "Named cases using the test handle",
  files: {
    "port.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"strconv\"",
      ")",
      "",
      "func ParsePort(value string) (int, error) {",
      "\tport, err := strconv.Atoi(value)",
      "\tif err != nil || port < 1 || port > 65535 {",
      "\t\treturn 0, fmt.Errorf(\"invalid port %q\", value)",
      "\t}",
      "\treturn port, nil",
      "}"
    ),
    "port_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestParsePort(t *testing.T) {",
      "\tt.Run(\"valid\", func(t *testing.T) {",
      "\t\tgot, err := ParsePort(\"8080\")",
      "\t\tif err != nil {",
      "\t\t\tt.Fatal(err)",
      "\t\t}",
      "\t\tif got != 8080 {",
      "\t\t\tt.Errorf(\"got %d; want 8080\", got)",
      "\t\t}",
      "\t})",
      "\tt.Run(\"out of range\", func(t *testing.T) {",
      "\t\tif _, err := ParsePort(\"70000\"); err == nil {",
      "\t\t\tt.Error(\"expected an error\")",
      "\t\t}",
      "\t})",
      "}"
    ),
  },
  commands: ["go test -v ./..."],
  codeNote: "The subtest names turn two branches into separate results while the parent still describes the shared behaviour under test.",
  followups: [
    "Why do Go test functions not return an error?",
    "Which `testing.T` methods may be called from worker goroutines?",
    "When are a parent's cleanup callbacks run?",
  ],
});

add({
  topicSlug: "testing-t-basics",
  question: "How do `t.Helper` and `t.Cleanup` improve Go test helpers?",
  title: "Clear failure locations and reliable cleanup",
  direct: "Call `t.Helper()` inside a test helper so failure reports point to the caller rather than the helper's assertion line. Register resource release with `t.Cleanup`; callbacks run after the test and its subtests, in last-in-first-out order, even when the test exits through `Fatal`. Together they keep setup reusable without hiding where or why a case failed.",
  quick: [
    "`t.Helper()` marks the current function as a test helper.",
    "Failure file-and-line reports skip helper frames.",
    "`t.Cleanup(fn)` registers cleanup for the test lifecycle.",
    "Cleanup runs after subtests and uses last-in-first-out order.",
    "Cleanup still runs when the test stops through `Fatal`.",
  ],
  speaking: paragraphs(
    "- Test helpers should remove repeated setup without making failures harder to trace. Calling `t.Helper()` at the start of a helper tells the testing package to skip that function's frame when it prints a file and line. If `requirePositive(t, value)` fails, the report points to the specific call in the test table rather than the shared `t.Fatalf` line.",
    "- `t.Cleanup` ties release to the test instead of the helper's stack frame. A helper that creates a resource can register its close or restore action immediately and return only the usable value. Cleanup callbacks run after the test and all of its subtests have finished, in reverse registration order.",
    "- For example, the helper creates a temporary file, writes a value, seeks back to the start, and registers `Close`. The test only reads the returned file. If setup fails, the helper calls `t.Fatal`; previously registered cleanup still participates in the test lifecycle.",
    "- These methods do not remove every responsibility. A helper should keep its failure message specific, should not call `t.Helper` on behalf of unrelated frames, and must decide whether a close error itself is important. Cleanup happens later, so a test that must verify a flush or close result should do that explicitly before its assertions are complete."
  ),
  overviewTitle: "A helper has two audiences",
  overview: "The helper serves the test author by reducing repetition and serves the person debugging a failure by preserving the relevant call site. Helper marking handles attribution; cleanup registration handles ownership. A good helper keeps both visible in a small contract.",
  deepTitle: "Model setup as acquisition plus registered release",
  deep: paragraphs(
    "Without Helper, an assertion wrapper often reports the same internal line for every case. Marking the function changes diagnostic stack selection, not control flow: errors still affect the same `testing.T`, and the helper may return or call a FailNow-based method according to its contract.",
    "Cleanup belongs to the test tree rather than normal defer scope. A parent helper can acquire a server used by several child tests and register one shutdown; the callback waits until those children finish. This differs from `defer` in the parent test function, which runs when that function returns and may run before parallel descendants resume.",
    "LIFO order supports dependent resources. If a helper registers database cleanup, then starts a server and registers server cleanup, the server is stopped before the database is removed. Register each release as soon as acquisition succeeds so later setup failures do not leak earlier resources.",
    "A cleanup callback may itself report an error through T. For output correctness, an explicit operation can be clearer: flush, check the result, close, check the result, and then let cleanup serve only as a fallback. Resource release and validation are related but not identical jobs.",
    "Keep helpers domain-specific enough to produce useful messages. A generic reflection-based equality wrapper can hide types and intent; a small `openFixture` or `requireStatus` helper can name the exact contract. The goal is not to recreate an assertion framework but to make repeated test structure honest and readable."
  ),
  visualType: "sequence_diagram",
  visualTitle: "Resource ownership through the test lifecycle",
  visual: "```mermaid\nsequenceDiagram\n  participant Test\n  participant Helper\n  participant Resource\n  Test->>Helper: acquire(t)\n  Helper->>Helper: t.Helper()\n  Helper->>Resource: create\n  Helper->>Test: t.Cleanup(close)\n  Helper-->>Test: usable resource\n  Test->>Resource: assertions\n  Test->>Resource: cleanup after test tree\n```",
  codeTitle: "A helper that owns its cleanup",
  files: {
    "file_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"io\"",
      "\t\"os\"",
      "\t\"testing\"",
      ")",
      "",
      "func testFile(t *testing.T, value string) *os.File {",
      "\tt.Helper()",
      "\tfile, err := os.CreateTemp(t.TempDir(), \"value-*\")",
      "\tif err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\tt.Cleanup(func() { _ = file.Close() })",
      "\tif _, err := file.WriteString(value); err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\tif _, err := file.Seek(0, io.SeekStart); err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\treturn file",
      "}",
      "",
      "func TestFileContents(t *testing.T) {",
      "\tfile := testFile(t, \"ready\")",
      "\tgot, err := io.ReadAll(file)",
      "\tif err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\tif string(got) != \"ready\" {",
      "\t\tt.Fatalf(\"got %q; want ready\", got)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test ./..."],
  codeNote: "The helper owns acquisition and fallback release; the test sees a ready-to-use file and receives failures at its call site.",
  followups: [
    "How does `t.Helper` change a failure report?",
    "Why can `t.Cleanup` be safer than a parent-test defer for subtests?",
    "When should a close error be checked before cleanup time?",
  ],
});

add({
  topicSlug: "testing-t-basics",
  question: "How should Go tests manage temporary resources and process-wide state?",
  title: "Isolated resources without unsafe parallel state",
  direct: "Use test-scoped helpers such as `t.TempDir` and `t.Cleanup` for resources with local ownership. `t.Setenv` changes an environment variable and restores it through cleanup, but environment variables are process-wide, so it cannot be used in a parallel test or one with a parallel ancestor. Prefer dependency injection when tests need different configuration concurrently.",
  quick: [
    "Use `t.TempDir` for isolated filesystem state.",
    "Register other releases and restores with `t.Cleanup`.",
    "`t.Setenv` restores the original environment after the test.",
    "Environment variables are shared by the whole process.",
    "Do not call `t.Setenv` from a parallel test or parallel ancestor.",
    "Inject configuration when tests need independent parallel values.",
  ],
  speaking: paragraphs(
    "- Test state is easiest to trust when its owner and lifetime match one test. `t.TempDir` gives that test a private directory and schedules deletion. `t.Cleanup` can restore a package variable, stop a local server, or close another resource after the entire test subtree finishes.",
    "- `t.Setenv(key, value)` is a convenience for process environment. It records the current setting, changes it, and restores it with Cleanup. The important boundary is that an environment variable belongs to the process, not to one goroutine or subtest. For that reason, Setenv is forbidden in a parallel test and in a test with a parallel ancestor.",
    "- For example, `GreetingFrom` is tested by passing an explicit lookup function. Each case owns a tiny map and can run in parallel without touching real environment state. A separate sequential test could use `t.Setenv` when the production boundary is specifically `os.Getenv`.",
    "- Similar caution applies to changing the working directory, package globals, and shared fixed ports. Automatic restoration does not make concurrent mutation isolated. Prefer values passed into functions, interfaces around external services, `httptest` servers with dynamic addresses, and test-owned temporary paths. Use process-wide helpers only when testing that exact process-wide integration and keep those tests sequential."
  ),
  overviewTitle: "Cleanup solves lifetime, not sharing",
  overview: "Automatic restoration answers 'when is this state released?' It does not answer 'who else can observe the temporary value?' Local resources can be safely test-scoped; process-wide state needs serial execution or, more often, a design that accepts its dependencies explicitly.",
  deepTitle: "Classify state before choosing a helper",
  deep: paragraphs(
    "A temporary directory is naturally local: only code given its path can use it. Unique names avoid collisions, and cleanup can wait for descendants. This makes TempDir suitable for parallel tests as long as each case receives its own directory or obeys deliberate sharing rules.",
    "Environment variables are different. `os.Setenv` changes the process environment immediately. Another parallel test or goroutine reading the same key observes whichever value is current, regardless of which `testing.T` registered restoration. Setenv therefore rejects a parallel context instead of pretending cleanup creates isolation.",
    "Dependency injection converts global lookup into a local value. A configuration loader can accept `func(string) (string, bool)`, or production can load environment once and pass a typed Config through the application. Tests then supply independent maps, cover missing and empty values precisely, and run concurrently.",
    "Cleanup ordering is still useful for truly test-owned services. Start the dependency, register shutdown immediately, and then create clients. If background work uses `t.Context`, it receives cancellation just before cleanup callbacks start, giving it a chance to stop before underlying resources disappear.",
    "Audit any helper that changes shared state: environment, current directory, process signals, default HTTP transports, global loggers, singleton caches, or fixed network ports. Restoration prevents lasting pollution, but sequential ownership or explicit dependencies prevent observations during the changed interval."
  ),
  visualType: "decision_tree",
  visualTitle: "Choose isolation from the state's scope",
  visual: "```mermaid\nflowchart TD\n  A[Test needs mutable state] --> B{Can each test own it?}\n  B -- Yes --> C[TempDir / local server / local value]\n  B -- No --> D{Is process-global behaviour the subject?}\n  D -- Yes --> E[Sequential test + Cleanup or Setenv]\n  D -- No --> F[Inject a dependency]\n  C --> G[Parallel execution can be safe]\n  F --> G\n```",
  codeTitle: "Inject environment lookup for parallel cases",
  files: {
    "greeting.go": go(
      "package lesson",
      "",
      "func GreetingFrom(lookup func(string) (string, bool)) string {",
      "\tname, ok := lookup(\"APP_NAME\")",
      "\tif !ok || name == \"\" {",
      "\t\treturn \"hello, app\"",
      "\t}",
      "\treturn \"hello, \" + name",
      "}"
    ),
    "greeting_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestGreetingFrom(t *testing.T) {",
      "\tcases := map[string]map[string]string{",
      "\t\t\"configured\": {\"APP_NAME\": \"api\"},",
      "\t\t\"missing\":    {},",
      "\t}",
      "\tfor name, values := range cases {",
      "\t\tname, values := name, values",
      "\t\tt.Run(name, func(t *testing.T) {",
      "\t\t\tt.Parallel()",
      "\t\t\tlookup := func(key string) (string, bool) {",
      "\t\t\t\tvalue, ok := values[key]",
      "\t\t\t\treturn value, ok",
      "\t\t\t}",
      "\t\t\tgot := GreetingFrom(lookup)",
      "\t\t\tif got == \"\" {",
      "\t\t\t\tt.Error(\"greeting must not be empty\")",
      "\t\t\t}",
      "\t\t})",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./..."],
  codeNote: "Every subtest owns its lookup data. No process environment changes, restoration races, or special execution order are required.",
  followups: [
    "Why does cleanup not make `t.Setenv` safe in parallel tests?",
    "Which other process-wide settings can make tests order-dependent?",
    "When is a sequential environment integration test still valuable?",
  ],
});

add({
  topicSlug: "t-error-vs-t-fatal",
  question: "What is the difference between `t.Error` and `t.Fatal`?",
  title: "Reporting a failure or stopping the current test",
  direct: "`t.Error` logs its arguments, marks the current test failed, and lets that test continue. `t.Fatal` logs, marks failure, and immediately calls `FailNow`, which ends the goroutine running that test through `runtime.Goexit`; deferred calls in that goroutine still run. Use Error for independent checks and Fatal when later code cannot run meaningfully or safely.",
  quick: [
    "`t.Error` is equivalent to `t.Log` followed by `t.Fail`.",
    "`t.Fatal` is equivalent to `t.Log` followed by `t.FailNow`.",
    "Error records failure but continues the current test.",
    "Fatal ends only the goroutine running the current test.",
    "Deferred calls in that goroutine still run after Fatal.",
    "Use Fatal only when continuing would be invalid or unsafe.",
  ],
  speaking: paragraphs(
    "- `t.Error` and `t.Errorf` report a failure without stopping the current test function. Error logs its arguments and calls `Fail`; Errorf formats the message first. This is useful when several checks are independent and seeing all mismatches in one run provides better evidence.",
    "- `t.Fatal` and `t.Fatalf` also log and mark failure, but then call `FailNow`. FailNow ends the goroutine that is running that test by calling `runtime.Goexit`. It is not exactly a `return`, because deferred functions in that goroutine still execute, and it does not stop unrelated goroutines or the whole test binary.",
    "- For example, a parsing error is fatal because there is no valid `Config` value to inspect. Once parsing succeeds, the host and port assertions are independent, so they use Errorf. If both fields were wrong, one test run would report both differences.",
    "- The choice follows dependency, not severity. Stop when a failed setup step, nil value, or broken precondition would make later code misleading or cause a panic. Continue when checks can stand alone. In either case, include the operation or actual and expected values so the report is useful without manually recreating the test."
  ),
  overviewTitle: "Draw a dependency line between assertions",
  overview: "A failure should stop the current test only when later work depends on the failed result. Independent observations can accumulate with Error, while a broken gateway condition uses Fatal to prevent invalid follow-on execution.",
  deepTitle: "Separate failure state from control flow",
  deep: paragraphs(
    "`Fail` changes the test's status but returns to its caller. Once marked, the test remains failed even if later checks pass. That permits a group of independent assertions to run to completion and produce a fuller diagnostic record.",
    "`FailNow` changes the same status and then exits the current test goroutine. Goexit runs deferred calls, so direct defers in that goroutine still provide a safety net. The testing package also runs Cleanup callbacks according to the test lifecycle.",
    "The runner can continue with sibling subtests and other tests after one test calls Fatal. Fatal is therefore not a package-wide abort. Goroutines started by the test are not automatically terminated either; they need an explicit cancellation or completion protocol.",
    "A common safe boundary is parse before inspect. If decoding returns an error, fields of the intended result are not trustworthy, so Fatal ends the case. Once a valid result exists, a wrong name and wrong limit are separate contract failures and can both use Errorf.",
    "Overusing Fatal hides useful evidence. Underusing it can produce nil dereferences or confusing secondary messages. Read the next operation after an assertion: if it cannot be interpreted safely when the assertion fails, the earlier check is a precondition and should stop that test."
  ),
  visualType: "decision_tree",
  visualTitle: "Choose from assertion dependency",
  visual: "```mermaid\nflowchart TD\n  A[Check fails] --> B{Does later work need this result?}\n  B -- No --> C[t.Error or t.Errorf]\n  C --> D[Record more independent checks]\n  B -- Yes --> E[t.Fatal or t.Fatalf]\n  E --> F[Run defers; end current test goroutine]\n```",
  codeTitle: "Fatal setup, then independent field checks",
  files: {
    "config.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"strconv\"",
      "\t\"strings\"",
      ")",
      "",
      "type Config struct {",
      "\tHost string",
      "\tPort int",
      "}",
      "",
      "func ParseConfig(value string) (Config, error) {",
      "\thost, rawPort, ok := strings.Cut(value, \":\")",
      "\tif !ok || host == \"\" {",
      "\t\treturn Config{}, fmt.Errorf(\"invalid config %q\", value)",
      "\t}",
      "\tport, err := strconv.Atoi(rawPort)",
      "\tif err != nil {",
      "\t\treturn Config{}, fmt.Errorf(\"invalid port: %w\", err)",
      "\t}",
      "\treturn Config{Host: host, Port: port}, nil",
      "}"
    ),
    "config_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestParseConfig(t *testing.T) {",
      "\tgot, err := ParseConfig(\"api:8080\")",
      "\tif err != nil {",
      "\t\tt.Fatalf(\"ParseConfig returned an error: %v\", err)",
      "\t}",
      "\tif got.Host != \"api\" {",
      "\t\tt.Errorf(\"Host = %q; want api\", got.Host)",
      "\t}",
      "\tif got.Port != 8080 {",
      "\t\tt.Errorf(\"Port = %d; want 8080\", got.Port)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test ./..."],
  codeNote: "The parse result is a prerequisite, while its two fields are independent observations. The test therefore stops once, then can report both field mismatches.",
  followups: [
    "Does `t.Fatal` stop sibling tests or the whole binary?",
    "Which deferred calls run after `t.Fatal`?",
    "When can several `t.Errorf` checks be more useful than one Fatal?",
  ],
});

add({
  topicSlug: "t-error-vs-t-fatal",
  question: "When should a Go test stop after a failed precondition?",
  title: "Stopping only when the next step is invalid",
  direct: "Stop the current test with `Fatal`, `Fatalf`, or `FailNow` when setup failed, a required object is absent, or the next operation would panic or produce meaningless secondary failures. Do not use Fatal merely because an assertion is important. If later checks remain valid and independent, record the mismatch with Error and continue collecting useful evidence.",
  quick: [
    "A failed setup or missing required value is usually fatal to that test.",
    "Stop before dereferencing or using an invalid result.",
    "Importance alone does not decide Error versus Fatal.",
    "Independent assertions should normally continue with Errorf.",
    "A fatal helper must clearly document that it can end the test.",
  ],
  speaking: paragraphs(
    "- A precondition is a result that later test operations require. If creating a database, decoding a fixture, or looking up the subject fails, continuing can hide the original problem behind a panic or a chain of irrelevant mismatches. That boundary is a good use of `t.Fatal` or `t.Fatalf`.",
    "- Once the subject exists, choose based on independence. A user's name, role, and active flag may be checked separately with Errorf. A wrong name does not prevent reading the other fields, so stopping would throw away useful information.",
    "- For example, the test first looks up a user. Absence is fatal because the next lines need a non-nil pointer. The two field comparisons then use Errorf, allowing one run to describe every incorrect field on that user.",
    "- Fatal is not an emphasis marker and should not replace every assertion. It also changes helper control flow: a helper calling Fatal never returns normally on failure, so its name and contract should make that clear. A useful test has a small number of gateway checks followed by independent observations, which keeps the failure report close to the real cause."
  ),
  overviewTitle: "Gateways before observations",
  overview: "Most tests can be read as a short pipeline: arrange a usable subject, act on it, then observe outcomes. Failures in the first two stages may block everything that follows; failures in separate observations usually do not. Marking those gateways makes control flow predictable.",
  deepTitle: "Prevent cascades without hiding evidence",
  deep: paragraphs(
    "A cascade begins when one failed operation invalidates later assumptions. If a fixture cannot be decoded, comparing fields of a zero value may report five failures that are all consequences of the one decode error. Stopping at the decode preserves the causal signal.",
    "A panic is an even clearer boundary. Looking up a pointer and then dereferencing it after an unsuccessful check can crash the test goroutine. Test code should validate the pointer or status and terminate that case before the unsafe operation.",
    "Not every early mismatch is a precondition. If a response contains an unexpected status but its headers and body are still meaningful parts of the contract, Errorf may reveal several independent defects. The test author decides from data dependency, not from an arbitrary ranking of assertions.",
    "Subtests narrow the stopping scope. Fatal inside one child ends that child, while the parent may continue to the next table row. This is another reason to give cases separate `t.Run` boundaries: a bad setup for one input does not discard evidence from all inputs.",
    "Helper APIs should distinguish acquisition from checking. A `mustUser` helper may call Fatal and return a guaranteed non-nil value; an `assertUser` helper should report mismatches and return so the caller can continue. Clear names prevent surprising control flow and keep the gateway visible to readers."
  ),
  visualType: "flow_diagram",
  visualTitle: "A test with one gateway and several observations",
  visual: "```mermaid\nflowchart LR\n  A[Arrange subject] --> B{Usable?}\n  B -- No --> C[Fatal: stop this case]\n  B -- Yes --> D[Observe field A]\n  D --> E[Observe field B]\n  E --> F[Observe field C]\n  D -. independent errors .-> G[Failed result]\n  E -. independent errors .-> G\n  F -. independent errors .-> G\n```",
  codeTitle: "Require the object, then compare its fields",
  files: {
    "user.go": go(
      "package lesson",
      "",
      "type User struct {",
      "\tName   string",
      "\tActive bool",
      "}",
      "",
      "func FindUser(users map[int]User, id int) (*User, bool) {",
      "\tuser, ok := users[id]",
      "\tif !ok {",
      "\t\treturn nil, false",
      "\t}",
      "\treturn &user, true",
      "}"
    ),
    "user_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestFindUser(t *testing.T) {",
      "\tusers := map[int]User{7: {Name: \"Mina\", Active: true}}",
      "\tgot, ok := FindUser(users, 7)",
      "\tif !ok {",
      "\t\tt.Fatal(\"user 7 was not found\")",
      "\t}",
      "\tif got.Name != \"Mina\" {",
      "\t\tt.Errorf(\"Name = %q; want Mina\", got.Name)",
      "\t}",
      "\tif !got.Active {",
      "\t\tt.Error(\"Active = false; want true\")",
      "\t}",
      "}"
    ),
  },
  commands: ["go test ./..."],
  codeNote: "After the lookup gateway, `got` is safe to dereference. The remaining checks do not depend on one another.",
  followups: [
    "Why is assertion importance the wrong rule for choosing Fatal?",
    "How does a subtest limit the effect of Fatal?",
    "What naming would make a fatal test helper's contract clear?",
  ],
});

add({
  topicSlug: "t-error-vs-t-fatal",
  question: "Why must `t.Fatal` not be called from a spawned goroutine?",
  title: "Keeping fatal test control in the test goroutine",
  direct: "`FailNow`, and therefore `t.Fatal` and `t.Fatalf`, must be called from the goroutine running the test or benchmark function. It exits only that calling goroutine and does not stop other goroutines. Worker goroutines should return errors or results through normal synchronization; the test goroutine waits for them and performs any Fatal call itself.",
  quick: [
    "FailNow-based methods must run in the test's own goroutine.",
    "Fatal exits the calling goroutine, not every goroutine started by the test.",
    "A worker should send an error or return a result to the test goroutine.",
    "Wait for workers before allowing the test to finish.",
    "Error and Log reporting may be called concurrently, but shared data still needs synchronization.",
  ],
  speaking: paragraphs(
    "- The testing contract requires `FailNow`, `Fatal`, `Fatalf`, `SkipNow`, and similar control-flow methods to be called from the goroutine that runs the test function. Fatal works by calling `runtime.Goexit` in its caller. If a worker calls it, only that worker exits, while the main test goroutine may continue with incomplete state.",
    "- A test also does not automatically wait for arbitrary workers. The test function must coordinate completion with channels, a WaitGroup, or another explicit mechanism. Otherwise a worker may report after the test has returned or may be left running into a later test.",
    "- For example, each worker validates one value and sends a result to a buffered channel. The test goroutine reads every result and decides whether to call Fatal or Error. The workers know nothing about `testing.T`, so the production-like concurrent operation is easy to reuse and its lifecycle is explicit.",
    "- Error-style reporting methods are documented as callable from other goroutines, but passing T everywhere often couples application workers to the test framework and still does not solve completion or shared-state safety. Returning ordinary errors is the cleaner default. Reserve test control for the goroutine that owns the test and make it the single place that translates worker outcomes into assertions."
  ),
  overviewTitle: "A worker produces evidence; the test owns control",
  overview: "Concurrent code and test control have different responsibilities. Workers compute values or errors. The test goroutine joins those workers, interprets their evidence, and changes test state. A channel makes that ownership boundary visible.",
  deepTitle: "Trace what Goexit can and cannot stop",
  deep: paragraphs(
    "FailNow invokes Goexit in the current goroutine after marking the test failed. Goexit runs that goroutine's deferred calls, but it cannot unwind the stack of another goroutine. There is no implicit broadcast that cancels workers or releases resources they own.",
    "This makes a worker Fatal structurally wrong even if a simple run appears to fail. The main test may pass the point where it expected a result, block forever, or return while other work remains. Behaviour then depends on scheduling rather than the test's intended sequence.",
    "Send a value that describes the outcome instead. A buffered channel sized to the number of workers avoids a sender being stranded when the receiver has already found a fatal condition. Alternatively, collect results under a WaitGroup and inspect them after Wait. The exact primitive depends on whether results stream or form one batch.",
    "If the test must stop workers after the first error, provide cancellation explicitly, commonly through a context. The test can cancel, continue draining or join the workers, and only then call Fatal. This prevents goroutine leaks while preserving a clear first failure.",
    "Concurrent calls to Errorf are allowed, but any state used to construct the message must itself be safe. The simplest pattern remains ordinary error propagation: concurrent logic follows production contracts, and the surrounding test alone uses the testing API to report the final result."
  ),
  visualType: "sequence_diagram",
  visualTitle: "Return worker errors to the test owner",
  visual: "```mermaid\nsequenceDiagram\n  participant T as Test goroutine\n  participant W1 as Worker 1\n  participant W2 as Worker 2\n  T->>W1: start value A\n  T->>W2: start value B\n  W1-->>T: ordinary error/result\n  W2-->>T: ordinary error/result\n  T->>T: join all workers\n  T->>T: Error or Fatal if needed\n```",
  codeTitle: "Workers return errors; the test reports them",
  files: {
    "validate.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"sync\"",
      ")",
      "",
      "func ValidateAll(values []int) []error {",
      "\terrs := make(chan error, len(values))",
      "\tvar wg sync.WaitGroup",
      "\tfor _, value := range values {",
      "\t\tvalue := value",
      "\t\twg.Go(func() {",
      "\t\t\tif value < 0 {",
      "\t\t\t\terrs <- fmt.Errorf(\"negative value %d\", value)",
      "\t\t\t}",
      "\t\t})",
      "\t}",
      "\twg.Wait()",
      "\tclose(errs)",
      "\tvar result []error",
      "\tfor err := range errs {",
      "\t\tresult = append(result, err)",
      "\t}",
      "\treturn result",
      "}"
    ),
    "validate_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestValidateAll(t *testing.T) {",
      "\terrs := ValidateAll([]int{2, -1, 4})",
      "\tif len(errs) != 1 {",
      "\t\tt.Fatalf(\"got %d errors; want 1\", len(errs))",
      "\t}",
      "\tif got := errs[0].Error(); got != \"negative value -1\" {",
      "\t\tt.Errorf(\"error = %q; want negative value -1\", got)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./..."],
  codeNote: "The concurrent function returns ordinary errors only after joining its workers. The test goroutine owns every testing method call.",
  followups: [
    "Does Fatal cancel goroutines started by a test?",
    "Which testing methods are allowed from worker goroutines?",
    "How would a test cancel and join workers after the first error?",
  ],
});

add({
  topicSlug: "table-driven-tests",
  question: "What is a table-driven test in Go?",
  title: "One behaviour check applied to a table of cases",
  direct: "A table-driven test stores inputs, expected outputs, and usually a descriptive name in a slice or map of case structs, then applies one shared test body to every row. It is useful when many examples exercise the same contract. Keep each row self-contained, make expected values explicit, and split cases when their setup or assertions no longer share one clear shape.",
  quick: [
    "A case table separates test data from one shared test procedure.",
    "Each row normally contains a name, inputs, and expected outcome.",
    "Use explicit expected values rather than reimplementing the algorithm.",
    "Add boundary and error rows that belong to the same contract.",
    "Do not force unrelated behaviours into one oversized table.",
  ],
  speaking: paragraphs(
    "- A table-driven test represents several examples as data and runs the same arrange, act, and assert logic for each one. The table is commonly a slice of anonymous structs with fields such as `name`, input values, expected value, and whether an error is expected.",
    "- This pattern removes copied test functions while making coverage of normal, boundary, and invalid inputs easy to scan. Adding a case usually means adding one row rather than duplicating setup and assertions. Explicit case names also document why each input matters.",
    "- For example, the table checks `Clamp` with a value below the range, inside it, and above it. Every row contains the complete expected result. The loop calls the real function once and compares that result with the row's `want` value.",
    "- A table is not automatically better. If cases need different dependencies, different operations, or unrelated assertion logic, a single loop becomes a switch-filled mini-framework. Use a table when the contract is truly shared; otherwise write separate tests or smaller tables. Also avoid calculating `want` with the same logic as production, because duplicated mistakes can make a false test pass."
  ),
  overviewTitle: "Rows are examples; the loop is the contract",
  overview: "The most readable tables have a stable column meaning and a short loop. A reader should understand a new row without tracing conditional setup. When the row schema starts encoding a program, the cases no longer belong to one table.",
  deepTitle: "Design the table from behaviour boundaries",
  deep: paragraphs(
    "Begin with the function's observable contract. For Clamp, the three meaningful regions are below minimum, within range, and above maximum. Those regions become rows because they share the same operation and equality assertion.",
    "Names should describe behaviour, not positions such as `case1`. A failure path like `TestClamp/below_minimum` communicates both the function and the boundary. Stable names also make command-line selection and CI history more useful.",
    "Expected values belong in the table when they are simple enough to review. Calling another clamp implementation to fill `want` repeats the logic and weakens independence. For complex output, use a small literal, a focused property, or a trusted fixture rather than a second copy of the algorithm.",
    "Error cases can fit the same table when their shape is uniform, often through `wantErr bool` or a specific error identity. Do not reduce all errors to a boolean if the error category or returned partial value is part of the contract.",
    "As a table grows, separate orthogonal concerns. Parsing valid syntax, rejecting malformed syntax, and handling an external timeout may deserve distinct test functions even if they call one API. The goal is a compact specification, not the fewest possible test functions."
  ),
  visualType: "flow_diagram",
  visualTitle: "How the shared test body consumes each row",
  visual: "```mermaid\nflowchart LR\n  A[Case table] --> B[Select one row]\n  B --> C[Call production function with row input]\n  C --> D[Compare result with row expectation]\n  D --> E{More rows?}\n  E -- Yes --> B\n  E -- No --> F[Combined test result]\n```",
  codeTitle: "Three behavioural regions in one table",
  files: {
    "clamp.go": go(
      "package lesson",
      "",
      "func Clamp(value, minimum, maximum int) int {",
      "\tif value < minimum {",
      "\t\treturn minimum",
      "\t}",
      "\tif value > maximum {",
      "\t\treturn maximum",
      "\t}",
      "\treturn value",
      "}"
    ),
    "clamp_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestClamp(t *testing.T) {",
      "\ttests := []struct {",
      "\t\tname  string",
      "\t\tvalue int",
      "\t\twant  int",
      "\t}{",
      "\t\t{name: \"below minimum\", value: -2, want: 0},",
      "\t\t{name: \"inside range\", value: 6, want: 6},",
      "\t\t{name: \"above maximum\", value: 15, want: 10},",
      "\t}",
      "\tfor _, test := range tests {",
      "\t\tgot := Clamp(test.value, 0, 10)",
      "\t\tif got != test.want {",
      "\t\t\tt.Errorf(\"%s: got %d; want %d\", test.name, got, test.want)",
      "\t\t}",
      "\t}",
      "}"
    ),
  },
  commands: ["go test ./..."],
  codeNote: "The table names three distinct regions. The loop contains no condition that duplicates the implementation's clamp decisions.",
  followups: [
    "When does a table-driven test become harder to read than separate tests?",
    "Why should expected values not be computed with copied production logic?",
    "How would you represent several meaningful error categories in a table?",
  ],
});

add({
  topicSlug: "table-driven-tests",
  question: "How do named subtests with `t.Run` improve a test table?",
  title: "Named isolation and precise selection with `t.Run`",
  direct: "Wrap each table row in `t.Run(name, func(t *testing.T) {...})` to give it an independent test result, a hierarchical name, its own cleanup scope, and optional parallel execution. A failing row is reported as `TestParent/case_name`, and `go test -run` can select name components. Use stable, descriptive names and keep each subtest self-contained.",
  quick: [
    "`t.Run` creates a child test with its own `*testing.T`.",
    "The full name joins parent and child with a slash.",
    "One child can fail without preventing sibling rows from running.",
    "`-run` matches slash-separated name components as regular expressions.",
    "Each child gets its own cleanup lifecycle and may opt into parallel execution.",
  ],
  speaking: paragraphs(
    "- `t.Run` turns each row of a test table into a real subtest rather than an anonymous loop iteration. The callback receives a fresh `*testing.T`, so a case has its own failure state, logs, temporary resources, and cleanup callbacks.",
    "- Names form a hierarchy such as `TestParseMode/empty_uses_default`. Failure output identifies the exact row, and `go test -run` can filter the parent and child components. The patterns are regular expressions and are not implicitly anchored, so precise automation may use anchors.",
    "- For example, three parsing behaviours receive stable names and run through one shared assertion body. If the unsupported case fails, the normal and default cases still run. A developer can select just that child with a slash-separated run pattern.",
    "- Use names that describe the behavioural reason for the row and avoid values containing accidental slash components unless that hierarchy is intentional. Subtests improve isolation but do not isolate global state automatically. A parent resource remains shared, and parallel children still need safe ownership. The best table keeps each callback small enough that its name plus row data explains the whole case."
  ),
  overviewTitle: "A table becomes a searchable test tree",
  overview: "Without Run, the runner sees one parent and the loop must print case context manually. With Run, every row is a node in the test tree. Reporting, cleanup, selection, and parallel scheduling can then operate at the same behavioural boundary used by the table.",
  deepTitle: "Use hierarchical names as an interface",
  deep: paragraphs(
    "Run blocks until the child returns or calls Parallel. For an ordinary sequential table, that means one case fully completes before the loop begins the next. A Fatal inside the child ends only that child, so remaining rows are not lost.",
    "The child name is sanitised and joined to its parent's name with a slash. Nested Run calls add more components. This structure can express a matrix such as operation, input class, and expected mode without constructing one long flat string.",
    "The `-run` flag splits its regular expression on unbracketed slashes and matches corresponding name components. Because each component is unanchored by default, `-run 'Parse/unsupported'` may match longer names containing those words. Use `^...$` components when exact selection matters.",
    "Resources follow the tree. Cleanup registered on a child runs after that child and its descendants; cleanup registered on a parent waits for the full parent subtree. This permits shared immutable fixtures while keeping row-specific output private.",
    "Names are therefore more than labels. They become paths used in local debugging, CI output, and command-line selection. Keep them deterministic, concise, and tied to behaviour so refactoring input formatting does not needlessly break test tooling."
  ),
  visualType: "decision_tree",
  visualTitle: "A named table becomes a hierarchy",
  visual: "```mermaid\nflowchart TD\n  P[TestParseMode] --> A[explicit_value]\n  P --> B[empty_uses_default]\n  P --> C[unsupported_value]\n  C --> D[Failure belongs to this child]\n```",
  codeTitle: "Give every parsing case its own test identity",
  files: {
    "mode.go": go(
      "package lesson",
      "",
      "import \"fmt\"",
      "",
      "func ParseMode(value string) (string, error) {",
      "\tif value == \"\" {",
      "\t\treturn \"safe\", nil",
      "\t}",
      "\tif value != \"safe\" && value != \"fast\" {",
      "\t\treturn \"\", fmt.Errorf(\"unsupported mode %q\", value)",
      "\t}",
      "\treturn value, nil",
      "}"
    ),
    "mode_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestParseMode(t *testing.T) {",
      "\ttests := []struct {",
      "\t\tname    string",
      "\t\tinput   string",
      "\t\twant    string",
      "\t\twantErr bool",
      "\t}{",
      "\t\t{name: \"explicit value\", input: \"fast\", want: \"fast\"},",
      "\t\t{name: \"empty uses default\", want: \"safe\"},",
      "\t\t{name: \"unsupported value\", input: \"turbo\", wantErr: true},",
      "\t}",
      "\tfor _, test := range tests {",
      "\t\tt.Run(test.name, func(t *testing.T) {",
      "\t\t\tgot, err := ParseMode(test.input)",
      "\t\t\tif (err != nil) != test.wantErr {",
      "\t\t\t\tt.Fatalf(\"error = %v; wantErr %v\", err, test.wantErr)",
      "\t\t\t}",
      "\t\t\tif got != test.want {",
      "\t\t\t\tt.Errorf(\"mode = %q; want %q\", got, test.want)",
      "\t\t\t}",
      "\t\t})",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -v ./...", "go test -run '^TestParseMode$/^unsupported_value$' ./..."],
  codeNote: "Spaces in subtest names are displayed as underscores. The exact run pattern selects one path component under the parent.",
  followups: [
    "Does Fatal in one subtest stop its siblings?",
    "How does `-run` interpret slash-separated subtest names?",
    "When should a parent rather than a child own cleanup?",
  ],
});

add({
  topicSlug: "table-driven-tests",
  question: "How do you run table-driven subtests safely in parallel?",
  title: "Parallel rows with independent inputs and state",
  direct: "Call `t.Parallel()` inside each subtest only when rows do not mutate shared unsynchronised state. Current Go gives each range iteration its own variables for modules using Go 1.22 or later; older language versions need an explicit loop-variable capture. Regardless of version, copy mutable fixtures, avoid process-global helpers such as `t.Setenv`, and run the suite with `-race`.",
  quick: [
    "`t.Parallel` pauses a subtest and later schedules it with other parallel tests.",
    "Every row must own its mutable inputs and outputs or synchronize access.",
    "Go 1.22+ loop iterations have distinct iteration variables.",
    "Older language versions need an explicit per-iteration capture.",
    "Do not use Setenv or Chdir in a parallel test or parallel ancestor.",
    "Use `go test -race` to exercise the parallel suite under the race detector.",
  ],
  speaking: paragraphs(
    "- Calling `t.Parallel()` marks the current subtest for parallel execution. The child first pauses; after the surrounding sequential work is ready, the runner schedules it with other parallel tests, subject to the `-parallel` limit. A parent does not complete until all of its children complete.",
    "- Parallel rows need independent state. Immutable scalar fields are simple, but slices, maps, files, package globals, mocks with mutable counters, and shared servers require separate instances or synchronization. Test parallelism does not make production code safe and can expose assumptions about order.",
    "- Since Go 1.22 language semantics, each range iteration has its own iteration variables, so current modules do not need the old `test := test` workaround merely to capture a row. Code maintained for an older module language version may still include that assignment, and it remains a clear portability signal.",
    "- For example, each subtest receives a value and expects a pure result, so no mutable state is shared. The suite passes under `-race`. Parallel tests cannot use `t.Setenv` or `t.Chdir` because those change process-wide state. Use parallelism where cases are genuinely isolated, not as a default annotation on every table."
  ),
  overviewTitle: "Parallel is a scheduling contract, not isolation",
  overview: "The test runner can overlap subtests, but it cannot clone package globals, process environment, or referenced maps. Isolation comes from data ownership and synchronization. Parallel merely changes when independent work may proceed.",
  deepTitle: "Audit captures, aliases, and global effects",
  deep: paragraphs(
    "A parallel child returns control to its parent at the Parallel call and resumes later. The loop may have advanced or the parent callback may have returned by then. This scheduling is why historical loop-variable capture bugs were especially visible in parallel tables.",
    "Modules declaring Go 1.22 or later use per-iteration variables for for loops. Each closure sees the value from its own iteration. Modules compiled with older language semantics retain the earlier reuse rule, so an explicit shadow assignment remains necessary there. Check the module's `go` directive when maintaining old code.",
    "Variable capture is only one aliasing problem. Copying a table row that contains a map still copies the map header, not its backing storage. Two rows that mutate the same referenced map race even though the row structs themselves are distinct. Build a fixture inside each child or deep-copy the mutable portion.",
    "Process-global operations cannot be isolated by row. Environment changes and working-directory changes are rejected in parallel tests because other goroutines observe the same process. Fixed ports, global default clients, and package-level caches need the same design scrutiny even if the testing package cannot forbid them automatically.",
    "Use the race detector as a dynamic check, then run with shuffling or repeated counts when order assumptions are suspected. A clean run only covers executed paths, so the primary proof remains visible ownership: one row, one mutable fixture, and no hidden global transition."
  ),
  visualType: "flow_diagram",
  visualTitle: "Parallel subtest scheduling",
  visual: "```mermaid\nsequenceDiagram\n  participant P as Parent loop\n  participant A as Subtest A\n  participant B as Subtest B\n  P->>A: t.Run\n  A->>A: t.Parallel; pause\n  A-->>P: parent continues\n  P->>B: t.Run\n  B->>B: t.Parallel; pause\n  B-->>P: parent returns\n  par independent execution\n    A->>A: assert own row\n    B->>B: assert own row\n  end\n```",
  codeTitle: "Parallel cases with value-only inputs",
  files: {
    "square.go": go(
      "package lesson",
      "",
      "func Square(value int) int {",
      "\treturn value * value",
      "}"
    ),
    "square_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestSquare(t *testing.T) {",
      "\ttests := []struct {",
      "\t\tname        string",
      "\t\tvalue, want int",
      "\t}{",
      "\t\t{name: \"zero\", value: 0, want: 0},",
      "\t\t{name: \"positive\", value: 7, want: 49},",
      "\t}",
      "\tfor _, test := range tests {",
      "\t\tt.Run(test.name, func(t *testing.T) {",
      "\t\t\tt.Parallel()",
      "\t\t\tif got := Square(test.value); got != test.want {",
      "\t\t\t\tt.Errorf(\"got %d; want %d\", got, test.want)",
      "\t\t\t}",
      "\t\t})",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -race ./..."],
  codeNote: "Each row contains immutable values and the function is pure. No map, slice, environment variable, or output buffer is shared.",
  followups: [
    "What changed about loop variables in Go 1.22?",
    "Why can distinct row structs still share one map?",
    "What does the `-parallel` flag limit?",
  ],
});

add({
  topicSlug: "running-tests",
  question: "What are the essential `go test` commands for a Go project?",
  title: "Running a package, a module, or one named test",
  direct: "Use `go test` for the current package and `go test ./...` for all packages beneath the current module directory. Add `-v` for named test and log output, `-run` with a regular expression to select tests and subtests, and `-list` to list top-level matches without running them. Run commands from the module or intended package boundary.",
  quick: [
    "`go test` tests the package in the current directory.",
    "`go test ./...` tests packages recursively under the current module path.",
    "`-v` prints each test name and successful-test logs.",
    "`-run` selects test and subtest names with slash-separated regular expressions.",
    "`-list` lists matching top-level tests, benchmarks, fuzz tests, and examples without running them.",
  ],
  speaking: paragraphs(
    "- `go test` is both a build and execution command. With no package argument it tests the package in the current directory. `go test ./...` expands to the packages below the current directory, so it is the usual module-wide check when run at the module root.",
    "- `-v` makes the runner print test and subtest names and shows Log output for successful tests. `-run` accepts a regular expression for names. A slash in the expression selects successive subtest components, which makes a named table row easy to reproduce. `-list` reports top-level matches and does not execute them.",
    "- For example, `go test ./...` builds and tests the small package. The exact pattern `^TestPrice$/^member_discount$` runs one child under one parent, while `-list '^Test'` confirms which top-level tests exist.",
    "- Package scope matters. `./...` means packages under the directory where the command is evaluated; it is not a universal synonym for every module in a repository. Test flags generally belong before package arguments for clarity, and arguments after `-args` go directly to the generated test binary. Start with a repeatable module-wide command, then narrow with names only while diagnosing a specific case."
  ),
  overviewTitle: "Choose package scope before test scope",
  overview: "The command has two independent selections: package patterns decide which test binaries are built, and test-name flags decide which entries run inside each binary. A perfect `-run` expression cannot select a test from a package that the package pattern omitted.",
  deepTitle: "Trace command expansion and binary execution",
  deep: paragraphs(
    "When the command receives a package pattern, the go tool resolves that pattern first. A literal package, `.`, or `./...` creates one test action per matching package. Packages without test files may still be compiled and reported with a no-test-files result.",
    "For every selected package, test source is compiled into a test binary. The testing flags are then interpreted by that binary. A build or vet failure happens before name filtering, which is why broken test code outside the chosen `-run` name still blocks the package.",
    "Verbose mode changes reporting, not assertions. It displays run, pass, fail, and skip lines and includes logs from successful tests; failure logs are available regardless. This is useful for local diagnosis but should not be required for a test to behave correctly.",
    "A run expression is unanchored unless anchors are written. `-run User` can match `TestUserStore` and `TestCurrentUser`; `-run '^TestUserStore$'` selects the exact top-level name. Subtest patterns are split on unbracketed slashes and applied component by component.",
    "Listing is a discovery tool. `-list` matches only top-level names and prints them without executing tests, benchmarks, or examples. It cannot enumerate all dynamically created subtests because those names exist only after their parent code runs."
  ),
  visualType: "flow_diagram",
  visualTitle: "The two filters in a go test command",
  visual: "```mermaid\nflowchart LR\n  A[go test package patterns] --> B[Resolve packages]\n  B --> C[Build one test binary per package]\n  C --> D[-run selects names inside each binary]\n  D --> E[Execute tests and subtests]\n  E --> F[Report package result]\n```",
  codeTitle: "Run the suite or select one named row",
  files: {
    "price.go": go(
      "package lesson",
      "",
      "func Price(cents int, member bool) int {",
      "\tif member {",
      "\t\treturn cents * 90 / 100",
      "\t}",
      "\treturn cents",
      "}"
    ),
    "price_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestPrice(t *testing.T) {",
      "\tt.Run(\"regular price\", func(t *testing.T) {",
      "\t\tif got := Price(1000, false); got != 1000 {",
      "\t\t\tt.Fatalf(\"got %d; want 1000\", got)",
      "\t\t}",
      "\t})",
      "\tt.Run(\"member discount\", func(t *testing.T) {",
      "\t\tif got := Price(1000, true); got != 900 {",
      "\t\t\tt.Fatalf(\"got %d; want 900\", got)",
      "\t\t}",
      "\t})",
      "}"
    ),
  },
  commands: [
    "go test ./...",
    "go test -v -run '^TestPrice$/^member_discount$' ./...",
    "go test -list '^Test' ./...",
  ],
  codeNote: "The first command chooses the package set. The second then selects one hierarchical test name inside that set.",
  followups: [
    "Why can unselected test code still cause a compilation failure?",
    "Does `-list` discover dynamically named subtests?",
    "What does `./...` mean in a repository containing several modules?",
  ],
});

add({
  topicSlug: "running-tests",
  question: "How does Go test caching work, and when should you use `-count=1`?",
  title: "Cached successful package tests and forced reruns",
  direct: "In package-list mode, such as `go test .` or `go test ./...`, Go can reuse a successful test result when the test binary and relevant cache inputs match. It prints `(cached)` instead of executing that package again. Use `-count=1` when diagnosing timing, order, external-state, or flakiness issues that require a fresh execution; do not use it to hide an undeclared dependency.",
  quick: [
    "Only successful package test results are cached.",
    "Explicit package arguments enable package-list mode and eligible caching.",
    "A reused result is displayed with `(cached)`.",
    "`-count=1` is the standard way to disable test-result reuse for that run.",
    "A test should declare inputs instead of depending silently on changing external state.",
  ],
  speaking: paragraphs(
    "- Go caches successful package test results to make repeated test commands fast. This applies in package-list mode, including commands with `.`, a package path, or `./...`. If the test binary and the cacheable inputs observed by the test match a previous successful run, the go command can print `(cached)` and reuse that result.",
    "- The command `go test` with no package arguments uses local-directory mode and disables this test-result caching. Adding `-count=1` is the idiomatic explicit way to force actual execution in either a focused or recursive command.",
    "- A fresh run is useful when investigating nondeterminism, time-sensitive behaviour, external services, filesystem changes outside tracked inputs, or test order. For example, `go test -count=1 ./...` ensures the package binaries run rather than returning an eligible prior success.",
    "- Caching is not a correctness problem for well-isolated tests. If a test reads hidden network or machine state, permanently disabling the cache only treats the symptom. Prefer temporary files, injected clocks and configuration, explicit fixtures, and deterministic inputs. Use `-count=N` deliberately when repeated executions themselves provide evidence, and interpret a cached result as a previous result for the same known action—not proof about undeclared outside state."
  ),
  overviewTitle: "The cache remembers a package test action",
  overview: "Go caches at the package-test level, not as a memo table for individual Test functions. If an action is reusable, the package result returns together. A forced count schedules new executions of the package test binary.",
  deepTitle: "Know what freshness can and cannot prove",
  deep: paragraphs(
    "The cache stores only successful results. A failure is not a stable success to reuse, so the next invocation executes again. The go command includes the test executable and recognised inputs and flags in its cache decision; flags outside the cacheable set cause a fresh run.",
    "Package-list mode is important. `go test .` names the current package explicitly and can show `(cached)`, while plain `go test` uses the special local-directory mode with caching disabled. Both test the current package, but their result-reuse behaviour differs.",
    "`-count=1` sets the requested execution count to one in a way that is not cacheable. Larger counts run each selected test and benchmark multiple times, which can expose order or timing failures but also multiplies suite cost.",
    "Fresh execution does not make a test deterministic. A test that depends on the wall clock, global process state, or a live endpoint may fail differently on every run. Move those inputs behind explicit boundaries so one run has a precise meaning and the cache can remain an optimisation rather than a source of doubt.",
    "Use the displayed package line as evidence. `(cached)` says the binary was not executed for this command; an elapsed time says it was. When debugging, record the exact package pattern and flags because `go test`, `go test .`, and `go test ./...` can reach the same source through different execution modes."
  ),
  visualType: "decision_tree",
  visualTitle: "Whether a package result can be reused",
  visual: "```mermaid\nflowchart TD\n  A[Package-list test action] --> B{Previous success with matching cache key?}\n  B -- No --> C[Build or run test binary]\n  B -- Yes --> D{Forced fresh with -count=1?}\n  D -- No --> E[Return cached result]\n  D -- Yes --> C\n  C --> F[Store successful eligible result]\n```",
  codeTitle: "The same deterministic test under cached and fresh commands",
  files: {
    "sum.go": go(
      "package lesson",
      "",
      "func Sum(values []int) int {",
      "\ttotal := 0",
      "\tfor _, value := range values {",
      "\t\ttotal += value",
      "\t}",
      "\treturn total",
      "}"
    ),
    "sum_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestSum(t *testing.T) {",
      "\tif got := Sum([]int{2, 3, 5}); got != 10 {",
      "\t\tt.Fatalf(\"Sum = %d; want 10\", got)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test .", "go test .", "go test -count=1 ."],
  codeNote: "The second eligible package-list command may report `(cached)`. The final command schedules a fresh execution without changing the deterministic test design.",
  followups: [
    "Why can `go test` and `go test .` differ in cache behaviour?",
    "Are failed test results reused from the test cache?",
    "What design changes make a test safely cacheable?",
  ],
});

add({
  topicSlug: "running-tests",
  question: "How do `-race`, `-shuffle`, `-short`, and `-timeout` help diagnose a Go test suite?",
  title: "Race checks, order checks, suite modes, and a time bound",
  direct: "`-race` instruments supported builds to detect executed data races. `-shuffle=on` randomises test and benchmark order and prints a seed; reuse that integer to reproduce the order. `-short` only sets a flag that tests inspect with `testing.Short()`. `-timeout` panics the test binary after the limit. These flags expose different risks and should complement deterministic, isolated tests.",
  quick: [
    "`-race` reports races that occur on paths exercised during the run.",
    "`-shuffle=on` randomises order and prints a reproducible seed.",
    "`-short` has an effect only when tests call `testing.Short()`.",
    "`-timeout` sets a package test-binary time limit; the default is 10 minutes.",
    "`-count=1` is useful with diagnostic runs so caching does not skip execution.",
  ],
  speaking: paragraphs(
    "- These flags test different properties. `-race` builds with the race detector and reports conflicting memory accesses that actually happen during the run. A clean result is valuable evidence but cannot prove an unexecuted concurrent path is race-free.",
    "- `-shuffle=on` changes the execution order of tests and benchmarks and prints the chosen seed. If a failure appears, passing that integer to `-shuffle` reproduces the order. This reveals accidental dependence on another test's global state or cleanup.",
    "- `-short` is only a signal. A test must check `testing.Short()` and skip or reduce expensive work itself. `-timeout` sets an upper bound for a package test binary; when reached, the runner panics and prints goroutine state, which helps locate a deadlock or leak but is not a substitute for operation-level timeouts.",
    "- For example, the suite has parallel work that shares state safely through a mutex and a broader check that honours short mode. Useful diagnostic runs combine a forced fresh execution with one targeted concern, such as `go test -race -count=1 ./...` or `go test -shuffle=on -count=1 ./...`. Fix the ownership or isolation issue the flag exposes rather than relying on the flag as runtime protection."
  ),
  overviewTitle: "Each flag perturbs one dimension",
  overview: "Race instrumentation changes memory-access observation, shuffle changes order, short changes a test-controlled mode, and timeout changes the execution bound. Combining them can be useful, but interpreting a failure begins by identifying which dimension was altered.",
  deepTitle: "Use diagnostic flags as experiments",
  deep: paragraphs(
    "The race detector adds instrumentation and runtime overhead. It finds races only when the conflicting accesses occur, so realistic workload and branch coverage matter. Supported platforms can run package tests with `-race`; the report includes stack traces for the conflicting accesses.",
    "Shuffle targets hidden ordering contracts. The default is off. `on` chooses a random seed and prints it; a specific integer requests that ordering again. Test names and dependencies should still be deterministic—the randomisation is in scheduling order, not input generation.",
    "Short mode is cooperative. The testing package exposes a boolean through `testing.Short()`, but it never decides which test is expensive. A test may skip an external integration or reduce a dataset while keeping a meaningful fast contract. The normal suite should document what short mode omits.",
    "The timeout applies to each generated test binary, which roughly means each package action. Its default is ten minutes and zero disables it. A timeout failure is a last-resort diagnostic with goroutine stacks; code should still use contexts and deadlines at I/O or concurrency boundaries so a single operation fails clearly.",
    "Disable result reuse during these experiments with `-count=1`, otherwise a prior eligible success may satisfy a package action. Preserve the shuffle seed and exact flags in a bug report, then reduce the failure to a deterministic test whenever possible."
  ),
  visualType: "comparison_table",
  visualTitle: "Four flags, four questions",
  visual: "| Flag | Question it probes | Important limit |\n|---|---|---|\n| `-race` | Did executed code race? | Unexecuted paths are unknown |\n| `-shuffle=N` | Does order affect the suite? | Seed reproduces order, not timing |\n| `-short` | Can expensive checks be omitted? | Tests must inspect the flag |\n| `-timeout=30s` | Did this package test binary finish? | Not an operation-level deadline |",
  codeTitle: "A suite that honours short mode and safe parallel state",
  files: {
    "counter.go": go(
      "package lesson",
      "",
      "import \"sync\"",
      "",
      "type Counter struct {",
      "\tmu    sync.Mutex",
      "\tvalue int",
      "}",
      "",
      "func (c *Counter) Add(delta int) {",
      "\tc.mu.Lock()",
      "\tdefer c.mu.Unlock()",
      "\tc.value += delta",
      "}",
      "",
      "func (c *Counter) Value() int {",
      "\tc.mu.Lock()",
      "\tdefer c.mu.Unlock()",
      "\treturn c.value",
      "}"
    ),
    "counter_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"sync\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestCounterConcurrent(t *testing.T) {",
      "\tvar counter Counter",
      "\tvar wg sync.WaitGroup",
      "\tfor range 10 {",
      "\t\twg.Go(func() { counter.Add(1) })",
      "\t}",
      "\twg.Wait()",
      "\tif got := counter.Value(); got != 10 {",
      "\t\tt.Fatalf(\"Value = %d; want 10\", got)",
      "\t}",
      "}",
      "",
      "func TestBroaderCases(t *testing.T) {",
      "\tif testing.Short() {",
      "\t\tt.Skip(\"broader cases omitted in short mode\")",
      "\t}",
      "\tfor delta := -100; delta <= 100; delta++ {",
      "\t\tvar counter Counter",
      "\t\tcounter.Add(delta)",
      "\t\tif got := counter.Value(); got != delta {",
      "\t\t\tt.Fatalf(\"delta %d: got %d\", delta, got)",
      "\t\t}",
      "\t}",
      "}"
    ),
  },
  commands: [
    "go test -race -count=1 ./...",
    "go test -shuffle=42 -count=1 ./...",
    "go test -short -timeout=30s -count=1 ./...",
  ],
  codeNote: "The race run exercises real concurrent access, while the short-mode branch explicitly states which broader work it omits.",
  followups: [
    "Why is a clean race-detector run not a proof of race freedom?",
    "How do you reproduce an order found by `-shuffle=on`?",
    "What happens if no test checks `testing.Short()`?",
  ],
});

add({
  topicSlug: "test-coverage",
  question: "What does Go test coverage measure, and what does it not prove?",
  title: "Statement execution is a map, not a quality score",
  direct: "Go coverage instruments source blocks and reports the percentage of statements executed by the selected tests. It helps locate code that was never exercised, but it does not prove assertions are correct, edge cases are covered, concurrency is safe, or every boolean branch was tested. Read the uncovered lines and the behaviour contract instead of chasing a percentage alone.",
  quick: [
    "`go test -cover` reports statement coverage for the selected package tests.",
    "Coverage shows which instrumented code executed, not whether assertions were strong.",
    "A high percentage can still miss boundary values and failure modes.",
    "Go's basic metric is not exact boolean-branch or path coverage.",
    "Use uncovered regions to ask which behaviour is untested.",
  ],
  speaking: paragraphs(
    "- Go's built-in coverage works by instrumenting source code and recording which statement blocks execute while tests run. `go test -cover` prints a percentage for each selected package. The number is useful as a map of exercised implementation, especially for finding an error path or new function no test reached.",
    "- Execution is not verification. A test can call a function, make no assertion, and still increase coverage. One execution of a compound condition may also cover its statement block without demonstrating every truth combination, and coverage says nothing by itself about data races, realistic integration, or the quality of expected values.",
    "- For example, tests reach the empty and ordinary branches of `Label`, while the negative-value branch remains uncovered. The report points to that gap, but a new test should be justified as a behavioural requirement rather than added only to increase the total.",
    "- I read coverage beside the contract: normal result, boundaries, failures, and important interactions. A lower percentage around generated glue may be acceptable, while an uncovered authentication denial or money calculation is significant. Coverage is an observation tool and regression signal; correctness still comes from precise tests, reviews, race checks, and appropriate integration evidence."
  ),
  overviewTitle: "Executed, asserted, and trusted are different states",
  overview: "Coverage can answer the first question—did this instrumented statement execute? It cannot answer whether the test noticed a wrong result or whether the chosen inputs represent the requirement. Strong suites connect all three states deliberately.",
  deepTitle: "Interpret the instrumented source rather than one percentage",
  deep: paragraphs(
    "The cover tool rewrites or instruments the package so counters are associated with source regions. After the test binary runs, it combines executed counts with the number of statements represented by each region. The result is statement coverage weighted by statement count.",
    "Because a source region can contain control expressions with several paths, this is not a full branch-coverage model. A short-circuit condition might execute the enclosing statement without exercising both operands in every combination. Path explosion is not represented by one percentage.",
    "Assertions are invisible to the metric. A smoke test that calls `Label(2)` and discards the return can cover production code without protecting behaviour. Mutation testing, careful expected values, or temporarily introducing a fault can reveal whether an assertion would actually detect a regression.",
    "Risk is also uneven. Error handling, permissions, migrations, cancellation, and concurrency may occupy few statements but carry major consequences. A review should inspect those behaviours even if broad happy-path code dominates the percentage.",
    "Use trends thoughtfully. A drop can signal an untested addition, but a target that rewards line execution alone encourages shallow tests. Pair the report with named requirements and select new cases because they distinguish meaningful outcomes, not because they colour one more line green."
  ),
  visualType: "concept_map",
  visualTitle: "What the coverage signal includes and omits",
  visual: "```mermaid\nflowchart LR\n  T[Selected tests] --> I[Instrumented statements executed]\n  I --> P[Coverage percentage and profile]\n  P --> Q[Locate unexercised regions]\n  P -. does not prove .-> A[Correct assertions]\n  P -. does not prove .-> B[All branches and edge cases]\n  P -. does not prove .-> C[Race freedom or production realism]\n```",
  codeTitle: "A report with one intentional behavioural gap",
  files: {
    "label.go": go(
      "package lesson",
      "",
      "func Label(value int) string {",
      "\tif value < 0 {",
      "\t\treturn \"negative\"",
      "\t}",
      "\tif value == 0 {",
      "\t\treturn \"zero\"",
      "\t}",
      "\treturn \"positive\"",
      "}"
    ),
    "label_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestLabel(t *testing.T) {",
      "\tif got := Label(0); got != \"zero\" {",
      "\t\tt.Errorf(\"Label(0) = %q; want zero\", got)",
      "\t}",
      "\tif got := Label(2); got != \"positive\" {",
      "\t\tt.Errorf(\"Label(2) = %q; want positive\", got)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test -cover ./..."],
  codeNote: "The command reveals that some statements were not executed. It cannot decide whether the missing negative case matters to the product contract.",
  followups: [
    "Can a test raise coverage without checking any result?",
    "Why is statement coverage different from complete branch coverage?",
    "Which low-volume code paths may deserve disproportionate test attention?",
  ],
});

add({
  topicSlug: "test-coverage",
  question: "How do you create and inspect a Go coverage profile?",
  title: "From `-coverprofile` to per-function and HTML views",
  direct: "Run `go test -coverprofile=coverage.out ./...` to execute tests and write a coverage profile; the flag also enables coverage. Inspect totals and per-function values with `go tool cover -func=coverage.out`, or generate an annotated browser view with `go tool cover -html=coverage.out`. Keep the profile as generated output and use it to locate meaningful untested behaviour.",
  quick: [
    "`-coverprofile=file` runs tests and writes coverage data.",
    "Specifying a coverage profile enables coverage automatically.",
    "`go tool cover -func=file` reports per-function data and a total.",
    "`go tool cover -html=file` creates or opens annotated source output.",
    "A profile is generated evidence, not source content to edit by hand.",
  ],
  speaking: paragraphs(
    "- A coverage percentage is useful for a quick check, while a profile preserves the source regions and counts needed for inspection. `go test -coverprofile=coverage.out ./...` runs the selected package tests and writes the profile; there is no need to add a separate `-cover` flag.",
    "- `go tool cover -func=coverage.out` gives a text report by function plus a total, which works in terminals and automation. `go tool cover -html=coverage.out` produces annotated source where covered and uncovered regions are visible. An optional output argument can write the HTML file instead of opening a browser.",
    "- For example, the suite fully tests `Abs` but reaches only the found case of `Lookup`. The function report immediately distinguishes them, and the HTML view identifies the unexecuted return path rather than presenting only one module percentage.",
    "- Profiles depend on the selected package set, build tags, platform, cover mode, and tests that actually ran. Do not compare files from different commands as if they measured the same population. Store the command in CI, exclude generated profile files from normal source review unless they are intentional artifacts, and turn each important uncovered region into a precise behavioural case rather than a call made solely for colour."
  ),
  overviewTitle: "A profile connects a number back to source",
  overview: "The terminal percentage compresses an entire test run. A profile retains enough location data for the cover tool to answer where coverage came from. That location—not the headline total—is usually the useful input to review.",
  deepTitle: "Keep the measurement command reproducible",
  deep: paragraphs(
    "A coverage profile starts with its mode and then records source spans, represented statement counts, and execution values. The cover tool reads that format to calculate function summaries or annotate source. Editing it manually breaks its role as generated evidence.",
    "The profile flag implies instrumentation. Adding `-cover` is redundant, though harmless. Package patterns still control scope: a profile from `go test` in one directory does not describe packages elsewhere in a module.",
    "The function report groups instrumented regions by functions and prints a total across the profile. It quickly highlights an untested constructor or error path. The HTML report is better for conditional detail because it overlays execution information directly on source spans.",
    "Different builds may produce different source sets. Build constraints, cgo, operating-system files, and selected packages affect what can be instrumented. Coverage comparisons in CI should therefore use the same command and environment or clearly label their scope.",
    "Profiles are also inputs to tooling, so choose a predictable path such as an ignored build-output directory. A merge gate may track change, but review should ask why an important path lacks a behavioural test rather than requiring every package to hit one universal number."
  ),
  visualType: "flow_diagram",
  visualTitle: "Turning one test run into useful coverage views",
  visual: "```mermaid\nflowchart LR\n  A[go test -coverprofile] --> B[coverage.out]\n  B --> C[go tool cover -func]\n  B --> D[go tool cover -html]\n  C --> E[Find low or missing functions]\n  D --> F[Find exact source regions]\n  E --> G[Add behaviour-driven tests]\n  F --> G\n```",
  codeTitle: "Generate a profile and inspect function-level gaps",
  files: {
    "numbers.go": go(
      "package lesson",
      "",
      "func Abs(value int) int {",
      "\tif value < 0 {",
      "\t\treturn -value",
      "\t}",
      "\treturn value",
      "}",
      "",
      "func Lookup(values map[string]int, key string) (int, bool) {",
      "\tvalue, ok := values[key]",
      "\treturn value, ok",
      "}"
    ),
    "numbers_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestAbs(t *testing.T) {",
      "\tfor input, want := range map[int]int{-4: 4, 0: 0, 3: 3} {",
      "\t\tif got := Abs(input); got != want {",
      "\t\t\tt.Errorf(\"Abs(%d) = %d; want %d\", input, got, want)",
      "\t\t}",
      "\t}",
      "}",
      "",
      "func TestLookupFound(t *testing.T) {",
      "\tvalue, ok := Lookup(map[string]int{\"ready\": 1}, \"ready\")",
      "\tif !ok || value != 1 {",
      "\t\tt.Fatalf(\"Lookup = (%d, %v); want (1, true)\", value, ok)",
      "\t}",
      "}"
    ),
  },
  commands: [
    "go test -coverprofile=coverage.out ./...",
    "go tool cover -func=coverage.out",
    "go tool cover -html=coverage.out -o coverage.html",
  ],
  codeNote: "The text and HTML reports use the same generated profile, so the total, function view, and source view describe one reproducible test action.",
  followups: [
    "Does `-coverprofile` require a separate `-cover` flag?",
    "Why can two profiles from different package patterns not be compared directly?",
    "Which cover view is more useful for locating a missed conditional path?",
  ],
});

add({
  topicSlug: "test-coverage",
  question: "What are `set`, `count`, and `atomic` coverage modes, and when is `-coverpkg` useful?",
  title: "Choosing coverage counters and instrumentation scope",
  direct: "`-covermode=set` records whether each statement ran, `count` records how many times, and `atomic` counts with atomic updates for concurrent execution; `-race` selects atomic coverage automatically. By default, coverage applies to packages under test. `-coverpkg` changes which matching packages are instrumented, which is useful when integration tests exercise code across package boundaries.",
  quick: [
    "`set` records zero or one: whether a region executed.",
    "`count` records execution frequency with ordinary counters.",
    "`atomic` records counts using atomic operations for concurrency safety.",
    "The default mode is `set`, or `atomic` when `-race` is enabled.",
    "`-coverpkg` expands or changes the package pattern being instrumented.",
    "Instrumentation scope and test package selection are separate choices.",
  ],
  speaking: paragraphs(
    "- Coverage mode controls the value stored for an instrumented source region. `set` asks only whether the region executed and is the normal default. `count` keeps the number of executions, which can reveal a hot loop in the profile but uses non-atomic counter updates. `atomic` also counts executions and updates counters atomically.",
    "- When tests are run with the race detector, the default coverage mode becomes atomic so instrumentation does not introduce unsafe counter updates. Atomic mode adds more overhead, so it is chosen when concurrent correctness of the counts matters rather than for every ordinary run.",
    "- Coverage scope is a separate setting. Tests normally report coverage for the package being tested. `-coverpkg` supplies package patterns to instrument, allowing an integration-style test package to record execution in dependencies it calls. For example, `-coverpkg=./...` instruments all packages under the current module subtree selected by that pattern.",
    "- Expanding instrumentation can slow builds and can produce a denominator that includes code the selected tests were never intended to reach. State the test package pattern, cover package pattern, and mode together when publishing a number. Choose set for a simple reachability map, count when execution frequency is informative, and atomic for concurrent counting or race-enabled runs."
  ),
  overviewTitle: "Mode changes counters; coverpkg changes the map",
  overview: "These flags answer orthogonal questions. Cover mode decides what each source-region counter means. Coverpkg decides which packages receive counters. Neither flag chooses the tests themselves; ordinary package arguments still decide which test binaries run.",
  deepTitle: "Avoid mixing execution scope with instrumentation scope",
  deep: paragraphs(
    "Set mode can be represented by assigning one when a region runs. Repeated execution does not change the result, which is sufficient for statement reachability and has lower bookkeeping cost than counting every visit.",
    "Count mode increments an ordinary counter. It distinguishes one visit from many but is not designed to make those increments safe under simultaneous access. Atomic mode uses synchronised increments, preserving counts when instrumented code executes concurrently at additional cost.",
    "Race builds and coverage instrumentation coexist by using atomic mode by default. Explicitly requesting an incompatible mode with race detection is rejected rather than silently allowing the counters themselves to create misleading behaviour.",
    "The tested packages and covered packages can differ. A test in `service` may call `parser`, but a default service coverage run focuses on the package under test. Instrumenting both through coverpkg lets the resulting profile attribute the integration flow across the selected package set.",
    "A broad coverpkg pattern is not automatically more truthful. It changes the denominator and build work, and packages outside the scenario may appear as zero. Use it when the learning question is genuinely cross-package execution, record the full command, and compare only measurements with matching scope."
  ),
  visualType: "comparison_table",
  visualTitle: "Coverage controls at a glance",
  visual: "| Control | Changes | Best use |\n|---|---|---|\n| `-covermode=set` | Executed or not | Fast reachability map |\n| `-covermode=count` | Execution frequency | Sequential count insight |\n| `-covermode=atomic` | Atomic execution frequency | Concurrent or race-enabled run |\n| `-coverpkg=pattern` | Instrumented packages | Cross-package coverage |\n| Package args | Test binaries executed | Test scope |",
  codeTitle: "Run one package through each supported counter mode",
  files: {
    "classify.go": go(
      "package lesson",
      "",
      "func Even(value int) bool {",
      "\treturn value%2 == 0",
      "}"
    ),
    "classify_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestEven(t *testing.T) {",
      "\tfor value, want := range map[int]bool{2: true, 3: false} {",
      "\t\tif got := Even(value); got != want {",
      "\t\t\tt.Errorf(\"Even(%d) = %v; want %v\", value, got, want)",
      "\t\t}",
      "\t}",
      "}"
    ),
  },
  commands: [
    "go test -covermode=set -coverprofile=set.out ./...",
    "go test -covermode=count -coverprofile=count.out ./...",
    "go test -covermode=atomic -coverprofile=atomic.out ./...",
    "go test -coverpkg=./... -coverprofile=all.out ./...",
  ],
  codeNote: "All four commands run the same tests. The first three change counter meaning; the last changes instrumentation scope even though this example contains only one package.",
  followups: [
    "Why does `-race` use atomic coverage by default?",
    "Does `-coverpkg=./...` decide which tests execute?",
    "Why can broad instrumentation lower a reported percentage?",
  ],
});

add({
  topicSlug: "example-functions",
  question: "What is an Example function in Go, and how is its output checked?",
  title: "Executable documentation with checked standard output",
  direct: "An Example function lives in a `_test.go` file, has no parameters or results, and follows a recognised `Example...` name. If its final comment begins with `// Output:`, `go test` runs it and compares standard output with the comment, ignoring leading and trailing space. Examples also appear with package documentation, so they should teach a small public use case.",
  quick: [
    "Examples live in `_test.go` files and use recognised `Example...` names.",
    "An Example function has no parameters and no return values.",
    "`// Output:` supplies the expected standard output.",
    "`go test` executes examples that have an output comment.",
    "Examples double as checked documentation for public usage.",
  ],
  speaking: paragraphs(
    "- A Go example is a specially named no-argument function in a `_test.go` file. It demonstrates package usage with ordinary Go statements. When it ends with an `// Output:` comment, the testing package runs it and compares what was written to standard output with the expected text, ignoring leading and trailing whitespace.",
    "- Because examples are associated with package documentation, they should be small, readable, and focused on the public behaviour a caller needs. The example name can associate it with the package, function, type, or method; the output turns the demonstration into a regression check.",
    "- For example, `ExampleGreeting` calls the exported `Greeting` function and prints one result. `go test` verifies that the line is exactly `Hello, Go!`, while documentation tools can show the same code beside Greeting.",
    "- Output comparison covers stdout, not every side effect. An example that depends on timestamps, random map order, network state, or local files can be unstable and poor documentation. Use deterministic values, sort order when order is part of the demonstration, and write a normal test when assertions need several branches or detailed error inspection."
  ),
  overviewTitle: "One snippet serves readers and the test runner",
  overview: "An example has to remain understandable without test-framework ceremony, yet its displayed result is executable evidence. That dual role makes it ideal for the shortest happy-path story of a public API, not for exhaustive verification.",
  deepTitle: "Understand discovery, association, and comparison",
  deep: paragraphs(
    "Example discovery starts with the same test-file boundary as tests: the source must be in `_test.go`. A recognised Example function has no parameters and no results. Its name determines which documented declaration it accompanies.",
    "The output marker is a source comment, not a string passed to the test runner. During the test action, stdout is captured and compared with the comment body. Leading and trailing space around the complete output is ignored, but meaningful content and normal line order must match.",
    "A mismatch fails the package test just like a failing Test function. This keeps common documentation calls current when behaviour changes. A compile error in an example also fails even if it has no output marker, so displayed code cannot silently rot syntactically.",
    "Examples work best at the exported boundary. An external test package can import the package exactly as a user does, while a same-package example can use direct names. The chosen boundary should keep the snippet natural and free of setup unrelated to the API being taught.",
    "Use regular tests for many inputs, error identities, resource cleanup, or concurrency. One concise example can then show the memorable path, while the detailed suite validates the rest. Documentation remains inviting without sacrificing coverage elsewhere."
  ),
  visualType: "flow_diagram",
  visualTitle: "How an example becomes a checked documentation snippet",
  visual: "```mermaid\nflowchart LR\n  A[Example function in *_test.go] --> B[Compile with package tests]\n  B --> C[Run example with Output comment]\n  C --> D[Capture stdout]\n  D --> E{Matches expected output?}\n  E -- Yes --> F[Passing test and live documentation]\n  E -- No --> G[Package test fails]\n```",
  codeTitle: "A public call with deterministic checked output",
  files: {
    "greeting.go": go(
      "package lesson",
      "",
      "func Greeting(name string) string {",
      "\treturn \"Hello, \" + name + \"!\"",
      "}"
    ),
    "greeting_test.go": go(
      "package lesson",
      "",
      "import \"fmt\"",
      "",
      "func ExampleGreeting() {",
      "\tfmt.Println(Greeting(\"Go\"))",
      "\t// Output: Hello, Go!",
      "}"
    ),
  },
  commands: ["go test -v ./...", "go test -run '^ExampleGreeting$' ./..."],
  codeNote: "The same snippet explains the public call and fails automatically if its printed result changes.",
  followups: [
    "What happens when an Example has no output comment?",
    "Why should examples avoid time-dependent or random output?",
    "When is a normal Test function more suitable than an Example?",
  ],
});

add({
  topicSlug: "example-functions",
  question: "How are Go examples named for a package, function, type, or method?",
  title: "Associating examples with the API they teach",
  direct: "Use `Example` for a package, `ExampleF` for function `F`, `ExampleT` for type `T`, and `ExampleT_M` for method `T.M`. Multiple examples for the same declaration add a lowercase suffix after an underscore, such as `ExampleParse_error`. Names are checked against real exported identifiers, so valid association keeps examples discoverable in documentation.",
  quick: [
    "`Example` documents the package.",
    "`ExampleF` documents exported function `F`.",
    "`ExampleT` documents exported type `T`.",
    "`ExampleT_M` documents method `T.M`.",
    "A distinct suffix follows an underscore and begins with a lowercase letter.",
  ],
  speaking: paragraphs(
    "- Example names form a small association grammar. `Example` belongs to the package. Appending an exported function or type name associates the snippet with that declaration, and `ExampleType_Method` associates it with an exported method. Documentation tools use this relationship to place the example where readers need it.",
    "- A package may have more than one example for the same target. Add an underscore and a suffix beginning with a lowercase letter, such as `ExampleCounter_Add_negative`. The suffix describes the scenario; it is not another exported identifier.",
    "- For example, the code below includes a package example, `ExampleDouble` for a function, `ExampleCounter` for a type, and `ExampleCounter_Add` for its method. Every name corresponds to a real exported declaration and every output is deterministic.",
    "- Names that look like associations but refer to missing identifiers are mistakes, and `go test` runs a vet check for common malformed example names. Avoid turning names into sentences or using an uppercase suffix after the separator. The naming scheme is intentionally limited so a reader can move directly between an API declaration and its executable demonstration."
  ),
  overviewTitle: "The function name is a documentation address",
  overview: "Unlike an ordinary test name, an Example name does more than label execution. It points at a package declaration. A correct address lets tooling render the snippet beside that API and gives learners immediate context.",
  deepTitle: "Parse the name from left to right",
  deep: paragraphs(
    "The bare prefix represents the package. After `Example`, the first identifier may name an exported function or type. Documentation can then group the example under that declaration rather than at package level.",
    "For a method, the separator between type and method is an underscore: `ExampleCounter_Add`. Both sides refer to real exported identifiers. This mirrors the method's ownership while remaining a legal Go function name.",
    "An additional scenario suffix also uses an underscore but begins with a lowercase letter. `ExampleCounter_Add_negative` is a second example of the same method, labelled `negative`. The lowercase rule disambiguates a suffix from an exported identifier association.",
    "Example functions can use either the package itself or an external `_test` package. External examples often look more like copyable user code because they qualify exported names through the imported package, while same-package examples can be shorter. Choose the form that teaches the public call clearly.",
    "The Go command's curated vet checks include example-name validation. Keep that check enabled: a typo may still be valid Go and compile, but it can detach the snippet from the documentation target the name was meant to identify."
  ),
  visualType: "comparison_table",
  visualTitle: "Example naming grammar",
  visual: "| Name | Documentation target |\n|---|---|\n| `Example` | Package |\n| `ExampleDouble` | Function `Double` |\n| `ExampleCounter` | Type `Counter` |\n| `ExampleCounter_Add` | Method `Counter.Add` |\n| `ExampleCounter_Add_negative` | Additional `Counter.Add` scenario |",
  codeTitle: "Valid examples at every association level",
  files: {
    "counter.go": go(
      "package lesson",
      "",
      "func Double(value int) int { return value * 2 }",
      "",
      "type Counter struct{ value int }",
      "",
      "func (c *Counter) Add(delta int) { c.value += delta }",
      "func (c Counter) Value() int        { return c.value }"
    ),
    "counter_test.go": go(
      "package lesson",
      "",
      "import \"fmt\"",
      "",
      "func Example() {",
      "\tfmt.Println(\"lesson package\")",
      "\t// Output: lesson package",
      "}",
      "",
      "func ExampleDouble() {",
      "\tfmt.Println(Double(4))",
      "\t// Output: 8",
      "}",
      "",
      "func ExampleCounter() {",
      "\tvar counter Counter",
      "\tfmt.Println(counter.Value())",
      "\t// Output: 0",
      "}",
      "",
      "func ExampleCounter_Add() {",
      "\tvar counter Counter",
      "\tcounter.Add(3)",
      "\tfmt.Println(counter.Value())",
      "\t// Output: 3",
      "}"
    ),
  },
  commands: ["go test -v ./...", "go vet ./..."],
  codeNote: "Each function name points to a declaration that exists in `counter.go`; vet can therefore confirm the intended associations.",
  followups: [
    "How would you name a second example for `Counter.Add`?",
    "Why must an example suffix begin with a lowercase letter?",
    "When can an external test package make an example easier to copy?",
  ],
});

add({
  topicSlug: "example-functions",
  question: "What is the difference between `Output`, `Unordered output`, and no output comment in a Go example?",
  title: "Ordered checks, order-independent lines, or compile-only examples",
  direct: "`// Output:` runs the example and compares stdout in the written line order. `// Unordered output:` also runs it but compares output lines without requiring their order. With neither comment, the example is compiled but not executed as a test. Prefer ordered output unless order is genuinely outside the API contract, and always keep examples deterministic in content.",
  quick: [
    "`Output` verifies stdout with normal line order.",
    "`Unordered output` verifies the same lines without requiring order.",
    "Both markers cause the example to execute during `go test`.",
    "An example without either marker is compiled but not run.",
    "Use unordered output only when order is intentionally unspecified.",
  ],
  speaking: paragraphs(
    "- An `// Output:` comment makes an example executable and defines the expected stdout in order. The runner compares the captured output with those lines, ignoring leading and trailing whitespace around the complete result. A line-content or ordering difference fails the package test.",
    "- `// Unordered output:` also executes and verifies the example, but it treats the expected and actual output as sets of lines for ordering purposes. This is appropriate for a demonstration such as iterating a map, where Go intentionally does not guarantee iteration order but the membership of the result still matters.",
    "- With no output marker, an Example is compiled but not executed. The code remains type-checked and can appear in documentation, but a runtime error or behaviour change is not detected by that example.",
    "- For example, the code prints every map entry and uses Unordered output because the sequence is not part of the contract. A second package example lacks a marker and is compile-only. Do not use unordered output to cover up an API that promises ordering, and do not omit the marker simply to avoid fixing nondeterministic setup. Choose the form that represents the real contract."
  ),
  overviewTitle: "The marker declares how much behaviour is testable",
  overview: "Ordered output checks sequence and content. Unordered output checks line content while deliberately dropping sequence. No marker checks only compilation. The source comment is therefore a small contract, not display formatting.",
  deepTitle: "Match the oracle to the API guarantee",
  deep: paragraphs(
    "Standard Output is the strongest of the three simple forms because a sequence mismatch is observable. It is well suited to parsers, formatters, and API calls whose demonstration naturally produces stable lines.",
    "Unordered output narrows the assertion. It accepts any permutation of the listed lines, which captures collection membership but not duplicates arranged differently in a meaningful sequence. Use it for genuinely unspecified ordering, such as direct map iteration, and keep each expected line unambiguous.",
    "No-marker examples still pass through compilation. That protects imports, signatures, and types from becoming stale, but their body is not executed during a normal test run. They are documentation snippets, not behavioural regression checks.",
    "If setup makes output unstable for accidental reasons, fix the setup instead of weakening the oracle. Inject a fixed clock, sort data when sorted order is part of the tutorial, and avoid network calls. Unordered output should describe the production contract, not test convenience.",
    "Normal Test functions remain available when stdout is a poor oracle. They can inspect returned errors, compare structured values, verify side effects, and cover multiple cases. Keep the Example focused on a learner-visible story and move complex assertions into the dedicated suite."
  ),
  visualType: "comparison_table",
  visualTitle: "How much each example marker verifies",
  visual: "| Final marker | Compiled | Executed | Content checked | Order checked |\n|---|---:|---:|---:|---:|\n| `// Output:` | Yes | Yes | Yes | Yes |\n| `// Unordered output:` | Yes | Yes | Yes | No |\n| No marker | Yes | No | No | No |",
  codeTitle: "Verify map membership without inventing an order",
  files: {
    "labels.go": go(
      "package lesson",
      "",
      "func Labels() map[string]int {",
      "\treturn map[string]int{\"ready\": 1, \"waiting\": 2}",
      "}"
    ),
    "labels_test.go": go(
      "package lesson",
      "",
      "import \"fmt\"",
      "",
      "func ExampleLabels() {",
      "\tfor label, value := range Labels() {",
      "\t\tfmt.Println(label, value)",
      "\t}",
      "\t// Unordered output:",
      "\t// ready 1",
      "\t// waiting 2",
      "}",
      "",
      "func Example_unchecked() {",
      "\tfmt.Println(\"this example is compiled but not executed\")",
      "}"
    ),
  },
  commands: ["go test -v ./...", "go vet ./..."],
  codeNote: "The map example checks both lines without pretending map iteration has stable order. The suffix-only package example has no runtime oracle.",
  followups: [
    "Does an example without an output comment execute during `go test`?",
    "When would sorting be better than Unordered output?",
    "What should a normal Test verify that stdout cannot express well?",
  ],
});

add({
  topicSlug: "comparisons",
  question: "When should Go tests use the same package or an external `_test` package?",
  title: "Internal visibility versus a public-user boundary",
  direct: "Tests declared with the same package name can access unexported identifiers and are useful for focused internal invariants. Tests declared as `package name_test` compile as a separate package, import the package under test, and see only its exported API. Use the boundary that matches the behaviour: public contracts benefit from external tests; delicate internals may justify a small internal suite.",
  quick: [
    "Same-package tests can access exported and unexported declarations.",
    "An external `_test` package imports and sees only the exported API.",
    "Both styles live beside the package in `_test.go` files.",
    "External tests reveal whether the public API is sufficient for real callers.",
    "Internal tests can target invariants without exporting test-only hooks.",
    "A package may use both styles for different boundaries.",
  ],
  speaking: paragraphs(
    "- Same-package tests declare `package store`, matching the production package. They compile with access to unexported names, so they can verify a parser helper or data-structure invariant directly. That power can make them sensitive to refactoring, because private implementation changes may require test changes even when public behaviour is unchanged.",
    "- External tests declare `package store_test`. The Go tool builds them as another package and they import `store` like an application would. Only exported names are available, making this style a strong check of the public API and preventing accidental dependence on hidden state.",
    "- For example, the module includes both. An internal test checks the unexported `normalise` rule, while an external test imports the module and verifies `Add`. The external test cannot call normalise, which is exactly the boundary a package user has.",
    "- Neither style is universally superior. Public contract, examples, and end-user workflows usually fit external tests; subtle algorithms and package invariants may be clearer internally. Avoid exporting a symbol solely so a test package can reach it. A balanced package can keep most tests at the public boundary and a small targeted internal set where observing only outputs would be indirect or fragile."
  ),
  overviewTitle: "Test visibility should match the claim",
  overview: "If a test claims the package works for callers, it should use caller-visible operations. If it claims a private invariant holds, internal access can be honest and precise. Problems arise when the visibility boundary and the claim disagree.",
  deepTitle: "Understand the two-package build",
  deep: paragraphs(
    "Internal test files are compiled as part of the package-under-test variant. Their declarations share the package namespace and can call lowercase functions or inspect unexported fields. This enables narrow checks without expanding the library API.",
    "External test files form a distinct package whose conventional name ends in `_test`. They depend on the already compiled package just like any importer. Import cycles can arise if their helper dependencies point back incorrectly, but external placement can also avoid cycles caused by test-only imports inside the original package.",
    "External tests naturally survive private refactors because they cannot name the changed implementation. They also reveal awkward exported setup: if a real use case cannot be expressed without internal access, the public design may be incomplete.",
    "Internal tests have legitimate uses. A complex lexer may expose a compact public Parse API while an internal state-machine invariant deserves direct cases. Testing only through huge end-to-end inputs can make diagnosis slow and expectations opaque.",
    "Use both intentionally rather than duplicating every case. Keep behavioural acceptance at the external boundary, keep a small internal suite for high-value invariants, and share fixtures through ordinary test helpers appropriate to each package."
  ),
  visualType: "comparison_table",
  visualTitle: "Two valid test visibility boundaries",
  visual: "| Property | `package lesson` | `package lesson_test` |\n|---|---:|---:|\n| Exported API visible | Yes | Yes, through import |\n| Unexported names visible | Yes | No |\n| Models an outside caller | Less strictly | Yes |\n| Resistant to private refactors | Less | More |\n| Best for private invariants | Yes | No |",
  codeTitle: "Internal and external tests in the same directory",
  files: {
    "numbers.go": go(
      "package lesson",
      "",
      "func normalise(value int) int {",
      "\tif value < 0 {",
      "\t\treturn 0",
      "\t}",
      "\treturn value",
      "}",
      "",
      "func Add(a, b int) int {",
      "\treturn normalise(a) + normalise(b)",
      "}"
    ),
    "numbers_internal_test.go": go(
      "package lesson",
      "",
      "import \"testing\"",
      "",
      "func TestNormalise(t *testing.T) {",
      "\tif got := normalise(-2); got != 0 {",
      "\t\tt.Fatalf(\"normalise(-2) = %d; want 0\", got)",
      "\t}",
      "}"
    ),
    "numbers_external_test.go": go(
      "package lesson_test",
      "",
      "import (",
      "\t\"testing\"",
      "",
      "\tlesson \"example.test/lesson\"",
      ")",
      "",
      "func TestAddPublicAPI(t *testing.T) {",
      "\tif got := lesson.Add(-2, 5); got != 5 {",
      "\t\tt.Fatalf(\"Add(-2, 5) = %d; want 5\", got)",
      "\t}",
      "}"
    ),
  },
  commands: ["go test ./..."],
  codeNote: "The external test can import only `Add`; the internal test can inspect the private normalisation rule without changing the exported API.",
  followups: [
    "Can one directory contain both internal and external test files?",
    "Why might an external test survive a private refactor more easily?",
    "When is direct testing of an unexported invariant justified?",
  ],
});

add({
  topicSlug: "comparisons",
  question: "What is the difference between unit, integration, and Example tests in Go?",
  title: "Choosing scope from the boundary under test",
  direct: "A unit test checks a small behaviour with controlled dependencies; an integration test checks cooperation across a real boundary such as HTTP, a database adapter, or several packages; an Example teaches a public call and may verify stdout. Go uses the same `go test` tool for all three, so teams express scope through design, names, directories, build tags, or commands.",
  quick: [
    "Unit tests keep the subject and dependencies small and controlled.",
    "Integration tests exercise cooperation across meaningful boundaries.",
    "Examples optimise for readable public usage and optionally checked stdout.",
    "These are design categories, not three separate Go test runners.",
    "Use different layers because each gives different speed and confidence.",
  ],
  speaking: paragraphs(
    "- A unit test narrows the subject to one function, type, or cohesive component and controls its dependencies. It is usually fast, deterministic, and precise when it fails. The pure `Slug` test below is a unit test because no external process or protocol is involved.",
    "- An integration test checks that parts cooperate across a boundary. That can mean a handler plus HTTP request and response handling, a repository plus a real database, or several packages wired together. For example, `httptest.NewRequest` and a response recorder exercise the handler, URL decoding, response writing, and slug logic together without opening a network port.",
    "- An Example is primarily executable documentation. It shows a small public call and, with an Output comment, verifies stdout. It should be easier to read than an exhaustive table and often covers only the memorable success path.",
    "- Go does not enforce these labels through different function signatures: unit and integration checks are normally both `TestXxx`. A project decides how to select slower tests, perhaps through package layout, flags, explicit environment setup, or carefully used build tags. Use many focused units for feedback, targeted integrations for boundary confidence, and examples for learner-facing API stories."
  ),
  overviewTitle: "Scope grows from one rule to cooperating systems",
  overview: "The categories differ in what is allowed to be real. Unit tests isolate a local rule, integrations retain a meaningful collaboration boundary, and examples retain only enough setup to teach a public call. None alone answers every risk.",
  deepTitle: "Build a portfolio of evidence",
  deep: paragraphs(
    "Unit tests make input and expected output close together. They are ideal for edge cases, parsing rules, calculations, and state transitions whose dependencies can be values or small interfaces. A failure usually identifies one contract quickly.",
    "Integration tests accept more moving parts to verify wiring and protocols. `httptest` can cover HTTP serialisation without reserving a fixed port; database integrations may use an isolated real database when driver behaviour and schema are the actual question. More realism increases setup cost and possible failure causes.",
    "Examples have a different audience. Their source appears in documentation and should remain copyable. Output checking gives one narrow oracle, but an example should not grow a hidden harness merely to simulate exhaustive coverage.",
    "The boundary matters more than the label. A test with ten mocks can be slower to understand than an in-process integration, while a database test against a fake may still miss transaction semantics. Name the property the test proves and retain the smallest realistic boundary needed for it.",
    "A practical suite uses layers. Unit failures provide fast diagnosis, integrations catch mismatched assumptions between parts, and examples prevent the common public path from drifting. Separate commands should be documented so local and CI runs make the included evidence clear."
  ),
  visualType: "comparison_table",
  visualTitle: "Three test forms serve different evidence",
  visual: "| Form | Primary subject | Typical dependency | Main strength |\n|---|---|---|---|\n| Unit test | One local contract | Controlled value/fake | Fast, precise diagnosis |\n| Integration test | Cooperation across a boundary | Real protocol or implementation | Wiring and compatibility confidence |\n| Example | Public usage story | Minimal deterministic setup | Checked documentation |",
  codeTitle: "A pure unit, an HTTP integration, and an Example",
  files: {
    "app.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"net/http\"",
      "\t\"strings\"",
      ")",
      "",
      "func Slug(value string) string {",
      "\treturn strings.ToLower(strings.ReplaceAll(strings.TrimSpace(value), \" \", \"-\"))",
      "}",
      "",
      "func Handler(w http.ResponseWriter, r *http.Request) {",
      "\tfmt.Fprint(w, Slug(r.URL.Query().Get(\"title\")))",
      "}"
    ),
    "app_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"io\"",
      "\t\"net/http\"",
      "\t\"net/http/httptest\"",
      "\t\"testing\"",
      ")",
      "",
      "func TestSlug(t *testing.T) {",
      "\tif got := Slug(\" Go Tests \" ); got != \"go-tests\" {",
      "\t\tt.Fatalf(\"Slug = %q; want go-tests\", got)",
      "\t}",
      "}",
      "",
      "func TestHandlerIntegration(t *testing.T) {",
      "\trequest := httptest.NewRequest(http.MethodGet, \"/?title=Go+Tests\", nil)",
      "\trecorder := httptest.NewRecorder()",
      "\tHandler(recorder, request)",
      "\tresponse := recorder.Result()",
      "\tdefer response.Body.Close()",
      "\tbody, err := io.ReadAll(response.Body)",
      "\tif err != nil {",
      "\t\tt.Fatal(err)",
      "\t}",
      "\tif string(body) != \"go-tests\" {",
      "\t\tt.Fatalf(\"body = %q; want go-tests\", body)",
      "\t}",
      "}",
      "",
      "func ExampleSlug() {",
      "\tfmt.Println(Slug(\"Go Tests\"))",
      "\t// Output: go-tests",
      "}"
    ),
  },
  commands: ["go test ./..."],
  codeNote: "All three use the same toolchain, but each retains a different boundary and therefore provides a different kind of confidence.",
  followups: [
    "Why does a handler test cover a broader boundary than calling a pure helper?",
    "How might a project select database integration tests separately?",
    "What should remain outside an Example even if the API supports it?",
  ],
});

add({
  topicSlug: "comparisons",
  question: "How do tests, benchmarks, and fuzz tests differ in Go?",
  title: "Examples, performance measurements, and generated inputs",
  direct: "`TestXxx(*testing.T)` checks known examples and properties. `BenchmarkXxx(*testing.B)` measures repeated work and is selected with `-bench`; current Go benchmarks can place measured work inside `b.Loop()`. `FuzzXxx(*testing.F)` registers seed values and a fuzz target; normal `go test` runs the seed corpus, while `-fuzz` generates mutations to find failing inputs.",
  quick: [
    "Tests answer whether known behaviour is correct.",
    "Benchmarks measure repeated operations through `*testing.B`.",
    "Fuzz tests explore generated mutations from a seed corpus through `*testing.F`.",
    "Benchmarks require `-bench`; they do not run in a plain test command.",
    "Fuzz seeds run as tests normally; `-fuzz` starts mutation-based exploration.",
    "A discovered fuzz failure is saved so it can be reproduced later.",
  ],
  speaking: paragraphs(
    "- Tests, benchmarks, and fuzz tests share the Go test binary but answer different questions. A `TestXxx(*testing.T)` checks known examples or properties and reports pass or fail. It is the primary place for readable regression cases and precise expected results.",
    "- A `BenchmarkXxx(*testing.B)` measures an operation repeatedly. Benchmarks are selected with `go test -bench`; plain `go test` does not run them. On current Go, setup can stay before `b.Loop()` and the measured operation goes inside the loop, allowing the framework to choose an iteration count and exclude surrounding setup from the measurement.",
    "- A `FuzzXxx(*testing.F)` adds representative seeds and registers a target. A normal test run executes the seed corpus as regression tests. Running with `-fuzz=FuzzName` asks the engine to mutate values and search for a panic, failing assertion, or other target failure. Discovered inputs are retained for reproduction.",
    "- For example, the code applies all three forms to rune-safe string reversal: fixed inputs prove expected results, a benchmark measures one input, and fuzzing checks that reversing twice restores every valid UTF-8 string. Benchmarks do not prove speed requirements by themselves, and fuzzing does not replace chosen domain cases. Use each tool for the kind of evidence it actually produces."
  ),
  overviewTitle: "One package can ask three different questions",
  overview: "A known test asks 'is this result right?', a benchmark asks 'what does repeated execution cost?', and a fuzz target asks 'which generated input breaks this property?'. Sharing compilation and setup does not make their results interchangeable.",
  deepTitle: "Read each function's control object",
  deep: paragraphs(
    "`testing.T` manages a finite named correctness case. It supports subtests, failures, and cleanup. The case inputs are chosen in source or fixtures, so its strongest value is a stable contract that fails the same way after a regression.",
    "`testing.B` manages measurement. The framework adjusts work so timing is statistically useful and reports duration and optionally allocations or custom metrics. `b.Loop` establishes the measured region in current Go; older code commonly loops from zero to `b.N`. Keep setup and validation outside the measured body when they are not part of the operation cost.",
    "`testing.F` has a seed-registration phase and a fuzz-target phase. Target parameter types are limited to supported primitive forms. The target must be deterministic, fast enough to run many times, and free from persistent global state that makes an input's outcome depend on previous inputs.",
    "During an ordinary test command, only fuzz seeds execute. Active fuzzing uses `-fuzz` and continues according to fuzz time or external cancellation. A failure is minimised when possible and recorded under testdata so future ordinary test runs include it as a regression.",
    "Properties need boundaries. Reversing arbitrary bytes as Unicode text does not preserve invalid UTF-8, so this target skips invalid strings and states a valid-text contract. Fuzzing becomes meaningful when the invariant and accepted input domain are explicit rather than merely checking that a function does not crash."
  ),
  visualType: "comparison_table",
  visualTitle: "Three entry points in the test binary",
  visual: "| Entry point | Handle | Input source | Normal invocation | Evidence |\n|---|---|---|---|---|\n| `TestXxx` | `*testing.T` | Chosen cases | `go test` | Correctness for known cases |\n| `BenchmarkXxx` | `*testing.B` | Chosen workload | `go test -bench` | Measured cost |\n| `FuzzXxx` | `*testing.F` | Seeds plus mutations | Seeds in `go test`; mutations with `-fuzz` | Counterexample search |",
  codeTitle: "Test, benchmark, and fuzz one text operation",
  files: {
    "reverse.go": go(
      "package lesson",
      "",
      "func Reverse(value string) string {",
      "\trunes := []rune(value)",
      "\tfor left, right := 0, len(runes)-1; left < right; left, right = left+1, right-1 {",
      "\t\trunes[left], runes[right] = runes[right], runes[left]",
      "\t}",
      "\treturn string(runes)",
      "}"
    ),
    "reverse_test.go": go(
      "package lesson",
      "",
      "import (",
      "\t\"testing\"",
      "\t\"unicode/utf8\"",
      ")",
      "",
      "func TestReverse(t *testing.T) {",
      "\tif got := Reverse(\"Go語\"); got != \"語oG\" {",
      "\t\tt.Fatalf(\"Reverse = %q; want 語oG\", got)",
      "\t}",
      "}",
      "",
      "func BenchmarkReverse(b *testing.B) {",
      "\tfor b.Loop() {",
      "\t\t_ = Reverse(\"interview preparation\")",
      "\t}",
      "}",
      "",
      "func FuzzReverseTwice(f *testing.F) {",
      "\tfor _, seed := range []string{\"\", \"Go\", \"語🙂\"} {",
      "\t\tf.Add(seed)",
      "\t}",
      "\tf.Fuzz(func(t *testing.T, value string) {",
      "\t\tif !utf8.ValidString(value) {",
      "\t\t\tt.Skip()",
      "\t\t}",
      "\t\tif got := Reverse(Reverse(value)); got != value {",
      "\t\t\tt.Fatalf(\"double reverse = %q; want %q\", got, value)",
      "\t\t}",
      "\t})",
      "}"
    ),
  },
  commands: [
    "go test ./...",
    "go test -bench '^BenchmarkReverse$' -run '^$' -benchtime=1x ./...",
    "go test -run '^FuzzReverseTwice$' ./...",
  ],
  codeNote: "The ordinary command runs the fixed test and fuzz seeds. The benchmark command measures one iteration for a quick validated example; real measurement should run long enough to stabilise.",
  followups: [
    "Do benchmarks run during plain `go test`?",
    "What executes from a fuzz function when `-fuzz` is absent?",
    "Why does this fuzz target reject invalid UTF-8 strings?",
  ],
});

const speakingExtensions = new Map([
  [
    "How does Go discover tests in `_test.go` files?",
    "Discovery and selection are separate: the filename, function name, and signature make an entry eligible, while flags such as `-run` choose among eligible tests. If a test never appears, I check the discovery contract before changing the filter or the behavior under test.",
  ],
  [
    "What belongs in a Go `_test.go` file, and when is it compiled?",
    "This boundary keeps the shipped package honest. Fixtures, assertions, and fakes may stay test-only, but any behavior users rely on must remain in ordinary source and be exercised through that same implementation. A passing test should not depend on a second hidden version of the feature.",
  ],
  [
    "How should Go tests use `testdata` and `t.TempDir`?",
    "The ownership rule also makes concurrent tests safer: checked-in fixtures are immutable evidence, while each test receives a separate writable directory. If a failure needs inspection, the test can print the relevant path or bytes, but ordinary successful runs should leave no shared output behind.",
  ],
  [
    "What does `*testing.T` provide to a Go test?",
    "Because the handle belongs to one test or subtest, helpers should receive that handle instead of storing it globally. This keeps failures attached to the correct name, lets cleanup follow the owning scope, and allows unrelated cases to run independently without sharing diagnostic state.",
  ],
  [
    "How do `t.Helper` and `t.Cleanup` improve Go test helpers?",
    "Together they make a helper feel like part of the calling test: Helper moves the useful failure location outward, while Cleanup ties resource lifetime to that test. Cleanup functions run even after a fatal failure, in last-in-first-out order, so nested setup can be unwound predictably.",
  ],
  [
    "How should Go tests manage temporary resources and process-wide state?",
    "Parallelism is the boundary to check. Private files, servers, and values can be owned by one test, but environment variables and the working directory affect the whole process. Tests that mutate those globals must not overlap parallel tests and should restore state through testing helpers or cleanup.",
  ],
  [
    "What is the difference between `t.Error` and `t.Fatal`?",
    "The choice should follow whether later checks remain meaningful. Independent fields can use Error so one run reports several differences; a missing file, failed parse, or nil dependency may require Fatal because continuing would only panic or produce misleading follow-on messages.",
  ],
  [
    "When should a Go test stop after a failed precondition?",
    "A useful test separates setup assertions from outcome assertions. Stop when setup failed to create the subject or continuing would violate a required invariant. Continue when the subject is valid and several independent observations can still provide distinct evidence about the same behavior.",
  ],
  [
    "Why must `t.Fatal` not be called from a spawned goroutine?",
    "Worker goroutines should return errors or results to the test goroutine, which owns the decision to call Fatal. That pattern also makes completion explicit: the test waits for the worker, handles timeouts or cancellation, and cannot accidentally finish while an unobserved goroutine is still reporting state.",
  ],
  [
    "What is a table-driven test in Go?",
    "A table is strongest when every row expresses the same contract. If rows need unrelated setup, different assertions, or different failure meanings, separate tests are clearer. The table removes repeated mechanics; it should not hide why an input and expected result belong together.",
  ],
  [
    "How do named subtests with `t.Run` improve a test table?",
    "Names become part of the test's operational interface. A stable case name lets `-run` select one row, makes CI output readable, and identifies exactly which input contract failed. I keep names short but semantic rather than embedding a large value dump into every subtest path.",
  ],
  [
    "How do you run table-driven subtests safely in parallel?",
    "Parallel rows should behave like isolated tests: each owns its input copy, expected value, temporary resources, and output. A fast race-free run is not enough if cases mutate a shared map, server, environment variable, or working directory whose order changes the result.",
  ],
  [
    "What are the essential `go test` commands for a Go project?",
    "Package selection comes before test selection. `./...` chooses the package tree, while `-run` filters test and subtest names inside each built test binary. Keeping that distinction clear prevents a passing targeted command from being mistaken for evidence that every package was tested.",
  ],
  [
    "How does Go test caching work, and when should you use `-count=1`?",
    "Caching rewards deterministic package tests, but an external dependency can make a cached success misleading if the test does not model that dependency explicitly. Use `-count=1` while diagnosing whether execution itself matters, then fix hidden time, filesystem, network, or environment inputs rather than disabling caching everywhere.",
  ],
  [
    "How do `-race`, `-shuffle`, `-short`, and `-timeout` help diagnose a Go test suite?",
    "These flags probe different risks, so one cannot replace another. Race finds observed unsynchronised memory access, shuffle exposes order assumptions, short requests a smaller suite, and timeout bounds hangs. CI can combine deliberate runs, while local diagnosis should start with the flag matching the symptom.",
  ],
  [
    "What does Go test coverage measure, and what does it not prove?",
    "Coverage is best used as a map for review: an untouched error branch may deserve a case, while a covered statement with no meaningful assertion may prove little. The useful question is which behavior and risk remain untested, not whether one percentage can certify correctness.",
  ],
  [
    "How do you create and inspect a Go coverage profile?",
    "The profile connects a summary number back to source. Text output is useful in automation, function summaries show where coverage is concentrated, and HTML highlights executed regions for human review. Generated profiles are test artifacts; the tests and assertions remain the durable specification.",
  ],
  [
    "What are `set`, `count`, and `atomic` coverage modes, and when is `-coverpkg` useful?",
    "Choose the mode from the evidence needed: set answers whether a statement ran, count records how often, and atomic safely counts concurrent execution with added cost. Expanding `-coverpkg` is useful for integration boundaries only when the reported package set is named and understood.",
  ],
  [
    "What is an Example function in Go, and how is its output checked?",
    "An Example should remain documentation first: small, deterministic, and copyable. Exhaustive edge cases belong in tests, while the example shows the memorable public path. When output matters, the comment turns that teaching snippet into a regression check without obscuring it with assertion code.",
  ],
  [
    "How are Go examples named for a package, function, type, or method?",
    "Correct association affects both execution and documentation placement. The suffix may distinguish several valid scenarios, but it must begin with a lowercase letter after the final underscore. If a name is not recognised, the function may compile as ordinary test code without becoming the example users see.",
  ],
  [
    "What is the difference between `Output`, `Unordered output`, and no output comment in a Go example?",
    "Choose the comment that matches the contract. Use exact Output when order is meaningful, Unordered output only when line order truly is not part of behavior, and no comment for a documentation-only snippet. Avoid weakening a deterministic API's example merely to hide unstable implementation state.",
  ],
  [
    "When should Go tests use the same package or an external `_test` package?",
    "The test package should match the claim being made. Public behavior is strongest when exercised as an outside importer, while a difficult private invariant may justify a focused same-package test. Using both is reasonable when their cases cover different boundaries rather than duplicating every assertion.",
  ],
  [
    "What is the difference between unit, integration, and Example tests in Go?",
    "The labels are useful only when they explain retained boundaries. A small HTTP test may be an integration because it preserves protocol behavior, while a large test full of mocks may still miss the real collaboration. State what is real, what is controlled, and which risk the layer covers.",
  ],
  [
    "How do tests, benchmarks, and fuzz tests differ in Go?",
    "The three forms complement one another: a fuzz-discovered input should become lasting regression evidence, a benchmark should measure a defined workload without claiming correctness, and ordinary tests should preserve readable domain examples. Their shared toolchain makes them convenient, but their conclusions remain different.",
  ],
]);

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
    const extension = speakingExtensions.get(spec.question);
    if (!extension) {
      throw new Error(`${previous.id} is missing its topic-specific standard-depth conclusion.`);
    }
    const speaking = formatInterviewArticle(paragraphs(spec.speaking, `- ${extension}`));
    const speakingWords = plainWords(speaking);
    if (speakingWords < 220 || speakingWords > 320) {
      throw new Error(`${previous.id} interview answer has ${speakingWords} words; expected 220-320.`);
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
    const words = [spec.direct, speaking, spec.overview, spec.deep, spec.visual, example]
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
      reading_time_minutes: Math.max(5, Math.ceil(words / 200)),
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

function curateModuleDocuments() {
  const configPath = path.join(moduleRoot, "_config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  Object.assign(config, {
    title: "Testing Package Basics",
    topics: topicOrder,
    intro: "Learn Go testing as an executable evidence system: how `_test.go` source becomes a test binary, how `testing.T` owns failures and resources, when a case should stop, how tables and subtests remain isolated, how commands and caching affect execution, what coverage can and cannot prove, how examples become checked documentation, and when to use unit, integration, benchmark, or fuzz evidence. Every retained lesson contains a validated Go example and a precise boundary rather than generic testing advice.",
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
  });
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  const revision = {
    title: "Testing Package Basics — Revision",
    estimatedMinutes: 14,
    questionCount: 24,
    status: "gold-standard",
    lastUpdated: "2026-09-07",
    sections: [
      {
        id: "discovery-lifecycle",
        title: "Discovery and lifecycle",
        body: "- Test source ends in `_test.go`; Test entry points use `func TestXxx(t *testing.T)` and the name after Test must not begin lowercase.\n- `go test` builds a temporary binary; normal builds exclude test files.\n- `testing.T` carries status, diagnostics, subtests, and resource lifetime. Helper frames can be hidden with Helper, and Cleanup runs after the test tree in LIFO order.",
      },
      {
        id: "failure-structure",
        title: "Failure and test structure",
        body: "- Error marks failure and continues; Fatal calls FailNow and ends only the current test goroutine while its defers run. FailNow-based methods must not be called from spawned workers.\n- A table holds cases for one shared contract. Run turns rows into named subtests with isolated failure and cleanup. Parallel rows still need independent state and cannot mutate process-wide environment or working directory.",
      },
      {
        id: "execution-evidence",
        title: "Execution and evidence",
        body: "- Package arguments select test binaries; `-run` selects names inside them. Eligible successful package-list results may be cached, and `-count=1` forces execution.\n- Race, shuffle, short, and timeout flags probe different risks.\n- Coverage reports executed statements, not assertion quality, complete branch coverage, or correctness. Profiles connect the total back to functions and source regions.",
      },
      {
        id: "tool-choice",
        title: "Choose the evidence form",
        body: "- Internal tests can inspect private invariants; external `_test` packages model exported callers.\n- Unit tests isolate a small rule, integrations preserve a meaningful collaboration boundary, and Examples teach deterministic public usage.\n- Tests check known cases, benchmarks measure repeated work, and fuzz targets search mutations from seed inputs. These tools complement rather than replace one another.",
      },
    ],
  };
  fs.writeFileSync(path.join(moduleRoot, "_revision.json"), `${JSON.stringify(revision, null, 2)}\n`);

  const indexPath = path.join(domainRoot, "_index.json");
  const indexSource = fs.readFileSync(indexPath, "utf8");
  const marker = '"moduleSlug": "testing-basics-go"';
  const markerIndex = indexSource.indexOf(marker);
  if (markerIndex < 0) throw new Error("Go M12 testing-basics-go is missing from _index.json.");
  const moduleStart = indexSource.lastIndexOf("\n    {", markerIndex) + 1;
  const nextModule = indexSource.indexOf("\n    },\n    {", markerIndex);
  if (moduleStart <= 0 || nextModule < 0) throw new Error("Could not isolate Go M12 in _index.json.");
  const moduleEnd = nextModule + "\n    }".length;
  const module = JSON.parse(indexSource.slice(moduleStart, moduleEnd));
  module.title = "Testing Package Basics";
  module.topics = topicOrder;
  module.intro = config.intro;
  module.questionCount = 24;
  module.status = "gold-standard";
  module.lastUpdated = "2026-09-07";
  const renderedModule = JSON.stringify(module, null, 2)
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n")
    .replace(/[^\x00-\x7f]/g, (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
  const updatedIndex = `${indexSource.slice(0, moduleStart)}${renderedModule}${indexSource.slice(moduleEnd)}`;
  JSON.parse(updatedIndex);
  fs.writeFileSync(indexPath, updatedIndex);
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
for (const topic of topicOrder) curateTopic(topic, byTopic.get(topic));
curateModuleDocuments();

console.log("Curated Go M12 testing-basics-go: 24 retained gold lessons; removed q004/q005 shells from eight topics.");
