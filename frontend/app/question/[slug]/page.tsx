import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPagePayload, QuestionPagePayload, AnswerSection, QuestionSummary } from "@/lib/api";
import { ArrowLeft, ArrowRight, Clock, Target, CheckCircle2, ChevronRight } from "lucide-react";

import ReadingProgressBar from "@/components/ReadingProgressBar";
import CompletionTrigger from "@/components/CompletionTrigger";
import PeopleAlsoAsk from "@/components/PeopleAlsoAsk";

// Revalidate every hour
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await fetchPagePayload(slug);
    return {
      title: data.metaTitle ?? data.title,
      description: data.metaDescription ?? undefined,
      alternates: { canonical: `/question/${slug}` },
    };
  } catch {
    return { title: "Question Not Found" };
  }
}

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let data: QuestionPagePayload;
  
  try {
    data = await fetchPagePayload(slug);
  } catch {
    notFound();
  }

  // Calculate stack progress
  const totalInStack = data.quickQuestions?.length || 1;
  const currentIndex = data.quickQuestions?.findIndex(q => q.id === data.id) ?? 0;
  const completedCount = currentIndex + 1; // Simplification for demo
  const progressPercent = Math.round((completedCount / totalInStack) * 100);

  return (
    <div className="min-h-screen bg-background relative pb-24 font-sans text-foreground selection:bg-primary/20">
      <ReadingProgressBar />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row items-start gap-12 relative">
        
        {/* ── LEFT SIDEBAR (Navigation & Progress) ── */}
        <aside className="hidden lg:block w-[220px] shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-6 custom-scrollbar text-sm">
          {data.stackSlug && (
            <div className="mb-10">
              <Link
                href={`/stack/${data.stackSlug}`}
                className="inline-flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                {data.stackName}
              </Link>
              
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Progress</span>
                <span>{completedCount} / {totalInStack}</span>
              </div>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary/80 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          {data.quickQuestions?.length > 0 && (
            <nav className="space-y-0.5">
              <p className="text-[11px] font-bold text-muted-foreground mb-4 uppercase tracking-widest">Chapters</p>
              {data.quickQuestions.map((q, idx) => {
                const isCurrent = q.slug === slug;
                const isPast = idx < currentIndex;
                return (
                  <Link
                    key={q.id}
                    href={`/question/${q.slug}`}
                    className={`flex items-start gap-3 py-2 transition-colors border-l-2 pl-3 ${
                      isCurrent 
                        ? "text-foreground font-semibold border-primary" 
                        : isPast
                        ? "text-muted-foreground/80 hover:text-foreground border-border"
                        : "text-muted-foreground hover:text-foreground border-transparent hover:border-border"
                    }`}
                  >
                    <span className="leading-snug">{q.title}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </aside>

        {/* ── MAIN CONTENT (The Mini Blog) ── */}
        <main className="flex-1 min-w-0 max-w-[700px] w-full mx-auto">
          
          <article>
            <header className="mb-12 border-b border-border/50 pb-8">
              <div className="flex items-center gap-4 mb-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <span className={`${
                    data.difficulty === 'easy' ? 'text-green-600 dark:text-green-500' :
                    data.difficulty === 'medium' ? 'text-amber-600 dark:text-amber-500' :
                    'text-red-600 dark:text-red-500'
                  }`}>
                  {data.difficulty}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5 object-center">
                  <Clock className="h-3.5 w-3.5" />
                  {data.estimatedReadTime || 2} min read
                </span>
              </div>
              <h1 className="text-3xl sm:text-[2.2rem] font-extrabold tracking-tight leading-[1.25] text-foreground mb-6">
                {data.title}
              </h1>

              {/* Tags / Concepts rendered simply below title */}
              {data.concepts?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.concepts.map(c => (
                    <span key={c.id} className="text-xs font-medium py-1 px-2.5 rounded-full bg-muted/50 text-muted-foreground border border-border/50">
                      {c.name}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="space-y-12">
              {data.answerSections?.map(section => (
                <AnswerSectionRenderer key={section.id} section={section} />
              ))}
            </div>

            {/* Quizzes integrated like a knowledge check block */}
            {data.quizzes && data.quizzes.length > 0 && (
              <div className="mt-16 p-8 rounded-2xl bg-muted/30 border border-border/50">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" /> Knowledge Check
                </h3>
                <div className="space-y-8">
                  {data.quizzes.map((quiz, i) => (
                    <div key={quiz.id}>
                      <p className="font-semibold text-foreground mb-4 text-base">{i+1}. {quiz.quizQuestion}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {JSON.parse(quiz.optionsJson || '[]').map((opt: string, idx: number) => (
                          <button key={idx} className="text-left px-5 py-3 rounded-xl border border-border/50 bg-background hover:border-primary/50 text-sm text-foreground transition-all shadow-sm">
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* People Also Ask */}
            {data.peopleAlsoAsk && data.peopleAlsoAsk.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border/50">
                <h3 className="text-xl font-bold mb-6">Related Questions</h3>
                <PeopleAlsoAsk initialQuestions={data.peopleAlsoAsk} />
              </div>
            )}
          </article>

          <CompletionTrigger questionId={data.id} />

          {/* Simple Navigation footer */}
          <nav className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-between">
            {data.previousQuestion ? (
              <Link
                href={`/question/${data.previousQuestion.slug}`}
                className="group flex flex-col gap-1 w-full sm:w-1/2 p-2"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Previous
                </span>
                <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {data.previousQuestion.title}
                </span>
              </Link>
            ) : <div className="hidden sm:block sm:w-1/2" />}

            {(data.nextQuestion || (data.recommendedQuestions && data.recommendedQuestions.length > 0)) && (
              <Link
                href={`/question/${data.nextQuestion ? data.nextQuestion.slug : data.recommendedQuestions[0].slug}`}
                className="group flex flex-col gap-1 w-full sm:w-1/2 p-2 sm:text-right sm:items-end"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 justify-end">
                  {data.nextQuestion ? 'Next Chapter' : 'Recommended Next'} <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {data.nextQuestion ? data.nextQuestion.title : data.recommendedQuestions[0].title}
                </span>
              </Link>
            )}
          </nav>
        </main>

        {/* ── RIGHT PANEL (Interview Coach layer) ── */}
        <aside className="hidden xl:block w-[260px] shrink-0 sticky top-24 pr-2">
          <div className="pt-2">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
              <Target className="h-3.5 w-3.5" /> Coach's Notes
            </h3>

            {/* Time Estimate */}
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Target Explanation Time</p>
              <p className="text-[13px] font-semibold text-foreground">{data.estimatedReadTime || 2}-{Math.min((data.estimatedReadTime || 2) + 1, 5)} mins</p>
            </div>

            {/* Coach Insights */}
            {data.interviewCoach && data.interviewCoach.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold text-foreground mb-3">Key Expectation</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.interviewCoach[0]}
                </p>
              </div>
            )}

            {/* Practice Checklist */}
            {data.practiceChecklist && data.practiceChecklist.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-semibold text-foreground mb-3">Practice Checklist</p>
                <ul className="space-y-3">
                  {data.practiceChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <ChevronRight className="h-3.5 w-3.5 text-primary/70 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <button className="w-full mt-4 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors shadow-sm">
              Practice Mock Interview
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}

// ─── Component Helpers ────────────────────────────────────────────────────────

const SECTION_CONFIG: Record<string, { label: string; icon: string }> = {
  interviewer_expectation: { label: "Interviewer Expectation", icon: "🎯" },
  explanation:            { label: "Explanation",            icon: "📖" },
  core_concepts:          { label: "Core Concepts",          icon: "🧠" },
  important_points:       { label: "Important Points",       icon: "📌" },
  code_example:           { label: "Code Example",           icon: "💻" },
  real_world_example:     { label: "Real World Example",     icon: "🌍" },
  speakable_answer:       { label: "Speakable Answer",       icon: "🗣️" },
  common_mistakes:        { label: "Common Mistakes",        icon: "⚠️" },
  followup_questions:     { label: "Follow-up Questions",    icon: "❓" },
};

function AnswerSectionRenderer({ section }: { section: AnswerSection }) {
  const cfg = SECTION_CONFIG[section.sectionType.toLowerCase()] ?? { label: section.sectionType, icon: "" };
  
  if (section.sectionType === "interviewer_expectation" || section.sectionType === "practice_prompt") {
    return null; // Rendered in coach panel/sidebar
  }

  return (
    <section className="scroll-mt-24">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-4 flex items-center gap-3">
        {cfg.icon && <span className="opacity-80 text-[1.2em]">{cfg.icon}</span>}
        {cfg.label}
      </h2>
      <div className="text-[1.05rem] text-foreground/80 leading-[1.8] sm:leading-[1.9] whitespace-pre-wrap font-serif sm:font-sans">
        {section.content}
      </div>
    </section>
  );
}
