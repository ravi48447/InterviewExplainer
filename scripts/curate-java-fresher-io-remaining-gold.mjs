#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = path.join(
  repoRoot,
  "content/java-backend-fresher/java-io-basics",
);

const paragraphs = (...parts) => parts.join("\n\n");
const java = (source) => `\`\`\`java\n${source}\n\`\`\``;
const mermaid = (source) => `\`\`\`mermaid\n${source}\n\`\`\``;

const lessons = {
  "character-streams": {
    "java-character-streams-overview": {
      direct: "Character streams are Java's text I/O abstractions. `Reader` consumes characters and `Writer` produces them; byte-to-text bridges apply a charset, while buffering and formatting wrappers add higher-level operations.",
      minutes: 10,
      quick: [
        "`Reader` is the abstract character-input class; `Writer` is the abstract character-output class.",
        "`InputStreamReader` decodes bytes and `OutputStreamWriter` encodes characters with a named charset.",
        "`BufferedReader` and `BufferedWriter` reduce small underlying operations and add convenient text methods.",
        "`StringReader` and `StringWriter` use in-memory text; `PrintWriter` adds formatted output.",
        "Use an explicit charset such as UTF-8 whenever text crosses a byte boundary.",
      ],
      interview: paragraphs(
        "Character streams are Java's abstraction for reading and writing text. `Reader` is the base class for character input, and `Writer` is the base class for character output. Their API works with Java `char` values and strings, so it is different from `InputStream` and `OutputStream`, which move raw bytes.",
        "Text still becomes bytes when it is stored in a file or sent over a network. `InputStreamReader` is the bridge that decodes bytes into characters with a `Charset`; `OutputStreamWriter` performs the reverse encoding. `FileReader` and `FileWriter` are file-oriented conveniences. Constructors without a charset use the default charset, so portable code normally passes `StandardCharsets.UTF_8` or uses `Files.newBufferedReader` and `Files.newBufferedWriter` with an explicit charset.",
        "Wrappers add capabilities. `BufferedReader` groups reads and provides `readLine`, while `BufferedWriter` groups writes and provides `newLine`. `StringReader` and `StringWriter` work entirely in memory. `PrintWriter` supplies `print`, `println`, and `printf`, but its output methods record I/O failures instead of throwing them directly; `checkError()` must be used when failure matters.",
        "For example, a service can open a UTF-8 configuration file with `Files.newBufferedReader`, read each line, and let try-with-resources close the reader. The charset handles decoding, the buffer avoids many tiny file operations, and the application handles the meaning of each line.",
        "Character streams are for text, not arbitrary binary content. They also operate on UTF-16 code units, so one visible Unicode character can require two `char` values. The practical rule is to choose a Reader or Writer for text, state the charset at byte boundaries, add buffering when useful, and close every owned external resource.",
      ),
      deepTitle: "How bytes become Java text",
      deep: paragraphs(
        "A file does not contain Java characters; it contains bytes. A charset defines how byte sequences represent text. When an `InputStreamReader` reads UTF-8, its decoder may need several input bytes before it can produce one character. On output, an `OutputStreamWriter` performs the inverse operation and may retain bytes internally until it is flushed or closed.",
        "The `Reader` API reports UTF-16 code units. Most everyday text can be processed as strings, but code that counts user-perceived characters should not assume that one `char` equals one Unicode code point or one grapheme. Supplementary code points occupy a surrogate pair. This is a property of Java's text model, not a decoding failure.",
        "Buffering is a separate concern from decoding. An `InputStreamReader` knows how bytes map to characters; a `BufferedReader` placed above it reduces calls to the underlying reader and adds line-oriented operations. Closing the outer reader closes the wrapped reader, which in turn closes its underlying byte stream. The same layering applies on output.",
        "Encoding errors need an explicit policy in strict systems. Convenience readers usually use the decoder's replacement behavior for malformed input. When an application must reject malformed data, it can configure a `CharsetDecoder` with `CodingErrorAction.REPORT` and pass it to an `InputStreamReader`. This keeps decoding policy near the byte-to-text boundary instead of scattering assumptions through business logic.",
      ),
      visualType: "flow_diagram",
      visualTitle: "A character-stream pipeline separates transport, charset, and buffering",
      visual: mermaid("flowchart LR\n  B[UTF-8 bytes] --> D[InputStreamReader decodes]\n  D --> R[BufferedReader reads text]\n  R --> A[Application uses Strings]\n  A --> W[BufferedWriter writes text]\n  W --> E[OutputStreamWriter encodes]\n  E --> O[UTF-8 bytes]"),
      codeTitle: "Decode UTF-8 explicitly through a reader pipeline",
      code: java(`import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

class CharacterStreamOverview {
    public static void main(String[] args) throws Exception {
        byte[] bytes = "naïve café".getBytes(StandardCharsets.UTF_8);
        try (var reader = new BufferedReader(new InputStreamReader(
                new ByteArrayInputStream(bytes), StandardCharsets.UTF_8))) {
            String text = reader.readLine();
            if (!"naïve café".equals(text)) throw new AssertionError(text);
            System.out.println(text);
        }
    }
}`),
      followups: [
        "How is InputStreamReader different from BufferedReader?",
        "Why should a charset be explicit at a byte boundary?",
        "Does one Java char always represent one visible character?",
      ],
    },
    "reading-text-files-line-by-line": {
      direct: "Open the file with `Files.newBufferedReader(path, charset)` inside try-with-resources, call `readLine()` until it returns `null`, and process each line without loading the whole file.",
      minutes: 9,
      quick: [
        "`Files.newBufferedReader(path, UTF_8)` creates a buffered, explicitly decoded text reader.",
        "Call `readLine()` repeatedly and stop when it returns `null` for end of input.",
        "The returned string excludes the line terminator and may be empty for a blank line.",
        "Use try-with-resources because the reader owns an open file resource.",
        "`Files.lines` is lazy too, but its returned stream must also be closed.",
      ],
      interview: paragraphs(
        "The usual way to read a text file line by line is `Files.newBufferedReader(path, charset)` in a try-with-resources statement. It returns a `BufferedReader`, which combines charset decoding, buffering, and the `readLine()` operation in one practical API. Passing UTF-8 makes the file contract independent of the machine's default charset.",
        "A loop calls `readLine()` and processes the returned string immediately. The method removes the line-ending characters and returns `null` only when end of input is reached. An empty string is therefore a real blank line and must not be mistaken for end of file. Since each line can be released after processing, this approach avoids holding the entire file in memory.",
        "For example, a service can read an application log, skip blank lines, and count lines beginning with `ERROR`. The reader is closed even if parsing a later line throws. IOException still needs to be handled or declared because opening, decoding, reading, and closing can fail.",
        "`Files.lines(path, charset)` is an alternative that returns a lazy `Stream<String>`. It is useful for a clear stream pipeline, but the stream wraps an open file and therefore also belongs in try-with-resources. Terminal operations may report a later read failure as `UncheckedIOException`, which differs from the checked exception used by the explicit loop.",
        "Line-by-line reading bounds total memory but not necessarily per-line memory: a malicious file can contain one enormous line. Applications handling untrusted data may need a size-aware parser rather than `readLine()`. For normal bounded text files, the buffered-reader loop is explicit, portable, and easy to debug.",
      ),
      deepTitle: "A line API defines separators, lifetime, and memory behavior",
      deep: paragraphs(
        "`BufferedReader.readLine()` recognizes a line feed, a carriage return, or a carriage return followed by a line feed. It returns the characters before that separator and does not include the separator. Consequently, the caller cannot recover the original choice of line ending from the returned strings alone. If exact byte preservation matters, line-oriented character reading is the wrong abstraction.",
        "The loop is incremental across the file, but a single call still creates a string for one complete line. A 10-gigabyte file made of short records can be processed with small memory, while a single 10-gigabyte line cannot. Record formats with hard limits should enforce them while scanning characters or bytes rather than after `readLine()` has already allocated the record.",
        "A stream returned by `Files.lines` does not eagerly read the file. Its close method releases the file, so returning that stream from a method transfers a resource-lifetime problem to the caller. Consuming it entirely inside the method's own try-with-resources block is usually easier to reason about.",
        "Finally, decoding and record parsing are separate failure points. An explicit charset states the encoding agreement; application code still decides whether a line is valid. Keeping those responsibilities separate produces clearer error messages, such as “invalid UTF-8 input” versus “missing field on line 12.”",
      ),
      visualType: "flow_diagram",
      visualTitle: "Read, classify, and release one line at a time",
      visual: mermaid("flowchart TD\n  O[Open UTF-8 BufferedReader] --> R[readLine]\n  R -->|String| P[Process this line]\n  P --> R\n  R -->|null| C[Close reader]\n  R -->|IOException| C"),
      codeTitle: "Count matching lines without loading the file",
      code: java(`import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

class ReadTextLineByLine {
    public static void main(String[] args) throws Exception {
        Path file = Files.writeString(Files.createTempFile("events-", ".log"),
                "INFO start\\nERROR disk\\n\\nERROR network\\n", StandardCharsets.UTF_8);
        try {
            int errors = 0;
            try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.startsWith("ERROR")) errors++;
                }
            }
            if (errors != 2) throw new AssertionError(errors);
            System.out.println(errors);
        } finally {
            Files.deleteIfExists(file);
        }
    }
}`),
      followups: [
        "How does readLine distinguish a blank line from end of file?",
        "Why must a Stream returned by Files.lines be closed?",
        "Does line-by-line reading protect against one extremely long line?",
      ],
    },
    "writing-text-files-in-java": {
      direct: "Write text with `Files.writeString` for a small complete value or `Files.newBufferedWriter` for incremental output, always choosing the charset and open options that match create, replace, or append behavior.",
      minutes: 9,
      quick: [
        "Use `Files.writeString` for small complete text and `Files.newBufferedWriter` for incremental writes.",
        "Pass UTF-8 explicitly when the file's encoding is part of its contract.",
        "Default writing creates the file if needed and truncates an existing regular file.",
        "Use `APPEND` only when retaining old content is intentional; use `CREATE_NEW` when overwrite must fail.",
        "Close or flush the writer before another component is expected to read complete output.",
      ],
      interview: paragraphs(
        "Java NIO provides two straightforward text-writing styles. `Files.writeString(path, text, charset, options)` is convenient when the complete, reasonably small string is already in memory. `Files.newBufferedWriter(path, charset, options)` returns a Writer for producing text incrementally. Both encode Java characters into bytes using the selected charset.",
        "The open options are part of correctness. Without explicit options, these methods create a missing file and truncate an existing file for writing. `APPEND` keeps existing bytes and adds new output, while `CREATE_NEW` fails if the target already exists. A program should not rely on an accidental default when overwriting could destroy important data.",
        "For example, a report generator can open a UTF-8 BufferedWriter, write a header, call `newLine()`, and then write each row as it is produced. Try-with-resources closes the writer on every exit path. Closing also flushes buffered characters through the encoder to the file; calling `flush()` is useful only when the writer must remain open while another consumer needs current data.",
        "A successful series of writes is not the same as atomic publication. If generation fails after truncating the destination, readers may see a partial report. Important replacement workflows commonly write a sibling temporary file, validate it, and then move it into place, requesting an atomic move only where the file-system provider supports it.",
        "Text writers do not escape CSV, JSON, HTML, or another application format automatically. The application or a format library still owns quoting, schema, and validation. Choose the text API for the output size, choose the charset and file options explicitly, and add a publication strategy when partial output would be harmful.",
      ),
      deepTitle: "Writing text has both an encoding contract and a publication contract",
      deep: paragraphs(
        "A Writer accepts characters, but a file stores bytes. The charset encoder decides which byte sequence is written and how unmappable input is handled. UTF-8 can represent every Unicode code point, which makes it a reliable interchange default, but the reader and writer still need to agree on that encoding. An explicit charset makes the agreement reviewable.",
        "Buffering improves the shape of underlying writes, not the logical format. `BufferedWriter.newLine()` emits the platform line separator; writing `\n` emits a fixed line feed. A cross-platform wire format may require a specific separator, while a local human-readable file may prefer the platform convention. That choice belongs to the format contract.",
        "Append is not record-safe merely because the file is opened with `APPEND`. Multiple writers, partial records, process crashes, and encoding boundaries can still produce ambiguous output. Applications needing durable logs normally use a logging system that coordinates concurrency, rotation, formatting, and failure handling.",
        "For replace-in-place output, temporary construction narrows the visible failure window. It also creates new decisions: temporary-file location, permissions, cleanup, and fallback when `ATOMIC_MOVE` is unsupported. A teaching example can show a direct write, but production code should match the stronger guarantees its readers actually require.",
      ),
      visualType: "flow_diagram",
      visualTitle: "Choose the writing path and publication guarantee",
      visual: mermaid("flowchart TD\n  T[Text to write] --> S{Already one small String?}\n  S -->|Yes| W[Files.writeString]\n  S -->|No| B[BufferedWriter incremental writes]\n  W --> P{Partial target acceptable?}\n  B --> P\n  P -->|Yes| F[Write final path]\n  P -->|No| M[Write temp, validate, then move]"),
      codeTitle: "Write a UTF-8 report incrementally",
      code: java(`import java.io.BufferedWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

class WriteTextFile {
    public static void main(String[] args) throws Exception {
        Path report = Files.createTempFile("report-", ".txt");
        try {
            try (BufferedWriter writer = Files.newBufferedWriter(report, StandardCharsets.UTF_8)) {
                writer.write("name,score");
                writer.newLine();
                writer.write("Mira,98");
                writer.newLine();
            }
            String text = Files.readString(report, StandardCharsets.UTF_8);
            if (!text.contains("Mira,98")) throw new AssertionError(text);
            System.out.print(text);
        } finally {
            Files.deleteIfExists(report);
        }
    }
}`),
      followups: [
        "What do the default Files.newBufferedWriter options do to an existing file?",
        "When is flush useful before close?",
        "How would you avoid exposing a partially generated replacement file?",
      ],
    },
    "printwriter-in-java": {
      direct: "`PrintWriter` is a character writer with convenient `print`, `println`, `printf`, and `format` methods. Use it for human-readable or formatted text when its recorded-error model is acceptable and call `checkError()` when output failure matters.",
      minutes: 9,
      quick: [
        "`PrintWriter` adds convenient printing and locale-aware formatting to a character output destination.",
        "Its printing methods do not throw `IOException`; they set an internal error flag.",
        "Call `checkError()` when the program must know whether output failed.",
        "Auto-flush applies to `println`, `printf`, or `format`, not every `print` or `write` call.",
        "Prefer a regular Writer when checked I/O failure must propagate directly.",
      ],
      interview: paragraphs(
        "`PrintWriter` is a Writer designed for convenient text output. It supplies overloaded `print` and `println` methods for values, plus `printf` and `format` for formatted text. It can wrap another Writer or output stream, and modern constructors allow a charset when it opens a file or byte destination itself.",
        "Its most important behavior is error handling. Methods such as `print`, `println`, and `write` do not propagate `IOException`; the object records that trouble occurred. `checkError()` flushes the writer when it is still open and returns whether an error has been recorded. Code that simply prints and never checks can silently miss a disk, pipe, or network failure.",
        "For example, a command-line report can use `printf(\"%-12s %4d%n\", name, count)` to align columns. A servlet-style text response may also favor the familiar printing API. If the destination is a critical data file where the caller must catch the precise IOException, a `BufferedWriter` or another ordinary Writer usually gives a clearer failure contract.",
        "The optional auto-flush flag is narrower than its name suggests. Automatic flushing occurs after `println`, `printf`, or `format`; it does not occur after every `print` or `write`. Flushing also only pushes buffered data toward the underlying destination—it is not a general durability guarantee for storage.",
        "`PrintWriter` formats characters; it does not make JSON, CSV, SQL, or HTML safe. Those formats need correct escaping or a dedicated library. It is best used when convenient presentation is the goal, the charset and destination ownership are clear, and the program either checks the error flag or deliberately treats output as best effort.",
      ),
      deepTitle: "PrintWriter trades checked exceptions for a sticky error state",
      deep: paragraphs(
        "Most Writer implementations report an output problem immediately by throwing `IOException`. `PrintWriter` follows a different design inherited from Java's printing APIs: its output methods catch I/O failures and remember that an error happened. Once set, the trouble state remains observable through `checkError()`. This makes call sites tidy, but it moves responsibility from exception handling to an explicit status check.",
        "That trade-off suits destinations where printing is naturally best effort or where an outer framework checks the stream. It is riskier in code that must distinguish disk full, broken connection, permission failure, and successful completion. A boolean error flag cannot express the original failure as precisely as a caught IOException.",
        "Auto-flush also needs exact wording. When enabled, `println`, `printf`, and `format` trigger a flush after their output. Plain `print`, `write`, and even an embedded newline character do not receive that automatic behavior. Calling close flushes and closes the owned underlying destination according to the wrapper chain.",
        "Finally, formatting and serialization are different jobs. `printf` applies a format string and locale rules, but it does not quote delimiters or validate structured data. Use a CSV or JSON library for machine-readable records, and reserve PrintWriter for deliberately formatted text or adapters that require its API.",
      ),
      visualType: "flow_diagram",
      visualTitle: "Printing records failure instead of throwing it",
      visual: mermaid("flowchart LR\n  A[print / println / printf] --> P[PrintWriter formats text]\n  P --> D[Underlying destination]\n  D -->|success| O[Output continues]\n  D -->|IOException| E[Sticky error flag]\n  C[checkError] --> F[Flush and report flag]\n  E --> F"),
      codeTitle: "Observe PrintWriter's recorded-error behavior",
      code: java(`import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;

class PrintWriterErrors {
    static final class FailingWriter extends Writer {
        public void write(char[] value, int offset, int length) throws IOException {
            throw new IOException("destination failed");
        }
        public void flush() { }
        public void close() { }
    }

    public static void main(String[] args) {
        PrintWriter out = new PrintWriter(new FailingWriter());
        out.println("report"); // no IOException is thrown here
        boolean failed = out.checkError();
        if (!failed) throw new AssertionError("failure was not recorded");
        System.out.println(failed);
        out.close();
    }
}`),
      followups: [
        "Why does PrintWriter require checkError for reliable output detection?",
        "Which operations trigger auto-flush?",
        "When is BufferedWriter a better choice than PrintWriter?",
      ],
    },
  },
  "nio-path-files": {
    "path-and-paths-get": {
      direct: "`Path` is an immutable, provider-specific representation of a hierarchical path. Create one with `Path.of(...)` or the older `Paths.get(...)`; creating a Path is normally syntactic and does not create or verify a file.",
      minutes: 9,
      quick: [
        "`Path` represents path components; it does not itself mean that a file exists.",
        "Use `Path.of(first, more...)`; `Paths.get` delegates to the same default-file-system operation.",
        "A Path may be relative or absolute and belongs to a particular file-system provider.",
        "Operations such as `getFileName`, `getParent`, and `resolve` usually manipulate syntax without I/O.",
        "Use `toAbsolutePath` for an absolute form and `toRealPath` only when you need file-system validation and link resolution.",
      ],
      interview: paragraphs(
        "`java.nio.file.Path` is an immutable representation of a path in a file system. It is made of ordered name elements and may be absolute, such as a rooted operating-system path, or relative to some later base. A Path is a value used by the NIO file APIs; constructing one does not create a file and normally does not check whether anything exists there.",
        "Modern Java code creates default-file-system paths with `Path.of(\"logs\", \"app.log\")`. `Paths.get(...)` remains valid and delegates to `Path.of`. A `file:` URI can also be converted with `Path.of(uri)`. Other providers, such as a ZIP file system, can produce Paths with provider-specific rules, so code should not build paths by manual string concatenation.",
        "Path offers structural operations such as `getFileName`, `getParent`, `getNameCount`, `resolve`, `relativize`, and `normalize`. These mostly work on path syntax. `toAbsolutePath()` creates an absolute form, commonly using the current working directory for a relative path, but still does not promise that the target exists.",
        "For example, `Path.of(\"reports\").resolve(\"daily.txt\")` represents `reports/daily.txt` using the platform's path rules. The program can pass it to `Files.createDirectories`, `Files.newBufferedWriter`, or another operation when it is ready to access storage.",
        "`toRealPath()` is different: it performs file-system I/O, requires the target to exist, removes redundant elements, and resolves symbolic links by default. Because links and permissions affect the result, it can throw IOException. Use ordinary Path operations to describe locations; use Files or `toRealPath` only when the application intentionally needs an observed file-system fact.",
      ),
      deepTitle: "A Path is a name in a provider, not an open file",
      deep: paragraphs(
        "Separating a path value from a file resource is one of NIO's most useful ideas. A Path can be parsed, compared, stored, and combined before a file is created. The actual I/O begins when it is passed to operations such as `Files.readAttributes`, `Files.newInputStream`, or `toRealPath`. That distinction also explains why a Path may identify a target that never exists.",
        "Path rules come from its file-system provider. Separators, roots, case sensitivity, valid characters, and URI conversion are not universal string rules. Two Paths from different providers cannot necessarily be resolved or relativized together. Keeping values as Path objects lets the provider enforce its own semantics.",
        "`toAbsolutePath` and `toRealPath` answer different questions. The first produces an absolute spelling, which may still contain a nonexistent target or symbolic links. The second asks the file system for a canonicalized existing location and can change as links or the file system change. It is an I/O observation, not a permanent identity token.",
        "Security-sensitive code must also account for time. Checking a path and then opening it creates a gap in which another actor may replace a link or entry. Where the threat model includes such races, use constrained directories, appropriate provider APIs, permissions, and handle-based designs rather than treating one earlier `toRealPath` result as an everlasting guarantee.",
      ),
      visualType: "flow_diagram",
      visualTitle: "Path construction is syntactic; file operations observe storage",
      visual: mermaid("flowchart LR\n  S[Path.of components] --> P[Immutable Path value]\n  P --> Y[getParent / resolve / normalize]\n  P --> A[toAbsolutePath]\n  P --> F[Files operation]\n  P --> R[toRealPath]\n  F --> I[File-system I/O]\n  R --> I"),
      codeTitle: "Build a portable path from components",
      code: java(`import java.nio.file.Path;

class PathCreation {
    public static void main(String[] args) {
        Path relative = Path.of("reports", "..", "reports", "daily.txt");
        Path normalized = relative.normalize();
        if (!normalized.endsWith(Path.of("reports", "daily.txt"))) {
            throw new AssertionError(normalized);
        }
        System.out.println(normalized);
    }
}`),
      followups: [
        "Does Path.of create or validate a file?",
        "How do toAbsolutePath and toRealPath differ?",
        "Why should path components not be joined with hard-coded separators?",
      ],
    },
    "files-utility-class-operations": {
      direct: "`Files` is the static utility class for creating, opening, copying, moving, deleting, inspecting, listing, and reading or writing files and directories through `Path` values.",
      minutes: 11,
      quick: [
        "Use `Files` methods with Path values to perform file-system operations.",
        "Common groups are create/open, read/write, copy/move/delete, metadata, and directory traversal.",
        "Convenience whole-file methods are suitable only for bounded data; streams support incremental work.",
        "Options define replacement, append, link, and attribute behavior and should be chosen deliberately.",
        "Do not rely on `exists` followed by another operation as an atomic check; handle the real operation's result.",
      ],
      interview: paragraphs(
        "`java.nio.file.Files` is a final utility class of static methods that perform file-system work using Path values. It complements `Path`: Path describes a location, while Files creates, opens, copies, moves, deletes, lists, reads, writes, and inspects the entry at that location.",
        "The important method families are easier to remember than a flat list. Creation includes `createFile`, `createDirectory`, `createDirectories`, and temporary-file methods. Opening includes `newInputStream`, `newOutputStream`, `newBufferedReader`, and `newBufferedWriter`. Convenience methods such as `readString`, `writeString`, `readAllBytes`, and `readAllLines` handle bounded content. `copy`, `move`, `delete`, and `deleteIfExists` modify entries; `size`, `getLastModifiedTime`, `readAttributes`, and predicates inspect them.",
        "Directory work includes `list` for one level, `walk` for a lazy recursive stream, `find` for filtered traversal, and `walkFileTree` for visitor-based control. Streams returned by listing or walking hold file-system resources and must be closed.",
        "For example, a program can create a temporary directory, create its parent structure, write UTF-8 text, copy the file with `REPLACE_EXISTING`, and move the copy to a final name. Each method can throw IOException, and its options state whether replacement or other behavior is allowed.",
        "Predicates such as `exists` are snapshots and may also return false when existence cannot be determined. Another process can change the path immediately after a check, so code should attempt the intended operation and handle `FileAlreadyExistsException`, `NoSuchFileException`, or another specific failure. Files is a rich toolbox, but correct use still requires size limits, resource closure, link policy, permissions, and concurrency-aware error handling.",
      ),
      deepTitle: "Group Files methods by lifetime and guarantee",
      deep: paragraphs(
        "Some Files calls complete before they return and leave no caller-owned resource, such as `readString` or `copy(Path, Path, ...)`. Others return a stream or channel whose lifetime continues after the call, such as `newInputStream`, `list`, and `walk`. Recognizing that distinction tells the caller whether try-with-resources is required.",
        "Convenience and scalability are also separate. `readAllBytes` and `readString` are concise because they collect the whole result. They are not appropriate for arbitrarily large or attacker-controlled files. A bounded stream, channel, or parser can process content incrementally and enforce limits during the operation.",
        "Options express parts of the file-system contract. `REPLACE_EXISTING`, `COPY_ATTRIBUTES`, `NOFOLLOW_LINKS`, `CREATE_NEW`, and `APPEND` change behavior, but no option turns every multi-step workflow into one atomic transaction. Even a successful move has provider-dependent details; `ATOMIC_MOVE` is a requested guarantee that may be unsupported.",
        "Finally, preflight checks are not locks. `Files.isWritable(path)` cannot guarantee that a later write will succeed, and checking `exists` before create introduces a race. The operation itself is authoritative. Handle its specific exception and design recovery around the state that may remain after partial failure.",
      ),
      visualType: "concept_map",
      visualTitle: "Files operations fall into five practical families",
      visual: mermaid("flowchart TD\n  F[java.nio.file.Files] --> C[Create and open]\n  F --> R[Read and write]\n  F --> M[Copy, move, delete]\n  F --> A[Attributes and predicates]\n  F --> D[List, walk, find]\n  D --> L[Returned streams must close]\n  R --> B[Choose whole-file or incremental]"),
      codeTitle: "Create, write, copy, move, and read with Files",
      code: java(`import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

class FilesOperations {
    public static void main(String[] args) throws Exception {
        Path root = Files.createTempDirectory("files-api-");
        Path source = root.resolve("in/note.txt");
        Path copy = root.resolve("copy.txt");
        Path moved = root.resolve("final.txt");
        try {
            Files.createDirectories(source.getParent());
            Files.writeString(source, "hello", StandardCharsets.UTF_8);
            Files.copy(source, copy, StandardCopyOption.REPLACE_EXISTING);
            Files.move(copy, moved, StandardCopyOption.REPLACE_EXISTING);
            if (!"hello".equals(Files.readString(moved, StandardCharsets.UTF_8))) {
                throw new AssertionError();
            }
            System.out.println(Files.size(moved));
        } finally {
            try (var paths = Files.walk(root)) {
                for (Path path : paths.sorted((a, b) -> b.compareTo(a)).toList()) {
                    Files.deleteIfExists(path);
                }
            }
        }
    }
}`),
      followups: [
        "Which Files methods return resources that the caller must close?",
        "Why is Files.exists followed by Files.createFile race-prone?",
        "When should you avoid readAllBytes or readString?",
      ],
    },
    "files-walk-directory-traversal": {
      direct: "Use `Files.walk(start, maxDepth, options)` inside try-with-resources to obtain a lazy depth-first stream of Paths, filter or process it, and close it so open directory resources are released.",
      minutes: 11,
      quick: [
        "`Files.walk` returns a lazy, depth-first Stream that includes the starting Path.",
        "Close the stream with try-with-resources because traversal may keep directories open.",
        "The default does not follow symbolic links; `FOLLOW_LINKS` changes the graph and can encounter cycles.",
        "Use `maxDepth` to bound recursion and filter with Files predicates when appropriate.",
        "The traversal is weakly consistent, and a later I/O failure may appear as `UncheckedIOException`.",
      ],
      interview: paragraphs(
        "`Files.walk` recursively traverses a directory tree and returns a lazy `Stream<Path>`. The stream visits the starting path and then descendants in depth-first order. Because iteration can keep one or more directories open, the stream must be used in try-with-resources rather than left for garbage collection.",
        "The simple overload walks to unlimited depth without following symbolic links. Another overload accepts `maxDepth` and `FileVisitOption.FOLLOW_LINKS`. A depth of zero yields only the start. Following links can turn the directory structure into a graph; Java attempts to detect cycles and can report `FileSystemLoopException`.",
        "A typical pipeline filters with `Files.isRegularFile(path)`, perhaps narrows by extension, and then maps or processes each path. For example, a cleanup report can walk a temporary tree, count regular `.log` files, and close the stream when the terminal operation completes.",
        "Traversal is weakly consistent. It does not freeze the tree, so files may be added, removed, or replaced during iteration. If opening the start fails, the method throws IOException immediately. If a later lazy access fails after the stream has been returned, the operation can throw `UncheckedIOException` with the original IOException as its cause.",
        "`Files.walk` is concise for stream-style queries, but it is not always the best control structure. `Files.walkFileTree` provides callbacks for pre-visit, file visit, failures, and post-visit, making it clearer for deletion, copying, permission handling, or recovery. Whichever API is chosen, define link behavior, depth, failure policy, concurrent-change expectations, and resource lifetime explicitly.",
      ),
      deepTitle: "A directory walk is a live, lazy view rather than a snapshot",
      deep: paragraphs(
        "The Stream abstraction can make a walk look like an in-memory collection, but its elements are discovered as the terminal operation asks for them. Directories may remain open during that discovery. Closing the stream releases those resources, which is why assigning it to a long-lived field or returning it without an ownership rule is hazardous.",
        "Weak consistency means there is no promise that a changing tree is represented at one instant. A file seen earlier may disappear before metadata is read, and a newly created entry may or may not be visited. Applications that need a stable input set require an immutable publication scheme, a snapshot-capable storage layer, or a separate inventory phase with its own consistency rules.",
        "Symbolic-link handling changes both meaning and safety. Without `FOLLOW_LINKS`, a link is encountered as an entry but its directory target is not descended into. With it, traversal can leave the apparent tree and encounter cycles. Cycle detection itself may require comparing file keys or real paths and can fail with a loop exception.",
        "For destructive algorithms, visitor callbacks are usually easier to reason about. A recursive delete needs post-order directory deletion and an explicit response to visit failures. `walkFileTree` names those lifecycle points, while a compact stream pipeline can hide important partial-failure behavior.",
      ),
      visualType: "flow_diagram",
      visualTitle: "Lazy traversal keeps discovery and processing interleaved",
      visual: mermaid("flowchart TD\n  O[Open Files.walk stream] --> S[Yield start Path]\n  S --> D[Open next directory lazily]\n  D --> P[Yield child Path]\n  P --> F[Filter or process]\n  F --> D\n  D -->|complete| C[Close stream]\n  D -->|late I/O failure| U[UncheckedIOException then close]"),
      codeTitle: "Walk a directory tree and close the stream",
      code: java(`import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

class WalkDirectory {
    public static void main(String[] args) throws Exception {
        Path root = Files.createTempDirectory("walk-");
        try {
            Files.createDirectories(root.resolve("nested"));
            Files.writeString(root.resolve("a.log"), "a", StandardCharsets.UTF_8);
            Files.writeString(root.resolve("nested/b.log"), "b", StandardCharsets.UTF_8);
            Files.writeString(root.resolve("nested/c.txt"), "c", StandardCharsets.UTF_8);

            long logs;
            try (var paths = Files.walk(root)) {
                logs = paths.filter(Files::isRegularFile)
                        .filter(path -> path.getFileName().toString().endsWith(".log"))
                        .count();
            }
            if (logs != 2) throw new AssertionError(logs);
            System.out.println(logs);
        } finally {
            try (var paths = Files.walk(root)) {
                for (Path path : paths.sorted((a, b) -> b.compareTo(a)).toList()) {
                    Files.deleteIfExists(path);
                }
            }
        }
    }
}`),
      followups: [
        "Why must the Stream from Files.walk be closed?",
        "What changes when FOLLOW_LINKS is enabled?",
        "When is walkFileTree clearer than Files.walk?",
      ],
    },
    "path-operations-resolve-relativize": {
      direct: "`resolve` combines a base with another path, `relativize` computes directions from one peer path to another, and `normalize` removes redundant `.` and cancellable `name/..` elements syntactically without touching the file system.",
      minutes: 10,
      quick: [
        "`base.resolve(child)` appends a relative child; an absolute child is returned unchanged.",
        "`from.relativize(to)` creates a relative path that can take `from` to `to` under compatible conditions.",
        "Both paths for `relativize` must be from the same provider and normally both absolute or both relative.",
        "`normalize` removes redundant name elements syntactically and performs no file-system I/O.",
        "Normalization can change meaning around symbolic links; use `toRealPath` when existing-link resolution is required.",
      ],
      interview: paragraphs(
        "`resolve`, `relativize`, and `normalize` are Path operations for composing and simplifying path syntax. They usually do not access the file system, so they can operate on locations that do not exist. Each answers a different question: build a location, describe a route between locations, or remove redundant elements.",
        "`base.resolve(other)` treats `base` as the starting path. If `other` is relative, its elements are appended; if `other` is absolute, the result is normally `other` itself. This is the portable replacement for concatenating directory strings. `base.resolveSibling(name)` instead resolves beside the current path through its parent.",
        "`from.relativize(to)` calculates a relative path that, when resolved against `from`, locates `to` for compatible normalized paths. Both Paths must use the same provider, and the default provider requires both to be absolute or both relative. For `/work/app` to `/work/test`, the result is typically `../test`.",
        "`normalize()` removes `.` and removes a name followed by `..` when possible. For example, `reports/2025/../2026` becomes `reports/2026`. This is purely lexical. If `2025` were a symbolic link, canceling it before access could produce a different real location from traversing the original path.",
        "Use these methods to construct and display Paths, but do not confuse a neat spelling with verified identity. `toRealPath()` performs I/O on an existing target and resolves links by default. Even then, later file-system changes can invalidate assumptions. The safe summary is: resolve composes, relativize describes a route, normalize cleans syntax, and real-path resolution observes storage.",
      ),
      deepTitle: "Lexical equality and file-system identity are different",
      deep: paragraphs(
        "A lexical operation sees only ordered name elements. It can prove that `a/./b` has a redundant dot, but it cannot know whether `a/link/../b` traverses a symbolic link whose target has a different parent. That knowledge requires the file-system provider and an existing path. This is why `normalize()` is useful but not a security canonicalization step by itself.",
        "Relativization also depends on the base being interpreted as a location, not automatically as the parent directory of a file. If `from` is `/work/report.txt`, relativizing to `/work/archive.txt` produces a path relative to `report.txt` as though it were a base path. Call `from.getParent().relativize(to)` when the intended base is the containing directory.",
        "The identity relation is provider-specific. `Path.equals` compares path values according to the provider and does not generally follow links. `Files.isSameFile` asks whether two Paths locate the same existing file and may perform I/O. `toRealPath` produces one real spelling at a moment in time, but it does not lock the target against replacement.",
        "Keeping these layers explicit prevents common bugs: use resolve for construction, normalize for harmless display or known syntactic cleanup, and real operations for facts such as existence, identity, access, or link targets. Then handle the possibility that those facts change.",
      ),
      visualType: "flow_diagram",
      visualTitle: "Three operations answer three different path questions",
      visual: mermaid("flowchart LR\n  B[Base: work/app] --> R[resolve logs/out.txt]\n  R --> O[work/app/logs/out.txt]\n  F[From: work/app] --> L[relativize work/test]\n  L --> P[../test]\n  N[a/./b/../c] --> Z[normalize]\n  Z --> C[a/c]\n  Z -. no file-system access .-> X[Links remain unknown]"),
      codeTitle: "Compose and compare paths without file I/O",
      code: java(`import java.nio.file.Path;

class PathOperations {
    public static void main(String[] args) {
        Path base = Path.of("work", "app");
        Path target = Path.of("work", "test");
        Path resolved = base.resolve("logs").resolve("today.txt");
        Path relative = base.relativize(target);
        Path normalized = Path.of("a", ".", "b", "..", "c").normalize();

        if (!resolved.equals(Path.of("work", "app", "logs", "today.txt"))) throw new AssertionError();
        if (!relative.equals(Path.of("..", "test"))) throw new AssertionError(relative);
        if (!normalized.equals(Path.of("a", "c"))) throw new AssertionError(normalized);
        System.out.println(resolved + " | " + relative + " | " + normalized);
    }
}`),
      followups: [
        "What happens when resolve receives an absolute Path?",
        "Why can normalize change meaning around a symbolic link?",
        "How is Path.equals different from Files.isSameFile?",
      ],
    },
    "watchservice-file-monitoring": {
      direct: "`WatchService` is NIO's low-level directory-change notification API. Register each directory for event kinds, wait for WatchKeys, process and reset each key, and treat events as change hints that may be delayed, coalesced, or overflowed.",
      minutes: 12,
      quick: [
        "Create a WatchService from the file system and register directories, not individual files.",
        "Typical kinds are `ENTRY_CREATE`, `ENTRY_MODIFY`, `ENTRY_DELETE`, plus `OVERFLOW`.",
        "`take` blocks, while `poll` can return immediately or wait for a timeout.",
        "Process all events and call `reset()`; a false result means the key is no longer valid.",
        "Events are provider-dependent hints, not a complete transaction log, and recursive watching requires registering subdirectories.",
      ],
      interview: paragraphs(
        "`WatchService` is Java NIO's low-level API for receiving notifications about changes to registered objects, most commonly directories. A file system creates the service, directories register event kinds, and each registration returns a `WatchKey`. The service queues a key when events are available for that directory.",
        "A watcher normally calls `take()` to block or `poll()` to check with optional timeout. It obtains the key's events, examines each kind and relative context Path, then calls `reset()` so the key can receive more notifications. If reset returns false, the key is invalid—often because the directory is inaccessible or deleted—and the registration should no longer be trusted.",
        "For example, a development tool can register a configuration directory for create, modify, and delete events. When `settings.json` changes, it re-reads and validates the complete file rather than assuming one modify event describes every write. `OVERFLOW` means events may have been lost or discarded, so the application needs a rescan or other recovery strategy.",
        "Implementations are file-system and platform dependent. Event timing and ordering vary, repeated changes may be coalesced, and a file can change again or disappear before it is processed. Registering a parent does not recursively register existing or future child directories; a recursive watcher must discover and register each directory and handle newly created directories.",
        "WatchService is useful for cache invalidation, reload hints, developer tools, and responsive local monitoring. It is not a durable audit log or a cross-system message bus. Correct designs combine it with current-state validation, overflow recovery, lifecycle shutdown, and periodic reconciliation when missing a change would matter.",
      ),
      deepTitle: "WatchService Events and Directory State",
      deep: paragraphs(
        "A WatchKey groups events for one registration. Once signalled, it remains signalled until events are processed and the key is reset. Resetting is therefore part of the protocol rather than cleanup decoration. If a loop forgets it, that registration stops producing the expected future wakeups.",
        "The event context for directory registration is commonly a relative Path such as `settings.json`. Resolve it against the watched directory before accessing the entry. By that time the entry may have been replaced, renamed, or removed, so consumers should perform the complete read they need and handle ordinary file-system failures.",
        "Overflow changes the trust model. It says the implementation may have discarded events, not which state is wrong. The safe recovery is to compare the watched tree with a known inventory or rebuild derived state. Systems that require every historical change need a durable journal supplied by the storage platform or by the application itself.",
        "Shutdown also deserves design. Closing the WatchService invalidates registered keys and wakes threads blocked in `take` with `ClosedWatchServiceException`. An application should own the watching thread, close the service during shutdown, and avoid leaking a forever-blocked non-daemon thread.",
      ),
      visualType: "flow_diagram",
      visualTitle: "The WatchService key lifecycle includes validation and recovery",
      visual: mermaid("flowchart TD\n  R[Register directory and event kinds] --> W[take or poll WatchKey]\n  W --> E[Process all events]\n  E --> O{OVERFLOW?}\n  O -->|Yes| S[Rescan current state]\n  O -->|No| V[Validate affected path]\n  S --> K[reset key]\n  V --> K\n  K -->|true| W\n  K -->|false| X[Registration ended]"),
      codeTitle: "Register a directory and reconcile current state",
      code: java(`import java.nio.charset.StandardCharsets;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.concurrent.TimeUnit;

class WatchDirectory {
    public static void main(String[] args) throws Exception {
        Path directory = Files.createTempDirectory("watch-");
        Path created = directory.resolve("note.txt");
        try (WatchService watcher = FileSystems.getDefault().newWatchService()) {
            directory.register(watcher, StandardWatchEventKinds.ENTRY_CREATE);
            Files.writeString(created, "ready", StandardCharsets.UTF_8);
            WatchKey key = watcher.poll(1, TimeUnit.SECONDS);
            boolean sawFile = false;
            if (key != null) {
                sawFile = key.pollEvents().stream()
                        .anyMatch(event -> event.context().equals(Path.of("note.txt")));
                if (!key.reset()) throw new AssertionError("key became invalid");
            }
            if (!Files.exists(created)) throw new AssertionError("reconciliation failed");
            System.out.println(sawFile ? "event observed" : "state found by rescan");
        } finally {
            Files.deleteIfExists(created);
            Files.deleteIfExists(directory);
        }
    }
}`),
      followups: [
        "Why must a WatchKey be reset after its events are processed?",
        "What should an application do after an OVERFLOW event?",
        "Does registering a directory watch all descendants recursively?",
      ],
    },
  },
};

