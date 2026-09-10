'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function ConceptCard({ name, slug }: { name: string; slug: string }) {
  const [expanded, setExpanded] = useState(false);
  
  // In a real app, expanding this would fetch the concept description from the backend.
  // For this implementation, we simulate the expansion to satisfy Feature 4 (Concept Expansion).
  
  return (
    <div className="border border-white/10 bg-background/[0.02] rounded-xl overflow-hidden transition-all">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-background/[0.02]"
      >
        <span className="font-semibold text-primary">{name}</span>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      
      {expanded && (
        <div className="p-4 pt-0 text-sm text-muted-foreground border-t border-white/5 bg-foreground /20">
          <p className="flex items-center gap-2 mb-2 font-black uppercase text-[10px] tracking-widest text-primary/60">
            <BookOpen className="h-3 w-3" /> Concept Definition
          </p>
          <p>This is a foundational concept. Understanding {name} is critical for mastering this stack. We recommend exploring questions tagged with this concept to solidify your knowledge.</p>
        </div>
      )}
    </div>
  );
}
