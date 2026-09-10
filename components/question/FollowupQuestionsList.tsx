import { MessageCircle } from "lucide-react";

interface FollowupQuestionsListProps {
  questions: string[];
}

export function FollowupQuestionsList({ questions }: FollowupQuestionsListProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-10 rounded-xl border border-default bg-card shadow-sm overflow-hidden" aria-live="polite">
      <div className="px-5 py-3 bg-muted/30 border-b border-default">
        <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          Follow-Up Questions You Might Face
        </h3>
      </div>
      <div className="px-5 py-4">
        <ul className="space-y-2">
          {questions.map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground leading-relaxed">
              <span className="text-primary font-bold shrink-0 mt-0.5">{i + 1}.</span>
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
