const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'interviewexplainer',
  user: 'interviewexplainer',
  password: 'changeme',
});

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function uniqueSlug(client, base) {
  let slug = base, n = 2;
  while (true) {
    const r = await client.query('SELECT id FROM questions WHERE slug=$1', [slug]);
    if (r.rows.length === 0) return slug;
    slug = `${base}-${n++}`;
  }
}

async function getOrCreateConcept(client, name) {
  const slug = toSlug(name);
  const existing = await client.query('SELECT id FROM concepts WHERE slug=$1', [slug]);
  if (existing.rows.length > 0) return existing.rows[0].id;
  const r = await client.query('INSERT INTO concepts(name,slug) VALUES($1,$2) RETURNING id', [name, slug]);
  return r.rows[0].id;
}

const QUESTIONS = {
  'java-8': [
    {
      title: 'What are the main features introduced in Java 8',
      metaTitle: 'Java 8 Features Explained: Lambdas, Streams, Optional',
      metaDesc: 'A comprehensive guide to the main features introduced in Java 8, including Lambda expressions, Streams API, and Optional.',
      concepts: ['Java 8', 'Lambda Expressions', 'Stream API', 'Optional'],
      quiz: { q: 'Which feature in Java 8 is used to handle NullPointerException gracefully?', opts: ['Lambda Expressions', 'Stream API', 'Optional', 'Default Methods'], ans: 'Optional' },
      sections: {
        interviewer_expectation: `Java 8 was a massive shift in the language. Interviewers expect 1-3 year developers to thoroughly understand these features and use them daily. \n\nKey expectations:\n- Ability to list the major features (Lambdas, Streams, Optional, Default methods, New Date/Time API).\n- Understanding *why* these features were introduced (functional programming paradigms, boilerplate reduction, null safety).\n- Real-world examples of where you've used them (e.g., transforming lists with streams, avoiding NPEs with Optional).`,
        core_concepts: `**1. Lambda Expressions:** Anonymous functions that allow you to treat functionality as a method argument, or code as data. They provide a clear and concise way to implement Single Abstract Method (SAM) interfaces (Functional Interfaces).\n\n**2. Stream API:** A new abstraction that lets you process collections of data in a declarative way. Streams support functional-style operations like map, filter, and reduce.\n\n**3. Optional Class:** A container object which may or may not contain a non-null value. It was introduced to deal with NullPointerException (NPE) and forces you to explicitly handle the absence of a value.\n\n**4. Default Methods in Interfaces:** Interfaces can now have method implementations. This allowed adding new methods to interfaces like \`Collection\` (e.g., \`stream()\`) without breaking existing implementations.\n\n**5. New Date and Time API:** A complete rewrite of date/time handling (java.time package) replacing the flawed \`java.util.Date\`. It is immutable and thread-safe.`,
        important_points: `- **Lambdas** only work with **Functional Interfaces** (interfaces with exactly one abstract method).\n- **Streams** do not modify the underlying collection; they produce a new result.\n- Streams evaluate **lazily**, meaning computation on the source data is only performed when the terminal operation is initiated.\n- **Optional** should primarily be used as a return type. It's generally considered an anti-pattern to use it as a method parameter or a class field.\n- The new **Date/Time API** uses the ISO-8601 calendar system by default.`,
        code_example: `\`\`\`java
import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;

public class Java8Demo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

        // 1. Lambda & Stream API
        List<String> aNames = names.stream()
            .filter(name -> name.startsWith("A")) // Lambda
            .collect(Collectors.toList());
        System.out.println("Names starting with A: " + aNames);

        // 2. Optional
        Optional<String> optionalName = findName("Eve", names);
        String greeting = optionalName.map(name -> "Hello, " + name)
                                      .orElse("Name not found");
        System.out.println(greeting);

        // 3. New Date Time API
        LocalDate today = LocalDate.now();
        LocalDate futureDate = today.plusDays(5);
        System.out.println("Date in 5 days: " + futureDate);
    }

    private static Optional<String> findName(String query, List<String> names) {
        return names.stream()
                    .filter(name -> name.equals(query))
                    .findFirst();
    }
}
\`\`\``,
        speakable_answer: `Java 8 introduced several fundamental features that brought functional programming concepts to the language.\n\nThe most significant is Lambda Expressions, which allow us to write concise, anonymous functions, heavily reducing boilerplate code, especially when working with Functional Interfaces. \n\nPaired with Lambdas is the Stream API, which provides a declarative way to process collections. Instead of using for-loops, we can use operations like map, filter, and reduce to transform data. Streams evaluate lazily, which can improve performance.\n\nAnother major feature is the Optional class, designed to handle nulls gracefully and prevent NullPointerExceptions by forcing developers to check if a value is present. Java 8 also introduced default methods in interfaces, allowing backwards-compatible updates to the standard library, and a completely new, immutable, thread-safe Date and Time API in the java.time package.`,
        followup_questions: `- What is a Functional Interface?\n- Can you explain the difference between intermediate and terminal operations in Streams?\n- Why shouldn't you use Optional as a class field?\n- What problem do Default Methods solve?\n- How does the new Date/Time API differ from java.util.Date?`,
      }
    },
    {
      title: 'How does the Stream API work in Java 8',
      metaTitle: 'Java 8 Stream API: Intermediate vs Terminal Operations',
      metaDesc: 'A detailed look at the Java 8 Stream API, explaining how intermediate and terminal operations process data collections.',
      concepts: ['Stream API', 'Java 8', 'Functional Programming'],
      quiz: { q: 'Which of the following is an intermediate operation in the Stream API?', opts: ['collect()', 'forEach()', 'filter()', 'count()'], ans: 'filter()' },
      sections: {
        interviewer_expectation: `The Stream API is a daily tool for modern Java developers. Interviewers will look for:\n\n- Clarity on the difference between intermediate and terminal operations.\n- Understanding of lazy evaluation and why it matters for performance.\n- Ability to chain common operations (filter, map, collect, reduce).\n- Knowing that streams are single-use objects.`,
        core_concepts: `**What is a Stream?**\nA Stream is a sequence of elements supporting sequential and parallel aggregate operations. It is not a data structure; it takes input from Collections, Arrays, or I/O channels.\n\n**Stream Pipeline Structure:**\nA stream pipeline consists of:\n1.  **A Source:** (e.g., a List, Set, or Array).\n2.  **Zero or more Intermediate Operations:** (e.g., \`filter()\`, \`map()\`, \`sorted()\`). These operations transform a stream into another stream.\n3.  **A Terminal Operation:** (e.g., \`collect()\`, \`forEach()\`, \`reduce()\`, \`count()\`). This operation produces a result or side-effect and finishes the pipeline.\n\n**Lazy Evaluation:**\nIntermediate operations are lazy. They are not executed until a terminal operation is invoked. This allows the JVM to optimize the pipeline, for example, by stopping early during a \`findFirst()\` operation.`,
        important_points: `- **Single-Use:** Once a terminal operation is called, the stream is considered "consumed" and cannot be reused. You must create a new stream from the source.\n- **Intermediate operations** always return a new Stream. \n- **Terminal operations** return a non-stream result (like a List, an Integer, or void).\n- Statefulness: Some intermediate operations (like \`sorted()\` or \`distinct()\`) require keeping state, which can impact performance, especially in parallel streams.\n- Parallel Streams (\`parallelStream()\`) can speed up processing for large datasets but introduce overhead and thread-safety concerns.`,
        code_example: `\`\`\`java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamDemo {
    public static void main(String[] args) {
        List<String> words = Arrays.asList("apple", "banana", "cherry", "date", "elderberry", "fig");

        // Example: Filter words longer than 5 chars, convert to uppercase, and collect to list
        List<String> longWordsUpper = words.stream() // 1. Source
            .filter(w -> { 
                System.out.println("Filtering: " + w); // Demonstrates lazy evaluation
                return w.length() > 5; 
            }) // 2. Intermediate
            .map(String::toUpperCase) // 2. Intermediate
            .collect(Collectors.toList()); // 3. Terminal

        System.out.println("Result: " + longWordsUpper);
        
        // Example: Reduce to find total length of all words
        int totalLength = words.stream()
            .mapToInt(String::length)
            .sum(); // sum() is a specialized terminal operation
            
        System.out.println("Total characters: " + totalLength);
    }
}
\`\`\``,
        speakable_answer: `The Java 8 Stream API provides a declarative way to process collections of objects. Instead of iterating with loops, you build a pipeline of operations.\n\nA stream pipeline always starts with a source, like a List. This is followed by zero or more intermediate operations, such as filter to keep elements matching a condition, or map to transform elements. These intermediate operations are lazy—they don't execute immediately. They just build up a recipe of what to do.\n\nThe pipeline is triggered by a terminal operation, like collect to gather the results into a new List, or reduce to calculate a single value. Once the terminal operation finishes, the stream is consumed and cannot be reused.\n\nThe laziness of intermediate operations is a huge performance benefit because the JVM can optimize the execution. For example, if your terminal operation is findFirst, the stream might only process the first few elements of a million-item list before stopping.`,
        followup_questions: `- What happens if you try to use a stream after a terminal operation has been called?\n- What is the difference between map() and flatMap()?\n- How does lazy evaluation improve performance?\n- When would you use a parallelStream() over a regular stream(), and what are the risks?\n- Can you explain how the reduce() operation works?`,
      }
    },
    {
      title: 'What is a Functional Interface and what are the common ones provided by Java 8',
      metaTitle: 'Functional Interfaces in Java 8: Predicate, Function, Consumer, Supplier',
      metaDesc: 'An overview of Functional Interfaces in Java 8, including custom interfaces and standard ones like Predicate and Consumer.',
      concepts: ['Functional Interface', 'Java 8', 'Lambda Expressions'],
      quiz: { q: 'Which functional interface takes an argument but returns no result?', opts: ['Predicate', 'Function', 'Supplier', 'Consumer'], ans: 'Consumer' },
      sections: {
        interviewer_expectation: `Understanding Functional Interfaces is a prerequisite for understanding Lambdas and Streams. Interviewers expect:\n\n- A clear definition of a Functional Interface (SAM - Single Abstract Method).\n- Understanding of the \`@FunctionalInterface\` annotation.\n- Familiarity with the \`java.util.function\` package.\n- Ability to identify the input and output signature of core interfaces: \`Predicate\`, \`Function\`, \`Consumer\`, and \`Supplier\`.`,
        core_concepts: `**Definition:**\nA Functional Interface is an interface that contains **exactly one abstract method**. It may contain any number of default or static methods, but the single abstract method is what matters, as this is the method that a Lambda expression will implement.\n\n**The \`@FunctionalInterface\` Annotation:**\nWhile not strictly required, adding \`@FunctionalInterface\` tells the compiler to enforce the SAM rule. If you add a second abstract method, the code won't compile.\n\n**Standard Functional Interfaces (\`java.util.function\`):**\nJava 8 provides standard interfaces to cover most common use cases:\n- **Predicate<T>:** Takes an object of type T and returns a boolean. Used for filtering.\n- **Function<T, R>:** Takes an object of type T and transforms it into an object of type R. Used for mapping.\n- **Consumer<T>:** Takes an object of type T and returns void. Performs side-effects.\n- **Supplier<T>:** Takes no arguments and returns an object of type T. Used for lazy generation.`,
        important_points: `- A functional interface can extend another interface, provided the total number of abstract methods remains exactly one.\n- Object class methods (like \`equals\`, \`hashCode\`, \`toString\`) do not count towards the single abstract method limit if declared abstractly in the interface.\n- There are specialized versions for primitives to avoid autoboxing overhead (e.g., \`IntPredicate\`, \`DoubleFunction\`, \`LongConsumer\`).\n- Bi-versions exist for two arguments (e.g., \`BiFunction<T, U, R>\`, \`BiPredicate<T, U>\`).`,
        code_example: `\`\`\`java
import java.util.function.*;

public class FunctionalInterfacesDemo {
    public static void main(String[] args) {
        // 1. Predicate: Input T, Output boolean
        Predicate<String> isLongText = str -> str.length() > 10;
        System.out.println("Is long? " + isLongText.test("Hello World Wide Web")); // true

        // 2. Function: Input T, Output R
        Function<String, Integer> stringLength = str -> str.length();
        System.out.println("Length: " + stringLength.apply("Java 8")); // 6

        // 3. Consumer: Input T, Output void
        Consumer<String> printer = str -> System.out.println("Printing: " + str);
        printer.accept("Log entry"); // Outputs: Printing: Log entry

        // 4. Supplier: Input none, Output T
        Supplier<Double> randomValue = () -> Math.random();
        System.out.println("Random: " + randomValue.get());
        
        // Custom Functional Interface
        @FunctionalInterface
        interface MathOperation {
            int operate(int a, int b);
        }
        
        MathOperation addition = (a, b) -> a + b;
        System.out.println("Sum: " + addition.operate(5, 3)); // 8
    }
}
\`\`\``,
        speakable_answer: `A Functional Interface in Java is an interface that contains exactly one abstract method. They are crucial because they form the target type for Lambda Expressions.\n\nYou typically annotate them with @FunctionalInterface, which tells the compiler to enforce the single abstract method rule, preventing accidental additions later.\n\nWhile you can create custom functional interfaces, Java 8 provides a comprehensive set in the java.util.function package. The main ones are:\nPredicate, which takes an argument and returns a boolean, mostly used for filtering in streams.\nFunction, which takes an argument and returns a result, used for transforming or mapping data.\nConsumer, which takes an argument and returns nothing, used for side-effects like printing or saving to a database.\nAnd Supplier, which takes no arguments and returns an object, useful for lazy generation or providing default values.`,
        followup_questions: `- What is the purpose of the \`@FunctionalInterface\` annotation?\n- Can a functional interface have default methods?\n- If an interface defines an abstract method that overrides one of the public methods of \`java.lang.Object\`, does that count towards the limit?\n- What is a \`BiFunction\` and when would you use it?\n- Why does Java provide \`IntPredicate\` instead of just using \`Predicate<Integer>\`?`,
      }
    },
    {
      title: 'How do you handle null values using Optional in Java',
      metaTitle: 'Mastering Java 8 Optional to Prevent NullPointerExceptions',
      metaDesc: 'Learn how to use Java Optional correctly to handle null values, write cleaner code, and avoid NPEs.',
      concepts: ['Optional', 'NullPointerException', 'Java 8'],
      quiz: { q: 'Which Optional method throws NoSuchElementException if a value is not present?', opts: ['orElseThrow()', 'get()', 'orElse()', 'ifPresent()'], ans: 'get()' },
      sections: {
        interviewer_expectation: `Handling nulls effectively is the mark of an experienced Java developer. Interviewers assess:\n\n- Understanding of why Optional was created (to make the absence of a value explicit in the API).\n- Proper usage patterns (\`orElse()\`, \`orElseThrow()\`, \`map()\`, \`flatMap()\`).\n- Knowledge of anti-patterns (e.g., calling \`get()\` without checking, using Optional on fields).\n- Experience using it in frameworks like Spring Data JPA.`,
        core_concepts: `**What is Optional?**\n\`java.util.Optional<T>\` is a container object that may or may not contain a non-null value. It expresses that a method might not return a value, forcing the caller to handle that specific possibility, reducing \`NullPointerException\`s.\n\n**Creating Optionals:**\n- \`Optional.empty()\`: Creates an empty Optional.\n- \`Optional.of(value)\`: Creates an Optional with a value; throws NPE if value is null.\n- \`Optional.ofNullable(value)\`: Creates an Optional with a value if present, or an empty Optional if value is null.\n\n**Retrieving Values (The Right Way):**\n- \`orElse(T other)\`: Returns the value if present, otherwise returns \`other\`.\n- \`orElseGet(Supplier other)\`: Like \`orElse\`, but only evaluates the supplier if empty (lazy).\n- \`orElseThrow(Supplier exceptionSupplier)\`: Throws specified exception if empty.\n- \`ifPresent(Consumer consumer)\`: Executes the consumer block only if a value is present.`,
        important_points: `- **Anti-Pattern:** Using \`if (optional.isPresent()) { return optional.get(); } else { return null; }\`. This defeats the purpose. Use the functional methods (\`map\`, \`orElse\`).\n- **Anti-Pattern:** Calling \`optional.get()\` without a check. It throws \`NoSuchElementException\` if empty.\n- **Anti-Pattern:** Using Optional as a field in a POJO or Entity. Optionals are not serializable and add overhead. Use them primarily for method return types.\n- \`orElse(method())\` executes \`method()\` even if the Optional is full. Use \`orElseGet(() -> method())\` if the fallback calculation is expensive.`,
        code_example: `\`\`\`java
import java.util.Optional;

public class OptionalDemo {
    public static void main(String[] args) {
        // Assume we query a database and might not find a user
        Optional<String> userFromDb = findUserById(42);
        
        // Anti-pattern:
        // if(userFromDb.isPresent()) { System.out.println(userFromDb.get()); }

        // Good Pattern 1: Execute if present
        userFromDb.ifPresent(name -> System.out.println("Processing user: " + name));

        // Good Pattern 2: Fallback value
        Optional<String> missingUser = findUserById(99);
        String name = missingUser.orElse("Default User");
        System.out.println("Name is: " + name);

        // Good Pattern 3: Throw an exception if missing
        try {
            String secureData = missingUser.orElseThrow(() -> 
                new IllegalArgumentException("User not found!"));
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        
        // Good Pattern 4: Transform inner value safely using map
        String uppercaseName = userFromDb
            .map(String::toUpperCase)
            .orElse("UNKNOWN");
    }

    private static Optional<String> findUserById(int id) {
        if (id == 42) return Optional.of("Alice");
        return Optional.empty();
    }
}
\`\`\``,
        speakable_answer: `Optional was introduced in Java 8 to address the billion-dollar mistake: the NullPointerException.\n\nIt is a container object that explicitly tells the caller, "This method might not return a value." This forces the developer to handle the absence of a value rather than assuming it's present.\n\nTo use it correctly, you should avoid the get() method, which throws an exception if empty. Instead, use functional methods. For instance, use orElse() to provide a fallback value, or orElseThrow() to throw a custom runtime exception if the data is missing—this is heavily used in Spring Data JPA when finding users by ID.\n\nYou can also use map() to transform the value inside the Optional safely, or ifPresent() to execute business logic only if the value exists.\n\nIt's important to remember that Optional is not meant to replace all nulls. It's an anti-pattern to use Optionals as class fields or method parameters; they are strictly designed to be method return types.`,
        followup_questions: `- What is the difference between \`orElse()\` and \`orElseGet()\`?\n- Why shouldn't you use \`Optional\` as a field in an Entity class?\n- What happens if you call \`Optional.of(null)\`?\n- How does \`flatMap\` work on an \`Optional\` compared to \`map\`?\n- Can you serialize an \`Optional\`?`,
      }
    },
    {
      title: 'What are Default Methods in Java interfaces and why were they added',
      metaTitle: 'Java 8 Default Methods: Evolution of Interfaces',
      metaDesc: 'Understand why Default Methods were introduced in Java 8 and how they enable backward compatibility for interfaces.',
      concepts: ['Default Methods', 'Java Interfaces', 'Backward Compatibility'],
      quiz: { q: 'Can a default method in an interface be overridden by an implementing class?', opts: ['Yes', 'No', 'Only if the class is abstract', 'Only if marked with @Override'], ans: 'Yes' },
      sections: {
        interviewer_expectation: `This question tests an understanding of API design and language evolution. Expectations include:\n\n- Knowing the primary motivation (backward compatibility for adding Stream API to Collections).\n- Understanding the \`default\` keyword.\n- Handling the "Diamond Problem" (multiple inheritance conflicts in interfaces).`,
        core_concepts: `**What is a Default Method?**\nBefore Java 8, interfaces could only contain abstract methods (no implementations). Java 8 introduced the \`default\` keyword, allowing developers to add full method implementations inside an interface.\n\n**Why were they added? (Backward Compatibility)**\nThe primary driver was the introduction of lambda expressions and the Stream API. The Java team wanted to add the \`stream()\` and \`forEach()\` methods to the \`java.util.Collection\` interface. \n\nIf they added them as abstract methods, every single class implementing \`Collection\` in the world (millions of lines of legacy code) would immediately break because they wouldn't have implementations for the new methods. By making them \`default\` methods, existing implementations automatically inherited the functionality without breaking.`,
        important_points: `- A concrete class implementing the interface **inherits** the default method, but can choose to **override** it with a more specific implementation.\n- **Multiple Inheritance Conflict (Diamond Problem):** If a class implements two interfaces that provide a default method with the exact same signature, the compiler throws an error. The class **must** override the method to resolve the ambiguity. It can call a specific interface's default method using \`InterfaceName.super.methodName()\$.\n- Interfaces in Java 8 can also contain **static** methods with implementations, serving as utility methods for the interface.`,
        code_example: `\`\`\`java
interface Vehicle {
    void start(); // abstract

    // Default method providing a standard implementation
    default void honk() {
        System.out.println("Beep beep!");
    }
}

interface Alarm {
    default void honk() {
        System.out.println("WEE-WOO WEE-WOO!");
    }
}

// Class implementing a single interface inherits the default method
class Car implements Vehicle {
    @Override
    public void start() {
        System.out.println("Car is starting");
    }
    // Inherits honk() automatically
}

// Class implementing multiple interfaces with conflicting defaults
class SecurityCar implements Vehicle, Alarm {
    @Override
    public void start() {
        System.out.println("Security car starting");
    }

    // Compiler forces us to override due to ambiguity between Vehicle.honk and Alarm.honk
    @Override
    public void honk() {
        // We choose to use the Alarm's implementation
        Alarm.super.honk();
    }
}

public class DefaultMethodDemo {
    public static void main(String[] args) {
        Car car = new Car();
        car.honk(); // Prints: Beep beep!

        SecurityCar secCar = new SecurityCar();
        secCar.honk(); // Prints: WEE-WOO WEE-WOO!
    }
}
\`\`\``,
        speakable_answer: `Default methods were introduced in Java 8 to allow developers to add new methods to existing interfaces without breaking the classes that already implement them.\n\nThe main motivation was the Stream API. The Java architects wanted to add methods like stream() and forEach() to the core Collection interface. Without default methods, every legacy system that implemented Collection would stop compiling. With default methods, they provided a default implementation on the interface itself, ensuring backward compatibility.\n\nWhile classes inherit these methods automatically, they are free to override them if they need a specialized implementation. \n\nBecause a class can implement multiple interfaces, Java had to handle the diamond problem. If two interfaces define a default method with the same signature, the compiler throws an error and forces the implementing class to override the method to explicitly resolve the conflict.`,
        followup_questions: `- How does Java resolve conflicts if a class inherits a default method from an interface and a method with the same signature from a superclass?\n- In a conflict, how do you explicitly call a specific interface's default method?\n- Can an abstract class have default methods?\n- Besides default methods, what else can interfaces contain since Java 8?`,
      }
    }
  ],
  'multithreading': [
    {
      title: 'Explain the difference between a Thread and a Runnable in Java',
      metaTitle: 'Java Concurrency: Thread Class vs Runnable Interface',
      metaDesc: 'Compare creating threads by extending the Thread class versus implementing the Runnable interface in Java.',
      concepts: ['Multithreading', 'Thread', 'Runnable'],
      quiz: { q: 'Which method must be overridden when implementing the Runnable interface?', opts: ['start()', 'run()', 'execute()', 'call()'], ans: 'run()' },
      sections: {
        interviewer_expectation: `This is a fundamental concurrency question. Interviewers want to see that you understand the very basics of creating execution paths in Java and the design trade-offs between extending a class and implementing an interface.\n\nExpectations include:\n- Knowing the syntax for both approaches.\n- Understanding that \`Runnable\` represents a task, while \`Thread\` represents the execution worker.\n- Justifying why implementing \`Runnable\` is preferred (composition over inheritance).`,
        core_concepts: `**1. Extending the \`Thread\` class:**\nYou create a new class that extends \`java.lang.Thread\` and override its \`run()\` method.\n- **Pros:** Simple for very basic, standalone threads.\n- **Cons:** Because Java only supports single inheritance, extending \`Thread\` means your class cannot extend any other class. It also tightly couples the task logic with the thread execution mechanism.\n\n**2. Implementing the \`Runnable\` interface:**\nYou create a class that implements \`java.lang.Runnable\` and provide the \`run()\` method implementation. You then pass this \`Runnable\` instance to a \`Thread\` constructor.\n- **Pros:** Your class can still extend another base class if needed. It separates the "task" (\`Runnable\`) from the "runner" (\`Thread\`), which is crucial for modern executors and thread pools.\n- **Cons:** Slightly more verbose syntax (though greatly alleviated by Java 8 lambdas).`,
        important_points: `- **Composition over Inheritance:** Implementing \`Runnable\` follows this principle. A task *is not* a thread; a task is *executed by* a thread.\n- **Resource Sharing:** If multiple threads need to process the same data, passing a single \`Runnable\` instance to multiple \`Thread\` objects is a common pattern.\n- **Executors:** The modern way to handle concurrency in Java is using the \`ExecutorService\`. Executors accept \`Runnable\` (and \`Callable\`) objects, not \`Thread\` objects.\n- **Lambda support:** Because \`Runnable\` is a Functional Interface, it is perfectly suited for quick lambda definitions (\`new Thread(() -> { ... }).start()\`).`,
        code_example: `\`\`\`java
// Approach 1: Extending Thread
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Running in MyThread extending Thread class.");
    }
}

// Approach 2: Implementing Runnable
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Running in MyRunnable implementing interface.");
    }
}

public class ThreadCreationDemo {
    public static void main(String[] args) {
        // Using Thread subclass
        MyThread thread1 = new MyThread();
        thread1.start(); // Always call start(), not run()

        // Using Runnable
        MyRunnable task = new MyRunnable();
        Thread thread2 = new Thread(task);
        thread2.start();
        
        // Modern approach: Runnable via Lambda
        Thread thread3 = new Thread(() -> {
            System.out.println("Running in Lambda Runnable.");
        });
        thread3.start();
    }
}
\`\`\``,
        speakable_answer: `In Java, there are two primary ways to create a thread: extending the Thread class or implementing the Runnable interface.\n\nWhen you extend the Thread class, you override its run method. The major drawback here is that Java is a single-inheritance language. If you extend Thread, your class cannot inherit from any other class. It also conceptually mixes the worker with the task it's performing.\n\nThe preferred approach is implementing the Runnable interface. This represents the task itself, independent of how it gets executed. You implement the run method, and then pass that Runnable instance into a Thread constructor to execute it. \n\nImplementing Runnable is better for several reasons: it frees up your class to extend something else, it allows easy sharing of one task instance among multiple threads, and most importantly, it aligns perfectly with modern Java concurrency using ExecutorServices, which accept Runnable tasks to process in thread pools.`,
        followup_questions: `- What happens if you call the \`run()\` method directly instead of \`start()\`?\n- What is the difference between \`Runnable\` and \`Callable\`?\n- How do you stop a running thread safely?\n- What is the difference between user threads and daemon threads?`,
      }
    },
    {
      title: 'What is the Java Executor Framework and how does a ThreadPool operate',
      metaTitle: 'Java Concurrency: Executor Framework and Thread Pools Explained',
      metaDesc: 'Understand the benefits of the Java Executor Framework and how Thread Pools manage thread lifecycles for better performance.',
      concepts: ['ExecutorService', 'ThreadPool', 'Java Concurrency'],
      quiz: { q: 'Which factory class is typically used to create instances of ExecutorService?', opts: ['Executors', 'ThreadPoolFactory', 'ExecutorManager', 'ThreadManager'], ans: 'Executors' },
      sections: {
        interviewer_expectation: `Creating manual \`Thread\` objects is considered an anti-pattern in modern backend development. Interviewers expect candidates with 1-3 years of experience to use Executors.\n\nExpectations include:\n- Knowing why thread creation is expensive and how Thread Pools solve this.\n- Familiarity with \`ExecutorService\` and the \`Executors\` factory class.\n- Knowing the difference between Fixed, Cached, and Single thread pools.\n- Understanding how to gracefully shut down an executor.`,
        core_concepts: `**The Problem with Manual Threads:**\nCreating and destroying operating system threads is expensive in terms of CPU and memory overhead. Creating a new thread for every incoming request in a busy application will quickly crash the JVM with an \`OutOfMemoryError\`.\n\n**The Executor Framework:**\nIntroduced in Java 5 (\`java.util.concurrent\`), it decouples task submission from task execution. You submit a \`Runnable\` or \`Callable\`, and the framework decides how and when to execute it.\n\n**Thread Pools:**\nA Thread Pool maintains a set of worker threads. Instead of creating a new thread for a task, the pool assigns the task to a free thread from its queue. Once the task finishes, the thread is returned to the pool to wait for the next task. This caps resource usage and eliminates thread creation overhead.`,
        important_points: `- **FixedThreadPool:** A pool with a fixed number of threads. Tasks queue up if all threads are busy. Good for predictable workloads.\n- **CachedThreadPool:** Creates new threads as needed, but reuses previously constructed threads when they become available. Idle threads die after 60 seconds. Good for short-lived, bursty tasks.\n- **ScheduledThreadPool:** Can schedule tasks to run after a delay or periodically.\n- Always shut down executors using \`shutdown()\` or \`shutdownNow()\`. Otherwise, the application will not terminate because the pooled threads keep running.\n- **Future Context:** Submitting tasks to an executor returns a \`Future\` object for tracking progress and getting results.`,
        code_example: `\`\`\`java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ExecutorDemo {
    public static void main(String[] args) {
        // Create a pool of 3 fixed workers
        ExecutorService executor = Executors.newFixedThreadPool(3);

        // Submit 5 tasks
        for (int i = 1; i <= 5; i++) {
            final int taskId = i;
            executor.submit(() -> {
                System.out.println("Processing Task " + taskId + 
                    " on " + Thread.currentThread().getName());
                try {
                    Thread.sleep(1000); // Simulate work
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }

        // Initiate a graceful shutdown
        executor.shutdown();
        
        try {
            // Block until all tasks complete or timeout occurs
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                executor.shutdownNow(); // Force shutdown if taking too long
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }
        System.out.println("All tasks finished.");
    }
}
\`\`\``,
        speakable_answer: `The Executor framework is Java's high-level API for managing multithreading. Before it existed, developers had to manually create and track Thread objects, which is problematic because instantiating operating system threads is resource-intensive, and having too many can crash an application.\n\nThe core of the framework is the Thread Pool. A Thread Pool holds a group of pre-instantiated worker threads and a queue of tasks. When you submit a Runnable task to an ExecutorService, it is placed in the queue. A free worker thread picks it up, executes it, and then returns to the pool to wait for the next task. This reusability drastically improves performance.\n\nThe Executors utility class provides factory methods to create pools. For backend services, I typically use a FixedThreadPool, which keeps a strict cap on the number of threads running simultaneously, preventing resource exhaustion during traffic spikes. It's also critical to remember to call shutdown() on an executor when your application shuts down, otherwise, the live threads will keep the JVM running.`,
        followup_questions: `- What is the difference between \\\`shutdown()\\\` and \\\`shutdownNow()\\\`?\\n- What happens if you submit a task to a \\\`FixedThreadPool\\\` and all threads are busy?\\n- How does a \\\`CachedThreadPool\\\` handle idle threads?\\n- Why should you avoid \\\`Executors.newCachedThreadPool()\\\` in high-load production scenarios without strict limits?\\n- Can you explain how the internal WorkQueue operates?`,
      }
    },
    {
      title: 'What is synchronization and how do you prevent race conditions in Java',
      metaTitle: 'Java Synchronization: Preventing Race Conditions and Thread Interference',
      metaDesc: 'Understand thread interference, race conditions, and how to use the synchronized keyword to write thread-safe Java code.',
      concepts: ['Synchronization', 'Race Condition', 'Thread Safety', 'Locks'],
      quiz: { q: 'What entity is a synchronized instance method locked on?', opts: ['The Thread object', 'The Class object', 'The specific instance (this) object', 'A dedicated lock monitor object'], ans: 'The specific instance (this) object' },
      sections: {
        interviewer_expectation: `Thread safety is dangerous territory for junior developers. Interviewers need to know you won't corrupt data in a multi-threaded web server environment (like Tomcat serving Spring requests).\n\nExpectations include:\n- Defining a "race condition".\n- Understanding object monitors (intrinsic locks).\n- Knowing how to use the \`synchronized\` keyword on methods and blocks.\n- Recognizing the performance impact of over-synchronization.`,
        core_concepts: `**Thread Interference / Race Condition:**\nWhen two or more threads access a shared variable concurrently, and at least one is modifying it, the final outcome depends on the timing of thread execution. For example, \`count++\` is not an atomic operation; it consists of Read, Increment, and Write. If two threads read simultaneously before writing, one increment is lost.\n\n**Synchronization:**\nJava provides the \`synchronized\` keyword to prevent thread interference. It ensures that only one thread can execute a block of code enclosed in the synchronized section at a time.\n\n**Monitor Locks:**\nEvery object in Java has an intrinsic lock (monitor). \n- A \`synchronized\` instance method uses the lock on \`this\` (the current object instance).\n- A \`synchronized\` static method uses the lock on the \`Class\` object.\n- A \`synchronized(obj) { ... }\` block uses the lock on the specific \`obj\`.`,
        important_points: `- A thread must acquire the object's lock to enter a synchronized block. Other threads attempting to enter will transition to the BLOCKED state.\n- Synchronization guarantees two things: Mutual Exclusion (only one thread executes) and Visibility (changes made by one thread are visible to subsequent threads that acquire the same lock).\n- **Deadlock:** A critical risk where Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1. Neither can proceed.\n- **Performance:** Synchronization introduces overhead and queuing. Always synchronize the absolute minimum amount of code necessary using synchronized blocks rather than entire methods.`,
        code_example: `\`\`\`java
public class CounterDemo {
    private int count = 0;
    private final Object customLock = new Object();

    // 1. Unsafe: Race condition likely here
    public void incrementUnsafe() {
        count++; 
    }

    // 2. Safe: Synchronized method (locks on 'this')
    public synchronized void incrementSafe() {
        count++;
    }

    // 3. Safe: Synchronized block (locks on custom object)
    // Minimizes lock scope for better performance
    public void incrementBlock() {
        // ... some non-critical thread-safe work ...
        synchronized(customLock) {
            count++;
        }
        // ... more non-critical work ...
    }

    public static void main(String[] args) throws InterruptedException {
        CounterDemo demo = new CounterDemo();
        
        Runnable task = () -> {
            for (int i = 0; i < 10000; i++) {
                demo.incrementSafe();
            }
        };

        Thread t1 = new Thread(task);
        Thread t2 = new Thread(task);

        t1.start(); t2.start();
        t1.join(); t2.join(); // Wait for threads to finish

        System.out.println("Final Count: " + demo.count); // Guarantees 20000
    }
}
\`\`\``,
        speakable_answer: `A race condition occurs in a multithreaded environment when two or more threads attempt to read and modify shared data at the exact same time. For example, an operation like 'count++' looks like one step, but it's actually three: read, increment, and write. If two threads read the same initial value simultaneously, they will both write back the same incremented value, effectively losing an update.\n\nTo prevent this, Java provides the 'synchronized' keyword. It acts as a gatekeeper using intrinsic object locks, or monitors. When a method or block is synchronized, a thread must acquire the lock on the object before entering. If another thread already holds the lock, it is blocked until the lock is released. This ensures mutual exclusion.\n\nHowever, synchronization should be used carefully because it degrades performance by forcing threads to wait in line. It's best practice to use synchronized blocks to lock only the critical sections of code rather than synchronizing entire methods, and you must be careful to avoid deadlocks.`,
        followup_questions: `- What is a Deadlock and how can you prevent it?\n- What is the difference between synchronizing an instance method and a static method?\n- Instead of using the \`synchronized\` keyword, what can you use from the \`java.util.concurrent.atomic\` package for simple counters?\n- Explain what the \`volatile\` keyword does and how it differs from synchronization.\n- What are ReentrantLocks?`,
      }
    },
    {
      title: 'Explain the difference between Runnable and Callable',
      metaTitle: 'Runnable vs Callable in Java: Handling Thread Results and Exceptions',
      metaDesc: 'Compare the Callable and Runnable interfaces in Java, exploring how to return results and throw checked exceptions from threads using Future.',
      concepts: ['Callable', 'Runnable', 'Future'],
      quiz: { q: 'What does the submit() method on an ExecutorService return when given a Callable?', opts: ['void', 'A Runnable instance', 'A Thread instance', 'A Future object representing the pending result'], ans: 'A Future object representing the pending result' },
      sections: {
        interviewer_expectation: `This question digs deeper into the Executor Framework. Interviewers want to know if you can retrieve data computed by a background thread, rather than just executing "fire and forget" tasks.\n\nExpectations include:\n- Contrasting the method signatures (\`run()\` vs \`call()\`).\n- Knowing that \`Callable\` returns a value and can throw checked exceptions.\n- Understanding how the \`Future\` object acts as a bridge to retrieve the asynchronous result.`,
        core_concepts: `**Runnable:**\n- Introduced in Java 1.0.\n- Method signature: \`public void run()\$.\n- Cannot return a result (returns \`void\`).\n- Cannot throw a checked exception (you must \`try-catch\` everything inside the run method).\n- Used for tasks where you don't need a response, like sending a background analytics ping.\n\n**Callable<V>:**\n- Introduced in Java 1.5 in \`java.util.concurrent\`.\n- Method signature: \`public V call() throws Exception\$.\n- Generically typed to return a result of type \`V\`.\n- Can throw checked exceptions directly to the caller.\n- Used for tasks where you need calculation results, like parallelizing database queries.`,
        important_points: `- While \`Thread\` constructors only accept \`Runnable\`, \`ExecutorService.submit()\` accepts both \`Runnable\` and \`Callable\`.\n- When you submit a \`Callable\` to an executor, it immediately returns a \`Future<V>\` object. \n- The \`Future\` acts as a promissory note. It provides methods like \`isDone()\` to check status, and \`get()\` to retrieve the actual return value.\n- Calling \`future.get()\` is a **blocking operation**. The main thread will halt and wait at that line until the Callable finishes calculating the result.\n- If the Callable throws an exception, it is wrapped in an \`ExecutionException\` and thrown when you call \`future.get()\`.`,
        code_example: `\`\`\`java
import java.util.concurrent.*;

public class CallableDemo {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(2);

        // 1. Using Runnable (fire and forget)
        executor.submit(() -> {
            System.out.println("Runnable task executing...");
            // Cannot return data, cannot throw checked exceptions easily
        });

        // 2. Using Callable (returns a value)
        Callable<Integer> complexCalculation = () -> {
            System.out.println("Callable task executing...");
            Thread.sleep(2000); // Simulate expensive computation
            return 42; 
        };

        // Submit returns a Future immediately
        Future<Integer> futureResult = executor.submit(complexCalculation);

        System.out.println("Main thread is free to do other things...");

        try {
            // Block and wait for the thread to return the value
            System.out.println("Waiting for result...");
            Integer result = futureResult.get(); // Blocks here
            System.out.println("The answer is: " + result);
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        } finally {
            executor.shutdown();
        }
    }
}
\`\`\``,
        speakable_answer: `Both Runnable and Callable represent a task that can be executed concurrently by multiple threads, but Callable was introduced later in Java 5 and is far more powerful.\n\nThere are two main differences. First, the method signature: Runnable implements a run() method that returns void, making it strictly 'fire and forget'. Callable implements a call() method that is generically typed to return a result.\n\nSecond, exception handling: A Runnable cannot throw checked exceptions; you must wrap any potential failures in a try-catch block inside the run method. A Callable is designed to declare 'throws Exception', allowing it to propagate errors upwards.\n\nWhen you submit a Callable to an ExecutorService, it returns a Future object immediately. This Future acts as a proxy. You can continue doing work on your main thread, and when you finally need the Callable's computed data, you invoke future.get(). This call will block until the thread finishes and returns the data, or it will throw an ExecutionException if the remote thread ran into an error.`,
        followup_questions: `- What happens to the main thread when calling \`future.get()\` if the background task is taking too long?\n- How can you set a timeout on a \`Future\`?\n- What is \`CompletableFuture\` and how does it improve upon the standard \`Future\` interface?\n- Can you pass a Callable directly to a standard \`Thread(new Callable())\` constructor?`,
      }
    },
    {
      title: 'What are Atomic classes and Concurrent Collections in the java.util.concurrent package',
      metaTitle: 'Atomic Variables and Concurrent Collections in Java Concurrency',
      metaDesc: 'Explore advanced Java concurrency tools: Atomic objects for lock-free thread safety and Concurrent Collections like ConcurrentHashMap.',
      concepts: ['AtomicInteger', 'ConcurrentHashMap', 'CAS (Compare-And-Swap)'],
      quiz: { q: 'Which low-level CPU algorithm powers Java Atomic classes?', opts: ['Round Robin scheduling', 'Compare-And-Swap (CAS)', 'Mutual Exclusion (Mutex)', 'Optimistic Locking'], ans: 'Compare-And-Swap (CAS)' },
      sections: {
        interviewer_expectation: `This question distinguishes candidates who apply brute-force \`synchronized\` blocks everywhere from those who understand high-performance concurrency. Expectations:\n\n- Knowledge of Lock-Free thread safety using CAS.\n- Ability to name specific Atomic classes (\`AtomicInteger\`, \`AtomicBoolean\`).\n- Understanding why \`ConcurrentHashMap\` is superior to \`Hashtable\` or \`Collections.synchronizedMap\`.\n- Basic understanding of locking strategies (like Map segment locking vs full locking).`,
        core_concepts: `**Atomic Classes (\`java.util.concurrent.atomic\`):**\nClasses like \`AtomicInteger\`, \`AtomicLong\`, and \`AtomicReference\` provide lock-free thread-safe operations on single variables. Instead of using OS-level monitor locks which are slow and put threads to sleep, they use a hardware-level instruction called **Compare-And-Swap (CAS)**. CAS operates optimistically: it reads a value, calculates the new value, and then tries to swap them. If another thread altered the value in the meantime, the swap fails, and the CPU retries incredibly quickly until it succeeds.\n\n**Concurrent Collections:**\nStandard collections (\`HashMap\`, \`ArrayList\`) are not thread-safe. Old synchronized collections (\`Vector\`, \`Hashtable\`) are fully synchronized, meaning any read or write locks the entire object, causing huge performance bottlenecks. \nModern concurrent collections (\`ConcurrentHashMap\`, \`CopyOnWriteArrayList\`) are optimized for high concurrency.`,
        important_points: `- **AtomicInteger vs int + synchronized:** Atomic variables are much faster for simple counters in heavy multithreading environments because they avoid context switching overhead.\n- **ConcurrentHashMap:** Unlike \`Hashtable\` which locks the whole map on a read or write, \`ConcurrentHashMap\` enables multiple concurrent readers without locking, and uses fine-grained locking (locking only specific bins/nodes) for writes, vastly improving throughput.\n- **CopyOnWriteArrayList:** A thread-safe variant of \`ArrayList\` where all mutative operations (add, set) are implemented by making a fresh copy of the underlying array. Excellent for read-heavy, write-rarely scenarios (like caching system listeners).`,
        code_example: `\`\`\`java
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class ConcurrentToolsDemo {
    
    // 1. Atomic Variable
    // Replaces the need for "private synchronized void increment()"
    private final AtomicInteger requestCounter = new AtomicInteger(0);
    
    // 2. Concurrent Collection
    // Allows thread-safe highly concurrent reads and writes
    private final Map<String, Integer> userSessions = new ConcurrentHashMap<>();

    public void processRequest(String userId) {
        // Increment lock-free
        int requestNumber = requestCounter.incrementAndGet();
        
        // Thread-safe map update
        // putIfAbsent is atomic in ConcurrentHashMap
        userSessions.putIfAbsent(userId, 0);
        
        // Compute replacing the old lock-get-increment-put pattern
        userSessions.compute(userId, (key, count) -> count == null ? 1 : count + 1);
        
        System.out.println("Request #" + requestNumber + " for User: " + userId);
    }
}
\`\`\``,
        speakable_answer: `The java.util.concurrent package provides powerful, high-performance tools designed to replace clunky 'synchronized' blocks.\n\nThe first group is Atomic classes, like AtomicInteger and AtomicBoolean. These provide thread-safe operations on single variables without using blocks or locks. They achieve this using a CPU-level instruction called Compare-And-Swap (or CAS). CAS is lock-free and incredibly fast; it optimistically attempts an update and simply retries instantly if another thread beat it to the punch. For something like a visitor counter on a web server, an AtomicInteger is far superior to a synchronized method.\n\nThe second group is Concurrent Collections, specifically ConcurrentHashMap. While older legacy classes like Hashtable achieved thread safety by locking the entire collection for every read and write, ConcurrentHashMap allows full concurrency for reads, and uses fine-grained node-level locking for writes. This means multiple threads can update different parts of the map simultaneously, completely removing the bottleneck of a single monolithic lock.`,
        followup_questions: `- Explain how the Compare-And-Swap (CAS) algorithm actually works.\n- What is the ABA problem in relation to CAS, and how do AtomicStampedReferences solve it?\n- When would you choose a \`CopyOnWriteArrayList\` over a \`Collections.synchronizedList\`?\n- Are methods on a \`ConcurrentHashMap\` absolutely guaranteed to return realtime, un-stale data on reads?`,
      }
    }
  ],
};

