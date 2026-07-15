"use client";

import { useThemeCtx } from "@/components/custom-theme-provider";
import { useMemo } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

export type ThemeMode = "light" | "dark" | "system";

const THEME_ORDER: ThemeMode[] = ["light", "dark", "system"];

/**
 * useThemeMode — centralized theme cycling and persistence logic.
 *
 * Consolidates all theme-related state and actions that were previously
 * duplicated across ThemeSwitcher, header.tsx, and ThemeProvider.
 */
export function useThemeMode() {
  const { theme, resolvedTheme, setTheme } = useThemeCtx();

  const currentMode = useMemo<ThemeMode>(() => {
    if (theme === "system") return "system";
    return resolvedTheme === "dark" ? "dark" : "light";
  }, [theme, resolvedTheme]);

  const nextMode = useMemo<ThemeMode>(() => {
    const idx = THEME_ORDER.indexOf(currentMode);
    return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
  }, [currentMode]);

  const applyTheme = (mode: ThemeMode) => {
    setTheme(mode);

    if (typeof window === "undefined") return;

    if (mode === "system") {
      localStorage.removeItem(STORAGE_KEYS.THEME_MANUAL_EXPIRE);
      return;
    }

    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      STORAGE_KEYS.THEME_MANUAL_EXPIRE,
      (Date.now() + oneWeek).toString(),
    );
  };

  const cycleTheme = () => {
    const run = () => applyTheme(nextMode);

    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.startViewTransition(() => run());
    } else {
      run();
    }
  };

  const tooltipLabel =
    nextMode === "dark"
      ? "Ganti ke Gelap"
      : nextMode === "light"
        ? "Ganti ke Terang"
        : "Ganti ke Sistem";

  return {
    currentMode,
    nextMode,
    cycleTheme,
    applyTheme,
    tooltipLabel,
    resolvedTheme: resolvedTheme ?? "light",
  } as const;
}
