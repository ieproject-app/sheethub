"use client";

import React from "react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getMulticolorSeed, getMulticolorTheme } from "@/lib/multicolor";
import type { Post } from "@/lib/posts";

export function BlogListClient({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  const visiblePosts = initialPosts;

  return (
    <div className="w-full">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pb-24">
        <header className="mb-12 text-center">
          <h1 className="font-display text-h1 font-extrabold tracking-tighter text-primary mb-4">
            Blog
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
            Tutorials, formula guides, and practical tips for Excel and Google Sheets.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary/45">
            {initialPosts.length} articles published
          </p>
        </header>

        {visiblePosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No articles yet. Coming soon!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePosts.map((post) => {
                const firstLetter = post.frontmatter.title.trim().charAt(0).toUpperCase();
                const multicolor = getMulticolorTheme(
                  getMulticolorSeed(post.slug, post.frontmatter.category, post.frontmatter.title),
                );

                return (
                  <Link
                    key={post.slug}
                    href={"/blog/" + post.slug}
                    className="group block"
                  >
                    <div className={cn(
                      "h-full rounded-2xl border border-primary/5 bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl overflow-hidden",
                      multicolor.hoverRing,
                      multicolor.hoverShadow,
                    )}>
                      {/* First-letter gradient header */}
                      <div className={cn(
                        "relative aspect-[8/5] bg-gradient-to-b flex items-center justify-center",
                        multicolor.gradient,
                      )}>
                        <div className={cn("absolute inset-0 bg-linear-to-t opacity-0 transition-opacity duration-500 group-hover:opacity-100", multicolor.overlayGradient)} />
                        <div className={cn("absolute bottom-0 left-0 right-0 h-0.75 opacity-0 transition-opacity duration-500 group-hover:opacity-100", multicolor.accentBar)} />
                        <span className="font-display text-5xl sm:text-6xl font-extrabold text-white/95 tracking-tight">
                          {firstLetter || "S"}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col gap-3">
                        {post.frontmatter.category && (
                          <span className="text-xs font-medium uppercase tracking-wider text-primary/60">
                            {post.frontmatter.category}
                          </span>
                        )}
                        <h2 className={cn("font-display text-lg font-bold tracking-tight text-primary line-clamp-2 transition-colors", multicolor.hoverTitle)}>
                          {post.frontmatter.title}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.frontmatter.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/60 mt-auto pt-2">
                          <time dateTime={post.frontmatter.date}>
                            {formatRelativeTime(new Date(post.frontmatter.date))}
                          </time>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

          </>
        )}
      </main>
    </div>
  );
}
