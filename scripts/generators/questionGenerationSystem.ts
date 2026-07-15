/**
 * 🎯 HIGH-QUALITY INTERVIEW QUESTION GENERATION SYSTEM
 *
 * This system generates REAL, PRACTICAL interview questions that match:
 * - Specific job roles (Backend Dev vs Data Analyst have different Python needs)
 * - Experience levels (Junior vs Senior expectations)
 * - Company types (FAANG vs Startup vs Enterprise)
 * - Interview stages (Phone Screen vs Technical Deep Dive vs System Design)
 */

// ============================================================================
// ROLE DEFINITIONS - What each role actually does
// ============================================================================

interface RoleProfile {
  id: string;
  name: string;
  description: string;
  dailyTasks: string[];
  keySkills: string[];
  depthLevel: 'surface' | 'intermediate' | 'expert' | 'architect';
  interviewFocus: string[];
  realWorldScenarios: string[];
  avoidTopics: string[];
  companyTypes: ('faang' | 'startup' | 'enterprise' | 'consulting')[];
}

const ROLE_PROFILES: Record<string, RoleProfile> = {
  'backend-engineer': {
    id: 'backend-engineer',
    name: 'Backend Software Engineer',
    description: 'Builds scalable server-side applications, APIs, and microservices',
    dailyTasks: [
      'Design and implement REST/GraphQL APIs',
      'Write business logic and data processing',
      'Optimize database queries and indexes',
      'Debug production issues and fix bugs',
      'Code review and mentor junior developers',
      'Design system architecture for new features'
    ],
    keySkills: [
      'API design and implementation',
      'Database modeling and optimization',
      'Authentication and authorization',
      'Caching strategies',
      'Message queues and async processing',
      'Microservices architecture',
      'Performance optimization',
      'Error handling and logging'
    ],
    depthLevel: 'expert',
    interviewFocus: [
      'Coding algorithms (Medium-Hard LeetCode level)',
      'System design (for mid-senior)',
      'Framework deep dive (Spring Boot, Django, etc.)',
      'Database expertise',
      'API design patterns',
      'Production debugging stories',
      'Trade-offs in architectural decisions'
    ],
    realWorldScenarios: [
      'Your API is timing out under load - how do you debug and fix it?',
      'Database is hitting 90% CPU - what do you check first?',
      'Need to migrate 100M records to new schema - what\'s your approach?',
      'Service is throwing 500 errors intermittently - how do you investigate?',
      'Product wants to add a new feature that requires significant schema changes'
    ],
    avoidTopics: [
      'Deep ML algorithms (unless ML-focused role)',
      'Frontend framework details',
      'UI/UX design principles',
      'Mobile app development specifics'
    ],
    companyTypes: ['faang', 'startup', 'enterprise']
  },

  'data-analyst': {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Analyzes data to generate business insights and create reports',
    dailyTasks: [
      'Write SQL queries to extract business metrics',
      'Create dashboards in Tableau/PowerBI/Looker',
      'Analyze A/B test results',
      'Clean and prepare data for analysis',
      'Present findings to stakeholders',
      'Build automated reports'
    ],
    keySkills: [
      'SQL (joins, aggregations, window functions)',
      'Python/R for data analysis (pandas, numpy)',
      'Statistical analysis basics',
      'Data visualization',
      'Excel/Google Sheets advanced functions',
      'Dashboard tools (Tableau, PowerBI)',
      'Understanding of business metrics',
      'Storytelling with data'
    ],
    depthLevel: 'intermediate',
    interviewFocus: [
      'SQL queries (practical business questions)',
      'Python pandas for data manipulation',
      'Statistics and A/B testing',
      'Case studies (real business problems)',
      'Data visualization best practices',
      'Handling missing/dirty data',
      'Explaining insights to non-technical stakeholders'
    ],
    realWorldScenarios: [
      'User sign-ups dropped 20% last week - how do you investigate?',
      'Marketing wants to know which campaign drove most revenue',
      'Product team asks: should we launch this feature based on A/B test?',
      'Sales data has duplicates and missing values - how do you clean it?',
      'CFO needs a weekly revenue dashboard - what metrics do you include?'
    ],
    avoidTopics: [
      'Deep learning model architecture',
      'Complex algorithm implementation',
      'System design and scalability',
      'Low-level performance optimization',
      'Kubernetes and DevOps'
    ],
    companyTypes: ['enterprise', 'startup', 'consulting']
  },

  'fullstack-engineer': {
    id: 'fullstack-engineer',
    name: 'Full Stack Engineer',
    description: 'Builds both frontend and backend, end-to-end feature development',
    dailyTasks: [
      'Build UI components and pages',
      'Implement backend APIs',
      'Connect frontend to backend',
      'Handle user authentication',
      'Deploy and monitor applications',
      'Fix bugs across the stack'
    ],
    keySkills: [
      'Frontend (React/Vue/Angular)',
      'Backend (Node.js/Python/Java)',
      'Databases (SQL and NoSQL)',
      'API design and consumption',
      'Basic DevOps (Docker, CI/CD)',
      'Testing (unit and integration)',
      'State management',
      'Responsive design'
    ],
    depthLevel: 'intermediate',
    interviewFocus: [
      'Coding (algorithms and practical problems)',
      'Frontend component design',
      'Backend API implementation',
      'Database schema design',
      'End-to-end feature walkthrough',
      'Trade-offs between solutions',
      'Debugging across the stack'
    ],
    realWorldScenarios: [
      'Build a commenting system - design DB schema, API, and UI',
      'Users report slow page load - where do you start?',
      'Need to add real-time notifications - what\'s your approach?',
      'API returns data but UI shows error - how do you debug?',
      'Product wants infinite scroll instead of pagination'
    ],
    avoidTopics: [
      'Extremely deep framework internals',
      'Advanced ML/AI topics',
      'Highly specialized backend topics',
      'Native mobile development'
    ],
    companyTypes: ['startup', 'enterprise']
  },

  'data-scientist': {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Builds ML models and statistical analyses to solve business problems',
    dailyTasks: [
      'Build and train machine learning models',
      'Feature engineering and data preprocessing',
      'Evaluate model performance',
      'Deploy models to production',
      'A/B testing and experimentation',
      'Collaborate with engineers on implementation'
    ],
    keySkills: [
      'Python (pandas, scikit-learn, tensorflow)',
      'Statistics and probability',
      'Machine learning algorithms',
      'Feature engineering',
      'Model evaluation and tuning',
      'SQL for data extraction',
      'Big data tools (Spark)',
      'ML deployment (Docker, APIs)'
    ],
    depthLevel: 'expert',
    interviewFocus: [
      'ML algorithms and math behind them',
      'Model selection and evaluation',
      'Feature engineering strategies',
      'Handling imbalanced data',
      'Production ML challenges',
      'Statistical hypothesis testing',
      'Case studies with real data'
    ],
    realWorldScenarios: [
      'Build a recommendation system for e-commerce',
      'Predict customer churn with 85%+ accuracy',
      'Model performs well in training but poorly in production - why?',
      'Which features would you use to predict loan defaults?',
      'How do you handle missing values in time-series data?'
    ],
    avoidTopics: [
      'Frontend development details',
      'Infrastructure and DevOps (unless MLOps role)',
      'Low-level system design',
      'API authentication mechanisms'
    ],
    companyTypes: ['faang', 'startup', 'enterprise']
  },

  'business-analyst': {
    id: 'business-analyst',
    name: 'Business Analyst',
    description: 'Bridges business and technology, defines requirements and processes',
    dailyTasks: [
      'Gather and document requirements',
      'Create process flows and diagrams',
      'Analyze business problems',
      'Write user stories and acceptance criteria',
      'Facilitate stakeholder meetings',
      'Create business cases and ROI analysis'
    ],
    keySkills: [
      'Requirements gathering',
      'Process mapping (BPMN)',
      'Stakeholder management',
      'Excel and data analysis',
      'SQL basics for data validation',
      'Agile/Scrum methodology',
      'Documentation (Confluence, Jira)',
      'Business domain knowledge'
    ],
    depthLevel: 'surface',
    interviewFocus: [
      'Requirement elicitation techniques',
      'Handling conflicting stakeholder needs',
      'Process improvement methodologies',
      'Case studies (business problems)',
      'SQL for basic analysis',
      'Communication and presentation',
      'Analytical thinking and problem-solving'
    ],
    realWorldScenarios: [
      'Stakeholders disagree on feature priority - how do you resolve?',
      'Product requirements are vague - what questions do you ask?',
      'Current checkout process has 60% drop-off - how do you analyze?',
      'Need to present technical solution to non-technical executives',
      'Two teams need the same data but want different formats'
    ],
    avoidTopics: [
      'Deep technical implementation',
      'Algorithms and data structures',
      'System architecture details',
      'Programming language specifics',
      'ML/AI technical details'
    ],
    companyTypes: ['enterprise', 'consulting']
  },

  'devops-engineer': {
    id: 'devops-engineer',
    name: 'DevOps/SRE Engineer',
    description: 'Maintains infrastructure, CI/CD, monitoring, and reliability',
    dailyTasks: [
      'Manage Kubernetes clusters',
      'Build and maintain CI/CD pipelines',
      'Monitor system health and alerts',
      'Incident response and root cause analysis',
      'Infrastructure as Code (Terraform)',
      'Optimize cloud costs'
    ],
    keySkills: [
      'Docker and Kubernetes',
      'CI/CD (Jenkins, GitHub Actions)',
      'Cloud platforms (AWS, Azure, GCP)',
      'Infrastructure as Code',
      'Monitoring and logging (Datadog, Prometheus)',
      'Scripting (Bash, Python)',
      'Networking basics',
      'Security best practices'
    ],
    depthLevel: 'expert',
    interviewFocus: [
      'Kubernetes architecture and debugging',
      'CI/CD pipeline design',
      'Incident response scenarios',
      'Infrastructure scaling strategies',
      'Security and compliance',
      'Cost optimization',
      'System reliability patterns'
    ],
    realWorldScenarios: [
      'Production is down - walk me through your investigation',
      'Deployments take 45 minutes - how do you speed them up?',
      'AWS bill jumped 40% this month - how do you investigate?',
      'Need to migrate 100 microservices to Kubernetes',
      'Application has memory leaks causing pod restarts'
    ],
    avoidTopics: [
      'Frontend framework details',
      'Business analysis and requirements',
      'Data science and ML algorithms',
      'UI/UX design'
    ],
    companyTypes: ['faang', 'startup', 'enterprise']
  }
};

