package com.interviewexplainer.backendapi.infrastructure.seeding.content;

import com.interviewexplainer.backendapi.modules.content.entity.enums.AnswerSectionType;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Intelligent Question Generator - Creates experience-level appropriate Q&A content
 * Only includes relevant sections, not formulaic
 */
@Service
public class IntelligentQuestionGenerator {

    /**
     * Generate top 10 essential questions for a stack in a specific domain
     * @param stackSlug - e.g., "spring-boot"
     * @param stackName - e.g., "Spring Boot"
     * @param domainSlug - e.g., "java-backend-1-3" (ensures unique slugs per domain)
     * @param experienceLevel - e.g., "1-3", "3-5"
     */
    public List<QuestionContent> generateQuestionsForStack(String stackSlug, String stackName, String domainSlug, String experienceLevel) {
        List<QuestionContent> questions = new ArrayList<>();

        // Generate questions based on stack and experience
        questions.addAll(generateCoreQuestions(stackSlug, stackName, domainSlug, experienceLevel));

        // Return top 10 most important
        return questions.subList(0, Math.min(10, questions.size()));
    }

    private List<QuestionContent> generateCoreQuestions(String stackSlug, String stackName, String domainSlug, String experienceLevel) {
        List<QuestionContent> questions = new ArrayList<>();

        switch (stackSlug) {
            case "spring-boot":
                questions.addAll(generateSpringBootQuestions(domainSlug, experienceLevel));
                break;
            // More stack-specific generators will be added here
            // case "react":
            //     questions.addAll(generateReactQuestions(domainSlug, experienceLevel));
            //     break;
            default:
                questions.addAll(generateGenericQuestions(stackSlug, stackName, domainSlug, experienceLevel));
        }

        return questions;
    }

    // ==================== Spring Boot Questions ====================

    private List<QuestionContent> generateSpringBootQuestions(String domainSlug, String experienceLevel) {
        List<QuestionContent> questions = new ArrayList<>();

        // Currently implementing high-quality questions
        questions.add(createSpringBootBasicsQuestion(domainSlug));
        questions.add(createDependencyInjectionQuestion(domainSlug));

        // Fill remaining 8 with generic questions for now
        for (int i = 3; i <= 10; i++) {
            questions.add(createPlaceholderQuestion("spring-boot", "Spring Boot", domainSlug, i, experienceLevel));
        }

        return questions;
    }

