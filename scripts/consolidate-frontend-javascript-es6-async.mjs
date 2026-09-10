#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const domainRoot = path.resolve("content/frontend-fresher");
const canonicalRoot = path.join(domainRoot, "javascript-async-basics");
const legacyRoot = path.join(domainRoot, "javascript-es6-async");
const legacyMirror = path.resolve(
  "content/interview/javascript/frontend/beginner/javascript-es6-async",
);
const canonicalV2Mirror = path.resolve(
  "content/interview/javascript/frontend/beginner/javascript-async-basics",
);
const archiveBase = path.resolve("content/.archive/source-of-truth-2026-09-05");
const archivedLegacy = path.join(
  archiveBase,
  "frontend-fresher/javascript-es6-async-unindexed",
);
const archivedMirror = path.join(
  archiveBase,
  "interview/javascript/frontend/beginner/javascript-es6-async",
);
const archivedCanonicalV2Mirror = path.join(
  archiveBase,
  "interview/javascript/frontend/beginner/javascript-async-basics-shadowed-by-locked-tree",
);
const tick = String.fromCharCode(96);
const render = (value) =>
  value.replaceAll("§", tick).replaceAll("¤", "$");
const paragraphs = (...values) => values.map(render).join("\n\n");
const fence = (language, ...lines) =>
  tick.repeat(3) +
  language +
  "\n" +
  lines.map(render).join("\n") +
  "\n" +
  tick.repeat(3);
const diagram = (...lines) => fence("mermaid", ...lines);

const topicOrder = [
  "arrow-functions-destructuring",
  "spread-and-rest",
  "template-literals",
  "promises-basics",
  "async-await-basics",
  "fetch-api-basics",
  "modules-import-export",
  "scenario-based",
];

const topicTitles = {
  "spread-and-rest": "Spread and Rest Syntax",
  "template-literals": "Template Literals",
};

