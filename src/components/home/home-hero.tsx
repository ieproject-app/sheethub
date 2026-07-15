"use client";

import * as React from "react";
import Link from "next/link";
import { Post, PostFrontmatter } from "@/lib/posts";
import { Dictionary } from "@/lib/get-dictionary";
import { cn } from "@/lib/utils";
import { RelativeTime } from "@/components/ui/relative-time";
import { AddToReadingListButton } from "@/components/layout/add-to-reading-list-button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
    CategoryBadge,
    simplifyCategoryLabel,
} from "@/components/layout/category-badge";
import { getMulticolorSeed, getMulticolorTheme } from "@/lib/multicolor";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

interface HomeHeroProps {
    posts: Post<PostFrontmatter>[];
    dictionary: Dictionary;
}

export function HomeHero({ posts, dictionary }: HomeHeroProps) {
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

        api.on("select", onSelect);
        api.on("reInit", onSelect);

        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    if (posts.length === 0) return null;

    const postData = posts.map((post, index) => {
        const rawCategory = post.frontmatter.category || "Tutorial";
        const simplifiedCategory = simplifyCategoryLabel(rawCategory);
        const multicolor = getMulticolorTheme(
            getMulticolorSeed(post.slug, simplifiedCategory, post.frontmatter.title),
        );
        const firstLetter = post.frontmatter.title.trim().charAt(0).toUpperCase();

        const item = {
            slug: post.slug,
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            href: `/blog/${post.slug}`,
            type: "blog" as const,
        };

        return { post, index, rawCategory, multicolor, item, firstLetter };
    });

    const renderGradientCard = (
        firstLetter: string,
        multicolor: ReturnType<typeof getMulticolorTheme>,
        item: { slug: string; title: string; description: string; href: string; type: "blog" },
        rawCategory: string,
        title: string,
        date: string,
        href: string,
        isDesktopGrid = false,
    ) => (
        <article className={cn(
            "relative bg-card rounded-xl border border-primary/5 transition-all duration-500 flex flex-col group/card overflow-hidden shadow-md ring-1 ring-transparent",
            "hover:-translate-y-1.5 hover:border-primary/10",
            multicolor.hoverRing,
            multicolor.hoverShadow,
            isDesktopGrid ? "" : "h-full",
        )}>
            <Link href={href} className="flex h-full flex-col" aria-label={`Read ${title}`}>
                {/* First-letter gradient — aspect-3/2 (shorter) */}
                <div className={cn(
                    "relative aspect-3/2 overflow-hidden rounded-t-xl bg-gradient-to-b flex items-center justify-center",
                    multicolor.gradient,
                )}>
                    <div className={cn("absolute inset-0 bg-linear-to-t opacity-0 transition-opacity duration-500 group-hover/card:opacity-100", multicolor.overlayGradient)} />
                    <div className={cn("absolute bottom-0 left-0 right-0 h-0.75 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100", multicolor.accentBar)} />
                    <span className="font-display text-5xl sm:text-6xl font-extrabold text-white/95 tracking-tight">
                        {firstLetter || "S"}
                    </span>
                    <AddToReadingListButton
                        item={item}
                        dictionary={dictionary}
                        showText={false}
                        className="absolute top-2 right-2 z-10 text-white bg-black/25 hover:bg-black/45 hover:text-white opacity-0 group-hover/card:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity"
                    />
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                    <div>
                        <CategoryBadge category={rawCategory} size="xs" className="shadow-sm" />
                    </div>
                    <h3 className={cn("font-display text-xl font-bold leading-snug text-primary transition-colors duration-300", multicolor.hoverTitle)}>
                        {title}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                        <RelativeTime
                            date={date}
                            className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60"
                        />
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                            multicolor.readingButtonTone,
                        )}>
                            READ <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );

    return (
        <section className="py-12 sm:py-16 bg-card border-b border-primary/5">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── MOBILE: Carousel ── */}
                <div className="sm:hidden">
                    <Carousel
                        setApi={setApi}
                        opts={{ align: "start", loop: false }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {postData.map(({ post, firstLetter, multicolor, item, rawCategory }) => (
                                <CarouselItem key={post.slug} className="pl-4 pb-4 pt-1">
                                    {renderGradientCard(firstLetter, multicolor, item, rawCategory, post.frontmatter.title, post.frontmatter.date, `/blog/${post.slug}`)}
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Carousel controls */}
                        <div className="mt-4 flex items-center gap-2">
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
                                            "h-1.5 rounded-full transition-all",
                                            index === selectedIndex
                                                ? "w-4 bg-primary/70"
                                                : "w-1.5 bg-primary/25 hover:bg-primary/40",
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
                    </Carousel>
                </div>

                {/* ── DESKTOP: 4-column staggered grid ── */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-8 items-start">
                    {postData.map(({ post, index, firstLetter, multicolor, item, rawCategory }) => {
                        const isStaggered = index % 2 !== 0;
                        return (
                            <div
                                key={post.slug}
                                className={cn(
                                    "group relative transition-all duration-500 ease-out",
                                    isStaggered && "lg:mt-10",
                                )}
                            >
                                {renderGradientCard(firstLetter, multicolor, item, rawCategory, post.frontmatter.title, post.frontmatter.date, `/blog/${post.slug}`, true)}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
