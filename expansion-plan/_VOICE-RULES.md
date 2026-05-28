# _VOICE-RULES — Easy-language voice rules for every playbook & Q

> **Status:** locked source-of-truth. Every playbook's §12 *Easy-language voice
> rules* opens by quoting this file in full, then adds 2–3 playbook-specific
> examples.
>
> The lint script [`scripts/lint_playbook.py`](../scripts/lint_playbook.py)
> enforces:
>
> 1. **Banned word list (§6 below) returns zero matches** in playbook prose.
> 2. **Define-before-use:** every non-trivial noun-phrase in §9–§14 is in
>    the playbook's own §3 or in `_GLOSSARY.md`.
> 3. **Lead-with-trade-off:** every comparison Q in §10's reference and in
>    the produced `complete-qa.json` opens its `direct_answer` with
>    "Use X when … ; use Y when …" — not with X's definition.
> 4. **Name-the-bug:** every `step` whose intent is to warn contains a
>    sentence beginning with "The classic bug" / "The #1 trap" /
>    "The most common mistake".

The rules below are mirrored from the
[Java-Backend-Intermediate corpus](../content/java-backend-intermediate/) —
that corpus is the **reference voice**. When in doubt, open
`content/java-backend-intermediate/core-java/java-io-nio/complete-qa.json`
and copy the cadence.

---

## 1 — Define before use

Every domain term used in a playbook (§9–§14) must already be defined in
either the playbook's own §3 glossary or in
[`_GLOSSARY.md`](_GLOSSARY.md). The reader never hits a term they have
to leave the file to understand.

**Rule of thumb:** when you write a sentence containing a capitalised
acronym or a `code-fenced` identifier you haven't defined yet, stop and
add the row to §3 before continuing the sentence.

**Examples:**

- ✅ "After step 4, run `audit_speakable.py` (see §3 *Speakable lint*)
  against the new Q."
- ❌ "After step 4, run the speakable audit against the new Q." (term
  not defined; reader can't tell what 'speakable audit' means).
- ❌ "The OTel exporter for RED metrics emits over OTLP/gRPC to a
  Collector." (Four undefined acronyms in one sentence.)
- ✅ "The OpenTelemetry exporter (see §3 *OpenTelemetry*) for RED metrics
  (see §3 *RED metrics*) emits OTLP/gRPC payloads to a Collector."

---

## 2 — Lead with the trade-off, not the definition

Comparison questions, decision-table sections, and "when to pick X"
guidance all open with the **decision rule**, not the definition of the
options.

**The pattern:** *Use X when … ; use Y when …* — then explain X and Y.

**Examples:**

- ✅ "Use `Comparable` when one natural order is baked into the class
  (`String`, `Integer`). Use `Comparator` when you need multiple
  orderings or can't edit the class. Comparable is `compareTo(T)` on the
  class itself; Comparator is a separate object, usually a lambda."
- ❌ "`Comparable` is an interface that defines a `compareTo` method.
  `Comparator` is also an interface that defines a `compare` method.
  Both are used for sorting." (Three sentences before the reader knows
  why they'd pick either.)

- ✅ "Use byte streams for binary data: images, PDFs, audio, network
  bytes, serialization. Use character streams for text: log files, CSV,
  JSON, config files — always specify a charset (`StandardCharsets.UTF_8`)
  or face platform-dependent bugs."
- ❌ "Byte streams are the parent class hierarchy. Character streams are
  another hierarchy." (No decision; reader still has to guess which to
  pick.)

---

## 3 — Name the bug

Every step in §9 whose intent is to **warn** about a pitfall must contain
a sentence that starts with one of these exact phrases:

- *"The classic bug is …"*
- *"The #1 trap is …"*
- *"The most common mistake is …"*
- *"The single most common production bug is …"*

This is the JBI voice. It tells the reader *what specifically goes wrong*,
not *what to avoid in the abstract*.

**Examples:**

- ✅ "The classic bug is omitting the charset — `new FileReader(\"app.log\")`
  picks up the platform default (Windows-1252 on Windows, UTF-8 on Linux)
  and corrupts logs on the first CI runner that doesn't match the dev
  machine."
- ❌ "Be careful with charsets; they vary by platform." (Generic, no
  bug named, no code shown.)

- ✅ "The #1 NIO trap is forgetting `buffer.flip()` between a write phase
  and a read phase. You write 10 bytes, try to read them back, get 1014
  zero bytes."
