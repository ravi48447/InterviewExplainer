#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const presentations = [
  {
    file: "content/ruby-backend-fresher/blocks-and-iterators/block-syntax-yield/complete-qa.json",
    slug: "ruby-block-syntax-yield-basics",
    question: "What are blocks and yield in Ruby?",
    beats: [
      {
        cue: "Define the behavior attached to a method call",
        stage: "Blocks attach behavior",
        spokenText: "A Ruby block is executable behavior attached to a method call. The caller writes it with `{ ... }` or `do ... end`, and one method call can receive one implicit block. The receiving method owns the stable workflow—such as visiting items or managing a resource—while the block supplies the part that changes for that call.",
      },
      {
        cue: "Follow arguments into the block and its result back to the method",
        stage: "yield runs the block",
        spokenText: "Inside the method, `yield(value)` pauses the method, runs the attached block with `value`, and returns the block's last expression to the point of the yield. The method may use that result or yield several times. Calling `yield` when no block was supplied raises `LocalJumpError`, so optional block behavior needs `block_given?` or an enumerator return.",
        support: {
          type: "trace",
          title: "Control moves into the block and back",
          items: [
            {
              label: "Caller",
              value: "transform(10) { ... }",
              detail: "The call carries one implicit block into the method.",
              tone: "blue",
            },
            {
              label: "Method",
              value: "yield(10)",
              detail: "The method chooses when to run the block and which value to pass.",
              tone: "neutral",
            },
            {
              label: "Block",
              value: "number * factor",
              detail: "The block receives 10 and evaluates with its captured factor.",
              tone: "orange",
            },
            {
              label: "Method resumes",
              value: "yield result is 20",
              detail: "The block's last expression becomes the yield expression's value.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Demonstrate closure capture and an optional enumerator path",
        stage: "Blocks keep surrounding values",
        spokenText: "Blocks are closures, so they can read local variables from the scope where they were created. In the example, the block uses `factor` even though `transform` does not receive it. When no block is present, `enum_for` returns an Enumerator; calling `each` on that Enumerator later supplies the block and runs the same method workflow.",
        support: {
          type: "code",
          title: "Yield now or return an Enumerator for later",
          language: "ruby",
          code: "def transform(value)\n  return enum_for(__method__, value) unless block_given?\n\n  result = yield(value)\n  \"Result: #{result}\"\nend\n\nfactor = 2\nputs transform(10) { |number| number * factor }\n\nlater = transform(3)\nputs later.each { |number| number + 1 }",
          caption: "Output is Result: 20 and Result: 4. The method owns when to yield; each caller supplies the calculation.",
        },
      },
      {
        cue: "Distinguish direct yielding from capturing a Proc object",
        stage: "Capture only when needed",
        spokenText: "Use plain `yield` when a method only needs to run its block. A parameter such as `&block` captures that implicit block as a `Proc`, which is useful when it must be stored, forwarded with another `&`, or inspected. Braces bind more tightly than `do ... end`, so use parentheses or split a chained expression when it is not obvious which method owns the block.",
        recallRule: "The method controls the workflow with yield; the caller's block supplies behavior and returns a value back to that yield point.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/blocks-and-iterators/chaining/complete-qa.json",
    slug: "ruby-method-chaining-basics",
    question: "How does method chaining work in Ruby?",
    beats: [
      {
        cue: "Read every dot as a new method call on the previous result",
        stage: "Each result becomes receiver",
        spokenText: "Method chaining calls the next method on the value returned by the previous method. Ruby evaluates `'  ruby  '.strip.upcase.reverse` from left to right: `strip` returns `'ruby'`, `upcase` receives that String and returns `'RUBY'`, and `reverse` receives that result and returns `'YBUR'`. It is ordinary method dispatch, not a separate pipeline feature.",
        support: {
          type: "trace",
          title: "Track the receiver through one chain",
          items: [
            {
              label: "Start",
              value: "'  ruby  '",
              detail: "The original String is the first receiver.",
              tone: "blue",
            },
            {
              label: "strip",
              value: "'ruby'",
              detail: "The returned String becomes the next receiver.",
              tone: "neutral",
            },
            {
              label: "upcase",
              value: "'RUBY'",
              detail: "Another String result supports the next String method.",
              tone: "orange",
            },
            {
              label: "reverse",
              value: "'YBUR'",
              detail: "The final return value becomes the chain result.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Reason from method return contracts instead of visual dots",
        stage: "Return type controls the chain",
        spokenText: "A chain works only while each result responds to the next message. `sort` and `uniq` return Arrays, so `[3, 1, 2, 2].sort.uniq.first` is valid; `first` then returns one element or `nil`. Before adding another call, check that return type and whether absence is possible. The same-looking dot can cross from String to Array, Hash, one object, or `nil`.",
      },
      {
        cue: "Expose nil and conditional bang-method returns with runnable code",
        stage: "Nil can stop the chain",
        spokenText: "A bang suffix does not promise a chainable return. Several String bang methods, including `downcase!`, return `nil` when no change was needed. A search such as `find` may also return `nil`. Safe navigation with `&.` is useful when missing data is an allowed outcome; it should not hide an unexpected absence that the program ought to report.",
        support: {
          type: "code",
          title: "Inspect successful and missing chain results",
          language: "ruby",
          code: "puts '  ruby  '.strip.upcase.reverse\np [3, 1, 2, 2].sort.uniq.first\n\nword = 'ready'\np word.downcase!\n\nprofiles = []\nname = profiles.find { |profile| profile[:active] }&.fetch(:name)&.upcase\np name",
          caption: "Output is YBUR, 1, nil, and nil. The last two chains stop because their method contracts allow absence.",
        },
      },
      {
        cue: "Balance readable flow against hidden states and allocations",
        stage: "Split when meaning is hidden",
        spokenText: "Keep a chain when the steps are short, their return values are clear, and the left-to-right flow explains the operation. Name an intermediate value when one stage can fail, needs inspection, or represents an important business concept. Eager collection chains may also allocate intermediate Arrays; a lazy Enumerator helps with very large or endless inputs, but eager code is usually clearer for a small collection.",
        recallRule: "Every chain is a sequence of return values becoming receivers; inspect each contract and split the expression when that flow stops being clear.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/blocks-and-iterators/enumerable-methods/complete-qa.json",
    slug: "ruby-enumerable-methods-basics",
    question: "What is Enumerable and what are its common methods?",
    beats: [
      {
        cue: "Define the mixin through the traversal contract it expects",
        stage: "each is the contract",
        spokenText: "`Enumerable` is a Ruby mixin for objects that can visit a sequence of values. It does not store the collection. A class includes the module and defines `each`; Enumerable then builds higher-level operations on the values that `each` yields. Arrays, Hashes, and Ranges already provide this contract, and a custom collection can provide it once instead of reimplementing every algorithm.",
      },
      {
        cue: "Select a method from the shape of result the problem needs",
        stage: "Choose by result shape",
        spokenText: "Use `map` when every input should produce one transformed output, `select` when original items should remain only if a condition is truthy, and `find` when only the first match is needed. `reduce` combines the sequence into one accumulator, while `group_by` creates a Hash of grouped Arrays. The method name and return shape should state the job more clearly than a manual loop.",
        support: {
          type: "comparison",
          title: "Match the question to the Enumerable result",
          items: [
            {
              label: "Transform each",
              value: "map → Array",
              detail: "Produce one result for every yielded value.",
              tone: "blue",
            },
            {
              label: "Keep matches",
              value: "select → Array",
              detail: "Preserve original values whose block result is truthy.",
              tone: "green",
            },
            {
              label: "Find one",
              value: "find → item or nil",
              detail: "Stop at the first matching value.",
              tone: "orange",
            },
            {
              label: "Combine all",
              value: "reduce → accumulator",
              detail: "Feed each block result into the next step of one result.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Implement one custom iterator and exercise inherited algorithms",
        stage: "Custom classes gain the mixin",
        spokenText: "A custom class gains the toolbox by including `Enumerable` and yielding its values from `each`. Returning `enum_for(__method__)` when no block is supplied also lets callers obtain an Enumerator. The Playlist example defines traversal once, then uses inherited `select`, `map`, and `find` without duplicating those algorithms.",
        support: {
          type: "code",
          title: "Define each once and use the Enumerable toolbox",
          language: "ruby",
          code: "class Playlist\n  include Enumerable\n\n  def initialize(*tracks)\n    @tracks = tracks\n  end\n\n  def each\n    return enum_for(__method__) unless block_given?\n\n    @tracks.each { |track| yield track }\n  end\nend\n\nplaylist = Playlist.new('intro', 'interview', 'review')\np playlist.select { |track| track.length > 6 }\np playlist.map(&:upcase)\np playlist.find { |track| track.start_with?('r') }\n\nsquares = (1..Float::INFINITY).lazy.select(&:odd?).map { |n| n * n }.first(3)\np squares",
          caption: "The custom each unlocks select, map, and find; the lazy endless pipeline stops after producing [1, 9, 25].",
        },
      },
      {
        cue: "Explain eager allocation reduction identity and lazy demand",
        stage: "Lazy work happens on demand",
        spokenText: "Ordinary `map` and `select` are eager and normally build Arrays before the next stage begins. `lazy` builds an `Enumerator::Lazy` pipeline whose values are pulled only by a terminal operation such as `first` or `to_a`, which matters for huge or endless input. For `reduce`, a clear initial value such as `0` defines both the accumulator type and the result for empty input.",
        recallRule: "Define how values are yielded with each, then choose the Enumerable method whose return shape matches the result you need.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/blocks-and-iterators/symbol-to-proc/complete-qa.json",
    slug: "ruby-symbol-to-proc-basics",
    question: "What is the & (symbol-to-proc) shorthand in Ruby?",
    beats: [
      {
        cue: "Separate the call-site ampersand from the Symbol itself",
        stage: "& converts to a block",
        spokenText: "At a method call, `&object` asks the object for `to_proc` and supplies the resulting Proc as that call's block. A Symbol implements `to_proc`, so `map(&:upcase)` converts `:upcase` and gives that behavior to `map`. The ampersand is the bridge from an object to the one implicit block the method can receive.",
      },
      {
        cue: "Expand the shorthand into the receiver method call it represents",
        stage: "Symbol Proc sends one method",
        spokenText: "A Symbol Proc treats its first yielded value as the receiver and sends the named method to it. Therefore `names.map(&:upcase)` has the same result as `names.map { |name| name.upcase }`. Map yields each String, the generated Proc calls `upcase` on that String, and map collects the returned values.",
        support: {
          type: "trace",
          title: "From Symbol shorthand to one method call",
          items: [
            {
              label: "Call site",
              value: "map(&:upcase)",
              detail: "The ampersand asks the Symbol to become the block.",
              tone: "blue",
            },
            {
              label: "Conversion",
              value: ":upcase.to_proc",
              detail: "Ruby creates behavior named by the Symbol.",
              tone: "neutral",
            },
            {
              label: "Yielded value",
              value: "'ada'",
              detail: "The first value becomes the method receiver.",
              tone: "orange",
            },
            {
              label: "Block result",
              value: "'ADA'",
              detail: "upcase returns the value map collects.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Show how later yielded values become method arguments",
        stage: "Extra values become arguments",
        spokenText: "If the iterator yields more values, the Symbol Proc uses the first as receiver and forwards the remaining values as method arguments. `:to_s.to_proc.call(31, 16)` therefore calls `31.to_s(16)` and returns `'1f'`. This rule is useful for understanding the mechanism, although a normal Array `map` usually yields only one item at a time.",
        support: {
          type: "code",
          title: "Compare shorthand, expansion, and richer blocks",
          language: "ruby",
          code: "names = ['ada', 'linus']\np names.map(&:upcase)\np names.map { |name| name.upcase }\n\nconverter = :to_s.to_proc\np converter.call(31, 16)\n\nprices = [2.345, 8.916]\np prices.map { |price| price.round(2) }\n\ndouble = proc { |number| number * 2 }\np [1, 2, 3].map(&double)",
          caption: "The outputs prove shorthand equivalence, argument forwarding, and when a normal block or Proc carries more information.",
        },
      },
      {
        cue: "Use explicit blocks when the operation contains more information",
        stage: "Use blocks for richer work",
        spokenText: "Symbol-to-Proc is best when the whole transformation is one obvious zero-argument method call on each item. A fixed argument such as `round(2)`, a nil check, several operations, or a meaningful parameter name needs a regular block. The same ampersand can pass an existing Proc with `map(&double)`, while `def run(&block)` captures an incoming block as a Proc inside a method.",
        recallRule: "Use &:method for one clear method send; write a normal block when the transformation needs arguments, conditions, or several steps.",
      },
    ],
  },
];

for (const presentation of presentations) {
  const absolutePath = path.join(repoRoot, presentation.file);
  const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions) || questions.length !== 1) {
    throw new Error(`Expected one question in ${presentation.file}`);
  }

  const question = questions[0];
  if (question.slug !== presentation.slug || question.question !== presentation.question) {
    throw new Error(`Question identity changed in ${presentation.file}`);
  }

  const sections = question.answer?.sections;
  if (!Array.isArray(sections)) throw new Error(`${presentation.slug} is missing answer sections`);
  for (const requiredType of ["key_points", "speakable_answer", "deep_explanation"]) {
    if (sections.filter((section) => section.type === requiredType).length !== 1) {
      throw new Error(`${presentation.slug} needs one ${requiredType} section`);
    }
  }

  const speakable = sections.find((section) => section.type === "speakable_answer");
  speakable.answerSize = "standard";
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText).join("\n\n");

  fs.writeFileSync(absolutePath, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Curated ${presentation.slug}`);
}