lessons["serialization-basics"] = {
  "java-serialization-overview": {
    direct: "Java native serialization converts a graph of `Serializable` objects into a stream that `ObjectInputStream` can reconstruct, including shared references and cycles. It is a legacy Java-specific mechanism and should not be used for untrusted input or new public data formats.",
    minutes: 12,
    quick: [
      "A class opts in by implementing the marker interface `Serializable`.",
      "`ObjectOutputStream` writes an object graph; `ObjectInputStream` reconstructs it and preserves ordinary shared references.",
      "Default serialization includes non-static, non-transient instance fields.",
      "The first non-serializable superclass needs an accessible no-argument constructor.",
      "Never deserialize untrusted native streams; prefer an explicit, validated, versioned format for new boundaries.",
    ],
    interview: paragraphs(
      "Java serialization is the platform's native mechanism for turning an object graph into a byte stream and reconstructing it later. A class opts in with the marker interface `Serializable`. `ObjectOutputStream.writeObject` records class information, field data, and references; `ObjectInputStream.readObject` rebuilds compatible objects.",
      "The mechanism traverses reachable serializable objects recursively. It assigns handles to objects already written, so two fields that refer to the same object normally refer to the same reconstructed object, and ordinary cycles can be preserved. By default, non-static, non-transient instance fields participate. Static fields belong to the class, and transient fields are not part of the default serialized state.",
      "During ordinary deserialization, constructors and field initializers of serializable classes are not used in the normal way. The no-argument constructor of the first non-serializable superclass is invoked, so it must be accessible to the serializable subclass. Classes can customize state with methods such as `writeObject` and `readObject`, but that increases the compatibility and security surface.",
      "For example, an in-memory test can serialize an array containing the same Address object twice. After reading it, the two array positions still refer to one reconstructed instance. That demonstrates graph identity rather than merely copying field values.",
      "Native serialization is Java-specific, tightly coupled to class structure, and dangerous with untrusted input because object construction hooks and reachable classes can execute unexpected behavior. It is reasonable only in controlled legacy or private contexts with strict allow-list filtering and limits. New APIs and persisted contracts normally use an explicit schema or data format whose fields, validation, and evolution rules are visible.",
    ),
    deepTitle: "Serialization records a graph protocol, not just a list of fields",
    deep: paragraphs(
      "The first occurrence of an ordinary object is written with a new handle. Later references can point back to that handle, which preserves aliasing and permits cycles. Independently copying every field would change program meaning: two references to one mutable object would become two separate objects after reading.",
      "Default field discovery is based on the serializable class hierarchy. Static members are class state and do not belong to one serialized instance. Transient members are intentionally omitted. The stream can include class descriptors and version identifiers, but it does not provide a safe, language-neutral schema contract comparable to formats designed for interoperability.",
      "Deserialization is more powerful than parsing plain data. It allocates objects, restores private state, and may invoke class-specific hooks such as `readObject`, `readResolve`, validation callbacks, or code in reachable library types. That execution model is the core reason an attacker-controlled stream is unsafe. A successful type cast after `readObject` happens too late to remove the danger.",
      "If a legacy internal stream must be read, restrict the source, apply `ObjectInputFilter` allow-lists and graph limits before reading, keep dependencies patched, and authenticate the surrounding data where needed. Filters reduce exposure but do not turn native deserialization into a recommended public input format. Prefer a deliberately parsed representation for new systems.",
    ),
    visualType: "flow_diagram",
    visualTitle: "Handles preserve identity across an object graph",
    visual: mermaid("flowchart LR\n  R[Root object] --> A[First reference to Address]\n  R --> B[Second reference to same Address]\n  A --> H[ObjectOutputStream assigns handle]\n  B --> H\n  H --> S[Serialized graph]\n  S --> I[ObjectInputStream]\n  I --> O[One reconstructed Address shared twice]"),
    codeTitle: "Verify that a shared reference remains shared",
    code: java(`import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

class SerializationGraph {
    static final class Address implements Serializable {
        private static final long serialVersionUID = 1L;
        final String city;
        Address(String city) { this.city = city; }
    }

    public static void main(String[] args) throws Exception {
        Address shared = new Address("Pune");
        byte[] bytes;
        try (var buffer = new ByteArrayOutputStream();
             var output = new ObjectOutputStream(buffer)) {
            output.writeObject(new Address[] {shared, shared});
            output.flush();
            bytes = buffer.toByteArray();
        }
        try (var input = new ObjectInputStream(new ByteArrayInputStream(bytes))) {
            Address[] restored = (Address[]) input.readObject();
            if (restored[0] != restored[1]) throw new AssertionError("identity lost");
            System.out.println(restored[0].city);
        }
    }
}`),
    followups: [
      "Which fields participate in default serialization?",
      "How are shared references and cycles represented?",
      "Why is deserializing untrusted data unsafe even before a cast?",
    ],
  },
  "transient-keyword": {
    direct: "A `transient` instance field is omitted by Java's default serialization mechanism. After ordinary deserialization it has its type's default value unless custom restoration code assigns it; `transient` is not a complete secret-management or security boundary.",
    minutes: 10,
    quick: [
      "`transient` excludes an instance field from default Java serialization.",
      "After deserialization, an omitted field normally has `null`, zero, or `false` unless custom code restores it.",
      "Static fields are not serialized instance state even without the transient modifier.",
      "Use transient for derived, environment-specific, non-serializable, or deliberately omitted state.",
      "It does not erase data elsewhere or make untrusted deserialization safe.",
    ],
    interview: paragraphs(
      "The `transient` modifier tells Java's default object-serialization mechanism not to include a particular instance field in the serialized form. It is relevant to native `ObjectOutputStream` serialization; JSON and persistence libraries may use their own annotations and rules instead.",
      "When an ordinary serializable object is reconstructed, its serializable constructors and field initializers do not simply run to rebuild omitted state. A transient reference therefore normally becomes `null`, a numeric primitive becomes zero, and a boolean becomes false. If the class needs a derived value again, it can compute it lazily or carefully restore it in a private `readObject` method after default fields are read.",
      "Typical transient fields include caches that can be recomputed, open sockets or threads that cannot sensibly be persisted, environment-specific handles, and sensitive values that should not be placed in this particular stream. Static fields are already excluded because they belong to the class rather than one object; marking them transient adds no serialization effect.",
      "For example, a Session object can serialize its username while declaring an access token transient. Reading the object back restores the username but leaves the token null, forcing the application to obtain fresh authentication state rather than reuse a stored token.",
      "Transient is not an encryption or data-erasure feature. The value can still appear in logs, heap dumps, another serializer, custom `writeObject` code, or other fields, and native deserialization remains unsafe for untrusted streams. Use it to define the default serialized field set, but combine it with explicit data models, secrets handling, validation, and a safer format whenever data crosses a trust boundary.",
    ),
    deepTitle: "Omitted state needs an explicit reconstruction rule",
    deep: paragraphs(
      "A useful way to classify object state is essential, derived, and environmental. Essential state is required to preserve the logical value and normally belongs in a deliberate representation. Derived state, such as an index or cached total, can be recalculated and is often transient. Environmental state, such as an open channel or executor, cannot be meaningfully restored from old bytes and should be reacquired by the surrounding application.",
      "After default deserialization, transient fields hold JVM defaults because the object is reconstructed by the serialization protocol rather than through its ordinary serializable-class constructor. A class that depends on a transient invariant must re-establish it before exposing the object. Custom `readObject` can do this, but it should validate input and avoid trusting attacker-controlled values.",
      "The keyword is scoped to Java native serialization. A JSON mapper may serialize a property through a getter, an ORM may persist a field through metadata, and a logger may print it. Preventing secret leakage requires reviewing every output path and preferably keeping secrets out of long-lived domain objects altogether.",
      "For compatibility, adding or removing transient can change which state future streams contain. Existing streams lack newly included fields, and future streams may omit formerly stored values. Explicit versioning and defensive defaults are necessary when serialized data must survive releases.",
    ),
    visualType: "flow_diagram",
    visualTitle: "Default serialization separates stored and reconstructed state",
    visual: mermaid("flowchart LR\n  O[Object fields] --> P[Persistent non-static fields]\n  O --> T[transient field]\n  O --> S[static field]\n  P --> B[Serialized bytes]\n  B --> R[Restored values]\n  T --> D[Default value or explicit rebuild]\n  S --> C[Current class state, not stream state]"),
    codeTitle: "Observe a transient token after deserialization",
    code: java(`import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

class TransientField {
    static final class Session implements Serializable {
        private static final long serialVersionUID = 1L;
        final String user;
        transient String token;
        Session(String user, String token) { this.user = user; this.token = token; }
    }

    public static void main(String[] args) throws Exception {
        byte[] bytes;
        try (var buffer = new ByteArrayOutputStream();
             var output = new ObjectOutputStream(buffer)) {
            output.writeObject(new Session("Asha", "secret"));
            output.flush();
            bytes = buffer.toByteArray();
        }
        try (var input = new ObjectInputStream(new ByteArrayInputStream(bytes))) {
            Session restored = (Session) input.readObject();
            if (!"Asha".equals(restored.user) || restored.token != null) throw new AssertionError();
            System.out.println(restored.user + ":" + restored.token);
        }
    }
}`),
    followups: [
      "What value does a transient field have after default deserialization?",
      "Are static fields serialized as part of an object?",
      "Why is transient not a complete way to protect a secret?",
    ],
  },
};

