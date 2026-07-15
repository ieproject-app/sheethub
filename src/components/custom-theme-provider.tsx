"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";
const MEDIA = "(prefers-color-scheme: dark)";

function getStored(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {}
  return "system";
}

function resolve(t: Theme): ResolvedTheme {
  if (t !== "system") return t;
  if (typeof window === "undefined") return "light";
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

function apply(t: Theme) {
  if (typeof document === "undefined") return;
  const r = resolve(t);
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(r);
  try { localStorage.setItem(STORAGE_KEY, t); } catch {}
}

export function ThemeProvider({ children }: { children: ReactNode; [key: string]: unknown }) {
  const [theme, setThemeState] = useState<Theme>(() => getStored());

  useEffect(() => {
    apply(theme);
  }, [theme]);

  // Listen for OS theme changes while in "system" mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(MEDIA);
    const handler = () => { if (theme === "system") apply("system"); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    apply(t);
  }, []);

  const value = useMemo(() => ({
    theme,
    resolvedTheme: resolve(theme),
    setTheme,
  }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <div style={{ display: "contents" }} suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useThemeCtx() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { theme: "system" as Theme, resolvedTheme: "light" as ResolvedTheme, setTheme: () => {} };
  return ctx;
}