    private QuestionContent createSpringBootBasicsQuestion(String domainSlug) {
        QuestionContent q = new QuestionContent(
            "What is Spring Boot and how does it simplify application development?",
            domainSlug + "-spring-boot-basics",
            "EASY"
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            "Spring Boot is a framework that simplifies Spring application development by providing auto-configuration, " +
            "embedded servers, and production-ready features out of the box. Instead of writing extensive XML configuration " +
            "or Java config classes, Spring Boot uses sensible defaults based on your classpath dependencies, letting you " +
            "focus on business logic rather than boilerplate setup.");

        q.addSection(AnswerSectionType.core_concepts, 2,
            "## Key Concepts\n\n" +
            "### 1. Auto-Configuration\n" +
            "Spring Boot automatically configures your application based on the dependencies you've added:\n" +
            "- Add `spring-boot-starter-web` → Web server auto-configured\n" +
            "- Add `spring-boot-starter-data-jpa` → Database connection auto-configured\n" +
            "- Add `H2` dependency → In-memory database auto-configured\n\n" +
            "### 2. Starter Dependencies\n" +
            "Pre-packaged dependency bundles that include everything you need:\n" +
            "```xml\n" +
            "<dependency>\n" +
            "    <groupId>org.springframework.boot</groupId>\n" +
            "    <artifactId>spring-boot-starter-web</artifactId>\n" +
            "</dependency>\n" +
            "```\n\n" +
            "This single dependency pulls in:\n" +
            "- Spring MVC\n" +
            "- Embedded Tomcat\n" +
            "- JSON processing (Jackson)\n" +
            "- All required dependencies\n\n" +
            "### 3. Embedded Servers\n" +
            "No need to deploy WAR files - your application is a runnable JAR with embedded Tomcat/Jetty.\n\n" +
            "### 4. Production-Ready Features\n" +
            "Built-in health checks, metrics, and monitoring through Spring Boot Actuator.");

        q.addSection(AnswerSectionType.code_example, 3,
            "```java\n" +
            "// Minimal Spring Boot Application\n" +
            "@SpringBootApplication  // Combines @Configuration + @EnableAutoConfiguration + @ComponentScan\n" +
            "public class MyApplication {\n" +
            "    public static void main(String[] args) {\n" +
            "        SpringApplication.run(MyApplication.class, args);\n" +
            "    }\n" +
            "}\n" +
            "\n" +
            "// Simple REST Controller\n" +
            "@RestController\n" +
            "@RequestMapping(\"/api/users\")\n" +
            "public class UserController {\n" +
            "    \n" +
            "    @Autowired\n" +
            "    private UserService userService;\n" +
            "    \n" +
            "    @GetMapping\n" +
            "    public List<User> getAllUsers() {\n" +
            "        return userService.findAll();\n" +
            "    }\n" +
            "    \n" +
            "    @PostMapping\n" +
            "    public ResponseEntity<User> createUser(@RequestBody User user) {\n" +
            "        User saved = userService.save(user);\n" +
            "        return ResponseEntity.status(HttpStatus.CREATED).body(saved);\n" +
            "    }\n" +
            "}\n" +
            "```\n\n" +
            "**application.properties:**\n" +
            "```properties\n" +
            "# Server configuration\n" +
            "server.port=8080\n" +
            "spring.application.name=my-service\n" +
            "\n" +
            "# Database configuration\n" +
            "spring.datasource.url=jdbc:postgresql://localhost:5432/mydb\n" +
            "spring.datasource.username=user\n" +
            "spring.datasource.password=password\n" +
            "\n" +
            "# JPA configuration\n" +
            "spring.jpa.hibernate.ddl-auto=update\n" +
            "spring.jpa.show-sql=true\n" +
            "```");

        q.addSection(AnswerSectionType.detailed_explanation, 4,
            "## Spring Boot vs Traditional Spring\n\n" +
            "| Aspect | Traditional Spring | Spring Boot |\n" +
            "|--------|-------------------|-------------|\n" +
            "| Configuration | Manual XML/Java config | Auto-configuration |\n" +
            "| Dependencies | Individual JARs | Starter dependencies |\n" +
            "| Server | External (Tomcat/Jetty) | Embedded |\n" +
            "| Deployment | WAR file | Executable JAR |\n" +
            "| Setup Time | Hours/Days | Minutes |\n" +
            "| Production Features | Manual setup | Built-in (Actuator) |");

        q.addSection(AnswerSectionType.interview_tips, 5,
            "**Key Points to Mention:**\n" +
            "1. Emphasize \"convention over configuration\" - Spring Boot uses sensible defaults\n" +
            "2. Mention the three main features: Auto-configuration, Starters, Embedded servers\n" +
            "3. Explain how it reduces boilerplate and speeds up development\n" +
            "4. Give a real example: \"In my project, we reduced setup time from 2 days to 30 minutes\"\n\n" +
            "**Common Follow-ups to Prepare:**\n" +
            "- How does auto-configuration work internally?\n" +
            "- What is the @SpringBootApplication annotation?\n" +
            "- How do you customize auto-configuration?\n" +
            "- When would you NOT use Spring Boot?");

        q.addSection(AnswerSectionType.common_mistakes, 6,
            "❌ **Mistake 1: Over-relying on auto-configuration without understanding it**\n" +
            "- Issue: Developers don't understand what's happening behind the scenes\n" +
            "- Fix: Use `--debug` flag or enable `logging.level.org.springframework.boot.autoconfigure=DEBUG` to see auto-configuration report\n\n" +
            "❌ **Mistake 2: Not using profiles for environment-specific configs**\n" +
            "- Issue: Same configuration for dev, staging, prod\n" +
            "- Fix: Use `application-dev.properties`, `application-prod.properties`\n\n" +
            "❌ **Mistake 3: Including both spring-boot-starter-web and spring-boot-starter-webflux**\n" +
            "- Issue: Conflicts between reactive and servlet stacks\n" +
            "- Fix: Choose one stack based on your needs");

        return q;
    }

