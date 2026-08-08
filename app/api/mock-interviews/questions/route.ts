import { NextRequest, NextResponse } from 'next/server';

// Directly define questions by domain - simpler and more reliable
const questionsByDomain: Record<string, any[]> = {
  'java-backend-1-3': [
    {
      id: 'java-1',
      questionId: 'java-1',
      domainSlug: 'java-backend-1-3',
      stackSlug: 'core-java',
      stackName: 'Core Java',
      title: 'Explain the difference between HashMap and ConcurrentHashMap',
      slug: 'hashmap-vs-concurrenthashmap',
      question: 'What are the key differences between HashMap and ConcurrentHashMap? When would you use each?',
      answer: 'HashMap is not thread-safe and allows null keys/values. ConcurrentHashMap is thread-safe, uses lock striping for better concurrency, and doesn\'t allow null keys/values. Use HashMap for single-threaded scenarios and ConcurrentHashMap for multi-threaded environments where concurrent access is needed.',
      difficulty: 'medium',
      type: 'technical',
      timeLimit: 180,
      keywords: ['thread-safe', 'concurrent', 'lock striping', 'null handling', 'performance'],
      reviewUrl: '/java-backend-1-3/core-java/hashmap-vs-concurrenthashmap',
    },
    {
      id: 'java-2',
      questionId: 'java-2',
      domainSlug: 'java-backend-1-3',
      stackSlug: 'spring-boot',
      stackName: 'Spring Boot',
      title: 'How does Spring Boot auto-configuration work?',
      slug: 'spring-boot-auto-config',
      question: 'Explain the mechanism behind Spring Boot auto-configuration and how you can customize it.',
      answer: 'Spring Boot auto-configuration uses @EnableAutoConfiguration and @Conditional annotations to automatically configure beans based on classpath dependencies. It scans META-INF/spring.factories files for auto-configuration classes. You can customize by using @ConditionalOnMissingBean, excluding configurations, or creating your own auto-configuration classes with spring.factories.',
      difficulty: 'high',
      type: 'technical',
      timeLimit: 240,
      keywords: ['@EnableAutoConfiguration', '@Conditional', 'spring.factories', 'classpath scanning', 'customization'],
      reviewUrl: '/java-backend-1-3/spring-boot/spring-boot-auto-config',
    },
    {
      id: 'java-3',
      questionId: 'java-3',
      domainSlug: 'java-backend-1-3',
      stackSlug: 'microservices',
      stackName: 'Microservices',
      title: 'Explain saga pattern in microservices',
      slug: 'saga-pattern',
      question: 'What is the Saga pattern and how does it handle distributed transactions in microservices?',
      answer: 'Saga pattern manages distributed transactions by breaking them into a series of local transactions. Each step has a compensating transaction to undo changes if something fails. Two types: Choreography (event-driven) and Orchestration (central coordinator). Ensures eventual consistency without distributed locks.',
      difficulty: 'high',
      type: 'technical',
      timeLimit: 240,
      keywords: ['distributed transactions', 'compensating transactions', 'choreography', 'orchestration', 'eventual consistency'],
      reviewUrl: '/java-backend-1-3/microservices/saga-pattern',
    },
    {
      id: 'java-4',
      questionId: 'java-4',
      domainSlug: 'java-backend-1-3',
      stackSlug: 'jpa',
      stackName: 'JPA',
      title: 'What is N+1 query problem and how to solve it?',
      slug: 'n-plus-1-problem',
      question: 'Explain the N+1 query problem in JPA/Hibernate and strategies to solve it.',
      answer: 'N+1 problem occurs when fetching a list of entities (1 query) triggers additional queries (N) for lazy-loaded associations. Solutions: 1) Use JOIN FETCH in JPQL, 2) @EntityGraph for fetch strategies, 3) @BatchSize for batching, 4) Enable FetchMode.SUBSELECT, 5) Use DTOs with specific queries.',
      difficulty: 'medium',
      type: 'technical',
      timeLimit: 180,
      keywords: ['lazy loading', 'JOIN FETCH', '@EntityGraph', 'batching', 'performance optimization'],
      reviewUrl: '/java-backend-1-3/jpa/n-plus-1-problem',
    },
    {
      id: 'java-5',
      questionId: 'java-5',
      domainSlug: 'java-backend-1-3',
      stackSlug: 'rest-api',
      stackName: 'REST API',
      title: 'Design a RESTful API for a booking system',
      slug: 'restful-api-design',
      question: 'Design REST endpoints for a hotel booking system. Include resource naming, HTTP methods, and status codes.',
      answer: 'GET /hotels - list hotels, GET /hotels/{id} - hotel details, GET /hotels/{id}/rooms - available rooms, POST /bookings - create booking (201), GET /bookings/{id} - booking details, PUT /bookings/{id} - update booking, DELETE /bookings/{id} - cancel (204). Use query params for filtering (?date=2024-01-01&guests=2). Return 404 for not found, 400 for validation errors, 409 for conflicts (room already booked).',
      difficulty: 'high',
      type: 'technical',
      timeLimit: 300,
      keywords: ['resource naming', 'HTTP methods', 'status codes', 'RESTful design', 'idempotency'],
      reviewUrl: '/java-backend-1-3/rest-api/restful-api-design',
    },
    {
      id: 'java-6',
      questionId: 'java-6',
      domainSlug: 'java-backend-1-3',
      stackSlug: 'security',
      stackName: 'Security',
      title: 'Explain JWT authentication flow',
      slug: 'jwt-authentication',
      question: 'How does JWT-based authentication work? What are the security considerations?',
      answer: 'JWT flow: 1) User logs in with credentials, 2) Server validates and generates JWT (header.payload.signature), 3) Client stores JWT (localStorage/cookie), 4) Client sends JWT in Authorization header for subsequent requests, 5) Server validates signature and extracts claims. Security: Use HTTPS, short expiration times, refresh tokens, store securely, validate signature, check expiration, use strong secrets, consider token revocation strategy.',
      difficulty: 'medium',
      type: 'technical',
      timeLimit: 240,
      keywords: ['JWT structure', 'token validation', 'security', 'expiration', 'refresh tokens'],
      reviewUrl: '/java-backend-1-3/security/jwt-authentication',
    },
    {
      id: 'java-7',
      questionId: 'java-7',
      domainSlug: 'java-backend-1-3',
      stackSlug: 'core-java',
      stackName: 'Core Java',
      title: 'Explain Java Memory Model and visibility',
      slug: 'java-memory-model',
      question: 'What is the Java Memory Model and how does it affect thread visibility?',
      answer: 'Java Memory Model (JMM) defines how threads interact through memory. Each thread has local cache, changes may not be immediately visible to other threads. volatile keyword ensures visibility by forcing reads/writes directly to main memory. synchronized provides both mutual exclusion and visibility. happens-before relationship guarantees ordering. Use volatile for flags, synchronized for compound operations.',
      difficulty: 'high',
      type: 'technical',
      timeLimit: 240,
      keywords: ['memory visibility', 'volatile', 'happens-before', 'thread safety', 'synchronization'],
      reviewUrl: '/java-backend-1-3/core-java/java-memory-model',
    },
  ],
  // Add more domains as needed - these will be replaced with real DB queries
};