async function insertContent() {
  const client = await pool.connect();
  try {
    const domainRes = await client.query("SELECT id FROM domains WHERE slug = 'java-backend-1-3'");
    if (!domainRes.rows.length) return;
    const domainId = domainRes.rows[0].id;

    const stacksRes = await client.query(
      `SELECT ts.id, ts.slug, ts.name FROM domain_stack_map dsm
       JOIN tech_stacks ts ON ts.id = dsm.stack_id
       JOIN domains d ON d.id = dsm.domain_id
       WHERE d.slug = 'java-backend-1-3' ORDER BY dsm.display_order`
    );
    const stackMap = {};
    for (const s of stacksRes.rows) stackMap[s.slug] = s;

    const qsiRes = await client.query(
      `SELECT qsi.stack_id, COUNT(*) as cnt FROM question_stack_index qsi GROUP BY qsi.stack_id`
    );
    const existingCounts = {};
    for (const r of qsiRes.rows) existingCounts[r.stack_id] = parseInt(r.cnt);

    for (const [stackSlug, questions] of Object.entries(QUESTIONS)) {
      const stack = stackMap[stackSlug];
      if (!stack) continue;
      const stackId = stack.id;
      let orderIndex = (existingCounts[stackId] || 0) + 1;

      console.log(`\n▶ Processing stack: ${stackSlug} (id=${stackId})`);

      for (const q of questions) {
        await client.query('BEGIN');
        try {
          const baseSlug = toSlug(q.title);
          const slug = await uniqueSlug(client, baseSlug);

          const qRes = await client.query(
            `INSERT INTO questions(title, slug, difficulty, estimated_read_time, meta_title, meta_description)
             VALUES($1,$2,'medium',4,$3,$4) RETURNING id`,
            [q.title, slug, q.metaTitle, q.metaDesc]
          );
          const questionId = qRes.rows[0].id;
          console.log(`  ✓ Question [${questionId}]: ${q.title.substring(0, 50)}...`);

          await client.query(
            `INSERT INTO question_stack_index(stack_id, question_id, order_index) VALUES($1,$2,$3)`,
            [stackId, questionId, orderIndex++]
          );

          const sectionTypes = [
            'interviewer_expectation', 'core_concepts', 'important_points',
            'code_example', 'speakable_answer', 'followup_questions'
          ];
          for (let i = 0; i < sectionTypes.length; i++) {
            const sType = sectionTypes[i];
            const content = q.sections[sType];
            await client.query(
              `INSERT INTO answer_sections(question_id, section_type, section_order, content) VALUES($1,$2::answer_section_enum,$3,$4)`,
              [questionId, sType, i + 1, content]
            );
          }

          for (const cName of q.concepts) {
            const cId = await getOrCreateConcept(client, cName);
            try {
              await client.query(
                `INSERT INTO question_concepts(question_id, concept_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,
                [questionId, cId]
              );
            } catch (_) {}
          }

          const optionsJson = JSON.stringify(q.quiz.opts);
          await client.query(
            `INSERT INTO question_quizzes(question_id, quiz_question, options, correct_answer) VALUES($1,$2,$3,$4)`,
            [questionId, q.quiz.q, optionsJson, q.quiz.ans]
          );

          await client.query('COMMIT');
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`    ✗ ROLLBACK for "${q.title}": ${err.message}`);
        }
      }
    }

    console.log('\n▶ Adding question relations...');
    for (const [stackSlug] of Object.entries(QUESTIONS)) {
      const stack = stackMap[stackSlug];
      if (!stack) continue;
      const stackId = stack.id;
      const qInStack = await client.query(
        `SELECT question_id FROM question_stack_index WHERE stack_id = $1 ORDER BY order_index DESC LIMIT 10`,
        [stackId]
      );
      const ids = qInStack.rows.map(r => BigInt(r.question_id));
      if (ids.length < 2) continue;
      for (let i = 0; i < ids.length; i++) {
        const related1 = ids[(i + 1) % ids.length];
        const related2 = ids[(i + 2) % ids.length];
        for (const relId of [related1, related2]) {
          if (relId === ids[i]) continue;
          try {
            await client.query(
              `INSERT INTO question_relations(question_id, related_question_id, relation_type)
               VALUES($1,$2,'related'::relation_type_enum) ON CONFLICT DO NOTHING`,
              [ids[i].toString(), relId.toString()]
            );
          } catch (_) {}
        }
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

insertContent().catch(console.error);
