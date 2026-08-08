'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import apiClient from '@/lib/api-client';

export default function ViewTracker({ questionId }: { questionId: number }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user && questionId) {
      apiClient.post(`/progress/question/${questionId}/view`)
        .catch(err => console.error("View tracking error:", err));
    }
  }, [questionId, user]);

  return null;
}
