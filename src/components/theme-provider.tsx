"use client";

import * as React from "react";
import { ThemeProvider as CustomThemeProvider } from "@/components/custom-theme-provider";
import { STORAGE_KEYS } from "@/lib/constants";

export function ThemeProvider({ children }: { children: React.ReactNode; [key: string]: unknown }) {
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for manual theme override expiration
    const manualExpire = localStorage.getItem(STORAGE_KEYS.THEME_MANUAL_EXPIRE);
    if (manualExpire) {
      const expireTime = parseInt(manualExpire, 10);
      if (Date.now() > expireTime) {
        localStorage.removeItem(STORAGE_KEYS.THEME_MANUAL_EXPIRE);
        localStorage.setItem(STORAGE_KEYS.THEME, "system");
      }
    } else if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      localStorage.setItem(STORAGE_KEYS.THEME, "system");
    }
  }, []);

  return (
    <CustomThemeProvider>
      {children}
    </CustomThemeProvider>
  );
}
