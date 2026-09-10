#!/usr/bin/env python3
"""
Apply P01 Java Language & Core fix plan (P0–P2) in one batch.
Run from repo root: python3 scripts/apply_p01_fix_plan.py
"""
from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
JBI = REPO / "content" / "java-backend-intermediate"
P01_MODULES = ("core-java", "java-oop", "java-collections", "java-streams", "java-concurrency", "jvm-internals")
STRUCTURAL_AUDITS = REPO / "content" / "_audits" / "P01"
SUPERSEDED_BANNER = """\
> **Superseded — do not use for launch decisions.** This file predates `scripts/out/audit_v3/P01/`.
> Trust `scripts/out/audit_v3/P01/` only. Regenerated banner: {date}.

"""

# --- P0.1 title renames ---
TITLE_FILES = [
    JBI / "_index.json",
    JBI / "core-java" / "_config.json",
    JBI / "core-java" / "_revision.json",
    REPO / "content" / "java-fullstack-intermediate" / "_index.json",
]
ROUTE_TS = REPO / "frontend" / "app" / "api" / "content" / "domain-stacks" / "route.ts"

# slug -> fenced code block to inject (after first overview, or before key_points)
CODE_SNIPPETS: dict[str, tuple[str, str]] = {
    "checked-vs-unchecked-exception-java-comparison": (
        "Compiler Enforcement in Code",
        """```java
// Checked — must catch or declare
void readConfig(Path path) throws IOException {
    String raw = Files.readString(path);
}

// Unchecked — no throws clause required
void setDiscount(int percent) {
    if (percent < 0 || percent > 100) {
        throw new IllegalArgumentException("percent out of range: " + percent);
    }
}

// Spring-style translation: checked SQLException -> unchecked DataAccessException
try {
    jdbcTemplate.queryForList("SELECT 1");
} catch (DataAccessException ex) { // wraps SQLException
    throw new OrderNotFoundException("lookup failed", ex);
}
```""",
    ),
    "string-equals-vs-contentequals-java": (
        "String Comparison in Code",
        """```java
String a = new String("hello");
String b = new String("hello");
System.out.println(a == b);           // false — different objects
System.out.println(a.equals(b));      // true — same characters

StringBuilder sb = new StringBuilder("hello");
System.out.println(a.contentEquals(sb)); // true — CharSequence comparison
```""",
    ),
    "difference-between-equals-and-double-equals-java": (
        "== vs equals() — The Classic Trap",
        """```java
String a = new String("hi");
String b = new String("hi");
String c = "hi";
String d = "hi";

System.out.println(a == b);  // false — different heap objects
System.out.println(a.equals(b)); // true
System.out.println(c == d);  // true — string pool interning

Integer x = 200, y = 200;
System.out.println(x == y);       // false — outside cache [-128,127]
System.out.println(x.equals(y));  // true
```""",
    ),
    "final-finally-finalize-java-difference": (
        "final vs finally vs finalize",
        """```java
final int MAX = 100;

try {
    return risky();
} finally {
    System.out.println("always runs before return completes");
}

// finalize() — deprecated; prefer Cleaner / try-with-resources
```""",
    ),
    "java-pass-by-value-not-reference": (
        "Pass-by-Value Proof",
        """```java
static void swap(String a, String b) {
    String t = a; a = b; b = t; // only local copies move
}

String x = "first", y = "second";
swap(x, y);
// still "first, second"
```""",
    ),
    "how-does-hashmap-work-internally-java": (
        "HashMap Bucket Walkthrough",
        """```java
Map<String, Integer> map = new HashMap<>();
map.put("alice", 1); // index = hash("alice") % capacity
// collision -> linked list or tree node in bucket
Integer v = map.get("alice"); // same hash path
```""",
    ),
    "hashmap-resize-rehash-internals": (
        "Resize and Rehash",
        """```java
// When size > loadFactor * capacity, capacity doubles and every entry rehashes
Map<String, String> map = new HashMap<>(16, 0.75f);
for (int i = 0; i < 20; i++) {
    map.put("k" + i, "v"); // triggers resize around 12th entry (16 * 0.75)
}
```""",
    ),
    "abstract-class-vs-interface-java-when-to-use": (
        "Abstract Class vs Interface",
        """```java
abstract class Animal {
    protected int age;
    Animal(int age) { this.age = age; }
    abstract void speak();
}

interface Flyable {
    default void fly() { System.out.println("flying"); }
}

class Duck extends Animal implements Flyable {
    Duck() { super(1); }
    void speak() { System.out.println("quack"); }
}
```""",
    ),
    "inner-classes-java": (
        "Inner Class Variants",
        """```java
class Outer {
    private int x = 1;
    class Inner { int sum() { return x + 1; } }          // holds Outer ref
    static class Nested { int y() { return 2; } }        // no Outer ref
    void run() {
        Runnable task = () -> System.out.println(x);      // captures Outer
    }
}
```""",
    ),
    "marker-interfaces-java": (
        "Marker Interface Example",
        """```java
public class User implements Serializable { // marker — no methods
    private static final long serialVersionUID = 1L;
}
// JVM checks instanceof Serializable at serialization time
```""",
    ),
    "serialization-serialversionuid-java": (
        "serialVersionUID Contract",
        """```java
public class Order implements Serializable {
    private static final long serialVersionUID = 42L;
    private final String id;
}
// Mismatch on read -> InvalidClassException
```""",
    ),
    "list-vs-set-vs-map-overview": (
        "Choosing List vs Set vs Map",
        """```java
List<String> order = new ArrayList<>();     // duplicates OK, indexed
Set<String> tags = new HashSet<>();         // unique members
Map<String, Integer> counts = new HashMap<>(); // key -> value
```""",
    ),
    "arraylist-vs-linkedlist": (
        "ArrayList vs LinkedList Cost",
        """```java
List<Integer> array = new ArrayList<>();
List<Integer> linked = new LinkedList<>();
array.get(10_000);   // O(1)
linked.get(10_000);  // O(n) — walks nodes
```""",
    ),
    "how-hashset-works-internally-java": (
        "HashSet Backed by HashMap",
        """```java
Set<String> set = new HashSet<>();
set.add("a"); // HashMap key "a" -> PRESENT sentinel
// equals/hashCode contract must match Map keys
```""",
    ),
    "arraydeque-vs-linkedlist-queue-stack": (
        "Prefer ArrayDeque",
        """```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.pop();

Deque<Integer> queue = new ArrayDeque<>();
queue.addLast(1);
queue.removeFirst();
```""",
    ),
    "weakhashmap-gc-cache": (
        "WeakHashMap Cache Pattern",
        """```java
Map<Class<?>, Metadata> cache = new WeakHashMap<>();
cache.put(MyDto.class, loadMetadata());
// entries drop when Class loader is only weakly reachable
```""",
    ),
    "copyonwritearraylist-when-and-why": (
        "CopyOnWriteArrayList",
        """```java
List<String> listeners = new CopyOnWriteArrayList<>();
listeners.add("metrics");
for (String l : listeners) { /* safe under concurrent add */ }
```""",
    ),
    "choosing-the-right-collection": (
        "Collection Selection Sketch",
        """```java
// frequent random access -> ArrayList
// frequent head/tail ops -> ArrayDeque
// unique keys -> HashSet / unique sorted -> TreeSet
// key-value -> HashMap / sorted keys -> TreeMap
```""",
    ),
    "timsort-java-collections-sort": (
        "Collections.sort Uses TimSort",
        """```java
List<String> names = Arrays.asList("bob", "alice", "carol");
Collections.sort(names); // TimSort — O(n log n), stable
```""",
    ),
    "countdownlatch-vs-cyclicbarrier-vs-semaphore": (
        "Coordination Primitives",
        """```java
CountDownLatch start = new CountDownLatch(1);
CyclicBarrier barrier = new CyclicBarrier(3);
Semaphore permits = new Semaphore(5);
```""",
    ),
    "concurrenthashmap-internals": (
        "ConcurrentHashMap Segment-Free Reads",
        """```java
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
map.put("shard-1", 1);
map.compute("shard-1", (k, v) -> v == null ? 1 : v + 1);
```""",
    ),
    "gc-algorithms-comparison": (
        "Selecting a Garbage Collector",
        """```bash
# G1 — default for services (Java 9+)
java -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -jar app.jar

# ZGC — sub-ms pauses, large heaps
java -XX:+UseZGC -Xmx16g -jar app.jar

# Parallel — batch throughput
java -XX:+UseParallelGC -jar batch.jar
```""",
    ),
    "jvm-memory-areas": (
        "Runtime Data Areas Map",
        """```java
public class Demo {
    private static int STATIC = 1;      // metaspace class data + static field in heap
    public void run() {
        int local = 2;                  // operand stack / frame on thread stack
        Object o = new Object();        // object on heap
    }
}
```""",
    ),
    "classloader-hierarchy": (
        "Parent-Delegation Load",
        """```java
ClassLoader app = Thread.currentThread().getContextClassLoader();
Class<?> c = app.loadClass("com.example.Service");
// bootstrap -> platform -> app (child asks parent first)
```""",
    ),
    "jit-compilation-tiered-compilation": (
        "Tiered Compilation Sketch",
        """```bash
# C1 quick compile -> C2 optimized after hotness threshold
java -XX:+TieredCompilation -XX:CompileThreshold=10000 -jar app.jar
```""",
    ),
    "memory-leak-detection-heap-dump": (
        "Heap Dump on OOM",
        """```bash
java -XX:+HeapDumpOnOutOfMemoryError \\
     -XX:HeapDumpPath=/tmp/heap.hprof \\
     -jar service.jar

jcmd <pid> GC.heap_dump /tmp/manual.hprof
```""",
    ),
    "java-stackoverflow-vs-outofmemoryerror": (
        "StackOverflow vs OutOfMemoryError",
        """```java
void recurse() { recurse(); }           // StackOverflowError

List<byte[]> leak = new ArrayList<>();
while (true) leak.add(new byte[1_000_000]); // OutOfMemoryError: Java heap space
```""",
    ),
    "java-nio-vs-traditional-io": (
        "NIO Channel Read",
        """```java
try (FileChannel ch = FileChannel.open(path, StandardOpenOption.READ)) {
    ByteBuffer buf = ByteBuffer.allocate(8192);
    while (ch.read(buf) > 0) {
        buf.flip();
        // process buf
        buf.clear();
    }
}
```""",
    ),
    "throw-vs-throws-java-difference": (
        "throw vs throws",
        """```java
void parse(String raw) throws ParseException {
    if (raw.isBlank()) throw new ParseException("empty", 0);
}
```""",
    ),
    "array-vs-arraylist-java-comparison": (
        "Array vs ArrayList",
        """```java
int[] nums = {1, 2, 3};
Integer[] boxed = {1, 2, 3};
List<Integer> list = new ArrayList<>(List.of(1, 2, 3));
// list.add(4); — array fixed length; ArrayList grows
```""",
    ),
    "stack-vs-queue-java-comparison": (
        "Stack vs Queue with ArrayDeque",
        """```java
Deque<String> stack = new ArrayDeque<>();
stack.push("a"); stack.pop();           // LIFO

Deque<String> queue = new ArrayDeque<>();
queue.addLast("a"); queue.removeFirst(); // FIFO
```""",
    ),
    "abstract-class-vs-interface-java-comparison": (
        "Capability vs Identity",
        """```java
interface Cacheable { void evict(); }
abstract class BaseService { protected final Logger log = ...; }
```""",
    ),
    "thread-sleep-vs-wait-java": (
        "sleep vs wait",
        """```java
synchronized (lock) {
    lock.wait(1000);   // releases lock, needs notify
}
Thread.sleep(1000);    // does NOT release any lock
```""",
    ),
    "stream-vs-collection-java-comparison": (
        "Stream vs Collection",
        """```java
List<String> names = List.of("amy", "bob");
long count = names.stream().filter(n -> n.startsWith("a")).count();
// same with loop — stream adds lazy pipeline + collectors
```""",
    ),
    "optional-vs-null-java-comparison": (
        "Optional vs null",
        """```java
Optional<User> user = repo.findById(id);
return user.map(User::getEmail).orElse("unknown@example.com");
// don't use Optional fields or method parameters in domain models
```""",
    ),
}

