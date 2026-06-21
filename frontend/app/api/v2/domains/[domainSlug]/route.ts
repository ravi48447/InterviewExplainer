import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, this would query the database
const domainData: Record<string, any> = {
  'java-backend-1-3': {
    id: '1',
    name: 'Java Backend Development',
    slug: 'java-backend-1-3',
    description: 'Master Java backend development with Spring Boot, microservices, and cloud deployment',
    stacks: [
      { id: '1', name: 'Core Java', slug: 'core-java', questionCount: 28 },
      { id: '2', name: 'Spring Boot', slug: 'spring-boot', questionCount: 32 },
      { id: '3', name: 'JPA & Hibernate', slug: 'jpa', questionCount: 24 },
      { id: '4', name: 'Microservices', slug: 'microservices', questionCount: 19 },
      { id: '5', name: 'REST APIs', slug: 'rest-api', questionCount: 17 },
      { id: '6', name: 'AWS', slug: 'aws', questionCount: 14 },
      { id: '7', name: 'Security', slug: 'security', questionCount: 8 },
    ],
  },
  'react-frontend': {
    id: '2',
    name: 'React Frontend',
    slug: 'react-frontend',
    description: 'Build modern web applications with React, hooks, and state management',
    stacks: [
      { id: '8', name: 'React Basics', slug: 'react-basics', questionCount: 22 },
      { id: '9', name: 'Hooks', slug: 'hooks', questionCount: 26 },
      { id: '10', name: 'State Management', slug: 'state-management', questionCount: 18 },
      { id: '11', name: 'Performance', slug: 'performance', questionCount: 16 },
      { id: '12', name: 'Testing', slug: 'testing', questionCount: 16 },
    ],
  },
  'system-design': {
    id: '3',
    name: 'System Design',
    slug: 'system-design',
    description: 'Design scalable distributed systems and microservices architectures',
    stacks: [
      { id: '13', name: 'Scalability', slug: 'scalability', questionCount: 15 },
      { id: '14', name: 'Databases', slug: 'databases', questionCount: 14 },
      { id: '15', name: 'Caching', slug: 'caching', questionCount: 13 },
      { id: '16', name: 'Load Balancing', slug: 'load-balancing', questionCount: 12 },
      { id: '17', name: 'Microservices Architecture', slug: 'microservices-arch', questionCount: 13 },
    ],
  },
  'sql-databases': {
    id: '4',
    name: 'SQL & Databases',
    slug: 'sql-databases',
    description: 'Master SQL queries, database design, and optimization techniques',
    stacks: [
      { id: '18', name: 'SQL Queries', slug: 'sql-queries', questionCount: 20 },
      { id: '19', name: 'Optimization', slug: 'optimization', questionCount: 18 },
      { id: '20', name: 'Indexing', slug: 'indexing', questionCount: 17 },
      { id: '21', name: 'Transactions', slug: 'transactions', questionCount: 15 },
      { id: '22', name: 'NoSQL', slug: 'nosql', questionCount: 15 },
    ],
  },
  'aws-cloud': {
    id: '5',
    name: 'AWS Cloud',
    slug: 'aws-cloud',
    description: 'Deploy and manage applications on AWS cloud infrastructure',
    stacks: [
      { id: '23', name: 'EC2', slug: 'ec2', questionCount: 16 },
      { id: '24', name: 'S3', slug: 's3', questionCount: 15 },
      { id: '25', name: 'Lambda', slug: 'lambda', questionCount: 14 },
      { id: '26', name: 'RDS', slug: 'rds', questionCount: 14 },
      { id: '27', name: 'CloudFormation', slug: 'cloudformation', questionCount: 14 },
    ],
  },
  'dsa': {
    id: '6',
    name: 'Data Structures & Algorithms',
    slug: 'dsa',
    description: 'Master fundamental data structures and algorithmic problem solving',
    stacks: [
      { id: '28', name: 'Arrays', slug: 'arrays', questionCount: 35 },
      { id: '29', name: 'Trees', slug: 'trees', questionCount: 32 },
      { id: '30', name: 'Graphs', slug: 'graphs', questionCount: 28 },
      { id: '31', name: 'Dynamic Programming', slug: 'dp', questionCount: 31 },
      { id: '32', name: 'Sorting & Searching', slug: 'sorting', questionCount: 30 },
    ],
  },
  'python-backend': {
    id: '7',
    name: 'Python Backend',
    slug: 'python-backend',
    description: 'Build backend applications with Python, Django, and FastAPI',
    stacks: [
      { id: '33', name: 'Python Basics', slug: 'python-basics', questionCount: 20 },
      { id: '34', name: 'Django', slug: 'django', questionCount: 22 },
      { id: '35', name: 'FastAPI', slug: 'fastapi', questionCount: 18 },
      { id: '36', name: 'SQLAlchemy', slug: 'sqlalchemy', questionCount: 15 },
      { id: '37', name: 'Testing', slug: 'pytest', questionCount: 14 },
    ],
  },
  'devops': {
    id: '8',
    name: 'DevOps & CI/CD',
    slug: 'devops',
    description: 'Implement CI/CD pipelines and container orchestration',
    stacks: [
      { id: '38', name: 'Docker', slug: 'docker', questionCount: 15 },
      { id: '39', name: 'Kubernetes', slug: 'kubernetes', questionCount: 14 },
      { id: '40', name: 'Jenkins', slug: 'jenkins', questionCount: 12 },
      { id: '41', name: 'Git', slug: 'git', questionCount: 10 },
      { id: '42', name: 'Monitoring', slug: 'monitoring', questionCount: 10 },
    ],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domainSlug: string }> }
) {
  try {
    const { domainSlug } = await params;

    // In production, this would query your database by slug
    const domain = domainData[domainSlug];

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(domain);
  } catch (error) {
    console.error('Error fetching domain:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domain' },
      { status: 500 }
    );
  }
}