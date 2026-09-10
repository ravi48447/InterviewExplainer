# 🗂️ Complete Folder Structure & Connection Map

## 🎯 Core Philosophy

**ONE Central Philosophy** → **64+ Specialized Domains** → **Each Crafted Individually**

---

## 📐 The Structure

```
content/
│
├── 📖 philosophy/
│   └── MASTER_CONTENT_PHILOSOPHY.md          ← ONE central source of truth
│                                               (7 principles for ALL domains)
│
├── 🎨 templates/
│   ├── domain-template.json                   ← Starting point (customize for each)
│   ├── stack-template.json
│   └── experience-level-guide.md              ← How to specialize by experience
│
├── 🌍 domains/
│   │
│   ├── 📂 java-backend-1-3/                   ← Crafted for 1-3 years
│   │   ├── domain-definition.md               ← Deep specialization document
│   │   ├── domain-config.json                 ← Stack definitions
│   │   ├── target-companies.md                ← Companies hiring this level
│   │   ├── interview-patterns.md              ← Common patterns for this level
│   │   └── stacks/
│   │       ├── spring-boot-basics/
│   │       ├── jpa-fundamentals/
│   │       ├── rest-api-design/
│   │       └── testing-basics/
│   │
│   ├── 📂 java-backend-5-plus/                ← Different focus for 5+ years
│   │   ├── domain-definition.md               ← Architect-level focus
│   │   ├── domain-config.json
│   │   ├── target-companies.md
│   │   ├── interview-patterns.md
│   │   └── stacks/
│   │       ├── microservices-architecture/
│   │       ├── performance-optimization/
│   │       ├── system-design/
│   │       └── distributed-systems/
│   │
│   ├── 📂 python-backend-1-3/                 ← Python specialization
│   │   ├── domain-definition.md
│   │   ├── domain-config.json
│   │   └── stacks/
│   │       ├── python-fundamentals/
│   │       ├── django-basics/
│   │       ├── fastapi-intro/
│   │       └── sqlalchemy/
│   │
│   ├── 📂 python-backend-5-plus/              ← Senior Python engineer
│   │   ├── domain-definition.md
│   │   ├── domain-config.json
│   │   └── stacks/
│   │       ├── async-python/
│   │       ├── performance-profiling/
│   │       ├── architecture-patterns/
│   │       └── data-pipelines/
│   │
│   ├── 📂 react-frontend-1-3/
│   │   └── ... (focused on component basics, hooks, state)
│   │
│   ├── 📂 react-frontend-5-plus/
│   │   └── ... (focused on performance, architecture, SSR)
│   │
│   └── ... (repeat for all domains × experience levels)
│
├── 📝 questions/
│   ├── java-backend-1-3/
│   │   ├── spring-boot-basics/
│   │   │   ├── questions.json
│   │   │   ├── metadata.json
│   │   │   └── generation-log.json
│   │   └── ...
│   │
│   ├── java-backend-5-plus/
│   │   ├── microservices-architecture/
│   │   │   ├── questions.json
│   │   │   ├── metadata.json
│   │   │   └── generation-log.json
│   │   └── ...
│   │
│   └── ... (all domains × experience)
│
├── 💎 answers/                                ← Phase 2 (Future)
│   ├── java-backend-1-3/
│   │   ├── spring-boot-basics/
│   │   │   ├── answers-batch-1.json          ← 7-part structure
│   │   │   ├── code-examples/
│   │   │   └── quality-scores.json
│   │   └── ...
│   └── ...
│
├── 📊 analytics/
│   ├── seo-performance/
│   │   ├── keyword-rankings.json
│   │   └── search-trends.json
│   ├── user-feedback/
│   │   ├── ratings-by-domain.json
│   │   └── improvement-suggestions.json
│   └── quality-metrics/
│       ├── completion-rates.json
│       └── helpfulness-scores.json
│
└── 🔧 scripts/
    ├── masterQuestionGenerator.ts             ← Uses philosophy + domain specialization
    ├── domainCrafter.ts                       ← NEW: Helps craft each domain
    ├── experienceLevelMapper.ts               ← Maps stacks to experience levels
    └── qualityValidator.ts                    ← Validates against philosophy
```

