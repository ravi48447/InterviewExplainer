"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useTheme } from "next-themes";

export type ContentTheme = "dark" | "light";

interface ThemeContextValue {
  theme: ContentTheme;
  toggleTheme: () => void;
}

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
   * When set, the theme is pinned to this value.
   */
  forcedTheme?: ContentTheme;
}) {
  const { theme, systemTheme, setTheme } = useTheme();

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const currentTheme = (forcedTheme ?? resolvedTheme ?? "light") as ContentTheme;

  const toggleTheme = () => {
    if (forcedTheme) return;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useContentTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
