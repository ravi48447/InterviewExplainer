/**
 * Question Generation Script
 *
 * This script helps generate interview questions using AI assistance
 * Run: npx tsx scripts/generateQuestions.ts
 */

interface QuestionTemplate {
  id: string;
  title: string;
  slug: string;
  question: string;
  answer: string;
  explanation?: string;
  codeExample?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'low' | 'medium' | 'high';
  keywords: string[];
  relatedTopics?: string[];
  commonMistakes?: string[];
  followUpQuestions?: string[];
  realWorldScenario?: string;
  tags: string[];
}

interface Stack {
  id: string;
  name: string;
  slug: string;
  description: string;
  priority: number;
  questions: QuestionTemplate[];
}

interface Domain {
  id: string;
  name: string;
  slug: string;
  description: string;
  level: string;
  stacks: Stack[];
}

// STEP 1: Define all 64 domains
const ALL_DOMAINS = [
  // Backend
  { id: 'java-backend', name: 'Java Backend', category: 'backend' },
  { id: 'python-backend', name: 'Python Backend', category: 'backend' },
  { id: 'nodejs-backend', name: 'Node.js Backend', category: 'backend' },
  { id: 'go-backend', name: 'Go Backend', category: 'backend' },
  { id: 'dotnet-backend', name: '.NET Backend', category: 'backend' },
  { id: 'ruby-backend', name: 'Ruby on Rails', category: 'backend' },
  { id: 'php-backend', name: 'PHP Backend', category: 'backend' },
  { id: 'scala-backend', name: 'Scala Backend', category: 'backend' },

  // Frontend
  { id: 'react', name: 'React', category: 'frontend' },
  { id: 'angular', name: 'Angular', category: 'frontend' },
  { id: 'vue', name: 'Vue.js', category: 'frontend' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend' },
  { id: 'javascript', name: 'JavaScript', category: 'frontend' },
  { id: 'html-css', name: 'HTML & CSS', category: 'frontend' },
  { id: 'web-performance', name: 'Web Performance', category: 'frontend' },

  // Mobile
  { id: 'react-native', name: 'React Native', category: 'mobile' },
  { id: 'flutter', name: 'Flutter', category: 'mobile' },
  { id: 'ios-swift', name: 'iOS/Swift', category: 'mobile' },
  { id: 'android-kotlin', name: 'Android/Kotlin', category: 'mobile' },
  { id: 'xamarin', name: 'Xamarin', category: 'mobile' },

  // Databases
  { id: 'sql-mysql', name: 'MySQL', category: 'database' },
  { id: 'sql-postgresql', name: 'PostgreSQL', category: 'database' },
  { id: 'mongodb', name: 'MongoDB', category: 'database' },
  { id: 'redis', name: 'Redis', category: 'database' },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'database' },
  { id: 'cassandra', name: 'Cassandra', category: 'database' },
  { id: 'dynamodb', name: 'DynamoDB', category: 'database' },

  // Cloud & DevOps
  { id: 'aws', name: 'AWS', category: 'cloud' },
  { id: 'azure', name: 'Azure', category: 'cloud' },
  { id: 'gcp', name: 'Google Cloud', category: 'cloud' },
  { id: 'docker', name: 'Docker', category: 'devops' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops' },
  { id: 'terraform', name: 'Terraform', category: 'devops' },
  { id: 'jenkins', name: 'Jenkins', category: 'devops' },
  { id: 'github-actions', name: 'GitHub Actions', category: 'devops' },

  // System Design
  { id: 'system-design-basics', name: 'System Design Basics', category: 'system-design' },
  { id: 'microservices', name: 'Microservices', category: 'system-design' },
  { id: 'distributed-systems', name: 'Distributed Systems', category: 'system-design' },
  { id: 'scalability', name: 'Scalability', category: 'system-design' },
  { id: 'api-design', name: 'API Design', category: 'system-design' },

  // DSA
  { id: 'arrays-strings', name: 'Arrays & Strings', category: 'dsa' },
  { id: 'trees-graphs', name: 'Trees & Graphs', category: 'dsa' },
  { id: 'dynamic-programming', name: 'Dynamic Programming', category: 'dsa' },
  { id: 'sorting-searching', name: 'Sorting & Searching', category: 'dsa' },
  { id: 'linked-lists', name: 'Linked Lists', category: 'dsa' },

  // Security
  { id: 'web-security', name: 'Web Security', category: 'security' },
  { id: 'auth-oauth', name: 'Authentication & OAuth', category: 'security' },
  { id: 'cryptography', name: 'Cryptography', category: 'security' },
  { id: 'penetration-testing', name: 'Penetration Testing', category: 'security' },

  // Testing
  { id: 'unit-testing', name: 'Unit Testing', category: 'testing' },
  { id: 'integration-testing', name: 'Integration Testing', category: 'testing' },
  { id: 'e2e-testing', name: 'E2E Testing', category: 'testing' },
  { id: 'test-automation', name: 'Test Automation', category: 'testing' },

  // Soft Skills
  { id: 'behavioral', name: 'Behavioral Questions', category: 'soft-skills' },
  { id: 'leadership', name: 'Leadership', category: 'soft-skills' },
  { id: 'communication', name: 'Communication', category: 'soft-skills' },
  { id: 'problem-solving', name: 'Problem Solving', category: 'soft-skills' },

  // Emerging Tech
  { id: 'machine-learning', name: 'Machine Learning', category: 'emerging' },
  { id: 'blockchain', name: 'Blockchain', category: 'emerging' },
  { id: 'iot', name: 'IoT', category: 'emerging' },
  { id: 'ar-vr', name: 'AR/VR', category: 'emerging' },
];

// STEP 2: Generate questions using AI prompt
const AI_GENERATION_PROMPT = `
Generate 40 high-quality interview questions for:
Domain: {DOMAIN_NAME}
Stack: {STACK_NAME}

For each question, provide:
1. Title (concise, specific)
2. Question (clear, interview-style)
3. Answer (comprehensive, 3-5 sentences)
4. Explanation (why this matters)
5. Code example (if applicable)
6. Difficulty (easy/medium/hard)
7. 5-8 keywords
8. 2-3 common mistakes
9. Real-world scenario

Focus on:
- Practical, real-world questions
- Mix of conceptual and implementation
- Cover beginner to advanced
- Include edge cases and gotchas

Format as JSON array matching QuestionTemplate interface.
`;

// STEP 3: Example - Generate for one stack
async function generateQuestionsForStack(
  domainName: string,
  stackName: string
): Promise<QuestionTemplate[]> {
  console.log(`Generating questions for ${domainName} - ${stackName}`);

  // In real implementation, this would call Claude API or ChatGPT API
  // For now, return template

  const prompt = AI_GENERATION_PROMPT
    .replace('{DOMAIN_NAME}', domainName)
    .replace('{STACK_NAME}', stackName);

  console.log('Prompt:', prompt);

  // TODO: Call AI API here
  // const response = await callClaudeAPI(prompt);
  // return JSON.parse(response);

  return [];
}

// STEP 4: Batch generation
async function generateAllQuestions() {
  console.log(`Generating questions for ${ALL_DOMAINS.length} domains...`);

  for (const domain of ALL_DOMAINS) {
    console.log(`\n📚 Processing: ${domain.name}`);

    // Define stacks for each domain (customize per domain)
    const stacks = getStacksForDomain(domain.id);

    for (const stack of stacks) {
      const questions = await generateQuestionsForStack(domain.name, stack.name);

      // Save to file
      // await saveToFile(`data/questions/${domain.id}/${stack.slug}.json`, questions);

      console.log(`  ✅ ${stack.name}: ${questions.length} questions`);
    }
  }

  console.log('\n✨ Generation complete!');
}

function getStacksForDomain(domainId: string): { name: string; slug: string }[] {
  // Define stacks per domain type
  const stacksByCategory: Record<string, string[]> = {
    backend: [
      'Basics & Syntax',
      'Frameworks',
      'ORMs & Databases',
      'REST APIs',
      'Authentication',
      'Testing',
      'Performance'
    ],
    frontend: [
      'Basics',
      'Components',
      'State Management',
      'Routing',
      'Performance',
      'Testing',
      'Build Tools'
    ],
    database: [
      'Basics',
      'Queries',
      'Indexing',
      'Transactions',
      'Optimization',
      'Scaling',
      'Backup & Recovery'
    ],
    cloud: [
      'Compute',
      'Storage',
      'Networking',
      'Security',
      'Monitoring',
      'Serverless',
      'Cost Optimization'
    ],
    // ... add more
  };

  // Return stacks for this domain
  return (stacksByCategory['backend'] || []).map(name => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }));
}

// Main execution
if (require.main === module) {
  generateAllQuestions().catch(console.error);
}

export { generateQuestionsForStack, generateAllQuestions, ALL_DOMAINS };