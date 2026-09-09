#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(
  repoRoot,
  "content/java-backend-fresher/java-jvm-memory/jvm-architecture/complete-qa.json",
);
const document = JSON.parse(fs.readFileSync(target, "utf8"));
const entries = Array.isArray(document) ? document : document.questions;
if (!Array.isArray(entries)) throw new Error("Expected an array or a questions array");

const lessons = {
  "what-is-the-jvm": {
    direct: "The Java Virtual Machine is an abstract execution machine defined by a specification and implemented by runtimes such as HotSpot. It loads and verifies class files, executes bytecode, manages runtime memory and threads, and provides the platform boundary that lets the same valid class file run on different systems.",
    difficulty: "easy",
    minutes: 9,
    quick: [
      "The JVM is a specified abstract machine; HotSpot is one concrete implementation.",
      "`javac` normally turns Java source into platform-independent class-file bytecode.",
      "The JVM loads, links, verifies, initializes, and executes classes.",
      "It supplies managed runtime services such as memory areas, garbage collection, threads, and native interoperation.",
      "The JDK includes development tools and a runtime containing a JVM; the JVM is not the whole JDK.",
    ],
    interview: "The Java Virtual Machine, or JVM, is the runtime that executes Java class files. The JVM specification defines the common rules, while an implementation such as HotSpot provides those rules for a particular operating system and processor.\n\nJava source is normally compiled by `javac` into `.class` files containing bytecode. At runtime, the JVM loads the required classes, checks the class-file structure, links references, initializes classes when needed, and executes their methods.\n\nFor example, the same `Hello.class` can run on an x64 Linux JVM and an ARM macOS JVM. Each JVM understands the same bytecode and turns it into work for its own machine. Native libraries can still be platform-specific.\n\nThe JVM also manages runtime memory, garbage collection, threads, exceptions, and access to native code. It may interpret bytecode or compile hot code to native instructions. The JVM is not the whole JDK: the JDK also contains development tools such as `javac`, `jar`, and `javap`.",
    deepTitle: "The specification leaves room for different implementations",
    deep: "**Why an abstract machine matters**\n\nThe JVMS describes an instruction set, class-file format, runtime areas, and execution rules without prescribing one concrete object layout, garbage collector, JIT strategy, or memory-address arrangement. HotSpot, OpenJ9, and another compliant implementation can organise their internals differently while preserving the behaviour required by the specification.\n\n**From source code to JVM execution**\n\nWhen `javac` compiles `System.out.println(2 + 3)`, it produces a class file for the JVM instruction set. A Linux x86-64 runtime and a macOS ARM runtime both understand that class-file contract. Each runtime loads and verifies the class, then interprets or compiles its methods into a form its own processor can execute. The shared class file is portable; the runtime's generated machine instructions are not.\n\n**The boundary of JVM portability**\n\nCode using Java's standard APIs can usually move between compatible runtimes, but JNI libraries, operating-system paths, external commands, file permissions, native fonts, timing assumptions, and vendor-specific flags can tie an application to one environment. The JVM creates a portable execution boundary; it does not make every dependency portable.\n\n**Managed does not mean automatic correctness**\n\nBytecode verification checks structural and type-safety rules, and garbage collection manages unreachable heap storage. Neither proves that authorization rules are correct, prevents a data race, or chooses the right algorithm. The useful mental model is a well-defined execution contract plus runtime services, with application correctness still belonging to the program.",
    visualType: "flow_diagram",
    visualTitle: "The JVM sits between portable class files and one machine",
    visual: "```mermaid\nflowchart LR\n  S[Java or another JVM language] --> C[Compiler]\n  C --> B[Class files + JVM bytecode]\n  B --> L[Class loading, linking, verification]\n  L --> E[JVM execution + managed runtime]\n  E --> N[Native instructions and operating-system services]\n  H[HotSpot / another JVM implementation] --> E\n```",
    codeTitle: "Ask the running JVM which implementation it is",
    code: "```java\nclass WhatIsTheJvm {\n    public static void main(String[] args) {\n        System.out.println(System.getProperty(\"java.vm.name\"));\n        System.out.println(System.getProperty(\"java.vm.vendor\"));\n        System.out.println(System.getProperty(\"java.vm.version\"));\n    }\n}\n```",
    practiceTitle: "Separate portable and platform-specific parts",
    practice: "Classify each dependency in an application: class-file bytecode, standard Java API, vendor JVM option, JNI library, operating-system command, or external service. Only the first two are covered by the usual “write once, run anywhere” expectation.",
    followups: [
      "What is the difference between the JVM specification and HotSpot?",
      "Is JIT compilation required by the JVM specification?",
      "What is the difference between the JVM and the JDK?",
    ],
  },
  "jvm-architecture-components": {
    direct: "A useful JVM architecture model has three layers: class loading/linking/initialization, runtime data areas, and execution/runtime services. The specification defines class-file and runtime-area behavior, while components such as HotSpot's interpreter, JIT compilers, garbage collectors, code cache, and JNI are implementation facilities.",
    difficulty: "easy",
    minutes: 11,
    quick: [
      "Class loading finds class definitions; linking verifies, prepares, and may resolve them; initialization runs class initialization code.",
      "Per-thread areas include a JVM stack, frames, and a program-counter register.",
      "Shared areas include the heap and method area; each class also has a runtime constant pool in the method area.",
      "Frames hold local variables, an operand stack, and data needed for method execution and linking.",
      "Interpreters, JIT compilers, collectors, JNI, and diagnostic services are implementation components around the specified model.",
    ],
    interview: "The main JVM parts can be grouped into class loading, runtime memory, and execution. Class loaders find class definitions. The JVM then verifies and links each class, and runs its static initialization when the class is first actively used.\n\nRuntime memory includes the shared heap for objects and arrays and the shared method area for class information. Each thread also has its own program counter and JVM stack. Every method call creates a frame with local values and an operand stack.\n\nThe execution engine runs bytecode and provides services such as exception handling, synchronization, and automatic memory management. HotSpot uses an interpreter, JIT compilers, a code cache, garbage collectors, and JNI support, although another JVM can implement these services differently.\n\nFor example, calling `order.total()` creates a frame on the current thread's stack. The `Order` object stays in the shared heap, its class information belongs to shared class data, and a hot version of the method may run as compiled native code. This separates portable JVM concepts from HotSpot implementation details.",
    deepTitle: "Runtime areas have logical ownership and lifetime",
    deep: "**Group the areas by ownership**\n\nPer-thread areas are created with a thread and cannot be directly used as another thread's JVM stack. The program-counter register identifies the current JVM instruction, and the stack holds that thread's active frames. The heap and method area begin with the VM and are logically shared across threads.\n\n**A method call through the JVM**\n\nFor `order.total()`, the current thread creates a frame. A local slot contains the `order` reference, but the Order object remains in shared heap storage. Bytecode moves operands through the frame's operand stack and returns the result to the caller. The frame disappears whether the call returns normally or exits through an uncaught exception; the Order can remain reachable through other references.\n\n**Logical JVM areas and physical memory**\n\nThe JVM specification defines behaviour and lifetime, not a mandatory map of operating-system memory. An implementation may represent frames, object references, metadata, and compiled code in ways that an application cannot observe. Metaspace and code cache are useful HotSpot terms, while method area and JVM stacks are specification terms.\n\n**Runtime failures as memory-area evidence**\n\nDeep invocation can produce `StackOverflowError`; inability to provide heap, method-area, or stack expansion can produce an `OutOfMemoryError` under the specified conditions. The error detail, GC logs, thread dump, class-loading data, and native-memory evidence identify the actual area. One architecture diagram should therefore show ownership and flow without pretending every box is the same kind of component.",
    visualType: "architecture_diagram",
    visualTitle: "Specified lifecycle and runtime areas around execution",
    visual: "```mermaid\nflowchart TD\n  CF[Class file] --> LD[Loading]\n  LD --> LK[Linking: verify, prepare, resolve]\n  LK --> IN[Initialization]\n  IN --> EX[Execution]\n  EX --> TS[Per-thread: PC + JVM stack + frames]\n  EX --> HE[Shared heap: objects + arrays]\n  EX --> MA[Shared method area + runtime constant pools]\n  EX --> NI[Native methods / JNI]\n  HS[HotSpot interpreter, JIT, GC, code cache] -. implements .-> EX\n```",
    codeTitle: "Observe shared heap data and per-call local state",
    code: "```java\nclass JvmComponents {\n    private final int base;\n\n    JvmComponents(int base) {\n        this.base = base;\n    }\n\n    int add(int value) {\n        int result = base + value; // value and result belong to this invocation's frame\n        return result;\n    }\n\n    public static void main(String[] args) {\n        JvmComponents object = new JvmComponents(40);\n        System.out.println(object.add(2));\n    }\n}\n```",
    practiceTitle: "Label every box as specification or implementation",
    practice: "In a JVM diagram, mark heap, method area, stacks, frames, and PC registers as specification concepts. Mark C1/C2, G1, code cache, and Metaspace as HotSpot implementation terms. This removes many false equivalences.",
    followups: [
      "Which JVM runtime areas are per thread?",
      "What is stored in a JVM frame?",
      "Why is a HotSpot JIT compiler not a runtime data area?",
    ],
  },
  "what-is-classloader": {
    direct: "A ClassLoader finds or generates the binary definition for a named class and asks the JVM to define it. Java's built-in bootstrap, platform, and system loaders usually delegate upward before searching themselves; loading is separate from linking and class initialization.",
    difficulty: "easy",
    minutes: 10,
    quick: [
      "Loading finds class bytes and creates the runtime Class representation.",
      "Built-in loaders are bootstrap, platform, and system/application loaders.",
      "The usual delegation model asks the parent before the child defines a class.",
      "Linking verifies, prepares, and resolves; initialization executes static initialization when required.",
      "Runtime class identity includes both the binary name and the defining class loader.",
    ],
    interview: "A `ClassLoader` finds class definitions and helps the JVM create their runtime `Class` objects. Classes are usually read from `.class` files, but a custom loader can obtain the bytes from another source. Classes are normally loaded when they are needed, not all at startup.\n\nJava has a bootstrap loader for core classes, a platform loader for platform classes, and a system or application loader for application code. `loadClass` usually uses parent-first delegation: it checks whether the class is already loaded, asks the parent, and only then tries its own `findClass`.\n\nLoading is only the first step. Linking verifies the class, prepares static fields with initial values, and resolves symbolic references when required. Initialization later runs static field initializers and static blocks on active use. `Class.forName(name, false, loader)` can load without requesting initialization.\n\nFor example, `String.class.getClassLoader()` normally returns null because the bootstrap loader defines String. Two different loaders can define the same binary name, but the JVM treats them as different types because class identity includes the defining loader. This supports plugin isolation but can also lead to surprising `ClassCastException` errors.",
    deepTitle: "Defining loader controls both identity and unloadability",
    deep: "**Defining and initiating are different roles**\n\nA loader that calls the JVM's definition machinery for a class is its defining loader. A different loader can initiate the request and receive the result through delegation. Runtime class identity includes the binary name and the defining loader, so two definitions named `com.example.Plugin` can be incompatible types.\n\n**Class loaders in a plugin boundary**\n\nAn application can give each plugin its own child loader. The child finds plugin classes while delegating shared API types to a parent. This allows two plugins to carry different private library versions, yet both can implement one interface defined by the parent. If each child also defined its own copy of that interface, casts would fail even though the source names look identical.\n\n**Loader lifetime becomes class lifetime**\n\nClasses are unloaded as part of unloading their defining loader and associated classes. A static registry, running thread, thread-context class loader, cache key, or callback can accidentally retain an old plugin loader. Then its class metadata, static fields, and related resources remain reachable after redeployment.\n\n**Resources have an extra boundary**\n\nResource lookup resembles class lookup but is not identical in every module context. Named modules can encapsulate resources, so a visible class does not mean every resource path is freely visible. When debugging, ask separately: which loader received the request, which loader defined the type, whether delegation found a parent copy, and whether module rules permit the resource.",
    visualType: "flow_diagram",
    visualTitle: "The normal parent-first loading path",
    visual: "```mermaid\nflowchart TD\n  R[loadClass binary name] --> A{Already loaded?}\n  A -- Yes --> C[Return existing Class]\n  A -- No --> P[Delegate to parent]\n  P -->|found| C\n  P -->|not found| F[findClass in child]\n  F --> D[defineClass: JVM verifies representation]\n  D --> C\n  C --> L[Link when required]\n  L --> I[Initialize only on active-use trigger]\n```",
    codeTitle: "See which built-in loader defined each class",
    code: "```java\nclass ClassLoaderRoles {\n    public static void main(String[] args) {\n        ClassLoader app = ClassLoaderRoles.class.getClassLoader();\n        System.out.println(\"application: \" + app);\n        System.out.println(\"parent: \" + app.getParent());\n        System.out.println(\"String loader: \" + String.class.getClassLoader());\n    }\n}\n```",
    practiceTitle: "Keep loading, linking, and initialization separate",
    practice: "When a static block has not run, do not conclude that the class bytes were never loaded. Ask separately whether the class was defined, linked, and actively initialized.",
    followups: [
      "Why does String.class.getClassLoader usually return null?",
      "Can two classes with the same binary name be different types?",
      "What is the difference between loading and initialization?",
    ],
  },
  "what-is-jit-compilation": {
    direct: "Just-in-time compilation translates selected JVM bytecode into native machine code while the program runs. HotSpot profiles execution, compiles hot paths in tiers, applies runtime-informed optimizations, and can deoptimize compiled code when an assumption no longer holds.",
    difficulty: "easy",
    minutes: 10,
    quick: [
      "`javac` compiles source to bytecode; a JIT compiler can later compile bytecode to native code.",
      "HotSpot profiles the running program and focuses compilation on frequently executed paths.",
      "Tiered compilation balances startup speed, profiling quality, and peak optimization.",
      "Runtime assumptions enable inlining and specialization but can require deoptimization.",
      "JIT causes warm-up effects; benchmark with a harness such as JMH rather than a single stopwatch loop.",
    ],
    interview: "JIT means just-in-time compilation. `javac` first compiles Java source into portable JVM bytecode. While the program is running, the JVM can compile frequently used bytecode into native machine code for the current processor.\n\nHotSpot watches which methods and code paths run often. It can first use interpretation or a lower compilation tier, collect runtime information, and later compile hot code with stronger optimizations. Rarely used code may never reach the highest tier.\n\nFor example, a price-calculation method may run millions of times. Early calls include loading, profiling, and compilation work. Later calls can use optimized native code from the code cache. This is why the first call is not a good measure of steady-state performance.\n\nThe JIT can inline methods, remove repeated checks, and optimize loops. Some choices are based on runtime assumptions; if an assumption changes, HotSpot can deoptimize and continue safely. JIT is an implementation technique, not a requirement of the JVM specification, and its startup and memory costs mean performance should be measured with realistic workloads or JMH.",
    deepTitle: "Optimization can be speculative because the runtime can recover",
    deep: "**Profile first, specialise later**\n\nA virtual call may initially see only one implementation. HotSpot can record that observation, inline the common target, and optimise the surrounding code as one path. This removes call overhead and exposes more constant folding or loop optimisation than the bytecode alone would justify.\n\n**Speculation needs a safe exit**\n\nSuppose a pricing loop has only `RegularPrice` objects during warm-up. The compiled path can be specialised for that target while retaining metadata needed to recover. If a new `DiscountPrice` class later appears and invalidates the assumption, execution deoptimises to a correct less-specialised state. The runtime can collect new profiles and compile again. Correctness never depends on the speculation remaining true.\n\n**Warm-up is part of the experiment**\n\nA short command-line program may finish before highly optimised code pays back its compilation cost. A long-running service can benefit after repeated traffic. Compilation threads, profiles, and compiled methods also consume CPU and code-cache space, so more compilation is not automatically better.\n\nJIT logs and compiler flags describe one implementation, not portable application behaviour. For a real performance question, use a representative workload and a harness such as JMH, consume results so work cannot disappear, separate warm-up from measurement, and inspect diagnostics only after a repeatable difference exists.",
    visualType: "flow_diagram",
    visualTitle: "A hot method can move through compilation tiers",
    visual: "```mermaid\nstateDiagram-v2\n  [*] --> LoadedBytecode\n  LoadedBytecode --> Interpreted: begin execution\n  Interpreted --> ProfiledCode: becomes warm\n  ProfiledCode --> OptimizedNative: becomes hot\n  OptimizedNative --> Interpreted: assumption invalid / deoptimize\n  Interpreted --> OptimizedNative: compile again with new profile\n```",
    codeTitle: "A hot loop is eligible for runtime observation",
    code: "```java\nclass JitCompilation {\n    static long triangular(int n) {\n        long total = 0;\n        for (int i = 0; i <= n; i++) total += i;\n        return total;\n    }\n\n    public static void main(String[] args) {\n        long result = 0;\n        for (int i = 0; i < 100_000; i++) result = triangular(100);\n        System.out.println(result);\n    }\n}\n```\n\nThe loop creates repeated execution; it does not prove which tier a particular JVM chose. Use implementation diagnostics or JMH for that question.",
    practiceTitle: "Separate startup from steady state",
    practice: "When a benchmark reports one very fast or slow iteration, ask whether class loading, profiling, compilation, deoptimization, or dead-code elimination affected it. Use a proper harness before attributing the result to source code alone.",
    followups: [
      "What is the difference between javac and the JIT compiler?",
      "Why can optimized code be deoptimized?",
      "Why is one stopwatch loop a poor Java benchmark?",
    ],
  },
  "what-is-method-area-metaspace": {
    question: "What are the JVM method area and HotSpot Metaspace, and how are they related?",
    direct: "The method area is the JVM specification's shared logical storage for per-class structures, runtime constant pools, field and method data, and method code. Metaspace is HotSpot's native-memory area for class metadata; it is an implementation detail related to, but not identical to, the entire specified method area.",
    difficulty: "medium",
    minutes: 10,
    quick: [
      "The method area is a logical runtime area defined by the JVM specification and shared by all threads.",
      "It contains per-class structures, runtime constant pools, field/method information, and method bytecode.",
      "The specification does not mandate where the method area is physically stored or how it is managed.",
      "HotSpot stores class metadata in native memory called Metaspace; PermGen was removed in JDK 8.",
      "Class-loader leaks and excessive generated classes can retain metadata and cause `OutOfMemoryError: Metaspace`.",
    ],
    interview: "The method area is a shared logical memory area defined by the JVM specification. It holds per-class information such as the runtime constant pool, field and method details, and method bytecode. The specification does not require one physical layout for it.\n\nMetaspace is a HotSpot implementation detail. Since JDK 8, HotSpot stores class metadata in native memory called Metaspace instead of the older PermGen. Metaspace is related to the method area, but the two terms are not exactly the same level of description.\n\nFor example, an application server may load every deployment with a new class loader. If a static cache keeps old loaders reachable, their classes cannot be unloaded and Metaspace can keep growing. HotSpot may eventually throw `OutOfMemoryError: Metaspace`.\n\n`-XX:MaxMetaspaceSize` can place a limit on this native memory, but raising it does not fix a class-loader leak. Class metadata can be reclaimed when its defining loader and classes are no longer reachable and class unloading occurs. Heap tools and class-loading or native-memory diagnostics are used for different parts of this investigation.",
    deepTitle: "Class-loader lifetime controls groups of class metadata",
    deep: "**Method area and Metaspace**\n\nThe method area is the JVM specification's shared logical home for per-class structures. Metaspace is HotSpot's native-memory storage for class metadata. They are related, but treating them as identical hides that the specification allows different physical designs and HotSpot stores related runtime data in more than one place.\n\n**A class-loader redeployment leak**\n\nAn application server loads version 1 of a web application with loader A. After deployment of version 2, loader B defines the new classes. If a timer thread or static registry still references loader A, that loader and the classes it defined cannot complete their intended lifecycle. Repeating the deployment can grow class metadata until HotSpot reports `OutOfMemoryError: Metaspace`.\n\nClasses are not normally unloaded one arbitrary class at a time while their defining loader remains live. Dynamic proxies, bytecode generation, template engines, and repeated plugin loading can all produce legitimate metadata growth before reaching a plateau. A leak means old loaders or generated classes remain beyond their intended lifetime, not merely that the number rose once.\n\n**Evidence for Metaspace and heap usage**\n\nA heap dump is useful for heap objects and may reveal paths retaining class loaders, but it does not fully describe VM-native allocation. Class-loading counters, `jcmd`, GC/class-unloading logs, and HotSpot Native Memory Tracking can add the missing view. NMT must be enabled and has scope and overhead limits. Raising `-Xmx` targets the Java heap; `-XX:MaxMetaspaceSize` targets a different boundary.",
    visualType: "comparison_table",
    visualTitle: "Logical specification area versus HotSpot storage",
    visual: "| Term | Level | Holds or describes | Main failure clue |\n|---|---|---|---|\n| JVM method area | Specification | Per-class structures, runtime constant pool, field/method data, method code | Spec permits `OutOfMemoryError` if unavailable |\n| HotSpot Metaspace | Implementation | Native-memory class metadata | `OutOfMemoryError: Metaspace` |\n| Java heap | Specification/implementation | Class instances and arrays | Heap exhaustion or retained objects |\n| HotSpot code cache | Implementation | JIT-compiled native code | Compilation/code-cache diagnostics |",
    codeTitle: "Observe class-loading counts without confusing them with heap objects",
    code: "```java\nimport java.lang.management.ClassLoadingMXBean;\nimport java.lang.management.ManagementFactory;\n\nclass MethodAreaAndMetaspace {\n    public static void main(String[] args) {\n        ClassLoadingMXBean classes = ManagementFactory.getClassLoadingMXBean();\n        System.out.println(\"currently loaded: \" + classes.getLoadedClassCount());\n        System.out.println(\"total loaded: \" + classes.getTotalLoadedClassCount());\n        System.out.println(\"total unloaded: \" + classes.getUnloadedClassCount());\n    }\n}\n```",
    practiceTitle: "Read the OutOfMemoryError detail",
    practice: "A heap dump is a natural first tool for Java heap exhaustion. For a Metaspace failure, investigate class and class-loader growth plus native-memory limits; increasing `-Xmx` targets a different area.",
    followups: [
      "Why is Metaspace not exactly the complete method area?",
      "What normally has to become unreachable before classes can unload?",
      "Does increasing -Xmx directly increase MaxMetaspaceSize?",
    ],
  },
  "bytecode-vs-machine-code": {
    direct: "JVM bytecode is the platform-independent instruction and metadata format stored in class files; machine code is the processor-specific instruction sequence executed directly by a CPU. A JVM interprets bytecode or translates selected parts into native machine code for the current platform.",
    difficulty: "easy",
    minutes: 9,
    quick: [
      "`javac` normally produces class files containing JVM bytecode, not final CPU instructions.",
      "Bytecode targets the specified JVM instruction set and can move across compatible JVM platforms.",
      "Machine code targets a concrete architecture such as x86-64 or AArch64.",
      "The JVM verifies class-file constraints and executes bytecode through interpretation and/or compilation.",
      "`javap -c ClassName` disassembles bytecode; native code needs platform-specific diagnostics.",
    ],
    interview: "Java bytecode is the platform-independent instruction format stored in `.class` files. Machine code is made of instructions for a particular processor, such as x86-64 or AArch64, and the CPU executes it directly.\n\n`javac Hello.java` normally creates `Hello.class`, not one processor-specific executable. A compatible JVM on each platform understands the same class-file format. The JVM can interpret that bytecode or compile selected parts into native instructions for the current machine.\n\nFor example, the Java expression `a + b` can become bytecode that loads two local values, runs `iadd`, and returns the result. A HotSpot JVM on x86-64 and one on ARM may produce different machine instructions for that same bytecode.\n\nBytecode is lower-level than Java source but still targets the JVM rather than the physical CPU. Class verification checks class-file rules before normal execution, but it does not replace application security. Use `javap -c` to inspect bytecode; native assembly needs JVM- and platform-specific diagnostic tools.",
    deepTitle: "The class file carries symbols that become runtime links",
    deep: "**Bytecode instructions and native execution**\n\nA small `add(int, int)` method can load two local values, execute the JVM instruction `iadd`, and return the result. Those operations target the JVM's operand-stack model. An x86-64 processor and an ARM processor have different native instruction sets, so neither executes the class-file bytes directly as its normal machine code.\n\n**Symbols are linked at runtime**\n\nBytecode instructions often refer indirectly to classes, fields, methods, strings, and dynamic call-site data through a runtime constant pool. Loading and linking turn symbolic references such as a method owner and descriptor into runtime structures under type, access, and loader rules. Resolution may be lazy, within the timing allowed by the JVM specification.\n\n**Translation is not one-to-one**\n\nAn interpreter can execute a bytecode sequence instruction by instruction. A JIT compiler can instead inline several methods, remove a redundant allocation, hoist a check, or fold a result. The final native path may contain fewer, more, or very different machine instructions than a line-by-line bytecode translation suggests.\n\nUse `javap -c` to learn the class-file instruction flow; use runtime-specific assembly or compilation diagnostics only when the native result matters. The class file is the portable contract and the generated machine code is one run's platform-specific execution form. Source, bytecode, and native code are three related but distinct representations.",
    visualType: "comparison_table",
    visualTitle: "Bytecode and machine code target different machines",
    visual: "| Property | JVM bytecode | Native machine code |\n|---|---|---|\n| Target | JVM instruction set | Specific CPU architecture |\n| Typical container | `.class` file | Executable memory / native binary |\n| Portability | Across compatible JVMs | Platform-specific |\n| Execution | Interpreted or compiled by JVM | Directly by CPU |\n| Inspection | `javap -c` | Disassembler / JVM diagnostics |",
    codeTitle: "Compile this method, then inspect it with javap",
    code: "```java\nclass BytecodeVsMachineCode {\n    static int add(int left, int right) {\n        return left + right;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(add(20, 22));\n    }\n}\n```\n\nAfter `javac BytecodeVsMachineCode.java`, run `javap -c BytecodeVsMachineCode` to see instructions such as local loads, `iadd`, and return.",
    practiceTitle: "Name the target of each compilation step",
    practice: "Draw source → class file → runtime native code. Label the first compiler `javac` and the runtime compiler JIT. This prevents the common mistake of saying javac creates the machine code executed by every platform.",
    followups: [
      "What command disassembles Java bytecode?",
      "Can two JVM runs compile the same bytecode into different native code?",
      "Why is bytecode not the same as Java source?",
    ],
  },
  "what-happens-when-you-run-a-java-program": {
    direct: "When `java HelloWorld` runs a traditional class, the launcher starts a JVM, locates the initial class through the configured class path or module path, loads and links it, initializes it, invokes its accepted `main` entry point, loads dependencies as needed, and executes bytecode using that JVM's runtime strategy.",
    difficulty: "medium",
    minutes: 11,
    quick: [
      "The `java` launcher parses VM options, class/module location, the initial class, and application arguments.",
      "The JVM loads the initial class, then links it by verification, preparation, and resolution as required.",
      "Initialization runs required static initialization before the entry point executes.",
      "The main thread invokes the accepted `main` method and loads further classes on demand.",
      "Execution ends after the runtime's termination conditions, such as no live non-daemon threads or an explicit exit.",
    ],
    interview: "Running `java HelloWorld` starts the Java launcher and asks it to use `HelloWorld` as the initial class. Options before the class name can set the class path, module path, system properties, or memory settings.\n\nThe JVM locates and loads the class. Linking then verifies the class file, prepares static fields with default values, and resolves symbolic references when required. Initialization runs static field initializers and static blocks before normal use of the class.\n\nThe launcher then invokes the conventional `public static void main(String[] args)` entry point. For example, `java -cp out HelloWorld Ravi` searches `out` for the class and passes `Ravi` as `args[0]`. The `-cp out` part configures the launcher and does not enter the application's argument array.\n\nAs `main` runs, more classes are loaded when needed. Method calls create frames, objects and arrays use heap storage, garbage collection manages unreachable objects, and HotSpot may JIT-compile hot bytecode. The process normally stays alive while non-daemon threads remain and ends when the JVM's termination rules are met or an explicit exit occurs.",
    deepTitle: "Failures reveal which startup phase was reached",
    deep: "**Java execution phases and their failures**\n\n“Could not find or load main class” means the launcher could not locate or load the requested initial class with the supplied class/module path. An unsupported class-file version means the runtime is older than the class-file format it was asked to accept. `VerifyError` points to verification, while a linkage error can reveal an incompatible class or missing member. `NoClassDefFoundError` during execution can mean a needed definition is unavailable or that a previous initialization attempt failed.\n\n**Initialization happens before visible main work**\n\nBefore ordinary use of the initial class, the JVM initializes it as required. Static field initializers and static blocks run in class-initialization order. A failed static initializer prevents normal entry, and later uses can observe the recorded initialization failure. A long or circular initializer can make startup appear hung even though the launcher found the class correctly.\n\n**Arguments have two owners**\n\nIn `java -cp out Hello Ravi`, `-cp out` configures the launcher, `Hello` names the initial class, and `Ravi` becomes an application argument. Mixing their order can change whether the launcher or `main` receives a value. Dependencies may then be loaded and initialized on demand as code reaches them.\n\n**Termination is also a lifecycle**\n\nThe process normally remains alive while non-daemon threads are active. Shutdown hooks run during orderly shutdown, but abrupt process termination, an operating-system failure, or forced halt can skip them. Durable work needs a database, file, queue, or other external contract rather than an assumption that a final in-memory callback always runs.",
    visualType: "sequence_diagram",
    visualTitle: "From launcher command to managed execution",
    visual: "```mermaid\nsequenceDiagram\n  participant U as Command line\n  participant J as java launcher\n  participant V as JVM\n  participant L as Class loaders\n  participant M as Main thread\n  U->>J: java -cp out HelloWorld Ravi\n  J->>V: start VM with options\n  V->>L: load initial class\n  L-->>V: class definition\n  V->>V: link and initialize\n  V->>M: invoke accepted main entry point\n  M->>V: execute; load dependencies as needed\n  V-->>U: process exit status\n```",
    codeTitle: "A conventional launch target and its application argument",
    code: "```java\nclass HelloWorld {\n    static {\n        System.out.println(\"class initialized\");\n    }\n\n    public static void main(String[] args) {\n        String name = args.length == 0 ? \"world\" : args[0];\n        System.out.println(\"Hello, \" + name);\n    }\n}\n```\n\nCompile with `javac -d out HelloWorld.java`, then run `java -cp out HelloWorld Ravi`.",
    practiceTitle: "Diagnose startup by phase",
    practice: "Given an error, place it before loading, during linking, during class initialization, at entry-point selection, or during main execution. That is more useful than describing every startup failure as “the JVM did not run.”",
    followups: [
      "What is the difference between loading, linking, and initialization?",
      "Which command-line arguments become the main method's args array?",
      "Why can a class-initialization error occur before main executes?",
    ],
  },
};

