import { NextRequest, NextResponse } from 'next/server';

// Mock domains - in production, this would fetch from database
// This matches your actual domain structure
const domains = [
  {
    id: '1',
    name: 'Java Backend Development',
    slug: 'java-backend-1-3',
    questionCount: 142,
    stacks: [
      { id: '1', name: 'Core Java', slug: 'core-java' },
      { id: '2', name: 'Spring Boot', slug: 'spring-boot' },
      { id: '3', name: 'JPA & Hibernate', slug: 'jpa' },
      { id: '4', name: 'Microservices', slug: 'microservices' },
      { id: '5', name: 'REST APIs', slug: 'rest-api' },
      { id: '6', name: 'AWS', slug: 'aws' },
      { id: '7', name: 'Security', slug: 'security' },
    ],
  },
  {
    id: '2',
    name: 'React Frontend',
    slug: 'react-frontend',
    questionCount: 98,
    stacks: [
      { id: '8', name: 'React Basics', slug: 'react-basics' },
      { id: '9', name: 'Hooks', slug: 'hooks' },
      { id: '10', name: 'State Management', slug: 'state-management' },
      { id: '11', name: 'Performance', slug: 'performance' },
      { id: '12', name: 'Testing', slug: 'testing' },
    ],
  },
  {
    id: '3',
    name: 'System Design',
    slug: 'system-design',
    questionCount: 67,
    stacks: [
      { id: '13', name: 'Scalability', slug: 'scalability' },
      { id: '14', name: 'Databases', slug: 'databases' },
      { id: '15', name: 'Caching', slug: 'caching' },
      { id: '16', name: 'Load Balancing', slug: 'load-balancing' },
      { id: '17', name: 'Microservices Architecture', slug: 'microservices-arch' },
    ],
  },
  {
    id: '4',
    name: 'SQL & Databases',
    slug: 'sql-databases',
    questionCount: 85,
    stacks: [
      { id: '18', name: 'SQL Queries', slug: 'sql-queries' },
      { id: '19', name: 'Optimization', slug: 'optimization' },
      { id: '20', name: 'Indexing', slug: 'indexing' },
      { id: '21', name: 'Transactions', slug: 'transactions' },
      { id: '22', name: 'NoSQL', slug: 'nosql' },
    ],
  },
  {
    id: '5',
    name: 'AWS Cloud',
    slug: 'aws-cloud',
    questionCount: 73,
    stacks: [
      { id: '23', name: 'EC2', slug: 'ec2' },
      { id: '24', name: 'S3', slug: 's3' },
      { id: '25', name: 'Lambda', slug: 'lambda' },
      { id: '26', name: 'RDS', slug: 'rds' },
      { id: '27', name: 'CloudFormation', slug: 'cloudformation' },
    ],
  },
  {
    id: '6',
    name: 'Data Structures & Algorithms',
    slug: 'dsa',
    questionCount: 156,
    stacks: [
      { id: '28', name: 'Arrays', slug: 'arrays' },
      { id: '29', name: 'Trees', slug: 'trees' },
      { id: '30', name: 'Graphs', slug: 'graphs' },
      { id: '31', name: 'Dynamic Programming', slug: 'dp' },
      { id: '32', name: 'Sorting & Searching', slug: 'sorting' },
    ],
  },
  {
    id: '7',
    name: 'Python Backend',
    slug: 'python-backend',
    questionCount: 89,
    stacks: [
      { id: '33', name: 'Python Basics', slug: 'python-basics' },
      { id: '34', name: 'Django', slug: 'django' },
      { id: '35', name: 'FastAPI', slug: 'fastapi' },
      { id: '36', name: 'SQLAlchemy', slug: 'sqlalchemy' },
      { id: '37', name: 'Testing', slug: 'pytest' },
    ],
  },
  {
    id: '8',
    name: 'DevOps & CI/CD',
    slug: 'devops',
    questionCount: 61,
    stacks: [
      { id: '38', name: 'Docker', slug: 'docker' },
      { id: '39', name: 'Kubernetes', slug: 'kubernetes' },
      { id: '40', name: 'Jenkins', slug: 'jenkins' },
      { id: '41', name: 'Git', slug: 'git' },
      { id: '42', name: 'Monitoring', slug: 'monitoring' },
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production, this would query your database
    // For now, return mock data that matches your structure

    // You can filter domains by query params if needed
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');

    let result = domains;

    if (limit) {
      result = domains.slice(0, parseInt(limit));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching domains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}