const lessons = {
  "spread-and-rest": [
    {
      question:
        "What is the difference between spread syntax and rest syntax in JavaScript?",
      title: "Spread Syntax vs Rest Syntax",
      direct:
        "Spread and rest both use §...§, but they move values in opposite directions. Spread expands an iterable into function arguments or array elements, or copies an object's own enumerable properties into another object. Rest collects remaining function arguments into an array or remaining destructured values into a new array or object. Their position determines which operation JavaScript performs.",
      difficulty: "easy",
      quick: [
        "Spread expands one value into several positions; rest collects several values into one binding.",
        "Array and argument spread require an iterable, such as an array or string.",
        "Object spread copies own enumerable properties into a new object.",
        "A rest parameter is a real array containing arguments not matched by earlier parameters.",
        "A rest element or property must appear last in its pattern.",
      ],
      intent: {
        testing:
          "Whether the learner can read the same three-dot syntax from its grammatical position and explain its real data movement.",
        common_mistake:
          "Calling every use of three dots the spread operator, including positions where it collects values.",
        to_stand_out:
          "State the iterable boundary for array and argument spread and the own-enumerable-property boundary for object spread.",
      },
      speaking: paragraphs(
        "- Spread and rest use the same three dots, but their direction is different. Spread takes one source and expands its values into a place that expects several items. Rest appears in a binding position and collects values that have not already been matched.",
        "- In an array literal, §[...items]§ visits the source iterable and adds its values to a new array. In a function call, §fn(...items)§ supplies those values as separate arguments. In an object literal, §{ ...record }§ copies the source object's own enumerable properties, with later properties winning when names repeat.",
        "- Rest works in parameters and destructuring. §function total(label, ...numbers)§ binds the first argument to §label§ and collects every later argument in the §numbers§ array. Likewise, §const [first, ...remaining] = values§ collects unused array values, while §const { id, ...details } = user§ collects unused own enumerable properties.",
        "- For example, §const updated = { ...user, active: true }§ is a clear way to create a new top-level object with one changed field, and §Math.max(...scores)§ passes an array as individual arguments. The same syntax is doing expansion because both positions consume separate entries.",
        "- The boundary is that spread and rest are shallow. Nested objects remain shared, and array or call spread needs an iterable rather than any ordinary object. I choose the syntax after identifying the direction: expand a source at a value position, or collect leftovers at a binding position.",
      ),
      deep: paragraphs(
        "**Read the position, not just the symbol.** JavaScript's grammar decides the meaning of three dots. Inside an array, call, or object value, it is spread. Inside a parameter list or destructuring target, it is rest. This removes the need to memorise unrelated rules.",
        diagram(
          "flowchart LR",
          "  S[one source] -->|spread ...source| A[many array items, arguments, or properties]",
          "  M[many incoming values] -->|rest ...name| R[one array or object binding]",
        ),
        "**Runnable example.** Each assertion follows the direction shown above.",
        fence(
          "javascript",
          'import assert from "node:assert/strict";',
          "",
          "const scores = [7, 9, 8];",
          "assert.equal(Math.max(...scores), 9);",
          "",
          'const user = { id: 4, name: "Mina" };',
          "const activeUser = { ...user, active: true };",
          "assert.deepEqual(activeUser, { id: 4, name: \"Mina\", active: true });",
          "",
          "function sum(label, ...numbers) {",
          "  return label + \":\" + numbers.reduce((total, value) => total + value, 0);",
          "}",
          'assert.equal(sum("points", 2, 3, 4), "points:9");',
          "",
          "const { id, ...profile } = activeUser;",
          "assert.equal(id, 4);",
          'assert.deepEqual(profile, { name: "Mina", active: true });',
        ),
        "**Boundary.** Object spread is not the same operation as iterable spread. §[...plainObject]§ fails unless that object implements iteration, while §{ ...plainObject }§ reads its own enumerable properties. Neither form copies a prototype or recursively clones nested objects.",
      ),
      followups: [
        "Why can an array be spread into a call but a plain object normally cannot?",
        "Which value wins when two object spreads contain the same property?",
        "Where must a rest element appear in a destructuring pattern?",
      ],
    },
    {
      question:
        "Why do spread syntax and §Object.assign§ create only shallow copies?",
      title: "Shallow Copies with Object and Array Spread",
      direct:
        "A spread copy creates a new outer array or object, but it copies each member value as-is. Primitive values are copied directly, while a nested object, array, Map, or other reference still points to the same underlying value. §Object.assign({}, source)§ has the same shallow boundary for ordinary data, although assignment and spread differ in some property-setting details.",
      difficulty: "medium",
      quick: [
        "Spread creates a new outer array or object.",
        "Nested object and array references are reused, not recursively copied.",
        "Changing a copied top-level primitive does not change the source.",
        "Mutating a shared nested value is visible through both outer objects.",
        "Copy the known nested path or use a suitable cloning strategy when true independence is required.",
      ],
      intent: {
        testing:
          "Whether the learner understands reference sharing instead of treating spread as a general deep-clone feature.",
        common_mistake:
          "Assuming a new outer object means every nested level is also independent.",
        to_stand_out:
          "Explain copying as a new container whose slots receive the source's existing values.",
      },
      speaking: paragraphs(
        "- Object and array spread make a shallow copy. JavaScript creates a new outer container, then places each source value into that container. A number or string is a primitive value, but a nested array or object value is a reference, so the same nested value is placed in both containers.",
        "- For example, after §const copy = { ...original }§, §copy !== original§ is true. If both contain §address§, however, §copy.address === original.address§ is also true unless that nested object was copied separately. Updating §copy.name§ is isolated, while mutating §copy.address.city§ also changes what §original.address.city§ observes.",
        "- §Object.assign({}, original)§ has the same shallow-copy boundary for common objects: it copies enumerable own properties into a target. Object spread creates a new object literal directly. There are technical differences involving setters and how properties are defined, but neither operation recursively duplicates a normal object graph.",
        "- When I know which branch changes, I copy that path deliberately, such as §{ ...user, address: { ...user.address, city: \"Pune\" } }§. For data made only of supported structured-clone types, §structuredClone§ can make a deeper independent graph, but it is a separate algorithm with its own supported-value rules.",
        "- The practical rule is to match the copy depth to the update. Spread is excellent for a new top-level state value, but it is not evidence that nested state is independent. I verify the boundary with identity comparisons before choosing nested spread, a library, or §structuredClone§.",
      ),
      deep: paragraphs(
        "**A copy duplicates slots, not every referenced object.** Think of each property as holding a value. Copying the outer object's slots duplicates primitive values and duplicates references, not the objects those references point to.",
        diagram(
          "flowchart TD",
          "  O[original outer object] --> OP[name: Mina]",
          "  O --> N[shared nested preferences object]",
          "  C[spread copy outer object] --> CP[name: Mina]",
          "  C --> N",
          "  C -. different outer identity .-> O",
        ),
        "**Runnable identity check.** The top level is independent; the nested array is shared until that path is copied too.",
        fence(
          "javascript",
          'import assert from "node:assert/strict";',
          "",
          'const original = { name: "Mina", skills: ["JavaScript"] };',
          "const shallow = { ...original };",
          "",
          "assert.notEqual(shallow, original);",
          "assert.equal(shallow.skills, original.skills);",
          'shallow.skills.push("CSS");',
          'assert.deepEqual(original.skills, ["JavaScript", "CSS"]);',
          "",
          "const independent = { ...original, skills: [...original.skills] };",
          "independent.skills.push(\"HTML\");",
          'assert.deepEqual(original.skills, ["JavaScript", "CSS"]);',
        ),
        "**Boundary.** §structuredClone§ handles many built-in structured data types and cycles, but not every JavaScript value, such as functions. JSON serialisation is also not a general clone because it changes or rejects values outside JSON's data model.",
      ),
      followups: [
        "How can you prove that a nested value is still shared?",
        "When is copying one known nested path better than deep-cloning everything?",
        "How do object spread and §Object.assign§ differ when setters are involved?",
      ],
    },
    {
      question:
        "How do rest parameters differ from §arguments§ and from rest destructuring?",
      title: "Rest Parameters, Arguments, and Destructuring",
      direct:
        "A rest parameter such as §...values§ collects the unmatched arguments of one function call into a real array. §arguments§ is an older array-like object containing all supplied arguments and is unavailable in arrow functions as an own binding. Rest destructuring is not about a call: it collects the array elements or own enumerable object properties left after earlier parts of a pattern have matched.",
      difficulty: "medium",
      quick: [
        "A rest parameter is a real array of arguments left after named parameters.",
        "A function can have only one rest parameter, and it must be last.",
        "§arguments§ is array-like, includes all supplied arguments, and has no own arrow-function binding.",
        "Array rest collects remaining iterable values into a new array.",
        "Object rest collects remaining own enumerable properties into a new shallow object.",
      ],
      intent: {
        testing:
          "Whether three similar-looking collection mechanisms are separated by their scope, value shape, and modern use.",
        common_mistake:
          "Saying rest parameters and arguments contain the same slice of values or trying to use arguments inside an arrow function.",
        to_stand_out:
          "Connect named parameters, the real-array result, and the last-position grammar rule.",
      },
      speaking: paragraphs(
        "- A rest parameter belongs to a function declaration. In §function log(level, ...messages)§, §level§ receives the first argument and §messages§ receives only the remaining arguments. That result is a real array, so array methods such as §map§, §filter§, and §reduce§ work directly.",
        "- The older §arguments§ object is available inside ordinary functions and represents every argument supplied to that call, including values matched by named parameters. It is array-like rather than a real array. Arrow functions do not create their own §arguments§ binding, which is another reason named rest parameters are clearer in modern code.",
        "- Rest destructuring operates on an existing value rather than on function arguments. §const [head, ...tail] = queue§ creates a new array for the remaining iterable values. §const { password, ...publicUser } = user§ creates a shallow object from the remaining own enumerable properties.",
        "- For example, a §join(separator, ...parts)§ helper gives the variable group a meaningful name and excludes §separator§ automatically. By contrast, reading §arguments§ would require manually skipping index zero and converting the array-like object before using many array methods.",
        "- The grammar keeps collection unambiguous: one rest parameter is allowed, it must be last, it cannot have a default, and no trailing comma follows it. I prefer rest parameters for new variadic functions and use destructuring rest only when I genuinely need the unmatched portion of a value.",
      ),
      deep: paragraphs(
        "**Three sources produce three related results.** A call supplies arguments, an iterable supplies array elements, and an object supplies own enumerable properties. The rest position names the unmatched part of that particular source.",
        diagram(
          "flowchart LR",
          "  C[function call: first, second, third] -->|named first, ...remaining| PA[remaining array: second, third]",
          "  A[array pattern] -->|head, ...tail| RA[new tail array]",
          "  O[object pattern] -->|id, ...details| RO[new details object]",
          "  G[ordinary function arguments] --> AO[array-like arguments object]",
        ),
        "**Runnable comparison.** The rest parameter excludes the named prefix, while §arguments§ includes the entire call.",
        fence(
          "javascript",
          'import assert from "node:assert/strict";',
          "",
          "function inspect(first, ...remaining) {",
          "  return {",
          "    remaining,",
          "    allArguments: Array.from(arguments),",
          "    remainingIsArray: Array.isArray(remaining),",
          "  };",
          "}",
          "",
          'assert.deepEqual(inspect("a", "b", "c"), {',
          '  remaining: ["b", "c"],',
          '  allArguments: ["a", "b", "c"],',
          "  remainingIsArray: true,",
          "});",
          "",
          "const [first, ...tail] = [10, 20, 30];",
          "assert.equal(first, 10);",
          "assert.deepEqual(tail, [20, 30]);",
        ),
        "**Boundary.** Rest properties and elements are shallow. They build a new outer result but retain references found among the remaining values. Also, §arguments§ inside an arrow resolves lexically or fails when no outer binding exists; it is not the arrow's call data.",
      ),
      followups: [
        "Why can array methods run directly on a rest parameter?",
        "Which arguments are excluded from a rest parameter?",
        "What does §arguments§ mean inside an arrow function?",
      ],
    },
  ],
  "template-literals": [
    {
      question:
        "How do JavaScript template literals handle interpolation and multiline text?",
      title: "Template Literal Interpolation and Multiline Text",
      direct:
        "A template literal is delimited by backticks. In an untagged template, JavaScript evaluates each §¤{expression}§ placeholder, converts its result to text, and joins it with the surrounding literal parts. Source line breaks become part of the resulting string, and backticks or a literal placeholder marker must be escaped when they should appear as text.",
      difficulty: "easy",
      quick: [
        "Template literals use backticks instead of single or double quotes.",
        "§¤{expression}§ evaluates any JavaScript expression and inserts its text result.",
        "Line breaks written inside the literal remain in the resulting string.",
        "Escape a backtick with a backslash and escape §¤{§ when interpolation is not wanted.",
        "Interpolation formats text; it does not validate or escape untrusted data.",
      ],
      intent: {
        testing:
          "Whether the learner understands evaluation, conversion, preserved whitespace, and the security boundary.",
        common_mistake:
          "Treating placeholders as variable-name-only slots or assuming interpolation automatically escapes content.",
        to_stand_out:
          "Mention that each placeholder is an expression and that surrounding whitespace and line breaks are data.",
      },
      speaking: paragraphs(
        "- A template literal is a JavaScript literal written between backticks. Its main benefits are expression interpolation and multiline text. In an untagged template, every §¤{expression}§ is evaluated, converted to a string, and inserted between the literal text segments.",
        "- The placeholder can contain more than a variable name. It can read a property, call a small formatting function, or calculate a value, such as §§Total: ¤{price * quantity}§§. I still keep complicated business logic outside the string so the output remains easy to read and test.",
        "- Newlines and spaces written between the backticks become part of the result. That is useful for readable messages, generated snippets, and small blocks of text, but indentation added only to make source code pretty can also appear in the output. Methods such as §trim§ remove only the boundaries, not unwanted indentation on every line.",
        "- For example, §§Hello, ¤{user.name}!§§ replaces the placeholder with the current name. A backtick inside the text is escaped with a backslash, and §\\¤{name}§ produces placeholder-looking text rather than evaluating §name§.",
        "- Template literals improve composition, not trust. Values still need context-specific handling before they enter HTML, a URL, or a database command. I use them when interpolation or intentional multiline layout makes the result clearer than repeated string concatenation, and I test the exact whitespace when the generated text has a strict format.",
      ),
      deep: paragraphs(
        "**A literal alternates fixed text and evaluated expressions.** JavaScript keeps the text segments in order, evaluates each placeholder at runtime, converts each result for the untagged form, and concatenates the sequence.",
        diagram(
          "flowchart LR",
          "  T1[literal text] --> J[join in source order]",
          "  E[expression evaluated] --> C[text conversion]",
          "  C --> J",
          "  T2[next literal text] --> J",
          "  J --> S[resulting string]",
        ),
        "**Runnable example.** The expression is evaluated once, and the line break is preserved.",
        fence(
          "javascript",
          'import assert from "node:assert/strict";',
          "",
          'const learner = { name: "Asha", completed: 7 };',
          "const summary = §Learner: ¤{learner.name}",
          "Completed: ¤{learner.completed + 1}§;",
          "",
          'assert.equal(summary, "Learner: Asha\\nCompleted: 8");',
          "assert.equal(summary.split(\"\\n\").length, 2);",
          "assert.equal(§Show \\¤{learner.name}§, \"Show ¤{learner.name}\");",
        ),
        "**Boundary.** An untagged interpolation uses normal string conversion. Objects may therefore become §[object Object]§ unless formatted deliberately, and §null§ or §undefined§ become those words. The syntax does not perform HTML escaping, URL encoding, localisation, or number formatting.",
      ),
      followups: [
        "What happens when an object is interpolated without custom formatting?",
        "How can source indentation affect a multiline result?",
        "How do you include placeholder syntax as literal text?",
      ],
    },
    {
      question:
        "What is a tagged template literal, and what does the tag function receive?",
      title: "Tagged Template Literals",
      direct:
        "A tagged template places a callable expression immediately before a template literal. JavaScript calls that function with a stable frozen array of cooked literal segments, a §raw§ view of those segments, and each substitution value as a separate later argument. The tag controls processing and may return a string, object, function, or any other value.",
      difficulty: "medium",
      quick: [
        "A tag is called instead of performing ordinary interpolation.",
        "Its first argument contains the cooked literal segments.",
        "§strings.raw§ exposes the source segments before escape processing.",
        "Substitution expressions arrive as separate values without automatic string conversion.",
        "A tag may validate, transform, cache, or return a non-string result.",
      ],
      intent: {
        testing:
          "Whether the learner can explain the call protocol rather than describing a tag as decorative string syntax.",
        common_mistake:
          "Assuming a tagged template must return a string or receives one already-interpolated string.",
        to_stand_out:
          "Explain the segment count rule and the cooked-versus-raw views.",
      },
      speaking: paragraphs(
        "- A tagged template is a function call written without parentheses: a callable expression appears directly before a template literal. JavaScript does not first build the ordinary interpolated string. It passes the fixed literal pieces and the evaluated substitution values to the tag separately.",
        "- The first argument is an array of cooked text segments, so escape sequences have their interpreted values. Its §raw§ property exposes the corresponding source text before escape processing. If a template has two placeholders, the strings array has three segments: before the first, between them, and after the second.",
        "- Every substitution follows as its own argument and keeps its original type. A number arrives as a number and an object arrives as that object. The tag can combine them, reject an invalid value, construct a query description, return structured data, or do anything another function can do.",
        "- For example, a formatting tag can receive §§User ¤{name} has ¤{count} tasks§§ as three string pieces plus the name and numeric count. It can uppercase the name or format the number before joining the parts. §String.raw§ is a built-in tag that uses raw segments.",
        "- The same frozen strings array is reused when one tagged-template expression is evaluated again, which can support caching. A tag is only as safe as its implementation, however; adding a function before a template does not automatically escape HTML or parameterise SQL.",
      ),
      deep: paragraphs(
        "**The tag receives syntax and data on separate channels.** That separation lets a library interpret fixed grammar independently from runtime values instead of reparsing one concatenated string.",
        diagram(
          "flowchart LR",
          "  L[tagged literal site] --> S[cooked strings array]",
          "  L --> R[strings.raw view]",
          "  L --> V[substitution values with original types]",
          "  S --> T[tag function]",
          "  R --> T",
          "  V --> T",
          "  T --> O[any returned value]",
        ),
        "**Runnable tag.** This tag returns an object so the arguments remain visible.",
        fence(
          "javascript",
          'import assert from "node:assert/strict";',
          "",
          "function inspect(strings, ...values) {",
          "  return { cooked: [...strings], raw: [...strings.raw], values };",
          "}",
          "",
          'const name = "Mina";',
          "const result = inspect§line one\\n¤{name}: ¤{2 + 3}§;",
          "",
          'assert.deepEqual(result.cooked, ["line one\\n", ": ", ""]);',
          'assert.deepEqual(result.raw, ["line one\\\\n", ": ", ""]);',
          'assert.deepEqual(result.values, ["Mina", 5]);',
        ),
        "**Boundary.** The fixed strings array is stable for one literal site, not shared by every identical-looking literal elsewhere. Tagged templates also have different rules for malformed escape sequences: a cooked segment can be §undefined§ while the raw source remains available.",
      ),
      followups: [
        "Why is the strings array one element longer than the values array?",
        "What is the difference between a cooked segment and §strings.raw§?",
        "Can a tag return something other than a string?",
      ],
    },
    {
      question:
        "Why does template-literal interpolation not prevent HTML or SQL injection?",
      title: "Safe Template Literal Interpolation",
      direct:
        "Ordinary template-literal interpolation converts values to text and concatenates them; it does not understand whether the destination is HTML, an attribute, a URL, JavaScript, or SQL. Untrusted values therefore require the protection for their destination: safe DOM APIs or trusted sanitisation for HTML, URL encoding for URL components, and parameterised queries for databases.",
      difficulty: "medium",
      quick: [
        "Interpolation performs composition, not sanitisation.",
        "The correct protection depends on the output context.",
        "Prefer §textContent§ for untrusted DOM text instead of building §innerHTML§.",
        "Use URL APIs or component encoding for URL data.",
        "Use database parameters, never quoted interpolation, for SQL values.",
      ],
      intent: {
        testing:
          "Whether convenient string syntax is kept separate from the security contract of its destination.",
        common_mistake:
          "Assuming backticks or a home-made generic tag automatically make untrusted data safe everywhere.",
        to_stand_out:
          "Name different output contexts and choose a context-specific sink or encoder for each one.",
      },
      speaking: paragraphs(
        "- A normal template literal is a string-building feature. When it sees §¤{value}§, JavaScript converts that value to text and joins it with the surrounding text. It has no information about the grammar that will consume the result, so it cannot decide which characters are dangerous.",
        "- In the DOM, placing untrusted text in §textContent§ keeps it as text. Placing an interpolated string in §innerHTML§ asks the browser to parse markup, so a value containing tags or attributes can change the document unless a trusted HTML sanitiser handles that exact context.",
        "- Database values need a different solution. §§SELECT ... WHERE name = '¤{name}'§§ mixes SQL structure with data and lets quotes change the command. A parameterised query sends fixed SQL and values separately, allowing the database driver to preserve the data boundary.",
        "- URLs are another context. §URL§ and §URLSearchParams§ correctly encode query data without guessing that HTML or SQL escaping applies. For example, setting §url.searchParams.set(\"q\", userInput)§ safely represents spaces, ampersands, and other query characters.",
        "- Tagged templates can support safety only when a well-designed library defines and enforces one context. A generic escape function is not universal because HTML text, HTML attributes, URLs, JavaScript, CSS, and SQL follow different grammars. I keep untrusted data separate as long as the destination API allows, then test hostile characters at that boundary instead of trusting how the source string looks.",
      ),
      deep: paragraphs(
        "**Trust and destination are separate decisions.** The same user value may be safe as DOM text, require URL encoding in a query component, and require a bound parameter in SQL. The template literal itself adds no safety transition.",
        diagram(
          "flowchart TD",
          "  U[untrusted value] --> C{destination context}",
          "  C -->|DOM text| D[textContent]",
          "  C -->|URL component| URL[URL or URLSearchParams]",
          "  C -->|SQL value| SQL[driver parameter]",
          "  C -->|allowed HTML| H[reviewed context-aware sanitiser]",
          "  U -. unsafe raw interpolation .-> X[parser treats data as syntax]",
        ),
        "**Runnable separation example.** The URL API encodes query data, while the query description keeps SQL text and values in different fields.",
        fence(
          "javascript",
          'import assert from "node:assert/strict";',
          "",
          'const untrusted = "tea & cake";',
          'const url = new URL("https://example.test/search");',
          'url.searchParams.set("q", untrusted);',
          'assert.equal(url.href, "https://example.test/search?q=tea+%26+cake");',
          "",
          'const query = {',
          '  text: "SELECT id FROM users WHERE display_name = ?",',
          "  values: [untrusted],",
          "};",
          'assert.equal(query.text.includes(untrusted), false);',
          "assert.deepEqual(query.values, [untrusted]);",
        ),
        "**Boundary.** Parameter marker syntax varies by database driver, so follow that driver's API. §textContent§ is right for text but cannot render intentionally allowed markup. When markup is a product requirement, use a maintained sanitiser configured for that context rather than a short replacement list.",
      ),
      followups: [
        "Why is HTML escaping not a replacement for SQL parameters?",
        "When should §textContent§ be preferred over §innerHTML§?",
        "Can a tagged template be safe, and what must its library guarantee?",
      ],
    },
  ],
};

