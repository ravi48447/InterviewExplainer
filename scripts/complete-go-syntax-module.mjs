#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const topics = {
  "arrays-basics": [
    "An array's length is part of its type: `[3]int` and `[4]int` are different types.",
    "A newly declared array contains the element type's zero values.",
    "Assigning or passing an array copies all of its elements.",
    "Use a slice for a collection whose length must grow or vary.",
    "Indexes run from zero through `len(array)-1`.",
  ],
  "pointers-basics": [
    "`&value` obtains an address and `*pointer` reads or changes the pointed-to value.",
    "Passing a pointer allows the callee to mutate the caller's value.",
    "A pointer's zero value is `nil`; dereferencing it panics.",
    "Go does not allow pointer arithmetic.",
    "Prefer values unless sharing identity, mutation, or copy cost has a clear benefit.",
  ],
  "blank-identifier": [
    "The blank identifier `_` discards a value without creating a usable binding.",
    "Use it when a multi-value result is intentionally irrelevant.",
    "A blank import runs a package's initialization only for its side effects.",
    "Compile-time interface assertions often use `var _ Interface = (*Type)(nil)`.",
    "Do not discard an error unless ignoring it is an explicit, safe decision.",
  ],
  "comparisons": [
    "Boolean, numeric, string, pointer, channel, interface, array, and comparable struct values can use `==`.",
    "Slices, maps, and functions cannot be compared with `==` except against `nil`.",
    "Arrays and structs compare element by element or field by field.",
    "Interface comparison can panic when both dynamic values have an uncomparable type.",
    "Use domain-specific equality when representation and business equality differ.",
  ],
};

const distinctDeepOpeners = {
  "go-syntax-basics-arrays-basics-interview-basics":
    "Read `[3]int` as one complete type: three slots whose elements are integers. The compiler uses the length when checking assignment and function arguments, which is why a `[4]int` cannot be passed where `[3]int` is required. This makes arrays useful when the count is part of the data model rather than a runtime detail.\n\nAn array owns all of its elements as one value. Assigning it to another variable produces an independent copy, and passing it to a function by value does the same. A pointer can avoid that copy and allow mutation, but most variable-size application collections should use slices instead.\n\nUse an array when the size is genuinely fixed and meaningful, such as an RGB triple, a 16-byte identifier, or a small lookup table with a compile-time size. The most common mistake is treating it like a dynamically sized list: `append` works with slices, and indexes outside `0` through `len(array)-1` panic.",
  "go-syntax-basics-comparisons-interview-basics":
    "Comparability is a property of a Go type. A value is comparable when the language can determine equality directly from its representation. Scalar values, pointers, and channels are comparable; an array is comparable when its element type is comparable; and a struct is comparable when every field is comparable.\n\nSlices, maps, and functions contain runtime state that built-in equality does not compare element by element. They may be checked against `nil`, but two non-nil values of those types require a helper or domain-specific comparison. Ordered operators are narrower still: they apply to ordered basic values such as numbers and strings, not to arbitrary structs.\n\nInterface comparison inspects the dynamic values stored inside the interfaces. If those dynamic values have an uncomparable type such as a slice, comparison panics at runtime. That is why code handling `any` must consider both the static interface type and the concrete value it carries.",
};

for (const [topic, points] of Object.entries(topics)) {
  const file = path.join(root, `content/go-fresher/go-syntax-basics/${topic}/complete-qa.json`);
  const document = JSON.parse(fs.readFileSync(file, "utf8"));

  for (const question of document.questions) {
    const sections = question.answer?.sections ?? [];
    const index = sections.findIndex((section) => ["key_points", "important_points"].includes(section.type));
    const quick = {type: "key_points", title: "Quick revision", items: points};
    if (index >= 0) sections[index] = quick;
    else sections.unshift(quick);

    const direct = String(question.direct_answer ?? "").trim();
    if (direct.split(/\s+/).length >= 30) {
      for (const section of sections) {
        if (["key_points", "speakable_answer", "interviewer_expectation"].includes(section.type)) continue;
        if (typeof section.content === "string" && section.content.includes(direct)) {
          section.content = section.content
            .replace(direct, "")
            .replace(/^\s+/, "")
            .replace(/\n{3,}/g, "\n\n");
        }
      }
    }

    const speakable = sections.find((section) => section.type === "speakable_answer");
    if (speakable && !speakable.answerSize) {
      const count = String(speakable.content ?? "").split(/\s+/).filter(Boolean).length;
      speakable.answerSize = count < 220 ? "compact" : "standard";
    }

    const opener = distinctDeepOpeners[question.slug];
    if (opener) {
      const teaching = sections.find((section) => section.type === "deep_explanation");
      if (teaching) teaching.content = opener;
    }
  }

  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Completed ${document.questions.length} answers in ${topic}`);
}