    private QuestionContent createDependencyInjectionQuestion(String domainSlug) {
        QuestionContent q = new QuestionContent(
            "Explain Dependency Injection in Spring Boot with examples",
            domainSlug + "-spring-dependency-injection",
            "EASY"
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            "Dependency Injection is a design pattern where Spring manages object creation and injects dependencies into your classes, " +
            "rather than you creating them manually. Spring Boot supports three types: Constructor Injection (recommended), " +
            "Setter Injection, and Field Injection. Constructor injection is preferred because it makes dependencies explicit, " +
            "enables immutability, and makes testing easier.");

        q.addSection(AnswerSectionType.core_concepts, 2,
            "## What is Dependency Injection?\n\n" +
            "Instead of:\n" +
            "```java\n" +
            "public class UserService {\n" +
            "    private UserRepository repo = new UserRepository(); // ❌ Tight coupling\n" +
            "}\n" +
            "```\n\n" +
            "You let Spring inject it:\n" +
            "```java\n" +
            "@Service\n" +
            "public class UserService {\n" +
            "    private final UserRepository repo; // ✅ Injected by Spring\n" +
            "    \n" +
            "    public UserService(UserRepository repo) {\n" +
            "        this.repo = repo;\n" +
            "    }\n" +
            "}\n" +
            "```\n\n" +
            "## Benefits\n" +
            "1. **Loose Coupling** - Classes don't create their own dependencies\n" +
            "2. **Testability** - Easy to mock dependencies in unit tests\n" +
            "3. **Flexibility** - Easy to swap implementations\n" +
            "4. **Maintainability** - Changes in one class don't break others");

        q.addSection(AnswerSectionType.code_implementation, 3,
            "## Three Types of Dependency Injection\n\n" +
            "### 1. Constructor Injection (✅ Recommended)\n" +
            "```java\n" +
            "@Service\n" +
            "public class OrderService {\n" +
            "    private final OrderRepository orderRepository;\n" +
            "    private final PaymentService paymentService;\n" +
            "    private final EmailService emailService;\n" +
            "    \n" +
            "    // Spring automatically injects all dependencies\n" +
            "    public OrderService(OrderRepository orderRepository,\n" +
            "                       PaymentService paymentService,\n" +
            "                       EmailService emailService) {\n" +
            "        this.orderRepository = orderRepository;\n" +
            "        this.paymentService = paymentService;\n" +
            "        this.emailService = emailService;\n" +
            "    }\n" +
            "    \n" +
            "    public void processOrder(Order order) {\n" +
            "        orderRepository.save(order);\n" +
            "        paymentService.charge(order.getAmount());\n" +
            "        emailService.sendConfirmation(order);\n" +
            "    }\n" +
            "}\n" +
            "```\n\n" +
            "**Why Constructor Injection is Best:**\n" +
            "- Dependencies are final (immutable)\n" +
            "- All required dependencies are explicit\n" +
            "- Easy to test (no reflection needed)\n" +
            "- NPE-safe\n\n" +
            "### 2. Setter Injection\n" +
            "```java\n" +
            "@Service\n" +
            "public class NotificationService {\n" +
            "    private EmailService emailService;\n" +
            "    \n" +
            "    @Autowired  // Optional dependencies\n" +
            "    public void setEmailService(EmailService emailService) {\n" +
            "        this.emailService = emailService;\n" +
            "    }\n" +
            "}\n" +
            "```\n" +
            "Use only for optional dependencies.\n\n" +
            "### 3. Field Injection (❌ Not Recommended)\n" +
            "```java\n" +
            "@Service\n" +
            "public class UserService {\n" +
            "    @Autowired\n" +
            "    private UserRepository userRepository; // Hard to test\n" +
            "}\n" +
            "```\n" +
            "**Problems:**\n" +
            "- Can't make fields final\n" +
            "- Hard to test (requires reflection or Spring context)\n" +
            "- Hides dependencies");

        q.addSection(AnswerSectionType.detailed_explanation, 4,
            "**Comparison of DI Types:**\n\n" +
            "| Type | When to Use | Pros | Cons |\n" +
            "|------|------------|------|------|\n" +
            "| Constructor | Always (required deps) | Immutable, testable, explicit | Verbose for many dependencies |\n" +
            "| Setter | Optional dependencies | Flexible | Mutable state, can forget to call |\n" +
            "| Field | Never (legacy code only) | Concise | Hard to test, not explicit |");

        q.addSection(AnswerSectionType.interview_tips, 5,
            "**What to Say:**\n" +
            "1. Start with the definition: \"DI is when Spring manages object creation and injects them\"\n" +
            "2. Immediately mention Constructor Injection as the best practice\n" +
            "3. Explain WHY it's better: immutability, testability, explicitness\n" +
            "4. Give a real example from your experience\n\n" +
            "**Strong Answer Template:**\n" +
            "\"In my recent project, we used constructor injection for all services. For example, our OrderService " +
            "had dependencies on OrderRepository, PaymentService, and EmailService. By using constructor injection, " +
            "we made all dependencies final and explicit, which made unit testing straightforward - we could easily " +
            "pass mock objects without needing a Spring context.\"");

        return q;
    }

