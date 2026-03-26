-- Migration 019: Seed Data
-- Languages
INSERT INTO languages (name, slug, description) VALUES
('Java', 'java', 'A robust, object-oriented programming language widely used in enterprise applications'),
('Python', 'python', 'A versatile, beginner-friendly language used in web, data science, and AI'),
('JavaScript', 'javascript', 'The language of the web, used for frontend and backend (Node.js) development'),
('Go', 'go', 'A statically typed, compiled language designed for simplicity and performance'),
('C++', 'cpp', 'A powerful systems programming language offering fine-grained memory control')
ON CONFLICT (slug) DO NOTHING;

-- Tracks
INSERT INTO tracks (name, slug, description) VALUES
('Backend', 'backend', 'Server-side development: APIs, databases, and business logic'),
('Frontend', 'frontend', 'Client-side development: UI, UX, and browser APIs'),
('Fullstack', 'fullstack', 'End-to-end development covering both frontend and backend'),
('Language Core', 'language-core', 'Deep mastery of the core language features and internals')
ON CONFLICT (slug) DO NOTHING;

-- Experience Levels
INSERT INTO experience_levels (label, min_years, max_years) VALUES
('0-1 Year', 0, 1),
('1-3 Years', 1, 3),
('3-5 Years', 3, 5),
('5+ Years', 5, NULL)
ON CONFLICT DO NOTHING;

-- Domains (Java examples)
INSERT INTO domains (language_id, track_id, experience_id, name, slug, description)
SELECT
    l.id, t.id, e.id,
    'Java Fullstack 1-3',
    'java-fullstack-1-3',
    'Java Fullstack interview preparation for 1-3 years experience'
FROM languages l, tracks t, experience_levels e
WHERE l.slug = 'java' AND t.slug = 'fullstack' AND e.label = '1-3 Years'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO domains (language_id, track_id, experience_id, name, slug, description)
SELECT
    l.id, t.id, e.id,
    'Java Backend 3-5',
    'java-backend-3-5',
    'Java Backend interview preparation for 3-5 years experience'
FROM languages l, tracks t, experience_levels e
WHERE l.slug = 'java' AND t.slug = 'backend' AND e.label = '3-5 Years'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO domains (language_id, track_id, experience_id, name, slug, description)
SELECT
    l.id, t.id, e.id,
    'Python Backend 1-3',
    'python-backend-1-3',
    'Python Backend interview preparation for 1-3 years experience'
FROM languages l, tracks t, experience_levels e
WHERE l.slug = 'python' AND t.slug = 'backend' AND e.label = '1-3 Years'
ON CONFLICT (slug) DO NOTHING;

-- Tech Stacks
INSERT INTO tech_stacks (name, slug, description) VALUES
('Core Java', 'core-java', 'Fundamental Java concepts: OOP, JVM, Collections, Threads'),
('Spring Boot', 'spring-boot', 'Building production-ready REST APIs with Spring Boot'),
('Spring Data JPA', 'spring-data-jpa', 'Database access with Hibernate and Spring Data'),
('Multithreading', 'multithreading', 'Concurrency, threads, locks, and async programming in Java'),
('System Design', 'system-design', 'High-level system design patterns and scalability'),
('SQL', 'sql', 'Relational database querying and optimization'),
('Microservices', 'microservices', 'Building and operating distributed microservice architectures'),
('React', 'react', 'Building modern UIs with React and hooks'),
('Python Core', 'python-core', 'Core Python language features and standard library'),
('Django', 'django', 'Web development with Django framework')
ON CONFLICT (slug) DO NOTHING;

-- Domain Stack Maps (Java Fullstack 1-3)
INSERT INTO domain_stack_map (domain_id, stack_id, display_order)
SELECT d.id, ts.id, 1
FROM domains d, tech_stacks ts
WHERE d.slug = 'java-fullstack-1-3' AND ts.slug = 'core-java'
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id, display_order)
SELECT d.id, ts.id, 2
FROM domains d, tech_stacks ts
WHERE d.slug = 'java-fullstack-1-3' AND ts.slug = 'spring-boot'
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id, display_order)
SELECT d.id, ts.id, 3
FROM domains d, tech_stacks ts
WHERE d.slug = 'java-fullstack-1-3' AND ts.slug = 'spring-data-jpa'
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id, display_order)
SELECT d.id, ts.id, 4
FROM domains d, tech_stacks ts
WHERE d.slug = 'java-fullstack-1-3' AND ts.slug = 'react'
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id, display_order)
SELECT d.id, ts.id, 5
FROM domains d, tech_stacks ts
WHERE d.slug = 'java-fullstack-1-3' AND ts.slug = 'sql'
ON CONFLICT DO NOTHING;

