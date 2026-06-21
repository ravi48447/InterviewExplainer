# Interview Questions Data Structure

## Folder Organization

```
data/
├── domains/                    # Domain definitions and metadata
│   ├── java-backend.json      # Domain config
│   ├── python-backend.json
│   └── react-frontend.json
│
├── questions/                  # Actual questions organized by domain
│   ├── java-backend/
│   │   ├── core-java/
│   │   │   ├── questions.json      # All questions for this stack
│   │   │   └── metadata.json       # Stack metadata
│   │   ├── spring-boot/
│   │   └── microservices/
│   │
│   ├── python-backend/
│   └── react-frontend/
│
├── generation-logs/            # Track what was generated when
│   ├── 2024-03-27-java-backend.log
│   └── generation-tracker.json
│
└── README.md                   # This file
```

## File Formats

### Domain Config (`domains/*.json`)
```json
{
  "id": "java-backend",
  "name": "Java Backend Development",
  "slug": "java-backend",
  "description": "Master Java backend with Spring Boot",
  "level": "Mid to Senior",
  "icon": "Code2",
  "color": "orange",
  "targetRoles": ["backend-engineer"],
  "stacks": [
    {
      "id": "core-java",
      "name": "Core Java",
      "slug": "core-java",
      "priority": 1,
      "targetQuestions": 40,
      "status": "pending"
    }
  ],
  "totalQuestions": 0,
  "generatedDate": null,
  "status": "pending"
}
```

### Questions File (`questions/{domain}/{stack}/questions.json`)
```json
[
  {
    "id": "java-hashmap-concurrency",
    "title": "HashMap vs ConcurrentHashMap",
    "slug": "hashmap-vs-concurrenthashmap",
    "question": "Explain the key differences...",
    "answer": "HashMap is not thread-safe...",
    "explanation": "This tests understanding of...",
    "codeExample": "```java\n...\n```",
    "difficulty": "medium",
    "importance": "high",
    "keywords": ["thread-safe", "concurrent"],
    "relatedTopics": ["multithreading"],
    "commonMistakes": ["..."],
    "followUpQuestions": ["..."],
    "realWorldScenario": "...",
    "tags": ["java", "concurrency"]
  }
]
```

### Generation Tracker (`generation-logs/generation-tracker.json`)
```json
{
  "totalDomains": 64,
  "completedDomains": 2,
  "totalQuestions": 87,
  "lastGenerated": "2024-03-27T10:30:00Z",
  "domains": {
    "java-backend": {
      "status": "completed",
      "questionCount": 40,
      "generatedDate": "2024-03-27",
      "quality Score": 95
    }
  }
}
```

## Generation Status

Track progress in `generation-logs/generation-tracker.json`

- **pending**: Not started
- **in-progress**: Currently generating
- **review**: Generated, needs manual review
- **completed**: Reviewed and approved
- **needs-update**: Needs improvement

## Quality Standards

Each question must have:
- ✅ Clear, specific title
- ✅ Interview-style question
- ✅ Comprehensive answer (30-200 words)
- ✅ Code example (if applicable)
- ✅ 5-8 keywords
- ✅ Real-world scenario
- ✅ Common mistakes
- ✅ Quality score > 80

## Usage

### Generate Questions
```bash
npm run generate:questions -- --domain java-backend --stack core-java
```

### Validate Questions
```bash
npm run validate:questions -- --domain java-backend
```

### Export to Database
```bash
npm run export:database
```