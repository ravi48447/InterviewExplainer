'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Compass, Bookmark, Award, Layers, ChevronRight } from 'lucide-react';
import { SearchItem as SearchItemType } from '../types/search.types';
import { cn } from '@/lib/utils';

interface SearchItemProps {
  item: SearchItemType;
  isActive: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

export function SearchItem({ item, isActive, onMouseEnter, onClick }: SearchItemProps) {
  const Icon = {
    question: BookOpen,
    domain: Compass,
    bookmark: Bookmark,
    achievement: Award,
    topic: Layers,
    roadmap: Compass,
    activity: BookOpen,
  }[item.type] || BookOpen;

  const difficultyColors: Record<string, string> = {
    easy: 'text-success bg-success/10 border-success/20',
    medium: 'text-warning bg-warning/10 border-warning/20',
    hard: 'text-destructive bg-destructive/10 border-destructive/20',
  };

  return (
    <Link
      href={item.href}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex items-center gap-3.5 px-4 py-3 rounded-lg border transition-all duration-150 outline-none text-left w-full",
        isActive 
          ? "bg-hover border-border text-foreground translate-x-1" 
          : "bg-transparent border-transparent text-muted-foreground hover:text-foreground"
      )}
      role="option"
      aria-selected={isActive}
    >
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center border transition-colors shrink-0",
        isActive ? "bg-background border-border text-primary" : "bg-card border-border text-muted-foreground"
      )}>
        <Icon className="h-4.5 w-4.5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate text-foreground">{item.title}</span>
          {item.difficulty && (
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize shrink-0",
              difficultyColors[item.difficulty.toLowerCase()] || "text-muted-foreground bg-muted border-border"
            )}>
              {item.difficulty}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
        )}
      </div>

      <ChevronRight className={cn(
        "h-4 w-4 shrink-0 transition-transform",
        isActive ? "text-primary translate-x-0.5" : "text-muted-foreground/30"
      )} />
    </Link>
  );
}
