
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
import { ChevronRight } from 'lucide-react';
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

interface FeatureSliderProps {
  posts: SliderPost[];
  title: string;
  viewMoreText: string;
  locale: string;
  tag?: string;
}

export function FeatureSlider({ posts, title, viewMoreText, locale, tag }: FeatureSliderProps) {
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
  const viewMoreHref = tag ? `${linkPrefix}/tags/${tag.toLowerCase()}` : `${linkPrefix}/blog`;

  return (
    <section className="pb-12 sm:pb-16 overflow-hidden">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Left Aligned */}
        <div className="mb-8 text-left">
          <h2 className="text-sm font-medium font-headline text-primary mb-2 italic">
            {title}
          </h2>
          <div className="w-12 h-1 bg-accent rounded-full" />
        </div>

        {/* Slider */}
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: false, 
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 sm:-ml-6">
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
                <CarouselItem key={post.slug} className="pl-4 sm:pl-6 md:basis-1/2 lg:basis-1/3 py-8">
                  <Link href={`${linkPrefix}/blog/${post.slug}`} className="block group h-full">
                    <article className={cn(
                        "relative bg-card rounded-xl border border-primary/5 transition-all duration-500 h-full flex flex-col group/card",
                        "hover:-translate-y-2 hover:border-primary/10",
                        "isolate", // Menghindari bayangan bocor ke atas konten
                        // Permanent Fold Shadow Effect (Pseudo-elements)
                        "before:content-[''] before:absolute before:z-[-1] before:bottom-[12px] before:left-[10px] before:w-[45%] before:h-[15%] before:shadow-[0_15px_10px_rgba(0,0,0,0.4)] before:rotate-[-3deg] before:transition-all before:duration-500 before:bg-transparent before:pointer-events-none",
                        "after:content-[''] after:absolute after:z-[-1] after:bottom-[12px] after:right-[10px] after:w-[45%] after:h-[15%] after:shadow-[0_15px_10px_rgba(0,0,0,0.4)] after:rotate-[3deg] after:transition-all after:duration-500 after:bg-transparent after:pointer-events-none",
                        // Dark mode depth adjustments
                        "dark:before:shadow-[0_15px_15px_rgba(0,0,0,0.7)] dark:after:shadow-[0_15px_15px_rgba(0,0,0,0.7)]",
                        // Response when card lifts
                        "group-hover:before:bottom-[15px] group-hover:before:shadow-[0_20px_15px_rgba(0,0,0,0.25)]",
                        "group-hover:after:bottom-[15px] group-hover:after:shadow-[0_20px_15px_rgba(0,0,0,0.25)]"
                    )}>
                      {/* Image container with its own rounded corner clip */}
                      <div className="relative aspect-video overflow-hidden rounded-t-xl z-10">
                        <Image
                          src={heroImageSrc}
                          alt={post.frontmatter.imageAlt || post.frontmatter.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                          data-ai-hint={heroImageHint}
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col z-10">
                        <span className="text-[10px] font-bold tracking-widest text-accent mb-2 block">
                          {post.frontmatter.category || 'Featured'}
                        </span>
                        <h3 className="font-headline text-base font-semibold text-primary leading-snug group-hover:text-accent transition-colors">
                          {post.frontmatter.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Controls & Custom "View More" Style */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-6 bg-muted/30 px-5 py-2.5 rounded-full border border-primary/5">
              <div className="flex items-center gap-2 pr-4 border-r border-primary/10">
                <div className="h-1.5 w-8 bg-accent rounded-full" />
                <div className="h-1.5 w-1.5 bg-primary/20 rounded-full" />
                <div className="h-1.5 w-1.5 bg-primary/20 rounded-full" />
              </div>

              <Link 
                href={viewMoreHref} 
                className="text-sm font-bold text-primary/80 hover:text-primary transition-all flex items-center gap-2 group/more"
              >
                {viewMoreText}
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover/more:translate-x-1" />
              </Link>
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
