import { MessageCircle } from "lucide-react";

interface FollowupQuestionsListProps {
  questions: string[];
}

export function FollowupQuestionsList({ questions }: FollowupQuestionsListProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-10 rounded-xl border border-indigo-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-indigo-600" />
          Follow-Up Questions You Might Face
        </h3>
      </div>
      <div className="px-5 py-4">
        <ul className="space-y-2">
          {questions.map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
              <span className="text-indigo-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