# slug -> improved direct_answer (bold anchors, scannable)
DIRECT_ANSWER_FIXES: dict[str, str] = {
    "gc-algorithms-comparison": (
        "**G1GC** (default Java 9+) targets **~200ms pauses** with region-based collection. "
        "**ZGC** and **Shenandoah** trade **CPU** for **sub-millisecond** pauses on large heaps. "
        "**Parallel GC** maximizes **throughput** with longer **stop-the-world** pauses — best for **batch** jobs. "
        "Pick by **latency SLA**, not brand."
    ),
    "jvm-memory-areas": (
        "The JVM splits memory into **per-thread** areas (**stack**, **PC register**, native stack) and "
        "**shared** areas (**heap** for objects, **metaspace** for class metadata, **code cache** for **JIT** code). "
        "**StackOverflowError** = stack; **OutOfMemoryError: Java heap space** = heap; **Metaspace** OOM = too many classes loaded."
    ),
    "classloader-hierarchy": (
        "Java uses **parent-delegation**: **bootstrap** → **platform** → **application** class loaders. "
        "A loader asks its **parent** first, then loads locally — prevents core classes from being replaced. "
        "**Context class loaders** break the model for frameworks (Spring, JPA)."
    ),
    "jit-compilation-tiered-compilation": (
        "HotSpot **JIT** compiles hot bytecode to native code. **Tiered compilation** runs **C1** (fast compile) "
        "then promotes to **C2** (aggressive optimize) after an invocation threshold. "
        "Cold code stays interpreted; hot paths get inlined."
    ),
    "memory-leak-detection-heap-dump": (
        "Detect leaks with **rising old-gen** after full GC, then capture a **heap dump** "
        "(`-XX:+HeapDumpOnOutOfMemoryError` or `jcmd GC.heap_dump`). "
        "Open in **Eclipse MAT** — **dominator tree** and **leak suspects** point at retaining paths."
    ),
    "java-stackoverflow-vs-outofmemoryerror": (
        "**StackOverflowError** — thread **stack** exhausted (usually **unbounded recursion**). "
        "**OutOfMemoryError** — **heap** (or metaspace/direct) cannot satisfy allocation. "
        "Different regions, different fixes."
    ),
    "java-nio-vs-traditional-io": (
        "**java.io** uses **blocking** streams; **NIO** uses **channels + ByteBuffer** for scalable I/O. "
        "NIO enables **multiplexing** with `Selector` — one thread serves many sockets. "
        "Use streams for simple files; NIO for high-concurrency servers."
    ),
    "checked-vs-unchecked-exceptions-java-when-to-use": (
        "**Checked** exceptions (`IOException`) force **catch-or-declare** — use when callers have a **real recovery** path. "
        "**Unchecked** (`RuntimeException`) signal **bugs** — fix code, don't blanket-catch. "
        "Frameworks wrap checked DB errors into **unchecked** `DataAccessException`."
    ),
    "java-optional-prevent-null-pointer-exception": (
        "`Optional<T>` models **absence** at API boundaries — use **`orElse` / `map` / `flatMap`**, not `get()` without check. "
        "It does **not** prevent null fields; it makes absence explicit in return types."
    ),
    "difference-between-equals-and-double-equals-java": (
        "`==` compares **reference identity** (same object in memory). "
        "`.equals()` compares **logical value** (overridable). "
        "For **primitives**, `==` compares values; for **strings**, prefer `.equals()` unless you mean interned identity."
    ),
    "final-finally-finalize-java-difference": (
        "`final` — immutability / cannot override. `finally` — cleanup block in try/catch (runs before return). "
        "`finalize()` — deprecated GC hook; use **try-with-resources** or **Cleaner** instead."
    ),
    "java-pass-by-value-not-reference": (
        "Java is **always pass-by-value**. Primitives copy the bits; objects copy the **reference** (pointer). "
        "Mutations through the copy are visible; **reassigning** the parameter is not."
    ),
    "hashmap-resize-rehash-internals": (
        "When `size > loadFactor × capacity`, **HashMap doubles capacity** and **rehashes** every entry to new buckets. "
        "Amortized O(1) insert, but a resize pause can spike latency on large maps."
    ),
    "how-does-hashmap-work-internally-java": (
        "HashMap is an array of **buckets**; `hash(key) % capacity` picks a bucket. "
        "Collisions chain (list) or tree (Java 8+). **`equals`/`hashCode` contract** is mandatory."
    ),
    "java-autoboxing-unboxing-integer-cache": (
        "Autoboxing wraps primitives in objects (`int` → `Integer`). "
        "Cache **-128..127** makes `Integer.valueOf(127) == Integer.valueOf(127)` true — **200 == 200** is false."
    ),
    "threadlocal-use-cases-pitfalls": (
        "`ThreadLocal` gives each thread its own copy — great for **request context**, dangerous in **pools** "
        "without `remove()`. Leaks retained values across requests on Tomcat worker threads."
    ),
    "parallel-streams-when-they-help-vs-hurt": (
        "**Parallel streams** use the **common ForkJoinPool** — help on large, CPU-bound, side-effect-free pipelines. "
        "Hurt on small data, IO-bound work, or when they **starve** other FJP users."
    ),
}

