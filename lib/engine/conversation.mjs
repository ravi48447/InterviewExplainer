/**
 * conversation.mjs — Conversation Director v2: the human-session layer.
 *
 * SessionBeats: the arc of a real interview (opener → warm-up → core →
 *   time-signal → closer → debrief) as a state machine ABOVE the Director's
 *   move machine — gating which moves are legal per beat.
 * Reactions: AVE-signal-keyed human responses (banked, persona-flavored,
 *   never repeating, one per answer).
 * Memory: quote bank + contradiction detection across the session.
 *
 * No LLM. Deterministic banks + the candidate's own words.
 */

// ---------------- reaction banks (per signal × persona flavor) ----------------

const REACTIONS = {
  stronger_than_expected: {
    mentor: ['Nice — that was a good answer.', "That's exactly what I was hoping to hear.", 'Great, I follow completely.'],
    skeptic: ['Hm. Okay, that holds.', "I'll accept that.", 'Fine — you clearly know this one.'],
    rapid: ['Good. Moving on.', 'Yep, got it.', 'Okay, next.'],
    detail: ['Interesting — well put.', "That's precise. Good.", 'You know this well.'],
    architect: ['At small scale, sure — and you know the scale story.', 'Reasonable. Well argued.', 'Solid trade-off reasoning.'],
    silent: ['…', '(nods)', '(writes something down)'],
    panelist: ['Right, right.', "Mm-hm. Okay, that's fine.", '(looks up) Good.'],
  },
  on_track: {
    mentor: ['Okay, I follow.', "That tracks. Let's keep going.", 'Alright — makes sense.'],
    skeptic: ['Okay…', 'Hm. Partially.', "I follow, mostly."],
    rapid: ['Okay.', 'Got it.', 'Next?'],
    detail: ['Alright.', 'Go on…', 'Hm, continue.'],
    architect: ['Reasonable.', 'Fair.', "That's defensible."],
    silent: ['Hm.', '…', '(waits)'],
    panelist: ['Mm.', 'Sure, sure.', 'Okay.'],
  },
  shaky: {
    mentor: ["Close — let me ask it a different way.", "You're on the edge of it. Let me rephrase.", "Almost. Different angle:"],
    skeptic: ["I'm not sure that lands. Let me re-ask.", "Hmm. Let me try that differently.", "That's not quite it — other angle:"],
    rapid: ['Shorter. Again:', "Not it. Retry, fast:", "Half-way. Again:"],
    detail: ["Let me be more specific, then.", "Partially there. Rephrasing:", 'Define it more precisely for me —' ],
    architect: ["At which scale, though? Let me re-ask.", "Depends — let me sharpen the question.", "Let me make it concrete:"],
    silent: ['…', '…Let me rephrase that.', '(waits, then:) Again —'],
    panelist: ["Sorry — I don't follow. Say it again?", "Hmm, not quite. Again:", "Let me re-ask that differently."],
  },
  lost: {
    mentor: ["No problem — let's set that aside.", "That's okay. Let's park it and move on.", "Don't worry about it — different topic."],
    skeptic: ["Alright, let's leave that there.", "Okay — moving on from that.", "We'll skip that one."],
    rapid: ['Skip. Moving on.', "Not today then — next.", 'Okay, park it. Next.'],
    detail: ["Let's set that aside for now.", 'Fine — different area.', "We'll come back to that another time."],
    architect: ["Alright — let's not force it. New area.", "Okay, park it. Moving on.", "Let's switch gears then."],
    silent: ['…', '(moves on)', '…Next, then.'],
    panelist: ["Yeah, let's skip that. Different question —", "Okay, whatever. Moving on —", 'Mm. New topic —'],
  },
};

const OPENER_BANK = [
  'Hi — thanks for joining. Can you hear me okay? Great. I\'m {name}, and I\'ll be running this session today.',
  'Hello! Appreciate you making the time. This is {name} — ready when you are.',
  'Hey, good to see you. I\'m {name}. We\'ll go for about {minutes} minutes — comfortable? Let\'s start.',
  'Hi there, welcome. {name} here. Take a second to settle in — we\'ll begin shortly.',
];

const TIME_SIGNAL_BANK = [
  'We\'ve got about {minutes} minutes left, so let\'s make these count.',
  'Quick time check — {minutes} minutes to go. Let\'s keep the answers tight.',
  'About {minutes} minutes on my side. Shall we push on?',
];

const CLOSER_BANK = [
  'That\'s everything from my side. Do you have any questions for me — about the team, the role, anything?',
  'Okay — those were all my questions. Anything you\'d want to ask me before we wrap?',
  "We're at time. Before we end — any questions about the role or the team?",
];

const LAST_ONE_BANK = [
  'Last one from me:',
  'Okay, final question:',
  'One last thing before we wrap:',
];

