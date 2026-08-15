#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const contentRoot = join(repoRoot, "content", "dsa");
const outputRoot = join(repoRoot, "docs", "dsa-animation-plan");
const problemOutputRoot = join(outputRoot, "problems");

const engines = [
  {
    id: "array-memory-ledger",
    name: "Array + Memory Ledger",
    world: "stable array cells beside a live hash-map, set, or frequency ledger",
    motion: "move the cursor one cell at a time; animate lookup first and mutation second",
    aha: "what remembering earlier values removes from the future search",
    interaction: "predict lookup result, then reveal the map mutation",
    primitives: ["ArrayTrack", "Pointer", "KeyValueLedger", "InvariantRibbon"],
  },
  {
    id: "candidate-cancellation",
    name: "Candidate Cancellation",
    world: "a current candidate on a podium beside a signed vote balance and uncancelled tokens",
    motion: "pair unlike values as cancellations, replace the candidate only when the balance reaches zero",
    aha: "why cancelling different pairs cannot eliminate a true strict majority",
    interaction: "accept or cancel the next token and predict the surviving candidate",
    primitives: ["TokenStream", "CandidatePodium", "BalanceMeter", "PairingArc"],
  },
  {
    id: "two-pointer-stage",
    name: "Two-Pointer Stage",
    world: "a stable sequence with independently controlled left/right or slow/fast actors",
    motion: "move only the pointer justified by the invariant and dim the discarded region",
    aha: "why one move safely removes many impossible candidates",
    interaction: "choose which pointer moves before revealing the rule",
    primitives: ["ArrayTrack", "Pointer", "DiscardMask", "InvariantRibbon"],
  },
  {
    id: "sliding-window-lens",
    name: "Sliding-Window Lens",
    world: "a translucent window over a string or array with a persistent validity ledger",
    motion: "expand to acquire information and contract only when the invariant permits",
    aha: "why each element enters and leaves at most once",
    interaction: "drag the right edge and decide when the left edge must move",
    primitives: ["SequenceTrack", "Window", "FrequencyLedger", "BestSoFar"],
  },
  {
    id: "prefix-sum-balance",
    name: "Prefix-Sum Balance",
    world: "the original values and a second cumulative track aligned above them",
    motion: "grow the prefix total and connect two prefixes whose difference answers the query",
    aha: "how a range becomes one subtraction or complement lookup",
    interaction: "select a range and watch its two boundary prefixes light up",
    primitives: ["ArrayTrack", "PrefixTrack", "RangeBracket", "KeyValueLedger"],
  },
  {
    id: "difference-array-wave",
    name: "Difference-Array Wave",
    world: "range updates as start/end impulses followed by a reconstruction sweep",
    motion: "drop boundary deltas, then roll a cumulative wave across the final array",
    aha: "why two writes can represent an entire range update",
    interaction: "paint a range and inspect the two delta cells it changes",
    primitives: ["ArrayTrack", "RangeBracket", "DeltaMarker", "PrefixTrack"],
  },
  {
    id: "binary-search-spotlight",
    name: "Binary-Search Spotlight",
    world: "an ordered search space with low, mid, and high markers",
    motion: "collapse the surviving interval while leaving rejected space visible but muted",
    aha: "the predicate that makes half the search space impossible",
    interaction: "vote left/right/found before the interval collapses",
    primitives: ["SearchInterval", "Pointer", "DiscardMask", "PredicatePanel"],
  },
  {
    id: "feasibility-dial",
    name: "Binary Search on the Answer",
    world: "a numeric answer dial paired with a feasibility simulation",
    motion: "test a candidate, run the greedy checker, and tighten the answer range",
    aha: "the monotonic yes/no boundary hidden inside an optimization problem",
    interaction: "guess a candidate answer and run the feasibility check",
    primitives: ["SearchInterval", "CandidateDial", "FeasibilityTrace", "InvariantRibbon"],
  },
  {
    id: "unimodal-probe",
    name: "Unimodal Probe",
    world: "a hill-shaped function with two probes splitting it into thirds",
    motion: "compare the probe heights and fade the slope that cannot contain the optimum",
    aha: "why local slope reveals which side contains the peak",
    interaction: "move the probes and predict the discarded third",
    primitives: ["FunctionPlot", "Probe", "DiscardMask"],
  },
  {
    id: "stack-theatre",
    name: "Stack Theatre",
    world: "tokens entering a visible vertical stack with the top always explicit",
    motion: "push, compare, and pop one causal event at a time",
    aha: "which unresolved work must be remembered in LIFO order",
    interaction: "choose push/pop before the operation executes",
    primitives: ["TokenStream", "Stack", "OperatorPanel", "InvariantRibbon"],
  },
  {
    id: "monotonic-skyline",
    name: "Monotonic Skyline",
    world: "bars on a skyline beside a stack of still-useful candidates",
    motion: "let a stronger bar visibly evict dominated candidates",
    aha: "why every popped item can never help a future answer",
    interaction: "predict how many candidates the new value will pop",
    primitives: ["BarTrack", "Stack", "DominanceArrow", "BoundarySpan"],
  },
  {
    id: "queue-transfer-lab",
    name: "Queue / Transfer Lab",
    world: "front/back queue lanes or two stacks joined by a transfer bridge",
    motion: "enqueue, dequeue, and transfer elements without hiding intermediate state",
    aha: "how the representation preserves FIFO behavior",
    interaction: "perform an operation and inspect its amortized work",
    primitives: ["Queue", "Stack", "TransferBridge", "CostMeter"],
  },
  {
    id: "pointer-rewiring-bench",
    name: "Pointer-Rewiring Bench",
    world: "stable linked-list nodes with named prev/current/next references",
    motion: "freeze the saved pointer, then morph exactly one edge at a time",
    aha: "the pointer that must be saved before an edge is changed",
    interaction: "rewire the next edge and detect a lost sub-list",
    primitives: ["LinkedNode", "Pointer", "EdgeMorph", "LostReferenceWarning"],
  },
  {
    id: "dual-structure-design",
    name: "Coordinated Data-Structure Design",
    world: "two synchronized representations such as a map plus list or array plus index map",
    motion: "run one public operation as a transaction across both structures",
    aha: "the invariant that keeps O(1) operations correct",
    interaction: "call the API and verify both structures after every mutation",
    primitives: ["KeyValueLedger", "LinkedNode", "OperationConsole", "InvariantRibbon"],
  },
  {
    id: "tree-traversal-stage",
    name: "Tree Traversal Stage",
    world: "a fixed tree with an explicit frontier, call stack, and return path",
    motion: "move focus without moving nodes; animate enter, recurse, and return separately",
    aha: "where information flows upward versus downward",
    interaction: "step into a child or return a value to the parent",
    primitives: ["Tree", "TraversalFocus", "CallStack", "ReturnBubble"],
  },
  {
    id: "bst-ordered-corridor",
    name: "BST Ordered Corridor",
    world: "a fixed search tree paired with its persistent inorder strip",
    motion: "project lower/upper bounds through the tree while narrowing the valid corridor",
    aha: "how the global ordering rule constrains every subtree",
    interaction: "choose a branch and inspect the remaining value bounds",
    primitives: ["Tree", "InorderStrip", "BoundBadge", "DiscardMask"],
  },
  {
    id: "tree-construction-workshop",
    name: "Tree Construction Workshop",
    world: "traversal sequences beside an incrementally assembled tree",
    motion: "consume the next root and split or attach the remaining region",
    aha: "which sequence tells root order and which tells subtree boundaries",
    interaction: "place the next node before revealing its legal position",
    primitives: ["SequenceTrack", "Tree", "RangeBracket", "KeyValueLedger"],
  },
  {
    id: "tree-dp-message-passing",
    name: "Tree-DP Message Passing",
    world: "a stable tree where each node sends a compact state vector to its parent",
    motion: "collect child messages, combine them, and optionally reroot the answer",
    aha: "the minimal information a subtree must expose",
    interaction: "compose child states and compare take/skip or path choices",
    primitives: ["Tree", "StateBadge", "ReturnBubble", "ChoiceFork"],
  },
  {
    id: "tree-flattening-map",
    name: "Tree Flattening Map",
    world: "a tree and its Euler-tour array shown side by side",
    motion: "stamp entry/exit times and turn a subtree into a contiguous range",
    aha: "why hierarchical queries can become array range queries",
    interaction: "select a subtree and see its exact flattened interval",
    primitives: ["Tree", "EulerClock", "ArrayTrack", "RangeBracket"],
  },
  {
    id: "ancestor-jump-table",
    name: "Ancestor Jump Table",
    world: "a tree paired with a powers-of-two ancestor table",
    motion: "decompose a jump into binary leaps and highlight each table lookup",
    aha: "how repeated doubling replaces linear climbing",
    interaction: "compose a k-step ancestor jump from powers of two",
    primitives: ["Tree", "JumpArc", "PowerTable", "BitLane"],
  },
  {
    id: "fenwick-lowbit-ladder",
    name: "Fenwick Lowbit Ladder",
    world: "an array, covered ranges, and the implicit BIT parent links",
    motion: "jump by lowbit(i) for updates and strip lowbit(i) for prefix queries",
    aha: "which range each Fenwick cell owns",
    interaction: "toggle index bits to reveal the next update/query jump",
    primitives: ["ArrayTrack", "BitLane", "RangeBracket", "JumpArc"],
  },
  {
    id: "segment-tree-control-room",
    name: "Segment-Tree Control Room",
    world: "an array under a hierarchical set of range aggregates",
    motion: "split queries by overlap and propagate updates back to the root",
    aha: "why only logarithmically many nodes cover a query",
    interaction: "paint a query range and collect the minimal covering nodes",
    primitives: ["ArrayTrack", "SegmentTree", "RangeBracket", "AggregateBubble"],
  },
  {
    id: "heavy-light-path-map",
    name: "Heavy-Light Path Map",
    world: "a tree colored into heavy chains beside its flattened segment-tree lanes",
    motion: "break a path into chain segments and execute one range query per segment",
    aha: "why every light-edge jump at least doubles subtree size",
    interaction: "select two nodes and watch their path decompose",
    primitives: ["Tree", "ChainColor", "ArrayTrack", "SegmentTree"],
  },
  {
    id: "heap-arena",
    name: "Heap Arena",
    world: "a heap tree synchronized with its array and candidate queue",
    motion: "insert/extract at the root and show every swap that repairs the invariant",
    aha: "why only the best candidate needs to be immediately accessible",
    interaction: "choose the next candidate and repair the heap",
    primitives: ["HeapTree", "ArrayTrack", "SwapArc", "CandidateTray"],
  },
  {
    id: "two-heap-balance",
    name: "Two-Heap Balance",
    world: "a max-heap and min-heap on opposite sides of a median fulcrum",
    motion: "route each incoming value, then rebalance across the fulcrum",
    aha: "how two partial orderings expose a streaming median",
    interaction: "place the next value and decide whether rebalancing is required",
    primitives: ["HeapTree", "Fulcrum", "TokenStream", "InvariantRibbon"],
  },
  {
    id: "trie-pathfinder",
    name: "Trie Pathfinder",
    world: "a prefix tree with shared prefixes kept visible",
    motion: "light one character edge at a time and prune dead branches when justified",
    aha: "how shared prefixes eliminate repeated search work",
    interaction: "type a prefix and follow or backtrack the matching path",
    primitives: ["Trie", "CharacterToken", "SearchPath", "PruneMask"],
  },
  {
    id: "grid-frontier",
    name: "Grid Frontier",
    world: "a terrain grid with visited cells, frontier cells, and untouched cells distinct",
    motion: "expand DFS tendrils or BFS waves while keeping the frontier explicit",
    aha: "the exact rule that turns neighboring cells into one component or shortest layer",
    interaction: "choose the next valid neighbor and watch the frontier update",
    primitives: ["Grid", "Frontier", "Queue", "VisitedMask"],
  },
  {
    id: "graph-frontier",
    name: "Graph Frontier",
    world: "a fixed graph beside the queue or recursion stack that drives traversal",
    motion: "expand one edge at a time and stamp distance, parent, or component labels",
    aha: "how frontier plus visited state prevents repeated work, and when queue layers imply shortest distance",
    interaction: "expand the next frontier node and predict newly discovered vertices",
    primitives: ["Graph", "Frontier", "Queue", "DistanceBadge"],
  },
  {
    id: "topological-unlock",
    name: "Topological Unlock",
    world: "a dependency graph with live indegree counters and an unlocked queue",
    motion: "remove a completed node, decrement outgoing neighbors, and unlock zeros",
    aha: "why an empty queue with nodes remaining proves a cycle",
    interaction: "choose an unlocked node and update its dependents",
    primitives: ["Graph", "CounterBadge", "Queue", "UnlockPulse"],
  },
  {
    id: "union-find-merger",
    name: "Union-Find Merger",
    world: "components, parent pointers, and rank/size values in one coordinated view",
    motion: "trace find paths, compress them, then merge roots by rank or size",
    aha: "how compression changes future cost without changing membership",
    interaction: "connect two nodes and inspect the resulting parent forest",
    primitives: ["Graph", "ParentForest", "PathCompression", "StateBadge"],
  },
  {
    id: "dijkstra-distance-lab",
    name: "Dijkstra Distance Lab",
    world: "a weighted graph, tentative-distance table, and priority queue",
    motion: "extract the best candidate, relax edges, and visibly discard stale entries",
    aha: "why a finalized shortest distance cannot improve with non-negative edges",
    interaction: "choose the next queue item and perform its relaxations",
    primitives: ["WeightedGraph", "DistanceTable", "HeapTree", "RelaxationPulse"],
  },
  {
    id: "bellman-ford-sweeps",
    name: "Bellman-Ford Sweeps",
    world: "a weighted edge list beside a distance table organized by passes",
    motion: "sweep every edge, pulse successful relaxations, and compare the extra cycle pass",
    aha: "why paths with at most k edges are solved after k passes",
    interaction: "run one full relaxation pass and predict whether another is needed",
    primitives: ["WeightedGraph", "EdgeList", "DistanceTable", "PassCounter"],
  },
  {
    id: "floyd-warshall-matrix",
    name: "Floyd-Warshall Matrix",
    world: "a graph beside an all-pairs distance matrix",
    motion: "open one intermediate node k and update every i,j cell through it",
    aha: "the DP meaning of allowing only the first k intermediates",
    interaction: "select k and inspect which matrix cells improve",
    primitives: ["WeightedGraph", "Matrix", "IntermediateGate", "RelaxationPulse"],
  },
  {
    id: "mst-edge-market",
    name: "Minimum-Spanning-Tree Edge Market",
    world: "weighted candidate edges competing to join a growing forest",
    motion: "accept the cheapest safe edge and reject edges that create a cycle",
    aha: "the cut/cycle reason a local edge choice stays globally safe",
    interaction: "approve or reject the next edge, then reveal the proof",
    primitives: ["WeightedGraph", "CandidateTray", "ParentForest", "ProofRibbon"],
  },
  {
    id: "graph-coloring-studio",
    name: "Graph Coloring Studio",
    world: "a graph with two color palettes and conflict edges",
    motion: "propagate the opposite color across each component and flag contradictions",
    aha: "why an odd cycle makes two-coloring impossible",
    interaction: "color the next node and detect a conflict",
    primitives: ["Graph", "ColorBadge", "Queue", "ConflictPulse"],
  },
  {
    id: "rerooting-lens",
    name: "Rerooting Lens",
    world: "a tree with directed parent-child contribution arrows",
    motion: "compute downward answers, move the root across one edge, and repair contributions",
    aha: "what changes locally and what can be reused when the root moves",
    interaction: "drag the root to a neighbor and recompute only affected state",
    primitives: ["Tree", "ContributionArrow", "StateBadge", "RootMarker"],
  },
  {
    id: "decision-tree-backtracker",
    name: "Decision-Tree Backtracker",
    world: "the concrete board/string plus a parallel choose-recurse-undo tree",
    motion: "commit one choice, descend, hit success/dead-end, then visibly undo",
    aha: "the constraint that prunes an entire branch",
    interaction: "choose the next candidate and predict whether it survives",
    primitives: ["DecisionTree", "ChoiceToken", "UndoTrail", "ConstraintPanel"],
  },
  {
    id: "constraint-board",
    name: "Constraint Board",
    world: "a board with candidate sets and row/column/region constraints",
    motion: "remove candidates as constraints propagate, then branch only when needed",
    aha: "which constraint causes the decisive prune",
    interaction: "place a candidate and inspect all propagated consequences",
    primitives: ["Grid", "CandidateSet", "ConstraintPanel", "UndoTrail"],
  },
  {
    id: "greedy-choice-frontier",
    name: "Greedy Choice Frontier",
    world: "sorted candidates approaching a best-so-far frontier",
    motion: "accept or reject each local choice while the safety invariant remains visible",
    aha: "the exchange argument that proves the choice can be part of an optimum",
    interaction: "make the local choice before the proof is revealed",
    primitives: ["CandidateTray", "Frontier", "BestSoFar", "ProofRibbon"],
  },
  {
    id: "interval-timeline",
    name: "Interval Timeline",
    world: "interval bars on a shared time axis with endpoints and active resources visible",
    motion: "sort, sweep, merge, allocate, or discard at endpoint events",
    aha: "which endpoint rule captures overlap and compatibility",
    interaction: "drag an interval onto the timeline and decide merge/room/reject",
    primitives: ["Timeline", "IntervalBar", "Endpoint", "ResourceLane"],
  },
  {
    id: "dp-one-dimensional",
    name: "1D DP State Conveyor",
    world: "state cells ordered by subproblem size with dependency arrows",
    motion: "compare choices, compute the recurrence, and commit one new state",
    aha: "the smallest state that contains everything the future needs",
    interaction: "choose the recurrence inputs and commit the next cell",
    primitives: ["StateTrack", "DependencyArrow", "ChoiceFork", "CommitPulse"],
  },
  {
    id: "dp-matrix",
    name: "2D DP Matrix",
    world: "a matrix whose axes explain the two state dimensions",
    motion: "focus one cell, pull values from legal predecessors, and commit the result",
    aha: "what dp[i][j] means before any recurrence is shown",
    interaction: "select predecessor cells and calculate the focused state",
    primitives: ["Matrix", "DependencyArrow", "StateDefinition", "CommitPulse"],
  },
  {
    id: "knapsack-capacity-lab",
    name: "Knapsack Capacity Lab",
    world: "items beside capacity lanes and take/skip branches",
    motion: "compare excluding versus including an item and update reachable/best capacities",
    aha: "why capacity direction prevents reusing an item in 0/1 variants",
    interaction: "take or skip the current item and inspect affected capacities",
    primitives: ["ItemTray", "CapacityTrack", "ChoiceFork", "DependencyArrow"],
  },
  {
    id: "interval-dp-splitter",
    name: "Interval-DP Splitter",
    world: "a sequence with expanding interval brackets and candidate split points",
    motion: "grow interval length, try each split, and preserve the best composition",
    aha: "why every complete solution has one final split or boundary choice",
    interaction: "choose the final split and compare subinterval totals",
    primitives: ["SequenceTrack", "RangeBracket", "SplitMarker", "Matrix"],
  },
  {
    id: "bitmask-state-cube",
    name: "Bitmask State Cube",
    world: "subset states as lit bits linked to reachable next masks",
    motion: "toggle one choice bit and propagate values across the subset lattice",
    aha: "how one integer represents an entire chosen set",
    interaction: "toggle a bit and inspect newly reachable states",
    primitives: ["BitLane", "SubsetLattice", "StateBadge", "TransitionArrow"],
  },
  {
    id: "digit-dp-automaton",
    name: "Digit-DP Automaton",
    world: "a digit track above memoized states for position, tightness, started-state, and problem-specific counts",
    motion: "branch over legal next digits, preserve or release the tight bound, and merge identical suffix states",
    aha: "why many numeric prefixes become the same remaining subproblem",
    interaction: "choose the next digit and update the tight/started flags",
    primitives: ["DigitTrack", "StateCard", "BoundBadge", "MemoLedger"],
  },
  {
    id: "lis-patience-table",
    name: "LIS Patience Table",
    world: "the input sequence above evolving tails/piles and predecessor links",
    motion: "binary-search the replacement pile and update the minimal tail",
    aha: "why tails are possibilities, not necessarily the final subsequence",
    interaction: "place the next value into its pile and reconstruct one LIS",
    primitives: ["SequenceTrack", "Pile", "SearchInterval", "PredecessorArrow"],
  },
  {
    id: "merge-sort-studio",
    name: "Merge-Sort Studio",
    world: "a stable array split into recursive lanes with a merge workbench",
    motion: "split ranges, compare two front elements, and stitch the sorted result",
    aha: "where cross-half inversions are counted during merge",
    interaction: "choose the next merge element and update the counter",
    primitives: ["ArrayTrack", "RangeBracket", "MergeLane", "CounterBadge"],
  },
  {
    id: "partition-workbench",
    name: "Partition / Selection Workbench",
    world: "an array with pivot, less/equal/greater regions, and swap arcs",
    motion: "classify one value at a time and grow the pivot's final region",
    aha: "why one partition can discard an entire side for selection",
    interaction: "classify the focused value and perform the swap",
    primitives: ["ArrayTrack", "Pivot", "RegionBand", "SwapArc"],
  },
  {
    id: "counting-buckets",
    name: "Counting-Bucket Factory",
    world: "input tokens feeding frequency buckets and a stable output conveyor",
    motion: "count, prefix positions when needed, then emit values in order",
    aha: "how a bounded key range replaces comparison sorting",
    interaction: "drop the next token into its bucket and rebuild the output",
    primitives: ["TokenStream", "Bucket", "PrefixTrack", "OutputLane"],
  },
  {
    id: "bitwise-circuit",
    name: "Bitwise Circuit",
    world: "aligned bit lanes flowing through XOR, AND, shift, and carry gates",
    motion: "transform one bit position at a time while decimal values stay visible",
    aha: "the bit identity that removes branching or extra memory",
    interaction: "toggle input bits and predict the gate output",
    primitives: ["BitLane", "LogicGate", "CarryToken", "DecimalMirror"],
  },
  {
    id: "string-token-conveyor",
    name: "String Token Conveyor",
    world: "characters as addressable tokens with parser state and output buffer",
    motion: "consume one character, update the state machine, and emit only justified output",
    aha: "the parsing state required to handle boundaries and malformed input",
    interaction: "feed the next character and choose the state transition",
    primitives: ["CharacterTrack", "StateMachine", "OutputLane", "InvariantRibbon"],
  },
  {
    id: "string-matching-lab",
    name: "String-Matching Lab",
    world: "pattern and text tracks with prefix/Z/hash state aligned below",
    motion: "shift or reuse prior match information instead of restarting comparisons",
    aha: "the previously matched structure that makes the search linear",
    interaction: "advance a mismatch and choose the correct fallback",
    primitives: ["CharacterTrack", "AlignmentTrack", "PrefixTrack", "FallbackArc"],
  },
  {
    id: "palindrome-expansion",
    name: "Palindrome Expansion Lab",
    world: "a character track with mirrored pointers and reusable radius information",
    motion: "expand around centers, mirror known radii, and update the right boundary",
    aha: "why symmetry can skip comparisons already proved elsewhere",
    interaction: "choose a center and predict its mirrored radius",
    primitives: ["CharacterTrack", "MirrorAxis", "RadiusArc", "BoundarySpan"],
  },
  {
    id: "suffix-array-laboratory",
    name: "Suffix Array + LCP Laboratory",
    world: "all suffixes as sortable ribbons beside rank-doubling and LCP tracks",
    motion: "sort by doubled rank pairs, then scan adjacent suffixes for shared prefixes",
    aha: "why equal-prefix substrings become neighboring suffixes",
    interaction: "rank one doubling round and inspect newly adjacent suffixes",
    primitives: ["SuffixRibbon", "RankTable", "SortLane", "LCPTrack"],
  },
  {
    id: "number-theory-workbench",
    name: "Number-Theory Workbench",
    world: "numbers decomposed into factors, residues, or recurrence states",
    motion: "apply one algebraic reduction while keeping the invariant equation visible",
    aha: "the identity that turns a huge numeric task into repeated smaller ones",
    interaction: "perform the next reduction and verify the invariant",
    primitives: ["NumberLine", "FactorTile", "EquationRibbon", "StateBadge"],
  },
  {
    id: "geometry-slope-lab",
    name: "Geometry Slope Lab",
    world: "an anchor point with rays to other points and a ledger of normalized rational slopes",
    motion: "rotate through anchors, reduce each dx/dy pair by gcd, and grow the largest collinear bucket",
    aha: "why normalized integer slope pairs avoid floating-point and sign errors",
    interaction: "normalize the next ray and place it into the matching slope bucket",
    primitives: ["CoordinatePlane", "Ray", "EquationRibbon", "KeyValueLedger"],
  },
  {
    id: "sieve-elimination-field",
    name: "Sieve Elimination Field",
    world: "integers on a grid with base primes and composite strike paths",
    motion: "start at the mathematically correct multiple and eliminate in waves",
    aha: "why earlier primes already handled smaller multiples",
    interaction: "select a prime and predict its first new composite",
    primitives: ["NumberGrid", "PrimeMarker", "StrikeWave", "RangeBracket"],
  },
  {
    id: "euclidean-reduction",
    name: "Euclidean Reduction",
    world: "two number bars and the remainder equation they produce",
    motion: "replace (a,b) with (b,a mod b) and optionally replay substitutions backward",
    aha: "why the set of common divisors is preserved",
    interaction: "compute the next remainder and back-substitute coefficients",
    primitives: ["NumberBar", "EquationRibbon", "RemainderBlock", "CallStack"],
  },
  {
    id: "matrix-simulation",
    name: "Matrix Simulation Studio",
    world: "a coordinate grid with direction, boundary, and staged cell states",
    motion: "apply one spatial rule per frame and preserve simultaneous updates when required",
    aha: "the boundary or encoding trick that prevents overwritten state",
    interaction: "advance one move/generation and inspect affected neighbors",
    primitives: ["Grid", "DirectionCompass", "BoundaryBox", "StateLegend"],
  },
  {
    id: "math-derivation-canvas",
    name: "Math Derivation Canvas",
    world: "a concrete example beside a symbolic equation and geometric/counting model",
    motion: "morph repeated work into the closed form or recurrence",
    aha: "where each term of the formula comes from",
    interaction: "change the input and verify the derivation still holds",
    primitives: ["EquationRibbon", "NumberLine", "CounterBadge", "ExamplePanel"],
  },
  {
    id: "fft-butterfly",
    name: "FFT Butterfly",
    world: "coefficient and value representations connected by even/odd butterfly stages",
    motion: "split, combine roots-of-unity pairs, multiply pointwise, then invert",
    aha: "why convolution becomes pointwise multiplication after evaluation",
    interaction: "run one butterfly stage and inspect phase/degree changes",
    primitives: ["PolynomialTrack", "ButterflyGraph", "ComplexPlane", "StageCounter"],
  },
  {
    id: "state-space-explorer",
    name: "State-Space Explorer",
    world: "compressed states as nodes with legal moves as generated edges",
    motion: "expand BFS layers or heuristic candidates without drawing the entire graph upfront",
    aha: "the canonical encoding that avoids revisiting equivalent states",
    interaction: "make one legal move and see its encoded successor",
    primitives: ["StateCard", "Frontier", "MoveEdge", "VisitedLedger"],
  },
  {
    id: "simulation-state-machine",
    name: "Simulation State Machine",
    world: "the problem world beside explicit control state and an event timeline",
    motion: "consume one event, apply the rule, and snapshot the resulting state",
    aha: "the compact state that makes every transition deterministic",
    interaction: "trigger the next event and predict the transition",
    primitives: ["WorldPanel", "StateMachine", "EventTimeline", "StateBadge"],
  },
];