    // ... More Spring Boot questions would be added here ...

    // ==================== Generic Question Generator ====================

    private List<QuestionContent> generateGenericQuestions(String stackSlug, String stackName, String domainSlug, String experienceLevel) {
        List<QuestionContent> questions = new ArrayList<>();

        // Generate 10 essential questions for any stack - domain-specific for SEO
        questions.add(createGenericOverviewQuestion(stackSlug, stackName, domainSlug));
        questions.add(createGenericUseCaseQuestion(stackSlug, stackName, domainSlug));
        questions.add(createGenericBestPracticesQuestion(stackSlug, stackName, domainSlug));
        questions.add(createGenericComparisonQuestion(stackSlug, stackName, domainSlug));
        questions.add(createGenericArchitectureQuestion(stackSlug, stackName, domainSlug, experienceLevel));
        questions.add(createGenericPerformanceQuestion(stackSlug, stackName, domainSlug, experienceLevel));
        questions.add(createGenericSecurityQuestion(stackSlug, stackName, domainSlug));
        questions.add(createGenericTroubleshootingQuestion(stackSlug, stackName, domainSlug));
        questions.add(createGenericScalingQuestion(stackSlug, stackName, domainSlug, experienceLevel));
        questions.add(createGenericIntegrationQuestion(stackSlug, stackName, domainSlug));

        return questions;
    }

    private QuestionContent createGenericOverviewQuestion(String stackSlug, String stackName, String domainSlug) {
        QuestionContent q = new QuestionContent(
            String.format("What is %s and when should you use it?", stackName),
            domainSlug + "-" + stackSlug + "-overview",
            "EASY"
        );

        q.addSection(AnswerSectionType.short_summary, 1,
            String.format("%s is a technology/framework used in modern software development. It provides solutions for " +
            "specific technical challenges and is commonly used in production environments.", stackName));

        q.addSection(AnswerSectionType.core_concepts, 2,
            String.format("## Core Features of %s\n\n" +
            "1. **Primary Purpose**: Solves specific technical problems\n" +
            "2. **Key Benefits**: Improves development efficiency\n" +
            "3. **Common Use Cases**: Production applications\n" +
            "4. **Integration**: Works well with other technologies", stackName));

        return q;
    }

    private QuestionContent createGenericUseCaseQuestion(String stackSlug, String stackName, String domainSlug) {
        QuestionContent q = new QuestionContent(
            String.format("What are the common use cases for %s?", stackName),
            domainSlug + "-" + stackSlug + "-use-cases",
            "MEDIUM"
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("%s is commonly used in scenarios requiring specific technical capabilities. " +
            "Popular use cases include building scalable applications, improving development productivity, " +
            "and solving domain-specific challenges.", stackName));

        q.addSection(AnswerSectionType.core_concepts, 2,
            String.format("## Common Use Cases for %s\n\n" +
            "1. **Production Applications**: Enterprise-grade systems\n" +
            "2. **Development Workflows**: Streamlined development processes\n" +
            "3. **Integration Scenarios**: Connecting with other systems\n" +
            "4. **Performance Optimization**: High-throughput requirements", stackName));

        return q;
    }

    private QuestionContent createGenericBestPracticesQuestion(String stackSlug, String stackName, String domainSlug) {
        QuestionContent q = new QuestionContent(
            String.format("What are the best practices when working with %s?", stackName),
            domainSlug + "-" + stackSlug + "-best-practices",
            "MEDIUM"
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("When working with %s, follow industry best practices for code quality, " +
            "maintainability, and performance. Key practices include proper configuration, testing, " +
            "and following established patterns.", stackName));

        q.addSection(AnswerSectionType.interview_tips, 2,
            String.format("**Best Practices for %s:**\n\n" +
            "✅ Follow framework conventions\n" +
            "✅ Write comprehensive tests\n" +
            "✅ Use proper error handling\n" +
            "✅ Document your code\n" +
            "✅ Optimize for performance\n" +
            "✅ Keep dependencies updated", stackName));

        return q;
    }