// ============================================================================
// EXPERIENCE LEVELS - What defines junior vs senior
// ============================================================================

interface ExperienceLevel {
  id: string;
  name: string;
  yearsOfExperience: string;
  expectedKnowledge: string[];
  questionDifficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  focusAreas: string[];
  interviewStyle: string;
}

const EXPERIENCE_LEVELS: Record<string, ExperienceLevel> = {
  'junior': {
    id: 'junior',
    name: 'Junior/Entry Level (0-2 years)',
    yearsOfExperience: '0-2 years',
    expectedKnowledge: [
      'Fundamental concepts and syntax',
      'Basic data structures and algorithms',
      'Simple problem solving',
      'Following existing patterns',
      'Code quality basics',
      'Testing fundamentals'
    ],
    questionDifficulty: 'easy',
    focusAreas: [
      'Language/framework basics',
      'Simple coding problems',
      'Understanding documentation',
      'Code readability',
      'Basic debugging',
      'Learning ability'
    ],
    interviewStyle: 'Test foundational knowledge, problem-solving approach, and learning potential. Focus on "can they learn and grow?"'
  },

  'mid-level': {
    id: 'mid-level',
    name: 'Mid-Level (2-5 years)',
    yearsOfExperience: '2-5 years',
    expectedKnowledge: [
      'Deep knowledge of primary tech stack',
      'Design patterns and best practices',
      'Performance optimization',
      'Testing strategies',
      'Production debugging experience',
      'Code review skills',
      'Mentoring junior developers'
    ],
    questionDifficulty: 'medium',
    focusAreas: [
      'Practical problem solving',
      'System design (components, not full system)',
      'Trade-offs in solutions',
      'Production experience',
      'Code quality and patterns',
      'Collaboration skills'
    ],
    interviewStyle: 'Test depth in technology, practical experience, and decision-making. Focus on "have they solved real problems?"'
  },

  'senior': {
    id: 'senior',
    name: 'Senior (5-8 years)',
    yearsOfExperience: '5-8 years',
    expectedKnowledge: [
      'Expert in multiple technologies',
      'System architecture experience',
      'Performance at scale',
      'Technical leadership',
      'Cross-team collaboration',
      'Technical decision making',
      'Production war stories',
      'Mentorship and growth of team'
    ],
    questionDifficulty: 'hard',
    focusAreas: [
      'System design (full distributed systems)',
      'Architecture decisions and trade-offs',
      'Scalability and performance',
      'Technical leadership',
      'Complex problem solving',
      'Production incidents and resolution',
      'Cross-functional collaboration'
    ],
    interviewStyle: 'Test systems thinking, technical depth, leadership, and judgment. Focus on "can they own and drive projects?"'
  },

  'staff-principal': {
    id: 'staff-principal',
    name: 'Staff/Principal (8+ years)',
    yearsOfExperience: '8+ years',
    expectedKnowledge: [
      'Architectural vision',
      'Multi-system design',
      'Technical strategy',
      'Industry best practices',
      'Influence without authority',
      'Company-wide impact',
      'Technology evaluation and adoption'
    ],
    questionDifficulty: 'mixed',
    focusAreas: [
      'Complex system design',
      'Technology strategy',
      'Technical roadmaps',
      'Cross-team architecture',
      'Trade-offs at company scale',
      'Technical debt management',
      'Organizational impact'
    ],
    interviewStyle: 'Test strategic thinking, architectural vision, and organizational impact. Focus on "can they set technical direction?"'
  }
};

