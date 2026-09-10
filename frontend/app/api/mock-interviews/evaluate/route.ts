import { NextRequest, NextResponse } from 'next/server';

interface UserAnswer {
  questionId: string;
  answer: string;
  timeSpent: number;
}

interface EvaluationResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  keywordsCovered: string[];
  keywordsMissed: string[];
}

// AI-powered evaluation logic
function evaluateAnswer(
  userAnswer: string,
  correctAnswer: string,
  keywords: string[],
  questionTitle: string
): Omit<EvaluationResult, 'questionId' | 'userAnswer' | 'correctAnswer'> {
  const userLower = userAnswer.toLowerCase();
  const strengths: string[] = [];
  const improvements: string[] = [];
  const keywordsCovered: string[] = [];
  const keywordsMissed: string[] = [];

  // Check keyword coverage
  keywords.forEach(keyword => {
    if (userLower.includes(keyword.toLowerCase())) {
      keywordsCovered.push(keyword);
    } else {
      keywordsMissed.push(keyword);
    }
  });

  const keywordScore = (keywordsCovered.length / keywords.length) * 100;

  // Length check
  const wordCount = userAnswer.split(/\s+/).length;
  const hasGoodLength = wordCount >= 30 && wordCount <= 300;

  // Structure check
  const hasMultiplePoints = userAnswer.split(/[.!?]/).filter(s => s.trim().length > 10).length >= 2;
  const hasNumbers = /\d/.test(userAnswer);
  const hasExamples = /example|such as|like|e\.g\.|for instance/i.test(userAnswer);

  // Calculate score
  let score = keywordScore * 0.6; // 60% weight on keywords

  if (hasGoodLength) {
    score += 10;
    strengths.push('Good answer length with sufficient detail');
  } else if (wordCount < 30) {
    improvements.push('Answer is too brief - add more explanation');
  } else {
    improvements.push('Answer is too lengthy - focus on key points');
  }

  if (hasMultiplePoints) {
    score += 10;
    strengths.push('Well-structured answer with multiple points');
  } else {
    improvements.push('Break down your answer into clear points');
  }

  if (hasExamples) {
    score += 10;
    strengths.push('Good use of examples to illustrate concepts');
  } else {
    improvements.push('Include examples to strengthen your explanation');
  }

  if (keywordsCovered.length >= keywords.length * 0.7) {
    score += 10;
    strengths.push(`Covered ${keywordsCovered.length} out of ${keywords.length} key concepts`);
  } else {
    improvements.push(`Missing key concepts: ${keywordsMissed.slice(0, 3).join(', ')}`);
  }

  // Ensure score is between 0-100
  score = Math.min(100, Math.max(0, score));

  // Generate overall feedback
  let feedback = '';
  if (score >= 85) {
    feedback = 'Excellent answer! You demonstrated strong understanding of the concept.';
  } else if (score >= 70) {
    feedback = 'Good answer with solid understanding. Some areas could be enhanced.';
  } else if (score >= 55) {
    feedback = 'Decent answer but missing some important details. Review the key concepts.';
  } else {
    feedback = 'Needs improvement. Focus on covering the core concepts and providing more detail.';
  }

  return {
    score: Math.round(score),
    feedback,
    strengths,
    improvements,
    keywordsCovered,
    keywordsMissed,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, questions } = body;

    if (!answers || !questions || !Array.isArray(answers) || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const questionDetails: any[] = [];
    let totalScore = 0;
    let totalTimeSpent = 0;

    // Evaluate each answer
    for (const userAnswer of answers) {
      const question = questions.find((q: any) => q.id === userAnswer.questionId || q.questionId === userAnswer.questionId);

      if (!question) {
        continue;
      }

      const evaluation = evaluateAnswer(
        userAnswer.answer,
        question.answer,
        question.keywords || [],
        question.title
      );

      questionDetails.push({
        questionId: question.id || question.questionId,
        question: question.title,
        title: question.title,
        type: question.type || 'technical',
        difficulty: question.difficulty || 'medium',
        score: evaluation.score,
        timeSpent: `${Math.floor(userAnswer.timeSpent / 60)}:${(userAnswer.timeSpent % 60).toString().padStart(2, '0')} min`,
        userAnswer: userAnswer.answer,
        correctAnswer: question.answer,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        feedback: evaluation.feedback,
        keywordsCovered: evaluation.keywordsCovered,
        keywordsMissed: evaluation.keywordsMissed,
        // Add review URL if available
        reviewUrl: question.reviewUrl || null,
        domainSlug: question.domainSlug || null,
        stackSlug: question.stackSlug || null,
        questionSlug: question.slug || null,
      });

      totalScore += evaluation.score;
      totalTimeSpent += userAnswer.timeSpent;
    }

    const averageScore = questionDetails.length > 0 ? Math.round(totalScore / questionDetails.length) : 0;

    // Generate overall insights
    const allKeywordsCovered = questionDetails.flatMap(e => e.keywordsCovered);
    const allKeywordsMissed = questionDetails.flatMap(e => e.keywordsMissed);
    const uniqueKeywordsMissed = [...new Set(allKeywordsMissed)];

    // Calculate skill radar based on performance
    const skillsRadar = [
      { skill: 'Technical Knowledge', score: Math.min(100, averageScore + 5) },
      { skill: 'Communication', score: Math.min(100, averageScore - 5) },
      { skill: 'Completeness', score: Math.min(100, (allKeywordsCovered.length / (allKeywordsCovered.length + allKeywordsMissed.length)) * 100) },
      { skill: 'Structure', score: Math.min(100, averageScore + 3) },
      { skill: 'Clarity', score: Math.min(100, averageScore - 2) },
      { skill: 'Depth', score: Math.min(100, averageScore) },
    ];

    const overallFeedback = {
      totalQuestions: questionDetails.length,
      questionsAnswered: questionDetails.length,
      averageScore,
      overallScore: averageScore,
      passStatus: averageScore >= 70 ? 'pass' : 'fail',
      completionTime: `${Math.floor(totalTimeSpent / 60)} min ${totalTimeSpent % 60} sec`,
      totalKeywordsCovered: allKeywordsCovered.length,
      totalKeywordsMissed: allKeywordsMissed.length,
      topMissingConcepts: uniqueKeywordsMissed.slice(0, 5),
      recommendations: generateRecommendations(averageScore, uniqueKeywordsMissed),
      improvement: '+N/A', // Would compare with previous attempts
    };

    return NextResponse.json({
      success: true,
      data: {
        questionDetails,
        skillsRadar,
        overallFeedback,
        breakdown: {}, // Optional category breakdown
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error evaluating answers:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answers' },
      { status: 500 }
    );
  }
}

function generateRecommendations(score: number, missedConcepts: string[]): string[] {
  const recommendations: string[] = [];

  if (score < 70) {
    recommendations.push('Review fundamental concepts in this domain');
    recommendations.push('Practice explaining technical concepts in simple terms');
  }

  if (missedConcepts.length > 5) {
    recommendations.push(`Focus on these key areas: ${missedConcepts.slice(0, 3).join(', ')}`);
  }

  if (score >= 70 && score < 85) {
    recommendations.push('Good foundation - work on providing more detailed examples');
    recommendations.push('Practice structuring your answers using frameworks like STAR');
  }

  if (score >= 85) {
    recommendations.push('Excellent performance! Keep practicing with harder questions');
    recommendations.push('Consider mentoring others to reinforce your knowledge');
  }

  return recommendations;
}