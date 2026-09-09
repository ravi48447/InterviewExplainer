#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentPath = path.join(
  repoRoot,
  "content/java-backend-fresher/java-oop-fundamentals/classes-and-objects/complete-qa.json",
);
const requestedSlug = process.argv[2] ?? null;
const reviewedOn = "2026-09-09";
const lines = (...parts) => parts.join("\n");

const expectedQuestions = [
  ["classes-and-objects-001", "class-vs-object-in-java", "What is the difference between a class and an object in Java?"],
  ["classes-and-objects-002", "what-happens-in-memory-when-you-create-an-object-with-new", "What happens in memory when you create an object using the `new` keyword in Java?"],
  ["classes-and-objects-003", "reference-variable-vs-object-in-java", "What is the difference between a reference variable and the object it points to in Java?"],
  ["classes-and-objects-004", "instance-members-vs-static-members-in-java", "What is the difference between instance members and static members in a Java class?"],
];

const lessons = {
  "class-vs-object-in-java": {
    layout: "comparison",
    minutes: 9,
    direct: "A class declares a Java type: its instance fields, constructors, and methods. An object is a runtime instance of a class. One class can create many objects, and each object has its own instance-field values. Static members belong to the class rather than being copied into every object.",
    metaDescription: "Learn the difference between a Java class and object, how one class creates many independent instances, and where reference and static members fit.",
    quick: [
      "A class declares a type's fields, constructors, and methods.",
      "An object is one runtime instance of a class.",
      "Each object receives its own instance fields; objects do not share those values automatically.",
      "`Student student;` declares a reference variable but creates no Student object.",
      "`new Student(...)` creates an instance and returns a reference to it.",
    ],
    beats: [
      {
        cue: "Define the class as a type declaration",
        stage: "One type declaration",
        spokenText: "A class declares a Java type. It names the instance fields that hold state, the constructors that establish starting state, and the methods that define behavior. For example, a `Book` class can declare a `title` field and a `rename()` method. Writing that declaration does not create a particular book object.",
      },
      {
        cue: "Define an object as a runtime instance",
        stage: "Many runtime instances",
        spokenText: "An object is one runtime instance of a class. `new Book(\"Java\")` and `new Book(\"SQL\")` create two different Book objects. Both follow the same class declaration, but each has its own `title` value. Calling `first.rename(...)` changes the first object's field, not the second object's field.",
        support: {
          type: "comparison",
          title: "Declaration, instance, and reference",
          items: [
            { label: "Class", value: "Book", detail: "Declares the type's fields, constructors, and methods.", tone: "blue" },
            { label: "Object 1", value: "Book: Java", detail: "One runtime instance with its own title.", tone: "green" },
            { label: "Object 2", value: "Book: SQL", detail: "Another instance created from the same class.", tone: "green" },
            { label: "Reference", value: "first", detail: "A variable that can refer to an object; it is not the object itself.", tone: "orange" },
          ],
        },
      },
      {
        cue: "Separate declaration from object creation",
        stage: "A variable is not an object",
        spokenText: "`Book first;` declares a local reference variable but does not construct a Book. The local variable must be assigned before it can be read. After `first = new Book(\"Java\")`, it refers to an object. Writing `Book alias = first` copies that reference, so it still does not create a second object.",
      },
      {
        cue: "Explain which state is independent and which is shared",
        stage: "Instance and class state",
        spokenText: "Instance fields belong to individual objects, which is why two books can have different titles. A `static` field is different: the class has one such field regardless of how many instances exist. Class metadata and static state also exist at runtime, so 'a class takes no memory' is not an accurate definition.",
        recallRule: "A class declares one type; each new expression creates an object; a reference only points to an object; instance fields belong to each instance.",
      },
    ],
    deepTitle: "A type declaration can have many instances",
    deep: lines(
      "**Class declaration and runtime object**",
      "",
      "A class is a program declaration that introduces a reference type. It can declare fields, constructors, methods, nested types, and initialization code. An object is a class instance created while the program runs. The object's class determines which instance fields it contains and which instance methods can be selected for it.",
      "",
      "Calling `new Book(\"Java\")` evaluates a class-instance creation expression. It creates a fresh Book object each time it runs. Two objects made from one class have the same declared structure, but their instance variables are separate. Updating the title stored in one Book does not update another Book unless both variables actually refer to the same object.",
      "",
      "**Variables hold references**",
      "",
      "A variable whose type is `Book` can hold a reference to a compatible object or `null`. The declaration `Book selected;` creates no Book instance. A later assignment can store the result of `new`, copy a reference from another variable, or store `null`. Copying a reference creates another route to the same object; it does not copy the object's fields.",
      "",
      "This is why class, object, and reference are three related but different ideas. The class defines the type, the object carries runtime instance state, and a variable holds a value that can refer to an object.",
      "",
      "**Class-level state**",
      "",
      "A static field has one incarnation for the class even when the class has no instances. An instance field is created for every new instance, including inherited instance fields. Static methods are invoked without a particular current object, while instance methods run with a current object available as `this`.",
      "",
      "The familiar blueprint analogy can introduce the topic, but it should not be taken literally. A loaded class has runtime metadata, a corresponding `Class` object, and possibly static fields. The precise distinction is type declaration versus class instance, not 'memory-free blueprint' versus 'real object'.",
    ),
    codeTitle: "One class and two independent objects",
    code: lines(
      "```java",
      "class ClassAndObjectDemo {",
      "    static final class Book {",
      "        private String title;",
      "",
      "        Book(String title) {",
      "            this.title = title;",
      "        }",
      "",
      "        void rename(String newTitle) {",
      "            title = newTitle;",
      "        }",
      "",
      "        String label() {",
      "            return \"Book: \" + title;",
      "        }",
      "    }",
      "",
      "    public static void main(String[] args) {",
      "        Book first = new Book(\"Java\");",
      "        Book second = new Book(\"SQL\");",
      "",
      "        first.rename(\"Modern Java\");",
      "        System.out.println(first.label());",
      "        System.out.println(second.label());",
      "        System.out.println(first == second);",
      "    }",
      "}",
      "```",
      "",
      "The two objects use one class declaration but keep independent title fields. The final line is false because the variables refer to different objects.",
    ),
    followups: [
      "Does declaring a reference variable create an object?",
      "Can two variables refer to the same object?",
      "Which fields are copied into every object?",
      "How is a static field different from an instance field?",
    ],
  },

  "what-happens-in-memory-when-you-create-an-object-with-new": {
    layout: "lifecycle-timeline",
    minutes: 10,
    direct: "Evaluating `new Student(...)` allocates a fresh object, gives all instance fields their default values, evaluates the constructor arguments, and invokes the selected constructor, including superclass construction and instance initialization. The expression then produces a reference to the object. Java does not expose a portable numeric address or require a local reference to use one physical memory location.",
    metaDescription: "Follow the Java new expression from object allocation and default field values through constructor chaining to the returned object reference.",
    quick: [
      "Every evaluation of a class-instance `new` expression creates a fresh object.",
      "All instance fields, including inherited fields, first receive Java default values.",
      "Constructor arguments are evaluated from left to right before the selected constructor runs.",
      "Superclass construction and instance initialization occur before the subclass constructor body finishes.",
      "The result of the expression is a reference, not a numeric memory address exposed to Java code.",
    ],
    beats: [
      {
        cue: "Describe the fresh object created by new",
        stage: "Allocation and defaults",
        spokenText: "Every time Java evaluates `new Student(\"Asha\", 91)`, it creates a fresh Student object. Space is provided for the instance fields declared by Student and its superclasses, and those fields first receive default values such as `null`, `0`, and `false`. If allocation cannot be completed, object creation ends with `OutOfMemoryError`.",
      },
      {
        cue: "Put constructor argument evaluation in the right place",
        stage: "Arguments before constructor",
        spokenText: "After allocation and default initialization, Java evaluates the constructor arguments from left to right. It then invokes the selected constructor. This matters when an argument is a method call or has a side effect: the argument expression runs before the constructor body receives its value.",
      },
      {
        cue: "Explain superclass and instance initialization order",
        stage: "The constructor chain",
        spokenText: "Construction follows the superclass chain before the subclass constructor body completes. After the superclass constructor returns, the subclass's instance field initializers and instance initializer blocks run in source order, followed by the remaining body of the selected constructor. The constructor therefore establishes state in an object whose fields already had defaults.",
        support: {
          type: "trace",
          title: "Portable order of one new expression",
          items: [
            { label: "Allocate", value: "fresh object", detail: "Create storage for inherited and declared instance fields.", tone: "blue" },
            { label: "Default", value: "null, 0, false", detail: "Every instance field receives its Java default value.", tone: "blue" },
            { label: "Evaluate", value: "arguments left to right", detail: "Compute the values passed to the selected constructor.", tone: "orange" },
            { label: "Initialize", value: "superclass to subclass", detail: "Run the constructor chain, field initializers, initializer blocks, and constructor body.", tone: "green" },
            { label: "Return", value: "object reference", detail: "The new expression produces a reference to the fresh instance.", tone: "neutral" },
          ],
        },
      },
      {
        cue: "Explain the reference returned by the expression",
        stage: "A reference is produced",
        spokenText: "The value of the completed expression is a reference to the new object. `Student first = new Student(...)` stores that reference in `first`. A later `Student second = first` copies the reference, not the Student. Both variables can then reach the same object until one is reassigned.",
      },
      {
        cue: "Keep implementation details outside the language promise",
        stage: "Memory-model boundary",
        spokenText: "JVMs normally manage objects in heap storage, but Java source code does not receive a portable raw address, and the language does not promise that a local reference occupies a particular stack slot. Optimizations may change physical placement while preserving the same behavior. The reliable explanation is fresh instance, default fields, defined initialization order, and returned reference.",
        recallRule: "new means fresh object, default fields, evaluated arguments, constructor chain, then a reference result; raw addresses are not part of Java's source-level contract.",
      },
    ],
    deepTitle: "Object creation has a defined initialization order",
    deep: lines(
      "**Fresh storage and default field values**",
      "",
      "A class-instance creation expression creates a new object on every successful evaluation. The object contains a new instance variable for every instance field declared in its class and its superclasses. Before explicit initialization runs, each field receives its default: zero for numeric primitives, false for boolean, the null character for char, and `null` for references.",
      "",
      "Constructor arguments have not been evaluated when the JVM first checks whether the object can be allocated. After allocation and defaulting, argument expressions are evaluated from left to right. If one argument throws, evaluation stops and the constructor is not invoked.",
      "",
      "**Superclass-to-subclass initialization**",
      "",
      "The selected constructor starts a constructor chain. Unless it explicitly invokes another constructor with `this(...)`, it invokes a superclass constructor with `super(...)`, explicitly or implicitly. Superclass construction completes before the subclass performs its own instance field initializers and instance initializer blocks. Those subclass initializers run in source order, and then the rest of the subclass constructor body runs.",
      "",
      "This explains why a constructor can observe zero or `null` for a field that has no explicit initializer. It also explains why calling an overridable method from a constructor is risky: a subclass override can run before the subclass has finished initializing its own fields.",
      "",
      "**Reference result and reachability**",
      "",
      "When construction succeeds, the expression's value is a reference to the fresh object. Assigning that value to a variable does not place the object's fields inside the variable. Copying the reference creates an alias, while assigning `null` removes one route to the object. Garbage collection becomes possible only when the object is no longer reachable; `reference = null` is not a direct delete operation.",
      "",
      "The JVM specification describes runtime storage, but Java code should not depend on a numeric address or a fixed stack-versus-heap picture. Escape analysis and other optimizations may alter physical storage without changing these observable creation and reference rules.",
    ),
    codeTitle: "Defaults appear before constructor assignments",
    code: lines(
      "```java",
      "class NewExpressionDemo {",
      "    static class Person {",
      "        Person() {",
      "            System.out.println(\"1. Person constructor\");",
      "        }",
      "    }",
      "",
      "    static final class Student extends Person {",
      "        String name;",
      "        int marks;",
      "",
      "        Student(String name, int marks) {",
      "            System.out.println(\"2. defaults: \" + this.name + \", \" + this.marks);",
      "            this.name = name;",
      "            this.marks = marks;",
      "            System.out.println(\"3. initialized: \" + this.name + \", \" + this.marks);",
      "        }",
      "    }",
      "",
      "    public static void main(String[] args) {",
      "        Student student = new Student(\"Asha\", 91);",
      "        System.out.println(\"4. reference result: \" + student.name + \", \" + student.marks);",
      "    }",
      "}",
      "```",
      "",
      "The parent constructor runs before the Student constructor body. At the beginning of that body, fields without explicit initializers still show their default values.",
    ),
    followups: [
      "When do instance fields receive default values?",
      "In what order are constructor arguments evaluated?",
      "Why does the superclass constructor run before the subclass constructor body?",
      "Does assigning null immediately delete an object?",
    ],
  },

  "reference-variable-vs-object-in-java": {
    layout: "concept-explainer",
    minutes: 9,
    direct: "A reference variable holds either a reference to a compatible object or `null`; it is not the object itself. Several variables can refer to one object, so mutation through one alias is visible through the others. Reassigning one variable does not reassign another. `==` compares reference identity, while `equals()` follows the class's value-equality contract.",
    metaDescription: "Understand Java reference variables, object identity, aliasing, null, reassignment, pass-by-value, and the difference between == and equals().",
    quick: [
      "A reference variable contains a reference value or `null`, not the object's fields.",
      "Assigning `second = first` copies the reference and creates an alias, not a cloned object.",
      "Mutation through one alias is visible through every reference to that object.",
      "Reassigning one reference variable does not change another variable.",
      "`==` checks whether references identify the same object; `equals()` uses the class's equality rule.",
    ],
    beats: [
      {
        cue: "Define a reference value separately from an object",
        stage: "Reference versus object",
        spokenText: "A variable of class type holds a reference value or `null`; it does not contain the object's instance fields. In `Box first = new Box(10)`, `new Box(10)` creates the object and the value stored in `first` refers to it. Java does not expose that value for pointer arithmetic or as a portable numeric address.",
      },
      {
        cue: "Show how aliasing creates two routes to one object",
        stage: "Aliases share one object",
        spokenText: "After `Box alias = first`, the variables are separate but their reference values identify the same Box. If the Box is mutable, `alias.value = 20` changes that one object, so `first.value` also reads 20. Java did not copy the Box when it copied the reference.",
        support: {
          type: "trace",
          title: "References can share, move, or be null",
          items: [
            { label: "Create", value: "first → Box(10)", detail: "The new expression creates one object.", tone: "blue" },
            { label: "Alias", value: "alias → same Box", detail: "Copying the reference creates a second route to that object.", tone: "green" },
            { label: "Reassign", value: "first → Box(99)", detail: "Only first moves; alias still reaches the old Box.", tone: "orange" },
            { label: "No object", value: "empty → null", detail: "Using empty to access an instance member throws NullPointerException.", tone: "neutral" },
          ],
        },
      },
      {
        cue: "Separate reassignment from object mutation",
        stage: "Moving one variable",
        spokenText: "Mutation and reassignment are different operations. `alias.value = 20` changes an object's field. `first = new Box(99)` changes only the value stored in `first`; it does not move `alias`. The old Box remains reachable through alias, while first now reaches a different Box.",
      },
      {
        cue: "Explain identity and logical equality",
        stage: "Identity versus equality",
        spokenText: "`first == alias` asks whether both references identify the same object. `first.equals(alias)` calls a method whose contract is defined by the class. Object's default implementation also uses identity, but classes such as String, records, and many value types override it to compare logical content.",
      },
      {
        cue: "Connect references to Java parameter passing",
        stage: "References pass by value",
        spokenText: "Java always passes arguments by value. For an object argument, the copied value is a reference. A method can use that copy to mutate the shared object, but assigning the parameter to another object changes only the method's local copy. This is why a method can update `box.value` but cannot redirect the caller's variable by writing `box = new Box(...)`.",
        recallRule: "Copying a reference shares the object; mutating the object is visible through aliases; reassigning one reference changes only that variable.",
      },
    ],
    deepTitle: "Reference values create aliases, not object copies",
    deep: lines(
      "**Reference values and null**",
      "",
      "Objects and references are different values in Java's type system. An object is a class instance with identity and fields. A variable of reference type can store a reference to a compatible object or the special null reference. The null reference denotes no object, so using it as the target of an instance field access or method call causes `NullPointerException`.",
      "",
      "The language specification sometimes describes references as pointers, but Java source does not expose C-style pointer arithmetic or a portable object address. Code works with identity, field access, method calls, casts, and reference comparisons.",
      "",
      "**Aliasing and reassignment**",
      "",
      "There may be many references to the same object. If `second = first`, only the reference value is copied. A write through second can therefore be observed through first when both still identify the same mutable object. This is aliasing, and it is a major reason to control mutation and encapsulate fields.",
      "",
      "Reassignment changes a variable rather than an object. After `first = new Box(99)`, second can still refer to the earlier Box. Setting first to null likewise removes only that reference. The object remains usable through any other live alias.",
      "",
      "**Identity, equality, and method arguments**",
      "",
      "The `==` operator on references tests identity: either both values are null or both denote the same object. The `equals()` method can express logical equality. Object's inherited version is identity-based, while a class can override it, together with a compatible `hashCode()`, to compare meaningful field values.",
      "",
      "Method calls do not introduce pass-by-reference. Java copies every argument value into a parameter. When that value is an object reference, caller and method can reach the same object, so the method may mutate it. Reassigning the parameter affects only the parameter's copied reference and cannot reassign the caller's variable.",
    ),
    codeTitle: "Aliasing, reassignment, and equality",
    code: lines(
      "```java",
      "class ReferenceAndObjectDemo {",
      "    static final class Box {",
      "        int value;",
      "",
      "        Box(int value) {",
      "            this.value = value;",
      "        }",
      "",
      "        @Override",
      "        public boolean equals(Object other) {",
      "            return other instanceof Box box && value == box.value;",
      "        }",
      "",
      "        @Override",
      "        public int hashCode() {",
      "            return Integer.hashCode(value);",
      "        }",
      "    }",
      "",
      "    static void change(Box box) {",
      "        box.value = 20;       // mutates the caller's object",
      "        box = new Box(99);    // reassigns only the local parameter",
      "    }",
      "",
      "    public static void main(String[] args) {",
      "        Box first = new Box(10);",
      "        Box alias = first;",
      "        change(first);",
      "        Box equalValue = new Box(20);",
      "",
      "        System.out.println(first.value);",
      "        System.out.println(first == alias);",
      "        System.out.println(first == equalValue);",
      "        System.out.println(first.equals(equalValue));",
      "    }",
      "}",
      "```",
      "",
      "The field update is visible to the caller, but assigning the parameter to Box(99) is not. The last two lines separate object identity from the class's value equality.",
    ),
    followups: [
      "What happens when one reference variable is assigned to another?",
      "How is reassigning a reference different from mutating an object?",
      "What is the difference between == and equals() for objects?",
      "Why is Java still pass-by-value for object arguments?",
    ],
  },

  "instance-members-vs-static-members-in-java": {
    layout: "comparison",
    minutes: 10,
    direct: "Each object has its own instance fields, and an instance method runs for a particular object with `this` available. A static field has one incarnation for the class, and a static method runs without a current object or `this`. Access static members through the class name and keep mutable static state carefully controlled.",
    metaDescription: "Compare Java instance and static fields and methods, including per-object state, the current this reference, class-level state, and common boundaries.",
    quick: [
      "Every object gets its own copy of each instance field.",
      "An instance method runs for a current object, available as `this`.",
      "A static field has one incarnation for the class, even when no objects exist.",
      "A static method has no `this` and cannot directly use an instance member without an object reference.",
      "Use instance state for object data; use static mainly for constants or behavior that truly belongs to the class.",
    ],
    beats: [
      {
        cue: "Define instance members by object ownership",
        stage: "Per-object state",
        spokenText: "An instance field belongs to one object. If two Ticket objects have an `owner` field, each ticket stores its own owner. An instance method such as `ticket.label()` runs for that particular ticket, and `this.owner` means the owner field of the current object.",
      },
      {
        cue: "Define static members by class ownership",
        stage: "One class-level member",
        spokenText: "A static field has one incarnation for the class regardless of how many objects are created. `Ticket.issuedCount` can therefore count all tickets. A static method such as `Ticket.totalIssued()` is invoked without choosing a Ticket object, so it has no current `this` reference.",
        support: {
          type: "comparison",
          title: "Who owns the member?",
          items: [
            { label: "Instance field", value: "one per object", detail: "Each Ticket keeps its own number and owner.", tone: "blue" },
            { label: "Instance method", value: "has this", detail: "Runs against the current object and can directly use its fields.", tone: "green" },
            { label: "Static field", value: "one for the class", detail: "Shared class-level state exists even with zero instances.", tone: "orange" },
            { label: "Static method", value: "no this", detail: "Uses static members directly and needs an explicit object for instance members.", tone: "neutral" },
          ],
        },
      },
      {
        cue: "Show the access rule inside a static method",
        stage: "No implicit object",
        spokenText: "Because a static method has no current object, it cannot directly read `owner` or call an instance method. It can do so only through a reference, for example `ticket.label()`. An instance method can access both its instance members and static members, although static access is clearer through `Ticket.issuedCount`.",
      },
      {
        cue: "Connect ownership to practical design choices",
        stage: "Pick state by ownership",
        spokenText: "Use instance fields when values describe each object, such as a ticket's owner. Use static final fields for constants and static methods for operations that need no current object. Mutable static fields are shared state, so tests, threads, and multiple callers can affect one another unless the design controls updates.",
      },
      {
        cue: "Clarify dispatch and class-loader boundaries",
        stage: "Advanced boundaries",
        spokenText: "Instance methods can be overridden and use runtime dispatch. Static methods are hidden rather than overridden and are selected from the reference's compile-time type. In ordinary code there is one static field for the class; in advanced systems, classes loaded by different class loaders are different runtime classes and can have separate static state.",
        recallRule: "Instance means a current object and per-object state; static means class-level membership with no current object.",
      },
    ],
    deepTitle: "Member ownership determines state and access",
    deep: lines(
      "**Instance fields and the current object**",
      "",
      "Whenever Java creates an object, it creates an instance variable for every instance field declared in that class and its superclasses. Two Account objects therefore have two separate balance fields. An instance method is invoked with respect to an object; during the call, that object is available as `this`. This allows the method to read or change the current object's fields directly.",
      "",
      "An instance method can also call other instance methods, and normal overriding applies. If a parent-typed reference identifies a child object, an overridden instance method is selected using the runtime object's class.",
      "",
      "**Static fields and methods**",
      "",
      "A static field has exactly one incarnation for the class, no matter how many instances are eventually created. It is created as part of class initialization and can exist before the program creates any object of that class. This makes `static final` useful for constants and makes mutable static fields global state within that runtime class.",
      "",
      "A static method is a class method. It is called without a particular receiver object and cannot use `this` or `super`. It can access static members directly. To use an instance field or method, it must receive, create, or otherwise obtain an object reference.",
      "",
      "Static methods do not participate in runtime overriding. A subclass can declare a static method with the same signature, but that is method hiding; the compile-time type used at the call site determines which declaration is selected.",
      "",
      "**Shared-state boundary**",
      "",
      "Static state is not automatically thread-safe. A shared counter such as `nextId++` can lose updates when several threads use it at the same time. Use an atomic type, synchronization, or a design that avoids process-wide mutable state when concurrency matters. Static mutable values can also leak between tests unless they are reset.",
      "",
      "The phrase 'one per class' assumes one runtime class identity. Two class loaders can load separate classes with the same binary name, and each loaded class then has its own static state. Most fresher code does not need this detail, but it explains why 'one per JVM' is too broad.",
    ),
    codeTitle: "Per-ticket fields and one shared counter",
    code: lines(
      "```java",
      "class MemberKindsDemo {",
      "    static final class Ticket {",
      "        private static int issuedCount;",
      "        private final int number;",
      "        private String owner;",
      "",
      "        Ticket(String owner) {",
      "            this.number = ++issuedCount;",
      "            this.owner = owner;",
      "        }",
      "",
      "        String label() {",
      "            return number + \": \" + owner;",
      "        }",
      "",
      "        static int totalIssued() {",
      "            return issuedCount;",
      "        }",
      "    }",
      "",
      "    public static void main(String[] args) {",
      "        Ticket first = new Ticket(\"Asha\");",
      "        Ticket second = new Ticket(\"Ravi\");",
      "",
      "        System.out.println(first.label());",
      "        System.out.println(second.label());",
      "        System.out.println(Ticket.totalIssued());",
      "    }",
      "}",
      "```",
      "",
      "Each Ticket keeps its own number and owner. The static counter is shared by the class and gives the two instances different numbers.",
    ),
    followups: [
      "Why can a static method not use this?",
      "Can an instance method access a static field?",
      "Are mutable static fields automatically thread-safe?",
      "Are static methods overridden in Java?",
    ],
  },
};

