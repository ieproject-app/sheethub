import React from "react";
import type { PostFrontmatter } from "@/lib/posts";
import type { Dictionary } from "@/lib/get-dictionary";
import { CalendarDays, Clock3 } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";

interface ArticleMetaProps {
  frontmatter: PostFrontmatter;
  dictionary?: Dictionary;
  readingTime?: number;
  isOverlay?: boolean;
  isCentered?: boolean;
}

export function ArticleMeta({
  frontmatter,
  readingTime,
  isCentered = false,
}: ArticleMetaProps) {
  const authorName = "SheetHub";
  const displayDate = frontmatter.updated || frontmatter.date;
  const isUpdated = !!frontmatter.updated;

  const relativeTimeStr = formatRelativeTime(new Date(displayDate));
  const timeLabel = isUpdated ? "Updated " : "";
  const compactDateStr = new Date(displayDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const compactTimeLabel = isUpdated ? "Upd. " : "";

  return (
    <div className="pt-2">
      <div
        className={cn(
          "flex items-center gap-x-3 gap-y-1.5 flex-wrap text-xs sm:text-sm font-medium text-muted-foreground",
          isCentered ? "justify-center" : "justify-start"
        )}
      >
        <span className="text-foreground font-bold">{authorName}</span>
        <span className="opacity-30">•</span>
        <time className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 opacity-70" />
          <span className="hidden sm:inline">
            {timeLabel}
            {relativeTimeStr}
          </span>
          <span className="sm:hidden">
            {compactTimeLabel}
            {compactDateStr}
          </span>
        </time>
        {readingTime && (
          <>
            <span className="opacity-30">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 opacity-70" />
              <span>{readingTime} min</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
}
