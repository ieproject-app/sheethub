"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RelativeTime } from "@/components/ui/relative-time";
import { AddToReadingListButton } from "@/components/layout/add-to-reading-list-button";
import { CategoryBadge } from "@/components/layout/category-badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getMulticolorSeed, getMulticolorTheme } from "@/lib/multicolor";
import type { Post, PostFrontmatter } from "@/lib/posts";
import type { Dictionary } from "@/lib/get-dictionary";

interface HomeLatestProps {
    posts: Post<PostFrontmatter>[];
    dictionary: Dictionary;
}

export const HomeLatest = ({
    posts,
    dictionary,
}: HomeLatestProps) => {
    const renderLatestCard = (post: Post<PostFrontmatter>, index: number) => {
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
                <div className="group relative transition-all duration-500 hover:-translate-y-1">
                    <Link
                        href={`/blog/${post.slug}`}
                        className="block"
                        aria-label={`Read more about ${post.frontmatter.title}`}
                    >
                        {/* First-letter gradient card header — 8:5 (shorter) */}
                        <div className={cn(
                            "relative w-full aspect-[8/5] overflow-hidden rounded-xl mb-4 shadow-sm transition-all duration-500 border border-primary/5 ring-1 ring-transparent flex items-center justify-center bg-gradient-to-b",
                            multicolor.gradient,
                            multicolor.hoverRing,
                            multicolor.hoverShadow,
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
                                className="absolute top-3 right-3 z-10 text-white bg-black/25 hover:bg-black/45 hover:text-white opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity"
                            />
                        </div>

                        <div className="mb-2">
                            <CategoryBadge category={post.frontmatter.category} />
                        </div>
                        <h3 className={cn("font-display text-lg sm:text-base font-semibold tracking-tight text-primary transition-colors leading-tight mb-2", multicolor.hoverTitle)}>
                            {post.frontmatter.title}
                        </h3>
                        <RelativeTime
                            date={post.frontmatter.date}
                            className="text-[10px] font-medium text-muted-foreground block opacity-60"
                        />
                    </Link>
                </div>
            </ScrollReveal>
        );
    };

    if (posts.length === 0) return null;

    return (
        <section className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden">
            <ScrollReveal direction="up">
                <h2 className="text-3xl font-bold font-display tracking-tighter text-primary mb-10 text-center">
                    {dictionary.home.latestPosts}
                </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 mb-12">
                {posts.map((post, index) => renderLatestCard(post, index))}
            </div>
            <ScrollReveal
                delay={0.3}
                direction="up"
                className="flex justify-center"
            >
                <Link
                    href={`/blog`}
                    className="flex items-center gap-2 bg-accent/5 px-3 py-1.5 rounded-full border border-accent/30 hover:bg-accent/10 transition-all group"
                >
                    <div className="flex items-center gap-1 pr-2.5 border-r border-accent/20">
                        <div className="h-1 w-5 bg-accent rounded-full" />
                        <div className="h-0.75 w-0.75 bg-accent rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-accent/90 group-hover:text-accent transition-all flex items-center gap-1">
                        {dictionary.home.viewAllPosts}
                        <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                </Link>
            </ScrollReveal>
        </section>
    );
};
