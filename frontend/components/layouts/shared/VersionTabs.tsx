"use client";
import { useState } from "react";
import MarkdownContent from "@/components/MarkdownContent";

export type JavaVersion = "java8" | "java11" | "java17" | "java21";

interface VersionTabsProps {
  versions: Partial<Record<JavaVersion, string>>;
}

const VERSION_LABELS: Record<JavaVersion, string> = {
  java8:  "Java 8",
  java11: "Java 11",
  java17: "Java 17",
  java21: "Java 21",
};

export function VersionTabs({ versions }: VersionTabsProps) {
  const available = (Object.keys(versions) as JavaVersion[]).filter(k => versions[k]);
  const [active, setActive] = useState<JavaVersion>(available[0]);

  if (available.length === 0) return null;
  if (available.length === 1) {
    return <MarkdownContent content={versions[available[0]]!} />;
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-200 bg-slate-50">
        {available.map(v => (
          <button
            key={v}
            onClick={() => setActive(v)}
            className={`px-4 py-2 text-xs font-semibold transition-colors ${
              active === v
                ? "bg-white text-blue-700 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {VERSION_LABELS[v]}
          </button>
        ))}
      </div>
      <div className="p-4">
        <MarkdownContent content={versions[active]!} />
      </div>
    </div>
  );
}