SCENARIO_IA_HINTS: dict[str, str] = {
    "how-does-hashmap-work-internally-java": "java-collections",
    "hashmap-resize-rehash-internals": "java-collections",
    "java-streams-lazy-evaluation-common-operations": "java-streams",
    "java-stream-map-vs-flatmap-difference": "java-streams",
    "java-stream-collectors-groupingby-tomap": "java-streams",
    "parallel-streams-java": "java-concurrency",
    "stream-collectors-joining-reducing": "java-streams",
    "how-java-garbage-collection-works": "jvm-internals",
    "weak-soft-phantom-references": "jvm-internals",
}


def load_json(path: Path) -> dict | list:
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict | list) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def zone3_has_code(q: dict) -> bool:
    sections = (q.get("answer") or {}).get("sections") or []
    text = "\n".join(s.get("content", "") for s in sections if isinstance(s, dict))
    return bool(re.search(r"```[a-zA-Z]*\n[\s\S]*?```", text, re.MULTILINE))


def inject_code_block(q: dict, title: str, code: str) -> bool:
    if zone3_has_code(q):
        return False
    sections = q.setdefault("answer", {}).setdefault("sections", [])
    insert_at = 0
    for i, s in enumerate(sections):
        if s.get("type") == "overview":
            insert_at = i + 1
            break
    sections.insert(
        insert_at,
        {"type": "step", "title": title, "content": code + "\n\nInterviewers expect a short runnable snippet plus one failure case — not pseudocode."},
    )
    return True


