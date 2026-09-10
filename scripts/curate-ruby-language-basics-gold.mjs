#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/ruby-language-basics";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "arrays-hashes": {
    direct: "An **Array** is an ordered collection accessed mainly by integer position, while a **Hash** stores unique keys and their values. Use an Array for a sequence such as steps or scores, and a Hash for keyed lookup such as a user record or a count by word. Both are mutable, preserve insertion order, and work with Ruby's `Enumerable` methods.",
    quick: [
      "An **Array** keeps an ordered sequence and uses integer indexes.",
      "A **Hash** maps unique keys to values and looks them up by key.",
      "Use Arrays for position and duplicates; use Hashes for named lookup.",
      "Both are mutable and preserve insertion order.",
      "Both support `Enumerable`; a Hash yields key-value pairs.",
    ],
    interview: [
      "- An **Array** is Ruby's ordered, integer-indexed collection. A **Hash** is a collection of unique keys mapped to values. Both can hold mixed object types, both are mutable, and both preserve insertion order, but they answer different lookup questions.",
      "- For example, `['draft', 'review', 'done']` is naturally an Array because position and sequence matter. `{ draft: 4, review: 2, done: 9 }` is naturally a Hash because I want the count for a named status. `statuses[1]` asks for a position; `counts[:review]` asks for a key.",
      "- Array access by index is constant time, while finding an arbitrary value normally requires a scan. A Hash computes a key's hash value and uses `hash` together with `eql?` to find the entry in average constant time. Iteration is ordered in both collections, and methods such as `each`, `map`, and `select` come through `Enumerable`.",
      "- The boundary is the data model. A Hash cannot keep two separate entries for the same key, and mutable objects used as keys can become unsafe if their hash-relevant state changes. An Array is a poor substitute for repeated key-based lookup because each search is linear.",
      "- My choice is simple: use an Array when an item belongs at a position in a sequence, and use a Hash when a value belongs to a stable key.",
    ],
    deepTitle: "Position and key are two different models",
    deep: [
      "Ruby stores an Array as a sequence of object references. Index `0` means the first slot, negative indexes count from the end, and a range can select a slice. Appending with `<<` changes the same Array object. That makes Arrays a good fit for ordered work queues, rows, and any collection where the same value may appear more than once.",
      "A Hash builds an index from each key's `hash` value and confirms matches with `eql?`. Keys are unique: assigning the same key again replaces its value without moving that entry to the end. A missing `hash[key]` normally returns `nil`, while `hash.fetch(key)` raises `KeyError` unless a fallback is supplied. That distinction matters when `nil` is itself a valid stored value.",
      "Both classes include `Enumerable`, but their `each` values differ. An Array yields one element at a time; a Hash normally yields a key and value. Transforming a Hash with `map` returns an Array unless the resulting pairs are converted back with `to_h`.",
      "Mutation is shared through references. If two variables point to the same collection, changing it through one variable is visible through the other. Use `dup` for a shallow copy, and remember that nested objects are still shared. The useful mental model is not 'list versus faster list'; it is **position identifies an Array element, while a key identifies a Hash entry**.",
    ],
    visualType: "comparison_table",
    visualTitle: "Array or Hash?",
    visual: "| Need | Array | Hash |\n|---|---|---|\n| Identify an item by | Integer position | Unique key |\n| Keep duplicates | Yes | Values yes; keys no |\n| Typical lookup | `items[2]` | `items[:status]` |\n| Missing lookup | Usually `nil` | `nil`, or `fetch` can raise |\n| Best fit | Sequence | Keyed record or index |",
    codeTitle: "The same data, modelled two ways",
    code: [
      "statuses = ['draft', 'review', 'done']",
      "statuses[1]                    # => 'review'",
      "statuses << 'archived'         # changes this Array",
      "",
      "counts = { draft: 4, review: 2, done: 9 }",
      "counts[:review]                # => 2",
      "counts[:blocked]               # => nil",
      "counts.fetch(:blocked, 0)      # => 0",
      "",
      "statuses.map(&:upcase)         # => ['DRAFT', 'REVIEW', 'DONE', 'ARCHIVED']",
      "counts.select { |_key, value| value >= 4 } # => { draft: 4, done: 9 }",
    ],
  },
  "conditionals-loops": {
    direct: "Ruby uses `if`/`elsif`/`else`, `unless`, and `case` to choose which expression to evaluate. It supports `while` and `until`, but collection work is usually clearer with iterators such as `each`, `map`, `select`, and `times`. Only `false` and `nil` are falsey in Ruby; values such as `0` and an empty string are truthy.",
    quick: [
      "Use `if`/`elsif`/`else` for general branching and `case` for alternatives.",
      "`unless` means `if not` and is clearest for one simple negative condition.",
      "Only `false` and `nil` are falsey; `0` and `''` are truthy.",
      "Prefer `each`, `map`, `select`, or `times` to manual counter loops.",
      "`break` exits, `next` skips, and `redo` repeats the current iteration.",
    ],
    interview: [
      "- Ruby conditionals are expressions, so `if`, `unless`, and `case` produce values as well as control execution. `if` handles general conditions, `elsif` adds branches, and `case` keeps a multi-choice decision readable. `unless` is the negative form of `if` and works best when the condition is short.",
      "- For example, `label = if score >= 90 then 'A' elsif score >= 80 then 'B' else 'C' end` assigns the selected branch's value. For several related patterns, a `case` can match a range such as `90..100` or a class such as `String` because each `when` uses that object's `===` method.",
      "- Ruby has `while` and `until`, but it normally delegates repetition to the object being traversed. `orders.each` visits items, `3.times` repeats a fixed count, `select` filters, and `map` builds transformed output. This avoids a manual index and states the purpose of the loop directly.",
      "- Two boundaries matter. Only `false` and `nil` are falsey, so `0`, `''`, and empty collections still enter an `if` branch. Also, a complicated `unless ... else` is harder to read than a positive `if`.",
      "- I use branching to select behaviour and choose the iterator whose return value matches the job; I keep `while` for genuinely state-driven repetition.",
    ],
    deepTitle: "Ruby control flow returns values",
    deep: [
      "The important Ruby idea is that control-flow constructs evaluate to an object. In `status = if paid then :ready else :waiting end`, the chosen symbol becomes the assignment value. If no condition matches and there is no `else`, the result is `nil`. This makes a separate pre-declared result variable unnecessary in many cases.",
      "A `case` expression sends `===` to each `when` candidate. A Range therefore checks membership, a Class checks whether the value is an instance, and a regular expression checks for a match. This is more flexible than treating `case` as a disguised chain of equality tests.",
      "Iteration also has return-value semantics. `each` is for side effects and returns its receiver. `map` returns one transformed item for each input. `select` keeps matching items, while `find` stops at the first match. Picking the right iterator communicates intent and often removes bookkeeping variables.",
      "Inside a loop or iterator, `next` skips the rest of the current iteration and `break` stops the nearest loop. `redo` starts the same iteration again without advancing, so it must be guarded carefully to avoid an endless loop. A manual `while` remains useful when progress depends on changing state rather than traversing a known collection.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Choose the control-flow shape",
    visual: fence("mermaid", [
      "flowchart TD",
      "  S[Need to choose or repeat?] -->|choose| C{How many branches?}",
      "  C -->|general conditions| I[if / elsif / else]",
      "  C -->|related values or patterns| K[case / when]",
      "  S -->|repeat| R{What drives progress?}",
      "  R -->|a collection| E[each / map / select]",
      "  R -->|a count| T[times / upto]",
      "  R -->|changing state| W[while / until]",
    ]),
    codeTitle: "Branches and iterators return useful values",
    code: [
      "score = 86",
      "grade = if score >= 90",
      "          'A'",
      "        elsif score >= 80",
      "          'B'",
      "        else",
      "          'C'",
      "        end",
      "",
      "kind = case score",
      "       when 90..100 then :excellent",
      "       when 60..89  then :pass",
      "       else :retry",
      "       end",
      "",
      "prices = [10, 25, 40]",
      "discounted = prices.map { |price| price * 0.9 }",
      "large = prices.select { |price| price >= 25 }",
      "",
      "[grade, kind, discounted, large]",
    ],
  },
  "data-types-variables": {
    direct: "Ruby is dynamically typed: variables do not have declared types; they hold references to objects, and the object determines the available behaviour. Common objects include integers, floats, strings, symbols, arrays, hashes, ranges, booleans, and `nil`. A variable's prefix communicates scope: local `name`, instance `@name`, class `@@name`, global `$name`, or constant `NAME`.",
    quick: [
      "Variables reference objects; the variable itself has no declared type.",
      "Common objects include numbers, Strings, Symbols, Arrays, Hashes, and Ranges.",
      "Local, instance, class, global, and constant names signal different scopes.",
      "Every value is an object and responds to methods defined for its class.",
      "Ruby favours behaviour and duck typing over repeated class checks.",
    ],
    interview: [
      "- Ruby is dynamically typed. A variable is a name that refers to an object, and the object's class determines which methods it supports. There is no declaration such as `int count`; `count = 3` refers to an Integer, and a later assignment can make the same local name refer to a String.",
      "- The everyday built-in objects include Integer, Float, String, Symbol, Array, Hash, Range, `true`, `false`, and `nil`. Everything is an object, so even `3.times` is a method call. Ruby code usually relies on duck typing: if an object responds to the behaviour a method needs, its exact class may not matter.",
      "- For example, after `items = []`, assigning `backup = items` does not copy the Array. Both names refer to the same mutable object, so `items << 'book'` is visible through `backup`. Reassignment is different: `items = []` changes only what the name `items` refers to.",
      "- Naming indicates scope. `total` is local, `@total` belongs to one object, `@@total` is shared through a class hierarchy, `$total` is global, and `TOTAL` is a constant. Constants can technically be reassigned with a warning, so the naming rule expresses intent rather than absolute immutability.",
      "- The practical model is: names have scope, objects have type, and shared mutable objects require care. I ask what behaviour is needed before adding an explicit class check.",
    ],
    deepTitle: "Names point to objects",
    deep: [
      "An assignment changes a binding between a name and an object. It does not pour a new type into a variable. This explains why `value = 10` followed by `value = 'ten'` is valid, and why aliases to the same Array observe the same mutation. Method arguments follow the same model: Ruby passes the object reference as a value, so a method can mutate the referenced object but cannot rebind the caller's local variable.",
      "Object behaviour matters more than labels. Integers respond to arithmetic, Strings to text operations, and collections to iteration. Duck typing takes that one step further: a method can accept any object that responds to the required messages. `render(item)` may need only `item.to_s`, not a specific inheritance tree.",
      "Variable spelling creates scope. A local name lives in its lexical context. An instance variable is stored on a particular object and begins as `nil` if it has not been assigned. Class variables are shared with descendants and can surprise callers, so class-instance variables are often safer for independent class state. Globals are visible broadly and make dependencies difficult to follow.",
      "Ruby truthiness is separate from type. Only `nil` and `false` are falsey; zero, empty Strings, and empty Arrays are truthy. Type checks such as `is_a?` are still appropriate at system boundaries, but ordinary collaboration is clearer when code asks for the operation it needs.",
    ],
    visualType: "concept_map",
    visualTitle: "Separate scope from type",
    visual: "blue|Variable name|~Chooses a binding and scope|`name`, `@name`, `@@name`, `$name`, `NAME`\nemerald|Object|~Carries class, state, and behaviour|Integer, String, Array, custom object\namber|Assignment|~Points a name at an object|does not declare or copy the object's type\nviolet|Method call|~Uses behaviour|duck typing asks what the object can do",
    codeTitle: "Reassignment is not mutation",
    code: [
      "value = 3",
      "value = 'three'              # same local name, different object",
      "",
      "items = []",
      "backup = items               # both names reference one Array",
      "items << 'book'              # mutate that Array",
      "backup                       # => ['book']",
      "",
      "items = []                   # rebind only items",
      "backup                       # => ['book']",
      "",
      "class Cart",
      "  LIMIT = 20                 # constant naming expresses intent",
      "  def initialize",
      "    @items = []               # state on this Cart object",
      "  end",
      "end",
    ],
  },
  "methods-and-return": {
    direct: "Define a Ruby method with `def name(parameters) ... end`. A method returns the value of its last evaluated expression unless `return` exits earlier. Parameters may be required, optional, keyword-based, collected with `*args`, or collected with `**kwargs`; Ruby 3 treats positional and keyword arguments separately.",
    quick: [
      "`def name(parameters) ... end` defines a method.",
      "The last evaluated expression is returned automatically.",
      "Use `return` mainly for an early exit.",
      "Parameters can be required, optional, keyword, `*args`, or `**kwargs`.",
      "Ruby 3 separates positional arguments from keyword arguments.",
    ],
    interview: [
      "- A Ruby method packages behaviour behind a name and is defined with `def ... end`. Every call produces a value. If execution reaches the end normally, Ruby returns the last expression; an explicit `return` ends the method immediately and supplies its value, or `nil` when no value is given.",
      "- For example, `def total(price, tax: 0.18); price * (1 + tax); end` has one positional parameter and one keyword parameter. Calling `total(100, tax: 0.05)` returns `105.0` because the multiplication is the final expression. No explicit return is needed.",
      "- Required and optional positional parameters describe ordered inputs. Keywords make call sites self-explanatory. `*args` gathers extra positional values into an Array, while `**options` gathers extra keywords into a Hash. A block is a separate optional input and can be detected with `block_given?` or captured with `&block` when it must be stored or forwarded.",
      "- I use `return` for a guard such as `return 0 if price.nil?`, not at the end of every method. In Ruby 3, a final positional Hash is not automatically the same as keyword arguments, so forwarding code must preserve `*args` and `**kwargs` correctly.",
      "- A clear Ruby method has a focused name, an intentional parameter shape, and one predictable returned value, whether that value is explicit or implicit.",
    ],
    deepTitle: "A call binds inputs, runs the body, and yields one value",
    deep: [
      "When Ruby calls a method, it first matches the supplied positional and keyword arguments to the parameter list. Missing required inputs raise `ArgumentError`; optional defaults are evaluated when the method is called. Extra positional or keyword values are accepted only when the signature has the corresponding splat parameter.",
      "The body is a sequence of expressions. The value of the final expression becomes the result, which may be an object, `false`, or `nil`. A guard clause uses `return` to stop before that final expression. This is useful for invalid or empty input because it keeps the main path from being nested inside a large conditional.",
      "Blocks are not ordinary positional arguments. A method can yield to an attached block, ask whether one exists with `block_given?`, or capture it as a Proc through `&block`. Capturing has a cost and is unnecessary when the method only needs to `yield` immediately.",
      "Ruby 3's keyword separation prevents ambiguous calls. A method declared with `name:` expects a keyword, while a method declared with one positional `options` parameter expects a Hash. Delegators should forward positional inputs with `*args`, keywords with `**kwargs`, and the block with `&block` or the `...` forwarding syntax supported by the target Ruby version.",
    ],
    visualType: "flow_diagram",
    visualTitle: "What happens during a method call",
    visual: fence("mermaid", [
      "flowchart LR",
      "  C[Call method] --> B[Bind positional and keyword inputs]",
      "  B --> G{Guard returns early?}",
      "  G -->|yes| R[Return guard value]",
      "  G -->|no| E[Evaluate body expressions]",
      "  E --> L[Return last expression]",
    ]),
    codeTitle: "Implicit result, early return, and argument forms",
    code: [
      "def total(price, tax: 0.18)",
      "  return 0 if price.nil?       # explicit early exit",
      "  price * (1 + tax)            # implicit result",
      "end",
      "",
      "total(100, tax: 0.05)          # => 105.0",
      "",
      "def collect(first, second = 0, *rest, label:, **options)",
      "  { first: first, second: second, rest: rest, label: label, options: options }",
      "end",
      "",
      "collect(10, 20, 30, 40, label: 'sample', cached: true)",
      "# => { first: 10, second: 20, rest: [30, 40],",
      "#      label: 'sample', options: { cached: true } }",
    ],
  },
  "strings-symbols": {
    direct: "A **String** represents text and is normally mutable; a **Symbol** is an immutable, interned name such as `:status`. Use Strings for user data and text operations, and Symbols for stable identifiers such as method names or known option keys. They are different values, so `'status'` and `:status` are different Hash keys.",
    quick: [
      "Strings hold text and are normally mutable.",
      "Symbols are immutable, interned names such as `:status`.",
      "Use Strings for changing or external text; Symbols for fixed identifiers.",
      "`'name'` and `:name` are different values and different Hash keys.",
      "Convert deliberately with `to_s` or `to_sym`; do not mix key types silently.",
    ],
    interview: [
      "- A String is a sequence of characters used as text, and it is normally mutable in Ruby. A Symbol is an immutable, interned name: repeated use of `:status` refers to the same Symbol value. Symbols often represent method names, states, and known option keys rather than text shown to a user.",
      "- For example, `{ status: 'paid' }` uses the Symbol `:status` as a fixed field name and the String `'paid'` as data. Looking up `record[:status]` works, while `record['status']` returns `nil` because a String key and a Symbol key are not equal.",
      "- Strings support text operations such as concatenation, interpolation, slicing, and in-place modification. Symbols do not behave like mutable text; convert with `to_s` when text processing is needed. A normal String literal may create a separate object, while Symbols are interned. With `# frozen_string_literal: true`, literals in that source file are frozen and may be deduplicated.",
      "- I would not choose Symbols merely from the old slogan that they are always more memory-efficient. Dynamic Symbols are garbage-collected in modern Ruby, and a Hash also handles String keys correctly. The important distinction is meaning: stable program identifier versus text data. Converting untrusted, unlimited input to Symbols is usually unnecessary.",
      "- I keep key types consistent at boundaries and use Symbols for a closed vocabulary, Strings for content that users or external systems provide.",
    ],
    deepTitle: "Identity, mutability, and key equality",
    deep: [
      "A String owns character data and exposes both non-mutating and mutating operations. `upcase` creates a result, while `upcase!` may change the receiver. Calling `freeze` prevents further modification. The file-level `# frozen_string_literal: true` directive freezes literal Strings in that source file, which also lets the runtime reuse equivalent literals.",
      "A Symbol represents a name stored in Ruby's symbol table. It is always frozen and is commonly used by the language itself for method and variable names. `:ready.to_s` creates text when needed, and `'ready'.to_sym` obtains the corresponding Symbol. Modern Ruby can garbage-collect dynamically created Symbols, but converting arbitrary input still adds work and usually hides a missing data-normalisation decision.",
      "Hash lookup normally uses `hash` and `eql?`, so `'status'` and `:status` occupy separate entries. Neither spelling is universally better. JSON parsers naturally produce String keys unless configured otherwise; Ruby keyword arguments and idiomatic internal option Hashes commonly use Symbols. Converting at one system boundary is clearer than accepting both forms throughout the codebase.",
      "The durable rule is semantic: if the value is content that may vary, display, or be edited, keep it as a String. If it names one member of a small vocabulary owned by the program, a Symbol is often a clear fit.",
    ],
    visualType: "comparison_table",
    visualTitle: "String and Symbol serve different jobs",
    visual: "| Question | String | Symbol |\n|---|---|---|\n| Represents | Text data | Program identifier |\n| Mutable by default | Yes | No; always frozen |\n| Typical example | `'Paid order'` | `:paid` |\n| Common use | Input, output, text processing | States, method names, known keys |\n| Hash key equality | `'status'` matches only a String key | `:status` matches only a Symbol key |",
    codeTitle: "Keep identifier keys and text values distinct",
    code: [
      "record = { status: 'paid' }",
      "record[:status]               # => 'paid'",
      "record['status']              # => nil: different key type",
      "",
      "text = 'paid'",
      "text.upcase                   # => 'PAID'; text is unchanged",
      "text.upcase!                  # text is now 'PAID'",
      "",
      ":status.frozen?               # => true",
      ":status.to_s                  # => 'status'",
      "'status'.to_sym               # => :status",
      "",
      "# frozen_string_literal: true",
      "# In a source file with this directive, String literals are frozen.",
    ],
  },
};

