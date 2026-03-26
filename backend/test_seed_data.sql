-- ============================================
-- TEST SEED DATA for InterviewExplainer
-- Quick sample data to test UI and functionality
-- ============================================

-- 1. Languages
INSERT INTO languages (name, slug, description) VALUES
    ('Java', 'java', 'Java programming language'),
    ('Python', 'python', 'Python programming language'),
    ('React', 'react', 'React JavaScript library'),
    ('Go', 'go', 'Go programming language')
ON CONFLICT (slug) DO NOTHING;

-- 2. Tracks
INSERT INTO tracks (name, slug, description) VALUES
    ('Backend', 'backend', 'Backend development track'),
    ('Frontend', 'frontend', 'Frontend development track'),
    ('Fullstack', 'fullstack', 'Full-stack development track')
ON CONFLICT (slug) DO NOTHING;

-- 3. Experience Levels
INSERT INTO experience_levels (label, min_years, max_years) VALUES
    ('0-1', 0, 1),
    ('1-3', 1, 3),
    ('3-5', 3, 5),
    ('5+', 5, 20)
ON CONFLICT (label) DO NOTHING;

-- 4. Domains (Sample combinations)
INSERT INTO domains (name, slug, description, language, track, experience_label) VALUES
    ('Java Backend 1-3', 'java-backend-1-3', 'Java Backend for 1-3 years experience', 'Java', 'Backend', '1-3'),
    ('Java Backend 3-5', 'java-backend-3-5', 'Java Backend for 3-5 years experience', 'Java', 'Backend', '3-5'),
    ('Java Fullstack 1-3', 'java-fullstack-1-3', 'Java Fullstack for 1-3 years experience', 'Java', 'Fullstack', '1-3'),
    ('Python Backend 1-3', 'python-backend-1-3', 'Python Backend for 1-3 years experience', 'Python', 'Backend', '1-3'),
    ('Python Backend 3-5', 'python-backend-3-5', 'Python Backend for 3-5 years experience', 'Python', 'Backend', '3-5'),
    ('Frontend React 1-3', 'frontend-react-1-3', 'React Frontend for 1-3 years experience', 'React', 'Frontend', '1-3')
ON CONFLICT (slug) DO NOTHING;

-- 5. Tech Stacks
INSERT INTO tech_stacks (name, slug, description, category) VALUES
    ('Spring Boot', 'spring-boot', 'Spring Boot framework', 'Framework'),
    ('JPA/Hibernate', 'jpa-hibernate', 'Java Persistence API with Hibernate', 'ORM'),
    ('REST API', 'rest-api', 'RESTful API design', 'Architecture'),
    ('Microservices', 'microservices', 'Microservices architecture', 'Architecture'),
    ('Docker', 'docker', 'Docker containerization', 'DevOps'),
    ('PostgreSQL', 'postgresql', 'PostgreSQL database', 'Database'),
    ('Django', 'django', 'Django Python framework', 'Framework'),
    ('FastAPI', 'fastapi', 'FastAPI Python framework', 'Framework'),
    ('React', 'react', 'React JavaScript library', 'Frontend'),
    ('Next.js', 'nextjs', 'Next.js React framework', 'Frontend'),
    ('TypeScript', 'typescript', 'TypeScript language', 'Language'),
    ('JavaScript', 'javascript', 'JavaScript fundamentals', 'Language')
ON CONFLICT (slug) DO NOTHING;

-- 6. Sample Questions (Java Backend)
INSERT INTO questions (title, slug, difficulty) VALUES
    ('What is Spring Boot and why is it used?', 'what-is-spring-boot', 'EASY'),
    ('Explain the difference between @Component, @Service, and @Repository', 'component-service-repository-difference', 'MEDIUM'),
    ('How does Spring Boot AutoConfiguration work?', 'spring-boot-autoconfiguration', 'MEDIUM'),
    ('What is Dependency Injection in Spring?', 'dependency-injection-spring', 'EASY'),
    ('Explain JPA Entity Lifecycle', 'jpa-entity-lifecycle', 'HARD'),
    ('How do you handle exceptions in Spring Boot REST API?', 'exception-handling-spring-boot', 'MEDIUM'),
    ('What are the differences between @RestController and @Controller?', 'restcontroller-vs-controller', 'EASY'),
    ('Explain Spring Boot Profiles', 'spring-boot-profiles', 'MEDIUM'),
    ('How does Transaction Management work in Spring?', 'spring-transaction-management', 'HARD'),
    ('What is the difference between JWT and OAuth2?', 'jwt-vs-oauth2', 'HARD')
ON CONFLICT (slug) DO NOTHING;