Object.assign(lessons["serialization-basics"], {
  "serialversionuid-explained": {
    direct: "`serialVersionUID` identifies the serialized version of a class. Java compares the stream's UID with the local class UID and rejects a mismatch, but a matching UID does not by itself guarantee that every class change is compatible.",
    minutes: 11,
    quick: [
      "Declare it as `private static final long serialVersionUID` in a Serializable class.",
      "The stream stores the UID and deserialization compares it with the local class UID.",
      "A mismatch for an otherwise matching class causes `InvalidClassException`.",
      "Without an explicit UID, Java computes one from class details, so unrelated changes may alter it.",
      "Keeping the same UID does not override serialization's class-evolution compatibility rules.",
    ],
    interview: paragraphs(
      "`serialVersionUID` is the version identifier used by Java native serialization for a serializable class. It is conventionally declared `private static final long serialVersionUID = 1L;`. The object stream stores a class descriptor containing the UID, and ObjectInputStream compares it with the UID of the local class during deserialization.",
      "If the class name corresponds but the UIDs differ, deserialization normally throws `InvalidClassException`. When no explicit field is declared, Java computes a default UID from details of the class. That computed value is fragile because changes to constructors, members, modifiers, or compiler-generated details can change it even when the developer intended compatible evolution.",
      "An explicit UID makes the compatibility decision deliberate. A team can retain it for changes allowed by serialization's evolution rules, such as adding an ordinary field that older streams do not contain; the new field receives its default value. The team should change the UID when it intentionally wants older serialized forms rejected.",
      "For example, a Profile class can declare UID 7L and verify it with `ObjectStreamClass.lookup(Profile.class).getSerialVersionUID()`. Streams written with that descriptor expect a compatible local Profile version to use the same value.",
      "A matching UID is necessary but not sufficient. Incompatible structural changes can still fail or restore misleading state, and retaining a UID cannot transform an arbitrary new design into the old class. It also provides no security, integrity, or schema migration. Use explicit UIDs for controlled legacy serialization, test old-to-new data across releases, and prefer an explicit versioned format for durable or cross-service contracts.",
    ),
    deepTitle: "The UID is a compatibility gate, not a migration engine",
    deep: paragraphs(
      "Deserialization first decides whether the stream's class descriptor can match the local class. The serialVersionUID is a version gate in that decision. A mismatch rejects the stream before ordinary field restoration. This prevents accidental interpretation by a class version that declared itself different, but it says nothing about the business meaning of restored values.",
      "Java separately defines compatible and incompatible evolution. Adding a field is generally readable because an old stream has no value and the new field receives a default. Deleting a field means a newer reader ignores old data for it. Moving classes within the hierarchy or changing a field to an incompatible type can violate the contract even if a developer forces the same UID.",
      "The generated default UID depends on structural class information. Seemingly unrelated edits or compiler details can therefore affect it, making accidental generation unsuitable for data expected to survive releases. An explicit declaration exposes the compatibility promise during review, but the number still needs a policy.",
      "Treat each retained UID as an obligation to run compatibility fixtures. Read representative bytes from supported older releases, validate invariants, and reject or migrate versions outside the support window. For new durable data, a schema with an explicit format version usually makes evolution safer and more observable than Java class descriptors.",
    ),
    visualType: "flow_diagram",
    visualTitle: "UID comparison opens the gate; evolution rules still apply",
    visual: mermaid("flowchart TD\n  S[Stream class descriptor and UID] --> C{Local UID matches?}\n  C -->|No| I[InvalidClassException]\n  C -->|Yes| E{Class evolution compatible?}\n  E -->|No| F[Fail or reject invalid state]\n  E -->|Yes| R[Restore fields; missing values get defaults]\n  R --> V[Validate invariants]"),
    codeTitle: "Declare and inspect an explicit serialVersionUID",
    code: java(`import java.io.ObjectStreamClass;
import java.io.Serializable;

class SerialVersionExample {
    static final class Profile implements Serializable {
        private static final long serialVersionUID = 7L;
        final String name;
        Profile(String name) { this.name = name; }
    }

    public static void main(String[] args) {
        long uid = ObjectStreamClass.lookup(Profile.class).getSerialVersionUID();
        if (uid != 7L) throw new AssertionError(uid);
        System.out.println(uid);
    }
}`),
    followups: [
      "What happens when the stream UID and local class UID differ?",
      "Why is a generated default serialVersionUID fragile?",
      "Does keeping the same UID make every class change compatible?",
    ],
  },
  "alternatives-to-java-serialization": {
    direct: "Modern alternatives use explicit formats and schemas—such as JSON, Protocol Buffers, Avro, CBOR, or a small versioned binary codec—so parsing, validation, interoperability, and evolution are controlled instead of reconstructing arbitrary Java object graphs.",
    minutes: 12,
    quick: [
      "Prefer an explicit data-transfer model over serializing internal Java objects.",
      "JSON is readable and widely supported but still needs schema, type, and size validation.",
      "Protocol Buffers and Avro offer schema-driven binary encoding and defined evolution practices.",
      "CBOR is a compact data representation, not Java object reconstruction.",
      "Choose by interoperability, evolution, size, tooling, and trust boundary—not syntax alone.",
    ],
    interview: paragraphs(
      "Modern systems usually replace Java native serialization with an explicit representation. Instead of asking a stream to recreate arbitrary implementation objects, the application parses a defined set of fields into a data-transfer model, validates them, and then constructs domain objects. This makes the trust boundary and compatibility rules visible.",
      "JSON is common for HTTP APIs, configuration, and human-inspectable messages. It has broad tooling but does not by itself define a complete schema, numeric precision policy, date representation, or size limits. Protocol Buffers provides a compact schema-driven binary format with numbered fields and cross-language code generation. Avro also uses schemas and is common in data pipelines. CBOR represents JSON-like data compactly in binary form.",
      "A small private format can use `DataOutputStream` and `DataInputStream`, beginning with a magic value and version, then bounded fields in a documented order. That avoids object reconstruction but creates responsibility for byte order, length limits, optional fields, migration, and tests. Java records or DTOs can represent the parsed data without making the domain model Serializable.",
      "For example, a cache record can write a version integer, an ID, and a UTF name. The reader checks the version and validates fields before accepting the value. A later version can branch through an explicit migration rather than pretending a changed class is automatically compatible.",
      "No format is secure merely because it is not native serialization. Parsers still need input authentication where appropriate, allow-listed fields or types, depth and size limits, and maintained libraries. The important improvement is a constrained, reviewable data contract. Pick the format whose schema, performance, tooling, and evolution model match the boundary.",
    ),
    deepTitle: "A safer format separates parsing, validation, and construction",
    deep: paragraphs(
      "Native deserialization combines parsing bytes, choosing classes, allocating objects, and restoring private state. An explicit format separates them. A parser first produces a constrained data representation; validation checks ranges and required fields; only then does application code call ordinary constructors or factories. Each stage has a smaller and testable responsibility.",
      "Schema evolution should be designed around meaning. A numbered binary field can be reserved after removal, a JSON field can be optional with a documented default, and a format version can select a migration. Compatibility tests should include older-producer/newer-consumer and newer-producer/older-consumer combinations that the contract promises.",
      "Operational constraints influence the choice. JSON is easy to inspect but can be verbose. Protobuf emphasizes compact typed messages and generated clients. Avro makes schemas central to data exchange. CBOR can retain a flexible data model in fewer bytes. A custom codec can be small but lacks mature standard tooling.",
      "Whichever format is selected, enforce maximum message size, collection lengths, nesting depth, numeric ranges, and unknown-field policy before expensive allocation. Authenticate or sign data when tampering matters. Safer architecture comes from narrow accepted data plus validation—not from swapping one library call for another without defining a contract.",
    ),
    visualType: "flow_diagram",
    visualTitle: "Explicit formats validate data before domain construction",
    visual: mermaid("flowchart LR\n  B[Incoming bytes] --> P[Format parser with limits]\n  P --> D[DTO or schema value]\n  D --> V[Validate fields and version]\n  V -->|valid| O[Construct domain object]\n  V -->|invalid| R[Reject safely]\n  O --> A[Application]"),
    codeTitle: "Use a small explicit versioned binary record",
    code: java(`import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;

class VersionedRecord {
    record User(int id, String name) { }

    static byte[] encode(User user) throws Exception {
        var bytes = new ByteArrayOutputStream();
        try (var out = new DataOutputStream(bytes)) {
            out.writeInt(0x55535231); // USR1
            out.writeInt(1);          // format version
            out.writeInt(user.id());
            out.writeUTF(user.name());
        }
        return bytes.toByteArray();
    }

    static User decode(byte[] bytes) throws Exception {
        try (var in = new DataInputStream(new ByteArrayInputStream(bytes))) {
            if (in.readInt() != 0x55535231 || in.readInt() != 1) {
                throw new IllegalArgumentException("unsupported record");
            }
            int id = in.readInt();
            String name = in.readUTF();
            if (id < 1 || name.isBlank()) throw new IllegalArgumentException("invalid fields");
            return new User(id, name);
        }
    }

    public static void main(String[] args) throws Exception {
        User restored = decode(encode(new User(42, "Mira")));
        if (!restored.equals(new User(42, "Mira"))) throw new AssertionError();
        System.out.println(restored);
    }
}`),
    followups: [
      "Why is an explicit DTO safer than reconstructing a domain object graph?",
      "What trade-offs distinguish JSON from a schema-driven binary format?",
      "Which size and evolution limits should a custom codec define?",
    ],
  },
  "java-serialization-security-risks": {
    direct: "Deserializing untrusted Java object streams is dangerous because the stream can select reachable classes and trigger object-restoration hooks before the caller validates the final type. Avoid it; filters and graph limits are defense in depth for constrained legacy use.",
    minutes: 13,
    quick: [
      "Treat native serialized input as active object construction, not passive field parsing.",
      "A malicious graph can trigger behavior in reachable classes before the returned object is cast.",
      "Do not accept native serialization from public or attacker-modifiable sources.",
      "For unavoidable legacy input, restrict provenance and apply an `ObjectInputFilter` before the first read.",
      "Allow-lists and limits reduce exposure but do not make native deserialization a preferred untrusted format.",
    ],
    interview: paragraphs(
      "The main security risk of Java native serialization is that deserialization reconstructs an object graph rather than merely reading plain fields. The stream contains class descriptors and references, and `ObjectInputStream` can invoke class-specific restoration hooks such as `readObject`, `readResolve`, and validation callbacks while processing reachable types.",
      "For example, an attacker may craft a graph that reaches a dangerous sequence of library classes, consumes extreme memory or CPU, creates deeply nested structures, or violates object invariants. Casting the returned value to an expected class is not sufficient because harmful work can happen while `readObject()` is still constructing the graph, before the cast executes.",
      "The preferred control is architectural: do not deserialize native Java streams from untrusted or tamperable sources. Use an explicit format with a constrained schema and validation. Do not assume that a private network, cache, message queue, file extension, encryption alone, or a transient field automatically establishes trustworthy content.",
      "When a controlled legacy integration cannot be removed immediately, set an `ObjectInputFilter` before reading. A filter can allow or reject classes and impose limits on depth, references, arrays, or stream bytes. The surrounding system should also authenticate provenance, reduce the classpath, patch dependencies, limit process resources, and log rejections.",
      "Filters are defense in depth, not proof that every allowed class is harmless or every denial-of-service path is covered. An allow-list must be narrow and tested against the exact graph expected. The durable fix is to migrate the boundary to a simple versioned data contract and ordinary validated construction.",
    ),
    deepTitle: "The danger begins during graph construction",
    deep: paragraphs(
      "A plain-data parser usually chooses a small vocabulary—objects, arrays, strings, and numbers—and lets application code decide which domain type to create. ObjectInputStream instead resolves Java classes and restores their state as part of parsing. Serializable hooks and methods reached through the class graph expand the behavior available to an attacker controlling the bytes.",
      "Resource exhaustion does not require a code-execution gadget. Huge arrays, excessive references, deep nesting, expensive hash behavior, and recursive graphs can consume heap or CPU. ObjectInputFilter exposes metrics such as depth, reference count, array length, and stream bytes so a policy can reject unreasonable graphs early, though policies still need realistic tests and operating-system limits.",
      "Filtering should be installed before the first object is read. Prefer explicit class allow-lists over broad package acceptance, because dependencies change and one package can contain types with very different behavior. Filter decisions can be `ALLOWED`, `REJECTED`, or `UNDECIDED`; a permissive fallback can accidentally defeat the boundary.",
      "Migration is safer than endlessly growing a filter. Define the minimal fields, select a maintained format, add schema and size validation, authenticate messages where required, and convert old records. Keep the legacy reader isolated with narrow permissions until all supported data has moved.",
    ),
    visualType: "flow_diagram",
    visualTitle: "Filter unavoidable legacy streams before object construction",
    visual: mermaid("flowchart TD\n  U[Incoming native stream] --> T{Trusted and unavoidable legacy source?}\n  T -->|No| X[Reject; parse explicit format]\n  T -->|Yes| F[Install narrow ObjectInputFilter]\n  F --> G{Class and graph limits pass?}\n  G -->|No| R[Reject]\n  G -->|Yes| D[Deserialize in constrained component]\n  D --> V[Validate invariants and migrate]"),
    codeTitle: "Apply a narrow graph filter before reading",
    code: java(`import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputFilter;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

class SerializationFiltering {
    static final class Message implements Serializable {
        private static final long serialVersionUID = 1L;
        final String text;
        Message(String text) { this.text = text; }
    }

    public static void main(String[] args) throws Exception {
        byte[] bytes;
        try (var buffer = new ByteArrayOutputStream();
             var output = new ObjectOutputStream(buffer)) {
            output.writeObject(new Message("trusted legacy record"));
            output.flush();
            bytes = buffer.toByteArray();
        }
        ObjectInputFilter filter = info -> {
            if (info.depth() > 5 || info.references() > 20 || info.streamBytes() > 4096) {
                return ObjectInputFilter.Status.REJECTED;
            }
            Class<?> type = info.serialClass();
            if (type == null) return ObjectInputFilter.Status.UNDECIDED;
            return type == Message.class || type == String.class
                    ? ObjectInputFilter.Status.ALLOWED
                    : ObjectInputFilter.Status.REJECTED;
        };
        try (var input = new ObjectInputStream(new ByteArrayInputStream(bytes))) {
            input.setObjectInputFilter(filter);
            Message message = (Message) input.readObject();
            if (!"trusted legacy record".equals(message.text)) throw new AssertionError();
            System.out.println(message.text);
        }
    }
}`),
    followups: [
      "Why does casting after readObject not prevent gadget execution?",
      "Which graph limits can ObjectInputFilter inspect?",
      "Why are filters defense in depth rather than a complete fix?",
    ],
  },
});