const engineById = new Map(engines.map((engine) => [engine.id, engine]));

const rules = [
  [/fft|polynomial/, "fft-butterfly"],
  [/suffix-array|\blcp\b/, "suffix-array-laboratory"],
  [/manacher/, "palindrome-expansion"],
  [/prefix-function|z-function|rolling-hash|string-matching/, "string-matching-lab"],
  [/heavy-light-decomposition/, "heavy-light-path-map"],
  [/fenwick-tree|binary-indexed-tree/, "fenwick-lowbit-ladder"],
  [/segment-tree/, "segment-tree-control-room"],
  [/binary-lifting|sparse-table/, "ancestor-jump-table"],
  [/euler-tour/, "tree-flattening-map"],
  [/rerooting/, "rerooting-lens"],
  [/tree-dp/, "tree-dp-message-passing"],
  [/centroid/, "tree-dp-message-passing"],
  [/tree-construction/, "tree-construction-workshop"],
  [/\bbst\b/, "bst-ordered-corridor"],
  [/floyd-warshall|all-pairs/, "floyd-warshall-matrix"],
  [/bellman-ford/, "bellman-ford-sweeps"],
  [/dijkstra/, "dijkstra-distance-lab"],
  [/\bmst\b|kruskal|\bprim\b/, "mst-edge-market"],
  [/topological-sort/, "topological-unlock"],
  [/union-find|disjoint-set/, "union-find-merger"],
  [/graph-coloring/, "graph-coloring-studio"],
  [/digit-dp/, "digit-dp-automaton"],
  [/dp-on-bitmask|sos-dp|bitmask.*dynamic/, "bitmask-state-cube"],
  [/interval-dp|matrix-chain|boolean-parenthesization/, "interval-dp-splitter"],
  [/knapsack|subset-sum|coin-change|unbounded-knapsack/, "knapsack-capacity-lab"],
  [/longest-increasing-subsequence|\blis\b/, "lis-patience-table"],
  [/longest-common-subsequence|2d-dp|edit-distance|wildcard-matching/, "dp-matrix"],
  [/dynamic-programming|memoization|recurrence|tribonacci|kadane/, "dp-one-dimensional"],
  [/decision-tree-backtracker-never-match/, "decision-tree-backtracker"],
  [/n-queens|sudoku|crossword|constraint-satisfaction/, "constraint-board"],
  [/backtracking|state-space-search|include-exclude|permutations/, "decision-tree-backtracker"],
  [/trie/, "trie-pathfinder"],
  [/two-heaps|running-median|median-from-data-stream/, "two-heap-balance"],
  [/\bheap\b|priority/, "heap-arena"],
  [/lru-cache|insert-delete-getrandom|design/, "dual-structure-design"],
  [/linked-list|pointer-rewiring|in-place-reversal/, "pointer-rewiring-bench"],
  [/monotonic-stack|previous-greater|previous-smaller|stock-span|largest-rectangle|poisonous-plants/, "monotonic-skyline"],
  [/queue-using-two-stacks|queue using two stacks/, "queue-transfer-lab"],
  [/\bstack\b|brackets|calculator|reverse-polish|simplify-path/, "stack-theatre"],
  [/binary-search-on-answer|allocate-minimum|aggressive-cows|painter|koko/, "feasibility-dial"],
  [/ternary-search|unimodal/, "unimodal-probe"],
  [/binary-search|boundary-search|quickselect/, "binary-search-spotlight"],
  [/difference-array|array-manipulation/, "difference-array-wave"],
  [/prefix-sum|prefix-sums|running-total|equilibrium/, "prefix-sum-balance"],
  [/sliding-window|substring-without-repeating|minimum-window/, "sliding-window-lens"],
  [/two-pointers|two-pointer|fast-slow|floyd-cycle/, "two-pointer-stage"],
  [/merge-sort|counting-inversions/, "merge-sort-studio"],
  [/quickselect|quicksort|partition/, "partition-workbench"],
  [/counting-sort|bucket-sort|frequency-array|stable-sort/, "counting-buckets"],
  [/intervals|interval-merging|interval-covering|meeting-rooms|activity-selection/, "interval-timeline"],
  [/bit-manipulation|bit-tricks|\bxor\b|gray-code/, "bitwise-circuit"],
  [/sieve|prime-sieve/, "sieve-elimination-field"],
  [/euclidean-algorithm|gcd|extended-euclidean/, "euclidean-reduction"],
  [/number-theory|modular-arithmetic|combinatorics|factorial-number-system|primality/, "number-theory-workbench"],
  [/matrix|grid|game-of-life|spiral|rotate-image/, "matrix-simulation"],
  [/shortest-path|\bbfs\b|multi-source|implicit-graph/, "graph-frontier"],
  [/\bdfs\b|connected-components|\bgraph\b|cycle-detection/, "graph-frontier"],
  [/greedy/, "greedy-choice-frontier"],
  [/simulation|state-machine|circular-array|undo-with-state-snapshots/, "simulation-state-machine"],
  [/string|palindrome|subsequence/, "string-token-conveyor"],
  [/hash-map|hash-set|frequency-count|counting/, "array-memory-ledger"],
  [/sorting/, "merge-sort-studio"],
  [/math|closed-form|digit-extraction|digital-root/, "math-derivation-canvas"],
];