INSERT INTO domain_stack_map (domain_id, stack_id, display_order)
SELECT d.id, ts.id, 6
FROM domains d, tech_stacks ts
WHERE d.slug = 'java-fullstack-1-3' AND ts.slug = 'system-design'
ON CONFLICT DO NOTHING;

-- Sample Questions (Core Java)
INSERT INTO questions (title, slug, difficulty, estimated_read_time, meta_description) VALUES
('What is OOP and what are its four pillars?', 'what-is-oop-four-pillars', 'easy', 5, 'Learn about Object-Oriented Programming and its four core principles: Encapsulation, Abstraction, Inheritance, and Polymorphism'),
('Explain Encapsulation vs Abstraction in Java', 'encapsulation-vs-abstraction-java', 'easy', 6, 'Understand the difference between Encapsulation and Abstraction in Java with real-world examples'),
('What is Polymorphism in Java?', 'polymorphism-in-java', 'medium', 7, 'Deep dive into compile-time and runtime polymorphism in Java with method overloading and overriding examples'),
('Explain the SOLID principles with examples', 'solid-principles-examples', 'hard', 12, 'Master the SOLID design principles with Java code examples used in real interviews'),
('What is the JVM and how does it work?', 'jvm-how-it-works', 'medium', 8, 'Understand the Java Virtual Machine architecture, class loading, JIT compilation and memory areas'),
('HashMap internal working in Java', 'hashmap-internal-working-java', 'hard', 10, 'Learn how HashMap works internally - hashing, bucket array, collision resolution, and resizing'),
('What is Spring Boot Auto-Configuration?', 'spring-boot-auto-configuration', 'medium', 8, 'Understand how Spring Boot auto-configuration works under the hood with @EnableAutoConfiguration'),
('Explain @Transactional in Spring', 'transactional-annotation-spring', 'hard', 10, 'Master Spring @Transactional - propagation, isolation levels, rollback rules and common pitfalls')
ON CONFLICT (slug) DO NOTHING;

-- Question Stack Maps (Core Java questions -> core-java stack)
INSERT INTO question_stack_map (question_id, stack_id, order_index)
SELECT q.id, ts.id, 1
FROM questions q, tech_stacks ts
WHERE q.slug = 'what-is-oop-four-pillars' AND ts.slug = 'core-java'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_map (question_id, stack_id, order_index)
SELECT q.id, ts.id, 2
FROM questions q, tech_stacks ts
WHERE q.slug = 'encapsulation-vs-abstraction-java' AND ts.slug = 'core-java'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_map (question_id, stack_id, order_index)
SELECT q.id, ts.id, 3
FROM questions q, tech_stacks ts
WHERE q.slug = 'polymorphism-in-java' AND ts.slug = 'core-java'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_map (question_id, stack_id, order_index)
SELECT q.id, ts.id, 4
FROM questions q, tech_stacks ts
WHERE q.slug = 'solid-principles-examples' AND ts.slug = 'core-java'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_map (question_id, stack_id, order_index)
SELECT q.id, ts.id, 5
FROM questions q, tech_stacks ts
WHERE q.slug = 'jvm-how-it-works' AND ts.slug = 'core-java'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_map (question_id, stack_id, order_index)
SELECT q.id, ts.id, 6
FROM questions q, tech_stacks ts
WHERE q.slug = 'hashmap-internal-working-java' AND ts.slug = 'core-java'
ON CONFLICT DO NOTHING;

-- Spring Boot questions -> spring-boot stack
INSERT INTO question_stack_map (question_id, stack_id, order_index)
SELECT q.id, ts.id, 1
FROM questions q, tech_stacks ts
WHERE q.slug = 'spring-boot-auto-configuration' AND ts.slug = 'spring-boot'
ON CONFLICT DO NOTHING;

INSERT INTO question_stack_map (question_id, stack_id, order_index)
SELECT q.id, ts.id, 2
FROM questions q, tech_stacks ts
WHERE q.slug = 'transactional-annotation-spring' AND ts.slug = 'spring-boot'
ON CONFLICT DO NOTHING;

-- Answer Sections for "What is OOP"
INSERT INTO answer_sections (question_id, section_type, section_order, content)
SELECT q.id, 'interviewer_expectation', 1,
'Interviewers expect you to clearly define OOP and list all four pillars with brief explanations. They want to see if you understand WHY OOP exists, not just what it is. Mention real-world analogies and be ready for follow-up questions on each pillar.'
FROM questions q WHERE q.slug = 'what-is-oop-four-pillars'
ON CONFLICT DO NOTHING;

INSERT INTO answer_sections (question_id, section_type, section_order, content)
SELECT q.id, 'core_concepts', 2,
'**Object-Oriented Programming (OOP)** is a programming paradigm that organizes code around objects rather than functions and logic.

