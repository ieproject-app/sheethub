"use client";

import Link from "next/link";
import { Hash } from "lucide-react";

interface ArticleTagsProps {
  tags: string[];
  linkPrefix?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function ArticleTags({
  tags,
  linkPrefix = "",
}: ArticleTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="w-full mt-10 pt-6 border-t border-border/40">
      <div className="flex items-center gap-2 mb-3">
        <Hash className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          Article Topics
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`${linkPrefix}/tags/${encodeURIComponent(tag.toLowerCase())}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/40 hover:bg-muted text-foreground/80 hover:text-foreground text-xs font-mono border border-border/50 transition-colors"
          >
            <span>#{tag}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
