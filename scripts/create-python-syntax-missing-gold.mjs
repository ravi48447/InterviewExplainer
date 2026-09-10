#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = path.join(
  repoRoot,
  "content/python-backend-fresher/python-syntax-essentials",
);
const interviewProse = (value) => String(value)
  .split(/\n\s*\n/)
  .map((paragraph) => paragraph.replace(/^\s*[-*+]\s+/, ""))
  .join("\n\n");

function question({
  topic,
  number,
  slug,
  prompt,
  title,
  direct,
  layout,
  difficulty = "easy",
  minutes = 8,
  quick,
  interview,
  deep,
  visual,
  example,
  practice,
  followups,
}) {
  return {
    id: `python-syntax-essentials-${topic}-q${String(number).padStart(3, "0")}`,
    slug,
    question: prompt,
    title,
    direct_answer: direct,
    layout_type: layout,
    difficulty,
    importance: "high",
    reading_time_minutes: minutes,
    answer: {
      sections: [
        {
          type: "key_points",
          title: "Quick revision",
          items: quick,
        },
        {
          type: "speakable_answer",
          title: "Interview answer",
          answerSize: "standard",
          content: interviewProse(interview),
        },
        {
          type: "deep_explanation",
          title: deep.title,
          content: deep.content,
        },
        visual,
        {
          type: "code_example",
          title: example.title,
          content: example.content,
        },
        {
          type: "practice_prompt",
          title: practice.title,
          content: practice.content,
        },
      ],
    },
    followup_questions: followups,
    order: number,
    seo: {
      metaTitle: `${title} | InterviewExplainer`,
      metaDescription: direct.replace(/`/g, "").slice(0, 155),
    },
  };
}

const topics = {
  "conditional-statements": {
    topic: "Conditional Statements",
    topicSlug: "conditional-statements",
    questions: [
      question({
        topic: "conditional-statements",
        number: 1,
        slug: "python-if-elif-else-branch-order",
        prompt: "How do if, elif, and else choose a branch in Python?",
        title: "How Python Chooses an If Branch",
        direct: "Python tests `if` and then each `elif` from top to bottom. It runs only the first branch whose condition is truthy; `else` runs only when every earlier condition is false.",
        layout: "mechanism-explanation",
        quick: [
          "Conditions are checked from top to bottom.",
          "Only the first truthy branch runs in one `if`/`elif`/`else` chain.",
          "`else` is optional and has no condition.",
          "Empty collections, zero, `None`, and `False` are falsy; most other values are truthy.",
          "Put narrow, special cases before broad cases that would also match them.",
        ],
        interview: "- An `if` statement controls which block of code runs. Python evaluates the `if` condition first, then checks each `elif` in order only while no earlier branch has matched. As soon as one condition is truthy, its block runs and the rest of that chain is skipped. The optional `else` handles the remaining case when no condition matched.\n\n- A condition does not have to be the literal value `True`. Python asks for its truth value. `False`, `None`, numeric zero, and empty strings or collections are falsy. Most other objects are truthy. That lets `if items:` express “the collection is not empty,” while `if items is None:` asks the different question “was no value supplied?”\n\n- Branch order changes the result when conditions overlap. For example, a score of `95` satisfies both `score >= 90` and `score >= 60`. If the passing condition comes first, Python never reaches the distinction for an excellent score. I therefore place the most specific or highest-priority rule first.\n\n- `elif` belongs to the same decision, so at most one branch runs. Separate `if` statements are different: each condition is evaluated, and several blocks may run. I use separate statements when the rules are independent, such as applying more than one validation message.\n\n- The boundary is readability. A short chain is clear for a small set of ordered rules. When conditions repeat, nest deeply, or represent named business states, I extract well-named Boolean expressions or functions. The core rule stays simple: top to bottom, first truthy branch wins, otherwise `else`.",
        deep: {
          title: "A branch chain is one ordered decision",
          content: "Indentation defines each branch body. After a matching body finishes, execution continues after the whole chain; Python does not fall through into the next branch. This differs from switch statements in languages that require an explicit `break`.\n\nTruthiness is a conversion used for control flow, not value equality. An empty list and `None` are both falsy, but they often mean different things: one may be valid empty data while the other means missing data. Use an explicit comparison when that distinction matters.\n\nOrder is part of the program's meaning. Overlapping conditions should read from the exceptional case toward the general case so an earlier branch does not hide a later one.",
        },
        visual: {
          type: "flow_diagram",
          title: "One path through the chain",
          content: "```mermaid\nflowchart TD\n  A[Evaluate if condition] --> B{Truthy?}\n  B -- Yes --> C[Run if block]\n  B -- No --> D[Evaluate next elif]\n  D --> E{Truthy?}\n  E -- Yes --> F[Run elif block]\n  E -- No --> G[Run else block if present]\n  C --> H[Continue after the chain]\n  F --> H\n  G --> H\n```",
        },
        example: {
          title: "Order overlapping score rules correctly",
          content: "```python\ndef grade(score):\n    if not 0 <= score <= 100:\n        return \"invalid\"\n    elif score >= 90:\n        return \"excellent\"\n    elif score >= 60:\n        return \"pass\"\n    else:\n        return \"retry\"\n\nprint(grade(95))   # excellent\nprint(grade(72))   # pass\nprint(grade(41))   # retry\nprint(grade(120))  # invalid\n```\n\nThe range check must come first because later branches assume the score is valid.",
        },
        practice: {
          title: "Trace the first match",
          content: "For `value = []`, compare `if value is None` with `if not value`. The first is false because a list was supplied; the second is true because that list is empty.",
        },
        followups: [
          "What is the difference between an `elif` and a separate `if`?",
          "Which built-in Python values are falsy?",
          "Why should a more specific condition usually come first?",
        ],
      }),
      question({
        topic: "conditional-statements",
        number: 2,
        slug: "python-conditional-expression-vs-if-statement",
        prompt: "When should you use a conditional expression instead of an if statement in Python?",
        title: "Conditional Expression vs If Statement",
        direct: "Use `value_if_true if condition else value_if_false` to choose one of two simple values. Use a normal `if` statement for multiple actions, several branches, side effects, or logic that needs explanation.",
        layout: "comparison",
        quick: [
          "A conditional expression returns one of two values.",
          "Its order is `true_value if condition else false_value`.",
          "Only the selected value expression is evaluated.",
          "Use it for a short assignment, argument, or return value.",
          "Use a statement when either branch performs several steps or needs a comment.",
        ],
        interview: "- Python's conditional expression is the expression form of a two-way choice: `value_if_true if condition else value_if_false`. Because it produces a value, it can appear in an assignment, a function argument, or a return statement. A normal `if` is a statement that controls one or more blocks of work.\n\n- For example, `label = \"adult\" if age >= 18 else \"minor\"` is compact and still easy to read. Python evaluates the condition and then evaluates only the selected value expression. It does not run both sides before choosing, so an unselected function call has no effect.\n\n- I use the expression when the decision is genuinely one simple value versus another. The two alternatives should fit comfortably on one line and be understandable without decoding nested punctuation. This often works well for a small default, display label, or direct return.\n\n- I use a normal `if` when a branch validates input, updates several variables, logs, raises an exception, or has more than two meaningful outcomes. Statements give each action its own line and make debugging or adding a breakpoint straightforward. An `if` statement can also omit `else`; a conditional expression always requires both outcomes.\n\n- Nested conditional expressions are legal but quickly reverse the natural reading order and hide precedence. If I need an `elif`, repeated function calls, or comments explaining either path, that is a strong signal to expand the logic. The choice is therefore about shape: an expression selects a small value, while a statement explains and performs a decision process.",
        deep: {
          title: "Expressions produce values; statements organize actions",
          content: "The conditional expression is lazy: after the condition is evaluated, exactly one alternative is evaluated. That makes `result = cached if cached is not None else load()` safe from calling `load()` when a cached value exists.\n\nThe syntax places the successful value first because the whole phrase reads like ordinary language: “use cached if the condition holds, else load.” This is different from C-style `condition ? a : b`.\n\nCompactness is useful only while the decision stays obvious. Multiple assignments, error handling, or nested choices are behavior, not just a value; an indented statement shows that behavior more clearly.",
        },
        visual: {
          type: "comparison_table",
          title: "Choose the form from the job",
          content: "| Need | Conditional expression | `if` statement |\n|---|---:|---:|\n| Select one of two short values | Best fit | Works, but longer |\n| Run several actions | Poor fit | Best fit |\n| More than two named outcomes | Becomes nested | Use `elif` |\n| Omit the alternative | Not allowed | `else` is optional |\n| Place inside a return or argument | Yes | No |",
        },
        example: {
          title: "Keep the small choice small",
          content: "```python\ndef shipping_label(express):\n    return \"Express\" if express else \"Standard\"\n\ndef shipping_cost(weight):\n    if weight < 0:\n        raise ValueError(\"weight cannot be negative\")\n    if weight == 0:\n        return 0\n    elif weight <= 5:\n        return 80\n    else:\n        return 150\n\nprint(shipping_label(True))  # Express\nprint(shipping_cost(4))      # 80\n```\n\nThe label is one value choice. Cost calculation has validation and three outcomes, so a statement communicates it better.",
        },
        practice: {
          title: "Use the readability test",
          content: "If a conditional expression needs a second `if ... else` inside either alternative, rewrite it as a statement and name the outcomes. Fewer lines are not automatically simpler code.",
        },
        followups: [
          "Does a conditional expression evaluate both alternatives?",
          "Why must a conditional expression include `else`?",
          "When does a one-line condition become harder to maintain?",
        ],
      }),
      question({
        topic: "conditional-statements",
        number: 3,
        slug: "python-match-case-vs-if-elif",
        prompt: "What is Python match-case, and how is it different from if-elif?",
        title: "Python Match-Case vs If-Elif",
        direct: "`match` uses structural pattern matching: it can test a value's shape and unpack parts of it into names. `if` and `elif` evaluate arbitrary Boolean conditions, so they remain better for ranges and unrelated rules.",
        layout: "comparison",
        difficulty: "medium",
        minutes: 9,
        quick: [
          "`match` checks one subject against `case` patterns from top to bottom.",
          "Only the first matching case runs; `_` is the usual catch-all pattern.",
          "Patterns can match literals and unpack sequences, mappings, or supported class objects.",
          "A case guard adds an `if` condition after a structural match.",
          "Use `if`/`elif` for arbitrary Boolean tests such as ranges or unrelated conditions.",
        ],
        interview: "- Python's `match` statement performs structural pattern matching. It evaluates one subject and tries the `case` patterns from top to bottom. The first matching case runs. A final `case _` is a catch-all, but it is optional, so nothing runs when no pattern matches and no catch-all exists.\n\n- It is more capable than a switch over constants. A pattern can match a literal, inspect the shape of a sequence or mapping, and bind pieces to names. For example, `case {\"type\": \"move\", \"x\": x, \"y\": y}` both checks the message type and extracts two coordinates. Extra dictionary keys do not prevent that mapping pattern from matching.\n\n- A guard such as `case [x, y] if x == y:` adds a Boolean requirement after the structure has matched. This lets the pattern express shape while the guard expresses a value relationship. Case order still matters because an earlier broad pattern can hide a later narrow one.\n\n- `if` and `elif` are better when each rule is an arbitrary condition: `temperature > limit`, permission checks, or conditions about several unrelated values. `match` is strongest when many branches interpret different forms of the same piece of data, such as commands, parsed events, or tagged messages.\n\n- A bare name in a case is a capture pattern, not a comparison with an existing variable. Named constants must normally be qualified, such as `Color.RED`, to be read as values. I choose `match` when its patterns make the data shape visible; otherwise a short `if` chain is simpler and familiar.",
        deep: {
          title: "Matching asks whether data has a shape",
          content: "A `match` subject is evaluated once. Each case then attempts a pattern. Successful capture names are available in that case body, which removes manual indexing and key extraction. Literal patterns compare ordinary literals by equality, while `None`, `True`, and `False` use identity.\n\nSequence patterns can unpack positions, mapping patterns can require selected keys, and class patterns can expose named attributes. They do not merely run arbitrary expressions. Guards provide the separate Boolean layer when shape alone is not enough.\n\nPatterns should progress from specific to general. An irrefutable capture or wildcard ends the useful search because it matches every remaining subject.",
        },
        visual: {
          type: "comparison_table",
          title: "Different questions, different tools",
          content: "| Question in the code | Better starting point |\n|---|---|\n| Is a number inside a range? | `if` / `elif` |\n| Does a user have several permissions? | `if` with Boolean conditions |\n| Is this event a `move` message with `x` and `y`? | `match` mapping pattern |\n| Is this value one of a few literals? | Either; choose the clearer form |\n| Does one shape need an extra value rule? | `case` pattern with a guard |",
        },
        example: {
          title: "Match and unpack command messages",
          content: "```python\ndef handle(message):\n    match message:\n        case {\"type\": \"move\", \"x\": x, \"y\": y}:\n            return f\"move to {x},{y}\"\n        case {\"type\": \"say\", \"text\": str(text)} if text:\n            return f\"say: {text}\"\n        case {\"type\": \"quit\"}:\n            return \"quit\"\n        case _:\n            return \"unknown command\"\n\nprint(handle({\"type\": \"move\", \"x\": 4, \"y\": 2}))\nprint(handle({\"type\": \"move\", \"x\": 4, \"y\": 2, \"speed\": 3}))\n```\n\nBoth messages match because a mapping pattern allows extra keys unless the pattern explicitly captures them.",
        },
        practice: {
          title: "Spot the capture",
          content: "In `case status:`, `status` captures almost any subject; it does not compare with a variable named `status`. Use a literal such as `case \"ready\":` or a qualified constant such as `case State.READY:` for a value pattern.",
        },
        followups: [
          "What does the `_` pattern mean in `match`?",
          "When is a guard evaluated?",
          "Why can a bare name unexpectedly match every subject?",
        ],
      }),
    ],
  },
  "loops-and-iteration": {
    topic: "Loops And Iteration",
    topicSlug: "loops-and-iteration",
    questions: [
      question({
        topic: "loops-and-iteration",
        number: 1,
        slug: "python-for-loop-vs-while-loop",
        prompt: "What is the difference between a for loop and a while loop in Python?",
        title: "For Loop vs While Loop in Python",
        direct: "A `for` loop consumes items from an iterable, while a `while` loop repeats as long as a condition stays truthy. Prefer `for` when iterating data and `while` when the stopping condition drives the process.",
        layout: "comparison",
        quick: [
          "`for` asks an iterable for one item at a time.",
          "`while` reevaluates its condition before every iteration.",
          "Use `for` for collections, files, generators, and known ranges.",
          "Use `while` for retries, sentinels, or state that changes until a condition is met.",
          "A `while` loop must make progress or it may run forever.",
        ],
        interview: "- A Python `for` loop iterates over an iterable. The iterable may be a list, string, dictionary, file, range, or generator. On each iteration Python obtains the next item and binds it to the loop variable; the loop ends when the iterable is exhausted. It is not limited to a numeric counter.\n\n- A `while` loop works from a condition instead. Python checks the condition before each iteration, runs the body while it is truthy, and stops when it becomes false. That makes `while` appropriate when the number of repetitions is not known from a collection, such as retrying until success or reading until a sentinel appears.\n\n- For example, I would use `for line in file:` to process every line because the file already provides the sequence. I would use `while attempts < limit and not connected:` for a retry process because changing state decides when to stop.\n\n- A `for` loop usually avoids manual indexes and off-by-one errors. When an index is genuinely needed, `enumerate(items)` supplies both the index and item. A `while` loop requires its body to change the state used by the condition; forgetting that update can create an infinite loop.\n\n- Both loops support `break`, `continue`, and an optional `else` that runs only when no `break` occurred. The choice is not about which loop is faster. It is about which rule explains termination: iterable exhaustion points to `for`, while a changing condition points to `while`.",
        deep: {
          title: "Iteration protocol versus repeated condition",
          content: "A `for` statement effectively asks `iter(source)` for an iterator and repeatedly asks that iterator for the next item. The iterator signals exhaustion, so the loop itself does not manage a position or length. This is why the same syntax works for a list and for a generator that produces values gradually.\n\nA `while` statement has no source iterator. Its safety depends on the condition and the state changes in the body. A condition that never becomes false needs an intentional exit such as `break`; otherwise the loop cannot finish.\n\nChoose the form that makes the termination proof easiest to see.",
        },
        visual: {
          type: "comparison_table",
          title: "What controls the next iteration?",
          content: "| Loop | Continues because | Natural examples | Main risk |\n|---|---|---|---|\n| `for item in source` | The iterable has another item | Collections, files, generators | Mutating the source while iterating |\n| `while condition` | The condition is still truthy | Retries, sentinels, state machines | No progress toward termination |",
        },
        example: {
          title: "Use data for one loop and state for the other",
          content: "```python\norders = [120, 75, 210]\nfor position, amount in enumerate(orders, start=1):\n    print(position, amount)\n\nattempts = 0\nconnected = False\nwhile attempts < 3 and not connected:\n    attempts += 1\n    connected = attempts == 2  # stand-in for a connection attempt\n\nprint(connected, attempts)  # True 2\n```",
        },
        practice: {
          title: "Name the stopping rule",
          content: "“Visit every customer” suggests `for`. “Keep polling until the job finishes or a timeout expires” suggests `while`. If neither rule is clear, define termination before writing the loop.",
        },
        followups: [
          "How does a `for` loop work with a generator?",
          "What commonly causes an infinite `while` loop?",
          "Why is `enumerate` usually clearer than `range(len(items))`?",
        ],
      }),
      question({
        topic: "loops-and-iteration",
        number: 2,
        slug: "python-range-enumerate-zip",
        prompt: "When should you use range, enumerate, and zip in a Python loop?",
        title: "Range, Enumerate, and Zip in Python",
        direct: "Use `range` for a sequence of integers, `enumerate` for each item together with its position, and `zip` to traverse multiple iterables in parallel. Each expresses a different relationship directly.",
        layout: "decision-guide",
        quick: [
          "`range(start, stop, step)` produces integers and excludes `stop`.",
          "`enumerate(iterable, start=0)` yields `(index, item)` pairs.",
          "`zip(a, b)` yields tuples of corresponding items.",
          "Ordinary `zip` stops when the shortest input is exhausted.",
          "Use `zip(..., strict=True)` when different input lengths should be an error.",
        ],
        interview: "- `range`, `enumerate`, and `zip` are iterable-building tools for three different loop relationships. `range` represents an arithmetic sequence of integers. Its stop value is excluded, so `range(2, 8, 2)` produces `2, 4, 6` without first building a list.\n\n- `enumerate` adds a counter to an existing iterable. It yields pairs containing an index and the corresponding item, and its optional `start` argument changes the first displayed index. For example, `for line_number, line in enumerate(lines, start=1)` is clearer and safer than indexing with `range(len(lines))`.\n\n- `zip` walks several iterables in parallel and yields tuples of corresponding items. `for name, score in zip(names, scores)` connects items by position. Ordinary `zip` stops as soon as the shortest input ends, which can silently discard extra values. Since Python 3.10, `strict=True` raises `ValueError` when lengths differ.\n\n- I use `range` only when I need numbers, not merely because a collection has indexes. I use `enumerate` when both position and value matter. I use `zip` when two or more sequences describe aligned fields or observations.\n\n- These objects are lazy iterables, so they produce values during iteration rather than materializing every result in advance. If I need to reuse or display all results, I can convert to a list deliberately. The best choice states the relationship in the loop header and removes manual counters or index bookkeeping.",
        deep: {
          title: "Make the loop header describe the data relationship",
          content: "Manual indexing often hides intent. `range(len(items))` says “generate positions,” even when the body only needs each item. Direct iteration says exactly that. Adding `enumerate` means position is part of the requirement, while adding `zip` means values are aligned across sources.\n\nAll three return iterable objects. A large `range` is compact because it stores its boundaries rather than every integer. `enumerate` and `zip` consume their inputs on demand. That matters when an input is a one-use iterator.\n\nFor `zip`, decide whether truncation is valid. Use `strict=True` for records that must align; omit it when shortest-input behavior is intentional.",
        },
        visual: {
          type: "comparison_table",
          title: "Choose by the value needed in the body",
          content: "| Body needs | Loop source | Values yielded |\n|---|---|---|\n| A controlled integer sequence | `range(2, 8, 2)` | `2`, `4`, `6` |\n| Item and position | `enumerate(names, 1)` | `(1, name1)`, `(2, name2)` |\n| Aligned items | `zip(names, scores)` | `(name1, score1)`, ... |\n| Aligned items with equal-length guarantee | `zip(names, scores, strict=True)` | Tuples or `ValueError` |",
        },
        example: {
          title: "Label aligned scores",
          content: "```python\nnames = [\"Asha\", \"Bo\", \"Chen\"]\nscores = [88, 91, 76]\n\nfor rank, (name, score) in enumerate(\n    zip(names, scores, strict=True), start=1\n):\n    print(f\"{rank}. {name}: {score}\")\n\nfor even in range(2, 8, 2):\n    print(even)\n```\n\n`zip` expresses alignment, `enumerate` adds a display rank, and `range` is reserved for actual numbers.",
        },
        practice: {
          title: "Check whether truncation is data loss",
          content: "If four product IDs arrive with only three prices, ordinary `zip` hides the unmatched ID. Use `strict=True` when that mismatch means the input is invalid.",
        },
        followups: [
          "Why is the stop value excluded from `range`?",
          "What happens when inputs to `zip` have different lengths?",
          "Are `range`, `enumerate`, and `zip` lists?",
        ],
      }),
      question({
        topic: "loops-and-iteration",
        number: 3,
        slug: "python-break-continue-pass-loop-else",
        prompt: "How do break, continue, pass, and a loop else clause work in Python?",
        title: "Break, Continue, Pass, and Loop Else",
        direct: "`break` exits the innermost loop, `continue` skips to its next iteration, and `pass` does nothing. A loop's `else` runs only when iteration finishes without executing `break`.",
        layout: "mechanism-explanation",
        quick: [
          "`break` exits only the innermost enclosing loop.",
          "`continue` skips the remaining body and begins the next iteration.",
          "`pass` is a no-operation placeholder; it does not skip or stop anything.",
          "Loop `else` runs after normal exhaustion or a false `while` condition.",
          "Loop `else` is skipped after `break`, `return`, or an exception.",
        ],
        interview: "- `break`, `continue`, and `pass` change—or deliberately do not change—control flow. `break` immediately exits the innermost `for` or `while` loop. Execution resumes after that loop. `continue` stays in the same loop but skips the remaining statements in the current iteration and moves to the next item or condition check.\n\n- `pass` is different because it does nothing at runtime. Python requires an indented suite after a function, class, loop, or condition, so `pass` can temporarily occupy an intentionally empty body. It neither exits the loop nor jumps to the next iteration.\n\n- Python loops can also have an `else` clause. It runs when a `for` loop exhausts its iterable or a `while` condition becomes false, provided the loop did not execute `break`. This is useful for search logic: break when a match is found; otherwise the `else` handles “not found.”\n\n- For example, when looking for the first order with a given ID, the loop can return or break on the match. If every order is checked without a break, the loop `else` reports that no order matched. The `else` belongs to the loop, not to an `if` inside it.\n\n- A `return` or exception also prevents the loop `else` because control leaves before normal completion. In nested loops, `break` affects only the inner loop. I use these features when they make the exit rule obvious; if several flags are needed to explain what happened, a small function with an early `return` may be clearer.",
        deep: {
          title: "Loop else means no break",
          content: "The most reliable mental model is not “run else when the loop had zero items.” The `else` also runs after many successful iterations, as long as the loop ends normally. It is paired with the search's `break`: found path versus exhausted-without-finding path.\n\n`continue` transfers control to the loop's next cycle. In a `while`, the condition is checked again; in a `for`, the iterator is asked for another item. Any state update placed below `continue` will be skipped, which can accidentally stop a `while` loop from making progress.\n\n`pass` is only syntax-compatible emptiness and has no transfer of control.",
        },
        visual: {
          type: "flow_diagram",
          title: "Search with a loop else",
          content: "```mermaid\nflowchart TD\n  N[Get next item] --> E{No items left?}\n  E -- Yes --> O[Run loop else: not found]\n  E -- No --> M{Item matches?}\n  M -- Yes --> B[break]\n  B --> A[Continue after loop; skip else]\n  M -- No --> N\n  O --> A\n```",
        },
        example: {
          title: "Separate found from exhausted",
          content: "```python\ndef find_order(orders, wanted_id):\n    for order in orders:\n        if order[\"cancelled\"]:\n            continue\n        if order[\"id\"] == wanted_id:\n            print(\"found\", order)\n            break\n    else:\n        print(\"active order not found\")\n\norders = [\n    {\"id\": 1, \"cancelled\": True},\n    {\"id\": 2, \"cancelled\": False},\n]\nfind_order(orders, 2)  # found ...; else is skipped\nfind_order(orders, 3)  # active order not found\n```",
        },
        practice: {
          title: "Do not confuse pass with continue",
          content: "Replacing `continue` with `pass` in the cancelled-order branch would allow the following match check to run. `pass` leaves control exactly where it already was.",
        },
        followups: [
          "Does loop `else` run when the iterable is empty?",
          "Which loop does `break` exit when loops are nested?",
          "How can `continue` cause an infinite `while` loop?",
        ],
      }),
    ],
  },
  "string-methods": {
    topic: "String Methods",
    topicSlug: "string-methods",
    questions: [
      question({
        topic: "string-methods",
        number: 1,
        slug: "python-split-and-join-strings",
        prompt: "How do split and join work with strings in Python?",
        title: "Python Split and Join",
        direct: "`text.split(separator)` turns one string into a list of pieces, while `separator.join(strings)` combines an iterable of strings into one string. The separator belongs to `join`, not the list.",
        layout: "process-explanation",
        quick: [
          "`split` returns a new list because strings are immutable.",
          "`split()` with no argument treats runs of whitespace specially and drops leading or trailing whitespace.",
          "`split(',')` uses the exact separator and can preserve empty fields.",
          "`' '.join(words)` inserts the separator between string items.",
          "Convert non-string items before joining them.",
        ],
        interview: "- `split` and `join` perform opposite transformations. `text.split(separator)` reads one string and returns a list of substrings. `separator.join(iterable)` reads an iterable of strings and returns one new string with the separator placed between adjacent items. Neither operation changes the original string because Python strings are immutable.\n\n- The behavior of `split` depends on whether a separator is supplied. With no argument, `text.split()` treats consecutive whitespace as one boundary and ignores leading or trailing whitespace. With an explicit separator such as `','`, Python looks for that exact text, and adjacent separators produce an empty field.\n\n- For example, `'  red   blue '.split()` gives `['red', 'blue']`, while `'red,,blue'.split(',')` gives `['red', '', 'blue']`. That difference matters for CSV-like data, although real CSV with quotes and escapes should use the `csv` module rather than manual splitting.\n\n- `join` is called on the separator because the separator owns the combining rule: `', '.join(names)`. Every element must be a string. For numbers I use a conversion such as `','.join(map(str, values))` or a comprehension.\n\n- Repeated string concatenation in a large loop may create many intermediate strings. Collecting pieces and joining once expresses the operation clearly and is often more efficient. The boundary is structured formats: paths, URLs, CSV, and shell commands have escaping rules, so I use their dedicated libraries instead of assuming `split` or `join` is a parser.",
        deep: {
          title: "Whitespace mode and exact-separator mode are different",
          content: "Calling `split()` without an argument is not the same as calling `split(' ')`. Whitespace mode recognizes runs of whitespace characters and produces no empty strings at the edges. Exact-space mode treats each single space as a delimiter, so repeated spaces create empty pieces.\n\n`maxsplit` limits how many boundaries are used. A value such as `line.split(':', 1)` is useful when only the first colon separates a key from a value that may contain more colons.\n\n`join` requires strings because it does not guess how arbitrary objects should be represented. Converting explicitly makes that choice visible.",
        },
        visual: {
          type: "flow_diagram",
          title: "One string, pieces, one string",
          content: "```mermaid\nflowchart LR\n  A[\"'red,green,blue'\"] -->|\"split(',')\"| B[\"['red', 'green', 'blue']\"]\n  B -->|\"' / '.join(...)\"| C[\"'red / green / blue'\"]\n```",
        },
        example: {
          title: "Split only the first key-value boundary",
          content: "```python\nline = \"callback:https://example.com:8443/done\"\nkey, value = line.split(\":\", 1)\nprint(key)    # callback\nprint(value)  # https://example.com:8443/done\n\nraw_tags = \"  python   api  testing \"\ntags = raw_tags.split()\nprint(\", \".join(tags))  # python, api, testing\n\nvalues = [10, 20, 30]\nprint(\"|\".join(str(value) for value in values))  # 10|20|30\n```",
        },
        practice: {
          title: "Predict the empty field",
          content: "Compare `'a  b'.split()` with `'a  b'.split(' ')`. The first gives two words; the second includes an empty string between the two exact separators.",
        },
        followups: [
          "What is the difference between `split()` and `split(' ')`?",
          "Why is `join` called on the separator?",
          "When should a dedicated parser replace manual splitting?",
        ],
      }),
      question({
        topic: "string-methods",
        number: 2,
        slug: "python-strip-removeprefix-replace",
        prompt: "What is the difference between strip, removeprefix, and replace in Python?",
        title: "Strip vs RemovePrefix vs Replace",
        direct: "`strip(chars)` removes any listed characters repeatedly from both ends, `removeprefix(prefix)` removes one exact leading substring, and `replace(old, new)` substitutes matching substrings throughout the string.",
        layout: "comparison",
        quick: [
          "`strip()` without arguments removes leading and trailing whitespace.",
          "`strip(chars)` treats `chars` as a set of removable edge characters, not an exact word.",
          "`removeprefix(prefix)` removes one exact prefix only when it is present.",
          "`removesuffix(suffix)` is the matching operation for the end.",
          "`replace(old, new, count)` replaces matching substrings and can limit the number of replacements.",
        ],
        interview: "- These methods remove or substitute text using different matching rules. `strip()` removes whitespace from both ends of a string. When characters are supplied, `strip(chars)` repeatedly removes any character found in that set from the left and right edges. It does not remove one exact prefix or suffix.\n\n- `removeprefix(prefix)` tests one exact leading substring. If the prefix is present, it returns the remaining text; otherwise it returns the original value unchanged. `removesuffix` does the same at the other end. These methods make intent clearer than slicing after a manual `startswith` check.\n\n- `replace(old, new)` substitutes non-overlapping occurrences of a substring throughout the string. An optional count limits how many replacements happen from the left. Like the other methods, it returns a new string because strings cannot be changed in place.\n\n- For example, `'Arthur: three'.strip('Arthur: ')` is unsafe if the intention is to remove the exact label. The argument is a character set, so characters such as `A`, `r`, `t`, `h`, `u`, space, and colon may be removed repeatedly from both ends. `'Arthur: three'.removeprefix('Arthur: ')` removes only that exact beginning.\n\n- I choose from location and matching rule: trim edge characters with `strip`, remove one known edge token with `removeprefix` or `removesuffix`, and substitute occurrences with `replace`. For parsing structured text or sanitizing security-sensitive input, these simple transformations are not validation; the code still needs format-specific rules.",
        deep: {
          title: "Character sets are not substrings",
          content: "The name `strip` can be misleading when an argument is provided. Python does not look for the full argument in order. It removes matching characters until each edge reaches a character outside the supplied set. That is ideal for punctuation or whitespace cleanup and wrong for removing a known label.\n\nExact edge methods make failure harmless: if the prefix or suffix is absent, nothing changes. `replace` searches the whole value and does not understand words, tokens, or case unless the caller encodes those rules.\n\nAll results are new string values, so assign or return the result; calling a method alone does not update the original name.",
        },
        visual: {
          type: "comparison_table",
          title: "Match rule and location",
          content: "| Method | What it matches | Where | Example result |\n|---|---|---|---|\n| `'  hi  '.strip()` | Whitespace | Both edges | `'hi'` |\n| `'xyhelloxy'.strip('xy')` | Any `x` or `y` | Both edges | `'hello'` |\n| `'unhappy'.removeprefix('un')` | Exact `'un'` | Start only | `'happy'` |\n| `'a-b-a'.replace('a', 'x')` | Exact `'a'` | Everywhere | `'x-b-x'` |",
        },
        example: {
          title: "Use the method that names the intent",
          content: "```python\nheader = \"Bearer abc123\"\ntoken = header.removeprefix(\"Bearer \" )\nprint(token)  # abc123\n\nvalue = \"...ready...\"\nprint(value.strip(\".\"))  # ready\n\nphone = \"555-010-2020\"\nprint(phone.replace(\"-\", \"\", 1))  # 555010-2020\n\nname = \"  Ada  \"\nname.strip()\nprint(repr(name))          # '  Ada  ': original was not changed\nname = name.strip()\nprint(repr(name))          # 'Ada'\n```",
        },
        practice: {
          title: "Test the dangerous assumption",
          content: "Before using `strip('prefix')`, try inputs whose last character belongs to that character set. If you mean the literal word `prefix`, use `removeprefix('prefix')`.",
        },
        followups: [
          "Why can `strip('abc')` remove more than the substring `abc`?",
          "What happens when `removeprefix` does not find the prefix?",
          "Why must the result of a string method usually be assigned?",
        ],
      }),
      question({
        topic: "string-methods",
        number: 3,
        slug: "python-f-strings-format-percent-formatting",
        prompt: "How do f-strings, str.format, and percent formatting differ in Python?",
        title: "Python String Formatting Options",
        direct: "F-strings embed evaluated expressions directly and are the usual choice for readable application code. `str.format` is useful for reusable templates, while percent formatting remains common in logging and older code.",
        layout: "comparison",
        quick: [
          "F-strings evaluate expressions in the current scope.",
          "Format specifications such as `.2f`, `>10`, and date formats work with f-strings and `str.format`.",
          "`str.format` separates a template from the values and can use named fields.",
          "Percent formatting is older but still appears in existing code and logging APIs.",
          "Do not build SQL queries or shell commands with any string-formatting style.",
        ],
        interview: "- Python offers several string-formatting styles. An f-string prefixes the literal with `f` and evaluates expressions inside braces in the current scope. It is normally the clearest choice when code owns both the template and the values, for example `f\"{name} owes {amount:.2f}\"`.\n\n- `str.format` uses replacement fields in a string and supplies values afterward: `'{} owes {:.2f}'.format(name, amount)`. Named fields allow a template such as `'{user} owes {total:.2f}'` to be reused with keyword arguments. The formatting mini-language for width, alignment, precision, and type is largely shared with f-strings.\n\n- Percent formatting predates both forms: `'%s owes %.2f' % (name, amount)`. It remains important when reading older code. Logging APIs also commonly use percent-style placeholders with arguments passed separately, which allows the logging system to defer formatting until the message is needed.\n\n- For example, `logger.info('loaded %d rows', count)` is preferable to eagerly building the message with an f-string when following Python logging's normal parameterized style. That is an API-specific boundary, not a claim that percent formatting is generally more readable.\n\n- Formatting creates presentation text; it does not escape values for SQL, HTML, URLs, or shell commands. I use parameterized database queries and context-aware libraries for those jobs. For ordinary application output I prefer f-strings, use `str.format` when a reusable external template needs named fields, and understand percent formatting for compatibility and logging.",
        deep: {
          title: "Values and format specifications are separate concerns",
          content: "A replacement field chooses a value, while the text after `:` describes its presentation. `{price:,.2f}` means grouping separators and two decimal places; `{name:>12}` means right-align within twelve characters. The object participates through its formatting behavior.\n\nF-string expressions run when execution reaches the string, so side effects inside braces also run then. Keep expressions short; compute complex values first and give them names. `str.format` fields refer to supplied arguments instead of directly evaluating arbitrary source expressions in the template.\n\nUser-controlled templates need care. A formatting mechanism is not a sandbox and not an output encoder.",
        },
        visual: {
          type: "comparison_table",
          title: "Same result, different ownership",
          content: "| Style | Example | Best fit |\n|---|---|---|\n| F-string | `f'{name}: {score:.1f}'` | Template lives beside Python values |\n| `str.format` | `'{name}: {score:.1f}'.format(...)` | Reusable template with named fields |\n| Percent | `'%s: %.1f' % (name, score)` | Legacy code |\n| Logging arguments | `log.info('%s: %.1f', name, score)` | Logging API can defer interpolation |",
        },
        example: {
          title: "Format the same invoice values",
          content: "```python\nfrom datetime import date\n\ncustomer = \"Ada\"\ntotal = 12345.5\ntoday = date(2026, 9, 7)\n\nprint(f\"{customer:<10} {total:>12,.2f} {today:%Y-%m-%d}\")\ntemplate = \"{customer:<10} {total:>12,.2f}\"\nprint(template.format(customer=customer, total=total))\nprint(\"%-10s %12.2f\" % (customer, total))\n```\n\nAll three can format the values, but the f-string keeps a code-owned template closest to the expressions it uses.",
        },
        practice: {
          title: "Keep formatting out of command construction",
          content: "`f\"SELECT * FROM users WHERE name = '{name}'\"` is unsafe regardless of how readable the f-string is. Pass `name` as a database parameter so the driver handles data separately from SQL syntax.",
        },
        followups: [
          "What does the part after `:` in a replacement field mean?",
          "Why do logging calls often pass formatting arguments separately?",
          "Why is string formatting not a substitute for SQL parameters?",
        ],
      }),
    ],
  },
  comparisons: {
    topic: "Comparisons",
    topicSlug: "comparisons",
    questions: [
      question({
        topic: "comparisons",
        number: 1,
        slug: "python-truthy-falsy-explicit-none-checks",
        prompt: "What are truthy and falsy values in Python, and when should a comparison be explicit?",
        title: "Truthy, Falsy, and Explicit Checks",
        direct: "Python treats `False`, `None`, numeric zero, and empty containers as falsy; most other values are truthy. Use a direct truth test for presence, but compare explicitly when zero, empty, and missing have different meanings.",
        layout: "decision-guide",
        quick: [
          "Falsy built-ins include `False`, `None`, zero, and empty strings or containers.",
          "Most non-empty and non-zero values are truthy.",
          "Use `if items:` when empty and absent should follow the same path.",
          "Use `is None` when missing is different from a valid empty or zero value.",
          "Custom classes can define truth through `__bool__` or `__len__`.",
        ],
        interview: "- Truthiness is Python's rule for interpreting an object in a Boolean context such as `if`, `while`, `and`, or `or`. The built-in falsy values include `False`, `None`, every numeric zero, and empty strings and containers. Most other objects are truthy. `bool(value)` exposes the same conversion explicitly.\n\n- A direct truth test is useful when the business question really is “does this contain anything?” For example, `if not errors:` clearly means there are no reported errors, whether `errors` is an empty list or another empty collection accepted by the function.\n\n- The boundary is that several different states collapse to false. Suppose a timeout may be `None` to mean “use the default,” while `0` means “do not wait.” `if not timeout:` treats both the same and loses information. `if timeout is None:` preserves the valid zero. The same issue appears when an empty string is valid input but `None` means a field was omitted.\n\n- Equality answers a value question and identity answers an object question. I use `is None` for the `None` singleton, `==` for ordinary value comparisons, and a truth test only when all falsy states intentionally share behavior.\n\n- User-defined classes may implement `__bool__`; if absent, a zero `__len__` also makes an object falsy. I avoid surprising truth rules in domain objects because they can hide state distinctions. The safe habit is to state the question in words—empty, missing, zero, equal—and choose the comparison that asks exactly that question.",
        deep: {
          title: "One Boolean result can hide several data states",
          content: "Truth testing is a protocol, not a list of hard-coded syntax exceptions. Python first asks an object for `__bool__`; if that method is unavailable, it may use whether `__len__` returns zero. Objects with neither behavior are true by default.\n\nThis flexibility makes conditions concise, but a condition should not erase information needed by the next step. API payloads frequently distinguish an omitted field (`None` or a missing key), an explicitly empty value, and a numeric zero. Those cases need explicit tests.\n\nA condition is correct when its Boolean grouping matches the domain grouping, not merely when it passes a few common inputs.",
        },
        visual: {
          type: "comparison_table",
          title: "Ask the exact data question",
          content: "| Intended question | Clear check | Distinction preserved |\n|---|---|---|\n| Does the collection contain items? | `if items:` | No: absent and empty may combine |\n| Was no optional value supplied? | `if value is None:` | Yes: keeps `0`, `False`, and `''` |\n| Is the count exactly zero? | `if count == 0:` | Yes: names the numeric case |\n| Do two values compare equal? | `if left == right:` | Uses value equality |",
        },
        example: {
          title: "Preserve zero as a real timeout",
          content: "```python\ndef resolve_timeout(value):\n    if value is None:\n        return 30       # caller omitted it\n    if value < 0:\n        raise ValueError(\"timeout cannot be negative\")\n    return value        # zero is valid\n\nfor supplied in (None, 0, 5):\n    print(supplied, \"->\", resolve_timeout(supplied))\n\n# None -> 30\n# 0 -> 0\n# 5 -> 5\n```",
        },
        practice: {
          title: "List the falsy cases before shortening a condition",
          content: "Before changing `if result is None` to `if not result`, test `0`, `False`, `''`, `[]`, and `{}`. Use the shorter form only if every one of those values truly means the same thing.",
        },
        followups: [
          "How can a custom object define its truth value?",
          "Why can `value or default` lose valid data?",
          "When is `if not items` exactly the intended test?",
        ],
      }),
      question({
        topic: "comparisons",
        number: 2,
        slug: "python-in-not-in-membership",
        prompt: "How do in and not in work with Python strings, collections, and dictionaries?",
        title: "Membership Tests with In and Not In",
        direct: "`in` asks whether a container contains a value; `not in` negates that result. Dictionaries test keys, strings test substrings, and sets provide the clearest fast average membership lookup for hashable values.",
        layout: "comparison",
        quick: [
          "For lists and tuples, membership compares each element until one is equal.",
          "For strings, membership checks for a substring, not only one character.",
          "For dictionaries, membership checks keys unless `.values()` or `.items()` is used.",
          "Sets and dictionaries usually provide average constant-time membership for hashable keys.",
          "`not in` is the readable negation of the same membership test.",
        ],
        interview: "- `in` is Python's membership operator. It asks whether a value is contained in another object, and `not in` negates that question. The exact meaning comes from the container. Lists and tuples search their elements using equality; strings search for a substring; sets search their unique elements.\n\n- Dictionaries are an important boundary: `value in mapping` checks keys, not values. If `users = {'A17': 'Ada'}`, then `'A17' in users` is true while `'Ada' in users` is false. A value search must be explicit with `users.values()`, and a key-value pair can be checked against `users.items()`.\n\n- For example, checking whether a requested permission is in a set is both expressive and usually efficient: `if permission in allowed_permissions`. A list membership test may inspect elements one at a time, so repeated membership queries over many items may justify converting stable unique data to a set. That conversion has its own cost and removes duplicates.\n\n- Membership depends on equality for sequences and hashability plus equality for normal sets and dictionaries. The average lookup for a set or dictionary is constant time, but it is not a guarantee for every possible collision pattern. I choose them for their data meaning first and performance second.\n\n- I avoid vague tests such as `if query in text` when case, Unicode normalization, or whole-word boundaries matter. The operator performs the container's defined membership operation; it does not understand linguistic intent. The readable rule is to make both the container and the sought unit match the question being asked.",
        deep: {
          title: "The right-hand object defines containment",
          content: "The expression `needle in container` delegates containment behavior to the right-hand object. Built-in sequences compare candidates until a match is found. A dictionary exposes its keys as its normal iteration and membership surface, which is why key checks need no `.keys()` call.\n\nHash-based containers require hashable search keys. A set is useful when uniqueness is part of the model and membership is frequent; building a new set for one tiny lookup can cost more work than the original list scan.\n\nString containment works on contiguous substrings. It is case-sensitive and does not split text into words, so domain-specific text matching may need normalization or a parser.",
        },
        visual: {
          type: "comparison_table",
          title: "What does membership inspect?",
          content: "| Right-hand value | `needle in value` checks | Typical cost |\n|---|---|---|\n| `list` / `tuple` | Equal elements | Linear scan |\n| `str` | Contiguous substring | Search depends on text and pattern |\n| `set` | Hashable elements | Average constant time |\n| `dict` | Keys | Average constant time |\n| `dict.values()` | Equal values | Linear scan |\n| `dict.items()` | `(key, value)` pairs | View membership rules |",
        },
        example: {
          title: "Check the intended dictionary surface",
          content: "```python\nusers = {\"A17\": \"Ada\", \"B04\": \"Bo\"}\n\nprint(\"A17\" in users)                 # True: key\nprint(\"Ada\" in users)                 # False: not a key\nprint(\"Ada\" in users.values())        # True: value\nprint((\"A17\", \"Ada\") in users.items()) # True: pair\n\nroles = {\"reader\", \"editor\"}\nprint(\"editor\" in roles)              # True\nprint(\"read\" in \"reader\")            # True: substring\n```",
        },
        practice: {
          title: "Match the unit to the question",
          content: "`'he' in 'the report'` is true even though `he` is not a word there. If whole words matter, tokenize according to the text rules before testing membership.",
        },
        followups: [
          "Why does dictionary membership check keys by default?",
          "When is converting a list to a set worthwhile?",
          "What does string membership consider a match?",
        ],
      }),
      question({
        topic: "comparisons",
        number: 3,
        slug: "python-sequence-lexicographic-comparison",
        prompt: "How does Python compare strings, lists, and tuples in order?",
        title: "Lexicographic Sequence Comparison in Python",
        direct: "Python compares same-kind sequences lexicographically: it examines corresponding elements from left to right, stops at the first difference, and uses length only when the shared prefix is equal.",
        layout: "mechanism-explanation",
        difficulty: "medium",
        quick: [
          "Sequence ordering compares corresponding elements from left to right.",
          "The first unequal pair decides the result.",
          "If one sequence is an exact prefix, the shorter sequence sorts first.",
          "String ordering uses Unicode code points and is case-sensitive, not dictionary order.",
          "Ordering unrelated types such as an integer and string raises `TypeError` in Python 3.",
        ],
        interview: "- Python orders strings, lists, and tuples lexicographically when their elements can be ordered. It compares the first pair of elements, then the second, and continues until it finds a difference. That first unequal pair determines the whole result; later elements are irrelevant.\n\n- If every compared element is equal but one sequence ends, the shorter sequence comes first. For example, `[1, 2] < [1, 2, 0]` is true because the first list is an exact prefix. For tuples, `(2026, 8, 31) < (2026, 9, 1)` becomes a month comparison after the equal year.\n\n- Strings follow the same left-to-right idea using Unicode code point ordering. That ordering is case-sensitive and is not natural-language or locale-aware collation. For example, uppercase letters may sort before lowercase letters in a way users do not expect. Case-insensitive display sorting often uses `key=str.casefold`, while real locale rules may need specialized support.\n\n- Python 3 does not invent an arbitrary ordering for unrelated values such as `3 < '4'`; that raises `TypeError`. Lists or tuples can also fail partway through ordering when the corresponding elements at the first difference cannot be compared. Equality is less restrictive: unrelated types generally compare unequal rather than requiring a shared ordering.\n\n- I use tuple keys to express multi-field sort priority, for example `key=lambda user: (user.last_name.casefold(), user.id)`. Lexicographic comparison then applies each field in order. The boundary is user-facing text: code-point order is deterministic, but it is not automatically the culturally correct alphabetic order.",
        deep: {
          title: "The first difference carries the decision",
          content: "Lexicographic ordering is the same principle used for words in a simple dictionary: compare positions until one differs. Nested sequences participate recursively, so a tuple of sort fields can express primary, secondary, and later tie-breakers without a custom comparison function.\n\nElement compatibility matters only when Python reaches that pair. `[1, 'x'] < [2, object()]` is decided by `1 < 2` and never compares the later elements. In `[1, 'x'] < [1, 2]`, Python reaches `'x' < 2` and raises `TypeError`.\n\nA sort key can normalize or transform values before comparison while keeping the original records as the returned items.",
        },
        visual: {
          type: "flow_diagram",
          title: "Trace a lexicographic comparison",
          content: "```mermaid\nflowchart TD\n  A[Compare elements at position 0] --> B{Equal?}\n  B -- No --> C[That pair decides the result]\n  B -- Yes --> D[Advance to next position]\n  D --> E{One sequence ended?}\n  E -- No --> A\n  E -- Yes --> F[Shorter sequence sorts first; both ended means equal]\n```",
        },
        example: {
          title: "Sort by family name, then stable ID",
          content: "```python\nusers = [\n    {\"id\": 3, \"last_name\": \"Singh\"},\n    {\"id\": 2, \"last_name\": \"ada\"},\n    {\"id\": 1, \"last_name\": \"Ada\"},\n]\n\nordered = sorted(\n    users,\n    key=lambda user: (user[\"last_name\"].casefold(), user[\"id\"]),\n)\nprint([(user[\"last_name\"], user[\"id\"]) for user in ordered])\n# [('Ada', 1), ('ada', 2), ('Singh', 3)]\n\nprint([1, 2] < [1, 2, 0])  # True: shorter equal prefix\n```",
        },
        practice: {
          title: "Stop at the first difference",
          content: "To compare `(2, 10, 99)` and `(2, 11, 0)`, ignore the final elements: the equal first pair advances to `10 < 11`, which decides the result.",
        },
        followups: [
          "What happens when one sequence is a prefix of another?",
          "Why is Unicode code-point order not always suitable for people-facing names?",
          "How can tuple keys express multiple sort priorities?",
        ],
      }),
    ],
  },
};

for (const [topicSlug, document] of Object.entries(topics)) {
  const directory = path.join(moduleRoot, topicSlug);
  fs.mkdirSync(directory, { recursive: true });
  const file = path.join(directory, "complete-qa.json");
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

console.log(`Wrote ${Object.values(topics).reduce((sum, topic) => sum + topic.questions.length, 0)} gold questions across ${Object.keys(topics).length} Python syntax topics.`);
