// Content generation script for java-backend-1-3 domain
// Uses existing DB config from application.properties
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

// ── QUESTION DATA ───────────────────────────────────────────────────────────

const QUESTIONS = {
  'core-java': [
    {
      title: 'What is the difference between JDK, JRE, and JVM in Java',
      metaTitle: 'JDK vs JRE vs JVM - Java Interview Question',
      metaDesc: 'Understand the difference between JDK, JRE, and JVM for Java backend interviews.',
      concepts: ['JVM', 'Java Runtime Environment', 'Java Development Kit'],
      quiz: { q: 'Which component is responsible for executing Java bytecode?', opts: ['JDK','JRE','JVM','Compiler'], ans: 'JVM' },
      sections: {
        interviewer_expectation: `When interviewers ask about JDK, JRE, and JVM, they want to confirm that you understand the Java ecosystem at the foundational level. A 1–3 year Java developer should be comfortable explaining each layer and why it matters in real-world development and deployment.\n\n- **JVM** (Java Virtual Machine): Executes bytecode. Platform-specific but provides platform independence to Java programs.\n- **JRE** (Java Runtime Environment): Includes JVM + libraries needed to run Java apps.\n- **JDK** (Java Development Kit): Includes JRE + tools like javac, javadoc, and jar for developing Java apps.\n\nExpect follow-up questions about class loading, garbage collection, or JIT compilation.`,
        core_concepts: `The Java platform is structured in three layers that serve different purposes:\n\n**JVM — Java Virtual Machine**\nThe JVM is an abstract computing machine that enables a computer to run Java bytecode. It handles memory management, garbage collection, and Just-In-Time (JIT) compilation. The JVM is platform-specific, but this is what makes Java "write once, run anywhere."\n\n**JRE — Java Runtime Environment**\nThe JRE provides the minimum environment required to run a compiled Java application. It bundles:\n- JVM\n- Core class libraries (java.lang, java.util, etc.)\n- Configuration files\n\n**JDK — Java Development Kit**\nJDK is the full development package. It contains everything in JRE plus:\n- javac (Java compiler)\n- javadoc (documentation generator)\n- jar (archive tool)\n- jdb (debugger)\n\n| Component | Contains | Purpose |\n|-----------|----------|--------|\n| JVM | Bytecode executor | Run Java bytecode |\n| JRE | JVM + libraries | Run Java apps |\n| JDK | JRE + dev tools | Develop Java apps |`,
        important_points: `**Key points to remember:**\n\n- You need JDK installed on your development machine to write and compile Java code.\n- Production servers typically only need JRE to run pre-compiled JAR files.\n- Spring Boot fat JARs embed the web server and dependencies — only JRE is needed at runtime.\n- JVM memory is divided into: Heap, Stack, Method Area, PC Registers, and Native Method Stack.\n- JIT (Just-In-Time) compilation improves performance by compiling frequently used bytecode into native machine code at runtime.\n- Since Java 9, the modular system (Project Jigsaw) allows creating custom minimal JREs for deployment.`,
        code_example: `\`\`\`java
// Example: Checking which JDK version is being used
public class JavaEnvironmentCheck {
    public static void main(String[] args) {
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("JVM Name: " + System.getProperty("java.vm.name"));
        System.out.println("JRE Home: " + System.getProperty("java.home"));
        System.out.println("JDK Vendor: " + System.getProperty("java.vendor"));
    }
}
// Output on Java 17:
// Java Version: 17.0.1
// JVM Name: OpenJDK 64-Bit Server VM
// JRE Home: /usr/lib/jvm/java-17-openjdk-amd64
// JDK Vendor: Oracle Corporation
\`\`\``,
        speakable_answer: `JDK, JRE, and JVM are three core components of the Java platform, each serving a different purpose.\n\nJVM stands for Java Virtual Machine. It is responsible for executing Java bytecode. Each operating system has its own JVM implementation, but since Java programs are compiled to platform-independent bytecode, they can run on any machine with a compatible JVM — that's the foundation of Java's "write once, run anywhere" promise.\n\nJRE stands for Java Runtime Environment. It includes the JVM plus the standard class libraries needed to run Java applications. If you only need to run a Java app — not develop one — JRE is sufficient.\n\nJDK stands for Java Development Kit. It is the complete package for Java developers, including everything in JRE plus tools like the Java compiler (javac), the jar packaging tool, and the Java debugger. Any developer writing Java code must have the JDK installed.`,
        followup_questions: `**Likely follow-up questions:**\n\n- What is JIT compilation and how does it improve performance?\n- Can you explain how the JVM manages memory — Heap vs Stack?\n- What is the difference between Java 8, 11, and 17 LTS?\n- What happens when you run 'java -jar app.jar' in terms of JVM initialization?\n- What are some common JVM tuning flags like -Xmx and -Xms?\n- How does the class loader work in JVM?`,
      }
    },
    {
      title: 'Explain the four pillars of Object Oriented Programming in Java',
      metaTitle: 'OOP Pillars in Java - Encapsulation Inheritance Polymorphism Abstraction',
      metaDesc: 'Learn about the four pillars of OOP in Java: encapsulation, inheritance, polymorphism, and abstraction.',
      concepts: ['Object Oriented Programming', 'Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
      quiz: { q: 'Which OOP pillar hides implementation details and exposes only functionality?', opts: ['Inheritance','Encapsulation','Polymorphism','Abstraction'], ans: 'Abstraction' },
      sections: {
        interviewer_expectation: `OOP principles are a cornerstone of Java backend development. Interviewers at the 1–3 year experience level expect you to not only define each pillar but also explain how you have applied them in real projects. Vague definitions without examples are a red flag.\n\n- Be ready to code a quick example for each pillar.\n- Explain the "why" — why each pillar improves code quality.\n- Mention design patterns that leverage these pillars (e.g., Strategy for polymorphism, Facade for abstraction).\n- Know the difference between interface abstraction and abstract class abstraction.`,
        core_concepts: `**The Four Pillars of OOP:**\n\n**1. Encapsulation**\nBundling data (fields) and methods that operate on that data into a single unit (class), while restricting direct access to internal state.\n- Achieved via private fields + public getters/setters.\n- Benefits: data integrity, maintainability.\n\n**2. Inheritance**\nAllowing a class to inherit properties and behavior from another class using the 'extends' keyword.\n- Promotes code reuse.\n- Supports "is-a" relationships.\n- Java supports single inheritance (one parent class), but multiple interface implementation.\n\n**3. Polymorphism**\nThe ability of an object to take many forms. Two types:\n- **Compile-time (method overloading):** Same method name, different parameters.\n- **Runtime (method overriding):** Subclass provides specific implementation of parent method.\n\n**4. Abstraction**\nHiding complex implementation details and exposing only what is necessary.\n- Achieved via abstract classes and interfaces.\n- Benefits: reduces complexity, improves readability.`,
        important_points: `**Key distinctions to know:**\n\n| Pillar | Keyword/Mechanism | Purpose |\n|--------|------------------|--------|\n| Encapsulation | private + getters/setters | Data hiding |\n| Inheritance | extends | Code reuse |\n| Polymorphism | Override / Overload | Flexibility |\n| Abstraction | abstract / interface | Complexity hiding |\n\n- Encapsulation is about **how** data is protected.\n- Abstraction is about **what** to expose to the user.\n- In Spring Boot, service layers use abstraction (interfaces) and polymorphism (multiple implementations) heavily.\n- Prefer composition over inheritance when possible (GoF principle).`,
        code_example: `\`\`\`java
// Encapsulation
public class BankAccount {
    private double balance;
    public double getBalance() { return balance; }
    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
}

// Inheritance + Polymorphism
public abstract class Shape {
    public abstract double area();
}

public class Circle extends Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    @Override
    public double area() { return Math.PI * radius * radius; }
}

public class Rectangle extends Shape {
    private double width, height;
    @Override
    public double area() { return width * height; }
}

// Abstraction via interface
public interface PaymentService {
    void processPayment(double amount);
}

public class StripePaymentService implements PaymentService {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing $" + amount + " via Stripe");
    }
}
\`\`\``,
        speakable_answer: `Java's four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction.\n\nEncapsulation means bundling data and the methods that work on that data inside a single class, and controlling access through private fields with public getters and setters. This protects the internal state of objects.\n\nInheritance allows a child class to inherit fields and methods from a parent class using the extends keyword. This promotes code reuse and supports the is-a relationship.\n\nPolymorphism lets objects take different forms. Method overloading is compile-time polymorphism, while method overriding is runtime polymorphism — where a subclass provides its own implementation of a parent class method.\n\nAbstraction hides implementation complexity and only exposes what is necessary. In Java this is done with abstract classes and interfaces.`,
        followup_questions: `- What is the difference between an abstract class and an interface?\n- When would you use composition over inheritance?\n- Can you give a real-world Spring Boot example of polymorphism?\n- What is method overloading vs method overriding?\n- What is the SOLID principle and how does it relate to OOP?\n- What is dynamic dispatch in Java?`,
      }
    },
    {
      title: 'What are Java Collections and when do you use List Map and Set',
      metaTitle: 'Java Collections: List, Map, Set Explained for Interviews',
      metaDesc: 'Understand Java Collections framework with List, Map, and Set - their differences and use cases for backend development.',
      concepts: ['Java Collections', 'HashMap', 'ArrayList', 'LinkedList'],
      quiz: { q: 'Which Java collection does NOT allow duplicate values?', opts: ['ArrayList','LinkedList','HashSet','HashMap'], ans: 'HashSet' },
      sections: {
        interviewer_expectation: `Java Collections is one of the most heavily tested topics in Java backend interviews. At 1–3 years experience, you must know:\n\n- The Collection hierarchy (Collection → List/Set/Queue, Map is separate).\n- The difference between ArrayList and LinkedList.\n- When to use HashMap vs LinkedHashMap vs TreeMap.\n- Thread-safety: Vector, ConcurrentHashMap.\n- Time complexity for common operations.\n\nBe ready to write code using generics, iterators, and streams over collections.`,
        core_concepts: `**The Java Collections Framework:**\n\n**List** — Ordered, allows duplicates:\n- ArrayList: backed by array, O(1) random access, O(n) insert in middle.\n- LinkedList: doubly linked, O(1) insert/delete at ends, O(n) random access.\n\n**Set** — Unordered (unless TreeSet/LinkedHashSet), no duplicates:\n- HashSet: O(1) add/contains, no order.\n- LinkedHashSet: maintains insertion order.\n- TreeSet: sorted order, O(log n).\n\n**Map** — Key-value pairs, keys are unique:\n- HashMap: O(1) get/put, no order.\n- LinkedHashMap: maintains insertion order.\n- TreeMap: sorted by key, O(log n).\n\n| Type | Duplicates | Ordered | Null keys |\n|------|-----------|---------|----------|\n| ArrayList | Yes | Yes | N/A |\n| HashSet | No | No | One null |\n| HashMap | Keys: No | No | One null |\n| TreeMap | Keys: No | Sorted | No |`,
        important_points: `- Use **ArrayList** when you need fast random access by index.\n- Use **LinkedList** when you frequently insert/delete at the beginning or middle.\n- Use **HashSet** when you need to check membership quickly and order doesn't matter.\n- Use **HashMap** for fast key lookups.\n- Use **TreeMap** when you need keys sorted (useful for range queries).\n- **ConcurrentHashMap** is thread-safe alternative to HashMap — preferred in multi-threaded Spring services.\n- Always prefer interface types: List<String> list = new ArrayList<>() — easier to swap implementations.\n- Java 9+: use List.of(), Set.of(), Map.of() for immutable collections.`,
        code_example: `\`\`\`java
import java.util.*;

public class CollectionsDemo {
    public static void main(String[] args) {
        // List - ordered, allows duplicates
        List<String> names = new ArrayList<>(Arrays.asList("Alice", "Bob", "Alice"));
        System.out.println(names); // [Alice, Bob, Alice]

        // Set - no duplicates
        Set<String> uniqueNames = new HashSet<>(names);
        System.out.println(uniqueNames); // [Alice, Bob]

        // Map - key-value pairs
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95);
        scores.put("Bob", 88);
        scores.put("Alice", 97); // overwrites previous value
        System.out.println(scores.get("Alice")); // 97

        // Iterating with streams
        names.stream()
             .filter(n -> n.startsWith("A"))
             .forEach(System.out::println); // Alice, Alice
    }
}
\`\`\``,
        speakable_answer: `The Java Collections Framework provides a set of interfaces and classes to store and manipulate groups of objects.\n\nList is an ordered collection that allows duplicates. ArrayList is backed by a dynamic array and provides fast random access, while LinkedList is better for frequent insertions and deletions.\n\nSet is a collection that does not allow duplicate elements. HashSet is the most common and offers O(1) performance, while TreeSet keeps elements sorted.\n\nMap stores key-value pairs where keys must be unique. HashMap is the most used for fast lookups. LinkedHashMap maintains insertion order, and TreeMap keeps keys sorted.\n\nI choose based on the use case: ArrayList for indexed access, HashSet for deduplication, HashMap for lookups, and ConcurrentHashMap for thread-safe access in Spring service layers.`,
        followup_questions: `- What is the time complexity of HashMap get and put?\n- How does HashMap handle hash collisions internally?\n- What is the difference between Comparable and Comparator?\n- How would you sort a List of objects by a field?\n- What is CopyOnWriteArrayList and when would you use it?\n- What changed in Java 8 regarding HashMap (treeification of buckets)?`,
      }
    },
    {
      title: 'What is exception handling in Java and how do checked and unchecked exceptions differ',
      metaTitle: 'Java Exception Handling: Checked vs Unchecked Exceptions',
      metaDesc: 'Learn Java exception handling with checked and unchecked exceptions for backend Java interviews.',
      concepts: ['Exception Handling', 'RuntimeException', 'Java Error Handling'],
      quiz: { q: 'Which of these is an unchecked exception in Java?', opts: ['IOException','SQLException','NullPointerException','ClassNotFoundException'], ans: 'NullPointerException' },
      sections: {
        interviewer_expectation: `Exception handling is a practical skill tested heavily because poor exception handling causes production bugs. Interviewers want to see:\n\n- Clear distinction between checked and unchecked exceptions.\n- Understanding of the exception hierarchy (Throwable → Error/Exception → RuntimeException).\n- Best practices: when to catch, when to rethrow, when to use custom exceptions.\n- In Spring Boot context: @ExceptionHandler, @ControllerAdvice, ResponseStatusException.\n\nA senior developer avoids swallowing exceptions silently (empty catch blocks).`,
        core_concepts: `**Java Exception Hierarchy:**\n\`\`\`\nThrowable\n├── Error (OutOfMemoryError, StackOverflowError)\n└── Exception\n    ├── Checked Exceptions (IOException, SQLException)\n    └── RuntimeException (Unchecked)\n        ├── NullPointerException\n        ├── ArrayIndexOutOfBoundsException\n        └── IllegalArgumentException\n\`\`\`\n\n**Checked Exceptions:**\n- Checked at compile time.\n- Must be declared with throws or caught.\n- Examples: IOException, SQLException, ClassNotFoundException.\n- Typically for recoverable conditions (file not found, DB connection lost).\n\n**Unchecked Exceptions (RuntimeException):**\n- Not checked at compile time.\n- Usually indicate programming bugs.\n- Examples: NullPointerException, ArrayIndexOutOfBoundsException.\n- Don't need to be declared or caught (though you can).`,
        important_points: `- **Never** catch Exception or Throwable generically unless re-throwing.\n- **Never** use empty catch blocks — at minimum, log the exception.\n- Use **finally** or try-with-resources to close resources.\n- Custom exceptions should extend RuntimeException for unchecked or Exception for checked.\n- In Spring Boot, use **@ControllerAdvice** + **@ExceptionHandler** for global exception handling.\n- Prefer specific exceptions: catch (FileNotFoundException e) over catch (IOException e) when possible.\n- Use **ResponseStatusException** in Spring to return proper HTTP error codes.`,
        code_example: `\`\`\`java
// Custom exception
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

// Service throwing exception
@Service
public class UserService {
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }
}

// Global exception handler in Spring Boot
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }
}

// Try-with-resources example
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
} catch (IOException e) {
    log.error("Failed to read file", e);
    throw new RuntimeException("File read failed", e);
}
\`\`\``,
        speakable_answer: `Exception handling in Java is the mechanism to handle runtime errors gracefully so the application can continue running or fail in a controlled way.\n\nJava has two categories of exceptions. Checked exceptions are checked at compile time — the compiler forces you to either catch them or declare them with throws. Examples include IOException and SQLException. These typically represent recoverable conditions like a missing file or database error.\n\nUnchecked exceptions extend RuntimeException and are not checked at compile time. Examples include NullPointerException and IllegalArgumentException. These usually indicate programming bugs.\n\nIn Spring Boot applications, I use a global @ControllerAdvice class with @ExceptionHandler methods to centralize exception handling and return appropriate HTTP status codes instead of letting exceptions bubble up as 500 errors.`,
        followup_questions: `- What is the difference between throw and throws?\n- How does try-with-resources work and what interface must a class implement?\n- What is the purpose of the finally block?\n- How do you create a custom exception class?\n- What is @ControllerAdvice in Spring Boot?\n- When should you use checked vs unchecked exceptions?`,
      }
    },
    {
      title: 'What are Java generics and why are they important for type safety',
      metaTitle: 'Java Generics Explained: Type Safety and Wildcard Usage',
      metaDesc: 'Understand Java generics, bounded wildcards, and type safety for Java backend interviews.',
      concepts: ['Java Generics', 'Type Safety', 'Java Collections'],
      quiz: { q: 'What does the diamond operator <> do in Java generics?', opts: ['Creates a new type','Enables type inference','Casts the object','None of the above'], ans: 'Enables type inference' },
      sections: {
        interviewer_expectation: `Generics questions often appear when interviewers want to assess depth of Java knowledge. At 1–3 years, you should be able to:\n\n- Explain why generics exist (type safety, no casting).\n- Use bounded wildcards (? extends T, ? super T).\n- Understand type erasure and its implications.\n- Recognize generic methods and classes.\n\nTypical follow-up: explain the difference between List<?>, List<Object>, and raw List.`,
        core_concepts: `**Why Generics?**\nBefore generics (pre-Java 5), collections stored Objects and required explicit casting:\n\`\`\`java\nList list = new ArrayList();\nlist.add("hello");\nString s = (String) list.get(0); // ClassCastException risk\n\`\`\`\nWith generics, the compiler enforces type safety:\n\`\`\`java\nList<String> list = new ArrayList<>();\nlist.add("hello");\nString s = list.get(0); // No cast needed, safe at compile time\n\`\`\`\n\n**Bounded Wildcards:**\n- **? extends T** (upper bounded): read-only, accepts T and subclasses.\n- **? super T** (lower bounded): write-allowed, accepts T and superclasses.\n\n**Type Erasure:**\nGeneric type information is removed at runtime (erased to Object or the bound). This is why you can't do instanceof checks with generics.`,
        important_points: `- Generic classes: class Box<T> { T value; }\n- Generic methods: public <T> T process(T input) { ... }\n- PECS rule: **P**roducer **E**xtends, **C**onsumer **S**uper.\n- Type erasure means List<String> and List<Integer> are the same class at runtime.\n- Wildcards are useful for writing flexible utility methods.\n- In Spring Data JPA, generics power repositories: JpaRepository<User, Long>.\n- Avoid raw types (List without type parameter) — they bypass type checking.`,
        code_example: `\`\`\`java
// Generic class
public class ApiResponse<T> {
    private T data;
    private String message;
    private int statusCode;

    public ApiResponse(T data, String message, int statusCode) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }
    public T getData() { return data; }
}

// Generic method
public static <T extends Comparable<T>> T findMax(List<T> list) {
    return list.stream().max(Comparator.naturalOrder())
               .orElseThrow(() -> new IllegalArgumentException("Empty list"));
}

// Usage in Spring Boot
@GetMapping("/user/{id}")
public ApiResponse<UserDTO> getUser(@PathVariable Long id) {
    UserDTO user = userService.findById(id);
    return new ApiResponse<>(user, "Success", 200);
}

// Bounded wildcard - sum numbers
public static double sumNumbers(List<? extends Number> list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}
\`\`\``,
        speakable_answer: `Java generics provide a way to write type-safe, reusable code. Before generics, collections stored Object references and required casting, which could cause ClassCastException at runtime. With generics, the type is checked at compile time, eliminating the need for casting and preventing type errors early.\n\nFor example, a List<String> only accepts strings, and the compiler will reject any attempt to add an integer. This makes code safer and more readable.\n\nGenerics also support bounded type parameters. Upper bounded wildcards like ? extends Number accept Number and its subclasses, useful for reading from a collection. Lower bounded wildcards like ? super Integer accept Integer and its superclasses, useful for writing to a collection.\n\nIn Spring Data JPA, generics power repository interfaces like JpaRepository<User, Long>, which is a practical example I use daily.`,
        followup_questions: `- What is type erasure and what are its implications?\n- Explain the PECS principle with an example.\n- Can you use generics with primitive types in Java?\n- What is the difference between List<?> and List<Object>?\n- How are generics used in Spring Data repositories?\n- What is a generic interface and how do you implement one?`,
      }
    },
  ],
  'spring-boot': [
    {
      title: 'What is Spring Boot and why is it preferred over plain Spring Framework',
      metaTitle: 'Spring Boot vs Spring Framework - Key Differences Explained',
      metaDesc: 'Learn why Spring Boot is preferred for modern Java backend development and how it differs from Spring Framework.',
      concepts: ['Spring Boot', 'Spring Framework', 'Auto Configuration', 'Dependency Injection'],
      quiz: { q: 'Which annotation bootstraps a Spring Boot application?', opts: ['@SpringApplication','@EnableSpringBoot','@SpringBootApplication','@SpringConfig'], ans: '@SpringBootApplication' },
      sections: {
        interviewer_expectation: `This is a fundamental Spring Boot question. Interviewers for 1–3 year Java backend roles expect you to clearly articulate the problems Spring Boot solves. Don't just say "it's easier" — explain the specific pain points of vanilla Spring that Spring Boot eliminates.\n\nKey expectations:\n- Know what auto-configuration does.\n- Know about embedded servers (Tomcat, Jetty).\n- Know about Spring Boot starters.\n- Be able to discuss trade-offs (when might plain Spring be better).`,
        core_concepts: `**Spring Framework** is a comprehensive Java framework for enterprise applications. It provides:\n- Dependency Injection (IoC container)\n- AOP (Aspect-Oriented Programming)\n- Spring MVC for web\n- Spring Data, Security, etc.\n\nHowever, configuring Spring requires significant XML or Java configuration boilerplate.\n\n**Spring Boot** builds on Spring Framework and adds:\n1. **Auto-configuration**: Automatically configures beans based on classpath contents.\n2. **Starter dependencies**: Curated dependency sets (spring-boot-starter-web, spring-boot-starter-data-jpa).\n3. **Embedded server**: Ships with Tomcat/Jetty/Undertow — no WAR deployment needed.\n4. **Opinionated defaults**: Best-practice defaults out of the box.\n5. **Actuator**: Production-ready health/metrics endpoints.\n\n| Feature | Spring Framework | Spring Boot |\n|---------|-----------------|------------|\n| Setup time | High (lots of config) | Low (starters + auto-config) |\n| Deployment | WAR to app server | JAR with embedded server |\n| Defaults | Manual | Opinionated |\n| Production features | Manual | Actuator built-in |`,
        important_points: `- Spring Boot apps are standalone — just run java -jar app.jar.\n- @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan.\n- Auto-configuration uses @Conditional annotations to only configure beans when needed.\n- You can exclude specific auto-configurations: @SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}).\n- application.properties / application.yml controls most behavior without code changes.\n- Spring Boot DevTools enables hot reload during development.\n- Spring Initializr (start.spring.io) is the standard way to bootstrap new projects.`,
        code_example: `\`\`\`java
// Minimal Spring Boot REST API
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid CreateUserRequest request) {
        UserDTO created = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
\`\`\``,
        speakable_answer: `Spring Boot is an opinionated extension of the Spring Framework that makes it easy to create production-ready Spring applications with minimal configuration.\n\nThe core problem Spring Boot solves is configuration overhead. In vanilla Spring, you had to define XML configuration or Java @Configuration classes to set up every component, data source, and web server. Spring Boot replaces this with auto-configuration — it detects what's on the classpath and automatically configures appropriate beans.\n\nFor example, if spring-boot-starter-data-jpa is on the classpath and you have a DataSource configured in properties, Spring Boot will automatically configure JPA repositories, entity manager, and transaction management with sensible defaults.\n\nSpring Boot also includes an embedded Tomcat server, so you can package your application as a single JAR and run it directly without deploying to an external server. This is ideal for containerized deployments.`,
        followup_questions: `- What is Spring Boot auto-configuration and how does it work internally?\n- What are Spring Boot starters and how do you create a custom one?\n- How do you configure environment-specific properties in Spring Boot?\n- What is Spring Boot Actuator and which endpoints are useful in production?\n- How do you disable a specific auto-configuration?\n- What is the difference between @Component, @Service, @Repository, and @Controller?`,
      }
    },
    {
      title: 'How does dependency injection work in Spring Boot',
      metaTitle: 'Dependency Injection in Spring Boot - Constructor vs Field Injection',
      metaDesc: 'Learn how Spring Boot dependency injection works and the best practices for constructor vs field injection.',
      concepts: ['Dependency Injection', 'Spring Boot', 'IoC Container', 'Spring Framework'],
      quiz: { q: 'Which type of dependency injection is recommended in Spring Boot for mandatory dependencies?', opts: ['Field injection','Setter injection','Constructor injection','Method injection'], ans: 'Constructor injection' },
      sections: {
        interviewer_expectation: `Dependency injection is the heart of Spring. Interviewers want to see that you understand:\n\n- What a Spring IoC container is.\n- The different injection types and their trade-offs.\n- Why constructor injection is preferred.\n- How @Autowired, @Qualifier, and @Primary work.\n- How to handle circular dependencies.`,
        core_concepts: `**Inversion of Control (IoC):**\nInstead of a class creating its own dependencies, Spring's IoC container creates and injects them. This decouples classes and makes testing easier.\n\n**Types of Dependency Injection:**\n\n**1. Constructor Injection (Recommended):**\n- Dependencies injected via constructor.\n- Ensures dependencies are not null.\n- Supports immutability (final fields).\n- Easier to test.\n\n**2. Setter Injection:**\n- Dependencies injected via setter methods.\n- Allows optional dependencies.\n- Mutable — not recommended for mandatory dependencies.\n\n**3. Field Injection (@Autowired on field):**\n- Convenient but discouraged.\n- Harder to test (requires reflection or Spring context).\n- Hides dependencies.\n\n| Type | Pros | Cons |\n|------|------|------|\n| Constructor | Immutable, testable | Verbose with many deps |\n| Setter | Optional dependencies | Mutable, null risk |\n| Field | Concise | Hard to test, hides deps |`,
        important_points: `- Spring 4.3+: @Autowired on constructors is optional if there's only one constructor.\n- Use @Qualifier to resolve disambiguation when multiple beans of same type exist.\n- Use @Primary to mark the default bean when multiple candidates are present.\n- Circular dependencies can be broken with @Lazy injection or refactoring.\n- In unit tests, constructor injection allows easy mocking with Mockito (no Spring context needed).\n- Spring Boot uses @ComponentScan to discover beans annotated with @Component, @Service, @Repository, @Controller.`,
        code_example: `\`\`\`java
// Recommended: Constructor injection
@Service
public class OrderService {
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final EmailService emailService;

    // @Autowired is optional with Spring 4.3+ when single constructor
    public OrderService(UserRepository userRepository,
                        PaymentService paymentService,
                        EmailService emailService) {
        this.userRepository = userRepository;
        this.paymentService = paymentService;
        this.emailService = emailService;
    }
}

// Multiple beans of same type - use @Qualifier
@Service
@Qualifier("stripe")
public class StripePaymentService implements PaymentService { ... }

@Service
@Qualifier("paypal")
public class PayPalPaymentService implements PaymentService { ... }

@Service
public class CheckoutService {
    private final PaymentService paymentService;

    public CheckoutService(@Qualifier("stripe") PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
\`\`\``,
        speakable_answer: `Dependency injection in Spring Boot means that instead of classes creating their own dependencies using the new keyword, Spring's IoC container creates and injects those dependencies automatically.\n\nThere are three ways to inject: constructor injection, setter injection, and field injection. Constructor injection is the recommended approach because it makes dependencies explicit, supports immutability with final fields, and is easy to test without a Spring context — you just pass mock objects to the constructor.\n\nField injection using @Autowired on a field is concise but discouraged because it hides dependencies and makes unit testing harder.\n\nSpring discovers beans by scanning packages for classes annotated with @Component, @Service, @Repository, or @Controller, and then wires them together based on type. When there are multiple beans of the same type, you use @Qualifier to specify which one to inject.`,
        followup_questions: `- What is the difference between @Component, @Service, and @Repository?\n- How do you resolve circular dependency in Spring?\n- What is @Autowired and when can you omit it?\n- How does Spring handle bean scopes (singleton, prototype, request, session)?\n- What is @Primary and when would you use it?\n- How do you test a Spring service class without loading the full application context?`,
      }
    },
    {
      title: 'How does Spring Boot auto-configuration work internally',
      metaTitle: 'Spring Boot Auto-Configuration Internals Explained',
      metaDesc: 'Deep dive into how Spring Boot auto-configuration works using @Conditional and spring.factories.',
      concepts: ['Spring Boot', 'Auto Configuration', 'Spring Framework'],
      quiz: { q: 'What file does Spring Boot use to register auto-configuration classes?', opts: ['spring.factories','auto-config.xml','beans.xml','META-INF/spring/autoconfigure'], ans: 'spring.factories' },
      sections: {
        interviewer_expectation: `Senior interviewers often ask this to separate developers who just use Spring Boot from those who understand it. At 1–3 years, knowing the basics of auto-configuration internals shows depth.\n\n- Understand @EnableAutoConfiguration and what it triggers.\n- Know about @Conditional annotations.\n- Know about spring.factories / AutoConfiguration.imports.\n- Be ready to discuss how to create a custom auto-configuration (bonus).`,
        core_concepts: `**Auto-configuration trigger:**\n@SpringBootApplication includes @EnableAutoConfiguration, which imports AutoConfigurationImportSelector.\n\nThis reads the file:\n- Pre-Boot 2.7: META-INF/spring.factories under org.springframework.boot.autoconfigure.EnableAutoConfiguration\n- Boot 2.7+: META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports\n\n**@Conditional annotations filter which configurations apply:**\n- @ConditionalOnClass: only if a class is on classpath\n- @ConditionalOnMissingBean: only if a bean doesn't already exist\n- @ConditionalOnProperty: only if a property is set\n- @ConditionalOnWebApplication: only for web apps\n\n**Example flow for DataSource:**\n1. DataSourceAutoConfiguration is listed in spring.factories\n2. @ConditionalOnClass checks if JDBC Driver class exists\n3. @ConditionalOnMissingBean checks if user defined a DataSource bean\n4. If all conditions pass, Spring Boot creates a default DataSource from application.properties`,
        important_points: `- Auto-configuration is lower priority than user-defined beans.\n- If you define a DataSource bean yourself, the auto-configured one is skipped (@ConditionalOnMissingBean).\n- You can see which auto-configs are applied by running with --debug flag.\n- The ConditionEvaluationReport shows why each auto-config was applied or skipped.\n- You can exclude auto-configs: @SpringBootApplication(exclude = {SecurityAutoConfiguration.class}).\n- starters (spring-boot-starter-*) pull in the right dependencies AND trigger relevant auto-configurations.`,
        code_example: `\`\`\`java
// Custom auto-configuration class
@Configuration
@ConditionalOnClass(ObjectMapper.class)
@ConditionalOnMissingBean(ObjectMapper.class)
public class CustomJsonAutoConfiguration {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }
}

// Register in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
// com.myapp.config.CustomJsonAutoConfiguration

// In application.properties - override auto-configured settings
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=user
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=validate
\`\`\``,
        speakable_answer: `Spring Boot auto-configuration works by scanning a list of candidate configuration classes when the application starts. The @SpringBootApplication annotation includes @EnableAutoConfiguration, which triggers AutoConfigurationImportSelector to read a file called spring.factories (or in newer versions, AutoConfiguration.imports) from each JAR on the classpath.\n\nEach auto-configuration class is annotated with conditional annotations that determine whether it should activate. For example, @ConditionalOnClass checks if a specific class is on the classpath, @ConditionalOnMissingBean checks if the user hasn't already defined their own bean, and @ConditionalOnProperty checks if a specific property is set.\n\nThis means Spring Boot only configures what's needed and always defers to your explicit configuration. You can see the evaluation report by running the app with the --debug flag.`,
        followup_questions: `- How do you create a custom Spring Boot starter?\n- What is the difference between @Configuration and @Component?\n- How do you conditionally load beans in Spring Boot?\n- What is spring.factories used for?\n- How does Spring Boot pick up application.properties vs application.yml?\n- What is the order of property sources in Spring Boot?`,
      }
    },
    {
      title: 'What are Spring Boot profiles and how do you configure environment-specific settings',
      metaTitle: 'Spring Boot Profiles: Environment-Specific Configuration Guide',
      metaDesc: 'Learn how to use Spring Boot profiles to configure different environments like dev, staging, and production.',
      concepts: ['Spring Boot', 'Spring Profiles', 'Configuration Management'],
      quiz: { q: 'How do you activate a Spring Boot profile via command line?', opts: ['-Dprofile=prod','--spring.profiles.active=prod','--profile=prod','-Pprofile=prod'], ans: '--spring.profiles.active=prod' },
      sections: {
        interviewer_expectation: `Profiles are essential in real-world Spring Boot projects. Every team uses multiple environments (dev, staging, prod), and interviewers expect you to know how to configure them properly.\n\nKey areas:\n- How to define profile-specific property files.\n- How to activate profiles (CLI, env variable, @ActiveProfiles in tests).\n- How to use @Profile on beans.\n- How to handle secrets in production (never commit passwords to source control).`,
        core_concepts: `**Spring Boot Profiles** allow you to have different configurations for different environments.\n\n**Profile-specific property files:**\n- application-dev.properties\n- application-prod.properties\n- application-test.properties\n\nSpring Boot loads application.properties first, then overlays profile-specific properties.\n\n**Activating profiles:**\n- application.properties: spring.profiles.active=dev\n- CLI: java -jar app.jar --spring.profiles.active=prod\n- Environment variable: SPRING_PROFILES_ACTIVE=prod\n- In tests: @ActiveProfiles("test")\n\n**@Profile on beans:**\n- @Profile("prod") — bean only created in prod\n- @Profile("!prod") — bean created in all profiles except prod`,
        important_points: `- Never put production credentials in source code or committed property files.\n- Use environment variables or secret managers (AWS Secrets Manager, Vault) for production secrets.\n- In Docker/Kubernetes, set SPRING_PROFILES_ACTIVE as an environment variable.\n- Profile groups (Spring Boot 2.4+): spring.profiles.group.production[0]=proddb allows grouping.\n- The @ConfigurationProperties annotation maps external properties to typed Java classes.\n- By default, default profile is active if no profile is set.\n- application.yml supports profile sections with --- delimiter.`,
        code_example: `\`\`\`yaml
# application.yml (base config)
spring:
  application:
    name: my-service
  profiles:
    active: dev  # default for local

---
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:h2:mem:devdb
    username: sa
    password:

---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: \${DB_URL}         # from environment variable
    username: \${DB_USER}
    password: \${DB_PASS}
  jpa:
    hibernate:
      ddl-auto: validate   # never auto-create in prod
\`\`\`
\`\`\`java
// Profile-specific bean
@Service
@Profile("dev")
public class MockEmailService implements EmailService {
    public void send(String to, String body) {
        log.info("DEV: Would send email to: {}", to);
    }
}

@Service
@Profile("prod")
public class SmtpEmailService implements EmailService {
    public void send(String to, String body) {
        // actual SMTP sending
    }
}
\`\`\``,
        speakable_answer: `Spring Boot profiles allow you to define different configurations for different environments — typically dev, test, staging, and production.\n\nYou create profile-specific property files like application-dev.properties and application-prod.properties. Spring Boot loads the base application.properties first and then overlays the profile-specific file on top.\n\nYou activate a profile with the spring.profiles.active property, which you can set in many ways: in the properties file itself for local defaults, via command-line argument when starting the app, or via the SPRING_PROFILES_ACTIVE environment variable — which is the preferred method for containers and cloud deployments.\n\nFor sensitive values like database passwords in production, I use environment variables referenced with \${DB_PASS} in properties files, so credentials are never committed to source control.`,
        followup_questions: `- How do you handle secrets in production Spring Boot apps?\n- What is @ConfigurationProperties and how is it different from @Value?\n- What is the difference between application.yml and application.properties?\n- How do you test with a specific profile in Spring Boot?\n- What is Spring Cloud Config and how does it help?\n- Can you have multiple profiles active at the same time?`,
      }
    },
    {
      title: 'What is Spring Boot Actuator and what does it provide for production monitoring',
      metaTitle: 'Spring Boot Actuator: Production Monitoring and Health Checks',
      metaDesc: 'Learn how Spring Boot Actuator provides health checks, metrics, and monitoring endpoints for production Java apps.',
      concepts: ['Spring Boot', 'Spring Boot Actuator', 'Monitoring', 'Health Check'],
      quiz: { q: 'Which Actuator endpoint checks if a Spring Boot application is healthy?', opts: ['/actuator/status','/actuator/health','/actuator/ping','/actuator/alive'], ans: '/actuator/health' },
      sections: {
        interviewer_expectation: `Actuator is commonly used in production and interviewers test it to see if you have real-world experience. Key areas:\n\n- Know the important endpoints: /health, /info, /metrics, /env, /loggers.\n- Know how to secure Actuator endpoints (they expose sensitive info).\n- Understand integration with Prometheus/Grafana via Micrometer.\n- Be able to create custom health indicators.\n- Know how to configure which endpoints are exposed.`,
        core_concepts: `**Spring Boot Actuator** adds production-ready features to Spring Boot applications via HTTP or JMX endpoints.\n\n**Key endpoints:**\n\n| Endpoint | Purpose |\n|----------|---------|\n| /actuator/health | App health status (UP/DOWN) |\n| /actuator/info | App metadata (version, build info) |\n| /actuator/metrics | JVM, HTTP, system metrics |\n| /actuator/env | Environment properties |\n| /actuator/loggers | View/change log levels at runtime |\n| /actuator/beans | All Spring beans in context |\n| /actuator/mappings | All @RequestMapping endpoints |\n| /actuator/threaddump | Thread state |\n\n**Micrometer integration:**\nActuator integrates with Micrometer for metrics. Out-of-the-box Prometheus, CloudWatch, Datadog exports available.`,
        important_points: `- Only /health and /info are exposed over HTTP by default — others must be explicitly enabled.\n- Never expose all endpoints on a public-facing port in production.\n- Secure Actuator: use a separate management port, or Spring Security to limit access.\n- Custom HealthIndicator: implement HealthIndicator to add DB, external service checks.\n- /actuator/health/liveness and /actuator/health/readiness for Kubernetes probes.\n- /actuator/loggers lets you change log levels at runtime without restart — very useful for debugging prod issues.\n- Use @Endpoint to create completely custom Actuator endpoints.`,
        code_example: `\`\`\`yaml
# application.yml - Actuator configuration
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,loggers
  endpoint:
    health:
      show-details: when-authorized
  server:
    port: 8081  # separate management port for security
\`\`\`
\`\`\`java
// Custom health indicator
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final DataSource dataSource;

    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute("SELECT 1");
            return Health.up()
                         .withDetail("database", "PostgreSQL")
                         .withDetail("status", "connected")
                         .build();
        } catch (SQLException e) {
            return Health.down()
                         .withDetail("error", e.getMessage())
                         .build();
        }
    }
}
\`\`\``,
        speakable_answer: `Spring Boot Actuator adds a set of production-ready monitoring and management endpoints to your application without any custom code.\n\nThe most important endpoints are /actuator/health, which returns the health status of the application; /actuator/metrics, which exposes JVM and HTTP performance metrics; and /actuator/loggers, which lets you view and change log levels at runtime without restarting.\n\nBy default, only the health and info endpoints are accessible over HTTP for security reasons. You configure which endpoints to expose in application.properties.\n\nIn production, I run the management server on a separate port that's not exposed to the public internet. For Kubernetes, the /actuator/health/liveness and /actuator/health/readiness endpoints integrate directly with pod health probes. Actuator also integrates with Micrometer to export metrics to Prometheus and Grafana dashboards.`,
        followup_questions: `- How do you secure Spring Boot Actuator endpoints?\n- What is Micrometer and how does it work with Actuator?\n- How do you implement a custom HealthIndicator?\n- What is the difference between liveness and readiness probes in Kubernetes?\n- How do you expose custom metrics via Actuator?\n- How do you add build information to /actuator/info?`,
      }
    },
  ],
};

// ── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  const client = await pool.connect();
  try {
    // Verify connection
    console.log('✓ Testing connection...');
    await client.query('SELECT 1');
    console.log('✓ Connection OK');

    // Verify domain exists
    const domainRes = await client.query("SELECT id FROM domains WHERE slug = 'java-backend-1-3'");
    if (!domainRes.rows.length) { console.error('✗ Domain java-backend-1-3 not found! Stopping.'); return; }
    const domainId = domainRes.rows[0].id;
    console.log(`✓ Domain id: ${domainId}`);

    // Fetch stacks for domain
    const stacksRes = await client.query(
      `SELECT ts.id, ts.slug, ts.name FROM domain_stack_map dsm
       JOIN tech_stacks ts ON ts.id = dsm.stack_id
       JOIN domains d ON d.id = dsm.domain_id
       WHERE d.slug = 'java-backend-1-3' ORDER BY dsm.display_order`
    );
    if (!stacksRes.rows.length) { console.error('✗ No stacks for java-backend-1-3! Stopping.'); return; }
    console.log(`✓ Stacks found: ${stacksRes.rows.map(s => s.slug).join(', ')}`);

    const stackMap = {};
    for (const s of stacksRes.rows) stackMap[s.slug] = s;

    // Existing QSI per stack
    const qsiRes = await client.query(
      `SELECT qsi.stack_id, COUNT(*) as cnt FROM question_stack_index qsi GROUP BY qsi.stack_id`
    );
    const existingCounts = {};
    for (const r of qsiRes.rows) existingCounts[r.stack_id] = parseInt(r.cnt);

    // Process each stack in QUESTIONS
    for (const [stackSlug, questions] of Object.entries(QUESTIONS)) {
      const stack = stackMap[stackSlug];
      if (!stack) { console.log(`  ⚠ Stack ${stackSlug} not in domain, skipping`); continue; }

      const stackId = stack.id;
      let orderIndex = (existingCounts[stackId] || 0) + 1;

      console.log(`\n▶ Processing stack: ${stackSlug} (id=${stackId})`);

      for (const q of questions) {
        await client.query('BEGIN');
        try {
          // Generate base slug
          const baseSlug = toSlug(q.title);
          const slug = await uniqueSlug(client, baseSlug);

          // Insert question
          const qRes = await client.query(
            `INSERT INTO questions(title, slug, difficulty, estimated_read_time, meta_title, meta_description)
             VALUES($1,$2,'medium',4,$3,$4) RETURNING id`,
            [q.title, slug, q.metaTitle, q.metaDesc]
          );
          const questionId = qRes.rows[0].id;
          console.log(`  ✓ Question [${questionId}]: ${q.title.substring(0, 50)}...`);

          // Map to stack
          await client.query(
            `INSERT INTO question_stack_index(stack_id, question_id, order_index) VALUES($1,$2,$3)`,
            [stackId, questionId, orderIndex++]
          );

          // Insert 6 answer sections
          const sectionTypes = [
            'interviewer_expectation', 'core_concepts', 'important_points',
            'code_example', 'speakable_answer', 'followup_questions'
          ];
          for (let i = 0; i < sectionTypes.length; i++) {
            const sType = sectionTypes[i];
            const content = q.sections[sType];
            if (!content) throw new Error(`Missing section ${sType} for question: ${q.title}`);
            await client.query(
              `INSERT INTO answer_sections(question_id, section_type, section_order, content) VALUES($1,$2::answer_section_enum,$3,$4)`,
              [questionId, sType, i + 1, content]
            );
          }

          // Insert concepts
          const conceptIds = [];
          for (const cName of q.concepts) {
            const cId = await getOrCreateConcept(client, cName);
            conceptIds.push(cId);
            // Link concept to question via question_concept if table exists
            try {
              await client.query(
                `INSERT INTO question_concepts(question_id, concept_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,
                [questionId, cId]
              );
            } catch (_) { /* table may not exist, skip */ }
          }

          // Insert quiz
          const optionsJson = JSON.stringify(q.quiz.opts);
          await client.query(
            `INSERT INTO question_quizzes(question_id, quiz_question, options, correct_answer) VALUES($1,$2,$3,$4)`,
            [questionId, q.quiz.q, optionsJson, q.quiz.ans]
          );

          await client.query('COMMIT');
          console.log(`    ✓ Committed (sections, quiz done)`);
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`    ✗ ROLLBACK for "${q.title}": ${err.message}`);
        }
      }
    }

    // After all questions inserted, add relations within each stack
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
          } catch (_) { /* skip if relation already exists */ }
        }
      }
    }
    console.log('✓ Relations done');

    // Final validation
    console.log('\n▶ Final validation...');
    const validation = await client.query(
      `SELECT ts.slug, COUNT(qsi.question_id) as q_count
       FROM domain_stack_map dsm
       JOIN tech_stacks ts ON ts.id = dsm.stack_id
       JOIN domains d ON d.id = dsm.domain_id
       LEFT JOIN question_stack_index qsi ON qsi.stack_id = ts.id
       WHERE d.slug = 'java-backend-1-3'
       GROUP BY ts.slug ORDER BY ts.slug`
    );
    console.log('\nStack | Questions');
    console.log('------|----------');
    for (const r of validation.rows) {
      console.log(`${r.slug.padEnd(30)} | ${r.q_count}`);
    }
    console.log('\n✓ Done!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
