#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const questionFile = path.join(
  repoRoot,
  "content/python-backend-fresher/type-hints-basics/dataclasses-typed/complete-qa.json",
);
const presentations = {
  "python-dataclasses-typed": {
    answerSize: "standard",
    beats: [
    {
      cue: "Define what the decorator changes",
      stage: "A class without boilerplate",
      spokenText: "A dataclass is still a normal Python class. Adding `@dataclass` asks Python to build routine methods from the fields declared in the class. With `name: str` and `price: float`, it normally creates an `__init__` that accepts those values, a useful `__repr__`, and value-based `__eq__`. The class can still contain ordinary methods and properties.",
    },
    {
      cue: "Connect annotations to fields and tools",
      stage: "Hints describe every field",
      spokenText: "Annotations such as `name: str` tell the decorator which names are instance fields. They also tell editors and static type checkers what values are expected. A checker can flag `Product(name=42, price=\"free\")`, and an IDE can offer completion for the attributes. This makes the model easier to understand and check before it runs.",
      support: {
        type: "comparison",
        title: "What the type hint changes",
        items: [
          {
            label: "Static tools",
            value: "Check expected types",
            detail: "A type checker can report the wrong argument or attribute type before the program runs.",
            tone: "blue",
          },
          {
            label: "Python at runtime",
            value: "Assigns the value",
            detail: "A dataclass does not automatically reject a value merely because it conflicts with its hint.",
            tone: "orange",
          },
        ],
      },
    },
    {
      cue: "Explain field order and mutable defaults",
      stage: "Defaults need clear ownership",
      spokenText: "Field order becomes constructor order, and required fields must come before fields with defaults. A collection should use `field(default_factory=list)` so every object receives its own list. Options such as `slots=True`, `kw_only=True`, `order=True`, and `frozen=True` change the generated behaviour. `frozen` prevents normal field reassignment, but it does not make a nested list immutable.",
    },
    {
      cue: "Show generated and custom behaviour together",
      stage: "A complete typed data model",
      spokenText: "`Product(\"Keyboard\", 75.0)` uses the generated constructor, while `discounted()` is a normal method written by the developer. The example also gives each product a fresh `tags` list. The hints document the intended values, but data from JSON, a form, or another external source still needs separate parsing or runtime validation.",
      support: {
        type: "code",
        title: "A dataclass can hold data and behaviour",
        language: "python",
        code: "from dataclasses import dataclass, field\n\n@dataclass(slots=True)\nclass Product:\n    name: str\n    price: float\n    tags: list[str] = field(default_factory=list)\n\n    def discounted(self, percent: float) -> float:\n        return self.price * (1 - percent / 100)\n\nkeyboard = Product(\"Keyboard\", 75.0)\nkeyboard.tags.append(\"hardware\")\nprint(keyboard)\nprint(keyboard.discounted(20))",
        caption: "The decorator supplies the constructor, representation, and equality; the method remains ordinary Python code.",
      },
    },
    {
      cue: "Set the boundary with a regular class",
      stage: "Best for data-focused objects",
      spokenText: "A dataclass fits an object with a fixed set of fields, useful value equality, and light behaviour. A hand-written class is clearer when construction has several steps, invariants must always be enforced, or the public API should hide the stored state. `__post_init__` can calculate derived fields or perform simple checks, but it does not turn annotations into automatic type validation.",
      recallRule: "Use a dataclass to remove data-model boilerplate, and use separate validation whenever runtime values must be checked.",
    },
    ],
  },
  "type-hints-basics-dataclasses-typed-when-to-use": {
    answerSize: "standard",
    beats: [
      {
        cue: "Match the representation to the data shape",
        stage: "Fixed records fit dataclasses",
        spokenText: "Choose a dataclass when a value is mainly a record with a stable set of named fields. It provides a generated constructor, readable representation, and value-based equality while remaining a real class. That is a natural fit for an `InvoiceLine` with `description`, `quantity`, and `unit_price`.",
        support: {
          type: "comparison",
          title: "Match the model to the job",
          items: [
            {
              label: "Dataclass",
              value: "fixed record",
              detail: "Named fields, useful value equality, and a small amount of behaviour.",
              tone: "green",
            },
            {
              label: "Regular class",
              value: "controlled object",
              detail: "Custom construction, hidden state, and invariants enforced through methods.",
              tone: "blue",
            },
            {
              label: "Dictionary",
              value: "dynamic mapping",
              detail: "Keys may change, and lookup, iteration, or serialization is the main operation.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Show that a data record may contain behaviour",
        stage: "Records can still have methods",
        spokenText: "A dataclass is not limited to passive fields. `line.total()` can keep a calculation beside the data it uses, and `frozen=True` can prevent normal field reassignment when the record should not change. The generated methods remove routine code; they do not stop the class from having its own methods and properties.",
        support: {
          type: "code",
          title: "A fixed record with one useful method",
          language: "python",
          code: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass InvoiceLine:\n    description: str\n    quantity: int\n    unit_price: float\n\n    def total(self) -> float:\n        return self.quantity * self.unit_price\n\nline = InvoiceLine(\"Notebook\", 3, 4.5)\nprint(line.description, line.total())",
          caption: "The shape is fixed, and the calculation naturally belongs to that record.",
        },
      },
      {
        cue: "Explain when generated public fields are too open",
        stage: "Use a class for control",
        spokenText: "Choose a regular class when object creation has several steps, inputs must be transformed before storage, or every state change must protect an invariant. For example, a bank account may expose `deposit()` and `withdraw()` instead of allowing callers to assign `balance` directly. A custom constructor, factory methods, and private state make that boundary clearer.",
      },
      {
        cue: "Keep mapping-shaped data as a mapping",
        stage: "Mappings suit changing keys",
        spokenText: "Choose a normal dictionary when keys are discovered at runtime or mapping operations are the point of the value. `TypedDict` can describe a fixed dictionary shape to a static checker, but the runtime value is still a plain `dict`; it does not gain generated constructors, equality rules, or instance methods from that annotation.",
      },
      {
        cue: "Separate representation from input validation",
        stage: "Validation stays separate",
        spokenText: "A dataclass, regular type hints, and `TypedDict` do not automatically prove that decoded JSON contains safe values. Parse and validate untrusted input first, then create the representation that best matches how the program will use it. The choice is about data shape, ownership, and behaviour rather than which syntax is shortest.",
        recallRule: "Use a dataclass for a fixed data record, a class for controlled behaviour, and a dictionary for genuinely dynamic keys.",
      },
    ],
  },
  "type-hints-basics-dataclasses-typed-common-mistake": {
    answerSize: "compact",
    beats: [
      {
        cue: "Explain why the time of creation matters",
        stage: "A default needs one owner",
        spokenText: "A list written directly in a class body is created when the class is defined, not each time an object is constructed. Reusing that object would make several instances point to the same list. Dataclasses reject many mutable or unhashable direct defaults because this accidental shared state is almost never the intended meaning of a field.",
        support: {
          type: "trace",
          title: "One factory call for each new object",
          items: [
            {
              label: "Class is defined",
              value: "store list",
              detail: "The field keeps the callable rather than a list object.",
              tone: "blue",
            },
            {
              label: "First Task is created",
              value: "list A",
              detail: "The generated initializer calls `list()` for the first instance.",
              tone: "green",
            },
            {
              label: "Second Task is created",
              value: "list B",
              detail: "A separate call creates a different list for the second instance.",
              tone: "green",
            },
          ],
        },
      },
      {
        cue: "Distinguish the callable from its result",
        stage: "Pass the callable itself",
        spokenText: "Write `tags: list[str] = field(default_factory=list)`. The value of `default_factory` is the zero-argument function `list`, not the result of calling `list()`. The generated initializer calls that function only when the caller leaves out `tags`; an explicitly supplied list is used as given.",
      },
      {
        cue: "Prove that two instances own different lists",
        stage: "Each instance gets a new list",
        spokenText: "With a factory, appending `\"urgent\"` to `first.tags` does not change `second.tags`. The two fields contain equal empty lists at first, but they are different objects. That identity check is the clearest small test of whether the default is safely owned by each instance.",
        support: {
          type: "code",
          title: "Two tasks receive two lists",
          language: "python",
          code: "from dataclasses import dataclass, field\n\n@dataclass\nclass Task:\n    title: str\n    tags: list[str] = field(default_factory=list)\n\nfirst = Task(\"Deploy\")\nsecond = Task(\"Document\")\nfirst.tags.append(\"urgent\")\n\nprint(first.tags)\nprint(second.tags)\nprint(first.tags is second.tags)",
          caption: "The output is `['urgent']`, `[]`, and `False`: the lists are independent.",
        },
      },
      {
        cue: "Cover richer defaults and constructor order",
        stage: "Factories build richer values",
        spokenText: "Use a lambda such as `lambda: [\"new\"]` when each instance needs a fresh non-empty value. Immutable values such as numbers and strings can usually be direct defaults. A factory still makes the field optional in the generated constructor, so required fields must appear before it unless keyword-only field rules are used.",
        recallRule: "Pass a factory whenever each dataclass instance must receive its own newly created default value.",
      },
    ],
  },
};

const document = JSON.parse(fs.readFileSync(questionFile, "utf8"));
let curated = 0;

for (const [targetSlug, presentation] of Object.entries(presentations)) {
  const matches = document.questions.filter((question) => question.slug === targetSlug);

  if (matches.length !== 1) {
    throw new Error(`Expected exactly one ${targetSlug} question, found ${matches.length}`);
  }

  const question = matches[0];
  const speakable = question.answer?.sections?.find(
    (section) => section.type === "speakable_answer",
  );

  if (!speakable) {
    throw new Error(`Missing speakable_answer section for ${targetSlug}`);
  }

  speakable.answerSize = presentation.answerSize;
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats
    .map((beat) => beat.spokenText.trim())
    .join("\n\n");
  curated += 1;
}

fs.writeFileSync(questionFile, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated Interview Answer presentations for ${curated} dataclass questions`);
