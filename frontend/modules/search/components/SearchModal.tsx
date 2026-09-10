'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, History, Sparkles, Terminal } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { SearchCategory } from './SearchCategory';
import { SearchItem } from './SearchItem';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  localData?: {
    bookmarks?: any[];
    achievements?: any[];
  };
}

export function SearchModal({ isOpen, onClose, localData }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();

  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();
  const { results, groupedResults, loading } = useSearch(query, localData);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested / popular actions when empty
  const suggestions = [
    { title: 'Explore Java Backend Path', href: '/domains?language=Java', type: 'domain' },
    { title: 'Explore Python Backend Path', href: '/domains?language=Python', type: 'domain' },
    { title: 'SQL & Database Stacks', href: '/domains?language=Java', type: 'topic' },
    { title: 'System Design Curriculum', href: '/prep/system-design', type: 'topic' },
  ];

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setActiveIdx(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle click outside & Esc key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Keyboard navigation for active results
  const itemsCount = results.length;
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen || itemsCount === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((prev) => (prev + 1) % itemsCount);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((prev) => (prev - 1 + itemsCount) % itemsCount);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = results[activeIdx];
        if (selected) {
          addRecentSearch(query);
          router.push(selected.href);
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleNavigation);
    return () => document.removeEventListener('keydown', handleNavigation);
  }, [isOpen, results, activeIdx, itemsCount, query, router, onClose, addRecentSearch]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4">
      <div 
        ref={modalRef}
        className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-scale"
        role="dialog"
        aria-modal="true"
        aria-label="Global Search Palette"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a query to search questions, paths..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-sm focus:outline-none border-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results Panel */}
        <div className="flex-1 max-h-[55vh] overflow-y-auto p-3 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-10 gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">Searching database...</span>
            </div>
          )}

          {/* Empty Query - Suggestions & Recents */}
          {!query && !loading && (
            <div className="space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 mb-1.5 select-none">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <History className="h-3 w-3" /> Recent Searches
                    </span>
                    <button 
                      onClick={clearRecentSearches}
                      className="text-[10px] font-semibold text-primary hover:text-primary/80"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => setQuery(search)}
                        className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-medium rounded-lg text-foreground hover:bg-hover transition-colors"
                      >
                        <History className="h-3.5 w-3.5 text-muted-foreground" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5 select-none">
                  <Sparkles className="h-3 w-3" /> Suggested Actions
                </span>
                <div className="space-y-1">
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => {
                        router.push(s.href);
                        onClose();
                      }}
                      className="flex items-center justify-between w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg text-foreground hover:bg-hover transition-colors"
                    >
                      <span className="truncate">{s.title}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground capitalize shrink-0">
                        {s.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results List */}
          {query && itemsCount > 0 && !loading && (
            <div className="space-y-4" role="listbox">
              {Object.entries(groupedResults).map(([category, list]) => (
                <SearchCategory key={category} title={category}>
                  {list.map((item) => {
                    // Find actual flat index
                    const flatIdx = results.findIndex((r) => r.id === item.id);
                    return (
                      <SearchItem
                        key={item.id}
                        item={item}
                        isActive={flatIdx === activeIdx}
                        onMouseEnter={() => setActiveIdx(flatIdx)}
                        onClick={onClose}
                      />
                    );
                  })}
                </SearchCategory>
              ))}
            </div>
          )}

          {/* No Results state */}
          {query && itemsCount === 0 && !loading && (
            <div className="text-center py-10 px-4">
              <p className="text-sm font-semibold text-foreground">No results found for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1.5">Try searching for generic topics like "Java", "OOP", or "Goroutines"</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 border-t border-border bg-muted flex items-center justify-between text-[11px] text-muted-foreground select-none">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-background border border-border text-foreground font-sans font-semibold">Esc</span> to close
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="px-1 py-0.5 rounded bg-background border border-border text-foreground font-sans font-semibold">↑↓</span> navigate
            </div>
            <div className="flex items-center gap-1">
              <span className="px-1 py-0.5 rounded bg-background border border-border text-foreground font-sans font-semibold font-sans">Enter</span> select
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
