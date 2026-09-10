#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  repoRoot,
  "content/java-backend-fresher/java-io-basics/buffered-io/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));
const entries = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(entries)) throw new Error("Expected an array or a questions array");

const lessons = {
  "why-buffered-i-o-matters": {
    direct: "Buffered I/O keeps a block of data in memory so many small application reads or writes can be served with fewer calls to the underlying file, socket, decoder, or operating system. It often improves throughput, but adds memory, latency, and flush considerations.",
    difficulty: "easy",
    minutes: 9,
    quick: [
      "An input buffer fetches a block and serves later small reads from memory.",
      "An output buffer collects small writes and sends a larger block when full, flushed, or closed.",
      "Java provides buffered byte classes and buffered character classes; buffering does not choose the payload type.",
      "The default buffer size is usually adequate; measure before tuning it.",
      "Avoid unnecessary double buffering and flush only at a real visibility or protocol boundary.",
    ],
    interview: "Buffered I/O keeps a block of data in memory between the program and the real source or destination. It matters because reading or writing a file, socket, or operating-system resource is usually more expensive than copying data in memory. A buffer lets many small program operations become fewer larger operations underneath.\n\nOn input, the buffer reads a chunk and serves later small reads from memory. On output, it collects small writes and sends a larger block when the buffer fills, `flush()` is called, or the stream is closed. Java provides `BufferedInputStream` and `BufferedOutputStream` for bytes, and `BufferedReader` and `BufferedWriter` for text. `BufferedReader` also adds useful methods such as `readLine()`.\n\nFor example, a loop that reads a large text file one character at a time can cause many file reads without buffering. `Files.newBufferedReader(path, UTF_8)` reads larger chunks, decodes them as UTF-8, and lets the loop work from memory. The program still reads the same characters, but it reaches the file system far less often.\n\nBuffering is most useful for repeated small or line-based operations. It is not always helpful to wrap an API that already reads in bulk or already buffers internally. Extra-large buffers use more memory, especially across many connections, and flushing after every small write removes the batching benefit. Start with the normal buffer size and change it only when measurement shows a real need.",
    deepTitle: "Buffering changes call shape, not the total payload",
    deep: "If a program transfers one megabyte, buffering does not make the megabyte disappear. It changes how the transfer is grouped. A thousand one-byte writes can become a few block writes, reducing boundary crossings and improving sequential throughput.\n\nInput buffering can also read ahead. Once a BufferedReader wraps another Reader, callers should use the wrapper rather than reading directly from the underlying object; otherwise the two views can disagree about the current logical position.\n\nThe right buffer size depends on the provider, workload, concurrency, and latency goal. Bigger is not monotonically better. Default sizes are designed for general use, while profiling reveals whether I/O calls, decoding, computation, or storage is actually the bottleneck.",
    visualType: "comparison_table",
    visualTitle: "How buffering groups small operations",
    visual: "| Application pattern | Without buffering | With buffering |\n|---|---|---|\n| 1,000 small reads | Many calls can reach the source | A few block refills serve many reads |\n| 1,000 small writes | Many calls can reach the destination | Writes collect until full/flush/close |\n| One already-large write | Already batched | May pass through directly |\n| Flush after every write | Immediate visibility, low batching | Most throughput benefit is lost |",
    codeTitle: "Process text through one buffered reader",
    code: "```java\nimport java.io.BufferedReader;\nimport java.io.StringReader;\n\nclass BufferedIoPerformance {\n    public static void main(String[] args) throws Exception {\n        String text = \"alpha\\nbeta\\ngamma\\n\";\n        try (var reader = new BufferedReader(new StringReader(text))) {\n            String line;\n            int characters = 0;\n            while ((line = reader.readLine()) != null) {\n                characters += line.length();\n            }\n            System.out.println(characters);\n        }\n    }\n}\n```",
    practiceTitle: "Find the expensive boundary",
    practice: "Before adding a buffer, identify which small call reaches an expensive layer. If an outer library already reads large blocks, a second buffer may add no useful batching.",
    followups: [
      "Does buffering reduce the number of bytes transferred?",
      "When can double buffering be unnecessary?",
      "Why can flushing too frequently hurt throughput?",
    ],
  },
  "bufferedreader-vs-bufferedinputstream": {
    direct: "`BufferedReader` buffers characters and supports text operations such as `readLine`; `BufferedInputStream` buffers raw bytes and preserves binary data. Choose the reader only after defining the charset, and choose the input stream for binary or undecoded content.",
    difficulty: "easy",
    minutes: 9,
    quick: [
      "`BufferedReader` extends `Reader` and exposes decoded characters and lines.",
      "`BufferedInputStream` extends `InputStream` and exposes byte values without character decoding.",
      "BufferedReader needs a Reader beneath it; an `InputStreamReader` can decode a byte source with an explicit charset.",
      "Use BufferedReader for text and BufferedInputStream for binary or protocol bytes.",
      "Both support mark/reset within their documented read-ahead limits, but their logical units differ.",
    ],
    interview: "`BufferedReader` reads buffered character data, while `BufferedInputStream` reads buffered raw bytes. Both reduce small reads from the underlying source, but they work at different layers. A reader gives bytes a text meaning through a charset; an input stream preserves the original byte values.\n\nFor a UTF-8 log file, `Files.newBufferedReader(log, UTF_8)` is the natural choice. It decodes the file and provides `readLine()`, which returns one line without its line separator. For a PNG, ZIP file, encrypted payload, or binary protocol, use `BufferedInputStream` because those bytes must not be decoded as text.\n\nWhen text starts as bytes, `InputStreamReader` performs the charset decoding and `BufferedReader` adds character buffering above it. `BufferedInputStream` instead refills an internal byte array and returns those bytes unchanged. A reader has line operations because line separators are characters; a byte stream cannot know where a text line ends without decoding.\n\nChoose from the meaning of the data, not from which class sounds faster: known text and charset means `BufferedReader`; binary data means `BufferedInputStream`. Reading binary data through a Reader can change invalid character sequences and corrupt the result. Both support limited `mark` and `reset`, and code should read through the wrapper rather than also reading the wrapped stream directly, because the wrapper may already have read ahead.",
    deepTitle: "Decoding sits between the byte buffer and character buffer",
    deep: "A text pipeline can contain two different kinds of state. The byte source may read ahead, and the charset decoder may retain an incomplete multi-byte character until more bytes arrive. BufferedReader then holds decoded characters and understands line boundaries.\n\nThis layered state explains why switching back to the underlying InputStream is unsafe: its physical byte position may be ahead of the characters already delivered to the application. Keep one owner and one logical view of the source.\n\n`readLine()` recognizes line termination but removes it from the returned String. If a program must preserve exact original separators, it needs a different parsing strategy.",
    visualType: "comparison_table",
    visualTitle: "The two buffers sit at different layers",
    visual: "| Question | `BufferedInputStream` | `BufferedReader` |\n|---|---|---|\n| Unit | Byte | Character |\n| Base type | `InputStream` | `Reader` |\n| Decodes text? | No | Receives decoded text |\n| Line API | No | `readLine`, `lines` |\n| Typical data | PNG, ZIP, binary protocol | UTF-8 log, CSV, source code |",
    codeTitle: "Use the text pipeline only for text",
    code: "```java\nimport java.io.BufferedReader;\nimport java.io.ByteArrayInputStream;\nimport java.io.InputStreamReader;\nimport java.nio.charset.StandardCharsets;\n\nclass BufferedReaderVsInputStream {\n    public static void main(String[] args) throws Exception {\n        byte[] utf8 = \"first\\nsecond\".getBytes(StandardCharsets.UTF_8);\n        try (var reader = new BufferedReader(new InputStreamReader(\n                new ByteArrayInputStream(utf8), StandardCharsets.UTF_8))) {\n            System.out.println(reader.readLine());\n            System.out.println(reader.readLine());\n        }\n    }\n}\n```",
    practiceTitle: "Decide before wrapping",
    practice: "Given an upload, ask whether its public contract is text with a named charset or an exact byte sequence. Do not infer the choice only from a filename supplied by a user.",
    followups: [
      "Where does charset decoding occur in a BufferedReader pipeline?",
      "Why should code not read directly from the wrapped InputStream?",
      "Does readLine preserve the line terminator?",
    ],
  },
  "flush-in-java-i-o": {
    direct: "`flush()` asks an output stream or writer to push buffered data to its intended downstream destination without closing it. Call it when the resource must stay open but a peer or protocol needs the data now; close normally flushes, and flush alone does not guarantee physical-disk durability.",
    difficulty: "medium",
    minutes: 10,
    quick: [
      "Flush sends buffered output down the wrapper chain while keeping the stream open.",
      "Call it at a real visibility boundary: an interactive prompt, protocol message, or handoff to another layer.",
      "Closing a Writer flushes it first; try-with-resources normally handles the final flush and close.",
      "Flushing after every small write defeats batching and can reduce performance.",
      "Flush reaches the operating-system destination but does not promise that bytes are physically durable on disk.",
    ],
    interview: "`flush()` sends buffered bytes or characters to the next destination while keeping the stream or writer open. In a chain of writers and output streams, flushing the outer writer also passes its pending output through the lower layers. It is used when the receiver must see the data now but the connection or file is not ready to close.\n\nFor example, a client writes `PING` and a line ending through a `BufferedWriter`, then waits for a reply. It must call `flush()` after the complete message. Otherwise `PING` may remain in memory: the client waits for the reply while the server waits for a request it has not received. Console prompts and long-lived request-response connections have the same kind of visibility boundary.\n\nA final manual flush is usually unnecessary when try-with-resources closes the writer immediately, because closing a standard writer flushes its pending data first. Flushing after every character or every line can make output visible sooner, but it removes much of the performance benefit of buffering. The correct point to flush comes from the file or protocol requirement.\n\nFlushing a file stream does not guarantee that the data has reached physical storage. It only passes Java's buffered data to the lower layer or operating system. Durable storage needs the appropriate file-channel or transaction guarantee. Use `flush()` for an intermediate visibility boundary, use `close()` when ownership ends, and handle errors from either operation.",
    deepTitle: "Visibility, completion, and durability are three boundaries",
    deep: "Application visibility means data has left Java's buffering layers far enough for the next participant to receive it. Logical completion means the producer has finished the message or resource and can close it. Physical durability asks whether storage will survive a crash. One method cannot promise all three.\n\nA protocol should define its own message boundary—newline, length, frame, or close—and flush when the receiver needs that complete unit. Too-late flushing can deadlock a request/response exchange; too-early flushing creates many small writes.\n\nSome classes have special auto-flush behavior. A PrintWriter configured for auto-flush does so only for particular methods such as `println`, `printf`, or `format`, not after every call to `write` or `print`.",
    visualType: "flow_diagram",
    visualTitle: "Follow output through three different guarantees",
    visual: "```mermaid\nflowchart LR\n  J[Java code writes] --> B[Java buffers]\n  B -->|flush| O[Operating-system / downstream destination]\n  O -->|protocol delivery| P[Peer can process message]\n  O -->|storage-specific force/commit| D[Requested durability boundary]\n  B -->|close| F[Final flush + resource release]\n```",
    codeTitle: "Flush one complete protocol message",
    code: "```java\nimport java.io.BufferedWriter;\nimport java.io.StringWriter;\n\nclass FlushBoundary {\n    public static void main(String[] args) throws Exception {\n        var destination = new StringWriter();\n        try (var writer = new BufferedWriter(destination)) {\n            writer.write(\"PING\");\n            writer.newLine();\n            writer.flush(); // message boundary; writer remains open\n            System.out.print(destination.toString());\n        }\n    }\n}\n```",
    practiceTitle: "Name who needs the data now",
    practice: "If the only answer is “the method is about to close,” let close perform the final flush. If a peer, user, or next layer is waiting while the resource remains open, flush at that defined boundary.",
    followups: [
      "Does flush close the stream?",
      "Why can missing flush deadlock a request-response protocol?",
      "Does OutputStream.flush guarantee physical disk durability?",
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
console.log(`Curated ${Object.keys(lessons).length} buffered-I/O lessons; preserved IDs, slugs, questions, and order.`);
