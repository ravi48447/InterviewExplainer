#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/ruby-modules-basics";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "include-vs-extend": {
    answerSize: "compact",
    direct: "`include SomeModule` makes the module's instance methods available to instances of the receiving class, while `extend SomeModule` makes those methods singleton methods of the receiving object. Therefore `User.include(Greeting)` lets `User.new.greet` work; `User.extend(Greeting)` lets `User.greet` work. Any individual object can also be extended without changing other instances of its class.",
    quick: [
      "`include M` gives a class's instances access to `M`'s instance methods.",
      "`extend M` gives the receiving object access to those methods directly.",
      "Extending a class creates class-level behaviour because the class is an object.",
      "Extending one instance affects that object, not every instance of its class.",
      "Choose by asking which receiver should answer the method call.",
    ],
    interview: [
      "- `include` and `extend` reuse the instance methods defined by a module, but they attach that behaviour to different receivers. Including `Greeting` in `User` places the module in the instance lookup chain, so `User.new.greet` works.",
      "- Extending `User` with the same module adds the behaviour to the `User` class object. The call is then `User.greet`, while an ordinary User instance does not gain it. This works because a Ruby class is itself an object and can have singleton methods.",
      "- For example, a `Printable` mixin belongs in `Invoice` with `include` when every invoice should respond to `print`. A module that builds invoices from imported data may be extended onto `Invoice` when the natural call is `Invoice.from_csv(data)`.",
      "- `extend` is not limited to classes. `report.extend(DebugLabels)` changes only that report object's singleton class, which is useful for narrow decoration but can surprise readers if overused. Neither operation copies state; module methods still run against the eventual receiver's instance variables.",
      "- The practical distinction is receiver ownership: include behaviour for instances, extend behaviour for the class object or one chosen object, and keep the module's contract small enough that the receiver can genuinely satisfy it.",
    ],
    deepTitle: "Follow the receiver into its method lookup chain",
    deep: [
      "A module stores instance-method definitions. `include` inserts that module into the ancestor chain used by instances of the class. Ruby still performs normal message lookup; it does not paste a second independent copy of each method into every object.",
      "`extend` operates on one receiver. It includes the module in that receiver's singleton class, a hidden class that holds methods unique to the object. When the receiver happens to be a class object, those singleton methods are what Ruby developers normally call class methods.",
      "This model explains why `obj.extend(M)` is local to `obj` and why module methods can read the receiver's state. Inside the reused method, `self` is the object that received the call—not the module where the method was written.",
      "Hooks can combine both ideas, but a beginner-facing design often stays clearer with an explicit `include InstanceMethods` and `extend ClassMethods`. A module should express one coherent capability; using it only to avoid typing a few unrelated methods hides dependencies rather than improving design.",
    ],
    visualType: "comparison_table",
    visualTitle: "The receiver decides between include and extend",
    visual: "| Declaration | Method call that works | Where the module enters lookup |\n|---|---|---|\n| `class User; include Greeting; end` | `User.new.greet` | User instances' ancestor chain |\n| `class User; extend Greeting; end` | `User.greet` | User object's singleton class |\n| `user.extend(Greeting)` | `user.greet` | That one user's singleton class |",
    codeTitle: "The same module can serve three different receivers",
    code: [
      "module Greeting",
      "  def greet",
      "    \"hello from #{self.class}\"",
      "  end",
      "end",
      "",
      "class Member",
      "  include Greeting",
      "end",
      "Member.new.greet             # => 'hello from Member'",
      "",
      "class Team",
      "  extend Greeting",
      "end",
      "Team.greet                   # => 'hello from Class'",
      "",
      "guest = Object.new",
      "guest.extend(Greeting)",
      "guest.greet                  # only guest gained this method",
    ],
    followups: [
      "Where does an included module appear in `Class#ancestors`?",
      "Why does extending a class create class-level methods?",
      "When is extending only one object useful, and when is it surprising?",
    ],
  },
  "enumerable-comparable": {
    answerSize: "standard",
    direct: "`Enumerable` and `Comparable` are Ruby mixins that derive many operations from one core protocol. A collection includes `Enumerable` and implements `each`, gaining methods such as `map`, `select`, and `reduce`. An ordered value includes `Comparable` and implements `<=>`, gaining `<`, `<=`, `==`, `>=`, `>`, `between?`, and `clamp`. `<=>` should return a negative number, zero, a positive number, or `nil` when the values cannot be compared.",
    quick: [
      "Include `Enumerable` in a collection and implement `each`.",
      "Enumerable then builds traversal operations such as `map`, `select`, and `reduce`.",
      "Include `Comparable` in an ordered value and implement `<=>`.",
      "`<=>` returns negative, zero, positive, or `nil` for incomparable values.",
      "Comparable supplies comparisons; collection sorting still comes from the collection API.",
    ],
    interview: [
      "- `Enumerable` and `Comparable` are standard Ruby mixins that turn a small protocol into a larger, consistent API. They avoid reimplementing the same traversal or comparison operations directly in every class.",
      "- A collection includes `Enumerable` and defines `each`, yielding its elements in the collection's intended order. Enumerable can then implement `map`, `select`, `find`, `reduce`, `group_by`, and many other methods by repeatedly calling that `each` method.",
      "- For example, a `ScoreBoard` that yields each numeric score needs no custom `select` implementation. Once it includes Enumerable, `board.select { |score| score >= 70 }` works through the class's own traversal rule. Returning `enum_for(:each)` when no block is given also supports normal Ruby iteration patterns.",
      "- A value type includes `Comparable` and defines `<=>`. A negative result means the receiver comes before the other value, zero means equal in ordering, a positive result means after, and `nil` means comparison is unsupported. Comparable uses that result to provide the relational operators, `between?`, and `clamp`.",
      "- For instance, a `Version` can compare `[major, minor]` pairs. An array can then sort Version objects because its sorting algorithm calls their `<=>`; `sort` itself belongs to the collection side, not to Comparable. The core rule is that `each` must yield faithfully and `<=>` must be consistent and handle incompatible types deliberately.",
    ],
    deepTitle: "One primitive operation powers a family of methods",
    deep: [
      "Enumerable works through inversion of control: the collection decides how elements are exposed, and the mixin supplies algorithms that consume that stream. A tree could yield depth-first, a page set could fetch batches, and a wrapper could filter hidden records. Every inherited operation follows the order and completeness of `each`.",
      "That makes `each` a behavioural contract. It should yield every intended element exactly once unless the collection explicitly documents another rule. Returning an Enumerator when no block is supplied lets callers defer the traversal or chain it with other enumerator operations.",
      "Comparable turns a three-way comparison into boolean relationships. The sign of `<=>` matters, not a requirement to return exactly minus one or one. Returning `nil` for an unrelated type says there is no sensible ordering; pretending unrelated values are equal can violate symmetry and produce unstable results.",
      "Sorting crosses both protocols. An Enumerable or Array method controls traversal and ordering work, while each element's `<=>` defines how two values compare. If `<=>` is inconsistent—for example, `a < b` and `b < a` can both become true—higher-level operations cannot produce reliable answers.",
    ],
    visualType: "concept_map",
    visualTitle: "Small protocol, derived behaviour",
    visual: fence("mermaid", [
      "flowchart LR",
      "  E[ScoreBoard includes Enumerable] --> Each[implements each]",
      "  Each --> EA[map / select / reduce / find]",
      "  C[Version includes Comparable] --> S[implements <=>]",
      "  S --> CA[< / <= / == / >= / > / between? / clamp]",
      "  EA -. collection sort calls .-> S",
    ]),
    codeTitle: "Implement each for a collection and <=> for a value",
    code: [
      "class ScoreBoard",
      "  include Enumerable",
      "",
      "  def initialize(scores)",
      "    @scores = scores",
      "  end",
      "",
      "  def each",
      "    return enum_for(:each) unless block_given?",
      "    @scores.each { |score| yield score }",
      "  end",
      "end",
      "",
      "ScoreBoard.new([82, 61, 90]).select { |score| score >= 70 }",
      "# => [82, 90]",
      "",
      "class Version",
      "  include Comparable",
      "  attr_reader :major, :minor",
      "",
      "  def initialize(major, minor)",
      "    @major = major",
      "    @minor = minor",
      "  end",
      "",
      "  def <=>(other)",
      "    return nil unless other.is_a?(Version)",
      "    [major, minor] <=> [other.major, other.minor]",
      "  end",
      "end",
      "",
      "Version.new(2, 1) > Version.new(1, 9)  # => true",
    ],
    followups: [
      "Why does an Enumerable class need to implement `each`?",
      "What should `<=>` return for an incompatible value?",
      "Does Comparable itself define `sort`, and how do sortable collections use it?",
    ],
  },
  namespacing: {
    answerSize: "compact",
    direct: "Namespacing in Ruby means placing related constants—usually classes and modules—inside a containing module and referring to them with `::`, such as `Payments::Charge`. It prevents unrelated constants with the same short name from colliding, shows which part of the system owns a concept, and gives files and APIs a clearer structure. It should group real responsibilities without creating unnecessarily deep constant paths.",
    quick: [
      "A module can contain related classes, modules, and constants.",
      "Use `::` to reference a nested constant such as `Payments::Charge`.",
      "Different namespaces can safely define the same short name.",
      "A namespace communicates ownership and organises larger codebases.",
      "Keep nesting purposeful; deep paths make code and file layout harder to follow.",
    ],
    interview: [
      "- A Ruby namespace is a container for constants. Modules are commonly used for that container, so a class written inside `module Payments` is addressed as `Payments::Charge` rather than as a top-level `Charge`.",
      "- The main mechanism is constant nesting and the `::` separator. `Payments::Charge` asks for the `Charge` constant associated with `Payments`. Methods remain normal methods; the namespace changes the constant's full identity, not how an instance receives messages.",
      "- For example, a checkout system and an order-accounting system may each need a class called `Charge`. `Payments::Charge` and `Orders::Charge` can coexist because they are different constants, and each full name immediately tells a reader which responsibility it belongs to.",
      "- Namespaces also organise public libraries and Rails applications. A constant such as `Admin::UsersController` usually corresponds to the admin area and, under Rails autoloading conventions, to a matching directory and file path.",
      "- The boundary is readability: a namespace should represent a stable area or library, not every folder or tiny implementation detail. Clear, shallow ownership prevents collisions without turning ordinary names into long paths.",
    ],
    deepTitle: "A full constant path is part of a class's identity",
    deep: [
      "Ruby stores classes and modules in constants. Defining `Charge` while the lexical scope is `Payments` assigns a class object to the `Payments::Charge` constant. A separate `Orders::Charge` assignment points to a different class object even though both final names are `Charge`.",
      "The `::` form makes the lookup target explicit. A leading `::`, as in `::JSON`, starts at the top level, which can resolve ambiguity inside another namespace. Unqualified constants may be found through Ruby's lexical and ancestor lookup rules, so explicit paths are valuable at boundaries where similarly named concepts coexist.",
      "Namespacing also shapes packaging. A gem can put its public constants under one top-level module instead of polluting the application's global constant space. In frameworks with autoloading, the constant path and filesystem path often need to agree, making a coherent namespace part of maintainable project structure.",
      "A namespace is not automatically a good architecture. If every internal class gets several nesting levels, moving code becomes expensive and call sites become noisy. The useful test is whether the prefix communicates durable ownership or prevents a realistic collision.",
    ],
    visualType: "concept_map",
    visualTitle: "Same short name, different full identity",
    visual: fence("mermaid", [
      "flowchart TD",
      "  P[Payments namespace] --> PC[Payments::Charge]",
      "  P --> PR[Payments::Refund]",
      "  O[Orders namespace] --> OC[Orders::Charge]",
      "  PC -. different class despite same short name .- OC",
    ]),
    codeTitle: "Separate two meanings of Charge",
    code: [
      "module Payments",
      "  class Charge",
      "    def label",
      "      'payment charge'",
      "    end",
      "  end",
      "end",
      "",
      "module Orders",
      "  class Charge",
      "    def label",
      "      'shipping charge'",
      "    end",
      "  end",
      "end",
      "",
      "Payments::Charge.new.label  # => 'payment charge'",
      "Orders::Charge.new.label    # => 'shipping charge'",
      "Payments::Charge == Orders::Charge  # => false",
    ],
    followups: [
      "What does a leading `::` mean in a Ruby constant path?",
      "How can two classes with the short name `Charge` coexist?",
      "How do namespaces relate to Rails autoloading and file paths?",
    ],
  },
};

