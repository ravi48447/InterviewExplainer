'use client';

import { useState } from 'react';
import { QuestionSummary, fetchPeopleAlsoAsk } from '@/lib/api';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export default function PeopleAlsoAsk({ initialQuestions }: { initialQuestions: QuestionSummary[] }) {
  const [questions, setQuestions] = useState<QuestionSummary[]>(initialQuestions);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

  const toggleExpand = async (q: QuestionSummary) => {
    const isExpanded = expandedIds.has(q.id);
    
    // Toggle state
    const newExpanded = new Set(expandedIds);
    if (isExpanded) {
      newExpanded.delete(q.id);
      setExpandedIds(newExpanded);
      return;
    }
    
    newExpanded.add(q.id);
    setExpandedIds(newExpanded);

    // Fetch more questions to simulate the infinite expanding graph tree
    if (!loadingIds.has(q.id)) {
      setLoadingIds(prev => new Set(prev).add(q.id));
      try {
        const { questions: newQs } = await fetchPeopleAlsoAsk(q.id);
        
        // Add new questions below the clicked one, avoiding duplicates
        setQuestions(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewQs = newQs.filter(n => !existingIds.has(n.id));
          
          if (uniqueNewQs.length === 0) return prev;
          
          const index = prev.findIndex(p => p.id === q.id);
          const updated = [...prev];
          updated.splice(index + 1, 0, ...uniqueNewQs);
          return updated;
        });
      } catch (err) {
        console.error("Failed to fetch PAA", err);
      } finally {
        setLoadingIds(prev => {
          const next = new Set(prev);
          next.delete(q.id);
          return next;
        });
      }
    }
  };

  if (questions.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-black mb-6">People Also Ask</h2>
      <div className="border border-white/10 rounded-2xl divide-y divide-white/10 overflow-hidden bg-background/[0.02]">
        {questions.map((q) => {
          const isExpanded = expandedIds.has(q.id);
          const isLoading = loadingIds.has(q.id);

          return (
            <div key={q.id} className="group">
              <button 
                onClick={() => toggleExpand(q)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-background/[0.02] transition-colors"
              >
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{q.title}</span>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 text-sm text-muted-foreground bg-foreground dark:bg-background/20">
                  <p className="mb-4">This question explores concepts related to your current reading path. Click below to dive into the full answer.</p>
                  <Link 
                    href={`/${q.domainSlug || 'all'}/${q.stackSlug || 'global'}/${q.slug}`}
                    className="inline-block px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-xs"
                  >
                    Read Full Answer
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
