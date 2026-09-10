# Audit — spring-core

**Pillar:** P02 Spring Ecosystem
**Module:** M06 spring-core
**Topics present:** 7 (of 8 — `comparisons` has 0 questions)
**Questions:** 22 (all written, no stubs)
**Benchmark sources:** Baeldung ("Intro to Inversion of Control and Dependency Injection with Spring", "Spring Bean Lifecycle", "Spring @PostConstruct and @PreDestroy"), GeeksforGeeks ("Spring IoC Container", "BeanFactory vs ApplicationContext"), Spring Framework reference docs, JavaTechOnline, HowToDoInJava

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Opening 1–2 sentences bold-anchor the key terms — `**IoC**`, `**Dependency Injection**`, `**ApplicationContext**`, `**BeanPostProcessor**` | **Failing across the whole module** — 0 of 22 `direct_answer`s have bold anchors |
| Every core Spring mechanism shown with at least one snippet (bean definition, `@Autowired`, `@Bean`, lifecycle callback) | Mixed — 2 substantive Zone 3s have zero code, rest mostly have ≥1 |
| Abstract mechanisms explained through analogy (container = "personal assistant", bean lifecycle = "employee onboarding", BeanPostProcessor = "security guard at the factory door") | **Failing** — 20 of 22 Zone 3s have no detected analogy |
| `direct_answer` present and ~2 sentences long | **Failing** — 8 of 22 have empty `direct_answer` |
| Interviewer-intent / common-mistake section filled | **Failing** — 8 of 22 have incomplete `interviewer_intent` |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | EMPTY ZONE 1 | **CRITICAL** | **8 of 22 questions have empty `direct_answer`**: `value-annotation-property-injection`, `prototype-in-singleton-problem`, `postconstruct-predestroy-spring`, `lazy-annotation-spring`, `circular-dependency-spring`, `pointcut-expressions-spring-aop`, `beanpostprocessor-spring`, `spring-expression-language-spel`, `component-scan-spring`. Zone 1 cannot work without this — the Quick Answer is the user's 30-second hook |
| S2 | INCOMPLETE INTERVIEWER_INTENT | **CRITICAL** | Same 8 questions + `constructor-vs-field-vs-setter-injection` (9 total) are missing at least one of `testing` / `common_mistake` / `to_stand_out`. These populate key interview-prep UI elements |
| S3 | BROKEN QUESTION | **CRITICAL** | **`constructor-vs-field-vs-setter-injection`** — the marquee DI comparison question — has no `speakable_answer` AND no `key_points` section. Zone 2 is non-functional. Only has `[overview, comparison_table, step, step]` in sections |
| S4 | MODULE-WIDE ZONE 1 PATTERN | **MAJOR** | 22 of 22 `direct_answer`s have **zero bold anchors**. 1 is a paragraph wall. Same mechanical fix as spring-boot: add `**bold**` to 2–3 key terms per answer |
| S5 | MODULE-WIDE ZONE 3 PATTERN | **MODERATE** | 20 of 22 Zone 3s have no analogy. Spring IoC/DI/AOP is one of the most analogy-friendly topics in the whole stack. Top sources lean on analogies heavily here |
| S6 | MISSING TOPIC | **MODERATE** | `comparisons` has 0 questions. Standard interview comparisons missing: `@Component` vs `@Bean`, `@Autowired` vs `@Inject` vs `@Resource`, `BeanFactory` vs `ApplicationContext` (currently inside `spring-internals` — consider moving), constructor vs field injection (currently broken Q) |
| S7 | CODE-MISSING ZONE 3 | **MAJOR** | Two substantive Zone 3s have zero code: `how-autowired-works-internally` (645w) and `beanfactory-vs-applicationcontext` (670w). Both need code |

---

## Per-question issues

### Topic: `dependency-injection` (5 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-ioc-dependency-injection-explained | No bold anchors (51w) — `**IoC**`, `**Dependency Injection**`, `**ApplicationContext**` | ✓ 300w (good length) | 970w / 3 code blocks / rich sections — **best-shaped Zone 3 in module**. Missing analogy (standard: container = "personal assistant / general contractor") | MINOR |
| **Q2** constructor-vs-field-vs-setter-injection | No bold / no key_points / no speakable — **entirely broken Zone 1+2** | **MISSING** | 645w / 1 code block — solid deep-dive content exists but orphaned without Zone 1/2 | **CRITICAL** |
| **Q3** how-autowired-works-internally | No bold (44w) — `**@Autowired**`, `**AutowiredAnnotationBeanPostProcessor**`, `**by type then by name**` | ✓ 208w | 645w / **0 code blocks** / no analogy — explaining `@Autowired` resolution without code is borderline impossible. Must show BPP invocation + ambiguity resolution | **MAJOR** |
| **Q4** qualifier-and-primary-ambiguous-injection | No bold (37w) — `**@Qualifier**`, `**@Primary**`, `**NoUniqueBeanDefinitionException**` | ✓ 175w | 410w / 3 code blocks — good. Missing analogy (optional here) | MINOR |
| **Q5** value-annotation-property-injection | **Empty** `direct_answer`. `interviewer_intent` incomplete | ✓ 182w | 565w / 3 code blocks — good substance. Zone 1 needs authoring (~50 words): bind property values from `application.properties` / env vars with SpEL support, default-value fallback syntax | **CRITICAL** |

