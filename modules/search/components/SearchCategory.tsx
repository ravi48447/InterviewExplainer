'use client';

import React from 'react';

interface SearchCategoryProps {
  title: string;
  children: React.ReactNode;
}

export function SearchCategory({ title, children }: SearchCategoryProps) {
  return (
    <div className="space-y-1.5" role="group" aria-label={title}>
      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 select-none">
        {title}
      </h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
