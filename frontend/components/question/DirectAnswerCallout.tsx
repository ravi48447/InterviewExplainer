import { Zap } from "lucide-react";

interface DirectAnswerCalloutProps {
  directAnswer: string;
}

export function DirectAnswerCallout({ directAnswer }: DirectAnswerCalloutProps) {
  if (!directAnswer) return null;

  return (
    <div className="mb-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-blue-200 bg-blue-100/50">
        <Zap className="h-4 w-4 text-blue-600" />
        <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Quick Answer</h2>
      </div>
      <div className="px-5 py-4">
        <p className="text-[15px] leading-[1.8] text-slate-700">{directAnswer}</p>
      </div>
    </div>
  );
}