// candidate-side closer questions (the "any questions for me?" moment — real candidates are judged on this)
export const CANDIDATE_QUESTIONS = [
  { q: 'What does the team look like day to day?', a: 'Mostly sprint work — about 60% coding, 30% design/review, 10% on-call. Standups are short; we value written async updates.' },
  { q: 'What does success look like in the first 6 months?', a: 'Shipping something real in month one, owning a small service by month three, and leading a design discussion by six.' },
  { q: 'Why is this role open?', a: 'Growth — the team is taking on a new problem area and we need another engineer to own part of it.' },
  { q: 'What do you enjoy about working here?', a: 'The bar is high but people are generous with context. Good arguments are welcome anywhere.' },
  { q: 'How do technical decisions get made?', a: 'Proposals in writing, then a review. The person closest to the problem decides, with input.' },
  { q: 'What happens after this round?', a: 'I\'ll submit my feedback today. If it\'s positive, the recruiter reaches out within a few days for the next step.' },
];

// ---------------- memory: quote bank + contradictions ----------------

const CONTRADICTION_PAIRS = [
  { a: 'thread-safe', b: 'not thread-safe' },
  { a: 'mutable', b: 'immutable' },
  { a: 'o of n', b: 'o of n squared' },
  { a: 'synchronous', b: 'asynchronous' },
  { a: 'stateless', b: 'stateful' },
  { a: 'eager loading', b: 'lazy loading' },
  { a: 'compiled', b: 'interpreted' },
  { a: 'encrypt', b: 'hash' },
];

export class SessionMemory {
  constructor() {
    this.quotes = [];        // { phrase, turn, concept }
    this.claims = [];        // { text, polarity, turn }
    this.reactionsUsed = new Set();
    this.contradictions = [];
  }

  /** record the candidate's key phrase for later callback */
  rememberPhrase(phrase, turn, concept = null) {
    if (!phrase || phrase.length < 4) return;
    if (this.quotes.length < 12) this.quotes.push({ phrase, turn, concept });
  }

  /** detect a polarity claim in an answer */
  recordClaims(answer, turn) {
    const t = String(answer ?? '').toLowerCase();
    for (const pair of CONTRADICTION_PAIRS) {
      const hasA = t.includes(pair.a);
      const hasB = t.includes(pair.b);
      if (hasA && !hasB) this.claims.push({ polarity: pair.a, opposite: pair.b, turn });
      if (hasB && !hasA) this.claims.push({ polarity: pair.b, opposite: pair.a, turn });
    }
  }

  /** check for a contradiction with earlier turns */
  checkContradiction(answer, currentTurn) {
    const t = String(answer ?? '').toLowerCase();
    for (const pair of CONTRADICTION_PAIRS) {
      const hasA = t.includes(pair.a);
      const hasB = t.includes(pair.b);
      for (const claim of this.claims) {
        if (currentTurn - claim.turn < 2) continue;
        if (hasA && claim.polarity === pair.b) return { earlier: claim, now: pair.a };
        if (hasB && claim.polarity === pair.a) return { earlier: claim, now: pair.b };
      }
    }
    return null;
  }

  /** find a phrase from N turns ago to callback (prefers distinct, memorable ones) */
  callbackPhrase(currentTurn, minGap = 2) {
    const candidates = this.quotes.filter((q) => currentTurn - q.turn >= minGap);
    if (!candidates.length) return null;
    // prefer the one with the largest gap (feels like "remember that from before")
    return candidates[0];
  }
}

// ---------------- the beat machine ----------------

export const BEATS = {
  OPENER: 'opener',
  WARMUP: 'warmup',
  CORE: 'core',
  TIME_SIGNAL: 'time_signal',
  CLOSER: 'closer',
  CANDIDATE_QA: 'candidate_qa',
  DEBRIEF: 'debrief',
};

export class SessionBeats {
  constructor({ persona, minutes, seed = Date.now() % 10000, director, index }) {
    this.persona = persona;
    this.minutes = minutes;
    this.director = director;
    this.index = index;
    this.beat = BEATS.OPENER;
    this.turn = 0;
    this.memory = new SessionMemory();
    this.rng = mulberry32(seed);
    this.openerUsed = false;
    this.timeSignaled = false;
    this.lastOneDone = false;
    this.candidateQAnswered = 0;
    this.rambling = false;
  }

  /** opening line for the session */
  opener(name) {
    this.beat = BEATS.OPENER;
    const bank = OPENER_BANK;
    const tpl = bank[Math.floor(this.rng() * bank.length)];
    return tpl.replace('{name}', name ?? this.persona.name).replace('{minutes}', String(this.minutes));
  }

  /** pick a warm-up question: easy + high importance */
  warmupQuestion() {
    // The Director queue is already filtered by domain, selected mode,
    // target concepts, and avoid history. Choosing from the global index here
    // used to make a Java interview open with an unrelated DSA/Ruby question.
    const cands = (this.director.queue ?? []).filter(
      (q) => q.difficulty === 'easy' && (q.importance ?? '') === 'high',
    );
    if (!cands.length) return this.director.open();
    this.beat = BEATS.WARMUP;
    const q = cands[Math.floor(this.rng() * cands.length)];
    this.director.queue = this.director.queue.filter((candidate) => candidate.id !== q.id);
    // feed it into the director's asked set so it isn't repeated later
    this.director.state.asked.add(q.id);
    this.director.state.askedList.push(q);
    const rendered = `Alright, let's ease in with something gentle first. ${q.question}`;
    return { move: 'warmup', question: q, rendered };
  }

