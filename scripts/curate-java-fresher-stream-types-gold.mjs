#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  repoRoot,
  "content/java-backend-fresher/java-io-basics/stream-types/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));
const entries = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(entries)) throw new Error("Expected an array or a questions array");

const lessons = {
  "byte-streams-vs-character-streams": {
    direct: "Java has byte streams (`InputStream` and `OutputStream`) for raw binary data and character streams (`Reader` and `Writer`) for text. Character streams decode and encode bytes with a charset; choosing the wrong kind can corrupt text or binary content.",
    difficulty: "easy",
    minutes: 9,
    quick: [
      "Use `InputStream` and `OutputStream` for bytes such as images, archives, and protocol payloads.",
      "Use `Reader` and `Writer` for text because they work with Unicode character data.",
      "A charset defines how external bytes become characters and how characters become bytes.",
      "`InputStreamReader` and `OutputStreamWriter` are the bridges between the two families.",
      "Specify a charset such as UTF-8; do not rely on a default when data must be portable.",
    ],
    interview: "Java has two main stream families. `InputStream` and `OutputStream` move raw bytes, so they are used when every byte must stay unchanged, such as for a PNG image, ZIP archive, encrypted message, or binary protocol. `Reader` and `Writer` work with text characters.\n\nText is stored and sent as bytes, so a character stream needs a charset such as UTF-8. `InputStreamReader` decodes bytes into characters, and `OutputStreamWriter` encodes characters back into bytes. Buffering is a separate feature: `BufferedReader` buffers decoded text, while `BufferedInputStream` buffers bytes without decoding them.\n\nFor example, a UTF-8 CSV can be read with `Files.newBufferedReader(path, UTF_8)` and processed line by line. An uploaded JPEG should stay in byte streams and can be copied with `input.transferTo(output)`. Passing the JPEG through a Reader may change byte sequences and corrupt the file.\n\nChoose by the meaning of the data, not only by its extension: binary payloads use byte streams; text uses character streams with the correct charset. A Reader returns UTF-16 code units, so one `read()` is not always a full visible character. It solves byte decoding, but code that handles complex Unicode may still need to work with code points or grapheme clusters.",
    deepTitle: "Text needs a reversible encoding agreement",
    deep: "Bytes have no built-in language or character meaning. A decoder interprets byte sequences according to a charset, and an encoder performs the reverse mapping. If producer and consumer disagree, characters can become replacement symbols or mojibake even though every I/O call succeeds.\n\nA bridge can read ahead because a character may require several bytes. That is why byte-level and character-level reads should not be mixed casually on the same underlying stream: their logical positions may no longer match.\n\nBinary data has no valid general-purpose character decoding. Base64 is an explicit binary-to-text representation, not a reason to pass arbitrary binary bytes through a Reader.",
    visualType: "flow_diagram",
    visualTitle: "The charset boundary separates bytes from text",
    visual: "```mermaid\nflowchart LR\n  B[External bytes] --> D[Charset decoder]\n  D --> C[Java characters]\n  C --> E[Charset encoder]\n  E --> O[External bytes]\n  BS[InputStream] --> D\n  D --> R[Reader]\n  W[Writer] --> E\n  E --> OS[OutputStream]\n```",
    codeTitle: "Bridge bytes and characters with an explicit charset",
    code: "```java\nimport java.io.BufferedReader;\nimport java.io.ByteArrayInputStream;\nimport java.io.ByteArrayOutputStream;\nimport java.io.InputStreamReader;\nimport java.io.OutputStreamWriter;\nimport java.nio.charset.StandardCharsets;\n\nclass ByteAndCharacterStreams {\n    public static void main(String[] args) throws Exception {\n        ByteArrayOutputStream bytes = new ByteArrayOutputStream();\n        try (var writer = new OutputStreamWriter(bytes, StandardCharsets.UTF_8)) {\n            writer.write(\"café\");\n        }\n\n        try (var reader = new BufferedReader(new InputStreamReader(\n                new ByteArrayInputStream(bytes.toByteArray()), StandardCharsets.UTF_8))) {\n            System.out.println(reader.readLine());\n        }\n    }\n}\n```",
    practiceTitle: "Name both the payload and the charset",
    practice: "For each input, say whether its contract is raw bytes or text. If it is text, name the charset. “A file” is not enough information to choose the stream family.",
    followups: [
      "What does InputStreamReader do?",
      "Why can a Reader corrupt a binary file?",
      "Does one Reader.read call always return one visible character?",
    ],
  },
  "java-i-o-class-hierarchy": {
    direct: "The classic Java I/O hierarchy has four abstract roots: `InputStream` and `OutputStream` for bytes, plus `Reader` and `Writer` for characters. Concrete sources and destinations are combined with wrapper classes that add buffering, conversion, or higher-level operations.",
    difficulty: "easy",
    minutes: 10,
    quick: [
      "`InputStream` and `OutputStream` are the abstract byte-stream roots.",
      "`Reader` and `Writer` are the abstract character-stream roots.",
      "Concrete classes connect to files, arrays, strings, pipes, or other sources and destinations.",
      "Filter and buffered classes wrap another stream or reader to add behavior.",
      "`InputStreamReader` and `OutputStreamWriter` cross the byte/character boundary through a charset.",
    ],
    interview: "The classic `java.io` hierarchy has four main roots. `InputStream` reads bytes, `OutputStream` writes bytes, `Reader` reads characters, and `Writer` writes characters. These abstract classes provide common operations, while subclasses decide where the data comes from, where it goes, or what extra behavior is added.\n\nEndpoint classes connect to real data. `FileInputStream` and `FileOutputStream` use files, `ByteArrayInputStream` and `ByteArrayOutputStream` use byte arrays, and `StringReader` and `StringWriter` use text in memory. Wrapper classes add features: buffered classes reduce small accesses, data streams handle primitive values, and `PrintWriter` adds formatted text output.\n\nFor example, a UTF-8 file can use the chain `BufferedReader → InputStreamReader → InputStream`. The input stream supplies bytes, `InputStreamReader` decodes them with UTF-8, and `BufferedReader` adds efficient character and line reading. `OutputStreamWriter` performs the opposite bridge from characters to bytes.\n\nInheritance tells whether the data is bytes or characters and whether it flows in or out. Composition chooses the endpoint, charset conversion, buffering, and formatting. Code normally reads through and closes the outermost owned wrapper because standard wrappers close the stream below them. If an API only lends a stream, however, the caller must follow that API's ownership rule instead of closing it automatically.",
    deepTitle: "Inheritance gives a contract; wrappers build the pipeline",
    deep: "A method that accepts `InputStream` can consume a file, socket, byte array, decompressor, or a test double because every source follows the same read contract. That polymorphism is the value of the abstract roots.\n\nWrappers let behavior be stacked without creating a class for every combination. A buffer can wrap a file source or a network source; a data decoder can sit above either. The ordering matters because each layer sees the representation supplied by the layer beneath it.\n\nConvenience factories such as `Files.newBufferedReader` can assemble a common pipeline without exposing every object, but the same family and ownership rules still apply.",
    visualType: "concept_map",
    visualTitle: "Four roots, endpoints, wrappers, and bridges",
    visual: "```mermaid\nflowchart TD\n  I[InputStream: bytes in] --> IS[File / byte array / socket source]\n  O[OutputStream: bytes out] --> OD[File / byte array / socket destination]\n  R[Reader: characters in] --> RS[String / file text source]\n  W[Writer: characters out] --> WD[String / file text destination]\n  I --> IR[InputStreamReader + charset]\n  IR --> R\n  W --> OW[OutputStreamWriter + charset]\n  OW --> O\n  I --> BI[Buffered / Data / Filter InputStream]\n  R --> BR[Buffered / Filter Reader]\n```",
    codeTitle: "Compose a text-reading pipeline explicitly",
    code: "```java\nimport java.io.BufferedReader;\nimport java.io.InputStreamReader;\nimport java.nio.charset.StandardCharsets;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\n\nclass IoHierarchy {\n    public static void main(String[] args) throws Exception {\n        Path file = Files.createTempFile(\"hierarchy-\", \".txt\");\n        Files.writeString(file, \"first line\\nsecond line\", StandardCharsets.UTF_8);\n        try (var input = Files.newInputStream(file);\n             var decoder = new InputStreamReader(input, StandardCharsets.UTF_8);\n             var reader = new BufferedReader(decoder)) {\n            System.out.println(reader.readLine());\n        } finally {\n            Files.deleteIfExists(file);\n        }\n    }\n}\n```",
    practiceTitle: "Build the chain from four questions",
    practice: "Ask: input or output, bytes or text, which endpoint, and which extra behavior? “Input, text, file, buffered line reading” leads naturally to a buffered Reader over a charset decoder and byte source.",
    followups: [
      "What are the four abstract roots in classic Java I/O?",
      "Why are buffered streams wrappers rather than separate endpoints?",
      "Which classes bridge bytes and characters?",
    ],
  },
  "java-i-o-read-and-write-methods": {
    direct: "Java I/O offers single-unit, array, and array-slice `read` and `write` methods. Reads return the actual number transferred—or `-1` at end of input for a non-empty request—so loops must use that count; writes must send only the valid portion of the buffer.",
    difficulty: "easy",
    minutes: 10,
    quick: [
      "`InputStream.read()` returns an `int`: byte value `0..255`, or `-1` at end of stream.",
      "`read(byte[], off, len)` returns the actual byte count and may return fewer than `len`.",
      "Write only the valid region with `write(buffer, off, count)`.",
      "Reader and Writer have parallel methods for `char[]` and character values.",
      "Use bulk reads for normal transfer; single-unit loops add avoidable method and I/O overhead.",
    ],
    interview: "Java stream reads come in single-value and bulk forms. `InputStream.read()` returns an `int` so it can represent byte values from 0 to 255 and still use `-1` for end of input. `read(byte[])` and `read(byte[], offset, length)` return the number of bytes actually placed in the array, which may be smaller than requested.\n\n`OutputStream.write(int)` writes the low eight bits of the value. Its array overloads write a whole array or a selected range. After a bulk read, the safe pattern is `out.write(buffer, 0, count)`. Writing the whole buffer can copy old bytes left from the previous read.\n\nFor example, a six-byte source read through a four-byte buffer may return `4`, then `2`, then `-1`. The program writes four bytes after the first read and only two after the second. It must not assume that one read fills the buffer, especially for a socket or another source that may return partial data. `Reader` and `Writer` use the same basic pattern with `char[]`.\n\nConvenience methods such as `readNBytes`, `readAllBytes`, and `transferTo` avoid common loop mistakes, but their memory and blocking behavior still matters. `readAllBytes` is suitable only for bounded input. The central rule is to check `-1`, respect the returned count, and keep reading until the required amount or end condition is reached.",
    deepTitle: "A read describes progress, not a complete message",
    deep: "Stream boundaries do not preserve application message boundaries. One socket read can return half a header, a header plus part of a body, or several small messages, depending on buffering and timing. The application protocol must define framing through a length, delimiter, end-of-stream, or another rule.\n\nEven file reads should use the returned count because the abstract InputStream contract allows partial results. Code that happens to work with one FileInputStream can fail when reused with a socket, decompressor, rate-limited wrapper, or test stream.\n\n`available()` is not a total-size method. It estimates data that can be read without blocking and can legally return zero while more data will arrive later.",
    visualType: "trace",
    visualTitle: "One buffer, three read results",
    visual: "| Call | Returned count | Valid buffer region | Correct action |\n|---|---:|---|---|\n| 1 | `4` | indexes `0..3` | `write(buffer, 0, 4)` |\n| 2 | `2` | indexes `0..1` | `write(buffer, 0, 2)` |\n| 3 | `-1` | none | stop loop |",
    codeTitle: "Copy exactly the bytes each read produced",
    code: "```java\nimport java.io.ByteArrayInputStream;\nimport java.io.ByteArrayOutputStream;\nimport java.nio.charset.StandardCharsets;\n\nclass ReadWriteMethods {\n    public static void main(String[] args) throws Exception {\n        byte[] source = \"abcdef\".getBytes(StandardCharsets.UTF_8);\n        try (var in = new ByteArrayInputStream(source);\n             var out = new ByteArrayOutputStream()) {\n            byte[] buffer = new byte[4];\n            int count;\n            while ((count = in.read(buffer, 0, buffer.length)) != -1) {\n                out.write(buffer, 0, count);\n            }\n            System.out.println(out.toString(StandardCharsets.UTF_8));\n        }\n    }\n}\n```",
    practiceTitle: "Trace the last short read",
    practice: "Test a copy loop with input whose size is not a multiple of the buffer length. If extra or repeated bytes appear, the code probably writes the full buffer instead of the returned count.",
    followups: [
      "Why does InputStream.read return int instead of byte?",
      "Can a read return fewer bytes than requested before end of stream?",
      "Why is InputStream.available not the full content length?",
    ],
  },
  "closing-java-streams": {
    direct: "Streams must be closed to release owned operating-system resources and finish buffered output. Use try-with-resources so closing happens on success and failure; close the outer owned wrapper, and do not close a borrowed stream whose lifetime belongs to another component.",
    difficulty: "easy",
    minutes: 9,
    quick: [
      "Closing releases owned resources such as file descriptors, sockets, native buffers, or file handles.",
      "Closing an output wrapper also completes its normal flush/close path, but explicit error handling still matters.",
      "Try-with-resources closes every declared resource even when the body throws.",
      "Standard wrapper chains are normally closed from the outermost object, which closes the wrapped resource.",
      "Ownership decides who closes: close resources you open, not borrowed streams unless the contract transfers ownership.",
    ],
    interview: "Closing a Java stream ends its lifetime and releases the resource behind it. File and socket streams can hold operating-system file descriptors or network connections. If a program leaks enough of them, later opens can fail. Output streams and writers may also have buffered data that must be finished before the resource is released.\n\nTry-with-resources is the normal solution for a stream owned by the method. Java closes every declared resource when the block ends, even if reading or writing throws an exception. Resources close in reverse declaration order, and if both the work and closing fail, the close failure is kept as a suppressed exception.\n\nFor example, a `BufferedWriter` returned by `Files.newBufferedWriter(path)` should be opened in try-with-resources. The program writes the text inside the block, and Java closes the writer afterward. Closing the outer wrapper normally flushes its pending characters and closes the file stream below it.\n\nThe important boundary is ownership. Close a stream that your code opens, but do not close a stream that another API only lends unless its contract says you own it. `flush()` makes buffered output visible while keeping the resource open; `close()` ends its use. Some in-memory streams have a no-op close, but that special case is not a reason to ignore closing for files, sockets, or format wrappers.",
    deepTitle: "Close can fail after the work appears complete",
    deep: "Buffered output delays some writes, so an error can surface only during flush or close. Treat that close failure as part of the operation's outcome when durability matters. Logging “saved” before the resource closes can report success too early.\n\nTry-with-resources handles two simultaneous failures without discarding either. The exception from the body remains primary, and failures from close are attached through `getSuppressed()`. The older finally pattern often overwrote the original failure or forgot one branch.\n\nGarbage collection is not a resource-lifetime mechanism. It does not promise prompt reclamation of external handles, and a process can exhaust descriptors long before heap pressure triggers collection.",
    visualType: "flow_diagram",
    visualTitle: "Resource ownership from open to close",
    visual: "```mermaid\nflowchart LR\n  O[Open owned resource] --> T[Enter try-with-resources]\n  T --> U[Use stream or writer]\n  U --> C[Automatic close]\n  C --> F[Flush pending output where applicable]\n  F --> R[Release external resource]\n  U -->|body fails| C\n  C -->|close also fails| S[Attach suppressed exception]\n```",
    codeTitle: "Let the resource boundary enclose the completed write",
    code: "```java\nimport java.nio.charset.StandardCharsets;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\n\nclass ClosingStreams {\n    public static void main(String[] args) throws Exception {\n        Path file = Files.createTempFile(\"close-demo-\", \".txt\");\n        try {\n            try (var writer = Files.newBufferedWriter(file, StandardCharsets.UTF_8)) {\n                writer.write(\"complete\");\n            }\n            System.out.println(Files.readString(file, StandardCharsets.UTF_8));\n        } finally {\n            Files.deleteIfExists(file);\n        }\n    }\n}\n```",
    practiceTitle: "Mark ownership at method boundaries",
    practice: "If a method accepts an OutputStream, decide whether it borrows the stream or takes ownership. Put that rule in the API contract; otherwise one caller may leak it while another unexpectedly loses a shared stream.",
    followups: [
      "What is the difference between flush and close?",
      "How does try-with-resources preserve two exceptions?",
      "Should a method close a stream supplied by its caller?",
    ],
  },
  "java-io-vs-java-nio": {
    direct: "`java.io` centers on streams, readers, and writers for straightforward sequential I/O. `java.nio` adds buffers, channels, charsets, selectors, memory mapping, and the NIO.2 `Path`/`Files` API. NIO is not automatically non-blocking; only APIs designed for it, such as selectable channels, provide that mode.",
    difficulty: "medium",
    minutes: 10,
    quick: [
      "`java.io` uses stream and reader/writer abstractions that are simple for sequential work.",
      "NIO uses buffers and channels and adds random access, mapping, scattering/gathering, and channel interoperation.",
      "Selectors multiplex selectable network channels in non-blocking mode.",
      "Not every NIO API is non-blocking: `FileChannel` operations can block, and `Files` calls are ordinary file-system calls.",
      "NIO.2 adds `Path`, `Files`, file attributes, tree walking, watching, and provider-based file systems.",
    ],
    interview: "The classic `java.io` API is mainly stream-based. `InputStream` and `OutputStream` move bytes, while `Reader` and `Writer` move characters. This model is simple for sequential work such as reading a configuration file, writing a report, or processing one socket connection.\n\n`java.nio` adds channels, buffers, selectors, and the modern `Path` and `Files` APIs. A channel can support reading, writing, or both, and data commonly moves through a `ByteBuffer` whose position, limit, and capacity control the operation. `FileChannel` also supports features such as random access and memory mapping.\n\nFor example, `Files.readString(path, UTF_8)` is the simplest choice for a small text file. `FileChannel` is useful when a program must jump to a particular file position. A server with many simultaneous connections may configure `SocketChannel` as non-blocking and use a `Selector` so one thread can watch many channels. NIO itself is not automatically non-blocking; a regular `FileChannel` is commonly blocking.\n\nThe two API families can work together. `Files.newInputStream(path)` returns a classic stream, while `Channels.newInputStream(channel)` adapts a channel. Neither package is always faster or better. Use the simplest API that meets the need, and choose NIO features when modern path handling, random access, explicit buffers, multiplexing, or asynchronous work provides a real benefit.",
    deepTitle: "Blocking behavior belongs to a specific operation and channel mode",
    deep: "“NIO means non-blocking I/O” is a memorable but false expansion. NIO introduced buffers and channels, and only selectable channels can participate in selector-driven non-blocking readiness. FileChannel is not selectable. Asynchronous channels use a different completion model with Future or CompletionHandler.\n\nA ByteBuffer has position, limit, and capacity. Channel reads advance the position as bytes arrive; `flip()` changes the buffer from filling mode to draining mode by making the former position the new limit and resetting position to zero. Forgetting that state transition is a common source of empty or stale reads.\n\nSelectors can reduce the need for one blocked platform thread per connection, but they add state-machine complexity. Simple blocking I/O—especially with modern lightweight-thread strategies—can still be the clearer architecture.",
    visualType: "comparison_table",
    visualTitle: "Choose an API by capability, not by age",
    visual: "| Need | Useful abstraction | Important boundary |\n|---|---|---|\n| Sequential bytes/text | Streams, Readers, Writers | Blocking is often acceptable and clear |\n| Modern file operations | `Path` and `Files` | NIO package does not imply non-blocking |\n| Random-access file data | `FileChannel` + `ByteBuffer` | FileChannel can block |\n| Many readiness-driven sockets | Selectable channels + `Selector` | Only selectable channels use this model |\n| Completion-based I/O | Asynchronous channels | Different API from selector readiness |",
    codeTitle: "Read through a FileChannel and ByteBuffer",
    code: "```java\nimport java.nio.ByteBuffer;\nimport java.nio.channels.FileChannel;\nimport java.nio.charset.StandardCharsets;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\nimport java.nio.file.StandardOpenOption;\n\nclass IoVsNio {\n    public static void main(String[] args) throws Exception {\n        Path file = Files.writeString(\n                Files.createTempFile(\"nio-demo-\", \".txt\"), \"channel\");\n        try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {\n            ByteBuffer buffer = ByteBuffer.allocate(16);\n            channel.read(buffer);\n            buffer.flip();\n            System.out.println(StandardCharsets.UTF_8.decode(buffer));\n        } finally {\n            Files.deleteIfExists(file);\n        }\n    }\n}\n```",
    practiceTitle: "Remove the package-name shortcut",
    practice: "For a proposed NIO design, name the actual capability being used: modern path operations, random access, memory mapping, selector readiness, or asynchronous completion. If none applies, a simple stream may be the clearer choice.",
    followups: [
      "Is FileChannel non-blocking?",
      "What does ByteBuffer.flip do?",
      "When is a Selector useful?",
    ],
  },
};

for (const entry of entries) {
  const lesson = lessons[entry.slug];
  if (!lesson) continue;
  entry.direct_answer = lesson.direct;
  entry.layout_type = "concept-and-io-pipeline";
  entry.difficulty = lesson.difficulty;
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
console.log(`Curated ${Object.keys(lessons).length} Java stream-model lessons; preserved IDs, slugs, questions, and order.`);
