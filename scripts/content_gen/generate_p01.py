#!/usr/bin/env python3
"""Phase 1 content generation — Python Backend Intermediate P01 (core-python + python-oop)"""
import json, os

BASE = "/Users/ravi.r_flx/IEProject/InterviewExplainer/content/python-backend-intermediate"

def write_topic(module_slug, topic_slug, questions):
    path = os.path.join(BASE, module_slug, topic_slug)
    os.makedirs(path, exist_ok=True)
    out = os.path.join(path, "complete-qa.json")
    with open(out, "w") as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    print(f"  wrote {len(questions)} questions → {out}")

# ─────────────────────────────────────────────
# MODULE: core-python / TOPIC: comparisons
# ─────────────────────────────────────────────
CORE_PYTHON_COMPARISONS = [
  {
    "id": "py-core-q001",
    "slug": "is-vs-equals-equals-python",
    "question": "What is the difference between `is` and `==` in Python?",
    "title": "is vs == in Python",
    "direct_answer": "== checks value equality — whether two objects hold the same data. is checks identity — whether both variables point to the exact same object in memory. For primitive-like values, CPython interns small integers (-5 to 256) and short strings, so is sometimes returns True unexpectedly. The rule: use == for comparing values, use is only when checking identity (most commonly is None, is True, is False).",
    "interviewer_intent": "Tests whether the candidate understands Python's object model and avoids common bugs from misusing identity checks.",
    "company_tags": ["google", "amazon", "stripe"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Value equality vs object identity",
          "content": "Python gives you two comparison operators that look similar but do completely different things. == invokes the __eq__ method on an object, which by default compares values. is checks whether two names point to the exact same object — same memory address, tested via id(). Think of it like two people having identical wallets (==) versus having the same physical wallet (is).\n\nWhere this bites people: CPython interns small integers (−5 to 256) and interned string literals at compile time, so a = 256; b = 256; a is b returns True — but a = 257; b = 257; a is b may return False, depending on how those values were created. This is an implementation detail you can never rely on.\n\nThe only idiomatic use of is in production code is singleton checks: value is None, value is True, value is False. PEP 8 explicitly recommends is None over == None because None is a singleton, and a custom class could override __eq__ to return True when compared to None."
        },
        {
          "type": "code",
          "title": "Seeing the difference",
          "content": "# is vs == with lists\na = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b)   # True  — same values\nprint(a is b)   # False — different objects in memory\nprint(a is c)   # True  — c points to same object as a\nprint(id(a), id(b), id(c))  # a and c share an id\n\n# Small integer caching (CPython implementation detail)\nx = 256\ny = 256\nprint(x is y)   # True  — CPython caches -5..256\n\nx = 257\ny = 257\nprint(x is y)   # False — outside cache range\n\n# Correct None check\ndef process(value=None):\n    if value is None:   # correct\n        return 'default'\n    if value == None:   # works but misleading — avoid\n        return 'default'"
        },
        {
          "type": "comparison",
          "title": "is vs == at a glance",
          "layout": "table",
          "rows": [
            ["Operator", "What it checks", "Uses", "Can be overridden"],
            ["==", "Value equality", "Comparing data", "Yes — via __eq__"],
            ["is", "Object identity (same id())", "Singleton checks only", "No"]
          ]
        },
        {
          "type": "gotcha",
          "title": "Gotchas interviewers probe",
          "content": "String interning is the classic trap: 'hello' is 'hello' is True for string literals compiled in the same code object, but dynamically built strings won't be interned. Never write code that depends on string interning — it's undefined behavior across Python implementations. Another trap: mutable default arguments combined with is checks. If you need to check 'was no argument passed', use is None with a None default sentinel, not is [] or is {}."
        },
        {
          "type": "key_points",
          "title": "The one-line rule",
          "items": [
            "== for value comparison, is for identity — never swap them",
            "is None / is not None is idiomatic Python; == None is not",
            "Small integer and string interning is a CPython detail — never rely on it",
            "id() returns the memory address; two objects are identical iff id(a) == id(b)"
          ]
        }
      ]
    },
    "followup_questions": [
      "How does Python's integer caching work under the hood?",
      "When would you override __eq__ in a custom class?",
      "What happens to is checks after pickling/unpickling an object?"
    ],
    "seo": {
      "metaTitle": "is vs == in Python — Identity vs Equality Explained",
      "metaDescription": "Learn the difference between is and == in Python with code examples, CPython integer caching gotchas, and the rule for None checks."
    },
    "speakable_v2": {
      "archetype": "B",
      "pillar": "P01",
      "hook": "Two comparison operators, two completely different questions — one asks 'same value?' the other asks 'same object?'",
      "beats": [
        {
          "kind": "core_distinction",
          "layout": "paragraph",
          "content": "== calls __eq__ and compares values. is checks identity — whether both names point to the same object in memory, tested by id(). They're not interchangeable."
        },
        {
          "kind": "example",
          "layout": "paragraph",
          "content": "Two lists with identical contents: a == b is True, but a is b is False because they're separate objects. Assign c = a and now a is c is True — same object, not a copy."
        },
        {
          "kind": "gotcha",
          "layout": "paragraph",
          "content": "CPython caches small integers between -5 and 256, so 256 is 256 returns True. Go to 257 and it may return False. Never rely on that — it's an implementation detail."
        },
        {
          "kind": "rule",
          "layout": "bullets",
          "items": [
            "Use == for data comparisons — always",
            "Use is only for singleton checks: is None, is True, is False",
            "PEP 8 says is None, not == None"
          ]
        }
      ],
      "cap": "Memory trick: is asks 'are you the same person?' == asks 'do you look alike?' Use is only when you mean the first question.",
      "followup_handoff": "If they ask about __eq__ overriding or interning internals, go deeper on the object model.",
      "tts_overrides": {"__eq__": "dunder eq", "__": "dunder"}
    }
  },
  {
    "id": "py-core-q002",
    "slug": "list-vs-tuple-vs-set-python",
    "question": "When do you use a list vs a tuple vs a set in Python?",
    "title": "List vs Tuple vs Set",
    "direct_answer": "Lists are ordered, mutable sequences — use them when order matters and you need to add or remove items. Tuples are ordered, immutable sequences — use them for fixed collections, function return values, and as dictionary keys. Sets are unordered, mutable collections of unique items — use them for membership tests, deduplication, and set operations like union and intersection. The key mental model: list = changeable sequence, tuple = fixed record, set = unique bag.",
    "interviewer_intent": "Checks whether the candidate chooses the right data structure for the job rather than defaulting to lists for everything.",
    "company_tags": ["amazon", "microsoft", "meta"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Choosing the right built-in container",
          "content": "Python gives you three general-purpose collection types and they each solve a different problem. Picking wrong doesn't crash your code immediately — it just makes it slower, buggier, or harder to read.\n\nList: ordered, mutable, allows duplicates. Under the hood it's a dynamic array. Appending is O(1) amortized; inserting or deleting at arbitrary positions is O(n). Use it when you need to maintain order and modify the collection over time — processing pipelines, stacks (append/pop from right), or collecting results in a loop.\n\nTuple: ordered, immutable, allows duplicates. Slightly more memory-efficient than lists because Python can optimize fixed-size objects. Use tuples when the structure is fixed — RGB color (255, 128, 0), database row, function return with multiple values. Tuples are hashable (when contents are hashable) so they work as dict keys or set elements.\n\nSet: unordered, mutable, no duplicates. Backed by a hash table, so membership test (in) is O(1) vs O(n) for lists. frozenset is the immutable version. Use sets when you care about existence, not position: checking visited URLs, finding common items between two lists, removing duplicates from a list with list(set(original))."
        },
        {
          "type": "code",
          "title": "Practical usage patterns",
          "content": "# List — ordered, mutable\nqueue = ['alice', 'bob', 'charlie']\nqueue.append('dave')\nqueue.pop(0)  # removes 'alice' — O(n), use collections.deque for real queues\n\n# Tuple — fixed record, usable as dict key\npoint = (3, 4)\nlocation_data = {(0, 0): 'origin', (3, 4): 'destination'}\ndistance = (point[0]**2 + point[1]**2) ** 0.5\n\n# Multiple return values (tuple unpacking)\ndef min_max(nums):\n    return min(nums), max(nums)  # returns a tuple\nlo, hi = min_max([4, 1, 9, 2])\n\n# Set — O(1) membership, deduplication\nvisited = set()\nurls = ['a.com', 'b.com', 'a.com']\nfor url in urls:\n    if url not in visited:  # O(1)\n        visited.add(url)\n\nunique = list(set([1, 2, 2, 3, 3, 3]))  # dedup — order not preserved"
        },
        {
          "type": "comparison",
          "title": "Side-by-side",
          "layout": "table",
          "rows": [
            ["Property", "List", "Tuple", "Set"],
            ["Ordered", "Yes", "Yes", "No"],
            ["Mutable", "Yes", "No", "Yes"],
            ["Duplicates", "Allowed", "Allowed", "Not allowed"],
            ["Hashable", "No", "Yes (if contents are)", "No (frozenset is)"],
            ["Lookup speed", "O(n)", "O(n)", "O(1)"],
            ["Memory", "Higher", "Lower", "Higher (hash table)"]
          ]
        },
        {
          "type": "gotcha",
          "title": "Common mistakes",
          "content": "Using a list for membership checks in a hot loop is a classic performance bug. if user_id in blocked_users — if blocked_users is a list of 10,000 items, that's O(n) per check. Convert it to a set once. Another gotcha: a tuple containing a list is not hashable — (1, [2, 3]) will raise TypeError when used as a dict key, because the inner list is mutable."
        },
        {
          "type": "key_points",
          "title": "Decision rules",
          "items": [
            "Need order + mutation → list",
            "Fixed structure, needs to be a dict key → tuple",
            "Membership tests, deduplication → set",
            "Tuple-of-lists is not hashable — contents must also be immutable",
            "list(set(x)) deduplicates but loses original order — use dict.fromkeys(x) to preserve order"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is the time complexity of list.insert() vs list.append()?",
      "Why can't you use a list as a dictionary key?",
      "How does dict.fromkeys() preserve insertion order while set() doesn't?"
    ],
    "seo": {
      "metaTitle": "List vs Tuple vs Set in Python — When to Use Each",
      "metaDescription": "Understand when to use list, tuple, or set in Python with performance comparisons, code examples, and common pitfalls."
    },
    "speakable_v2": {
      "archetype": "B",
      "pillar": "P01",
      "hook": "All three hold collections of items — but they answer three different questions about your data.",
      "beats": [
        {
          "kind": "core_distinction",
          "layout": "paragraph",
          "content": "List: ordered and mutable — your go-to when sequence matters and the collection changes. Tuple: ordered and immutable — fixed records, multiple return values, anything that needs to be hashable. Set: unordered, no duplicates, O(1) membership — use it when you care about existence, not position."
        },
        {
          "kind": "performance",
          "layout": "paragraph",
          "content": "The set's O(1) lookup is the one that bites people. If you're checking 'is this item in my collection' inside a loop and using a list, you've written an O(n²) algorithm. Convert once to a set and that loop drops to O(n)."
        },
        {
          "kind": "gotcha",
          "layout": "paragraph",
          "content": "Tuple-of-list is not hashable — (1, [2, 3]) will crash as a dict key because the list inside is mutable. And list(set(x)) deduplicates but destroys order. Use dict.fromkeys(x).keys() when you need both."
        }
      ],
      "cap": "Default to list for sequences. Reach for tuple when the shape is fixed. Reach for set the moment you write 'if x in collection' in a loop.",
      "followup_handoff": "Good follow-up: ask about time complexity of each operation, or when they'd use collections.deque over list.",
      "tts_overrides": {"O(1)": "O of 1", "O(n)": "O of n", "O(n²)": "O of n squared"}
    }
  },
  {
    "id": "py-core-q003",
    "slug": "mutable-vs-immutable-python",
    "question": "What does mutable vs immutable mean in Python, and why does it matter?",
    "title": "Mutable vs Immutable Types",
    "direct_answer": "Mutable objects can be changed in place after creation — lists, dicts, sets, and most custom class instances. Immutable objects cannot — int, float, str, bool, tuple, frozenset, bytes. Immutability matters for three reasons: safety (you can't accidentally change a value through another reference), hashability (only immutable objects can be dict keys or set members), and default argument traps (mutable defaults are shared across all calls).",
    "interviewer_intent": "Tests understanding of Python's reference semantics and the infamous mutable default argument gotcha.",
    "company_tags": ["google", "uber", "airbnb"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Python's object model and mutability",
          "content": "In Python, variables are names that point to objects — not boxes that contain values. When you write x = [1, 2, 3], x is a label attached to a list object. Mutability describes whether you can modify that object's contents after creation.\n\nImmutable types — int, str, tuple, float, bool, frozenset, bytes — cannot be changed. When you 'modify' a string, Python creates a new string object. This is why s += 'x' in a tight loop is slow: each iteration allocates a new string. Use ''.join() instead.\n\nMutable types — list, dict, set, bytearray — can be modified in place. This means multiple names can point to the same object and modifications through one name are visible through all others:\n\n  a = [1, 2, 3]\n  b = a          # b points to the same list\n  b.append(4)\n  print(a)       # [1, 2, 3, 4] — a sees the change\n\nThe mutable default argument is Python's most notorious gotcha. def foo(items=[]) shares one list across all calls because the default is evaluated once at function definition time, not on each call."
        },
        {
          "type": "code",
          "title": "The mutable default argument trap",
          "content": "# THE FAMOUS GOTCHA\ndef add_item(item, cart=[]):   # ← BAD: default list created once\n    cart.append(item)\n    return cart\n\nprint(add_item('apple'))    # ['apple']\nprint(add_item('banana'))   # ['apple', 'banana'] ← WRONG\n\n# FIX: use None as sentinel\ndef add_item(item, cart=None):\n    if cart is None:\n        cart = []\n    cart.append(item)\n    return cart\n\nprint(add_item('apple'))    # ['apple']\nprint(add_item('banana'))   # ['banana'] ← correct\n\n# Shared reference trap\na = [1, 2, 3]\nb = a          # same object\nb.append(4)\nprint(a)       # [1, 2, 3, 4] — not a copy!\n\n# To copy\nimport copy\nb = a.copy()          # shallow copy\nb = copy.deepcopy(a)  # deep copy — for nested structures"
        },
        {
          "type": "gotcha",
          "title": "Why hashability ties to immutability",
          "content": "Python's hash table implementation (used by dict and set) requires that an object's hash value doesn't change after insertion. If you could mutate a dict key, the object could end up in the wrong bucket and never be found again. So Python only allows immutable (hashable) objects as dict keys: integers, strings, tuples (of hashables). Lists and dicts are rejected immediately — you get TypeError: unhashable type."
        },
        {
          "type": "comparison",
          "title": "Mutable vs Immutable built-ins",
          "layout": "table",
          "rows": [
            ["Category", "Examples", "Hashable", "Can be dict key"],
            ["Immutable", "int, str, float, tuple, frozenset", "Yes", "Yes"],
            ["Mutable", "list, dict, set, bytearray", "No", "No"]
          ]
        },
        {
          "type": "key_points",
          "title": "What to remember",
          "items": [
            "Never use a mutable object as a default argument — use None sentinel instead",
            "Assignment copies the reference, not the object",
            "Shallow copy (.copy() or list[:]) only copies one level deep",
            "Only immutable (hashable) objects work as dict keys or set members",
            "String concatenation in loops is O(n²) — use str.join() or io.StringIO"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is shallow copy vs deep copy?",
      "Why is string concatenation in a loop slow in Python?",
      "Can you make a custom class immutable?"
    ],
    "seo": {
      "metaTitle": "Mutable vs Immutable in Python — Default Argument Trap Explained",
      "metaDescription": "Learn Python mutability with the mutable default argument gotcha, reference semantics, and why immutability enables hashability."
    },
    "speakable_v2": {
      "archetype": "B",
      "pillar": "P01",
      "hook": "Mutability in Python isn't just trivia — the mutable default argument is one of the most common bugs Python developers write.",
      "beats": [
        {
          "kind": "core_concept",
          "layout": "paragraph",
          "content": "Mutable objects change in place — list, dict, set. Immutable objects can't — int, str, tuple. In Python, variables are labels on objects, not containers. Two labels can point to the same mutable object, so changes through one are visible through the other."
        },
        {
          "kind": "gotcha",
          "layout": "paragraph",
          "content": "The trap everyone falls into: def foo(items=[]). That default list is created once when the function is defined, then shared across every call with no argument. So your second call sees data from the first. Fix: use None as the default, then create a new list inside if it's None."
        },
        {
          "kind": "hashability",
          "layout": "paragraph",
          "content": "Immutability also governs what can be a dict key or set member. Python needs the hash to stay stable, so only hashables work. Strings, ints, tuples of hashables — fine. Lists — TypeError immediately."
        }
      ],
      "cap": "The one rule: never put a mutable object in a default argument. Everything else about mutability flows from understanding that variables are labels, not boxes.",
      "followup_handoff": "Natural next question is shallow vs deep copy, or __hash__ and __eq__ contract.",
      "tts_overrides": {}
    }
  },
  {
    "id": "py-core-q004",
    "slug": "deepcopy-vs-shallow-copy-python",
    "question": "What is the difference between shallow copy and deep copy in Python?",
    "title": "Shallow Copy vs Deep Copy",
    "direct_answer": "Shallow copy creates a new container object but fills it with references to the same child objects as the original. Deep copy creates a new container and recursively copies all nested objects too. For flat lists of integers or strings, both behave identically. For nested structures — lists of lists, dicts with list values — only deep copy gives you true independence.",
    "interviewer_intent": "Tests understanding of reference semantics and when you actually need full independence from a source object.",
    "company_tags": ["amazon", "netflix"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "What each copy level actually does",
          "content": "When you copy a data structure, you have to decide how deep to go. Python gives you three options: no copy (assignment), shallow copy, and deep copy.\n\nAssignment (b = a) makes b point to the exact same object. No new object is created. Any mutation through b changes what a sees.\n\nShallow copy (b = a.copy(), b = list(a), b = a[:]) creates a new top-level container, but the elements inside are still references to the original objects. For a list of strings or integers, this is fine because those are immutable anyway. For a list of lists, mutating an inner list through b will still be visible in a.\n\nDeep copy (import copy; b = copy.deepcopy(a)) creates a fully independent clone. Every nested object is recursively copied. The downside: it's slower and memory-intensive for large structures. It also handles circular references — if a contains itself, deepcopy won't loop forever."
        },
        {
          "type": "code",
          "title": "Where shallow copy is not enough",
          "content": "import copy\n\noriginal = [[1, 2], [3, 4]]\n\n# Assignment — same object\nref = original\nref[0].append(99)\nprint(original)   # [[1, 2, 99], [3, 4]] — mutated!\n\noriginal = [[1, 2], [3, 4]]  # reset\n\n# Shallow copy — new outer list, same inner lists\nshallow = original.copy()\nshallow[0].append(99)\nprint(original)   # [[1, 2, 99], [3, 4]] — STILL mutated!\nprint(shallow)    # [[1, 2, 99], [3, 4]]\n\noriginal = [[1, 2], [3, 4]]  # reset\n\n# Deep copy — fully independent\ndeep = copy.deepcopy(original)\ndeep[0].append(99)\nprint(original)   # [[1, 2], [3, 4]] — untouched\nprint(deep)       # [[1, 2, 99], [3, 4]]"
        },
        {
          "type": "comparison",
          "title": "Assignment vs Shallow vs Deep",
          "layout": "table",
          "rows": [
            ["Operation", "New container?", "New nested objects?", "Performance"],
            ["b = a", "No", "No", "O(1)"],
            ["b = a.copy()", "Yes", "No", "O(n)"],
            ["copy.deepcopy(a)", "Yes", "Yes", "O(n) recursive"]
          ]
        },
        {
          "type": "key_points",
          "title": "When to use each",
          "items": [
            "Flat structures with immutable elements — shallow copy is fine",
            "Nested structures where you need independence — use deepcopy",
            "deepcopy handles circular references safely",
            "Custom classes can control copy behavior via __copy__ and __deepcopy__"
          ]
        }
      ]
    },
    "followup_questions": [
      "How does deepcopy handle circular references?",
      "What is __copy__ and __deepcopy__ on custom classes?",
      "When would you use copy.copy() vs json.loads(json.dumps(x))?"
    ],
    "seo": {
      "metaTitle": "Shallow Copy vs Deep Copy in Python — Explained with Examples",
      "metaDescription": "Understand Python shallow copy vs deep copy with code examples showing when shallow copy is not enough for nested structures."
    },
    "speakable_v2": {
      "archetype": "B",
      "pillar": "P01",
      "hook": "Shallow copy gives you a new box with the same contents — but 'same contents' means same references, not same values.",
      "beats": [
        {
          "kind": "core_distinction",
          "layout": "paragraph",
          "content": "Shallow copy creates a new outer container but leaves the inner objects as shared references. For a list of lists, that means mutating a nested list through the copy still affects the original. Deep copy is recursive — every object at every level gets its own new copy."
        },
        {
          "kind": "example",
          "layout": "paragraph",
          "content": "original = [[1, 2], [3, 4]]. Shallow copy it, then append to the inner list — the original sees the change. Deep copy it and do the same — original is untouched."
        },
        {
          "kind": "rule",
          "layout": "bullets",
          "items": [
            "Flat list of immutables? Shallow copy is fine",
            "Any nested mutable structure? Use copy.deepcopy()",
            "deepcopy is slower but handles circular references"
          ]
        }
      ],
      "cap": "Quick test: does your structure have mutable objects inside? If yes, shallow copy will surprise you. Reach for deepcopy.",
      "followup_handoff": "Worth asking: when would json round-trip work as a poor-man's deep copy?",
      "tts_overrides": {"deepcopy": "deep copy"}
    }
  }
]

