#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const presentations = [
  {
    file: "content/ruby-backend-fresher/ruby-language-basics/data-types-variables/complete-qa.json",
    slug: "ruby-data-types-variables-basics",
    answerSize: "compact",
    beats: [
      {
        cue: "Explain the binding model",
        stage: "Names point to objects",
        spokenText: "Ruby is dynamically typed. A variable is a name that refers to an object; the object has a class and provides the available methods. Ruby does not declare a variable as `int count`. After `count = 3`, the name refers to an Integer, and a later assignment can make it refer to a String.",
        support: {
          type: "comparison",
          title: "Keep name, object, and assignment separate",
          items: [
            {
              label: "Variable name",
              value: "count",
              detail: "Has a scope and refers to an object.",
              tone: "blue",
            },
            {
              label: "Object",
              value: "3",
              detail: "Carries its class, state, and behaviour.",
              tone: "green",
            },
            {
              label: "Assignment",
              value: "count = 3",
              detail: "Changes the binding; it does not declare a fixed variable type.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Name common objects and behaviour",
        stage: "Objects carry behaviour",
        spokenText: "Common Ruby objects include Integer, Float, String, Symbol, Array, Hash, Range, `true`, `false`, and `nil`. Every value is an object, so even `3.times` is a method call. Ruby often uses duck typing: code asks for the required behaviour instead of repeatedly checking the object's exact class.",
      },
      {
        cue: "Show aliasing, mutation, and rebinding",
        stage: "Mutation is not reassignment",
        spokenText: "Assignment does not copy a mutable object. After `backup = items`, both names refer to the same Array, so `items << \"book\"` is visible through `backup`. Later, `items = []` only points `items` at a different Array; it does not change what `backup` refers to.",
        support: {
          type: "code",
          title: "Watch two names share one Array",
          language: "ruby",
          code: "value = 3\nputs value.class\n\nvalue = \"three\"\nputs value.class\n\nitems = []\nbackup = items\nitems << \"book\"\np backup\n\nitems = []\np items\np backup",
          caption: "Mutation changes the shared Array; reassignment changes only one name's binding.",
        },
      },
      {
        cue: "Explain the scope encoded in variable spelling",
        stage: "Spelling shows scope",
        spokenText: "Ruby spelling communicates scope: `total` is local, `@total` belongs to one object, `@@total` is shared through a class hierarchy, `$total` is global, and `TOTAL` is a constant. Constants express an intention not to reassign; Ruby can still reassign one with a warning. Only `nil` and `false` are falsey—zero and empty collections are truthy.",
        recallRule: "Names have scope, objects have type and behaviour, and assignment changes a binding rather than fixing a variable's type.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/ruby-language-basics/strings-symbols/complete-qa.json",
    slug: "ruby-strings-symbols-basics",
    answerSize: "compact",
    beats: [
      {
        cue: "Separate text from an identifier",
        stage: "Text and names are different",
        spokenText: "A String represents text and is normally mutable. A Symbol is an immutable, interned name such as `:status`. Use Strings for content that may be displayed, edited, or received from outside the program. Use Symbols for a stable vocabulary owned by the program, such as method names, states, or known option keys.",
        support: {
          type: "comparison",
          title: "String and Symbol serve different jobs",
          items: [
            {
              label: "String",
              value: "\"paid\"",
              detail: "Text data; supports interpolation, slicing, and mutation.",
              tone: "blue",
            },
            {
              label: "Symbol",
              value: ":paid",
              detail: "A frozen program identifier reused by name.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Show that Hash key types are not interchangeable",
        stage: "Hash keys keep their type",
        spokenText: "In `{ status: \"paid\" }`, the key is the Symbol `:status` and the value is a String. `record[:status]` finds it, but `record[\"status\"]` returns `nil` because a String key and a Symbol key are different values. Normalise key types once at a boundary instead of accepting both everywhere.",
        support: {
          type: "code",
          title: "Keys, values, and conversion",
          language: "ruby",
          code: "record = { status: \"paid\" }\n\np record[:status]\np record[\"status\"]\n\ntext = \"paid\"\ntext.upcase!\np text\n\np :status.frozen?\np :status.to_s\np \"status\".to_sym",
          caption: "The key lookup depends on type; conversions should be deliberate.",
        },
      },
      {
        cue: "Explain mutability and interning without slogans",
        stage: "Mutability changes the choice",
        spokenText: "Strings support text operations such as interpolation, concatenation, and in-place methods like `upcase!`. Symbols are always frozen and do not behave like editable text. Repeated `:status` literals identify the same Symbol value. String literals can also be frozen with `# frozen_string_literal: true`, so memory slogans are not a reliable selection rule.",
      },
      {
        cue: "Give the durable selection rule",
        stage: "Choose by meaning",
        spokenText: "Choose by what the value means, not by the claim that Symbols are always faster or smaller. User input, API text, and display content normally stay as Strings. A closed set of internal names can use Symbols. Modern Ruby can garbage-collect dynamic Symbols, but converting unlimited external input with `to_sym` is usually unnecessary work.",
        recallRule: "String for text data; Symbol for a stable program-owned name; keep Hash key types consistent.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/ruby-language-basics/arrays-hashes/complete-qa.json",
    slug: "ruby-arrays-hashes-basics",
    answerSize: "compact",
    beats: [
      {
        cue: "Define the two collection models",
        stage: "Position versus key",
        spokenText: "An Array is an ordered collection whose elements are normally found by integer position. A Hash stores unique keys and their values, so a value is found by a meaningful key. Both collections are mutable, preserve insertion order, can hold any Ruby objects, and include `Enumerable`.",
        support: {
          type: "comparison",
          title: "Choose the model that matches the lookup",
          items: [
            {
              label: "Array",
              value: "items[2]",
              detail: "Best for a sequence, stable position, and repeated values.",
              tone: "blue",
            },
            {
              label: "Hash",
              value: "counts[:done]",
              detail: "Best for a record, index, or lookup by a unique key.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Use the same domain data in both forms",
        stage: "Sequence and lookup in code",
        spokenText: "A workflow such as `[\"draft\", \"review\", \"done\"]` is naturally an Array because order matters. Counts by status are naturally a Hash because the program asks for a name such as `:review`. The example also shows that a missing `hash[key]` returns `nil`, while `fetch` can provide a deliberate default.",
        support: {
          type: "code",
          title: "An ordered workflow and keyed counts",
          language: "ruby",
          code: "statuses = [\"draft\", \"review\", \"done\"]\nstatuses << \"archived\"\nputs statuses[1]\n\ncounts = { draft: 4, review: 2, done: 9 }\nputs counts[:review]\nputs counts.fetch(:blocked, 0)\n\nactive = counts.select { |_status, count| count >= 4 }\np active",
          caption: "The Array answers by position; the Hash answers by status key.",
        },
      },
      {
        cue: "Explain lookup and iteration behaviour",
        stage: "The lookup cost is different",
        spokenText: "Array index access is constant time, but finding an arbitrary value normally scans the sequence. A Hash uses a key's `hash` value and `eql?` for average constant-time lookup. During iteration, an Array yields one element, while a Hash yields a key and value. Calling `map` on either returns an Array unless pairs are converted with `to_h`.",
      },
      {
        cue: "State the important collection boundaries",
        stage: "Model the data first",
        spokenText: "A Hash cannot hold two separate entries for the same key; assigning that key again replaces its value. Avoid mutating a key after insertion when the changed state affects its hash. An Array is the wrong model for frequent key searches because each search is linear. In both collections, nested mutable objects can still be shared after a shallow `dup`.",
        recallRule: "Use an Array when position identifies the item; use a Hash when a stable key identifies the value.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/ruby-language-basics/methods-and-return/complete-qa.json",
    slug: "ruby-methods-and-return-basics",
    answerSize: "compact",
    beats: [
      {
        cue: "Define a method and its normal result",
        stage: "Last expression is the result",
        spokenText: "A Ruby method packages behaviour behind a name and is defined with `def ... end`. Every call produces a value. When execution reaches the end normally, Ruby returns the value of the last evaluated expression, so a final `return` is usually unnecessary.",
        support: {
          type: "trace",
          title: "How a method produces its result",
          items: [
            {
              label: "Call",
              value: "total(100)",
              detail: "Ruby receives positional and keyword inputs.",
              tone: "blue",
            },
            {
              label: "Bind",
              value: "price = 100",
              detail: "Arguments are matched to the parameter list.",
              tone: "green",
            },
            {
              label: "Evaluate",
              value: "price * 1.18",
              detail: "The body runs expression by expression.",
              tone: "orange",
            },
            {
              label: "Result",
              value: "118.0",
              detail: "The last expression becomes the return value.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain explicit return as control flow",
        stage: "return exits early",
        spokenText: "An explicit `return` stops the method immediately. It is most useful for a guard clause such as `return 0 if price.nil?`, which handles an exceptional or empty case before the main path. `return` with no value returns `nil`; otherwise it returns the supplied object.",
      },
      {
        cue: "Demonstrate positional and keyword parameters",
        stage: "Parameters shape the call",
        spokenText: "Parameters can be required or optional. Keywords such as `tax:` make the meaning visible at the call site. `*args` gathers extra positional arguments into an Array, while `**options` gathers extra keyword arguments into a Hash. The complete example combines an early guard, a keyword default, and an implicit result.",
        support: {
          type: "code",
          title: "A complete method with a keyword",
          language: "ruby",
          code: "def total(price, tax: 0.18)\n  return 0 if price.nil?\n  price * (1 + tax)\nend\n\nputs total(100)\nputs total(100, tax: 0.05)\nputs total(nil)",
          caption: "The multiplication is the normal result; the guard returns before it when `price` is `nil`.",
        },
      },
      {
        cue: "State the Ruby 3 keyword boundary",
        stage: "Ruby 3 separates keywords",
        spokenText: "Ruby 3 treats positional arguments and keyword arguments as separate channels. A final positional Hash does not automatically satisfy a method's keyword parameters. Forward positional values with `*args`, keywords with `**kwargs`, and a block with `&block`, or use supported `...` forwarding when the whole call should pass through unchanged.",
        recallRule: "The last expression is the normal result; use `return` for an early exit and design the parameter list to make calls clear.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/ruby-language-basics/conditionals-loops/complete-qa.json",
    slug: "ruby-conditionals-loops-basics",
    answerSize: "compact",
    beats: [
      {
        cue: "Explain that Ruby branches return values",
        stage: "Branches are expressions",
        spokenText: "Ruby uses `if`, `elsif`, `else`, `unless`, and `case` to choose which code runs. These constructs are expressions, so the selected branch also becomes a value. For example, `status = if paid then :ready else :waiting end` assigns the Symbol returned by the chosen branch.",
        support: {
          type: "comparison",
          title: "Match the control form to the job",
          items: [
            {
              label: "if / elsif",
              value: "conditions",
              detail: "General branching with one or more boolean conditions.",
              tone: "blue",
            },
            {
              label: "case / when",
              value: "patterns",
              detail: "Related values, ranges, classes, or regular expressions.",
              tone: "green",
            },
            {
              label: "unless",
              value: "simple negative",
              detail: "Readable only when the negative condition stays short.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain case matching",
        stage: "case uses pattern matching",
        spokenText: "A `case` expression asks each `when` candidate to match using `===`. A Range can therefore test membership, a Class can match an instance, and a regular expression can match text. If no branch matches and there is no `else`, the expression returns `nil`.",
      },
      {
        cue: "Prefer an iterator that describes the result",
        stage: "Iterators state the purpose",
        spokenText: "Ruby supports `while` and `until`, but collection work is usually clearer with an iterator. Use `each` for side effects, `map` to transform every item, `select` to filter, `find` for the first match, and `times` for a fixed count. The complete example lets branching and iteration produce useful values.",
        support: {
          type: "code",
          title: "Branches choose; iterators transform",
          language: "ruby",
          code: "score = 86\ngrade = case score\n        when 90..100 then \"A\"\n        when 80..89 then \"B\"\n        else \"C\"\n        end\n\nprices = [10, 25, 40]\ndiscounted = prices.map { |price| price * 0.9 }\nlarge = prices.select { |price| price >= 25 }\n\nputs grade\np discounted\np large",
          caption: "`case` returns the grade; `map` and `select` return new Arrays with different purposes.",
        },
      },
      {
        cue: "State truthiness and loop boundaries",
        stage: "Only nil and false are falsey",
        spokenText: "Only `nil` and `false` are falsey in Ruby. Zero, an empty String, and an empty collection are all truthy, so test emptiness with methods such as `empty?`. Inside repetition, `next` skips the rest of one iteration and `break` exits the nearest loop. Keep `while` for repetition driven by changing state rather than a known collection.",
        recallRule: "Use `if` or `case` to choose a value, select the iterator that describes the result, and remember that only `nil` and `false` are falsey.",
      },
    ],
  },
];

for (const presentation of presentations) {
  const absolutePath = path.join(repoRoot, presentation.file);
  const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const question = document.questions?.find((entry) => entry.slug === presentation.slug);
  if (!question) throw new Error(`Question not found: ${presentation.slug}`);
  const speaking = question.answer?.sections?.find((section) => section.type === "speakable_answer");
  if (!speaking) throw new Error(`Interview answer not found: ${presentation.slug}`);
  speaking.answerSize = presentation.answerSize;
  speaking.beats = presentation.beats;
  speaking.content = presentation.beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  fs.writeFileSync(absolutePath, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Curated Interview Answer presentation for ${presentation.slug}.`);
}
