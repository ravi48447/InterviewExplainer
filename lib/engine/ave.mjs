/**
 * ave.mjs — Answer Verification Engine. Deterministic, rubric-grounded.
 * No LLM: scores a candidate transcript against the authored content rubric.
 *
 * verifyTurn(transcript, rubric, opts) -> {
 *   score 0..100, coverage{hit,missed}, depth, structure, communication,
 *   mistakeFlags[], signal, suggested{spoken,deep,checklist}, nextDrills[]
 * }
 */

import { tokenize, termFreq, tfidf, cosine, bm25, variants, canon, stemMatch } from './text.mjs';

export const ALIASES = {
  'dependency-injection': ['di', 'ioc', 'inversion of control'],
  'garbage-collection': ['gc'],
  'n-plus-one': ['n 1 query', 'n+1', 'n 1 problem'],
  'active-record': ['orm', 'ar pattern'],
  'caching': ['cache', 'cached'],
  'authentication': ['auth', 'login', 'sign in'],
  'authorization': ['authz', 'permissions', 'acl'],
  'sql-injection': ['sqli', 'injection attack'],
  'background-jobs': ['async jobs', 'workers', 'queue jobs', 'sidekiq'],
  'api': ['endpoint', 'rest api'],
  'database': ['db', 'postgres', 'mysql', 'sql database'],
  'index': ['indexes', 'db index', 'b tree index'],
  'thread-safety': ['thread safe', 'concurrent', 'concurrency'],
  'testing': ['unit test', 'tests', 'spec', 'tdd'],
  'middleware': ['rack middleware', 'request pipeline'],
  'serialization': ['json serialization', 'to json'],
  'load-balancer': ['lb', 'load balancer'],
  'replication': ['read replica', 'replicas'],
  'sharding': ['partitioning', 'horizontal scaling db'],
  'json': ['json format'],
  'http': ['http protocol', 'hyper text transfer protocol'],
  'idempotent': ['idempotency', 'idempotence'],
  'migration': ['schema migration', 'db migration'],
  'scaffold': ['generator', 'rails g'],
  'convention-over-configuration': ['coc', 'convention over configuration'],
  'spa': ['single page application'],
  'ssr': ['server side rendering', 'server rendered'],
  'state-management': ['state mgmt', 'store'],
  'virtual-dom': ['vdom', 'virtual dom'],
  'diffing': ['diff', 'reconciliation'],
  'hooks': ['react hooks', 'usestate', 'useeffect'],
  'props': ['properties', 'prop passing'],
  'jwt': ['json web token'],
  'oauth': ['oauth2', 'oauth 2'],
  'csrf': ['cross site request forgery'],
  'xss': ['cross site scripting'],
  'cors': ['cross origin resource sharing'],
  'deadlock': ['deadlocks', 'lock ordering'],
  'mutex': ['lock', 'mutual exclusion'],
  'channel': ['channels', 'goroutine channel'],
  'goroutine': ['go routine', 'go routines'],
  'slice': ['go slice', 'slices'],
  'defer': ['deferred call', 'defers'],
  'panic': ['panics', 'go panic'],
  'interface': ['interfaces', 'implicit interface'],
  'composition': ['compose', 'composition over inheritance'],
  'polymorphism': ['polymorphic'],
  'encapsulation': ['encapsulate'],
  'inheritance': ['inherits', 'subclass'],
  'duck-typing': ['duck typing'],
  'block': ['blocks', 'ruby block', 'iterators'],
  'proc': ['procs', 'lambdas', 'lambda'],
  'symbol': ['symbols', 'ruby symbol'],
  'gem': ['gems', 'rubygems', 'bundler gem'],
  'rails': ['ruby on rails', 'ror'],
  'spring': ['spring boot', 'spring framework'],
  'jvm': ['java virtual machine'],
  'streams': ['java streams', 'stream api'],
  'optional': ['java optional'],
  'async': ['asynchronous', 'async await'],
  'promise': ['promises', 'future'],
  'event-loop': ['eventloop', 'event loop'],
  'closure': ['closures'],
  'prototype': ['prototypes', 'prototypal inheritance'],
  'big-o': ['complexity', 'big o notation', 'time complexity'],
  'recursion': ['recursive', 'recursion depth'],
  'hashmap': ['hash map', 'hash table', 'dictionary'],
  'linked-list': ['link list', 'singly linked list'],
  'tree': ['trees', 'binary tree'],
  'graph': ['graphs', 'adjacency list'],
  'bfs': ['breadth first search'],
  'dps': ['dynamic programming', 'dp'],
  'binary-search': ['bsearch', 'log n search'],
  'quicksort': ['quick sort'],
  'mergesort': ['merge sort'],
  'stack': ['stacks', 'lifo'],
  'queue': ['queues', 'fifo'],
};

