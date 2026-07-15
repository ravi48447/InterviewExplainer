# 📂 Current Folder Structure (As Built)

## 🗂️ Visual Tree

```
InterviewExplainer/
│
├── content/                                    ← Main content folder
│   │
│   ├── 📖 MASTER_CONTENT_PHILOSOPHY.md        ← Layer 1: Universal principles
│   ├── 📖 FOLDER_STRUCTURE.md                 ← This architecture guide
│   ├── 📖 README.md                            ← Content system overview
│   │
│   ├── 📁 templates/                           ← Copy these for new domains
│   │   └── domain-template.json
│   │
│   ├── 📁 domains/                             ← Domain definitions
│   │   │
│   │   ├── 📂 java-backend-1-3/               ← ✅ COMPLETE EXAMPLE
│   │   │   ├── domain-definition.md           ← Layer 2: Experience specialization
│   │   │   └── domain-config.json             ← Layer 3: 20 stacks defined
│   │   │
│   │   └── 📂 java-backend/                   ← Old structure (can remove)
│   │       └── domain-config.json
│   │
│   ├── 📁 questions/                           ← Generated questions
│   │   │
│   │   ├── 📂 java-backend-1-3/               ← New structure
│   │   │   └── 📂 spring-boot-basics/
│   │   │       └── generation-prompt.md       ← ✅ Generated & ready
│   │   │
│   │   └── 📂 java-backend/                   ← Old structure (can remove)
│   │       └── 📂 spring-boot/
│   │           └── generation-prompt.md
│   │
│   ├── 📁 answers/                             ← Phase 2 (Future)
│   │   └── (empty - will add later)
│   │
│   ├── 📁 imports/                             ← SQL import scripts
│   │   └── (empty - generated as needed)
│   │
│   └── 📁 logs/                                ← Generation tracking
│       └── (empty - auto-generated)
│
├── scripts/                                     ← Generation scripts
│   ├── domainAwareGenerator.ts                 ← ✅ Main generator (connects 3 layers)
│   ├── intelligentQuestionGenerator.ts         ← Old version
│   ├── masterQuestionGenerator.ts              ← Old version
│   ├── contentWorkflow.ts                      ← Workflow helper
│   ├── importToDatabase.ts                     ← Database import
│   └── questionGenerationSystem.ts             ← Role profiles
│
├── 📖 COMPLETE_SYSTEM_GUIDE.md                 ← How to use everything
├── 📖 IMPLEMENTATION_COMPLETE.md               ← What's been built
├── 📖 CONTENT_GENERATION_GUIDE.md              ← Original guide
│
└── (other project files...)

```

---

## ✅ What's Built (Current State)

### **Layer 1: Universal Philosophy** ✅
```
content/MASTER_CONTENT_PHILOSOPHY.md
```
- 7 universal principles
- Layer distribution (15/40/30/15)
- SEO-first approach
- Hand-crafted quality standards
- Zero overlap enforcement

---

### **Layer 2: Domain Specialization** ✅
```
content/domains/java-backend-1-3/domain-definition.md
```
- Target profile (1-3 years backend engineer)
- What they do daily
- Interview focus (40% coding, 30% framework, 20% design, 10% behavioral)
- Target companies (startups, scale-ups)
- What they DON'T need to know
- Real interview examples
- 20 stacks prioritized by interview frequency

---

### **Layer 3: Stack Definitions** ✅
```
content/domains/java-backend-1-3/domain-config.json
```
- 20 stacks with complete definitions
- Each stack has:
  - SEO keywords (primary, secondary)
  - Coverage (topics, subtopics, layers)
  - Exclusions (zero overlap)
  - Interview frequency
  - Question counts
  - Related stacks

**Stacks defined**:
1. ✅ spring-boot-basics (40q)
2. ✅ rest-api-design (35q)
3. ✅ jpa-hibernate-basics (40q)
4. ✅ java-collections-algorithms (40q)
5. ✅ sql-queries-optimization (35q)
6. ✅ testing-basics (30q)
7. ✅ java-core-basics (35q)
8. ✅ exception-handling (25q)
9. ✅ git-version-control (20q)
10. ✅ system-design-basics (25q)
11. ✅ spring-security-basics (25q)
12. ✅ docker-basics (20q)
13. ✅ performance-debugging-basics (20q)
14. ✅ api-integration (20q)
15. ✅ logging-monitoring (15q)
16. ✅ kafka-basics (15q)
17. ✅ redis-caching (15q)
18. ✅ ci-cd-basics (15q)
19. ✅ swagger-api-docs (10q)
20. ✅ behavioral-questions (20q)

**Total: 525 questions planned**

---

### **Generator Script** ✅
```
scripts/domainAwareGenerator.ts
```
- Reads all 3 layers
- Combines into comprehensive prompt
- SEO-optimized output
- Experience-level aware
- Zero overlap enforcement

---

### **Generated Output** ✅
```
content/questions/java-backend-1-3/spring-boot-basics/generation-prompt.md
```
- Complete prompt ready for Claude
- Context-aware (1-3 years, startups)
- SEO keywords integrated
- Layer distribution specified
- Quality examples included

---

## 🎯 How the Layers Connect

### **Connection Flow**:

```
1. domainAwareGenerator.ts
        ↓
2. Reads MASTER_CONTENT_PHILOSOPHY.md (universal quality)
        ↓
3. Reads domain-definition.md (1-3 years specialization)
        ↓
4. Reads domain-config.json (spring-boot-basics scope)
        ↓
5. Generates generation-prompt.md (combines all 3 layers)
        ↓
6. Copy to Claude → Get questions → Save to questions.json
```

