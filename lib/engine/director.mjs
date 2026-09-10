/**
 * director.mjs — Interview Director: deterministic per-turn interview engine.
 * Walks the authored interview graph (probes, stretches, mistakes, tradeoffs)
 * using AVE's per-turn signal. NEVER a fixed question set: same user + domain
 * produce different paths, because moves depend on the candidate's answers.
 *
 * No LLM. Transitions quote the candidate's own words via a template bank.
 */

import { tokenize, canon } from './text.mjs';

// ---------------- transition template bank ----------------
// Slots: {topic} {concept} {quote} {question}
export const TRANSITIONS = {
  open: [
    "Let's start with {topic}. {question}",
    "I'd like to begin with {topic}. {question}",
    "First up — {topic}. {question}",
    "Okay, let's kick things off. {question}",
  ],
  probe: [
    'You mentioned {quote} — {question}',
    "Okay, that tracks. You brought up {quote} — {question}",
    "Good. On {quote}: {question}",
    'Interesting. On {quote}: {question}',
    "Let's dig into that. {question}",
    'You brought up {quote} — take that further. {question}',
    'Hold on, you said {quote} — {question}',
  ],
  stretch: [
    "That's a solid answer. Let's push further: {question}",
    'Nice — you clearly know this. {question}',
    "I like that. Raising the bar: {question}",
    'Good. Now stretch: {question}',
    "You're clearly comfortable here — {question}",
    "Alright, let's raise the bar. {question}",
    'Strong so far. {question}',
  ],
  poke: [
    'Hmm — {question}',
    'Let me push back on that. {question}',
    "Actually, that's a classic trap with this. {question}",
    'Wait — {question}',
  ],
  tradeoff: [
    "Let's compare: {question}",
    'Trade-off time. {question}',
    'Pick a side: {question}',
  ],
  scaffold: [
    "Hey, no problem — let's build it up from the base. {question}",
    "That's alright. Let's start from the ground: {question}",
    "Let's take a step back. {question}",
    'Okay — simpler one. {question}',
    "Let's rebuild from the ground. {question}",
    'No worries. Start smaller. {question}',
  ],
  circle_back: [
    "Earlier I asked about {concept} — let's try another angle. {question}",
    'We glossed over {concept} a bit — {question}',
    'Back to {concept}, but differently: {question}',
    'You skipped {concept} earlier — {question}',
  ],
  pivot: [
    'Shifting gears to {topic}. {question}',
    "Let's move to {topic}. {question}",
    'Next area — {topic}. {question}',
  ],
  steer_rambler: [
    "Let's park that — my core question was: {question}",
    'Interesting tangent — but let me re-focus us. {question}',
    'Let me bring us back. {question}',
  ],
  nudge: [
    'Take your time — {question}',
    'Still there? {question}',
    "Whenever you're ready. {question}",
  ],
  wrap: [
    "That's all the time we have. Great talking with you.",
    "We're at time. This was useful — thank you.",
    "Let's stop here. Good session.",
  ],
};

function pickTemplate(kind, usedSet, rand) {
  const bank = TRANSITIONS[kind] ?? [];
  if (!bank.length) return '{question}';
  const unused = bank.filter((t) => !usedSet.has(kind + ':' + t));
  const pool = unused.length ? unused : bank;
  const t = pool[Math.floor(rand() * pool.length)];
  usedSet.add(kind + ':' + t);
  return t;
}

function render(tpl, ctx) {
  return tpl
    .replace('{quote}', ctx.quote ? `"${ctx.quote}"` : 'that')
    .replace('{concept}', ctx.concept ?? 'that')
    .replace('{topic}', ctx.topic ?? 'this area')
    .replace('{question}', ctx.question ?? '');
}