// ============================================================================
// COMPANY TYPES - Different interview styles
// ============================================================================

const COMPANY_STYLES = {
  'faang': {
    focus: ['Algorithms heavy', 'System design', 'Coding excellence', 'Scale problems'],
    difficulty: 'hard',
    questionTypes: ['LeetCode-style', 'Design at scale', 'Optimization'],
  },
  'startup': {
    focus: ['Ship fast', 'Practical skills', 'Full stack', 'Product thinking'],
    difficulty: 'medium',
    questionTypes: ['Build a feature', 'Debug scenarios', 'Architecture basics'],
  },
  'enterprise': {
    focus: ['Stability', 'Best practices', 'Team collaboration', 'Domain knowledge'],
    difficulty: 'medium',
    questionTypes: ['Design patterns', 'Code quality', 'Process questions'],
  },
  'consulting': {
    focus: ['Client communication', 'Business value', 'Multiple domains', 'Adaptability'],
    difficulty: 'mixed',
    questionTypes: ['Case studies', 'Business scenarios', 'Communication'],
  }
};

// ============================================================================
// AI PROMPT GENERATOR - Creates context-aware prompts
// ============================================================================

function generateQuestionPrompt(config: {
  domain: string;
  stack: string;
  role: string;
  experienceLevel: string;
  companyType: string;
  count: number;
}): string {
  const roleProfile = ROLE_PROFILES[config.role];
  const expLevel = EXPERIENCE_LEVELS[config.experienceLevel];
  const companyStyle = COMPANY_STYLES[config.companyType as keyof typeof COMPANY_STYLES];

  if (!roleProfile || !expLevel) {
    throw new Error('Invalid role or experience level');
  }

  return `
# Interview Question Generation Task

## Context
You are generating interview questions for a **${roleProfile.name}** position at a **${config.companyType}** company.

### Role Details:
- **Description**: ${roleProfile.description}
- **Daily Tasks**: ${roleProfile.dailyTasks.join(', ')}
- **Key Skills**: ${roleProfile.keySkills.join(', ')}
- **Depth Level**: ${roleProfile.depthLevel}

### Experience Level: ${expLevel.name}
- **Years**: ${expLevel.yearsOfExperience}
- **Expected Knowledge**: ${expLevel.expectedKnowledge.join('; ')}
- **Difficulty**: ${expLevel.questionDifficulty}
- **Interview Style**: ${expLevel.interviewStyle}

### Company Type: ${config.companyType.toUpperCase()}
- **Focus**: ${companyStyle.focus.join(', ')}
- **Question Types**: ${companyStyle.questionTypes.join(', ')}

### Technical Focus:
- **Domain**: ${config.domain}
- **Stack**: ${config.stack}

## Real-World Scenarios This Role Faces:
${roleProfile.realWorldScenarios.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## What to AVOID (Not relevant for this role):
${roleProfile.avoidTopics.map(t => `- ${t}`).join('\n')}

## Task
Generate exactly ${config.count} interview questions that:

### Quality Requirements:
1. **REALISTIC**: Questions asked in actual interviews at ${config.companyType} companies
2. **ROLE-SPECIFIC**: Match what a ${roleProfile.name} actually does day-to-day
3. **LEVEL-APPROPRIATE**: Suitable for ${expLevel.name} candidate
4. **PRACTICAL**: Can be answered with real experience, not just theory
5. **TESTABLE**: Interviewer can clearly judge if answer is good
6. **DEPTH-CALIBRATED**: Match the ${roleProfile.depthLevel} depth expected for this role

### Question Distribution:
- 30% Fundamentals (must-know basics for the role)
- 40% Practical Application (real scenarios they'll face)
- 20% Problem Solving (debugging, optimization, trade-offs)
- 10% Best Practices (production readiness, code quality)

### For Each Question, Provide:

\`\`\`json
{
  "id": "unique-slug-id",
  "title": "Clear, specific title (8-12 words)",
  "slug": "url-friendly-slug",
  "question": "The actual interview question (2-4 sentences, clear context)",
  "answer": "Model answer with specific details (4-6 sentences, use numbers, examples, technical terms)",
  "explanation": "Why this question matters for a ${roleProfile.name} (2-3 sentences)",
  "codeExample": "Code snippet if applicable (actual working code, not pseudo-code)",
  "difficulty": "${expLevel.questionDifficulty}",
  "importance": "high/medium/low (how often this comes up in real interviews)",
  "keywords": ["5-8 technical terms that should appear in a good answer"],
  "relatedTopics": ["2-4 related concepts to explore"],
  "commonMistakes": [
    "Specific mistake candidates make (e.g., 'Forgetting to close database connections')",
    "Another common wrong answer or approach"
  ],
  "followUpQuestions": [
    "Logical follow-up interviewer would ask",
    "Another deeper question on same topic"
  ],
  "realWorldScenario": "Specific situation where this knowledge is needed (e.g., 'When your API hits 1000 req/sec and starts timing out')",
  "goodAnswerCriteria": [
    "What makes an answer excellent",
    "Key points that must be covered"
  ],
  "tags": ["${config.domain}", "${config.stack}", "2-3 specific tags"]
}
\`\`\`

### Examples of Good Questions for This Role:

**Example 1 (Fundamental):**
${getExampleQuestion(config.role, 'fundamental')}

**Example 2 (Practical):**
${getExampleQuestion(config.role, 'practical')}

**Example 3 (Problem Solving):**
${getExampleQuestion(config.role, 'problem-solving')}

## Output Format
Return a valid JSON array of ${config.count} questions following the exact schema above.

## Critical Rules:
1. Questions MUST be specific to **${roleProfile.name}** - not generic software questions
2. Difficulty MUST match **${expLevel.name}** - not too easy, not too hard
3. Questions MUST reflect **${config.companyType}** interview style
4. Code examples MUST use **${config.stack}** technology
5. Scenarios MUST be realistic for **${roleProfile.description}**
6. AVOID topics listed in "What to AVOID" section
7. Every question should have a clear right/wrong answer or evaluation criteria

Generate high-quality, interview-ready questions now.
`.trim();
}

