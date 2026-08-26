"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialPostItem } from "@/components/cards/formula-card";
import type { Post, PostFrontmatter } from "@/lib/posts";
import type { Dictionary } from "@/lib/get-dictionary";

interface HomeLatestProps {
  posts: Post<PostFrontmatter>[];
  dictionary: Dictionary;
}

export const HomeLatest = ({ posts, dictionary }: HomeLatestProps) => {
  if (posts.length === 0) return null;

  return (
    <section className="w-full py-8">
      <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-border/40">
        <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          Latest Publications
        </h2>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs font-mono text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          <span>View Archive</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex flex-col">
        {posts.map((post) => (
          <EditorialPostItem
            key={post.slug}
            post={post as unknown as Post}
            dictionary={dictionary}
          />
        ))}
      </div>
    </section>
  );
};