const titleOverrides = new Map([
  ["valid-sudoku", "constraint-board"],
  ["majority-element", "candidate-cancellation"],
  ["arrays-left-rotation", "two-pointer-stage"],
  ["trapping-rain-water", "two-pointer-stage"],
  ["find-the-duplicate-number", "two-pointer-stage"],
  ["maximum-subarray-sum-modulo", "prefix-sum-balance"],
  ["max-points-on-a-line", "geometry-slope-lab"],
  ["queue-using-two-stacks", "queue-transfer-lab"],
  ["number-of-islands", "grid-frontier"],
  ["pacific-atlantic-water-flow", "grid-frontier"],
  ["rotting-oranges", "grid-frontier"],
  ["surrounded-regions", "grid-frontier"],
  ["castle-on-the-grid", "grid-frontier"],
  ["word-search", "decision-tree-backtracker"],
  ["word-search-ii", "trie-pathfinder"],
  ["binary-tree-traversal", "tree-traversal-stage"],
  ["binary-tree-level-order-traversal", "tree-traversal-stage"],
  ["binary-tree-right-side-view", "tree-traversal-stage"],
  ["maximum-depth-of-binary-tree", "tree-traversal-stage"],
  ["same-tree", "tree-traversal-stage"],
  ["invert-binary-tree", "tree-traversal-stage"],
  ["balanced-binary-tree", "tree-traversal-stage"],
  ["diameter-of-binary-tree", "tree-dp-message-passing"],
  ["binary-tree-maximum-path-sum", "tree-dp-message-passing"],
  ["lowest-common-ancestor-of-a-binary-tree", "tree-traversal-stage"],
  ["swap-nodes-algo", "tree-traversal-stage"],
  ["swap-nodes-algo-duplicate", "tree-traversal-stage"],
  ["gena-playing-hanoi", "state-space-explorer"],
  ["tower-of-hanoi", "decision-tree-backtracker"],
  ["huffman-encoding", "heap-arena"],
  ["tree-huffman-decoding", "tree-traversal-stage"],
  ["minimum-swaps-2", "simulation-state-machine"],
  ["dynamic-array", "simulation-state-machine"],
  ["simple-text-editor", "simulation-state-machine"],
  ["truck-tour", "greedy-choice-frontier"],
  ["find-median-from-data-stream", "two-heap-balance"],
  ["find-the-running-median", "two-heap-balance"],
  ["longest-palindromic-substring-manacher", "palindrome-expansion"],
  ["longest-palindromic-substring", "palindrome-expansion"],
  ["palindromic-substrings", "palindrome-expansion"],
  ["rotate-image", "matrix-simulation"],
  ["spiral-matrix", "matrix-simulation"],
  ["set-matrix-zeroes", "matrix-simulation"],
  ["game-of-life", "matrix-simulation"],
]);

