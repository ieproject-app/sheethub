"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { EditorialPostItem } from "@/components/cards/formula-card";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/lib/get-dictionary";
import type { Post } from "@/lib/posts";

type RelatedContentItem = {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    tags?: string[];
    category?: string;
    heroImage?: string;
    imageAlt?: string;
  };
};

type ArticleRelatedProps = {
  type: "blog" | "note";
  currentSlug: string;
  currentTags?: string[];
  currentCategory?: string;
  initialRelatedContent: RelatedContentItem[];
  dictionary: Dictionary;
};

export function ArticleRelated({
  currentSlug,
  currentTags = [],
  currentCategory,
  initialRelatedContent,
  dictionary,
}: ArticleRelatedProps) {
  const normalizedCurrentTags = useMemo(
    () => Array.from(new Set(currentTags.map((tag) => tag.toLowerCase().trim()).filter(Boolean))),
    [currentTags],
  );
  const normalizedCurrentCategory = currentCategory?.toLowerCase().trim();

  // Related scoring
  const allRelated = useMemo(() => {
    const scored = initialRelatedContent
      .filter((item) => item.slug !== currentSlug)
      .map((item) => {
        let score = 0;
        const itemTags = (item.frontmatter.tags || []).map((t) => t.toLowerCase().trim());
        const itemCategory = item.frontmatter.category?.toLowerCase().trim();

        if (normalizedCurrentCategory && itemCategory === normalizedCurrentCategory) {
          score += 4;
        }

        const shared = itemTags.filter((t) => normalizedCurrentTags.includes(t));
        score += shared.length * 3;

        return {
          ...item,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 3);
  }, [currentSlug, initialRelatedContent, normalizedCurrentCategory, normalizedCurrentTags]);

  if (allRelated.length === 0) return null;

  return (
    <section className="w-full mt-12 pt-8 border-t border-border/40">
      <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-border/40">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">
          Recommended Reading
        </h3>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs font-mono text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          <span>All Articles</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex flex-col">
        {allRelated.map((item) => (
          <EditorialPostItem
            key={item.slug}
            post={item as unknown as Post}
            dictionary={dictionary}
            showExcerpt={false}
          />
        ))}
      </div>
    </section>
  );
}
