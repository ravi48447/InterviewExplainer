#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-syntax-basics/comparisons/complete-qa.json",
);
const requestedSlug = process.argv[2] ?? null;

const lessons = {
  "go-syntax-basics-comparisons-interview-basics": {
    quick: [
      "Booleans, numbers, strings, pointers, and channels support `==` and `!=`; complex numbers support equality but not ordering.",
      "An array is comparable when its element type is comparable; a struct is comparable when every field type is comparable.",
      "Slices, maps, and functions can be compared only with `nil`, not with another value of the same type.",
      "Only integers, floating-point values, and strings support `<`, `<=`, `>`, and `>=`.",
      "An interface comparison can panic when both interfaces hold values of the same uncomparable dynamic type.",
    ],
    deep: {
      title: "Equality and ordering are different type rules",
      content: [
        "A Go comparison produces a Boolean result, but the allowed operators depend on the operand type. Boolean, numeric, string, pointer, and channel types support equality. Complex numbers are included in numeric equality: their real and imaginary parts must both be equal. Pointers and channels compare identity rather than the data reached through them.",
        "Arrays inherit comparability from their element type, and structs inherit it from all their field types. Equal arrays are checked element by element; equal structs are checked field by field. Adding a slice, map, or function field makes the entire struct unavailable to `==`, even when the remaining fields are comparable.",
        "Slices, maps, and functions may be compared with `nil`, but not with another value of their own type. Ordering is narrower than equality: integers, floating-point values, and strings are ordered, while complex numbers, booleans, pointers, channels, arrays, and structs are not. String ordering is lexicographic by bytes, so it is deterministic but not locale-aware human sorting.",
        "Interfaces add a runtime boundary. Two interface values compare through their dynamic types and values. If both dynamic types are identical but that type is not comparable, such as `[]int`, the comparison panics. Code accepting `any` therefore needs to inspect or constrain the concrete value before relying on interface equality.",
      ].join("\n\n"),
    },
    beats: [
      {
        cue: "Separate equality eligibility from the meaning of equality",
        stage: "Equality follows the type",
        spokenText: "`==` and `!=` work when the operand type is comparable. Booleans, all numeric types including complex numbers, strings, pointers, and channels are comparable. Equality is exact according to the type: pointers compare addresses, channels compare channel identity, and complex numbers compare both parts. It is not automatically an approximate test or a business rule.",
        support: {
          type: "comparison",
          title: "Where Go's built-in equality works",
          items: [
            {
              label: "bool, number, string",
              value: "equality",
              detail: "Use `==` and `!=`; complex numbers are equal only when both parts match.",
              tone: "blue",
            },
            {
              label: "pointer, channel, interface",
              value: "identity or dynamic value",
              detail: "Pointers and channels compare identity; an interface also checks its concrete value.",
              tone: "neutral",
            },
            {
              label: "array and struct",
              value: "conditional equality",
              detail: "Every element or field type must itself be comparable.",
              tone: "green",
            },
            {
              label: "slice, map, function",
              value: "nil check only",
              detail: "They cannot be compared with another value of the same type.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain how composite values inherit the rule",
        stage: "Composite types inherit rules",
        spokenText: "Arrays compare element by element, so `[2]int{1, 2} == [2]int{1, 2}` is true. Structs compare their fields in source order. Both forms are allowed only when the contained types are comparable; a struct with a `[]byte` field cannot use `==`. Slices, maps, and functions are different: they can be checked against `nil`, but not against each other.",
      },
      {
        cue: "Narrow the ordered operators to the types that define order",
        stage: "Ordering is narrower",
        spokenText: "`<`, `<=`, `>`, and `>=` work with integers, floating-point values, and strings. They do not work with complex numbers, booleans, pointers, channels, arrays, or structs. String order is lexicographic by bytes and is case-sensitive, so `\"Zoo\" < \"apple\"` is true even though that may not match a person's dictionary order.",
      },
      {
        cue: "Make the interface runtime boundary explicit",
        stage: "Interfaces add a runtime check",
        spokenText: "Interfaces are comparable, but the concrete value inside them must also be comparable when equality reaches it. `var a any = []int{1}` and `var b any = []int{1}` allow `a == b` to compile, then panic at runtime because slices are not comparable. With `any`, inspect or assert the dynamic type and use the matching helper instead.",
        recallRule: "Equality needs comparable types; ordering needs integers, floating-point values, or strings; interface equality must also survive the dynamic-type check.",
      },
    ],
  },

  "go-syntax-basics-comparisons-when-to-use": {
    quick: [
      "Use `==` when the type is comparable and exact representation equality matches the requirement.",
      "Use ordering operators for numeric ranges or lexicographic string order, not to invent an order for structs.",
      "Use `slices.Equal` or `maps.Equal` when collection contents define equality.",
      "Use `EqualFunc` or a domain method when fields need normalization, tolerance, or selective comparison.",
      "Remember that pointer equality means the same address, while interface equality can fail at the dynamic-value boundary.",
    ],
    deep: {
      title: "Comparison operators and equality requirements",
      content: [
        "Built-in equality is the clearest choice when Go permits it and its exact rule matches the requirement. It works well for identifiers, enum-like values, fixed arrays, and small value structs in which every comparable field belongs to the identity of the value. The compiler then checks that the operation is legal, and the short expression communicates exact equality.",
        "Use ordering operators when the type has the order the program actually needs. Numeric comparisons suit limits, ranges, and counters. String comparisons provide deterministic lexicographic byte order, which is useful for protocol or internal sorting but does not provide locale-aware collation. A struct has no built-in ordering, so sorting records requires choosing fields and a tie-break rule explicitly.",
        "Collection contents require collection helpers. `slices.Equal` compares length and elements, while `maps.Equal` compares key-value pairs. Their `EqualFunc` forms accept a custom element or value rule. Both standard helpers treat nil and empty collections with the same contents as equal, so add an explicit nil check when the application must preserve that distinction.",
        "A comparable type can still need semantic equality. Pointer `==` asks whether two pointers identify the same location, floating-point `==` is exact, and raw struct equality includes every field. Use a named `Equal` method or focused helper when equality means the same instant, the same business identifier, normalized text, or values within an accepted tolerance.",
      ].join("\n\n"),
    },
    beats: [
      {
        cue: "Tie built-in equality to an exact value requirement",
        stage: "Exact values suit ==",
        spokenText: "Use `==` when the type is comparable and exact equality matches the meaning of the data. It is a good fit for IDs, enum-like values, fixed arrays, and value structs whose comparable fields all belong to their identity. For example, two `OrderKey{Tenant: 7, Number: 42}` values can be compared directly when both fields define the key.",
      },
      {
        cue: "Limit ordering to a real numeric or lexical order",
        stage: "Order needs real meaning",
        spokenText: "Use `<`, `<=`, `>`, and `>=` for numeric ranges and for strings when lexicographic byte order is the requirement. Go does not order structs, arrays, pointers, or complex numbers. If records must be sorted, compare the chosen field and add a tie-breaker rather than pretending the whole struct has one natural order.",
      },
      {
        cue: "Move collection contents to the standard helpers",
        stage: "Collections compare by content",
        spokenText: "Slices and maps cannot be compared with each other using `==`. Use `slices.Equal(left, right)` for slices of comparable elements and `maps.Equal(left, right)` for maps with comparable values. Use the `EqualFunc` forms when elements need a custom rule. These helpers treat nil and empty collections with the same contents as equal, so check nil separately if that distinction matters.",
        support: {
          type: "comparison",
          title: "Pick the operation from the required meaning",
          items: [
            {
              label: "Exact comparable value",
              value: "==",
              detail: "All compared representation is part of equality.",
              tone: "blue",
            },
            {
              label: "Numeric or lexical order",
              value: "< <= > >=",
              detail: "The underlying type already defines the required order.",
              tone: "neutral",
            },
            {
              label: "Slice or map contents",
              value: "slices/maps Equal",
              detail: "The collection elements or entries define equality.",
              tone: "green",
            },
            {
              label: "Business meaning",
              value: "named helper",
              detail: "Normalization, tolerance, or selected fields change the rule.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Show why legal equality can still express the wrong rule",
        stage: "Business equality needs a rule",
        spokenText: "Choose a helper even for a comparable type when exact representation is not the intended meaning. Pointer `==` means the same address, not equal pointed-to data. Calculated floats may need a tolerance, and a struct may contain cache or timestamp fields that should not define identity. A small domain method such as `sameCustomer(a, b)` makes that rule visible and testable.",
        recallRule: "Use a built-in operator only when both the type rule and the domain meaning match; otherwise name the intended equality explicitly.",
      },
    ],
  },

  "go-syntax-basics-comparisons-common-mistake": {
    quick: [
      "Do not compare two slices, maps, or functions with `==`; only a comparison with `nil` is allowed.",
      "Do not assume `any` makes every value comparable; equal dynamic slice or map types can cause a runtime panic.",
      "Pointer equality checks identity, and raw struct equality may include fields outside the business definition of equality.",
      "Calculated floating-point values may need a tolerance; NaN is not equal to itself.",
      "String ordering is case-sensitive lexicographic byte order, not natural-language or locale-aware order.",
    ],
    deep: {
      title: "Comparison mistakes come from three different boundaries",
      content: [
        "The first boundary is type legality. A slice, map, or function can be compared with `nil`, but two values of that type cannot be compared with each other. Direct code such as `leftSlice == rightSlice` is rejected at compile time. Use `slices.Equal`, `maps.Equal`, an `EqualFunc` variant, or a domain helper instead; functions do not have general content equality.",
        "The second boundary appears when values are hidden inside interfaces. The expression `a == b` is legal when both variables have interface type, but it can panic when both dynamic values share an uncomparable type such as `[]int`. Logging `%T` or using a type switch reveals the concrete types before comparison.",
        "The third boundary is meaning. Pointer equality checks whether addresses are the same, not whether pointed-to values look alike. Struct equality includes all comparable fields, which may be too strict for an entity whose ID alone defines identity. Floating-point calculations can have rounding differences, and NaN is unequal to every value including itself.",
        "Ordering has its own semantic trap. Go orders strings lexicographically by bytes and distinguishes case, so built-in order is not a locale-aware people-name sort. Before writing a comparison, state whether the requirement is identity, exact value, collection contents, approximate number, or human text order, then test the boundary that changes the result.",
      ].join("\n\n"),
    },
    beats: [
      {
        cue: "Separate compile-time rejection from a wrong result",
        stage: "Some pairs cannot use ==",
        spokenText: "The first mistake is applying `==` to two slices, maps, or functions. Go permits those values to be compared with `nil`, but it does not define content equality between two of them. `leftSlice == rightSlice` is therefore a compile-time error. Use `slices.Equal`, `maps.Equal`, or a purpose-built rule; functions have no general content comparison.",
      },
      {
        cue: "Show how an interface postpones the same type problem",
        stage: "Interfaces may panic",
        spokenText: "An interface can move the failure from compile time to runtime. If `a` and `b` have type `any`, `a == b` compiles. It panics when both hold the same uncomparable dynamic type, such as `[]int`. The static interface type does not make the contained slice comparable, so inspect `%T` or use a type switch before choosing the operation.",
        support: {
          type: "trace",
          title: "Three very different comparison failures",
          items: [
            {
              label: "Compiler error",
              value: "type rule",
              detail: "A direct slice, map, or function pair cannot use `==`.",
              tone: "blue",
            },
            {
              label: "Runtime panic",
              value: "interface boundary",
              detail: "The interfaces hold identical uncomparable dynamic types.",
              tone: "orange",
            },
            {
              label: "Wrong Boolean",
              value: "meaning mismatch",
              detail: "The operation is legal but tests identity or representation instead of the required meaning.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Distinguish legal equality from semantic equality",
        stage: "Valid syntax can be wrong",
        spokenText: "A legal `==` can still answer the wrong question. Two pointers can reach equal data but compare false because their addresses differ. Two structs can compare false because a timestamp changed even when their business ID is the same. After floating-point calculations, exact equality can also miss values that differ only by rounding; NaN is not even equal to itself.",
      },
      {
        cue: "Name the ordering rule before applying it to text",
        stage: "Text order is lexical",
        spokenText: "String ordering is case-sensitive lexicographic byte order, not dictionary order for a person's language. If the requirement is case-insensitive equality, use a rule such as `strings.EqualFold`. If it is locale-aware sorting, built-in `<` is not enough. The safe pattern is to define the intended equality or order first, then choose the operator or helper that implements it.",
        recallRule: "Check three things in order: is the operation legal for the type, is the dynamic value safe, and does the result mean what the application calls equal or ordered?",
      },
    ],
  },

  "go-syntax-basics-comparisons-compare": {
    quick: [
      "Keep `==` for comparable types when exact representation equality is the intended rule.",
      "Use `slices.Equal` and `maps.Equal` for collection contents with comparable elements or values.",
      "Use `slices.EqualFunc` or `maps.EqualFunc` when element or value equality needs a custom function.",
      "Use a domain helper for selected fields, normalized text, time instants, or floating-point tolerance.",
      "Use `reflect.DeepEqual` only when its exact recursive semantics—including nil versus empty—match the requirement.",
    ],
    deep: {
      title: "An equality helper defines the missing meaning",
      content: [
        "Built-in `==` is the simplest tool when the type is comparable and exact representation equality is correct. It is checked by the compiler and works naturally for scalar values, arrays of comparable elements, and structs whose comparable fields all belong to value identity. It should remain the default in that precise case.",
        "Slices and maps need helpers because Go does not define `==` between two values of those types. `slices.Equal` compares lengths and elements; `maps.Equal` compares key-value pairs. Their `EqualFunc` variants accept a custom comparison when elements or map values are not comparable or when exact equality is not the intended rule. These helpers treat nil and empty collections with equal contents as equal.",
        "A helper is also useful for comparable data when business meaning differs from representation. It can compare entity IDs while ignoring audit fields, compare calculated floats within an accepted tolerance, compare text after the chosen normalization, or call `time.Time.Equal` when the same instant matters more than the complete `time.Time` representation.",
        "`reflect.DeepEqual` supplies a general recursive rule, not the application's rule. Among its documented semantics, nil and non-nil empty slices are different, unexported struct fields participate, and NaN remains unequal to itself. Use it only when those details are wanted; otherwise a named, typed helper makes equality easier to understand and protect with focused tests.",
      ].join("\n\n"),
    },
    codeExample: "```go\nscoresMatch := slices.Equal([]int{4, 7}, []int{4, 7})\nparts := []float64{0.1, 0.2}\nactual := parts[0] + parts[1]\nwithinTolerance := math.Abs(actual-0.3) < 1e-9\nfmt.Println(scoresMatch, actual == 0.3, withinTolerance)\n```",
    beats: [
      {
        cue: "Keep built-in equality where it states the full rule",
        stage: "== fits exact comparable data",
        spokenText: "Use `==` when the type is comparable and exact representation equality is the required meaning. That covers scalar values, arrays of comparable elements, and structs whose comparable fields all belong to value identity. The operator is short, compiler-checked, and clear; a helper adds no value when it would simply repeat the same rule.",
      },
      {
        cue: "Map each collection shape to its standard helper",
        stage: "Helpers compare contents",
        spokenText: "A helper is required when contents define equality for slices or maps. `slices.Equal(a, b)` checks equal lengths and corresponding comparable elements. `maps.Equal(a, b)` checks the same keys and equal comparable values. Use `slices.EqualFunc` or `maps.EqualFunc` when an element or value needs a custom rule. The standard helpers consider nil and empty collections with equal contents to be equal.",
        support: {
          type: "comparison",
          title: "Match the equality tool to the rule",
          items: [
            {
              label: "==",
              value: "exact representation",
              detail: "Comparable type, with every compared part included in equality.",
              tone: "blue",
            },
            {
              label: "slices/maps Equal",
              value: "collection contents",
              detail: "Same elements or key-value pairs using built-in element equality.",
              tone: "green",
            },
            {
              label: "EqualFunc",
              value: "custom elements",
              detail: "The collection shape is the same, but each value needs a supplied rule.",
              tone: "neutral",
            },
            {
              label: "Domain Equal method",
              value: "business meaning",
              detail: "Selected fields, normalization, time semantics, or tolerance define equality.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Show why comparable data may still deserve a named rule",
        stage: "Custom rules express meaning",
        spokenText: "A comparable type may still need a helper. Calculated floats often use `math.Abs(actual-expected) < tolerance`; text may need `strings.EqualFold`; an entity may be equal by ID while audit fields differ. A named function such as `sameCustomer(a, b)` makes the selected fields and boundary visible instead of hiding a business decision behind raw struct equality.",
      },
      {
        cue: "Set the boundary around general recursive equality",
        stage: "Reflection is not the default",
        spokenText: "`reflect.DeepEqual` is useful only when its documented recursive semantics are exactly wanted. It treats a nil slice and a non-nil empty slice as different, includes unexported struct fields, and inherits special cases such as NaN not equalling itself. For production domain rules, a typed helper is usually clearer, safer during refactoring, and easier to test.",
        recallRule: "Use `==` for exact comparable values, collection helpers for contents, and a named typed helper whenever equality has domain-specific meaning.",
      },
    ],
  },

  "go-syntax-basics-comparisons-scenario": {
    quick: [
      "Classify the symptom first: compiler error, runtime panic, or a legal comparison returning the wrong result.",
      "For interface panics, print both concrete types with `%T`; `any` does not make slices or maps comparable.",
      "Reduce the problem to two values and write what equality should mean before changing code.",
      "Check pointer identity, nil versus empty collections, floating-point tolerance, and ignored struct fields.",
      "Replace the failing boundary with the right helper and keep the smallest failing case as a regression test.",
    ],
    beats: [
      {
        cue: "Let the visible failure choose the first investigation",
        stage: "Classify the failure",
        spokenText: "Start by separating three cases. A compiler error usually means the source types cannot use that operator, such as two slices. A runtime comparison panic usually means interfaces hold an uncomparable dynamic type. A surprising true or false result means the operation was legal but may have tested identity, exact representation, or an equality rule different from the one intended.",
        support: {
          type: "trace",
          title: "Follow the symptom to the right check",
          items: [
            {
              label: "Does not compile",
              value: "inspect source types",
              detail: "Confirm that the operator is allowed before considering data values.",
              tone: "blue",
            },
            {
              label: "Panics",
              value: "inspect dynamic types",
              detail: "An interface may be carrying a slice, map, or function.",
              tone: "orange",
            },
            {
              label: "Wrong result",
              value: "inspect the meaning",
              detail: "Decide whether the code tested identity, representation, contents, or tolerance.",
              tone: "green",
            },
            {
              label: "Fixed",
              value: "keep the boundary test",
              detail: "Protect the exact case that separated the expected and actual result.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Expose the runtime types and the smallest pair of values",
        stage: "Expose the concrete types",
        spokenText: "Reduce the failure to the two operands and print both with `%T` and, when useful, `%#v`. For `any` values, this reveals the type that the interface hid. If both values contain `[]int`, do not retry `left == right`; assert the expected slice type and compare the contents with `slices.Equal`.",
        support: {
          type: "code",
          title: "Reveal the dynamic type, then compare safely",
          language: "go",
          code: "package main\n\nimport (\n    \"fmt\"\n    \"slices\"\n)\n\nfunc main() {\n    var left any = []int{1, 2}\n    var right any = []int{1, 2}\n\n    fmt.Printf(\"types: %T and %T\\n\", left, right)\n    a, okA := left.([]int)\n    b, okB := right.([]int)\n    fmt.Println(\"same contents:\", okA && okB && slices.Equal(a, b))\n}",
          caption: "The output identifies the hidden slice types and then applies slice-content equality instead of interface equality.",
        },
      },
      {
        cue: "Write the intended equality before choosing the replacement",
        stage: "Write the intended equality",
        spokenText: "For an unexpected Boolean, state the rule in plain language: same address, same fields, same collection contents, same business ID, or numbers within a tolerance. Then inspect the first place the current operation differs. Common boundaries are pointer identity, nil versus empty collections, exact float comparison, and a comparable struct containing fields that should not define equality.",
      },
      {
        cue: "Repair only the operation whose semantics are wrong",
        stage: "Repair the exact boundary",
        spokenText: "Replace the operation with the narrowest correct tool: `slices.Equal`, `maps.Equal`, an `EqualFunc` form, or a typed domain helper. Do not recover from an interface-comparison panic and continue, because that leaves the equality rule undefined. Instead, validate or constrain the concrete type before the comparison so unsupported data has an explicit outcome.",
      },
      {
        cue: "Turn the original failure into a boundary-focused test",
        stage: "Keep the failing case",
        spokenText: "Keep a test for the smallest failing pair, then add one equal pair and one nearby unequal pair. Include the boundary that caused the bug: nil and empty collections, different pointer addresses with equal data, one ignored struct field, or values just inside and outside a float tolerance. The test should name the equality rule, not only the previous symptom.",
        recallRule: "Classify the symptom, reveal both concrete types, define the intended equality, replace the exact boundary, and preserve the failing pair as a test.",
      },
    ],
  },
};

if (requestedSlug && !Object.hasOwn(lessons, requestedSlug)) {
  throw new Error(`Unknown comparison question slug: ${requestedSlug}`);
}

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
const targets = requestedSlug ? [requestedSlug] : Object.keys(lessons);
let curated = 0;

for (const targetSlug of targets) {
  const matches = document.questions.filter((question) => question.slug === targetSlug);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one ${targetSlug} question, found ${matches.length}`);
  }

  const question = matches[0];
  const lesson = lessons[targetSlug];
  const quick = question.answer?.sections?.find((section) => section.type === "key_points");
  const speakable = question.answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );
  const deep = question.answer?.sections?.find((section) => section.type === "deep_explanation");

  if (!quick || !speakable || !deep) {
    throw new Error(`${targetSlug}: missing Quick Revision, Interview Answer, or Deep Dive section`);
  }

  quick.title = "Quick revision";
  quick.items = lesson.quick;
  delete quick.content;

  speakable.title = "Interview answer";
  speakable.answerSize = "standard";
  speakable.beats = lesson.beats;
  speakable.content = lesson.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");

  if (lesson.deep) {
    deep.title = lesson.deep.title;
    deep.content = lesson.deep.content;
  }

  if (lesson.codeExample) {
    const code = question.answer.sections.find((section) => section.type === "code_example");
    if (!code) throw new Error(`${targetSlug}: missing code example`);
    code.content = lesson.codeExample;
  }

  question.last_updated = "2026-09-08";
  curated += 1;
}

if (!requestedSlug && curated !== document.questions.length) {
  throw new Error(`Curated ${curated} of ${document.questions.length} comparison questions`);
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${curated} Go comparison Interview Answer presentation${curated === 1 ? "" : "s"}.`);
