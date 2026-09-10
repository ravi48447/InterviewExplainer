// This will fetch actual questions from your domain structure

export async function fetchDomainQuestions(
  domainSlug: string,
  difficulty: 'medium' | 'high' | 'mixed',
  count: number = 7
) {
  try {
    // Determine base URL (needed for server-side fetches)
    const baseUrl = typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      : '';

    // Fetch the domain data
    const domainUrl = `${baseUrl}/api/v2/domains/${domainSlug}`;
    console.log('Fetching domain from:', domainUrl);

    const response = await fetch(domainUrl);

    if (!response.ok) {
      console.error('Domain fetch failed:', response.status, response.statusText);
      throw new Error(`Failed to fetch domain: ${response.statusText}`);
    }

    const domainData = await response.json();
    console.log('Domain data received:', domainData);

    // Collect all questions from all stacks in this domain
    const allQuestions: any[] = [];

    for (const stack of domainData.stacks || []) {
      // Fetch stack with questions
      const stackUrl = `${baseUrl}/api/v2/domains/${domainSlug}/${stack.slug}`;
      console.log('Fetching stack from:', stackUrl);

      const stackResponse = await fetch(stackUrl);

      if (stackResponse.ok) {
        const stackData = await stackResponse.json();
        console.log(`Stack ${stack.slug} data:`, stackData);

        if (stackData.questions && Array.isArray(stackData.questions)) {
          stackData.questions.forEach((question: any) => {
            allQuestions.push({
              id: question.id,
              questionId: question.id,
              domainSlug: domainSlug,
              stackSlug: stack.slug,
              stackName: stack.name,
              title: question.title,
              slug: question.slug,
              question: question.question,
              answer: question.answer,
              explanation: question.explanation,
              codeExample: question.codeExample,
              bestPractices: question.bestPractices,
              commonMistakes: question.commonMistakes,
              relatedTopics: question.relatedTopics,
              difficulty: question.difficulty || 'medium', // Assume medium if not specified
              tags: question.tags || [],
            });
          });
        }
      }
    }

    console.log('Total questions collected:', allQuestions.length);

    if (allQuestions.length === 0) {
      console.error('No questions found for domain:', domainSlug);
      throw new Error('No questions found in this domain');
    }

    // Filter by difficulty
    let filteredQuestions = allQuestions;

    if (difficulty === 'medium') {
      filteredQuestions = allQuestions.filter(
        q => q.difficulty === 'medium' || q.difficulty === 'easy'
      );
    } else if (difficulty === 'high') {
      filteredQuestions = allQuestions.filter(
        q => q.difficulty === 'high' || q.difficulty === 'hard'
      );
    }
    // For 'mixed', keep all

    // If we don't have enough questions after filtering, use all
    if (filteredQuestions.length < 3) {
      filteredQuestions = allQuestions;
    }

    console.log('Filtered questions:', filteredQuestions.length);

    // Shuffle and take random questions
    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    console.log('Selected questions for mock:', selected.length);

    // Transform for mock interview format
    return selected.map(q => ({
      id: q.id,
      questionId: q.questionId,
      domainSlug: q.domainSlug,
      stackSlug: q.stackSlug,
      stackName: q.stackName,
      title: q.title,
      slug: q.slug,
      question: q.question,
      answer: q.answer,
      explanation: q.explanation,
      codeExample: q.codeExample,
      difficulty: q.difficulty,
      type: 'technical',
      timeLimit: q.difficulty === 'high' || q.difficulty === 'hard' ? 240 : 180, // 4 min for hard, 3 min for medium
      // Extract keywords from answer for evaluation
      keywords: extractKeywords(q.answer, q.title),
      // URL to review the full question
      reviewUrl: `/${q.domainSlug}/${q.stackSlug}/${q.slug}`,
    }));

  } catch (error) {
    console.error('Error fetching domain questions:', error);
    throw error;
  }
}

// Extract important keywords from answer for evaluation
function extractKeywords(answer: string, title: string): string[] {
  if (!answer) return [];

  const keywords: string[] = [];

  // Common technical terms to look for
  const technicalPatterns = [
    // Programming concepts
    /\b(thread[- ]safe|concurrent|async|synchronous|parallel)\b/gi,
    /\b(immutable|mutable|singleton|factory|observer)\b/gi,
    /\b(cache|caching|redis|memcached)\b/gi,
    /\b(database|sql|nosql|query|index|transaction)\b/gi,
    /\b(REST|API|HTTP|JSON|XML)\b/gi,
    /\b(class|interface|abstract|inheritance|polymorphism)\b/gi,
    /\b(component|props|state|hooks|lifecycle)\b/gi,
    /\b(microservices|monolith|scalability|load balancing)\b/gi,
    /\b(authentication|authorization|JWT|OAuth|security)\b/gi,
    /\b(docker|kubernetes|container|orchestration)\b/gi,
    /\b(CI\/CD|pipeline|deployment|jenkins)\b/gi,
    /\b(git|version control|branch|merge|rebase)\b/gi,

    // Java specific
    /\b(JVM|garbage collection|heap|stack)\b/gi,
    /\b(Spring|Spring Boot|dependency injection|IoC)\b/gi,
    /\b(Hibernate|JPA|ORM|entity)\b/gi,

    // React specific
    /\b(virtual DOM|reconciliation|render|re-render)\b/gi,
    /\b(useState|useEffect|useContext|useMemo|useCallback)\b/gi,

    // AWS specific
    /\b(EC2|S3|Lambda|RDS|DynamoDB|CloudFormation)\b/gi,
    /\b(IAM|VPC|subnet|security group)\b/gi,
  ];

  technicalPatterns.forEach(pattern => {
    const matches = answer.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const normalized = match.trim().toLowerCase();
        if (!keywords.includes(normalized)) {
          keywords.push(normalized);
        }
      });
    }
  });

  // Also extract capitalized technical terms (likely important concepts)
  const capitalizedTerms = answer.match(/\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\b/g);
  if (capitalizedTerms) {
    capitalizedTerms.forEach(term => {
      const normalized = term.trim().toLowerCase();
      if (term.length > 3 && !keywords.includes(normalized)) {
        keywords.push(normalized);
      }
    });
  }

  // Extract quoted terms (often important concepts)
  const quotedTerms = answer.match(/["'`]([^"'`]+)["'`]/g);
  if (quotedTerms) {
    quotedTerms.forEach(term => {
      const cleaned = term.replace(/["'`]/g, '').trim().toLowerCase();
      if (cleaned.length > 2 && !keywords.includes(cleaned)) {
        keywords.push(cleaned);
      }
    });
  }

  // Limit to most important keywords (first 10)
  return keywords.slice(0, 10);
}