# ─────────────────────────────────────────────
# MODULE: core-python / TOPIC: built-in-types
# ─────────────────────────────────────────────
CORE_PYTHON_BUILTIN_TYPES = [
  {
    "id": "py-core-q010",
    "slug": "python-dict-methods-get-setdefault",
    "question": "What are the most important dict methods in Python and when do you use each?",
    "title": "Python Dict Methods",
    "direct_answer": "The three that matter most in interviews: get(key, default) for safe access without KeyError, setdefault(key, default) for initializing missing keys in one step, and update() for merging. Beyond those: .keys(), .values(), .items() return views (not copies), pop() removes and returns a value, and dict | other_dict (Python 3.9+) merges into a new dict. defaultdict from collections saves you writing the setdefault pattern repeatedly.",
    "interviewer_intent": "Tests practical dict fluency and whether the candidate knows the idiomatic patterns over verbose if-key-in-dict blocks.",
    "company_tags": ["google", "amazon"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Dict access patterns",
          "content": "The dict is Python's most used data structure. Knowing it well separates fluent Python from beginner Python.\n\nd[key] raises KeyError if key is missing — useful when absence is a bug. d.get(key) returns None; d.get(key, default) returns default. This replaces verbose try/except KeyError blocks in most cases.\n\nsetdefault(key, default) checks if key exists and returns its value. If it doesn't exist, it inserts key with the default and returns the default. This is the pattern for building grouping dicts: groups.setdefault(category, []).append(item). In most modern code, collections.defaultdict replaces this.\n\nDict views (.keys(), .values(), .items()) are live — they reflect changes to the dict. You can't index them directly but they're iterable and support set operations (.keys() and .items() support & for intersection). For loops over items() is the most common pattern: for key, value in d.items().\n\nPython 3.9 added the | merge operator: merged = a | b. Earlier versions need {**a, **b} or a.update(b). Note: update() modifies in place and returns None."
        },
        {
          "type": "code",
          "title": "Key patterns",
          "content": "# Safe access\nd = {'name': 'Alice', 'age': 30}\nprint(d.get('email'))             # None — no KeyError\nprint(d.get('email', 'unknown'))  # 'unknown'\n\n# Building a grouping dict\nfrom collections import defaultdict\nwords = ['apple', 'ant', 'banana', 'bear', 'cherry']\nby_letter = defaultdict(list)\nfor word in words:\n    by_letter[word[0]].append(word)\n# {'a': ['apple', 'ant'], 'b': ['banana', 'bear'], 'c': ['cherry']}\n\n# Without defaultdict — using setdefault\nby_letter2 = {}\nfor word in words:\n    by_letter2.setdefault(word[0], []).append(word)\n\n# Merging (Python 3.9+)\ndefaults = {'timeout': 30, 'retries': 3}\noverrides = {'timeout': 10}\nconfig = defaults | overrides  # {'timeout': 10, 'retries': 3}\n\n# Pre-3.9\nconfig = {**defaults, **overrides}\n\n# Iterating\nfor key, value in d.items():\n    print(f'{key}: {value}')\n\n# pop with default\nvalue = d.pop('missing_key', 'fallback')  # no KeyError"
        },
        {
          "type": "key_points",
          "title": "The essential methods",
          "items": [
            "get(key, default) — safe access without KeyError",
            "setdefault(key, default) — init-and-get in one step",
            "defaultdict(list/int/set) — cleaner grouping than setdefault",
            ".items() for iteration — don't iterate .keys() and then index",
            "a | b merges (Python 3.9+); {**a, **b} for earlier versions",
            "Views are live — don't modify a dict while iterating over its view"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is the time complexity of dict operations in Python?",
      "How does Python's dict maintain insertion order (since 3.7)?",
      "When would you use collections.OrderedDict today?"
    ],
    "seo": {
      "metaTitle": "Python Dict Methods — get, setdefault, update and More",
      "metaDescription": "Master Python dictionary methods: get, setdefault, update, items. Includes defaultdict patterns and Python 3.9 merge operator examples."
    },
    "speakable_v2": {
      "archetype": "A",
      "pillar": "P01",
      "hook": "Most Python devs only know d[key] and .keys() — but dict has a handful of methods that make grouping and merging code dramatically cleaner.",
      "beats": [
        {
          "kind": "safe_access",
          "layout": "paragraph",
          "content": "d.get(key, default) is how you avoid try/except KeyError for optional lookups. If the key exists, you get the value. If not, you get None or whatever default you provide."
        },
        {
          "kind": "pattern",
          "layout": "paragraph",
          "content": "setdefault(key, []).append(item) is the classic grouping pattern — look up the key, create an empty list if it's missing, then append. In modern code, defaultdict(list) does the same thing with less ceremony."
        },
        {
          "kind": "merging",
          "layout": "paragraph",
          "content": "Python 3.9 added the pipe operator for merging: a | b gives you a new dict with b's values winning on conflicts. Before that, {**a, **b} is the idiom."
        },
        {
          "kind": "iteration",
          "layout": "bullets",
          "items": [
            "Always iterate .items() not .keys() when you need both key and value",
            "Dict views are live — never modify during iteration",
            "pop(key, default) removes and returns safely"
          ]
        }
      ],
      "cap": "If you find yourself writing 'if key not in dict: dict[key] = []' — that's setdefault or defaultdict waiting to be used.",
      "followup_handoff": "Good follow-up: dict time complexity, or insertion order guarantee since Python 3.7.",
      "tts_overrides": {}
    }
  },
  {
    "id": "py-core-q011",
    "slug": "list-comprehension-vs-generator-expression",
    "question": "What is the difference between a list comprehension and a generator expression in Python?",
    "title": "List Comprehension vs Generator Expression",
    "direct_answer": "A list comprehension [x for x in iterable] evaluates immediately and stores all results in memory. A generator expression (x for x in iterable) is lazy — it produces values one at a time as you consume them. For large datasets, generators use constant memory instead of loading everything at once. Use list comprehensions when you need the full result (indexing, len, multiple iterations). Use generators when you're processing a stream or feeding a single pipeline.",
    "interviewer_intent": "Tests memory awareness and understanding of Python's iteration protocol vs eager evaluation.",
    "company_tags": ["google", "netflix", "stripe"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Eager vs lazy evaluation",
          "content": "List comprehensions and generator expressions look almost identical — the only syntactic difference is square brackets vs parentheses — but they have very different execution models.\n\nList comprehension: executes immediately, allocates a list in memory with all results. If your iterable has 10 million items, you get a 10-million-item list. You can index it, get its length, iterate it multiple times.\n\nGenerator expression: returns a generator object immediately without computing anything. Values are computed on demand — each call to next() or each iteration step triggers the next computation. Memory stays constant regardless of dataset size because you only hold one item at a time.\n\nWhen to use generators: reading large files line by line, processing database result sets, building data pipelines. When to use list comprehensions: you need len(), random access by index, or you'll iterate more than once.\n\nMany built-in functions (sum, min, max, any, all, join) accept any iterable, so you can pass a generator directly: sum(x*x for x in range(1_000_000)) never builds the list."
        },
        {
          "type": "code",
          "title": "Memory difference in practice",
          "content": "import sys\n\n# List comprehension — all in memory immediately\nsquares_list = [x**2 for x in range(1_000_000)]\nprint(sys.getsizeof(squares_list))   # ~8 MB\n\n# Generator expression — just a generator object\nsquares_gen = (x**2 for x in range(1_000_000))\nprint(sys.getsizeof(squares_gen))    # ~104 bytes\n\n# Both work fine with sum\nresult1 = sum([x**2 for x in range(1_000_000)])  # builds full list\nresult2 = sum(x**2 for x in range(1_000_000))    # never builds list\n\n# Generator for file processing — handles files of any size\ndef read_large_file(path):\n    with open(path) as f:\n        for line in f:                   # file object is already a generator\n            yield line.strip()\n\nfor line in read_large_file('huge.log'):\n    process(line)  # processes one line at a time"
        },
        {
          "type": "gotcha",
          "title": "Generator exhaustion",
          "content": "A generator can only be iterated once. After it's exhausted, iterating again produces nothing. If you need to iterate multiple times, store the results in a list. Also: you can't get len() of a generator — it has no idea how many items it will produce without consuming them all."
        },
        {
          "type": "key_points",
          "title": "Decision guide",
          "items": [
            "One-time pipeline, large data → generator expression",
            "Need len(), indexing, or multiple iterations → list comprehension",
            "sum/min/max/any/all accept generators directly — don't wrap in list",
            "Generators exhaust — calling list() on them consumes the generator",
            "Generator functions use yield; generator expressions use (... for ...)"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is yield from and how does it work?",
      "How does Python's iteration protocol work under the hood?",
      "What is itertools and when would you use it?"
    ],
    "seo": {
      "metaTitle": "List Comprehension vs Generator Expression in Python",
      "metaDescription": "Compare Python list comprehensions and generator expressions: memory usage, lazy evaluation, and when to use each with code examples."
    },
    "speakable_v2": {
      "archetype": "B",
      "pillar": "P01",
      "hook": "Same syntax, one character different — but one builds a million-item list, the other uses 100 bytes.",
      "beats": [
        {
          "kind": "core_distinction",
          "layout": "paragraph",
          "content": "Square brackets: list comprehension — runs immediately, stores everything in memory. Parentheses: generator expression — returns a lazy object that produces values one at a time on demand."
        },
        {
          "kind": "performance",
          "layout": "paragraph",
          "content": "A list over a million integers takes megabytes. The equivalent generator takes about 100 bytes. For sum or any or all, you never need the full list — pass the generator directly and let Python consume it without building intermediate storage."
        },
        {
          "kind": "gotcha",
          "layout": "paragraph",
          "content": "Generators exhaust. Once you've iterated through, it's done — calling it again yields nothing. And you can't call len() on a generator. If you need either of those, materialize it into a list first."
        }
      ],
      "cap": "Rule of thumb: if you're feeding the result into a single function like sum or any, use a generator. If you need to reuse the result, use a list.",
      "followup_handoff": "Natural follow-up: yield vs return in generator functions, or itertools for composing generator pipelines.",
      "tts_overrides": {}
    }
  },
  {
    "id": "py-core-q012",
    "slug": "python-dictionary-comprehension-patterns",
    "question": "How do dict comprehensions and nested comprehensions work in Python?",
    "title": "Dict Comprehensions and Nested Comprehensions",
    "direct_answer": "Dict comprehensions use {key_expr: val_expr for item in iterable} to build dicts in one line — invert a dict, filter entries, transform values. Nested list comprehensions replace nested loops: [val for row in matrix for val in row] flattens a matrix. The rule for reading nested comprehensions: the outermost for clause is first, same order as the equivalent for loops written out.",
    "interviewer_intent": "Tests Pythonic fluency and whether the candidate can write and read compact data transformations.",
    "company_tags": ["google", "amazon"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Comprehension patterns",
          "content": "Python's comprehension syntax extends beyond lists to dicts and sets. Dict comprehensions are especially useful for inverting mappings, filtering dictionaries, and transforming values without writing five lines of append-to-empty-dict boilerplate.\n\n{v: k for k, v in d.items()} inverts a dict — assuming values are unique. {k: v for k, v in d.items() if v > 0} filters to positive values only.\n\nNested comprehensions read in natural loop order — the first for is the outer loop. [cell for row in matrix for cell in row] flattens by going row by row. Adding conditions: [x for x in range(20) if x % 2 == 0 if x % 3 == 0] (equivalent to if x % 2 == 0 and x % 3 == 0).\n\nKnowing when NOT to use them: if you need a comment to explain the comprehension, write the loop. Three-level nesting is almost always clearer as explicit loops."
        },
        {
          "type": "code",
          "title": "Dict comprehension examples",
          "content": "# Invert a dict (values must be unique)\noriginal = {'a': 1, 'b': 2, 'c': 3}\ninverted = {v: k for k, v in original.items()}\n# {1: 'a', 2: 'b', 3: 'c'}\n\n# Filter — keep only high scores\nscores = {'alice': 85, 'bob': 42, 'carol': 91}\npassing = {name: score for name, score in scores.items() if score >= 60}\n# {'alice': 85, 'carol': 91}\n\n# Transform values\nupper_scores = {name.upper(): score for name, score in scores.items()}\n\n# Flatten a matrix\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nflat = [cell for row in matrix for cell in row]\n# [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\n# Set comprehension — unique first characters\nwords = ['apple', 'ant', 'banana', 'bear']\nfirst_letters = {w[0] for w in words}  # {'a', 'b'}\n\n# Conditional expression in comprehension (ternary)\nresult = [x if x > 0 else -x for x in [-3, 1, -2, 4]]  # abs()\n# [3, 1, 2, 4]"
        },
        {
          "type": "key_points",
          "title": "Read and write comprehensions cleanly",
          "items": [
            "{k: v for k, v in d.items() if condition} — dict filter pattern",
            "{v: k for k, v in d.items()} — dict inversion pattern",
            "Nested: outer for clause comes first, same as nested loop order",
            "Three levels deep? Write it as explicit loops instead",
            "Set comprehension {expr for x in iterable} for unique collections"
          ]
        }
      ]
    },
    "followup_questions": [
      "How would you merge two dicts while summing values for common keys?",
      "What is the performance difference between a comprehension and map/filter?"
    ],
    "seo": {
      "metaTitle": "Python Dict Comprehensions — Invert, Filter, Transform",
      "metaDescription": "Learn Python dict comprehensions with practical patterns: inverting dicts, filtering, transforming values, and nested comprehensions explained."
    },
    "speakable_v2": {
      "archetype": "A",
      "pillar": "P01",
      "hook": "Dict comprehensions are the kind of Python that separates readable code from 10-line boilerplate — once you know the pattern, you'll use it constantly.",
      "beats": [
        {
          "kind": "syntax",
          "layout": "paragraph",
          "content": "Dict comprehension: curly braces, key expression colon value expression, for clause, optional if. {v: k for k, v in d.items()} inverts a dict in one line."
        },
        {
          "kind": "patterns",
          "layout": "bullets",
          "items": [
            "Filter: {k: v for k, v in d.items() if v > threshold}",
            "Invert: {v: k for k, v in d.items()} — values must be unique",
            "Transform: {k.upper(): v for k, v in d.items()}"
          ]
        },
        {
          "kind": "nested",
          "layout": "paragraph",
          "content": "Nested comprehensions read in loop order — first for is outer, second is inner. [cell for row in matrix for cell in row] flattens the matrix. If you need three levels, write explicit loops — readability wins."
        }
      ],
      "cap": "The readability rule: if you'd need a comment to explain the comprehension, write the loop instead.",
      "followup_handoff": "Could follow up with performance comparison vs map/filter or functools patterns.",
      "tts_overrides": {}
    }
  }
]