/** Candidate key phrases for quoting (deterministic: top TF long terms). */
export function keyPhrases(transcript, max = 2) {
  const toks = tokenize(transcript);
  const tf = new Map();
  for (const t of toks) if (t.length > 4) tf.set(t, (tf.get(t) ?? 0) + 1);
  return [...tf.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map((e) => e[0])
    .slice(0, max);
}

/** Deterministic PRNG so sessions are reproducible from a seed. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 2 | t)) ^ 0;
    return (t >>> 0) / 4294967296;
  };
}

function displayName(q) {
  return (q.title || q.topic || 'this topic').replace(/^(What is|What are|Explain|How does)\s+/i, '');
}

/** Build the session question queue: gap-ranked, breadth-quota, recency-avoiding. */
export function buildSessionQueue({ index, targetConcepts, domain, count, avoid = [], rand }) {
  const pool = domain ? index.questions.filter((q) => q.domain === domain) : index.questions.slice();
  const avoidSet = new Set(avoid);
  const scored = pool.map((q) => {
    let s = 1;
    if (q.importance === 'high') s += 2;
    if (q.importance === 'low') s -= 1;
    if (avoidSet.has(q.id)) s -= 5;
    // Scorable questions come first: a turn without an authored concept
    // checklist cannot be evaluated (the answerer scores ~0 vs empty labels)
    // — the Director must open on questions that CAN produce a verdict.
    const labelCount = (q.conceptLabels ?? q.concepts ?? []).length;
    if (labelCount === 0) s -= 4;
    else if (labelCount >= 3) s += 1;
    if (targetConcepts?.length) {
      const overlap = q.concepts.filter((c) => targetConcepts.includes(c)).length;
      s += overlap * 3;
    }
    return { q, s: s + rand() * 0.99 }; // seed-flavored tie-break
  });
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, count).map((x) => x.q);
}

/** Find an easier question in the same module (scaffold move). */
function findScaffold(index, question, askedSet, rand) {
  const cands = index.questions.filter(
    (q) => q.domain === question.domain && q.module === question.module && q.difficulty === 'easy' && !askedSet.has(q.id)
  );
  if (!cands.length) {
    return index.questions.find(
      (q) => q.domain === question.domain && !askedSet.has(q.id) && q.id !== question.id
    ) ?? null;
  }
  return cands[Math.floor(rand() * cands.length)];
}

/** Find a next topic via cross-module shared concepts (pivot move). */
function findPivot(index, question, askedSet, rand) {
  const key = `${question.domain}/${question.module}`;
  const links = index.crossLinks?.[key] ?? [];
  const target = links[Math.floor(rand() * links.length)]?.to;
  if (!target) return null;
  const [d, m] = target.split('/');
  return index.questions.find((q) => q.domain === d && q.module === m && !askedSet.has(q.id)) ?? null;
}

/** Tradeoff question from comparison_table rows. */
function tradeoffQuestion(question) {
  const rows = question.tradeoffs ?? [];
  if (!rows.length) return null;
  const row = rows[0];
  const cols = question.tradeoffColumns ?? [];
  const a = row[0] ?? 'A';
  const b = cols[1] ?? 'B';
  return `How would you choose between ${a} and ${b} here — and what's the trade-off?`;
}

function isBehavioralQuestion(q) {
  return /^(behavioral|fresher-behavioral-hr|behavioral-and-fresher-qa|soft-skills|hr)$/.test(q.module) ||
    /tell me about (yourself|a time)|describe a time|describe a situation|describe a project|walk me through (your resume|your project|a project|how you handled)|a conflict with|disagreement with|how you handled|your biggest|your greatest|a time you (failed|struggled|made a mistake)|your strengths|your weaknesses|proudest|most difficult decision/i.test(q.question);
}

/**
 * Learning pages sometimes explain how behavioral interviews work. Those are
 * useful study material, but they are not credible prompts for a live mock.
 * Keep the session queue limited to questions a real interviewer could ask.
 */