function moveToArchive(source, target) {
  const sourceExists = fs.existsSync(source);
  const targetExists = fs.existsSync(target);
  if (sourceExists && targetExists) {
    throw new Error("Both active and archived copies exist: " + source);
  }
  if (!sourceExists && !targetExists) {
    throw new Error("Neither active nor archived legacy source exists: " + source);
  }
  if (sourceExists) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.renameSync(source, target);
  }
}

function loadQuestions(root, topicSlug) {
  const file = path.join(root, topicSlug, "complete-qa.json");
  return JSON.parse(fs.readFileSync(file, "utf8")).questions;
}

function verifyLegacyModules() {
  const primaryRoot = fs.existsSync(legacyRoot) ? legacyRoot : archivedLegacy;
  const mirrorRoot = fs.existsSync(legacyMirror) ? legacyMirror : archivedMirror;
  const expectedTopics = [
    "arrow-functions-and-destructuring",
    "async-await-basics",
    "comparisons",
    "modules-import-export",
    "promises-and-fetch",
    "scenario-based",
    "spread-and-rest",
    "template-literals",
  ];
  let count = 0;
  for (const topic of expectedTopics) {
    const relative = path.join(topic, "complete-qa.json");
    const primary = fs.readFileSync(path.join(primaryRoot, relative));
    const mirror = fs.readFileSync(path.join(mirrorRoot, relative));
    if (!primary.equals(mirror)) {
      throw new Error(relative + ": legacy locked-tree and V2 copies are not byte-identical.");
    }
    const questions = JSON.parse(primary.toString("utf8")).questions;
    if (questions.length !== 5) throw new Error(relative + ": expected five legacy shells.");
    count += questions.length;
  }
  if (count !== 40) throw new Error("Expected 40 legacy shell records, found " + count + ".");
}

