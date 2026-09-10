#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const presentations = [
  {
    file: "content/ruby-backend-fresher/ruby-modules-basics/enumerable-comparable/complete-qa.json",
    slug: "ruby-enumerable-comparable-basics",
    beats: [
      {
        cue: "Name the two protocols",
        stage: "Two mixins, small contracts",
        spokenText: "`Enumerable` and `Comparable` are Ruby mixins that build many useful methods from one method supplied by the class. A collection includes `Enumerable` and defines `each`. An ordered value includes `Comparable` and defines `<=>`. The class keeps control of its own data; the mixin supplies the common operations.",
        support: {
          type: "comparison",
          title: "One required method unlocks a larger API",
          items: [
            {
              label: "Enumerable",
              value: "each",
              detail: "For collections. Gains methods such as `map`, `select`, `find`, and `reduce`.",
              tone: "blue"
            },
            {
              label: "Comparable",
              value: "<=>",
              detail: "For ordered values. Gains `<`, `<=`, `>`, `>=`, `between?`, and `clamp`.",
              tone: "green"
            }
          ]
        }
      },
      {
        cue: "Show how Enumerable uses each",
        stage: "Enumerable grows from each",
        spokenText: "`each` defines which values the collection exposes and in what order. Once `ScoreBoard#each` yields every score, `select` can keep the scores that match a block even though the class never defines `select` itself. Returning an Enumerator when no block is given also keeps the class compatible with normal Ruby iteration.",
        support: {
          type: "code",
          title: "Implement each; use select",
          language: "ruby",
          code: "class ScoreBoard\n  include Enumerable\n\n  def initialize(scores)\n    @scores = scores\n  end\n\n  def each(&block)\n    return enum_for(:each) unless block\n    @scores.each(&block)\n  end\nend\n\nboard = ScoreBoard.new([82, 61, 90])\np board.select { |score| score >= 70 }",
          caption: "Output: `[82, 90]`. The class defines traversal once; Enumerable supplies `select`."
        }
      },
      {
        cue: "Explain the spaceship result",
        stage: "Comparable grows from <=>",
        spokenText: "`<=>` is called the spaceship operator. It returns a negative number when the receiver comes first, zero when both values have the same position, a positive number when the receiver comes later, and `nil` when the values cannot be compared. For a version object, the key line can be `[major, minor] <=> [other.major, other.minor]`.",
      },
      {
        cue: "Close with the correctness rule",
        stage: "Keep the contract consistent",
        spokenText: "These mixins are only as correct as the method behind them. `each` must yield the intended elements consistently, and `<=>` must give a stable ordering for compatible values. Collection methods such as `sort` perform the sorting work; Comparable only tells them how two elements compare.",
        recallRule: "Enumerable grows from `each`; Comparable grows from `<=>`; both depend on a consistent contract."
      }
    ]
  },
  {
    file: "content/ruby-backend-fresher/ruby-modules-basics/include-vs-extend/complete-qa.json",
    slug: "ruby-include-vs-extend-basics",
    beats: [
      {
        cue: "Start with the receiver",
        stage: "The receiver is the difference",
        spokenText: "Both `include` and `extend` reuse instance methods from a module. The difference is who receives those methods. `include Greeting` inside `User` makes `greet` available to User instances, so the call is `User.new.greet`. `User.extend(Greeting)` adds it to the User class object, so the call is `User.greet`.",
        support: {
          type: "comparison",
          title: "Choose by the call you want to make",
          items: [
            {
              label: "include",
              value: "user.greet",
              detail: "Adds the module to the lookup chain used by every User instance.",
              tone: "blue"
            },
            {
              label: "extend class",
              value: "User.greet",
              detail: "Adds the module's methods to the User class object.",
              tone: "green"
            },
            {
              label: "extend object",
              value: "guest.greet",
              detail: "Adds the behaviour only to that one chosen object.",
              tone: "orange"
            }
          ]
        }
      },
      {
        cue: "Connect each form to a real use",
        stage: "Instances or the type itself",
        spokenText: "Use `include` when the behaviour belongs to every instance, such as each invoice being printable. Use `extend` on a class when the type itself should perform the operation, such as `Invoice.from_csv(data)`. This is why Ruby modules can provide either instance behaviour or class-level helpers without inheritance.",
      },
      {
        cue: "Demonstrate both calls",
        stage: "One module, two receivers",
        spokenText: "The module below defines one ordinary instance method. `Member` includes it, while `Team` extends itself with it. The method body is the same, but `self` is whichever object receives the call.",
        support: {
          type: "code",
          title: "Include for instances; extend for the class",
          language: "ruby",
          code: "module Greeting\n  def greeting_target\n    self\n  end\nend\n\nclass Member\n  include Greeting\nend\n\nclass Team\n  extend Greeting\nend\n\nputs Member.new.greeting_target.class\nputs Team.greeting_target",
          caption: "Output: `Member`, then `Team`. The receiver changes even though the module method stays the same."
        }
      },
      {
        cue: "Explain the lookup boundary",
        stage: "Methods attach, not state",
        spokenText: "Neither operation copies the module's own state into the receiver. The reused method runs with the receiver as `self` and can therefore use that receiver's instance variables. Extending one object, as in `report.extend(DebugLabels)`, affects only that object. Keep a mixin focused on one clear capability so its required state is easy to understand.",
        recallRule: "Ask who should receive the call: an instance means `include`; the class or one object means `extend`."
      }
    ]
  },
  {
    file: "content/ruby-backend-fresher/ruby-modules-basics/namespacing/complete-qa.json",
    slug: "ruby-namespacing-basics",
    beats: [
      {
        cue: "Define a namespace plainly",
        stage: "A constant gets a full name",
        spokenText: "Namespacing groups related Ruby constants under another class or module. If `Charge` is defined inside `module Payments`, its full name is `Payments::Charge`. The `::` operator separates the namespace from the nested constant. This prevents a top-level `Charge` name from having to represent every kind of charge in the application.",
      },
      {
        cue: "Show why the full name matters",
        stage: "One short name, two owners",
        spokenText: "A payment service and an order service may both need a class called `Charge`. `Payments::Charge` and `Orders::Charge` can exist together because they are different constants. The prefix prevents a collision and tells the reader which part of the system owns the class.",
        support: {
          type: "comparison",
          title: "Same short name, different identity",
          items: [
            {
              label: "Payments",
              value: "Payments::Charge",
              detail: "Represents money charged to a payment method.",
              tone: "blue"
            },
            {
              label: "Orders",
              value: "Orders::Charge",
              detail: "Can represent a charge connected to order fulfilment.",
              tone: "green"
            }
          ]
        }
      },
      {
        cue: "Demonstrate the two classes",
        stage: "The full path selects a class",
        spokenText: "The code uses the same final class name in two namespaces. Calling `Payments::Charge.new` selects the first constant, while `Orders::Charge.new` selects the second. Their instances are unrelated unless the program deliberately gives them a shared parent or module.",
        support: {
          type: "code",
          title: "Two Charge classes without a collision",
          language: "ruby",
          code: "module Payments\n  class Charge\n    def label\n      \"payment charge\"\n    end\n  end\nend\n\nmodule Orders\n  class Charge\n    def label\n      \"order charge\"\n    end\n  end\nend\n\nputs Payments::Charge.new.label\nputs Orders::Charge.new.label",
          caption: "The full constant path chooses which `Charge` class Ruby should use."
        }
      },
      {
        cue: "Connect naming to project structure",
        stage: "Namespaces show ownership",
        spokenText: "Libraries use a top-level namespace to avoid adding many global constants. Rails applications also commonly match a constant such as `Admin::UsersController` to an `admin/users_controller.rb` path. Keep namespaces purposeful and fairly shallow: they should show durable ownership, not repeat every folder in the project.",
        recallRule: "A namespace makes identity and ownership explicit: `Area::Name` avoids collisions and explains where the constant belongs."
      }
    ]
  }
];

for (const presentation of presentations) {
  const absolutePath = path.join(repoRoot, presentation.file);
  const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const question = document.questions?.find((entry) => entry.slug === presentation.slug);
  if (!question) throw new Error(`Question not found: ${presentation.slug}`);
  const speaking = question.answer?.sections?.find((section) => section.type === "speakable_answer");
  if (!speaking) throw new Error(`Interview answer not found: ${presentation.slug}`);

  speaking.answerSize = "compact";
  speaking.beats = presentation.beats;
  speaking.content = presentation.beats.map((beat) => beat.spokenText.trim()).join("\n\n");
  fs.writeFileSync(absolutePath, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Curated Interview Answer presentation for ${presentation.slug}.`);
}