### Topic: `bean-lifecycle` (6 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-bean-scopes | No bold (51w) — `**singleton**` (default), `**prototype**`, `**request**`, `**session**`, `**application**` | ✓ 203w | 573w / 2 code blocks — solid. Missing analogy | MINOR |
| **Q2** prototype-in-singleton-problem | **Empty** `direct_answer`. `interviewer_intent` incomplete | ✓ 191w | 783w / 2 code blocks / analogy present — best-formed Zone 3 in topic. Needs Zone 1 (~50w): singleton caches prototype ref after first injection → `@Lookup` or `ObjectProvider` fix | **CRITICAL** |
| **Q3** spring-bean-lifecycle | No bold (55w) — `**instantiation**` → `**populate**` → `**BeanNameAware/BeanFactoryAware**` → `**BeanPostProcessor.before**` → `**@PostConstruct/InitializingBean.afterPropertiesSet/init-method**` → `**BPP.after**` → (ready) → `**@PreDestroy/DisposableBean.destroy/destroy-method**` | ✓ 177w | 860w / 2 code blocks / 4 phases / analogy present — **best-structured question in module** | MINOR |
| **Q4** postconstruct-predestroy-spring | **Empty** `direct_answer`. `interviewer_intent` incomplete | ✓ 179w | 403w / 2 code blocks — good. Zone 1 needs authoring; missing analogy. Also should call out JSR-250 → Jakarta EE migration (post-Boot 3, `jakarta.annotation.*` instead of `javax.annotation.*`) — standard 2024+ interview trap | **CRITICAL** |
| **Q5** lazy-annotation-spring | **Empty** `direct_answer`. `interviewer_intent` incomplete | ✓ 220w | 430w / 1 code / analogy present. Zone 1 needs authoring (~50w): defer bean initialization until first access, applied at class or `@Autowired` injection point, useful for expensive beans or breaking circular dependency | **CRITICAL** |
| **Q6** circular-dependency-spring | **Empty** `direct_answer`. `interviewer_intent` incomplete | ✓ 207w | 488w / 1 code block — solid. Zone 1 needs authoring; missing analogy. Should call out Boot 2.6+ default-off behavior (`spring.main.allow-circular-references=true` now required) — big post-2021 interview trap | **CRITICAL** |

### Topic: `aop` (2 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** how-spring-aop-works | Paragraph wall (65w, no bold) — `**AOP**`, `**cross-cutting concerns**`, `**proxy**`, `**JDK dynamic proxy**` vs `**CGLIB**`, `**self-invocation**` trap | ✓ 212w | 509w / 1 code block — good. Missing analogy (standard: "security camera overlay that wraps every method call without the method knowing") | MODERATE |
| **Q2** pointcut-expressions-spring-aop | **Empty** `direct_answer`. `interviewer_intent` incomplete | ✓ 162w | 476w / 3 code blocks — good substance. Zone 1 needs ~50w: pointcut = expression describing where advice runs; `execution(...)`, `within(...)`, `@annotation(...)`, `args(...)`, combination with `&&`/`\|\|`/`!` | **CRITICAL** |

### Topic: `spring-internals` (4 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** beanpostprocessor-spring | **Empty** `direct_answer`. `interviewer_intent` incomplete | ✓ 146w | 652w / 2 code / analogy present — good. Zone 1 needs authoring. Should emphasize that this is how `@Autowired`, `@PostConstruct`, `@Transactional`, AOP proxies are all implemented — every annotation is a BPP | **CRITICAL** |
| **Q2** beanfactory-vs-applicationcontext | No bold (49w) — `**BeanFactory**` (lazy, minimal), `**ApplicationContext**` (eager, full stack: events, i18n, BPP auto-registration, resource loading) | ✓ 176w | 670w / **0 code blocks** / no analogy — must-add: tiny snippet showing `new AnnotationConfigApplicationContext(...)` vs `XmlBeanFactory` | **MAJOR** |
| **Q3** conditional-and-custom-conditions | No bold (33w) — `**@Conditional**`, `**@ConditionalOnClass**`, `**@ConditionalOnMissingBean**`, `**@ConditionalOnProperty**`, `**Condition.matches()**` | ✓ 182w / analogy present | 452w / 1 code block — good | MINOR |
| **Q4** spring-expression-language-spel | **Empty** `direct_answer`. `interviewer_intent` incomplete | ✓ 155w | 580w / 1 code block — good. Zone 1 needs authoring: SpEL = runtime expression language in `@Value`, security annotations, caching keys; `#{...}` for expressions vs `${...}` for property placeholders (common confusion) | **CRITICAL** |

