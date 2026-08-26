'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight, Calculator, ArrowRight } from 'lucide-react';
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

interface HomeTutorialsProps {
  posts: SliderPost[];
  title: string;
  viewMoreText: string;
  dictionary: Dictionary;
  tag?: string;
}

export function HomeTutorials({ posts, title, viewMoreText, dictionary, tag }: HomeTutorialsProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

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
    <section className="py-12 sm:py-16 bg-muted/20 border-y border-border/50 relative">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-border/60">
          <ScrollReveal direction="left">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>Step-by-step Knowledge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
              {title}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="right" className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
                className="h-8 w-8 rounded-lg border border-border/80 bg-background text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
                className="h-8 w-8 rounded-lg border border-border/80 bg-background text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <Link
              href={viewMoreHref}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors ml-2"
            >
              <span>{viewMoreText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollReveal>
        </div>

        {/* Carousel */}
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
              {posts.map((post) => (
                <CarouselItem
                  key={post.slug}
                  className="pl-4 sm:pl-6 md:basis-1/2 lg:basis-1/3 pb-4 pt-2 flex"
                >
                  <div className="w-full">
                    <FormulaCard
                      post={post as unknown as Post}
                      dictionary={dictionary}
                      variant="default"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </ScrollReveal>
      </div>
    </section>
  );
}
