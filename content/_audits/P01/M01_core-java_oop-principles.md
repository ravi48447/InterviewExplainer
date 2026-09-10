# Audit — core-java / oop-principles

**Pillar:** P01 Java Language & Core
**Module:** M01 core-java
**Topic:** oop-principles
**Questions:** 23 (20 written, 3 stubs)
**Benchmark sources:** Baeldung, GeeksforGeeks, Oracle Java Tutorials, Java67, Educative, Cleverence, CoderSathi, Medium interview-prep articles (Vihini Ranasingha, Abhishek Obli Chandrasekar, Spring Boot Simplified)

---

## Style fingerprint for this topic (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Definition → vivid analogy → code → rules → closer | Mostly yes; analogies are thin |
| Bulleted lists under sub-headers in "how to answer" content | Matches — our speakables are correctly shaped |
| Code examples showing wrong way + right way | Mostly yes; some gaps noted below |
| Standard interview facts ("every class extends Object", "constructors not inherited", "diamond problem", "==, not equals() for enums") | Mostly hit; a few misses |
| Interview-specific traps called out | Strong — we do this well |

**Correction to earlier assumption:** bulleted speakable sub-headers are *standard* for this topic area on Baeldung, GFG, Java67, Medium interview prep. Flatten-to-prose reshape would be *away* from internet tone, not toward it.

---

## Module-level structural issues

| # | Issue | Severity |
|---|---|---|
| S1 | **Q11 diamond-problem-java-interfaces** — pure stub, no content | CRITICAL |
| S2 | **Q15 equals-and-hashcode-contract-java** — pure stub, no content | CRITICAL |
| S3 | **Q21 anonymous-inner-class-vs-lambda-java** — pure stub, no content | CRITICAL |
| S4 | **Q8 (Abstraction) and Q9 (Abstract Class vs Interface) overlap** — both have identity-vs-capability framing, decision tables, Java-8 default-method history | MAJOR — decide: merge, or narrow Q8 to pure abstraction concept |
| S5 | **Q10 (default/static methods) and Q11 (diamond problem) overlap** — Q10 already covers diamond resolution with code; Q11 stub has no unique angle unless narrowed to pre-Java-8 class diamond + Java 8 interface diamond contrast | MAJOR |
| S6 | **Q14 (Object methods) and Q15 (equals/hashCode contract) overlap** — Q14 already has HashMap silent-loss demo; Q15 stub would duplicate unless scoped to contract properties (reflexive/symmetric/transitive) only | MAJOR |

---

## Per-question issues (20 written questions)

| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |
|---|---|---|---|---|
| **Q1** Four Pillars | `direct_answer` covers 3 of 4 pillars explicitly — Abstraction callout is thin | Good form; missing analogies for polymorphism (dispatcher/delivery) and abstraction (ATM / driving a car) — top sources universally use these | Abstraction section has only `after_code`, no `before_code` — asymmetric with the other 3 pillars | MODERATE |
| **Q2** Encapsulation + Access Modifiers | ✓ | ✓ | ✓ | CLEAN |
| **Q3** Inheritance — IS-A, super, override | ✓ | ✓ | Missing "every class implicitly extends `Object`" (Oracle/Baeldung universal opener). Missing "constructors are not inherited" explicit callout | MINOR |
| **Q4** `this` vs `super` | ✓ | ✓ | No code examples anywhere in Zone 3 — only concept_map + comparison_table. Every top source shows `this.field` disambiguation + `this(args)` chain + `super.method()` code | MODERATE |
| **Q5** Constructor Chaining | ✓ | ✓ | Has telescoping pattern code. Missing init-order gotcha demo (parent constructor calling overridden method → child fields at defaults). Mentioned in speakable, not shown in code | MODERATE |
| **Q6** Overloading vs Overriding | ✓ | ✓ | Has `@Override` typo-trap code. Missing the `Animal a = new Dog(); a.speak()` dynamic dispatch demo — the signature example in every interview prep | MODERATE |
| **Q7** Compile-Time vs Runtime Polymorphism | ✓ | ✓ | ✓ (has reference-type trap code) | CLEAN |
| **Q8** Abstraction (vs Interface) | ✓ | ✓ | ✓ | CLEAN — but topic overlap with Q9 (see S4) |
| **Q9** Abstract Class vs Interface | ✓ | ✓ | ✓ | CLEAN — but topic overlap with Q8 |
| **Q10** Default/Static methods in interfaces | ✓ | ✓ | ✓ | CLEAN |
| **Q12** Composition vs Inheritance | ✓ | ✓ | ✓ (Stack-extends-Vector hook is excellent) | CLEAN |
| **Q13** Association vs Aggregation vs Composition | ✓ | ✓ | ✓ | CLEAN |
| **Q14** Object class methods | ✓ | ✓ | ✓ (HashMap data-loss demo is strong) | CLEAN — but Q15 overlap |
| **Q16** Shallow vs Deep Copy | ✓ | Out-of-pattern "Defensive copies in constructors" mini-section at the bottom — inconsistent with the 3-sub-header rhythm | ✓ | MINOR |
| **Q17** Immutability | ✓ | ✓ | ✓ | CLEAN |
| **Q18** `static` keyword | ✓ | ✓ | ✓ | CLEAN |
| **Q19** Enums | ✓ | ✓ | Strong strategy-pattern code. Optional add: `EnumSet`/`EnumMap` code example (mentioned but not demonstrated) | MINOR |
| **Q20** Inner Classes | ✓ | ✓ | No code examples at all — only comparison_table + prose. Gap vs the module's own norm and internet standard. Top sources always show code for all 4 inner-class types | MODERATE |
| **Q22** Marker Interfaces | ✓ | ✓ | No code example — annotations-vs-marker table is solid but no `instanceof Serializable` check or custom-marker snippet | MINOR |
| **Q23** Serialization | ✓ | ✓ | No code example — no demo of a `Serializable` class with `serialVersionUID` + `transient` declaration. Gap vs module norm | MINOR |

---

## Verdict tally for this module

- **CRITICAL (stubs):** 3 (Q11, Q15, Q21)
- **MAJOR (structural overlaps):** 3 (S4, S5, S6)
- **MODERATE (zone-3 code or content gaps):** 5 (Q1, Q4, Q5, Q6, Q20)
- **MINOR (polish):** 5 (Q3, Q16, Q19, Q22, Q23)
- **CLEAN (no real issues):** 9 questions

**Notable non-issue:** speakable bulleted-under-subheader format matches internet norm for OOP interview content. No speakable reshape needed.

---

## Suggested fix directions

1. **Stubs (Q11, Q15, Q21):** repurpose with narrower scope rather than delete or write generic duplicates:
   - Q11 → "Diamond problem: class-era ban vs Java 8 interface resolution"
   - Q15 → equals/hashCode **contract properties** (reflexive/symmetric/transitive/consistent) — deep-dive complement to Q14's survey
   - Q21 → "Anonymous class vs Lambda: `this` scoping, bytecode, capture semantics" — genuinely distinct angle from Q20
2. **Q8 ↔ Q9:** keep both but narrow Q8 to the pure abstraction concept (real-world hiding, the "what vs how" framing) and keep Q9 as the comparison-arena.
3. **Moderate code gaps (Q1, Q4, Q5, Q6, Q20):** add targeted code blocks to match module norm.
4. **Minor polishes:** single-line additions / small reorders.