# ─────────────────────────────────────────────
# MODULE: core-python / TOPIC: exception-handling
# ─────────────────────────────────────────────
CORE_PYTHON_EXCEPTION_HANDLING = [
  {
    "id": "py-core-q020",
    "slug": "try-except-else-finally-python",
    "question": "How does try/except/else/finally work in Python and when do you use each clause?",
    "title": "try/except/else/finally Execution Order",
    "direct_answer": "try runs the guarded code. except catches exceptions of the specified type. else runs only if no exception was raised in try — useful for code that should only run on success. finally always runs, exception or not — use it for cleanup like closing files. The order of execution: try → (except if exception, else if no exception) → finally.",
    "interviewer_intent": "Tests whether the candidate understands the full four-clause form, especially the underused else clause.",
    "company_tags": ["google", "amazon", "stripe"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "All four clauses and what they do",
          "content": "Most developers know try/except/finally. The else clause is the one that trips people up in interviews.\n\ntry: the block where exceptions might occur. Keep it narrow — only wrap the specific line that can fail, not a 20-line block. Wide try blocks catch exceptions you didn't intend to handle.\n\nexcept ExceptionType as e: catches the specific exception. You can have multiple except clauses. Catching bare except: or except Exception: catches everything including KeyboardInterrupt and SystemExit — generally a bad idea. Always catch the most specific type first.\n\nelse: runs when the try block completed without raising any exception. The key insight: code in else doesn't get caught by the except clauses above it. This lets you clearly separate 'code that might fail' (try) from 'code that runs on success' (else).\n\nfinally: always runs, whether an exception occurred, was caught, or not. Even if there's a return statement in the try or except block, finally runs before the function returns. Use it for releasing resources: closing database connections, file handles, locks."
        },
        {
          "type": "code",
          "title": "Execution paths and patterns",
          "content": "# Full four-clause form\ntry:\n    result = int(user_input)          # might raise ValueError\nexcept ValueError as e:\n    print(f'Invalid number: {e}')     # runs on ValueError\nexcept TypeError:\n    print('Wrong type entirely')\nelse:\n    print(f'Parsed successfully: {result}')  # runs only if no exception\nfinally:\n    print('Always runs — cleanup here')\n\n# Common pattern: file handling\ntry:\n    f = open('data.txt')\nexcept FileNotFoundError:\n    print('File not found')\nelse:\n    content = f.read()  # only runs if open() succeeded\n    process(content)\nfinally:\n    if 'f' in dir():    # check f was assigned\n        f.close()\n\n# Better: context manager handles finally automatically\ntry:\n    with open('data.txt') as f:\n        content = f.read()\nexcept FileNotFoundError:\n    content = ''\n\n# Re-raising with context\ntry:\n    risky_operation()\nexcept DatabaseError as e:\n    logger.error('DB failed', exc_info=True)\n    raise ServiceUnavailableError('Upstream DB down') from e  # chaining"
        },
        {
          "type": "gotcha",
          "title": "Common mistakes",
          "content": "Catching Exception (or bare except) silently swallows bugs. If process_payment() raises an AttributeError due to a code bug, catching Exception will hide it and look like a transient error. Only catch what you can handle. Another trap: returning inside finally doesn't suppress the exception — it replaces it. If try raises ValueError and finally returns 42, the caller gets 42 with no indication of the exception. Avoid return in finally."
        },
        {
          "type": "key_points",
          "title": "The rules",
          "items": [
            "else runs only when no exception occurred — separates success logic from error handling",
            "finally always runs — use it for cleanup, not for normal logic",
            "Catch specific exceptions, not bare Exception or except:",
            "raise X from Y chains exceptions and preserves original cause",
            "Context managers (with) are usually cleaner than manual try/finally for resources"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is exception chaining with 'raise X from Y'?",
      "How do you suppress an exception intentionally?",
      "What is contextlib.suppress()?"
    ],
    "seo": {
      "metaTitle": "Python try/except/else/finally — Complete Guide with Examples",
      "metaDescription": "Master Python exception handling: try, except, else, finally execution order, exception chaining, and common mistakes to avoid."
    },
    "speakable_v2": {
      "archetype": "A",
      "pillar": "P01",
      "hook": "Most Python devs use three of the four clauses — the else clause is the underused one that makes exception handling much cleaner.",
      "beats": [
        {
          "kind": "four_clauses",
          "layout": "paragraph",
          "content": "try: runs the risky code. except: runs if that code raises the matched exception. else: runs only if no exception was raised — this is the part people miss. finally: always runs, exception or not. Use finally for cleanup."
        },
        {
          "kind": "else_insight",
          "layout": "paragraph",
          "content": "The value of else: it lets you put success-path code in a block that won't be caught by your except clauses. Without else, you'd put success code at the end of try — but then exceptions in that code get caught when they shouldn't."
        },
        {
          "kind": "rules",
          "layout": "bullets",
          "items": [
            "Catch specific exceptions — not bare except or Exception",
            "Never return from finally — it suppresses the exception silently",
            "Use 'raise X from Y' to chain exceptions and preserve original cause",
            "Context managers (with) replace most try/finally for resource cleanup"
          ]
        }
      ],
      "cap": "Wide try blocks that catch everything are where silent bugs are born. Keep try narrow, be specific about what you catch.",
      "followup_handoff": "Natural next question: contextlib.suppress(), or how exception chaining works in production error tracking.",
      "tts_overrides": {}
    }
  },
  {
    "id": "py-core-q021",
    "slug": "custom-exceptions-python-best-practices",
    "question": "How do you define custom exceptions in Python and what are the best practices?",
    "title": "Custom Exceptions in Python",
    "direct_answer": "Inherit from Exception (not BaseException). Give the class a descriptive name ending in Error. Pass meaningful messages to super().__init__(). Create a base exception per module or package, then specific subclasses — this lets callers catch either the base (broad) or the specific (narrow). Store structured error data as attributes, not only in the message string.",
    "interviewer_intent": "Tests whether the candidate designs exception hierarchies that are usable and carry structured data.",
    "company_tags": ["amazon", "stripe", "netflix"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Designing a useful exception hierarchy",
          "content": "Custom exceptions serve three purposes: communicating what went wrong to callers, carrying structured data (not just a text message), and enabling callers to catch at the right level of specificity.\n\nThe baseline pattern: inherit from Exception, name it with an Error suffix, call super().__init__(message). But that's just a start.\n\nThe real pattern for applications and libraries: create one base exception for your module (class AppError(Exception): pass) and then specific subclasses (class ValidationError(AppError), class AuthError(AppError)). Callers can do except AppError to catch anything from your module, or except ValidationError to handle only validation failures.\n\nStore structured data as attributes, not just in the string message. class ValidationError(AppError) with attributes like field, value, and constraint is much more useful to a caller than 'Validation failed: field age value -5 must be positive'. The caller can inspect error.field programmatically.\n\nInherit from Exception, not BaseException. BaseException is for system-level signals like KeyboardInterrupt and SystemExit — user-defined exceptions should never subclass it."
        },
        {
          "type": "code",
          "title": "Production-grade exception hierarchy",
          "content": "# Base exception for your package\nclass AppError(Exception):\n    \"\"\"Base exception for the payments package.\"\"\"\n    pass\n\n# Specific subtypes\nclass ValidationError(AppError):\n    def __init__(self, field: str, value, message: str):\n        self.field = field\n        self.value = value\n        super().__init__(f\"Validation failed on '{field}': {message}\")\n\nclass PaymentGatewayError(AppError):\n    def __init__(self, gateway: str, status_code: int, detail: str):\n        self.gateway = gateway\n        self.status_code = status_code\n        super().__init__(f\"{gateway} returned {status_code}: {detail}\")\n\nclass InsufficientFundsError(PaymentGatewayError):\n    def __init__(self, amount: float, balance: float):\n        self.amount = amount\n        self.balance = balance\n        super().__init__('stripe', 402, f'Need {amount}, have {balance}')\n\n# Usage — caller can catch at right level\ntry:\n    process_payment(amount=100.0, balance=50.0)\nexcept InsufficientFundsError as e:\n    # Structured data available\n    notify_user(f'You need ${e.amount - e.balance:.2f} more')\nexcept PaymentGatewayError as e:\n    # Catches InsufficientFundsError too if not caught above\n    log_gateway_failure(e.gateway, e.status_code)\nexcept AppError:\n    # Broad catch — any error from this package\n    return error_response('Payment system unavailable')"
        },
        {
          "type": "key_points",
          "title": "Design rules",
          "items": [
            "Inherit from Exception, not BaseException",
            "Name with Error suffix: ValidationError, not InvalidInput",
            "One base exception per module, specific subclasses below it",
            "Store structured data as attributes, not only in the message string",
            "Always call super().__init__(message) so str(exc) works",
            "Document what exceptions each function raises (in docstring or type hints)"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is the difference between Exception and BaseException?",
      "How do you log exceptions with full traceback in Python?",
      "How would you serialize a custom exception for an API error response?"
    ],
    "seo": {
      "metaTitle": "Custom Exceptions in Python — Best Practices and Hierarchy Design",
      "metaDescription": "Learn how to define custom exceptions in Python: base exceptions, subclasses, structured error data, and practical hierarchy patterns."
    },
    "speakable_v2": {
      "archetype": "A",
      "pillar": "P01",
      "hook": "A good exception hierarchy lets callers choose their granularity — catch everything from your module, or only the specific failure they care about.",
      "beats": [
        {
          "kind": "baseline",
          "layout": "paragraph",
          "content": "Inherit from Exception. Name it with an Error suffix. Call super().__init__(message). That's the baseline — but production code needs more."
        },
        {
          "kind": "hierarchy",
          "layout": "paragraph",
          "content": "Create one base exception per package, then specific subclasses. PaymentGatewayError as the base, InsufficientFundsError and CardDeclinedError below it. Callers can catch the base to handle any payment error, or the specific type to handle exactly one failure mode."
        },
        {
          "kind": "structured_data",
          "layout": "paragraph",
          "content": "Store structured data as attributes, not just in the message string. ValidationError with a .field attribute lets callers inspect which field failed programmatically, not by parsing a string."
        }
      ],
      "cap": "The test: can a caller catch your exception at both broad and specific levels? Can they inspect structured data, not just a message string? If yes, you've got a good hierarchy.",
      "followup_handoff": "Good follow-up: exception chaining with raise X from Y, or how to serialize exceptions in API error responses.",
      "tts_overrides": {}
    }
  },
  {
    "id": "py-core-q022",
    "slug": "context-managers-with-statement-python",
    "question": "How do context managers work in Python and how do you create one?",
    "title": "Context Managers and the with Statement",
    "direct_answer": "A context manager implements __enter__ and __exit__ dunder methods. The with statement calls __enter__ on entry and __exit__ on exit — guaranteed, even if an exception occurs. This replaces manual try/finally for resource cleanup. You can also create context managers with @contextlib.contextmanager and a generator function using yield, which is often cleaner than writing a full class.",
    "interviewer_intent": "Tests understanding of Python's resource management protocol and whether the candidate knows both the class-based and generator-based approaches.",
    "company_tags": ["google", "amazon"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "The context manager protocol",
          "content": "Context managers exist to solve a specific problem: 'do X, then always do Y afterward, even if an exception happens.' File handles, database connections, locks, timers — all need guaranteed cleanup.\n\nThe protocol: __enter__ runs at the start of the with block and optionally returns a value (the as variable). __exit__(self, exc_type, exc_val, exc_tb) runs when the block exits, receiving exception information if one occurred. If __exit__ returns True, the exception is suppressed. If it returns None or False, the exception propagates.\n\nThe generator shortcut: @contextlib.contextmanager turns a generator function into a context manager. The code before yield is __enter__, the code after yield is __exit__. The yield expression receives the value of any 'throw' into the generator. This is almost always cleaner than writing a class when your setup/teardown logic is simple.\n\nContext managers can be stacked: with open('a') as f1, open('b') as f2: opens both files and guarantees both are closed, even if opening the second one fails."
        },
        {
          "type": "code",
          "title": "Class-based and generator-based",
          "content": "# Class-based context manager\nclass DatabaseConnection:\n    def __init__(self, url: str):\n        self.url = url\n        self.conn = None\n\n    def __enter__(self):\n        self.conn = connect(self.url)\n        return self.conn          # assigned to 'as' variable\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        if exc_type:              # exception occurred\n            self.conn.rollback()\n        else:\n            self.conn.commit()\n        self.conn.close()\n        return False              # don't suppress exceptions\n\nwith DatabaseConnection('postgresql://...') as conn:\n    conn.execute('INSERT ...')\n    # commit happens on clean exit, rollback on exception\n\n# Generator-based — simpler for most cases\nfrom contextlib import contextmanager\nimport time\n\n@contextmanager\ndef timer(label: str):\n    start = time.perf_counter()\n    try:\n        yield                     # block runs here\n    finally:\n        elapsed = time.perf_counter() - start\n        print(f'{label}: {elapsed:.3f}s')\n\nwith timer('database query'):\n    results = db.query('SELECT ...')\n\n# Stacking context managers\nwith open('input.txt') as fin, open('output.txt', 'w') as fout:\n    for line in fin:\n        fout.write(line.upper())"
        },
        {
          "type": "key_points",
          "title": "Key points",
          "items": [
            "__enter__ runs at block entry, __exit__ runs at block exit — always",
            "Return True from __exit__ to suppress the exception",
            "@contextmanager with yield is usually cleaner than a full class",
            "Use contextlib.suppress(ExceptionType) for the 'ignore this error' pattern",
            "Multiple context managers on one with line: with A() as a, B() as b:"
          ]
        }
      ]
    },
    "followup_questions": [
      "How do you handle exceptions inside a context manager's __exit__?",
      "What is contextlib.ExitStack and when is it useful?",
      "How are context managers used for thread locks?"
    ],
    "seo": {
      "metaTitle": "Python Context Managers — __enter__, __exit__, and @contextmanager",
      "metaDescription": "Learn Python context managers: class-based with __enter__/__exit__, generator-based with @contextmanager, and resource cleanup patterns."
    },
    "speakable_v2": {
      "archetype": "A",
      "pillar": "P01",
      "hook": "Context managers answer one question: how do you guarantee cleanup happens even when exceptions occur?",
      "beats": [
        {
          "kind": "protocol",
          "layout": "paragraph",
          "content": "The with statement calls __enter__ at the start of the block and __exit__ at the end — guaranteed. __exit__ receives exception info so you can decide to commit or roll back, then close the resource regardless."
        },
        {
          "kind": "generator_form",
          "layout": "paragraph",
          "content": "For most context managers, @contextlib.contextmanager is cleaner than a class. Write a generator function: setup code before yield, cleanup in a finally after yield. The block executes where yield is."
        },
        {
          "kind": "practical",
          "layout": "bullets",
          "items": [
            "Files, DB connections, locks, timers — context managers for all of them",
            "Return True from __exit__ only when you want to suppress the exception",
            "Stack multiple with a, b, c: — all guaranteed to clean up"
          ]
        }
      ],
      "cap": "The rule: if you're writing try/finally just to close something, you want a context manager instead.",
      "followup_handoff": "ExitStack is worth knowing for dynamic numbers of context managers — good to probe if they want depth.",
      "tts_overrides": {"__enter__": "dunder enter", "__exit__": "dunder exit"}
    }
  }
]

