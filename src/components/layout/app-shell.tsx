"use client";

import React, { useState } from "react";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Menu, X, Search } from "lucide-react";
import { useRouter } from "next/navigation";

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
      <header className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 px-4 py-3 flex items-center justify-between">
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

      {/* 2. MOBILE DRAWER MODAL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-card border-r border-border h-full overflow-hidden z-10 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
              <span className="font-mono text-xs font-bold text-foreground">Navigation Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SidebarNav onItemClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* 3. FULL-VIEWPORT DESKTOP LAYOUT (Fixed Sidebar at Left: 0px) */}
      <div className="w-full flex-1 flex relative">
        {/* Left Fixed Sidebar (Desktop lg+) */}
        <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 border-r border-border/50 bg-background z-40 overflow-hidden">
          <SidebarNav />
        </aside>

        {/* Main Content Area (Fluid with lg:pl-72) */}
        <div className="w-full lg:pl-72 flex-1 flex flex-col min-w-0">
          {/* Sticky Top Quick Search & Banner Bar */}
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/50 px-4 sm:px-8 lg:px-12 py-3 shadow-2xs">
            <div className="w-full max-w-7xl mx-auto flex items-center gap-4">
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="Search 90+ tutorials, formulas, functions (Press Enter)..."
                  value={topSearch}
                  onChange={(e) => setTopSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border/70 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-inner"
                />
              </form>
            </div>
          </div>

          {/* Inner Content Area */}
          <div className="w-full flex-1 px-4 sm:px-8 lg:px-12 py-6">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
              {/* Reserved Clean AdSense Leaderboard Slot */}
              <div
                id="sheethub-top-ad-slot"
                className="w-full min-h-[90px] rounded-xl border border-dashed border-border/60 bg-muted/10 p-3 flex flex-col items-center justify-center text-center transition-colors"
                aria-label="Advertisement Area"
              >
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-muted-foreground/40 mb-1">
                  Advertisement Area
                </span>
                <p className="text-[11px] font-mono text-muted-foreground/50">
                  Reserved Responsive Leaderboard Banner Slot
                </p>
              </div>

              {/* Dynamic Page Content */}
              <main id="main-content" className="w-full">{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
