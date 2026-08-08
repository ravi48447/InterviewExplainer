import { NextRequest, NextResponse } from 'next/server';

// This is where you'd have your real questions from database
// For now, providing sample questions that the mock interview system can use
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domainSlug: string; stackSlug: string }> }
) {
  try {
    const { domainSlug, stackSlug } = await params;

    // In production, this would query your database
    // Returning structure that includes questions with full details

    // Sample questions - in real app, these come from your database
    const sampleQuestions = generateSampleQuestions(domainSlug, stackSlug);

    const stackData = {
      id: stackSlug,
      name: formatStackName(stackSlug),
      slug: stackSlug,
      domainSlug: domainSlug,
      questions: sampleQuestions,
    };

    return NextResponse.json(stackData);
  } catch (error) {
    console.error('Error fetching stack:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stack' },
      { status: 500 }
    );
  }
}

function formatStackName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generateSampleQuestions(domainSlug: string, stackSlug: string) {
  // Generate sample questions based on domain and stack
  // In production, these come from your actual database

  const baseQuestions = [
    {
      id: `${stackSlug}-1`,
      title: `What is ${formatStackName(stackSlug)}?`,
      slug: `${stackSlug}-intro`,
      question: `Explain what ${formatStackName(stackSlug)} is and its key concepts.`,
      answer: `${formatStackName(stackSlug)} is a fundamental concept in ${domainSlug}. It involves understanding core principles, best practices, and practical applications. Key aspects include performance, scalability, and maintainability.`,
      explanation: `This is an important foundational question that tests basic understanding.`,
      difficulty: 'medium',
      tags: [stackSlug, 'basics', 'fundamentals'],
    },
    {
      id: `${stackSlug}-2`,
      title: `Best practices for ${formatStackName(stackSlug)}`,
      slug: `${stackSlug}-best-practices`,
      question: `What are the best practices when working with ${formatStackName(stackSlug)}?`,
      answer: `Best practices include: 1) Follow industry standards, 2) Write clean and maintainable code, 3) Consider performance implications, 4) Use proper error handling, 5) Document your implementation.`,
      explanation: `Understanding best practices is crucial for writing production-quality code.`,
      difficulty: 'medium',
      tags: [stackSlug, 'best-practices', 'coding-standards'],
    },
    {
      id: `${stackSlug}-3`,
      title: `Common issues in ${formatStackName(stackSlug)}`,
      slug: `${stackSlug}-common-issues`,
      question: `What are common pitfalls or issues when working with ${formatStackName(stackSlug)}?`,
      answer: `Common issues include improper configuration, performance bottlenecks, security vulnerabilities, and lack of proper testing. Always validate inputs, handle errors gracefully, and follow security best practices.`,
      explanation: `Knowing common pitfalls helps avoid mistakes in production.`,
      difficulty: 'high',
      tags: [stackSlug, 'troubleshooting', 'common-mistakes'],
    },
    {
      id: `${stackSlug}-4`,
      title: `Advanced ${formatStackName(stackSlug)} concepts`,
      slug: `${stackSlug}-advanced`,
      question: `Explain advanced concepts and patterns in ${formatStackName(stackSlug)}.`,
      answer: `Advanced concepts include design patterns, optimization techniques, architectural considerations, and integration with other systems. These require deep understanding of the technology stack and its ecosystem.`,
      explanation: `Advanced questions test deeper knowledge and real-world experience.`,
      difficulty: 'high',
      tags: [stackSlug, 'advanced', 'architecture'],
    },
    {
      id: `${stackSlug}-5`,
      title: `${formatStackName(stackSlug)} in production`,
      slug: `${stackSlug}-production`,
      question: `How do you deploy and maintain ${formatStackName(stackSlug)} in production?`,
      answer: `Production deployment requires proper CI/CD pipelines, monitoring, logging, error tracking, and performance optimization. Use containerization, implement health checks, and have rollback strategies in place.`,
      explanation: `Production readiness is essential for any technology.`,
      difficulty: 'high',
      tags: [stackSlug, 'production', 'deployment', 'devops'],
    },
  ];

  return baseQuestions;
}