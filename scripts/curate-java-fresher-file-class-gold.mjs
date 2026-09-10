#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  repoRoot,
  "content/java-backend-fresher/java-io-basics/file-class/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));
const entries = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(entries)) throw new Error("Expected an array or a questions array");

const lessons = {
  "java-io-basics-overview": {
    question: "What is Java I/O, and what problems does it solve?",
    direct: "Java I/O is the standard set of APIs for moving data between a Java program and sources or destinations such as files, network connections, memory, and the console. It provides reusable byte, character, buffering, path, and resource-management abstractions.",
    minutes: 9,
    quick: [
      "I/O means input to a program and output from a program.",
      "Byte streams handle raw binary data; character readers and writers handle decoded text.",
      "Wrappers add behavior such as buffering, data conversion, or formatted output.",
      "`Path` identifies a file-system location, while `Files` performs modern file operations.",
      "Close resources promptly—normally with try-with-resources—to release operating-system handles and flush buffered output.",
    ],
    interview: "Java I/O is the set of Java APIs used to receive and send data. The data may come from a file, socket, memory array, console, or another stream. Common interfaces let the same kind of read or write logic work with different sources and destinations.\n\nThe first choice is bytes or text. `InputStream` and `OutputStream` move raw bytes, so they suit images, ZIP files, and binary protocols. `Reader` and `Writer` move characters and use a charset such as UTF-8 to decode or encode text. Wrappers can then add features such as buffering, primitive values, or formatted output.\n\nFor example, `Files.readString(path, UTF_8)` is convenient for a small UTF-8 configuration file. A very large log should be processed through a buffered reader one part at a time so the whole file is not held in memory. In both cases the program chooses the source, opens the right abstraction, reads or writes the data, handles errors, and closes the resource.\n\nModern file code usually represents locations with `Path` and performs operations with `Files`. The older `File` class is still common at library boundaries, while NIO channels and buffers support needs such as random access and some non-blocking APIs. Safe I/O code chooses bytes versus text deliberately, uses bounded memory, and makes resource ownership and closing clear.",
    deepTitle: "A path, an open resource, and the data are different things",
    deep: "A `Path` is a location understood by a file-system provider. It does not open the file and the file need not exist. Opening a stream, reader, writer, or channel creates a live resource through which data moves. The bytes or characters are the payload. Keeping these three ideas separate prevents mistakes such as treating a pathname check as a guarantee that a later open will succeed.\n\nI/O calls can fail for reasons outside the program: permissions change, storage fills, a network peer disconnects, or another process replaces a file. Good code handles `IOException` at a boundary that can retry, report, compensate, or stop safely rather than pretending every failure means “not found.”",
    visualType: "flow_diagram",
    visualTitle: "The reusable Java I/O flow",
    visual: "```mermaid\nflowchart LR\n  S[Source: file, socket, memory, console] --> O[Open byte or character abstraction]\n  O --> W[Optional wrappers: buffer, decode, format]\n  W --> P[Program processes data]\n  P --> D[Destination]\n  W --> C[Close resource / flush buffered output]\n```",
    codeTitle: "Write and read UTF-8 text through the modern file API",
    code: "```java\nimport java.nio.charset.StandardCharsets;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\n\nclass JavaIoOverview {\n    public static void main(String[] args) throws Exception {\n        Path file = Files.createTempFile(\"io-overview-\", \".txt\");\n        try {\n            Files.writeString(file, \"Java I/O moves data.\", StandardCharsets.UTF_8);\n            String text = Files.readString(file, StandardCharsets.UTF_8);\n            System.out.println(text);\n        } finally {\n            Files.deleteIfExists(file);\n        }\n    }\n}\n```",
    practiceTitle: "Choose the data boundary first",
    practice: "For an image, choose byte I/O. For a UTF-8 CSV, choose character I/O with an explicit charset. For a very large text file, stream through a buffer rather than calling a method that returns the entire file.",
    followups: [
      "When should you use a byte stream instead of a reader?",
      "Why should text code specify a charset?",
      "What is the difference between a Path and an open stream?",
    ],
  },
  "java-file-class-overview": {
    direct: "`java.io.File` is an older object that represents an abstract file or directory pathname. It can build and inspect paths and request file-system operations, but it does not hold file content or open the file, and modern code usually converts it to `Path` for richer operations.",
    minutes: 9,
    quick: [
      "A `File` represents an abstract pathname; creating the object neither creates nor opens a file.",
      "It can inspect names and request operations such as `exists`, `isDirectory`, `mkdirs`, `listFiles`, and `delete`.",
      "Many operation methods return only `boolean` or `null`, which can hide the reason for failure.",
      "`file.toPath()` bridges old APIs to `Path`; `path.toFile()` works for the default file-system style when supported.",
      "Prefer `Path` and `Files` for new file-system code unless an existing API specifically requires `File`.",
    ],
    interview: "`java.io.File` is the older Java class for representing a file or directory path. Despite its name, `new File(\"report.txt\")` only creates a Java object that holds a pathname. It does not create, open, or even confirm that the file exists.\n\nA `File` can return path parts with methods such as `getName()` and `getParent()`. It can also ask the file system about `exists()`, `isFile()`, `isDirectory()`, and `length()`, or request operations through `createNewFile()`, `mkdirs()`, `listFiles()`, `renameTo()`, and `delete()`. The same class represents both file and directory paths.\n\nFor example, an older library may accept a `File uploadDirectory`. Newer application code can call `uploadDirectory.toPath()` and then use `Files.createDirectories`, `Files.list`, or `Files.move`. This keeps compatibility with the old API while using the clearer modern API for real work.\n\nThe main limitation of `File` is that several operations return only `false` or `null` when they fail, so the reason may be lost. `Path` and `Files` provide better exceptions, attributes, link options, and directory walking. Also, `exists()` describes only one moment; another process may change the path immediately afterward. Use `File` where an existing API requires it, but prefer `Path` and `Files` for new code.",
    deepTitle: "Constructing a File is not a file-system action",
    deep: "The Java object and the file-system entry have separate lifetimes. Several File objects can describe the same location, and a File can describe a location that never exists. Relative paths are interpreted against the JVM's current user directory when converted to an absolute location.\n\nCanonicalization can access the file system and resolve details such as symbolic links, while `getAbsolutePath` mainly resolves a relative pathname. Neither should be used casually as an authorization decision: the entry may change after inspection, and platform rules differ.\n\nThe conversion method `toPath()` is the normal escape hatch when an older API gives modern code a File.",
    visualType: "concept_map",
    visualTitle: "What a File object represents",
    visual: "```mermaid\nflowchart LR\n  J[new File path string] --> F[File pathname object]\n  F --> Q[Queries: exists, isFile, length]\n  F --> A[Requests: mkdirs, delete, renameTo]\n  F --> P[toPath]\n  P --> N[Path + Files modern API]\n  F -. does not contain .-> B[File bytes]\n  F -. does not open .-> H[Operating-system handle]\n```",
    codeTitle: "Accept File at an old boundary, use Path internally",
    code: "```java\nimport java.io.File;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\n\nclass FileBoundary {\n    static long countEntries(File legacyDirectory) throws Exception {\n        Path directory = legacyDirectory.toPath();\n        try (var entries = Files.list(directory)) {\n            return entries.count();\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        System.out.println(countEntries(new File(\".\")) >= 0);\n    }\n}\n```",
    practiceTitle: "Read the object name carefully",
    practice: "After `File file = new File(\"missing.txt\")`, the Java variable is non-null even when no entry exists. Only a file-system operation can establish what is currently at that path.",
    followups: [
      "Does `new File(...)` create a file?",
      "Why do modern APIs prefer Path and Files?",
      "What does `File.toPath()` do?",
    ],
  },
  "file-vs-path": {
    direct: "`File` is the older concrete pathname API from `java.io`; `Path` is the newer `java.nio.file` interface tied to a file-system provider. `Path` works with `Files` for richer operations, options, attributes, traversal, links, and more useful exceptions.",
    minutes: 9,
    quick: [
      "Both `File` and `Path` name file-system locations; neither object automatically opens or creates the target.",
      "`File` is the older concrete class, while `Path` is the NIO.2 interface introduced in Java 7.",
      "Use `Files` with Path for creation, copying, attributes, links, traversal, and explicit options.",
      "`File` methods often return a boolean or null; `Files` operations usually report a specific exception.",
      "Convert with `file.toPath()` and, where supported, `path.toFile()`.",
    ],
    interview: "`File` and `Path` both represent file-system locations; neither one is an open file or the file's content. `java.io.File` is the older concrete class. `java.nio.file.Path` is the newer provider-based interface, and modern operations are normally performed by the `Files` utility class.\n\n`File` combines path handling and operations such as `exists()`, `mkdirs()`, `listFiles()`, and `delete()`. Some of these return only `false` or `null` on failure. `Path` focuses on path operations such as `resolve`, `relativize`, `normalize`, and `toRealPath`, while `Files` creates, copies, moves, reads, lists, and deletes with useful options and clearer exceptions.\n\nFor example, `Files.move(source, target, StandardCopyOption.REPLACE_EXISTING)` either moves the file or throws an exception that explains the failure. `File.renameTo(target)` only returns `true` or `false` and its behavior can vary by platform. This makes error handling and recovery easier with `Path` and `Files`.\n\nThe APIs can be connected: use `file.toPath()` when an old library returns `File`, and use `path.toFile()` when an older API requires it. The second conversion may not work for a non-default provider such as a ZIP file system. Prefer `Path` and `Files` for new code, and keep `File` at compatibility boundaries.",
    deepTitle: "Path works through a file-system provider",
    deep: "A Path belongs to a `FileSystem`. The default provider maps paths to the host operating system, while another provider can expose a ZIP archive or custom storage through the same broad API. That is why Path is an interface and why converting every Path to File is not guaranteed.\n\nMany Path operations are syntactic. `resolve` and `normalize` can manipulate name elements without checking storage. `toRealPath` is different: it accesses the file system and normally resolves symbolic links to an existing path.\n\nThis split—Path for identity and Files for action—also makes operation options and exceptions visible at the call site.",
    visualType: "comparison_table",
    visualTitle: "File and Path at a glance",
    visual: "| Area | `File` | `Path` with `Files` |\n|---|---|---|\n| Package | `java.io` | `java.nio.file` |\n| Kind | Concrete pathname class | Provider-based pathname interface |\n| Operations | Instance methods | Mostly `Files` static methods |\n| Failure detail | Often boolean or null | Usually specific exceptions |\n| Features | Basic legacy operations | Attributes, links, walking, options, channels |\n| Bridge | `file.toPath()` | `path.toFile()` when supported |",
    codeTitle: "Move a file with an explicit replacement rule",
    code: "```java\nimport java.nio.file.Files;\nimport java.nio.file.Path;\nimport java.nio.file.StandardCopyOption;\n\nclass FileVsPath {\n    public static void main(String[] args) throws Exception {\n        Path directory = Files.createTempDirectory(\"path-demo-\");\n        Path source = Files.writeString(directory.resolve(\"draft.txt\"), \"ready\");\n        Path target = directory.resolve(\"archive.txt\");\n        try {\n            Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);\n            System.out.println(Files.readString(target));\n        } finally {\n            Files.deleteIfExists(target);\n            Files.deleteIfExists(directory);\n        }\n    }\n}\n```",
    practiceTitle: "Choose the modern boundary",
    practice: "When an old method returns File, convert once with `toPath()` rather than mixing File and Files calls throughout the feature. That keeps error handling and path behavior consistent.",
    followups: [
      "Can every Path be converted to File?",
      "Which API gives clearer failure information?",
      "Does Path.normalize access the file system?",
    ],
  },
  "file-system-operations-in-java": {
    direct: "Use `Files.createFile` or `createDirectories` to create entries, `Files.exists` or attribute reads to inspect a snapshot, and `Files.delete` or `deleteIfExists` to remove an entry. Prefer performing the intended operation and handling its exception over relying on a separate check.",
    minutes: 10,
    quick: [
      "`Files.createFile(path)` atomically creates an empty file and fails if that entry already exists.",
      "`Files.createDirectory` creates one directory; `createDirectories` also creates missing parents.",
      "`Files.exists` is only a current snapshot and can be false when existence cannot be determined.",
      "`Files.delete` reports absence as an exception; `deleteIfExists` returns false only when no entry was deleted because it was absent.",
      "Deleting a directory normally requires it to be empty; deleting a symbolic link deletes the link, not its final target.",
    ],
    interview: "Modern Java file operations use `Path` with the `Files` class. `Files.createFile(path)` creates one empty file and normally throws `FileAlreadyExistsException` if the name is already taken. `Files.createDirectory(path)` creates one directory, while `Files.createDirectories(path)` also creates missing parent directories and accepts an already existing target directory.\n\nFiles can be checked with `exists`, `isRegularFile`, `isDirectory`, or `readAttributes`. These checks describe only that moment. Another program may change the path immediately afterward, so `if (!exists) createFile` is unsafe; call `createFile` directly and handle its result.\n\nFor example, an export job can call `createDirectories(outputDirectory)` and then `createFile(outputFile)`. If another job already claimed that file name, the exception gives a clear conflict instead of overwriting data. Cleanup can use `Files.deleteIfExists(path)` when a missing file is acceptable. `Files.delete(path)` instead reports a missing path as an error, and a directory normally must be empty.\n\nA file system is shared external state, so every operation can fail because of permissions, storage, links, or another process. Deleting a symbolic-link path removes the link itself rather than its target. Perform the exact operation, choose replacement and link behavior deliberately, and treat earlier existence or permission checks as information rather than guarantees.",
    deepTitle: "Avoid check-then-act races",
    deep: "A sequence such as `if (!Files.exists(path)) Files.createFile(path)` has a gap. Another process or thread can create, replace, or link that name after the check. The safe primitive is the creation operation itself, which either creates the entry or reports why it could not.\n\nThe same issue applies to permission checks. `isWritable` cannot promise that a later open will succeed. Open or create the resource with the intended options, catch the relevant exception, and decide whether to retry, choose another name, or report failure.\n\nRecursive deletion is a traversal problem, not a property of `Files.delete`; children must be handled before their directory.",
    visualType: "flow_diagram",
    visualTitle: "Let the operation decide the outcome",
    visual: "```mermaid\nflowchart TD\n  N[Need a new output file] --> C[Files.createFile]\n  C -->|created| W[Write output]\n  C -->|FileAlreadyExistsException| A[Choose conflict policy]\n  C -->|AccessDeniedException| P[Report permission problem]\n  C -->|other IOException| F[Fail or retry safely]\n```",
    codeTitle: "Create a directory and claim one new filename",
    code: "```java\nimport java.nio.file.FileAlreadyExistsException;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\n\nclass FileOperations {\n    public static void main(String[] args) throws Exception {\n        Path root = Files.createTempDirectory(\"exports-\");\n        Path output = root.resolve(\"report.txt\");\n        try {\n            Files.createDirectories(root);\n            try {\n                Files.createFile(output);\n                Files.writeString(output, \"complete\");\n            } catch (FileAlreadyExistsException ex) {\n                System.out.println(\"Another job claimed the report\");\n            }\n        } finally {\n            Files.deleteIfExists(output);\n            Files.deleteIfExists(root);\n        }\n    }\n}\n```",
    practiceTitle: "Replace a check with an operation",
    practice: "When the requirement is “create only if absent,” call `createFile` and handle `FileAlreadyExistsException`. Use `exists` only when the user needs a best-effort snapshot, such as displaying current state.",
    followups: [
      "What is the difference between createDirectory and createDirectories?",
      "Why is Files.exists not a guarantee?",
      "What happens when Files.delete receives a symbolic link?",
    ],
  },
  "listing-directory-contents": {
    direct: "Use `Files.list(directory)` for one lazy, non-recursive level, close its returned stream with try-with-resources, and use `Files.walk` or `walkFileTree` for recursive traversal. Directory order is not guaranteed unless the program sorts it.",
    minutes: 9,
    quick: [
      "`Files.list(dir)` returns a lazy stream of direct children; it is not recursive.",
      "Close the stream with try-with-resources because it holds an open directory resource.",
      "The encounter order is not guaranteed, so sort when output order matters.",
      "Use `Files.walk` for a lazy recursive stream and `walkFileTree` for visitor-style control and error handling.",
      "`DirectoryStream` is useful for one-pass iteration and provider-supported glob filtering.",
    ],
    interview: "`Files.list(directory)` returns a lazy `Stream<Path>` for the directory's immediate children. It lists one level only and does not enter child directories. Because the stream keeps a directory resource open, it must be used inside try-with-resources even when a terminal operation such as `toList()` is called.\n\nFor example, a program can list `.csv` files by filtering with `Files.isRegularFile`, checking each file name, sorting, and then collecting the result. Sorting matters when output or tests must be stable because a file system does not guarantee directory iteration order. An error during lazy iteration may appear as `UncheckedIOException`.\n\nRecursive work needs a different method. `Files.walk(start)` provides a lazy depth-first stream, `Files.find` adds an attribute-aware filter, and `Files.walkFileTree` gives detailed control over entering directories, skipping subtrees, and handling failures. These stream-based methods also need closing.\n\n`Files.newDirectoryStream` is useful for direct one-pass iteration and supports a glob or filter. The older `File.listFiles()` builds an array and may return `null` when listing fails. Choose the API from the required depth and control, then define ordering, symbolic-link behavior, error handling, and resource lifetime instead of assuming every directory can be read completely.",
    deepTitle: "Lazy traversal moves some failures into iteration",
    deep: "Opening a directory can succeed even though reading a later entry fails. Stream-based methods wrap those later checked I/O failures in `UncheckedIOException`, so a terminal operation can be the point of failure. A visitor makes per-file and failed-visit handling more explicit.\n\n`Files.walk` visits the starting path as well as descendants. It is depth-first and, by default, does not follow symbolic links. Following links needs an explicit option and introduces cycle detection and additional failure cases.\n\nCollect only when a bounded result is needed. Processing entries as they arrive avoids holding a very large directory tree in memory.",
    visualType: "comparison_table",
    visualTitle: "Pick the listing API by scope and control",
    visual: "| API | Recursive? | Shape | Best fit |\n|---|---:|---|---|\n| `Files.list` | No | `Stream<Path>` | Filter/map immediate children |\n| `DirectoryStream` | No | One-pass iterable | Direct iteration or glob |\n| `Files.walk` / `find` | Yes | `Stream<Path>` | Convenient recursive pipeline |\n| `Files.walkFileTree` | Yes | Visitor callbacks | Fine control and failure policy |",
    codeTitle: "List immediate CSV files in deterministic order",
    code: "```java\nimport java.nio.file.Files;\nimport java.nio.file.Path;\nimport java.util.Comparator;\n\nclass ListDirectory {\n    public static void main(String[] args) throws Exception {\n        Path directory = Files.createTempDirectory(\"list-demo-\");\n        try {\n            Files.writeString(directory.resolve(\"b.csv\"), \"b\");\n            Files.writeString(directory.resolve(\"a.csv\"), \"a\");\n            try (var entries = Files.list(directory)) {\n                entries.filter(Files::isRegularFile)\n                        .filter(p -> p.getFileName().toString().endsWith(\".csv\"))\n                        .sorted(Comparator.comparing(Path::toString))\n                        .forEach(p -> System.out.println(p.getFileName()));\n            }\n        } finally {\n            try (var entries = Files.list(directory)) {\n                for (Path entry : entries.toList()) Files.deleteIfExists(entry);\n            }\n            Files.deleteIfExists(directory);\n        }\n    }\n}\n```",
    practiceTitle: "State the traversal contract",
    practice: "Before listing, decide whether only direct children or the whole tree is needed, whether links are followed, whether ordering matters, and what should happen when one entry cannot be read.",
    followups: [
      "Why must the stream from Files.list be closed?",
      "Does Files.list recurse into subdirectories?",
      "When is walkFileTree clearer than Files.walk?",
    ],
  },
  "cross-platform-file-paths": {
    direct: "Build cross-platform paths from separate name elements with `Path.of` and `resolve` instead of joining strings with `/` or `\\`. Keep stored paths relative when appropriate, normalize only for syntax, and use file-system-aware checks when existence, links, or security boundaries matter.",
    minutes: 10,
    quick: [
      "Use `Path.of(\"reports\", \"2026\", \"summary.txt\")` or `base.resolve(child)` instead of manual separators.",
      "Do not assume Windows drive letters, Unix roots, case sensitivity, or one path-separator rule.",
      "`normalize()` removes redundant name elements syntactically; it does not access the file system or resolve symbolic links.",
      "`toAbsolutePath()` resolves against the process context; `toRealPath()` requires access and normally resolves symbolic links.",
      "Treat user-supplied paths as security-sensitive: reject absolute escape paths and verify containment with file-system-aware policy.",
    ],
    interview: "Cross-platform Java code builds paths from path elements instead of joining strings with `/` or `\\`. `Path.of(\"reports\", \"2026\", \"summary.txt\")` lets the file-system provider use the correct separator, and `base.resolve(\"summary.txt\")` safely creates a child path.\n\nA relative path depends on a base, often the JVM's current working directory, so an application should resolve important paths against an explicit configured directory. `toAbsolutePath()` shows the absolute form but does not prove the file exists. `normalize()` removes redundant `.` and `..` elements without reading the file system, while `toRealPath()` requires the target to exist and normally resolves symbolic links.\n\nFor example, an upload service can start from a controlled `uploads` directory and resolve a supplied file name below it. `normalize().startsWith(base)` rejects simple `../` escapes, but it is not complete protection when an attacker can influence symbolic links. Secure code must also restrict names, control the directory, define link behavior, and validate the real parent at the time of opening or creation.\n\nOperating systems can also differ in roots, case sensitivity, and reserved characters. Path separators inside one path are different from separators used in a list such as a classpath. Keep paths as `Path` objects, resolve them against an explicit base, and convert to strings only for display, configuration, or a protocol that defines its own path format.",
    deepTitle: "Portability and containment are different problems",
    deep: "Path solves platform-sensitive name construction, but it does not decide whether a requested location is safe. A normalized lexical path can still pass through a symbolic link that leads outside the intended tree. The application needs a separate containment policy based on who controls the parent directories and whether links are allowed.\n\nFor an existing target, comparing real paths can resolve links. For a new target, validate an existing real parent, restrict the new filename, and create through a controlled directory. Race-free security can require operating-system or secure-directory primitives rather than a check followed by a later open.\n\nAlso keep URL paths separate from file paths: a URL always follows URI syntax and should not be assembled with the host file separator.",
    visualType: "flow_diagram",
    visualTitle: "Build first, then apply the right level of resolution",
    visual: "```mermaid\nflowchart LR\n  E[Name elements] --> P[Path.of / resolve]\n  P --> N[normalize: syntax only]\n  N --> A[toAbsolutePath: explicit base]\n  A --> R[toRealPath: existing file-system reality]\n  R --> O[Open through Files with chosen link/options policy]\n```",
    codeTitle: "Build a platform path without string separators",
    code: "```java\nimport java.nio.file.Path;\n\nclass CrossPlatformPaths {\n    static Path reportPath(Path workspace, int year) {\n        return workspace.resolve(Path.of(\"reports\", String.valueOf(year), \"summary.txt\"))\n                .normalize();\n    }\n\n    public static void main(String[] args) {\n        Path workspace = Path.of(System.getProperty(\"java.io.tmpdir\"), \"interview-explainer\");\n        Path report = reportPath(workspace, 2026);\n        System.out.println(report.endsWith(Path.of(\"reports\", \"2026\", \"summary.txt\")));\n    }\n}\n```",
    practiceTitle: "Remove operating-system knowledge from the string",
    practice: "Replace `base + \"/reports/\" + year` with `base.resolve(\"reports\").resolve(String.valueOf(year))`. Then decide separately whether the path must exist, whether links are allowed, and what containment rule applies.",
    followups: [
      "What is the difference between normalize and toRealPath?",
      "Why can startsWith after normalize be insufficient for upload security?",
      "What is File.pathSeparator used for?",
    ],
  },
};