function getExampleQuestion(role: string, type: string): string {
  const examples: Record<string, Record<string, string>> = {
    'backend-engineer': {
      'fundamental': 'Q: Explain the N+1 query problem in ORMs and how to fix it.\nWhy: This is a daily issue in backend development that causes performance problems.',
      'practical': 'Q: Your API suddenly starts returning 500 errors for 10% of requests. Walk me through your debugging process.\nWhy: Tests their production debugging skills.',
      'problem-solving': 'Q: You need to process 1 million records daily. Currently takes 6 hours. How do you optimize it?\nWhy: Tests architecture and optimization thinking.'
    },
    'data-analyst': {
      'fundamental': 'Q: Write a SQL query to find the top 10 customers by revenue, including their last purchase date.\nWhy: Core SQL skill they use daily.',
      'practical': 'Q: Marketing says email campaign drove 30% revenue increase. How do you verify this claim?\nWhy: Tests analytical thinking and skepticism.',
      'problem-solving': 'Q: You have a dataset with 40% missing values in the "age" column. What do you do?\nWhy: Real data cleaning scenario.'
    },
    'fullstack-engineer': {
      'fundamental': 'Q: Explain how authentication typically flows from frontend to backend. What gets stored where?\nWhy: Core understanding of web app architecture.',
      'practical': 'Q: Build a "like" feature for posts. Design the API endpoint, database schema, and React component.\nWhy: Tests end-to-end thinking.',
      'problem-solving': 'Q: Users complain the feed page loads slowly. It fetches posts, user data, and comments. How do you optimize?\nWhy: Common performance issue.'
    },
    'data-scientist': {
      'fundamental': 'Q: Explain precision, recall, and F1 score. When do you optimize for each?\nWhy: Core ML evaluation metrics.',
      'practical': 'Q: Your churn prediction model has 92% accuracy but only catches 30% of actual churners. What\'s wrong?\nWhy: Tests understanding of imbalanced data.',
      'problem-solving': 'Q: Model performs great in training (95% accuracy) but poorly in production (65%). What do you check?\nWhy: Classic overfitting scenario.'
    },
    'business-analyst': {
      'fundamental': 'Q: Walk me through how you gather requirements for a new feature.\nWhy: Core BA skill.',
      'practical': 'Q: Engineering says your requirements are incomplete. Sales says they\'re perfect. How do you handle this?\nWhy: Tests stakeholder management.',
      'problem-solving': 'Q: Cart abandonment is 70%. Product wants to know why. How do you investigate?\nWhy: Real business problem analysis.'
    },
    'devops-engineer': {
      'fundamental': 'Q: Explain the difference between a Docker container and a Kubernetes pod.\nWhy: Core infrastructure knowledge.',
      'practical': 'Q: Your Kubernetes cluster shows pods constantly restarting with OOMKilled. How do you debug?\nWhy: Common production issue.',
      'problem-solving': 'Q: Need zero-downtime deployment for a stateful application. What\'s your strategy?\nWhy: Complex deployment scenario.'
    }
  };

  return examples[role]?.[type] || 'Example not available for this role';
}