---

## 🎯 How Experience Levels Split

### Example: Java Backend

#### **Java Backend 1-3 Years** (Mid-Level Engineer)
**Focus**: Practical skills for day-to-day work

**Stacks** (20-25):
```
Foundation:
├── Spring Boot Basics (40q)
├── REST API Development (35q)
└── JPA & Hibernate Fundamentals (35q)

Daily Work:
├── Testing with JUnit/Mockito (30q)
├── SQL Queries & Optimization (30q)
├── Git & Version Control (25q)
└── Docker Basics (25q)

Interview Focus:
├── Data Structures & Algorithms (40q)
├── System Design Basics (30q)
└── Behavioral Questions (20q)

Total: ~310 questions
```

**Interview Types**:
- Coding rounds (LC Easy/Medium)
- Basic system design
- Framework usage
- Debugging scenarios

---

#### **Java Backend 5+ Years** (Senior/Staff Engineer)
**Focus**: Architecture, leadership, optimization

**Stacks** (25-30):
```
Architecture:
├── Microservices Design Patterns (50q)
├── Distributed Systems (45q)
├── Event-Driven Architecture (40q)
└── API Gateway Patterns (35q)

Performance:
├── JVM Performance Tuning (40q)
├── Database Optimization (35q)
├── Caching Strategies (35q)
└── Profiling & Monitoring (30q)

Leadership:
├── System Design (Complex) (50q)
├── Technical Leadership (30q)
├── Code Review Best Practices (25q)
└── Mentoring & Growth (20q)

Production:
├── Incident Management (30q)
├── Deployment Strategies (30q)
├── Observability (25q)
└── Security Hardening (30q)

Total: ~550 questions
```

**Interview Types**:
- Advanced system design
- Architecture discussions
- Production war stories
- Leadership scenarios

---

## 📋 Domain Specialization Template

Each domain has a **deep specialization document**:

```markdown
# Domain: Java Backend (1-3 Years)

## Target Profile
**Role**: Mid-Level Backend Engineer
**Companies**: Startups, scale-ups, product companies
**Salary Range**: $80K-$130K
**Team Size**: Usually in 5-10 person teams

## What They Do Daily
1. Build REST APIs using Spring Boot
2. Write database queries (JPA/Hibernate)
3. Debug production issues
4. Write unit/integration tests
5. Participate in code reviews
6. Deploy using CI/CD pipelines

## Interview Focus Areas
1. **Coding** (40%): LC Easy/Medium, data structures
2. **Framework Knowledge** (30%): Spring Boot, JPA practical usage
3. **System Design** (20%): Basic designs (URL shortener, cache)
4. **Behavioral** (10%): Teamwork, problem-solving

## Common Interview Questions (Real Examples)
- "Build a REST endpoint that does X"
- "Debug this slow query"
- "Design a notification system"
- "How do you handle exceptions in Spring?"
- "Walk me through your last production bug"

## Stacks Prioritized by Interview Frequency
1. **Spring Boot Basics** (Asked in 90% of interviews)
2. **REST API Design** (Asked in 85% of interviews)
3. **JPA/Hibernate** (Asked in 75% of interviews)
4. **Testing** (Asked in 70% of interviews)
5. **SQL** (Asked in 65% of interviews)
...

## What They DON'T Need to Know
- Complex distributed systems patterns
- Microservices at scale
- Advanced JVM tuning
- Kubernetes internals
(These are for 5+ years)

## SEO Keywords for This Level
- "spring boot interview questions mid level"
- "java backend developer 2 years experience"
- "rest api interview questions"
- "jpa hibernate interview"
```

---

## 🔗 How Everything Connects

### The Flow

```
1. MASTER PHILOSOPHY (Universal Principles)
   ↓
2. DOMAIN DEFINITION (Specialized for experience level)
   ↓
3. STACK SELECTION (What this level needs)
   ↓
4. QUESTION GENERATION (Using philosophy + specialization)
   ↓
5. QUALITY VALIDATION (Against philosophy standards)
```

### Example: Generating Spring Boot Questions for 1-3 Years