### Topic: `custom-components` (2 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** component-vs-service-vs-repository-vs-controller | No bold (40w) — `**@Component**` (generic), `**@Service**` (business layer), `**@Repository**` (data + translates DB exceptions to `DataAccessException`), `**@Controller**` / `**@RestController**` (web) | ✓ 172w | 643w / 1 code block — good comparison. Missing analogy (optional) | MINOR |
| **Q2** component-scan-spring | **Empty** `direct_answer`. `interviewer_intent` incomplete | ✓ 198w | 706w / 2 code / analogy present — strong. Zone 1 needs authoring | **CRITICAL** |

### Topic: `spring-events` (1 question)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** spring-events-eventlistener-applicationeventpublisher | No bold (51w) — `**ApplicationEventPublisher**`, `**@EventListener**`, `**ApplicationEvent**`, `**@TransactionalEventListener**` | ✓ 203w | 413w / 2 code blocks — good. Missing analogy | MINOR |

### Topic: `scenario-based` (2 questions)

| Q | Zone 1 | Zone 2 | Zone 3 | Severity |
|---|---|---|---|---|
| **Q1** transactional-propagation-types | No bold (43w) — `**REQUIRED**` (default), `**REQUIRES_NEW**`, `**NESTED**`, `**SUPPORTS**`, `**MANDATORY**`, `**NEVER**`, `**NOT_SUPPORTED**` | ✓ 221w | 768w / 1 code / comparison table — good depth. Missing analogy | MINOR |
| **Q2** spring-profiles-profile-annotation | No bold (46w) — `**@Profile**`, `**spring.profiles.active**`, `**default profile**`, `**@Profile("!prod")**` negation | ✓ 165w | 651w / **4 code blocks** — best code coverage in module. Missing analogy | MINOR |

### Topic: `comparisons` (0 questions)

**MAJOR — missing topic content.** Suggested questions:
- `component-vs-bean-annotation` — `@Component` (class-level, scanned) vs `@Bean` (method-level in `@Configuration`, for third-party classes you can't annotate). Standard interview comparison.
- `autowired-vs-inject-vs-resource` — Spring's `@Autowired` vs JSR-330 `@Inject` vs JSR-250 `@Resource` (by-name default). Common trap question.
- Consider moving `beanfactory-vs-applicationcontext` here from `spring-internals` — it's structurally a comparison.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **10** | 9 questions have empty `direct_answer` or broken Zone 2; 1 has broken Zone 1+2 (constructor-vs-field) |
| **MAJOR** | **3** | Q3 autowired no-code, Q2 BeanFactory no-code, S6 missing comparisons topic |
| **MODERATE** | **2** | Q1 AOP paragraph wall, S5 module-wide analogy gap |
| **MINOR** | **11** | All the "no bold anchors" cases after the CRITICAL ones are resolved |
| **CLEAN** | **0** | No question free of every issue |

## Most common issue codes

- `zone3_no_analogy` × 20
- `zone1_direct_answer_no_bold_anchors` × 12
- `zone1_no_direct_answer` × 8
- `zone1_interviewer_intent_incomplete` × 9
- `zone3_no_code_examples` × 2
- `zone2_no_speakable` × 1

---

## Suggested fix order

1. **Fix Q2 `constructor-vs-field-vs-setter-injection`** — it's the marquee DI question and currently missing Zone 2 entirely. Author `key_points` (5–6 bullets) and `speakable_answer` (200–250w).
2. **Fill the 8 empty `direct_answer`s** in one pass — each is ~50 words, all the Zone 3 content already exists to draw from. Also fill the missing `interviewer_intent` fields at the same time (same 8 questions + Q2).
3. **Add code to the 2 code-missing Zone 3s** — `how-autowired-works-internally` (BPP invocation + ambiguity resolution snippet), `beanfactory-vs-applicationcontext` (context creation comparison snippet).
4. **Author the `comparisons` topic** — at least `@Component` vs `@Bean` and `@Autowired` vs `@Inject` vs `@Resource`.
5. **Module-wide bold-anchor pass** — 22 direct answers, bolded terms already listed above per question. ~30 min batch work.
6. **Analogy additions** — prioritize `beanpostprocessor` (security-guard / customs-agent analogy), `aop` (security-camera overlay), `component-scan` (auto-discovery / headcount). Skip analogies where the concept is already concrete.