    // ... More generic question generators ...

    private QuestionContent createGenericComparisonQuestion(String stackSlug, String stackName, String domainSlug) {
        QuestionContent q = new QuestionContent(
            String.format("How does %s compare to alternatives?", stackName),
            domainSlug + "-" + stackSlug + "-comparison",
            "MEDIUM"
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("%s has unique strengths compared to alternatives. Understanding the trade-offs " +
            "helps in choosing the right tool for your needs.", stackName));

        q.addSection(AnswerSectionType.detailed_explanation, 2,
            String.format("## %s vs Alternatives\n\n" +
            "| Feature | %s | Alternatives |\n" +
            "|---------|%s|-------------|\n" +
            "| Learning Curve | Varies | Varies |\n" +
            "| Performance | Optimized | Depends |\n" +
            "| Community | Strong | Growing |\n" +
            "| Use Cases | Specific | General |", stackName, stackName, "-".repeat(stackName.length())));

        return q;
    }

    private QuestionContent createGenericArchitectureQuestion(String stackSlug, String stackName, String domainSlug, String experienceLevel) {
        String difficulty = experienceLevel.equals("5+") ? "HARD" : "MEDIUM";
        QuestionContent q = new QuestionContent(
            String.format("Explain the architecture and internal workings of %s", stackName),
            domainSlug + "-" + stackSlug + "-architecture",
            difficulty
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("%s follows a well-defined architecture that ensures scalability and maintainability. " +
            "Understanding its internal structure helps in effective usage and troubleshooting.", stackName));

        q.addSection(AnswerSectionType.detailed_explanation, 2,
            String.format("## Architecture Overview\n\n" +
            "%s is designed with modular components that work together:\n\n" +
            "1. **Core Layer**: Foundation and basic functionality\n" +
            "2. **Service Layer**: Business logic and operations\n" +
            "3. **Integration Layer**: External system connections\n" +
            "4. **Presentation Layer**: User interface and APIs", stackName));

        return q;
    }

    private QuestionContent createGenericPerformanceQuestion(String stackSlug, String stackName, String domainSlug, String experienceLevel) {
        String difficulty = experienceLevel.equals("0-1") ? "MEDIUM" : "HARD";
        QuestionContent q = new QuestionContent(
            String.format("How do you optimize performance when using %s?", stackName),
            domainSlug + "-" + stackSlug + "-performance",
            difficulty
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("Performance optimization in %s involves multiple strategies including caching, " +
            "efficient queries, and proper resource management.", stackName));

        q.addSection(AnswerSectionType.interview_tips, 2,
            String.format("**Performance Optimization for %s:**\n\n" +
            "1. **Caching**: Implement appropriate caching strategies\n" +
            "2. **Resource Management**: Optimize memory and CPU usage\n" +
            "3. **Indexing**: Use proper indexing for data access\n" +
            "4. **Monitoring**: Track performance metrics\n" +
            "5. **Load Testing**: Validate under realistic conditions", stackName));

        return q;
    }

    private QuestionContent createGenericSecurityQuestion(String stackSlug, String stackName, String domainSlug) {
        QuestionContent q = new QuestionContent(
            String.format("What are the security considerations when using %s?", stackName),
            domainSlug + "-" + stackSlug + "-security",
            "MEDIUM"
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("Security in %s requires attention to authentication, authorization, data protection, " +
            "and vulnerability prevention.", stackName));

        q.addSection(AnswerSectionType.common_mistakes, 2,
            String.format("**Security Best Practices for %s:**\n\n" +
            "✅ Implement proper authentication\n" +
            "✅ Use encryption for sensitive data\n" +
            "✅ Keep dependencies updated\n" +
            "✅ Follow principle of least privilege\n\n" +
            "❌ **Avoid:**\n" +
            "❌ Storing credentials in code\n" +
            "❌ Ignoring security updates\n" +
            "❌ Weak authentication mechanisms", stackName));

        return q;
    }

