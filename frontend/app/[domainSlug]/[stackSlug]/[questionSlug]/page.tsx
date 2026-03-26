import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPagePayload, fetchCategoriesForDomain, fetchQuestionsForStack, QuestionPagePayload, AnswerSection, DomainCategory } from "@/lib/api";
import { 
  ChevronRight, ChevronDown, Smile, Folder, Star, Clock, 
  Copy, CheckCircle, PlayCircle, Check, ArrowRight 
} from "lucide-react";

import ReadingProgressBar from "@/components/ReadingProgressBar";
import CompletionTrigger from "@/components/CompletionTrigger";
import PeopleAlsoAsk from "@/components/PeopleAlsoAsk";
import ViewTracker from "@/components/ViewTracker";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domainSlug: string; stackSlug: string; questionSlug: string }>;
}): Promise<Metadata> {
  const { questionSlug } = await params;
  try {
    const data = await fetchPagePayload(questionSlug);
    return {
      title: data.metaTitle ?? data.title,
      description: data.metaDescription ?? undefined,
    };
  } catch {
    return { title: "Question Not Found" };
  }
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ domainSlug: string; stackSlug: string; questionSlug: string }>;
}) {
  const { domainSlug, stackSlug, questionSlug } = await params;
  let data: QuestionPagePayload;
  let categories: DomainCategory[] = [];

  try {
    const [pageData, cats] = await Promise.all([
      fetchPagePayload(questionSlug),
      fetchCategoriesForDomain(domainSlug).catch(() => [])
    ]);
    data = pageData;
    categories = cats;
  } catch {
    notFound();
  }

  const allStacks = categories.flatMap(c => c.stacks);
  
  // Concurrently fetch questions for every stack to populate the dropdowns natively
  const stackQuestionsArray = await Promise.all(
    allStacks.map(s => fetchQuestionsForStack(s.slug).catch(() => []))
  );

  const stackDataWithQuestions = allStacks.map((stack, idx) => ({
    ...stack,
    questions: stackQuestionsArray[idx]
  }));

  const totalDomainQuestions = stackDataWithQuestions.reduce((sum, s) => sum + s.questions.length, 0) || 1;
  const currentIndex = data.quickQuestions?.findIndex((q) => q.slug === questionSlug) ?? 0;
  
  let globalCompleted = 0;
  let foundCurrent = false;
  for (const s of stackDataWithQuestions) {
    if (foundCurrent) break;
    for (const q of s.questions) {
      if (q.slug === questionSlug) {
         foundCurrent = true;
      }
      if (!foundCurrent) {
        globalCompleted++;
      }
    }
  }
  const completedCount = globalCompleted + 1;
  const progressPercent = Math.round((completedCount / totalDomainQuestions) * 100);

  // Group sections by type for precise layout mapping
  const sections = data.answerSections || [];
  const expectationSection = sections.find(s => s.sectionType === "interviewer_expectation");
  const coreConceptsSection = sections.find(s => s.sectionType === "core_concepts");
  const importantPointsSection = sections.find(s => s.sectionType === "important_points");
  const speakableAnswerSection = sections.find(s => s.sectionType === "speakable_answer");
  const followUpSection = sections.find(s => s.sectionType === "followup_questions");
  
  // Exclude fully mapped structural ones so we can stream the rest
  const structurallyMapped = ["interviewer_expectation", "core_concepts", "important_points", "speakable_answer", "practice_prompt", "followup_questions"];
  const flowingSections = sections.filter(s => !structurallyMapped.includes(s.sectionType))
                                  .sort((a, b) => a.sectionOrder - b.sectionOrder);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-800 selection:bg-blue-200">
      <ReadingProgressBar />
      <ViewTracker questionId={data.id} />

      <div className="flex max-w-[1300px] mx-auto bg-white min-h-screen shadow-sm border-x border-slate-100">

        {/* ── LEFT NAV SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-[260px] min-w-[260px] border-r border-slate-100 sticky top-0 h-screen overflow-y-auto py-6 shrink-0 bg-white">
          
          <div className="px-5 pb-4 border-b border-slate-100">
            <div className="flex justify-between items-baseline mb-2">
              <h2 className="text-[15px] font-bold text-slate-800">{data.domainSlug ? data.domainSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Domain'}</h2>
              <span className="text-[11px] text-slate-500 font-medium">{completedCount} / {totalDomainQuestions} done</span>
            </div>
            <div className="h-[4px] w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <nav className="flex flex-col pt-4 flex-1 px-3 space-y-1">
            
            {stackDataWithQuestions.map(stack => {
              const isActive = stack.slug === stackSlug;

              return (
                <details 
                  key={stack.id} 
                  className="group"
                  open={isActive}
                >
                  <summary className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors list-none select-none mb-1 shadow-sm ${
                    isActive 
                      ? "bg-[#2e64e5] text-white hover:bg-blue-700 font-medium" 
                      : "text-slate-600 hover:bg-slate-50 font-semibold"
                  }`}>
                    <span className="text-[13px] truncate pr-2">{stack.name}</span>
                    {isActive ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                    )}
                  </summary>
                  
                  <div className="flex flex-col space-y-0.5 mt-1 mb-2">
                    {stack.questions.map((q) => {
                      const isCurrent = q.slug === questionSlug;
                      
                      // For domain context, we check if it falls before the current question in the flattened logic
                      let isPast = false;
                      let scanFound = false;
                      for (const s of stackDataWithQuestions) {
                        if (scanFound) break;
                        for (const gq of s.questions) {
                          if (gq.slug === questionSlug) { scanFound = true; break; }
                          if (gq.slug === q.slug) isPast = true;
                        }
                      }
                      
                      return (
                        <Link
                          key={q.id}
                          href={`/${domainSlug}/${stack.slug}/${q.slug}`}
                          className={`flex items-start gap-2.5 py-1.5 pl-5 pr-2 text-[12px] leading-snug rounded-md transition-all ${
                            isCurrent 
                              ? "text-slate-900 font-semibold bg-slate-50" 
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 outline-none focus:ring-1 focus:ring-slate-200"
                          }`}
                        >
                          <span className="mt-[2px] shrink-0">
                            {isPast ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : isCurrent ? (
                              <div className="h-3.5 w-3.5 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              </div>
                            ) : (
                              <div className="h-3.5 w-3.5 flex items-center justify-center">
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                              </div>
                            )}
                          </span>
                          <span>{q.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </details>
              );
            })}

            {/* Fallback rendering if no stacks found from API (e.g. testing context) */}
            {allStacks.length === 0 && data.stackName && (
               <details open className="group mb-1">
                 <summary className="bg-[#2e64e5] text-white rounded-md px-3 py-2 flex items-center justify-between font-medium text-[13px] mb-1.5 shadow-sm list-none cursor-pointer">
                   <span className="truncate pr-2">{data.stackName}</span>
                   <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                 </summary>
                 <div className="flex flex-col space-y-0.5">
                   {data.quickQuestions?.map((q) => {
                      const isCurrent = q.slug === questionSlug;
                      // Fallback logic
                      const idx = data.quickQuestions.findIndex(x => x.slug === q.slug);
                      const currentIdx = data.quickQuestions.findIndex(x => x.slug === questionSlug);
                      const isPast = idx < currentIdx;
                      return (
                        <Link
                          key={q.id}
                          href={`/${domainSlug}/${stackSlug}/${q.slug}`}
                          className={`flex items-start gap-2.5 py-1.5 pl-5 pr-2 text-[12px] leading-snug rounded-md transition-all ${
                            isCurrent 
                              ? "text-slate-900 font-semibold bg-slate-50" 
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          <span className="mt-[2px] shrink-0">
                            {isPast ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <div className="h-3.5 w-3.5 flex items-center justify-center"><div className="h-1.5 w-1.5 rounded-full bg-slate-400" /></div>}
                          </span>
                          <span>{q.title}</span>
                        </Link>
                      );
                    })}
                 </div>
               </details>
            )}
          </nav>
        </aside>

        {/* ── MAIN READING COLUMN ── */}
        <main className="flex-1 min-w-0 px-6 sm:px-10 py-8 w-full max-w-[740px]">
          <article className="pb-16 max-w-[660px]">
            
            {/* Title Header */}
            <header className="mb-4">
              <h1 className="text-[1.6rem] font-bold tracking-tight text-slate-900 mb-1.5">
                {data.title}
              </h1>
              <div className="flex items-center text-[12px] text-slate-500 gap-1.5 mb-2.5">
                <span>Core Java</span>
                <ChevronRight className="h-3 w-3 opacity-50" />
                <span>{data.stackName}</span>
              </div>
              <p className="text-[13px] text-slate-600 italic">
                Asked in almost every Java interview
              </p>
            </header>

            {/* "What the Interviewer Wants to Hear" */}
            {(expectationSection || data.interviewCoach?.length > 0) && (
              <div className="mb-5 rounded-[8px] border border-slate-200 bg-[#f8f9fa] px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <h3 className="text-[13px] font-bold text-slate-800 mb-2.5 flex items-center gap-2">
                  <Smile className="h-4 w-4 text-amber-500 fill-amber-100" />
                  What the Interviewer Wants to Hear
                </h3>
                <div className="text-[13px] leading-[1.6] text-slate-700">
                  {expectationSection ? (
                    <ul className="list-disc pl-4 space-y-1 marker:text-slate-400">
                      {expectationSection.content.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-1">{line.replace(/^[-\*]\s*/, '')}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1 marker:text-slate-400">
                      <li className="pl-1">{data.interviewCoach?.[0]}</li>
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Top Explanations (Short / Detailed) - Placed BEFORE Speakable Answer */}
            {(() => {
              const explanationTypes = ['explanation', 'short_summary', 'detailed_explanation'];
              const topExps = flowingSections.filter(s => explanationTypes.includes(s.sectionType));
              if (topExps.length === 0) return null;
              
              return (
                <div className="mb-8 space-y-6">
                  {topExps.map(section => (
                    <div key={section.id} className="text-[14.5px] leading-[1.8] text-slate-800 font-serif bg-slate-50/70 border border-slate-100 px-6 py-5 rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                      <h3 className="text-[15px] font-bold capitalize text-slate-900 mb-2 font-sans tracking-tight">
                        {section.sectionType.replace(/_/g, ' ')}
                      </h3>
                      <div className="whitespace-pre-wrap text-slate-800">{section.content}</div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Core Concepts */}
            {coreConceptsSection && (
              <div className="mb-8">
                <h3 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Folder className="h-5 w-5 text-[#2e64e5]" />
                  Core Concepts
                </h3>
                <div className="text-[14.5px] leading-[1.8] text-slate-700 bg-slate-50/50 px-5 py-4 rounded-[12px] border border-slate-100">
                  <ol className="list-decimal pl-5 space-y-3 marker:text-[#2e64e5] marker:font-bold">
                    {coreConceptsSection.content.split('\n').filter(Boolean).map((line, i) => {
                      const cleanLine = line.replace(/^\d+\.\s*/, '');
                      const parts = cleanLine.split(' - ');
                      if(parts.length > 1) {
                         return (
                           <li key={i} className="pl-2">
                             <span className="font-semibold text-slate-900">{parts[0]}</span> <span className="text-slate-400 mx-1">–</span> {parts.slice(1).join(' - ')}
                           </li>
                         );
                      }
                      return <li key={i} className="pl-2">{cleanLine}</li>;
                    })}
                  </ol>
                </div>
              </div>
            )}

            {/* Split Grid: Important Points & Speakable Answer (High Priority) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 items-stretch">
              
              {/* Important Points - Left Box */}
              {importantPointsSection && (
                <div className="rounded-[12px] border border-slate-200 bg-white px-5 py-5 shadow-sm h-full flex flex-col">
                  <h3 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    Important Points
                  </h3>
                  <ul className="list-disc pl-4 space-y-2.5 text-[13.5px] leading-[1.65] text-slate-700 marker:text-slate-300">
                    {importantPointsSection.content.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="pl-2">{line.replace(/^[-\*]\s*/, '')}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Speakable Answer - Right Box (Highlighted) */}
              {speakableAnswerSection && (
                <div className="rounded-[12px] border border-amber-200 bg-[#fffbeb] px-5 py-5 shadow-sm h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100 to-transparent rounded-bl-3xl opacity-50" />
                  
                  <h3 className="text-[13px] font-bold text-slate-800 mb-4 flex items-center gap-2 relative z-10">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    Speakable Answer ({data.estimatedReadTime || 2}-{Math.min((data.estimatedReadTime || 2) + 1, 5)} mins)
                  </h3>
                  
                  <div className="flex items-center gap-2.5 mb-5 relative z-10">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 hover:border-amber-400 rounded-md text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors shadow-sm">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 hover:border-amber-400 rounded-md text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors shadow-sm">
                      <CheckCircle className="h-3.5 w-3.5" /> Mark Practiced
                    </button>
                  </div>

                  <div className="text-[13.5px] leading-[1.75] text-slate-800 font-medium flex-1 relative z-10">
                    {speakableAnswerSection.content}
                  </div>
                </div>
              )}
            </div>

            {/* Flowing Secondary Sections (Mini-Blog formatting with soft distinct backgrounds) */}
            <div className="space-y-6 mb-8 border-t border-slate-100 pt-8">
              {flowingSections.filter(s => !['explanation', 'short_summary', 'detailed_explanation'].includes(s.sectionType)).map(section => {
                const titleMatch = section.sectionType.replace(/_/g, ' ');

                // 1. Code examples get Mac-style dark blocks
                if (section.sectionType.includes('code')) {
                  return (
                    <div key={section.id} className="mb-8">
                      <h3 className="text-[15px] font-bold capitalize text-slate-900 mb-3">{titleMatch}</h3>
                      <div className="rounded-[12px] bg-[#1e1e1e] border border-slate-800 overflow-hidden shadow-xl ring-1 ring-white/10">
                        {/* Mac Toolbar */}
                        <div className="bg-[#2d2d2d] px-4 py-2.5 flex items-center gap-2 border-b border-white/5">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                          <span className="text-slate-400 text-[10px] font-mono ml-2 font-bold tracking-wider uppercase">Snippet</span>
                        </div>
                        <pre className="text-[#e2e8f0] p-5 overflow-auto text-[13px] leading-[1.65] font-mono whitespace-pre-wrap bg-transparent">
                          {section.content}
                        </pre>
                      </div>
                    </div>
                  );
                }

                // 2. Mistake / Warning blocks get light red tint
                if (section.sectionType.includes('mistake')) {
                   return (
                     <div key={section.id} className="bg-rose-50/50 border border-rose-100 p-5 rounded-[12px]">
                       <h3 className="text-[15px] font-bold capitalize text-rose-900 mb-3">{titleMatch}</h3>
                       <div className="text-[14px] leading-[1.75] text-rose-800/90 whitespace-pre-wrap">
                         {section.content}
                       </div>
                     </div>
                   );
                }

                // 3. Lists get styling natively, standard soft background for distinction
                const isListLike = section.content.includes('•') || section.content.match(/^[-\*]\s/m);
                return (
                  <div key={section.id} className="bg-[#f8f9fa] border border-slate-100 p-5 rounded-[12px]">
                    <h3 className="text-[15px] font-bold capitalize text-slate-900 mb-3 tracking-tight">{titleMatch}</h3>
                    {isListLike ? (
                      <div className="text-[14px] leading-[1.75] text-slate-700 italic">
                        <ul className="list-disc pl-4 space-y-2 marker:text-slate-400">
                          {section.content.split('\n').filter(Boolean).map((line, i) => (
                            <li key={i}>{line.replace(/^[-\*•]\s*/, '')}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-[14.5px] leading-[1.8] font-serif text-slate-800 whitespace-pre-wrap">
                        {section.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Seamless Bottom Content (Follow-ups) */}
            {followUpSection && (
              <div className="mt-16 pt-8 border-t border-slate-100">
                <h3 className="text-[16px] font-bold text-slate-900 mb-3 tracking-tight">
                  Follow-Up Questions
                </h3>
                <div className="text-[14.5px] leading-[1.8] text-slate-800 font-serif whitespace-pre-wrap">
                  {followUpSection.content}
                </div>
              </div>
            )}

            {/* Constant Related Questions (People Also Ask mapped elegantly to text links) */}
            {data.peopleAlsoAsk?.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-100">
                <h3 className="text-[16px] font-bold text-slate-900 mb-4 tracking-tight">
                  Related Questions
                </h3>
                <ul className="space-y-3">
                  {data.peopleAlsoAsk.map(paa => (
                    <li key={paa.id}>
                      <Link href={`/${domainSlug}/${paa.stackSlug || stackSlug}/${paa.slug}`} className="text-[14.5px] font-medium text-[#2e64e5] hover:text-blue-700 hover:underline flex items-center gap-2 group">
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2e64e5] transition-colors" />
                        {paa.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Immersive Mock Interview CTA (Horizontal, compact design) */}
            <div className="mt-12 bg-[#2e64e5]/[0.03] p-6 rounded-[16px] border border-[#2e64e5]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900 mb-1">Ready to test your knowledge?</h3>
                <p className="text-[13.5px] text-slate-600 max-w-sm leading-[1.6]">Take a completely free mock interview designed specifically around <strong>{data.title}</strong> and its core concepts.</p>
              </div>
              <button className="bg-[#2e64e5] hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-[8px] text-[13.5px] shadow-[0_2px_8px_-2px_rgba(46,100,229,0.4)] transition-all whitespace-nowrap outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center gap-2 shrink-0">
                Start Mock Interview <PlayCircle className="h-4 w-4" />
              </button>
            </div>
            
            <CompletionTrigger questionId={data.id} />

            {/* Structural Pagination Navigation (Previous / Next) */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-4">
              {data.previousQuestion ? (
                <Link href={`/${domainSlug}/${data.previousQuestion.stackSlug || stackSlug}/${data.previousQuestion.slug}`} className="group flex flex-col justify-center rounded-[12px] border border-slate-200 bg-white p-5 hover:border-[#2e64e5] hover:shadow-sm transition-all text-left">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-[#2e64e5] transition-colors flex items-center gap-1.5"><ArrowRight className="h-3 w-3 rotate-180" /> Previous</span>
                  <span className="text-[14.5px] font-bold text-slate-800 line-clamp-2 leading-[1.4]">{data.previousQuestion.title}</span>
                </Link>
              ) : <div />}

              {data.nextQuestion ? (
                <Link href={`/${domainSlug}/${data.nextQuestion.stackSlug || stackSlug}/${data.nextQuestion.slug}`} className="group flex flex-col justify-center rounded-[12px] border border-slate-200 bg-white p-5 hover:border-[#2e64e5] hover:shadow-sm transition-all text-right items-end">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-[#2e64e5] transition-colors flex items-center gap-1.5">Next <ArrowRight className="h-3 w-3" /></span>
                  <span className="text-[14.5px] font-bold text-slate-800 line-clamp-2 leading-[1.4]">{data.nextQuestion.title}</span>
                </Link>
              ) : <div />}
            </div>

          </article>
        </main>

        {/* ── RIGHT PANEL (Structured Cards) ── */}
        <aside className="hidden xl:flex w-[280px] shrink-0 flex-col gap-4 sticky top-24 pt-10 pr-6">
          
          {/* Card 1: Interview Coach */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Smile className="h-4 w-4 text-amber-500 fill-amber-100" />
              Interview Coach
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-semibold text-slate-700">Answer Goal</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
              <ul className="space-y-1.5 text-[12px] text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-amber-500" /> Clear explanation
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-amber-500" /> One design preference
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-amber-500" /> One real-world impact
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Practice Checklist */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-3">
              Practice Checklist
            </h3>
            <ul className="space-y-2.5 text-[12px] text-slate-600">
              <li className="flex items-center gap-2">
                <PlayCircle className="h-3.5 w-3.5 text-[#2e64e5]" /> Can explain without reading
              </li>
              <li className="flex items-center gap-2">
                <PlayCircle className="h-3.5 w-3.5 text-[#2e64e5]" /> Can give one example
              </li>
              <li className="flex items-center gap-2">
                <PlayCircle className="h-3.5 w-3.5 text-[#2e64e5]" /> Answer 1 completely
              </li>
            </ul>
          </div>

          {/* Card 3: Time Target */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-800 mb-2">
              Time Target
            </h3>
            <div className="flex items-center gap-2 text-[13px] text-slate-600">
              <Clock className="h-4 w-4 text-slate-400" />
              {data.estimatedReadTime || 2}-{Math.min((data.estimatedReadTime || 2) + 1, 5)} minutes
            </div>
          </div>

          {/* Card 4: Next Best Question */}
          {data.nextQuestion && (
             <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
               <div className="flex items-center justify-between mb-3">
                 <h3 className="text-[13px] font-bold text-slate-800">
                   Next Best Question
                 </h3>
                 <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
               </div>
               <Link 
                 href={`/${domainSlug}/${stackSlug}/${data.nextQuestion.slug}`}
                 className="flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-[#2e64e5] transition-colors"
               >
                 <ArrowRight className="h-3 w-3" /> {data.nextQuestion.title}
               </Link>
             </div>
          )}

        </aside>

      </div>
    </div>
  );
}