-- 7. Sample Questions (Python Backend)
INSERT INTO questions (title, slug, difficulty) VALUES
    ('What is Django ORM and how does it work?', 'django-orm-basics', 'MEDIUM'),
    ('Explain Python decorators with examples', 'python-decorators', 'MEDIUM'),
    ('What is the difference between Django and FastAPI?', 'django-vs-fastapi', 'EASY'),
    ('How do you handle async operations in Python?', 'python-async-operations', 'HARD'),
    ('Explain Django middleware', 'django-middleware', 'MEDIUM')
ON CONFLICT (slug) DO NOTHING;

-- 8. Sample Questions (React Frontend)
INSERT INTO questions (title, slug, difficulty) VALUES
    ('What is the Virtual DOM in React?', 'react-virtual-dom', 'EASY'),
    ('Explain useState and useEffect hooks', 'react-hooks-basics', 'MEDIUM'),
    ('What is the difference between props and state?', 'props-vs-state', 'EASY'),
    ('How does React Context API work?', 'react-context-api', 'MEDIUM'),
    ('Explain React Server Components', 'react-server-components', 'HARD')
ON CONFLICT (slug) DO NOTHING;

-- 9. Answer Sections (Sample for "What is Spring Boot")
INSERT INTO answer_sections (question_id, section_type, content, section_order)
SELECT q.id, 'BRIEF',
'Spring Boot is an open-source Java framework built on top of the Spring Framework that simplifies the development of production-ready applications. It eliminates much of the boilerplate configuration required in traditional Spring applications by providing sensible defaults and auto-configuration.

**Key Benefits:**
- **Rapid Development**: Start building applications quickly with minimal setup
- **Convention over Configuration**: Sensible defaults reduce configuration needs
- **Embedded Servers**: Built-in Tomcat/Jetty eliminates separate server deployment
- **Production-Ready**: Includes health checks, metrics, and monitoring out of the box', 1
FROM questions q WHERE q.slug = 'what-is-spring-boot';

INSERT INTO answer_sections (question_id, section_type, content, section_order)
SELECT q.id, 'DETAILED',
'## Core Features

### 1. Auto-Configuration
Spring Boot automatically configures your application based on dependencies present in the classpath. For example, if H2 database is in classpath, it automatically configures an in-memory database.