lessons["try-with-resources-io"] = {
  "try-with-resources-syntax": {
    direct: "Try-with-resources declares or references one or more `AutoCloseable` resources in parentheses after `try`; Java closes successfully initialized resources automatically on normal, exceptional, or abrupt exit.",
    minutes: 10,
    quick: [
      "A resource must implement `AutoCloseable`; `Closeable` is its I/O-specific subinterface.",
      "Declare resources inside `try (...)` or, since Java 9, reference final or effectively-final variables.",
      "Java closes every successfully initialized resource when the statement exits.",
      "Multiple resources initialize left to right and close in reverse order.",
      "The body exception remains primary; close failures are available as suppressed exceptions.",
    ],
    interview: paragraphs(
      "Try-with-resources is Java's language feature for binding a resource's lifetime to a block. A resource is any object whose type implements `AutoCloseable`. The I/O interface `Closeable` extends AutoCloseable and narrows `close()` to IOException, so readers, writers, streams, channels, and many database objects work naturally with the feature.",
      "The syntax places resource declarations in parentheses after `try`. Java evaluates them, runs the body, and calls `close()` on each successfully initialized resource whenever control leaves the statement—whether the body completes, returns, or throws. This gives lexical ownership: the source code clearly shows where an acquired resource stops being usable.",
      "For example, `try (BufferedReader reader = Files.newBufferedReader(path, UTF_8))` lets code read a line and guarantees that the file-backed reader closes. The caller still handles IOException from opening, reading, or closing; automatic cleanup does not mean failure is ignored.",
      "With multiple resources, initialization occurs left to right and cleanup occurs in reverse order. If a later initializer fails, earlier resources that were created successfully are still closed. If both the body and close throw, the body exception is primary and close exceptions are attached to it as suppressed exceptions instead of replacing the original failure.",
      "Since Java 9, the resource list may also reference a final or effectively-final local variable or parameter, such as `try (reader)`. The reference cannot have been reassigned. Try-with-resources should be the default for resources the block owns, but ownership still matters: do not close a shared resource supplied by another component unless the API contract transfers that responsibility.",
    ),
    deepTitle: "Lexical resource ownership makes all exit paths explicit",
    deep: paragraphs(
      "Manual cleanup is difficult because a block has more exits than the last visible line: normal completion, checked or unchecked exceptions, return, break, and failures during later resource acquisition. Try-with-resources expands conceptually into nested try/finally logic that closes only resources whose initialization completed. The compiler performs this consistently instead of asking every developer to recreate it.",
      "`AutoCloseable.close()` may declare `Exception`, while `Closeable.close()` declares `IOException` and specifies idempotent closing. AutoCloseable implementations are encouraged to make close idempotent but are not required to. Generic code must therefore follow the exact contract of the resource it owns and should not casually close it twice.",
      "Automatic close does not imply transaction success. A buffered writer can fail while flushing during close, and a database resource may close after a transaction has already required explicit commit or rollback. Cleanup is one lifecycle stage; the application still defines success, publication, and recovery.",
      "Ownership is the final boundary. A method that creates a reader and fully consumes it should usually close it locally. A method that returns a lazy stream over that reader must either transfer close responsibility clearly or redesign the API. Syntax cannot resolve an ambiguous ownership contract.",
    ),
    visualType: "flow_diagram",
    visualTitle: "Only initialized resources enter the automatic close path",
    visual: mermaid("flowchart TD\n  A[Initialize resource] -->|success| B[Run try body]\n  A -->|failure| X[Propagate acquisition failure]\n  B -->|normal, return, or throw| C[Call close]\n  C --> D{Body already threw?}\n  D -->|No| E[Complete or propagate close failure]\n  D -->|Yes| S[Keep body failure; suppress close failure]"),
    codeTitle: "Read an owned file resource with automatic cleanup",
    code: java(`import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

class TryWithResourcesSyntax {
    public static void main(String[] args) throws Exception {
        Path file = Files.writeString(Files.createTempFile("message-", ".txt"),
                "ready", StandardCharsets.UTF_8);
        try {
            String line;
            try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
                line = reader.readLine();
            }
            if (!"ready".equals(line)) throw new AssertionError(line);
            System.out.println(line);
        } finally {
            Files.deleteIfExists(file);
        }
    }
}`),
    followups: [
      "How do AutoCloseable and Closeable differ?",
      "What happens if a later resource initializer fails?",
      "Does automatic close mean the block owns every resource it receives?",
    ],
  },
  "try-with-resources-vs-finally": {
    direct: "Try-with-resources is safer and clearer than manual `finally` cleanup because the compiler closes initialized resources on every exit and preserves a body failure while attaching close failures as suppressed exceptions.",
    minutes: 10,
    quick: [
      "Prefer try-with-resources for owned AutoCloseable resources.",
      "Manual finally needs null checks, correct close order, and careful exception preservation.",
      "Try-with-resources closes resources even after return or exceptions.",
      "A body failure stays primary and close failures become suppressed.",
      "Use finally for unrelated cleanup only when no AutoCloseable resource contract fits.",
    ],
    interview: paragraphs(
      "Before Java 7, resource cleanup was commonly written in a `finally` block. The code opened a resource, stored it in a variable, checked for null in finally, and called close. That pattern can work, but it is verbose and easy to get wrong when acquisition, use, and cleanup can all fail.",
      "Try-with-resources expresses the same ownership directly: resources appear in the `try (...)` header and the compiler supplies the closing logic. Every successfully initialized resource closes on normal completion, exception, or return. With several resources, Java also applies the correct reverse close order automatically.",
      "Exception behavior is an important improvement. In a naive finally block, `close()` can throw and replace the exception that originally explained why the work failed. Try-with-resources keeps the body exception as the primary one and attaches close failures through `Throwable.getSuppressed()`. If the body succeeds and close alone fails, that close exception still propagates.",
      "For example, a parser can open a file, throw because the content is invalid, and still close the reader. If closing also fails, logs can show the parsing exception plus the suppressed cleanup exception rather than losing either fact. The feature also handles failure while initializing a second resource by closing the first.",
      "A finally block remains useful for cleanup that is not represented by an owned AutoCloseable, such as restoring a thread-local value, although a small scope object can sometimes improve that design too. For file, network, database, and similar resources, try-with-resources is the default because it is shorter, structurally safer, and has defined exception semantics.",
    ),
    deepTitle: "The key difference is exception preservation, not fewer lines",
    deep: paragraphs(
      "A traditional finally block always runs, but that alone does not make its cleanup correct. The variable may be null because opening failed. A second resource may have opened after the first. One close may throw before another is reached. Each case requires deliberate nesting and exception bookkeeping that quickly obscures the actual work.",
      "Try-with-resources behaves like nested resource scopes. After each initializer succeeds, that resource is protected by cleanup. This is why an earlier resource closes when a later initializer throws and why resources close in reverse order: the newest dependent layer leaves first, followed by the layer it wraps.",
      "Suppression preserves causal information. If the body is already failing, its Throwable is the reason the scope began to exit. A close failure is important but secondary, so Java attaches it to the primary Throwable. Diagnostic code should inspect suppressed exceptions when cleanup failures are operationally significant.",
      "The language feature cannot decide business cleanup. A transaction may need explicit rollback, a temporary file may need deletion only on failure, and a borrowed connection may have framework-managed ownership. Use try-with-resources for the resource boundary, then keep domain-specific success and recovery rules visible around it.",
    ),
    visualType: "comparison_table",
    visualTitle: "Automatic and manual cleanup have different failure burdens",
    visual: "| Concern | Try-with-resources | Manual finally |\n|---|---|---|\n| Resource scope | Declared in the try header | Tracked in outer variables |\n| Several resources | Reverse close order is defined | Developer must nest cleanup correctly |\n| Body plus close failure | Body is primary; close is suppressed | Naive close can replace body failure |\n| Failed later initializer | Earlier resources close automatically | Developer must cover partial acquisition |",
    codeTitle: "Close the resource even when the body fails",
    code: java(`class TryComparedWithFinally {
    static final class Tracked implements AutoCloseable {
        boolean closed;
        public void close() { closed = true; }
    }

    public static void main(String[] args) {
        Tracked resource = new Tracked();
        try {
            try (resource) {
                throw new IllegalStateException("invalid content");
            }
        } catch (IllegalStateException expected) {
            if (!resource.closed) throw new AssertionError("not closed");
            System.out.println(expected.getMessage() + ":closed=" + resource.closed);
        }
    }
}`),
    followups: [
      "How can a naive finally block hide the original exception?",
      "What happens when the body succeeds but close throws?",
      "When might a finally block still be appropriate?",
    ],
  },
  "try-with-resources-multiple-resources": {
    direct: "Declare multiple resources separated by semicolons. Java initializes them left to right and closes every successfully initialized resource in reverse order, which correctly unwinds wrappers and dependent resources.",
    minutes: 10,
    quick: [
      "Separate multiple resources with semicolons in one try-with-resources header.",
      "Initializers run left to right.",
      "Close methods run in reverse order: the last initialized resource closes first.",
      "If a later initializer fails, resources initialized earlier still close.",
      "With several close failures, exception suppression preserves the full failure chain.",
    ],
    interview: paragraphs(
      "Try-with-resources supports multiple resources in one header, separated by semicolons. Java evaluates their initializers from left to right. On exit, it closes the resources in the opposite order, so the last successfully initialized resource closes first.",
      "Reverse order matters when one resource depends on another. An ObjectOutputStream may wrap a file OutputStream, or a parser may wrap a reader. The outer layer can flush trailers, buffered data, or parser state before the underlying transport disappears. Listing the underlying resource first and its wrapper second produces the correct wrapper-first close order.",
      "For example, `try (OutputStream file = Files.newOutputStream(path); BufferedOutputStream buffer = new BufferedOutputStream(file))` initializes the file and then the buffer. When the block ends, the buffer closes first and then the file variable is closed. Closing the wrapper commonly closes the underlying stream too, so APIs should tolerate or avoid redundant ownership; often declaring only the outermost resource is enough when the inner resource is created directly inside it.",
      "Partial initialization is safe. If the second or third initializer throws, Java closes every earlier resource whose initialization completed. If the body throws and closes also fail, the body exception stays primary. If the body succeeds but multiple close calls fail, the first failure encountered in reverse close order is primary and later close failures are suppressed.",
      "The order is deterministic, but the design should still make dependencies and ownership obvious. Do not put unrelated long-lived shared objects in the resource list merely for convenience. Declare resources in dependency order, close the scope as soon as their work finishes, and inspect suppressed exceptions when cleanup failures matter.",
    ),
    deepTitle: "Multiple resources unwind like a stack",
    deep: paragraphs(
      "Think of each successful initializer as pushing one resource onto a stack. Leaving the try body pops that stack. This last-in, first-out rule makes layered I/O predictable: a compressor can finish its trailer before its buffered destination closes, and the buffer can flush before the file descriptor closes.",
      "When a later initializer fails, it was never pushed because no usable resource value was produced. The resources already on the stack still unwind. This closes a gap that manual code frequently misses: partial acquisition is itself an exceptional exit that needs cleanup.",
      "Close failures follow the same ordered unwinding. Java continues attempting later closes even after one close has thrown. If there was no earlier body failure, the first close failure becomes primary; other close failures are attached as suppressed. This prevents one broken close from skipping every remaining cleanup while preserving their diagnostics.",
      "Wrapper ownership deserves attention. Closing an outer Java stream normally closes its delegate, so separately listing both may cause a harmless second close for Closeable streams, but that pattern is not universally safe for arbitrary AutoCloseable types. Prefer a single outer declaration when it clearly owns the nested construction, or document why multiple independently acquired resources each require a declaration.",
    ),
    visualType: "flow_diagram",
    visualTitle: "Initialization pushes left to right; cleanup pops right to left",
    visual: mermaid("flowchart LR\n  I1[Initialize A] --> I2[Initialize B] --> I3[Initialize C] --> B[Run body]\n  B --> C3[Close C] --> C2[Close B] --> C1[Close A]\n  I3 -->|fails| C2\n  I2 -->|fails| C1"),
    codeTitle: "Verify reverse close order",
    code: java(`import java.util.ArrayList;
import java.util.List;

class MultipleResources {
    static final class NamedResource implements AutoCloseable {
        private final String name;
        private final List<String> closed;
        NamedResource(String name, List<String> closed) {
            this.name = name;
            this.closed = closed;
        }
        public void close() { closed.add(name); }
    }

    public static void main(String[] args) {
        List<String> closed = new ArrayList<>();
        try (var first = new NamedResource("first", closed);
             var second = new NamedResource("second", closed)) {
            System.out.println("working");
        }
        if (!closed.equals(List.of("second", "first"))) throw new AssertionError(closed);
        System.out.println(closed);
    }
}`),
    followups: [
      "Why are multiple resources closed in reverse order?",
      "What closes if the second resource initializer fails?",
      "Which exception is primary if two close methods fail after a successful body?",
    ],
  },
};