def split_paragraph_wall(text: str, max_words: int = 55) -> str:
    words = text.split()
    if len(words) <= max_words:
        return text
    chunks = []
    for i in range(0, len(words), max_words):
        chunks.append(" ".join(words[i : i + max_words]))
    return "\n\n".join(chunks)


def apply_p0_titles() -> None:
    for path in TITLE_FILES:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        text = text.replace("Core Java & OOP", "Core Java")
        text = text.replace("Core Java & OOP — Revision", "Core Java — Revision")
        path.write_text(text, encoding="utf-8")
    if ROUTE_TS.exists():
        text = ROUTE_TS.read_text(encoding="utf-8")
        text = text.replace("'java-fundamentals': 'Core Java & OOP'", "'java-fundamentals': 'Core Java'")
        text = text.replace("'core-java': 'Core Java & OOP'", "'core-java': 'Core Java'")
        ROUTE_TS.write_text(text, encoding="utf-8")


def apply_speakable_approve() -> None:
    path = JBI / "core-java" / "comparisons" / "complete-qa.json"
    data = load_json(path)
    for q in data.get("questions", []):
        if q.get("slug") == "checked-vs-unchecked-exception-java-comparison":
            v2 = q.setdefault("speakable_v2", {})
            v2["speakable_status"] = "approved"
            q["last_updated"] = str(date.today())
    save_json(path, data)


