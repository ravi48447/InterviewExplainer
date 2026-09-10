#!/usr/bin/env python3
"""
Generate complete-qa.json files for all remaining Python backend intermediate
and Python backend fresher modules.
"""
import json
import os
from pathlib import Path

PBI_BASE = Path("/Users/ravi.r_flx/IEProject/InterviewExplainer/content/python-backend-intermediate")
PBF_BASE = Path("/Users/ravi.r_flx/IEProject/InterviewExplainer/content/python-backend-fresher")

# ============================================================
# PBI CONTENT - all remaining modules
# ============================================================

PBI_CONTENT = {
    "data-structures-algorithms": {
        "algorithm-complexity": [
            {
                "id": "py-dsa-q001",
                "slug": "big-o-python-builtin-operations",
                "question": "What is the time complexity of common Python built-in operations like list append, dict lookup, and set membership?",
                "title": "Big-O for Python Built-in Operations",
                "direct_answer": "List append is O(1) amortized (O(n) occasional resize). List insert at index 0 is O(n). Dict lookup, set membership, and dict/set insertion are O(1) average (O(n) worst case hash collision). List membership (in) is O(n). Sorted list binary search (bisect) is O(log n). Knowing these matters because nested loops with list membership checks that could be sets is a very common O(n²) bug.",
                "interviewer_intent": "Tests whether the candidate thinks about performance in Python's specific data structures, not just abstract algorithmic complexity.",
                "company_tags": ["google", "amazon", "stripe"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "Python built-in complexity reference",
                            "content": "Python's collections have specific performance characteristics that differ from their conceptual equivalents. The most important ones to know cold:\n\nlist: append O(1) amortized (Python over-allocates; occasional resize is O(n) but amortized across N appends is O(1)). insert(0, x) is O(n) — everything shifts. pop() from end is O(1). pop(0) or pop(i) is O(n). Membership 'in' is O(n) linear scan. Sorting is O(n log n) (Timsort).\n\ndict: get, set, delete, 'in' are all O(1) average. O(n) worst case if all keys hash to the same bucket (extremely rare with Python's modern hash randomization). As of Python 3.7+, dicts preserve insertion order.\n\nset: 'in', add, remove are O(1) average. Union/intersection are O(min(len(s1), len(s2))) to O(len(s1) + len(s2)) depending on operation. Converting a list to a set to do membership lookups is the classic O(n) → O(1) optimization.\n\ncollections.deque: appendleft and popleft are O(1). List.insert(0) and list.pop(0) are O(n)."
                        },
                        {
                            "type": "code",
                            "title": "The common O(n²) bug and fix",
                            "content": "# O(n²) — list 'in' is O(n), done n times\ndef has_duplicates_slow(lst):\n    seen = []\n    for item in lst:\n        if item in seen:    # O(n) scan every time\n            return True\n        seen.append(item)\n    return False\n\n# O(n) — set 'in' is O(1)\ndef has_duplicates_fast(lst):\n    seen = set()\n    for item in lst:\n        if item in seen:    # O(1) hash lookup\n            return True\n        seen.add(item)\n    return False\n\n# Even simpler\ndef has_duplicates(lst):\n    return len(lst) != len(set(lst))\n\n# O(n²) API endpoint bug\n# items is a list, valid_ids is a list — 'in' is O(n)\nvalid_ids = [1, 2, 3, ...]   # 10,000 items\nresult = [item for item in items if item.id in valid_ids]  # O(n*m)\n\n# Fix: convert once to set\nvalid_set = set(valid_ids)   # O(n) once\nresult = [item for item in items if item.id in valid_set]  # O(n)"
                        },
                        {
                            "type": "comparison",
                            "title": "Big-O cheat sheet",
                            "layout": "table",
                            "rows": [
                                ["Operation", "list", "dict", "set", "deque"],
                                ["Append/Add", "O(1) amortized", "O(1)", "O(1)", "O(1)"],
                                ["Prepend", "O(n)", "-", "-", "O(1)"],
                                ["Lookup [i]", "O(1)", "O(1)", "-", "O(n)"],
                                ["Membership 'in'", "O(n)", "O(1)", "O(1)", "O(n)"],
                                ["Delete", "O(n)", "O(1)", "O(1)", "O(1) ends"],
                                ["Sort", "O(n log n)", "-", "-", "-"]
                            ]
                        },
                        {
                            "type": "key_points",
                            "title": "Complexity rules to know cold",
                            "items": [
                                "list 'in' is O(n) — always convert to set for repeated membership tests",
                                "dict/set lookup is O(1) average — the fundamental reason dicts are everywhere",
                                "list.insert(0) and list.pop(0) are O(n) — use deque for queues",
                                "list.append is O(1) amortized — safe for growing lists",
                                "sorted() is O(n log n) Timsort — faster for partially sorted data"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "How does Python's Timsort differ from standard mergesort?",
                    "What is the time complexity of heapq operations?",
                    "When would you use collections.deque over a list?"
                ],
                "seo": {
                    "metaTitle": "Python Big-O Complexity — List, Dict, Set Operations",
                    "metaDescription": "Time complexity reference for Python built-in operations: list append O(1), dict lookup O(1), set membership O(1). Includes common O(n²) bugs and fixes."
                },
                "speakable_v2": {
                    "archetype": "B",
                    "pillar": "P01",
                    "hook": "The most common interview performance bug: list 'in' in a loop — it's O(n²) that looks like it should be fast.",
                    "beats": [
                        {
                            "kind": "key_insight",
                            "layout": "paragraph",
                            "content": "List membership check 'in' is O(n) — Python scans every element. Dict and set membership is O(1) hash lookup. That's the most important complexity difference in day-to-day Python."
                        },
                        {
                            "kind": "common_bug",
                            "layout": "paragraph",
                            "content": "If you're checking 'if x in my_list' inside a loop over n items, you've got O(n²). Convert the list to a set once before the loop — same O(n) setup cost but now each check is O(1)."
                        },
                        {
                            "kind": "deque",
                            "layout": "paragraph",
                            "content": "For queues, use collections.deque not list. list.pop(0) shifts every element — O(n). deque.popleft() is O(1)."
                        }
                    ],
                    "cap": "The two rules that fix 80% of Python performance bugs: use sets for membership tests, use deque for queues.",
                    "followup_handoff": "Follow up with heapq for priority queues or bisect for sorted list binary search.",
                    "tts_overrides": {}
                }
            }
        ],
        "built-in-data-structures": [
            {
                "id": "py-dsa-q010",
                "slug": "collections-module-python",
                "question": "What are the most useful classes in Python's collections module and when do you use them?",
                "title": "Python collections Module",
                "direct_answer": "The four most commonly used: defaultdict (like dict but initializes missing keys automatically), Counter (counts occurrences of elements), deque (double-ended queue with O(1) pops from both ends), and OrderedDict (maintains insertion order — less relevant since Python 3.7 dicts do this, but useful for move_to_end). namedtuple creates lightweight immutable records. ChainMap merges multiple dicts without copying.",
                "interviewer_intent": "Tests breadth of Python standard library knowledge and whether the candidate reaches for the right tool vs reinventing it.",
                "company_tags": ["google", "amazon", "stripe"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "collections module essentials",
                            "content": "The collections module provides specialized container types that solve common patterns more cleanly and often more efficiently than plain dicts and lists.\n\ndefaultdict(factory): a dict that calls factory() to create a default value when a key is missing. defaultdict(list) is the grouping pattern, defaultdict(int) is the counting pattern. Cleaner than setdefault().\n\nCounter(iterable): counts occurrences. Counter('hello') gives {'l': 2, 'h': 1, 'e': 1, 'o': 1}. .most_common(n) returns the n most frequent elements. Supports +, -, &, | operations between counters. The classic word frequency interview question is two lines with Counter.\n\ndeque(maxlen=N): double-ended queue. appendleft and popleft are O(1). maxlen creates a fixed-size circular buffer — great for keeping the last N items. Used in BFS (append right, popleft) for efficient queue operations.\n\nnamedtuple: immutable, memory-efficient records. Point = namedtuple('Point', ['x', 'y']). Accessed by name (p.x) or index (p[0]). Use dataclasses when you need mutability or methods."
                        },
                        {
                            "type": "code",
                            "title": "collections patterns",
                            "content": "from collections import defaultdict, Counter, deque, namedtuple\n\n# defaultdict — grouping\nwords = ['apple', 'ant', 'banana', 'bear', 'cherry']\nby_letter = defaultdict(list)\nfor word in words:\n    by_letter[word[0]].append(word)\n# {'a': ['apple', 'ant'], 'b': ['banana', 'bear'], 'c': ['cherry']}\n\n# Counter — word frequency\ntext = 'the quick brown fox jumps over the lazy dog the'\ncounts = Counter(text.split())\nprint(counts.most_common(3))  # [('the', 3), ...]\n\n# Counter operations\nc1 = Counter(['a', 'b', 'a', 'c'])\nc2 = Counter(['a', 'c', 'd'])\nprint(c1 + c2)    # add counts\nprint(c1 & c2)    # intersection (min of counts)\nprint(c1 - c2)    # subtract, keep positives only\n\n# deque — BFS queue\nfrom collections import deque\n\ndef bfs(graph, start):\n    visited, queue = set(), deque([start])\n    while queue:\n        node = queue.popleft()   # O(1)\n        if node not in visited:\n            visited.add(node)\n            queue.extend(graph[node])\n    return visited\n\n# deque as circular buffer (last N items)\nlog_buffer = deque(maxlen=100)\nfor event in stream:\n    log_buffer.append(event)  # automatically drops oldest\n\n# namedtuple — lightweight record\nPoint = namedtuple('Point', ['x', 'y'])\np = Point(3, 4)\nprint(p.x, p.y)        # attribute access\nprint(p[0], p[1])      # index access\nprint(p._asdict())     # OrderedDict"
                        },
                        {
                            "type": "key_points",
                            "title": "collections module quick guide",
                            "items": [
                                "defaultdict(list) for grouping, defaultdict(int) for counting",
                                "Counter.most_common(n) — frequency analysis in two lines",
                                "deque for BFS/queues: popleft() O(1) vs list.pop(0) O(n)",
                                "deque(maxlen=N) — circular buffer for last-N-events patterns",
                                "namedtuple for immutable records; dataclass when you need mutability"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "What is ChainMap and when would you use it over dict.update()?",
                    "How does Counter handle negative counts?",
                    "When would you use namedtuple vs dataclass vs TypedDict?"
                ],
                "seo": {
                    "metaTitle": "Python collections Module — defaultdict, Counter, deque, namedtuple",
                    "metaDescription": "Master Python's collections module: defaultdict for grouping, Counter for frequency analysis, deque for O(1) queues, and namedtuple for lightweight records."
                },
                "speakable_v2": {
                    "archetype": "A",
                    "pillar": "P01",
                    "hook": "Python's collections module has the tools most developers build from scratch — and the standard library version is almost always more efficient.",
                    "beats": [
                        {
                            "kind": "defaultdict",
                            "layout": "paragraph",
                            "content": "defaultdict is the grouping tool: defaultdict(list) initializes missing keys with an empty list automatically. You stop writing 'if key not in d: d[key] = []' and start writing d[key].append(item)."
                        },
                        {
                            "kind": "counter",
                            "layout": "paragraph",
                            "content": "Counter counts anything iterable. Counter(words).most_common(10) — that's the word frequency interview problem done in two lines."
                        },
                        {
                            "kind": "deque",
                            "layout": "paragraph",
                            "content": "deque is the queue to use for BFS — popleft() is O(1) unlike list.pop(0). With maxlen, it becomes a circular buffer that automatically evicts the oldest entry."
                        }
                    ],
                    "cap": "Whenever you find yourself writing an if-missing-initialize pattern with a dict, reach for defaultdict. It's cleaner and signals intent.",
                    "followup_handoff": "Good follow-up: ChainMap for layered configs, or when to choose namedtuple vs dataclass.",
                    "tts_overrides": {}
                }
            }
        ],
        "sorting-searching": [
            {
                "id": "py-dsa-q020",
                "slug": "python-sort-key-functions",
                "question": "How does Python's sort work with key functions, and what is the difference between sort() and sorted()?",
                "title": "Python sort() vs sorted() and Key Functions",
                "direct_answer": "sort() is an in-place method on lists; sorted() returns a new sorted list and works on any iterable. Both accept key=function and reverse=True. The key function is called once per element to produce a comparison value — use operator.attrgetter or operator.itemgetter for attribute/index access. Python uses Timsort which is O(n log n) and stable (preserves original order for equal elements). Stability means multi-key sorting works: sort by secondary key first, then primary key.",
                "interviewer_intent": "Tests practical sort fluency — key functions, stability, and the Schwartzian transform (decorate-sort-undecorate) pattern.",
                "company_tags": ["amazon", "google"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "Python sort fundamentals",
                            "content": "Python's Timsort is a hybrid mergesort/insertion sort algorithm. It's O(n log n) worst case and exceptionally fast on real-world data because it detects and exploits already-sorted subsequences. It's stable — equal elements maintain their relative order from the original list.\n\nThe key parameter transforms each element for comparison without modifying the element itself. This is the Schwartzian transform pattern: decorate (compute the key), sort, use the original elements. Python calls the key function once per element, not once per comparison — so complex key functions don't penalize you.\n\nCommon key patterns: key=str.lower for case-insensitive string sort, key=len for sort by string length, key=lambda x: x['price'] for dicts, key=attrgetter('name') for objects.\n\nStable sort enables multi-key sorting: sort by secondary key first (with sort()), then sort by primary key. Equal-primary-key elements retain their secondary-key order from the first sort. This is more memory-efficient than key=lambda x: (x.primary, x.secondary) though both work."
                        },
                        {
                            "type": "code",
                            "title": "Key function patterns",
                            "content": "from operator import attrgetter, itemgetter\nfrom dataclasses import dataclass\n\n# sort() vs sorted()\nnums = [3, 1, 4, 1, 5, 9]\nnums.sort()              # in-place, returns None\nprint(nums)             # [1, 1, 3, 4, 5, 9]\n\nsorted_nums = sorted(nums)  # new list, original unchanged\n\n# Key functions\nwords = ['banana', 'apple', 'Fig', 'cherry']\n\n# Case-insensitive sort\nsorted(words, key=str.lower)  # ['apple', 'banana', 'cherry', 'Fig']\n\n# Sort by length, then alphabetically\nsorted(words, key=lambda w: (len(w), w.lower()))\n\n# Sort list of dicts\nproducts = [{'name': 'Z', 'price': 10}, {'name': 'A', 'price': 20}]\nsorted(products, key=itemgetter('price'))   # by price ascending\nsorted(products, key=itemgetter('name'), reverse=True)  # by name descending\n\n# Sort objects\n@dataclass\nclass Employee:\n    name: str\n    salary: float\n    dept: str\n\nemployees = [Employee('Bob', 90000, 'Eng'), Employee('Alice', 95000, 'Eng')]\nemployees.sort(key=attrgetter('salary'), reverse=True)  # highest first\n\n# Multi-key sort using stability\n# Sort by dept ascending, then salary descending within dept\nemployees.sort(key=attrgetter('salary'), reverse=True)  # secondary first\nemployees.sort(key=attrgetter('dept'))                  # then primary\n\n# Equivalent in one pass (often cleaner)\nemployees.sort(key=lambda e: (e.dept, -e.salary))"
                        },
                        {
                            "type": "key_points",
                            "title": "Sort rules",
                            "items": [
                                "sort() mutates list in-place and returns None; sorted() returns a new list",
                                "key= is called once per element — complex keys don't penalize comparisons",
                                "Timsort is stable — equal elements keep their original relative order",
                                "Multi-key: sort by secondary first, then primary (stability preserves order)",
                                "attrgetter('name') is faster than lambda x: x.name for large datasets"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "How would you sort a list of tuples by the second element descending?",
                    "What is the difference between __lt__ and __le__ for custom class sorting?",
                    "How does bisect module work for inserting into sorted lists?"
                ],
                "seo": {
                    "metaTitle": "Python sort() vs sorted() — Key Functions, Stability, and Timsort",
                    "metaDescription": "Master Python sorting: sort() vs sorted(), key functions with attrgetter/itemgetter, stable sort for multi-key ordering, and Timsort O(n log n)."
                },
                "speakable_v2": {
                    "archetype": "B",
                    "pillar": "P01",
                    "hook": "sort() and sorted() look almost identical but they have a crucial difference — and Python's stable sort enables a powerful multi-key pattern.",
                    "beats": [
                        {
                            "kind": "difference",
                            "layout": "paragraph",
                            "content": "sort() modifies the list in place and returns None. sorted() returns a new sorted list and works on any iterable — not just lists. Use sorted() when you don't want to mutate the original."
                        },
                        {
                            "kind": "key_functions",
                            "layout": "paragraph",
                            "content": "The key parameter is called once per element. key=str.lower for case-insensitive, key=lambda x: x['price'] for dicts, key=attrgetter('salary') for objects. Multiple criteria: key=lambda x: (x.dept, -x.salary) sorts by dept then salary descending."
                        },
                        {
                            "kind": "stability",
                            "layout": "paragraph",
                            "content": "Timsort is stable. Equal elements keep their original relative order. This means you can sort by secondary key first, then primary key — the stability preserves the secondary ordering for ties."
                        }
                    ],
                    "cap": "sort() returns None — if you see sorted_list = my_list.sort(), that's a bug that's set sorted_list to None.",
                    "followup_handoff": "Natural follow-up: bisect for maintaining sorted order, or functools.cmp_to_key for legacy comparison functions.",
                    "tts_overrides": {}
                }
            }
        ],
        "trees-graphs": [
            {
                "id": "py-dsa-q030",
                "slug": "bfs-dfs-python",
                "question": "How do you implement BFS and DFS in Python and when do you use each?",
                "title": "BFS and DFS in Python",
                "direct_answer": "BFS uses a queue (collections.deque) and visits nodes level by level — guarantees shortest path in unweighted graphs. DFS uses a stack (or recursion) and goes deep before backtracking — useful for topological sort, detecting cycles, and exhaustive search. BFS is preferred for shortest path problems. DFS is preferred for exhaustive enumeration, tree traversal, and problems where you need to explore all paths.",
                "interviewer_intent": "Tests graph traversal implementation in Python — a coding-round staple where candidates must demonstrate both conceptual understanding and idiomatic Python.",
                "company_tags": ["google", "amazon", "facebook"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "BFS vs DFS: when to use each",
                            "content": "BFS (Breadth-First Search) visits all nodes at distance d before visiting nodes at distance d+1. It guarantees the shortest path in unweighted graphs. The data structure is a queue — you process nodes in FIFO order. Use BFS for: shortest path in unweighted graphs, level-order tree traversal, finding connected components, and social network distance ('degrees of separation').\n\nDFS (Depth-First Search) follows a path as deep as possible before backtracking. The data structure is a stack (iterative) or the call stack (recursive). Use DFS for: detecting cycles, topological sorting, maze solving, exhaustive path enumeration, and connected component detection in undirected graphs.\n\nIn Python, always use collections.deque for BFS — deque.popleft() is O(1) while list.pop(0) is O(n). For DFS, the recursive version is cleaner but risks RecursionError on deep graphs (Python's default recursion limit is 1000). The iterative stack version is safer for production code."
                        },
                        {
                            "type": "code",
                            "title": "BFS and DFS implementations",
                            "content": "from collections import deque\nfrom typing import Any\n\nGraph = dict[Any, list[Any]]\n\n# BFS — shortest path (unweighted)\ndef bfs(graph: Graph, start: Any, target: Any) -> list | None:\n    queue = deque([[start]])    # queue of paths, not just nodes\n    visited = {start}\n    while queue:\n        path = queue.popleft()\n        node = path[-1]\n        if node == target:\n            return path\n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(path + [neighbor])\n    return None\n\n# BFS — level order tree traversal\ndef level_order(root) -> list[list]:\n    if not root:\n        return []\n    result, queue = [], deque([root])\n    while queue:\n        level = []\n        for _ in range(len(queue)):   # process one level at a time\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n        result.append(level)\n    return result\n\n# DFS — iterative (avoids recursion limit)\ndef dfs_iterative(graph: Graph, start: Any) -> list:\n    visited, stack, order = set(), [start], []\n    while stack:\n        node = stack.pop()      # LIFO — stack not queue\n        if node not in visited:\n            visited.add(node)\n            order.append(node)\n            stack.extend(graph.get(node, []))\n    return order\n\n# DFS — recursive (cleaner for trees)\ndef dfs_recursive(graph: Graph, node: Any, visited: set = None) -> list:\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    result = [node]\n    for neighbor in graph.get(node, []):\n        if neighbor not in visited:\n            result.extend(dfs_recursive(graph, neighbor, visited))\n    return result"
                        },
                        {
                            "type": "comparison",
                            "title": "BFS vs DFS at a glance",
                            "layout": "table",
                            "rows": [
                                ["", "BFS", "DFS"],
                                ["Data structure", "Queue (deque)", "Stack / recursion"],
                                ["Order", "Level by level", "Depth first"],
                                ["Shortest path", "Yes (unweighted)", "No"],
                                ["Memory", "O(width) — can be large", "O(depth)"],
                                ["Use for", "Shortest path, connected components", "Cycles, topo sort, exhaustive search"]
                            ]
                        },
                        {
                            "type": "key_points",
                            "title": "BFS/DFS rules",
                            "items": [
                                "BFS: deque + popleft() — O(1) vs list.pop(0) O(n)",
                                "DFS recursive: clean but hits RecursionError at depth ~1000",
                                "Always track visited set — prevents infinite loops in cyclic graphs",
                                "BFS guarantees shortest path in unweighted graphs",
                                "DFS: topological sort, cycle detection, all-paths enumeration"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "How do you implement Dijkstra's algorithm in Python?",
                    "How does topological sort work and when do you need it?",
                    "What is the difference between pre-order, in-order, and post-order DFS?"
                ],
                "seo": {
                    "metaTitle": "BFS and DFS in Python — Implementation and When to Use Each",
                    "metaDescription": "Implement BFS and DFS in Python: deque for BFS shortest path, iterative vs recursive DFS. Includes comparison table and production-safe patterns."
                },
                "speakable_v2": {
                    "archetype": "C",
                    "pillar": "P01",
                    "hook": "BFS and DFS look similar on paper but the choice of queue vs stack drives completely different traversal orders — and only one guarantees shortest path.",
                    "beats": [
                        {
                            "kind": "bfs_queue",
                            "layout": "paragraph",
                            "content": "BFS uses a queue — deque with popleft(). You process nodes in the order they were discovered, level by level. That's why BFS guarantees shortest path in unweighted graphs — you reach a node via the fewest edges before any other path."
                        },
                        {
                            "kind": "dfs_stack",
                            "layout": "paragraph",
                            "content": "DFS uses a stack — or recursion, which is the call stack. You go deep on one path before backtracking. For production code with potentially deep graphs, the iterative stack version is safer — Python hits RecursionError around depth 1000."
                        },
                        {
                            "kind": "visited_set",
                            "layout": "paragraph",
                            "content": "Always track a visited set for both. Without it, cyclic graphs cause infinite loops."
                        }
                    ],
                    "cap": "Rule: BFS for shortest path and level-order traversal, DFS for exploring all paths, cycle detection, and topological sort.",
                    "followup_handoff": "Follow up with Dijkstra for weighted shortest path, or topological sort for dependency ordering.",
                    "tts_overrides": {}
                }
            }
        ],
        "problem-solving-patterns": [
            {
                "id": "py-dsa-q040",
                "slug": "two-pointers-sliding-window-python",
                "question": "What are the two-pointer and sliding window patterns in Python and when do you apply them?",
                "title": "Two Pointers and Sliding Window",
                "direct_answer": "Two pointers uses two indices that move toward each other (or in the same direction) to reduce O(n²) nested loops to O(n). Sliding window maintains a window of elements, expanding and shrinking as needed — used for subarray/substring problems with a constraint. Both work on sorted arrays or strings. Common uses: two sum in sorted array, longest substring without repeats, maximum sum subarray of size k.",
                "interviewer_intent": "Tests pattern recognition — whether the candidate can reduce brute-force O(n²) solutions to O(n) with a standard technique.",
                "company_tags": ["amazon", "google", "facebook"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "Two-pointer and sliding window patterns",
                            "content": "These are reduction patterns — they transform O(n²) brute force into O(n) by maintaining state across iterations instead of restarting from scratch.\n\nTwo-pointer (converging): start left=0, right=len-1. Move them toward each other based on a condition. Classic use: find two numbers in a sorted array that sum to target. If sum > target, move right left. If sum < target, move left right.\n\nTwo-pointer (same direction): both pointers move forward but at different speeds (fast/slow for cycle detection) or one skips elements (remove duplicates from sorted array in-place).\n\nSliding window: maintain a window [left, right] over the array. Expand by moving right, shrink by moving left. Keep a constraint (window size, no duplicate chars, etc.). The window 'slides' forward. Classic use: longest substring without repeating characters — right expands until a repeat is found, then left advances past the duplicate.\n\nThe mental model for choosing: if you need to find a pair or triplet in a sorted array → two pointers. If you need to find a subarray or substring satisfying a constraint → sliding window."
                        },
                        {
                            "type": "code",
                            "title": "Pattern implementations",
                            "content": "# Two-pointer: two sum in sorted array O(n)\ndef two_sum_sorted(nums: list[int], target: int) -> tuple[int, int] | None:\n    left, right = 0, len(nums) - 1\n    while left < right:\n        current = nums[left] + nums[right]\n        if current == target:\n            return (left, right)\n        elif current < target:\n            left += 1\n        else:\n            right -= 1\n    return None\n\n# Two-pointer: remove duplicates from sorted array in-place O(n)\ndef remove_duplicates(nums: list[int]) -> int:\n    if not nums: return 0\n    write = 1\n    for read in range(1, len(nums)):\n        if nums[read] != nums[read - 1]:\n            nums[write] = nums[read]\n            write += 1\n    return write  # new length\n\n# Sliding window: longest substring without repeating characters O(n)\ndef length_of_longest_substring(s: str) -> int:\n    char_index = {}   # last seen index\n    max_len = 0\n    left = 0\n    for right, char in enumerate(s):\n        if char in char_index and char_index[char] >= left:\n            left = char_index[char] + 1   # shrink window\n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\n# Sliding window: max sum subarray of fixed size k O(n)\ndef max_sum_subarray(nums: list[int], k: int) -> int:\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]   # slide: add new, remove old\n        max_sum = max(max_sum, window_sum)\n    return max_sum"
                        },
                        {
                            "type": "key_points",
                            "title": "Pattern selection guide",
                            "items": [
                                "Two pointers (converging): sorted array, find pair with property",
                                "Two pointers (same direction): in-place array modification, fast/slow for cycles",
                                "Sliding window: subarray/substring with constraint, O(n) instead of O(n²)",
                                "Sliding window fixed size: track sum, slide by adding right - removing left[i-k]",
                                "Sliding window variable size: left pointer shrinks window when constraint violated"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "How do you detect a cycle in a linked list using two pointers?",
                    "What is the minimum window substring problem and how do you solve it?",
                    "How does the two-pointer pattern extend to three-sum?"
                ],
                "seo": {
                    "metaTitle": "Two Pointers and Sliding Window in Python — Patterns and Examples",
                    "metaDescription": "Master Python's two-pointer and sliding window patterns: sorted array pair sum, longest substring without repeats, fixed and variable window examples."
                },
                "speakable_v2": {
                    "archetype": "C",
                    "pillar": "P01",
                    "hook": "Two pointers and sliding window are the O(n) refactors for problems that look like they need O(n²) nested loops.",
                    "beats": [
                        {
                            "kind": "two_pointer",
                            "layout": "paragraph",
                            "content": "Two pointers: left starts at 0, right at the end, they move toward each other. At each step you decide which pointer to move based on whether the current state satisfies, overshoots, or undershoots the target. Sorted array is required for this to work."
                        },
                        {
                            "kind": "sliding_window",
                            "layout": "paragraph",
                            "content": "Sliding window: right expands the window, left shrinks it. You maintain a constraint — no duplicate chars, sum under limit, etc. When the constraint is violated, advance left until it holds again. The window slides forward, touching each element at most twice."
                        },
                        {
                            "kind": "when_to_use",
                            "layout": "bullets",
                            "items": [
                                "Sorted array, find pair → two pointers converging",
                                "Subarray sum or substring property → sliding window",
                                "Linked list cycle → fast/slow two pointers"
                            ]
                        }
                    ],
                    "cap": "If you're writing a nested loop over an array and the inner loop starts at i+1, ask yourself: can I reduce this to O(n) with two pointers?",
                    "followup_handoff": "Good follow-up: three-sum extending two pointers, or minimum window substring as a harder sliding window.",
                    "tts_overrides": {}
                }
            }
        ],
        "dynamic-programming": [
            {
                "id": "py-dsa-q050",
                "slug": "dynamic-programming-python-memoization",
                "question": "What is dynamic programming and how do you implement memoization in Python?",
                "title": "Dynamic Programming and Memoization in Python",
                "direct_answer": "Dynamic programming solves problems by breaking them into overlapping subproblems and caching results to avoid recomputation. In Python, memoization (top-down DP) is simplest with @functools.lru_cache or @cache (Python 3.9+) on a recursive function. Bottom-up DP builds a table iteratively. Classic examples: Fibonacci, coin change, longest common subsequence. lru_cache turns an exponential recursive solution into O(n) automatically.",
                "interviewer_intent": "Tests understanding of the optimization technique and Python-specific tools. Many candidates know the concept but don't know about lru_cache.",
                "company_tags": ["amazon", "google", "facebook"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "Memoization and tabulation in Python",
                            "content": "Dynamic programming applies when: (1) the problem has optimal substructure — the solution can be built from solutions to subproblems, and (2) overlapping subproblems — the same subproblems recur.\n\nTop-down (memoization): write the recursive solution, cache results. @functools.lru_cache(maxsize=None) or @functools.cache (Python 3.9+) adds automatic memoization. Python handles the cache lookup for you. The cache key is the tuple of function arguments — arguments must be hashable (no list arguments).\n\nBottom-up (tabulation): build an array from base cases upward, avoiding recursion overhead and recursion limit issues. Often more memory-efficient — you can sometimes keep only the last row of a 2D DP table.\n\nCommon DP patterns: linear (Fibonacci, house robber), knapsack (0/1 subset), string (longest common subsequence, edit distance), path (grid minimum path sum). Recognizing the pattern matters more than memorizing solutions — once you identify 'this is a knapsack variant', the DP formulation follows."
                        },
                        {
                            "type": "code",
                            "title": "Memoization with lru_cache and tabulation",
                            "content": "from functools import lru_cache, cache\nimport sys\n\n# Naive recursive — O(2^n)\ndef fib_naive(n: int) -> int:\n    if n <= 1: return n\n    return fib_naive(n-1) + fib_naive(n-2)\n\n# Memoized — O(n) with lru_cache\n@cache\ndef fib_memo(n: int) -> int:\n    if n <= 1: return n\n    return fib_memo(n-1) + fib_memo(n-2)\n\n# Bottom-up — O(n) time, O(1) space\ndef fib_dp(n: int) -> int:\n    if n <= 1: return n\n    a, b = 0, 1\n    for _ in range(2, n+1):\n        a, b = b, a + b\n    return b\n\n# Coin change — minimum coins to make amount\n@cache\ndef coin_change(coins: tuple[int, ...], amount: int) -> int:\n    if amount == 0: return 0\n    if amount < 0: return float('inf')\n    return 1 + min(coin_change(coins, amount - c) for c in coins)\n\n# Note: list must be converted to tuple for hashability\ncoins_list = [1, 5, 10]\nresult = coin_change(tuple(coins_list), 27)\n\n# Bottom-up coin change — avoids recursion limit\ndef coin_change_dp(coins: list[int], amount: int) -> int:\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if c <= a:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1\n\n# Increase recursion limit for deep problems (use carefully)\nsys.setrecursionlimit(10000)"
                        },
                        {
                            "type": "key_points",
                            "title": "DP in Python rules",
                            "items": [
                                "@functools.cache (3.9+) or @lru_cache(None) adds memoization in one line",
                                "Arguments must be hashable — convert lists to tuples for cache keys",
                                "Bottom-up avoids Python's recursion limit (~1000 by default)",
                                "Recognize pattern: overlapping subproblems + optimal substructure",
                                "Space optimization: 2D DP often reducible to two 1D arrays (current/previous row)"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "What is the difference between memoization and tabulation?",
                    "How do you handle DP problems where the subproblem space is a string?",
                    "What is the 0/1 knapsack problem and how do you solve it?"
                ],
                "seo": {
                    "metaTitle": "Dynamic Programming in Python — lru_cache, Memoization, and Tabulation",
                    "metaDescription": "Learn dynamic programming in Python: @functools.cache for automatic memoization, bottom-up tabulation, coin change, Fibonacci. O(n) from exponential recursion."
                },
                "speakable_v2": {
                    "archetype": "C",
                    "pillar": "P01",
                    "hook": "lru_cache turns a naive O(2^n) recursive Fibonacci into O(n) with one decorator — no table-building needed.",
                    "beats": [
                        {
                            "kind": "memoization",
                            "layout": "paragraph",
                            "content": "Add @functools.cache to any recursive function and Python automatically caches results by argument tuple. First call computes, subsequent calls return cached. The catch: arguments must be hashable — pass tuples, not lists."
                        },
                        {
                            "kind": "bottom_up",
                            "layout": "paragraph",
                            "content": "Bottom-up builds a dp array from base cases. For coin change: dp[0] = 0 (zero coins for zero amount), then for each amount from 1 to target, try every coin and take the minimum. No recursion, no stack depth limit."
                        },
                        {
                            "kind": "when_dp",
                            "layout": "paragraph",
                            "content": "DP applies when: you have overlapping subproblems (same sub-computation recurs) and optimal substructure (problem solution is built from subproblem solutions). If both hold, DP reduces exponential to polynomial."
                        }
                    ],
                    "cap": "The quick check for DP: write the naive recursive solution. If you're computing the same subproblem twice, slap @cache on it and you're done with memoization.",
                    "followup_handoff": "Good follow-up: 0/1 knapsack pattern, or space-optimized 2D DP where you keep only two rows.",
                    "tts_overrides": {}
                }
            }
        ]
    },
    "generators-functional": {
        "generators-iterators": [
            {
                "id": "py-gen-q001",
                "slug": "python-generator-yield-explained",
                "question": "How do generators and the yield keyword work in Python?",
                "title": "Python Generators and yield",
                "direct_answer": "A generator function uses yield instead of return. Calling it returns a generator object without executing any code. Each call to next() executes until the next yield, returns that value, and suspends execution — the local state is preserved. On the next next() call, execution resumes from where it paused. This lazy evaluation means generators use O(1) memory regardless of how many values they'd produce. They're the foundation of Python's iteration protocol.",
                "interviewer_intent": "Tests understanding of Python's lazy evaluation model and the iteration protocol. Generator internals often reveal how deeply a candidate understands Python.",
                "company_tags": ["google", "stripe", "amazon"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "Generator execution model",
                            "content": "A generator function is syntactically like a regular function but contains one or more yield expressions. When called, instead of executing the function body, Python creates a generator object. No code runs yet.\n\nEach call to next(gen) resumes execution from the last yield (or the start for the first call) until it hits the next yield. The yield value becomes the return value of next(). Local variables and execution state are preserved between calls. When the function body is exhausted (falls off the end or hits return), StopIteration is raised.\n\nfor loops call next() automatically and catch StopIteration — so generators fit naturally into for loops. yield from delegates to another generator (or any iterable), forwarding all values.\n\nGenerator use cases: large file processing, infinite sequences, data pipelines, co-routines (generators can also receive values via gen.send(value)). The key advantage: memory. A function that produces 1 million values with a list allocates 1 million items at once. A generator allocates one item at a time."
                        },
                        {
                            "type": "code",
                            "title": "Generator patterns",
                            "content": "# Basic generator function\ndef count_up(start: int, end: int):\n    current = start\n    while current <= end:\n        yield current       # suspends here, returns current\n        current += 1        # resumes here on next next()\n\ngen = count_up(1, 5)\nprint(next(gen))   # 1\nprint(next(gen))   # 2\nfor n in gen:      # 3, 4, 5 — for loop calls next() until StopIteration\n    print(n)\n\n# Infinite sequence generator\ndef fibonacci():\n    a, b = 0, 1\n    while True:      # infinite! — safe because lazy\n        yield a\n        a, b = b, a + b\n\nfib = fibonacci()\nfirst_10 = [next(fib) for _ in range(10)]  # [0,1,1,2,3,5,8,13,21,34]\n\n# Generator pipeline — processes one item at a time end-to-end\ndef read_lines(filename):\n    with open(filename) as f:\n        yield from f           # delegates to file iterator\n\ndef parse_numbers(lines):\n    for line in lines:\n        line = line.strip()\n        if line.isdigit():\n            yield int(line)\n\ndef filter_even(numbers):\n    for n in numbers:\n        if n % 2 == 0:\n            yield n\n\n# Chain: only reads/parses/filters one line at a time\nevens = filter_even(parse_numbers(read_lines('data.txt')))\nfor n in evens:\n    process(n)\n\n# yield from — flatten nested generators\ndef flatten(nested):\n    for item in nested:\n        if isinstance(item, list):\n            yield from flatten(item)   # recurse into sublists\n        else:\n            yield item\n\nlist(flatten([1, [2, [3, 4]], [5]]))  # [1, 2, 3, 4, 5]"
                        },
                        {
                            "type": "key_points",
                            "title": "Generator rules",
                            "items": [
                                "Calling a generator function returns a generator object — no code runs yet",
                                "next() resumes execution until the next yield; raises StopIteration when done",
                                "Local state (variables, execution point) preserved between next() calls",
                                "yield from delegates to another iterable — cleaner than nested for loops",
                                "Generators are single-use — after exhaustion, iterating again yields nothing"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "What is the difference between a generator and an iterator?",
                    "How does generator.send() work for two-way communication?",
                    "What is yield from and how does it differ from a for loop with yield?"
                ],
                "seo": {
                    "metaTitle": "Python Generators and yield Explained — Lazy Evaluation",
                    "metaDescription": "Understand Python generators: yield suspends execution, preserves state, enables lazy evaluation. Includes generator pipelines, yield from, and infinite sequences."
                },
                "speakable_v2": {
                    "archetype": "A",
                    "pillar": "P01",
                    "hook": "A generator function returns a generator object the instant it's called — no code runs until you ask for the first value.",
                    "beats": [
                        {
                            "kind": "execution_model",
                            "layout": "paragraph",
                            "content": "yield is a pause point. Each next() call resumes from the last yield and runs until it hits the next one. Local variables stay alive between calls. When the function body ends, StopIteration tells the for loop to stop."
                        },
                        {
                            "kind": "memory",
                            "layout": "paragraph",
                            "content": "The power is memory. A list of a million items takes megabytes. The equivalent generator takes about 100 bytes — it only computes one item at a time."
                        },
                        {
                            "kind": "pipelines",
                            "layout": "paragraph",
                            "content": "Generators chain into pipelines: read_lines feeds parse_numbers feeds filter_even. Each stage produces one item, passes it to the next, never building a full list. yield from delegates to another iterable cleanly."
                        }
                    ],
                    "cap": "Generators are single-use — once exhausted, iterating again yields nothing. If you need multiple passes, materialize with list() first.",
                    "followup_handoff": "Natural follow-up: generator.send() for co-routines, or asyncio which builds on the same protocol.",
                    "tts_overrides": {}
                }
            }
        ],
        "decorators": [
            {
                "id": "py-gen-q010",
                "slug": "python-decorators-how-they-work",
                "question": "How do Python decorators work and how do you write one that preserves the wrapped function's metadata?",
                "title": "Python Decorators",
                "direct_answer": "A decorator is a function that takes a function and returns a modified function. @my_decorator on a function is sugar for func = my_decorator(func). To preserve __name__, __doc__, and other metadata, wrap the inner function with @functools.wraps(func). Without wraps, debugging and logging tools see the wrapper name instead of the original function name, which is confusing in production.",
                "interviewer_intent": "Tests understanding of Python's higher-order function model and the practical pitfall of losing function metadata without @wraps.",
                "company_tags": ["stripe", "google", "amazon"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "Decorator mechanics",
                            "content": "Decorators are syntactic sugar for the higher-order function pattern. @my_decorator above a function definition is exactly equivalent to wrapping: func = my_decorator(func). Python evaluates this at class/module definition time, not at call time.\n\nA decorator receives the original function, returns a new callable (usually a closure called wrapper). When the decorated function is called, the wrapper runs — it can execute code before and after the original, modify arguments or return values, catch exceptions, or skip the original entirely.\n\nThe critical issue: the wrapper has its own __name__, __qualname__, __doc__, and __module__. Without @functools.wraps(original_func), those attributes point to the wrapper, not the original. This breaks introspection, logging, Flask/FastAPI route registration, pytest test discovery, and any tool that reads function metadata.\n\nParameterized decorators add another layer: you write a factory that takes the parameters and returns a decorator. This is three levels of functions — the factory, the decorator, and the wrapper."
                        },
                        {
                            "type": "code",
                            "title": "Decorator patterns",
                            "content": "import functools\nimport time\nfrom typing import Callable, TypeVar, ParamSpec\n\nP = ParamSpec('P')\nT = TypeVar('T')\n\n# Basic decorator with @wraps\ndef log_calls(func: Callable[P, T]) -> Callable[P, T]:\n    @functools.wraps(func)   # copies __name__, __doc__, etc.\n    def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:\n        print(f'Calling {func.__name__}')\n        result = func(*args, **kwargs)\n        print(f'{func.__name__} returned {result}')\n        return result\n    return wrapper\n\n@log_calls\ndef add(a: int, b: int) -> int:\n    \"\"\"Add two numbers.\"\"\"\n    return a + b\n\nprint(add.__name__)   # 'add' (not 'wrapper') — because of @wraps\nprint(add.__doc__)    # 'Add two numbers.'\n\n# Parametrized decorator — factory returns decorator\ndef retry(max_attempts: int = 3, exceptions: tuple = (Exception,)):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, max_attempts + 1):\n                try:\n                    return func(*args, **kwargs)\n                except exceptions as e:\n                    if attempt == max_attempts:\n                        raise\n                    print(f'Attempt {attempt} failed: {e}, retrying...')\n        return wrapper\n    return decorator\n\n@retry(max_attempts=3, exceptions=(ConnectionError,))\ndef fetch_data(url: str) -> dict:\n    return requests.get(url).json()\n\n# Timing decorator\ndef timer(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = func(*args, **kwargs)\n        elapsed = time.perf_counter() - start\n        print(f'{func.__name__} took {elapsed:.4f}s')\n        return result\n    return wrapper"
                        },
                        {
                            "type": "key_points",
                            "title": "Decorator rules",
                            "items": [
                                "Always use @functools.wraps(func) on the wrapper — preserves metadata",
                                "Parametrized decorators: factory(params) → decorator(func) → wrapper(*args)",
                                "Decorators run at definition time, not call time — watch for class-level decorators",
                                "Stacking decorators: outermost is applied last (bottom one is closest to the function)",
                                "For type-safe decorators, use ParamSpec + TypeVar to preserve signatures"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "How do class-based decorators work?",
                    "What is the difference between @property and a regular decorator?",
                    "How do you write a decorator that can be used with or without arguments?"
                ],
                "seo": {
                    "metaTitle": "Python Decorators Explained — @wraps, Parametrized, and Stacking",
                    "metaDescription": "Master Python decorators: how @decorator works, always use @functools.wraps, parametrized decorator pattern, and type-safe decorator signatures."
                },
                "speakable_v2": {
                    "archetype": "A",
                    "pillar": "P01",
                    "hook": "Every Python decorator is just function composition — and the most common mistake is forgetting @wraps, which causes confusing names in logs and stack traces.",
                    "beats": [
                        {
                            "kind": "mechanics",
                            "layout": "paragraph",
                            "content": "@my_decorator above a function is exactly func = my_decorator(func). The decorator takes the original function and returns a wrapper. The wrapper runs your before/after logic and calls the original in the middle."
                        },
                        {
                            "kind": "wraps",
                            "layout": "paragraph",
                            "content": "Always put @functools.wraps(func) on the wrapper function. Without it, func.__name__ shows 'wrapper' instead of the real name. That breaks Flask route registration, logging, pytest, and any tool that reads function metadata."
                        },
                        {
                            "kind": "parametrized",
                            "layout": "paragraph",
                            "content": "Parametrized decorators need three levels: a factory that takes parameters, a decorator that takes the function, and a wrapper that takes the args. @retry(max_attempts=3) is the factory call that returns the decorator."
                        }
                    ],
                    "cap": "The @wraps rule is one line. Write it every time. The debugging cost of a missing @wraps is much higher than the cost of typing it.",
                    "followup_handoff": "Good follow-up: class-based decorators, or how FastAPI uses decorators for route registration.",
                    "tts_overrides": {}
                }
            }
        ],
        "closures-scopes": [
            {
                "id": "py-gen-q020",
                "slug": "python-closures-scopes-legb",
                "question": "What is a closure in Python and how does the LEGB scope rule work?",
                "title": "Python Closures and LEGB Scope",
                "direct_answer": "LEGB is Python's name lookup order: Local → Enclosing → Global → Built-in. A closure is a function that captures variables from its enclosing scope — those variables live on even after the outer function returns. To modify an enclosing variable (not just read it), you must declare it with nonlocal. The classic gotcha: closures capture the variable, not its value — a common loop-closure bug where all lambda variants reference the same variable.",
                "interviewer_intent": "Tests understanding of Python's scoping model and the late-binding closure gotcha that's a common source of bugs.",
                "company_tags": ["google", "stripe"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "LEGB and closures",
                            "content": "Python resolves names by searching four scopes in order: Local (variables defined in the current function), Enclosing (variables in enclosing functions, for nested functions), Global (module-level variables), Built-in (Python's built-in names like len, range, print).\n\nA closure occurs when an inner function refers to a name from an enclosing function scope. Python creates a 'cell' object that stores the variable, and both the outer function and the inner function share a reference to that cell. When the outer function returns, its local scope is gone, but the cell keeps the variable alive as long as the closure exists.\n\nLate-binding gotcha: closures capture the variable binding, not the value at definition time. In a loop creating lambdas, all lambdas capture the same loop variable — when the loop ends, all lambdas see the final value. Fix: use a default argument (lambda i=i: i) or functools.partial to bind the value at definition time.\n\nnonlocal: to assign to an enclosing variable (not just read it), declare nonlocal x. Without it, an assignment creates a new local variable. global similarly allows assigning to module-level variables from within a function."
                        },
                        {
                            "type": "code",
                            "title": "LEGB and closure patterns",
                            "content": "# LEGB lookup order\nx = 'global'\n\ndef outer():\n    x = 'enclosing'\n    def inner():\n        # x = 'local'  # uncomment to see local override\n        print(x)       # LEGB: L=not found, E='enclosing'\n    inner()\n\nouter()    # prints 'enclosing'\n\n# Closure: function captures enclosing variable\ndef make_counter():\n    count = 0\n    def increment():\n        nonlocal count   # required to assign, not just read\n        count += 1\n        return count\n    return increment\n\ncounter = make_counter()\nprint(counter())  # 1\nprint(counter())  # 2\nprint(counter())  # 3\n# count lives on after make_counter() returned\n\n# Late-binding gotcha\nfuncs = [lambda: i for i in range(5)]\nprint([f() for f in funcs])  # [4, 4, 4, 4, 4] — all see i=4\n\n# Fix: bind value at definition time\nfuncs = [lambda i=i: i for i in range(5)]\nprint([f() for f in funcs])  # [0, 1, 2, 3, 4]\n\n# Practical closure: partial application\ndef multiplier(factor):\n    def multiply(x):\n        return x * factor    # captures factor from enclosing scope\n    return multiply\n\ndouble = multiplier(2)\ntriple = multiplier(3)\nprint(double(5), triple(5))  # 10, 15"
                        },
                        {
                            "type": "key_points",
                            "title": "LEGB and closure rules",
                            "items": [
                                "LEGB: Local → Enclosing → Global → Built-in — lookup stops at first match",
                                "nonlocal to assign to enclosing variable; global for module-level",
                                "Closures capture the variable (cell), not the value at creation time",
                                "Loop closure bug: lambda: i → all see final i. Fix: lambda i=i: i",
                                "functools.partial is often cleaner than closures for partial application"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "What is the difference between global and nonlocal?",
                    "How do closures interact with mutable default arguments?",
                    "When would you use functools.partial instead of a closure?"
                ],
                "seo": {
                    "metaTitle": "Python Closures and LEGB Scope — Late Binding and nonlocal",
                    "metaDescription": "Master Python closures and LEGB scope: variable lookup order, nonlocal for enclosing scope mutation, and the late-binding loop closure gotcha."
                },
                "speakable_v2": {
                    "archetype": "A",
                    "pillar": "P01",
                    "hook": "The loop-closure bug catches almost everyone: all your lambda functions return the same value, because they captured the variable, not its value.",
                    "beats": [
                        {
                            "kind": "legb",
                            "layout": "paragraph",
                            "content": "LEGB is Python's name lookup: Local first, then Enclosing (outer function), then Global (module), then Built-in. The first match wins."
                        },
                        {
                            "kind": "closure",
                            "layout": "paragraph",
                            "content": "A closure captures a variable from the enclosing scope — that variable stays alive after the outer function returns. To assign (not just read) an enclosing variable, declare it with nonlocal."
                        },
                        {
                            "kind": "late_binding_bug",
                            "layout": "paragraph",
                            "content": "The gotcha: closures bind to the variable, not the value at definition time. All lambdas in a loop share the same loop variable i. When the loop ends, every lambda sees the final value. Fix: use a default argument lambda i=i: i to capture the value at creation."
                        }
                    ],
                    "cap": "Any time you create a function inside a loop that references the loop variable, test it — late binding means all variants may return the last iteration's value.",
                    "followup_handoff": "Follow up with functools.partial as a cleaner alternative to closures, or nonlocal vs global semantics.",
                    "tts_overrides": {}
                }
            }
        ],
        "functional-programming": [
            {
                "id": "py-gen-q030",
                "slug": "python-functools-itertools-essentials",
                "question": "What are the most useful functions in Python's functools and itertools modules?",
                "title": "Python functools and itertools Essentials",
                "direct_answer": "From functools: lru_cache/cache for memoization, partial for partial application, reduce for folding, wraps for decorator metadata. From itertools: chain for flattening iterables, product for Cartesian product, combinations and permutations, islice for slicing generators, groupby for run-length grouping, takewhile/dropwhile for predicate-based slicing. These replace hand-written loops with composable, memory-efficient alternatives.",
                "interviewer_intent": "Tests standard library breadth and whether the candidate reaches for composable tools instead of reinventing them.",
                "company_tags": ["google", "amazon"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "functools and itertools cheat sheet",
                            "content": "functools provides higher-order functions: functions that operate on functions.\n\nlru_cache / cache: memoization. total_ordering: define __eq__ and one comparison, get all four for free. reduce(function, iterable): fold left — reduce([1,2,3,4], add) → ((1+2)+3)+4 = 10. partial(func, *fixed_args): fix some arguments, return new callable.\n\nitertools provides lazy combinatorial and sequence tools.\n\nchain(*iterables): flatten multiple iterables without building a list. chain.from_iterable([[1,2],[3,4]]) flattens a list of lists. product(*iterables): Cartesian product — nested for loops without nesting. combinations(iterable, r) and permutations(iterable, r): combinatorial sequences. groupby(iterable, key): groups consecutive equal-key elements — input must be sorted by key first. islice(iterable, stop) or islice(iterable, start, stop): slice a generator. takewhile(pred, it) / dropwhile(pred, it): take/skip while predicate holds."
                        },
                        {
                            "type": "code",
                            "title": "functools and itertools patterns",
                            "content": "from functools import lru_cache, partial, reduce\nfrom itertools import chain, product, combinations, groupby, islice, takewhile\nfrom operator import add\n\n# functools\n@lru_cache(maxsize=256)\ndef expensive(n: int) -> int:\n    return sum(range(n))\n\n# partial — fix some arguments\ndef power(base, exp):\n    return base ** exp\n\nsquare = partial(power, exp=2)\ncube = partial(power, exp=3)\nprint(square(5), cube(3))  # 25, 27\n\n# reduce — fold (use sum/max/min when possible)\nprint(reduce(add, [1,2,3,4,5]))  # 15\nprint(reduce(lambda acc, x: acc * x, [1,2,3,4,5]))  # 120 (factorial)\n\n# itertools\n# chain — flatten without building a list\nall_items = list(chain([1,2], [3,4], [5]))  # [1,2,3,4,5]\nflat = list(chain.from_iterable([[1,2],[3,4],[5]]))  # same\n\n# product — replaces nested loops\nfor i, j in product(range(3), range(3)):\n    print(i, j)  # 3x3 grid\n\n# combinations\nteams = list(combinations(['A','B','C','D'], 2))\n# [('A','B'), ('A','C'), ('A','D'), ('B','C'), ...]\n\n# groupby — must sort first!\ndata = sorted([('eng', 'alice'), ('eng', 'bob'), ('hr', 'carol')], key=lambda x: x[0])\nfor dept, employees in groupby(data, key=lambda x: x[0]):\n    print(dept, list(employees))\n\n# islice — slice a generator without materializing it\nfirst_5_lines = list(islice(open('big.txt'), 5))\n\n# takewhile\npositive = list(takewhile(lambda x: x > 0, [1, 2, 3, -1, 4, 5]))\n# [1, 2, 3] — stops at -1"
                        },
                        {
                            "type": "key_points",
                            "title": "functools/itertools quick guide",
                            "items": [
                                "lru_cache(maxsize=N): memoization, bounded; cache: unbounded (3.9+)",
                                "partial: pre-fill arguments — cleaner than lambda for simple cases",
                                "chain.from_iterable: flatten nested iterables without building a list",
                                "groupby: requires sorted input — groups consecutive matching-key elements",
                                "islice: slice generators; takewhile/dropwhile: predicate-based slicing"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "What is the difference between itertools.chain and a list concatenation?",
                    "How does functools.total_ordering work?",
                    "When would you use itertools.starmap?"
                ],
                "seo": {
                    "metaTitle": "Python functools and itertools — lru_cache, partial, chain, groupby",
                    "metaDescription": "Master Python's functools and itertools: lru_cache for memoization, partial for partial application, chain for flattening, groupby for grouping."
                },
                "speakable_v2": {
                    "archetype": "A",
                    "pillar": "P01",
                    "hook": "functools and itertools are the tools that eliminate hand-written loops — and most Python developers only know half of them.",
                    "beats": [
                        {
                            "kind": "functools",
                            "layout": "bullets",
                            "items": [
                                "lru_cache / cache: memoize any function with one decorator",
                                "partial: pre-fill arguments — square = partial(power, exp=2)",
                                "wraps: always on your decorator wrappers"
                            ]
                        },
                        {
                            "kind": "itertools",
                            "layout": "bullets",
                            "items": [
                                "chain.from_iterable: flatten nested iterables lazily",
                                "product: Cartesian product — replaces nested for loops",
                                "groupby: group consecutive matching elements — sort first or you'll miss groups",
                                "islice: slice a generator without materializing it"
                            ]
                        },
                        {
                            "kind": "groupby_gotcha",
                            "layout": "paragraph",
                            "content": "The groupby gotcha: it only groups consecutive elements. If your data isn't sorted by the key, you'll get duplicate groups. Sort by the key first."
                        }
                    ],
                    "cap": "Before writing a loop, check functools and itertools — odds are the pattern already exists and it's lazier and more composable than what you'd write.",
                    "followup_handoff": "Could follow up with operator module (attrgetter, itemgetter) for functional patterns, or functools.total_ordering.",
                    "tts_overrides": {}
                }
            }
        ],
        "context-managers": [
            {
                "id": "py-gen-q040",
                "slug": "contextlib-advanced-patterns",
                "question": "What is contextlib.ExitStack and when do you need it?",
                "title": "contextlib.ExitStack for Dynamic Context Managers",
                "direct_answer": "ExitStack manages a dynamic number of context managers — when you don't know at compile time how many resources you'll need to manage. You push context managers onto the stack at runtime; when the stack exits, it unwinds them in LIFO order, calling each __exit__. Use cases: opening a variable number of files, conditionally adding context managers (connection + transaction only if writing), managing cleanup callbacks that aren't context managers.",
                "interviewer_intent": "Tests advanced context manager knowledge and resource management patterns for production code.",
                "company_tags": ["stripe", "google"],
                "answer": {
                    "sections": [
                        {
                            "type": "overview",
                            "title": "When static with statements aren't enough",
                            "content": "Static with statements handle a fixed number of resources known at write time: with open('a') as f1, open('b') as f2. But sometimes you need to manage resources dynamically — open N files where N is a function argument, or conditionally add a transaction context manager based on whether you're in write mode.\n\ncontextlib.ExitStack solves this. It's a context manager that acts as a stack of other context managers. You enter the ExitStack with a with statement, then push resources onto it using stack.enter_context(). On exit, the stack unwinds all pushed context managers in LIFO order, even if some of them raise exceptions.\n\nstack.callback(func, *args) adds a cleanup function that doesn't need to be a context manager — useful for cleanup code that pre-dates the with statement. stack.push(cm) adds a context manager's __exit__ directly.\n\nAnother pattern: deferred cleanup. Build up a set of resources, and if setup fails, ExitStack's __exit__ cleans up everything that was successfully opened so far."
                        },
                        {
                            "type": "code",
                            "title": "ExitStack patterns",
                            "content": "from contextlib import ExitStack\n\n# Open a variable number of files\ndef process_files(filenames: list[str]) -> None:\n    with ExitStack() as stack:\n        files = [stack.enter_context(open(f)) for f in filenames]\n        # All files are open here; all closed on exit\n        for f in files:\n            process(f.read())\n\n# Conditional context manager\ndef save_user(user_data: dict, use_transaction: bool = True) -> None:\n    with ExitStack() as stack:\n        conn = stack.enter_context(db.connection())\n        if use_transaction:\n            stack.enter_context(conn.transaction())\n        conn.execute('INSERT INTO users ...', user_data)\n\n# Cleanup callbacks — for non-context-manager resources\ndef setup_resources():\n    with ExitStack() as stack:\n        resource1 = acquire_resource_1()\n        stack.callback(release_resource_1, resource1)   # cleanup registered\n\n        resource2 = acquire_resource_2()  # if this raises,\n        stack.callback(release_resource_2, resource2)   # resource1 still cleaned up\n\n# ExitStack for deferred cleanup pattern\ndef open_with_cleanup(path: str):\n    with ExitStack() as stack:\n        f = stack.enter_context(open(path))\n        cleanup = stack.pop_all()   # transfer cleanup to caller\n    return f, cleanup\n\n# Caller is responsible for cleanup\nf, cleanup = open_with_cleanup('data.txt')\ntry:\n    process(f)\nfinally:\n    cleanup.close()"
                        },
                        {
                            "type": "key_points",
                            "title": "ExitStack patterns",
                            "items": [
                                "ExitStack: dynamic number of context managers, unwound in LIFO order",
                                "enter_context(cm): add a context manager to the stack at runtime",
                                "callback(fn, *args): add non-context-manager cleanup function",
                                "pop_all(): transfer cleanup responsibility to another ExitStack",
                                "Use when N is a variable, or cleanup is conditional on runtime state"
                            ]
                        }
                    ]
                },
                "followup_questions": [
                    "What happens if multiple context managers in an ExitStack raise exceptions?",
                    "How does async with work with AsyncExitStack?",
                    "When would you use contextlib.suppress?"
                ],
                "seo": {
                    "metaTitle": "Python contextlib.ExitStack — Dynamic Context Manager Management",
                    "metaDescription": "Learn contextlib.ExitStack: manage variable numbers of context managers, conditional cleanup, and callback registration for non-context-manager resources."
                },
                "speakable_v2": {
                    "archetype": "A",
                    "pillar": "P01",
                    "hook": "ExitStack solves the problem you hit when you need to manage resources dynamically — when you don't know at write time how many context managers you'll need.",
                    "beats": [
                        {
                            "kind": "problem",
                            "layout": "paragraph",
                            "content": "with open('a') as f1, open('b') as f2 works for a fixed number of files. But what if you're opening N files where N is a function argument? ExitStack lets you push context managers at runtime."
                        },
                        {
                            "kind": "pattern",
                            "layout": "paragraph",
                            "content": "Enter ExitStack with a with statement. Call stack.enter_context(cm) for each resource. On exit, all are cleaned up in reverse order, even if some raised exceptions."
                        },
                        {
                            "kind": "callback",
                            "layout": "paragraph",
                            "content": "stack.callback(fn, *args) registers a cleanup function for resources that aren't context managers — old APIs, C extensions, anything with an explicit close method."
                        }
                    ],
                    "cap": "ExitStack is also useful for conditional context managers: only add the transaction context manager if you're in write mode.",
                    "followup_handoff": "Natural follow-up: AsyncExitStack for async with patterns, or contextlib.suppress.",
                    "tts_overrides": {}
                }
            }
        ]
    }
}

def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)

def write_qa(path: Path, data: list) -> None:
    ensure_dir(path.parent)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  Written: {path}")

def generate_pbi_content():
    print("=== Generating PBI content ===")
    for module_slug, topics in PBI_CONTENT.items():
        module_dir = PBI_BASE / module_slug
        if not module_dir.exists():
            print(f"  WARNING: Module dir missing: {module_dir}")
            continue
        for topic_slug, questions in topics.items():
            topic_dir = module_dir / topic_slug
            qa_file = topic_dir / "complete-qa.json"
            if qa_file.exists():
                print(f"  SKIP (exists): {module_slug}/{topic_slug}")
                continue
            write_qa(qa_file, questions)

if __name__ == "__main__":
    generate_pbi_content()
    print("Done!")