Object.assign(lessons["try-with-resources-io"], {
  "suppressed-exceptions-try-with-resources": {
    direct: "A suppressed exception is a secondary failure attached to the primary Throwable. In try-with-resources, when the body is already throwing and `close()` also throws, the body failure stays primary and each close failure is recorded in `getSuppressed()`.",
    minutes: 11,
    quick: [
      "The exception that causes the try body to exit remains the primary exception.",
      "Exceptions thrown while closing resources are attached with suppression instead of replacing it.",
      "Read secondary failures through `Throwable.getSuppressed()`.",
      "If the body succeeds, a close failure propagates normally rather than being suppressed by itself.",
      "With multiple resources, Java still attempts reverse-order cleanup and can record several suppressed failures.",
    ],
    interview: paragraphs(
      "A suppressed exception is a secondary Throwable stored on a primary Throwable so that one failure does not erase another. Try-with-resources uses this mechanism when the try body throws and one or more resource `close()` calls also throw during cleanup.",
      "The body exception remains primary because it is the reason normal work failed and cleanup began. Each close failure is attached to that Throwable and can be inspected with `getSuppressed()`. This is better than a naive finally block, where a close exception can replace the original exception and hide the actual processing problem.",
      "For example, suppose parsing throws `IllegalStateException(\"invalid record\")`, and the reader's close method throws IOException because the underlying device also failed. The caller catches the IllegalStateException. Its suppressed array contains the IOException, so diagnostics can report both the invalid record and the failed cleanup.",
      "If the body completes normally and one close throws, there is no earlier primary failure, so the close exception propagates. With several resources closing in reverse order, the first close failure encountered becomes primary in that case, and later close failures are attached to it. Java continues the required cleanup rather than abandoning remaining resources after one failed close.",
      "Suppression preserves information but does not handle it automatically. Logging only `exception.getMessage()` can omit suppressed failures, while a normal full stack trace usually includes them. Code should not replace the primary exception casually, and operational diagnostics should retain the full Throwable chain. The rule is simple: primary explains the main exit; suppressed entries explain additional failures during cleanup.",
    ),
    deepTitle: "Suppression preserves the causal order of failure",
    deep: paragraphs(
      "A scope can fail twice: the work can fail, and releasing the resource can fail. Only one Throwable can be thrown directly from a statement, so Java needs a rule for retaining both. Try-with-resources treats the failure already in flight as primary and adds later cleanup failures to it. The order reflects causality rather than claiming that cleanup is unimportant.",
      "For multiple resources, cleanup still proceeds in reverse declaration order. A failure from the last resource does not prevent Java from trying to close earlier resources. Their failures join the suppressed list in the order encountered. This maximizes cleanup attempts and gives operators a fuller picture of a cascading outage.",
      "Suppression is a general Throwable feature, but try-with-resources is its most common source. A class can call `addSuppressed` itself, subject to Throwable's restrictions, though ordinary application code rarely needs to. The important consumer API is `getSuppressed`, which returns the secondary Throwables.",
      "Recovery decisions should stay tied to the primary operation. A failed write plus a failed close can mean output completeness is unknown; reporting both is useful, but neither proves whether bytes reached stable storage. Domain code still needs a policy for partial targets, retries, quarantine, or reconciliation.",
    ),
    visualType: "flow_diagram",
    visualTitle: "The first failure stays primary while cleanup failures attach",
    visual: mermaid("flowchart TD\n  B[Try body] -->|throws A| C[Close resource]\n  C -->|throws B| P[Throw A as primary]\n  P --> S[Attach B in A.getSuppressed]\n  B -->|succeeds| D[Close resource]\n  D -->|throws B| O[Throw B as primary]\n  D -->|succeeds| N[Complete normally]"),
    codeTitle: "Inspect a close failure suppressed by a body failure",
    code: java(`class SuppressedFailure {
    static final class BrokenClose implements AutoCloseable {
        public void close() throws Exception {
            throw new Exception("close failed");
        }
    }

    public static void main(String[] args) {
        try {
            try (var resource = new BrokenClose()) {
                throw new IllegalStateException("body failed");
            }
        } catch (Exception failure) {
            if (!"body failed".equals(failure.getMessage())) throw new AssertionError(failure);
            if (failure.getSuppressed().length != 1
                    || !"close failed".equals(failure.getSuppressed()[0].getMessage())) {
                throw new AssertionError("missing suppressed close failure");
            }
            System.out.println(failure.getMessage() + " / "
                    + failure.getSuppressed()[0].getMessage());
        }
    }
}`),
    followups: [
      "What becomes primary when both the body and close throw?",
      "What happens when only close throws?",
      "How are several close failures retained?",
    ],
  },
  "custom-autocloseable": {
    direct: "A custom resource participates in try-with-resources by implementing `AutoCloseable` and putting deterministic release logic in `close()`. Define ownership clearly, make close safe and preferably idempotent, and preserve meaningful failures.",
    minutes: 11,
    quick: [
      "Implement `AutoCloseable` and provide a public `close()` method.",
      "Acquire state in construction or a factory and release it deterministically in close.",
      "Make close idempotent when practical, although AutoCloseable does not require it.",
      "Use a closed-state guard so operations fail clearly after release.",
      "Do not throw `InterruptedException` from close; preserve interruption semantics in resource-specific code.",
    ],
    interview: paragraphs(
      "To make a custom class work with try-with-resources, implement `AutoCloseable` and define its public `close()` method. The class should represent something with a clear acquired lifetime—such as a lock lease, temporary workspace, native handle, or scoped session—and close should release that owned state.",
      "The `AutoCloseable.close()` signature allows `Exception`, so an implementation can narrow or omit that declaration. `java.io.Closeable` is more specific for I/O resources: it declares IOException and specifies idempotent closing. AutoCloseable itself does not require idempotence, although making repeated close calls harmless is usually easier for callers and failure recovery.",
      "A sound resource tracks whether it is closed, rejects work after closure, and releases exactly what it owns. If cleanup has several stages, it should attempt necessary releases without casually hiding earlier failures. Close should not normally throw `InterruptedException`, because generic try-with-resources suppression can interfere with interruption handling.",
      "For example, a temporary-workspace class can create a directory, expose its Path while open, and delete it in `close()`. A try-with-resources block then makes the directory lifetime visible. A closed-state flag makes a second close harmless and prevents later code from treating the deleted workspace as active.",
      "Not every object needs AutoCloseable. Pure in-memory values without an external lifetime gain nothing from it, and implementing it can imply ownership the class does not have. Use the interface when deterministic release is meaningful, document whether the resource can be reused or closed twice, and test success, body failure, close failure, and partial acquisition.",
    ),
    deepTitle: "A good AutoCloseable is an ownership contract",
    deep: paragraphs(
      "The interface's value is not simply that the compiler calls one method. It gives the type a visible lifetime boundary. Before close, operations are allowed; after close, they should either be harmless or fail predictably. A class that cannot state what it owns and what close releases probably has an unclear resource model.",
      "Construction failure needs the same care as closing. If a constructor acquires several external things and then fails, no object exists for try-with-resources to close. A factory can acquire step by step and release earlier pieces on failure, or the constructor can use local try-with-resources scopes before publishing a fully initialized object.",
      "Idempotence is recommended rather than guaranteed by AutoCloseable. A boolean or atomic state transition often makes repeated close safe, but concurrency rules must be explicit if use and close can race. Thread safety does not appear automatically because a class implements the interface.",
      "Exception design affects callers. Narrow checked exceptions where possible, preserve the original cause, and avoid throwing from close for conditions that can be handled earlier. When close genuinely fails, report enough context for recovery while remembering that try-with-resources may attach that failure as suppressed behind a body exception.",
    ),
    visualType: "flow_diagram",
    visualTitle: "A custom resource moves through a defined lifetime",
    visual: mermaid("stateDiagram-v2\n  [*] --> Open: acquire succeeds\n  Open --> Open: use\n  Open --> Closed: close releases ownership\n  Closed --> Closed: repeated close is harmless\n  Closed --> Rejected: use after close\n  Rejected --> Closed"),
    codeTitle: "Create an idempotent scoped workspace",
    code: java(`import java.nio.file.Files;
import java.nio.file.Path;

class CustomAutoCloseable {
    static final class Workspace implements AutoCloseable {
        private final Path directory;
        private boolean closed;

        Workspace() throws Exception {
            directory = Files.createTempDirectory("workspace-");
        }

        Path path() {
            if (closed) throw new IllegalStateException("workspace is closed");
            return directory;
        }

        public void close() throws Exception {
            if (closed) return;
            closed = true;
            Files.deleteIfExists(directory);
        }
    }

    public static void main(String[] args) throws Exception {
        Workspace workspace = new Workspace();
        Path path;
        try (workspace) {
            path = workspace.path();
            if (!Files.isDirectory(path)) throw new AssertionError();
        }
        workspace.close(); // safe by this class's documented contract
        if (Files.exists(path)) throw new AssertionError("directory remains");
        System.out.println("closed");
    }
}`),
    followups: [
      "Does AutoCloseable require close to be idempotent?",
      "How should partial acquisition be cleaned up if construction fails?",
      "Why is ownership more important than simply implementing the interface?",
    ],
  },
  "try-with-resources-effectively-final": {
    direct: "Since Java 9, a try-with-resources header may reference an existing final or effectively-final local variable or parameter directly. It need not redeclare the variable, but the reference must not be reassigned and the statement still closes that resource.",
    minutes: 10,
    quick: [
      "Java 7 requires a resource declaration in the header; Java 9 added existing-variable syntax.",
      "The existing variable must be final or effectively final.",
      "A variable is effectively final when it is assigned once and never reassigned.",
      "`try (reader)` closes reader when the scope exits even though it was declared earlier.",
      "After the block the variable remains in scope, but the referenced resource is already closed.",
    ],
    interview: paragraphs(
      "A try-with-resources statement does not always need to declare a new variable. Since Java 9, its resource list may directly reference an existing final or effectively-final local variable or parameter. `BufferedReader reader = ...; try (reader) { ... }` is therefore valid when reader is assigned once and never reassigned.",
      "Effectively final means the compiler can treat the reference as fixed even though the `final` keyword is absent. If code later assigns a different reader to the variable, it no longer qualifies and the try header does not compile. The restriction ensures that Java knows exactly which object is owned by that resource entry.",
      "The statement still closes the resource at the end. The variable's lexical scope may continue afterward, but using it is normally invalid because the underlying reader, stream, or connection is closed. Existing-variable syntax is about avoiding an unnecessary alias, not extending resource lifetime.",
      "For example, a method may receive an effectively-final BufferedReader from earlier setup, enter `try (reader)`, read its first line, and return. Java closes it before the return completes. This is concise when ownership has clearly transferred to the method or block.",
      "Ownership must not be inferred only from the syntax. If a framework, caller, or shared component expects to keep using the object, placing it in try-with-resources is a bug even when the compiler accepts it. Use an existing resource variable when the close responsibility is explicit, keep the closing scope small, and remember that compatibility with Java 8 source requires the older declaration form or a new alias.",
    ),
    deepTitle: "Effective finality fixes the resource identity for the scope",
    deep: paragraphs(
      "The compiler needs a stable resource reference so that the object used in the body is the one closed at exit. A final variable states that stability directly. An effectively-final variable achieves the same result through data flow: it receives one assignment and is never the target of another assignment.",
      "Java 9's enhancement removed a common Java 7 duplication. Earlier code often wrote `Resource original = acquire(); try (Resource alias = original)`. The alias existed only to satisfy the declaration grammar. The newer `try (original)` form preserves the same close semantics without introducing a second name.",
      "The variable and object lifetime remain different. After the block, the local variable may still be visible, but it references an object whose close method has run. APIs should make post-close behavior clear; many streams throw IOException, while a custom object may throw IllegalStateException or define harmless inspection methods.",
      "Parameters can also be effectively final and appear in a resource list. That does not automatically grant ownership. A method that closes a parameter should state the transfer in its contract, because Java conventions often leave caller-supplied resource ownership with the caller. Compiler validity and API design are separate questions.",
    ),
    visualType: "flow_diagram",
    visualTitle: "The reference stays fixed while the resource lifetime ends",
    visual: mermaid("flowchart LR\n  D[Declare reader once] --> F{Reassigned later?}\n  F -->|Yes| N[Not effectively final; compile error in try header]\n  F -->|No| T[try reader]\n  T --> U[Use resource]\n  U --> C[Automatic close]\n  C --> S[Variable may remain in scope, resource is closed]"),
    codeTitle: "Use an existing effectively-final reader",
    code: java(`import java.io.BufferedReader;
import java.io.StringReader;

class ExistingResourceVariable {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new StringReader("first\\nsecond"));
        String line;
        try (reader) {
            line = reader.readLine();
        }
        if (!"first".equals(line)) throw new AssertionError(line);
        try {
            reader.readLine();
            throw new AssertionError("reader should be closed");
        } catch (java.io.IOException expected) {
            System.out.println(line + ":closed");
        }
    }
}`),
    followups: [
      "What makes a local variable effectively final?",
      "Does the resource remain open because its variable is still in scope?",
      "Why can a caller-supplied AutoCloseable still be wrong to close?",
    ],
  },
});

