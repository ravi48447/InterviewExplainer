# Interview Questions Data Schema

## Hierarchy
```
Domain (64 total)
  └── Stacks (5-10 per domain)
       └── Questions (30-50 per stack)
```

## JSON Structure

### Domain
```json
{
  "id": "java-backend-1-3",
  "name": "Java Backend Development",
  "slug": "java-backend-1-3",
  "description": "Master Java backend with Spring Boot, microservices, and cloud",
  "level": "Mid to Senior",
  "icon": "Code2",
  "color": "orange",
  "stacks": [...]
}
```

### Stack
```json
{
  "id": "spring-boot-basics",
  "name": "Spring Boot Fundamentals",
  "slug": "spring-boot",
  "description": "Core Spring Boot concepts and patterns",
  "priority": 2,
  "questions": [...]
}
```

### Question
```json
{
  "id": "spring-boot-autoconfiguration",
  "title": "How does Spring Boot auto-configuration work?",
  "slug": "spring-boot-autoconfiguration",
  "question": "Explain the mechanism behind Spring Boot auto-configuration and how you can customize it.",
  "answer": "Spring Boot auto-configuration uses @EnableAutoConfiguration...",
  "explanation": "This demonstrates understanding of Spring Boot's core magic...",
  "codeExample": "```java\n@SpringBootApplication\npublic class App {...}\n```",
  "difficulty": "medium",
  "importance": "high",
  "keywords": ["@EnableAutoConfiguration", "@Conditional", "spring.factories"],
  "relatedTopics": ["dependency-injection", "spring-context"],
  "commonMistakes": [
    "Forgetting that auto-configuration runs AFTER user configuration",
    "Not understanding @Conditional annotations"
  ],
  "followUpQuestions": [
    "How do you exclude specific auto-configurations?",
    "What's the difference between @ConditionalOnMissingBean and @ConditionalOnBean?"
  ],
  "realWorldScenario": "When building a multi-tenant application...",
  "tags": ["spring-boot", "configuration", "annotations"]
}
```

## Estimation
- **64 domains** × **7 stacks avg** × **40 questions avg** = **~17,920 questions**
- At 5 min per question (with AI help) = **~1,500 hours** (manual)
- With smart automation = **~200-300 hours** (generation + review)