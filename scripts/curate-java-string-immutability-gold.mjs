#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(
  repoRoot,
  "content/java-backend-fresher/java-strings/string-immutability/complete-qa.json",
);
const requestedSlug = process.argv[2] ?? null;
const reviewedOn = "2026-09-09";

const expectedQuestions = [
  {
    id: "3",
    slug: "java-strings-overview",
    question: "What is the Java String abstraction and why does it exist?",
  },
  {
    id: "jbf-strings-immutability-001",
    slug: "why-is-string-immutable-in-java",
    question: "Why is String immutable in Java?",
  },
  {
    id: "jbf-strings-immutability-002",
    slug: "why-is-string-concatenation-in-a-loop-slow-in-java",
    question: "If String is immutable, why is String concatenation in a loop slow in Java?",
  },
];

const lessons = {
  "java-strings-overview": {
    layout: "concept-explainer",
    minutes: 10,
    direct:
      "`String` is Java's standard immutable text type. It represents text as UTF-16 code units and supplies common operations for comparing, searching, slicing, and converting text. A fixed value is easy to share, intern, and use as a map key; use `StringBuilder` when the text must be assembled repeatedly.",
    metaDescription:
      "Learn how Java String represents immutable UTF-16 text, how equality and Unicode indexing work, and when to use StringBuilder.",
    quick: [
      "`String` is a final, immutable class for text; an existing String value never changes.",
      "A variable may point to another String, but that does not modify the old object.",
      "Use `equals()` for text content; `==` only asks whether two references point to the same object.",
      "Indexes and `length()` use UTF-16 code units, so one Unicode code point can occupy two positions.",
      "Use `StringBuilder` for repeated construction, then call `toString()` for the finished value.",
    ],
    beats: [
      {
        cue: "Define the public text abstraction",
        stage: "A stable text value",
        spokenText:
          "`String` is Java's standard type for text. It is a final, immutable class: after a String object is created, its text does not change. The class gives every Java program the same operations for tasks such as `contains()`, `substring()`, `equals()`, and case conversion, instead of making each application invent its own text representation.",
      },
      {
        cue: "Show what immutability changes in ordinary code",
        stage: "Operations return values",
        spokenText:
          "A call such as `String upper = name.toUpperCase()` produces a result and leaves `name`'s original object unchanged. The result may be a different object, or a method may reuse the original when nothing changes. The important promise is about the value, not a promise that every method call allocates a new object.",
      },
      {
        cue: "Separate content equality from object identity",
        stage: "Content and identity",
        spokenText:
          "For example, `new String(\"Java\")` and the literal `\"Java\"` contain the same text, so `left.equals(right)` is true. They are separate objects, so `left == right` is false. Interning can make some equal strings share a reference, but application logic should still use `equals()` when it means same text.",
        support: {
          type: "comparison",
          title: "Pick the type by the job",
          items: [
            {
              label: "String",
              value: "finished text",
              detail: "Immutable value for fields, parameters, keys, and return values.",
              tone: "blue",
            },
            {
              label: "StringBuilder",
              value: "text under construction",
              detail: "Mutable sequence for repeated appends in one thread.",
              tone: "green",
            },
            {
              label: "StringBuffer",
              value: "synchronized operations",
              detail: "Mutable sequence whose individual methods are synchronized; a larger workflow may still need coordination.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain the Unicode indexing boundary",
        stage: "UTF-16 positions",
        spokenText:
          "The public model uses UTF-16. Methods such as `length()` and `charAt()` work with 16-bit code units, not always with complete user-visible characters. A supplementary character such as many emoji uses a surrogate pair and occupies two indexes. When code needs Unicode code points, use APIs such as `codePointCount()` or `codePoints()`.",
      },
      {
        cue: "Close with why Java keeps both immutable and mutable forms",
        stage: "Share versus build",
        spokenText:
          "Immutability makes a String value safe to share and gives it stable content equality and hashing, which is useful for map keys and interning. It is less suitable for growing text one piece at a time. In that case, build with one `StringBuilder`, then publish the final String. The String abstraction stays stable even though OpenJDK's private storage can change between releases.",
        recallRule:
          "Treat String as a finished text value: compare its content, use code-point APIs when needed, and switch to StringBuilder while assembling it.",
      },
    ],
    deepTitle: "String is a value, not a writable buffer",
    deep: `**Text model and Unicode positions**

The Java API defines String as an immutable sequence in UTF-16 form. A \`char\` is one UTF-16 code unit, so \`length()\` counts code units and \`charAt(index)\` returns one code unit. Most common letters need one unit, but a supplementary Unicode code point needs a high-surrogate and low-surrogate pair. This is why the text \`"A😀"\` has three Java indexes but two code points. Code that processes full Unicode values can use \`codePointAt\`, \`codePointCount\`, or \`codePoints\`.

**Value equality and interning**

Two different String objects can hold equal text. \`equals()\` compares that text, while \`==\` compares references. The language interns string literals and compile-time constant strings, and \`intern()\` returns a canonical representative. That sharing is useful, but it must not become a reason to use \`==\` for business comparisons: a String read from a file, request, or database can contain the same characters without being the same object.

Because the content is stable, a String can be shared for reading and its equality and hash value stay consistent. This makes it a natural key type. Immutability describes the String object; a field that is reassigned to different strings still needs the normal visibility rules when threads share that field.

**Mutable construction and private storage**

Text assembly is a different job. StringBuilder provides a mutable character sequence for repeated \`append\` calls and then produces a String with \`toString()\`. StringBuffer synchronizes its individual operations, but method-level locking does not automatically make a multi-step edit atomic.

Current OpenJDK can store many strings compactly in a byte array plus an encoding marker. Older JDKs used a different representation. That private layout is an optimization, not the meaning of String, so application code should rely on the API contract rather than a particular backing array.`,
    codeTitle: "String values, equality, and Unicode indexes",
    code: `\`\`\`java
class StringOverviewDemo {
    public static void main(String[] args) {
        String original = "Java";
        String upper = original.toUpperCase();
        System.out.println(original);             // Java
        System.out.println(upper);                // JAVA

        String copy = new String("Java");
        System.out.println(original.equals(copy)); // true: equal text
        System.out.println(original == copy);      // false: different objects

        String sample = "A\\uD83D\\uDE00";
        System.out.println(sample.length());       // 3 UTF-16 code units
        System.out.println(
                sample.codePointCount(0, sample.length())); // 2 code points

        String result = new StringBuilder("Java")
                .append(" strings")
                .toString();
        System.out.println(result);                // Java strings
    }
}
\`\`\`

The example keeps the immutable source value, compares content separately from identity, shows the UTF-16 boundary, and uses a builder only while text is being assembled.`,
    followups: [
      "Why should String content usually be compared with equals() instead of ==?",
      "Why can String.length() differ from the number of Unicode code points?",
      "When should StringBuilder replace String concatenation?",
      "What does String.intern() return?",
    ],
  },

  "why-is-string-immutable-in-java": {
    layout: "concept-explainer",
    minutes: 9,
    direct:
      "String is immutable because Java exposes it as a fixed value: the class is final, its state is private, and its API has no operation that changes an existing object's text. Methods such as `replace()` return a result while the original remains unchanged. Stable content supports safe sharing, interning, and reliable map keys.",
    metaDescription:
      "Understand why Java String is immutable, how method results differ from mutation, and why stable values are safe to share and use as map keys.",
    quick: [
      "Immutability means the String object's value is fixed after construction.",
      "Reassigning a variable changes the reference, not the old String object.",
      "String is final, keeps its state private, and exposes no mutating method.",
      "A method result may be a new object or the same object; the original value still does not change.",
      "Stable content enables safe sharing, interning, and dependable `equals()` and `hashCode()` behavior.",
    ],
    beats: [
      {
        cue: "Define immutability at the object level",
        stage: "The value stays fixed",
        spokenText:
          "String immutability means that an existing String object's text cannot change after construction. It does not mean a variable can never change. In `String name = \"alice\"`, the object holds `alice`; later assigning another String to `name` only changes which object the variable refers to.",
      },
      {
        cue: "Explain how the public API protects the value",
        stage: "No mutation path",
        spokenText:
          "Java protects the guarantee in several ways. `String` is final, its stored state is private, and its public API does not expose a mutator. A call such as `String upper = name.toUpperCase()` returns a value while the original stays `alice`. Final alone would not make a class immutable; callers also need no path to alter its state.",
        support: {
          type: "trace",
          title: "The object stays; the reference can move",
          items: [
            {
              label: "Original",
              value: "name → alice",
              detail: "The first String value exists unchanged.",
              tone: "blue",
            },
            {
              label: "Operation",
              value: "toUpperCase()",
              detail: "The method computes the result ALICE without editing alice.",
              tone: "orange",
            },
            {
              label: "Result",
              value: "upper → ALICE",
              detail: "A result reference holds the transformed value.",
              tone: "green",
            },
            {
              label: "Optional reassignment",
              value: "name = upper",
              detail: "Only the variable moves; the old object was never rewritten.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Connect the guarantee to everyday Java behavior",
        stage: "Why stability matters",
        spokenText:
          "A stable text value can be passed to another method or thread without that receiver changing it for everyone else. The JVM can safely share interned strings, and a String used as a `HashMap` key keeps the same content after insertion. These benefits all come from the value staying fixed, not from memorizing one internal field declaration.",
      },
      {
        cue: "Clarify method results and implementation details",
        stage: "Important boundaries",
        spokenText:
          "Immutability does not promise a fresh object for every call. If an operation makes no change, a method may return the same String instance. It also should not be defined as 'a private final char array': OpenJDK has changed its storage representation. The reliable contract is that no caller can observe the existing String's value changing.",
      },
      {
        cue: "Separate immutable values from mutable shared references",
        stage: "Thread-safety boundary",
        spokenText:
          "Several threads can read the same String value without a lock because none can mutate that object. However, a shared field such as `currentName` may still be reassigned from one String to another. That update needs suitable publication, such as a final field at construction, `volatile`, or locking, when other threads must see it.",
        recallRule:
          "The String object's text is fixed; variables can move, methods return values, and shared reference updates still follow concurrency rules.",
      },
    ],
    deepTitle: "Immutability is an API guarantee",
    deep: `**The class closes every mutation route**

An immutable class must prevent callers from changing the state that defines its value. String is final, so a subclass cannot replace its behavior with a mutable version. Its representation is not exposed for callers to edit, and the API provides operations that calculate String results instead of editing the receiver. Constructors that accept a mutable array copy the relevant content, so later changes to that input array do not alter the String.

No single keyword is enough. A final class could still have a method that changes a field, and a final array reference could still point to an array whose elements are modified. The whole design—construction, encapsulation, and every operation—creates the immutability guarantee.

**Stable values remove aliasing surprises**

Suppose two components receive the same String reference as a file name or customer ID. Neither component can change that shared object's characters after the other has validated it. The same stability allows literal and interned strings to be shared, and it keeps content-based equality and hashing dependable after a String becomes a map key.

This does not make every surrounding object immutable. A \`Customer\` can hold a String name and later replace that field with another String. The old and new String values are both immutable, while the Customer is still mutable.

**Result objects and implementation details**

Ignoring a returned value is a common practical bug: \`name.toUpperCase()\` alone does not update \`name\`. Assign the returned result when it is needed. At the same time, do not infer that every apparently changing method must allocate. Some operations can return \`this\` when the requested transformation changes nothing.

The private representation has evolved across JDK versions, so explanations based on a particular \`char[]\` or \`byte[]\` are fragile. The public promise is simpler and stronger: once constructed, a String's character sequence never changes.`,
    codeTitle: "Mutation-like calls return a value",
    code: `\`\`\`java
class StringImmutabilityDemo {
    public static void main(String[] args) {
        String original = "java";
        String changed = original.replace('j', 'J');

        System.out.println(original); // java
        System.out.println(changed);  // Java

        String ignored = "hello";
        ignored.toUpperCase();
        System.out.println(ignored);  // hello

        ignored = ignored.toUpperCase();
        System.out.println(ignored);  // HELLO

        if (!original.equals("java")) {
            throw new AssertionError("The original String changed");
        }
    }
}
\`\`\`

The first transformation keeps both values. The second call shows why code must use the returned value when it wants the transformed text.`,
    followups: [
      "Why is final by itself not enough to make a class immutable?",
      "How does String immutability help when a String is used as a HashMap key?",
      "Why does ignoring the result of replace() or toUpperCase() cause a bug?",
      "Does String immutability make a reassigned shared field automatically thread-safe?",
    ],
  },

  "why-is-string-concatenation-in-a-loop-slow-in-java": {
    layout: "comparison",
    minutes: 9,
    direct:
      "A String cannot grow in place. With `result += piece`, each loop iteration creates another concatenated String and may copy the whole prefix built so far. For many similar-sized pieces, the repeated copying can approach quadratic work. Reuse one `StringBuilder` across the loop and call `toString()` after the last append.",
    metaDescription:
      "Learn why repeated String concatenation in a loop can become slow, how prefix copying grows, and when to use one StringBuilder.",
    quick: [
      "The costly pattern is `result += piece` while `result` becomes longer on every iteration.",
      "Each runtime concatenation creates a String result; the accumulated prefix may be copied again.",
      "For similar-sized pieces, repeated prefix copying can approach O(n²) work in the final length.",
      "Create one `StringBuilder` before the loop, call `append()` inside it, then call `toString()` once.",
      "A small one-off `a + b` is readable; compiler and JVM details should not be described as one fixed rewrite.",
    ],
    beats: [
      {
        cue: "Identify the repeated-growing-result pattern",
        stage: "A new combined value",
        spokenText:
          "String is immutable, so `result += piece` cannot extend the existing object. Each loop pass evaluates another concatenation and produces a String containing the old result followed by the new piece. The problem is not the `+` symbol by itself; it is rebuilding a result that becomes longer on every pass.",
      },
      {
        cue: "Explain why the total cost compounds",
        stage: "The prefix is copied again",
        spokenText:
          "Imagine appending equal-sized pieces. The first pass copies a short result, the next pass copies a longer prefix, and later passes copy nearly everything already built. Those copied lengths form a growing sum. With many pieces, total copying can approach O(n²) in the final text length even though the final String itself contains only O(n) characters.",
        support: {
          type: "trace",
          title: "The same prefix is paid for repeatedly",
          items: [
            {
              label: "Pass 1",
              value: "\"\" + A → A",
              detail: "There is almost no old prefix to copy.",
              tone: "blue",
            },
            {
              label: "Pass 2",
              value: "A + B → AB",
              detail: "The prefix A becomes part of a new result.",
              tone: "orange",
            },
            {
              label: "Pass 3",
              value: "AB + C → ABC",
              detail: "A and B are copied into yet another result.",
              tone: "orange",
            },
            {
              label: "Builder path",
              value: "append A, B, C",
              detail: "One mutable sequence retains its capacity between appends.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Show the builder pattern at the point of use",
        stage: "Reuse mutable capacity",
        spokenText:
          "The usual fix is `StringBuilder builder = new StringBuilder()` before the loop, followed by `builder.append(piece)` inside it and `builder.toString()` at the end. The builder can reuse its mutable storage across appends. It may occasionally grow its capacity, but it does not rebuild the entire String prefix on every iteration.",
      },
      {
        cue: "State the boundary for ordinary concatenation",
        stage: "Small expressions are fine",
        spokenText:
          "For a short, one-off expression such as `first + \" \" + last`, `+` is usually the clearest code. Compile-time constants can be folded, and runtime concatenation is implemented by compiler and JVM machinery. The Java specification allows different strategies, so it is safer to explain the observable result and the loop cost than promise one exact temporary-object sequence.",
      },
      {
        cue: "Close with the performance decision",
        stage: "Optimize the real pattern",
        spokenText:
          "Use a builder when code repeatedly assembles a growing value, especially in a loop or conditional sequence. If the expected final size is known, an initial capacity can reduce buffer growth. For important hot paths, measure with a proper benchmark because piece sizes, JDK optimizations, and surrounding work affect the actual speed.",
        recallRule:
          "Use + for a small expression; use one StringBuilder when the same growing result is extended repeatedly.",
      },
    ],
    deepTitle: "Repeated prefix copying drives the cost",
    deep: `**Cumulative copying**

The Java language defines a runtime String concatenation as producing a String that contains the left operand followed by the right operand. Because the result is immutable, a statement such as \`text = text + part\` cannot reserve more room inside the old String. The next value has to contain both the accumulated prefix and the new part.

If ten equal-sized pieces are added, the prefix sizes copied across the loop grow roughly like 0, 1, 2, and so on. The sum of those sizes grows quadratically with the number of pieces. Describing only “many temporary objects” misses the main point: object count grows linearly with loop iterations, while repeatedly copying the expanding prefix is what can make the total character work much larger.

**Mutable capacity changes the pattern**

StringBuilder represents a mutable sequence. \`append\` adds to the same logical builder, and its internal capacity is retained for later appends. Capacity occasionally has to grow and existing content may be copied during that growth, but growth is not required for every piece. This normally gives amortized linear work for assembling the final text. Calling \`toString()\` at the boundary produces the immutable value that the rest of the program can safely use.

Providing an estimated capacity can help when the output size is predictable, but guessing a very large value can waste memory. StringBuffer offers synchronized individual operations; it is not the default choice for a builder local to one thread.

**Compiler and measurement boundaries**

Constant concatenations such as \`"Java" + " 25"\` can be evaluated at compile time. For non-constant expressions, the JLS permits compilers to choose an implementation technique, and current javac versions can use \`StringConcatFactory\` rather than a literal source-level StringBuilder rewrite. That optimization can handle one expression well, but it does not change the source-level fact that assigning a newly concatenated growing String on every loop pass repeats the work.

Choose the readable \`+\` form for small expressions and a reusable builder for iterative assembly. If the code is performance-critical, compare implementations with JMH or application measurements instead of timing one loop with \`currentTimeMillis()\`.`,
    codeTitle: "One builder for the whole loop",
    code: `\`\`\`java
import java.util.List;

class StringLoopDemo {
    static String withPlus(List<String> parts) {
        String result = "";
        for (String part : parts) {
            result += part;
        }
        return result;
    }

    static String withBuilder(List<String> parts) {
        StringBuilder builder = new StringBuilder();
        for (String part : parts) {
            builder.append(part);
        }
        return builder.toString();
    }

    public static void main(String[] args) {
        List<String> parts = List.of("Java", " ", "strings");
        String slow = withPlus(parts);
        String efficient = withBuilder(parts);

        if (!slow.equals(efficient)) {
            throw new AssertionError("The results should match");
        }
        System.out.println(efficient); // Java strings
    }
}
\`\`\`

Both methods have the same result. The difference is that \`withBuilder\` keeps one mutable builder across every loop iteration.`,
    followups: [
      "Why can repeated String concatenation approach quadratic work?",
      "Why must the StringBuilder be created outside the loop?",
      "When is the String + operator still a good choice?",
      "When can an initial StringBuilder capacity help?",
    ],
  },
};

const document = JSON.parse(fs.readFileSync(contentPath, "utf8"));
if (document.topicSlug !== "string-immutability" || !Array.isArray(document.questions)) {
  throw new Error("Unexpected String immutability document shape.");
}

const actualIdentity = document.questions.map(({ id, slug, question }) => ({ id, slug, question }));
if (JSON.stringify(actualIdentity) !== JSON.stringify(expectedQuestions)) {
  throw new Error(`Question identity drift:\n${JSON.stringify(actualIdentity, null, 2)}`);
}

if (requestedSlug && !Object.hasOwn(lessons, requestedSlug)) {
  throw new Error(`Unknown target slug: ${requestedSlug}`);
}

for (const question of document.questions) {
  if (requestedSlug && question.slug !== requestedSlug) continue;
  const lesson = lessons[question.slug];
  if (!lesson) throw new Error(`Missing authored lesson for ${question.slug}`);

  question.direct_answer = lesson.direct;
  question.layout_type = lesson.layout;
  question.difficulty = "easy";
  question.importance = "high";
  question.reading_time_minutes = lesson.minutes;
  question.last_updated = reviewedOn;
  delete question.interviewer_intent;
  delete question.speakable_v2;

  const interview = {
    type: "speakable_answer",
    title: "Interview answer",
    answerSize: "standard",
    beats: lesson.beats,
    content: lesson.beats.map((beat) => beat.spokenText).join("\n\n"),
  };

  question.answer = {
    sections: [
      {
        type: "key_points",
        title: "Quick revision",
        items: lesson.quick,
      },
      interview,
      {
        type: "deep_explanation",
        title: lesson.deepTitle,
        content: lesson.deep,
      },
      {
        type: "code_example",
        title: lesson.codeTitle,
        content: lesson.code,
      },
    ],
  };
  question.followup_questions = lesson.followups;
  question.seo = {
    metaTitle: `${question.title} | Java Interview Questions`,
    metaDescription: lesson.metaDescription,
  };
}

fs.writeFileSync(contentPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(
  `Curated ${requestedSlug ? 1 : expectedQuestions.length} String immutability lesson${requestedSlug ? "" : "s"}.`,
);
