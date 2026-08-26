"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { AddToReadingListButton } from "@/components/layout/add-to-reading-list-button";
import type { Post } from "@/lib/posts";
import type { Dictionary } from "@/lib/get-dictionary";
import { ArrowUpRight, Clock } from "lucide-react";

interface FormulaCardProps {
  post: Post;
  dictionary?: Dictionary;
  showExcerpt?: boolean;
  variant?: string;
}

// Smart formula signature extraction
function getFormulaSignature(post: Post) {
  const title = (post.frontmatter.title || "").toLowerCase();
  const tags = (post.frontmatter.tags || []).map((t) => t.toLowerCase());

  const isSheets = tags.includes("google-sheets") || title.includes("google sheets") || title.includes("sheets");
  const isExcel = tags.includes("excel") || title.includes("excel") || !isSheets;
  const isAi = tags.includes("ai") || title.includes("copilot") || title.includes("ai");

  const appName = isSheets ? "Google Sheets" : isExcel ? "Excel" : "Spreadsheet";
  const appColor = isSheets
    ? "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20"
    : isExcel
    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
    : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";

  let formula = "=ARRAYFORMULA(...)";
  if (title.includes("xlookup")) formula = "=XLOOKUP(...)";
  else if (title.includes("vlookup")) formula = "=VLOOKUP(...)";
  else if (title.includes("index") && title.includes("match")) formula = "=INDEX(..., MATCH(...))";
  else if (title.includes("countif")) formula = "=COUNTIFS(...)";
  else if (title.includes("sumifs") || title.includes("sumif")) formula = "=SUMIFS(...)";
  else if (title.includes("query")) formula = `=QUERY(...)`;
  else if (title.includes("filter")) formula = "=FILTER(...)";
  else if (title.includes("copilot") || title.includes("agent")) formula = "AI Copilot Prompt";
  else if (title.includes("date") || title.includes("time")) formula = "=EDATE() / =TODAY()";
  else if (title.includes("dropdown") || title.includes("validation")) formula = "Data Validation";
  else if (title.includes("conditional formatting")) formula = "=MOD(ROW(),2)=0";
  else if (title.includes("dynamic array")) formula = "=UNIQUE(SORT(...))";
  else {
    const firstWord = post.frontmatter.title.split(" ")[0];
    formula = firstWord && firstWord.length > 2 ? `=${firstWord.toUpperCase()}(...)` : "=FORMULA(...)";
  }

  return { appName, appColor, formula, isSheets, isExcel, isAi };
}

export function FormulaCard({
  post,
  dictionary,
  showExcerpt = true,
}: FormulaCardProps) {
  const meta = getFormulaSignature(post);

  const readingItem = {
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    href: `/blog/${post.slug}`,
    type: "blog" as const,
  };

  return (
    <article className="group relative flex flex-col h-full rounded-xl border border-border/70 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-md">
      {/* Header Pill & Formula Chip */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn("text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border", meta.appColor)}>
            {meta.appName}
          </span>
          <code className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/60 text-foreground/80 border border-border/50 truncate max-w-[140px]">
            {meta.formula}
          </code>
        </div>

        {dictionary && (
          <AddToReadingListButton
            item={readingItem}
            dictionary={dictionary}
            showText={false}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
          />
        )}
      </div>

      {/* Title */}
      <Link href={`/blog/${post.slug}`} className="block mb-2">
        <h3 className="font-display text-base font-bold tracking-tight text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
          {post.frontmatter.title}
        </h3>
      </Link>

      {/* Excerpt */}
      {showExcerpt && post.frontmatter.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
          {post.frontmatter.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-muted-foreground/60" />
          <time dateTime={post.frontmatter.date}>
            {formatRelativeTime(new Date(post.frontmatter.date))}
          </time>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Explore</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}

export const EditorialPostItem = FormulaCard;
