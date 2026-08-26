"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SheetHubLogo } from "@/components/icons/sheethub-logo";
import { useThemeMode } from "@/hooks/use-theme-mode";
import { useReadArticles } from "@/hooks/use-read-articles";
import {
  Sun,
  Moon,
  SunMoon,
  BookOpen,
  Compass,
  Hash,
  Check,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const DOCS_NAV: NavSection[] = [
  {
    title: "Learning Roadmap",
    items: [
      { name: "Start Here (Onboarding)", href: "/", icon: Compass },
      { name: "All 90+ Tutorials", href: "/blog", icon: BookOpen },
    ],
  },
  {
    title: "Module 1: Fundamentals",
    items: [
      { name: "Cell References & Logic", href: "/blog/data-validation-dropdown-guide" },
      { name: "Date & Time Functions", href: "/blog/excel-date-time-functions-guide" },
      { name: "Custom Number Formats", href: "/blog/excel-custom-number-formats-guide" },
      { name: "Data Cleaning Techniques", href: "/blog/excel-data-cleaning-techniques-guide" },
    ],
  },
  {
    title: "Module 2: Essential Lookups",
    items: [
      { name: "XLOOKUP Complete Guide", href: "/blog/xlookup-complete-guide", badge: "Core" },
      { name: "COUNTIF & COUNTIFS Guide", href: "/blog/countif-countifs-guide" },
      { name: "Conditional Formatting", href: "/blog/conditional-formatting-guide" },
      { name: "Dependent Dropdown Lists", href: "/blog/excel-dependent-dropdown-guide" },
    ],
  },
  {
    title: "Module 3: Dynamic Arrays",
    items: [
      { name: "Excel Dynamic Arrays", href: "/blog/excel-dynamic-array-functions-guide", badge: "Must Know" },
      { name: "Sheets ARRAYFORMULA", href: "/blog/arrayformula-google-sheets-complete-guide" },
    ],
  },
  {
    title: "Module 4: Copilot & AI",
    items: [
      { name: "Excel Copilot Agent Mode", href: "/blog/excel-agent-mode-copilot-guide", badge: "AI" },
      { name: "AI Formulas Prompt Guide", href: "/blog/ai-excel-formulas-prompt-guide" },
      { name: "Formula Completion with AI", href: "/blog/excel-formula-completion-copilot-guide" },
    ],
  },
  {
    title: "Module 5: Debugging",
    items: [
      { name: "Evaluate Formula & Debug", href: "/blog/excel-evaluate-formula-debugging-guide" },
      { name: "Fix #CALC! Array Errors", href: "/blog/excel-calc-error-dynamic-array-guide" },
      { name: "Floating-Point Math Errors", href: "/blog/excel-floating-point-errors-guide" },
      { name: "Performance Diagnostics", href: "/blog/excel-check-performance-guide" },
    ],
  },
  {
    title: "Taxonomy",
    items: [
      { name: "Categories", href: "/category", icon: Hash },
      { name: "Topics Index", href: "/tags", icon: Hash },
    ],
  },
];

export function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const { currentMode, cycleTheme, tooltipLabel } = useThemeMode();
  const { isRead } = useReadArticles();

  return (
    <div className="flex flex-col h-full w-full select-none">
      {/* 1. STICKY TOP BRAND HEADER */}
      <div className="shrink-0 px-5 py-4 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-3 group"
        >
          <SheetHubLogo className="w-7 h-7 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-display font-black text-base tracking-tight text-foreground flex items-center gap-1.5 leading-none">
              <span>SheetHub</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                DOCS
              </span>
            </span>
            <span className="text-[10px] text-muted-foreground font-mono mt-1">
              Spreadsheet Knowledge Base
            </span>
          </div>
        </Link>
      </div>

      {/* 2. SCROLLABLE MIDDLE NAVIGATION TREE */}
      <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-border overscroll-contain">
        <nav className="flex flex-col gap-6" aria-label="Documentation Sidebar Navigation">
          {DOCS_NAV.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              <h4 className="text-[11px] font-mono font-bold text-muted-foreground/70 uppercase tracking-widest px-2 mb-1">
                {section.title}
              </h4>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const itemIsRead = item.href.startsWith('/blog/') && isRead(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border-l-2 border-emerald-500 rounded-l-none"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {Icon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-70" />}
                        <span className="truncate">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {itemIsRead && (
                          <span
                            title="Completed / Read in the last 30 days"
                            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                          </span>
                        )}

                        {item.badge && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* 3. STICKY BOTTOM CONTROLS (Theme Switcher & About) */}
      <div className="shrink-0 px-4 py-3 border-t border-border/50 bg-background/95 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={cycleTheme}
          title={tooltipLabel}
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted/40"
        >
          {currentMode === "dark" ? (
            <Moon className="w-4 h-4 text-emerald-400" />
          ) : currentMode === "light" ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <SunMoon className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="capitalize text-[11px]">{currentMode}</span>
        </button>

        <Link
          href="/about"
          className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          About
        </Link>
      </div>
    </div>
  );
}