function isAuthenticBehavioralPrompt(q) {
  const text = String(q.question ?? '').trim();
  if (!text) return false;
  return !/^(what is a behavioral\s*\/?.*interview|how do you answer behavioral interview questions|how do you talk about your projects in an interview|how do you introduce yourself in an interview|how do you handle an interview question you don'?t know)/i.test(text);
}

function behavioralQuestionFitsRole(q, domain) {
  const text = `${q.question ?? ''} ${q.title ?? ''}`.toLowerCase();
  const role = String(domain ?? '').toLowerCase();
  if (role.includes('fresher') && String(q.domain ?? '').includes('intermediate')) return false;
  const namedStacks = [
    ['java', /\bjava\b/],
    ['ruby', /\bruby|rails\b/],
    ['python', /\bpython|django|flask\b/],
    ['go-', /\bgolang|\bgo backend\b/],
    ['frontend', /\bfrontend|react|angular\b/],
  ];
  return namedStacks.every(([roleToken, pattern]) => !pattern.test(text) || role.includes(roleToken));
}

function codingLanguageForDomain(domain) {
  const value = String(domain ?? '');
  if (value.startsWith('python')) return 'python';
  if (value.startsWith('go-')) return 'go';
  if (value.startsWith('ruby')) return 'ruby';
  if (value.startsWith('frontend')) return 'javascript';
  return 'java';
}

export class Director {
  constructor(opts) {
    this.index = opts.index;
    this.mode = opts.mode ?? 'solo';
    this.interviewMode = opts.interviewMode ?? 'mixed';   // mixed | behavioral | technical | coding
    this.preset = opts.preset ?? 'standard';
    this.sessionSeed = opts.sessionSeed ?? 42;
    this.rand = mulberry32(this.sessionSeed);
    this.maxQuestions = opts.questionCount ?? 8;
    this.state = {
      asked: new Set(),
      askedList: [],
      spokenConcepts: new Set(),
      dodged: [],
      streak: { strong: 0, weak: 0 },
      turn: 0,
    };
    this.templateUse = new Set();
    this.usedProbeIds = new Set();
    this.roleDomain = opts.domain;

    const buildQueue = (questions, domain) => buildSessionQueue({
      index: { ...this.index, questions },
      targetConcepts: opts.targetConcepts,
      domain,
      count: this.maxQuestions,
      avoid: opts.avoid ?? [],
      rand: this.rand,
    });

    if (this.interviewMode === 'mixed') {
      const technical = buildQueue(
        this.index.questions.filter((q) => q.domain === opts.domain && !q.isDsaProblem && !isBehavioralQuestion(q)),
        opts.domain,
      );
      const coding = buildQueue(this.index.questions.filter((q) => q.isDsaProblem), 'dsa');
      const behavioral = buildQueue(
        this.index.questions.filter((q) => isBehavioralQuestion(q) && isAuthenticBehavioralPrompt(q) && behavioralQuestionFitsRole(q, opts.domain)),
        undefined,
      );
      const queues = { technical, coding, behavioral };
      const order = ['technical', 'technical', 'coding', 'technical', 'behavioral'];
      this.queue = [];
      let cursor = 0;
      while (this.queue.length < this.maxQuestions && Object.values(queues).some((queue) => queue.length)) {
        const kind = order[cursor % order.length];
        const question = queues[kind].shift();
        if (question) this.queue.push(this.decorateQuestion(question));
        cursor++;
      }
    } else {
      const pool = this.interviewMode === 'behavioral'
        ? this.index.questions.filter((q) => isBehavioralQuestion(q) && isAuthenticBehavioralPrompt(q) && behavioralQuestionFitsRole(q, opts.domain))
        : this.interviewMode === 'coding'
          ? this.index.questions.filter((q) => q.isDsaProblem)
          : this.index.questions.filter((q) => !q.isDsaProblem && !isBehavioralQuestion(q));
      const queueDomain = this.interviewMode === 'behavioral'
        ? undefined
        : this.interviewMode === 'coding' ? 'dsa' : opts.domain;
      this.queue = buildQueue(pool, queueDomain).map((question) => this.decorateQuestion(question));
    }
    this._first = true;
  }

  decorateQuestion(question) {
    if (!question) return question;
    if (question.isDsaProblem && (this.interviewMode === 'coding' || this.interviewMode === 'mixed')) {
      return {
        ...question,
        isCoding: true,
        starterCode: question.starterCode ?? '',
        codingLang: codingLanguageForDomain(this.roleDomain),
      };
    }
    if (isBehavioralQuestion(question) && (this.interviewMode === 'behavioral' || this.interviewMode === 'mixed')) {
      return { ...question, isBehavioral: true };
    }
    return question;
  }

  log(question, move, reason) {
    this.state.moveLog ??= [];
    this.state.moveLog.push({
      turn: this.state.turn,
      move,
      questionId: question?.id ?? null,
      reason,
    });
  }

  /** Opening question. */
  open() {
    const q = this.queue.shift();
    if (!q) return this.wrap('no questions available');
    this.state.asked.add(q.id);
    this.state.askedList.push(q);
    const tpl = pickTemplate('open', this.templateUse, this.rand);
    const rendered = render(tpl, { topic: displayName(q), question: q.question });
    this.log(q, 'open', 'session start — planned opener');
    return { move: 'open', question: q, rendered, moveLog: this.state.moveLog };
  }

  /** Process the candidate's answer -> the next interviewer move. */
  turn(answerResult, transcriptMeta = {}) {
    const { question, ave } = answerResult;
    this.state.turn++;
    this.topicDwell = this._lastQuestionId === question.id ? (this.topicDwell ?? 0) + 1 : 1;
    this._lastQuestionId = question.id;

    for (const h of ave.coverage.hit ?? []) this.state.spokenConcepts.add(canon(h));
    const missed = ave.coverage.missed ?? [];
    if (missed.length) {
      this.state.dodged.push({
        concepts: missed.map(canon),
        questionId: question.id,
        addedAt: this.state.turn,
      });
    }

    const quote = keyPhrases(transcriptMeta.transcript ?? ave.suggested.spoken)[0];

    if (ave.signal === 'stronger_than_expected') {
      this.state.streak.strong++;
      this.state.streak.weak = 0;
    } else if (ave.signal === 'shaky' || ave.signal === 'lost') {
      this.state.streak.weak++;
      this.state.streak.strong = 0;
    } else {
      this.state.streak = { strong: 0, weak: 0 };
    }

    const move = this.chooseMove(ave, question);
    return this.executeMove(move, { question, ave, quote });
  }

  chooseMove(ave, question) {
    const s = this.state;
    const outOfQueue = this.queue.length === 0;

    // 1. wrap: hard cap on distinct questions AND total turns (probes included)
    if (s.asked.size >= this.maxQuestions) return 'wrap';
    if (s.turn >= this.maxQuestions + 4) return 'wrap';
    if (outOfQueue && !s.dodged.length) return 'wrap';

    // 2. circle back (concept dodged >= 2 turns ago, candidate currently stable)
    const cb = s.dodged.find((d) => s.turn - d.addedAt >= 2);
    if (cb && s.streak.weak === 0) return 'circle_back';

    // 3. mistake poke (immediate, once per topic — don't interrogate the same error)
    if (ave.mistakeFlags?.length && !(this.pokedTopics ??= new Set()).has(question.id)) return 'poke';

    // 3b. topic dwell cap OUTRANKS streaks: no matter how strong/weak, a real
    // interviewer changes topic after ~3 exchanges — otherwise the session
    // degenerates into an interrogation of one topic.
    if ((this.topicDwell ?? 0) >= 3) return 'next';

    // 4. streaks
    if (s.streak.strong >= 2) return 'stretch';
    // after 2 consecutive scaffolds, move on — a real interviewer doesn't spiral
    if (s.streak.weak >= 2 && (this.scaffoldRun ?? 0) < 2) return 'scaffold';

    // 4b. rambling / empty
    if (ave.depth < 0.25 && (ave.coverage.ratio ?? 0) < 0.25) return 'scaffold';

    // 5. authored probes on the current topic
    const probe = (question.probes ?? []).find(
      (p) => p.kind === 'probe' && !this.usedProbeIds.has(p.id)
    );
    if (probe && ave.signal !== 'lost') return 'probe';

    // 6. tradeoff if table exists and not used yet
    if ((question.tradeoffs ?? []).length && !this.tradeoffUsed) return 'tradeoff';

    // 7. pivot for breadth, else next planned
    if (outOfQueue) {
      const piv = findPivot(this.index, question, s.asked, this.rand);
      if (piv) return 'pivot';
      return 'wrap';
    }
    return 'next';
  }

  executeMove(move, ctx) {
    const { question, ave, quote } = ctx;
    const s = this.state;
    if (move !== 'scaffold') this.scaffoldRun = 0;

    if (move === 'wrap') return this.wrap('quota reached');

    if (move === 'probe') {
      const probe = (question.probes ?? []).find(
        (p) => p.kind === 'probe' && !this.usedProbeIds.has(p.id)
      );
      if (!probe) return this.executeMove('next', ctx);
      this.usedProbeIds.add(probe.id);
      const tpl = pickTemplate('probe', this.templateUse, this.rand);
      const rendered = render(tpl, { quote, question: probe.text });
      this.log(question, 'probe', `follow-up on candidate phrase "${quote}"`);
      return { move: 'probe', question: { ...question, question: probe.text, isProbe: true }, rendered, moveLog: s.moveLog };
    }

    if (move === 'stretch') {
      const stretch = (question.probes ?? []).find((p) => p.kind === 'stretch' && !this.usedProbeIds.has(p.id));
      if (stretch) this.usedProbeIds.add(stretch.id);
      const unusedProbe = (question.probes ?? []).find((p) => p.kind === 'probe' && !this.usedProbeIds.has(p.id));
      const text = stretch?.text ?? unusedProbe?.text ?? this.harderQuestion(question);
      const tpl = pickTemplate('stretch', this.templateUse, this.rand);
      const rendered = render(tpl, { question: text });
      this.log(question, 'stretch', 'two strong answers in a row — raising the bar');
      return { move: 'stretch', question: { ...question, question: text, isStretch: true }, rendered, moveLog: s.moveLog };
    }

    if (move === 'poke') {
      (this.pokedTopics ??= new Set()).add(question.id);
      const mistake = ave.mistakeFlags[0];
      const text = `You said something that maps to a classic mistake: "${mistake}" — walk me through what actually happens.`;
      const tpl = pickTemplate('poke', this.templateUse, this.rand);
      const rendered = render(tpl, { question: text });
      this.log(question, 'poke', 'candidate echoed a known common_mistake');
      return { move: 'poke', question: { ...question, question: text, isPoke: true }, rendered, moveLog: s.moveLog };
    }

    if (move === 'tradeoff') {
      const text = tradeoffQuestion(question);
      if (!text) return this.executeMove('next', ctx);
      this.tradeoffUsed = true;
      const tpl = pickTemplate('tradeoff', this.templateUse, this.rand);
      const rendered = render(tpl, { question: text });
      this.log(question, 'tradeoff', 'authored comparison_table available — asking A-vs-B');
      return { move: 'tradeoff', question: { ...question, question: text, isTradeoff: true }, rendered, moveLog: s.moveLog };
    }

    if (move === 'scaffold') {
      this.scaffoldRun = (this.scaffoldRun ?? 0) + 1;
      const easierRaw = findScaffold(this.index, question, s.asked, this.rand);
      if (!easierRaw) return this.executeMove('next', ctx);
      const easier = this.decorateQuestion(easierRaw);
      s.asked.add(easier.id);
      s.askedList.push(easier);
      const tpl = pickTemplate('scaffold', this.templateUse, this.rand);
      const rendered = render(tpl, { question: easier.question });
      this.log(easier, 'scaffold', 'two shaky answers — stepping to fundamentals');
      return { move: 'scaffold', question: easier, rendered, moveLog: s.moveLog };
    }

    if (move === 'circle_back') {
      const cb = s.dodged.find((d) => s.turn - d.addedAt >= 2);
      if (!cb) return this.executeMove('next', ctx);
      // rephrase: use a probe of the ORIGINAL question if available
      const origRaw = this.index.questions.find((q) => q.id === cb.questionId);
      const orig = this.decorateQuestion(origRaw);
      const rephrase =
        (orig?.probes ?? []).find((p) => p.kind === 'probe' && !this.usedProbeIds.has(p.id))?.text ??
        (orig ? `Let's revisit ${displayName(orig)} — ${orig.question}` : `Back to ${cb.concepts[0]} — what is it, really?`);
      const concept = cb.concepts[0]?.replace(/-/g, ' ') ?? 'that';
      const tpl = pickTemplate('circle_back', this.templateUse, this.rand);
      const rendered = render(tpl, { concept, question: rephrase });
      this.log(orig, 'circle_back', `candidate dodged ${cb.concepts.join(', ')} — returning rephrased`);
      s.dodged = s.dodged.filter((d) => d !== cb);
      if (orig) s.asked.add(orig.id);
      return { move: 'circle_back', question: orig ? { ...orig, question: rephrase, isCircleBack: true } : null, rendered, moveLog: s.moveLog };
    }

    if (move === 'pivot') {
      const pivRaw = findPivot(this.index, question, s.asked, this.rand);
      if (!pivRaw) return this.wrap('no pivot available');
      const piv = this.decorateQuestion(pivRaw);
      s.asked.add(piv.id);
      s.askedList.push(piv);
      const tpl = pickTemplate('pivot', this.templateUse, this.rand);
      const rendered = render(tpl, { topic: displayName(piv), question: piv.question });
      this.log(piv, 'pivot', 'cross-module shared concepts — changing topic');
      return { move: 'pivot', question: piv, rendered, moveLog: s.moveLog };
    }

    // default: next planned question from the queue
    const nextQ = this.queue.shift();
    if (!nextQ) return this.wrap('queue exhausted');
    s.asked.add(nextQ.id);
    s.askedList.push(nextQ);
    const tpl = pickTemplate('probe', this.templateUse, this.rand);
    const rendered = render(tpl, { quote, question: nextQ.question });
    this.log(nextQ, 'next', 'planned next topic');
    return { move: 'next', question: nextQ, rendered, moveLog: s.moveLog };
  }

  wrap(reason) {
    const tpl = pickTemplate('wrap', this.templateUse, this.rand);
    this.log(null, 'wrap', reason);
    return { move: 'wrap', question: null, rendered: tpl, moveLog: this.state.moveLog };
  }

  /** final report: merge per-turn AVE results into a session rollup */
  report(turnResults) {
    const scores = turnResults.map((t) => t.ave.score);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const conceptHits = {};
    for (const t of turnResults) {
      for (const h of t.ave.coverage.hit ?? []) conceptHits[canon(h)] = (conceptHits[canon(h)] ?? 0) + 1;
      for (const m of t.ave.coverage.missed ?? []) conceptHits[canon(m)] ??= 0;
    }
    const allMissed = new Set();
    for (const t of turnResults) for (const m of t.ave.coverage.missed ?? []) allMissed.add(canon(m));
    return {
      overallScore: avg,
      turns: this.state.turn,
      conceptsSpoken: [...this.state.spokenConcepts],
      weakConcepts: [...allMissed],
      strongConcepts: Object.entries(conceptHits).filter(([, n]) => n > 0).map(([c]) => c),
      moveLog: this.state.moveLog,
      perQuestion: turnResults.map((t) => ({
        questionId: t.question.id,
        question: t.question.question,
        move: t.move,
        score: t.ave.score,
        coverage: t.ave.coverage,
        suggested: t.ave.suggested,
      })),
    };
  }
}