# ─────────────────────────────────────────────
# MODULE: core-python / TOPIC: string-handling
# ─────────────────────────────────────────────
CORE_PYTHON_STRING_HANDLING = [
  {
    "id": "py-core-q030",
    "slug": "f-strings-format-percent-python",
    "question": "What are the different string formatting methods in Python and which should you use?",
    "title": "f-strings vs .format() vs % formatting",
    "direct_answer": "Python has three string formatting approaches: % formatting (old, C-style), str.format() (flexible, template-based), and f-strings (modern, readable, fastest). Use f-strings for all new code — they're the most readable, support arbitrary expressions, and outperform the others. Only fall back to str.format() for cases where the template is defined separately from the values (like in config or translation files).",
    "interviewer_intent": "Tests awareness of modern Python idioms and whether the candidate defaults to f-strings.",
    "company_tags": ["google", "stripe"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Three eras of string formatting",
          "content": "Python accumulated three string formatting systems over its history. All three still work in Python 3, but they're not equally readable or fast.\n\n% formatting: inherited from C's printf. 'Hello %s, you are %d years old' % (name, age). Problems: easy to get the argument count wrong, doesn't work with keyword arguments naturally, and was never designed for Python.\n\nstr.format(): 'Hello {name}, you are {age}'.format(name=name, age=age). Much better — supports named arguments, positional arguments, format specs. Useful when the template string is defined separately from the call site (localization, config files).\n\nf-strings (Python 3.6+): f'Hello {name}, you are {age}'. The template and values are colocated. Any Python expression works inside {}: f'{len(items)} items', f'{price:.2f}', f'{x * 2 + 1}'. Python 3.12 added f-string debugging: f'{value=}' prints 'value=42'. Performance: f-strings are compiled to string concatenation at the bytecode level — fastest of the three.\n\nf-string limitations: you can't reuse the template without re-running the code (unlike str.format()). Don't put raw SQL or shell commands in f-strings with user input — that's an injection vulnerability."
        },
        {
          "type": "code",
          "title": "All three and f-string features",
          "content": "name, age, price = 'Alice', 30, 9.99\n\n# % formatting — avoid in new code\nprint('Hello %s, age %d, total $%.2f' % (name, age, price))\n\n# str.format() — use when template is dynamic\ntemplate = 'Hello {name}, age {age}'\nprint(template.format(name=name, age=age))  # useful for i18n\n\n# f-strings — use for everything else\nprint(f'Hello {name}, age {age}, total ${price:.2f}')\n\n# Expressions in f-strings\nitems = [1, 2, 3]\nprint(f'Count: {len(items)}, doubled: {[x*2 for x in items]}')\n\n# Conditional in f-string\nstatus = 'adult' if age >= 18 else 'minor'\nprint(f'{name} is a {status}')\n\n# Debug format (Python 3.8+)\nx = 42\nprint(f'{x=}')  # prints: x=42\n\n# Alignment and padding\nfor item, price in [('apple', 1.5), ('banana', 0.75)]:\n    print(f'{item:<10} ${price:>6.2f}')  # left-align item, right-align price\n\n# DON'T DO THIS — SQL injection risk\nuser_input = \"'; DROP TABLE users; --\"\n# query = f'SELECT * FROM users WHERE name = \\'{user_input}\\''  # NEVER\n# Always use parameterized queries: cursor.execute('...WHERE name = %s', (user_input,))"
        },
        {
          "type": "key_points",
          "title": "Rules",
          "items": [
            "f-strings for all new code — most readable, fastest",
            "str.format() when template is defined separately (i18n, config)",
            "% formatting — only in legacy code, never write new code with it",
            "Never f-string user input into SQL or shell commands — use parameterized queries",
            "f'{value=}' (Python 3.8+) is invaluable for debug logging"
          ]
        }
      ]
    },
    "followup_questions": [
      "How do you handle multi-line f-strings?",
      "What is string interning and when does Python intern strings?"
    ],
    "seo": {
      "metaTitle": "Python f-strings vs format() vs % — Which to Use",
      "metaDescription": "Compare Python string formatting: f-strings, str.format(), and % formatting with examples, performance notes, and security warnings."
    },
    "speakable_v2": {
      "archetype": "B",
      "pillar": "P01",
      "hook": "Python has three string formatting systems, and one of them is clearly better for almost every case.",
      "beats": [
        {
          "kind": "three_options",
          "layout": "paragraph",
          "content": "% formatting is the old C-style approach — avoid it in new code. str.format() is flexible and works when the template is defined separately. f-strings are the modern answer: readable, support any Python expression, and compile to the fastest bytecode."
        },
        {
          "kind": "f_string_power",
          "layout": "paragraph",
          "content": "f-strings aren't just variable substitution — you can put any expression inside: f'{len(items)} items', f'{price:.2f}', f'{value=}' for debugging. They're compiled inline, so no function call overhead."
        },
        {
          "kind": "security",
          "layout": "paragraph",
          "content": "One warning: never f-string user input into SQL or shell commands. f'SELECT * FROM users WHERE name = {user_input}' is a SQL injection waiting to happen. Always use parameterized queries."
        }
      ],
      "cap": "Default to f-strings. Fall back to str.format() only when you need a reusable template. Never write new code with % formatting.",
      "followup_handoff": "Security angle worth probing: have they used parameterized queries rather than string formatting for SQL?",
      "tts_overrides": {}
    }
  },
  {
    "id": "py-core-q031",
    "slug": "python-string-encoding-unicode",
    "question": "How does Python handle string encoding and what is the difference between str and bytes?",
    "title": "str vs bytes, Encoding and Unicode",
    "direct_answer": "In Python 3, str is a sequence of Unicode code points — text. bytes is a sequence of raw bytes — binary data. You convert between them with encode() (str → bytes) and decode() (bytes → str), specifying an encoding like UTF-8. The most common mistake: mixing str and bytes without converting — Python 3 raises TypeError rather than guessing, unlike Python 2.",
    "interviewer_intent": "Tests whether the candidate understands the text/binary boundary, a frequent source of bugs when reading files, HTTP data, or database BLOBs.",
    "company_tags": ["google", "amazon", "stripe"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Text vs binary in Python 3",
          "content": "Python 3 made a clean break from Python 2 on this. In Python 3, str is always Unicode text — every character is a code point, not a byte. bytes is always raw binary data — a sequence of integers 0-255.\n\nThe key insight: you cannot mix them. 'hello' + b'world' raises TypeError. Python 3 forces you to be explicit about the boundary — which encoding to use when converting.\n\nencode() converts str → bytes: 'hello'.encode('utf-8') → b'hello'. Default encoding is UTF-8 in most contexts.\ndecode() converts bytes → str: b'hello'.decode('utf-8') → 'hello'. Default is also UTF-8.\n\nThe encoding matters for non-ASCII characters. The euro sign € in UTF-8 is 3 bytes (b'\\xe2\\x82\\xac'). In latin-1 it doesn't exist. Always be explicit about encoding when reading from files, HTTP, or binary protocols.\n\nopen() in text mode (the default) decodes bytes to str using the system locale. In binary mode ('rb', 'wb') you get raw bytes. For any file that might have non-ASCII content or cross platforms, always specify encoding=: open('file.txt', encoding='utf-8')."
        },
        {
          "type": "code",
          "title": "Encoding in practice",
          "content": "# str is Unicode text, bytes is binary\ntext = 'Hello, 世界'   # str — Unicode code points\nraw = text.encode('utf-8')  # bytes — encoded representation\nprint(raw)  # b'Hello, \\xe4\\xb8\\x96\\xe7\\x95\\x8c'\n\n# Round trip\nrecovered = raw.decode('utf-8')\nprint(recovered == text)  # True\n\n# Encoding mismatch — common bug\ntry:\n    wrong = raw.decode('ascii')\nexcept UnicodeDecodeError as e:\n    print(f'Cannot decode UTF-8 bytes as ASCII: {e}')\n\n# File I/O — always specify encoding\nwith open('data.txt', 'w', encoding='utf-8') as f:\n    f.write('Hello, 世界')\n\nwith open('data.txt', 'r', encoding='utf-8') as f:\n    content = f.read()  # str\n\n# Binary mode — raw bytes\nwith open('image.png', 'rb') as f:\n    data = f.read()  # bytes\nprint(type(data))  # <class 'bytes'>\n\n# HTTP response — often bytes\nimport urllib.request\nwith urllib.request.urlopen('http://example.com') as resp:\n    html_bytes = resp.read()          # bytes\n    html_text = html_bytes.decode('utf-8')  # str"
        },
        {
          "type": "key_points",
          "title": "Rules",
          "items": [
            "str = Unicode text, bytes = raw binary — never mix them",
            "Always specify encoding='utf-8' when opening text files",
            "encode() str → bytes, decode() bytes → str",
            "Network/file data arrives as bytes — decode at the boundary, work with str inside your app",
            "UTF-8 is the right default for new code; latin-1 and others only for legacy data"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is the 'Unicode sandwich' principle?",
      "How does Python handle BOM in UTF-8 files?",
      "What encoding does JSON use by default?"
    ],
    "seo": {
      "metaTitle": "Python str vs bytes — Encoding, Unicode, UTF-8 Explained",
      "metaDescription": "Understand Python 3 str vs bytes, encode/decode, encoding errors, and how to handle text/binary boundaries in file I/O and HTTP."
    },
    "speakable_v2": {
      "archetype": "B",
      "pillar": "P01",
      "hook": "The str/bytes split is where Python 2-to-3 migrations broke things — and it's still where a lot of real bugs happen when reading files or HTTP data.",
      "beats": [
        {
          "kind": "distinction",
          "layout": "paragraph",
          "content": "str is Unicode text — each character is a code point. bytes is raw binary — each element is an integer from 0 to 255. Python 3 won't let you mix them; you get TypeError immediately, which is actually helpful."
        },
        {
          "kind": "conversion",
          "layout": "paragraph",
          "content": "encode() converts str to bytes using an encoding like UTF-8. decode() goes the other way. The encoding matters: the euro sign is 3 bytes in UTF-8 and doesn't exist in ASCII."
        },
        {
          "kind": "practical",
          "layout": "bullets",
          "items": [
            "Always specify encoding='utf-8' when opening text files",
            "Network data arrives as bytes — decode at the boundary",
            "Binary mode ('rb'/'wb') gives you bytes; text mode gives you str"
          ]
        }
      ],
      "cap": "The principle: decode bytes to str as early as possible, work with str throughout your app, encode back to bytes only at output. The 'Unicode sandwich.'",
      "followup_handoff": "Ask about the Unicode sandwich pattern or how they'd handle a file with mixed encoding.",
      "tts_overrides": {}
    }
  }
]