- ❌ "Buffer state can be confusing." (Trap not named.)

---

## 4 — Real anchors in every section

Every section in §9, §10, §11, §12, §14, §15 must name at least one
**real-world anchor** — a system, library, RFC, JEP, command, or kernel
call that demonstrates the rule.

**The good anchors:**

- Real systems: Kafka, Netty, LMDB, RocksDB, Cassandra, Elasticsearch,
  PostgreSQL, Redis, Stripe, Twilio, GitHub, Cloudflare.
- Real libraries: Project Reactor, Resilience4j, Jackson, Pydantic v2,
  uvloop, Lettuce.
- Real version markers: JEP 400 (UTF-8 default), JEP 444 (virtual
  threads), Java 21, Python 3.12, Spring Boot 3.2, Next.js 14 App Router.
- Real kernel calls: `epoll`, `kqueue`, `IOCP`, `sendfile()`, `fsync`,
  `mmap`.
- Real commands: `jcmd`, `jstack`, `async-profiler`, `pg_dump`,
  `kubectl rollout`, `terraform plan`.

**Examples:**

- ✅ "`FileChannel.transferTo()` maps to Linux `sendfile()` under the
  hood. Kafka attributes a significant portion of its throughput to
  this."
- ❌ "Some I/O methods are faster than others." (No anchor, no number.)

- ✅ "Java 21's virtual threads (JEP 444) flip the old NIO-vs-IO
  trade-off — blocking code on a virtual thread now scales like NIO for
  most workloads."
- ❌ "Modern Java has new concurrency features." (No version, no JEP, no
  system named.)

---

## 5 — Years and JEP / RFC / release numbers

Time-stamp every version-sensitive claim. Readers landing from search
need to know if the advice still applies in 2026.

**The pattern:** *X happened in JDK N (year Y)* — or — *Library X version
Z (released year Y)*.

**Examples:**

- ✅ "Java 18 (March 2022, JEP 400) flipped the platform default charset
  to UTF-8."
- ✅ "Spring Boot 3.0 (November 2022) baselines Jakarta EE 9+; if your
  service is still on `javax.*` imports, you haven't migrated yet."
- ❌ "Modern Java uses UTF-8." (Modern when? Java 8 ≠ Java 21.)
- ❌ "Spring Boot now uses Jakarta." (Now when? The reader's "now" may
  be six months stale.)

---

## 6 — Banned words (lint fails on any of these in playbook prose)

These words appear in marketing copy and stale tech blogs. The JBI
corpus does not use them. The lint greps for each:

```text
leverage      utilize        synergize      synergies
world-class   cutting-edge   state-of-the-art
hereinafter   aforementioned heretofore
seamless      seamlessly     robust         robustly
holistic      paradigm       paradigms
best-in-class best-of-breed  next-generation
turnkey       battle-tested  enterprise-grade
revolutionary game-changing  industry-leading
ecosystem     synergistic
```

**Why each is banned:**

- `leverage` / `utilize` / `synergize` — "use" works and is shorter.
- `world-class` / `cutting-edge` / `state-of-the-art` — pure marketing.
- `hereinafter` / `aforementioned` — legalese, not engineering prose.
- `seamless` / `robust` — overused adjectives that carry no information.
- `holistic` / `paradigm` — consultant words.
- `best-in-class` / `best-of-breed` / `next-generation` — marketing.
- `turnkey` / `battle-tested` / `enterprise-grade` — sales pitches.
- `revolutionary` / `game-changing` / `industry-leading` — sales pitches.
- `ecosystem` — fine when literally about the Spring/Java/Python
  ecosystem; banned for generic "marketing-ecosystem" usage. The lint
  flags it and the author justifies in PR if it's the literal sense.

**Reverse-pass:** the lint also requires at least 5 of the *good*
anchors (kernel calls, JEPs, real systems) from §4 to appear in any
playbook of length ≥ 500 lines. A playbook with zero anchors fails.

---

## 7 — First-person rules

- **Behavioral / STAR answers (archetype G):** first-person singular
  ("I led", "I rewrote", "I owned"), never "we".
- **Technical playbooks:** second-person ("you", "your") or imperative
  ("Run", "Open", "Verify").
- **Speakable answer beats:** match the archetype's voice (G is first
  person; A-F are second person or impersonal).
- **No "I think" / "I believe" / "honestly" hedges** anywhere. State the
  position; if it's an opinion, say "the recommendation is …".