/** expand alias map into variant -> canonical */
const ALIAS_LOOKUP = (() => {
  const m = new Map();
  for (const [canonical, aliases] of Object.entries(ALIASES)) {
    m.set(canon(canonical), canonical);
    for (const a of aliases) m.set(canon(a), canonical);
  }
  return m;
})();

/** normalize token stream through the alias map */
export function withAliases(tokens) {
  const out = [];
  for (const t of tokens) {
    out.push(t);
    const c = ALIAS_LOOKUP.get(t);
    if (c && canon(c) !== t) out.push(canon(c));
  }
  return out;
}

/** word-level alias expansion for one token */
function tokenVariants(t) {
  const out = new Set([t]);
  const c = ALIAS_LOOKUP.get(t);
  if (c) {
    out.add(c);
    for (const v of variants(c)) out.add(v.replace(/-/g, ' ').split(' ').filter(Boolean)[0] ?? v);
  }
  const flat = t.replace(/-/g, '');
  if (flat !== t) out.add(flat);
  return out;
}

/**
 * Concept hit: a concept label is "hit" when most of its significant words
 * (or their aliases) appear in the transcript. 2-of-3 style ratio, so a
 * paraphrase that says the same thing still counts.
 */
function conceptHit(conceptLabel, transcriptTokens) {
  const labelToks = tokenize(conceptLabel).filter((w) => w.length > 2);
  if (!labelToks.length) return { hit: false, ratio: 0 };
  const tset = new Set(transcriptTokens);
  let matches = 0;
  for (const t of labelToks) {
    const vars = tokenVariants(t);
    let m = false;
    for (const v of vars) {
      for (const c of tset) {
        if (v === c || stemMatch(v, c)) { m = true; break; }
      }
      if (m) break;
    }
    if (m) matches++;
  }
  const ratio = matches / labelToks.length;
  const threshold = labelToks.length <= 2 ? 1 : labelToks.length <= 4 ? 0.67 : 0.6;
  return { hit: ratio >= threshold, ratio };
}

const STRUCTURE_MARKERS_TECH = ['because', 'so that', 'for example', 'trade-off', 'tradeoff', 'instead', 'whereas', 'however', 'step', 'first', 'then', 'finally'];
const STRUCTURE_MARKERS_STAR = ['situation', 'task', 'action', 'result', 'i led', 'i built', 'i implemented', 'we shipped', 'i measured', 'impact'];

function structureScore(transcript, isBehavioral) {
  const t = ' ' + transcript.toLowerCase() + ' ';
  const markers = isBehavioral ? STRUCTURE_MARKERS_STAR : STRUCTURE_MARKERS_TECH;
  const found = markers.filter(m => t.includes(m));
  return Math.min(1, 0.25 + found.length * 0.2);
}

function depthScore(wordCount, conceptHits) {
  if (!wordCount) return 0;
  const ideal = 110;                       // ~1 min spoken answer
  const lengthScore = Math.min(1, wordCount / ideal);
  const density = Math.min(1, (conceptHits * 8) / Math.max(wordCount, 1) * 3);
  return Math.max(0, Math.min(1, lengthScore * 0.6 + density * 0.4));
}