  /**
   * The main turn processor: reaction + Director move + memory, per beat.
   * answer: { question, ave, transcript } — what the candidate just did.
   */
  processAnswer(answer, elapsedRatio) {
    const { question, ave, transcript } = answer;
    this.turn++;
    const memory = this.memory;
    memory.recordClaims(transcript, this.turn);

    // ---- memory threading: remember a key phrase ----
    const phrase = extractPhrase(transcript);
    if (phrase) memory.rememberPhrase(phrase, this.turn);

    // ---- contradiction check (highest-priority reaction) ----
    const contradiction = memory.checkContradiction(transcript, this.turn);
    if (contradiction) {
      memory.contradictions.push(contradiction);
      this.beat = BEATS.CORE;
      return {
        move: 'poke',
        reaction: `Hold on — a few questions back you said ${contradiction.earlier.polarity}. Now you're saying ${contradiction.now}? Help me reconcile that.`,
        next: null, // caller uses Director to continue on the same question
        beat: this.beat,
      };
    }

    // ---- time transitions ----
    if (!this.timeSignaled && elapsedRatio >= 0.75) {
      this.timeSignaled = true;
      this.beat = BEATS.TIME_SIGNAL;
      const minsLeft = Math.max(1, Math.round(this.minutes * (1 - elapsedRatio)));
      const tpl = TIME_SIGNAL_BANK[Math.floor(this.rng() * TIME_SIGNAL_BANK.length)];
      // signal + continue core
      const next = this.director.turn(answer, { transcript });
      return {
        move: next.move,
        reaction: tpl.replace('{minutes}', String(minsLeft)),
        next,
        beat: BEATS.CORE,
      };
    }

    // ---- core: reaction + Director move ----
    this.beat = BEATS.CORE;
    const signal = ave?.signal ?? 'on_track';
    const next = this.director.turn(answer, { transcript });

    // last-question framing when wrapping
    if (next.move === 'wrap' && !this.lastOneDone) {
      this.lastOneDone = true;
      const lastQ = this.director.queue[this.director.queue.length - 1];
      if (lastQ) {
        this.director.state.asked.add(lastQ.id);
        const bank = LAST_ONE_BANK;
        return {
          move: 'next',
          reaction: bank[Math.floor(this.rng() * bank.length)],
          next: { move: 'next', question: lastQ, rendered: lastQ.question },
          beat: BEATS.CORE,
        };
      }
    }

    // reaction selection: keyed to signal, persona-flavored, no repeats
    const reaction = this.pickReaction(signal);

    // memory callback: on probe/pivot moves, reference an earlier phrase
    let rendered = next.rendered ?? '';
    if ((next.move === 'next' || next.move === 'pivot') && this.rng() < 0.35) {
      const cb = memory.callbackPhrase(this.turn);
      if (cb) {
        rendered = `Earlier you mentioned "${cb.phrase}" — related question. ${rendered}`;
      }
    }

    return {
      move: next.move,
      reaction,
      next: { ...next, rendered },
      beat: this.beat,
      memoryPhrase: phrase,
    };
  }

  pickReaction(signal) {
    const bank = (REACTIONS[signal] ?? REACTIONS.on_track)[this.persona.id] ?? REACTIONS.on_track.mentor;
    const unused = bank.filter((r) => !this.memory.reactionsUsed.has(signal + ':' + r));
    const pool = unused.length ? unused : bank;
    const pick = pool[Math.floor(this.rng() * pool.length)];
    this.memory.reactionsUsed.add(signal + ':' + pick);
    return pick;
  }

  /** the wrap: closer beat + candidate Q&A then debrief */
  closer() {
    this.beat = BEATS.CLOSER;
    const bank = CLOSER_BANK;
    return bank[Math.floor(this.rng() * bank.length)];
  }

  /** candidate asked one of the standard questions — interviewer answers */
  answerCandidateQuestion(idx) {
    const qa = CANDIDATE_QUESTIONS[Math.min(Math.max(idx, 0), CANDIDATE_QUESTIONS.length - 1)];
    this.candidateQAnswered++;
    return qa;
  }
}

// ---------------- helpers ----------------

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 2 | t)) ^ 0;
    return (t >>> 0) / 4294967296;
  };
}

/** extract a memorable phrase from the transcript (deterministic) */
function extractPhrase(transcript) {
  const words = String(transcript ?? '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 5);
  if (!words.length) return null;
  const tf = new Map();
  for (const w of words) tf.set(w, (tf.get(w) ?? 0) + 1);
  const best = [...tf.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)[0];
  return best && best[0].length >= 6 ? best[0] : null;
}
