"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { Dictionary } from "@/lib/get-dictionary";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { FormulaCard } from "@/components/cards/formula-card";
import type { Post } from "@/lib/posts";

interface TopicPost {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    category?: string;
    date: string;
    heroImage?: string;
    imageAlt?: string;
    tags?: string[];
  };
}

interface HomeTopicsProps {
  posts: TopicPost[];
  title: string;
  viewAllText: string;
  dictionary: Dictionary;
  tag: string;
  viewAllHref?: string;
}

export function HomeTopics({
  posts,
  title,
  viewAllText,
  tag,
  viewAllHref,
}: HomeTopicsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border/60">
        <ScrollReveal direction="left">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Highlights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
            {title}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <Link
            href={viewAllHref || `/tags/${tag.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors group"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </div>

      {/* Modern 2-column horizontal stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post, index) => (
          <ScrollReveal key={post.slug} direction="up" delay={index * 0.05}>
            <FormulaCard
              post={post as unknown as Post}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
