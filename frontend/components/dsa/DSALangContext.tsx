"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Languages we promise on the DSA hub: Java and Python.
 * Anything else in problem JSON is intentionally ignored.
 */
export type DSALang = "java" | "python";

const SUPPORTED: DSALang[] = ["java", "python"];
const STORAGE_KEY = "ie-dsa-lang";
const DEFAULT_LANG: DSALang = "java";

type Ctx = {
  lang: DSALang;
  setLang: (next: DSALang) => void;
  /** True once we've hydrated from localStorage (avoid SSR/CSR flicker). */
  hydrated: boolean;
};

const DSALangContext = createContext<Ctx | null>(null);

/**
 * Persists the user's chosen DSA code language across every /dsa/* page.
 * Wraps the entire DSA section via app/dsa/layout.tsx.
 */
export function DSALangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<DSALang>(DEFAULT_LANG);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && (SUPPORTED as string[]).includes(stored)) {
        setLangState(stored as DSALang);
      }
    } catch {
      // localStorage unavailable (private mode, SSR, etc.) — keep default.
    }
    setHydrated(true);
  }, []);

  const setLang = useCallback((next: DSALang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang, hydrated }), [lang, setLang, hydrated]);

  return (
    <DSALangContext.Provider value={value}>{children}</DSALangContext.Provider>
  );
}

/**
 * Read the current DSA language. Returns `null` when used outside the
 * provider — callers should fall back to their own state in that case so
 * the same component can be reused on non-DSA pages.
 */
export function useDSALang(): Ctx | null {
  return useContext(DSALangContext);
}

export function isDSALang(v: string): v is DSALang {
  return (SUPPORTED as string[]).includes(v);
}

export const DSA_SUPPORTED_LANGS = SUPPORTED;
