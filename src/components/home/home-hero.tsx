import * as React from "react";
import { Post, PostFrontmatter } from "@/lib/posts";

interface HomeHeroProps {
  posts: Post<PostFrontmatter>[];
}

export function HomeHero({ posts }: HomeHeroProps) {
  const totalCount = posts.length;

  return (
    <section className="w-full pt-4 pb-6">
      <div className="flex flex-col gap-3">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium self-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive Cheatsheet & Formula Hub ({totalCount} Guides)</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          Spreadsheet Formula Explorer & Workflow Engine
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
          Quickly search, filter, and master high-impact formulas for Microsoft Excel and Google Sheets.
        </p>
      </div>
    </section>
  );
}
