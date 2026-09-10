#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/blocks-and-iterators";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "enumerable-methods": {
    answerSize: "standard",
    direct: "`Enumerable` is a Ruby mixin that builds collection operations on top of one method: `each`. Arrays, Hashes, Ranges, and custom classes that include `Enumerable` can use methods such as `map`, `select`, `find`, `reduce`, `group_by`, and `sort_by`. Choose the method by the result you need: transformed items, filtered items, one match, or one accumulated value.",
    quick: [
      "`Enumerable` provides collection operations using the receiver's `each` method.",
      "`map` transforms; `select` filters; `find` returns the first match.",
      "`reduce` combines items into one result; give it a clear initial value.",
      "A custom class gets these methods by including `Enumerable` and defining `each`.",
      "Normal chains are eager; use `lazy` for long or infinite pipelines.",
    ],
    interview: [
      "- `Enumerable` is a mixin for objects that can visit a sequence of values. It does not store the collection. Instead, it expects the class to define `each`, then implements higher-level operations such as `map`, `select`, `find`, `reduce`, `group_by`, and `sort_by` in terms of that traversal.",
      "- For example, `[12, 5, 18].select { |n| n >= 10 }.map { |n| n * 2 }` first keeps `12` and `18`, then returns `[24, 36]`. `select` answers 'which items remain?', while `map` answers 'what does each item become?'. `reduce(0) { |sum, n| sum + n }` answers a different question by folding the sequence into one value.",
      "- A custom `Playlist` can include `Enumerable` and yield every track from its `each` method. Once that contract exists, `playlist.find`, `playlist.count`, and many other methods work without being implemented again. If an iterator is called without a block, many Ruby collection methods return an `Enumerator` that can be composed or driven later.",
      "- The boundary is allocation and return shape. `each` usually returns the receiver and is used for side effects; `map` and `select` build new Arrays. Long eager chains can allocate several intermediate Arrays, so `lazy` is useful when values should be produced only as needed, especially for an infinite range.",
      "- I choose the method whose name and return value express the task, and I use an explicit loop only when the control flow is genuinely clearer that way.",
    ],
    deepTitle: "One traversal contract unlocks many operations",
    deep: [
      "`Enumerable` uses inversion of control. A class explains how to visit its values through `each`; the module supplies algorithms that consume those yielded values. The class may store an Array, read rows, walk a tree, or generate values. The higher-level methods do not need to know that storage detail.",
      "Return shapes make the methods easier to choose. `map` always creates one output per input. `filter_map` can transform and discard in one pass. `select` keeps original values whose block is truthy. `find` stops when it sees the first match. `group_by` creates a Hash of arrays, while `each_with_object` carries a caller-supplied object through the traversal.",
      "`reduce` treats the block result as the next accumulator. With `reduce(0) { |sum, price| sum + price }`, zero is the identity and also defines the empty-input result. Omitting the initial value makes the first element the accumulator, which can be concise but may make empty input or type intent less obvious.",
      "Ordinary `map.select.take` is eager: each stage completes and can allocate before the next begins. `lazy` returns an `Enumerator::Lazy`; operations build a pipeline and values are pulled only when a terminal operation such as `first` or `to_a` needs them. That difference matters for huge data and is essential for an endless sequence.",
    ],
    visualType: "flow_diagram",
    visualTitle: "The Enumerable contract",
    visual: fence("mermaid", [
      "flowchart LR",
      "  C[Collection or custom class] --> E[defines each and yields values]",
      "  E --> M[Enumerable algorithms]",
      "  M --> A[map: transformed Array]",
      "  M --> S[select: filtered Array]",
      "  M --> F[find: first match]",
      "  M --> R[reduce: one result]",
    ]),
    codeTitle: "Define each once, receive the Enumerable toolbox",
    code: [
      "class Playlist",
      "  include Enumerable",
      "",
      "  def initialize(*tracks)",
      "    @tracks = tracks",
      "  end",
      "",
      "  def each",
      "    return enum_for(__method__) unless block_given?",
      "    @tracks.each { |track| yield track }",
      "  end",
      "end",
      "",
      "playlist = Playlist.new('intro', 'interview', 'review')",
      "playlist.select { |track| track.length > 6 } # => ['interview']",
      "playlist.map(&:upcase)                       # => ['INTRO', 'INTERVIEW', 'REVIEW']",
      "playlist.find { |track| track.start_with?('r') } # => 'review'",
      "",
      "(1..Float::INFINITY).lazy.select(&:odd?).map { |n| n * n }.first(3)",
      "# => [1, 9, 25]",
    ],
  },
  "symbol-to-proc": {
    answerSize: "compact",
    direct: "The `&:method_name` form passes a Symbol as a block. Ruby calls the Symbol's `to_proc`, producing a Proc that sends that method to the first yielded object. Therefore `names.map(&:upcase)` is the concise form of `names.map { |name| name.upcase }`. Use an explicit block when you need fixed arguments, several operations, or clearer names.",
    quick: [
      "`&object` converts an object with `to_proc` into the call's block.",
      "A Symbol Proc calls that named method on the first yielded value.",
      "`names.map(&:upcase)` matches `names.map { |name| name.upcase }`.",
      "The Proc forwards any additional yielded values as method arguments.",
      "Use a normal block for fixed arguments, conditions, or multi-step work.",
    ],
    interview: [
      "- `&:upcase` is Ruby shorthand for passing a block that calls `upcase` on each yielded object. The `&` in a method call means 'convert this object to a Proc and use it as the block'. A Symbol implements `to_proc`, so `:upcase.to_proc` creates behaviour that sends `upcase` to its first argument.",
      "- For example, `['ada', 'linus'].map(&:upcase)` returns `['ADA', 'LINUS']`. Written out, it is `map { |name| name.upcase }`. In both forms, `map` yields one String at a time and collects the value returned by `upcase`.",
      "- The generated Proc can also forward extra values yielded after the receiver. `:to_s.to_proc.call(31, 16)` calls `31.to_s(16)` and returns `'1f'`. The common collection shorthand still depends on what that iterator yields; an Array's `map` normally yields only one object.",
      "- The boundary is expressiveness, not magic. `&:method` cannot directly encode a fixed argument such as 'round to two places', combine two method calls, handle `nil`, or name intermediate values. In those cases, `{ |price| price.round(2) }` is clearer and valid. The shorthand can also be cryptic when the team does not know the idiom.",
      "- I use Symbol-to-Proc when the complete transformation is exactly one obvious method call; otherwise I write the block that states the real operation.",
    ],
    deepTitle: "The ampersand performs block conversion",
    deep: [
      "A Ruby call can receive one implicit block. In `map(&:upcase)`, `:upcase` is first evaluated as a normal Symbol object. The call-site ampersand asks it for `to_proc`, and Ruby installs that Proc as the block received by `map`. `map` then invokes the block for every yielded element.",
      "Symbol's Proc treats its first parameter as a receiver and uses the Symbol as the method name. Remaining parameters are forwarded to that method. Conceptually it behaves like `proc { |receiver, *arguments| receiver.public_send(:upcase, *arguments) }`, although the runtime implements it directly.",
      "This explains both the convenience and the limit. The Symbol names one method; it does not hold extra business arguments or a sequence of operations. `prices.map(&:to_i)` is direct. Converting currencies, guarding missing values, or calling `round(2)` needs a regular block because the transformation contains more information than one method name.",
      "The same `&` syntax works with a Proc variable: `numbers.map(&double)`. In a method parameter such as `def run(&block)`, it performs the opposite bridge by capturing the incoming block as a Proc object. Capturing is useful for storage or forwarding; plain `yield` avoids creating that explicit object when the method only needs to run the block.",
    ],
    visualType: "flow_diagram",
    visualTitle: "From Symbol to block call",
    visual: fence("mermaid", [
      "sequenceDiagram",
      "  participant C as map(&:upcase)",
      "  participant S as :upcase",
      "  participant P as Symbol Proc",
      "  participant V as 'ada'",
      "  C->>S: call to_proc through &",
      "  S-->>C: Proc",
      "  C->>P: yield 'ada'",
      "  P->>V: call upcase",
      "  V-->>C: 'ADA'",
    ]),
    codeTitle: "Shorthand and expanded forms",
    code: [
      "names = ['ada', 'linus']",
      "",
      "names.map(&:upcase)                 # => ['ADA', 'LINUS']",
      "names.map { |name| name.upcase }    # same operation",
      "",
      "converter = :to_s.to_proc",
      "converter.call(31, 16)              # => '1f' (31.to_s(16))",
      "",
      "prices = [2.345, 8.916]",
      "prices.map { |price| price.round(2) } # fixed argument needs a block",
      "",
      "double = proc { |number| number * 2 }",
      "[1, 2, 3].map(&double)               # => [2, 4, 6]",
    ],
  },
  "chaining": {
    answerSize: "compact",
    direct: "Method chaining sends the next method to the value returned by the previous method. In `'  ruby  '.strip.upcase`, `strip` returns `'ruby'`, then `upcase` runs on that result. A chain works only while each return value supports the following call, so return types and possible `nil` values matter more than the visual dots.",
    quick: [
      "Each method in a chain receives the previous method's return value.",
      "Read `'x'.strip.upcase` from left to right as a value pipeline.",
      "Know each return type; a `nil` result can stop the next call.",
      "Bang does not mean 'chainable'; some `!` methods return `nil` when unchanged.",
      "Split a long chain when naming an intermediate step improves meaning or debugging.",
    ],
    interview: [
      "- Method chaining means calling a method on the object returned by the previous call. Ruby evaluates a chain from left to right. For example, in `'  ruby  '.strip.upcase.reverse`, `strip` returns `'ruby'`, `upcase` returns `'RUBY'`, and `reverse` returns `'YBUR'`.",
      "- The mechanism is ordinary method dispatch, not a separate pipeline feature. Each dot changes the current receiver. Collection methods compose for the same reason: `[3, 1, 2, 2].sort.uniq.first` passes a sorted Array to `uniq`, then asks the unique Array for its first value.",
      "- The boundary is the return contract. `find` may return `nil`, so `users.find { ... }.name` can fail when there is no match. A bang method is not automatically safer for chaining: `downcase!` returns `nil` when it makes no change, even though it returns the String after a change. Safe navigation with `&.` is useful only when absence is expected and the chain should also return `nil`.",
      "- Long chains may also hide intermediate data or allocate several Arrays. I split them when a named step explains the business rule, when I need to inspect a value, or when one stage can fail. For a large sequence, a lazy Enumerator may avoid building every intermediate result.",
      "- I keep a chain when every step is short, the return types are clear, and the left-to-right expression is easier to understand than temporary variables.",
    ],
    deepTitle: "Follow the receiver after every dot",
    deep: [
      "The only reliable way to reason about a chain is to write the return value under each call. A transformation such as `strip` returns a String, so another String method can follow. `map` returns an Array, `group_by` returns a Hash, `first` returns one element or `nil`, and `each` usually returns the original receiver. The visible syntax looks uniform even though those contracts differ.",
      "Mutation adds another distinction. A method ending in `!` conventionally has a more dangerous counterpart, often because it changes the receiver, but Ruby does not promise that every mutating method has a bang or that every bang method returns `self`. Several String bang methods return `nil` when no modification was required. Chaining through that conditional result is fragile.",
      "Safe navigation, `account&.owner&.name`, stops and returns `nil` when its receiver is `nil`. It should represent an allowed missing relationship, not silence an unexpected bug. If absence needs a default, an explicit `fetch`, `||`, or branch can explain that policy more clearly.",
      "Eager collection stages can allocate one intermediate Array per transformation. `(1..).lazy.map(...).select(...).first(5)` changes evaluation: values flow through the pipeline only until five matches are found. Use that when size justifies it; for a small Array, the eager chain is usually simpler.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Every return value becomes the next receiver",
    visual: fence("mermaid", [
      "flowchart LR",
      "  A[\"'  ruby  '\"] -->|strip returns String| B[\"'ruby'\"]",
      "  B -->|upcase returns String| C[\"'RUBY'\"]",
      "  C -->|reverse returns String| D[\"'YBUR'\"]",
      "  N[method may return nil] -.->|next call cannot run| X[NoMethodError]",
    ]),
    codeTitle: "Expand a chain to inspect its contracts",
    code: [
      "result = '  ruby  '.strip.upcase.reverse",
      "# => 'YBUR'",
      "",
      "step_1 = '  ruby  '.strip     # String: 'ruby'",
      "step_2 = step_1.upcase        # String: 'RUBY'",
      "step_3 = step_2.reverse       # String: 'YBUR'",
      "",
      "numbers = [3, 1, 2, 2]",
      "numbers.sort.uniq.first       # => 1",
      "",
      "word = 'ready'",
      "word.downcase!                # => nil, because nothing changed",
      "# word.downcase!.reverse      # would call reverse on nil",
      "",
      "profile = nil",
      "profile&.fetch(:name, nil)&.upcase # => nil when absence is allowed",
    ],
  },
};

