"use client";

import React from "react";
import { FormulaExplorer } from "@/components/home/home-formula-matrix";
import type { Post } from "@/lib/posts";
import dictionary from "@/dictionaries/en.json";

export function BlogListClient({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className="mb-6 border-b border-border/40 pb-4">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
          Formula & Tutorial Archive
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Explore all {initialPosts.length} tutorials and formula breakdowns.
        </p>
      </header>

      <FormulaExplorer posts={initialPosts} dictionary={dictionary} />
    </div>
  );
}