---

## 8 — Sentence length & rhythm

The JBI corpus alternates **short declarative sentences** with **longer
qualified ones**. Three rules:

1. **Open every section with a declarative sentence of ≤ 18 words.** The
   reader's eye lands on a clear statement, not a qualified one.
2. **No three consecutive long sentences (> 25 words).** Break with a
   short one.
3. **Bold the verdict in `direct_answer` beats** — one or two phrases
   per Q. The reader skimming should see the answer in bold.

---

## 9 — Code, identifiers, and inline formatting

- Class / method / field names in `monospace`: `BufferedReader`,
  `Files.readString`, `@Transactional`.
- File paths in `monospace`: `frontend/lib/launch-config.ts`.
- Commands in fenced shell blocks, with `cd /Users/ravi.r_flx/...` on
  the first line so a fresh shell can run them.
- Code blocks always declare a language (`java`, `python`, `ts`, `bash`,
  `json`, `yaml`, `mermaid`) — the renderer needs it.
- `comparison_table` columns are **left-aligned by default**; numeric
  columns are right-aligned (`---:` in the separator row).
- Mermaid blocks open with the diagram keyword (`flowchart`,
  `sequenceDiagram`, `classDiagram`, `stateDiagram-v2`) on the **first
  line of the block**.

---

## 10 — Diagram voice (inside the produced Q&A content)

Per the locked decision, diagrams live in the Q&A `complete-qa.json`
files, not in the playbook prose itself. Voice rules for diagrams:

- **Title every diagram** with a sentence the reader could speak —
  "How `put()` resolves a collision", not "HashMap put flow".
- **Edge labels are verbs in present tense**: "hashes", "compares",
  "evicts" — not "hashing", "comparison", "eviction".
- **Cap the node count at ~12** per diagram. If you need more, split
  into two diagrams.
- **One concept per diagram.** A `classDiagram` shows class structure;
  a `sequenceDiagram` shows ordering. Don't blend.
- **No colour or emoji in nodes.** The frontend renders mermaid into
  its own colour scheme; inline colour overrides break the dark theme.

---

## 11 — Voice rule examples, side by side

The JBI corpus's golden voice (left) vs the textbook voice we're moving
away from (right).

| ✅ JBI voice | ❌ Textbook voice |
| --- | --- |
| "Java I/O streams are sequential data pipelines with two families: byte streams (`InputStream`/`OutputStream`) and character streams (`Reader`/`Writer`)." | "The Java I/O system provides a comprehensive set of classes for input and output operations." |
| "The classic bug is omitting the charset — `new FileReader(\"app.log\")` picks up the platform default and corrupts UTF-8 logs on a Windows CI runner." | "Be careful about character encoding when reading files." |
| "Kafka uses `FileChannel.transferTo()` to replay multi-TB partitions at line rate without touching JVM heap." | "Some applications use NIO for performance reasons." |
| "Java 21's virtual threads (JEP 444) flip the old NIO-vs-IO trade-off." | "Modern Java provides advanced concurrency features." |
| "Use `Comparable` when one natural order is baked in; use `Comparator` when you need multiple orderings or can't edit the class." | "`Comparable` and `Comparator` are both used for ordering objects in Java." |

---

## 12 — Self-check before commit

After writing or expanding a playbook, run these five greps before
opening a PR:

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

# 1. Banned words anywhere in the file
rg -nwi 'leverage|utilize|synergize|world-class|cutting-edge|state-of-the-art|hereinafter|aforementioned|seamless|robust|holistic|paradigm|best-in-class|battle-tested|enterprise-grade|revolutionary|game-changing|industry-leading' expansion-plan/NN-*.md
# expected: zero matches

# 2. "We" voice slip in behavioral examples
rg -n '\bwe (did|built|deployed|shipped|launched)\b' expansion-plan/NN-*.md
# expected: zero matches outside §10 reference Q's STAR template

# 3. "I think / I believe" hedges
rg -ni 'i think|i believe|honestly|in my opinion' expansion-plan/NN-*.md
# expected: zero matches

# 4. Step without a verify line
rg -n '^### Step ' expansion-plan/NN-*.md
# for each match, eyeball the section: every Step must end with a Verify block

# 5. Run the playbook lint
python3 scripts/lint_playbook.py expansion-plan/NN-*.md
# expected: exit 0
```

If all five pass, the voice is at JBI quality bar.
