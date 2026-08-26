'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Bell } from 'lucide-react';
import type { Dictionary } from '@/lib/get-dictionary';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { FormulaCard } from '@/components/cards/formula-card';
import type { Post } from '@/lib/posts';

interface SliderPost {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    heroImage?: string;
    imageAlt?: string;
    category?: string;
    date: string;
    tags?: string[];
  };
}

interface HomeUpdatesProps {
  posts: SliderPost[];
  title: string;
  viewMoreText: string;
  dictionary: Dictionary;
  tag?: string;
  viewMoreHref?: string;
}

export function HomeUpdates({ posts, title, viewMoreText, dictionary, tag, viewMoreHref }: HomeUpdatesProps) {
  const finalViewMoreHref = viewMoreHref || (tag ? `/tags/${tag.toLowerCase()}` : '/blog');

  if (posts.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-muted/10 border-t border-border/50">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border/60">
          <ScrollReveal direction="left">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Changelogs & Features</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
              {title}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <Link
              href={finalViewMoreHref}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors group"
            >
              <span>{viewMoreText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Carousel / Grid */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post) => (
              <FormulaCard
                key={post.slug}
                post={post as unknown as Post}
                dictionary={dictionary}
                variant="default"
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