# ─────────────────────────────────────────────
# MODULE: python-oop / TOPIC: comparisons
# ─────────────────────────────────────────────
PYTHON_OOP_COMPARISONS = [
  {
    "id": "py-oop-q001",
    "slug": "classmethod-staticmethod-instancemethod-python",
    "question": "What is the difference between a class method, static method, and instance method in Python?",
    "title": "classmethod vs staticmethod vs instance method",
    "direct_answer": "Instance methods receive self — the instance — as their first argument and can access or modify instance and class state. Class methods receive cls — the class itself — as their first argument and are used for factory patterns and class-level operations. Static methods receive neither self nor cls — they're plain functions that live in the class namespace for organizational purposes only.",
    "interviewer_intent": "Tests understanding of Python's method types and when factories via classmethod are the right pattern.",
    "company_tags": ["google", "amazon", "microsoft"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Three method types, three use cases",
          "content": "Python gives you three distinct method types, each with a different relationship to the class and instance.\n\nInstance method (no decorator, first arg is self): has access to the specific instance and through it to the class. This is the most common type. Used for behavior that depends on instance state: compute_tax(self) needs self.rate.\n\nClass method (@classmethod, first arg is cls): receives the class, not an instance. The main use case is factory methods — alternative constructors that return a new instance. The classic example: date.fromisoformat('2024-01-15') is a classmethod that returns a date instance parsed from a string. Also used for class-level configuration that should be inherited by subclasses.\n\nStatic method (@staticmethod, no self or cls): a regular function attached to the class for namespacing. It has no implicit argument. Use it when the logic is conceptually related to the class but doesn't need access to instance or class state. validate_email(email) doesn't need self — it's a pure function that happens to live in User.\n\nThe key distinction between classmethod and staticmethod in inheritance: classmethod passes the actual subclass as cls, so a factory on the parent class creates instances of the subclass. staticmethod doesn't participate in this — it always does the same thing."
        },
        {
          "type": "code",
          "title": "Factory pattern with classmethod",
          "content": "from datetime import datetime\nfrom dataclasses import dataclass\n\n@dataclass\nclass Event:\n    name: str\n    timestamp: datetime\n    source: str\n\n    # Instance method — needs instance state\n    def age_seconds(self) -> float:\n        return (datetime.now() - self.timestamp).total_seconds()\n\n    # Class method — factory / alternative constructor\n    @classmethod\n    def from_dict(cls, data: dict) -> 'Event':\n        return cls(\n            name=data['name'],\n            timestamp=datetime.fromisoformat(data['ts']),\n            source=data.get('source', 'unknown')\n        )  # uses cls, not Event — works correctly in subclasses\n\n    # Class method — another factory\n    @classmethod\n    def now(cls, name: str, source: str = 'system') -> 'Event':\n        return cls(name=name, timestamp=datetime.now(), source=source)\n\n    # Static method — utility, no self/cls needed\n    @staticmethod\n    def is_valid_name(name: str) -> bool:\n        return bool(name) and len(name) <= 100\n\n# Usage\ne1 = Event.from_dict({'name': 'login', 'ts': '2024-01-15T10:30:00'})\ne2 = Event.now('purchase')\nprint(Event.is_valid_name('login'))  # True — no instance needed\n\nclass AuditEvent(Event):\n    pass\n\n# classmethod respects inheritance — creates AuditEvent, not Event\nae = AuditEvent.from_dict({'name': 'audit', 'ts': '2024-01-15T10:30:00'})\nprint(type(ae))  # <class 'AuditEvent'>"
        },
        {
          "type": "comparison",
          "title": "At a glance",
          "layout": "table",
          "rows": [
            ["Type", "First arg", "Decorator", "Primary use"],
            ["Instance method", "self (instance)", "None", "Instance behavior"],
            ["Class method", "cls (class)", "@classmethod", "Factory methods, class config"],
            ["Static method", "Neither", "@staticmethod", "Utility functions (pure)"]
          ]
        },
        {
          "type": "key_points",
          "title": "Rules",
          "items": [
            "Factory methods should always be classmethods — they use cls so subclasses work",
            "staticmethod is organizational — pure logic that belongs conceptually to the class",
            "classmethod vs staticmethod in subclasses: cls changes, static method doesn't",
            "Don't use staticmethod just because you 'don't need self' — consider module-level functions too"
          ]
        }
      ]
    },
    "followup_questions": [
      "How does classmethod interact with inheritance?",
      "When would you use a module-level function instead of a staticmethod?",
      "What is the descriptor protocol that makes these work?"
    ],
    "seo": {
      "metaTitle": "Python classmethod vs staticmethod vs instance method Explained",
      "metaDescription": "Understand Python's three method types: instance methods, classmethods for factories, and staticmethods for utilities with code examples."
    },
    "speakable_v2": {
      "archetype": "B",
      "pillar": "P01",
      "hook": "Three method decorators that beginners mix up — but each one signals a completely different relationship to the class.",
      "beats": [
        {
          "kind": "three_types",
          "layout": "paragraph",
          "content": "Instance method gets self — the specific object. Class method gets cls — the class itself, not an instance. Static method gets neither — it's a plain function that lives inside the class for namespacing."
        },
        {
          "kind": "classmethod_use",
          "layout": "paragraph",
          "content": "The main use case for classmethod is factory methods — alternative constructors. User.from_email(email) or Event.from_dict(data) return a new instance. You use cls() instead of the class name so that subclasses get an instance of the right type."
        },
        {
          "kind": "staticmethod_use",
          "layout": "paragraph",
          "content": "Staticmethod is for pure utility logic that's conceptually part of the class but doesn't need instance or class access. validate_email is a static method — it takes a string and returns a bool, nothing else."
        }
      ],
      "cap": "Signal: if you're writing an alternative constructor — use classmethod. If the function doesn't touch self or the class — consider staticmethod or just a module-level function.",
      "followup_handoff": "Descriptor protocol is a good depth probe — that's how Python makes all three work under the hood.",
      "tts_overrides": {"cls": "class"}
    }
  },
  {
    "id": "py-oop-q002",
    "slug": "composition-vs-inheritance-python",
    "question": "When do you prefer composition over inheritance in Python?",
    "title": "Composition vs Inheritance",
    "direct_answer": "Prefer composition when you want to reuse behavior without locking into an is-a relationship. Inheritance makes sense when there's a genuine type hierarchy and the subclass is truly a specialization of the parent. Composition (has-a) is more flexible — you can swap components at runtime and avoid the fragile base class problem. The Python standard library itself heavily favors composition and duck typing over deep inheritance trees.",
    "interviewer_intent": "Tests design thinking and whether the candidate defaults to inheritance (common beginner mistake) or reaches for composition strategically.",
    "company_tags": ["google", "stripe", "airbnb"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Design trade-offs",
          "content": "Inheritance (is-a) says Dog is an Animal. It inherits everything Animal has and can override specific behaviors. When the relationship is genuine, this is powerful. When it's not, you end up with deep hierarchies where changing the parent breaks all descendants — the fragile base class problem.\n\nComposition (has-a) says Car has an Engine. The Car holds a reference to an Engine object and delegates work to it. If you want to swap the engine type, you swap the component — the car class doesn't change. You can also compose multiple capabilities (has an Engine, has a Transmission, has GPS).\n\nThe practical test: 'is-a in all contexts?' A Penguin is-a Bird, but Penguin can't fly. Inheriting fly() from Bird and raising NotImplementedError is a design smell — Liskov Substitution Principle violation. If substituting the subclass breaks callers' assumptions, you have the wrong hierarchy.\n\nPython's duck typing and Protocol (structural typing) let you express 'this object has these methods' without inheritance at all. A function that accepts any object with a .read() method doesn't need an ABC — just call .read() and let it work.\n\nMixins are Python's middle ground: small behavior classes you inherit from to get specific functionality (LogMixin, SerializableMixin). They're inheritance, but composable — you mix in only what you need."
        },
        {
          "type": "code",
          "title": "Composition over inheritance",
          "content": "# BAD: inheritance for code reuse\nclass Animal:\n    def speak(self): ...\n    def serialize(self): ...\n    def validate(self): ...\n    def log_action(self, action): ...\n\nclass Dog(Animal):  # inherits unrelated serialization + logging concerns\n    pass\n\n# GOOD: composition\nclass Logger:\n    def log(self, msg: str): print(f'[LOG] {msg}')\n\nclass Serializer:\n    def to_json(self, obj) -> str:\n        import json\n        return json.dumps(obj.__dict__)\n\nclass Dog:\n    def __init__(self, name: str):\n        self.name = name\n        self._logger = Logger()           # composed in\n        self._serializer = Serializer()   # composed in\n\n    def speak(self) -> str:\n        self._logger.log(f'{self.name} spoke')\n        return 'Woof!'\n\n    def to_json(self) -> str:\n        return self._serializer.to_json(self)\n\n# GOOD: Protocol for duck typing (Python 3.8+)\nfrom typing import Protocol\n\nclass Readable(Protocol):\n    def read(self) -> str: ...\n\ndef process(source: Readable) -> str:\n    return source.read()  # any object with .read() works — no inheritance needed\n\n# Mixins — inheritance done composably\nclass JSONMixin:\n    def to_json(self) -> str:\n        import json\n        return json.dumps(self.__dict__)\n\nclass TimestampMixin:\n    def __init__(self, *args, **kwargs):\n        super().__init__(*args, **kwargs)\n        from datetime import datetime\n        self.created_at = datetime.now()\n\nclass Event(JSONMixin, TimestampMixin):\n    def __init__(self, name: str):\n        super().__init__()\n        self.name = name"
        },
        {
          "type": "key_points",
          "title": "Decision guide",
          "items": [
            "is-a in every context? Inheritance may make sense",
            "has-a, uses-a, or reuses behavior? Use composition",
            "Penguin can't fly → Liskov violation → wrong hierarchy",
            "Python Protocol lets you express interfaces without inheritance",
            "Mixins are fine when small and single-purpose"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is the Liskov Substitution Principle and how does it apply to Python?",
      "How does Python's Protocol (typing) differ from ABC?",
      "What is the fragile base class problem?"
    ],
    "seo": {
      "metaTitle": "Composition vs Inheritance in Python — When to Use Each",
      "metaDescription": "Learn when to use composition over inheritance in Python with practical examples, Protocol, mixins, and the Liskov Substitution Principle."
    },
    "speakable_v2": {
      "archetype": "D",
      "pillar": "P01",
      "hook": "Inheritance is the first tool beginners reach for — composition is the one senior engineers reach for more often.",
      "beats": [
        {
          "kind": "test",
          "layout": "paragraph",
          "content": "The test for inheritance: 'is-a in every context?' A Dog is an Animal everywhere. A Penguin is a Bird, but it can't fly — so inheriting a fly() method that raises NotImplementedError is a design smell. That's a Liskov violation."
        },
        {
          "kind": "composition_value",
          "layout": "paragraph",
          "content": "Composition is has-a: give your class a reference to another object and delegate. Dog has a Logger, has a Serializer. You can swap components at runtime, test them independently, and avoid the fragile base class problem where changing a parent breaks all children."
        },
        {
          "kind": "python_tools",
          "layout": "bullets",
          "items": [
            "Protocol: structural typing — express 'has .read()' without inheritance",
            "Mixins: small behavior classes you inherit for specific features",
            "Duck typing: if it has the methods you need, it works"
          ]
        }
      ],
      "cap": "Default to composition. Use inheritance only when there's a genuine type hierarchy where the subclass is truly a specialization.",
      "followup_handoff": "Liskov Substitution Principle is worth probing deeper — a lot of candidates can recite it but not apply it.",
      "tts_overrides": {}
    }
  },
  {
    "id": "py-oop-q003",
    "slug": "str-vs-repr-python",
    "question": "What is the difference between __str__ and __repr__ in Python?",
    "title": "__str__ vs __repr__",
    "direct_answer": "__repr__ is for developers — it should return an unambiguous string that ideally could recreate the object. __str__ is for end users — a readable, human-friendly representation. str(obj) calls __str__; repr(obj) calls __repr__. If only __repr__ is defined, it's used as a fallback for __str__. The rule: always define __repr__; define __str__ only when you need a different user-facing format.",
    "interviewer_intent": "Tests whether the candidate knows which to implement first and why __repr__ is more important.",
    "company_tags": ["google", "amazon"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Two representations for two audiences",
          "content": "Python objects can have two string representations. __repr__ is the developer representation — it should be unambiguous and ideally eval()-able to recreate the object. When you type an object in the REPL or use repr(), you get __repr__. __str__ is the user representation — readable prose. When you print(obj) or use str(), you get __str__.\n\nThe fallback chain: if __str__ is not defined, Python uses __repr__. If __repr__ is not defined, you get the default <ClassName object at 0x...>. So __repr__ is the one you always implement — it covers both cases.\n\nFor containers like lists, repr() is always used for items, even if the list itself is printed. print([obj1, obj2]) will call repr(obj1) and repr(obj2) — not str(). This is why __repr__ matters more for debugging: you see it everywhere in logs, debuggers, and container output.\n\nThe idiom for __repr__: return a string that looks like the constructor call — 'ClassName(arg1=val1, arg2=val2)'. This way you can copy-paste it to recreate the object in debugging sessions."
        },
        {
          "type": "code",
          "title": "Implementation pattern",
          "content": "from dataclasses import dataclass\nfrom datetime import datetime\n\nclass Money:\n    def __init__(self, amount: float, currency: str):\n        self.amount = amount\n        self.currency = currency\n\n    def __repr__(self) -> str:\n        # Developer-facing: unambiguous, ideally recreatable\n        return f'Money(amount={self.amount!r}, currency={self.currency!r})'\n\n    def __str__(self) -> str:\n        # User-facing: readable\n        symbols = {'USD': '$', 'EUR': '€', 'GBP': '£'}\n        symbol = symbols.get(self.currency, self.currency)\n        return f'{symbol}{self.amount:.2f}'\n\nm = Money(9.99, 'USD')\nprint(repr(m))   # Money(amount=9.99, currency='USD')  ← __repr__\nprint(str(m))    # $9.99                               ← __str__\nprint(m)         # $9.99  ← print() calls __str__\n\nitems = [Money(1.0, 'USD'), Money(2.5, 'EUR')]\nprint(items)     # [Money(amount=1.0, currency='USD'), Money(amount=2.5, currency='EUR')]\n#                  ↑ containers always use __repr__ for items\n\n# Dataclass auto-generates a useful __repr__\n@dataclass\nclass Point:\n    x: float\n    y: float\n\np = Point(3.0, 4.0)\nprint(repr(p))  # Point(x=3.0, y=4.0) — auto-generated"
        },
        {
          "type": "key_points",
          "title": "Rules",
          "items": [
            "Always define __repr__ — it's used as fallback for __str__ too",
            "Define __str__ only when you need a separate user-facing format",
            "repr() goal: unambiguous, ideally 'Money(amount=9.99, currency=\"USD\")'",
            "Containers always use repr() for items — so __repr__ matters for debugging",
            "dataclass auto-generates __repr__ — consider @dataclass if you just need that"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is the !r conversion flag in f-strings?",
      "How does dataclass auto-generate __repr__?",
      "What is __format__ and how does it relate to str.format()?"
    ],
    "seo": {
      "metaTitle": "Python __str__ vs __repr__ — Which to Implement First",
      "metaDescription": "Understand Python __str__ vs __repr__: when each is called, which to implement first, and the pattern for developer-friendly representations."
    },
    "speakable_v2": {
      "archetype": "B",
      "pillar": "P01",
      "hook": "Two string methods that beginners implement backwards — and one that's more important than the other.",
      "beats": [
        {
          "kind": "distinction",
          "layout": "paragraph",
          "content": "__repr__ is for developers: unambiguous, ideally the constructor call that recreates the object. __str__ is for users: readable prose. repr() calls the first, print() and str() call the second."
        },
        {
          "kind": "fallback",
          "layout": "paragraph",
          "content": "If __str__ isn't defined, Python falls back to __repr__. So __repr__ covers both cases. That's why you implement __repr__ first — always. __str__ is optional."
        },
        {
          "kind": "container_rule",
          "layout": "paragraph",
          "content": "Containers like lists always call repr() on their items, even inside print(). So __repr__ is what shows up in logs and debuggers and REPL output — __str__ only shows when you explicitly print the object directly."
        }
      ],
      "cap": "Start with __repr__. Define __str__ only when you need a genuinely different user-facing format. Use @dataclass if you just want the repr for free.",
      "followup_handoff": "Good depth probe: the !r flag in f-strings and what it does.",
      "tts_overrides": {"__repr__": "dunder repr", "__str__": "dunder str"}
    }
  }
]

# ─────────────────────────────────────────────
# MODULE: python-oop / TOPIC: dunder-methods
# ─────────────────────────────────────────────
PYTHON_OOP_DUNDER_METHODS = [
  {
    "id": "py-oop-q010",
    "slug": "python-dunder-methods-magic-methods",
    "question": "What are dunder (magic) methods in Python and which ones should you know?",
    "title": "Python Dunder Methods Overview",
    "direct_answer": "Dunder methods (double-underscore methods) let custom classes implement Python's built-in protocols. __init__ initializes, __repr__/__str__ control string representation, __len__/__getitem__/__iter__ implement the sequence protocol, __enter__/__exit__ implement context managers, __eq__/__hash__ control equality and hashing, __call__ makes instances callable. They're how Python makes everything consistent — len(obj) calls obj.__len__(), not obj.length().",
    "interviewer_intent": "Tests whether the candidate understands Python's data model and can implement idiomatic interfaces rather than custom method names.",
    "company_tags": ["google", "amazon", "stripe"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "Python's data model",
          "content": "Dunder methods are the hooks that let your classes participate in Python's built-in operations. When Python sees len(x), it calls x.__len__(). When you write x + y, Python calls x.__add__(y). This is what makes Python consistent: built-in types and your custom classes all work the same way with the same operators and functions.\n\nThe most important groupings:\n\nObject lifecycle: __init__(self, ...) for initialization (not creation — that's __new__). __del__ for cleanup (rarely needed — use context managers).\n\nRepresentation: __repr__ for developers, __str__ for users, __format__ for custom format specs.\n\nComparison and hashing: __eq__, __lt__, __le__, __gt__, __ge__ for ordering. @functools.total_ordering fills in the rest from __eq__ and one other. __hash__ must be defined when __eq__ is — if two objects are equal, their hash must match.\n\nContainer protocol: __len__, __getitem__, __setitem__, __delitem__, __contains__, __iter__, __next__. Implement these and your class works with len(), indexing, in, and for loops.\n\nCallable: __call__ makes instances callable. class Multiplier: def __call__(self, x): return x * self.factor. Useful for stateful callables and function-like objects.\n\nContext manager: __enter__/__exit__ — the with statement protocol.\n\nArithmetic: __add__, __sub__, __mul__, __truediv__, __floordiv__, etc. And the reverse versions (__radd__, etc.) for when the left operand doesn't support the operation."
        },
        {
          "type": "code",
          "title": "Implementing a sequence-like class",
          "content": "from typing import Iterator\n\nclass BoundedList:\n    \"\"\"A list that enforces a maximum size.\"\"\"\n    def __init__(self, max_size: int):\n        self.max_size = max_size\n        self._items: list = []\n\n    def __len__(self) -> int:\n        return len(self._items)\n\n    def __getitem__(self, index):\n        return self._items[index]  # supports slicing too\n\n    def __setitem__(self, index, value):\n        self._items[index] = value\n\n    def __contains__(self, item) -> bool:\n        return item in self._items\n\n    def __iter__(self) -> Iterator:\n        return iter(self._items)\n\n    def __repr__(self) -> str:\n        return f'BoundedList(max_size={self.max_size}, items={self._items!r})'\n\n    def append(self, item):\n        if len(self._items) >= self.max_size:\n            raise OverflowError(f'BoundedList max size {self.max_size} reached')\n        self._items.append(item)\n\n# Now it works with all Python built-ins\nbl = BoundedList(3)\nbl.append(1)\nbl.append(2)\nprint(len(bl))       # 2  — __len__\nprint(1 in bl)       # True  — __contains__\nfor item in bl:      # __iter__\n    print(item)\nprint(bl[0])         # 1  — __getitem__\n\n# __call__ example\nclass Retry:\n    def __init__(self, max_attempts: int):\n        self.max_attempts = max_attempts\n\n    def __call__(self, func):\n        \"\"\"Use as a decorator.\"\"\"\n        def wrapper(*args, **kwargs):\n            for attempt in range(self.max_attempts):\n                try:\n                    return func(*args, **kwargs)\n                except Exception:\n                    if attempt == self.max_attempts - 1:\n                        raise\n        return wrapper\n\nretry3 = Retry(3)\n@retry3\ndef flaky_request(): ..."
        },
        {
          "type": "key_points",
          "title": "The most important dunders",
          "items": [
            "__repr__: always implement — most visible in debugging",
            "__eq__ + __hash__: implement together, or set __hash__ = None",
            "__len__ + __getitem__: minimum for sequence protocol",
            "__iter__ + __next__: full iterator protocol",
            "__enter__ + __exit__: context manager protocol",
            "__call__: makes instances callable — good for stateful decorators",
            "functools.total_ordering: derive comparison methods from __eq__ + one"
          ]
        }
      ]
    },
    "followup_questions": [
      "What is the iterator protocol vs the iterable protocol?",
      "What happens when you define __eq__ but not __hash__?",
      "What is __slots__ and when would you use it?"
    ],
    "seo": {
      "metaTitle": "Python Dunder Methods (Magic Methods) — Complete Guide",
      "metaDescription": "Learn Python dunder methods: __init__, __repr__, __len__, __eq__, __call__, __enter__/__exit__ with practical implementation examples."
    },
    "speakable_v2": {
      "archetype": "A",
      "pillar": "P01",
      "hook": "Dunder methods are how Python makes everything consistent — len(your_object) works the same way as len(a_list) because both call __len__.",
      "beats": [
        {
          "kind": "model",
          "layout": "paragraph",
          "content": "When Python sees len(x), it calls x.__len__(). When you write x + y, it calls x.__add__(y). Built-in types and your custom classes all hook into the same protocol — that's what makes Python feel consistent."
        },
        {
          "kind": "groups",
          "layout": "bullets",
          "items": [
            "__repr__ / __str__: string representation",
            "__len__ / __getitem__ / __iter__: sequence protocol — makes for loops and in work",
            "__eq__ / __hash__: equality and dict/set membership — define together",
            "__enter__ / __exit__: context manager (with statement)",
            "__call__: makes an instance callable like a function"
          ]
        },
        {
          "kind": "eq_hash_rule",
          "layout": "paragraph",
          "content": "One rule worth calling out: if you define __eq__, Python sets __hash__ to None, making your object unhashable. If you want it to work as a dict key or set member, you must define __hash__ too. Equal objects must have equal hashes."
        }
      ],
      "cap": "The Python data model is one of the language's superpowers. A small class with __len__, __getitem__, and __iter__ participates in every for loop, list comprehension, and itertools function for free.",
      "followup_handoff": "__slots__ is a good depth probe — memory optimization by removing per-instance __dict__.",
      "tts_overrides": {"__len__": "dunder len", "__eq__": "dunder eq", "__hash__": "dunder hash", "__call__": "dunder call"}
    }
  },
  {
    "id": "py-oop-q011",
    "slug": "python-slots-memory-optimization",
    "question": "What is __slots__ in Python and when should you use it?",
    "title": "__slots__ for Memory Optimization",
    "direct_answer": "__slots__ replaces the per-instance __dict__ with a fixed set of slot descriptors. Each instance no longer gets a dynamic dictionary, so memory per instance drops significantly — roughly 50-70% for small classes. Use __slots__ when you're creating millions of instances of a simple class. The trade-off: you can't add new attributes dynamically, and multiple inheritance becomes tricky.",
    "interviewer_intent": "Tests knowledge of Python's memory model and practical optimization for high-throughput systems.",
    "company_tags": ["google", "netflix", "uber"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "How Python stores instance attributes",
          "content": "By default, every Python instance has a __dict__ — a dictionary mapping attribute names to values. This is flexible (you can add any attribute at any time) but expensive in memory. A simple object with two attributes still carries the overhead of an empty dict, which is ~200 bytes in CPython.\n\n__slots__ = ('x', 'y') tells Python: this class will only ever have these attributes. Python replaces the per-instance __dict__ with fixed-size slot descriptors. The result: instances are smaller (often 50-70% less memory), attribute access is slightly faster (direct offset lookup vs dict hash), and Python can raise AttributeError immediately if you try to set an undeclared attribute.\n\nThe memory win matters at scale. A service processing 10 million event objects in memory sees measurable savings. For a simple two-attribute class, the difference is about 200 bytes per instance (from ~280 bytes to ~56 bytes).\n\nTrade-offs: no dynamic attribute assignment (good for catching bugs too — typos in attribute names are caught immediately), trickier with multiple inheritance (both classes need __slots__, or you lose the benefit), and __weakref__ / __dict__ slots must be added explicitly if needed."
        },
        {
          "type": "code",
          "title": "Memory comparison",
          "content": "import sys\n\n# Without __slots__ — has __dict__\nclass Point:\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n\n# With __slots__\nclass SlottedPoint:\n    __slots__ = ('x', 'y')\n\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n\np1 = Point(1.0, 2.0)\np2 = SlottedPoint(1.0, 2.0)\n\nprint(sys.getsizeof(p1))  # 48 bytes (object) + 232 bytes (__dict__) = 280\nprint(sys.getsizeof(p2))  # 56 bytes — no __dict__\n\n# No __dict__ means no dynamic attributes\ntry:\n    p2.z = 3.0\nexcept AttributeError as e:\n    print(e)  # 'SlottedPoint' object has no attribute 'z'\n\n# If you need __dict__ AND __slots__ (opt-in both)\nclass Flexible:\n    __slots__ = ('x', 'y', '__dict__')  # pre-declared slots + dict\n\n# At scale — 1 million objects\nN = 1_000_000\nnormal = [Point(i, i) for i in range(N)]\nslotted = [SlottedPoint(i, i) for i in range(N)]\n# slotted uses ~224 MB less memory (rough estimate)"
        },
        {
          "type": "key_points",
          "title": "When to use __slots__",
          "items": [
            "Use when creating millions of instances of a simple data class",
            "50-70% memory reduction on small objects is typical",
            "Attribute access slightly faster (direct descriptor vs dict lookup)",
            "Side benefit: typos in attribute names cause AttributeError immediately",
            "Don't use if you need dynamic attribute assignment or complex inheritance",
            "dataclass + __slots__ = True (Python 3.10+) gets you both"
          ]
        }
      ]
    },
    "followup_questions": [
      "How does __slots__ interact with inheritance?",
      "Does __slots__ affect pickling?",
      "What is the relationship between __slots__ and descriptors?"
    ],
    "seo": {
      "metaTitle": "Python __slots__ — Memory Optimization for Large-Scale Classes",
      "metaDescription": "Learn Python __slots__: how it reduces memory per instance by 50-70%, when to use it, and trade-offs with dynamic attributes and inheritance."
    },
    "speakable_v2": {
      "archetype": "C",
      "pillar": "P01",
      "hook": "Every Python instance silently carries a dictionary. __slots__ gets rid of it — and the memory savings at scale are substantial.",
      "beats": [
        {
          "kind": "default_cost",
          "layout": "paragraph",
          "content": "By default, every instance has __dict__ — a hash table of attribute names to values. For a two-attribute object, that's about 280 bytes. The attribute dictionary alone is 200 bytes of overhead."
        },
        {
          "kind": "slots_benefit",
          "layout": "paragraph",
          "content": "__slots__ = ('x', 'y') replaces the dict with fixed-size slot descriptors. Same two-attribute object drops to about 56 bytes. At a million instances, that's hundreds of megabytes of memory recovered."
        },
        {
          "kind": "tradeoff",
          "layout": "bullets",
          "items": [
            "No dynamic attribute assignment — AttributeError on unknown attrs",
            "Inheritance: parent and child both need __slots__ or you lose the benefit",
            "Python 3.10 dataclass(slots=True) gets you both for free"
          ]
        }
      ],
      "cap": "Rule: reach for __slots__ when you're creating hundreds of thousands of small instances and memory pressure matters.",
      "followup_handoff": "Descriptor protocol is the underlying mechanism — worth probing how slots are implemented.",
      "tts_overrides": {"__slots__": "dunder slots", "__dict__": "dunder dict"}
    }
  }
]