// ============================================================================
// VALIDATION SYSTEM - Ensures quality
// ============================================================================

interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

function validateQuestion(question: any, roleProfile: RoleProfile, expLevel: ExperienceLevel): ValidationResult {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check required fields
  const requiredFields = ['title', 'question', 'answer', 'keywords', 'difficulty'];
  for (const field of requiredFields) {
    if (!question[field]) {
      issues.push(`Missing required field: ${field}`);
      score -= 20;
    }
  }

  // Check answer quality
  if (question.answer) {
    const wordCount = question.answer.split(' ').length;
    if (wordCount < 30) {
      issues.push('Answer too short (< 30 words) - needs more depth');
      score -= 10;
    }
    if (wordCount > 200) {
      suggestions.push('Answer might be too long - consider being more concise');
      score -= 5;
    }

    // Check for specific technical terms
    const hasNumbers = /\d/.test(question.answer);
    const hasExamples = /example|such as|like|e\.g\./i.test(question.answer);

    if (!hasNumbers && !hasExamples) {
      suggestions.push('Answer could be improved with specific examples or numbers');
      score -= 5;
    }
  }

  // Check if question matches role
  const questionText = (question.title + ' ' + question.question + ' ' + question.answer).toLowerCase();
  const roleKeywords = roleProfile.keySkills.map(s => s.toLowerCase());
  const matchedKeywords = roleKeywords.filter(k => questionText.includes(k));

  if (matchedKeywords.length === 0) {
    issues.push(`Question doesn't seem relevant to ${roleProfile.name} role`);
    score -= 15;
  }

  // Check difficulty matches experience level
  if (question.difficulty !== expLevel.questionDifficulty && expLevel.questionDifficulty !== 'mixed') {
    issues.push(`Difficulty mismatch: expected ${expLevel.questionDifficulty}, got ${question.difficulty}`);
    score -= 10;
  }

  // Check keywords quality
  if (question.keywords && question.keywords.length < 3) {
    issues.push('Too few keywords (need at least 3)');
    score -= 5;
  }

  return {
    isValid: issues.length === 0,
    score: Math.max(0, score),
    issues,
    suggestions
  };
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

export {
  ROLE_PROFILES,
  EXPERIENCE_LEVELS,
  COMPANY_STYLES,
  generateQuestionPrompt,
  validateQuestion
};

// Example usage:
if (require.main === module) {
  // Generate prompt for Backend Engineer, mid-level, at a startup
  const prompt = generateQuestionPrompt({
    domain: 'Python Backend',
    stack: 'Django',
    role: 'backend-engineer',
    experienceLevel: 'mid-level',
    companyType: 'startup',
    count: 40
  });

  console.log('='.repeat(80));
  console.log('GENERATED PROMPT:');
  console.log('='.repeat(80));
  console.log(prompt);
  console.log('\n');
  console.log('Copy this prompt to Claude/ChatGPT to generate questions!');
}