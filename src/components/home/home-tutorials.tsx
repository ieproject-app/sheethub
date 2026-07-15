'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RelativeTime } from '@/components/ui/relative-time';
import { AddToReadingListButton } from '@/components/layout/add-to-reading-list-button';
import type { Dictionary } from '@/lib/get-dictionary';
import { CategoryBadge } from '@/components/layout/category-badge';
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

interface HomeTutorialsProps {
  posts: SliderPost[];
  title: string;
  viewMoreText: string;
  dictionary: Dictionary;
  tag?: string;
}

export function HomeTutorials({ posts, title, viewMoreText, dictionary, tag }: HomeTutorialsProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    setScrollSnaps(api.scrollSnapList());
    onSelect();

    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  const viewMoreHref = tag ? `/tags/${tag.toLowerCase()}` : '/blog';

  if (posts.length === 0) return null;

  return (
    <section className="pb-12 sm:pb-16 overflow-hidden">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Left Aligned */}
        <ScrollReveal direction="left">
          <div className="mb-8 text-left">
            <h2 className="text-sm font-medium font-display text-primary mb-2 italic">
              {title}
            </h2>
            <div className="w-full h-0.5 bg-[linear-gradient(to_right,#0078D4,#E95420,transparent)]" />
          </div>
        </ScrollReveal>

        {/* Slider */}
        <ScrollReveal direction="up" delay={0.2}>
          <Carousel
            setApi={setApi}
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
                  <CarouselItem key={post.slug} className="pl-4 sm:pl-6 md:basis-1/2 lg:basis-1/3 pb-6 pt-2 flex">
                    <article className={cn(
                      "relative bg-card rounded-lg border border-primary/5 transition-all duration-500 h-full flex flex-col group/card overflow-hidden shadow-md ring-1 ring-transparent",
                      "hover:-translate-y-1.5 hover:border-primary/10",
                      "dark:shadow-black/40",
                      multicolor.hoverRing,
                      multicolor.hoverShadow,
                    )}>
                      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
                        {/* Gradient header with first letter — 8:5 (shorter) */}
                        <div className={cn(
                          "relative aspect-[8/5] bg-gradient-to-b flex items-center justify-center overflow-hidden",
                          multicolor.gradient,
                        )}>
                          <div className={cn(
                            "absolute inset-0 bg-linear-to-t opacity-0 transition-opacity duration-500 group-hover/card:opacity-100",
                            multicolor.overlayGradient,
                          )} />
                          <div className={cn("absolute bottom-0 left-0 right-0 h-0.75 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100", multicolor.accentBar)} />
                          <span className="font-display text-5xl sm:text-6xl font-extrabold text-white/95 tracking-tight">
                            {firstLetter || "T"}
                          </span>
                          <AddToReadingListButton
                            item={item}
                            dictionary={dictionary}
                            showText={false}
                            className="absolute top-2 right-2 z-10 text-white bg-black/25 hover:bg-black/45 hover:text-white opacity-0 group-hover/card:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="mb-2">
                            <CategoryBadge category={post.frontmatter.category || 'Featured'} />
                          </div>
                          <h3 className={cn('font-display text-base font-semibold text-primary leading-snug transition-colors mb-2', multicolor.hoverTitle)}>
                            {post.frontmatter.title}
                          </h3>
                          <RelativeTime
                            date={post.frontmatter.date}
                            className="text-[10px] text-muted-foreground block font-semibold mt-auto"
                          />
                        </div>
                      </Link>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  disabled={!canScrollPrev}
                  className="h-8 w-8 rounded-full border border-primary/20 text-primary/70 hover:text-primary hover:border-primary/40 disabled:opacity-35 disabled:cursor-not-allowed inline-flex items-center justify-center transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                      type="button"
                      onClick={() => api?.scrollTo(index)}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        index === selectedIndex
                          ? 'w-4 bg-primary/70'
                          : 'w-1.5 bg-primary/25 hover:bg-primary/40',
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  disabled={!canScrollNext}
                  className="h-8 w-8 rounded-full border border-primary/20 text-primary/70 hover:text-primary hover:border-primary/40 disabled:opacity-35 disabled:cursor-not-allowed inline-flex items-center justify-center transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <Link
                href={viewMoreHref}
                className="group inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
              >
                <span>{viewMoreText}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
}
