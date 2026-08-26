"use client";

import React, { useState } from "react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AdSenseSlot } from "@/components/ads/adsense-slot";
import { Menu, X, Search, Sparkles, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topSearch, setTopSearch] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topSearch.trim()) {
      router.push(`/blog?q=${encodeURIComponent(topSearch.trim())}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      {/* 1. MOBILE TOP BAR */}
      <header className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 h-14 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/80 bg-card text-xs font-mono text-foreground font-medium hover:bg-muted transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Documentation Menu</span>
        </button>
        <span className="text-xs font-mono font-bold text-muted-foreground">SheetHub Docs</span>
      </header>

      {/* 2. MOBILE DRAWER MODAL (With Smooth Slide & Fade Transitions) */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden flex transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Sliding Panel */}
        <div
          className={cn(
            "relative w-4/5 max-w-xs bg-card border-r border-border h-full overflow-hidden z-10 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-border/60 bg-muted/20">
            <span className="font-mono text-xs font-bold text-foreground">Navigation Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Close Navigation Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <SidebarNav onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      </div>

      {/* 3. FULL-VIEWPORT DESKTOP LAYOUT (Fixed Sidebar at Left: 0px) */}
      <div className="w-full flex-1 flex relative">
        {/* Left Fixed Sidebar (Desktop lg+) */}
        <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-80 border-r border-border/50 bg-background z-40 overflow-hidden isolate overscroll-contain">
          <SidebarNav />
        </aside>

        {/* Main Content Area (Fluid with lg:pl-80) */}
        <div className="w-full lg:pl-80 flex-1 flex flex-col min-w-0">
          {/* Sticky Top Symmetrical Search & Bar (Precision 64px / h-16) */}
          <div className="sticky top-0 z-30 h-16 bg-background/90 backdrop-blur-md border-b border-border/50 px-4 sm:px-8 lg:px-12 flex items-center shadow-2xs">
            <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Modern 2026-Style Quick Search Command Bar */}
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-2xl group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground/60 group-focus-within:text-emerald-500 transition-colors" />
                </div>

                <input
                  type="text"
                  placeholder="Search 90+ spreadsheet tutorials, formulas, functions..."
                  value={topSearch}
                  onChange={(e) => setTopSearch(e.target.value)}
                  className="w-full pl-10 pr-24 py-2 rounded-xl bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border/60 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                />

                {/* Modern Keyboard / Action Badge */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground/70 bg-background border border-border/70 rounded shadow-2xs">
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                  </kbd>
                  <span className="hidden sm:inline text-muted-foreground/30">•</span>
                  <span className="text-[10px] font-mono text-muted-foreground/50 hidden md:inline">
                    Enter ↵
                  </span>
                </div>
              </form>

              {/* Right Side Pill Badges / Fast Context */}
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Docs 2026</span>
                </span>
              </div>
            </div>
          </div>

          {/* Inner Content Area */}
          <div className="w-full flex-1 px-4 sm:px-8 lg:px-12 py-6">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
              {/* Top Leaderboard AdSense Slot (Localhost Dev Preview Only) */}
              <AdSenseSlot
                id="sheethub-top-ad-slot"
                slotType="top-leaderboard"
                label="Top Banner Placement"
              />

              {/* Dynamic Page Content */}
              <main id="main-content" className="w-full">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
