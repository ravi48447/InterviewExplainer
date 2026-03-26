'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import apiClient from '@/lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';

interface BookmarkButtonProps {
  questionId: number;
}

export default function BookmarkButton({ questionId }: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      apiClient.get(`/bookmarks/question/${questionId}/check`)
        .then(res => setIsBookmarked(res.data))
        .catch(err => console.error('Failed to check bookmark status:', err));
    }
  }, [user, questionId]);

  const toggleBookmark = async () => {
    if (!user) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        await apiClient.delete(`/bookmarks/question/${questionId}`);
        setIsBookmarked(false);
      } else {
        await apiClient.post(`/bookmarks/question/${questionId}`);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`p-3 rounded-2xl border transition-all flex items-center gap-2 group ${
        isBookmarked 
          ? "bg-rose-500/10 border-rose-500/30 text-rose-500" 
          : "bg-white/[0.02] border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
      }`}
      aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isBookmarked ? 'checked' : 'unchecked'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {isBookmarked ? <BookmarkCheck className="h-5 w-5 fill-current" /> : <Bookmark className="h-5 w-5" />}
        </motion.div>
      </AnimatePresence>
      <span className="text-sm font-bold">{isBookmarked ? "Saved" : "Save for Later"}</span>
    </button>
  );
}
