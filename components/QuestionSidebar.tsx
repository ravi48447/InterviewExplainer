'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, FolderOpen } from 'lucide-react';

interface Question {
  id: string | number;
  title: string;
  slug: string;
  subcategorySlug?: string | null;
  subcategoryName?: string | null;
}

interface Stack {
  id: string;
  name: string;
  slug: string;
  questions: Question[];
}

interface QuestionSidebarProps {
  stackDataWithQuestions: Stack[];
  domainSlug: string;
  stackSlug: string;
  questionSlug: string;
}

function toDisplayName(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/** Group questions by subcategorySlug, preserving order */
function groupBySubcategory(questions: Question[]): Array<{
  slug: string;
  name: string;
  questions: Question[];
}> {
  const map = new Map<string, { slug: string; name: string; questions: Question[] }>();
  const order: string[] = [];

  for (const q of questions) {
    const key = q.subcategorySlug ?? '__none__';
    if (!map.has(key)) {
      map.set(key, {
        slug: key,
        name: key === '__none__' ? '' : (q.subcategoryName || toDisplayName(key)),
        questions: [],
      });
      order.push(key);
    }
    map.get(key)!.questions.push(q);
  }

  return order.map(k => map.get(k)!);
}

export default function QuestionSidebar({
  stackDataWithQuestions,
  domainSlug,
  stackSlug,
  questionSlug,
}: QuestionSidebarProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('question-sidebar-scroll');
    if (saved && navRef.current) {
      navRef.current.scrollTop = parseInt(saved, 10);
    }
  }, []);

  const handleScroll = () => {
    if (navRef.current) {
      sessionStorage.setItem('question-sidebar-scroll', navRef.current.scrollTop.toString());
    }
  };

  return (
    <nav
      ref={navRef}
      onScroll={handleScroll}
      className="flex flex-col space-y-2 bg-background/90 backdrop-blur-sm rounded-xl border border-border shadow-sm p-3 max-h-[calc(100vh-250px)] overflow-y-auto"
    >
      {stackDataWithQuestions.map(stack => {
        const isActive = stack.slug === stackSlug;
        const groups = groupBySubcategory(stack.questions);
        const hasSubcats = groups.length > 0 && !(groups.length === 1 && groups[0].slug === '__none__');

        return (
          <details key={stack.id} className="group" open={isActive}>
            <summary
              className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors list-none select-none mb-1 shadow-sm ${
                isActive
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-medium'
                  : 'text-muted-foreground hover:bg-surface font-semibold'
              }`}
            >
              <span className="text-[13px] truncate pr-2">{stack.name}</span>
              <span className="flex items-center gap-1 shrink-0">
                <span className="text-[11px] opacity-70">{stack.questions.length}</span>
                {isActive ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-open:rotate-90 transition-transform" />
                )}
              </span>
            </summary>

            <div className="flex flex-col space-y-0.5 mt-1 mb-2">
              {hasSubcats
                ? groups.map((group, gIdx) => (
                      <SubcategoryGroup
                        key={group.slug}
                        group={group}
                        groupIndex={gIdx}
                        domainSlug={domainSlug}
                        stackSlug={stack.slug}
                        questionSlug={questionSlug}
                        globalOffset={groups.slice(0, gIdx).reduce((s, g) => s + g.questions.length, 0)}
                      />
                    ))
                  : stack.questions.map((q, qIdx) => (
                      <QuestionLink
                        key={`${qIdx}-${q.slug}`}
                        q={q}
                        number={qIdx + 1}
                        domainSlug={domainSlug}
                        stackSlug={stack.slug}
                        questionSlug={questionSlug}
                      />
                    ))}
            </div>
          </details>
        );
      })}
    </nav>
  );
}

function SubcategoryGroup({
  group,
  groupIndex,
  domainSlug,
  stackSlug,
  questionSlug,
  globalOffset,
}: {
  group: { slug: string; name: string; questions: Question[] };
  groupIndex: number;
  domainSlug: string;
  stackSlug: string;
  questionSlug: string;
  globalOffset: number;
}) {
  const hasCurrentQuestion = group.questions.some(q => q.slug === questionSlug);

  return (
    <details open={hasCurrentQuestion} className="mb-1">
      <summary className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer list-none select-none hover:bg-surface transition-colors group/sub">
        <FolderOpen className="h-3.5 w-3.5 text-primary dark:text-primary shrink-0" />
        <span className="flex-1 text-[11px] font-bold text-muted-foreground group-open/sub:text-primary dark:text-primary truncate">
          {group.name}
        </span>
        <span className="text-[11px] text-muted-foreground font-medium shrink-0">
          {group.questions.length}
        </span>
      </summary>

      <div className="flex flex-col space-y-0.5 pl-3 mt-0.5">
        {group.questions.map((q, qIdx) => (
          <QuestionLink
            key={`${globalOffset + qIdx}-${q.slug}`}
            q={q}
            number={globalOffset + qIdx + 1}
            domainSlug={domainSlug}
            stackSlug={stackSlug}
            questionSlug={questionSlug}
          />
        ))}
      </div>
    </details>
  );
}

function QuestionLink({
  q,
  number,
  domainSlug,
  stackSlug,
  questionSlug,
}: {
  q: Question;
  number: number;
  domainSlug: string;
  stackSlug: string;
  questionSlug: string;
}) {
  const isCurrent = q.slug === questionSlug;

  return (
    <Link
      href={`/${domainSlug}/${stackSlug}/${q.slug}`}
      scroll={false}
      className={`flex items-start gap-2.5 py-1.5 pl-3 pr-3 text-[12px] leading-snug rounded-lg transition-all ${
        isCurrent
          ? 'text-foreground font-bold bg-primary/10 border-l-4 border-primary'
          : 'text-foreground hover:text-foreground hover:bg-surface outline-none focus:ring-2 focus:ring-ring'
      }`}
    >
      <span
        className={`text-[11px] font-bold min-w-[24px] h-[17px] rounded px-1.5 flex items-center justify-center shrink-0 mt-[2px] ${
          isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
        }`}
      >
        Q{number}
      </span>
      <span className="flex-1 line-clamp-2">{q.title}</span>
    </Link>
  );
}
