#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  formatInterviewArticle,
  interviewAnswerSize,
} from "./lib/interview-article.mjs";

const root = "content/go-fresher/go-syntax-basics";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const variableLessons = {
  "go-syntax-basics-variables-and-short-declaration-when-to-use": {
    question: "Where can `var` and `:=` be used in Go?",
    title: "Scope Rules for var and :=",
    direct: "`var` declarations are valid at package scope and inside functions. They may specify a type, an initializer, or both, and a declaration without an initializer receives the type's zero value. The short declaration `:=` is valid only inside functions and always needs an initializer so Go can infer each new variable's type. At least one non-blank name on the left must be new in the current block. Use ordinary `=` when every name in that block is already declared; an outer variable does not count as declared in a nested block.",
    quick: [
      "`var` works at package scope and function scope; `:=` works only inside functions.",
      "A `var` declaration may start from a zero value; `:=` always has an initializer.",
      "`:=` infers types from the values on its right-hand side.",
      "At least one non-blank name must be new in the current block.",
      "Use `=` when all names already exist in that same block.",
    ],
    interview: [
      "- Go has two declaration forms with different scope rules. `var` can declare package variables or local variables and can include an explicit type. The short form `:=` is a statement, so it is available only inside a function body and obtains types from its initializer.",
      "- `var count int` is useful when the zero value is the intended starting state or when the type matters before a value is available. `count := len(items)` is concise local code because the expression already makes the type clear. Neither form makes Go dynamically typed; the inferred variable still has one static type.",
      "- A short declaration must introduce at least one non-blank name in the current block. For example, after `value := 1`, `value, err := load()` is valid in the same block because `err` is new and `value` is reassigned. Writing `value := 2` alone there is invalid because nothing new is declared.",
      "- Lexical blocks matter. If an outer function block has `value`, then `value, err := load()` inside an `if` block can create a different inner `value`. The outer variable is not considered declared in that inner block for this rule, which is how accidental shadowing happens.",
      "- I use `var` for package state, deliberate zero-value setup, or an explicit interface type; `:=` for clear local initialization; and `=` for updates. The decision is about declaration, scope, and readability—not performance.",
    ],
    deepTitle: "The current lexical block decides whether a name is new",
    deep: [
      "A declaration introduces a name into a scope; an assignment changes the value attached to a name that already exists. `var` spells the declaration explicitly and is part of both package-level declarations and function bodies. The short form is defined as a local statement, which is why it cannot appear beside package declarations.",
      "Type inference does not weaken Go's type system. In `port := 8080`, the untyped integer constant is given an inferred concrete type and `port` keeps that type. `var reader io.Reader = file` can be clearer when the intended interface is more important than the concrete initializer. `var buffer bytes.Buffer` also exposes a useful zero-value lifecycle without a separate constructor call.",
      "Redeclaration with `:=` is a narrow convenience for multiple results. It is allowed only when the names were originally declared in the same block, at least one non-blank name is new, and the existing variables keep assignable values of their original types. This is common in `value, err := parse(input)` followed later by `next, err := read()`.",
      "A nested block has its own declarations. A short declaration there may create a same-spelled inner name instead of updating the outer one. The compiler accepts both because they are different variables. When a result must survive outside the block, declare every required name before it and use `=` inside, or return the value directly so its ownership is obvious.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Choose a declaration from scope and state",
    visual: fence("mermaid", [
      "flowchart TD",
      "  N[need a variable] --> P{package scope?}",
      "  P -->|yes| V[var declaration]",
      "  P -->|no| Z{zero value or explicit type useful?}",
      "  Z -->|yes| V",
      "  Z -->|no| C{at least one name new in this block?}",
      "  C -->|yes| S[short declaration :=]",
      "  C -->|no| A[assignment =]",
      "  S --> B[check for a nested-block shadow]",
    ]),
    codeTitle: "Use each form where its declaration contract is visible",
    code: [
      "package main",
      "",
      "import \"fmt\"",
      "",
      "var serviceName = \"catalog\" // package scope requires var",
      "",
      "func main() {",
      "\tvar attempts int       // explicit zero-value start",
      "\tport := 8080           // new local with inferred type",
      "\tattempts = attempts + 1 // update uses =",
      "",
      "\tlabel, ok := lookup(port) // both names are new here",
      "\tlabel, found := lookup(port + 1) // label updates; found is new",
      "\tfmt.Println(serviceName, attempts, label, ok, found)",
      "}",
      "",
      "func lookup(port int) (string, bool) {",
      "\treturn fmt.Sprintf(\"port-%d\", port), true",
      "}",
    ],
    followups: [
      "Why is `:=` not allowed at package scope?",
      "When may an existing variable appear on the left side of `:=`?",
      "Why can the same spelling name two variables in nested blocks?",
    ],
  },
  "go-syntax-basics-variables-and-short-declaration-common-mistake": {
    question: "How can `:=` accidentally shadow a variable in Go?",
    title: "Variable Shadowing with :=",
    direct: "Shadowing happens when `:=` declares a new variable in an inner block with the same name as an outer variable. The inner variable receives updates only until that block ends; the outer value remains unchanged. A common case is `result, err := parse(text)` inside an `if` block when `result` was declared outside but `err` is new inside. Because the current block has a new name, the statement is valid and can create an inner `result`. Declare the required variables before the block and use `=`, or return the result directly. The compiler and shadow-analysis tooling can help, but clear scope is the first defense.",
    quick: [
      "A declaration in an inner block may hide a same-named outer variable.",
      "`:=` checks whether names are new in the current block, not every enclosing scope.",
      "The shadowed outer value does not receive the inner assignment.",
      "Predeclare required results and use `=` when updates must escape the block.",
      "Narrow scopes and explicit returns make shadowing easier to notice.",
    ],
    interview: [
      "- Variable shadowing means a new declaration hides an outer variable with the same spelling for part of the program. In Go, `:=` can create this accidentally because its “at least one new name” rule applies to the current lexical block.",
      "- Suppose a function declares `result := 0`. Inside an `if`, `result, err := strconv.Atoi(text)` is valid: `err` is new in the `if` block, and the statement can declare an inner `result` as well. Printing inside the block shows the parsed number, but after the block the outer `result` can still be zero.",
      "- This often appears with `err`. A short `if value, err := call(); err != nil` intentionally keeps both variables local, which is useful when neither is needed later. It becomes a bug when the caller expects a value or error variable outside that block to have been updated.",
      "- The direct repair is to decide which scope owns the result. Declare `var err error` and use `result, err = strconv.Atoi(text)` if both must survive, or restructure the branch to return immediately. Renaming an intentionally separate inner value also removes ambiguity.",
      "- I verify the fix with inputs that enter and skip the branch and with a test of the value after the block. Static shadow checks can add a warning, but code review should still follow declaration boundaries because not every shadow is automatically wrong.",
    ],
    deepTitle: "A short declaration can look like an update while creating new storage",
    deep: [
      "Go determines scopes from blocks delimited by source structure: a function body, an `if` body, a loop body, and other nested blocks can each introduce names. Name lookup uses the nearest matching declaration. Once an inner `result` exists, references inside that block resolve to it; after the block, references resolve to the untouched outer declaration again.",
      "The multiple-assignment convenience makes the bug easy to miss. Developers often read `value, err := operation()` as “create err and update value.” That interpretation is correct only when `value` was declared earlier in the same block. If its declaration belongs to an enclosing block, the short statement can declare both names locally.",
      "Not every shadow is harmful. An initialization clause such as `if file, err := os.Open(name); err != nil` intentionally limits both names to the condition and branches. The pattern is safe when no caller expects either name afterward. The design becomes fragile when an outer variable is part of the function's later result or state.",
      "A reliable review traces the value beyond the closing brace. If the outer name is read later, use ordinary assignment after declaring all left-hand names in the owning scope. Guard clauses and early returns can often remove the cross-block mutation entirely. Tools that report shadowing are helpful signals, but the correct outcome still depends on whether two independent values were intended.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Two variables can share one spelling across a block boundary",
    visual: fence("mermaid", [
      "flowchart LR",
      "  O[outer result = 0] --> I{enter if block}",
      "  I --> D[result, err := parse]",
      "  D --> N[new inner result = 42]",
      "  N --> X[end of if block]",
      "  X --> R[outer result is still 0]",
      "  D -. use = after predeclaring err .-> U[update outer result = 42]",
    ]),
    codeTitle: "See the shadow, then update the intended owner",
    code: [
      "package main",
      "",
      "import (",
      "\t\"fmt\"",
      "\t\"strconv\"",
      ")",
      "",
      "func parse(text string) (int, error) {",
      "\tresult := 0",
      "\tvar err error",
      "",
      "\tif text != \"\" {",
      "\t\tresult, err = strconv.Atoi(text) // updates the outer names",
      "\t}",
      "",
      "\treturn result, err",
      "}",
      "",
      "func main() {",
      "\tvalue, err := parse(\"42\")",
      "\tfmt.Println(value, err) // 42 <nil>",
      "}",
    ],
    followups: [
      "Why does an outer declaration not satisfy the `:=` rule for an inner block?",
      "When is an `if value, err := call()` initialization intentionally scoped?",
      "How can an early return remove the need for a cross-block update?",
    ],
  },
  "go-syntax-basics-variables-and-short-declaration-scenario": {
    question: "How do you debug a Go value that did not update after `:=`?",
    title: "Debugging a Short-Declaration Scope Bug",
    direct: "When a value looks correct inside a branch but reverts afterward, inspect every `:=` between its declaration and final read. Record the file line and lexical block of each same-named variable, then check whether the short declaration introduced another name such as `err`; that can make a new inner copy. Print addresses only for addressable values if needed, or use editor references and a shadow analyzer to confirm the declarations. Fix the ownership rather than the symptom: move the declaration to the scope that needs the value and assign with `=`, or return from the branch. Add tests for both branch paths so the escaped value is verified.",
    quick: [
      "Find the first line where the value differs from the expected state.",
      "Search backward for `:=` and mark the block containing every declaration.",
      "Check whether a new companion name made the inner short declaration legal.",
      "Use `=` only after all required names exist in the owning scope.",
      "Test the value after the block on both the taken and untaken paths.",
    ],
    interview: [
      "- A value that changes inside a branch but not after it usually points to scope rather than failed assignment. I first create the smallest input that takes the branch and identify the first observation where expected and actual values diverge.",
      "- Next I search for every declaration of that name, especially `:=` inside `if`, `for`, or `switch` blocks. Go resolves the closest declaration. If the statement also introduces a new `err` or `ok`, an outer-looking name may actually be a new inner variable.",
      "- For example, `count := 0` followed by `if ready { count, err := loadCount() }` can print 12 inside the branch and zero afterward. The inner declaration ends at the closing brace. The load succeeded; the program wrote to a different `count`.",
      "- I fix it by declaring `var err error` in the scope that owns `count` and writing `count, err = loadCount()`, or by returning the loaded value from the branch. Then I rerun with success and failure inputs and verify the value at the final consumer, not only next to the call.",
      "- Editor “go to definition,” compiler diagnostics, and a configured shadow analysis can shorten the search. Logging addresses may prove two variables exist, but I remove temporary output and keep a regression test that captures the intended scope after the repair.",
    ],
    deepTitle: "Declaration ownership and short-assignment scope",
    deep: [
      "Ordinary value debugging often follows assignments, but a shadow bug requires following declarations first. Write down the owning scope for the value consumed at the end of the function. Then walk backward through nested blocks and distinguish `=` from `:=`. The spelling alone cannot tell whether two references name the same variable.",
      "A minimal reproduction should retain the block boundary and the multiple-return shape. Removing the companion `err` while simplifying can make `count := ...` fail to compile and accidentally erase the mechanism. Keep the smallest statement that still introduces one new name in the inner block, then observe the value on both sides of the closing brace.",
      "Tooling provides complementary evidence. Definition lookup connects each use to a declaration; a debugger shows frame-local values; optional shadow analyzers flag suspicious redeclarations. Pointer addresses can demonstrate separate storage for addressable locals, but they are a diagnostic aid rather than an application fix and may distract when escape behaviour is irrelevant.",
      "The durable repair makes one scope own the result. Predeclaration plus assignment is suitable when later statements need both value and error. A guard clause or direct return is often simpler because it avoids mutable state crossing a branch. Tests should assert the externally visible result for successful input, skipped input, and the error path.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Locate the first value change and the declaration that owns it",
    visual: fence("mermaid", [
      "flowchart TD",
      "  F[failing final value] --> B[first earlier point that is correct]",
      "  B --> S[search intervening := statements]",
      "  S --> D{same declaration scope?}",
      "  D -->|no| H[inner variable shadows owner]",
      "  D -->|yes| A[inspect ordinary assignment or callee]",
      "  H --> O[choose owning scope]",
      "  O --> E[predeclare plus =, or return directly]",
      "  E --> T[test after block on every path]",
    ]),
    codeTitle: "A table test proves the value survives the branch",
    code: [
      "package main",
      "",
      "import \"fmt\"",
      "",
      "func choose(enabled bool) (int, error) {",
      "\tcount := 0",
      "\tif !enabled {",
      "\t\treturn count, nil",
      "\t}",
      "",
      "\tloaded, err := loadCount()",
      "\tif err != nil {",
      "\t\treturn 0, err",
      "\t}",
      "\treturn loaded, nil // ownership is explicit; no shadowed update",
      "}",
      "",
      "func loadCount() (int, error) { return 12, nil }",
      "",
      "func main() {",
      "\tfor _, enabled := range []bool{false, true} {",
      "\t\tvalue, err := choose(enabled)",
      "\t\tfmt.Println(enabled, value, err)",
      "\t}",
      "}",
    ],
    followups: [
      "Why must a minimal reproduction keep the companion variable in a short declaration?",
      "Which tool can connect a use to the exact declaration it resolves to?",
      "When is returning a value clearer than assigning across a block boundary?",
    ],
  },
};

const questionRewrites = {
  "go-syntax-basics-arrays-basics-scenario": "What causes array index and copy bugs in Go, and how do you diagnose them?",
  "go-syntax-basics-basic-types-and-zero-values-scenario": "Where do unexpected zero values in Go usually come from?",
  "go-syntax-basics-blank-identifier-interview-basics": "What is the blank identifier (`_`) in Go, and what does it do?",
  "go-syntax-basics-blank-identifier-compare": "When should you discard a value with `_` instead of naming it?",
  "go-syntax-basics-blank-identifier-scenario": "How can discarding a Go return value with `_` hide a bug?",
  "go-syntax-basics-comparisons-interview-basics": "Which Go values can be compared with `==` and ordering operators?",
  "go-syntax-basics-comparisons-when-to-use": "When should you use Go's built-in comparison operators?",
  "go-syntax-basics-comparisons-compare": "When does Go need an equality helper instead of `==`?",
  "go-syntax-basics-comparisons-scenario": "How do you debug a Go comparison panic or unexpected equality result?",
  "go-syntax-basics-pointers-basics-scenario": "What causes nil-pointer panics in Go, and how do you trace them?",
};

const constantDeep = {
  "go-syntax-basics-constants-and-iota-when-to-use": [
    "Constants belong to compile-time expressions. They can remain untyped until a context needs a concrete type, which lets a numeric constant be used precisely when its value is representable. Runtime configuration, timestamps, environment variables, and function results are variables even when application code plans not to reassign them.",
    "`iota` is evaluated separately for each constant specification in one parenthesized declaration. It begins at zero, increases after each specification, and can participate in an expression such as `1 << iota`. Repeating an omitted expression applies the same formula at the new position, which is concise only when the sequence itself communicates meaning.",
    "Internal states and bit masks often fit this mechanism because source order and formula are controlled with the code. Database values, message fields, file formats, and public APIs need stable numbers across releases. Explicit assignments make that compatibility visible and prevent an inserted line from silently changing persisted meaning.",
    "The best declaration makes change safe. Use a named constant for a fixed concept, `iota` for a private positional pattern, and explicit values for an external contract. Tests should assert externally meaningful numbers rather than merely repeating the declaration formula.",
  ],
  "go-syntax-basics-constants-and-iota-common-mistake": [
    "Each non-empty constant specification advances the counter, including a line that assigns to `_`. An omitted type and expression repeat the previous non-empty expression with the current counter value. Reading only the visible names can therefore give the wrong position; expand every line while reviewing a surprising result.",
    "A new `const (...)` group starts its own sequence at zero. Splitting or joining groups changes values even if the names remain in the same visual order. Expressions can also multiply, shift, or offset the counter, so the final number is the evaluated formula rather than `iota` itself.",
    "Reordering becomes a compatibility defect when values have escaped the process. A row storing status 2 does not know that source code now calls 2 a different state. The repair is an explicit numbering contract and, when data already exists, a migration or versioned decoder—not another reorder that only fixes the newest binary.",
    "A small table-driven test should list the numeric values that carry business meaning. For bit flags, test both the individual masks and combinations. This catches insertion mistakes during review and explains which positions are intentionally unused.",
  ],
  "go-syntax-basics-constants-and-iota-compare": [
    "Generated and explicit declarations produce the same kind of Go constant. The choice changes maintainability, not runtime lookup speed. A formula removes repeated arithmetic; written numbers expose every wire or storage value directly.",
    "A private weekday-like ordering can use `iota` when only relative sequence matters and changes ship with all consumers. A protocol status shared with another service should spell out assigned numbers, because independent deployments and historical payloads cannot follow source-position changes automatically.",
    "Bit flags are a strong formula case: `1 << iota` shows that every entry owns a different bit. Even there, deleting a middle item may change later masks, so reserved positions or explicit shifts are safer after the values become public.",
    "Review the change boundary: if values are serialized, persisted, logged for later decoding, or documented outside the package, favour explicit stability. If they are private and derived from one obvious pattern, generation can make the relationship clearer.",
  ],
  "go-syntax-basics-constants-and-iota-scenario": [
    "Start from the numeric mismatch rather than the constant's label. Record the expected value, actual value, and the version that produced any stored or transmitted number. This distinguishes a declaration bug from old data decoded with a new mapping.",
    "Copy the relevant constant group into a short example and write the counter beside each specification. Expand omitted expressions, count blank-identifier entries, and note where a new group resets the sequence. Evaluate shifts and offsets after marking the positions.",
    "Next search for every boundary that treats the number as a contract: database columns, JSON, logs, metrics, feature flags, and other services. If a previous release emitted the value, changing the declaration alone cannot reinterpret that history safely.",
    "Fix private sequences by restoring the intended formula and add value assertions. Fix public sequences with explicit assignments plus a compatible migration or decoder. Run tests against both new values and representative historical payloads before deployment.",
  ],
};

const comparisonScenarioDeep = [
  "A comparison panic usually means that an interface value contains a dynamic type that Go cannot compare, such as a slice, map, or function. The static type `any` allows the comparison expression to compile, but the runtime still has to compare the concrete values. Inspecting `%T` for both operands reveals that hidden type boundary.",
  "An unexpected false result has a different path. Check whether the program is comparing pointer identity instead of pointed-to data, a nil collection instead of an initialized empty one, floating-point results that need a tolerance, or every field of a comparable struct when only some fields define domain equality.",
  "Reduce the failure to the smallest pair of values and write the intended equality rule in plain language. Use `slices.Equal`, `maps.Equal`, an element comparator, or a domain method when built-in `==` does not express that rule. Keep tests for equal values, one meaningful difference, nil and empty forms, and any numeric tolerance boundary.",
];

let curated = 0;
for (const topicDirectory of fs.readdirSync(root)) {
  const file = path.join(root, topicDirectory, "complete-qa.json");
  if (!fs.existsSync(file)) continue;
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const question of document.questions) {
    // The learner page has three phases; coaching metadata is not a fourth lesson.
    question.answer.sections = (question.answer?.sections ?? []).filter(
      (section) => section.type !== "interviewer_expectation",
    );
    for (const section of question.answer.sections) {
      if (["key_points", "important_points"].includes(section.type)) section.title = "Quick revision";
      if (section.type === "speakable_answer") section.title = "Interview answer";
    }

    if (questionRewrites[question.slug]) question.question = questionRewrites[question.slug];

    const lesson = variableLessons[question.slug];
    if (lesson) {
      question.question = lesson.question;
      question.title = lesson.title;
      question.direct_answer = lesson.direct;
      question.reading_time_minutes = 8;
      question.last_updated = "2026-09-07";
      const interview = formatInterviewArticle(lesson.interview.join("\n\n"));
      question.answer.sections = [
        { type: "key_points", title: "Quick revision", content: lesson.quick.map((point) => `- ${point}`).join("\n") },
        { type: "speakable_answer", title: "Interview answer", answerSize: interviewAnswerSize(interview, question), content: interview },
        { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep.join("\n\n") },
        { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
        { type: "code_example", title: lesson.codeTitle, content: fence("go", lesson.code) },
      ];
      question.followup_questions = lesson.followups;
      curated += 1;
    }

    const replacementDeep = constantDeep[question.slug];
    if (replacementDeep) {
      const deep = question.answer.sections.find((section) => section.type === "deep_explanation");
      if (!deep) throw new Error(`${question.slug}: missing deep explanation`);
      deep.content = replacementDeep.join("\n\n");
      question.last_updated = "2026-09-07";
    }

    if (question.slug === "go-syntax-basics-comparisons-scenario") {
      const deep = question.answer.sections.find((section) => section.type === "deep_explanation");
      if (!deep) throw new Error(`${question.slug}: missing deep explanation`);
      deep.title = "Diagnosing comparison panics and false equality";
      deep.content = comparisonScenarioDeep.join("\n\n");
      question.last_updated = "2026-09-08";
    }

    if (question.slug === "go-syntax-basics-basic-types-and-zero-values-compare") {
      const speaking = question.answer.sections.find((section) => section.type === "speakable_answer");
      if (!speaking) throw new Error(`${question.slug}: missing interview answer`);
      const concreteExample = "For example, `bytes.Buffer{}` is immediately useful without setup, while a client that requires a base URL and credentials should be created through a constructor that rejects missing configuration.";
      if (!speaking.content.includes(concreteExample)) speaking.content += `\n\n${concreteExample}`;
      question.last_updated = "2026-09-07";
    }
  }
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

if (curated !== Object.keys(variableLessons).length) {
  throw new Error(`curated ${curated}/${Object.keys(variableLessons).length} variable lessons`);
}

console.log(`Refined ${curated} variable lessons and normalized all Go syntax sections.`);
