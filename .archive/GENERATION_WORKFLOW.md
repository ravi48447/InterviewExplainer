# Question Generation Workflow

## 📋 Two-Phase Approach

### **PHASE 1: Generate Questions Only** ⚡
Generate question titles + question text (NO answers yet)

**Goal**: Get 40 high-quality questions per stack
**Output**: JSON with id, title, slug, question, difficulty, tags
**Time**: ~5 minutes per stack

### **PHASE 2: Add Answers & Details** 📝
Later, go stack by stack and add:
- Answer (expert explanation)
- Code examples
- Keywords
- Common mistakes
- Real-world scenarios

**Goal**: Complete 1 stack fully before moving to next
**Time**: ~30 minutes per stack (careful curation)

---

## 🎯 Phase 1 Workflow

### Step 1: Run Generator
```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

# Syntax: <domain> <stack> <type>
# Types: core (50q), framework (40q), specialized (35q), niche (30q)

# Examples:
npx tsx scripts/generators/generateQuestionsOnly.ts "Java Backend" "Core Java" core           # 50 questions
npx tsx scripts/generators/generateQuestionsOnly.ts "Java Backend" "Spring Boot" framework   # 40 questions
npx tsx scripts/generators/generateQuestionsOnly.ts "Java Backend" "JUnit Testing" niche     # 30 questions
```

### Step 2: Copy Prompt to Claude
The script outputs a detailed prompt. Copy and paste into Claude.

### Step 3: Get JSON Response
Claude returns 40 questions in JSON format:
```json
[
  {
    "id": "java-hashmap-thread-safety",
    "title": "HashMap vs ConcurrentHashMap thread safety",
    "slug": "hashmap-concurrenthashmap",
    "question": "Explain the thread safety differences between HashMap and ConcurrentHashMap. When would you use each?",
    "difficulty": "medium",
    "importance": "high",
    "tags": ["java", "concurrency", "collections"]
  }
]
```

### Step 4: Save to File
```bash
# Create folder
mkdir -p data/questions/java-backend/core-java

# Save questions
# Copy JSON output to: data/questions/java-backend/core-java/questions-only.json
```

### Step 5: Review & Refine
- Remove duplicates
- Fix vague questions
- Ensure difficulty distribution
- Check relevance

### Step 6: Update Tracker
```bash
# Edit: data/generation-logs/generation-tracker.json
{
  "domains": {
    "java-backend": {
      "stacks": {
        "core-java": {
          "status": "questions-generated",
          "questionCount": 40,
          "generatedDate": "2024-03-27",
          "needsAnswers": true
        }
      }
    }
  }
}
```

---

## 📚 Phase 2 Workflow (Later)

### For Each Stack:

1. **Read questions** from `questions-only.json`
2. **Add answers one by one**:
   - Write expert answer (30-200 words)
   - Add code example if needed
   - List 5-8 keywords
   - Note common mistakes
   - Add real-world scenario
3. **Validate quality** (score > 80)
4. **Save complete version** to `questions-complete.json`

---

## 📊 Priority Order

### Week 1: Core Backend
1. ✅ Java Backend → Core Java (40q)
2. ✅ Java Backend → Spring Boot (40q)
3. ✅ Python Backend → Python Basics (40q)
4. ✅ Python Backend → Django/FastAPI (40q)
5. ✅ Node.js Backend → Node Fundamentals (40q)

### Week 2: Frontend
6. React → React Basics (40q)
7. React → Hooks (40q)
8. JavaScript → ES6+ (40q)
9. TypeScript → Basics (40q)
10. Next.js → Fundamentals (40q)

### Week 3: Databases
11. SQL → Queries (40q)
12. SQL → Optimization (40q)
13. PostgreSQL → Specific (40q)
14. MongoDB → NoSQL (40q)
15. Redis → Caching (40q)

### Week 4: Cloud & DevOps
16. AWS → EC2/S3/Lambda (40q)
17. Docker → Containers (40q)
18. Kubernetes → Orchestration (40q)
19. CI/CD → Pipelines (40q)
20. Terraform → IaC (40q)

---

## ✅ Quality Checklist

Before marking a stack as "complete":

**Questions Phase:**
- [ ] 40 questions generated
- [ ] No duplicates
- [ ] Difficulty distribution correct
- [ ] All questions are clear and specific
- [ ] Each has proper tags

**Answers Phase (later):**
- [ ] All answers are comprehensive
- [ ] Code examples work
- [ ] Keywords identified
- [ ] Common mistakes listed
- [ ] Real-world scenarios added
- [ ] Quality score > 80 for each

---

## 🚀 Quick Start

**Start Now:**
```bash
# Generate first batch
npx tsx scripts/generators/generateQuestionsOnly.ts "Java Backend" "Core Java"

# Copy the prompt it outputs to Claude
# Get back 40 questions
# Save to data/questions/java-backend/core-java/questions-only.json
# Repeat for next stack
```

**That's it!** Focus on questions now. Answers later.