// Default questions for any domain not specifically defined
const defaultQuestions = [
  {
    id: 'default-1',
    questionId: 'default-1',
    title: 'Explain the core concepts',
    question: 'What are the fundamental concepts in this technology?',
    answer: 'Core concepts include understanding the basics, best practices, and practical applications.',
    difficulty: 'medium',
    type: 'technical',
    timeLimit: 180,
    keywords: ['fundamentals', 'basics', 'concepts'],
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get('domain');
    const difficulty = searchParams.get('difficulty') as 'medium' | 'high' | 'mixed' || 'mixed';
    const count = parseInt(searchParams.get('count') || '7');

    console.log('Mock questions API called with:', { domain, difficulty, count });

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    // Get questions for domain (or use defaults)
    let allQuestions = questionsByDomain[domain] || defaultQuestions;

    // Filter by difficulty
    let filteredQuestions = allQuestions;
    if (difficulty === 'medium') {
      filteredQuestions = allQuestions.filter(q => q.difficulty === 'medium' || q.difficulty === 'easy');
    } else if (difficulty === 'high') {
      filteredQuestions = allQuestions.filter(q => q.difficulty === 'high' || q.difficulty === 'hard');
    }

    // If we don't have enough after filtering, use all
    if (filteredQuestions.length < 3) {
      filteredQuestions = allQuestions;
    }

    // Shuffle and select random questions
    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    console.log('Questions selected:', selected.length);

    return NextResponse.json({
      success: true,
      data: {
        domain,
        difficulty,
        count: selected.length,
        questions: selected,
      },
    });
  } catch (error: any) {
    console.error('Error fetching mock questions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}