const document = JSON.parse(fs.readFileSync(contentPath, "utf8"));
if (document.topicSlug !== "classes-and-objects" || !Array.isArray(document.questions)) {
  throw new Error("Unexpected classes-and-objects document shape.");
}
const actualIdentity = document.questions.map(({ id, slug, question }) => [id, slug, question]);
if (JSON.stringify(actualIdentity) !== JSON.stringify(expectedQuestions)) {
  throw new Error(`Question identity drift:\n${JSON.stringify(actualIdentity, null, 2)}`);
}
if (requestedSlug && !Object.hasOwn(lessons, requestedSlug)) {
  throw new Error(`Unknown target slug: ${requestedSlug}`);
}

for (const question of document.questions) {
  if (requestedSlug && question.slug !== requestedSlug) continue;
  const lesson = lessons[question.slug];
  if (!lesson) throw new Error(`Missing authored lesson for ${question.slug}`);

  question.direct_answer = lesson.direct;
  question.layout_type = lesson.layout;
  question.difficulty = "easy";
  question.importance = "high";
  question.reading_time_minutes = lesson.minutes;
  question.last_updated = reviewedOn;
  delete question.interviewer_intent;
  delete question.speakable_v2;

  question.answer = {
    sections: [
      { type: "key_points", title: "Quick revision", items: lesson.quick },
      {
        type: "speakable_answer",
        title: "Interview answer",
        answerSize: "standard",
        beats: lesson.beats,
        content: lesson.beats.map((beat) => beat.spokenText).join("\n\n"),
      },
      { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep },
      { type: "code_example", title: lesson.codeTitle, content: lesson.code },
    ],
  };
  question.followup_questions = lesson.followups;
  question.seo = {
    metaTitle: `${question.title} | Java Interview Questions`,
    metaDescription: lesson.metaDescription,
  };
}

fs.writeFileSync(contentPath, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${requestedSlug ? 1 : expectedQuestions.length} classes-and-objects lesson${requestedSlug ? "" : "s"}.`);
