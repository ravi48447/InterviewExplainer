#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/ruby-oop-basics";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "classes-and-objects": {
    answerSize: "compact",
    direct: "A Ruby **class** defines behaviour and the shape of an object's state; an **object** is one instance of that class. Calling `Book.new(...)` creates an object and normally runs its `initialize` method. Instance variables such as `@title` belong to that object, while instance methods operate with that object as `self`.",
    quick: [
      "A class defines shared behaviour; an object is one instance of it.",
      "`.new` creates an instance and normally invokes `initialize`.",
      "Instance variables such as `@name` store per-object state.",
      "Instance methods run with the receiving object as `self`.",
      "Encapsulate state behind meaningful methods instead of exposing every field.",
    ],
    interview: [
      "- A class is Ruby's definition for a kind of object: it groups instance methods and gives instances a place to keep state. An object is one concrete instance. Two `Book` objects share the methods defined by `Book`, but each has its own instance variables such as `@title`.",
      "- For example, `Book.new('Clean Code')` creates a Book and invokes `initialize('Clean Code')`. `initialize` stores the title, and a method such as `label` reads that state. Calling `book.label` sends the `label` message to that particular object, so `self` inside the method is `book`.",
      "- Ruby classes are objects too: `Book.class` is `Class`. That is why a class can receive methods such as `.new` and can have class-level methods of its own. The ordinary methods written with `def label` are instance methods and cannot be called as `Book.label` without an instance.",
      "- A class should protect its valid state. An unrestricted writer for every instance variable can let callers create impossible objects. I expose a reader when outside code only needs observation and provide action methods such as `rename` or `deposit` when a change needs validation.",
      "- The useful model is that the class owns shared behaviour, each object owns its state, and public methods form the safe boundary between them.",
    ],
    deepTitle: "Creation, state, and message dispatch",
    deep: [
      "`Book.new` is a class-method call. The normal creation path allocates storage for a Book instance and invokes its private `initialize` method with the supplied arguments. `initialize` configures the new object's starting state; its own return value is not used as the result of `.new`, which returns the created object.",
      "An instance variable is attached to one object, not declared once for the whole class. If `first` and `second` are different Book instances, assigning `first`'s `@title` does not change `second`. An unread instance variable evaluates as `nil`, which is convenient but can hide a missed initialization unless the constructor establishes required values.",
      "A method call chooses behaviour through the receiver's class and ancestor chain. In `book.label`, `book` is the receiver and becomes `self` while the selected method runs. Local variables disappear with the method call; instance variables remain with the object.",
      "The public surface should describe what the object can do, not merely expose storage. `account.withdraw(20)` can reject a negative balance, log the operation, and preserve an invariant. Letting callers write `account.balance = -20` would make all of those rules optional.",
    ],
    visualType: "flow_diagram",
    visualTitle: "From class definition to one object",
    visual: fence("mermaid", [
      "flowchart LR",
      "  C[Book class: methods] -->|Book.new title| A[allocate Book object]",
      "  A -->|initialize title| O[object with @title]",
      "  O -->|book.label| M[label runs with book as self]",
      "  M --> R[returned label]",
    ]),
    codeTitle: "Two objects share methods, not state",
    code: [
      "class Book",
      "  attr_reader :title",
      "",
      "  def initialize(title)",
      "    @title = title",
      "  end",
      "",
      "  def label",
      "    \"Book: #{@title}\"",
      "  end",
      "end",
      "",
      "first = Book.new('Clean Code')",
      "second = Book.new('Refactoring')",
      "",
      "first.label                 # => 'Book: Clean Code'",
      "second.label                # => 'Book: Refactoring'",
      "first.class                 # => Book",
      "Book.class                  # => Class",
    ],
  },
  "inheritance": {
    answerSize: "standard",
    direct: "Ruby supports single class inheritance with `class Child < Parent`. The child receives accessible behaviour from its ancestor chain, may override a method, and can call the overridden implementation with `super`. Bare `super` forwards the current method's arguments and block; `super()` deliberately sends none. Use inheritance for a real substitutable 'is-a' relationship and modules or composition for reusable behaviour that is not one.",
    quick: [
      "`class Child < Parent` creates one direct class-inheritance relationship.",
      "Method lookup checks the receiver's class, then its ancestors.",
      "A child can override a method and use `super` to extend parent behaviour.",
      "Bare `super` forwards arguments and block; `super()` sends no arguments.",
      "Prefer composition or modules when the relationship is not truly 'is-a'.",
    ],
    interview: [
      "- Inheritance lets one Ruby class reuse and specialise the behaviour of another. `class Admin < User` makes `Admin` a subclass of `User`, so an Admin instance can use User's instance methods unless the subclass overrides them. Ruby allows one direct superclass, while included modules add shared behaviour to the ancestor chain.",
      "- For example, `User#greeting` can return a basic message and `Admin#greeting` can return `super + ' — admin'`. Ruby finds the Admin method first. When that method calls `super`, lookup continues after Admin and invokes the next matching implementation in the ancestor chain.",
      "- The form of `super` matters. Bare `super` forwards all arguments and the attached block from the current method. `super()` sends no arguments, and `super(name)` sends exactly the argument written. That difference commonly appears in constructors when a subclass needs to initialise both parent and child state.",
      "- Inheritance is safe only when every child can stand in for the parent without surprising callers. A `Square < Rectangle` design often fails when callers expect width and height to change independently. Reusing a few methods is not enough reason for an 'is-a' relationship; delegation or a mixin can keep the dependency smaller.",
      "- I choose inheritance for a stable subtype with the same contract, keep the hierarchy shallow, and inspect `Class.ancestors` when method lookup is unclear.",
    ],
    deepTitle: "Inheritance is an ordered lookup chain",
    deep: [
      "Ruby does not copy parent methods into the subclass. When a message is sent, it searches the receiver's singleton class, its class, included or prepended modules in their lookup order, then superclasses and their ancestors. `Admin.ancestors` exposes the effective chain and is often the fastest way to explain which implementation will run.",
      "Overriding places a method earlier in that search. `super` does not mean 'call a class named Parent'; it means 'continue searching for this method after the current owner'. That is why `super` also works cleanly with modules in the chain. Bare `super` preserves the current arguments and block, whereas `super()` is an explicit empty call.",
      "Constructors are ordinary methods in this model. If a subclass defines `initialize`, the parent's initializer does not run automatically. The subclass calls `super` with the parent inputs, then establishes its own state. Missing that step often leaves inherited methods reading unset instance variables.",
      "The design boundary is substitutability. A subclass should preserve what callers rely on: accepted inputs, meaningful outputs, and object invariants. If the child merely needs a helper service or one capability, composition and module inclusion avoid coupling its entire identity to a parent implementation.",
    ],
    visualType: "flow_diagram",
    visualTitle: "Method lookup and super",
    visual: fence("mermaid", [
      "sequenceDiagram",
      "  participant C as caller",
      "  participant A as Admin#greeting",
      "  participant U as User#greeting",
      "  C->>A: admin.greeting",
      "  A->>U: super continues lookup",
      "  U-->>A: 'Hello Ravi'",
      "  A-->>C: 'Hello Ravi — admin'",
    ]),
    codeTitle: "Override one method and extend it with super",
    code: [
      "class User",
      "  def initialize(name)",
      "    @name = name",
      "  end",
      "",
      "  def greeting",
      "    \"Hello #{@name}\"",
      "  end",
      "end",
      "",
      "class Admin < User",
      "  def initialize(name, area)",
      "    super(name)                 # send the parent exactly one argument",
      "    @area = area",
      "  end",
      "",
      "  def greeting",
      "    \"#{super} — admin for #{@area}\"",
      "  end",
      "end",
      "",
      "Admin.new('Ravi', 'billing').greeting",
      "# => 'Hello Ravi — admin for billing'",
      "Admin.ancestors.first(2)        # => [Admin, User]",
    ],
  },
  "attr-accessor": {
    answerSize: "compact",
    direct: "`attr_reader :name` defines a getter method, `attr_writer :name` defines a setter named `name=`, and `attr_accessor :name` defines both for the instance variable `@name`. They are method-generating conveniences, not special public fields. Use the narrowest access needed so important state changes can still pass through validation.",
    quick: [
      "`attr_reader :name` creates the instance method `name`.",
      "`attr_writer :name` creates the instance method `name=`.",
      "`attr_accessor :name` creates both methods around `@name`.",
      "These are generated methods, not direct access to a public field.",
      "Prefer a reader plus domain actions when writes need validation.",
    ],
    interview: [
      "- Ruby's attribute helpers generate ordinary instance methods. `attr_reader :name` creates a `name` getter that returns `@name`. `attr_writer :name` creates a `name=` setter, and `attr_accessor :name` creates both. They remove repetitive method definitions but do not change Ruby's object model.",
      "- For example, `class User; attr_accessor :name; end` is roughly the same as writing `def name; @name; end` and `def name=(value); @name = value; end`. Therefore `user.name = 'Ada'` is a method call to `name=`, even though assignment syntax makes it look like field access.",
      "- The choice should reflect the object's contract. A profile nickname may safely have a public accessor. A bank balance should normally expose only `attr_reader :balance` and change through `deposit` or `withdraw`, where the object can reject negative amounts and preserve its rules.",
      "- An accessor also has normal method visibility. It can be moved below `private` or named explicitly with `private :token=`. Reading an unassigned instance variable returns `nil`, so required state should still be established and validated in `initialize`.",
      "- I use `attr_reader` by default, add a writer only when arbitrary replacement is valid, and write a custom method when a state change carries business meaning.",
    ],
    deepTitle: "An attribute helper writes methods for you",
    deep: [
      "Ruby does not have a separate public-field mechanism behind these helpers. `attr_reader`, `attr_writer`, and `attr_accessor` are methods on `Module` that define instance methods in the class currently being built. The generated getter and setter participate in inheritance, visibility, overriding, and reflection like methods written with `def`.",
      "Setter syntax has one special visual rule: `account.balance = 10` still sends the message `balance=` with `10`. A custom setter can normalise or reject the value, but relying on side effects inside assignment can be surprising because Ruby assignment expressions return the right-hand value.",
      "A reader is useful even when direct writing is unsafe. It lets callers observe state while the object remains responsible for transitions. `withdraw(amount)` can check that the amount is positive and affordable, then update `@balance` once. A raw balance writer would let every caller bypass those conditions.",
      "Accessors can be inherited or overridden. If a subclass needs a different representation, it may redefine the method without changing callers. That is another reason to think of `name` as a public message rather than a promise that an instance variable with the same spelling will always exist.",
    ],
    visualType: "comparison_table",
    visualTitle: "Pick the smallest public surface",
    visual: "| Helper | Methods created | Best fit |\n|---|---|---|\n| `attr_reader :name` | `name` | Outside code may inspect |\n| `attr_writer :name` | `name=` | Outside code may replace but not read |\n| `attr_accessor :name` | `name`, `name=` | Unrestricted read and write are both valid |\n| Custom action | Your chosen method | Validation or a business rule is required |",
    codeTitle: "Expose a balance without exposing arbitrary writes",
    code: [
      "class Account",
      "  attr_reader :balance",
      "",
      "  def initialize(balance = 0)",
      "    @balance = balance",
      "  end",
      "",
      "  def deposit(amount)",
      "    raise ArgumentError, 'amount must be positive' unless amount.positive?",
      "    @balance += amount",
      "  end",
      "end",
      "",
      "account = Account.new(100)",
      "account.balance              # => 100",
      "account.deposit(25)          # => 125",
      "account.balance              # => 125",
      "# account.balance = -1       # NoMethodError: no public writer",
    ],
  },
  "class-methods": {
    answerSize: "compact",
    direct: "A Ruby class method is a singleton method whose receiver is the class object, commonly defined with `def self.method_name`. Call it as `User.find(...)`, without creating a User first. Use class methods for operations that belong to the class as a whole—such as factories or named constructors—not for behaviour that needs one instance's `@state`.",
    quick: [
      "Define a class method with `def self.name` or inside `class << self`.",
      "Call it on the class object, such as `Invoice.from_json(data)`.",
      "An instance method is called on one instance and sees that instance's state.",
      "A class method's `self` is the class, so `@value` belongs to the class object.",
      "Use class methods for factories and class-wide operations, not unrelated utilities.",
    ],
    interview: [
      "- A class method is a method called on the class object itself rather than on an instance. The common syntax is `def self.from_cents(value) ... end`; callers use `Money.from_cents(250)` without first creating an object. Inside that method, `self` is the `Money` class object.",
      "- For example, a named constructor can convert external data and then call `new`: `Temperature.from_fahrenheit(68)` calculates Celsius and returns a Temperature. The conversion belongs with the type, while an instance method such as `temperature.celsius` works with one object's `@celsius` state.",
      "- `def self.name` defines one singleton method. A `class << self` block is convenient when several class methods need to be grouped. A class-level instance variable such as `@created` belongs to the class object; it is different from `@created` inside an instance and different from a class variable written `@@created`.",
      "- The boundary is responsibility and inheritance. A method that needs one order's items should be an instance method. A method that is only a generic calculation may belong in a service or module rather than becoming a large collection of unrelated class helpers. Class-instance variables are not automatically shared with subclasses.",
      "- I use a class method when the natural receiver is the type itself, especially for clear factories or lookups, and an instance method when behaviour belongs to one object.",
    ],
    deepTitle: "The class is also a receiver",
    deep: [
      "Ruby classes are instances of `Class`. This means `Report.generate` follows the same message-send model as `report.generate`; the difference is the receiver. `def self.generate` adds the method to that one class object's singleton class. Opening `class << self` exposes the same place for several definitions.",
      "State follows the receiver too. `@count` used by a class method is stored on the class object. `@count` used by an instance method is stored on that instance. They share a spelling but not a storage location. A subclass is a different class object, so it does not automatically receive the parent's class-instance-variable value even though class methods themselves may be inherited.",
      "Factories are a strong use case because they keep alternate construction rules next to the type. `.from_json`, `.parse`, or `.empty` can validate and translate input before returning a normal instance. The ordinary `.new` path remains available when callers already have constructor-ready values.",
      "Class methods are not a licence to turn a class into global state. Mutable configuration and counters on a widely used class create hidden coupling and concurrency concerns. Pass dependencies explicitly or use a dedicated object when the operation has its own lifecycle.",
    ],
    visualType: "comparison_table",
    visualTitle: "Class receiver versus instance receiver",
    visual: "| Call | Receiver | State naturally available | Typical use |\n|---|---|---|---|\n| `Money.from_cents(250)` | `Money` class object | Class-level state | Factory or lookup |\n| `money.format` | One `money` instance | That object's instance variables | Object behaviour |\n| `@count` in class method | Class object | Not instance `@count` | Use cautiously |\n| `@count` in instance method | One instance | Not class `@count` | Per-object state |",
    codeTitle: "A named constructor is a focused class method",
    code: [
      "class Temperature",
      "  attr_reader :celsius",
      "",
      "  def initialize(celsius)",
      "    @celsius = celsius",
      "  end",
      "",
      "  def self.from_fahrenheit(value)",
      "    new((value - 32) * 5.0 / 9)",
      "  end",
      "",
      "  def freezing?",
      "    @celsius <= 0",
      "  end",
      "end",
      "",
      "temperature = Temperature.from_fahrenheit(32)",
      "temperature.celsius          # => 0.0",
      "temperature.freezing?        # => true",
    ],
  },
  "duck-typing": {
    answerSize: "standard",
    direct: "Duck typing means Ruby code depends on the messages an object can handle rather than requiring one declared class or interface. A method that calls `notifier.deliver(message)` can work with Email, SMS, or a test double as long as each honours that contract. This gives flexible composition, but missing methods fail at runtime, so clear behaviour contracts and focused tests matter.",
    quick: [
      "Duck typing depends on supported behaviour, not a declared concrete type.",
      "Different objects can share a contract by responding to the same message.",
      "No inheritance relationship is required for that polymorphism.",
      "`respond_to?` can validate optional capabilities at a boundary.",
      "Runtime flexibility needs clear contracts and tests for every implementation.",
    ],
    interview: [
      "- Duck typing is Ruby's behaviour-first form of polymorphism. Code does not require a parameter to declare one concrete type; it sends the messages needed for the job. If several unrelated objects respond to those messages with the expected meaning, they can be used through the same method.",
      "- For example, `send_alert(notifier, message)` may call only `notifier.deliver(message)`. An `EmailNotifier`, `SmsNotifier`, and a small fake in a unit test can all work without inheriting from a common base class. The shared contract is the behaviour of `deliver`, including its arguments, return value, and errors.",
      "- This reduces coupling because the caller does not need to know how delivery works. It also fits Ruby's open object model and makes composition straightforward. Modules can document or share parts of a capability, but including one is not required for duck typing.",
      "- The boundary is that compatibility is checked at runtime. A misspelled method or incompatible argument shape raises an error only when that path executes. `respond_to?` is useful when a capability is genuinely optional or when validating a plugin, but checking it before every normal call often duplicates the contract without proving the behaviour is correct.",
      "- I keep duck-typed interfaces small, name the expected operation clearly, and run the same contract tests against each implementation. I use class checks only when the actual class is part of the business rule.",
    ],
    deepTitle: "A protocol can exist without an interface declaration",
    deep: [
      "The caller defines a protocol implicitly through the messages it sends. If a report exporter calls `open`, `write`, and `close`, any object with compatible implementations can participate. The protocol includes more than method names: argument forms, returned values, side effects, and failure behaviour must also line up.",
      "This is late binding. Ruby selects the method from the runtime receiver, so unrelated classes can provide interchangeable behaviour. Test doubles are simple for the same reason: a fake object needs the small protocol exercised by the test, not the full production class hierarchy.",
      "Flexibility moves some feedback from compile time to execution. A call may fail with `NoMethodError`, and a method with the right name can still have the wrong semantics. Shared examples or contract tests give every implementation the same behavioural checks. Static tooling or RBS signatures can add earlier feedback without changing Ruby's runtime dispatch.",
      "`respond_to?` asks whether an object reports a method, including `respond_to_missing?` for dynamic APIs. It is appropriate when the branch truly supports optional behaviour—for example, call `flush` only on writers that offer it. For a required capability, calling the method and testing the contract usually makes the failure clearer than scattering defensive checks.",
    ],
    visualType: "flow_diagram",
    visualTitle: "One message, several compatible receivers",
    visual: fence("mermaid", [
      "flowchart LR",
      "  A[send_alert] -->|deliver message| E[EmailNotifier]",
      "  A -->|deliver message| S[SmsNotifier]",
      "  A -->|deliver message| F[FakeNotifier in test]",
      "  E --> C[same small behaviour contract]",
      "  S --> C",
      "  F --> C",
    ]),
    codeTitle: "Depend on deliver, not on one notifier class",
    code: [
      "class EmailNotifier",
      "  def deliver(message)",
      "    \"email: #{message}\"",
      "  end",
      "end",
      "",
      "class SmsNotifier",
      "  def deliver(message)",
      "    \"sms: #{message}\"",
      "  end",
      "end",
      "",
      "def send_alert(notifier, message)",
      "  notifier.deliver(message)  # no class check",
      "end",
      "",
      "send_alert(EmailNotifier.new, 'build failed') # => 'email: build failed'",
      "send_alert(SmsNotifier.new, 'build failed')   # => 'sms: build failed'",
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
  question.reading_time_minutes = lesson.answerSize === "standard" ? 6 : 5;

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

console.log(`Curated ${Object.keys(lessons).length} Ruby OOP questions.`);