# ─────────────────────────────────────────────
# MODULE: python-oop / TOPIC: oop-principles
# ─────────────────────────────────────────────
PYTHON_OOP_PRINCIPLES = [
  {
    "id": "py-oop-q020",
    "slug": "python-multiple-inheritance-mro",
    "question": "How does multiple inheritance and Method Resolution Order (MRO) work in Python?",
    "title": "Multiple Inheritance and MRO",
    "direct_answer": "Python resolves method lookup in multiple inheritance using the C3 linearization algorithm, called MRO. When you call a method, Python walks the MRO — a deterministic ordering of classes — left to right, depth first, consistent. You can inspect it with ClassName.__mro__ or ClassName.mro(). super() respects the MRO, not just the immediate parent, which is why cooperative multiple inheritance with super() works correctly.",
    "interviewer_intent": "Tests understanding of Python's object model in non-trivial inheritance scenarios — a common source of subtle bugs.",
    "company_tags": ["google", "amazon"],
    "answer": {
      "sections": [
        {
          "type": "overview",
          "title": "C3 linearization and cooperative inheritance",
          "content": "When a class inherits from multiple parents, Python needs a deterministic order to search for methods. C3 linearization produces the MRO — a list starting with the class itself, then its parents in left-to-right order, then the parents' parents, with two guarantees: a class always comes before its parent, and the relative order of sibling classes from the class definition is preserved.\n\nThe diamond problem: class A; class B(A); class C(A); class D(B, C). Both B and C inherit from A. When D.method() is called and D doesn't define it, Python uses the MRO: D → B → C → A. A appears only once, at the end.\n\nsuper() doesn't mean 'call the parent.' It means 'call the next class in the MRO.' This is what makes cooperative multiple inheritance work. If B.__init__ calls super().__init__() and the MRO puts C next, C's __init__ gets called before A's. Every class in the hierarchy needs to call super() for this to work correctly. If any class breaks the chain, some __init__ gets skipped.\n\nMixins work because of MRO. LogMixin goes early in the MRO (inherits from object, defines log), and as long as LogMixin.__init__ calls super(), the rest of the chain continues."
        },
        {
          "type": "code",
          "title": "MRO in action",
          "content": "class A:\n    def greet(self):\n        print('A.greet')\n        super().greet() if hasattr(super(), 'greet') else None\n\nclass B(A):\n    def greet(self):\n        print('B.greet')\n        super().greet()\n\nclass C(A):\n    def greet(self):\n        print('C.greet')\n        super().greet()\n\nclass D(B, C):\n    def greet(self):\n        print('D.greet')\n        super().greet()\n\nd = D()\nd.greet()\n# D.greet\n# B.greet\n# C.greet\n# A.greet\n\nprint(D.__mro__)\n# (<class 'D'>, <class 'B'>, <class 'C'>, <class 'A'>, <class 'object'>)\n\n# Mixin pattern — cooperative __init__\nclass TimestampMixin:\n    def __init__(self, *args, **kwargs):\n        super().__init__(*args, **kwargs)   # passes args along the chain\n        from datetime import datetime\n        self.created_at = datetime.now()\n\nclass LogMixin:\n    def __init__(self, *args, **kwargs):\n        super().__init__(*args, **kwargs)\n        self._log = []\n\nclass Service(LogMixin, TimestampMixin):\n    def __init__(self, name: str):\n        super().__init__()  # triggers the whole chain\n        self.name = name\n\nprint(Service.__mro__)\n# Service → LogMixin → TimestampMixin → object"
        },
        {
          "type": "key_points",
          "title": "MRO rules",
          "items": [
            "MRO order: D → B → C → A (depth first, left to right, each class once)",
            "super() means 'next in MRO', not 'my parent'",
            "All classes must call super() for cooperative multiple inheritance",
            "Inspect with ClassName.__mro__ or ClassName.mro()",
            "Python raises TypeError if no consistent MRO is possible"
          ]
        }
      ]
    },
    "followup_questions": [
      "What happens if two parent classes have conflicting __init__ signatures?",
      "How do you use super() with keyword arguments in multiple inheritance?",
      "What is the C3 linearization algorithm?"
    ],
    "seo": {
      "metaTitle": "Python Multiple Inheritance and MRO — C3 Linearization Explained",
      "metaDescription": "Understand Python MRO (Method Resolution Order), C3 linearization, diamond inheritance, and cooperative multiple inheritance with super()."
    },
    "speakable_v2": {
      "archetype": "C",
      "pillar": "P01",
      "hook": "Multiple inheritance trips people up because super() doesn't mean 'call my parent' — it means 'call the next class in the resolution order.'",
      "beats": [
        {
          "kind": "mro",
          "layout": "paragraph",
          "content": "Python resolves methods using the MRO — a deterministic list computed by C3 linearization. For class D(B, C) where both B and C inherit from A, the order is D → B → C → A. Inspect it with D.__mro__."
        },
        {
          "kind": "super",
          "layout": "paragraph",
          "content": "super() walks the MRO, not the parent chain. So when B.method calls super(), it might call C.method next, not A.method. This is cooperative inheritance — every class in the chain must call super() for it to work."
        },
        {
          "kind": "practical",
          "layout": "paragraph",
          "content": "Mixin classes work because of this. LogMixin and TimestampMixin both call super().__init__(), so when Service(LogMixin, TimestampMixin) is instantiated, every __init__ in the chain runs exactly once in MRO order."
        }
      ],
      "cap": "The rule for multiple inheritance: every class calls super(). Break the chain anywhere and some __init__ silently gets skipped.",
      "followup_handoff": "Good depth probe: what happens when parent classes have incompatible __init__ signatures.",
      "tts_overrides": {"MRO": "M R O"}
    }
  }
]

# ─────────────────────────────────────────────
# WRITE ALL TOPICS
# ─────────────────────────────────────────────
if __name__ == '__main__':
    print("Writing Python Backend Intermediate — P01 content...")

    write_topic('core-python', 'comparisons', CORE_PYTHON_COMPARISONS)
    write_topic('core-python', 'built-in-types', CORE_PYTHON_BUILTIN_TYPES)
    write_topic('core-python', 'exception-handling', CORE_PYTHON_EXCEPTION_HANDLING)
    write_topic('core-python', 'string-handling', CORE_PYTHON_STRING_HANDLING)
    write_topic('python-oop', 'comparisons', PYTHON_OOP_COMPARISONS)
    write_topic('python-oop', 'dunder-methods', PYTHON_OOP_DUNDER_METHODS)
    write_topic('python-oop', 'oop-principles', PYTHON_OOP_PRINCIPLES)

    print("\nDone. Topic file counts:")
    import subprocess
    result = subprocess.run(
        ['find', BASE, '-name', 'complete-qa.json'],
        capture_output=True, text=True
    )
    for line in result.stdout.strip().split('\n'):
        print(f'  {line}')