**The Four Pillars:**

1. **Encapsulation** - Bundling data (fields) and behavior (methods) together, hiding internal state from the outside world. Example: A BankAccount class with private balance and public deposit()/withdraw() methods.

2. **Abstraction** - Hiding implementation complexity and exposing only what''s necessary. Example: A Car''s steering wheel abstracts away the complex steering mechanism.

3. **Inheritance** - A class can inherit properties and behaviors from a parent class, promoting reuse. Example: Dog extends Animal.

4. **Polymorphism** - The ability of different objects to respond to the same interface differently. Method overriding (runtime) and method overloading (compile-time) are key examples.'
FROM questions q WHERE q.slug = 'what-is-oop-four-pillars'
ON CONFLICT DO NOTHING;

INSERT INTO answer_sections (question_id, section_type, section_order, content)
SELECT q.id, 'important_points', 3,
'• OOP promotes **code reusability**, **modularity**, and **maintainability**
• Java is **not purely** OOP (it has primitives like int, char)
• Encapsulation achieves **data hiding** through access modifiers (private, protected)
• Abstraction is achieved through **abstract classes** and **interfaces**
• Inheritance creates an **IS-A** relationship
• Polymorphism allows writing **generic code** that works with many types
• **Composition over Inheritance** is a modern best practice'
FROM questions q WHERE q.slug = 'what-is-oop-four-pillars'
ON CONFLICT DO NOTHING;

INSERT INTO answer_sections (question_id, section_type, section_order, content)
SELECT q.id, 'code_example', 4,
'```java
// Encapsulation
public class BankAccount {
    private double balance;  // hidden state
    
    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    
    public double getBalance() { return balance; }
}

// Abstraction via interface
public interface Shape {
    double area();  // contract only, no implementation
}

// Inheritance + Polymorphism
public class Animal {
    public void speak() { System.out.println("..."); }
}

public class Dog extends Animal {
    @Override
    public void speak() { System.out.println("Woof!"); }
}

public class Cat extends Animal {
    @Override
    public void speak() { System.out.println("Meow!"); }
}

// Polymorphic usage
Animal a = new Dog();
a.speak(); // prints "Woof!" - runtime polymorphism
```'
FROM questions q WHERE q.slug = 'what-is-oop-four-pillars'
ON CONFLICT DO NOTHING;

INSERT INTO answer_sections (question_id, section_type, section_order, content)
SELECT q.id, 'speakable_answer', 5,
'OOP is a programming paradigm that models software around real-world objects. The four pillars are Encapsulation, which hides internal state; Abstraction, which simplifies complex systems; Inheritance, which promotes code reuse; and Polymorphism, which allows objects to be treated uniformly. Together these principles make code more maintainable, reusable, and scalable.'
FROM questions q WHERE q.slug = 'what-is-oop-four-pillars'
ON CONFLICT DO NOTHING;

INSERT INTO answer_sections (question_id, section_type, section_order, content)
SELECT q.id, 'followup_questions', 6,
'1. What is the difference between Encapsulation and Abstraction?
2. Can you give a real-world example of Polymorphism?
3. What is the difference between Abstraction and Interface?
4. When would you use Composition over Inheritance?
5. What are the SOLID principles and how do they relate to OOP?'
FROM questions q WHERE q.slug = 'what-is-oop-four-pillars'
ON CONFLICT DO NOTHING;

-- Concepts
INSERT INTO concepts (name, slug, description) VALUES
('Object-Oriented Programming', 'oop', 'Programming paradigm based on objects and classes'),
('Dependency Injection', 'dependency-injection', 'Design pattern for achieving Inversion of Control'),
('JVM Architecture', 'jvm-architecture', 'Java Virtual Machine architecture and internals'),
('Concurrency', 'concurrency', 'Handling multiple tasks simultaneously in programming')
ON CONFLICT (slug) DO NOTHING;

-- Link OOP question to OOP concept
INSERT INTO question_concepts (question_id, concept_id)
SELECT q.id, c.id FROM questions q, concepts c
WHERE q.slug = 'what-is-oop-four-pillars' AND c.slug = 'oop'
ON CONFLICT DO NOTHING;

-- Tags
INSERT INTO tags (name, slug) VALUES
('Java', 'java'),
('OOP', 'oop'),
('Spring', 'spring'),
('Database', 'database'),
('Beginner', 'beginner'),
('Advanced', 'advanced')
ON CONFLICT (slug) DO NOTHING;

-- Question Tags
INSERT INTO question_tags (question_id, tag_id)
SELECT q.id, t.id FROM questions q, tags t
WHERE q.slug = 'what-is-oop-four-pillars' AND t.slug IN ('java', 'oop', 'beginner')
ON CONFLICT DO NOTHING;
