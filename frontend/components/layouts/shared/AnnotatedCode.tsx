"use client";
import MarkdownContent from "@/components/MarkdownContent";

export interface CodeCallout {
  number: number;
  explanation: string;
}

interface AnnotatedCodeProps {
  code: string;
  callouts: CodeCallout[];
}

export function AnnotatedCode({ code, callouts }: AnnotatedCodeProps) {
  return (
    <div className="space-y-4">
      <MarkdownContent content={code} />
      {callouts.length > 0 && (
        <div className="space-y-2">
          {callouts.map(c => (
            <div key={c.number} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-primary-foreground dark:text-foreground text-[11px] font-bold flex items-center justify-center mt-0.5">
                {c.number}
              </span>
              <span className="text-secondary">{c.explanation}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