for (const [topic, topicLessons] of Object.entries(lessons)) {
  const target = path.join(moduleRoot, topic, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(target, "utf8"));
  const entries = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(entries)) throw new Error(`${topic}: expected questions array`);

  const expectedSlugs = Object.keys(topicLessons);
  const actualSlugs = entries.map((entry) => entry.slug);
  if (JSON.stringify(expectedSlugs) !== JSON.stringify(actualSlugs)) {
    throw new Error(`${topic}: source slugs or order changed`);
  }

  for (const entry of entries) {
    const lesson = topicLessons[entry.slug];
    entry.direct_answer = lesson.direct;
    entry.layout_type = "three-zone-learning";
    entry.difficulty = "easy";
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
          answerSize: "standard",
          content: lesson.interview,
        },
        { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep },
        { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
        { type: "code_example", title: lesson.codeTitle, content: lesson.code },
      ],
    };
    entry.followup_questions = lesson.followups;
    entry.seo = {
      metaTitle: `${entry.title} | InterviewExplainer`,
      metaDescription: lesson.direct.replace(/`/g, "").slice(0, 155),
    };
  }

  fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`);
}

const total = Object.values(lessons).reduce(
  (count, topicLessons) => count + Object.keys(topicLessons).length,
  0,
);
console.log(`Curated ${total} Java I/O lessons while preserving IDs, slugs, questions, and order.`);