const goldenSlugs = new Set([
  "two-sum",
  "three-sum",
  "minimum-window-substring",
  "product-of-array-except-self",
  "search-in-rotated-sorted-array",
  "valid-parentheses",
  "daily-temperatures",
  "reverse-linked-list",
  "lru-cache",
  "binary-tree-traversal",
  "validate-binary-search-tree",
  "top-k-frequent-elements",
  "find-median-from-data-stream",
  "implement-trie",
  "number-of-islands",
  "rotting-oranges",
  "course-schedule",
  "graph-valid-tree",
  "dijkstras-shortest-path",
  "bellman-ford-shortest-path",
  "floyd-warshall-all-pairs-shortest-path",
  "kruskals-minimum-spanning-tree",
  "n-queens",
  "word-search",
  "merge-intervals",
  "house-robber",
  "coin-change",
  "longest-common-subsequence",
  "zero-one-knapsack",
  "longest-increasing-subsequence",
  "count-inversions",
  "kth-largest-element-via-quickselect",
  "single-number",
  "sieve-of-eratosthenes",
]);

function display(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeText(problemIndex) {
  return [
    problemIndex.slug,
    problemIndex.title,
    problemIndex.category,
    ...(problemIndex.patterns ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function chooseEngine(problemIndex) {
  const override = titleOverrides.get(problemIndex.slug);
  if (override) return override;
  const haystack = normalizeText(problemIndex);
  if (problemIndex.category === "backtracking") {
    return /n-queens|crossword|constraint-satisfaction/.test(haystack)
      ? "constraint-board"
      : "decision-tree-backtracker";
  }
  if (problemIndex.category === "tries") return "trie-pathfinder";
  if (problemIndex.category === "trees") {
    const treeRules = [
      [/heavy-light-decomposition/, "heavy-light-path-map"],
      [/euler-tour/, "tree-flattening-map"],
      [/fenwick-tree|binary-indexed-tree/, "fenwick-lowbit-ladder"],
      [/segment-tree/, "segment-tree-control-room"],
      [/binary-lifting|sparse-table/, "ancestor-jump-table"],
      [/rerooting/, "rerooting-lens"],
      [/tree-dp|subtree-size|maximum-path|diameter|centroid/, "tree-dp-message-passing"],
      [/tree-construction|construct|swap nodes/, "tree-construction-workshop"],
      [/\bbst\b/, "bst-ordered-corridor"],
    ];
    for (const [pattern, engineId] of treeRules) {
      if (pattern.test(haystack)) return engineId;
    }
    return "tree-traversal-stage";
  }
  for (const [pattern, engineId] of rules) {
    if (pattern.test(haystack)) return engineId;
  }
  if (problemIndex.category === "trees") return "tree-traversal-stage";
  if (problemIndex.category === "graphs") return "graph-frontier";
  if (problemIndex.category === "backtracking") return "decision-tree-backtracker";
  if (problemIndex.category === "math-geometry") return "math-derivation-canvas";
  if (problemIndex.category === "strings") return "string-token-conveyor";
  return "array-memory-ledger";
}

function chooseSecondaryEngine(problemIndex, primaryId) {
  const candidates = [];
  const text = normalizeText(problemIndex);
  const add = (condition, engineId) => {
    if (condition && engineId !== primaryId && !candidates.includes(engineId)) candidates.push(engineId);
  };
  add(/hash-map|hash-set|frequency/.test(text), "array-memory-ledger");
  add(/\bheap\b|priority/.test(text), "heap-arena");
  add(/two-pointer|two-pointers/.test(text), "two-pointer-stage");
  add(/binary-search/.test(text), "binary-search-spotlight");
  add(/\bdfs\b|\bbfs\b/.test(text), problemIndex.category === "graphs" ? "graph-frontier" : "grid-frontier");
  add(/dynamic-programming/.test(text), "dp-one-dimensional");
  add(/greedy/.test(text), "greedy-choice-frontier");
  add(/sorting/.test(text), "merge-sort-studio");
  return candidates[0] ?? null;
}

function escapeTableCell(value) {
  return String(value ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactInput(value, max = 110) {
  const singleLine = String(value ?? "")
    .replaceAll("\n", " ")
    .replace(/\s+/g, " ")
    .trim();
  return singleLine.length > max ? `${singleLine.slice(0, max - 1)}…` : singleLine;
}

function hasApproachFeature(problem, predicate) {
  return (problem.approaches ?? []).some(predicate);
}

function createPlan(problemIndex, problem) {
  const engineId = chooseEngine(problemIndex);
  const engine = engineById.get(engineId);
  if (!engine) throw new Error(`Unknown engine ${engineId} for ${problemIndex.slug}`);
  const secondaryEngineId = chooseSecondaryEngine(problemIndex, engineId);
  const secondaryEngine = secondaryEngineId ? engineById.get(secondaryEngineId) : null;
  const exampleInput = compactInput(problem.examples?.[0]?.input || "Use the smallest non-trivial authored example");
  const focus = (problemIndex.patterns ?? []).slice(0, 3).map(display).join(" + ");
  const optimalApproach = problem.approaches?.at(-1)?.name ?? "the authored optimal approach";
  const storyboard = [
    `Build the authored example: ${exampleInput}.`,
    `Name the target approach, ${optimalApproach}, and establish the ${focus || display(problemIndex.category)} invariant before moving anything.`,
    `Use ${engine.name}: ${engine.motion}.`,
    `Pause for the learner to ${engine.interaction}.`,
    `Reveal ${engine.aha}, then synchronize the same state with the active Java/Python lines and dry-run row.`,
    `Finish with one authored edge case or common mistake as a counterexample replay.`,
  ];
  return {
    slug: problemIndex.slug,
    title: problemIndex.title,
    difficulty: problemIndex.difficulty,
    category: problemIndex.category,
    moduleSlug: problemIndex.moduleSlug,
    patterns: problemIndex.patterns ?? [],
    primaryEngine: engineId,
    primaryEngineName: engine.name,
    secondaryEngine: secondaryEngineId,
    secondaryEngineName: secondaryEngine?.name ?? null,
    visualWorld: engine.world,
    optimalApproach,
    explanationPlan: `Teach the authored optimal approach, ${optimalApproach}, inside ${engine.world}; ${engine.motion}. The decisive moment is ${engine.aha}.`,
    learnerInteraction: engine.interaction,
    storyboard,
    sourceReadiness: {
      approaches: problem.approaches?.length ?? 0,
      hasDryRun: hasApproachFeature(problem, (approach) => Boolean(approach.dryRun?.steps?.length)),
      hasDiagram: Boolean(problem.diagrams?.length) || hasApproachFeature(problem, (approach) => Boolean(approach.diagrams?.length)),
      hasJava: hasApproachFeature(problem, (approach) => Boolean(approach.code?.java)),
      hasPython: hasApproachFeature(problem, (approach) => Boolean(approach.code?.python)),
      hasLineByLine: hasApproachFeature(problem, (approach) => Boolean(approach.lineByLine)),
    },
    rolloutWave: goldenSlugs.has(problemIndex.slug)
      ? 1
      : problemIndex.difficulty === "hard" || /heavy-light|fft|suffix-array|manacher|digit-dp/.test(normalizeText(problemIndex))
        ? 3
        : 2,
  };
}

function renderEngineCatalog() {
  const lines = [
    "# Visual engine catalog",
    "",
    `This catalog contains ${engines.length} composable engines. The original master specification described broad families; this catalog adds specialized engines for advanced strings, range-query trees, state-space search, parsing, and number theory found in the repository's real problem set.`,
    "",
    "An engine is not a finished problem animation. It is a reusable visual grammar made from smaller primitives. A problem blueprint supplies the real input, frames, invariants, code anchors, explanation anchors, and edge cases.",
    "",
    "| ID | Engine | Persistent world | Causal motion | Learner interaction |",
    "| --- | --- | --- | --- | --- |",
  ];
  for (const engine of engines) {
    lines.push(
      `| \`${engine.id}\` | ${escapeTableCell(engine.name)} | ${escapeTableCell(engine.world)} | ${escapeTableCell(engine.motion)} | ${escapeTableCell(engine.interaction)} |`,
    );
  }
  lines.push("", "## Primitive contract", "");
  lines.push(
    "Every engine composes typed primitives rather than drawing arbitrary illustrations. Primitives receive immutable frame state and expose semantic labels for screen readers. The first implementation set should include array/string tracks, pointers, maps/sets, stacks/queues, trees/graphs, grids, matrices, heaps, intervals, bit lanes, equation ribbons, choice forks, and code/dry-run anchors.",
    "",
    "Every transition must answer one question: what algorithmic fact changed, and which exact code line caused it?",
    "",
  );
  return lines.join("\n");
}

function renderCategory(category, plans) {
  const lines = [
    `# ${display(category)} animation plan`,
    "",
    `${plans.length} canonical problems from \`content/dsa/_index.json\`. Each row names the primary reusable engine and the concrete explanation direction. Full storyboards and readiness metadata live in \`../problem-animation-matrix.json\`.`,
    "",
    "| Problem | Difficulty | Primary engine | Supporting engine | How we explain it | Learner action | Wave |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const plan of plans) {
    lines.push(
      `| ${escapeTableCell(plan.title)} | ${plan.difficulty} | ${escapeTableCell(plan.primaryEngineName)} | ${escapeTableCell(plan.secondaryEngineName ?? "—")} | ${escapeTableCell(plan.explanationPlan)} | ${escapeTableCell(plan.learnerInteraction)} | ${plan.rolloutWave} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const index = JSON.parse(await readFile(join(contentRoot, "_index.json"), "utf8"));
  const plans = [];
  for (const problemIndex of index.problems) {
    const sourcePath = join(contentRoot, problemIndex.category, `${problemIndex.slug}.json`);
    const problem = JSON.parse(await readFile(sourcePath, "utf8"));
    plans.push(createPlan(problemIndex, problem));
  }

  plans.sort((a, b) =>
    a.category.localeCompare(b.category) || a.title.localeCompare(b.title),
  );

  await mkdir(problemOutputRoot, { recursive: true });
  await writeFile(
    join(outputRoot, "problem-animation-matrix.json"),
    `${JSON.stringify({ generatedFrom: "content/dsa/_index.json", problemCount: plans.length, engineCount: engines.length, problems: plans }, null, 2)}\n`,
  );
  await writeFile(join(outputRoot, "ENGINE_CATALOG.md"), renderEngineCatalog());

  const grouped = Map.groupBy(plans, (plan) => plan.category);
  for (const [category, categoryPlans] of grouped) {
    await writeFile(join(problemOutputRoot, `${category}.md`), renderCategory(category, categoryPlans));
  }

  const coverage = {
    problems: plans.length,
    enginesUsed: new Set(plans.map((plan) => plan.primaryEngine)).size,
    wave1: plans.filter((plan) => plan.rolloutWave === 1).length,
    wave2: plans.filter((plan) => plan.rolloutWave === 2).length,
    wave3: plans.filter((plan) => plan.rolloutWave === 3).length,
    dryRuns: plans.filter((plan) => plan.sourceReadiness.hasDryRun).length,
    diagrams: plans.filter((plan) => plan.sourceReadiness.hasDiagram).length,
    java: plans.filter((plan) => plan.sourceReadiness.hasJava).length,
    python: plans.filter((plan) => plan.sourceReadiness.hasPython).length,
    lineByLine: plans.filter((plan) => plan.sourceReadiness.hasLineByLine).length,
  };
  await writeFile(join(outputRoot, "coverage.json"), `${JSON.stringify(coverage, null, 2)}\n`);
  console.log(JSON.stringify(coverage, null, 2));
}

await main();
