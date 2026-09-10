#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleRoot = path.join(
  repoRoot,
  "content/python-backend-fresher/python-functions-advanced-basics",
);
const interviewProse = (value) => String(value)
  .split(/\n\s*\n/)
  .map((paragraph) => paragraph.replace(/^\s*[-*+]\s+/, ""))
  .join("\n\n");

const checkedOn = "2026-09-07";

function question(topicSlug, order, spec) {
  const id = `python-functions-advanced-basics-${topicSlug}-q${String(order).padStart(3, "0")}`;
  return {
    id,
    slug: spec.slug,
    question: spec.question,
    title: spec.title,
    direct_answer: spec.directAnswer,
    layout_type: spec.layoutType ?? "concept-explanation",
    difficulty: spec.difficulty ?? "easy",
    importance: spec.importance ?? "high",
    reading_time_minutes: spec.readingTime ?? 8,
    last_updated: checkedOn,
    interviewer_intent: spec.intent,
    answer: {
      sections: [
        {
          type: "key_points",
          title: "Quick revision",
          items: spec.quick,
        },
        {
          type: "speakable_answer",
          title: "Interview answer",
          answerSize: spec.answerSize ?? "compact",
          content: interviewProse(spec.interview),
        },
        {
          type: "deep_explanation",
          title: spec.deepTitle,
          content: spec.deep,
        },
        {
          type: spec.visualType,
          title: spec.visualTitle,
          content: spec.visual,
        },
        {
          type: "code_example",
          title: spec.codeTitle,
          content: `\`\`\`python\n${spec.code.trim()}\n\`\`\`\n\n${spec.codeNote}`,
        },
      ],
    },
    followup_questions: spec.followups,
    order,
    seo: {
      metaTitle: `${spec.title} | InterviewExplainer`,
      metaDescription: spec.metaDescription,
    },
  };
}

const paragraphs = (...parts) => parts.join("\n\n");
const bullets = (...items) => items.map((item) => `- ${item}`).join("\n\n");
const lines = (...parts) => parts.join("\n");

