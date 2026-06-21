"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type ContentTheme = "dark" | "light";

interface ThemeContextValue {
  theme: ContentTheme;
  toggleTheme: () => void;
}

// Default fallback used when a theme-aware component renders WITHOUT a
// ContentThemeProvider ancestor. The site outside the question pages is
// light-themed, so the safe default is "light" — otherwise components like
// <MarkdownContent> paint dark-theme text (near-white) on light backgrounds,
// making it invisible. The question pages set their own provider (which
// defaults to "dark" + localStorage), so this fallback never affects them.
const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
});

export function ContentThemeProvider({
  children,
  forcedTheme,
}: {
  children: ReactNode;
  /**
   * When set, the theme is pinned to this value: localStorage is ignored and
   * `toggleTheme` is a no-op. Use this for surfaces that are designed for a
   * single theme (e.g. the light-only DSA pages) so that theme-aware children
   * like <MarkdownContent> render the correct palette instead of falling back
   * to the provider default ("dark").
   */
  forcedTheme?: ContentTheme;
}) {
  const [theme, setTheme] = useState<ContentTheme>(forcedTheme ?? "dark");

  useEffect(() => {
    if (forcedTheme) return;
    try {
      const saved = localStorage.getItem("ie-content-theme") as ContentTheme | null;
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, [forcedTheme]);

  const toggleTheme = () => {
    if (forcedTheme) return;
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("ie-content-theme", next);
      } catch {}
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme: forcedTheme ?? theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useContentTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
