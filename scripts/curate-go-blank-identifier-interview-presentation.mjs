#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-syntax-basics/blank-identifier/complete-qa.json",
);

const presentations = {
  "go-syntax-basics-blank-identifier-interview-basics": {
    answerSize: "standard",
    beats: [
      {
        cue: "Define the underscore by what happens to its value",
        stage: "Underscore discards a value",
        spokenText: "Go's blank identifier is written as \u0060_\u0060. It can receive a value in a declaration or assignment, but that value is discarded instead of being stored in a variable the program can read later. Each use of \u0060_\u0060 simply says, “this position is intentionally unused.”",
      },
      {
        cue: "Separate it from an ordinary variable binding",
        stage: "No readable binding is made",
        spokenText: "The blank identifier is not a variable named underscore. Code cannot print it, compare it, take its address, or retrieve an earlier value from it. It also does not count as a newly declared variable in a short declaration. The right-hand expression still runs; only the selected result is thrown away.",
        support: {
          type: "comparison",
          title: "What changes when a result is assigned",
          items: [
            {
              label: "Named variable",
              value: "value kept",
              detail: "The result can be checked, logged, or used later.",
              tone: "green",
            },
            {
              label: "Blank identifier",
              value: "value discarded",
              detail: "The result satisfies the assignment position but cannot be recovered.",
              tone: "orange",
            },
            {
              label: "Right-hand call",
              value: "still runs",
              detail: "Discarding one result does not skip the function call.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Show the ordinary multi-value and range uses",
        stage: "It fits multi-value syntax",
        spokenText: "The common uses come from Go syntax that produces more than one value. In \u0060width, _ := dimensions()\u0060, the width is kept and the height is intentionally ignored. In \u0060for _, name := range names\u0060, the loop keeps each name and discards the index.",
        support: {
          type: "code",
          title: "Discard only results the program does not need",
          language: "go",
          code: "package main\n\nimport \"fmt\"\n\nfunc dimensions() (int, int) {\n\treturn 1920, 1080\n}\n\nfunc main() {\n\twidth, _ := dimensions()\n\tfmt.Println(\"width:\", width)\n\n\tfor _, name := range []string{\"Ada\", \"Bo\"} {\n\t\tfmt.Println(name)\n\t}\n}",
          caption: "Output keeps the width and names. The height and range indexes are intentionally unavailable.",
        },
      },
      {
        cue: "Distinguish the two specialised underscore forms",
        stage: "Special forms express intent",
        spokenText: "Two specialised forms use the same spelling for a different purpose. A blank import such as \u0060_ \"database/sql/driver\"\u0060 imports a package only for initialization side effects. An assertion such as \u0060var _ io.Reader = (*File)(nil)\u0060 asks the compiler to verify that \u0060*File\u0060 implements \u0060io.Reader\u0060.",
      },
      {
        cue: "Finish with the information-safety boundary",
        stage: "Errors usually stay named",
        spokenText: "The blank identifier is safe only when the discarded information truly cannot affect correctness. An error normally changes what the caller should do, so \u0060value, err := strconv.Atoi(input)\u0060 should keep and check \u0060err\u0060. Using \u0060value, _\u0060 merely to make code compile can turn invalid input into a believable zero value.",
        recallRule: "Use the blank identifier for a deliberately irrelevant result, never as storage and never as a shortcut for handling important information.",
      },
    ],
  },
  "go-syntax-basics-blank-identifier-when-to-use": {
    answerSize: "standard",
    beats: [
      {
        cue: "Start with the selection rule rather than a syntax list",
        stage: "Ignore only irrelevant data",
        spokenText: "Use \u0060_\u0060 when Go requires a result position but that particular result has no meaning for the current operation. The decision is about information: if losing the value cannot change correctness, diagnosis, logging, or later work, an explicit discard can make the code clearer.",
      },
      {
        cue: "Show how range syntax changes with the needed part",
        stage: "Range can omit or discard",
        spokenText: "For a range loop, keep only the part the loop needs. Use \u0060for i := range items\u0060 when only the index matters, and \u0060for _, item := range items\u0060 when only the value matters. Name both values when both position and data help the work.",
        support: {
          type: "comparison",
          title: "Choose from the information the loop or call needs",
          items: [
            {
              label: "Only index",
              value: "for i := range",
              detail: "The value position can be omitted completely.",
              tone: "blue",
            },
            {
              label: "Only value",
              value: "for _, value := range",
              detail: "The blank identifier discards the index position.",
              tone: "green",
            },
            {
              label: "Both",
              value: "for i, value := range",
              detail: "Name both when each one contributes meaning.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Use a map lookup to show a safe discarded value",
        stage: "Keep the result you need",
        spokenText: "A map lookup can return \u0060value, ok\u0060. If the question is only whether the key exists, \u0060_, ok := scores[name]\u0060 keeps the Boolean and deliberately drops the stored score. The result being discarded is safe because the operation never intends to use that score.",
        support: {
          type: "code",
          title: "Keep existence and discard an unused map value",
          language: "go",
          code: "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tscores := map[string]int{\"Ada\": 90}\n\t_, exists := scores[\"Ada\"]\n\tfmt.Println(\"Ada exists:\", exists)\n\n\tfor _, name := range []string{\"Ada\", \"Bo\"} {\n\t\tfmt.Println(name)\n\t}\n}",
          caption: "The program needs map existence and range values, so only the unused positions are blank.",
        },
      },
      {
        cue: "Protect failures and other diagnostic information",
        stage: "Keep failure information",
        spokenText: "Do not apply the same rule blindly to an \u0060error\u0060. In \u0060n, err := strconv.Atoi(input)\u0060, invalid text produces both a zero integer and a non-nil error. If the program needs to distinguish invalid input from the valid number zero, the error must remain named and checked.",
      },
      {
        cue: "Place specialised uses behind an explicit reason",
        stage: "Special uses need a reason",
        spokenText: "Use a blank import only when package initialization is the intended feature, and usually document why that hidden startup work is needed. Use \u0060var _ Interface = (*Type)(nil)\u0060 when a compile-time interface assertion protects a design contract. In every other case, name the result when future readers may need to understand or act on it.",
        recallRule: "Discard a result only when the current operation needs another result and losing this one cannot hide a decision or failure.",
      },
    ],
  },
  "go-syntax-basics-blank-identifier-common-mistake": {
    answerSize: "standard",
    beats: [
      {
        cue: "Name the highest-risk misuse and its returned values",
        stage: "Ignored errors become data",
        spokenText: "The most dangerous misuse is replacing an error with \u0060_\u0060. A call such as \u0060n, _ := strconv.Atoi(\"bad\")\u0060 returns \u00600\u0060 for \u0060n\u0060 and discards the error that explains why. Later code sees an ordinary integer and may treat invalid input as a real zero.",
        support: {
          type: "trace",
          title: "How one discarded error hides the original failure",
          items: [
            {
              label: "Input",
              value: "\"bad\"",
              detail: "The text is not a valid decimal integer.",
              tone: "blue",
            },
            {
              label: "Atoi result",
              value: "0 + error",
              detail: "Go returns a zero value together with the reason parsing failed.",
              tone: "orange",
            },
            {
              label: "Assign error to _",
              value: "reason lost",
              detail: "Only the valid-looking integer remains available.",
              tone: "orange",
            },
            {
              label: "Later branch",
              value: "trusts 0",
              detail: "The symptom appears after the real cause has disappeared.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain the cost of discarding an ordinary value too early",
        stage: "Lost values stay unavailable",
        spokenText: "A second mistake is discarding data before the requirement is clear. If a loop later needs an index for an error message or stable position, \u0060for _, value := range values\u0060 cannot recover it inside that iteration. Name the index from the start when it forms part of the result or diagnosis.",
      },
      {
        cue: "Clarify blank imports and interface assertions",
        stage: "Special forms differ",
        spokenText: "A blank import runs package initialization without exposing an imported package name, so using it without a clear side-effect requirement hides startup behavior. A declaration such as \u0060var _ io.Reader = (*File)(nil)\u0060 only checks type compatibility at compile time; it does not create a usable reader or call any methods.",
      },
      {
        cue: "Replace the discard at the original boundary",
        stage: "Handle the cause at its source",
        spokenText: "Prevent these bugs where the values are produced. Keep \u0060err\u0060, return or wrap it with context, and use \u0060_\u0060 only after deciding that the selected value is irrelevant. A comment helps when a discard or side-effect import would otherwise surprise a reader.",
        support: {
          type: "code",
          title: "Keep invalid input separate from a valid zero",
          language: "go",
          code: "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc parseCount(input string) (int, error) {\n\tn, err := strconv.Atoi(input)\n\tif err != nil {\n\t\treturn 0, fmt.Errorf(\"invalid count %q: %w\", input, err)\n\t}\n\treturn n, nil\n}\n\nfunc main() {\n\tfor _, input := range []string{\"0\", \"bad\"} {\n\t\tn, err := parseCount(input)\n\t\tfmt.Printf(\"input=%q count=%d err=%v\\n\", input, n, err)\n\t}\n}",
          caption: "The valid zero has no error; invalid text keeps the reason instead of silently becoming the same state.",
        },
      },
      {
        cue: "State the regression test that protects the boundary",
        stage: "Test valid and invalid input",
        spokenText: "Test both a legitimate zero and malformed input. The first should return zero with no error; the second should return a non-nil error. That pair proves the program no longer confuses a normal zero value with the zero value returned alongside a failure.",
        recallRule: "If a returned value explains success or failure, name it and test both sides of that boundary.",
      },
    ],
  },
  "go-syntax-basics-blank-identifier-compare": {
    answerSize: "standard",
    beats: [
      {
        cue: "Describe the information retained by each form",
        stage: "Naming preserves information",
        spokenText: "A named variable keeps a result available for later logic, logging, debugging, or return. Assigning the same result to \u0060_\u0060 permanently discards it. This is not a performance choice; it is a statement about whether that piece of information belongs to the operation.",
        support: {
          type: "comparison",
          title: "Choose by what the program must retain",
          items: [
            {
              label: "Named result",
              value: "retain",
              detail: "Use, validate, log, or return the value later.",
              tone: "green",
            },
            {
              label: "Blank identifier",
              value: "discard",
              detail: "Make an intentionally irrelevant result unavailable.",
              tone: "orange",
            },
            {
              label: "Omitted position",
              value: "omit",
              detail: "Prefer syntax such as an index-only range when Go does not require the other position.",
              tone: "blue",
            },
          ],
        },
      },
      {
        cue: "Compare two different results from one map lookup",
        stage: "One call can need one result",
        spokenText: "For \u0060score, ok := scores[name]\u0060, name \u0060score\u0060 when the stored number will be used. If the only question is whether the key exists, \u0060_, ok := scores[name]\u0060 accurately drops the number and keeps the decision. The same call supports either choice because the requirement differs.",
      },
      {
        cue: "Contrast a harmless discard with a harmful one",
        stage: "Failure results stay visible",
        spokenText: "An error normally deserves a name because it explains whether the other result is trustworthy. \u0060n, err := strconv.Atoi(input)\u0060 lets the caller reject malformed text; \u0060n, _ := strconv.Atoi(input)\u0060 makes malformed text look like zero. The convenience of one less variable does not justify losing that distinction.",
        support: {
          type: "code",
          title: "Discard map data but retain a parsing error",
          language: "go",
          code: "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc main() {\n\tscores := map[string]int{\"Ada\": 90}\n\t_, exists := scores[\"Ada\"]\n\tfmt.Println(\"Ada exists:\", exists)\n\n\tn, err := strconv.Atoi(\"12\")\n\tif err != nil {\n\t\tfmt.Println(\"invalid number:\", err)\n\t\treturn\n\t}\n\tfmt.Println(\"number:\", n)\n}",
          caption: "The score is irrelevant to existence, but the parsing error determines whether the number is valid.",
        },
      },
      {
        cue: "Explain the relation to Go's unused-variable rule",
        stage: "Blank makes intent compile",
        spokenText: "Go rejects an unused local variable, while \u0060_\u0060 explicitly satisfies a required assignment position without creating a binding. Do not invent a named variable and then ignore it. Also do not reach for \u0060_\u0060 when the syntax can express the intent more directly, such as \u0060for i := range items\u0060 for an index-only loop.",
      },
      {
        cue: "Close with the future-information test",
        stage: "Decide from future meaning",
        spokenText: "Use \u0060_\u0060 when the discarded result has no present or expected future meaning. Use a named variable when the value affects behavior, communicates a contract, or could explain a failure. If the safety of discarding it needs a long defense, keeping and checking it is usually clearer.",
        recallRule: "Name information the program may act on; use the blank identifier only for information the operation deliberately does not need.",
      },
    ],
  },
  "go-syntax-basics-blank-identifier-scenario": {
    answerSize: "standard",
    beats: [
      {
        cue: "Start at the multi-value call that produced the zero",
        stage: "The error is the first signal",
        spokenText: "Many Go functions return a useful value together with an \u0060error\u0060. On failure, the useful value is often its type's zero value. For \u0060strconv.Atoi(\"bad\")\u0060, that pair is an integer zero and a non-nil parsing error; the error is what says the integer must not be trusted.",
        support: {
          type: "trace",
          title: "Trace the bug from cause to misleading symptom",
          items: [
            {
              label: "Parse input",
              value: "\"bad\"",
              detail: "The conversion cannot produce a valid integer.",
              tone: "blue",
            },
            {
              label: "Return pair",
              value: "0, error",
              detail: "The zero is accompanied by the actual failure signal.",
              tone: "orange",
            },
            {
              label: "Discard error",
              value: "n, _",
              detail: "The program removes the only evidence that zero is invalid.",
              tone: "orange",
            },
            {
              label: "Use n later",
              value: "looks valid",
              detail: "A later calculation or branch receives a believable zero.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain why the symptom appears away from the cause",
        stage: "Discard hides the failure",
        spokenText: "With \u0060n, _ := strconv.Atoi(input)\u0060, parsing still happens; only its error result disappears. The next function receives \u00600\u0060 and may store it, calculate with it, or choose a valid zero branch. The visible bug therefore appears later even though the first wrong decision was discarding the error.",
      },
      {
        cue: "Give a focused debugging path",
        stage: "Restore the boundary check",
        spokenText: "Search the path that created the first suspicious zero and inspect multi-value calls using \u0060_\u0060. Replace the blank position with a named result, reproduce the smallest failing input, and stop at the first non-nil error. Return or wrap that error at the boundary instead of patching a later symptom.",
      },
      {
        cue: "Lock the distinction between zero and invalid text",
        stage: "Test both sides of zero",
        spokenText: "A focused regression test should prove that \u0060\"0\"\u0060 returns zero without an error and \u0060\"bad\"\u0060 returns an error. Testing both inputs matters because checking only malformed text does not prove that the valid zero case still works.",
        support: {
          type: "code",
          title: "Protect valid zero and invalid input with one test",
          language: "go",
          code: "package blankidentifier\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n\t\"testing\"\n)\n\nfunc parseCount(input string) (int, error) {\n\tn, err := strconv.Atoi(input)\n\tif err != nil {\n\t\treturn 0, fmt.Errorf(\"invalid count %q: %w\", input, err)\n\t}\n\treturn n, nil\n}\n\nfunc TestParseCount(t *testing.T) {\n\tif n, err := parseCount(\"0\"); err != nil || n != 0 {\n\t\tt.Fatalf(\"valid zero: n=%d err=%v\", n, err)\n\t}\n\tif _, err := parseCount(\"bad\"); err == nil {\n\t\tt.Fatal(\"invalid input should return an error\")\n\t}\n}",
          caption: "Run with go test. The test keeps a real zero distinct from the zero returned with a parsing failure.",
        },
      },
      {
        cue: "Generalise the same check to other Go boundaries",
        stage: "Other zero values hide too",
        spokenText: "The same pattern applies to I/O, database calls, type assertions, and map lookups: a discarded companion result can remove the explanation for an empty string, nil pointer, false Boolean, or partial count. Keep any result that tells the caller whether the main value is complete and trustworthy.",
        recallRule: "Trace a suspicious zero back to its multi-value call, restore the discarded signal, handle it there, and test valid and failing inputs.",
      },
    ],
  },
};

const deepFixes = {
  "go-syntax-basics-blank-identifier-interview-basics": {
    title: "What the blank identifier changes",
    content: "The blank identifier can appear wherever Go needs an identifier on the left side of a declaration or assignment. The right-hand expression is still evaluated, but the result placed in \u0060_\u0060 is not stored in an addressable binding. Every underscore occurrence is independent, so there is no previous blank value to retrieve.\n\nThis matters in short declarations: \u0060_\u0060 never counts as a newly declared variable. It is useful for selecting one result from a multi-value operation or one part of a range iteration, but it should describe an intentional information choice rather than silence Go's unused-variable checks.\n\nBlank imports and compile-time interface assertions are specialised forms. The import keeps initialization side effects without a package binding; the assertion asks the compiler to check assignability without creating a runtime object for later use.",
  },
  "go-syntax-basics-blank-identifier-when-to-use": {
    title: "When the blank identifier is appropriate",
    content: "Start with the results the operation needs to keep. A value-only range loop needs the element but not its index, so \u0060for _, value := range values\u0060 is a natural discard. An existence-only map lookup needs \u0060ok\u0060 but not the stored value, so \u0060_, ok := mapping[key]\u0060 states that question directly.\n\nKeep a named result when it controls success, failure, logging, cleanup, or a later calculation. Errors usually belong in this group because the other returned value may be a zero or partial result on failure.\n\nPrefer omission when Go syntax supports it, such as \u0060for index := range values\u0060 for an index-only loop. Reserve blank imports for required initialization side effects and blank interface assertions for deliberate compile-time contract checks.",
  },
  "go-syntax-basics-blank-identifier-compare": {
    title: "Discarding is an information decision",
    content: "A named variable creates a binding that can be inspected and used later. The blank identifier accepts the same assignment position but removes that result from the program immediately. The function call and its side effects still happen, so \u0060_\u0060 changes retained information rather than execution of the right-hand side.\n\nFor a map lookup, \u0060_, ok := values[key]\u0060 is precise when only existence matters. For parsing, \u0060n, err := strconv.Atoi(input)\u0060 should normally keep both values because the error decides whether \u0060n\u0060 is trustworthy.\n\nGo's unused-local rule is not a reason to discard useful information. Choose \u0060_\u0060 after deciding the value is irrelevant; otherwise name the result and make its handling visible.",
  },
};

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
let curated = 0;

for (const [targetSlug, presentation] of Object.entries(presentations)) {
  const matches = document.questions.filter((question) => question.slug === targetSlug);
  if (matches.length !== 1) {
    throw new Error("Expected exactly one " + targetSlug + " question, found " + matches.length);
  }

  const sections = matches[0].answer?.sections;
  const speakable = sections?.find((section) => section.type === "speakable_answer");
  if (!speakable) {
    throw new Error("Missing speakable_answer section for " + targetSlug);
  }

  speakable.answerSize = presentation.answerSize;
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");

  const deepFix = deepFixes[targetSlug];
  if (deepFix) {
    const deep = sections.find((section) => section.type === "deep_explanation");
    if (!deep) {
      throw new Error("Missing deep_explanation section for " + targetSlug);
    }
    deep.title = deepFix.title;
    deep.content = deepFix.content;
  }

  curated += 1;
}

if (curated !== document.questions.length) {
  throw new Error("Curated " + curated + " of " + document.questions.length + " questions");
}

fs.writeFileSync(questionFile, JSON.stringify(document, null, 2) + "\n");
console.log("Curated Interview Answer presentations for " + curated + " blank identifier questions");