for (const entry of entries) {
  const lesson = lessons[entry.slug];
  if (!lesson) continue;
  if (lesson.question) entry.question = lesson.question;
  entry.direct_answer = lesson.direct;
  entry.layout_type = "concept-and-runtime-lifecycle";
  entry.difficulty = lesson.difficulty;
  entry.importance = "high";
  entry.reading_time_minutes = lesson.minutes;
  delete entry.interviewer_intent;
  delete entry.speakable_v2;
  entry.answer = {
    sections: [
      { type: "key_points", title: "Quick revision", items: lesson.quick },
      {
        type: "speakable_answer",
        title: "Interview answer",
        answerSize: "compact",
        content: lesson.interview,
      },
      { type: "deep_explanation", title: lesson.deepTitle, content: lesson.deep },
      { type: lesson.visualType, title: lesson.visualTitle, content: lesson.visual },
      { type: "code_example", title: lesson.codeTitle, content: lesson.code },
      { type: "practice_prompt", title: lesson.practiceTitle, content: lesson.practice },
    ],
  };
  entry.followup_questions = lesson.followups;
  entry.seo = {
    metaTitle: `${entry.title} | InterviewExplainer`,
    metaDescription: lesson.direct.replace(/`/g, "").slice(0, 155),
  };
}

const missing = Object.keys(lessons).filter(
  (slug) => !entries.some((entry) => entry.slug === slug),
);
if (missing.length) throw new Error(`Missing target questions: ${missing.join(", ")}`);

fs.writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Curated ${Object.keys(lessons).length} JVM architecture lessons; preserved IDs, slugs, and order.`);