```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

### 2. Starter Dependencies
Pre-configured dependency bundles that pull in commonly used libraries:
- `spring-boot-starter-web` - Web applications with REST APIs
- `spring-boot-starter-data-jpa` - Database access with JPA
- `spring-boot-starter-security` - Authentication and authorization

### 3. Embedded Servers
No need to deploy WAR files to external servers:
```properties
server.port=8080
server.servlet.context-path=/api
```

### 4. Actuator
Production-ready features for monitoring:
```
GET /actuator/health
GET /actuator/metrics
GET /actuator/info
```

## Common Use Cases
- Microservices development
- REST API backends
- Enterprise applications
- Cloud-native applications', 2
FROM questions q WHERE q.slug = 'what-is-spring-boot';

INSERT INTO answer_sections (question_id, section_type, content, section_order)
SELECT q.id, 'EXAMPLE',
'```java
// Example: Simple REST Controller
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User saved = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
```

**application.properties:**
```properties
spring.application.name=my-app
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=user
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
```', 3
FROM questions q WHERE q.slug = 'what-is-spring-boot';

INSERT INTO answer_sections (question_id, section_type, content, section_order)
SELECT q.id, 'TIPS',
'**Best Practices:**
1. Use `@SpringBootApplication` annotation on main class
2. Organize code in packages by feature, not layer
3. Use profiles for environment-specific configuration
4. Leverage Spring Boot Actuator for monitoring
5. Use `spring-boot-devtools` for hot reload during development

**Common Pitfalls:**
- Over-relying on auto-configuration without understanding what it does
- Not using profiles properly for different environments
- Ignoring security configurations in production
- Not monitoring application health and metrics', 4
FROM questions q WHERE q.slug = 'what-is-spring-boot';

-- 10. More Answer Sections (Component vs Service vs Repository)
INSERT INTO answer_sections (question_id, section_type, content, section_order)
SELECT q.id, 'BRIEF',
'These are Spring stereotype annotations that mark classes for dependency injection:

- **@Component**: Generic stereotype for any Spring-managed component
- **@Service**: Indicates business logic layer
- **@Repository**: Indicates data access layer with exception translation

All three enable component scanning and dependency injection, but they serve different semantic purposes in your application architecture.', 1
FROM questions q WHERE q.slug = 'component-service-repository-difference';

INSERT INTO answer_sections (question_id, section_type, content, section_order)
SELECT q.id, 'DETAILED',
'## @Component
The most generic stereotype annotation. Used for any Spring-managed component that doesn''t fit into other categories.

```java
@Component
public class EmailValidator {
    public boolean isValid(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
```

## @Service
Specialized form of @Component for business logic layer.

**Purpose:**
- Holds business logic
- Calls repositories for data
- Processes and transforms data
- Applies business rules

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(UserDTO dto) {
        // Business logic here
        User user = new User();
        user.setEmail(dto.getEmail());
        return userRepository.save(user);
    }
}
```

## @Repository
Specialized for data access layer.

**Special Feature:** Enables automatic exception translation from database-specific exceptions to Spring''s DataAccessException hierarchy.

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```', 2
FROM questions q WHERE q.slug = 'component-service-repository-difference';

INSERT INTO answer_sections (question_id, section_type, content, section_order)
SELECT q.id, 'COMPARISON',
'| Annotation | Layer | Purpose | Exception Translation |
|------------|-------|---------|---------------------|
| @Component | Any | Generic component | No |
| @Service | Business | Business logic | No |
| @Repository | Data Access | Database operations | Yes |

**When to use which:**
- Use **@Repository** for DAO/Repository classes
- Use **@Service** for service/business logic classes
- Use **@Component** for utility classes, validators, helpers', 3
FROM questions q WHERE q.slug = 'component-service-repository-difference';

-- 11. Question-Stack Mapping (Link questions to stacks)
INSERT INTO question_stack_map (question_id, stack_id, relevance_score)
SELECT q.id, s.id, 100
FROM questions q, tech_stacks s
WHERE q.slug IN ('what-is-spring-boot', 'component-service-repository-difference',
                  'spring-boot-autoconfiguration', 'dependency-injection-spring',
                  'exception-handling-spring-boot', 'restcontroller-vs-controller',
                  'spring-boot-profiles', 'spring-transaction-management')
  AND s.slug = 'spring-boot'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_map (question_id, stack_id, relevance_score)
SELECT q.id, s.id, 90
FROM questions q, tech_stacks s
WHERE q.slug IN ('jpa-entity-lifecycle', 'spring-transaction-management')
  AND s.slug = 'jpa-hibernate'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_map (question_id, stack_id, relevance_score)
SELECT q.id, s.id, 95
FROM questions q, tech_stacks s
WHERE q.slug IN ('django-orm-basics', 'django-middleware')
  AND s.slug = 'django'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_map (question_id, stack_id, relevance_score)
SELECT q.id, s.id, 100
FROM questions q, tech_stacks s
WHERE q.slug IN ('react-virtual-dom', 'react-hooks-basics', 'props-vs-state',
                  'react-context-api', 'react-server-components')
  AND s.slug = 'react'
ON CONFLICT DO NOTHING;

-- 12. Domain-Stack Mapping (Link domains to relevant stacks)
INSERT INTO domain_stack_map (domain_id, stack_id)
SELECT d.id, s.id
FROM domains d, tech_stacks s
WHERE d.slug LIKE 'java-backend%'
  AND s.slug IN ('spring-boot', 'jpa-hibernate', 'rest-api', 'microservices',
                 'docker', 'postgresql')
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id)
SELECT d.id, s.id
FROM domains d, tech_stacks s
WHERE d.slug LIKE 'java-fullstack%'
  AND s.slug IN ('spring-boot', 'jpa-hibernate', 'react', 'nextjs',
                 'typescript', 'rest-api')
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id)
SELECT d.id, s.id
FROM domains d, tech_stacks s
WHERE d.slug LIKE 'python-backend%'
  AND s.slug IN ('django', 'fastapi', 'postgresql', 'rest-api', 'docker')
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id)
SELECT d.id, s.id
FROM domains d, tech_stacks s
WHERE d.slug LIKE 'frontend-react%'
  AND s.slug IN ('react', 'nextjs', 'typescript', 'javascript')
ON CONFLICT DO NOTHING;

-- 13. Mark as seeded
INSERT INTO seed_status (seed_name, version, record_count) VALUES
    ('test_data', '1.0', 20)
ON CONFLICT (seed_name) DO UPDATE SET
    loaded_at = CURRENT_TIMESTAMP,
    record_count = EXCLUDED.record_count;

-- Display summary
SELECT
    'Summary of Test Data' as info,
    (SELECT COUNT(*) FROM languages) as languages,
    (SELECT COUNT(*) FROM tracks) as tracks,
    (SELECT COUNT(*) FROM experience_levels) as experience_levels,
    (SELECT COUNT(*) FROM domains) as domains,
    (SELECT COUNT(*) FROM tech_stacks) as stacks,
    (SELECT COUNT(*) FROM questions) as questions,
    (SELECT COUNT(*) FROM answer_sections) as answer_sections;

-- Show sample data
SELECT '=== Sample Domains ===' as info;
SELECT id, name, slug, language, track, experience_label FROM domains ORDER BY id LIMIT 6;

SELECT '=== Sample Questions ===' as info;
SELECT id, title, difficulty FROM questions ORDER BY id LIMIT 10;

SELECT '=== Sample Stacks ===' as info;
SELECT id, name, slug, category FROM tech_stacks ORDER BY id LIMIT 12;