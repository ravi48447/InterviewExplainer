'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { SearchModal } from './SearchModal';

interface GlobalSearchProps {
  localData?: {
    bookmarks?: any[];
    achievements?: any[];
  };
}

export function GlobalSearch({ localData }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  // Check user OS for shortcut helper text
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }
  }, []);

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Desktop Search Bar (400px - 700px) */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-3 w-full h-9 px-3 rounded-lg border border-default bg-surface hover:bg-hover transition-colors text-left text-muted-foreground select-none text-xs"
        aria-label="Search questions, paths (Press Ctrl+K to open)"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">Search questions, paths...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-default bg-card font-sans font-semibold text-[10px] text-muted-foreground select-none shrink-0">
          <span>{isMac ? '⌘' : 'Ctrl'}</span><span className="mx-0.5 opacity-60">+</span><span>K</span>
        </kbd>
      </button>

      {/* Mobile/Tablet Search Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-[#737373] hover:text-foreground hover:bg-hover transition-colors shrink-0"
        aria-label="Open Search Modal"
      >
        <Search className="h-4.5 w-4.5" />
      </button>

      {/* Search Command Modal */}
      <SearchModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        localData={localData} 
      />
    </>
  );
}
