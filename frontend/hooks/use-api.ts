\"use client\";

import { useCallback, useEffect, useState } from "react";
import {
  type Category,
  type CompleteAttemptRequest,
  type DashboardResponse,
  type DomainSummaryResponse,
  type PracticeSubtopicListResponse,
  type Question,
  type QuestionListResponse,
  type Role,
  type SearchResponse,
  type Subtopic,
  type TechStack,
  completeAttempt,
  getCategories,
  getDashboard,
  getDomainsSummary,
  getNavigationSubtopics,
  getPracticeSubtopics,
  getQuestion,
  getQuestionsForSubtopic,
  getRoles,
  getTechStacks,
  search as searchApi,
} from "@/lib/api";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

function useAsync<T>(fn: () => Promise<T> | null, deps: unknown[]): AsyncState<T> & { refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => {
    setReloadToken((t) => t + 1);
  }, []);

  useEffect(() => {
    const promise = fn();
    if (!promise) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    promise
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  return { data, loading, error, refetch };
}

export function useDomains() {
  return useAsync<DomainSummaryResponse>(() => getDomainsSummary(), []);
}

export function useDashboard() {
  return useAsync<DashboardResponse>(() => getDashboard(), []);
}

export function useRoles(domainId: string | null | undefined) {
  return useAsync<Role[]>(
    () => (domainId ? getRoles(domainId) : null),
    [domainId],
  );
}

export function useTechStacks(roleId: string | null | undefined) {
  return useAsync<TechStack[]>(
    () => (roleId ? getTechStacks(roleId) : null),
    [roleId],
  );
}

export function useCategories(techStackId: string | null | undefined) {
  return useAsync<Category[]>(
    () => (techStackId ? getCategories(techStackId) : null),
    [techStackId],
  );
}

export function useSubtopics(categoryId: string | null | undefined, mode: "navigation" | "practice" = "navigation") {
  return useAsync<Subtopic[] | PracticeSubtopicListResponse>(
    () => {
      if (!categoryId) return null;
      return mode === "navigation"
        ? getNavigationSubtopics(categoryId)
        : getPracticeSubtopics(categoryId);
    },
    [categoryId, mode],
  );
}

export function useQuestions(subtopicId: string | null | undefined) {
  return useAsync<QuestionListResponse>(
    () => (subtopicId ? getQuestionsForSubtopic(subtopicId) : null),
    [subtopicId],
  );
}

export function useQuestion(questionId: number | null | undefined) {
  return useAsync<Question>(
    () => (questionId != null ? getQuestion(questionId) : null),
    [questionId],
  );
}

export function useSubmitAttempt() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (payload: CompleteAttemptRequest) => {
    setSubmitting(true);
    setError(null);
    try {
      await completeAttempt(payload);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to submit attempt"));
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting, error };
}

export function useSearch() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<AsyncState<SearchResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const performSearch = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      setQuery(trimmed);

      if (trimmed.length < 3) {
        setState({ data: null, loading: false, error: null });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await searchApi(trimmed);
        setState({ data: result, loading: false, error: null });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err : new Error("Search failed"),
        });
      }
    },
    [],
  );

  return {
    query,
    setQuery,
    ...state,
    search: performSearch,
  };
}