def iter_p01_complete_qa():
    for mod in P01_MODULES:
        mod_dir = JBI / mod
        if not mod_dir.is_dir():
            continue
        for qa_path in mod_dir.rglob("complete-qa.json"):
            yield qa_path, load_json(qa_path)


def apply_content_fixes() -> dict[str, int]:
    stats = {"code_injected": 0, "direct_answer": 0, "ia_hints": 0}
    for qa_path, data in iter_p01_complete_qa():
        changed = False
        for q in data.get("questions", []):
            slug = q.get("slug", "")
            if slug in DIRECT_ANSWER_FIXES:
                q["direct_answer"] = DIRECT_ANSWER_FIXES[slug]
                stats["direct_answer"] += 1
                changed = True
            if slug in CODE_SNIPPETS:
                title, code = CODE_SNIPPETS[slug]
                if inject_code_block(q, title, code):
                    stats["code_injected"] += 1
                    changed = True
            if slug in SCENARIO_IA_HINTS:
                hint = SCENARIO_IA_HINTS[slug]
                ii = q.setdefault("interviewer_intent", {})
                note = f"Primary home for depth: `{hint}` module — this scenario page is a quick cross-link."
                if note not in (ii.get("to_stand_out") or ""):
                    ii["to_stand_out"] = ((ii.get("to_stand_out") or "").rstrip() + " " + note).strip()
                    stats["ia_hints"] += 1
                    changed = True
            # paragraph walls in direct_answer
            da = q.get("direct_answer") or ""
            if slug in ("threadlocal-use-cases-pitfalls", "parallel-streams-when-they-help-vs-hurt"):
                if len(da.split()) > 60 and "\n\n" not in da[:200]:
                    q["direct_answer"] = split_paragraph_wall(da)
                    stats["direct_answer"] += 1
                    changed = True
        if changed:
            save_json(qa_path, data)
    return stats