function writeLegacyArchiveManifest() {
  const manifest = {
    source: "content/frontend-fresher/javascript-es6-async",
    duplicateMirror: "content/interview/javascript/frontend/beginner/javascript-es6-async",
    canonical: "content/frontend-fresher/javascript-async-basics",
    archivedOn: "2026-09-07",
    reason: "The module was not declared by the locked Frontend index. Its two active copies were byte-identical and all 40 records used generated shell answers.",
    comparison: {
      totalTopics: 8,
      totalRecords: 40,
      overlapTopics: 6,
      overlapRecords: 30,
      overlapDisposition: "Superseded by the 18 curated canonical lessons covering arrow/destructuring, Promises, async/await, Fetch, modules, and concrete async scenarios.",
      missingScopes: ["spread-and-rest", "template-literals"],
      missingScopeRecords: 10,
      promotedRoutes: 6,
      promotedDisposition: "Legacy q001-q003 IDs and slugs became six newly written canonical gold lessons.",
      discardedShellRoutes: 4,
      discardedDisposition: "q004 comparison and q005 scenario variants contained no concept-specific teaching; their useful intent is covered inside the new lessons.",
    },
    topicMapping: {
      "arrow-functions-and-destructuring": "arrow-functions-destructuring",
      "promises-and-fetch": ["promises-basics", "fetch-api-basics"],
      "async-await-basics": "async-await-basics",
      "modules-import-export": "modules-import-export",
      "scenario-based": "scenario-based",
      comparisons: ["arrow-functions-destructuring", "promises-basics", "async-await-basics", "fetch-api-basics", "modules-import-export"],
      "spread-and-rest": "spread-and-rest (promoted)",
      "template-literals": "template-literals (promoted)",
    },
  };
  fs.writeFileSync(
    path.join(archivedLegacy, "ARCHIVE-MANIFEST.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
}

function verifyCanonicalV2Mirror() {
  const mirrorRoot = fs.existsSync(canonicalV2Mirror)
    ? canonicalV2Mirror
    : archivedCanonicalV2Mirror;
  if (!fs.existsSync(mirrorRoot)) {
    throw new Error("The canonical M04 V2 mirror is missing from both active and archive roots.");
  }
  const overlappingTopics = topicOrder.filter(
    (topic) => !["spread-and-rest", "template-literals"].includes(topic),
  );
  let count = 0;
  for (const topic of overlappingTopics) {
    const mirrorQuestions = loadQuestions(mirrorRoot, topic);
    const canonicalQuestions = loadQuestions(canonicalRoot, topic);
    if (mirrorQuestions.length !== 5 || canonicalQuestions.length !== 3) {
      throw new Error(topic + ": unexpected canonical/V2 record counts.");
    }
    for (let index = 0; index < 3; index += 1) {
      const mirror = mirrorQuestions[index];
      const canonical = canonicalQuestions[index];
      if (mirror.id !== canonical.id || mirror.slug !== canonical.slug) {
        throw new Error(topic + " q00" + (index + 1) + ": V2 route does not duplicate canonical M04.");
      }
    }
    for (const question of mirrorQuestions) {
      const text = [
        question.direct_answer,
        ...(question.answer?.sections ?? []).flatMap((section) => [
          section.content,
          ...(section.items ?? []),
        ]),
      ].filter(Boolean).join(" ");
      if (!/(core interview concept|useful when it solves a clear problem|using it from memory without checking|look at correctness first|reproduce it with the smallest input)/i.test(text)) {
        throw new Error(question.slug + ": V2 record is not a verified generated shell; inspect before archiving.");
      }
    }
    count += mirrorQuestions.length;
  }
  if (count !== 30) throw new Error("Expected 30 generated V2 mirror records, found " + count + ".");
}

function writeArchiveManifest() {
  const mapping = {
    "arrow-functions-destructuring": {
      q001ToQ003: "Same IDs and slugs; canonical answers replace the generated shells.",
      q004ToQ005: "Comparison and scenario intent is taught by the lexical-this, destructuring, and pitfall lessons.",
    },
    "promises-basics": {
      q001ToQ003: "Same IDs and slugs; canonical answers replace the generated shells.",
      q004ToQ005: "Comparison and debugging intent is taught through chaining and error propagation.",
    },
    "async-await-basics": {
      q001ToQ003: "Same IDs and slugs; canonical answers replace the generated shells.",
      q004ToQ005: "Comparison and debugging intent is taught through sequencing, parallelism, and error ownership.",
    },
    "fetch-api-basics": {
      q001ToQ003: "Same IDs and slugs; canonical answers replace the generated shells.",
      q004ToQ005: "Comparison and failure intent is taught through Response stages, HTTP errors, and cancellation.",
    },
    "modules-import-export": {
      q001ToQ003: "Same IDs and slugs; canonical answers replace the generated shells.",
      q004ToQ005: "Comparison and scenario intent is taught through import forms, live bindings, cycles, and dynamic import.",
    },
    "scenario-based": {
      q001ToQ003: "Same IDs and slugs; canonical scenario answers replace the generated shells.",
      q004ToQ005: "Generic comparison/debugging shells are superseded by three concrete async failure investigations.",
    },
  };
  const manifest = {
    source: "content/interview/javascript/frontend/beginner/javascript-async-basics",
    canonical: "content/frontend-fresher/javascript-async-basics",
    archivedOn: "2026-09-07",
    reason: "Frontend-fresher is a locked domain. This 30-record V2 tree duplicated the six canonical topic routes, contained generated shell answers, and could create global ID/slug collisions. No unique teaching content was found.",
    verification: {
      topicsCompared: 6,
      recordsCompared: 30,
      duplicateCanonicalRoutes: 18,
      generatedShellOnlyRecords: 30,
      uniqueTeachingRecords: 0,
    },
    mapping,
  };
  fs.writeFileSync(
    path.join(archivedCanonicalV2Mirror, "ARCHIVE-MANIFEST.json"),
    JSON.stringify(manifest, null, 2) + "\n",
  );
}

function metaDescription(value) {
  const plain = render(value);
  if (plain.length <= 157) return plain;
  return plain.slice(0, 154).replace(/\s+\S*$/, "") + "…";
}

function replaceIndexedModule(rawIndex, moduleSlug, module) {
  const marker = '"moduleSlug": "' + moduleSlug + '"';
  const markerIndex = rawIndex.indexOf(marker);
  if (markerIndex < 0) throw new Error(moduleSlug + " is missing from the raw index.");
  const start = rawIndex.lastIndexOf("\n    {", markerIndex) + 1;
  if (start <= 0) throw new Error("Could not locate the start of " + moduleSlug + ".");
  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;
  for (let index = start; index < rawIndex.length; index += 1) {
    const character = rawIndex[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        end = index + 1;
        break;
      }
    }
  }
  if (end < 0) throw new Error("Could not locate the end of " + moduleSlug + ".");
  const replacement = JSON.stringify(module, null, 2)
    .split("\n")
    .map((line) => "    " + line)
    .join("\n");
  return rawIndex.slice(0, start) + replacement + rawIndex.slice(end);
}

function curateNewTopics() {
  for (const [topicSlug, topicLessons] of Object.entries(lessons)) {
    const sourceFile = path.join(archivedLegacy, topicSlug, "complete-qa.json");
    const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
    if (source.questions.length < topicLessons.length) {
      throw new Error(sourceFile + " does not contain three stable legacy records.");
    }
    const questions = topicLessons.map((lesson, index) => {
      const base = source.questions[index];
      return {
        ...base,
        question: render(lesson.question),
        title: lesson.title,
        direct_answer: render(lesson.direct),
        layout_type: "concept-explanation",
        difficulty: lesson.difficulty,
        importance: "high",
        reading_time_minutes: 8,
        interviewer_intent: lesson.intent,
        answer: {
          sections: [
            {
              type: "key_points",
              title: "Quick revision",
              items: lesson.quick.map(render),
            },
            {
              type: "speakable_answer",
              title: "Interview answer",
              answerSize: "standard",
              content: lesson.speaking,
            },
            {
              type: "deep_explanation",
              title: "Deep dive",
              content: lesson.deep,
            },
          ],
        },
        followup_questions: lesson.followups.map(render),
        order: index + 1,
        seo: {
          metaTitle: lesson.title + " | InterviewExplainer",
          metaDescription: metaDescription(lesson.direct),
        },
      };
    });
    const targetDir = path.join(canonicalRoot, topicSlug);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, "complete-qa.json"),
      JSON.stringify(
        { topic: topicTitles[topicSlug], topicSlug, questions },
        null,
        2,
      ) + "\n",
    );
  }
}