    private QuestionContent createGenericTroubleshootingQuestion(String stackSlug, String stackName, String domainSlug) {
        QuestionContent q = new QuestionContent(
            String.format("How do you troubleshoot common issues in %s?", stackName),
            domainSlug + "-" + stackSlug + "-troubleshooting",
            "MEDIUM"
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("Troubleshooting %s requires systematic debugging, log analysis, and understanding " +
            "common failure patterns.", stackName));

        q.addSection(AnswerSectionType.interview_tips, 2,
            String.format("**Troubleshooting Approach for %s:**\n\n" +
            "1. **Check Logs**: Review error messages and stack traces\n" +
            "2. **Verify Configuration**: Ensure proper setup\n" +
            "3. **Test Connectivity**: Check network and dependencies\n" +
            "4. **Use Debug Tools**: Leverage built-in debugging\n" +
            "5. **Reproduce Issue**: Create minimal test case", stackName));

        return q;
    }

    private QuestionContent createGenericScalingQuestion(String stackSlug, String stackName, String domainSlug, String experienceLevel) {
        String difficulty = experienceLevel.equals("5+") || experienceLevel.equals("3-5") ? "HARD" : "MEDIUM";
        QuestionContent q = new QuestionContent(
            String.format("How do you scale applications using %s?", stackName),
            domainSlug + "-" + stackSlug + "-scaling",
            difficulty
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("Scaling %s applications requires horizontal and vertical scaling strategies, " +
            "load balancing, and distributed architecture patterns.", stackName));

        q.addSection(AnswerSectionType.detailed_explanation, 2,
            String.format("## Scaling Strategies for %s\n\n" +
            "**Horizontal Scaling:**\n" +
            "- Add more instances\n" +
            "- Distribute load across servers\n" +
            "- Use load balancers\n\n" +
            "**Vertical Scaling:**\n" +
            "- Increase server resources\n" +
            "- Optimize resource usage\n\n" +
            "**Best Practices:**\n" +
            "- Stateless design\n" +
            "- Caching strategies\n" +
            "- Database optimization", stackName));

        return q;
    }

    private QuestionContent createGenericIntegrationQuestion(String stackSlug, String stackName, String domainSlug) {
        QuestionContent q = new QuestionContent(
            String.format("How does %s integrate with other tools and frameworks?", stackName),
            domainSlug + "-" + stackSlug + "-integration",
            "MEDIUM"
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("%s provides multiple integration points with other technologies through APIs, " +
            "plugins, and standard protocols.", stackName));

        q.addSection(AnswerSectionType.core_concepts, 2,
            String.format("## Integration Capabilities\n\n" +
            "%s supports integration through:\n\n" +
            "1. **REST APIs**: Standard HTTP-based communication\n" +
            "2. **Libraries/SDKs**: Native language support\n" +
            "3. **Plugins**: Extend functionality\n" +
            "4. **Webhooks**: Event-driven integration\n" +
            "5. **Message Queues**: Async communication", stackName));

        return q;
    }

    // Placeholder question generator for stacks being developed
    private QuestionContent createPlaceholderQuestion(String stackSlug, String stackName, String domainSlug, int number, String experienceLevel) {
        QuestionContent q = new QuestionContent(
            String.format("Common %s question %d for %s experience", stackName, number, experienceLevel),
            domainSlug + "-" + stackSlug + "-q" + number,
            number <= 3 ? "EASY" : (number <= 7 ? "MEDIUM" : "HARD")
        );

        q.addSection(AnswerSectionType.speakable_answer, 1,
            String.format("This is a placeholder answer for a %s question at %s experience level. " +
            "Detailed content will be added in the next iteration.", stackName, experienceLevel));

        q.addSection(AnswerSectionType.short_summary, 2,
            String.format("Key concepts related to %s will be explained here.", stackName));

        return q;
    }

    // ==================== Data Classes ====================

    public static class QuestionContent {
        private String title;
        private String slug;
        private String difficulty;
        private List<AnswerSection> sections = new ArrayList<>();

        public QuestionContent(String title, String slug, String difficulty) {
            this.title = title;
            this.slug = slug;
            this.difficulty = difficulty;
        }

        public void addSection(AnswerSectionType type, int order, String content) {
            sections.add(new AnswerSection(type, order, content));
        }

        // Getters
        public String getTitle() { return title; }
        public String getSlug() { return slug; }
        public String getDifficulty() { return difficulty; }
        public List<AnswerSection> getSections() { return sections; }
    }

    public static class AnswerSection {
        private AnswerSectionType type;
        private int order;
        private String content;

        public AnswerSection(AnswerSectionType type, int order, String content) {
            this.type = type;
            this.order = order;
            this.content = content;
        }

        // Getters
        public AnswerSectionType getType() { return type; }
        public int getOrder() { return order; }
        public String getContent() { return content; }
    }
}