const difficulties = {
  "java-io-basics-overview": "easy",
  "java-file-class-overview": "easy",
  "file-vs-path": "medium",
  "file-system-operations-in-java": "easy",
  "listing-directory-contents": "easy",
  "cross-platform-file-paths": "easy",
};

for (const entry of entries) {
  const lesson = lessons[entry.slug];
  if (!lesson) continue;
  if (lesson.question) entry.question = lesson.question;
  entry.direct_answer = lesson.direct;
  entry.layout_type = "concept-and-file-system-semantics";
  entry.difficulty = difficulties[entry.slug];
  entry.importance = "high";
  entry.reading_time_minutes = lesson.minutes;
  delete entry.interviewer_intent;
  delete entry.speakable_v2;
  entry.answer = {
    sections: [
      { type: "key_points", title: "Quick revision", items: lesson.quick },
      {
        type: "speakable_answer",
        title: "Interview answer",
        answerSize: "compact",
        content: lesson.interview,
      },
      { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep },
      { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
      { type: "code_example", title: lesson.codeTitle, content: lesson.code },
      { type: "practice_prompt", title: lesson.practiceTitle, content: lesson.practice },
    ],
  };
  entry.followup_questions = lesson.followups;
  entry.seo = {
    metaTitle: `${entry.title} | InterviewExplainer`,
    metaDescription: lesson.direct.replace(/`/g, "").slice(0, 155),
  };
}

const missing = Object.keys(lessons).filter(
  (slug) => !entries.some((entry) => entry.slug === slug),
);
if (missing.length) throw new Error(`Missing target questions: ${missing.join(", ")}`);

fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${Object.keys(lessons).length} Java file-system lessons; preserved IDs, slugs, and order.`);