function updateModuleDocuments() {
  const indexPath = path.join(domainRoot, "_index.json");
  const rawIndex = fs.readFileSync(indexPath, "utf8");
  const index = JSON.parse(rawIndex);
  const module = index.modules.find(
    (entry) => entry.moduleSlug === "javascript-async-basics",
  );
  if (!module) throw new Error("Frontend M04 is missing from _index.json.");

  const intro =
    "JavaScript Async & ES6+ brings together the syntax and runtime behaviour that fresher interviews test most often. These 24 lessons explain arrow functions and destructuring, spread and rest, template literals, Promise lifecycle and chaining, async/await sequencing, Fetch response and cancellation behaviour, ES module bindings, and realistic async debugging. Each topic separates the core rule from a runnable example and its important boundary, so learners can reason about JavaScript rather than memorise modern-looking syntax.";
  module.altSlugs = [
    ...new Set([
      ...(module.altSlugs ?? []),
      "javascript-es6-async",
    ]),
  ];
  module.altUrls = [
    ...new Set([
      ...(module.altUrls ?? []),
      "/javascript-es6-async",
    ]),
  ];
  module.topics = topicOrder;
  module.intro = intro;
  fs.writeFileSync(
    indexPath,
    replaceIndexedModule(rawIndex, module.moduleSlug, module),
  );

  const config = {
    moduleNumber: module.moduleNumber,
    pillar: module.pillar,
    pillarName: module.pillarName,
    moduleSlug: module.moduleSlug,
    title: module.title,
    appUrl: module.appUrl,
    seoSlug: module.seoSlug,
    seoUrl: module.seoUrl,
    altSlugs: module.altSlugs,
    altUrls: module.altUrls,
    topics: topicOrder,
    intro,
    visible: true,
  };
  fs.writeFileSync(
    path.join(canonicalRoot, "_config.json"),
    JSON.stringify(config, null, 2) + "\n",
  );

  const revision = {
    title: "JavaScript Async & ES6+ — Revision",
    estimatedMinutes: 14,
    sections: [
      {
        id: "syntax-direction",
        title: "Read modern syntax by its position",
        body: "Arrow functions capture §this§ from their surrounding scope. Destructuring selects values into bindings. Spread expands one source at an array, call, or object value position, while rest collects unmatched values at a parameter or binding position. Template literals evaluate placeholders between fixed text segments; a tag receives those segments and values separately.",
      },
      {
        id: "async-pipeline",
        title: "Own the complete asynchronous pipeline",
        body: "A Promise moves from pending to one settled outcome. Every §then§ creates a new Promise whose result depends on the handler's return or throw. An §async§ function always returns a Promise, and §await§ pauses only that async execution until the awaited value settles. Start independent work before waiting, but preserve real dependency order.",
      },
      {
        id: "fetch-boundaries",
        title: "Separate transport, HTTP, and body failures",
        body: "§fetch§ first produces a Response when headers are available. Network or abort failures reject the request Promise, ordinary HTTP statuses such as 404 and 500 still produce a Response, and body parsing is another asynchronous step that can fail. Check §response.ok§, parse once, and pass an AbortSignal when the caller owns cancellation.",
      },
      {
        id: "modules-and-bindings",
        title: "Think in module graphs and live bindings",
        body: "Static imports define a graph that can be linked before evaluation. Named and default imports are syntax choices, not copy modes: imports are read-only live views of exported bindings. Keep cycles shallow, use dynamic §import()§ for an intentional runtime boundary, and remember that one resolved module identity is evaluated once.",
      },
      {
        id: "debugging-checklist",
        title: "Trace starts, ownership, and stale results",
        body: "For an async bug, record when each operation starts and settles, identify which Promise owns its failure, and confirm cleanup lives in §finally§. Prevent stale search results with cancellation or an identity check. Remove accidental serial waits only when operations are independent, and do not confuse Promise rejection with cancellation of underlying work.",
      },
    ].map((section) => ({ ...section, body: render(section.body) })),
  };
  fs.writeFileSync(
    path.join(canonicalRoot, "_revision.json"),
    JSON.stringify(revision, null, 2) + "\n",
  );
}

verifyLegacyModules();
verifyCanonicalV2Mirror();
moveToArchive(legacyRoot, archivedLegacy);
moveToArchive(legacyMirror, archivedMirror);
moveToArchive(canonicalV2Mirror, archivedCanonicalV2Mirror);
writeLegacyArchiveManifest();
writeArchiveManifest();
curateNewTopics();
updateModuleDocuments();

console.log(
  "Consolidated JavaScript ES6/async into M04: 8 topics, 24 questions, 3 active legacy copies archived.",
);