let curated = 0;
for (const [directory, lesson] of Object.entries(lessons)) {
  const file = path.join(root, directory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(document.questions) || document.questions.length !== 1) {
    throw new Error(`${file}: expected one canonical question`);
  }

  const question = document.questions[0];
  question.direct_answer = lesson.direct;
  question.last_updated = "2026-09-07";
  question.reading_time_minutes = lesson.answerSize === "standard" ? 7 : 6;
  question.answer = {
    ...(question.answer ?? {}),
    sections: [
      {
        type: "key_points",
        title: "Quick Revision",
        content: lesson.quick.map((point) => `- ${point}`).join("\n"),
      },
      {
        type: "speakable_answer",
        title: "Interview Answer",
        answerSize: lesson.answerSize,
        content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n"),
      },
      {
        type: "deep_explanation",
        title: lesson.deepTitle,
        content: lesson.deep.join("\n\n"),
      },
      {
        type: lesson.visualType,
        title: lesson.visualTitle,
        content: lesson.visual,
      },
      {
        type: "code_example",
        title: lesson.codeTitle,
        content: fence("ruby", lesson.code),
      },
    ],
  };
  question.followup_questions = lesson.followups;
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
  curated += 1;
}

console.log(`Curated ${curated} Ruby modules questions.`);