for (const [directory, lesson] of Object.entries(lessons)) {
  const file = path.join(root, directory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions) || questions.length !== 1) {
    throw new Error(`${file}: expected exactly one canonical question after shell pruning`);
  }

  const question = questions[0];
  question.direct_answer = lesson.direct;
  question.last_updated = "2026-09-07";
  question.reading_time_minutes = 5;

  const sections = (question.answer?.sections ?? []).filter(
    (section) => section.type !== "interviewer_expectation",
  );
  const replace = (type, value) => {
    const index = sections.findIndex((section) => section.type === type);
    if (index >= 0) sections[index] = value;
    else sections.push(value);
  };

  replace("key_points", {
    type: "key_points",
    title: "Quick Revision",
    content: lesson.quick.map((point) => `- ${point}`).join("\n"),
  });
  replace("speakable_answer", {
    type: "speakable_answer",
    title: "Interview Answer",
    answerSize: "compact",
    content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n"),
  });
  replace("deep_explanation", {
    type: "deep_explanation",
    title: lesson.deepTitle,
    content: lesson.deep.join("\n\n"),
  });

  const oldVisualIndex = sections.findIndex((section) => [
    "flow_diagram",
    "comparison_table",
    "concept_map",
  ].includes(section.type));
  const visual = {
    type: lesson.visualType,
    title: lesson.visualTitle,
    content: lesson.visual,
  };
  if (oldVisualIndex >= 0) sections[oldVisualIndex] = visual;
  else sections.push(visual);

  replace("code_example", {
    type: "code_example",
    title: lesson.codeTitle,
    content: fence("ruby", lesson.code),
  });

  question.answer = { ...question.answer, sections };
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

console.log(`Curated ${Object.keys(lessons).length} Ruby language-basics questions.`);
