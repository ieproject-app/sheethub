import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, CheckCircle2, BookOpen } from "lucide-react";
import type { Post } from "@/lib/posts";

interface HomeClientProps {
  initialPosts: Post[];
}

const MODULES = [
  {
    number: "01",
    title: "Module 1: Spreadsheet Fundamentals & Core Logic",
    description: "Learn cell references (A1 vs $A$1), custom number formats, date calculations, and data validation rules.",
    tutorials: [
      { title: "Data Validation & Dropdown Rules", href: "/blog/data-validation-dropdown-guide", tag: "Excel & Sheets" },
      { title: "Excel Date & Time Functions Guide", href: "/blog/excel-date-time-functions-guide", tag: "Functions" },
      { title: "Custom Number Formats Complete Guide", href: "/blog/excel-custom-number-formats-guide", tag: "Formatting" },
      { title: "Data Cleaning Techniques in Excel", href: "/blog/excel-data-cleaning-techniques-guide", tag: "Cleaning" },
    ],
  },
  {
    number: "02",
    title: "Module 2: Essential Lookups, Logic & Conditional Analysis",
    description: "Master modern search functions, multi-criteria aggregations, and dynamic conditional styling.",
    tutorials: [
      { title: "XLOOKUP Complete Master Guide", href: "/blog/xlookup-complete-guide", tag: "M365 Core" },
      { title: "COUNTIF & COUNTIFS Multi-Criteria Guide", href: "/blog/countif-countifs-guide", tag: "Aggregation" },
      { title: "Conditional Formatting with Custom Formulas", href: "/blog/conditional-formatting-guide", tag: "Rules" },
      { title: "Dependent Multi-Level Dropdowns", href: "/blog/excel-dependent-dropdown-guide", tag: "UX" },
    ],
  },
  {
    number: "03",
    title: "Module 3: Dynamic Arrays & Modern Formula Engines",
    description: "Harness modern calculation engines that spill results automatically without dragging formulas.",
    tutorials: [
      { title: "Excel Dynamic Array Functions (FILTER, SORT, UNIQUE)", href: "/blog/excel-dynamic-array-functions-guide", tag: "Spill Engine" },
      { title: "ARRAYFORMULA in Google Sheets Complete Guide", href: "/blog/arrayformula-google-sheets-complete-guide", tag: "Sheets Engine" },
    ],
  },
  {
    number: "04",
    title: "Module 4: AI Copilot & Automated Prompting",
    description: "Leverage AI agents and Copilot modes to write, debug, and generate complex spreadsheet models.",
    tutorials: [
      { title: "Excel Copilot Agent Mode Guide", href: "/blog/excel-agent-mode-copilot-guide", tag: "Agent Mode" },
      { title: "AI Prompt Engineering for Excel Formulas", href: "/blog/ai-excel-formulas-prompt-guide", tag: "Prompting" },
      { title: "Formula Completion with Copilot AI", href: "/blog/excel-formula-completion-copilot-guide", tag: "AI Assistant" },
    ],
  },
  {
    number: "05",
    title: "Module 5: Debugging, Error Resolution & Optimization",
    description: "Diagnose formula errors (#CALC!, #VALUE!), resolve floating-point arithmetic quirks, and boost workbook speed.",
    tutorials: [
      { title: "Evaluate Formula Tool & Step-by-Step Debugging", href: "/blog/excel-evaluate-formula-debugging-guide", tag: "Debugging" },
      { title: "How to Fix #CALC! Dynamic Array Errors", href: "/blog/excel-calc-error-dynamic-array-guide", tag: "Error Fix" },
      { title: "Floating-Point Precision Errors in Spreadsheets", href: "/blog/excel-floating-point-errors-guide", tag: "Math Logic" },
      { title: "Workbook Performance & Calculation Diagnostics", href: "/blog/excel-check-performance-guide", tag: "Performance" },
    ],
  },
];

export function HomeClient({ initialPosts }: HomeClientProps) {
  return (
    <div className="w-full flex flex-col gap-10 pb-12">
      {/* Onboarding Hero / Start Here Section */}
      <section className="p-6 sm:p-8 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          <Compass className="w-4 h-4" />
          <span>Learning Pathway • Start Here</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          Where to Start Learning Modern Spreadsheets?
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
          Welcome to the <strong>SheetHub Documentation Hub</strong>. Whether you are building financial models in Microsoft Excel or automating cloud dashboards in Google Sheets, follow our structured 5-module curriculum below to go from core fundamentals to AI-driven automation.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/blog/xlookup-complete-guide"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-xs sm:text-sm hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <span>Start with XLOOKUP</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/80 text-foreground font-medium text-xs sm:text-sm hover:bg-muted transition-colors"
          >
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span>Browse All {initialPosts.length} Guides</span>
          </Link>
        </div>
      </section>

      {/* Curriculum Modules */}
      <section className="flex flex-col gap-8">
        <div className="border-b border-border/60 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Structured Learning Modules
          </h2>
          <span className="text-xs font-mono text-muted-foreground/60">5 Modules • 90+ Topics</span>
        </div>

        <div className="flex flex-col gap-8">
          {MODULES.map((mod) => (
            <div
              key={mod.number}
              className="flex flex-col gap-4 p-5 sm:p-6 rounded-xl border border-border/60 bg-card/40 transition-colors hover:border-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-border/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {mod.number}
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {mod.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {mod.description}
              </p>

              {/* Module Tutorials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                {mod.tutorials.map((tut) => (
                  <Link
                    key={tut.href}
                    href={tut.href}
                    className="group flex items-center justify-between gap-3 p-3 rounded-lg border border-border/50 bg-background/80 hover:bg-muted/40 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500/70 shrink-0" />
                      <span className="text-xs font-semibold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                        {tut.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground shrink-0">
                      {tut.tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
