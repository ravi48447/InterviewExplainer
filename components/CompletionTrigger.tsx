'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import apiClient from '@/lib/api-client';

export default function CompletionTrigger({ questionId }: { questionId: number }) {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const [completed, setCompleted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (inView && !completed && user) {
      apiClient.post(`/progress/question/${questionId}/complete`)
        .then(() => setCompleted(true))
        .catch(err => console.error("Completion error:", err));
    }
  }, [inView, completed, questionId, user]);

  if (!completed) {
    return <div ref={ref} className="h-24 w-full" aria-hidden="true" />;
  }

  return (
    <div className="flex items-center justify-center p-6 my-10 bg-emerald-500 dark:bg-emerald-800/10 border border-default dark:border-default/50 dark:border-default/20 rounded-2xl text-white dark:text-emerald-300 gap-3 animate-in fade-in slide-in-from-bottom-4">
      <CheckCircle2 className="h-6 w-6" />
      <span className="font-bold tracking-wide">✔ You completed this question</span>
    </div>
  );
}
