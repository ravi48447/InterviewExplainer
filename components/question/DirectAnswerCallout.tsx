import { Zap } from "lucide-react";

interface DirectAnswerCalloutProps {
  directAnswer: string;
}

export function DirectAnswerCallout({ directAnswer }: DirectAnswerCalloutProps) {
  if (!directAnswer) return null;

  return (
    <div className="mb-10 rounded-xl bg-primary/5 border border-default dark:border-default/20 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-default dark:border-default/20 bg-primary/10">
        <Zap className="h-4 w-4 text-primary" />
        <h2 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Answer</h2>
      </div>
      <div className="px-5 py-4">
        <p className="text-[15px] leading-[1.8] text-foreground">{directAnswer}</p>
      </div>
    </div>
  );
}