def regenerate_questions_json() -> int:
    count = 0
    for mod in P01_MODULES:
        for qa_path in (JBI / mod).rglob("complete-qa.json"):
            topic_dir = qa_path.parent
            out_path = topic_dir / "questions.json"
            data = load_json(qa_path)
            rows = []
            for q in data.get("questions", []):
                rows.append(
                    {
                        "id": q.get("id", q.get("slug")),
                        "title": q.get("title", ""),
                        "slug": q.get("slug", ""),
                        "question": q.get("question", ""),
                        "difficulty": q.get("difficulty", "medium"),
                        "importance": q.get("importance", "medium"),
                    }
                )
            save_json(out_path, rows)
            count += 1
    return count


def banner_structural_audits() -> int:
    n = 0
    for path in STRUCTURAL_AUDITS.glob("*_structural.md"):
        text = path.read_text(encoding="utf-8")
        if "Superseded" in text[:200]:
            continue
        path.write_text(SUPERSEDED_BANNER.format(date=date.today()) + text, encoding="utf-8")
        n += 1
    return n


def write_scenario_inventory() -> None:
    out = REPO / "content" / "_audits" / "P01" / "scenario-based-ia-inventory.csv"
    rows = ["slug,suggested_module,phase,notes"]
    for slug, mod in sorted(SCENARIO_IA_HINTS.items()):
        rows.append(f'{slug},{mod},A,"Relabel browse; URL unchanged"')
    out.write_text("\n".join(rows) + "\n", encoding="utf-8")


def main() -> None:
    apply_p0_titles()
    apply_speakable_approve()
    stats = apply_content_fixes()
    qjson = regenerate_questions_json()
    banners = banner_structural_audits()
    write_scenario_inventory()
    print("P01 fix plan applied:")
    print(f"  code blocks injected: {stats['code_injected']}")
    print(f"  direct_answer updates: {stats['direct_answer']}")
    print(f"  scenario IA hints: {stats['ia_hints']}")
    print(f"  questions.json regenerated: {qjson}")
    print(f"  structural audit banners: {banners}")
    print("  speakable smoke: checked-vs-unchecked -> approved")


if __name__ == "__main__":
    main()
