#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/go-fresher/go-syntax-basics/variables-and-short-declaration/complete-qa.json",
);

const presentations = {
  "go-var-vs-short-declaration": {
    answerSize: "compact",
    beats: [
      {
        cue: "Distinguish declaration from assignment",
        stage: "Two ways to declare a name",
        spokenText: "`var` and `:=` both declare statically typed variables, but they are not interchangeable. `var` is the general declaration form and works at package scope or inside a function. `:=` is a short declaration that works only inside a function. Ordinary `=` declares nothing; it updates a variable that already exists.",
        support: {
          type: "comparison",
          title: "Declaration and assignment at a glance",
          items: [
            {
              label: "var",
              value: "declare anywhere",
              detail: "Works at package or function scope and may name the type explicitly.",
              tone: "blue",
            },
            {
              label: ":=",
              value: "declare locally",
              detail: "Works inside functions and infers types from the values on the right.",
              tone: "green",
            },
            {
              label: "=",
              value: "update",
              detail: "Assigns new values to names that have already been declared.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain initialization and type inference",
        stage: "Zero value or ready value",
        spokenText: "`var retries int` creates an `int` with its zero value, which is `0`. This is useful when a value will be filled later or when writing the type makes the contract clearer. `name := \"Ada\"` needs an initializer, and Go infers `string` from that value. The variable is still statically typed after inference.",
      },
      {
        cue: "Show the mixed declaration rule",
        stage: "One new name makes := valid",
        spokenText: "A short declaration may reuse an existing name when at least one non-blank name on the left is new in the same block. If `err` already exists, `user, err := loadUser()` declares `user` and assigns a new value to `err`. If every name already exists in that block, the statement must use `=` instead.",
        support: {
          type: "code",
          title: "A new user and an existing err",
          language: "go",
          code: "func example() error {\n    var err error\n    user, err := loadUser()\n    if err != nil {\n        return err\n    }\n    user = \"Grace\"\n    _ = user\n    return nil\n}",
          caption: "The short declaration is valid because `user` is new; the later `=` only updates it.",
        },
      },
      {
        cue: "Close with the nested-scope boundary",
        stage: "A nested block may shadow",
        spokenText: "The new-name check uses the current lexical block. A `:=` inside an `if` or `for` block can therefore create an inner variable with the same spelling as an outer one. Use `var` for package scope, zero-value setup, or an explicit type; use `:=` for clear new locals; and use `=` when the intended variable already exists.",
        recallRule: "`var` is the general declaration, `:=` is a local short declaration, and `=` updates existing variables.",
      },
    ],
  },
  "go-syntax-basics-variables-and-short-declaration-when-to-use": {
    answerSize: "compact",
    beats: [
      {
        cue: "State where the general declaration works",
        stage: "var works in both places",
        spokenText: "A `var` declaration is valid at package scope and inside a function. It may include an explicit type, an initializer, or both. When it has a type but no initializer, the variable starts with that type's zero value, as in `var attempts int`, where `attempts` begins as `0`.",
      },
      {
        cue: "State the boundary for short declarations",
        stage: ":= stays inside functions",
        spokenText: "The short declaration `:=` is a statement, so it is allowed only inside a function body. It always has values on the right, and Go infers the new variables' types from those values. `port := 8080` creates a local `int`; it does not make the variable dynamically typed.",
        support: {
          type: "comparison",
          title: "Where each form is available",
          items: [
            {
              label: "Package scope",
              value: "var only",
              detail: "Use `var service = \"catalog\"`; a short declaration is not valid here.",
              tone: "blue",
            },
            {
              label: "Inside a function",
              value: "var or :=",
              detail: "Choose `var` for a zero value or explicit type and `:=` for a clear initialized local.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Explain when a short redeclaration is legal",
        stage: "The current block sets newness",
        spokenText: "A short declaration must introduce at least one non-blank name in the current block. After `count := 1`, `count, ok := load()` is valid there because `ok` is new, while `count := 2` is not. When every name already exists in that block, use ordinary `=`.",
        support: {
          type: "code",
          title: "Scope decides which operator is valid",
          language: "go",
          code: "var service = \"catalog\"\n\nfunc run() {\n    var attempts int\n    count := 1\n    count, ok := load()\n    count = count + attempts\n    _, _ = count, ok\n}",
          caption: "`service` needs `var`; `count, ok :=` is valid because `ok` is new in `run`.",
        },
      },
      {
        cue: "Explain the nested-block boundary",
        stage: "Nested blocks start new scopes",
        spokenText: "An outer name does not count as already declared in a nested block for the short-declaration rule. A `:=` inside an `if` can create a different inner variable and hide the outer one. When a result must remain available after the block, declare it in the owning scope and update it with `=`.",
        recallRule: "Package scope requires `var`; inside functions use `var` or `:=`, and use `=` when all names already exist in the current block.",
      },
    ],
  },
  "go-syntax-basics-variables-and-short-declaration-common-mistake": {
    answerSize: "compact",
    beats: [
      {
        cue: "Define shadowing and its effect",
        stage: "Shadowing creates a new name",
        spokenText: "Variable shadowing happens when an inner block declares a new variable with the same spelling as an outer variable. Code inside the block sees the inner variable. When the block ends, that variable disappears and later code sees the original outer value, which may never have changed.",
      },
      {
        cue: "Connect the rule to short declarations",
        stage: ":= can hide the outer value",
        spokenText: "This is easy to do with `:=` because its new-name rule is checked in the current block. If `result` exists outside an `if`, the line `result, err := strconv.Atoi(text)` inside it can declare both an inner `result` and an inner `err`. The parsed value is real, but it belongs to the inner variable.",
        support: {
          type: "code",
          title: "The value changes only inside the block",
          language: "go",
          code: "func parse(text string) (int, error) {\n    result := 0\n    if text != \"\" {\n        result, err := strconv.Atoi(text)\n        if err != nil {\n            return 0, err\n        }\n        fmt.Println(result) // 42\n    }\n    return result, nil     // still 0\n}",
          caption: "The inner `result` ends at the closing brace; the return reads the untouched outer variable.",
        },
      },
      {
        cue: "Separate deliberate narrow scope from a bug",
        stage: "Narrow scope can be useful",
        spokenText: "Shadowing is not automatically wrong. `if file, err := os.Open(name); err != nil` deliberately keeps both names inside the `if` statement and its branches. It becomes a bug when later code expects an outer value to contain the result produced inside that block.",
      },
      {
        cue: "Show how the owning scope is repaired",
        stage: "Give the result one owner",
        spokenText: "When the result is needed after the block, declare every required name in that outer scope and use `result, err = strconv.Atoi(text)`. Another clean option is to return the value directly from the branch. Both fixes make it clear which variable owns the result and prevent a successful operation from appearing to lose its value.",
        recallRule: "If a value must survive a block, declare it in that owning scope and update it with `=` rather than creating an inner copy with `:=`.",
      },
    ],
  },
  "go-syntax-basics-variables-and-short-declaration-compare": {
    answerSize: "compact",
    beats: [
      {
        cue: "Separate the three declaration forms",
        stage: "Three forms, three jobs",
        spokenText: "`var`, `:=`, and `=` do related but different jobs. `var` declares a variable and works at package scope or inside a function. `:=` declares local variables inside a function and infers their types from the values on the right. `=` declares nothing; it changes variables that already exist.",
        support: {
          type: "comparison",
          title: "What each form means",
          items: [
            {
              label: "var",
              value: "declare",
              detail: "Package or function scope; can show a type or begin with a zero value.",
              tone: "blue",
            },
            {
              label: ":=",
              value: "local declare",
              detail: "Function scope only; infers types and must introduce at least one new name.",
              tone: "green",
            },
            {
              label: "=",
              value: "update",
              detail: "Changes names that have already been declared in the current scope.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Show where var adds useful meaning",
        stage: "When var is clearer",
        spokenText: "`var` is the right choice at package scope because `:=` is not legal there. It is also useful when the zero value is the intended starting state, as in `var retries int`, or when an explicit type communicates the contract, as in `var reader io.Reader = file`.",
      },
      {
        cue: "Connect the rules to a runnable example",
        stage: "See the forms together",
        spokenText: "Inside a function, `:=` keeps a clear local declaration short. Later changes use `=`. A short declaration can also reuse one existing name when another name on the left is new, which is why `count, city := 2, \"Pune\"` is valid after `count` already exists.",
        support: {
          type: "code",
          title: "var, := and = in one small program",
          language: "go",
          code: "package main\n\nimport \"fmt\"\n\nvar version = \"1.0\"\n\nfunc main() {\n    var retries int\n    name := \"Ada\"\n    name = \"Grace\"\n    count := 1\n    count, city := 2, \"Pune\"\n    fmt.Println(version, retries, name, count, city)\n}",
          caption: "The second `:=` is valid because `city` is new; `count` is updated in the same statement.",
        },
      },
      {
        cue: "State the scope boundary and final choice",
        stage: "Scope decides := or =",
        spokenText: "A short declaration must introduce at least one non-blank name in the current block. If every name already exists there, use `=`. A nested block is a different scope, so `:=` can create an inner variable that hides the outer one. Choose among the forms by scope, zero-value intent, and readability—not runtime speed.",
        recallRule: "Use `var` for package scope, zero values, or an explicit type; use `:=` for new locals; use `=` for updates.",
      },
    ],
  },
  "go-syntax-basics-variables-and-short-declaration-scenario": {
    answerSize: "standard",
    beats: [
      {
        cue: "Recognize the scope-shaped symptom",
        stage: "The symptom points to scope",
        spokenText: "When a Go value looks correct inside a branch but returns to an older value afterward, the assignment may have reached a different variable. The useful starting evidence is the first place where the value is correct and the first later place where it is wrong. A closing brace between them makes shadowing a strong possibility.",
      },
      {
        cue: "Trace declarations before ordinary assignments",
        stage: "Follow declaration ownership",
        spokenText: "Search between those two observations for every `:=` involving the name, then identify the lexical block that owns each declaration. Go resolves the nearest declaration, so two variables can have the same spelling. A new companion name such as `err` or `ok` often makes the inner short declaration legal.",
        support: {
          type: "trace",
          title: "Trace the value across the block boundary",
          items: [
            {
              label: "Observe",
              value: "12 inside, 0 after",
              detail: "The operation worked, but the final consumer reads a different value.",
              tone: "blue",
            },
            {
              label: "Search",
              value: "find every :=",
              detail: "Keep only declarations between the last correct and first wrong observation.",
              tone: "neutral",
            },
            {
              label: "Resolve",
              value: "check each block",
              detail: "Definition lookup can confirm whether the uses point to two declarations.",
              tone: "orange",
            },
            {
              label: "Explain",
              value: "inner name ended",
              detail: "The closing brace removed the inner variable and exposed the unchanged outer one.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Keep the shadowing mechanism in a minimal case",
        stage: "Preserve the block in the test",
        spokenText: "A useful minimal example must keep the nested block and the multiple-result declaration. Removing `err` while simplifying can make the suspicious `:=` stop compiling and accidentally remove the bug. The small case should observe the value both inside and after the block.",
      },
      {
        cue: "Repair the declaration that owns the result",
        stage: "Repair ownership, not output",
        spokenText: "Move every value needed later into the scope that owns the final result, then use ordinary assignment inside the branch. Returning the loaded value directly is often even clearer because no mutable value crosses the block boundary. Temporary logging can reveal the symptom, but changing the output alone does not repair ownership.",
        support: {
          type: "code",
          title: "Update the variable that survives the branch",
          language: "go",
          code: "func choose(ready bool) (int, error) {\n    count := 0\n    var err error\n\n    if ready {\n        count, err = loadCount()\n    }\n\n    return count, err\n}",
          caption: "Both names are declared in the function block, so `=` updates the values returned after the branch.",
        },
      },
      {
        cue: "Verify behavior beyond the block",
        stage: "Test the final consumer",
        spokenText: "The regression test must read the value after the block, where the original failure appeared. Cover the path that enters the branch, the path that skips it, and the error path from the called function. That proves the returned or stored value—not only a nearby debug print—uses the intended declaration.",
        recallRule: "For a value that reverts after a block: locate every `:=`, match each use to its declaration, repair the owning scope, and test the value after the block.",
      },
    ],
  },
};

function fallbackContent(beats) {
  return beats.map((beat) => beat.spokenText.trim()).join("\n\n");
}

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
const questions = Array.isArray(document) ? document : document.questions;
let changed = 0;

for (const [slug, presentation] of Object.entries(presentations)) {
  const question = questions.find((entry) => entry.slug === slug);
  if (!question) throw new Error(`Question not found: ${slug}`);

  const speaking = question.answer?.sections?.find((section) => section.type === "speakable_answer");
  if (!speaking) throw new Error(`Interview answer not found: ${slug}`);

  speaking.answerSize = presentation.answerSize;
  speaking.beats = presentation.beats;
  speaking.content = fallbackContent(presentation.beats);
  changed += 1;
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${changed} variable-declaration Interview Answer presentation(s).`);
