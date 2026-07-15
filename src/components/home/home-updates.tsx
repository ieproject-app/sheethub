'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RelativeTime } from '@/components/ui/relative-time';
import { AddToReadingListButton } from '@/components/layout/add-to-reading-list-button';
import { CategoryBadge } from '@/components/layout/category-badge';
import type { Dictionary } from '@/lib/get-dictionary';
import { getMulticolorSeed, getMulticolorTheme } from '@/lib/multicolor';

import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface SliderPost {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    heroImage?: string;
    imageAlt?: string;
    category?: string;
    date: string;
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
    <section className="pb-12 sm:pb-16 overflow-hidden">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="left">
          <div className="mb-8 text-left">
            <h2 className="text-sm font-medium font-display text-primary mb-2 italic">
              {title}
            </h2>
            <div className="w-full h-0.5 bg-[linear-gradient(to_right,#0078D4,#E95420,transparent)]" />
          </div>
        </ScrollReveal>

        {/* Carousel */}
        <ScrollReveal direction="up" delay={0.2}>
          <Carousel
            opts={{
              align: 'start',
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 sm:-ml-6 items-stretch">
              {posts.map((post) => {
                const firstLetter = post.frontmatter.title.trim().charAt(0).toUpperCase();
                const multicolor = getMulticolorTheme(
                  getMulticolorSeed(post.slug, post.frontmatter.category, post.frontmatter.title),
                );

                const item = {
                  slug: post.slug,
                  title: post.frontmatter.title,
                  description: post.frontmatter.description,
                  href: `/blog/${post.slug}`,
                  type: 'blog' as const,
                };

                return (
                  <CarouselItem key={post.slug} className="pl-4 sm:pl-6 md:basis-1/2 lg:basis-1/3 py-2 flex">
                    <article
                      className={cn(
                        "group relative bg-card/80 rounded-md overflow-hidden border border-primary/10 ring-1 ring-transparent shadow-md transition-all duration-400 hover:-translate-y-1 h-full flex flex-col w-full",
                        multicolor.hoverRing,
                        multicolor.hoverShadow,
                      )}
                    >
                      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
                        {/* Gradient header with first letter */}
                        <div className={cn(
                          "relative aspect-[3/4] bg-gradient-to-b flex items-center justify-center",
                          multicolor.gradient,
                        )}>
                          <div className={cn(
                            "absolute inset-0 bg-linear-to-t opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                            multicolor.overlayGradient,
                          )} />
                          <div className={cn("absolute bottom-0 left-0 right-0 h-0.75 opacity-0 transition-opacity duration-500 group-hover:opacity-100", multicolor.accentBar)} />
                          <span className="font-display text-5xl sm:text-6xl font-extrabold text-white/95 tracking-tight">
                            {firstLetter || "S"}
                          </span>
                          <AddToReadingListButton
                            item={item}
                            dictionary={dictionary}
                            showText={false}
                            className="absolute top-2 right-2 z-10 text-white bg-black/25 hover:bg-black/45 hover:text-white opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-5 flex-1 flex flex-col">
                          <div className="mb-2 line-clamp-1">
                            <CategoryBadge category={post.frontmatter.category || 'Update'} />
                          </div>
                          <h3 className={cn("font-display text-base font-semibold text-primary leading-snug transition-colors mb-2", multicolor.hoverTitle)}>
                            {post.frontmatter.title}
                          </h3>
                          <RelativeTime
                            date={post.frontmatter.date}
                            className="text-[10px] font-semibold text-foreground/70 block mt-auto"
                          />
                        </div>
                      </Link>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Controls */}
            <div className="mt-6 flex justify-center">
              <Link
                href={finalViewMoreHref}
                className="flex items-center gap-2 bg-accent/5 px-3 py-1.5 rounded-full border border-accent/30 hover:bg-accent/10 transition-all group"
              >
                <div className="flex items-center gap-1 pr-2.5 border-r border-accent/20">
                  <div className="h-1 w-5 bg-accent rounded-full" />
                  <div className="h-0.75 w-0.75 bg-accent rounded-full" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-accent/90 group-hover:text-accent transition-all flex items-center gap-1">
                  {viewMoreText}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
}
