
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface SliderPost {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    heroImage: string;
    imageAlt?: string;
    category?: string;
    date: string;
  };
}

interface SliderAndShadowProps {
  posts: SliderPost[];
  title: string;
  viewMoreText: string;
  locale: string;
}

export function SliderAndShadow({ posts, title, viewMoreText, locale }: SliderAndShadowProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const linkPrefix = locale === 'en' ? '' : `/${locale}`;

  return (
    <section className="bg-white py-16 sm:py-24 overflow-hidden border-y border-primary/5">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Compact and aligned */}
        <div className="mb-10 text-left">
          <h2 className="text-2xl font-bold font-headline tracking-tighter text-primary inline-block relative">
            {title}
            <div className="absolute -bottom-1.5 left-0 w-10 h-1 bg-accent rounded-full" />
          </h2>
        </div>

        {/* Slider */}
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6 sm:-ml-8">
            {posts.map((post) => {
              const heroImageValue = post.frontmatter.heroImage;
              let heroImageSrc = "/images/blank/blank.webp";
              let heroImageHint = post.frontmatter.imageAlt || post.frontmatter.title;

              if (heroImageValue) {
                if (heroImageValue.startsWith('http') || heroImageValue.startsWith('/')) {
                  heroImageSrc = heroImageValue;
                } else {
                  const placeholder = PlaceHolderImages.find(p => p.id === heroImageValue);
                  if (placeholder) {
                    heroImageSrc = placeholder.imageUrl;
                    heroImageHint = placeholder.imageHint;
                  }
                }
              }

              return (
                <CarouselItem key={post.slug} className="pl-6 sm:pl-8 md:basis-1/2 lg:basis-1/3">
                  <Link href={`${linkPrefix}/blog/${post.slug}`} className="block group h-full">
                    <article className="bg-white rounded-2xl overflow-hidden shadow-[0_15px_35px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] group-hover:-translate-y-1.5 h-full flex flex-col border border-primary/5">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={heroImageSrc}
                          alt={post.frontmatter.imageAlt || post.frontmatter.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                          data-ai-hint={heroImageHint}
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 block">
                          {post.frontmatter.category || 'Featured'}
                        </span>
                        <h3 className="font-headline text-lg font-bold text-primary leading-tight line-clamp-2 mb-5 group-hover:text-accent transition-colors">
                          {post.frontmatter.title}
                        </h3>
                        <div className="mt-auto pt-4 border-t border-primary/5">
                          <p className="text-[10px] font-bold text-muted-foreground/50 tracking-wider">
                            By: <span className="text-primary/70">snipgeek.com</span>
                          </p>
                        </div>
                      </div>
                    </article>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Controls Container - Responsive and integrated */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-10">
            {/* Navigation Arrows */}
            <div className="flex items-center gap-3.5 order-2 sm:order-1">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-11 w-11 border-primary/10 bg-white text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                onClick={() => api?.scrollPrev()}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-11 w-11 border-primary/10 bg-white text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                onClick={() => api?.scrollNext()}
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Pagination Dots & More Link */}
            <div className="flex items-center gap-8 order-1 sm:order-2 bg-muted/20 px-6 py-2.5 rounded-full border border-primary/5">
              <div className="flex items-center gap-2">
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "h-1.5 transition-all duration-500 rounded-full",
                      current === i ? "w-8 bg-accent" : "w-1.5 bg-primary/10"
                    )}
                    onClick={() => api?.scrollTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              
              <div className="h-4 w-px bg-primary/10 hidden sm:block" />

              <Link 
                href={`${linkPrefix}/blog`} 
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent transition-all flex items-center gap-1.5 group/more"
              >
                {viewMoreText}
                <ChevronRight className="h-3 w-3 transition-transform group-hover/more:translate-x-1" />
              </Link>
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