**Step 1**: Read `MASTER_CONTENT_PHILOSOPHY.md`
- Get universal principles (SEO, depth, quality)

**Step 2**: Read `java-backend-1-3/domain-definition.md`
- Understand: This is for mid-level engineers
- Focus: Practical daily work, not architecture
- Interview style: Coding + framework usage

**Step 3**: Read `java-backend-1-3/domain-config.json`
- Stack: "Spring Boot Basics"
- Coverage: Auto-configuration, controllers, testing
- Excludes: Microservices, advanced patterns

**Step 4**: Generate Prompt
- Universal quality (from philosophy)
- Specialized focus (from domain definition)
- Appropriate difficulty (from experience level)

**Step 5**: Validate
- Meets philosophy standards? ✅
- Appropriate for 1-3 years? ✅
- In scope for this stack? ✅

---

## 📊 Domain Creation Workflow

### For Each New Domain:

**1. Start with Template**
```bash
cp content/templates/domain-template.json \
   content/domains/python-backend-1-3/domain-config.json
```

**2. Deep Research**
- What do 1-3 year Python engineers do daily?
- What do companies ask in interviews?
- What stacks are most important?
- What's different from 5+ year engineers?

**3. Write Specialization Document**
```bash
# Create domain-definition.md with:
- Target profile
- Daily work
- Interview patterns
- Company examples
- Real interview questions
```

**4. Define Stacks**
```json
{
  "stacks": [
    {
      "id": "django-basics",
      "priority": "high",
      "interviewFrequency": "85%",
      "realWorldUsage": "90%"
    }
  ]
}
```

**5. Generate Questions**
```bash
npx tsx scripts/domainCrafter.ts generate python-backend-1-3 django-basics
```

---

## 🎨 Specialization by Experience Level

### 1-3 Years Focus
```
✅ Practical skills
✅ Framework usage
✅ Common patterns
✅ Basic debugging
✅ Team collaboration
❌ Architecture design
❌ Performance tuning
❌ Leadership
```

### 5+ Years Focus
```
✅ Architecture patterns
✅ Performance optimization
✅ System design
✅ Production debugging
✅ Technical leadership
✅ Scaling challenges
❌ Basic syntax
❌ Framework tutorials
```

---

## 📈 Growth Path Visualization

```
Junior (0-1) → Mid (1-3) → Senior (3-5) → Staff (5+)
     ↓            ↓            ↓            ↓
  Basics     Practical    Advanced    Architecture
  Syntax      Patterns     Internals   System Design
  Learning    Shipping     Optimizing  Leading
```

Each level has DIFFERENT stacks and focuses.

---

## 🎯 Next Steps

### Phase 1: Craft First Domain (Java Backend 1-3)
1. ✅ Write deep domain-definition.md
2. ✅ Define 20-25 stacks for this level
3. ✅ Generate questions
4. ✅ Validate quality

### Phase 2: Craft Second Domain (Java Backend 5+)
1. Write different domain-definition.md
2. Define 25-30 different stacks
3. Generate senior-level questions
4. Compare with 1-3 to ensure proper differentiation

### Phase 3: Scale to Other Languages
1. Python Backend 1-3
2. Python Backend 5+
3. React Frontend 1-3
4. React Frontend 5+
... and so on

---

## 💡 The Power of Specialization

### Generic Approach (Bad):
```
"Java Backend" domain
  → Same stacks for everyone
  → Junior and Senior see same questions
  → No specialization
```

### Specialized Approach (Good):
```
"Java Backend 1-3 Years"
  → Stacks focused on daily practical work
  → Questions about framework usage, debugging
  → Interview patterns for this level

"Java Backend 5+ Years"
  → Stacks focused on architecture, leadership
  → Questions about system design, optimization
  → Interview patterns for senior roles
```

---

## 🗂️ Total Domain Count

Instead of 64 domains, we'll have:

**~128-192 specialized domains**:
- Each technology × Experience levels
- Java Backend: 1-3, 3-5, 5+
- Python Backend: 1-3, 3-5, 5+
- React Frontend: 1-3, 3-5, 5+
- etc.

**Each one deeply specialized and crafted individually.**

---

*This structure ensures quality + specialization + scalability*