function communicationScore(meta, wordCount) {
  if (meta?.typed) return null;            // typed answers: not measured
  const wpm = meta?.wpm;
  const fillerRatio = meta?.fillerRatio;
  let s = 0.7;
  if (wpm != null) s -= Math.abs(wpm - 150) / 300;
  if (fillerRatio != null) s -= fillerRatio * 2;
  return Math.max(0, Math.min(1, s));
}

/**
 * verifyTurn — score one answer.
 * rubric: the CIS question object (concepts, mistakes, spoken, deep, direct, probes, id)
 */
export function verifyTurn(transcript, rubric, opts = {}) {
  const isBehavioral = opts.isBehavioral ?? false;
  const rawTokens = tokenize(transcript);
  const tokens = withAliases(rawTokens);
  const wordCount = rawTokens.length;

  // CONCEPT COVERAGE — the heart of AVE
  const hit = [], missed = [];
  for (const label of rubric.conceptLabels ?? []) {
    const r = conceptHit(label, rawTokens, null, null);
    (r.hit ? hit : missed).push(label);
  }
  // fallback if no conceptLabels authored: use direct answer coverage via bm25 against corpus
  let corpusCoverage = 0;
  if (!(rubric.conceptLabels ?? []).length) {
    const corpusTokens = tokenize([rubric.direct, rubric.spoken].filter(Boolean).join(' '));
    const res = bm25(tokens, [{ tokens: corpusTokens, len: corpusTokens.length, tf: termFreq(corpusTokens) }]);
    corpusCoverage = Math.min(1, res.score / 25);
    // take top matches as pseudo-concept hit list
    const pseudo = res.matches.slice(0, 5);
    pseudo.forEach(p => hit.push(p));
  }
  const coverage = (rubric.conceptLabels ?? []).length
    ? hit.length / rubric.conceptLabels.length
    : corpusCoverage;

  // MISTAKES — did the candidate echo a known common_mistake?
  const mistakeFlags = [];
  for (const m of rubric.mistakes ?? []) {
    const mt = tokenize(m);
    if (mt.length < 2) continue;
    const tset = new Set(tokens);
    let overlap = mt.filter(t => tset.has(t)).length;
    const ratio = overlap / mt.length;
    if (ratio >= 0.5) mistakeFlags.push(m);
  }

  // DEPTH + STRUCTURE + COMMUNICATION
  const depth = depthScore(wordCount, hit.length);
  const structure = structureScore(transcript, isBehavioral);
  const communication = communicationScore(opts.meta, wordCount);

  // TOTAL — fixed weights, fully auditable
  const parts = [coverage * 0.5, depth * 0.2, structure * 0.15];
  let score = parts.reduce((a, b) => a + b, 0);
  if (communication != null) score += communication * 0.15;
  else score += 0.15 * (depth * 0.5 + structure * 0.5); // redistribute when typed
  score = Math.round(Math.max(0, Math.min(1, score)) * 100);

  // DIRECTOR SIGNAL
  // 'stronger' keys on coverage dominance: said all/most concepts AND structured enough.
  // A fluent spoken answer rarely uses 'first/then/finally', so raw score alone
  // would under-detect mastery; coverage is the truth signal.
  let signal;
  if (coverage >= 0.75 && score >= 60) signal = 'stronger_than_expected';
  else if (score >= 55 || (coverage >= 0.5 && depth >= 0.4)) signal = 'on_track';
  else if (score >= 32) signal = 'shaky';
  else signal = 'lost';

  return {
    score,
    coverage: { hit, missed, ratio: +(coverage.toFixed(2)) },
    depth: +(depth.toFixed(2)),
    structure: +(structure.toFixed(2)),
    communication: communication == null ? null : +(communication.toFixed(2)),
    mistakeFlags,
    signal,
    suggested: {
      spoken: rubric.spoken || rubric.direct,
      deep: rubric.deep || rubric.direct,
      checklist: rubric.conceptLabels ?? [],
    },
    nextDrills: (rubric.probes ?? []).filter(p => p.kind === 'probe').map(p => p.text).slice(0, 3),
  };
}