for (const [directory, lesson] of Object.entries(lessons)) {
  const file = path.join(root, directory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions) || questions.length !== 1) {
    throw new Error(`${file}: expected one canonical question after shell pruning`);
  }

  const question = questions[0];
  question.direct_answer = lesson.direct;
  question.last_updated = "2026-09-07";
  question.reading_time_minutes = 5;

  const sections = (question.answer?.sections ?? []).filter(
    (section) => section.type !== "interviewer_expectation",
  );
  const replace = (types, value) => {
    const accepted = Array.isArray(types) ? types : [types];
    const index = sections.findIndex((section) => accepted.includes(section.type));
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
    answerSize: lesson.answerSize,
    content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n"),
  });
  replace("deep_explanation", {
    type: "deep_explanation",
    title: lesson.deepTitle,
    content: lesson.deep.join("\n\n"),
  });
  replace(["flow_diagram", "comparison_table", "concept_map"], {
    type: lesson.visualType,
    title: lesson.visualTitle,
    content: lesson.visual,
  });
  replace("code_example", {
    type: "code_example",
    title: lesson.codeTitle,
    content: fence("ruby", lesson.code),
  });
  question.answer = { ...question.answer, sections };

  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

console.log(`Curated ${Object.keys(lessons).length} Ruby iterator questions.`);