---

## 📋 File Purposes

| File | Purpose | Status |
|------|---------|--------|
| **content/MASTER_CONTENT_PHILOSOPHY.md** | Universal quality standards for ALL domains | ✅ Complete |
| **content/domains/java-backend-1-3/domain-definition.md** | 1-3 years experience specialization | ✅ Complete |
| **content/domains/java-backend-1-3/domain-config.json** | 20 stacks with SEO & coverage | ✅ Complete |
| **scripts/domainAwareGenerator.ts** | Connects all 3 layers | ✅ Working |
| **content/questions/java-backend-1-3/spring-boot-basics/generation-prompt.md** | Generated prompt | ✅ Ready to use |

---

## 🚀 Quick Commands

### **Generate Prompt**
```bash
npx tsx scripts/domainAwareGenerator.ts generate java-backend-1-3 spring-boot-basics
```

### **View Structure**
```bash
# Show full tree
tree -L 4 -I 'node_modules|.git|target' content/

# Or just list
ls -R content/
```

### **Create New Domain**
```bash
# 1. Create folder
mkdir -p content/domains/python-backend-1-3

# 2. Copy template
cp content/templates/domain-template.json content/domains/python-backend-1-3/domain-config.json

# 3. Write domain-definition.md
# (manually - requires research)

# 4. Generate prompts
npx tsx scripts/domainAwareGenerator.ts generate python-backend-1-3 django-basics
```

---

## 🗂️ Clean Structure (Recommended Actions)

### **Keep**:
- ✅ `content/domains/java-backend-1-3/` (new structure)
- ✅ `content/questions/java-backend-1-3/` (new structure)
- ✅ `scripts/domainAwareGenerator.ts` (main generator)

### **Can Remove** (old experiments):
- ⚠️ `content/domains/java-backend/` (old non-experience-level version)
- ⚠️ `content/questions/java-backend/` (old structure)
- ⚠️ `scripts/intelligentQuestionGenerator.ts` (superseded)
- ⚠️ `scripts/masterQuestionGenerator.ts` (superseded)

### **Keep for Reference**:
- 📖 All .md guide files
- 📖 `scripts/contentWorkflow.ts` (useful helper)
- 📖 `scripts/importToDatabase.ts` (needed for database import)

---

## 📊 What to Build Next

### **Immediate**:
1. Generate questions for spring-boot-basics
   ```bash
   npx tsx scripts/domainAwareGenerator.ts generate java-backend-1-3 spring-boot-basics
   # Copy prompt to Claude → Get JSON → Save questions.json
   ```

2. Generate for other critical stacks:
   - rest-api-design
   - jpa-hibernate-basics
   - java-collections-algorithms
   - sql-queries-optimization

### **This Week**:
1. Complete all 20 stacks for java-backend-1-3
2. Import to database
3. Test on UI

### **This Month**:
1. Create java-backend-5-plus domain (different focus!)
2. Create python-backend-1-3 domain
3. Create react-frontend-1-3 domain

---

## 🎯 The System In Action

### **Example: Generate Spring Boot Questions**

**Step 1: Run generator**
```bash
npx tsx scripts/domainAwareGenerator.ts generate java-backend-1-3 spring-boot-basics
```

**Step 2: What it does**
1. Reads `MASTER_CONTENT_PHILOSOPHY.md` → Gets universal quality standards
2. Reads `domain-definition.md` → Understands this is for 1-3 years engineers at startups
3. Reads `domain-config.json` → Gets exact Spring Boot scope (controllers, DI, auto-config)
4. Combines all 3 → Generates specialized prompt
5. Saves to `questions/java-backend-1-3/spring-boot-basics/generation-prompt.md`

**Step 3: Prompt includes**
- ✅ "You're generating for 1-3 years backend engineer"
- ✅ "Target companies: startups, scale-ups"
- ✅ "90% of interviews ask this stack"
- ✅ "Cover: Controllers, DI, auto-config, properties"
- ✅ "Exclude: Spring Data JPA, Spring Security"
- ✅ "SEO keywords: spring boot interview questions mid level"
- ✅ "Difficulty: 20% easy, 60% medium, 20% hard"
- ✅ "Layer: 15% surface, 40% practical, 30% internal, 15% production"

**Step 4: Copy to Claude → Get 40 perfect questions!**

---

## 🎉 Summary

### **Current State**:
```
✅ 1 Universal Philosophy (quality for all)
✅ 1 Complete Domain (java-backend-1-3 with 20 stacks)
✅ 1 Working Generator (connects all layers)
✅ 1 Generated Prompt (spring-boot-basics ready)
⏳ 0 Question Sets (need to generate from prompts)
```

### **Folder Structure**:
```
content/
├── MASTER_CONTENT_PHILOSOPHY.md           ← Layer 1
├── domains/java-backend-1-3/
│   ├── domain-definition.md               ← Layer 2
│   └── domain-config.json                 ← Layer 3
├── questions/java-backend-1-3/
│   └── spring-boot-basics/
│       └── generation-prompt.md           ← Generated
└── templates/ (for new domains)
```

### **Ready to Scale**:
- ✅ Architecture proven
- ✅ One domain complete
- ✅ Generator working
- ✅ Can replicate for 100+ domains

---

*Clear structure. Connected layers. Ready to generate thousands of high-quality questions.*