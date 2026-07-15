"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AddToReadingListButton } from "@/components/layout/add-to-reading-list-button";
import type { Dictionary } from "@/lib/get-dictionary";
import { cn } from "@/lib/utils";
import { getMulticolorSeed, getMulticolorTheme } from "@/lib/multicolor";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface TopicPost {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    category?: string;
    date: string;
    heroImage?: string;
    imageAlt?: string;
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
  dictionary,
  tag,
  viewAllHref,
}: HomeTopicsProps) {
  const renderHorizontalCard = (post: TopicPost, index: number) => {
    const firstLetter = post.frontmatter.title.trim().charAt(0).toUpperCase();
    const multicolor = getMulticolorTheme(
      getMulticolorSeed(post.slug, post.frontmatter.category, post.frontmatter.title),
    );

    const item = {
      slug: post.slug,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      href: `/blog/${post.slug}`,
      type: "blog" as const,
    };

    return (
      <ScrollReveal key={post.slug} direction="up" delay={index * 0.1}>
        <div className="group relative flex items-center gap-4 py-3 border-b border-primary/5 transition-all duration-300">
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-4 flex-1 min-w-0"
          >
            {/* First-letter gradient box instead of image/icon */}
            <div className={cn(
              "shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm",
              multicolor.gradient,
            )}>
              <span className="font-display text-lg font-extrabold text-white">
                {firstLetter || "S"}
              </span>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="font-display text-[15px] sm:text-base font-medium text-primary leading-snug transition-colors group-hover:text-accent">
                {post.frontmatter.title}
              </h3>
            </div>
          </Link>
          <AddToReadingListButton
            item={item}
            dictionary={dictionary}
            showText={false}
            className="shrink-0 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity"
          />
        </div>
      </ScrollReveal>
    );
  };

  if (posts.length === 0) return null;

  return (
    <section
      className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 overflow-hidden"
    >
      <ScrollReveal direction="left">
        <div className="mb-8 text-left">
          <h2 className="text-sm font-medium font-display text-primary mb-2 italic">
            {title}
          </h2>
          <div className="w-full h-0.5 bg-[linear-gradient(to_right,#0078D4,#E95420,transparent)]" />
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        {posts.map((post, index) => renderHorizontalCard(post, index))}
      </div>

      <ScrollReveal direction="up" delay={0.3}>
        <footer className="mt-10 flex justify-center">
          <Link
            href={viewAllHref || `/tags/${tag.toLowerCase()}`}
            className="flex items-center gap-2 bg-accent/5 px-3 py-1.5 rounded-full border border-accent/30 hover:bg-accent/10 transition-all group"
          >
            <div className="flex items-center gap-1 pr-2.5 border-r border-accent/20">
              <div className="h-1 w-5 bg-accent rounded-full" />
              <div className="h-0.75 w-0.75 bg-accent rounded-full" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-accent/90 group-hover:text-accent transition-all flex items-center gap-1">
              {viewAllText}
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </footer>
      </ScrollReveal>
    </section>
  );
}
