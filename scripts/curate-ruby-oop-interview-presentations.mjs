#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const presentations = [
  {
    file: "content/ruby-backend-fresher/ruby-oop-basics/classes-and-objects/complete-qa.json",
    slug: "ruby-classes-and-objects-basics",
    answerSize: "compact",
    beats: [
      {
        cue: "Separate the definition from an instance",
        stage: "Class defines, object stores",
        spokenText: "A class defines the shared behaviour for a kind of object. An object is one instance of that class, with its own state. Two `Book` objects use the methods defined by `Book`, but each object keeps a different `@title`.",
        support: {
          type: "comparison",
          title: "Class and object have different jobs",
          items: [
            {
              label: "Class",
              value: "Book",
              detail: "Defines shared instance methods such as `label`.",
              tone: "blue",
            },
            {
              label: "Object",
              value: "Book.new",
              detail: "Keeps one book's state, such as its own `@title`.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Explain creation and self",
        stage: ".new creates one instance",
        spokenText: "Calling `Book.new(\"Clean Code\")` creates a `Book` object and normally runs `initialize`. The initializer stores the starting state. Later, `book.label` sends the `label` message to that object, and `self` inside the method refers to `book`.",
      },
      {
        cue: "Demonstrate shared methods and separate state",
        stage: "Each object keeps its state",
        spokenText: "In this complete example, both objects share the same `label` method while their `@title` values remain separate. `attr_reader` allows outside code to read the title without giving it unrestricted write access.",
        support: {
          type: "code",
          title: "Two Book objects, two titles",
          language: "ruby",
          code: "class Book\n  attr_reader :title\n\n  def initialize(title)\n    @title = title\n  end\n\n  def label\n    \"Book: #{@title}\"\n  end\nend\n\nfirst = Book.new(\"Clean Code\")\nsecond = Book.new(\"Refactoring\")\nputs first.label\nputs second.label",
          caption: "The method comes from the class; `@title` belongs to each object.",
        },
      },
      {
        cue: "State the design boundary",
        stage: "Methods protect valid state",
        spokenText: "Public methods should describe what an object can do, not only expose its storage. A method such as `account.withdraw(20)` can validate the change and preserve the object's rules. A class method such as `Book.new` belongs to the class, while an instance method such as `label` needs a particular object.",
        recallRule: "The class owns shared behaviour, each object owns its state, and public methods form the boundary between them.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/ruby-oop-basics/inheritance/complete-qa.json",
    slug: "ruby-inheritance-basics-oop",
    answerSize: "compact",
    beats: [
      {
        cue: "Define Ruby's inheritance relationship",
        stage: "One direct superclass",
        spokenText: "Inheritance lets one Ruby class reuse and specialise the behaviour of another. `class Admin < User` makes `Admin` a subclass of `User`. An Admin object can use User's instance methods unless Admin provides its own version. A Ruby class has one direct superclass, while modules can add more behaviour to its ancestor chain.",
      },
      {
        cue: "Explain lookup and overriding",
        stage: "Lookup follows ancestors",
        spokenText: "When Ruby receives `admin.greeting`, it looks for `greeting` from the most specific class through the ancestor chain. If `Admin#greeting` exists, it runs first. Calling `super` inside it continues that lookup and invokes the next matching implementation; it does not name a particular parent class.",
        support: {
          type: "trace",
          title: "How an overridden method reaches its parent",
          items: [
            {
              label: "Call",
              value: "admin.greeting",
              detail: "Ruby starts from the receiver's class.",
              tone: "blue",
            },
            {
              label: "Admin",
              value: "greeting",
              detail: "The override runs first.",
              tone: "green",
            },
            {
              label: "super",
              value: "continue",
              detail: "Lookup moves to the next ancestor implementation.",
              tone: "orange",
            },
            {
              label: "User",
              value: "greeting",
              detail: "The parent result returns to Admin.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Show super with constructor and method arguments",
        stage: "super extends parent behaviour",
        spokenText: "The subclass can initialise its own state and still reuse the parent's work. Bare `super` forwards the current method's arguments and block. `super()` sends no arguments, while `super(name)` sends only the value written. The example uses the explicit form so the parent receives only `name`.",
        support: {
          type: "code",
          title: "A complete override using super",
          language: "ruby",
          code: "class User\n  def initialize(name)\n    @name = name\n  end\n\n  def greeting\n    \"Hello #{@name}\"\n  end\nend\n\nclass Admin < User\n  def initialize(name, area)\n    super(name)\n    @area = area\n  end\n\n  def greeting\n    \"#{super} — admin for #{@area}\"\n  end\nend\n\nputs Admin.new(\"Ravi\", \"billing\").greeting",
          caption: "`super(name)` initializes User state; bare `super` in `greeting` needs no arguments.",
        },
      },
      {
        cue: "State when inheritance is appropriate",
        stage: "Use a real is-a relationship",
        spokenText: "Use inheritance only when every child can safely stand in for the parent and keep the same contract. Reusing a few methods is not enough. If an object only needs one capability or helper, delegation or a module usually creates less coupling. Keep class hierarchies shallow and inspect `Admin.ancestors` when lookup is unclear.",
        recallRule: "Use inheritance for a true substitutable subtype; use `super` to continue lookup; prefer composition for simple code reuse.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/ruby-oop-basics/attr-accessor/complete-qa.json",
    slug: "ruby-attr-accessor-basics",
    answerSize: "compact",
    beats: [
      {
        cue: "Define the three attribute helpers",
        stage: "Helpers generate methods",
        spokenText: "Ruby's attribute helpers generate ordinary instance methods. `attr_reader :name` creates a getter named `name`, `attr_writer :name` creates a setter named `name=`, and `attr_accessor :name` creates both. They remove repetitive method definitions; they do not create a special kind of public field.",
        support: {
          type: "comparison",
          title: "Choose only the access the object needs",
          items: [
            {
              label: "attr_reader",
              value: "read",
              detail: "Creates `name`; callers can inspect the value.",
              tone: "blue",
            },
            {
              label: "attr_writer",
              value: "write",
              detail: "Creates `name=`; callers can replace the value.",
              tone: "orange",
            },
            {
              label: "attr_accessor",
              value: "both",
              detail: "Creates both methods when unrestricted access is valid.",
              tone: "green",
            },
            {
              label: "Custom method",
              value: "rules",
              detail: "Keeps validation inside a meaningful state change.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Explain assignment-shaped method calls",
        stage: "Setter syntax calls a method",
        spokenText: "`user.name = \"Ada\"` still calls the method `name=(\"Ada\")`, even though it looks like direct field assignment. The generated getter usually returns `@name`, and the setter stores a value in `@name`. Because they are normal methods, accessors can be inherited, overridden, or made private.",
      },
      {
        cue: "Show a narrow public state boundary",
        stage: "Expose the narrowest surface",
        spokenText: "A nickname may safely use `attr_accessor`, but a bank balance should not allow arbitrary replacement. The Account below exposes `balance` for reading and changes it through `deposit`, where the object can reject an invalid amount and preserve its rules.",
        support: {
          type: "code",
          title: "Read the balance; validate changes",
          language: "ruby",
          code: "class Account\n  attr_reader :balance\n\n  def initialize(balance = 0)\n    @balance = balance\n  end\n\n  def deposit(amount)\n    raise ArgumentError, \"amount must be positive\" unless amount.positive?\n    @balance += amount\n  end\nend\n\naccount = Account.new(100)\naccount.deposit(25)\nputs account.balance",
          caption: "There is no public `balance=` method, so callers cannot bypass `deposit` validation.",
        },
      },
      {
        cue: "State when a custom method is required",
        stage: "Write a method for real rules",
        spokenText: "Use `attr_reader` as a safe default and add a writer only when any replacement value is valid. Write a custom setter or a domain method when a change needs validation, normalisation, logging, or another business rule. Also initialise required state deliberately: reading an instance variable that was never assigned returns `nil`.",
        recallRule: "Reader for observation, accessor for safe free replacement, and a named method when changing state has rules.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/ruby-oop-basics/class-methods/complete-qa.json",
    slug: "ruby-class-methods-basics",
    answerSize: "compact",
    beats: [
      {
        cue: "Define a class method by its receiver",
        stage: "The class is the receiver",
        spokenText: "A class method is called on the class object rather than on one instance. Define one with `def self.from_cents(value)` and call it as `Money.from_cents(250)`. Inside that method, `self` is the `Money` class object. An instance method such as `money.format` instead receives one Money object as `self`.",
        support: {
          type: "comparison",
          title: "The receiver decides what state belongs here",
          items: [
            {
              label: "Class method",
              value: "Money.from_cents",
              detail: "The receiver is the `Money` class; useful for creation or class-wide work.",
              tone: "blue",
            },
            {
              label: "Instance method",
              value: "money.format",
              detail: "The receiver is one object; it naturally uses that object's state.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Use a named constructor as the practical example",
        stage: "Factories create instances",
        spokenText: "A factory or named constructor is a common class-method use. `Temperature.from_fahrenheit(68)` accepts a convenient external value, converts it, and calls `new` to return a normal Temperature object. The instance method `freezing?` then works with that object's `@celsius` value.",
        support: {
          type: "code",
          title: "A complete named-constructor example",
          language: "ruby",
          code: "class Temperature\n  attr_reader :celsius\n\n  def initialize(celsius)\n    @celsius = celsius\n  end\n\n  def self.from_fahrenheit(value)\n    new((value - 32) * 5.0 / 9)\n  end\n\n  def freezing?\n    @celsius <= 0\n  end\nend\n\ntemperature = Temperature.from_fahrenheit(32)\nputs temperature.celsius\nputs temperature.freezing?",
          caption: "The class method chooses how to build the object; instance methods use the finished object's state.",
        },
      },
      {
        cue: "Separate class-level and instance-level state",
        stage: "Class state is separate",
        spokenText: "An instance variable used by a class method, such as `@created`, belongs to the class object. It is not the same storage as `@created` inside an instance. It is also different from the class variable `@@created`. Subclasses inherit class methods, but they do not automatically share the parent's class-instance-variable value.",
      },
      {
        cue: "Choose a class method only for class responsibility",
        stage: "Choose the natural receiver",
        spokenText: "Use a class method when the natural receiver is the type itself, such as a factory, parser, or lookup. Use an instance method when the operation needs one object's state. A generic calculation that belongs to neither may fit a separate service or module better. Avoid turning class methods and mutable class state into hidden global dependencies.",
        recallRule: "Call the class for type-wide creation or lookup; call an instance for behaviour that belongs to one object's state.",
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