const topics = [
  {
    topic: "Default Arguments",
    topicSlug: "default-arguments",
    questions: [
      {
        slug: "python-default-arguments-evaluation-time",
        question: "When are Python default argument values evaluated?",
        title: "Python Default Arguments and Evaluation Time",
        directAnswer: "Python evaluates a default argument once, when the `def` statement runs, and stores the resulting object on the function. A call uses that stored object only when the caller omits the argument.",
        intent: {
          testing: "Whether you can separate function-definition time from function-call time and predict which object an omitted argument receives.",
          common_mistake: "Assuming the default expression runs again for every call.",
          to_stand_out: "Connect the rule to captured configuration and the mutable-default problem without claiming that every default is unsafe.",
        },
        quick: [
          "A default makes an argument optional at the call site.",
          "Its expression is evaluated when the function is defined, not on every call.",
          "The resulting object is stored on the function and reused when the argument is omitted.",
          "An explicitly supplied argument always replaces the default for that call.",
          "Use call-time initialization inside the body when a fresh or current value is required.",
        ],
        interview: bullets(
          "A default argument is the fallback value for a parameter when the caller leaves that argument out. Python evaluates the default expression when execution reaches the `def` statement and saves the resulting object with the function.",
          "Later calls do not rerun that expression. For example, if `tax_rate` is `0.10` when `def total(price, rate=tax_rate)` runs, changing `tax_rate` to `0.20` afterward does not change the saved default. Calling `total(100)` still uses `0.10`.",
          "The caller can always provide another value, such as `total(100, rate=0.20)`. That value is bound for that call, while the stored default remains unchanged for future calls.",
          "This rule is useful for stable values, but it surprises people when the expression creates a list, reads the current time, or calls a factory. Those actions happen once, so they do not produce a fresh result per call.",
          "I therefore use simple immutable defaults when their value truly is fixed. If the value should be created at call time, I use `None` or a private sentinel and calculate the real value inside the function."
        ),
        deepTitle: "A function definition is executable code",
        deep: paragraphs(
          "A `def` statement does more than describe future work. When Python executes it, Python creates a function object, associates code with that object, evaluates each default expression from left to right, and binds the function object to its name. Positional defaults can be inspected through `__defaults__`; keyword-only defaults are kept in `__kwdefaults__`.",
          "A call starts a separate binding step. Supplied arguments are matched to parameters first. If an optional parameter remains unfilled, Python takes its already stored default reference. This is why changing a module variable later does not update a default that captured its earlier value.",
          "The important design question is time. A retry count of `3` is naturally definition-time data. A new list, a timestamp, or a value read from changing configuration usually belongs to call time and should be created in the body."
        ),
        visualType: "sequence_diagram",
        visualTitle: "Definition time and call time",
        visual: lines(
          "```mermaid",
          "sequenceDiagram",
          "  participant Module",
          "  participant Function",
          "  participant Call",
          "  Module->>Function: execute def; evaluate rate expression once",
          "  Function->>Function: store 0.10 as the default",
          "  Call->>Function: total(100); rate omitted",
          "  Function-->>Call: bind stored 0.10",
          "  Call->>Function: total(100, rate=0.20)",
          "  Function-->>Call: bind supplied 0.20",
          "```"
        ),
        codeTitle: "See the saved value stay fixed",
        code: String.raw`tax_rate = 0.10

def total(price, rate=tax_rate):
    return price * (1 + rate)

tax_rate = 0.20

print(total(100))             # 110.0: saved default
print(total(100, rate=0.20))  # 120.0: supplied argument
print(total.__defaults__)     # (0.1,)`,
        codeNote: "The module name changes to `0.20`, but the function's stored default remains `0.10`.",
        followups: [
          "Where does Python store positional and keyword-only defaults?",
          "Why does this rule cause problems for mutable objects?",
          "How would you create a fresh timestamp for every call?",
        ],
        metaDescription: "Learn exactly when Python evaluates default arguments, how calls reuse them, and when initialization belongs inside the function body.",
      },
      {
        slug: "python-mutable-default-argument",
        question: "What is the mutable default argument problem in Python, and how do you fix it?",
        title: "The Mutable Default Argument Problem",
        directAnswer: "A mutable default such as `[]` is created once and shared by calls that omit the argument, so one call can affect the next. Use `None` or a sentinel as the default and create the mutable object inside the function.",
        layoutType: "common-pitfall",
        quick: [
          "A list, dictionary, or set used as a default is created only once.",
          "Calls that omit the argument receive the same mutable object.",
          "A mutation in one call remains visible in later calls.",
          "Use `None` as the default and create a new object inside the function for ordinary cases.",
          "A shared default can be intentional, but the shared state should then be explicit and documented.",
        ],
        interview: bullets(
          "The problem comes from combining two normal rules: default expressions run once when the function is defined, and a mutable object can change in place. A default such as `items=[]` therefore points to one list shared by every call that omits `items`.",
          "For example, `add_item('book')` may return `['book']`, while the next call `add_item('pen')` unexpectedly returns `['book', 'pen']`. The second call did not receive a new empty list; it received the list changed by the first call.",
          "The usual fix is `def add_item(item, items=None)`. Inside the function, `if items is None: items = []` creates a separate list for that call. If the caller supplies a list, the function can use that list according to its documented contract.",
          "This applies to any mutable default, including dictionaries, sets, and most class instances. Immutable defaults such as `None`, numbers, and strings do not develop shared contents, so they are normally safe.",
          "Occasionally shared state is deliberate, for example a tiny manual cache, but hiding it in a default is difficult to discover and reset. A named cache object or `functools.cache` communicates that intention more clearly."
        ),
        deepTitle: "One default object, several calls",
        deep: paragraphs(
          "The function object owns a tuple of its positional default references. Calling the function does not copy those referenced objects. When argument binding reaches an omitted parameter, it places the saved reference in the new local scope.",
          "Each call has its own local name `items`, but those local names can all point to the same list. `append` changes that shared list, which explains why the result survives after the call frame has gone away. Reassigning the local name would be different: `items = [item]` would make a new list for only that call.",
          "The `None` pattern moves construction into the call. Test with `is None`, not a truthiness check, because an intentionally supplied empty list is a real argument and should not automatically be replaced."
        ),
        visualType: "flow_diagram",
        visualTitle: "How state leaks between calls",
        visual: lines(
          "```mermaid",
          "flowchart LR",
          "  D[def runs] --> L[one default list]",
          "  C1[first omitted call] --> L",
          "  C2[second omitted call] --> L",
          "  L --> M1[append book]",
          "  M1 --> M2[same list now also receives pen]",
          "```",
          "With the `None` pattern, each omitted call creates its own list instead of following both arrows to one object."
        ),
        codeTitle: "Compare the faulty and safe forms",
        code: String.raw`def unsafe_add(item, items=[]):
    items.append(item)
    return items

def safe_add(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(unsafe_add("book"))  # ['book']
print(unsafe_add("pen"))   # ['book', 'pen']
print(safe_add("book"))    # ['book']
print(safe_add("pen"))     # ['pen']`,
        codeNote: "The safe function respects an explicitly supplied list but creates a fresh list whenever the argument is omitted.",
        followups: [
          "Why should the check use `items is None` rather than `if not items`?",
          "Does the same issue affect a default dictionary or class instance?",
          "When could shared function state be intentional?",
        ],
        metaDescription: "Understand why mutable Python defaults leak state across calls and learn the correct None-based fix with a runnable example.",
      },
      {
        slug: "python-none-vs-sentinel-default",
        question: "Why would a Python function use a sentinel object instead of None as a default?",
        title: "None Versus a Sentinel Default",
        directAnswer: "Use a private sentinel when `None` is a meaningful argument and the function must distinguish it from an omitted argument. A unique `object()` value creates a third state that callers cannot accidentally reproduce.",
        difficulty: "medium",
        quick: [
          "`None` works as a marker only when `None` is not a valid input.",
          "A private sentinel is commonly created once with `_MISSING = object()`.",
          "Test a sentinel with identity: `value is _MISSING`.",
          "The sentinel separates omitted, explicitly `None`, and ordinary-value cases.",
          "Keep the sentinel private unless callers genuinely need to pass it.",
        ],
        interview: bullets(
          "A sentinel is a unique object used to represent “no argument was supplied.” I use one when `None` already has a real meaning, because a default of `None` cannot tell omission and an explicit `None` apart.",
          "For example, an update function may treat an omitted nickname as “leave the current value unchanged” but treat `nickname=None` as “clear the nickname.” Those are two different requests, so one `None` state is not enough.",
          "The usual pattern is `_MISSING = object()` at module level and `def update(nickname=_MISSING)`. The function checks `nickname is _MISSING`; identity is appropriate because only that exact object means missing.",
          "A sentinel should normally be private and stable for the life of the function. Using an ordinary string such as `'missing'` is unsafe because a caller may legitimately pass the same value.",
          "If `None` is forbidden by the function's contract, the simpler `None` default remains clearer. A sentinel is valuable only when the API truly needs three states: omitted, explicitly empty, and supplied value."
        ),
        deepTitle: "Model every state the API can receive",
        deep: paragraphs(
          "Default handling is part of an API's data model. Sometimes a parameter has only two states: provided or absent. In that case `None` is a convenient absence marker if it cannot also be valid data.",
          "Partial updates often need three states. The caller may skip a field, clear it, or replace it. A unique object represents the skipped state without taking away `None` from the input domain. Because `object()` instances compare by identity, the module can recognize its marker reliably.",
          "Libraries sometimes expose named sentinel values, but application helpers usually keep them private. A custom sentinel class can improve `repr` or typing for a public API; a plain object is enough for a small internal function."
        ),
        visualType: "comparison_table",
        visualTitle: "The three possible calls",
        visual: lines(
          "| Call | Bound value | Meaning |",
          "|---|---|---|",
          "| `set_nickname(user)` | `_MISSING` | Leave the field unchanged |",
          "| `set_nickname(user, None)` | `None` | Clear the field |",
          "| `set_nickname(user, \"Ada\")` | `\"Ada\"` | Store a new nickname |"
        ),
        codeTitle: "Preserve, clear, or replace a field",
        code: String.raw`_MISSING = object()

def set_nickname(user, nickname=_MISSING):
    if nickname is _MISSING:
        return user
    updated = user.copy()
    updated["nickname"] = nickname
    return updated

user = {"name": "Ada", "nickname": "Ace"}
print(set_nickname(user))          # nickname stays 'Ace'
print(set_nickname(user, None))    # nickname becomes None
print(set_nickname(user, "A"))     # nickname becomes 'A'`,
        codeNote: "The sentinel gives omission a meaning that is different from explicitly passing `None`.",
        followups: [
          "Why is an ordinary string a poor sentinel?",
          "Why should sentinel comparison use `is`?",
          "When is `None` still the clearer default?",
        ],
        metaDescription: "Learn when a unique Python sentinel is better than None for defaults that must distinguish omitted, cleared, and supplied values.",
      },
    ],
  },
  {
    topic: "Args And Kwargs",
    topicSlug: "args-and-kwargs",
    questions: [
      {
        slug: "python-args-and-kwargs-explained",
        question: "What do *args and **kwargs collect in a Python function?",
        title: "Python *args and **kwargs Explained",
        directAnswer: "`*args` collects unmatched positional arguments into a tuple, while `**kwargs` collects unmatched keyword arguments into a dictionary. The names are conventional; the single and double stars define the behavior.",
        intent: {
          testing: "Whether you understand variable-length calls, the local shapes produced by argument binding, and when an explicit signature is clearer.",
          common_mistake: "Saying that `args` is a list or that `kwargs` includes keyword arguments already bound to named parameters.",
          to_stand_out: "Explain that the stars matter, the names do not, and keep required parameters explicit.",
        },
        quick: [
          "`*args` collects extra positional arguments into a tuple.",
          "`**kwargs` collects extra keyword arguments into a dictionary.",
          "Arguments already matched to named parameters are not included again.",
          "The names `args` and `kwargs` are conventions; `*` and `**` control collection.",
          "Prefer named parameters when the accepted inputs are known and stable.",
        ],
        interview: bullets(
          "`*args` and `**kwargs` let one function accept a variable number of inputs. In a definition, `*args` gathers extra positional arguments into a tuple, and `**kwargs` gathers extra named arguments into a dictionary.",
          "For example, in `def announce(title, *names, uppercase=False, **labels)`, `title` is bound first. Additional positional values go into `names`, the keyword-only option `uppercase` is bound by name, and any remaining accepted keywords go into `labels`.",
          "The local variable names are not special. `*values` behaves like `*args`; the star is what requests positional collection. The conventional names are still useful because most Python readers recognize them immediately.",
          "These collectors are useful for forwarding calls, adapters, and APIs where the number of values is genuinely open. They should not hide a small fixed contract, because callers lose readable parameter names and mistakes may be detected later.",
          "I keep required inputs explicit, use keyword-only parameters for important options, and add `*args` or `**kwargs` only for the flexible remainder. That produces both convenient calls and a signature that still explains itself."
        ),
        deepTitle: "Argument binding happens before the body runs",
        deep: paragraphs(
          "When a function is called, Python matches supplied values against the signature. Positional values fill eligible parameters from left to right. Keyword values bind by name. Only the positional values left after that process enter the starred tuple, and only unmatched keyword pairs enter the double-starred dictionary.",
          "The two containers exist locally even when empty: `args` becomes `()`, and `kwargs` becomes `{}`. A named parameter cannot also appear inside `kwargs`, and giving one parameter two values raises `TypeError` before the first body statement executes.",
          "Flexible collection is not the same as ignoring validation. The function still owns the responsibility to document and check the extra values it supports, or to pass them to another callable whose contract is known."
        ),
        visualType: "flow_diagram",
        visualTitle: "Where each argument lands",
        visual: lines(
          "```mermaid",
          "flowchart LR",
          "  C[announce(\"Team\", \"Ada\", \"Lin\", uppercase=true, room=\"A\")] --> T[title = Team]",
          "  C --> A[names = tuple Ada, Lin]",
          "  C --> U[uppercase = true]",
          "  C --> K[labels = dict room to A]",
          "```"
        ),
        codeTitle: "Collect only the flexible remainder",
        code: String.raw`def announce(title, *names, uppercase=False, **labels):
    message = f"{title}: {', '.join(names)}"
    if uppercase:
        message = message.upper()
    return message, labels

message, labels = announce(
    "Team",
    "Ada",
    "Lin",
    uppercase=True,
    room="A",
)
print(message)  # TEAM: ADA, LIN
print(labels)   # {'room': 'A'}`,
        codeNote: "The named option is not placed in `labels`; it is matched to `uppercase` first.",
        followups: [
          "What values do `args` and `kwargs` contain when no extras are supplied?",
          "Why might an explicit parameter be better than `**kwargs`?",
          "Can you use different names after `*` and `**`?",
        ],
        metaDescription: "Learn exactly how Python binds *args and **kwargs into tuples and dictionaries, with a clear call-to-parameter example.",
      },
      {
        slug: "python-star-call-unpacking",
        question: "What do * and ** do when calling a Python function?",
        title: "Unpacking Arguments in a Python Call",
        directAnswer: "In a call, `*iterable` expands its items into positional arguments and `**mapping` expands string-keyed entries into keyword arguments. This is the call-side inverse of collecting values with `*args` and `**kwargs` in a definition.",
        quick: [
          "`*values` expands an iterable into separate positional arguments.",
          "`**options` expands a mapping into separate keyword arguments.",
          "Keys expanded with `**` must be strings accepted by the target call.",
          "A parameter cannot receive one value positionally and another by keyword.",
          "Collection happens in a definition; unpacking happens at a call site.",
        ],
        interview: bullets(
          "At a call site, a single star unpacks an iterable into positional arguments, while a double star unpacks a mapping into keyword arguments. It lets data already stored in a collection fit a function that expects separate arguments.",
          "For example, if `bounds = (2, 8)`, then `range(*bounds)` is the same as `range(2, 8)`. If `options = {'sep': '-', 'end': '!'}`, then `print('a', 'b', **options)` supplies those entries by keyword.",
          "This is the reverse direction from a function definition. `def f(*args, **kwargs)` collects incoming values, but `f(*items, **settings)` spreads stored values into an outgoing call.",
          "Normal and unpacked arguments can be combined, but normal binding rules still apply. Duplicate values for the same parameter, non-string keyword keys, or an unexpected keyword cause `TypeError`.",
          "I use unpacking for forwarding a carefully controlled set of options or adapting stored data to an existing signature. For a public boundary, I still validate the collection rather than passing arbitrary user data straight through."
        ),
        deepTitle: "Expansion creates one ordinary call",
        deep: paragraphs(
          "Unpacking syntax is processed while Python builds the argument list. Each item from a starred iterable joins the positional sequence. Each key-value pair from a double-starred mapping joins the keyword collection. The receiving function then performs its usual binding; it does not know which values originally came from a tuple or dictionary.",
          "Several unpackings may appear in one call. Their order matters for positional values, while keyword names must remain unique across explicit keywords and all expanded mappings. A generator can be starred, but it will be consumed to construct the positional arguments.",
          "The syntax is most readable when the collection already represents arguments. If the fields need renaming, filtering, or validation, preparing a smaller explicit mapping first makes the boundary easier to review."
        ),
        visualType: "flow_diagram",
        visualTitle: "Stored collections become call arguments",
        visual: lines(
          "```mermaid",
          "flowchart LR",
          "  L[tuple: 3, 7] -->|single star| P[positional stream: 3 then 7]",
          "  D[dict: scale=2] -->|double star| K[keyword stream: scale=2]",
          "  P --> F[measure start, stop, scale]",
          "  K --> F",
          "```"
        ),
        codeTitle: "Adapt stored values to a signature",
        code: String.raw`def measure(start, stop, *, scale=1):
    return [value * scale for value in range(start, stop)]

bounds = (2, 5)
options = {"scale": 10}

print(measure(*bounds, **options))  # [20, 30, 40]`,
        codeNote: "The tuple supplies `start` and `stop`; the dictionary supplies the keyword-only `scale` option.",
        followups: [
          "What error occurs if two expanded mappings contain the same keyword?",
          "Can a generator be unpacked with a single star?",
          "How is call unpacking different from iterable unpacking in assignment?",
        ],
        metaDescription: "Understand Python call-side star and double-star unpacking, including binding rules, duplicate keywords, and a runnable example.",
      },
      {
        slug: "python-function-parameter-order",
        question: "How are positional, *args, keyword-only, and **kwargs parameters arranged in Python?",
        title: "Python Function Parameter Order",
        directAnswer: "A full Python signature proceeds from positional-only parameters, through positional-or-keyword parameters, optional `*args`, keyword-only parameters, and optional `**kwargs`. The `/` and `*` markers define the call modes.",
        difficulty: "medium",
        quick: [
          "Parameters before `/` are positional-only.",
          "Ordinary parameters before `*` accept a position or a keyword.",
          "`*args` collects remaining positional values and starts the keyword-only region.",
          "Named parameters after `*` or `*args` are keyword-only.",
          "`**kwargs` comes last and collects remaining keywords.",
        ],
        interview: bullets(
          "Python orders parameter kinds from the most positional to the most keyword-oriented. The complete order is positional-only, positional-or-keyword, `*args`, keyword-only, and finally `**kwargs`.",
          "A slash ends the positional-only region. A bare star or a named `*args` begins the keyword-only region. For example, in `def report(user_id, /, *scores, scale=1, **labels)`, `user_id` must be positional and `scale` must be named.",
          "Any extra positional values after `user_id` enter the `scores` tuple. Extra keywords other than `scale` enter the `labels` dictionary. Python completes this binding before it executes the function body.",
          "Defaults make individual parameters optional but do not change their kind. Required and defaulted positional parameters must still be arranged legally; keyword-only required parameters may appear among keyword-only defaults because callers identify them by name.",
          "I use these controls to make calls clear: positional-only for conventional operands, ordinary parameters for flexible inputs, and keyword-only for options whose names prevent confusion. I do not use every marker unless the API benefits from the restriction."
        ),
        deepTitle: "The signature defines a binding grammar",
        deep: paragraphs(
          "A signature is a contract for translating a call into local names. Positional-only parameters consume positions but refuse their parameter names as keywords. The middle region supports either style. A variadic positional parameter absorbs the remaining positions, so any named parameters after it can only be filled by keyword.",
          "A bare `*` creates the same keyword-only boundary without collecting extra positions. At the end, a double-starred parameter accepts keyword names not already claimed. It does not rescue duplicate or invalid bindings for earlier parameters.",
          "These kinds help maintain APIs as well as readability. A positional-only name can change without breaking keyword callers because such callers never existed. A keyword-only flag remains self-documenting at every call site."
        ),
        visualType: "comparison_table",
        visualTitle: "Read a complete signature from left to right",
        visual: lines(
          "| Region | Syntax example | Caller form | Local value |",
          "|---|---|---|---|",
          "| Positional-only | `user_id, /` | `report(7)` | One value |",
          "| Positional-or-keyword | `format=\"short\"` | position or `format=` | One value |",
          "| Variadic positional | `*scores` | more positions | Tuple |",
          "| Keyword-only | `scale=1` | `scale=` | One value |",
          "| Variadic keyword | `**labels` | more named values | Dictionary |"
        ),
        codeTitle: "Exercise every parameter region",
        code: String.raw`def report(user_id, /, *scores, scale=1, **labels):
    adjusted = [score * scale for score in scores]
    return user_id, adjusted, labels

result = report(7, 8, 9, scale=10, team="blue")
print(result)  # (7, [80, 90], {'team': 'blue'})`,
        codeNote: "Writing `report(user_id=7)` would fail because `user_id` is positional-only.",
        followups: [
          "What does a bare `*` do when there is no `*args` name?",
          "Why might a library choose a positional-only parameter?",
          "Can a required keyword-only parameter follow one with a default?",
        ],
        metaDescription: "Learn Python's full parameter order from positional-only through **kwargs and see how slash and star markers control calls.",
      },
    ],
  },
  {
    topic: "Lambda Functions",
    topicSlug: "lambda-functions",
    questions: [
      {
        slug: "python-lambda-functions",
        question: "What is a lambda function in Python?",
        title: "Lambda Functions in Python",
        directAnswer: "A Python lambda is a small anonymous function written as `lambda parameters: expression`. It returns the expression's result automatically and is limited to one expression, although it can accept ordinary parameters.",
        intent: {
          testing: "Whether you know what lambda syntax creates, its expression-only limit, and its sensible use as a short callback.",
          common_mistake: "Calling lambda a faster kind of function or trying to pack statement-heavy business logic into it.",
          to_stand_out: "Explain that a lambda creates the same kind of function object as `def`, but offers less room for documentation and debugging.",
        },
        quick: [
          "A lambda creates a function object without a `def` statement.",
          "Its form is `lambda parameters: expression`.",
          "The expression's value is returned automatically.",
          "Its body is one expression, not a sequence of statements.",
          "Use it mainly for a short callback that is clear where it is used.",
        ],
        interview: bullets(
          "A lambda is a compact way to create a function from one expression. The syntax is `lambda parameters: expression`, and the value produced by that expression becomes the return value without writing `return`.",
          "For example, `lambda name: name.casefold()` creates a function that normalizes one name. It can be passed directly as the `key` for `sorted`, where the behavior is short and used only at that call site.",
          "A lambda can accept defaults, `*args`, and `**kwargs`, and it follows the same scope rules as a function written with `def`. Semantically it creates an ordinary function object; it is not automatically faster or more memory-efficient.",
          "The body must be a single expression. It cannot contain statement blocks such as `try`, `while`, or assignment statements, and a complicated conditional expression quickly becomes harder to read than a named function.",
          "I use lambda for a tiny, obvious callback and choose `def` for reusable logic, several steps, documentation, or a function whose name helps explain the code. The decision is about clarity, not capability or speed."
        ),
        deepTitle: "An expression becomes a callable",
        deep: paragraphs(
          "Evaluating a lambda expression creates a function object. Its parameters are bound when the function is called, and its expression is evaluated in that new local scope. Free names follow normal lexical lookup, so a lambda can also close over values from an enclosing function.",
          "The expression restriction is syntactic. Conditional expressions, function calls, and comprehensions are expressions, so they can technically appear in a lambda. That does not make a deeply nested expression readable. The short form works best when the calling operation already gives the function a clear role, such as a sort key.",
          "Tracebacks and introspection usually display a lambda's name as `<lambda>`. When a callable is important enough to test, log, document, or reuse independently, a named `def` gives it a clearer identity."
        ),
        visualType: "comparison_table",
        visualTitle: "Lambda and def create callable functions",
        visual: lines(
          "| Feature | `lambda` | `def` |",
          "|---|---|---|",
          "| Body | One expression | Any valid function suite |",
          "| Return | Expression returned automatically | Explicit `return` or `None` |",
          "| Name | Usually `<lambda>` | Declared function name |",
          "| Best fit | Tiny local callback | Reusable or multi-step behavior |"
        ),
        codeTitle: "Use a lambda as a clear sort key",
        code: String.raw`people = [
    {"name": "grace", "score": 91},
    {"name": "Ada", "score": 95},
    {"name": "lin", "score": 91},
]

ranked = sorted(
    people,
    key=lambda person: (-person["score"], person["name"].casefold()),
)

print([person["name"] for person in ranked])  # ['Ada', 'grace', 'lin']`,
        codeNote: "The lambda is short because it only describes the ordering key; `sorted` supplies the surrounding operation.",
        followups: [
          "Can a lambda have default arguments?",
          "Why is a lambda not automatically faster than `def`?",
          "What happens if a lambda references a name from an outer function?",
        ],
        metaDescription: "Learn Python lambda syntax, expression-only behavior, scope rules, and the small callback use cases where lambda stays readable.",
      },
      {
        slug: "python-lambda-vs-def",
        question: "What is the difference between lambda and def in Python?",
        title: "Python Lambda Versus def",
        directAnswer: "Both lambda and `def` create callable function objects, but lambda is limited to one expression and is usually anonymous, while `def` supports statements, documentation, annotations, decorators, and a meaningful declared name.",
        layoutType: "comparison",
        quick: [
          "Both forms create function objects and use the same argument and scope rules.",
          "Lambda evaluates one expression and returns its result automatically.",
          "`def` supports multiple statements, explicit returns, docstrings, and decorators.",
          "A named function is easier to reuse, test, log, and understand in tracebacks.",
          "Choose from readability and lifetime, not from a performance myth.",
        ],
        interview: bullets(
          "Lambda and `def` both create Python function objects, so they share normal calling, parameter binding, and closure behavior. The main difference is how much behavior the syntax is designed to express.",
          "A lambda has one expression and returns that expression's value. It is convenient for a callback used in place, such as `key=lambda row: row['date']` in a sorting call. The surrounding operation explains why the function exists.",
          "A `def` function can contain several statements, branches, loops, exception handling, a docstring, and explicit return paths. It also has a useful declared name, which improves tracebacks, logs, tests, and documentation.",
          "Turning a complicated rule into one lambda does not make the program more Pythonic. For example, validation that has several failure cases should be a named function even if a nested expression could technically encode it.",
          "I keep lambda for a simple one-use transformation or predicate. Once the logic needs explanation, repetition, or more than one thought, I move it to `def`; that makes the intent easier to review without changing the underlying function model."
        ),
        deepTitle: "The syntax communicates the function's lifetime",
        deep: paragraphs(
          "A lambda expression produces its function object as part of a larger expression, so it can be supplied without first binding a descriptive name. A `def` statement creates a function and binds it to the declared identifier in the current namespace. Either result can later be assigned to another name or passed around.",
          "Their code bodies differ sharply. Lambda grammar accepts an expression, which has a value. A function suite under `def` accepts statements, allowing intermediate names, early returns, resource handling, and documentation. This affects maintainability rather than the basic ability to be called.",
          "A useful review rule is to read the call site aloud. If the lambda's role and result are obvious immediately, it may be the smaller form. If the reader must decode the expression, a named function turns that decoding into a reusable concept."
        ),
        visualType: "comparison_table",
        visualTitle: "Pick the form that exposes the intent",
        visual: lines(
          "| Need | Better starting point | Reason |",
          "|---|---|---|",
          "| One short sort key | Lambda | The call gives it context |",
          "| Reused validation rule | `def` | A name explains the rule |",
          "| Several steps or branches | `def` | Statements remain readable |",
          "| Tiny one-use predicate | Lambda | No extra declaration is needed |",
          "| Decorator or docstring | `def` | The statement supports both directly |"
        ),
        codeTitle: "Express the same rule both ways",
        code: String.raw`words = ["pear", "fig", "watermelon"]

by_length = lambda word: len(word)

def word_length(word):
    """Return the number of characters in a word."""
    return len(word)

print(sorted(words, key=by_length))
print(sorted(words, key=word_length))`,
        codeNote: "The results are the same. The named form becomes preferable when the rule deserves reuse or explanation.",
        followups: [
          "Do lambda and `def` follow different closure rules?",
          "Why do tracebacks often make named functions easier to debug?",
          "Can a lambda contain a conditional expression?",
        ],
        metaDescription: "Compare Python lambda and def by syntax, capabilities, debugging, reuse, and readability rather than performance myths.",
      },
      {
        slug: "python-lambda-sorted-key",
        question: "How does a key function work with sorted() in Python?",
        title: "Python sorted() Key Functions",
        directAnswer: "`sorted(iterable, key=function)` calls the key function once for each item and compares the returned keys, while returning the original items in the resulting order. A lambda is convenient when that key rule is short and local.",
        quick: [
          "The key function converts each item into a value used for comparison.",
          "`sorted` returns the original items, not the computed keys.",
          "Python computes the key once per item during a sort.",
          "Tuple keys provide ordered tie-breakers from left to right.",
          "Use a named function or `operator` helper when it reads more clearly than lambda.",
        ],
        interview: bullets(
          "The `key` argument tells `sorted` how to derive a comparison value from each item. Python computes that key for every item, sorts by the keys, and places the original items into the resulting list.",
          "For example, `sorted(names, key=str.casefold)` orders names without making uppercase letters dominate lowercase ones. The returned list still contains the original spellings; `casefold` is used only to produce comparison keys.",
          "A key can be a lambda when it needs a short extraction, such as `lambda product: product['price']`. It can also return a tuple. `key=lambda p: (-p['score'], p['name'])` sorts score descending and uses the name as the tie-breaker.",
          "Python's sort is stable, so items with equal keys keep their earlier relative order. This also allows multiple sorting passes, although a single tuple key is often easier to see for simple rules.",
          "I avoid doing expensive I/O or changing state inside a key function. It should be a predictable calculation. For common attribute or item access, `operator.attrgetter` or `itemgetter` can be clearer than a lambda."
        ),
        deepTitle: "Decorate, sort, and return the original records",
        deep: paragraphs(
          "Conceptually, key-based sorting attaches a derived value to each record, orders those derived values, and then discards them. CPython's sorting implementation calculates each key once rather than repeatedly calling the key function for every comparison.",
          "Tuple comparison proceeds element by element. A negative numeric component reverses that one part of an ascending sort, and the next component resolves ties. This is often clearer than placing branching logic inside the key.",
          "Stability matters when data already has an order. If two records produce equal keys, their existing relationship is preserved. The property makes chained sorts reliable when the least important criterion is applied first."
        ),
        visualType: "flow_diagram",
        visualTitle: "The key is temporary; the records are returned",
        visual: lines(
          "```mermaid",
          "flowchart LR",
          "  R[original records] --> K[compute one key per record]",
          "  K --> S[sort the keys]",
          "  S --> O[return original records in key order]",
          "  K -. equal keys .-> T[keep earlier relative order]",
          "```"
        ),
        codeTitle: "Sort with a two-part key",
        code: String.raw`students = [
    {"name": "Mina", "score": 88},
    {"name": "ada", "score": 95},
    {"name": "Ben", "score": 88},
]

ranked = sorted(
    students,
    key=lambda student: (-student["score"], student["name"].casefold()),
)

print([(student["name"], student["score"]) for student in ranked])`,
        codeNote: "The score is negated for descending order, while the normalized name provides an ascending tie-breaker.",
        followups: [
          "Why does `sorted` return records instead of key values?",
          "What does sort stability mean for equal keys?",
          "When is `operator.itemgetter` clearer than a lambda?",
        ],
        metaDescription: "Understand how Python sorted key functions derive comparison values, use tuple tie-breakers, and preserve stable ordering.",
      },
    ],
  },
  {
    topic: "Map, Filter, and Reduce",
    topicSlug: "map-filter-reduce",
    questions: [
      {
        slug: "python-map-filter-reduce-difference",
        question: "What is the difference between map(), filter(), and reduce() in Python?",
        title: "Python map(), filter(), and reduce()",
        directAnswer: "`map` transforms every input item, `filter` keeps only items that pass a predicate, and `functools.reduce` repeatedly combines items into one accumulated result. In Python 3, map and filter return iterators.",
        layoutType: "comparison",
        intent: {
          testing: "Whether you can distinguish transformation, selection, and accumulation and choose the clearest Python construct.",
          common_mistake: "Claiming that all three return lists or using `reduce` where a named built-in states the operation better.",
          to_stand_out: "Mention iterator behavior and compare each operation with its readable comprehension or built-in equivalent.",
        },
        quick: [
          "`map(function, items)` yields one transformed result for each input item.",
          "`filter(predicate, items)` yields only original items whose predicate result is truthy.",
          "`reduce(combiner, items, initial)` carries an accumulator and produces one final value.",
          "`map` and `filter` are lazy iterators in Python 3.",
          "Prefer a comprehension or a specific built-in when it communicates the operation more directly.",
        ],
        answerSize: "standard",
        interview: bullets(
          "These three tools represent different data operations. `map` is transformation, `filter` is selection, and `functools.reduce` is accumulation. The function passed to each tool therefore has a different job.",
          "`map(transform, iterable)` applies the transform to every item and yields each result. For example, `map(str.strip, raw_names)` produces cleaned strings and has one output for each input. With several iterables, it takes one item from each for every function call.",
          "`filter(predicate, iterable)` calls a one-item test and yields the original item only when the result is truthy. For example, `filter(str.isdigit, values)` keeps strings containing only digits. It does not return the predicate's Boolean results.",
          "`reduce(combine, iterable, initial)` works differently. It keeps an accumulated value, combines it with the next item, and repeats until one value remains. Multiplying `[2, 3, 4]` with an initial value of `1` produces `24`.",
          "In Python 3, `map` and `filter` return iterators, so work happens as they are consumed. `reduce` is imported from `functools` and returns its final accumulator directly.",
          "The callbacks may be named functions, lambdas, or other callables. A named function is often better when the rule is reused or needs explanation, while an existing method such as `str.strip` can be passed directly without wrapping it in a lambda.",
          "For straightforward transformations and filters, comprehensions are often easier to read. For familiar reductions I prefer `sum`, `min`, `max`, `any`, or `all`; I use `reduce` only when the combining rule itself is the clearest description."
        ),
        deepTitle: "Three different shapes of computation",
        deep: paragraphs(
          "Imagine a row of input cards. A mapping station replaces the value written on every card, so the number of cards normally stays the same. A filtering gate removes cards that fail a condition, so the result can be shorter. A reducing station keeps one running card and folds each new item into it until the stream becomes a single answer.",
          "The callback contracts reflect those shapes. A map callback receives one item from each source iterable and returns a replacement. A filter callback receives one item and returns a truth-test result, but the item itself passes through. A reducer normally receives the current accumulator and the next item and returns the next accumulator.",
          "Naming the shape first prevents misuse. A list-building loop maps or filters. A total folds. If Python already has a domain-specific operation, that name carries more meaning than a generic functional tool."
        ),
        visualType: "flow_diagram",
        visualTitle: "Transform, select, or combine",
        visual: lines(
          "```mermaid",
          "flowchart LR",
          "  I[input 2, 3, 4] --> M[map square]",
          "  M --> MO[4, 9, 16]",
          "  I --> F[filter even]",
          "  F --> FO[2, 4]",
          "  I --> R[reduce multiply]",
          "  R --> RO[24]",
          "```"
        ),
        codeTitle: "Run the three operations on one dataset",
        code: String.raw`from functools import reduce
from operator import mul

numbers = [2, 3, 4]

squares = list(map(lambda number: number * number, numbers))
evens = list(filter(lambda number: number % 2 == 0, numbers))
product = reduce(mul, numbers, 1)

print(squares)  # [4, 9, 16]
print(evens)    # [2, 4]
print(product)  # 24`,
        codeNote: "`list` consumes the lazy map and filter iterators so their yielded values are visible.",
        followups: [
          "What does `filter(None, values)` keep?",
          "Why are comprehensions often preferred for simple mapping and filtering?",
          "What role does the initial value play in `reduce`?",
        ],
        metaDescription: "Compare Python map, filter, and reduce by transformation, selection, accumulation, return shape, and lazy iterator behavior.",
      },
      {
        slug: "python-map-filter-iterators",
        question: "Why do map() and filter() return iterators in Python 3?",
        title: "Lazy map() and filter() Iterators",
        directAnswer: "Map and filter return iterators so they can process one source item at a time instead of first building a complete result list. Computation begins when the iterator is consumed, and an exhausted iterator does not restart.",
        quick: [
          "Creating a map or filter object does not eagerly build all results.",
          "Each next step pulls source data and computes only the next output.",
          "Lazy processing supports large and even unbounded input streams.",
          "Converting to `list` consumes the iterator and stores every result.",
          "Once exhausted, the same map or filter iterator yields no more values.",
        ],
        interview: bullets(
          "In Python 3, `map` and `filter` return iterator objects. They calculate results on demand, so creating the pipeline does not immediately visit the whole source or allocate a second list of every result.",
          "For example, `cleaned = map(str.strip, lines)` stores a recipe. Calling `next(cleaned)` pulls one line, strips it, and returns one value. A loop continues that pull process until the input is exhausted.",
          "This behavior is useful for large files and chained pipelines because only the current items need to be in memory. It can also represent an unbounded source that could never become a complete list.",
          "The boundary is that an iterator is stateful and normally one-pass. If code converts `cleaned` to a list or loops over it once, a second loop over the same object sees no values. Re-create the iterator or materialize it deliberately when reuse is required.",
          "Laziness also delays exceptions and side effects in the callback until consumption. I therefore keep map and filter callbacks pure where possible and choose a list comprehension when the program truly needs a reusable list immediately."
        ),
        deepTitle: "The consumer drives the pipeline",
        deep: paragraphs(
          "An iterator exposes a next-item protocol rather than a completed container. A map iterator holds its function and references to its input iterators. Each request advances the sources, invokes the function, and yields that one answer. Filter may advance several source items before finding the next one whose predicate succeeds.",
          "Because values are pulled rather than pushed into a list, stages can be chained without intermediate containers. A filter can consume a map, and a final loop can consume the filter. Only enough work to satisfy the final request moves through the chain.",
          "The same property changes timing. Logging, validation errors, or other callback effects are not observed at pipeline construction. They occur during iteration, which is why storing an iterator without consuming it may appear to do nothing."
        ),
        visualType: "sequence_diagram",
        visualTitle: "One next request moves one value",
        visual: lines(
          "```mermaid",
          "sequenceDiagram",
          "  participant Loop",
          "  participant Map",
          "  participant Source",
          "  Loop->>Map: next",
          "  Map->>Source: next item",
          "  Source-->>Map: raw value",
          "  Map-->>Loop: transformed value",
          "  Loop->>Map: next again",
          "```"
        ),
        codeTitle: "Observe work happen during consumption",
        code: String.raw`def double(number):
    print(f"processing {number}")
    return number * 2

values = map(double, [1, 2, 3])
print("pipeline created")
print(next(values))
print(list(values))
print(list(values))  # already exhausted
`,
        codeNote: "The processing messages appear only when `next` or `list` asks the iterator for values.",
        followups: [
          "Why can a lazy exception appear far from the line that created the map object?",
          "How would you reuse the results more than once?",
          "What is the difference between an iterable and an iterator?",
        ],
        metaDescription: "Learn why Python map and filter are lazy one-pass iterators, when computation occurs, and when list materialization is appropriate.",
      },
      {
        slug: "python-reduce-initial-value",
        question: "How does functools.reduce() use its initial value?",
        title: "Python reduce() and the Initial Value",
        directAnswer: "`reduce(function, iterable, initial)` starts the accumulator with `initial`, then combines it with every item from left to right. The initial value also becomes the result for an empty iterable; without it, reducing an empty iterable raises TypeError.",
        difficulty: "medium",
        quick: [
          "`reduce` repeatedly calls a two-argument combining function.",
          "With an initial value, the first call combines the initial value and the first item.",
          "The final accumulator is the single returned result.",
          "For an empty iterable, the initial value is returned unchanged.",
          "Without an initial value, the first item becomes the accumulator and an empty input fails.",
        ],
        interview: bullets(
          "`functools.reduce` folds an iterable into one result. Its combining function receives the current accumulator and the next item, then returns the accumulator to use for the following step.",
          "When an initial value is supplied, it is the first accumulator. For example, `reduce(mul, [2, 3, 4], 1)` performs `1 × 2`, then `2 × 3`, then `6 × 4`, and returns `24`.",
          "The initial value defines useful empty-input behavior. Reducing an empty product with initial `1` returns `1`. Without an initial value, `reduce` takes the first iterable item as its starting accumulator, so an empty iterable has no starting point and raises `TypeError`.",
          "The initial value should match the accumulator's type and the operation's identity or seed. For list collection it might be an empty list, though mutating an accumulator inside a reducer can be less clear than a normal loop.",
          "I prefer named built-ins such as `sum`, `min`, `max`, `any`, and `all` when they match the task. I use `reduce` when a left-to-right combining rule is genuinely the clearest model and define empty-input behavior deliberately."
        ),
        deepTitle: "Follow the accumulator, not the collection",
        deep: paragraphs(
          "A reduction can be read as a state transition. Before an item is consumed, the accumulator represents the answer for the prefix already seen. The combining function extends that answer to include one more item. After the final transition, the accumulator represents the whole input.",
          "Supplying a seed makes that invariant true before any items exist. For addition, zero is the identity; for multiplication, one is the identity. Other reductions use a domain-specific starting state, such as a record containing an empty total and count.",
          "Without a seed, the first item is removed from the iterator and used as the initial state. That shortcut works only when at least one item exists and when the item type is also a valid accumulator type."
        ),
        visualType: "comparison_table",
        visualTitle: "Accumulator trace for a product",
        visual: lines(
          "| Step | Accumulator before | Next item | Accumulator after |",
          "|---:|---:|---:|---:|",
          "| Start | `1` | — | `1` |",
          "| 1 | `1` | `2` | `2` |",
          "| 2 | `2` | `3` | `6` |",
          "| 3 | `6` | `4` | `24` |"
        ),
        codeTitle: "Define the empty case with a seed",
        code: String.raw`from functools import reduce
from operator import mul

def product(numbers):
    return reduce(mul, numbers, 1)

print(product([2, 3, 4]))  # 24
print(product([]))         # 1`,
        codeNote: "The multiplicative identity `1` makes the empty result intentional instead of exceptional.",
        followups: [
          "What happens when `reduce` receives one item and no initial value?",
          "Why is `sum(values)` usually clearer than `reduce(add, values, 0)`?",
          "Can an accumulator have a different type from each input item?",
        ],
        metaDescription: "Trace Python functools.reduce step by step and understand how an initial value controls the first combination and empty input.",
      },
    ],
  },
  {
    topic: "List, Dict, and Set Comprehensions",
    topicSlug: "list-dict-set-comprehensions",
    questions: [
      {
        slug: "python-list-dict-set-comprehensions",
        question: "How do list, dictionary, and set comprehensions differ in Python?",
        title: "List, Dict, and Set Comprehensions",
        directAnswer: "All three comprehensions transform or filter an iterable, but their outer syntax chooses the result: brackets build a list, a `{key: value ...}` expression builds a dictionary, and a `{value ...}` expression builds a set.",
        layoutType: "comparison",
        intent: {
          testing: "Whether you can read comprehension order and choose the result collection from the data relationship.",
          common_mistake: "Confusing a set comprehension with dictionary syntax or using a comprehension only for side effects.",
          to_stand_out: "Explain output shape, duplicate handling, and what happens when dictionary keys repeat.",
        },
        quick: [
          "`[expression for item in source]` builds a list and keeps output order and duplicates.",
          "`{key: value for item in source}` builds a dictionary from key-value pairs.",
          "`{expression for item in source}` builds a set of unique hashable results.",
          "An optional trailing `if` can filter which source items contribute.",
          "Use a normal loop when the transformation has several steps or side effects.",
        ],
        answerSize: "standard",
        interview: bullets(
          "A comprehension builds a new collection by describing an output expression, an iteration, and optionally a filter. The surrounding delimiters and expression shape decide which collection Python creates.",
          "A list comprehension uses brackets, such as `[name.strip() for name in names]`. It produces one list entry for every source item that passes the filter, preserving iteration order and allowing repeated results.",
          "A dictionary comprehension uses a colon between key and value: `{user['id']: user['name'] for user in users}`. If the same key is produced more than once, the later value replaces the earlier one, just as with repeated dictionary assignment.",
          "A set comprehension uses braces without a colon, such as `{name.casefold() for name in names}`. Its result contains unique hashable values, so duplicate normalized names collapse and positional order is not the contract.",
          "All three forms can add a trailing condition, for example `[n * n for n in numbers if n >= 0]`. They are best for a small transformation or filter, not for printing, mutating unrelated state, or hiding several business rules.",
          "Each comprehension produces a new collection; it does not change the source collection by itself. Any function calls inside the expression can still mutate external state, but mixing those side effects into construction makes the result harder to predict.",
          "I select the form from the output relationship: ordered sequence, key-to-value lookup, or unique membership. If that relationship is not obvious from one readable line, I expand the work into a named loop."
        ),
        deepTitle: "Read a comprehension in execution order",
        deep: paragraphs(
          "Although the output expression appears first, a simple comprehension is easiest to trace from the `for` clause. Python takes an item from the source, tests any trailing condition, evaluates the output expression for accepted items, and inserts the result into the new collection.",
          "The destination applies its own rules. Lists retain every produced value. Sets require hashable values and merge equal results. Dictionaries evaluate a key and value for each accepted item; assigning a key already present updates that entry while keeping the dictionary's normal insertion-order behavior.",
          "Comprehensions create a scope for their iteration variables in modern Python, so the target name does not leak into the surrounding scope. Functions called inside the expression can still have side effects, but relying on those effects makes a construction expression much harder to understand."
        ),
        visualType: "comparison_table",
        visualTitle: "One loop, three result contracts",
        visual: lines(
          "| Form | Produces | Duplicates | Main access |",
          "|---|---|---|---|",
          "| `[value for ...]` | List | Kept | Position / iteration |",
          "| `{key: value for ...}` | Dictionary | Later value wins for a repeated key | Key |",
          "| `{value for ...}` | Set | Removed | Membership |"
        ),
        codeTitle: "Build three useful views of the same records",
        code: String.raw`users = [
    {"id": 1, "name": " Ada ", "active": True},
    {"id": 2, "name": "Lin", "active": False},
    {"id": 3, "name": "ADA", "active": True},
]

active_names = [user["name"].strip() for user in users if user["active"]]
names_by_id = {user["id"]: user["name"].strip() for user in users}
normalized_names = {user["name"].strip().casefold() for user in users}

print(active_names)       # ['Ada', 'ADA']
print(names_by_id)        # {1: 'Ada', 2: 'Lin', 3: 'ADA'}
print(normalized_names)   # {'ada', 'lin'} in unspecified display order`,
        codeNote: "The list keeps both active spellings, the dictionary indexes by ID, and the set represents unique normalized names.",
        followups: [
          "What happens when a dictionary comprehension produces the same key twice?",
          "Why must values produced for a set be hashable?",
          "Do comprehension loop variables leak into the surrounding scope?",
        ],
        metaDescription: "Compare Python list, dictionary, and set comprehensions by syntax, output shape, duplicate behavior, and practical use.",
      },
      {
        slug: "python-comprehension-filter-vs-conditional",
        question: "How is a filter different from a conditional expression in a Python comprehension?",
        title: "Comprehension Filters Versus Conditional Expressions",
        directAnswer: "A trailing `if condition` filters items out, while `value_if_true if condition else value_if_false` in the output position keeps each item and chooses which value to produce. Their position reflects their different jobs.",
        difficulty: "medium",
        quick: [
          "A trailing `if` decides whether an item appears in the result.",
          "An `if ... else ...` before `for` decides which value an item produces.",
          "Filtering can shorten the result; a conditional mapping normally keeps its length.",
          "A conditional expression always needs an `else` branch.",
          "Both forms can be combined when the combined expression stays readable.",
        ],
        interview: bullets(
          "A comprehension filter controls participation, while a conditional expression controls the output value. They both use `if`, but they appear in different positions because they answer different questions.",
          "A filter comes after the iteration: `[n for n in numbers if n >= 0]`. Negative values produce no result item, so the output can be shorter than the input.",
          "A conditional expression comes before `for`: `['even' if n % 2 == 0 else 'odd' for n in numbers]`. Every input produces one label, and the condition chooses between the two expressions.",
          "The conditional form requires `else` because it must produce something for both outcomes. The trailing filter has no `else`; a failed condition simply skips that iteration.",
          "The forms may be combined, such as labeling only non-negative values, but stacked conditions become difficult to scan. I use one clear output decision and one clear filter at most, then switch to a loop or helper function for richer rules."
        ),
        deepTitle: "Selection and transformation occur at different stages",
        deep: paragraphs(
          "Trace the pipeline from the source. The `for` clause obtains a candidate. A trailing condition acts like a gate before insertion. If the gate closes, Python never evaluates the result expression for that candidate.",
          "For an accepted candidate, Python evaluates the expression at the beginning of the comprehension. That expression may itself choose between two values using Python's ternary form. Its condition does not remove the candidate; either its true branch or false branch supplies the output.",
          "This evaluation order matters when expressions can fail or are expensive. A filter can protect the output expression, for example by excluding zero before dividing. Clear staging is safer than relying on a dense combination whose order a reader must reconstruct."
        ),
        visualType: "flow_diagram",
        visualTitle: "Skip an item or choose its value",
        visual: lines(
          "```mermaid",
          "flowchart TD",
          "  N[next source item] --> F{trailing filter passes?}",
          "  F -- No --> N",
          "  F -- Yes --> C{conditional output test}",
          "  C -- True --> T[produce true value]",
          "  C -- False --> E[produce else value]",
          "```"
        ),
        codeTitle: "Compare removal with relabeling",
        code: String.raw`numbers = [-2, -1, 0, 1, 2]

non_negative = [number for number in numbers if number >= 0]
labels = ["even" if number % 2 == 0 else "odd" for number in numbers]
labeled_non_negative = [
    "even" if number % 2 == 0 else "odd"
    for number in numbers
    if number >= 0
]

print(non_negative)          # [0, 1, 2]
print(labels)                # ['even', 'odd', 'even', 'odd', 'even']
print(labeled_non_negative)  # ['even', 'odd', 'even']`,
        codeNote: "The trailing condition removes values; the leading conditional expression changes what retained values become.",
        followups: [
          "Which part runs first for each source item?",
          "Why does a conditional expression require `else`?",
          "How can a filter prevent an error in the output expression?",
        ],
        metaDescription: "Learn the syntax and execution difference between trailing filters and if-else output expressions in Python comprehensions.",
      },
      {
        slug: "python-list-comprehension-vs-generator-expression",
        question: "What is the difference between a list comprehension and a generator expression?",
        title: "List Comprehension Versus Generator Expression",
        directAnswer: "A list comprehension eagerly builds and stores a complete list, while a generator expression produces a one-pass iterator that calculates values as they are requested. Their loop syntax is similar, but their memory use and reuse differ.",
        layoutType: "comparison",
        quick: [
          "List comprehensions use brackets and create the full list immediately.",
          "Generator expressions use parentheses and calculate values lazily.",
          "A list can be iterated repeatedly; the same generator is normally one-pass.",
          "Generators can stream large or unbounded inputs with low extra memory.",
          "Choose a list when all results are needed for indexing, length, or reuse.",
        ],
        answerSize: "standard",
        interview: bullets(
          "A list comprehension and a generator expression use nearly the same `expression for item in iterable` pattern, but they create different objects. Brackets build a list; parentheses build a generator iterator.",
          "The list form is eager. `[n * n for n in range(5)]` evaluates all five squares immediately and stores them, so the result has a length, supports indexing, and can be traversed many times.",
          "The generator form is lazy. `(n * n for n in range(5))` saves the recipe and yields the next square only when a consumer asks. That keeps extra memory low for a large stream and allows processing to begin before the entire source is available.",
          "A generator carries iteration state and is normally consumed once. After `sum(squares)` reaches the end, another pass over that same generator finds nothing. A list continues to own all its elements until it is released.",
          "I choose a generator when values flow once into a consumer such as `sum`, `any`, a loop, or a file writer. I choose a list when callers need indexing, a known length, repeated passes, or the complete snapshot. Materializing a generator with `list` deliberately changes that trade-off.",
          "Laziness also postpones work and exceptions. That can be useful, but the code must keep the source resource alive long enough and must understand when consumption actually happens."
        ),
        deepTitle: "Eager storage and suspended execution",
        deep: paragraphs(
          "A list comprehension drives its input to exhaustion as soon as the expression runs. Each produced value is appended to a new list, and control returns only after construction finishes or an error occurs.",
          "A generator expression instead creates an iterator with suspended execution state. Every `next` request resumes the internal loop, finds the next value, yields it, and pauses again. No output container grows unless a downstream consumer builds one.",
          "Memory is only one boundary. A lazy pipeline may hold a reference to its source, and the source may be stateful. For example, values tied to an open file must be consumed before the file closes. Choosing laziness means choosing a lifetime and execution time as well as a container type."
        ),
        visualType: "comparison_table",
        visualTitle: "Choose from consumption needs",
        visual: lines(
          "| Property | List comprehension | Generator expression |",
          "|---|---|---|",
          "| Syntax | `[expr for ...]` | `(expr for ...)` |",
          "| Evaluation | Immediate | On each request |",
          "| Storage | Every result | Current suspended state |",
          "| Reuse | Repeatable | Normally one-pass |",
          "| Supports indexing | Yes | No |",
          "| Strong fit | Snapshot and random access | Streaming into one consumer |"
        ),
        codeTitle: "Consume the same calculation eagerly and lazily",
        code: String.raw`eager = [number * number for number in range(4)]
lazy = (number * number for number in range(4))

print(eager[2])       # 4
print(sum(lazy))      # 14
print(list(lazy))     # []: the generator is exhausted
print(sum(eager))     # 14: the list remains reusable`,
        codeNote: "The generator's values leave it during the first reduction; the list retains its stored values.",
        followups: [
          "When can a generator keep a file or another resource alive?",
          "Does a generator expression calculate its first result at creation time?",
          "How can you deliberately materialize a generator?",
        ],
        metaDescription: "Compare Python list comprehensions with generator expressions by evaluation time, memory, reuse, indexing, and streaming behavior.",
      },
    ],
  },
  {
    topic: "Nested Functions",
    topicSlug: "nested-functions",
    questions: [
      {
        slug: "python-nested-functions-and-closures",
        question: "What is a nested function, and when does it become a closure?",
        title: "Nested Functions and Closures in Python",
        directAnswer: "A nested function is defined inside another function. It forms a closure when it keeps access to one or more names from an enclosing function scope, allowing those bindings to remain available after the outer call returns.",
        intent: {
          testing: "Whether you can distinguish lexical nesting from captured enclosing state and explain the lifetime of a returned inner function.",
          common_mistake: "Calling every nested function a closure even when it uses no enclosing function variables.",
          to_stand_out: "Separate code location, captured free variables, and the closure's practical use in a configured function.",
        },
        quick: [
          "A nested function is defined inside another function's body.",
          "It can read local names from the enclosing function scope.",
          "It is a closure when it retains access to an enclosing binding it uses.",
          "Captured bindings can remain alive after the outer call has returned.",
          "Closures are useful for small private state and configured function factories.",
        ],
        answerSize: "standard",
        interview: bullets(
          "A nested function is simply a function defined within another function. Its name is local to the outer call unless the inner function is returned, stored, or passed somewhere else.",
          "The inner function becomes a closure when it refers to a binding from an enclosing function scope and retains access to that binding. The enclosing data can remain available even after the outer function has finished.",
          "For example, `make_multiplier(3)` can create `factor = 3`, define an inner `multiply(number)` that uses `factor`, and return it. Calling the returned function later still multiplies by three, so the configuration travels with the callable.",
          "A closure follows Python's lexical scope rules. It captures access to a binding, not a general copy of every local value. Variables that the inner function does not need do not become part of that closure.",
          "Closures work well for a small focused piece of private configuration or state. If the behavior grows into several operations, many state fields, inheritance, or a public lifecycle, a class normally communicates the model more clearly.",
          "The captured binding is not automatically frozen. If the enclosing scope rebinds it with `nonlocal` or mutates the object it references, later calls observe that change. This makes closure state useful, but it also deserves the same care as other persistent state.",
          "So nesting describes where a function is declared, while closure describes its relationship with enclosing variables. That distinction explains both the retained state and the design boundary."
        ),
        deepTitle: "The returned function carries its environment",
        deep: paragraphs(
          "During compilation, Python identifies names used by an inner function that belong to an enclosing function. The runtime can place those bindings in closure cells. The inner function object then references the required cells along with its code.",
          "Returning the inner function removes the outer call frame from active execution, but cells still referenced by the returned callable remain reachable. This is ordinary object lifetime: data survives while another live object refers to it.",
          "Nesting alone is not enough. An inner helper that only uses its own parameters and module globals has no enclosed function state to retain. You can inspect a real closure through the function's `__closure__` and `__code__.co_freevars`, although production code rarely needs to do so."
        ),
        visualType: "flow_diagram",
        visualTitle: "How configuration survives the outer call",
        visual: lines(
          "```mermaid",
          "flowchart LR",
          "  O[call make_multiplier with 3] --> B[create enclosing factor binding]",
          "  B --> I[create inner multiply function]",
          "  I --> C[closure keeps access to factor]",
          "  O -->|returns| C",
          "  C --> L[later call uses factor 3]",
          "```"
        ),
        codeTitle: "Return a configured function",
        code: String.raw`def make_multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

triple = make_multiplier(3)
print(triple(4))                 # 12
print(triple.__code__.co_freevars)  # ('factor',)`,
        codeNote: "The returned `multiply` function still reaches the `factor` binding created by its particular outer call.",
        followups: [
          "Is every nested function a closure?",
          "Where can you inspect a function's free-variable names?",
          "When would a class be clearer than a closure?",
        ],
        metaDescription: "Learn the exact difference between a nested function and a Python closure, including captured bindings, lifetime, and a runnable factory.",
      },
      {
        slug: "python-nonlocal-closure-state",
        question: "How does nonlocal work in a Python nested function?",
        title: "Using nonlocal in Python Closures",
        directAnswer: "`nonlocal name` makes assignments in a nested function target an existing binding in the nearest enclosing function scope. Without it, assigning that name would create a local binding in the inner function.",
        quick: [
          "`nonlocal` applies to a name in an enclosing function scope.",
          "The enclosing binding must already exist.",
          "It is required for rebinding, not for merely reading the value.",
          "Mutating a captured list or dictionary does not rebind its name.",
          "Use it for small private closure state; use an object when state becomes substantial.",
        ],
        interview: bullets(
          "`nonlocal` tells Python that a name assigned inside a nested function belongs to an enclosing function scope rather than the inner function's local scope. Python uses the nearest matching enclosing binding.",
          "For example, a counter factory can create `count = 0`. Its inner `increment` function declares `nonlocal count`, assigns `count += 1`, and therefore updates the same retained count on every call.",
          "Reading an enclosing name needs no declaration. The declaration is needed because assignment normally makes a name local to the current function. Without `nonlocal`, `count += 1` tries to read the new local before it has a value and raises `UnboundLocalError`.",
          "Mutation is different from rebinding. If a closure captures a list, `items.append(value)` changes the reached list and does not require `nonlocal`. Writing `items = items + [value]` binds the name and does require it if the enclosing binding should change.",
          "`nonlocal` cannot target the module's global scope and cannot create a missing enclosing binding; `global` handles module-level rebinding. I keep nonlocal state small because a class becomes clearer when several methods or invariants must manage it."
        ),
        deepTitle: "Assignment chooses a namespace",
        deep: paragraphs(
          "Python determines the scope of a bound name for an entire function block. An assignment makes the name local unless a declaration redirects it. This decision is why a read appearing before the assignment cannot silently fall back to an enclosing value.",
          "A `nonlocal` declaration redirects binding operations to a cell belonging to a lexically surrounding function. If several functions are nested, name resolution selects the nearest enclosing scope that already owns that name. Class bodies and module globals are not valid nonlocal targets.",
          "The keyword changes where the reference is stored, not whether an object is mutable. Method calls and item assignments can modify a captured object without replacing the cell's reference, so they follow the object's mutation rules instead."
        ),
        visualType: "flow_diagram",
        visualTitle: "Rebinding with and without nonlocal",
        visual: lines(
          "```mermaid",
          "flowchart TD",
          "  A[inner function assigns count] --> N{nonlocal count declared?}",
          "  N -- Yes --> E[update nearest enclosing count cell]",
          "  N -- No --> L[treat count as inner local]",
          "  L --> U[read before local assignment can raise UnboundLocalError]",
          "```"
        ),
        codeTitle: "Keep one count between calls",
        code: String.raw`def make_counter(start=0):
    count = start

    def increment(step=1):
        nonlocal count
        count += step
        return count

    return increment

counter = make_counter(10)
print(counter())   # 11
print(counter(4))  # 15`,
        codeNote: "Both calls rebind the same enclosed `count`; each call still has its own local `step`.",
        followups: [
          "Why would removing `nonlocal` raise `UnboundLocalError` here?",
          "How is rebinding different from mutating a captured list?",
          "Can `nonlocal` refer directly to a module variable?",
        ],
        metaDescription: "Understand how Python nonlocal redirects assignment to an enclosing function binding, including rebinding, mutation, and errors.",
      },
      {
        slug: "python-function-factory",
        question: "How does a function factory create configured functions in Python?",
        title: "Function Factories with Python Closures",
        directAnswer: "A function factory accepts configuration, defines an inner function that uses it, and returns that function. Each factory call creates a separate enclosing environment, so the returned callables can keep different configurations.",
        quick: [
          "The outer function receives or creates configuration.",
          "The inner function uses that enclosing configuration.",
          "Returning the inner function lets callers run it later.",
          "Every outer call creates a distinct set of enclosed bindings.",
          "Factories suit small configured behaviors; classes suit richer stateful interfaces.",
        ],
        interview: bullets(
          "A function factory is a function whose result is another function. The outer call receives configuration, and the returned inner function keeps access to that configuration through a closure.",
          "For example, `make_discount(10)` can convert ten percent to a factor and return a function that applies it to any price. A separate call `make_discount(25)` creates another function with a different retained factor.",
          "Each outer call has its own enclosing bindings, so the configured functions do not overwrite one another. The caller sees a simple one-argument callable and does not need to pass the same configuration repeatedly.",
          "This pattern is useful for callbacks, validators, formatters, and small dependency adapters. It can also keep helper details private because the inner function is created and exposed only through the factory.",
          "The boundary is interface size. If callers need several related operations, visible state, inheritance, or a lifecycle such as open and close, a class or explicit object usually represents the concept more clearly than several returned closures."
        ),
        deepTitle: "One recipe can produce independent callables",
        deep: paragraphs(
          "The factory's parameters are ordinary locals for one outer call. Defining the inner function connects its free names to that call's cells. Returning the inner callable gives another part of the program access to the behavior without exposing the storage directly.",
          "Calling the factory again creates a new execution scope and a different set of cells. This is why two returned functions can share the same code object yet behave differently: their closure environments hold different configuration.",
          "A factory can validate or normalize configuration once rather than on every inner call. That makes repeated execution smaller, but any mutable enclosed object also becomes persistent shared state for that particular callable and should be handled deliberately."
        ),
        visualType: "flow_diagram",
        visualTitle: "One factory call, one configuration",
        visual: lines(
          "```mermaid",
          "flowchart TD",
          "  F[make_discount] --> C10[call with 10 percent]",
          "  F --> C25[call with 25 percent]",
          "  C10 --> D10[returned function retains factor 0.90]",
          "  C25 --> D25[returned function retains factor 0.75]",
          "  D10 --> P1[100 becomes 90]",
          "  D25 --> P2[100 becomes 75]",
          "```"
        ),
        codeTitle: "Create two independent price functions",
        code: String.raw`def make_discount(percent):
    if not 0 <= percent <= 100:
        raise ValueError("percent must be between 0 and 100")
    factor = 1 - percent / 100

    def apply(price):
        return round(price * factor, 2)

    return apply

student_price = make_discount(10)
sale_price = make_discount(25)

print(student_price(100))  # 90.0
print(sale_price(100))     # 75.0`,
        codeNote: "The two callables execute the same rule with separate enclosed `factor` values.",
        followups: [
          "Do two functions returned by separate factory calls share their enclosed values?",
          "What mutable-state risk can a factory introduce?",
          "When would a callable class replace this pattern?",
        ],
        metaDescription: "Learn how Python function factories use closures to create independent configured callables and when a class is a better boundary.",
      },
    ],
  },
  {
    topic: "Basic Decorators",
    topicSlug: "basic-decorators-concept",
    questions: [
      {
        slug: "python-decorator-basics",
        question: "What is a Python decorator, and what does @decorator syntax do?",
        title: "Python Decorator Basics",
        directAnswer: "A decorator is a callable that receives another function or class and returns the object that should replace it. For a function, `@decorate` is equivalent to defining it and then assigning `name = decorate(name)`.",
        intent: {
          testing: "Whether you understand decorator replacement at definition time rather than treating the at-sign as magic that runs before every call.",
          common_mistake: "Confusing decoration time with wrapper execution time or forgetting that the returned callable replaces the original binding.",
          to_stand_out: "Separate the decorator call from later wrapper calls and give a focused cross-cutting use case.",
        },
        quick: [
          "A decorator takes a function or class and returns its replacement.",
          "`@decorate` on `run` means `run = decorate(run)` after the definition is created.",
          "The decorator is applied when the definition executes.",
          "A returned wrapper can run logic before and after the original function on each call.",
          "Decorators fit reusable cross-cutting behavior such as logging, timing, access checks, and registration.",
        ],
        answerSize: "standard",
        interview: bullets(
          "A Python decorator is a callable that receives a function or class and returns the object that should be bound in its place. For functions, the `@decorator` line is convenient syntax for an ordinary transformation.",
          "If `@trace` appears above `def calculate(...)`, Python first creates the `calculate` function, then calls `trace(calculate)`, and assigns the returned callable back to the name `calculate`. This application happens when that definition statement executes.",
          "A common decorator returns a nested wrapper. Later, when the program calls `calculate`, it is really calling that wrapper. The wrapper can inspect arguments, log the call, run the original function, inspect the result, and return it.",
          "For example, a timing decorator can surround several functions with the same duration measurement without copying that setup into every body. Route decorators in web frameworks may instead register a function and return it unchanged or wrapped.",
          "The wrapper must preserve the original call contract and return value unless the decorator intentionally changes them. Hidden argument changes, swallowed exceptions, or large unrelated workflows make decorated code difficult to reason about.",
          "When several decorators are stacked, the one nearest the function is applied first. The top layer therefore receives an already decorated callable, so order can change authorization, caching, logging, or exception behavior.",
          "I use decorators for one reusable concern that clearly surrounds or registers existing behavior. The decorated function should still represent the main operation, and `functools.wraps` should preserve its identity when a wrapper is returned."
        ),
        deepTitle: "Decoration and invocation are separate events",
        deep: paragraphs(
          "There are two timelines. During definition execution, Python evaluates the decorator expression, creates the undecorated function, passes that function to the decorator, and binds the decorator's result to the declared name. The original function may now be reachable only through a wrapper's closed-over reference.",
          "During a later call, normal callable behavior begins. If the replacement is a wrapper, the wrapper receives the arguments. It may delegate exactly once, skip delegation because of a cache or authorization result, or even call the original several times. Those choices belong to the decorator's contract, not to the at-sign itself.",
          "Because decoration changes a binding, order matters when several decorators are stacked. The decorator closest to the function is applied first, and the top decorator receives the result of the one below it."
        ),
        visualType: "sequence_diagram",
        visualTitle: "First replace the function, then call the wrapper",
        visual: lines(
          "```mermaid",
          "sequenceDiagram",
          "  participant Module",
          "  participant Trace",
          "  participant Original",
          "  participant Caller",
          "  Module->>Original: create calculate function",
          "  Module->>Trace: trace original",
          "  Trace-->>Module: wrapper becomes calculate",
          "  Caller->>Module: calculate 2, 3",
          "  Module->>Original: wrapper delegates",
          "  Original-->>Caller: result through wrapper",
          "```"
        ),
        codeTitle: "Wrap one function with reusable tracing",
        code: String.raw`from functools import wraps

def trace(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        print(f"calling {function.__name__}")
        result = function(*args, **kwargs)
        print(f"result: {result}")
        return result
    return wrapper

@trace
def add(left, right):
    return left + right

print(add(2, 3))`,
        codeNote: "The decorator runs once when `add` is defined; the returned wrapper's body runs whenever `add` is called.",
        followups: [
          "When is the decorator function called compared with the wrapper?",
          "In what order are stacked decorators applied?",
          "Can a decorator return the original function unchanged?",
        ],
        metaDescription: "Understand Python decorators as definition-time callable replacement, with a clear wrapper lifecycle and runnable trace example.",
      },
      {
        slug: "python-functools-wraps",
        question: "Why should a Python decorator use functools.wraps?",
        title: "Preserving Function Metadata with functools.wraps",
        directAnswer: "`functools.wraps(original)` updates a wrapper so metadata such as `__name__`, `__doc__`, annotations, and `__wrapped__` points back to the decorated function. This keeps introspection, documentation, and debugging useful.",
        quick: [
          "A plain wrapper has its own name and docstring instead of the original function's metadata.",
          "Apply `@wraps(original)` directly above the wrapper definition.",
          "It copies or updates standard metadata used by tools and developers.",
          "It also sets `__wrapped__` so introspection can reach the original callable.",
          "`wraps` preserves identity information; it does not prove that the wrapper keeps the same behavior or signature at runtime.",
        ],
        interview: bullets(
          "A decorator often replaces a well-named function with an inner function named `wrapper`. Without help, attributes such as `__name__` and `__doc__` describe that wrapper rather than the operation the application thinks it decorated.",
          "`functools.wraps(original)` is applied to the wrapper function. It uses `update_wrapper` to copy standard metadata from the original and adds `__wrapped__`, which gives introspection tools a path back to the wrapped callable.",
          "For example, after decorating `calculate_total`, logs and generated documentation should still show `calculate_total`, not `wrapper`. `inspect.signature` can follow `__wrapped__` and expose the original signature rather than only `*args, **kwargs`.",
          "This matters to debuggers, documentation generators, framework registration, tests, and any code that examines function attributes. Even when a particular framework works without it, accurate metadata makes maintenance safer.",
          "`wraps` does not automatically make the decorator behavior correct. The wrapper must still forward arguments and return values intentionally, and static typing may need its own annotations. I use `@wraps` on every ordinary function wrapper unless changing the exposed identity is deliberate."
        ),
        deepTitle: "A wrapper has two identities to reconcile",
        deep: paragraphs(
          "At runtime, the wrapper is a real function object with its own attributes. That truth is useful for execution but misleading for tools that need the public API's identity. `update_wrapper` copies selected assigned attributes and updates selected mapping attributes so the replacement presents the original function's descriptive surface.",
          "The `__wrapped__` link is particularly important. Inspection utilities can repeatedly unwrap decorated callables, recover signatures, and allow advanced tools to bypass layers when appropriate. This is more reliable than manually assigning only `__name__`.",
          "Some decorators intentionally return objects with a different interface or synthesize a new API. Those cases may choose different metadata behavior. For the common nested-wrapper pattern, omitting `wraps` creates confusion with almost no benefit."
        ),
        visualType: "comparison_table",
        visualTitle: "What introspection sees",
        visual: lines(
          "| Attribute or tool | Plain wrapper | Wrapper with `@wraps` |",
          "|---|---|---|",
          "| `__name__` | `wrapper` | Original function name |",
          "| `__doc__` | Wrapper docstring or `None` | Original docstring |",
          "| `__annotations__` | Wrapper annotations | Copied original annotations |",
          "| `__wrapped__` | Usually absent | Reference to original callable |",
          "| `inspect.signature` | Wrapper surface | Can follow original surface |"
        ),
        codeTitle: "Keep a decorated function recognizable",
        code: String.raw`from functools import wraps
from inspect import signature

def logged(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper

@logged
def greet(name: str) -> str:
    """Return a friendly greeting."""
    return f"Hello, {name}!"

print(greet.__name__)       # greet
print(greet.__doc__)        # Return a friendly greeting.
print(signature(greet))     # (name: str) -> str
print(greet("Ada"))`,
        codeNote: "The program calls the wrapper, while metadata-aware tools can still describe the public `greet` function.",
        followups: [
          "What does the `__wrapped__` attribute enable?",
          "Does `wraps` guarantee that the wrapper forwards arguments correctly?",
          "What is the relationship between `wraps` and `update_wrapper`?",
        ],
        metaDescription: "Learn why Python decorators use functools.wraps to preserve names, docs, annotations, signatures, and access to the original callable.",
      },
      {
        slug: "python-parameterized-decorator",
        question: "How do you write a Python decorator that accepts its own arguments?",
        title: "Parameterized Decorators in Python",
        directAnswer: "A parameterized decorator adds an outer factory: the factory receives decorator options and returns a decorator, the decorator receives the target function and returns a wrapper, and the wrapper receives the eventual call arguments.",
        difficulty: "medium",
        quick: [
          "The outer factory receives values written inside `@decorator(...)`.",
          "The factory returns the actual decorator that receives the target function.",
          "That decorator normally returns a wrapper for future calls.",
          "The three scopes retain configuration, original function, and call arguments separately.",
          "Use `functools.wraps` on the innermost wrapper.",
        ],
        answerSize: "standard",
        interview: bullets(
          "A decorator with its own arguments needs one extra function layer. The outer function is a factory that receives configuration and returns the actual decorator Python should apply.",
          "For `@repeat(times=3)`, Python first calls `repeat(times=3)`. That call returns `decorator`; Python then calls `decorator(original_function)` and binds the returned wrapper to the function's name.",
          "The wrapper is the third layer and receives the arguments from each later function call. Through closures, it can use both the factory's `times` value and the decorator's original function reference.",
          "For example, a repeat decorator can call a notification function three times and return the last result. A retry decorator has the same shape but must carefully define which exceptions qualify, whether delays occur, and what happens after the final attempt.",
          "I validate decorator configuration in the factory so invalid options fail when definitions are loaded, not during an unrelated later request. I also apply `functools.wraps` to keep the decorated function's metadata.",
          "Because the factory and decorator run while the containing definition is loaded, they should avoid hidden network calls or other slow side effects. Normal request-specific work belongs in the wrapper, where the actual call arguments are available.",
          "The layers are easiest to remember by their inputs: settings, then function, then call arguments. If the resulting behavior becomes stateful or has many controls, a callable class may be easier to understand and test."
        ),
        deepTitle: "Three calls happen at two different times",
        deep: paragraphs(
          "The parentheses after the decorator name are an ordinary function call. Its result must be suitable for decorating the function that follows. During module or class definition, Python therefore executes the factory and decorator layers, building a configured replacement.",
          "Only the wrapper layer waits for normal application calls. Its closure links two earlier environments: one contains configuration such as a repeat count, and another contains the undecorated callable. Each decorated target receives its own wrapper and retained references.",
          "This separation is useful for validation and setup. A regular expression can be compiled or a positive count checked once in the factory. However, importing a module now triggers that setup, so decorator creation should avoid slow network calls and surprising side effects."
        ),
        visualType: "flow_diagram",
        visualTitle: "Factory, decorator, and wrapper",
        visual: lines(
          "```mermaid",
          "flowchart LR",
          "  A[@repeat times 3] --> F[factory stores times]",
          "  F --> D[decorator receives function]",
          "  D --> W[wrapper is bound to function name]",
          "  C[later call with arguments] --> W",
          "  W --> O[call original three times]",
          "```"
        ),
        codeTitle: "Build a configured repeat decorator",
        code: String.raw`from functools import wraps

def repeat(*, times):
    if times < 1:
        raise ValueError("times must be positive")

    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = function(*args, **kwargs)
            return result
        return wrapper

    return decorator

@repeat(times=3)
def announce(message):
    print(message)
    return len(message)

print(announce("Ready"))  # prints Ready three times, then 5`,
        codeNote: "The repeat count is retained when the decorator is applied; the message arrives later when the wrapper is called.",
        followups: [
          "Which layers execute when the module is imported?",
          "Where should decorator configuration be validated?",
          "In what order are two parameterized decorators stacked?",
        ],
        metaDescription: "Learn the three-layer Python parameterized decorator pattern: configuration factory, function decorator, and runtime wrapper.",
      },
    ],
  },
];

for (const topic of topics) {
  const directory = path.join(moduleRoot, topic.topicSlug);
  fs.mkdirSync(directory, { recursive: true });
  const document = {
    topic: topic.topic,
    topicSlug: topic.topicSlug,
    questions: topic.questions.map((spec, index) => question(topic.topicSlug, index + 1, spec)),
  };
  fs.writeFileSync(
    path.join(directory, "complete-qa.json"),
    `${JSON.stringify(document, null, 2)}\n`,
  );
}

console.log(`Curated ${topics.reduce((sum, topic) => sum + topic.questions.length, 0)} questions across ${topics.length} topics.`);
